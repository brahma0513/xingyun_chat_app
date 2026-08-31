<template>
  <view class="page">
    <view class="seg-bar">
      <view class="seg-inner">
        <view
          class="seg-item"
          :class="{ active: activeTab === 'full' }"
          @click="switchTab('full')"
        >
          整剧
        </view>
        <view
          class="seg-item"
          :class="{ active: activeTab === 'episode' }"
          @click="switchTab('episode')"
        >
          剧集
        </view>
      </view>
    </view>

    <view class="list-wrap">
      <view
        v-for="(item, index) in list"
        :key="item.order_number || item.id || index"
        class="card"
        @click="goDetail(item)"
      >
        <view class="card-head">
          <text class="order-text">订单号: {{ item.order_number || "-" }}</text>
          <text class="status-text" :class="statusClass(item)">{{
            payStatusText(item)
          }}</text>
        </view>
        <view class="card-divider"></view>
        <view class="card-body">
          <image
            class="poster"
            :src="item.cover_image || defaultCover"
            mode="aspectFill"
          />
          <view class="body-main">
            <view class="title-row">
              <text class="drama-name">{{ item.drama_name || "-" }}</text>
              <text
                v-if="activeTab === 'episode' && showEpisodeTag(item)"
                class="ep-tag"
                >{{ item.episode_display }}</text
              >
            </view>
            <view class="pay-row">
              <text class="pay-label">实付款:</text>
              <text class="pay-value">{{ formatPay(item) }}</text>
            </view>
            <text class="time-text">{{ item.pay_time || "-" }}</text>
          </view>
        </view>
      </view>
      <empty v-if="!loading && list.length === 0"></empty>
    </view>
    <pagecom :datas="template_data"></pagecom>
  </view>
</template>

<script>
import url from "@/utils/request.js";
import empty from "@/micro_theatre_two/components/empty/empty.vue";
import pagecom from "@/components/pagecom/pagecom.vue";
import * as globalData from "@/utils/config";

function request(config = {}) {
  const reqUrl = config.url || "";
  const reqData = config.data || {};
  const reqMethod = config.method || "POST";
  return url.request(reqUrl, reqData, reqMethod);
}

export default {
  components: { empty, pagecom },
  data() {
    return {
      template_data: { has_bottom: true },
      customer_id:
        this.vuex_customer_id || Number(globalData.customer_id || 0) || 0,
      http_host: (() => {
        const u =
          this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
            ? this.vuex_apiUrl
            : globalData.apiUrl || "";
        return String(u).replace(/\/+$/, "");
      })(),
      activeTab: "full",
      page: 1,
      limit: 20,
      list: [],
      loading: false,
      finished: false,
      currencySymbol: globalData.monetary_unit || "¥",
      // 无封面时不使用静态占位图，避免与真实订单混淆
      defaultCover: "",
    };
  },
  onLoad() {
    this.syncMicroTheatreHttpHost();
    this.refresh();
  },
  onShow() {
    uni.$emit("onShow");
    this.syncMicroTheatreHttpHost();
  },
  onReachBottom() {
    this.loadMore();
  },
  onPullDownRefresh() {
    this.page = 1;
    this.list = [];
    this.finished = false;
    this.fetchList(true)
      .then(() => {
        uni.stopPullDownRefresh();
      })
      .catch(() => {
        uni.stopPullDownRefresh();
      });
  },
  methods: {
    syncMicroTheatreHttpHost() {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      this.http_host = String(u).replace(/\/+$/, "");
    },
    typeParam() {
      return this.activeTab === "full" ? 2 : 1;
    },
    switchTab(tab) {
      if (this.activeTab === tab) return;
      this.activeTab = tab;
      this.refresh();
    },
    payStatusText(item) {
      const s = Number(item && item.payment_status);
      if (s === 2) return "已支付";
      if (s === 1) return "未支付";
      if (s === 3) return "支付失败";
      return "-";
    },
    statusClass(item) {
      return Number(item && item.payment_status) === 2 ? "paid" : "";
    },
    showEpisodeTag(item) {
      const t = (item && item.episode_display) || "";
      return t && t !== "整剧";
    },
    formatPay(item) {
      const n = Number(item && item.amount_rmb) || 0;
      // 与下单逻辑对齐：观影券单笔订单仍存 amount_rmb；展示人民币。若后续接口增加 ticket_amount 可再分支
      return `${this.currencySymbol}${n.toFixed(2)}`;
    },
    goDetail(item) {
      const id = item && item.drama_id;
      if (!id) return;
      uni.navigateTo({
        url: "/micro_theatre_two/pages/playlet_info/playlet_info?id=" + id,
      });
    },
    refresh() {
      this.page = 1;
      this.list = [];
      this.finished = false;
      return this.fetchList(true);
    },
    loadMore() {
      if (this.loading || this.finished) return;
      this.page += 1;
      this.fetchList(false);
    },
    fetchList(reset) {
      if (this.loading) return Promise.resolve();
      this.loading = true;
      return request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=purchase_record_list",
        method: "POST",
        data: {
          page: this.page,
          limit: this.limit,
          type: this.typeParam(),
        },
      })
        .then((res) => {
          this.loading = false;
          const rows =
            res && res.errcode === 0 && res.data && Array.isArray(res.data.list)
              ? res.data.list
              : [];
          if (reset) {
            this.list = rows;
          } else {
            this.list = this.list.concat(rows);
          }
          const pageCount = Number(res?.data?.pageCount) || 1;
          if (this.page >= pageCount || rows.length < this.limit) {
            this.finished = true;
          }
        })
        .catch(() => {
          this.loading = false;
          this.finished = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #efefef;
  padding-bottom: 120rpx;
  padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.seg-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx 24rpx 20rpx;
}

.seg-inner {
  display: flex;
  border-radius: 999rpx;
  border: 2rpx solid #d8d8d8;
  overflow: hidden;
  background: #ffffff;
}

.seg-item {
  min-width: 200rpx;
  padding: 18rpx 52rpx;
  font-size: 28rpx;
  color: #3a3a3a;
  background: #ffffff;
  text-align: center;
}

.seg-item + .seg-item {
  border-left: 2rpx solid #d8d8d8;
}

.seg-item.active {
  background: #4a4a4a;
  color: #ffffff;
}

.list-wrap {
  padding: 0 24rpx;
}

.card {
  background: #ffffff;
  border-radius: 16rpx;
  border: 1rpx solid #e0e0e0;
  padding: 24rpx 28rpx 28rpx;
  margin-bottom: 20rpx;
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  column-gap: 16rpx;
}

.order-text {
  flex: 1;
  min-width: 0;
  font-size: 24rpx;
  color: #5c5c5c;
  line-height: 36rpx;
  word-break: break-all;
}

.status-text {
  flex-shrink: 0;
  font-size: 26rpx;
  font-weight: 500;
  color: #868582;
}

.status-text.paid {
  color: #25dad1;
}

.card-divider {
  height: 1rpx;
  background: #e8e8e8;
  margin: 20rpx 0 22rpx;
}

.card-body {
  display: flex;
  align-items: flex-start;
  column-gap: 24rpx;
}

.poster {
  width: 148rpx;
  height: 198rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
  background: #f2f2f2;
}

.body-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 198rpx;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  column-gap: 12rpx;
  margin-bottom: 16rpx;
}

.drama-name {
  flex: 1;
  min-width: 0;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 44rpx;
}

.ep-tag {
  flex-shrink: 0;
  font-size: 26rpx;
  color: #868582;
  line-height: 44rpx;
}

.pay-row {
  display: flex;
  align-items: baseline;
  column-gap: 8rpx;
  margin-bottom: auto;
  padding-bottom: 12rpx;
}

.pay-label {
  font-size: 28rpx;
  color: #1a1a1a;
}

.pay-value {
  font-size: 28rpx;
  font-weight: 500;
  color: #1a1a1a;
}

.time-text {
  font-size: 24rpx;
  color: #a8a8a8;
  line-height: 34rpx;
  margin-top: 4rpx;
}
</style>
