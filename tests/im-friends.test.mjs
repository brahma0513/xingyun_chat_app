import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('friend pages are registered and contacts expose both friend entry points', () => {
    const pages = JSON.parse(read('pages.json')).pages.map(page => page.path);
    for (const route of ['pages/im/add-friend', 'pages/im/user-profile', 'pages/im/friend-verify', 'pages/im/friend-applications']) {
        assert.ok(pages.includes(route), route);
    }
    const contacts = read('components/im/ContactsList.nvue');
    assert.match(contacts, /新的朋友/);
    assert.match(contacts, /添加好友/);
    assert.match(contacts, /\$emit\('applications'\)/);
    assert.match(contacts, /\$emit\('add'\)/);
});

test('contact selection opens a profile instead of starting a chat immediately', () => {
    const list = read('pages/im/conversations.nvue');
    const method = list.slice(list.indexOf('openContact(person)'), list.indexOf('openAddFriend()'));
    assert.match(method, /pages\/im\/user-profile/);
    assert.doesNotMatch(method, /openChat/);
});

test('profile supports add, message, accept and reject relationship actions', () => {
    const profile = read('pages/im/user-profile.nvue');
    assert.match(profile, /添加好友/);
    assert.match(profile, /发消息/);
    assert.match(profile, /acceptFriendApplication/);
    assert.match(profile, /refuseFriendApplication/);
    assert.match(profile, /chatURL\('c2c_' \+ this\.userInfo\.userID\)/);
});

test('Vue2 contact compatibility accepts both native response envelopes and stable request IDs', () => {
    const state = read('uni_modules/tuikit-atomic-x/state_compatible/ContactState.ts');
    const applications = read('uni_modules/tuikit-atomic-x/components_compatible/Contact/ContactList/FriendApplicationList.nvue');
    const addFriend = read('uni_modules/tuikit-atomic-x/components_compatible/Contact/AddFriend.nvue');
    assert.match(state, /Array\.isArray\(envelope\.contactInfoList\)/);
    assert.match(state, /envelope\.data\.contactInfoList/);
    assert.match(applications, /item\.applicationID \|\| item\.userID/);
    assert.match(addFriend, /resolveUserID/);
    assert.match(addFriend, /\^1\\d\{10\}\$\/\.test\(rawValue\)/);
    assert.match(addFriend, /'user_' \+ rawValue/);
});

test('phone lookup stays on the business backend and friend requests require confirmation', () => {
    const page = read('pages/im/add-friend.nvue');
    const search = read('utils/im/user-search.js');
    const client = read('utils/im/phone-search-client.js');
    const im = read('utils/im/index.js');
    const profile = read('utils/im/profile.js');
    assert.match(page, /resolvePhoneUserID/);
    assert.match(search, /m=im&a=search_user/);
    assert.doesNotMatch(search, /console\.(?:log|info).*phone/);
    assert.match(client, /im:search-phone/);
    assert.doesNotMatch(client, /vuex_user|third_token/);
    assert.match(im, /requestPhoneUserID/);
    assert.match(profile, /allowType:\s*1/);
});

test('conversation list exposes only pin and delete actions and confirms deletion', () => {
    const page = read('pages/im/conversations.nvue');
    const list = read('uni_modules/tuikit-atomic-x/components/ConversationList/ConversationList.nvue');
    assert.match(page, /isSupportPin:\s*true/);
    assert.match(page, /isSupportMute:\s*false/);
    assert.match(page, /isSupportDelete:\s*true/);
    assert.match(list, /title:\s*'删除聊天'/);
    assert.match(list, /await this\.storeInstance\.deleteConversation/);
});
