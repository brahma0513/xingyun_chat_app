<template>
	<!--components/trade/components/bargain/bargain.wxml-->
	<view class="bargain_home">
	    <!-- 样式一 -->
	
	    <view class="style_1" v-if="datas.content.css_type==1">
	        <view class="style_content" v-if="goods_list.length>0">
	            <view class="bargain_top flex-def flex-cCenter" @click="go_list">
	                <view class="bargain_title flex-one">
	                   {{datas.content.title}}
	                </view>
	                <view class="top_right">
	                    更多<text class="right_img"></text>
	                </view>
	            </view>
	            <view class="goods_list">
	                <view class="goods_li" v-for="(item,index) in goods_list"  @click="go_detail(item.id)" v-if="index<4">
	                    <view class="goods_img">
	                        <image class="goods_img_s" :src="item.url" alt="商品图片"></image>
	                    </view>
	                    <view class="goods_title">
	                        {{item.product_name}}
	                    </view>
	                    <view class="goods_price flex-def">
	                        <!-- <view class="price_left">最低</view> -->
	                        <view class="price_right"><text class="big_s">￥</text><text
	                                class="big">{{item.min_priceA}}</text><text class="big_s">{{item.min_priceB}}</text>
	                        </view>
	                    </view>
	                </view>
	            </view>
	        </view>
	    </view>
	    <!-- 样式一end -->
	
	    <!-- 样式二 -->
	    <view class="style_2" v-else>
	        <view class="style_content" style="border-radius: 0;" v-if="goods_list.length>0">
	            <view class="bargain_top flex-def flex-cCenter" @click="go_list">
	                <view class="bargain_title flex-one">
	                   {{datas.content.title}}
	                </view>
	                <view class="top_right">
	                    更多<text class="right_img"></text>
	                </view>
	            </view>
	            <view class="goods_list">
	                <view class="goods_li" v-for="(item,index) in goods_list"  @click="go_detail(item.id)" v-if="index<4">
	                    <view class="goods_img">
	                        <image class="goods_img_s" :src="item.url" alt="商品图片"></image>
	                    </view>
	                    <view class="goods_title">
	                        {{item.product_name}}
	                    </view>
	                    <view class="goods_price flex-def">
	                        <!-- <view class="price_left">最低</view> -->
	                        <view class="price_right"><text class="big_s">￥</text><text
	                                class="big">{{item.min_priceA}}</text><text class="big_s">{{item.min_priceB}}</text>
	                        </view>
	                    </view>
	                </view>
	            </view>
	        </view>
	    </view>
	    <!-- 样式二end -->
	</view>
</template>

<script>
	export default {
		name: "bargain",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				goods_list: [//商品
				],
				ids: '',//5/10
			};
		},
		created() {
	
		},
		methods: {
       // 点击跳转至商品详情
        go_detail: function (id) {
            console.log('跳转至商品详情页面')
			var url = "/bargain/web/index.php?m=product&a=pro_detail&pro_id="+id+'&customer_id='+this.vuex_customer_id+'&xdebug=xdebug'
			this.$common.diyLinkJump(url,"h5",true);
        },
		// 点击更多跳转至列表页面
		go_list: function () {
			console.log('跳转至列表页面')
			console.log(this.ids)
			var url = "/bargain/web/index.php?m=activity&a=activity_list&activity_id="+this.ids+'&customer_id='+this.vuex_customer_id+'&xdebug=xdebug'
			this.$common.diyLinkJump(url,"h5",true);
		},
		//获取商品数据
		get_list: function () {
			var that = this
			var params = {
				'activity_id': that.ids
			};
			that.$common.requestData({
				url: '/bargain/web/index.php?m=activity&a=activity_list_api',
				data: params,
				method: 'POST',
				needToken: true
			}).then(res => {
				console.log(res.data)
				if (res.errcode == 0) {
					if (res.errcode == 0) {
					res.data.list[0].product.forEach(function(item, index) {
						item.min_priceA = that.$common.toPrice(item.minimum_price, true);
						item.min_priceB = that.$common.toPrice(item.minimum_price, false);
					})
					that.goods_list = res.data.list[0].product
					}
				}
			})
		}
	},
    created: function () {
		var that = this
          // 5/10
          var ids = ""
          if (that.datas.content.add_data.length > 0) {
              that.datas.content.add_data.forEach((item) => {
                  ids += item.selector_id + ","
              })
              // 去掉最后一个逗号
              if (ids.length > 0) {
                  ids = ids.substr(0, ids.length - 1);
              }
          }
          that.ids = ids
          // 5/10end
        that.get_list()
    }
	}
</script>

<style>
	/* components/trade/components/bargain/bargain.wxss */
	.bargain_home{
	    background: #f5f5f5;
	}
	.bargain_home .bargain_title {
	    color: #333333;
	    /* 5/17 */
	    font-size: 32rpx;
	}
	
	.bargain_home .top_right {
	    font-size: 24rpx;
	    color: #999999;
	    padding-right: 12rpx;
	}
	
	.bargain_home .right_img::after {
	    content: '';
	    display: inline-block;
	    width: 18rpx;
	    height: 20rpx;
	    margin-left: 8rpx;
	    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
	    background-repeat: no-repeat;
	    background-size: 100% 100%;  
	}
	
	.bargain_home .style_content { 
	    background: #fff;
	    padding: 20rpx;
	    border-radius: 14rpx;
	    padding-right: 4rpx;
	    padding-left: 20rpx;
	}
	
	.bargain_home .goods_img image {
	    width: 155rpx;
	    height: 155rpx;
	    border-radius: 4px;
	}
	
	.bargain_home .goods_title {
	    /* 5/17 */
	    font-size: 28rpx;
	    color: #333333;
	    line-height: 32rpx;
	    min-height: 60rpx;
	    width: 90%;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp: 2;
	    margin-bottom: 3px;
	    height: 66rpx;
	}
	
	.bargain_home .goods_price {
	    /* 5/17 */
	    font-size: 28rpx;
	    color: #F24F4C;
	}
	
	.bargain_home .goods_price .big_s {
	     /* 5/17 */
	     font-size: 24rpx;
	}
	
	.bargain_home .goods_li {
	    display: inline-block;
	    width: 25%;
	}
	
	.bargain_home .bargain_top {
	    margin-bottom: 20rpx;
	}
	
	.style_1 {
	    padding: 20rpx;
	}
	
	.bargain_home .price_left {
	    min-width: 46rpx;
	}
	
	.bargain_home .price_right {
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	}
	
	.flex-def {
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: flex;
	}
	
	/* 主轴居中 */
	.flex-zCenter {
	    -webkit-justify-content: center;
	    justify-content: center;
	}
	
	/* 侧轴居中 */
	.flex-cCenter {
	    -webkit-align-items: center;
	    align-items: center;
	}
	
	.flex-one {
	    -webkit-flex: 1;
	    flex: 1;
	}
</style>