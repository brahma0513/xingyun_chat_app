<template>
	<view 
		:style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px '+
		(datas.content.style==1?0:10)+'px '+
		(datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px'
	">
		<!--横向滚动-->
		<block v-if="datas.content.rolling_direction == 1">
			<view class="news-scroll news-scroll1" :style="'background-color:'+datas.content.bg_color+';color:'+datas.content.color+';border-radius:'+(datas.content.style==1?0:10)+'px'">
				<image class="news-laba" :src='datas.content.icon_pic' mode=''></image>
				<view class="swiper_container">
					<view class="swiper_text_wrap" :style="(orientation+':'+marqueeDistance)+'px;width:'+(length*2)+'px'">
						<view class="swiper_item">
							<block v-for="(item,index) in datas.content.dataset">
								<view class="navigator" :class="index<datas.content.dataset.length-1 ? 'pr-nav':''"  @click="$common.diyLinkJump(item.link)">
									<text style="white-space: pre;">{{item.title == "" ? '滚动公告栏':item.title}}</text>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
		</block>
		<block v-if="datas.content.rolling_direction == 2">
			<view class="news-scroll news-scroll2" :style="'background-color:'+datas.content.bg_color+';color:'+datas.content.color+';border-radius:'+(datas.content.style==1?0:10)+'px'">
				<image class="news-laba" :src='datas.content.icon_pic' mode=''></image>
				<swiper class="swiper_container" :vertical="true" :autoplay="true" :interval="datas.content.show_time_limit*1000" :circular="true">
					<block v-for="(item,index) in datas.content.dataset">
						<swiper-item style="overflow:visible">
							<view class="navigator" style='width:100%'  @click="$common.diyLinkJump(item.link)">
								<view class="swiper_item scrolltext" :id="'scroll'+index">
									<text style="white-space: pre;">{{item.title == "" ? '滚动公告栏':item.title}}</text>
								</view>
							</view>
						</swiper-item>
						
						<!-- <swiper-item style="overflow:visible">
							<view class="navigator" style='width:100%'>
								<view class="swiper_item scrolltext" :id="'scroll'+index">
									<text style="white-space: pre;">{{item.title}}</text>
								</view>
							</view>
						</swiper-item>
						<swiper-item :class="item.line" v-if="item.line == 1 && datas.content.dataset.length == 1">
							<view class="navigator" style='width:100%'>
								<view class="swiper_item scrolltext">
									<text style="white-space: pre;">{{item.title}}</text>
								</view>
							</view>
						</swiper-item>
						<block v-if="item.line > 1" v-for="(itm,idx) in [1,2,3]" >
							<swiper-item v-if="idx < (item.line-1)"></swiper-item>
						</block> -->
					</block>
				</swiper>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		name:"newsScroll",
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
			var vm = this;//console.log(vm);//return
			var content = vm.datas.content; 
			var textListLength = content.dataset.length
			var windowWidth = uni.getSystemInfoSync().windowWidth - 50;// 屏幕宽度
			var length = 0;//文字长度
			var finSpeed = vm.interval + content.rolling_speed
			for (var idx in content.dataset) {
				if(content.dataset[idx].title == ""){
					length += 5*16
				}else{
					length += content.dataset[idx].title.length * 16
				}
				if (idx < content.dataset.length - 1) {
					length += 300
				}
			}
			vm.length = length
			vm.windowWidth = windowWidth
			vm.interval = finSpeed
			if (content.rolling_direction == 1) {
				vm.run1();// 水平一行字滚动完了再按照原来的方向滚动
			}
			var icon_pic = vm.datas.content.icon_pic
			var reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/);
			if (!reg.test(icon_pic)) {
				var img = vuex_apiUrl + icon_pic;
				vm.datas.content.icon_pic = img
			}
		},
		created(){
			if (this.datas.content.rolling_direction == 2) {
				//this.queryMultipleNodes()
			}
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
	.no-hover{
		background-color: transparent
	}
	.news-laba{display: inline-block;width: 25px;height: 25px;padding-right: 10px;position: relative;top: -3px;}
	.news-scroll{width: 100%;padding:5px 15px;box-sizing: border-box;font-size: 0}
	.news-scroll .swiper_container {
		height: 30px;
		line-height: 30px;
		width: calc(100% - 50px);
		display: inline-block;
		position: relative;
		overflow: hidden
	}
	.news-scroll .navigator{
		float: left
	}
	.news-scroll .swiper_text_wrap{
		position: absolute;
		top: 0;
	}

	.news-scroll .swiper_item {
		font-size: 13px;

	}
	.news-scroll1 .navigator{display: inline-block}
	.pr-nav{padding-right: 300px}
</style>
