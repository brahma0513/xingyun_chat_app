<template>
	<view class="page">
		<view class="closed-banner" v-if="canTrade && !canPublish && listingTimeTip">
			<text class="closed-icon">!</text>
			<text class="closed-text">{{ listingTimeTip }}</text>
		</view>
		<view class="closed-banner" v-if="!canTrade && tradeClosedMsg">
			<text class="closed-icon">!</text>
			<text class="closed-text">{{ tradeClosedMsg }}，今日暂不可交换</text>
		</view>
		<view class="hero-card">
			<view class="hero-top">
				<!-- <view class="ref-label">
					<text>当前参考价</text>
					<text class="info-icon" @click="showPriceTip">ⓘ</text>
				</view>
				<view class="ref-price">
					<text class="price-num">{{ referencePrice }}</text>
					<text class="price-unit">元/积分</text>
				</view> -->
			</view>
			<view class="hero-stats">
				<view class="stat-item"><text class="stat-value">{{ todayVolume }}</text><text
						class="stat-label">今日活跃</text></view>
				<view class="stat-divider"></view>
				<view class="stat-item"><text class="stat-value">{{ listingCount }}次</text><text
						class="stat-label">当前转出</text></view>
				<view class="stat-divider"></view>
				<view class="stat-item"><text class="stat-value">{{ myListingCount }}次</text><text
						class="stat-label">我的转出</text></view>
				<view class="stat-divider"></view>
				<view class="stat-item"><text class="stat-value">{{ transferable }}</text><text
						class="stat-label">我的积分</text></view>
			</view>
		</view>
		<view class="nav-grid">
			<view class="nav-item" v-for="item in navList" :key="item.key" @click="handleNav(item)">
				<!-- <view class="nav-icon" :style="{ background: item.bg }"><text
						class="nav-icon-text">{{ item.icon }}</text></view>
				<text class="nav-title">{{ item.title }}</text>
				<text class="nav-sub">{{ item.sub }}</text> -->
				<view class="nav-icon"> <u--image :showLoading="true" :src="http_host+item.icon" width="40px" height="40px"></u--image></view>
				<text class="nav-title">{{ item.title }}</text>
			</view>
		</view>
		<view class="list-section">
			<view class="list-header">
				<text class="list-title">正在转出</text>
				<view class="sort-bar">
					<view class="sort-item" :class="{ active: sortBy.startsWith('price') }" @click="togglePriceSort">
						<text>{{ priceSortLabel }}</text>
						<text class="sort-arrow">{{ sortBy === 'price_desc' ? '↑' : '↓' }}</text>
					</view>
					<view class="sort-item" :class="{ active: sortBy.startsWith('quantity') }"
						@click="toggleQuantitySort">
						<text>数量</text>
						<text class="sort-arrow">{{ sortBy === 'quantity_desc' ? '↑' : '↓' }}</text>
					</view>
				</view>
			</view>
			<view class="order-card" v-for="item in orderList" :key="item.id + item.createtime">
				<view class="order-main">
					<view class="order-left">
						<view class="top-row">
							<view class="points-row">
								<text class="points-num">{{ item.points_amount }}</text>
								<text class="points-unit">积分</text>
							</view>
							<text class="seller-id">ID:{{ item.seller_user_id }}</text>
						</view>
						<view class="price-row">
							<!-- <text class="price-item">单价: {{ item.unit_price }}</text>
							<text class="price-item total">总价: {{ item.transfer_amount }}元</text> -->
							<text class="price-item total">{{ item.transfer_amount }}</text>
						</view>
					</view>

					<view class="buy-btn" v-if="!item.is_mine && canTrade && canBuy" @click="goBuy(item)">立即交换</view>
					<view class="buy-btn disabled" v-else-if="!item.is_mine" @click="onBuyDisabled">立即交换</view>
					<view class="mine-tag" v-else>我的</view>
				</view>
			</view>
			<view class="empty" v-if="!loading && orderList.length === 0"><u-empty mode="list" text="暂无转出订单"></u-empty>
			</view>
			<u-loadmore :status="loadStatus" v-if="orderList.length > 0" margin-top="20"></u-loadmore>
		</view>
		<!-- <view class="footer-tip"><text class="tip-text">温馨提示：请在平台内完成交易，谨防私下交易风险</text></view> -->
		<view class="safe-bottom"></view>
		<pagecom :datas="template_data"></pagecom>
	</view>
</template>
<script>
	import pagecom from '@/components/pagecom/pagecom.vue'
	export default {
		components: {
			pagecom
		},
		data() {
			return {
				template_data: {
					has_bottom: true
				},
				loading: false,
				referencePrice: '0.00',
				todayVolume: '0',
				listingCount: 0,
				myListingCount: 0,
				transferable: '0.00',
				orderList: [],
				page: 1,
				pageSize: 20,
				totalPage: 0,
				loadStatus: 'loadmore',
				sortBy: 'price_asc',
				reserving: false,
				loadingMore: false,
				canTrade: true,
				canPublish: true,
				canBuy: true,
				tradeClosedMsg: '',
				publishClosedMsg: '',
				listingTimeTip: '',
				tradeDeniedMsg: '',
				hasEmergencyContact: false,
				tradeRules: '',
				navList: [{
					key: 'publish',
					title: '我要转出',
					sub: '发布转出',
					icon: '/zjxysl_task/web/static/images/jifen.png',
					bg: 'linear-gradient(135deg, #ff6b6b, #e93323)'
				}, {
					key: 'my-sell',
					title: '我的订单',
					sub: '交易订单',
					icon: '/zjxysl_task/web/static/images/order.png',
					bg: 'linear-gradient(135deg, #ffb347, #f59e0b)'
				}, {
					key: 'history',
					title: '市场记录',
					sub: '市场记录',
					icon: '/zjxysl_task/web/static/images/pingtai.png',
					bg: 'linear-gradient(135deg, #60a5fa, #3b82f6)'
				}, {
					key: 'rules',
					title: '交易规则',
					sub: '规则说明',
					icon: '/zjxysl_task/web/static/images/guize.png',
					bg: 'linear-gradient(135deg, #a78bfa, #8b5cf6)'
				}],
				http_host: ''
			}
		},
		computed: {
			priceSortLabel() {
				return this.sortBy === 'price_desc' ? '从高到低' : '从低到高'
			}
		},
		onLoad() {
			this.http_host = this.vuex_apiUrl;
			this.loadHallData(true)
		},

		onShow() {
			if (this._hallLoaded) {
				this.loadHallData(true)
			}

			this._hallLoaded = true
		},
		onPullDownRefresh() {
			this.loadHallData(true).finally(() => uni.stopPullDownRefresh())
		},
		onReachBottom() {
			this.loadMoreOrders()
		},
		methods: {
			showPriceTip() {
				uni.showModal({
					title: '参考价说明',
					content: '当前参考价来自平台交易设置，实际成交价格以交换单价为准。',
					showCancel: false
				})
			},
			showRulesTip() {
				const content = (this.tradeRules || '').trim() || '暂无交易规则说明';
				uni.showModal({
					title: '交易规则',
					content,
					showCancel: false
				})
			},
			togglePriceSort() {
				this.sortBy = this.sortBy === 'price_asc' ? 'price_desc' : 'price_asc';
				this.loadHallData(true)
			},
			toggleQuantitySort() {
				this.sortBy = this.sortBy === 'quantity_asc' ? 'quantity_desc' : 'quantity_asc';
				this.loadHallData(true)
			},
			updateLoadStatus() {
				if (this.totalPage > 0) {
					this.loadStatus = this.page >= this.totalPage ? 'nomore' : 'loadmore';
					return
				}
				this.loadStatus = 'nomore'
			},
			applyHallPageMeta(data) {
				this.totalPage = data.total_page || 0
			},
			applyHallSummary(data) {
				this.referencePrice = data.reference_price || '0.00';
				this.todayVolume = data.today_volume || '0';
				this.listingCount = data.listing_count || 0;
				this.myListingCount = data.my_listing_count || 0;
				this.transferable = data.transferable || '0.00';
				this.canTrade = data.can_trade !== 0;
				this.canPublish = data.can_publish !== 0;
				this.canBuy = data.can_buy !== 0;
				this.tradeClosedMsg = data.trade_closed_msg || '';
				this.publishClosedMsg = data.publish_closed_msg || '';
				this.listingTimeTip = data.listing_time_tip || '';
				this.tradeDeniedMsg = data.trade_denied_msg || '';
				this.hasEmergencyContact = !!data.has_emergency_contact;
				this.tradeRules = data.trade_rules || ''
			},
			loadHallData(reset = false) {
				const that = this;
				if (reset) {
					that.page = 1;
					that.orderList = [];
					that.totalPage = 0
				}
				that.loading = true;
				that.loadStatus = 'loading';
				that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=trade&a=hall',
					data: {
						page: that.page,
						page_size: that.pageSize,
						sort_by: that.sortBy
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						const data = res.data || {};
						that.applyHallSummary(data);
						that.orderList = data.list || [];
						that.applyHallPageMeta(data);
						that.updateLoadStatus()
					}
				}).catch(e => {
					console.error('加载交易大厅失败', e);
					that.loadStatus = 'loadmore';
					uni.showToast({
						title: (e && e.errmsg) || '加载失败',
						icon: 'none'
					})
				}).finally(() => {
					that.loading = false
				})
			},
			loadMoreOrders() {
				const that = this;
				if (that.loadStatus !== 'loadmore' || that.loadingMore) return;
				that.loadingMore = true;
				that.loadStatus = 'loading';
				const nextPage = that.page + 1;
				that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=trade&a=hall',
					data: {
						page: nextPage,
						page_size: that.pageSize,
						sort_by: that.sortBy
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						const data = res.data || {};
						const list = data.list || [];
						if (list.length > 0) {
							that.page = nextPage;
							that.orderList = [...that.orderList, ...list]
						}
						that.applyHallPageMeta(data);
						that.updateLoadStatus()
					}
				}).catch(e => {
					console.error('加载更多订单失败', e);
					that.loadStatus = 'loadmore';
					uni.showToast({
						title: (e && e.errmsg) || '加载失败',
						icon: 'none'
					})
				}).finally(() => {
					that.loadingMore = false
				})
			},
			showTradeClosed() {
				uni.showToast({
					title: this.tradeClosedMsg || '今日不可交易',
					icon: 'none'
				})
			},
			showPublishClosed() {
				uni.showToast({
					title: this.publishClosedMsg || this.listingTimeTip || '当前不可发布转出',
					icon: 'none'
				})
			},
			showEmergencyContactModal(content) {
				uni.showModal({
					title: '请先填写紧急联系人',
					content: content || '购买积分前需填写紧急联系人，买卖双方成交后可互相查看联系方式。',
					confirmText: '去填写',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							this.$common.diyLinkJump(
								'/zjxysl_task/web/index.php?m=index&a=account_contact_edit', 'h5', true)
						}
					}
				})
			},
			onBuyDisabled() {
				if (!this.canTrade) {
					this.showTradeClosed();
					return
				}
				uni.showToast({
					title: this.tradeDeniedMsg || '暂无购买权限',
					icon: 'none'
				})
			},
			goBuy(item) {
				if (!this.canTrade || !this.canBuy) {
					this.onBuyDisabled();
					return
				}
				if (!this.hasEmergencyContact) {
					this.showEmergencyContactModal('购买积分前需填写紧急联系人，买卖双方成交后可互相查看联系方式。');
					return
				}
				if (this.reserving) return;
				uni.showModal({
					title: '确认购买',
					content: `确定购买 ${item.points_amount} 积分，需支付 ${item.transfer_amount} 元？\n确认后将为您锁定订单，其他人无法同时购买。`,
					confirmText: '确认购买',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							this.doReserveBuy(item)
						}
					}
				})
			},
			doReserveBuy(item) {
				const that = this;
				if (that.reserving) return;
				that.reserving = true;
				that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=trade&a=reserve_buy',
					data: {
						id: item.id,
						createtime: item.createtime
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						that.$common.diyLinkJump(
							'/zjxysl_task/web/index.php?m=index&a=buy&id=' + item.id +
							'&createtime=' + encodeURIComponent(
								item.createtime), 'h5', true)
					}
				}).catch(e => {
					console.error('抢购失败', e);
					const errmsg = (e && e.errmsg) || '抢购失败';
					if (errmsg.indexOf('紧急联系人') !== -1) {
						that.showEmergencyContactModal(errmsg);
					} else {
						uni.showToast({
							title: errmsg,
							icon: 'none'
						});
					}
					that.loadHallData(true)
				}).finally(() => {
					that.reserving = false
				})
			},
			handleNav(item) {
				if (item.key === 'publish' && !this.canPublish) {
					this.showPublishClosed();
					return
				}
				if (item.key === 'publish' && !this.hasEmergencyContact) {
					this.showEmergencyContactModal('交换前需填写紧急联系人，交换双方成交后可互相查看联系方式。');
					return
				}
				if (item.key === 'rules') {
					this.showRulesTip();
					return
				}
				if (item.key === 'publish') {
					this.$common.diyLinkJump('/zjxysl_task/web/index.php?m=index&a=publish', 'h5', true)
					return
				}
				if (item.key === 'my-sell') {
					this.$common.diyLinkJump('/zjxysl_task/web/index.php?m=index&a=my_trade_orders', 'h5',
						true)
					return
				}
				if (item.key === 'history') {
					this.$common.diyLinkJump('/zjxysl_task/web/index.php?m=index&a=collect_order', 'h5',
						true)
					return
				}
				uni.showToast({
					title: '功能开发中',
					icon: 'none'
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	@brand-red: #e93323;
	@brand-red-dark: #c41e12;
	@brand-gold: #f5a623;
	@brand-gold-light: #fff3dc;
	@brand-primary: @brand-red;
	@brand-light: #fff0ef;
	@brand-gradient: linear-gradient(135deg, @brand-red 0%, @brand-red-dark 100%);
	@brand-icon-gradient: linear-gradient(135deg, #ffd56a, @brand-gold);

	@bg-page: #f5f5f5;
	@bg-card: #ffffff;
	@bg-input: #f9f9f9;
	@asset-bg: #fff5f5;

	@text-primary: #1a1a1a;
	@text-secondary: #666666;
	@text-tertiary: #999999;

	@color-success: #22c55e;
	@color-price: @brand-red;
	@color-in: #22c55e;
	@color-out: @brand-red;

	@shadow-card: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);

	.page {
		min-height: 100vh;
		background: @bg-page;
		padding: 24rpx 24rpx 0;
	}

	.closed-banner {
		display: flex;
		align-items: center;
		background: #fff7ed;
		border: 1rpx solid #fed7aa;
		border-radius: 16rpx;
		padding: 20rpx 24rpx;
		margin-bottom: 20rpx;

		.closed-icon {
			width: 36rpx;
			height: 36rpx;
			line-height: 36rpx;
			text-align: center;
			border-radius: 50%;
			background: #f59e0b;
			color: #fff;
			font-size: 24rpx;
			font-weight: 700;
			margin-right: 16rpx;
			flex-shrink: 0;
		}

		.closed-text {
			flex: 1;
			font-size: 24rpx;
			color: #b45309;
			line-height: 1.5;
		}
	}

	.hero-card {
		background: @brand-gradient;
		border-radius: 24rpx;
		padding: 32rpx 28rpx 24rpx;
		color: #fff;
		box-shadow: 0 12rpx 40rpx rgba(233, 51, 35, 0.25);

		.hero-top {
			margin-bottom: 28rpx;

			.ref-label {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				opacity: 0.9;
				margin-bottom: 8rpx;

				.info-icon {
					margin-left: 8rpx;
					font-size: 22rpx;
					opacity: 0.8;
				}
			}

			.ref-price {
				display: flex;
				align-items: baseline;

				.price-num {
					font-size: 56rpx;
					font-weight: 700;
					line-height: 1.1;
				}

				.price-unit {
					font-size: 26rpx;
					margin-left: 8rpx;
					opacity: 0.95;
				}
			}
		}

		.hero-stats {
			display: flex;
			align-items: center;
			background: rgba(255, 255, 255, 0.12);
			border-radius: 16rpx;
			padding: 20rpx 0;

			.stat-item {
				flex: 1;
				text-align: center;

				.stat-value {
					display: block;
					font-size: 28rpx;
					font-weight: 600;
					margin-bottom: 4rpx;
				}

				.stat-label {
					display: block;
					font-size: 20rpx;
					opacity: 0.85;
				}
			}

			.stat-divider {
				width: 1rpx;
				height: 48rpx;
				background: rgba(255, 255, 255, 0.25);
			}
		}
	}

	.nav-grid {
		display: flex;
		background: @bg-card;
		border-radius: 24rpx;
		padding: 28rpx 16rpx;
		margin-top: 20rpx;
		box-shadow: @shadow-card;

		.nav-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			.nav-icon {
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 12rpx;

				.nav-icon-text {
					font-size: 36rpx;
					color: #fff;
					font-weight: 600;
				}
			}

			.nav-title {
				font-size: 26rpx;
				color: @text-primary;
				font-weight: 500;
			}

			.nav-sub {
				font-size: 20rpx;
				color: @text-tertiary;
				margin-top: 4rpx;
			}
		}
	}

	.list-section {
		margin-top: 20rpx;
		background: @bg-card;
		border-radius: 24rpx 24rpx 0 0;
		padding: 28rpx 24rpx;
		min-height: 400rpx;

		.list-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.list-title {
				font-size: 30rpx;
				font-weight: 600;
				color: @text-primary;
			}

			.sort-bar {
				display: flex;
				gap: 16rpx;

				.sort-item {
					display: flex;
					align-items: center;
					font-size: 22rpx;
					color: @text-tertiary;
					padding: 8rpx 12rpx;
					border-radius: 20rpx;

					&.active {
						color: @brand-primary;
						background: @brand-light;
					}

					.sort-arrow {
						margin-left: 4rpx;
						font-size: 20rpx;
					}
				}
			}
		}
	}

	.order-card {
		background: #fafafa;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 16rpx;

		.order-main {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.order-left {
			flex: 1;
			min-width: 0;
			padding-right: 16rpx;

			.top-row {
				display: flex;
				align-items: baseline;
				justify-content: space-between;
				margin-bottom: 8rpx;
			}

			.points-row {
				display: flex;
				align-items: baseline;
				flex-shrink: 0;

				.points-num {
					font-size: 36rpx;
					font-weight: 700;
					color: @text-primary;
				}

				.points-unit {
					font-size: 24rpx;
					color: @text-secondary;
					margin-left: 8rpx;
				}
			}

			.seller-id {
				font-size: 24rpx;
				color: @text-secondary;
				margin-left: 24rpx;
				flex-shrink: 0;
			}

			.price-row {
				display: flex;
				flex-wrap: wrap;
				gap: 16rpx;

				.price-item {
					font-size: 24rpx;
					color: @text-secondary;
				}

				.total {
					color: @brand-primary;
					font-weight: 500;
				}
			}
		}

		.buy-btn {
			flex-shrink: 0;
			margin-left: 16rpx;
			padding: 16rpx 28rpx;
			background: @brand-gradient;
			border-radius: 40rpx;
			font-size: 26rpx;
			color: #fff;
			font-weight: 500;

			&.disabled {
				background: #e5e7eb;
				color: #9ca3af;
			}
		}

		.mine-tag {
			flex-shrink: 0;
			margin-left: 16rpx;
			padding: 16rpx 20rpx;
			background: #f5f5f5;
			border-radius: 40rpx;
			font-size: 24rpx;
			color: @text-tertiary;
		}
	}

	.empty {
		padding: 60rpx 0;
	}

	.footer-tip {
		text-align: center;
		color: #e93323;
		padding: 24rpx 8rpx 32rpx;

		.tip-text {
			font-size: 22rpx;
			color: @text-tertiary;
			line-height: 1.5;
			color: #e93323;
		}
	}

	.safe-bottom {
		height: env(safe-area-inset-bottom);
	}
</style>