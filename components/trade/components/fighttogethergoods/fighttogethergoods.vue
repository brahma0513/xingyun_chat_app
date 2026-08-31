<template>
	<view class="fighttogether_goods" style="padding:20rpx">
		<view @click="$common.diyLinkJump('/collage/web/index.php?m=product&a=product_details&product_id=' + datas.content.pro_id + '&activities_id=' + datas.content.activity_id)" :data-proid="datas.content.pro_id" :data-activityid="datas.content.activity_id">
			<view class="goods_img" :style="'height:'+(datas.content.img_type==1?'350px':'180px')">
				<image :src="datas.content.img_type==1?datas.content.pro_img:datas.content.self_img"></image>
			</view>
			<view class="title">
				<text :class="'skin-bg-'+theme+' ziyin'">{{datas.content.group_type}}</text>
				<text style="color:#5D5D5D;">{{datas.content.pro_name?datas.content.pro_name:'拼团'}}</text>
			</view>
			<view class="goods_content">
				<view class="goods_left" style="width:100%;line-height: 2;">
					<view :class="'time skin-color-'+theme" v-if="datas.content.state==1">{{datas.content.start_time}} 活动开始</view>
					<view :class="'time skin-color-'+theme" v-if="datas.content.state==2">{{datas.content.end_time}} 活动结束</view>
					<view class="count">
						<text>{{datas.content.group_size}}人团</text>
						<text style="margin-left:8rpx;">￥</text>
						<text style="font-size:32rpx;">{{datas.content.first_priceA}}</text>
						<text>{{datas.content.first_priceB}}</text>
						<text style="color:#999;margin-left:10rpx;" v-if="datas.content.is_single_buy==1">单购价 ￥{{datas.content.old_price}}</text>
					</view>
				</view>

				<view class="goods_right">
					<view :class="'skin-bg-'+theme" :data-proid="datas.content.pro_id" :data-activityid="datas.content.activity_id" @click="$common.diyLinkJump('/collage/web/index.php?m=product&a=product_details&product_id=' + datas.content.pro_id + '&activities_id=' + datas.content.activity_id)"  >
						{{datas.content.state==2?'去开团':'即将开始'}}
					</view>
				</view>

			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: "fighttogethergoods",
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
			};
		},
		created() {
			this.http_host = this.vuex_apiUrl;
			this.getGroupGoods()
		},
		methods: {
			// 点击去开团
			toGroup: function (e) {
			  var pro_id = e.currentTarget.dataset.proid
			  var activity_id = e.currentTarget.dataset.activityid
			},
			// 获取拼团商品组件数据
			getGroupGoods: function () {
			  var that = this
			  var reques_data = {
			    p_ids: that.datas.content.pro_id
			  }
			  
			  that.$common.requestData({
			  	url: '/uniapp_template/web/index.php?m=collage&a=get_product_info',
			  	data: reques_data,
			  	method: "POST", 
			  	needToken: true
			  }).then(res => {
				if (res.errcode == 0) {
				  var data = res.data
				  var data_content = that.datas
				  if (data && data[0].is_expired == 0) {
					data_content.content.pro_img = data[0].img;
					data_content.content.group_size = data[0].g_size;
					data_content.content.first_priceA = that.$common.toPrice(data[0].price, true)
					data_content.content.first_priceB = that.$common.toPrice(data[0].price, false)
					data_content.content.activity_id = data[0].acid;
					data_content.content.old_price = data[0].single_price;
					data_content.content.pro_name = data[0].pro_name;
					data_content.content.start_time = data[0].begin_time;
					data_content.content.end_time = data[0].end_time;
					data_content.content.is_single_buy = data[0].is_single_buy;
					 // 10/22
					data_content.content.group_type=data[0].group_type_str
					var now = new Date().getTime();
					if (new Date(data_content.content.start_time.replace(/-/g,"/")).getTime() > now) {
					  data_content.content.state = 1
					} else if (new Date(data_content.content.start_time.replace(/-/g,"/")).getTime() < now && new Date(data_content.content.end_time.replace(/-/g,"/")).getTime() > now) {
					  data_content.content.state = 2;
					}
					that.data = data_content
				  }
				} else {
				}
			  
			  })
			}
		}
	}
</script>

<style>
.fighttogether_goods {
  width: 100%;
  padding: 10px;
  background: #fff;
}

.goods_img {
  width: 100%;
  /* border: 1px solid #ccc; */
}

.goods_img image {
  width: 100%;
  height: 100%;
}

.ziyin {
  color: #fff;
  padding: 0 8rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  margin-right: 15rpx;
}

.goods_right view {
  width: 70px;
  color: #fff;
  border-radius: 20px;
  text-align: center;
  padding: 6rpx 0;
  font-size: 26rpx;
}

.count {
  font-size: 24rpx;
  color: #f24e4c;
}

.goods_content {
  display: flex;
  align-items: center;
}

.title {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 28rpx;
}

.time {
  font-size: 24rpx;
}
</style>