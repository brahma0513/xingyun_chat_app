<template>
	<view class="">
		<view :style="'padding-top:' + datas.content.padding + 'px'+';'+ 'padding-bottom:'+ datas.content.padding + 'px'">
		  <!-- 头部 -->
		  <view class="header">
		    <!-- 选项卡 -->
		    <view class="tabs flex align-items-center ">
		      <view class="tabs-left flex align-items-center">
		        <view class="tabs-left-itam" :class=" tabs_index==1?'tabs-item-active':''" data-index="1"
		          @click="handelTabsIndexChange">
		          <view class="tabs-left-item-top flex align-items-center">
		            <view>推荐</view>
		            <image :class="'skin-bg-'+ theme" :src="http_host + '/offline_shopping/web/static/images/83@2x (2).png'">
		            </image>
		          </view>
		          <image class="tabs-left-item-bottom" :src="http_host + '/offline_shopping/web/static/images/237@2x.png'">
		          </image>
		        </view>
		        <view class="tabs-left-itam" :class="(tabs_index==2?'tabs-item-active':'')" data-index="2"
		          :data-sort="tabs_index_sort1" @click="handelTabsIndexChange">
		          <view class="tabs-left-item-top flex align-items-center">
		            <view>距离</view>
		            <block v-if="tabs_index_sort1=='asc'">
		              <image :class="'skin-bg-'+theme" :src="http_host + '/offline_shopping/web/static/images/83@2x (2).png'">
		              </image>
		            </block>
		            <block v-else>
		              <image :class="'skin-bg-'+theme" :src="http_host + '/offline_shopping/web/static/images/83@2x (3).png'">
		              </image>
		            </block>
		          </view>
		          <image class="tabs-left-item-bottom" :src="http_host + '/offline_shopping/web/static/images/237@2x.png'">
		          </image>
		        </view>
		        <view class="tabs-left-itam" :class="(tabs_index==3?'tabs-item-active':'')" data-index="3"
		          :data-sort="tabs_index_sort2" @click="handelTabsIndexChange">
		          <view class="tabs-left-item-top flex align-items-center">
		            <view>销量</view>
		            <block v-if="tabs_index_sort2=='desc'">
		              <image :class="'skin-bg-'+theme" :src="http_host + '/offline_shopping/web/static/images/83@2x (2).png'">
		              </image>
		            </block>
		            <block v-else>
		              <image :class="'skin-bg-'+theme" :src="http_host + '/offline_shopping/web/static/images/83@2x (3).png'">
		              </image>
		            </block>
		          </view>
		          <image class="tabs-left-item-bottom" :src="http_host + '/offline_shopping/web/static/images/237@2x.png'">
		          </image>
		        </view>
		        <view class="tabs-left-itam" :class="(tabs_index==4?'tabs-item-active':'')" :data-index="4"
		          :data-sort="tabs_index_sort3" @click="handelTabsIndexChange">
		          <view class="tabs-left-item-top flex align-items-center">
		            <view>评分</view>
		            <block v-if="tabs_index_sort3=='asc'">
		              <image :class="'skin-bg-'+theme" :src="http_host + '/offline_shopping/web/static/images/83@2x (2).png'">
		              </image>
		            </block>
		            <block v-else>
		              <image :class="'skin-bg-'+theme" :src="http_host + '/offline_shopping/web/static/images/83@2x (3).png'">
		              </image>
		            </block>
		          </view>
		          <image class="tabs-left-item-bottom" :src="http_host + '/offline_shopping/web/static/images/237@2x.png'">
		          </image>
		        </view>
		      </view>
		    </view>
		    <!-- 选项卡 end -->
		  </view>
		  <!-- 头部end -->
		  <!-- 内容 -->
		  <view class="content">
		    <view class="list flex align-items-center wrap" v-if="goods_list.length>0">
		      <view :class="datas.content.css_type == 1?'list-item-1':'list-item-2'" v-for="item in goods_list"
		        :key="item.p_id" :data-supply_id="item.supply_id" :data-p_id="item.p_id" @click="handelShopJump">
		        <view class="list-item-image">
		          <image :src="http_host+item.url"></image>
		          <view class="list-item-distance" v-if="item.delivery == '1'">
		            距离 {{item.instance}}
		          </view>
		        </view>
		        <view class="list-item-goods">
		          <view class="list-item-goods-name">{{item.pro_name}}</view>
		          <view class="list-item-goods-data flex align-items-center">
		            <view class="list-item-goods-data-price">￥{{item.now_price}}</view>
		            <view class="list-item-goods-data-onSale">月售{{item.sell}}</view>
		          </view>
		          <view class="list-item-goods-store flex align-items-center">
		            <view class="list-item-goods-store-jump flex align-items-center">
		              <view>{{item.supply_name}}</view>
		              <image :src="http_host + '/offline_shopping/web/static/images/资源 227@2x.png'"></image>
		            </view>
		          </view>
		        </view>
		      </view>
		    </view>
		    <view class="empty" style="height: 60vh;" v-else>
		      <image :src="http_host + '/offline_shopping/web/static/images/shop/empty.png'"></image>
		      <view>暂无相关数据~</view>
		    </view>
		  </view>
		  <!-- 内容 end -->
		</view>
	</view>
</template>

<script>
	
	export default{
	  /**
	   * 组件的属性列表
	   */
	  props: {
	    datas: {
	      type: Object,
	      value: {},
	    },
	  },

	  /**
	   * 组件的初始数据
	   */
	  data() {
		return {
			theme: getApp().globalData.style_color, //主题色
			http_host: "", //域名
			tabs_index: 1, //1=推荐、，2=距离，3=销量，4=评分
			tabs_index_sort1: "asc", //距离排序
			tabs_index_sort2: "desc", //销量排序
			tabs_index_sort3: "asc", //评分排序
			search_show: false, //搜索栏
			shop_id: "", //商品编号
			search_value: "", //搜索内容
			longitude: 0, //经度
			latitude: 0, //纬度
			pageCurrent: 1, //当前页码
			pageCount: 0, //总页码
			goods_list: [], //商家列表
			position_city: {}, //定位所在城市信息
		};
	  },
		created() {
			// this.get_location()
			this.http_host = this.vuex_apiUrl;
		},
	  /**
	   * 组件的方法列表
	   */
	  methods: {
	    // 选项卡切换
	    handelTabsIndexChange(e) {
	      var that = this
	      // 选中类型
	      let index = e.currentTarget.dataset.index
	      // 选中类型 排序
	      let sort = e.currentTarget.dataset.sort
	      // 选项卡重复-排序
	      if (that.tabs_index == index) {
	        sort = sort == "asc" ? "desc" : "asc"
	      }
	      switch (index) {
	        case "2":
	          that.tabs_index_sort1 = sort
	          break;
	        case "3":
	          that.tabs_index_sort2 = sort
	          break;
	        case "4":
	          that.tabs_index_sort3 = sort
	          break;
	        default:
	          break
	      }
	      that.tabs_index = index,
	      // 获取数据
	      that.get_product_list(1)
	    },
	    // 搜索栏 文本清空
	    handelSearchEmpty() {
	      var that = this
	      that. search_value = "",
	      //获取数据
	      that.get_product_list(1)
	    },
	    // 搜索栏 文本监听
	    handelSearchInputChange(e) {
	      var that = this
	      let value = e.detail.value
	      that.search_value = value,
	      // 获取数据
	      that.get_product_list(1)
	    },
	    // 搜索栏
	    handelSearchChange() {
	      var that = this
	      if (that.search_value != "") {
	        that.search_value = "", //清空搜索栏
	        // 重新获取数据
	        that.get_product_list(1)
	      }
	      that.search_show = !that.search_show
	    },
	    // 店铺跳转
	    handelShopJump(e) {

	      let supply_id = e.currentTarget.dataset.supply_id
	      let p_id = e.currentTarget.dataset.p_id
		  var url = "/offline_shopping/web/index.php?m=allPage&a=products_info&s_id="+supply_id+"&pid="+p_id
		  this.$common.diyLinkJump(url,"h5",true);
	    },
	    /**
	     * 根据经纬度获取城市
	     * @method get_location
	     * @param {float}    lng   //经度
	     * @param {float}    lat    //纬度
	     */
	    get_location() {
	      var that = this
	      let { latitude, longitude } = that.datas
		  let params = {
			  ip: "",
	          type: "mini_program",
	          lng: longitude,
	          lat: latitude,
			  }
		  this.$api.osGetLocation(params).then(res => {
			  if (res.errcode != 0) {
			    uni.showToast({
			      title: res.errmsg,
			      icon: "none",
			    })
			  }
			  let position_city = {
			    area_code: res.result.area_code,
			    area_name: res.result.city,
			  }
			  that.position_city = position_city
			  that.latitude = res.result.location.lat
			  that.longitude = res.result.location.lng
			  // 商品列表
			  that.get_product_list(1)
			  
		  })

	    },
	    /**
	     * 商品数据列表
	     * @method get_product_list
	     * @param   {Number}    order   1=推荐、，2=距离，3=销量，4=评分
	     * @param   {Number}    page    当前页码
	     * @param   {float}     lat     纬度
	     * @param   {float}     lng     经度
	     * @param   {Number}    shop_id         商铺编号
	     * @param   {String}    search_val      搜索内容
	     * @param   {String}    order_type1     距离排序 asc-desc
	     * @param   {String}    order_type2     销量排序 asc-desc
	     * @param   {String}    order_type3     评分排序 asc-desc
	     */
	
		get_product_list(pageCurrent = 1) {
	      var that = this
	      uni.showLoading({
	        title: "加载中...",
	      })
		  // 等到获取后台数据再开启
	      let { show_num } = that.datas.content

	      if (pageCurrent == 1 && that.goods_list.length > 0) {

			that.goods_list = []
	      }
		  let params = {
	          order: that.tabs_index,
	          page: pageCurrent,
	          lat: that.latitude,
	          lng: that.longitude,
	          shop_id : that.shop_id,
	          search_val: that.search_value,
	          order_type1: that.tabs_index_sort1,
	          order_type2: that.tabs_index_sort2,
	          order_type3: that.tabs_index_sort3,
	          page_size: show_num,
	        }

		  this.$api.osGetGoodsList(params).then(res => {

				uni.hideLoading()
			    if (res.errcode == 0) {

				  let goods_list = that.goods_list

			      let list =
			        goods_list.length > 0
			          ? JSON.parse(JSON.stringify(goods_list))
			          : []
			      list = [...list, ...res.data]

				  that.goods_list = list

				  that.pageCurrent = pageCurrent
				  that.pageCount = res.pageCount
			    } else {
			      uni.showToast({
			        title: res.errmsg,
			        icon: "none",
			      })
			    }
			})
	  },
	
	},
		mounted(){
		uni.removeStorageSync('latitude')
		uni.removeStorageSync('longitude')
	   var that = this
			that.theme= getApp().globalData.style_color, //主题色
			that.http_host= this.vuex_apiUrl, //域名
	   // 获取所在城市经纬度
	   uni.getLocation({
	     type: "wgs84",
	     success(res) {
				that.latitude = res.latitude
				that.longitude = res.longitude
		uni.setStorageSync('latitude',res.latitude)
		uni.setStorageSync('longitude',res.longitude)
	       // 根据经纬度获取城市
	       that.get_location()
	     },
	   })
	 },
}
	</script>

<style>
	page {
	  background-color: #f3f3f3;
	}
</style>
<style>
	.mask {
	  position: fixed;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  height: 100vh;
	  width: 100vw;
	  overflow: hidden;
	  z-index: 99;
	}
	
	.mask-box {
	  position: absolute;
	  top: 0;
	  left: 0;
	  height: 100vh;
	  width: 100vw;
	  background-color: rgba(0, 0, 0, 0.5);
	  z-index: 99;
	}
	
	/* 默认样式 start */
	.flex {
	  display: -ms-flex;
	  display: -ms-flexbox;
	  display: flex;
	}
	
	.justify-content-center {
	  -ms-flex-pack: center;
	  justify-content: center;
	  -ms-justify-content: center;
	  -o-justify-content: center;
	  box-pack: center;
	}
	
	.justify-content-space-between {
	  -ms-flex-pack: justify;
	  justify-content: space-between;
	  -ms-justify-content: space-between;
	  -o-justify-content: space-between;
	  -moz-justify-content: space-between;
	}
	
	.justify-content-space-around {
	  -ms-flex-pack: distribute;
	  justify-content: space-around;
	  -ms-justify-content: space-around;
	  -o-justify-content: space-around;
	  -moz-justify-content: space-around;
	}
	
	.justify-content-start {
	  -ms-flex-pack: start;
	  justify-content: flex-start;
	  -ms-justify-content: flex-start;
	  -o-justify-content: flex-start;
	  -moz-justify-content: flex-start;
	}
	
	.justify-content-end {
	  -ms-flex-pack: end;
	  justify-content: flex-end;
	  -ms-justify-content: flex-end;
	  -o-justify-content: flex-end;
	  -moz-justify-content: flex-end;
	}
	
	.align-items-center {
	  -ms-flex-align: center;
	  align-items: center;
	  box-align: center;
	  -moz-box-align: center;
	  -ms-align-items: center;
	  -o-align-items: center;
	  -webkit-box-align: center;
	}
	
	.align-items-start {
	  -ms-flex-align: start !important;
	  align-items: flex-start !important;
	}
	
	.align-items-end {
	  -ms-flex-align: end !important;
	  align-items: flex-end !important;
	}
	
	.align-items-baseline {
	  align-items: baseline;
	  -ms-flex-align: baseline;
	}
	
	.column {
	  -ms-flex-direction: column;
	  flex-direction: column;
	}
	
	.wrap {
	  -moz-flex-wrap: wrap;
	  -ms-flex-wrap: wrap;
	  -o-flex-wrap: wrap;
	  -webkit-box-lines: multiple;
	  flex-wrap: wrap;
	}
	
	/* 默认样式 end */
	
	/* 省略号  start */
	.ellipsis-1 {
	  white-space: nowrap;
	  text-overflow: ellipsis;
	  overflow: hidden;
	}
	
	.ellipsis-2 {
	  -webkit-line-clamp: 2;
	}
	
	.ellipsis-3 {
	  -webkit-line-clamp: 3;
	}
	
	.ellipsis-4 {
	  -webkit-line-clamp: 4;
	}
	
	.ellipsis-2,
	.ellipsis-3,
	.ellipsis-4 {
	  display: -webkit-box;
	  -webkit-box-orient: vertical;
	  text-overflow: ellipsis;
	  overflow: hidden;
	}
	
	/* 省略号 end */
	
	/* 单选 */
	.radio-unselected {
	  position: relative;
	  top: 0;
	  left: 0;
	  height: 35rpx;
	  width: 35rpx;
	  border-radius: 50%;
	  border: 1rpx solid #7f8aef;
	}
	
	/* 选中效果 */
	.radio-selected {
	  display: block;
	  height: 16rpx;
	  width: 16rpx;
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	  content: " ";
	  background-color: #7f8aef;
	  border-radius: 50%;
	}
	
	/* 单选 end */
	
	/* 复选框 start */
	
	.checkbox {
	  position: relative;
	  width: 136rpx;
	  height: 52rpx;
	  border-radius: 26rpx;
	  background: #cccccc;
	}
	
	.checkbox.active {
	  background: #7f8aef;
	}
	
	.checkbox.active .checkbox-image {
	  left: 0;
	  transform: translate(4rpx, -50%);
	}
	
	.checkbox-image {
	  position: absolute;
	  left: 8rpx;
	  top: 50%;
	  transform: translate(calc(130rpx - 48rpx), -50%);
	  width: 40rpx;
	  height: 40rpx;
	  border-radius: 20rpx;
	  background-color: #fff;
	  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.4);
	  -webkit-transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
	  transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
	  transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
	}
	
	/* 复选框 end */
	
	/* 暂无数据 */
	.empty {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  color: #999999;
	  font-size: 28rpx;
	}
	
	.empty > image {
	  height: calc(450px * 0.3);
	  width: calc(270px * 0.8);
	}
	
	/* 暂无数据 end */
	
	/* 往上弹出 */
	.popups-top-active {
	  -webkit-animation: popups-top-active 0.5s ease-in-out;
	  animation: popups-top-active 0.5s ease-in-out;
	  -webkit-animation-direction: alternate;
	  animation-direction: alternate;
	}
	
	@-webkit-keyframes popups-top-active {
	  0% {
	    transform: translateY(100%);
	  }
	
	  100% {
	    transform: translateY(0);
	  }
	}
	
	@keyframes popups-top-active {
	  0% {
	    transform: translateY(100%);
	  }
	
	  100% {
	    transform: translateY(0);
	  }
	}
	
	/* 往上弹出 end  */
	
	/* 往左弹出 */
	.popups-left-active {
	  -webkit-animation: popups-left-active 0.5s ease-in-out;
	  animation: popups-left-active 0.5s ease-in-out;
	  -webkit-animation-direction: alternate;
	  animation-direction: alternate;
	}
	
	@-webkit-keyframes popups-left-active {
	  0% {
	    transform: translateX(100%);
	  }
	
	  100% {
	    transform: translateX(0);
	  }
	}
	
	@keyframes popups-left-active {
	  0% {
	    transform: translateX(100%);
	  }
	
	  100% {
	    transform: translateX(0);
	  }
	}
	
	/* 往左弹出 end  */
	
	/* 淡出效果 */
	.popups-fadeOut-active {
	  -webkit-animation: popups-fadeOut-active 0.5s ease-in-out;
	  animation: popups-fadeOut-active 0.5s ease-in-out;
	  -webkit-animation-direction: alternate;
	  animation-direction: alternate;
	}
	
	@-webkit-keyframes popups-fadeOut-active {
	  0% {
	    opacity: 0;
	  }
	
	  100% {
	    opacity: 1;
	  }
	}
	
	@keyframes popups-fadeOut-active {
	  0% {
	    opacity: 0;
	  }
	
	  100% {
	    opacity: 1;
	  }
	}
	
	/* 淡出效果 end  */
	
	/* 淡入效果 */
	.popups-fadeIn-active {
	  -webkit-animation: popups-fadeIn-active 0.5s ease-in-out;
	  animation: popups-fadeIn-active 0.5s ease-in-out;
	  -webkit-animation-direction: alternate;
	  animation-direction: alternate;
	}
	
	@-webkit-keyframes popups-fadeIn-active {
	  0% {
	    opacity: 1;
	  }
	
	  100% {
	    opacity: 0;
	  }
	}
	
	@keyframes popups-fadeIn-active {
	  0% {
	    opacity: 1;
	  }
	
	  100% {
	    opacity: 0;
	  }
	}
	
	/* 淡出效果 end  */
	
	/* 公共样式 */
	
	/* 头部 */
	.header {
	  background-color: #ffffff;
	}
	
	.search-box {
	  height: 85rpx;
	  line-height: 85rpx;
	}
	
	/* 定位 */
	.position {
	  margin: 0 30rpx 0 15rpx;
	  justify-content: space-between;
	  font-size: 28rpx;
	}
	
	.position-left > image {
	  margin-right: 10rpx;
	  height: 42rpx;
	  width: 42rpx;
	  background-color: #7f8aef;
	}
	
	.position-right {
	  height: 50rpx;
	  width: 50rpx;
	}
	
	/* 定位 end*/
	
	/* 搜索 */
	.search {
	  margin: 0 30rpx;
	  justify-content: space-between;
	}
	
	.search-input {
	  flex: 1;
	  height: 60rpx;
	  line-height: 60rpx;
	  position: relative;
	  top: 0;
	  border: 1rpx solid #e5e5e5;
	  border-radius: 60rpx;
	  background-color: #f3f3f3;
	}
	
	.search-input > input {
	  height: 100%;
	  padding: 0 11%;
	  font-size: 28rpx;
	}
	
	.search-input-left {
	  height: 30rpx;
	  width: 30rpx;
	  position: absolute;
	  top: 50%;
	  left: 4%;
	  transform: translate(-4%, -50%);
	}
	
	.search-input-right {
	  height: 30rpx;
	  width: 30rpx;
	  position: absolute;
	  top: 50%;
	  right: 4%;
	  transform: translate(-4%, -50%);
	}
	
	.search-close {
	  margin-left: 15rpx;
	  color: #5d5d5d;
	  font-size: 28rpx;
	}
	
	/* 搜索 end */
	/* 选项卡 */
	.tabs {
	  padding-top: 20rpx;
	  color: #999999;
	  justify-content: space-between;
	  font-size: 28rpx;
	}
	
	.tabs-left {
	  width: 80%;
	}
	
	.tabs-right {
	  width: 20%;
	}
	
	.tabs-left-itam {
	  width: 25%;
	}
	
	.tabs-left-item-top {
	  justify-content: center;
	}
	
	.tabs-left-itam,
	.tabs-right {
	  position: relative;
	  top: 0;
	  left: 0;
	  padding-bottom: 15rpx;
	}
	
	.tabs-right {
	  justify-content: center;
	}
	
	.tabs-left-item-top > image {
	  width: 30rpx;
	  height: 30rpx;
	  background-color: #7f8aef;
	}
	
	.tabs-left-itam:nth-child(1) .tabs-left-item-top > image {
	  display: none;
	}
	
	.tabs-left-item-bottom {
	  display: none;
	  width: 35rpx;
	  height: 35rpx;
	  position: absolute;
	  left: 36%;
	  bottom: 0;
	  transform: translate(-36%, 0);
	}
	
	.tabs-left-itam:nth-child(1) .tabs-left-item-bottom {
	  left: 45%;
	  bottom: 0;
	  transform: translate(-45%, 0);
	}
	
	/* 选中 */
	.tabs-item-active {
	  color: #000000;
	}
	
	.tabs-item-active .tabs-left-item-bottom {
	  display: flex;
	}
	
	/* 选项卡 */
	
	/* 头部 */
	
	/* 内容 */
	.list {
	  margin-top: 20rpx;
	}
	
	.list-item-1 {
	  overflow: hidden;
	  width: calc(100vw - 60rpx);
	  margin-bottom: 20rpx;
	  margin-left: 30rpx;
	  border-radius: 10rpx;
	  background-color: #ffffff;
	  box-shadow: 0 4rpx 4rpx #e5e5e5;
	}
	
	.list-item-2 {
	  overflow: hidden;
	  width: 45vw;
	  margin-bottom: 20rpx;
	  margin-left: calc(50vw - 45vw - 15rpx);
	  border-radius: 10rpx;
	  background-color: #ffffff;
	  box-shadow: 0 4rpx 4rpx #e5e5e5;
	}
	.list-item-image {
	  position: relative;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 45vw;
	}
	.list-item-image > image {
	  width: 100%;
	  height: 100%;
	}
	
	.list-item-distance {
	  padding: 5rpx 10rpx;
	  position: absolute;
	  left: 15rpx;
	  bottom: 20rpx;
	  font-size: 22rpx;
	  color: #fff;
	  border-radius: 5rpx;
	  background-color: rgba(102, 102, 102, 0.5);
	}
	
	.list-item-goods {
	  padding: 10rpx 0 20rpx;
	  margin: 0 15rpx;
	  font-size: 26rpx;
	  color: #000;
	}
	
	.list-item-goods-name {
	  text-align: justify;
	  hyphens: auto;
	  overflow: hidden;
	  line-height: 1.5em;
	  white-space: nowrap;
	  word-wrap: normal;
	  text-overflow: ellipsis;
	}
	
	.list-item-goods-data {
	  justify-content: space-between;
	}
	
	.list-item-goods-data-price {
	  color: #ff525f;
	}
	
	.list-item-goods-data-onSale {
	  font-size: 22rpx;
	  color: #9a9a9a;
	}
	
	.list-item-goods-store {
	  padding-top: 5rpx;
	  justify-content: flex-end;
	}
	
	.list-item-goods-store-jump {
	  font-size: 22rpx;
	  color: #616161;
	}
	
	.list-item-goods-store-jump > image {
	  height: 30rpx;
	  width: 25rpx;
	}
	
	/* 内容 end */
</style>