<template>
	<view class="login">
		<view class="language-box" @click="languageToggle">
			<image :src="http_host+'/uniapp_template/web/static/images/multi-languages.png'" mode="widthFix"
				class="language-icon"></image>
		</view>
		<u-notify ref="uNotify" message=""></u-notify>

		<u-toast ref="uToast"></u-toast>
		<u-modal :show="modal_show" :title="modal_title" :content='modal_content' @confirm="modal_show=false"></u-modal>
		<u-picker :show="country_show" @cancel="country_show=false" @confirm="country_confirm"
			:columns="country_columns"></u-picker>

		<u-modal :show="modalShow" showCancelButton :title="$t('login.tips')" :content="$t('login.textContent_1')"
			@confirm="confPer()" @cancel="canPer()"></u-modal>

		<view class="login-top">
			<text>{{pageTitle+app_name}}</text>
		</view>
		<view class="loginMain">
			<view>
				<view v-if="mode=='index'">
					<!-- <view :class="'registerBtn skin-bg-'+theme+''" @click="onkeyLogin">手机号一键登录</view> -->
					<view v-if="uniappSet.is_open_onekey_login>0" :class="'registerBtn skin-bg-'+theme+''"
						@click="onkeyLogin">手机号一键登录</view>
					<view class="loginBtn" @click="changMode('accountLogin')">{{$t('login.phoneLogin')}}</view>
					<view class="loginBtn" @click="changMode('accountRegister')">{{$t('login.phoneRegist')}}</view>
				</view>
				<view v-else-if="mode=='accountLogin'">
					<view class="form-row">
						<u-input :placeholder="$t('login.phoneNumber')" :focus="accountLoginFocus"
							v-model="params.phone" type="number" border="bottom" maxlength="11">
							<u--text :text="params.country_code+' '" slot="prefix" margin="0 3px 0 0" type="tips"
								suffixIcon="arrow-right" iconStyle="font-size: 15px;color:#909193;top:1px"
								@click="country_show=true"></u--text>
						</u-input>
					</view>
					<view class="form-row" v-if="login_style=='password'">
						<u-input :placeholder="$t('login.password')" password="" v-model="params.password"
							border="bottom" @confirm="accountLogin()" />
					</view>
					<view class="form-row" v-if="login_style=='identify'" @confirm="accountLogin()">
						<u-input :placeholder="$t('login.phonCode')" :maxlength="6" type="number" v-model="params.code"
							border="bottom">
							<template slot="suffix">
								<u-code ref="uCode" @change="codeChange" seconds="60"
									:changeText="'X'+$t('login.textContent_2')"></u-code>
								<!-- <u-button
									@tap="loginGetCode"
									:text="tips"
									size="mini"
									class="custom-style"
								></u-button> -->
								<view class="custom-style" @tap="loginGetCode">
									{{tips}}
								</view>
							</template>
						</u-input>
					</view>
					<view>
						<view class="login-op flex align-items-center">
							<view class="remember-me">
								<!-- <u-checkbox-group @change="rememberChange" >
									<u-checkbox name="1" shape="circle" :checked="remember_data.is_remember"></u-checkbox>
								</u-checkbox-group>
								<text class="remember-me-text">记住我</text> -->
								<text class="login-sty" @click="forgetLoginpass()">{{$t('login.forgetPassword')}}</text>
							</view>
							<view class="text-right">
								<text class="login-sty" v-if="login_style=='password'"
									@click="changLogin('identify')">{{$t('login.textContent_3')}}</text>
								<text class="login-sty" v-if="login_style=='identify'"
									@click="changLogin('password')">{{$t('login.textContent_4')}}</text>
							</view>
						</view>
					</view>
					<view :class="'registerBtn skin-bg-'+theme+''" @click="accountLogin()"> {{$t('login.login')}}
					</view>
					<view class="loginBtn" @click="changMode('index')">{{$t('login.back')}}</view>
				</view>
				<view v-else-if="mode=='accountRegister'">
					<view class="form-row">
						<u-input :placeholder="$t('login.phoneNumber')" :focus="accountRegisterFocus"
							v-model="params.phone" type="number" border="bottom" maxlength="11">
							<u--text :text="params.country_code+' '" slot="prefix" margin="0 3px 0 0" type="tips"
								@click="country_show=true" suffixIcon="arrow-right"
								iconStyle="font-size: 15px;color:#909193;top:1px"></u--text>
						</u-input>
					</view>
					<view class="form-row">
						<u-input :placeholder="$t('login.password')" password="" v-model="params.password"
							border="bottom" />
					</view>
					<view class="form-row">
						<u-input :placeholder="$t('login.confirmPassword')" password="" v-model="params.repassword"
							border="bottom" />
					</view>
					<block v-if="params.country_code=='+86'">
						<view class="form-row">
							<u-input :placeholder="$t('login.phonCode')" :maxlength="6" v-model="params.code"
								type="number" border="bottom" @confirm="accountRegister()">
								<template slot="suffix">
									<u-code ref="uCode" @change="codeChange" seconds="60"
										:changeText="'X'+$t('login.textContent_2')"></u-code>
									<!-- <u-button
										@tap="registGetCode"
										:text="tips"
										size="mini"
										class="custom-style"
									></u-button> -->
									<view class="custom-style" @tap="registGetCode">
										{{tips}}
									</view>
								</template>
							</u-input>
						</view>
						<block v-if="vuex_base.customer_share_info.is_real_name==1 && app_examine==false">
							<view class="form-row">
								<u-input :placeholder="$t('login.realName')" v-model="params.real_name"
									border="bottom" />
							</view>
							<view class="form-row">
								<u-input :placeholder="$t('login.idCard')" v-model="params.identification_number"
									border="bottom" maxlength="22" />
							</view>
							<!-- 审核模式不用上传图片 -->
							<view class="uploadBox">
								<view style="width: 48%;">
									<view class="uploadItem" @click="uploadObverse">
										<view class="imgBox imgEx1"
											:style="'background: url('+vuex_apiUrl+'/uniapp_template/web/static/images/cert1.jpg'+');background-size: 90%;background-repeat: no-repeat;background-position: center;'">
											<view class="leftTop"></view>
											<view class="leftTop2"></view>
											<view class="leftbottom"></view>
											<view class="leftbottom2"></view>
											<view class="rightTop"></view>
											<view class="rightTop2"></view>
											<view class="rightbottom"></view>
											<view class="rightbottom2"></view>
										</view>
										<image class="imgUrl" :src="certObverseView"></image>
									</view>
									<!-- <view @click="uploadImg1" class="leftBtn text-white text-lg text-center">拍摄正面</view> -->
								</view>

								<view style="width: 48%;">
									<view class="uploadItem" @click="uploadReverse">
										<view class="imgBox imgEx2"
											:style="'background: url('+vuex_apiUrl+'/uniapp_template/web/static/images/cert2.jpg'+');background-size: 90%;background-repeat: no-repeat;background-position: center;'">
											<view class="leftTop"></view>
											<view class="leftTop2"></view>
											<view class="leftbottom"></view>
											<view class="leftbottom2"></view>
											<view class="rightTop"></view>
											<view class="rightTop2"></view>
											<view class="rightbottom"></view>
											<view class="rightbottom2"></view>
										</view>
										<image class="imgUrl" :src="certReverseView"></image>
									</view>
									<!-- <view @click="uploadImg1" class="leftBtn text-white text-lg text-center">拍摄反面</view> -->
								</view>
							</view>
						</block>
					</block>

					<view class="form-row">
						<u-input :placeholder="$t('login.nickName')" v-model="params.nickname" border="bottom" />
					</view>

					<block v-if="uniappSet.is_regist_parent==true && app_examine==false">
						<view class="form-row" v-if="vuex_base.customer_share_info.is_invite_register==1">
							<u-input v-if="is_guding_invite==false" :placeholder="$t('login.inviteCode')"
								v-model="params.invite_code" type="number" border="bottom" maxlength="11" />
							<view class="flex" v-if="is_guding_invite==true">
								<u-icon name="account-fill" color="#888888" size="18"></u-icon>
								<text class="invite-c-tips">{{$t('login.inviteCode')}}：{{invite_code_show}}</text>
							</view>
						</view>
						<view class="form-row" v-else>
							<u-input v-if="is_guding_invite==false"
								:placeholder="$t('login.invitePhone')+$t('login.textContent_5')"
								v-model="params.recom_phone_num" type="number" border="bottom" maxlength="11" />
							<view class="flex" v-if="is_guding_invite==true">
								<u-icon name="account-fill" color="#888888" size="18"></u-icon>
								<text class="invite-c-tips">{{$t('login.invitePhone')}}：{{invite_code_show}}</text>
							</view>
						</view>
					</block>
					<view @click="show_invite_tips"
						v-if="vuex_base.customer_share_info.is_invite_register==1&&uniappSet.is_regist_parent==true">
						<view class="invite-tips" v-if="vuex_base.customer_share_info.invite_instruction">
							<text>{{$t('login.inviteTips')}}</text>
						</view>
						<u-popup :show="invite_show">
							<text class="invite-title">{{$t('login.inviteTips')}}</text>
							<view class="invite-content">
								<text>{{vuex_base.customer_share_info.invite_instruction}}</text>
							</view>
						</u-popup>
					</view>

					<view :class="'registerBtn skin-bg-'+theme+''" @click="accountRegister()">{{$t('login.regist')}}
					</view>
					<view class="loginBtn" @click="changMode('index')">{{$t('login.back')}}</view>
				</view>
			</view>
			<!-- <view class="oauth-login">
				<view class="flex justify-content-space-around align-items-center">
					<u-line length="20%" margin="20px" dashed></u-line>
					<text class="font-12 gray-99">其他登录方式</text>
					<u-line length="20%" margin="20px" dashed></u-line>
				</view>
				<view class="flex justify-content-center">
					<image src="../../../static/images/wechat.png" mode="aspectFill" class="login-logo"></image>
				</view>
			</view> -->
			<view class="text-center">
				<view class="agreement" v-if="vuex_base.customer_share_info.is_open_agreement==1">
					<u-checkbox-group @change="agreeChange">
						<u-checkbox name="1" shape="circle" :checked="is_agree"></u-checkbox>
					</u-checkbox-group>
					<text>{{$t('login.textContent_8')}}</text>
					<navigator class="text-blue"
						:url="'/pages/webview/webview?weburl='+vuex_apiUrl+'%2Fwsy_pub%2Fweb%2Findex.php%3Fm%3Duser%26a%3Duser_agreement%26customer_id%3D'+vuex_customer_id_en">
						{{$t('login.textContent_6')}}
					</navigator>、
					<navigator class="text-blue"
						:url="'/pages/webview/webview?weburl='+vuex_apiUrl+'%2Fwsy_pub%2Fweb%2Findex.php%3Fm%3Duser%26a%3Dprivacy_policy%26customer_id%3D'+vuex_customer_id_en">
						{{$t('login.textContent_7')}}
					</navigator>
				</view>
			</view>
		</view>
		<!-- 微信授权登录 -->
		<!-- <view @click="wechatLogin()">微信授权登录</view> -->
		<!--多语言弹窗start-->
		<u-picker :show="showLanguagePop" :columns="langList" keyName="title" :confirmText="$t('public.save')"
			:cancelText="$t('public.cancel')" @confirm="changeLanguage" @cancel="languageToggle"
			:defaultIndex="[languageIdx]"></u-picker>
		<!--多语言弹窗end-->
	</view>
</template>

<script>
	var sharetrace = "";
	// #ifdef APP-PLUS
	sharetrace = uni.requireNativePlugin('shoot-sharetrace');
	// #endif
	export default {
		data() {
			return {
				theme: getApp().globalData.style_color,
				showLanguagePop: false,
				languageIdx: 0,
				langList: [
					[{
						title: "简体中文",
						name: "zh-Hans",
						val: "zh_cn",
					}, {
						title: "繁體中文",
						name: "zh-Hant",
						val: "zh_tw",
					}, {
						title: "English",
						name: "en",
						val: "en_us"
					}]
				],
				showLoad: true,
				rotate: false,
				pageTitle: '欢迎登录',
				mode: 'index',
				showAgree: true,
				modal: '',
				showLoad: false,
				accountRegisterFocus: false,
				accountLoginFocus: false,
				send_code: "获取验证码",
				tips: '',
				params: {
					country_code: '+86',
					phone: '',
					code: '',
					code_type: 1,
					password: '',
					repassword: '',
					recom_phone_num: '',
					invite_code: '',
					parent_id: '',
					//来源哪个页面 multi_account：来源绑定多账户登陆
					from: '',
					before_user_id: '',
					phone_mark: '',
					//手机标识
					phone_mark_ypt: '',
					login_client: '',
					app_version_code: '',
					real_name: '',
					identification_number: '',
					credentials_obverse: '',
					credentials_reverse: '',
					nickname: '',
				},
				login_style: 'identify',
				is_agree: false,
				back_route: '/pages/personal_center/personal_center',
				parent_id: '', //分享下载后携带的上下级参数
				invite_show: false,
				invite_disabled: false,
				sharetrace_callback: false, //是否已执行回调 防止死循环
				is_guding_invite: false, //是否固定邀请人	true是 false否
				invite_code_show: '', //邀请人加密内容

				//记住账号密码
				remember_data: {
					is_remember: false,
					phone: '',
					password: '',
				},

				uniappSet: {},
				systemInfo: {}, //设备信息		

				//身份证正面 显示
				certObverseView: '',
				//身份证反面 显示 
				certReverseView: '',

				modal_show: false,
				modal_title: '提示',
				modal_content: '',

				country_show: false,
				country_columns: [
					['+86']
				],

				modalShow: false,
				app_examine: false,
				http_host: '',
				is_open_onekey_login: false, //是否开启手机一键登录
				app_name:''
			}
		},
		onLoad(e) {
			var that = this;
			//this.getCustomerBaseSet();
			that.http_host = that.vuex_apiUrl;
			that.pageTitle = that.$t('login.textContent_9')
			that.send_code = that.$t('login.textContent_10')
			that.modal_title = that.$t('login.tips')
			that.app_name = that.vuex_uniappSet.app_title
			// 回显默认语言
			that.languageIdx = that.langList[0].findIndex(item => item.name === uni.getLocale())
			that.uniappSet = that.vuex_uniappSet;
			that.systemInfo = uni.getSystemInfoSync();
			that.params.login_client = that.vuex_client;
			that.params.app_version_code = that.$config.appVersion;
			that.params.phone_mark = that.systemInfo.deviceId;
			if (that.vuex_client == 'app_android') {
				if (that.uniappSet.android_status != 1 && that.$config.appExamine == true) {
					that.app_examine = true;
				}
			} else if (that.vuex_client == 'app_ios') {
				if (that.uniappSet.ios_status != 1 && that.$config.appExamine == true) {
					that.app_examine = true;
				}
			}

			if (e) {
				if (e.back_route) {
					this.back_route = e.back_route;
				}
				if (e.parent_id > 0) {
					that.parent_id = e.parent_id;
					this.get_parent_info(that.parent_id);
				}
				if (e.from) {
					this.params.from = e.from;
					if (this.params.from == 'multi_account') {
						that.params.phone_mark_ypt = that.$cache.get('phone_mark_ypt');
					}
				}
				if (e.account) {
					this.params.phone = e.account;
					this.changMode('accountLogin')
				}
			}
			if (sharetrace) {
				sharetrace.getInstallTrace(res => {
					console.log(res);
					if (typeof res.data.paramsData != 'undefined' && res.data.paramsData !== '') {
						let params = this.getRequestParams(res.data.paramsData)
						console.log(params);
						if (typeof params['parent_id'] != 'undefined' && params['parent_id'] !== '') {
							that.parent_id = params['parent_id']
						}
						if (that.parent_id > 0) {
							that.get_parent_info(that.parent_id);
						}
					}
				});
			}

			// 获取链接
			var remember_data = uni.getStorageSync('login_remember_data');
			if (remember_data) {
				this.remember_data = remember_data;
				if (remember_data.is_remember == true) {
					this.params.phone = remember_data.phone;
					this.params.password = remember_data.password;
				}
			}

			if (that.uniappSet.is_country_login == true) {
				that.country_columns = [that.uniappSet.country_code_list];
			} else {
				that.params.country_code = '+86';
			}
			
			if(that.vuex_uniappSet.is_open_onekey_login > 0){
				that.onkeyLogin()
			}
		},
		methods: {
			//手机号一键登录
			onkeyLogin() {
				let that = this;
				if (this.is_agree == false && this.vuex_base.customer_share_info.is_open_agreement == 1) {
					uni.showToast({
						title: this.$t('login.textContent_13'),
						icon: 'none'
					})
					return false;
				}

				this.rotate = true;
				this.params.op = this.login_style;
				this.params.customer_id = this.$config.customer_id_en;

				this.$common.showLoading();

				//当前是否来源多账号绑定登陆
				if (this.params.from == 'multi_account') {
					//登录前用户id
					that.params.before_user_id = that.vuex_user.user_id_en;
				} else {
					that.params.before_user_id = '';
				}
				
				// var data1 =  {
				// 	phone: '17677244533',
				// 	country_code: '+86',
				// 	customer_id: that.vuex_customer_id,
				// 	client: that.vuex_client,
				// 	xd_client: that.vuex_client,
				// 	app_key: that.$config.api_key,
				// 	app_id: that.$config.app_id,
				// 	app_examine: that.$config.appExamine,
				// 	// access_token:res.authResult.access_token,
				// 	// openid:res.authResult.openid
				// 	is_onekey_login_register:that.vuex_uniappSet.is_onekey_login_register
				// }
				
				// this.$api.phoneAutoLogin(data1).then(res => {
				// 	console.log('1231231232131',res)
				// })

				// uniCloud.callFunction({
				// 	name: "testLogin", // 填写你自己的云函数名称
				// 	//传入上面获取的openid和access_token获取手机号
				// 	data: {
				// 		phone: '17677244500',
				// 		country_code: '+86',
				// 		customer_id: that.vuex_customer_id,
				// 		client: that.vuex_client,
				// 		xd_client: that.vuex_client,
				// 		app_key: that.$config.api_key,
				// 		app_id: that.$config.app_id,
				// 		app_examine: that.$config.appExamine,
				// 		// access_token:res.authResult.access_token,
				// 		// openid:res.authResult.openid
				// 		is_onekey_login_register:that.vuex_uniappSet.is_onekey_login_register
				// 	}
				// }).then(res => {
				// 	console.log('云函数返回', res);
				// 	uni.hideLoading();
				// 	if (res.result.data.errcode == 0) {
				// 		that.rotate = false;
				// 		if (res.result.data) {
				// 			if (res.result.data.data.userinfo.login_token == undefined || res.result.data.data
				// 				.userinfo.login_token == '') {
				// 				uni.showToast({
				// 					title: that.$t('login.textContent_25'),
				// 					icon: 'none',
				// 					duration: 5000
				// 				})
				// 				return false;
				// 			}

				// 			setTimeout(() => {
				// 				// console.log('看看是什么值', res.result.data.data.userinfo)
				// 				that.saveLogin(res.result.data.data.userinfo);
				// 				// uni.closeAuthView() //关闭一键登录弹出窗口
				// 				// that.onClickMsgLogin()
				// 			}, 500)


				// 			//当前是否来源多账号绑定登录 删除之前登录缓存
				// 			if (that.params.from == 'multi_account') {
				// 				this.$cache.delete('phone_mark_ypt');
				// 				this.$cache.delete('multiUserAccountList');
				// 			}
				// 		} else {
				// 			uni.showToast({
				// 				title: res.errmsg,
				// 				icon: 'none'
				// 			})
				// 		}
				// 	} else {
				// 		that.modal_show = true;
				// 		if (res.result.data.errcode == 40003) {
				// 			that.modal_content = '该手机号未注册，请先注册！'
				// 		} else {
				// 			that.modal_content = res.result.data.errmsg
				// 		}
				// 		that.rotate = false;
				// 	}

				// }).catch(err => {
				// 	console.log('云函数出错', err)
				// 	uni.showToast({
				// 		title: err,
				// 		icon: 'none'
				// 	})
				// })

				uni.preLogin({
					provider: 'univerify',
					success() { //预登录成功
						// 显示一键登录选项
						uni.login({
							provider: 'univerify',
							univerifyStyle: {
								"fullScreen": true,
							},
							success(res) { // 登录成功
								console.log(res.authResult.access_token);
								console.log(res.authResult.openid);

								uniCloud.callFunction({
									name: "testLogin", // 填写你自己的云函数名称
									//传入上面获取的openid和access_token获取手机号
									data: {
										country_code: '+86',
										customer_id: that.vuex_customer_id,
										client: that.vuex_client,
										xd_client: that.vuex_client,
										app_key: that.$config.api_key,
										app_id: that.$config.app_id,
										app_examine: that.$config.appExamine,
										access_token:res.authResult.access_token,
										openid:res.authResult.openid,
										is_onekey_login_register:that.vuex_uniappSet.is_onekey_login_register,
										baseUrl:that.$config.apiUrl
									}
								}).then(res => {
									// console.log(res);
									uni.hideLoading();
									if (res.result.data.errcode == 0) {
										that.rotate = false;
										if (res.result.data) {
											if (res.result.data.data.userinfo.login_token ==undefined || res.result.data.data.userinfo.login_token =='') {
												uni.showToast({
													title: that.$t('login.textContent_25'),
													icon: 'none',
													duration: 5000
												})
												return false;
											}

											setTimeout(() => {
												// console.log('看看是什么值', res.result.data.data.userinfo)
												that.saveLogin(res.result.data.data.userinfo);
												uni.closeAuthView() //关闭一键登录弹出窗口
												// that.onClickMsgLogin()
											}, 500)

											//当前是否来源多账号绑定登录 删除之前登录缓存
											if (that.params.from == 'multi_account') {
												this.$cache.delete('phone_mark_ypt');
												this.$cache.delete('multiUserAccountList');
											}
										} else {
											uni.showToast({
												title: res.errmsg,
												icon: 'none'
											})
										}
									} else {
										that.modal_show = true;
										if (res.result.data.errcode == 40003) {
											that.modal_content = '该手机号未注册，请先注册！'
										} else {
											that.modal_content = res.result.data.errmsg
										}
										that.rotate = false;
									}

								}).catch(err => {
									uni.hideLoading();
									console.log('云函数出错', err)
									uni.showToast({
										title:err,
										icon:'none'
									})
								})

							},
							fail(res) { // 登录失败
								uni.hideLoading();
								console.log(res.errMsg)
							}
						})
					},
					fail(res) {
						uni.hideLoading();
						// 预登录失败
						// 不显示一键登录选项（或置灰）
						// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
						console.log(res.errCode)
						console.log(res.errMsg)
						if(res.errCode == 30005){
							console.log('12312312312312312')
							that.modal_show = true;
							that.modal_content = '一键登录需要开始数据流量功能'
						}
						
					}
				})
			},
			// 切换语言
			changeLanguage(e) {
				var that = this;
				that.languageIdx = e.indexs[0];
				let langCode = e.value[0].name;
				that.$api.publicChangeLang({
					lang: e.value[0].val
				}).then(res => {
					uni.setLocale(langCode);
					that.$i18n.locale = langCode;
					that.languageToggle();
				})
			},
			languageToggle() {
				this.showLanguagePop = !this.showLanguagePop;
			},
			getRequestParams(urlStr) {
				if (typeof urlStr == "undefined") {
					var url = decodeURI(location.search); //获取url中"?"符后的字符串
				} else {
					if (urlStr.indexOf("?") != -1) {
						var url = urlStr;
					} else {
						var url = "?" + urlStr;
					}
				}
				var theRequest = new Object();
				if (url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
					}
				}
				return theRequest;
			},
			getCustomerBaseSet() {
				var that = this;
				this.$api.getCustomerBaseSet({}).then(res => {
					var base_info = res.data;
					that.$u.vuex('vuex_base', base_info);
				})
			},
			changMode(e) {
				if (this.rotate) {
					this.$common.showToast(this.$t('login.textContent_11'));
				} else {
					// 焦点置入
					switch (e) {
						case 'accountRegister':
							this.is_agree = false;
							this.accountRegisterFocus = true;
							this.pageTitle = this.$t('login.textContent_12');
							break;
						case 'accountLogin':
							this.is_agree = false;
							this.accountLoginFocus = true;
							this.pageTitle = this.$t('login.textContent_9');
							break;
						default:
							this.accountLoginFocus =
								this.accountRegisterFocus =
								false;
							break;
					}
					this.mode = e
				}
			},
			accountRegister() {
				var that = this;
				if (this.is_agree == false && this.vuex_base.customer_share_info.is_open_agreement == 1) {
					uni.showToast({
						title: this.$t('login.textContent_13'),
						icon: 'none'
					})
					return false;
				}
				if (!this.params.country_code) {
					uni.showToast({
						title: this.$t('login.textContent_14'),
						icon: 'none'
					})
					return false;
				}
				if (!this.params.phone) {
					uni.showToast({
						title: this.$t('login.textContent_15'),
						icon: 'none'
					})
					return false;
				} else if (!this.params.password) {
					uni.showToast({
						title: this.$t('login.textContent_16'),
						icon: 'none'
					})
					return false;
				} else if (this.params.password != this.params.repassword) {
					uni.showToast({
						title: this.$t('login.textContent_17'),
						icon: 'none'
					})
					return false;
				}

				if (this.params.country_code == '+86') {
					//大陆地区的校验
					if (!this.params.code) {
						uni.showToast({
							title: this.$t('login.textContent_18'),
							icon: 'none'
						})
						return false;
					}

					//非上架审核状态下
					if (this.app_examine == false) {
						//实名认证校验
						if (this.vuex_base.customer_share_info.is_real_name == 1) {
							if (!this.params.real_name) {
								uni.showToast({
									title: this.$t('login.textContent_19'),
									icon: 'none'
								})
								return false;
							}
							if (!this.params.identification_number) {
								uni.showToast({
									title: this.$t('login.textContent_20'),
									icon: 'none'
								})
								return false;
							}
							//开启上传身份证正反面，并且必填
							if (this.vuex_base.certification_set.id_verify_open == 1 && this.vuex_base.certification_set
								.id_verify_model == 1) {
								if (this.params.credentials_obverse.length < 1) {
									uni.showToast({
										title: this.$t('login.textContent_21'),
										icon: 'none'
									})
									return false;
								}
								if (this.params.credentials_reverse.length < 1) {
									uni.showToast({
										title: this.$t('login.textContent_22'),
										icon: 'none'
									})
									return false;
								}
							}
						}
					}
				}

				if (this.vuex_base.customer_share_info.is_invite_register == 1 && this.app_examine == false) {
					if (this.params.invite_code != "") {
						this.$api.checkInviteCode({
							'invite_code': this.params.invite_code
						}).then(res => {
							if (res.errcode > 0) {
								uni.showToast({
									title: this.$t('login.textContent_23'),
									icon: 'none'
								})
								return false;
							} else {
								that.doRegister();
							}
						})
					} else {
						uni.showToast({
							title: this.$t('login.textContent_24'),
							icon: 'none'
						})
						return false;
					}
				} else {
					//调用注册接口
					that.doRegister();
				}
			},
			//注册接口
			doRegister() {
				var that = this;
				this.rotate = true;
				this.$common.showLoading();
				var reg_params = {
					'country_code': this.params.country_code,
					'area_num': this.params.country_code,
					'phone': this.params.phone,
					'code': this.params.code,
					'password': this.params.password,
					'repassword': this.params.repassword,
					'recom_phone_num': this.params.recom_phone_num,
					'invite_code': this.params.invite_code,
					'real_name': this.params.real_name,
					'identification_number': this.params.identification_number,
					'credentials_obverse': this.params.credentials_obverse,
					'credentials_reverse': this.params.credentials_reverse,
					'nickname': this.params.nickname,
					'use_new_api': 1,
					'app_examine': this.app_examine,
				}
				if (this.params.country_code == '+86') {
					if (this.app_examine == true) {
						//审核模式下简易注册
						this.$api.userRegist(reg_params).then(res => {
							// console.log(res)
							that.rotate = false;

							if (res.errcode == 0) {
								//注册成功 直接登录
								uni.hideLoading();

								//清空验证码 调登录接口
								that.params.code = '';
								that.accountLogin();
							} else {
								if (res.errmsg) {
									uni.showToast({
										title: res.errmsg,
										icon: 'none'
									})
								}
							}
						})
					} else {
						this.$api.register(reg_params).then(res => {
							// console.log(res)
							that.rotate = false;

							if (res.errcode == 0) {
								//注册成功 直接登录
								uni.hideLoading();

								//清空验证码 调登录接口
								that.params.code = '';
								that.accountLogin();
							} else {
								if (res.errmsg) {
									uni.showToast({
										title: res.errmsg,
										icon: 'none'
									})
								}
							}
						})
					}

				} else {
					//国际账号登录
					this.$api.userRegistInternational(reg_params).then(res => {
						that.rotate = false;
						if (res.errcode == 0) {
							//注册成功 直接登录
							uni.hideLoading();
							//清空验证码 调登录接口
							that.params.code = '';
							that.accountLogin();
						} else {
							if (res.errmsg) {
								uni.showToast({
									title: res.errmsg,
									icon: 'none'
								})
							}
						}
					})
				}

			},
			accountLogin() {
				var that = this;
				if (this.is_agree == false && this.vuex_base.customer_share_info.is_open_agreement == 1) {
					uni.showToast({
						title: this.$t('login.textContent_13'),
						icon: 'none'
					})
					return false;
				}
				if (!this.params.country_code) {
					uni.showToast({
						title: this.$t('login.textContent_14'),
						icon: 'none'
					})
					return false;
				}
				if (!this.params.phone) {
					uni.showToast({
						title: this.$t('login.textContent_15'),
						icon: 'none'
					})
				} else {
					if (this.login_style == 'password') {
						if (!this.params.password) {
							uni.showToast({
								title: this.$t('login.textContent_16'),
								icon: 'none'
							})
							return false;
						}
					} else if (this.login_style == 'identify') {
						if (!this.params.code) {
							uni.showToast({
								title: this.$t('login.textContent_18'),
								icon: 'none'
							})
							return false;
						}
					}
					this.rotate = true;
					this.params.op = this.login_style;
					this.params.customer_id = this.$config.customer_id_en;

					this.$common.showLoading();

					//当前是否来源多账号绑定登陆
					if (this.params.from == 'multi_account') {
						//登录前用户id
						that.params.before_user_id = that.vuex_user.user_id_en;
					} else {
						that.params.before_user_id = '';
					}

					this.$api.uniLogin(this.params).then(res => {
						uni.hideLoading();

						if (res.errcode == 0) {
							this.rotate = false;
							if (res.data) {
								if (res.data.userinfo.token == undefined || res.data.userinfo.token == '') {
									uni.showToast({
										title: this.$t('login.textContent_25'),
										icon: 'none',
										duration: 5000
									})
									return false;
								}

								this.saveLogin(res.data.userinfo);

								//当前是否来源多账号绑定登录 删除之前登录缓存
								if (this.params.from == 'multi_account') {
									that.$cache.delete('phone_mark_ypt');
									that.$cache.delete('multiUserAccountList');
								}
							} else {
								uni.showToast({
									title: res.errmsg,
									icon: 'none'
								})
							}
						} else {
							if (res.errmsg) {
								// uni.showToast({
								// 	title: res.errmsg,
								// 	icon: 'none',
								// 	duration: 5000
								// })

								that.modal_show = true;
								that.modal_content = res.errmsg
							}
							this.rotate = false;
						}
					})
				}
			},
			saveLogin(userinfo) {
				var that = this;
				//记录新的用户信息
				this.$store.state.vuex_user = userinfo;
				this.$u.vuex('vuex_user', userinfo);

				//是否记住账号密码
				if (this.remember_data.is_remember == true) {
					var remember_data = {
						is_remember: true,
						phone: this.params.phone,
						password: this.params.password
					};
					uni.setStorageSync("login_remember_data", remember_data)
				} else {
					var remember_data = {
						is_remember: false,
						phone: '',
						password: ''
					};
					uni.setStorageSync("login_remember_data", remember_data)
				}

				//更新用户昵称
				if (that.params.nickname != '') {
					that.updateProfile();
				} else {
					uni.reLaunch({
						url: this.back_route
					})
				}
				return;
				/*
				this.$u.route({
					type: 'navigateBack'
				});*/

			},
			//更新用户信息
			updateProfile() {
				var that = this;
				var params = {};
				if (that.params.nickname != '') {
					params.name = that.params.nickname;
				}
				this.$common.showLoading();
				var vuex_user = that.vuex_user;
				this.$api.editProfile(params).then(res => {
					if (res.errcode == 0) {
						vuex_user.weixin_name = params.name;
						vuex_user.sex = res.data.userinfo.sex;
						vuex_user.headimgurl = res.data.userinfo.headimgurl;
						that.$u.vuex('vuex_user', vuex_user)
					}
					uni.reLaunch({
						url: that.back_route
					})
				});
			},
			codeChange(text) {
				this.tips = text;
			},
			//登录获取验证码
			loginGetCode() {
				var that = this;
				if (this.params.country_code == '+86' && !this.$u.test.mobile(that.params.phone)) {
					uni.showToast({
						title: this.$t('login.textContent_26'),
						icon: 'none'
					})
					return false;
				}
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: this.$t('login.textContent_27')
					})
					this.$api.uniLoginGetPhoneCode(this.params).then(res => {
						uni.hideLoading();
						if (res.errcode == 0) {
							// 这里此提示会被this.start()方法中的提示覆盖
							uni.$u.toast(this.$t('login.textContent_28'));
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						} else {
							if (res.errmsg) {
								uni.showToast({
									title: res.errmsg,
									icon: 'none'
								})
							}
						}
					})
				} else {
					uni.$u.toast(this.$t('login.textContent_29'));
				}
			},
			//注册获取验证码
			registGetCode() {
				var that = this;
				if (this.params.country_code == '+86' && !this.$u.test.mobile(that.params.phone)) {
					uni.showToast({
						title: this.$t('login.textContent_26'),
						icon: 'none'
					})
					return false;
				}
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: this.$t('login.textContent_27')
					})
					this.$api.registGetPhoneCode(this.params).then(res => {
						uni.hideLoading();
						if (res.errcode == 0) {
							// 这里此提示会被this.start()方法中的提示覆盖
							uni.$u.toast(this.$t('login.textContent_28'));
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						} else {
							if (res.errmsg) {
								uni.showToast({
									title: res.errmsg,
									icon: 'none'
								})
							}
						}
					})
				} else {
					uni.$u.toast(this.$t('login.textContent_29'));
				}
			},
			changLogin(v) {
				this.login_style = v;
				this.params.code = "";
				this.params.password = "";
			},
			agreeChange(e) {
				var res = e.indexOf("1");
				if (res === 0) {
					this.is_agree = true;
				} else {
					this.is_agree = false;
				}
			},
			rememberChange(e) {
				var res = e.indexOf("1");
				if (res === 0) {
					this.remember_data.is_remember = true;
				} else {
					this.remember_data.is_remember = false;
				}
			},
			show_invite_tips() {
				if (this.invite_show == true) {
					this.invite_show = false;
				} else {
					this.invite_show = true;
				}
			},
			get_parent_info(user_id) {
				var that = this
				this.$api.getUserInfo({
					search_user_id: user_id
				}).then(res => {
					if (res.errcode == 0) {
						if (res.data.phone != "") {
							if (that.vuex_base.customer_share_info.is_invite_register == 1) {
								that.params.invite_code = that.parent_id;
								that.invite_code_show = that.replacepos(that.parent_id, 4, 6, '****')
								that.is_guding_invite = true
							} else {
								that.params.recom_phone_num = res.data.phone;
								that.invite_code_show = that.replacepos(res.data.phone, 4, 6, '****')
								that.is_guding_invite = true
							}
						}
					} else {
						if (res.errmsg) {
							uni.showToast({
								title: this.$t('login.textContent_30'),
								icon: 'none'
							})
						}
					}
				})
			},
			wxH5Login() {

			},
			wechatLogin() {
				var that = this;
				var weixinOauth = null;
				plus.oauth.getServices(function(services) {
					for (var i in services) {
						var service = services[i];
						// 获取微信登录对象 
						if (service.id == 'weixin') {
							weixinOauth = service;
							break;
						}
					}
					weixinOauth.login(function(oauth) {
						// 授权成功，weixinOauth.authResult 中保存授权信息  
						uni.showLoading({
							title: this.$t('login.textContent_31')
						})
						that.$api.wechatRegist(oauth.target.userInfo).then(res => {
							if (res.errcode == 0) {
								that.$api.getUserToken({
									login_user_id: res.uid
								}).then(res2 => {
									uni.hideLoading();
									if (res2.data) {
										that.saveLogin(res2.data.userinfo);
									} else {
										uni.showToast({
											title: res2.errmsg,
											icon: 'none'
										})
									}
								})
							} else {
								uni.hideLoading();
								if (res.errmsg) {
									uni.showToast({
										title: res.errmsg,
										icon: 'none'
									})
								}
							}
						})
					}, function(err) {
						// 登录授权失败  
						// err.code是错误码
						uni.showToast({
							title: this.$t('login.textContent_32') + '【errcode：' + err.code + '】',
							icon: 'none'
						})
					})
				}, function(err) {
					// 获取 services 失败
				})
			},
			forgetLoginpass() {
				uni.navigateTo({
					url: '/public/pages/user/forgetLoginpass'
				})
			},
			//截取字符串
			replacepos(text, start, stop, replacetext) {
				let mystr = text.substr(0, start - 1) + replacetext + text.substr(stop + 1);
				return mystr;
			},

			uploadFilePromise(url, type) {
				let that = this;
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.vuex_apiUrl +
							'/uniapp_template/web/index.php?m=app_user&a=img_save&customer_id=' + that
							.vuex_customer_id,
						filePath: url,
						name: 'file',
						header: {
							'X-Requested-With': 'XMLHttpRequest'
						},
						success: (res) => {
							setTimeout(() => {
								var code = JSON.parse(res.data)
								if (type == 'credentials_obverse') {
									that.params.credentials_obverse = code.imgurl;
									that.certObverseView = code.fullimgurl;
								} else if (type == 'credentials_reverse') {
									that.params.credentials_reverse = code.imgurl;
									that.certReverseView = code.fullimgurl;
								}
								resolve(code.fullimgurl)
							}, 1000)
						}
					});
				})
			},
			async uploadObverse() {
				let that = this;
				const result = await this.requestPermission()
				console.log("授权结果", result)
				if (result == true) {
					uni.chooseImage({
						count: 1,
						success: (chooseImageRes) => {
							const tempFilePaths = chooseImageRes.tempFilePaths;
							that.uploadFilePromise(tempFilePaths[0], 'credentials_obverse');
						}
					});
				}
			},
			async uploadReverse() {
				let that = this;
				const result = await this.requestPermission()
				console.log("授权结果", result)
				if (result == true) {
					uni.chooseImage({
						count: 1,
						success: (chooseImageRes) => {
							const tempFilePaths = chooseImageRes.tempFilePaths;
							that.uploadFilePromise(tempFilePaths[0], 'credentials_reverse');
						}
					});
				}
			},

			//消息弹窗
			showToast(params) {
				this.$refs.uToast.show({
					...params,
					complete() {
						params.url && uni.navigateTo({
							url: params.url
						})
					}
				})
			},

			//区号选择确定
			country_confirm(e) {
				this.params.country_code = e.value[0];
				this.country_show = false;
			},

			requestPermission() {
				var _this = this;

				//是否已经获取权限
				var read_external_storage = uni.getStorageSync('read_external_storage') || false;

				if (read_external_storage == false) {
					_this.$refs.uNotify.show({
						top: 0,
						type: 'warning',
						message: this.$t('login.textContent_34'),
						duration: 1500,
						fontSize: 18,
						safeAreaInsetTop: false
					})
				}

				return new Promise((resolve, reject) => {
					plus.android.requestPermissions(
						["android.permission.READ_EXTERNAL_STORAGE"],
						function(resultObj) {
							for (var i = 0; i < resultObj.granted.length; i++) {
								var grantedPermission = resultObj.granted[i];
								uni.setStorageSync('read_external_storage', true)
								//console.log('已获取的权限：'+ grantedPermission);  
								resolve(true)
								return true;
							}
							for (var i = 0; i < resultObj.deniedPresent.length; i++) {
								var deniedPresentPermission = resultObj.deniedPresent[i];
								//console.log('拒绝本次申请的权限：'+ deniedPresentPermission );
								_this.modalShow = true
								uni.setStorageSync('read_external_storage', false)
								resolve(false)
								return false;
							}
							for (var i = 0; i < resultObj.deniedAlways.length; i++) {
								var deniedAlwaysPermission = resultObj.deniedAlways[i];
								_this.modalShow = true
								uni.setStorageSync('read_external_storage', false)
								//console.log('永久拒绝申请的权限：'+ deniedAlwaysPermission);  
								resolve(false)
								return false;
							}
						},
						function(error) {
							uni.setStorageSync('read_external_storage', false)
							console.log('申请权限错误：' + error.code + " = " + error.message);
							resolve(false)
							return false;
						});
				})
			},
			confPer() {
				this.modalShow = false
				permision.gotoAppPermissionSetting()
			},
			canPer() {
				this.modalShow = false
			},
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.login {
		padding: 10% 10% 0;
		position: relative;

		.language-box {
			position: absolute;
			right: 30rpx;
			top: 30rpx;

			.language-icon {
				width: 35rpx;
			}
		}

		&-top {
			margin: 50rpx 0;
			font-size: 40rpx;
		}

		.loginMain {
			// margin:40rpx 0 40rpx 0;
		}

		.registerBtn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #ffffff;
			background-color: #db3f3f;
			font-size: 32rpx;
			border-radius: 80rpx;
			margin-bottom: 40rpx;
			margin-top: 80rpx;
		}

		.loginBtn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #333;
			background-color: #fff;
			font-size: 32rpx;
			border-radius: 80rpx;
			box-shadow: 0 0 20rpx #dadada;
			margin-bottom: 60rpx;
		}

		.login-logo {
			width: 70rpx;
			height: 70rpx;
			margin: 10rpx 20rpx;
		}

		.form-row {
			padding: 25rpx 0;
			font-size: 32rpx;
		}

		.form-code-input {
			color: #CCCCCC;
			margin-left: 20rpx;
		}

		.form-row-input {
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 32rpx;
		}

		.form-code-bnt {
			width: 180rpx;
			height: 60rpx;
			font-size: 28rpx;
			background-color: #FAFAFA;
			border: 1rpx solid #E5E5E5;
			border-radius: 10rpx;
			color: #666666;
			text-align: center;
			line-height: 60rpx;
		}

		.login-sty {
			color: #0081ff;
			font-size: 24rpx;
		}
	}

	.agreement {
		display: inline-flex;
		font-size: 24rpx;
		padding: 20rpx 0 60rpx 0;
		text-align: center;
	}

	.text-blue {
		color: #0081ff;
	}

	.text-center {
		text-align: center;
	}

	.custom-style {
		padding: 10rpx 20rpx;
		height: 60rpx;
		background-color: #FAFAFA;
		color: #666666;
		font-size: 26rpx;
		border-radius: 10rpx;
		border: 2rpx solid #ccc;
		_line-height: 60rpx;
	}

	.invite-tips {
		text-align: center;
		color: #999;
		font-size: 26rpx;
	}

	.invite-title {
		text-align: center;
		padding: 32rpx 0 9rpx;
		font-size: 40rpx;
		color: #333;
	}

	.invite-content {
		color: #999;
		padding: 30rpx;
	}

	.remember-me {
		display: inline-flex;
		font-size: 26rpx;
	}

	.remember-me-text {
		margin-top: 8rpx;
	}

	.login-op {
		display: flex;
		justify-content: space-between;
	}

	.invite-c-tips {
		color: #888;
		font-size: 30rpx;
	}

	.cert-row {
		display: flex;
		justify-content: space-between;
	}

	.uploadBox {
		background-color: #FFFFFF;
		display: flex;
		justify-content: space-between;

		.leftBtn {
			width: 100%;
			height: 75rpx;
			line-height: 75rpx;
			background-color: #007aec;
			border-radius: 0 0 12rpx 12rpx;
		}

		.uploadItem {
			width: 100%;
			height: 220rpx;
			background-color: #f1f7ff;
			border-radius: 15rpx;
			padding: 20rpx;
			position: relative;

			.imgUrl {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}

			.imgBox {
				width: 100%;
				height: 100%;
				position: relative;
			}

			.imgEx1 {
				background-size: 82%;
				background-repeat: no-repeat;
				background-position: center;
			}

			.imgEx2 {
				background-size: 82%;
				background-repeat: no-repeat;
				background-position: center;
			}

			.leftTop {
				height: 28rpx;
				width: 4rpx;
				background-color: #007aec;
				position: absolute;
				left: 0;
			}

			.leftTop2 {
				height: 4rpx;
				width: 28rpx;
				background-color: #007aec;
				position: absolute;
				top: 0;
			}

			.leftbottom {
				height: 28rpx;
				width: 4rpx;
				background-color: #007aec;
				position: absolute;
				bottom: 0;
			}

			.leftbottom2 {
				height: 4rpx;
				width: 28rpx;
				background-color: #007aec;
				position: absolute;
				bottom: 0;
			}

			.rightTop {
				height: 28rpx;
				width: 4rpx;
				background-color: #007aec;
				position: absolute;
				right: 0;
			}

			.rightTop2 {
				height: 4rpx;
				width: 28rpx;
				background-color: #007aec;
				position: absolute;
				right: 0;
				top: 0;
			}

			.rightbottom {
				height: 28rpx;
				width: 4rpx;
				background-color: #007aec;
				position: absolute;
				right: 0;
				bottom: 0;
			}

			.rightbottom2 {
				height: 4rpx;
				width: 28rpx;
				background-color: #007aec;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
	}
</style>