<template>
	<view>
		<!--public/pages/award/totalEarnings/totalEarnings.wxml-->
		<view class='container'>
		  <!-- top -->
		  <view :class="'total-earnings-top skin-bg-'+theme">
		    <view class="total-earnings-top-top">
		      <view class="left">
		        <view class="total-all" :class="bg_bool ? 'skin-color-' +theme + ' bg-color' : ''" @click="get_all">全部</view>
		        <picker class="total-time" :class="!bg_bool ? 'skin-color-' +theme + ' bg-color' : ''" mode="date" start="1970-01-01" end="2100-01-01" fields="month" @change="listenerPickerSelected" >
		          <text v-if="bg_bool" class='jiantou'>选择日期</text>
		          <text v-if="!bg_bool" class='jiantou'>{{year}}年{{month}}月</text>
		        </picker>
		      </view>
		      <view class="right" @click="showFilter">
		        <!-- 12/10 -->
		        <text class='jiantou'>筛选</text>
		      </view>
		    </view>
		    <view class="total-earnings-content">
		      <!-- 12/10 -->
		      <view v-if="status == 1||status==''" class="total-earnings-content-item">
		        <view>
		          <text class="big">{{settled_rewardA}}</text>
		          <text class="small">{{settled_rewardB}}</text>
		          <!-- <i v-if="!settled_rewardA" class="weui-loading" style="width: 30px;height:30px;"></i> -->
				  <u-loading-icon v-if="!settled_rewardA"  mode="semicircle"  color="white"></u-loading-icon>
		        </view>
		        <view class="name">已结算</view>
		      </view>
		       <!-- 12/10 -->
		      <view v-if="status == 0||status==''" class="total-earnings-content-item">
		        <view>
		          <text class="big">{{unsettled_rewardA}}</text>
		          <text class="small">{{unsettled_rewardB}}</text>
<!-- 		          <i v-if="!unsettled_rewardA" class="weui-loading" style="width: 30px;height:30px;"></i> -->
				  <u-loading-icon v-if="!unsettled_rewardA"  mode="semicircle"  color="white"></u-loading-icon>
		        </view>
		        <view class="name">待结算</view>
		      </view>
		      <view class="total-earnings-content-item">
		        <view>
		          <text class="big">{{batchcode_count}}</text>
		          <!-- <i v-if="batchcode_count.length == 0" class="weui-loading" style="width: 30px;height:30px;"></i> -->
				  <u-loading-icon v-if="batchcode_count.length == 0"  mode="semicircle"  color="white"></u-loading-icon>
		        </view>
		        <view class="name">订单数</view>
		      </view>
		    </view>
		  </view>
		  <!-- top -->
		  <!-- nav -->
		  <view class="earnings-nav">
		    <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="toggle(index)">
		      <view class="nav-content" :class="active==index?'activeColor skin-color-'+theme:''">{{item.name}}</view>
		      <view :class="'line skin-bg-'+theme" v-if="active==index"></view>
		    </view>
		  </view>
		  <!-- nav -->
		  <!-- 明细 -->
		  <view v-if="active==0">
		    <scroll-view scroll-y="true" bindscrolltolower="scroll_page" class="total-earnings-detail">
		      <navigator class="total-earnings-detailList" v-for="(item,index) in detailList" :key="index" :url="'earningsDetail?id='+item.id">
		        <image class="img" :src="item.img" />
		        <view class="total-earnings-detailList-right">
		          <view class="total-earnings-detailList-right-item">
		            <view class="total-earnings-detailList-right-item-left">
		              <view class="blank">{{item.own_user_name}}</view>
		              <view class="hui">{{item.create_time}}</view>
		            </view>
		            <!-- 12/10 -->
		            <view class="total-earnings-detailList-right-item-right">
		              <view class="blank" style=" display: flex;align-items: center;">
		                 <!-- 12/11 -->
		                <image class="status_img"
		                  :src="item.is_currency?http_host+'/wsy_pub/web/static/images/settled.png':http_host+'/wsy_pub/web/static/images/pendingsettlement.png'">
		                </image>
		                <view class="blank"> {{item.rewardA}}<text class="small">{{item.rewardB}}</text></view>
		              </view>
		
		              <view class="hui" :class="item.status == '待结算' ?'colorRed':''">
		                {{item.status}}
		              </view>
		            </view>
		            <!-- 12/10end -->
		          </view>
		        </view>
		      </navigator>
		      <view class="weui-loadmore text-center" style="margin: 0px auto;margin-bottom:190rpx;margin-top:20rpx;color:#ccc" v-if="detailList.length>0">
		          <block v-if="load_type==1">
		              <span class="weui-loadmore__tips">上拉加载数据</span>
		          </block>
		          <block v-if="load_type==2">
		              <i class="weui-loading"></i>
		              <span class="weui-loadmore__tips">正在加载</span>
		          </block>
		          <block v-if="load_type==3">
		              <span class="weui-loadmore__tips">已加载全部数据</span>
		          </block>
		      </view>
		      <view v-if="!detailList" style="text-align: center;padding-top: 100px;">
				  <u-loading-icon mode="semicircle" size="60px"></u-loading-icon>
				  <!-- <i class="weui-loading" style="width: 60px;height:60px;"></i> -->
				  </view>
		    </scroll-view>
		  </view>
		  <!-- 明细 -->
		  <!-- 报表 -->
		  <view v-if="active==1">
		    <canvas canvas-id="lineCanvas" class='canvas_content'></canvas>
		  </view>
		  <!-- 报表 -->
		  <!--筛选框start-->
		  <!-- 使用cover-view可以把原生组件遮住，如果使用view,改页面canvas回浮在该弹窗之上 -->
		  <!-- <cover-view wx-if="{{filtershow==true}}" class="filter-wrap">
		    <cover-view class="filter-bg" @click="hideFilter"></cover-view>
		    <cover-view class="filert-content">
		      <cover-view class="filter-top">
		        <cover-view @click="hideFilter">取消</cover-view>
		        <cover-view class='filter-top-content'>请选择类型</cover-view>
		        <cover-view class="skin-color-{{theme}}" @click="sureFilter">确定</cover-view>
		      </cover-view>
		      <cover-view class="filter-list">
		        <cover-view class='filter-list-ul'>
		          <cover-view v-for="{{filterList}}" v-for-item="item" v-for-index="index" :key="index" @click="choseLi" data-index='{{index}}' class="filter-list-li {{item.isCheck?'filter-active skin-color-'+theme+' skin-bd-'+theme:''}}" >{{item.name}}</cover-view>
		        </cover-view>
		      </cover-view>
		    </cover-view>
		  </cover-view> -->
		  <!--筛选框end-->
		  <!-- 12/10 新筛选框-->
		  <view v-if="filtershow" class="filter-wrap">
		    <view class="filter-bg" @click='hideFilter'></view>
		    <view class="filter-content">
		      <view class="dl-tap">
		        <view class="dt-tap">类型</view>
		        <text v-for="(item,index) in filterListA" :key='index' @click="choseFilter(index)"
		          class="dd-tap" :class="item.isCheck ? 'choseF skin-color-'+theme+' skin-bd-'+theme : ''">
		          <block>{{item.name}}</block>
		        </text>
		      </view>
		      <view class="dl-tap">
		        <view class="dt-tap">身份
		        </view>
		        <text v-if="item.name&&item.name!=''" v-for="(item,index) in filterList" 
		          :key='index' @click="choseLi(index)"
		          class="dd-tap" :class="item.isCheck ? 'choseF skin-color-'+theme+' skin-bd-'+theme : ''">{{item.name}}</text>
		      </view>
		      <view class='filter-bottom-wrap'>
		        <view class="filter-bottom">
		          <button :class="'cancel skin-bg-'+theme" @click="cancelFilter">重置</button>
		          <button :class="'sure skin-bg-'+theme" @click="sureFilter">确认</button>
		        </view>
		      </view>
		
		    </view>
		  </view>
		  <!-- 12/10end -->
		</view>
	</view>
</template>

<script>
	import totalEarnings from './totalEarnings.js'
	export default {
	  ...totalEarnings,
	}
</script>

<style>
/* public/pages/award/totalEarnings/totalEarnings.wxss */
page{background-color: #f5f5f5} 
.container{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
}
/*累计收益start*/
/*top*/
.total-earnings-top{
    height: 306rpx;
    width: 100%;
    padding: 0 30rpx;
    background-color:#7f8aef
}
.total-earnings-top-top{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding-top: 28rpx;
    color: #fff;
    font-size: 28rpx;
    line-height: 28rpx;
}
.total-earnings-top-top .left{
    width: 50%;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}
.jiantou:after {
    content: " ";
    display: inline-block;
    /* 12/10 */
    height: 12rpx;
    width: 12rpx;
    /* 12/10end */
    border-width: 4rpx 4rpx 0 0;
    border-color: #FFF;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(135deg);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    /* 12/10 */
    margin-left: 6rpx;
    margin-bottom: 5rpx;
}
.total-earnings-top-top-img{
    width: 30rpx;
    height: 30px;
}
.total-earnings-content{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 90rpx 0 80rpx 0;
    color: #fff;
    align-items: center;
    text-align: center;
}
.total-earnings-content-item{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    width: 50%;
}
.total-earnings-content-item .big{
    font-size: 46rpx;
    line-height: 46rpx;
}
.total-earnings-content-item .small{
    font-size: 32rpx;
}
.total-earnings-content-item .name{
    font-size: 24rpx;
    line-height: 24rpx;
    margin-top: 6rpx;
}
/*top*/
/*nav*/
.earnings-nav{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 0 60rpx;
    background-color: #FFF;
    text-align: center;
    border-bottom: 2rpx solid #e5e5e5;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    margin-top: 20rpx;
}
.earnings-nav::-webkit-scrollbar{width: 0;height: 0;background-color: #fff;}
.nav-item{
    -webkit-flex: 1 0 auto;
    -webkit-box-flex: 1 0 auto;
    flex: 1 0 auto;
    font-size: 28rpx;
    color: #5d5d5d;
}
.nav-item .nav-content{
    padding: 30rpx 0 24rpx 0;
}
.line{
    width: 30rpx;
    height: 6rpx;
    border-radius: 10rpx;
    background-color: #7f8aef;
    margin: 0 auto;
}
.nav-item .nav-content.activeColor{
    color: #7f8aef;
}
/*nav*/
/*detail*/
.total-earnings-detail{
    padding: 0 30rpx;
    background-color: #fff;
    width: 100%;
    height: calc(100vh - 432rpx);
    box-sizing: border-box;
}
.total-earnings-detailList{
    height: 130rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
}
.total-earnings-detailList .img{
    width: 66rpx;
    height: 66rpx;
    border-radius: 50%;
    margin-right: 20rpx;
}
.total-earnings-detailList-right{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    width: 50%;
}
.total-earnings-detailList-right-item{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
}
.total-earnings-detailList-right-item-left{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    width: 50%;
}
.total-earnings-detailList-right-item-right{
    text-align: right;
}
.blank{
    font-size: 28rpx;
    color: #333333;
}
.blank .small{
    font-size: 24rpx;
}
.hui{
    font-size: 24rpx;
    color: #999999;
}
.colorRed{
    color: red;
}
/*detail*/
/*筛选框*/
/* .filter-wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 999;
}
.filter-bg {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    position: absolute;
}
.filert-content {
    background: #fff;
    position: absolute;
    width: 100%;
    z-index: 2;
    bottom: 0;
}
.filter-top {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30rpx;
    display: flex;
    justify-content: space-between;
    height: 90rpx;
    align-items: center;
    font-size: 32rpx;
    border-bottom: 2rpx solid #e5e5e5;
} */
/* .filter-top .filter-top-content{color: #333;}
.filter-top cover-view:first-child{color: #999999;background: transparent;font-size: 32rpx;}
.filter-top cover-view:last-child{color: #7f8aef;background: transparent;font-size: 32rpx}
.filter-list {padding: 60rpx 30rpx 200rpx 30rpx;} */
/* 用于cover-view的换行 flex-wrap: warp; white-space: pre-wrap;*/
/* .filter-list-ul{flex-wrap: warp; white-space: pre-wrap;}
.filter-list .filter-list-li{font-size: 28rpx;color: #333;background: #f5f5f5;display: inline-block;text-align:center;min-width: 110rpx;border-radius:8rpx;margin-bottom: 20rpx;margin-right: 20rpx;height: 50rpx;line-height: 50rpx;padding: 0 20rpx;padding-top: 5rpx}
.filter-list .filter-list-li.filter-active{border: 2rpx solid #7F8AEF;color: #7F8AEF;} */
/*筛选框*/
.canvas_content{width: 100%;height: 600rpx;margin-top: 30rpx;margin-left: 20rpx;margin-bottom: 10rpx}

.total-all{
    display: inline-block;
    padding: 2px 7px;
    border-radius: 10px;
    margin-right: 10px;
    border: 1px solid #fff;
}
.total-time{
    display: inline-block;
    padding: 2px 7px;
    border-radius: 10px;
    border: 1px solid #fff;
}
.bg-color{
    background-color: #fff;
}

/* 12/10 */
.status_img {
    width: 28rpx;
    height: 28rpx;
    margin-right: 6rpx;
}

.jiantou {
    display: flex;
    align-items: center;
    margin-top: -3rpx;
}

.right {
    border: 1px solid #fff;
    border-radius: 34rpx;
    padding: 0 10rpx;
    font-size: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 新筛选框 */
.filter-wrap {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
}

.filter-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}

.filter-content {
    position: relative;
    z-index: 2;
    background: #fff;
    width: 250px;
    float: right;
    height: 100%;
    box-sizing: border-box;
    padding: 30px 12px;
    overflow-y: scroll;

}

.filter-content .dl-tap {
    margin-bottom: 25px;
}

.filter-content .dt-tap {
    color: #5d5d5d;
    font-size: 26rpx;
    padding-bottom: 20rpx;
}

.filter-content .dd-tap {
    font-size: 26rpx;
    color: #333;
    padding: 8rpx 20rpx;
    background: #f5f5f5;
    display: inline-block;
    border-radius: 10rpx;
    /* 12/9 */
    margin-right: 19rpx;
    margin-bottom: 22rpx;
    max-width: 182rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* 12/9end */
    text-align: center;
    /* 12/9 */
    min-width: 175rpx;
    box-sizing: border-box;
}


.filter-price dd {
    min-width: 52px;
}

.filter-bottom-wrap {
    position: fixed;
    padding: 10px 0;
    width: 250px;
    display: flex;
    right: 0px;
    bottom: 0;
    background: #fff;
    align-items: center;
}

.filter-bottom {
    width: 200px;
    margin-left: 25px;
    height: 35px;
}

.filter-bottom button {
    width: 100px;
    display: inline-block;
    text-align: center;
    height: 35px;
    line-height: 35px;
    color: #fff;
    border: 0;
    font-size: 13px
}

.filter-content .dd-tap.choseF {
    border: 1px solid #7f8aef;
    color: #7f8aef;
    padding: 3px 7px;
    background: #f7f7ff
}

.filter-bottom button.cancel {
    background: #7f8aef;
    opacity: 0.6;
    border-radius: 20px 0 0 20px;
}

.filter-bottom button.sure {
    background: #7f8aef;
    border-radius: 0px 20px 20px 0px;
}

.filter-bottom button::after {
    border: 0
}
</style>
