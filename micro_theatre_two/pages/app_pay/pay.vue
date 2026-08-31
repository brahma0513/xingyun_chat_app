<template>
  <view class="wrap">
    <view v-if="loading" class="tip">加载中…</view>
    <view v-else-if="errmsg" class="tip err">{{ errmsg }}</view>
    <!-- #ifdef H5 -->
    <view v-else class="tip">正在跳转收银台…</view>
    <!-- #endif -->
  </view>
</template>

<script>
import urlReq from "@/utils/request.js";
import { payPathLog } from "@/micro_theatre_two/utils/pay_path_log.js";

/**
 * App 支付桥（Vue 页）：HBuilder 运行到浏览器(H5)时走 uni.request + 表单 POST；
 * App / 小程序无 document 表单能力，回退为打开全局 webview 加载原 PHP 桥页。
 */
export default {
  data() {
    return {
      loading: true,
      errmsg: "",
      batchcode: "",
      callback_path: "",
      order_type: "",
      pay_type: "",
      pay_config: "",
    };
  },
  onLoad(options) {
    this.batchcode = String((options && options.batchcode) || "").trim();
    let rawCb = String((options && options.callback_path) || "").trim();
    const optNum =
      options && options.num != null && options.num !== ""
        ? String(options.num).trim()
        : "";
    if (
      rawCb &&
      optNum &&
      /play_video_simple/i.test(rawCb) &&
      !/(?:[?&])num=\d+/.test(rawCb)
    ) {
      rawCb += (rawCb.indexOf("?") >= 0 ? "&" : "?") + "num=" + optNum;
    }
    try {
      this.callback_path = rawCb ? decodeURIComponent(rawCb) : "";
    } catch (e) {
      this.callback_path = rawCb || "";
      payPathLog(this, "【支付桥 pay.vue】callback_path 解码异常，已使用原始字符串", {
        原始: rawCb,
      });
    }
    this.order_type = String((options && options.order_type) || "").trim();
    this.pay_type = String((options && options.pay_type) || "").trim();
    let rawPc = String((options && options.pay_config) || "").trim();
    try {
      this.pay_config = rawPc ? decodeURIComponent(rawPc) : "";
    } catch (e) {
      this.pay_config = rawPc || "";
    }
    payPathLog(this, "【支付桥 pay.vue】onLoad：上一页传入的订单号与回跳路径", {
      batchcode: this.batchcode,
      callback_path_query原样: rawCb,
      callback_path解码后: this.callback_path,
      order_type: this.order_type,
      pay_type: this.pay_type,
    });
    if (!this.batchcode) {
      this.loading = false;
      this.errmsg = "缺少订单号 batchcode";
      return;
    }
    // #ifndef H5
    this.openPhpBridgeInWebview();
    // #endif
    // #ifdef H5
    this.runH5PayBridge();
    // #endif
  },
  methods: {
    openPhpBridgeInWebview() {
      this.loading = false;
      const base = String(this.vuex_apiUrl || "").replace(/\/+$/, "");
      if (!base) {
        this.errmsg = "未配置 api 域名";
        return;
      }
      const token =
        this.vuex_user && this.vuex_user.token
          ? String(this.vuex_user.token)
          : "";
      const cid = String(this.vuex_customer_id || "");
      let u =
        base +
        "/micro_theatre_two/web/index.php?m=app_pay&a=pay" +
        "&batchcode=" +
        encodeURIComponent(this.batchcode) +
        "&callback_path=" +
        encodeURIComponent(this.callback_path) +
        "&user_agent=third_program_h5&request_mode=fortune_app" +
        "&customer_id=" +
        encodeURIComponent(cid);
      if (token) {
        u += "&third_token=" + encodeURIComponent(token);
      }
      if (this.order_type) {
        u +=
          "&order_type=" + encodeURIComponent(String(this.order_type).trim());
      }
      if (this.pay_type) {
        u += "&pay_type=" + encodeURIComponent(this.pay_type);
      }
      payPathLog(this, "【支付桥】即将打开全局 WebView，内嵌 PHP 桥完整 URL（含 callback_path 查询参数）", {
        full_url: u,
        callback_path解码后: this.callback_path,
      });
      uni.navigateTo({
        url: "/pages/webview/webview?weburl=" + encodeURIComponent(u),
        fail: () => {
          this.loading = false;
          this.errmsg = "打开支付页失败";
        },
      });
    },
    async runH5PayBridge() {
      try {
        const q =
          "/micro_theatre_two/web/index.php?m=app_pay&a=get_pay_order&callback_path=" +
          encodeURIComponent(this.callback_path);
        const postBody = {
          batchcode: this.batchcode,
          order_type: this.order_type,
        };
        if (this.pay_type) {
          postBody.pay_type = this.pay_type;
        }
        const res = await urlReq.request(q, postBody, "POST", true);
        if (!res || res.errcode !== 0) {
          this.loading = false;
          this.errmsg = (res && res.errmsg) || "获取支付信息失败";
          return;
        }
        let payUrl = res.url || "";
        const ua = "third_program_h5";
        const token =
          this.vuex_user && this.vuex_user.token
            ? String(this.vuex_user.token)
            : "";
        const cid = String(this.vuex_customer_id || "");
        payUrl +=
          "&user_agent=" +
          encodeURIComponent(ua) +
          "&third_token=" +
          encodeURIComponent(token) +
          "&customer_id=" +
          encodeURIComponent(cid);
        payPathLog(this, "【支付桥 H5】get_pay_order 成功，即将表单 POST 至收银台", {
          get_pay_order请求相对路径: q,
          表单action: payUrl,
          callback_path解码后: this.callback_path,
        });
        this.postFormH5(payUrl, res.param || {});
      } catch (e) {
        console.error(e);
        this.loading = false;
        this.errmsg = "网络异常";
      }
    },
    postFormH5(action, fields) {
      // #ifdef H5
      try {
        const keys = Object.keys(fields || {});
        payPathLog(this, "【支付桥 H5】创建隐藏表单并 submit", {
          form_action: action,
          隐藏字段数量: keys.length,
        });
        const form = document.createElement("form");
        form.method = "POST";
        form.action = action;
        form.style.display = "none";
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          input.value = fields[k] == null ? "" : String(fields[k]);
          form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
      } catch (e) {
        console.error(e);
        this.loading = false;
        this.errmsg = "跳转收银台失败";
      }
      // #endif
    },
  },
};
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 48rpx;
}
.tip {
  text-align: center;
  color: #666;
  font-size: 30rpx;
  padding-top: 120rpx;
}
.err {
  color: #c00;
}
</style>
