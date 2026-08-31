<template>
  <view class="recharge-box">
    <view class="header">
      <view class="title">充值记录</view>
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
            isPaid(item) ? "已支付" : "-"
          }}</text>
        </view>

        <view class="card-mid">
          <view class="money-icon">
            <text class="money-symbol">¥</text>
          </view>
          <view class="mid-info">
            <view class="remark">充值观影券：{{ item.ticket_count || 0 }}</view>
            <view class="order-no">订单号：{{ item.order_number || "-" }}</view>
          </view>
          <view class="amount">
            {{ formatAmount(item.real_price) }}
          </view>
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
  const reqData = config.data || {};
  const reqMethod = config.method || "POST";
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
      return Number(item && item.order_state) === 2;
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
        url: "/micro_theatre_two/web/index.php?m=index_data&a=recharge_log_list",
        method: "POST",
        data: {
          page: this.page,
          limit: this.limit,
          order_state: 2,
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
.recharge-box {
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

.recharge-btn {
  font-size: 28rpx;
  color: #221f18;
  font-weight: 600;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 193, 7, 0.25);
}

.record-list {
  padding: 0 24rpx 24rpx;
}

.record-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx 24rpx;
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
  column-gap: 18rpx;
  padding-top: 16rpx;
}

.money-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  background: rgba(255, 193, 7, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.money-symbol {
  color: #b78103;
  font-size: 30rpx;
  font-weight: 700;
}

.mid-info {
  flex: 1;
  min-width: 0;
}

.remark {
  color: #221f18;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 40rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-no {
  margin-top: 6rpx;
  color: #868582;
  font-size: 24rpx;
  line-height: 34rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.amount {
  color: #ff4842;
  font-size: 28rpx;
  font-weight: 700;
  flex-shrink: 0;
}
</style>
