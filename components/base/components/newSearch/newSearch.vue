<template>
	<view>
		<!-- 导航栏 -->
		<!-- <navbar ref="navbar" :config="config" @clickBtn="onClickBtn" /> -->

		<!-- 状态栏和标题，必须是页面的第一个组件才启用 -->
		<view v-if="bar_style!=2&&indexs==0">
			<view class="searh-bar-top">
				<view :style="'height:' + statusBarHeight + 'px;' "></view>
				<view class="bar-title">
					<text class="bar-title-text">{{page_title}}</text>
				</view>
			</view>
			<!-- 占位 -->
			<view :style="'height:'+titleHeight+'px'"></view>
		</view>

		<view class="search-box"
			:style="'background-color:'+(bar_style!=2&&datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image:'+(bar_style!=2&&datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':bar_style!=2&&datas.content.select_bg_model==3?'url('+bg_img+')':'none')+';padding:'+(datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;')+';background-size:100% 100%;'+(bar_style==2?'position: relative;':'position: relative;')">

			<!-- #ifndef H5 -->
			<!-- 状态栏 -->
			<!-- <view v-if="bar_style==2" :style="'height:' + titleHeight + 'px;' "  ></view> -->
			<!-- #endif -->

			<view
				:class="'search-bar '+(datas.content.img_style == 2&&datas.content.select_style!=3?'flex-zRightLeft':'')">
				<view class="city" v-if="datas.content.select_style==3" @click="gotoLBS">
					<view :style="'color:'+(datas.content.location_color?datas.content.location_color:'#5d5d5d')">
						{{current_city?current_city:'北京市'}}</view>
					<view class="fa-angle-down"
						:style="'border-color: '+(datas.content.location_icon_color?datas.content.location_icon_color:'#b2b2b2')">
					</view>
				</view>
				<view style="height:24px;" v-if="(datas.content.shop_data_count&&datas.content.select_style!=3)"
					:class="(datas.content.img_style==1?'padding-right-10':'padding-left-10')">
					<view @click="gotoProType">
						<image :src="datas.content.icon_pic" alt="" mode="widthFix" style="width:24px;height:24px;" />
					</view>
				</view>
				<view
					:style="'overflow:hidden;border: '+((datas.content.border_style==2?datas.content.border_diy+'px solid'+datas.content.border_color:'none'))+';border-radius:'+(datas.content.radius_style==1?40:(datas.content.border_diy<5||datas.content.radius_diy<datas.content.border_diy)?datas.content.radius_diy:datas.content.radius_diy+datas.content.border_diy)+'px;background-color:'+(datas.content.border_style==2?datas.content.border_color:'transparent')"
					class="search-bar__form">
					<view class="input-box flex-one flex-def flex-cCenter"
						:style="'min-height: 35px;height: initial;position: relative;background-color: '+((datas.content.module_bg_color?datas.content.module_bg_color:'#F1F2F6'))+';justify-content:'+(datas.content.align_style==1?'center':'start')+';border-radius:'+(datas.content.radius_style==1?20:datas.content.radius_diy)+'px'"
						@click="bindsearch">
						<image class="margin-right-5" :src="search_icon_pic" alt="" mode="aspectFill"
							style="width:16px;height:16px;" />
						<view>
							{{datas.content.placeholder?datas.content.placeholder:'搜索'}}
						</view>
						<span v-if="datas.content.select_style==2"
							:style="'position: absolute;top: 0;right: 0;padding: 0 19px;height:100%;background-color: '+((datas.content.button_select_bg_model==1?datas.content.button_bg_color:'transparent'))+';background-image: '+((datas.content.button_select_bg_model==2?'linear-gradient('+datas.content.button_gradient_angle+','+datas.content.button_gradient_color1+','+datas.content.button_gradient_color2+')':'none'))+';color: '+((datas.content.button_color?datas.content.button_color:'#ffffff'))+';border-radius: '+((datas.content.button_radius_style==1?20:datas.content.radius_diy))+'px;'">搜索</span>
					</view>

				</view>
				<view style="height:24px;" v-if="datas.content.add_icon"
					:class="datas.content.img_style==2&&datas.content.select_style!=3?'padding-right-10':'padding-left-10'">
					<view v-if="datas.content.add_icon_type==1" @click="$common.diyLinkJump(datas.content.link)">
						<image :src="icon_pic2" alt="" mode="widthFix" style="width:24px;height:24px;" />
					</view>
					<view v-if="datas.content.add_icon_type==2" @click="back">
						<image :src="icon_pic2" alt="" mode="widthFix" style="width:24px;height:24px;" />
					</view>
				</view>
			</view>
			<!--定位弹窗start-->
			<!-- 	<view class="location-tips-box" v-if="showLocationPop">
				<view class="location-left">
					<view class="location-tips">打开位置开关，获取更多体验</view>
					<view class="open-bnt" :class="'skin-bg-' + theme" @click="get_location">立即打开</view>
				</view>
				<u-icon name="close" color="#ffffff" size="16" @click="showLocationPop = false"></u-icon>
			</view> -->
			<!--定位弹窗end-->

			<!--定位弹窗start-->
			<u-modal :show="showLocationPop" :showCancelButton="true" title="提示" @confirm="handlePopConfirm"
				@cancel="handleCancel">
				<view class="slot-content" style="text-align: center;color: #999999;">
					为了精准获取您附近的门店，我们希望获取您的地址位置信息权限
				</view>
			</u-modal>
			<!--定位弹窗end-->


		</view>
		<!-- 沉浸式头部搞个高度撑一下 -->
		<!-- <view v-if="bar_style==2&&indexs==0" :style="'height:' + currenctHeight + 'px;' "  ></view> -->

	</view>
</template>

<script>
	export default {
		name: "newSearch",
		props: {
			//数据
			datas: {
				type: Object,
				default: {}
			},
			//键名
			indexs: {
				type: Number,
				default: -1
			},
			//页面标题
			page_title: {
				type: String,
				default: '',
			},
			//状态栏类型 1：默认 2：沉浸式
			bar_style: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				showLocationPop: false,
				http_host: '',
				bg_img: '',
				search_icon_pic: '',
				icon_pic2: '',
				current_city: '',
				city_code: '',
				currenctHeight: 100,
				titleHeight: 0,
				isLocateAuth: false, //是否已授权定位
			};
		},
		mounted() {
			let that = this;
			var current_city = uni.getStorageSync('current_city') || [];
			var isLocateAuth = uni.getStorageSync('isLocateAuth') || false;
			if (current_city.length > 0) {
				that.current_city = JSON.parse(current_city).area_name
				that.city_code = JSON.parse(current_city).area_code
			} else {
				that.current_city = that.datas.content.city
				that.city_code = that.datas.content.city_code
			}
			that.http_host = this.vuex_apiUrl;

			if (this.datas.content.select_style == 3) {
				if (isLocateAuth == false) {
					//还没授权定位 
					this.showLocationPop = true;
				} else {
					if (that.current_city == '') {
						console.log("搜索组件的定位")
						this.get_location();
					}
					// uni.setStorageSync('lbs',true);
				}

			}

			// 因为解析不到域名，进行图片处理
			let bg_img = this.datas.content.bg_img
			let search_icon_pic = this.datas.content.search_icon_pic
			let icon_pic2 = this.datas.content.icon_pic2
			var reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/);
			that.bg_img = bg_img
			that.search_icon_pic = search_icon_pic
			that.icon_pic2 = icon_pic2
			if (!reg.test(bg_img)) {
				let img = that.http_host + '/' + bg_img;
				that.bg_img = img
			}

			if (!reg.test(search_icon_pic)) {
				let img = that.http_host + '/' + search_icon_pic;
				that.search_icon_pic = img
			}
			if (!reg.test(icon_pic2)) {
				let img = that.http_host + '/' + icon_pic2;
				that.icon_pic2 = img
			}

			setTimeout(function() {
				uni.createSelectorQuery().select('.search-box').boundingClientRect((rect) => {
					if (that.bar_style == 2) {
						that.currenctHeight = rect.height
						//缓存头部高度 给某些吸顶组件使用
						if (that.indexs == 0) {
							uni.setStorageSync('indexSearchHeight', that.currenctHeight)
						}
					}
				}).exec()
			}, 600)
			that.titleHeight = that.statusBarHeight + 44;
			//缓存头部高度
			if (that.bar_style != 2 && that.indexs == 0) {
				uni.setStorageSync('indexHeadHeight', that.titleHeight)
			}
		},
		activated: function() {
			var that = this;
			var current_city = uni.getStorageSync('current_city') || [];
			if (current_city.length > 0) {
				that.current_city = JSON.parse(current_city).area_name
				that.city_code = JSON.parse(current_city).area_code
			} else {
				that.current_city = that.datas.content.city
				that.city_code = that.datas.content.city_code
			}
		},
		methods: {
			// bindsearch(){
			// 	this.$common.diyLinkJump("/wsy_pub/web/index.php?m=app_index&a=search&tpl_id="+this.datas.diy_tem_contid+"&city_code="+this.city_code+"&keyword=","h5",true)
			// }

			gotoProType() {
				this.$common.diyLinkJump("/shop/mshop/web/index.php?m=product_type&a=index&customer_id=" + this
					.vuex_customer_id, "h5", true)
			},

			//跳到lbs
			gotoLBS: function() {
				console.log("定位")
				var pages = getCurrentPages();
				let currentPage = pages[pages.length - 1]['$page']['fullPath'] //当前页面路径(带参数)
				if (currentPage.charAt(0) != "/") {
					currentPage = "/" + currentPage;
				}
				uni.setStorageSync('lbsHistoryPage', currentPage)
				uni.navigateTo({
					url: '/public/pages/lbs/lbs',
				})
			},
			// 普通搜索页
			bindsearch: function() {
				var that = this;
				var tpl_id = that.datas.diy_tem_contid;
				var placeholder = that.datas.content.placeholder;
				var url = '/public/pages/search/search?tpl_id=' + tpl_id + '&placeholder=' + placeholder;
				var param = '';
				if (that.datas.content.select_style != 3) {
					//普通搜索
					if (that.datas.content.data_count) {
						var search_data_param = {
							'title': that.datas.content.title,
							'dataset': that.datas.content.dataset,
						};
						param = param + '&search_data=' + JSON.stringify(search_data_param);
					}
				} else {
					param += '&city_code=' + that.city_code;
					//地理搜索
					if (that.datas.content.data_count) {
						var search_data_param = {
							'title': that.datas.content.title,
							'dataset': that.datas.content.dataset,
						};
						param = param + '&search_data=' + JSON.stringify(search_data_param);
					}
				}
				uni.navigateTo({
					url: url + param,
				})

			},
			update_location() {
				var that = this;
				var current_city = uni.getStorageSync('current_city') || [];
				console.log('current_city',current_city);
				if (current_city.length > 0) {
					that.current_city = JSON.parse(current_city).area_name;
					that.city_code = JSON.parse(current_city).area_code;
				} else {
					that.current_city = that.datas.content.city
					that.city_code = that.datas.content.city_code
				}
			},
			//获取定位城市
			get_location: function() {
				var that = this;
				uni.showLoading({
					title: "获取定位中"
				})
				uni.getLocation({
					type: "wgs84",
					success(res) {
						var latitude = res.latitude
						var longitude = res.longitude
						var params = {
							type: 'mini_program',
							lat: latitude,
							lng: longitude
						}
						uni.setStorageSync("isLocateAuth", true)
						that.$api.publicGetLocation(params).then(data_res => {
							console.log('data_res',data_res);
							if (data_res.errcode == 0) {
								var city = {};
								city.area_code = data_res.result.area_code;
								city.area_name = data_res.result.city;
								uni.setStorageSync("current_city", JSON.stringify(city))
								that.update_location();
								that.$emit('handleCancel','newSearch')
								that.showLocationPop = false;
							}
						})
					},
					fail(err) {
						console.log("fail==", err)
						uni.showToast({
							title:'获取定位失败,缺少定位权限',
							icon:'none',
							duration: 3000
						})
						that.showLocationPop = false;
					},
					complete(err) {
						console.log("complete==", err)
						uni.hideLoading()
					}
				})
			},

			//返回上一层
			back() {
				uni.navigateBack({
					delta: 1, //返回层数，2则上上页
				})
			},
			handlePopConfirm() {
				this.get_location();
				// this.$emit('handleCancel','newSearch')
				// this.showLocationPop = false
			},
			handleCancel() {
				this.showLocationPop = false
			}
		},
		computed: {
			//获取系统状态栏高度
			statusBarHeight() {
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight
			},
			navbarHeight() {
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight + that.conf.height + 'px'
			},
			screenWidth() {
				return uni.getSystemInfoSync().screenWidth;
			}
		}
	}
</script>

<style>
	/* 搜索框 */
	.no-hover {
		background-color: transparent
	}

	.search-box {
		/* display: block;
	  position: relative;
	  z-index: 0;
	  flex: 1; */

		width: 100%;
		position: relative;
		/* overflow: hidden; */
		flex: 1;
		z-index: 99;
		/* height: 220rpx; */
	}

	.location-tips-box {
		position: absolute;
		top: 16rpx;
		right: 28rpx;
		z-index: 10000;
		width: 78%;
		background-color: rgb(0, 0, 0, .6);
		color: white;
		border-radius: 10rpx;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 10rpx;
	}

	.location-left {
		display: flex;
		align-items: center;
	}

	.open-bnt {
		background-color: #4965FB;
		border-radius: 10rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 15rpx;
		margin-left: 10rpx;
	}

	.search-bar {
		position: relative;
		display: flex;
		box-sizing: border-box;
		font-weight: normal;
		background-color: transparent;
		align-items: center;
		justify-content: center;
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
	.searh-bar-top {
		width: 100%;
		background-color: rgb(248, 248, 248);
		color: rgb(0, 0, 0);
		position: fixed;
		overflow: hidden;
		flex: 1;
		z-index: 100;
	}

	.bar-title {
		flex-direction: row;
		flex: 46;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		height: 88rpx;
		justify-content: center;
		align-items: center;
		text-align: center;
		text-overflow: ellipsis;
		line-height: 88rpx;
	}

	..bar-title-text {
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		font-size: 36rpx;
	}
</style>