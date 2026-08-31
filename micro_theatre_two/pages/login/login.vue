<template>
	<view class="login-box">
		<image :src="http_host+'/micro_theatre_two/web/static/images/login-bg.png'" mode="widthFix" class="bg"></image>
		<view class="content-box flex a-c j-c">
			<view>
				<view class="logo-box">
					<image :src="http_host+'/micro_theatre_two/web/static/images/logo-pic.png'" mode="aspectFit" class="logo"></image>
				</view>
				<view class="logo-box">
					<image :src="http_host+'/micro_theatre_two/web/static/images/logo-title.png'" mode="aspectFit" class="logo-tit"></image>
				</view>
				<view class="tips">精彩短剧，尽在星云微剧场</view>
				<view class="login-bnt">微信登录</view>
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
		components: {empty},
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
			}
		},
		onLoad(res) {
			this.syncMicroTheatreHttpHost();
		},
		onShow() {
			this.syncMicroTheatreHttpHost();
		},
		methods: {
			syncMicroTheatreHttpHost() {
				const u =
					this.vuex_apiUrl != null && this.vuex_apiUrl !== ""
						? this.vuex_apiUrl
						: globalData.apiUrl || "";
				this.http_host = String(u).replace(/\/+$/, "");
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login-box{
		position: relative;
		.bg{
			width: 100%;
		}
		.content-box{
			position: absolute;
			width: 100%;
			height: 90%;
			top: 0;
			left: 0;
			z-index: 5;
		}
		.login-bnt{
			background-color: wheat;
			width: 574rpx;
			height: 96rpx;
			line-height: 96rpx;
			margin: auto;
			font-size: 30rpx;
			text-align: center;
			border-radius: 16rpx;
			background-color: #0ff6eb;
			box-shadow: 0rpx 16rpx 32rpx #25dad13d;
			margin-top: 156rpx;
		}
		.tips{
			text-align: center;
			color: #868582;
			font-size: 26rpx;
			margin-top: 10rpx;
		}
		.logo-box{
			.logo{
				width: 144rpx;
				height: 144rpx;
				margin: auto auto 4rpx;
			}
			.logo-tit{
				width: 248rpx;
				margin: auto;
			}
		}
	}
</style>