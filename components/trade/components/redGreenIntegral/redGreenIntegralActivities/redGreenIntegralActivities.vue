<template>
	<view
		:style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 0'+ (datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px'">
		<view class="svod-container">
			<u-sticky :offsetTop="titleHeight" :customNavHeight="titleHeight">
				<!-- 1/21 -->
				<view v-if="datas.content.css_type == 0||datas.content.css_type == 1" class="svod-title">
					<view class="svod-box display-flex">
						<view class="svod-list flex-1">
							<view v-for="(itm,index) in datas.content.dataset" @click='svod_nav($event)' :data-ind="index"
								:data-id="itm.selector_id" :data-count="itm.goods_count"
								:class="now_nav_index===index?'active skin-color-'+theme:''">
								<text
									style="max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{itm.select_value}}</text>
								<view :class="'line skin-bg-'+theme"></view>
							</view>
						</view>
						<view @click='svod_type()' :class="'svod-sort' + (!datas.content.type?'rotate':'')">
							<image :src="http_host+'/HTML/admui/public/custom/images/icon_jian_bottom.png'"></image>
						</view>
					</view>
					<view v-if="!datas.content.type" class="svod-box svod-box-btn">
						<view class="svod-data">
							<view @click='svod_nav($event)' :data-ind="index" :data-id="itm.selector_id" :data-count="itm.goods_count"
								v-for="(itm,index) in datas.content.dataset"
								:class="now_nav_index === index?'active skin-bg-'+theme:''">{{itm.select_value}}</view>
						</view>
					</view>
				</view>
				<!-- 1/21 -->
				<view v-if="datas.content.css_type == 2" class="svod-title" style="height:114rpx;">
					<view class="svod-box">
						<scroll-view id="scrollView" scroll-x="true" scroll-with-animation :scroll-left="slider.scrollLeft">
							<view class="svod-list" :style="`height:114rpx;width:${slider.width*tabListSlider.length}px`">
								<view v-for="(itm,index) in datas.content.dataset" :id="`tab_${index}`" @click='svod_nav($event)'
									:data-ind="index" :data-id="itm.selector_id" :data-count="itm.goods_count"
									:class="now_nav_index===index?'active skin-color-'+theme:''">
									<text v-if="!itm.title">{{itm.select_value}}</text>
									<text v-else>{{itm.title}}</text>
									<view><text :class="now_nav_index===index?'active skin-bg-'+theme:''">{{itm.vice_title}}</text></view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<!-- 1/21end -->
			</u-sticky>
	
			<view v-if="!datas.content.type" @click='svod_type()' class="svod-mask"></view>
			<!-- :style="`margin: 100rpx 0;min-height: ${window.height}px`" -->
			<view v-if="loading" :style="`margin: 100rpx 0;min-height: 1000rpx`">
				<u-loading-icon text="加载中" textSize="18"></u-loading-icon>
			</view>
			<view class="svod-content" v-if="goods_list.length > 0">
				<view class="display-flex">
					<view class="svod-ul-left svod-ul">
						<view @click="goDetail($event)" v-for="(itm,index) in goods_list" :data-id="itm.id" :data-index="index"
							v-if="(index + 1) % 2 != 0">
							<view class="svod-content-bg">
								<view class="svod-img display-flex">
									<image style="height:334rpx;" :src="itm.url"></image>
								</view>
							</view>
							<view style="height: 68rpx">
								<view class="svod-center">{{itm.pro_name}}</view>
							</view>
							<view class="svod-user display-flex">
								<view class="price">
									<text class="big_s">{{itm.act_price}}</text>
									<text class="big"> 元</text>
								</view>
								<view class="price2" v-if="datas.content.show_sale==1">{{itm.sale}} 人付款</view>
							</view>
							<view class="display-flex" style="justify-content: space-between;">
								<view class="sell-count1">{{itm.orgin_price}}</view>
								<view class="sell-count2"><u-tag text="包邮" plain size="mini" type="warning"></u-tag></view>
							</view>
						</view>
					</view>
					<view class="svod-ul-right svod-ul">
						<view @click="goDetail($event)" v-for="(itm,index) in goods_list" :data-id="itm.id" :data-index="index"
							v-if="(index + 1) % 2 == 0">
							<view class="svod-content-bg">
								<view class="svod-img display-flex">
									<image style="height:334rpx;" :src="itm.url"></image>
								</view>
							</view>
							<view style="height: 68rpx">
								<view class="svod-center">{{itm.pro_name}}</view>
							</view>
							<view class="svod-user display-flex">
								<view class="price">
									<text class="big_s">{{itm.act_price}}</text>
									<text class="big"> 元</text>
								</view>
								<view class="price2" v-if="datas.content.show_sale==1">{{itm.sale}} 人付款</view>
							</view>
							<view class="display-flex" style="justify-content: space-between;">
								<view class="sell-count1">{{itm.orgin_price}}</view>
								<view class="sell-count2"><u-tag text="包邮" plain size="mini" type="warning"></u-tag></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		name: "redGreenIntegralActivities",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				loading: false,
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				tabListSlider: [],
				slider: {
					left: 0,
					width: 0,
					scrollLeft: 0
				},
				monetary_unit: getApp().globalData.monetary_unit,
				goods_list: [], //商品数组
				now_nav_index: 0,
				now_group_id: -1, //分类id
				now_group_count: 1, //显示商品数量
				
				all_list: [],	//总数组
				last_key: 0,	//上次加载位置
				page_size: 20,	//每页多少数据
				total_count: 0,	//总数据
				can_load: false,	//是否可以加载 防止并发
				
				//吸顶高度，由于首页采用了自定义标题栏
				titleHeight:0,
			};
		},
		watch: {
			slider: {
				handler() {

				},
				deep: true
			}
		},
		created() {
			const that = this;
			that.now_group_id = that.datas.content.dataset[0].selector_id.split('-')[0]
			that.now_group_count = that.datas.content.dataset[0].goods_count
			that.get_goods()
			
			var indexHeadHeight = uni.getStorageSync('indexHeadHeight') || this.statusBarHeight+44;			
			//标题栏高度 再一点点高度4
			this.titleHeight = (indexHeadHeight-4) / 2;
		},
		
		mounted() {
			let that = this;
			
			setTimeout(function(){
				that.$nextTick(() => {
					that.calcScrollPosition();
				})
			},600)
			uni.$on('onReachBottom', () => {
				var key = that.last_key;
				var goods_list = that.goods_list;
				if(that.can_load==true&&that.last_key<that.total_count){
					that.can_load=false;
					for(var i=0; i<=that.page_size;i++){
						if(i<that.page_size&&that.last_key<that.total_count){
							goods_list.push(that.all_list[that.last_key])
							that.last_key = parseInt(that.last_key)+1;
						}
						if(i+1==that.page_size){
							that.goods_list = goods_list
							that.can_load = true
						}
					}
				}
				
			})
		},

		/**
		 * 组件的方法列表
		 */
		methods: {
			calcScrollPosition() {
				const query = uni.createSelectorQuery().in(this);

				query.select('#scrollView').boundingClientRect((res) => {
					this.scorll = res;
					this.updateTabWidth();
				}).exec();
			},
			updateTabWidth(index = 0) {
				let data = [...this.datas.content.dataset];

				if (data.length == 0) return false;

				const query = uni.createSelectorQuery().in(this);

				query.select('#tab_' + index).boundingClientRect((res) => {
					data[index]._slider = {
						width: res.width,
						left: res.left,
						scrollLeft: res.left - (data[index - 1] ? data[index - 1]._slider.width : 0),
					};
					this.tabListSlider = data
					if (this.now_nav_index == index) {
						this.tabToIndex(this.now_nav_index);
					}

					index++;
					if (data.length > index) {
						this.updateTabWidth(index);
					}
				}).exec();
			},
			tabToIndex(index) {
				let _slider = this.tabListSlider[index]._slider;
				let width = _slider.width;
				let scorll_left = this.scorll.left || 0;

				this.slider = {
					left: _slider.left - scorll_left + (_slider.width - width) / 2,
					width: width,
					scrollLeft: _slider.scrollLeft - scorll_left,
				}
			},
			// 切换tab样式
			svod_type() {
				const that = this;
				that.datas.content.type = !that.datas.content.type
			},
			// tab切换
			svod_nav(e) {
				const that = this;
				var id = e.currentTarget.dataset.id.split('-')[0]
				that.now_nav_index = e.currentTarget.dataset.ind
				this.tabToIndex(e.currentTarget.dataset.ind);
				that.now_group_id = id
				that.now_group_count = e.currentTarget.dataset.count
				that.get_goods();
			},
			// 获取商品数据
			get_goods() {
				var that = this
				var params = {
					'page[page]': 1,
					'page[page_size]': that.now_group_count,
					'order[sort]': 'desc',
					'search[act_id]': that.now_group_id,
				};
				this.goods_list = []
				this.all_list = []
				this.loading = true
				this.can_load=false;
				this.last_key = 0;
				var goods_list = this.goods_list;
				that.$common.requestData({
					url: '/red_green_integral/web/index.php?m=product&a=get_pro_list',
					data: params,
					method: "POST",
					needToken: true
				}).then(res => {
					this.loading = false
					if (res.errcode == 0) {
						//that.goods_list = res.data.pro
						that.all_list = res.data.pro				
						that.total_count = res.data.pro.length;	
						that.integral_name = res.data.config ? res.data.config.diy_integral_name : "积分"
						
						//加载第一页数据
						that.can_load = false;
						for(var i=0; i<that.page_size;i++){
						if(i<that.page_size&&that.last_key<that.total_count){
								goods_list.push(that.all_list[that.last_key])
								that.last_key = parseInt(that.last_key)+1;
							}
							if(i+1==that.page_size){
								that.goods_list = goods_list
								that.can_load = true
							}
						}
					} else {
						console.log('请求失败')
					}
				})

			},
			//跳转至商品详情页
			goDetail: function(e) {
				var id = e.currentTarget.dataset.id
				var index = e.currentTarget.dataset.index

				var prostr = JSON.stringify(this.goods_list[index])
				this.$cache.set('shop_pro_detail_' + id, prostr);
				var url = "/red_green_integral/web/index.php?m=product&a=pro_detail&id=" + id + '&customer_id=' + this
					.vuex_customer_id
				this.$common.diyLinkJump(url, "h5", true);
			}
		},
		computed:{
			//获取系统状态栏高度
			statusBarHeight(){
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight
			}
		}
	}
</script>

<style>
	/* 商品列表组件start */
	.display-flex {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}

	.flex-1 {
		-webkit-box-flex: 1;
		-ms-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		width: 50%;
	}

	.svod-container {
		position: relative;
		background-color: #fff;
	}

	.svod-title {
		width: 100%;
		position: relative;
		left: 0;
		top: 0;
		height: 76rpx;
		/* 1/29 */
		/* z-index: 10; */
	}

	.svod-box {
		font-size: 0;
		width: 100%;
		background-color: #fff;
		padding: 0 20rpx;
		box-sizing: border-box;
		box-shadow: -6rpx 2rpx 12rpx #e6e6e6;
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
		/* overflow-x: scroll; */
	}

	.svod-select {
		height: 76rpx;
		line-height: 76rpx;
		font-size: 26rpx;
		color: #333;
		padding-left: 10rpx;
	}

	.svod-sort {
		width: 76rpx;
	}

	.svod-sort>image {
		width: 26rpx;
		height: 26rpx;
		margin: 24rpx;
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
		padding: 0 10rpx;
		box-sizing: border-box;
		text-align: center;
		font-size: 0;
		/* 1/21 */
		color: #333;
		/* 1/28 */
		margin-right: 20rpx;
	}

	.svod-list>view>text {
		display: inline-block;
		position: relative;
		/* 1/21 */
		font-size: 30rpx;
		line-height: 1;
		padding: 26rpx 10rpx 12rpx;
		/* 1/28 */
		font-weight: 600;
	}

	.svod-list>view .line {
		display: none;
		width: 28rpx;
		height: 6rpx;
		border-radius: 1.5px;
		background-color: #FF0036;
		margin: 0 auto;
	}

	/* 1/21 */
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

	/* 1/21end */
	.svod-list>view.active {
		color: #FF0036;
	}

	.svod-list>view.active .line {
		display: block;
	}

	.svod-data {
		padding: 28rpx 28rpx 0;
	}

	.svod-data>view {
		display: inline-block;
		height: 25px;
		margin-bottom: 28rpx;
		margin-right: 20rpx;
		font-size: 26rpx;
		color: #5d5d5d;
		border-radius: 4px;
		background-color: #F5F5F5;
		line-height: 25px;
		text-align: center;
		padding: 0 28rpx;
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
		/* 1/29 */
		/* z-index: 9; */
	}

	/* 头部导航end */
	/* 商品列表start */
	.svod-content {
		/* 1/28 */
		padding: 28rpx;

		box-sizing: border-box;
		padding-top: 0;
	}

	.svod-content::-webkit-scrollbar {
		display: none;
	}

	.svod-content .svod-ul {
		font-size: 0;
		width: calc(50% - 10rpx);
	}

	/* 1/28 */
	.svod-content .svod-ul-left {
		margin-right: 24rpx;
	}

	.svod-content .svod-ul>view {
		margin-bottom: 44rpx;
	}

	.svod-content-bg {
		height: 380rpx;
		position: relative;
		border-radius: 8rpx;
		/* margin-bottom: 14rpx; */
		overflow: hidden;
		/* background: #FBFBFB; */
	}


	.svod-content-bg .svod-img {
		height: 100%;
		align-items: center;
		justify-content: center;
		border-radius: 8rpx;
	}

	.svod-content-bg .svod-img>image {
		max-width: 100%;
		max-height: 100%;
		width: 100%;
		border-radius: 8rpx;
	}

	.svod-center {
		font-size: 28rpx;
		color: #5d5d5d;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		/* 1/28 */
		word-break: break-all;
		font-weight: 500;
	}

	/* 标签 */
	.tag {
		margin-bottom: 10rpx;
	}

	.tag view {
		display: inline-block;
		color: #F36889;
		font-size: 20rpx;
		background: #FDE1E7;
		border-radius: 30rpx;
		padding: 0 5px;
		margin: 5px 5px 0px 0;
	}

	/* 标签end */
	/* 销量 */
	.xiaoliang {
		font-size: 22rpx;
		color: #999999;
	}

	/* 销量end */
	/* 价格 */
	.svod-user {
		color: #333;
		align-items: center;
		margin: 14rpx 0;
		justify-content: space-between;
		align-items: flex-end;
	}

	.svod-user .big {
		font-size: 24rpx;
	}

	.svod-user .big_s {
		font-size: 34rpx;
		color: #f24f4c;
		font-weight: bold;
	}

	/* 价格end */
	/* 商品列表end */
	/* 商品列表组件end */

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	::-webkit-scrollbar {
		display: none;
	}

	.sell-count1 {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
	}

	.sell-count2 {
		font-size: 24rpx;
		color: #999;
	}

	.price {}

	.price2 {
		font-size: 24rpx;
		color: #999;
	}
</style>