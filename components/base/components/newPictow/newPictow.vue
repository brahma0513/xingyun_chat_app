<template>
	<view  :style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding: '+(datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom)+'px;background-size:cover;'">
	    <swiper v-if="datas.content.select_style==2" class="swiper" :indicator-dots="indicatorDots"
	      :autoplay="autoplay" :interval="interval" :duration="duration" :circular="true" :previous-margin="spacing+'px'" :next-margin="spacing+'px'" @change="changes">
	      <block v-for="(item,index) in datas.content.dataset" v-if="index<3">
	        <swiper-item>
	          <view :class="'swiper-item '+(index == current?'active':'')" :style="'border-radius:'+datas.content.radius_diy+'px'">
	            <view class="navigator" @click="$common.diyLinkJump(item.link)">
					<image class="swiper-img" :src="item.pic" :lazy-load="true"></image>
	            </view> 
	          </view>
	        </swiper-item>
	      </block>
	    </swiper>
	    <view v-else :class="'custom-case case-'+(datas.content.select_style==1?datas.content.shownum:datas.content.shownum3)">
	      <block v-for="(it,it_index) in datas.content.dataset" v-if="(it_index<datas.content.shownum&&datas.content.select_style==1)||(it_index<datas.content.shownum3&&datas.content.select_style==3)">
	        <view @click="$common.diyLinkJump(it.link)" :class="(datas.content.select_style==3?'saw saw_s':'tile') + ' ' + (datas.content.select_style==1&&datas.content.shownum==4&&datas.content.style_num==2?'tile_new':'') + ' ' + (datas.content.spacing_bool==2&&datas.content.dividing_line_bool==1&&datas.content.style_num==2?'bd2':datas.content.spacing_bool==2&&datas.content.dividing_line_bool==1?'bd':'') + ' ' + (datas.content.spacing_bool==2?'noMargin margin-0':'') + ' ' + (datas.content.select_style==3&&datas.content.shownum3==3&&datas.content.style_num3==2||datas.content.select_style==3&&datas.content.shownum3==4&&datas.content.style_num4==2||datas.content.select_style==3&&datas.content.shownum3==4&&datas.content.style_num4==4?'saw_s_new':'') + ' ' + (datas.content.select_style==3&&datas.content.shownum3==4&&datas.content.style_num4==3||datas.content.select_style==3&&datas.content.shownum3==4&&datas.content.style_num4==4?'saw_top_new':'') " :style="'border-color: '+(datas.content.dividing_line_color?datas.content.dividing_line_color:'#333')+';width:'+(datas.content.select_style==1&&datas.content.spacing_bool==2&&datas.content.shownum==2||datas.content.select_style==1&&datas.content.shownum==4&&datas.content.style_num==2&&datas.content.spacing_bool==2?'50%':datas.content.select_style==1&&datas.content.spacing_bool==2&&datas.content.shownum==3?'33.3%':datas.content.select_style==1&&datas.content.spacing_bool==2&&datas.content.shownum==4&&datas.content.style_num==1?'25%':'')+';border-radius:'+datas.content.radius_diy+'px'">
	          <image class="case-box" :mode="datas.content.select_style==3?'aspectFill':'widthFix'" :src="it.pic" :lazy-load="true" :style="'object-fit:cover; border-radius:'+datas.content.radius_diy+'px'" ></image>
	        </view>
	      </block>
	    </view>
	</view>
</template>

<script>
	export default {
		name:"newPictow",
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
			};
		},
		methods:{
			changes(e){
				this.current = e.detail.current
			}
		}
	}
</script>

<style>
	.no-hover{
		background-color: transparent
	  }
	  .custom-case {
		  /* background-color: #FFF; */
		  padding: 0px;
		  overflow: hidden;
		  position: relative;
		  font-size: 0;
	  }
	  
	  .custom-case .case-box {
		  width: 100%;
		  /* height: 100%; */
		  border-radius: 3px;
	  }
	  .custom-case .noMargin .case-box{
		  border-radius: 0;
	  }
	  
	  .custom-case .saw .case-box {
		  height: 100%;
	  }
	  
	  .custom-case.case-2 .saw .case-box {
		  height: auto;
	  }
	  
	  .custom-case.case-2 .saw,
	  .custom-case.case-2 .tile {
		  width: calc(50% - 4.5px);
		  /* height: 110px; */
		  float: left;
	  }
	  
	  .custom-case.case-2 .saw:first-child,
	  .custom-case.case-2 .tile:first-child {
		  margin-right: 9px;
	  }
	  
	  .custom-case.case-3 .saw:first-child {
		  width: calc(50% - 4.5px);
		  height: 165px;
		  float: left;
		  margin-right: 9px;
	  }
	  .custom-case.case-3 .saw.noMargin:first-child{
		  width: 50%;
		  margin-right: 0;
		  border-top-left-radius: 3px;
		  border-bottom-left-radius: 3px;
		  overflow: hidden;
	  }
	  .custom-case.case-3 .saw.bd:first-child{
		  border-right: 0.5px solid;
		  box-sizing: border-box;
	  }
	  
	  .custom-case.case-3 .saw:nth-child(2),
	  .custom-case.case-3 .saw:nth-child(3) {
		  height: 78px;
		  width: calc(50% - 4.5px);
		  float: left;
	  }
	  .custom-case.case-3 .saw.noMargin:nth-child(2),
	  .custom-case.case-3 .saw.noMargin:nth-child(3) {
		  height: 82.5px;
		  width: 50%;
		  float: left;
	  }
	  .custom-case.case-3 .saw.bd:nth-child(2){
		  border-bottom: 0.5px solid;
		  box-sizing: border-box;
	  }
	  .custom-case.case-3 .saw.noMargin:nth-child(3){
		  border-bottom-right-radius: 3px;
		  overflow: hidden;
	  }
	  
	  .custom-case.case-3 .saw:nth-child(2) {
		  margin-bottom: 9px;
	  }
	  .custom-case.case-3 .saw.noMargin:nth-child(2) {
		  margin-bottom: 0;
		  border-top-right-radius: 3px;
		  overflow: hidden;
	  }
	  
	  .custom-case.case-3 .tile {
		  width: calc(33.3333% - 6px);
		  /* height: 110px; */
		  float: left;
		  margin-right: 9px;
	  }
	  
	  .custom-case.case-3 .tile:last-child {
		  margin-right: 0;
	  }
	  
	  .custom-case.case-4 .saw:first-child {
		  height: 178px;
		  width: calc(39.42% - 9px);
		  margin-right: 9px;
		  float: left;
	  }
	  .custom-case.case-4 .saw.noMargin:first-child {
		  height: 178px;
		  width: 50%;
		  margin-right: 0;
		  float: left;
		  border-top-left-radius: 3px;
		  border-bottom-left-radius: 3px;
		  overflow: hidden;
	  }
	  .custom-case.case-4 .saw.bd:first-child{
		  border-right: 0.5px solid;
		  box-sizing: border-box;
	  }
	  
	  .custom-case.case-4 .saw:nth-child(2) {
		  width: 60.58%;
		  height: 69px;
		  float: left;
		  margin-bottom: 9px;
	  }
	  .custom-case.case-4 .saw.noMargin:nth-child(2) {
		  width: 50%;
		  height: 89px;
		  float: left;
		  margin-bottom: 0px;
		  border-top-right-radius: 3px;
		  overflow: hidden;
	  }
	  .custom-case.case-4 .saw.bd:nth-child(2){
		  border-bottom: 0.5px solid;
		  box-sizing: border-box;
	  }
	  
	  .custom-case.case-4 .saw:nth-child(3),
	  .custom-case.case-4 .saw:nth-child(4) {
		  width: calc(30.29% - 4.5px);
		  height: 100px;
		  float: left;
	  }
	  .custom-case.case-4 .saw.noMargin:nth-child(3),
	  .custom-case.case-4 .saw.noMargin:nth-child(4) {
		  width: 25%;
		  height: 89px;
		  float: left;
	  }
	  
	  .custom-case.case-4 .saw:nth-child(3) {
		  margin-right: 9px;
	  }
	  .custom-case.case-4 .saw.noMargin:nth-child(3) {
		  margin-right: 0;
	  }
	  .custom-case.case-4 .saw.bd:nth-child(3) {
		  border-right: 0.5px solid;
		  box-sizing: border-box;
	  }
	  .custom-case.case-4 .saw.noMargin:nth-child(4) {
		  border-bottom-right-radius: 3px;
		  overflow: hidden;
	  }
	  
	  .custom-case.case-4 .tile {
		  width: calc(25% - 6.75px);
		  /* height: 80px; */
		  float: left;
		  margin-right: 9px;
	  }
	  
	  .custom-case.case-4 .tile:last-child {
		  margin-right: 0;
	  }
	  
	  
	  .swiper{
		height: 100px;
		padding: 0px;
	  }
	  swiper-item{
		display: block;
		height: 100px;
		position: relative;
	  }
	  .swiper-item {
		display: block;
		height: 80px;
		width: 100%;
		box-sizing: border-box;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		transition: height 0.5s;
		  -webkit-transition: height 0.5s; 
	  }
	  
	  .swiper-item.active{
		height: 100px;
		  margin: 0;
		  border-radius: 8px;
		  overflow: hidden;
	  }
	  
	  .swiper-item .navigator{
		  width: 100%;
		  height: 100%;
	  }
	  
	  .swiper-item .swiper-img{
		  width: 100%;
		  height: 100%;
	  }
	  /* 1.9.9橱窗样式修改 */
	  .custom-case.case-3 .saw_s:first-child {
	    width: calc(50% - 4.5px);
	    height: 182.5px;
	    float: left;
	    margin-right: 9px;
	}
	.custom-case.case-3 .saw_s.noMargin:first-child {
	    width: 50%;
	    height: 187.5px;
	    float: left;
	    margin-right: 0px;
	}
	.custom-case.case-3 .saw_s:nth-child(2),
	.custom-case.case-3 .saw_s:nth-child(3) {
	    height: 86px;
	    width: calc(50% - 4.5px);
	    float: left;
	}
	.custom-case.case-3 .saw_s.noMargin:nth-child(2),
	.custom-case.case-3 .saw_s.noMargin:nth-child(3) {
	    height: 93.5px;
	    width: 50%;
	    float: left;
	}
	.custom-case.case-4 .saw_s:first-child {
	    height: 182.5px;
	    width: calc(50% - 4.5px);
	    margin-right: 9px;
	    float: left;
	}
	.custom-case.case-4 .saw_s.noMargin:first-child {
	    height: 187.5px;
	    width: 50%;
	    margin-right: 0;
	    float: left;
	    border-top-left-radius: 3px;
	    border-bottom-left-radius: 3px;
	    overflow: hidden;
	}
	.custom-case.case-4 .saw_s:nth-child(2) {
	    width: calc(50% - 4.5px);
	    height: 86px;
	    float: left;
	    margin-bottom: 9px;
	}
	.custom-case.case-4 .saw_s.noMargin:nth-child(2) {
	    width: 50%;
	    height: 93.5px;
	    float: left;
	    margin-bottom: 0px;
	    border-top-right-radius: 3px;
	    overflow: hidden;
	}
	.custom-case.case-4 .saw_s:nth-child(3),
	.custom-case.case-4 .saw_s:nth-child(4) {
	    width: calc(25% - 6.75px);
	    height: 86px;
	    float: left;
	}
	.custom-case.case-4 .saw_s.noMargin:nth-child(3),
	.custom-case.case-4 .saw_s.noMargin:nth-child(4) {
	    width: 25%;
	    height: 94px;
	    float: left;
	}
	/*新橱窗样式*/
	.margin-0{
	  margin: 0px !important;
	}
	.custom-case.case-2 .tile.bd:first-child{
	  border-right:0.5px solid;
	  box-sizing: border-box;
	}
	.custom-case.case-3 .tile.bd:nth-child(2),
	.custom-case.case-4 .tile.bd:nth-child(2){
	  border-left:0.5px solid;
	  border-right:0.5px solid;
	  box-sizing: border-box;
	}
	.custom-case.case-4 .tile.bd:nth-child(3){
	  border-right:0.5px solid;
	  box-sizing: border-box;
	}
	.custom-case.case-4 .tile_new{
	  width: calc(50% - 4.5px);
	  float: left;
	  height: 81px;
	  margin: 0px;
	}
	.custom-case.case-4 .tile_new:nth-child(1),
	.custom-case.case-4 .tile_new:nth-child(3){
	  margin-right:9px;
	}
	.custom-case.case-4 .tile_new:nth-child(1),
	.custom-case.case-4 .tile_new:nth-child(2){
	  margin-bottom:9px;
	}
	.custom-case.case-4 .tile_new .case-box {
	  width: 100%;
	  height: 100%;
	}
	.custom-case.case-4 .tile_new.bd2:nth-child(1),
	.custom-case.case-4 .tile_new.bd2:nth-child(2){
	  border-bottom:0.5px solid;
	  box-sizing: border-box;
	}
	.custom-case.case-4 .tile_new.bd2:nth-child(1),
	.custom-case.case-4 .tile_new.bd2:nth-child(3){
	  border-right:0.5px solid;
	  box-sizing: border-box;
	}
	.custom-case.case-3 .saw_s_new.bd:first-child{
	  border-left:0.5px solid;
	  border-right: 0px;
	  box-sizing: border-box;
	}
	.custom-case.case-3 .saw_s_new:first-child {
	  width: calc(50% - 4.5px);
	  height: 182.5px;
	  float: right;
	  margin-right: 0px;
	  margin-left: 9px;
	}
	.custom-case.case-3 .saw_s_new.noMargin:first-child {
	  float: right;
	}
	.custom-case.case-3 .saw_s_new.noMargin:nth-child(2),
	.custom-case.case-3 .saw_s_new.noMargin:nth-child(3) {
	  height: 93.5px;
	  width: 50%;
	  float: left;
	}
	.custom-case.case-4 .saw_s_new:first-child {
	  margin-right: 0px;
	  margin-left: 9px;
	  float: right;
	}
	.custom-case.case-4 .saw_s_new.noMargin:first-child {
	  float: right;
	}
	.custom-case.case-4 .saw_s_new.bd:first-child{
	  border-left: 0.5px solid;
	  border-right: 0px;
	}
	.custom-case.case-4 .saw_top_new:nth-child(3) {
	  margin-right: 0px;
	  margin-left: 9px;
	}
	.custom-case.case-4 .saw_top_new:nth-child(2),
	.custom-case.case-4 .saw_top_new:nth-child(3) {
	  width: calc(25% - 6.75px);
	  height: 86px;
	  float: left;
	}
	.custom-case.case-4 .saw_top_new.noMargin:nth-child(2),
	.custom-case.case-4 .saw_top_new.noMargin:nth-child(3) {
	  width: 25%;
	  height: 94px;
	  float: left;
	}
	.custom-case.case-4 .saw_top_new:nth-child(4) {
	  width: calc(50% - 4.5px);
	  height: 86px;
	  float: left;
	  margin-bottom: 0px;
	}
	.custom-case.case-4 .saw_top_new.noMargin:nth-child(4) {
	  width: 50%;
	  height: 93.5px;
	  float: left;
	  margin-bottom: 0px;
	  border-top-right-radius: 3px;
	  overflow: hidden;
	}
	.custom-case.case-4 .saw_top_new.bd:nth-child(2) {
	    border-bottom: 0px;
	    border-right: 0.5px solid;
	}
	.custom-case.case-4 .saw_top_new.bd:nth-child(3) {
	    border-right: 0px;
	}
	.custom-case.case-4 .saw_top_new.bd:nth-child(4) {
	    border-top: 0.5px solid;
	}
</style>