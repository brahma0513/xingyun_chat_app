<template>
	<view :style="'padding:' + datas.content.padding_top + 'px 0 ' + datas.content.padding_bottom + 'px;'">
	    <view :class="'shop-modul-ul flex-def flex-wrap ' + (datas.content.style==1?' one-list none-style ':datas.content.style==2?' two-list ':datas.content.style==3?' three-list ':datas.content.style==4?' four-list ':'')">
	        <view :class="'shop-modul-li' + (datas.content.style==4?' flex-def flex-cStretch ':'')" v-for="(itm,index) in goods_list"  @click='goDetail($event)' :data-id="itm.pro_id" :data-index="index">
	            <view :class="'modul-img' +(datas.content.css_type==2?' bg-height ':'')">
	                <image mode="widthFix" :src="itm.pro_img" alt=""></image>
	            </view>
	            <block v-if="datas.content.style == 1">
	                <view class="modul-center" style="padding: 0 15px 15px;box-sizing: border-box;">
	                    <view class="modul-price flex-def flex-cCenter flex-zBetween">
	                        <view class="modul-price-left flex-def flex-cEnd">
	                            <view class="min-price" v-if="datas.content.pro_title_line == 1 && datas.content.member">{{monetary_unit}}<span>{{itm.min_price}}</span></view>
	                            <view class="min-price" v-else>{{monetary_unit}}<span>{{itm.price}}</span></view>
	                            <view class="max-price" v-if="datas.content.pro_title_show == 1">{{monetary_unit}}{{itm.max_price}}</view>
	                        </view>
	                        <view class="modul-price-right" v-if="datas.content.show_sale == 1">{{itm.pro_count}}付款</view>
	                    </view>
	                    <view class="modul-title">{{itm.pro_name}}</view>
	                    <view class="modul-describe" v-if="datas.content.pro_show_num == 1">{{itm.describe}}</view>
	                    <view class="modul-label flex-def flex-wrap" v-if="datas.content.dis_show == 1">
	                        <view v-for="(itms,indexs) in itm.tagList" >{{itms}}</view>
	                    </view>
	                </view>
	            </block>
	            <block v-if="datas.content.style == 2 || datas.content.style == 3">
	                <view class="modul-center" :style="'padding-left:16rpx;padding-bottom:' +(datas.content.style == 2?'12px':datas.content.style == 3?'10px':'')+';'">
	                    <view class="modul-title">{{itm.pro_name}}</view>
	                    <view class="modul-describe" v-if="datas.content.pro_show_num == 1">{{itm.describe}}</view>
	                    <view :class="'modul-price-left flex-def' + (datas.content.style==2?' flex-cEnd ':' flex-zTopBottom ')">
	                        <view class="min-price" v-if="datas.content.pro_title_line == 1 && datas.content.member">{{monetary_unit}}<span>{{itm.min_price}}</span></view>
	                        <view class="min-price" v-else>{{monetary_unit}}<span>{{itm.price}}</span></view>
	                        <view class="max-price" v-if="datas.content.pro_title_show == 1">{{monetary_unit}}{{itm.max_price}}</view>
	                    </view>
	                    <view class="modul-price-right" v-if="datas.content.style == 2 && datas.content.show_sale == 1">{{itm.pro_count}}付款</view>
	                </view>
	            </block>
	            <block v-if="datas.content.style == 4">
	                <view class="modul-center flex-one flex-def flex-zTopBottom flex-zBetween">
	                    <view>
	                        <view class="modul-title">{{itm.pro_name}}</view>
	                        <view class="modul-describe" v-if="datas.content.pro_show_num == 1">{{itm.describe}}</view>
	                        <view class="modul-label flex-def flex-wrap" v-if="datas.content.dis_show == 1">
	                            <view v-for="(itms,indexs) in itm.tagList" >{{itms}}</view>
	                        </view>
	                    </view>
	                    <view class="modul-price flex-def flex-cCenter flex-zBetween">
	                        <view class="modul-price-left flex-def flex-cEnd">
	                            <view class="min-price" v-if="datas.content.pro_title_line == 1 && datas.content.member">{{monetary_unit}}<span>{{itm.min_price}}</span></view>
	                            <view class="min-price" v-else>{{monetary_unit}}<span>{{itm.price}}</span></view>
	                            <view class="max-price" v-if="datas.content.pro_title_show == 1">{{monetary_unit}}{{itm.max_price}}</view>
	                        </view>
	                        <view class="modul-price-right" v-if="datas.content.show_sale == 1">{{itm.pro_count}}付款</view>
	                    </view>
	                </view>
	            </block>
	        </view>
	    </view>
	</view>
</template>

<script>
	export default {
		name:"shopModule",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				monetary_unit: getApp().globalData.monetary_unit,
				goods_list: [],//商品数组
			};
		},
		created(){
			const _this = this;
			_this.get_goods()
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			// 获取商品数据
			get_goods() {
				var that = this;
				var pro_id = [];
				if(that.datas.content.dataset && that.datas.content.dataset.length<=0){
					return;
				}
				that.datas.content.dataset.forEach((item,index)=>{
					pro_id.push(item.pro_id)
				})

				var requestData = {
					pro_id: pro_id.join(","),
					page_size: 30,
				}
				that.$api.getProductList(requestData).then(res=>{
					if (res.errcode != 0) {
					  return;
					}
					let pros = [];
					for (let pro of res.data){
					  let tagList = [];//["包邮", "赠送购物币", "赠送积分", "SVIP 8.8折"]
					  if (that.datas.content.dis_show == 1){
						// 获取标签
						if (pro.freight_name) {
						  tagList.push(pro.freight_name)
						}
						if (pro.integral_name) {
						  tagList.push(pro.integral_name)
						}
						if (pro.currency_name) {
						  tagList.push(pro.currency_name)
						}
					  }
					  pros.push({
						"pro_id":pro.id,
						"pro_img":pro.url,
						"pro_count":pro.sell_count,
						"pro_name":pro.name,
						"tagList": tagList,
						"price":pro.first_price,
						"min_price":pro.first_price,
						"max_price":pro.orgin_price,
						"describe":pro.mark,
						"origin_pro_data":JSON.stringify(pro),//接口返回的原始数据，用于缓存
					  })
					}
					
					that.goods_list = pros
				})
			},
			//跳转至商品详情页
			goDetail: function (e) {
				var id = e.currentTarget.dataset.id
				var index = e.currentTarget.dataset.index
	
				var prostr = JSON.stringify(this.goods_list[index])
				this.$cache.set('shop_pro_detail_'+id,prostr);
				var url = "/shop/mshop/web/index.php?m=product&a=product_detail&pro_id="+id+'&customer_id='+this.vuex_customer_id
				this.$common.diyLinkJump(url,"h5",true);
			}
		}
	}
</script>

<style>
/*商品组件static*/
.border-dashed-hui {
  border: dashed 1px #f1f4f5;
}

.line-height-100 {
  line-height: 100px;
}

.border-radius-5 {
  border-radius: 5px;
}

.shop-remove {
  position: absolute !important;
  top: 5px;
  right: 5px;
  z-index: 10;
  font-size: 14px;
  cursor: pointer;
}

.shop-modul-ul {
  padding: 0 15px;
  box-sizing: border-box;
}

.shop-modul-ul.none-style {
  padding: 0;
}

.shop-modul-ul .shop-modul-li {
  background-color: #fff;
}

.shop-modul-ul.one-list .shop-modul-li {
  width: 100%;
  margin-bottom: 10px;
}

.shop-modul-ul.two-list .shop-modul-li {
  width: calc(50% - 6px);
  margin-right: 12px;
  margin-bottom: 8px;
}

.shop-modul-ul.two-list .shop-modul-li:nth-child(2n) {
  margin-right: 0;
}

.shop-modul-ul.three-list .shop-modul-li {
  width: calc(33.33% - 6px);
  margin-right: 9px;
  margin-bottom: 10px;
}

.shop-modul-ul.three-list .shop-modul-li:nth-child(3n) {
  margin-right: 0;
}

.shop-modul-ul.four-list .shop-modul-li {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
}

.shop-modul-ul .modul-img {
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.shop-modul-ul.four-list .modul-img {
  width: 120px;
  margin-right: 8px;
}

.shop-modul-ul.none-style .modul-img {
  border-radius: 0;
}

.shop-modul-ul .modul-img:after {
  position: relative;
  content: '';
  display: block;
  padding-bottom: 100%;
}

.shop-modul-ul.one-list .modul-img.bg-height:after {
  padding-bottom: 66.66%;
}

.shop-modul-ul .modul-img image {
  width: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.shop-modul-ul.one-list .modul-title {
  font-size: 17px;
  color: #333;
  margin-top: 5px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.shop-modul-ul.two-list .modul-title {
  font-size: 15px;
  color: #333;
  margin-top: 5px;
  line-height: 1.3;
  min-height: 36px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.shop-modul-ul.three-list .modul-title {
  font-size: 14px;
  color: #333;
  margin-top: 5px;
  line-height: 1.3;
  min-height: 36px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.shop-modul-ul.four-list .modul-title {
  font-size: 15px;
  color: #333;
  line-height: 1.3;
  min-height: 36px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.shop-modul-ul.one-list .modul-describe {
  font-size: 13px;
  color: #F1B465;
  margin-top: 5px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.shop-modul-ul.two-list .modul-describe {
  font-size: 13px;
  color: #F1B465;
  margin-top: 5px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.shop-modul-ul.three-list .modul-describe {
  font-size: 12px;
  color: #F1B465;
  margin-top: 5px;
  line-height: 1.3;
  min-height: 32px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.shop-modul-ul.four-list .modul-describe {
  font-size: 13px;
  color: #F1B465;
  line-height: 1.3;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.shop-modul-ul .modul-label {
  margin-top: 8px;
}

.shop-modul-ul .modul-label view {
  font-size: 12px;
  padding: 2px 4px;
  border: solid 1px #FAE2E4;
  background-color: #FFEEF3;
  margin-right: 4px;
  color: #FF3445;
  line-height: 1;
  border-radius: 2px;
  box-sizing: border-box;
}

.shop-modul-ul.one-list .modul-price {
  margin-top: 12px;
  line-height: 1;
}

.shop-modul-ul.one-list .modul-price .modul-price-left .min-price {
  font-size: 17px;
  color: #F24F4C;
}

.shop-modul-ul.one-list .modul-price .modul-price-left .min-price span {
  font-size: 25px;
}

.shop-modul-ul.one-list .modul-price .modul-price-left .max-price {
  font-size: 14px;
  color: #999999;
  text-decoration: line-through;
  margin-left: 8px;
}

.shop-modul-ul.one-list .modul-price .modul-price-right {
  font-size: 13px;
  color: #999;
}

.shop-modul-ul.two-list .modul-price-left {
  margin-top: 8px;
  line-height: 1;
}

.shop-modul-ul.two-list .modul-price-left .min-price {
  font-size: 14px;
  color: #F24F4C;
}

.shop-modul-ul.two-list .modul-price-left .min-price span {
  font-size: 20px;
}

.shop-modul-ul.two-list .modul-price-left .max-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.shop-modul-ul.two-list .modul-price-right {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  line-height: 1;
}

.shop-modul-ul.three-list .modul-price-left {
  margin-top: 6px;
  line-height: 1;
}

.shop-modul-ul.three-list .modul-price-left .min-price {
  font-size: 13px;
  color: #F24F4C;
}

.shop-modul-ul.three-list .modul-price-left .min-price span {
  font-size: 15px;
}

.shop-modul-ul.three-list .modul-price-left .max-price {
  font-size: 10px;
  color: #999;
  text-decoration: line-through;
  margin-top: 2px;
}

.shop-modul-ul.four-list .modul-price {
  line-height: 1;
}

.shop-modul-ul.four-list .modul-price .modul-price-left .min-price {
  font-size: 14px;
  color: #F24F4C;
}

.shop-modul-ul.four-list .modul-price .modul-price-left .min-price span {
  font-size: 20px;
}

.shop-modul-ul.four-list .modul-price .modul-price-left .max-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.shop-modul-ul.four-list .modul-price .modul-price-right {
  font-size: 12px;
  color: #999;
}

/*商品组件end*/
/*flex兼容写法start*/

/* 定义 */
.flex-def {display: -webkit-flex; display: flex; }
/* 主轴居中 */
.flex-zCenter {-webkit-justify-content: center;justify-content: center;}
/* 主轴居中 */
.flex-zAround {-webkit-justify-content: space-around;justify-content: space-around;}
/* 主轴两端对齐 */
.flex-zBetween {-webkit-justify-content: space-between;justify-content: space-between;}
/* 主轴end对齐 */
.flex-zEnd {-webkit-justify-content: flex-end;justify-content: flex-end;}
/* 主轴start对齐 */
.flex-zStart {-webkit-justify-content: start;justify-content: start;}
/* 侧轴居中 */
.flex-cCenter {-webkit-align-items: center;align-items: center;}
/* 侧轴start对齐 */
.flex-cStart {-webkit-align-items: start;align-items: start;}
/* 侧轴底部对齐 */
.flex-cEnd {-webkit-align-items: flex-end;align-items: flex-end;}
/* 侧轴头部对齐 */
.flex-ctopEnd {-webkit-align-items: end;align-items: end;}
/* 侧轴文本基线对齐 */
.flex-cBaseline {-webkit-align-items: baseline;align-items: baseline;}
/* 侧轴上下对齐并铺满 */
.flex-cStretch {-webkit-align-items: stretch;align-items: stretch;}
/* 主轴从上到下 */
.flex-zTopBottom {-webkit-flex-direction: column;flex-direction: column;}
/* 主轴从下到上 */
.flex-zBottomTop {-webkit-flex-direction: column-reverse;flex-direction: column-reverse;}
/* 主轴从左到右 */
.flex-zLeftRight {-webkit-flex-direction: row;flex-direction: row;}
/* 主轴从右到左 */
.flex-zRightLeft {-webkit-flex-direction: row-reverse;flex-direction: row-reverse;}
/* 是否允许子元素伸缩 */
.flex-item {-webkit-flex-grow: 1;flex-grow: 1;}
/*子元素换行*/
.flex-wrap {-moz-flex-wrap:wrap;flex-wrap:wrap;}
/* 子元素的显示次序 */
.flex-order{-webkit-order: 1;order: 1;}
/*元素比例*/
.flex-one{-webkit-flex: 1; flex: 1;}

/*flex兼容写法end*/
</style>
