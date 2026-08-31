<template>
	<view class="points-upgrade-qdbox" @click="signBtns" :style="'top:'+(datas.content.top+statusBarHeight+44)+'px'">
		<image :src="http" style="width:36rpx;height:40rpx;margin-right:8rpx;"></image>
		签到
	</view>
</template>

<script>
	import common from '@/utils/common.js'
	export default {
		name: "pointsUpgradeSign",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http: getApp().vuex_apiUrl + '/points_upgrade/web/static/images/imgs6.png',
				statusBarHeight:0
			};
		},
		created() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight;
		},
		methods: {
			//签到
			signBtns: function() {
				let that = this;
				that.$common.requestData({
					url: '/points_upgrade/web/index.php?m=user&a=daily_sign&xdebug=xdebug',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					wx.showToast({
						title: res.errmsg,
						icon: 'none',
						duration: 2000
					})
				})
			}
		}
	}
</script>

<style>
	.points-upgrade-qdbox {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 130rpx;
		height: 56rpx;
		line-height: 34rpx;
		background-color: rgba(0, 0, 0, 0.5);
		position: absolute;
		right: 0;
		border-radius: 28rpx 0 0 28rpx;
		font-size: 26rpx;
		color: #FFF;
		z-index: 100;
	}
</style>