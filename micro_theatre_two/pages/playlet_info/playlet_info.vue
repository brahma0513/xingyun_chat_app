<template>
  <view
    class="playlet-info-box"
    :style="{
      background:
        'url(' +
        http_host +
        '/micro_theatre_two/web/static/images/info-bg.png) no-repeat',
      backgroundSize: '100%',
    }"
  >
    <view class="content-box">
      <view class="playet-info flex">
        <view class="playlet-pic-box">
          <image
            :src="dramaInfo.cover_image"
            class="playlet-pic"
            mode="aspectFill"
          ></image>
        </view>
        <view class="playet-m">
          <view class="title-box flex j-b">
            <view class="title">{{ dramaInfo.name }}</view>
            <view class="score-box flex j-c a-c">
              <image
                :src="scoreIconSrc"
                class="score-icon"
                mode="aspectFit"
              ></image>
              {{ dramaInfo.drama_price }}
            </view>
          </view>
          <view class="desc">
            <text>全{{ displayEpisodeTotal }}集</text>
            <text>{{ heatSales }}热度</text>
          </view>
          <view class="tags-box flex">
            <view class="tag" v-for="(t, idx) in tagList" :key="idx">{{
              t
            }}</view>
          </view>
        </view>
      </view>
      <view class="introduce-box">
        <view class="label-row flex a-c j-b">
          <view>简介</view>
          <view class="open" @click="toggleDesc">{{
            showDesc ? "收起" : "展开"
          }}</view>
        </view>
        <view class="introduce" :class="{ expanded: showDesc }">
          <rich-text v-if="showDesc" :nodes="dramaInfo.description"></rich-text>
          <text v-else class="introduce-text">{{ shortDescription }}</text>
        </view>
      </view>
      <view class="label-row flex a-c j-b p-24 m-b-24">
        <view>剧集</view>
        <view class="gray flex a-c" @click="toggleInfoPop">
          {{
            dramaInfo.serial_status_text ||
            (dramaInfo.serial_status == 3
              ? "连载完毕"
              : dramaInfo.serial_status == 2
                ? "连载中"
                : "待上映")
          }}
          · 共{{ displayEpisodeTotal }}集
          <u-icon
            name="arrow-right"
            color="#868582"
            size="12"
            class="arrow-right"
          ></u-icon>
        </view>
      </view>
      <!-- 集数分段标签：每段 20 集；仅多段时展示，避免只上架少量集时多余一条「1-2」 -->
      <view class="step-row flex p-24 m-b-24" v-if="segmentList.length > 1">
        <view
          class="step-item"
          v-for="(seg, idx) in segmentList"
          :key="idx"
          :class="{ active: idx === currentSegment }"
          @click="currentSegment = idx"
        >
          {{ seg.start }}-{{ seg.end }}
        </view>
      </view>
      <scroll-view class="set-box" scroll-x="true">
        <view
          class="num"
          v-for="(item, index) in visibleEpisodes"
          :key="item.id || index"
          :class="{ active: index === 0 }"
          @click="goPlay(item.episode_order)"
        >
          {{ item.episode_order }}
          <image
            v-if="isEpisodeLocked(item.episode_order)"
            class="episode-lock-tag"
            :src="http_host + '/micro_theatre_two/web/static/images/lock2.png'"
            mode="aspectFit"
          />
        </view>
      </scroll-view>
      <view class="line"></view>
      <view class="label-row p-24">剧照</view>
      <scroll-view class="photo-box" scroll-x="true">
        <view
          class="photo-item"
          v-for="(item, index) in posterList"
          :key="index"
        >
          <image
            :src="item"
            mode="aspectFill"
            class="photo"
            @click="previewImage(index)"
          ></image>
        </view>
      </scroll-view>
      <view class="line"></view>
      <view class="label-row p-24">评论区</view>
      <view class="comment-list-wrap p-24">
        <review :drama-id="dramaId"></review>
      </view>
    </view>
    <view class="bottom-box flex j-c">
      <view
        class="bnt flex j-c a-c"
        :class="{ 'collect-active': isCollect }"
        @click="handleCollect"
      >
        <image
          :src="http_host + '/micro_theatre_two/web/static/images/star-on.png'"
          class="bnt-icon"
          v-if="isCollect"
        ></image>
        <image
          :src="
            http_host + '/micro_theatre_two/web/static/images/star-icon.png'
          "
          class="bnt-icon"
          v-else
        ></image>
        <text>收藏</text>
      </view>
      <view
        class="bnt flex j-c a-c"
        :class="{
          active: !isWholeDramaPurchased,
          'bnt-buy-disabled': isWholeDramaPurchased,
        }"
        @click="onBuyButtonClick"
      >
        <image
          :src="http_host + '/micro_theatre_two/web/static/images/buy-car.png'"
          class="bnt-icon"
        ></image>
        <text>{{ isWholeDramaPurchased ? "已订阅" : "订阅" }}</text>
      </view>
    </view>
    <!--选集弹出层start-->
    <u-popup :show="showInfoPop" :round="32" @close="toggleInfoPop">
      <view class="inf-pop-box">
        <view class="title flex a-c j-b" @click="toggleInfoPop">
          <view>选集</view>
          <u-icon name="arrow-down" color="#2A2E32" size="16"></u-icon>
        </view>
        <view class="mo-list">
          <view
            class="row flex a-c"
            v-for="(item, index) in popupEpisodesPaged"
            :key="item.id || index"
            @click="goPlay(item.episode_order)"
          >
            <view class="cover-box" v-if="dramaInfo.cover_image">
              <image
                :src="dramaInfo.cover_image"
                class="cover"
                mode="aspectFill"
              ></image>
              <image
                v-if="isEpisodeLocked(item.episode_order)"
                class="episode-lock-tag row-lock"
                :src="
                  http_host + '/micro_theatre_two/web/static/images/lock2.png'
                "
                mode="aspectFit"
              />
            </view>
            <view class="mo">
              <view class="name">{{
                item.episode_title || "第" + item.episode_order + "集"
              }}</view>
              <view class="desc">{{ item.description || "暂无简介" }}</view>
            </view>
          </view>
        </view>
        <view class="popup-page-bar flex a-c j-b" v-if="episodePageCount > 1">
          <view
            class="popup-page-btn"
            :class="{ disabled: popupEpisodePage <= 1 }"
            @click="popupEpisodePrev"
            >上一页</view
          >
          <text class="popup-page-num"
            >{{ popupEpisodePage }} / {{ episodePageCount }}</text
          >
          <view
            class="popup-page-btn"
            :class="{ disabled: popupEpisodePage >= episodePageCount }"
            @click="popupEpisodeNext"
            >下一页</view
          >
        </view>
      </view>
    </u-popup>
    <!--选集弹出层end-->
    <!--订阅弹出层start：须传入 dramaId / 详情 / 剧集，否则 buyMovie 无法拉价会显示 ¥0.00 -->
    <u-popup :show="showBuyPop" :round="32" @close="closeBuyPop">
      <buyMovie
        v-if="showBuyPop && dramaId && episodeList.length"
        :key="'buy-' + dramaId"
        :drama-id="dramaId"
        :drama-info="dramaInfo"
        :episode-list="episodeList"
        :current-episode="Number(defaultBuyEpisodeOrder) || 1"
        :free-episode-count="0"
        :hide-ad-unlock="true"
        @purchase-success="handlePurchaseSuccess"
        @close="closeBuyPop"
      />
    </u-popup>
    <!--订阅弹出层end-->
  </view>
</template>

<script>
import url from "@/utils/request.js";
import review from "@/micro_theatre_two/components/review/review.vue";
import buyMovie from "@/micro_theatre_two/components/buyMovie/buyMovie.vue";
import * as globalData from "@/utils/config";
import {
  ensureMtLogin,
  formatMtNeedLoginMsg,
  isMtLoggedIn,
} from "@/micro_theatre_two/utils/mt_auth.js";

function request(config = {}) {
  const reqUrl = config.url || "";
  const reqData = config.data || {};
  const reqMethod = config.method || "POST";
  return url.request(reqUrl, reqData, reqMethod);
}
export default {
  components: { review, buyMovie },
  data() {
    return {
      customer_id:
        this.vuex_customer_id || Number(globalData.customer_id || 0) || 0,
      http_host: (() => {
        const u =
          this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
            ? this.vuex_apiUrl
            : globalData.apiUrl || "";
        return String(u).replace(/\/+$/, "");
      })(),
      isCollect: false,
      dramaId: "",
      dramaInfo: {},
      episodeList: [],
      segmentList: [],
      currentSegment: 0,
      pageSize: 20,
      /** 接口返回：剧集总条数 count、总页数 pageCount（与 list 分页一致） */
      episodeTotalCount: 0,
      episodePageCount: 1,
      /** 选集弹窗当前页（1 起） */
      popupEpisodePage: 1,
      showInfoPop: false,
      showDesc: false,
      showBuyPop: false,
      // 与播放页一致：整剧已购 / 单集已购
      isWholeDramaPurchased: false,
      purchasedEpisodes: {},
      posterList: [
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/poster/info1.png",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/poster/info2.png",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/poster/image-1.png",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/poster/info4.png",
      ],
    };
  },
  computed: {
    // 热度：销量（虚拟销量+真实销量）；无字段时兜底 play_count
    heatSales() {
      const info = this.dramaInfo || {};
      const real =
        Number(
          info.sales != null
            ? info.sales
            : info.real_sales != null
              ? info.real_sales
              : 0,
        ) || 0;
      const virtual =
        Number(
          info.virtual_sales != null
            ? info.virtual_sales
            : info.virtual_sale != null
              ? info.virtual_sale
              : info.virtual_sales_count != null
                ? info.virtual_sales_count
                : info.virtual_sales_num != null
                  ? info.virtual_sales_num
                  : 0,
        ) || 0;
      const sum = real + virtual;
      if (sum > 0) return sum;
      const fallback = Number(info.play_count) || 0;
      return fallback;
    },
    // 标签：后台录入逗号分隔，前端拆分为多个 tag
    tagList() {
      const raw = (this.dramaInfo && this.dramaInfo.label) || "";
      const s = String(raw || "").trim();
      if (!s) return [];
      return s
        .split(/[,，]/)
        .map((x) => String(x).trim())
        .filter(Boolean);
    },
    /** 展示用集数：优先接口 count，与分页一致 */
    displayEpisodeTotal() {
      const n = Number(this.episodeTotalCount);
      if (Number.isFinite(n) && n > 0) return n;
      const list = this.episodeList || [];
      if (list.length) {
        const max = list.reduce((m, e) => {
          const n = Number(e.episode_order);
          return Number.isFinite(n) && n > 0 ? Math.max(m, Math.floor(n)) : m;
        }, 0);
        if (max > 0) return max;
        return list.length;
      }
      return Number(this.dramaInfo.total_episodes) || 0;
    },
    // 当前分段要展示的剧集（带封面等信息）
    visibleEpisodes() {
      if (!this.episodeList.length) return [];
      if (!this.segmentList.length) return this.episodeList;
      const seg = this.segmentList[this.currentSegment] || this.segmentList[0];
      const start = seg.start;
      const end = seg.end;
      // 根据 episode_order 过滤当前分段的剧集
      return this.episodeList.filter((ep) => {
        const num = Number(ep.episode_order) || 0;
        return num >= start && num <= end;
      });
    },
    /** 全部已合并剧集，按集序排序（供弹窗分页切片） */
    allEpisodesForPopup() {
      const list = (this.episodeList || []).slice();
      list.sort((a, b) => Number(a.episode_order) - Number(b.episode_order));
      return list;
    },
    /** 选集弹窗当前页数据：按 pageSize、popupEpisodePage 切片，总页数来自接口 pageCount */
    popupEpisodesPaged() {
      const list = this.allEpisodesForPopup;
      const ps = this.pageSize || 20;
      const maxPage = Math.max(1, Number(this.episodePageCount) || 1);
      let p = Number(this.popupEpisodePage) || 1;
      if (p < 1) p = 1;
      if (p > maxPage) p = maxPage;
      const start = (p - 1) * ps;
      return list.slice(start, start + ps);
    },
    /** 订阅弹窗默认选中的集数：当前分段第一个，否则全列表第一集 */
    defaultBuyEpisodeOrder() {
      const vis = this.visibleEpisodes;
      if (vis && vis.length) {
        const n = Number(vis[0].episode_order);
        return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
      }
      const list = this.episodeList;
      if (list && list.length) {
        const n = Number(list[0].episode_order);
        return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
      }
      return 1;
    },
    plainDescription() {
      const raw = (this.dramaInfo && this.dramaInfo.description) || "";
      const text = String(raw)
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
      return text;
    },
    shortDescription() {
      const text = this.plainDescription;
      if (!text) return "暂无简介";
      if (text.length <= 75) return text;
      return text.slice(0, 75) + "...";
    },
    /** 价格角标小图标：随 http_host 更新；模板用 aspectFit，避免 widthFix 在 flex 内高度塌成 0 */
    scoreIconSrc() {
      const h = String(this.http_host || "").replace(/\/+$/, "");
      return h + "/micro_theatre_two/web/static/images/score-icon.png";
    },
  },
  onLoad(options) {
    this.syncMicroTheatreHttpHost();
    this.dramaId = options.id;
    console.log("ID==", this.dramaId);
    this.getDataInfo();
    this.getEpisodeList();
    this.fetchPurchaseStatus();
  },
  onShow() {
    this.syncMicroTheatreHttpHost();
    if (this.dramaId) this.fetchPurchaseStatus();
  },
  methods: {
    syncMicroTheatreHttpHost() {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      this.http_host = String(u).replace(/\/+$/, "");
    },
    /** 未解锁：收费集且未订阅；fee_type=1（或 is_charged=2）为免费集不锁 */
    isEpisodeLocked(episodeOrder) {
      const n = Number(episodeOrder);
      if (!Number.isFinite(n) || n <= 0) return false;
      const ep = (this.episodeList || []).find(
        (e) => Number(e.episode_order) === Math.floor(n),
      );
      if (ep && typeof ep === "object") {
        if (Number(ep.fee_type) === 1) return false;
      }
      if (this.isWholeDramaPurchased) return false;
      if (this.purchasedEpisodes[Math.floor(n)]) return false;
      return true;
    },
    fetchPurchaseStatus() {
      if (!this.dramaId) return;
      request({
        url: "/micro_theatre_two/web/index.php?m=order_data&a=get_user_purchase_status",
        method: "POST",
        data: { drama_id: this.dramaId },
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
              const x = Number(v);
              if (Number.isFinite(x) && x > 0) map[Math.floor(x)] = true;
            });
            this.purchasedEpisodes = map;
          }
        })
        .catch(() => {});
    },
    /** 整剧已购时不打开订阅弹窗 */
    onBuyButtonClick() {
      if (this.isWholeDramaPurchased) return;
      this.toggleBuyPop();
    },
    async toggleBuyPop() {
      // 打开订阅弹窗前确保有剧集列表，避免弹窗“集数空白”
      if (!this.showBuyPop) {
        if (!this.episodeList || this.episodeList.length === 0) {
          await this.getEpisodeList();
        }
      }
      this.showBuyPop = !this.showBuyPop;
    },
    /** 仅关闭订阅弹窗（勿用 toggle：支付成功后会先置 false 再 emit close，toggle 会误打开） */
    closeBuyPop() {
      this.showBuyPop = false;
    },
    /** 关闭本页底部弹窗（选集 + 订阅） */
    closeAllPopups() {
      this.showBuyPop = false;
      this.showInfoPop = false;
    },
    async toggleInfoPop() {
      const next = !this.showInfoPop;
      if (next && (!this.episodeList || this.episodeList.length === 0)) {
        await this.getEpisodeList();
      }
      if (next) {
        this.popupEpisodePage = 1;
      }
      this.showInfoPop = next;
    },
    popupEpisodePrev() {
      if (this.popupEpisodePage <= 1) return;
      this.popupEpisodePage -= 1;
    },
    popupEpisodeNext() {
      if (this.popupEpisodePage >= this.episodePageCount) return;
      this.popupEpisodePage += 1;
    },
    toggleDesc() {
      this.showDesc = !this.showDesc;
    },
    /** 按已返回的剧集列表生成 1-20 / 21-40… 分段（范围以实际上架集的最大集序为准） */
    buildEpisodeSegmentsFromList(list) {
      const segs = [];
      if (!list || !list.length) return segs;
      let maxOrder = 0;
      for (let i = 0; i < list.length; i++) {
        const n = Number(list[i].episode_order);
        if (Number.isFinite(n) && n > 0) {
          maxOrder = Math.max(maxOrder, Math.floor(n));
        }
      }
      if (maxOrder <= 0) return segs;
      const ps = this.pageSize || 20;
      for (let start = 1; start <= maxOrder; start += ps) {
        const end = Math.min(start + ps - 1, maxOrder);
        segs.push({ start, end });
      }
      return segs;
    },
    // 获取详情
    getDataInfo() {
      let that = this;
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=drama_detail",
        method: "POST",
        data: {
          id: that.dramaId,
        },
      })
        .then((res) => {
          if (res.errcode == 0) {
            that.dramaInfo = res.data.info;
            that.isCollect = Number(res.data.info.isCollect) === 1;
            // 剧照列表
            const images = res.data.images || [];
            that.posterList = images.map((item) => item.img_url);
          }
        })
        .catch((ret) => {
          console.log(ret);
        });
    },
    // 获取剧集列表
    async getEpisodeList() {
      try {
        const firstRes = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=episode_list",
          method: "POST",
          data: {
            drama_id: this.dramaId,
            page: 1,
            page_size: this.pageSize,
          },
        });

        if (!(firstRes && firstRes.errcode == 0 && firstRes.data)) {
          this.episodeList = [];
          this.segmentList = [];
          this.episodeTotalCount = 0;
          this.episodePageCount = 1;
          return;
        }

        const data = firstRes.data;
        const firstList = data.list || [];
        const pageSize = Number(data.page_size) || this.pageSize || 20;
        const total = Number(data.count) || firstList.length || 0;
        const pages =
          Number(data.pageCount) ||
          (pageSize > 0 ? Math.ceil(total / pageSize) : 1);

        this.pageSize = pageSize;
        this.episodeTotalCount = total;
        this.episodePageCount = Math.max(1, pages);

        this.episodeList = firstList.slice();

        if (pages <= 1) {
          this.segmentList = this.buildEpisodeSegmentsFromList(
            this.episodeList,
          );
          this.currentSegment = 0;
          this.syncPopupEpisodePage();
          return;
        }

        // 按接口 pageCount（或由 count/page_size 推算的 pages）逐页拉取并合并
        let allList = firstList.slice();
        for (let page = 2; page <= pages; page++) {
          const r = await request({
            url: "/micro_theatre_two/web/index.php?m=index_data&a=episode_list",
            method: "POST",
            data: {
              drama_id: this.dramaId,
              page,
              page_size: pageSize,
            },
          });
          if (r && r.errcode == 0 && r.data && r.data.list) {
            allList = allList.concat(r.data.list || []);
          }
        }

        allList.sort(
          (a, b) => Number(a.episode_order) - Number(b.episode_order),
        );
        this.episodeList = allList;
        this.segmentList = this.buildEpisodeSegmentsFromList(this.episodeList);
        this.currentSegment = 0;
        this.syncPopupEpisodePage();
      } catch (e) {
        // 失败时保持已有数据（至少第一页）
        if (!this.episodeList) this.episodeList = [];
        if (!this.segmentList) this.segmentList = [];
      }
    },
    /** 弹窗页码不超出接口返回的总页数 */
    syncPopupEpisodePage() {
      const max = Math.max(1, Number(this.episodePageCount) || 1);
      let p = Number(this.popupEpisodePage) || 1;
      if (p > max) p = max;
      if (p < 1) p = 1;
      this.popupEpisodePage = p;
    },
    // 收藏/取消收藏（后端 theatre_drama_likes：type=2 收藏，type=1 点赞）
    handleCollect() {
      if (!this.dramaId) {
        uni.showToast({ title: "短剧信息异常", icon: "none" });
        return;
      }
      if (!ensureMtLogin(this, "收藏")) {
        return;
      }
      const that = this;
      url
        .request(
          "/micro_theatre_two/web/index.php?m=index_data&a=toggle_drama_like",
          {
            drama_id: that.dramaId,
            type: 2,
          },
          "POST",
          true,
        )
        .then((res) => {
          if (res && res.errcode == 0) {
            if (res.data && typeof res.data.isCollect !== "undefined") {
              that.isCollect = Number(res.data.isCollect) === 1;
            } else {
              that.isCollect = !that.isCollect;
            }
            uni.showToast({
              title: that.isCollect ? "已收藏" : "已取消收藏",
              icon: "none",
            });
            that.getDataInfo();
            return;
          }
          uni.showToast({
            title: formatMtNeedLoginMsg(res && res.errmsg, "收藏"),
            icon: "none",
            duration: 2500,
          });
        })
        .catch((ret) => {
          const msg =
            ret && ret.errmsg
              ? formatMtNeedLoginMsg(ret.errmsg, "收藏")
              : isMtLoggedIn(that)
                ? "网络异常，请稍后重试"
                : "请先登录后再收藏";
          uni.showToast({ title: msg, icon: "none", duration: 2500 });
        });
    },
    // 观影券等支付成功后：关掉所有弹窗并刷新数据（与 buyMovie 的 close 顺序兼容）
    handlePurchaseSuccess() {
      this.closeAllPopups();
      this.getDataInfo();
      this.getEpisodeList();
      this.fetchPurchaseStatus();
    },
    goPlay(index) {
      uni.redirectTo({
        url:
          "/micro_theatre_two/pages/play_video_simple/play_video_simple?id=" +
          encodeURIComponent(this.dramaId || "") +
          "&num=" +
          encodeURIComponent(String(index)),
      });
    },
    goBuy() {
      uni.navigateTo({
        url: "/micro_theatre_two/pages/vip/vip",
      });
    },
    // 图片预览
    previewImage(index) {
      uni.previewImage({
        current: index, // 当前显示图片的索引
        urls: this.posterList, // 需要预览的图片列表
        indicator: "number", // 显示页码
        loop: true, // 循环预览
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.playlet-info-box {
  // background: url('/micro_theatre_two/web/static/images/info-bg.png') no-repeat;
  // background-size: 100%;
  .inf-pop-box {
    border-top-right-radius: 32rpx;
    border-top-left-radius: 32rpx;
    background-color: #f8f7f5;
    padding: 0 24rpx;
    .title {
      padding: 32rpx;
    }
    .mo-list {
      padding-bottom: 24rpx;
      max-height: 560rpx;
      overflow-y: auto;
    }
    .popup-page-bar {
      padding: 16rpx 8rpx 32rpx;
      font-size: 26rpx;
      color: #221f18;
      border-top: 1rpx solid rgba(0, 0, 0, 0.06);
    }
    .popup-page-num {
      color: #868582;
      font-size: 24rpx;
    }
    .popup-page-btn {
      padding: 12rpx 24rpx;
      color: #25dad1;
      &.disabled {
        color: #c8c6c2;
        pointer-events: none;
      }
    }
    .row {
      padding: 16rpx;
      border-radius: 16rpx;
      margin-bottom: 16rpx;
      background-color: white;
      cursor: pointer;
      .cover-box {
        position: relative;
        margin-right: 24rpx;
        .cover {
          width: 66rpx;
          height: 88rpx;
          border-radius: 8rpx;
        }
        .episode-lock-tag.row-lock {
          position: absolute;
          top: 2rpx;
          right: 2rpx;
          width: 28rpx;
          height: 28rpx;
          z-index: 1;
        }
      }
      .mo {
        width: 80%;
      }
      .name {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .desc {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #868582;
      }
    }
  }
  .content-box {
    padding-bottom: 120rpx;
  }
  .bottom-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16rpx 0 50rpx;
    background-color: #f8f7f5;
    .collect-active {
      text {
        color: #ffc107 !important;
      }
    }
    .bnt {
      width: 339rpx;
      height: 72rpx;
      line-height: 72rpx;
      border-radius: 16rpx;
      .bnt-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 16rpx;
      }
    }
    .active {
      background-color: #25dad1;
      margin-left: 24rpx;
    }
    .bnt-buy-disabled {
      margin-left: 24rpx;
      background-color: #e8e7e4 !important;
      color: #868582;
      pointer-events: none;
      text {
        color: #868582;
      }
    }
  }
  .photo-box {
    white-space: nowrap;
    width: 100%;
    margin-top: 16rpx;
    .photo-item {
      display: inline-block;
      margin-right: 16rpx;
      &:first-child {
        margin-left: 24rpx;
      }
      .photo {
        width: 188rpx;
        height: 250rpx;
        border-radius: 16rpx;
      }
    }
  }
  .line {
    margin: 39rpx 24rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);
  }
  .set-box {
    white-space: nowrap;
    width: 100%;
    .active {
      background: linear-gradient(136.74deg, #0ff8ec 0.61%, #fcb629 103.83%);
    }
    .num {
      display: inline-block;
      position: relative;
      vertical-align: top;
      background-color: rgba(0, 0, 0, 0.08);
      width: 80rpx;
      height: 80rpx;
      border-radius: 16rpx;
      text-align: center;
      line-height: 80rpx;
      color: #221f18;
      margin-right: 16rpx;
      &:first-child {
        margin-left: 24rpx;
      }
      &:last-child {
        margin-right: 24rpx;
      }
      .episode-lock-tag {
        position: absolute;
        top: 4rpx;
        right: 4rpx;
        width: 28rpx;
        height: 28rpx;
        z-index: 1;
        pointer-events: none;
      }
    }
  }
  .step-row {
    font-size: 26rpx;
    color: #868582;
    .active {
      color: #221f18;
    }
    .step-item {
      margin-right: 48rpx;
    }
  }
  .m-b-24 {
    margin-bottom: 24rpx;
  }
  .p-24 {
    padding: 0 24rpx;
  }
  .comment-list-wrap {
    padding-bottom: 24rpx;
  }
  .label-row {
    margin-bottom: 16rpx;

    .open {
      font-size: 24rpx;
      color: #25dad1;
    }
    .gray {
      color: #868582;
      font-size: 24rpx;
    }
    .arrow-right {
      margin-left: 8rpx;
    }
  }
  .introduce-box {
    padding: 24rpx 24rpx 0;
    margin-bottom: 40rpx;
    .introduce {
      color: #868582;
      font-size: 26rpx;
      line-height: 42rpx;
      max-height: 126rpx;
      overflow: hidden;
      border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);
      padding-bottom: 39rpx;
      transition: max-height 0.2s ease;
      .introduce-text {
        display: block;
      }
    }
    .introduce.expanded {
      max-height: none;
    }
  }
  .playet-info {
    padding: 24rpx;
    .playlet-pic-box {
      margin-right: 24rpx;
      .playlet-pic {
        width: 152rpx;
        height: 200rpx;
        border-radius: 16rpx;
      }
    }
    .playet-m {
      flex: 6;
      height: 200rpx;
      position: relative;
      .title-box {
        align-items: flex-start;
        .score-box {
          background: rgba(255, 193, 7, 0.48);
          color: #7a4f01;
          padding: 10rpx 12rpx;
          border-radius: 50rpx;
          min-width: 78rpx;
          font-size: 24rpx;
          .score-icon {
            width: 24rpx;
            height: 24rpx;
            margin-right: 8rpx;
          }
        }
      }
      .title {
        font-size: 32rpx;
        margin-bottom: 8rpx;
      }
      .desc {
        color: #868582;
        font-size: 26rpx;
        text {
          margin-right: 20rpx;
        }
      }
      .tags-box {
        position: absolute;
        bottom: 0;
        width: 100%;
        left: 0;
        z-index: 1;
        .tag {
          height: 44rpx;
          padding: 0 16rpx;
          border-radius: 12rpx;
          background: rgba(0, 0, 0, 0.08);
          color: #868582;
          font-size: 24rpx;
          line-height: 44rpx;
          margin-right: 14rpx;
        }
      }
    }
  }
}
</style>
