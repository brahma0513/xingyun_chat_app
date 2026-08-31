<template>
	<view
		:style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2? 'linear-gradient('+datas.content.gradient_angle+', '+datas.content.gradient_color1+', '+datas.content.gradient_color2+')':(datas.content.select_bg_model==3? 'url('+datas.content.bg_img+')':'none' ))+';padding:'+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;'">
		<view class="svod-container">
			<view class="svod-title"
				:style="'width: calc(100% + '+ datas.content.padding_horizontal*2+'px;left: -'+datas.content.padding_horizontal+'px;'">
				<view class="svod-box flex-def"
					:style="'background-color: '+(!datas.content.type||datas.content.show_industry_main?'#fff':'')">
					<view class="svod-list flex-one" :style="'padding-left: '+datas.content.padding_horizontal+'px'">
						<view v-for="(itm,index) in datas.content.dataset" @click="svod_nav" :data-ind="index"
							:data-itm="itm"
							:style="'font-weight: '+(now_nav_index===index?(datas.content.select_text_style==1?'normal':'bold'):(datas.content.unselected_text_style==1?'normal':'bold'))+';color: '+(now_nav_index===index?datas.content.select_font_color:datas.content.unselected_font_color)+';'">
							<text
								:style="'max-width:100px;white-space:nowrap;overflow:hidden;font-size:'+ (now_nav_index===index?datas.content.select_font_size:datas.content.unselected_font_size)+'px;'">{{itm.option_title}}</text>
							<view class="line"
								:style="'border-radius: '+(datas.content.select_line_style==1?'1.5':'0')+'px;background-color: '+(datas.content.select_line_color_type==1?datas.content.select_line_color:'transparent')+';background-image: '+(datas.content.select_line_color_type==2?'linear-gradient('+datas.content.select_line_angle+','+datas.content.select_line_color1+','+datas.content.select_line_color2+')':'none')+';'"
								v-if="now_nav_index===index"></view>
						</view>
					</view>
					<view @click="svod_type" :class="'svod-sort '+(!datas.content.type?'rotate':'')">
						<image :src="http_host+'/HTML/admui/public/custom/images/icon_jian_bottom.png'"></image>
					</view>
				</view>
				<view v-if="!datas.content.type" class="svod-box svod-box-btn">
					<view class="svod-data">
						<view @click="svod_nav" :data-ind="index" :data-itm="itm"
							v-for="(itm,index) in datas.content.dataset"
							:class="(now_nav_index === index?'active haf-skin-bg-'+theme+' skin-color-'+theme:'')">
							{{itm.shop_source==2?itm.select_value:itm.option_title}}
						</view>
					</view>
				</view>
			</view>
			<!-- 分类筛选 -->
			<view class="page-tab-main" v-if="datas.content.screen"
				:style="'width: calc(100% + '+(datas.content.padding_horizontal*2)+'px);left: -'+datas.content.padding_horizontal+'px;background-color: '+(datas.content.show_industry_main?'#fff':'')+';padding: 0 '+datas.content.padding_horizontal+'px'">
				<view class="page-tab-list flex-def flex-zAround flex-cCenter">
					<view class="list flex-def flex-cCenter flex-zStart" @click="league_toggleIndustry">
						<view
							:class="'flex-def flex-cCenter flex-zCenter '+ (datas.content.show_industry_main?'avice skin-color-'+theme+' skin-bd-'+theme:'')">
							<view>{{datas.content.industry_name}}</view>
							<span class="arrow">
								<image class="arrow_img"
									:src="http_host+'/fkshop_league/web/static/images/xia_jiantou.png'" />
							</span>
						</view>
					</view>
					<view class="list flex-def flex-zAround flex-cCenter" @click="league_salesFun">
						<view
							:class="'flex-def flex-cCenter flex-zCenter '+ (datas.content.tab_sales?'skin-color-'+theme+' skin-bd-'+theme:'')">
							销量最高</view>
					</view>
					<view class="list flex-def flex-zEnd flex-cCenter" @click="league_distanceFun">
						<view
							:class="'flex-def flex-cCenter flex-zCenter '+ (datas.content.tab_distance?'skin-color-'+theme+' skin-bd-'+theme:'')">
							距离最近</view>
					</view>
					<view class="list flex-def flex-zEnd flex-cCenter" @click="league_haopingFun">
						<view
							:class="'flex-def flex-cCenter flex-zCenter '+ (datas.content.tab_haoping?'skin-color-'+theme+' skin-bd-'+theme:'')">
							好评最多</view>
					</view>
				</view>
			</view>
			<!-- 头部分类弹窗 -->
			<view class="shop_league_shop_group_industry-main"
				:style="'width: calc(100% + '+(datas.content.padding_horizontal*2+'px);left: -'+datas.content.padding_horizontal+'px;')"
				v-if="datas.content.show_industry_main">
				<view class="industry-shadow" @click="league_hideIndustry"></view>
				<view class="industry-content">
					<view class="list flex-def flex-zBetween flex-cCenter"
						v-for="(itm,index) in datas.content.industry_list" @click="league_industryFun" :data-item="itm">
						<span
							:class="'name '+(itm.id == datas.content.industry_type_1?'skin-color-'+theme:'')">{{itm.name}}</span>
						<!-- <span class="check-btn skin-bg-{{theme}}" v-if="{{itm.id == data.content.industry_type_1}}">
            <image src="{{http_host}}/shop_league/web/static/images/icon_check.png" mode="widthFix"/>
          </span> -->
					</view>
				</view>
			</view>
				<view class="industry-main child"
				:style="'width: calc(100% + '+ datas.content.padding_horizontal*2+'px);left: -'+datas.content.padding_horizontal+'px;'"
				v-if="datas.content.show_industry_child">
				<view class="industry-shadow" @click="league_hideIndustry"></view>
				<view class="industry-content">
					<view class="list flex-def flex-zBetween flex-cCenter"
						v-for="itm in datas.content.industry_list_child" @click="league_industryFun" :data-item="itm">
						<span
							:class="'name '+(itm.id == datas.content.industry_type?'skin-color-'+theme:'')">{{itm.name}}</span>
						<span :class="'check-btn skin-bg-'+theme" v-if="itm.id == datas.content.industry_type">
							<image :src="http_host+'/fkshop_league/web/static/images/icon_check.png'" mode="widthFix" />
						</span>
					</view>
				</view>
			</view>
			<!-- 分类筛选end -->
			<view v-if="!datas.content.type" @click="svod_type" class="svod-mask"
				:style="'width: calc(100% + '+ (!datas.content.type?datas.content.padding_horizontal*2:0)+'px);left: -'+(!datas.content.type?datas.content.padding_horizontal:0)+'px;'">
			</view>
			<view class="svod-content">
				<view class="flex-def" style="padding-top: 5px;" v-if="datasetitms">
					<!-- 门店列表 -->
					<view class="mescroll-main" v-if="datasetitms&&datasetitms.display_type==1">
						<view class="mescroll-list">
							<view class="list flex-def" v-for="(itm,indexs) in datasetitms.store_dataset_default"
								v-if="datasetitms.dataset.length == 0 || datasetitms.add_type == 2 || datasetitms.add_type == 3"
								@click="goUrl"
								:data-url="'/fkshop_league/pages/store/storeDetail/storeDetail?id='+itm.id" :data-id="itm.id">
								<view class="img-box flex-def flex-zCenter flex-cCenter">
									<image :src="itm.pic[0]" style="width:78px;height:78px" mode="aspectFill" />
								</view>
								<view class="text-box flex-def flex-zTopBottom flex-zBetween">
									<view class="flex-def flex-cCenter flex-zBetween">
										<view class="name margin-bottom-0">{{itm.name}}</view>
										<image v-if="itm.has_union_card" style="width:16px;height:16px"
											:src="http_host+'/fkshop_league/web/static/images/icon_vip@3x.png'"></image>
									</view>
									<view class="center flex-def flex-cCenter margin-bottom-22">
										<view class="score">
											<span class="score-bg score-up"
												:style="'width:'+(itm.score/5)*100+'%;background-image: url('+http_host+'/fkshop_league/web/static/images/score_2.png)'"></span>
											<span class="score-bg score-down"
												:style="'background-image: url('+http_host+'/fkshop_league/web/static/images/score_2.png)'"></span>
										</view>
										<view class="num">￥{{itm.price}}/人</view>
										<view class="num">已售{{itm.sold}}</view>
									</view>
									<view class="small flex-def flex-cCenter flex-zBetween">
										<view class="address">{{itm.industry}}</view>
										<view class="position flex-def">
											<span>{{itm.position}}</span>
											<span>{{itm.distance}}</span>
										</view>
									</view>
									<view class="promotion-shop-box" v-if="itm.main_push_product.length>0">
										<view class="promotion-shop flex-def flex-cEnd"
											v-for="(items,indexs) in itm.main_push_product" catchtap="goShopDetail"
											:data-id="itm.id" :data-pid="items.pro_id">
											<view class="icon flex-def flex-zCenter flex-cCenter">惠</view>
											<view class="price-box flex-def flex-cEnd">
												<span class="discount">￥{{items.price}}</span>
												<span class="price">￥{{items.package_price}}</span>
											</view>
											<view class="shop-name flex-one">{{items.name}}</view>
										</view>
									</view>
								</view>
							</view>
							<view class="list flex-def" v-for="(itm,index) in datasetitms.dataset"
								v-if="datasetitms.dataset.length > 0 && datasetitms.add_type == 1" @click="goUrl"
								:data-url="'/fkshop_league/pages/store/storeDetail/storeDetail?id='+itm.id" :data-id="itm.id">
								<view class="img-box flex-def flex-zCenter flex-cCenter">
									<image :src="itm.pic[0]" style="width:78px;height:78px" mode="aspectFill" />
								</view>
								<view class="text-box flex-def flex-zTopBottom flex-zBetween">
									<view class="flex-def flex-cCenter flex-zBetween">
										<view class="name margin-bottom-0">{{itm.name}}</view>
										<image v-if="itm.has_union_card" style="width:16px;height:16px"
											:src="http_host+'/fkshop_league/web/static/images/icon_vip@3x.png'"></image>
									</view>
									<view class="center flex-def flex-cCenter margin-bottom-22">
										<view class="score">
											<span class="score-bg score-up"
												:style="'width:'+(itm.score/5)*100+'%;background-image: url('+http_host+'/fkshop_league/web/static/images/score_2.png)'"></span>
											<span class="score-bg score-down"
												:style="'background-image: url('+http_host+'/fkshop_league/web/static/images/score_2.png)'"></span>
										</view>
										<view class="num">￥{{itm.price}}/人</view>
										<view class="num">已售{{itm.sold}}</view>
									</view>
									<view class="small flex-def flex-cCenter flex-zBetween">
										<view class="address">{{itm.industry}}</view>
										<view class="position flex-def">
											<span>{{itm.position}}</span>
											<span>{{itm.distance}}</span>
										</view>
									</view>
									<view class="promotion-shop-box" v-if="itm.main_push_product.length>0">
										<view class="promotion-shop flex-def flex-cEnd"
											v-for="(items,indexs) in itm.main_push_product" catchtap="goShopDetail"
											:data-id="itm.id" :data-pid="items.pro_id">
											<view class="icon flex-def flex-zCenter flex-cCenter">惠</view>
											<view class="price-box flex-def flex-cEnd">
												<span class="discount">￥{{items.price}}</span>
												<span class="price">￥{{items.package_price}}</span>
											</view>
											<view class="shop-name flex-one">{{items.name}}</view>
										</view>
									</view>
								</view>
							</view>
							<view v-if="datas.content.isLoading">
								<view class="shop-league-not"
									v-if="((datasetitms.dataset.length == 0 || datasetitms.add_type == 2 || datasetitms.add_type == 3) && datasetitms.store_dataset_default.length == 0) || (datasetitms.dataset.length == 0 && datasetitms.add_type == 1)">
									<image :src="http_host+'/fkshop_league/web/view/images/jianshezhong.png'" style="margin: 0 auto;"/>
									<view class="shop-league-text">门店即将开通入驻，敬请期待~</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 门店列表end -->
					<!-- 商品列表 -->
					<view class="mescroll-main" v-if="datasetitms&&datasetitms.display_type==2">
						<view class="mescroll-shop-list">
							<view class="shop-list-new" v-for="(itm,indexs) in datasetitms.shop_dataset_default"
								v-if="datasetitms.dataset.length == 0 || datasetitms.add_type == 2 || datasetitms.add_type == 3"
								@click="goUrlshop" :data-itm="itm">
								<view class="img-box" :style="'background-image: url('+itm.pic+');'">
									<view class="state flex-def flex-cStretch" v-if="datasetitms.commodity_type == 2">
										<view class="type">拼团</view>
										<view class="num">{{itm.group}}人团</view>
									</view>
								</view>
								<view class="text-box">
									<view class="discount"
										v-if="datasetitms.commodity_type == 1&&itm.plat_discount_type == 1&&itm.discountA<10">
										{{itm.discountA}}{{itm.discountB}}折
									</view>
									<view class="discount"
										v-if="datasetitms.commodity_type == 1&&itm.plat_discount_type == 2&&itm.discountA<10">
										{{itm.discountA}}{{itm.discountB}}折
									</view>
									<view class="name">{{itm.name}}</view>
									<view class="store flex-def flex-cCenter flex-zBetween">
										<view class="store-name flex-def flex-cCenter">
											<image :src="http_host+'/fkshop_league/web/static/images/shop_icon.png'"
												alt="" />
											<view class="text">{{itm.store_name}}</view>
										</view>
										<view class="store-distance">{{itm.distance}}</view>
									</view>
									<view class="price flex-def flex-cCenter">
										<view class="now-price">¥{{itm.priceA}}<span>{{itm.priceB}}</span></view>
										<view class="original_price" v-if="datasetitms.commodity_type == 1">
											¥{{itm.original_price}}</view>
										<view class="sold" v-if="datasetitms.commodity_type == 2">已拼{{itm.sold}}份</view>
									</view>
									<view class="num" v-if="datasetitms.commodity_type == 1">已售{{itm.sold}}</view>
								</view>
							</view>
							<view class="shop-list-new" v-for="(itm,index1) in datasetitms.dataset"
								v-if="datasetitms.dataset.length > 0 && datasetitms.add_type == 1" @click="goUrlshop"
								:data-itm="itm">
								<view class="img-box" :style="'background-image: url('+itm.pic+');'">
									<view class="state flex-def flex-cStretch" v-if="datasetitms.commodity_type == 2">
										<view class="type">拼团</view>
										<view class="num">{{itm.group}}人团</view>
									</view>
								</view>
								<view class="text-box">
									<view class="discount"
										v-if="datasetitms.commodity_type == 1&&itm.plat_discount_type == 1&&itm.discountA<10">
										{{itm.discountA}}{{itm.discountB}}折
									</view>
									<view class="discount"
										v-if="datasetitms.commodity_type == 1&&itm.plat_discount_type == 2&&itm.discountA<10">
										{{itm.discountA}}{{itm.discountB}}折
									</view>
									<view class="name">{{itm.name}}</view>
									<view class="store flex-def flex-cCenter flex-zBetween">
										<view class="store-name flex-def flex-cCenter">
											<image :src="http_host+'/fkshop_league/web/static/images/shop_icon.png'"
												alt="" />
											<view class="text">{{itm.store_name}}</view>
										</view>
										<view class="store-distance">{{itm.distance}}</view>
									</view>
									<view class="price flex-def flex-cCenter">
										<view class="now-price">¥{{itm.priceA}}<span>{{itm.priceB}}</span></view>
										<view class="original_price" v-if="datasetitms.commodity_type == 1">
											¥{{itm.original_price}}</view>
										<view class="sold" v-if="datasetitms.commodity_type == 2">已拼{{itm.sold}}份</view>
									</view>
									<view class="num" v-if="datasetitms.commodity_type == 1">已售{{itm.sold}}</view>
								</view>
							</view>

							<view
								v-if="datasetitms.dataset.length <= 0 &&datasetitms.shop_dataset_default.length <= 0&& datasetitms.add_type == 1||(datasetitms.shop_dataset_default.length<= 0&&datasetitms.add_type == 2 || datasetitms.shop_dataset_default.length<= 0&&datasetitms.add_type == 3)"
								style="padding:150px 0;font-size:15px;text-align: center;">
								<image :src="http_host+'/fkshop_league/web/static/images/nobenefits@3x.png'" alt=""
									style="width: 168.5px;height: 101px;margin: 0 auto;"/>
								<view>暂无商品</view>
							</view>
						</view>
					</view>
					<!-- 商品列表end -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../../../../utils/util.js';
	export default {
		name: "shopLeagueGroup",
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
				// shop_league_obj: {
				// 	key: '',
				// 	item_arr: [],
				// 	latitude: '',
				// 	longitude: '',
				// 	get_position_ing: false,
				// 	industry_list: [],
				// 	cache_position: '',
				// 	datasetitms: []
				// },
				// now_nav_index: 0,
				// datasetitms: [],
				shop_league_obj: {
					key: '',
					item_arr: [],
					latitude: '',
					longitude: '',
					get_position_ing: false,
					industry_list: [],
					cache_position: '',
				},
				now_nav_index: 0,
				datasetitms:[]
			};
		},
		created() {},
		mounted() {
			this.http_host = this.vuex_apiUrl;
			var that = this;
			var position = uni.getStorageSync('shop_league_position')
			let datasetlist = that.datas.content.dataset
			that.datasetlist = datasetlist;
			if (position) {
				that.shop_league_obj.latitude = position.lat;
				that.shop_league_obj.longitude = position.lng;
				that.shop_league_obj.cache_position = position;
			} else {
				that.get_location()
			}
			//位置更新后再获取数据
			setTimeout(function() {
				that.shop_league_getdata()
			}, 500)
		},
		methods: {
			// 切换tab样式
			svod_type() {
				const that = this;
				that.datas.content.type = !that.datas.content.type;
				that.datas.content.show_industry_main = false;
				// that.setData({
				// 	'data.content.type': !that.data.data.content.type,
				// 	'data.content.show_industry_main': false
				// })
			},
			// tab切换
			svod_nav(e) {
				const that = this;
				var itm = e.currentTarget.dataset.itm;
				//修改分类
				that.datas.content.industry_type = itm.industry_type;
				that.datas.content.industry_type_1 = itm.industry_type_1;
				that.datas.content.industry_name = itm.industry_name
				that.datas = that.datas;
				that.now_nav_index = e.currentTarget.dataset.ind;
				that.shop_league_get_list(that.datas, that.datas.content.dataset[that.now_nav_index]);
			},
			//获取定位城市
			get_location: function() {
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true, // 开启地图精准定位
					success: function(res) {
						var latitude = res.latitude
						var longitude = res.longitude
						var position = {
							lat: latitude,
							lng: longitude
						}
						uni.setStorageSync('shop_league_position', position);
						that.shop_league_obj.latitude = latitude;
						that.shop_league_obj.longitude = longitude;
						that.shop_league_obj.cache_position = position;
						that.shop_league_get_list(that.datas, that.datas.content.dataset[that
							.now_nav_index]);
					},
					fail: function(res) {
						console.log('get_location_fail', res)
						that.shop_league_get_list(that.datas, that.datas.content.dataset[that
							.now_nav_index]);
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
				that.datas = that.datas;
			},
			league_hideIndustry: function() {
				/*隐藏分类弹窗*/
				var that = this
				that.datas.content.show_industry_main = false;
				that.datas.content.show_industry_child = false;
				that.datas = that.datas;
			},
			league_industryFun: function(e) {
				var that = this
				var itm = e.currentTarget.dataset.item
				that.datas.content.industry_type = itm.id;
				that.datas.content.industry_type_1 = itm.id;
				that.datas.content.industry_name = itm.name
				that.datas = that.datas;
				that.shop_league_get_list(that.datas, that.datas.content.dataset[that.now_nav_index], 1);
				that.league_hideIndustry();
			},
			league_salesFun: function() {
				/*销量筛选切换*/
				var that = this
				that.datas.content.tab_sales = !that.datas.content.tab_sales;
				that.datas.content.tab_distance = false;
				that.datas.content.tab_haoping = false;
				that.datas.content.pageNum = 1;
				that.datas = that.datas;
				that.shop_league_get_list(that.datas, that.datas.content.dataset[that.now_nav_index]);
			},
			league_distanceFun: function() {
				/*距离筛选切换*/
				var that = this
				that.datas.content.tab_sales = false;
				that.datas.content.tab_distance = !that.datas.content.tab_distance;
				that.datas.content.tab_haoping = false;
				that.datas.content.pageNum = 1;
				that.datas = that.datas;
				that.shop_league_get_list(that.datas, that.datas.content.dataset[that.now_nav_index]);
			},
			league_haopingFun: function() {
				/*好评筛选切换*/
				var that = this
				that.datas.content.tab_sales = false;
				that.datas.content.tab_distance = false;
				that.datas.content.tab_haoping = !that.datas.content.tab_haoping;
				that.datas.content.pageNum = 1;
				that.datas = that.datas;
				that.shop_league_get_list(that.datas, that.datas.content.dataset[that.now_nav_index]);
			},
			// 获取数据
			shop_league_getdata: function() {
				var that = this
				console.log("进来了===", that.data);
				//加载店铺列表
				if (that.shop_league_obj.cache_position) { //有缓存，使用缓存的定位加载数据
					console.log("有缓存，直接加载数据");
					that.shop_league_obj.latitude = that.shop_league_obj.cache_position.lat;
					that.shop_league_obj.longitude = that.shop_league_obj.cache_position.lng;
					that.datas = that.datas;
					that.shop_league_obj = that.shop_league_obj;
					// setTimeout(function () {
					//   //重新进入小程序定位会刷新定位，定位完成后再调用
					//   that.shop_league_get_list(that.data.data,that.data.data.content.dataset[that.data.now_nav_index]);
					// }, 1000)
				}
				that.get_location()
				// console.log(that.data.data)
				that.shop_league_obj.item_arr = that.datas
				//that.data.shop_league_obj = that.data.shop_league_obj.item_arr.push(that.data.data);//先把item保存起来，等定位刷新再加载所有数据
				that.shop_league_obj = that.shop_league_obj;

				//加载分类列表
				if (that.shop_league_obj.industry_list && that.shop_league_obj.industry_list.length > 0) {
					that.datas.content.industry_list = that.datas.content.industry_list.concat(that
						.shop_league_type_list_format(that.shop_league_obj.industry_list));
					that.datas = that.datas;
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
						needToken: true
					}).then(res => {
						if (res.errcode == 0) {
							var datas = res.data.list
							that.shop_league_obj.industry_list = res.data.list;
							that.datas.content.industry_list = that.datas.content.industry_list
								.concat(that.shop_league_type_list_format(res.data.list));
							that.datas = that.datas;
						}
					})
				}
			},
			shop_league_type_list_format: function(list) {
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
						child: that.shop_league_type_list_format(itm.child),
					};
					res.push(type)
				})
				return res;
			},
			shop_league_get_list: function(item, itm, type) {
				console.log('定位数据', getApp().globalData.has_lbs)
				var has_lbs = getApp().globalData.has_lbs;
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
							that.shop_league_get_list(item, itm);
						}, 500)
						return false;
					} else {
						var city_code = current_city.area_code
					}
				} else {
					var city_code = '';
				}
				let id = [];
				if (itm.add_type == 1) {
					itm.dataset.forEach(function(itms, ind) {
						id.push(itms.id);
					})
				}
				if (type == 1) {
					id = []
				}
				let industry_type_1 = 0
				if (item.content.industry_type_1 > 0) {
					industry_type_1 = item.content.industry_type_1
				} else {
					industry_type_1 = itm.industry_type_1
				}
				let province_code, area_code = ''
				let city_manage_citylist = uni.getStorageSync('city_manage_citylist')
				if (that.datas.content.son_page == 1) {
					province_code = city_manage_citylist.city_manage_province_code
					city_code = city_manage_citylist.city_manage_city_code
					area_code = city_manage_citylist.city_manage_area_code
				}
				if (itm.display_type == 1) {
					var search = {
						type: industry_type_1,
						sales: item.content.tab_sales,
						distance: item.content.tab_distance,
						haoping: item.content.tab_haoping,
						id: id,
						latitude: that.shop_league_obj.latitude,
						longitude: that.shop_league_obj.longitude,
						province_code: province_code,
						city_code: city_code,
						area_code: area_code,
						pagesize: -1,
					};
					if (itm.add_type == 3) {
						search.ishot = 1;
					}
					if (!item.content.mem_card) {
						search.check_union_card = 0;
					}

					that.$common.requestData({
						url: '/fkshop_league/web/index.php?m=store&a=ajax_store_list',
						data: search,
						method: 'POST',
						needToken: true
					}).then(res => {
						if (res.errcode == 0) {
							if (itm.add_type == 1) {
								itm.dataset = [];
							} else {
								itm.store_dataset_default = [];
							}
							res.data.data.forEach(function(itms, ind) {
								itms.main_push_product.forEach((items) => {
									if (items.plat_discount_type == 2) {
										if (((items.price * items.plat_discount) / 10) >
											0.01) {
											items.price = ((items.price * items
												.plat_discount) / 10).toFixed(2).toString()
										} else {
											items.price = 0.01
										}
									}
								})
								var store = {
									"id": itms.id,
									"pic": itms.store_intro_img,
									"name": itms.title,
									"score": itms.score,
									"price": itms.avg_price,
									"sold": itms.sale_num,
									"industry": itms.type_name,
									"position": itms.address,
									"distance": itms.distance,
									"main_push_product": itms.main_push_product,
									"has_union_card": itms.has_union_card
								};

								if (itm.add_type == 1) {
									itm.dataset.push(store);
								} else {
									itm.store_dataset_default.push(store);
								}
							})
							that.datas.content.isLoading = false
							if (res.data.data.length <= 0) {
								that.datas.content.isLoading = true
								itm.store_dataset_default = [];
							}
							that.datas = that.datas;
							that.datasetitms = itm;
						} else {
							that.datas.content.isLoading = true
							itm.dataset = [];
							itm.store_dataset_default = [];
							that.datas = that.datas;
							that.datasetitms = itm;
						}
					})
				} else if (itm.display_type == 2) {
					id = id.toString();
					let store_type_id = industry_type_1
					if (itm.shop_add_type == 2) {
						id = []
					}
					var has_lbs = getApp().globalData.has_lbs;
					if (has_lbs) {
						//开启lbs定位组件的话，只显示当前城市的门店
						console.log('当前城市', uni.getStorageSync('current_city'))
						if (uni.getStorageSync('current_city')) {
							var current_city = JSON.parse(uni.getStorageSync('current_city'))
						}
						if (!current_city) {
							//lbs定位未完成，500ms后重试
							setTimeout(function() {
								that.shop_league_get_list(item, itm);
							}, 500)
							return false;
						} else {
							var city_code = current_city.area_code
						}
					} else {
						var city_code = '';
					}
					let province_code, area_code = ''
					let city_manage_citylist = uni.getStorageSync('city_manage_citylist')
					if (that.datas.content.son_page == 1) {
						province_code = city_manage_citylist.city_manage_province_code
						city_code = city_manage_citylist.city_manage_city_code
						area_code = city_manage_citylist.city_manage_area_code
					}
					var search = {
						sales: item.content.tab_sales,
						distance: item.content.tab_distance,
						haoping: item.content.tab_haoping,
						latitude: that.shop_league_obj.latitude,
						longitude: that.shop_league_obj.longitude,
						province_code: province_code,
						city_code: city_code,
						area_code: area_code,
						store_type_id: store_type_id,
						pro_id: id,
						page: 1,
						page_size: 20,
					}
					if (itm.add_type == 3) {
						search.ishot = 1;
					}
					if (itm.commodity_type == 1) {
						var url = "/fkshop_league/web/index.php?m=product&a=get_all_product_list&xdebug=xdebug";
					} else if (itm.commodity_type == 2) {
						var url = "/fkshop_league/web/index.php?m=user_collage_product&a=collage_product_list_api";
					}

					that.$common.requestData({
						url: url,
						data: search,
						method: 'POST',
						needToken: true
					}).then(res => {
						if (res.errcode == 0 || (res.data ? res.data.length > 0 : false)) {
							if (res.data.length <= 0) {
								itm.dataset = [];
								itm.shop_dataset_default = [];
							}
							if (itm.add_type == 1) {
								itm.dataset = [];
							} else {
								itm.shop_dataset_default = [];
							}
							res.data.forEach(function(itms, ind) {
								if (itm.commodity_type == 1) {
									var store = {
										"id": itms.id,
										"pic": itms.first_img,
										"name": itms.name,
										"price": itms.price,
										"priceA": itms.plat_discount_type == 1 ? util.toPrice(
											itms.price, true) : ((itms.price * itms
											.plat_discount) / 10) > 0.01 ? util.toPrice(((
												itms.price * itms.plat_discount) / 10),
											true) : '0',
										"priceB": itms.plat_discount_type == 1 ? util.toPrice(
											itms.price, false) : ((itms.price * itms
											.plat_discount) / 10) > 0.01 ? util.toPrice(((
												itms.price * itms.plat_discount) / 10),
											false) : '.01',
										"sold": itms.sale_count,
										"distance": itms.distance,
										"discount": itms.plat_discount,
										"discountA": itms.plat_discount_type == 1 ? util
											.toPrice(((itms.price / itms.package_price) * 10),
												true) : util.toPrice(((itms.price / itms
													.package_price) * itms.plat_discount),
												true),
										"discountB": itms.plat_discount_type == 1 ? util
											.toPrice(((itms.price / itms.package_price) * 10),
												false) : util.toPrice(((itms.price / itms
													.package_price) * itms.plat_discount),
												false),
										"plat_discount_type": itms.plat_discount_type,
										"original_price": itms.package_price,
										"group": "0",
										"store_name": itms.store_name,
										"store_id": itms.store_id
									};
								} else if (itm.commodity_type == 2) {
									var store = {
										"id": itms.id,
										"pic": itms.first_img,
										"name": itms.name,
										"price": itms.collage_price,
										"priceA": itms.plat_discount_type == 1 ? util.toPrice(
												itms.collage_price, true) : ((itms
												.collage_price * itms.plat_discount) / 10) >
											0.01 ? util.toPrice(((itms.collage_price * itms
												.plat_discount) / 10), true) : '0',
										"priceB": itms.plat_discount_type == 1 ? util.toPrice(
												itms.collage_price, false) : ((itms
												.collage_price * itms.plat_discount) / 10) >
											0.01 ? util.toPrice(((itms.collage_price * itms
												.plat_discount) / 10), false) : '.01',
										"sold": itms.sale_count,
										"distance": itms.distance,
										"discount": itms.plat_discount,
										"discountA": util.toPrice(itms.plat_discount, true),
										"discountB": util.toPrice(itms.plat_discount, false),
										"plat_discount_type": itms.plat_discount_type,
										"original_price": "0.00",
										"group": itms.collage_count,
										"store_name": itms.title
									};
								}
								if (itm.add_type == 1) {
									itm.dataset.push(store);
								} else {
									itm.shop_dataset_default.push(store);
								}
							})
							that.data = that.that;
							that.datasetitms = itm;
						} else {
							itm.dataset = [];
							itm.shop_dataset_default = [];
							that.data = that.that;
							that.datasetitms = itm;
						}
					})
				}
				// console.log(that.data.datasetitms)
			},
			goUrl: function(e) {
				console.log('234',e)
				// var url = e.currentTarget.dataset.url
				// uni.navigateTo({
				// 	url: url
				// })
				
				this.$common.diyLinkJump('/fkshop_league/web/index.php?m=store&a=store_detail&id='+e.currentTarget.dataset.id)
			},
			goUrlshop: function(e) {
				console.log('1232',e)
				const that = this;
				var itm = e.currentTarget.dataset.itm;
				if (that.datasetitms.commodity_type == 1) {
					var url = "/fkshop_league/web/index.php?m=product&a=product_detail&id=" + itm.id + "&store_id=" +
						itm.store_id;
				} else if (that.datasetitms.commodity_type == 2) {
					var url =
						"/fkshop_league/web/index.php?m=user_collage_product&a=collage_product_detail&collage_pid=" +
						itm.id;
				}
				that.$common.diyLinkJump(url)
			},
			goShopDetail: function(e) {
				const that = this;
				var id = e.currentTarget.dataset.id;
				var pid = e.currentTarget.dataset.pid;
				that.$common.diyLinkJump("/fkshop_league/web/index.php?m=product&a=product_detail&store_id=" + id + "&id=" +pid)
			},
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

	.svod-container {
	  position: relative;
	}
	
	.svod-title {
	  width: 100%;
	  position: relative;
	  left: 0;
	  top: 0;
	  height: 88rpx;
	  z-index: 10;
	}
	
	.svod-box {
	  font-size: 0;
	  width: 100%;
	  box-sizing: border-box;
	}
	
	.svod-box.svod-box-btn {
	  position: absolute;
	  left: 0;
	  top: 74rpx;
	  padding: 0;
	}
	
	.svod-list {
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  white-space: nowrap;
	  overflow-x: scroll;
	}
	
	.svod-select {
	  height: 76rpx;
	  line-height: 76rpx;
	  font-size: 26rpx;
	  color: #333;
	  padding-left: 10rpx;
	}
	
	.svod-sort {
	  width: 80rpx;
	  height: 88rpx;
	  background: linear-gradient(to right, transparent, #ffffff);
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	
	.svod-sort>image {
	  width: 26rpx;
	  height: 26rpx;
	}
	
	.svod-sort.rotate>image {
	  transform: rotate(180deg);
	  -ms-transform: rotate(180deg);
	  /* IE 9 */
	  -webkit-transform: rotate(180deg);
	  /* Safari and Chrome */
	}
	
	.svod-list::-webkit-scrollbar {
	  display: none;
	}
	
	.svod-list>view {
	  padding: 0 10rpx 0 0;
	  box-sizing: border-box;
	  text-align: center;
	  font-size: 0;
	  color: #333;
	}
	
	.svod-list>view>text {
	  display: inline-block;
	  position: relative;
	  font-size: 30rpx;
	  line-height: 1;
	  padding: 28rpx 10rpx 10rpx;
	}
	
	.svod-list>view .line {
	  width: 28rpx;
	  height: 6rpx;
	  border-radius: 1.5px;
	  background-color: #FF0036;
	  margin: 0 auto;
	}
	
	.svod-list>view>view>text {
	  width: 98rpx;
	  height: 32rpx;
	  font-size: 20rpx;
	  color: #999;
	  padding: 0 6rpx;
	  border-radius: 20rpx;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	
	.svod-list>view>view>text.active {
	  font-size: 22rpx;
	  color: #fff;
	}
	
	.svod-list>view>view {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	
	.svod-list>view.active {
	  color: #FF0036;
	}
	
	.svod-list>view.active .line {
	  display: block;
	}
	
	.svod-list .vice_title{
	  position: relative;
	}
	
	.svod-list .vice_title .vice_text{
	  color: #999;
	  font-size: 11.5px;
	  width: 59px;
	  height: 18px;
	  border-radius: 10px;
	  padding: 0 3px;
	}
	.svod-list .vice_title .vice_text.active{
	  font-size: 12px;
	}
	
	.svod-data {
	  padding: 28rpx 28rpx 0;
	  background-color: #fff;
	  border-radius: 0 0 12px 12px;
	}
	
	.svod-data>view {
	  display: inline-block;
	  height: 28px;
	  margin-bottom: 30rpx;
	  margin-right: 20rpx;
	  font-size: 24rpx;
	  color: #333;
	  border-radius: 14px;
	  background-color: #F7F8FA;
	  line-height: 28px;
	  text-align: center;
	  padding: 0 30rpx;
	  vertical-align: top;
	}
	
	.svod-data>view.active {
	  background-color: #FF0036;
	  color: #fff;
	}
	
	.svod-mask {
	  width: 100%;
	  height: 100%;
	  background-color: #000;
	  opacity: .6;
	  position: absolute;
	  top: 0;
	  left: 0;
	  z-index: 9;
	}
	
	
	/* 头部导航end */
	/* 商品列表start */
	.svod-content {
	  box-sizing: border-box;
	  padding-top: 0;
	}
	
	.svod-content::-webkit-scrollbar {
	  display: none;
	}
	
	.page-tab-main {
	  height: 72rpx;
	  position: relative;
	  font-size: 0;
	}
	
	.page-tab-list {
	  height:72rpx;
	  width: 100%;
	  position: relative;
	}
	
	.page-tab-list .list {
	  font-size: 28rpx;
	  color: #5D5D5D;
	  /* width: 33.33%; */
	  text-align: center;
	}
	.page-tab-list .list>view{
	  background: #F1F1F1;
	  font-size: 12px;
	  /* min-width: 81px; */
	  white-space: nowrap;
	  padding: 6px 10px;
	  border-radius: 6px;
	  height: 24px;
	  line-height: 24px;
	  box-sizing: border-box;
	  border: 1px solid transparent;
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
	  height: calc(100% - 0px);
	  background-color: rgba(0,0,0,0.6);
	}
	
	.industry-content {
	  position: absolute;
	  top: 0px;
	  left: 0;
	  background-color: #fff;
	  padding-left: 5%;
	  width: 100%;
	  max-height: 60%;
	  border-radius: 0 0 12px 12px;
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
	.industry-content .list .check-btn image{
	  width: 40rpx;
	  height: 40rpx;
	}
	
	.mescroll-list {
	  font-size: 0;
	}
	
	.mescroll-list .list {
	  background-color: #fff;
	  padding: 15px 4%;
	}
	
	.mescroll-list .list .center {
	  justify-content: flex-start;
	  -webkit-justify-content: flex-start;
	}
	
	.mescroll-list .list .img-box {
	  width: 140rpx;
	  height: 140rpx;
	  border-radius: 8rpx;
	  overflow: hidden;
	}
	
	.mescroll-list .list .img-box>image {
	  max-width: 100%
	}
	
	.mescroll-list .list .text-box {
	  margin-left: 24rpx;
	  width: calc(100% - 164rpx);
	}
	
	.mescroll-list .list .name {
	  font-size: 32rpx;
	  color: #333;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	
	.mescroll-list .list .score {
	  width: 120rpx;
	  height: 20rpx;
	  position: relative;
	}
	
	.mescroll-list .list .score-bg {
	  background-size: 100% 100%;
	  display: block;
	  height: 100%;
	  background-repeat: no-repeat;
	  background-size: auto 100%;
	}
	
	.mescroll-list .list .score-up {
	  position: absolute;
	  top: 0;
	  left: 0;
	  /* background-image: url(../../../../web/static/images/score_2.png); */
	}
	
	.mescroll-list .list .score-down {
	  /* background-image: url(../../../../web/static/images/score_1.png); */
	  width: 100%;
	}
	
	.mescroll-list .list .num {
	  font-size: 20rpx;
	  color: #5D5D5D;
	  margin-left: 14rpx;
	}
	
	.mescroll-list .list .small {
	  font-size: 24rpx;
	  color: #999;
	}
	
	.mescroll-list .list .small .address {
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	
	.mescroll-list .list .position>span:last-child {
	  margin-left: 10rpx;
	}
	
	.mescroll-list .list .position>span:nth-child(1) {
	  max-width: 240rpx;
	  display: -webkit-box;
	  -webkit-line-clamp: 1;
	  -webkit-box-orient: vertical;
	  overflow: hidden;
	}
	/*新门店列表*/
	.mescroll-list .list .text-box{margin-left:12px;width: calc(100% - 90px);}
	.mescroll-list .list{
	    border-radius: 8px;
	    margin: 6px 0;
	}
	.mescroll-list .list .img-box{
	    min-width: 78px;
	    height:78px;
	}
	.promotion-shop-box{
	    border-top: 1px solid #F1F1F1;
	}
	.promotion-shop{
	    font-size: 10px;
	    padding-top: 6px;
	}
	.promotion-shop .icon{
	    background: #FDF1ED;
	    color: #EB592D;
	    border-radius: 50%;
	    font-size: 10px;
	    width: 14px;
	    height: 14px;
	}
	.promotion-shop .shop-name{
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    height: 12px;
	    line-height: 12px;
	    font-size: 12px;
	    margin-left: 10px;
	}
	.promotion-shop .discount{
	    height: 13px;
	    line-height: 13px;
	    font-size: 13px;
	    color: #EB592D;
	}
	.promotion-shop .price{
	    height: 10px;
	    line-height: 10px;
	    font-size: 10px;
	    color: #999999;
	    text-decoration: line-through;
	}
	.margin-bottom-0{
	    margin-bottom: 0px!important;
	}
	.margin-bottom-22{
	    margin-bottom: 22px!important;
	}
	.mescroll-main{
	  width: 100%;
	}
	.shop_league_shop_group_industry-main {
	  position: absolute;
	  top: 80px;
	  height: 100%;
	  font-size: 0;
	  z-index: 10;
	}
	.shop-league-not{
	  padding: 30px 0 30px;
	  text-align: center;
	}
	.shop-league-not>image{
	  width: 170px;
	  height: 150px;
	  margin-bottom: 8px;
	}
	.shop-league-not .shop-league-text{
	  font-size: 13px;
	  color: #999;
	  line-height: 1;
	}
	/*商品列表start*/
	.mescroll-shop-list{
	  font-size: 0;
	  overflow: hidden;
	}
	.mescroll-shop-list .shop-list-new{
	  display: inline-block;
	  vertical-align: top;
	  background-color: #fff;
	  border-radius: 4px;
	  overflow: hidden;
	  width: calc(50% - 5px);
	  margin-right: 10px;
	  margin-bottom: 10px;
	}
	.mescroll-shop-list .shop-list-new:nth-child(2n){
	  margin-right: 0;
	}
	.mescroll-shop-list .shop-list-new .img-box{
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
	.mescroll-shop-list .shop-list-new .img-box .state{
	  height: 16px;
	  position: absolute;
	  left: 0;
	  top: 8px;
	}
	.mescroll-shop-list .shop-list-new .img-box .state .type{
	  line-height: 16px;
	  background: -webkit-linear-gradient(to right, #FF5050, #FF7700);
	  background: -moz-linear-gradient(to right, #FF5050, #FF7700);
	  background: linear-gradient(to right, #FF5050, #FF7700);
	  border-top-left-radius: 6px;
	  padding: 0 4px 0 6px;
	  font-size: 12px;
	  color: #fff;
	}
	.mescroll-shop-list .shop-list-new .img-box .state .num{
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
	.mescroll-shop-list .shop-list-new .text-box{
	  padding: 8px;
	  position: relative;
	}
	.mescroll-shop-list .shop-list-new .text-box .discount{
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
	.mescroll-shop-list .shop-list-new .text-box .name{
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
	.mescroll-shop-list .shop-list-new .text-box .store{
	  margin-top: 6px;
	  line-height: 1;
	}
	.mescroll-shop-list .shop-list-new .text-box .store image{
	  width: 12px;
	  height: 12px;
	}
	.mescroll-shop-list .shop-list-new .text-box .store .text{
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
	.mescroll-shop-list .shop-list-new .text-box .store .store-distance{
	  font-size: 12px;
	  color: #999;
	}
	.mescroll-shop-list .shop-list-new .text-box .price{
	  margin-top: 10px;
	  line-height: 1;
	  align-items: baseline;
	}
	.mescroll-shop-list .shop-list-new .text-box .price .now-price{
	  font-size: 17px;
	  color: #F24F4C;
	}
	.mescroll-shop-list .shop-list-new .text-box .price .now-price span{
	  font-size: 14px;
	}
	.mescroll-shop-list .shop-list-new .text-box .price .original_price{
	  margin-left: 4px;
	  font-size: 12px;
	  color: #999999;
	  text-decoration: line-through;
	}
	.mescroll-shop-list .shop-list-new .text-box .price .sold{
	  margin-left: 4px;
	  font-size: 12px;
	  color: #5D5D5D;
	}
	.mescroll-shop-list .shop-list-new .text-box .num{
	  font-size: 12px;
	  color: #5D5D5D;
	  line-height: 1;
	  margin-top: 8px;
	}
	.page-tab-list.new{
	  background-color: #f8f8f8;
	}
	.page-tab-list.new .list .arrow{
	  background-color: #f8f8f8;
	}
	/*商品列表end*/
</style>