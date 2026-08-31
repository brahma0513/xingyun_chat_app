<template>
	<view class="start" v-if="show">
		<swiper class="swiper" :interval="interval" @change="onChangeSwiper" v-if="type == 2">
			<swiper-item v-for="(item, index) in list" :key="index">
				<view class="swiper-item" :style="bgStyle">
					<image class="image" :src="item" mode="widthFix"></image>
					<view class="after" :style="afterStyle"></view>
					<!-- 					<view class="enter" v-if="index === list.length - 1"><view :class="'save-btn skin-bg-' + theme + ''" @click="enter()">进入首页</view></view> -->
					<view class="skip" :style="skipPositionStyle" @click="enter" v-if="skipTime <= 0">跳过</view>
				</view>
			</swiper-item>
			<!-- autoplay -->
		</swiper>
		<view class="swiper-dot" v-if="list.length > 1 && type == 1">
			<view class="view" :style="index === current ? currentStyle : ''" :class="{ active: index === current }" v-for="(item, index) in list" :key="index" />
		</view>
		<view class="video" v-if="type == 1">
			<video ref="video" :src="this.video" @loadedmetadata="loadedmetadata" autoplay @ended="videoEnd" :controls="false">
				<!-- 跳过视频的代码  有bug 暂时屏蔽 20230328 -->
				<!-- <cover-view class="cover-view">
					<view class="skip" :style="skipPositionStyle" @click="onSkip">跳过 {{ skipTime <= 0 ? '' : skipTime }}</view>
				</cover-view> -->
			</video>
		</view>
		<view class="audio" >
			<!-- <uni-audio v-if="audio_url_http!=''" :src="audio_url_http" ref="uAudio" controls ></uni-audio> -->
		</view>
	</view>
</template>

<script>
var innerAudioContext = uni.createInnerAudioContext();
export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			hasTabbar: true,
			hasNavbar: false,
			interval: 5000,
			type: 0, //1视频2图片
			indexUrl: '/pages/index/index',
			// 背景颜色
			bgColor: '#fff',
			afterColor: '',
			// 滑动点颜色
			currentColor: '#999',
			list: [],
			video: '',
			current: 0,
			show: true,
			timer: null,
			// 跳过时间
			skipTime: 5,
			is_use_audio: 0,
			audio_url_http: '',
			imageTimer: null,
			image_time_auto: 0,
		};
	},
	watch: {
		skipTime(val) {}
	},
	computed: {
		bgStyle() {
			return this.obj2strStyle({
				'background-color': this.bgColor
			});
		},
		afterStyle() {
			return this.obj2strStyle({
				'background-color': this.afterColor
			});
		},
		currentStyle() {
			return this.obj2strStyle({
				'background-color': this.currentColor
			});
		},
		skipPositionStyle() {
			const { statusBarHeight } = uni.getSystemInfoSync();
			if (!this.hasNavbar) {
				return this.obj2strStyle({
					top: `${statusBarHeight * 2 + 88 + 30}rpx`
				});
			}
			return this.obj2strStyle({
				top: '30rpx'
			});
		}
	},
	mounted() {
		let that = this;
		innerAudioContext.pause()
		if (this.hasTabbar) {
			uni.hideTabBar();
		}

		// #ifdef APP-PLUS
		//跳过视频的代码  有bug 暂时屏蔽 20230328
		let view = new plus.nativeObj.View('test', { top: '50px', right: '30px', height: '30px', width: '70px' }, [
			{ tag: 'img', id: 'img', src: 'nbg.png', position: { top: '0px', left: '0px', width: '100%', height: '100%' } },
			{ tag: 'rect', id: 'rect', rectStyles: { radius: '36px', color: 'rgba(0,0,0,0.4)' }, position: { top: '0px', left: '0px', radius: '8px', width: '100%', height: '30px' } },
			{ tag: 'font', id: 'font', text: '跳过', textStyles: { size: '15px', color: '#fff', lineSpacing: '10%', whiteSpace: 'normal' }, position: { top: '0px', left: '0px' } }
		]);
		this.view = view;
		view.addEventListener('click', viewClick, false);

		function viewClick(e) {
			console.log(e);
			view.close();
			that.enter();
		}
		// #endif
		// 添加接口
		//非跳过视频的代码 延迟首屏显示避免视频太快加载
		this.$api.openAdvertisingSetting().then(res => {
			if (res.errcode == 0) {
				if (res.data.is_open == 0) {
					uni.reLaunch({
						url: that.indexUrl
					});
				} else {
					setTimeout(() => {
						that.type = res.data.type;
						that.is_use_audio = res.data.is_use_audio;
						that.image_time_auto = res.data.image_time_auto;
						that.list = [];
						that.timer = setInterval(() => {
							if (that.skipTime > 0) that.skipTime--;
							else {
								clearInterval(that.timer);
								// #ifdef APP-PLUS
								if (that.type == 1) that.view.show();
								// #endif
							}
						}, 1000);
						if (that.type == 1){
							if (res.data.type == 1) {
								if (res.data.video_url === 'undefined' || res.data.video_url == null || res.data.video_url === '') {
									uni.reLaunch({
										url: that.indexUrl
									});
								}
								that.video = res.data.video_url;
							}
						}							
						if (that.type == 2) {
							if (res.data.images_url === 'undefined' || res.data.images_url == null || res.data.images_url === '')
								uni.reLaunch({
									url: that.indexUrl
								});
							that.list = res.data.images_url;
							if(that.image_time_auto>0){
								that.imageTimer = setInterval(() => {
									if (that.image_time_auto > 0) that.image_time_auto--;
									else {
										clearInterval(that.imageTimer);
										uni.reLaunch({
											url: that.indexUrl
										});
									}
								}, 1000);
							}
						}
						if (that.is_use_audio==1){
							that.audio_url_http = res.data.audio_url_http;
							innerAudioContext.src =  res.data.audio_url_http
							innerAudioContext.play();
						}
						if (that.type == 0){
							uni.reLaunch({
								url: that.indexUrl
							});
						}
					}, 5000);
				}
			} else {
				uni.showToast({
					title: res.errmsg,
					icon: 'none'
				});
				uni.reLaunch({
					url: this.indexUrl
				});
			}
		});
	},
	methods: {
		obj2strStyle(obj) {
			let style = '';
			for (let key in obj) {
				style += `${key}:${obj[key]};`;
			}
			return style;
		},
		onSkip() {
			if (this.time <= 0) {
				clearTimeout(this.timer);
				this.show = false;
				if (this.hasTabbar) {
					uni.showTabBar();
				}
				if (this.indexUrl) {
					console.log(this.indexUrl);
					uni.reLaunch({
						url: this.indexUrl
					});
				}
			}
		},
		enter() {
			clearTimeout(this.timer);
			if (this.indexUrl) {
				console.log(this.indexUrl);
				uni.reLaunch({
					url: this.indexUrl
				});
			}
			// #ifdef APP-PLUS
			this.view.close();
			// #endif
		},
		loadedmetadata(e) {
			console.log('loadedmetadata', e);
			// 浏览器需要用户发生交互才能自动播放
		},
		videoEnd(e) {
			console.log('end', e);
			this.enter();
		},
		onChangeSwiper(e) {
			this.current = e.detail.current;
		}
	}
};
</script>

<style lang="scss" scoped>
.start {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
}
.cover-view {
	position: fixed;
	z-index: 999;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}
.skip {
	position: absolute;
	z-index: 999;
	background-color: rgba(0, 0, 0, 0.4);
	color: #fff;
	right: 30rpx;
	font-size: 28rpx;
	width: 133rpx;
	height: 60rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.swiper {
	height: 100vh;
	width: 100vw;
}

.swiper-item {
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	background-color: transparent;
	position: relative;
}
.enter {
	position: absolute;
	bottom: 180rpx;
	left: 50%;
	transform: translateX(-50%);
	z-index: 99;
}
.enter-custom-style {
	width: 400rpx;
}
.swiper-item .after {
	width: 100vw;
	height: 500rpx;
	position: absolute;
	left: 0;
	bottom: 0;
	z-index: 1;
}

.swiper-item .image {
	height: 100vh;
	width: 100vw;
	display: block;
	position: relative;
	z-index: 2;
}

.swiper-dot {
	position: absolute;
	width: 100vw;
	left: 0;
	bottom: 100rpx;
	z-index: 3;
	display: flex;
	justify-content: center;
}

.swiper-dot .view {
	width: 16rpx;
	height: 16rpx;
	border-radius: 100%;
	background-color: rgba(0, 0, 0, 0.2);
	margin: 0 12rpx;
}

.swiper-dot .view.active {
	width: 30rpx;
	border-radius: 24rpx;
}
.video {
	width: 100%;
	height: 100vh;
	video {
		width: 100%;
		height: 100vh;
	}
}
.save-btn {
	width: 400rpx;
	height: 80rpx;
	color: #ffffff;
	font-size: 28rpx;
	line-height: 80rpx;
	text-align: center;
	margin: auto;
	border-radius: 80rpx;
}
</style>
