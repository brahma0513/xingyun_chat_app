<template>
	<view class="logout">
		<view class="logout-title">
			<view class="logout-title-icon flex-def flex-zCenter"><img :src="http_host+'/wsy_user/web/static/images/icon_zhuxiao.png'" alt=""></view>
			<view class="logout-title-name flex-def flex-zCenter">{{$t('destory-acc.destory-tips-one')}}</view>
			<view class="logout-title-text flex-def flex-zCenter">{{$t('destory-acc.destory-tips-two')}}</view>
		</view>
		<view class="logout-center bgWhite">
			<view class="logout-center-list">
				<view class="li flex-def flex-cCenter"><view class="round"></view><view class="text">{{$t('destory-acc.destory-tips-three')}}</view></view>
				<view class="li flex-def flex-cCenter"><view class="round"></view><view class="text">{{$t('destory-acc.destory-tips-four')}}</view></view>
				<view class="li flex-def flex-cCenter"><view class="round"></view><view class="text">{{$t('destory-acc.destory-tips-five')}}</view></view>
			</view>
			<view class="logout-center-text">{{$t('destory-acc.destory-tips-six')}}</view>
		</view>
		<view class="logout-bottom">
			<view :class="'logout-bottom-btn skin-bg flex-def flex-cCenter flex-zCenter  skin-bg-'+theme+''" @click="confirm()">{{$t('destory-acc.destory-now')}}</view>
			<view  v-if="baseInfo.customer_share_info.is_open_agreement==1" class="logout-bottom-pact flex-def flex-cCenter flex-zCenter"><view class="text">{{$t('destory-acc.destory-tips-seven')}}</view><view class="pact"  @click="jump()">{{$t('destory-acc.destory-agree')}}</view></view>
		</view>
		
		<u-modal :show="modal_show" :title="modal_title" :content="modal_content" @confirm="modal_confirm" :showCancelButton="true" @cancel="modal_show=false"></u-modal>
		
		<!-- <u-keyboard ref="uKeyboard" mode="number" :tooltip="true" :tips="'请输入登录密码'" @cancel="KeyboardShow=false" @confirm="cancleUser" @change="valChange" @backspace="backspace" :dotDisabled="true" :dot-enabled="false" :show="KeyboardShow" >
			<u-code-input  style="background-color: #fff;padding: 10px;justify-content: space-evenly;" v-model="psw" :disabledKeyboard="true" :maxlength="6" :dot="true" @finish="psw_finish"></u-code-input>
		</u-keyboard> -->
		<u-popup :round="8" :show="KeyboardShow" mode="center" @close="closePsw">
			<view class="bargian-chop bgWhite">
				<view class="chop-top">
					<view class="chop-title">{{$t('destory-acc.verify-phone')}}</view> 
					<view class="chop-text">{{$t('destory-acc.sms-code-send')}}</view> 
					<view class="chop-phone">{{vuex_user.country_code}}  {{phone.substring(0, 3)}}****{{phone.substring(7, 11)}} </view> 
					<view class="chop-input flex-def flex-cCenter flex-zBetween">
						<u-input :placeholder="$t('destory-acc.enter-sms-code')" border="bottom" :focus="pswFocus" v-model="code" maxlength="6" type="number">
							<template slot="suffix">
								<u-code
									ref="uCode"
									@change="codeChange"
									seconds="60"
									:changeText="$t('as-up-pwd.get-x-code')"
								></u-code>
								<u-button
									@tap="getCode"
									:text="tips"
									size="mini"
									:class="'custom-style'"
									:style="'color: '+style_color_hex+';border-color:#ffffff'"
								></u-button>
							</template>
						</u-input>
					</view>
				</view> 
				<view class="btn"><view :class="'btn-text flex-def flex-cCenter flex-zCenter skin-bg-'+theme+''" @tap="cancleUser">{{$t('destory-acc.sure-destory')}}</view></view>
			</view>	
		</u-popup>
	</view>   
	
</template>

<script>
	export default {
		data() {
			return {
				http_host: '',
				baseInfo:{},
				theme: getApp().globalData.style_color,
				price_color: getApp().globalData.price_color,
				style_color_hex: getApp().globalData.style_color_hex,
				
				modal_show: false,
				modal_title: "确定注销",
				modal_content: "一经确定将无法撤销，确定注销吗?",
				model_type: 'cancelUser',
				
				KeyboardShow:false,
				psw:'',
				pswFocus:false,
				
				phone: '',
				tips: '',
				code: '',
				is_first_code: true,	//是否第一次获取验证码
			}
		},
		onReady() {
			this.modal_title = this.$t('destory-acc.sure-destory');
			this.modal_content = this.$t('destory-acc.destory-tips-eight');
		},
		onLoad() {
			this.http_host = this.vuex_apiUrl;
			this.baseInfo = this.vuex_base;
			if(this.vuex_user.phone){
				this.phone = this.vuex_user.phone;
			}else{
				this.phone = '***********';
			}
		},
		methods: {			
			codeChange(text) {
				this.tips = text;
			},
			//获取验证码
			getCode(){
				var that = this;
				if (this.vuex_user.country_code=='+86'&&!this.$u.test.mobile(that.vuex_user.phone)) {
					uni.showToast({
						title: that.$t('destory-acc.phone-error'),
						icon: 'none'
					})
					return false;
				}
				if (this.is_first_code==true || this.$refs.uCode.canGetCode) {
					this.is_first_code = false;
				  uni.showLoading({
					title: that.$t('as-up-pwd.form-code-send')
				  })
				  var params = {
					  country_code: that.vuex_user.country_code,
					  bind_phone: that.vuex_user.phone,
					  user_id: that.vuex_user.user_id,
				  };
				  this.$api.userSendLogoutCode(params).then(res => {
				  	uni.hideLoading();
					if(res.errcode == 0){
						// 这里此提示会被this.start()方法中的提示覆盖
						uni.$u.toast(that.$t('as-up-pwd.form-code-sended'));
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}else{
						if(res.errmsg){
							uni.showToast({
								title: res.errmsg,
								icon: 'none'
							})
						}
					}
				  })
				} else {
				  uni.$u.toast(that.$t('as-up-pwd.form-code-wait'));
				}
			},
			valChange(val) {
			// 将每次按键的值拼接到value变量中，注意+=写法
				if(this.psw.length<6){
					this.psw += val;
				}
				if(this.psw.length==6){
					this.cancleUser();
				}
			},
			// 退格键被点击
			backspace() {
			// 删除value的最后一个字符
				if(this.psw.length) this.psw = this.psw.substr(0, this.psw.length - 1);
			},
			//输入完成
			psw_finish(){
				
			},
			
			//关闭密码输入
			closePsw(){
				var that = this;
				that.code = '';
				that.KeyboardShow = false;
				that.pswFocus = false;
			},
			
			//跳转协议
			jump(){
				var url = "/wsy_pub/web/index.php?m=user&a=logout_policy&customer_id="+this.vuex_customer_id_en
				this.$common.diyLinkJump(url);
			},			
			
			confirm() {
				var that = this;
				that.modal_show = true;
			},
			
			modal_confirm() {
				var that = this;
				that.modal_show = false;
				that.code = '';
				that.KeyboardShow = true;
				that.pswFocus = true;
				that.getCode();
				return; //新版不用登录密码作校验了
				
				//注销
				that.$api.userHasPossward({}).then(res=>{
					if (res.errcode == 0) {
						that.psw = '';
						that.KeyboardShow = true;
						that.pswFocus = true;
					}else if(res.errcode == 6500){
						//没有密码 跳转重置密码
						uni.showToast({
						  title: '未设置密码,将跳转重置密码',
						  duration: 2000,
						  icon:'none'
						});
						setTimeout(function(){
							uni.navigateTo({
								url:'/public/pages/user/editLoginpass',
							})
						},2000)
					}
				})
			},
			//真正的注销用户
			cancleUser(){
				let that = this;
				that.$api.cancleUser({
					code:that.code
				}).then(res=>{
					if (res.errcode == 0) {
						uni.showToast({
						  title: that.$t('destory-acc.destory-success'),
						  duration: 2000
						});
						setTimeout(function(){
							that.$common.exitLogin()
							uni.reLaunch({
							    url: '/pages/index/index',
							})
						},2000)
					}else{
						uni.showToast({
						  title: that.$t('destory-acc.destory-fail')+ res.errmsg,
						  duration: 2000,
						  icon:'none'
						});
					}
				})
			},
			//真正的注销用户
			cancleUser2(){
				let that = this;
				that.$api.login({
					op:'password',
					customer_id:this.$config.customer_id_en,
					password:this.psw,
					country_code:'+86',
					phone:this.vuex_user.phone
				}).then(res=>{
					if(res.errcode==0){
						that.$api.cancleUser({
							psw:that.psw
						}).then(res=>{
							if (res.errcode == 0) {
								uni.showToast({
								  title: that.$t('destory-acc.destory-success'),
								  duration: 2000
								});
								setTimeout(function(){
									that.$common.exitLogin()
									uni.reLaunch({
									    url: '/pages/index/index',
									})
								},2000)
							}else{
								uni.showToast({
								  title: that.$t('destory-acc.destory-fail')+ res.errmsg,
								  duration: 2000,
								  icon:'error'
								});
							}
						})
					}else{
						if(res.errmsg==$t('destory-acc.destory-tips-night')){
							res.errmsg = that.$t('destory-acc.password-error')
						}
						uni.showToast({
						  title: res.errmsg,
						  duration: 2000,
						  icon:'none'
						});
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#f6f6f6;
		
		//background-color:#000000;
	}
	.bgWhite{
	    background-color: white;
	}
	.logout .logout-title{
	    padding-top: 45px;
	}
	.logout .logout-title .logout-title-icon{
	    font-size: 0;
	    margin-bottom: 22.5px;
	}
	.logout .logout-title .logout-title-icon img{
	    width: 72.5px;
	    height: 72.5px;
	}
	.logout .logout-title .logout-title-name{
	    font-size: 17px;
	    color: #333;
	    line-height: 1;
	    margin-bottom: 14px;
	}
	.logout .logout-title .logout-title-text{
	    font-size: 13px;
	    color: #6b6b6b;
	    line-height: 1;
	    margin-bottom: 25px;
	}
	.logout .logout-center{
	    margin: 0 15px 38px;
	    padding: 24px 15px 21px;
	    border-radius: 4px;
	    -webkit-border-radius: 4px;
	    -moz-border-radius: 4px;
	    -ms-border-radius: 4px;
	    -o-border-radius: 4px;
	}
	.logout .logout-center .logout-center-list{
	    border-bottom: 0.5px solid #F0F0F0;
	}
	.logout .logout-center .logout-center-list .li{
	    line-height: 1;
	    margin-bottom: 20px;
	    font-size: 14px;
	    color: #333333;
	}
	.logout .logout-center .logout-center-list .round{
	    display: block;
	    width: 8px;
	    height: 8px;
	    background-color: #333333;
	    margin-right: 7px;
	    border-radius: 50%;
	    -webkit-border-radius: 50%;
	    -moz-border-radius: 50%;
	    -ms-border-radius: 50%;
	    -o-border-radius: 50%;
	}
	.logout .logout-center .logout-center-text{
	    padding-top: 20px;
	    font-size: 14px;
	    color: #333333;
	    line-height: 20px;
	}
	.logout .logout-bottom .logout-bottom-btn{
	    margin: 0 30px;
	    height: 40px;
	    background-color: #7F8AEF;
	    margin-bottom: 10px;
	    color: #fff;
	    font-size: 15px;
	    border-radius: 20px;
	    -webkit-border-radius: 20px;
	    -moz-border-radius: 20px;
	    -ms-border-radius: 20px;
	    -o-border-radius: 20px;
	}
	.logout .logout-bottom .logout-bottom-pact{
	    color: #6b6b6b;
	    font-size: 12px;
	}
	.logout .logout-bottom .logout-bottom-pact .pact{
	    color: rgb(106, 127, 166);
	}
	
	.bargian-chop{
		border-radius: 8px;
	}
	.bargian-chop .chop-top {
	    padding: 20px;
	}
	.bargian-chop .chop-top .chop-title {
	    font-size: 17px;
	    color: #333;
	    line-height: 1;
	    margin-top: 7px;
	    margin-bottom: 20.5px;
	}
	.bargian-chop .chop-top .chop-text {
	    font-size: 14px;
	    color: #5D5D5D;
	    line-height: 1;
	    margin-bottom: 10px;
	}
	.bargian-chop .chop-top .chop-phone {
	    font-size: 18px;
	    color: #333333;
	    line-height: 1;
	    margin-bottom: 20px;
	}
	.bargian-chop .btn {
	    padding: 11.5px 24px 16.5px;
	    font-size: 13px;
	    color: #999;
	}
	.bargian-chop .btn .btn-text {
	    height: 40px;
	    border-radius: 20px;
	    color: #fff;
	    font-size: 16px;
	}
	.custom-style {
		height: 50rpx;
		line-height: 50rpx;
	}
</style>
