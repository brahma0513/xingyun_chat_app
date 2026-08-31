<!-- 拼团活动 -->
<template>
	<view class="groupactivity" style="background:#fff;padding:20rpx;">
		<!-- 头部 -->
		<view class="groupactivity_top" @click="$common.diyLinkJump('/collage/web/index.php?m=product&a=product_list&activity_id='+datas.content.activity_id+'&list_type='+datas.content.line_type)">
			<view class="top_left">
				<view class="groupactivity_title">{{datas.content.title}}</view>
				<!-- datas.content.show_type==0&& -->
				<view v-if="datas.content.show_type==0&&count_time">
					<view style="color:#999999;font-size:28rpx;" v-if="count_time.type==2">距离本场结束<text :class="'skin-color-' + theme" style="margin-left:10rpx;">{{day}}天{{hour}}时{{min}}分{{second}}秒</text></view>
					<view style="color:#999999;font-size:28rpx;" v-if="count_time.type==1">距离本场开始<text :class="'skin-color-'+theme" style="margin-left:10rpx;">{{day}}天{{hour}}时{{min}}分{{second}}秒</text></view>
				</view>
			</view>
			<view class="top_right">
				<image :src="http_host+'/HTML/admui/public/custom/images/custon_right.png'"></image>
			</view>
		</view>
		<!-- 头部end -->
		<!-- 多个商品 -->
		<view class="goods_s" v-if="arr.length>0">
			<swiper style="width:100%;height:100%;" autoplay="true" interval="5000">
				<block  v-for="(items,index) in arr">
					<swiper-item>
						<block v-for="(item,index2) in items">
							<view class="goods_s_content" :data-activitiesid="item.activities_id" :data-proid="item.product_id" @click="$common.diyLinkJump('/collage/web/index.php?m=product&a=product_details&product_id=' + item.product_id + '&activities_id=' + item.activities_id)">
								<view class="goods_s_img">
									<image :src="item.imgurl"></image>
									<view :class="'d_count skin-bg-'+theme">{{item.group_size}}人团</view>
								</view>
								<view class="goods_price_count">
									<view style="color:#f24e4c;"><text style="font-size:24rpx;">￥</text><text style="font-size:32rpx;">{{item.first_priceA}}</text><text style="font-size:24rpx;">{{item.first_priceB}}</text></view>
									<view style="color:#999;font-size:22rpx;">已拼:{{item.sell_count}}</view>
								</view>
							</view>
						</block>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<!-- 多个商品end -->
	</view>
</template>
<script>
	export default {
		name: "groupactivity",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				http_host: '',
				theme: getApp().globalData.style_color,
				arr: [],
				count_time: {},
				
				day: 0,
				hour: 0,
				min: 0,
				second: 0,
			};
		},
		created() {
			this.http_host = this.vuex_apiUrl;
			this.getGroupActivity()
		},
		methods: {
			getResult: function () {
			  var that = this;
			  var result = [];
			
			  // 将数组拆分成3个一组
			  var array = that.datas.content.dataset
			  if (array.length > 0) {
			    for (var i = 0; i < array.length; i += 3) {
			      result.push(array.slice(i, i + 3));
			    }
			  }
			  that.arr = result
			  
			},
			// 点击商品跳转到商品详情页
			goodsClick: function (e) {
			  var pro_id = e.currentTarget.dataset.proid
			  var activity_id = e.currentTarget.dataset.activitiesid
			  
			},
			// 跳转到商品列表
			toGoods: function () {
			  // 11/23
			  // wx.navigateTo({
			  //   url: '/collage/pages/product/productList/productList?activity_id='+this.datas.content.activity_id+'&list_type=' + this.datas.content.line_type
			  // })
			},
			// 获取拼团活动数据
			getGroupActivity: function () {
			  var that = this
			  var data_content = that.datas
			  var request_data = {},
			    url = '',
			    show_type = data_content.content.show_type,
			    goods_type = data_content.content.goods_type
			  if (show_type == 0) {
			    url = '/uniapp_template/web/index.php?m=collage&a=get_activity_product'
			    request_data = {
			      acid: data_content.content.activity_id
			    }
			  } else if (show_type == 1 && goods_type == 0) {
			    url = '/uniapp_template/web/index.php?m=collage&a=get_putaway_product'
			  } else if (show_type == 1 && goods_type == 1) {
			    var ids = "";
			    data_content.content.product_list.forEach(function (it, it_index) {
			      ids += it;
			      if (it_index < data_content.content.product_list.length - 1) {
			        ids += ","
			      }
			    })
			    url = '/uniapp_template/web/index.php?m=collage&a=get_product_info'
			    request_data = {
			      p_ids: ids
			    }
			  }
			  
			  that.$common.requestData({
			  	url: url,
			  	data: request_data, 
			  	method: "POST", 
			  	needToken: true
			  }).then(res => {
			  	if (res.errcode == 0) {
			  	  data_content.content.dataset = [];
			  	  var arr = [];
			  	  if (show_type == 0) {
			  				
			  	    if (res.data.pro) {
			  	      res.data.pro.forEach(function (items, index) {
			  	        var obj = new Object();
			  	        var obj = {
			  	          group_size: items.g_size,
			  	          sell_count: items.sale,
			  	          imgurl: items.img,
			  	          first_priceA: that.$common.toPrice(items.price, true),
			  	          first_priceB: that.$common.toPrice(items.price, false),
			  	          activities_id: data_content.content.activity_id,
			  	          product_id: items.pid
			  	        }
			  	        arr.push(obj)
			  	      })
			  	    }
			  	    // 倒计时
			  	    that.count_trim(res.data.activity.start_time, res.data.activity.end_time)
			  	  } else if (show_type == 1 && goods_type == 0) {
			  	    if (res.data.list) {
			  	      res.data.list.forEach(function (items, index) {
			  	        if (index >= 12) {
			  	          return false;
			  	        }
			  	        var obj = new Object();
			  	        var obj = {
			  	          group_size: items.g_size,
			  	          sell_count: items.sale,
			  	          imgurl: items.img,
			  	          first_priceA: that.$common.toPrice(items.price, true),
			  	          first_priceB: that.$common.toPrice(items.price, false),
			  	          activities_id: items.aid,
			  	          product_id: items.pid
			  	        }
			  	        arr.push(obj)
			  	      })
			  	    }
			  	  } else if (show_type == 1 && goods_type == 1) {
			  	    if (res.data) {
			  	      res.data.forEach(function (items, index) {
			  	        if (items.is_expired == 0) {
			  	          var obj = new Object();
			  	          var obj = {
			  	            group_size: items.g_size,
			  	            sell_count: items.sale,
			  	            imgurl: items.img,
			  	            first_priceA: that.$common.toPrice(items.price, true),
			  	            first_priceB: that.$common.toPrice(items.price, false),
			  	            activities_id: items.acid,
			  	            product_id: items.pid
			  	          }
			  	          arr.push(obj)
			  	        }
			  	      })
			  	    }
			  	  }
			  	  data_content.content.dataset = arr;
			  	  that.datas = data_content
			  	  that.getResult()
			  	} else {
			  	}
				
			  });
			},
			// 倒计时 ，需要时去掉注释
			count_trim: function (start_time, end_time) {
			
			  var that = this
			  // 开始时间
			  var statr = new Date(start_time.replace(/-/g,"/")).getTime()
			  // 结束时间
			  var end = new Date(end_time.replace(/-/g,"/")).getTime()
			  // 当前时间
			  var now = new Date().getTime()
			  var count_time = that.count_time;
			  let letTrim = ''
			  if (statr > now) {
			    end = statr
			    count_time.type = 1
			  } else {
			    count_time.type = 2
			  }
			  letTrim = end - now
			  if (letTrim >= 0) {
			    count_time.day = Math.floor(letTrim / 1000 / 60 / 60 / 24);
			    count_time.hour = Math.floor(letTrim / 1000 / 60 / 60 % 24);
			    count_time.min = Math.floor(letTrim / 1000 / 60 % 60);
			    count_time.second = Math.floor(letTrim / 1000 % 60);
				
				that.day = count_time.day;
				that.hour = count_time.hour;
				that.min = count_time.min;
				that.second = count_time.second;
			  }
			  that.count_time = count_time
	
			  setTimeout(function () {
			    that.count_trim(start_time, end_time)
			  }, 1000)
			},
		}
	}
</script>

<style>
.top_left {
  display: flex;
  align-items: center;
  width: 100%;
}

.groupactivity_title {
  margin-right: 15rpx;
  color: #333;
  font-size: 30rpx;
  font-weight: 600;
}

.top_right image {
  width: 18rpx;
  height: 26rpx;
}

.groupactivity_top {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.goods_img {
  width: 100%;
  position: relative;
  overflow: hidden;

}

.goods_img image {
  width: 100%;
  border-radius: 8rpx;
  height: 360rpx;
}

.d_count {
  position: absolute;
  top: 16rpx;
  left: 20rpx;
  color: #fff;
  font-size: 22rpx;
  border-radius: 6rpx;
  padding: 0 6rpx;
}

.goods_price_count {
  text-align: center;
  line-height: 2;
}

/* 多个商品 */
.goods_s_img {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.goods_s_img image {
  width: 90%;
  height: 200rpx;
  border-radius: 8rpx;
}

.goods_s_content {
  display: inline-block;
  width: 32%;
  text-align: center;
}

.goods_s {
  height: 346rpx;
  min-height: 340rpx;
}
</style>