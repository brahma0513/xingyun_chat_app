<template>
  <view class="page">
    <view class="arena" :style="arenaStyle">
      <view class="hud">
        <view class="user-card">
          <image
            v-if="garden.user.avatar"
            class="avatar-image"
            :src="garden.user.avatar"
            mode="aspectFill"
          />
          <view v-else class="avatar-text">{{ avatarText }}</view>
          <view class="user-copy">
            <text class="user-name">{{ garden.user.nickname }}</text>
            <text class="user-level">{{ garden.user.level_name }}</text>
          </view>
        </view>
        <view class="data-row">
          <view
            ><text class="data-label">累计活力值</text
            ><text class="data-value primary">{{
              garden.user.energy || 0
            }}</text></view
          >
          <view
            ><text class="data-label">今日活力</text
            ><text class="data-value">{{
              garden.today_energy || 0
            }}</text></view
          >
          <view
            ><text class="data-label">今日红包机会</text
            ><text class="data-value">{{
              garden.today_red_envelope_count || 0
            }}</text></view
          >
        </view>
        <view class="rule-button" @tap="showRules">
          <u-icon name="file-text" color="#177457" size="18"></u-icon>
          <text>规则</text>
        </view>
      </view>

      <view
        v-for="(bubble, index) in displayBubbles"
        :key="bubbleKey(bubble)"
        class="bubble"
        :class="[
          bubblePosition(index, bubble.id, bubble.bubble_type),
          bubbleFloatClass(bubble),
          {
            red: bubble.bubble_type == 'red_envelope_count',
            quota: bubble.bubble_type == 'red_envelope_quota',
            locked: garden.bubble_receive_locked == 1,
            collecting: isBubbleCollecting(bubble.id),
          },
        ]"
        @tap="handleBubble(bubble)"
      >
        <text class="bubble-value">+{{ bubbleValue(bubble) }}</text>
        <text class="bubble-label">{{ bubbleLabel(bubble) }}</text>
        <text class="bubble-source">{{ bubble.source_name }}</text>
      </view>

      <view
        v-for="effect in collectEffects"
        :key="effect.id"
        class="collect-effect"
        :class="[
          bubblePosition(effect.index, effect.bubble_id, effect.bubble_type),
          effect.bubble_type,
        ]"
      >
        <view v-if="effect.bubble_type == 'energy'" class="collect-orb">
          <text>+{{ effect.value }}</text>
        </view>
        <block v-else>
          <text class="collect-value">+{{ effect.value }}</text>
          <text class="collect-label">{{ effect.label }}</text>
        </block>
      </view>

      <view class="stage">
        <view class="shine"></view>
        <view class="disc"></view>
        <image
          class="shoe"
          :src="
            garden.user.shoe_img ||
            httpHost +
              '/functional_shoe_agent/web/static/images/energy-garden-running-shoe.png'
          "
          mode="widthFix"
        />
        <text class="shoe-level">{{ garden.user.level_name }}</text>
      </view>

      <view class="bottom-dock">
        <view class="feed-panel">
          <text class="feed-title">能量动态</text>
          <swiper
            v-if="feedGroups.length"
            class="feed-swiper"
            vertical
            circular
            autoplay
            :interval="3200"
            :duration="500"
          >
            <swiper-item
              v-for="(group, groupIndex) in feedGroups"
              :key="groupIndex"
              class="feed-group"
            >
              <view v-for="item in group" :key="item.id" class="feed-item">
                <text class="feed-text">{{ item.text }}</text>
                <text class="feed-time">{{ item.create_time }}</text>
              </view>
            </swiper-item>
          </swiper>
          <view v-else class="feed-empty">暂无能量动态</view>
        </view>

        <view
          v-if="garden.is_self == 1"
          class="friends-button"
          @tap="openFriends"
        >
          <image
            class="friends-icon"
            :src="
              httpHost +
              '/functional_shoe_agent/web/static/images/friend-shoe-garden.png'
            "
            mode="widthFix"
          ></image>
          <view
            ><text class="friends-title">好友鞋园</text
            ><text class="friends-subtitle">去收取 ›</text></view
          >
        </view>
        <view v-else class="friends-button back-button" @tap="backToMyGarden">
          <view
            ><text class="friends-title">我的鞋园</text
            ><text class="friends-subtitle">返回领取 ›</text></view
          >
        </view>
      </view>
    </view>

    <view v-if="showFriendSheet" class="mask" @tap="closeFriends">
      <view class="sheet" @tap.stop>
        <view class="handle"></view>
        <view class="sheet-head"
          ><text class="sheet-title">好友鞋园</text
          ><text class="sheet-desc"></text
        ></view>
        <scroll-view class="friend-list" scroll-y>
          <view
            v-for="friend in friends"
            :key="friend.target_user_id"
            class="friend-row"
            @tap="enterFriendGarden(friend)"
          >
            <image
              v-if="friend.avatar"
              class="friend-avatar"
              :src="friend.avatar"
              mode="aspectFill"
            />
            <view v-else class="friend-avatar fallback">{{
              friend.nickname.slice(0, 1)
            }}</view>
            <view class="friend-copy"
              ><text class="friend-name">{{ friend.nickname }}</text
              ><text class="friend-desc"
                >{{ friend.bubble_count }}个气泡，可偷{{
                  friend.energy_amount
                }}活力值</text
              ></view
            >
            <text class="go-text">去偷取</text>
          </view>
          <view v-if="!friends.length" class="friend-empty">暂无好友鞋园</view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  // 初始化活力鞋园页面运行状态。
  data() {
    return {
      httpHost: "",
      setting: {},
      garden: {
        is_self: 1,
        user: {},
        today_energy: 0,
        today_red_envelope_count: 0,
        bubbles: [],
        quota: {},
      },
      friends: [],
      feeds: [],
      showFriendSheet: false,
      loadingGarden: false,
      rewardedVideoAd: null,
      adStatus: "preparing",
      adShowing: false,
      pendingBubble: null,
      bubbleSubmitting: false,
      adPollTimer: null,
      adPollCount: 0,
      collectingBubbleIds: [],
      collectEffects: [],
      collectTimers: [],
      bubblePositionMap: {},
    };
  },
  computed: {
    // 生成全屏鞋园背景图样式。
    arenaStyle() {
      const backgroundImg =
        this.setting.background_img_url ||
        this.httpHost +
          "/functional_shoe_agent/web/static/images/energy-garden-background.png";
      return (
        "background: url('" + backgroundImg + "') center / cover no-repeat;"
      );
    },
    // 生成头像缺省时显示的昵称首字。
    avatarText() {
      return (this.garden.user.nickname || "").slice(0, 1);
    },
    // 限制首屏最多展示八个漂浮气泡。
    displayBubbles() {
      return (this.garden.bubbles || []).slice(0, 8);
    },
    // 将能量动态每两条分为一组，供底部轮播同时展示两条记录。
    feedGroups() {
      const groups = [];
      const feeds = this.feeds || [];
      for (let index = 0; index < feeds.length; index = index + 2) {
        groups.push(feeds.slice(index, index + 2));
      }
      return groups;
    },
  },
  // 页面首次加载时分别查询设置、鞋园、好友和动态。
  onLoad() {
    this.httpHost = this.vuex_apiUrl;
    this.getEnergyShoesSetting();
    this.getEnergyShoesData();
    this.getEnergyShoesFriends();
    this.getEnergyShoesFeed();
  },
  // 页面重新显示时刷新当前鞋园和全站动态。
  onShow() {
    if (this.httpHost) {
      this.getEnergyShoesData(
        this.garden.is_self == 1 ? "" : this.garden.user.target_user_id,
      );
      this.getEnergyShoesFeed();
    }
  },
  // 下拉刷新时并行刷新鞋园、好友和动态。
  onPullDownRefresh() {
    Promise.all([
      this.getEnergyShoesData(
        this.garden.is_self == 1 ? "" : this.garden.user.target_user_id,
      ),
      this.getEnergyShoesFriends(),
      this.getEnergyShoesFeed(),
    ]).finally(() => {
      uni.stopPullDownRefresh();
    });
  },
  // 页面卸载时释放广告资格轮询定时器。
  onUnload() {
    this.clearAdPolling();
    this.clearCollectAnimations();
  },
  methods: {
    // 查询活力鞋园规则和偷取次数设置，并初始化激励视频实例。
    getEnergyShoesSetting() {
      return this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=get_energy_shoes_setting",
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode == 0) {
            this.setting = res.data || {};
            this.initRewardedVideoAd();
          }
        })
        .catch(() => {
          this.adStatus = "none";
        });
    },

    // 查询自己或指定好友的鞋园、统计和气泡数据。
    getEnergyShoesData(targetUserId = "") {
      this.loadingGarden = true;
      return this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=get_energy_shoes_data",
          data: { target_user_id: targetUserId },
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode == 0) {
            this.syncBubblePositions(res.data.bubbles || []);
            this.garden = res.data;
          }
        })
        .catch((error) => {
          this.showToast(error.errmsg || "鞋园加载失败");
        })
        .finally(() => {
          this.loadingGarden = false;
        });
    },

    // 查询上下10级团队与同商户随机补位的好友鞋园列表。
    getEnergyShoesFriends() {
      return this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=get_energy_shoes_friends",
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode == 0) this.friends = res.data.list || [];
        })
        .catch(() => {});
    },

    // 查询当前商户最近的全站能量动态。
    getEnergyShoesFeed() {
      return this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=get_energy_shoes_feed",
          data: { page: 1, per_page: 20 },
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode == 0) this.feeds = res.data.list || [];
        })
        .catch(() => {});
    },

    // 初始化固定用途为energy_purloin的激励视频广告实例。
    initRewardedVideoAd() {
      this.adStatus = "none";
      // #ifdef APP-PLUS
      if (!this.setting.adpid || !uni.createRewardedVideoAd) {
        return;
      }
      this.adStatus = "preparing";
      this.rewardedVideoAd = uni.createRewardedVideoAd({
        adpid: this.setting.adpid,
        urlCallback: {
          userId: this.vuex_user.user_id || "",
          extra: "energy_purloin",
        },
      });
      this.rewardedVideoAd.onLoad(() => {
        this.adStatus = "ready";
      });
      this.rewardedVideoAd.onError((error) => {
        this.adShowing = false;
        this.adStatus = "none";
        this.showToast(error && error.errMsg ? error.errMsg : "暂无广告");
      });
      this.rewardedVideoAd.onClose((result) => {
        this.adShowing = false;
        if (result && result.isEnded) {
          this.showToast("广告完成，正在确认资格");
          this.startAdPolling();
        } else {
          this.showToast("广告未完整观看");
        }
      });
      // #endif
    },

    // 根据当前所在鞋园领取自己的气泡或尝试偷取好友气泡。
    handleBubble(bubble) {
      if (this.bubbleSubmitting) return;
      if (this.garden.bubble_receive_locked == 1) {
        this.showToast("请等待红包领取结束后再收取气泡");
        return;
      }
      if (this.garden.is_self == 1) {
        this.receiveBubble(bubble);
        return;
      }
      this.purloinBubble(bubble);
    },

    // 领取自己的单个待领取气泡。
    receiveBubble(bubble) {
      this.bubbleSubmitting = true;
      this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=receive_energy_bubble",
          data: { bubble_id: bubble.id },
          method: "POST",
          needToken: true,
        })
        .then(async (res) => {
          this.showToast(res.errmsg || "领取成功");
          await this.playCollectAnimation(bubble);
          await Promise.all([
            this.getEnergyShoesData(),
            this.getEnergyShoesFeed(),
          ]);
          this.finishCollectAnimation(bubble.id);
        })
        .catch((error) => this.showToast(error.errmsg || "领取失败"))
        .finally(() => {
          this.bubbleSubmitting = false;
        });
    },

    // 判断指定气泡是否正在播放收取动画。
    isBubbleCollecting(bubbleId) {
      return this.collectingBubbleIds.indexOf(bubbleId) >= 0;
    },

    // 播放气泡平滑收缩和奖励文字飞向顶部统计区的收取效果。
    playCollectAnimation(bubble) {
      const index = this.displayBubbles.findIndex(
        (item) => this.bubbleKey(item) == this.bubbleKey(bubble),
      );
      const effect = {
        id: bubble.id + "_" + Date.now(),
        bubble_id: bubble.id,
        index: index >= 0 ? index : 0,
        bubble_type: bubble.bubble_type,
        value: this.bubbleValue(bubble),
        label: this.bubbleLabel(bubble),
      };
      this.collectingBubbleIds = [...this.collectingBubbleIds, bubble.id];
      this.collectEffects = [...this.collectEffects, effect];

      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          this.collectEffects = this.collectEffects.filter(
            (item) => item.id != effect.id,
          );
          this.collectTimers = this.collectTimers.filter(
            (item) => item != timer,
          );
          resolve();
        }, 800);
        this.collectTimers.push(timer);
      });
    },

    // 数据刷新完成后移除透明占位气泡并结束收取状态。
    finishCollectAnimation(bubbleId) {
      this.garden.bubbles = (this.garden.bubbles || []).filter(
        (item) => item.id != bubbleId,
      );
      this.collectingBubbleIds = this.collectingBubbleIds.filter(
        (item) => item != bubbleId,
      );
    },

    // 页面离开时清理未结束的气泡收取动画。
    clearCollectAnimations() {
      this.collectTimers.forEach((timer) => clearTimeout(timer));
      this.collectTimers = [];
      this.collectingBubbleIds = [];
      this.collectEffects = [];
    },

    // 尝试偷取好友气泡，基础次数用完时引导观看广告。
    purloinBubble(bubble) {
      this.bubbleSubmitting = true;
      this.pendingBubble = bubble;
      this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=purloin_energy_bubble",
          data: { bubble_id: bubble.id },
          method: "POST",
          needToken: true,
        })
        .then((res) => {
          this.pendingBubble = null;
          this.showToast(res.errmsg || "偷取成功");
          this.refreshAfterPurloin();
        })
        .catch((error) => {
          if (error.errcode == 2) {
            this.confirmWatchAd();
            return;
          }
          this.pendingBubble = null;
          this.showToast(error.errmsg || "偷取失败");
        })
        .finally(() => {
          this.bubbleSubmitting = false;
        });
    },

    // 基础次数用完后确认是否观看广告换取一次偷取资格。
    confirmWatchAd() {
      if (this.adStatus != "ready" || this.adShowing) {
        this.showToast(
          this.adStatus == "preparing" ? "广告准备中" : "暂无广告",
        );
        return;
      }
      uni.showModal({
        title: "继续偷取",
        content: "观看一条激励视频广告，可继续偷取1次活力值。",
        confirmText: "观看广告",
        success: (result) => {
          if (result.confirm) this.showRewardedVideoAd();
        },
      });
    },

    // 展示已经加载成功的激励视频广告。
    showRewardedVideoAd() {
      if (!this.rewardedVideoAd || this.adStatus != "ready" || this.adShowing)
        return;
      this.adShowing = true;
      this.adStatus = "preparing";
      const showResult = this.rewardedVideoAd.show();
      if (showResult && showResult.catch) {
        showResult.catch(() => {
          this.adShowing = false;
          this.adStatus = "none";
          this.showToast("暂无广告");
        });
      }
    },

    // 广告关闭后轮询服务端，确认安全回调已生成偷取资格。
    startAdPolling() {
      this.clearAdPolling();
      this.adPollCount = 0;
      this.adPollTimer = setInterval(() => {
        this.adPollCount = this.adPollCount + 1;
        this.getEnergyPurloinAdStatus();
        if (this.adPollCount >= 15) {
          this.clearAdPolling();
          this.showToast("奖励确认中，请稍后再试");
        }
      }, 1000);
    },

    // 查询广告偷取资格，到账后自动重试用户刚才点击的气泡。
    getEnergyPurloinAdStatus() {
      return this.$common
        .requestData({
          url: "/functional_shoe_agent/web/index.php?m=redpack&a=get_energy_purloin_ad_status",
          method: "POST",
          needToken: true,
          needLoading: false,
        })
        .then((res) => {
          if (res.errcode == 0 && res.data.has_pending_ad == 1) {
            this.clearAdPolling();
            if (this.pendingBubble) this.purloinBubble(this.pendingBubble);
          }
        })
        .catch(() => {});
    },

    // 清理广告资格轮询定时器。
    clearAdPolling() {
      if (this.adPollTimer) {
        clearInterval(this.adPollTimer);
        this.adPollTimer = null;
      }
      this.adPollCount = 0;
    },

    // 偷取成功后刷新好友鞋园、次数、好友列表和全站动态。
    refreshAfterPurloin() {
      this.getEnergyShoesData(this.garden.user.target_user_id);
      this.getEnergyShoesFriends();
      this.getEnergyShoesFeed();
    },

    // 打开后台配置的活力鞋园规则弹窗。
    showRules() {
      uni.showModal({
        title: "活力鞋园规则",
        content: this.setting.rules || "暂无规则说明",
        showCancel: false,
      });
    },

    // 打开好友鞋园列表弹层。
    openFriends() {
      this.showFriendSheet = true;
    },

    // 关闭好友鞋园列表弹层。
    closeFriends() {
      this.showFriendSheet = false;
    },

    // 从好友列表进入指定好友的鞋园。
    enterFriendGarden(friend) {
      this.showFriendSheet = false;
      this.getEnergyShoesData(friend.target_user_id);
    },

    // 从好友鞋园返回自己的鞋园。
    backToMyGarden() {
      this.pendingBubble = null;
      this.getEnergyShoesData();
    },

    // 组合记录ID和奖励类型，保证不同资产气泡具有独立标识。
    bubbleKey(bubble) {
      return bubble.id + "_" + bubble.bubble_type;
    },

    // 根据气泡唯一标识分配稳定的漂浮动画，避免所有气泡同步上下移动。
    bubbleFloatClass(bubble) {
      const key = this.bubbleKey(bubble);
      let seed = 0;
      for (let index = 0; index < key.length; index = index + 1) {
        seed += key.charCodeAt(index) * (index + 1);
      }
      return "float-" + ((seed % 6) + 1);
    },

    // 按气泡唯一标识返回固定槽位，避免不同类型重叠或领取后移位。
    bubblePosition(index, bubbleId, bubbleType) {
      const key = bubbleId + "_" + bubbleType;
      const slot = this.bubblePositionMap[key] || index + 1;
      return "position-" + slot;
    },

    // 保留已有气泡槽位，并将新气泡放入当前空闲槽位。
    syncBubblePositions(bubbles) {
      const visibleBubbles = bubbles.slice(0, 8);
      const nextMap = {};
      const occupiedSlots = [];

      visibleBubbles.forEach((bubble) => {
        const key = this.bubbleKey(bubble);
        const slot = this.bubblePositionMap[key];
        if (slot && occupiedSlots.indexOf(slot) < 0) {
          nextMap[key] = slot;
          occupiedSlots.push(slot);
        }
      });

      visibleBubbles.forEach((bubble) => {
        const key = this.bubbleKey(bubble);
        if (nextMap[key]) return;
        for (let slot = 1; slot <= 8; slot = slot + 1) {
          if (occupiedSlots.indexOf(slot) < 0) {
            nextMap[key] = slot;
            occupiedSlots.push(slot);
            break;
          }
        }
      });

      this.bubblePositionMap = nextMap;
    },

    // 返回气泡显示的不同奖励数值。
    bubbleValue(bubble) {
      if (bubble.bubble_type == "red_envelope_count") {
        return bubble.red_envelope_count;
      }
      if (bubble.bubble_type == "red_envelope_quota") {
        return bubble.red_envelope_quota;
      }
      return bubble.energy_amount;
    },

    // 返回气泡中待领取奖励的中文名称。
    bubbleLabel(bubble) {
      if (bubble.bubble_type == "red_envelope_count") {
        return "红包机会";
      }
      if (bubble.bubble_type == "red_envelope_quota") {
        return "红包额度";
      }
      return "活力值";
    },

    // 显示统一的轻提示。
    showToast(title) {
      uni.showToast({ title: title, icon: "none" });
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  min-height: 100vh;
  overflow: hidden;
  color: #174238;
  background: #e8f0eb;
}

.arena {
  position: relative;
  height: 100vh;
  min-height: 1300rpx;
  overflow: hidden;
}

.user-name,
.user-level,
.data-label,
.data-value,
.feed-title,
.feed-text,
.feed-time,
.friends-title,
.friends-subtitle,
.friend-name,
.friend-desc {
  display: block;
}

/* 顶部用户和统计 */
.hud {
  position: absolute;
  z-index: 6;
  top: 36rpx;
  left: 36rpx;
  width: calc(100% - 172rpx);
}

.user-card {
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 10rpx 24rpx 10rpx 10rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.7);
  border-radius: 56rpx;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14rpx 36rpx rgba(35, 97, 71, 0.12);
}

.avatar-image,
.avatar-text {
  width: 68rpx;
  height: 68rpx;
  flex-shrink: 0;
  border-radius: 50%;
}

.avatar-text {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #d76557;
  font-size: 28rpx;
  font-weight: 700;
}

.user-copy {
  margin-left: 16rpx;
}

.user-name {
  font-size: 28rpx;
  font-weight: 700;
}

.user-level {
  margin-top: 4rpx;
  color: #398568;
  font-size: 20rpx;
}

.data-row {
  display: flex;
  margin-top: 24rpx;
}

.data-row > view {
  width: 33.33%;
}

.data-label {
  color: #508a71;
  font-size: 18rpx;
  white-space: nowrap;
}

.data-value {
  margin-top: 6rpx;
  color: #16876a;
  font-size: 34rpx;
  font-weight: 700;
}

.data-value.primary {
  color: #146e55;
  font-size: 40rpx;
}

.rule-button {
  position: absolute;
  top: 0;
  left: calc(100% + 24rpx);
  width: 96rpx;
  height: 96rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2rpx solid rgba(255, 255, 255, 0.72);
  border-radius: 28rpx 28rpx 28rpx 10rpx;
  color: #177457;
  background: rgba(255, 255, 255, 0.88);
  font-size: 20rpx;
  font-weight: 700;
}

/* 漂浮气泡 */
.bubble {
  position: absolute;
  z-index: 5;
  width: 116rpx;
  height: 116rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  background: radial-gradient(
    circle at 31% 23%,
    #e7ffd9 0,
    #8cda72 28%,
    #36aa6d 68%,
    #187454 100%
  );
  box-shadow:
    inset 0 0 0 4rpx rgba(255, 255, 255, 0.48),
    0 14rpx 28rpx rgba(36, 100, 69, 0.28);
  animation: drift-medium 2900ms ease-in-out infinite;
}

.bubble.float-1 {
  animation: drift-soft 2600ms -400ms ease-in-out infinite;
}

.bubble.float-2 {
  animation: drift-medium 3100ms -1500ms ease-in-out infinite;
}

.bubble.float-3 {
  animation: drift-large 2800ms -2200ms ease-in-out infinite;
}

.bubble.float-4 {
  animation: drift-soft 3500ms -900ms ease-in-out infinite;
}

.bubble.float-5 {
  animation: drift-medium 2500ms -1800ms ease-in-out infinite;
}

.bubble.float-6 {
  animation: drift-large 3300ms -200ms ease-in-out infinite;
}

.bubble.red {
  background: radial-gradient(
    circle at 31% 23%,
    #fff0ea 0,
    #ffad92 28%,
    #ec685c 68%,
    #c93f3c 100%
  );
}

.bubble.quota {
  background: radial-gradient(
    circle at 31% 23%,
    #fff8cf 0,
    #f6d25c 28%,
    #e5a836 68%,
    #b96f19 100%
  );
}

.bubble.locked {
  filter: saturate(0.35) brightness(1.2);
  opacity: 0.58;
}

.bubble.collecting {
  pointer-events: none;
  animation: bubble-collect 800ms ease-in forwards;
}

.collect-effect {
  position: absolute;
  z-index: 10;
  width: 150rpx;
  height: 150rpx;
  pointer-events: none;
  transform: translate(-16rpx, -16rpx);
  animation: collect-fade 800ms ease-out forwards;
}

.collect-effect.energy {
  animation: energy-orb-fly 800ms cubic-bezier(0.22, 0.75, 0.28, 1) forwards;
}

.collect-orb {
  position: absolute;
  top: 40rpx;
  left: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70rpx;
  height: 70rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.82);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 28%, #eaffc5 0, #77dc68 38%, #19a763 72%, #08794d 100%);
  box-shadow: 0 8rpx 20rpx rgba(16, 137, 78, 0.38);
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 900;
  text-align: center;
  text-shadow: 0 2rpx 5rpx rgba(5, 90, 48, 0.5);
}

.collect-value,
.collect-label {
  position: absolute;
  width: 100%;
  color: #ffffff;
  font-weight: 900;
  text-align: center;
  text-shadow: 0 3rpx 8rpx rgba(18, 103, 58, 0.5);
}

.collect-value {
  top: 42rpx;
  font-size: 32rpx;
}

.collect-label {
  top: 78rpx;
  font-size: 18rpx;
}

@keyframes bubble-collect {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  55% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(0.2);
  }
}

@keyframes collect-fade {
  0% {
    opacity: 1;
    transform: translate(-16rpx, -16rpx) scale(0.9);
  }
  100% {
    opacity: 0;
    transform: translate(-16rpx, -80rpx) scale(0.55);
  }
}

@keyframes energy-orb-fly {
  0% {
    opacity: 0;
    transform: translate(-16rpx, -16rpx) scale(0.3);
  }
  18% {
    opacity: 1;
    transform: translate(-16rpx, -16rpx) scale(0.72);
  }
  78% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(var(--energy-fly-x), var(--energy-fly-y)) scale(0.22);
  }
}

.bubble-value {
  font-size: 26rpx;
  font-weight: 900;
}

.bubble-label,
.bubble-source {
  margin-top: 4rpx;
  font-size: 14rpx;
}

.position-1 {
  top: 380rpx;
  left: 44rpx;
}

.position-2 {
  top: 420rpx;
  right: 48rpx;
}

.position-3 {
  top: 548rpx;
  left: 70rpx;
}

.position-4 {
  top: 564rpx;
  right: 62rpx;
}

.position-5 {
  top: 620rpx;
  right: 212rpx;
}

.position-6 {
  top: 430rpx;
  left: 44%;
}

.position-7 {
  top: 664rpx;
  left: 210rpx;
}

.position-8 {
  top: 520rpx;
  left: 190rpx;
}

.collect-effect.energy.position-1 {
  --energy-fly-x: 240rpx;
  --energy-fly-y: -250rpx;
}

.collect-effect.energy.position-2 {
  --energy-fly-x: -250rpx;
  --energy-fly-y: -290rpx;
}

.collect-effect.energy.position-3 {
  --energy-fly-x: 215rpx;
  --energy-fly-y: -420rpx;
}

.collect-effect.energy.position-4 {
  --energy-fly-x: -235rpx;
  --energy-fly-y: -435rpx;
}

.collect-effect.energy.position-5 {
  --energy-fly-x: -90rpx;
  --energy-fly-y: -490rpx;
}

.collect-effect.energy.position-6 {
  --energy-fly-x: -55rpx;
  --energy-fly-y: -300rpx;
}

.collect-effect.energy.position-7 {
  --energy-fly-x: 80rpx;
  --energy-fly-y: -535rpx;
}

.collect-effect.energy.position-8 {
  --energy-fly-x: 120rpx;
  --energy-fly-y: -390rpx;
}

/* 跑鞋展台 */
.stage {
  position: absolute;
  z-index: 3;
  top: min(760rpx, calc(100% - 570rpx));
  left: 50%;
  width: 530rpx;
  height: 440rpx;
  transform: translateX(-50%);
}

.disc {
  position: absolute;
  bottom: 2rpx;
  left: 46rpx;
  width: 440rpx;
  height: 140rpx;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    #39775c 0 12%,
    #5eaa76 13% 35%,
    #a5dc9a 36% 54%,
    #d9f1bd 55% 67%,
    transparent 68%
  );
}

.shine {
  position: absolute;
  top: 30rpx;
  left: 50%;
  width: 390rpx;
  height: 390rpx;
  transform: translateX(-50%);
  border: 2rpx solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.08) 53%,
    transparent 70%
  );
  animation: pulse 2.5s ease-in-out infinite;
}

.shoe {
  position: absolute;
  z-index: 2;
  top: 108rpx;
  left: 50%;
  width: 504rpx;
  transform: translateX(-50%);
  animation: shoe-float 2.8s ease-in-out infinite;
}

.shoe-level {
  position: absolute;
  z-index: 4;
  bottom: 18rpx;
  left: 50%;
  padding: 10rpx 22rpx;
  transform: translateX(-50%);
  border-radius: 28rpx;
  color: #6b5b15;
  background: #f2fbab;
  font-size: 20rpx;
  font-weight: 700;
  white-space: nowrap;
}

/* 底部鞋园动态栏 */
.bottom-dock {
  position: absolute;
  z-index: 6;
  left: 32rpx;
  right: 32rpx;
  bottom: calc(100rpx + env(safe-area-inset-bottom));
  height: 148rpx;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 16rpx 0 16rpx 22rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.32);
  border-radius: 20rpx;
  color: #effff4;
  background: rgba(23, 87, 62, 0.88);
  box-shadow: 0 16rpx 32rpx rgba(15, 69, 47, 0.2);
}

.feed-panel {
  flex: 1;
  min-width: 0;
  padding-right: 18rpx;
}

.feed-title {
  margin-bottom: 8rpx;
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
}

.feed-swiper {
  height: 82rpx;
}

.feed-group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.feed-item {
  display: flex;
  align-items: center;
  min-height: 38rpx;
}

.feed-empty {
  display: flex;
  align-items: center;
  height: 82rpx;
  color: #c2ddcd;
  font-size: 20rpx;
}

.feed-text {
  overflow: hidden;
  flex: 1;
  font-size: 20rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feed-time {
  margin-left: 10rpx;
  color: #c2ddcd;
  font-size: 16rpx;
  white-space: nowrap;
}

.friends-button {
  width: 220rpx;
  height: 112rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 14rpx 0 18rpx;
  border-left: 2rpx solid rgba(224, 255, 232, 0.34);
  color: #f3fff3;
}

.friends-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52rpx;
  height: 52rpx;
  margin-right: 8rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #70c986, #2d9366);
  box-shadow:
    inset 0 2rpx 4rpx rgba(255, 255, 255, 0.42),
    0 5rpx 10rpx rgba(0, 48, 30, 0.18);
}

.friends-icon::after {
  position: absolute;
  right: 4rpx;
  bottom: 5rpx;
  left: 4rpx;
  height: 10rpx;
  border-radius: 50%;
  background: rgba(203, 255, 175, 0.52);
  content: "";
}

.friends-icon-back,
.friends-icon-front {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.friends-icon-back {
  top: 11rpx;
  left: 8rpx;
  width: 26rpx;
  height: 26rpx;
  background: #4eb174;
}

.friends-icon-front {
  right: 7rpx;
  bottom: 8rpx;
  width: 32rpx;
  height: 32rpx;
  background: #23805a;
  box-shadow: 0 2rpx 4rpx rgba(0, 65, 38, 0.22);
}

.friends-spark {
  position: absolute;
  top: 5rpx;
  right: 6rpx;
  z-index: 3;
  width: 7rpx;
  height: 7rpx;
  border-radius: 50%;
  background: #efffc1;
  box-shadow: 0 0 8rpx rgba(240, 255, 193, 0.9);
}

.friends-title {
  font-size: 24rpx;
  font-weight: 700;
}

.friends-subtitle {
  margin-top: 4rpx;
  color: #b7e2c0;
  font-size: 18rpx;
}

.back-button {
  justify-content: center;
  text-align: center;
}

/* 好友鞋园底部弹层 */
.mask {
  position: fixed;
  z-index: 20;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  background: rgba(16, 45, 34, 0.28);
}

.sheet {
  width: 100%;
  box-sizing: border-box;
  padding: 26rpx 32rpx calc(40rpx + env(safe-area-inset-bottom));
  border-radius: 40rpx 40rpx 0 0;
  background: #fff;
}

.handle {
  width: 68rpx;
  height: 8rpx;
  margin: 0 auto 30rpx;
  border-radius: 8rpx;
  background: #dbe7e0;
}

.sheet-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.sheet-title {
  font-size: 34rpx;
  font-weight: 700;
}

.sheet-desc {
  color: #6c8c83;
  font-size: 20rpx;
}

.friend-list {
  max-height: 55vh;
  margin-top: 24rpx;
}

.friend-row {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #e4efe8;
}

.friend-avatar {
  width: 76rpx;
  height: 76rpx;
  flex-shrink: 0;
  border-radius: 50%;
}

.friend-avatar.fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #df795f;
  font-size: 26rpx;
  font-weight: 700;
}

.friend-copy {
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
}

.friend-name {
  font-size: 26rpx;
  font-weight: 700;
}

.friend-desc {
  margin-top: 8rpx;
  overflow: hidden;
  color: #6c8c83;
  font-size: 20rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.go-text {
  margin-left: 20rpx;
  padding: 14rpx 18rpx;
  border-radius: 8rpx;
  color: #237b5e;
  background: #e9f8ef;
  font-size: 22rpx;
  font-weight: 700;
}

.friend-empty {
  padding: 70rpx 0;
  color: #8aa096;
  font-size: 24rpx;
  text-align: center;
}

@keyframes drift-soft {
  50% {
    transform: translateY(-12rpx);
  }
}

@keyframes drift-medium {
  50% {
    transform: translateY(-19rpx);
  }
}

@keyframes drift-large {
  50% {
    transform: translateY(-26rpx);
  }
}

@keyframes shoe-float {
  50% {
    transform: translate(-50%, -24rpx);
  }
}

@keyframes pulse {
  50% {
    opacity: 0.65;
    transform: translateX(-50%) scale(1.08);
  }
}

@media screen and (max-height: 1400rpx) {
  .bubble {
    width: 104rpx;
    height: 104rpx;
  }

  .stage {
    top: 720rpx;
    transform: translateX(-50%) scale(0.9);
    transform-origin: top center;
  }

  .position-1,
  .position-2 {
    top: 350rpx;
  }

  .position-3,
  .position-4 {
    top: 500rpx;
  }
}
</style>
