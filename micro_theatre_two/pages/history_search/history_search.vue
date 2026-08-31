<template>
  <view class="history-page">
    <view class="search-box flex a-c">
      <!--            <u-icon
                name="arrow-left"
                color="#221F18"
                size="18"
                class="arrow-left"
                @click="goBack"
            ></u-icon> -->
      <u-search
        placeholder="输入关键词"
        v-model="keywords"
        shape="round"
        :showAction="true"
        actionText="搜索"
        bgColor="#f2f2f2"
        color="#221F18"
        :height="36"
        class="search-input"
        @search="getData"
        @custom="getData"
      ></u-search>
    </view>

    <!-- 搜索结果（单列，与参考 uni 包一致） -->
    <template v-if="resultMode">
      <view class="movie-list">
        <view
          class="movie-item flex"
          v-for="(item, index) in resultDisplayList"
          :key="index"
          @click="goDetails(item)"
        >
          <view class="movie-cover-box">
            <image :src="item.cover" class="cover" mode="aspectFill"></image>
          </view>
          <view class="movie-info">
            <view class="movie-title">{{ item.name }}</view>
            <view class="movie-desc">全{{ item.episodeCount }}集</view>
            <view class="movie-mes" v-if="item.desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>
      <empty v-if="!resultDisplayList.length"></empty>
    </template>

    <!-- 初始态：历史搜索 + 热播推荐 -->
    <template v-else>
      <view class="section" v-if="searchData.length">
        <view class="section-head flex a-c j-b">
          <text class="section-title">历史搜索</text>
          <view class="section-action flex a-c" @click="handleClear">
            <u-icon name="trash" color="#868582" size="16"></u-icon>
            <text class="action-text">清空</text>
          </view>
        </view>
        <view class="history-tags">
          <view
            class="history-tag"
            v-for="(item, index) in searchData"
            :key="index"
            @click="handleRecore(item)"
          >
            <view class="history-tag-inner">{{
              item.keyword || item.search_keyword || ""
            }}</view>
          </view>
        </view>
      </view>

      <view class="section" v-if="hotDisplayList.length">
        <view class="section-head flex a-c j-b">
          <text class="section-title">热播推荐</text>
        </view>
        <view class="movie-list hot-list">
          <view
            class="movie-item flex"
            v-for="(item, index) in hotDisplayList"
            :key="index"
            @click="goDetails(item)"
          >
            <view class="movie-cover-box">
              <image :src="item.cover" class="cover" mode="aspectFill"></image>
            </view>
            <view class="movie-info">
              <view class="movie-title">{{ item.name }}</view>
              <view class="movie-desc">全{{ item.episodeCount }}集</view>
              <view class="movie-mes" v-if="item.desc">{{ item.desc }}</view>
            </view>
          </view>
        </view>
      </view>

      <empty v-if="!hotDisplayList.length && !searchData.length"></empty>
    </template>
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
  components: {
    empty,
  },
  data() {
    const host =
      this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
        ? this.vuex_apiUrl
        : globalData.apiUrl || "";
    const httpHost = String(host).replace(/\/+$/, "");
    return {
      http_host: httpHost,
      keywords: "",
      rawListData: [],
      searchData: [],
      rawHotData: [],
      resultMode: false,
      defaultCover: httpHost + "/micro_theatre_two/web/static/images/movie.png",
    };
  },
  computed: {
    resultDisplayList() {
      return this.rawListData
        .map((row) => this.normalizeListItem(row, "search"))
        .filter(Boolean);
    },
    hotDisplayList() {
      return this.rawHotData
        .map((row) => this.normalizeListItem(row, "hot"))
        .filter(Boolean);
    },
  },
  onLoad() {
    uni.setNavigationBarTitle({ title: "搜索" });
    this.syncMicroTheatreHttpHost();
    this.getCateforyData();
    this.getHotData();
  },
  onShow() {
    this.syncMicroTheatreHttpHost();
    if (this.resultMode) {
      uni.setNavigationBarTitle({ title: "搜索 - 搜索结果" });
    } else {
      uni.setNavigationBarTitle({ title: "搜索" });
    }
  },
  onPullDownRefresh() {
    const done = () => uni.stopPullDownRefresh();
    if (this.resultMode && String(this.keywords || "").trim()) {
      this.getData().then(done).catch(done);
    } else {
      Promise.all([this.getCateforyData(), this.getHotData()])
        .then(done)
        .catch(done);
    }
  },
  methods: {
    syncMicroTheatreHttpHost() {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      this.http_host = String(u).replace(/\/+$/, "");
      this.defaultCover =
        this.http_host + "/micro_theatre_two/web/static/images/movie.png";
    },
    stripHtml(html) {
      if (!html) return "";
      return String(html)
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    },
    normalizeListItem(row, source) {
      if (!row || typeof row !== "object") return null;
      const id = row.id != null ? row.id : row.drama_id;
      if (id == null || id === "") return null;
      const name = row.name || row.drama_name || "";
      let cover = row.cover_image || row.cover || "";
      if (cover && typeof cover === "string" && !/^https?:\/\//i.test(cover)) {
        const h = (this.http_host || "").replace(/\/$/, "");
        cover = cover.startsWith("/") ? h + cover : h + "/resources/" + cover;
      }
      if (!cover) cover = this.defaultCover;
      const ep =
        row.episode_count != null
          ? row.episode_count
          : row.set_num != null
            ? row.set_num
            : row.total_episodes != null
              ? row.total_episodes
              : 0;
      let desc = this.stripHtml(row.description || "");
      if (!desc && source === "hot" && row.label) {
        desc = String(row.label).trim();
      }
      return {
        id,
        name,
        cover,
        episodeCount: Number(ep) || 0,
        desc,
      };
    },
    getHotData() {
      return request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=drama_hot_list",
        method: "POST",
        data: {},
      })
        .then((res) => {
          if (res && res.errcode === 0 && Array.isArray(res.data)) {
            this.rawHotData = res.data.slice(0, 10);
          } else {
            this.rawHotData = [];
          }
        })
        .catch(() => {
          this.rawHotData = [];
        });
    },
    getData() {
      const kw = String(this.keywords || "").trim();
      if (!kw) {
        this.resultMode = false;
        this.rawListData = [];
        uni.setNavigationBarTitle({ title: "搜索" });
        this.getCateforyData();
        uni.showToast({
          title: "请输入关键词",
          icon: "none",
        });
        return Promise.resolve();
      }
      const that = this;
      return request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=search_drama",
        method: "POST",
        data: {
          keyword: kw,
        },
      })
        .then((res) => {
          that.resultMode = true;
          uni.setNavigationBarTitle({ title: "搜索 - 搜索结果" });
          if (res && res.errcode === 0 && Array.isArray(res.data)) {
            that.rawListData = res.data;
            if (!res.data.length) {
              uni.showToast({
                title: "无搜索结果",
                icon: "none",
              });
            }
          } else {
            that.rawListData = [];
            uni.showToast({
              title: (res && res.errmsg) || "无搜索结果",
              icon: "none",
            });
          }
          that.getCateforyData();
        })
        .catch(() => {
          that.rawListData = [];
          uni.showToast({
            title: "搜索失败",
            icon: "none",
          });
        });
    },
    getCateforyData() {
      return request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=search_logs",
        method: "POST",
        data: {},
      })
        .then((res) => {
          if (res && res.errcode === 0 && Array.isArray(res.data)) {
            this.searchData = res.data;
          } else {
            this.searchData = [];
          }
        })
        .catch(() => {
          this.searchData = [];
        });
    },
    handleRecore(item) {
      const raw =
        item && (item.keyword != null ? item.keyword : item.search_keyword);
      const text = raw != null ? String(raw).trim() : String(item || "").trim();
      if (!text) return;
      this.keywords = text;
      this.getData();
    },
    handleClear() {
      const that = this;
      uni.showModal({
        title: "提示",
        content: "确认清空历史记录吗？",
        success(res) {
          if (res.confirm) {
            that.clearRecord();
          }
        },
      });
    },
    clearRecord() {
      const that = this;
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=clear_search_logs&xdebug=xdebug",
        method: "POST",
        data: {},
      })
        .then((res) => {
          if (res && res.errcode === 0) {
            that.searchData = [];
            uni.showToast({
              title: "已清空",
              icon: "none",
            });
          } else {
            uni.showToast({
              title: (res && res.errmsg) || "清空失败",
              icon: "none",
            });
          }
        })
        .catch(() => {
          uni.showToast({
            title: "清空失败",
            icon: "none",
          });
        });
    },
    goDetails(item) {
      const id = item && item.id;
      if (!id) return;
      const path =
        "/micro_theatre_two/pages/playlet_info/playlet_info?id=" +
        encodeURIComponent(id);
      uni.redirectTo({
        url: path,
      });
    },
    goBack() {
      if (this.resultMode) {
        this.resultMode = false;
        this.rawListData = [];
        uni.setNavigationBarTitle({ title: "搜索" });
        this.getCateforyData();
        return;
      }
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.history-page {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 24rpx;
  padding-bottom: 48rpx;
  box-sizing: border-box;
}

.search-box {
  margin-bottom: 32rpx;

  .arrow-left {
    margin-right: 16rpx;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    min-width: 0;
  }
}

.section {
  margin-bottom: 40rpx;
}

.section-head {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #221f18;
}

.section-action {
  .action-text {
    margin-left: 8rpx;
    font-size: 26rpx;
    color: #868582;
  }
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;
}

.history-tag {
  width: 33.33%;
  padding: 0 10rpx 20rpx;
  box-sizing: border-box;
}

.history-tag-inner {
  background-color: #ececec;
  border-radius: 12rpx;
  padding: 20rpx 16rpx;
  font-size: 24rpx;
  color: #70706d;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-list {
  margin-top: 8rpx;

  .movie-item {
    margin-bottom: 48rpx;

    .movie-cover-box {
      position: relative;
      overflow: hidden;
      border-radius: 16rpx;
      margin-right: 24rpx;
      flex-shrink: 0;

      .cover {
        width: 166rpx;
        height: 218rpx;
        display: block;
      }
    }

    .movie-info {
      flex: 1;
      min-width: 0;
      position: relative;
      height: 218rpx;

      .movie-title {
        font-size: 28rpx;
        font-weight: 600;
        color: #221f18;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 12rpx;
      }

      .movie-desc {
        color: #868582;
        font-size: 24rpx;
        line-height: 1.4;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 16rpx;
      }

      .movie-mes {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #9e9a93;
        font-size: 24rpx;
        line-height: 36rpx;
      }
    }
  }
}

.hot-list {
  margin-top: 0;
}
</style>
