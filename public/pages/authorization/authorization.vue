<template>
	<view>
		<view class='container authorize pdlr15'>
		  <view class="step1" v-if="state">
		    <image mode='widthFix' :src="http_host+'/HTML/images/public/sqbg.png'" class="bg"/>
		    <view class="color1 content">赶紧成为推广员，获取更多权益！</view>
		    <view :class="'com-pay-btn skin-bg-'+theme" @click='apply'>立即申请</view>
		    <view class="com-pay-btn comBorderBtn" @click='back_view'>返回</view>
		  </view>
		  <view class="step2" v-else>
		    <image mode='widthFix' :src="auth_book" class="auth-book" @touchstart='baocun'/>
		    <view v-if="auth_book" class="color1 longcatch">长按图片保存</view>
		  </view>
		</view>

	</view> 
</template>

<script>
	import authorization from './authorization.js'
	export default {
	  ...authorization,
	}
</script>

<style>
page{background:#f5f5f5}

.container{
  display: -webkit-box;	
  display: -webkit-flex;
  display: flex;
  flex-direction: column; 
}
.pdlr15 {
	padding: 0 15px;
}
.authorize {
	width: 100%;
	height: 100%;
	text-align: center;
}
.authorize .step1 {
	padding-top: 156rpx;
}
.authorize .bg {
	width: 61.45%;
  height: 
}
.authorize .content {
	margin: 48rpx 0 66rpx;
	font-size: 32rpx;
}
.authorize .step2 {
	padding-top: 68rpx;
  height: calc(100vh - 200rpx);
}
.auth-book {
  margin-bottom: 32rpx;
  height: calc(100vh - 200rpx) !important;
}
.color1 {
	color: #5d5d5d;
}
.com-pay-btn {
	display: block;
	width: 92%;
	height: 74rpx;
	margin: 58rpx auto 0;
	border-radius: 47rpx !important;
	text-align: center;
	line-height:74rpx;
	font-size: 32rpx;
	color: #fff;
	background: #7f8aef;
}
.comBorderBtn {
	border: 1px solid #d8d8d8 !important;
	background: transparent;
	color: #5d5d5d;
}
.longcatch{font-size: 32rpx;}
</style>
