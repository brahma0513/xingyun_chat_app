import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load = async file => import('data:text/javascript;base64,' + Buffer.from(fs.readFileSync(new URL(file, import.meta.url), 'utf8')).toString('base64'));
const { contactProfiles, readProfiles, mergeProfile } = await load('../utils/im/profile-reader.js');
const { businessProfile } = await load('../utils/im/profile.js');
test('current profiles support both native response envelopes and only expose public fields', () => {
    const p = { userID: 'user_12', nickname: '名字', avatarURL: 'https://example.com/a.png', token: 'private' };
    for (const data of [{ contactInfoList: [p] }, { data: { contactInfoList: [p] } }]) {
        assert.deepEqual(contactProfiles(JSON.stringify({ code: 0, data })), [{ userID: p.userID, nickname: p.nickname, avatarURL: p.avatarURL, friendRemark: '' }]);
    }
    assert.throws(() => contactProfiles({ code: 0, data: null }));
    assert.throws(() => contactProfiles({ code: 1 }));
});
test('current profile overrides historical sender without changing the native message object', () => {
    const old = { userID: 'user_12', nickname: '', avatarURL: '', nameCard: '群名片' };
    const merged = mergeProfile(old, { nickname: '新名字', avatarURL: 'https://example.com/a.png' });
    assert.equal(merged.nickname, '新名字'); assert.equal(merged.nameCard, '群名片');
    assert.equal(old.avatarURL, '');
    assert.equal(mergeProfile(merged, { avatarURL: '' }).avatarURL, merged.avatarURL);
});
test('profile reader creates and cleans an isolated store on success and failure', async () => {
    for (const code of [0, 1]) {
        const calls = [];
        const task = readProfiles((json, cb) => {
            const request = JSON.parse(json); calls.push(request);
            cb(JSON.stringify({ code: request.api === 'getContactInfo' ? code : 0, data: { contactInfoList: [] } }));
        }, ['user_12']);
        if (code === 0) assert.deepEqual(await task, []); else await assert.rejects(task);
        assert.deepEqual(calls.map(c => c.api), ['createStore', 'getContactInfo', 'destroyStore']);
        assert.equal(calls[1].params.userIDList, '["user_12"]');
        assert.equal(calls[0].params.createStoreParams, calls[2].params.createStoreParams);
    }
});
test('relative uploaded avatars and URL spaces are not silently discarded', () => {
    assert.equal(businessProfile({ user_id: 12, headimgurl: 'uploads/a b.png?a=1&amp;b=2' }, 'https://example.com/api').avatarURL,
        'https://example.com/uploads/a%20b.png?a=1&b=2');
});
test('profile view ignores stale responses and unregisters listeners on destroy', async () => {
    const mixin = (await load('../utils/im/profile-view.js')).default;
    const handlers = new Map(), requests = [];
    globalThis.uni = { $on: (name, cb) => handlers.set(name, cb), $off: name => handlers.delete(name),
        $emit: (name, value) => requests.push(value) };
    try {
        const vm = { ...mixin.data(), profileIDs: ['user_12'] };
        vm.requestCurrentProfiles = mixin.methods.requestCurrentProfiles.bind(vm);
        mixin.created.call(vm);
        const oldID = requests.at(-1).requestID;
        vm.requestCurrentProfiles();
        const newID = requests.at(-1).requestID;
        handlers.get('im:profiles')({ requestID: oldID, profiles: [{ userID: 'user_12', nickname: 'old' }] });
        assert.deepEqual(vm.currentProfiles, {});
        handlers.get('im:profiles')({ requestID: newID, profiles: [{ userID: 'user_12', nickname: 'new' }] });
        assert.equal(vm.currentProfiles.user_12.nickname, 'new');
        mixin.beforeDestroy.call(vm); assert.equal(handlers.size, 0);
        const count = requests.length; vm.requestCurrentProfiles(); assert.equal(requests.length, count);
    } finally { delete globalThis.uni; }
});
