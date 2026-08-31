<template>
	<view :style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding: '+datas.content.padding_top+'px '+(datas.content.display_method==2?datas.content.padding_horizontal:0)+'px '+datas.content.padding_bottom+'px;border: '+(datas.content.display_method==1&&datas.content.border_style==2?datas.content.border_diy+'px solid'+datas.content.border_color:'none')+';border-radius:'+(datas.content.display_method==1?datas.content.radius_diy:0)+'px;background-size:100% 100%;overflow: hidden;'">
	    <!--横向滚动-->
	    <block v-if="datas.content.rolling_direction == 1">
			<view class='news-scroll news-scroll1' :style="'background-color: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==1?datas.content.card_bg_color:'transparent')+';background-image: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==2?'linear-gradient('+datas.content.card_gradient_angle+','+datas.content.card_gradient_color1+','+datas.content.card_gradient_color2+')':datas.content.display_method==2&&datas.content.card_select_bg_model==3?'url('+datas.content.card_bg_img+')':'none')+';padding-left:'+(datas.content.padding_left)+'px;border: '+(datas.content.display_method==2&&datas.content.border_style==2?datas.content.border_diy+'px solid'+datas.content.border_color:'none')+';border-radius: '+(datas.content.display_method==2?datas.content.radius_diy2:0)+'px;height:60rpx'">
	        <image class="news-laba" :src='datas.content.icon_pic' style="width: 32rpx;height: 32rpx;" mode=''></image>
	        <view class="swiper_container">
			  <view class="swiper_text_wrap" :style="(orientation+':'+marqueeDistance)+'px;width:'+(length*2)+'px;'">
	              <view class="swiper_item">
	                <block v-for="(item,index) in datas.content.dataset">
	                  <view @click="$common.diyLinkJump(item.link)" :class="'navigator ' + (index < datas.content.dataset.length-1 ?'pr-nav':'' )" :style="'line-height:'+(item.type==1?'initial':'30px')+';height:'+(item.type==1?'auto':'30px')" >
	                     <text :style="'white-space: pre;color:'+datas.content.color+';font-size: '+datas.content.font_size+'px;'">{{item.title?item.title:'滚动公告内容'}}</text>
	                  </view>
	                </block>
	              </view>
	          </view>
	        </view>
	        <view class="city">
	          <text class="text-nowrap" :style="'color: '+(datas.content.link_color?datas.content.link_color:'#999999')+';font-size: '+datas.content.link_font_size+'px;'" v-if="datas.content.checked_rule==1">{{datas.content.link_title}}</text>
	          <view v-if="datas.content.checked_rule2==1" class="fa-angle-down" :style="'border-color: '+(datas.content.link_icon_color?datas.content.link_icon_color:'#999999')"></view>
	        </view>
	      </view>
	    </block>
	    <!--竖向滚动-->	    
	    <block v-if="datas.content.rolling_direction == 2">
	        <view class='news-scroll news-scroll2' :style="'background-color: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==1?datas.content.card_bg_color:'transparent')+';background-image: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==2?'linear-gradient('+datas.content.card_gradient_angle+','+datas.content.card_gradient_color1+','+datas.content.card_gradient_color2+')':datas.content.display_method==2&&datas.content.card_select_bg_model==3?'url('+datas.content.card_bg_img+')':'none')+';padding-left:'+(datas.content.padding_left)+'px;border: '+(datas.content.display_method==2&&datas.content.border_style==2?datas.content.border_diy+'px solid'+datas.content.border_color:'none')+';border-radius:' +datas.content.radius_diy2+'px;background-size:100% 100%;'">
	            <image class="news-laba" :src="datas.content.icon_pic" mode='' ></image>
	            <swiper class="swiper_container" vertical="true" autoplay="true" circular="true" :interval="(datas.content.show_time_limit*1000)">
	                <block v-for="(item,index) in datas.content.dataset">
	                    <swiper-item style="overflow:visible" >
	                        <view v-if="item.sel_link_type==1" @click="$common.diyLinkJump(item.link)" class="navigator" style='width:100%' >
	                            <view class="swiper_item scrolltext" :id="'scroll'+index"><text style="white-space: pre;">{{item.title?item.title:'滚动公告内容'}}</text></view>
	                        </view>
	                    </swiper-item>
	                    <swiper-item :class="item.line" v-if="item.line == 1 && datas.content.dataset.length == 1">
	                        <view @click="$common.diyLinkJump(item.link)" class="navigator" style='width:100%' >
	                            <view class="swiper_item scrolltext"><text style="white-space: pre;">{{item.title?item.title:'滚动公告内容'}}</text></view>
	                        </view>
	                    </swiper-item>
	                    
	                     <block v-if="item.line > 1"  v-for="(it,idx) in [1,2,3]"  > 
	                      <swiper-item v-if="idx < item.line-1">
	                      </swiper-item>
	                    </block>
	                </block>
	            </swiper>
	            <view class="city">
	               <text class="text-nowrap" :style="'color: '+(datas.content.link_color?datas.content.link_color:'#999999')+';font-size: '+datas.content.link_font_size+'px;'" v-if="datas.content.checked_rule==1">{{datas.content.link_title}}</text>
	               <view v-if="datas.content.checked_rule2==1" class="fa-angle-down" :style="'border-color: '+(datas.content.link_icon_color?datas.content.link_icon_color:'#999999')"></view>
	            </view>
	        </view>
	    </block>
	</view>
	
</template>

<script>
	export default {
		name:"newScroll",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {
				text: '',
				marqueePace: 1,//
				marqueeDistance: 0,//初始滚动距离
				orientation: 'left',//滚动方向
				interval: 10, // 时间间隔 滚动速度,
				windowWidth: 0
			};
		},
		beforeMount(){
			var vm = this;
			var content = vm.datas.content
			var textListLength = content.dataset.length
			var windowWidth = uni.getSystemInfoSync().windowWidth - 50;// 屏幕宽度
			var length = 0;//文字长度
			var finSpeed = vm.interval + content.rolling_speed
			for (var idx in content.dataset) {
			  length += content.dataset[idx].title.length * 16
			  if (idx < content.dataset.length - 1) {
			    length += 300
			  }
			}
			
			vm.length = length,
			vm.windowWidth = windowWidth,
			vm.interval = finSpeed
			if (content.rolling_direction == 1) {
			  vm.run1();// 水平一行字滚动完了再按照原来的方向滚动
			}
			
		},
		created(){
			
		},
		methods:{
			run1(){
				var vm = this;
				var interval = setInterval(function () {
					if (-vm.marqueeDistance < vm.length) {
						vm.marqueeDistance = vm.marqueeDistance - vm.marqueePace
					}else{
						clearInterval(interval);
						vm.marqueeDistance = vm.windowWidth
						vm.run1();
					}
				},vm.interval)
			}
		}
	}
</script>

<style>
.no-hover {
  background-color: transparent;
}

.news-laba {
  display: inline-block;
  width: 25px;
  height: 25px;
  padding-right: 10px
}

.news-scroll {
  width: 100%;
  padding: 10px 15px;
  box-sizing: border-box;
  font-size: 0;
  display: flex;
  align-items: center;
}

.news-scroll .swiper_container {
  height: 30px;
  line-height: 30px;
  width: 100%;
  display: inline-block;
  position: relative;
  overflow: hidden
}


.news-scroll .navigator {
  float: left
}

.news-scroll .swiper_text_wrap {
  position: absolute;
  top: 0;
}

.news-scroll .swiper_item {
  font-size: 13px;
}

.news-scroll1 .navigator {
  display: inline-block
}

.pr-nav {
  padding-right: 300px
}

.city {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 15px;
  padding-left: 10px;
}
.text-nowrap {
  white-space: nowrap;
}

.fa-angle-down {
  margin-left: 5px;
  width: 15rpx;
  height: 15rpx;
  border-top: 2rpx solid #b2b2b2;
  border-right: 2rpx solid #b2b2b2;
  transform: rotate(45deg);
}
</style>
