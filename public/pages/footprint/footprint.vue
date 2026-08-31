<template>
	<view>
	<!--public/pages/footprint/footprint.wxml-->
	<!--头部导航start-->
<!-- 	<view class="collect-nav has-border">
	    <li v-for="(item,index) in nav_list" :class="nav_index===index?'active skin-color-'+theme:''" @click="nav_fun" data-index="{{index}}">
	        <text>{{item}}</text>
	        <view class="line skin-bg-{{theme}}" v-if="nav_index===index"></view>
	    </li>
	</view> -->
	<u-sticky bgColor="#fff">
	<u-tabs :list="nav_list" @click="nav_fun" style="display: flex;justify-content: center; width: 100%;"
	 itemStyle="flex:1; padding:20rpx 0;" :scrollable="false"></u-tabs>
	 </u-sticky>
	
	
	<!-- <view style="height: 46px;"></view> -->
	<!--头部导航end-->
	
	<!--商品数量提示条strat-->
	<view class="collect-tips" v-if="collect_list.length>0">
	    共<text> {{length}} </text><block v-if="collect_type===1">件商品</block><block v-if="collect_type===2">家店铺</block>
	    <text :class="'btn skin-color-'+theme" v-if="is_edit" @click="edit(1)">完成</text>
	    <text :class="'btn skin-color-'+theme" v-else @click="edit(2)">编辑</text>
	</view>
	<!-- <view style="height: 44px;" v-if="collect_list.length>0"></view> -->
	<block v-if="collect_type===1">
	    <!--商品数量提示条strat-->
	    <view class="collect-item" v-for="(time,timeindex) in collect_list">
	        <p class="collect-time">{{time.time}}</p>
	        <ul class="collect-list">
	            <li  class="goods" v-for="(item,index) in time.day_list" @click="gotoDeatil(item.url)">
	                <view v-if="is_edit" class="check-box" :class="item.ischeck?'active skin-bg-'+theme:''" @click="check_fun(item,index,timeindex)" :style="{backgroundImage:'url('+http_host+'/HTML/images/public/icon_gou.png)'}"></view>
	                <view class="infor">
	                    <view class="goods-infor">
	                        <view class="image">
	                            <image mode='aspectFill' :src="item.img_url"></image>
	                        </view>
	                        <view class="text-infor">
	                            <p class="title">{{item.name}}</p>
	                            <view class="g-infor">
	                                <p class="price" :class="'price-'+price_color">{{monetary_unit}}
	                                    <span class="big">{{item.priceA}}</span>{{item.priceB}}</p>
	                                <p class="num">销量:{{item.count}}</p>
	                            </view>
	                        </view>
	                    </view>
	                </view>
	            </li>
	        </ul>
	
	    </view>
	</block>
	<view v-if="collect_type===2">
	    <!--商品数量提示条strat-->
	    <view class="shop-item" v-for="(time,timeindex) in collect_list">
	        <p class="collect-time">{{time.time}}</p>
	        <ul class="collect-list">
	            <li v-for="(item,index) in time.day_list" class="goods" @click="gotoDeatil(item.url)">
	                <view v-if="is_edit" class="check-box" :class="item.ischeck?'active skin-bg-'+theme:''" @click="check_fun(item,index,timeindex)" :style="{backgroundImage:'url('+http_host+'/HTML/images/public/icon_gou.png)'}"></view>
	                <view class="infor">
	                    <view class="shop-infor">
	                        <view class="image">
	                            <image :src="item.img_url"></image>
	                        </view>
	                        <view class="text-infor">
	                            <p class="title">{{item.name}}</p>
	                        </view>
	                    </view>
	                </view>
	            </li>
	        </ul>
	
	    </view>
	</view>
	
	<block v-if="collect_type===1">
	    <!--收藏列表为空-->
	    <view class="collect-null" v-if="collect_list.length == 0">
	        <view class="null-image">
	            <image mode='widthFix' :src="http_host+'/HTML/images/public/sc_bg1.png'"></image>
	            <p>您还没有访问过任何的商品哦</p>
	        </view>
	    </view>
	    <!--收藏列表为空end-->
	</block>
	<block v-if="collect_type===2">
	    <!--店铺列表为空-->
	    <view class="collect-null" v-if="collect_list.length == 0">
	        <view class="null-image">
	            <image mode='widthFix' :src="http_host+'/HTML/images/public/sc_bg2.png'"></image>
	            <p>您还没有收藏过任何的店铺哦</p>
	        </view>
	    </view>
	    <!--店铺列表为空end-->
	</block>
	<block v-if="collect_type===3">
	    <!--帖子列表为空-->
	    <view class="collect-null" v-if="collect_list.length == 0">
	        <view class="null-image">
	            <image mode='widthFix' :src="http_host+'/HTML/images/public/sc_bg3.png'"></image>
	            <p>您还没有浏览过任何的帖子哦</p>
	        </view>
	    </view>
	    <!--帖子列表为空end-->
	</block>
	<block v-if="collect_type===4">
	    <!--文章列表为空-->
	    <view class="collect-null" v-if="collect_list.length == 0">
	        <view class="null-image">
	            <image mode='widthFix' :src="http_host+'/HTML/images/public/sc_bg4.png'"></image>
	            <p>您还没有浏览过任何的文章哦</p>
	        </view>
	    </view>
	    <!--文章列表为空end-->
	</block>
	<view class="weui-loadmore" style="margin: 10px auto;" v-if="collect_list.length>0">
	    <block v-if="load_type==1">
	        <span class="weui-loadmore__tips">上拉加载数据</span>
	    </block>
	    <block v-if="load_type==2">
	        <i class="weui-loading"></i>
	        <span class="weui-loadmore__tips">正在加载</span>
	    </block>
	    <block v-if="load_type==3">
	        <span class="weui-loadmore__tips">已加载全部数据</span>
	    </block>
	</view>
	<view style="height: 55px;" v-if="is_edit"></view>
	<view class="collect-bottom" v-if="is_edit && collect_list.length > 0" :style='{bottom:"0rpx"}'>
	    <view class="all-check" @click="check_all">
	        <view class="check-box" :class="all_check?'active skin-bg-'+theme:''" :style="{backgroundImage:'url('+http_host+'/HTML/images/public/icon_gou.png)'}"></view>全选
	    </view>
	    <view :class="'btn skin-bg-'+theme" @click="delete_check">删除</view>
	</view>
<!-- 	<import src="/components/common/common.wxml" />
	<template is="common" data="{{...template_data}}"/>	 -->
	</view>
</template>

<script>
	import footprint from './footprint.js'
	export default {
	  ...footprint,
	}
</script>

<style>
/* public/pages/footprint/footprint.wxss */
page{font-size: 28rpx;color: #5d5d5d;background-color: #f5f5f5}
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
	left: 0;
	box-sizing: border-box;
	padding: 5px 15px 0;
	background-color: #f3f3f3;
	color: #b2b2b2;
	line-height: 34px;
}
.collect-tips .btn{
	float: right;
	color: #7f8aef;
}
.collect-list{
	background-color: #FFF;
}
.collect-list li{
	display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    padding: 0 15px;
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
	border-bottom: solid 1px #f5f5f5;
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
    font-size: 28rpx;
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
	bottom: 110rpx;
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
	font-size: 28rpx;
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
	border-bottom: solid 1px #e5e5e5;
    background-color: #fff;
    padding: 20rpx 0;
}
.shop-item:last-child{
	border-bottom:0
}
.collect-item .collect-list li.goods{border: 0;}
.collect-item{margin-bottom: 10px;background-color: #fff;padding-top: 20rpx}
.collect-time{width: calc(100% - 15px);background: #fff;font-size: 14px;color: #999;padding-top: 15rpx;padding-left: 15px;}
</style>
