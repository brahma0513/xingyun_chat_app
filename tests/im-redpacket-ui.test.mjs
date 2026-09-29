import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const load = code => import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const ui = await load(read('utils/im/redpacket-ui.js'));
const core = await load(read('utils/im/redpacket.js'));
const page = await load(read('pages/im/redpacket-send.vue').match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*;$/gm, '')
    .replace('mixins: [page], components: { RedPacketKeyboard },', ''));
const methods = page.default.methods;

test('页面跳转失败显示具体原因，缺失路由提示重新运行且日志隐藏查询参数', () => {
    const failure = ui.redPacketNavigationError({ errMsg: 'navigateTo:fail page "pages/im/redpacket-send?avatar=private&userID=user_1" is not found' });
    assert.match(failure.message, /停止运行/);
    assert.ok(!failure.reason.includes('private'));
    assert.ok(!failure.reason.includes('user_1'));
    assert.match(ui.redPacketNavigationError({ errMsg: 'navigateTo:fail webview limit exceeded' }).message, /页面过多/);
    assert.match(ui.redPacketNavigationError({ errMsg: 'navigateTo:fail timeout' }).message, /超时/);
    assert.match(ui.redPacketNavigationError({ errMsg: 'navigateTo:fail native renderer error' }).message, /native renderer error/);
});

test('内置键盘限制小数精度、前导零、积分及删除', () => {
    const type = (keys, asset = 'pocket_money') => [...keys].reduce((value, key) => ui.redPacketAmountKey(value, key, asset), '');
    assert.equal(type('00012.345'), '12.34');
    assert.equal(type('.12'), '0.12');
    assert.equal(type('12.3', 'integral'), '123');
    assert.equal(type('123456789'), '1234567');
    assert.equal(ui.redPacketAmountKey('12.34', 'delete', 'pocket_money'), '12.3');
    assert.equal(ui.redPacketAmountKey('12.3', '.', 'pocket_money'), '12.3');
    assert.equal(core.validateRedPacketAmount(type('0.00'), 'pocket_money').length > 0, true);
});

test('红包路由保留账号、会话及特殊字符，只由服务端身份判断发送者', () => {
    const context = { userID: 'user_1', accountSessionID: 10, conversationID: 'c2c_user_2' };
    const url = new URL(ui.redPacketRoute(context, '小明 & 朋友', 'a'.repeat(32), 'https://example.com/a?b=1&c=2'), 'https://test');
    const options = Object.fromEntries(url.searchParams);
    assert.equal(options.name, '小明 & 朋友'); assert.equal(options.avatar, 'https://example.com/a?b=1&c=2');
    assert.equal(ui.decodeRedPacketParam(encodeURIComponent(options.name)), options.name);
    assert.equal(ui.decodeRedPacketParam('折扣100%'), '折扣100%');
    assert.deepEqual(ui.readRedPacketRoute(options), context);
    assert.equal(ui.readRedPacketRoute({ ...options, conversationID: 'group_2' }), null);
    for (const accountSessionID of ['', 'NaN', '10.5', '-1', '9007199254740992']) assert.equal(ui.readRedPacketRoute({ ...options, accountSessionID }), null);
    assert.equal(ui.redPacketIsSender({ sender_id: 1 }, context), true);
    assert.equal(ui.redPacketIsSender({ sender_id: 2 }, context), false);
});

test('支付密码只接受数字，第六位自动发送，忙碌时不能追加或重复发送', () => {
    let sends = 0;
    const vm = { password: '', busy: false, canOperate: true, send() { sends++; this.busy = true; } };
    for (const key of ['a', '1', '2', '3', 'delete', '3', '4', '5', '6']) methods.passwordKey.call(vm, key);
    assert.equal(vm.password, '123456'); assert.equal(sends, 1);
    methods.passwordKey.call(vm, '7'); methods.passwordKey.call(vm, 'delete');
    assert.equal(vm.password, '123456'); assert.equal(sends, 1);
});

test('不明确的支付错误锁定原意图，明确的密码错误允许重试', async () => {
    const make = code => ({ password: '123456', busy: false, locked: false, draft: { request_id: 'original', amount: '0.01' }, payVisible: true, errorCode: code,
        async run(action, data) { assert.equal(data.request_id, 'original'); this.password = ''; return null; } });
    const uncertain = make(0); await methods.send.call(uncertain); assert.equal(uncertain.locked, true); assert.equal(uncertain.payVisible, false);
    const denied = make(40005); await methods.send.call(denied); assert.equal(denied.locked, false); assert.equal(denied.password, ''); assert.equal(denied.payVisible, true);
});

test('只在服务端领取成功后展现金额，领取失败保留拆红包入口', async () => {
    const detail = await load(read('pages/im/redpacket-detail.vue').match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*;$/gm, '').replace('mixins: [page],', ''));
    const vm = { phase: 'envelope', packet: { can_claim: true }, packetID: 'a'.repeat(32), isSender: false, canOperate: true, busy: false, async run() { return null; } };
    await detail.default.methods.claim.call(vm); assert.equal(vm.phase, 'envelope');
    vm.run = async () => ({ status: 'claim_review', can_claim: false });
    await detail.default.methods.claim.call(vm); assert.equal(vm.phase, 'detail'); assert.equal(vm.packet.amount, undefined);
    vm.phase = 'envelope'; vm.packet = { can_claim: true }; vm.isSender = true;
    let requests = 0; vm.run = async () => { requests++; };
    await detail.default.methods.claim.call(vm); assert.equal(requests, 0);
});

test('选择资产收起面板并清空旧金额，核对中的红包禁止更换',()=>{
    const vm={busy:false,locked:false,draft:{asset:'pocket_money',amount:'10'},assetVisible:true,error:'旧错误'};
    methods.selectAsset.call(vm,{asset:'currency'}); assert.equal(vm.draft.asset,'currency'); assert.equal(vm.draft.amount,''); assert.equal(vm.assetVisible,false);
    vm.locked=true; methods.selectAsset.call(vm,{asset:'integral'}); assert.equal(vm.draft.asset,'currency');
});
test('加载时自动选择后台允许的首个资产，保留待核对的原资产',async()=>{
    const draft={asset:'pocket_money',amount:''}; const vm={run:async()=>({assets:[{asset:'integral',name:'能量',balance:'10'}],draft}),showDetail(){},asset:null};
    await methods.load.call(vm); assert.equal(draft.asset,'integral');
    draft.asset='pocket_money'; draft.amount='10'; await methods.load.call(vm); assert.equal(draft.asset,'pocket_money'); assert.equal(vm.locked,true);
});

test('发送成功和重复核对成功返回聊天，支付结果待核对仍展示状态详情', async()=>{
    const calls=[]; globalThis.uni={navigateBack:options=>calls.push(options)};
    const vm={canOperate:true,password:'123456',payVisible:true,amountKeyboard:true,showDetail:packet=>calls.push(packet.status)};
    methods.finishSend.call(vm,{packet_id:'a'.repeat(32),status:'pending'});
    assert.equal(calls[0].delta,1); assert.equal(vm.password,''); assert.equal(vm.payVisible,false);
    methods.finishSend.call(vm,{packet_id:'a'.repeat(32),status:'funding_review'}); assert.equal(calls[1],'funding_review');
    let returns=0; const sendVM={busy:false,locked:false,password:'123456',draft:{},run:async()=>({packet_id:'a'.repeat(32),status:'pending'}),finishSend(){returns++;}};
    await methods.send.call(sendVM); assert.equal(returns,1);
    await methods.retry.call(sendVM); assert.equal(returns,2);
    vm.canOperate=false; methods.finishSend.call(vm,{packet_id:'a'.repeat(32),status:'pending'}); assert.equal(calls.length,2);
});
