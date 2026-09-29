// UI input never uses floating point arithmetic to construct a payment amount.
export function redPacketAmountKey(value, key, asset) {
    let text = String(value || '');
    if (key === 'delete') return text.slice(0, -1);
    if (key === '.') return asset === 'integral' || text.includes('.') ? text : (text || '0') + '.';
    if (!/^\d$/.test(key)) return text;
    if (text.includes('.') && text.split('.')[1].length >= 2) return text;
    if (!text.includes('.') && text.length >= 7) return text;
    return text === '0' ? key : text + key;
}

export function redPacketIsSender(packet, context) {
    return !!packet && 'user_' + packet.sender_id === context.userID;
}

export function redPacketRoute(context, name, packetID = '', avatar = '') {
    const page = packetID ? 'redpacket-detail' : 'redpacket-send';
    const params = { userID: context.userID, accountSessionID: context.accountSessionID,
        conversationID: context.conversationID, name, packetID, avatar };
    return '/pages/im/' + page + '?' + Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key] == null ? '' : params[key])).join('&');
}

export function readRedPacketRoute(options) {
    // URL parameters are strings; the App bridge deliberately compares numeric session IDs strictly.
    const context = { userID: String(options.userID || ''), accountSessionID: Number(options.accountSessionID), conversationID: String(options.conversationID || '') };
    if (!/^user_[1-9]\d*$/.test(context.userID) || !/^c2c_user_[1-9]\d*$/.test(context.conversationID) ||
        !Number.isSafeInteger(context.accountSessionID) || context.accountSessionID <= 0) return null;
    return context;
}

export function decodeRedPacketParam(value) {
    try { return decodeURIComponent(String(value || '')); } catch (_) { return String(value || ''); }
}

export function redPacketNavigationError(error) {
    // Strip query data: routing diagnostics must not print profile URLs or account context.
    const reason = String(error && error.errMsg || 'navigateTo:fail unknown').replace(/\?[^\s"']*/g, '?[参数已省略]').slice(0, 300);
    if (/not found|does not exist|不存在|未注册/i.test(reason)) return { reason, message: '红包页面尚未加载，请停止运行后重新运行到手机' };
    if (/limit|maximum|最多|页面栈/i.test(reason)) return { reason, message: '打开的页面过多，请返回消息列表后重试' };
    if (/timeout|超时/i.test(reason)) return { reason, message: '红包页面跳转超时，请返回聊天后重试' };
    return { reason, message: '红包页面打开失败：' + reason.replace(/^navigateTo:fail\s*/i, '') };
}
