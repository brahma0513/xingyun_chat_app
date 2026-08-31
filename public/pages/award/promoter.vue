<template>
	<view class='container'>
		<view class="content">
			<rich-text :nodes="rules"></rich-text>
		</view>
		<view style="height: 154rpx;"></view>
		<view class="footer_btn">
			<view :class="['footer_btn_content','skin-bg-'+theme, apply && is_open==1?'click_after':'']" @click="applyFun()">
			  {{apply_content}}
			</view>
		</view>
	</view>
</template>

<script>
	import promoter from './promoter.js'
	export default {
	  ...promoter,
	}
</script>

<style lang="scss">
	.container{
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  flex-direction: column;
	}
	/*我的特权start*/
	.content{
	    font-size: 30rpx;
	    color: #333333;
	    padding: 0 10px;
	}
	.footer_btn{
	    position: fixed;
	    bottom: 0;
	    width: 100%;
	    text-align: center;
	    padding: 30rpx;
	}
	.footer_btn_content{
	    background-color: #7e8aee;
	    color: #fff;
	    font-size: 36rpx;
	    height: 94rpx;
	    line-height: 94rpx;
	    border-radius: 50rpx;
	}
	.click_after{
	    opacity: 0.5;  
	}
</style>
