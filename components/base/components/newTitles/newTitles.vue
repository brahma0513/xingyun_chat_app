<template>
	<view class="titles" :style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding: '+(datas.content.padding_top+'px '+(datas.content.display_method==2?datas.content.padding_horizontal:0)+'px '+datas.content.padding_bottom)+'px;border-radius:'+((datas.content.display_method==1?datas.content.radius_top_diy:0))+'px '+((datas.content.display_method==1?datas.content.radius_top_diy:0))+'px '+((datas.content.display_method==1?datas.content.radius_bottom_diy:0))+'px '+((datas.content.display_method==1?datas.content.radius_bottom_diy:0))+'px;background-size:100% 100%;overflow: hidden;'">		
		<view class="custom-title" :style="'background-color: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==1?datas.content.card_bg_color:'transparent')+';background-image: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==2?'linear-gradient('+datas.content.card_gradient_angle+','+datas.content.card_gradient_color1+','+datas.content.card_gradient_color2+')':datas.content.display_method==2&&datas.content.card_select_bg_model==3?'url('+datas.content.card_bg_img+')':'none')+';padding-left:'+(datas.content.padding_left)+'px;border-radius:'+((datas.content.display_method==2?datas.content.radius_top_diy:0))+'px '+((datas.content.display_method==2?datas.content.radius_top_diy:0))+'px '+((datas.content.display_method==2?datas.content.radius_bottom_diy:0))+'px '+((datas.content.display_method==2?datas.content.radius_bottom_diy:0))+'px;background-size:100% 100%;overflow: hidden;min-height: 47px;'">
			<view v-if="datas.content.select_style==1" :class="'title-main '+(datas.content.text_align==2?'flex-zCenter':'')">
				<image v-if="datas.content.add_icon==2" class="news-laba" :src='datas.content.icon_pic' mode='widthFix'></image>
			    <view class="flex-def flex-cBaseline">
	    		    <view :style="'font-size:'+datas.content.font_size+'px;color:'+datas.content.font_color" :class="datas.content.select_style==1&&datas.content.font_style == 2?'font-weight-800':''">
	        		        {{datas.content.title}}
	        		</view>
	    		    <view v-if="datas.content.add_subtitle==2&&datas.content.text_align==1" :style="'font-size:'+datas.content.subtitle_font_size+'px;color:'+datas.content.subtitle_font_color" class="padding-left-10">
	    		        {{datas.content.subtitle_title}}
	    		    </view>
			    </view>
			</view>
			<view v-if="datas.content.select_style==2" :class="'title_pic flex-cCenter '+(datas.content.text_align==2?'flex-zCenter text-center':'')">
				<image :src='datas.content.title_pic' :style="'width: '+this.imagewidth+'px; height: '+this.imageheight+'px;'" @load="imageLoad"></image>
			</view>
			<view v-if="datas.content.text_align==1" @click="$common.diyLinkJump(datas.content.dataset[0].link)">
			  <view class="title-small">
				<view class="text" v-if="datas.content.checked_rule == 1" :style="'color:'+datas.content.link_color">查看更多</view>
				<view v-if="datas.content.checked_rule2==1" class="fa-angle-down" :style="'border-color: '+(datas.content.link_icon_color?datas.content.link_icon_color:'#999999')"></view>
			  </view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"newTitles",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},
		
		data() {
			return {
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				current: 0,
				spacing: 80, // 间距
				imagewidth:0,
				imageheight:0
			};
		},
		
		created() {
			console.log(this)
		},
		
		methods:{
			imageLoad: function (e) {
			  var imageSize = this.imageUtil(e)
			  this.imagewidth = imageSize.imageWidth
			  this.imageheight = imageSize.imageHeight
			},
			imageUtil: function (e) {
			  var imageSize = {};
			  var originalWidth = e.detail.width; // 图片原始宽
			  var originalHeight = e.detail.height; // 图片原始高
			  var originalScale = originalHeight/originalWidth; //图片高宽比
			  //获取屏幕宽高
			  var windowWidth = 210;
			  var windowHeight = 20;
			  var windowscale = windowHeight/windowWidth;//所需高宽比
			  if (originalScale < windowscale) { // 图片高宽比小于所需高宽比
			    //图片缩放后的宽为所需宽
			    imageSize.imageWidth = windowWidth;
			    imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
			  } else { // 图片高宽比大于所需高宽比
			    //图片缩放后的高为所需高
			    imageSize.imageHeight = windowHeight;
			    imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
			  }
			 return imageSize;
			},
		}
	}
</script>

<style>
	.titles .custom-title {
	  padding: 0 15px;
	  overflow: hidden;
	  font-size: 15px;
	  display: flex;
	  align-items: center;
	}
	
	.titles .custom-title .title-main {
	  display: flex;
	  align-items: center;
	  flex: 1;
	}
	
	.news-laba{
	  width: 20px;
	  height: 20px;
	  margin-left: 5px;
	}
	.flex-def{
	  display: flex;
	} 
	.flex-cBaseline{
	  align-items: baseline;
	}
	.fa-angle-down {
	  margin-left: 5px;
	  width: 15rpx;
	  height: 15rpx;
	  border-top: 2rpx solid #b2b2b2;
	  border-right: 2rpx solid #b2b2b2;
	  transform: rotate(45deg);
	}
	.title_pic{
	  display: flex;
	  align-items: center;
	  flex: 1;
	}
	.padding-left-10{
	  padding-left: 10px;
	}
	.flex-zCenter{
	  justify-content: center;
	}
	.title_pic image{
	  width: 100%;
	}
	.titles .custom-title .title-main {
	  line-height: 50px;
	  height: 50px;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	
	.titles .custom-title.title-style-2 .title-main {
	  width: 70%;
	  display: inline-block;
	  vertical-align: middle;
	}
	
	.titles .custom-title .title-small {
	  font-size: 0;
	  display: flex;
	  align-items: center;
	}
	
	.titles .text {
	  color: #926dde;
	  font-size: 12px;
	  padding-left: 5px;
	}
	
	.titles .custom-title.title-style-3 .title-main {
	  width: 70%;
	  display: inline-block;
	  vertical-align: middle;
	}
	
	.titles .icon {
	  display: inline-block;
	  vertical-align: middle;
	  background-size: 100% auto;
	  background-position: center;
	  background-repeat: no-repeat;
	  font-style: normal;
	  position: relative;
	}
	
	.titles .custom-title .title-small .title-icon {
	  font-size: 20px;
	  font-weight: 600;
	}
	
	.font-weight-800{
		font-weight:bold;
	}
</style>