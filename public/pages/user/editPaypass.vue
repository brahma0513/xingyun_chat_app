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
						prop="param.oldPassword"
						borderBottom
						ref="formItem"
						:required="true"
					>
						<u-input
							:placeholder="$t('as-up-pwd.old-pwd-place')"
							placeholder-class="input-place"
							v-model="form.param.oldPassword"
							maxlength="6"
							border="none"
							type="password"
						></u-input>
					</u-form-item>

					<u-form-item
						:label="$t('as-up-pwd.new-pwd-label')"
						prop="param.newPassword"
						borderBottom
						ref="formItem"
						:required="true"
					>
						<u-input
							:placeholder="$t('as-up-pay-pwd.form-rules-new-pwd')"
							placeholder-class="input-place"
							v-model="form.param.newPassword"
							maxlength="6"
							border="none"
							type="password"
						></u-input>
					</u-form-item>

					<u-form-item
						:label="$t('as-up-pwd.confirm-pwd-label')"
						prop="param.newPassword2"
						ref="formItem"
						:required="true"
					>
						<u-input
							:placeholder="$t('as-up-pwd.confirm-pwd-place')"
							placeholder-class="input-place"
							v-model="form.param.newPassword2"
							maxlength="6"
							border="none"
							type="password"
						></u-input>
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="save-bottom">
			<view :class="'save-btn skin-bg-'+theme" @click="changePassword()">{{$t('public.confirm-update')}}</view>
		</view>
		<view style="text-align: center;margin-top: 75px;">
			<text class="login-sty" @click="forgetPaypass()">{{$t('login.forgetPassword')}}</text>
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
				form: {
					param: {
						oldPassword: '',
						newPassword: '',
						newPassword2: '',
					}
				},
				rules: {
					'param.oldPassword': {
						type: 'string',
						required: true,
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
			this.$refs.uform.setRules(this.rules)
			this.rules['param.oldPassword'].message = this.$t('as-up-pwd.old-pwd-place');
			this.rules['param.newPassword'].message = this.$t('as-up-pay-pwd.form-rules-new-pwd-six');
			this.rules['param.newPassword2'].message = this.$t('as-up-pwd.confirm-pwd-place');
		},
		methods: {
			forgetPaypass() {
				const url = '/wsy_user/web/index.php?m=set&a=forget_paypassword&user_id=' + this.vuex_user.user_id + '&customer_id=' + this.vuex_customer_id_en;
				this.$common.diyLinkJump(url, 'h5', true);
			},
			changePassword() {
				const that = this;
				this.$refs.uform.validate().then(() => {
					const { oldPassword, newPassword, newPassword2 } = that.form.param;

					if (!/^\d{6}$/.test(newPassword)) {
						that.$common.showToast(that.$t('as-up-pay-pwd.form-rules-pwd-six'));
						return;
					}
					if (newPassword !== newPassword2) {
						that.$common.showToast(that.$t('as-up-pwd.form-pws-confirm-error'));
						return;
					}
					if (oldPassword === newPassword) {
						that.$common.showToast(that.$t('as-up-pwd.new-old'));
						return;
					}

					const params = {
						old_password: oldPassword,
						password: newPassword,
						repassword: newPassword2,
						op: 'change_pwd'
					};
					that.$common.showLoading();
					that.$api.editPaypass(params).then(res => {
						uni.hideLoading();
						if (res.errcode == 0) {
							that.$common.showToast(that.$t('public.save'));
							setTimeout(function() {
								uni.navigateBack({});
							}, 1000);
						} else if (res.errmsg) {
							uni.showToast({
								title: res.errmsg,
								icon: 'none'
							});
						}
					});
				}).catch(errors => {
					uni.$u.toast(errors[0] && errors[0].message ? errors[0].message : this.$t('as-up-pay-pwd.form-rules-pwd-six'));
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f6f6f6;
	}

	.input-place {
		font-size: 26rpx;
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

	.login-sty {
		color: #0081ff;
		font-size: 24rpx;
	}
</style>
