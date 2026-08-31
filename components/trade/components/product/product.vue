<template>
	<view :style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 0 '+(datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px'">
		<ul class="custom-goods">
			<li :class="'type'+datas.content.css_type" v-for="(item,index) in product_list" v-if="index<datas.content.pro_show_num">
				<view @click="goToDetail(item.id,index)">
					<view class="image">
						<image :src="item.label_imgurl" class="round"></image>
						<image :src="item.url" mode="aspectFill"></image>
					</view>
					<p :class="'goods-title line-'+datas.content.pro_title_line" v-if="datas.content.pro_title_show==1">{{item.name}}</p>
					<!-- 特权价 -->
					<p v-if="datas.content.dis_show == 1 && datas.content.dis_show_type == 1">
						<p class="member-price-size" v-if="item.privilege_dis && item.privilege_dis<100">
							<text class="member-price-box">{{monetary_unit}}{{item.show_type1_price}}</text>
						</p>
					</p>
					<!-- 特权省 -->
					<p v-if="datas.content.dis_show == 1 && datas.content.dis_show_type == 2">
						<view class="member-dis" v-if="item.privilege_dis && item.privilege_dis<100">
							<text class="member-dis-bg"><text class="member-dis-price">VIP</text></text>
							<text class="member-dis-fg"><text class="span"></text></text>
							<text class="member-dis-right">{{item.privilege_name || '会员'}}省{{monetary_unit}}{{item.show_type2_price}}</text>
						</view>
					</p>
					<p class="current-price">
						<text :class="'price-'+price_color">{{monetary_unit}}<text class="big">{{item.first_priceA}}</text>{{item.first_priceB}}</text>
						<del class="original-price" v-if="datas.content.orgin_price_show==1&&datas.content.show_sale==0&&datas.content.css_type!=3">{{monetary_unit}}{{item.orgin_price}}</del>
						<span class="sale-text" v-if="datas.content.orgin_price_show==0&&datas.content.show_sale==1&&datas.content.css_type!=3">已售{{item.sell_count}}</span>
					</p>
					<p class="sale" v-if="datas.content.show_sale==1&&datas.content.orgin_price_show==1&&datas.content.css_type!=3">
						<del class="original-price">{{monetary_unit}}{{item.orgin_price}}</del>
						<span >已售{{item.sell_count}}</span>
					</p>
				</view>
			</li>
		</ul>
	</view>
</template>

<script>
	import common from '@/utils/common.js'
	export default {
		name:"product",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				product_list: [],
			};
		},
		beforeMount(){
			
			const _this = this; 
			var selector_id = _this.datas.content.selector_id || '';
			var page_size = _this.datas.content.pro_show_num;
			if (selector_id){
				selector_id = selector_id.split('-')[0]
			}
			// 不用缓存，获取到user_id之后再调接口获取数据 
			/*var i = 0
			var time = setInterval(()=>{
				if (uni.getStorageSync('user_id') != ''){
					_this.productSelect();
					clearInterval(time)
				}
				if(i>=25){
					_this.productSelect();
					clearInterval(time)
				}
				i++
			},200)*/
			//console.log(0)
			_this.productSelect();
			//console.log(2)
		},
		created(){
			const _this = this;
			_this.theme = getApp().globalData.style_color
			_this.price_color = getApp().globalData.price_color
			_this.monetary_unit = getApp().globalData.monetary_unit
		},
		methods:{
			//获取获取分类产品内容
			productSelect(){
				const _this = this;
				var page_size = _this.datas.content.pro_show_num;
				var selector_id = _this.datas.content.selector_id || '';
				var select_value = _this.datas.content.select_value
				if (selector_id) {
					selector_id = selector_id.split('-')[0]
				}
				var a = this.$common.toPrice(9.90, true);//console.log('a',a)
				if(select_value){
					var params = {
						page_num:1,
						page_size: page_size,
						type: selector_id,
						only: false,
					}
					//console.log(1)
					this.$api.getProductList(params).then(res=>{
						//console.log(res) 
						if(res.errcode == 0){
							for(var i=0;i<res.data.length;i++){
								res.data[i].first_priceA = this.$common.toPrice(res.data[i].first_price, true)
								res.data[i].first_priceB = this.$common.toPrice(res.data[i].first_price, false)
								res.data[i].show_type1_price = (res.data[i].first_price*(res.data[i].privilege_dis/100)).toFixed(2);
								res.data[i].show_type2_price = (res.data[i].first_price*(1-res.data[i].privilege_dis/100)).toFixed(2);
							}
							this.$cache.set('product_list_' + page_size + selector_id, res.data);
							_this.product_list = res.data
						}
					})
				}
			},
			goToDetail(id,index){
				var pro_id   = id
				//var origin_pro_data = itm.origin_pro_data;
				var url = "/shop/mshop/web/index.php?m=product&a=product_detail&pro_id="+pro_id+'&customer_id='+this.vuex_customer_id
				this.$common.diyLinkJump(url,"h5",true);
			}
		}
	}
</script>

<style>
.no-hover{
  background-color: transparent
}
.custom-goods{ 
	padding: 5px;
	background-color: #FFF;
	font-size: 0;
	margin: 0;
  display:block;
}
.custom-goods li{
	display: inline-block;
	margin: 5px;
	vertical-align: top;
}
.custom-goods li .image{
	margin-bottom: 7px;

}
.custom-goods li .image image{
	display: block;
	width: 100%;
  height: 100%
}
.custom-goods .goods-title{
	color: #5d5d5d;
	font-size: 14px;
	line-height: 18px;
	margin: 0 0 7px;
}
.custom-goods .goods-title .goods-round{
	padding: 0 5px;
	color: #FFF;
	font-size: 11px;
	line-height: 14px;
	display: inline-block;
	background-color: #7f8aef;
	vertical-align: middle;
	margin: -3px 5px 0 0;
	border-radius: 2px;
}
.custom-goods .goods-title.line-1{
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.custom-goods .goods-title.line-2{
	display: -webkit-box; 
	-webkit-line-clamp: 2; 
	-webkit-box-orient: vertical; 
	overflow: hidden;
}
.custom-goods .current-price{
	color: #333333;
	font-size: 13px;
	line-height: 1;
	margin: 0 0 7px 0;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	justify-content: space-between;
}
.custom-goods .current-price .big{
	font-size: 18px;
}
.custom-goods .sale{
	font-size: 11px;
	color: #999;
	line-height: 1;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	justify-content: space-between;
	margin: 0;
}
.sale-text{
	font-size: 11px;
	color: #999;
}
.custom-goods .original-price{
	font-size: 11px;
	color: #999;
	line-height: 1;
  position: relative
}
.custom-goods .original-price::after{
  content: '';
  display: block;
  width: 100%;
  height:1px;
  background:#999;
  left: 0;
  top: 5.5px;
  position: absolute

}
.custom-goods li.type1{
	width: calc(100% - 10px);
}
.custom-goods li.type2{
	width: calc(50% - 10px);
}

.custom-goods li.type2 .image{
  height: 345rpx;
  overflow: hidden;
  position: relative
}
.custom-goods li.type3 .image{
  height: 209rpx;
  position: relative;
}
.custom-goods li.type1 .image{
  height: 690rpx;
  position: relative
}
.custom-goods li.type3{
	width: calc(33.333% - 10px);
}
.custom-goods li.type1 .current-price{
	font-size: 15px;
	padding-top: 5px;
}
.custom-goods li.type1 .current-price .big{
	font-size: 20px;
}
.custom-goods .type1 .image .round {
    width: 160rpx;
    height: 160rpx;
}
.custom-goods .type2 .image .round {
    width: 120rpx;
    height: 120rpx;
}
.custom-goods .type3 .image .round {
    width: 80rpx;
    height: 80rpx;
}
.custom-goods li .image .round {
    position: absolute;
    left: 0;
    top: 0;
}
.custom-goods p{display: block}
/* 特权 */
.member-price-size {
	font-size: 14px;
}
.member-price-box {
	vertical-align: middle;
}
.member-price-bg {
	font-size: 9px;
	display: inline-block;
	background: #000;
	padding: 0 3px;
	position: relative;
	margin-left: 5px;
}
.member-price-bg::before {
	content: '';
	display: block;
	position: absolute;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAKUlEQVQYV2PUVpdv/s/IlM/IwMD7//+/ViDNwKCmJiXCwsha9p+B4SYAmSIIyWAL9SAAAAAASUVORK5CYII=) no-repeat;
	top: 0;
	left: -3px;
	width: 4px;
	height: 2px;
}
.member-price {
	font-size: 9px;
	display: inline-block;
	color: #FFFFFF;
	background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#FFC694), to(#FFE2C2));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}
/* 特权省 */
.member-dis {
	font-size: 10px;
	height: 16px;
	line-height: 17px;
	border-radius: 8px;
	overflow: hidden;
	display: inline-block;
	margin-bottom: 7px;
	white-space: nowrap;
}
.member-dis-bg {
	display: inline-block;
	background: #000;
	padding: 0 3px 0 8px;
	position: relative;
	height: 20px;
}
.member-dis-price {
	font-size: 9px;
	display: inline-block;
	color: #FFFFFF;
	background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#FFC694), to(#FFE2C2));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	position: relative;
	top: -0.5px;
}
.member-dis-fg {
	position: relative;
}
.member-dis-fg .span {
	display: block;
	height: 24px;
	width: 8px;
	background-color: #000;
	position: absolute;
	top: -4px;
	left: -5px;
	transform: rotate(10deg);
}
.member-dis-right {
	color: #FFFFFF;
	display: inline-block;
	height: 16px;
	padding: 0 10px 0 10px;
	background: -webkit-linear-gradient(left, #FFC1A2 , #FF6D25);
	background: -o-linear-gradient(right, #FFC1A2, #FF6D25);
	background: -moz-linear-gradient(right, #FFC1A2, #FF6D25);
	background: linear-gradient(to right, #FFC1A2 , #FF6D25);
}
</style>
