<template>
	<!--新定位搜索start-->
	<view
		:style="'background-repeat: round;background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image:  '+( datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':(datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none' )) +';padding: '+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;'">
		<!--搜索-->
		<view class="search-box" style="padding:5px 0 10px 0">
			<view class="search-bar">
				<view v-if="datas.content.show_search" class="flex-def flex-cCenter flex-zCenter flex-one">
					<view class="city" v-if="datas.content.show_lbs" @click="gotoLBS">
						<view class="city-width"
							:style="'color:'+datas.content.location_color?datas.content.location_color:'#5d5d5d'">
							{{current_city?current_city:'北京市'}}
						</view>
						<view class="fa-angle-down"
							:style="'border-color: '+datas.content.location_icon_color?datas.content.location_icon_color:'#b2b2b2'">
						</view>
					</view>
					<view style="overflow:hidden;"
						:style="'border: '+(datas.content.border_style==2? datas.content.border_diy+'px solid'+datas.content.border_color:'none')+';border-radius:'+(datas.content.radius_style==1?40:((datas.content.border_diy<5||datas.content.radius_diy<datas.content.border_diy)?datas.content.radius_diy:datas.content.radius_diy+datas.content.border_diy))+'px;background-color:'+(datas.content.border_style==2?datas.content.border_color:'transparent')"
						class="search-bar__form">
						<view class="input-box flex-one flex-def flex-cCenter"
							:style="'min-height: 35px;height: initial;position: relative;background-color: '+(datas.content.module_bg_color?datas.content.module_bg_color:'#F1F2F6')+';justify-content:'+(datas.content.align_style==1?'center':'start')+';border-radius:'+(datas.content.radius_style==1?20:datas.content.radius_diy)+'px'"
							@click="bindsearch">
							<image class="margin-right-5" :src="search_icon_pic" alt="" mode="aspectFill"
								style="width:16px;height:16px;" />
							<view>
								{{datas.content.placeholder?datas.content.placeholder:'搜索'}}
							</view>
							<span
								:style="'background-repeat: round;position: absolute;top: 0;right: 0;padding: 0 19px;height:100%;background-color: '+(datas.content.button_select_bg_model==1?datas.content.button_bg_color:'transparent')+';background-image: '+(datas.content.button_select_bg_model==2? 'linear-gradient('+datas.content.button_gradient_angle+','+datas.content.button_gradient_color1+','+datas.content.button_gradient_color2+')':'none')+';color: '+(datas.content.button_color? datas.content.button_color:'#ffffff')+';border-radius: '+(datas.content.button_radius_style==1?40:datas.content.radius_diy)+'px;'">搜索</span>
						</view>
					</view>
				</view>

				<view style="height:24px;" v-if="datas.content.show_scan_code" class="padding-left-10"
					@click="scanCode">
					<view>
						<image :src="http_host+'/shop_league/web/static/images/icon_saoyisao.png'" alt=""
							mode="widthFix" style="width:24px;height:24px;" />
					</view>
				</view>
			</view>
		</view>

		<!--金刚区-->
		<view v-if="datas.content.show_navigation" style="padding:0 0 10px 0">
			<view class="custom-icon"
				:style="'background-repeat: round;background-color: '+(datas.content.card_select_bg_model==1?datas.content.card_bg_color:'transparent')+';background-image: '+ ( datas.content.card_select_bg_model==2? 'linear-gradient('+datas.content.card_gradient_angle+','+datas.content.card_gradient_color1+','+datas.content.card_gradient_color2+')':'none' ) +';border-radius: 8px;overflow: hidden;'">
				<view class="trade100365-navigation-title">{{datas.content.navigation_title}}</view>
				<!--平铺显示-->
				<block v-if="datas.content.css_type == 1||datas.content.css_type == 2&&datas.content.max_show_num == 1">
					<view class="subscribe-list-box">
						<block v-for="(item_list,index_list) in datas.content.dataset">
							<!-- 客服按钮start -->
							<block v-if="item_list.open_type == 'contact'&&item_list.sel_link_type!=2">
								<button v-if="item_list.link=='qy_weixin'" bind:tap="go_service" hover-class="no-hover"
									:style="'width: '+(1/(datas.content.css_type == 2&&datas.content.max_show_num == 1?5:datas.content.show_num)*100)+'%;font-size: 0;'">
									<view class="subscribe-list-sbox">
										<image class="subscribe-list-img" :src="item_list.pic" lazy-load></image>
										<text class="subscribe-list-text"
											:style="'color:'+item_list.color">{{item_list.title}}</text>
									</view>
								</button>
								<button v-else hover-class="no-hover" :open-type="item_list.open_type"
									:style="'width:'+(1/(datas.content.css_type == 2&&datas.content.max_show_num == 1?5:datas.content.show_num)*100)+'%;font-size: 0;'">
									<view class="subscribe-list-sbox">
										<image class="subscribe-list-img" :src="item_list.pic" lazy-load></image>
										<text class='subscribe-list-text'
											:style="'color:'+item_list.color">{{item_list.title}}</text>
									</view>
								</button>
							</block>
							<!-- 客服按钮end -->
							<block v-else>
								<navigator hover-class="no-hover"
									:url="item_list.sel_link_type==2||item_list.sel_link_type==3?'':item_list.link"
									:open-type="item_list.sel_link_type==2||item_list.sel_link_type==3?'':item_list.open_type"
									@click="item_list.sel_link_type==2?'open_mr':item_list.sel_link_type==3?'linkTo':''"
									:data-appid="item_list.diy_openid" :data-video_id="item_list.video_id"
									:data-video_feed_id="item_list.video_feed_id"
									:style="'width:'+(1/(datas.content.css_type == 2&&datas.content.max_show_num == 1?5:datas.content.show_num)*100)+'%;'">
									<view class="subscribe-list-sbox">
										<image class="subscribe-list-img" :src="item_list.pic" lazy-load></image>
										<text class='subscribe-list-text'
											:style="'color:'+item_list.color">{{item_list.title}}</text>
									</view>
								</navigator>
							</block>
						</block>
					</view>
				</block>
				<!--滑动显示-->
				<block v-if="datas.content.css_type == 2&&datas.content.max_show_num > 1 ">
					<view style="position: relative;">
						<swiper class="swiper" :style="'height: '+swiperheight+'px;'" :current="currentSwiper"
							bindchange="swiperChange">
							<block v-for="(item_list,index_list) in dataset_groups">
								<swiper-item class='subscribe-list-box2'>
									<block v-for="(item_lists,index_lists) in item_list">
										<!-- 客服按钮start -->
										<block v-if="item_lists.open_type == 'contact'&&item_lists.sel_link_type!=2">
											<button v-if="item_lists.link=='qy_weixin'" hover-class="no-hover"
												bind:tap="go_service" :style="'width:'+(1/5*100)+'%;font-size: 0;'">
												<view class="subscribe-list-sbox">
													<image class="subscribe-list-img" :src="item_lists.pic" lazy-load>
													</image>
													<text class='subscribe-list-text'
														:style="'color: '+item_lists.color">{{item_lists.title}}</text>
												</view>
											</button>
											<button v-else hover-class="no-hover" :open-type="item_lists.open_type"
												:style="'width:'+(1/5*100)+'%;font-size: 0;'">
												<view class="subscribe-list-sbox">
													<image class="subscribe-list-img" :src="item_lists.pic" lazy-load>
													</image>
													<text class='subscribe-list-text'
														:style="'color: '+item_lists.color">{{item_lists.title}}</text>
												</view>
											</button>
										</block>
										<!-- 客服按钮end -->
										<block v-else>
											<!-- 这两行代码是navigator的，这个跳转不了到外部 -->
											<!-- :url="(item_lists.sel_link_type==2||item_lists.sel_link_type==3?'':item_lists.link)" -->
											<!-- @click="item_lists.sel_link_type==2?'open_mr':item_lists.sel_link_type==3?'linkTo':''" -->
											<navigator hover-class="no-hover"
												@click="goUrl(item_lists.link)"
												:open-type="item_lists.sel_link_type==2||item_lists.sel_link_type==3?'':item_lists.open_type"
												:data-appid="item_lists.diy_openid" :data-video_id="item_lists.video_id"
												:data-video_feed_id="item_lists.video_feed_id"
												:style="'width:'+(1/5*100)+'%;'">
												<view class="subscribe-list-sbox">
													<image class="subscribe-list-img" :src="item_lists.pic" lazy-load>
													</image>
													<text class='subscribe-list-text'
														:style="'color: '+item_lists.color">{{item_lists.title}}</text>
												</view>
											</navigator>
										</block>
									</block>
								</swiper-item>
							</block>
						</swiper>
						<!--指示点-->
						<view class="dots" v-if="dataset_groups.length>1">
							<block v-for="(item_list,index_list) in dataset_groups">
								<view
									:style="'background: '+(index_list == currentSwiper ? datas.content.max_show_page_color:'')+';'"
									:class="'dot'+(index_list == currentSwiper ? ' active' : '')"></view>
							</block>
						</view>
						<!--指示点end-->
					</view>

				</block>
			</view>
		</view>

		<!--切换地区弹窗-->
		<view class="industry-main flex-def flex-cCenter flex-zCenter" v-if="city_pop">
			<view class="industry-shadow"></view>
			<view class="new_trade100365_city_pop">
				<view class="title">定位显示您在{{district?district:current_city}}</view>
				<view :class="'btn skin-bg-'+theme" @click="jump_trade100365_city_page">
					切换到{{district?district:current_city}}</view>
				<view class="btn nobtn" @click="close_trade100365_city_pop">继续浏览</view>
			</view>
		</view>
	</view>
	<!--新定位搜索end-->

</template>

<script>
	export default {
		name: "shopLeagueLbsSearch",
		props: {
			datas: {
				type: Object,
				defaviewt: {},
				content: {
					dataset: []
				},
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				swiperCurrent: 0, // 轮播图片下表
				swiperError: 0,
				height: '', // 轮播图片高度
				list: [],
				datasetlist: [],
				is_open: false,
				shop_league_obj: {
					key: '',
					item_arr: [],
					latitude: '',
					longitude: '',
					city: "",
					province: "",
					get_position_ing: false,
					industry_list: [],
					cache_position: '',
				},
				bg_img: '',
				search_icon_pic: '',
				icon_pic2: '',
				current_city: '',
				city_code: '',
				indicatorDots: true,
				currentSwiper: 0,
				city_pop: false,
				district: "",
				swiperheight:'',
				dataset_groups:[]
			};
		},
		created() {},
		mounted() {
			this.http_host = this.vuex_apiUrl;
			const self = this
			// 因为解析不到域名，进行图片处理
			let bg_img = this.datas.content.bg_img
			let search_icon_pic = this.datas.content.search_icon_pic
			let icon_pic2 = this.datas.content.icon_pic2
			var reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/);
			self.bg_img = bg_img;
			self.search_icon_pic = search_icon_pic;
			self.icon_pic2 = icon_pic2;
			if (!reg.test(bg_img)) {
				let img = self.http_host + '/' + bg_img;
				self.bg_img = img;
			}
			if (!reg.test(search_icon_pic)) {
				let img = self.http_host + '/' + search_icon_pic;
				self.search_icon_pic = img;
			}
			if (!reg.test(icon_pic2)) {
				let img = self.http_host + '/' + icon_pic2;
				self.icon_pic2 = img;
			}
			getApp().globalData.has_lbs = true;//是否显示定位组件
			// .globalData.has_lbs = true; 
			// self.get_location()
			self.update_location();
			let dataset = self.datas.content.dataset;
			let max_show_num = self.datas.content.max_show_num;
			if (self.datas.content.css_type == 2) {
				let dataset_groups = self.splitArrayIntoGroups(dataset, max_show_num, 5); //修改金刚区数据摆列方法
				// console.log(dataset_groups)
				self.dataset_groups = dataset_groups
				let rows = Math.ceil(self.dataset_groups[0].length / 5) //算swiper每页多少行
				let height = (82 * rows) + 16 //计算swiper高度
				self.swiperheight = height
			}
			dataset.forEach((item, index) => {
				if (item.open_type == "contact" && item.link == "qy_weixin") {
					self.get_link();
					return;
				}
			})
		},
		methods: {
			//跳到lbs
			gotoLBS: function() {
				var pages = getCurrentPages();
				let currentPage = pages[pages.length-1]['$page']['fullPath'] //当前页面路径(带参数)
				if(currentPage.charAt(0) != "/"){
					currentPage = "/" + currentPage;
				}
				uni.setStorageSync('lbsHistoryPage', currentPage)
				uni.navigateTo({
					url: '/public/pages/lbs/lbs',
				})
			},
			// 搜索页
			bindsearch: function() {
				const that = this;
				let hot_search = []
				let hot_search_title = ""
				if (that.datas.content.data_count) {
					hot_search_title = that.datas.content.title
					hot_search = JSON.stringify(that.datas.content.dataset2)
				}
				this.$common.diyLinkJump('/shop_league/web/index.php?m=search&a=history&city_code=' +
					that.city_code + '&hot_search=' + hot_search + 'hot_search_title=' + hot_search_title);
					
				// this.$common.diyLinkJump('/shop_league/pages/lbs_search/history_search/history_search?city_code=' +
				// 	that.city_code + '&hot_search=' + hot_search + 'hot_search_title=' + hot_search_title);
				
				// wx.navigateTo({
				// 	url: '/shop_league/pages/lbs_search/history_search/history_search?city_code=' + that.data
				// 		.city_code + "&hot_search=" + hot_search + "&hot_search_title=" + hot_search_title,
				// })
			},
			update_location() {
				var that = this;
				var current_city = uni.getStorageSync('current_city') || [];
				if (current_city.length > 0) {
					that.current_city = JSON.parse(current_city).area_name;
					that.city_code = JSON.parse(current_city).area_code
				} else {
					that.current_city = that.datas.content.city;
					that.city_code = that.datas.content.city_code
				}
				// console.log(2)
				that.get_new_trade100365_location()
			},
			//获取是否开启城市管理功能
			get_new_trade100365_location() {
				const that = this
				if (that.datas.content.show_lbs) { //判断是否开启定位
					that.get_location()
				}
			},
			//获取省市查找是否有独立的装修页面
			get_new_trade100365_city_manage_page(datalist) {
				const that = this
				var _data = {};
				that.$common.requestData({
					url: '/shop_league/web/index.php?m=component&a=get_city_manage_page',
					data: {
						datalist
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						that.district = res.data.manager_address_name
						that.jumpcity = res.data.mini_url
						let cityhistory = '';
						if (uni.getStorageSync('shop_league_new_trade100365_city')) {
							cityhistory = JSON.parse(uni.getStorageSync('shop_league_new_trade100365_city'))
						}
						if (that.datas.content.son_page == 1) {
							if (cityhistory) { //城市管理页面判断改地址了才弹窗切换地址页面，否则默认不弹切换地址弹窗
								if (that.current_city != cityhistory.city && that.city_code !=
									cityhistory.city_code && that.district != cityhistory
									.manager_address_name) {
									// that.data.data.content.city_pop=true
									// that.setData({
									//   city_pop: that.data.data.content.city_pop
									// })
									that.city_pop = false
									uni.redirectTo({
										url: that.jumpcity
									});
								}
							}
						} else { //平台页面组件默认弹窗
							if (cityhistory) { //城市管理页面判断改地址了才弹窗切换地址页面，否则默认不弹切换地址弹窗
								if (that.current_city != cityhistory.city && that.city_code !=
									cityhistory.city_code && that.district != cityhistory
									.manager_address_name) {
									// that.data.data.content.city_pop=true
									// that.setData({
									//   city_pop: that.data.data.content.city_pop
									// })
									that.city_pop = false
									uni.redirectTo({
										url: that.jumpcity
									});
								} else {
									that.datas.content.city_pop = true
									that.city_pop = that.datas.content.city_pop
								}
							} else {
								that.datas.content.city_pop = true
								that.city_pop = that.datas.content.city_pop
							}
							let citylist = {
								city: that.current_city,
								city_code: that.city_code,
								manager_address_name: res.data.manager_address_name ? res.data
									.manager_address_name : ""
							}
							uni.setStorageSync('shop_league_new_trade100365_city', JSON.stringify(citylist));
							uni.removeStorageSync('city_manage_switch_city');
						}
					} else {
						that.datas.content.city_pop = false
						that.city_pop = that.datas.content.city_pop
						let citylist = {
							city: that.current_city,
							city_code: that.city_code,
							manager_address_name: res.data ? res.data.manager_address_name : ""
						}
						uni.setStorageSync('shop_league_new_trade100365_city', JSON.stringify(citylist));
						uni.removeStorageSync('city_manage_switch_city');
					}
				});
			},
			//关闭定位弹窗
			close_trade100365_city_pop() {
				const that = this
				that.city_pop = false;
			},
			//跳转到城市管理页面
			jump_trade100365_city_page() {
				const that = this
				that.city_pop = false;
				uni.redirectTo({
					url: that.jumpcity
				});
			},
			//获取定位城市
			// get_location: function() {
			// 	var that = this;
			// 	uni.getLocation({
			// 		type: 'wgs84',
			// 		success: function(res) {
			// 			var latitude = res.latitude
			// 			var longitude = res.longitude
			// 			var position = {
			// 				lat: latitude,
			// 				lng: longitude
			// 			}
			// 			uni.setStorageSync('shop_league_position', position)
			// 			that.shop_league_obj.latitude = latitude;
			// 			that.shop_league_obj.longitude = longitude;
			// 			that.shop_league_obj.cache_position = position;
			// 			that.shop_league_get_list();
			// 		},
			// 		fail: function(res) {
			// 			console.log('get_location_fail', res)
			// 			that.shop_league_get_list();
			// 		},
			// 	})
			// },
			//获取定位城市
			get_location: function() {
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						var latitude = res.latitude
						var longitude = res.longitude
						var _data = {};
						var request_data = {};
						request_data = {
							type: 'mini_program',
							lat: latitude,
							lng: longitude
						}
						that.$common.requestData({
							url: '/wsy_pub/web/index.php?m=lbs&a=get_location',
							data: request_data,
							method: 'POST',
							needToken: true
						}).then(res => {
							if (res.errcode == 0) {
								let datalist = {}
								let isswitch_city = uni.getStorageSync('city_manage_switch_city')
								if (that.datas.content.son_page != 1 && isswitch_city == '') {
									var city = {};
									city.area_code = res.result.area_code;
									city.area_name = res.result.city;
									uni.setStorageSync('current_city', JSON.stringify(city));
									that.current_city = res.result.city;
									that.city_code = res.result.area_code;
									datalist = {
										city_code: res.result.area_code,
										area_name: res.result.district,
										street_name: res.result.town
									}
									// console.log("datalist",datalist)
									that.get_new_trade100365_city_manage_page(datalist)
									return;
								}
								if (uni.getStorageSync('history_city')) {
									datalist = {
										city_code: that.city_code
									}
									that.get_new_trade100365_city_manage_page(datalist)
								} else {
									datalist = {
										city_code: that.city_code,
										area_name: res.result.district,
										street_name: res.result.town
									}
									// console.log("datalist",datalist)
									that.get_new_trade100365_city_manage_page(datalist)
								}

							}
						})
					}
				})
			},
			goUrl(url){
				this.$common.diyLinkJump(url); 
			},
			// 跳转视频号
			linkTo: function(e) {
				const that = this;
				wx.openChannelsActivity({
					finderUserName: e.currentTarget.dataset.video_id,
					feedId: e.currentTarget.dataset.video_feed_id,
					success: function() {
						console.log("成功！")
					},
					fail: function() {
						console.log("失败！")
					}
				})
			},
			// 打开另一个小程序
			open_mr: function(e) {
				wx.navigateToMiniProgram({
					appId: e.currentTarget.dataset.appid,
					path: '',
					extraData: {
						foo: 'bar'
					},
					success: function(res) {
						console.log('跳转成功')
					},
					fail: function(res) {
						console.log('跳转失败', res);
					}
				})
			},
			showIcon: function() {
				var that = this
				that.allShow = !that.allShow
			},
			// 获取客服链接
			get_link: function() {
				const that = this;
				util.requestData({
					url: '/wsy_pub/web/index.php?m=mini_program&a=get_service_page',
					data: {
						type: "qy_weixin"
					},
					method: 'POST',
					success: function(res) {
						if (res.errcode == 0) {
							var url = decodeURIComponent(res.url)
							that.setData({
								service_url: url,
								service_id: res.corpid,
							})
						}
					}
				})
			},
			// 跳转企业微信客服
			go_service() {
				const that = this;
				wx.openCustomerServiceChat({
					extInfo: {
						url: that.data.service_url
					},
					corpId: that.data.service_id,
					success(res) {},
					complete(res) {
						console.log("企业微信客服")
						console.log(res)
					}
				})
			},
			swiperChange: function(e) {
				that.currentSwiper = e.detail.current;
			},
			// 修改金刚区数据摆列方法   将dataset数组改成多组的格式显示 ，如： dataset_groups:[ [{图标1},{图标2},...,{图标5}] , [{图标6}] ]
			splitArrayIntoGroups(array, maxGroupCount, minGroupSize) { //传入数组，最大页数，每页每行最小（传5，每行5个）
				const totalItems = array.length;
				const groups = []; // 存储分组结果的数组
				let currentIndex = 0; // 当前处理的数组索引
				let groupSize = Math.ceil(totalItems / maxGroupCount); // 每组至少应有的元素数

				// 确保组大小至少为5的倍数
				groupSize = Math.max(groupSize, minGroupSize);
				groupSize = Math.ceil(groupSize / minGroupSize) * minGroupSize; // 确保是每行显示的数量的倍数，排列齐了才能把多的数据放到下一页

				// 循环分配数组对象到各个组
				for (let i = 0; i < maxGroupCount && currentIndex < totalItems; i++) {
					// 计算当前组的结束索引
					const endIndex = Math.min(currentIndex + groupSize, totalItems);

					// 提取当前组的数组对象
					const group = array.slice(currentIndex, endIndex);
					groups.push(group);

					// 更新当前索引为下一组的开始位置
					currentIndex = endIndex;
				}

				// 如果还有剩余的对象，将它们放入最后一组
				if (currentIndex < totalItems) {
					groups.push(array.slice(currentIndex));
				}

				return groups;
			},
			//扫码
			scanCode() {

				let that = this;
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function(res) {
						console.log(res)
						// if (res.path) {
						// 	wx.navigateTo({
						// 		url: "/" + res.path
						// 	})
						// }
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						var result = res.result;
						if (res.scanType == 'QR_CODE') {
							// that.check_is_realname(res);
							// return;
							var check_ypt_url = result.indexOf(this.vuex_apiUrl);
							console.log('是否云平台链接：' + check_ypt_url);
							if (check_ypt_url >= 0) {
								//云平台链接
								var link = result + '&user_agent=third_program_h5&third_token=' + that
									.vuex_user.token;
								uni.setStorageSync("weburl", link)
								uni.navigateTo({
									url: "/pages/webview/webview"
								});
							} else {
								//普通链接
								if (result.indexOf("http://") === 0 || result.indexOf("https://") === 0) {
									uni.setStorageSync("weburl", result)
									uni.navigateTo({
										url: "/pages/webview/webview"
									});
								}
							}

						} else {
							uni.showToast({
								title: '暂不支持的内容',
								icon: "none",
							})
						}
					}
				});
			}
		},
		pageLifetimes: {
			show() {
				var that = this;
				app.globalData.has_lbs = true; //是否显示定位组件
				var current_city = uni.getStorageSync('current_city') || [];
				if (current_city.length > 0) {
					that.current_city = JSON.parse(current_city).area_name;
					that.city_code = JSON.parse(current_city).area_code;
				} else {
					that.current_city = that.datas.content.city;
					that.city_code = that.datas.content.city_code;
				}
				// console.log(1)
				that.update_location()
			}
		}
	}
</script>

<style>
	/* 定义 */
	.flex-def {
		display: -webkit-flex;
		display: flex;
	}

	/* 主轴居中 */
	.flex-zCenter {
		-webkit-justify-content: center;
		justify-content: center;
	}

	/* 主轴居中 */
	.flex-zAround {
		-webkit-justify-content: space-around;
		justify-content: space-around;
	}

	/* 主轴两端对齐 */
	.flex-zBetween {
		-webkit-justify-content: space-between;
		justify-content: space-between;
	}

	/* 主轴end对齐 */
	.flex-zEnd {
		-webkit-justify-content: flex-end;
		justify-content: flex-end;
	}

	/* 主轴start对齐 */
	.flex-zStart {
		-webkit-justify-content: start;
		justify-content: start;
	}

	/* 侧轴居中 */
	.flex-cCenter {
		-webkit-align-items: center;
		align-items: center;
	}

	/* 侧轴start对齐 */
	.flex-cStart {
		-webkit-align-items: start;
		align-items: start;
	}

	/* 侧轴底部对齐 */
	.flex-cEnd {
		-webkit-align-items: flex-end;
		align-items: flex-end;
	}

	/* 侧轴文本基线对齐 */
	.flex-cBaseline {
		-webkit-align-items: baseline;
		align-items: baseline;
	}

	/* 侧轴上下对齐并铺满 */
	.flex-cStretch {
		-webkit-align-items: stretch;
		align-items: stretch;
	}

	/* 主轴从上到下 */
	.flex-zTopBottom {
		-webkit-flex-direction: column;
		flex-direction: column;
	}

	/* 主轴从下到上 */
	.flex-zBottomTop {
		-webkit-flex-direction: column-reverse;
		flex-direction: column-reverse;
	}

	/* 主轴从左到右 */
	.flex-zLeftRight {
		-webkit-flex-direction: row;
		flex-direction: row;
	}

	/* 主轴从右到左 */
	.flex-zRightLeft {
		-webkit-flex-direction: row-reverse;
		flex-direction: row-reverse;
	}

	/* 是否允许子元素伸缩 */
	.flex-item {
		-webkit-flex-grow: 1;
		flex-grow: 1;
	}

	/*子元素换行*/
	.flex-wrap {
		-moz-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	/* 子元素的显示次序 */
	.flex-order {
		-webkit-order: 1;
		order: 1;
	}

	/*元素比例*/
	.flex-one {
		-webkit-flex: 1;
		flex: 1;
	}

	/* 搜索框 */
	.no-hover {
		background-color: transparent
	}

	.search-box {
		display: block;
		position: relative;
		z-index: 0;
		flex: 1;
	}

	.search-bar {
		position: relative;
		display: flex;
		box-sizing: border-box;
		font-weight: normal;
		background-color: transparent;
		align-items: center;
		justify-content: flex-end;
	}

	.padding-left-10 {
		padding-left: 10px;
	}

	.padding-right-10 {
		padding-right: 10px;
	}

	.flex-zRightLeft {
		-webkit-flex-direction: row-reverse;
		flex-direction: row-reverse;
	}

	.search-bar__text {
		display: inline-block;
		font-size: 28rpx;
		margin-left: 20rpx;
		color: #b5b5b5;
		vertical-align: middle;
		font-weight: normal;
	}

	.search-bar__form {
		position: relative;
		flex: 1;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.input-box {
		min-height: 35px;
		height: initial;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: start;
		font-size: 15px;
		color: #999;
		line-height: 35px;
		padding: 0 10px;
	}

	/* 定义 */

	.padding-0 {
		padding: 0px;
	}

	.padding-10 {
		padding: 10px;
	}

	.padding-vertical-5 {
		padding-top: 5px;
		padding-bottom: 5px;
	}

	.padding-horizontal-10 {
		padding-left: 10px;
		padding-right: 10px;
	}

	.margin-0 {
		margin: 0px;
	}

	.margin-right-5 {
		margin-right: 5px;
	}

	.inline-block {
		display: inline-block !important;
	}

	.text-center {
		text-align: center;
	}

	.text-nowrap {
		white-space: nowrap;
	}

	.font-weight-800 {
		font-weight: 800;
	}

	.city {
		position: relative;
		display: flex;
		align-items: center;
		margin-right: 10px;
		font-size: 15px;
	}

	.fa-angle-down {
		margin-left: 5px;
		width: 15rpx;
		height: 15rpx;
		border-top: 2rpx solid #b2b2b2;
		border-right: 2rpx solid #b2b2b2;
		transform: rotate(135deg);
	}

	/* 搜索 end */

	/* 金刚区 */
	.no-hover {
		background-color: transparent
	}

	.custom-icon {
		padding: 16px 0;
	}

	.custom-icon button {
		background: transparent;
		padding-left: 0;
		padding-right: 0;
		margin-left: 0;
		margin-right: 0;
		box-sizing: content-box;
		line-height: 1.7
	}

	.custom-icon button::after,
	.custom-suspend button::before {
		display: none
	}

	.custom-icon .switch-box {
		width: 100%;
		padding: 10px 0;
	}

	.custom-icon .all-switch.img {
		width: 15px;
		display: block;
		margin: 0 auto;
	}

	.custom-icon .icon90 {
		transform: rotate(180deg)
	}

	.subscribe-list-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;

	}

	.subscribe-list-box navigator,
	.subscribe-list-box button {
		text-align: center;
		min-width: 20%;
		height: 156rpx;
		vertical-align: middle;
		padding: 1px 0;
	}

	.list-flex {
		flex: 1;
	}

	.subscribe-list-box .subscribe-list-sbox .subscribe-list-text,
	.subscribe-list-box2 .subscribe-list-sbox .subscribe-list-text {
		font-size: 14px;
		color: #5d5d5d;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		line-height: 1.5
	}

	.subscribe-list-box .subscribe-list-sbox .subscribe-list-img,
	.subscribe-list-box2 .subscribe-list-sbox .subscribe-list-img {
		width: 88rpx;
		height: 88rpx;
		/* border-radius:50%; */
		overflow: hidden;
		display: block;
		margin: 5px auto;

	}

	.subscribe-list-box2 navigator,
	.subscribe-list-box2 button {
		width: 150rpx;
		/* height: 156rpx; */
		/* vertical-align: middle; */
		vertical-align: top;
		box-sizing: border-box;
		float: left;
		text-align: center;
		padding: 1px 0;

	}

	.switch-box-new {
		text-align: center;
		font-size: 0;
	}

	.switch-box-new .arrow-bottom {
		display: inline-block;
		width: 8px;
		height: 8px;
		border: 1px solid #B9B9B9;
		border-left: transparent;
		border-top: transparent;
		transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		/* IE 9 */
		-moz-transform: rotate(45deg);
		/* Firefox */
		-webkit-transform: rotate(45deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(45deg);
		/* Opera */
	}

	.switch-box-new .arrow-bottom.active {
		transform: rotate(225deg);
		-ms-transform: rotate(225deg);
		/* IE 9 */
		-moz-transform: rotate(225deg);
		/* Firefox */
		-webkit-transform: rotate(225deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(225deg);
		/* Opera */
	}

	/*隐藏滚动条*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.trade100365-navigation-title {
		padding: 0px 0 16px 13px;
		font-size: 16px;
		line-height: 1;
		font-weight: bold;
	}

	.dots {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dots .dot {
		width: 8rpx;
		height: 8rpx;
		border-radius: 8rpx;
		margin-right: 5rpx;
		background-color: #F2F2F2;
		opacity: 0.6;
	}

	.dots .active {
		width: 24rpx;
		height: 8rpx;
		border-radius: 4rpx;
		background-color: #fc4308;
	}

	/*定位弹窗*/
	.industry-main {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		font-size: 0;
		z-index: 1000;
	}

	.industry-shadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.new_trade100365_city_pop {
		font-size: 16px;
		background: white;
		z-index: 1;
		text-align: center;
		padding: 25px;
		border-radius: 12px;
	}

	.new_trade100365_city_pop .title {
		font-weight: bold;
		margin-bottom: 28px;
	}

	.new_trade100365_city_pop .btn {
		width: 234px;
		background: #cccccc;
		height: 36px;
		font-size: 16px;
		line-height: 36px;
		border-radius: 20px;
		margin-bottom: 16px;
		color: white;
	}

	.new_trade100365_city_pop .nobtn {
		background: white;
		border: 1px solid #F0F0F0;
		color: #999999;
	}

	.city .city-width {
		max-width: 3em;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>