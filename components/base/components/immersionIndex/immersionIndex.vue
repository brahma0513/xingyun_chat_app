<template>
	<view >
		<!-- 导航栏 -->
		<!-- <navbar ref="navbar" :config="config" @clickBtn="onClickBtn" /> -->
		
		<view class="xingdian-navbar" :style="{width:screenWidth + 'px',position: conf.fixed?'fixed':'relative'}">
			<view class="xingdian-navbar__content"
			:style="{width:screenWidth + 'px',height: (navbarHeight+searchHeight), color: txtColor, backgroundColor: conf.select_bg_model==1?conf.bg_color:'transparent',backgroundImage:conf.select_bg_model==2?'linear-gradient('+conf.gradient_angle+','+conf.gradient_color1+','+conf.gradient_color2+','+conf.gradient_color3+')':conf.select_bg_model==3?'url('+conf.bg_img+')':'none', backgroundSize:'cover'}" >
		 
					<!-- #ifndef H5 -->
					<!-- 状态栏 -->
					<view :style="'height:' + statusBarHeight + 'px;'"  class="xingdian-navbar__status" v-if="conf.statusBar" ></view>
					<!-- #endif -->
			
					<view class="xingdian-navbar__content__main" v-if="conf.is_show_title!=2" :style="{ height: conf.height + 'px', lineHeight: conf.height + 'px',fontSize: conf.fontSize}">
						<view class="xingdian-navbar__content__main__left" :style="{ height: conf.height + 'px', fontSize: conf.fontSize}">
							<view v-if="conf.left_style==2">
								<text class="hxicon hx-navbar__icon" @click="onBack" :style="{color: txtColor}">&#xf0343;</text>
								<!-- <image class="back-image" mode="aspectFit" :src="conf.back_img"></image> -->
							</view>
							<view v-if="conf.left_style==3" @click="left_jump">
								<image id="left_image" :style="{width: leftWidth+'px'}" mode="aspectFit" :src="conf.left_img" @load="imageLoad"></image>
							</view>
						</view>	
						<view class="xingdian-navbar__content__main__center" :style="{ height: conf.height + 'px', lineHeight: conf.height + 'px', fontSize: conf.fontSize}">							
							<view v-if="datas.content.search_locate==2" :style="{width: centerLongWidth+'px'}">
								<!-- 新搜索框组件 -->
								<newSearch :datas="datas" :indexs="indexs" :page_title="page_title" :bar_style="2" ref="newSearch2" id="newSearch2" @handleCancel="handleCancel"></newSearch>
							</view>	
							<view v-else>
								<text class="hx_font_size hx_text_overflow" :style="{color: txtColor}" v-if="conf.center_style==1&&title">{{title}}</text>
								<image id="center_image" :style="{width: centerWidth+'px'}" mode="aspectFit" :src="conf.center_img" v-if="conf.center_style==2" @load="imageLoad"></image>
							</view>
						</view>	
						<view class="xingdian-navbar__content__main__right" :style="{ height: conf.height + 'px', lineHeight: conf.height + 'px', fontSize: conf.fontSize}">
							<view v-if="conf.is_show_right_img==1" @click="right_jump">
								<image id="right_image" :style="{width: rightWidth+'px'}" mode="aspectFit" :src="conf.right_img" @load="imageLoad"></image>
							</view>
							<view v-if="conf.left_style==2&&conf.is_show_right_img!=1&&datas.content.search_locate!=2" >
								<image  style="width: 44rpx;height: 44rpx;" mode="aspectFit" :src="conf.kong_image" ></image>
							</view>
						</view>
					</view>
					
					<view v-if="datas.content.search_locate==1">
						<!-- 新搜索框组件 -->
						<newSearch :datas="datas" :indexs="indexs" :page_title="page_title" :bar_style="2" ref="newSearch2" id="newSearch2" @handleCancel="handleCancel"></newSearch>
					</view>	
				</view>
		</view>
								
		
		
		<!-- 占位符，一般都需要 -->
		<view v-if="headPlaceholder && conf.fixed">
		  <view :style="{ height: statusBarHeight  + 'px'}" v-if="conf.statusBar" />
		  <view :style="{ height: conf.height + 'px'}" />
		  <view v-if="datas.content.search_locate==1&&indexs==0" :style="'height:' + searchHeight + 'px;' "  ></view>
		</view>
		
	</view>	
</template>

<script>
	import newSearch from '@/components/base/components/newSearch/newSearch.vue'
	export default {
		name:"immersionIndex",
		props:{
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
			}
		},
		
		components: {newSearch},
		data() {
			return {
				http_host: '',
				
				title: '',
				//当前使用文字颜色
				txtColor:'#333333',
				// 背景透明
				bgTransparent: 1,
				//头部占位
				headPlaceholder: true,
				
				
				// 默认设置
				conf: {
					// 标题
					title: '',
					// nav 高度
					height: 44,
					
					// 是否固定头部
					fixed: true,
					// 是否包含状态栏
					statusBar: true,
					// 字体
					font: 'hxicon',
					// 字体大小
					fontSize: '18px',
					// 文字颜色，可以数组和string，为数组则是滑动变色 ["#000000","#ff9900"]
					color: "#333333",
					
					// 滑动距离
					slideHeight: 100,
					
					// 是否需要返回按钮
					back: true,
					// 返回文本 '返回',小程序无效
					backTxt: null,
					// 返回tab页面
					backTabPage: null,
					// 返回普通页面
					backPage: null,
					
					// 左侧按钮组，icon参数为必填
					leftButton:null,
					// 右侧按钮组，icon参数为必填
					rightButton:null,
					// rightButton:[{
					//	key: 'address',		// 标识，方便事件识别是哪一个按钮触发
					// 	icon: '&#xe64b;',	// 图标代码
					//	txt: '文本',			// 文本，常用于城市选择
					// 	color: '#ff9900',	// 图标颜色
					//  position: 'left', // 图标居于文字left 或 right
					// },{
					//	key: 'address',		// 标识，方便事件识别是哪一个按钮触发
					// 	icon: '&#xe650;', 
					// 	txt: '文本',
					// 	color: '#894574',
					// },]
					// 搜索框
					search: null,
					// search: {
					// 	value:'',
					// 	placeholder: '',
					// 	disabled: false
					// }
					// 阴影
					shadow: false,
					// 底边框
					border: false,
					// 导航栏占位符
					barPlaceholder: true,
					
					// 插槽滑动切换
					slotSwitch: 0,
					// 右插槽
					rightSlot: false,
					// 右插槽切换
					rightSlotSwitch: false,
					
					
									
					select_bg_model: 1,
					bg_color: "#ffffff",
					gradient_angle: "to bottom",
					gradient_color1: "#ffffff",
					gradient_color2: "#ffffff",
					gradient_color3: "#ffffff",
					bg_img:'',
					
					search_locate: 1,
					center_style: 1,
					title_color: "#000",
					title_name: "首页",
					left_style: 1,
					back_img: "/uniapp_template/admin/static/custom/images/back_black.png",
					left_img_jump: 2,
					left_img: "/uniapp_template/admin/static/custom/images/chen_left_img.png",
					left_link: "",
					is_show_right_img: 2,
					right_img: "/uniapp_template/admin/static/custom/images/chen_right_icon.png",
					right_link: "",
					kong_image: "/uniapp_template/admin/static/custom/images/chen_kong.png",
					//是否显示标题栏 1显示 2隐藏
					is_show_title: 1,	
				},
				
				centerLongWidth: 0,
				leftWidth: 0,
				centerWidth: 0,
				rightWidth: 0,
				searchHeight: 50,
			};
		},
		mounted() {
			let that = this;
			if(that.conf.is_show_title!=2){
				setTimeout(function(){
					let indexSearchHeight = uni.getStorageSync('indexSearchHeight');
					that.searchHeight = indexSearchHeight;
					uni.createSelectorQuery().select('.xingdian-navbar__content__main__center').boundingClientRect((rect)=>{
						that.centerLongWidth = rect.width
					}).exec()
				},800)
			}else{
				that.conf.height  = 0;
				that.searchHeight = 0;
			}
			
		},
		created() {  
			let that = this;
			that.http_host = that.vuex_apiUrl;
			// 参数合并
			that.conf = Object.assign(that.conf, that.datas.content)
			
			// 因为解析不到域名，进行图片处理
			let bg_img = this.datas.content.bg_img
			let back_img = this.datas.content.back_img
			let center_img = this.datas.content.center_img
			let left_img = this.datas.content.left_img
			let right_img = this.datas.content.right_img
			let kong_image = this.datas.content.kong_image
			var reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/);
			if (!reg.test(bg_img)) {
				var img = that.http_host + '/' + bg_img;
				that.conf.bg_img = img
			}
			if (!reg.test(back_img)) {
				var img = that.http_host + '/' + back_img;
				that.conf.back_img = img
			}
			if (!reg.test(center_img)) {
				var img = that.http_host + '/' + center_img;
				that.conf.center_img = img
			}
			if (!reg.test(left_img)) {
				var img = that.http_host + '/' + left_img;
				that.conf.left_img = img
			}
			if (!reg.test(right_img)) {
				var img = that.http_host + '/' + right_img;
				that.conf.right_img = img
			}
			if (!reg.test(kong_image)) {
				var img = that.http_host + '/' + kong_image;
				that.conf.kong_image = img
			}
			
			that.conf.back = that.datas.content.is_show_back==1?true:false
			if(that.datas.content.search_locate!=2&&that.datas.content.center_style==1){
				that.conf.title = that.datas.content.title_name;
			}
			that.txtColor = that.datas.content.title_color;
			if(that.conf.back==true){
				that.conf.barPlaceholder = false
			}
			
			// that.conf.select_bg_model = that.datas.content.select_bg_model
			// that.conf.bg_color = that.datas.content.bg_color
			// that.conf.gradient_angle = that.datas.content.gradient_angle
			// that.conf.gradient_color1 = that.datas.content.gradient_color1
			// that.conf.gradient_color2 = that.datas.content.gradient_color2
			// that.conf.gradient_color3 = that.datas.content.gradient_color3
			// that.conf.bg_color = that.datas.content.bg_color
			
			// 标题
			if(that.conf.title != ''){
				uni.setNavigationBarTitle({
				    title: that.conf.title
				});
				that.title = that.conf.title;
			}
		},
		methods:{
			// 返回
			onBack() {
				var that = this;
				 if(getCurrentPages().length>1){
					uni.navigateBack();
				}else{
					// #ifdef H5
					history.back();
					// #endif
				}
			},
			left_jump(){
				let that = this;
				if(that.conf.left_img_jump==1){
					that.onBack();
				}else{
					that.$common.diyLinkJump(that.conf.left_link)
				}
			},
			right_jump(){
				let that = this;
				that.$common.diyLinkJump(that.conf.right_link)
			},
			imageLoad(e){
				var that = this;
				/* 图片容器的id */
				var id = e.currentTarget.id;
				if(id=="right_image"){
					that.rightWidth = 40 * e.target.width/e.target.height;
				}else if(id=="left_image"){
					that.leftWidth = 40 * e.target.width/e.target.height;
				}else if(id=="center_image"){
					that.centerWidth = 40 * e.target.width/e.target.height;
				}
			},
			handleCancel(e){
				this.$emit('handleCancel',e)
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

<style lang="scss">
	$nav-height: 44px;
	.hxicon {
		font-family: hxicon;
		text-decoration: none;
	}
	// .hxicon{
	// 	font-family: hxicon;
	// 	font-size:20px;
	// 	font-style:normal;
	// 	/* #ifndef APP-PLUS-NVUE */
	// 	-webkit-font-smoothing: antialiased;
	// 	-webkit-text-stroke-width: 0.2px;
	// 	-moz-osx-font-smoothing: grayscale;
	// 	/* #endif */
		
	// }
	
	.hd{
		overflow: hidden;
	}
	//防止其他ui影响
	// .hx-navbar uni-view,
	// .hx-navbar uni-scroll-view,
	// .hx-navbar uni-swiper,
	// .hx-navbar uni-button,
	// .hx-navbar uni-input,
	// .hx-navbar uni-textarea,
	// .hx-navbar uni-label,
	// .hx-navbar uni-navigator,
	// .hx-navbar uni-image {
	// 	box-sizing: unset;
	// }
	
	// image{will-change: transform}
	
	/* #ifndef APP-NVUE */
	[class*="hx-navbar__"]{
		display: flex;
	}
	
	/* #endif */
	.hx-navbar {
		
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding-top: 0;
		overflow: hidden;
		flex: 1;
		z-index: 101;
		&__stretch{
			align-items: stretch;
		}
		
		&__status{
			position: relative;
			z-index:3;
		}
		&__icon{
			position: relative;
			top: 1px;
			left: 5px;
			//transition: all 0.2s;
		}
		&__icontran{
			
			border-radius: 100% !important;
			background-color: rgba(0,0,0,.5) !important;
			width: 30px !important;
			height: 30px !important;
			line-height: 30px !important;
			text-align: center !important;
			color: #ffffff !important;
			transition: color,background 0.2s !important;
		}
		&__btntran{
			padding: 0 !important;
			margin-left: 6px !important;
		
			border-radius: 100% !important;
			// background-color: rgba(0,0,0,.5) !important;
			width: 30px !important;
			height: 30px !important;
			line-height: 30px !important;
			text-align: center !important;
			color: #ffffff !important;
			transition: color,background 0.2s !important;
			
		}
		
		&__content{
			position: relative;
			flex: 1;
			z-index:1;
			width: 100%;
			flex-direction: column;
			&__imgctn{
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				z-index: 2;
				//transition: all 0.2s;
				&__img{
					
				}
			}
			&__main{
				position: relative;
				z-index:3;
				flex: 1;
				flex-direction: row;
				align-items: center;
				padding: 0;
				&_back{
					flex-direction: row;
					align-items: center;
					height: 100%;
					padding: 0 13px;
					margin: 0;
					position: relative;
					z-index:2;
					line-height: $nav-height;
				}
				
				&_search{
					position: relative;
					flex-direction: row;
					align-items: center;
					flex: 1;
					height: 100%;
					&_hxicon{
						position: absolute;
						left: 24px;
						font-size: 18px;
						color: #dbdbdb;
					}
					&_input{
						height: 30px;
						flex: 1;
						border-radius: 40px;
						background-color: rgba(32,32,32, .35);
						padding: 0 16px 0 36px;
					}
				}
				&_right{
					position: relative;
					z-index:2;
					flex-direction: row;
					align-items: center;
					height: 100%;
					padding: 0 13px 0 9px;
					margin: 0;
					&_txt{
						max-width: 60px;
						lines: 1;
						text-overflow:ellipsis;
					}
					&_btn{
						justify-content: center;
						align-items: center;
						flex-direction: row;
						align-items: center;
						height: 100%;
						padding: 0 5px;
					}
					
					&_icon{
						justify-content: center;
						align-items: center;
						text-align: center;
					}
				}
				
				&_center{
					flex-direction: row;
					flex: 36;
					//height: 100%;
					align-items: stretch;
					/* #ifdef MP */
					width: 0;
					justify-content: left;
					/* #endif */
					
					/* #ifndef MP */
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 0;
					justify-content: center;
					/* #endif */
					
					&_txt{
						flex-direction: row;
						/* #ifndef MP */
						flex: 46;
						/* #endif */
						/* #ifdef APP-NVUE */
						lines: 1;
						/* #endif */
						/* #ifndef APP-NVUE */
						display: block;
						white-space: nowrap;
						overflow: hidden;
						/* #endif */
						height: $nav-height;
						justify-content: center;
						align-items: center;
						text-align: center;
						text-overflow:ellipsis;
						line-height: $nav-height;
						// overflow: hidden;
					}
					&_flex{
						/* #ifndef MP */
						flex: 32;
						/* #endif */
						/* #ifdef MP */
						width: 0;
						/* #endif */
						
					}
					
				}
				&_left{
					position: relative;
					z-index:2;
					flex-direction: row;
					align-items: center;
					height: 100%;
					padding: 0 9px 0 13px;
					margin: 0;
					&_txt{
						width: 60px;
						lines: 1;
						text-overflow:ellipsis;
					}
					&_btn{
						flex-direction: row;
						align-items: center;
						height: 100%;
						padding: 0 5px;
					}
					&_img{
						width: 100%;
						height: $nav-height;
						&_image{
							width: 100%;
							height: $nav-height;
						}
					}
					// &_btn:first-child{
					// 	margin-left:-4px !important;
					// }
				}
			}
		}
		&__fixed{
			position: fixed;
			top:0;
			z-index: 99;
		}
		&__shadow {
			box-shadow: 0 2upx 12upx #ccc;
		}
			
		&__border:after {
			position: absolute;
			z-index: 3;
			bottom: 0;
			left: 0;
			right: 0;
			height: 1px;
			transform: scaleY(.5);
			background-color: #efefef;
		}
		&__icon{
			top: 0 !important;
			font-size: 20px;
		}
	}
	
	
	
	
	
	
	
	.hx_font_size{
		font-size: 18px;
	}
	.hx_text_overflow{
		
		/* #ifdef APP-NVUE */
		flex: 1;
		lines: 1;
		justify-content: center;
		align-items: center;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: block;
		white-space: nowrap;
		overflow: hidden;
		/* #endif */
		text-overflow:ellipsis;
		
		text-align: center;
	}
	
	[class*="xingdian-navbar__"]{
		display: flex;
	}
	.xingdian-navbar{
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 0;
		overflow: hidden;
		flex: 1;
		z-index: 101;
		&__status{
			position: relative;
			z-index:3;
		}
		&__content{
			position: relative;
			flex: 1;
			z-index:1;
			width: 100%;
			flex-direction: column;
			&__main{
				position: relative;
				z-index:3;
				flex: 1;
				flex-direction: row;
				align-items: center;
				padding: 0;
				&__left{					
					justify-content: center;
					align-items: center;
					text-align: left;
					margin-left: 10px;
					flex-direction: row;
				}
				&__center{
					flex: 32;
					// margin: 0 8px;
					flex-direction: row;
					text-align: center;
					justify-content: center;
					align-items: center;
				}
				&__right{
					justify-content: center;
					align-items: center;
					text-align: right;
					margin-right: 10px;	    
					flex-direction: row;
					
					position: relative;
					z-index:2;
					height: 100%;
				}
			}
		}
	}
	.back-image{
		width: 44rpx;
		height: 88rpx;
	}
	.xingdian-navbar image{
		height: 44px;
	}
</style>