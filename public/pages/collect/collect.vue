<template>
	<view>
	<!--头部导航start-->
		<!-- 	<view class="collect-nav has-border" v-if="nav_list.length>1">
				<li v-for="(item,index) in nav_list" :class="'active skin-color-'+nav_index===index?theme:''" @click="nav_fun(index)">
					<text>{{item.types_name}}</text>
					<view :class="'line skin-bg-'+theme" v-if="nav_index===index"></view>
				</li>
			</view> -->
		<u-sticky bgColor="#fff">
		<u-tabs :list="nav_list" @click="nav_fun" style="display: flex;justify-content: center; width: 100%;"
		 itemStyle="flex:1; padding:20rpx 0;" :scrollable="false"></u-tabs>
		 </u-sticky>
			<!--商品数量提示条strat-->
			<view class="collect-tips" v-if="collect_list.length>0" :style="{top:nav_list.length<2?'0':'80rpx'}">
			收藏数量共{{collect_num}}条
			<text :class="'btn skin-color-'+theme" v-if="is_edit" @click="edit(1)">完成</text>
			<text :class="'btn skin-color-'+theme" v-else @click="edit(2)">编辑</text>
			</view>
				<!--商品数量提示条strat-->
				<view class="collect-item" v-for="(item,index) in collect_list">
					<ul class="collect-list" >
						<li class="goods" >
							<view  v-if="is_edit" class="check-box" :class="item.ischeck?'active skin-bg-'+theme:''" :style="{backgroundImage:'url('+http_host+'/HTML/images/public/icon_gou.png)'}" @click="check_fun(item,index)"></view>
	            <view class="infor">
	            <view @click="jump_link(item.link)">
								<view class="goods-infor">
									<view class="image">
										<image mode='aspectFill' :src="item.image"></image>
									</view>
									<view class="text-infor">
										<p class="title">{{item.title}}</p>
	                 <text v-if="item.label.length>0"  class="goods-label"
	                   v-for="(i,ind) in item.label">{{i}}</text>
										<view class="g-infor">
											<p :class="'price price-'+price_color">{{monetary_unit}}<span class="big">{{item.priceA}}</span>{{item.priceB}}</p>
											<p class="num">销量{{item.sales}}</p>
										</view>
									</view>
								</view>
	            </view>
							</view>
						</li>
	          
					</ul>
					
				</view>
	
						
	    <!--收藏列表为空-->
	    <view class="collect-null" v-if="collect_list.length == 0">
	      <view class="null-image">
	        <image mode='widthFix' :src="http_host+'/HTML/images/public/sc_bg1.png'"></image>
	        <p>您还没有收藏过任何的商品哦</p>
	      </view>
	    </view>
	    <!--收藏列表为空end-->
		
			<view class="weui-loadmore" style="margin: 10px auto;text-align: center;" v-if="collect_list.length>0&&!loading">
					<text class="weui-loadmore__tips">没有更多了~</text>	
			</view>
			<view style="height: 55px;" v-if="is_edit"></view>
			<view class="collect-bottom" v-if="is_edit && collect_list.length > 0" :style="{bottom:(bottom_open?'50px':0)}">
				<view class="all-check" @click="check_all">
					<view class="check-box" :class="all_check?'active skin-bg-'+theme:''" :style="{backgroundImage:'url('+http_host+'/HTML/images/public/icon_gou.png)'}"></view>全选
				</view>
				<view :class="'btn skin-bg-'+theme" @click="delete_check">删除</view>
			</view>
	<!-- 底部导航 悬浮导航-->
	<!-- <import src="/components/common/common.wxml" /> -->
	<!-- <template is="common" data="{{...template_data}}"/>
	<authorize bind:setuser="SetUserInfoHandler"></authorize> -->
	</view>
</template>

<script>
	import collect from './collect.js'
	export default {
	  ...collect,
	}
</script>

<style>
/* public/pages/footprint/footprint.wxss */
page{font-size: 28rpx;color: #5d5d5d}
.goods-label{
      color: #f36889;
    background: #fde1e7;
    font-size: 10px;
    line-height: 15px;
    padding: 0px 5px;
    border-radius: 7.5px;
    margin-right: 5px;
    float: left;}
.collect-nav{ 
	display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    background-color: #FFF;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 10;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
}
.collect-nav::-webkit-scrollbar{width: 0;height: 0;background-color: #fff;  }
.collect-nav.has-border{
	border-bottom: solid 1px #d8d8d8;
}
.collect-nav li{
	-webkit-box-flex:1 0 auto;
    -webkit-flex:1 0 auto;
    flex:1 0 auto;
    min-width: 25%;
    text-align: center;
    color: #999;
}
.collect-nav li.active{
	color: #7f8aef;
}
.collect-nav li text{
	padding: 12px 5px 8px;
	 line-height: 22px;
   display: inline-block;
   font-size: 28rpx
}
.collect-nav li .line{
	background-color: #7f8aef;
	width: 15px;
	height: 3px;
	border-radius: 1.5px;
	margin: 0 auto;
}
.collect-tips{
	width: 100%;
	box-sizing: border-box;
	padding: 10px 15px 0;
	background-color: #f3f3f3;
	color: #b2b2b2;
	line-height: 34px;
}
.collect-tips .btn{
	float: right;
	color: #7f8aef;
}
.swiperHeight {
	height: 80px;
	}
		
.collect-list{
	background-color: #FFF;
}
.collect-list li{
	display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  
}
.check-box{
	-webkit-box-flex:none;
    -webkit-flex:none;
    flex:none;
    box-sizing: border-box;
    margin-right: 15px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: solid 1px #dbdbdb;
    background-size:0;
}
.check-box.active{
	border: none;
	background-color:#7f8aef; 
	background-repeat: no-repeat;
	background-size: 14px auto;
	background-position: center;
}
.collect-list li .infor{
	-webkit-box-flex:auto;
    -webkit-flex:auto;
    flex:auto;
    width: 50%;
}
.collect-list li.goods{
	padding: 15px;
	border-bottom: solid 1px #e5e5e5;
}
.collect-list li.goods:last-child{
	border: none;
}
.collect-list .goods-infor{
	overflow: hidden;
}
.collect-list .goods-infor .image{
	width: 100px;
	height: 100px;
	float: left;
	margin-right: 10px;
}

.collect-list .goods-infor .image image{
	display: block;
	width: 100%;
	height:100%;
	border-radius: 3px;
}
.collect-list .goods-infor .text-infor{
	width: calc(100% - 110px);
	float: left;
}
.collect-list .goods-infor .text-infor .title{
	line-height: 20px;
	height: 40px;
	display: -webkit-box; 
	-webkit-line-clamp: 2; 
	-webkit-box-orient: vertical; 
	overflow: hidden;
}
.collect-list .goods-infor .text-infor .g-infor{
	display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    line-height: 1;
    margin-top: 40px;
}
.collect-list .goods-infor .text-infor .g-infor .price{
	-webkit-box-flex:auto;
    -webkit-flex:auto;
    flex:auto;
    width: 50%;
    font-size: 13px;
    color: #333;
}
.collect-list .goods-infor .text-infor .g-infor .big{
	font-size: 16px;
}
.collect-list .goods-infor .text-infor .g-infor .num{
	-webkit-box-flex:none;
    -webkit-flex:none;
    flex:none;
    margin-left: 20px;
    font-size: 12px;
    color: #999;
}
.collect-bottom{
	padding: 7px 15px;
	background-color: #FFF;
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	border-top: solid 1px #e5e5e5;
	display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.collect-bottom .all-check{
	line-height: 24px;
	color: #b2b2b2;
}
.collect-bottom .check-box{
	display: inline-block;
	vertical-align: middle;
	margin: -3px 10px 0 0;
}
.collect-bottom .btn{
	width: 80px;
	line-height: 40px;
	border-radius: 20px;
	background-color:#7f8aef;
	text-align: center;
	font-size: 16px;
	color: #FFF;
}
.collect-null{
    width: 100%;
    position: absolute;
    top: 0;
    height: 100%;
    background: #fff;
    text-align: center;}
.collect-null .null-image{position: absolute;width: 100%;top:20%}
.collect-null image{width:75%;}
.collect-null p{font-size: 13px;color: #ccc;display: block}

.collect-list .shop-infor .image{
	width: 65px;
	height: 65px;
	float: left;
	margin-right: 10px;
	border-radius: 4px;
	overflow: hidden
}
.collect-list .shop-infor .image image{
	display: block;
	width: 100%;
	height:100%;
	border-radius: 3px;
}
.collect-list .shop-infor .text-infor{
	width: calc(100% - 75px);
	float: left;
}
.collect-list .shop-infor .text-infor .title{
	font-size: 16px;
	color: #333;
	line-height: 20px;
	height: 40px;
	display: -webkit-box; 
	-webkit-line-clamp: 2; 
	-webkit-box-orient: vertical; 
	overflow: hidden;
}
.shop-item .collect-list li.goods:first-child{padding-top: 15px}
.shop-item .collect-list li.goods{
	padding-top: 0;
	border: 0;
}
.shop-item {
	border-bottom: solid 1px #e5e5e5
}
.shop-item:last-child{
	border-bottom:0
}
.collect-item .collect-list li.goods{border: 0;}
.collect-item{margin-bottom: 10px;}
.collect-time{width: calc(100% - 15px);background: #fff;font-size: 14px;color: #999;padding-top: 20px;}
</style>
