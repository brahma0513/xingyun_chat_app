<template>
	<!-- 微信小店商品 -->
	<view class="sl_product_box" v-if="datas.type == 'sl_80143_product'" :style="boxStyle">
		<view class="sl_product_title" v-if="content.title" :style="titleStyle">{{content.title}}</view>
		<view class="sl_product_list" :class="content.columns == 1 ? 'one-line' : 'two-line'">
			<view class="sl_product_item" v-for="item in list" :key="item.product_id" @click="on_product_tap(item)">
				<!-- 微信端透明覆盖层，点击半屏拉起小店商品页 -->
				<!-- #ifdef MP-WEIXIN -->
				<store-product v-if="shop_appid && item.product_id" :appid="shop_appid" :product-id="item.product_id"
					:custom-style="storeProductStyle"></store-product>
				<!-- #endif -->
				<view class="sl_product_img">
					<image v-if="item.head_img" :src="item.head_img" mode="aspectFill" lazy-load></image>
				</view>
				<view class="sl_product_info">
					<view class="sl_product_name">{{item.title}}</view>
					<view class="sl_product_bottom">
						<view class="sl_product_price">¥<text class="sl_product_price_big">{{item.min_price}}</text>
							<text class="sl_product_from" v-if="item.max_price && item.max_price != item.min_price">起</text>
						</view>
						<view class="sl_product_tag" v-if="item.reward_text">{{item.reward_text}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="sl_product_more" v-if="content.load_type == 'scroll' && list.length > 0">{{load_end ? '没有更多了' : '加载中...'}}</view>
		<view class="sl_product_empty" v-if="list.length === 0 && !loading">暂无商品</view>
	</view>
</template>

<script>
	export default {
		name: "shopLinkProduct",
		options: {
			virtualHost: true,
			styleIsolation: "shared"
		},
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				list: [],
				shop_appid: "",
				page: 0,
				loading: false,
				load_end: false,
				storeProductStyle: "position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;z-index:5;"
			};
		},
		computed: {
			content() {
				return (this.datas && this.datas.content) || {};
			},
			boxStyle() {
				const content = this.content;
				return {
					paddingTop: (content.padding_top || 0) + "px",
					paddingBottom: (content.padding_bottom || 0) + "px",
					paddingLeft: (content.padding_horizontal || 0) + "px",
					paddingRight: (content.padding_horizontal || 0) + "px",
					backgroundColor: content.backgroundColor || ""
				};
			},
			titleStyle() {
				const content = this.content;
				const style = {};
				if (content.title_color) {
					style.color = content.title_color;
				}
				if (content.title_size) {
					style.fontSize = content.title_size + "px";
				}
				return style;
			}
		},
		created() {
			this.load_page();
		},
		beforeDestroy() {
			this.stop_observer();
		},
		methods: {
			load_page() {
				const that = this;
				if (that.loading || that.load_end) {
					return;
				}
				const content = that.content;
				const page_size = Math.min(Math.max(parseInt(content.limit) || 6, 1), 100);
				const page = that.page + 1;
				that.loading = true;
				that.$common.requestData({
					url: "/shop_link/web/index.php?m=wx_shop&a=get_list",
					data: {
						page: page,
						page_size: page_size
					},
					method: "POST",
					needToken: false
				}).then(res => {
					const data = (res.errcode == 0 && res.data) || {};
					const list = data.list || [];
					const load_end = content.load_type != "scroll" || list.length < page_size;
					that.list = page > 1 ? that.list.concat(list) : list;
					that.shop_appid = data.shop_appid || that.shop_appid;
					that.page = page;
					that.load_end = load_end;
					that.loading = false;
					that.$nextTick(function() {
						load_end ? that.stop_observer() : that.bind_observer();
					});
				}).catch(() => {
					that.load_end = true;
					that.loading = false;
					that.stop_observer();
				});
			},
			bind_observer() {
				const that = this;
				if (that._observer) {
					return;
				}
				that._observer = uni.createIntersectionObserver(that, {
					thresholds: [0]
				});
				that._observer.relativeToViewport({
					bottom: 100
				}).observe(".sl_product_more", function(res) {
					if (res.intersectionRatio > 0) {
						that.load_page();
					}
				});
			},
			stop_observer() {
				if (this._observer) {
					this._observer.disconnect();
					this._observer = null;
				}
			},
			on_product_tap(item) {
				// #ifdef MP-WEIXIN
				if (this.shop_appid && item.product_id) {
					return; // 由 store-product 接管
				}
				// #endif
				if (item.h5_url) {
					if (this.$common && this.$common.diyLinkJump) {
						this.$common.diyLinkJump(item.h5_url);
					} else {
						uni.navigateTo({
							url: "/pages/webview/webview?url=" + encodeURIComponent(item.h5_url)
						});
					}
					return;
				}
				uni.showToast({
					title: "商品暂不可购买",
					icon: "none"
				});
			}
		}
	};
</script>

<style>
	.sl_product_box {
		width: 100%;
		box-sizing: border-box;
	}

	.sl_product_title {
		font-weight: bold;
		line-height: 1.4;
		padding-bottom: 10px;
	}

	.sl_product_list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.sl_product_list.two-line .sl_product_item {
		width: calc(50% - 5px);
		margin-bottom: 10px;
	}

	.sl_product_list.one-line .sl_product_item {
		width: 100%;
		display: flex;
		margin-bottom: 10px;
	}

	.sl_product_list.one-line .sl_product_img {
		width: 110px;
		flex-shrink: 0;
	}

	.sl_product_list.one-line .sl_product_info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.sl_product_item {
		position: relative;
		background: #fff;
		border-radius: 8px;
		overflow: hidden;
		box-sizing: border-box;
	}

	.sl_product_img {
		position: relative;
		width: 100%;
		background: #f5f6f8;
	}

	.sl_product_img:after {
		content: "";
		display: block;
		padding-bottom: 100%;
	}

	.sl_product_img image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.sl_product_info {
		padding: 8px 10px 10px;
	}

	.sl_product_name {
		font-size: 13px;
		color: #333;
		line-height: 1.4;
		height: 36px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}

	.sl_product_bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 8px;
	}

	.sl_product_price {
		flex-shrink: 0;
		font-size: 12px;
		color: #e93b3d;
		font-weight: bold;
	}

	.sl_product_price_big {
		font-size: 17px;
	}

	.sl_product_from {
		margin-left: 2px;
		font-size: 11px;
		font-weight: normal;
		color: #999;
	}

	.sl_product_tag {
		margin-left: 6px;
		padding: 2px 6px;
		max-width: 55%;
		font-size: 10px;
		color: #d97706;
		background: #fff5e6;
		border: 1px solid #ffd699;
		border-radius: 10px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sl_product_more {
		padding: 10px 0 4px;
		text-align: center;
		color: #999;
		font-size: 12px;
	}

	.sl_product_empty {
		padding: 30px 0;
		text-align: center;
		color: #999;
		font-size: 13px;
	}
</style>
