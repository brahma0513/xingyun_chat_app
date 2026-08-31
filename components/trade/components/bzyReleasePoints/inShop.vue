<template>
	<view v-if="product_list.length > 0" :style="'padding:'+ datas.content.padding+'px 0;'">
		<view class="custom-bzy-release-points">
			<block v-for="(it,idx) in product_list" v-if="idx <= datas.content.show_num && datas.content.css_type == 2">
				<navigator hover-class="no-hover" :class="'custom-bzy-release-points-item type'+datas.content.css_type"
					@click="toUrl(it.id)">
					<view class="bzy-release-points-img-wrap">
						<image :src="it.url"></image>
					</view>
					<view>
						<p :class="'bzy-release-points-name1 line '+datas.content.title_line"
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
				</navigator>
			</block>

			<navigator hover-class="no-hover" :class="'custom-bzy-release-points-item type'+datas.content.css_type"
				v-if="datas.content.css_type == 1" @click="toUrl(product_list[0].id)">
				<view class="bzy-release-points-img-wrap">
					<image :src="product_list[0].url"></image>
				</view>
				<view>
					<p :class="'bzy-release-points-name1 title1 line'+datas.content.title_line"
						v-if="datas.content.show_name">{{product_list[0].pro_name}}</p>
					<view class="flex1">
						<view class="flex2">
							<span class="price1"
								v-if="product_list[0].act_price>0">
								<!-- <big>{{product_list[0].integral}}</big>{{integral_name}}+ -->
								<big>{{product_list[0].act_price}}</big>元</span>
							<span class="price1" v-else><big>{{product_list[0].integral}}</big>{{integral_name}}</span>
							<span class="sell-count1"
								style="margin-top:0;margin-left:10px">{{monetary_unit}}{{product_list[0].orgin_price}}</span>
						</view>
						<span :class="'btn skin-bg-'+theme"
							@click.stop="integral_shop_buy(product_list[0].id,product_list[0].cheap_proids)">立即购买</span>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		name: "inShop",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				product_list: [],
				integral_name: '',
			}
		},
		created() {
			const _this = this;
			// 不用缓存，获取到user_id之后再调接口获取数据 
			var i = 0
			var time = setInterval(() => {

				if (this.vuex_user.user_id > 0) {
					_this.productSelect();
					clearInterval(time)
				}
				if (i >= 25) {
					_this.productSelect();
					clearInterval(time)
				}
				i++
			}, 200)
		},
		mounted() {
			this.setGlobalTheme();
			this.handleProductImg();

			// 延迟再次赋值
			setTimeout(() => {
				this.setGlobalTheme();
			}, 1000);
		},
		methods: {
			// 设置主题
			setGlobalTheme() {
				this.theme = getApp().globalData.style_color;
				this.price_color = getApp().globalData.price_color;
				this.monetary_unit = getApp().globalData.monetary_unit;
			},

			// 处理图片路径
			handleProductImg() {
				if (!this.datas?.content?.dataset) return;

				let product_list = JSON.parse(JSON.stringify(this.datas.content.dataset));
				const reg = /^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/;

				product_list.forEach(item => {
					if (!reg.test(item.img)) {
						if (item.img.includes('..')) {
							item.img = getApp().globalData.http_host + item.img.replace(/\.\./g, "");
						} else {
							item.img = getApp().globalData.http_host + '/resources/' + item.img;
						}
					}
				});

				this.product_list = product_list;
			},

			// 获取商品列表
			productSelect() {
				var that = this;
				const content = this.datas.content || {};
				let page_size = content.show_num || 10;
				let search = {};

				if (content.css_type == 2 && content.shop_type == 1) {
					search = {
						act_id: content.activity_id
					};
				} else {
					search = {
						id: (content.selector_id || '').split(',')
					};
				}

				// 构造和图一完全一致的扁平参数对象
				let postData = {
					'page[page]': 1,
					'page[page_size]': page_size,
					'order[sort]': 'desc'
				};

				// 处理 search 部分，兼容 act_id 或 id 数组
				if (search.act_id) {
					postData['search[act_id]'] = search.act_id;
				} else if (search.id) {
					search.id.forEach((val, index) => {
						postData[`search[id][${index}]`] = val;
					});
				}

				that.$common.requestData({
					url: '/bzy_release_points/web/index.php?m=product&a=get_pro_list',
					data: postData,
					method: 'POST',
					needToken: true,
				}).then(res => {
					console.log(res);
					if (res.errcode == 0) {
						that.product_list = res.data.pro || [];
						that.integral_name = res.data.config?.diy_integral_name || '';
					}
				})
			},

			// 立即购买
			integral_shop_buy(id, cheap_proids) {
				var that = this;
				// 构造和图中完全一致的表单参数
				let postData = {
					'pro[0][id]': id,
					'pro[0][proids]': cheap_proids,
					'pro[0][pro_num]': 1
				};

				that.$common.requestData({
					url: '/bzy_release_points/web/index.php?m=order_create&a=submit_order',
					data: postData,
					method: 'POST',
					needToken: true,
				}).then(res => {
					console.log('submit_order res:', res);
					if (res.errcode == 0) {
						var url =
							`/bzy_release_points/web/index.php?m=order_create&a=order_confirm&order_id=`+res.order_id;
						that.$common.diyLinkJump(url, "h5", true);
					} else if (res.errcode == 499) {
						that.$common.diyLinkJump(res.data, "h5", true);
					} else if (res.errcode == 43000) {
						that.$common.diyLinkJump(res.must_jump_url, "h5", true);
					} else {
						uni.showToast({
							title: res.errmsg,
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			toUrl(id) {
				// var url = `/bzy_release_points/pages/product/proDetail/proDetail?id=` + id;
				var url = `/bzy_release_points/web/index.php?m=product&a=pro_detail&id=` + id
				this.$common.diyLinkJump(url, "h5", true);
			}
		}
	}
</script>

<style scoped>
	.custom-bzy-release-points {
		width: 100%;
		background: #fff;
		box-sizing: border-box;
		padding: 0 15px;
	}

	.custom-bzy-release-points .type1 .bzy-release-points-img-wrap {
		width: 100%;
		height: 175px;
		position: relative;
		border-radius: 4px;
		overflow: hidden;
	}

	.custom-bzy-release-points .bzy-release-points-img-wrap {
		width: 100%;
		position: relative;
		border-radius: 4px;
		overflow: hidden;
	}

	.custom-bzy-release-points .custom-bzy-release-points-item image {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		object-fit: cover;
	}

	.custom-bzy-release-points .bzy-release-points-img-wrap:after {
		position: relative;
		content: '';
		display: block;
		padding-bottom: 75%;
	}

	.custom-bzy-release-points .type2 .bzy-release-points-img-wrap:after {
		padding-bottom: 100%;
	}

	.custom-bzy-release-points .custom-bzy-release-points-item.type2 {
		width: calc(50% - 7.5px);
		display: inline-block;
		padding: 15px 0;
	}

	.custom-bzy-release-points .custom-bzy-release-points-item.type2:nth-child(2n) {
		margin-left: 15px;
	}

	.custom-bzy-release-points .custom-bzy-release-points-item.type2 p.bzy-release-points-name {
		margin-bottom: 3px;
	}

	.custom-bzy-release-points .custom-bzy-release-points-item.type1 {
		padding: 15px 0;
		display: block
	}

	.custom-bzy-release-points p.bzy-release-points-name1 {
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

	.custom-bzy-release-points p.bzy-release-points-name1.title1 {
		height: 38px
	}

	.custom-bzy-release-points .price1 {
		color: #333333;
		font-size: 12px;
		display: inline-block;
		line-height: 24px;
	}

	.custom-bzy-release-points .price1.t2 {
		color: #333333;
		font-size: 12px;
		line-height: 1;
		display: inline-block;
		float: left;
	}

	.custom-bzy-release-points .price1 big {
		font-size: 15px;
		color: #f24f4c;
		font-weight: 600
	}

	.custom-bzy-release-points span.sell-count1 {
		float: left;
		font-size: 12px;
		color: #999;
		text-decoration: line-through
	}

	.custom-bzy-release-points span.sell-count1.t2 {
		float: left;
		font-size: 12px;
		color: #999;
		line-height: 1;
		text-decoration: line-through
	}

	.custom-bzy-release-points span.sell-count2 {
		float: right;
		font-size: 12px;
		color: #999;
	}

	.custom-bzy-release-points .integral-price .jifen {
		font-size: 12px;
	}

	.custom-bzy-release-points span.btn {
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