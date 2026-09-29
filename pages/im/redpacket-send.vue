<template>
    <view class="page">
        <view :style="{ height: statusBar + 'px' }" />
        <view class="nav"><view class="back" @tap="back"><u-icon name="arrow-left" size="25" color="#222" /></view><text class="nav-title">发红包</text><view class="nav-space" /></view>
        <scroll-view scroll-y class="content" :class="{ 'with-keyboard': amountKeyboard }">
            <text class="receiver">发给 {{ receiverName }}</text>
            <view v-if="draft" class="form">
                <view class="asset-summary" @tap="openAssets">
                    <view class="asset-icon"><u-icon name="rmb-circle" size="28" color="#c98138" /></view>
                    <view class="asset-summary-text"><text class="asset-caption">红包资产</text><text class="asset-current">{{ assets.length || locked ? assetName : '暂无可用资产' }}</text><text class="asset-available">{{ assets.length || locked ? '可用余额 ' + balance : '平台暂未开放红包资产' }}</text></view>
                    <view v-if="assets.length > 1 && !locked" class="asset-change"><text>更换</text><u-icon name="arrow-right" size="14" color="#999" /></view>
                </view>
                <view class="row amount-row" @tap="focusAmount"><text class="label">{{ draft.asset === 'integral' ? '数量' : '金额' }}</text><text class="amount-input" :class="{ placeholder: !draft.amount }">{{ symbol }}{{ draft.amount || (draft.asset === 'integral' ? '0' : '0.00') }}<text v-if="amountKeyboard && !locked" class="cursor">|</text></text></view>
                <view class="blessing-row"><input v-model="draft.blessing" class="blessing-input" :disabled="busy || locked" maxlength="60" placeholder="恭喜发财，大吉大利" @focus="amountKeyboard = false" /></view>
                <text class="balance">可用{{ assetName }}：{{ balance }}</text>
                <view class="total"><text class="currency">{{ symbol }}</text><text class="total-amount">{{ displayAmount }}</text><text v-if="draft.asset !== 'pocket_money'" class="unit">{{ assetName }}</text></view>
                <button class="send" :disabled="busy || !canOperate || (!assets.length && !locked)" @tap="locked ? retry() : confirmAmount()">{{ busy ? '处理中…' : locked ? '核对上一个红包' : '塞钱进红包' }}</button>
                <button v-if="!hasPassword && !locked" class="setup" @tap="setPassword">设置支付密码</button>
                <text v-if="locked" class="notice">正在核对原红包，请勿重复支付</text>
            </view>
            <text v-else-if="busy" class="notice">加载中…</text>
            <text v-if="error" class="error">{{ error }}</text>
            <button v-if="!draft && !busy && canOperate" class="setup" @tap="load">重新加载</button>
        </scroll-view>
        <text v-if="!amountKeyboard" class="refund">未领取的红包，将于24小时后发起退款</text>
        <RedPacketKeyboard v-if="amountKeyboard && draft && !locked" class="amount-keyboard" :integral="draft.asset === 'integral'" :disabled="busy || !canOperate" @key="amountKey" @confirm="confirmAmount" />
        <view v-if="assetVisible" class="pay-mask" @tap="assetVisible = false" @touchmove.stop.prevent="">
            <view class="asset-sheet" @tap.stop="">
                <view class="asset-sheet-heading"><text>选择红包资产</text><view @tap="assetVisible = false"><u-icon name="close" size="20" /></view></view>
                <text class="asset-sheet-tip">使用所选资产发送，对方领取后存入对应账户</text>
                <view v-for="item in assets" :key="item.asset" class="asset-option" :class="{ active: draft.asset === item.asset }" @tap="selectAsset(item)">
                    <view class="asset-option-icon"><u-icon name="rmb-circle" size="26" color="#c98138" /></view>
                    <view class="asset-option-text"><text class="asset-option-name">{{ item.name }}</text><text class="asset-option-balance">可用余额 {{ item.balance }}</text></view>
                    <view class="asset-check" :class="{ checked: draft.asset === item.asset }"><u-icon v-if="draft.asset === item.asset" name="checkmark" size="14" color="#fff" /></view>
                </view>
            </view>
        </view>
        <view v-if="payVisible" class="pay-mask" @tap="closePay" @touchmove.stop.prevent="">
            <view class="pay-sheet" @tap.stop="">
                <view class="pay-heading"><view class="pay-close" @tap="closePay"><u-icon name="close" size="22" /></view><text>请输入支付密码</text></view>
                <text class="pay-subtitle">支付红包 · {{ assetName }}</text><text class="pay-total">{{ symbol }}{{ displayAmount }}{{ draft.asset !== 'pocket_money' ? ' ' + assetName : '' }}</text>
                <view class="password-boxes"><view v-for="n in 6" :key="n" class="password-box"><view v-if="password.length >= n" class="password-dot" /></view></view>
                <text class="pay-tip">{{ busy ? '正在验证支付，请稍候…' : '输入6位支付密码后自动确认' }}</text>
                <text v-if="error" class="pay-error">{{ error }}</text>
                <RedPacketKeyboard password-mode :disabled="busy || !canOperate" @key="passwordKey" />
            </view>
        </view>
    </view>
</template>
<script>
import page from '@/utils/im/redpacket-page.js';
import RedPacketKeyboard from '@/components/im/RedPacketKeyboard.vue';
import { validateRedPacketAmount } from '@/utils/im/redpacket.js';
import { redPacketAmountKey, redPacketRoute } from '@/utils/im/redpacket-ui.js';
const DEFINITE_FAILURES = [40001, 40003, 40005, 40006, 40007, 50301];
export default {
    mixins: [page], components: { RedPacketKeyboard },
    data() { return { assets: [], assetNames: {}, assetVisible: false, draft: null, hasPassword: false, locked: false, amountKeyboard: false, payVisible: false, password: '', loaded: false }; },
    computed: {
        asset() { return this.assets.find(item => this.draft && item.asset === this.draft.asset); },
        balance() { return this.asset ? this.asset.balance : '--'; },
        assetName() { return this.asset ? this.asset.name : this.assetNames[this.draft && this.draft.asset] || '红包资产'; },
        symbol() { return this.draft && this.draft.asset === 'pocket_money' ? '¥' : ''; },
        displayAmount() { const amount = this.draft ? this.draft.amount : ''; return this.draft && this.draft.asset === 'integral' ? (amount || '0') : Number(amount || 0).toFixed(2); }
    },
    watch: { canOperate(value) { if (value && !this.loaded && !this.busy) this.load(); if (!value) { this.password = ''; this.payVisible = false; } } },
    onShow() { if (this.canOperate && !this.loaded) this.load(); },
    onHide() { this.payVisible = false; },
    onBackPress() { if (this.busy) return true; if (this.assetVisible) { this.assetVisible = false; return true; } if (this.payVisible) { this.closePay(); return true; } if (this.amountKeyboard) { this.amountKeyboard = false; return true; } return false; },
    methods: {
        async load() {
            const result = await this.run('options', {});
            if (!result) return;
            this.loaded = true; this.assets = result.assets || []; this.assetNames = result.asset_names || {}; this.hasPassword = !!result.has_pay_password; this.draft = result.draft;
            this.locked = !!(this.draft && this.draft.amount);
            if (this.draft && !this.locked && !this.asset && this.assets.length) this.draft.asset = this.assets[0].asset;
            if (this.draft && this.draft.packet_id) this.showDetail(this.draft);
        },
        openAssets() { if (this.busy || this.locked || this.assets.length < 2) return; uni.hideKeyboard(); this.amountKeyboard = false; this.assetVisible = true; },
        focusAmount() { if (!this.busy && !this.locked && this.assets.length) { uni.hideKeyboard(); this.amountKeyboard = true; } },
        selectAsset(item) { if (!this.busy && !this.locked) { this.draft.asset = item.asset; this.draft.amount = ''; this.error = ''; this.assetVisible = false; } },
        amountKey(key) { if (!this.busy && !this.locked) this.draft.amount = redPacketAmountKey(this.draft.amount, key, this.draft.asset); },
        confirmAmount() {
            if (!this.draft || !this.asset || this.busy || this.locked || !this.canOperate) return;
            this.error = validateRedPacketAmount(this.draft.amount, this.draft.asset); if (this.error) return;
            if (!this.hasPassword) { this.setPassword(); return; }
            this.amountKeyboard = false; uni.hideKeyboard(); this.password = ''; this.payVisible = true;
        },
        passwordKey(key) {
            if (this.busy || !this.canOperate) return;
            if (key === 'delete') this.password = this.password.slice(0, -1);
            else if (/^\d$/.test(key) && this.password.length < 6) this.password += key;
            if (this.password.length === 6) this.send();
        },
        closePay() { if (!this.busy) { this.password = ''; this.payVisible = false; } },
        async send() {
            if (this.busy || this.locked || !/^\d{6}$/.test(this.password)) return;
            this.locked = true;
            const result = await this.run('send', { ...this.draft, pay_password: this.password });
            if (result) { this.payVisible = false; this.finishSend(result); }
            else if (DEFINITE_FAILURES.includes(this.errorCode)) { this.locked = false; if (this.errorCode === 40007) { this.payVisible = false; this.password = ''; await this.load(); } }
            else this.payVisible = false;
        },
        async retry() {
            if (this.busy || !this.draft) return;
            const result = await this.run('send', { ...this.draft, pay_password: '' });
            if (result) this.finishSend(result);
            else if (DEFINITE_FAILURES.includes(this.errorCode)) { this.locked = false; this.loaded = false; await this.load(); }
        },
        finishSend(packet) {
            if (!packet.packet_id || !this.canOperate) return;
            if (!['pending', 'claimed', 'refunded'].includes(packet.status)) { this.showDetail(packet); return; }
            this.password = ''; this.payVisible = false; this.amountKeyboard = false;
            uni.navigateBack({ delta: 1, fail: () => { this.error = '红包已发送，请返回聊天查看'; } });
        },
        showDetail(packet) {
            if (!packet.packet_id || !this.canOperate) return;
            uni.redirectTo({ url: redPacketRoute(this.context, this.receiverName, packet.packet_id, this.peerAvatar), fail: () => { this.error = '页面打开失败，请返回聊天查看原红包'; } });
        },
        setPassword() { this.password = ''; this.payVisible = false; uni.navigateTo({ url: '/public/pages/user/setPaypass' }); this.loaded = false; }
    }
};
</script>
<style scoped>
.page { position: fixed; inset: 0; background: #ededed; color: #171717; display: flex; flex-direction: column; }.nav { height: 88rpx; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }.back,.nav-space { width: 100rpx; height: 88rpx; display: flex; align-items: center; padding-left: 26rpx; box-sizing: border-box; }.nav-title { font-size: 34rpx; font-weight: 600; }
.content { flex: 1; min-height: 0; height: 0; }.receiver { display: block; padding: 18rpx 30rpx; color: #888; font-size: 24rpx; }.form { padding: 0 28rpx 25rpx; }
.row,.blessing-row { display: flex; align-items: center; background: #fff; border-radius: 10rpx; padding: 0 28rpx; margin-bottom: 20rpx; min-height: 102rpx; }.label { font-size: 30rpx; font-weight: 600; }.amount-row { justify-content: space-between; }.amount-input { font-size: 32rpx; color: #202020; }.placeholder { color: #b7b7b7; }.cursor { color: #ff6048; margin-left: 5rpx; animation: blink 1s steps(2) infinite; }.blessing-row { min-height: 114rpx; }.blessing-input { flex: 1; font-size: 30rpx; height: 90rpx; }.balance { display: block; font-size: 24rpx; color: #999; margin: 8rpx 4rpx; }
.total { display: flex; justify-content: center; align-items: baseline; margin-top: 100rpx; margin-bottom: 35rpx; }.currency { font-size: 60rpx; font-weight: 600; margin-right: 12rpx; }.total-amount { font-size: 90rpx; font-weight: 600; }.unit { font-size: 28rpx; margin-left: 12rpx; }.send { display: block; margin: 0 auto; width: 330rpx; border-radius: 12rpx; background: #ff6048; color: #fff; font-size: 30rpx; font-weight: 600; padding: 0; height: 84rpx; line-height: 84rpx; }.send::after { border: none; }.send[disabled] { color: #fff; background: #eda99b; }.setup { background: transparent; color: #bd5c48; font-size: 26rpx; }.setup::after { border: none; }.error,.notice { display: block; padding: 22rpx 30rpx; text-align: center; font-size: 25rpx; color: #bc4b3b; }.refund { flex-shrink: 0; text-align: center; font-size: 24rpx; color: #777; padding: 25rpx 0 calc(30rpx + env(safe-area-inset-bottom)); }.amount-keyboard { flex-shrink: 0; }
.pay-mask { position: fixed; inset: 0; background: rgba(0,0,0,.48); display: flex; align-items: flex-end; z-index: 10; }.pay-sheet { width: 100%; background: #fff; border-radius: 24rpx 24rpx 0 0; text-align: center; }.pay-heading { position: relative; padding: 30rpx; border-bottom: 1rpx solid #eee; font-size: 32rpx; font-weight: 600; }.pay-close { position: absolute; left: 28rpx; top: 31rpx; }.pay-subtitle { display: block; margin-top: 26rpx; color: #666; font-size: 24rpx; }.pay-total { display: block; margin: 14rpx 0 25rpx; font-size: 56rpx; font-weight: 600; }.password-boxes { display: flex; margin: 0 64rpx; border: 1rpx solid #ddd; border-radius: 10rpx; overflow: hidden; }.password-box { flex: 1; height: 80rpx; display: flex; align-items: center; justify-content: center; border-right: 1rpx solid #ddd; }.password-box:last-child { border-right: 0; }.password-dot { width: 20rpx; height: 20rpx; border-radius: 50%; background: #202020; }.pay-tip { display: block; font-size: 23rpx; color: #aaa; padding: 20rpx; }.pay-error { display: block; padding: 0 24rpx 18rpx; color: #b64a37; font-size: 24rpx; }@keyframes blink { 50% { opacity: 0; } }
.asset-summary { display:flex; align-items:center; padding:26rpx; background:#fff; border-radius:16rpx; margin-bottom:24rpx; }.asset-icon,.asset-option-icon { width:76rpx; height:76rpx; border-radius:22rpx; background:#fff3df; display:flex; align-items:center; justify-content:center; flex-shrink:0; }.asset-summary-text { display:flex; flex-direction:column; margin-left:22rpx; flex:1; min-width:0; }.asset-caption { font-size:22rpx; color:#999; }.asset-current { font-size:32rpx; font-weight:600; margin:5rpx 0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }.asset-available { font-size:23rpx; color:#888; }.asset-change { display:flex; align-items:center; font-size:24rpx; color:#888; margin-left:15rpx; gap:8rpx; }.asset-sheet { width:100%; padding:32rpx 28rpx calc(36rpx + env(safe-area-inset-bottom)); box-sizing:border-box; background:#fff; border-radius:28rpx 28rpx 0 0; }.asset-sheet-heading { display:flex; align-items:center; justify-content:space-between; font-size:32rpx; font-weight:600; }.asset-sheet-tip { display:block; color:#999; font-size:23rpx; margin:16rpx 0 30rpx; }.asset-option { display:flex; align-items:center; padding:24rpx; border:2rpx solid #eee; border-radius:18rpx; margin-top:18rpx; }.asset-option.active { background:#fff7f2; border-color:#f4bc9a; }.asset-option-text { display:flex; flex-direction:column; flex:1; min-width:0; margin:0 22rpx; }.asset-option-name { font-size:30rpx; font-weight:600; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }.asset-option-balance { font-size:23rpx; color:#888; margin-top:8rpx; }.asset-check { width:36rpx; height:36rpx; border:2rpx solid #ddd; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }.asset-check.checked { background:#ed6549; border-color:#ed6549; }
</style>
