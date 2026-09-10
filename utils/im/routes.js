export function singleChatID(value, selfID = '') {
    const input = String(value || '').trim();
    const userID = /^user_[1-9]\d*$/.test(input) ? input : (/^[1-9]\d*$/.test(input) ? 'user_' + input : '');
    if (!userID) throw new Error('请输入正确的用户数字 ID');
    if (userID === selfID) throw new Error('请选择其他用户发起聊天');
    return 'c2c_' + userID;
}
export function chatURL(conversationID) {
    if (!/^c2c_user_[1-9]\d*$/.test(conversationID)) throw new Error('暂仅支持用户单聊');
    return '/pages/im/chat?conversationID=' + encodeURIComponent(conversationID);
}
