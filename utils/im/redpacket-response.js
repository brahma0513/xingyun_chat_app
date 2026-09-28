// Do not expose HTML/PHP responses or request credentials in payment errors.
export function parseRedPacketResponse(response) {
    const status = Number(response && response.statusCode);
    const fail = (message, code) => { const error = new Error(message); error.code = code; throw error; };
    if (status !== 200) {
        if (status === 404) fail('红包服务暂不可用，请联系平台管理员检查部署（HTTP 404）', 'RP_HTTP_404');
        if (status === 401 || status === 403) fail('红包服务访问失败，请重新登录后核对原红包（HTTP ' + status + '）', 'RP_HTTP_' + status);
        fail('红包服务异常（HTTP ' + (status || '未知') + '），请刷新核对原红包', 'RP_HTTP_' + (status || 'UNKNOWN'));
    }
    let body = response.data;
    if (typeof body === 'string') {
        try { body = JSON.parse(body.replace(/^\uFEFF/, '').trim()); }
        catch (_) { fail('红包服务返回格式异常，请联系平台管理员并核对原红包', 'RP_INVALID_RESPONSE'); }
    }
    if (!body || typeof body !== 'object' || Array.isArray(body) ||
        !Object.prototype.hasOwnProperty.call(body, 'errcode') ||
        !/^[0-9]+$/.test(String(body.errcode))) {
        fail('红包服务返回格式异常，请联系平台管理员并核对原红包', 'RP_INVALID_RESPONSE');
    }
    if (Number(body.errcode) === 0 && (!body.data || typeof body.data !== 'object' || Array.isArray(body.data))) {
        fail('红包服务返回数据不完整，请刷新核对原红包', 'RP_INVALID_RESPONSE');
    }
    return body;
}
