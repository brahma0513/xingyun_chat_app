<template>
    <view class="page">
        <scroll-view scroll-y class="content">
            <view class="identity">
                <image class="avatar" :src="avatar" mode="aspectFill" @tap="editAvatar" />
                <text class="identity-name">{{ name || '未设置昵称' }}</text>
                <text class="identity-hint" @tap="editAvatar">点击修改头像</text>
            </view>

            <view class="card">
                <view class="row" @tap="copyUserID">
                    <text class="label">用户 ID</text>
                    <text class="value">{{ imUserID }}</text>
                    <text class="arrow">复制</text>
                </view>
                <view class="row">
                    <text class="label">昵称</text>
                    <input class="field" v-model="name" maxlength="16" placeholder="请输入昵称" />
                </view>
                <picker :range="genderLabels" :value="genderIndex" @change="onGenderChange">
                    <view class="row">
                        <text class="label">性别</text>
                        <text class="value">{{ genderLabels[genderIndex] }}</text>
                        <text class="arrow">›</text>
                    </view>
                </picker>
                <picker mode="date" :value="birthday || '2000-01-01'" start="1900-01-01" :end="today" @change="onBirthdayChange">
                    <view class="row">
                        <text class="label">生日</text>
                        <text class="value" :class="{ empty: !birthday }">{{ birthday || '请选择' }}</text>
                        <text class="arrow">›</text>
                    </view>
                </picker>
                <view v-if="birthday" class="clear-row" @tap="birthday = ''"><text>清除生日</text></view>
                <view class="row">
                    <text class="label">地区</text>
                    <input class="field" v-model="region" maxlength="64" placeholder="填写所在地区" />
                </view>
            </view>

            <view class="card signature-card">
                <text class="label">个性签名</text>
                <textarea class="signature" v-model="signature" maxlength="100" placeholder="介绍一下自己" />
                <text class="counter">{{ signature.length }}/100</text>
            </view>
            <text class="privacy-hint">个性签名会展示给其他用户；生日和地区仅自己可见。</text>
            <text v-if="loadError" class="error" @tap="loadMetadata">{{ loadError }}，点击重试</text>
        </scroll-view>
        <view class="footer">
            <button class="save" :disabled="saving || !loaded" @tap="save">{{ saving ? '保存中…' : '保存资料' }}</button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            userID: 0, name: '', sex: 0, birthday: '', region: '', signature: '',
            loaded: false, saving: false, loadError: '', genderLabels: ['男', '女'], returningFromAvatar: false
        };
    },
    computed: {
        imUserID() { return 'user_' + this.userID; },
        genderIndex() { return this.sex === 2 ? 1 : 0; },
        avatar() { return this.vuex_user.headimgurl || '/static/images/default-head.png'; },
        today() {
            const now = new Date();
            return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
        }
    },
    onLoad() {
        const user = this.vuex_user || {};
        this.userID = Number(user.user_id) || 0;
        if (!this.userID) { uni.redirectTo({ url: '/public/pages/user/login' }); return; }
        this.name = user.weixin_name || user.name || '';
        this.sex = Number(user.sex) === 2 ? 2 : 1;
        this.loadMetadata();
    },
    onShow() {
        if (!this.returningFromAvatar) return;
        this.returningFromAvatar = false;
        this.name = this.vuex_user.weixin_name || this.vuex_user.name || '';
        this.sex = Number(this.vuex_user.sex) === 2 ? 2 : 1;
    },
    methods: {
        editAvatar() {
            this.returningFromAvatar = true;
            uni.navigateTo({ url: '/public/pages/user/editdata' });
        },
        loadMetadata() {
            this.loaded = false;
            this.loadError = '';
            this.$api.imProfileInfo({}).then(res => {
                if (Number(this.vuex_user.user_id) !== this.userID) return;
                if (!res || Number(res.errcode) !== 0 || !res.data) throw new Error((res && res.errmsg) || '读取失败');
                this.birthday = res.data.birthday || '';
                this.region = res.data.region || '';
                this.signature = res.data.signature || '';
                this.loaded = true;
            }).catch(error => { this.loadError = (error && error.message) || '资料读取失败'; });
        },
        copyUserID() {
            uni.setClipboardData({ data: this.imUserID, success() { uni.showToast({ title: '用户 ID 已复制', icon: 'none' }); } });
        },
        onGenderChange(event) { this.sex = Number(event.detail.value) + 1; },
        onBirthdayChange(event) { this.birthday = event.detail.value; },
        async save() {
            if (this.saving || !this.loaded) return;
            if (Number(this.vuex_user.user_id) !== this.userID) { uni.showToast({ title: '登录账号已变化，请重新打开', icon: 'none' }); return; }
            const name = String(this.name || '').trim();
            const region = String(this.region || '').trim();
            const signature = String(this.signature || '').trim();
            if (!name || Array.from(name).length > 16) { uni.showToast({ title: '昵称需为 1～16 个字', icon: 'none' }); return; }
            if (Array.from(region).length > 64 || Array.from(signature).length > 100) { uni.showToast({ title: '地区或签名过长', icon: 'none' }); return; }
            this.saving = true;
            let businessSaved = false;
            try {
                const user = this.vuex_user;
                const business = await this.$api.editProfile({ name, sex: this.sex, headimgurl: user.headimgurl });
                if (!business || Number(business.errcode) !== 0) throw new Error((business && business.errmsg) || '昵称保存失败');
                businessSaved = true;
                if (Number(this.vuex_user.user_id) !== this.userID) throw new Error('登录账号已变化');
                this.$store.commit('$uStore', { name: 'vuex_user', value: {
                    ...this.vuex_user, weixin_name: name, name, sex: Number(business.data && business.data.userinfo && business.data.userinfo.sex) || this.sex,
                    headimgurl: (business.data && business.data.userinfo && business.data.userinfo.headimgurl) || user.headimgurl
                } });
                const metadata = await this.$api.imProfileSave({ birthday: this.birthday, region, signature });
                if (!metadata || Number(metadata.errcode) !== 0) throw new Error((metadata && metadata.errmsg) || '扩展资料保存失败');
                if (Number(this.vuex_user.user_id) !== this.userID) throw new Error('登录账号已变化');
                this.$store.commit('$uStore', { name: 'vuex_user', value: {
                    ...this.vuex_user, im_birthday: this.birthday, im_region: region, im_signature: signature, imProfileLoaded: true
                } });
                uni.showToast({ title: '资料已保存', icon: 'none' });
                setTimeout(() => uni.navigateBack(), 500);
            } catch (error) {
                uni.showToast({ title: (businessSaved ? '昵称已保存；' : '') + ((error && error.message) || '保存失败'), icon: 'none', duration: 3000 });
            } finally { this.saving = false; }
        }
    }
};
</script>

<style>
page, .page { height: 100%; background: #f5f6f8; }
.page { display: flex; flex-direction: column; }
.content { flex: 1; min-height: 0; }
.identity { display: flex; flex-direction: column; align-items: center; padding: 44rpx 0 36rpx; }
.avatar { width: 136rpx; height: 136rpx; border-radius: 68rpx; background: #e9edf2; }
.identity-name { margin-top: 18rpx; color: #17212f; font-size: 34rpx; font-weight: 600; }
.identity-hint { margin-top: 8rpx; color: #8992a3; font-size: 23rpx; }
.card { margin: 0 24rpx 24rpx; padding: 0 24rpx; border-radius: 20rpx; background: #fff; }
.row { display: flex; align-items: center; min-height: 104rpx; border-bottom: 1rpx solid #edf0f4; }
.row:last-child { border-bottom: none; }
.clear-row { padding: 10rpx 0 18rpx; text-align: right; color: #8992a3; font-size: 23rpx; }
.label { width: 150rpx; flex-shrink: 0; color: #17212f; font-size: 28rpx; }
.field { flex: 1; text-align: right; color: #333; font-size: 28rpx; }
.value { flex: 1; text-align: right; color: #333; font-size: 28rpx; }
.empty { color: #9aa2af; }
.arrow { margin-left: 16rpx; color: #9aa2af; font-size: 25rpx; }
.signature-card { display: flex; flex-direction: column; padding-top: 28rpx; padding-bottom: 20rpx; }
.signature { width: 100%; height: 170rpx; margin-top: 20rpx; color: #333; font-size: 28rpx; }
.counter { align-self: flex-end; color: #9aa2af; font-size: 23rpx; }
.privacy-hint { display: block; margin: 0 32rpx 24rpx; color: #8992a3; font-size: 23rpx; }
.error { display: block; margin: 0 24rpx 24rpx; color: #d45b5b; font-size: 25rpx; }
.footer { padding: 20rpx 24rpx 40rpx; background: #fff; }
.save { height: 88rpx; line-height: 88rpx; border-radius: 44rpx; background: #2878ff; color: #fff; font-size: 30rpx; }
.save[disabled] { opacity: .5; }
</style>
