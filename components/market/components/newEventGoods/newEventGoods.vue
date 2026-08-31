<template>
	<view class="activity" :style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding: '+((datas.content.display_method==2||datas.content.select_style==2?datas.content.padding_top:0)+'px '+(datas.content.display_method==2||datas.content.select_style==2?datas.content.padding_horizontal:0)+'px '+(datas.content.display_method==2||datas.content.select_style==2?datas.content.padding_bottom:0)+'px;')+'background-size:cover;'">
	  <view :style="'border: '+(datas.content.display_method==2&&datas.content.border_style==2&&datas.content.select_style==1?datas.content.border_diy+'px solid'+datas.content.border_color:'none')+';border-radius: '+(datas.content.display_method==2&&datas.content.select_style==1?datas.content.radius_diy:0)+'px;background-color: '+(datas.content.display_method==2&&datas.content.select_style==1?datas.content.border_color:'transparent')">
	    <view :style="'background-color: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==1&&datas.content.select_style==1?datas.content.card_bg_color:'transparent')+';background-image: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==2&&datas.content.select_style==1?'linear-gradient('+datas.content.card_gradient_angle+','+datas.content.card_gradient_color1+','+datas.content.card_gradient_color2+')':datas.content.select_style==2?'url('+datalocal.content.style_select_bg[datas.content.style_select_bg_model-1].bg+')':datas.content.display_method==2&&datas.content.card_select_bg_model==3&&datas.content.select_style==1?'url('+datas.content.card_bg_img+')':'none')+';padding: '+((datas.content.display_method==1&&datas.content.select_style==1?datas.content.padding_top:0)+'px '+(datas.content.display_method==1&&datas.content.select_style==1?datas.content.padding_horizontal:datas.content.display_method==2&&datas.content.select_style==1?datas.content.padding_horizontal2:0)+'px '+(datas.content.display_method==1&&datas.content.select_style==1?datas.content.padding_bottom:0))+'px;border-radius: '+((datas.content.display_method==2&&datas.content.select_style==1?datas.content.radius_diy:0))+'px;background-size: '+(datas.content.select_style==1?'cover':'100% 100%')+';position:relative;'">
	      <view :class="'flex-def flex-cCenter flex-zBetween custom-nav activity-title-new '+(datas.content.select_style==2?'padding-left-15':'')" style="min-height: 39px;box-sizing: border-box;">
	        <view v-if="datas.content.title_select_model!=3||datas.content.select_style==2" class="flex-def flex-cCenter flex-one">
	            <image v-if="datas.content.title_select_model==2&&datas.content.select_style==1" :src="datas.content.icon_pic" alt="icon"style="width:20px;height:20px" mode="widthFix" class="margin-right-5"/>
	            <view class="flex-def flex-cBaseline">
	                <view :style="'font-size:'+datas.content.font_size+'px;color:'+datas.content.font_color" :class="datas.content.font_style == 2?'font-weight-800':''">
	                        {{datas.content.title}}
	                </view>
	                <view v-if="datas.content.add_subtitle==2" :style="'font-size:'+datas.content.subtitle_font_size+'px;color:'+(datas.content.subtitle_font_color)" class="padding-left-10">
	                    {{datas.content.subtitle_title}}
	                </view>
	            </view>
	        </view>
	        <view v-if="datas.content.title_select_model==3&&datas.content.select_style==1" class="flex-def flex-cCenter" style="height:20px;">
	          <image class="margin-right-5" :src="datas.content.title_pic" :style="'width: '+imagewidth+'px; height: '+imageheight+'px;'" @load="imageLoad" alt="title_pic"/>
	        </view>
	        <view :class="datas.content.select_style==2?'link-title-view':''">
	          <view @click="$common.diyLinkJump(datas.content.link)">
	            <view class="flex-def flex-cCenter">
	              <view v-if="datas.content.checked_rule==1||datas.content.select_style==2" :style="'color:'+((datas.content.link_color&&datas.content.select_style==1?datas.content.link_color:'#6F7581'))+';font-size: '+((datas.content.select_style==1?datas.content.link_font_size:12))+'px;'">{{datas.content.link_title}}</view>
	              <view v-if="datas.content.checked_rule2 == 1&&datas.content.select_style==1" class="fa-angle-down" :style="'border-color: '+(datas.content.link_icon_color?datas.content.link_icon_color:'#999999')+';padding:0px 0px 2px 2px;font-size:20px;margin-left: 6px;'"></view>
	              <image v-if="datas.content.select_style==2" :src="datalocal.content.style_select_bg[datas.content.style_select_bg_model-1].icon" alt="icon" style="width:11px;height:11px" mode="widthFix"/>
	              </view>
	          </view>
	        </view>
	      </view>
	      <view :style="'padding-bottom:'+((datas.content.select_style==1?7:0))+'px;'">
	        <view :class="'activity-new '+(datas.content.select_style==2?'padding-right-5 padding-top-0':'')" :style="'background-color: '+(datas.content.select_style==2?'transparent':'white')">
	          <scroll-view class="activity-list activity-list-new" scroll-x="true" :style="'border-radius:'+(datas.content.select_style==2?8:0)+'px;'">
	              <block v-for="(it,it_index) in datalocal.content.dataset">
	                  <view :class="(datas.content.select_style==1 ? 'activity-li-style1':'activity-li-style2')">
	                    <view hover-class="no-hover" @click="$common.diyLinkJump(it.link)">
	                      <view class="img">
	                        <image :src="it.pic" alt="" mode="aspectFill" />
	                      </view>
	                      <view :class="'activity-price '+(datas.content.select_style==1 ? 'activity-price-new1':'activity-price-new2')" :style="'color: '+(datas.content.select_style==1?datas.content.price_color:'white')+';'">{{monetary_unit}}<text class="activity-left-new">{{it.priceA}}</text><text class="activity-right-new">{{it.priceB}}</text>
	                      <view v-if="datas.content.select_style==2" class="activity-price-img flex-def flex-cCenter flex-zCenter">
	                        <image :src="http_host+'/HTML/admui/public/custom/images/icon_gwc_activity.png'" mode="widthFix" style="width:19px;height:19px" />
	                      </view>
	                      </view>
	                    </view>
	                  </view>
	              </block>
	          </scroll-view>
	        </view>
	      </view>
	
	    </view>
	  </view>
	</view>
</template>

<script>
	export default {
		name: "newEventGoods",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: '',
				monetary_unit: getApp().globalData.monetary_unit,
				imagewidth: 0, // 缩放后的宽
				imageheight: 0, // 缩放后的高
				datalocal:[]
			};
		},
		created() {
			var that = this;
			that.http_host = this.vuex_apiUrl;
			var datas = that.datas;
			var reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/);
			datas.content.dataset.forEach(function(item) {
				item.priceA = that.$common.toPrice(item.price, true) 
				item.priceB = that.$common.toPrice(item.price, false) 
			})
			datas.content.style_select_bg.forEach(function (item) {
				if (!reg.test(item.bg)) {
					item.bg   = that.http_host + '/' + item.bg;
				}
				if (!reg.test(item.icon)) {
					item.icon   = that.http_host + '/' + item.icon;
				}
			})		
			that.datalocal = datas
		},
		methods:{
			imageLoad: function (e) {
				var imageSize    = this.imageUtil(e)
				this.imagewidth  = imageSize.imageWidth
				this.imageheight = imageSize.imageHeight
			},
			imageUtil: function (e) {
				var imageSize = {};
				var originalWidth  = e.detail.width; // 图片原始宽
				var originalHeight = e.detail.height; // 图片原始高
				var originalScale  = originalHeight/originalWidth; //图片高宽比
				//获取屏幕宽高
				var windowWidth  = 210;
				var windowHeight = 20;
				var windowscale  = windowHeight/windowWidth;//所需高宽比
				if (originalScale < windowscale) { // 图片高宽比小于所需高宽比
					//图片缩放后的宽为所需宽
					imageSize.imageWidth  = windowWidth;
					imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
				} else { // 图片高宽比大于所需高宽比
					//图片缩放后的高为所需高
					imageSize.imageHeight = windowHeight;
					imageSize.imageWidth  = (windowHeight * originalWidth) / originalHeight;
				}
				return imageSize;
			},
		}
	}
</script>

<style>
	.activity {
		padding: 0 11px;
	}
	.activity p{
		margin: 0;
		line-height: 1;
	}
	.activity a{
		display: block;
		min-height: 10px;
	}
	.activity .activity-title{
		display: flex;
		display: -webkit-box;
		display: -webkit-flex;
		align-items: center;
		padding: 15px 4px;
		font-size: 15px;
		line-height: 25px;
		overflow: hidden;
		box-sizing: border-box;
	}
	.activity .activity-title p{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}
	.activity .activity-title .name{
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		font-size: 16px;
		line-height: 1;
		color: #333;
	}
	.activity .activity-title .mores{
		margin-left:10px ;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
		background-size: auto 12px;
		background-repeat: no-repeat;
		background-position: right center;
		padding-right: 15px;
		font-size: 13px;
		color: #999;
		line-height: 1;
	}
	.activity .activity-list{
		width: 100%;
		white-space: nowrap;
		text-align: left;
	}
	.activity .activity-list::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	}
	.activity .activity-list .list{
	width: 25%;
	display: inline-block;
	text-align: center;
	padding: 0 4px;
	box-sizing: border-box;
	}
	.activity .activity-list .img{
	  position: relative;
	  width: 100%;
	  font-size: 0;
	  margin-bottom: 10px;
	}
	.activity .activity-list .img:before{
	  content: "";
	  display: block;
	  padding-top: 100%;
	}
	.activity .activity-list .img image {
	  position:  absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	}
	.activity .activity-list .activity-price{
	  font-size: 13px;
	  line-height: 1;
	}
	.activity .activity-list .activity-price .activity-left{
	  font-size: 16px;
	}
	.activity .activity-list .activity-price .activity-right{
	  font-size: 13px;
	}
	/*新活动商品 销售组件start*/
	.link-title-view{
	  position: absolute;
	  right: 3.5%;
	  top: 5%;
	  height: 12px;
	  line-height: 12px;
	}
	.link-title-view image{
	  margin-left: 2px;
	}
	.activity-new{
	  border-radius: 8px;
	  padding: 7px;
	}
	.activity-new p{
	margin: 0;
	line-height: 1;
	}
	.activity-new a{
	display: block;
	min-height: 10px;
	}
	.activity-title-new{
	  padding: 9.5px 4px 9.5px 7px;
	  background: transparent;
	}
	.activity-new .activity-list-new .activity-li-style1{
	width: 25%;
	display: inline-block;
	text-align: center;
	padding: 0 3.5px 0 0;
	box-sizing: border-box;
	}
	.activity-new .activity-list-new .activity-li-style2{
	width: 28%;
	background-color: white;
	border-radius: 8px;
	display: inline-block;
	text-align: center;
	padding: 6px;
	margin-right: 7px;
	box-sizing: border-box;
	}
	.activity-new .activity-list-new .img{
	position: relative;
	width: 100%;
	font-size: 0;
	margin-bottom: 8px;
	border-radius: 4px;
	overflow: hidden;
	}
	.activity-new .activity-list-new .img:before{
	content: "";
	display: block;
	padding-top: 100%;
	}
	.activity-new .activity-list-new .img img {
	position:  absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	}
	.activity-new .activity-list-new .activity-price-new1{
	font-size: 13px;
	/*text-align: center;*/
	}
	.activity-new .activity-list-new .activity-price-new2{
	display: inline-block;
	background: #EB5D2F;
	border-radius: 19px;
	height: 19px;
	line-height: 19px;
	padding: 0px 22px 0px 7px;
	font-size: 13px;
	position: relative;
	text-align: center;
	max-width: 100%;
	}
	.activity-new .activity-list-new .activity-price-new2 .activity-price-img{
	position:  absolute;
	top: -2px;
	right: -1px;
	background: white;
	border-radius: 50%;
	border: 1px solid white;
	}
	.activity-new .activity-list-new .activity-price-new1 .activity-left-new{
	font-size: 16px;
	margin-left: 3.5px;
	}
	.activity-new .activity-list-new .activity-price-new1 .activity-right-new{
	font-size: 13px;
	}
	.activity-new .activity-list-new .activity-price-new2 .activity-left-new{
	font-size: 16px;
	margin-left: 3.5px;
	}
	.activity-new .activity-list-new .activity-price-new2 .activity-right-new{
	font-size: 13px;
	}
	/*新活动商品 销售组件end*/
	/*flex兼容写法 static*/
	.flex-def {
	  display: -webkit-box; 
	  display: -moz-box; 
	  display: -ms-flexbox;
	  display: -webkit-flex; 
	  display: flex; 
	}
	
	/* 主轴居中 */
	.flex-zCenter {
	  -webkit-box-pack: center;
	  -moz-justify-content: center;
	  -webkit-justify-content: center;
	  justify-content: center;
	}
	/* 主轴居中 */
	.flex-zAround {
	  -moz-justify-content: space-around;
	  -webkit-justify-content: space-around;
	  justify-content: space-around;
	}
	/* 主轴两端对齐 */
	.flex-zBetween {
	  -webkit-box-pack: justify;
	  -moz-justify-content: space-between;
	  -webkit-justify-content: space-between;
	  justify-content: space-between;
	}
	
	/* 主轴end对齐 */
	.flex-zEnd {
	  -webkit-box-pack: end;
	  -moz-justify-content: flex-end;
	  -webkit-justify-content: flex-end;
	  justify-content: flex-end;
	}
	
	/* 主轴start对齐 */
	.flex-zStart {
	  -webkit-box-pack: start;
	  -moz-justify-content: start;
	  -webkit-justify-content: start;
	  justify-content: start;
	}
	
	/* 侧轴居中 */
	.flex-cCenter {
	  -webkit-box-align: center;
	  -moz-align-items: center;
	  -webkit-align-items: center;
	  align-items: center;
	}
	
	/* 侧轴start对齐 */
	.flex-cStart {
	  -webkit-box-align: start;
	  -moz-align-items: start;
	  -webkit-align-items: start;
	  align-items: start;
	}
	
	/* 侧轴底部对齐 */
	.flex-cEnd {
	  -webkit-box-align: end;
	  -moz-align-items: flex-end;
	  -webkit-align-items: flex-end;
	  align-items: flex-end;
	}
	
	/* 侧轴文本基线对齐 */
	.flex-cBaseline {
	  -webkit-box-align: baseline;
	  -moz-align-items: baseline;
	  -webkit-align-items: baseline;
	  align-items: baseline;
	}
	
	/* 侧轴上下对齐并铺满 */
	.flex-cStretch {
	  -webkit-box-align: stretch;
	  -moz-align-items: stretch;
	  -webkit-align-items: stretch;
	  align-items: stretch;
	}
	
	/* 主轴从上到下 */
	.flex-zTopBottom {
	  -webkit-box-direction: normal;
	  -webkit-box-orient: vertical;
	  -moz-flex-direction: column;
	  -webkit-flex-direction: column;
	  flex-direction: column;
	}
	
	/* 主轴从下到上 */
	.flex-zBottomTop {
	  -webkit-box-pack: end;
	  -webkit-box-direction: reverse;
	  -webkit-box-orient: vertical;
	  -moz-flex-direction: column-reverse;
	  -webkit-flex-direction: column-reverse;
	  flex-direction: column-reverse;
	}
	
	/* 主轴从左到右 */
	.flex-zLeftRight {
	  -webkit-box-direction: normal;
	  -webkit-box-orient: horizontal;
	  -moz-flex-direction: row;
	  -webkit-flex-direction: row;
	  flex-direction: row;
	}
	
	/* 主轴从右到左 */
	.flex-zRightLeft {
	  -webkit-box-pack: end;
	  -webkit-box-direction: reverse;
	  -webkit-box-orient: horizontal;
	  -moz-flex-direction: row-reverse;
	  -webkit-flex-direction: row-reverse;
	  flex-direction: row-reverse;
	}
	
	/* 是否允许子元素伸缩 */
	.flex-item {
	  -webkit-box-flex: 1.0;
	  -moz-flex-grow: 1;
	  -webkit-flex-grow: 1;
	  flex-grow: 1;
	}
	/*子元素换行*/
	.flex-wrap {
	  -webkit-flex-wrap:wrap;
	  -webkit-box-lines:multiple;
	  -moz-flex-wrap:wrap;
	  flex-wrap:wrap;
	}
	/* 子元素的显示次序 */
	.flex-order{
	  -webkit-box-ordinal-group: 1;
	  -moz-order: 1;
	  -webkit-order: 1;
	  order: 1;
	}
	
	/*元素比例*/
	.flex-one{
	  -prefix-box-flex: 1; 
	  -webkit-box-flex: 1; 
	  -webkit-flex: 1; 
	  -moz-box-flex: 1; 
	  -ms-flex: 1; 
	  flex: 1; 
	}
	
	/*flex兼容写法 end*/
	 /*组件通用*/
	 .fa-angle-down {
	  margin-left: 5px;
	  width: 15rpx;
	  height: 15rpx;
	  border-top: 2rpx solid #b2b2b2;
	  border-right: 2rpx solid #b2b2b2;
	  transform: rotate(45deg);
	}
	 .padding-0{
	  padding:0px!important;
	}
	.padding-top-0{
	  padding-top: 0px!important;
	}
	.padding-left-10{
	  padding-left: 10px!important;
	}
	.padding-left-15{
	  padding-left: 15px!important;
	}
	.padding-10{
	  padding:10px!important;
	}
	.padding-vertical-5{
	  padding-top: 5px!important;
	  padding-bottom: 5px!important;
	}
	.padding-horizontal-10{
	  padding-left: 10px!important;
	  padding-right: 10px!important;
	}
	.margin-0{
	  margin:0px !important;
	}
	.margin-right-5{
	  margin-right: 5px!important;
	}
	.margin-right-10{
	  margin-right: 5px!important;
	}
	.inline-block {
	  display: inline-block !important;
	}
	.text-center{
	  text-align: center!important;
	}
	.text-nowrap{
	  white-space: nowrap;
	}
	.font-weight-800{
	  font-weight: 800;
	}
	.underline{
	  position:absolute;bottom:-4px;left:0;width:100%;margin-left: 0px;
	}
	.underline-div{
	  height: 3px;
	  width: 50%;
	}
</style>
