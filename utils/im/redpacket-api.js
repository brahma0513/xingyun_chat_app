import Store from '@/store';
import { apiUrl, customer_id, api_key, app_id, appExamine } from '@/utils/config.js';
import { createRedPacketDraft, sameRedPacketIntent } from './redpacket.js';
import { parseRedPacketResponse } from './redpacket-response.js';

let registered = false;
const inFlight = new Set();
export function startRedPacketBridge() {
    if (registered) return;
    registered = true;
    uni.$on('im:redpacket-request', async event => {
        if (!event || !event.requestID || !['options', 'send', 'detail', 'claim'].includes(event.action)) return;
        const user = Store.state.vuex_user || {}, status = Store.state.vuex_im || {};
        const live = () => {
            const current = Store.state.vuex_user || {}, im = Store.state.vuex_im || {};
            return !!current.token && String(current.user_id) === String(user.user_id) && im.accountSessionID === event.accountSessionID;
        };
        const reply = value => { if (live()) uni.$emit('im:redpacket-result', { requestID: event.requestID, ...value }); };
        if (!user.token || event.userID !== 'user_' + user.user_id || status.accountSessionID !== event.accountSessionID) {
            uni.$emit('im:redpacket-result', { requestID: event.requestID, error: '登录状态已变化，请重新进入聊天' }); return;
        }
        if (!/^https:\/\//i.test(apiUrl)) { reply({ error: '红包支付需要 HTTPS 连接' }); return; }
        const data = event.data || {};
        const key = 'im-redpacket-draft:' + customer_id + ':' + user.user_id + ':' + data.receiver_id;
        let ownsFlight = false;
        try {
            let payload = { ...data };
            if (event.action === 'send') {
                const existing = uni.getStorageSync(key);
                if (existing && !sameRedPacketIntent(existing, payload)) throw new Error('上一个红包待核对，请先刷新原红包');
                if (inFlight.has(key)) throw new Error('红包正在处理，请稍候');
                // Password is deliberately excluded from durable storage.
                const { pay_password, ...intent } = payload;
                uni.setStorageSync(key, intent); inFlight.add(key); ownsFlight = true;
            }
            let result = await post(event.action, payload, user);
            if (!live()) return;
            if (Number(result.errcode) !== 0) {
                if (event.action === 'send' && [40001,40003,40005,40006,50301].includes(Number(result.errcode))) uni.removeStorageSync(key);
                const error = new Error(result.errmsg || '红包操作失败'); error.code = result.errcode; throw error;
            }
            let output = result.data;
            if (event.action === 'options') output = { ...output, draft: uni.getStorageSync(key) || createRedPacketDraft(data.receiver_id) };
            if (event.action === 'send') {
                const stored = uni.getStorageSync(key);
                if (stored) uni.setStorageSync(key, { ...stored, packet_id: output.packet_id });
                if (output.status === 'failed' || (output.status === 'pending' && Number(output.message_sent) === 1)) uni.removeStorageSync(key);
            }
            if (['detail', 'claim'].includes(event.action)) {
                const stored = uni.getStorageSync(key);
                if (stored && stored.packet_id === output.packet_id &&
                    (['claimed','refunded','failed'].includes(output.status) || (output.status === 'pending' && Number(output.message_sent) === 1))) uni.removeStorageSync(key);
            }
            reply({ data: output });
            if (output && output.packet_id) uni.$emit('im:redpacket-updated', { ...output, accountSessionID: event.accountSessionID });
        } catch (error) { reply({ error: error.message || '网络异常，请刷新核对原红包', code: error.code }); }
        finally { if (ownsFlight) inFlight.delete(key); }
    });
}

function post(action, data, user) {
    const client = Store.state.vuex_client || '';
    return new Promise((resolve, reject) => {
        uni.request({
            url: apiUrl + '/xingyun_chat/api/index.php?m=redpacket&a=' + action + '&user_agent=third_program_h5&request_mode=fortune_app&third_token=' + encodeURIComponent(user.token),
            method: 'POST', timeout: 40000, dataType: 'json',
            header: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
            data: { ...data, customer_id, api_key, app_id, app_examine: appExamine, client, xd_client: client,
                login_token: user.login_token || '', mini_user_token: client === 'mini_pro' ? user.token : '' },
            success(response) {
                try { resolve(parseRedPacketResponse(response)); }
                catch (error) {
                    console.warn('[IM红包] 接口响应异常', JSON.stringify({ action, httpStatus: response.statusCode, responseType: typeof response.data, code: error.code }));
                    reject(error);
                }
            },
            fail() { reject(new Error('网络结果不明确，请刷新核对原红包，勿重复新建')); }
        });
    });
}
