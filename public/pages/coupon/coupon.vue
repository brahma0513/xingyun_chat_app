<template>
	<view>
		    <!-- <view class='order-top'> -->
		     
				<u-sticky bgColor="#fff">
					   <view class="order-nav">
					<u-tabs :list="navList" @click="nav_click" style="display: flex;justify-content: center; width: 100%;"
					 itemStyle="flex:1; padding:20rpx 0;" :scrollable=false></u-tabs>
					      </view>
					 </u-sticky>
		          <!--  <block v-for="(item,index) in navList" v-key="index" v-for-index="index" v-for-item="item">
		                <view @click="order_nav" data-index="{{index}}" class="order-nav-li {{nav_index==index ? 'active skin-color-'+theme:''}}">
		                    <text>{{item}}</text>
		                    <view class="line skin-bg-{{theme}} "></view>
		                </view>
		            </block> -->
		   
		    <!-- </view> -->
		    <!-- <view style="height: 45px;"></view> -->
		    <view class="voucher-list">
		        <block v-for="(item,index) in list">
		        <view class='li'>
		            <view class="voucher-list-top">
		                    <view class="voucher-list-left">
		                        <view class="voucher-list-fold" :class="status === 3 ? 'color_h' : ''" >{{item.coupon_type == 1 ? item.discount : item.discount / 10}}<span v-if="item.coupon_type == 2">折</span></view>
		                        <view class="voucher-list-condition" :class="status === 3 ? 'color_h' : ''">
		                        <block v-if="item.consume_limit > 0">满{{item.consume_limit}}使用</block>
		                        <block v-else>无门槛</block>
		                        </view>
		                    </view>
		                    <view class="voucher-list-center">
		                        <view class="voucher-list-title" :class="status === 3 ? 'color_h' : ''">{{ item.name }}</view>
		                        <view class="voucher-list-time"><span :class="{'voucher-list-maturity':item.maturity,'color_h':status === 3}">{{ item.time }}</span></view> 
		                    </view>
		                    <view class="voucher-list-right">
		                        <view v-if="status === 1" @click="go_index">去使用</view>
		                        <image v-if="status === 2" :src="http_host+'/wsy_user/web/static/images/icon-ysy.png'" alt=""></image>
		                        <image v-if="status === 3" :src="http_host+'/wsy_user/web/static/images/icon-ygq.png'" alt=""></image>
		                    </view>
		                </view>
		                <view v-if="item.apply_app_name || item.apply_app_name != ''" class="voucher-list-bottom">
		                    <view class="voucher-border">
		                        <view class="voucher-applicable" :class="status === 3 ? 'color_h' : ''">适用于：<span>{{item.apply_app_name}}</span>
		                        <image v-if="item.bool" class="icon" :class="item.description_bool ? 'fa-angle-up' : ''" @click="toggle(index)" :src="http_host+'/wsy_user/web/static/images/common_icon_arrow_x.png'" alt=""></image>
		                        </view>
		                        <view v-if="item.description_bool" class="voucher-description" :class="status === 3 ? 'color_h' : ''">说明：<span>{{item.rule}}</span></view>
		                    </view>
		                </view>
		        </view>
		            
		        </block>
		        <view class="voucher-no" v-if="list.length == 0">
		            <image src="http_host+'/wsy_user/web/static/images/shop_content_empty_def.png'" alt=""></image>
		            <view>暂无优惠券哦</view>
		        </view>
		    </view>

	</view>
</template>

<script>
	import coupon from './coupon.js'
	export default {
	  ...coupon,
	}
</script>

<style>
/* public/pages/coupon/coupon.wxss */
page{
    background-color: #f5f5f5;
}
/*订单顶部start*/
.order-top{
	position: fixed;
	width: 100%;
	left: 0;
	top: 0;
	background-color: #FFF;
	z-index: 100;
}
.order-nav{
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	overflow-x: scroll;
}
.order-nav::-webkit-scrollbar{width: 0;height: 0;background-color: #fff;  }
.order-nav .order-nav-li{
	-webkit-box-flex: 1 0 auto;
	-webkit-flex: 1 0 auto;
	flex: 1 0 auto;
	min-width: 16.666%;
	box-sizing: border-box;
	text-align: center;
	font-size: 0;
}
.order-nav .order-nav-li text{
	display: inline-block;
	position: relative;
	font-size: 28rpx;
	line-height: 48rpx;
	padding:20rpx 10rpx 16rpx;
}
.order-nav .order-nav-li .line{
	display: none;
	width: 30rpx;
	height: 6rpx;
	border-radius: 3rpx;
	background-color:#7f8aef;
	margin: 0 auto;
}
.order-nav .active{
	color: #7f8aef;
}
.order-nav .active .line{
	display: block;
}
.order-nav .has-order text:after{
	content: "";
	display: block;
	position: absolute;
	background-color: #f24f4c;
	width: 14rpx;
	height: 14rpx;
	border-radius: 50%;
	right: -6rpx;
	top: 20rpx;
}
/* 订单顶部end*/
/* 列表样式start */

.voucher-list{
    padding: 10px;
}
.voucher-list>.li{
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
}
.voucher-list>.li:nth-last-child(1){
    margin-bottom: 0;
}
.voucher-list-top{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 7px 0;
    align-items: center;
    border-radius: 5px;
    background-color: #fff;
}
.voucher-list-left{
    border-right: 1px dashed #CCCCCC;
    text-align: center;
    width: 100px;
    padding: 10px 0;
}
.voucher-list-fold{
    color: #F24F4C;
    font-size: 20px;
    height: 40px;
    line-height: 40px;
}
.voucher-list-fold>span{
    font-size: 18px;
}
.voucher-list-condition{
    font-size: 12px;
    color: #5D5D5D;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.voucher-list-center{
    padding: 13px 0 0 15px;
    /* width: 167px; */
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}
.voucher-list-title{
    font-size: 15px;
    color: #333333;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.voucher-list-time{
    font-size: 12px;
    color: #999999;
}
.voucher-list-time .voucher-list-maturity{
    color: #FF6D25;
}
.voucher-list-right{
    width: 90px;
    text-align: center;
}
.voucher-list-right>view{
    display: inline-block;
    width: 60px;
    height: 25px;
    border-radius: 13px;
    color: #fff;
    font-size: 11px;
    text-align: center;
    line-height: 25px;
    /* margin-left: 13px; */
    background-color: #F24F4C;
    box-shadow: 0px 2px 5px #FF0000;
}
.voucher-list-right>image{
    width: 45px;
    height: 51px;
    position: absolute;
    right: 0;
    top: 21px;
}
.voucher-list-bottom{
    padding: 0 5px;
    font-size: 11px;
    border-radius: 5px;
    background-color: #fff;
}
.voucher-border{
    border-top: 1px dashed #CCCCCC;
    padding: 10px;
}
.voucher-applicable{
    color: #5D5D5D;
    position: relative;
}
.voucher-applicable .icon{
    width: 13px;
    height: 13px;
    position: absolute;
    right: 0;
    top: 2px;
}
.voucher-applicable .icon.fa-angle-up{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); /* IE 9 */
    -webkit-transform:rotate(180deg); /* Safari and Chrome */
}
.voucher-description{
    color: #999999;
    padding-top: 2px;
}
.color_h{
    color: #CCCCCC !important;
}
.voucher-no{
    text-align: center;
    padding-top: 30%;
}
.voucher-no>image{
    width: 225px;
    height: 135px;
}
.voucher-no>view{
    font-size: 13px;
    color: #ccc;
    margin-top: 22px;
}

/* 列表样式end */
</style>
