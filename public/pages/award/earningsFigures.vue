<template>
	<view>
		<!--public/pages/award/earningsFigures/earningsFigures.wxml-->
		<view class='container' v-if="showPage">
		  <!-- top -->
		  <view :class="'earnings-top  position-re skin-bg-'+theme">
		    <image mode='widthFix' class="earnings-top-img" :src="userInfo.avatarUrl" />
		    <view class="earnings-top-middle">
		      <view class="earnings-top-middle-top">{{userInfo.nickName}}</view>
		      <block v-if="identity.length>0" v-for="(item,index) in identity" v-key="index">
		        <text class="earnings-top-middle-middle" >{{item}}</text>
		      </block>
		      <text class='end-time'>有效期：{{end_time}}</text>
		      
		    </view>
		    <view class="earnings-top-right position-ab">
		      ID:{{user_id}}
		    </view>
		  </view>
		  <!-- top -->
		  <!-- nav -->
		  <view class="earnings-nav">
		    <view class="nav-item" v-for="(item,index) in navList"  @click="toggle(index)">
		      <view class="nav-content" :class="active==index?'activeColor skin-color-'+theme:''">{{item.name}}</view>
		      <view :class="'line skin-bg-'+theme" v-if="active==index"></view>
		    </view>
		  </view>
		  <!-- nav -->
		  <!-- 收益数据 -->
		  <view v-if="Type==0">
		    <view class="earnings-detail">
		      <!--收益数据top-->
		      <view class="earnings-detail-top">
		        <navigator class="totol-earnings" url="totalEarnings" hover-class='no-hover'>
		          <view class="totol-earnings-left" >
		            <view class="small">累计收益</view>
		            <view class="big">{{all_profit}}
					<!-- <i v-if="!all_profit" class="weui-loading" style="width: 30px;height:30px;"></i> -->
					<u-loading-icon v-if="!all_profit" mode="semicircle" ></u-loading-icon>
					</view>
		          </view>
		          <view class="totol-earnings-right">
		            <image mode='widthFix' class="totol-earnings-right-img" :src="http_host+'/HTML/images/shop/images/right_jian.png'" />
		          </view>
		        </navigator>
		        <view class="totol-earnings-time">
		          <view class="totol-earnings-time-item left">
		            <text class="time-classify">今日</text>
		            <text class="data-classify">{{day_profit}}</text>
		          </view>
		          <view class="totol-earnings-time-item middle">
		            <text class="time-classify">本周</text>
		            <text class="data-classify">{{week_profit}}</text>
		          </view>
		          <view class="totol-earnings-time-item right">
		            <text class="time-classify">本月</text>
		            <text class="data-classify">{{month_profit}}</text>
		          </view>
		        </view>
		        <view class="jiesuan">
		          <view class="jiesuan-item" @click="go_jiesuan(0)">
		            <view class="jiesuan-item-flex borderRight">
		              <view class="jiesuan-item-left">
		                <view class="small">待结算</view>
		                <view class="big">{{wait_balance_profit	}}
						<!-- <i v-if="!wait_balance_profit" class="weui-loading" style="width: 30px;height:30px;"></i> -->
						<u-loading-icon v-if="!wait_balance_profit" mode="semicircle" ></u-loading-icon>
						</view>
		              </view>
		              <view class="jiesuan-item-right">
		                <image mode='widthFix' class="jiesuan-item-img" :src="http_host+'/HTML/images/shop/images/right_jian.png'" />
		              </view>
		            </view>
		          </view>
		          <view class="jiesuan-item" @click="go_jiesuan(1)">
		            <view class="jiesuan-item-flex margin-left-15">
		              <view class="jiesuan-item-left">
		                <view class="small">已结算</view>
		                <view class="big">{{has_balance_profit}}
						<!-- <i v-if="!has_balance_profit" class="weui-loading" style="width: 30px;height:30px;"></i> -->
						<u-loading-icon v-if="!has_balance_profit" mode="semicircle" ></u-loading-icon>
						</view>
		              </view>
		              <view class="jiesuan-item-right">
		                <image mode='widthFix' class="jiesuan-item-img" :src="http_host+'/HTML/images/shop/images/right_jian.png'" />
		              </view>
		            </view>
		          </view>
		        </view>
		      </view>
		      <!--收益数据top-->
		      <view class="earnings-detail-footer">
		        <view class="footer-top">
		          <view class="footer-top-left">我的客户</view>
		          <!-- <view class="footer-top-right" bindtap='toScope'>
		            <text class="skin-color-{{theme}}">立即邀请</text>
		            <image mode='widthFix' class="footer-top-right-img" src="{{http_host}}/HTML/images/shop/images/right_jian.png" />
		          </view> -->
		        </view>
		        <view class="jiesuan" >
		          <view class="jiesuan-item">
		            <view class="jiesuan-item-flex borderRight">
		              <view class="jiesuan-item-left">
		                <view class="small">客户累计收益<text class='team-tip' @click="showtip">?</text></view>
		                <navigator class="big"  url="../myTeam/myTeam" hover-class='no-hover'>{{team_profit}}
						<!-- <i v-if="!team_profit" class="weui-loading" style="width: 30px;height:30px;"></i> -->
						<u-loading-icon v-if="!team_profit" mode="semicircle" ></u-loading-icon>
						</navigator>
		              </view>
		
		            </view>
		            <navigator class="margin-top-20" url="../myTeam/myTeam" hover-class='no-hover'>
		              <text class="time-classify">今日</text>
		              <text class="data-classify">{{today_team_profit}}</text>
		            </navigator>
		          </view>
		          <navigator class="jiesuan-item" url="../myTeam/myTeam" hover-class='no-hover'>
		            <view class="jiesuan-item-flex margin-left-15">
		              <view class="jiesuan-item-left">
		                <view class="small">客户总人数</view>
		                <view class="big">{{team_count}}
						<!-- <i v-if="!team_count&&team_count==''" class="weui-loading" style="width: 30px;height:30px;"></i> -->
						<u-loading-icon v-if="!team_count&&team_count==''" mode="semicircle" ></u-loading-icon>
						</view>
		              </view>
		              <view class="jiesuan-item-right">
		                <image mode='widthFix' class="jiesuan-item-img" :src="http_host+'/HTML/images/shop/images/right_jian.png'" />
		              </view>
		            </view>
		            <view class="margin-top-20 margin-left-15">
		              <text class="time-classify">今日</text>
		              <text class="data-classify">{{today_team_count}}</text>
		            </view>
		          </navigator>
		        </view>
		      </view>
		    </view>
		  </view>
		  <!-- 收益数据 -->
		  <!-- 身份特权 start -->
		  <view v-if="Type==1 && identity.length>0">
		    <view id="privilege" class="weui-tab__bd-item">
		      <navigator class="weui-cell weui-cell_access" url='../identy/identyPromot' v-if="is_senior_promotion_open == 1">
				<view class="weui-cell__info">
					<view class="weui-cell__hd">
					<image mode='widthFix' class='weui-cell__hd_img' :src="http_host+'/HTML/images/shop/images/tgjl.png'"/>
					</view>
					<view class="weui-cell__bd">
					<view class='weui-cell__bd_first'>{{open_data.promotion_name}}</view>
					<view >当前为{{identity[0]}}</view>
					</view>
				</view>
		        <view class="weui-cell__ft"></view>
		      </navigator>
		      <navigator class="weui-cell weui-cell_access" url="../identy/identy?type=1" v-if="is_regional_open == 1">
				<view class="weui-cell__info">
					<view class="weui-cell__hd">
					<image mode='widthFix' class='weui-cell__hd_img' :src="http_host+'/HTML/images/shop/images/qyjl.png'"/>
					</view>
					<view class="weui-cell__bd">
					<view class='weui-cell__bd_first'>{{open_data.regional_name}}</view>
				</view>
		        </view>
		        <view class="weui-cell__ft"><block v-if="is_regional_upgrade==1">可升级</block><block v-if="is_regional_upgrade==2">待审核</block><block v-if="is_regional_upgrade==3">待分配</block></view>
		      </navigator>
		      <navigator class="weui-cell weui-cell_access" url='../identy/identyStore' v-if="is_store_open == 1">
				<view class="weui-cell__info">
		        <view class="weui-cell__hd">
		          <image mode='widthFix' class='weui-cell__hd_img' :src="http_host+'/HTML/images/shop/images/dpjl.png'"/>
		        </view>
		        <view class="weui-cell__bd">
		          <view class='weui-cell__bd_first'>{{open_data.store_name}}</view>
		        </view>
				</view>
		        <view class="weui-cell__ft"><block v-if="is_store_upgrade==1">可升级</block><block v-if="is_store_upgrade==2">待审核</block></view>
		      </navigator>
		    </view>
		  </view>
		  <!-- 身份特权 end -->
		</view>
		<!-- 底部导航 悬浮导航-->
		<!-- <import src="/components/common/common.wxml" />
		<template is="common" />
		<authorize bind:setuser="SetUserInfoHandler"></authorize> -->
	</view>
</template>

<script>
	import earningsFigures from './earningsFigures.js'
	export default {
	  ...earningsFigures,
	}
</script>

<style>
/* public/pages/award/earningsFigures/earningsFigures.wxss */
/* @import '../../../../shop_public.wxss'; */
page{background-color: #f5f5f5} 
.no-hover{background: transparent}
.container{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
}
/*我的特权-收益数据start*/
.earnings-top{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    width: 100%;
    height: 190rpx;
    background-color: #7f8aef;   
}
.earnings-top-img{
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    vertical-align: middle;
    margin-left: 30rpx;
    margin-right: 20rpx;
}
.earnings-top-middle{
    -webkit-flex: 1;
    -webkit-box-flex: 1;
    flex: 1;
    width: 50%;
}
.earnings-top-middle-top{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 30rpx;
    color: #ffffff;
    /* margin-bottom: 10rpx; */
}
.earnings-top-middle-middle{
    padding: 8rpx 16rpx;
    background-color:rgba(255,255,255,0.2);
    color:rgba(255,255,255,.8);
    font-size: 22rpx;
    border-radius: 50rpx;
    margin-right: 20rpx;
}
.earnings-top-right{
    margin-right: 20rpx;
    margin-top: -110rpx;
    font-size: 24rpx;
    color: rgba(255,255,255,.5);
    margin-left: 30rpx;
}
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
.earnings-detail-top{background-color: #ffffff;padding: 0 30rpx;}
.totol-earnings{
    padding: 54rpx 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
}
.totol-earnings-left{
    -webkit-flex: 1;
    -webkit-box-flex: 1;
    flex: 1;
    width: 50%;
}
.totol-earnings-left .small{
    font-size: 28rpx;
    color: #333333;
}
.totol-earnings-left .big{
    font-size: 60rpx;
    color: #333333;
}
.totol-earnings-right{
    margin: 0 30rpx;
}
.totol-earnings-right-img,.jiesuan-item-img,.footer-top-right-img{
    width: 30rpx;
    height: 30rpx;
    
}
.totol-earnings-time{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    line-height: 40rpx;
    padding-bottom: 50rpx;
}
.totol-earnings-time-item,.jiesuan-item,.jiesuan-item-left,.footer-top-left{
    -webkit-flex: 1;
    -webkit-box-flex: 1;
    flex: 1;
    width: 50%;
}
.totol-earnings-time .left{text-align: left;}
.totol-earnings-time .middle{text-align: center;border-left: 2rpx solid #e8e8e8;border-right: 2rpx solid #e8e8e8;}
.totol-earnings-time .right{text-align: right;}
.time-classify{font-size: 24rpx;color: #999999;}
.data-classify{font-size: 24rpx;color: #333333;margin-left: 10rpx;}
.jiesuan{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    padding: 50rpx 0;
    border-top: 2rpx solid #e5e5e5;
}
.jiesuan-item-flex{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
}
.borderRight{
    border-right: 2rpx solid #e5e5e5;
}
.margin-left-15{
    margin-left: 30rpx;
}
.jiesuan-item-right{
    margin: 0 30rpx;
}
.jiesuan-item-left .small{
    font-size: 24rpx;
    color: #333333;
}
.jiesuan-item-left .big{
    font-size: 40rpx;
    color: #333333;
    margin-top: 20rpx;
}
.earnings-detail-footer{background-color: #ffffff;padding: 0 30rpx;margin-top: 20rpx;}
.footer-top{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    padding: 40rpx 0;
}
.footer-top-left{
    font-size: 32rpx;
}
.footer-top-right text{
    font-size: 28rpx;
    color: #7f8aef;
}
.footer-top-right-img{
    width: 30rpx;
    height: 30r5px;
    vertical-align: -4rpx;
    margin-right: 30rpx;
}
.margin-top-20{
    margin-top: 40rpx;
}
#privilege {
    font-size: 26rpx;
    color: #999;
}
#privilege .weui-cell__bd .weui-cell__bd_first {  
    margin-bottom: 14rpx;
    font-size: 30rpx;
    color: #333;
    line-height: 1;
	display: inline-block;
}
#privilege .weui-cell__info{
	display: flex;
	align-items:center;
	justify-content: flex-start;
}
#privilege .weui-cell {
    padding: 25rpx 30rpx;
}
.weui-cell_access{
	background-color: #fff;
	display:flex;
	justify-content:space-between;
	align-items:center;
}
.weui-cell__hd img{margin-right: 20rpx;}
.weui-cell__hd_img{
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%
}

.weui-cell_access .weui-cell__ft:after {
  content: " ";
  display: inline-block;
  height: 12rpx;
  width: 12rpx;
  border-width: 4rpx 4rpx 0 0;
  border-color: #C8C8CD;
  border-style: solid;
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  top: -4rpx;
  top: 50%;
  margin-top: -8rpx;
  right: 4rpx;
}
.team-tip{width: 14px;height: 14px;background: rgb(153, 153, 153);border-radius: 50%;display: inline-block;color: #fff;line-height: 14px;text-align: center;font-size: 10px;margin-left: 5px}
.end-time{font-size: 13px;color: #fff;display: block;}
.position-ab{
  position: absolute; 
  right: 20rpx;
  top:130rpx
}
 .position-re{position: relative}
/*我的特权-收益数据end*/
</style>
