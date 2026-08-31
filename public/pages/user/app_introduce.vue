<template>
	<view class="page">
		
		<view class="con">
			<u-parse :content="uniappSet.app_introduce"></u-parse>
		</view>

		<!-- 底部占位 -->
		<view class="">
			<text> \n </text>
		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				uniappSet: {},
			};
		},
		onLoad() {
			this.getUniappSetting();
		},
		onReachBottom() {},
		methods: {
			//获取应用设置
			getUniappSetting() {
				let that = this;
				that.$api.getUniappSetting({}).then(res=>{
					if (res.errcode == 0) {
						that.uniappSet = res.data
					}
				})
			},
		}
	};
</script>
<style lang="scss">
	page{
		background-color:#ffffff;
	}
	.page{
		.con{
			padding:40rpx;
		}
		
	}
</style>