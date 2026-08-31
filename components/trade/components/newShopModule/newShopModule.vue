<template>
	<view
		:style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding: '+datas.content.padding_top+'px '+(datas.content.select_style==1&&datas.content.display_method==2?0:datas.content.padding_horizontal)+'px '+datas.content.padding_bottom+'px;'"
		style="background-size: cover;background-position: center center;overflow: hidden;">
		<ul class="shop-modul-ul new flex-def flex-wrap none-style"
			:class="[datas.content.select_style==1?'one-list':datas.content.select_style==2?'two-list':datas.content.select_style==3?'three-list':datas.content.select_style==4?'four-list':'']"
			:style="'overflow: hidden;border-radius:'+(datas.content.select_style==4&&datas.content.style==2?datas.content.radius_diy:0)+'px;padding: '+(datas.content.select_style==4&&datas.content.style==2?'0 10':0)+'px;background-color: '+(datas.content.select_style==4&&datas.content.style==2?'#fff':'transparent')+';'">
			<li class="shop-modul-li new"
				:style="'border-radius:'+(!(datas.content.select_style==4&&datas.content.style==2)?datas.content.radius_diy:0)+'px;'"
				:class="[datas.content.select_style==4?'flex-def flex-ctopEnd':'',datas.content.select_style==4&&datas.content.style==2?'style_2':datas.content.select_style==4&&datas.content.style==1?'style_1':'','bottom_'+(datas.content.pros.length % datas.content.select_style)]"
				v-for="(itm,index) in goods_list"
				v-if="index<(datas.content.shop_source==2&&datas.content.goods_count?datas.content.goods_count:31)"
				@click="goDetail($event)" :data-id="itm.pro_id" :data-index="index">
				<view class="modul-img" :class="[datas.content.css_type==2?'bg-height':'']">
					<img :src="itm.pro_img" alt="" />
					<view class="sold_out_img" v-if="itm.storenum<=0">
						<img :src="itm.stock_out_img?itm.stock_out_img:'../../../shop/mshop/web/static/images/sold_out01.png'"
							:style="'width:'+(datas.content.select_style==1?160:datas.content.select_style==2?90:60)+'px;height:'+(datas.content.select_style==1?160:datas.content.select_style==2?90:60)+'px;'" />
					</view>
				</view>
				<block v-if="datas.content.select_style == 1">
					<view class="modul-center" style="padding: 0 15px 15px;">
						<view class="modul-price flex-def flex-cCenter flex-zBetween"
							v-if="datas.content.price_position==2">
							<view class="modul-price-left flex-def flex-cEnd">
								<view class="min-price">
									{{datas.content.show_monetary_unit}}<span>{{itm.price | shop_firstPrice}}</span>{{itm.price | shop_secondPrice}}
								</view>
								<view class="max-price" style="padding-bottom: 2px;"
									v-if="datas.content.pro_title_show == 1&&datas.content.offer_display==1">
									{{datas.content.show_monetary_unit}}{{itm.max_price}}
								</view>
								<template v-if="itm.privilege_dis && itm.privilege_dis<100">
									<view class="other-price one flex-def flex-cStretch"
										v-if="datas.content.offer_display == 2 && datas.content.dis_show_type == 1">
										<view class="left flex-def flex-cCenter">{{itm.privilege_name || '会员'}}省</view>
										<view class="right flex-def flex-cEnd">
											{{datas.content.show_monetary_unit}}<big>{{itm.priceA | shop_firstPrice}}</big>{{itm.priceA | shop_secondPrice}}
										</view>
									</view>
									<view class="other-price one flex-def flex-cStretch"
										v-if="datas.content.offer_display == 2 && datas.content.dis_show_type == 2">
										<view class="left flex-def flex-cCenter">{{itm.privilege_name || '特权'}}价</view>
										<view class="right flex-def flex-cEnd">
											{{datas.content.show_monetary_unit}}<big>{{itm.priceB | shop_firstPrice}}</big>{{itm.priceB | shop_secondPrice}}
										</view>
									</view>
								</template>
							</view>
							<view class="modul-price-right" v-if="datas.content.show_sale == 1">{{itm.pro_count}}人付款
							</view>
						</view>
						<view class="modul-title-new" :class="'line-'+datas.content.shop_name_column"
							:style="'margin-top: '+(datas.content.price_position==2?8:12)+'px;'">{{itm.pro_name}}</view>
						<view class="modul-describe" v-if="datas.content.pro_show_num == 1"
							:style="'color: '+datas.content.roduct_description_color+';'">{{itm.describe}}</view>
						<view class="modul-price flex-def flex-cCenter flex-zBetween"
							v-if="datas.content.price_position==1">
							<view class="modul-price-left flex-def flex-cEnd">
								<view class="min-price">
									{{datas.content.show_monetary_unit}}<span>{{itm.price | shop_firstPrice}}</span>{{itm.price | shop_secondPrice}}
								</view>
								<view class="max-price" style="padding-bottom: 2px;"
									v-if="datas.content.pro_title_show == 1&&datas.content.offer_display==1">
									{{datas.content.show_monetary_unit}}{{itm.max_price}}
								</view>
								<template v-if="itm.privilege_dis && itm.privilege_dis<100">
									<view class="other-price one flex-def flex-cStretch"
										v-if="datas.content.offer_display == 2 && datas.content.dis_show_type == 1">
										<view class="left flex-def flex-cCenter">{{itm.privilege_name || '会员'}}</view>
										<view class="right flex-def flex-cEnd">
											{{datas.content.show_monetary_unit}}<big>{{itm.priceA | shop_firstPrice}}</big>{{itm.priceA | shop_secondPrice}}
										</view>
									</view>
									<view class="other-price one flex-def flex-cStretch"
										v-if="datas.content.offer_display == 2 && datas.content.dis_show_type == 2">
										<view class="left flex-def flex-cCenter">{{itm.privilege_name || '特权'}}价</view>
										<view class="right flex-def flex-cEnd">
											{{datas.content.show_monetary_unit}}<big>{{itm.priceB | shop_firstPrice}}</big>{{itm.priceB | shop_secondPrice}}
										</view>
									</view>
								</template>
							</view>
							<view class="modul-price-right" v-if="datas.content.show_sale == 1">{{itm.pro_count}}人付款
							</view>
						</view>
						<ul class="modul-label flex-def flex-wrap" v-if="datas.content.dis_show == 1">
							<li v-for="(itms,indexs) in itm.tagList">{{itms}}</li>
						</ul>
					</view>
				</block>
				<block v-if="datas.content.select_style == 2 || datas.content.select_style == 3">
					<view class="modul-center"
						:style="'padding-left:8px;padding-right:8px;padding-bottom: '+(datas.content.select_style == 2?'12px':datas.content.select_style == 3?'10px':'')">
						<view class="modul-title-new" :class="'line-'+datas.content.shop_name_column">{{itm.pro_name}}
						</view>
						<view class="modul-describe" v-if="datas.content.pro_show_num == 1"
							:style="'color: '+datas.content.roduct_description_color+';'">{{itm.describe}}</view>
						<view class="modul-price-left flex-def"
							:class="[datas.content.select_style==2?'flex-cEnd':'flex-zTopBottom']">
							<view class="min-price">
								{{datas.content.show_monetary_unit}}<span>{{itm.price | shop_firstPrice}}</span>{{itm.price | shop_secondPrice}}
							</view>
							<view class="max-price"
								v-if="datas.content.pro_title_show == 1&&datas.content.offer_display==1">
								{{datas.content.show_monetary_unit}}{{itm.max_price}}
							</view>
						</view>
						<template v-if="itm.privilege_dis && itm.privilege_dis<100">
							<view class="other-price two flex-def flex-cStretch"
								v-if="datas.content.offer_display == 2 && datas.content.dis_show_type == 1">
								<view class="left flex-def flex-cCenter">{{itm.privilege_name || '会员'}}</view>
								<view class="right flex-def flex-cEnd">
									{{datas.content.show_monetary_unit}}<big>{{itm.priceA | shop_firstPrice}}</big>{{itm.priceA | shop_secondPrice}}
								</view>
							</view>
							<view class="other-price two flex-def flex-cStretch"
								v-if="datas.content.offer_display == 2 && datas.content.dis_show_type == 2">
								<view class="left flex-def flex-cCenter">{{itm.privilege_name || '特权'}}价</view>
								<view class="right flex-def flex-cEnd">
									{{datas.content.show_monetary_unit}}<big>{{itm.priceB | shop_firstPrice}}</big>{{itm.priceB | shop_secondPrice}}
								</view>
							</view>
						</template>
						<view class="modul-price-right"
							v-if="datas.content.select_style == 2 && datas.content.show_sale == 1">{{itm.pro_count}}人付款
						</view>
					</view>
				</block>
				<block v-if="datas.content.select_style == 4">
					<view class="modul-center flex-one flex-def flex-zTopBottom flex-zBetween">
						<view>
							<view class="modul-title-new" :class="'line-'+datas.content.shop_name_column">
								{{itm.pro_name}}
							</view>
							<view class="modul-describe" v-if="datas.content.pro_show_num == 1"
								:style="'color: '+datas.content.roduct_description_color+';'">{{itm.describe}}</view>
							<template v-if="itm.privilege_dis && itm.privilege_dis<100">
								<view class="other-price two flex-def flex-cStretch"
									v-if="datas.content.offer_display == 2 && datas.content.dis_show_type == 1">
									<view class="left flex-def flex-cCenter">{{itm.privilege_name || '会员'}}</view>
									<view class="right flex-def flex-cEnd">
										{{datas.content.show_monetary_unit}}<big>{{itm.priceA | shop_firstPrice}}</big>{{itm.priceA | shop_secondPrice}}
									</view>
								</view>
								<view class="other-price two flex-def flex-cStretch"
									v-if="datas.content.offer_display == 2 && datas.content.dis_show_type == 2">
									<view class="left flex-def flex-cCenter">
										{{itm.privilege_name || '特权'}}价
									</view>
									<view class="right flex-def flex-cEnd">
										{{datas.content.show_monetary_unit}}<big>{{itm.priceB | shop_firstPrice}}</big>{{itm.priceB | shop_secondPrice}}
									</view>
								</view>
							</template>
							<ul class="modul-label flex-def flex-wrap" v-if="datas.content.dis_show == 1">
								<li v-for="(itms,indexs) in itm.tagList">{{itms}}</li>
							</ul>
						</view>
						<view class="modul-price flex-def flex-cCenter flex-zBetween">
							<view class="modul-price-left flex-def flex-cEnd">
								<view class="min-price">
									{{datas.content.show_monetary_unit}}<span>{{itm.price | shop_firstPrice}}</span>{{itm.price | shop_secondPrice}}
								</view>
								<view class="max-price"
									v-if="datas.content.pro_title_show == 1&&datas.content.offer_display==1">
									{{datas.content.show_monetary_unit}}{{itm.max_price}}
								</view>
							</view>
							<view class="modul-price-right" v-if="datas.content.show_sale == 1">{{itm.pro_count}}人付款
							</view>
						</view>
					</view>
				</block>
			</li>
		</ul>
	</view>

</template>

<script>
	export default {
		name: "newShopModule",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				loading: false,
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				monetary_unit: getApp().globalData.monetary_unit,
				goods_list: [], //商品数组
				all_list:[],
				page_size: 20,
				supply_id: '',
				last_key: 0,
				total_count: 0,	//总数据
				can_load: false,	//是否可以加载 防止并发
			};
		},
		filters: {
			shop_firstPrice(value) {
				value = parseFloat(value).toFixed(2);
				var arr = value.split(".");
				value = arr[0];
				return value;
			},
			shop_secondPrice(value) {
				value = parseFloat(value).toFixed(2);
				let arr = value.split(".");
				return '.' + arr[1];
			}
		},
		created() {
			const _this = this;
			_this.get_goods()
		},
		
		mounted() {
			let that = this;
			
			uni.$on('onReachBottom', () => {
				var key = that.last_key;
				var goods_list = that.goods_list;
				if(that.can_load==true&&that.last_key<that.total_count){
					that.can_load=false;
					for(var i=0; i<=that.page_size;i++){
						if(i<that.page_size&&that.last_key<that.total_count){
							goods_list.push(that.all_list[that.last_key])
							that.last_key = parseInt(that.last_key)+1;
						}
						if(i+1==that.page_size){
							that.goods_list = goods_list
							that.can_load = true
						}
					}
				}
				
			})
		},
		
		/**
		 * 组件的方法列表
		 */
		methods: {
			// 获取商品数据
			get_goods() {
				var that = this
				// var is_open_paging = 0
				let url = '/shop/mshop/api/index.php?m=product&a=get_product_list'
				var requestData = {
					'customer_id_en': that.vuex_customer_id_en,
					'only': 1,
					'version': '1.0',
				}
				this.goods_list = []
				this.all_list = []
				this.loading = true
				this.can_load=false;
				this.last_key = 0;
				var goods_list = this.goods_list;
				that.datas.content.shop_can_load = false //滚动加载状态
				// last_can_load=false
				if (that.datas.content.shop_source == 2) {
					if (that.datas.content.selector_type == 'supply') {
						requestData.supply_id = that.datas.content.selector_id.split('-')[0];
					} else {
						requestData.type = that.datas.content.selector_id.split('-')[0];
					}
					requestData.page_num = 1;
					requestData.page_size = that.datas.content.goods_count;
				}

				if (that.datas.content.shop_source == 1) {
					if (that.datas.content.dataset.length <= 0) {
						return;
					}
					let pro_id = [];
					for (let val of that.datas.content.dataset) {
						pro_id.push(val.pro_id);
					}
					requestData.page_num = 1;
					requestData.pro_id = pro_id.join(",");
					requestData.page_size = 30;
				}

				that.$common.requestData({
					url: url,
					data: requestData,
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode != 0) {
						return
					}
					if (res.data.pro.length > 0) {
						
						var pros = [];
						for (let pro of res.data.pro) {
							var tagList = []; //["包邮", "赠送购物券", "赠送积分", "SVIP 8.8折"]
							if (that.datas.content.dis_show == 1) {
								if (pro.freight_name) {
									tagList.push(pro.freight_name)
								}
								if (pro.currency_name) {
									tagList.push(pro.currency_name)
								}
								if (pro.integral_name) {
									tagList.push(pro.integral_name)
								}
							}
							if (pro.privilege_dis == -1 && pro.privilege_price) {
								var priceA = pro.first_price - pro.privilege_price;
								var priceB = pro.privilege_price;
							} else {
								var priceA = (pro.first_price * (1 - pro.privilege_dis / 100)).toFixed(2);
								var priceB = (pro.first_price * (pro.privilege_dis / 100)).toFixed(2);
							}
							pros.push({
								"pro_id": pro.id,
								"pro_img": pro.url,
								"pro_count": pro.sell_count,
								"pro_name": pro.name,
								"type": 0,
								"tagList": tagList,
								"price": pro.first_price,
								"priceA": priceA > 0 ? priceA : 0,
								"priceB": priceB,
								"min_price": pro.first_price,
								"max_price": pro.orgin_price,
								"describe": pro.mark,
								"storenum": pro.storenum,
								"privilege_dis": pro.privilege_dis,
								"privilege_price": pro.privilege_price,
								"origin_pro_data": JSON.stringify(pro), //接口返回的原始数据，用于缓存
								"stock_out_img": res.data.set.stock_out_img, //售罄图标
							})
							that.all_list = pros
							that.total_count = pros.length;
							//加载第一页数据
							that.can_load = false;
							for(var i=0; i<that.page_size;i++){
							if(i<that.page_size&&that.last_key<that.total_count){
									goods_list.push(that.all_list[that.last_key])
									that.last_key = parseInt(that.last_key)+1;
								}
								if(i+1==that.page_size){
									that.goods_list = goods_list
									that.can_load = true
								}
							}
							
						}
						
						if (that.datas.content.pros.length > 0) {
							if (that.datas.content.pros[0].pro_id == 0) {
								that.datas.content.pros = [];
							}
						}
						if (that.goods_list) {
							let arrObj = [...that.datas.content.pros, ...that.goods_list]
							let deduplicationArr = [...new Map(arrObj.map(items => [items.pro_id, items]))
							.values()] //数组对象去重
							// that.datas.content.pros = deduplicationArr;
							that.goods_list = deduplicationArr
							
						}
					}
				})

			},
			//跳转至商品详情页
			goDetail: function(e) {
				var id = e.currentTarget.dataset.id
				var index = e.currentTarget.dataset.index

				var prostr = JSON.stringify(this.goods_list[index])
				this.$cache.set('shop_pro_detail_' + id, prostr);
				var url = "/shop/mshop/web/index.php?m=product&a=product_detail&pro_id=" + id + '&customer_id=' +
					this
					.vuex_customer_id
				this.$common.diyLinkJump(url, "h5", true);
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
		list-style-type: none;
	}

	.shop-modul-ul.none-style {
		padding: 0;
	}

	.shop-modul-ul .shop-modul-li {
		background-color: #fff;
		overflow: hidden;
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
	}

	.shop-modul-ul .modul-img {
		width: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 8px;
	}

	/*8/31*/
	.shop-modul-ul .modul-img .sold_out_img {
		width: 100%;
		position: absolute;
		left: 0;
		top: 50%;
		z-index: 3;
		transform: translateY(-50%);
		background: rgba(0, 0, 0, 0.4);
		height: 100%;
	}

	.custom-goods li .img .sold_out_img {
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.45);
		width: 100%;
		height: 100%;
	}

	/*8/31end*/
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

	.shop-modul-ul .modul-img img {
		width: 100%;
		height: auto;
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

	.shop-modul-ul .modul-label li {
		font-size: 12px;
		padding: 2px 4px;
		border: solid 1px #FAE2E4;
		background-color: #FFEEF3;
		margin-right: 4px;
		color: #FF3445;
		line-height: 1;
		border-radius: 2px;
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


	/*重构组件样式start*/
	.shop-list {
		width: 88px;
		height: 88px;
		border: 1px solid #EBEEF5;
		border-radius: 2px;
		padding: 5px;
		box-sizing: border-box;
		margin-bottom: 12px;
		margin-right: 12px;
		position: relative;
		cursor: pointer;
	}

	.shop-list .shop-list-img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.shop-list .shop-list-del {
		display: none;
		width: 76px;
		height: 76px;
		position: absolute;
		left: 6px;
		top: 6px;
		z-index: 1;
		padding-top: 29px;
		background-color: rgba(0, 0, 0, 0.63);
		text-align: center;
		line-height: 76px;
		font-size: 0;
	}

	.shop-list .shop-list-del img {
		width: 18px;
		height: 18px;
	}

	.shop-list:hover .shop-list-del {
		display: block;
	}

	.bg-tm {
		background: rgba(0, 0, 0, 0) !important;
	}

	.new_shop_group .shop_group_title {
		width: 100%;
		position: relative;
		left: 0;
		top: 0;
		height: 45px;
		z-index: 10;
	}

	.new_shop_group .shop_group_box {
		font-size: 0;
		width: 100%;
		box-sizing: border-box;
	}

	.new_shop_group .shop_group_box.shop_group_box_btn {
		position: absolute;
		left: 0;
		top: 40px;
		padding: 0;
		background-color: #fff;
	}

	.new_shop_group .shop_group_list {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		white-space: nowrap;
		overflow-x: scroll;
	}

	.new_shop_group .shop_group_select {
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		color: #333;
		padding-left: 5px;
	}

	.new_shop_group .shop_group_sort {
		width: 40px;
	}

	.new_shop_group .shop_group_sort>img {
		width: 14px;
		height: 14px;
		margin: 13px;
	}

	.new_shop_group .shop_group_sort.rotate>img {
		transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		/* IE 9 */
		-webkit-transform: rotate(180deg);
		/* Safari and Chrome */
	}

	.new_shop_group .shop_group_list::-webkit-scrollbar {
		display: none;
	}

	.new_shop_group .shop_group_list li {
		padding: 0 5px;
		box-sizing: border-box;
		text-align: center;
		font-size: 0;
		color: #333;
	}

	.new_shop_group .shop_group_list li>span {
		display: inline-block;
		position: relative;
		font-size: 15px;
		line-height: 1;
		padding: 14px 5px 5px;
		font-weight: 600;
	}

	.new_shop_group .shop_group_list li div {
		position: relative;
	}

	.new_shop_group .vice_back {
		position: absolute;
		background: #FF0036;
	}

	.new_shop_group .goods_super {
		display: flex;
		overflow: hidden;
	}

	.new_shop_group .shop_group_list li div span {
		color: #999;
		font-size: 11.5px;
		width: 59px;
		height: 18px;
		border-radius: 10px;
		padding: 0 3px;
	}

	.new_shop_group .shop_group_list li div span.active {
		font-size: 12px;
	}

	.new_shop_group .shop_group_list li .line {
		width: 15px;
		height: 3px;
		margin: 0 auto;
	}

	.new_shop_group .shop_group_data {
		padding: 15px 15px 0;
	}

	.new_shop_group .shop_group_data>li {
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

	.new_shop_group .shop_group_data li.active {
		background-color: #FF0036;
		color: #fff;
	}

	.new_shop_group .svod-mask {
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: .6;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 9;
	}

	/* 商品列表start */
	.new_shop_group .shop_group_content {
		box-sizing: border-box;
		min-height: 80px;
		font-size: 0;
	}

	.new_shop_group .shop_group_content::-webkit-scrollbar {
		display: none;
	}

	.new_shop_group .shop_group_content ul {
		font-size: 0;
	}

	.new_shop_group .shop_group_content .shop_group_ul_left {
		margin-right: 7px;
	}

	.new_shop_group .shop_group_content li {
		margin-bottom: 7px;
		background-color: #fff;
		overflow: hidden;
	}

	.new_shop_group .shop_group_content_bg {
		height: 192px;
		position: relative;
		margin-bottom: 5px;
		overflow: hidden;
		display: -webkit-box;
		display: -moz-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-moz-align-items: center;
		-webkit-align-items: center;
		align-items: center;
	}

	.new_shop_group .shop_group_content_bg .shop_group_img {
		height: 100%;
		align-items: center;
		justify-content: center;
		/* border-radius: 4px; */
	}

	.new_shop_group .shop_group_content_bg .shop_group_img>img {
		max-width: 100%;
		width: 100%;
		/* border-radius: 4px; */
	}

	.new_shop_group .shop_group_content_bg .shop_group_img .sold_out_img {
		width: 100%;
		position: absolute;
		left: 0;
		top: 50%;
		z-index: 3;
		transform: translateY(-50%);
		background: rgba(0, 0, 0, 0.4);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.new_shop_group .goods_content {
		padding: 0 10px 10px;
	}

	.new_shop_group .goods_name {
		font-size: 15px;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		word-break: break-all;
		line-height: 1.3;
	}

	.new_shop_group .goods_tag {
		margin-bottom: 10px;
	}

	.new_shop_group .goods_tag div {
		display: inline-block;
		border: 1px solid #FAE2E4;
		color: #FF3445;
		font-size: 12px;
		background: #FFEEF3;
		border-radius: 2px;
		padding: 0 2px;
		margin: 4px 4px 0px 0;
	}

	.new_shop_group .goods_tag p {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 14px;
		margin: 0;
	}

	.new_shop_group .goods_price {
		color: #F24F4C;
		line-height: 1;
	}

	.new_shop_group .goods_price .big {
		font-size: 12px;
		margin-right: 2px;
	}

	.new_shop_group .goods_price .big_s {
		font-size: 18px;
	}

	.new_shop_group .pro_count {
		color: #999;
		font-size: 12px;
		line-height: 1;
	}

	/* 重构组件样式end */

	.shop-modul-ul.one-list .modul-title-new {
		font-size: 17px;
		color: #333;
		margin-top: 12px;
		line-height: 1.3;
	}

	.shop-modul-ul.two-list .modul-title-new {
		font-size: 15px;
		color: #333;
		margin-top: 5px;
		line-height: 1.3;
	}

	.shop-modul-ul.three-list .modul-title-new {
		font-size: 14px;
		color: #333;
		margin-top: 5px;
		line-height: 1.3;
	}

	.shop-modul-ul.four-list .modul-title-new {
		font-size: 15px;
		color: #333;
		line-height: 1.3;
	}

	.shop-modul-ul .modul-title-new.line-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		word-break: break-all;
	}

	.shop-modul-ul .modul-title-new.line-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		word-break: break-all;
	}

	.shop-modul-ul.new.four-list {
		padding: 10px;
		background-color: #fff;
	}

	.shop-modul-ul.new.four-list .shop-modul-li {
		padding: 0;
		position: relative;
	}

	.shop-modul-ul.new.four-list .shop-modul-li.style_1 {
		padding: 5px;
		margin-bottom: 10px;
	}

	.shop-modul-ul.new.four-list .shop-modul-li.style_2 {
		padding: 10px 0;
	}

	.shop-modul-ul.new.four-list .shop-modul-li.style_2::after {
		content: " ";
		display: block;
		height: 1px;
		width: calc(100% - 128px);
		background-color: #f0f0f0;
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.shop-modul-ul.new.four-list .shop-modul-li.style_2:nth-last-child(1)::after {
		display: none;
	}

	.shop-modul-ul.new.four-list .shop-modul-li:nth-last-child(1) {
		margin-bottom: 0;
	}

	.shop-modul-ul.new.four-list .modul-img {
		border-radius: 4px;
		overflow: hidden;
		height: 120px;
	}

	.shop-modul-ul.new.four-list .modul-center {
		padding: 2px 5px 2px 0;
		min-height: 120px;
		box-sizing: border-box;
		list-style-type: none;
	}

	.shop-modul-ul .other-price {
		height: 16px;
		line-height: 1;
	}

	.shop-modul-ul .other-price .left {
		background-color: #2b2821;
		padding: 0 4px;
		font-size: 11px;
		color: #f1dfc9;
		border-top-left-radius: 3px;
		border-bottom-left-radius: 3px;
	}

	.shop-modul-ul .other-price .right {
		padding: 0 4px 1px;
		background-color: #f3d0b4;
		background-image: -webkit-gradient(linear, left top, right top, from(#fcdcc1), to(#f3d0b4));
		background-image: linear-gradient(90deg, #fcdcc1, #f3d0b4);
		border-top-right-radius: 3px;
		border-bottom-right-radius: 3px;
		color: #160f06;
		font-size: 10px;
	}

	.shop-modul-ul .other-price .right big {
		font-size: 13px;
	}

	.shop-modul-ul .other-price.one {
		margin-left: 12px;
		margin-bottom: 4px;
	}

	.shop-modul-ul .other-price.two {
		margin-top: 6px;
	}

	.shop-modul-ul.new.three-list .modul-describe {
		min-height: auto;
	}

	.margin-top-5 {
		margin-top: 5px;
	}

	.shop-modul-ul.new.two-list .modul-price-left .min-price {
		font-size: 12px;
	}

	.shop-modul-ul.new.two-list .modul-price-left .min-price span {
		font-size: 18px;
	}

	.shop-modul-ul.new .shop-modul-li:nth-last-child(1) {
		margin-bottom: 0;
	}

	.shop-modul-ul.new.two-list .bottom_0:nth-last-child(2) {
		margin-bottom: 0;
	}

	.shop-modul-ul.new.three-list .bottom_0:nth-last-child(2) {
		margin-bottom: 0;
	}

	.shop-modul-ul.new.three-list .bottom_0:nth-last-child(3) {
		margin-bottom: 0;
	}

	.shop-modul-ul.new.three-list .bottom_2:nth-last-child(2) {
		margin-bottom: 0;
	}

	.shop-modul-ul.new.four-list .modul-label li {
		margin-bottom: 2px;
	}

	/*flex兼容写法start*/

	/* 定义 */
	.flex-def {
		display: -webkit-flex;
		display: flex;
		list-style-type: none;
		padding-left: 0px;
	}

	/* 主轴居中 */
	.flex-zCenter {
		-webkit-justify-content: center;
		justify-content: center;
	}

	/* 主轴居中 */
	.flex-zAround {
		-webkit-justify-content: space-around;
		justify-content: space-around;
	}

	/* 主轴两端对齐 */
	.flex-zBetween {
		-webkit-justify-content: space-between;
		justify-content: space-between;
	}

	/* 主轴end对齐 */
	.flex-zEnd {
		-webkit-justify-content: flex-end;
		justify-content: flex-end;
	}

	/* 主轴start对齐 */
	.flex-zStart {
		-webkit-justify-content: start;
		justify-content: start;
	}

	/* 侧轴居中 */
	.flex-cCenter {
		-webkit-align-items: center;
		align-items: center;
	}

	/* 侧轴start对齐 */
	.flex-cStart {
		-webkit-align-items: start;
		align-items: start;
	}

	/* 侧轴底部对齐 */
	.flex-cEnd {
		-webkit-align-items: flex-end;
		align-items: flex-end;
	}

	/* 侧轴头部对齐 */
	.flex-ctopEnd {
		-webkit-align-items: end;
		align-items: end;
	}

	/* 侧轴文本基线对齐 */
	.flex-cBaseline {
		-webkit-align-items: baseline;
		align-items: baseline;
	}

	/* 侧轴上下对齐并铺满 */
	.flex-cStretch {
		-webkit-align-items: stretch;
		align-items: stretch;
	}

	/* 主轴从上到下 */
	.flex-zTopBottom {
		-webkit-flex-direction: column;
		flex-direction: column;
	}

	/* 主轴从下到上 */
	.flex-zBottomTop {
		-webkit-flex-direction: column-reverse;
		flex-direction: column-reverse;
	}

	/* 主轴从左到右 */
	.flex-zLeftRight {
		-webkit-flex-direction: row;
		flex-direction: row;
	}

	/* 主轴从右到左 */
	.flex-zRightLeft {
		-webkit-flex-direction: row-reverse;
		flex-direction: row-reverse;
	}

	/* 是否允许子元素伸缩 */
	.flex-item {
		-webkit-flex-grow: 1;
		flex-grow: 1;
	}

	/*子元素换行*/
	.flex-wrap {
		-moz-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	/* 子元素的显示次序 */
	.flex-order {
		-webkit-order: 1;
		order: 1;
	}

	/*元素比例*/
	.flex-one {
		-webkit-flex: 1;
		flex: 1;
	}

	/*flex兼容写法end*/
</style>