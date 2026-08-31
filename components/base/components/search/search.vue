<template>
	<view>
		<!-- 导航栏 -->
		<navbar ref="navbar" :config="config" v-if="indexs==0" />
		<!-- 状态栏和标题，必须是页面的第一个组件才启用 -->
		<view  v-if="indexs==0">
			<!-- 占位 -->
			<view :style="'height:'+titleHeight+'px'" ></view>
		</view>
		
		<view class="search-box" 
			:style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 0 '+
			(datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px'"
			@click="bindsearch">
			<view class="search-bar" :style="'background-color:'+datas.content.bg_color">
				<view class="search-bar__form" :style="'height:35px;line-height:35px;border-radius:'+(datas.content.radius_style==1?'30px':'0')">
					<label class="search-bar__label" :style="'padding-left: 10px;text-align:'+(datas.content.align_style==1?'center;':'left;')+'border-radius:'+(datas.content.radius_style==1?'30px':'0')">
						<icon class="icon-search" type="search" size="14" :color="skin_color"></icon>
						<view class="search-bar__text">
							{{datas.content.placeholder?datas.content.placeholder:'搜索'}}
						</view>
					</label>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/base/components/navbar/navbar.vue'
	export default {
		name:"search",
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
				skin_color:'green',
				current_city:'',
				city_code:'',
				
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
		created(){
			this.titleHeight = this.statusBarHeight+44;
			this.config.title = [this.page_title,this.page_title]
		},
		beforeMount(){
			this.skin_color = getApp().globalData.style_color
		},
		activated: function() {  
			var that = this;
			var current_city = uni.getStorageSync('current_city') || [];
			if (current_city.length > 0) {
				that.current_city = JSON.parse(current_city).area_name
				that.city_code = JSON.parse(current_city).area_code
			}else{
				that.current_city = that.datas.content.city
				that.city_code = that.datas.content.city_code
			}
		},
		onPageScroll(e) {
			// 重点，用到滑动切换必须加上
			this.$refs.navbar.pageScroll(e);
		},
		methods:{
			bindsearch(){
				this.$common.diyLinkJump("/wsy_pub/web/index.php?m=app_index&a=search&tpl_id="+this.datas.diy_tem_contid+"&city_code="+this.city_code+"&keyword=","h5",true)
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
.no-hover{
  background-color: transparent
}
.search-box {
    display: block;
    position: relative;
    z-index: 0;
    flex: 1;
}

.search-bar {
    position: relative;
    padding: 10rpx 30rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    background-color: #ccc;
    font-weight: normal;
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
    -webkit-box-flex: 1;
    -webkit-flex: auto;
    flex: auto;
    background: #efeff4;
    border-radius: 10rpx;
}

.search-bar__form::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    /* border: 1px solid #e5e5e5; */
    box-sizing: border-box;
    width: 200%;
    height: 200%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: left top;
    transform-origin: left top;
}

.search-bar__label {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* z-index: 2; */
    text-align: center;
    color: #9b9b9b;
    background: #f5f5f5;
    line-height: 35px;
    font-size: 0;
    border-radius: 6px;
}
.icon-search {
    display: inline-block;
    vertical-align: middle;
    font: normal normal normal 14px/1 "";
    font-size: 26rpx;
    text-rendering: auto;
} 

/* 搜索 end */
</style>
