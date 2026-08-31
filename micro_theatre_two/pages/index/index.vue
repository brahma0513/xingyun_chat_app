<template>
  <view class="history-box">
    <view class="search-box flex a-c" @click.stop="goSearch">
      <u-search
        placeholder="输入关键词"
        shape="square"
        :showAction="true"
        actionText="搜索"
        bgColor="#e4e3e1"
        class="search-input"
      ></u-search>
    </view>
    <scroll-view class="category-top-box" scroll-x="true">
      <view
        class="category-item"
        :class="{ active: index == categoryIndex }"
        @click="handelChangeType(index)"
        v-for="(item, index) in categoryData"
        :key="index"
        >{{ item.name }}
        <image
          :src="http_host + '/micro_theatre_two/web/static/images/type-bg.png'"
          class="type-bg"
          mode="aspectFit"
          v-if="index == categoryIndex"
        ></image>
      </view>
    </scroll-view>
    <scroll-view class="category-child-box" scroll-x="true">
      <view
        class="type-item"
        :class="{ active: index == categoryChildIndex }"
        @click="handelChangeType(index, true)"
        v-for="(item, index) in categoryChildData"
        :key="index"
        >{{ item.name }}</view
      >
    </scroll-view>
    <view class="movie-list flex">
      <view
        class="movie-item"
        v-for="(item, index) in listData"
        :key="index"
        @click="goDetails(item.id)"
      >
        <view class="movie-cover-box">
          <image
            :src="item.cover_image || defaultCover"
            class="cover"
            mode="aspectFill"
          ></image>
          <view class="sort">{{ index + 1 }}</view>
          <view class="play-box flex a-c">
            <image
              :src="
                http_host + '/micro_theatre_two/web/static/images/play-icon.png'
              "
              class="play-icon"
              mode="aspectFit"
            ></image>
            {{ item.episode_count || 0 }} 集
          </view>
          <view class="score-box flex j-c a-c">
            <image
              :src="
                http_host +
                '/micro_theatre_two/web/static/images/score-icon.png'
              "
              class="score-icon"
              mode="aspectFit"
            ></image>
            {{ item.drama_price }}
          </view>
        </view>
        <view class="movie-info">
          <view class="movie-title">{{ item.name }}</view>
          <view class="movie-desc">{{ item.episode_count || 0 }} 集</view>
        </view>
      </view>
    </view>
    <empty v-if="!listData.length"></empty>
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
  return url.request(reqUrl, reqData, reqMethod);
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
      keyword: "",
      categoryIndex: 0,
      categoryData: [], // 一级分类
      categoryChildIndex: 0,
      categoryChildData: [], // 二级分类
      defaultCover:
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/poster/image-1.png",
      listData: [],
      pageNo: 1,
      limit: 20,
      categoryId: "",
      totalPageCount: 1,
    };
  },
  onLoad(res) {
    this.syncMicroTheatreHttpHost();
    this.getCateforyData();
  },
  onShow() {
    uni.$emit("onShow");
    this.syncMicroTheatreHttpHost();
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    this.pageNo = 1;
    this.getDramaList();
    setTimeout(() => {
      //结束下拉刷新状态
      uni.stopPullDownRefresh();
    }, 1000);
  },
  // 上拉加载更多
  onReachBottom() {
    if (this.pageNo == this.totalPageCount) return;
    this.pageNo++;
    // this.getDramaList();
  },
  methods: {
    syncMicroTheatreHttpHost() {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      this.http_host = String(u).replace(/\/+$/, "");
    },
    // 获取数据列表
    getDramaList() {
      let that = this;
      let params = {
        page: that.pageNo,
        limit: that.limit,
        category_id: that.categoryId,
        type: 0, // 0：首页数据，1：点赞列表数据，2：收藏
      };
      console.log("分类params==", params);
      if (that.pageNo == 1) {
        that.listData = [];
      }
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=drama_list",
        method: "POST",
        data: params,
      })
        .then((res) => {
          if (res.errcode == 0) {
            if (res.data.list != undefined) {
              that.listData = [...that.listData, ...res.data.list];
              that.totalPageCount = res.data.pageCount;
            }
          }
        })
        .catch((ret) => {
          console.log("获取数据列表失败=", ret);
          console.log(ret);
        });
    },
    // 获取分类
    getCateforyData() {
      let that = this;
      request({
        url: "/micro_theatre_two/web/index.php?m=index_data&a=category_list",
        method: "POST",
        data: {},
      })
        .then((res) => {
          if (res.errcode == 0) {
            that.categoryData = res.data;
            if (res.data.length > 0) {
              that.categoryId = res.data[0].id;
              that.categoryChildData = res.data[0].child || [];
              if (that.categoryChildData.length) {
                that.categoryId = that.categoryChildData[0].id;
              }
              that.getDramaList();
            }
          }
        })
        .catch((ret) => {
          console.log(ret);
        });
    },
    handelChangeType(index, isChild = false) {
      if (isChild) {
        this.categoryChildIndex = index;
        const child = this.categoryChildData[index];
        this.categoryId = child ? child.id : "";
      } else {
        this.categoryIndex = index;
        const parent = this.categoryData[index];
        this.categoryChildData = parent && parent.child ? parent.child : [];
        this.categoryChildIndex = 0;
        if (this.categoryChildData.length) {
          this.categoryId = this.categoryChildData[0].id;
        } else {
          this.categoryId = parent ? parent.id : "";
        }
      }
      this.pageNo = 1;
      this.getDramaList();
    },
    goSearch() {
      const url = "/micro_theatre_two/pages/history_search/history_search";
      console.log("[micro_theatre_two][index][goSearch] redirectTo", { url });
      uni.redirectTo({
        url,
        success(res) {
          console.log("[micro_theatre_two][index][goSearch] success", res);
        },
        fail(err) {
          console.warn("[micro_theatre_two][index][goSearch] fail", err);
        },
      });
    },
    goDetails(id) {
      const url = "/micro_theatre_two/pages/playlet_info/playlet_info?id=" + id;
      console.log("[micro_theatre_two][index][goDetails] redirectTo", {
        id,
        url,
      });
      uni.redirectTo({
        url,
        success(res) {
          console.log("[micro_theatre_two][index][goDetails] success", res);
        },
        fail(err) {
          console.warn("[micro_theatre_two][index][goDetails] fail", err);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.history-box {
  padding: 24rpx 0;
  padding-bottom: 120rpx;
  padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  .category-child-box {
    white-space: nowrap;
    width: 100%;
    margin-top: 24rpx;
    margin-bottom: 32rpx;
    .active {
      background-color: #25dad1 !important;
      color: #221f18 !important;
    }
    .type-item {
      display: inline-block;
      padding: 0 16rpx;
      height: 44rpx;
      line-height: 44rpx;
      border-radius: 12rpx;
      background-color: rgba(145, 158, 171, 0.16);
      font-size: 24rpx;
      color: #70706d;
      margin-right: 18rpx;
      transition: all 0.2s ease-in-out;
      &:first-child {
        margin-left: 24rpx;
      }
    }
  }
  .category-top-box {
    white-space: nowrap;
    margin-bottom: 24rpx;
    .category-item {
      color: #868582;
      font-size: 32rpx;
      position: relative;
      margin-right: 48rpx;
      display: inline-block;
      transition: all 0.2s ease-in-out;
      &:first-child {
        margin-left: 30rpx;
      }
      .type-bg {
        position: absolute;
        bottom: 0;
        left: 50%;
        z-index: 2;
        transform: translate(-50%, 0);
        width: 90rpx;
      }
    }
    .active {
      color: #221f18;
      font-size: 36rpx;
    }
  }
  .search-box {
    margin-bottom: 34rpx;
    padding: 0 24rpx;
  }
  .movie-list {
    flex-wrap: wrap;
    gap: 22rpx;
    padding: 0 24rpx;
    .movie-item {
      width: 31.2%;
      margin-bottom: 10rpx;
      position: relative;
      .score-box {
        position: absolute;
        top: 12rpx;
        right: 12rpx;
        z-index: 1;
        background-color: rgba(255, 193, 7, 0.32);
        color: white;
        padding: 4rpx 12rpx;
        border-radius: 50rpx;
        min-width: 78rpx;
        font-size: 18rpx;
        .score-icon {
          width: 24rpx;
          height: 24rpx;
          margin-right: 8rpx;
        }
      }

      .play-box {
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 1;
        height: 48rpx;
        width: 100%;
        padding: 10rpx 0;
        background: linear-gradient(
          0deg,
          rgba(20, 22, 21, 0.8) 0%,
          rgba(20, 22, 21, 0) 100%
        );
        text-align: right;
        color: white;
        padding: 4rpx 12rpx;
        min-width: 78rpx;
        font-size: 20rpx;
        justify-content: flex-end;
        .play-icon {
          width: 28rpx;
          height: 28rpx;
          margin-right: 8rpx;
        }
      }
      .movie-cover-box {
        position: relative;
        overflow: hidden;
        border-radius: 16rpx;
        .cover {
          width: 100%;
          height: 294rpx;
        }
        .sort {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          padding: 0rpx 16rpx;
          font-size: 22rpx;
          color: white;
          border-radius: 16rpx 0rpx 16rpx 0rpx;
          background-color: rgba(145, 158, 171, 0.48);
        }
      }
      &:nth-child(1) .sort {
        opacity: 0.8;
        background: linear-gradient(
          135deg,
          #ffc484 0%,
          #f58000 100%
        ) !important;
      }
      &:nth-child(2) .sort {
        opacity: 0.8;
        background: linear-gradient(
          135deg,
          #ff987e 0%,
          #e82c47 100%
        ) !important;
      }
      &:nth-child(3) .sort {
        opacity: 0.8;
        background: linear-gradient(
          135deg,
          #aaf27f 0%,
          #41c834 100%
        ) !important;
      }
      .movie-info {
        width: 200rpx;
        position: relative;
        .movie-title {
          font-size: 24rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 12rpx;
          margin-top: 16rpx;
        }
        .movie-desc {
          color: #868582;
          font-size: 22rpx;
          line-height: 24rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .look-num {
          color: #b9b8b6;
          font-size: 24rpx;
        }
      }
    }
  }

  .title-box {
    margin: 48rpx 0 32rpx;
    .title-pic {
      width: 228rpx;
    }
  }
}
</style>
