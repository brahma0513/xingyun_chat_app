<template>
	<view
		:style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding: '+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;'"
		style="background-size: cover;background-position: center center;overflow: hidden;">
		<view class="shop-component">
			<view v-if="datas.content.head_show" class="shop-component-head flex-def flex-cCenter">
				<view class="head-left flex-one flex-def flex-cCenter">
					<view class="img-box" v-if="datas.content.head_icon_show==1">
						<image class="img" :src="datas.content.head_icon_url" mode="aspectFill"></image>
					</view>
					<view class="title">{{datas.content.head_title}}</view>
				</view>
				<view
					v-if="datas.content.view_more_show == 1 || datas.content.view_more_arrow_show == 1"
					class="head-right flex-def flex-cCenter"
					@click="shop_go_shop_list">
					<text v-if="datas.content.view_more_show==1" class="text" :style="'color: '+datas.content.view_more_color+';'">查看更多</text>
					<view v-if="datas.content.view_more_arrow_show==1" class="fa-angle-down" :style="'border-color: '+datas.content.view_more_arrow_color+';'"></view>
				</view>
			</view>
			<scroll-view
				v-if="datas.content.select_style==1"
				class="shop-component-ul-one"
				scroll-x="true"
				@scrolltolower="shop_component_ulload_more">
				<view
					v-for="(item1, index1) in supply_list"
					:key="index1"
					class="shop-component-li"
					:style="'border-radius:'+datas.content.radius_diy+'px;'">
					<view class="component-li-head flex-def flex-cStart" @click="go_shop_info(item1.selector_id)">
						<view class="img-box">
							<image class="img" :src="item1.pic" mode="aspectFill"></image>
						</view>
						<view class="info flex-one">
							<view class="title">{{item1.select_value}}</view>
						</view>
						<view class="label" v-if="item1.select_label">{{item1.select_label}}</view>
					</view>
					<scroll-view class="list-ul" scroll-x="true" @scrolltolower="shop_component_ulload_more">
						<view
							v-for="(itm, ind) in (item1.product || [])"
							:key="ind"
							class="list-li"
							@click="go_goods_detail(itm.pro_id)">
							<view class="img-box">
								<image class="img" :src="itm.url" mode="aspectFill"></image>
							</view>
							<view class="title">{{itm.pro_name}}</view>
							<view class="price">
								<text class="small">¥</text>{{itm.now_price}}
							</view>
						</view>
						<view class="no-list flex-one flex-def flex-zTopBottom flex-cCenter" v-if="!(item1.product && item1.product.length)">
							<image class="img" :src="http_host+'/shop/mshop/web/static/images/style_no_data.png'" mode="widthFix"></image>
							<view class="hint">更多商品准备上架中，敬请期待～</view>
						</view>
					</scroll-view>
				</view>
			</scroll-view>
			<view class="shop-component-ul-two" v-if="datas.content.select_style==2">
				<view
					v-for="(item1, index1) in supply_list"
					:key="index1"
					class="shop-component-li"
					:style="'border-radius:'+datas.content.radius_diy+'px;'">
					<view class="component-li-head flex-def flex-cStart" @click="go_shop_info(item1.selector_id)">
						<view class="img-box">
							<image class="img" :src="item1.pic" mode="aspectFill"></image>
						</view>
						<view class="info flex-one">
							<view class="title">{{item1.select_value}}</view>
						</view>
						<view class="label" v-if="item1.select_label">{{item1.select_label}}</view>
					</view>
					<view class="list-ul">
						<view
							v-for="(itm, ind) in (item1.product || [])"
							:key="ind"
							class="list-li"
							@click="go_goods_detail(itm.pro_id)">
							<view class="img-box">
								<image class="img" :src="itm.url" mode="aspectFill"></image>
							</view>
							<view class="title">{{itm.pro_name}}</view>
							<view class="price">
								<text class="small">¥</text>{{itm.now_price}}
							</view>
						</view>
						<view class="no-list flex-one flex-def flex-zTopBottom flex-cCenter" v-if="!(item1.product && item1.product.length)">
							<image class="img" :src="http_host+'/shop/mshop/web/static/images/style_no_data.png'" mode="widthFix"></image>
							<view class="hint">更多商品准备上架中，敬请期待～</view>
						</view>
					</view>
				</view>
				<view
					class="list-load-more flex-def flex-cCenter flex-zCenter"
					v-if="page < page_count && datas.content.addition_method == 2 && supply_list && supply_list.length>0"
					@click="shop_info_pro_load_more">
					加载更多
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'shopComponent',
		props: {
			datas: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				http_host: this.vuex_apiUrl,
				supply_list: [],
				is_loading: false,
				page: 1,
				page_count: 1
			};
		},
		created() {
			this.page = this.datas.content.page || 1;
			this.page_count = this.datas.content.page_count || 1;
			this.get_shop_info_pro();
		},
		methods: {
			get_shop_info_pro() {
				const item = this.datas;
				if (this.is_loading) {
					return;
				}
				this.is_loading = true;
				const page = this.page || 1;
				const supply_ids = (item.content.dataset || []).map((row) => row.selector_id).filter((id) => id !== '' && id != null);
				let supply_id = supply_ids.join(',');
				if (item.content.addition_method == 2) {
					supply_id = -1;
				} else if (!supply_id) {
					this.is_loading = false;
					this.supply_list = item.content.dataset || [];
					return;
				}
				const old_data = {};
				for (const v of (item.content.dataset || [])) {
					if (v.selector_id) {
						old_data[v.selector_id] = v;
					}
				}
                this.$common.requestData({
                    url: '/uniapp_template/web/index.php?m=supply&a=get_shop_info_pro&xdebug=xdebug',
					data: {
						customer_id_en: this.vuex_customer_id_en,
						supply_id: supply_id,
						page: page
					},
					method: 'GET',
					needToken: true
				}).then(res => {
					this.is_loading = false;
					if (res.errcode != 0) {
						return;
					}
					const page_count = (res.data && res.data.page_count) || 1;
					if (!res.data || !res.data.list || res.data.list.length == 0) {
						if (page == 1 && item.content.addition_method == 2) {
							item.content.dataset = [];
						}
						this.page = page;
						this.page_count = page_count;
						this.supply_list = item.content.dataset || [];
						return;
					}
					for (let i = 0; i < res.data.list.length; i++) {
						const row = res.data.list[i];
						row.select_value = row.supply_name;
						row.select_label = row.shop_type;
						row.selector_id = row.id;
						if (!old_data[row.id] || !old_data[row.id].pic || String(old_data[row.id].pic).includes('default_img')) {
							row.pic = row.logo;
						} else {
							row.pic = old_data[row.id].pic;
						}
					}
					if (page == 1) {
						item.content.dataset = res.data.list;
					} else {
						item.content.dataset = [...this.supply_list, ...res.data.list];
					}
					this.page = page;
					this.page_count = page_count;
					this.supply_list = item.content.dataset;
				}).catch(() => {
					this.is_loading = false;
				});
			},
			shop_info_pro_load_more() {
				if (this.is_loading) {
					return;
				}
				if (this.page <= this.page_count) {
					this.page++;
					this.get_shop_info_pro();
				}
			},
			shop_component_ulload_more() {
				this.shop_info_pro_load_more();
			},
			go_goods_detail(pro_id) {
				if (!pro_id) {
					return;
				}
				const url = '/shop/mshop/web/index.php?m=product&a=product_detail&pro_id=' + pro_id + '&customer_id=' + this.vuex_customer_id;
				this.$common.diyLinkJump(url, 'h5', true);
			},
			go_shop_info(supply_id) {
				if (!supply_id) {
					return;
				}
				const url = '/shop/supply/web/index.php?m=supply&a=shop_index&supply_id=' + supply_id + '&customer_id=' + this.vuex_customer_id;
				this.$common.diyLinkJump(url, 'h5', true);
			},
			shop_go_shop_list() {
				const url = '/shop/supply/web/index.php?m=supply&a=shop_info_pro&customer_id=' + this.vuex_customer_id;
				this.$common.diyLinkJump(url, 'h5', true);
			}
		}
	}
</script>

<style scoped>
	.shop-component .shop-component-head {
		height: 47px;
		line-height: 1;
	}
	.shop-component .shop-component-head .head-left .img-box {
		width: 20px;
		height: 20px;
		font-size: 0;
		margin-right: 4px;
	}
	.shop-component .shop-component-head .head-left .img-box .img {
		display: block;
		width: 100%;
		height: 100%;
	}
	.shop-component .shop-component-head .head-left .title {
		font-size: 15px;
		color: #333;
	}
	.shop-component .shop-component-head .head-right {
		font-size: 12px;
	}
	.shop-component .shop-component-head .head-right .fa-angle-down {
		width: 8px;
		height: 8px;
		margin-left: 3px;
		border-top: 2px solid #b2b2b2;
		border-right: 2px solid #b2b2b2;
		transform: rotate(45deg);
	}
	.shop-component-ul-one {
		white-space: nowrap;
	}
	.shop-component-ul-one .shop-component-li {
		width: 328px;
		height: 188px;
		margin-right: 10px;
		display: inline-block;
		vertical-align: top;
	}
	.shop-component-li {
		padding: 10px;
		box-sizing: border-box;
		background-color: #fff;
		background-image: linear-gradient(to bottom, rgba(0, 123, 255, .08), rgba(255, 255, 255, 0.08), #fff);
	}
	.shop-component-li .component-li-head {
		margin-bottom: 8px;
		position: relative;
	}
	.shop-component-li .component-li-head .img-box {
		width: 46px;
		height: 46px;
		margin-right: 8px;
		font-size: 0;
		overflow: hidden;
		border-radius: 5px;
		flex-shrink: 0;
	}
	.shop-component-li .component-li-head .img-box .img {
		display: block;
		width: 100%;
		height: 100%;
	}
	.shop-component-li .component-li-head .info {
		max-width: 50%;
	}
	.shop-component-li .component-li-head .info .title {
		font-size: 15px;
		color: #333;
		margin-bottom: 7.5px;
		line-height: 1.3;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.shop-component-li .component-li-head .label {
		position: absolute;
		top: 0;
		right: 0;
		border: 0.5px solid #007BFF;
		border-radius: 3px;
		line-height: 1;
		padding: 1.5px 4px;
		box-sizing: border-box;
		font-size: 10px;
		color: #007BFF;
		max-width: calc(50% - 70px);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.shop-component-li .list-ul {
		white-space: nowrap;
	}
	.shop-component-li .list-ul .list-li {
		width: 78px;
		height: 114px;
		margin-right: 6px;
		display: inline-block;
		vertical-align: top;
	}
	.shop-component-li .list-li .img-box {
		width: 78px;
		height: 78px;
		font-size: 0;
		border-radius: 6px;
		overflow: hidden;
		margin-bottom: 4px;
	}
	.shop-component-li .list-li .img-box .img {
		display: block;
		width: 100%;
		height: 100%;
	}
	.shop-component-li .list-li .title {
		font-size: 12px;
		color: #333;
		line-height: 1.3;
		margin-bottom: 2px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.shop-component-li .list-li .price {
		font-size: 12px;
		color: #FF4B10;
		line-height: 1;
		font-weight: 600;
	}
	.shop-component-li .list-li .price .small {
		font-weight: 500;
		font-size: 10px;
	}
	.shop-component-li .list-ul .no-list {
		font-size: 0;
		height: 114px;
		display: inline-block;
		vertical-align: top;
	}
	.shop-component-li .list-ul .no-list .img {
		width: 117px;
		height: 79px;
	}
	.shop-component-li .list-ul .no-list .hint {
		font-size: 12px;
		color: #C7CAD5;
		line-height: 1;
	}
	.shop-component-ul-two .shop-component-li {
		margin-bottom: 10px;
	}
	.shop-component-ul-two .list-load-more {
		height: 38px;
		background-color: #fff;
		border-radius: 8px;
		font-size: 13px;
		color: #B0B0B0;
	}
	.flex-def {
		display: flex;
	}
	.flex-one {
		flex: 1;
	}
	.flex-cCenter {
		align-items: center;
	}
	.flex-cStart {
		align-items: flex-start;
	}
	.flex-zCenter {
		justify-content: center;
	}
	.flex-zTopBottom {
		flex-direction: column;
	}
</style>
