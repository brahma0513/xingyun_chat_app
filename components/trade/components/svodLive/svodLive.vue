<template>
	<!--短视频列表start-->
	<view :style="'padding:'+datas.content.padding+'px 0;'">
	    <view class="svod-container">
	        <view v-if="datas.content.css_type == 0" class="svod-title">
	            <view class="svod-box display-flex">
	                <view v-if="datas.content.type" class="svod-list flex-1">
	                    <view v-for="(itm,index) in group_list" @click='svod_nav' :data-ind="index" :data-id="itm.id" :class="now_nav_index===index?'active skin-color-'+theme:''">
	                        <text>{{itm.group_name}}</text>
	                        <view :class="'line skin-bg-'+theme"></view>
	                    </view>
	                </view>
	                <view v-if="!datas.content.type" class="svod-select flex-1">请选择</view>
	                <view @click='svod_type' :class="'svod-sort '+(!datas.content.type?'rotate':'')">
	                    <image :src="http_host+'/HTML/admui/public/custom/images/icon_jian_bottom.png'"></image>
	                </view>
	            </view>
	            <view v-if="!datas.content.type" class="svod-box svod-box-btn">
	                <view class="svod-data">
	                    <view @click='svod_nav' :data-ind="index" :data-id="itm.id" v-for="(itm,index) in group_list" :class="now_nav_index === index?'active skin-bg-'+theme:''">{{itm.group_name}}</view>
	                </view>
	            </view>
	        </view>
	        <view v-if="!datas.content.type" @click='svod_type' class="svod-mask"></view>
	        <view class="svod-content" >
	            <view class="display-flex"v-if="video_list.length > 0">
	                <view class="svod-ul-left svod-ul">
	                    <view v-for="(itm,index) in video_list" v-if="(index + 1) % 2 != 0">									
	                        <view class="svod-content-bg" @click="gotovideo" :data-videoid='itm.video_id' :data-type='itm.type'>
								<image v-if="itm.type ==0" class="svod-video-img" :src="http_host+'/svod/web/static/images/video_tag.png'" mode="widthFix">
								<view v-if="itm.type == 0" class="svod-img display-flex"><image :src="itm.video_img" alt="" ></view>
								<view v-if="itm.type == 1" class="svod-img display-flex"><image :src="itm.tuwen_img" ></view>
								<view @click.stop="svod_go_detail(itm)" class="svod-vontent-bottom display-flex" v-show="itm.pro_type == 0 && itm.pro_id > 0">
									<view class="left"><image :src="itm.pro_img" alt=""></view>
									<view class="right flex-1">{{itm.pro_name}}</view>
								</view>
								<view @click.stop="svod_go_detail(itm)" class="svod-vontent-bottom display-flex shopBox" v-show="itm.pro_type == 1 && itm.pro_id > 0">
									<view class="shopWrap">
										<view class="shopIcon">
											<image :src="http_host+'/svod/web/static/images/shopIcon1.png'">
										</view>
										<view class="shopText">{{itm.store_name}}</view>
										<view style="clear:both;"></view>
									</view>
								</view>
							</view>
							<view class="svod-center" @click="gotovideo" :data-videoid='itm.video_id' :data-type='itm.type'>{{itm.video_title}}</view>
							<view class="svod-user display-flex" v-if="datas.content.is_show_user">
								<view class="avatar"><image :src="itm.user_img" ></view>
								<view class="name flex-1">{{itm.user_name}}</view>
							</view>
	                    </view>
	                </view>
	                <view class="svod-ul-right svod-ul">
	                    <view v-for="(itm,index) in video_list" v-if="(index + 1) % 2 == 0">
	                        <view class="svod-content-bg" @click="gotovideo" :data-videoid='itm.video_id' :data-type='itm.type'>
	                    		<image v-if="itm.type ==0" class="svod-video-img" :src="http_host+'/svod/web/static/images/video_tag.png'" mode="widthFix">
	                    		<view v-if="itm.type == 0" class="svod-img display-flex"><image :src="itm.video_img" alt="" ></view>
	                    		<view v-if="itm.type == 1" class="svod-img display-flex"><image :src="itm.tuwen_img" ></view>
	                    		<view @click.stop="svod_go_detail(itm)" class="svod-vontent-bottom display-flex" v-show="itm.pro_type == 0 && itm.pro_id > 0">
	                    			<view class="left"><image :src="itm.pro_img" alt=""></view>
	                    			<view class="right flex-1">{{itm.pro_name}}</view>
	                    		</view>
	                    		<view @click.stop="svod_go_detail(itm)" class="svod-vontent-bottom display-flex shopBox" v-show="itm.pro_type == 1 && itm.pro_id > 0">
	                    			<view class="shopWrap">
	                    				<view class="shopIcon">
	                    					<image :src="http_host+'/svod/web/static/images/shopIcon1.png'">
	                    				</view>
	                    				<view class="shopText">{{itm.store_name}}</view>
	                    				<view style="clear:both;"></view>
	                    			</view>
	                    		</view>
	                    	</view>
	                    	<view class="svod-center" @click="gotovideo" :data-videoid='itm.video_id' :data-type='itm.type'>{{itm.video_title}}</view>
	                    	<view class="svod-user display-flex" v-if="datas.content.is_show_user">
	                    		<view class="avatar"><image :src="itm.user_img" ></view>
	                    		<view class="name flex-1">{{itm.user_name}}</view>
	                    	</view>
	                    </view>
	                </view>
	            </view>
				
				<view v-if="video_list.length == 0 && loading" class="svod-img-no">
					<image :src="http_host+'/svod/web/static/images/svod_no.png'"> 
					<view>暂无相关视频</view>
				</view>
				<view class="svod-load-more" @click="svod_load_more()" v-if="page < totalpage">点击加载更多</view>
	        </view>
	    </view>
		<view  v-if="datas.content.video_type == 0"  @click="svod_release_show(datas)" class="svod-fixed" >
			<image :src="http_host+'/svod/web/static/images/home_btn_video.png'" alt="">
		</view>
		
		<view v-if="datas.content.release_boot" class="svod_release_mase"></view>
		<view v-if="datas.content.release_boot" class="svod_release_content">
			<view @click="svod_go_release(datas,2)" class="svod_release_image display-flex" :style="'background: url('+http_host+'/svod/web/static/images/image_bg.png) no-repeat center;'"><image :src="http_host+'/svod/web/static/images/image_icon.png'" alt=""><view>发布图文</view></view>
			<view @click="svod_go_release(datas,1)" class="svod_release_video display-flex" :style="'background: url('+http_host+'/svod/web/static/images/video_bg.png) no-repeat center;'"><image :src="http_host+'/svod/web/static/images/video_icon.png'" alt=""><view>发布视频</view></view>
			<image @click="svod_release_hide(datas)" class="svod_release_img" :src="http_host+'/svod/web/static/images/guanbi_icon.png'" alt="">
		</view>
	</view>
	<!--短视频列表end-->
</template>

<script>
	export default {
		name:"svodLive",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				group_list: [],
				video_list: [],
				now_nav_index: 0,
				now_group_id:-1,
				user_info: {},
				loading: true,
				page: 1,	//当前页
				totalpage: 1,	//总页数
			};
		},
		created() {
			this.http_host = this.vuex_apiUrl;
			this.user_info = this.vuex_user;
			this.get_publish();
			this.groupSelect();
		},
		methods: {
			// 切换tab样式
			svod_type() {
				const that = this;
				that.datas.content.type = !that.datas.content.type
			},
			// tab切换
			svod_nav(e) {
				const that = this;
				that.page = 1;
				that.totalpage = 1;
				that.now_nav_index = e.currentTarget.dataset.ind;
				that.now_group_id = e.currentTarget.dataset.id;
				that.videoSelect(e.currentTarget.dataset.id);
			},
			/**
			 * 获取短视频分组列表
			 */
			groupSelect: function () {
				const _this = this;
				_this.$common.requestData({
					url: '/svod/web/index.php?m=video&a=group', 
					data: {}, 
					method: "POST", 
					needToken: false,
				}).then(res => {
					if (res.errcode == 0) {
						_this.group_list = res.data
						var first_group_id = -1;
						_this.videoSelect(first_group_id);
					}else{
						console.log("短视频分组列表错误:", res)
					}
				})
			},
			/**
			 * 获取短视频列表
			 */
			videoSelect: function (group_id) {
				const _this = this;
				_this.$common.requestData({
					url: '/svod/web/index.php?m=video&a=video_list',
					data: {
						group_id: group_id,
						page: _this.page,
						type: _this.datas.content.content_type
					}, 
					method: "POST", 
					needToken: false,
				}).then(res => {
					if (res.errcode == 0) {						
						_this.video_list = _this.video_list.concat(res.data.video)
						_this.totalpage = res.data.page
					} else {
						console.log("短视频列表错误:", res)
					}
				})
			},
			
			// 跳转商品详情(原H5写法)
			svod_go_detail(itm){
				if (itm.pro_type == 1) {
					if(itm.store_url != ''){
						this.$common.diyLinkJump(itm.store_url,"h5",true)
					}else{
						uni.showToast({
							title: "商品已下架",
							icon:  "error"
						})
					}
				} else {
					if(itm.pro_isout == 0){
						//var url = "/shop/mshop/web/index.php?m=product&a=product_detail&pro_id="+pro_id+'&appid=10030&video_id=' + video_id+'&yundian_id=' + user_id + '&customer_id='+this.vuex_customer_id
						this.$common.diyLinkJump(itm.pro_url,"h5",true);						
					}else{
						uni.showToast({
							title: "商品已下架",
							icon:  "error"
						})
					}
				}
			},
			// 跳转视频详情(原H5写法)
			svod_go_video(item,itm){
				if(itm.type == 0){
					this.$common.diyLinkJump("/svod/web/index.php?m=video&a=user_video&video_id="+itm.video_id+"&group_id="+item.content.group_id+'&customer_id='+this.vuex_customer_id,"h5",true)
				
				}else if(itm.type == 1){
					this.$common.diyLinkJump("/svod/web/index.php?m=video&a=tuwen&video_id="+itm.video_id+'&customer_id='+this.vuex_customer_id,"h5",true)
				}				
			},
			
			
			// 跳转视频详情（原小程序写法）
			gotovideo: function (e) {
				const _this = this;
				var video_id = e.currentTarget.dataset.videoid;
				var type = e.currentTarget.dataset.type;
				var group_id = _this.now_group_id;
				if(type == 0){
					this.$common.diyLinkJump("/svod/web/index.php?m=video&a=user_video&video_id="+video_id+"&group_id="+group_id+'&customer_id='+this.vuex_customer_id,"h5",true)
				}else if(type == 1){
					this.$common.diyLinkJump("/svod/web/index.php?m=video&a=tuwen&video_id="+video_id+'&customer_id='+this.vuex_customer_id,"h5",true)
				}
			},
			// 跳转商品详情（原小程序写法）
			gotopro: function (e) {
				const _this = this;
				var video_id = e.currentTarget.dataset.videoid;
				var pro_id = e.currentTarget.dataset.proid;
				var user_id = e.currentTarget.dataset.user_id;

				var url = "/shop/mshop/web/index.php?m=product&a=product_detail&pro_id="+pro_id+'&appid=10030&video_id=' + video_id+'&yundian_id=' + user_id + '&customer_id='+this.vuex_customer_id
				this.$common.diyLinkJump(url,"h5",true);
			},
			/**
			 * 获取发布配置
			 */
			get_publish: function () {
				const _this = this;
				_this.$common.requestData({
					url: '/svod/web/index.php?m=video&a=publish_onoff',
					data: {}, 
					method: "POST", 
					needToken: false,
				}).then(res => {
					if(res.errcode == 0){
						_this.datas.content.css_type = res.data.cate_onoff
						_this.datas.content.video_type = res.data.publish_onoff
						_this.datas.content.publish_type = res.data.publish_type
						_this.datas.content.product_onoff = res.data.product_onoff
						_this.datas.content.content_type = res.data.content_type
						_this.datas.content.identity = res.data.identity
						_this.datas.content.is_show_user = res.data.is_show_user==1?true:false
											
					}else{
						uni.showToast({
							title: res.errmsg,
							icon:  "error"
						})
					}
						
				})
			},
			
			// 点击加载更多
			svod_load_more(){
				if(this.page < this.totalpage){
					this.page++
					this.videoSelect(this.now_group_id);
				}
			},
			
			// 跳转发布视频页
			svod_go_release(item,num){
				if(num == 1){
					var url = "/svod/web/index.php?m=video&a=video_up&type=1&customer_id="+this.vuex_customer_id
					this.$common.diyLinkJump(url,"h5",true);
				}else if(num == 2){
					var url = "/svod/web/index.php?m=video&a=video_up&type=2&bool=" + item.content.product_onoff+"&customer_id="+this.vuex_customer_id
					this.$common.diyLinkJump(url,"h5",true);
				}
			},
			
			// 隐藏发布跳转弹窗
			svod_release_hide(item){
				item.content.release_boot = false;
			},
			
			// 发布跳转判断
			svod_release_show(item){
				const _this = this;
				_this.$common.requestData({
					url: '/svod/web/index.php?m=video&a=power',
					data: {
						debug:true,
						customer_id: this.vuex_customer_id,
						user_id: this.user_info.user_id
					},
					method: "POST", 
					needToken: true,
				}).then(res => {
					if(res.errcode == 0){
						console.log(item)
						if(res.data.status == 1){
							if(item.content.publish_type == 0){
								item.content.release_boot = true;
							}else if(item.content.publish_type == 1){
								var url = "/svod/web/index.php?m=video&a=video_up&type=1&customer_id="+this.vuex_customer_id
								this.$common.diyLinkJump(url,"h5",true);
							}else if(item.content.publish_type == 2){
								var url = "/svod/web/index.php?m=video&a=video_up&type=2&bool=" + item.content.product_onoff+"&customer_id="+this.vuex_customer_id
								this.$common.diyLinkJump(url,"h5",true);
							}
						}else{
							uni.showToast({
								title: "暂无权限发布视频",
								icon:  "error"
							})
						}
					}else if (res.errcode == 401) {
						uni.showModal({
							title: '提示',
							content: "请先登陆",
							confirmText: '登录',
							success: function(res) {
								if (res.confirm) {
									uni.redirectTo({
										url: '/public/pages/user/login'
									})
								} else if (res.cancel) {}
							}
						});
					}else {
						uni.showToast({
							title: res.errmsg,
							icon:  "error"
						})
					}
				})			
					
			},
		}
	}
</script>

<style>
/* 商品列表组件start */
.display-flex{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
.flex-1{
  -webkit-box-flex: 1;
  -ms-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  width: 50%;
}

.svod-container{
  position: relative;
  background-color: #fff;
}
.svod-title{
  width: 100%;
  position: relative;
  left: 0;
  top: 0;
  height: 40px;
  z-index: 100;
}
.svod-box{
  font-size: 0;
  width: 100%;
  background-color: #fff;
  padding: 0 10px;
  box-sizing: border-box;
}
.svod-box.svod-box-btn{
  position: absolute;
  left: 0;
  top: 40px;
  padding: 0;
}
.svod-list{
  display: -webkit-box;
display: -webkit-flex;
display: flex;
  white-space: nowrap;
  overflow-x: scroll;
}
.svod-select{
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #333;
  padding-left: 5px;
}
.svod-sort{
  width: 40px;
}
.svod-sort>image{
  width: 14px;
  height: 14px;
  margin: 13px;
}
.svod-sort.rotate>image{
  transform:rotate(180deg);
  -ms-transform:rotate(180deg); /* IE 9 */
  -webkit-transform:rotate(180deg); /* Safari and Chrome */
}
.svod-list::-webkit-scrollbar {
  display: none;
}
.svod-list>view{
padding: 0 5px;
box-sizing: border-box;
text-align: center;
  font-size: 0;
  color: #5d5d5d;
}
.svod-list>view>text{
display: inline-block;
position: relative;
font-size: 14px;
line-height: 1;
  padding: 14px 5px 10px;
}
.svod-list>view .line{
display: none;
width: 15px;
height: 3px;
border-radius: 1.5px;
background-color:#FF0036;
margin: 0 auto;
}
.svod-list>view.active{
color: #FF0036;
}
.svod-list>view.active .line{
display: block;
}
.svod-data{
  padding: 15px 15px 0;
}
.svod-data>view{
  display: inline-block;
  height: 25px;
  margin-bottom: 15px;
  margin-right: 10px;
  font-size: 14px;
  color: #5d5d5d;
  border-radius: 4px;
  background-color: #F5F5F5;
  line-height: 25px;
  text-align: center;
  padding: 0 15px;
}
.svod-data>view.active{
  background-color: #FF0036;
  color: #fff;
}

.svod-mask{
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: .6;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
}

/* 商品列表start */
.svod-content{
  padding: 10px;
  
  box-sizing: border-box;
}
.svod-content::-webkit-scrollbar {
  display: none;
}
.svod-content .svod-ul{
  font-size: 0;
  width: calc(50% - 5px);
}
.svod-content .svod-ul-left{
  margin-right: 10px;
}
.svod-content .svod-ul>view{
  margin-bottom: 18.5px;
}
.svod-content-bg{
  height: 229px;
  position: relative;
  border-radius: 9px;
  margin-bottom: 7px;
  overflow: hidden;
}
.svod-content-bg .svod-video-img{
  position: absolute;
  right: 8px;
  top: 8px;
  width: 21px;
  height: 21px;
}
.svod-content-bg .svod-img{
  height: 100%;
  background-color: #000;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
}
.svod-content-bg .svod-img>image{
  max-width: 100%;
  /* max-height: 100%; */
}
.svod-vontent-bottom{
  padding: 7px;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 0;
  box-sizing: border-box;
  background: -webkit-linear-gradient(top,  rgba(0,0,0,0), rgba(0,0,0,.69));
  background: -moz-linear-gradient(top,  rgba(0,0,0,0), rgba(0,0,0,.69));
  background: linear-gradient(top, rgba(0,0,0,0), rgba(0,0,0,.69));
}
.svod-vontent-bottom .left{width: 41px;margin-right: 7px;height: 41px;border-radius: 5px;background-color:#fff;}
.svod-vontent-bottom .left>image{
  width: 41px;
  height: 41px;
  border-radius: 5px;
}
.svod-vontent-bottom .right{
  font-size: 14px;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-top: 2px;
}
.svod-center{
  padding: 0 7px;
  font-size: 13px;
  color: #333;
  margin-bottom: 7px;
  margin-bottom: 7px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
  opacity: .8;
}
.svod-user{
  padding: 0 7px;
  align-items: center;
}
.svod-user .avatar>image{
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-right: 5px;
}
.svod-user .name{
  font-size: 13px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.svod-load-more{
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
.svod-img-no{
  padding-right: 10px;
  padding-top: 20%;
  text-align: center;
}
.svod-img-no>image{
  display: inline-block;
  width: 225px;
  height: 135px;
}
.svod-img-no>view{
  font-size: 14px;
  color: #999;
  margin-top: 32px;
}
/* 商品列表end */
/*上传视频start*/
.svod-fixed{
  display: inline-block;
  font-size: 0;
  position: fixed;
  right: 12px;
  bottom: 77px;
  z-index: 100;
}
.svod-fixed.fixed{
  position: fixed;
}
.svod-fixed>image{
  width: 60px;
  height: 60px;
}
/*上传视频end*/
/*上传弹窗start*/
.svod_release_mase{
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: #000;
  opacity: .6;
  top: 0;
  left: 0;
  z-index: 110;
}
.svod_release_content{
  position: fixed;
  left: 50%;
  top: 35%;
  transform: translateX(-50%);
  z-index: 111;
}
.svod_release_content view{
  margin-left: 20px;
  font-size: 15px;
  color: #333;
}
.svod_release_image{
  width: 215px;
  height: 74px;
  align-items: center;
  margin-bottom: 20px;
  padding-left: 20px;
  box-sizing: border-box;
  box-sizing: border-box;
}
.svod_release_image>image{
  width: 55px;
  height: 55px;
}
.svod_release_video{
  width: 215px;
  height: 74px;
  align-items: center;
  margin-bottom: 46px;
  padding-left: 20px;
  box-sizing: border-box;
  box-sizing: border-box;
}
.svod_release_video>image{
  width: 55px;
  height: 55px;
}
.svod_release_img{
  width: 40px;
  height: 40px;
  position: relative;
  left: 50%;
  margin-left: -20px;
}
/*上传弹窗end*/
/*2.1样式*/
.shopBox {align-items:center;border-radius: 5px;font-size:14px;color:#ffffff;padding-bottom: 12px}
.shopWrap {height:100%;border-radius:5px;}
.shopIcon {width:15px;height:15px;margin:4px 6px;float:left;}
.shopIcon image{border-radius:4px;float:left;width:15px;height:15px;}
.shopText {float:left;line-height:25px;max-width: 115px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
/*2.1样式End*/
/* 商品列表组件end */

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

::-webkit-scrollbar {
  display: none;
}
</style>
