import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../utils/im/image-send.js', import.meta.url), 'utf8');
const { createImageSender } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
function fixture(overrides = {}) {
    const state = { ready: true, sessionID: 1, conversationID: 'c2c_user_1' }, sent = [], notices = [];
    const sender = createImageSender({ context: () => state,
        choose: async () => ({ tempFilePaths: ['file:///a.jpg', '/b.jpg'] }),
        info: async path => ({ path, width: 100, height: 200 }),
        send: async payload => sent.push(payload), notify: text => notices.push(text), ...overrides });
    return { state, sent, notices, sender };
}
test('images send sequentially with dimensions and native file paths', async () => {
    const f = fixture(); await f.sender.select();
    assert.deepEqual(f.sent.map(p => p.imagePath), ['/a.jpg', '/b.jpg']);
    assert.equal(f.sent[0].imageWidth, 100);
});
test('album result waits for foreground and sends once after resume', async () => {
    let finish; const f = fixture({ choose: () => new Promise(resolve => { finish = resolve; }) });
    const selected = f.sender.select(); f.state.ready = false;
    finish({ tempFilePaths: ['/a.jpg'] }); await selected; assert.equal(f.sent.length, 0);
    f.state.ready = true; await f.sender.resume(); await f.sender.resume(); assert.equal(f.sent.length, 1);
});
test('account changes and unload discard delayed album results', async () => {
    for (const dispose of [false, true]) {
        let finish; const f = fixture({ choose: () => new Promise(resolve => { finish = resolve; }) });
        const pending = f.sender.select(); if (dispose) f.sender.dispose(); else f.state.sessionID++;
        finish({ tempFilePaths: ['/a.jpg'] }); await pending; await f.sender.resume(); assert.equal(f.sent.length, 0);
    }
});
test('account change during metadata read prevents submission', async () => {
    const f = fixture({ info: async path => { f.state.sessionID++; return { path }; } });
    await f.sender.select(); assert.equal(f.sent.length, 0);
});
test('cancel is silent; permission failures are actionable', async () => {
    const f = fixture({ choose: async () => { throw { errMsg: 'chooseImage:fail cancel' }; } });
    await f.sender.select(); assert.equal(f.notices.length, 0);
    const g = fixture({ choose: async () => { throw { errMsg: 'permission denied' }; } });
    await g.sender.select(); assert.equal(g.notices.length, 1);
});
test('send failures do not auto-retry, explicit retry works', async () => {
    let attempts = 0;
    const f = fixture({ send: async () => { attempts++; throw new Error('offline'); } });
    await f.sender.select(); await f.sender.resume(); assert.equal(attempts, 2);
    await f.sender.retry('/a.jpg'); assert.equal(attempts, 3);
});
test('duplicate album taps and retry clicks cannot overlap', async () => {
    let finish, count = 0;
    const f = fixture({ choose: () => { count++; return new Promise(resolve => { finish = resolve; }); } });
    const pending = f.sender.select(); await f.sender.select(); await f.sender.retry('/c.jpg');
    finish({ tempFilePaths: ['/a.jpg'] }); await pending;
    assert.equal(count, 1); assert.equal(f.sent.length, 1);
});
test('image bubble accepts remote thumbnail and preview falls back to displayed image', () => {
    const file = fs.readFileSync(new URL('../uni_modules/tuikit-atomic-x/components_compatible/MessageList/Message/ImageMessage/ImageMessage.nvue', import.meta.url), 'utf8');
    const script = file.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
    let preview;
    const context = { module: { exports: {} }, uni: { previewImage: value => { preview = value; } } };
    vm.runInNewContext(script, context);
    const c = context.module.exports;
    const page = { message: { messagePayload: { thumbImageURL: 'https://example.com/a.jpg' } }, loadingState: 'loaded', touchStartTime: 0 };
    page.imageUrl = c.computed.imageUrl.call(page); c.methods.handleImageTap.call(page);
    assert.equal(preview.urls[0], 'https://example.com/a.jpg');
});
test('chat wires an album-only picker and releases pending work on unload', async () => {
    const file = fs.readFileSync(new URL('../pages/im/chat.nvue', import.meta.url), 'utf8');
    const script = file.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
    const listeners = new Map(), sent = []; let picker;
    const context = { module: { exports: {} }, createImageSender, status: {}, profileView: {}, CustomNavbar: {}, MessageList: {}, MessageInput: {}, chatURL() {},
        uni: { getSystemInfoSync: () => ({ screenHeight: 800 }), $emit() {}, $on: (key, fn) => listeners.set(key, fn), $off: key => listeners.delete(key),
            chooseImage: options => { picker = options; }, getImageInfo: options => options.success({ path: options.src, width: 10, height: 20 }), showToast() {} } };
    vm.runInNewContext(script, context);
    const c = context.module.exports, page = c.data();
    Object.entries(c.methods).forEach(([key, fn]) => { page[key] = fn.bind(page); });
    page.imStatus = { sessionID: 1, accountSessionID: 1, status: 'ready' }; page.imReady = true;
    page.$refs = { input: { collapse() {}, sendImagePayload: async payload => sent.push(payload) } };
    c.onLoad.call(page, { conversationID: 'c2c_user_1', accountSessionID: 1 });
    page.chooseChatImages();
    assert.equal(picker.sourceType.join(','), 'album'); assert.equal(picker.count, 9);
    c.onUnload.call(page); picker.success({ tempFilePaths: ['/a.jpg'] });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(sent.length, 0); assert.equal(listeners.size, 0);
});
