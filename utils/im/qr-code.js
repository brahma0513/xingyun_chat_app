import qrcode from 'qrcode-generator';

// Public identity only. Tenant scoping prevents IDs from another deployment being resolved locally.
export function profileQRPayload(userID, customerID) {
    if (!/^user_[1-9]\d{0,19}$/.test(String(userID)) || !/^[1-9]\d{0,19}$/.test(String(customerID))) {
        throw new Error('用户身份无效');
    }
    return 'xingyunim://profile/v1/' + customerID + '/' + userID;
}

export function parseProfileQR(value, customerID, selfID = '') {
    const match = /^xingyunim:\/\/profile\/v1\/([1-9]\d{0,19})\/(user_[1-9]\d{0,19})$/.exec(String(value || '').trim());
    if (!match) throw new Error('不是有效的星云 IM 个人二维码');
    if (match[1] !== String(customerID)) throw new Error('该二维码不属于当前平台');
    if (match[2] === selfID) throw new Error('这是你自己的二维码');
    return match[2];
}

export function profileQRMatrix(userID, customerID) {
    const code = qrcode(0, 'M');
    code.addData(profileQRPayload(userID, customerID));
    code.make();
    const count = code.getModuleCount();
    return Array.from({ length: count }, (_, row) => Array.from({ length: count }, (_, col) => code.isDark(row, col)));
}

export function drawProfileQR(context, matrix, size) {
    const cell = Math.floor(size / (matrix.length + 8));
    const offset = Math.floor((size - matrix.length * cell) / 2);
    context.setFillStyle('#ffffff');
    context.fillRect(0, 0, size, size);
    context.setFillStyle('#17212f');
    matrix.forEach((row, y) => row.forEach((dark, x) => {
        if (dark) context.fillRect(offset + x * cell, offset + y * cell, cell, cell);
    }));
}
