<template>
    <view class="page">
        <view v-if="userID" class="card">
            <image class="avatar" :src="avatar" mode="aspectFill" />
            <text class="name">{{ nickname }}</text>
            <text class="user-id">用户 ID：{{ userID }}</text>
            <canvas canvas-id="profile-qr" id="profile-qr" class="qr" :style="{ width: size + 'px', height: size + 'px' }" />
            <text class="hint">在星云 IM「添加」中扫一扫，添加我为好友</text>
        </view>
        <text v-if="error" class="error" @tap="renderQR">{{ error }}，点击重试</text>
        <button class="save" :disabled="!ready || saving" @tap="saveQR">{{ saving ? '保存中…' : '保存二维码到相册' }}</button>
        <text class="privacy">二维码仅包含公开用户 ID，不包含登录信息或手机号。</text>
    </view>
</template>
<script>
import { customer_id, apiUrl } from '@/utils/config.js';
import { profileQRMatrix, drawProfileQR } from '@/utils/im/qr-code.js';
import { businessProfile } from '@/utils/im/profile.js';
export default {
    data() { return { userID: '', size: 264, ready: false, saving: false, error: '', closed: false }; },
    computed: {
        profile() { return businessProfile(this.vuex_user, apiUrl); },
        nickname() { return (this.profile && this.profile.nickname) || this.userID; },
        avatar() { return (this.profile && this.profile.avatarURL) || '/static/images/default-head.png'; }
    },
    onLoad() {
        const user = this.vuex_user || {};
        if (!user.token || !(Number(user.user_id) > 0)) { uni.redirectTo({ url: '/public/pages/user/login' }); return; }
        this.userID = 'user_' + user.user_id;
        this.size = Math.min(264, uni.getSystemInfoSync().windowWidth - 72);
    },
    onReady() { if (this.userID) this.renderQR(); },
    onShow() {
        if (this.userID && (!(this.vuex_user || {}).token || this.userID !== 'user_' + (this.vuex_user || {}).user_id)) {
            this.ready = false;
            uni.navigateBack();
        }
    },
    onUnload() { this.closed = true; },
    methods: {
        renderQR() {
            this.ready = false;
            this.error = '';
            try {
                const context = uni.createCanvasContext('profile-qr', this);
                drawProfileQR(context, profileQRMatrix(this.userID, customer_id), this.size);
                context.draw(false, () => {
                    if (!this.closed && (this.vuex_user || {}).token && this.userID === 'user_' + (this.vuex_user || {}).user_id) this.ready = true;
                });
            } catch (error) { this.error = error.message || '二维码生成失败'; }
        },
        saveQR() {
            if (!this.ready || this.saving || !(this.vuex_user || {}).token || this.userID !== 'user_' + (this.vuex_user || {}).user_id) return;
            this.saving = true;
            uni.canvasToTempFilePath({
                canvasId: 'profile-qr', width: this.size, height: this.size,
                destWidth: this.size * 4, destHeight: this.size * 4, fileType: 'png',
                success: result => {
                    if (this.closed || !(this.vuex_user || {}).token || this.userID !== 'user_' + (this.vuex_user || {}).user_id) { this.saving = false; return; }
                    uni.saveImageToPhotosAlbum({
                        filePath: result.tempFilePath,
                        success: () => uni.showToast({ title: '二维码已保存', icon: 'success' }),
                        fail: () => uni.showModal({ title: '保存失败', content: '请检查系统相册权限，允许后再试。', showCancel: false }),
                        complete: () => { this.saving = false; }
                    });
                },
                fail: () => { this.saving = false; uni.showToast({ title: '图片生成失败，请重试', icon: 'none' }); }
            }, this);
        }
    }
};
</script>
<style>
page { background: #f5f6f8; }
.page { padding: 32rpx 28rpx; }
.card { display: flex; flex-direction: column; align-items: center; padding: 44rpx 20rpx 36rpx; background: #fff; border-radius: 28rpx; }
.avatar { width: 120rpx; height: 120rpx; border-radius: 60rpx; background: #eef2f6; }
.name { margin-top: 20rpx; font-size: 36rpx; font-weight: 600; color: #17212f; }
.user-id { margin-top: 12rpx; font-size: 24rpx; color: #748299; }
.qr { margin-top: 24rpx; }
.hint { margin-top: 12rpx; font-size: 24rpx; color: #748299; text-align: center; }
.save { margin-top: 36rpx; border-radius: 24rpx; color: #fff; background: #2563eb; font-size: 28rpx; }
.privacy { display: block; margin-top: 24rpx; text-align: center; color: #8992a3; font-size: 22rpx; }
.error { display: block; text-align: center; color: #d64949; padding: 24rpx; }
</style>
