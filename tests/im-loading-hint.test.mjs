import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture() {
    const file = fs.readFileSync(new URL('../pages/im/chat.nvue', import.meta.url), 'utf8');
    const script = file.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
    const timers = new Map(); let now = 0, id = 0;
    const context = { module: { exports: {} }, status: {}, profileView: {}, CustomNavbar: {}, MessageList: {}, MessageInput: {},
        setTimeout: (fn, ms) => { timers.set(++id, { fn, at: now + ms }); return id; }, clearTimeout: id => timers.delete(id),
        uni: { getSystemInfoSync: () => ({ screenHeight: 800 }), $emit() {}, $off() {} } };
    vm.runInNewContext(script, context);
    const component = context.module.exports, page = component.data();
    Object.entries(component.methods).forEach(([key, fn]) => { page[key] = fn.bind(page); });
    for (const key of ['connectionHintPending', 'chatStatusText']) Object.defineProperty(page, key, { get: () => component.computed[key].call(page) });
    Object.assign(page, { imStatus: { status: 'connecting' }, imReady: false, pageVisible: true, imStatusText: '正在连接聊天服务…' });
    const update = () => component.watch.connectionHintPending.handler.call(page, page.connectionHintPending);
    const advance = ms => { now += ms; for (const [key, timer] of timers) if (timer.at <= now) { timers.delete(key); timer.fn(); } };
    return { page, component, timers, update, advance };
}

test('connection text stays hidden until 500ms, without delaying readiness', () => {
    const f = fixture(); f.update(); f.advance(499); assert.equal(f.page.chatStatusText, '');
    f.advance(1); assert.equal(f.page.chatStatusText, '正在连接聊天服务…');
    f.page.imReady = true; f.update(); assert.equal(f.page.chatStatusText, ''); assert.equal(f.timers.size, 0);
});
test('fast login never flashes and the next wait gets a fresh delay', () => {
    const f = fixture(); f.update(); f.advance(100); f.page.imReady = true; f.update();
    f.advance(900); assert.equal(f.page.showConnectionHint, false);
    f.page.imReady = false; f.update(); f.advance(499); assert.equal(f.page.chatStatusText, '');
    f.advance(1); assert.ok(f.page.chatStatusText);
});
test('repeated connecting notifications do not postpone the deadline', () => {
    const f = fixture(); f.update(); f.advance(300); f.update();
    f.advance(200); assert.ok(f.page.chatStatusText); assert.equal(f.timers.size, 0);
});
test('errors, logged-out state and route errors are shown immediately', () => {
    for (const status of ['idle', 'kicked', 'error']) {
        const f = fixture(); f.update(); f.page.imStatus.status = status; f.page.imStatusText = '即时状态'; f.update();
        assert.equal(f.page.chatStatusText, '即时状态'); assert.equal(f.timers.size, 0);
    }
    const f = fixture(); f.update(); f.page.routeError = '登录状态已变化'; f.update();
    assert.equal(f.page.chatStatusText, '登录状态已变化'); assert.equal(f.timers.size, 0);
});
test('hide and unload cancel the timer, including before the watcher runs', () => {
    for (const hook of ['onHide', 'onUnload']) {
        const f = fixture(); f.update(); f.component[hook].call(f.page);
        f.advance(1000); assert.equal(f.timers.size, 0); assert.equal(f.page.showConnectionHint, false);
    }
});
