import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const importSource = source => import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const coreSource = fs.readFileSync(new URL('../utils/im/redpacket.js', import.meta.url), 'utf8');
const core = await importSource(coreSource);
const responseParser = await importSource(fs.readFileSync(new URL('../utils/im/redpacket-response.js', import.meta.url), 'utf8'));
const bridgeSource = fs.readFileSync(new URL('../utils/im/redpacket-api.js', import.meta.url), 'utf8')
    .replace(/import Store[^;]+;/, 'const Store = globalThis.__rpStore;')
    .replace(/import \{ apiUrl[^;]+;/, "const apiUrl = 'https://mock.platform'; const customer_id=7, api_key='public-key', app_id=8, appExamine='';")
    .replace(/import \{ createRedPacketDraft[^;]+;/, 'const {createRedPacketDraft,sameRedPacketIntent}=globalThis.__rpCore;')
    .replace(/import \{ parseRedPacketResponse[^;]+;/, 'const {parseRedPacketResponse}=globalThis.__rpResponse;');
const tick = () => new Promise(resolve => setImmediate(resolve));
let instance = 0;
async function fixture() {
    const handlers = new Map(), storage = new Map(), requests = [], responses = [];
    const Store = { state: { vuex_user: { user_id: 1, token: 'secret-business-token' }, vuex_im: { accountSessionID: 10 }, vuex_client: 'app' } };
    const uni = {
        $on(name, fn) { if (!handlers.has(name)) handlers.set(name, new Set()); handlers.get(name).add(fn); },
        $off(name, fn) { handlers.get(name)?.delete(fn); },
        $emit(name, value) { if (name === 'im:redpacket-result') responses.push(value); return Promise.all([...(handlers.get(name) || [])].map(fn => fn(value))); },
        getStorageSync: key => storage.get(key), setStorageSync: (key, value) => storage.set(key, JSON.parse(JSON.stringify(value))), removeStorageSync: key => storage.delete(key),
        request(options) { requests.push(options); }
    };
    globalThis.uni=uni; globalThis.__rpStore=Store; globalThis.__rpCore=core; globalThis.__rpResponse=responseParser;
    const bridge=await importSource(bridgeSource+'\n// instance '+(++instance)); bridge.startRedPacketBridge(); bridge.startRedPacketBridge();
    const data={receiver_id:'2',request_id:'rp-test-request-123456789',asset:'pocket_money',amount:'12.34',blessing:'学习进步',pay_password:'654321'};
    const emit=(action, override={}, context={})=>uni.$emit('im:redpacket-request',{requestID:'request-'+Math.random(),action,data:{...data,...override},userID:'user_1',accountSessionID:10,...context});
    const success=(index, data, errcode=0)=>requests[index].success({statusCode:200,data:{errcode,errmsg:'test error',data}});
    return { uni,handlers,storage,requests,responses,Store,data,emit,success };
}
test('红包数据仅识别版本、编号和指定资产，不信任消息金额', () => {
    const raw={businessID:'xingyun_redpacket',version:1,packet_id:'a'.repeat(32),asset:'currency',blessing:'学习进步',amount:'999'};
    const message=value=>({messagePayload:{customData:JSON.stringify(value)}});
    assert.deepEqual(core.parseRedPacket(message(raw)),{packet_id:raw.packet_id,asset:'currency',blessing:raw.blessing});
    for(const value of [{...raw,version:2},{...raw,packet_id:'../x'},{...raw,asset:'unknown'},{...raw,businessID:'other'}]) assert.equal(core.parseRedPacket(message(value)),null);
    assert.equal(core.parseRedPacket({messagePayload:{customData:'broken'}}),null);
});
test('金额精度、资产类型和上限', () => {
    for(const [asset,value] of [['pocket_money','0.01'],['currency','10.2'],['integral','10']]) assert.equal(core.validateRedPacketAmount(value,asset),'');
    for(const value of ['0','-1','01','1.001','1e3','1000000.01']) assert.ok(core.validateRedPacketAmount(value,'pocket_money'));
    assert.ok(core.validateRedPacketAmount('1.5','integral')); assert.ok(core.validateRedPacketAmount('1','bad'));
});
test('纯 JSON 字符串及 BOM 可解析，HTTP 和无效响应不伪装为成功', () => {
    const valid={errcode:0,data:{packet_id:'a'.repeat(32)}};
    for(const data of [valid,JSON.stringify(valid),'\uFEFF'+JSON.stringify(valid)]) assert.deepEqual(responseParser.parseRedPacketResponse({statusCode:200,data}),valid);
    const denied={errcode:40005,errmsg:'密码错误'};
    assert.deepEqual(responseParser.parseRedPacketResponse({statusCode:200,data:JSON.stringify(denied)}),denied);
    for(const statusCode of [404,500,403]) assert.throws(()=>responseParser.parseRedPacketResponse({statusCode,data:'<html>secret body</html>'}),error=>error.code==='RP_HTTP_'+statusCode && !error.message.includes('secret'));
    for(const data of ['<html>PHP error</html>','warning '+JSON.stringify(valid),{},[],{errcode:0},{errcode:null}]) assert.throws(()=>responseParser.parseRedPacketResponse({statusCode:200,data}),error=>error.code==='RP_INVALID_RESPONSE');
});
test('404 给出部署提示并保留原请求，恢复后仍用同一编号核对', async () => {
    const f=await fixture(); const request=f.emit('send'); await tick(); f.requests[0].success({statusCode:404,data:'<html>not found</html>'}); await request;
    assert.match(f.responses.at(-1).error,/HTTP 404/); assert.equal(f.responses.at(-1).code,'RP_HTTP_404'); assert.equal(f.storage.size,1);
    const retry=f.emit('send',{pay_password:''}); await tick(); assert.equal(f.requests[1].data.request_id,f.data.request_id);
    f.requests[1].success({statusCode:200,data:JSON.stringify({errcode:0,data:{packet_id:'a'.repeat(32),status:'pending',message_sent:1}})}); await retry; assert.equal(f.storage.size,0);
});
test('保留原请求编号，意图变更与密码变更分别处理', () => {
    const draft=core.createRedPacketDraft('2',()=>0.123456,()=>1700000000);
    assert.match(draft.request_id,/^[a-zA-Z0-9_-]{20,80}$/);
    assert.equal(core.sameRedPacketIntent(draft,{...draft,pay_password:'secret'}),true);
    for(const key of ['request_id','asset','amount','receiver_id','blessing']) assert.equal(core.sameRedPacketIntent(draft,{...draft,[key]:'different'}),false);
});
test('支付请求超时保留无密码原意图，重复点击不能解除首个请求锁', async () => {
    const f=await fixture(); const first=f.emit('send'); await tick();
    assert.equal(f.requests.length,1); assert.equal(f.handlers.get('im:redpacket-request').size,1);
    assert.ok(!JSON.stringify([...f.storage]).includes('654321'));
    assert.ok(!JSON.stringify([...f.storage]).includes('secret-business-token'));
    await f.emit('send'); await f.emit('send'); assert.equal(f.requests.length,1);
    f.requests[0].fail(); await first;
    assert.equal(f.storage.size,1); assert.match(f.responses.at(-1).error,/核对/);
    const retry=f.emit('send',{pay_password:''}); await tick();
    assert.equal(f.requests[1].data.request_id,f.data.request_id);
    f.success(1,{packet_id:'a'.repeat(32),status:'pending',message_sent:1}); await retry;
    assert.equal(f.storage.size,0);
});
test('资金结果未明确前阻止改变金额的新红包', async () => {
    const f=await fixture(); const first=f.emit('send'); await tick(); f.requests[0].fail(); await first;
    await f.emit('send',{amount:'13'}); assert.equal(f.requests.length,1); assert.match(f.responses.at(-1).error,/上一个/);
});
test('确定的密码错误和余额不足可重新填写，未知错误保留意图', async () => {
    for(const code of [40005,40006,50303]) {
        const f=await fixture(); const request=f.emit('send'); await tick(); f.success(0,null,code); await request;
        assert.equal(f.storage.size,code===50303?1:0); assert.equal(f.responses.at(-1).code,code);
    }
});
test('支付成功消息发送中保留编号，详情恢复后清理草稿', async () => {
    const f=await fixture(); const request=f.emit('send'); await tick(); const packet={packet_id:'b'.repeat(32),status:'pending',message_sent:0}; f.success(0,packet); await request;
    assert.equal([...f.storage.values()][0].packet_id,packet.packet_id);
    const detail=f.emit('detail',{packet_id:packet.packet_id}); await tick(); f.success(1,{...packet,message_sent:1}); await detail; assert.equal(f.storage.size,0);
});
test('账号切换忽略旧响应，拒绝旧账号请求', async () => {
    const f=await fixture(); const request=f.emit('send'); await tick();
    f.Store.state.vuex_user={user_id:2,token:'second-token'}; f.Store.state.vuex_im.accountSessionID=11;
    f.success(0,{packet_id:'a'.repeat(32),status:'pending',message_sent:1}); await request;
    assert.equal(f.responses.length,0); assert.equal(f.storage.size,1);
    await f.emit('claim'); assert.equal(f.requests.length,1); assert.match(f.responses.at(-1).error,/登录状态/);
});
test('options 恢复原意图，未发生支付不保存草稿', async () => {
    const f=await fixture(); const request=f.emit('options'); await tick(); f.success(0,{assets:[],has_pay_password:true}); await request;
    assert.equal(f.storage.size,0); assert.equal(f.responses.at(-1).data.draft.receiver_id,'2');
});
test('nvue RPC 清理监听器、服务端错误与超时', async () => {
    const f=await fixture(); const context={userID:'user_1',accountSessionID:10};
    const pending=core.requestRedPacket('detail',{receiver_id:'2'},context,1000); await tick(); f.success(0,{packet_id:'a'.repeat(32)}); assert.equal((await pending).packet_id,'a'.repeat(32));
    assert.equal(f.handlers.get('im:redpacket-result').size,0);
    const bad=core.requestRedPacket('claim',{receiver_id:'2'},context,1000); await tick(); f.success(1,null,40301); await assert.rejects(bad,e=>e.code===40301);
    const timeout=core.requestRedPacket('detail',{receiver_id:'2'},context,5); await assert.rejects(timeout,/超时/); assert.equal(f.handlers.get('im:redpacket-result').size,0);
});
