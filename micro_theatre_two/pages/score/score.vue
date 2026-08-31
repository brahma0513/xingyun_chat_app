<template>
  <view class="vip-box" :style="vipBgStyle">
    <view class="user-box flex a-c">
      <view class="pic">
        <image
          :src="normalizeAvatarUrl(userHeadImg)"
          class="user-pic"
          mode="aspectFill"
        ></image>
      </view>
      <view class="info flex a-c j-b">
        <view class="name">{{ userName }}</view>
        <view class="score-box flex j-c a-c">
          <image
            :src="
              http_host + '/micro_theatre_two/web/static/images/score-icon.png'
            "
            class="score-icon"
            mode="aspectFit"
          ></image>
          {{ balanceNum }}
        </view>
      </view>
    </view>
    <scroll-view class="vip-group" scroll-x="true">
      <view
        class="vip-item"
        :class="{ active: index == currentIndex }"
        v-for="(item, index) in scoreList"
        :key="index"
        @click="handleChange(index)"
      >
        <view class="price">{{ currencySymbol }}{{ item.price }}</view>
        <view class="score-box flex j-c a-c">
          <image
            :src="
              http_host + '/micro_theatre_two/web/static/images/score-icon.png'
            "
            class="score-icon"
            mode="aspectFit"
          ></image>
          {{ item.num }}
        </view>

        <view class="tips">{{ item.tips }}</view>
      </view>
    </scroll-view>
    <view class="introduce" v-if="rechargeIntro" v-html="rechargeIntro"></view>
    <view class="bottom-box">
      <view class="bnt" @click="handleOpen">立即充值</view>
      <view class="record-bnt" @click="goRechargeRecord">充值记录</view>
    </view>
  </view>
</template>

<script>
import url from "@/utils/request.js";
import * as globalData from "@/utils/config";
import { payPathLog } from "@/micro_theatre_two/utils/pay_path_log.js";
import { savePlayVideoSimplePayResume } from "@/micro_theatre_two/utils/pay_return_resume.js";

function request(config = {}) {
  const reqUrl = config.url || "";
  const reqData = config.data || {};
  const reqMethod = config.method || "POST";
  return url.request(reqUrl, reqData, reqMethod, true);
}
export default {
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
      userName: "",
      userHeadImg: "",
      balanceNum: "0",
      currencySymbol: globalData.monetary_unit || "¥",
      ticketName:
        globalData.ticket_name ||
        uni.getStorageSync("recharge_ticket_name") ||
        "观影券",
      // 文案由 recharge_page_config 接口下发，避免弱网下展示错误/过时说明
      rechargeIntro: "",
      currentIndex: 0,
      scoreList: [],
      creatingOrder: false,
      /** 支付完成回跳分包路径（须以 / 开头）；可由入口页 query 传入，如 return_path=/micro_theatre_two/pages/play_video_simple/... */
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
    this.fetchRechargePageConfig();
    this.fetchUserDetail();
    this.fetchRechargeList();
  },
  onShow() {
    this.syncMicroTheatreHttpHost();
    // 支付完成返回时刷新余额/文案
    this.fetchRechargePageConfig();
    this.fetchUserDetail();
  },
  computed: {
    vipBgStyle() {
      const h = String(this.http_host || "").replace(/\/+$/, "");
      return {
        backgroundImage: `url(${h}/micro_theatre_two/web/static/images/vip-bg.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      };
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
    /** 后台富文本异常或误存二进制时，避免 v-html 刷满乱码 */
    sanitizeRechargeIntroHtml(raw) {
      const s = String(raw || "").trim();
      if (!s) return "";
      if (s.length > 20000) return "";
      if (/\\{4,}/.test(s)) return "";
      if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s)) return "";
      return s;
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
    // 充值说明&观影券展示名称（后台可配置）
    async fetchRechargePageConfig() {
      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=recharge_page_config",
          method: "POST",
          data: {},
        });
        if (res && res.errcode === 0 && res.data) {
          this.ticketName = res.data.ticket_name || this.ticketName;
          this.rechargeIntro =
            res.data.recharge_open_desc || this.rechargeIntro;
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 顶部用户信息：昵称/头像/余额
    async fetchUserDetail() {
      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=user_detail",
          method: "POST",
          data: {},
        });
        if (res && res.errcode === 0 && res.data) {
          const userInfo = res.data.user_info || {};
          this.userName =
            userInfo.nickName ||
            userInfo.nickname ||
            userInfo.name ||
            this.wexin_name ||
            "";
          this.userHeadImg =
            userInfo.headimgurl || userInfo.head_img || userInfo.avatar || "";
          const bal =
            res.data.balance ??
            res.data.coin ??
            res.data.ticket_balance ??
            res.data.theatre_balance;
          this.balanceNum =
            bal !== undefined && bal !== null ? String(bal) : "0";
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 充值档位列表：recharge_amount / coins_per_rmb / bonus_coins
    async fetchRechargeList() {
      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=recharge_list",
          method: "POST",
          data: {},
        });
        if (res && res.errcode === 0 && Array.isArray(res.data)) {
          const enabledList = res.data.filter((it) => String(it.state) === "0");
          this.scoreList = enabledList.map((it) => {
            const priceNum = Number(it.recharge_amount ?? 0);
            const coinsPerRmb = Number(it.coins_per_rmb ?? 0);
            const bonusCoins = Number(it.bonus_coins ?? 0);

            // 展示规则：
            // - 卡片上“券数量”展示基础数量：coins_per_rmb
            // - tips 展示额外赠送：bonus_coins
            const baseTicketNum = Math.max(0, Math.round(coinsPerRmb));
            const ticketNum = baseTicketNum;
            const tips =
              bonusCoins > 0
                ? `送${Math.round(bonusCoins)}${this.ticketName}`
                : "";

            return {
              id: it.id,
              num: ticketNum,
              price: (Number.isFinite(priceNum) ? priceNum : 0).toFixed(2),
              tips,
            };
          });
          this.currentIndex = 0;
        }
      } catch (e) {
        console.log(e);
      }
    },

    handleChange(index) {
      this.currentIndex = index;
    },

    handleOpen() {
      if (this.creatingOrder) return;
      const item = this.scoreList && this.scoreList[this.currentIndex];
      if (!item || !item.id) {
        uni.showToast({ title: "请选择充值档位", icon: "none" });
        return;
      }
      this.createRechargeOrderAndPay(item.id);
    },

    // 跳转到充值记录页
    goRechargeRecord() {
      uni.navigateTo({
        url: "/micro_theatre_two/pages/recharge_record/recharge_record",
      });
    },

    /** 与 buyMovie 一致：支付桥 / 小程序收银台回跳路径 */
    buildAppPayCallbackPath() {
      const custom = String(this.payReturnPath || "").trim();
      if (custom) {
        return custom.charAt(0) === "/" ? custom : "/" + custom;
      }
      return "/micro_theatre_two/pages/score/score";
    },

    // 创建充值订单并拉起平台支付
    createRechargeOrderAndPay(rechargeId) {
      this.creatingOrder = true;
      uni.showLoading({ title: "处理中...", mask: true });
      request({
        url: "/micro_theatre_two/web/index.php?m=order_data&a=recharge_add",
        method: "POST",
        data: {
          recharge_id: rechargeId,
        },
      })
        .then((res) => {
          uni.hideLoading();
          this.creatingOrder = false;
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
        .catch((e) => {
          uni.hideLoading();
          this.creatingOrder = false;
          console.log(e);
          uni.showToast({ title: "网络异常，请重试", icon: "none" });
        });
    },

    // 支付流程（同 buyMovie：H5 表单 / 小程序公共收银台 / App 走 app_pay 桥）
    handlePaymentFlow(payData) {
      if (!payData) {
        uni.showToast({ title: "支付参数异常", icon: "none" });
        return;
      }

      savePlayVideoSimplePayResume(this.buildAppPayCallbackPath());

      payPathLog(
        this,
        "【充值 score】支付流程分支：pay_type≠1 走表单/WebView；pay_type=1 直连 pay_url",
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
        payPathLog(this, "【充值 score】【H5】表单 POST 至收银台", {
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
          console.error("H5 支付跳转失败:", e);
          uni.showToast({ title: "支付跳转失败", icon: "none" });
        }
        /* #endif */

        /* #ifdef MP-WEIXIN */
        const app = getApp();
        const backUrl = this.buildAppPayCallbackPath();
        if (app && app.globalData) {
          app.globalData.pay_data = payData.pay_param;
        }
        const app_url = {
          listurl: encodeURIComponent(backUrl),
          mark: "micro_theatre_two",
          back_page_type: "recharge_pay",
        };
        const mpNav =
          "/public/pages/pay/payMethod/payMethod?from=recharge&app_url=" +
          JSON.stringify(app_url);
        payPathLog(this, "【充值 score】【微信小程序】公共收银台回跳", {
          listurl: backUrl,
          mpNav,
        });
        uni.redirectTo({
          url: mpNav,
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
              encodeURIComponent("recharge_add");
            payPathLog(this, "【充值 score】【App】跳转 app_pay/pay", {
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
            "【充值 score】【App】无订单号，仅 WebView 打开 pay_url",
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
        payPathLog(this, "【充值 score】【H5】pay_type=1 整页跳转", {
          pay_url: payData.pay_url,
        });
        window.location.href = payData.pay_url;
        /* #endif */

        /* #ifndef H5 */
        if (payData.pay_url) {
          const wv2 =
            "/pages/webview/webview?weburl=" +
            encodeURIComponent(payData.pay_url);
          payPathLog(this, "【充值 score】【非 H5】pay_type=1 WebView", {
            wv2,
          });
          uni.navigateTo({
            url: wv2,
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
  padding: 24rpx 0;
  /* 背景图改为运行时通过 http_host 动态拼接，避免构建期找不到 vip-bg.png */
  background-size: 100%;
  .bottom-box {
    position: fixed;
    bottom: 136rpx;
    left: 0;
    width: 100%;
    .bnt {
      margin: 0 24rpx 16rpx;
      border-radius: 16rpx;
      background-color: #ffc107;
      height: 96rpx;
      line-height: 96rpx;
      text-align: center;
      font-size: 30rpx;
      .money {
        margin-left: 24rpx;
      }
    }

    .record-bnt {
      margin: 0 24rpx 24rpx;
      border-radius: 16rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      font-size: 30rpx;
      color: #221f18;
      background-color: #f8f7f5;
      border: 2rpx solid rgba(134, 133, 130, 0.7);
    }
  }
  .introduce {
    font-size: 22rpx;
    color: #868582;
    line-height: 34rpx;
    margin-top: 60rpx;
    padding: 0 24rpx;
  }
  .vip-group {
    width: 100%;
    white-space: nowrap;
    .active {
      background: #fff7cd !important;
      border-color: #ffe16a !important;
    }
    .vip-item {
      display: inline-block;
      text-align: center;
      width: 252rpx;
      height: 286rpx;
      border-radius: 16rpx;
      background-color: white;
      margin-right: 24rpx;
      border: 2rpx solid #ffffff !important;
      transition: all 0.2s ease-in-out;
      &:first-child {
        margin-left: 24rpx;
      }
      .score-box {
        margin-top: 32rpx;
        display: inline-flex;
      }
      .price {
        font-size: 50rpx;
        font-weight: bolder;
        color: #7a4f01;
        font-style: italic;
        margin: 16px 0 0rpx;
        line-height: 60rpx;
        text {
          margin-left: 24rpx;
        }
      }
      .rela-price {
        font-size: 26rpx;
        color: #70706d;
        text-decoration: line-through;
        margin-bottom: 20rpx;
      }
      .tips {
        color: #9d9c9a;
        font-size: 22rpx;
      }
    }
  }
  .user-box {
    padding: 0 24rpx;
    margin-bottom: 60rpx;
    .pic {
      margin-right: 24rpx;
      .user-pic {
        width: 96rpx;
        height: 96rpx;
        border-radius: 100%;
      }
    }
    .info {
      flex: 6;
      .name {
        font-size: 32rpx;
        margin-bottom: 8rpx;
      }
    }
  }
  .score-box {
    background: rgba(255, 193, 7, 0.48);
    color: #7a4f01;
    padding: 10rpx 16rpx;
    border-radius: 50rpx;
    min-width: 78rpx;
    font-size: 26rpx;
    .score-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 8rpx;
    }
  }
}
</style>
