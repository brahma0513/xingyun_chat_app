<template>
	<view>
		<view class="tab-top"></view>
		<view class="tabbar-view" v-if="is_show">
			<u-tabbar :value="value" @change="change" :fixed="true" :placeholder="false" :safeAreaInsetBottom="true"
				:border="false" :activeColor="activeColor" :inactiveColor="inactiveColor" :customStyle="tabStyle">
				<u-tabbar-item :text="item.name" v-for="(item,index) in bottom_list.content" :customStyle="tabItemStyle"
					@click="jump(item.url,index)">
					<image class="icon-image u-page__item__slot-icon" slot="active-icon" :src="item.selimgUrl"
						:activeColor="item.selcolor" :inactiveColor="item.nocolor"></image>
					<image class="icon-image u-page__item__slot-icon" slot="inactive-icon" :src="item.noimgUrl"
						:activeColor="item.selcolor" :inactiveColor="item.nocolor"></image>
				</u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	export default {
		name: "bottom",
		props: {
			has_template_id: {
				type: Boolean,
				default: false
			},
			tem_id: {
				type: String,
				default: '0'
			}
		},
		data() {
			return {
				value: 0,
				bottom_list: {},
				is_show: false,
				template_id: -1, //二级页面-模板ID

				//用户所在环境 在uniapp里还是打包成h5
				user_client: 'uniapp',
				activeColor: '#d81e06',
				inactiveColor: '#d81e06',
				tabStyle: {zIndex: 999,boxShadow: '1px 1px 10px #e3e3e3'},
				tabItemStyle: {},
				isTablet: false,
			};
		},
		created() {

			var _this = this;
			
			//判断是手机还是平板
			this.detectDeviceType();
			console.log("isTablet",this.isTablet)
			if(this.isTablet == true){
				this.tabStyle = {zIndex: 999,boxShadow: '1px 1px 10px #e3e3e3',height: '90px'};
				this.tabItemStyle = {height: '90px'};
			}
			
			this.checkUserClient();

			if (_this.has_template_id == true) {
				this.template_id = _this.tem_id
				this.getBottomById(_this.tem_id);
				return false;
			}

			if (this.$cache.get('bottom_list') == '') {
				if (this.user_client == "uniapp") {
					//APP底部菜单
					_this.templateBottomSelect();
				} else {
					//H5底部菜单
					_this.templateBottomSelectH5();
				}
			} else {
				var bottom_list = this.$cache.get('bottom_list')
				var page_url = _this.getPages();
				if (this.user_client == "uniapp") {
					var lists2 = _this.urlInButtom(bottom_list, page_url)
					var is_show = _this.urlShowButtom(bottom_list.release, page_url)
				} else {
					var lists2 = _this.urlInButtom(bottom_list, page_url)
					var is_show = _this.h5BottomShow(bottom_list.funs, page_url)
				}
				_this.bottom_list = lists2
				_this.is_show = is_show
				if (_this.bottom_list.content.length > 0) {
					_this.activeColor = _this.bottom_list.content[0].selcolor
					_this.inactiveColor = _this.bottom_list.content[0].nocolor
				}
				if (page_url == '/pages/webview/webview'||page_url == '/pages/webview_custom/webview_custom') {
					//存储webview是否使用底部菜单
					this.$u.vuex('vuex_webview_bottom', is_show);
				}
			}

		},
		methods: {
			change() {},
			checkUserClient() {
				var user_client = 'uniapp';
				//在APP环境
				if (this.vuex_client == 'app_android' || this.vuex_client == 'app_ios') {
					//APP 
					user_client = "uniapp";
				} else {
					//H5
					if (this.vuex_is_dev == true) {
						user_client = "h5";
					} else {
						user_client = "uniapp";
					}
				}
				this.user_client = user_client;
			},
			templateBottomSelect() {
				var _this = this;
				var page_url = _this.getPages();
				var params = {app_examine:_this.$config.appExamine};
				this.$api.getBottomDiyTemplate(params).then(data => {
					if (!data.content) {
						this.$cache.set('bottom_list', 'no_bottom')
						return;
					}
					var lists2 = _this.urlInButtom(data, page_url)
					var is_show = _this.urlShowButtom(data.release, page_url)

					_this.bottom_list = lists2
					_this.is_show = is_show
					if (page_url == '/pages/webview/webview'&&page_url == '/pages/webview_custom/webview_custom') {
						//存储webview是否使用底部菜单
						this.$u.vuex('vuex_webview_bottom', is_show);
					}
					this.$cache.set('bottom_list', lists2)
					if (_this.bottom_list.content.length > 0) {
						_this.activeColor = _this.bottom_list.content[0].selcolor
						_this.inactiveColor = _this.bottom_list.content[0].nocolor
					}
				})
			},

			//获取H5菜单
			templateBottomSelectH5() {
				var _this = this;

				var client = 'web_app_h5';
				if (this.vuex_client == 'wechat') {
					client = 'wechat';
				}

				var page_url = _this.getPages();
				var params = {};

				_this.$common.requestData({
					url: '/wsy_pub/web/index.php?m=system&a=get_bottom_info',
					data: {
						client: client
					},
					method: "POST",
					needToken: false,
				}).then(res => {
					if (!res.data.content) {
						this.$cache.set('bottom_list', 'no_bottom')
						return;
					}
					var lists2 = _this.urlInButtom(res.data, page_url)
					var is_show = _this.h5BottomShow(res.data.funs, page_url)

					_this.bottom_list = lists2
					_this.is_show = is_show
					this.$cache.set('bottom_list', lists2)
					if (_this.bottom_list.content.length > 0) {
						_this.activeColor = _this.bottom_list.content[0].selcolor
						_this.inactiveColor = _this.bottom_list.content[0].nocolor
					}
				})
			},

			/**
			 * 循环判断底部菜单是否包含当前url
			 */
			urlInButtom(buttom_data, page_url) {
				var _this = this;
				
				var is_auto_sel = false;	//是否自动适配到选中格子

				for (var i = 0; i < buttom_data.content.length; i++) {			  
					if (buttom_data.content[i].url == page_url || buttom_data.content[i].url.indexOf(page_url) != -1) {
						buttom_data.content[i].active = 1
						_this.value = i
						is_auto_sel = true;
						_this.$cache.set('sel_bottom_val', i, 800)
						break;
					} else {
						buttom_data.content[i].active = 0
					}
				}
				if(is_auto_sel == false){
					var sel_val = this.$cache.get('sel_bottom_val') //选中的菜单值
					if (!sel_val) {
						sel_val = 0;
					}
					
					for (var i = 0; i < buttom_data.content.length; i++) {
						if (i == sel_val) {
							buttom_data.content[i].active = 1
							_this.value = i
							_this.$cache.set('sel_bottom_val', i, 800)
							break;
						} else {
							buttom_data.content[i].active = 0
						}
					}
				}
									
				return buttom_data;
			},
			/**
			 * 循环判断底部菜单是否要在当前url显示
			 */
			urlShowButtom(release, page_url) {
				var status = false;
				var project = '';
				for (var i = 0; i < release.length; i++) {
					var fun = release[i].funs;
					var pro_fun = fun + '/';
					// 完整链接数据
					if (fun.indexOf('/') != -1 && page_url == fun) {
						status = true;
						break;
					}
					// 平台页面
					else if (page_url.indexOf('pages') == 1 || page_url.indexOf('public') == 0) {
						if (page_url.indexOf(fun) != -1) {
							status = true;
							break;
						}
					}
					// 应用页面
					else if (page_url.indexOf(pro_fun) == 1) {
						project = pro_fun;
						continue;
					}
					// 应用页面,已经匹配到项目名称
					else if (project != '' && page_url.indexOf(project) == 1) {
						//fun为多个，逗号分隔
						if (fun.includes(',')) {
							var tmp = fun.split(',');
							for (var v of tmp) {
								if (page_url.includes(v)) {
									status = true;
									break;
								}
							}
							break;
						}
						//单个
						else if (page_url.indexOf(fun) != -1) {
							status = true;
							break;
						}
					}
				}
				return status;
			},

			/**
			 * 判断h5链接是否打开bottom
			 * @param {Object} funs 底部菜单配置
			 * @param {Object} page_url 当前链接
			 */
			h5BottomShow(funs, page_url) {
				var status = false;
				if (funs) {
					for (var i = 0; i < funs.length; i++) {
						if (funs[i].indexOf(page_url) >= 0) {
							status = true;
							break;
						}
					}
				}
				return status;
			},

			getPages() {
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].route // 获取当前页面路由，也就是最后一个打开的页面路由
				if (curRoute.indexOf('pages') == 0) {
					curRoute = "/" + curRoute;
				}
				return curRoute;
			},

			//二级页面-根据模板ID获取底部菜单
			getBottomById: function(template_id) {
				const _this = this;
				// 获取当前页面url
				var page_url = _this.getPages();
				if (this.$cache.get('bottom_list_' + template_id)) {
					var bottom_list = this.$cache.get('bottom_list_' + template_id)
					var lists2 = _this.urlInButtom(bottom_list, page_url + "?template_id=" + template_id)

					_this.bottom_list = lists2
					_this.is_show = true

					if (_this.bottom_list.content.length > 0) {
						_this.activeColor = _this.bottom_list.content[0].selcolor
						_this.inactiveColor = _this.bottom_list.content[0].nocolor
					}
					return
				}
				var params = {
					template_id: template_id
				}
				_this.$api.getBottomSon(params).then(data => {
					if (data.errcode == 0) {
						//循环判断底部菜单是否包含当前url
						var lists2 = _this.urlInButtom(data.data, page_url + "?template_id=" + template_id)
						if (lists2.type) {
							this.$cache.set('bottom_list_' + template_id, lists2)
							_this.bottom_list = lists2;
							_this.is_show = true;

							if (_this.bottom_list.content.length > 0) {
								_this.activeColor = _this.bottom_list.content[0].selcolor
								_this.inactiveColor = _this.bottom_list.content[0].nocolor
							}
						}
					}
				})
			},

			jump: function(link, index) {
				//记录当前选中的菜单
				this.$cache.set('sel_bottom_val', index, 800)
				if (this.user_client == "uniapp") { 
					// if((link.indexOf('m=') != -1 && link.indexOf('a=') != -1) || link.indexOf('http') == 0){
					// 	this.$common.diyLinkJump(link,'',true,1)
					// }else{
					// 	this.$common.diyLinkJump(link,'',true,2)
					// }	
					this.$common.diyLinkJump(link, '', true, 2,1)
				} else {
					window.location.href = this.vuex_apiUrl + link;
				}
			},
			
			//判断是否平板
			detectDeviceType(){
				let systemInfo = this.vuex_systemInfo;
				let screenWidth = systemInfo.screenWidth;
				let screenHeight = systemInfo.screenHeight;
				// screenWidth = 414
				// screenHeight = 896
				if(screenWidth>480 && screenWidth/screenHeight<0.75){
					this.isTablet = true;
					console.log("平板",this.isTablet)
				}
			},

		}
	}
</script>

<style>
	.tab-top {
		width: 100%;
		height: 110rpx !important;
	}
	.u-tabbar__content{
		box-shadow: 1px 1px 10px #e3e3e3;
	}
	.icon-image {
		width: 50rpx !important;
		height: 50rpx !important;
	}

</style>
