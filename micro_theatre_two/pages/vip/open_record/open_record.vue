<template>
  <view class="open-box">
    <view class="header">
      <view class="title">开通记录</view>
    </view>

    <view class="record-list">
      <view
        v-for="(item, index) in list"
        :key="item.id || item.order_number || index"
        class="record-card"
      >
        <view class="card-top">
          <text class="date-text">{{ item.created_at || "-" }}</text>
          <text class="pay-status" :class="{ paid: isPaid(item) }">{{
            item.payment_status_text || "-"
          }}</text>
        </view>

        <view class="card-mid">
          <view class="vip-icon-wrap">
            <image
              class="vip-crown"
              :src="
                http_host + '/micro_theatre_two/web/static/images/vip-icon.png'
              "
              mode="aspectFit"
            />
          </view>
          <text class="combo-name">{{ item.combo_name || "-" }}</text>
          <text class="duration">{{ item.duration_text || "-" }}</text>
        </view>

        <view class="card-bottom">
          <text class="order-line">订单号:{{ item.order_number || "-" }}</text>
          <text class="pay-amount"
            >实付金额 {{ formatAmount(item.real_price) }}</text
          >
        </view>
      </view>

      <empty v-if="!loading && list.length === 0"></empty>
    </view>
  </view>
</template>

<script>
import url from "@/utils/request.js";
import empty from "@/micro_theatre_two/components/empty/empty.vue";
import * as globalData from "@/utils/config";

function request(config = {}) {
  const reqUrl = config.url || "";
  const reqMethod = (config.method || "POST").toUpperCase();
  const reqData = config.data || {};
  return url.request(reqUrl, reqData, reqMethod);
}

export default {
  components: { empty },
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
      currencySymbol: globalData.monetary_unit || "¥",
      page: 1,
      limit: 20,
      list: [],
      loading: false,
      finished: false,
    };
  },
  onLoad() {
    this.syncMicroTheatreHttpHost();
    this.refresh();
  },
  onShow() {
    this.syncMicroTheatreHttpHost();
  },
  onReachBottom() {
    this.loadMore();
  },
  methods: {
    syncMicroTheatreHttpHost() {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      this.http_host = String(u).replace(/\/+$/, "");
    },
    isPaid(item) {
      return Number(item && item.payment_status) === 2;
    },
    formatAmount(value) {
      const n = Number(value) || 0;
      return `${this.currencySymbol}${n.toFixed(2)}`;
    },
    refresh() {
      this.page = 1;
      this.list = [];
      this.finished = false;
      this.fetchList(true);
    },
    loadMore() {
      if (this.loading || this.finished) return;
      this.page += 1;
      this.fetchList(false);
    },
    fetchList(reset) {
      if (this.loading) return;
      this.loading = true;

      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=level_open_log_list",
        method: "POST",
        data: {
          page: this.page,
          limit: this.limit,
          payment_status: 2,
        },
      })
        .then((res) => {
          this.loading = false;
          if (reset) {
            this.list =
              res &&
              res.errcode === 0 &&
              res.data &&
              Array.isArray(res.data.list)
                ? res.data.list
                : [];
          } else {
            const rows =
              res &&
              res.errcode === 0 &&
              res.data &&
              Array.isArray(res.data.list)
                ? res.data.list
                : [];
            this.list = this.list.concat(rows);
          }

          const pageCount = Number(res?.data?.pageCount) || 1;
          const rowsLen =
            res && res.errcode === 0 && res.data && Array.isArray(res.data.list)
              ? res.data.list.length
              : 0;
          if (this.page >= pageCount || rowsLen < this.limit) {
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
.open-box {
  min-height: 100vh;
  background: #f8f7f5;
}

.header {
  padding: 24rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 600;
  color: #221f18;
}

.record-list {
  padding: 0 24rpx 24rpx;
}

.record-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  + .record-card {
    margin-top: 16rpx;
  }
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #dfe3e8;
}

.date-text {
  color: #868582;
  font-size: 26rpx;
  line-height: 34rpx;
}

.pay-status {
  color: #868582;
  font-size: 26rpx;
  font-weight: 500;
}

.pay-status.paid {
  color: #229a16;
}

.card-mid {
  display: flex;
  align-items: center;
  padding: 20rpx 0 16rpx;
  column-gap: 18rpx;
}

.vip-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffe082 0%, #ffc107 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vip-crown {
  width: 36rpx;
  height: 36rpx;
}

.combo-name {
  flex: 1;
  min-width: 0;
  color: #221f18;
  font-size: 30rpx;
  font-weight: 500;
  line-height: 42rpx;
}

.duration {
  color: #e85d3d;
  font-size: 28rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.card-bottom {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  column-gap: 16rpx;
  padding-top: 4rpx;
}

.order-line {
  flex: 1;
  min-width: 0;
  color: #868582;
  font-size: 24rpx;
  line-height: 34rpx;
  word-break: break-all;
}

.pay-amount {
  color: #221f18;
  font-size: 26rpx;
  font-weight: 500;
  flex-shrink: 0;
}
</style>
