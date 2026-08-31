<template>
	<view class="edit">
		<u-toast ref="uToast"></u-toast>
		<view class="edit-main">
			<view class="namedata">
				
				<u-form
						class="edit-main-form"
						labelPosition="top"
						:model="form"
						:rules="rules"
						:labelStyle="{fontSize: '34rpx',color:'#666'}"
						labelWidth="300"
						errorType="none"
						ref="uform"
				>
					<u-form-item
							:label="$t('as-up-pwd.old-pwd-label')"
							prop="param.newPassword"
							borderBottom
							ref="formItem"
							:required="true"
					>
						<u-input :placeholder="$t('as-up-pwd.please')+$t('as-up-pwd.old-pwd-label')" placeholder-class="input-place" v-model="form.param.oldPassword" border="none" type="password" ></u-input>
					</u-form-item>
					
					<u-form-item
							:label="$t('as-up-pwd.new-pwd-label')"
							prop="param.newPassword"
							borderBottom
							ref="formItem"
							:required="true"
					>
						<u-input :placeholder="$t('as-up-pwd.please')+$t('as-up-pwd.new-pwd-label')" placeholder-class="input-place" v-model="form.param.newPassword" border="none" type="password" ></u-input>
					</u-form-item>
					
					<u-form-item
							:label="$t('as-up-pwd.confirm-pwd-label')"
							prop="param.newPassword2"
							
							ref="formItem"
							:required="true"
					>
						<u-input :placeholder="$t('as-up-pwd.confirm-pwd-place')" placeholder-class="input-place" v-model="form.param.newPassword2" border="none" type="password" ></u-input>
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="save-bottom">
			<view :class="'save-btn skin-bg-'+theme+''" @click="changePassword()">{{$t('public.confirm-update')}}</view>
			
		</view>
		<view style='text-align: center;margin-top: 75px;'>
			<text class="login-sty" @click="forgetLoginpass()">{{$t('login.forgetPassword')}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: getApp().globalData.style_color,
				price_color: getApp().globalData.price_color,
				style_color_hex: getApp().globalData.style_color_hex,
				tips: '',				
				
				form: {
					param: {
						code: '',
						oldPassword:'',
						newPassword: '',
						newPassword2: '',
					}
				},
				rules: {
					'param.code': {
						type: 'number',
						required: true,
						len: 6,
						message: '1',
						trigger: ['blur']
					},
					'param.newPassword': {
						type: 'string',
						required: true,
						message: '1',
						trigger: ['blur']
					},
					'param.newPassword2': {
						type: 'string',
						required: true,
						message: '1',
						trigger: ['blur']
					},
				},
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.uform.setRules(this.rules)
			this.rules['param.code'].message = this.$t('as-up-pwd.form-rules-code');
			this.rules['param.newPassword'].message = this.$t('as-up-pwd.form-rules-new-pwd');
			this.rules['param.newPassword2'].message = this.$t('as-up-pwd.confirm-pwd-place');
		},
		onLoad() {
			console.log("price_color",this.price_color)
		},
		methods: {
			change(){
				
			},
			codeChange(text) {
				this.tips = text;
			},
			forgetLoginpass(){
				uni.navigateTo({
					url: '/public/pages/user/forgetLoginpass'
				})
			},
			//获取验证码
			getCode(){
				var that = this;
				if (that.vuex_user.country_code=='+86'&&!this.$u.test.mobile(that.vuex_user.phone)) {
					uni.showToast({
						title: that.$t('as-up-pwd.form-phone-error'),
						icon: 'none'
					})
					return false;
				}
				if (this.$refs.uCode.canGetCode) {
				  uni.showLoading({
					title: that.$t('as-up-pwd.form-code-send')
				  })
				  var params = {
					  country_code: that.vuex_user.country_code,
					  phone: that.vuex_user.phone,
					  type: 2,
					  code_type: 2,
					  send_op: 'forget_password',
				  };
				  this.$api.uniLoginGetPhoneCode(params).then(res => {
				  	uni.hideLoading();
					if(res.errcode == 0){
						uni.$u.toast(that.$t('as-up-pwd.form-code-sended'));
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
			changePassword(){
				let that = this;
				this.$refs.uform.validate().then(res => {
					//密码验证
					var reg = /^[\S]{6,20}$/;
					if(!reg.test(that.form.param.newPassword)){
						that.$common.showToast(that.$t('as-up-pwd.form-pws-len-error'));
						return false;
					}
					var reg = /^[0-9]+$/;
					if(reg.test(that.form.param.newPassword)){
						that.$common.showToast(that.$t('as-up-pwd.form-pws-num-error'));
						return false;
					}
					var reg = /^[A-Za-z]+$/;
					if(reg.test(that.form.param.newPassword)){
						that.$common.showToast(that.$t('as-up-pwd.form-pws-word-error'));
						return false;
					}
										
					if(that.form.param.newPassword != that.form.param.newPassword2){
						that.$common.showToast(that.$t('as-up-pwd.form-pws-confirm-error'));
						return;
					}
					if(that.form.param.newPassword == that.form.param.oldPassword)
					{
						that.$common.showToast(that.$t('as-up-pwd.new-old'));
						return;
					}
					const params = {
						old_password: that.form.param.oldPassword,
						password: that.form.param.newPassword,
						repassword: that.form.param.newPassword2,
						op:'change_pwd'
					};
					that.$common.showLoading();
					that.$api.editLoginpass(params).then(res => {
						uni.hideLoading();
						console.log('修改密码结果',res)
						if (res.errcode == 0) {
							that.$common.showToast(that.$t('as-up-pwd.form-reset'));
							setTimeout(function() {
								that.$common.exitLogin()
								uni.reLaunch({
									url: '/pages/personal_center/personal_center'
								});
								//uni.navigateBack({})	
							}, 1000);
						}else{
							if(res.errmsg){
								uni.showToast({
									title: res.errmsg,
									icon: 'none'
								})
							}
						}
					});
				}).catch(errors => {
					// this.$refs.uToast.show({
					// 	type: 'default',
					// 	icon: false,
					// 	title: '',
					// 	position: 'top',
					// 	message: errors[0].message,
					// })
					uni.$u.toast(errors[0].message)
				})
				
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#f6f6f6;
	}
	.input-place{
		font-size: 26rpx;
	}
	.edit{
		&-head{
			padding: 20px 0px 0px 20px;
			font-size: 15px;
		}
		&-main{
			background-color:#ffffff;
			border-radius: 10rpx;
			// width:700rpx;
			min-height:550rpx;
			margin:32rpx;
			display:flex;
			align-items: center;
			justify-content:center;
			flex-direction:column;
			.namedata{
				display:flex;
				flex-direction:column;
				width:650rpx;
				margin:40rpx 0rpx 20rpx 0rpx;
				.row-input{
					margin-top:30rpx;
					display:flex;
					align-items:center;
					text{
						font-size:28rpx;
						color:#666;
					}
				}
			}
			&-form{
				margin: 0rpx 20rpx 0rpx 20rpx;
			}
		}
		.save-bottom{
			width:100%;
			position: absolute;	
			text-align: center;
			.save-btn{
				width:400rpx;
				height:80rpx;
				background-color:#db3f3f;
				color:#ffffff;
				font-size:28rpx;
				line-height:80rpx;
				text-align: center;
				margin:auto;
				border-radius:80rpx;
			}
		}
	}
	.phone-tips{
		font-size: 32rpx;
		color: #4f4f4f;
		margin-bottom: 20rpx;
	}
	.custom-style {
		height: 50rpx;
		line-height: 50rpx;
	}
	.login-sty{
		color: #0081ff;
		font-size: 24rpx;
	}
</style>