<template>
  <view class="vip-box">
    <view class="top-bg">
      <view class="glow-left"></view>
      <view class="glow-right"></view>
    </view>

    <view class="user-box flex a-c">
      <image
        :src="normalizeAvatarUrl(userHeadImg)"
        class="user-pic"
        mode="aspectFill"
      />
      <view class="user-info">
        <view class="user-name flex a-c">
          <view class="u-name-txt">{{ userName || "" }}</view>
          <view class="vip-icon-txt" v-if="vipStatus === 1">{{
            vipLevelName || "VIP"
          }}</view>
          <!-- <image :src="http_host+'/micro_theatre_two/web/static/images/vip-icon.png'" 
					class="vip-icon" mode="widthFix"></image> -->
        </view>
        <view class="user-date">{{ vipExpireText }}</view>
      </view>
    </view>

    <view class="type-box">
      <view
        class="type-item"
        :class="{ active: currentLevelIndex === index }"
        v-for="(item, index) in vipLevels"
        :key="item.level_name || item.id || index"
        @click="handleSelectLevel(index)"
      >
        {{ item.level_name || item.name }}
      </view>
    </view>

    <view class="plan-box">
      <view
        class="plan-item"
        :class="{ active: selectedPlanIndex === index }"
        v-for="(plan, index) in currentPlans"
        :key="plan.id || plan.days || index"
        @click="handleSelectPlan(index)"
      >
        <view class="plan-price">
          <text class="unit">¥</text>{{ plan.price }}
        </view>
        <view class="plan-text">{{
          plan.combo_name || plan.days + "天会员体验"
        }}</view>
      </view>
    </view>

    <view class="record-wrap">
      <view class="record-btn" @click="goRecord">开通记录</view>
    </view>

    <view class="intro-text">
      <rich-text :nodes="vipOpenDesc"></rich-text>
    </view>

    <view class="bottom-box">
      <view class="open-btn" @click="handleOpenVip">
        <text>立即开通</text>
        <text>¥{{ selectedPlanPrice }}</text>
      </view>
    </view>
    <pagecom :datas="template_data"></pagecom>
  </view>
</template>

<script>
import url from "@/utils/request.js";
import empty from "@/micro_theatre_two/components/empty/empty.vue";
import pagecom from "@/components/pagecom/pagecom.vue";
import * as globalData from "@/utils/config";
import { payPathLog } from "@/micro_theatre_two/utils/pay_path_log.js";
import { savePlayVideoSimplePayResume } from "@/micro_theatre_two/utils/pay_return_resume.js";

function request(config = {}) {
  const reqUrl = config.url || "";
  const reqMethod = (config.method || "POST").toUpperCase();
  const reqData = config.data || {};
  return url.request(reqUrl, reqData, reqMethod);
}
export default {
  components: {
    empty,
    pagecom,
  },
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
      userName: "",
      userHeadImg: "",
      vipExpireText: "",
      vipStatus: 0, // 1未过期 0未开通/已过期
      vipLevelName: "",
      vipOpenDesc: "",
      vipLevels: [],
      currentLevelIndex: 0,
      selectedPlanIndex: 0,
      /** 支付完成回跳分包路径；可由入口 query 传入 return_path / pay_return_path */
      payReturnPath: "",
    };
  },
  onLoad(res) {
    const query = (this.$Route && this.$Route.query) || res || {};
    const raw =
      query.return_path ||
      query.pay_return_path ||
      query.payReturnPath ||
      query.callback_path ||
      "";
    let decoded = String(raw || "").trim();
    if (decoded) {
      try {
        decoded = decodeURIComponent(decoded);
      } catch (e) {
        /* 保持原样 */
      }
    }
    this.payReturnPath = decoded;
    this.syncMicroTheatreHttpHost();
    this.fetchVipLevels();
    this.fetchUserVipInfo();
    this.fetchRechargePageConfig();
  },
  onShow() {
    uni.$emit("onShow");
    this.syncMicroTheatreHttpHost();
  },
  computed: {
    currentPlans() {
      const lv = this.vipLevels[this.currentLevelIndex];
      return lv && lv.packages ? lv.packages : [];
    },
    selectedPlanPrice() {
      const plan = this.currentPlans[this.selectedPlanIndex] || {};
      return plan.price ?? "";
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
    normalizeAvatarUrl(raw) {
      const host = String(this.http_host || "").replace(/\/+$/, "");
      const fallback = host + "/HTML/images/default-imgs/default_headimg.png";
      if (!raw) return fallback;
      const url = String(raw).trim();
      if (!url) return fallback;
      if (/^https?:\/\//i.test(url)) return url;
      const normalizedPath = url.replace(/\\/g, "/").replace(/^\/+/, "");
      const plainPath = normalizedPath.split("?")[0].toLowerCase();
      if (plainPath === "html/images/default-imgs/default_headimg.png") {
        return host + "/" + normalizedPath;
      }
      return url;
    },
    // 说明文案：复用「充值页配置」的后台字段 recharge_open_desc
    async fetchRechargePageConfig() {
      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=recharge_page_config",
          method: "POST",
          data: {},
        });
        if (res && res.errcode === 0 && res.data) {
          this.vipOpenDesc = res.data.recharge_open_desc || this.vipOpenDesc;
        }
      } catch (e) {
        // 静默失败
      }
    },
    async fetchVipLevels() {
      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=combo_list",
          method: "POST",
          data: {},
        });

        const list = res && res.errcode === 0 ? res.data || [] : [];
        if (!Array.isArray(list) || !list.length) {
          this.vipLevels = [];
          return;
        }

        // 用 level_name 分组：同一等级下有多个套餐（不同有效天数/价格）
        const map = {};
        list.forEach((row) => {
          const typeName = row.level_name || row.name || "";
          if (!typeName) return;

          if (!map[typeName]) map[typeName] = [];
          map[typeName].push(row);
        });

        const groups = Object.keys(map).map((typeName) => {
          const rows = map[typeName] || [];
          rows.sort((a, b) => {
            const da = Number(a.validity_days ?? a.days ?? a.duration ?? 0);
            const db = Number(b.validity_days ?? b.days ?? b.duration ?? 0);
            return da - db;
          });

          return {
            level_name: typeName,
            sortKey: Number(rows[0]?.level_id ?? rows[0]?.level ?? 0),
            packages: rows.map((r, idx) => ({
              id: r.id || idx,
              price: r.price ?? r.yuan_price ?? "",
              days: Number(r.validity_days ?? r.days ?? r.duration ?? 0),
              combo_name: r.combo_name || "",
              raw: r,
            })),
          };
        });

        groups.sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
        this.vipLevels = groups;
        this.currentLevelIndex = 0;
        this.selectedPlanIndex = 0;
      } catch (e) {
        // 请求失败则保持空数据，不影响页面打开
        this.vipLevels = [];
      }
    },
    async fetchUserVipInfo() {
      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=user_detail",
          method: "POST",
          data: {},
        });
        if (res && res.errcode === 0 && res.data) {
          const info = res.data || {};
          const userInfo = info.user_info || {};
          this.userName = userInfo.weixin_name || userInfo.nickName || "";
          this.userHeadImg = userInfo.headimgurl || "";

          this.vipStatus =
            Number(info.level && info.level.vip_status) === 1 ? 1 : 0;
          this.vipLevelName =
            info.level && info.level.level_name
              ? String(info.level.level_name)
              : "";
          const vipTime = info.vip_time;
          if (
            vipTime !== undefined &&
            vipTime !== null &&
            String(vipTime) !== ""
          ) {
            // vip_time 可能是时间戳(秒)或可解析日期字符串
            const ts = Number(vipTime);
            let dt = null;
            if (Number.isFinite(ts) && ts > 1000000000) {
              // 秒级时间戳
              dt = new Date(ts * 1000);
            } else {
              // 日期字符串：交给 Date 解析
              const t = Date.parse(String(vipTime));
              dt = Number.isFinite(t) ? new Date(t) : null;
            }

            if (dt) {
              const yyyy = dt.getFullYear();
              const mm = String(dt.getMonth() + 1).padStart(2, "0");
              const dd = String(dt.getDate()).padStart(2, "0");
              this.vipExpireText =
                this.vipStatus === 1
                  ? `有效期至${yyyy}-${mm}-${dd}`
                  : "VIP已过期";
            } else {
              this.vipExpireText =
                this.vipStatus === 1 ? "有效期至未知" : "VIP已过期";
            }
          } else {
            this.vipExpireText = "VIP未开通";
          }
        }
      } catch (e) {
        // 静默失败
      }
    },
    handleSelectLevel(index) {
      this.currentLevelIndex = index;
      this.selectedPlanIndex = 0;
    },
    handleSelectPlan(index) {
      this.selectedPlanIndex = index;
    },
    goRecord() {
      uni.navigateTo({
        url: "/micro_theatre_two/pages/vip/open_record/open_record",
      });
    },
    /** 与 score / buyMovie 一致：App 支付桥 / 小程序收银台回跳 */
    buildAppPayCallbackPath() {
      const custom = String(this.payReturnPath || "").trim();
      if (custom) {
        return custom.charAt(0) === "/" ? custom : "/" + custom;
      }
      return "/micro_theatre_two/pages/vip/open_vip";
    },
    // 点击立即开通：若套餐带外部链接则直接打开，否则走下单支付
    handleOpenVip() {
      const lv = this.vipLevels[this.currentLevelIndex] || {};
      const plan = (lv.packages || [])[this.selectedPlanIndex] || {};
      const raw = plan.raw || plan || {};

      // 常见字段兜底：若后台配置了外部链接，则直接打开
      const url =
        raw.ios_url ||
        raw.itunes_url ||
        raw.apple_url ||
        raw.appstore_url ||
        raw.link ||
        raw.open_url ||
        "";

      if (url) {
        // 外链支付/订阅由系统处理
        uni.openURL({ url });
        return;
      }

      const comboId = raw.id || plan.id || 0;
      if (!comboId) {
        uni.showToast({ title: "套餐信息异常，缺少 combo_id", icon: "none" });
        return;
      }

      uni.showLoading({ title: "处理中...", mask: true });
      request({
        url: "/micro_theatre_two/web/index.php?m=order_data&a=vip_open_add",
        method: "POST",
        data: { combo_id: comboId },
      })
        .then((res) => {
          uni.hideLoading();
          if (res && res.errcode === 0 && res.data && res.data.pay_url) {
            this.handlePaymentFlow(res.data);
            return;
          }
          uni.showToast({
            title: (res && res.errmsg) || "下单失败",
            icon: "none",
            duration: 2000,
          });
        })
        .catch(() => {
          uni.hideLoading();
          uni.showToast({ title: "网络异常，请重试", icon: "none" });
        });
    },

    // 支付流程（同 score：H5 表单 / 小程序收银台 / App 走 app_pay 桥）
    handlePaymentFlow(payData) {
      if (!payData) {
        uni.showToast({ title: "支付参数异常", icon: "none" });
        return;
      }

      savePlayVideoSimplePayResume(this.buildAppPayCallbackPath());

      payPathLog(
        this,
        "【开通会员 open_vip】支付分支：pay_type≠1 表单/WebView；pay_type=1 直连 pay_url",
        {
          pay_type: payData.pay_type,
          has_pay_url: !!payData.pay_url,
          order_number: payData.order_number || "",
          batchcode: payData.batchcode || "",
          回跳路径: this.buildAppPayCallbackPath(),
        },
      );

      // pay_type != 1：表单提交；pay_type == 1：直接跳转 pay_url
      if (!payData.pay_type || payData.pay_type != 1) {
        /* #ifdef H5 */
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
          uni.showToast({ title: "支付跳转失败", icon: "none" });
        }
        /* #endif */

        /* #ifdef MP-WEIXIN */
        const app = getApp();
        const backUrl = this.buildAppPayCallbackPath();
        if (app && app.globalData) {
          app.globalData.pay_data = payData.pay_param;
        }
        let app_url = {
          listurl: encodeURIComponent(backUrl),
          mark: "micro_theatre_two",
          back_page_type: "vip_pay",
        };
        uni.redirectTo({
          url:
            "/public/pages/pay/payMethod/payMethod?from=vip&app_url=" +
            JSON.stringify(app_url),
          fail: function () {
            uni.showToast({ title: "跳转支付失败", icon: "none" });
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
            const payPagePath =
              "/micro_theatre_two/pages/app_pay/pay?batchcode=" +
              encodeURIComponent(orderBatch) +
              "&callback_path=" +
              encodeURIComponent(cb) +
              "&order_type=" +
              encodeURIComponent("vip_open_add");
            payPathLog(this, "【开通会员 open_vip】【App】跳转 app_pay/pay", {
              payPagePath,
              callback_path: cb,
            });
            uni.navigateTo({
              url: payPagePath,
              fail: function () {
                uni.showToast({ title: "跳转支付失败", icon: "none" });
              },
            });
            return;
          }
        }
        if (payData.pay_url) {
          const wv =
            "/pages/webview/webview?weburl=" +
            encodeURIComponent(payData.pay_url);
          payPathLog(
            this,
            "【开通会员 open_vip】【App】无订单号，WebView 打开 pay_url",
            {
              wv,
            },
          );
          uni.navigateTo({
            url: wv,
            fail: function () {
              uni.showToast({ title: "跳转支付失败", icon: "none" });
            },
          });
        }
        /* #endif */
      } else {
        /* #ifdef H5 */
        window.location.href = payData.pay_url;
        /* #endif */

        /* #ifndef H5 */
        if (payData.pay_url) {
          uni.navigateTo({
            url:
              "/pages/webview/webview?weburl=" +
              encodeURIComponent(payData.pay_url),
            fail: function () {
              uni.showToast({ title: "跳转支付失败", icon: "none" });
            },
          });
        }
        /* #endif */
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vip-box {
  position: relative;
  min-height: 100vh;
  padding: 0 24rpx 0;
  padding-bottom: 200rpx;
  padding-bottom: calc(200rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(200rpx + env(safe-area-inset-bottom));
  background: #f8f7f5;
  overflow: hidden;
}

.top-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 308rpx;
  overflow: hidden;
}

.glow-left,
.glow-right {
  position: absolute;
  border-radius: 100%;
  filter: blur(10rpx);
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

.user-box {
  position: relative;
  z-index: 1;
  padding-top: 32rpx;
}

.open-btn.disabled {
  opacity: 0.6;
}

.user-pic {
  width: 96rpx;
  height: 96rpx;
  border-radius: 100%;
  flex-shrink: 0;
}

.user-info {
  margin-left: 24rpx;
}

.user-name {
  font-size: 32rpx;
  color: #221f18;
  line-height: 48rpx;

  .vip-icon {
    width: 64rpx;
    height: 32rpx;
    margin-left: 24rpx;
  }
  .vip-icon-txt {
    color: white;
    font-size: 22rpx;
    height: 30rpx;
    line-height: 30rpx;
    padding: 0 12rpx;
    border-radius: 8rpx;
    background: linear-gradient(133deg, #0ff8ec 0%, #fcb629 100%);
    margin-left: 16rpx;
    font-weight: bold;
  }
  .u-name-txt {
    max-width: 400rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.user-date {
  margin-top: 8rpx;
  font-size: 22rpx;
  line-height: 34rpx;
  color: #868582;
}

.type-box {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 4rpx;
  margin: 56rpx auto 32rpx;
  width: 588rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.6);
}

.type-item {
  flex: 1;
  height: 52rpx;
  line-height: 52rpx;
  text-align: center;
  font-size: 24rpx;
  color: #221f18;
  border-radius: 26rpx;
}

.type-item.active {
  color: #ffffff;
  font-weight: 600;
  background: linear-gradient(133deg, #0ff8ec 0%, #fcb629 100%);
}

.plan-box {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 22rpx;
}

.plan-item {
  width: 340rpx;
  padding: 24rpx 0;
  text-align: center;
  border-radius: 16rpx;
  background: #ffffff;
  border: 2rpx solid #ffffff;
  box-sizing: border-box;
}

.plan-item.active {
  border: 2rpx solid transparent;
  background:
    linear-gradient(159deg, #c6fffc 0%, #feffd3 100%) padding-box,
    linear-gradient(133deg, #0ff8ec 0%, #fcb629 100%) border-box;
}

.plan-price {
  font-size: 48rpx;
  font-weight: 600;
  line-height: 72rpx;
  color: #0b807a;

  .unit {
    font-size: 32rpx;
    font-weight: 500;
    line-height: 48rpx;
  }
}

.plan-text {
  margin-top: 8rpx;
  font-size: 28rpx;
  line-height: 44rpx;
  color: #221f18;
}

.record-wrap {
  display: flex;
  justify-content: center;
  margin-top: 48rpx;
}

.record-btn {
  padding: 8rpx 24rpx;
  font-size: 22rpx;
  line-height: 34rpx;
  color: #868582;
  border: 2rpx solid #c4cdd5;
  border-radius: 30rpx;
}

.intro-text {
  margin-top: 40rpx;
  font-size: 22rpx;
  line-height: 34rpx;
  color: #868582;
  white-space: pre-line;
}

.bottom-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 68rpx;
  padding: 0 24rpx;
}

.open-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 24rpx;
  margin-bottom: 72rpx;
  height: 96rpx;
  border-radius: 16rpx;
  background: linear-gradient(157deg, #0ff8ec 0%, #fcb629 100%);
  font-size: 30rpx;
  font-weight: 600;
  line-height: 52rpx;
  color: #221f18;
}

.agree-box {
  margin-top: 32rpx;
  font-size: 22rpx;
  line-height: 32rpx;
  color: #868582;
}

.agree-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}
</style>
