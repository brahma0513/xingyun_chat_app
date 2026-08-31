<template>
  <view class="page">
    <view class="hero">
      <view class="hero-top">
        <view>
          <text class="eyebrow">DAILY CHECK-IN</text>
          <text class="hero-title">每日签到</text>
        </view>
        <view class="rule-trigger" @tap="showRules = true">
          <text class="rule-icon">?</text>
          <text>签到规则</text>
        </view>
      </view>

      <view class="hero-summary">
        <view class="summary-item">
          <text class="summary-label">已连续签到</text>
          <view>
            <text class="summary-number">{{ continuousDays }}</text>
            <text class="summary-unit">天</text>
          </view>
        </view>
        <view class="summary-line"></view>
        <view class="summary-item">
          <text class="summary-label">今日可得</text>
          <view>
            <text class="summary-number">{{ todayReward }}</text>
            <text class="summary-unit">活力值</text>
          </view>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="calendar-card">
        <view class="calendar-header">
          <text class="calendar-title"
            >{{ currentYear }}年{{ currentMonth }}月</text
          >
          <text class="calendar-note">连续签到，奖励更多</text>
        </view>
        <view class="week-row">
          <text v-for="week in weeks" :key="week" class="week-item">
            {{ week }}
          </text>
        </view>
        <view class="date-grid">
          <view
            v-for="(day, index) in calendarDays"
            :key="index"
            class="date-cell"
            :class="{
              blank: !day.day,
              signed: day.signed,
              today: day.today,
            }"
          >
            <view v-if="day.day" class="date-mark">
              <text>{{ day.day }}</text>
              <text v-if="day.signed" class="check-mark">✓</text>
            </view>
          </view>
        </view>
      </view>

      <view class="reward-card">
        <view class="reward-icon">+</view>
        <view class="reward-copy">
          <text class="reward-title">今日签到奖励</text>
          <text class="reward-desc">活力值将放入活力鞋园，记得及时领取</text>
        </view>
        <text class="reward-number">{{ todayReward }}</text>
      </view>

      <view class="milestone-section">
        <view class="section-heading">
          <text>连续签到奖励</text>
          <text>已连续 {{ continuousDays }} 天</text>
        </view>
        <scroll-view class="milestone-scroll" scroll-x>
          <view class="milestone-list">
            <view
              v-for="(rule, index) in continuousRules"
              :key="index"
              class="milestone"
              :class="{ reached: continuousDays >= rule.continuous_days }"
            >
              <text class="milestone-days">{{ rule.continuous_days }}天</text>
              <text class="milestone-energy"
                >{{ rule.energy_amount }} 活力值</text
              >
            </view>
            <view v-if="!continuousRules.length" class="no-milestone">
              暂未配置连续签到奖励
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <view class="bottom-action">
      <button
        class="sign-button"
        :class="{
          signed: signed,
          disabled: !enabled || signing,
        }"
        :disabled="signed || !enabled || signing"
        @tap="signIn"
      >
        {{ signButtonText }}
      </button>
      <text v-if="makeUpEnabled && !signed" class="make-up-tip">
        昨日漏签可通过观看广告补领
      </text>
      <button
        v-if="canMakeUpYesterday"
        class="make-up-button"
        :disabled="makeUpAdStatus != 'ready' || makeUpAdShowing"
        @tap="makeUpYesterday"
      >
        {{ makeUpButtonText }}
      </button>
    </view>

    <view v-if="showRules" class="rule-mask" @tap="showRules = false">
      <view class="rule-sheet" @tap.stop>
        <view class="sheet-header">
          <text>签到规则</text>
          <text class="sheet-close" @tap="showRules = false">×</text>
        </view>
        <scroll-view class="rule-content" scroll-y>
          <rich-text :nodes="rules"></rich-text>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      enabled: false,
      signed: false,
      signing: false,
      continuousDays: 0,
      todayReward: 0,
      continuousRules: [],
      signedDates: [],
      rules: "",
      showRules: false,
      currentYear: 0,
      currentMonth: 0,
      makeUpEnabled: false,
      canMakeUpYesterday: false,
      makeUpRewardedVideoAd: null,
      makeUpAdStatus: "none",
      makeUpAdShowing: false,
      makeUpPollTimer: null,
      makeUpPollCount: 0,
      weeks: ["日", "一", "二", "三", "四", "五", "六"],
    };
  },
  computed: {
    // 按当前月份和签到日期生成月历格子。
    calendarDays() {
      const firstDate = new Date(this.currentYear, this.currentMonth - 1, 1);
      const firstWeek = firstDate.getDay();
      const totalDays = new Date(
        this.currentYear,
        this.currentMonth,
        0,
      ).getDate();
      const calendarDays = [];

      for (let index = 0; index < firstWeek; index++) {
        calendarDays.push({});
      }

      for (let day = 1; day <= totalDays; day++) {
        const date = this.formatDate(this.currentYear, this.currentMonth, day);
        calendarDays.push({
          day,
          signed: this.signedDates.indexOf(date) > -1,
          today: date == this.todayDate(),
        });
      }
      return calendarDays;
    },
    // 根据签到状态显示主按钮文案。
    signButtonText() {
      if (!this.enabled) return "签到活动未开启";
      if (this.signed) return "今日已签到";
      if (this.signing) return "签到中...";
      return "立即签到";
    },
    // 显示昨日补签按钮当前广告状态。
    makeUpButtonText() {
      if (this.makeUpAdShowing) return "广告播放中...";
      if (this.makeUpAdStatus == "preparing") return "广告准备中";
      if (this.makeUpAdStatus == "none") return "暂无广告";
      return "观看广告补签昨日";
    },
  },
  onLoad() {
    // 初始化当前月份，用于绘制签到月历。
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth() + 1;
  },
  onShow() {
    // 每次显示页面时刷新签到状态。
    this.getSignInData();
  },
  onPullDownRefresh() {
    // 下拉刷新签到数据。
    this.getSignInData(true);
  },
  onUnload() {
    // 页面离开时清理补签广告确认轮询。
    this.clearMakeUpPolling();
  },
  methods: {
    // 查询签到设置、月历记录和今日奖励。
    getSignInData(isRefresh = false) {
      return this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=get_sign_in_data",
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode != 0) {
            uni.showToast({ title: res.errmsg, icon: "none" });
            return;
          }

          const data = res.data;
          this.enabled = data.enabled == 1;
          this.signed = data.signed == 1;
          this.continuousDays = data.continuous_days;
          this.todayReward = data.today_reward;
          this.continuousRules = data.continuous_rules || [];
          this.signedDates = data.calendar || [];
          this.rules = data.rules || "";
          this.makeUpEnabled = data.make_up_yesterday_status == 1;
          this.canMakeUpYesterday = data.can_make_up_yesterday == 1;
          this.initMakeUpRewardedVideoAd(data.adpid);
        })
        .catch((error) => {
          console.error("获取签到数据失败", error);
        })
        .finally(() => {
          if (isRefresh) {
            uni.stopPullDownRefresh();
          }
        });
    },
    // 按补签用途创建独立的激励视频广告实例。
    initMakeUpRewardedVideoAd(adpid) {
      if (!this.canMakeUpYesterday || !adpid || this.makeUpRewardedVideoAd) {
        return;
      }

      this.makeUpAdStatus = "preparing";
      this.makeUpRewardedVideoAd = uni.createRewardedVideoAd({
        adpid,
        urlCallback: {
          userId: this.vuex_user.user_id || "",
          extra: "sign_in_make_up",
        },
      });
      this.makeUpRewardedVideoAd.onLoad(() => {
        this.makeUpAdStatus = "ready";
      });
      this.makeUpRewardedVideoAd.onError(() => {
        this.makeUpAdShowing = false;
        this.makeUpAdStatus = "none";
      });
      this.makeUpRewardedVideoAd.onClose((result) => {
        this.makeUpAdShowing = false;
        if (result && result.isEnded) {
          this.startMakeUpPolling();
        }
      });
    },
    // 展示补签专用的激励视频广告。
    makeUpYesterday() {
      if (!this.makeUpRewardedVideoAd || this.makeUpAdStatus != "ready") {
        uni.showToast({ title: "暂无广告", icon: "none" });
        return;
      }

      this.makeUpAdShowing = true;
      this.makeUpRewardedVideoAd.show().catch(() => {
        this.makeUpAdShowing = false;
        this.makeUpAdStatus = "none";
        uni.showToast({ title: "暂无广告", icon: "none" });
      });
    },
    // 广告关闭后轮询签到状态，确认服务端已补签昨日。
    startMakeUpPolling() {
      this.clearMakeUpPolling();
      this.makeUpPollTimer = setInterval(() => {
        this.makeUpPollCount = this.makeUpPollCount + 1;
        this.getSignInData().then(() => {
          if (!this.canMakeUpYesterday) {
            this.clearMakeUpPolling();
            uni.showToast({ title: "昨日补签成功，请签到今日", icon: "none" });
          }
        });
        if (this.makeUpPollCount >= 15) {
          this.clearMakeUpPolling();
        }
      }, 1000);
    },
    // 清理昨日补签确认轮询。
    clearMakeUpPolling() {
      if (this.makeUpPollTimer) {
        clearInterval(this.makeUpPollTimer);
        this.makeUpPollTimer = null;
      }
      this.makeUpPollCount = 0;
    },
    // 提交当天签到并刷新页面奖励状态。
    signIn() {
      if (this.signed || !this.enabled || this.signing) {
        return;
      }

      this.signing = true;
      this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=sign_in",
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode != 0) {
            uni.showToast({ title: res.errmsg, icon: "none" });
            return;
          }

          uni.showToast({
            title: "签到成功 +" + res.data.energy_amount + " 活力值",
            icon: "none",
          });
          this.getSignInData();
        })
        .catch((error) => {
          console.error("提交签到失败", error);
        })
        .finally(() => {
          this.signing = false;
        });
    },
    // 格式化月历需要的日期字符串。
    formatDate(year, month, day) {
      const paddedMonth = month < 10 ? "0" + month : month;
      const paddedDay = day < 10 ? "0" + day : day;
      return year + "-" + paddedMonth + "-" + paddedDay;
    },
    // 获取本地当天日期用于标记今日。
    todayDate() {
      const now = new Date();
      return this.formatDate(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
      );
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  min-height: 100vh;
  padding-bottom: 176rpx;
  background: #f5f7f5;
  color: #1d382c;
}

.hero {
  padding: 54rpx 40rpx 154rpx;
  background: #17865e;
  color: #fff;
}

.hero-top,
.hero-summary,
.calendar-header,
.section-heading,
.reward-card,
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow {
  display: block;
  color: rgba(255, 255, 255, 0.66);
  font-size: 20rpx;
}

.hero-title {
  display: block;
  margin-top: 10rpx;
  font-size: 48rpx;
  font-weight: 700;
}

.rule-trigger {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 14rpx 18rpx;
  border-radius: 28rpx;
  background: #ffffff;
  color: #16845d;
  font-size: 22rpx;
  font-weight: 700;
}

.rule-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30rpx;
  height: 30rpx;
  border: 2rpx solid #16845d;
  border-radius: 50%;
  font-size: 20rpx;
}

.hero-summary {
  justify-content: flex-start;
  margin-top: 66rpx;
}

.summary-item {
  flex: 1;
}
.summary-label {
  display: block;
  color: rgba(255, 255, 255, 0.68);
  font-size: 22rpx;
}
.summary-number {
  margin-top: 10rpx;
  font-size: 48rpx;
  font-weight: 700;
}
.summary-unit {
  margin-left: 6rpx;
  font-size: 22rpx;
}
.summary-line {
  width: 2rpx;
  height: 58rpx;
  background: rgba(255, 255, 255, 0.28);
}
.content {
  margin-top: -110rpx;
  padding: 0 28rpx;
}
.calendar-card,
.reward-card {
  background: #fff;
  box-shadow: 0 14rpx 32rpx rgba(24, 67, 49, 0.08);
}
.calendar-card {
  padding: 30rpx 24rpx;
  border-radius: 16rpx;
}
.calendar-title {
  font-size: 32rpx;
  font-weight: 700;
}
.calendar-note,
.reward-desc {
  color: #91a097;
  font-size: 21rpx;
}
.week-row,
.date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.week-row {
  margin-top: 32rpx;
}
.week-item {
  color: #a3afa8;
  text-align: center;
  font-size: 22rpx;
}
.date-grid {
  row-gap: 14rpx;
  margin-top: 18rpx;
}
.date-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
}
.date-mark {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 58rpx;
  height: 58rpx;
  border-radius: 50%;
  color: #62736a;
  font-size: 24rpx;
}
.date-cell.today .date-mark {
  border: 2rpx solid #26a875;
}
.date-cell.signed .date-mark {
  background: #1d9b6b;
  color: #fff;
}
.check-mark {
  position: absolute;
  right: -2rpx;
  bottom: -5rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22rpx;
  height: 22rpx;
  border-radius: 50%;
  background: #f3c54d;
  color: #fff;
  font-size: 16rpx;
}
.reward-card {
  margin-top: 24rpx;
  padding: 26rpx;
  border-radius: 14rpx;
}
.reward-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #fff2cf;
  color: #de9b16;
  font-size: 42rpx;
}
.reward-copy {
  flex: 1;
  margin-left: 18rpx;
}
.reward-title {
  display: block;
  font-size: 27rpx;
  font-weight: 700;
}
.reward-desc {
  display: block;
  margin-top: 7rpx;
}
.reward-number {
  color: #e59618;
  font-size: 38rpx;
  font-weight: 700;
}
.milestone-section {
  margin-top: 38rpx;
}
.section-heading {
  padding: 0 6rpx;
  font-size: 28rpx;
  font-weight: 700;
}
.section-heading text:last-child {
  color: #819188;
  font-size: 22rpx;
  font-weight: 400;
}
.milestone-scroll {
  margin-top: 20rpx;
  white-space: nowrap;
}
.milestone-list {
  display: inline-flex;
  gap: 16rpx;
  padding: 0 2rpx;
}
.milestone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 180rpx;
  height: 116rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e4ebe6;
  border-radius: 12rpx;
  background: #fff;
}
.milestone.reached {
  border-color: #80cba8;
  background: #effaf4;
}
.milestone-days {
  font-size: 27rpx;
  font-weight: 700;
}
.milestone-energy {
  margin-top: 9rpx;
  color: #e39b1d;
  font-size: 22rpx;
}
.no-milestone {
  color: #93a198;
  font-size: 23rpx;
}
.bottom-action {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  padding: 20rpx 36rpx calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -8rpx 28rpx rgba(24, 67, 49, 0.06);
}
.sign-button {
  height: 88rpx;
  border-radius: 44rpx;
  background: #1b9568;
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 88rpx;
}
.sign-button.signed,
.sign-button.disabled {
  background: #bdc9c2;
}
.make-up-tip {
  display: block;
  margin-top: 12rpx;
  color: #87968d;
  text-align: center;
  font-size: 21rpx;
}

.make-up-button {
  width: 100%;
  height: 64rpx;
  margin-top: 14rpx;
  border: 0;
  background: transparent;
  color: #16845d;
  font-size: 24rpx;
  line-height: 64rpx;
}
.rule-mask {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  background: rgba(17, 38, 29, 0.44);
}
.rule-sheet {
  width: 100%;
  max-height: 72vh;
  padding: 32rpx 30rpx calc(30rpx + env(safe-area-inset-bottom));
  border-radius: 28rpx 28rpx 0 0;
  background: #fff;
}
.sheet-header {
  font-size: 32rpx;
  font-weight: 700;
}
.sheet-close {
  color: #849188;
  font-size: 46rpx;
  font-weight: 400;
}
.rule-content {
  max-height: 54vh;
  margin-top: 25rpx;
  color: #52635a;
  font-size: 26rpx;
  line-height: 1.8;
}
</style>
