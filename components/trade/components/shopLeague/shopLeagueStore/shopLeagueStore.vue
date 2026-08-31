<template>
	<view :style="'padding:'+datas.content.padding+'px 0;'">
			<view class="page-tab-main" v-if="datas.content.css_type == 1">
				<view class="page-tab-list flex-def flex-zAround flex-cCenter">
					<view class="list flex-def flex-cCenter flex-zCenter" :class="datas.content.show_industry_main?'avice skin-color-'+theme:''" @click="league_toggleIndustry">
						{{datas.content.industry_name}}<span :class="'arrow' + (datas.content.show_industry_main?'skin-bg-'+theme:'')"><image class="arrow_img" :src="http_host+'/shop_league/web/static/images/arrow_down.png'" /></span>
					</view>
					<view :class="'list ' + (datas.content.tab_sales?'skin-color-'+theme:'')" @click="league_salesFun">
						销量最高
					</view>
					<view :class="'list ' + (datas.content.tab_distance?'skin-color-'+theme:'')" @click="league_distanceFun">
						距离最近
					</view>
				</view>
				<!-- 头部分类弹窗 -->
				<view class="industry-main" v-if="datas.content.show_industry_main">
					<view class="industry-shadow"  @click="league_hideIndustry"></view>
					<view class="industry-content">
						<view class="list flex-def flex-zBetween flex-cCenter" v-for="(itm,index) in datas.content.industry_list" :data-id="itm.id" :data-name="itm.name" @click="league_industryFun" >
							<view :class="'name ' + (itm.id == datas.content.industry_type_1?'skin-color-'+theme:'')">{{itm.name}}</view>
							<view :class="'check-btn skin-bg-'+theme" v-if="itm.id == datas.content.industry_type_1">
								<image :src="http_host+'/shop_league/web/static/images/icon_check.png'" mode="widthFix"/>
							</view>
						</view>
					</view>
				</view>
				<view class="industry-main child" v-if="datas.content.show_industry_child">
					<view class="industry-shadow" @click="league_hideIndustry"></view>
					<view class="industry-content">
						<view class="list flex-def flex-zBetween flex-cCenter" v-for="(itm,index) in datas.content.industry_list_child" :data-id="itm.id" :data-name="itm.name" @click="league_industryFun">
							<view :class="'name ' + (itm.id == datas.content.industry_type?'skin-color-'+theme:'')">{{itm.name}}</view>
							<view :class="'check-btn skin-bg-'+theme" v-if="itm.id == datas.content.industry_type">
								<image :src="http_host+'/shop_league/web/static/images/icon_check.png'" mode="widthFix"/>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mescroll-main">
				<view class="mescroll-list">
					<view class="list flex-def flex-cCenter" v-for="(itm,indexs) in datas.content.dataset_default" v-if="datas.content.dataset_default.length > 0 || datas.content.add_type == 2 || datas.content.add_type == 3" @click="goUrl" :data-id="itm.id" :data-url="'/shop_league/pages/store/storeDetail/storeDetail?id='+itm.id">
						<view class="img-box flex-def flex-zCenter flex-cCenter"><image :src="itm.pic?itm.pic:''" mode="widthFix"></image></view>
						<view class="text-box flex-def flex-zTopBottom flex-zBetween">
							<p class="name">{{itm.name}}</p>
							<view class="center flex-def flex-cCenter">
								<view class="score">
									<span class="score-bg score-up" :style="'width:'+(itm.score/5)*100+'%;background-image: url('+http_host+'/shop_league/web/static/images/score_2.png)'"></span>
									<span class="score-bg score-down" :style="'background-image: url('+http_host+'/shop_league/web/static/images/score_2.png)'"></span>
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
						</view>
					</view>
					<view class="list flex-def" v-for="(itm,index1) in datas.content.dataset" v-if="datas.content.dataset.length > 0 && datas.content.add_type == 1" @click="goUrl" :data-id="itm.id" :data-url="'/shop_league/pages/store/storeDetail/storeDetail?id='+itm.id">
						<view class="img-box flex-def flex-zCenter flex-cCenter"><image :src="itm.pic?itm.pic:''" mode="widthFix"></image></view>
						<view class="text-box flex-def flex-zTopBottom flex-zBetween">
							<p class="name">{{itm.name}}</p>
							<view class="center flex-def flex-cCenter">
								<view class="score">
									<span class="score-bg score-up" :style="'width:'+(itm.score/5)*100+'%;background-image: url('+http_host+'/shop_league/web/static/images/score_2.png)'"></span>
									<span class="score-bg score-down" :style="'background-image: url('+http_host+'/shop_league/web/static/images/score_2.png)'"></span>
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
						</view>
					</view>
					<view v-if="datas.content.isLoading">
					  	<view class="shop-league-not" v-if="((datas.content.dataset.length == 0 || datas.content.add_type == 2 || datas.content.add_type == 3) && datas.content.dataset_default.length == 0) || (datas.content.dataset.length == 0 && datas.content.add_type == 1)">
	    				    <image :src="http_host+'/shop_league/web/view/images/jianshezhong.png'" mode="aspectFit" />
	    				    <view class="shop-league-text">门店即将开通入驻，敬请期待~</view>
	    				</view>  
					</view>
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		name: "shopLeagueStore",
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
			};
		},
		created() {
		},
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
			get_location: function () {
			  var that = this;
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
				  that.shop_league_obj.latitude = latitude;
				  that.shop_league_obj.longitude = longitude;
				  that.shop_league_obj.cache_position = position;
				  that.shop_league_get_list();
				},
				fail:function(res){
				  console.log('get_location_fail',res)
				  that.shop_league_get_list();
				},
			  })
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
			  that.datas.content.industry_type = id;
			  that.datas.content.industry_type_1 = id;
			  that.datas.content.industry_name = name
			  that.shop_league_get_list();
			  that.league_hideIndustry();
			},
			league_salesFun: function () {/*销量筛选切换*/
			  var that = this
			  that.datas.content.tab_sales = !that.datas.content.tab_sales;
			  that.datas.content.tab_distance = false;
			  that.datas.content.pageNum = 1;
			  that.shop_league_get_list();
			},
			league_distanceFun: function () {/*距离筛选切换*/
			  var that = this
			  that.datas.content.tab_sales = false;
			  that.datas.content.tab_distance = !that.datas.content.tab_distance;
			  that.datas.content.pageNum = 1;
			  that.shop_league_get_list();
		
			},
			// 获取数据
			shop_league_getdata: function () {
				var that = this
				that.datas.content.dataset_default = []; // 清除默认店铺列表数据
				//加载店铺列表
				if (that.shop_league_obj.cache_position) {//有缓存，使用缓存的定位加载数据
					that.shop_league_obj.latitude = that.shop_league_obj.cache_position.lat;
					that.shop_league_obj.longitude = that.shop_league_obj.cache_position.lng;
					that.shop_league_get_list();
				}
				//that.shop_league_obj = that.shop_league_obj.item_arr.push(that.datas);//先把item保存起来，等定位刷新再加载所有数据

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
			  console.log('定位数据',uni.getStorageSync("lbs"))
			  var has_lbs=uni.getStorageSync("lbs")
			  var that=this
			  if (has_lbs) {
			  
			  } else {
				var city_code = '';
			  }
			  //开启lbs定位组件的话，只显示当前城市的门店
			  var current_city = JSON.parse(uni.getStorageSync('current_city'))
			  if (!current_city) {
					//lbs定位未完成，500ms后重试
					setTimeout(function () {
					  that.shop_league_get_list();
					}, 500)
					return false;
			  } else {
					var city_code = current_city.area_code
			  }
			  var id = [];
			  if (that.datas.content.add_type == 1) {
				that.datas.content.dataset.forEach(function (itm, ind) {
				  id.push(itm.id);
				})
			  }
			  var search = {
				type: that.datas.content.industry_type,
				sales: that.datas.content.tab_sales,
				distance: that.datas.content.tab_distance,
				id: id,
				latitude: that.shop_league_obj.latitude,
				longitude: that.shop_league_obj.longitude,
				city_code: city_code,
				pagesize: -1,
			  };
			  if (that.datas.content.add_type == 3) {
				search.ishot = 1;
			  }
			  that.$common.requestData({
			  	url: '/shop_league/web/index.php?m=store&a=ajax_store_list',
			  	data: search,
			  	method: 'POST',
			  	needToken: true
			  }).then(res => {
				if (res.errcode == 0) {
					if (that.datas.content.add_type == 1) {
					  that.datas.content.dataset = [];
					} else {
					  that.datas.content.dataset_default = [];
					}
					res.data.data.forEach(function (itm, ind) {
					  var store = {
						"id": itm.id,
						"pic": itm.store_intro_img?itm.store_intro_img[0]:'',
						"name": itm.title,
						"score": itm.score,
						"price": itm.avg_price,
						"sold": itm.sale_num,
						"industry": itm.type_name,
						"position": itm.address,
						"distance": itm.distance
					  };
					  if (that.datas.content.add_type == 1) {
						that.datas.content.dataset.push(store);
					  } else {
						that.datas.content.dataset_default.push(store)
					  }
					})
					that.datas.content.isLoading = true
				}
				
			  });
			},
			goUrl: function (e) {
			  var id = e.currentTarget.dataset.id
			  var url = e.currentTarget.dataset.url
			  this.$common.diyLinkJump('/shop_league/web/index.php?m=store&a=store_detail&id='+id);
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

	.page-tab-main {
		height: 90rpx;
		position: relative;
		font-size: 0;
	}

	.page-tab-list {
		height: 90rpx;
		width: 100%;
		background-color: #fff;
		position: relative;
		/* z-index: 10; */
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
		background-color: #B2B2B2;
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
	
	.shop-league-not {
	    text-align: center;
	}
	
	.shop-league-not .shop-league-text {
	    font-size: 26rpx;
	    color: #999;
	    line-height: 1;
	}
</style>
