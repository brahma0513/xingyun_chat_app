<template>
	<view>
		<!-- 导航栏 -->
		<navbar ref="navbar" :config="config" v-if="indexs==0" />
		<!-- 状态栏和标题，必须是页面的第一个组件才启用 -->
		<view  v-if="indexs==0">
			<!-- 占位 -->
			<view :style="'height:'+titleHeight+'px'" ></view>
		</view>
		<view :style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+ ( datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none' ) + ';padding:'+(datas.content.padding_top+'px ')+(datas.content.select_style==1?datas.content.padding_horizontal:'0')+'px ' + datas.content.padding_bottom+'px;background-size:100% 100%;'">
		  <block v-if="datas.content.select_style==3">
		    <scroll-view scroll-x="true" class="swiper-list" :style="'border-radius:'+(datas.content.image_style==2?datas.content.radius_diy:'0')+'px;'">
		      <block v-for="(item,index) in datas.content.dataset">
		        <view class="list" :style="'margin-left: '+(index==0?datas.content.padding_left:0)+'px;'">
					<image :src="item.pic" mode="widthFix" :style="'height: '+height+'px;'" class="slide-image"  @click="$common.diyLinkJump(item.link)" @load="setContainerHeight" :lazy-load="true"></image>
		        </view>
		      </block>
		    </scroll-view>
		  </block>
		  <block v-else>
		    <block v-if="datas.content.css_type == 1">
		      <view class='custom-swiper' :style="'border-radius:'+(datas.content.image_style==2?datas.content.radius_diy:'0')+'px;'">
		        <swiper :style="'height: '+(height)+'px;'" :indicator-dots="datas.content.banner_style==2||datas.content.banner_style==3?false:true" indicator-color="rgba(255, 255, 255, 0.6)"	indicator-active-color="#fff" :autoplay="true" :circular="true" :current="swiperCurrent" @change="swiperChange">					
		          <block style="position:relative;" v-for="(item,index) in datas.content.dataset">
		            <swiper-item>
						<image :src="item.pic" mode="aspectFill" :data-ind="index" class="slide-image" :lazy-load="true" :style="'height: '+list[index]+'px;'"  @click="$common.diyLinkJump(item.link)" @load="setContainerHeight"></image>
		              <!-- 左边图标 -->
		              <view v-if="datas.content.banner_style==2" class="swiper-style-left-2" @click="swiperLeft" :data-list="datas.content.dataset">
		                <image class="right" :src="vuex_apiUrl+'/wsy_pub/web/static/images/left_swiper.png'" />
		              </view>
		              <!-- 右边图标 -->
		              <view v-if="datas.content.banner_style==2" class="swiper-style-right-2" @click="swiperRight" :data-list="datas.content.dataset">
		                <image class="right" :src="vuex_apiUrl+'/wsy_pub/web/static/images/right_swiper.png'" />
		              </view>
		              <view v-if="datas.content.banner_style==3&&datas.content.dataset.length>0" class="swiper-style-3 flex-def flex-cCenter flex-zCenter">{{index+1}}/{{datas.content.dataset.length}}</view>
		            </swiper-item>
		          </block>
		        </swiper>
		      </view>
		    </block>
		    <block v-else-if="datas.content.css_type == 2">
		      <view class='custom-swiper' :style="'border-radius:'+(datas.content.image_style==2?datas.content.radius_diy:'0')+'px;'">
		        <block v-for="(item,index) in datas.content.dataset" >
		          <view class='swiper-img' :style="'margin-bottom: '+datas.content.margin+'px;'">
					<image :src="item.pic" mode="aspectFill" :lazy-load="true"  @click="$common.diyLinkJump(item.link)" :data-test="item.pic" ></image>
		          </view>
		        </block>
		      </view>
		    </block>
		  </block>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/base/components/navbar/navbar.vue'
	export default {
		name:"myNewSwiper",
		props:{
			datas:{
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
			}
		},
		components:{navbar},
		data() {
			return {
				swiperCurrent: 0, // 轮播图片下表
				swiperError:0,
				height: 0, // 轮播图片高度
				padding:0,
				list: [],
				timestamp: '',	//时间戳
				
				config:{
					// 可不固定
					fixed: true,
					back: false,
					title: ['',''],
					color: ['#000', '#000'],
					//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
					// backgroundColor: [1,['#a9a1ff','#6970ff','#ff55ff','#ff9999']],
					backgroundColor: [1,['#f8f8f8','#f8f8f8']],
					// 滑动屏幕后切换颜色，注意颜色为数组时长度必须一样，还有使用滑动切换必须监听 onPageScroll 事件
					slideBackgroundColor: [1,['#f8f8f8','#f8f8f8']],
					// 状态栏 ，数组则为滑动变色
					statusBarBackground:['','#f8f8f8'],
					//状态栏字体颜色，只支持#000000 和#FFFFFF（如果需要屏幕滑动变色，参数则为数组，例子：['#000000','#ffffff']）
					rightButton:[],
				},
				
				titleHeight: 0,
			};
		},
		onPageScroll(e) {
			// 重点，用到滑动切换必须加上
			this.$refs.navbar.pageScroll(e);
		},
		created(){
			var that = this;
			this.titleHeight = this.statusBarHeight+44;
			this.config.title = [this.page_title,this.page_title]
				
			// if(that.datas.content.size==1){
			// 	that.height = '187.5';
			// }else if(that.datas.content.size==2){
			// 	that.height = '130.2';
			// }else{
			// 	that.height = '';
			// }
		},
		mounted() {
			// setTimeout(function(){
			// 	var that = this;
			// 	that.timestamp = new Date().getTime();
			// 	let imgView = uni.createSelectorQuery().select(".swiper-image-diy-"+that.timestamp);
			// 	imgView.boundingClientRect(data => {
			// 		if(data){
			// 			that.height = data.height;
			// 		}
			// 	}).exec();
			// },500)
		},
		methods: {
			setContainerHeight: function(e){
			  let ind = e.currentTarget.dataset.ind;
			  var list= this.list;
			  var imgWidth = e.detail.width;
			  var imgHeight = e.detail.height;
			  var sysInfo = uni.getSystemInfoSync();
			  var screenWidth = sysInfo.screenWidth;
			  var scale = screenWidth / imgWidth;
			  var height = imgHeight * scale;
			  console.log("ind="+ind+'imgHeight='+imgHeight+'scale='+scale+'height='+height)
			  list[ind] = height;
			  this.list = list;
			  this.height = this.list[this.swiperCurrent]
			},
			// 轮播图改变事件
			swiperChange: function (e) {
			  if (e.detail.current == 0) {
			    let swiperError = this.swiperError
			    swiperError += 1
			    this.swiperError = swiperError
			    if (swiperError >= 3) {
			      console.error('开关', this.swiperError)
			      //，重置current为正确索引
			      this.swiperCurrent = this.swiperCurrent
			      this.swiperError = 0
			    }
			  } else {
				this.swiperCurrent = e.detail.current,
				this.swiperError = 0
			  }
			  this.height = this.list[e.detail.current]
			},
			//点击右边小箭头
			swiperRight: function (e) {
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
			swiperLeft: function (e) {
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
			// 打开另一个小程序
			open_mr: function (e) {
			  
			},
		},
		computed:{
			//获取系统状态栏高度
			statusBarHeight(){
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight
			},
			navbarHeight(){
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight + that.conf.height + 'px'
			},
			screenWidth(){
				return uni.getSystemInfoSync().screenWidth;
			}
		}
	}
</script>

<style>
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

.custom-swiper .swiper-img{
  font-size: 0;
}

.custom-swiper .swiper-img:nth-last-child(1){
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

.swiper-list{
  box-sizing: border-box;
  white-space: nowrap;
  width: 100%;
}
.swiper-list .list{
  margin-right: 8px;
  width: 334px;
  display: inline-block;
  vertical-align: middle;
  font-size: 0;
}
.swiper-list .list:nth-last-child(1){
  margin-right: 0;
}
.swiper-list .list image{
  width: 334px;
}
</style>
