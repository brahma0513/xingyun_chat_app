<template>
	<view class="">
		<view :style="'padding-top:'+datas.content.padding+'px;'+'padding-bottom:'+datas.content.padding+'px'">
		  <view class="header">
		    <!-- 选项卡 -->
		    <view class="tabs flex align-items-center ">
		      <view class="tabs-left flex align-items-center">
		        <view class='tabs-left-itam' :class="tabs_index==2?'tabs-item-active':'' " data-index="2"
		          :data-sort="tabs_index_sort1" @click="handelTabsIndexChange">
		          <view class="tabs-left-item-top flex align-items-center">
		            <view>距离</view>
		            <block v-if="tabs_index_sort1=='asc'">
						<image :class="'skin-bg-'+theme" :src="http_host +'/offline_shopping/web/static/images/83@2x (2).png'">
						</image>
		            </block>	
		            <block v-else>
					  <image :class="'skin-bg-'+theme" :src="http_host +'/offline_shopping/web/static/images/83@2x (3).png'">
					  </image>
		            </block>
		          </view>
		          <image class="tabs-left-item-bottom" :src="http_host +'/offline_shopping/web/static/images/237@2x.png'">
		          </image>
		        </view>
		        <view class='tabs-left-itam' :class="tabs_index==1?'tabs-item-active':''" data-index="1"
		          @click="handelTabsIndexChange">
		          <view class="tabs-left-item-top flex align-items-center">
		            <view>推荐</view>
		            <image :class="'skin-bg-'+theme" :src="http_host +'/offline_shopping/web/static/images/83@2x (2).png'">
		            </image>
		          </view>
		          <image class="tabs-left-item-bottom" :src="http_host +'/offline_shopping/web/static/images/237@2x.png'">
		          </image>
		        </view>
		        <view class="tabs-left-itam" :class="tabs_index==3?'tabs-item-active':'' " data-index="3"
		          :data-sort="tabs_index_sort2" @click="handelTabsIndexChange">
		          <view class="tabs-left-item-top flex align-items-center">
		            <view>销量</view>
		            <block v-if="tabs_index_sort2=='desc'">
		              <image :class="'skin-bg-'+theme" :src="http_host +'/offline_shopping/web/static/images/83@2x (2).png'">
		              </image>
		            </block>
		            <block v-else>
		              <image :class="'skin-bg-'+theme" :src="http_host +'/offline_shopping/web/static/images/83@2x (3).png'">
		              </image>
		            </block>
		          </view>
		          <image class="tabs-left-item-bottom" :src="http_host +'/offline_shopping/web/static/images/237@2x.png'">
		          </image>
		        </view>
		        <view class='tabs-left-itam' :class="tabs_index==4?'tabs-item-active':'' " data-index="4"
		          :data-sort="tabs_index_sort3" @click="handelTabsIndexChange">
		          <view class="tabs-left-item-top flex align-items-center">
		            <view>评分</view>
		            <block v-if="tabs_index_sort3=='desc'">
		              <image :class="'skin-bg-'+theme" :src="http_host +'/offline_shopping/web/static/images/83@2x (2).png'">
		              </image>
		            </block>
		            <block v-else>
		              <image :class="'skin-bg-'+theme" :src="http_host +'/offline_shopping/web/static/images/83@2x (3).png'">
		              </image>
		            </block>
		          </view>
		          <image class="tabs-left-item-bottom" :src="http_host +'/offline_shopping/web/static/images/237@2x.png'">
		          </image>
		        </view>
		      </view>
		      <view class="tabs-right flex align-items-center screen" @click="handelFilterChange">
		        <view>筛选</view>
		        <image :src="http_host +'/offline_shopping/web/static/images/filter-tab2.png'"></image>
		      </view>
		    </view>
		    <!-- 选项卡 end -->
		  </view>
		  <!-- 头部end -->
		  <!-- 内容 -->
		  <view class="content">
		    <view v-if="datas.content.show_style_type==1">    
		      <view class="list" v-if="merchants_list.length > 0">
		        <view class="list-item flex align-items-center" v-for="(item,index) in merchants_list" :key="index" @click="go_shop"
		          :data-id="item.id" :data-templateId="item.template_id">
		          <view class="list-item-merchantsImage">
		            <image :src="http_host + item.logo"></image>
		            <view class="list-item-tips" v-if="item.shop_status==0">休息中</view>
		          </view>
		          <view class="list-item-merchantsInfo">
		            <view class="list-item-merchantsInfo-name flex align-items-center">
		              <view>{{item.supply_name}}</view>
		              <view class="list-item-merchantsInfo-distance" v-if="item.delivery==2">距离 {{item.instance}}
		              </view>
		            </view>
		            <view class="list-item-merchantsInf-score flex align-items-center">
		              <view
		                :style="'background-image: url('+http_host+'/offline_shopping/web/static/images/204@2x.png);width:'+(parseFloat(item.score)<=0? 14 : 28*parseFloat(item.score) )+'rpx'"
		                class="list-item-merchantsInf-score-bg"></view>
		              <view> {{item.score}}分</view>
		            </view>
		            <view class="list-item-merchantsInf-areaAndNumber">
		              <span v-if="item.delivery==1">全国配送</span>
		              <span v-if="item.delivery==2">区域配送</span>
		              <span v-if="item.is_show_monthly_sale==1">月售{{item.sell_count}}</span>
		            </view>
		            <view class="list-item-merchantsInf-preferential flex align-items-center">
		              <view class="list-item-merchantsInf-preferential-tag" :class="it=='领券'?'coupons':''" v-for="(it,index) in item.tag"
		                :key="index">{{it}}</view>
		            </view>
		          </view>
		        </view>
		      </view>
		    </view>      
		
		    <!-- 切换列表 -->
		    <view class="shopping60-goods-list" v-if="datas.content.show_style_type==2">
		      <view class="shopping60-goods" v-for="(item,index) in merchants_list" :key="index" @click="go_shop"
		        :data-id="item.id" :data-templateId="item.template_id">
		        <view class="shopping60-goods-pic">
		          <image :src="http_host +item.logo" alt=""></image>
		        </view>
		        <view class="shopping60-goods-info">
		          <view class="shopping60-goods-info-title">
		            {{item.supply_name}}
		          </view>
		          <view class="shopping60-goods-info-detail">
		            <view class="shopping60-goods-info-detail-score">
		              <view
		              :style="'background-image: url('+ http_host+ '/offline_shopping/web/static/images/204@2x.png);'+'width:'+(parseFloat(item.score)<=0?14:28 * parseFloat(item.score))+'rpx;'"
		              class="shopping60-goods-info-detail-score-bg"></view>
		              <view class="shopping60-goods-info-detail-score-text">{{item.score}}分</view>
		            </view>
		            <view class="shopping60-goods-info-detail-distant">
		              <image :src="http_host +'/offline_shopping/web/static/images/资源 31@2x.png'" alt=""></image>
		              <span class="shopping60-goods-distance">{{item.instance}}</span>
		            </view>
		          </view>
		        </view>
		      </view>
		    </view>     
		
			<view
		      class="empty"
		      @click="addPage"
		      v-if="merchants_list.length > 0 && pageCurrent < pageCount"
		    >
		      <view>点击加载更多</view>
		    </view>
			<view class="empty"  v-if="merchants_list.length > 0 && pageCurrent >= pageCount">
				 <view>全部加载完毕</view>
			</view>
		    <view
		      class="empty"
		      style="height: 60vh;"
		      v-if="merchants_list.length <= 0"
		    >
		      <image :src="http_host+'/offline_shopping/web/static/images/shop/empty.png'"></image>
		      <view>暂无相关数据~</view>
		    </view>
		  </view>
		  <!-- 内容 end -->
		</view>
		
		
		<!-- 筛选 -->
		<view class="mask" v-if="filter_show" catchtouchmove="true">
		  <view class="mask-box" catchtouchmove="true" @click="handelFilterChange"></view>
		  <view class="popup-filter" :class="filter_show?'popups-left-active':'' " :style="'height:'+filter_height">
		    <view class="filter-box">
		      <scroll-view scroll-y="true" class="filter-list">
		        <view class="filter-list-item">
		          <view class="filter-list-item-title">配送类型</view>
		          <view class="filter-list-item-tag flex wrap align-items-center">
		            <view
						class="filter-list-item-tag-item"
		              :class="indexOf(distributionTypeFilter,'1')?'filter-list-tag-active skin-bd-'+theme:''"
		              data-id="1" @click="handelDistributionTypeChange">全国配送</view>
		            <view
					  class="filter-list-item-tag-item"
		              :class="indexOf(distributionTypeFilter,'2')?'filter-list-tag-active skin-bd-'+theme:''"
		              data-id="2" @click="handelDistributionTypeChange">区域配送</view>
		            <view
						class="filter-list-item-tag-item"
		              :class="indexOf(distributionTypeFilter,'3')?'filter-list-tag-active skin-bd-'+theme:''"
		              data-id="3" @click="handelDistributionTypeChange">到店自提</view>
		          </view>
		        </view>
		        <view class="filter-list-item">
		          <view class="filter-list-item-title">行业类型</view>
		          <view class="filter-list-item-tag flex wrap align-items-center">
		            <view
						class="filter-list-item-tag-item"
		              :class="indexOf(industryTypeFilter,item.id)?'filter-list-tag-active skin-bd-'+theme:''"
		              v-for="item in industryType" :key="item.id"  @click="handelIndustryTypeChange(item.id)">
		              {{item.name}}
		            </view>
		          </view>
		        </view>
		        <view class="filter-list-item">
		          <view class="filter-list-item-title">距离</view>
		          <view class="filter-list-item-tag flex wrap align-items-center">
		            <view class="filter-list-item-tag-item" :class="distanceTypeFilter==1?'filter-list-tag-active skin-bd-'+theme :''"
		              data-id="1" @click="handelDistanceTypeChange"><text decode="true">&lt; 3km</text></view>
		            <view class="filter-list-item-tag-item" :class="distanceTypeFilter==2?'filter-list-tag-active skin-bd-'+theme :''"
		              data-id="2" @click="handelDistanceTypeChange"><text decode="true">&lt; 5km</text></view>
		            <view class="filter-list-item-tag-item" :class="distanceTypeFilter==3?'filter-list-tag-active skin-bd-'+theme :''"
		              data-id="3" @click="handelDistanceTypeChange"><text decode="true">&lt; 10km</text></view>
		            <view class="filter-list-item-tag-item" :class="distanceTypeFilter==4?'filter-list-tag-active skin-bd-'+theme :''"
		              data-id="4" @click="handelDistanceTypeChange"><text decode="true">&gt; 10km</text></view>
		          </view>
		        </view>
		      </scroll-view>
		      <view class="filter-btn flex align-items-center">
		        <view :class="'skin-color-' + theme + 'skin-bd-'+theme" @click="handelScreenToReset">重置</view>
		        <view :class="'skin-bg-'+theme+ 'skin-bd-'+theme" @click="handelScreeningConfirmation">完成</view>
		      </view>
		    </view>
		  </view>
		</view>
		<!-- 筛选 end -->
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
	  data(){
		  return {
		    theme: getApp().globalData.style_color, //主题色
		    http_host:'', //域名
		    jumpPage: "", //跳转页面来源 delivering_system=配送系统
		    tabs_index: 2, //1=推荐、，2=距离，3=销量，4=评分
		    tabs_index_sort1: "asc", //距离排序
		    tabs_index_sort2: "desc", //销量排序
		    tabs_index_sort3: "desc", //评分排序
		    distributionTypeFilter: [], //配送类型筛选
		    industryTypeFilter: [], //行业类型筛选
		    distanceTypeFilter: "", //距离类型筛选  1= <3km   2= <5km     3= <10km     4= >10km
		    industryType: [], //行业类型
		    filter_show: false, //筛选弹出层
		    filter_height: "100%", //筛选弹出层高度
		    search_show: false, //搜索栏
		    search_value: "", //搜索内容
		    longitude: 0, //经度
		    latitude: 0, //纬度
		    pageCurrent: 1, //当前页码
		    pageCount: 0, //总页码
		    merchants_list: [], //商家列表
		    position_city: {}, //定位所在城市信息
		  }
	  },
	  /**
	   * 组件的方法列表
	   */
	  methods: {
		  strParseFloat(value) {
		      return parseFloat(value ? value : 0)
		    },
		  indexOf(array, value) {
		      if (array.indexOf(value) > -1) {
		        return true
		      } else {
		        return false
		      }
		    },
	    //页面跳转
	    go_shop: function (e) {
	      let shop_id = e.currentTarget.dataset.id //店铺编号

	      let template_id = e.currentTarget.dataset.templateid
		  
		  
		  var url = "/offline_shopping/web/index.php?m=allPage&a=shop&id="+shop_id+'&customer_id='+this.vuex_customer_id

		  this.$common.diyLinkJump(url,"h5",true);
		 
	    },
	    //  筛选条件 确认
	    handelScreeningConfirmation() {
	      var that = this
		  that.filter_show = false
	      //根据筛选条件 获取店铺数据列表
	      that.get_store_list(1)
	    },
	    // 筛选条件 重置
	    handelScreenToReset() {
	      var that = this
		  that.distributionTypeFilter = []
		  that.industryTypeFilter = []
		  that.distanceTypeFilter = ''
	    },
	    // 配送类型
	    handelDistributionTypeChange(e) {
	      var that = this
	      let id = e.currentTarget.dataset.id
	      if (this.distributionTypeFilter.indexOf(id) != -1) {
	        this.distributionTypeFilter = this.distributionTypeFilter.filter((ele)=> {
	          return ele != id
	        })
	      } else {
	         this.distributionTypeFilter.unshift(id)
	      }
	    },
	    // 行业类型筛选
	    handelIndustryTypeChange(itemId) {
	      var that = this
	      let id = itemId
	      if (that.industryTypeFilter.indexOf(id) != -1) {
	        this.industryTypeFilter = that.industryTypeFilter.filter(function (ele) {
			  return ele != id
	        })
	      } else {
	        this.industryTypeFilter.unshift(id)
	      }
		  
	    },
	    // 距离类型筛选
	    handelDistanceTypeChange(e) {
	      var that = this
	      let id = e.currentTarget.dataset.id
		  that.distanceTypeFilter = that.datas.distanceTypeFilter != id? id :''
	    },
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
	          break
	        case "3":
			  that.tabs_index_sort2 = sort
	          break
	        case "4":
			  that.tabs_index_sort3 = sort
	          break
	
	        default:
	          break
	      }
		  that.tabs_index = index
	      // 获取数据
	      that.get_store_list(1)
	    },
	    // 搜索栏 文本清空
	    handelSearchEmpty() {
	      var that = this
		  that.search_value = ''
	      //获取数据
	      that.get_store_list(1)
	    },
	    // 搜索栏 文本监听
	    handelSearchInputChange(e) {
	      var that = this
	      let value = e.detail.value
		  that.search_value = value
	      // 获取数据
	      that.get_store_list(1)
	    },
	    // 搜索栏
	    handelSearchChange() {
	      var that = this
	      if (that.datas.search_value != "") {
			that.search_value = ''
	        // 重新获取数据
	        that.get_store_list(1)
	      }
		  that.search_show = !that.datas.search_show
	    },
	    // 筛选 弹出层
	    handelFilterChange() {
		  this.filter_show = !this.filter_show
	    },
	    /**
	     * 根据经纬度获取城市
	     * @method get_location
	     * @param {float}    lng        经度
	     * @param {float}    lat        纬度
	     */
	    get_location() {
	      var that = this
		  let longitude = uni.getStorageSync('longitude')
		  let latitude = uni.getStorageSync('latitude')
		  let params = {
			  ip: "",
			  type: "mini_program",
			  lng: longitude || that.longitude,
			  lat: latitude || that.latitude,
		  }
		  this.$api.osGetLocation(params).then(res => {
			if (res.errcode == 0) {
			     let position_city = {
			       area_code: res.result.area_code,
			       area_name: res.result.city,
			     }
				that.position_city = position_city
				that.latitude = res.result.location.lat
				that.longitude = res.result.location.lng
			   } else {
				   setTimeout(function(){
					   if(that.longitude!=''&&that.latitude!=''){
					   }else{
						   uni.showToast({
							 title: res.errmsg,
							 icon: "none",
						   })
					   }
				   },1500)
			     
			   }
			   //门店列表
			    that.get_store_list(1)
		  })
		  uni.removeStorageSync('latitude')
		  uni.removeStorageSync('longitude')
	    },
	    /**
	     * 获取店铺行业筛选类型
	     * @method get_supply_type
	     */
	    get_supply_type() {
	      var that = this
		  let parmar = {}
		  this.$api.osGetIndustryType(parmar).then(res=>{
			  uni.showLoading({
			  		title: "加载中...",
			  })
			  if(res.errcode == 0){
				  that.industryType = res.data
			  }
		  })
	    },
	    /**
	     * 商品数据列表
	     * @method get_store_list
	     * @param   {Number}    order       1=推荐、，2=距离，3=销量，4=评分
	     * @param   {Number}    page        当前页码
	     * @param   {float}     lat     纬度
	     * @param   {float}     lng     经度
	     * @param   {String}    search_val      搜索内容
	     * @param   {String}    order_type1     距离排序 asc-desc
	     * @param   {String}    order_type2     销量排序 asc-desc
	     * @param   {String}    order_type3     评分排序 asc-desc
	     * @param   {Array}     industry_type   行业类型筛选
	     * @param   {Array}     distribution_type   配送类型筛选
	     * @param   {Array}     distance_type       距离类型筛选
	     * @param   {Number}    ok_screen       1=筛选
	     * @param   {Number}    show_num        显示条数
	     */
	    get_store_list(pageCurrent = 1) {
	      var that = this
	      uni.showLoading({
	        title: "加载中...",
	      })
		  let { show_num } = that.datas.content
	      if (pageCurrent == 1 && that.merchants_list.length > 0) {

			that.merchants_list = []
	      }
		  let params = {
		      order: that.tabs_index,
		      page: pageCurrent,
		      lat: that.latitude,
		      lng: that.longitude,
		      search_val: that.search_value,
		      order_type: that.tabs_index_sort1,
		      order_type1: that.tabs_index_sort2,
		      order_type2: that.tabs_index_sort3,
		      industry_type: JSON.stringify(that.industryTypeFilter),
		      distribution_type: JSON.stringify(that.distributionTypeFilter.sort()),
		      distance_type:that.distanceTypeFilter,
		      ok_screen: 1,
		      page_size: show_num,
		    }
		  this.$api.osGetStoreList(params).then(res=>{
			  if (res.errcode == 0) {
			        let merchants_list = that.merchants_list
			        let list =
			          merchants_list.length > 0
			            ? JSON.parse(JSON.stringify(merchants_list))
			            : []
			        list = [...list, ...res.data]
					that.merchants_list = list
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
		
		addPage() {
			var that = this
			let pageCurrent = that.pageCurrent;
			let pageCount = that.pageCount;
			// 当前页码大于等于总页码
			if (pageCurrent >= pageCount) {
			  //停止执行
			  return
			}
			// 当前页码+1
			pageCurrent++
		
			// 获取数据
			that.get_store_list(pageCurrent)
		},
	  },
	 created(){
		 this.http_host = this.vuex_apiUrl
		
	 },
	  mounted() {

	    var that = this
		that.theme = getApp().globalData.style_color
		that.http_host = this.vuex_apiUrl
	    //清除二级页面缓存
	    uni.getStorageInfo({
	      success: function (res) {
	        for (let value of res.keys) {
	          // 清除自定义模板缓存
	          if (value.includes("bottom_list")) {
				that.filter_height = 'calc(100%-100rpx)'
	          }
	        }
	      },
	    })
	    //筛选分类
		let show_menu_type = that.datas.content.show_menu_type
	    if (show_menu_type == 2) {
		  that.industryTypeFilter = that.datas.content.choose_cate
	    }
		that.get_supply_type()
	  uni.showLoading({
		title: "定位中...",
	  })
	    // 获取所在城市经纬度
	    uni.getLocation({
	      type: "wgs84",
	      success(res) {
			that.latitude = res.latitude
			that.longitude = res.longitude
	        // 根据经纬度获取城市
			that.get_location()
	      },
	      fail(res) {
			  that.get_location()
			  uni.showToast({
			  	title:'获取地理位置失败！',
				icon:'none'
			  })
	      }      
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
	
	.tabs-left-itam:nth-child(2) .tabs-left-item-top > image {
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
	
	/* 筛选 */
	.screen > image {
	  height: 30rpx;
	  width: 30rpx;
	}
	
	/* 筛选 end */
	/* 选项卡 */
	
	/* 头部 end */
	
	/* 内容 */
	.list {
	  margin: 0 20rpx;
	}
	
	.list-item {
	  margin-top: 20rpx;
	  padding: 10rpx;
	  border-radius: 10rpx;
	  background-color: #ffffff;
	}
	
	.list-item:last-child {
	  margin-bottom: 20rpx;
	}
	
	.list-item-merchantsImage {
	  position: relative;
	  margin: 10rpx 15rpx 10rpx 10rpx;
	  height: 130rpx;
	  width: 130rpx;
	}
	
	.list-item-merchantsImage > image {
	  height: 100%;
	  width: 100%;
	}
	
	.list-item-merchantsImage .list-item-tips {
	  position: absolute;
	  width: 100%;
	  left: 0;
	  bottom: 0;
	  text-align: center;
	  font-size: 24rpx;
	  color: rgb(255, 255, 255);
	  background-color: rgba(0, 0, 0, 0.8);
	  opacity: 0.6;
	}
	
	.list-item-merchantsInfo {
	  flex: 1;
	  font-size: 22rpx;
	}
	
	.list-item-merchantsInfo-name {
	  font-size: 28rpx;
	  color: #000000;
	  justify-content: space-between;
	}
	
	.list-item-merchantsInfo-distance {
	  font-size: 22rpx;
	  color: #5c5c5c;
	}
	
	.list-item-merchantsInf-score {
	  color: #ff0000;
	}
	
	.list-item-merchantsInf-score-bg {
	  margin-right: 10rpx;
	  height: 20rpx;
	  width: 29rpx;
	  background-size: 30rpx;
	}
	
	.list-item-merchantsInf-areaAndNumber {
	  color: #959595;
	}
	
	.list-item-merchantsInf-areaAndNumber > span {
	  margin-right: 10rpx;
	}
	
	.list-item-merchantsInf-preferential-tag {
	  height: 25rpx;
	  line-height: 25rpx;
	  margin: 10rpx 10rpx 5rpx 0;
	  padding: 0 10rpx;
	  color: #fe7575;
	  font-size: 15rpx;
	  border: 1px solid #fe7575;
	  border-radius: 5rpx;
	}
	
	.list-item-merchantsInf-preferential-tag.coupons {
	  color: #ffffff;
	  background-image: linear-gradient(to left, #ff7d47, #ff5555);
	}
	
	/* 内容 end */
	
	/* 筛选 弹出层 */
	.popup-filter {
	  position: absolute;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  width: 480rpx;
	  height: 100%;
	  border-top-left-radius: 20rpx;
	  border-bottom-left-radius: 20rpx;
	  background-color: #ffffff;
	  z-index: 99;
	}
	
	.filter-box {
	  height: calc(100% - 40rpx);
	  margin-left: 30rpx;
	}
	
	.filter-list {
	  height: 88%;
	  padding-top: 40rpx;
	  
	}
	
	/* 隐藏滚动条 */
	::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	  display: none;
	}
	
	.filter-btn {
	  height: 12%;
	  justify-content: center;
	  font-size: 28rpx;
	}
	
	.filter-btn > view {
	  width: 40%;
	  height: 60rpx;
	  line-height: 60rpx;
	  text-align: center;
	}
	
	.filter-btn > view:first-child {
	  color: #7f8aef;
	  border: 1rpx solid #7f8aef;
	  border-top-left-radius: 60rpx;
	  border-bottom-left-radius: 60rpx;
	}
	
	.filter-btn > view:last-child {
	  color: #ffffff;
	  border: 1rpx solid #7f8aef;
	  background-color: #7f8aef;
	  border-top-right-radius: 60rpx;
	  border-bottom-right-radius: 60rpx;
	}
	
	.filter-list-item {
	  padding-bottom: 40rpx;
	}
	.filter-list-item:last-child {
	  padding-bottom: 0;
	}
	.filter-list-item-title {
	  font-size: 26rpx;
	  color: #000000;
	}
	
	.filter-list-item-tag-item {
	  width: 130rpx;
	  margin-top: 20rpx;
	  margin-right: 15rpx;
	  padding: 10rpx 0;
	  font-size: 24rpx;
	  text-align: center;
	  color: #666666;
	  background-color: #f5f5f5;
	  border: 1rpx solid transparent;
	  border-radius: 10rpx;
	}
	
	/* 选中 */
	.filter-list-tag-active {
	  border-color: #7f8aef;
	}
	
	/* 筛选 弹出层  end */
	
	/* 切换列表 */
	.shopping60-goods-list {
	  display: flex;
	  flex-wrap: wrap;
	  padding: 0 20rpx;
	  justify-content: space-between;
	}
	
	.shopping60-goods {
	  margin-top: 20rpx;
	  border-radius: 10rpx;
	  width: 49%;
	  background-color: #fff;
	}
	
	.shopping60-goods-pic {
	  width: 100%;
	  padding-top: 100%;
	  position: relative;
	}
	
	.shopping60-goods-pic>image {
	  width: 100%;
	  height: 100%;
	  position: absolute;
	  top: 0;
	  left: 0;
	}
	
	.shopping60-goods-info {
	  padding: 20rpx 14rpx;
	}
	
	.shopping60-goods-info-title {
	  width: 100%;
	  font-size: 32rpx;
	  color: #333;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  font-weight: 700;
	}
	
	.shopping60-goods-info-detail {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}
	
	.shopping60-goods-info-detail-score {
	  display: flex;
	  align-items: center;
	  margin-top: 6rpx;     
	}
	
	.shopping60-goods-info-detail-score-bg {
	  height: 20rpx;
	  width: 30rpx;
	  background-size: 30rpx;
	}
	
	.shopping60-goods-info-detail-score-text {
	  margin-left: 10rpx;
	  margin-top: 2rpx;    
	  font-size: 22rpx;
	  color: #FF0000;
	}
	.shopping60-goods-info-detail-distant{
		width: 50%;
		display: flex;
		flex-wrap: nowrap;
		flex-direction: end;
	}
	.shopping60-goods-info-detail-distant>image {
	  width: 24rpx;
	  height: 24rpx;
	  vertical-align: middle;
	}
	
	.shopping60-goods-info-detail-distant>span {
	  width: 18rpx;
	  height: 24rpx;
	  font-size: 22rpx;
	  color: #999999;
	}
	/* 切换列表 end */
	
	/* 暂无数据 */
	.empty {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  color: #999999;
	  font-size: 28rpx;
	  padding: 40rpx;
	}
	
	.empty > image {
	  height: calc(450px * 0.3);
	  width: calc(200px * 0.8);
	}
	
	/* 暂无数据 end */
</style>