<template>
  <view class="review-box">
    <view
      class="comment-cell"
      v-for="(item, index) in commentList"
      :key="item.id || index"
    >
      <view class="comment-user-row">
        <image
          :src="normalizeAvatarUrl(item)"
          mode="aspectFill"
          class="comment-avatar"
        ></image>
        <text class="comment-username">{{
          item.user_name || item.nickname || item.weixin_name || "用户"
        }}</text>
      </view>
      <text class="comment-content">{{ item.content || item.comment || item.text || "" }}</text>
    </view>
    <view v-if="!commentList.length" class="comment-empty">
      {{ text || "暂无评论" }}
    </view>
  </view>
</template>

<script>
import url from "@/utils/request.js";
import * as globalData from "@/utils/config";

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
      default: "",
    },
    dramaId: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      http_host: "",
      commentList: [],
      userInfoCache: {},
    };
  },
  created() {
    this.http_host = getMicroTheatreApiBase(this);
  },
  mounted() {
    this.http_host = getMicroTheatreApiBase(this);
  },
  watch: {
    dramaId: {
      immediate: true,
      handler() {
        this.getList();
      },
    },
  },
  methods: {
    normalizeAvatarUrl(item) {
      const raw = item.headimgurl || item.avatar || item.user_avatar || "";
      const host = String(this.http_host || "").replace(/\/+$/, "");
      const fallback =
        host + "/micro_theatre_two/web/static/images/default-avatar.png";
      if (!raw) return fallback;
      const url = String(raw).trim();
      if (!url) return fallback;
      if (/^https?:\/\//i.test(url)) return url;
      const normalizedPath = url.replace(/\\/g, "/").replace(/^\/+/, "");
      return host ? host + "/" + normalizedPath : fallback;
    },
    refresh() {
      this.getList();
    },
    async getList() {
      if (!this.dramaId) {
        this.commentList = [];
        this.$emit("count-change", 0);
        return;
      }
      try {
        const res = await url.request(
          "/micro_theatre_two/web/index.php?m=index_data&a=drama_comments",
          {
            drama_id: this.dramaId,
            page: 1,
            page_size: 20,
          },
          "POST",
        );
        if (res.errcode === 0 && res.data && res.data.list) {
          this.commentList = Array.isArray(res.data.list) ? res.data.list : [];
          const total =
            Number(res.data.count) ||
            Number(res.data.total) ||
            Number(res.data.total_count) ||
            this.commentList.length ||
            0;
          this.$emit("count-change", total);
        } else {
          this.commentList = [];
          this.$emit("count-change", 0);
        }
      } catch (e) {
        this.commentList = [];
        this.$emit("count-change", 0);
      }
    },
  },
};
</script>

<style scoped>
.review-box {
  padding: 0;
}
.comment-cell {
  padding-top: 18rpx;
  padding-bottom: 18rpx;
}
.comment-user-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10rpx;
}
.comment-avatar {
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
  background-color: #eaeaea;
}
.comment-username {
  margin-left: 12rpx;
  color: #777777;
  font-size: 24rpx;
}
.comment-content {
  color: #333333;
  font-size: 30rpx;
  line-height: 40rpx;
}
.comment-empty {
  text-align: center;
  color: #9a9a9a;
  font-size: 24rpx;
  padding-top: 60rpx;
}
</style>
