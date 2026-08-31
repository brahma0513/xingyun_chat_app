<template>
  <view class="advert-container">
    <view class="advert-bg advert-bg-top"></view>
    <view class="advert-bg advert-bg-bottom"></view>

    <view class="advert-header">
      <view class="countdown-pill">
        <view class="countdown-badge">免</view>
        <view class="countdown-info"
          >观看{{ watchSeconds }}秒，免费解锁一集</view
        >
      </view>

      <view class="header-action">
        <view class="countdown-tag" v-if="!isCountdownFinished"
          >{{ formattedCountdown }}s</view
        >
        <view class="close-btn" @click="handleClose">
          <image
            :src="
              http_host + '/micro_theatre_two/web/static/images/close-white.png'
            "
            class="close-icon"
            mode="aspectFit"
          ></image>
        </view>
      </view>
    </view>

    <!-- 本地广告视频：铺满剩余区域，object-fit cover 消除上下黑边 -->
    <view v-if="playType === 'local'" class="video-card">
      <view class="video-shell">
        <video
          id="advertVideo"
          class="advert-video"
          :src="advertVideoUrl"
          :controls="false"
          :show-center-play-btn="false"
          :show-play-btn="false"
          :enable-progress-gesture="false"
          :page-gesture="false"
          :enable-play-gesture="false"
          object-fit="cover"
          autoplay
          loop
          muted
          @loadedmetadata="handleVideoReady"
          @loadeddata="handleVideoReady"
          @play="handleVideoPlay"
          @ended="handleVideoEnded"
          @error="handleVideoError"
        ></video>

        <view class="video-mask" v-if="isVideoError">
          <view class="video-mask-title">广告加载中断</view>
          <view class="video-mask-desc"
            >当前广告暂时无法播放，倒计时仍将继续</view
          >
        </view>

        <view class="video-ready-tag" v-if="isVideoReady && !isVideoError"
          >广告</view
        >
      </view>
    </view>

    <u-popup
      :show="showClosePopup"
      mode="center"
      bgColor="transparent"
      :zIndex="10100"
      @close="closeClosePopup"
    >
      <view class="close-popup">
        <view class="close-popup-title">提示</view>
        <view class="close-popup-desc">现在离开就没法解锁哦</view>
        <view class="close-popup-primary" @click="handleContinueWatch"
          >继续浏览</view
        >
        <view class="close-popup-secondary" @click="handleGiveUpReward"
          >放弃观看</view
        >
      </view>
    </u-popup>
  </view>
</template>

<script>
import url from "@/utils/request.js";
import empty from "@/micro_theatre_two/components/empty/empty.vue";
import * as globalData from "@/utils/config";

function request(config = {}) {
  const reqUrl = config.url || "";
  const reqData = config.data || {};
  const reqMethod = config.method || "POST";
  return url.request(reqUrl, reqData, reqMethod);
}
export default {
  components: { empty },
  data() {
    const base = (() => {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      return String(u).replace(/\/+$/, "");
    })();
    return {
      customer_id:
        this.vuex_customer_id || Number(globalData.customer_id || 0) || 0,
      http_host: base,
      // 兜底视频：接口失败也能正常播放
      advertVideoUrl: base + "/micro_theatre_two/web/static/video/v8.mp4",
      watchSeconds: 30,
      // 观看广告前的播放进度（秒），用于广告解锁返回后继续观看
      resumeTime: 0,
      dramaId: "",
      episode: 1,
      countdownSeconds: 30,
      countdownTimer: null,
      isCountdownFinished: false,
      isVideoError: false,
      isVideoReady: false,
      videoContext: null,
      showClosePopup: false,
      hasRewardSent: false,
      // 当前播放的广告素材 id（theatre_ad_video.id），用于观看记录
      adVideoId: 0,
      // 广告播放策略：local(本地), rewarded(激励), random(随机)
      adMode: "local",
      // 本次实际播放类型
      playType: "local",
      rewardedEnabled: false,
      rewardedAdpid: "",
      localEnabled: true,
      localWeight: 50,
      rewardWeight: 50,
    };
  },
  // 页面加载时启动广告倒计时。
  onLoad(res) {
    this.syncMicroTheatreHttpHost();
    const query = (this.$Route && this.$Route.query) || res || {};
    this.dramaId = query.drama_id || query.id || "";
    const ep = Number(query.episode);
    this.episode = Number.isFinite(ep) && ep > 0 ? Math.floor(ep) : 1;
    const resume = Number(query.resume_time || query.resumeTime || 0);
    this.resumeTime =
      Number.isFinite(resume) && resume >= 0 ? Math.floor(resume) : 0;
    this.fetchAdvertVideoAndStart();
  },
  // 页面渲染完成后创建 video 上下文。
  onReady() {
    this.videoContext = uni.createVideoContext("advertVideo", this);
  },
  // 页面卸载时清理倒计时，避免定时器残留。
  onUnload() {
    this.clearCountdownTimer();
  },
  onShow() {
    this.syncMicroTheatreHttpHost();
  },
  computed: {
    // 格式化倒计时数字，保证个位数时补零显示。
    formattedCountdown() {
      return this.countdownSeconds < 10
        ? "0" + this.countdownSeconds
        : "" + this.countdownSeconds;
    },
  },
  methods: {
    syncMicroTheatreHttpHost() {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      this.http_host = String(u).replace(/\/+$/, "");
    },
    // 获取随机广告视频，并启动倒计时
    async fetchAdvertVideoAndStart() {
      // 默认兜底：如果接口失败也能继续播放
      this.advertVideoUrl =
        (this.http_host || "") + "/micro_theatre_two/web/static/video/v8.mp4";
      this.watchSeconds = 30;
      this.countdownSeconds = 30;
      this.playType = "local";
      this.adMode = "local";
      this.rewardedEnabled = false;
      this.rewardedAdpid = "";
      this.localEnabled = true;
      this.localWeight = 50;
      this.rewardWeight = 50;

      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=advert_video_random_get",
          method: "POST",
          data: {},
        });

        if (res && res.errcode === 403) {
          uni.showToast({
            title: (res.errmsg || "广告未启用").replace(/\n/g, ""),
            icon: "none",
          });
          setTimeout(() => {
            uni.navigateBack({ fail: () => {} });
          }, 1600);
          return;
        }
        if (res && res.errcode === 400) {
          uni.showToast({
            title: (res.errmsg || "广告配置异常").replace(/\n/g, ""),
            icon: "none",
          });
          setTimeout(() => {
            uni.navigateBack({ fail: () => {} });
          }, 1600);
          return;
        }

        if (res && res.errcode === 0 && res.data) {
          if (res.data.video_url) this.advertVideoUrl = res.data.video_url;
          if (res.data.watch_seconds)
            this.watchSeconds = Number(res.data.watch_seconds) || 30;
          this.countdownSeconds = this.watchSeconds;
          const aid = Number(res.data.ad_video_id);
          this.adVideoId =
            Number.isFinite(aid) && aid > 0 ? Math.floor(aid) : 0;
          // system_config.ad_basic_setting：ad_mode=rewarded 时带 rewarded_ad_unit_id / rewarded_adpid
          this.adMode = (res.data.mode || res.data.ad_mode || "local")
            .toString()
            .toLowerCase();
          this.rewardedAdpid = String(
            res.data.rewarded_ad_unit_id ||
              res.data.rewarded_adpid ||
              res.data.adpid ||
              res.data.tencent_app_id ||
              "",
          ).trim();
          this.rewardedEnabled =
            Number(
              res.data.rewarded_enabled != null ? res.data.rewarded_enabled : 0,
            ) === 1 && !!this.rewardedAdpid;
          this.localEnabled =
            Number(
              res.data.local_enabled != null ? res.data.local_enabled : 1,
            ) === 1;
          this.localWeight = Math.max(
            0,
            Number(
              res.data.local_weight != null ? res.data.local_weight : 50,
            ) || 50,
          );
          this.rewardWeight = Math.max(
            0,
            Number(
              res.data.reward_weight != null ? res.data.reward_weight : 50,
            ) || 50,
          );
        }
      } catch (e) {
        // 接口失败不阻断倒计时
      }

      const mode = this.resolveAdPlayMode();
      if (mode === "none") {
        uni.showToast({
          title: "当前仅支持激励视频，暂时无法播放",
          icon: "none",
        });
        setTimeout(() => {
          uni.navigateBack({ fail: () => {} });
        }, 1600);
        return;
      }
      if (mode === "rewarded") {
        this.playType = "rewarded";
        this.playRewardedAd();
        return;
      }
      this.playType = "local";
      this.startCountdown(this.watchSeconds);
    },
    /** 激励已开启但拉取失败：降级本地广告（不因后台未勾选 local 而阻断） */
    tryRewardedFallbackToLocal() {
      if (this.localEnabled || this.rewardedEnabled) {
        this.playType = "local";
        this.isVideoError = false;
        this.isVideoReady = false;
        uni.showToast({
          title: "激励视频加载失败，已切换本地广告",
          icon: "none",
          duration: 2000,
        });
        this.$nextTick(() => {
          this.videoContext = uni.createVideoContext("advertVideo", this);
          this.startCountdown(this.watchSeconds);
        });
        return true;
      }
      uni.showToast({
        title: "激励视频加载失败，请稍后重试",
        icon: "none",
      });
      return false;
    },
    resolveAdPlayMode() {
      const mode = (this.adMode || "local").toLowerCase();
      if (mode === "rewarded") {
        if (this.rewardedEnabled) return "rewarded";
        return this.localEnabled ? "local" : "none";
      }
      if (mode === "random") {
        if (!this.rewardedEnabled && this.localEnabled) return "local";
        if (this.rewardedEnabled && !this.localEnabled) return "rewarded";
        if (!this.rewardedEnabled && !this.localEnabled) return "none";
        const total = this.localWeight + this.rewardWeight;
        if (total <= 0) return this.localEnabled ? "local" : "none";
        const roll = Math.random() * total;
        if (roll < this.rewardWeight) {
          return this.rewardedEnabled
            ? "rewarded"
            : this.localEnabled
              ? "local"
              : "none";
        }
        return this.localEnabled
          ? "local"
          : this.rewardedEnabled
            ? "rewarded"
            : "none";
      }
      return "local";
    },
    playRewardedAd() {
      if (!this.rewardedAdpid) {
        this.tryRewardedFallbackToLocal();
        return;
      }
      let rewardedVideoAd = null;
      try {
        rewardedVideoAd = uni.createRewardedVideoAd({
          adpid: this.rewardedAdpid,
          urlCallback: {
            userId: (this.vuex_user && this.vuex_user.user_id) || "",
            extra: {
              drama_id: this.dramaId || "",
              episode: this.episode || 1,
              resume_time: this.resumeTime || 0,
            },
          },
        });
      } catch (e) {
        this.tryRewardedFallbackToLocal();
        return;
      }
      if (
        !rewardedVideoAd ||
        typeof rewardedVideoAd.onError !== "function" ||
        typeof rewardedVideoAd.load !== "function"
      ) {
        this.tryRewardedFallbackToLocal();
        return;
      }

      rewardedVideoAd.onError(() => {
        this.tryRewardedFallbackToLocal();
      });
      rewardedVideoAd.onClose((res) => {
        if (res && res.isEnded) {
          this.isCountdownFinished = true;
          this.clearCountdownTimer();
          this.handleFinishUnlock();
          return;
        }
        // 未看完不解锁，留在广告页
      });
      rewardedVideoAd
        .load()
        .then(() => rewardedVideoAd.show())
        .catch(() => {
          this.tryRewardedFallbackToLocal();
        });
    },

    // 启动广告倒计时
    startCountdown(seconds = 30) {
      console.log("[advert] startCountdown begin");
      this.clearCountdownTimer();
      this.watchSeconds = Number(seconds) || 30;
      this.countdownSeconds = this.watchSeconds;
      this.isCountdownFinished = false;
      this.countdownTimer = setInterval(() => {
        if (this.countdownSeconds <= 1) {
          this.countdownSeconds = 0;
          this.isCountdownFinished = true;
          this.clearCountdownTimer();
          console.log(
            "[advert] countdown finished, trigger handleFinishUnlock",
          );
          this.handleFinishUnlock();
          return;
        }

        this.countdownSeconds -= 1;
      }, 1000);
    },
    // 清理倒计时定时器，避免重复计时。
    clearCountdownTimer() {
      if (!this.countdownTimer) {
        return;
      }

      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    },
    // 点击关闭按钮时打开离开确认弹窗。
    handleClose() {
      console.log(
        "[advert] handleClose, isCountdownFinished=",
        this.isCountdownFinished,
        "hasRewardSent=",
        this.hasRewardSent,
      );
      // 如果还没看满 30 秒，需要提示“现在离开就没法解锁哦”
      if (!this.isCountdownFinished && !this.hasRewardSent) {
        if (this.videoContext) {
          try {
            this.videoContext.pause();
          } catch (e) {
            /* ignore */
          }
        }
        this.showClosePopup = true;
        return;
      }
      // 已经完成 30 秒观看或已发放解锁资格，直接返回播放页，不再弹提示
      uni.navigateBack({
        fail() {
          // ignore
        },
      });
    },
    closeClosePopup(restoreVideo = true) {
      this.showClosePopup = false;
      if (!restoreVideo || this.playType !== "local") {
        return;
      }
      this.$nextTick(() => {
        this.videoContext = uni.createVideoContext("advertVideo", this);
        if (
          this.videoContext &&
          !this.isCountdownFinished &&
          !this.isVideoError
        ) {
          try {
            this.videoContext.play();
          } catch (e) {
            /* ignore */
          }
        }
      });
    },
    // 点击继续浏览时先关闭弹窗，后续再接业务动作。
    handleContinueWatch() {
      this.closeClosePopup(true);
    },
    // 点击放弃领取时先关闭弹窗，后续再接业务动作。
    handleGiveUpReward() {
      this.showClosePopup = false;
      // 直接返回，不发放解锁资格
      uni.navigateBack({
        fail() {
          // ignore
        },
      });
    },
    // 视频元数据加载完成后更新可播放状态。
    handleVideoReady() {
      this.isVideoReady = true;
      this.isVideoError = false;
    },
    // 视频开始播放后同步更新可播放状态。
    handleVideoPlay() {
      this.isVideoReady = true;
    },
    // 视频播放结束后，在倒计时未完成时继续循环播放。
    handleVideoEnded() {
      if (!this.videoContext || this.isCountdownFinished) {
        return;
      }

      this.videoContext.seek(0);
      this.videoContext.play();
    },
    // 视频播放报错时切换到错误提示态。
    handleVideoError() {
      this.isVideoError = true;
    },
    // 倒计时完成后，发放一次性的广告解锁事件，并返回上一页
    handleFinishUnlock() {
      console.log(
        "[advert] handleFinishUnlock called, hasRewardSent=",
        this.hasRewardSent,
        "episode=",
        this.episode,
        "dramaId=",
        this.dramaId,
      );
      if (this.hasRewardSent) {
        return;
      }
      this.hasRewardSent = true;
      const ep = Number(this.episode) || 1;
      const did = Number(this.dramaId);
      const dramaIdNum = Number.isFinite(did) && did > 0 ? Math.floor(did) : 0;
      // 记录用户观看广告日志（失败不影响解锁）
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=advert_watch_log_add",
        method: "POST",
        data: {
          drama_id: dramaIdNum,
          episode: ep,
          watch_seconds: this.watchSeconds,
          ad_video_id: this.adVideoId || 0,
          play_type: this.playType || "local",
        },
      }).catch(() => {});
      const payload = {
        dramaId: this.dramaId || "",
        episode: ep,
        watchSeconds: this.watchSeconds,
        resume_time: this.resumeTime,
      };
      console.log(
        "[advert] will write global last_ad_unlock payload=",
        payload,
      );
      // 全局记录一次，避免 H5 返回时页面实例被销毁导致事件丢失
      try {
        const app = getApp && getApp();
        if (app) {
          app.globalData = app.globalData || {};
          app.globalData.last_ad_unlock = {
            ...payload,
            ts: Date.now(),
          };
          console.log(
            "[advert] globalData.last_ad_unlock set success",
            app.globalData.last_ad_unlock,
          );
        }
      } catch (e) {
        console.log("[advert] set globalData.last_ad_unlock error", e);
      }
      // 同时发事件，兼容小程序等不会销毁前一页实例的场景
      console.log("[advert] emit ad_unlock_success", payload);
      uni.$emit("ad_unlock_success", payload);
      uni.showToast({
        title: "已完成观看，可免费观看本集",
        icon: "none",
        duration: 1500,
      });
      // 广告解锁成功后自动返回播放页，避免支付/解锁弹窗残留
      uni.navigateBack({
        delta: 1,
        fail() {
          // ignore
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.advert-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(
      circle at top center,
      rgba(201, 177, 255, 0.42) 0%,
      rgba(201, 177, 255, 0.08) 28%,
      rgba(15, 12, 26, 0) 58%
    ),
    linear-gradient(
      180deg,
      #13101b 0%,
      #22152e 18%,
      #2a1834 42%,
      #150f20 64%,
      #0a0a0d 100%
    );
  box-sizing: border-box;
}

.advert-bg {
  position: absolute;
  border-radius: 50%;
  filter: blur(24rpx);
  opacity: 0.7;
  pointer-events: none;
}

.advert-bg-top {
  top: 72rpx;
  left: -36rpx;
  width: 220rpx;
  height: 220rpx;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.38) 0%,
    rgba(196, 175, 255, 0.24) 36%,
    rgba(196, 175, 255, 0) 72%
  );
}

.advert-bg-bottom {
  right: -68rpx;
  bottom: 260rpx;
  width: 260rpx;
  height: 260rpx;
  background: radial-gradient(
    circle,
    rgba(255, 208, 138, 0.26) 0%,
    rgba(255, 208, 138, 0.08) 40%,
    rgba(255, 208, 138, 0) 76%
  );
}

/* 高于视频弹层 u-popup(zIndex 10072)，保证倒计时与关闭可点 */
.advert-header {
  position: relative;
  z-index: 10085;
  flex-shrink: 0;
  padding-top: calc(24rpx + constant(safe-area-inset-top));
  padding-top: calc(24rpx + env(safe-area-inset-top));
  padding-left: 20rpx;
  padding-right: 20rpx;
  padding-bottom: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.countdown-pill {
  display: flex;
  align-items: center;
  max-width: 520rpx;
  padding: 10rpx 22rpx 10rpx 10rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.12);
  border-radius: 999rpx;
  background: rgba(8, 8, 12, 0.62);
  box-shadow: 0 14rpx 32rpx rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(16rpx);
}

.countdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #45f3c6 0%, #23c67a 100%);
  color: #0e1315;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
}

.countdown-info {
  margin-left: 12rpx;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 600;
  line-height: 36rpx;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
}

.header-action {
  display: flex;
  align-items: center;
  column-gap: 12rpx;
  flex-shrink: 0;
}

.countdown-tag,
.close-btn {
  border: 2rpx solid rgba(255, 255, 255, 0.12);
  background: rgba(8, 8, 12, 0.6);
  box-shadow: 0 12rpx 28rpx rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(14rpx);
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-icon {
  width: 22rpx;
  height: 22rpx;
}

.countdown-tag {
  padding: 0 18rpx;
  height: 56rpx;
  border-radius: 999rpx;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 600;
  line-height: 52rpx;
  text-align: center;
  box-sizing: border-box;
}

.close-btn {
  position: relative;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.video-card {
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  background-color: #000000;
}

.video-shell {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background-color: #000000;
}

.advert-video {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.video-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  background: linear-gradient(
    180deg,
    rgba(20, 16, 34, 0.82) 0%,
    rgba(10, 10, 14, 0.92) 100%
  );
  text-align: center;
  box-sizing: border-box;
}

.video-mask-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92rpx;
  height: 92rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #45f3c6 0%, #ffe18a 100%);
  color: #171717;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1;
}

.video-mask-title {
  margin-top: 24rpx;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 48rpx;
}

.video-mask-desc {
  margin-top: 8rpx;
  color: rgba(255, 255, 255, 0.72);
  font-size: 24rpx;
  line-height: 36rpx;
}

.video-ready-tag {
  position: absolute;
  right: 24rpx;
  bottom: 34rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(7, 9, 12, 0.5);
  color: rgba(255, 255, 255, 0.78);
  font-size: 22rpx;
  font-weight: 600;
  line-height: 30rpx;
  backdrop-filter: blur(10rpx);
}

.close-popup {
  width: 560rpx;
  padding: 54rpx 40rpx 42rpx;
  border-radius: 32rpx;
  background: #ffffff;
  box-sizing: border-box;
  text-align: center;
}

.close-popup-logo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 132rpx;
  height: 132rpx;
  border-radius: 28rpx;
  background: linear-gradient(180deg, #ffd732 0%, #ffc800 100%);
  box-shadow: 0 16rpx 32rpx rgba(255, 200, 0, 0.24);
  overflow: hidden;
}

.close-popup-logo-text {
  position: relative;
  z-index: 2;
  color: #2a2a2a;
  font-size: 52rpx;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 2rpx;
}

.close-popup-logo-badge {
  position: absolute;
  right: 22rpx;
  bottom: 22rpx;
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  background: linear-gradient(180deg, #ffffff 0%, #f2f2f2 100%);
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.14);
}

.close-popup-logo-wave {
  position: absolute;
  bottom: -18rpx;
  width: 66rpx;
  height: 44rpx;
  border-radius: 999rpx;
  background: linear-gradient(180deg, #ff8a4a 0%, #ff5c42 100%);
  opacity: 0.92;
}

.wave-left {
  left: -6rpx;
}

.wave-right {
  right: -6rpx;
}

.close-popup-title {
  margin-bottom: 40rpx;
  color: #1e1e1e;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 54rpx;
}

.close-popup-desc {
  margin-top: 18rpx;
  color: #8f8f8f;
  font-size: 30rpx;
  line-height: 38rpx;
}

.close-popup-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50rpx;
  height: 96rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #12d3a3 0%, #12d98a 100%);
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 700;
  line-height: 1;
}

.close-popup-secondary {
  margin-top: 42rpx;
  color: #8f8f8f;
  font-size: 30rpx;
  line-height: 44rpx;
}
</style>
