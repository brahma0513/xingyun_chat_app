<template>
	<view class="points-upgrade-dj"
		:style="'margin:'+ datas.content.paddingTop +'px 30rpx ' +datas.content.paddingBtm+'px 30rpx;'">
		<view class="points-upgrade-djbox">
			<image :src="http" style="width:50rpx;height:50rpx;margin-right:8rpx;"></image>
			冻结积分
		</view>
		<view class="points-upgrade-djnum">{{green_points}}</view>
	</view>
</template>

<script>
	import common from '@/utils/common.js'
	export default {
		name: "pointsUpgradeFrozen",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http: getApp().vuex_apiUrl + '/points_upgrade/web/static/images/imgs5.png',
				green_points: 0 //冻结积分
			};
		},
		created() {
			this.get_points_upgrade_info();
		},
		methods: {
			//获取个人信息
			get_points_upgrade_info: function() {
				let that = this;
				that.$common.requestData({
					url: '/points_upgrade/web/index.php?m=user&a=info&xdebug=xdebug',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					that.green_points = parseFloat(res.data.green_points);
				})
			}
		},
	}
</script>

<style>
	.points-upgrade-dj {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #F9FAFB;
		border-radius: 20rpx;
		padding: 20rpx;
	}

	.points-upgrade-djbox {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #000;
	}

	.points-upgrade-djnum {
		font-size: 36rpx;
	}
</style>