<template>
	<view 
		:style="'padding:'+
		(datas.content.padding_top==undefined?datas.content.padding:datas.content.padding_top)+'px 0 '+
		(datas.content.padding_bottom==undefined?datas.content.padding:datas.content.padding_bottom)+'px'">
		<swiper v-if="datas.content.shownum==3 && datas.content.css_type == 3"
			:indicator-dots="indicatorDots"
			:autoplay="autoplay" 
			:interval="interval" 
			:duration="duration" 
			:circular="true" 
			:previous-margin="spacing+'px'" 
			:next-margin="spacing+'px'"
			@change="changes"
		>
			<block v-for="(item,index) in datas.content.dataset" v-if="index<datas.content.shownum">
				<swiper-item>
					<view :class="index == current?'swiper-item active':'swiper-item'">
						<image class="swiper-img" :src="item.pic" mode=""  @click="$common.diyLinkJump(item.link)"></image>
					</view>
				</swiper-item>
			</block>
		</swiper>
		<view v-else :class="'custom-case case-'+datas.content.shownum" :style="'padding:'+(datas.content.style_num==1?'0 10px':'0')+' 10px'">
			<view class="navigator" 
				:class="(datas.content.css_type == 1 ? 'saw ':'tile ') +
				((datas.content.shownum==3||datas.content.shownum==4) && 
				(datas.content.spacing_bool==undefined||datas.content.spacing_bool==2) && 
				(datas.content.dividing_line_bool==undefined||datas.content.dividing_line_bool==1)
				?'bd ':' ') + 
				(datas.content.spacing_bool == 2?'noMargin ':' ') +
				((datas.content.css_type==1 && datas.content.shownum==4 && datas.content.style_num==2)||(datas.content.css_type==1 && datas.content.shownum==3 && datas.content.style_num==2)?'saw_s ':' ')"
				:style="'border-color:'+(datas.content.dividing_line_color!=undefined?datas.content.dividing_line_color:'#333')"
				v-for="(item,index) in datas.content.dataset"
				v-if="index<datas.content.shownum"
				>
				<image class="case-box" :src="item.pic" :mode="datas.content.shownum == 2 || datas.content.css_type == 2 ? 'widthFix':''"  @click="$common.diyLinkJump(item.link)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"pictow",
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
	padding: 0 10px;
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
	padding: 0 10px;
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
  
  .swiper-item navigator{
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
    width: calc(50% - 9px);
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
    width: 50%;
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
    width: calc(25% - 4.5px);
    height: 86px;
    float: left;
}
.custom-case.case-4 .saw_s.noMargin:nth-child(3),
.custom-case.case-4 .saw_s.noMargin:nth-child(4) {
    width: 25%;
    height: 94px;
    float: left;
}
</style>
