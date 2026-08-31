<template>
	<view class='container'>
	    <!--搜索-->
	    <view class='top-serach' style="padding: 20rpx 30rpx;">
	       <!-- <view class='serach-wrap' :hidden="!inputShowed">
	            <icon class="serach-icon" type="search" size="14" :color='theme_color'></icon>
	            <input type="text" class="serach-input" :placeholder="placeholder" :value="inputVal" :focus="true" @input="inputTyping" @confirm='searchData' />
	            <view class="search-clear" v-if="inputVal.length > 0" @click="clearInput">
	                <icon type="clear" size="14" :color='theme_color'></icon>
	            </view>
	            <view :class="'serach-cancel skin-color-'+theme" :hidden="!inputShowed" @click="hideInput">取消</view>
	        </view>
	        <label class="search-label" :style="'display:'+(inputShowed?'none':'')" @click="showInput">
	            <view>
	                <icon class="search-label-icon" type="search" size="14" :color='theme_color'></icon>
	                <view class="search-label-text ">搜索</view>
	            </view>
	        </label> -->
			<u-search :clearabled="true" :focus="true" :placeholder="placeholder" v-model="inputVal" :searchIconColor="theme_color" :actionStyle="{'color':theme_color}" @clear="clearInput" @seach="searchData" @custom="searchData" ></u-search>
			<view v-if="search_list_bool">
				<view class="search-title">{{search_datas.title}}</view>
				<view class="search-list flex-def flex-wrap">
					<block v-for="(item,index) in search_datas.dataset">
						<view class="search-list-li flex-def flex-cCenter" @click="go_search_url" :data-text="item.title">{{item.title}}</view>
					</block>
				</view>
			</view>
	    </view>
	    <!--搜索-->
	    <!-- nav -->
	    <view class="search-nav" v-if="nav_list.length>1">
	        <view v-for="(item,index) in nav_list" :class="nav_index==index?'active sli skin-color-'+theme:'sli'" @click="nav_fun" :data-index="index">
	            <view class="sp">{{item.text}}</view>
	            <view :class="'line skin-bg-'+theme"></view>
	        </view>
	    </view>
	    <!-- nav -->
	    <scroll-view class="list" scroll-y @scrolltolower="load_more">
	        <!--风格1 start-->
			<view class="list-1" v-if="list_type==1">
				<view @click="$common.diyLinkJump(item.link)" class="list-item" v-for="(item,index) in list">
					<view class="img">
						<image :src="item.pic" />
					</view>
					<view class="infor">
						<view class="first-infor">
							<view class="title sp"><text :class="'round skin-bg-'+theme" v-if="item.keyword[0]!=''" v-for="(round,idx) in item.keyword">{{round}}</text>{{item.title}}</view>
							<view class="round-list">
								<view class="sli" v-for="(label,ide) in item.label">{{label}}</view>
							</view>
						</view>
						<view class="sec-infor">
							<view :class="'sp price price-'+price_color">{{monetary_unit}}<text class="big">{{item.priceA}}</text>{{item.priceB}}</view>
						</view>
					</view>
				</view>
			</view>
			<!--风格1 end-->
	        <!--风格2 start-->
			<view class="list-2" v-if="list_type==2">
				<view @click="$common.diyLinkJump(item.link)" class="list-item" v-for="(item,index) in list">
					<view class="img">
						<image :src="item.pic"/>
					</view>
					<view class="infor">{{item.title}}</view>
				</view>
			</view>
			<!--风格2 end-->
	        <!--风格3 start-->
			<view class="list-3" v-if="list_type==3">
				<view @click="$common.diyLinkJump(item.link)" class="list-item" v-for="(item,index) in list">
					<view class="img">
						<image :src="item.pic" />
					</view>
					<view class="infor">
						<view class="title sp">{{item.title}}</view>
						<view class="infor-box">
							<view class="star-box">
							    <image class="star" v-for="it of 5" :src="it<item.star_num?http_host+'/HTML/images/public/images/star_active.png':http_host+'/HTML/images/public/images/star.png'"/>
							</view>
							<view class="range sp">{{item.range}}</view>
						</view>
						<view class="round-list">
							<view class="sli" v-for="it in item.round">{{it}}</view>
						</view>
					</view>
				</view>
			</view>
			<!--风格3 end-->
	        <!--风格4 start-->
			<view class="list-4" v-if="list_type==4">
				<view @click="$common.diyLinkJump(item.link)" class="list-item" v-for="(item,index) in list">
					<view class="img">
						<image :src="item.pic" />
					</view>
					<view class="infor">
						<view class="title sp">{{item.title}}</view>
						<view :class="'sp price price-'+price_color">{{monetary_unit}}<span class="big">{{item.priceA}}</span>{{item.priceB}}</view>
					</view>
				</view>
			</view>
			<!--风格4 end-->
	        <!--风格5 start-->
			<view class="list-5" v-if="list_type==5">
				<view @click="$common.diyLinkJump(item.link)" class="list-item" v-for="(item,index) in list">
					<view class="img" v-if="item.pic">
						<image :src="item.pic"/>
					</view>
					<view class="infor">
						<view class="title sp">{{item.title}}</view>
						<view class="text-infor">
							<view class="sp">{{item.author}}</view>
							<view class="sp">{{item.time}}</view>
						</view>
					</view>
				</view>
			</view>
			<!--风格5 end-->
	        <!--风格6 start-->
			<view class="list-6" v-if="list_type==6">
				<view @click="$common.diyLinkJump(item.link)" class="list-item" v-for="(item,index) in list">
					<view class="per-infor">
						<view class="img">
							<image :src="item.headimg"/>
						</view>
						<view class="infor">
							<view class="name sp">{{item.name?item.name:''}}</view>
							<view class="sp">{{item.label[0]}}</view>
						</view>
					</view>
					<view class="text-title sp">{{item.title}}</view>
					<view class="text-infor sp">{{item.describe}}</view>
					<view class="img-list">
						<image v-for="(it,it_index) in item.img_list" v-if="it_index<3" :src="it" :style="'height : '+((phoneWidth-50)/3*162/216)+'px;'"/>
					</view>
				    <view class="address"><image :src="http_host+'/HTML/images/public/images/icon_address.png'"/>{{item.address}}</view>
				</view>
			</view>
			<!--风格6 end-->
	        <view class="weui-loadmore" style="margin: 0px auto;margin-bottom:40rpx;margin-top:20rpx" v-if="list.length>0">
	            <block v-if="load_type==1">
	                <view class="loading-tips">上拉加载数据</view>
	            </block>
	            <block v-if="load_type==2">
	                <i class="weui-loading"></i>
	                <view class="loading-tips">正在加载</view>
	            </block>
	            <block v-if="load_type==3">
	                <view class="loading-tips">没有更多了</view>
	            </block>
	        </view>
	    </scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			theme_color: this.$common.get_color(getApp().globalData.style_color),
			http_host: '',
			price_color: getApp().globalData.price_color,
			monetary_unit: getApp().globalData.monetary_unit,
			nav_list: [],
			nav_index: 0,
			list: [],
			list_type: 1,
			keyword: "",
			tag_app: "",
			city_code: "",
			page: 1,
			can_load: true,
			load_type: 1,
			search_datas: "",
			search_list_bool: true,
			inputShowed: false,
			inputVal: "",
			barBackgroundColor: getApp().globalData.bar_background_color_hex,
			barFrontColor: getApp().globalData.bar_front_color_hex,
			bar_color_set: getApp().globalData.bar_color_set,
		}
	},
	
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		var that=this;
		that.http_host=this.vuex_apiUrl;
		that.user_id=that.vuex_user.user_id;
		that.tpl_id = options.tpl_id
		that.placeholder = options.placeholder == '' ? '搜索' : options.placeholder;
		if(options.search_data){
		    that.search_datas = JSON.parse(options.search_data)
		}else{
		    that.search_list_bool = false
		}
		that.phoneWidth = uni.getSystemInfoSync().windowWidth
		if(options.city_code){
		    that.city_code = options.city_code
		}
		if(that.barBackgroundColor!= 'default'&&that.bar_color_set.indexOf('/pages/search/search')>=0){
			uni.setNavigationBarColor({
				frontColor: that.barFrontColor,
				backgroundColor: that.barBackgroundColor
			})
		}
		that.showInput();
	},
	methods: {
		showInput: function () {
		    this.inputShowed = true
		},
		hideInput: function () {
		    this.inputVal = ""
		    this.inputShowed = false
		    uni.navigateBack({
		        delta: 1,
		    })
		},
		clearInput: function () {
		    this.inputVal = ""
			if(this.search_datas!=''){
		        this.search_list_bool = true
			}
		},
		inputTyping: function (e) {
		    this.inputVal = e.detail.value;
		},
		searchData: function () {
		    var that = this;
		    if (!!that.inputVal){
		        that.keyword = that.inputVal
		        that.search_list_bool = false
		    }else{
		        uni.showToast({
		            title: '请输入搜索内容',
		            icon:'none',
		            duration:2000
		        })
		        return false;
		    }
		    that.tag_app = ''
		    that.nav_index = 0
		    that.nav_list = []
		    that.can_load = true
		    that.reload_data();
		},
		
		go_search_url(e){
		    const that = this;
		    that.inputVal = e.currentTarget.dataset.text
		    that.keyword = e.currentTarget.dataset.text
		    that.search_list_bool = false
		    that.search_data();
		},
		nav_fun:function(e){
		    var that = this;
		    var index = e.currentTarget.dataset.index;
		    that.nav_index = index
		    that.tag_app = that.nav_list[index].id
		    that.list_type = that.nav_list[index].style
		    that.reload_data();
		},
		search_data: function () {
		    var that = this;
		    that.can_load = false 
		    that.load_type = 2
		    var request_data = {};
		    request_data = {
		        tag_app: that.tag_app,
		        keyword: that.keyword,
		        tpl_id: that.tpl_id,
		        page: that.page,
		        pagesize:8,
		        city_code: that.city_code//现在地理位置的搜索还没做,先注释掉
		    }
			that.$api.pubSearchData(request_data).then(res => {
				if (res.errcode == 0) {
				    var nav_list_arr = [];
				    res.data.search_data.forEach(function(item){
				        var price = Number(item.price).toFixed(2);
				        item.priceA = that.$common.toPrice(String(price), true)
				        item.priceB = that.$common.toPrice(String(price), false)
				    })
				    that.list = that.list.concat(res.data.search_data)
				    if (res.data.tag) {
				        for (var i in res.data.tag) {
				            var obj = {};
				            obj.id = i;
				            obj.text = res.data.tag[i].name;
				            obj.style = res.data.tag[i].style;
				            nav_list_arr.push(obj)
				        }
				        that.nav_list = nav_list_arr
				        that.list_type = nav_list_arr[0].style
				        if (nav_list_arr[0].id){
				            that.tag_app = nav_list_arr[0].id
				        }
				    }
				    
				    if (res.data.more == 1) {
				        that.can_load = true
				        that.load_type = 1
				    } else {
				        that.can_load = false
				         that.load_type = 3
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
		reload_data: function () {
		    var that = this;
		    that.page = 1
		    that.list = []
		    that.search_data();
		},
		load_more: function () {
		    var that = this;
		    if(that.can_load){
		        var page = that.page;
		        page++;
		        that.page = page
		        that.search_data();
		    }
		},		
		gotoDetail(link){
			this.$common.diyLinkJump(link,"h5",true)
		},
	},
}
</script>

<style>
	page{background-color: #fff;}
	view{box-sizing: border-box}
	.search-label{
		border-radius: 17.5px !important;
	}
	.serach-wrap::after{
		border-radius: 17.5px !important;
	}
	.search-title{
		line-height: 1;
		margin-top: 25px;
		font-size: 14px;
		color: #333;
		box-sizing: border-box;
	}
	.search-list{
		padding: 15px 0;
	}
	.search-list .search-list-li{
		padding: 0 14px;
		height: 24px;
		border-radius: 12px;
		background-color: #f5f5f5;
		margin-right: 15px;
		margin-bottom: 15px;
		font-size: 13px;
		color: #999;
	}
	.search-clear{position: absolute;right:55px;margin-top:-10px;z-index: 5 }
	.container{display: -webkit-box;display: -webkit-flex;display: flex;flex-direction: column}
	::-webkit-scrollbar{width: 0;height: 0;color: transparent;}
	.search-nav{
		background-color: #FFF;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		overflow-x: scroll;
		padding: 0 20rpx;
		height: 80rpx;
		border-bottom: solid 2rpx #f5f5f5;
	}
	.search-nav .sli{
		-webkit-box-flex:1 0 auto;
		-webkit-flex: 1 0 auto;
		flex: 1 0 auto;
		padding: 0 20rpx;
		text-align: center;
		color: #5d5d5d;
	}
	.search-nav .sli p{
		line-height: 74rpx;
		font-size: 28rpx;
	}
	.search-nav .sli .line{
		height: 6rpx;
		width: 30rpx;
		margin: 0 auto;
		background-color:#989bf8;
		border-radius: 3rpx;
		display: none;
	}
	.search-nav .sli .active{
		color: #989bf8;
	}
	.search-nav .sli .active .line{
		display: block;
	}
	.list{
		/* background-color: #FFF; */
		height: calc(100vh - 90rpx);
		-webkit-overflow-scrolling:touch;
		overflow-scrolling:touch;
	}
	.no-data{
		padding: 35px 0 0 0;
	    text-align: center;
	}
	.no-data p{
		color: #ccc;
		font-size: 13px;
		text-align: center;
		line-height: 24px;
	}
	
	/*风格1 start*/
	.list-1{
		background-color: #FFF;
	}
	.list-1 .list-item{
		display: block;
		padding: 30rpx;
		overflow: hidden;
	}
	.list-1 .list-item .img{
		width: 200rpx;
		height: 200rpx;
		float: left;
		margin-right: 20rpx;
	}
	.list-1 .list-item .img image{
		display: block;
		width: 100%;
		height: 100%;
	}
	.list-1 .list-item .infor{
		width: calc(100% - 220rpx);
		float: left;
	}
	.list-1 .list-item .infor .first-infor{
		min-height: 140rpx;
	}
	.list-1 .list-item .infor .title{
		font-size: 28rpx;
		line-height: 40rpx;
		color:#5d5d5d;
		display: -webkit-box; 
		-webkit-line-clamp: 2; 
		-webkit-box-orient: vertical; 
		overflow: hidden;
	}
	.list-1 .list-item .infor .title .round{
		font-size: 22rpx;
		color: #FFF;
		background-color:#989bf8;
		line-height: 1;
		padding: 1rpx 8rpx;
		margin-right: 10rpx;
		border-radius: 4rpx;
	}
	.list-1 .list-item .infor .round-list{
		overflow: hidden;
	}
	.list-1 .list-item .infor .round-list .sli{
		font-size: 22rpx;
		padding: 4rpx 8rpx;
		line-height: 1;
		color: #f36889;
		background-color: #fde1e7;
		border-radius: 16rpx;
		float: left;
		margin: 10rpx 10rpx 0 0;
	}
	.list-1 .list-item .infor .sec-infor{
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: 1;
		margin-top:20rpx ;
	}
	.list-1 .list-item .infor .price{
		font-size: 26rpx;
		color: #333;
	}
	.list-1 .list-item .infor .price .big{
		font-size: 32rpx;
	}
	.list-1 .list-item .infor .sale{
		font-size: 22rpx;
		color: #999;
	}
	/*风格1 end*/
	/*风格2 start*/
	.list-2{
		background-color: #FFFFFF;
		display: block;
	}
	.list-2 .list-item{
		display: block;
		padding: 30rpx;
		overflow: hidden;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		align-items: center;
	}
	.list-2 .list-item .img{
		width: 100rpx;
		height: 100rpx;
		-webkit-box-flex: none;
		-webkit-flex: none;
		flex: none;
		margin-right: 24rpx;
	}
	.list-2 .list-item .img image{
		display: block;
		width: 100%;
		height:100%;
		border-radius: 50%;
	}
	.list-2 .list-item .infor{
		-webkit-box-flex: auto;
		-webkit-flex: auto;
		flex: auto;
		width: 50%;
		font-size: 28rpx;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/*风格2 end*/
	/*风格3 start*/
	.list-3{
		background-color: #FFFFFF;
	}
	.list-3 .list-item{
		display: block;
		padding: 30rpx;
		overflow: hidden;
	}
	.list-3 .list-item .img{
		width: 140rpx;
		height: 140rpx;
		margin-right: 16rpx;
		float: left;
	}
	.list-3 .list-item .img image{
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}
	.list-3 .list-item .infor{
		float: left;
		width: calc(100% - 156rpx);
		padding-top: 12rpx;
	}
	.list-3 .list-item .infor .title{
		font-size: 28rpx;
		color: #333;
		line-height: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list-3 .list-item .infor-box{
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
		align-items: center;
	}
	.list-3 .list-item .infor-box .star-box{
		-webkit-box-flex: auto;
		-webkit-flex: auto;
		flex: auto;
		width: 50%;
		overflow: hidden;
	}
	.list-3 .list-item .infor-box .star-box .star{
		width: 24rpx;
		height: 24rpx;
		float: left;
		display: block;
		margin-right: 7rpx;
	}
	.list-3 .list-item .infor-box .range{
		-webkit-box-flex: none;
		-webkit-flex: none;
		flex: none;
		font-size: 24rpx;
		color: #333333;
		line-height: 1;
	}
	.list-3 .list-item .round-list{
		overflow: hidden;
	}
	.list-3 .list-item .round-list .sli{
		font-size: 20rpx;
		color: #999;
		margin: 0 12rpx 10rpx 0;
		float: left;
		line-height: 1;
	}
	/*风格3 end*/
	/*风格4 start*/
	.list-4{
		background-color: #FFF;
		overflow: hidden;
		padding: 12rpx 15rpx;
	}
	.list-4 .list-item{
		display: block;
		float: left;
		padding: 12rpx 15rpx;
		width: calc(50% - 30rpx);
		height: 440rpx;
	}
	.list-4 .list-item .img{
		width: 100%;
		height: 230rpx;
	}
	.list-4 .list-item .img image{
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}
	.list-4 .list-item .infor{
		padding-top: 20rpx;
		min-height: 130rpx;
	}
	.list-4 .list-item .infor .title{
		font-size: 26rpx;
		color: #5d5d5d;
		line-height: 36rpx;
		display: -webkit-box; 
		-webkit-line-clamp: 2; 
		-webkit-box-orient: vertical; 
		overflow: hidden;
	}
	.list-4 .list-item .infor .price{
		font-size: 24rpx;
		color: #333;
		line-height: 1;
		margin-top: 30rpx;
	}
	.list-4 .list-item .infor .big{
		font-size: 30rpx;
	}
	/*风格4 end*/
	/*风格5 start*/
	.list-5 .list-item{
		display: block;
		background-color: #FFF;
		padding: 30rpx;
		margin-bottom: 20rpx;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}
	.list-5 .list-item .img{
		-webkit-box-flex: none;
		-webkit-flex: none;
		flex: none;
		margin-right: 20rpx;
		width: 240rpx;
		height: 160rpx;
	}
	.list-5 .list-item .img image{
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}
	.list-5 .list-item .infor{
		-webkit-box-flex: auto;
		-webkit-flex: auto;
		flex: auto;
		width: 50%;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.list-5 .list-item .infor .title{
		color: #333333;
		font-size: 30rpx;
		line-height: 36rpx;
		display: -webkit-box; 
		-webkit-line-clamp: 2; 
		-webkit-box-orient: vertical; 
		overflow: hidden;
		margin-bottom: 30rpx;
	}
	.list-5 .list-item .infor .text-infor{
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
	}
	/*风格5 end*/
	/*风格6 start*/
	.list-6 .list-item{
		padding: 30rpx;
		background-color: #FFF;
		margin-bottom: 20rpx; 
	    display:block;
	}
	.list-6 .per-infor{
		overflow: hidden;
		margin-bottom: 20rpx;
	}
	.list-6 .per-infor .img{
		width: 90rpx;
		height: 90rpx;
		margin-right: 20rpx;
		float: left;
	}
	.list-6 .per-infor .img image{
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.list-6 .per-infor .infor{
		width: calc(100% - 110rpx);
		float: left;
		line-height: 1.5;
		font-size: 28rpx;
		color: #999;
	}
	.list-6 .per-infor .infor .sp{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.list-6 .per-infor .infor .name{
		font-size: 32rpx;
		color: #333;
		line-height: 42rpx;
	    display: block;
	}
	.list-6 .text-title{
		font-size: 28rpx;
		color: #333;
		line-height: 48rpx;
	}
	.list-6 .text-infor{
		font-size: 28rpx;
		color: #999;
		line-height: 40rpx;
	    display: block;
	}
	.list-6 .img-list{
		overflow: hidden;
		padding-top: 10px;
	}
	.list-6 .img-list image{
		display: block;
		width:calc(33.3% - 15rpx);
		height: 162rpx;
		float: left;
		margin:0 20rpx 20rpx 0;
	}
	.list-6 .img-list image:nth-child(3n){
		margin:0 0 10px 0;
	}
	.list-6 .address{
		font-size: 28rpx;
		line-height: 32rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list-6 .address image{
	    width: 32rpx;
	    height: 32rpx;
	    vertical-align:-4rpx;
	}
	.loading-tips{color: #999999;text-align: center;padding: 10px 0;font-size: 28rpx}
	/*风格6 end*/

</style>