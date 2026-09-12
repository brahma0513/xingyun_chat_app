import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../utils/im/voice-recorder.js', import.meta.url), 'utf8');
const { createVoiceRecorder, createRecorderBridge } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const flush = () => new Promise(resolve => setImmediate(resolve));
function fixture(overrides = {}) {
    const handlers = {}, sent = [], notices = [], states = [], timers = new Map();
    let time = 0, valid = true, id = 0, starts = 0, stops = 0;
    const raw = { onStart: cb => handlers.start = cb, onStop: cb => handlers.stop = cb, onError: cb => handlers.error = cb,
        onInterruptionBegin: cb => handlers.interrupt = cb, start: () => starts++, stop: () => stops++ };
    const bridge = createRecorderBridge(raw);
    const options = { permission: async () => true, bridge: () => bridge, canRecord: () => valid,
        send: async (path, duration) => sent.push({ path, duration }), notify: text => notices.push(text), update: value => states.push(value),
        now: () => time, every: cb => { timers.set(++id, cb); return id; }, clear: key => timers.delete(key), ...overrides };
    const controller = createVoiceRecorder(options);
    return { controller, handlers, sent, notices, states, timers, options, get starts() { return starts; }, get stops() { return stops; },
        invalidate() { valid = false; }, advance(ms) { time += ms; [...timers.values()].forEach(cb => cb()); } };
}
test('hold, release and native stop send exactly one voice with seconds', async () => {
    const f = fixture(); await f.controller.start(100); f.handlers.start(); f.advance(2500);
    f.controller.release(); f.controller.release(); assert.equal(f.stops, 1);
    f.handlers.stop({ tempFilePath: '/voice.mp3' }); await flush();
    assert.deepEqual(f.sent, [{ path: '/voice.mp3', duration: 3 }]); assert.equal(f.timers.size, 0);
});
test('release before permission or native start cannot record/send later', async () => {
    let grant;
    const f = fixture({ permission: () => new Promise(resolve => { grant = resolve; }) });
    const waiting = f.controller.start(100); f.controller.release(); grant(true); await waiting;
    assert.equal(f.starts, 0);
    const g = fixture(); await g.controller.start(100); g.controller.release(); g.handlers.start();
    g.handlers.stop({ tempFilePath: '/voice.mp3' }); await flush(); assert.equal(g.sent.length, 0);
});
test('denied permission and cancelled permission requests never start', async () => {
    const f = fixture({ permission: async () => false }); await f.controller.start(100); assert.equal(f.starts, 0);
    let grant; const g = fixture({ permission: () => new Promise(resolve => { grant = resolve; }) });
    const pending = g.controller.start(100); g.controller.dispose(); grant(true); await pending; assert.equal(g.starts, 0);
});
test('slide up cancels at any duration including the final countdown', async () => {
    for (const duration of [2000, 59000]) {
        const f = fixture(); await f.controller.start(200); f.handlers.start(); f.advance(duration);
        f.controller.move(100); f.controller.release(); f.handlers.stop({ tempFilePath: '/voice.mp3' });
        await flush(); assert.equal(f.sent.length, 0); assert.equal(f.notices.length, 0);
    }
});
test('sliding back into the send area restores send intent', async () => {
    const f = fixture(); await f.controller.start(200); f.handlers.start(); f.advance(2000);
    f.controller.move(100); f.controller.move(190); f.controller.release(); f.handlers.stop({ tempFilePath: '/voice.mp3' });
    await flush(); assert.equal(f.sent.length, 1);
});
test('touch cancellation, interruption, destroy and session changes never send', async () => {
    for (const action of ['cancel', 'interrupt', 'dispose', 'invalidate']) {
        const f = fixture(); await f.controller.start(100); f.handlers.start(); f.advance(2000);
        if (action === 'interrupt') f.handlers.interrupt();
        else if (action === 'invalidate') { f.invalidate(); f.advance(100); }
        else f.controller[action]();
        f.handlers.stop({ tempFilePath: '/voice.mp3' }); await flush();
        assert.equal(f.sent.length, 0); assert.equal(f.timers.size, 0);
    }
});
test('unexpected native stop is not a send action', async () => {
    const f = fixture(); await f.controller.start(100); f.handlers.start(); f.advance(2000);
    f.handlers.stop({ tempFilePath: '/voice.mp3' }); await flush(); assert.equal(f.sent.length, 0);
});
test('under one second and missing recordings show helpful errors', async () => {
    for (const duration of [200, 2000]) {
        const f = fixture(); await f.controller.start(100); f.handlers.start(); f.advance(duration); f.controller.release();
        f.handlers.stop({}); await flush(); assert.equal(f.sent.length, 0); assert.equal(f.notices.length, 1);
    }
});
test('60 seconds auto-stops and cancelled limit never sends', async () => {
    for (const cancel of [false, true]) {
        const f = fixture(); await f.controller.start(200); f.handlers.start(); if (cancel) f.controller.move(0);
        f.advance(60000); assert.equal(f.stops, 1); f.handlers.stop({ tempFilePath: '/voice.mp3' }); await flush();
        assert.equal(f.sent.length, cancel ? 0 : 1); if (!cancel) assert.equal(f.sent[0].duration, 60);
    }
});
test('native singleton remains owned until old stop arrives, even across component remount', async () => {
    const f = fixture(); await f.controller.start(100); f.handlers.start(); f.controller.dispose();
    const next = createVoiceRecorder(f.options); await next.start(100); assert.equal(f.starts, 1);
    f.handlers.stop({ tempFilePath: '/old.mp3' }); await next.start(100); assert.equal(f.starts, 2);
    f.handlers.start(); f.advance(2000); next.release(); f.handlers.stop({ tempFilePath: '/new.mp3' }); await flush();
    assert.deepEqual(f.sent, [{ path: '/new.mp3', duration: 2 }]);
});
test('send rejection reports failure without automatic resubmission', async () => {
    let calls = 0; const f = fixture({ send: async () => { calls++; throw new Error('offline'); } });
    await f.controller.start(100); f.handlers.start(); f.advance(2000); f.controller.release();
    f.handlers.stop({ tempFilePath: '/voice.mp3' }); await flush(); assert.equal(calls, 1); assert.equal(f.notices.length, 1);
});
test('voice retry checks local files, rejects duplicate clicks and ignores stale sessions', async () => {
    const file = fs.readFileSync(new URL('../pages/im/chat.nvue', import.meta.url), 'utf8');
    const script = file.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
    for (const scenario of ['success', 'missing', 'session']) {
        let success, failure, reads = 0; const sent = [], notices = [];
        const context = { module: { exports: {} }, status: {}, profileView: {}, CustomNavbar: {}, MessageList: {}, MessageInput: {}, chatURL() {},
            createImageSender: () => ({}), plus: { io: { resolveLocalFileSystemURL(path, ok, fail) { reads++; success = ok; failure = fail; } } },
            uni: { getSystemInfoSync: () => ({ screenHeight: 800 }), $emit() {}, $on() {}, showToast: value => notices.push(value) } };
        vm.runInNewContext(script, context);
        const c = context.module.exports, page = c.data();
        Object.entries(c.methods).forEach(([key, fn]) => { page[key] = fn.bind(page); });
        page.imStatus = { sessionID: 1, accountSessionID: 1, status: 'ready' }; page.imReady = true;
        page.$refs = { input: { sendVoicePayload: async (...args) => sent.push(args) } };
        c.onLoad.call(page, { conversationID: 'c2c_user_1', accountSessionID: 1 });
        const event = { conversationID: page.conversationID, message: { messagePayload: { soundPath: '/voice.mp3', soundDuration: 3 } } };
        const pending = page._retryVoice(event); await page._retryVoice(event); assert.equal(reads, 1);
        if (scenario === 'session') page.imStatus.sessionID++;
        if (scenario === 'missing') failure(); else success();
        await pending;
        assert.equal(sent.length, scenario === 'success' ? 1 : 0);
        assert.equal(notices.length, scenario === 'missing' ? 1 : 0);
        assert.equal(page._voiceRetryBusy, false);
    }
});

test('playback toggles, background cancels pending download and destroyed component cannot play', () => {
    const file = fs.readFileSync(new URL('../uni_modules/tuikit-atomic-x/components_compatible/MessageList/Message/AudioMessage/AudioMessage.nvue', import.meta.url), 'utf8');
    const script = file.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
    const context = { module: { exports: {} }, uni: { requireNativePlugin: () => ({}), showToast() {} } };
    vm.runInNewContext(script, context);
    const methods = context.module.exports.methods; let stops = 0, plays = 0;
    const page = { playingFlag: true, touchStartTime: 0, pendingPlay: true, _isInCallNow: () => false,
        _audioPlayer: { stop: () => stops++ }, _stopWaveAnimation() {}, _handlePlay: () => plays++, soundUrl: '/voice.mp3' };
    methods.handlePlayTap.call(page); assert.equal(stops, 1);
    page.playingFlag = false; methods.handlePlayTap.call(page); assert.equal(plays, 1);
    methods._handleAppHide.call(page); assert.equal(page.pendingPlay, false); assert.equal(page._audioPaused, true);
    page._audioDestroyed = true; methods.handlePlayTap.call(page); assert.equal(plays, 1);
});
