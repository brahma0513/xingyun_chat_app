<template>
	<view>
		<!--public/pages/myMoney/amountConsumption/amountConsumptionDetail.wxml-->
		<view class='container'>
		  <view class="detail-top">
		    <view class="price">
		      <block v-if="infor.type==1">+</block>
		      <block v-else>-</block>
		      <text class="big">{{priceA}}</text>
		      <text>{{priceB}}</text>
		    </view>
		    <view  class="text">消费金额</view>
		  </view>
		
		  <view class="detail-list">
					<li>
						<view class="label">类型</view>
						<view class="infor">消费支付</view>
					</li>
		            <li>
						<view class="label">来源</view>
						<view class="infor">{{list.app_name}}</view>
					</li>
		      <li>
						<view class="label">支付方式</view>
						<view class="infor">{{list.pay_type_name}}</view>
					</li>
		      <li>
						<view class="label">订单号</view>
						<view class="infor">{{list.batchcode}}</view>
					</li>
		      <li>
						<view class="label">时间</view>
						<view class="infor">{{list.createtime}}</view>
					</li>
				</view>
		</view>
		
		

	</view>
</template>

<script>
	import amountConsumptionDetail from './amountConsumptionDetail.js'
	export default {
	  ...amountConsumptionDetail,
	}
</script>

<style>
/* public/pages/myMoney/amountConsumption/amountConsumptionDetail.wxss */
/* @import '../../../../shop_public.wxss'; */
page{background-color: #f5f5f5}
.container{display: -webkit-box;display: -webkit-flex;display: flex;flex-direction: column}
.detail-top{
	background-color: #FFF;
	padding: 46rpx 30rpx;
	text-align: center;
	margin-bottom: 20rpx;
}
.detail-top .price{
	font-size: 52rpx;
	color: #333;
	line-height: 96rpx;
}
.detail-top .price .big{
	font-size: 60rpx;
}
.detail-top .text{
	color: #999999;
  font-size: 28rpx;
	line-height: 48rpx;
}
.detail-list{
	background-color: #FFF;
	margin-bottom: 20rpx;
	padding: 12rpx 0;
}
.detail-list li{
	padding: 10rpx 30rpx;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	font-size: 30rpx;
	line-height: 50rpx;
}
.detail-list li .label{
	-webkit-box-flex: none;
	-webkit-flex: none;
	flex: none;
	margin-right: 20rpx;
	justify-content: space-between;
	color: #333;
}
.detail-list li .infor{
	-webkit-box-flex: auto;
	-webkit-flex: auto;
	flex: auto;
	text-align: right;
  color: #5d5d5d;
}
</style>
