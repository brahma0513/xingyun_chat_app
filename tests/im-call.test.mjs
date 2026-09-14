import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const policySource = read('utils/im/call-sync-policy.js');
const { shouldDeferCallAccountSync } = await import('data:text/javascript;base64,' + Buffer.from(policySource).toString('base64'));

test('same-account foreground refresh cannot replace IM while a call is starting or active', () => {
    const account = { userID: 12 };
    const imStatus = { status: 'ready', userID: 'user_12' };
    assert.equal(shouldDeferCallAccountSync({ account, imStatus, callSetupInProgress: true, callSource: '' }), true);
    assert.equal(shouldDeferCallAccountSync({ account, imStatus, callSetupInProgress: false, callSource: 'caller' }), true);
    assert.equal(shouldDeferCallAccountSync({ account: { userID: 13 }, imStatus, callSetupInProgress: true, callSource: '' }), false);
    assert.equal(shouldDeferCallAccountSync({ account: null, imStatus, callSetupInProgress: true, callSource: '' }), false);
});

test('App initializes call listeners and publishes the signed-in IM user', () => {
    const app = read('App.vue');
    const im = read('utils/im/index.js');
    assert.match(app, /import \{ initCallService \} from '@\/uni_modules\/tuikit-atomic-x\/server\/callService'/);
    assert.match(app, /startIMLogin\(\);\s*initCallService\(\);/);
    assert.match(im, /uni\.\$userID = value\.status === 'ready' \? value\.userID : ''/);
});

test('single chat exposes image, audio call and video call tools', () => {
    const chat = read('pages/im/chat.nvue');
    assert.match(chat, /:toolList="chatTools"/);
    assert.match(chat, /id: 'voiceCall'/);
    assert.match(chat, /id: 'videoCall'/);
});

test('Android call setup requests permission before opening devices and invoking calls', () => {
    const tools = read('uni_modules/tuikit-atomic-x/components_compatible/MessageInput/ToolsPanel.nvue');
    const start = tools.indexOf('checkCallPermissionWithDialog(mediaType).then');
    const camera = tools.indexOf('deviceStateInstance.openLocalCamera', start);
    const microphone = tools.indexOf('deviceStateInstance.openLocalMicrophone', start);
    const invoke = tools.indexOf("console.log('[ToolsPanel] invoking calls:'", start);
    assert.ok(start >= 0 && start < camera && camera < microphone && microphone < invoke);
    assert.match(tools, /\[ToolsPanel\] calls failed:/);
    assert.match(tools, /CallErrorCode\.ENTER_ROOM_FAILED/);
    const state = read('uni_modules/tuikit-atomic-x/state_compatible/CallState.ts');
    const service = read('uni_modules/tuikit-atomic-x/server_compatible/callService.ts');
    assert.match(state, /ENTER_ROOM_FAILED = -3301/);
    assert.match(state, /\[CallState\] calls response:/);
    assert.match(service, /addCallListener\('onError'/);
});

test('call page and all call runtime assets are registered', () => {
    const pages = JSON.parse(read('pages.json'));
    assert.ok(pages.pages.some(page => page.path === 'uni_modules/tuikit-atomic-x/pages/call'));
    for (const file of [
        'static/phone_dialing.mp3',
        'static/phone_ringing.mp3',
        'static/images/callview-loading.gif',
        'static/images/callview-network.png',
        'static/images/callview-network-bad.png',
        'static/images/callview-self-mute.png',
        'static/images/default-call.png'
    ]) assert.ok(fs.statSync(path.join(root, file)).size > 0, file + ' should be bundled');
});

test('Vue2 preparation also replaces the call page', () => {
    const prepare = read('scripts/prepare-im-vue2.cjs');
    const callPage = read('uni_modules/tuikit-atomic-x/pages/call.nvue');
    assert.match(prepare, /\['components', 'state', 'server', 'pages'\]/);
    assert.match(callPage, /export default \{/);
    assert.doesNotMatch(callPage, /<script setup/);
});

test('messages and contacts retain their custom navigation bar', () => {
    const list = read('pages/im/conversations.nvue');
    assert.match(list, /<CustomNavbar :title="pageTitle"/);
    assert.match(list, /pageTitle\(\).*activeTab === 'contacts' \? '通讯录' : '消息'/);
});
