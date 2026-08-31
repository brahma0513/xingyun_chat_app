<template>
	<view class="empy-box">
		<!-- <u-loading-icon :show="loading"></u-loading-icon> -->
	</view>
</template>

<script>
	export default {
		name:"hyBlindBoxRe",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				loading: false,
			};
		},
		mounted(){
			const _this = this;
			_this.loading = true;
			// setTimeout(function(){
			// 	_this.checkIsOnline();
			// 	_this.loading = false;
			// },1000)
			_this.box_redirect();
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			//检测是否在线状态
			checkIsOnline(){
				let that = this;
				if(that.vuex_user && that.vuex_user.user_id > 0){
					var params = {
						login_user_id: that.vuex_user.user_id
					};
					console.log("盲盒登陆")
					that.$api.getUserToken(params).then(res2 => {
						console.log("盲盒登陆结果",res2)
						if (res2.data) {
							that.$u.vuex('vuex_user', res2.data.userinfo);
							that.box_redirect();
						}else{
							that.box_redirect();
						}
					})
				}else{
					console.log("盲盒不用登陆")
					that.box_redirect();
				}
				
			},
			//重定向
			box_redirect(){
				console.log("进来盲盒重定向");
				
				// if(this.vuex_user.token == ""){
				// 	var back_route = "/pages/index/index";
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: "请先登陆",
				// 		confirmText: '登录',
				// 		success: function(res) {
				// 			if (res.confirm) {
				// 				uni.redirectTo({
				// 					url: '/public/pages/user/login?back_route='+back_route
				// 				})
				// 			} else if (res.cancel) {}
				// 		}
				// 	});
				// 	return false;
				// } 
				var param = "&customer_id="+this.vuex_customer_id+"&customer_id_en="+this.vuex_customer_id_en+"&user_agent=third_program_h5#/pages/goods/index";		//参数
				// var weburl = this.vuex_apiUrl+"/hy_blind_box/web/index.php?m=index&a=index"+param;	//盲盒首页链接
				// uni.setStorageSync("weburl", weburl)
				// uni.redirectTo({ 
				// 	url: "/pages/webview/webview"
				// });
				
				var url = "/hy_blind_box/web/index.php?m=index&a=index"+param;
				this.$common.diyLinkJump(url,"h5",true,2);
			}
		}
	}
</script>

<style>
.empy-box{
	padding: 60rpx 200rpx 0rpx 200rpx;
}
</style>
