<template>
	<view class="">
		<!--pages/component_list/index.wxml-->
		<!-- 导航栏-一start -->
		<view class='contaner'>
		  <view class='head fixed'>
		    <view class='back2'>
		
		      <view class="navbar">
		        <scroll-view class='navbar_content' scroll-x>
		          <view v-for="(item,index) in menu_list" :class="'item '+(now_navid==item.id ? ' active' : '')" :key="item.unique" @click="navbarTap(index,item.id)">{{item.name}}</view>
		        </scroll-view>
		      </view>
		    </view>
		  </view>
		
		  <!-- <view class='head' hidden='{{show_menu}}'>
		    <view class="navbar_content" style='height: 80rpx;'>
		    </view>
		  </view> -->
		
		  <!-- 导航栏-一end -->
		  <!--遮罩层start  -->
		  <view :class="'mask '+stuts==0?'':' display_none'">
		
		  </view>
		  <!--遮罩层end  -->
		  <!-- 视频列表-- start-->
		  <view class="content_box">
		    <!--列表——风格6start  -->
		    <view class='big_video_list'>
		      	<scroll-view scroll-y @scrolltolower='get_next_page' class="show_list">
				  
		        <block v-for="item in video_data" >
		          <view class='big_video' @click='go_video_info(item.id)'>
		            <image :src='item.original_img' class='big_video_img' mode='aspectFill'></image>
		            <view class='big_video_text1'>{{item.title}}</view>
		            <view class='big_video_arr'>
		              <view>{{item.release_time}}</view>
		              <view class='big_video_browse'>
		                <image :src="http_host+'/website/web/static/images/chakan.png'" class='big_video_browse_img'></image>
		                <view>{{item.read_num}}</view>
		              </view>
		              <view class='big_video_browse'>
		                <image :src="http_host+'/website/web/static/images/yizan.png'" class='big_video_browse_img' v-if="item.user_like==1"></image>
		                <image :src="http_host+'/website/web/static/images/zan2.png'" class='big_video_browse_img' v-else></image>
		                <view>{{item.like_num}}</view>
		              </view>
		            </view>
		            <image :src="http_host+'/website/web/static/images/bofang.png'" class='bofang1'></image>
		          </view>
		
		        </block>
				<view class='none' v-if="video_data.length<=0">
				  <image :src="http_host+'/website/web/static/images/none.png'" class='none_img'></image>
				  <view class='none_wenben'>暂无任何资讯</view>
				</view>
					<view class='nothing_box' v-if="!show_nothing&&video_data.length>0">没有更多啦~</view>
			</scroll-view>
		        <view class='clear'></view>
		    
		    </view>
		
		
		
		    <!--列表——风格6end  -->
		
		  </view>
		  
		   
		</view>
	
	<!--视频列表end-->
	<!-- 分享组件 -->
	<xdShare ref="xdshareRef" :shareInfo="shareInfo"></xdShare>
<!-- 底部和悬浮导航公共组件 -->
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
			    navbar: ['热门', '故事', '产品', '服务', '生活', '娱乐'],
			    currentTab: 0, //通过下标来控制显示分类
			    now_navid: -1,//当前选择的分类ID  //-1为所有分类，>1为单个分类
			    video_data:[], //视频数据
			    http_host: "", //域名
			    stuts: 1,//导航栏的点击事件控制的参数
			    numxx: 80,//导航栏起始位置的高
			    menu_list: [], //分类数据
			    page:1,
			    show_menu: true, //是否显示分类
			    pageCount: 1, //总页数
			    show_nothing: true,
			    template_data: { has_bottom: true },
				shareInfo:{},
		}
		},
		onLoad(option){
	    var that = this;
		that.http_host = this.vuex_apiUrl;
	    if(typeof option.category == 'undefined'){
	      option.category = -1;
	    }
	      that.now_navid=option.category;
	      that.get_menu_data(); //获取分类数据
	     that.show_menu=false;
	    that.get_page_title(); //获取title

		},
		methods:{
			
			  //获取资讯视频数据
			  get_video_data: function () {
			    var that = this;
			    var data = {};
			    data.type = 'video';
				data.category = that.now_navid;
				data.page = that.page;
				data.num = 10;
				this.$api.getWebsVideoPage(data).then(res=>{
						console.log("视频数据==", res);
						if (res.errcode == 0) {
						  var data_list = that.video_data;
						  data_list = [...data_list,...res.data.data];
						    that.video_data= data_list;
						    that.pageCount= res.data.pageCount;
						} else {
						    that.video_data= [];
						    that.pageCount= 1;
						}
							});
			  },
			  //获取分类数据
			  get_menu_data: function () {
			    var that = this;
			    var data = {};
			    data.type = 'video';
				this.$api.getWebsAllCategory(data).then(res=>{
						console.log("分类数据==", res);
						var obj={};
						obj.id=-1;
						obj.name='全部';
						res.data.unshift(obj);
						 that.menu_list= res.data;
						that.get_video_data(); //视频数据
							});
			  },
			  //跳转视频详情页
			  go_video_info: function (id) {
			    console.log("进方法跳转");
			    uni.navigateTo({
			      url: '../video_details/video_details?kid=' + id
			    })
			  },
			  click: function () {
			    var that = this;
			   
			      that.stuts=0;
			      that.numxx="auto";
			  },
			  click1: function () {
			    var that = this;
			      that.stuts=1;
			      that.numxx="80";
			  },
			  //分类选择
			  navbarTap : function (idx,id) {
			    var that=this;
			      that.currentTab= idx;
			      that.now_navid=id;
			      that.page=1;
			      that.video_data=[];
			    that.click1();
			    that.get_video_data(); //视频数据
			  },
			  get_next_page: function () {
			    var that=this;
			    // 页面上拉触底事件的处理函数
			    that.page = that.page + 1;
			    if (that.page <= that.pageCount) {
			      that.get_video_data();
			    } else {
			        that.show_nothing= false;
			    }
			  },
			    //获取title
			    get_page_title: function() {
			      var that = this;
			      var data = {};
			      data.art_id = that.art_id;
				  this.$api.getWebsBaseInfoSet(data).then(res=>{
				  console.log(res)
				  if(res.errcode == 0){
				    wx.setNavigationBarTitle({
				        title: res.data.title
				    })
					//分享对象信息
					that.shareInfo = {
						title:"热点视频", //分享标题
						app_name: 'website', //跳转应用名称
						path: '/website/pages/video_list/video_list', //页面 path ，必须是以 / 开头的完整路径。例：/pages/index/index
						query: {
						}, //自定义参数
						imageUrl: '', //分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4，传空值会有默认logo
						content: '', //百度小程序表现为：分享内容；支付宝小程序表现为：吱口令文案
						desc: '' //自定义分享描述
					};
				  }else{
				    console.log("获取数据失败！")
				  }
				  			});
			    },
		}
		}
</script>

<style>
	/* pages/component_list/index.wxss */
	
	page {
	  display: flex;
	  flex-direction: column;
	  height: 100%;
	}
	.show_list{
		height: 1450rpx;
	}
	.nothing_box{
	  color:#999;
	  text-align: center;
	  margin: 20rpx 0;
	  font-size: 30rpx;
	}
	/*<!-- 导航栏-一start -->*/
	.content_box{
			padding-top: 80rpx;
	}
	.head {
	  background: #fff;
	  font-size: 30rpx;
	}
	
	.fixed {
	  position: fixed;
	  z-index: 999;
	}
	
	.navbar {
	  flex: none;
	  display: flex;
	  width: 750rpx;
	  /* height: 80rpx; */
	}
	
	.navbar_content {
	  display: flex;
	  white-space: nowrap; 
		
	}
	.height_80{
	   height: 80rpx;
	}
	.height_auto{
	   height: auto;
	}
	
	.navbar_content::after {
	  content: "";
	  flex: auto;
	  display: block;
	  justify-content: left;
	}
	
	.item {
	  position: relative;
	  text-align: center;
	  line-height: 80rpx;
	  white-space: nowrap;
	  display: inline-block;
	  padding: 0 10rpx;
	  min-width: 18%;
	}
	
	.navbar .navbar_content .item.active {
	  color: #999df9;
	  font-size: 30rpx;
	  
	}
	
	.navbar .navbar_content .item.active:after {
	  content: "";
	  display: block;
	  position: absolute;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  width: 30rpx;
	  margin: 0 auto;
	  text-align: center;
	  height: 4rpx;
	  background: #999df9;
	  top: 70rpx;
	}
	
	.navbar_img {
	  width: 50rpx;
	  height: 80rpx;
	  position: relative;
	  right: 20rpx;
	}
	
	/*<!-- 导航栏-一end -->*/
	
	/**列表1——start*/
	
	.big_picture_list {
	  background: #fff;
	  margin-bottom: 10rpx;
	}
	
	.big_picture {
	  width: 690rpx;
	  height: 615rpx;
	  padding: 30rpx;
	  border-bottom: 1px solid #f7f7f7;
	}
	
	.big_picture_img {
	  width: 690rpx;
	  height: 406rpx;
	  display: block;
	}
	
	.big_picture_text1 {
	  font-size: 32rpx;
	  width: 100%;
	  height: 72rpx;
	  line-height: 36rpx;
	  margin-top: 40rpx;
	  margin-bottom: 40rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  -webkit-box-orient: vertical;
	}
	
	.big_picture_arr {
	  width: 100%;
	  height: 40rpx;
	  line-height: 40rpx;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  font-size: 28rpx;
	  color: #d3d3d3;
	}
	
	.big_picture_browse {
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  margin-left: 40rpx;
	}
	
	.big_picture_browse_img {
	  width: 40rpx;
	  height: 40rpx;
	  display: block;
	}
	
	.more {
	  width: 100%;
	  height: 86rpx;
	  font-size: 30rpx;
	  color: #d3d3d3;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	}
	
	.more_img {
	  width: 40rpx;
	  height: 40rpx;
	  display: block;
	}
	
	.more_wenben {
	  width: 50%;
	  text-align: right;
	}
	
	/**列表1——end*/
	
	/*<!-- 列表——风格2--start -->*/
	
	.right_pictures_list {
	  background-color: #fff;
	  margin-bottom: 10rpx;
	}
	
	.right_pictures {
	  padding: 30rpx;
	  width: 690rpx;
	  height: 150rpx;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  border-bottom: 1px solid #f7f7f7;
	}
	
	.right_pictures_describe {
	  width: 420rpx;
	  height: 150rpx;
	}
	
	.right_pictures_title {
	  font-size: 32rpx;
	  width: 100%;
	  height: 72rpx;
	  line-height: 36rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  -webkit-box-orient: vertical;
	  margin-bottom: 36rpx;
	}
	
	.right_pictures_arr {
	  width: 100%;
	  height: 40rpx;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  font-size: 24rpx;
	  color: #d3d3d3;
	}
	
	.right_pictures_img {
	  width: 230rpx;
	  height: 150rpx;
	  display: block;
	}
	
	.display_none {
	  display: none;
	}
	
	/*<!-- 列表——风格2--end -->*/
	
	/*<!-- 列表——风格3--start -->*/
	
	.multi_graph_list {
	  background: #fff;
	  margin-bottom: 10rpx;
	}
	
	.multi_graph {
	  padding: 30rpx;
	  width: 690rpx;
	  height: 280rpx;
	  border-bottom: 1px solid #f7f7f7;
	}
	
	.multi_graph_title {
	  width: 100%;
	  font-size: 30rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 1;
	  -webkit-box-orient: vertical;
	  margin-bottom: 30rpx;
	}
	
	.multi_graph_img_box {
	  height: 144rpx;
	  width: 100%;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 30rpx;
	}
	
	.multi_graph_img {
	  width: 224rpx;
	  height: 144rpx;
	  display: block;
	}
	
	.multi_graph_arr {
	  width: 100%;
	  height: 40rpx;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  font-size: 24rpx;
	  color: #d3d3d3;
	}
	
	/*<!-- 列表——风格3--end -->*/
	
	/*<!-- 列表——风格4--start -->*/
	
	.article_list {
	  background-color: #fff;
	  margin-bottom: 10rpx;
	  padding: 30rpx 0rpx;
	}
	
	.article {
	  width: 330rpx;
	  height: 430rpx;
	  margin-bottom: 20rpx;
	  margin-left: 30rpx;
	  float: left;
	}
	
	.article_img {
	  width: 100%;
	  height: 270rpx;
	  display: block;
	  margin-bottom: 20rpx;
	}
	
	.article_title {
	  font-size: 32rpx;
	  height: 80rpx;
	  line-height: 40rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  -webkit-box-orient: vertical;
	  margin-bottom: 20rpx;
	}
	
	.article_arr {
	  width: 100%;
	  height: 40rpx;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  font-size: 24rpx;
	  color: #d3d3d3;
	}
	
	.big_picture_browse_img4 {
	  width: 30rpx;
	  height: 30rpx;
	  display: block;
	}
	
	.big_picture_browse4 {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-left: 16rpx;
	}
	
	/*<!-- 列表——风格4--end -->*/
	
	/*<!-- 列表——风格5--start -->*/
	
	.video_list {
	  background-color: #fff;
	  margin-bottom: 10rpx;
	  padding: 30rpx 0rpx;
	}
	
	.video {
	  width: 330rpx;
	  margin-bottom: 20rpx;
	  margin-left: 30rpx;
	  float: left;
	}
	
	.myVideo {
	  width: 100%;
	  height: 270rpx;
	  display: block;
	  margin-bottom: 20rpx;
	}
	
	.video_title {
	  font-size: 32rpx;
	  height: 80rpx;
	  line-height: 40rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  -webkit-box-orient: vertical;
	  margin-bottom: 20rpx;
	}
	
	.video_arr {
	  width: 100%;
	  height: 40rpx;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  font-size: 24rpx;
	  color: #d3d3d3;
	}
	
	.bofang {
	  width: 80rpx;
	  height: 80rpx;
	  display: block;
	  position: relative;
	  bottom: 328rpx;
	  left: 126rpx;
	}
	
	.bofang1 {
	  width: 80rpx;
	  height: 80rpx;
	  display: block;
	  position: absolute;
	  top: 35%;
	  left: 45%;
	}
	
	/*<!-- 列表——风格5--end -->*/
	
	/*<!-- 列表——风格6--start -->*/
	
	.none {
	  background: #fff;
	  margin-bottom: 10rpx;
	  height: 100%;
	}
	
	.none_img {
	  width: 60%;
	  height: 444rpx;
	  display: block;
	  margin-left:23%;
	}
	
	.none_wenben {
	  color: #aaa;
	  text-align: center;
	  font-size: 30rpx;
	}
	
	/*<!-- 列表——风格6--end -->*/
	
	.kuohao {
	  font-size: 30rpx;
	}
	
	.more_wenben {
	  width: 100%;
	  text-align: center;
	}
	
	.big_video_list {
	  background: #fff;
	}
	
	.big_video {
	  padding: 30rpx;
	  border-bottom: 1px solid #f7f7f7;
	  position: relative;
	}
	.big_video:last-child{
	  border-bottom: none;
	}
	.big_video_img {
	  width: 100%;
	  height: 406rpx;
	  display: block;
	  border-radius: 10rpx;
	}
	
	.big_video_text1 {
	  font-size: 34rpx;
	  width: 100%;
	  margin-top: 25rpx;
	  margin-bottom: 30rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  -webkit-box-orient: vertical;
	}
	
	.big_video_arr {
	  width: 100%;
	  height: 40rpx;
	  line-height: 40rpx;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  font-size: 28rpx;
	  color: #999;
	}
	
	.big_video_browse {
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  margin-left: 40rpx;
	}
	
	.big_video_browse_img {
	  width: 40rpx;
	  height: 40rpx;
	  display: block;
	}
	
	.clear {
	  clear: both;
	}
	
	.back {
	  position: absolute;
	  background-color: #fff;
	  z-index: 50;
	  display: flex;
	  justify-content: space-around;
	}
	
	/* 遮罩层start */
	
	.mask {
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  z-index: 2;
	  background: #000;
	  opacity: 0.6;
	}
	
	/* 遮罩层end */

</style>