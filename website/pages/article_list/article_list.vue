<template>
	<!--pages/component_list/index.wxml-->
	<view class="">


		<view class='contaner'>
			<!-- 导航栏-一start -->
			<view class='head fixed'>
				<block v-if="is_open == 1">
					<swiper class="swiper" indicator-dots autoplay circular>
						<swiper-item v-for="(item,index) in img_list" :key='index'>
							<navigator
								:url="item.type == 1 ? '/website/pages/article_details/article_details?id='+item.link_id : (item.type == 2 ? '/website/pages/video_list/video_list' : '/website/pages/video_details/video_details?id='+item.link_id)">
								<image :src="item.full_img" mode="" class="slide-img"></image>
							</navigator>
						</swiper-item>
					</swiper>
				</block>
				<view class='back2'>

					<view class="navbar">
						<scroll-view class='navbar_content' scroll-x>
							<view v-for="(item,index) in menu_list"
								:class="'item ' + (navid==item.id ? ' active' : '' )" :key="item.unique"
								@click="navbarTap(index,item.id)">{{item.name}}</view>
						</scroll-view>
					</view>
				</view>
			</view>

			<!-- <view class='head'>
	    <view class="navbar_content" style='height: 80rpx;'>
	    </view>
	  </view> -->
			<!--热门-->
			<!-- <view hidden="{{currentTab!==0}}">
	  tab_01
	</view> -->

			<!-- 导航栏-一end -->
			<!--遮罩层start  -->
			<view :class="'mask '+ stuts==0?'':'display_none'">

			</view>
			<!--遮罩层end  -->
			<!-- 图片列表-- start-->
			<view class="content_box" :style="'margin-top: '+is_open == 1 ? '190px' : '40px'">
				<!-- 列表——风格1start -->
				<view :class="'big_picture_list '+ big_picture_list.length==0?'display_none':''">
					<scroll-view scroll-y @scrolltolower='get_next_page' class="show_list">
					<block v-for="(item,index) in information_data" :key="item.id">
						<!--大图显示start-->
						<view v-if="index==rang_num">
							<view class='big_picture' @click='go_info(item.id)'>
								<image :src='item.original_img' class='big_picture_img' mode='aspectFill'></image>
								<view class='big_picture_text1'>{{item.soft_title}}</view>
								<view class='big_picture_arr'>
									<view>{{item.release_time}}</view>
									<view class='big_picture_browse'>
										<image :src="http_host+'/website/web/static/images/chakan.png'"
											class='big_picture_browse_img'></image>
										<view>{{item.read_num}}</view>
									</view>
									<view class='big_picture_browse' :data-id="item.id" :data-index="index">
										<image :src="http_host+'/website/web/static/images/yizan.png'"
											class='big_picture_browse_img' v-if="item.user_like==1"></image>
										<image :src="http_host+'/website/web/static/images/zan2.png'"
											class='big_picture_browse_img' v-else></image>
										<view>{{item.like_num}}</view>
									</view>
								</view>
							</view>
						</view>
						<!--大图显示end-->
						<!--小图显示start-->
						<view class='right_pictures_list' v-else-if="item.content_img_nums<3">
							<view class='right_pictures' @click='go_info(item.id)'>
								<view class='right_pictures_describe'>
									<view class='right_pictures_title'>{{item.soft_title}}</view>
									<view class='right_pictures_arr'>
										<view>{{item.release_time}}</view>
										<view class='big_picture_browse'>
											<image :src="http_host+'/website/web/static/images/chakan.png'"
												class='big_picture_browse_img'></image>
											<view>{{item.read_num}}</view>
										</view>
										<view class='big_picture_browse'>
											<image :src="http_host+'/website/web/static/images/yizan.png'"
												class='big_picture_browse_img' v-if="item.user_like==1"></image>
											<image :src="http_host+'/website/web/static/images/zan2.png'"
												class='big_picture_browse_img' v-else></image>
											<view>{{item.like_num}}</view>
										</view>
									</view>
								</view>
								<image class='right_pictures_img' :src='item.original_img' mode='aspectFill'></image>
							</view>
						</view>
						<!--小图显示start-->
						<!--三图显示start-->
						<view class='multi_graph_list' v-else-if="item.content_img_nums>=3">
							<view class='multi_graph' @click='go_info(item.id)'>
								<view class='multi_graph_title'>{{item.soft_title}}</view>
								<view class='multi_graph_img_box'>
									<block v-for="(pic,idx) in item.content_img" :key='idx'>
										<image class='multi_graph_img' :src='pic' mode='aspectFill'></image>
									</block>
								</view>
								<view class='multi_graph_arr'>
									<view>{{item.release_time}}</view>
									<view class='big_picture_browse'>
										<image :src="http_host+'/website/web/static/images/chakan.png'"
											class='big_picture_browse_img'></image>
										<view>{{item.read_num}}</view>
									</view>
									<view class='big_picture_browse'>
										<image :src="http_host+'/website/web/static/images/yizan.png'"
											class='big_picture_browse_img' v-if="item.user_like==1"></image>
										<image :src="http_host+'/website/web/static/images/zan2.png'"
											class='big_picture_browse_img' v-else></image>
										<view>{{item.like_num}}</view>
									</view>
								</view>
							</view>
						</view>
						<!--三图显示start-->
					</block>
					<view class='none' v-if="information_data.length<=0">
						<image :src="http_host+'/website/web/static/images/none.png'" class='none_img'></image>
						<view class='none_wenben'>暂无任何资讯</view>
					</view>
					<!--没用更多了-->
					<view class='nothing_box' v-if="!show_nothing&&information_data.length>0">没有更多啦~</view>
					</scroll-view>
				</view>
				<!-- 列表——风格1--end -->
			</view>

			<!-- <view hidden="{{loadingMoreHidden ? true : false}}" class="no-more-goods">没有更多啦</view> -->
	
		</view>
		<!-- 图片列表-- end-->
	
		<!--	//底部和悬浮导航公共组件 -->
		<pagecom :datas="template_data"></pagecom>
	</view>
</template>

<script>
	import pagecom from '@/components/pagecom/pagecom.vue';
	export default {
		components: {
			pagecom
		},
		data() {
			return {
				navbar: ['热门', '故事', '产品', '服务', '生活', '娱乐'],
				currentTab: 0, //通过下标来控制显示分类
				navid: -1, //当前选择的分类ID
				pictures_stutas: 0, //图片列表：1->显示；0->隐藏
				information_data: [], //文章数据
				menu_list: [], //分类数据
				http_host: "", //域名
				stuts: 1, //导航栏的点击事件控制的参数
				numxx: 80, //导航栏起始位置的高
				rang_num: 0, //随机位置
				page: 1,
				loadingMoreHidden: true,
				show_menu: true,
				pageCount: 1, //总页数
				show_nothing: true,
				template_data: {
					has_bottom: true
				},
				shareInfo:{},
				img_list: [], // 轮播图数据
				is_open: "", // 轮播图是否显示
				big_picture_list: [],
			}
		},
		onLoad(option) {
			var that = this;
			that.http_host = this.vuex_apiUrl;
			// console.log("分类==",  option.category);
			if (typeof option.category == 'undefined') {
				option.category = -1;
			}
			that.navid = option.category;

			that.get_carousel(); // 获取轮播数据

			that.get_menu_data(); //获取分类数据
			that.show_menu = false;
			that.get_page_title();

		},
		methods: {
			// 获取轮播数据
			get_carousel() {
				var that = this;
				var data = {};
				this.$api.getWebsAdSettion(data).then(res => {
					console.log(res)
					if (res.errcode == 0) {
						that.img_list = res.data.data.ad_list;
						that.is_open = res.data.data.is_open;
					} else {
						console.log(res.errmsg);
					}
				});
			},
			//获取资讯文章数据
			get_data: function() {
				var that = this;
				var data = {};
				data.type = 'article';
				data.category = that.navid;
				data.page = that.page;
				data.num = 10;
				this.$api.getWebsArtPage(data).then(res => {
					console.log("哈哈哈哈==", res.data);
					var rang = Math.round(Math.random() * 10) + 1;
					console.log("随机数==", rang);
					if (res.errcode == 0) {
						var data_list = that.information_data;
						data_list = [...data_list, ...res.data.data];
						// for (var i = 0; i < res.data.data.length; i++) {
						//   data_list.push(res.data.data[i]);
						// }
						that.information_data = data_list;
						that.rang_num = rang;
						that.pageCount = res.data.pageCount;
					} else {
						that.information_data = [];
						that.loadingMoreHidden = true;
						that.rang_num = rang;
						that.pageCount = 1;
					}
				});
			},
			//获取分类数据
			get_menu_data: function() {
				var that = this;
				var data = {};
				data.type = 'article';
				this.$api.getWebsAllCategory(data).then(res => {
					console.log("分类数据==", res);
					var obj = {};
					obj.id = -1;
					obj.name = '全部';
					res.data.unshift(obj);
					that.menu_list = res.data;
					that.get_data(); //资讯文章数据
				});
			},
			//跳转文章详情页
			go_info: function(id) {
				uni.navigateTo({
					url: '../article_details/article_details?kid=' + id,
				})
			},
			click: function() {
				var that = this;

				that.stuts = 0;
				that.numxx = "auto";
			},
			click1: function() {
				var that = this;
				that.stuts = 1;
				that.numxx = "80";
			},
			//分类选择
			navbarTap: function(idx, id) {
				var that = this;
				that.currentTab = idx;
				that.navid = id;
				that.page = 1;
				that.information_data = [];
				that.click1();
				that.get_data();
			},
			get_next_page: function() {

				var that = this;
				// 页面上拉触底事件的处理函数
				that.page = that.page + 1;
				if (that.page <= that.pageCount) {
					that.get_data();
				} else {
						that.show_nothing=false;
				}
			},
			//获取title
			get_page_title: function() {
				var that = this;
				var data = {};
				data.art_id = that.art_id;
				this.$api.getWebsBaseInfoSet(data).then(res => {
					console.log(res)
					if (res.errcode == 0) {
						wx.setNavigationBarTitle({
							title: res.data.title
						})
						//分享对象信息
						that.shareInfo = {
							title:"热点文章", //分享标题
							app_name: 'website', //跳转应用名称
							path: '/website/pages/video_list/video_list', //页面 path ，必须是以 / 开头的完整路径。例：/pages/index/index
							query: {
							}, //自定义参数 category:that.now_navid,
							imageUrl: '', //分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4，传空值会有默认logo
							content: '', //百度小程序表现为：分享内容；支付宝小程序表现为：吱口令文案
							desc: '' //自定义分享描述
						};
					} else {
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
	.nothing_box {
		color: #999;
		text-align: center;
		margin: 20rpx 0;
		font-size: 30rpx;
	}

	/*<!-- 导航栏-一start -->*/
	.content_box {
		/* margin-top: 80rpx; */
		padding-top: 80rpx;
	}

	.head {
		background: #fff;
		font-size: 30rpx;
		width: 100%;
	}

	.fixed {
		position: fixed;
		z-index: 999;
	}

	.navbar {
		flex: none;
		display: flex;
		margin: 0 auto;
		width: 95%;
		/* width: 750rpx; */
		/* height: 80rpx; */
	}

	.navbar_content {
		display: flex;
		white-space: nowrap;
	}

	.height_80 {
		height: 80rpx;
	}

	.height_auto {
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
	}

	.big_picture {
		width: 690rpx;
		height: 615rpx;
		padding: 30rpx;
		margin: 10rpx 0;
		border-bottom: 1px solid #f7f7f7;
	}

	.big_picture_img {
		width: 690rpx;
		height: 406rpx;
		display: block;
	}

	.big_picture_text1 {
		font-size: 33rpx;
		width: 100%;
		height: 72rpx;
		line-height: 36rpx;
		margin-top: 40rpx;
		margin-bottom: 10rpx;
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
		color: #999;
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
		width: 60%;
		height: 150rpx;
	}

	.right_pictures_title {
		font-size: 33rpx;
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
		color: #999;
	}

	.right_pictures_img {
		width: 35%;
		height: 150rpx;
		display: block;
		border-radius: 8rpx;
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
		font-size: 33rpx;
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
		width: 32%;
		height: 144rpx;
		display: block;
		border-radius: 8rpx;
	}

	.multi_graph_arr {
		width: 100%;
		height: 40rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 24rpx;
		color: #999;
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
		position: relative;
		bottom: 400rpx;
		left: 335rpx;
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
		margin-left: 23%;
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
		margin-bottom: 10rpx;
	}

	.big_video {
		width: 690rpx;
		height: 615rpx;
		padding: 30rpx;
		border-bottom: 1px solid #f7f7f7;
	}

	.big_video_img {
		width: 690rpx;
		height: 406rpx;
		display: block;
	}

	.big_video_text1 {
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

	.no-more-goods {
		text-align: center;
		font-size: 24rpx;
		padding-bottom: 48rpx;
		color: #999;
	}

	.big_video_arr {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 28rpx;
		color: #d3d3d3;
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

	.swiper {
		height: 130px;
	}

	.swiper navigator {
		width: 100%;
		height: 100%;
	}

	.swiper .slide-img {
		width: 100%;
		height: 100%;
	}
</style>
