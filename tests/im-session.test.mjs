import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('../utils/im/session.js', import.meta.url), 'utf8');
const { createIMSession } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const tick = () => new Promise(resolve => setImmediate(resolve));
const info = account => ({ sdkAppID: 1400000000, userID: account.id, userSig: 'mock-signature' });

function fixture(options = {}) {
    const instances = [], states = [];
    const sdk = {
        EVENT: { SDK_READY: 'ready', SDK_NOT_READY: 'offline', KICKED_OUT: 'kicked' },
        create() {
            const handlers = {};
            const instance = {
                on: (name, callback) => { handlers[name] = callback; },
                emit: (name, data) => handlers[name]({ data }),
                setLogLevel() {},
                isReady: () => false,
                login: async () => {},
                async destroy() { instance.destroyed = true; instance.emit('offline'); }
            };
            instances.push(instance);
            return instance;
        }
    };
    const session = createIMSession({ sdk, credentials: async a => info(a), publish: s => states.push(s), ...options });
    return { session, instances, states };
}

test('业务未登录不创建 SDK；必须等 SDK_READY，重复登录去重', async () => {
    const f = fixture();
    await f.session.sync(null);
    assert.equal(f.instances.length, 0);
    const p = f.session.sync({ id: 'A' });
    const duplicate = f.session.sync({ id: 'A' });
    assert.equal(p, duplicate);
    await tick();
    assert.equal(f.session.getClient(), null);
    f.instances[0].emit('ready');
    await p;
    assert.equal(f.states.at(-1).status, 'ready');
    await f.session.sync({ id: 'A' });
    assert.equal(f.instances.length, 1);
    await f.session.sync(null);
    assert.equal(f.instances[0].destroyed, true);
    assert.equal(f.session.getClient(), null);
});

test('获取签名期间退出，迟到的响应不能登录', async () => {
    let release;
    const f = fixture({ credentials: a => new Promise(resolve => { release = () => resolve(info(a)); }) });
    const p = f.session.sync({ id: 'A' });
    await tick();
    const logout = f.session.sync(null);
    release();
    await Promise.all([p, logout]);
    assert.equal(f.instances.length, 0);
    assert.equal(f.states.at(-1).status, 'idle');
});

test('SDK 登录期间切号，销毁旧实例且忽略旧 READY', async () => {
    const f = fixture();
    const a = f.session.sync({ id: 'A' });
    await tick();
    const b = f.session.sync({ id: 'B' });
    await tick();
    assert.equal(f.instances[0].destroyed, true);
    f.instances[0].emit('ready');
    assert.equal(f.session.getClient(), null);
    f.instances[1].emit('ready');
    await Promise.all([a, b]);
    assert.equal(f.states.at(-1).userID, 'B');
});

test('被踢后不自动抢登，显式重试可恢复', async () => {
    const f = fixture();
    const a = f.session.sync({ id: 'A' });
    await tick();
    f.instances[0].emit('ready');
    await a;
    f.instances[0].emit('kicked', { type: 'multiAccount' });
    await f.session.sync({ id: 'A' });
    assert.equal(f.instances.length, 1);
    assert.equal(f.states.at(-1).status, 'kicked');
    const retry = f.session.sync({ id: 'A' }, true);
    await tick();
    f.instances[1].emit('ready');
    await retry;
    assert.equal(f.states.at(-1).status, 'ready');
});

test('超时清理实例，错误状态保留且可以重试', async () => {
    const f = fixture({ readyTimeout: 10 });
    await f.session.sync({ id: 'A' });
    assert.equal(f.instances[0].destroyed, true);
    assert.equal(f.states.at(-1).status, 'error');
    const retry = f.session.sync({ id: 'A' });
    await tick();
    f.instances[1].emit('ready');
    await retry;
    assert.equal(f.states.at(-1).status, 'ready');
});

test('后端凭证错误不创建 SDK，不回显敏感错误正文', async () => {
    const f = fixture({ credentials: async () => { throw { code: 40002, message: 'sensitive' }; } });
    await f.session.sync({ id: 'A' });
    assert.equal(f.instances.length, 0);
    assert.equal(f.states.at(-1).code, 40002);
    assert.equal(JSON.stringify(f.states).includes('sensitive'), false);
});
