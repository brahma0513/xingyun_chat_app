import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load = async file => import('data:text/javascript;base64,' + Buffer.from(fs.readFileSync(new URL(file, import.meta.url), 'utf8')).toString('base64'));
const { businessProfile, createProfileSync } = await load('../utils/im/profile.js');
const { unreadCount, createUnreadMonitor } = await load('../utils/im/unread.js');

test('profile only exports public identity fields and normalizes avatar URLs', () => {
    assert.deepEqual(businessProfile({ user_id: 12, weixin_name: ' 小明 ', headimgurl: '/uploads/a.jpg', token: 'private' }, 'https://example.com/api'),
        { userID: 'user_12', nickname: '小明', avatarURL: 'https://example.com/uploads/a.jpg', allowType: 1 });
    assert.equal(businessProfile({ user_id: 12, headimgurl: '/static/default.png' }).avatarURL, '');
    assert.equal(businessProfile({ user_id: 12, headimgurl: 'file:///private/a.jpg' }).avatarURL, '');
    assert.equal(businessProfile({ user_id: 0 }), null);
});
test('profile synchronization deduplicates, retries failures and syncs changed profiles', async () => {
    let calls = 0, fail = true, profile = { userID: 'user_12', nickname: 'A' };
    const client = { async setProfile() { calls++; if (fail) throw { code: 1 }; } };
    const statuses = [];
    const sync = createProfileSync({ getClient: () => client, getProfile: () => profile, report: status => statuses.push(status) });
    await sync(); fail = false; await Promise.all([sync(), sync()]); await sync();
    assert.equal(calls, 2); assert.deepEqual(statuses, ['error', 'ready']);
    profile = { ...profile, nickname: 'B' }; await sync(); assert.equal(calls, 3);
});
test('queued profile update is skipped after switching accounts', async () => {
    let calls = 0, client = { async setProfile() { calls++; } };
    const sync = createProfileSync({ getClient: () => client, getProfile: () => ({ userID: 'user_12' }) });
    const task = sync(); client = null; await task; assert.equal(calls, 0);
});
test('unread count rejects invalid values', () => {
    for (const value of [-1, NaN, Infinity, undefined, 'bad']) assert.equal(unreadCount(value), 0);
    assert.equal(unreadCount('123'), 123); assert.equal(unreadCount(2.8), 2);
});
test('independent unread monitor survives page lifecycle and ignores old account events', () => {
    const calls = [], listeners = [], values = [], removed = [];
    const monitor = createUnreadMonitor({
        callAPI(raw, callback) { const request = JSON.parse(raw); calls.push(request); callback('{"code":0}'); },
        addListener(options, callback) { listeners.push({ options, callback }); },
        removeListener(options) { removed.push(options); }, publish: count => values.push(count)
    });
    const client = {}; monitor.start(client); monitor.start(client);
    assert.equal(listeners.length, 1);
    listeners[0].callback('{"totalUnreadCount":5}'); assert.equal(values.at(-1), 5);
    monitor.start({}); assert.equal(values.at(-1), 0);
    listeners[0].callback('{"totalUnreadCount":99}'); assert.equal(values.at(-1), 0);
    listeners[1].callback('{"totalUnreadCount":2}'); assert.equal(values.at(-1), 2);
    assert.notEqual(listeners[0].options.params.createStoreParams, listeners[1].options.params.createStoreParams);
    monitor.stop(); assert.equal(values.at(-1), 0); assert.equal(removed.length, 2);
    assert.equal(calls.filter(call => call.api === 'loadConversations').length, 2);
});
test('late store creation after logout cannot register unread listeners', () => {
    let created, listeners = 0;
    const monitor = createUnreadMonitor({
        callAPI(raw, callback) { if (JSON.parse(raw).api === 'createStore') created = callback; },
        addListener() { listeners++; }, removeListener() {}, publish() {}
    });
    monitor.start({}); monitor.stop(); created('{"code":0}'); assert.equal(listeners, 0);
});
