<template>
	<view>
		<!--public/pages/myMoney/myMoney.wxml-->
		<view class='container'>
		    <view :class="'purse-top skin-bg-'+theme">
		        <view class="title">余额（元）</view>
		        <p class="price-num">{{money}}</p>
		        <!-- 11/12 -->
		        <view class="pay_tab">
		            <view :class="'chongzhi_tab skin-color-'+theme" @click="rechargeClick" v-if="is_recharge==1&&recharge_type.length>0">充值</view>
		            <view class="tixian_tab" v-if="is_allow_withdrawal == 1" @click="tixian">提现</view>
		        </view>
		        <!-- 11/12 -->
		        <!-- 2/24 -->
		        <view class="filter_img" @click="showFilter">
		            <image :src="http_host+'/HTML/images/public/shaixuan_img.png'"></image>
		        </view>
		        <!-- 2/24end -->
		    </view>
		    <view class="purse-list">
		
		        <view class="menu">
		            <p>{{pocket_money_name}}</p>
		            <block v-if="is_given == 1">
		                <p :class="'btn skin-color-'+theme" @click="given">立即转赠
		                    <image class='rightImg' :src="http_host+'/HTML/images/public/right_jian.png'"></image>
		                </p>
		            </block>
		        </view>
		
				<!-- <u-sticky bgColor="#fff"> -->
				    <ul class="list-nav">
				<u-tabs :list="nav_list" @click="nav_click" style="	display: flex;justify-content: center; width: 100%;" 
				 itemStyle="flex:1; padding:20rpx 0;"></u-tabs>
				   </ul>
<!-- 				</u-sticky> -->
		      <!-- <ul class="list-nav">
		            <li v-for="(item,index) in nav_list" :class="{'active skin-color-':nav_index===index}+theme"
		                @click="nav_click(index)">
		                <p>{{item}}</p>
		                <view :class="'line skin-bg-'+theme"></view>
		            </li>
		        </ul> -->
		
		        <scroll-view class="list" scroll-y @scrolltolower="load_more" :scroll-top="scroll_top">
		            <!-- 2/24 -->
		            <view class="no-data" v-if="list.length==0">
		                <image :src="http_host+'/HTML/images/public/no_data_img.png'"></image>
		                <p>最{{tiemText}}暂无记录~</p>
		            </view>
		            <!-- 2/24 -->
		            <view v-else>
		            <li v-for="(item,index) in list">
		                <!-- 2/25 -->
		                <navigator :url="'myMoneyDetail?detail_id='+item.id+'&batchcode='+item.batchcode+'&date='+item.date">
		                    <view class="infor">
		                        <p class="title">{{item.change_type_name}}</p>
		                        <p class="time">{{item.create_time}}</p>
		                    </view>
		                    <view class="price">
		                        <block v-if="item.type==1">+</block>
		                        <block v-else>-</block>
		                        <span class="big">{{item.priceA}}.</span>{{item.priceB}}<image class='rightImg'
		                            :src="http_host+'/HTML/images/public/right_jian.png'" style="margin-left: 5px;"></image>
		                    </view>
		                </navigator>
		            </li>
		        
		            <!-- 11/12 -->
		            <view class="weui-loadmore text-center" style="margin: 0px auto;margin-bottom:190rpx;margin-top:20rpx;color:#ccc"
		                v-if="list.length>0">
		                <block v-if="load_type==1">
		                    <span class="weui-loadmore__tips">上拉加载数据</span>
		                </block>
		                <block v-if="load_type==2">
		                    <i class="weui-loading"></i>
		                    <span class="weui-loadmore__tips">正在加载</span>
		                </block>
		                <block v-if="load_type==3">
		                    <span class="weui-loadmore__tips">没有更多了</span>
		                </block>
		            </view>
		        </view>
		        <!-- 2/24end -->
		        </scroll-view>
		    </view>
		    <!-- 11/12 -->
		    <!-- <view class="tixian" v-if="is_allow_withdrawal == 1">
		        <view class="tixianBox skin-bg-{{theme}}" @click="tixian">提现</view>
		    </view> -->
			<u-tabbar
				:fixed="true"
				:placeholder="true"
				:safeAreaInsetBottom="true"
				:border="false"
			>
				<view class="problem" @click="problemClick">常见问题</view>
			</u-tabbar>

		    <!-- 11/12end -->
		    <!-- 底部导航 悬浮导航-->
<!-- 		    <import src="/components/common/common.wxml" /> -->
		    <!-- <template is="common" /> -->
			</view>
		<!-- <authorize bind:setuser="SetUserInfoHandler"></authorize> -->
		<!-- 2/24筛选框 -->
		<view v-if="filtershow" class="filter-wrap">
		    <view class="filter-bg" @click='hideFilter'></view>
		    <view class="filter-content">
		      <view class="dl-tap">
		        <view class="dt-tap">时间段</view>
		        <text v-for="(item,index) in tiemList" @click="choseFilter(index)" 
					class="dd-tap"
		          :class="item.type==tiemType?'choseF skin-color-'+theme:''">
		          <block>{{item.name}}</block>
		        </text>
		      </view>
		      <view class="dl-tap">
		        <view class="dt-tap">类型</view>
		        <text v-for="(item,index) in typeList" @click="typeFilter(index)"  
					class="dd-tap"
		          :class="item.type==type?'choseF skin-color-'+theme:''">
		          <block>{{item.name}}</block>
		        </text>
		      </view>
		      <view class='filter-bottom-wrap'>
		        <view class="filter-bottom">
		          <button :class="'cancel skin-bg-'+theme" @click="cancelFilter">重置</button>
		          <button :class="'sure skin-bg-'+theme" @click="sureFilter">确认</button>
		        </view>
		      </view>
		
		    </view>
		  </view>
		<!-- 2/24筛选框end -->
	</view>
</template>

<script>
	import myMoney from './myMoney.js'
	export default {
	  ...myMoney,
	}
</script>

<style>
/* public/pages/myMoney/myMoney.wxss */
/* @import '../../../shop_public.wxss'; */
.container{display: -webkit-box;display: -webkit-flex;display: flex;flex-direction: column}
page{
    background-color: #f5f5f5;
    color: #5d5d5d;
    /* 2/24 */
    font-size:26rpx;
    height: 100%
}
::-webkit-scrollbar{
width: 0;
height: 0;
color: transparent;
}
p{display: block}
.purse-top{
	background-color:#7f8aef;
	/* 2/24 */
	padding: 46rpx 28rpx;
	/* 11/12 */
	height: 348rpx;
	color: #FFF;
	box-sizing: border-box;
	position: relative;
}
.purse-top p{
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.purse-top .title{
	/* 2/24 */
	font-size: 26rpx;
	line-height: 25px;
}
.purse-top .price-num{
	font-size: 35px;
	line-height: 45px;
	margin-top: 10px;
}

/* 2/24 */
.purse-list{
	position: relative;
    z-index: 1;
    margin: -38rpx 28rpx 0;
    height: calc(100vh - 179px);
    border-radius: 3px 3px 0 0;
	overflow: hidden;
}

.purse-list .menu{
	background-color: #FFF;
	border-radius: 3px;
	padding: 10px;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	justify-content: space-between;
	color: #333;
	line-height: 27px;
	box-sizing: border-box;
	margin-bottom: 10px;
}
.purse-list .menu .btn{
	color: #7f8aef;
}
/* 2/24 */
.rightImg{width: 26rpx;height: 26rpx;vertical-align: -2px;display: inline-block;margin-left:5rpx;}
.overflow-hidden{
	height: calc(100% - 57rpx);
	overflow: hidden;
}
.purse-list .list-nav{
	background-color: #FFF;
	border-bottom: solid 1px #e5e5e5;
	display: -webkit-box;
	display: -webkit-flex;
	position: relative;
	top: 0;
	padding-inline-start: 0px;
    z-index: 1;
}
.purse-list .list-nav li{
	-webkit-box-flex: auto;
	-webkit-flex: auto;
	flex: auto;
	box-sizing: border-box;
	padding: 10px 5px;
	line-height: 25px;
	text-align: center;
	position: relative;
}
.purse-list .list-nav .line{
	width: 15px;
	height: 3px;
	background-color: #7f8aef;
	border-radius: 1.5px;
	position: absolute;
	left: 50%;
	margin-left: -7.5px;
	bottom: 0;
	display: none;
}
.purse-list .list-nav li.active{
	color: #7f8aef;
}
.purse-list .list-nav li.active .line{
	display: block;
}
.purse-list .list{
	background-color: #FFF;
	height: calc(100% - 200rpx);
	-webkit-overflow-scrolling:touch;
	overflow-scrolling:touch;
}
.purse-list .list .no-data{
	padding: 35px 0 0 0;
}
/* 2/24 */
.purse-list .list .no-data image{
	display: block;
    width: 444rpx;
    margin: 0 auto;
    height: 265rpx;
}
/* 2/24 */
.purse-list .list .no-data p{
	color: #ccc;
	font-size: 24rpx;
	text-align: center;
	line-height: 24px;
	margin-top: 64rpx;
}
.purse-list .list li{
	border-bottom: solid 1px #e5e5e5;
	padding: 10px 15px;
  display: block
	
}
.purse-list .list li navigator{
  width: 100%;
  display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	align-items: center;
	color: #333;
}
.purse-list .list .infor{
	-webkit-box-flex: auto;
	-webkit-flex: auto;
	flex: auto;
	width: 50%;
}
.purse-list .list .infor p{
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.purse-list .list .title{
	/* 2/24 */
	font-size: 26rpx;
	line-height: 22px;
}
.purse-list .list .time{
	/* 2/24 */
	font-size: 22rpx;
	line-height: 20px;
	color: #999;
}
.purse-list .list .price{
	-webkit-box-flex: none;
	-webkit-flex: none;
	flex: none;
	margin-left: 10px;
	/* 2/24 */
	font-size: 22rpx;
	line-height: 23px;
}
.purse-list .list .price .big{
	/* 2/24 */
	font-size: 30rpx;
}
.tixian{position: fixed;bottom: 0rpx;background-color: #fff;padding: 10rpx 30rpx;width:100%;border-top: 1px solid #f5f5f5;z-index:999;
}
.tixianBox{width: 100%;color: #fff;border-radius: 50rpx;border: 1px solid;text-align: center;font-size: 30rpx;height: 80rpx;line-height: 80rpx}
/* 11/12 */
.pay_tab view {
	font-size: 28rpx;
	color: #fff;
	padding: 4rpx 38rpx;
	border-radius: 8rpx;
	display: inline-block;
	margin-top: 20rpx;
}

.pay_tab .chongzhi_tab {
	background: #fff;
	margin-right: 26rpx;
}

.pay_tab .tixian_tab {
	padding: 2rpx 35rpx;
	border: 1px solid #fff;
}

.problem {
	font-size: 26rpx;
	color: #888888;
	text-align: center;
	height: 92rpx;
	position: fixed;
	bottom: 0;
	width: 100%;
	z-index: 99;
	background: #f5f5f5;
	display: flex;
	justify-content: center;
	align-items: center;
}

/* 11/12end */
/* 2/24筛选 */
.purse-top .filter_img image{
	width: 40rpx;
	height: 40rpx;
	position: absolute;
	right: 28rpx;
	top: 28rpx;
}
/* 新筛选框 */
.filter-wrap {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
}

.filter-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}

.filter-content {
    position: relative;
    z-index: 2;
    background: #fff;
    width: 250px;
    float: right;
    height: 100%;
    box-sizing: border-box;
    padding: 30px 12px;
    overflow-y: scroll;

}

.filter-content .dl-tap {
    margin-bottom: 25px;
}

.filter-content .dt-tap {
    color: #5d5d5d;
    font-size: 26rpx;
    padding-bottom: 20rpx;
}

.filter-content .dd-tap {
    font-size: 26rpx;
    color: #333;
    padding: 8rpx 20rpx;
    background: #f5f5f5;
    display: inline-block;
    border-radius: 10rpx;
    /* 12/9 */
    margin-right: 16rpx;
    margin-bottom: 22rpx;
    max-width: 182rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* 12/9end */
    text-align: center;
    /* 12/9 */
    min-width: 140rpx;
    box-sizing: border-box;
}


.filter-price dd {
    min-width: 52px;
}

.filter-bottom-wrap {
    position: fixed;
    padding: 10px 0;
    width: 250px;
    display: flex;
    right: 0px;
    bottom: 0;
    background: #fff;
    align-items: center;
}

.filter-bottom {
    width: 200px;
    margin-left: 25px;
    height: 35px;
}

.filter-bottom button {
    width: 100px;
    display: inline-block;
    text-align: center;
    height: 35px;
    line-height: 35px;
    color: #fff;
	border: 0;
	/* 2/24 */
    font-size: 24rpx
}

.filter-content .dd-tap.choseF {
    border: 1px solid #7f8aef;
    color: #7f8aef;
    padding: 3px 7px;
    background: #f7f7ff
}

.filter-bottom button.cancel {
    background: #7f8aef;
    opacity: 0.6;
    border-radius: 20px 0 0 20px;
}

.filter-bottom button.sure {
    background: #7f8aef;
    border-radius: 0px 20px 20px 0px;
}

.filter-bottom button::after {
    border: 0
}
.weui-loadmore__tips{
	text-align: center;
}
/* 筛选框end */
</style>
