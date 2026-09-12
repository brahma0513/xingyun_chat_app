<!-- #ifndef APP-PLUS-NVUE -->
<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";

	/* micro_theatre_two 分包沿用独立微剧场 static/scss/_index.scss 中的 flex 工具类，未引入时标题/底栏/标签行会错位 */
	.flex {
		display: flex;
	}
	.a-c {
		align-items: center;
	}
	.j-b {
		justify-content: space-between;
	}
	.j-c {
		justify-content: center;
	}
	.j-a {
		justify-content: space-around;
	}
</style>
<!-- #endif -->
<script>
	import api from "./utils/api"
	import config from "./utils/config"
	import Store from '@/store'
	import { startIMLogin, syncIMLogin, setIMAppVisibility } from '@/utils/im'
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/xingdian/APPUpdate/js_sdk/appUpdate';
	// #endif
	export default {
		globalData: {
			logo: '',
			style_color: 'purple',
			style_color_hex: '#7f8aef',
			price_color: '',
			monetary_unit: '',
			bar_background_color_hex: 'default', //导航条背景色
			bar_front_color_hex: '#000000', //导航条字体色
			bar_color_set: '', //导航条自定义颜色应用页面
		},
		onLaunch: function() {
			let that = this;
			// 默认使用简体中文
			if (!uni.getLocale()) {
				uni.setLocale('zh-Hans');
				this.$i18n.locale = 'zh-Hans';
			}
			// #ifdef APP-PLUS
			uni.getNetworkType({
				success: function(res) {
					//console.log("首次获取网络类型",res.networkType);
					var networkType = res.networkType
					if (networkType == 'none' || networkType == 'unknown') {
						setTimeout(function() {
							that.listenNetwork();
						}, 500)
					}
				},
				fail: function(ret) {
					setTimeout(function() {
						that.listenNetwork();
					}, 500)
				}
			});
			// #endif

			this.get_user_client();
			startIMLogin();
			this.get_customer_info();
			this.getCustomerBaseSet();
			this.getUniappSetting();
			this.getAppServerSetting();
			//检查版本更新
			setTimeout(function() {
				// #ifdef APP-PLUS
				//that.updateApp()
				APPUpdate();
				// #endif	
				that.$isResolve()
			}, 2000)


			// #ifdef APP-PLUS
			// if (this.vuex_user.user_id > 0) {
			// 	this.getPushClientId();
			// }

			// uni.onPushMessage(res => {
			// 	console.log("收到推送消息：", res) //监听推送消息
			// 	const {
			// 		data
			// 	} = res;
			// 	if (res.type === 'receive') {
			// 		uni.createPushMessage({
			// 			title: data.title,
			// 			content: data.content,
			// 			payload: data.payload,
			// 			cover: false
			// 		})
			// 	} else if (res.type === 'click') {
			// 		console.log(res);
			// 	}

			// })
			// #endif

		},
		onShow: function() {
			setIMAppVisibility(true);
			syncIMLogin();
			this.asyncCheckIsOnline();
		},
		onHide: function() { setIMAppVisibility(false); },
		methods: {
			get_customer_info() {
				const that = this;
				api.getCustomInfo({}).then(res => {
					//console.log(res)
					if (res.errcode == 0) {
						that.globalData.style_color = res.style;
						that.globalData.style_color_hex = res.style_color_hex;
						that.globalData.logo = res.data.customers.logo;
						that.globalData.price_color = res.price_style;
						that.globalData.monetary_unit = res.show_monetary_unit;
						that.globalData.bar_background_color_hex = res.bar_background_color_hex;
						that.globalData.bar_front_color_hex = res.bar_front_color_hex;
						that.globalData.bar_color_set = res.bar_color_set;
					}
				})

			},
			browser() {
				var u = navigator.userAgent
				return {
					trident: u.indexOf("Trident") > -1, // IE内核
					presto: u.indexOf("Presto") > -1, // opera内核
					webKit: u.indexOf("AppleWebKit") > -1, // 苹果、谷歌内核
					gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, // 火狐内核
					mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
					android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, // android终端
					iPhone: u.indexOf("iPhone") > -1, // 是否为iPhone或者QQHD浏览器
					iPad: u.indexOf("iPad") > -1 || u.indexOf("Macintosh") > -1, // 是否iPad
					webApp: u.indexOf("Safari") === -1, // 是否web应该程序，没有头部与底部
					weixin: u.indexOf("MicroMessenger") > -1, // 是否微信 （2015-01-22新增）
					qq: u.indexOf("QQ") > -1, // 是否QQ
				}
			},
			//获取用户所在客户端
			get_user_client() {
				let userClient = '';
				// #ifdef H5
				var browser = this.browser();
				if (browser.weixin) {
					userClient = 'wechat'
				} else {
					userClient = 'h5'
				}
				// #endif
				// #ifdef APP-PLUS
				var systemInfo = uni.getSystemInfoSync();
				this.$u.vuex('vuex_systemInfo', systemInfo);
				if (systemInfo.platform === 'android') {
					userClient = 'app_android';
				} else if (systemInfo.platform === 'ios') {
					userClient = 'app_ios';
				}
				// #endif
				// #ifdef MP-WEIXIN
				userClient = 'mini_pro';
				// #endif
				// #ifdef MP-ALIPAY
				userClient = 'alipay';
				// #endif
				this.$u.vuex('vuex_client', userClient);
			},
			//获取应用设置
			getUniappSetting() {
				let that = this;
				api.getUniappSetting({}).then(res => {
					if (res.errcode == 0) {
						that.$u.vuex('vuex_uniappSet', res.data);
					}
				})
			},
			async asyncCheckIsOnline() {
				//console.log("检查在线状态 ")
				await this.checkIsOnline();
			},
			//检测是否在线状态
			checkIsOnline() {
				let that = this;
				var systemInfo = uni.getSystemInfoSync();
				return new Promise((resolve, reject) => {
					if (Store.state.vuex_user && Store.state.vuex_user.user_id > 0) {
						var params = {
							login_user_id: Store.state.vuex_user.user_id_en,
							app_version_code: that.$config.appVersion,
							login_client: Store.state.vuex_client,
							phone_mark: systemInfo.deviceId
						};
						var vuex_user = that.vuex_user;
						var login_token = vuex_user.login_token
						console.log("ppong参数 ", params)
						api.pongUserToken(params).then(res2 => {
							console.log("ppong结果 ", res2)
							if (res2.data) {
								vuex_user = res2.data.userinfo;
								vuex_user.login_token = login_token;
								that.$u.vuex('vuex_user', vuex_user);
							} else {
								console.log("ppong数据 空 ")
								//that.$u.vuex('vuex_user', that.$config.userDefault);
							}
							resolve(true);
						})
					} else {
						if (Store.state.vuex_client == 'wechat') {
							var headers = {};
							headers['Content-Type'] = 'application/x-www-form-urlencoded'
							headers['X-Requested-With'] = 'XMLHttpRequest'
							uni.request({
								url: that.$config.apiUrl +
									'/uniapp_template/web/index.php?m=app_user&a=wechat_user&xdebug=xdebug',
								header: headers,
								data: {},
								method: 'POST',
							}).then(res => {
								var result = res[1];
								if (result.data.errcode == 0) {
									that.$u.vuex('vuex_user', result.data.data.userinfo);
								}
								resolve(true);
							})
						}
					}
					resolve(false);
				});

			},
			//获取商家基本设置信息
			getCustomerBaseSet() {
				var that = this;
				api.getCustomerBaseSet({}).then(res => {
					var base_info = res.data;
					that.$u.vuex('vuex_base', base_info);
				})
			},
			//获取应用服务设置
			getAppServerSetting() {
				let that = this;
				api.getAppServerSetting({}).then(res => {
					that.globalData.TUICalling_set = res.TUICalling_set;
					if (res) {
						that.$u.vuex('vuex_appServerSet', res);
					}
				});
			},
			//检查版本更新
			updateApp() {
				let version = "";
				let that = this;
				plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
					let versionCode = wgtinfo.versionCode;
					api.updateApp({
						now_app_version_code: versionCode
					}).then(res => {
						//console.log(res)
						if (res.errcode == 0) {
							let apk_url = res.data.update_url; //下载链接
							if (res.data.type == 1) {
								if (res.data.user_client == 'ios') {
									uni.showModal({ //提醒用户更新
										title: "系统更新",
										content: `请前往应用市场下载最新版，以便获得更好的体验！`,
										success: (res) => {
											if (res.confirm) {} else {}
										}
									})
								} else {
									//整包更新
									uni.showModal({ //提醒用户更新
										title: "系统更新",
										content: `更新提醒：最新版本号${res.data.online_app_version}`,
										success: (res) => {
											if (res.confirm) {
												console.log("用户点击了确定整包更新");
												that.UpdateOfAll(apk_url)
											} else {
												// uni.$emit("noUpdate", {})
												console.log("用户点击了取消整包更新");
											}
										}
									})
								}
							} else if (res.data.type == 2) {
								//热更新
								that.UpdateOfWgt(apk_url)
							}
						}
					});
				});

			},

			//热更新
			UpdateOfWgt(apk_url) {
				uni.downloadFile({
					url: apk_url,
					success: (downloadResult) => {
						if (downloadResult.statusCode && downloadResult.statusCode === 200) {
							console.log("增量更新包下载成功，即将安装: " + JSON.stringify(downloadResult, null, 4));
							plus.runtime.install(downloadResult.tempFilePath, {
								force: false
							}, function() {
								console.log("增量更新成功,将重启app");
								plus.runtime.restart();
							}, function(e) {
								console.error('增量更新安装失败：' + JSON.stringify(e));
							});
						}
					}
				});
			},
			//整包更新
			UpdateOfAll(apk_url) {
				const downloadTask = uni.downloadFile({
					url: apk_url,
					success: (downloadResult) => {
						if (downloadResult.statusCode === 200) {
							console.log('安装包下载成功，即将安装：' + JSON.stringify(downloadResult, null, 4));
							plus.runtime.openFile(downloadResult.tempFilePath);
						}
					}
				});
				downloadTask.onProgressUpdate((res) => {
					uni.$emit("progress", res)
				});
				uni.$on("cancelUpdate", () => {
					console.log("用户点击了取消下载");
					downloadTask.abort();
				})
			},
			// 监听网络变化
			listenNetwork() {
				uni.onNetworkStatusChange(function(res) {
					console.log("当前是否有网络连接", res.isConnected);
					//console.log("网络类型",res.networkType);
					if (res.isConnected) {
						plus.runtime.restart();
						// uni.reLaunch({
						// 	url: '/pages/index/index'
						// });
						uni.offNetworkStatusChange(function(res2) {
							console.log("关闭网络变化监听");
						})
					}
				});
			},
			//如果是登录状态就保存PushClientId
			// getPushClientId() {
			// 	let push_clientid = ""
			// 	uni.getPushClientId({
			// 		success: (res) => {
			// 			push_clientid = res.cid
			// 			if (push_clientid != "") {
			// 				api.saveUserPushClientid({
			// 					push_clientid: push_clientid
			// 				}).then((res) => {
			// 					console.log(res)
			// 					if (res.errcode == 0) {
			// 						console.log('保存PushClientId成功');
			// 					}
			// 				})
			// 			}
			// 		},
			// 		fail(err) {
			// 			console.log(err)
			// 		}
			// 	})
			// }
		}
	}
</script>

<!-- #ifndef APP-PLUS-NVUE -->
<style>
	/*每个页面公共css */
	@import "./static/css/common.css";
	/* 皮肤css */
	@import "@/utils/skin.css";

</style>
<!-- #endif -->
