<template>
  <view class="page">
    <view class="hero">
      <view v-if="feed.length" class="marquee">
        <view class="marquee-track">
          <text v-for="(item, index) in feed" :key="index">
            {{ item }}<text class="marquee-dot" />
          </text>
        </view>
      </view>
      <view class="opening">
        <view class="emblem-wrap">
          <view class="emblem-halo halo-one" />
          <view class="emblem-halo halo-two" />
          <image
            class="redpack-emblem"
            :class="{ spinning: coinSpinning }"
            ref="coin"
            src="../static/images/open_redpack_coin.png"
            mode="aspectFit"
          />
        </view>
        <view class="chance-summary">
          <text class="chance-label">今日剩余机会</text>
          <text class="chance-value">{{ chances }} <text>次</text></text>
        </view>
      </view>
      <button
        class="open-button"
        type="button"
        :disabled="!canOpen || opening"
        @click="openPacket"
      >
        {{ buttonText }}
      </button>
      <view class="time">
        <text class="time-strong">{{ windowText }}</text>
        <text> 开放领取，机会当天有效</text>
      </view>
    </view>

    <view class="content">
      <view class="wallet-panel">
        <view class="wallet-card wallet-amount">
          <view class="wallet-card-head">
            <view class="wallet-mark amount-mark" />
            <text class="wallet-label">{{ redEnvelopeAmountName }}</text>
          </view>
          <view class="wallet-value">
            <text class="wallet-unit">¥</text>
            <text>{{ balanceText }}</text>
          </view>
        </view>
        <view class="wallet-card wallet-quota">
          <view class="wallet-card-head">
            <view class="wallet-mark quota-mark" />
            <text class="wallet-label">剩余{{ redEnvelopeQuotaName }}</text>
          </view>
          <view class="wallet-value">
            <text class="wallet-unit">¥</text>
            <text>{{ quotaText }}</text>
          </view>
        </view>
      </view>
      <view class="section-head">
        <view>
          <text class="section-title">开红包记录</text>
          <text class="section-subtitle">今日已开 {{ opened }} 次</text>
        </view>
      </view>
      <view v-if="records.length" class="records">
        <view v-for="(r, index) in records" :key="index" class="record">
          <view>
            <text class="record-title">{{ r.title }}</text>
            <text class="record-time">{{ r.time }}</text>
          </view>
          <text class="record-amount">+ ¥ {{ r.amount }}</text>
        </view>
      </view>
      <view v-else class="record-empty">今日还没有开红包记录</view>
    </view>

    <view class="result" :class="{ show: resultShow }">
      <image
        class="result-emblem"
        src="../static/images/open_redpack_coin.png"
        mode="aspectFit"
      />
      <text class="result-title">红包已打开</text>
      <text class="result-amount">¥ {{ resultAmount }}</text>
      <text class="result-desc">已存入{{ redEnvelopeQuotaName }}</text>
      <button type="button" @click="resultShow = false">收下红包</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      balance: 0,
      quota: 0,
      redEnvelopeAmountName: "红包金额",
      redEnvelopeQuotaName: "红包额度",
      chances: 0,
      opened: 0,
      status: "settling",
      window: {},
      coinSpinning: false,
      opening: false,
      resultShow: false,
      resultAmount: "0.00",
      feed: [],
      records: [],
    };
  },
  computed: {
    // 服务端状态为开启且用户仍有资格时才允许点击。
    canOpen() {
      return this.status == "opening" && this.chances > 0;
    },
    // 使用服务端快照展示当日红包时间，避免写死后台配置。
    windowText() {
      const startTime = this.window.start_time || "--:--:--";
      const endTime = this.window.end_time || "--:--:--";
      return startTime + " - " + endTime;
    },
    // 根据结算和窗口状态显示按钮文案。
    buttonText() {
      if (this.opening) return "红包开启中";
      if (this.status == "settling") return "红包结算中";
      if (this.status == "waiting") return "未到红包领取时间";
      if (this.status == "ended") return "今日红包机会已结束";
      if (!this.chances) return "今日红包机会已用完";
      return "开红包（今日还可开 " + this.chances + " 次）";
    },
    // 保持金额展示由服务端返回的两位小数值控制。
    balanceText() {
      return this.balance || "0.00";
    },
    // 保持红包额度展示由服务端返回的两位小数值控制。
    quotaText() {
      return this.quota || "0.00";
    },
  },
  // 页面展示时分别刷新红包资格、钱包资产和领取记录。
  onShow() {
    this.getOpenRedpackStatus();
    this.getOpenRedpackAssets();
    this.getOpenRedpackRecords();
  },
  methods: {
    // 查询当天红包结算状态、领取时间和剩余红包机会。
    getOpenRedpackStatus() {
      return this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=get_open_redpack_status",
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode != 0) {
            this.showToast(res.errmsg || "红包数据加载失败");
            return;
          }
          const data = res.data || {};
          this.chances = data.remaining_count || 0;
          this.opened = data.opened_count || 0;
          this.status = data.status || "settling";
          this.window = data.window || {};
        })
        .catch((error) => {
          this.showToast(error.errmsg || "红包资格加载失败");
        });
    },

    // 查询红包金额、红包额度及后台自定义的钱包名称。
    getOpenRedpackAssets() {
      return this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=get_open_redpack_assets",
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode != 0) {
            this.showToast(res.errmsg || "钱包资产加载失败");
            return;
          }
          const data = res.data || {};
          this.balance = data.red_envelope_amount || 0;
          this.quota = data.red_envelope_quota || 0;
          this.redEnvelopeAmountName =
            data.red_envelope_amount_name || "红包金额";
          this.redEnvelopeQuotaName =
            data.red_envelope_quota_name || "红包额度";
        })
        .catch((error) => {
          this.showToast(error.errmsg || "钱包资产加载失败");
        });
    },

    // 查询当天已成功领取的开红包记录。
    getOpenRedpackRecords() {
      return this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=get_open_redpack_records",
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode != 0) {
            this.showToast(res.errmsg || "开红包记录加载失败");
            return;
          }
          const records = res.data || [];
          this.records = records.map((item) => ({
            title: "每日红包",
            time: item.create_time + " · 已领取",
            amount: item.amount,
          }));
          this.feed = this.records.map(
            (item) => "恭喜你开启 " + item.amount + " 元红包",
          );
        })
        .catch((error) => {
          this.showToast(error.errmsg || "开红包记录加载失败");
        });
    },

    // 请求服务端开启一条红包机会，金额不在客户端随机计算。
    openPacket() {
      if (!this.canOpen || this.opening) return;
      this.opening = true;
      this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=open_redpack",
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode != 0) {
            this.showToast(res.errmsg || "开红包失败");
            return;
          }
          this.playOpenAnimation(res.data.amount);
          this.getOpenRedpackStatus();
          this.getOpenRedpackAssets();
          this.getOpenRedpackRecords();
        })
        .catch((error) => {
          this.showToast(error.errmsg || "开红包失败");
        })
        .finally(() => {
          this.opening = false;
        });
    },

    // 播放红包成功动画并展示服务端最终发放金额。
    playOpenAnimation(amount) {
      this.coinSpinning = false;
      this.$nextTick(() => {
        const coin = this.$refs.coin;
        if (coin) coin.offsetWidth;
        this.coinSpinning = true;
      });
      setTimeout(() => {
        this.resultAmount = amount;
        this.resultShow = true;
      }, 560);
    },

    // 显示统一轻提示。
    showToast(title) {
      uni.showToast({ title, icon: "none" });
    },
  },
};
</script>

<style scoped>
.page {
  --red-deep: #9e272c;
  --red: #c63d3c;
  --red-light: #e9594e;
  --gold: #f6c65a;
  --gold-deep: #c9821c;
  --ink: #292020;
  --muted: #8c7873;
  --paper: #fff9f3;
  --line: #f1dfd5;
  min-height: 100vh;
  color: var(--ink);
  background: var(--paper);
  font-family:
    -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei",
    sans-serif;
}

.hero {
  position: relative;
  min-height: 630rpx;
  overflow: hidden;
  padding: 34rpx 32rpx 48rpx;
  color: #fff;
  background:
    radial-gradient(circle at 85% 6%, #f07a53 0, transparent 23%),
    linear-gradient(155deg, #d94a42 0%, var(--red-deep) 75%);
}

.hero::after {
  content: "";
  position: absolute;
  right: -210rpx;
  bottom: -280rpx;
  left: -210rpx;
  height: 470rpx;
  border: 2rpx solid #ffffff30;
  border-radius: 50%;
  box-shadow:
    0 0 0 48rpx #ffffff0d,
    0 0 0 104rpx #ffffff08;
  transform: rotate(-5deg);
}

.marquee {
  position: relative;
  z-index: 1;
  height: 52rpx;
  overflow: hidden;
  border: 1rpx solid #ffffff36;
  border-radius: 28rpx;
  background: #701c2670;
  white-space: nowrap;
}

.marquee-track {
  display: inline-flex;
  align-items: center;
  min-width: max-content;
  height: 100%;
  padding-left: 20rpx;
  animation: run 14s linear infinite;
  color: #fff2c3;
  font-size: 22rpx;
}

.marquee-dot {
  display: inline-block;
  width: 8rpx;
  height: 8rpx;
  margin: 0 16rpx 4rpx;
  border-radius: 50%;
  background: var(--gold);
}

@keyframes run {
  to {
    transform: translateX(-35%);
  }
}

.opening {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 24rpx;
}

.emblem-wrap {
  position: relative;
  width: 280rpx;
  height: 280rpx;
}

.emblem-halo {
  position: absolute;
  border: 2rpx solid #ffecad73;
  border-radius: 50%;
}

.halo-one {
  inset: 20rpx;
}

.halo-two {
  inset: 0;
  opacity: 0.48;
}

.redpack-emblem {
  position: absolute;
  top: 18rpx;
  left: 18rpx;
  width: 244rpx;
  height: 244rpx;
  filter: drop-shadow(0 16rpx 18rpx #65151e66);
}

.redpack-emblem.spinning {
  animation: coin 0.85s cubic-bezier(0.18, 0.67, 0.28, 1.21) both;
}

.chance-summary {
  display: flex;
  align-items: baseline;
  gap: 14rpx;
  margin-top: 4rpx;
}

.chance-label {
  color: #ffe8c3;
  font-size: 22rpx;
}

.chance-value {
  color: #fff;
  font-family: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
  font-size: 42rpx;
  font-weight: 700;
}

.chance-value text {
  margin-left: 4rpx;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
  font-size: 22rpx;
  font-weight: 500;
}

@keyframes coin {
  0% {
    transform: scale(0.8) rotateY(0deg);
  }
  45% {
    transform: scale(1.22) rotateY(720deg);
  }
  100% {
    transform: scale(1) rotateY(1440deg);
  }
}

.open-button {
  position: relative;
  z-index: 1;
  display: block;
  width: 520rpx;
  height: 88rpx;
  margin: 20rpx auto 0;
  border: 2rpx solid #fff0a9;
  border-radius: 16rpx;
  color: #8c2d29;
  background: #ffe39a;
  box-shadow:
    0 8rpx 0 #81212a,
    0 18rpx 24rpx #5916214d;
  font-size: 30rpx;
  font-weight: 900;
}

.open-button:active {
  transform: translateY(5rpx);
  box-shadow: 0 3rpx 0 #8d2730;
}

.open-button[disabled] {
  border-color: #e9c6bd;
  color: #8b6460;
  background: #e8d2c8;
  box-shadow: 0 7rpx 0 #7d4140;
}

.time {
  position: relative;
  z-index: 1;
  margin-top: 24rpx;
  color: #fffbe4;
  text-align: center;
  font-size: 22rpx;
}

.time-strong {
  color: var(--gold);
  font-weight: 700;
}

.content {
  position: relative;
  z-index: 2;
  min-height: 440rpx;
  margin-top: -14rpx;
  padding: 36rpx 28rpx calc(52rpx + env(safe-area-inset-bottom));
  border-radius: 28rpx 28rpx 0 0;
  background: var(--paper);
}

.wallet-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.wallet-card {
  min-height: 184rpx;
  padding: 28rpx 22rpx;
  border: 1rpx solid var(--line);
  border-radius: 14rpx;
  background: #fff;
  box-sizing: border-box;
}

.wallet-amount {
  border-top: 6rpx solid var(--red-light);
}

.wallet-quota {
  border-top: 6rpx solid var(--gold);
}

.wallet-card-head {
  display: flex;
  align-items: center;
  min-height: 28rpx;
}

.wallet-mark {
  width: 12rpx;
  height: 12rpx;
  margin-right: 12rpx;
  border-radius: 50%;
}

.amount-mark {
  background: var(--red-light);
}

.quota-mark {
  background: var(--gold-deep);
}

.wallet-label {
  color: var(--muted);
  font-size: 24rpx;
  line-height: 1.3;
}

.wallet-value {
  display: flex;
  align-items: baseline;
  margin-top: 24rpx;
  color: var(--red);
  font-family: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
  font-size: 46rpx;
  font-weight: 700;
  line-height: 1;
}

.wallet-unit {
  margin-right: 6rpx;
  font-size: 28rpx;
}

.wallet-quota .wallet-value {
  color: var(--gold-deep);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 46rpx;
  margin-bottom: 20rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
}

.section-subtitle {
  display: block;
  margin-top: 8rpx;
  color: var(--muted);
  font-size: 22rpx;
}

.records {
  overflow: hidden;
  border: 1rpx solid var(--line);
  border-radius: 14rpx;
  background: #fff;
}

.record {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 96rpx;
  padding: 18rpx 22rpx;
  border-bottom: 1rpx solid #f5ebe5;
}

.record:last-child {
  border: 0;
}

.record-title {
  font-size: 26rpx;
  font-weight: 700;
}

.record-time {
  display: block;
  margin-top: 7rpx;
  color: var(--muted);
  font-size: 21rpx;
}

.record-amount {
  color: var(--red);
  font-family: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
  font-size: 30rpx;
  font-weight: 700;
}

.record-empty {
  padding: 46rpx 0;
  border: 1rpx dashed #ead8ce;
  border-radius: 14rpx;
  color: #ad9992;
  text-align: center;
  font-size: 24rpx;
}

.result {
  position: fixed;
  z-index: 5;
  top: 50%;
  left: 50%;
  display: none;
  width: 510rpx;
  padding: 42rpx 34rpx;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  border: 2rpx solid #f5c96b;
  border-radius: 22rpx;
  color: #fff;
  text-align: center;
  background: var(--red-deep);
  box-shadow: 0 30rpx 80rpx #48101c80;
}

.result.show {
  display: block;
  animation: pop 0.35s ease both;
}

.result-emblem {
  display: block;
  width: 124rpx;
  height: 124rpx;
  margin: 0 auto 16rpx;
}

.result-title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
}

.result-amount {
  display: block;
  margin: 14rpx 0;
  color: #ffe59a;
  font-family: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
  font-size: 62rpx;
  font-weight: 700;
}

.result-desc {
  color: #fff9d9;
  font-size: 24rpx;
}

.result button {
  width: 280rpx;
  height: 68rpx;
  margin-top: 28rpx;
  padding: 0;
  border: 0;
  border-radius: 12rpx;
  color: #8e2830;
  background: #ffe7a3;
  font-size: 26rpx;
  font-weight: 800;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translate(-50%, -42%) scale(0.8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track,
  .redpack-emblem.spinning {
    animation: none;
  }
}
</style>
