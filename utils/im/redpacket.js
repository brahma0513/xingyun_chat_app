export const REDPACKET_BUSINESS_ID = 'xingyun_redpacket';
export const REDPACKET_ASSETS = { pocket_money: '零钱', currency: '购物币', integral: '积分' };

export function parseRedPacket(message) {
    try {
        const raw = message && message.messagePayload && message.messagePayload.customData;
        const value = typeof raw === 'string' ? JSON.parse(raw) : null;
        if (!value || value.businessID !== REDPACKET_BUSINESS_ID || value.version !== 1 ||
            !/^[a-f0-9]{32}$/.test(value.packet_id || '') || !REDPACKET_ASSETS[value.asset]) return null;
        const packet = { packet_id: value.packet_id, asset: value.asset, blessing: String(value.blessing || '恭喜发财，大吉大利').slice(0, 60) };
        if (typeof value.asset_name === 'string' && /^[^\x00-\x1f\x7f<>]{1,20}$/u.test(value.asset_name)) packet.asset_name = value.asset_name;
        return packet;
    } catch (_) { return null; }
}

export function validateRedPacketAmount(value, asset) {
    if (!REDPACKET_ASSETS[asset]) return '请选择资产类型';
    const text = String(value || '');
    if (!(asset === 'integral' ? /^[1-9]\d{0,6}$/ : /^(0|[1-9]\d{0,6})(\.\d{1,2})?$/).test(text) || Number(text) <= 0) {
        return asset === 'integral' ? '积分请输入正整数' : '请输入大于零的金额，最多两位小数';
    }
    if (Number(text) > (asset === 'integral' ? 100000000 : 1000000)) return '红包金额超出范围';
    return '';
}

// nvue carries only the payment form and sanitized results. Business credentials stay in App service.
export function requestRedPacket(action, data, context, timeout = 45000) {
    const requestID = 'rp-ui-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    return new Promise((resolve, reject) => {
        let timer;
        const cleanup = () => { clearTimeout(timer); uni.$off('im:redpacket-result', receive); };
        const receive = event => {
            if (!event || event.requestID !== requestID) return;
            cleanup();
            if (event.error) { const error = new Error(event.error); error.code = event.code; reject(error); }
            else resolve(event.data);
        };
        uni.$on('im:redpacket-result', receive);
        timer = setTimeout(() => { cleanup(); reject(new Error('请求超时，请重新打开红包核对结果，勿重复新建')); }, timeout);
        uni.$emit('im:redpacket-request', { requestID, action, data, userID: context.userID, accountSessionID: context.accountSessionID });
    });
}

export function createRedPacketDraft(receiverID, random = Math.random, now = Date.now) {
    return { receiver_id: String(receiverID), request_id: 'rp-' + now() + '-' + random().toString(36).slice(2) + '-' + random().toString(36).slice(2),
        asset: 'pocket_money', amount: '', blessing: '恭喜发财，大吉大利' };
}

// Keep the original non-secret intent after a timeout; retries MUST use the same ID and amounts.
export function sameRedPacketIntent(left, right) {
    return ['receiver_id', 'request_id', 'asset', 'amount', 'blessing'].every(key => String(left[key]) === String(right[key]));
}
