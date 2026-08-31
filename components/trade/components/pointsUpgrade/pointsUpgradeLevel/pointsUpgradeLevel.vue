<template>
	<view class="points-upgrade-box" @click="toPages" :style="'margin:'+ datas.content.paddingTop +'px 30rpx '+ datas.content.paddingBtm +'px 30rpx'">
		<view class="points-upgrade-leve" >
			<view class="leve-boxs">{{level_code}}</view>
			<view class="leve-infos">
				<view class="leve-infos-left">
					<text class="leve-infos-name">{{level_name}}</text>
					<text class="leve-infos-num">距离升级{{level_code_next}}还差{{100 - total_progress}}%</text>
				</view>
				<view class="leve-infos-right">查看详情 ></view>
			</view>
		</view>
		<view class="points-upgrade-progress">
			<progress :percent="total_progress" active stroke-width="5" backgroundColor="#F0F0F0" duration="10"
				activeColor="#FF8724" border-radius="4" />
		</view>
	</view>
</template>

<script>
	import common from '@/utils/common.js'
	export default {
		name: "pointsUpgradeLevel",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				level_code: '', //等级
				level_name: '', //等级名称
				level_code_next: '', //距离下一个等级
				total_progress: 0 //进度
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
				}).then(res =>{
					that.level_code = res.data.user_level_info.level_code;
					that.level_name = res.data.user_level_info.level_name;
					that.level_code_next = res.data.next_level_info.level_code;
					that.total_progress = parseFloat(res.data.total_progress);
				})
			},
			//跳转任务等级页面
			toPages: function() {
				var url = "/points_upgrade/web/index.php?m=index&a=index#/pages/level/level"
				this.$common.diyLinkJump(url,"h5",true);
				// points_upgrade/web/index.php?
				// wx.redirectTo({
				// 	url: '/points_upgrade/pages/level/level'
				// })
			}
		}
	}
</script>

<style>
	.points-upgrade-leve {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.points-upgrade-leve .leve-boxs {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 28rpx;
		color: #ffffff;
		width: 72rpx;
		height: 72rpx;
		background: #ff8724;
		box-shadow: 0px 2rpx 6rpx 0px rgba(0, 0, 0, 0.08),
			0px 8rpx 12rpx 0px rgba(0, 0, 0, 0.12);
		border-radius: 100px;
		border: 1px solid rgba(255, 255, 255, 0.3);
		margin-right: 24rpx;
	}

	.points-upgrade-leve .leve-infos {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 96rpx);
	}

	.leve-infos .leve-infos-left {
		display: flex;
		flex-direction: column;
	}

	.leve-infos-name {
		font-size: 32rpx;
		color: #000000;
	}

	.leve-infos-num {
		font-size: 24rpx;
		color: #6b7280;
		margin-top: 4rpx;
	}

	.leve-infos .leve-infos-right {
		font-size: 28rpx;
		color: #000000;
	}

	.points-upgrade-progress {
		margin-top: 20rpx;
	}
</style>