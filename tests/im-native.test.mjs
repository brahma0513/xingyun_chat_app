import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load = async file => import('data:text/javascript;base64,' + Buffer.from(fs.readFileSync(new URL(file, import.meta.url), 'utf8')).toString('base64'));
const { createNativeSDK } = await load('../utils/im/native-sdk.js');
const { singleChatID, chatURL } = await load('../utils/im/routes.js');
function fixture() {
    let options, change, logoutCount = 0, stopped = false;
    const state = { state: { loginStatus: 'loggedIn' }, login(value) { options = value; }, logout({ success }) { logoutCount++; success(); } };
    const sdk = createNativeSDK({ getLoginState: () => state, watchStatus: (_, cb) => { change = cb; return () => { stopped = true; }; } });
    const client = sdk.create({ SDKAppID: 1400000000 });
    const events = [];
    Object.values(sdk.EVENT).forEach(name => client.on(name, value => events.push([name, value])));
    return { client, events, state, change: value => change(value), options: () => options, logoutCount: () => logoutCount, stopped: () => stopped };
}
test('native login bridges credentials and only becomes ready after success', async () => {
    const f = fixture();
    const p = f.client.login({ userID: 'user_12', userSig: 'test' });
    assert.equal(f.client.isReady(), false);
    assert.equal(f.options().sdkAppID, 1400000000);
    f.options().success(); await p;
    assert.equal(f.client.isReady(), true);
    assert.equal(f.events[0][0], 'ready');
    f.change('loggedOut');
    assert.equal(f.client.isReady(), false);
    assert.equal(f.events[1][0], 'kicked');
    await f.client.destroy();
    assert.equal(f.logoutCount(), 1);
    assert.equal(f.stopped(), true);
});
test('logout waits for pending login and suppresses late ready', async () => {
    const f = fixture();
    const p = f.client.login({ userID: 'user_12', userSig: 'test' });
    const d = f.client.destroy();
    assert.equal(f.logoutCount(), 0);
    f.options().success(); await p; await d;
    assert.deepEqual(f.events, []);
    assert.equal(f.logoutCount(), 1);
});
test('logout waits for in-flight profile updates before a new account can log in', async () => {
    const f = fixture();
    const login = f.client.login({ userID: 'user_12', userSig: 'test' });
    f.options().success(); await login;
    let update;
    f.state.setSelfInfo = value => { update = value; };
    const profile = { userID: 'user_12', nickname: '小明', avatarURL: '' };
    const task = f.client.setProfile(profile); await Promise.resolve();
    await Promise.resolve();
    assert.deepEqual(update.userProfile, profile);
    const destroy = f.client.destroy(); await Promise.resolve();
    assert.equal(f.logoutCount(), 0);
    update.success(); await task; await destroy;
    assert.equal(f.logoutCount(), 1);
    await assert.rejects(f.client.setProfile(profile), error => error.code === 'IM_NOT_READY');
});
test('native login failure returns only error code', async () => {
    const f = fixture();
    const p = f.client.login({ userID: 'user_12', userSig: 'test' });
    f.options().fail(123, 'secret details');
    await assert.rejects(p, error => error.code === 123 && !error.message);
    await f.client.destroy();
});
test('post-success logged-in notification is not mistaken for being kicked', async () => {
    const f = fixture();
    f.state.state.loginStatus = 'loggingIn';
    const p = f.client.login({ userID: 'user_12', userSig: 'test' });
    f.options().success(); await p;
    f.change('LOGGING_IN'); f.change('LOGGED_IN');
    assert.equal(f.client.isReady(), true);
    assert.equal(f.events.length, 1);
    f.change('LOGGED_OUT');
    assert.equal(f.client.isReady(), false);
});
test('single chat route accepts business ID or IM ID and rejects self/invalid routes', () => {
    assert.equal(singleChatID(' 123 '), 'c2c_user_123');
    assert.equal(singleChatID('user_123'), 'c2c_user_123');
    assert.equal(chatURL('c2c_user_123'), '/pages/im/chat?conversationID=c2c_user_123');
    for (const value of ['', '0', '-1', '1&admin=1', 'user_']) assert.throws(() => singleChatID(value));
    assert.throws(() => singleChatID('123', 'user_123'));
    assert.throws(() => chatURL('group_123'));
});
