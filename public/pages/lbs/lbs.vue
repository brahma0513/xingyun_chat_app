<template>
	<view class='container'>
	    <view class="fixed-top">
	        <!--搜索-->
	        <view class='top-serach'>
	            <u-search placeholder="输入城市" :searchIconColor="skin_color" :actionStyle="{'color':skin_color}" v-model="inputVal" @search="searchData" @custom="searchData"></u-search>
	        </view>
	        <!--搜索-->
	        <!-- nav -->
	        <view class="loc-nav" v-if="has_nav">
	            <li v-for="(item,index) in loc_nav" :class="nav_index==index?'active skin-color-'+theme:''" @click="changIndex" :data-index="index">
	                <p>item</p>
	                <view :class="'line skin-bg-'+theme"></view>
	            </li>
	        </view>
	        <!-- nav -->
	    </view>
	    <!-- <view :style="'height:'+(has_nav?'170rpx':'90rpx')"></view> -->
	    <scroll-view :class="'content-scroll ' + (has_nav?'has_nav_height':'no_has_nav_height')" scroll-y :scroll-into-view="scroll_top" scroll-with-animation="true">
	        <!-- 当前/历史 -->
	        <view class="city-title" :id="'history'">当前/历史</view>
	        <view class="city-list1">
	            <li v-if="location_city.area_code" :class="'local-flex ' + (current_city.area_code==location_city.area_code?'active skin-color-'+theme+' skin-bd-'+theme:'')" @click="chose_city(location_city)" :data-city="location_city">
	                <image class='nav_active' mode='widthFix' :src="http_host+'/HTML/images/shop/images/'+theme+'/nav_active.png'"></image>{{location_city.area_name}}
	            </li>
	            <li v-for="(item,index) in history_city" @click="chose_city(item)" :data-city="item" :class="current_city.area_code==item.area_code?'active skin-color-'+theme+' skin-bd-'+theme:''" v-if="item.area_code!=location_city.area_code">{{item.area_name}}</li>
	        </view>
	        <!-- 热门 -->
	        <view class="city-title" :id="'hot'" v-if="hot_city.length>0">热门</view>
	        <view class="city-list1" v-if="hot_city.length>0">
	            <li v-for="(item,index) in hot_city" @click="chose_city(item)" :data-city="item">{{item.area_name}}</li>
	        </view>
	        <!-- 列表 -->
	        <block v-for="(item,index) in city_list">
	            <view class="city-title" :id="item.title">{{item.title}}</view>
	            <view class="city-list2">
	                <li v-for="(itm,city_index) in item.list" @click="chose_city(itm)" :data-city="itm">{{itm.area_name}}</li>
	            </view>
	        </block>
	        <view v-if="city_list.length<=0" class="no-data">抱歉，查询无结果或暂未开通该地区</view>
	    </scroll-view>
	    <view class="side-nav">
			<li @click="side_fun" :data-tap="'history'">历史</li>
			<li v-if="hot_city.length>0" @click="side_fun" :data-tap="'hot'">热门</li>
			<li v-for="(item,index) in city_list" @click="side_fun" :data-tap="item.title">
				{{item.title}}
			</li>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				has_nav:false,
				loc_nav:['国内','国际'],
				nav_index: 0,
				city: "",
				search_name: "",     //搜索名称
				location_city: {},   //定位城市
				history_city: [],    //历史城市
				hot_city: [],        //热门城市
				city_list: [],       //城市列表
				current_city:{},
				skin_color: "",
				inputShowed: false,
				inputVal: "",
				scroll_top: "history",				
				barBackgroundColor: getApp().globalData.bar_background_color_hex,
				barFrontColor: getApp().globalData.bar_front_color_hex,
				bar_color_set: getApp().globalData.bar_color_set,
			}
		},
		onLoad: function (options) {	
			let that = this;
			that.http_host = this.vuex_apiUrl
			that.skin_color = this.$common.get_color(that.theme);
			
			if(that.barBackgroundColor!= 'default'&&that.bar_color_set.indexOf('/pages/lbs/lbs')>=0){
				uni.setNavigationBarColor({
					frontColor: that.barFrontColor,
					backgroundColor: that.barBackgroundColor
				})
			}
			
			that.get_location();
			that.get_city();
			that.get_history();
		},
		methods: {
			searchData: function () {
				var that = this;
				var _data = {};
				var params = {
					city_name: that.inputVal
				}
				
				that.$api.publicSearchLocation(params).then(res => {
					if (res.errcode == 0) {
						if (res.result.list){
							that.city_list = res.result.list
						}else{
							that.city_list = []
						}
					} else {
						uni.showToast({
							title: res.errmsg,
							icon: 'none',
							duration: 2000
						})
					}								  
				})
			},
			changIndex:function(e){
				this.nav_index = e.currentTarget.dataset.index
			},
			//获取定位城市
			get_location: function () {
				var that = this;
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
						
						that.$api.publicGetLocation(params).then(res => {
							if (res.errcode == 0) {
								var obj = {};
								obj.area_code = res.result.area_code;
								obj.area_name = res.result.city;
								that.location_city = obj
							}								  
						})
				  },
				})				
			},
			//获取本地存储历史城市
			get_history: function () {
				var that = this; 
				var history_city = uni.getStorageSync('history_city') || [];
				var current_city = uni.getStorageSync('current_city') || [];
				if (history_city.length>0){
					that.history_city = JSON.parse(history_city)
				}
				if (current_city.length>0){
					that.current_city = JSON.parse(current_city)
				}				
			},
			chose_city:function(city){
				var that = this;
				//var city = e.currentTarget.dataset.city
				//遍历history_city将area_code返回一个新数组
				var arr = that.history_city.map(function (it, index) {
					return it.area_code;
				})
				console.log(arr)
				if (arr.indexOf(city.area_code) == -1) {
					if (that.history_city.length >= 2) {
						var one_history_city = that.history_city
						one_history_city.splice(1, 1)
						that.history_city = one_history_city
					}
				} else {
					var two_history_city = that.history_city
					two_history_city.splice(arr.indexOf(city.area_code), 1)
					that.history_city = two_history_city
				}
				var Arr = that.history_city;
				Arr.unshift(city);
				that.history_city = Arr
				that.set_local();
				uni.setStorageSync('current_city', JSON.stringify(city))
				
				var lbsHistoryPage = uni.getStorageSync('lbsHistoryPage');
				if(lbsHistoryPage!=undefined && lbsHistoryPage!=''){
					uni.reLaunch({
						url: lbsHistoryPage
					})
				}else{
					uni.navigateBack({
						delta: 1
					})
				}				
			},
			set_local: function () {
				var that = this;
				uni.setStorageSync('history_city', JSON.stringify(that.history_city))
			},
			//获取城市列表
			get_city: function () {
				var that = this;
				var params = {};
				that.$api.publicLbsCityList(params).then(res => {
					if (res.errcode == 0) {
						that.hot_city  = res.result.hot_city.list,
						that.city_list = res.result.city_list.list
					}else{
						uni.showToast({
							title: res.errmsg,
							icon: 'none',
							duration: 2000
						})
					}							  
				})
			},
			side_fun: function (e) {
				console.log(e)
				var that = this
				var scroll_top = e.currentTarget.dataset.tap
				that.scroll_top = scroll_top
			}
		}
	}
</script>

<style>
page{background-color: #f5f5f5;}
view{box-sizing: border-box}
.container{display: -webkit-box;display: -webkit-flex;display: flex;flex-direction: column}
::-webkit-scrollbar{
width: 0;
height: 0;
color: transparent;
}
.no-data{text-align: center;line-height: 100rpx;font-size: 26rpx;color: #999;margin: 40rpx 0;}

.loc-nav{
	background-color: #FFF;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	overflow-x: scroll;
	padding: 0 20rpx;
	height: 80rpx;
	border-bottom: solid 2rpx #f5f5f5;
}
.loc-nav li{
	-webkit-box-flex:1 0 auto;
	-webkit-flex: 1 0 auto;
	flex: 1 0 auto;
	padding: 0 20rpx;
	text-align: center;
	color: #5d5d5d;
}
.loc-nav li p{
	line-height: 74rpx;
	font-size: 28rpx;
}
.loc-nav li .line{
	height: 6rpx;
	width: 30rpx;
	margin: 0 auto;
	background-color:#989bf8;
	border-radius: 3rpx;
	display: none;
}
.loc-nav li.active{
	color: #989bf8;
}
.loc-nav li.active .line{
	display: block;
}

.search-label-icon2{
	display: inline-block;
	vertical-align: middle;
}

.content-scroll{width: 100%;}
.has_nav_height{height: calc(100vh - 170rpx)}
.no_has_nav_height{height: calc(100vh - 90rpx)}
.nav_active{width: 28rpx;height: 28rpx;vertical-align:middle;margin-right: 5rpx}


.city-title{
	padding: 0 30rpx;
	font-size: 26rpx;
	line-height: 60rpx;
	color: #999999;
}
.city-list1{
    width: 100%;
	overflow: hidden;
	background-color: #FFF;
	padding: 15rpx;
}
.city-list1 li{
	width: calc(33.333% - 60rpx);
	float: left;
	box-sizing: border-box;
	padding: 0 10rpx;
	text-align: center;
	border: solid 2rpx #d8d8d8;
	font-size: 28rpx;
	color: #5d5d5d;
	line-height: 66rpx;
	border-radius: 8rpx;
	margin: 15rpx;
	height: 70rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	list-style: none;
}
.city-list1 li.active{
	color: #989bf8;
	border-color:#989bf8;
}
.city-list1 li.active i{
	color: #989bf8;
}
.city-list2{
	background-color: #FFF;
	padding: 0 0 0 15px;
}
.city-list2 li{
    width: 100%;
	padding: 0 5px;
	border-bottom: solid 1px #e5e5e5;
	font-size: 16px;
	color: #333333;
	line-height: 46px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
    display: block;
}
.city-list2 li:last-child{
	border: none;
}

.side-nav{
	position: fixed;
	top: calc(50% + 40rpx);
	right: 0;
	padding: 20rpx;
	text-align: center;
	 transform: translateY(-50%);
}
.side-nav li{
	padding: 7rpx 0;
	line-height: 1;
	font-size: 12px;
	color: #999999;
    display: block;
}
.local-flex{
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
