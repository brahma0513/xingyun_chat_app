// Hybrid success means the bridge call completed; the nested operation can still require verification.
export function friendOperationResult(response) {
    const decode = value => typeof value === 'string' ? JSON.parse(value) : value;
    const result = decode(response);
    if (!result || result.code == null || typeof result.code === 'boolean' || !Number.isInteger(Number(result.code))) throw new Error('好友操作返回格式不正确');
    if (Number(result.code) !== 0) return { ...result, code: Number(result.code) };
    let data = result.data, operation = result;
    for (let depth = 0; data != null && depth < 4; depth++) {
        const value = decode(data);
        if (!value || typeof value !== 'object') break;
        const code = value.resultCode != null ? value.resultCode : value.code;
        if (code != null) {
            if (typeof code === 'boolean' || !Number.isInteger(Number(code))) throw new Error('好友操作结果不明确');
            operation = { ...value, code: Number(code), message: value.resultInfo || value.message || result.message || '' };
            if (operation.code !== 0) break;
        }
        data = value.data;
    }
    return operation;
}
