<template>
	<view v-if="product_list && product_list.length > 0" :style="'padding: '+datas.content.padding+'px 0;'" v-cloak>
		<view class="custom-integral-shop">
			<block v-for="(it,idx) in product_list"
				v-if="idx <= datas.content.show_num && datas.content.css_type == 2">
				<view hover-class="no-hover" :class="'custom-integral-shop-item type'+datas.content.css_type"
					>
					<view class="integral-shop-img-wrap" @click="$common.diyLinkJump('/red_green_integral/web/index.php?m=product&a=pro_detail&id='+it.id)">
						<image :src="it.url"></image>
					</view>
					<view>
						<p :class="'integral-shop-name1 line'+datas.content.title_line" v-if="datas.content.show_name">
							{{it.pro_name}}
						</p>
						<view>
							<span class="price1"
								v-if="it.act_price>0"><big>{{it.act_price}}</big>元</span>
							<span class="price1" v-else><big>{{it.integral}}</big>{{integral_name}}</span>
							<view>
								<span class="sell-count1">{{monetary_unit}}{{it.orgin_price}}</span>
								<span class="sell-count2" v-if="datas.content.show_count">已售{{it.sale}}</span>
							</view>
						</view>
					</view>
				</view>
			</block>
			<view :class="'custom-integral-shop-item type'+datas.content.css_type"
				v-if="datas.content.css_type == 1">
				<view class="integral-shop-img-wrap"
					@click="$common.diyLinkJump('/red_green_integral/web/index.php?m=product&a=pro_detail&id='+product_list[0].id)">
					<image :src="product_list[0].url"></image>
				</view>
				<view>
					<p :class="'integral-shop-name1 title1 line'+datas.content.title_line"
						v-if="datas.content.show_name">{{product_list[0].pro_name}}</p>
					<view class="flex1">
						<view class="flex2">
							<span class="price1"
								v-if="product_list[0].act_price>0"><big>{{product_list[0].act_price}}</big>元</span>
							<span class="price1"
								v-else><big>{{product_list[0].integral}}</big>{{integral_name}}</span>
							<span class="sell-count1"
								style="margin-top:0;margin-left:10px">{{monetary_unit}}{{product_list[0].orgin_price}}</span>
						</view>
						<span :class="'btn skin-bg-'+theme"
							@click="integral_shop_buy(product_list[0].id,product_list[0].cheap_proids)">立即购买</span>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "redGreenIntegralShop",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				product_list: [],
				integral_name: '',
				price_color: getApp().globalData.price_color,
				monetary_unit: getApp().globalData.monetary_unit,
				
				
				all_list: [],	//总数组
				last_key: 0,	//上次加载位置
				page_size: 20,	//每页多少数据
				total_count: 0,	//总数据
				can_load: false,	//是否可以加载 防止并发
			};
		},
		created() {
			var _this = this;
			_this.productSelect()
		},
		
		mounted() {
			let that = this;
			uni.$on('onReachBottom', () => {
				var key = that.last_key;
				var product_list = that.product_list;
				if(that.can_load==true&&that.last_key<that.total_count){
					that.can_load=false;
					for(var i=0; i<=that.page_size;i++){
						if(i<that.page_size&&that.last_key<that.total_count){
							product_list.push(that.all_list[that.last_key])
							that.last_key = parseInt(that.last_key)+1;
						}
						if(i+1==that.page_size){
							that.product_list = product_list
							that.can_load = true
						}
						
					}
				}
				
			})
		},
		
		methods: {
			/**
			 * 获取分类产品内容 
			 */
			productSelect: function() {
				const _this = this;
				var params = {
					'page[page]': 1,
					'page[page_size]': _this.datas.content.show_num,
					'order[sort]':'desc',
				};
				if (_this.datas.content.css_type == 2 && _this.datas.content.shop_type == 1) {
					params['search[act_id]'] = _this.datas.content.activity_id
				} else {
					params['search[id][]'] = _this.datas.content.selector_id.split(',')
				}
				this.can_load=false;
				this.last_key = 0;
				var product_list = this.product_list;
				_this.$common.requestData({
					url: '/red_green_integral/web/index.php?m=product&a=get_pro_list',
					data: params,
					method: "POST", 
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						// _this.product_list = res.data,
						
						_this.all_list = res.data.pro						
						_this.total_count = res.data.pro.length;
						_this.integral_name = res.data.config ? res.data.config.diy_integral_name : "积分"
						
						
						//加载第一页数据
						_this.can_load = false;
						for(var i=0; i<_this.page_size;i++){
							if(i<_this.page_size&&_this.last_key<_this.total_count){
								product_list.push(_this.all_list[_this.last_key])
								_this.last_key = parseInt(_this.last_key)+1;
							}
							if(i+1==_this.page_size){
								_this.product_list = product_list
								_this.can_load = true
							}
						}
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
				
				that.$common.requestData({
					url: '/red_green_integral/web/index.php?m=order_create&a=submit_order',
					data: params,
					method: "POST", 
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						that.$common.diyLinkJump('/red_green_integral/web/index.php?m=order_create&a=order_confirm&customer_id='+that.vuex_customer_id_en+'&order_id'+res.order_id)
					} else {
						console.log('请求失败')
					}
				})
			}
		}
	}
</script>

<style>
	.custom-integral-shop {
		width: 100%;
		background: #fff;
		box-sizing: border-box;
		padding: 0 15px;
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
		border-radius: 4px;
		overflow: hidden;
	}

	.custom-integral-shop .custom-integral-shop-item image {
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
</style>
