<template>
  <view class="watch-page">
    <view v-if="!hasStarted" class="watch-entry">
      <view class="watch-entry-button" @click="startWatching">
        开始看视频5
      </view>
    </view>
    <playVideo v-else :video-list="videoList"></playVideo>
  </view>
</template>

<script>
import playVideo from "@/micro_theatre_two/components/watch_video/playVideo.vue";
export default {
  components: { playVideo },
  data() {
    return {
      hasStarted: false,
      videoList: [
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/video/v1.mp4",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/video/v2.mp4",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/video/v3.mp4",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/video/v4.mp4",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/video/v5.mp4",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/video/v6.mp4",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/video/v7.mp4",
        "https://yun.new.xingdian666.com/micro_theatre_two/web/static/video/v8.mp4",
      ],
    };
  },
  methods: {
    startWatching() {
      this.hasStarted = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.watch-page {
  min-height: 100vh;
  background: #000000;
}

.watch-entry {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  box-sizing: border-box;
}

.watch-entry-button {
  min-width: 280rpx;
  padding: 24rpx 48rpx;
  border-radius: 999rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 32rpx;
  line-height: 1.2;
  text-align: center;
}
</style>
