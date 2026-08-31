<template>
  <view class="pop-box">
    <!--订阅-->
    <template v-if="!showPayWay && !showAddress">
      <view class="title-box">
        <view class="flex a-c j-b">
          <view class="sort-title">选择您想订阅的剧集</view>
          <u-icon
            name="arrow-down"
            color="#221F18"
            size="14"
            class="arrow-icon"
            @click="handleClose"
          ></u-icon>
        </view>
      </view>
      <!-- 顶部订阅类型切换：buy_num 场景下隐藏 -->
      <view class="step-row flex p-24 m-b-24" v-if="!forceSingleEpisode">
        <view
          class="step-item"
          :class="{ active: currentBuyType == 1 }"
          @click="handleChangeType(1)"
          >单集订阅
        </view>
        <view
          class="step-item"
          :class="{ active: currentBuyType == 2 }"
          @click="handleChangeType(2)"
          >整剧订阅
        </view>
      </view>
      <view class="pop-content">
        <!--订阅单集start：buy_num 场景下隐藏选集-->
        <view
          class="sort-box flex"
          v-if="currentBuyType == 1 && !forceSingleEpisode"
        >
          <!-- 分段分页：1-20 / 21-40 / 41-60 ... -->
          <view class="segment-row" v-if="pageSegments.length > 1">
            <view
              class="segment-item"
              v-for="seg in pageSegments"
              :key="seg.page"
              :class="{
                active: seg.page === currentPage,
              }"
              @click="changeEpisodePage(seg.page)"
            >
              {{ seg.label }}
            </view>
          </view>
          <view
            class="num"
            v-for="(ep, index) in visibleEpisodes"
            :key="ep.id || index"
            :class="{
              active: Number(ep.episode_order) === Number(currentEpisode),
              'gray-bg': isEpisodeLockedInBuy(ep),
            }"
            @click="handleSelectEpisode(ep)"
          >
            {{ ep.episode_order || index + 1 }}
            <image
              :src="
                http_host + '/micro_theatre_two/web/static/images/lock2.png'
              "
              class="vip-tag"
              v-if="isEpisodeLockedInBuy(ep)"
            ></image>
          </view>
        </view>
        <!--订阅单集end-->
        <!--订阅整集/版权start-->
        <view class="movie-info flex a-c" v-if="currentBuyType > 1">
          <view class="cover-box">
            <image :src="dramaCover" class="cover" mode="aspectFill"></image>
          </view>
          <view class="info-group">
            <view class="name">{{ dramaName }}</view>
            <view class="all">{{ dramaEpisodesText }}</view>
          </view>
        </view>
        <!--订阅整集/版权end-->
      </view>
      <view class="pop-bottom">
        <view class="flex a-c j-b">
          <view class="flex a-c">
            <view class="label">需支付</view>
            <view class="red">{{ payAmountText }}</view>
          </view>
          <view class="pay-bnt" @click="showPayWayPop">立即订阅</view>
        </view>
      </view>
    </template>

    <!--选择订阅方式start（样式对齐播放页解锁弹窗：白底 + 头栏 + 双按钮）-->
    <view v-if="showPayWay" class="pay-way-layout">
      <view class="pay-way-header">
        <view class="pay-way-header-top">
          <text class="pay-way-title-text">{{ dramaName }} 第{{ currentEpisode }}集</text>
          <view class="pay-way-close" @tap.stop="handleClose">
            <text class="pay-way-close-arrow">⌄</text>
          </view>
        </view>
        <text class="pay-way-sub-tip">为保护创作者权益，当前内容需要解锁后观看</text>
      </view>
      <view class="pay-way-divider"></view>
      <view class="pay-way-content">
        <text class="pay-way-label">请选择支付方式</text>
        <scroll-view class="pay-way-list-scroll" scroll-y="true">
          <view
            class="pay-way-item"
            v-for="(item, index) in displayPayWayList"
            :key="index"
            @click="setActivePayWay(index)"
          >
            <image
              :src="
                http_host +
                (item.checked
                  ? '/micro_theatre_two/web/static/images/circle-icon.png'
                  : '/micro_theatre_two/web/static/images/circle-off-icon.png')
              "
              class="radio-icon"
              mode="aspectFit"
            ></image>
            <text class="pay-way-text">{{ getPayWayDisplayText(item) }}</text>
          </view>
        </scroll-view>
      </view>
      <view class="pay-way-bottom">
        <view class="pay-way-btn-row" v-if="showAdUnlockUi">
          <view class="pay-way-btn ghost-btn" @click="handleWatchAd">
            <text class="pay-way-btn-text">观看广告解锁</text>
          </view>
          <view class="pay-way-btn primary-btn" @click="submitOrderAndPay">
            <text class="pay-way-btn-text pay-way-btn-text--primary">立即订阅</text>
          </view>
        </view>
        <view class="pay-way-btn-row pay-way-btn-row-single" v-else>
          <view
            class="pay-way-btn primary-btn pay-way-btn-full"
            @click="submitOrderAndPay"
          >
            <text class="pay-way-btn-text pay-way-btn-text--primary">立即订阅</text>
          </view>
        </view>
        <view
          class="auto-unlock-tips"
          v-if="showAdUnlockUi && autoAdNavigateTotal > 0"
        >
          <text
            class="countdown"
            :class="{ 'countdown--small': unlockCountdownSmall }"
          >{{ autoAdJumpCountdown || autoAdNavigateTotal }}秒</text>
          <text class="auto-unlock-tips-rest">后自动跳转广告页</text>
        </view>
      </view>
    </view>
    <!--选择订阅方式end-->
  </view>
</template>

<script>
import empty from "@/micro_theatre_two/components/empty/empty.vue";
import url from "@/utils/request.js";
import store from "@/store";
import * as globalData from "@/utils/config";
import { payPathLog } from "@/micro_theatre_two/utils/pay_path_log.js";
import { savePlayVideoSimplePayResume } from "@/micro_theatre_two/utils/pay_return_resume.js";

function getMtUserId() {
  const u = store.state.vuex_user;
  return (u && u.user_id) || 0;
}

// 内联的微剧场资源域名兜底：vuex_apiUrl 优先，其次兜底 globalData.apiUrl，并去掉末尾 /
function getMicroTheatreApiBase(vm) {
  const u =
    vm && vm.vuex_apiUrl != null && vm.vuex_apiUrl !== ""
      ? vm.vuex_apiUrl
      : globalData.apiUrl || "";
  return String(u).replace(/\/+$/, "");
}

export default {
  components: {
    empty,
  },
  props: {
    // 短剧ID（外层传入，便于统一下单）
    dramaId: {
      type: [String, Number],
      default: "",
    },
    // 当前集数（单集订阅时使用）
    currentEpisode: {
      type: [String, Number],
      default: 1,
    },
    // 用户ID（外层从 globalData 传进来）
    userId: {
      type: [String, Number],
      default: "",
    },
    // 可选：短剧基础信息，展示名称/总集数（由外层接口统一传入）
    dramaInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    // 单集/整剧弹窗中需要的剧集列表（由外层接口统一传入）
    episodeList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 前 N 集免费（已废弃：业务固定为 0，保留 prop 兼容旧调用）
    freeEpisodeCount: {
      type: Number,
      default: 0,
    },
    // 订阅方式列表由外层传入，形如 [{ label: '现金支付', code: 'cash' }, ...]
    payWays: {
      type: Array,
      default() {
        return [];
      },
    },
    // 自动广告解锁倒计时（秒）
    autoUnlockSeconds: {
      type: [Number, String],
      default: 3,
    },
    // 如果带着 buy_num 直接打开订阅弹窗，则不展示选集，只按指定集数进行单集订阅
    forceSingleEpisode: {
      type: Boolean,
      default: false,
    },
    // 是否在弹窗打开时，直接展示“订阅方式选择”层
    startWithPayWay: {
      type: Boolean,
      default: false,
    },
    // 当前播放进度（秒）：用于“观看广告解锁”跳转广告页时回传 resume_time
    currentTime: {
      type: [Number, String],
      default: 0,
    },
    // 详情页「订阅/订阅」入口：不展示广告解锁
    hideAdUnlock: {
      type: Boolean,
      default: false,
    },
    // 打开订阅方式层后，若广告已开启，经过该秒数自动跳转广告页（0 表示不自动跳转）
    autoAdNavigateSeconds: {
      type: [Number, String],
      default: 10,
    },
    // 播放页等窄弹窗：缩小「N秒后自动跳转广告页」中的数字字号
    unlockCountdownSmall: {
      type: Boolean,
      default: false,
    },
    /**
     * App/小程序收银台订阅完成后的 uni 回跳路径（须以 / 开头，在分包内）。
     * 不传则默认回剧详：/micro_theatre_two/pages/playlet_info/playlet_info?id=
     */
    payReturnPath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      http_host: "",
      customer_id: 0,
      currentBuyType: 2, // 1=单集｜2=整集
      showAddress: false,
      showPayWay: false, // 是否显示订阅方式
      // 内部兜底的订阅方式文案（方便本地联调，无真实金额）
      payWayList: [
        { label: "现金支付", code: "method_1" },
        { label: "观影券订阅", code: "method_2" },
      ],
      // 后端订阅设置（按单集/整剧区分）
      backendPayWaysEpisode: [],
      backendPayWaysFullDrama: [],
      // 当前选中的订阅方式 code（统一用 code 标识）
      selectedPayWayCode: "",
      addressInfo: {
        id: -1,
      },
      // 组件内部通过接口获取到的短剧信息 / 剧集列表
      innerDramaInfo: {},
      innerEpisodeList: [],
      // 接口分页信息
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      totalPage: 1,
      // 后台是否配置了广告素材（与 advert_video_random_get 判定一致）
      adUnlockBackendEnabled: false,
      // 用户订阅状态（与 play_video_simple / get_user_purchase_status 一致）
      userWholeDramaPurchased: false,
      userPurchasedEpisodesMap: {},
      // 订阅方式层：自动跳转广告页倒计时（秒），0 表示未在计时
      autoAdJumpCountdown: 0,
      autoAdJumpIntervalId: null,
      /** index_data.get_ad_setting → data.ad_setting */
      adSetting: {},
      _adSettingLoadPromise: null,
      adUnlockInFlight: false,
      /** 与 public/pages/task/task.vue 激励写法一致 */
      _rewardedVideoAdBuy: null,
      _isRewardedBuyLoaded: false,
      /** 待第三方订阅：服务端确认的实付金额与订阅参数，用于展示与防串单 */
      pendingPayData: null,
    };
  },
  computed: {
    /** 详情页等入口不展示广告解锁；其它入口依后台是否配置广告素材 */
    showAdUnlockUi() {
      if (this.hideAdUnlock) return false;
      return !!this.adUnlockBackendEnabled;
    },
    /** 自动跳转广告页的倒计时时长（秒），≤0 不启用 */
    autoAdNavigateTotal() {
      const n = Number(this.autoAdNavigateSeconds);
      if (!Number.isFinite(n) || n <= 0) return 0;
      return Math.min(Math.floor(n), 300);
    },
    ticketName() {
      try {
        return uni.getStorageSync("recharge_ticket_name") || "观影券";
      } catch (e) {
        return "观影券";
      }
    },
    /** 前 N 集免费（由父组件 freeEpisodeCount 传入，默认 0） */
    effectiveFreeEpisodeCount() {
      const n = Number(this.freeEpisodeCount);
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    },
    // 当前分页下要展示的剧集列表（直接使用接口当前页返回的数据）
    visibleEpisodes() {
      return this.innerEpisodeList || [];
    },
    // 按页生成分段文案：1-20 / 21-40 / ...
    pageSegments() {
      const segments = [];
      const pageSize = this.pageSize || 20;
      const totalPage = this.totalPage || 1;
      if (pageSize <= 0 || totalPage <= 1) return segments;

      // 分段标签以接口返回的剧集条数为准，不用短剧表里的计划「总集数」
      const totalEpisodes = Number(this.totalCount) || pageSize * totalPage;

      for (let p = 1; p <= totalPage; p++) {
        const start = (p - 1) * pageSize + 1;
        const end = Math.min(p * pageSize, totalEpisodes);
        segments.push({
          page: p,
          label: `${start}-${end}`,
        });
      }
      return segments;
    },
    // 短剧封面：优先用传入/接口返回的 dramaInfo.cover_image，其次用静态占位图
    dramaCover() {
      const cover = this.innerDramaInfo && this.innerDramaInfo.cover_image;
      if (cover) return cover;
      return this.http_host + "/micro_theatre_two/web/static/images/cover.png";
    },
    // 短剧名称
    dramaName() {
      return (this.innerDramaInfo && this.innerDramaInfo.name) || "短剧名称";
    },
    // 集数文案，例如 “全集20集”（优先接口剧集总数，与计划总集数脱钩）
    dramaEpisodesText() {
      const total =
        Number(this.totalCount) ||
        (this.innerDramaInfo &&
          (Number(this.innerDramaInfo.total_episodes) ||
            Number(this.innerDramaInfo.episodes_count))) ||
        0;
      if (!total) return "全集";
      return `全集${total}集`;
    },
    // 当前集的剧集信息（按 episode_order 匹配；列表源与广告解锁一致，优先父组件全量集避免分页错价）
    currentEpisodeInfo() {
      const list = this.effectiveEpisodeListForAd || [];
      const epNo = Number(this.currentEpisode) || 1;
      if (!Array.isArray(list) || list.length === 0) return null;
      const found = list.find((e) => Number(e.episode_order) === epNo);
      if (found) return found;
      const idx = epNo - 1;
      if (idx >= 0 && idx < list.length) return list[idx];
      return list[0] || null;
    },
    payAmountText() {
      const num = Number(this.baseAmountNumber) || 0;
      return `¥${num.toFixed(2)}`;
    },
    // 当前订阅类型对应的“原价数值”（用于计算各订阅方式币种数量）
    baseAmountNumber() {
      const pend = this.pendingPayData;
      if (pend && pend.amount_rmb != null && pend.amount_rmb !== "") {
        const fixed = Number(pend.amount_rmb);
        if (Number.isFinite(fixed) && fixed > 0) {
          return Math.max(0, fixed);
        }
      }
      let amount = 0;
      if (this.currentBuyType === 1) {
        const ep = this.currentEpisodeInfo;
        if (ep) {
          const unit =
            ep.episodes_price != null && ep.episodes_price !== ""
              ? ep.episodes_price
              : ep.price;
          amount = Number(unit) || 0;
        }
      } else if (this.currentBuyType === 2) {
        const price =
          (this.innerDramaInfo && this.innerDramaInfo.drama_price) ||
          (this.innerDramaInfo && this.innerDramaInfo.price) ||
          0;
        amount = Number(price) || 0;
      }
      // 统一确保非负
      return Math.max(0, Number(amount) || 0);
    },
    // 订阅方式优先使用父组件传入的 payWays，退化到本地默认列表
    displayPayWayList() {
      const fromProps = Array.isArray(this.payWays) ? this.payWays : [];
      const fromBackend =
        this.currentBuyType === 1
          ? this.backendPayWaysEpisode
          : this.backendPayWaysFullDrama;
      const fallback = Array.isArray(this.payWayList) ? this.payWayList : [];

      const source =
        fromProps && fromProps.length > 0
          ? fromProps
          : fromBackend && fromBackend.length > 0
            ? fromBackend
            : fallback;

      const normalized = source.map((item, idx) => ({
        label: item.label || "",
        code: item.code || item.method || idx,
        config: item.config || {},
      }));

      const firstCode = normalized[0] ? normalized[0].code : "";
      const activeCode = this.selectedPayWayCode || firstCode;
      return normalized.map((item) => ({
        ...item,
        checked: String(item.code) === String(activeCode),
      }));
    },
    mergedDramaInfo() {
      const a =
        this.dramaInfo && typeof this.dramaInfo === "object"
          ? this.dramaInfo
          : {};
      const b =
        this.innerDramaInfo && typeof this.innerDramaInfo === "object"
          ? this.innerDramaInfo
          : {};
      return Object.assign({}, a, b);
    },
    /** 优先用父组件传入的全量列表，否则用接口分页列表（激励/日志字段兜底） */
    effectiveEpisodeListForAd() {
      const fromProps = Array.isArray(this.episodeList) ? this.episodeList : [];
      if (fromProps.length > 0) return fromProps;
      return Array.isArray(this.innerEpisodeList) ? this.innerEpisodeList : [];
    },
    useRemoteAdSettingUnlock() {
      const s = this.adSetting || {};
      if (Number(s.ad_enable) !== 1) return false;
      return this.normalizeAdTypesFromSetting(s).length > 0;
    },
    remoteAdTypesDeclared() {
      const s = this.adSetting || {};
      if (Number(s.ad_enable) !== 1) return [];
      return this.normalizeAdTypesFromSetting(s)
        .map((t) => String(t || "").trim())
        .filter((t) => t === "local" || t === "tencent_vod");
    },
    localAdUnlockAllowed() {
      if (!this.useRemoteAdSettingUnlock) return true;
      return this.remoteAdTypesDeclared.includes("local");
    },
    adUnlockRandomEffective() {
      const d = this.mergedDramaInfo || {};
      const m = String(
        d.unlock_mode || d.ad_unlock_mode || d.unlock_ad_mode || "",
      ).toLowerCase();
      return m === "random";
    },
    adUnlockRewardedProbability() {
      const d = this.mergedDramaInfo || {};
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
  },
  watch: {
    // 当外层通过 buy_num 切换为“强制单集订阅”时，自动切到单集并直接展示订阅方式层
    forceSingleEpisode(val) {
      if (val) {
        this.currentBuyType = 1;
        this.showPayWay = true;
      }
    },
    currentBuyType() {
      this.pendingPayData = null;
      // 切换单集/整剧时，重置选中订阅方式（优先用当前类型的第一项）
      const list =
        this.currentBuyType === 1
          ? this.backendPayWaysEpisode
          : this.backendPayWaysFullDrama;
      if (Array.isArray(list) && list.length > 0) {
        this.selectedPayWayCode = list[0].code || list[0].method || "";
      } else if (Array.isArray(this.payWays) && this.payWays.length > 0) {
        this.selectedPayWayCode = this.payWays[0].code || "";
      } else if (Array.isArray(this.payWayList) && this.payWayList.length > 0) {
        this.selectedPayWayCode = this.payWayList[0].code || "";
      } else {
        this.selectedPayWayCode = "";
      }
    },
    dramaId() {
      if (this.dramaId) {
        this.fetchPurchaseStatus();
      }
    },
    showPayWay(val) {
      if (val) {
        this.pendingPayData = null;
        this.$nextTick(() => this.tryStartAutoAdJump());
      } else {
        this.pendingPayData = null;
        this.clearAutoAdJumpTimer();
      }
    },
    showAdUnlockUi(val) {
      if (val && this.showPayWay) {
        this.$nextTick(() => this.tryStartAutoAdJump());
      }
      if (!val) {
        this.clearAutoAdJumpTimer();
      }
    },
  },
  beforeDestroy() {
    this.clearAutoAdJumpTimer();
  },
  created() {
    this.http_host = getMicroTheatreApiBase(this);
    this.customer_id = this.vuex_customer_id;
    // 更新兜底文案中的“观影券”展示名称
    if (Array.isArray(this.payWayList)) {
      this.payWayList = this.payWayList.map((it) => {
        if (it && String(it.code) === "method_2") {
          return { ...it, label: `${this.ticketName}订阅` };
        }
        return it;
      });
    }
    console.log("[buyMovie] 收到的 props：", {
      dramaId: this.dramaId,
      dramaInfo: this.dramaInfo,
      episodeList: this.episodeList,
      freeEpisodeCount: this.freeEpisodeCount,
      payWays: this.payWays,
      autoUnlockSeconds: this.autoUnlockSeconds,
      forceSingleEpisode: this.forceSingleEpisode,
      currentEpisode: this.currentEpisode,
      hideAdUnlock: this.hideAdUnlock,
    });

    // 先用外层已拉取的详情兜底整剧价等，避免接口返回前底部显示 ¥0.00
    if (this.dramaInfo && typeof this.dramaInfo === "object") {
      const keys = Object.keys(this.dramaInfo);
      if (keys.length) {
        this.innerDramaInfo = { ...this.innerDramaInfo, ...this.dramaInfo };
      }
    }

    // 统一通过接口获取短剧详情和剧集列表
    if (this.dramaId) {
      this.fetchDramaDetail();
      this.fetchEpisodeList();
      this.fetchPurchaseStatus();
    }
    this.pay_style();
    if (!this.hideAdUnlock) {
      this.fetchAdUnlockEnabled();
      this.getAdSetting();
    }

    // 播放页进入：默认选中“单集订阅”，并以当前播放集为准
    if (!this.forceSingleEpisode) {
      this.currentBuyType = 1;
    } else {
      // buy_num 入口：强制单集订阅并直接展示订阅方式层
      this.currentBuyType = 1;
      this.showPayWay = true;
    }

    // 如果外层要求“默认直接展示订阅方式层”，则在创建后立即打开订阅方式选择
    if (this.startWithPayWay) {
      this.showPayWay = true;
    }
  },
  mounted() {
    this.http_host = getMicroTheatreApiBase(this);
  },
  methods: {
    // 按百分比计算币种数量（保留两位小数）
    calcAmountByRatio(ratio) {
      const r = Number(ratio);
      if (!Number.isFinite(r) || r <= 0) return "0.00";
      const base = this.baseAmountNumber || 0;
      // ratio 约定为百分比（0-100）
      const val = (base * r) / 100;
      const n = Number(val) || 0;
      return n.toFixed(2);
    },
    // 订阅方式展示文案：在每种币种后追加数量（原价 * 百分比）
    getPayWayDisplayText(item) {
      const code = item && item.code ? String(item.code) : "";
      const conf = (item && item.config) || {};
      if (!code) return (item && item.label) || "";

      const cash = this.calcAmountByRatio(conf.cash_ratio);
      const ticket = this.calcAmountByRatio(conf.ticket_ratio);
      const shop = this.calcAmountByRatio(conf.shop_ratio);
      const points = this.calcAmountByRatio(conf.points_ratio);

      // 按方法组合显示
      if (code === "method_1") {
        return `现金支付（${cash}）`;
      }
      if (code === "method_2") {
        return `${this.ticketName}支付（${ticket}）`;
      }
      if (code === "method_3") {
        return `现金支付（${cash}）+购物券支付（${shop}）`;
      }
      if (code === "method_4") {
        return `现金支付（${cash}）+积分支付（${points}）`;
      }

      // 未知方法：退化为 label +（现金/券/积分）拼接
      const parts = [];
      if (Number(cash) > 0) parts.push(`现金支付（${cash}）`);
      if (Number(ticket) > 0) parts.push(`${this.ticketName}支付（${ticket}）`);
      if (Number(shop) > 0) parts.push(`购物券支付（${shop}）`);
      if (Number(points) > 0) parts.push(`积分支付（${points}）`);
      if (parts.length) return parts.join("+");
      return (item && item.label) || "";
    },
    // 使用后端接口获取短剧详情
    fetchDramaDetail() {
      const id = this.dramaId;
      if (!id) return;
      url
        .request(
          "/micro_theatre_two/web/index.php?m=index_data&a=drama_detail",
          { id },
          "POST",
        )
        .then((res) => {
          if (res && res.errcode == 0 && res.data && res.data.info) {
            this.innerDramaInfo = res.data.info || {};
          }
        })
        .catch((e) => {
          console.error("获取短剧详情失败:", e);
        });
    },
    // 使用后端接口获取剧集列表
    fetchEpisodeList() {
      const id = this.dramaId;
      if (!id) return;
      url
        .request(
          "/micro_theatre_two/web/index.php?m=index_data&a=episode_list",
          {
            drama_id: id,
            page: this.currentPage,
            page_size: this.pageSize,
          },
          "POST",
        )
        .then((res) => {
          if (res && res.errcode == 0 && res.data) {
            const data = res.data || {};
            const list = data.list || [];
            this.innerEpisodeList = list;

            // 同步分页信息
            const total = Number(data.count) || 0;
            const pageSize = Number(data.page_size) || this.pageSize || 20;
            const page = Number(data.page) || this.currentPage || 1;
            const pageCount =
              Number(data.pageCount) ||
              (pageSize > 0 ? Math.ceil(total / pageSize) : 1);

            this.totalCount = total;
            this.pageSize = pageSize;
            this.currentPage = page;
            this.totalPage = pageCount;
          }
        })
        .catch((e) => {
          console.error("获取剧集列表失败:", e);
        });
    },
    /** 单集在选集区是否显示锁：免费集(fee_type=1 / is_charged=2)不锁 */
    isEpisodeLockedInBuy(ep) {
      const order = Number(
        ep && ep.episode_order != null ? ep.episode_order : 0,
      );
      if (!Number.isFinite(order) || order <= 0) return false;
      if (ep && typeof ep === "object") {
        if (Number(ep.fee_type) === 1) return false;
        if (Number(ep.is_charged) === 2) return false;
      }
      if (this.userWholeDramaPurchased) return false;
      if (this.userPurchasedEpisodesMap[Math.floor(order)]) return false;
      const free = this.effectiveFreeEpisodeCount;
      if (free > 0 && order <= free) return false;
      return true;
    },
    fetchPurchaseStatus() {
      if (!this.dramaId) return Promise.resolve();
      return url
        .request(
          "/micro_theatre_two/web/index.php?m=order_data&a=get_user_purchase_status",
          { drama_id: this.dramaId },
          "POST",
        )
        .then((res) => {
          if (res && res.errcode == 0 && res.data) {
            const d = res.data || {};
            this.userWholeDramaPurchased =
              Number(d.is_whole_drama_purchased) === 1;
            const eps = Array.isArray(d.purchased_episodes)
              ? d.purchased_episodes
              : [];
            const map = {};
            eps.forEach((v) => {
              const n = Number(v);
              if (Number.isFinite(n) && n > 0) map[Math.floor(n)] = true;
            });
            this.userPurchasedEpisodesMap = map;
          }
        })
        .catch(() => {});
    },
    // 后台是否配置了可用广告（用于订阅弹窗是否显示「观看广告解锁」）
    fetchAdUnlockEnabled() {
      return url
        .request(
          "/micro_theatre_two/web/index.php?m=index_data&a=ad_unlock_enabled",
          {},
          "POST",
        )
        .then((res) => {
          if (res && res.errcode == 0 && res.data) {
            this.adUnlockBackendEnabled = Number(res.data.enabled) === 1;
          } else {
            this.adUnlockBackendEnabled = false;
          }
          this.$nextTick(() => this.tryStartAutoAdJump());
        })
        .catch(() => {
          this.adUnlockBackendEnabled = false;
        });
    },
    // 获取订阅设置（单集/整剧两套），并初始化当前选中订阅方式
    pay_style() {
      return url
        .request(
          "/micro_theatre_two/web/index.php?m=index_data&a=pay_style",
          {
            drama_id: this.dramaId,
          },
          "POST",
        )
        .then((res) => {
          if (res && res.errcode == 0 && res.data) {
            const data = res.data || {};
            this.backendPayWaysEpisode = data.episode_pay_ways || [];
            this.backendPayWaysFullDrama = data.full_drama_pay_ways || [];

            // 初始化默认选中项：优先当前类型的第一项
            const list =
              this.currentBuyType === 1
                ? this.backendPayWaysEpisode
                : this.backendPayWaysFullDrama;
            if (Array.isArray(list) && list.length > 0) {
              this.selectedPayWayCode = list[0].code || list[0].method || "";
            } else if (Array.isArray(this.payWays) && this.payWays.length > 0) {
              this.selectedPayWayCode = this.payWays[0].code || "";
            } else if (
              Array.isArray(this.payWayList) &&
              this.payWayList.length > 0
            ) {
              this.selectedPayWayCode = this.payWayList[0].code || "";
            } else {
              this.selectedPayWayCode = "";
            }
          }
        })
        .catch((e) => {
          console.error("获取订阅方式失败:", e);
        });
    },
    // 选择某一集进行单集订阅
    handleSelectEpisode(ep) {
      const epNo = Number(ep.episode_order) || 1;
      // 内部直接更新 currentEpisode 用于价格和高亮
      this.currentEpisode = epNo;
    },
    // 切换接口分页页码（传入目标页码）
    changeEpisodePage(targetPage) {
      const page = Number(targetPage) || 1;
      if (page === this.currentPage) return;
      if (page < 1 || page > this.totalPage) return;
      this.currentPage = page;
      this.fetchEpisodeList();
    },
    // 选择订阅数量
    changeNum(status) {
      if (status === 0) {
        if (this.value === 0) return;
        this.value--;
      } else {
        this.value++;
      }
    },
    // 切换订阅类型
    handleChangeType(type) {
      this.currentBuyType = type;
    },
    // 关闭弹窗
    handleClose() {
      this.clearAutoAdJumpTimer();
      this.$emit("close");
    },
    // 打开 / 关闭 订阅方式层
    showPayWayPop() {
      this.showPayWay = !this.showPayWay;
    },
    // 统一向外抛出“下单意图”，由外层页面真正调后端接口
    submitOrder() {
      const activePay =
        this.displayPayWayList.find((item) => item.checked) ||
        this.displayPayWayList[0] ||
        null;

      const payload = {
        dramaId: this.dramaId,
        userId: this.userId,
        currentEpisode: Number(this.currentEpisode) || 1,
        buyType: this.currentBuyType, // 1=单集 2=整剧
        shareNum: 0,
        payWay: activePay ? activePay.code || activePay.label : "",
        payWayConfig: activePay ? activePay.config || {} : {},
      };

      // 通知外层：“用户点了立即订阅”，由外层去调后端订阅接口
      this.$emit("submit", payload);
    },
    // 在组件内完成：下单 + 拉起订阅（参考海外版订阅流程）
    submitOrderAndPay() {
      this.clearAutoAdJumpTimer();
      const activePay =
        this.displayPayWayList.find((item) => item.checked) ||
        this.displayPayWayList[0] ||
        null;

      if (!this.dramaId) {
        uni.showToast({ title: "短剧ID缺失", icon: "none" });
        return;
      }
      if (!activePay) {
        uni.showToast({ title: "暂无可用订阅方式", icon: "none" });
        return;
      }

      // 永远只下单一次：仅在“立即订阅”点击时请求 orders_add
      this.createOrderAndHandleResult(activePay);
    },
    // 统一下单，并根据返回决定“直扣解锁”还是“平台订阅跳转”
    createOrderAndHandleResult(activePay) {
      this.pendingPayData = null;
      const type = Number(this.currentBuyType) || 1;
      const amount = this.baseAmountNumber || 0;
      // POST 为 application/x-www-form-urlencoded 时，数组 episodes: [1] 常被序列化失败，
      // PHP 收不到数组会报「请选择要订阅的集数」。使用 episodes[0] 键名与 JSON 字符串 pay_config。
      const postData = {
        type,
        drama_id: this.dramaId,
        amount,
        pay_type: activePay.code || "",
        pay_config: JSON.stringify(activePay.config || {}),
      };
      if (type === 1) {
        const ep = Number(this.currentEpisode) || 1;
        postData["episodes[0]"] = ep;
      }

      uni.showLoading({ title: "处理中...", mask: true });
      url
        .request(
          "/micro_theatre_two/web/index.php?m=order_data&a=orders_add",
          postData,
          "POST",
        )
        .then((res) => {
          uni.hideLoading();
          if (res && res.errcode == 0) {
            // 观影券等“直扣直解锁”场景：无 pay_url 但订单已完成
            if (
              res.data &&
              Number(res.data.payment_status) === 2 &&
              !res.data.pay_url
            ) {
              uni.showToast({
                title: res.errmsg || "订阅成功",
                icon: "success",
                duration: 1500,
              });
              const payload = {
                message: res.errmsg || "订阅成功",
                paymentMethod: activePay.code || "",
                order_number: res.data.order_number || "",
              };
              this.fetchPurchaseStatus().finally(() => {
                this.$emit("purchase-success", payload);
                this.$emit("close");
              });
              return;
            }

            // 返回 pay_url/pay_param 时，直接拉起订阅
            if (res.data && res.data.pay_url) {
              const sentAmount = Number(amount) || 0;
              this.pendingPayData = {
                ...res.data,
                amount_rmb:
                  res.data.amount_rmb != null && res.data.amount_rmb !== ""
                    ? res.data.amount_rmb
                    : sentAmount,
              };
              payPathLog(this, "下单成功，服务端返回订阅参数，即将进入订阅流程", {
                pay_url: res.data.pay_url,
                pay_type: res.data.pay_type,
                order_number: res.data.order_number || "",
                batchcode: res.data.batchcode || "",
              });
              this.handlePaymentFlow(res.data, activePay);
              return;
            }
            // 没有订阅参数，视为下单成功/已完成
            uni.showToast({
              title: res.errmsg || "下单成功",
              icon: "success",
              duration: 1500,
            });
            const payload2 = {
              message: res.errmsg || "下单成功",
              paymentMethod: activePay.code || "",
            };
            this.fetchPurchaseStatus().finally(() => {
              this.$emit("purchase-success", payload2);
            });
          } else {
            uni.showToast({
              title: (res && res.errmsg) || "下单失败",
              icon: "none",
              duration: 2000,
            });
          }
        })
        .catch((e) => {
          uni.hideLoading();
          console.error("下单失败:", e);
          uni.showToast({
            title: "网络异常，请重试",
            icon: "none",
            duration: 2000,
          });
        });
    },
    /** 订阅完成回跳的 uni 页路径（与 app_pay/callback 或 PHP callback 一致） */
    buildAppPayCallbackPath() {
      const custom = String(this.payReturnPath || "").trim();
      if (custom) {
        return custom.charAt(0) === "/" ? custom : "/" + custom;
      }
      const dramaId =
        (this.innerDramaInfo && this.innerDramaInfo.id) || this.dramaId || "";
      return (
        "/micro_theatre_two/pages/playlet_info/playlet_info?id=" +
        encodeURIComponent(String(dramaId))
      );
    },
    /**
     * 原生 App：PHP 桥相对路径（WebView 直开 H5 时用）；日常优先走 uni 页 app_pay/pay。
     */
    buildAppPayBridgeRelativeUrl(orderBatch) {
      const batch = String(orderBatch || "").trim();
      if (!batch) return "";
      const callbackPath = this.buildAppPayCallbackPath();
      const rel =
        "/micro_theatre_two/web/index.php?m=app_pay&a=pay" +
        "&batchcode=" +
        encodeURIComponent(batch) +
        "&callback_path=" +
        encodeURIComponent(callbackPath) +
        "&order_type=" +
        encodeURIComponent("orders_add");
      payPathLog(this, "构造 App 内 WebView 直开 PHP 订阅桥的相对 URL（含 batchcode、callback_path）", {
        相对路径: rel,
        batchcode: batch,
        callback_path解码参考: callbackPath,
      });
      return rel;
    },
    /** App 订阅桥 URL 附带用户所选订阅方式（pay_type 数字 1-4，与订单表一致） */
    appendAppPayMethodQuery(url, activePay) {
      let u = String(url || "");
      const ap = activePay || {};
      const code = ap.code ? String(ap.code).trim() : "";
      const m = code.match(/^method_([1-4])$/i);
      const bizType = m ? m[1] : code && /^[1-4]$/.test(code) ? code : "1";
      u +=
        (u.indexOf("?") >= 0 ? "&" : "?") +
        "pay_type=" +
        encodeURIComponent(bizType);
      return u;
    },
    // 订阅流程：H5 表单 / 小程序公共收银台 / App 走 app_pay 桥接 WebView（对齐 test_project）
    handlePaymentFlow(payData, activePay) {
      if (!payData) {
        uni.showToast({ title: "订阅参数异常", icon: "none" });
        return;
      }

      savePlayVideoSimplePayResume(this.buildAppPayCallbackPath());

      payPathLog(this, "订阅流程分支判断：pay_type≠1 走表单/WebView；pay_type=1 直连 pay_url", {
        pay_type: payData.pay_type,
        has_pay_url: !!payData.pay_url,
        order_number: payData.order_number || "",
        batchcode: payData.batchcode || "",
      });

      // pay_type != 1：表单提交；pay_type == 1：直接跳转 pay_url
      if (!payData.pay_type || payData.pay_type != 1) {
        /* #ifdef H5 */
        payPathLog(this, "【H5】使用表单 POST 提交至收银台（当前页跳转，无 callback_path 由浏览器完成）", {
          form_action: payData.pay_url,
        });
        try {
          var objform = document.createElement("form");
          document.body.appendChild(objform);
          var params = payData.pay_param || {};
          for (var x in params) {
            var opt = document.createElement("input");
            opt.type = "hidden";
            opt.name = x;
            opt.value = params[x];
            objform.appendChild(opt);
          }
          objform.action = payData.pay_url;
          objform.method = "POST";
          objform.submit();
        } catch (e) {
          console.error("H5 订阅跳转失败:", e);
          uni.showToast({ title: "订阅跳转失败", icon: "none" });
        }
        /* #endif */

        /* #ifdef MP-WEIXIN */
        const app = getApp();
        let backUrl = this.buildAppPayCallbackPath();
        if (app && app.globalData) {
          app.globalData.pay_data = payData.pay_param;
        }
        let app_url = {
          listurl: encodeURIComponent(backUrl),
          mark: "micro_theatre_two",
          back_page_type: "drama_purchase_pay",
        };
        const mpNav =
          "/public/pages/pay/payMethod/payMethod?from=drama_purchase&app_url=" +
          JSON.stringify(app_url);
        payPathLog(this, "【微信小程序】跳转公共收银台；订阅完成后 listurl 回短剧页", {
          回跳短剧页路径: backUrl,
          实际navigate字符串: mpNav,
        });
        uni.redirectTo({
          url: mpNav,
          fail: function () {
            uni.showToast({ title: "跳转订阅失败", icon: "none" });
          },
        });
        /* #endif */

        /* #ifdef APP-PLUS */
        const orderBatch =
          (payData.order_number && String(payData.order_number).trim()) ||
          (payData.batchcode && String(payData.batchcode).trim()) ||
          "";
        if (orderBatch) {
          const cb = this.buildAppPayCallbackPath();
          if (cb) {
            payPathLog(this, "【App】回跳路径 callback_path（解码后明文，将写入 pay 页 query）", {
              callback_path: cb,
              dramaId: String(this.dramaId),
            });
            let payPagePath =
              "/micro_theatre_two/pages/app_pay/pay?batchcode=" +
              encodeURIComponent(orderBatch) +
              "&callback_path=" +
              encodeURIComponent(cb) +
              "&order_type=" +
              encodeURIComponent("orders_add");
            payPagePath = this.appendAppPayMethodQuery(payPagePath, activePay);
            payPathLog(this, "【App】跳转分包订阅桥页 app_pay/pay，由该页再打开 WebView 加载 PHP", {
              uni_navigate路径: payPagePath,
              batchcode: orderBatch,
              callback_path解码参考: cb,
            });
            uni.navigateTo({
              url: payPagePath,
              fail: function () {
                uni.showToast({ title: "跳转订阅失败", icon: "none" });
              },
            });
            return;
          }
        }
        if (payData.pay_url) {
          const wv =
            "/pages/webview/webview?weburl=" +
            encodeURIComponent(payData.pay_url);
          payPathLog(this, "【App】无有效订单号，退回仅打开 webview 加载 pay_url（未走 app_pay 桥）", {
            uni_navigate路径: wv,
            pay_url: payData.pay_url,
          });
          uni.navigateTo({
            url: wv,
            fail: function () {
              uni.showToast({ title: "跳转订阅失败", icon: "none" });
            },
          });
        }
        /* #endif */
      } else {
        /* #ifdef H5 */
        payPathLog(this, "【H5】pay_type=1，整页跳转 pay_url", {
          pay_url: payData.pay_url,
        });
        window.location.href = payData.pay_url;
        /* #endif */

        /* #ifndef H5 */
        if (payData.pay_url) {
          const wv2 =
            "/pages/webview/webview?weburl=" +
            encodeURIComponent(payData.pay_url);
          payPathLog(this, "【非 H5】pay_type=1，打开 webview 加载 pay_url", {
            uni_navigate路径: wv2,
          });
          uni.navigateTo({
            url: wv2,
            fail: function () {
              uni.showToast({ title: "跳转订阅失败", icon: "none" });
            },
          });
        }
        /* #endif */
      }
    },
    // 切换选中的订阅方式
    setActivePayWay(index) {
      const list = this.displayPayWayList || [];
      const target = list[index];
      if (!target) return;
      this.selectedPayWayCode = target.code || target.label || "";
    },
    clearAutoAdJumpTimer() {
      if (this.autoAdJumpIntervalId != null) {
        clearInterval(this.autoAdJumpIntervalId);
        this.autoAdJumpIntervalId = null;
      }
      this.autoAdJumpCountdown = 0;
    },
    /**
     * 广告已开启且当前为订阅方式层时：autoAdNavigateTotal 秒后自动跳转广告页
     */
    tryStartAutoAdJump() {
      this.clearAutoAdJumpTimer();
      const total = this.autoAdNavigateTotal;
      if (total <= 0) return;
      if (!this.showPayWay || !this.showAdUnlockUi || !this.dramaId) return;

      this.autoAdJumpCountdown = total;
      this.autoAdJumpIntervalId = setInterval(() => {
        if (this.autoAdJumpCountdown <= 1) {
          this.clearAutoAdJumpTimer();
          this.handleWatchAd();
          return;
        }
        this.autoAdJumpCountdown--;
      }, 1000);
    },
    getAdSetting() {
      this._adSettingLoadPromise = url
        .request(
          "/micro_theatre_two/web/index.php?m=index_data&a=get_ad_setting&xdebug=xdebug",
          {},
          "POST",
        )
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
    ensureAdSettingLoaded() {
      if (!this._adSettingLoadPromise) {
        return this.getAdSetting();
      }
      return this._adSettingLoadPromise;
    },
    /**
     * 与 play_video_simple 一致：兼容 ad_type 单字段。
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
    /** 同 play_video_simple：含 ad_setting.tencent_app_id 作激励位 id */
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
      const d = this.mergedDramaInfo || {};
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
    unlockUserIdForCallback() {
      const id = getMtUserId();
      return id != null && id !== "" ? id : "";
    },
    /**
     * 与 play_video_simple.openAdUnlockByRemoteSetting 一致：
     * ad_types 里多种可播时在 local / tencent_vod 间随机。
     */
    openAdUnlockByRemoteSetting(episodeOrder, resumeTimeSec) {
      const declared = this.remoteAdTypesDeclared;
      const playable = this.getPlayableAdUnlockTypes();
      if (playable.length === 0) {
        if (declared.includes("tencent_vod")) {
          this.openInlineRewardedUnlockForBuy(episodeOrder, resumeTimeSec);
          return;
        }
        if (declared.includes("local") && this.localAdUnlockAllowed) {
          this.openAdUnlockAdvertPage(episodeOrder, resumeTimeSec);
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
          this.openAdUnlockAdvertPage(episodeOrder, resumeTimeSec);
        } else {
          this.openInlineRewardedUnlockForBuy(episodeOrder, resumeTimeSec);
        }
        return;
      }
      const pick = playable[Math.floor(Math.random() * playable.length)];
      if (pick === "local") {
        this.openAdUnlockAdvertPage(episodeOrder, resumeTimeSec);
      } else {
        this.openInlineRewardedUnlockForBuy(episodeOrder, resumeTimeSec);
      }
    },
    openRandomAdUnlockForBuy(episodeOrder, resumeTimeSec) {
      const p = this.adUnlockRewardedProbability;
      const wantRewarded = Math.random() < p;
      if (wantRewarded) {
        this.openInlineRewardedUnlockForBuy(episodeOrder, resumeTimeSec);
        return;
      }
      if (this.localAdUnlockAllowed) {
        this.openAdUnlockAdvertPage(episodeOrder, resumeTimeSec);
        return;
      }
      this.openInlineRewardedUnlockForBuy(episodeOrder, resumeTimeSec);
    },
    /**
     * @param bypassLocalPolicy 为 true 时跳过 remote ad_types 对 local 的限制（激励 adpid 未配置时的降级）
     */
    openAdUnlockAdvertPage(
      episodeOrder,
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
      const epNo = Math.max(1, Number(episodeOrder) || 1);
      const qs =
        `?drama_id=${encodeURIComponent(String(this.dramaId || ""))}` +
        `&episode=${encodeURIComponent(String(epNo))}` +
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
            title: "打开广告页失败",
            icon: "none",
          });
          return;
        }
        const pageUrl = bases[i] + qs;
        const api = useRedirect ? uni.redirectTo : uni.navigateTo;
        api.call(uni, {
          url: pageUrl,
          fail: (err) => {
            const msg = String((err && err.errMsg) || "");
            console.warn(
              "[buyMovie] openAdUnlockAdvertPage fail",
              pageUrl,
              msg,
            );
            if (!useRedirect && /limit|depth|webview|栈|层/i.test(msg)) {
              tryOpen(i, true);
              return;
            }
            tryOpen(i + 1, false);
          },
        });
      };
      tryOpen(0, false);
    },
    buildRewardedCloseContextForBuy(episodeOrder, resumeTimeSec = 0) {
      const list = this.effectiveEpisodeListForAd;
      const epNo = Math.max(1, Number(episodeOrder) || 1);
      const ep =
        (list || []).find((e) => Number(e.episode_order) === epNo) || {};
      const dramaIdForAd =
        this.dramaId ||
        ep.drama_id ||
        (this.mergedDramaInfo && this.mergedDramaInfo.id) ||
        "";
      const episodeOrderFinal = Math.max(
        1,
        Number(ep.episode_order != null ? ep.episode_order : epNo) || 1,
      );
      const resumeSec = Math.max(0, Math.floor(Number(resumeTimeSec) || 0));
      const dramaIdNum = Number(dramaIdForAd) || 0;
      return {
        resumeSec,
        dramaIdForAd,
        episodeOrder: episodeOrderFinal,
        dramaIdNum,
      };
    },
    handleRewardedVideoCloseForBuy(detail, ctx) {
      const isEnded = !!(detail && detail.isEnded);
      if (isEnded) {
        url
          .request(
            "/micro_theatre_two/web/index.php?m=index_data&a=advert_watch_log_add",
            {
              drama_id: ctx.dramaIdNum,
              episode: ctx.episodeOrder,
              watch_seconds: 1,
              ad_video_id: 0,
              play_type: "rewarded",
            },
            "POST",
          )
          .catch(() => {});
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
        try {
          uni.$emit("ad_unlock_success", payload);
        } catch (e) {
          // ignore
        }
        this.$emit("ad-unlock-success", payload);
        this.$emit("close");
      } else {
        this.adUnlockInFlight = false;
        uni.showToast({
          icon: "none",
          title: "未完整观看，未解锁",
        });
      }
    },
    /**
     * 对应 task.vue @click="show(index)"：观看激励（episode 为集数 1 起，不传则用 currentEpisode）。
     */
    showBuyRewardedWatch(episode) {
      if (this.adUnlockInFlight) return;
      const epNo =
        episode != null && episode !== "" && Number.isFinite(Number(episode))
          ? Math.max(1, Math.floor(Number(episode)))
          : Math.max(1, Number(this.currentEpisode) || 1);
      const resume = Math.max(0, Math.floor(Number(this.currentTime) || 0));
      console.log("[buyMovie] showBuyRewardedWatch", epNo, resume);
      this.openInlineRewardedUnlockForBuy(epNo, resume);
    },
    /**
     * 对应 task.vue showTask：onLoad / onError / onClose、load().then(show())。
     */
    openInlineRewardedUnlockForBuy(episodeOrder, resumeTimeSec = 0) {
      const ctx = this.buildRewardedCloseContextForBuy(
        episodeOrder,
        resumeTimeSec,
      );
      if (globalData.micro_theatre_rewarded_mock_success) {
        const mockCloseDetail = { isEnded: true };
        const logBody = {
          scene: "buy_movie_unlock",
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
        console.log("[buyMovie] 激励视频【模拟】视为看完", logBody);
        this.handleRewardedVideoCloseForBuy(mockCloseDetail, ctx);
        return;
      }
      const adpid = this.getRewardedVideoAdpid();
      const hasSdk = typeof uni.createRewardedVideoAd === "function";
      const canShowReal = !!(adpid && hasSdk);

      if (!canShowReal) {
        if (this.localAdUnlockAllowed) {
          this.openAdUnlockAdvertPage(episodeOrder, resumeTimeSec);
          return;
        }
        if (hasSdk && !adpid) {
          this.openAdUnlockAdvertPage(episodeOrder, resumeTimeSec, true);
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

      const epNo = ctx.episodeOrder;
      this._isRewardedBuyLoaded = false;
      this.adUnlockInFlight = true;
      const that = this;
      const rewardedVideoAd = (this._rewardedVideoAdBuy =
        uni.createRewardedVideoAd({
          adpid,
          urlCallback: {
            userId: this.unlockUserIdForCallback(),
            extra: {
              http_host: this.http_host,
              customer_id: this.customer_id,
              scene: "buy_movie_unlock",
              drama_id: ctx.dramaIdForAd,
              episode: epNo,
              resume_time: ctx.resumeSec,
            },
          },
        }));
      // H5 等环境可能导出 createRewardedVideoAd 但返回 undefined（控制台提示 not yet implemented）
      if (
        !rewardedVideoAd ||
        typeof rewardedVideoAd.onLoad !== "function" ||
        typeof rewardedVideoAd.load !== "function"
      ) {
        this.adUnlockInFlight = false;
        this._rewardedVideoAdBuy = null;
        if (this.localAdUnlockAllowed) {
          this.openAdUnlockAdvertPage(episodeOrder, resumeTimeSec);
          return;
        }
        this.openAdUnlockAdvertPage(episodeOrder, resumeTimeSec, true);
        return;
      }
      rewardedVideoAd.onLoad(() => {
        that._isRewardedBuyLoaded = true;
        console.log("[buyMovie] rewarded onLoad");
      });
      rewardedVideoAd.onError((err) => {
        console.log("[buyMovie] rewarded onError", err);
        that._isRewardedBuyLoaded = false;
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
        console.log("[buyMovie] rewarded onClose", res);
        if (res && res.isEnded) {
          console.log("正常播放结束", res.isEnded);
        } else {
          console.log("播放中途退出", res && res.isEnded);
        }
        const detail = { isEnded: !!(res && res.isEnded) };
        that.handleRewardedVideoCloseForBuy(detail, ctx);
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
          console.log("[buyMovie] load/show rejected", err);
        });
    },
    async handleWatchAd() {
      this.clearAutoAdJumpTimer();
      const epNo = Math.max(1, Number(this.currentEpisode) || 1);
      const resumeTime = Math.max(0, Math.floor(Number(this.currentTime) || 0));
      if (!this.dramaId) {
        uni.showToast({ title: "短剧ID缺失", icon: "none" });
        return;
      }
      if (this.adUnlockInFlight) return;
      try {
        await this.ensureAdSettingLoaded();
      } catch (e) {
        // ignore
      }
      if (this.useRemoteAdSettingUnlock) {
        this.openAdUnlockByRemoteSetting(epNo, resumeTime);
        return;
      }
      if (this.adUnlockRandomEffective) {
        this.openRandomAdUnlockForBuy(epNo, resumeTime);
        return;
      }
      this.showBuyRewardedWatch(epNo);
    },
  },
};
</script>

<style lang="scss" scoped>
.pop-box {
  background-color: #ffffff;
  padding: 0 !important;
  border-top-right-radius: 24rpx;
  border-top-left-radius: 24rpx;
  overflow: hidden;
  /* #ifdef APP-NVUE */
  flex: 1;
  width: 750rpx;
  /* #endif */

  .address-box {
    padding: 24rpx 24rpx 48rpx;

    .bnt-box {
      text-align: center;
      font-size: 30rpx;
      font-weight: bold;

      .bnt1 {
        border-radius: 16rpx;
        border: 2rpx solid #868582;
        box-sizing: border-box;
        background: #f4f6f8;
        height: 88rpx;
        line-height: 88rpx;
        margin-right: 24rpx;
        width: 256rpx;
      }

      .bnt2 {
        height: 88rpx;
        line-height: 88rpx;
        flex: 6;
        border-radius: 16rpx;
        background: linear-gradient(270deg, #0ff8ec 0%, #ffc654 100%);
      }
    }

    .no-address {
      height: 260rpx;
      color: #b9b8b6;
      font-size: 26rpx;
    }

    .address-group {
      background-color: white;
      border-radius: 24rpx;
      padding: 24rpx 70rpx 24rpx 24rpx;
      position: relative;
      margin: 48rpx 0;

      .arrow-box {
        position: absolute;
        right: 16rpx;
        top: 50%;
        z-index: 2;
        transform: translateY(-50%);
      }

      .row {
        color: #221f18;
        margin-bottom: 16rpx;

        .name {
          width: 70%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .address-info {
        font-size: 24rpx;
        color: #868582;
      }
    }

    .success-box {
      flex-direction: column;
      align-items: center;

      .ok-icon {
        width: 96rpx;
        height: 96rpx;
        margin-bottom: 10rpx;
      }

      .s-label {
        text-align: center;
        color: #229a16;
        font-size: 32rpx;
      }
    }
  }

  .pay-way-layout {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    /* #ifdef APP-NVUE */
    flex: 1;
    width: 750rpx;
    height: 100%;
    /* #endif */
  }

  .pay-way-header {
    display: flex;
    flex-direction: column;
    padding: 28rpx 32rpx 24rpx;
  }

  /* 标题与关闭同一行，避免整块 flex:1 与右侧按钮之间留空过大 */
  .pay-way-header-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .pay-way-title-text {
    flex: 1;
    min-width: 0;
    margin-right: 16rpx;
    color: #141414;
    font-size: 34rpx;
    font-weight: 700;
    line-height: 48rpx;
    lines: 2;
    text-overflow: ellipsis;
  }

  .pay-way-sub-tip {
    margin-top: 12rpx;
    color: #6b6b6b;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 38rpx;
    width: 100%;
    lines: 1;
    text-overflow: ellipsis;
  }

  .pay-way-close {
    flex-shrink: 0;
    width: 56rpx;
    height: 56rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .pay-way-close-arrow {
    font-size: 40rpx;
    color: #4a4a4a;
    line-height: 40rpx;
  }

  .pay-way-divider {
    height: 1rpx;
    margin: 0 32rpx;
    background-color: rgba(0, 0, 0, 0.08);
  }

  .pay-way-content {
    display: flex;
    flex-direction: column;
    padding: 28rpx 0 0;
    flex: 1;
    overflow: hidden;
  }

  .pay-way-label {
    padding: 0 32rpx;
    color: #1a1a1a;
    font-size: 28rpx;
    font-weight: 600;
    line-height: 40rpx;
    text-align: center;
  }

  .pay-way-list-scroll {
    width: 750rpx;
    margin-top: 16rpx;
    padding-top: 8rpx;
    padding-bottom: 8rpx;
    flex: 1;
  }

  .pay-way-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20rpx 32rpx;
  }

  .radio-icon {
    width: 40rpx;
    height: 40rpx;
  }

  .pay-way-text {
    flex: 1;
    margin-left: 20rpx;
    color: #1a1a1a;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 44rpx;
    lines: 1;
    text-overflow: ellipsis;
  }

  .pay-way-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 32rpx 24rpx;
  }

  .pay-way-btn-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 686rpx;
  }

  .pay-way-btn-row-single {
    justify-content: center;
  }

  .pay-way-btn-row .ghost-btn {
    margin-right: 16rpx;
  }

  /* 与 uni_micro_theatre_two/components/buyMovie：圆角矩形 + 配色一致 */
  .pay-way-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 335rpx;
    height: 88rpx;
    border-radius: 16rpx;
  }

  .pay-way-btn-text {
    font-size: 30rpx;
    font-weight: 600;
    color: #221f18;
    text-align: center;
    lines: 1;
  }

  .pay-way-btn-text--primary {
    color: #221f18;
  }

  .ghost-btn {
    border-width: 2rpx;
    border-style: solid;
    border-color: #868582;
    background-color: #f8f7f5;
  }

  .primary-btn {
    background-color: transparent;
    background-image: linear-gradient(90deg, #ffc654 0%, #0ff8ec 100%);
  }

  .pay-way-btn-full {
    flex: none;
    width: 686rpx;
  }

  .auto-unlock-tips {
    display: flex;
    flex-direction: row;
    margin-top: 22rpx;
    font-size: 26rpx;
    font-weight: 400;
    line-height: 36rpx;
    align-items: center;
    justify-content: center;
  }

  .countdown {
    color: #ff3b30;
    font-weight: 600;
  }

  .countdown--small {
    font-size: 25rpx;
    line-height: 36rpx;
  }

  .auto-unlock-tips-rest {
    color: #8a8a8a;
    margin-left: 4rpx;
  }

  .movie-info {
    background-color: white;
    border-radius: 16rpx;
    padding: 16rpx;
    margin: 0 24rpx;

    .info-group {
      .name {
        lines: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #000000;
        margin-bottom: 8rpx;
      }

      .all {
        color: #868582;
        font-size: 24rpx;
      }
    }

    .cover-box {
      margin-right: 32rpx;

      .cover {
        width: 78rpx;
        height: 104rpx;
        border-radius: 8rpx;
      }
    }
  }

  .pop-bottom {
    padding: 32rpx 24rpx 50rpx;
    background-color: #f8f7f5;

    .pay-bnt {
      width: 360rpx;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 16rpx;
      text-align: center;
      background: linear-gradient(107.69deg, #0ff8ec 0%, #fcb629 112.55%);
      font-size: 30rpx;
      font-weight: bold;
    }

    .label {
      color: #868582;
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .red {
      font-size: 40rpx;
      color: #ff4842;
    }
  }

  .pop-content {
    height: 380rpx;
  }

  .sort-box {
    flex-wrap: wrap;
    padding-left: 30rpx;
    padding-bottom: 70rpx;

    .segment-row {
      width: 100%;
      margin-bottom: 20rpx;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .segment-item {
        padding: 6rpx 18rpx;
        margin-right: 12rpx;
        margin-bottom: 12rpx;
        border-radius: 999rpx;
        background-color: rgba(0, 0, 0, 0.06);
        font-size: 22rpx;
        color: #868582;
      }

      .segment-item.active {
        background: linear-gradient(136.74deg, #0ff8ec 0.61%, #fcb629 103.83%);
        color: #221f18;
      }

      .segment-item.current {
        font-weight: 600;
      }

      .segment-item.disabled {
        opacity: 0.4;
      }
    }

    .active {
      background: linear-gradient(136.74deg, #0ff8ec 0.61%, #fcb629 103.83%);
    }

    .gray-bg {
      background-color: rgba(0, 0, 0, 0.08) !important;
    }

    .num {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      width: 100rpx;
      height: 100rpx;
      border-radius: 16rpx;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
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
    font-size: 32rpx;
    color: #868582;
    margin: 32rpx 0;
    justify-content: space-around;

    .active {
      color: #221f18;
      /* #ifdef APP-NVUE */
      border-bottom-width: 6rpx;
      border-bottom-color: #0fe8dd;
      /* #endif */
      /* #ifndef APP-NVUE */
      &::before {
        content: "";
        display: block;
        position: absolute;
        bottom: 10rpx;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        height: 6rpx;
        width: 66rpx;
        border-radius: 6rpx;
        background: linear-gradient(270deg, #0ff8ec 0%, #ffc654 100%);
      }
      /* #endif */
    }

    .step-item {
      position: relative;
      width: 33%;
      text-align: center;
      padding-bottom: 20rpx;
    }
  }

  .title-box {
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);
    text-align: center;
    color: #868582;
    margin-bottom: 32rpx;
    position: relative;
    padding: 30rpx;

    .sort-title {
      color: #221f18;
      font-size: 26rpx;
    }
  }

  .comment-box {
    height: 300px;
  }

  .send-box {
    padding: 30rpx 30rpx 80rpx;
    flex-direction: row;
    align-items: center;

    .textarea {
      flex: 1;
      height: 88rpx;
      background-color: rgba(0, 0, 0, 0.08);
      border-radius: 12rpx;
      padding: 24rpx;
      color: #221f18;
      font-size: 26rpx;
    }
  }

  /* #ifdef APP-NVUE */
  .pay-way-header,
  .pay-way-header-top,
  .pay-way-divider {
    flex-shrink: 0;
  }
  .pay-way-bottom {
    flex-shrink: 0;
    padding-bottom: 56rpx;
  }
  .pop-bottom {
    padding-bottom: 88rpx;
  }
  /* nvue：scroll-view 需可计算高度，避免 flex:1 把头尾挤没 */
  .pay-way-list-scroll {
    flex: 1;
    height: 380rpx;
  }
  /* nvue：用 background-image + to right（等同 90deg 左→右），铺满按钮即随宽度自适应；#ffc654 作降级底 */
  .primary-btn {
    border-width: 0;
    border-style: solid;
    border-color: transparent;
    overflow: hidden;
    background-color: #ffc654;
    background-image: linear-gradient(to right, #ffc654, #0ff8ec);
  }
  /* #endif */
}
</style>

<style lang="scss" scoped>
/* #ifndef APP-NVUE */
.pop-box .pay-way-bottom {
  padding-bottom: calc(24rpx + var(--safe-bottom));
  --safe-bottom: env(safe-area-inset-bottom);
  --safe-bottom: constant(safe-area-inset-bottom);
  --safe-bottom: var(--window-bottom, 0px);
}
.pop-box .pop-bottom {
  padding-bottom: calc(50rpx + var(--safe-bottom));
  --safe-bottom: env(safe-area-inset-bottom);
  --safe-bottom: constant(safe-area-inset-bottom);
  --safe-bottom: var(--window-bottom, 0px);
}
.pop-box .pop-content {
  min-height: 280rpx;
  max-height: 380rpx;
  overflow-y: auto;
}
.pop-box .pay-way-layout {
  min-height: 640rpx;
  height: auto;
}
.pop-box .pay-way-list-scroll {
  max-height: 520rpx;
}
.pop-box .pay-way-header-top {
  min-width: 0;
}
.pop-box .pay-way-title-text {
  min-width: 0;
}
.pop-box .pay-way-sub-tip {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pop-box .radio-icon {
  flex-shrink: 0;
}
.pop-box .pay-way-text {
  white-space: nowrap;
}
.pop-box .pay-way-btn-row {
  column-gap: 20rpx;
  width: 100%;
}
.pop-box .pay-way-btn-row .ghost-btn {
  margin-right: 0;
}
.pop-box .pay-way-btn {
  flex: 1;
  width: auto;
  min-width: 0;
}
.pop-box .pay-way-btn-full {
  max-width: 100%;
  width: 100%;
}
.pop-box .sort-box {
  gap: 20rpx;
}
.pop-box .sort-box .segment-row {
  gap: 12rpx;
}
.pop-box .sort-box .segment-item {
  margin-right: 0;
  margin-bottom: 0;
}
.pop-box .sort-box .num {
  display: inline-block;
  margin-right: 0;
  margin-bottom: 0;
}
.pop-box .movie-info .info-group .name {
  white-space: nowrap;
}
.pop-box .send-box .textarea {
  width: calc(100% - 50rpx);
  flex: none;
  height: 40rpx;
}
/* #endif */
</style>
