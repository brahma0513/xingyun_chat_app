<template>
	<view>
		<!--public/pages/award/teamDetail/teamDetail.wxml-->
		<view class='container'>
		  <!-- top -->
		  <view :class="'teamDetail skin-bg-'+theme">
		    <view class="teamDetail-top">
		      <image class="teamDetail-top-img" :src="headimgurl" />
		      <view class="teamDetail-content">
		        <view class="teamDetail-content-top">{{name}}</view>
		        <view>
		          <text v-for="(item,index) in power" :key="index" class="teamDetail-content-power">{{item}}</text>
		        </view>
		      </view>
		      <image class="teamDetail-right-img" @click="call" :src="http_host+'/HTML/images/shop/images/phone.png'" />
		    </view>
		    <view class="teamDetail-footer">
		      <view class="teamDetail-footer-item">
		        <view class="teamDetail-footer-item-name">消费金额
		          <text class="teamDetail-footer-item-number">{{consumeMonkey}}</text>
		        </view>
		        <view class="teamDetail-footer-item-name">团队人数
		          <text class="teamDetail-footer-item-number">{{team_count}}</text>
		        </view>
		      </view>
		      <view class="teamDetail-footer-item">
		        <view class="teamDetail-footer-item-name">订单数
		          <text class="teamDetail-footer-item-number">{{orderNumber}}</text>
		        </view>
		        <view class="teamDetail-footer-item-name">总佣金
		          <text class="teamDetail-footer-item-number">{{totalCommission}}</text>
		        </view>
		      </view>
		    </view>
		  </view>
		  <!-- top -->
		  <!-- nav -->
		  <view class="earnings-nav">
		    <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="toggle(index)">
		      <view class="nav-content" :class="active==index?'activeColor skin-color-'+theme:''">{{item.name}}</view>
		      <view class="line" :class="'skin-bg-'+theme" v-if="active==index"></view>
		    </view>
		  </view>
		  <!-- nav -->
		  <!-- data -->
		  <view v-if="isShow" class="dataStatement">
		    <view class="dataStatement-title">
		      <text>近30天</text>
		    </view>
		    <view class="dataStatement-box">
		      <view class="dataStatement-detail">
		        <view class="dataStatement-detail-left">消费金额</view>
		        <view class="dataStatement-detail-right">{{mon_price}}</view>
		      </view>
		      <view class="dataStatement-detail">
		        <view class="dataStatement-detail-left">下单数量</view>
		        <view class="dataStatement-detail-right">{{mon_order}}</view>
		      </view>
		      <view class="dataStatement-detail">
		        <view class="dataStatement-detail-left">团队新增</view>
		        <view class="dataStatement-detail-right">{{mon_num}}</view>
		      </view>
		      <view class="dataStatement-detail">
		        <view class="dataStatement-detail-left">已结算佣金</view>
		        <view class="dataStatement-detail-right">{{mon_price_yes}}</view>
		      </view>
		      <view class="dataStatement-detail">
		        <view class="dataStatement-detail-left">未结算佣金</view>
		        <view class="dataStatement-detail-right">{{mon_price_no}}</view>
		      </view>
		    </view>
		  </view>
		  <!-- data -->
		  <!-- userInfor -->
		  <view v-if="!isShow">
		    <view class="peopleInfor">
		      <view class="peopleInfor-box">
		        <view class="dataStatement-title">
		          <text>特权信息</text>
		        </view>
		        <view  class="dataStatement-detail">
		          <view class="dataStatement-detail-left">推荐人</view>
		          <view class="dataStatement-detail-right">{{referee_name}}</view>
		        </view>
		        <view  class="dataStatement-detail">
		          <view class="dataStatement-detail-left">推广到期</view>
		          <view class="dataStatement-detail-right">{{end_time}}</view>
		        </view>
		        <view  class="dataStatement-detail">
		          <view class="dataStatement-detail-left">加入日期</view>
		          <view class="dataStatement-detail-right">{{join_time}}</view>
		        </view>
		      </view>
		      <view class="peopleInfor-box">
		        <view class="dataStatement-title">
		          <text>基本信息</text>
		        </view>
				<view  class="dataStatement-detail">
				  <view class="dataStatement-detail-left">ID</view>
				  <view class="dataStatement-detail-right">{{user_id}}</view>
				</view>
		        <view  class="dataStatement-detail">
		          <view class="dataStatement-detail-left">姓名</view>
		          <view class="dataStatement-detail-right">{{per_infor.name}}</view>
		        </view>
		        <view  class="dataStatement-detail">
		          <view class="dataStatement-detail-left">性别</view>
		          <view class="dataStatement-detail-right"><text v-if="per_infor.sex==1">男</text><text v-else-if="per_infor.sex==2">女</text><text v-else>未知</text></view>
		        </view>
		        <view  class="dataStatement-detail">
		          <view class="dataStatement-detail-left">微信号</view>
		          <view class="dataStatement-detail-right">{{per_infor.weixin_num}}</view>
		        </view>
		        <view  class="dataStatement-detail">
		          <view class="dataStatement-detail-left">QQ</view>
		          <view class="dataStatement-detail-right">{{per_infor.qq_num}}</view>
		        </view>
		        <view  class="dataStatement-detail">
		          <view class="dataStatement-detail-left">生日</view>
		          <view class="dataStatement-detail-right">{{per_infor.birth}}</view>
		        </view>
		        <view  class="dataStatement-detail">
		          <view class="dataStatement-detail-left">职业</view>
		          <view class="dataStatement-detail-right">{{per_infor.job}}</view>
		        </view>
		        
		      </view>
		    </view>
		  </view>
		  <!-- userInfor -->
		</view>
	</view>
</template>

<script>
	import teamDetail from './teamDetail.js'
	export default {
	  ...teamDetail,
	}
</script>

<style>
/* public/pages/award/teamDetail/teamDetail.wxss */
/* @import '../../../../shop_public.wxss'; */
page{background-color: #f5f5f5;}
.container{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: column; 
}
/*团队详情start*/
.teamDetail{width: 100%;height: 380rpx;padding: 0 60rpx;background-color: #7f8aef;}
.teamDetail-top{display: -webkit-box;display: -webkit-flex;display: flex;padding: 58rpx 0;align-items: center;border-bottom: 2rpx solid #939ced;}
.teamDetail-top-img{width: 100rpx;height: 100rpx;border-radius: 50%;margin-right: 20rpx;}
.teamDetail-content{-webkit-flex: 1;-webkit-box-flex: 1;flex: 1;width: 50%;}
.teamDetail-right-img{width: 40rpx;height: 40rpx;}
.teamDetail-content-top{font-size: 32rpx;color: #fff;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
.teamDetail-content-power{padding: 8rpx 16rpx;background-color: rgba(255,255,255,0.2);font-size: 22rpx;color: #d7dafa;border-radius: 30rpx;margin-right: 20rpx;}
.teamDetail-footer{display: -webkit-box;display: -webkit-flex;display: flex;padding: 38rpx 0;align-items: center;}
.teamDetail-footer-item{-webkit-flex: 1;-webkit-box-flex: 1;flex: 1;}
.teamDetail-footer-item-name{font-size: 26rpx;color: #d7dafa;}
.teamDetail-footer-item-number{font-size: 32rpx;color: #fff;margin-left: 20rpx;}
.dataStatement,.peopleInfor{padding: 0 60rpx;background-color: #fff;}
.dataStatement-title{padding: 36rpx 0;font-size: 32rpx;color: #333333;border-bottom: 2rpx dotted #ebebeb;}
.dataStatement-detail{display: -webkit-box;display: -webkit-flex;display: flex;padding: 24rpx 0;align-items: center;}
.dataStatement-detail-left{-webkit-flex: 1;-webkit-box-flex: 1;flex: 1;width: 50%;font-size: 30rpx;color: #999999;}
.dataStatement-detail-right{margin-left: 20rpx;font-size: 30rpx;color: #5d5d5d;}
.peopleInfor-box{border-bottom: 2rpx solid #e5e5e5;}
.peopleInfor .peopleInfor-box:last-child{border-bottom: none;}
/*团队详情end*/
/* nav */
.earnings-nav{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 0 60rpx;
    background-color: #FFF;
    text-align: center;
    border-bottom: 2rpx solid #e5e5e5;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
}
.earnings-nav::-webkit-scrollbar{width: 0;height: 0;background-color: #fff;}
.nav-item{
    -webkit-flex: 1 0 auto;
    -webkit-box-flex: 1 0 auto;
    flex: 1 0 auto;
    font-size: 28rpx;
    color: #5d5d5d;
}
.nav-item .nav-content{
    padding: 30rpx 0 24rpx 0;
}
.line{
    width: 30rpx;
    height: 6rpx;
    border-radius: 10rpx;
    background-color: #7f8aef;
    margin: 0 auto;
}
.nav-item .nav-content.activeColor{
    color: #7f8aef;
}
/* nav */
</style>
