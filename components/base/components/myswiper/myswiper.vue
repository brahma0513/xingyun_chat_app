<template>
	<view>
		<!-- 导航栏 -->
		<navbar ref="navbar" :config="config" v-if="indexs==0" />
		<!-- 状态栏和标题，必须是页面的第一个组件才启用 -->
		<view  v-if="indexs==0">
			<!-- 占位 -->
			<view :style="'height:'+titleHeight+'px'" ></view>
		</view>
		
		<view :class="'custom-swiper type'+datas.content.style"
		:style="'padding:'+(datas.content.padding_top==undefined?datas.content.padding:datas.content.padding_top)+'px '+(datas.content.style==1?'15':'0')+'px '+(datas.content.padding_bottom==undefined?datas.content.padding:datas.content.padding_bottom)+'px;'">
			<block v-if="datas.content.css_type == 1">
				<swiper :indicator-dots="datas.content.banner_style==2||datas.content.banner_style==3?false:true" :autoplay="true" :interval="3000" :duration="1000" :style="'height:'+height+'px'" :current="swiperCurrent">
					<swiper-item v-for="(item,index) in datas.content.dataset">
						<image :src="item.pic" :mode="datas.content.size==3?'widthFix':''" :class="'swiper-image-diy-'+timestamp" :style="'height:'+height+'px;border-radius:'+(datas.content.image_style==1?'0':'10')+'px' "  @click="$common.diyLinkJump(item.link)" @load="loadFinish"></image>
						<view class="swiper-style-left-2" v-if="datas.content.banner_style==2" @click="swiperLeft(datas.content.dataset)">
							<image class="right" :src="vuex_apiUrl+'/wsy_pub/web/static/images/left_swiper.png'" />
						</view>
						<view class="swiper-style-right-2" v-if="datas.content.banner_style==2" @click="swiperRight(datas.content.dataset)">
							<image class="right" :src="vuex_apiUrl+'/wsy_pub/web/static/images/right_swiper.png'" />
						</view>
						<!-- 样式三 -->
						<view v-if="datas.content.banner_style==3&&datas.content.dataset.length>0" class="swiper-style-3">{{index+1}}/{{datas.content.dataset.length}}</view>
					</swiper-item>
				</swiper>
			</block>
			<block v-if="datas.content.css_type == 2">
				<block v-for="(item,index) in datas.content.dataset">
					<view class='swiper-img' :style="'margin-bottom:'+datas.content.margin+'px;font-size:0;'">
						<image :src="item.pic" :mode="datas.content.size==3?'widthFix':''" :style="'border-radius:'+(datas.content.image_style==1?'0':'10')+'px'" :class="datas.content.size==2?'height swiper-image-diy':'swiper-image-diy'"  @click="$common.diyLinkJump(item.link)" @load="loadFinish"></image>
					</view>
				</block>
			</block>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/base/components/navbar/navbar.vue'
	export default {
		name:"myswiper",
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
			// that.timestamp = new Date().getTime();
			if(that.datas.content.size==1){
				that.height = '187.5';
			}else if(that.datas.content.size==2){
				that.height = '130.2';
			}else{
				that.height = '';
			}
			
			// this.datas.content.bar_style=2;
			// this.datas.content.bar_bg_model=1;
			// this.datas.content.bar_bg_color='#0000ff'; 
			
			this.titleHeight = this.statusBarHeight+44;
			this.config.title = [this.page_title,this.page_title]
		},		
		mounted() {
			setTimeout(function(){
				var that = this;
				that.timestamp = new Date().getTime();
				let imgView = uni.createSelectorQuery().select(".swiper-image-diy-"+that.timestamp);
				imgView.boundingClientRect(data => {
					if(data){
						that.height = data.height;
					}
				}).exec();
			},500)
		},
		methods:{
			loadFinish: function(){
				var that = this;
				that.timestamp = new Date().getTime();
				setTimeout(function(){
					let imgView = uni.createSelectorQuery().select(".swiper-image-diy-"+that.timestamp);
					imgView.boundingClientRect(data => {
						if(data){
							that.height = data.height;
						}
					}).exec();
				},600)
			},
			setContainerHeight: function(e){
			  var imgWidth = e.detail.width;
			  var imgHeight = e.detail.height;
			  var sysInfo = uni.getSystemInfoSync();
			  var screenWidth = sysInfo.screenWidth;
			  var scale = screenWidth / imgWidth;
			  this.list.push(imgHeight * scale);
			  this.list.sort(function(a,b){
				return a-b;
			  })
			  this.height = this.data.list[this.list.length-1]
			},
			//点击右边小箭头
			swiperLeft(e){
				var index = this.swiperCurrent,
				list = []
				list = e
				if (index < 1) {
					index = list.length - 1
				} else {
					index = index - 1
				}
				this.swiperCurrent = index
			},
			//点击右边小箭头
			swiperRight(e){
				var index = this.swiperCurrent,
				list = []
				list = e
				if (index >= list.length - 1) {
					index = 0
				} else {
					index = index + 1
				}
				this.swiperCurrent = index
			}
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
	.custom-swiper {
	  width: 100%;
	  box-sizing: border-box;
	  padding-left: 20rpx;
	  padding-right: 20rpx;
	}
	
	.custom-swiper.type2 {
	  padding-left: 0px;
	  padding-right: 0px;
	}
	.custom-swiper .right{
		width:40rpx;
		height:40rpx;
	}
	.custom-swiper .swiper-style-left-2 {
	  position: absolute;
	  left: 7px;
	  top: 43%;
	}
	.custom-swiper .swiper-style-right-2 {
	  position: absolute;
	  right: 7px;
	  top: 43%;
	}
	.custom-swiper .swiper-style-3 {
		background: rgba(0, 0, 0, 0.5);
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		position: absolute;
		bottom: 4px;
		right: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		/* z-index: 999; */
	}
	.custom-swiper .swiper-img image {
	  width: 100%;
	  height: 375rpx;
	}
	.custom-swiper swiper {
	  height: 375rpx;
	  width: 100%;
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
</style>
