<template>
	<view v-if="is_open"
		:style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+ ( datas.content.select_bg_model==2? 'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':(datas.content.select_bg_model==3? 'url('+datas.content.bg_img+')':'none')) +';padding:'+datas.content.padding_top+'px '+(datas.content.select_style==1?datas.content.padding_horizontal:'0')+'px '+datas.content.padding_bottom+'px;'">
		<block v-if=" datas.content.select_style==3 ">
			<scroll-view scroll-x="true" class="swiper-list"
				:style="'border-radius:'+(datas.content.image_style==2?datas.content.radius_diy:'0')+'px;'">
				<block v-for="(item,index) in datasetlist">
					<view class="list" :style="'margin-left: '+(index==0?datas.content.padding_left:0)+'px;'">
						<navigator hover-class="no-hover" @click="goUrl(item)" :url="item.sel_link_type==2||item.sel_link_type==3? '':item.mini_url" open-type="navigate">
							<image :data-src="item.image" @load="setContainerHeight" mode="widthFix"
								:style="'height: '+(height>0? height+'px':'auto')+';border-radius:'+(datas.content.image_style==2?datas.content.radius_diy:'0')+'px;'"
								:src="item.image" class="slide-image" lazy-load />
						</navigator>
					</view>
				</block>
			</scroll-view>
		</block>
		<block v-else>
			<block v-if="datas.content.css_type == 1">
				<view class='custom-swiper'
					:style="'border-radius:'+(datas.content.image_style==2?datas.content.radius_diy:'0')+'px;'">
					<swiper :style="'height: '+(height - datas.content.padding_horizontal*2)+'px;'"
						:indicator-dots="datas.content.banner_style==2||datas.content.banner_style==3?false:true"
						indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff" :autoplay="true"
						:circular="true" :current="swiperCurrent" @animationfinish="swiperChange">
						<block style="position:relative;" v-for="(item,index) in datasetlist" :key="index">
							<swiper-item>
								<navigator hover-class="no-hover" @click="goUrl(item)"
								:url="item.sel_link_type==2||item.sel_link_type==3? '':item.mini_url"
									open-type="navigate" class="flex-def flex-cCenter">
									<image :data-src="item.image" @load="setContainerHeight" :data-ind="index"
										mode="widthFix"
										:style="'height: '+(list[index]>0?list[index]+'px':'auto')+';border-radius:'+(datas.content.image_style==2?datas.content.radius_diy:'0')+'px;'"
										:src="item.image" class="slide-image" lazy-load />
								</navigator>
								<!-- 左边图标 -->
								<view v-if="datas.content.banner_style==2" class="swiper-style-left-2"
									@click='swiperLeft' :data-list="datasetlist">
									<image class="right"
										:src="http_host+'/wsy_pub/web/static/images/left_swiper.png'" />
								</view>
								<!-- 右边图标 -->
								<view v-if="datas.content.banner_style==2" class="swiper-style-right-2"
									@click="swiperRight" :data-list="datasetlist">
									<image class="right"
										:src="http_host+'/wsy_pub/web/static/images/right_swiper.png'" />
								</view>
								<view v-if="datas.content.banner_style==3&&datasetlist.length>0"
									class="swiper-style-3 flex-def flex-cCenter flex-zCenter">
									{{index+1}}/{{datasetlist.length}}
								</view>
							</swiper-item>
						</block>
					</swiper>
				</view>
			</block>
			<block v-else-if="datas.content.css_type == 2">
				<view class='custom-swiper'
					:style="'border-radius:'+(datas.content.image_style==2?datas.content.radius_diy:'0')+'px;'">
					<block v-for="item in  datasetlist">
						<view class='swiper-img' :style="'margin-bottom: '+datas.content.margin+'px;'">
							<navigator hover-class="no-hover"
							 :url="item.sel_link_type==2||item.sel_link_type==3? '':item.mini_url"
							 @click="goUrl(item)" open-type="navigate">
								<image :data-src="item.image" mode="widthFix" :data-test="item.image" :src="item.image"
									lazy-load
									:style="'border-radius:'+datas.content.image_style==2?datas.content.radius_diy:'0'+'px;'" />
							</navigator>
						</view>
					</block>
				</view>
			</block>
		</block>
	</view>
</template>

<script>
	export default {
		name: "shopLeagueSwiper",
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
			};
		},
		created() {},
		mounted() {
			var that = this;
			this.http_host = this.vuex_apiUrl;
			var position = uni.getStorageSync('shop_league_position')
			if (position) {
				that.shop_league_obj.latitude = position.lat;
				that.shop_league_obj.longitude = position.lng;
				that.shop_league_obj.cache_position = position;
			} else {
				that.get_location()
			}
			that.shop_league_getdata()
			console.log(this.datas.content.dataset)
		},
		methods: {
			//获取定位城市
			get_location: function() {
				var that = this;
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						var latitude = res.latitude
						var longitude = res.longitude
						var position = {
							lat: latitude,
							lng: longitude
						}
						uni.setStorageSync('shop_league_position', position)
						that.shop_league_obj.latitude = latitude;
						that.shop_league_obj.longitude = longitude;
						that.shop_league_obj.cache_position = position;
						that.shop_league_get_list();
					},
					fail: function(res) {
						console.log('get_location_fail', res)
						that.shop_league_get_list();
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
				console.log(e)
				var url = e.currentTarget.dataset.url
				console.log(url)
				var id = e.currentTarget.dataset.id
				var name = e.currentTarget.dataset.name
				that.datas.content.industry_type = id;
				that.datas.content.industry_type_1 = id;
				that.datas.content.industry_name = name
				that.shop_league_get_list();
				that.league_hideIndustry();
			},
			league_salesFun: function() {
				/*销量筛选切换*/
				var that = this
				that.datas.content.tab_sales = !that.datas.content.tab_sales;
				that.datas.content.tab_distance = false;
				that.datas.content.pageNum = 1;
				that.shop_league_get_list();
			},
			league_distanceFun: function() {
				/*距离筛选切换*/
				var that = this
				that.datas.content.tab_sales = false;
				that.datas.content.tab_distance = !that.datas.content.tab_distance;
				that.datas.content.pageNum = 1;
				that.shop_league_get_list();

			},
			// 获取数据
			shop_league_getdata: function() {
				var that = this
				//加载店铺列表
				if (that.shop_league_obj.cache_position) { //有缓存，使用缓存的定位加载数据
					that.shop_league_obj.latitude = that.shop_league_obj.cache_position.lat;
					that.shop_league_obj.longitude = that.shop_league_obj.cache_position.lng;
					that.shop_league_get_list();
				}
				//that.shop_league_obj = that.shop_league_obj.item_arr.push(that.datas);//先把item保存起来，等定位刷新再加载所有数据
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
			shop_league_get_list: function() {
				console.log('定位数据', uni.getStorageSync("lbs"))
				var has_lbs = uni.getStorageSync("lbs")
				var that = this
				if (has_lbs) {

				} else {
					var city_code = '';
				}
				//开启lbs定位组件的话，只显示当前城市的门店
				var current_city = JSON.parse(uni.getStorageSync('current_city'))
				if (!current_city) {
					//lbs定位未完成，500ms后重试
					setTimeout(function() {
						that.shop_league_get_list();
					}, 500)
					return false;
				} else {
					var city_code = current_city.area_code
				}
				that.$common.requestData({
					url: '/shop_league/web/index.php?m=advertis_image&a=get_image',
					data: {
						city_code: city_code
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						that.is_open = res.data.is_open;
						that.datasetlist = res.data.image_data;
					}
				});
			},
			goUrl: function(e) {
				// console.log(e);
				// var id = e.currentTarget.dataset.id
				// var url = e.currentTarget.dataset.url
				this.$common.diyLinkJump(e.h5_url);
			},
			setContainerHeight: function(e) {
				const that = this
				let ind = e.currentTarget.dataset.ind ? e.currentTarget.dataset.ind : 0;
				var imgWidth = e.detail.width;
				var imgHeight = e.detail.height;
				var sysInfo = uni.getSystemInfoSync();
				var screenWidth = sysInfo.screenWidth;
				var scale = screenWidth / imgWidth;
				var height = imgHeight * scale;
				this.$set(this.list, ind, height);
				that.height = that.list[that.swiperCurrent]
			},
			// 轮播图改变事件
			swiperChange: function(e) {
				if (e.detail.current == 0) {
					let swiperError = this.swiperError
					swiperError += 1
					this.swiperError = swiperError
					if (swiperError >= 3) {
						console.error('开关', this.swiperError)
						this.swiperCurrent = this.swiperCurrent
						this.swiperError = 0
					}
				} else {
					this.swiperCurrent = e.detail.current;
					this.swiperError = 0
				}
				// this.height = this.list[e.detail.current]
			},
			//点击右边小箭头
			swiperRight: function(e) {
				var index = this.swiperCurrent,
					list = []
				list = e.currentTarget.dataset.list
				if (index >= list.length - 1) {
					index = 0
				} else {
					index = index + 1
				}
				this.swiperCurrent = index
			},
			// 点击左边小箭头
			swiperLeft: function(e) {
				var index = this.swiperCurrent,
					list = []
				list = e.currentTarget.dataset.list
				if (index < 1) {
					index = list.length - 1
				} else {
					index = index - 1
				}
				this.swiperCurrent = index
			},
		},
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

	.no-hover {
		background-color: transparent
	}

	.custom-swiper {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}

	.custom-swiper swiper {
		height: 375rpx;
		width: 100%;
		font-size: 0;
		/* transition: height 0.2s;
	  -webkit-transition: height 0.2s; */
	}

	.custom-swiper swiper.height {
		height: 260.4rpx !important;
	}

	.custom-swiper swiper-item image {
		width: 100%;
		height: 375rpx;
	}

	.custom-swiper swiper-item image.height {
		height: 260.4rpx !important;
	}

	.custom-swiper .swiper-img {
		font-size: 0;
	}

	.custom-swiper .swiper-img:nth-last-child(1) {
		margin-bottom: 0 !important;
	}

	.custom-swiper .swiper-img image {
		width: 100%;
		height: 375rpx;
	}

	.custom-swiper .swiper-img image.height {
		height: 260.4rpx;
	}

	.custom-swiper .swiper-style-3 {
		background: rgba(27, 27, 27, 0.2);
		width: 43px;
		height: 19px;
		border-radius: 10px;
		position: absolute;
		bottom: 10px;
		right: 10px;
		color: #fff;
		font-size: 14px;
		z-index: 999;
	}

	.custom-swiper .right {
		width: 20px;
		height: 20px;
	}

	.custom-swiper .swiper-style-right-2 {
		position: absolute;
		right: 7px;
		top: 43%;
	}

	.custom-swiper .swiper-style-left-2 {
		position: absolute;
		left: 7px;
		top: 43%;
	}

	.swiper-list {
		box-sizing: border-box;
		white-space: nowrap;
		width: 100%;
	}

	.swiper-list .list {
		margin-right: 8px;
		width: 334px;
		display: inline-block;
		vertical-align: middle;
		font-size: 0;
	}

	.swiper-list .list:nth-last-child(1) {
		margin-right: 0;
	}

	.swiper-list .list image {
		width: 334px;
	}
</style>