<template>
	<view>
		<!-- 导航栏-一start -->
		<view class='head' v-if="datas.content.show_menu_type==1">
		  <view class='back2'>
		
		    <view class="navbar">
		      <scroll-view class='navbar_content' scroll-x="true">
		        <view v-for="(item,index) in menu_list" :data-idx="index" :data-id="item.id" :class="'item '+(currentTab==index ? 'active' : '')" @click="navbarTap">{{item.name}}</view>
		      </scroll-view>
		    </view>
		  </view>
		</view>
		<!--热门-->
		<!-- 导航栏-一end -->
		<!--遮罩层start  -->
		<view :class="'mask '+( stuts==0?'':'display_none')">
		
		</view>
		<!--遮罩层end  -->
		<view :style="'padding:'+datas.content.padding+'px 0'">
		  <!-- 图片列表-- start-->
		  <view class='hei' v-if="datas.content.show_state_type==1">
		
		    <!-- 列表——风格1--start -->
		    <view class='big_picture_list' v-if="information_data.length>0&&datas.content.css_type==2">
		
		      <block v-for="(item,index) in information_data">
		
		        <view class='big_picture' :data-id="item.id" @click='go_info'>
		          <image v-if="item.original_img!=''" :src='item.original_img' class='big_picture_img' mode='aspectFill'></image>
		          <view class='big_picture_text1'>{{item.title}}</view>
		          <view class='big_picture_arr'>
		            <view :hidden='!datas.content.createtime_show'>{{item.release_time}}</view>
		            <view class='big_picture_browse' v-if="datas.content.read_show==true">
		              <image :src="http_host+'/website/web/static/images/chakan.png'" class='big_picture_browse_img'></image>
		              <view>{{item.read_num}}</view>
		            </view>
		            <view class='big_picture_browse' v-if="datas.content.like_show==true">
		              <image :src="http_host+'/website/web/static/images/yizan.png'" class='big_picture_browse_img' v-if="item.user_like==1"></image>
		              <image :src="http_host+'/website/web/static/images/zan2.png'" class='big_picture_browse_img' v-else></image>
		              <view>{{item.like_num}}</view>
		            </view>
		          </view>
		        </view>
		
		      </block>
		
		      <view class='more' v-if="datas.content.show_more==1&&information_data.length>2" @click="go_art_list">
		        <view class='more_wenben'>查看更多</view>
		        <image :src="http_host+'/website/web/static/images/you.png'" class='you_img'></image>
		      </view>
		
		    </view>
		
		    <view class='none' v-if="information_data.length<=0">
		      <image :src="http_host+'/website/web/static/images/none.png'" class='none_img'></image>
		      <view class='none_wenben'>暂无任何资讯</view>
		    </view>
		
		    <!-- 列表——风格1--end -->
		
		
		    <!-- 列表——风格2--start -->
		    <view class='right_pictures_list' v-if="datas.content.css_type==1">
		
		      <block v-for="(item, index) in information_data">
		
		        <view class='right_pictures' :data-id="item.id" @click='go_info'>
		          <view :class="item.original_img!='' ? 'right_pictures_describe' : 'full_describe'">
		            <view class='right_pictures_title'>{{item.title}}</view>
		            <view class='right_pictures_arr'>
		              <view :hidden='!datas.content.createtime_show'>{{item.release_time}}</view>
		              <view class='big_picture_browse' v-if="datas.content.read_show==true">
		                <image :src="http_host+'/website/web/static/images/chakan.png'" class='big_picture_browse_img'></image>
		                <view>{{item.read_num}}</view>
		              </view>
		              <view class='big_picture_browse' v-if="datas.content.like_show==true">
		                <image :src="http_host+'/website/web/static/images/yizan.png'" class='big_picture_browse_img' v-if="item.user_like==1"></image>
		                <image :src="http_host+'/website/web/static/images/zan2.png'" class='big_picture_browse_img' v-else></image>
		                <view>{{item.like_num}}</view>
		              </view>
		            </view>
		          </view>
		          <image class='right_pictures_img' v-if="item.original_img!=''" :src='item.original_img' mode="aspectFill"></image>
		        </view>
		
		      </block>
		
		      <view class='more' v-if="datas.content.show_more==1&&information_data.length>2">
		        <view class='more_wenben' @click="go_art_list">查看更多</view>
		        <image :src="http_host+'/website/web/static/images/you.png'" class='you_img'></image>
		      </view>
		    </view>
		    <!-- 列表——风格2--end -->
		
		
		    <!-- 列表——风格3--start -->
		    <view class='multi_graph_list' v-if="datas.content.css_type==3">
		
		      <block v-for="(item,index) in information_data" >
				  <!--三图start-->
				  <view class='multi_graph' v-if="item.content_img_nums>=3" :data-id="item.id" @click='go_info'>
					<view class='multi_graph_title'>{{item.title}}</view>
					<view class='multi_graph_img_box'>
					  <block v-for="(pic,pic_index) in item.content_img">
						<image class='multi_graph_img' :src='pic' mode='aspectFill'></image>
					  </block>
					</view>
					<view class='multi_graph_arr'>
					  <view :hidden='!datas.content.createtime_show'>{{item.release_time}}</view>
					  <view class='big_picture_browse' v-if="datas.content.read_show==true">
						<image :src="http_host+'/website/web/static/images/chakan.png'" class='big_picture_browse_img'></image>
						<view>{{item.read_num}}</view>
					  </view>
					  <view class='big_picture_browse' v-if="datas.content.like_show==true">
						<image :src="http_host+'/website/web/static/images/yizan.png'" class='big_picture_browse_img' v-if="item.user_like==1"></image>
						<image :src="http_host+'/website/web/static/images/zan2.png'" class='big_picture_browse_img' v-else></image>
						<view>{{item.like_num}}</view>
					  </view>
					</view>
				  </view>
				  <!--三图end-->
				  <view v-else>
					  <!--随机大图start-->
					  <view class='big_picture' v-if="index==rang_num" :data-id="item.id" @click='go_info'>
					    <image v-if="item.original_img!=''" :src='item.original_img' class='big_picture_img'></image>
					    <view class='big_picture_text1'>{{item.title}}</view>
					    <view class='big_picture_arr'>
					      <view :hidden='!datas.content.createtime_show'>{{item.release_time}}</view>
					      <view class='big_picture_browse' v-if="datas.content.read_show==true">
					        <image :src="http_host+'/website/web/static/images/chakan.png'" class='big_picture_browse_img'></image>
					        <view>{{item.read_num}}</view>
					      </view>
					      <view class='big_picture_browse' v-if="datas.content.like_show==true">
					        <image :src="http_host+'/website/web/static/images/yizan.png'" class='big_picture_browse_img' v-if="item.user_like==1"></image>
					        <image :src="http_host+'/website/web/static/images/zan2.png'" class='big_picture_browse_img' v-else></image>
					        <view>{{item.like_num}}</view>
					      </view>
					    </view>
					  </view>
					  <!--随机大图end-->
					  		 
					  <!--单图列表start-->
					  <view class='right_pictures' v-if="item.content_img_nums<3" :data-id="item.id" @click='go_info'>
					    <view :class="item.original_img!='' ? 'right_pictures_describe' : 'full_describe'">
					      <view class='right_pictures_title'>{{item.title}}</view>
					      <view class='right_pictures_arr'>
					        <view :hidden='!datas.content.createtime_show'>{{item.release_time}}</view>
					        <view class='big_picture_browse' v-if="datas.content.read_show==true">
					          <image :src="http_host+'/website/web/static/images/chakan.png'" class='big_picture_browse_img'></image>
					          <view>{{item.read_num}}</view>
					        </view>
					        <view class='big_picture_browse' v-if="datas.content.like_show==true">
					          <image :src="http_host+'/website/web/static/images/yizan.png'" class='big_picture_browse_img' v-if="item.user_like==1"></image>
					          <image :src="http_host+'/website/web/static/images/zan2.png'" class='big_picture_browse_img' v-else></image>
					          <view>{{item.like_num}}</view>
					        </view>
					      </view>
					    </view>
					    <image class='right_pictures_img' v-if="item.original_img!=''" :src='item.original_img' mode='aspectFill' ></image>
					  </view>
					  <!--单图列表end-->
				  </view>
		        
		        
		      </block>
		
		      <view class='more' v-if="datas.content.show_more==1&&information_data.length>2" @click="go_art_list">
		        <view class='more_wenben'>查看更多</view>
		        <image :src="http_host+'/website/web/static/images/you.png'" class='you_img'></image>
		      </view>
		    </view>
		    <!-- 列表——风格3--end -->
		  </view>
		  <!-- 图片列表-- end-->
		
		
		
		
		
		  <!-- 视频列表-- start-->
		  <view class='hei' v-if="datas.content.show_state_type==2">
		    <!-- 列表——风格5start -->
		    <view class='video_list' v-if="video_data.length>0&&datas.content.video_type==2">
		      <block v-for="(item,index) in video_data">
		
		        <view class='video' :data-id="item.id" @click='go_video_info'>
		          <image :src='item.original_img' class='myVideo' mode='aspectFit'></image>
		          <view class='video_title'>{{item.title}}</view>
		          <view class='video_arr'>
		            <view :hidden='!datas.content.createtime_show'>{{item.release_time}}</view>
		            <view class='big_picture_browse4 read_center' v-if='datas.content.read_show=true'>
		              <image :src="http_host+'/website/web/static/images/chakan.png'" class='big_picture_browse_img4'></image>
		              <view>{{item.read_num}}</view>
		            </view>
		            <view class='big_picture_browse4' v-if="datas.content.like_show==true">
						<image :src="http_host+'/website/web/static/images/yizan.png'" class='big_picture_browse_img' v-if="item.user_like==1"></image>
						<image :src="http_host+'/website/web/static/images/zan2.png'" class='big_picture_browse_img' v-else></image>
		              <view>{{item.like_num}}</view>
		            </view>
		          </view>
		          <image :src="http_host+'/website/web/static/images/bofang.png'" class='bofang'></image>
		        </view>
		      </block>
		      <view class='clear'></view>
		      
		      <view class='more' v-if="datas.content.show_more==1&&video_data.length>2">
		        <view class='more_wenben' @click="go_video_list">查看更多</view>
		        <image :src="http_host+'/website/web/static/images/you.png'" class='you_img'></image>
		      </view>
		    </view>
		    
		    <!-- 列表——风格5end -->
		
		
		    <!--列表——风格6start  -->
		    <view class='big_video_list' v-if="video_data.length>0&&datas.content.video_type==1">
		      <view>
		        <block v-for="(item,index) in video_data">
		
		          <view class='big_video' :data-id="item.id" @click='go_video_info'>
		            <image :src='item.original_img' class='big_video_img' mode='aspectFill'></image>
		            <view class='big_video_text1'>{{item.title}}</view>
		            <view class='big_video_arr'>
		              <view :hidden='!datas.content.createtime_show'>{{item.release_time}}</view>
		              <view class='big_video_browse' v-if="datas.content.read_show==true">
		                <image :src="http_host+'/website/web/static/images/chakan.png'" class='big_video_browse_img'></image>
		                <view>{{item.read_num}}</view>
		              </view>
		              <view class='big_video_browse' v-if="datas.content.like_show==true">
						<image :src="http_host+'/website/web/static/images/yizan.png'" class='big_picture_browse_img' v-if="item.user_like==1"></image>
						<image :src="http_host+'/website/web/static/images/zan2.png'" class='big_picture_browse_img' v-else></image>
		                <view>{{item.like_num}}</view>
		              </view>
		            </view>
		            <image :src="http_host+'/website/web/static/images/bofang.png'" class='bofang1'></image>
		          </view>
		
		        </block>
		
		        <view class='clear'></view>
		      </view>
		      <view class='more' v-if="datas.content.show_more==1&&video_data.length>2">
		        <view class='more_wenben' @click="go_video_list">查看更多</view>
		        <image :src="http_host+'/website/web/static/images/you.png'" class='you_img'></image>
		      </view>
		
		    </view>
		
		    <view class='none' v-if="video_data.length<=0">
		      <image :src="http_host+'/website/web/static/images/none.png'" class='none_img'></image>
		      <view class='none_wenben'>暂无任何资讯</view>
		    </view>
		
		
		    <!--列表——风格6end  -->
		
		  </view>
		</view>
		<!-- 视频列表 end-->
	</view>
</template>

<script>
	export default {
		name:"websiteInformation",
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
				navbar: ['热门', '故事', '产品', '服务', '生活', '娱乐'],
				currentTab: 0, //通过下标来控制显示分类
				big_picture_list: [{}],
				right_pictures_list: [{}, {}],
				multi_graph_list: [{}, {}],
				article_list: [{}, {}, {}, {}],
				video_list: [{}, {}, {}, {}],
				big_video_list: [{}],
				pictures_stutas: 1, //图片列表：1->显示；0->隐藏
				video_stutas: 0, //视频列表：1->显示；0->隐藏
				information_data: [], //文章数据
				video_data: [], //视频数据
				menu_list: [], //分类数据
				stuts: 1, //导航栏的点击事件控制的参数
				numxx: 80, //导航栏起始位置的高
				now_navid: -1, //当前选择的分类
				rang_num: 0, //随机位置
			};
		},
		created() {
			var that=this;
			this.http_host = this.vuex_apiUrl;
			if (that.datas.content.show_menu_type == 1) {
				that.get_menu_data(); //分类数据
			}
			that.now_navid = that.datas.content.choose_cate
			setTimeout(function () {
				that.init_data(); //获取数据
			}, 1000);
			
		},
		methods: {
			get_data() {
			    var that = this;
			    var data = {};
			    data.type = 'article';				  
				  
				that.$common.requestData({
				  	url: '/website/web/index.php?m=website_common&a=get_index_data&xdebug=xdebug',
				  	data: {
						type: 'article',
						num: that.datas.content.choose_num,
						category: that.now_navid
					}, 
				  	method: "POST", 
				  	needToken: true,
				}).then(res => {
				  	var rang = Math.round(Math.random() * 10) + 1;
				  	if (res.errcode == 0) {
						that.information_data = res.data,
						that.rang_num = rang
				  	} else {
						that.information_data = []
						that.rang_num = rang
				  	}
				})
			
			},
			//获取分类
			get_menu_data(){
				var that = this;
				var type_num = that.datas.content.show_state_type;
				var type="";
				if (type_num==1){
					type ="article"; //文章
				} else {
					type = "video"; //视频 
				}

				that.$common.requestData({
				  	url: '/website/web/index.php?m=website_common&a=get_all_category',
				  	data: {
						type: type
					}, 
				  	method: "POST", 
				  	needToken: false, 
				}).then(res => {
				  	if (res.errcode == 0) {
						that.menu_list = res.data;
						that.now_navid = res.data[0].id
				  	}
				})
			} ,
			//获取资讯视频数据
			get_video_data() {
				var that = this;
				var data = {};
				data.type = 'article';
				
				that.$common.requestData({
				  	url: '/website/web/index.php?m=website_index&a=get_index_data&xdebug=xdebug',
				  	data: {
						type: 'video',
						num: that.datas.content.choose_num,
						category: that.now_navid,
					}, 
				  	method: "POST", 
				  	needToken: true,
				}).then(res => {
				  	if (res.errcode == 0) {
				  		that.video_data = res.data
				  	} else {
				  		that.video_data = res.data					
				  	}
				})
				
			},
			click () {
				var that = this;
				that.stuts = 0
				that.numxx = "auto"
			},
			click1() {
				var that   = this;
				that.stuts = 1
				that.numxx = "80"
			},
			//分类选择
			navbarTap (e) {
				var that = this;
				that.currentTab = e.currentTarget.dataset.idx
				that.now_navid  = e.currentTarget.dataset.id
				that.click1();
				that.init_data();
			},
			init_data(){
				var that = this;
				if (that.datas.content.show_state_type == 1) {
					that.get_data(); //资讯文章数据
				} else {
					that.get_video_data(); //资讯文章数据
				}
			},
			//跳转文章详情页
			go_info(e) {			
				var url = "/website/web/index.php?m=website_detail&a=art_detail&kid="+e.currentTarget.dataset.id+'&customer_id='+this.vuex_customer_id
				this.$common.diyLinkJump(url,"h5",true);
				// uni.navigateTo({
				// 	url: '/website/pages/article_details/article_details?kid=' + e.currentTarget.dataset.id,
				// })
			},
			//跳转视频详情页
			go_video_info(e) {
				// var url = "/website/web/index.php?m=website_detail&a=video_detail&kid="+e.currentTarget.dataset.id+'&customer_id='+this.vuex_customer_id
				// this.$common.diyLinkJump(url,"h5",true);
				uni.navigateTo({
					url: '/website/pages/video_details/video_details?kid=' + e.currentTarget.dataset.id,
				})
			},
			//查看更多文章
			go_art_list() { 
				console.log('查看更多文章')
				var that=this;
				var category=-1;
				category = that.now_navid;
				var url = "/website/web/index.php?m=website_more&a=art_more&category="+category+'&customer_id='+this.vuex_customer_id
				this.$common.diyLinkJump(url,"h5",true);
				
				// uni.navigateTo({
				// 	url: '/website/pages/article_list/article_list?category=' + category
				// })
			},
			//查看更多视频
			go_video_list(e) {
				var that = this;
				var category = -1;
				category = that.now_navid;
				// var url = "/website/web/index.php?m=website_more&a=video_more&category="+category+'&customer_id='+this.vuex_customer_id
				// this.$common.diyLinkJump(url,"h5",true);
				
				uni.navigateTo({
					url: '/website/pages/video_list/video_list?category=' + category
				})
			}
		}
	}
</script>

<style>
page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.you_img{
  width: 36rpx;
  height: 36rpx;
  display: block;
}
/*<!-- 导航栏-一start -->*/

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
  padding: 0 30rpx;
  box-sizing: border-box;
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
  margin: 0 24rpx;
  /* min-width: 18%; */

}
.item:nth-child(1){
  margin-left: 0;
}
.item:nth-last-child(1){
  margin-right: 0;
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
  height: 6rpx;
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
  padding: 30rpx;
  border-bottom: 1px solid #f7f7f7;
}

.big_picture_img {
  width: 100%;
  height: 406rpx;
  display: block;
  border-radius: 10rpx;
}

.big_picture_text1 {
  font-size: 34rpx;
  width: 100%;
  margin-top: 25rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
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
  font-size: 26rpx;
  color: #b2b2b2;
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
  width: 56%;
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
  margin-bottom: 30rpx;
  word-break: break-all;
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
  word-break: break-all;
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
.go_video_info{
  position: relative;
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
  width: 45%;
  margin-bottom: 20rpx;
  margin-left: 3.2%;
  float: left;
  height: auto;
}

.myVideo {
  width: 100%;
  height: 270rpx;
  display: block;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
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
  margin-bottom: 30rpx;
  word-break: break-all;
}

.video_arr {
  width: 100%;
  height: 40rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 22rpx;
  color: #999;
}
.read_center{
  margin: 0 18rpx;
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
  top: 34%;
  left: 45%;
}

/*<!-- 列表——风格5--end -->*/

/*<!-- 列表——风格6--start -->*/

.none {
  background: #fff;
  height: 100%;
  padding-bottom: 100rpx; 
}
.hei{
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



.big_video_list {
  background: #fff;
  margin-bottom: 10rpx;
}

.big_video {
  padding: 30rpx;
  border-bottom: 1px solid #f7f7f7;
  position: relative;
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
  line-height: 36rpx;
  margin-top: 25rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
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

.full_describe {
  width: 100%;
  height: 150rpx;
}
</style>
