<!-- 首页 -->
<template>
	<view :style="'background-color:'+bgcolor">
		<scroll-view :scroll-top="scrollTop" @scroll="onScroll" scroll-y="true" :scroll-into-view="tab_link"
			style="height:calc(100vh - 50px);" @scrolltolower="scrollLower">
			<!-- 然后循环获取当前组件应该去哪个应用里面找 -->
			<block v-for="(item,index) in module_list">
				<view :id="'tab-'+item.diy_tem_contid">
					<baseIndex :datas="item" :indexs="index" :page_title="page_title" ref="baseIndex"
						@parent_method="handelParent"></baseIndex>
				</view>
				<tradeIndex :datas="item" :indexs="index" @parent_method="handelParent" ref="tradeIndex"></tradeIndex>
			</block>
		</scroll-view>
		<pagecom :datas="template_data" @toScrollTop="toScrollTop"></pagecom>
	</view>
</template>

<script>
	import baseIndex from '@/components/base/baseIndex.vue'
	import tradeIndex from '@/components/trade/tradeIndex.vue'
	import pagecom from '@/components/pagecom/pagecom.vue'

	export default {
		components: {
			baseIndex,
			tradeIndex,
			pagecom
		},
		onReachBottom() {
			uni.$emit('onReachBottom');
		},
		data() {
			return {
				module_list: '',
				bgcolor: '#FFF',
				template_data: {
					has_template_id: true
				},
				template_id: -1,
				uniappSet: {},
				tab_link: '', //获取标签页跳转组件id
				scrollTop: 0,
				oldscrollTop: 0,
				setMethod: null, //设置获取孙子组件的方法
			}
		},
		onReachBottom() {
			//监听页面滚动到底部，传输事件给子组件
			uni.$emit('onReachBottom');
		},
		onLoad(e) {
			if (e.template_id) {
				var template_id = e.template_id;
				this.template_id = template_id;
				//获取底部菜单数据
				// this.bottom = this.selectComponent("#com_bottom");
				// this.bottom.getBottomById(template_id);
				this.template_data = {
					has_template_id: true,
					template_id: template_id
				}

				//获取悬浮导航数据
				//this.bottom = this.selectComponent("#com_suspend");
				//this.bottom.getNavigationById(template_id);

				this.templateCombinationSelect(template_id)
			}
		},
		onShow() {
			this.asyncCheckIsOnline();
			//监听页面，传输事件给子组件
			uni.$emit('onShow');
		},
		methods: {
			toScrollTop() {
				this.scrollTop = this.oldscrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				if (this.setMethod) {
					this.setMethod();
				}
			},
			onScroll(e) {
				this.oldscrollTop = e.detail.scrollTop
			},
			scrollLower(ev) {
				uni.$emit('scrollLowerComp');
			},
			templateCombinationSelect(template_id) {
				var _this = this;
				var params = {
					template_id: template_id
				};
				this.$api.getTemplateSon(params).then(res => {
					if (res.errcode == 0) {
						var lists = res.data.lists
						//console.log(lists)
						uni.setStorageSync('module_content', res.data)
						uni.setNavigationBarTitle({
							title: res.data.title
						})
						_this.page_title = res.data.title
						_this.module_list = lists
						_this.bgcolor = res.data.bgcolor
						_this.$cache.set('currenct_module_list', lists)
					} else {
						console.log('首页自定义模板：', data.errmsg)
					}
				})
				//console.log(_this.module_list)
			},
			handelParent(e) {
				console.log(e);
				if (e.op == 'refresh') {
					var lists = e.lists;
					if (e.template_id > 0) {
						this.module_list = lists
					} else {
						this.templateCombinationSelect(this.template_id)
					}
				} else if (e.op == 'tabSel') {
					let tablink = "tab-" + e.tablink
					this.tab_link = tablink
				} else if (e == 'newSearch') {
					// 遍历 tradeIndex 数组，查找 $refs 包含 newShopLeagueStore 的组件
					const targetComponent = this.$refs.tradeIndex.find(comp => {
						return comp.$refs.newShopLeagueStore; // 判断 $refs 是否存在目标属性
					});

					if (targetComponent) {
						// 找到后调用组件方法（示例）
						// targetComponent.$refs.newShopLeagueStore.targetMethod();
						targetComponent.$refs.newShopLeagueStore.requestPermission()
					} else {
						console.log('未找到目标组件');
					}
				}
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
					if (that.vuex_user && that.vuex_user.user_id > 0) {
						var params = {
							login_user_id: that.vuex_user.user_id_en,
							app_version_code: that.$config.appVersion,
							login_client: that.vuex_client,
							phone_mark: systemInfo.deviceId
						};
						var vuex_user = that.vuex_user;
						var login_token = vuex_user.login_token
						console.log("ppong参数 ", params)
						that.$api.pongUserToken(params).then(res2 => {
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
						if (that.vuex_client == 'wechat') {
							var headers = {};
							headers['Content-Type'] = 'application/x-www-form-urlencoded'
							headers['X-Requested-With'] = 'XMLHttpRequest'
							uni.request({
								url: that.vuex_apiUrl +
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
		},
		// 监听页面滚动 
		onPageScroll: function(e) {
			var that = this;
			// 重点，用到滑动切换必须加上
			if (this.module_list[0].type == 'new_base2') {
				this.$refs.baseIndex[0].$refs.myNewSwiper.$refs.navbar.pageScroll(e);
			} else if (this.module_list[0].type == 'base2') {
				this.$refs.baseIndex[0].$refs.myswiper.$refs.navbar.pageScroll(e);
			} else if (this.module_list[0].type == 'base14') {
				this.$refs.baseIndex[0].$refs.lbs.$refs.navbar.pageScroll(e);
			} else if (this.module_list[0].type == 'base1') {
				this.$refs.baseIndex[0].$refs.search.$refs.navbar.pageScroll(e);
			}
		},
	}
</script>

<style>

</style>