import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const load = async file => import('data:text/javascript;base64,' + Buffer.from(fs.readFileSync(new URL(file, import.meta.url), 'utf8')).toString('base64'));
const { createReadState } = await load('../utils/im/read-state.js');
const { createUnreadMonitor } = await load('../utils/im/unread.js');
const tick = () => new Promise(resolve => setImmediate(resolve));
function fixture(clear) {
    const state = { status: 'ready', sessionID: 1 }, calls = [], errors = [];
    let foreground = true;
    const controller = createReadState({ getStatus: () => state, isForeground: () => foreground,
        clear: clear || (async id => calls.push(id)), report: error => errors.push(error) });
    const page = { pageID: 'pageA', sessionID: 1, conversationID: 'c2c_user_12' };
    return { controller, state, calls, errors, page, background() { foreground = false; controller.reset(); } };
}
test('only the visible current conversation is marked read; list selection alone does nothing', async () => {
    const f = fixture();
    f.controller.read(f.page); assert.equal(f.calls.length, 0);
    f.controller.show(f.page); await tick();
    f.controller.read({ ...f.page, conversationID: 'c2c_user_99' });
    assert.deepEqual(f.calls, ['c2c_user_12']);
    f.controller.hide(f.page); f.controller.read(f.page); assert.equal(f.calls.length, 1);
});
test('background and old login generations cannot mark new messages read', async () => {
    const f = fixture(); f.background(); f.controller.show(f.page); assert.equal(f.calls.length, 0);
    const g = fixture(); g.state.sessionID = 2;
    g.controller.show(g.page); assert.equal(g.calls.length, 0);
    g.state.status = 'idle'; g.controller.show({ ...g.page, sessionID: 2 }); assert.equal(g.calls.length, 0);
});
test('a delayed hide from a previous page does not close the current page', async () => {
    const f = fixture(); f.controller.show(f.page); await tick();
    const next = { ...f.page, pageID: 'pageB', conversationID: 'c2c_user_99' };
    f.controller.show(next); await tick(); f.controller.hide(f.page); f.controller.read(next); await tick();
    assert.deepEqual(f.calls, ['c2c_user_12', 'c2c_user_99', 'c2c_user_99']);
});
test('bursts coalesce; queued read is discarded when user leaves during a request', async () => {
    let finish, count = 0;
    const f = fixture(() => { count++; return new Promise(resolve => { finish = resolve; }); });
    f.controller.show(f.page); f.controller.read(f.page); f.controller.read(f.page);
    assert.equal(count, 1); finish(); await tick(); assert.equal(count, 2);
    f.controller.read(f.page); f.controller.hide(f.page); finish(); await tick(); assert.equal(count, 2);
});
test('failed clear remains retryable without fake local zeroing', async () => {
    let count = 0;
    const f = fixture(async () => { if (++count === 1) throw { code: 1 }; });
    f.controller.show(f.page); await tick(); assert.equal(f.errors.length, 1);
    f.controller.read(f.page); await tick(); assert.equal(count, 2);
});
test('unread refresh and clear use dedicated store; clear does not wipe total locally', async () => {
    const calls = [], values = []; let listener;
    const monitor = createUnreadMonitor({ callAPI: (raw, cb) => { calls.push(JSON.parse(raw)); cb('{"code":0}'); },
        addListener: (_, cb) => { listener = cb; }, removeListener() {}, publish: v => values.push(v) });
    const client = {}; monitor.start(client); listener('{"totalUnreadCount":8}');
    await monitor.clear('c2c_user_12'); assert.equal(values.at(-1), 8);
    listener('{"totalUnreadCount":3}'); assert.equal(values.at(-1), 3);
    monitor.refresh(); assert.equal(calls.filter(c => c.api === 'loadConversations').length, 2);
    const request = calls.find(c => c.api === 'clearConversationUnreadCount');
    assert.equal(request.params.conversationID, 'c2c_user_12');
    monitor.stop(); await assert.rejects(monitor.clear('c2c_user_12'));
});
test('chat clears route, title and profile on logout, including same-user relogin', () => {
    const file = fs.readFileSync(new URL('../pages/im/chat.nvue', import.meta.url), 'utf8');
    const script = file.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
    const context = { module: { exports: {} }, status: {}, profileView: {}, CustomNavbar: {}, MessageList: {}, MessageInput: {},
        uni: { getSystemInfoSync: () => ({ screenHeight: 800 }), $emit() {} } };
    vm.runInNewContext(script, context);
    const component = context.module.exports, page = component.data();
    Object.entries(component.methods).forEach(([name, method]) => { page[name] = method.bind(page); });
    page.imStatus = { status: 'ready', sessionID: 1, accountSessionID: 1, userID: 'user_1', sdkAppID: 1400000000 }; page.currentProfiles = { user_12: {} };
    page.conversationID = 'c2c_user_12'; page.title = '私聊';
    page.ownerAccountSession = 1;
    page.onIMStatusChange({ status: 'connecting' }); assert.equal(page.conversationID, 'c2c_user_12');
    page.onIMStatusChange(page.imStatus); assert.equal(page.ownerAccountSession, 1);
    page.onIMStatusChange({ status: 'idle', sessionID: 2, accountSessionID: 2 });
    assert.equal(page.conversationID, ''); assert.equal(page.title, '聊天');
    assert.equal(Object.keys(page.currentProfiles).length, 0);
    page.onIMStatusChange({ status: 'ready', sessionID: 3, accountSessionID: 3 });
    assert.equal(page.conversationID, ''); assert.ok(page.routeError);
    let backs = 0, retries = 0;
    page.goBack = () => { backs++; }; page.retryChat = () => { retries++; };
    page.handleChatStatusTap(); assert.equal(backs, 1); assert.equal(retries, 0);
    const list = fs.readFileSync(new URL('../uni_modules/tuikit-atomic-x/components_compatible/ConversationList/ConversationList.nvue', import.meta.url), 'utf8');
    assert.doesNotMatch(list.match(/handleConversationTap\(conversation\) \{([\s\S]*?)async handlePin/)[1], /clearConversationUnreadCount/);
});
test('resuming a page waits for fresh App status and background blocks readiness', async () => {
    const mixin = (await load('../utils/im/page-status.js')).default;
    const handlers = new Map();
    globalThis.uni = { $on: (name, cb) => handlers.set(name, cb), $off: name => handlers.delete(name), $emit() {} };
    try {
        const page = mixin.data(); mixin.onLoad.call(page); mixin.onShow.call(page);
        assert.equal(mixin.computed.imReady.call(page), false);
        handlers.get('im:status')({ status: 'ready', foreground: true, sessionID: 1 });
        assert.equal(mixin.computed.imReady.call(page), true);
        mixin.onHide.call(page); mixin.onShow.call(page);
        assert.equal(mixin.computed.imReady.call(page), false);
        handlers.get('im:status')({ status: 'ready', foreground: false, sessionID: 1 });
        assert.equal(mixin.computed.imReady.call(page), false);
        mixin.onUnload.call(page); assert.equal(handlers.size, 0);
    } finally { delete globalThis.uni; }
});

function chatFixture() {
    const file = fs.readFileSync(new URL('../pages/im/chat.nvue', import.meta.url), 'utf8');
    const script = file.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
    const context = { module: { exports: {} }, status: {}, profileView: {}, CustomNavbar: {}, MessageList: {}, MessageInput: {},
        uni: { getSystemInfoSync: () => ({ screenHeight: 800 }), $emit() {} } };
    vm.runInNewContext(script, context);
    const component = context.module.exports, page = component.data();
    Object.entries(component.methods).forEach(([name, method]) => { page[name] = method.bind(page); });
    page.imStatus = { status: 'ready', sessionID: 1, accountSessionID: 1, userID: 'user_1', sdkAppID: 1400000000 };
    page.conversationID = 'c2c_user_12'; page.title = '私聊'; page.currentProfiles = { user_12: {} };
    page.ownerAccountSession = 1;
    page.onIMStatusChange(page.imStatus);
    return page;
}

test('same-account credential refresh, error/retry and background resume keep the chat route', () => {
    const page = chatFixture();
    for (const status of ['connecting', 'error', 'kicked', 'connecting', 'ready']) {
        page.onIMStatusChange({ ...page.imStatus, status, sessionID: 10 });
        assert.equal(page.conversationID, 'c2c_user_12'); assert.equal(page.routeError, '');
        assert.equal(page.title, '私聊');
    }
    page.onIMStatusChange({ ...page.imStatus, foreground: false });
    page.onIMStatusChange({ ...page.imStatus, foreground: true });
    assert.equal(page.conversationID, 'c2c_user_12');
});

test('missed logout event and stale navigation cannot reopen a previous business login', () => {
    const page = chatFixture();
    page.onIMStatusChange({ ...page.imStatus, sessionID: 3, accountSessionID: 3 });
    assert.equal(page.conversationID, ''); assert.ok(page.routeError);
    page.onIMStatusChange({ ...page.imStatus, sessionID: 4, accountSessionID: 3 });
    assert.equal(page.conversationID, '');
    const stale = chatFixture(); stale.ownerIMIdentity = '';
    stale.onIMStatusChange({ ...stale.imStatus, status: 'connecting', sessionID: 2, accountSessionID: 2 });
    assert.equal(stale.conversationID, '');
});

test('changed effective IM user or SDK application still invalidates the chat', () => {
    for (const change of [{ userID: 'user_2' }, { sdkAppID: 1600000000 }]) {
        const page = chatFixture(); page.onIMStatusChange({ ...page.imStatus, sessionID: 2, ...change });
        assert.equal(page.conversationID, ''); assert.ok(page.routeError);
    }
});

test('conversation and business-entry navigation carry the stable business generation', () => {
    for (const path of ['../pages/im/conversations.nvue', '../components/im/SendMessageButton.vue']) {
        const file = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
        const script = file.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
        let url;
        const context = { module: { exports: {} }, status: {}, ConversationList: {},
            chatURL: () => '/pages/im/chat?conversationID=c2c_user_12', singleChatID: () => 'c2c_user_12',
            uni: { navigateTo: options => { url = options.url; }, showToast() {} } };
        vm.runInNewContext(script, context);
        const methods = context.module.exports.methods;
        const state = { status: 'ready', sessionID: 9, accountSessionID: 2 };
        const page = { imReady: true, imStatus: state, vuex_im: state, vuex_user: { token: 'test', user_id: 1 }, userId: 12, nickname: '测试' };
        if (methods.openChat) {
            methods.openChat.call(page, { conversationID: 'c2c_user_12' });
            page.targetUser = '12'; methods.onIMStatusChange.call(page, { ...state, sessionID: 10 });
            assert.equal(page.targetUser, '12');
            methods.onIMStatusChange.call(page, { ...state, accountSessionID: 3 }); assert.equal(page.targetUser, '');
        } else methods.open.call(page);
        assert.match(url, /accountSessionID=2/); assert.doesNotMatch(url, /[?&]sessionID=/);
    }
});
