<template>
	<!--商品分组start-->
	<view :style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 0'+ (datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px'">
	    <view class="svod-container">
			<u-sticky :offsetTop="titleHeight" :customNavHeight="titleHeight">
				<!-- 1/21 -->
				<view v-if="datas.content.css_type == 0||datas.content.css_type == 1" class="svod-title">
					<view class="svod-box" style="height:100rpx">						
						<scroll-view id="scrollView" scroll-x="true" scroll-with-animation :scroll-left="slider.scrollLeft">
							<view class="svod-list" :style="`width:${slider.width*tabListSlider.length}px`">
								<view v-for="(itm,index) in datas.content.dataset" :id="`tab_${index}`" @click='svod_nav($event)' :data-ind="index" :data-id="itm.selector_id" :data-count="itm.goods_count"
					yun			   
									:class="now_nav_index===index?'active skin-color-'+theme:''">
									<text style="max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{itm.select_value}}</text>
									<view :class="'line skin-bg-'+theme"></view>
								</view>
							</view>
						</scroll-view>
						
						<view @click='svod_type()' :class="'svod-sort' + (!datas.content.type?'rotate':'')">
							<image :src="http_host+'/HTML/admui/public/custom/images/icon_jian_bottom.png'"></image>
						</view>
					</view>
					<view v-if="!datas.content.type" class="svod-box svod-box-btn">
						<view class="svod-data">
							<view @click='svod_nav($event)' :data-ind="index" :data-id="itm.selector_id" :data-count="itm.goods_count" v-for="(itm,index) in datas.content.dataset"
								
								:class="now_nav_index === index?'active skin-bg-'+theme:''">{{itm.select_value}}</view>
						</view>
					</view>
				</view>
				<!-- 1/21 -->
				<view v-if="datas.content.css_type == 2" class="svod-title" style="height:114rpx;">
					<view class="svod-box">
						<scroll-view id="scrollView" scroll-x="true" scroll-with-animation :scroll-left="slider.scrollLeft">
							<view class="svod-list" :style="`height:114rpx;width:${slider.width*tabListSlider.length}px`">
								<view v-for="(itm,index) in datas.content.dataset" :id="`tab_${index}`" @click='svod_nav($event)' :data-ind="index" :data-id="itm.selector_id" :data-count="itm.goods_count"
									
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
	        
			<view v-if="loading" :style="`margin: 100rpx 0;min-height: 1000rpx`">
				<u-loading-icon text="加载中" textSize="18"></u-loading-icon>
			</view>
			
			<view class="svod-content" v-if="goods_list.length > 0">
	            <view class="display-flex">
	                <view class="svod-ul-left svod-ul">
	                    <view @click="goDetail($event)" v-for="(itm,index) in goods_list" :data-id="itm.id"  :data-index="index"
	                        v-if="(index + 1) % 2 != 0">
	                        <view class="svod-content-bg">
	                            <view class="svod-img display-flex">
	                                <image style="height:334rpx;" :src="itm.url"></image>
	                            </view>
	                        </view>
	                        <view class="svod-center">{{itm.name}}</view>
	                        <!-- 标签 -->
							<view class="price-box">{{itm.tagList[0]}}</view>
	                        <!-- <view class="tag display-flex" v-if="itm.tagList&&itm.tagList.length>0&&datas.content.goods_tag==1">
	                            <view v-for="(item,idx) in itm.tagList" v-if="idx < 2">{{item}}</view>
	                        </view> -->
							<view class="tag display-flex" v-if="itm.tagList&&itm.tagList.length>0&&datas.content.goods_tag==1">
							    <view class="tag-item" v-for="(item,idx) in itm.tagList" v-if="idx > 0">
									<view class="label">{{item.split(':')[0]}}</view>
									<view class="num">{{item.split(':')[1]}}</view>
								</view>
							</view>
	                        <!-- 标签end -->
	                        <!-- <view class="svod-user display-flex">
	                            <view class="price">
	                                <text class="big">{{monetary_unit}}</text>
	                                <text class="big_s">{{itm.priceA}}</text>
	                                <text class="big">{{itm.priceB}}</text>
	                            </view>
	                        </view> -->
	                        <view class="xiaoliang" v-if="datas.content.show_sale==1">{{itm.sell_count}} 人付款</view>
	                    </view>
	                </view>
	                <view class="svod-ul-right svod-ul">
	                    <view @click="goDetail($event)" v-for="(itm,index) in goods_list" :data-id="itm.id"  :data-index="index" 
	                        v-if="(index + 1) % 2 == 0">
	                        <view class="svod-content-bg">
	                            <view class="svod-img display-flex">
	                                <image style="height:334rpx;" :src="itm.url"></image>
	                            </view>
	                        </view>
	                        <view class="svod-center">{{itm.name}}</view>
	                        <!-- 标签 -->
							<view class="price-box">{{itm.tagList[0]}}</view>
							<!-- <view class="tag display-flex" v-if="itm.tagList&&itm.tagList.length>0&&datas.content.goods_tag==1">
							    <view v-for="(item,idx) in itm.tagList" v-if="idx < 2">{{item}}</view>
							</view> -->
							<view class="tag display-flex" v-if="itm.tagList&&itm.tagList.length>0&&datas.content.goods_tag==1">
							    <view class="tag-item" v-for="(item,idx) in itm.tagList" v-if="idx > 0">
							    	<view class="label">{{item.split(':')[0]}}</view>
							    	<view class="num">{{item.split(':')[1]}}</view>
							    </view>
							</view>
	                        <!-- <view class="tag display-flex" v-if="itm.tagList&&itm.tagList.length>0&&datas.content.goods_tag==1">
	                            <view v-for="(item,idx) in itm.tagList">{{item}}</view>
	                        </view> -->
	                        <!-- 标签end -->
	                        <!-- <view class="svod-user display-flex">
	                            <view class="price">
	                                <text class="big">{{monetary_unit}}</text>
	                                <text class="big_s">{{itm.priceA}}</text>
	                                <text class="big">{{itm.priceB}}</text>
	                            </view>
	                        </view> -->
	                        <view class="xiaoliang" v-if="datas.content.show_sale==1">{{itm.sell_count}} 人付款</view>
	                    </view>
	                </view>
	            </view>
	        </view>
	    </view>
	</view>
	<!--商品分组end-->
</template>

<script>
	export default {
		name:"bainonghuiShopGroup",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {
				loading: false,
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				monetary_unit: getApp().globalData.monetary_unit,
				goods_list: [],//商品数组
				now_nav_index: 0,
				now_group_id: -1,//分类id
				now_group_count: 1,//显示商品数量
				tabListSlider: [],
				slider: {
					left: 0,
					width: 0,
					scrollLeft: 0
				},
				
				all_list: [],	//总数组
				last_key: 0,	//上次加载位置
				page_size: 40,	//每页多少数据
				total_count: 0,	//总数据
				can_load: false,	//是否可以加载 防止并发
				
				ajax_pro_val:[],	//二次查询的产品值
				
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
		created(){
			const _this = this;
			_this.now_group_id = _this.datas.content.dataset[0].selector_id.split('-')[0]
			_this.now_group_count = _this.datas.content.dataset[0].goods_count
			_this.get_goods()
			
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
				let that = this;
				let data = [...this.datas.content.dataset];
			
				if (data.length == 0) return false;
			
				const query = uni.createSelectorQuery().in(this);
			
				query.select('#tab_' + index).boundingClientRect((res) => {
					data[index]._slider = {
						width: res.width,
						left: res.left,
						scrollLeft: res.left - (data[index - 1] ? data[index - 1]._slider.width : 0),
					};
					that.tabListSlider = data
					if (that.now_nav_index == index) {
						that.tabToIndex(that.now_nav_index);
					}
			
					index++;
					if (data.length > index) {
						that.updateTabWidth(index);
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
				that.tabToIndex(e.currentTarget.dataset.ind);
				that.now_group_id = id
				that.now_group_count = e.currentTarget.dataset.count
				that.get_goods();
			},
			// 获取商品数据
			get_goods() {
				var that = this
				var requestData = {
					version: '1.0',
					only:1,//不获取推荐商品
					page_num: 1,
					page_size: that.now_group_count,
					type: that.now_group_id
				}
				this.goods_list = []
				this.all_list = []
				this.loading = true
				this.can_load=false;
				this.last_key = 0;
				var goods_list = this.goods_list;
				
				var ajax_pro_val = [];
				
				this.$common.requestData({
					url: "/bainonghui/web/index.php?m=shop&a=get_product_list&customer_id=" + that.vuex_customer_id,
					data: requestData, 
					method: "POST", 
					needToken: true,
				}).then(res => {
					that.loading = false
					if (res.errcode == 0) {
					 	if (res.data && res.data.pro) {
					 		res.data.pro.forEach((el) => {
					 			el['tagList'] = []
					 			// 拆分价格
					 			el['priceA'] = that.$common.toPrice(el.first_price, true)
					 			el['priceB'] = that.$common.toPrice(el.first_price, false)
					 			// 获取标签
					 			// if (el.freight_name) {
					 			// 	el.tagList.push(el.freight_name)
					 			// }
					 			// if (el.integral_name) {
					 			// 	el.tagList.push(el.integral_name)
					 			// }
					 			// if (el.currency_name) {
					 			// 	el.tagList.push(el.currency_name)
					 			// }
					 			// if (el.privilege_switch == 1 && el.privilege_dis > 0 && el.privilege_dis < 100) {
					 			// 	el.tagList.push(el.privilege_name + '价' + ' ' + (Math.floor((el.privilege_dis / 10 * 100) / 100)) + '折')
					 			// }
								//价钱
								el.tagList.push(that.monetary_unit+''+el.first_price)
								ajax_pro_val.push({id:el.id,first_price:el.first_price,for_price:el.for_price});
					 		})
							that.ajax_pro_val = ajax_pro_val;
					 	}
					 	that.all_list = res.data.pro;
						that.total_count = res.data.pro.length;	
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
						
						that.getProExtra();
					}
				})
			},
			//跳转至商品详情页
			goDetail: function (e) {
				var id = e.currentTarget.dataset.id
				var index = e.currentTarget.dataset.index
	
				var prostr = JSON.stringify(this.goods_list[index])
				this.$cache.set('shop_pro_detail_'+id,prostr);
				var url = "/shop/mshop/web/index.php?m=product&a=product_detail&pro_id="+id+'&customer_id='+this.vuex_customer_id
				this.$common.diyLinkJump(url,"h5",true);
			},
			//获取商品赠送详情
			getProExtra: function () {
				let that = this;
				this.$common.requestData({
					url: "/bainonghui/web/index.php?m=shop&a=get_product_extra&xdebug=xdebug",
					data: {pro_val:JSON.stringify(this.ajax_pro_val)}, 
					method: "POST", 
					needToken: true,
				}).then(res => {
					if (res.errcode == 0) {
						var extra_list = res.data;
					 	that.all_list.forEach((el,index) => {
							var tagListExtra = extra_list[index].tagList;
							tagListExtra.forEach((vl)=>{
								el.tagList.push(vl)
							})

					 	})
					}
				})
			},
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

<style scoped>
/* 商品列表组件start */
.display-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}
.price-box{
	font-size: 32rpx;
	margin-top: 10rpx;
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
	box-shadow: inset 0 -2rpx #e6e6e6;
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
    font-size: 28rpx;
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
.svod-list>view>view>text.active{
    font-size: 22rpx;
    color: #fff;
}
.svod-list>view>view{
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
    margin-bottom: 18.5px;
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
    font-size: 26rpx;
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
.tag{
    margin-bottom: 10rpx;
	margin-top: 10rpx;
}
.tag .tag-item{
	display: flex;
	/* display: inline-block; */
	color: #ff5600;
	margin-right: 10rpx;
	/* background: #fac743; */
	/* background: linear-gradient(to right, #fac743,#fff4d7);
	
	padding: 4px 6px;
	margin: 5px 3px 0px 0; */
}
.tag-item .label{
	background: linear-gradient(#C6E9B5,#8ACB55);
	color: white;
	font-size: 20rpx;
	border-radius: 15rpx;
	padding: 0 8rpx;
	margin-right: 6rpx;
}
.tag-item .num{
	font-size: 22rpx;
	color: #8ACB55;
}
/* 标签end */
/* 销量 */
.xiaoliang{
    font-size: 22rpx;
    color: #999999;
}
/* 销量end */
/* 价格 */
.svod-user {
    color: #333;
    align-items: center;
}
.svod-user .big{
    font-size: 24rpx;
}
.svod-user .big_s{
   font-size: 30rpx;
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
</style>
