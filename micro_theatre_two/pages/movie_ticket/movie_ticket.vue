<template>
  <view class="ticket-box">
    <view class="summary-box">
      <view class="glow-left"></view>
      <view class="glow-right"></view>
      <view class="summary-mask"></view>
      <view class="summary-info">
        <view>
          <view class="summary-text">我的{{ ticketName }}</view>
          <view class="summary-num">{{ balanceText }}</view>
        </view>
        <view class="cz-bnt" @click="goRecharge">充值</view>
      </view>
    </view>

    <view class="tab-box">
      <view
        v-for="tab in tabs"
        :key="tab"
        class="tab-item"
        :class="{ active: tab === activeTab }"
        @tap="handleChangeTab(tab)"
      >
        <text class="tab-text">{{ tab }}</text>
        <view class="tab-line"></view>
      </view>
    </view>

    <view class="ticket-list">
      <view
        v-for="(item, index) in list"
        :key="item.id || index"
        class="ticket-card"
      >
        <view class="card-main">
          <text class="card-serial">No.{{ item.order_number || "-" }}</text>
          <text class="card-title">{{ item.remark || "-" }}</text>
          <text class="card-time">{{ item.created_at || "-" }}</text>
        </view>
        <text class="card-amount">{{ formatAmount(item) }}</text>
      </view>
      <empty v-if="!list.length && !loading"></empty>
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
  // 用户相关接口很多需要登录态，默认开启 needToken
  return url.request(reqUrl, reqData, reqMethod, true);
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
      ticketName:
        globalData.ticket_name ||
        uni.getStorageSync("recharge_ticket_name") ||
        "观影券",
      balance: 0,
      activeTab: "全部",
      tabs: ["全部", "收入明细", "支出明细"],
      page: 1,
      limit: 20,
      list: [],
      loading: false,
      finished: false,
    };
  },
  computed: {
    balanceText() {
      const n = Number(this.balance) || 0;
      return n.toFixed(2);
    },
  },
  onLoad(res) {
    this.syncMicroTheatreHttpHost();
    this.refresh();
  },
  onShow() {
    uni.$emit("onShow");
    this.syncMicroTheatreHttpHost();
    // 支付完成返回时刷新余额/明细
    this.refresh();
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
    // 跳转到充值页面（支付完成按 return_path 回观影券页，与 score 页 buildAppPayCallbackPath 一致）
    goRecharge() {
      const back = "/micro_theatre_two/pages/movie_ticket/movie_ticket";
      uni.navigateTo({
        url:
          "/micro_theatre_two/pages/score/score?return_path=" +
          encodeURIComponent(back),
      });
    },
    handleChangeTab(tab) {
      this.activeTab = tab;
      this.refresh();
    },
    getInOutParam() {
      if (this.activeTab === "收入明细") return "in";
      if (this.activeTab === "支出明细") return "out";
      return "";
    },
    formatAmount(item) {
      const v = Number(item && item.change_amount) || 0;
      const sign = v > 0 ? "+" : v < 0 ? "-" : "";
      return `${sign}${Math.abs(v).toFixed(2)}${this.ticketName}`;
    },
    refresh() {
      this.page = 1;
      this.list = [];
      this.finished = false;
      this.fetchBalance();
      this.fetchList();
    },
    loadMore() {
      if (this.loading || this.finished) return;
      this.page += 1;
      this.fetchList(false);
    },
    // 余额单独取，避免明细接口字段变动导致数量不准
    fetchBalance() {
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=user_detail",
        method: "POST",
        data: {},
      })
        .then((res) => {
          if (res && res.errcode == 0 && res.data) {
            this.balance = Number(res.data.balance ?? 0) || 0;
            // 充值页会从接口同步观影券名称，这里也顺带兜底更新
            const tn =
              (res.data.ticket_name ||
                (res.data.config && res.data.config.ticket_name)) ??
              "";
            if (tn && String(tn).trim()) {
              this.ticketName = String(tn).trim();
              uni.setStorageSync("recharge_ticket_name", this.ticketName);
            }
          }
        })
        .catch(() => {});
    },
    fetchList() {
      if (this.loading) return;
      this.loading = true;
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=user_balance_log_list",
        method: "POST",
        data: {
          page: this.page,
          limit: this.limit,
          in_out: this.getInOutParam(),
        },
      })
        .then((res) => {
          this.loading = false;
          if (res && res.errcode == 0 && res.data) {
            // 明细字段兼容：list / rows / data
            const rawRows =
              (Array.isArray(res.data.list) && res.data.list) ||
              (Array.isArray(res.data.rows) && res.data.rows) ||
              (Array.isArray(res.data.data) && res.data.data) ||
              [];
            const rows = rawRows.map((it) => it || {});
            this.list = this.list.concat(rows);
            const pageCount =
              Number(res.data.pageCount) ||
              Number(res.data.page_count) ||
              Number(res.data.total_page) ||
              1;
            if (this.page >= pageCount || rows.length < this.limit) {
              this.finished = true;
            }
          } else {
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
.ticket-box {
  min-height: 100vh;
  background: #f8f7f5;
  padding-bottom: 42rpx;
}

.summary-box {
  position: relative;
  height: 192rpx;
  overflow: hidden;
}

.glow-left,
.glow-right {
  position: absolute;
  border-radius: 50%;
  filter: blur(10rpx);
  opacity: 0.95;
}

.glow-left {
  top: -316rpx;
  left: -108rpx;
  width: 648rpx;
  height: 648rpx;
  background: radial-gradient(
    circle,
    rgba(76, 236, 227, 0.88) 0%,
    rgba(76, 236, 227, 0.2) 58%,
    rgba(76, 236, 227, 0) 100%
  );
}

.glow-right {
  top: -234rpx;
  right: -96rpx;
  width: 516rpx;
  height: 516rpx;
  background: radial-gradient(
    circle,
    rgba(245, 220, 145, 0.88) 0%,
    rgba(245, 220, 145, 0.2) 58%,
    rgba(245, 220, 145, 0) 100%
  );
}

.summary-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(180deg, rgba(248, 247, 245, 0) 0%, #f8f7f5 100%);
}

.summary-info {
  padding: 50rpx 30rpx;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cz-bnt {
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 30rpx;
  min-width: 80rpx;
  text-align: center;
  border-radius: 12rpx;
  font-size: 26rpx;
  background: linear-gradient(157deg, #0ff8ec 0%, #fcb629 100%);
  color: white;
  border: 1rpx solid white;
}

.summary-num {
  color: #000000;
  font-size: 48rpx;
  font-weight: 600;
  line-height: 72rpx;
}

.summary-text {
  margin-top: 4rpx;
  color: rgba(0, 0, 0, 0.44);
  font-size: 24rpx;
  font-weight: 400;
  line-height: 36rpx;
}

.tab-box {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 112rpx;
  height: 102rpx;
  padding: 0 24rpx;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.tab-text {
  color: #868582;
  font-size: 32rpx;
  font-weight: 500;
  line-height: 48rpx;
}

.tab-line {
  margin-top: 2rpx;
  width: 66rpx;
  height: 6rpx;
  border-radius: 6rpx;
  opacity: 0;
  background: linear-gradient(90deg, #f3bf4b 0%, #33e8e1 100%);
}

.tab-item.active {
  .tab-text {
    color: #221f18;
  }

  .tab-line {
    opacity: 1;
  }
}

.ticket-list {
  padding: 0 24rpx;
}

.ticket-card {
  display: flex;
  align-items: center;
  column-gap: 4rpx;
  padding: 24rpx 32rpx;
  border-radius: 24rpx;
  background: #ffffff;

  & + .ticket-card {
    margin-top: 16rpx;
  }
}

.card-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  row-gap: 4rpx;
}

.card-serial,
.card-time {
  color: #868582;
  font-size: 24rpx;
  font-weight: 400;
  line-height: 36rpx;
}

.card-title {
  overflow: hidden;
  color: #221f18;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 44rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-amount {
  margin-left: 16rpx;
  color: #ff4842;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 44rpx;
  flex-shrink: 0;
}
</style>
ine-height: 44rpx;
  flex-shrink: 0;
}
</style>
