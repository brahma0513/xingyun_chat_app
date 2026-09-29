<template>
    <view class="page">
        <text class="title">扫一扫添加好友</text>
        <text class="hint">支持拍摄或从相册识别星云 IM 个人二维码</text>
        <button class="scan" :disabled="scanning" @tap="scan">{{ scanning ? '识别中…' : '打开扫一扫' }}</button>
        <text v-if="error" class="error">{{ error }}</text>
    </view>
</template>
<script>
import { customer_id } from '@/utils/config.js';
import { parseProfileQR } from '@/utils/im/qr-code.js';
export default {
    data() { return { scanning: false, error: '', closed: false }; },
    onReady() { this.scan(); },
    onUnload() { this.closed = true; },
    methods: {
        scan() {
            if (this.scanning) return;
            const user = this.vuex_user || {};
            if (!user.token || !(Number(user.user_id) > 0)) { uni.redirectTo({ url: '/public/pages/user/login' }); return; }
            const selfID = 'user_' + user.user_id;
            this.error = '';
            this.scanning = true;
            uni.scanCode({
                onlyFromCamera: false, scanType: ['qrCode'],
                success: result => {
                    if (this.closed) return;
                    if (!(this.vuex_user || {}).token || selfID !== 'user_' + (this.vuex_user || {}).user_id) { this.error = '账号已变化，请重新扫描'; return; }
                    try {
                        const userID = parseProfileQR(result.result, customer_id, selfID);
                        uni.$userProfileData = null;
                        uni.redirectTo({ url: '/pages/im/user-profile?userID=' + encodeURIComponent(userID),
                            fail: () => { this.error = '打开资料失败，请重试'; } });
                    } catch (error) { this.error = error.message; }
                },
                fail: error => {
                    if (!this.closed && !/cancel/i.test((error && error.errMsg) || '')) this.error = '无法扫码，请检查相机权限后重试';
                },
                complete: () => { this.scanning = false; }
            });
        }
    }
};
</script>
<style>
page { background: #f5f6f8; }
.page { padding: 100rpx 40rpx; text-align: center; }
.title { display: block; font-size: 38rpx; font-weight: 600; color: #17212f; }
.hint { display: block; margin-top: 24rpx; font-size: 26rpx; color: #748299; }
.scan { margin-top: 64rpx; color: #fff; background: #2563eb; border-radius: 24rpx; }
.error { display: block; margin-top: 32rpx; color: #d64949; font-size: 26rpx; }
</style>
