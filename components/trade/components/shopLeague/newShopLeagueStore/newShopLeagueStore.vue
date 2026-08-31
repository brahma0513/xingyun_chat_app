<template>
	<view :style="'padding:'+datas.content.padding+'px 0px '+datas.content.padding_bottom+'px;'" >
		<!-- <u-popup :customStyle="{width:'80%',backgroundColor:'#ff0000',color:'#ffffff'}" :show="notifyShow" @close="notifyClose" @open="notifyOpen" mode="center">
			<view style="padding: 20rpx;">
				<text>为了精准获取您附近的门店，我们希望获取您的地址位置信息权限</text>
			</view>
		</u-popup> -->
		<!--弹窗start-->
	<!-- 	<u-modal :show="notifyShow" :showCancelButton="true" title="提示" 
		@confirm="handlePopConfirm" @cancel="handleCancel">
			<view class="slot-content" style="text-align: center;color: #999999;">
				为了精准获取您附近的门店，我们希望获取您的地址位置信息权限
			</view>
		</u-modal> -->
		<!--弹窗end-->
		<view class="page-tab-main" v-if="datas.content.css_type == 1">
			<view class="page-tab-list flex-def flex-zAround flex-cCenter">
				<view :class="'list flex-def flex-cCenter flex-zCenter '+(datas.content.show_industry_main?'avice skin-color-'+theme:'')" @click="league_toggleIndustry">
					{{datas.content.industry_name}}<span class="arrow"><image class="arrow_img" :src="http_host+'/shop_league/web/static/images/xia_jiantou.png'"></span>
				</view>
				<view :class="'list '+(datas.content.tab_sales?'skin-color-'+theme:'')" @click="league_salesFun">
					销量最高
				</view>
				<view :class="'list '+(datas.content.tab_distance?'skin-color-'+theme:'')" @click="league_distanceFun">
					距离最近
				</view>
			</view>
			<!-- 头部分类弹窗 -->
			<view class="industry-main" v-if="datas.content.show_industry_main">
				<view class="industry-shadow" @click="league_hideIndustry"></view>
				<view class="industry-content">
					<view class="list flex-def flex-zBetween flex-cCenter" v-for="(itm,index) in datas.content.industry_list" :data-id="itm.id" :data-name="itm.name" @click="league_industryFun">
						<span :class="'name '+(itm.id == datas.content.industry_type_1?'skin-color-'+theme:'')">{{itm.name}}</span>
						<span :class="'check-btn skin-bg-'+theme" v-if="itm.id == datas.content.industry_type_1">
							<image :src="http_host+'/shop_league/web/static/images/icon_check.png'" mode="widthFix"/>
						</span>
					</view>
				</view>
			</view>
			<view class="industry-main child" v-if="datas.content.show_industry_child">
				<view class="industry-shadow" @click="league_hideIndustry"></view>
				<view class="industry-content">
					<view class="list flex-def flex-zBetween flex-cCenter" v-for="(itm,idx) in datas.content.industry_list_child" :data-id="itm.id" :data-name="itm.name" @click="league_industryFun">
						<span :class="'name '+(itm.id == datas.content.industry_type?'skin-color-'+theme:'')">{{itm.name}}</span>
						<span :class="'check-btn skin-bg-'+theme" v-if="itm.id == datas.content.industry_type">
							<image :src="http_host+'/shop_league/web/static/images/icon_check.png'" mode="widthFix" >
						</span>
					</view>
				</view>
			</view>
		</view>
		<view class="mescroll-main" :style="'padding: 0px '+datas.content.padding_horizontal+'px;'">
			<view class="mescroll-list">
				<view class="list flex-def" v-for="(itm,idx) in datas.content.dataset_default" v-if="datas.content.dataset.length == 0 || datas.content.add_type == 2 || datas.content.add_type == 3" @click="goUrl('/shop_league/web/index.php?m=store&a=store_detail&id='+itm.id)">
					<view class="img-box flex-def flex-zCenter flex-cCenter"><image :src="itm.pic[0]" style="width:78px;height:78px" mode="aspectFill"/></view>
					<view class="text-box flex-def flex-zTopBottom flex-zBetween">
						<view class="flex-def flex-cCenter flex-zBetween">
			  <view class="name margin-bottom-0">{{itm.name}}</view>
			  <image v-if="itm.has_union_card" style="width:16px;height:16px" :src="http_host+'/shop_league/web/static/images/icon_vip@3x.png'"></image>
			</view>
						<view class="center flex-def flex-cCenter" :class="datas.content.draw_proportion&&itm.show_percentage?'margin-bottom-0':'margin-bottom-22'">
							<view class="score">
								<span class="score-bg score-up" :style="'width:'+(itm.score/5)*100+'%;background-image: url('+http_host+'/shop_league/web/static/images/score_2.png)'"></span>
								<span class="score-bg score-down" :style="'background-image: url('+http_host+'/shop_league/web/static/images/score_2.png)'"></span>
							</view>
							<view class="num">￥{{itm.price}}/人</view>
							<view class="num">已售{{itm.sold}}</view>
						</view>
						<view v-if="datas.content.draw_proportion&&itm.show_percentage" class="flex-def flex-cCenter new-trade100361-draw-proportion-box">
							<view class="new-trade100361-draw-proportion-icon">
								<image mode="aspectFill" :src="datas.content.draw_proportion_icon_pic" style="width:9px;height:9px;display:block;"></image>
							</view>
							<image class="new-trade100361-draw-proportion-bg" :src="http_host+'/shop_league/web/static/images/bg_new_trade100361_proportion.png'"></image>
							<view class="new-trade100361-draw-proportion-title">{{itm.show_percentage}}</view>
						</view>
						<view class="small flex-def flex-cCenter flex-zBetween">
							<view class="address">{{itm.industry}}</view>
							<view class="position flex-def">
								<span>{{itm.position}}</span>
								<span>{{itm.distance}}</span>
							</view>
						</view>
			<view class="promotion-shop-box" v-if="itm.main_push_product.length>0">
				<view class="promotion-shop flex-def flex-cEnd" v-for="(items,indexs) in itm.main_push_product" @click="goUrl('/shop_league/web/index.php?m=product&a=product_detail&store_id='+itm.id+'&id='+itm.pro_id)" :data-id="itm.id" :data-pid="items.pro_id">
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
				<view class="list flex-def" v-for="(itm,index1) in datas.content.dataset" v-if="datas.content.dataset.length > 0 && datas.content.add_type == 1" @click="goUrl('/shop_league/web/index.php?m=store&a=store_detail&id='+itm.id)">
					<view class="img-box flex-def flex-zCenter flex-cCenter"><image :src="itm.pic[0]" style="width:78px;height:78px" mode="aspectFill"/></view>
					<view class="text-box flex-def flex-zTopBottom flex-zBetween">
			<view class="flex-def flex-cCenter flex-zBetween">
			  <view class="name margin-bottom-0">{{itm.name}}</view>
			  <image v-if="itm.has_union_card" style="width:16px;height:16px" :src="http_host+'/shop_league/web/static/images/icon_vip@3x.png'"></image>
			</view>
						<view class="center flex-def flex-cCenter" :class="datas.content.draw_proportion&&itm.show_percentage?'margin-bottom-0':'margin-bottom-22'">
							<view class="score">
								<span class="score-bg score-up" :style="'width:'+(itm.score/5)*100+'%;background-image: url('+http_host+'/shop_league/web/static/images/score_2.png)'"></span>
								<span class="score-bg score-down" :style="'background-image: url('+http_host+'/shop_league/web/static/images/score_2.png)'"></span>
							</view>
							<view class="num">￥{{itm.price}}/人</view>
							<view class="num">已售{{itm.sold}}</view>
						</view>
						<view v-if="datas.content.draw_proportion&&itm.show_percentage" class="flex-def flex-cCenter new-trade100361-draw-proportion-box">
						    <image class="new-trade100361-draw-proportion-icon" :src="datas.content.draw_proportion_icon_pic"></image>
							<image class="new-trade100361-draw-proportion-bg" :src="http_host+'/shop_league/web/static/images/bg_new_trade100361_proportion.png'"></image>
							<view class="new-trade100361-draw-proportion-title">{{itm.show_percentage}}</view>
						</view>
						<view class="small flex-def flex-cCenter flex-zBetween">
							<view class="address">{{itm.industry}}</view>
							<view class="position flex-def">
								<span>{{itm.position}}</span>
								<span>{{itm.distance}}</span>
							</view>
						</view>
			<view class="promotion-shop-box" v-if="itm.main_push_product.length>0">
				<view class="promotion-shop flex-def flex-cEnd" v-for="(items,indexs) in itm.main_push_product" @click="goUrl('/shop_league/web/index.php?m=product&a=product_detail&store_id='+items.id+'&id='+items.pro_id)" :data-id="itm.id" :data-pid="items.pro_id">
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
					<view class="shop-league-not" v-if="((datas.content.dataset.length == 0 || datas.content.add_type == 2 || datas.content.add_type == 3) && datas.content.dataset_default.length == 0) || (datas.content.dataset.length == 0 && datas.content.add_type == 1)">
						<image :src="http_host+'/shop_league/web/view/images/jianshezhong.png'"/>
						<view class="shop-league-text">门店即将开通入驻，敬请期待~</view>
					</view>  
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "newShopLeagueStore",
		props: {
			datas: {
				type: Object,
				defaviewt: {},
				content:{
					dataset:[]
				},
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				shop_league_obj: {
					key: '',
					item_arr: [],
					latitude: '',
					longitude: '',
					get_position_ing: false,
					industry_list: [],
					cache_position: '',
				},
				page: 1,
				page_total: 1,
				page_size:20,
				notifyContent: '',
				notifyShow: false,
			};
		},
		created() {
			var that = this;
			this.http_host = this.vuex_apiUrl;
			var position = uni.getStorageSync('shop_league_position')
			that.requestPermission();
			uni.$on('scrollLowerComp', () => {
				console.log("触底")
				if (this.page >= this.page_total) {
					return;
				}
				uni.showLoading({
					title: '加载中'
				});
				this.page = this.page + 1;
				this.shop_league_get_list()
			})
		},
		mounted() {
		},
		methods: {
			//获取定位城市
			get_location: function (isLocate) {
				var that = this;
				console.log("定位的方法")
				if(isLocate==true){
					uni.showLoading({
						title: "定位中"
					})
					uni.getLocation({
						type: 'gcj02',
						success: function (res) {
						  var latitude = res.latitude
						  var longitude = res.longitude
						  var position = {
							lat: latitude,
							lng: longitude
						  }
						  uni.setStorageSync('shop_league_position', position)
						  uni.setStorageSync('isLocateAuth', true)
						  that.shop_league_obj.latitude = latitude;
						  that.shop_league_obj.longitude = longitude;
						  that.shop_league_obj.cache_position = position;
						  uni.hideLoading()
						  that.shop_league_get_list();
						},
						fail:function(res){
						  console.log('get_location_fail',res)
						  uni.getLocation({
								type: 'wgs84',
								success: function (res) {
								  var latitude = res.latitude
								  var longitude = res.longitude
								  var position = {
									lat: latitude,
									lng: longitude
								  }
								  uni.setStorageSync('shop_league_position', position)
								  uni.setStorageSync('isLocateAuth', true)
								  that.shop_league_obj.latitude = latitude;
								  that.shop_league_obj.longitude = longitude;
								  that.shop_league_obj.cache_position = position;
								  uni.hideLoading()
								  that.shop_league_get_list();
								},
								fail:function(res){
								  console.log('get_location_fail',res)
								  uni.showToast({
									title: "获取定位失败",
									icon: 'none'
								  })
								  uni.hideLoading()
								  that.shop_league_get_list();
								},
						  })
						},
					})
				}else{
					that.shop_league_get_list();
				}
			 
			},
			league_toggleIndustry: function () {/*显示分类弹窗*/
			  var that = this
			  if (that.datas.content.show_industry_main == false) {
				that.datas.content.show_industry_main = true;
			  } else {
				that.datas.content.show_industry_main = false;
			  }
			},
			league_hideIndustry: function () {/*隐藏分类弹窗*/
			  var that = this
			  that.datas.content.show_industry_main = false;
			  that.datas.content.show_industry_child = false;
			},
			league_industryFun: function (e) {
			  var that = this
			  console.log(e)
			  var url = e.currentTarget.dataset.url
			  console.log(url)
			  var id = e.currentTarget.dataset.id
			  var name = e.currentTarget.dataset.name
			  that.datas.content.dataset = [];
			  that.datas.content.dataset_default = [];
			  that.datas.content.industry_type = id;
			  that.datas.content.industry_type_1 = id;
			  that.datas.content.industry_name = name
			  that.shop_league_get_list();
			  that.league_hideIndustry();
			},
			league_salesFun: function () {/*销量筛选切换*/
			  var that = this
			  that.datas.content.dataset = [];
			  that.datas.content.dataset_default = [];
			  that.datas.content.tab_sales = !that.datas.content.tab_sales;
			  that.datas.content.tab_distance = false;
			  that.datas.content.pageNum = 1;
			  that.shop_league_get_list();
			},
			league_distanceFun: function () {/*距离筛选切换*/
			  var that = this
			  that.datas.content.dataset = [];
			  that.datas.content.dataset_default = [];
			  that.datas.content.tab_sales = false;
			  that.datas.content.tab_distance = !that.datas.content.tab_distance;
			  that.datas.content.pageNum = 1;
			  that.shop_league_get_list();
		
			},
			// 获取数据
			shop_league_getdata: function (isLocate) {
				var that = this
				that.datas.content.dataset_default = []; // 清除默认店铺列表数据
				//加载店铺列表
				if (that.shop_league_obj.cache_position) {//有缓存，使用缓存的定位加载数据
					that.shop_league_obj.latitude = that.shop_league_obj.cache_position.lat;
					that.shop_league_obj.longitude = that.shop_league_obj.cache_position.lng;
					console.log("通过缓存查门店")
					that.shop_league_get_list();
				}
				console.log("开始定位")
				that.get_location(isLocate)
				that.shop_league_obj.item_arr=that.datas

				//加载分类列表
				if (that.shop_league_obj.industry_list&&that.shop_league_obj.industry_list.length > 0) {
					that.datas.content.industry_list = that.datas.content.industry_list.concat(that.shop_league_type_list_format(that.shop_league_obj.industry_list));
				} else {
					var request_data = {
						status: 1,
						level: 1,
						page: -1,
					}
					that.$common.requestData({
						url: '/shop_league/web/index.php?m=store&a=ajax_store_type_list',
						data: request_data,
						method: 'POST',
						needToken: true
					}).then(res => {
						if (res.errcode == 0) {
						  that.shop_league_obj.industry_list = res.data.list
						  that.datas.content.industry_list = that.datas.content.industry_list.concat(that.shop_league_type_list_format(res.data.list));
						}
					});
				}
			},
			shop_league_type_list_format:function(list){
				var that = this
				if(list == null || list == undefined || list.length <= 0){
					return [];
				}
				var res = [];
				list.forEach(function (itm, ind) {
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
			shop_league_get_list: function () {
			  var has_lbs=uni.getStorageSync("lbs")
			  var that=this
			  console.log("加载门店数据")
			  var city_code = '';
			  //开启lbs定位组件的话，只显示当前城市的门店
			  if(uni.getStorageSync('current_city')){
				  var current_city = JSON.parse(uni.getStorageSync('current_city'))
				  if (!current_city) {
						//lbs定位未完成，500ms后重试
						setTimeout(function () {
						  that.shop_league_get_list();
						}, 500)
						return false;
				  } else {
						city_code = current_city.area_code
				  }
			  }

			  console.log("查询门店的经纬度",that.shop_league_obj.latitude+','+that.shop_league_obj.longitude)
			  var id = [];
			  if (that.datas.content.add_type == 1) {
				that.datas.content.dataset.forEach(function (itm, ind) {
				  id.push(itm.id);
				})
			  }
			  var search = {
					type: that.datas.content.industry_type_1,
					sales: that.datas.content.tab_sales,
					distance: that.datas.content.tab_distance,
					id: id,
					latitude: that.shop_league_obj.latitude,
					longitude: that.shop_league_obj.longitude,
					city_code: city_code,
					page:that.page,
					pagesize: that.page_size
			  };
			  if (that.datas.content.add_type == 3) {
				search.ishot = 1;
			  }
			  if(!that.datas.content.mem_card) {
				  search.check_union_card = 0;
			  }
			  that.$common.requestData({
			  	url: '/shop_league/web/index.php?m=store&a=ajax_store_list',
			  	data: search,
			  	method: 'POST',
			  	needToken: true
			  }).then(res => {
				if (res.errcode == 0) {
					let list = [];
					if (that.datas.content.add_type == 1) {
					  list = that.datas.content.dataset;
					  that.datas.content.dataset = [];
					} else {
					  list = that.datas.content.dataset_default;	
					  that.datas.content.dataset_default = [];
					}
					that.page_total = res.data.total_page;
					res.data.data.forEach(function (itm, ind) {
						itm.main_push_product.forEach((items)=>{
							if(items.plat_discount_type==2){
								if(((items.price*items.plat_discount)/10)>0.01){
									items.price=((items.price*items.plat_discount)/10).toFixed(2).toString()
								}else{
									items.price=0.01
								}
							}
					    })
									  
						var store = {
							"id": itm.id,
							"pic": itm.store_intro_img,
							"name": itm.title,
							"score": itm.score,
							"price": itm.avg_price,
							"sold": itm.sale_num,
							"industry": itm.type_name,
							"position": itm.address,
							"distance": itm.distance,
							"main_push_product":itm.main_push_product,
							"has_union_card":itm.has_union_card,
							"show_percentage":itm.show_percentage
						};
						if (that.datas.content.add_type == 1) {
							that.datas.content.dataset.push(store);
						} else {
							that.datas.content.dataset_default.push(store)
						}
					})
					if (that.datas.content.add_type == 1) {
						that.datas.content.dataset = [...list, ...that.datas.content.dataset];
					} else {
						that.datas.content.dataset_default = [...list, ...that.datas.content
							.dataset_default
						];
					}
					that.datas.content.isLoading = true
					uni.hideLoading();
				}else{
					that.datas.content.dataset = [];
					that.datas.content.dataset_default = [];
				}
				
			  });
			},
			goUrl: function (e) {
			  this.$common.diyLinkJump(e);
			},
			notifyClose(){
				
			},
			notifyOpen(){
				
			},
			requestPermission() {
				var _this = this;
				
				//是否已经获取权限
				var isLocateAuth = uni.getStorageSync('isLocateAuth') || false;
				console.log("是否已获得定位权限",isLocateAuth)

				if(isLocateAuth==false){
					_this.notifyShow = true
					_this.get_location(true)
				}else{
					_this.shop_league_getdata(true)
				}
				return true;
			},
			handlePopConfirm(){
				this.notifyShow = false
				this.shop_league_getdata(true)
			},
			handleCancel(){
				this.notifyShow = false
				this.shop_league_getdata(false)
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
	.shop-league-not{
		display: flex;
		padding: 20px 0 30px;
		text-align: center;
		align-items: center;
		flex-flow: column;
	}
	.shop-league-not image{
	  width: 170px;
	  height: 170px;
	  margin-bottom: 8px;
	}
	.shop-league-text{
	  font-size: 13px;
	  color: #999;
	  line-height: 1;
	}
	
	.new-trade100361-draw-proportion-box{
		position: relative;
		font-size: 10px;
		color: #FF384B;
		/* width: 60px; */
		height: 14px;
		line-height: 14px;
		border-radius: 4px;
		/* background: #FAEDB8; */
		margin: 4px 0;
	}
	
	.new-trade100361-draw-proportion-box .new-trade100361-draw-proportion-icon{
		position: relative;
		z-index: 2;
		width: 9px;
		height: 9px;
		margin: 0 8px 0 5px;
	}
	
	.new-trade100361-draw-proportion-box .new-trade100361-draw-proportion-bg{
		position: absolute;
		top: 0;
		left: 0;
		width: 22px;
		height: 14px;
		z-index: 1;
		background: #FAEDB8;
	}
	
	.new-trade100361-draw-proportion-box .new-trade100361-draw-proportion-title{
		border-radius: 0 4px 4px 0;
		padding: 0 5px 0 0;
		background: #FAEDB8;
	}
	
</style>
