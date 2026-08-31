<template>
  <view class="my-center-box">
    <u-sticky customNavHeight="0" bg-color="#ffffff" z-index="10">
      <view class="type-box flex a-c j-a">
        <view
          class="type-item flex a-c j-c"
          :class="{ active: showType == 1 }"
          @click="handleChangeType(1)"
        >
          <image
            :src="
              http_host + '/micro_theatre_two/web/static/images/buy-car.png'
            "
            class="icon"
            mode="aspectFit"
          ></image>
          观看
        </view>
        <view
          class="type-item flex a-c j-c"
          :class="{ active: showType == 2 }"
          @click="handleChangeType(2)"
        >
          <image
            :src="
              http_host + '/micro_theatre_two/web/static/images/like-icon.png'
            "
            class="icon"
            mode="aspectFit"
          ></image>
          点赞
        </view>
        <view
          class="type-item flex a-c j-c"
          :class="{ active: showType == 3 }"
          @click="handleChangeType(3)"
        >
          <image
            :src="
              http_host +
              '/micro_theatre_two/web/static/images/star-fill-icon.png'
            "
            class="icon"
            mode="aspectFit"
          ></image>
          收藏
        </view>
      </view>
    </u-sticky>
    <!-- 单列：购买/订阅、收藏 -->
    <view class="movie-list" v-if="showType == 1 || showType == 3">
      <view
        class="movie-item flex"
        v-for="(item, index) in listData"
        :key="item.id || index"
        @click="goDetails(item)"
      >
        <view class="movie-cover-box">
          <image :src="item.cover" class="cover" mode="aspectFill"></image>
        </view>
        <view class="movie-info">
          <view class="movie-title flex a-c j-b">
            <view>{{ item.name }}</view>
            <view class="score-box flex j-c a-c">
              <image
                :src="
                  http_host +
                  '/micro_theatre_two/web/static/images/score-icon.png'
                "
                class="score-icon"
                mode="aspectFit"
              ></image>
              {{ item.score }}
            </view>
          </view>
          <view class="movie-desc">
            全{{ item.set_num }}集
            <text v-if="showType == 1"
              >已观看{{ item.watched_count || 0 }}集</text
            >
          </view>
          <view class="movie-mes">{{ item.desc }}</view>
        </view>
      </view>
    </view>
    <!-- 三列：点赞 -->
    <view class="movie-list-three flex j-b" v-else>
      <view
        class="movie-item"
        v-for="(item, index) in listData"
        :key="item.id || index"
        @click="goDetails(item)"
      >
        <view class="movie-cover-box">
          <image :src="item.cover" class="cover" mode="aspectFill"></image>
          <view class="play-box flex a-c">
            <image
              :src="
                http_host + '/micro_theatre_two/web/static/images/play-icon.png'
              "
              class="play-icon"
              mode="aspectFit"
            ></image>
            {{ item.play_num }}万播放
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
            {{ item.score }}
          </view>
        </view>
        <view class="movie-info">
          <view class="movie-title">{{ item.name }}</view>
          <view class="movie-desc"
            >{{ item.type_name }}·{{ item.set_num }}集</view
          >
        </view>
      </view>
    </view>
    <empty v-if="!loading && listData.length === 0"></empty>
  </view>
</template>

<script>
import url from "@/utils/request.js";
import empty from "@/micro_theatre_two/components/empty/empty.vue";
import * as globalData from "@/utils/config";

function request(config = {}) {
  const reqUrl = config.url || "";
  const reqMethod = (config.method || "POST").toUpperCase();
  const reqData = config.data || {};
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
      showType: 1,
      listData: [],
      page: 1,
      limit: 20,
      totalPageCount: 1,
      loading: false,
      finished: false,
      defaultCover: (() => {
        const u =
          this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
            ? this.vuex_apiUrl
            : globalData.apiUrl || "";
        const base = String(u).replace(/\/+$/, "");
        return base + "/micro_theatre_two/web/static/poster/image-1.png";
      })(),
    };
  },
  onLoad() {
    this.syncMicroTheatreHttpHost();
    this.fetchList(true);
  },
  onShow() {
    this.syncMicroTheatreHttpHost();
  },
  onPullDownRefresh() {
    this.page = 1;
    this.listData = [];
    this.finished = false;
    this.fetchList(true)
      .then(() => {
        uni.stopPullDownRefresh();
      })
      .catch(() => {
        uni.stopPullDownRefresh();
      });
  },
  onReachBottom() {
    if (this.loading || this.finished) return;
    if (this.page >= this.totalPageCount) return;
    this.page += 1;
    this.fetchList(false);
  },
  methods: {
    syncMicroTheatreHttpHost() {
      const u =
        this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
          ? this.vuex_apiUrl
          : globalData.apiUrl || "";
      this.http_host = String(u).replace(/\/+$/, "");
    },
    stripHtml(html) {
      if (!html) return "";
      return String(html)
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    },
    playNumWan(playCount) {
      const n = Number(playCount) || 0;
      if (n <= 0) return "0";
      return (n / 10000).toFixed(1);
    },
    normalizeDramaRow(row) {
      if (!row) return null;
      const id = row.id != null ? row.id : row.drama_id;
      const cover = row.cover_image || this.defaultCover;
      const score =
        row.score != null && row.score !== ""
          ? row.score
          : row.drama_price != null && row.drama_price !== ""
            ? row.drama_price
            : 0;
      const ep = row.episode_count != null ? row.episode_count : 0;
      const watched =
        row.watched_count != null && row.watched_count !== ""
          ? Number(row.watched_count) || 0
          : 0;
      return {
        id,
        name: row.name || "",
        cover,
        score,
        set_num: ep,
        watched_count: watched,
        type_name: row.label || row.type_name || "短剧",
        desc: this.stripHtml(row.description || ""),
        play_num: this.playNumWan(row.play_count),
      };
    },
    fetchList(reset) {
      if (this.loading) return Promise.resolve();
      this.loading = true;
      const t = this.showType;
      let url = "/micro_theatre_two/web/index.php?m=index_data&a=drama_list";
      const data = {
        page: this.page,
        limit: this.limit,
      };
      if (t === 1) {
        url =
          "/micro_theatre_two/web/index.php?m=index_data&a=episode_purchase_list";
      } else if (t === 2) {
        data.type = 1;
      } else if (t === 3) {
        data.type = 2;
      }
      return request({
        url,
        method: "POST",
        data,
      })
        .then((res) => {
          this.loading = false;
          let rows = [];
          if (
            res &&
            res.errcode === 0 &&
            res.data &&
            Array.isArray(res.data.list)
          ) {
            rows = res.data.list
              .map((r) => this.normalizeDramaRow(r))
              .filter(Boolean);
            this.totalPageCount = Number(res.data.pageCount) || 1;
          } else {
            this.totalPageCount = 1;
          }
          if (reset) {
            this.listData = rows;
          } else {
            this.listData = this.listData.concat(rows);
          }
          const lastLen = rows.length;
          if (this.page >= this.totalPageCount || lastLen < this.limit) {
            this.finished = true;
          }
        })
        .catch(() => {
          this.loading = false;
          this.finished = true;
        });
    },
    goScoreInfo() {
      const back = "/micro_theatre_two/pages/watch_log/watch_log";
      uni.navigateTo({
        url:
          "/micro_theatre_two/pages/score/score?return_path=" +
          encodeURIComponent(back),
      });
    },
    goDetails(item) {
      const id = item && item.id;
      if (!id) return;
      uni.navigateTo({
        url: "/micro_theatre_two/pages/playlet_info/playlet_info?id=" + id,
      });
    },
    handleChangeType(type) {
      if (this.showType === type) return;
      this.showType = type;
      this.page = 1;
      this.listData = [];
      this.finished = false;
      this.totalPageCount = 1;
      this.fetchList(true);
    },
    goBuy() {
      uni.navigateTo({
        url: "/micro_theatre_two/pages/vip/vip",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.my-center-box {
  min-height: 100vh;
  background-color: white;
  .movie-list-three {
    flex-wrap: wrap;
    gap: 22rpx;
    margin-top: 10px;
    padding: 0 24rpx 24rpx;
    .movie-item {
      width: 31%;
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
  .type-box {
    background-color: white;
    padding: 32rpx 24rpx;
    border-top-right-radius: 32rpx;
    border-top-left-radius: 32rpx;
    margin-top: -34rpx;
    .active {
      background-color: #25dad1 !important;
    }
    .type-item {
      width: 218rpx;
      background-color: rgba(0, 0, 0, 0.12);
      border-radius: 16rpx;
      height: 60rpx;
      line-height: 60rpx;
      .icon {
        width: 28rpx;
        height: 28rpx;
        margin-right: 12rpx;
      }
    }
  }
  .my-info-box {
    // background: url('/micro_theatre_two/web/static/images/my-center-bg.png') no-repeat;
    background-size: 100%;
    height: 308rpx;
    .vip-box {
      // background: url('/micro_theatre_two/web/static/images/my-vip-bg.png') no-repeat;
      background-size: 100%;
      height: 118rpx;
      margin: 0 24rpx;
      padding: 0 32rpx;
      .left-box {
        flex: 6;
        .title {
          font-style: italic;
          color: #9d8d7e;
          font-size: 32rpx;
          font-weight: bolder;
        }
        .tips {
          color: #9d9c9a;
          font-size: 20rpx;
        }
      }
      .vip-bnt {
        font-size: 22rpx;
        width: 128rpx;
        height: 52rpx;
        line-height: 52rpx;
        text-align: center;
        border-radius: 50rpx;
        background: linear-gradient(90deg, #edd0a9 0%, #e2a14a 100%);
      }
    }
    .user-box {
      padding: 32rpx 24rpx;
      .pic {
        margin-right: 24rpx;
        .user-pic {
          width: 96rpx;
          height: 96rpx;
          border-radius: 100%;
        }
      }
      .vip-icon {
        width: 64rpx;
        height: 32rpx;
        margin: 0 16rpx;
      }
      .info {
        flex: 6;
        .name {
          font-size: 32rpx;
          margin-bottom: 8rpx;
        }
      }
      .set-icon {
        width: 56rpx;
        height: 56rpx;
      }
    }
  }

  .score-box {
    background: rgba(255, 193, 7, 0.48);
    color: #7a4f01;
    padding: 0 16rpx;
    border-radius: 50rpx;
    min-width: 78rpx;
    font-size: 24rpx;
    height: 44rpx;
    line-height: 44rpx;
    .score-icon {
      width: 28rpx;
      height: 28rpx;
      margin-right: 4rpx;
    }
  }
  .movie-list {
    margin-top: 40px;
    padding: 0 24rpx 24rpx;
    background-color: white;
    .movie-item {
      margin-bottom: 48rpx;
      .movie-cover-box {
        position: relative;
        overflow: hidden;
        border-radius: 16rpx;
        margin-right: 24rpx;
        .cover {
          width: 166rpx;
          height: 218rpx;
        }
      }
      .movie-info {
        flex: 6;
        position: relative;
        height: 218rpx;
        .movie-title {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 12rpx;
        }
        .movie-desc {
          color: #868582;
          font-size: 24rpx;
          line-height: 24rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 20rpx;
          text {
            color: #0b807a;
            margin-left: 16px;
          }
        }
        .movie-mes {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3; /* 最多展示 3 行 */
          line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #9e9a93;
          font-size: 24rpx;
          line-height: 36rpx;
        }
      }
    }
  }
}
</style>
