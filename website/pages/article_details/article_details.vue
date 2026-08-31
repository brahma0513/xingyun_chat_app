<template>
	<view>
	<view class='container'>
	  <view class='article_title'>
	    {{info_data.soft_title}}
	  </view>
	  <view class='article_arr'>
	    <view>阅读量 {{info_data.read_num}}</view>
	    <view class='fenge'>|</view>
	    <view> {{info_data.release_time}}</view>
	    <view class='fenge'>|</view>
	    <view>作者 {{info_data.author_name}}</view>
	  </view>
	  <view class='article_content'>
	    <!-- <template is="wxParse" data="{{wxParseData:article.nodes}}" /> -->
	    <rich-text :nodes="contents"></rich-text>
	    <!-- 轮播图start -->
	    <view v-if="info_data.ad.length>0">
	      <swiper class='u-wrp-bnr' indicator-dots :indicator-color='color1' :indicator-active-color="color" :autoplay='true' interval='5000' duration='1000' :circular='true'>
	        <block v-for="item in bnrUrl"  :key="index.unique">
	          <swiper-item  @click="go_link(item.ads_link)">
	            <image :src='item.ads_pic' class='u-img-slide' mode='aspectFill'></image>
	          </swiper-item>
	        </block>
	      </swiper>
	    </view>
	    <!-- 轮播图end -->
	  </view>
	  <view class='fudong'>
	    <view class='zan' v-if="info_data.like_switch==1" @click='give_article_like'>
	      <image class='fengxiang' :src="http_host+'/website/web/static/images/yizan1.png'" v-if="info_data.user_like==1"></image>
	      <image class='fengxiang' :src="http_host+'/website/web/static/images/zan.png'" v-else></image>
	      <view class='zan_num'> {{info_data.like_num}}
	        <text v-if="info_data.like_num>=999">+</text>
	      </view>
	    </view>
	
	    <view class='zan pos_real' catchtap='go_index'>
		  <image :src="http_host+'/website/web/static/images/index_icon.png'" class='fengxiang'></image>
	      <view class='index_tit pos_abous'>首页</view>
	    </view>
	    <image class='fengxiang' :src="http_host+'/website/web/static/images/ding.png'" @click='goTop'></image>
	
	  </view>
	
	</view>
	<view class='Headlines'></view>
	<view class="with-sort">
	  <block  v-for="item in with_sort_list">
	  <navigator :url="'/website/pages/article_details/article_details?kid='+item.id">
	    <view class="sort-center">
	      <view class="sort-center-left">
	        <view class="title">{{item.soft_title}}</view>
	        <view class="text">{{item.author_name}}<text>阅读{{item.read_num}}</text></view>
	      </view>
	      <view class="sort-center-right">
	        <image :src="item.original_img"></image>
	      </view>
	    </view>
	  </navigator>
	  </block>
	</view>
	
	<view class='Headlines' v-if="info_data.comment_switch==1"></view>
	<view class='comment_big_box' :style="'margin-bottom:'+ bottom_open ? '51px' : '0'" v-if="info_data.comment_switch==1">
	  <view class='head'>评论 {{info_data.comment_num}}</view>
	  <!--暂无评论start-->
	  <view class='nothing_comment' v-if="show_nothing">暂无评论，快来留言吧~</view>
	  <!--暂无评论end-->
	  <block v-for="(item,index) in comment_list">
	    <view class='comment_list'>
	      <view class='comment'>
	        <view class='comment_head'>
	          <view class='comment_head_left'>
	            <view>
	              <image class='touxiang' :src="item.user_img"></image>
	            </view>
	            <view class='information'>
	              <view class='name'>{{item.user_name}}</view>
	              <view class='time'>{{item.createtime}}</view>
	            </view>
	          </view>
	          <view class='comment_head_right' @click='give_comment_like(item.id,index)'>
	            <image :src="http_host+'/website/web/static/images/yizan.png'" class='zan1' v-if="item.user_like==1"></image>
	            <image :src="http_host+'/website/web/static/images/zan2.png'" class='zan1' v-else></image>
	            <view class='zan1_num'>{{item.likes}}</view>
	          </view>
	        </view>
	        <view class='comment_this' @click='replay_comment(item.id,item.user_name,item.user_id,1)'>{{item.content}}</view>
	        <!--回复评论数据start-->
	        <view class='comment_other' v-if="item.reply_data.dataCount>0">
	          <block v-for="reply in item.reply_data.data">
	            <view class='comment_other_user' @click='replay_comment(item.id,reply.user_name,reply.user_id,2)'>
	              <text class='user_name' v-if="reply.to_user_id>0">{{reply.user_name}}<text class='user_comment1'> 回复 </text>{{reply.to_user_name}}：</text>
	              <text class='user_name' v-else>{{reply.user_name}}：</text>
	              <text class='user_comment'>{{reply.content}}</text>
	            </view>
	          </block>
	          <view class='user_comment1 ziti_13' v-if="item.reply_data.dataCount>2&&item.show_com==1"  @click="get_replay_comment_list(item.id,index,item.reply_data.dataCount,item.reply_data.pageCount)">查看剩余{{item.reply_data.dataCount}}条评论</view>
	          <view class='user_comment1 ziti_13' v-else-if="item.reply_data.dataCount>2&&item.show_com==0" @click="close_comment(item.id,index)">收起</view>
	        </view>
	        <!--回复评论数据end-->
	      </view>
	    </view>
	  </block>
	  <view class='kongbai'></view>
	  <view class='dibu' :style="'bottom:'+ bottom_open ? '51px' : '0'">
	    <image class='bianji' :src="http_host+'/website/web/static/images/bianji.png'"></image>
	    <input class='input' :placeholder='placeholder' maxlength="300" cursor-spacing="10" name="content" @blur="onReplyBlur" focus="focus" v-model="comment_text"></input>
	    <view class='fasong' @click='send_comment'>发送</view>
	  </view>
	</view>
	<xdShare ref="xdshareRef" :shareInfo="shareInfo"></xdShare>
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
    art_id: -1,
    info_data: {ad:[]},
	shareInfo:{},
    comment_list: [],
    http_host: "",
    bottom_open: false, // 是否有底部
    show_page_nav: true, // 是否显示自己的侧边栏
    focus: false, //是否唤起文本框
    placeholder: "说点什么吧",
    comment_text: '', //评论内容
    now_replay_id: -1, //回复需要用到的id
    reply_type: 1, //1为普通回复，2为回复用户
    reply_userid: "", //被回复的用户id
    reply_username: "", //被回复用户姓名
    color: "#fff",
    color1: "f,f,f,0.1",
    bnrUrl: [],
    contents: "", //文章详情
    show_nothing: true, //是否显示暂无评论
    com_page: 1, //评论页数
    page: 1, //评论页数
    add_type: 1,
    status:false, //是否可点击。（发送按钮不能重复点）
    template_data: { has_bottom: true },
    with_sort_list: [], // 同类型文章数据列表
	user_input:'',//用户输入文本
		}
	},
	onLoad(e){
		this.http_host = this.vuex_apiUrl;
	 var that = this;
	   that.art_id= e.kid
	    that.get_info(); //获取文章详情信息
	    that.get_comment_list(); //增加评论数据
	    that.add_read(); //增加阅读量
	    that.get_most_reading_article(); //获取同类型七天内最高点击量的文章
	},
	methods:{
	 //公共悬浮导航回调函数
	  suspend_callback: function(res) {
	    const _this = this;
	    console.log(res);
	    //有公共悬浮导航,那页面本身的悬浮导航就不用显示了
	    if (res.detail.name) {
	            _this.show_page_nav= false;
	    }
	  },
	  
	   //广告图跳转链接
	    go_link: function (link) {
	      console.log("当前链接==", link);
	      uni.navigateTo({
	        url: link
	      })
	    },
	    //获取文章详情
	    get_info: function() {
	      var that = this;
	      var data = {};
	      data.art_id = that.art_id;
		  this.$api.getWebsArtMes(data).then(res=>{
		  				 that.info_data= res.data;
		  				  that.contents= res.data.art_content.replace(/\<img/gi, '<img class="rich-img"');
		  				  that.bnrUrl= res.data.ad;
		  				if (res.data.comment_num > 0) {
							that.show_nothing=false;
		  				} else {
		  				    that.show_nothing=true;
		  				}
		  				uni.setNavigationBarTitle({
		  				  title: res.data.soft_title
		  				})
						
						//分享对象信息
						that.shareInfo = {
							title: that.info_data.soft_title, //分享标题
							app_name: 'website', //跳转应用名称
							path: '/website/pages/article_details/article_details', //页面 path ，必须是以 / 开头的完整路径。例：/pages/index/index
							query: {
								kid: that.art_id
							}, //自定义参数
							imageUrl: '', //分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4，传空值会有默认logo
							content: '', //百度小程序表现为：分享内容；支付宝小程序表现为：吱口令文案
							desc: '' //自定义分享描述
						};
		  				//转换html标签
		  				// WxParse.wxParse('article', 'html', res.data.art_content, that, 5);
		  			});
	    },
	    //增加阅读量
	  add_read: function() {
	   var that = this;
	   var data = {};
	   data.art_id = that.video_id;
	   data.type = 1;		
	   this.$api.getWebsRead(data).then(res=>{
	   		});
	    },
	    //获取评论列表
	    get_comment_list: function() {
	      var that = this;
	      var data = {};
	      data.art_id = that.art_id;
		  data.page =that.page;
		  this.$api.getWebsComment(data).then(res=>{
			  if (res.errcode == 0) {
			    console.log("评论===", res.data.data);
			    var comment_list = [];
			    // add_type=1为重新加载数据，2为分类追加数据
			    if (that.add_type == 1) {
			      var comment_list = [];
			    } else {
			      var comment_list = that.comment_list;
			    }
			    for (var i = 0; i < res.data.data.length; i++) {
			      res.data.data[i].show_com = 1; //1为显示查看
			      comment_list.push(res.data.data[i]);
			    }
			      that.comment_list= comment_list;
			      that.com_page= res.data.pageCount;
			  }
		  		});
	    },
	    //获取剩余回复的评论数据
	    get_replay_comment_list: function(cid,index,count,pagecount) {
	      var that = this;
	      var data = {};
	      data.art_id = that.art_id;
		  data.comment_id = cid;
		   data.reply_num = count;
		   this.$api.getWebsCommentReply(data).then(res=>{
			   console.log("回复", res);
			   var comment_list = that.comment_list;
			   comment_list[index].reply_data.data = res.data;
			   comment_list[index].show_com = 0; //0为显示收起
	
			     that.comment_list= comment_list;

		   		});
	    },
	    //收起评论
	    close_comment: function(id,index) {
	      var that = this;
	      var comment_list = that.comment_list;
	      comment_list[index].show_com = 1; //0为显示收起
	        that.comment_list= comment_list;
	      that.get_comment_list();
	    },
	    //评论点赞
	    give_comment_like: function(com_id,index) {
	      var that = this;
	      var data = {};
		  data.comment_id=com_id;
		  
		  this.$api.getWebsCommentLike(data).then(res=>{
			  console.log("获取数据==", res);
			  let comment_list=that.comment_list[index];
			  if (res.errcode == 1) {
			    comment_list.user_like = 1;
			   comment_list.likes = parseInt(comment_list.likes) + 1;
			  } else {
			    comment_list.user_like = "";
			    comment_list.likes = parseInt(comment_list.likes) - 1;
			  }
			    that.comment_list.splice(index,1,comment_list);
		  		});
	    },
	    //文章点赞
	    give_article_like: function() {
	      var that = this;
	      var data = {};
	      data.art_id = that.art_id;
		 data.type = 1;	
		  this.$api.getWebsLike(data).then(res=>{
			  let info_data=that.info_data;
		if (res.errcode == 1) {
		  info_data.user_like = 1;
		  info_data.like_num = parseInt(info_data.like_num) + 1;
		} else	if(res.errcode ==400){//未开启点赞
			  console.log(res);
		  } else{
		  info_data.user_like = "";
		  info_data.like_num = parseInt(info_data.like_num) - 1;
		}
		  that.info_data= info_data;
		  		});
			
	    },
	    //发表评论
	    send_comment: function() {
	      var that = this;
	  	 if (that.status){
	        return;
	      }
	        that.status=true;
	      if (that.comment_text==""){
	        uni.showToast({
	          title: '请输入评论内容',
	          icon: 'none',
	          duration: 2000
	        });
	        that.status=false;
	        return;
	      }
	      var data = {  
			  art_id: that.art_id,
	          type: 1,
	          comment_id: that.now_replay_id,
	          content: that.comment_text,
	          to_user_name: that.reply_username,
	          to_user_id: that.reply_userid};
	      var url = "";
		  let success=(res)=>{
			  if (res.errcode == 0) {
		   that.comment_text= "";
		   that.show_nothing= false;
		   that.focus= true;
		   that.reply_type= 1;
		   that.reply_userid= -1;
		   that.reply_username= "";
		   that.now_replay_id= -1;
		   that.focus= false;
		   that.placeholder= "说点什么吧";
		   that.page= 1;
		   that.add_type= 1;
			    uni.showToast({
			      title: '评论成功',
			      icon: 'success',
			      duration: 2000
			    });
			    that.get_comment_list(); //获取评论
			  }else{
			    uni.showToast({
			      title: res.errmsg,
			      icon: 'none',
			      duration: 2000
			    });
			  }
			    that.status=false;
		  }
	      if (!that.focus) {
			  this.$api.getWebsSaveArtComment(data).then(res=>{
				success(res);
			  		});
	      } else {
			  this.$api.getWebsSaveCommentReply(data).then(res=>{
				  	success(res);
			  		});
	      }
		
	    },
	    //保存评论的信息
	    getCommentText: function(e) {
	      var that = this;
	      var val = e.detail.value;
	        that.comment_text= val;
	    },
	    //文本框失去焦点
	    onReplyBlur: function(e) {
	      var that = this;
	      if (that.comment_text === '') {
	          that.placeholder= "说点什么吧";
	          that.focus= false;
	      }
	    },
	    //回复评论
	    replay_comment: function(replay_id,name,userid,replay_type) {
	      var that = this;
	      var reply_userid = "";
	      var name = "";
	      //type=1 普通回复，type=2为回复用户
	  
	      console.log("回复人replay_type==", replay_type);
	      if (replay_type == 2) {

	      } else {
	        reply_userid = "";
	        name = "";
	      }
	        that.reply_type= replay_type;
	        that.reply_userid= reply_userid;
	        that.reply_username= name;
	        that.now_replay_id= replay_id;
	        that.focus= true;
	        that.placeholder= "回复" + name
	    },
		  //获取同类型七天内最高点击量的文章
		  get_most_reading_article: function() {
		    var that = this;
		    var data = {};
		    data.art_id = that.art_id;
			this.$api.getWebsMostReadArt(data).then(res=>{
					console.log(res)
					if(res.errcode == 0){
					    that.with_sort_list= res.data;
					}else{
					  console.log("获取数据失败！")
					}
						});
		  },
	    // 回到顶部 
	    goTop: function(e) {
	      if (uni.pageScrollTo) {
	        uni.pageScrollTo({
	          scrollTop: 0
	        })
	      } else {
	        uni.showModal({
	          title: '提示',
	          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
	        })
	      }
	    },
	    go_index:function(){
	      uni.redirectTo({
	        url: '../../../pages/index/index',
	      })
	    },
	}
		}
</script>

<style>
	/* pages/article_details/index.wxss */

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
.rich-img {
  width: 100%!important;
  height: auto;
}

.container {
  padding: 30rpx;
}

.article_title {
  font-size: 38rpx;
  font-weight: bold;
  margin-bottom: 50rpx;
}

.article_arr {
  width: 690rpx;
  height: 50rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 26rpx;
  color: #8e8e8e;
  margin-bottom: 50rpx;
}

.fenge {
  margin: 0 20rpx;
}

.article_content {
  margin-bottom: 30rpx;
}

.fudong {
  width: 100rpx;
  height: 340rpx;
  position: fixed;
  z-index: 2;
  top: 450rpx;
  right: 0;
}

.zan {
  width: 100rpx;
  height: 120rpx;
}

.fengxiang {
  width: 100rpx;
  height: 100rpx;
  display: block;
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

.share_bnt {
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

/************以下评论************/

.Headlines {
  width: 780rpx;
  height: 20rpx;
  background: #f3f3f3;
}

.head {
  height: 90rpx;
  line-height: 90rpx;
  padding-left: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  color: #999;
  font-size: 30rpx;
}

.nothing_comment {
  text-align: center;
  margin: 20% 0;
  color: #979696;
  font-size: 30rpx;
}

.comment_head {
  width: 690rpx;
  height: 80rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.comment_list {
  padding: 30rpx;
}

.comment_head_left {
  width: 400rpx;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.information {
  height: 80rpx;
  margin-left: 20rpx;
}

.touxiang {
  height: 80rpx;
  width: 80rpx;
  display: block;
  border-radius: 100%;
}

.name {
  font-size: 30rpx;
  margin-bottom: 10rpx;
}

.time {
  height: 30rpx;
  line-height: 30rpx;
  color: #979696;
  font-size: 28rpx;
}

.zan1_num {
  font-size: 26rpx;
  color: #979696;
  margin-left: 8rpx;
}

.zan1 {
  height: 42rpx;
  width: 42rpx;
  display: block;
}

.comment_head_right {
  width: 120rpx;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.comment_this {
  width: 530rpx;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  margin-left: 100rpx;
  word-wrap: break-word;
}

.comment_other {
  width: 530rpx;
  margin-left: 100rpx;
  background: #f5f5f5;
  padding: 16rpx;
  font-size: 28rpx;
  line-height: 40rpx;
}

.user_comment {
  color: #535353;
  word-wrap: break-word;
}

.user_comment1 {
  color: #9b9b9b;
}

.ziti_13 {
  font-size: 26rpx;
  margin-top: 10rpx;
}

.dibu {
  width: 100%;
  height: 100rpx;
  position: fixed;
  bottom: 0;
  box-shadow: 0 -2px 1px -1px rgba(80, 80, 82, 0.212);
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fasong {
  width: 150rpx;
  font-size: 30rpx;
  height: 50rpx;
  text-align: center;
  color: #7f8aef;
  background-color: transparent;
  border: none;
  line-height: 50rpx;
}

.input {
  width: 500rpx;
  height: 80rpx;
  display: block;
  font-size: 30rpx;
  padding-right:8rpx;
}

.bianji {
  width: 60rpx;
  height: 60rpx;
  display: block;
}

.kongbai {
  width: 100%;
  height: 100rpx;
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


/* 同类文章数据列表样式start */
.with-sort{
  background-color: #fff;
}
.with-sort .sort-center{
  height: 90px;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
}
.with-sort .sort-center .sort-center-left{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 15px;
}
.with-sort .sort-center .sort-center-left .title{
  font-size: 16px;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}
.with-sort .sort-center .sort-center-left .text{
  font-size: 11px;
  color: #999;
  line-height: 1;
}
.with-sort .sort-center .sort-center-left .text text{
  margin-left: 12px;
  line-height: 1;
}
.with-sort .sort-center .sort-center-right>image{
  width: 100px;
  height: 60px;
  border-radius: 4px;
}
/* 同类文章数据列表样式end */
</style>