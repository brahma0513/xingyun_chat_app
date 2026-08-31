<template>
	<view :style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding: '+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;'" :id="'tab-'+datas.id">
		<view class="custom-video-new" :style="'border-radius: '+datas.content.radius_diy+'px;'">
			<block v-if="datas.content.video_link!=''">				
				<!-- <video :src="datas.content.video_link" :poster="http_host+'/../../HTML/admui/public/custom/images/mod_video.png'" controls></video> -->
				<mp-html ref="article" id="_root" :content="videoHtml(datas.content.video_link, http_host+'/uniapp_template/web/static/images/mod_video.png')" />
	            <!-- <image @click="videoPlay" :src="http_host+'/../../HTML/admui/public/custom/images/mod_video.png'" alt=""></image>  -->
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name:"newTexts",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {
				http_host: '',
				play: false,				
				videoContext: null,
			}
		},
		created() {
			let that = this
			this.http_host = this.vuex_apiUrl; 
		},
		methods: {
			 videoHtml(videoUrl, poster) {
			    return `<video id="diyVideo" poster="${poster}" src="${videoUrl}" controls style="width:100%;border-radius: ${this.datas.content.radius_diy}px;'"></video>`;
			 },
			 videoPlay(){
				let that = this
				this.play = true;
				setTimeout(function(){
					that.videoContext = uni.createVideoContext('diyVideo');//创建视频实例指向video
					that.videoContext.play();  //播放
				},1000)
			 }
		}
	}
</script>

<style>
	.custom-video-new{
	  overflow: hidden;
	  font-size: 0;
	  /* height: 200px; */
	}
	.custom-video-new image {
	  display: block;
	  width: 100%;
	  height: 360rpx;
	}
	.custom-video-new video {
	  display: block;
	  width: 100%;
	}
</style>