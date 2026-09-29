<template>
    <view class="page" :class="{ 'detail-page': showDetail }">
        <view v-if="!showDetail" class="backdrop" @tap="back" @touchmove.stop.prevent="">
            <image v-if="background" class="background-image" :class="{ 'background-image--ready': backgroundReady }" :src="background" mode="aspectFill" @load="backgroundReady = true" @error="backgroundReady = false" /><view class="shade" />
        </view>
        <view v-if="phase === 'loading'" class="loading"><text>{{ busy ? '正在打开红包…' : error || '正在连接…' }}</text><button v-if="!busy && canOperate" @tap="load">重试</button><button @tap="back">关闭</button></view>
        <view v-if="packet && !showDetail" class="envelope-stage" @touchmove.stop.prevent="">
            <view class="envelope">
                <view class="envelope-flap"><view class="ring ring-1" /><view class="ring ring-2" /><view class="ring ring-3" /><view class="ring ring-4" /></view>
                <view class="envelope-sender"><image class="small-avatar" :src="senderAvatar" mode="aspectFill" /><text>{{ senderName }}的红包</text></view>
                <text class="envelope-blessing">{{ packet.blessing }}</text>
                <button class="coin" aria-label="拆红包" :disabled="busy || phase !== 'envelope' || !canOperate" :class="{ spinning: phase === 'opening' }" @tap="claim"><text class="coin-word">开</text></button>
                <text class="envelope-tip">{{ phase === 'opening' ? '正在拆红包…' : '点击拆，领取红包' }}</text>
            </view>
            <text v-if="error" class="envelope-error">{{ error }}</text>
            <button class="close-envelope" :disabled="busy" @tap="back"><u-icon name="close" size="22" color="#ffffff" /></button>
        </view>
        <view v-if="showDetail" class="detail" :class="{ revealing: phase === 'expanding' }">
            <view class="red-header"><view :style="{ height: statusBar + 'px' }" /><view class="nav"><view class="back" @tap="back"><u-icon name="arrow-left" size="25" color="#fff4df" /></view><text class="nav-title">红包详情</text><view class="nav-space" /></view></view>
            <scroll-view class="detail-scroll" scroll-y>
                <view class="sender"><image class="sender-avatar" :src="senderAvatar" mode="aspectFill" /><text class="sender-title">{{ senderName }}发出的红包</text></view>
                <text class="detail-blessing">{{ packet.blessing }}</text>
                <view v-if="!isSender && packet.status === 'claimed' && packet.amount != null" class="claimed-amount"><text class="big-amount">{{ packet.amount }}</text><text class="amount-unit">{{ packet.asset === 'pocket_money' ? '元' : packet.asset_name }}</text></view>
                <text v-if="!isSender && packet.status === 'claimed'" class="credited">已存入{{ packet.asset_name }}账户</text>
                <view class="summary"><text>{{ summary }}</text></view>
                <view v-if="packet.status === 'claimed'" class="record">
                    <image class="record-avatar" :src="recipientAvatar" mode="aspectFill" /><view class="record-person"><text class="record-name">{{ isSender ? receiverName : '你' }}</text><text class="record-time">{{ claimedTime }}</text></view><text class="record-amount">{{ packet.amount }} {{ packet.asset === 'pocket_money' ? '元' : packet.asset_name }}</text>
                </view>
                <text v-if="isReview" class="status-tip">平台正在核对交易流水，请勿重新支付或重复新建红包</text>
                <text v-if="packet.status === 'pending' && !Number(packet.message_sent)" class="status-tip">红包已扣款，消息发送中，请勿重新支付</text>
                <text v-if="error" class="detail-error">{{ error }}</text>
                <button class="refresh" :disabled="busy || !canOperate" @tap="refresh">{{ busy ? '刷新中…' : '刷新领取状态' }}</button>
            </scroll-view>
            <text class="refund">未领取的红包，将于24小时后发起退款</text>
        </view>
        <view v-if="phase === 'expanding'" class="expand-envelope" />
    </view>
</template>
<script>
import page from '@/utils/im/redpacket-page.js';
import { redPacketIsSender } from '@/utils/im/redpacket-ui.js';
import { businessProfile } from '@/utils/im/profile.js';
import { apiUrl } from '@/utils/config.js';
export default {
    mixins: [page],
    data() { return { packetID: '', packet: null, phase: 'loading', background: '', backgroundReady: false, loaded: false }; },
    computed: {
        isSender() { return redPacketIsSender(this.packet, this.context || {}); },
        showDetail() { return !!this.packet && ['detail', 'expanding'].includes(this.phase); },
        isReview() { return this.packet && this.packet.status.includes('review'); },
        selfProfile() { return businessProfile(this.vuex_user, apiUrl) || {}; },
        senderName() { return this.isSender ? (this.selfProfile.nickname || '你') : this.receiverName; },
        senderAvatar() { return (this.isSender ? this.selfProfile.avatarURL : this.peerAvatar) || '/static/images/default-head.png'; },
        recipientAvatar() { return (this.isSender ? this.peerAvatar : this.selfProfile.avatarURL) || '/static/images/default-head.png'; },
        claimedTime() { const date = new Date(Number(this.packet.claimed_at) * 1000); return Number(this.packet.claimed_at) > 0 ? [date.getHours(), date.getMinutes(), date.getSeconds()].map(n => String(n).padStart(2, '0')).join(':') : '已领取'; },
        summary() {
            const packet = this.packet; if (!packet) return '';
            const total = packet.amount != null ? '红包' + (packet.asset === 'integral' ? '数量' : '金额') + packet.amount + (packet.asset === 'pocket_money' ? '元' : packet.asset_name) + '，' : '';
            if (packet.status === 'pending') return total + (this.isSender ? '等待对方领取' : '待领取');
            if (packet.status === 'claimed') return total + '已领取 1/1 个';
            return total + packet.status_text;
        }
    },
    watch: { background(value) { if (!value) this.backgroundReady = false; }, canOperate(value) { if (value && !this.loaded && !this.busy) this.load(); if (this.invalid) { this.background = ''; this.packet = null; this.phase = 'loading'; } } },
    onLoad(options) {
        this.packetID = String(options.packetID || '');
        if (!/^[a-f0-9]{32}$/.test(this.packetID)) { this.invalid = true; this.error = '红包编号无效'; }
        const channel = this.getOpenerEventChannel && this.getOpenerEventChannel();
        if (channel && channel.on) {
            this._backgroundChannel = channel;
            this._backgroundHandler = value => { if (!this.disposed && !this.invalid) this.background = value.image || ''; };
            channel.on('redpacket-background', this._backgroundHandler);
        }
    },
    onShow() { if (this.canOperate && this.packetID && !this.loaded) this.load(); },
    onHide() { this.loaded = false; this.background = ''; clearTimeout(this._revealTimer); if (this.packet) this.phase = this.isSender || !this.packet.can_claim ? 'detail' : 'envelope'; },
    onUnload() {
        clearTimeout(this._revealTimer); this.background = '';
        if (this._backgroundChannel && this._backgroundChannel.off) this._backgroundChannel.off('redpacket-background', this._backgroundHandler);
    },
    onBackPress() { return this.busy; },
    methods: {
        async load() {
            if (!/^[a-f0-9]{32}$/.test(this.packetID)) return;
            const packet = await this.run('detail', { packet_id: this.packetID });
            if (packet) { this.packet = packet; this.loaded = true; this.phase = this.isSender || !packet.can_claim ? 'detail' : 'envelope'; }
        },
        async claim() {
            if (this.phase !== 'envelope' || !this.packet || !this.packet.can_claim || this.isSender || !this.canOperate || this.busy) return;
            this.phase = 'opening'; const started = Date.now();
            const packet = await this.run('claim', { packet_id: this.packetID });
            if (!this.canOperate) return;
            if (!packet) { this.phase = 'envelope'; return; }
            this.packet = packet;
            if (packet.status !== 'claimed') { this.phase = packet.can_claim ? 'envelope' : 'detail'; return; }
            // Show the result only after the server has confirmed crediting the account.
            this._revealTimer = setTimeout(() => {
                if (!this.canOperate) return;
                this.phase = 'expanding';
                this._revealTimer = setTimeout(() => { if (this.canOperate) this.phase = 'detail'; }, 480);
            }, Math.max(0, 850 - (Date.now() - started)));
        },
        async refresh() { const packet = await this.run('detail', { packet_id: this.packetID }); if (packet) { this.packet = packet; this.phase = this.isSender || !packet.can_claim ? 'detail' : 'envelope'; } }
    }
};
</script>
<style>
page { background-color: transparent; }
</style>
<style scoped>
.page { position: fixed; inset: 0; background: transparent; color: #0F1220; }.detail-page { background: #fff; }.backdrop,.shade { position: absolute; inset: 0; }.backdrop { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }.background-image { position: absolute; inset: -12px; width: calc(100% + 24px); height: calc(100% + 24px); filter: blur(10px); opacity: 0; transition: opacity .22s ease-out; }.background-image--ready { opacity: 1; }
/* 遮罩淡入，与页面 fade-in 同步，背后聊天页保持渲染，不再出现白屏 */
.shade { background: rgba(12,14,24,.62); animation: shade-in .2s ease-out; }@keyframes shade-in { from { opacity: 0; } to { opacity: 1; } }
.loading { position: absolute; top: 40%; left: 40rpx; right: 40rpx; text-align: center; color: #fff3d9; font-size: 28rpx; }.loading button { margin-top: 25rpx; font-size: 26rpx; }
/* 信封：纯 CSS 绘制，与聊天红包卡片同一套配色 */
.envelope-stage { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.envelope { position: relative; width: 600rpx; height: 860rpx; max-width: 84vw; border-radius: 56rpx; background: #D93A28; overflow: hidden; box-shadow: 0 60rpx 120rpx -40rpx rgba(0,0,0,.7); animation: arrive .32s cubic-bezier(.2,.8,.2,1); }
.envelope-flap { position: absolute; top: 0; left: -10%; width: 120%; height: 560rpx; background: #E5482F; border-bottom: 4rpx solid #C5301F; border-radius: 0 0 50% 50% / 0 0 150rpx 150rpx; overflow: hidden; }
.ring { position: absolute; border: 2rpx solid #EE5E43; border-radius: 50%; }
.ring-1 { width: 120rpx; height: 120rpx; right: 40rpx; top: -20rpx; }.ring-2 { width: 200rpx; height: 200rpx; right: 0; top: -60rpx; }.ring-3 { width: 280rpx; height: 280rpx; right: -40rpx; top: -100rpx; }.ring-4 { width: 160rpx; height: 160rpx; left: 60rpx; top: 360rpx; }
.envelope-sender { position: absolute; top: 88rpx; left: 60rpx; right: 60rpx; display: flex; justify-content: center; align-items: center; gap: 14rpx; font-size: 28rpx; font-weight: 600; color: #FFE1D9; }.envelope-sender text { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.small-avatar { width: 60rpx; height: 60rpx; border-radius: 20rpx; flex-shrink: 0; box-shadow: 0 0 0 4rpx rgba(255,255,255,.35); }
.envelope-blessing { position: absolute; top: 208rpx; left: 56rpx; right: 56rpx; text-align: center; font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif; font-size: 50rpx; line-height: 70rpx; font-weight: 700; letter-spacing: 2rpx; color: #FFF4E6; max-height: 140rpx; overflow: hidden; }
.coin { padding: 0; margin: 0 0 0 -100rpx; border: none; position: absolute; top: 462rpx; left: 50%; width: 200rpx; height: 200rpx; border-radius: 50%; background: #FBD27A; box-shadow: inset 0 0 0 8rpx #F0B24A, inset 0 -16rpx 0 rgba(176,96,20,.18), 0 28rpx 52rpx -20rpx rgba(90,10,0,.75); transform-style: preserve-3d; perspective: 800px; }
.coin::after { border: none; }.coin[disabled] { background: #FBD27A; opacity: 1; }
.coin-word { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif; font-size: 80rpx; font-weight: 900; color: #A6231A; }
.spinning { animation: coin-spin .7s linear infinite; }
.envelope-tip { position: absolute; bottom: 64rpx; left: 50rpx; right: 50rpx; text-align: center; font-size: 26rpx; font-weight: 600; color: #FFD6CB; }
.envelope-error { text-align: center; margin: 20rpx 40rpx 0; color: #FFE1D9; font-size: 26rpx; }
.close-envelope { display: flex; align-items: center; justify-content: center; width: 96rpx; height: 96rpx; border: 3rpx solid rgba(255,255,255,.55); border-radius: 50%; background: transparent; margin-top: 48rpx; padding: 0; }.close-envelope::after { border: none; }
/* 详情页 */
.detail { position: absolute; inset: 0; display: flex; flex-direction: column; background: #fff; }
.red-header { position: relative; background: #E0452F; border-radius: 0 0 50% 50% / 0 0 64rpx 64rpx; border-bottom: 4rpx solid #F0B24A; padding-bottom: 56rpx; flex-shrink: 0; }
.nav { display: flex; height: 88rpx; align-items: center; justify-content: space-between; }.back,.nav-space { width: 100rpx; height: 88rpx; box-sizing: border-box; padding-left: 26rpx; display: flex; align-items: center; }.nav-title { color: #FFFFFF; font-size: 32rpx; font-weight: 600; }
.detail-scroll { flex: 1; height: 0; min-height: 0; }
.sender { margin: 60rpx 32rpx 16rpx; display: flex; align-items: center; justify-content: center; gap: 16rpx; }.sender-avatar { width: 72rpx; height: 72rpx; border-radius: 24rpx; flex-shrink: 0; }.sender-title { font-size: 34rpx; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.detail-blessing { display: block; padding: 0 48rpx; text-align: center; font-size: 28rpx; color: #6A7182; }
.claimed-amount { display: flex; justify-content: center; align-items: baseline; color: #9A6A12; margin-top: 56rpx; }.big-amount { font-size: 112rpx; font-weight: 800; letter-spacing: -2rpx; }.amount-unit { font-size: 30rpx; font-weight: 600; margin-left: 12rpx; }
.credited { display: table; margin: 16rpx auto 0; padding: 8rpx 24rpx; border-radius: 24rpx; background: #FFF4DC; text-align: center; color: #9A6A12; font-size: 24rpx; font-weight: 600; }
.summary { margin: 64rpx 32rpx 0; padding-bottom: 20rpx; font-size: 26rpx; color: #6A7182; border-bottom: 1rpx solid #EEF0F4; }
.record { display: flex; margin: 0 32rpx; padding: 28rpx 0; align-items: center; gap: 20rpx; border-bottom: 1rpx solid #EEF0F4; }.record-avatar { width: 80rpx; height: 80rpx; border-radius: 24rpx; }.record-person { flex: 1; display: flex; flex-direction: column; }.record-name { font-size: 30rpx; font-weight: 600; }.record-time { font-size: 24rpx; color: #737A8B; margin-top: 8rpx; }.record-amount { font-size: 30rpx; font-weight: 700; }
.refund { padding: 24rpx 10rpx calc(30rpx + env(safe-area-inset-bottom)); color: #737A8B; font-size: 24rpx; text-align: center; flex-shrink: 0; }
.refresh { display: flex; align-items: center; justify-content: center; width: 320rpx; height: 84rpx; margin: 40rpx auto 0; border-radius: 28rpx; color: #3B4152; background: #F3F4F8; font-size: 26rpx; font-weight: 600; }.refresh::after { border: none; }
.status-tip,.detail-error { display: block; padding: 24rpx 32rpx; font-size: 25rpx; color: #9C4535; text-align: center; }.detail-error { color: #C42A1C; }
.expand-envelope { position: absolute; left: 50%; top: 50%; width: 600rpx; height: 860rpx; margin-left: -300rpx; margin-top: -430rpx; border-radius: 56rpx; background: #D93A28; pointer-events: none; animation: expand .48s cubic-bezier(.2,.7,.2,1) forwards; }
.revealing { animation: reveal .48s ease-out; }@keyframes coin-spin { from { transform: perspective(800px) rotateY(0); } to { transform: perspective(800px) rotateY(360deg); } }@keyframes arrive { from { transform: translateY(20px) scale(.94); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }@keyframes expand { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }@keyframes reveal { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }@media (prefers-reduced-motion: reduce) { .spinning,.envelope,.expand-envelope,.revealing { animation-duration: .01s; animation-iteration-count: 1; } }
</style>
