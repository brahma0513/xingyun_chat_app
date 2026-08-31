<template>
  <view class="play-box">
    <!-- APP：点赞/评论等用 video 内 cover-view；弹窗打开时用 suppress 卸原生 video，避免挡 u-popup -->
    <new-video
      ref="newVideoPlayer"
      :video-list="videoList"
      :initial-index="initialEpisodeIndex"
      :auto-advance="isAutoChange"
      :max-playable-ratio="currentMaxPlayableRatio"
      :play-locked="isCurrentEpisodeLocked"
      :resume-time="resumeTime"
      :suppress-native-for-web-overlay="suppressNativeForWebOverlay"
      controls-bottom="calc(24rpx - 5px)"
      @change="handleVideoChange"
      @trial-limit-reached="handleTrialLimitReached"
      @progress-change="handleProgressChange"
    >
      <!-- APP：必须拆到 app-native-*，与 nv-app-native-root 分区一致；勿把所有 cover-view 堆在 overlay，否则绝对定位易错位（点赞跑中间等） -->
      <!-- #ifdef APP-PLUS -->
      <template #app-native-center>
        <cover-view
          v-if="showUnlockEpisodeCta"
          class="pvs-cover-buy"
          @tap.stop="toggleBuyPop"
        >
          <cover-view class="pvs-cover-buy-text">解锁当前剧集</cover-view>
        </cover-view>
      </template>
      <template #app-native-right>
        <cover-view class="pvs-cover-right">
          <cover-view class="pvs-cover-right-item" @tap.stop="toggleLike">
            <cover-image
              v-if="isLike"
              :src="
                http_host + '/micro_theatre_two/web/static/images/p-like-on.png'
              "
              class="pvs-cover-icon"
            ></cover-image>
            <cover-image
              v-else
              :src="
                http_host + '/micro_theatre_two/web/static/images/p-like.png'
              "
              class="pvs-cover-icon"
            ></cover-image>
            <cover-view class="pvs-cover-num">{{ likeDisplay }}</cover-view>
          </cover-view>
          <cover-view class="pvs-cover-right-item" @tap.stop="toggleComment">
            <cover-image
              :src="
                http_host + '/micro_theatre_two/web/static/images/p-chat.png'
              "
              class="pvs-cover-icon"
            ></cover-image>
            <cover-view class="pvs-cover-num">{{ commentTotal }}</cover-view>
          </cover-view>
        </cover-view>
      </template>
      <template #app-native-bottom>
        <cover-view class="pvs-cover-bottom">
          <cover-view class="pvs-cover-movie" @tap.stop="goDramaDetail">
            <cover-image
              :src="
                (dramaInfo && dramaInfo.cover_image) ||
                http_host + '/micro_theatre_two/web/static/images/movie.png'
              "
              class="pvs-cover-movie-img"
            ></cover-image>
            <cover-view class="pvs-cover-movie-name">{{
              (dramaInfo && dramaInfo.name) || "短剧"
            }}</cover-view>
            <cover-view class="pvs-cover-movie-arrow">›</cover-view>
          </cover-view>
          <cover-view class="pvs-cover-black" @tap.stop="toggleSort">
            <cover-view class="pvs-cover-info-row">
              <cover-view class="pvs-cover-info-main">
                选集·全{{
                  (dramaInfo && dramaInfo.total_episodes) ||
                  (episodeList || []).length
                }}集·第{{ currentEpisodeIndex + 1 }}集
              </cover-view>
              <cover-view class="pvs-cover-info-arrow-up">∧</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>
      </template>
      <!-- #endif -->
      <!-- #ifndef APP-PLUS -->
      <template #overlay>
        <cover-view
          v-if="showUnlockEpisodeCta"
          class="pvs-cover-buy"
          @tap.stop="toggleBuyPop"
        >
          <cover-view class="pvs-cover-buy-text">解锁当前剧集</cover-view>
        </cover-view>
        <cover-view class="pvs-cover-right">
          <cover-view class="pvs-cover-right-item" @tap.stop="toggleLike">
            <cover-image
              v-if="isLike"
              :src="
                http_host + '/micro_theatre_two/web/static/images/p-like-on.png'
              "
              class="pvs-cover-icon"
            ></cover-image>
            <cover-image
              v-else
              :src="
                http_host + '/micro_theatre_two/web/static/images/p-like.png'
              "
              class="pvs-cover-icon"
            ></cover-image>
            <cover-view class="pvs-cover-num">{{ likeDisplay }}</cover-view>
          </cover-view>
          <cover-view class="pvs-cover-right-item" @tap.stop="toggleComment">
            <cover-image
              :src="
                http_host + '/micro_theatre_two/web/static/images/p-chat.png'
              "
              class="pvs-cover-icon"
            ></cover-image>
            <cover-view class="pvs-cover-num">{{ commentTotal }}</cover-view>
          </cover-view>
        </cover-view>
        <cover-view class="pvs-cover-bottom">
          <cover-view class="pvs-cover-movie" @tap.stop="goDramaDetail">
            <cover-image
              :src="
                (dramaInfo && dramaInfo.cover_image) ||
                http_host + '/micro_theatre_two/web/static/images/movie.png'
              "
              class="pvs-cover-movie-img"
            ></cover-image>
            <cover-view class="pvs-cover-movie-name">{{
              (dramaInfo && dramaInfo.name) || "短剧"
            }}</cover-view>
            <cover-view class="pvs-cover-movie-arrow">›</cover-view>
          </cover-view>
          <cover-view class="pvs-cover-black" @tap.stop="toggleSort">
            <cover-view class="pvs-cover-info-row">
              <cover-view class="pvs-cover-info-main">
                选集·全{{
                  (dramaInfo && dramaInfo.total_episodes) ||
                  (episodeList || []).length
                }}集·第{{ currentEpisodeIndex + 1 }}集
              </cover-view>
              <cover-view class="pvs-cover-info-arrow-up">∧</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>
      </template>
      <!-- #endif -->
    </new-video>

    <!-- #ifdef APP-PLUS -->
    <block v-if="tempDisableNativeVideo">
      <view v-if="showUnlockEpisodeCta" class="buy-tips" @click="toggleBuyPop">
        解锁当前剧集
      </view>
      <view class="right-box">
        <view class="item" @click="toggleLike">
          <image
            :src="
              http_host + '/micro_theatre_two/web/static/images/p-like-on.png'
            "
            class="icon"
            v-if="isLike"
          ></image>
          <image
            v-else
            :src="http_host + '/micro_theatre_two/web/static/images/p-like.png'"
            class="icon"
          ></image>
          <view class="num">{{ likeDisplay }}</view>
        </view>
        <view class="item" @click="toggleComment">
          <image
            :src="http_host + '/micro_theatre_two/web/static/images/p-chat.png'"
            class="icon"
          ></image>
          <view class="num">{{ commentTotal }}</view>
        </view>
      </view>
      <view class="bottom-box">
        <view class="movie flex a-c" @click="goDramaDetail">
          <image
            :src="
              (dramaInfo && dramaInfo.cover_image) ||
              http_host + '/micro_theatre_two/web/static/images/movie.png'
            "
            class="movie-cover"
          ></image>
          <view class="name">{{
            (dramaInfo && dramaInfo.name) || "短剧"
          }}</view>
          <u-icon
            name="arrow-right"
            color="#ffffff"
            size="16"
            class="arrow-right"
          ></u-icon>
        </view>
        <view class="black-box">
          <view class="info flex a-c j-b" @click="toggleSort">
            <view>
              选集·全{{
                (dramaInfo && dramaInfo.total_episodes) ||
                (episodeList || []).length
              }}集·第{{ currentEpisodeIndex + 1 }}集
            </view>
            <u-icon
              name="arrow-up"
              color="#ffffff"
              size="12"
              class="arrow-icon"
            ></u-icon>
          </view>
        </view>
      </view>
    </block>
    <!-- #endif -->

    <!-- 联调：模拟激励视频 @close 的 e.detail.isEnded -->
    <view
      v-if="rewardedDebugVisible && showUnlockEpisodeCta"
      class="pvs-rewarded-mock-col"
      @click.stop
    >
      <view
        class="pvs-rewarded-mock-btn"
        @click.stop="simulateRewardedCloseEndedTrue"
      >
        模拟看完(isEnded)
      </view>
      <view
        class="pvs-rewarded-mock-btn pvs-rewarded-mock-btn--muted"
        @click.stop="simulateRewardedCloseEndedFalse"
      >
        模拟中途关
      </view>
    </view>

    <!-- 评论弹窗 -->
    <u-popup
      :show="showComment"
      mode="bottom"
      :round="20"
      :z-index="12000"
      @close="onCommentPopupClose"
    >
      <view class="pop-box">
        <view class="title-box" @click="toggleComment">
          {{ commentTotal }}条评论
          <view class="arrow-box">
            <u-icon
              name="arrow-up"
              color="#221F18"
              size="14"
              class="arrow-icon"
            ></u-icon>
          </view>
        </view>
        <view class="comment-box">
          <review ref="reviewList" :drama-id="dramaId"></review>
        </view>
        <view class="send-box flex a-c">
          <textarea
            v-model.trim="commentDraft"
            placeholder="我也评论一番!!"
            class="textarea flex-1"
            :auto-height="true"
            maxlength="500"
            confirm-type="send"
            @confirm="submitComment"
          ></textarea>
          <view class="send-btn" @click="submitComment">发送</view>
        </view>
      </view>
    </u-popup>

    <!-- 选集弹窗（提高 z-index，减轻 App 原生 video 与 webview 叠层时弹窗被挡） -->
    <u-popup
      :show="showSort"
      mode="bottom"
      :round="20"
      :z-index="12000"
      @close="toggleSort"
    >
      <view class="pop-box">
        <view class="title-box">
          <view class="sort-header flex a-c j-b">
            <view class="sort-header-main flex a-c" @click="goDramaDetail">
              <image
                :src="sortHeaderInfo.cover"
                class="sort-header-cover"
                mode="aspectFill"
              ></image>
              <view class="sort-header-text">
                <view class="sort-title">{{ sortHeaderInfo.title }}</view>
                <view class="sort-subtitle">{{ sortHeaderInfo.subtitle }}</view>
              </view>
            </view>
            <view class="sort-header-arrow flex a-c j-c">
              <u-icon
                name="arrow-right"
                color="#221F18"
                size="14"
                class="arrow-icon"
              ></u-icon>
            </view>
          </view>
        </view>
        <view class="sort-box flex">
          <!-- 分段分页：1-20 / 21-40 / ... -->
          <view class="segment-row" v-if="(episodeSegments || []).length > 1">
            <view
              class="segment-item"
              v-for="(seg, idx) in episodeSegments"
              :key="seg.label"
              :class="{ active: idx === currentSegmentIndex }"
              @click="changeSegment(idx)"
            >
              {{ seg.label }}
            </view>
          </view>
          <view
            class="num"
            v-for="(item, index) in visibleEpisodes"
            :key="item.id || index"
            :class="{
              active:
                Number(item.episode_order || index + 1) - 1 ===
                currentEpisodeIndex,
            }"
            @click="
              handleEpisodeClick(
                item.episode_order ? Number(item.episode_order) - 1 : index,
              )
            "
          >
            {{ item.episode_order || index + 1 }}
            <image
              v-if="episodeItemShowsLockIcon(item, index)"
              :src="
                http_host + '/micro_theatre_two/web/static/images/lock2.png'
              "
              class="vip-tag"
            ></image>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 购买弹窗：遮罩 @close 与 buyMovie 内关闭都必须只关不开（勿用 toggle，否则广告解锁后会再被打开） -->
    <u-popup
      :show="showBuyPop"
      :round="32"
      :z-index="12000"
      @close="closeBuyPop"
    >
      <buyMovie
        :drama-id="dramaId"
        :drama-info="dramaInfo"
        :episode-list="episodeList"
        :free-episode-count="freeEpisodeCount"
        :pay-ways="payWays"
        :pay-return-path="buyMoviePayReturnPath"
        :unlock-countdown-small="true"
        :auto-unlock-seconds="autoUnlockSeconds"
        :current-episode="buyNum || currentEpisodeIndex + 1"
        :current-time="currentTime"
        :force-single-episode="!!buyNum"
        :start-with-pay-way="true"
        :auto-ad-navigate-seconds="15"
        @close="closeBuyPop"
        @purchase-success="handlePurchaseSuccess"
        @submit="handleBuySubmit"
      ></buyMovie>
    </u-popup>
  </view>
</template>

<script>
import url from "@/utils/request.js";
import store from "@/store";
import empty from "@/micro_theatre_two/components/empty/empty.vue";
import review from "@/micro_theatre_two/components/review/review.vue";
import buyMovie from "@/micro_theatre_two/components/buyMovie/buyMovie.vue";
import newVideo from "@/micro_theatre_two/components/watch_video/new_video.vue";
import * as globalData from "@/utils/config";
import { consumePlayVideoSimplePayResume } from "@/micro_theatre_two/utils/pay_return_resume.js";

function getMtUserId() {
  const u = store.state.vuex_user;
  return (u && u.user_id) || 0;
}

// 兼容本页原有 request({ url, method, data }) 调用风格
function request(config = {}) {
  const reqUrl = config.url || "";
  const reqMethod = (config.method || "POST").toUpperCase();
  const reqData = config.data || {};
  return url.request(reqUrl, reqData, reqMethod);
}

/** 临时：为 true 时始终不渲染原生 video（仅调 UI）；发布前改为 false */
const TEMP_DISABLE_NATIVE_VIDEO = false;

export default {
  components: {
    empty,
    buyMovie,
    newVideo,
    review,
  },
  data() {
    const apiBase = (() => {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      return String(u).replace(/\/+$/, "");
    })();
    return {
      tempDisableNativeVideo: TEMP_DISABLE_NATIVE_VIDEO,
      customer_id: this.vuex_customer_id || globalData.customer_id || 0,
      http_host: apiBase,
      dramaId: "",
      // 如果通过链接参数 buy_num 指定了要购买的集数（从 1 开始），则直接走该集的购买流程
      buyNum: null,
      // 弹窗 & 状态
      showComment: false,
      showSort: false,
      isAutoChange: true,
      isLike: false,
      showBuyPop: false,
      /** 打开购买弹窗时写入，供 pay-return-path 使用，避免回跳时 num 与真实集序不一致 */
      payReturnEpisodeOrderForBridge: null,
      trialExhaustedEpisodes: {},
      sortHeaderInfo: {
        cover: apiBase + "/micro_theatre_two/web/static/images/movie.png",
        title: "短剧标题",
        subtitle: "短剧简介",
      },
      initialEpisodeIndex: 0,
      currentEpisodeIndex: 0,
      // 通过观看广告临时解锁的剧集（仅在本次停留期间生效）
      adUnlockedEpisodes: {},
      // 当广告解锁事件比剧集列表更早到达时，先暂存待解锁的集数
      pendingAdUnlockEpisode: null,
      // 当前播放进度（秒），用于点击“观看广告解锁”时回传给广告页
      currentTime: 0,
      // 广告解锁返回后，用于恢复当前集播放进度
      resumeTime: 0,
      // 如果广告解锁时视频列表还没加载完成，先暂存“待恢复的时间点”
      pendingAdUnlockResumeTime: 0,
      dramaInfo: {
        id: null,
        name: "",
        cover_image: "",
        freeTimeProportion: "10%",
        favorite_count: 0,
      },
      // 完整剧集列表（带 episode_order / video_url 等字段），供选集弹窗和购买弹窗使用
      episodeList: [],
      videoList: [],
      commentTotal: 0,
      commentDraft: "",
      // 支付方式与自动解锁秒数（后续可通过接口动态下发）
      payWays: [],
      autoUnlockSeconds: 3,
      // 选集弹窗分段分页索引（1-20 / 21-40 / ...）
      currentSegmentIndex: 0,
      // 从其它页面跳转进来时：是否需要自动打开选集弹窗并定位到对应集数
      pendingOpenSortEpisode: null,
      popupPageSize: 20,
      // episode_list 接口返回的 count（全集条数），用于选集分段标签；未返回前为 0
      episodeTotalCount: 0,
      // 当前弹窗展示的剧集（当前分段页）
      popupEpisodeList: [],
      // 已加载的页缓存：{ [page:number]: episode[] }
      episodePageCache: {},
      // 购买状态：整剧/已购单集（按 episode_order）
      isWholeDramaPurchased: false,
      purchasedEpisodes: {},
      // VIP 状态：用于“会员免费观看”放行
      vipStatus: 0,
      vipLevelId: 0,
      vipLevelName: "",
      // 防止同一集反复上报观看记录
      lastWatchLogKey: "",
      // —— 激励：有 adpid + SDK 则走真实 onClose(isEnded)；勿再默认写死成功（仅 ad_mock 等可模拟）——
      adUnlockInFlight: false,
      adUnlockMockEnabled: false,
      adUnlockPreferAdvertPage: false,
      adUnlockRandomModeRoute: false,
      adUnlockRewardedWeightRoute: null,
      rewardedSimulateMode: "",
      /** index_data.get_ad_setting → data.ad_setting（对象；兼容旧版 JSON 字符串） */
      adSetting: {},
      /** 与 task.vue 一致：缓存激励实例、onLoad 标记 */
      _rewardedVideoAdUnlock: null,
      _isRewardedUnlockLoaded: false,
    };
  },
  computed: {
    /** APP：弹窗打开或临时调试时隐藏原生 video，交给 new_video 的 suppress */
    suppressNativeForWebOverlay() {
      if (TEMP_DISABLE_NATIVE_VIDEO) {
        return true;
      }
      return !!(this.showComment || this.showSort || this.showBuyPop);
    },
    likeDisplay() {
      const info = this.dramaInfo || {};
      const num = Number(
        info.like_count != null ? info.like_count : info.favorite_count,
      );
      if (!Number.isFinite(num)) return 0;
      if (num >= 10000) {
        return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
      }
      return num;
    },
    /** 已取消「前 N 集免费」，固定为 0（仅已购/广告解锁等可完整观看） */
    freeEpisodeCount() {
      return 0;
    },
    /** 支付完成回跳当前播放页（与 onLoad 约定 id + num 一致） */
    buyMoviePayReturnPath() {
      const id = String(
        this.dramaId || (this.dramaInfo && this.dramaInfo.id) || "",
      ).trim();
      if (!id) return "";
      const bridge = this.payReturnEpisodeOrderForBridge;
      const epNum =
        bridge != null && Number(bridge) > 0
          ? Math.floor(Number(bridge))
          : this.resolveEpisodeOrderForPayUrl();
      return (
        "/micro_theatre_two/pages/play_video_simple/play_video_simple?id=" +
        encodeURIComponent(id) +
        "&num=" +
        encodeURIComponent(String(epNum))
      );
    },
    trialRatio() {
      return this.parseTrialRatio(
        this.dramaInfo && this.dramaInfo.freeTimeProportion,
      );
    },
    /** fee_type：1 免费整集；2 收费（与后台剧集编辑一致）。兼容 is_charged：2=免费，1=收费 */
    isCurrentEpisodeFree() {
      const ep = this.episodeList && this.episodeList[this.currentEpisodeIndex];
      if (!ep || typeof ep !== "object") return false;
      const ft = Number(ep.fee_type);
      if (ft === 1) return true;
      if (ft === 2) return false;
      const ic = Number(ep.is_charged);
      if (ic === 2) return true;
      if (ic === 1) return false;
      return false;
    },
    isCurrentEpisodeLocked() {
      const idx = this.currentEpisodeIndex;
      console.log(
        "[play_video_simple] isCurrentEpisodeLocked check: idx=",
        idx,
        "vipCanWatchThisDrama=",
        this.vipCanWatchThisDrama,
        "adUnlocked=",
        this.adUnlockedEpisodes[idx],
        "isFree=",
        this.isCurrentEpisodeFree,
        "isWholeDramaPurchased=",
        this.isWholeDramaPurchased,
        "isEpisodePurchased=",
        this.isEpisodePurchased(idx + 1),
        "trialRatio=",
        this.trialRatio,
        "trialExhausted=",
        this.trialExhaustedEpisodes[idx],
      );
      // VIP 可免费观看：直接放行
      if (this.vipCanWatchThisDrama) return false;
      // 已通过广告解锁的剧集，本次停留内视为已解锁
      if (this.adUnlockedEpisodes[idx]) return false;
      if (this.isCurrentEpisodeFree) return false;
      if (this.isWholeDramaPurchased) return false;
      if (this.isEpisodePurchased(idx + 1)) return false;
      if (this.trialRatio <= 0) return true;
      return !!this.trialExhaustedEpisodes[idx];
    },
    /**
     * 本集需付费/会员/广告才能看整集时展示「解锁」入口。
     * 有试看比例时仅在试看耗尽后展示（与 handleTrialLimitReached 写入的 trialExhaustedEpisodes 一致）；
     * 无试看（trialRatio<=0）时与 isCurrentEpisodeLocked 一致，始终可点解锁。
     */
    showUnlockEpisodeCta() {
      const idx = this.currentEpisodeIndex;
      if (this.vipCanWatchThisDrama) return false;
      if (this.adUnlockedEpisodes[idx]) return false;
      if (this.isCurrentEpisodeFree) return false;
      if (this.isWholeDramaPurchased) return false;
      if (this.isEpisodePurchased(idx + 1)) return false;
      if (this.trialRatio > 0 && !this.trialExhaustedEpisodes[idx])
        return false;
      return true;
    },
    currentMaxPlayableRatio() {
      if (this.isCurrentEpisodeFree) return null;
      if (this.vipCanWatchThisDrama) return null;
      if (this.adUnlockedEpisodes[this.currentEpisodeIndex]) return null;
      if (this.isWholeDramaPurchased) return null;
      if (this.isEpisodePurchased(this.currentEpisodeIndex + 1)) return null;
      const r = Number(this.trialRatio);
      if (!Number.isFinite(r) || r <= 0) return null;
      return this.trialRatio;
    },
    vipCanWatchThisDrama() {
      // dramaInfo.vip_free: 0/1
      const vipFree = Number(this.dramaInfo && this.dramaInfo.vip_free);
      if (vipFree !== 1) return false;
      if (Number(this.vipStatus) !== 1) return false;
      const vipLevelId = Number(this.vipLevelId);
      if (!vipLevelId) return false;

      const raw = String(
        this.dramaInfo && this.dramaInfo.vip_free_levels
          ? this.dramaInfo.vip_free_levels
          : "",
      );
      if (!raw) return false;

      // 允许逗号/分号/空格分隔
      const parts = raw
        .split(/[,;\\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (!parts.length) return false;

      // 先按数字 id 匹配
      for (let i = 0; i < parts.length; i++) {
        const n = Number(parts[i]);
        if (Number.isFinite(n) && n === vipLevelId) return true;
      }

      // 兼容：如果后台存的是名称（如“白金”），做字符串包含匹配
      if (this.vipLevelName) {
        const vipName = String(this.vipLevelName);
        for (let i = 0; i < parts.length; i++) {
          if (vipName && vipName.includes(parts[i])) return true;
        }
      }
      return false;
    },
    rewardedDebugVisible() {
      return (
        this.adUnlockMockEnabled ||
        this.rewardedSimulateMode === "full" ||
        this.rewardedSimulateMode === "partial"
      );
    },
    adUnlockRandomEffective() {
      if (this.adUnlockRandomModeRoute) return true;
      const d = this.dramaInfo || {};
      const m = String(
        d.unlock_mode || d.ad_unlock_mode || d.unlock_ad_mode || "",
      ).toLowerCase();
      return m === "random";
    },
    adUnlockRewardedProbability() {
      if (
        this.adUnlockRewardedWeightRoute != null &&
        Number.isFinite(this.adUnlockRewardedWeightRoute)
      ) {
        return Math.min(1, Math.max(0, this.adUnlockRewardedWeightRoute));
      }
      const d = this.dramaInfo || {};
      const raw =
        d.unlock_rewarded_weight != null
          ? d.unlock_rewarded_weight
          : d.ad_unlock_rewarded_weight;
      if (raw == null || raw === "") return 0.5;
      let v = Number(raw);
      if (!Number.isFinite(v)) return 0.5;
      if (v > 1) v = v / 100;
      return Math.min(1, Math.max(0, v));
    },
    /** 后台 get_ad_setting：开启且配置了 ad_types 时，由服务端类型 + 可播判定驱动解锁方式 */
    useRemoteAdSettingUnlock() {
      const s = this.adSetting || {};
      if (Number(s.ad_enable) !== 1) return false;
      return this.normalizeAdTypesFromSetting(s).length > 0;
    },
    /** 当前配置里声明的广告类型（未过滤可播性），如 local、tencent_vod */
    remoteAdTypesDeclared() {
      const s = this.adSetting || {};
      if (Number(s.ad_enable) !== 1) return [];
      return this.normalizeAdTypesFromSetting(s)
        .map((t) => String(t || "").trim())
        .filter((t) => t === "local" || t === "tencent_vod");
    },
    /** 远程 ad_types 未包含 local 时，禁止 navigateTo advert（避免后台关本地仍跳本地广告页） */
    localAdUnlockAllowed() {
      if (!this.useRemoteAdSettingUnlock) return true;
      return this.remoteAdTypesDeclared.includes("local");
    },
    /** 选集标题「全X集」：已加载列表时以最大集序为准，避免计划总集数与已上架不一致 */
    releasedEpisodeCount() {
      const list = this.episodeList || [];
      if (list.length) {
        const max = list.reduce((m, e) => {
          const n = Number(e.episode_order);
          return Number.isFinite(n) && n > 0 ? Math.max(m, Math.floor(n)) : m;
        }, 0);
        if (max > 0) return max;
        return list.length;
      }
      return (
        Number(
          (this.dramaInfo && this.dramaInfo.total_episodes) ||
            (this.dramaInfo && this.dramaInfo.episodes_count),
        ) || 0
      );
    },
    // 将剧集按 20 集一组切段。标签范围以接口 count 为准（未只加载第 1 页时也能显示 1-20/21-40/41-55）；
    // 已加载条目的最大集序作兜底，避免 count 未写入时无分段。
    episodeSegments() {
      const list = this.episodeList || [];
      const maxInList = list.reduce((m, e) => {
        const n = Number(e.episode_order);
        return Number.isFinite(n) && n > 0 ? Math.max(m, Math.floor(n)) : m;
      }, 0);
      const apiTotal = Number(this.episodeTotalCount) || 0;
      const dramaTotal =
        Number(this.dramaInfo && this.dramaInfo.total_episodes) ||
        Number(this.dramaInfo && this.dramaInfo.episodes_count) ||
        0;
      const total = apiTotal || dramaTotal || maxInList;
      if (!total) return [];
      const size = 20;
      const segments = [];
      for (let start = 1; start <= total; start += size) {
        const end = Math.min(start + size - 1, total);
        segments.push({
          start,
          end,
          label: `${start}-${end}`,
        });
      }
      return segments;
    },
    // 当前分段下要展示的剧集：按 episodeSegments 的集序区间从 episodeList 过滤。
    // 禁止在「某一页接口无数据」时回退到全量列表，否则会出现选中 41-50 却仍显示 1、2 的错位。
    visibleEpisodes() {
      const list = this.episodeList || [];
      const segs = Array.isArray(this.episodeSegments)
        ? this.episodeSegments
        : [];
      if (segs.length > 0) {
        const rawIdx = Number(this.currentSegmentIndex) || 0;
        const idx = Math.min(Math.max(0, rawIdx), segs.length - 1);
        const seg = segs[idx];
        const start = Number(seg.start) || 0;
        const end = Number(seg.end) || 0;
        return list.filter((ep) => {
          const n = Number(ep.episode_order) || 0;
          return n >= start && n <= end;
        });
      }
      if (this.popupEpisodeList && this.popupEpisodeList.length > 0) {
        return this.popupEpisodeList;
      }
      return list;
    },
  },
  watch: {
    episodeList() {
      const segs = this.episodeSegments;
      if (
        Array.isArray(segs) &&
        segs.length > 0 &&
        this.currentSegmentIndex >= segs.length
      ) {
        this.currentSegmentIndex = 0;
      }
    },
    showBuyPop(val) {
      if (!val) this.payReturnEpisodeOrderForBridge = null;
    },
  },
  onLoad(res) {
    this.syncMicroTheatreHttpHost();
    this.getAdSetting();
    // 兼容 uni-simple-router：优先从 this.$Route.query 取路由参数
    const query = (this.$Route && this.$Route.query) || res || {};

    // 支持 /pages/play_video_simple/play_video_simple?id=xxx&num=3&buy_num=1
    this.dramaId = query.drama_id || query.dramaId || query.id || "";

    let rawEpNum = Number(query.num);
    if (!Number.isFinite(rawEpNum) || rawEpNum <= 0) {
      const fromPay = consumePlayVideoSimplePayResume(this.dramaId);
      if (fromPay) rawEpNum = fromPay;
    }
    const epNum =
      Number.isFinite(rawEpNum) && rawEpNum > 0 ? Math.floor(rawEpNum) : 1;
    const nextIndex = Math.max(0, Math.floor(epNum - 1));
    this.initialEpisodeIndex = nextIndex;
    this.currentEpisodeIndex = nextIndex;

    // 是否要求自动打开选集弹窗
    if (String(query.open_sort || query.openSort || "") === "1") {
      this.pendingOpenSortEpisode = Math.max(1, Math.floor(epNum));
    } else {
      this.pendingOpenSortEpisode = null;
    }

    // 解析 buy_num，表示“直接购买第几集”（1 开始）
    if (typeof query.buy_num !== "undefined") {
      const bn = Number(query.buy_num);
      this.buyNum = Number.isFinite(bn) && bn > 0 ? Math.floor(bn) : null;
    } else {
      this.buyNum = null;
    }

    this.adUnlockMockEnabled =
      String(query.ad_mock || query.mock_ad || "") === "1" ||
      String(query.ad_mock || query.mock_ad || "").toLowerCase() === "true";
    this.adUnlockPreferAdvertPage =
      String(query.unlock_via || "").toLowerCase() === "advert" ||
      String(query.unlock_via || "").toLowerCase() === "local";
    const um = String(query.unlock_mode || "").toLowerCase();
    this.adUnlockRandomModeRoute =
      um === "random" ||
      String(query.ad_random || "") === "1" ||
      String(query.ad_random || "").toLowerCase() === "true";
    const rwq = Number(query.rewarded_weight);
    this.adUnlockRewardedWeightRoute =
      Number.isFinite(rwq) && rwq >= 0 && rwq <= 1 ? rwq : null;
    const rs = String(query.rewarded_simulate || "").toLowerCase();
    if (["full", "1", "true", "ended"].includes(rs)) {
      this.rewardedSimulateMode = "full";
    } else if (["partial", "skip", "0", "false"].includes(rs)) {
      this.rewardedSimulateMode = "partial";
    } else {
      this.rewardedSimulateMode = "";
    }

    console.log(
      "[play_video_simple] query:",
      JSON.stringify(query),
      "buyNum:",
      this.buyNum,
    );

    if (this.dramaId) {
      this.fetchDramaDetail();
      this.fetchEpisodeList();
      this.fetchPurchaseStatus();
      this.fetchUserVipInfo();
      this.fetchCommentTotal();
    }
    // 监听广告解锁事件（仅在本次停留内有效）
    uni.$on("ad_unlock_success", this.handleAdUnlockFromAdvert);
  },
  onShow() {
    this.syncMicroTheatreHttpHost();
    // H5 返回时，如果页面被重新创建，优先从全局读取最近一次广告解锁记录
    try {
      const app = getApp && getApp();
      const info = app && app.globalData && app.globalData.last_ad_unlock;
      if (
        info &&
        info.dramaId &&
        String(info.dramaId) === String(this.dramaId)
      ) {
        this.handleAdUnlockFromAdvert(info);
      }
    } catch (e) {}
  },
  onUnload() {
    // 离开页面时移除事件监听，adUnlockedEpisodes 也随组件销毁一并清空
    uni.$off("ad_unlock_success", this.handleAdUnlockFromAdvert);
  },
  methods: {
    getAdSetting() {
      this._adSettingLoadPromise = request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=get_ad_setting&xdebug=xdebug",
        method: "POST",
        data: {},
      })
        .then((res) => {
          if (!(res && res.errcode === 0 && res.data)) return;
          let cfg = res.data.ad_setting;
          if (typeof cfg === "string") {
            try {
              cfg = JSON.parse(cfg);
            } catch (e) {
              cfg = {};
            }
          }
          this.adSetting = cfg && typeof cfg === "object" ? cfg : {};
        })
        .catch(() => {});
      return this._adSettingLoadPromise;
    },
    /** 试看触发前等待配置，避免 adSetting 仍为空时误判不走远程随机逻辑 */
    ensureAdSettingLoaded() {
      if (!this._adSettingLoadPromise) {
        return this.getAdSetting();
      }
      return this._adSettingLoadPromise;
    },
    /**
     * ad_types 规范为数组。兼容：JSON 字符串、英文/中文逗号分隔；无 ad_types 时可用 ad_type 单值（如 tencent_vod）。
     * 注意：若后台将激励广告位 id 存在 tencent_app_id，getRewardedVideoAdpid 会读取该字段。
     */
    normalizeAdTypesFromSetting(s) {
      if (!s || typeof s !== "object") return [];
      const src = s.ad_types != null ? s.ad_types : [];
      let list = [];
      if (typeof src === "string") {
        const t = src.trim();
        if (!t) list = [];
        else {
          try {
            const p = JSON.parse(t);
            list = Array.isArray(p) ? p.slice() : [];
          } catch (e) {
            list = t
              .split(/[,，]/)
              .map((x) => String(x).trim())
              .filter(Boolean);
          }
        }
      } else {
        list = Array.isArray(src) ? src.slice() : [];
      }
      const legacy = String(s.ad_type || "")
        .trim()
        .toLowerCase();
      if (legacy === "tencent_vod" || legacy === "local") {
        const hit = list.some(
          (x) =>
            String(x || "")
              .trim()
              .toLowerCase() === legacy,
        );
        if (!hit) list.push(legacy);
      }
      return list;
    },

    syncMicroTheatreHttpHost() {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      this.http_host = String(u).replace(/\/+$/, "");
    },
    getEpisodeVideoUrl(ep) {
      if (!ep || typeof ep !== "object") return "";
      const direct = ep.video_url || ep.videoUrl || ep.url || ep.video || "";
      if (direct && typeof direct === "string") {
        const s = direct.trim();
        if (!s) return "";
        if (/^https?:\/\//i.test(s)) return s;
        const host = String(this.http_host || "").replace(/\/$/, "");
        if (!host) return s;
        if (s.startsWith("/")) return host + s;
        return host + "/resources/" + s;
      }

      const filePath = ep.file_path || ep.filePath || ep.path || "";
      if (filePath && typeof filePath === "string") {
        const fp = filePath.trim();
        if (!fp) return "";
        if (/^https?:\/\//i.test(fp)) return fp;
        const host = String(this.http_host || "").replace(/\/$/, "");
        if (!host) return fp;
        if (fp.startsWith("/")) return host + fp;
        return host + "/resources/" + fp;
      }
      return "";
    },
    // 自动打开选集弹窗并定位到对应集数（1 开始）
    async openSortAndSelectEpisode(epNo) {
      const n = Number(epNo) || 1;
      const idx = Math.max(0, Math.floor(n - 1));
      const segIdx = Math.max(0, Math.floor(idx / 20));
      // #ifdef APP-PLUS
      this.initialEpisodeIndex = this.normalizeEpisodeIndex(
        this.currentEpisodeIndex,
      );
      // #endif
      // 先打开弹窗，再拉分段数据；否则 await 卡住/失败时用户会感觉「点了没反应」
      this.showSort = true;
      try {
        await this.changeSegment(segIdx);
      } catch (e) {
        console.warn(
          "[play_video_simple] openSortAndSelectEpisode changeSegment",
          e,
        );
      }
      this.initialEpisodeIndex = idx;
      this.currentEpisodeIndex = idx;
    },
    // 跳转短剧详情页
    goDramaDetail() {
      // #ifdef APP-PLUS
      console.log("[play_video_simple][cover-tap] goDramaDetail");
      // #endif
      const dramaId = String(
        this.dramaId || (this.dramaInfo && this.dramaInfo.id) || "",
      ).trim();
      if (!dramaId) {
        uni.showToast({
          title: "短剧信息异常",
          icon: "none",
        });
        return;
      }
      uni.navigateTo({
        url: `/micro_theatre_two/pages/playlet_info/playlet_info?id=${encodeURIComponent(dramaId)}`,
      });
    },
    // 用户 VIP 信息：用于“会员免费观看”放行
    fetchUserVipInfo() {
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=user_detail",
        method: "POST",
        data: {},
      })
        .then((res) => {
          if (res && res.errcode === 0 && res.data) {
            const info = res.data || {};
            const level = info.level || {};
            this.vipStatus = Number(level.vip_status) === 1 ? 1 : 0;
            this.vipLevelName = level.level_name
              ? String(level.level_name)
              : "";
            // theatre_user.level_id 通常来自 info.level_id；兜底兼容其它字段命名
            this.vipLevelId = Number(
              info.level_id ?? level.level ?? level.id ?? 0,
            );
          }
        })
        .catch(() => {});
    },
    handlePurchaseSuccess() {
      // 支付成功后刷新购买状态，立即解锁
      this.fetchPurchaseStatus();
    },
    isEpisodePurchased(episodeOrder) {
      const n = Number(episodeOrder);
      if (!Number.isFinite(n) || n <= 0) return false;
      return !!this.purchasedEpisodes[Math.floor(n)];
    },
    /**
     * 与 isCurrentEpisodeFree 一致：fee_type=1 为免费整集不显示锁；fee_type=2 为付费才可能显示锁。
     * （后台 episodes_save：1=免费，2=付费）
     */
    isEpisodeItemFreeForLock(ep) {
      if (!ep || typeof ep !== "object") return false;
      const ft = Number(ep.fee_type);
      if (ft === 1) return true;
      if (ft === 2) return false;
      const ic = Number(ep.is_charged);
      if (ic === 2) return true;
      if (ic === 1) return false;
      return false;
    },
    /** 选集列表锁标：仅收费集且仍未解锁时显示 */
    episodeItemShowsLockIcon(item, index) {
      if (this.isEpisodeItemFreeForLock(item)) return false;
      const order = Number(item.episode_order || index + 1);
      if (order <= this.freeEpisodeCount) return false;
      if (this.vipCanWatchThisDrama) return false;
      if (this.isEpisodePurchased(order)) return false;
      const idx = item.episode_order ? Number(item.episode_order) - 1 : index;
      if (this.adUnlockedEpisodes[idx]) return false;
      return true;
    },
    fetchPurchaseStatus() {
      request({
        url: "/micro_theatre_two/web/index.php?m=order_data&a=get_user_purchase_status&xdebug=xdebug",
        method: "POST",
        data: {
          drama_id: this.dramaId,
        },
      })
        .then((res) => {
          if (res && res.errcode == 0 && res.data) {
            const d = res.data || {};
            this.isWholeDramaPurchased =
              Number(d.is_whole_drama_purchased) === 1;
            const eps = Array.isArray(d.purchased_episodes)
              ? d.purchased_episodes
              : [];
            const map = {};
            eps.forEach((v) => {
              const n = Number(v);
              if (Number.isFinite(n) && n > 0) map[Math.floor(n)] = true;
            });
            this.purchasedEpisodes = map;
          }
        })
        .catch(() => {});
    },
    // new_video 上报的播放进度（秒），用于广告解锁回传 resume_time
    handleProgressChange(payload) {
      if (!payload || typeof payload !== "object") return;
      const idx = Number(payload.index);
      const t = Number(payload.currentTime);
      if (!Number.isFinite(idx) || idx < 0) return;
      if (!Number.isFinite(t) || t < 0) return;

      // 只更新当前集的进度，避免临近切集时的数据抖动覆盖
      if (idx === this.currentEpisodeIndex) {
        this.currentTime = t;
      }
    },
    // 广告页回传：标记某一集已通过广告解锁，并切换到对应集播放
    handleAdUnlockFromAdvert(payload) {
      if (!payload || typeof payload !== "object") return;
      // 广告解锁成功后关闭“购买/解锁”弹窗，避免返回后仍然遮挡播放
      this.showBuyPop = false;
      this.buyNum = null;
      const epNo = Number(payload.episode) || 1;
      const resumeTime =
        Number(payload.resume_time || payload.resumeTime || 0) || 0;
      // 如果视频列表还没加载好，先记住待解锁的集数，等剧集加载后再处理
      if (!this.videoList || this.videoList.length === 0) {
        this.pendingAdUnlockEpisode = epNo;
        this.pendingAdUnlockResumeTime = resumeTime;
        return;
      }
      const idx = this.normalizeEpisodeIndex(epNo - 1);
      const vLen = Array.isArray(this.videoList) ? this.videoList.length : 0;
      if (idx < 0 || idx >= vLen) return;
      this.$set(this.adUnlockedEpisodes, idx, true);
      this.initialEpisodeIndex = idx;
      this.currentEpisodeIndex = idx;
      // 恢复进度（广告返回后，底层播放器会 seek 到此时间点）
      this.resumeTime = resumeTime;
      this.currentTime = resumeTime;
      this.pendingAdUnlockResumeTime = 0;
      try {
        const app = typeof getApp === "function" && getApp();
        if (app && app.globalData) app.globalData.last_ad_unlock = null;
      } catch (e) {
        // ignore
      }
      this.$nextTick(() => {
        const nv = this.$refs.newVideoPlayer;
        if (nv && typeof nv.playCurrentSlot === "function") {
          nv.playCurrentSlot();
        }
      });
    },

    /**
     * uni-ad 激励视频广告位 id（adpid），用于 createRewardedVideoAd。
     * 兼容后台把激励位 id 放在 tencent_app_id（与 rewarded_adpid 等择一配置即可）。
     */
    getRewardedVideoAdpid() {
      const s = this.adSetting || {};
      const fromSetting =
        s.rewarded_adpid ||
        s.uni_adpid ||
        s.video_adpid ||
        s.adpid ||
        s.tencent_vod_adpid ||
        s.tencent_app_id ||
        s.tencent_rewarded_id ||
        s.gdt_rewarded_id ||
        s.gdt_reward_video_id ||
        s.incentive_adpid ||
        s.jili_adpid ||
        "";
      const d = this.dramaInfo || {};
      const raw =
        (fromSetting && String(fromSetting).trim()) ||
        d.adpid ||
        d.rewarded_adpid ||
        d.uni_adpid ||
        d.video_adpid ||
        d.tencent_app_id ||
        d.reward_video_ad_id;
      if (raw == null || String(raw).trim() === "") return "";
      return String(raw).trim();
    },
    /**
     * 可播类型：local=仅当允许本地广告页；tencent_vod=激励（当前未打通 SDK 时仍参与随机，走直接解锁）
     */
    getPlayableAdUnlockTypes() {
      const declared = this.remoteAdTypesDeclared;
      const out = [];
      for (let i = 0; i < declared.length; i++) {
        const t = declared[i];
        if (t === "local" && this.localAdUnlockAllowed) {
          if (!out.includes("local")) out.push("local");
          continue;
        }
        if (t === "tencent_vod") {
          if (!out.includes("tencent_vod")) out.push("tencent_vod");
        }
      }
      return out;
    },
    /**
     * 按 ad_setting 在可播类型间随机；仅 tencent_vod 时直接激励解锁；绝不因「无可播」强开本地页
     */
    openAdUnlockByRemoteSetting(episodeIndex, resumeTime) {
      const declared = this.remoteAdTypesDeclared;
      const playable = this.getPlayableAdUnlockTypes();
      if (playable.length === 0) {
        if (declared.includes("tencent_vod")) {
          this.openInlineRewardedUnlock(episodeIndex, resumeTime);
          return;
        }
        if (declared.includes("local") && this.localAdUnlockAllowed) {
          this.openAdUnlockPage(episodeIndex, resumeTime);
          return;
        }
        uni.showToast({
          icon: "none",
          title: "未配置可用广告方式",
        });
        return;
      }
      if (playable.length === 1) {
        if (playable[0] === "local") {
          this.openAdUnlockPage(episodeIndex, resumeTime);
        } else {
          this.openInlineRewardedUnlock(episodeIndex, resumeTime);
        }
        return;
      }
      const pick = playable[Math.floor(Math.random() * playable.length)];
      if (pick === "local") {
        this.openAdUnlockPage(episodeIndex, resumeTime);
      } else {
        this.openInlineRewardedUnlock(episodeIndex, resumeTime);
      }
    },
    unlockUserIdForCallback() {
      const id = getMtUserId();
      return id != null && id !== "" ? id : "";
    },
    buildRewardedCloseContext(episodeIndex, resumeTimeSec = 0) {
      const idx = this.normalizeEpisodeIndex(episodeIndex);
      const ep = (this.episodeList && this.episodeList[idx]) || {};
      const dramaIdForAd =
        this.dramaId ||
        ep.drama_id ||
        (this.dramaInfo && this.dramaInfo.id) ||
        "";
      const episodeOrder = Math.max(
        1,
        Number(ep.episode_order != null ? ep.episode_order : idx + 1) || 1,
      );
      const resumeSec = Math.max(0, Math.floor(Number(resumeTimeSec) || 0));
      const dramaIdNum = Number(dramaIdForAd) || 0;
      return {
        idx,
        resumeSec,
        dramaIdForAd,
        episodeOrder,
        dramaIdNum,
      };
    },
    handleRewardedVideoCloseDetail(detail, ctx) {
      const isEnded = !!(detail && detail.isEnded);
      if (isEnded) {
        request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=advert_watch_log_add",
          method: "POST",
          data: {
            drama_id: ctx.dramaIdNum,
            episode: ctx.episodeOrder,
            watch_seconds: 1,
            ad_video_id: 0,
            play_type: "rewarded",
          },
        }).catch(() => {});
        const payload = {
          dramaId: String(ctx.dramaIdForAd || ""),
          episode: ctx.episodeOrder,
          watchSeconds: 1,
          resume_time: ctx.resumeSec,
        };
        try {
          const app = typeof getApp === "function" && getApp();
          if (app) {
            app.globalData = app.globalData || {};
            app.globalData.last_ad_unlock = {
              ...payload,
              ts: Date.now(),
            };
          }
        } catch (e) {
          // ignore
        }
        this.adUnlockInFlight = false;
        this.handleAdUnlockFromAdvert(payload);
      } else {
        this.adUnlockInFlight = false;
        uni.showToast({
          icon: "none",
          title: "未完整观看，未解锁（isEnded=false）",
        });
      }
    },
    runSimulatedRewardedClose(episodeIndex, resumeTimeSec, isEnded) {
      const detail = { isEnded: !!isEnded };
      const ctx = this.buildRewardedCloseContext(episodeIndex, resumeTimeSec);
      console.log(
        "[play_video_simple] simulate rewarded @close e.detail =",
        detail,
        ctx,
      );
      this.handleRewardedVideoCloseDetail(detail, ctx);
    },
    simulateRewardedCloseEndedTrue() {
      if (!this.rewardedDebugVisible) return;
      this.adUnlockInFlight = true;
      this.runSimulatedRewardedClose(
        this.currentEpisodeIndex,
        this.currentTime,
        true,
      );
    },
    simulateRewardedCloseEndedFalse() {
      if (!this.rewardedDebugVisible) return;
      this.adUnlockInFlight = true;
      this.runSimulatedRewardedClose(
        this.currentEpisodeIndex,
        this.currentTime,
        false,
      );
    },
    /**
     * @param bypassLocalPolicy 为 true 时跳过 remote ad_types 对 local 的限制（仅用于激励位未配置时的降级）
     */
    openAdUnlockPage(
      episodeIndex,
      resumeTimeSec = 0,
      bypassLocalPolicy = false,
    ) {
      if (!bypassLocalPolicy && !this.localAdUnlockAllowed) {
        uni.showToast({
          icon: "none",
          title: "当前未开启本地广告页",
        });
        return;
      }
      const ep = (this.episodeList && this.episodeList[episodeIndex]) || {};
      const dramaIdForAd =
        this.dramaId ||
        ep.drama_id ||
        (this.dramaInfo && this.dramaInfo.id) ||
        "";
      const episodeOrder = Number(
        ep.episode_order != null ? ep.episode_order : episodeIndex + 1,
      );
      const qs =
        `?drama_id=${encodeURIComponent(String(dramaIdForAd || ""))}` +
        `&episode=${encodeURIComponent(String(Math.max(1, episodeOrder || 1)))}` +
        `&resume_time=${encodeURIComponent(String(Math.max(0, Number(resumeTimeSec) || 0)))}`;
      const bases = [
        "/micro_theatre_two/pages/advertisement/advert",
        "/pages/advertisement/advert",
      ];
      this.adUnlockInFlight = true;
      const tryOpen = (i, useRedirect) => {
        if (i >= bases.length) {
          this.adUnlockInFlight = false;
          uni.showToast({
            title: "广告页打开失败",
            icon: "none",
          });
          return;
        }
        const url = bases[i] + qs;
        const api = useRedirect ? uni.redirectTo : uni.navigateTo;
        api.call(uni, {
          url,
          fail: (err) => {
            const msg = String((err && err.errMsg) || "");
            console.warn("[openAdUnlockPage] fail", url, msg);
            if (!useRedirect) {
              const low = msg.toLowerCase();
              const stackLike =
                low.indexOf("limit") !== -1 ||
                low.indexOf("depth") !== -1 ||
                low.indexOf("webview") !== -1 ||
                msg.indexOf("栈") !== -1 ||
                msg.indexOf("层") !== -1;
              if (stackLike) {
                tryOpen(i, true);
                return;
              }
            }
            tryOpen(i + 1, false);
          },
        });
      };
      tryOpen(0, false);
    },
    /**
     * 对应 task.vue 里 @click="show(index)"：观看激励视频入口（index 为剧集下标 0 起，不传则用当前集）。
     */
    showUnlockRewarded(index) {
      if (this.adUnlockInFlight) return;
      const epIdx =
        index != null && index !== "" && Number.isFinite(Number(index))
          ? this.normalizeEpisodeIndex(Number(index))
          : this.currentEpisodeIndex;
      const resume = Math.max(0, Number(this.currentTime) || 0);
      console.log("[play_video_simple] showUnlockRewarded", epIdx, resume);
      this.openInlineRewardedUnlock(epIdx, resume);
    },
    /**
     * 对应 task.vue 的 showTask：创建激励实例、onLoad/onError/onClose、load().then(show())。
     * 无 adpid 或不支持 SDK：ad_mock 模拟 / 本地广告页 / toast。
     */
    openInlineRewardedUnlock(episodeIndex, resumeTimeSec = 0) {
      const ctx = this.buildRewardedCloseContext(episodeIndex, resumeTimeSec);
      if (globalData.micro_theatre_rewarded_mock_success) {
        const mockCloseDetail = { isEnded: true };
        const logBody = {
          scene: "play_video_simple_unlock",
          eDetail: mockCloseDetail,
          closeContext: ctx,
          advert_watch_log_add: {
            drama_id: ctx.dramaIdNum,
            episode: ctx.episodeOrder,
            watch_seconds: 1,
            ad_video_id: 0,
            play_type: "rewarded",
          },
          ad_unlock_success: {
            dramaId: String(ctx.dramaIdForAd || ""),
            episode: ctx.episodeOrder,
            watchSeconds: 1,
            resume_time: ctx.resumeSec,
          },
        };
        console.log("[play_video_simple] 激励视频【模拟】视为看完", logBody);
        this.handleRewardedVideoCloseDetail(mockCloseDetail, ctx);
        return;
      }
      const adpid = this.getRewardedVideoAdpid();
      const hasSdk = typeof uni.createRewardedVideoAd === "function";
      const canShowReal = !!(adpid && hasSdk);

      if (!canShowReal) {
        if (this.adUnlockMockEnabled) {
          this.adUnlockInFlight = true;
          this.handleRewardedVideoCloseDetail({ isEnded: true }, ctx);
          return;
        }
        if (this.localAdUnlockAllowed) {
          this.openAdUnlockPage(episodeIndex, resumeTimeSec);
          return;
        }
        // 远程仅配了 tencent_vod 等但未填 adpid 时：仍打开本地广告页，避免用户无法解锁
        if (hasSdk && !adpid) {
          this.openAdUnlockPage(episodeIndex, resumeTimeSec, true);
          return;
        }
        uni.showToast({
          icon: "none",
          title: hasSdk
            ? "未配置激励广告位，无法播放"
            : "当前环境不支持激励视频",
        });
        return;
      }

      const idx = this.normalizeEpisodeIndex(episodeIndex);
      const ep = (this.episodeList && this.episodeList[idx]) || {};
      const dramaIdForAd =
        this.dramaId ||
        ep.drama_id ||
        (this.dramaInfo && this.dramaInfo.id) ||
        "";
      const episodeOrder = Math.max(
        1,
        Number(ep.episode_order != null ? ep.episode_order : idx + 1) || 1,
      );
      const resumeSec = Math.max(0, Math.floor(Number(resumeTimeSec) || 0));

      this._isRewardedUnlockLoaded = false;
      this.adUnlockInFlight = true;
      const that = this;
      const rewardedVideoAd = (this._rewardedVideoAdUnlock =
        uni.createRewardedVideoAd({
          adpid,
          urlCallback: {
            userId: this.unlockUserIdForCallback(),
            extra: {
              http_host: this.http_host,
              customer_id: this.customer_id,
              scene: "play_video_simple_unlock",
              drama_id: dramaIdForAd,
              episode: episodeOrder,
              episode_index: idx + 1,
              resume_time: resumeSec,
            },
          },
        }));
      // H5 等：createRewardedVideoAd 存在但返回无效对象
      if (
        !rewardedVideoAd ||
        typeof rewardedVideoAd.onLoad !== "function" ||
        typeof rewardedVideoAd.load !== "function"
      ) {
        this.adUnlockInFlight = false;
        this._rewardedVideoAdUnlock = null;
        if (this.adUnlockMockEnabled) {
          this.adUnlockInFlight = true;
          this.handleRewardedVideoCloseDetail({ isEnded: true }, ctx);
          return;
        }
        if (this.localAdUnlockAllowed) {
          this.openAdUnlockPage(episodeIndex, resumeTimeSec);
          return;
        }
        this.openAdUnlockPage(episodeIndex, resumeTimeSec, true);
        return;
      }
      rewardedVideoAd.onLoad(() => {
        that._isRewardedUnlockLoaded = true;
        console.log("[play_video_simple] rewarded onLoad");
      });
      rewardedVideoAd.onError((err) => {
        console.log("[play_video_simple] rewarded onError", err);
        that._isRewardedUnlockLoaded = false;
        that.adUnlockInFlight = false;
        uni.showToast({
          icon: "none",
          title:
            err && err.errMsg
              ? String(err.errMsg) + ",请重新加载此页面"
              : "激励视频加载失败,请重新加载此页面",
        });
      });
      rewardedVideoAd.onClose((res) => {
        console.log("[play_video_simple] rewarded onClose", res);
        if (res && res.isEnded) {
          console.log("正常播放结束", res.isEnded);
        } else {
          console.log("播放中途退出", res && res.isEnded);
        }
        const detail = { isEnded: !!(res && res.isEnded) };
        that.handleRewardedVideoCloseDetail(detail, ctx);
      });
      rewardedVideoAd
        .load()
        .then(() => rewardedVideoAd.show())
        .catch((err) => {
          that.adUnlockInFlight = false;
          uni.showToast({
            icon: "none",
            title: "广告视频加载失败，请稍后再试！",
          });
          console.log("[play_video_simple] load/show rejected", err);
        });
    },
    openRandomAdUnlock(episodeIndex, resumeTime) {
      const p = this.adUnlockRewardedProbability;
      const wantRewarded = Math.random() < p;
      if (wantRewarded) {
        this.openInlineRewardedUnlock(episodeIndex, resumeTime);
        return;
      }
      if (this.localAdUnlockAllowed) {
        this.openAdUnlockPage(episodeIndex, resumeTime);
        return;
      }
      this.openInlineRewardedUnlock(episodeIndex, resumeTime);
    },

    normalizeEpisodeIndex(index) {
      const parsedIndex = Number(index);
      if (!Number.isFinite(parsedIndex) || parsedIndex <= 0) {
        return 0;
      }
      const vLen = Array.isArray(this.videoList) ? this.videoList.length : 0;
      if (!vLen) return 0;
      if (parsedIndex >= vLen) {
        return vLen - 1;
      }
      return Math.floor(parsedIndex);
    },
    /** 支付回跳 URL 中的集序：优先 buy_num，其次当前条目的 episode_order，最后列表下标+1 */
    resolveEpisodeOrderForPayUrl() {
      if (this.buyNum != null && Number(this.buyNum) > 0) {
        return Math.floor(Number(this.buyNum));
      }
      const list = this.episodeList || [];
      const idx = this.normalizeEpisodeIndex(this.currentEpisodeIndex);
      const ep = list[idx];
      if (ep && typeof ep === "object") {
        const ord = Number(ep.episode_order);
        if (Number.isFinite(ord) && ord > 0) {
          return Math.floor(ord);
        }
      }
      return Math.max(1, idx + 1);
    },
    handleVideoChange(index) {
      this.currentEpisodeIndex = this.normalizeEpisodeIndex(index);
      this.reportTheatreWatchLog();
    },
    // 选集弹窗中点击集数，切换到对应集播放
    handleEpisodeClick(index) {
      const nextIndex = this.normalizeEpisodeIndex(index);
      this.initialEpisodeIndex = nextIndex;
      this.currentEpisodeIndex = nextIndex;
      // 用户主动点选集数时，清空 buyNum，改为正常选集逻辑
      this.buyNum = null;
      this.reportTheatreWatchLog();
    },
    getCurrentEpisodeId() {
      const ep = this.episodeList && this.episodeList[this.currentEpisodeIndex];
      if (!ep) return 0;
      const id = ep.id || ep.episode_id || ep.episodeId;
      return Number(id) || 0;
    },
    reportTheatreWatchLog() {
      // 仅在具备必要参数时上报
      const dramaId =
        Number(this.dramaId || (this.dramaInfo && this.dramaInfo.id)) || 0;
      const episodeId = this.getCurrentEpisodeId();
      if (!dramaId || !episodeId) return;

      const today = new Date();
      const ymd =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
      const key = `${dramaId}_${episodeId}_${ymd}`;
      if (this.lastWatchLogKey === key) return;
      this.lastWatchLogKey = key;

      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=theatre_watch_log_add",
        method: "POST",
        data: {
          drama_id: dramaId,
          episode_id: episodeId,
          scene_type: "normal",
          from_type: 2,
        },
      }).catch(() => {
        // 上报失败不影响播放
      });
    },
    parseTrialRatio(value) {
      if (typeof value === "number") {
        if (!Number.isFinite(value)) return 0;
        return value > 1 ? Math.min(value / 100, 1) : Math.max(0, value);
      }
      if (typeof value !== "string") {
        return 0;
      }
      const normalizedValue = value.trim();
      if (!normalizedValue) return 0;
      if (normalizedValue.endsWith("%")) {
        const percentValue = parseFloat(normalizedValue.slice(0, -1));
        if (!Number.isFinite(percentValue)) return 0;
        return Math.min(Math.max(percentValue / 100, 0), 1);
      }
      const parsedValue = Number(normalizedValue);
      if (!Number.isFinite(parsedValue)) return 0;
      return parsedValue > 1
        ? Math.min(parsedValue / 100, 1)
        : Math.max(parsedValue, 0);
    },
    async handleTrialLimitReached(payload) {
      const payloadIndex =
        payload && typeof payload === "object" ? payload.index : payload;
      const episodeIndex = this.normalizeEpisodeIndex(payloadIndex);
      if (
        episodeIndex < this.freeEpisodeCount ||
        this.trialExhaustedEpisodes[episodeIndex]
      ) {
        return;
      }
      // trial 到边界时，同步一次当前播放时间，确保“观看广告解锁”回传进度准确
      if (
        payload &&
        typeof payload === "object" &&
        Number(payload.currentTime) >= 0 &&
        Number.isFinite(Number(payload.currentTime))
      ) {
        if (episodeIndex === this.currentEpisodeIndex) {
          this.currentTime = Number(payload.currentTime);
        }
      }
      this.$set(this.trialExhaustedEpisodes, episodeIndex, true);
      const resumeTime =
        payload && typeof payload === "object"
          ? Number(payload.currentTime || payload.time || 0)
          : 0;
      this.currentTime = Math.max(0, Number(resumeTime) || 0);
      // 试看结束不自动弹出购买弹窗，用户可点「解锁当前剧集」进入
    },
    closeBuyPop() {
      this.showBuyPop = false;
    },
    toggleBuyPop() {
      // #ifdef APP-PLUS
      console.log("[play_video_simple][cover-tap] toggleBuyPop");
      // #endif
      const next = !this.showBuyPop;
      if (next) {
        this.payReturnEpisodeOrderForBridge =
          this.resolveEpisodeOrderForPayUrl();
      }
      // #ifdef APP-PLUS
      if (next) {
        this.initialEpisodeIndex = this.normalizeEpisodeIndex(
          this.currentEpisodeIndex,
        );
      }
      // #endif
      this.showBuyPop = next;
    },
    toggleComment() {
      // #ifdef APP-PLUS
      console.log("[play_video_simple][cover-tap] toggleComment");
      // #endif
      const next = !this.showComment;
      // #ifdef APP-PLUS
      if (next) {
        this.initialEpisodeIndex = this.normalizeEpisodeIndex(
          this.currentEpisodeIndex,
        );
      }
      // #endif
      this.showComment = next;
      if (next) {
        this.fetchCommentTotal();
        this.$nextTick(() => {
          if (this.$refs.reviewList && this.$refs.reviewList.refresh) {
            this.$refs.reviewList.refresh();
          }
        });
      }
    },
    onCommentPopupClose() {
      if (!this.showComment) return;
      this.showComment = false;
    },
    async toggleSort() {
      // #ifdef APP-PLUS
      console.log("[play_video_simple][cover-tap] toggleSort", {
        wasOpen: this.showSort,
      });
      // #endif
      if (this.showSort) {
        this.showSort = false;
        return;
      }
      try {
        await this.openSortAndSelectEpisode(
          (Number(this.currentEpisodeIndex) || 0) + 1,
        );
      } catch (e) {
        console.warn("[play_video_simple] toggleSort", e);
        uni.showToast({
          title: "选集打开失败，请重试",
          icon: "none",
        });
      }
    },
    toggleAutoChange() {
      this.isAutoChange = !this.isAutoChange;
    },
    async fetchEpisodePage(page) {
      const p = Number(page) || 1;
      const res = await request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=episode_list",
        method: "POST",
        data: {
          drama_id: this.dramaId,
          page: p,
          page_size: this.popupPageSize,
        },
      });
      if (!(res && res.errcode == 0 && res.data && res.data.list)) {
        return {
          list: [],
          count: 0,
        };
      }
      const list = (res.data.list || []).slice();
      // 兼容字段缺失/字段名不一致：保证 episode_order 为 1..N 的数字
      const baseOrder = (p - 1) * (Number(this.popupPageSize) || 20);
      for (let i = 0; i < list.length; i++) {
        const row = list[i] || {};
        let order = Number(
          row.episode_order ??
            row.episodeOrder ??
            row.episode_no ??
            row.episodeNo ??
            row.episode_num ??
            row.episodeNum ??
            0,
        );
        if (!Number.isFinite(order) || order <= 0) {
          order = baseOrder + i + 1;
        }
        row.episode_order = Math.floor(order);
        list[i] = row;
      }
      list.sort(
        (a, b) =>
          (Number(a.episode_order) || 0) - (Number(b.episode_order) || 0),
      );
      const count = Number(res.data.count) || 0;
      return {
        list,
        count,
      };
    },
    rebuildMergedEpisodes(maxPage) {
      const pages = Number(maxPage) || 1;
      const merged = [];
      for (let p = 1; p <= pages; p++) {
        const part = this.episodePageCache[p];
        if (part && part.length) merged.push(...part);
      }
      merged.sort((a, b) => Number(a.episode_order) - Number(b.episode_order));
      this.episodeList = merged;
      this.videoList = merged.map((item) => {
        const u = this.getEpisodeVideoUrl(item);
        return typeof u === "string" && u.length > 0 ? u : "";
      });
    },
    async ensurePagesLoaded(targetPage) {
      const tp = Math.max(1, Math.floor(Number(targetPage) || 1));
      for (let p = 1; p <= tp; p++) {
        if (this.episodePageCache[p]) continue;
        try {
          const { list } = await this.fetchEpisodePage(p);
          this.$set(this.episodePageCache, p, list);
        } catch (e) {
          // 忽略单页失败，保留已加载的页
        }
      }
      this.rebuildMergedEpisodes(tp);
    },
    // 接口：短剧详情
    fetchDramaDetail() {
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=drama_detail",
        method: "POST",
        data: {
          id: this.dramaId,
          user_id: getMtUserId(),
        },
      })
        .then((res) => {
          if (res.errcode == 0 && res.data && res.data.info) {
            const info = res.data.info || {};
            this.dramaInfo = Object.assign({}, this.dramaInfo || {}, info);
            if (typeof info.isLike !== "undefined") {
              this.isLike = Number(info.isLike) === 1;
            }

            if (
              this.sortHeaderInfo &&
              typeof this.sortHeaderInfo === "object"
            ) {
              this.sortHeaderInfo.cover =
                info.cover_image || this.sortHeaderInfo.cover;
              this.sortHeaderInfo.title =
                info.name || this.sortHeaderInfo.title;
              this.sortHeaderInfo.subtitle =
                (info.description &&
                  info.description.replace(/<[^>]+>/g, "")) ||
                this.sortHeaderInfo.subtitle;
            } else {
              this.sortHeaderInfo = {
                cover:
                  info.cover_image ||
                  this.http_host +
                    "/micro_theatre_two/web/static/images/movie.png",
                title: info.name || "短剧标题",
                subtitle:
                  (info.description &&
                    info.description.replace(/<[^>]+>/g, "")) ||
                  "短剧简介",
              };
            }
          }
        })
        .catch(() => {});
    },
    // 分段切换：点击 1-20 / 21-40 / 41-60 等标签
    async changeSegment(index) {
      const idx = Number(index) || 0;
      this.currentSegmentIndex = idx;
      const page = idx + 1; // 第 0 段对应 page=1

      // 确保 1..page 都已加载（避免直接点 41-55 导致中间页缺失、索引不连续无法播放）
      await this.ensurePagesLoaded(page);

      if (this.episodePageCache[page]) {
        this.popupEpisodeList = this.episodePageCache[page];
      } else {
        this.popupEpisodeList = [];
      }
    },
    // 接口：剧集列表（首页一次性获取，供播放器与第 1 段使用）
    async fetchEpisodeList() {
      try {
        const { list, count } = await this.fetchEpisodePage(1);
        if (Number.isFinite(count) && count > 0) {
          const c = Math.floor(Number(count));
          this.episodeTotalCount = c;
          this.$set(this.dramaInfo, "total_episodes", c);
        }
        this.$set(this.episodePageCache, 1, list);
        this.rebuildMergedEpisodes(1);
        this.popupEpisodeList = list;
        // 如果之前已经看完广告但当时还没拿到剧集列表，这里补一次解锁逻辑
        if (this.pendingAdUnlockEpisode) {
          const epNo = Number(this.pendingAdUnlockEpisode) || 1;
          const resumeTime = Number(this.pendingAdUnlockResumeTime) || 0;
          const idx = this.normalizeEpisodeIndex(epNo - 1);
          const vLen = Array.isArray(this.videoList)
            ? this.videoList.length
            : 0;
          if (idx >= 0 && idx < vLen) {
            this.$set(this.adUnlockedEpisodes, idx, true);
            this.initialEpisodeIndex = idx;
            this.currentEpisodeIndex = idx;
            this.resumeTime = resumeTime;
            this.currentTime = resumeTime;
          }
          this.pendingAdUnlockEpisode = null;
          this.pendingAdUnlockResumeTime = 0;
        }

        // 如果从其它页面带 open_sort 进来，则自动打开选集弹窗并定位到对应集
        if (this.pendingOpenSortEpisode) {
          const targetEp = this.pendingOpenSortEpisode;
          this.pendingOpenSortEpisode = null;
          await this.openSortAndSelectEpisode(targetEp);
        }
      } catch (e) {
        console.warn("fetchEpisodeList 网络异常，使用已有剧集列表：", e);
      }
    },
    // 接口：评论总数
    fetchCommentTotal() {
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=drama_comments",
        method: "POST",
        data: {
          drama_id: this.dramaId,
          page: 1,
          limit: 1,
          page_size: 1,
        },
      })
        .then((res) => {
          if (res.errcode == 0 && res.data) {
            const total =
              Number(res.data.count) ||
              Number(res.data.total) ||
              Number(res.data.total_count) ||
              (Array.isArray(res.data.list) ? res.data.list.length : 0);
            this.commentTotal = total || 0;
          } else {
            this.commentTotal = 0;
          }
        })
        .catch(() => {
          this.commentTotal = 0;
        });
    },
    // 统一处理购买弹窗提交事件：这里仅预留接口调用位置
    handleBuySubmit(payload) {
      console.log("buy submit payload:", payload);
    },
    toggleLike() {
      // #ifdef APP-PLUS
      console.log("[play_video_simple][cover-tap] toggleLike");
      // #endif
      if (!this.dramaId) {
        uni.showToast({
          title: "短剧信息异常",
          icon: "none",
        });
        return;
      }
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=toggle_drama_like",
        method: "POST",
        data: {
          drama_id: this.dramaId,
          type: 1,
        },
      })
        .then((res) => {
          if (res.errcode == 0) {
            const prev = this.isLike;
            this.isLike = !this.isLike;
            if (!(this.dramaInfo && typeof this.dramaInfo === "object")) {
              this.dramaInfo = {
                id: null,
                name: "",
                cover_image: "",
                freeTimeProportion: "10%",
                favorite_count: 0,
                like_count: 0,
              };
            }
            const cur =
              Number(
                this.dramaInfo.like_count != null
                  ? this.dramaInfo.like_count
                  : this.dramaInfo.favorite_count,
              ) || 0;
            const next = this.isLike ? cur + 1 : Math.max(0, cur - 1);
            this.$set(this.dramaInfo, "like_count", next);
            // 调试：输出用户操作后的点赞态
            console.log("[play_video_simple] isLike toggled:", {
              dramaId: this.dramaId,
              user_id: getMtUserId(),
              prev_isLike: prev,
              next_isLike: this.isLike,
              like_count_next: next,
              api_errmsg: res.errmsg,
            });
          }
        })
        .catch((ret) => {
          const msg = (ret && ret.errmsg) || "操作失败，请稍后重试";
          uni.showToast({
            title: msg,
            icon: "none",
          });
        });
    },
    submitComment() {
      const content = String(this.commentDraft || "")
        .replace(/[\u3000\s]+/g, " ")
        .trim();
      if (!content) {
        uni.showToast({
          title: "请输入评论内容",
          icon: "none",
        });
        return;
      }
      if (!this.dramaId) {
        uni.showToast({
          title: "短剧信息异常",
          icon: "none",
        });
        return;
      }
      uni.showLoading({
        title: "发送中",
        mask: true,
      });
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=add_comment",
        method: "POST",
        data: {
          drama_id: this.dramaId,
          content,
        },
      })
        .then((res) => {
          uni.hideLoading();
          if (res.errcode == 0) {
            this.commentDraft = "";
            this.fetchCommentTotal();
            if (this.$refs.reviewList && this.$refs.reviewList.refresh) {
              this.$refs.reviewList.refresh();
            }
            uni.showToast({
              title: res.errmsg || "评论成功",
              icon: "success",
            });
          }
        })
        .catch((ret) => {
          uni.hideLoading();
          const msg = (ret && ret.errmsg) || "发送失败，请重试";
          uni.showToast({
            title: msg,
            icon: "none",
          });
        });
    },
    onCommentCountChange(total) {
      this.commentTotal = Number(total) || 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.play-box {
  position: relative;
  color: white;
  height: 100vh;

  .pvs-rewarded-mock-col {
    position: fixed;
    right: 20rpx;
    top: 200rpx;
    z-index: 10050;
    max-width: 220rpx;
  }

  .pvs-rewarded-mock-btn {
    padding: 12rpx 16rpx;
    border-radius: 8rpx;
    background: rgba(255, 165, 0, 0.95);
    color: #1a1a1a;
    font-size: 22rpx;
    text-align: center;
    margin-bottom: 12rpx;
  }

  .pvs-rewarded-mock-btn--muted {
    background: rgba(120, 120, 120, 0.95);
    color: #ffffff;
    margin-bottom: 0;
  }

  .buy-tips {
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    min-width: 260rpx;
    padding: 18rpx 36rpx;
    text-align: center;
    background-color: #25dad1;
    border-radius: 16rpx;
    color: #ffffff;
    font-size: 26rpx;
    font-weight: 500;
  }

  .right-box {
    position: absolute;
    z-index: 99;
    bottom: 35%;
    right: 30rpx;

    .item {
      text-align: center;
      font-size: 22rpx;
      margin-bottom: 48rpx;
      color: #ffffff;

      .icon {
        width: 44rpx;
        height: 44rpx;
        margin-bottom: 8rpx;
      }
    }
  }

  .pop-box {
    background-color: #f8f7f5;
    padding: 30rpx 0 0;
    border-top-right-radius: 20rpx;
    border-top-left-radius: 20rpx;

    .sort-box {
      flex-wrap: wrap;
      gap: 20rpx;
      max-height: 600rpx;
      overflow-y: auto;
      padding-left: 30rpx;
      padding-bottom: 70rpx;

      .segment-row {
        width: 100%;
        margin-bottom: 20rpx;
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;

        .segment-item {
          padding: 6rpx 18rpx;
          border-radius: 999rpx;
          background-color: rgba(0, 0, 0, 0.06);
          font-size: 22rpx;
          color: #868582;
        }

        .segment-item.active {
          background: linear-gradient(
            136.74deg,
            #0ff8ec 0.61%,
            #fcb629 103.83%
          );
          color: #221f18;
        }
      }

      .active {
        background: linear-gradient(136.74deg, #0ff8ec 0.61%, #fcb629 103.83%);
      }

      .num {
        display: inline-block;
        background-color: rgba(0, 0, 0, 0.08);
        width: 100rpx;
        height: 100rpx;
        border-radius: 16rpx;
        text-align: center;
        line-height: 100rpx;
        color: #221f18;
        position: relative;

        .vip-tag {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 1;
          width: 30rpx;
          height: 30rpx;
        }
      }
    }

    .step-row {
      font-size: 26rpx;
      color: #868582;
      margin-top: 24rpx;

      .active {
        color: #221f18;
      }

      .step-item {
        margin-right: 48rpx;
      }
    }

    .title-box {
      border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);
      color: #868582;
      font-size: 24rpx;
      margin-bottom: 24rpx;
      position: relative;
      padding: 0 30rpx 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .arrow-box {
        display: flex;
        align-items: center;
      }

      .sort-header {
        align-items: center;
        gap: 24rpx;
      }

      .sort-header-main {
        flex: 1;
        min-width: 0;
      }

      .sort-header-cover {
        width: 88rpx;
        height: 120rpx;
        border-radius: 12rpx;
        margin-right: 18rpx;
        flex-shrink: 0;
        background-color: rgba(0, 0, 0, 0.08);
      }

      .sort-header-text {
        flex: 1;
        min-width: 0;
      }

      .sort-title {
        color: #221f18;
        font-size: 30rpx;
        font-weight: 600;
        line-height: 42rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .sort-subtitle {
        margin-top: 6rpx;
        color: #868582;
        font-size: 22rpx;
        line-height: 32rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .sort-header-arrow {
        width: 44rpx;
        height: 44rpx;
        flex-shrink: 0;
      }
    }

    .comment-box {
      max-height: 300px;
      overflow-y: auto;
    }

    .send-box {
      display: flex;
      align-items: center;
      padding: 30rpx 30rpx 80rpx;
      gap: 16rpx;

      .flex-1 {
        flex: 1;
        min-width: 0;
      }

      .textarea {
        min-height: 72rpx;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.08);
        border-radius: 12rpx;
        padding: 24rpx;
        color: #221f18;
        font-size: 26rpx;
      }

      .send-btn {
        flex-shrink: 0;
        padding: 16rpx 32rpx;
        border-radius: 12rpx;
        font-size: 28rpx;
        font-weight: 600;
        color: #221f18;
        background: linear-gradient(90deg, #ffc654 0%, #0ff8ec 100%);
      }
    }
  }

  .bottom-box {
    position: absolute;
    z-index: 99;
    bottom: calc(50rpx + 5px + constant(safe-area-inset-bottom));
    bottom: calc(50rpx + 5px + env(safe-area-inset-bottom));
    left: 0;
    width: 100%;

    .black-box {
      background-color: rgba(0, 0, 0, 0.15);
      margin: 15rpx 30rpx 30rpx;
      border-radius: 16rpx;
      overflow: hidden;

      .info {
        font-size: 22rpx;
        border-radius: 16rpx;
        padding: 12rpx 24rpx;
      }
    }

    .movie {
      padding: 0 30rpx 10rpx;
      font-size: 28rpx;
      .name {
        max-width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .movie-cover {
        width: 44rpx;
        height: 60rpx;
        margin-right: 16rpx;
        border-radius: 8rpx;
      }

      .arrow-right {
        margin-left: 4rpx;
      }
    }
  }

  /* #ifdef APP-PLUS */
  .buy-tips--app,
  .bottom-box--app {
    position: absolute;
    z-index: 1000;
  }

  .bottom-box--app {
    bottom: calc(50rpx + 5px + constant(safe-area-inset-bottom));
    bottom: calc(50rpx + 5px + env(safe-area-inset-bottom));
    left: 0;
    width: 100%;
  }

  .bottom-box--app .movie--app {
    align-items: center;
  }

  .bottom-box--app .movie--app .arrow-icon-app {
    margin-left: 8rpx;
    font-size: 24rpx;
    color: #ffffff;
    line-height: 1;
  }

  .bottom-box--app .black-box--app .info--app {
    padding: 16rpx 24rpx;
    min-height: 72rpx;
    box-sizing: border-box;
  }
  /* #endif */

  /* 调整 new_video 内部真实进度条的位置：贴近标题行下方，且在底部内容之上可交互 */
  // ::v-deep .new-video .progress-bar-wrap {
  // 	left: 30rpx;
  // 	bottom: 160rpx;
  // 	z-index: 120;
  // }
}
</style>

<style lang="scss">
/* APP / 小程序 overlay 共用：H5 上 cover-view 会降级为普通节点，样式无害 */
.play-box .pvs-cover-buy {
  position: absolute;
  top: 46%;
  left: 50%;
  z-index: 10000;
  pointer-events: auto;
  transform: translate(-50%, -50%);
  min-width: 280rpx;
  padding: 22rpx 48rpx;
  text-align: center;
  background-color: #0a9b94;
  border-radius: 999rpx;
}

.play-box .pvs-cover-buy-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 40rpx;
}

.play-box .pvs-cover-right {
  position: absolute;
  z-index: 10000;
  pointer-events: auto;
  bottom: 35%;
  right: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.play-box .pvs-cover-right-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48rpx;
}

.play-box .pvs-cover-icon {
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 8rpx;
}

.play-box .pvs-cover-num {
  font-size: 22rpx;
  color: #ffffff;
  text-align: center;
}

.play-box .pvs-cover-bottom {
  position: absolute;
  z-index: 10000;
  pointer-events: auto;
  bottom: calc(50rpx + 5px + constant(safe-area-inset-bottom));
  bottom: calc(50rpx + 5px + env(safe-area-inset-bottom));
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.play-box .pvs-cover-movie {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 30rpx 10rpx;
}

.play-box .pvs-cover-movie-img {
  width: 44rpx;
  height: 60rpx;
  margin-right: 16rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.play-box .pvs-cover-movie-name {
  flex: 1;
  font-size: 28rpx;
  color: #ffffff;
  max-width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.play-box .pvs-cover-movie-arrow {
  font-size: 28rpx;
  color: #ffffff;
  margin-left: 8rpx;
  flex-shrink: 0;
}

.play-box .pvs-cover-black {
  background-color: rgba(0, 0, 0, 0.15);
  margin: 15rpx 30rpx 30rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.play-box .pvs-cover-info-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 24rpx;
}

.play-box .pvs-cover-info-main {
  flex: 1;
  font-size: 22rpx;
  color: #ffffff;
  margin-right: 16rpx;
}

.play-box .pvs-cover-info-arrow-up {
  font-size: 20rpx;
  color: #ffffff;
  flex-shrink: 0;
}
</style>
