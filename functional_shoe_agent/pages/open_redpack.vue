<template>
  <view class="page">
    <view class="hero">
      <view class="marquee">
        <view class="marquee-track">
          <text v-for="(item, index) in feed" :key="index">
            {{ item }}<text class="marquee-dot" />
          </text>
        </view>
      </view>
      <view class="opening">
        <view class="coin-wrap">
          <view class="coin" ref="coin" :class="{ spinning: coinSpinning }">
            ¥
          </view>
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
        红包仅在
        <text class="time-strong">{{ windowText }}</text> 开放，机会当天有效
      </view>
    </view>

    <view class="content">
      <view class="asset-grid">
        <view class="asset">
          <text>{{ redEnvelopeAmountName }}</text>
          <text class="asset-value"
            >¥ <text class="asset-num">{{ balanceText }}</text></text
          >
        </view>
        <view class="asset quota">
          <text>剩余{{ redEnvelopeQuotaName }}</text>
          <text class="asset-value"
            >¥ <text class="asset-num">{{ quotaText }}</text></text
          >
        </view>
      </view>
      <view class="hint" />
      <view class="section-head">
        <text class="section-title">开红包记录</text>
        <text class="section-meta">已开 {{ opened }} 次</text>
      </view>
      <view class="records">
        <view v-for="(r, index) in records" :key="index" class="record">
          <view>
            <text class="record-title">{{ r.title }}</text>
            <text class="record-time">{{ r.time }}</text>
          </view>
          <text class="record-amount">+ ¥ {{ r.amount }}</text>
        </view>
      </view>
    </view>

    <view class="result" :class="{ show: resultShow }">
      <view class="mini-coin">¥</view>
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
  --red: #c43d38;
  --gold: #f6c65a;
  --gold-deep: #c9821c;
  --ink: #342828;
  --muted: #927e79;
  --paper: #fff9f3;
  --line: #f1dfd5;
  min-height: 100vh;
  overflow: hidden;
  color: var(--ink);
  background: var(--paper);
  font-family:
    -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei",
    sans-serif;
}

.hero {
  position: relative;
  min-height: 337px;
  overflow: hidden;
  padding: 18px 18px 28px;
  color: #fff;
  background:
    radial-gradient(circle at 18% 9%, #f17550 0, transparent 25%),
    radial-gradient(circle at 91% 24%, #f48a4a 0, transparent 20%),
    linear-gradient(145deg, #d7503f 0%, #a82f36 54%, #7f2430 100%);
}

.hero::after {
  content: "";
  position: absolute;
  inset: auto -80px -120px;
  height: 250px;
  border: 1px solid #ffffff2f;
  border-radius: 50%;
  box-shadow:
    0 0 0 32px #ffffff0d,
    0 0 0 74px #ffffff09;
  transform: rotate(-7deg);
}

.marquee {
  position: relative;
  z-index: 1;
  height: 28px;
  margin-top: 16px;
  overflow: hidden;
  border: 1px solid #ffffff30;
  border-radius: 99px;
  background: #701c2670;
  white-space: nowrap;
}

.marquee-track {
  display: inline-flex;
  align-items: center;
  min-width: max-content;
  height: 100%;
  padding-left: 12px;
  animation: run 14s linear infinite;
  color: #fff2c3;
  font-size: 11px;
}

.marquee-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin: 0 8px 2px;
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
  display: grid;
  place-items: center;
  margin: 13px auto 0;
}

.coin-wrap {
  position: relative;
  width: 132px;
  height: 132px;
  display: grid;
  place-items: center;
}

.coin-wrap::before,
.coin-wrap::after {
  content: "";
  position: absolute;
  border: 1px solid #ffefb073;
  border-radius: 50%;
}

.coin-wrap::before {
  width: 121px;
  height: 121px;
}

.coin-wrap::after {
  width: 145px;
  height: 145px;
  opacity: 0.45;
}

.coin {
  width: 99px;
  height: 99px;
  display: grid;
  place-items: center;
  border: 5px solid #ffe39a;
  border-radius: 50%;
  color: #b3392f;
  background: radial-gradient(
    circle at 36% 28%,
    #fff6c4 0 4%,
    #ffd663 27%,
    #e9a32b 69%,
    #bf6b18 100%
  );
  box-shadow:
    inset 0 0 0 4px #d98921,
    0 11px 21px #5d142b63;
  font-family: Georgia, serif;
  font-size: 52px;
  font-weight: bold;
  text-shadow: 0 1px #fff4b6;
}

.coin.spinning {
  animation: coin 0.85s cubic-bezier(0.18, 0.67, 0.28, 1.21) both;
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
  width: 205px;
  height: 42px;
  margin: 13px auto 0;
  border: 1px solid #fff0a9;
  border-radius: 99px;
  color: #8c2d29;
  background: linear-gradient(180deg, #ffe9a4, #f9bd4e);
  box-shadow:
    0 6px 0 #8d2730,
    0 10px 18px #51112955;
  font-size: 15px;
  font-weight: 900;
}

.open-button:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #8d2730;
}

.open-button[disabled] {
  color: #7b5b58;
  background: #e5d2c2;
  box-shadow: 0 4px 0 #7d4140;
}

.time {
  position: relative;
  z-index: 1;
  margin-top: 13px;
  color: #fffbe4;
  text-align: center;
  font-size: 11px;
}

.time-strong {
  color: var(--gold);
  font-weight: 700;
}

.content {
  position: relative;
  z-index: 2;
  margin-top: -9px;
  padding: 18px 14px 30px;
  border-radius: 17px 17px 0 0;
  background: var(--paper);
}

.asset-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.asset {
  min-height: 104px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: #fff;
}

.asset text {
  display: block;
  color: var(--muted);
  font-size: 11px;
}

.asset-value {
  display: block;
  margin-top: 9px;
  color: var(--red);
  font-family: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
  font-size: 27px;
  font-weight: 700;
}

.asset-num {
  font-style: normal;
}

.asset.quota .asset-value {
  color: var(--gold-deep);
}

.hint {
  margin: 12px 2px 17px;
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 0 3px 10px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
}

.section-meta {
  color: var(--muted);
  font-size: 10px;
}

.records {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: #fff;
}

.record {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 13px;
  border-bottom: 1px solid #f5ebe5;
}

.record:last-child {
  border: 0;
}

.record-title {
  font-size: 12px;
  font-weight: 700;
}

.record-time {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 10px;
}

.record-amount {
  color: var(--red);
  font-family: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
  font-size: 15px;
  font-weight: 700;
}

.result {
  position: fixed;
  z-index: 5;
  top: 50%;
  left: 50%;
  display: none;
  width: 255px;
  padding: 25px 20px;
  transform: translate(-50%, -50%);
  border-radius: 13px;
  color: #fff;
  text-align: center;
  background: linear-gradient(145deg, #d7503f, #8e2631);
  box-shadow: 0 18px 55px #48101c80;
}

.result.show {
  display: block;
  animation: pop 0.35s ease both;
}

.mini-coin {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  margin: 0 auto 10px;
  border: 3px solid #ffe39a;
  border-radius: 50%;
  color: #b3392f;
  background: #ffd460;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: bold;
}

.result-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
}

.result-amount {
  display: block;
  margin: 8px 0;
  color: #ffe59a;
  font-family: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
  font-size: 38px;
  font-weight: 700;
}

.result-desc {
  color: #fff9d9;
  font-size: 11px;
}

.result button {
  height: 33px;
  margin-top: 15px;
  padding: 0 22px;
  border: 0;
  border-radius: 99px;
  color: #8e2830;
  background: #ffe7a3;
  font-size: 12px;
  font-weight: 800;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translate(-50%, -42%) scale(0.75);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track,
  .coin.spinning {
    animation: none;
  }
}
</style>
