<template>
<view :style="'padding: '+datas.content.padding+'px 0;'">
	<view class="custom-integral-shop" v-if="datas.content.css_type == 1&&product_list.length > 0||datas.content.css_type == 2&&product_list.length > 0">
		<block v-for="(it,idx) in product_list" v-if="idx <= datas.content.show_num && datas.content.css_type == 2">
			<view :class="'custom-integral-shop-item type'+datas.content.css_type" @click="$common.diyLinkJump('/integral_shop/web/index.php?m=product&a=pro_detail&id='+it.id)">
				<view class="integral-shop-img-wrap">
					<image :src="it.url"></image>
				</view>
				<view>
					<p :class="'integral-shop-name1 line'+datas.content.title_line" v-if="datas.content.show_name">{{it.pro_name}}</p>
					<view>
						<span class="price1" v-if="it.act_price>0"><big>{{it.integral}}</big>{{integral_name}}+<big>{{it.act_price}}</big>元</span>
						<span class="price1" v-else><big>{{it.integral}}</big>{{integral_name}}</span>
						<view>
							<span class="sell-count1">{{monetary_unit}}{{it.orgin_price}}</span>
							<span class="sell-count2" v-if="datas.content.show_count">已售{{it.sale}}</span>
						</view>
					</view>
				</view>
			</view>
	    </block>
		<view hover-class="no-hover" :class="'custom-integral-shop-item type'+datas.content.css_type" v-if="datas.content.css_type == 1" @click="$common.diyLinkJump('/integral_shop/web/index.php?m=product&a=pro_detail&id='+product_list[0].id)">
			<view class="integral-shop-img-wrap">
				<image :src="product_list[0].url"></image>
			</view>
			<view>
				<p :class="'integral-shop-name1 title1 line'+datas.content.title_line" v-if="datas.content.show_name">{{product_list[0].pro_name}}</p>
				<view class="flex1">
				    <view class="flex2">				    
				        <span class="price1" v-if="product_list[0].act_price>0"><big>{{product_list[0].integral}}</big>{{integral_name}}+<big>{{product_list[0].act_price}}</big>元</span>
				        <span class="price1" v-else><big>{{product_list[0].integral}}</big>{{integral_name}}</span>
				        <span class="sell-count1" style="margin-top:0;margin-left:10px">{{monetary_unit}}{{product_list[0].orgin_price}}</span>
				    </view>
				    <span :class="'btn skin-bg-'+theme" @click="integral_shop_buy(product_list[0].id,product_list[0].cheap_proids)" >立即购买</span>
				</view>
			</view>
		</view>
	</view>
	<view class="custom-integral-shop custom-integral-shop-new" v-if="datas.content.css_type == 3">
		<!--样式一-->
		<view class="shop_group_title" style="width: 100%;">
			<view class="shop_group_box flex-def" style="background-color: #fff;">
				<scroll-view scroll-x="true" :scroll-into-view="scrollIntoViewId" class="integral_shop_shop_group_list flex-1" style="white-space: nowrap;">
					<view class="li" style="width:auto;" v-for="(itm,index) in datas.content.classifydataset" :id="'itemli-'+index+'-'+itm.activity_id" :style="'font-weight: '+(contentList.nav_index===index?(datas.content.select_text_style==1?'normal':'bold'):(datas.content.unselected_text_style==1?'normal':'bold'))+';color: '+(contentList.nav_index===index?datas.content.select_font_color:datas.content.unselected_font_color)+';'" @click="integral_shop_tab_nav(itm,index)" >
						<span v-if="itm.activity_name" :style="'max-width:100px;white-space:nowrap;overflow:hidden;font-size: '+(contentList.nav_index===index?datas.content.select_font_size:datas.content.unselected_font_size)+'px;'">{{itm.activity_name}}</span>
						<view :class="'line skin-bg-'+theme" :style="'border-radius: '+(datas.content.select_line_style==1?'1.5':'0')+'px;'" v-if="contentList.nav_index===index"></view>
					</view>
				</scroll-view>
				<view :class="'shop_group_sort '+(!contentList.type?'rotate':'')" @click="integral_shop_tab_type">
					<image :src="http_host+'/HTML/admui/public/custom/images/icon_jian_bottom.png'" mode="widthFix"></image>
				</view>
			</view>
			<view v-if="!contentList.type" class="shop_group_box shop_group_box_btn">
				<view class="shop_group_data">
					<view v-for="(itm,index) in datas.content.classifydataset" v-if="itm.activity_name" :class="'shop_group_data_li '+(contentList.nav_index === index?'active haf-skin-bg-'+theme+' skin-color-'+theme:'')" @click="integral_shop_tab_nav(itm,index)">{{itm.activity_name}}</view>
				</view>
			</view>
		</view>
		<!--样式一end-->
	    <view v-if="!contentList.type" @click="integral_shop_tab_type" class="svod-mask" style="width: 100%;left: -0px;"></view>
		<view class="clearfloat" style="padding:0 8px" v-if="product_list.length > 0">
			<view class="WaterfallsLeft" style="width:calc(50% - 3px);">
				<block v-for="(it,idx) in product_list" v-if="(idx + 1) % 2 != 0">
					<view hover-class="no-hover" :class="'custom-integral-shop-item type'+datas.content.css_type" @click="$common.diyLinkJump('/integral_shop/web/index.php?m=product&a=pro_detail&id='+it.id)" >
						<view class="integral-shop-dataset-box">
						  <view class="integral-shop-img-wrap" :style="'height:'+((phoneWidth-15)/2 - 8)+'px;'">
							<image :src="it.url"></image>
						  </view>
						  <view class="integral-shop-dataset-box-detail">
							  <p :class="'integral-shop-name1 line'+datas.content.title_line" v-if="datas.content.show_name">{{it.pro_name}}</p>
							  <view>
								  <span class="price1" v-if="it.act_price>0"><big>{{it.integral}}</big>{{integral_name}}+<big>{{it.act_price}}</big>元</span>
								  <span class="price1" v-else><big>{{it.integral}}</big>{{integral_name}}</span>
								  <view class="clearfloat">
									  <span class="sell-count1">{{monetary_unit}}{{it.orgin_price}}</span>
									  <span class="sell-count2" v-if="datas.content.show_count">已售{{it.sale}}</span>
								  </view>
							  </view>
						  </view>
						</view>
					</view>
				</block>
			  </view>
			  
			<view class="WaterfallsRight" style="width:calc(50% - 3px);">
				<block v-for="(it,idx) in product_list" v-if="(idx + 1) % 2 == 0">
					<view hover-class="no-hover" :class="'custom-integral-shop-item type'+datas.content.css_type" @click="$common.diyLinkJump('/integral_shop/web/index.php?m=product&a=pro_detail&id='+it.id)">
						<view class="integral-shop-dataset-box">
						  <view class="integral-shop-img-wrap" :style="'height:'+((phoneWidth-15)/2 - 8)+'px;'">
							<image :src="it.url"></image>
						  </view>
						  <view class="integral-shop-dataset-box-detail">
							  <p :class="'integral-shop-name1 line'+datas.content.title_line" v-if="datas.content.show_name">{{it.pro_name}}</p>
							  <view>
								  <span class="price1" v-if="it.act_price>0"><big>{{it.integral}}</big>{{integral_name}}+<big>{{it.act_price}}</big>元</span>
								  <span class="price1" v-else><big>{{it.integral}}</big>{{integral_name}}</span>
								  <view class="clearfloat">
									  <span class="sell-count1">{{monetary_unit}}{{it.orgin_price}}</span>
									  <span class="sell-count2" v-if="datas.content.show_count">已售{{it.sale}}</span>
								  </view>
							  </view>
						  </view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</view>

</template>

<script>
	export default {
		name: "intShop",
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
				product_list: [],
				integral_name: '',
				price_color: getApp().globalData.price_color,
				monetary_unit: getApp().globalData.monetary_unit,
				phoneWidth:"",
				scrollIntoViewId:'',
			};
		},
		created() {
			var that = this;
			this.http_host = this.vuex_apiUrl;
			this.phoneWidth = uni.getSystemInfoSync().windowWidth
			that.productSelect()
		},
		methods: {
			/**
			 * 获取分类产品内容
			 */
			productSelect: function() {
				const that = this;
				let selectIndex=0
				if(that.datas.content.css_type == 3){
					that.datas.content.show_num=that.datas.content.classifydataset[selectIndex].goods_count
					if(typeof that.datas.content.type == 'undefined'){
						that.datas.content.type=true
						that.datas.content.nav_index=0
					}
					that.contentList = that.datas.content
				}
				var page = {page:1,page_size:that.datas.content.show_num};
				if(that.datas.content.css_type == 3){
					var search = {act_id:that.datas.content.classifydataset[selectIndex].activity_id};
				}else if(that.datas.content.css_type == 2 && that.datas.content.shop_type == 1){
					var search = {act_id:that.datas.content.activity_id};
				}else{
					var search = {id:that.datas.content.selector_id.split(',')};
				}

				var params = {
					page: JSON.stringify(page),
					search: JSON.stringify(search),
					order:JSON.stringify({sort:'desc'}),
				};
				this.$api.intGetProList(params).then(res => {
					console.log(res)
					if (res.errcode == 0) {
						that.product_list = res.data.pro,
						that.integral_name = res.data.config ? res.data.config.diy_integral_name : "积分"
					} else {
						console.log('请求失败')
					}
				})

			},
			integral_shop_buy(pid, cheap_proids) {
				console.log(pid)
				console.log(cheap_proids)
				const that = this;
				var params = {
					pro: JSON.stringify([{
						id: pid,
						proids: cheap_proids,
						pro_num: 1,
					}]),
				};
				this.$api.integralShopBuy(params).then(res => {
					console.log(res)
					if (res.errcode == 0) {
						console.log(1111111)
						that.$common.diyLinkJump('/integral_shop/web/index.php?m=order_create&a=order_confirm&order_id'+res.order_id)
					} else {
						console.log('请求失败')
					}
				})
			},
			integral_shop_get_pro_list(itm){
				const that = this;
				that.datas.content.show_num=itm.goods_count
				var page = {page:1,page_size:that.datas.content.show_num};
				if(that.datas.content.css_type == 3){
					var search = {act_id:itm.activity_id};
				}else if(that.datas.content.css_type == 2 && that.datas.content.shop_type == 1){
					var search = {act_id:that.datas.content.activity_id};
				}else{
					var search = {id:that.datas.content.selector_id.split(',')};
				}
				var params = {
					page: JSON.stringify(page),
					search: JSON.stringify(search),
					order:JSON.stringify({sort:'desc'}),
				};
				this.$api.intGetProList(params).then(res => {
					console.log(res)
					if (res.errcode == 0) {
						that.product_list = res.data.pro,
						that.integral_name = res.data.config ? res.data.config.diy_integral_name : "积分"
					} else {
						console.log('请求失败')
					}
				})
			},
			integral_shop_tab_type() {
				const that=this
				that.datas.content.type = !that.datas.content.type;
				that.contentList = that.datas.content
			},
			// tab切换
			integral_shop_tab_nav:function(item,index) {
				const that = this;
				that.datas.content.dataset = [];
				that.datas.content.nav_index = index;
				that.datas.content.activity_id=item.activity_id;
				that.datas.content.page = 1;
				that.scrollIntoViewId = 'itemli-'+index + '-' + that.datas.content.classifydataset[index].activity_id,
				that.contentList = that.datas.content

				// 获取数据列表
				that.integral_shop_get_pro_list(item);
			}
		}
	}
</script>

<style>
	.custom-integral-shop {
	    width: 100%;
	    background: #fff;
	    box-sizing: border-box;
	    padding: 0 8px;
	}
	.custom-integral-shop .type1 .integral-shop-img-wrap {
	    width: 100%;
	    height: 175px;
	    position: relative;
		border-radius:4px;
		overflow:hidden;
	}
	.custom-integral-shop .integral-shop-img-wrap {
	    width: 100%;
	    position: relative;
		border-radius:8px;
		overflow:hidden;
	}
	.custom-integral-shop .custom-integral-shop-item image,.custom-integral-shop .integral-shop-img-wrap image {
	    width: 100%;
	    height: 100%;
	    position: absolute;
	    top: 0;
	    object-fit: cover;
	}
	.custom-integral-shop .integral-shop-img-wrap:after {
	    position: relative;
	    content: '';
	    display: block;
	    padding-bottom: 75%;
	}
	.custom-integral-shop .type2 .integral-shop-img-wrap:after{
		padding-bottom:100%;
	}
	.custom-integral-shop .custom-integral-shop-item.type2 {
	    width: calc(50% - 7.5px);
	    display: inline-block;
		padding:15px 0;
	}
	
	.custom-integral-shop .custom-integral-shop-item.type2:nth-child(2n) {
	    margin-left: 15px;
	}
	
	.custom-integral-shop .custom-integral-shop-item.type2 p.integral-shop-name {
	    margin-bottom: 3px;
	}
	.custom-integral-shop .custom-integral-shop-item.type1{
		padding:15px 0;
		display:block
	}
	.custom-integral-shop p.integral-shop-name1  {
	    font-size: 14px;
	    color: #333;
	    height: 36px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    word-wrap:break-word;
	    word-break: break-word;
	    padding: 0;
	    margin: 5px 0;
	    line-height: 1.3;
	    letter-spacing: 1px; 
	}
	.custom-integral-shop p.integral-shop-name1.title1 {
	    height: 38px
	}
	
	.custom-integral-shop .price1 {
	    color: #333333;
	    font-size: 12px;
		display:inline-block;
		line-height: 24px;
	}
	.custom-integral-shop .price1.t2 {
	    color: #333333;
	    font-size: 12px;
		line-height:1;
		display:inline-block;
		float: left;
	}
	.custom-integral-shop .price1 big {
	    font-size: 15px;
	    color: #f24f4c;
	    font-weight: 600
	}
	.custom-integral-shop span.sell-count1 {
	    float: left;
	    font-size: 12px;
	    color: #999;
		text-decoration:line-through
	}
	.custom-integral-shop span.sell-count1.t2 {
	    float: left;
	    font-size: 12px;
	    color: #999;
		line-height:1;
		text-decoration:line-through
	}
	.custom-integral-shop span.sell-count2 {
	    float: right;
	    font-size: 12px;
	    color: #999;
	}
	.custom-integral-shop .integral-price .jifen {
	    font-size: 12px;
	}
	.custom-integral-shop span.btn {
	    width: 80px;
	    line-height: 27px;
	    background-color: #7F8AEF;
	    color: #ffffff;
	    text-align: center;
	    font-size: 13px;
	    border-radius: 4px;
	}
	.flex1 {
	    display:flex;
	    align-items: center;
	    justify-content:space-between
	}
	.flex2 {
	    display:flex;
	    align-items: center;
	    justify-content: center
	}
	
	/*分类瀑布流，样式三*/
	.custom-integral-shop-new{
	  background: #F8F8F8!important;
	  position: relative;
	  padding: 0px;
	}
	.clearfloat:after {
	  content: '';
	  display: block;
	  height: 0;
	  clear: both;
	  visibility: hidden;
	}
	.WaterfallsLeft {
	  width: 171px;
	  float: left;
	}
	.WaterfallsRight {
	  width: 171px;
	  float: right;
	}
	.integral-shop-dataset-box{
	  background: #ffffff;
	  margin-bottom: 8px;
	  border-radius: 8px;
	  overflow: hidden;
	}
	.integral-shop-dataset-box-detail{
	  padding: 0 6px 12px;
	}
	.custom-integral-shop-new p.integral-shop-name1{
	  height: auto!important;
	}
	.custom-integral-shop-new .shop_group_title {
	  width: 100%;
	  position: relative;
	  left: 0;
	  top: 0;
	  height: 45px;
	  z-index: 10;
	}
	.custom-integral-shop-new .shop_group_box {
	  font-size: 0;
	  width: 100%;
	  box-sizing: border-box;
	}
	.custom-integral-shop-new .integral_shop_shop_group_list {
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  white-space: nowrap;
	  overflow-x: scroll;
	}
	.custom-integral-shop-new .integral_shop_shop_group_list::-webkit-scrollbar {
	  display: none;
	}
	.custom-integral-shop-new .integral_shop_shop_group_list{
	  scrollbar-width: none;
	}
	.custom-integral-shop-new .integral_shop_shop_group_list .li {
	  padding: 0 5px;
	  display: inline-block;
	  box-sizing: border-box;
	  text-align: center;
	  font-size: 0;
	  color: #333;
	}
	.custom-integral-shop-new .integral_shop_shop_group_list .li>span {
	  display: inline-block;
	  position: relative;
	  font-size: 15px;
	  line-height: 1;
	  padding: 14px 5px 5px;
	  font-weight: 600;
	}
	.custom-integral-shop-new .integral_shop_shop_group_list .li .line {
	  width: 15px;
	  height: 3px;
	  margin: 0 auto;
	}
	.custom-integral-shop-new .shop_group_sort {
	  width: 40px;
	}
	.custom-integral-shop-new .shop_group_sort>image{
	  width: 14px;
	  height: 14px;
	  margin: 13px;
	}
	.custom-integral-shop-new  .shop_group_sort.rotate>image{
	  transform:rotate(180deg);
	  -ms-transform:rotate(180deg); /* IE 9 */
	  -webkit-transform:rotate(180deg); /* Safari and Chrome */
	}
	.custom-integral-shop-new .shop_group_box.shop_group_box_btn {
	  position: absolute;
	  left: 0;
	  top: 40px;
	  padding: 0;
	  background-color: #fff;
	}
	.custom-integral-shop-new .shop_group_box {
	  font-size: 0;
	  width: 100%;
	  box-sizing: border-box;
	}
	.custom-integral-shop-new .shop_group_data {
	  padding: 15px 15px 0;
	}
	.custom-integral-shop-new .shop_group_data .shop_group_data_li.active {
	  background-color: #FF0036;
	  color: #fff;
	}
	
	.custom-integral-shop-new .shop_group_data .shop_group_data_li {
	  display: inline-block;
	  height: 28px;
	  margin-bottom: 15px;
	  margin-right: 10px;
	  font-size: 12px;
	  color: #323233;
	  border-radius: 14px;
	  background-color: #F7F8FA;
	  line-height: 28px;
	  text-align: center;
	  padding: 0 15px;
	  vertical-align: top;
	  -webkit-border-radius: 14px;
	  -moz-border-radius: 14px;
	  -ms-border-radius: 14px;
	  -o-border-radius: 14px;
	}
	.custom-integral-shop-new .svod-mask {
	  width: 100%;
	  height: 100%;
	  background-color: #000;
	  opacity: .6;
	  position: absolute;
	  top: 0;
	  left: 0;
	  z-index: 9;
	}
	.custom-integral-shop-new .flex-1 {
	  -webkit-box-flex: 1;
	  -ms-flex: 1;
	  -webkit-flex: 1;
	  flex: 1;
	  width: 50%;
	}
	/*分类瀑布流，样式三end*/
	/*积分商城组件End*/
</style>
