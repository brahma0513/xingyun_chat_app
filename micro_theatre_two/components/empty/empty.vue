<template>
  <view class="empty-box">
    <view class="empty-img-wrap">
      <image
        class="empty-img"
        mode="aspectFit"
        :src="http_host + '/micro_theatre_two/web/static/images/no-data.png'"
      ></image>
    </view>
    <view class="empty-text">{{ text }}</view>
  </view>
</template>

<script>
import * as globalData from "@/utils/config";

// 内联的微剧场资源域名兜底：vuex_apiUrl 优先，其次兜底 globalData.apiUrl，并去掉末尾 /
function getMicroTheatreApiBase(vm) {
  const u =
    vm && vm.vuex_apiUrl != null && vm.vuex_apiUrl !== ""
      ? vm.vuex_apiUrl
      : globalData.apiUrl || "";
  return String(u).replace(/\/+$/, "");
}
export default {
  components: {},
  props: {
    text: {
      type: String,
      default: "暂无数据",
    },
  },
  data() {
    return {
      http_host: "",
    };
  },
  created() {
    this.http_host = getMicroTheatreApiBase(this);
  },
  mounted() {
    this.http_host = getMicroTheatreApiBase(this);
  },
  onReady() {
    // this.getList();
  },
  // 触底触发
  onReachBottom() {},
  // 刷新
  onPullDownRefresh() {},
  onLoad(res) {},
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.empty-box {
  display: flex;
  padding: 160rpx 0;
  flex-direction: column;
  align-items: center;
  color: #888888;
  font-size: 26rpx;
}
.empty-img-wrap {
  margin-bottom: 30rpx;
}
.empty-img {
  width: 150rpx;
  height: 150rpx;
}
.empty-text {
  text-align: center;
}
</style>
