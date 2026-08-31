<template>
	<view class="countdown" :style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding: '+(datas.content.padding_top+'px '+(datas.content.display_method==2?datas.content.padding_horizontal:0)+'px '+datas.content.padding_bottom)+'px;border-radius:'+((datas.content.display_method==1?datas.content.radius_top_diy:0))+'px '+((datas.content.display_method==1?datas.content.radius_top_diy:0))+'px '+((datas.content.display_method==1?datas.content.radius_bottom_diy:0))+'px '+((datas.content.display_method==1?datas.content.radius_bottom_diy:0))+'px;background-size:cover;overflow: hidden;'">
		<view class="custom-countdown" :style="'background-color: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==1?datas.content.card_bg_color:'transparent')+';background-image: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==2?'linear-gradient('+datas.content.card_gradient_angle+','+datas.content.card_gradient_color1+','+datas.content.card_gradient_color2+')':datas.content.display_method==2&&datas.content.card_select_bg_model==3?'url('+datas.content.card_bg_img+')':'none')+';padding-left:'+(datas.content.padding_left)+'px;border-radius:'+((datas.content.display_method==2?datas.content.radius_top_diy:0))+'px '+((datas.content.display_method==2?datas.content.radius_top_diy:0))+'px '+((datas.content.display_method==2?datas.content.radius_bottom_diy:0))+'px '+((datas.content.display_method==2?datas.content.radius_bottom_diy:0))+'px;background-size:cover;overflow: hidden;'">
			<view :class="'countdown-box '+(datas.content.time_underframe ? 'countdown-style-new1':'countdown-style-new2')+' '+(datas.content.time_underframe||datas.content.select_style==1? 'countdown-text-style-new1':'')+' '+(datas.content.select_style==2&&!datas.content.time_underframe? 'countdown-text-style-new2':'')" :style="'text-align: '+(datas.content.text_align==1?'left':'center')">
				<view class="text" v-if="isEnd">已结束</view>
				<view v-if="!isEnd" :class="'flex-def flex-cCenter '+(datas.content.text_align==2?'flex-zCenter':'')" style="width:100%">
	          <view v-if="type==1" :class="datas.content.select_style == 1?'time-type':''">
	            <image v-if="datas.content.select_style == 1" :src="datas.content.icon_end" :style="'width: '+imagewidth+'px; height: '+imageheight+'px;'" @load="imageLoad"/>
	            <view v-else class="title-new" :style="'color:'+datas.content.title_color">{{datas.content.title_end}}</view>
	          </view>
	          <view v-else :class="datas.content.select_style == 1?'time-type':''">
	            <image v-if="datas.content.select_style == 1" :src="datas.content.icon_start" :style="'width: '+imagewidth+'px; height: '+imageheight+'px;'" @load="imageLoad"/>
	            <view v-else class="title-new" :style="'color:'+datas.content.title_color">{{datas.content.title_start}}</view>
	          </view>
	          <view class="flex-def flex-cCenter">
	            <view class="num" :style="'background-color:'+(datas.content.time_underframe&&datas.content.underframe_select_bg_model==1?datas.content.underframe_bg_color:'transparent')+';background-image:'+(datas.content.time_underframe&&datas.content.underframe_select_bg_model==2?'linear-gradient('+datas.content.underframe_gradient_angle+','+datas.content.underframe_gradient_color1+','+datas.content.underframe_gradient_color2+','+datas.content.underframe_gradient_color3+')':'none')+';border-radius:'+(datas.content.time_underframe&&datas.content.underframe_style==2?datas.content.radius_diy:0)+'px'" v-if="datas.content.data_count">{{timelist[0]}}</view>
	            <view class="text" v-if="datas.content.data_count&&datas.content.time_style==2">天</view>
	            <view class="text-new" v-if="datas.content.data_count&&datas.content.time_style==1">:</view>
	            <view class="num" :style="'background-color:'+(datas.content.time_underframe&&datas.content.underframe_select_bg_model==1?datas.content.underframe_bg_color:'transparent')+';background-image:'+(datas.content.time_underframe&&datas.content.underframe_select_bg_model==2?'linear-gradient('+datas.content.underframe_gradient_angle+','+datas.content.underframe_gradient_color1+','+datas.content.underframe_gradient_color2+','+datas.content.underframe_gradient_color3+')':'none')+';border-radius:'+(datas.content.time_underframe&&datas.content.underframe_style==2?datas.content.radius_diy:0)+'px'">{{timelist[1]}}</view>
	            <view class="text" v-if="datas.content.time_style==2">时</view>
	            <view class="text-new" v-if="datas.content.time_style==1">:</view>
	            <view class="num" :style="'background-color:'+(datas.content.time_underframe&&datas.content.underframe_select_bg_model==1?datas.content.underframe_bg_color:'transparent')+';background-image:'+(datas.content.time_underframe&&datas.content.underframe_select_bg_model==2?'linear-gradient('+datas.content.underframe_gradient_angle+','+datas.content.underframe_gradient_color1+','+datas.content.underframe_gradient_color2+','+datas.content.underframe_gradient_color3+')':'none')+';border-radius:'+(datas.content.time_underframe&&datas.content.underframe_style==2?datas.content.radius_diy:0)+'px'">{{timelist[2]}}</view>
	            <view class="text" v-if="datas.content.time_style==2">分</view>
	            <view class="text-new" v-if="datas.content.time_style==1">:</view>
	            <view class="num" :style="'background-color:'+(datas.content.time_underframe&&datas.content.underframe_select_bg_model==1?datas.content.underframe_bg_color:'transparent')+';background-image:'+(datas.content.time_underframe&&datas.content.underframe_select_bg_model==2?'linear-gradient('+datas.content.underframe_gradient_angle+','+datas.content.underframe_gradient_color1+','+datas.content.underframe_gradient_color2+','+datas.content.underframe_gradient_color3+')':'none')+';border-radius:'+(datas.content.time_underframe&&datas.content.underframe_style==2?datas.content.radius_diy:0)+'px'">{{timelist[3]}}</view>
	            <view class="text" v-if="datas.content.time_style==2">秒</view>
	          </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"newCountdown",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},		
		data() {
			return {
				start: '', // 开始时间
				end: '', // 结束时间
				timelist: [], // 存储时间的数组
				time: '', // 存储时间的数组
				isEnd: false, // 是否结束
				type: 1, // 距开始，距结束
				data_count: true, // 是否按天计算,
				http_host: getApp().globalData.http_host,
				imagewidth: 0, // 缩放后的宽
				imageheight: 0, // 缩放后的高
			};
		},
		created() {
			this.start = this.datas.content.start_time.replace(/-/g, "/"), //获取倒计时开始时间
			this.end = this.datas.content.end_time.replace(/-/g, "/"), //获取倒计时结束时间
			this.data_count = this.datas.content.data_count, //是否按天算
		
			this.setTime()
		
		},
		methods:{
			updateEndTime: function() {
				const that=this
				// 开始时间
				var start_ = new Date(this.start).getTime()
				// 结束时间
				var end_ = new Date(this.end).getTime()
				// 当前时间
				var date = new Date().getTime()
				var lag = ''
				var time_type = 1

				if (start_ > date) {
					end_ = start_ // 如果开始时间大于当前时间，结束时间等于当前时间
					time_type = 2 
				}
				lag = end_ - date //计算时间差
				if (lag > 0) {
					// this.data.data_count为true按天倒计时，否则按小时计算
					var second = Math.floor(lag / (1000 * 60 * 60 * 24)); //计算天数
					var minite = this.data_count ? Math.floor(lag / (1000 * 60 * 60) % 24) : Math.floor(lag / (60 * 60 * 1000)); //计算小时数
					var hour = this.data_count ? Math.floor(lag / (1000 * 60) % 60) : Math.floor((lag - minite * 60 * 60 * 1000) / (60 * 1000)); //计算分钟数
					var day = this.data_count ? Math.floor(lag / 1000 % 60) : Math.floor((lag - minite * 60 * 60 * 1000 - hour * 60 * 1000) / 1000); //计算秒
					// 计算是否补0
					second = second < 10 ? "0" + second : second
					minite = minite < 10 ? "0" + minite : minite
					hour = hour < 10 ? "0" + hour : hour
					day = day < 10 ? "0" + day : day
					that.type = time_type
				} else {
					that.isEnd = true
				}
				return [second, minite, hour, day]
					  
			},
			// 开启倒计时
			setTime: function() {
				var _this = this
				_this.time = setInterval(() => {
					_this.timelist = _this.updateEndTime()
					// 清空计时器
					if (_this.timelist[0] == "00" && _this.timelist[1] == "00" && _this.timelist[2] == "00" && _this.timelist[3] == "00" && _this.isEnd) {
						clearInterval(_this.time)
					}
				}, 1000);
			},
			imageLoad: function (e) {
				var imageSize = this.imageUtil(e)
				this.imagewidth = imageSize.imageWidth
				this.imageheight = imageSize.imageHeight
			},
			imageUtil: function (e) {
				var imageSize = {};
				var originalWidth = e.detail.width; // 图片原始宽
				var originalHeight = e.detail.height; // 图片原始高
				var windowHeight = 20;
				//图片缩放后的宽为所需宽
				imageSize.imageHeight = windowHeight;
				imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
				return imageSize;
			},
		}
	}
</script>

<style>
	.custom-countdown {
	  padding: 0 15px;
	  background-position: center center;
	  background-size: 100% 100%;
	  background-repeat: no-repeat;
	}
	
	.custom-countdown .countdown-box,
	.countdown-style-1,
	.countdown-style-2 {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  height: 46.5px;
	}
	
	.custom-countdown .countdown-box .text {
	  font-size: 12px;
	  line-height: 50px;
	}
	
	.custom-countdown .countdown-box span {
	  display: inline-block;
	  vertical-align: middle;
	}
	
	.countdown-style-1 .num {
	  background: red;
	  color: #fff;
	  padding: 4px 5px;
	  border-radius: 5px;
	  margin: 3px;
	
	}
	
	.countdown-style-2 .num {
	  color: red;
	  margin: 3px;
	}
	/*新倒计时*/
	.custom-countdown .countdown-box.countdown-style-new1 .num{color:#ffffff;width:22px;height:22px;font-size:13px;box-sizing: border-box;text-align:center;line-height:22px;}/*有底框*/
	.custom-countdown .countdown-box.countdown-style-new2 .num{color:#FF6617;width:18px;height:22px;font-size:13px;box-sizing: border-box;text-align:center;line-height:22px;}/*无底框*/
	.custom-countdown .countdown-box.countdown-text-style-new1 .text-new{color:#FF6617;line-height:22px;width:7px;height:22px;font-size:15px;box-sizing: border-box;text-align:center;}
	.custom-countdown .countdown-box.countdown-text-style-new2 .text-new{color:#D9001B;line-height:22px;width:7px;height:22px;font-size:15px;box-sizing: border-box;text-align:center;}
	.custom-countdown .countdown-box.countdown-text-style-new2 .num{color:#D9001B;}
	.custom-countdown .countdown-box .title-new{
	    font-size: 15px;
	    line-height:50px;
	    padding-right: 8px;
	    font-weight: 800;
	}
	.time-type{
	  display: flex;
	  align-items: center;
	  margin-right: 5px;
	}
	
	.flex-def{
	  display: flex;
	}
	.flex-cCenter{
	  align-items: center;
	}
	.flex-zCenter{
	  justify-content: center;
	}
</style>