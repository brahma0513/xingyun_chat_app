<template>
	<view :style="'padding:'+datas.content.padding+'px 0px '+datas.content.padding_bottom+'px;'">
		<view class="page-tab-main" v-if="datas.content.css_type == 1">
			<view class="page-tab-list flex-def flex-zAround flex-cCenter">
				<view
					:class="'list flex-def flex-cCenter flex-zCenter '+(datas.content.show_industry_main?'avice skin-color-'+theme:'')"
					@click="league_toggleIndustry">
					{{datas.content.industry_name}}<span class="arrow">
						<image class="arrow_img" :src="http_host+'/shop_league/web/static/images/xia_jiantou.png'" />
					</span>
				</view>
				<view :class="'list '+(datas.content.tab_sales?'skin-color-'+theme:'')" @click="league_salesFun">
					销量最高
				</view>
				<view :class="'list '+(datas.content.tab_distance?'skin-color-'+theme:'')" @click="league_distanceFun">
					距离最近
				</view>
				<view :class="'list '+(datas.content.tab_haoping?'skin-color-'+theme:'')" @click="league_haopingFun">
					好评最多
				</view>
			</view>
			<!-- 头部分类弹窗 -->
			<view class="industry-main" v-if="datas.content.show_industry_main">
				<view class="industry-shadow" @click="league_hideIndustry"></view>
				<view class="industry-content">
					<view class="list flex-def flex-zBetween flex-cCenter"
						v-for="(itm,index) in datas.content.industry_list" :data-id="itm.id" :data-name="itm.name"
						@click="league_industryFun" data-item="itm">
						<span
							:class="'name '+(itm.id == datas.content.industry_type_1?'skin-color-'+theme:'')">{{itm.name}}</span>
						<span :class="'check-btn skin-bg-'+theme" v-if="itm.id == datas.content.industry_type_1">
							<image :src="http_host+'/shop_league/web/static/images/icon_check.png'" mode="widthFix" />
						</span>
					</view>
				</view>
			</view>
			<view class="industry-main child" v-if="datas.content.show_industry_child">
				<view class="industry-shadow" @click="league_hideIndustry"></view>
				<view class="industry-content">
					<view class="list flex-def flex-zBetween flex-cCenter"
						v-for="(itm,idx) in datas.content.industry_list_child" :data-id="itm.id" :data-name="itm.name"
						@click="league_industryFun" data-item="itm">
						<span
							:class="'name '+(itm.id == datas.content.industry_type?'skin-color-'+theme:'')">{{itm.name}}</span>
						<span :class="'check-btn skin-bg-'+theme" v-if="itm.id == datas.content.industry_type">
							<image :src="http_host+'/shop_league/web/static/images/icon_check.png'" mode="widthFix" />
						</span>
					</view>
				</view>
			</view>
		</view>
		<view class="mescroll-main" :style="'padding: 0px '+datas.content.padding_horizontal+'px;'">
			<view class="mescroll-shop-list clearfloat">
				<view class="shop-list-new WaterfallsLeft">
					<view style="margin-bottom:10px" v-for="(itm,idx) in datas.content.dataset_default"
						v-if="(datas.content.dataset.length == 0 || datas.content.add_type == 2)&&idx % 2 == 0"
						@click="goUrl" data-itm="itm">
						<view class="img-box" :style="'background-image: url('+itm.pic+');'">
							<view class="state flex-def flex-cStretch" v-if="datas.content.commodity_type == 2">
								<view class="type">拼团</view>
								<view class="num">{{itm.group}}人团</view>
							</view>
						</view>
						<view class="text-box">
							<view class="discount"
								v-if="datas.content.commodity_type == 1&&itm.plat_discount_type == 1&&itm.discountA<10">
								{{itm.discountA}}{{itm.discountB}}折</view>
							<view class="discount"
								v-if="datas.content.commodity_type == 1&&itm.plat_discount_type == 2&&itm.discountA<10">
								{{itm.discountA}}{{itm.discountB}}折</view>
							<view class="name" :style="'height:'+(datas.content.list_css_type==2?'auto':'39px')">
								{{itm.name}}</view>
							<view class="store flex-def flex-cCenter flex-zBetween">
								<view class="store-name flex-def flex-cCenter">
									<image :src="http_host+'/shop_league/web/static/images/shop_icon.png'" alt="" />
									<view class="text">{{itm.store_name}}</view>
								</view>
								<view class="store-distance">{{itm.distance}}</view>
							</view>
							<view class="price flex-def flex-cCenter">
								<view class="now-price">¥{{itm.priceA}}<span>{{itm.priceB}}</span></view>
								<view class="original_price" v-if="datas.content.commodity_type == 1">
									¥{{itm.original_price}}</view>
								<view class="sold" v-if="datas.content.commodity_type == 2">已拼{{itm.sold}}份</view>
							</view>
							<view :class="'flex-def flex-cCenter' +datas.content.integral?'flex-zBetween':''">
								<view class="num flex-def flex-cCenter integral-box"
									v-if="datas.content.integral&&itm.give_integral>0">
									<view class="integral-box-left flex-def flex-cCenter flex-zCenter">
										{{itm.integral_name?itm.integral_name:'积分'}}</view>
									<view class="integral-box-right flex-def flex-cCenter flex-zCenter">
										{{itm.give_integral?itm.give_integral:'0.00'}}</view>
								</view>
								<view class="num" v-if="datas.content.commodity_type == 1">已售{{itm.sold}}</view>
							</view>
						</view>
					</view>
					<view style="margin-bottom:10px" v-for="(itm,idx) in datas.content.dataset"
						v-if="(datas.content.dataset.length > 0 && datas.content.add_type == 1)&&idx % 2 == 0"
						@click="goUrl" data-itm="itm">
						<view class="img-box" :style="'background-image: url('+itm.pic+');'">
							<view class="state flex-def flex-cStretch" v-if="datas.content.commodity_type == 2">
								<view class="type">拼团</view>
								<view class="num">{{itm.group}}人团</view>
							</view>
						</view>
						<view class="text-box">
							<view class="discount"
								v-if="datas.content.commodity_type == 1&&itm.plat_discount_type == 1&&itm.discountA<10">
								{{itm.discountA}}{{itm.discountB}}折</view>
							<view class="discount"
								v-if="datas.content.commodity_type == 1&&itm.plat_discount_type == 2&&itm.discountA<10">
								{{itm.discountA}}{{itm.discountB}}折</view>
							<view class="name" :style="'height:'+(datas.content.list_css_type==2?'auto':'39px')">
								{{itm.name}}</view>
							<view class="store flex-def flex-cCenter flex-zBetween">
								<view class="store-name flex-def flex-cCenter">
									<image :src="http_host+'/shop_league/web/static/images/shop_icon.png'" alt="" />
									<view class="text">{{itm.store_name}}</view>
								</view>
								<view class="store-distance">{{itm.distance}}</view>
							</view>
							<view class="price flex-def flex-cCenter">
								<view class="now-price">¥{{itm.priceA}}<span>{{itm.priceB}}</span></view>
								<view class="original_price" v-if="datas.content.commodity_type == 1">
									¥{{itm.original_price}}</view>
								<view class="sold" v-if="datas.content.commodity_type == 2">已拼{{itm.sold}}份</view>
							</view>
							<view :class="'flex-def flex-cCenter '+datas.content.integral?'flex-zBetween':''">
								<view class="num flex-def flex-cCenter integral-box"
									v-if="datas.content.integral&&itm.give_integral>0">
									<view class="integral-box-left flex-def flex-cCenter flex-zCenter">
										{{itm.integral_name?itm.integral_name:'积分'}}</view>
									<view class="integral-box-right flex-def flex-cCenter flex-zCenter">
										{{itm.give_integral?itm.give_integral:'0.00'}}</view>
								</view>
								<view class="num" v-if="datas.content.commodity_type == 1">已售{{itm.sold}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="shop-list-new WaterfallsRight">
					<view style="margin-bottom:10px" v-for="(itm,idx) in datas.content.dataset_default"
						v-if="(datas.content.dataset.length == 0 || datas.content.add_type == 2)&&idx % 2 != 0"
						@click="goUrl" data-itm="itm">
						<view class="img-box" :style="'background-image: url('+itm.pic+');'">
							<view class="state flex-def flex-cStretch" v-if="datas.content.commodity_type == 2">
								<view class="type">拼团</view>
								<view class="num">{{itm.group}}人团</view>
							</view>
						</view>
						<view class="text-box">
							<view class="discount"
								v-if="datas.content.commodity_type == 1&&itm.plat_discount_type == 1&&itm.discountA<10">
								{{itm.discountA}}{{itm.discountB}}折</view>
							<view class="discount"
								v-if="datas.content.commodity_type == 1&&itm.plat_discount_type == 2&&itm.discountA<10">
								{{itm.discountA}}{{itm.discountB}}折</view>
							<view class="name" :style="'height:'+(datas.content.list_css_type==2?'auto':'39px')">
								{{itm.name}}</view>
							<view class="store flex-def flex-cCenter flex-zBetween">
								<view class="store-name flex-def flex-cCenter">
									<image :src="http_host+'/shop_league/web/static/images/shop_icon.png'" alt="" />
									<view class="text">{{itm.store_name}}</view>
								</view>
								<view class="store-distance">{{itm.distance}}</view>
							</view>
							<view class="price flex-def flex-cCenter">
								<view class="now-price">¥{{itm.priceA}}<span>{{itm.priceB}}</span></view>
								<view class="original_price" v-if="datas.content.commodity_type == 1">
									¥{{itm.original_price}}</view>
								<view class="sold" v-if="datas.content.commodity_type == 2">已拼{{itm.sold}}份</view>
							</view>
							<view :class="'flex-def flex-cCenter '+datas.content.integral?'flex-zBetween':''">
								<view class="num flex-def flex-cCenter integral-box"
									v-if="datas.content.integral&&itm.give_integral>0">
									<view class="integral-box-left flex-def flex-cCenter flex-zCenter">
										{{itm.integral_name?itm.integral_name:'积分'}}</view>
									<view class="integral-box-right flex-def flex-cCenter flex-zCenter">
										{{itm.give_integral?itm.give_integral:'0.00'}}</view>
								</view>
								<view class="num" v-if="datas.content.commodity_type == 1">已售{{itm.sold}}</view>
							</view>
						</view>
					</view>
					<view style="margin-bottom:10px" v-for="(itm,idx) in datas.content.dataset"
						v-if="(datas.content.dataset.length > 0 && datas.content.add_type == 1)&&idx % 2 != 0"
						@click="goUrl" data-itm="itm">
						<view class="img-box" :style="'background-image: url('+itm.pic+');'">
							<view class="state flex-def flex-cStretch" v-if="datas.content.commodity_type == 2">
								<view class="type">拼团</view>
								<view class="num">{{itm.group}}人团</view>
							</view>
						</view>
						<view class="text-box">
							<view class="discount"
								v-if="datas.content.commodity_type == 1&&itm.plat_discount_type == 1&&itm.discountA<10">
								{{itm.discountA}}{{itm.discountB}}折</view>
							<view class="discount"
								v-if="datas.content.commodity_type == 1&&itm.plat_discount_type == 2&&itm.discountA<10">
								{{itm.discountA}}{{itm.discountB}}折</view>
							<view class="name" :style="'height:'+(datas.content.list_css_type==2?'auto':'39px')">
								{{itm.name}}</view>
							<view class="store flex-def flex-cCenter flex-zBetween">
								<view class="store-name flex-def flex-cCenter">
									<image :src="http_host+'/shop_league/web/static/images/shop_icon.png'" alt="" />
									<view class="text">{{itm.store_name}}</view>
								</view>
								<view class="store-distance">{{itm.distance}}</view>
							</view>
							<view class="price flex-def flex-cCenter">
								<view class="now-price">¥{{itm.priceA}}<span>{{itm.priceB}}</span></view>
								<view class="original_price" v-if="datas.content.commodity_type == 1">
									¥{{itm.original_price}}</view>
								<view class="sold" v-if="datas.content.commodity_type == 2">已拼{{itm.sold}}份</view>
							</view>
							<view :class="'flex-def flex-cCenter '+datas.content.integral?'flex-zBetween':''">
								<view class="num flex-def flex-cCenter integral-box"
									v-if="datas.content.integral&&itm.give_integral>0">
									<view class="integral-box-left flex-def flex-cCenter flex-zCenter">
										{{itm.integral_name?itm.integral_name:'积分'}}</view>
									<view class="integral-box-right flex-def flex-cCenter flex-zCenter">
										{{itm.give_integral?itm.give_integral:'0.00'}}</view>
								</view>
								<view class="num" v-if="datas.content.commodity_type == 1">已售{{itm.sold}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '../../../../../uni_modules/uview-ui/libs/config/config';
	export default {
		name: "fkshopLeagueProduct",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				http_host: this.vuex_apiUrl,
				theme: getApp().globalData.style_color,
				fkshop_league_obj: {
					key: '',
					item_arr: [],
					latitude: '',
					longitude: '',
					get_position_ing: false,
					industry_list: [],
					cache_position: '',
				}
			}
		},
		created() {
			var that = this;
			this.http_host = this.vuex_apiUrl;
			var position = uni.getStorageSync('fkshop_league_position')
			let datasetlist = that.datas.content.dataset
			that.datasetlist = datasetlist;
			if (position) {
				that.fkshop_league_obj.latitude = position.lat;
				that.fkshop_league_obj.longitude = position.lng;
				that.fkshop_league_obj.cache_position = position;
			}
			//位置更新后再获取数据
			setTimeout(function() {
				that.fkshop_league_getdata()
			}, 500)
		},
		methods: {
			//获取定位城市
			get_location: function() {
				var that = this;
				wx.getLocation({
					type: 'gcj02',
					isHighAccuracy: true, // 开启地图精准定位
					success: function(res) {
						var latitude = res.latitude
						var longitude = res.longitude
						var position = {
							lat: latitude,
							lng: longitude
						}
						uni.setStorageSync('fkshop_league_position', position)
						that.fkshop_league_obj.latitude = latitude;
						that.fkshop_league_obj.longitude = longitude;
						that.fkshop_league_obj.cache_position = position;
						that.fkshop_league_get_list();
					},
					fail: function(res) {
						console.log('get_location_fail', res)
						that.fkshop_league_get_list();
					},
				})
			},
			league_toggleIndustry: function() {
				/*显示分类弹窗*/
				var that = this
				if (that.datas.content.show_industry_main == false) {
					that.datas.content.show_industry_main = true;
				} else {
					that.datas.content.show_industry_main = false;
				}
			},
			league_hideIndustry: function() {
				/*隐藏分类弹窗*/
				var that = this
				that.datas.content.show_industry_main = false;
				that.datas.content.show_industry_child = false;
			},
			league_industryFun: function(e) {
				var that = this
				var id = e.currentTarget.dataset.id
				var name = e.currentTarget.dataset.name
				that.datas.content.industry_type = id;
				that.datas.content.industry_type_1 = id;
				that.datas.content.industry_name = name
				that.fkshop_league_get_list();
				that.league_hideIndustry();
			},
			league_salesFun: function() {
				/*销量筛选切换*/
				var that = this
				that.datas.content.tab_sales = !that.datas.content.tab_sales;
				that.datas.content.tab_distance = false;
				that.datas.content.tab_haoping = false;
				that.datas.content.pageNum = 1;
				that.fkshop_league_get_list();
			},
			league_distanceFun: function() {
				/*距离筛选切换*/
				var that = this
				that.datas.content.tab_sales = false;
				that.datas.content.tab_distance = !that.datas.content.tab_distance;
				that.datas.content.tab_haoping = false;
				that.datas.content.pageNum = 1;
				that.fkshop_league_get_list();

			},
			league_haopingFun: function() {
				/*好评切换*/
				var that = this
				that.datas.content.tab_sales = false;
				that.datas.content.tab_distance = false;
				that.datas.content.tab_haoping = !that.datas.content.tab_haoping;
				that.datas.content.pageNum = 1;
				that.fkshop_league_get_list();

			},
			// 获取数据
			fkshop_league_getdata: function() {
				var that = this
				console.log("进来了===", that.data);
				that.datas.content.dataset_default = []; // 清除默认店铺列表数据
				that.datas.content.dataset = [];
				//加载店铺列表
				if (that.fkshop_league_obj.cache_position) { //有缓存，使用缓存的定位加载数据
					console.log("有缓存，直接加载数据");
					that.fkshop_league_obj.latitude = that.fkshop_league_obj.cache_position.lat;
					that.fkshop_league_obj.longitude = that.fkshop_league_obj.cache_position.lng;
					that.fkshop_league_obj = that.fkshop_league_obj
				}
				that.get_location()
				that.fkshop_league_obj.item_arr = that.datas
				that.fkshop_league_obj = that.fkshop_league_obj;

				//加载分类列表
				if (that.fkshop_league_obj.industry_list && that.fkshop_league_obj.industry_list.length > 0) {
					that.datas.content.industry_list = [...that.datas.content.industry_list, ...(that
						.fkshop_league_type_list_format(res.data.list))];
				} else {
					var request_data = {
						status: 1,
						level: 1,
						page: -1,
					}
					that.$common.requestData({
						url: '/fkshop_league/web/index.php?m=store&a=ajax_store_type_list',
						data: request_data,
						method: 'POST',
					}).then(res => {
						if (res.errcode == 0) {
							that.fkshop_league_obj.industry_list = res.data.list
							that.datas.content.industry_list = [...that.datas.content.industry_list, ...(that
								.fkshop_league_type_list_format(res.data.list))];
						}
					})
				}
			},
			fkshop_league_type_list_format: function(list) {
				var that = this
				if (list == null || list == undefined || list.length <= 0) {
					return [];
				}
				var res = [];
				list.forEach(function(itm, ind) {
					var type = {
						id: itm.id,
						name: itm.type_name,
						level: itm.level,
						child: that.fkshop_league_type_list_format(itm.child),
					};
					res.push(type)
				})
				return res;
			},
			fkshop_league_get_list: function(type) {
				console.log('定位数据', uni.getStorageSync("lbs"))
				var has_lbs = uni.getStorageSync("lbs")
				var that = this
				if (has_lbs) {
					//开启lbs定位组件的话，只显示当前城市的门店
					console.log('当前城市', uni.getStorageSync('current_city'))
					if (uni.getStorageSync('current_city')) {
						var current_city = JSON.parse(uni.getStorageSync('current_city'))
					}
					if (!current_city) {
						//lbs定位未完成，500ms后重试
						setTimeout(function() {
							that.fkshop_league_get_list();
						}, 500)
						return false;
					} else {
						var city_code = current_city.area_code
					}
				} else {
					var city_code = '';
				}
				var id = "";
				// let fkshop_league_new_getdata_id=wx.getStorageSync("fkshop_league_new_getdata_id"+that.data.data.diy_tem_contid)||[]
				if (that.datas.content.add_type == 1) {
					that.datasetlist.forEach(function(itm, ind) {
						if (id == '') {
							id = itm.id;
						} else {
							id += ',' + itm.id;
						}
					})
				}
				if (type == 1) {
					id = ""
				}
				let store_type_id = that.datas.content.industry_type_1

				if (that.datas.content.shop_add_type == 2) {
					id = ""
				}
				let province_code, area_code = ''
				let city_manage_citylist = uni.getStorageSync('city_manage_citylist')
				if (that.datas.content.son_page == 1) {
					province_code = city_manage_citylist.city_manage_province_code
					city_code = city_manage_citylist.city_manage_city_code
					area_code = city_manage_citylist.city_manage_area_code
				}
				var search = {
					sales: that.datas.content.tab_sales,
					distance: that.datas.content.tab_distance,
					haoping: that.datas.content.tab_haoping,
					latitude: that.fkshop_league_obj.latitude,
					longitude: that.fkshop_league_obj.longitude,
					province_code: province_code,
					city_code: city_code,
					area_code: area_code,
					store_type_id: store_type_id,
					pro_id: id,
					page: 1,
					page_size: 20,
				}
				if (that.datas.content.commodity_type == 1) {
					var url = "/fkshop_league/web/index.php?m=product&a=get_all_product_list&xdebug=xdebug";
				} else if (that.datas.content.commodity_type == 2) {
					var url = "/fkshop_league/web/index.php?m=user_collage_product&a=collage_product_list_api";
				}
				that.$common.requestData({
					url: url,
					data: search,
					method: 'POST',
				}).then(res => {
					if (res.errcode == 0 || (res.data ? res.data.length > 0 : false)) {
						if (that.datas.content.add_type == 1) {
							that.datas.content.dataset = [];
						} else {
							that.datas.content.dataset_default = [];
						}
						res.data.forEach(function(itm, ind) {
							if (that.datas.content.commodity_type == 1) {
								var store = {
									"id": itm.id,
									"pic": itm.first_img,
									"name": itm.name,
									"price": itm.price,
									"priceA": itm.plat_discount_type == 1 ? util.toPrice(itm.price,
											true) : ((itm.price * itm.plat_discount) / 10) > 0.01 ?
										util.toPrice(((itm.price * itm.plat_discount) / 10),
										true) : '0',
									"priceB": itm.plat_discount_type == 1 ? util.toPrice(itm.price,
											false) : ((itm.price * itm.plat_discount) / 10) >
										0.01 ? util.toPrice(((itm.price * itm.plat_discount) / 10),
											false) : '.01',
									"sold": itm.sale_count,
									"distance": itm.distance,
									"discount": itm.plat_discount,
									"discountA": itm.plat_discount_type == 1 ? util.toPrice(((itm
											.price / itm.package_price) * 10), true) : util
										.toPrice(((itm.price / itm.package_price) * itm
											.plat_discount), true),
									"discountB": itm.plat_discount_type == 1 ? util.toPrice(((itm
											.price / itm.package_price) * 10), false) : util
										.toPrice(((itm.price / itm.package_price) * itm
											.plat_discount), false),
									"plat_discount_type": itm.plat_discount_type,
									"original_price": itm.package_price,
									"group": "0",
									"store_name": itm.store_name,
									"store_id": itm.store_id,
									"give_integral": itm.give_integral,
									"integral_name": itm.integral_name
								};
							} else if (that.datas.content.commodity_type == 2) {
								var store = {
									"id": itm.id,
									"pic": itm.first_img,
									"name": itm.name,
									"price": itm.collage_price,
									"priceA": itm.plat_discount_type == 1 ? util.toPrice(itm
										.collage_price, true) : ((itm.collage_price * itm
										.plat_discount) / 10) > 0.01 ? util.toPrice(((itm
										.collage_price * itm.plat_discount) / 10), true) : '0',
									"priceB": itm.plat_discount_type == 1 ? util.toPrice(itm
											.collage_price, false) : ((itm.collage_price * itm
											.plat_discount) / 10) > 0.01 ? util.toPrice(((itm
											.collage_price * itm.plat_discount) / 10), false) :
										'.01',
									"sold": itm.sale_count,
									"distance": itm.distance,
									"discount": itm.plat_discount,
									"discountA": util.toPrice(itm.plat_discount, true),
									"discountB": util.toPrice(itm.plat_discount, false),
									"plat_discount_type": itm.plat_discount_type,
									"original_price": "0.00",
									"group": itm.collage_count,
									"store_name": itm.title,
									"give_integral": itm.give_integral,
									"integral_name": itm.integral_name
								};
							} else if (that.datas.content.commodity_type == 3) {
								var store = {
									"id": itm.id,
									"pic": itm.img,
									"name": itm.name,
									"price": itm.price,
									"priceA": itm.plat_discount_type == 1 ? util.toPrice(itm.price,
											true) : ((itm.price * itm.plat_discount) / 10) > 0.01 ?
										util.toPrice(((itm.price * itm.plat_discount) / 10),
										true) : '0',
									"priceB": itm.plat_discount_type == 1 ? util.toPrice(itm.price,
											false) : ((itm.price * itm.plat_discount) / 10) >
										0.01 ? util.toPrice(((itm.price * itm.plat_discount) / 10),
											false) : '.01',
									"sold": itm.sale_count,
									"distance": itm.distance,
									"discount": itm.plat_discount,
									"discountA": itm.plat_discount_type == 1 ? util.toPrice(((itm
											.price / itm.package_price) * 10), true) : util
										.toPrice(((itm.price / itm.package_price) * itm
											.plat_discount), true),
									"discountB": itm.plat_discount_type == 1 ? util.toPrice(((itm
											.price / itm.package_price) * 10), false) : util
										.toPrice(((itm.price / itm.package_price) * itm
											.plat_discount), false),
									"plat_discount_type": itm.plat_discount_type,
									"original_price": "",
									"group": "0",
									"store_name": itm.store_name,
									"store_id": itm.store_id,
									"give_integral": itm.give_integral,
									"integral_name": itm.integral_name
								};
							}

							if (that.datas.content.add_type == 1) {
								that.datas.content.dataset.push(store);
							} else {
								that.datas.content.dataset_default.push(store);
							}
						})
					} else {
						that.datas.content.dataset = [];
						that.datas.content.dataset_default = [];
					}
				})
			},
			goUrl: function(e) {
				const that = this;
				var itm = e.currentTarget.dataset.itm;
				if (that.datas.content.commodity_type == 1) {
					var url = "/fkshop_league/pages/product/product_detail/product_detail?id=" + itm.id +
						"&store_id=" + itm.store_id;
				} else if (that.datas.content.commodity_type == 2) {
					var url =
						"/fkshop_league/pages/user_collage_product/collage_product_detail/collage_product_detail?collage_pid=" +
						itm.id;
				}
				that.$common.diyLinkJump(url);
			},
		}
	}
</script>

<style>
	/*flex兼容写法*/
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

	.page-tab-main {
		height: 90rpx;
		position: relative;
		font-size: 0;
	}

	.page-tab-list {
		height: 90rpx;
		width: 100%;
		position: relative;
		z-index: 10;
	}

	.page-tab-list .list {
		font-size: 28rpx;
		color: #5D5D5D;
		width: 33.33%;
		text-align: center;
	}

	.page-tab-list .arrow {
		width: 32rpx;
		height: 32rpx;
		margin-left: 16rpx;
		display: inline-block;
	}

	.page-tab-list .arrow>image {
		width: 32rpx;
		height: 32rpx;
	}

	.page-tab-list .list.avice .arrow {
		transform: rotate(180deg);
	}

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

	.industry-content {
		position: absolute;
		bottom: 0px;
		left: 0;
		background-color: #fff;
		padding-left: 5%;
		width: 100%;
		height: 40%;
		z-index: 9;
		overflow-y: auto;
		box-sizing: border-box;
	}

	.industry-content .list {
		padding-right: 4%;
		border-bottom: solid 1px #f1f1f1;
		height: 100rpx;
		box-sizing: border-box;
	}

	.industry-content .list:last-child {
		border-bottom: 0;
	}

	.industry-content .list .name {
		font-size: 28rpx;
		color: #5D5D5D;
	}

	.industry-content .list .check-btn {
		width: 40rpx;
		height: 40rpx;
	}

	.industry-content .list .check-btn image {
		width: 40rpx;
		height: 40rpx;
	}

	/*商品列表start*/
	.mescroll-shop-list {
		font-size: 0;
		overflow: hidden;
	}

	.mescroll-shop-list .shop-list-new {
		display: inline-block;
		vertical-align: top;
		border-radius: 4px;
		overflow: hidden;
		width: calc(50% - 5px);
		margin-right: 10px;
	}

	.mescroll-shop-list .shop-list-new:nth-child(2n) {
		margin-right: 0;
	}

	.mescroll-shop-list .shop-list-new .img-box {
		position: relative;
		background-size: cover;
		background-position: center center;
		overflow: hidden;
	}

	.mescroll-shop-list .shop-list-new .img-box::after {
		content: " ";
		display: block;
		padding-top: 100%;
	}

	.mescroll-shop-list .shop-list-new .img-box .state {
		height: 16px;
		position: absolute;
		left: 0;
		top: 8px;
	}

	.mescroll-shop-list .shop-list-new .img-box .state .type {
		line-height: 16px;
		background: -webkit-linear-gradient(to right, #FF5050, #FF7700);
		background: -moz-linear-gradient(to right, #FF5050, #FF7700);
		background: linear-gradient(to right, #FF5050, #FF7700);
		border-top-left-radius: 6px;
		padding: 0 4px 0 6px;
		font-size: 12px;
		color: #fff;
	}

	.mescroll-shop-list .shop-list-new .img-box .state .num {
		line-height: 16px;
		background: -webkit-linear-gradient(to right, #FFC8C7, #FFE2C9);
		background: -moz-linear-gradient(to right, #FFC8C7, #FFE2C9);
		background: linear-gradient(to right, #FFC8C7, #FFE2C9);
		border-top-right-radius: 3px;
		border-bottom-right-radius: 6px;
		padding: 0 6px 0 3px;
		font-size: 12px;
		color: #FF5A3D;
	}

	.mescroll-shop-list .shop-list-new .text-box {
		padding: 8px;
		position: relative;
		background-color: #fff;
		border-radius: 0 0 4px 4px;
	}

	.mescroll-shop-list .shop-list-new .text-box .discount {
		position: absolute;
		left: 8px;
		top: -14px;
		z-index: 1;
		height: 18px;
		line-height: 18px;
		padding: 0 6px;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		background: -webkit-linear-gradient(to right, #F9D423, #FF4E50);
		background: -moz-linear-gradient(to right, #F9D423, #FF4E50);
		background: linear-gradient(to right, #F9D423, #FF4E50);
		font-size: 12px;
		color: #fff;
	}

	.mescroll-shop-list .shop-list-new .text-box .name {
		height: 39px;
		font-size: 14px;
		color: #333;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		word-break: break-all;
	}

	.mescroll-shop-list .shop-list-new .text-box .store {
		margin-top: 6px;
		line-height: 1;
	}

	.mescroll-shop-list .shop-list-new .text-box .store image {
		width: 12px;
		height: 12px;
	}

	.mescroll-shop-list .shop-list-new .text-box .store .text {
		font-size: 12px;
		color: #999;
		margin-left: 2px;
		max-width: 72px;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		word-break: break-all;
	}

	.mescroll-shop-list .shop-list-new .text-box .store .store-distance {
		font-size: 12px;
		color: #999;
	}

	.mescroll-shop-list .shop-list-new .text-box .price {
		margin-top: 10px;
		line-height: 1;
		align-items: baseline;
	}

	.mescroll-shop-list .shop-list-new .text-box .price .now-price {
		font-size: 17px;
		color: #F24F4C;
	}

	.mescroll-shop-list .shop-list-new .text-box .price .now-price span {
		font-size: 14px;
	}

	.mescroll-shop-list .shop-list-new .text-box .price .original_price {
		margin-left: 4px;
		font-size: 12px;
		color: #999999;
		text-decoration: line-through;
	}

	.mescroll-shop-list .shop-list-new .text-box .price .sold {
		margin-left: 4px;
		font-size: 12px;
		color: #5D5D5D;
	}

	.mescroll-shop-list .shop-list-new .text-box .num {
		font-size: 12px;
		color: #5D5D5D;
		line-height: 1;
		margin-top: 8px;
	}

	.page-tab-list.new {
		background-color: #f8f8f8;
	}

	.page-tab-list.new .list .arrow {
		background-color: #f8f8f8;
	}

	.mescroll-shop-list .shop-list-new .text-box .integral-box {
		font-size: 11px;
		line-height: 1;
		margin-top: 10px;
		border-radius: 3px;
	}

	.mescroll-shop-list .shop-list-new .text-box .integral-box-left {
		font-size: 11px;
		color: #ffffff;
		background: linear-gradient(to right, #FF8F4E, #FF6D0C);
		line-height: 1;
		padding: 0px 4px;
		height: 15px;
		border-radius: 3px 0 0 3px;
	}

	.mescroll-shop-list .shop-list-new .text-box .integral-box-right {
		font-size: 11px;
		color: #FF6500;
		background: #FFEEDC;
		line-height: 1;
		padding: 0px 4px;
		height: 15px;
		border-radius: 0 3px 3px 0;
	}

	/*商品列表end*/
	/*瀑布流*/
	.clearfloat:after {
		content: '';
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}

	.WaterfallsLeft {
		width: 171px;
		float: left;
	}

	.WaterfallsRight {
		width: 171px;
		float: right;
	}
</style>