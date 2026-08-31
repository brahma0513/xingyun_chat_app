<template>
	<view :style="'padding:' + datas.content.padding + 'px 0'">
		<view class="custom-integral-shop"
			v-if="(datas.content.css_type == 1&&product_list.length > 0)||(datas.content.css_type == 2&&product_list.length > 0)">
			<block v-for="(it,idx) in product_list" :key="idx"
				v-if="idx <= datas.content.show_num && datas.content.css_type == 2">
				<view hover-class="no-hover" :class="'custom-integral-shop-item type' + datas.content.css_type">
					<view class="integral-shop-img-wrap"
						@click="$common.diyLinkJump('/css_integral_shop/web/index.php?m=product&a=pro_detail&id='+it.id)">
						<image :src="it.url"></image>
					</view>
					<view>
						<p :class="'integral-shop-name1 line' + datas.content.title_line"
							v-if="datas.content.show_name">{{it.pro_name}}</p>
						<view>
							<span class="price1"
								v-if="it.act_price>0"><big>{{it.integral}}</big>{{integral_name}}+<big>{{it.act_price}}</big>元</span>
							<span class="price1" v-else><big>{{it.integral}}</big>{{integral_name}}</span>
							<view>
								<span class="sell-count1">{{monetary_unit}}{{it.orgin_price}}</span>
								<span class="sell-count2" v-if="datas.content.show_count">已售{{it.sale}}</span>
							</view>
						</view>
					</view>
				</view>
			</block>
			<view hover-class="no-hover" :class="'custom-integral-shop-item type' + datas.content.css_type"
				v-if="datas.content.css_type == 1">
				<view class="integral-shop-img-wrap"
					@click="$common.diyLinkJump('/css_integral_shop/web/index.php?m=product&a=pro_detail&id=' + product_list[0].id)">
					<image :src="product_list[0].url"></image>
				</view>
				<view>
					<p :class="'integral-shop-name1 title1 line' + datas.content.title_line"
						v-if="datas.content.show_name">{{product_list[0].pro_name}}</p>
					<view class="flex1">
						<view class="flex2">
							<span class="price1"
								v-if="product_list[0].act_price>0"><big>{{product_list[0].integral}}</big>{{integral_name}}+<big>{{product_list[0].act_price}}</big>元</span>
							<span class="price1" v-else><big>{{product_list[0].integral}}</big>{{integral_name}}</span>
							<span class="sell-count1"
								style="margin-top:0;margin-left:10px">{{monetary_unit}}{{product_list[0].orgin_price}}</span>
						</view>
						<span :class="'btn skin-bg-'+ theme"
							@click="cssIntegralShopBuy(product_list[0].id, product_list[0].cheap_proids)">立即购买</span>
					</view>
				</view>
			</view>
		</view>
		<view class="custom-integral-shop custom-integral-shop-new" v-if="datas.content.css_type == 3">

			<view class="shop_group_title" style="width: 100%;">
				<view class="shop_group_box flex-def" style="background-color: #fff;">
					<scroll-view scroll-x="true" :scroll-into-view="scrollIntoViewId"
						class="css_integral_shop_shop_group_list flex-1" style="white-space: nowrap;">
						<view class="li" style="width:auto;" v-for="(itm,index) in datas.content.classifydataset"
							:key="index" :id="'itemli-' + index +'-' + itm.activity_id"
							:style="'font-weight: '+(datas.content.nav_index==index?(datas.content.select_text_style==1?'normal':'bold'):(datas.content.unselected_text_style==1?'normal':'bold'))+';color: '+(datas.content.nav_index==index?datas.content.select_font_color:datas.content.unselected_font_color)+';'"
							@click="cssIntegralShopTabNav(itm,index)" :data-itm="itm" :data-index="index">
							<span v-if="itm.activity_name"
								:style="'max-width:100px;white-space:nowrap;overflow:hidden;font-size: '+(datas.content.nav_index==index?datas.content.select_font_size:datas.content.unselected_font_size)+'px;'">
								{{itm.activity_name}}
							</span>
							<view :class="'line skin-bg-' + theme"
								:style="'border-radius: '+(datas.content.select_line_style==1?'1.5':'0')+'px;'"
								v-if="datas.content.nav_index==index">
								{{datas.content.nav_index}}
							</view>
						</view>
					</scroll-view>
					<view class="shop_group_sort" :class="{'rotate':!datas.content.type}" @click="css_integral_shop_tab_type()">
						<img :src="vuex_apiUrl+'/HTML/admui/public/custom/images/icon_jian_bottom.png'" mode="widthFix">
						</img>
						
					</view>
				</view>
				<view v-if="!datas.content.type" class="shop_group_box shop_group_box_btn">
					<ul class="shop_group_data">
						<li v-for="(itm,index) in datas.content.classifydataset" :key="index" v-if="itm.activity_name"
							:class="datas.content.nav_index == index?'active haf-skin-bg-'+theme+' skin-color-'+theme:''"
							@click="cssIntegralShopTabNav(itm,index)" :data-itm="itm" :data-index="index">
							{{itm.activity_name}}
						</li>
					</ul>
				</view>
			</view>
			<view v-if="!datas.content.type" @click="css_integral_shop_tab_type()" class="svod-mask"
				style="width: 100%;left: -0px;">
			</view>
			<view class="clearfloat" style="padding:0 8px" v-if="product_list.length > 0">
				<view class="WaterfallsLeft" style="width:calc(50% - 3px);">
					<block v-for="(it,idx) in product_list" :key="idx" v-if="(idx + 1) % 2 != 0">
						<view hover-class="no-hover" :class="'custom-integral-shop-item type' + datas.content.css_type">
							<view class="integral-shop-dataset-box">
								<view class="integral-shop-img-wrap"
									@click="$common.diyLinkJump('/css_integral_shop/web/index.php?m=product&a=pro_detail&id=' + it.id)">
									<image :src="it.url"></image>
								</view>
								<view class="integral-shop-dataset-box-detail">
									<p :class="'integral-shop-name1 line'+ datas.content.title_line"
										v-if="datas.content.show_name">{{it.pro_name}}</p>
									<view>
										<span class="price1"
											v-if="it.act_price>0"><big>{{it.integral}}</big>{{integral_name}}+<big>{{it.act_price}}</big>元</span>
										<span class="price1" v-else><big>{{it.integral}}</big>{{integral_name}}</span>
										<view class="clearfloat">
											<span class="sell-count1">{{monetary_unit}}{{it.orgin_price}}</span>
											<span class="sell-count2"
												v-if="datas.content.show_count">已售{{it.sale}}</span>
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="WaterfallsRight" style="width:calc(50% - 3px);">
					<block v-for="(it,idx) in product_list" :key="idx" v-if="(idx + 1) % 2 == 0">
						<view hover-class="no-hover" :class="'custom-integral-shop-item type'+ datas.content.css_type">
							<view class="integral-shop-dataset-box">
								<view class="integral-shop-img-wrap"
									@click="$common.diyLinkJump('/css_integral_shop/web/index.php?m=product&a=pro_detail&id=' + it.id)">
									<image :src="it.url"></image>
								</view>
								<view class="integral-shop-dataset-box-detail">
									<p :class="'integral-shop-name1 line' + datas.content.title_line"
										v-if="datas.content.show_name">{{it.pro_name}}</p>
									<view>
										<span class="price1"
											v-if="it.act_price>0"><big>{{it.integral}}</big>{{integral_name}}+<big>{{it.act_price}}</big>元</span>
										<span class="price1" v-else><big>{{it.integral}}</big>{{integral_name}}</span>
										<view class="clearfloat">
											<span class="sell-count1">{{monetary_unit}}{{it.orgin_price}}</span>
											<span class="sell-count2"
												v-if="datas.content.show_count">已售{{it.sale}}</span>
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
		data() {
			return {
				theme: getApp().globalData.style_color,
				monetary_unit: getApp().globalData.monetary_unit,
				http_host: this.vuex_apiUrl,
				product_list: [],
				integral_name: '',
				phoneWidth: '',
				scrollIntoViewId: '',
				contentList: {},
			};
		},
		props: {
			datas: {
				type: Object,
				default: () => ({}),
			},
		},
		created() {
			this.productSelect();
			
		},

		methods: {
			productSelect() {
				const that = this;
				let selectIndex = 0;
				if (this.datas.content.css_type === 3) {
					this.datas.content.show_num = this.datas.content.classifydataset[selectIndex].goods_count;
					this.datas.content.type = this.datas.content.type || true;
					this.datas.content.nav_index = 0;
					this.contentList = this.datas.content;
				}
				const page = {
					page: 1,
					page_size: this.datas.content.show_num
				};
				let search;

				if (this.datas.content.css_type === 3) {
					search = {
						act_id: this.datas.content.classifydataset[selectIndex].activity_id
					};
				} else if (this.datas.content.css_type === 2 && this.datas.content.shop_type === 1) {
					search = {
						act_id: this.datas.content.activity_id
					};
				} else {
					search = {
						id: this.datas.content.selector_id.split(',')
					};
				}

				that.$common.requestData({
					url: '/css_integral_shop/web/index.php?m=product&a=get_pro_list',
					data: {
						page:JSON.stringify(page),
						search: JSON.stringify(search),
						order: JSON.stringify({
							sort: 'desc'
						}),
					},
					method: 'POST',
				}).then(res => {
					if (res.errcode === 0) {
						this.product_list = res.data.pro;
						this.integral_name = res.data.config.diy_integral_name;
					}
				})
			},

			cssIntegralShopBuy(pid, cheapProids) {
				this.$common.requestData({
					url: '/css_integral_shop/web/index.php?m=order_create&a=submit_order',
					method: 'POST',
					data: {
						pro: JSON.stringify([{
							id: pid,
							proids: cheapProids,
							pro_num: 1
						}]),
					},
				}).then(res => {
					if (res.errcode === 0) {
						console.log("请求成功，进行跳转"),
							this.$common.diyLinkJump(
								'/css_integral_shop/web/index.php?m=order_create&a=order_confirm&order_id' +
								res.order_id, "h5", true)
					} else if (res.errcode === 499) {
						window.location.href = res.data;
					} else if (res.errcode === 43000) {
						window.location.href = res.must_jump_url;
					} else {
						alert(res.errmsg);
					}
				})

			},

			cssIntegralShopGetProList(itm) {
				this.datas.content.show_num = itm.goods_count;
				const page = {
					'page[page]': 1,
					'page[page_size]': this.datas.content.show_num
				};
				let search;

				if (this.datas.content.css_type == 3) {
					search = {
						act_id: itm.activity_id
					};
				} else if (this.datas.content.css_type == 2 && this.datas.content.shop_type == 1) {
					search = {
						act_id: this.datas.content.activity_id
					};
				} else {
					search = {
						id: this.datas.content.selector_id.split(',')
					};
				}
				this.$common.requestData({
					url: '/css_integral_shop/web/index.php?m=product&a=get_pro_list',
					method: 'POST',
					data: {
						page: JSON.stringify(page),
						search: JSON.stringify(search),
						order: JSON.stringify({
							sort: 'desc'
						}),
					},
				}).then(res => {
					if (res.errcode === 0) {
						this.productList = res.data.pro;
						this.integralName = res.data.config.diy_integral_name;
					}
				})
			},

			css_integral_shop_tab_type() {
				const _this = this
				_this.datas.content.type = !_this.datas.content.type;
				_this.contentList = _this.datas.content
			},


			cssIntegralShopTabNav(itm, index) {
				this.datas.content.nav_index = index;
				this.datas.content.activity_id = itm.activity_id;
				this.datas.content.page = 1;
				this.scrollIntoViewId = `itemli-${index}-${this.datas.content.classifydataset[index].activity_id}`;
				this.cssIntegralShopGetProList(itm);
			},
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
		border-radius: 4px;
		overflow: hidden;
	}

	.custom-integral-shop .integral-shop-img-wrap {
		width: 100%;
		position: relative;
		border-radius: 8px;
		overflow: hidden;
	}

	.custom-integral-shop .custom-integral-shop-item image,
	.custom-integral-shop .integral-shop-img-wrap image {
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

	.custom-integral-shop .type2 .integral-shop-img-wrap:after {
		padding-bottom: 100%;
	}

	.custom-integral-shop .custom-integral-shop-item.type2 {
		width: calc(50% - 7.5px);
		display: inline-block;
		padding: 15px 0;
	}

	.custom-integral-shop .custom-integral-shop-item.type2:nth-child(2n) {
		margin-left: 15px;
	}

	.custom-integral-shop .custom-integral-shop-item.type2 p.integral-shop-name {
		margin-bottom: 3px;
	}

	.custom-integral-shop .custom-integral-shop-item.type1 {
		padding: 15px 0;
		display: block
	}

	.custom-integral-shop p.integral-shop-name1 {
		font-size: 14px;
		color: #333;
		height: 36px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
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
		display: inline-block;
		line-height: 24px;
	}

	.custom-integral-shop .price1.t2 {
		color: #333333;
		font-size: 12px;
		line-height: 1;
		display: inline-block;
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
		text-decoration: line-through
	}

	.custom-integral-shop span.sell-count1.t2 {
		float: left;
		font-size: 12px;
		color: #999;
		line-height: 1;
		text-decoration: line-through
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
		display: flex;
		align-items: center;
		justify-content: space-between
	}

	.flex2 {
		display: flex;
		align-items: center;
		justify-content: center
	}

	/*分类瀑布流，样式三*/
	.custom-integral-shop-new {
		background: #F8F8F8 !important;
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

	.integral-shop-dataset-box {
		background: #ffffff;
		margin-bottom: 8px;
		border-radius: 8px;
		overflow: hidden;
	}

	.integral-shop-dataset-box-detail {
		padding: 0 6px 12px;
	}

	.custom-integral-shop-new p.integral-shop-name1 {
		height: auto !important;
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

	.custom-integral-shop-new .css_integral_shop_shop_group_list {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		white-space: nowrap;
		overflow-x: scroll;
	}

	.custom-integral-shop-new .css_integral_shop_shop_group_list::-webkit-scrollbar {
		display: none;
	}

	.custom-integral-shop-new .css_integral_shop_shop_group_list {
		scrollbar-width: none;
	}

	.custom-integral-shop-new .css_integral_shop_shop_group_list .li {
		padding: 0 5px;
		display: inline-block;
		box-sizing: border-box;
		text-align: center;
		font-size: 0;
		color: #333;
	}

	.custom-integral-shop-new .css_integral_shop_shop_group_list .li>span {
		display: inline-block;
		position: relative;
		font-size: 15px;
		line-height: 1;
		padding: 14px 5px 5px;
		font-weight: 600;
	}

	.custom-integral-shop-new .css_integral_shop_shop_group_list .li .line {
		width: 15px;
		height: 3px;
		margin: 0 auto;
	}

	.custom-integral-shop-new .shop_group_sort {
		width: 40px;
	}

	.custom-integral-shop-new .shop_group_sort>img {
		width: 14px;
		height: 14px;
		margin: 13px;
	}

	.custom-integral-shop-new .shop_group_sort.rotate>img {
		transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		/* IE 9 */
		-webkit-transform: rotate(180deg);
		/* Safari and Chrome */
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

	.custom-integral-shop-new .shop_group_data li.active {
		background-color: #FF0036;
		color: #fff;
	}

	.custom-integral-shop-new .shop_group_data>li {
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
</style>