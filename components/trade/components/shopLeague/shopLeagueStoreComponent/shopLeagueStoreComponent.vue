<template>
	<view :style="'padding:'+datas.content.padding_top+'px 0 '+datas.content.padding_bottom+'px;'">
		<view class="trade100366-title-box flex-def flex-cCenter flex-zBetween">
			<view class="flex-def flex-cCenter">
				<view v-if="datas.content.component_icon_type==2" class="trade100366-icon">
					<image :src="datas.content.component_icon" mode="aspectFill"></image>
				</view>
				<view
					class="trade100366-title"
					:style="'font-size:'+datas.content.component_title_font_size+'px;font-weight:'+(datas.content.component_title_css==1?'normal':'bold')+';color:'+datas.content.component_title_color">
					{{datas.content.component_title}}
				</view>
			</view>
			<view class="flex-def flex-cCenter" @click="goMoreStore">
				<view v-if="datas.content.more" class="trade100366-more-title" :style="'color:'+datas.content.more_color">查看更多</view>
				<text v-if="datas.content.arrow" class="trade100366-arrow" :style="'color:'+datas.content.arrow_color">›</text>
			</view>
		</view>
		<scroll-view
			class="trade100366-dataset-box"
			scroll-x="true"
			@scrolltolower="handleScrollStore">
			<view
				v-for="(itm, inds) in storeList"
				:key="inds"
				:class="datas.content.store_type==1?'trade100366-store-box1':'trade100366-store-box2'">
				<view class="flex-def" @click="goStoreDetail(itm.id)">
					<view class="trade100366-store-img">
						<image
							:src="storeImg(itm)"
							mode="aspectFill"></image>
					</view>
					<view class="flex-one">
						<view class="flex-def flex-zBetween flex-cCenter store-head-row">
							<view class="trade100366-store-title">{{itm.title}}</view>
							<view class="trade100366-store-type-name">{{storeTypeName(itm)}}</view>
						</view>
						<view class="flex-def flex-zBetween flex-cCenter">
							<view class="flex-def flex-cCenter">
								<view class="trade100366-store-score flex-def flex-cCenter">
									<image class="score-icon" :src="http_host+'/shop_league/web/static/images/icon_collect2.png'" mode="aspectFill"></image>
									<text>{{itm.score}}分</text>
								</view>
								<view class="trade100366-store-month-sale">月售{{itm.month_sale_num}}</view>
							</view>
							<view class="trade100366-store-distance">{{itm.distance}}</view>
						</view>
						<view class="flex-def flex-cCenter label-row" v-if="datas.content.label_type==2 && itm.labels && itm.labels.length">
							<view
								v-for="(labelItm, labelInds) in itm.labels"
								:key="labelInds"
								v-if="labelItm"
								:class="labelInds==0?'trade100366-store-labels1':'trade100366-store-labels2'">
								{{labelItm}}
							</view>
						</view>
					</view>
				</view>
				<scroll-view class="trade100366-product-box" scroll-x="true" @scrolltolower="handleScrollPro(itm)">
					<view
						class="trade100366-product-box-li"
						v-for="(proitm, proinds) in (itm.product_list || [])"
						:key="proinds"
						@click.stop="goProductDetail(itm, proitm)">
						<view class="trade100366-product-box-li-img">
							<image :src="productImg(proitm)" mode="aspectFill"></image>
						</view>
						<view class="trade100366-product-box-li-name">{{proitm.name}}</view>
						<view class="trade100366-product-box-li-price">
							<text class="price-unit">￥</text>{{priceFirst(proitm.price)}}<text class="trade100366-product-box-li-secondPrice">{{priceSecond(proitm.price)}}</text>
						</view>
					</view>
					<view v-if="!(itm.product_list && itm.product_list.length)" class="empty-product flex-def flex-cCenter flex-zCenter">
						更多商品上架中，敬请期待~
					</view>
				</scroll-view>
			</view>
			<view
				v-if="storeList.length<=0"
				:class="datas.content.store_type==1?'trade100366-store-box1':'trade100366-store-box2'">
				<view class="empty-store flex-def flex-cCenter flex-zCenter">
					<view class="flex-def flex-cCenter flex-zTopBottom">
						<image class="empty-img" :src="http_host+'/shop_league/web/static/images/jump_link.png'" mode="aspectFit"></image>
						<view class="empty-text">更多商家入驻中，敬请期待~</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'shopLeagueStoreComponent',
		props: {
			datas: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				http_host: '',
				isLoading: false,
				shopLeagueCity: null
			};
		},
		computed: {
			storeList() {
				return this.datas.content.dataset || [];
			}
		},
		created() {
			this.http_host = this.vuex_apiUrl;
			if (typeof this.datas.content.store_page_size !== 'number') {
				this.$set(this.datas.content, 'store_page_size', 1);
			}
			if (typeof this.datas.content.isLoading === 'undefined') {
				this.$set(this.datas.content, 'isLoading', false);
			}
			if (!Array.isArray(this.datas.content.dataset)) {
				this.$set(this.datas.content, 'dataset', []);
			}
			this.initLocationAndLoad();
		},
		methods: {
			storeImg(itm) {
				if (itm.store_intro_img && itm.store_intro_img[0]) {
					return itm.store_intro_img[0];
				}
				return this.http_host + '/shop_league/common/vendor/index/images/common_trade100366_store.png';
			},
			productImg(proitm) {
				return proitm.img || (this.http_host + '/shop_league/common/vendor/index/images/common_trade100366_shop.png');
			},
			storeTypeName(itm) {
				return this.datas.content.store_classification == 1 ? itm.type_name_one : itm.type_name_two;
			},
			priceFirst(price) {
				return this.$common.toPrice(price, true);
			},
			priceSecond(price) {
				return this.$common.toPrice(price, false);
			},
			initLocationAndLoad() {
				const position = uni.getStorageSync('shop_league_position');
				if (position && position.lat && position.lng) {
					this.loadStoreList();
					return;
				}
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						const pos = { lat: res.latitude, lng: res.longitude };
						uni.setStorageSync('shop_league_position', pos);
						this.loadStoreList();
					},
					fail: () => {
						this.loadStoreList();
					}
				});
			},
			getCityInfo(callback) {
				const cached = uni.getStorageSync('shop_league_city');
				if (cached) {
					try {
						this.shopLeagueCity = typeof cached === 'string' ? JSON.parse(cached) : cached;
						callback();
						return;
					} catch (e) {}
				}
				const position = uni.getStorageSync('shop_league_position') || {};
				this.$common.requestData({
					url: '/wsy_pub/web/index.php?m=lbs&a=get_location',
					data: {
						type: 'mini_program',
						lat: position.lat || '',
						lng: position.lng || ''
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0 && res.result) {
						this.shopLeagueCity = res.result;
						uni.setStorageSync('shop_league_city', JSON.stringify(res.result));
					}
					callback();
				}).catch(() => {
					callback();
				});
			},
			loadStoreList() {
				if (this.isLoading) {
					return;
				}
				this.isLoading = true;
				this.getCityInfo(() => {
					const position = uni.getStorageSync('shop_league_position') || {};
					const city = this.shopLeagueCity || {};
					const page = this.datas.content.store_page_size || 1;
					this.$common.requestData({
						url: '/shop_league/web/index.php?m=component&a=get_store_component_data',
						data: {
							page: page,
							page_size: 10,
							sort_type: this.datas.content.store_type,
							product_type: this.datas.content.shop_type,
							scope: this.datas.content.range_type,
							latitude: position.lat || '',
							longitude: position.lng || '',
							province_name: city.province || '',
							city_name: city.city || '',
							area_name: city.district || '',
							street_name: city.town || ''
						},
						method: 'POST',
						needToken: true
					}).then(res => {
						this.isLoading = false;
						this.datas.content.isLoading = true;
						const list = (res.data || []).map(row => {
							if (typeof row.pro_page_size !== 'number') {
								row.pro_page_size = 2;
							}
							if (typeof row.proisLoading === 'undefined') {
								row.proisLoading = true;
							}
							if (!Array.isArray(row.product_list)) {
								row.product_list = row.product_list || [];
							}
							return row;
						});
						if (page == 1) {
							this.datas.content.dataset = list;
						} else if (list.length) {
							const merged = [...this.datas.content.dataset, ...list];
							const map = new Map();
							merged.forEach(item => map.set(item.id, item));
							this.datas.content.dataset = [...map.values()];
						}
						if (!list.length) {
							this.datas.content.isLoading = false;
						}
					}).catch(() => {
						this.isLoading = false;
						this.datas.content.isLoading = false;
					});
				});
			},
			loadProductList(storeItem) {
				if (!storeItem || !storeItem.proisLoading) {
					return;
				}
				storeItem.proisLoading = false;
				let url = '';
				if (this.datas.content.shop_type == 1) {
					url = '/shop_league/web/index.php?m=product&a=get_all_product_list';
				} else if (this.datas.content.shop_type == 2) {
					url = '/shop_league/web/index.php?m=user_collage_product&a=collage_product_list_api';
				} else {
					url = '/shop_league/web/index.php?m=proprietary_product&a=get_product_list';
				}
				const page = storeItem.pro_page_size || 2;
				this.$common.requestData({
					url: url,
					data: {
						store_id: storeItem.id,
						page: page,
						page_size: 10
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					storeItem.proisLoading = true;
					const list = (res.data || []);
					if (list.length) {
						const merged = [...(storeItem.product_list || []), ...list];
						const map = new Map();
						merged.forEach(item => map.set(item.id, item));
						storeItem.product_list = [...map.values()];
						storeItem.pro_page_size = page + 1;
					} else {
						storeItem.proisLoading = false;
					}
				}).catch(() => {
					storeItem.proisLoading = false;
				});
			},
			handleScrollStore() {
				if (this.datas.content.isLoading && !this.isLoading) {
					this.datas.content.isLoading = false;
					this.datas.content.store_page_size = (this.datas.content.store_page_size || 1) + 1;
					this.loadStoreList();
				}
			},
			handleScrollPro(storeItem) {
				this.loadProductList(storeItem);
			},
			goMoreStore() {
				const c = this.datas.content;
				const url = '/shop_league/web/index.php?m=store&a=more_store&store_type=' + c.store_type +
					'&shop_type=' + c.shop_type + '&range_type=' + c.range_type +
					'&label_type=' + c.label_type + '&store_classification=' + c.store_classification;
				this.$common.diyLinkJump(url);
			},
			goStoreDetail(id) {
				if (!id || id == -1) {
					return;
				}
				this.$common.diyLinkJump('/shop_league/web/index.php?m=store&a=store_detail&id=' + id);
			},
			goProductDetail(storeItem, productItem) {
				if (!productItem || !productItem.id) {
					return;
				}
				let url = '';
				if (this.datas.content.shop_type == 1) {
					url = '/shop_league/web/index.php?m=product&a=product_detail&id=' + productItem.id + '&store_id=' + (productItem.store_id || storeItem.id);
				} else if (this.datas.content.shop_type == 2) {
					url = '/shop_league/web/index.php?m=user_collage_product&a=collage_product_detail&collage_pid=' + productItem.id;
				} else {
					url = '/shop_league/web/index.php?m=proprietary_product&a=product_detail&store_id=' + storeItem.id + '&id=' + productItem.id;
				}
				this.$common.diyLinkJump(url);
			}
		}
	}
</script>

<style scoped>
.flex-def { display: flex; }
.flex-cCenter { align-items: center; }
.flex-zBetween { justify-content: space-between; }
.flex-zTopBottom { flex-direction: column; }
.flex-zCenter { justify-content: center; }
.flex-one { flex: 1; min-width: 0; }

.trade100366-title-box {
	padding: 27rpx 22rpx 7rpx 30rpx;
	line-height: 1;
}
.trade100366-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 8rpx;
}
.trade100366-icon image {
	width: 100%;
	height: 100%;
}
.trade100366-title {
	line-height: 1.2;
}
.trade100366-more-title {
	font-size: 24rpx;
}
.trade100366-arrow {
	font-size: 40rpx;
	line-height: 1;
	padding-left: 4rpx;
}
.trade100366-dataset-box {
	white-space: nowrap;
	padding: 20rpx 0 20rpx 24rpx;
	box-sizing: border-box;
}
.trade100366-store-box1,
.trade100366-store-box2 {
	width: 656rpx;
	height: 404rpx;
	padding: 20rpx;
	box-sizing: border-box;
	border-radius: 16rpx;
	box-shadow: 0 0 16rpx 1rpx rgba(0, 0, 0, 0.06);
	display: inline-block;
	vertical-align: top;
	margin-right: 20rpx;
	background: linear-gradient(to bottom, #FFF9F1, #FFFFFF);
}
.trade100366-store-box2 {
	background: linear-gradient(to bottom, #FFF5F5, #FFFFFF);
}
.trade100366-store-img {
	width: 112rpx;
	height: 112rpx;
	border-radius: 8rpx;
	margin-right: 20rpx;
	overflow: hidden;
	flex-shrink: 0;
}
.trade100366-store-img image {
	width: 100%;
	height: 100%;
}
.store-head-row {
	padding-bottom: 13rpx;
}
.trade100366-store-title {
	width: 338rpx;
	font-size: 28rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.trade100366-store-type-name,
.trade100366-store-month-sale,
.trade100366-store-distance {
	font-size: 24rpx;
	color: #999999;
}
.trade100366-store-score {
	color: #EA1212;
	font-size: 24rpx;
	margin-right: 8rpx;
}
.score-icon {
	width: 24rpx;
	height: 24rpx;
	margin-right: 4rpx;
}
.label-row {
	padding-top: 12rpx;
}
.trade100366-store-labels1 {
	background: #FFF1EC;
	color: #FF4B10;
	padding: 4rpx 8rpx;
	font-size: 20rpx;
	border-radius: 17rpx 17rpx 17rpx 0;
	margin-right: 4rpx;
}
.trade100366-store-labels2 {
	background: #F5F5F5;
	color: #666666;
	padding: 4rpx 8rpx;
	font-size: 20rpx;
	border-radius: 17rpx 17rpx 17rpx 0;
	margin-right: 4rpx;
}
.trade100366-product-box {
	padding-top: 24rpx;
	width: 100%;
	white-space: nowrap;
	height: 228rpx;
}
.trade100366-product-box-li {
	display: inline-block;
	vertical-align: top;
	margin-right: 12rpx;
	width: 156rpx;
}
.trade100366-product-box-li-img {
	width: 156rpx;
	height: 156rpx;
	border-radius: 12rpx;
	overflow: hidden;
	margin-bottom: 10rpx;
}
.trade100366-product-box-li-img image {
	width: 100%;
	height: 100%;
}
.trade100366-product-box-li-name {
	width: 100%;
	font-size: 26rpx;
	padding: 0 4rpx;
	box-sizing: border-box;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.trade100366-product-box-li-price {
	font-size: 28rpx;
	color: #FF4B10;
	font-weight: bold;
	margin-top: 6rpx;
}
.price-unit,
.trade100366-product-box-li-secondPrice {
	font-size: 24rpx;
	font-weight: normal;
}
.empty-product {
	color: #C7CAD5;
	font-size: 24rpx;
	height: 228rpx;
	width: 100%;
}
.empty-store {
	height: 100%;
	min-height: 300rpx;
}
.empty-img {
	width: 234rpx;
	height: 158rpx;
}
.empty-text {
	color: #C7CAD5;
	font-size: 24rpx;
	margin-top: 10rpx;
}
</style>
