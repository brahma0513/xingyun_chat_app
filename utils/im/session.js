// SDK 实例与 UserSig 仅驻留内存；串行处理登录和销毁，避免切换账号串号。
export function createIMSession({ sdk, credentials, publish, readyTimeout = 20000 }) {
    let client = null;
    let desired = '';
    let revision = 0;
    let queue = Promise.resolve();
    let pending = null;
    let phase = 'idle';
    let cancelReady = null;
    let blocked = '';

    function state(status, extra = {}) {
        phase = status;
        publish(Object.assign({ status, userID: '', sdkAppID: 0, error: '' }, extra));
    }

    async function dispose() {
        if (!client) return;
        const old = client;
        // 销毁失败时保留引用，下次必须先重试销毁，不能直接登录另一个账号。
        await old.destroy();
        if (client === old) client = null;
    }

    function sync(account, force = false) {
        const key = account ? JSON.stringify(account) : '';
        if (force || key !== desired) blocked = '';
        if (key && key === blocked) return Promise.resolve();
        if (!force && key === desired && (pending || phase === 'ready' || phase === 'connecting' || (!key && phase === 'idle'))) {
            return pending || Promise.resolve();
        }
        desired = key;
        const current = ++revision;
        if (cancelReady) cancelReady();
        state(key ? 'connecting' : 'idle');
        const active = () => revision === current;
        const task = queue.then(async () => {
            await dispose();
            if (!active() || !account) return;
            const info = await credentials(account);
            if (!active()) return;
            if (!info || !Number(info.sdkAppID) || !info.userID || !info.userSig) {
                throw new Error('IM 登录凭证不完整');
            }
            const instance = sdk.create({ SDKAppID: Number(info.sdkAppID) });
            client = instance;
            instance.setLogLevel(1);
            const detail = { userID: info.userID, sdkAppID: Number(info.sdkAppID) };
            const live = () => active() && client === instance;
            let finish;
            let timer;
            const ready = new Promise((resolve, reject) => {
                finish = (error) => { clearTimeout(timer); error ? reject(error) : resolve(); };
                timer = setTimeout(() => finish(new Error('IM 登录超时，请检查网络后重试')), readyTimeout);
            });
            // login() 返回前 SDK_READY / 超时也可能先触发。
            ready.catch(() => {});
            cancelReady = () => finish(new Error('IM 登录已取消'));
            instance.on(sdk.EVENT.SDK_READY, () => {
                if (!live() || blocked === key) return;
                state('ready', detail);
                finish();
            });
            instance.on(sdk.EVENT.SDK_NOT_READY, () => {
                if (live() && blocked !== key) state('connecting', detail);
            });
            instance.on(sdk.EVENT.KICKED_OUT, (event) => {
                if (!live()) return;
                blocked = key;
                state('kicked', Object.assign({}, detail, { error: 'IM 已下线，请重新登录聊天', reason: event.data && event.data.type }));
                finish(new Error('IM 已下线'));
            });
            try {
                // 以 SDK_READY 为可用判据；登录失败也应立即结束等待。
                instance.login({ userID: info.userID, userSig: info.userSig })
                    .then(() => { if (live() && instance.isReady()) { state('ready', detail); finish(); } })
                    .catch(finish);
                await ready;
            } finally {
                clearTimeout(timer);
                if (active()) cancelReady = null;
            }
        }).catch(async (error) => {
            if (active()) {
                if (phase !== 'kicked') state('error', { error: 'IM 登录失败，请检查配置或网络后重试', code: error && error.code });
                // 使 destroy() 触发的 SDK_NOT_READY 不覆盖错误/被踢状态。
                revision++;
                cancelReady = null;
                try { await dispose(); } catch (_) { /* 保留失败状态，等待用户重试 */ }
            }
        });
        pending = task;
        queue = task;
        task.then(() => { if (pending === task) pending = null; });
        return task;
    }

    return { sync, getClient: () => phase === 'ready' ? client : null };
}
