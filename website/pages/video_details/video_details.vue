<template>
	<view>
		<view class='contaner'>
			<block v-if="video_info.content!=''">
				<video id="myVideo" class="myVideo" :src="video_info.content" initial-time='0.3' :poster="video_info.original_img" controls></video>
			</block>
		  
			<view class='video_title'>{{video_info.title}}</view>
			<view class='video_arr'>
				<view>阅读 {{video_info.read_num}}</view>
				<view class='fenge'>|</view>
				<view>{{video_info.release_time}}</view>
				<view class='fenge'>|</view>
				<view>作者 {{video_info.author_name}}</view>
			</view>
		
			<view class='video_information'>视频介绍：</view>
		
			<view class='wenben'>{{video_info.introduction}}</view>
			<!-- 轮播图start -->
			<view v-if="bnrUrl.length>0">
			<swiper class='u-wrp-bnr' indicator-dots :indicator-color='color1' :indicator-active-color="color" autoplay='true' interval='5000' duration='1000' circular='true'>
			  <block v-for="item in bnrUrl" :key="item.unique">
				<swiper-item :data-url="item.ads_link" @click="$common.diyLinkJump(item.ads_link)">
				  <image :src='item.ads_pic' class='u-img-slide' mode='aspectFill'></image>
				</swiper-item>
			  </block>
			</swiper>
			</view>
			<!-- 轮播图end -->
			<view class='fudong'>
				<view class='zan' v-if="video_info.like_switch==1" @click='give_video_like'>
				  <image class='fengxiang' :src="http_host+'/website/web/static/images/yizan1.png'" v-if="video_info.user_like==1"></image>
				  <image class='fengxiang' :src="http_host+'/website/web/static/images/zan.png'"  v-else></image>
				  <view class='zan_num'>{{video_info.like_num}}
					<!--<text v-if="video_info.like_num>=999}}">+</text>-->
				  </view>
				</view>
				<view class='pos_real' @click='go_index'>
				  <image :src="http_host+'/website/web/static/images/index_icon.png'" class='fengxiang'></image>
				  <view class='index_tit pos_abous'>首页</view>
				</view>
				<image class='fengxiang gg'  :src="http_host+'/website/web/static/images/ding.png'" @click='goTop'></image>
			</view>
				
		</view>
		<xdShare ref="xdshareRef" :shareInfo="shareInfo"></xdShare>
		
		<!--	//底部和悬浮导航公共组件 -->
		<pagecom :datas="template_data"></pagecom>

	</view>
</template>

<script>
	import pagecom from '@/components/pagecom/pagecom.vue';
	import xdShare from 'uni_modules/xingdian/components/xd-share/xd-share';
		export default {
			components: {
				pagecom,
				xdShare
			},
	data() {
		return {
	    http_host:"",
		shareInfo:{},
	    video_id:-1,
	    video_info: {content:''},
	    color: "#fff",
	    color1: "f,f,f,0.1",
	    bnrUrl: [],
	    template_data: { has_bottom: true },
		}
	},
	onLoad(e){
		this.http_host = this.vuex_apiUrl;
		this.video_id = e.kid;
		// this.get_data(); 
		this.get_video_info(); //获取视频详情
		this.add_read(); //增加阅读量
	},
	methods:{
		//获取视频数据
		 get_data: function () {
		   var that = this;
		   var data = {};
		   data.type = 'video';
		   this.$api.getWebsIndexData(data).then(res=>{
				console.log("哈哈哈哈==", res.data);
			});
		 },
		 
		   //获取视频详情
		   get_video_info: function () {
		     var that = this;
		     var data = {video_id: that.video_id};
			 this.$api.getWebsVideoMes(data).then(res=>{
			 		console.log("视频详情==", res.data);
					that.video_info= res.data;
					that.bnrUrl= res.data.ad;
			 		uni.setNavigationBarTitle({
			 		    title: res.data.title
			 		})
					
					
					//分享对象信息
					that.shareInfo = {
						title: that.video_info.title, //分享标题
						app_name: 'website', //跳转应用名称
						path: '/website/pages/video_details/video_details', //页面 path ，必须是以 / 开头的完整路径。例：/pages/index/index
						query: {
							kid: that.video_id
						}, //自定义参数
						imageUrl: '', //分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4，传空值会有默认logo
						content: '', //百度小程序表现为：分享内容；支付宝小程序表现为：吱口令文案
						desc: '' //自定义分享描述
					};
					
			 			});
			 
		   },
		   //视频点赞
		   give_video_like: function () {
		     var that = this;
		     var data = {};
			 data.art_id = that.video_id;
		     data.video_id = that.video_id;
		     data.type = 2;		  
			 this.$api.getWebsLike(data).then(res=>{
					let v_info= that.video_info;
			 		if (res.errcode == 1) { 
			 		  v_info.user_like = 1;
			 		  v_info.like_num = parseInt(v_info.like_num) + 1;
			 		} else {
			 		  v_info.user_like = "";
			 		  v_info.like_num = parseInt(v_info.like_num) - 1;
			 		}
					 that.video_info=v_info;
			 		});
		   },
		   //广告图跳转链接
		   go_advice_info:function(url){
		     uni.navigateTo({
		       url: '../website/index?url=' +url,
		     })
		   },
		   //跳转首页
		   go_index:function(){
		 	uni.redirectTo({
		 		url:'../../../pages/index/index'
		 	});
		   },
		   
		   //增加阅读量
		   add_read: function () {
		     var that = this;
		     var data = {};
			 data.art_id= that.video_id;
		     data.video_id = that.video_id;
			 data.type = 2;		
			 this.$api.getWebsRead(data).then(res=>{
			 	
			 			});
		   },
		   doshare() {
		   	// 根据ref 调用子组件方法
		   	this.$refs.xdshareRef.onShare();
		   },
		   // 回到顶部 
		   goTop: function (e) {
		     if (uni.pageScrollTo) {
		       uni.pageScrollTo({
		         scrollTop: 0
		       })
		     } else {
		       uni.showModal({
		         title: '提示',
		         content: '当前版本过低，无法使用该功能，请升级到最新版本后重试。'
		       })
		     }
		   },
	}
		}
	
</script>

<style>
	/* pages/video_details/index.wxss */
	
	page {
	  background: #fff;
	}
	.pos_real{
	  position: relative;
	}
	.pos_abous{
	  position: absolute;
	}
	.index_tit{
	  top: 25%;
	  left: 24%;
	  color: #829ff3;
	  font-size: 28rpx;
	}
	.gg{
	  margin-top: 20rpx;
	}
	.wenben{
	  word-break: break-all;
	  white-space: pre-wrap;
	}
	.myVideo {
	  width: 690rpx;
	}
	.share_bnt{
	  background-color: transparent;
	  width: 100%;
	  border: none;
	   border-radius: 0rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	}
	.share_bnt::after {
	  border: 0; 
	}
	.video_title {
	  font-size: 36rpx;
	  margin-bottom: 20rpx;
	  margin-top: 20rpx;
	}
	
	.video_arr {
	  width: 690rpx;
	  height: 50rpx;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  font-size: 26rpx;
	  color: #d3d3d3;
	}
	
	.fenge {
	  margin: 0 20rpx;
	}
	
	.video_information {
	  margin: 20rpx 0;
	}
	
	.fudong {
	  width: 100rpx;
	  position: fixed;
	  z-index: 2;
	  top: 50%;
	  right: 6rpx;
	}
	
	.zan {
	  height: 120rpx;
	  width: 100rpx;
	}
	
	.zan_num {
	  color: #829ff3;
	  font-size: 20rpx;
	  position: absolute;
	   top: 16%;
	  left: 16%;
	  width: 70%;
	  text-align: center;
	}
	
	.fengxiang {
	  width: 100rpx;
	  height: 100rpx;
	  display: block;
	}
	
	.contaner {
	  padding: 30rpx;
	}
	
	/* 轮播图start */
	
	.u-wrp-bnr {
	  width: 100%;
	  height: 200rpx;
	  display: block;
	  position: relative;
	  top: 20rpx;
	  background: #f0f0f0;
	  border-radius: 10rpx;
	  overflow: hidden;
	  
	}
	.u-img-slide {
	  width: 100%;
	  height: inherit;
	  border-radius: 10rpx;
	}
	
	
	
	
	/* 轮播图end */

</style>