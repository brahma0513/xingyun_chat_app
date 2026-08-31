<template>
	<view class="box">
		<view class="img-box" v-if="shiming_status">
			<image :src="http_host+'/uniapp_template/web/static/images/shiming_cg.jpg'" mode="aspectFill"></image>
		</view>
		
		 <view class="loading-container" v-if="!shiming_status">
		    <!-- 加载动画容器 -->
		    <view class="loader">
		      <!-- 圆形加载圈 -->
		      <view class="loader-circle"></view>
		      <!-- 加载文字 -->
		      <view class="loader-text">正在加载中...</view>
		    </view>
		  </view>
	</view>
</template>

<script>
import { diyLinkJump } from '../../../utils/common';

	export default {
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host:'',
				shiming_status:false
			}
		},
		onLoad() {
			this.http_host = this.vuex_apiUrl;
			this.get_user_authentication();
		},
		onShow() {
			this.get_user_authentication();
		},
		methods: {			
			get_user_authentication(){
				var that = this;
				const params = {
					user_id: that.vuex_user.user_id,
				};
				// this.$common.showLoading();
				this.$api.getUserAuthentication(params).then(res => {
					console.log(res);
					uni.hideLoading();
					if (res.errcode == 0) {
						that.shiming_status = true;
					}else{
						if(res.errcode == 40001){
							var url = that.vuex_apiUrl+'/wsy_user/web/index.php?m=set&a=real_name_authentication&customer_id='+that.vuex_customer_id_en
							diyLinkJump(url,'h5',true,2);
						}else{
							diyLinkJump('/public/pages/user/login','',false,2)
						}
					}
				});
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#fff;
		position: relative;
	}
	
	.img-box{
		margin-top: 50px;
	}
	
	.loading-container {
	  width: 100vw;
	  height: 100vh;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  background-color: #ffffff;
	  /* 防止小程序/APP出现滚动条 */
	  overflow: hidden;
	  position: fixed;
	  top: 0;
	  left: 0;
	  z-index: 9999; // 确保在最上层
	}
	
	/* 加载动画主体 */
	.loader {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  gap: 30rpx; // UniApp推荐使用rpx适配
	}
	
	/* 圆形加载圈样式 */
	.loader-circle {
	  width: 120rpx;
	  height: 120rpx;
	  border: 8rpx solid #f3f3f3; // 浅灰色边框（背景）
	  border-top: 8rpx solid #409eff; // 蓝色边框（加载部分）
	  border-radius: 50%; // 圆形
	  animation: rotate 1s linear infinite; // 旋转动画
	}
	
	/* 加载文字样式 */
	.loader-text {
	  font-size: 32rpx;
	  font-weight: 500;
	  /* 文字渐变效果（兼容多端） */
	  background: linear-gradient(90deg, #409eff, #67c23a);
	  -webkit-background-clip: text;
	  background-clip: text;
	  color: transparent; // 文字透明，显示渐变背景
	  animation: flash 1.5s ease-in-out infinite; // 文字闪烁动画
	}
	
	/* 旋转动画：360度无限旋转 */
	@keyframes rotate {
	  0% {
	    transform: rotate(0deg);
	  }
	  100% {
	    transform: rotate(360deg);
	  }
	}
	
	/* 文字闪烁动画：透明度变化 */
	@keyframes flash {
	  0%, 100% {
	    opacity: 1;
	  }
	  50% {
	    opacity: 0.5;
	  }
	}
	
</style>