<template>
	<view class="edit">
		<view class="edit-main">
			<view class="namedata">
				<u-form class="edit-main-form" labelPosition="top" :model="form" :rules="rules"
					:labelStyle="{fontSize: '34rpx',color:'#666'}" labelWidth="100" errorType="none" ref="uform">
					<u-form-item :label="$t('login.safeEmail')" borderBottom ref="formItem"
						:required="true" prop="param.email">
						<u-input :placeholder="$t('login.enter_safeEmail')" v-model="form.param.email"
							border="none"></u-input>
					</u-form-item>

					<u-form-item :label="$t('as-up-pwd.code-label')" prop="param.code" borderBottom ref="formItem" :required="true">
						<u-input :placeholder="$t('login.textContent_18')" v-model="form.param.code" maxlength="6" border="none"
							type="number">
							<template slot="suffix">
								<u-code ref="uCode" @change="codeChange" seconds="60" :changeText="$t('as-up-pwd.get-x-code')"></u-code>
								<u-button @tap="send_email_code" :text="tips" size="mini" :class="'custom-style'"
									:style="'color: '+style_color_hex+';border-color:'+style_color_hex"></u-button>
							</template>
						</u-input>
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="save-bottom">
			<view :class="'save-btn skin-bg-'+theme+''" @click="changeEmail">{{$t('public.confirm-update')}}</view>
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
				is_sale_email: '',
				emailReg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

				form: {
					param: {
						code: '',
						email: '',
					}
				},
				rules: {
					'param.email': [{
						required: true,
						message: this.$t('as-up-pwd.please-safe-email'),
						trigger: ['blur', 'change']
					}, {
						pattern: this.emailReg,
						message: this.$t('as-up-pwd.form-email-error'),
						trigger: ['blur', 'change']
					}],
					'param.code': [{
						required: true,
						message: this.$t('as-up-pwd.form-rules-code'),
						trigger: ['blur']
					}, {
						len: 6,
						message: this.$t('as-up-pwd.form-rules-code'),
						trigger: ['blur']
					}]
				},
			}
		},
		onLoad() {
		    uni.setNavigationBarTitle({
		      title: this.$t('user_info.bind_email')
		    });
		  },
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			
			// 发送邮箱验证码
			send_email_code() {
				// 先验证邮箱格式
				if (!this.form.param.email) {
					uni.showToast({
						title: this.$t('as-up-pwd.please-safe-email'),
						icon: 'none'
					});
					return;
				}
				
				if (!this.emailReg.test(this.form.param.email)) {
					uni.showToast({
						title: this.$t('as-up-pwd.form-email-error'),
						icon: 'none'
					});
					return;
				}
				
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: this.$t('as-up-pwd.form-code-send')
					});
					
					this.$api.uniLoginGetEmailCode({
						email: this.form.param.email,
						type: 'verify'
					}).then(res => {
						uni.hideLoading();
						if (res.errcode == 0) {
							uni.$u.toast(this.$t('as-up-pwd.form-code-sended'));
							this.$refs.uCode.start();
						} else {
							uni.showToast({
								title: res.errmsg || '发送验证码失败',
								icon: 'none'
							});
						}
					}).catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						});
					});
				} else {
					uni.$u.toast(this.$t('login.textContent_29'));
				}
			},
			
			// 修改/绑定邮箱
			changeEmail() {
				this.$refs.uform.validate().then(valid => {
					if (!valid) return;
					
					// 额外验证
					if (!this.emailReg.test(this.form.param.email)) {
						uni.showToast({
							title: this.$t('as-up-pwd.form-email-error'),
							icon: 'none'
						});
						return;
					}
					
					if (this.form.param.code.length !== 6) {
						uni.showToast({
							title: this.$t('as-up-pwd.form-rules-code'),
							icon: 'none'
						});
						return;
					}
					
					uni.showLoading({
						title: '提交中...'
					});
					
					const params = {
						email: this.form.param.email,
						code: this.form.param.code,
						customer_id:this.customer_id_en,
					};
					
					this.$api.bindEmail(params).then(res => {
						uni.hideLoading();
						if (res.errcode == 0) {
							uni.showToast({
								title: this.$t('as.bind-email-success'),
								icon: 'success',
								success: () => {
									setTimeout(() => {
										uni.navigateBack();
									}, 1500);
								}
							});
						} else {
							uni.showToast({
								title: res.errmsg || '绑定失败',
								icon: 'none'
							});
						}
					}).catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						});
					});
				}).catch(errors => {
					uni.$u.toast(errors[0].message);
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f6f6f6;
	}

	.edit {
		&-head {
			padding: 20px 0px 0px 20px;
			font-size: 15px;
		}

		&-main {
			background-color: #ffffff;
			border-radius: 10rpx;
			min-height: 220px;
			margin: 32rpx;
			display: flex;
			align-items: center;
			flex-direction: column;

			.namedata {
				display: flex;
				flex-direction: column;
				width: 650rpx;
				margin: 40rpx 0rpx 20rpx 0rpx;

				.row-input {
					margin-top: 30rpx;
					display: flex;
					align-items: center;

					text {
						font-size: 28rpx;
						color: #666;
					}
				}
			}

			&-form {
				margin: 0rpx 20rpx 0rpx 20rpx;
			}
		}

		.save-bottom {
			width: 100%;
			position: absolute;
			text-align: center;

			.save-btn {
				width: 400rpx;
				height: 80rpx;
				background-color: #db3f3f;
				color: #ffffff;
				font-size: 28rpx;
				line-height: 80rpx;
				text-align: center;
				margin: auto;
				border-radius: 80rpx;
			}
		}
	}

	.phone-tips {
		font-size: 32rpx;
		color: #4f4f4f;
		margin-bottom: 20rpx;
	}

	.custom-style {
		height: 50rpx;
		line-height: 50rpx;
	}
</style>