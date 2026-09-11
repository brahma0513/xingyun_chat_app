import { createNativeSDK } from './native-sdk.js';
import { businessProfile, createProfileSync } from './profile.js';
import { createUnreadMonitor } from './unread.js';
import { readProfiles } from './profile-reader.js';
// #ifdef APP-PLUS
import { useLoginState } from '@/uni_modules/tuikit-atomic-x/state/LoginState';
import { addListener, removeListener, callAPI } from '@/uni_modules/tuikit-atomic-x/utils/tuikitBridge';
// #endif
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

const nativeSDK = createNativeSDK({
    getLoginState() {
        // #ifdef APP-PLUS
        return useLoginState();
        // #endif
        // #ifndef APP-PLUS
        throw new Error('聊天仅支持 App');
        // #endif
    },
    watchStatus(state, callback) {
        // A unique native listener survives nvue LoginState subscriptions.
        // #ifdef APP-PLUS
        const options = { type: '', store: 'LoginStore', name: 'loginStatus', listenerID: 'xingyun-im-session',
            params: { createStoreParams: JSON.stringify({ storeName: 'login', id: '' }) } };
        addListener(options, data => {
            try { callback((typeof data === 'string' ? JSON.parse(data) : data).loginStatus); } catch (_) {}
        });
        return () => removeListener(options);
        // #endif
        // #ifndef APP-PLUS
        return () => {};
        // #endif
    }
});
let unreadMonitor = null;
// #ifdef APP-PLUS
unreadMonitor = createUnreadMonitor({ callAPI, addListener, removeListener,
    publish(value) { Store.commit('$uStore', { name: 'vuex_imUnread', value }); }
});
// #endif
const syncProfile = createProfileSync({
    getClient: () => session.getClient(),
    getProfile: () => businessProfile(Store.state.vuex_user, apiUrl),
    report(status, code) {
        Store.commit('$uStore', { name: 'vuex_imProfileStatus', value: status });
        if (status === 'error') console.warn('[IM] 资料同步失败，将在下次进入前台重试', code);
        if (status === 'ready') {
            const profile = businessProfile(Store.state.vuex_user, apiUrl);
            console.info('[IM] 资料同步完成', JSON.stringify({ hasNickname: !!(profile && profile.nickname), hasAvatar: !!(profile && profile.avatarURL) }));
            uni.$emit('im:profile-updated');
        }
    }
});
function syncExtras() {
    const client = session.getClient();
    if (!client) return;
    if (unreadMonitor) unreadMonitor.start(client);
    syncProfile();
}
const session = createIMSession({
    sdk: nativeSDK,
    credentials,
    publish(value) {
        Store.commit('$uStore', { name: 'vuex_im', value });
        const app = getApp();
        if (app && app.globalData) app.globalData.imStatus = value;
        uni.$emit('im:status', value);
        if (value.status === 'ready') Promise.resolve().then(syncExtras);
        else {
            if (unreadMonitor) unreadMonitor.stop();
            Store.commit('$uStore', { name: 'vuex_imProfileStatus', value: 'idle' });
        }
        if (value.status === 'ready') console.info('[IM] SDK_READY', value.userID);
        else console.info('[IM] 状态', JSON.stringify(value));
    }
});
let started = false;

export function startIMLogin() {
    if (started) return;
    started = true;
    // nvue pages run in a separate context: only share sanitized status, never credentials.
    uni.$on('im:request-status', () => uni.$emit('im:status', Store.state.vuex_im));
    uni.$on('im:retry', () => retryIMLogin());
    uni.$on('im:request-profiles', async event => {
        // #ifdef APP-PLUS
        const client = session.getClient();
        if (!client || !event || !Array.isArray(event.userIDs)) return;
        const ids = [...new Set(event.userIDs)].filter(id => /^user_[1-9]\d*$/.test(id));
        const self = businessProfile(Store.state.vuex_user, apiUrl);
        const profiles = self ? [self] : [];
        const emit = () => { if (session.getClient() === client) uni.$emit('im:profiles', { requestID: event.requestID, profiles }); };
        emit();
        try {
            for (let i = 0; i < ids.length; i += 100) {
                if (session.getClient() !== client) return;
                const current = await readProfiles(callAPI, ids.slice(i, i + 100));
                if (session.getClient() !== client) return;
                const remoteSelf = self && current.find(p => p.userID === self.userID);
                if (remoteSelf) console.info('[IM] 资料校验', JSON.stringify({
                    businessHasAvatar: !!self.avatarURL, sdkHasAvatar: !!remoteSelf.avatarURL,
                    avatarMatches: self.avatarURL === remoteSelf.avatarURL,
                    nicknameMatches: self.nickname === remoteSelf.nickname
                }));
                // Current business profile is authoritative for the signed-in user.
                profiles.push(...current.filter(p => !self || p.userID !== self.userID));
            }
            emit();
        } catch (error) { console.warn('[IM] 最新资料读取失败', error && error.code); }
        // #endif
    });
    // 同步监听身份变化；即使短时间退出后又登录同一用户，也清理旧的异步任务。
    Store.watch(() => JSON.stringify(currentAccount()), () => syncIMLogin(), { immediate: true, sync: true });
    Store.watch(() => JSON.stringify(businessProfile(Store.state.vuex_user, apiUrl)), () => syncProfile());
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
    return session.sync(account).then(syncExtras);
}
export function retryIMLogin() { return session.sync(currentAccount(), true); }
export function getIMClient() { return session.getClient(); }
