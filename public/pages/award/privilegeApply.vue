<template>
	<view>
		<view v-if="is_title_img" class="form-img">
		    <image :src="title_img"></image>
		</view>
		<form @bindsubmit="save_msg()" report-submit='true' v-if="form_show">
		<view class='container' @click='hideAllSelect()'>
		  <view class="form-box" style="margin-top: 0;">
		    <view class="row">
		      <view class="label">姓名</view>
		      <view class="input-box">
				  <input type='text' placeholder="请输入姓名" v-model="name" placeholder-class="color-ccc" />
		      </view>
		    </view>
		    <view class="row">
		      <view class="label">手机号</view>
		      <view class="label" style="min-width: 65px;">
				  <u-picker :show="countryPickerShow" :columns="countryCodes" @cancel="countryPickerShow=false"  @change="bindCountryCodeChange"></u-picker>
				  <view class="weui-select" @click="countryPickerShow=true" >{{countryCodes[0][countryCodeIndex]}}</view>
				  <u-icon name="arrow-down"></u-icon>
		      </view>
		      <view class="input-box">
				  <input type='number' placeholder="请输入手机号" v-model="tel" placeholder-class="color-ccc" maxlength='11' />
		      </view>
		    </view>
		    <block v-for="(item,index) in formList" v-key="index">
		    <!--字符类型-->
		      <view class="row" v-if="item.field_type == 0">
		        <view class="label">{{item.title}}</view>
		        <view class="input-box">
					<u-input type="text" border="none" placeholderStyle='color:#828282' @input="changeVal($event,index)" :placeholder="'请输入'+item.initial_content" />
		        </view>
		      </view>
		    <!--数字类型-->
		      <view class="row" v-if="item.field_type == 1">
		        <view class="label">{{item.title}}</view>
		        <view class="input-box">
					<u-input type="number" border="none" placeholderStyle='color:#828282' @input="changeVal($event,index)" :placeholder="'请输入'+item.initial_content" />
		        </view>
		      </view>
		    <!--下拉类型-->
		      <view class="row" v-if="item.field_type == 2">
		        <view class="label">{{item.title}}</view>
		        <view class="input-box">
		          <input type='text' @click='choseOption($event)' disabled='disabled' :data-index="index" :data-input="'label'+index" :value='item.value' placeholder-class='color-ccc' :placeholder="'请选择'+item.title" />
		        </view>
		        <view v-if="item.select_tap" class='select-tap'>
		            <view class='option-tap' @click='hideSelect()' :data-text="items" :data-index="index"  v-for="(items,idx) in item.option" >{{items}}</view>
		        </view>
		      </view>
		    </block>
		    <view class="row none">
		      <view class="label">验证码</view>
			  
			  <u-input placeholder="请输入6位验证码" v-model="code" border="none">
			  	<template slot="suffix" :class="['code-box', 'skin-color-'+theme]">
			  		<u-code
			  			ref="uCode"
			  			@change="codeChange"
			  			seconds="20"
			  			changeText="X秒重新获取"
			  		></u-code>
			  		<u-button
			  			@tap="get_code"
			  			:text="tips"
			  			size="mini"
			  			class="custom-style"
			  		></u-button>
			  	</template>
			  </u-input>
		    </view>
		  </view>
		
		  <view v-if="is_name_certificate" class="form-title">实名信息</view>
		  <view v-if="is_name_certificate" class="form-box">
				<view class="row">
				  <view class="label">真实姓名</view>
				  <view class="input-box">
					<input type='text' placeholder="填写姓名" v-model="real_name" maxlength="20" />
				  </view>
				</view>
			<view :class="'row '+(is_card_pic ? '' : 'none')">
			  <view class="label">身份证</view>
			  <view class="input-box">
				  <input type='idcard' placeholder="请输入身份证号码" maxlength="18" bindinput="card" />
			  </view>
			</view>
			<view v-if="is_card_pic" class="row none">
			  <view class="label">身份证照片</view>
			</view>
			<view v-if="is_card_pic" class="upimg">
				<view class="upload-img weui-cell">
				  <view class="main">
					  <view v-if="!sfzz_img_url" @click="chooseImage()" :data-bool="'left'" class="upload-ys">
						  <image :src="http_host+'/wsy_user/web/static/images/upload.png'" class="tu"></image>
						  <p>身份证正面</p>
						  <p>(图片限制5M以内)</p>
					  </view>
					  <view v-if="sfzz_img_url" @click="del_img()" :data-bool="'left'" class="del">
						<image :src="http_host+'/wsy_user/web/static/images/icon_close_x.png'"></image>
					  </view>
					  <image v-if="sfzz_img_url" :src="sfzz_img_url" style="height: 100%;"></image>
				  </view>
				</view>
				<view class="upload-img weui-cell">
				  <view class="main">
					  <view v-if="!sfzf_img_url" @click="chooseImage()" :data-bool="'right'" class="upload-ys">
						  <image :src="http_host+'/wsy_user/web/static/images/upload.png'" class="tu"></image>
						  <p>身份证反面</p>
						  <p>(图片限制5M以内)</p>
					  </view>
					  <view v-if="sfzf_img_url" @click="del_img()" :data-bool="'right'" class="del">
						<image :src="http_host+'/wsy_user/web/static/images/icon_close_x.png'"></image>
					  </view>
					  <image v-if="sfzf_img_url" :src="sfzf_img_url" style="height: 100%;"></image>
				  </view>
				</view>
			</view>
		  </view>
		
		  <button form-type='submit' :class="[noword?'btn_opacity':'', 'btn skin-bg-'+theme]">立即申请</button>
		  <view class="rule">
		    <view class="icon_border" catchtap="checkFun">
		      <icon :class="['icon', check?'active':'']" type="success_no_circle" size="12" :color='theme_color'></icon>
		    </view>
		    <text class="tongyi" catchtap="checkFun">阅读并同意</text>
		    <text class="xieyi" catchtap="xieyi">《相关协议》</text>
		  </view>
		</view>
		</form>
		<!-- 升级说明弹窗 start -->
		<view class="pop-mask" v-if="pop_state"></view>
		<view class="upgrade-sm-pop com-pop-con" v-if="pop_state">
			<h4 class="color2">相关协议</h4>
			<span class="close" @click="close_pop()">
				<image :src='http_host+'/HTML/images/public/close.png'' mode='widthFix'> </image>
			</span>
			<view  class="sj-sm" >
				<rich-text :nodes="rules"></rich-text> 
			</view>
		</view>
	</view>
	
</template>

<script>
	import privilegeApply from './privilegeApply.js'
	export default {
	  ...privilegeApply,
	}
</script>

<style lang="scss">
	page{background-color: #f5f5f5;font-size: 13px}
	.weui-select {
	    border-right: none;
	    padding-left: 0;
	    padding-right: 15px;
	    height: 30px;
	    min-height: 30px;
	    line-height: 30px;
	}
	.weui-select:before{
	  right: 8px;
	  margin-top: -6px;
	  transform:rotate(135deg);
	  -ms-transform:rotate(135deg); 	/* IE 9 */
	  -moz-transform:rotate(135deg); 	/* Firefox */
	  -webkit-transform:rotate(135deg); /* Safari 和 Chrome */
	  -o-transform:rotate(135deg); 	
	}
	.form-img{
	  font-size: 0;
	  height: 300px;
	}
	.form-img>image{
	  width: 100%;
	  height: 100%;
	}
	.container{
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  flex-direction: column;
	}
	/*特权申请start*/
	.form-title{
	  height: 34px;
	  background-color: #f5f5f5;
	  line-height: 44px;
	  padding: 0 15px;
	  font-size: 15px;
	  color: #5d5d5d;
	}
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
	.form-box .row.none {
	  border-bottom: none;
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
	  /* padding-top: 4px; */
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
	    margin-bottom: 40px;
	}
	.icon_border{
	    width: 16px;
	    height: 16px;
	    border: 1px solid #999999;
	    border-radius: 2px;
	    display: inline-block;
	    vertical-align: -1px;
	    margin-right: 5px;
	    position: relative;
	    top: 2px;
	}
	.tongyi{
	    color: #999999;
	    font-size: 14px;
	    line-height: 1;
	}
	.xieyi{
	    color: #6a7fa6;
	    font-size: 14px;
	    line-height: 1;
	}
	icon.icon{
	    position: absolute;
	    left: 1px;
	    top: 0px;
	    color: #7f8aef;
	    display: none;
	}
	icon.icon.active{
	    display: block;
	}
	/* 身份认证 */
	.form-box .upimg{
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  padding-bottom: 5px;
	}
	.form-box .upload-img:before{
	  display: none;
	}
	.form-box .upload-img .main{
	  width: 115px;
	  height: 115px;
	  position: relative;
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	.form-box .upload-img .main>img{
	  max-height: 100%;
	  max-width: 100%;
	}
	.form-box .upload-img input[type=file]{
	  position: absolute;
	  left: 0;
	  top: 0;
	  width: 100%;
	  height: 100%;
	  z-index: 95;
	  opacity: 0;
	}
	.form-box .upload-img .upload-ys{
	  width: 100%;
	  height: 100%;
	  padding: 20px 4px;
	  border: 1px dashed #d8d8d8;
	  text-align: center;
	  line-height: 1;
	  color: #999;
	}
	.form-box .upload-img .upload-ys .tu{
	  display: inline-block;
	  width: 30px;
	  height: 23.5px;
	  margin-bottom: 8px;
	}
	.form-box .upload-img .upload-ys p{
	  display: block;
	}
	.form-box .upload-img .upload-ys p:nth-last-child(2){
	  font-size: 15px;
	}
	.form-box .upload-img .upload-ys p:last-child{
	  margin-top: 5px;
	  font-size: 10px;
	}
	.form-box .upload-img .del{
	  position: absolute;
	  width: 20px;
	  height: 20px;
	  top: -5px;
	  right: -5px;
	  background-color: #cccccc;
	  border-radius: 50%;
	  font-size: 0;
	  text-align: center;
	  padding-top: 5px;
	}
	.form-box .upload-img .del>image{
	  width: 10px;
	  height: 10px;
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
</style>
