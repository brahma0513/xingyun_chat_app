<template>
	<view class="zjxysl-task-list-wrap" :style="wrapStyle">
		<!-- 今日数据 + 签到 -->
		<view class="stats-card">
			<view class="stat-block">
				<text class="stat-label">今日预计获得</text>
				<view class="stat-value-row">
					<text class="stat-value stat-value--red">{{ todayExpectedReward | formatPoints }}</text>
					<text class="stat-unit">积分</text>
				</view>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-block stat-block--center">
				<text class="stat-label">待释放积分</text>
				<text class="stat-value">{{ pendingRelease | formatPoints }}</text>
			</view>
			<view class="sign-btn" @click="goToSignIn">
				<text>{{ todaySigned ? '已签到' : '去签到' }}</text>
			</view>
		</view>

		<!-- 算力包列表 -->
		<view class="package-section">
			<view class="section-header">
				<text class="section-title">算力包</text>
				<view class="section-link" @click="goToOrders">
					<text>我的算力包</text>
					<text class="link-arrow">›</text>
				</view>
			</view>

			<view class="package-list">
				<view class="package-card" v-for="item in packageList" :key="item.id">
					<view class="package-head">
						<view class="package-icon" :class="{ 'package-icon--logo': !!item.logo_url }">
							<image v-if="item.logo_url" class="package-logo" :src="resolvePackLogo(item.logo_url)"
								mode="aspectFill"></image>
							<text v-else class="icon-char">{{ item.name ? item.name.slice(0, 1) : '算' }}</text>
						</view>
						<view class="package-info">
							<text class="package-name">{{ item.name }}</text>
						</view>
						<view class="package-price-block">
							<text class="price-label">积分售价</text>
							<view class="price-row">
								<text class="price-num">{{ item.points_cost | formatPoints }}</text>
								<text class="price-unit">积分</text>
							</view>
						</view>
					</view>

					<view class="package-tags">
						<text class="tag" v-for="(tag, tagIdx) in getPackTags(item)" :key="tagIdx">{{ tag }}</text>
					</view>

					<view class="package-divider"></view>

					<view class="package-foot">
						<text class="gift-text">赠送贡献值 +{{ item.contribution }}</text>
						<text class="gift-text">已持有 {{ item.holding_count }}</text>
						<view class="buy-btn" @click.stop="goToBuyPackage(item)">
							<text>立即兑换</text>
						</view>
					</view>
				</view>
			</view>

			<view class="empty-state" v-if="packageList.length === 0 && loadStatus !== 'loading'">
				<u-empty mode="data" text="暂无算力包"></u-empty>
			</view>
		</view>

		<u-loadmore :status="loadStatus" v-if="packageList.length > 0" margin-top="20" @loadmore="loadMorePackages"></u-loadmore>
	</view>
</template>

<script>
	export default {
		name: "zjxyslTaskList",
		props: {
			datas: {
				type: Object,
				default: () => ({})
			},
		},
		data() {
			return {
				http_host: '',
				todaySigned: false,
				todayExpectedReward: '0',
				pendingRelease: '0',
				packageList: [],
				loadStatus: 'loading',
				page: 1,
				pageSize: 20,
				packageTotal: 0,
				packageTotalPage: 0,
				loadingMore: false,
			}
		},
		computed: {
			wrapStyle() {
				const content = (this.datas && this.datas.content) || {}
				const mt = content.margin_top != null ? content.margin_top : 0
				const mb = content.margin_bottom != null ? content.margin_bottom : 0
				const mh = content.margin_horizontal != null ? content.margin_horizontal : 0
				const bg = content.backgroundColor || content.background_color || '#fff'
				return `margin-top:${mt}px;margin-bottom:${mb}px;margin-left:${mh}px;margin-right:${mh}px;background-color:${bg};`
			}
		},
		filters: {
			formatPoints(value, scale = 2) {
				let str = String(value ?? '').trim()
				if (str === '') {
					return '0.' + '0'.repeat(scale)
				}
				let sign = ''
				if (str[0] === '+' || str[0] === '-') {
					sign = str[0]
					str = str.slice(1)
				}
				if (isNaN(Number(str))) {
					return sign + '0.' + '0'.repeat(scale)
				}
				const parts = str.split('.')
				const intPart = parts[0] || '0'
				let decPart = parts[1] || ''
				if (decPart.length > scale) {
					decPart = decPart.slice(0, scale)
				}
				decPart = decPart.padEnd(scale, '0')
				return sign + intPart + '.' + decPart
			}
		},
		created() {
			this.http_host = this.vuex_apiUrl
			this.loadHallData(true)
		},
		methods: {
			prefixDomainPath(path) {
				if (!path) return ''
				const httpRep = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/
				if (!httpRep.test(path)) {
					if (path.indexOf('/resources/') === -1) {
						path = `/resources/${path}`
					}
					const host = this.http_host
					path = `${host}${path}`
				}
				return path
			},

			formatShareRate(rate) {
				const num = parseFloat(rate)
				if (isNaN(num)) return '0%'
				return (num * 100).toFixed(1).replace(/\.0$/, '') + '%'
			},

			calcDailyOutput(item) {
				if (!item) return '0'
				if (item.daily_output != null && String(item.daily_output).trim() !== '') {
					return String(item.daily_output)
				}
				const total = parseFloat(item.total_output)
				const cycle = parseInt(item.init_cycle, 10)
				if (isNaN(total) || isNaN(cycle) || cycle <= 0) return '0'
				const raw = total / cycle
				const s = raw.toFixed(4).replace(/\.?0+$/, '')
				return s === '' ? '0' : s
			},

			getShareRewardDisplay(item) {
				if (!item) return ''
				if (item.share_reward_pct) return item.share_reward_pct
				if (item.share_reward_rate != null && item.share_reward_rate !== '') {
					return this.formatShareRate(item.share_reward_rate)
				}
				return ''
			},

			buildPowerPackTags(item) {
				if (!item) return []
				const tags = []
				tags.push(`每天产量 ${this.calcDailyOutput(item)}`)
				if (item.init_cycle != null && item.init_cycle !== '') {
					tags.push(`周期 ${item.init_cycle}天`)
				}
				if (item.total_output != null && item.total_output !== '') {
					tags.push(`总产量 ${item.total_output}`)
				}
				if (item.max_cycle != null && item.max_cycle !== '') {
					tags.push(`最大周期 ${item.max_cycle}天`)
				}
				if (item.cycle_add_days != null && item.cycle_add_days !== '') {
					tags.push(`每次增加 ${item.cycle_add_days}天`)
				}
				if (item.max_hold != null && item.max_hold !== '') {
					tags.push(`最大持有 ${item.max_hold}个`)
				}
				const share = this.getShareRewardDisplay(item)
				if (share) {
					tags.push(`分享奖励 ${share}`)
				}
				return tags
			},

			resolvePackLogo(url) {
				if (!url) return ''
				return this.prefixDomainPath(url)
			},

			getPackTags(item) {
				return this.buildPowerPackTags(item)
			},

			updateLoadStatus() {
				if (this.packageTotalPage > 0) {
					this.loadStatus = this.page >= this.packageTotalPage ? 'nomore' : 'loadmore'
					return
				}
				if (this.packageTotal > 0) {
					this.loadStatus = this.packageList.length >= this.packageTotal ? 'nomore' : 'loadmore'
					return
				}
				this.loadStatus = 'nomore'
			},

			applyPackagePageMeta(data) {
				this.packageTotal = data.package_total || 0
				this.packageTotalPage = data.package_total_page || 0
				if (!this.packageTotalPage && this.packageTotal > 0) {
					this.packageTotalPage = Math.ceil(this.packageTotal / this.pageSize)
				}
			},

			loadHallData(reset = false) {
				const that = this
				if (reset) {
					that.page = 1
					that.packageList = []
					that.packageTotal = 0
					that.packageTotalPage = 0
				}
				that.loadStatus = 'loading'
				return that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=index&a=hall_data',
					data: {
						page: that.page,
						page_size: that.pageSize
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						const data = res.data || {}
						that.todaySigned = !!(data.today_signed === 1 || data.today_signed === true)
						that.todayExpectedReward = data.today_expected_reward || '0'
						that.pendingRelease = data.pending_release || '0'
						that.packageList = data.package_list || []
						that.applyPackagePageMeta(data)
						that.updateLoadStatus()
					}
				}).catch(e => {
					console.error('加载算力包列表失败', e)
					that.loadStatus = 'loadmore'
					uni.showToast({
						title: (e && e.errmsg) || '加载失败',
						icon: 'none'
					})
				})
			},

			loadMorePackages() {
				const that = this
				if (that.loadStatus !== 'loadmore' || that.loadingMore) return
				that.loadingMore = true
				that.loadStatus = 'loading'
				const nextPage = that.page + 1
				that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=index&a=hall_data',
					data: {
						page: nextPage,
						page_size: that.pageSize
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						const data = res.data || {}
						const list = data.package_list || []
						if (list.length > 0) {
							that.page = nextPage
							that.packageList = [...that.packageList, ...list]
						}
						that.applyPackagePageMeta(data)
						that.updateLoadStatus()
					}
				}).catch(e => {
					console.error('加载更多算力包失败', e)
					that.loadStatus = 'loadmore'
					uni.showToast({
						title: (e && e.errmsg) || '加载失败',
						icon: 'none'
					})
				}).finally(() => {
					that.loadingMore = false
				})
			},

			goToSignIn() {
				this.$common.diyLinkJump('/zjxysl_task/pages/sign_in', '', true)
			},

			goToOrders() {
				this.$common.diyLinkJump('/zjxysl_task/web/index.php?m=index&a=my_orders', 'h5', true)
			},

			goToBuyPackage(item) {
				this.$common.diyLinkJump('/zjxysl_task/web/index.php?m=index&a=buy_package&id=' + item.id, 'h5', true)
			},
		}
	}
</script>

<style lang="less" scoped>
	@brand-red: #e93323;
	@brand-gold: #f5a623;
	@brand-gold-light: #fff3dc;
	@bg-card: #ffffff;
	@text-primary: #1a1a1a;
	@text-tertiary: #999999;
	@shadow-card: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);

	.zjxysl-task-list-wrap {
		box-sizing: border-box;
		padding: 0 24rpx;
	}

	.stats-card {
		display: flex;
		align-items: center;
		padding: 28rpx 24rpx;
		background: @bg-card;
		border-radius: 24rpx;
		box-shadow: @shadow-card;

		.stat-block {
			flex: 1;
			min-width: 0;

			&--center {
				text-align: center;
			}

			.stat-label {
				display: block;
				font-size: 22rpx;
				color: @text-tertiary;
			}

			.stat-value-row {
				display: flex;
				align-items: baseline;
				margin-top: 8rpx;
			}

			.stat-value {
				font-size: 32rpx;
				font-weight: 700;
				color: @text-primary;
				font-variant-numeric: tabular-nums;

				&--red {
					font-size: 36rpx;
					color: @brand-red;
				}
			}

			.stat-unit {
				font-size: 22rpx;
				color: @text-tertiary;
				margin-left: 4rpx;
			}
		}

		.stat-divider {
			width: 1rpx;
			height: 64rpx;
			background: #eee;
			margin: 0 16rpx;
			flex-shrink: 0;
		}

		.sign-btn {
			flex-shrink: 0;
			padding: 16rpx 28rpx;
			background: @brand-red;
			border-radius: 40rpx;

			text {
				font-size: 26rpx;
				font-weight: 600;
				color: #fff;
				white-space: nowrap;
			}
		}
	}

	.package-section {
		margin-top: 32rpx;

		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			padding: 0 8rpx;

			.section-title {
				font-size: 32rpx;
				font-weight: 700;
				color: @text-primary;
			}

			.section-link {
				display: flex;
				align-items: center;

				text {
					font-size: 26rpx;
					color: @brand-red;
				}

				.link-arrow {
					margin-left: 4rpx;
					font-size: 28rpx;
				}
			}
		}
	}

	.package-list {
		.package-card {
			background: @bg-card;
			border-radius: 24rpx;
			padding: 28rpx;
			margin-bottom: 20rpx;
			box-shadow: @shadow-card;
			border-left: 6rpx solid @brand-gold;
		}

		.package-head {
			display: flex;
			align-items: flex-start;
		}

		.package-icon {
			width: 72rpx;
			height: 72rpx;
			border-radius: 16rpx;
			background: linear-gradient(135deg, #ffd56a, @brand-gold);
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 20rpx;
			flex-shrink: 0;
			overflow: hidden;

			&--logo {
				background: #f3f4f6;
			}

			.package-logo {
				width: 100%;
				height: 100%;
			}

			.icon-char {
				font-size: 32rpx;
				font-weight: 700;
				color: #fff;
			}
		}

		.package-info {
			flex: 1;
			min-width: 0;
			padding-top: 6rpx;

			.package-name {
				font-size: 30rpx;
				font-weight: 700;
				color: @text-primary;
			}
		}

		.package-price-block {
			flex-shrink: 0;
			text-align: right;

			.price-label {
				display: block;
				font-size: 20rpx;
				color: @text-tertiary;
			}

			.price-row {
				display: flex;
				align-items: baseline;
				justify-content: flex-end;
				margin-top: 4rpx;

				.price-num {
					font-size: 36rpx;
					font-weight: 700;
					color: @brand-red;
				}

				.price-unit {
					font-size: 22rpx;
					color: @text-tertiary;
					margin-left: 4rpx;
				}
			}
		}

		.package-tags {
			display: flex;
			flex-wrap: wrap;
			gap: 12rpx;
			margin-top: 20rpx;

			.tag {
				font-size: 22rpx;
				color: #d48806;
				background: @brand-gold-light;
				border-radius: 8rpx;
				padding: 6rpx 16rpx;
			}
		}

		.package-divider {
			margin: 24rpx 0;
			border-top: 2rpx dashed #eee;
		}

		.package-foot {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.gift-text {
				font-size: 26rpx;
				font-weight: 600;
				color: @brand-red;
			}

			.buy-btn {
				padding: 14rpx 36rpx;
				background: @brand-red;
				border-radius: 40rpx;

				text {
					font-size: 26rpx;
					font-weight: 600;
					color: #fff;
				}
			}
		}
	}

	.empty-state {
		padding: 80rpx 0;
	}
</style>
