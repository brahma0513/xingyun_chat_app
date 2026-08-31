<template>
	<view>
		<!--public/pages/award/myTeam/myTeam.wxml-->
		<view class='container'>
		  <view class='fixedTop'>
		    <!--搜索框-->
			
			<view style="height: 46px;"></view>
		    <view class='top-serach'>
				<u-search class="serach-input" :hidden="!inputShowed" placeholder="搜索" v-model="inputVal" @search="search" @confirm='search' :showAction="false"></u-search>
		        <!-- <view class='serach-wrap'> -->
		     <!--       <icon class="serach-icon" type="search" size="14" :color='theme_color'></icon> -->
		            <!-- <input type="text" class="serach-input" placeholder=""v-model="inputVal" /> -->
		        <!-- </view> -->
		<!-- 		<view class="search-clear" v-if="inputVal.length > 0" @click="clearInput">
				    <icon type="clear" size="14" :color='theme_color'></icon>
				</view> -->
				<view :class="'serach-cancel skin-color-'+theme" :hidden="!inputShowed" @click="hideInput">取消</view>
		     <!--   <label class="search-label" v-show="inputShowed"  @click="showInput">
		            <view>
		                <icon class="search-label-icon" type="search" size="14" :color='theme_color'></icon>
		                <view class="search-label-text ">搜索</view>
		            </view>
		        </label> -->
		        
		    </view>
		
		    <!--搜索框结束-->
		    <!--top-->
		    <view :class="'team-top skin-bg-'+theme">
		        <view class='team-top-top'>
		            <view class="left">
		              <view class="total-all" :class="bg_bool ? 'skin-color-' +theme + ' bg-color' : ''" @click="get_all">全部</view>
		              <picker class="total-time" :class="!bg_bool ? 'skin-color-' +theme + ' bg-color' : ''" mode="date" start="1970-01-01" end="2100-01-01" fields="month" @change="listenerPickerSelected" >
		                <text v-if="bg_bool" class='jiantou'>选择日期</text>
		                <text v-if="!bg_bool" class='jiantou'>{{year}}年{{month}}月</text>
		              </picker>
		            </view>
		            <view class="right">
		                <text>筛选</text><image class="img" :src="http_host+'/wsy_pub/web/static/images/icon-arroww.png'" @click="modalshow"></image>
		            </view>
		        </view>
		        <view class="total-earnings-content">
		            <view  class="total-earnings-content-item">
		                <view>
		                <text class="big">{{total_payA}}</text>
		                <text class="small">{{total_payB}}</text>
						<u-loading-icon  v-if="!total_payA"  mode="semicircle"  color="white"></u-loading-icon>
		                </view>
		                <view class="name">总消费金额</view>
		            </view>
		            <view class="total-earnings-content-item">
		                <view>
		                <text class="big">{{total_num}}</text>
						<u-loading-icon v-if="total_num.length == 0"  mode="semicircle"  color="white"></u-loading-icon>
		                </view>
		                <view class="name">团队总人数</view>
		            </view>
		        </view>
		    </view>
		    <!-- top -->
		  </view>
		  <view style='height:306rpx'></view>
		  <view style='height:45px'></view>
		  <!-- detail -->
		  <view class="DetailList">
		    <view class="team-detail" v-for="(item,index) in teamDetailList" @click="jump(index)" :key='index'>
		      <image class="img" :src="item.headimgurl" />
		      <view class="team-detail-content">
		        <view class="team-detail-content-name">
		          <text>{{item.weixin_name}}</text>
		          <text class="team-detail-time" v-if="item.createtime">{{item.createtime}}</text>
		        </view>
		        <view class="team-detail-content-order">订单:{{item.finish_order_num}}</view>
		        <view class="team-detail-content-consume">消费金额<block v-if="amount_type == 1">（实付）</block>:{{item.finish_order_money}}元<text class="push-num">直推数：{{item.direct_push}}</text></view>
		        <view class="team-detail-content-consume">销售金额<block v-if="amount_type == 1">（实付）</block>:{{item.direct_order_money}}元</view>
		        <view>
		          <view v-for="(itm,idx) in item.pro_name" :key="idx" :class="'team-detail-content-power skin-color-'+theme">
		            {{itm}}
		          </view>
		        </view>
		      </view>
		    </view>
		    <view v-if="loading" style="text-align: center;padding-top: 100px;">
				<u-loading-icon mode="semicircle" size="60px"></u-loading-icon>
				<!-- <i class="weui-loading" style="width: 60px;height:60px;"></i> -->
				</view>
		  </view>
		  <view class='loading-tips' v-if="tips_show">已加载全部数据</view>
		  <!-- detail -->
		  <!--筛选弹窗-->
		  <view v-if="filtershow" class="filter-wrap">
		    <view class="filter-bg" @click="hideFilter"></view>
		    <view class="content">
		        <view>
		        <view class="content-title">类型</view>
		        <text v-for="(itm,idx) in classlist" :key="idx" class="content-son " :class="itm.ischeck?'active skin-color-'+theme+' skin-bd-'+theme:''" @click="choose(classlist,idx,'classlist')">{{itm.text}}</text>
		      </view>
		      <view>
		        <view class="content-title">身份</view>
		        <text v-for="(itm,idx) in identity" v-if="itm.show" :key="idx" class="content-son" :class="itm.ischeck?'active skin-color-'+theme+' skin-bd-'+theme:''" @click="choose(identity,idx,'identity')">{{itm.text}}</text>
		      </view>
		      <view>
		        <view class="content-title">等级</view>
		        <text v-for="(itm,idx) in trade" :key="idx" class="content-son" :class="itm.ischeck?'active skin-color-'+theme+' skin-bd-'+theme:''" @click="choose(trade,idx,'trade')">{{itm.text}}</text>
		      </view>
		      <!--view>
		        <view class="content-title">深度</view>
		        <text v-for="(itm,idx) in depth" :key="idx" class="content-son" :class="itm.ischeck?'active skin-color-'+theme+' skin-bd-'+theme:''" @click="choose(depth,idx)">{{itm.text}}</text>
		      </view-->
		      <view class="content-footer">
		        <view :class="'content-footer-item reset skin-bg-'+theme" @click="Reset">重置</view>
		        <view :class="'content-footer-item sure skin-bg-'+theme" @click="sure">确认</view>
		      </view>
		    </view>
		  </view>
		  <!--筛选弹窗-->
		</view>
	</view>
</template>

<script>
	import myTeam from './myTeam.js'
	export default {
	  ...myTeam,
	}
</script>

<style>
/* public/pages/award/myTeam/myTeam.wxss */
/* @import '../../../../shop_public.wxss'; */
.container{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
} 

/*搜索框样式*/
.top-serach{
    width: 100%;
    background: #fff;
    padding: 5px 15px;
    box-sizing: border-box;
}
.search-label{
    width: 100%;
    height: 35px;
    line-height: 35px;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 8rpx;
    justify-content: center;
}
.search-label-icon{
    display: inline-block;
    vertical-align: middle;
    padding-top: 16px
}
.search-label-text{
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    font-size: 15px;
    color: #999
}
.serach-wrap{width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}
.serach-wrap input{
    flex: 1;
    height: 35px;
    border-radius: 8rpx;
    background: #f5f5f5;
    padding-left: 25px;
    font-size: 15px;
}
.serach-icon{position: absolute;left: 6px;}
.serach-cancel{font-size: 15px;padding-left: 10px;}
.search-clear{position: absolute;right:50px;margin-top:-2px;z-index: 5 }
/*搜索框样式end*/
/*我的团队start*/
.weui-search-bar{padding: 5px 15px;background: #fff}
.fixedTop{position: fixed;top: 0;width:100%;z-index: 200; }
.team-top{width: 100%;height: 306rpx;margin:0 auto;background-color: #9296f5;color: #fff;text-align: center;position: relative;}
.team-top-top{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 28rpx 30rpx 0;
    color: #fff;
    font-size: 28rpx;
    line-height: 28rpx;
}
.team-top-top .left{
    width: 50%;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: left;
}
.team-top-top .right{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -moz-justify-content: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -moz-align-items: center;
    -webkit-align-items: center;
    align-items: center;
    width: 55px;
    height: 22px;
    border: 0.5px solid #fff;
    border-radius: 11px;
    font-size: 13px;
}
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
.total-earnings-content{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding-top: 71rpx;
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
.team-top .img{width: 26rpx;height: 26rpx;position: relative;}
.DetailList{height: 100%;overflow: hidden;overflow-y: scroll;-webkit-overflow-scrolling: touch;overflow-scrolling:touch;z-index: 100;}
.team-detail{padding: 30rpx;border-bottom: 2rpx solid #e1e1e1;display: -webkit-box;display: -webkit-flex;display: flex;align-items: center;}
.team-detail .img{width: 130rpx;height: 130rpx;border-radius: 50%;margin-right: 20rpx;}
.team-detail .team-detail-content{-webkit-box-flex: 1;-webkit-flex: 1;flex: 1;width: 50%;}
.team-detail .team-detail-time{margin-left: 10rpx;}
.team-detail-content-name{font-size: 30rpx;color: #333333;margin-bottom: 10rpx;}
.team-detail-content-order,.team-detail-content-consume{font-size: 26rpx;color: #999999;margin-bottom: 10rpx;}
.team-detail-content-power{font-size: 22rpx;padding: 8rpx 20rpx;background-color: #f5f5ff;color: #7f8aef;margin-right: 20rpx;border-radius: 30rpx;display:inline-block;}
.team-detail-time{font-size: 20rpx;color: #b2b2b2;float: right;}
.filter-wrap .content{width: 71%;height: 100%;background-color: #fff;position: absolute;z-index: 2;right: 0;padding-left: 30rpx;overflow-y: scroll;padding-bottom: 60px;}
.filter-wrap .content .content-title{margin-top: 56rpx;font-size: 28rpx;color: #5d5d5d;}
.content-son{background-color: #f5f5f5;padding: 10rpx 26rpx;font-size: 28rpx;margin-right: 20rpx;color: #333333;display: inline-block;margin-top: 30rpx;border-radius: 10rpx;}
.content-son.active{color:#7f8aef ;border: 2rpx solid #7f8aef;}
.content-son-two{padding: 10rpx 0px;width: 134rpx;text-align: center;}
.content-footer{position: fixed;bottom: 30rpx;width: calc(71% - 60rpx);display: flex;right: 30rpx;}
.content-footer-item{width: 50%;display: inline-block;text-align: center;height: 70rpx;line-height: 70rpx;color: #fff;border: 0;font-size: 28rpx;}
.content-footer-item.reset{background:#7f8aef;opacity: 0.5;border-radius: 40rpx 0 0 40rpx;}
.content-footer-item.sure{background:#7f8aef;border-radius: 0px 40rpx 40rpx 0px;}
/*我的团队end*/
.loading-tips{color: #999999;text-align: center;padding: 10px 0;font-size: 28rpx}
/*筛选框*/
.filter-wrap {position: fixed;width: 100%;height: 100%;top: 0;z-index: 999;}
.filter-bg {width: 100%;height: 100%;background: rgba(0,0,0,0.6);position: absolute;}
.filter-wrap .content{width: 71%;height: 100%;background-color: #fff;position: absolute;z-index: 300;right: 0;padding-left: 30rpx;overflow-y: scroll;padding-bottom: 60px;}
.filter-wrap .content .content-title{margin-top: 56rpx;font-size: 28rpx;color: #5d5d5d; }
.content-son{background-color: #f5f5f5;padding: 10rpx 26rpx;font-size: 28rpx;margin-right: 20rpx;color: #333333;display: inline-block;margin-top: 30rpx;border-radius: 10rpx;}
.content-son.active{color:#7f8aef ;border: 2rpx solid #7f8aef;}
.content-son-two{padding: 10rpx 0px;width: 134rpx;text-align: center;}
.content-footer{position: fixed;bottom: 15px;width: calc(71% - 60rpx);display: flex;right: 30rpx;}
.content-footer-item{width: 50%;display: inline-block;text-align: center;height: 70rpx;line-height: 70rpx;color: #fff;border: 0;font-size: 28rpx;}
.content-footer-item.reset{background:#7f8aef;opacity: 0.5;border-radius: 40rpx 0 0 40rpx;}
.content-footer-item.sure{background:#7f8aef;border-radius: 0px 40rpx 40rpx 0px;}
.weui-search-bar__input {height: 33px}
.push-num{float: right}
</style>
