import Store from '@/store';
import { apiUrl, customer_id, api_key, app_id, appExamine } from '@/utils/config.js';

// App service only: credentials must never be read directly by an nvue page.
export function requestPhoneUserID(phone) {
    const user = Store.state.vuex_user || {};
    const client = Store.state.vuex_client || '';
    if (!(Number(user.user_id) > 0) || !user.token || !client) {
        return Promise.reject(new Error('请先登录账号'));
    }
    return new Promise((resolve, reject) => {
        uni.request({
            url: apiUrl + '/xingyun_chat/api/index.php?m=im&a=search_user&user_agent=third_program_h5&request_mode=fortune_app&third_token=' + encodeURIComponent(user.token),
            method: 'POST',
            timeout: 15000,
            header: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
            data: {
                customer_id, api_key, app_id, app_examine: appExamine,
                phone, client, xd_client: client,
                login_token: user.login_token || '',
                mini_user_token: client === 'mini_pro' ? user.token : ''
            },
            success(res) {
                const body = res.data;
                if (res.statusCode !== 200 || !body || Number(body.errcode) !== 0) {
                    reject(new Error((body && body.errmsg) || '查找用户失败'));
                    return;
                }
                resolve(body.data && body.data.userID ? String(body.data.userID) : '');
            },
            fail() { reject(new Error('网络异常，请稍后重试')); }
        });
    });
}
