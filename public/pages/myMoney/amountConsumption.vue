<template>
	<view>
		<!--public/pages/myMoney/amountConsumption/amountConsumption.wxml-->
		<view class='container'>
		  <!-- top -->
		  <view :class="'total-earnings-top skin-bg-'+theme">
		    <view class="total-earnings-top-top">
		      <view class="left">
		        <view class="total-all" :class="bg_bool ? 'skin-color-' +theme + ' bg-color' : ''" @click="get_all">全部</view>
		        <picker class="total-time" :class="!bg_bool ? 'skin-color-' +theme + ' bg-color' : ''" mode="date" value="" start="1970-01-01" :end="end_times" fields="month" @change="listenerPickerSelected" >
		          <text v-if="bg_bool" class='jiantou'>选择日期</text>
		          <text v-if="!bg_bool" class='jiantou'>{{year}}年{{month}}月</text>
		        </picker>
		      </view>
		      <view class="right">
		<!--        <text class='jiantou'>{{Type}}</text> -->
		      </view>
		    </view>
		    <view class="total-earnings-content">
		      <view class="total-earnings-content-item">
		        <view>
		          <text class="big">{{settled_rewardA}}</text>
		          <text class="small">{{settled_rewardB}}</text>
		        </view>
		        <view class="name">总消费金额</view>
		      </view>
		      <view class="total-earnings-content-item">
		        <view>
		          <text class="big">{{batchcode_count}}</text>
		        </view>
		        <view class="name">总订单数</view>
		      </view>
		    </view>
		  </view>
		  <!-- top -->
		  <!-- <view style='height: 240rpx;'></view> -->
		  <!-- 明细 -->
		  <view>
		    <view class="total-earnings-detail">
		      <navigator class="total-earnings-detailList" v-for="(item,index) in detailList" :key="index" :url="'./amountConsumptionDetail?app_id='+item.app_id+'&batchcode='+item.batchcode">
		        <view class="total-earnings-detailList-right">
		          <view class="total-earnings-detailList-right-item">
		            <view class="total-earnings-detailList-right-item-left">
		              <view class="blank">消费支付</view>
		              <view class="hui">{{item.createtime}}</view>
		            </view>
		            <view class="total-earnings-detailList-right-item-right">
		              <view class="blank">
		                -{{item.acc_amountA}}<text class="small">{{item.acc_amountB}}</text>
		              </view>
		            </view>
		          </view>
		        </view>
		      </navigator>
		    </view>
		  </view>
		  <!-- 明细 -->
		</view>
	</view>
</template>

<script>
	import amountConsumption from './amountConsumption.js'
	export default {
	  ...amountConsumption,
	}
</script>

<style>
/* public/pages/myMoney/amountConsumption/amountConsumption.wxss */
/* @import '../../../../shop_public.wxss'; */
page{background-color: #f5f5f5} 
.container{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
}
/*累计收益start*/
/*top*/
.total-earnings-top{
    height: 306rpx;
    width: 100%;
    padding: 0 30rpx;
    background-color:#7f8aef;
/*    position: fixed;
    top: 0;
    left: 0;
    z-index: 100; */
}
.total-earnings-top-top{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding-top: 28rpx;
    color: #fff;
    font-size: 28rpx;
    line-height: 28rpx;
}
.total-earnings-top-top .left{
    width: 50%;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}
.jiantou:after {
  content: " ";
  display: inline-block;
  height: 14rpx;
  width: 14rpx;
  border-width: 4rpx 4rpx 0 0;
  border-color: #FFF;
  border-style: solid;
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(135deg);
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  -webkit-transform: rotate(135deg);
  transform: rotate(135deg);
  margin-left: 10rpx;
  margin-bottom: 5rpx;
}
.total-earnings-top-top-img{
    width: 30rpx;
    height: 30px;
}
.total-earnings-content{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 90rpx 0 80rpx 0;
    color: #fff;
    align-items: center;
    text-align: center;
}
.total-earnings-content-item{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    width: 50%;
}
.total-earnings-content-item .big{
    font-size: 46rpx;
    line-height: 46rpx;
}
.total-earnings-content-item .small{
    font-size: 32rpx;
}
.total-earnings-content-item .name{
    font-size: 24rpx;
    line-height: 24rpx;
    margin-top: 6rpx;
}
/*top*/
/*detail*/
.total-earnings-detail{
    background-color: #fff;
    width: 100%;
    /* height: calc(100vh - 306rpx);
    overflow: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling:touch; */
}
.total-earnings-detailList{
    padding: 0 30rpx;
    height: 130rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #E5E5E5;
}
.total-earnings-detailList .img{
    width: 66rpx;
    height: 66rpx;
    border-radius: 50%;
    margin-right: 20rpx;
}
.total-earnings-detailList-right{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    width: 50%;
}
.total-earnings-detailList-right-item{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
}
.total-earnings-detailList-right-item-left{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    width: 50%;
}
.total-earnings-detailList-right-item-right{
    text-align: right;
}
.blank{
    font-size: 28rpx;
    color: #333333;
}
.blank .small{
    font-size: 24rpx;
}
.hui{
    font-size: 24rpx;
    color: #999999;
}
.colorRed{
    color: red;
}
/*detail*/

.total-all{
    display: inline-block;
    padding: 2px 7px;
    border-radius: 10px;
    margin-right: 10px;
    border: 1px solid #fff;
}
.total-time{
    display: inline-block;
    padding: 2px 7px;
    border-radius: 10px;
    border: 1px solid #fff;
}
.bg-color{
    background-color: #fff;
}
</style>
