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

test('IM profile tab stays in IM and opens its own editor', () => {
    const list = read('pages/im/conversations.nvue');
    const selectTab = list.slice(list.indexOf('selectTab(tab) {'), list.indexOf('animateTabIndicator(tab) {'));
    assert.match(list, /v-if="activeTab === 'profile'"/);
    assert.match(selectTab, /if \(tab === 'add'\)/);
    assert.doesNotMatch(selectTab, /pages\/personal_center\/personal_center/);
    assert.match(list, /openEditProfile\(\) \{ uni\.navigateTo\(\{ url: '\/pages\/im\/edit-profile' \}\); \}/);
});

test('IM bottom navigation has four matching icons and selected states', () => {
    const list = read('pages/im/conversations.nvue');
    for (const name of ['message', 'contacts', 'add', 'profile']) {
        for (const suffix of ['', '-selected']) {
            assert.ok(fs.existsSync(path.join(root, 'static/im/tabs', name + suffix + '.png')));
        }
    }
    assert.match(list, /navActive === 'messages' \? tabIcons\.messageSelected : tabIcons\.message/);
    assert.match(list, /navActive === 'contacts' \? tabIcons\.contactsSelected : tabIcons\.contacts/);
    assert.match(list, /navActive === 'add' \? tabIcons\.addSelected : tabIcons\.add/);
    assert.match(list, /navActive === 'profile' \? tabIcons\.profileSelected : tabIcons\.profile/);
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

test('chat avatars forward the sender and open the corresponding user homepage once',()=>{
    const chat=read('pages/im/chat.nvue');
    const start=chat.indexOf('        openUserProfile(profile) {');
    const method=chat.slice(start,chat.indexOf('        renderRedPacket(message)',start)).trim().replace(/,$/,'').replace('openUserProfile(profile)','function(profile)');
    const open=new Function('return ('+method+')')();
    const requests=[]; globalThis.uni={navigateTo:options=>requests.push(options),showToast(){}};
    const vm={imReady:true,routeError:'',conversationID:'c2c_user_2',imStatus:{userID:'user_1'},currentProfiles:{user_2:{nickname:'好友昵称'}},stopVoiceRecording(){},collapse(){}};
    const from={userID:'user_2',nickname:'消息昵称',avatarURL:'avatar.png'};
    const message=read('uni_modules/tuikit-atomic-x/components/MessageList/Message/Message.nvue');
    const list=read('uni_modules/tuikit-atomic-x/components/MessageList/MessageList.nvue');
    const avatar=new Function(message.match(/handleAvatarTap\(\) \{([^\n]+)\}/)[1]);
    const forward=new Function('profile',list.match(/handleAvatarTap\(profile\) \{([^\n]+)\}/)[1]);
    avatar.call({message:{from},$emit:(event,profile)=>{assert.equal(event,'onAvatarTap');forward.call({$emit:(name,value)=>{assert.equal(name,'onAvatarTap');open.call(vm,value);}},profile);}});
    assert.equal(requests[0].url,'/pages/im/user-profile?userID=user_2');
    assert.equal(uni.$userProfileData.userInfo.nickname,'好友昵称'); assert.equal(uni.$userProfileData.userInfo.userID,'user_2');
    open.call(vm,from); assert.equal(requests.length,1); requests[0].complete();
    open.call(vm,{userID:'user_3'}); open.call(vm,{userID:'../invalid'}); assert.equal(requests.length,1);
    vm.imReady=false; open.call(vm,from); assert.equal(requests.length,1);
    assert.match(message,/@tap\.stop="handleAvatarTap"/); assert.match(list,/@onAvatarTap="handleAvatarTap"/); assert.match(chat,/@onAvatarTap="openUserProfile"/);
    for(const file of ['Message/Message.nvue','MessageList.nvue']) assert.match(read('uni_modules/tuikit-atomic-x/components_compatible/MessageList/'+file), /handleAvatarTap/);
});

test('friend operation uses nested result codes instead of reporting bridge success',async()=>{
    const {friendOperationResult}=await import('data:text/javascript;base64,'+Buffer.from(read('utils/im/friend-response.js')).toString('base64'));
    assert.equal(friendOperationResult({code:0,data:{data:{resultCode:30539,resultInfo:'pending'}}}).code,30539);
    assert.equal(friendOperationResult({code:0,data:{code:30525,message:'denied'}}).code,30525);
    assert.equal(friendOperationResult({code:0,data:{data:{code:0}}}).code,0);
    assert.equal(friendOperationResult({code:30539}).code,30539);
    assert.throws(()=>friendOperationResult({code:null}));
    assert.throws(()=>friendOperationResult({code:0,data:{resultCode:'invalid'}}));
});
test('profile uses actual friend list and pending applications for relationship actions',()=>{
    const source=read('pages/im/user-profile.nvue');
    const script=source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*;$/gm,'').replace('components: { CustomNavbar, Avatar },','');
    const definition=new Function(script.replace('export default','return'))();
    const vm={userID:'user_851629863',userInfo:{isFriend:false},application:null,contactState:{friendList:{value:[]},friendApplicationList:{value:[{userID:'user_851629863',type:2}]}}};
    vm.currentApplication=definition.computed.currentApplication.call(vm); vm.isFriend=definition.computed.isFriend.call(vm);
    assert.equal(definition.computed.sentApplication.call(vm),true); assert.equal(vm.isFriend,false);
    vm.contactState.friendList.value.push({userID:'user_851629863'}); vm.isFriend=definition.computed.isFriend.call(vm);
    assert.equal(vm.isFriend,true); assert.equal(definition.computed.sentApplication.call(vm),false);
});
