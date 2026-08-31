<template>
	<view>
		<!--public/pages/award/identy/promotForm.wxml-->
		<form @submit="formSubmit" report-submit='true'  :hidden='page_hidden'>
		<view class='container'>
		  <view class="form-box">
		  <view class="row">
		      <view class="label">国家地区</view>
		      <view class="input-box">
		         <view v-if="level==5">中国</view>
		      <picker v-else mode="selector" @change="bindPickerChange" :value='index' :range="array" range-key="nation">
		        <input type='text' :value="array[index].nation" placeholder="选择地区" disabled='true'/>
		      </picker>
		      </view>
		    </view>
		    <view class="row">
		      <view class="label">姓名</view>
		      <view class="input-box">
		        <input type='text' v-model="name" @input="changeVal" placeholder="请输入姓名" />
		      </view>
		    </view>
		    <view class="row">
		      <view class="label" style='min-width:60px;'>手机号</view>
		      <view class="label">
		            <picker @change="bindCountryCodeChange" :value="countryCodeIndex" :range="countryCodes">
		                <view class="weui-select">{{countryCodes[countryCodeIndex]}}</view>
		            </picker>
		        </view>
		      <view class="input-box">
		        <input type='number' v-model="tel" @input="changeVal" placeholder="请输入手机号" maxlength='11'/>
		      </view>
		    </view>
		    <view class="row">
		      <view class="label">常住地址</view>
		      <view class="input-box jt-wrap" @click="cascadePopup">
		        <input type='text' :value="address ? address : '省、市、区'" disabled='true'/>
		        <image :src="http_host+'/HTML/images/shop/images/right_jian.png'" mode='widthFix' class='jt-right'></image>
		      </view>
		    </view>
		
		    <view class="row">
		      <view class="label">备注</view>
		      <view class="input-box">
		        <input type='text' v-model='mark' @input="changeVal" placeholder="请输入备注" />
		      </view>
		    </view>
		  </view>
		
		    <view class="rule">
		      <view class="icon_border" @click="checkFun">
		        <icon class="icon" :class="check?'active':''" type="success_no_circle" size="12" :color="theme_color"></icon>
		      </view>
		      <text class="tongyi" @click="checkFun">阅读并同意</text>
		      <text class="xieyi" @click="xieyi">《相关协议》</text>
		    </view>
		    <!-- 底部按钮 start -->
		    <view class="footer-mb"></view>
		    <view class="com-btn-wrap">
		      <button form-type='submit' :class="" :class="noward?'mt0 com-pay-btn btn_opacity skin-bg-'+theme:'mt0 com-pay-btn skin-bg-'+theme" >立即申请</button>
		    </view>
		    <!-- 底部按钮 end -->
		</view>
		</form>
		<!-- 地址选择器 -->
		<!-- haveStree是否需要街道,isDiy是否需要自定义字段 haveStree默认true,isDiy默认false-->
		<address-Selector ref="addressSelector" :haveStree="true" :isDiy="true" :abbreviation="abbreviation"  v-if="showPicker" :special="special_address" v-on:myevent="toggleToast"></address-Selector>
				  	<!-- 升级说明弹窗 start -->
				<view class="pop-mask" v-if="pop_state"></view>
		      <view class="upgrade-sm-pop com-pop-con" v-if="pop_state">
		        <h4 class="color2">相关协议</h4>
		        <span class="close" bindtap="close_pop">
		          <image :src="http_host+'/HTML/images/public/close.png'" mode='widthFix'> </image>
		        </span>
		        <view  class="sj-sm" >
		          <rich-text :nodes="rules"></rich-text> 
		        </view>
		      
		      </view>
		    <!-- 升级说明弹窗 end -->
	</view>
</template>

<script>
	import promotForm from './promotForm.js'
	export default {
	  ...promotForm,
	}
</script>

<style>
/* public/pages/award/identy/promotForm.wxss */
/* @import '../../../../shop_public.wxss'; */
page{background-color: #f5f5f5;font-size: 13px}
.jt-wrap{position: relative}
.jt-right{width:15px;
position:absolute;
right:0;
top:9px;
}
.container{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
}
/*特权申请start*/
.form-box {
  width: 100%;
  padding: 0px 15px;
  background-color: #fff;
  margin-top: 10px;
}
.form-box .row {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #e5e5e5;
  font-size: 16px;
  align-items: center;
  color: #333333;
  position: relative;
}
.form-box .label {
  min-width: 80px;
  -webkit-box-flex: none;
  -webkit-flex: none;
  flex: none;
  margin-right: 5px;
  color: #333;
  line-height: 30px;
}
.form-box .input-box {
  width: 50%;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
.form-box .input-box input {
  display: block;
  width: 100%;
  height: 30px;
  outline: none;
  font-size: 16px;
  color: #333333;
}
.form-box .code-box {
  -webkit-box-flex: none;
  -webkit-flex: none;
  flex: none;
  width: 95px;
  line-height: 18px;
  border-left: 1px solid #e5e5e5;
  text-align: center;
  color: #7f8aef;
}
.btn {
  font-size: 16px;
  line-height: 47px;
  color: #fff !important;
  background-color: #7f8aef !important;
  margin: 30px 15px 20px 15px;
  border-radius: 25px;
  text-align: center;
}
.btn_opacity{
    opacity: 0.5;
}
.rule{
    text-align: center;
    font-size: 12px;
    margin-top: 20px
}
.icon_border{
    width: 12px;
    height: 12px;
    border: 1px solid #999999;
    border-radius: 2px;
    display: inline-block;
    vertical-align: -1px;
    margin-right: 5px;
    position: relative;
}
.tongyi{
    color: #999999;
}
.xieyi{
    color: #6a7fa6;
}
icon.icon{
    position: absolute;
    left: -1px;
    top: -1px;
    color: #7f8aef;
    display: none;
}
icon.icon.active{
    display: block;
}
/*特权申请end*/
.upgrade-sm-pop {
	padding: 0 13px;
}
.upgrade-sm-pop h4 {
	padding: 32px 0 9px;
	font-size: 18px;
	line-height: 1;
	border-bottom: solid 1px #e5e5e5;
  display: block
}
.upgrade-sm-pop .sj-sm {
    height: 254px;
    overflow-y: auto;
    margin: 17px 0 15px;
    text-align: left;
}
.pop-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
}
.com-pop-con {
    position: fixed;
    z-index: 5000;
    width: 77.33%;
    padding: 0px 13px;
    top: 90px;
    left: 50%;
    margin-left: -38.67%;
    background-color: #FFFFFF;
    text-align: center;
    border-radius: 4px;
    overflow: hidden;
    color: #5d5d5d;
}
.com-pop-con .close {
	position: absolute;
    width: 22px;
    height: 22px;
    right: 16px;
    top: 14px;
    display: block;
    -webkit-background-size: 100%; 
    background-size: 100%;  
}
.com-pop-con .close image{
  width: 100%
}
.com-pay-btn {
	display: block;
	width: 92%;
	height: 37px;
	margin: 29px auto 0;
	border-radius: 23.5px !important;
	text-align: center;
	line-height:37px;
	font-size: 16px;
	color: #fff;
	background: #7f8aef;
	
}
.select-tap {
  position:absolute;
  width:80%;
  background:#fff;
  border:1px solid sandybrown;
  right:-18rpx;
  z-index:100;
  box-sizing: border-box;
  top:96rpx;
}
.person-infor-phone{padding-left: 10rpx}
.select-tap .option-tap{font-size: 32rpx;color: #999;line-height: 80rpx;padding-left: 15px}
.select-tap .option-tap:hover{background: rgb(175,225,245);color: #fff}
.form-box .row.top-align{align-items: start}
textarea{padding-top: 5px}
</style>
