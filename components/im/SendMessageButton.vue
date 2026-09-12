<template>
    <view v-if="canChat" class="send-message" @tap.stop="open">发消息</view>
</template>
<script>
import { singleChatID, chatURL } from '@/utils/im/routes.js';
export default {
    props: { userId: { type: [String, Number], required: true }, nickname: { type: String, default: '' } },
    computed: {
        canChat() { return /^[1-9]\d*$/.test(String(this.userId)) && String(this.userId) !== String(this.vuex_user.user_id); }
    },
    methods: {
        open() {
            if (!this.vuex_user.token) { uni.navigateTo({ url: '/public/pages/user/login' }); return; }
            try {
                const url = chatURL(singleChatID(this.userId, 'user_' + this.vuex_user.user_id));
                const accountSessionID = this.vuex_im && this.vuex_im.accountSessionID;
                uni.navigateTo({ url: url + (accountSessionID ? '&accountSessionID=' + accountSessionID : '') + '&title=' + encodeURIComponent(this.nickname.slice(0, 64)),
                    fail() { uni.showToast({ title: '打开聊天失败，请重试', icon: 'none' }); } });
            } catch (error) { uni.showToast({ title: error.message, icon: 'none' }); }
        }
    }
};
</script>
<style scoped>
.send-message { display: inline-block; padding: 12rpx 22rpx; margin: 10rpx 0; border-radius: 28rpx; background: #2878ff; color: #fff; font-size: 24rpx; text-align: center; }
</style>
