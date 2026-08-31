	<template>
		<view class="edit">
			<view class="edit-main forget-main">
				<view class="namedata">
					<u-form class="edit-main-form" labelPosition="top" :model="form" :rules="currentRules"
						:labelStyle="{ fontSize: '34rpx', color: '#666' }" labelWidth="100" errorType="none" ref="uform">

						<!-- 手机验证部分 -->
						<template v-if="usePhone">
							<u-form-item :label="$t('public.phone-label')" prop="phone" ref="formItem" :required="true">
								<view class="form-row flex a-c">
									<image :src="http_host+'/uniapp_template/web/static/images/pw-icon.png'"
										class="input-icon"></image>
									<!-- 区号选择 -->
									<view class="country-code flex a-c" @click="showCountryCodePicker = true">
										<text>{{ form.country_code }}</text>
										<image :src="http_host+'/uniapp_template/web/static/images/arrow-down.png'"
											class="arrow-down"></image>
									</view>
									<input class="input" 
										   :placeholder="$t('login.phoneNumber')"
										   placeholder-class="input-place" 
										   v-model="form.phone" 
										   type="number" 
										   maxlength="11"
										   :disabled="disablePhoneInput" />
								</view>
							</u-form-item>

							<!-- 手机验证码 -->
							<u-form-item :label="$t('as-up-pwd.code-label')" prop="phoneCode" ref="formItem" :required="true">
								<view class="flex a-c send-code-row">
									<view class="form-row flex a-c">
										<image :src="http_host+'/uniapp_template/web/static/images/pw-icon5.png'"
											class="input-icon"></image>
										<input class="input" maxlength="6" type="number" placeholder-class="input-place"
											:placeholder="$t('login.phoneCode')" v-model="form.phoneCode" />
									</view>
									<view class="send-code-bnt" :class="['skin-color-'+theme,'skin-bd-'+theme]"
										@tap="getPhoneCode">
										<u-code ref="uPhoneCode" @change="phoneCodeChange" seconds="60"
											:changeText="'X'+$t('login.textContent_2')"></u-code>
										{{phoneTips}}
									</view>
								</view>
							</u-form-item>
						</template>

						<!-- 邮箱验证部分 -->
						<template v-else>
							<u-form-item :label="$t('as-up-pwd.safe-email')" prop="email" ref="formItem" :required="true">
								<view class="form-row flex a-c">
									<image :src="http_host+'/uniapp_template/web/static/images/pw-icon.png'"
										class="input-icon"></image>
									<input class="input" 
										   :placeholder="$t('as-up-pwd.please-safe-email')" 
										   placeholder-class="input-place"
										   v-model="form.email" 
										   type="text"
										   :disabled="disableEmailInput" />
								</view>
							</u-form-item>

							<!-- 邮箱验证码 -->
							<u-form-item :label="$t('as-up-pwd.code-label')" prop="emailCode" ref="formItem" :required="true">
								<view class="flex a-c send-code-row">
									<view class="form-row flex a-c">
										<image :src="http_host+'/uniapp_template/web/static/images/pw-icon5.png'"
											class="input-icon"></image>
										<input class="input" maxlength="6" type="number" placeholder-class="input-place"
											:placeholder="$t('as-up-pwd.please-safe-email')+$t('as-up-pwd.please-code')" v-model="form.emailCode" />
									</view>
									<view class="send-code-bnt" :class="['skin-color-'+theme,'skin-bd-'+theme]"
										@tap="getEmailCode">
										<u-code ref="uEmailCode" @change="emailCodeChange" seconds="60"
											:changeText="$t('as-up-pwd.get-x-code')"></u-code>
										{{emailTips}}
									</view>
								</view>
							</u-form-item>
						</template>

						<!-- 密码部分（共用） -->
						<u-form-item :label="$t('as-up-pwd.new-pwd-label')" prop="newPassword" ref="formItem" :required="true">
							<view class="form-row flex a-c">
								<image :src="http_host+'/uniapp_template/web/static/images/pw-icon3.png'"
									class="input-icon"></image>
								<input class="input" :type="showPwd ? 'text' : 'password'" placeholder-class="input-place"
									:placeholder="$t('as-up-pwd.new-pwd-place')" v-model="form.newPassword" />
								<view class="eye-box" @click="toggleShowPwd(false)">
									<image :src="http_host+'/uniapp_template/web/static/images/pw-icon2.png'"
										class="input-icon" v-if="!showPwd"></image>
									<image :src="http_host+'/uniapp_template/web/static/images/pw-icon4.png'"
										class="input-icon" v-else></image>
								</view>
							</view>
						</u-form-item>

						<u-form-item :label="$t('as-up-pwd.confirm-pwd-label')" prop="newPassword2" ref="formItem" :required="true">
							<view class="form-row flex a-c">
								<image :src="http_host+'/uniapp_template/web/static/images/pw-icon3.png'"
									class="input-icon"></image>
								<input class="input" :type="showConfirmPwd ? 'text' : 'password'"
									placeholder-class="input-place" :placeholder="$t('as-up-pwd.confirm-pwd-place')" v-model="form.newPassword2" />
								<view class="eye-box" @click="toggleShowPwd(true)">
									<image :src="http_host+'/uniapp_template/web/static/images/pw-icon2.png'"
										class="input-icon" v-if="!showConfirmPwd"></image>
									<image :src="http_host+'/uniapp_template/web/static/images/pw-icon4.png'"
										class="input-icon" v-else></image>
								</view>
							</view>
						</u-form-item>
					</u-form>
				</view>

				<view class="save-bottom">
					<!-- 手机验证提交按钮 -->
					<view v-if="usePhone" :class="'save-btn skin-bg-'+theme+''" @click="submitPhoneForm">
						{{$t('public.confirm-update')}}
					</view>

					<!-- 邮箱验证提交按钮 -->
					<view v-else :class="'save-btn skin-bg-'+theme+''" @click="submitEmailForm">
						{{$t('public.confirm-update')}}
					</view>
				</view>

				<view class="switch-mode" @click="switchMode" v-if="is_safe_email == 1">
					<text>{{ usePhone ? $t('as-up-pwd.use-email') : $t('as-up-pwd.use-phone') }}</text>
				</view>
			</view>

			<!-- 区号选择器 -->
			<u-picker :show="showCountryCodePicker" :columns="countryCodeColumns" keyName="label"
				@confirm="onCountryCodeConfirm" @cancel="showCountryCodePicker = false"></u-picker>
		</view>
	</template>

	<script>
		export default {
			data() {
				return {
					theme: getApp().globalData.style_color,
					price_color: getApp().globalData.price_color,
					style_color_hex: getApp().globalData.style_color_hex,
					http_host: '',
					showPwd: false,
					tips: '',
					showConfirmPwd: false,
					usePhone: true,
					is_safe_email: 0,
					disablePhoneInput: false,
					disableEmailInput: false,
					user_email: '',
					showCountryCodePicker: false,

					// 表单数据
					form: {
						phone: '',
						phoneCode: '',
						email: '',
						emailCode: '',
						newPassword: '',
						country_code: '+86',
						newPassword2: ''
					},

					// 区号数据
					countryCodeColumns: [
						[
							{ label: '+86', value: '+86' },
							{ label: '+1', value: '+1' },
							{ label: '+852', value: '+852' },
							{ label: '+853', value: '+853' },
							{ label: '+65', value: '+65' },
							{ label: '+60', value: '+60' },
							{ label: '+63', value: '+63' },
							{ label: '+66', value: '+66' },
							{ label: '+81', value: '+81' },
							{ label: '+82', value: '+82' },
							{ label: '+44', value: '+44' },
							{ label: '+33', value: '+33' },
							{ label: '+49', value: '+49' },
							{ label: '+39', value: '+39' },
							{ label: '+34', value: '+34' },
							{ label: '+7', value: '+7' },
							{ label: '+61', value: '+61' },
							{ label: '+64', value: '+64' }
						]
					],

					// 验证规则
					phoneRules: {
						phone: {
							type: 'string',
							required: true,
							message: this.$t('as-up-pwd.form-no-phone'),
							trigger: ['blur'],
							validator: (rule, value, callback) => {
								if (!value) {
									callback(new Error(this.$t('as-up-pwd.form-no-phone')));
								} else if (!/^[0-9]{7,15}$/.test(value)) {
									callback(new Error(this.$t('login.verify-phone-error')));
								} else {
									callback();
								}
							}
						},
						phoneCode: {
							type: 'string',
							required: true,
							len: 6,
							message: this.$t('as-up-pwd.form-rules-code'),
							trigger: ['blur']
						},
						newPassword: {
							type: 'string',
							required: true,
							message: this.$t('as-up-pwd.form-rules-new-pwd'),
							trigger: ['blur']
						},
						newPassword2: {
							type: 'string',
							required: true,
							message: this.$t('as-up-pwd.confirm-pwd-place'),
							trigger: ['blur']
						}
					},

					emailRules: {
						email: {
							type: 'string',
							required: true,
							message: this.$t('as-up-pwd.please-safe-email'),
							pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
							trigger: ['blur']
						},
						emailCode: {
							type: 'string',
							required: true,
							len: 6,
							message: this.$t('as-up-pwd.please')+this.$t('as-up-pwd.safe-email')+this.$t('as-up-pwd.please-code'),
							trigger: ['blur']
						},
						newPassword: {
							type: 'string',
							required: true,
							message: this.$t('as-up-pwd.please')+this.$t('as-up-pwd.new-pwd-label'),
							trigger: ['blur']
						},
						newPassword2: {
							type: 'string',
							required: true,
							message: this.$t('as-up-pwd.confirm-pwd-place'),
							trigger: ['blur']
						}
					},

					// 验证码相关
					phoneTips: this.$t('as-up-pwd.get-code'),
					emailTips: this.$t('as-up-pwd.get-code')
				}
			},
			computed: {
				currentRules() {
					return this.usePhone ? this.phoneRules : this.emailRules
				}
			},
			onReady() {
			  // 确保国际化已加载后再设置
			  this.phoneTips = this.$t('as-up-pwd.get-code');
			  this.emailTips = this.$t('as-up-pwd.get-code');
			},
			onLoad() {
				this.http_host = this.vuex_apiUrl;
				this.getSafeEmailStatus();
			},
			methods: {
				codeChange(text) {
					this.tips = this.phoneTips;
				},
				
				// 区号选择确认
				onCountryCodeConfirm(e) {
					this.form.country_code = e.value[0].value;
					this.showCountryCodePicker = false;
				},
				// 获取安全邮箱状态
				getSafeEmailStatus() {
				      this.$api.getCustomerBaseSet({}).then(res => {
				        if (res.errcode == 0) {
				          this.is_safe_email = res.data.customer_share_info.is_safe_email;
				          // 根据安全邮箱状态设置默认验证方式
									this.usePhone != this.is_safe_email;
				          // 如果启用了安全邮箱且已有邮箱，禁止编辑
				          if (this.is_safe_email && this.form.email) {
				            this.disableEmailInput = true;
				          } else {
				            this.disableEmailInput = false;
				          }
				        } else {
				          console.error('获取安全邮箱状态失败:', res.errmsg);
				          this.is_safe_email = false;
				          this.usePhone = true;
				        }
				      }).catch(error => {
				        console.error('请求安全邮箱状态出错:', error);
				        this.is_safe_email = false;
				        this.usePhone = true;
				      });
				    },
				switchMode() {
					this.usePhone = !this.usePhone;
					// 清空验证码
					this.form.phoneCode = '';
					this.form.emailCode = '';
					// 重置倒计时
					this.$refs.uPhoneCode?.reset();
					this.$refs.uEmailCode?.reset();
				},

				// 手机验证码变更
				phoneCodeChange(text) {
					this.phoneTips = text;
				},

				// 邮箱验证码变更
				emailCodeChange(text) {
					this.emailTips = text;
				},

				// 获取手机验证码（直接发送，无需图形验证）
				getPhoneCode() {
					if (!this.form.phone || !/^[0-9]{7,15}$/.test(this.form.phone)) {
						uni.showToast({
							title: this.$t('login.verify-phone-error'),
							icon: 'none'
						});
						return;
					}

					if (!this.$refs.uPhoneCode.canGetCode) {
						uni.$u.toast(this.$t('login.textContent_29'));
						return;
					}

					uni.showLoading({
						title: '发送中...'
					});

					const params = {
						country_code: this.form.country_code,
						phone: this.form.phone,
						type: 2,
						send_op: 'forget_password',
					};

					this.$api.loginGetPhoneCode(params).then(res => {
						uni.hideLoading();
						if (res.errcode == 0) {
							uni.$u.toast(this.$t('login.textContent_28'));
							this.$refs.uPhoneCode.start();
						} else {
							uni.showToast({
								title: res.errmsg || '发送失败',
								icon: 'none'
							});
						}
					});
				},

				// 获取邮箱验证码
				getEmailCode() {
					if (!this.$u.test.email(this.form.email)) {
						uni.showToast({
							title: this.$t('as-up-pwd.form-email-error'),
							icon: 'none'
						});
						return;
					}

					if (!this.$refs.uEmailCode.canGetCode) {
						uni.$u.toast(this.$t('login.textContent_29'));
						return;
					}

					uni.showLoading({
						title: '发送中...'
					});

					const params = {
						email: this.form.email,
						type: 'password'
					};

					this.$api.uniLoginGetEmailCode(params).then(res => {
						uni.hideLoading();
						if (res.errcode == 0) {
							uni.$u.toast(this.$t('login.textContent_28'));
							this.$refs.uEmailCode.start();
						} else {
							uni.showToast({
								title: res.errmsg || '发送失败',
								icon: 'none'
							});
						}
					});
				},

				// 提交手机验证表单
				submitPhoneForm() {
					this.$refs.uform.validate().then(() => {
						//密码验证
						if (!/^[\S]{6,20}$/.test(this.form.newPassword)) {
							this.$common.showToast(this.$t('as-up-pwd.form-pws-len-error'));
							return false;
						}
						if (/^[0-9]+$/.test(this.form.newPassword)) {
							this.$common.showToast(this.$t('as-up-pwd.form-pws-num-error'));
							return false;
						}
						if (/^[A-Za-z]+$/.test(this.form.newPassword)) {
							this.$common.showToast(this.$t('as-up-pwd.form-pws-word-error'));
							return false;
						}
						if (this.form.newPassword !== this.form.newPassword2) {
							this.$common.showToast(this.$t('as-up-pwd.form-pws-confirm-error'));
							return;
						}

						const params = {
							country_code: this.form.country_code,
							phone: this.form.phone,
							password: this.form.newPassword,
							repassword: this.form.newPassword2,
							code_type: 'phone',
							op: 'forget_pwd',
							code: this.form.phoneCode
						};
						
						this.$common.showLoading();
						this.$api.saveLoginPassword(params).then(res => {
							uni.hideLoading();
							if (res.errcode == 0) {
								this.$common.showToast(this.$t('as-up-pwd.reset-success'));
								setTimeout(() => {
									uni.navigateBack({})
								}, 1000);
							} else {
								uni.showToast({
									title: res.errmsg || this.$t('as-up-pwd.reset-error'),
									icon: 'none'
								});
							}
						});
					}).catch(errors => {
						uni.$u.toast(errors[0].message);
					});
				},

				// 提交邮箱验证表单
				submitEmailForm() {
					this.$refs.uform.validate().then(() => {
						//密码验证
						if (!/^[\S]{6,20}$/.test(this.form.newPassword)) {
							this.$common.showToast(this.$t('as-up-pwd.form-pws-len-error'));
							return false;
						}
						if (/^[0-9]+$/.test(this.form.newPassword)) {
							this.$common.showToast(this.$t('as-up-pwd.form-pws-num-error'));
							return false;
						}
						if (/^[A-Za-z]+$/.test(this.form.newPassword)) {
							this.$common.showToast(this.$t('as-up-pwd.form-pws-word-error'));
							return false;
						}
						if (this.form.newPassword !== this.form.newPassword2) {
							this.$common.showToast(this.$t('as-up-pwd.form-pws-confirm-error'));
							return;
						}

						const params = {
							email: this.form.email,
							code_type: 'email',
							password: this.form.newPassword,
							repassword: this.form.newPassword2,
							code: this.form.emailCode
						};

						this.$common.showLoading();
						this.$api.saveLoginPassword(params).then(res => {
							uni.hideLoading();
							if (res.errcode == 0) {
								this.$common.showToast(this.$t('as-up-pwd.reset-success'));
								setTimeout(() => uni.navigateBack(), 1000);
							} else {
								uni.showToast({
									title: res.errmsg || this.$t('as-up-pwd.reset-error'),
									icon: 'none'
								});
							}
						});
					}).catch(errors => {
						uni.$u.toast(errors[0].message);
					});
				},

				// 密码显示切换
				toggleShowPwd(isConfirm = false) {
					if (isConfirm) {
						this.showConfirmPwd = !this.showConfirmPwd;
					} else {
						this.showPwd = !this.showPwd;
					}
				}
			}
		}
	</script>

	<style lang="scss">
		page {
			background-color: #f6f6f6;
		}

		.flex {
			display: flex;
		}

		.j-c {
			justify-content: center;
		}

		.j-b {
			justify-content: space-between;
		}

		.a-c {
			align-items: center;
		}

		.forget-main {
			margin: 0 !important;
			background-color: white;
			padding: 40rpx 32rpx;
		}

		.send-code-row {
			width: 100%;
			align-items: flex-end;

			.form-row {
				margin-bottom: 0 !important;
				flex: 7;
			}
		}

		.switch-mode {
			margin-bottom: 30rpx;
			text-align: right;
			font-size: 28rpx;
			margin-top: 15px;
			color: cornflowerblue;

			&:active {
				opacity: 0.7;
			}
		}

		.send-code-bnt {
			width: auto;
			min-width: 180rpx;
			text-align: center;
			font-size: 26rpx;
			border: 1rpx solid #ffffff;
			border-radius: 16rpx;
			height: 78rpx;
			line-height: 80rpx;
			margin-left: 20rpx;
		}

		.form-row {
			font-size: 32rpx;
			border: 1rpx solid #919EAB;
			border-radius: 16rpx;
			margin-top: 20rpx;
			height: 82rpx;
			width: 100%;
			position: relative;

			.country-code {
				color: #111111;
				margin-right: 20rpx;
				font-size: 28rpx;
				padding: 0 20rpx;
				border-right: 1rpx solid #eee;
				height: 40rpx;
				line-height: 40rpx;
				display: flex;
				align-items: center;

				.arrow-down {
					width: 24rpx;
					height: 24rpx;
					margin-left: 10rpx;
				}
			}

			.input-icon {
				width: 32rpx;
				height: 32rpx;
				margin: 0 20rpx;
			}

			.input {
				color: #111111;
				font-size: 28rpx;
				height: 64rpx;
				flex: 1;
				border: none;

				&:focus {
					outline: none;
				}
			}
		}

		.edit {
			&-head {
				padding: 20px 0px 0px 20px;
				font-size: 15px;
			}

			&-main {
				background-color: #ffffff;
				border-radius: 10rpx;
				min-height: 550rpx;
				margin: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				.namedata {
					display: flex;
					flex-direction: column;
					width: 100%;
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
				text-align: center;
				margin-top: 40rpx;

				.save-btn {
					width: 100%;
					height: 84rpx;
					background-color: #db3f3f;
					color: #ffffff;
					font-size: 28rpx;
					line-height: 84rpx;
					text-align: center;
					margin: auto;
					border-radius: 16rpx;
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