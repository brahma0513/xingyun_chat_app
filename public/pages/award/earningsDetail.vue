<template>
	<view>
		<!--public/pages/award/earningsDetail/earningsDetail.wxml-->
		<view class='container'>
		  <!-- top -->
		  <view class="detail-top">
		    <view class="detail-blank">
		    <text>{{moneyA}}</text>
		    <text class="small">{{moneyB}}</text>
		    </view>
		    <view class="detail-hui">{{Type}}</view>
		  </view>
		  <!-- top -->
		  <view class="detail-footer">
		    <view class="detail-footer-detali">
		      <view class="detail-footer-detali-left">类型</view>
		      <view class="detail-footer-detali-right">{{style}}</view>
		    </view>
		    <view class="detail-footer-detali">
		      <view class="detail-footer-detali-left">状态</view>
		      <view class="detail-footer-detali-right">{{status}}
		        <!-- <block wx:if="{{status == 1}}">已结算</block>
		        <block wx:if="{{status == 0}}">未结算</block> -->
		      </view>
		    </view>
		    <view class="detail-footer-detali">
		      <view class="detail-footer-detali-left">时间</view>
		      <view class="detail-footer-detali-right">{{create_time}}</view>
		    </view>
		    <view class="detail-footer-detali">
		      <view class="detail-footer-detali-left">交易单号</view>
		      <view class="detail-footer-detali-right">{{batchcode}}</view>
		    </view>
		    <view class="detail-footer-detali">
		      <view class="detail-footer-detali-left">买家</view>
		      <view class="detail-footer-detali-right">{{own_user_name}}</view>
		    </view>
		  </view>
		
		  <view class="detail-footer">
		    <view class="detail-footer-detali">
		      <view class="detail-footer-detali-left">备注</view>
		      <view class="detail-footer-detali-right">
				  <rich-text :nodes="remark"></rich-text>
			  </view>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
	import earningsDetail from './earningsDetail.js'
	export default {
	  ...earningsDetail,
	}
</script>

<style>
/* public/pages/award/earningsDetail/earningsDetail.wxss */
/* @import '../../../../shop_public.wxss'; */
page{background-color: #f5f5f5;}
.container{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: column; 
}
/*收益详情start*/
.detail-top{
    padding: 20px 0 35px 0;
    text-align: center;
    background-color: #fff;
}
.detail-blank{
    font-size: 30px;
    color: #333333;
}
.detail-blank .small{
    font-size: 25px;
}
.detail-hui{
    font-size: 14px;
    color: #999999;
}
.detail-footer{padding:0px 15px 10px 15px;background: #fff;margin-top: 10px;}
.detail-footer-detali{width: 100%;padding: 15px 0 5px 0;display: -webkit-box;display:-webkit-flex;display: flex;align-items: center;background: #fff;}
.detail-footer-detali-left{-webkit-box-flex: 1;-webkit-flex: 1;flex: 1;width: 50%;font-size: 16px;color: #333333;}
.detail-footer-detali-right{margin-left: 10px;text-align: right;font-size: 16px;color: #5d5d5d;}
.colorRed{
    color: red;
}
.height-300{
    height: 300px;
}
/*收益详情end*/
</style>
