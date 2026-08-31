<template>
  <view class="wrap">
    <text class="tip">正在返回…</text>
  </view>
</template>

<script>
import { payPathLog } from "@/micro_theatre_two/utils/pay_path_log.js";

/**
 * 支付结束回跳（原生页）：从 PHP callback 改为跳本页时，用 query.callback_path 回到剧详等。
 * 若仍走 H5 callback.html（WebView 内），则继续用 uni.webview 方案即可。
 */
export default {
  onLoad(options) {
    let raw = String((options && options.callback_path) || "").trim();
    const optNum =
      options && options.num != null && options.num !== ""
        ? String(options.num).trim()
        : "";
    if (
      raw &&
      optNum &&
      /play_video_simple/i.test(raw) &&
      !/(?:[?&])num=\d+/.test(raw)
    ) {
      raw += (raw.indexOf("?") >= 0 ? "&" : "?") + "num=" + optNum;
    }
    let path = "/pages/index/index";
    try {
      path = raw ? decodeURIComponent(String(raw)) : "/pages/index/index";
    } catch (e) {
      path = String(raw);
      payPathLog(this, "【支付回调 callback.vue】callback_path 解码失败，使用原始 query 值", {
        原始: raw,
      });
    }
    payPathLog(this, "【支付回调 callback.vue】解析到的回跳路径（将 redirectTo / switchTab）", {
      callback_path_query原样: raw,
      解析后路径: path,
      是否未传参而使用默认主包首页: !raw,
    });
    if (!path || path === "/") {
      payPathLog(this, "【支付回调】路径为空，将 switchTab 到主包 /pages/index/index", {
        switchTab: "/pages/index/index",
      });
      uni.switchTab({ url: "/pages/index/index" });
      return;
    }
    uni.redirectTo({
      url: path,
      fail: () => {
        payPathLog(this, "【支付回调】redirectTo 失败，尝试 navigateTo，再失败则 switchTab 主包首页", {
          目标路径: path,
        });
        uni.navigateTo({ url: path, fail: () => uni.switchTab({ url: "/pages/index/index" }) });
      },
    });
  },
};
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
.tip {
  color: #666;
  font-size: 28rpx;
}
</style>
