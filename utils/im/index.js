import TencentCloudChat from '@tencentcloud/lite-chat';
import Store from '@/store';
import { apiUrl, customer_id, api_key, app_id, appExamine } from '@/utils/config.js';
import { createIMSession } from './session.js';

function currentAccount() {
    const user = Store.state.vuex_user || {};
    const client = Store.state.vuex_client;
    if (!(Number(user.user_id) > 0) || !user.token || !client) return null;
    return { userID: user.user_id, token: user.token, loginToken: user.login_token || '', client, customerID: customer_id };
}

function credentials(account) {
    console.info('[IM] 请求登录凭证', account.userID, account.client);
    return new Promise((resolve, reject) => {
        uni.request({
            url: apiUrl + '/xingyun_chat/api/index.php?m=im&a=login_info&user_agent=third_program_h5&request_mode=fortune_app&third_token=' + encodeURIComponent(account.token),
            method: 'POST',
            timeout: 15000,
            header: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
            data: {
                customer_id: account.customerID, api_key, app_id, app_examine: appExamine,
                user_id: account.userID, client: account.client, xd_client: account.client,
                login_token: account.loginToken,
                mini_user_token: account.client === 'mini_pro' ? account.token : ''
            },
            success(res) {
                const body = res.data;
                if (res.statusCode !== 200 || !body || Number(body.errcode) !== 0) {
                    console.warn('[IM] 凭证接口失败', JSON.stringify({ httpStatus: res.statusCode, code: body && body.errcode, responseType: typeof body }));
                    reject({ code: body && body.errcode });
                    return;
                }
                console.info('[IM] 凭证接口成功，开始 SDK 登录');
                resolve(body.data);
            },
            fail(error) {
                console.warn('[IM] 凭证请求网络失败');
                reject(error);
            }
        });
    });
}

const session = createIMSession({
    sdk: TencentCloudChat,
    credentials,
    publish(value) {
        Store.commit('$uStore', { name: 'vuex_im', value });
        uni.$emit('im:status', value);
        if (value.status === 'ready') console.info('[IM] SDK_READY', value.userID);
        else console.info('[IM] 状态', JSON.stringify(value));
    }
});
let started = false;

export function startIMLogin() {
    if (started) return;
    started = true;
    // 同步监听身份变化；即使短时间退出后又登录同一用户，也清理旧的异步任务。
    Store.watch(() => JSON.stringify(currentAccount()), () => syncIMLogin(), { immediate: true, sync: true });
    uni.onNetworkStatusChange((event) => { if (event.isConnected) syncIMLogin(); });
}

export function syncIMLogin() {
    const account = currentAccount();
    if (!account) {
        const user = Store.state.vuex_user || {};
        console.info('[IM] 等待业务登录', JSON.stringify({
            hasUserID: Number(user.user_id) > 0,
            hasToken: !!user.token,
            client: Store.state.vuex_client || ''
        }));
    }
    return session.sync(account);
}
export function retryIMLogin() { return session.sync(currentAccount(), true); }
export function getIMClient() { return session.getClient(); }
