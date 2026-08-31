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
      <view class="info">
        <view class="name flex a-c">
          <text>{{ userName || "VIP用户" }}</text>
          <image
            :src="
              http_host + '/micro_theatre_two/web/static/images/vip-icon.png'
            "
            class="vip-icon"
            mode="aspectFit"
          ></image>
        </view>
        <view class="date">有效期至2025-10-24</view>
      </view>
    </view>
    <scroll-view class="vip-group" scroll-x="true">
      <view
        class="vip-item"
        :class="{ active: currentIndex == index }"
        v-for="(item, index) in vipList"
        :key="index"
        @click="handleChange(index)"
      >
        <view class="title">{{ item.name }}</view>
        <view class="price">¥{{ item.price }}</view>
        <view class="rela-price">¥{{ item.old_price }}</view>
        <view class="tips">{{ item.tips }}</view>
      </view>
    </scroll-view>
    <view class="introduce">
      确认购买后，将向您的iTunes 账户收款。自动续费 iTunes 账户会在到期前24
      小时内扣费。在此之前， 您可以手动在 iTunes/ Apple ID
      设置管理中关闭自动续费。
      《连续订阅服务协议》及《星云会员服务协议》该项目在 iPhone 和 iPad
      上均可使用， 由星云微剧场提供与 Apple Inc. 无关。
    </view>
    <view class="bottom-box">
      <view class="bnt flex a-c j-c" @click="handleOpen"
        >立即开通<view class="money"
          >¥{{ vipList[currentIndex].price }}</view
        ></view
      >
      <view class="agree-box flex a-c j-c">
        <image
          :src="
            http_host + '/micro_theatre_two/web/static/images/cheakbox-icon.png'
          "
          class="cheakbox-icon"
          mode="aspectFit"
        ></image>
        <text>我已知晓并同意《会员服务协议》</text>
      </view>
    </view>
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
      userName: "",
      userHeadImg: "",
      currentIndex: 0,
      vipList: [
        {
          name: "包月会员",
          price: "19.9",
          old_price: "19.9",
          tips: "30天会员送5天",
        },
        {
          name: "包季会员",
          price: "29.9",
          old_price: "39.9",
          tips: "90天会员送10天",
        },
        {
          name: "包年会员",
          price: "69.9",
          old_price: "99.9",
          tips: "180天会员送30天",
        },
      ],
    };
  },
  onLoad(res) {
    this.syncMicroTheatreHttpHost();
    // 这里只是演示页：简单拉一次用户信息用于头像/昵称展示
    this.fetchUserInfo();
  },
  onShow() {
    this.syncMicroTheatreHttpHost();
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
    async fetchUserInfo() {
      try {
        const res = await request({
          url: "/micro_theatre_two/web/index.php?m=index_data&a=user_detail",
          method: "POST",
          data: {},
        });
        if (res && res.errcode === 0 && res.data) {
          const ui = res.data.user_info || {};
          this.userName = ui.weixin_name || ui.nickname || ui.name || "";
          this.userHeadImg = ui.headimgurl || ui.avatar || "";
        }
      } catch (e) {
        // 忽略失败，走默认头像
      }
    },
    handleChange(index) {
      this.currentIndex = index;
    },
    handleOpen() {
      uni.showToast({
        title: "演示环境不可支付",
        icon: "none",
      });
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
    .agree-box {
      font-size: 22rpx;
      color: #868582;
      .cheakbox-icon {
        margin-right: 12rpx;
        width: 28rpx;
        height: 28rpx;
      }
    }
    .bnt {
      margin: 0 24rpx 32rpx;
      border-radius: 16rpx;
      background: linear-gradient(107.69deg, #0ff8ec 0%, #fcb629 112.55%);
      height: 96rpx;
      line-height: 96rpx;
      text-align: center;
      font-size: 30rpx;
      .money {
        margin-left: 24rpx;
      }
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
      background-color: #0ff8ec !important;
      .price {
        color: #221f18 !important;
      }
      .rela-price {
        color: #70706d !important;
      }
      .tips {
        color: #9d9c9a !important;
      }
    }
    .vip-item {
      display: inline-block;
      text-align: center;
      width: 252rpx;
      height: 286rpx;
      border-radius: 16rpx;
      background-color: white;
      margin-right: 24rpx;
      border: 2rpx solid white;
      transition: all 0.2s ease-in-out;
      &:first-child {
        margin-left: 24rpx;
      }
      .title {
        padding-top: 36rpx;
      }
      .price {
        font-size: 50rpx;
        font-weight: bolder;
        color: #0b807a;
        font-style: italic;
        margin: 16rpx 0 10rpx;
        line-height: 60rpx;
        text {
          margin-left: 24rpx;
        }
      }
      .rela-price {
        font-size: 26rpx;
        color: #b9b8b6;
        text-decoration: line-through;
        margin-bottom: 20rpx;
      }
      .tips {
        color: #868582;
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
      .name {
        font-size: 32rpx;
        margin-bottom: 8rpx;
        .vip-icon {
          width: 64rpx;
          height: 32rpx;
          margin-left: 24rpx;
        }
      }
      .date {
        color: #868582;
        font-size: 22rpx;
      }
    }
  }
}
</style>
