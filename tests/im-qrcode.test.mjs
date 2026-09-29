import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import qrcode from 'qrcode-generator';
import jsQR from 'jsqr';

const read = name => fs.readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const source = read('utils/im/qr-code.js').replace(/^import .*$/gm, '').replace(/export function /g, 'function ');
const context = { qrcode, module: { exports: {} } };
vm.runInNewContext(source + '\nmodule.exports = { profileQRPayload, parseProfileQR, profileQRMatrix, drawProfileQR };', context);
const { profileQRPayload, parseProfileQR, profileQRMatrix, drawProfileQR } = context.module.exports;

test('personal QR contains only a versioned tenant and public identity', () => {
    assert.equal(profileQRPayload('user_12', 9006), 'xingyunim://profile/v1/9006/user_12');
    assert.equal(parseProfileQR(profileQRPayload('user_12', 9006), 9006, 'user_13'), 'user_12');
    for (const id of ['', 'user_0', 'user_01', '12', 'user_12?token=secret', 'user_' + '1'.repeat(21)]) {
        assert.throws(() => profileQRPayload(id, 9006));
    }
});

test('scanning rejects self, another platform and arbitrary links or malformed payloads', () => {
    assert.throws(() => parseProfileQR(profileQRPayload('user_12', 9006), 9006, 'user_12'), /自己/);
    assert.throws(() => parseProfileQR(profileQRPayload('user_12', 9007), 9006), /当前平台/);
    for (const value of ['https://example.com', 'user_12', 'xingyunim://profile/v2/9006/user_12',
        'xingyunim://profile/v1/9006/user_12?token=secret', 'xingyunim://profile/v1/9006/user_0']) {
        assert.throws(() => parseProfileQR(value, 9006));
    }
});

test('rendered personal QR has a quiet zone and decodes with an independent standard decoder', () => {
    for (const [userID, size] of [['user_12', 264], ['user_12345678901234567890', 248]]) {
        const pixels = new Uint8ClampedArray(size * size * 4);
        let color = 255;
        const canvas = {
            setFillStyle(value) { color = value === '#ffffff' ? 255 : 23; },
            fillRect(x, y, width, height) {
                for (let row = y; row < y + height; row++) for (let col = x; col < x + width; col++) {
                    const offset = (row * size + col) * 4;
                    pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = color;
                    pixels[offset + 3] = 255;
                }
            }
        };
        drawProfileQR(canvas, profileQRMatrix(userID, 9006), size);
        assert.equal(pixels[0], 255);
        const decoded = jsQR(pixels, size, size);
        assert.ok(decoded, 'QR must be readable');
        assert.equal(decoded.data, profileQRPayload(userID, 9006));
    }
});

function scannerFixture() {
    let options, target;
    const source = read('pages/im/scan.vue').match(/<script>([\s\S]*?)<\/script>/)[1]
        .replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
    const env = { module: { exports: {} }, customer_id: 9006, parseProfileQR,
        uni: { scanCode(value) { options = value; }, redirectTo(value) { target = value.url; } } };
    vm.runInNewContext(source, env);
    const component = env.module.exports;
    const page = { ...component.data(), vuex_user: { user_id: 13, token: 'test-token' } };
    component.methods.scan.call(page);
    return { page, options, target: () => target };
}

test('scan opens the profile for confirmation rather than sending a friend request', () => {
    const fixture = scannerFixture();
    fixture.options.success({ result: profileQRPayload('user_12', 9006) });
    fixture.options.complete();
    assert.equal(fixture.target(), '/pages/im/user-profile?userID=user_12');
    assert.equal(fixture.page.scanning, false);
    assert.doesNotMatch(read('pages/im/scan.vue'), /\.addFriend\(/);
});

test('scan does not navigate for self, cancellation, unloaded page or account change', () => {
    const self = scannerFixture();
    self.options.success({ result: profileQRPayload('user_13', 9006) });
    assert.match(self.page.error, /自己/); assert.equal(self.target(), undefined);
    const cancelled = scannerFixture();
    cancelled.options.fail({ errMsg: 'scanCode:fail cancel' });
    assert.equal(cancelled.page.error, '');
    const changed = scannerFixture();
    changed.page.vuex_user.user_id = 14;
    changed.options.success({ result: profileQRPayload('user_12', 9006) });
    assert.equal(changed.target(), undefined); assert.match(changed.page.error, /账号已变化/);
    const closed = scannerFixture();
    closed.page.closed = true;
    closed.options.success({ result: profileQRPayload('user_12', 9006) });
    assert.equal(closed.target(), undefined);
});

test('QR pages and native modules are registered and both personal entry points are present', () => {
    const pages = JSON.parse(read('pages.json')).pages.map(p => p.path);
    assert.ok(pages.includes('pages/im/my-qrcode'));
    assert.ok(pages.includes('pages/im/scan'));
    assert.match(read('pages/im/conversations.nvue'), /openMyQRCode/);
    assert.match(read('pages/im/edit-profile.vue'), /openQRCode/);
    assert.match(read('pages/im/add-friend.nvue'), /pages\/im\/scan/);
    assert.match(read('manifest.json'), /"Barcode"\s*:\s*\{\}/);
    assert.match(read('manifest.json'), /"Camera"\s*:\s*\{\}/);
});
