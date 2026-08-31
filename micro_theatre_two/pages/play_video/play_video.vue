<template>
  <view class="play-box">
    <!-- 底层播放器层：new_video 负责视频播放、进度条和上下滑切集。 -->
    <new-video
      v-if="isFreeEpisodeReady"
      ref="homeVideoPlayer"
      :video-list="videoList"
      :initial-index="initialEpisodeIndex"
      :auto-advance="isAutoChange"
      :max-playable-ratio="currentMaxPlayableRatio"
      :play-locked="isCurrentEpisodeLocked"
      :resume-time="currentPlayTimeSec"
      :suppress-native-for-web-overlay="suppressNativeForWebOverlay"
      controls-bottom="220rpx"
      @change="handleVideoChange"
      @trial-limit-reached="handleTrialLimitReached"
      @progress-change="handleProgressChange"
    >
      <template #overlay>
        <!-- 固定「推荐」用于本页播放；其余 tab 全部由 index_set_link_list 接口返回，用于跳转 -->
        <cover-view class="top-category-row flex a-c">
          <cover-view class="top-bar-side"></cover-view>
          <cover-view class="top-category-tabs flex a-c j-c">
            <cover-view
              v-for="item in linkTabs"
              :key="item.id"
              class="category-item"
              :class="{ active: activeLinkId === item.id }"
              @click.stop="openLinkTab(item)"
              >{{ item.title }}</cover-view
            >
          </cover-view>
          <cover-view
            class="top-bar-side flex a-c j-c search-btn"
            @click.stop="goSearch"
          >
            <cover-view class="search-btn-text">搜</cover-view>
          </cover-view>
        </cover-view>
        <!-- 中间购买提示层。 -->
        <cover-view
          v-if="isCurrentEpisodeLocked"
          class="flex a-c j-c buy-tips"
          @click.stop="toggleBuyPop"
        >
          <cover-image
            :src="
              http_host + '/micro_theatre_two/web/static/images/play-white.png'
            "
            class="play-icon"
          ></cover-image>
          <cover-view>购买后继续观看</cover-view>
        </cover-view>
        <!-- 右侧互动层：点赞和评论入口。 -->
        <cover-view class="right-box">
          <cover-view class="item" @click.stop="toggleLike">
            <cover-image
              :src="
                http_host + '/micro_theatre_two/web/static/images/p-like-on.png'
              "
              class="icon"
              v-if="isLike"
            ></cover-image>
            <cover-image
              :src="
                http_host + '/micro_theatre_two/web/static/images/p-like.png'
              "
              class="icon"
              v-else
            ></cover-image>
            <cover-view class="num">{{
              formatCount(dramaInfo.like_count || dramaInfo.favorite_count || 0)
            }}</cover-view>
          </cover-view>
          <cover-view class="item" @click.stop="toggleComment">
            <cover-image
              :src="
                http_host + '/micro_theatre_two/web/static/images/p-chat.png'
              "
              class="icon"
            ></cover-image>
            <cover-view class="num">{{ formatCount(commentTotal) }}</cover-view>
          </cover-view>
        </cover-view>
        <!-- 底部业务信息层：影片信息和选集弹窗入口。 -->
        <cover-view class="bottom-box">
          <cover-view class="movie flex a-c">
            <cover-image
              :src="
                http_host + '/micro_theatre_two/web/static/images/movie.png'
              "
              class="movie-cover"
            ></cover-image>
            <cover-view class="name">{{
              sortHeaderInfo.title || dramaInfo.name || "短剧"
            }}</cover-view>
          </cover-view>
          <cover-view class="movie-desc" v-if="descText">
            <cover-view class="desc-text"
              >第{{ currentEpisodeOrder }}集 | {{ descShort }}</cover-view
            >
          </cover-view>
          <cover-view class="black-box">
            <cover-view class="info flex a-c j-b" @click.stop="goInfo">
              <cover-view>
                {{ dramaInfo.name }}·全{{
                  dramaInfo.total_episodes || episodeList.length
                }}集·第{{ currentEpisodeOrder }}集
              </cover-view>
              <cover-view class="arrow-icon-text">›</cover-view>
            </cover-view>
          </cover-view>
        </cover-view>
      </template>
    </new-video>
    <!-- 顶部操作层：返回和自动切集开关。 -->
    <!-- <view class="top-row flex a-c j-b">
			<view class="level flex a-c" @click="goBack">
				<u-icon name="arrow-left" color="#ffffff" size="18" class="arrow-left"></u-icon>
				第{{ currentEpisodeIndex + 1 }}集
			</view>
			<view class="auto-box flex a-c" @click="toggleAutoChange">
				<image :src="http_host+'/micro_theatre_two/web/static/images/p-checkbox.png'" class="checkbox" v-if="isAutoChange"></image>
				<image :src="http_host+'/micro_theatre_two/web/static/images/p-checkbox-off.png'" class="checkbox" v-else></image>
				自动切集
			</view>
		</view> -->
    <!--评论start-->
    <u-popup
      :show="showComment"
      mode="bottom"
      :round="20"
      :z-index="12000"
      @close="onCommentPopupClose"
    >
      <view class="pop-box">
        <view class="title-box" @click="toggleComment"
          >{{ commentTotal }}条评论
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
          <review
            ref="reviewList"
            :drama-id="dramaId"
            @count-change="onCommentCountChange"
          ></review>
        </view>
        <view class="send-box">
          <textarea
            placeholder="我也评论一番!!"
            class="textarea"
            :auto-height="true"
            v-model.trim="commentDraft"
            confirm-type="send"
            @confirm="submitComment"
          ></textarea>
          <view class="send-btn" @click="submitComment">发送</view>
        </view>
      </view>
    </u-popup>
    <!--评论end-->
    <!-- 选集弹窗层：当前仅负责展示当前集高亮，不直接触发跳播。 -->
    <!-- <u-popup :show="showSort" mode="bottom" :round="20">
      <view class="pop-box">
        <view class="title-box">
          <view class="sort-header flex a-c j-b">
            <view class="sort-header-main flex a-c">
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
            <view class="sort-header-arrow flex a-c j-c" @click="goInfo">
              <u-icon
                name="arrow-down"
                color="#221F18"
                size="14"
                class="arrow-icon"
              ></u-icon>
            </view>
          </view>
          <view class="step-row flex p-24 m-b-24">
            <view class="step-item active">1-30</view>
            <view class="step-item">31-60</view>
            <view class="step-item">61-88</view>
          </view>
        </view>
        <view class="sort-box flex">
          <view
            class="num"
            v-for="(item, index) in videoList.length"
            :key="index"
            :class="{ active: index === currentEpisodeIndex }"
            >{{ index + 1 }}
            <image
              :src="
                http_host + '/micro_theatre_two/web/static/images/vip-tag.png'
              "
              class="vip-tag"
            ></image>
          </view>
        </view>
      </view>
    </u-popup> -->
    <!--选集end-->

    <!-- 购买弹窗层。 -->
    <u-popup
      :show="showBuyPop"
      :round="32"
      :z-index="12000"
      @close="closeBuyPop"
    >
      <buyMovie @close="closeBuyPop"></buyMovie>
    </u-popup>
    <!--购买弹出层end-->
  </view>
</template>

<script>
import urlRequest from "@/utils/request.js";
import empty from "@/micro_theatre_two/components/empty/empty.vue";
import review from "@/micro_theatre_two/components/review/review.vue";
import buyMovie from "@/micro_theatre_two/components/buyMovie/buyMovie.vue";
// newVideo 负责底层播放器，页面继续承载业务层和弹窗层。
import newVideo from "@/micro_theatre_two/components/watch_video/new_video.vue";
import * as globalData from "@/utils/config";

function request(config = {}) {
  const reqUrl = config.url || "";
  const reqData = config.data || {};
  const reqMethod = config.method || "POST";
  return urlRequest.request(reqUrl, reqData, reqMethod);
}
export default {
  components: {
    empty,
    buyMovie,
    newVideo,
    review,
  },
  data() {
    const app = (typeof getApp === "function" && getApp()) || {};
    const gd = app.globalData || {};
    const hostFromVuex =
      this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
        ? this.vuex_apiUrl
        : "";
    const baseHost = String(
      hostFromVuex || globalData.apiUrl || gd.http_host || "",
    ).replace(/\/+$/, "");
    return {
      http_host: baseHost,
      customer_id:
        this.vuex_customer_id || Number(globalData.customer_id || 0) || 0,
      // 后台插入的“推荐”固定链接，用于默认选中定位
      recommendH5Link: "/micro_theatre_two/web/index.php?m=index&a=play_video",
      recommendMiniLink: "/micro_theatre_two/pages/play_video/play_video",
      /** index_set_link 列表，用于除「推荐」外的入口展示与跳转 */
      linkTabs: [
        {
          id: "recommend",
          title: "推荐",
          h5_link: "/micro_theatre_two/web/index.php?m=index&a=play_video",
          mini_link: "/micro_theatre_two/pages/play_video/play_video",
        },
      ],
      /** 当前选中的外链 tab（点击后会 redirect，一般仅作高亮用） */
      activeLinkId: "recommend",
      // 页面弹窗与业务态。
      showComment: false,
      showSort: false,
      // 防止同一集反复上报观看记录
      lastWatchLogKey: "",
      isAutoChange: true,
      isLike: false,
      showBuyPop: false,
      // 锁定态按“每一集单独记录”，切回时不重新赠送试看时长。
      trialExhaustedEpisodes: {},
      sortHeaderInfo: {
        cover: baseHost + "/micro_theatre_two/web/static/images/movie.png",
        title: "霸道总裁重生之送外卖",
        subtitle:
          "这段短剧的介绍这短剧的介绍这短剧的介绍这段短剧的介绍这短剧的介绍",
      },
      // 初始集数只在进入页面时使用，当前集数则跟随播放器切换实时同步。
      initialEpisodeIndex: 0,
      currentEpisodeIndex: 0,
      // 是否已成功加载随机免费剧集（用于控制播放器渲染）
      isFreeEpisodeReady: false,
      // 当前电视剧信息
      dramaInfo: {
        id: 1,
        freeTimeProportion: "10%", // 试看比例（已取消前 N 集整集免费）
        name: "",
        cover_image: "",
        description: "",
        like_count: 0,
        favorite_count: 0,
      },
      // 当前短剧 id（用于评论/点赞/详情跳转）
      dramaId: "",
      // 当前拉取到的“免费剧集”列表（用于从当前集同步短剧信息）
      episodeList: [],
      // 评论总数 & 评论输入
      commentTotal: 0,
      commentDraft: "",
      // 视频源列表
      videoList: [],
      // 当前播放进度（秒）
      currentPlayTimeSec: 0,
      /** 跳转搜索/详情等子页时暂停首页视频，返回 onShow 再恢复 */
      _suspendPlayForNav: false,
    };
  },
  computed: {
    /** App 原生 video 与 web 弹层叠层冲突：弹窗打开时临时抑制原生层 */
    suppressNativeForWebOverlay() {
      return !!(this.showComment || this.showSort || this.showBuyPop);
    },
    descText() {
      const s = (this.sortHeaderInfo && this.sortHeaderInfo.subtitle) || "";
      return String(s || "").trim();
    },
    descShort() {
      const t = this.descText || "";
      if (t.length <= 100) return t;
      return t.slice(0, 100) + "...";
    },
    currentEpisodeOrder() {
      const ep = this.episodeList && this.episodeList[this.currentEpisodeIndex];
      const order = Number(
        ep && ep.episode_order != null
          ? ep.episode_order
          : this.currentEpisodeIndex + 1,
      );
      if (!Number.isFinite(order) || order <= 0) {
        return Math.max(1, Number(this.currentEpisodeIndex) + 1);
      }
      return Math.floor(order);
    },
    /** 随机免费剧集：本页面展示的都是免费，所以免费集数等于当前 videoList 长度 */
    freeEpisodeCount() {
      return (this.videoList && this.videoList.length) || 0;
    },
    trialRatio() {
      return this.parseTrialRatio(
        this.dramaInfo && this.dramaInfo.freeTimeProportion,
      );
    },
    isCurrentEpisodeFree() {
      return this.currentEpisodeIndex < this.freeEpisodeCount;
    },
    isCurrentEpisodeLocked() {
      if (this.isCurrentEpisodeFree) {
        return false;
      }

      if (this.trialRatio <= 0) {
        return true;
      }

      return !!this.trialExhaustedEpisodes[this.currentEpisodeIndex];
    },
    currentMaxPlayableRatio() {
      if (this.isCurrentEpisodeFree) {
        return null;
      }

      return this.trialRatio;
    },
  },
  async onLoad(res) {
    // 路由参数 num 按“第几集”传入（1 开始），进入页面时初始化首播集数和当前集数。
    // 拉取 index_set_link 作为除「推荐」外的入口 tab
    await this.loadIndexSetLinks();

    // 展示随机免费剧集
    await this.fetchFreeEpisodes();

    const rawEpisodeNo = Number(res && res.num);
    const requestedIndex =
      Number.isFinite(rawEpisodeNo) && rawEpisodeNo > 0
        ? Math.floor(rawEpisodeNo - 1)
        : 0;
    const nextIndex = this.normalizeEpisodeIndex(requestedIndex);
    this.initialEpisodeIndex = nextIndex;
    this.currentEpisodeIndex = nextIndex;
  },
  onShow() {
    if (!this._suspendPlayForNav) return;
    this._suspendPlayForNav = false;
    this.$nextTick(() => {
      this.resumeHomePlayer();
    });
  },
  onHide() {
    this._suspendPlayForNav = true;
    this.pauseHomePlayer();
  },
  onUnload() {
    this.pauseHomePlayer();
  },
  methods: {
    pauseHomePlayer() {
      const player = this.$refs.homeVideoPlayer;
      if (!player) return;
      try {
        if (typeof player.pauseCurrentSlot === "function") {
          player.pauseCurrentSlot();
        }
        if (typeof player.pauseInactiveSlots === "function") {
          player.pauseInactiveSlots();
        }
      } catch (e) {
        // ignore
      }
    },
    resumeHomePlayer() {
      if (!this.isFreeEpisodeReady || this.suppressNativeForWebOverlay) return;
      const player = this.$refs.homeVideoPlayer;
      if (!player) return;
      try {
        if (typeof player.resumeCurrentSlot === "function") {
          player.resumeCurrentSlot();
        }
      } catch (e) {
        // ignore
      }
    },
    getEpisodeVideoUrl(ep) {
      if (!ep || typeof ep !== "object") return "";
      // 优先使用后端已拼好的可访问地址字段
      const direct =
        ep.video_url || ep.videoUrl || ep.url || ep.video || ep.file_url || "";
      if (direct && typeof direct === "string") {
        const s = direct.trim();
        if (!s) return "";
        if (s.startsWith("http")) return s;

        const host = (this.http_host || "").replace(/\/$/, "");
        if (!host) return s;
        // 兼容 /resources/... 或相对路径
        if (s.startsWith("/")) return host + s;
        return host + "/resources/" + s;
      }

      // 其次兜底 file_path
      const filePath = ep.file_path || ep.filePath || ep.path || "";
      if (filePath && typeof filePath === "string") {
        const fp = filePath.trim();
        if (!fp) return "";
        if (fp.startsWith("http")) return fp;

        const host = (this.http_host || "").replace(/\/$/, "");
        if (!host) return fp;
        if (fp.startsWith("/")) return host + fp;
        return host + "/resources/" + fp;
      }

      return "";
    },

    /** 无符合条件的免费/已购剧集时，使用站点内 static/video 占位视频 */
    getStaticFallbackVideoUrls() {
      const base = (this.http_host || "").replace(/\/$/, "");
      const names = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8"];
      return names.map(
        (n) => `${base}/micro_theatre_two/web/static/video/${n}.mp4`,
      );
    },
    applyStaticFallbackVideos() {
      this.videoList = this.getStaticFallbackVideoUrls();
      this.episodeList = [];
      this.trialExhaustedEpisodes = {};
      const fixedIndex = this.normalizeEpisodeIndex(this.currentEpisodeIndex);
      this.initialEpisodeIndex = fixedIndex;
      this.currentEpisodeIndex = fixedIndex;
      this.isFreeEpisodeReady = true;
      this.reportTheatreWatchLog();
    },

    async fetchFreeEpisodes() {
      this.isFreeEpisodeReady = false;
      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=get_free_episode&xdebug=xdebug",
          method: "POST",
          data: {},
        });

        if (res && res.errcode === 0 && Array.isArray(res.data)) {
          const episodes = res.data;
          this.episodeList = episodes;

          const urls = episodes
            .map((ep) => this.getEpisodeVideoUrl(ep))
            .filter((u) => typeof u === "string" && u.length > 0);

          if (!urls.length) {
            this.applyStaticFallbackVideos();
            return;
          }

          this.videoList = urls;
          this.trialExhaustedEpisodes = {};
          // 列表加载完成后再夹紧一次，确保路由传入集数正确生效
          const fixedIndex = this.normalizeEpisodeIndex(
            this.currentEpisodeIndex,
          );
          this.initialEpisodeIndex = fixedIndex;
          this.currentEpisodeIndex = fixedIndex;
          this.isFreeEpisodeReady = true;

          // 从剧集里兜底拿到短剧信息（再请求 drama_detail 做补全）
          const firstEp = episodes[0] || {};
          const drama =
            firstEp.drama_info || firstEp.dramaInfo || firstEp.drama || {};
          const nextDramaId =
            firstEp.drama_id || drama.id || drama.drama_id || this.dramaId;
          this.dramaId = nextDramaId ? String(nextDramaId) : "";

          if (drama && typeof drama === "object") {
            this.dramaInfo = Object.assign({}, this.dramaInfo, drama);
            // drama.isLike 可能是 "0"/"1" 字符串，避免 !!"0" 误判为 true
            if (typeof drama.isLike !== "undefined") {
              this.isLike = Number(drama.isLike) === 1;
            }

            const cover =
              drama.cover_image ||
              drama.coverImage ||
              this.sortHeaderInfo.cover;
            this.sortHeaderInfo.cover = cover || this.sortHeaderInfo.cover;

            this.sortHeaderInfo.title = drama.name || this.sortHeaderInfo.title;

            const desc = drama.description || "";
            this.sortHeaderInfo.subtitle =
              desc.replace(/<[^>]+>/g, "") || this.sortHeaderInfo.subtitle;
          }

          // 进入页且列表就绪即上报观看记录（不依赖播放器是否再触发 change）
          this.reportTheatreWatchLog();

          if (this.dramaId) {
            this.fetchDramaDetail();
            this.fetchCommentTotal();
          }

          return;
        }
      } catch (e) {
        // ignore
      }

      this.applyStaticFallbackVideos();
    },

    // 格式化数值（例如 28865 -> 2.9万）
    formatCount(n) {
      const num = Number(n) || 0;
      if (num >= 10000) {
        return (Math.round((num / 10000) * 10) / 10).toFixed(1) + "万";
      }
      return String(num);
    },

    // 接口：短剧详情（用于补全封面/简介/点赞态/点赞数）
    fetchDramaDetail() {
      if (!this.dramaId) return;
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=drama_detail",
        method: "POST",
        data: {
          id: this.dramaId,
          user_id: globalData.user_id,
        },
      })
        .then((res) => {
          if (res && res.errcode === 0 && res.data && res.data.info) {
            const info = res.data.info;
            this.dramaInfo = Object.assign({}, this.dramaInfo, info);
            if (typeof info.isLike !== "undefined") {
              // 后端可能返回 "0"/"1" 字符串，避免 !!"0" 误判为 true
              this.isLike = Number(info.isLike) === 1;
            }

            this.sortHeaderInfo.cover =
              info.cover_image || this.sortHeaderInfo.cover;
            this.sortHeaderInfo.title = info.name || this.sortHeaderInfo.title;
            this.sortHeaderInfo.subtitle =
              (info.description && info.description.replace(/<[^>]+>/g, "")) ||
              this.sortHeaderInfo.subtitle;
          }
        })
        .catch(() => {});
    },

    // 接口：评论总数
    fetchCommentTotal() {
      if (!this.dramaId) return;
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
          if (res && res.errcode === 0 && res.data) {
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

    // 发送评论
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
          if (res && res.errcode === 0) {
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

    normalizeMiniLink(miniLink) {
      if (!miniLink || typeof miniLink !== "string") return "";
      // 内链按 /pages/... 格式处理；如果是 http 链接当前不做处理
      if (miniLink.startsWith("http")) return "";
      // 后台可能配置成 /public/pages/xxx，uni-app 实际页面通常是 /pages/xxx
      if (miniLink.startsWith("/public/pages/")) {
        return miniLink.replace("/public/pages/", "/pages/");
      }
      return miniLink.startsWith("/") ? miniLink : `/${miniLink}`;
    },

    goSearch() {
      this._suspendPlayForNav = true;
      this.pauseHomePlayer();
      uni.navigateTo({
        url: "/micro_theatre_two/pages/history_search/history_search",
        fail: () => {
          this._suspendPlayForNav = false;
          this.$nextTick(() => {
            this.resumeHomePlayer();
          });
        },
      });
    },

    /** 接口配置的其它入口：按 mini_link 跳转（仅小程序内链） */
    openLinkTab(item) {
      if (!item || !item.id) return;
      this.activeLinkId = item.id;

      // #ifdef H5
      const h5Target = item.h5_link || "";
      if (!h5Target) {
        uni.showToast({
          title: "未配置 h5_link",
          icon: "none",
        });
        return;
      }
      const base = (this.http_host || "").replace(/\/$/, "");
      const path = h5Target.startsWith("/") ? h5Target : `/${h5Target}`;
      const fullUrl = base ? base + path : path;
      window.location.href = fullUrl;
      return;
      // #endif

      // #ifndef H5
      const miniTarget = item.mini_link || "";
      if (!miniTarget) {
        uni.showToast({
          title: "未配置 mini_link",
          icon: "none",
        });
        return;
      }
      const url = this.normalizeMiniLink(miniTarget);
      if (!url) {
        uni.showToast({
          title: "未配置有效跳转链接",
          icon: "none",
        });
        return;
      }
      this._suspendPlayForNav = true;
      this.pauseHomePlayer();
      uni.redirectTo({
        url,
      });
      return;
      // #endif
    },

    async loadIndexSetLinks() {
      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=index_set_link_list",
          method: "POST",
          data: {},
        });
        if (res && res.errcode === 0 && Array.isArray(res.data)) {
          const list = res.data.slice();
          list.sort((a, b) => {
            const as = Number(a && a.sort != null ? a.sort : 0);
            const bs = Number(b && b.sort != null ? b.sort : 0);
            if (bs !== as) return bs - as;
            const aid = Number(a && a.id != null ? a.id : 0);
            const bid = Number(b && b.id != null ? b.id : 0);
            return aid - bid;
          });

          this.linkTabs = list.map((row, idx) => ({
            id: String(row.id != null ? row.id : `link_${idx}`),
            title:
              row.title && String(row.title).trim()
                ? String(row.title).trim()
                : "入口",
            h5_link: row.h5_link || "",
            mini_link: row.mini_link || "",
          }));

          // 默认优先选中“推荐”固定链接；若未配置则回退到排序最高（第一项）
          const hitRecommend = this.linkTabs.find(
            (item) =>
              String(item.h5_link || "") === this.recommendH5Link ||
              String(item.mini_link || "") === this.recommendMiniLink,
          );
          this.activeLinkId = hitRecommend
            ? hitRecommend.id
            : this.linkTabs.length
              ? this.linkTabs[0].id
              : "";
          return;
        }
      } catch (e) {
        // 忽略错误：保持默认文案与类型
      }
      // 接口异常/登录失效时兜底展示“推荐”tab，避免顶部空白
      this.linkTabs = [
        {
          id: "recommend",
          title: "推荐",
          h5_link: this.recommendH5Link,
          mini_link: this.recommendMiniLink,
        },
      ];
      this.activeLinkId = "recommend";
    },
    // 对路由或播放器回传的集数做统一夹紧，防止超出当前视频列表范围。
    normalizeEpisodeIndex(index) {
      const parsedIndex = Number(index);
      if (!Number.isFinite(parsedIndex) || parsedIndex < 0) {
        return 0;
      }
      // 视频列表未加载时，先保留目标索引，避免进入页被强制回到第1集
      if (!this.videoList || this.videoList.length === 0)
        return Math.floor(parsedIndex);

      if (parsedIndex >= this.videoList.length) {
        return this.videoList.length - 1;
      }

      return Math.floor(parsedIndex);
    },
    // newVideo 每次切换完成后都会回传当前索引，页面层据此同步标题和选集高亮。
    handleVideoChange(index) {
      this.currentEpisodeIndex = this.normalizeEpisodeIndex(index);
      this.reportTheatreWatchLog();

      // 如果后端给的数据包含不同短剧，动态更新短剧信息/评论点赞
      const ep = this.episodeList && this.episodeList[this.currentEpisodeIndex];
      if (!ep) return;

      const drama = ep.drama_info || ep.dramaInfo || ep.drama || undefined;
      const nextDramaId =
        ep.drama_id || (drama && drama.id) || (drama && drama.drama_id);

      if (nextDramaId && String(nextDramaId) !== String(this.dramaId)) {
        this.dramaId = String(nextDramaId);
        if (drama && typeof drama === "object") {
          this.dramaInfo = Object.assign({}, this.dramaInfo, drama);
          // drama.isLike 可能是 "0"/"1" 字符串，避免 !!"0" 误判为 true
          if (typeof drama.isLike !== "undefined") {
            this.isLike = Number(drama.isLike) === 1;
          }
          if (drama.cover_image) this.sortHeaderInfo.cover = drama.cover_image;
          if (drama.name) this.sortHeaderInfo.title = drama.name;
          const desc = drama.description || "";
          this.sortHeaderInfo.subtitle =
            desc.replace(/<[^>]+>/g, "") || this.sortHeaderInfo.subtitle;
        }
        this.fetchDramaDetail();
        this.fetchCommentTotal();
      }
    },
    getCurrentEpisodeId() {
      const ep = this.episodeList && this.episodeList[this.currentEpisodeIndex];
      if (!ep) return 0;
      const id = ep.id || ep.episode_id || ep.episodeId;
      return Number(id) || 0;
    },
    reportTheatreWatchLog() {
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
        // ignore
      });
    },
    parseTrialRatio(value) {
      if (typeof value === "number") {
        if (!Number.isFinite(value)) {
          return 0;
        }

        return value > 1 ? Math.min(value / 100, 1) : Math.max(0, value);
      }

      if (typeof value !== "string") {
        return 0;
      }

      const normalizedValue = value.trim();
      if (!normalizedValue) {
        return 0;
      }

      if (normalizedValue.endsWith("%")) {
        const percentValue = parseFloat(normalizedValue.slice(0, -1));
        if (!Number.isFinite(percentValue)) {
          return 0;
        }

        return Math.min(Math.max(percentValue / 100, 0), 1);
      }

      const parsedValue = Number(normalizedValue);
      if (!Number.isFinite(parsedValue)) {
        return 0;
      }

      return parsedValue > 1
        ? Math.min(parsedValue / 100, 1)
        : Math.max(parsedValue, 0);
    },
    handleTrialLimitReached(payload) {
      const payloadIndex =
        payload && typeof payload === "object" ? payload.index : payload;
      const episodeIndex = this.normalizeEpisodeIndex(payloadIndex);
      if (
        episodeIndex < this.freeEpisodeCount ||
        this.trialExhaustedEpisodes[episodeIndex]
      ) {
        return;
      }

      this.$set(this.trialExhaustedEpisodes, episodeIndex, true);
      // 试看结束仅锁定；看广告解锁请使用 play_video_simple 页
    },
    // 兼容 new_video 的 progress-change 事件（该页面目前不做进度恢复）
    handleProgressChange(payload) {
      const t =
        payload && typeof payload === "object"
          ? Number(payload.currentTime || payload.time || 0)
          : 0;
      this.currentPlayTimeSec =
        Number.isFinite(t) && t >= 0 ? Math.floor(t) : this.currentPlayTimeSec;
    },
    // 购买弹窗开关。
    toggleBuyPop() {
      this.showBuyPop = !this.showBuyPop;
    },
    closeBuyPop() {
      this.showBuyPop = false;
    },
    // 返回上一页。
    goBack() {
      uni.navigateBack();
    },
    // 保留原页面的跳转能力，供后续业务层扩展使用。
    goInfo() {
      if (!this.dramaId) {
        uni.showToast({
          title: "短剧信息异常",
          icon: "none",
        });
        return;
      }
      // 左下角“短剧”入口：跳转到 play_video_simple 播放同一短剧，并自动打开选集弹窗定位到当前集
      const epNo = Number(this.currentEpisodeOrder) || 1;
      this._suspendPlayForNav = true;
      this.pauseHomePlayer();
      uni.navigateTo({
        url: `/micro_theatre_two/pages/play_video_simple/play_video_simple?id=${encodeURIComponent(
          this.dramaId,
        )}&num=${encodeURIComponent(epNo)}&open_sort=1`,
        fail: () => {
          this._suspendPlayForNav = false;
          this.$nextTick(() => {
            this.resumeHomePlayer();
          });
        },
      });
    },
    // 评论弹窗开关。
    toggleComment() {
      const next = !this.showComment;
      this.showComment = next;
      if (next) {
        this.fetchCommentTotal();
        // 兜底刷新评论列表
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
    // 选集弹窗开关。
    toggleSort() {
      this.showSort = !this.showSort;
    },
    // 自动切集直接映射到底层播放器的 autoAdvance 行为。
    toggleAutoChange() {
      this.isAutoChange = !this.isAutoChange;
    },
    // 点赞态开关。
    toggleLike() {
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
          if (res && res.errcode === 0) {
            this.isLike = !this.isLike;
            const cur =
              Number(
                this.dramaInfo.like_count != null
                  ? this.dramaInfo.like_count
                  : this.dramaInfo.favorite_count,
              ) || 0;
            const next = this.isLike ? cur + 1 : Math.max(0, cur - 1);
            this.$set(this.dramaInfo, "like_count", next);
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.play-box {
  position: relative;
  color: white;
  height: 100vh;
  .buy-tips {
    position: absolute;
    top: 42%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    pointer-events: auto;
    background-color: #221f18;
    border-radius: 38rpx;
    height: 76rpx;
    line-height: 76rpx;
    padding: 0 24rpx;
    color: white;

    .play-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 16rpx;
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
      padding: 30rpx 30rpx 80rpx;

      .textarea {
        height: 40rpx;
        width: calc(100% - 50rpx);
        background-color: rgba(0, 0, 0, 0.08);
        border-radius: 12rpx;
        padding: 24rpx;
        color: #221f18;
        font-size: 26rpx;
      }
    }
  }

  .bottom-box {
    position: absolute;
    z-index: 99;
    pointer-events: auto;
    bottom: calc(50rpx + constant(safe-area-inset-bottom));
    bottom: calc(50rpx + env(safe-area-inset-bottom));
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

    .progress-box {
      margin-bottom: 44rpx;
      // padding: 24rpx 0;
    }

    .movie-desc {
      padding: 0 30rpx;
      margin-top: 10rpx;

      .desc-text {
        color: rgba(255, 255, 255, 0.8);
        font-size: 22rpx;
        line-height: 36rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
        word-break: break-all;
      }
    }

    .movie {
      padding: 0 30rpx;
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

  .video-info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1rpx solid red;
    color: white;
    z-index: 99;
  }

  .right-box {
    position: absolute;
    z-index: 99;
    pointer-events: auto;
    bottom: 35%;
    right: 30rpx;

    .item {
      text-align: center;
      font-size: 22rpx;
      margin-bottom: 48rpx;

      .icon {
        width: 44rpx;
        height: 44rpx;
        margin-bottom: 8rpx;
      }
    }
  }

  .top-row {
    position: absolute;
    z-index: 99;
    top: 40rpx;
    left: 30rpx;
    width: 90%;

    .level {
      .arrow-left {
        margin-right: 8rpx;
      }

      font-size: 32rpx;
    }

    .auto-box {
      font-size: 26rpx;

      .checkbox {
        width: 36rpx;
        height: 36rpx;
        margin-right: 4px;
      }
    }
  }

  .top-category-row {
    position: absolute;
    top: 42rpx;
    left: 0;
    width: 100%;
    z-index: 999;
    pointer-events: auto;
    padding: 0 8rpx 30rpx;
    box-sizing: border-box;
  }

  .top-bar-side {
    width: 72rpx;
    flex-shrink: 0;
    align-self: center;
    min-height: 44rpx;
  }

  .search-btn {
    justify-content: center;
    align-items: center;
  }

  .search-btn-text {
    color: #ffffff;
    font-size: 22px;
    line-height: 1;
  }

  .top-category-tabs {
    flex: 1;
    min-width: 0;
    column-gap: 46rpx;
  }

  .category-item {
    position: relative;
    padding-bottom: 10rpx;
    color: rgba(255, 255, 255, 0.92);
    font-size: 36rpx;
    font-weight: 500;
    line-height: 36rpx;
    pointer-events: auto;
  }

  .category-item.active {
    font-weight: 600;
    color: #ffffff;

    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      border-radius: 999rpx;
      background-color: #ffffff;
    }
  }

  .arrow-icon-text {
    color: #ffffff;
    font-size: 28rpx;
    line-height: 1;
    margin-left: 10rpx;
  }
}
</style>
