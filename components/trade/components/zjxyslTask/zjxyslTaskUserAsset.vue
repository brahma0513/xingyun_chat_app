<template>
	<view>
		<view class="assets-card"
			:style="'margin-top:'+datas.content.margin_top+'px;margin-right:'+datas.content.margin_horizontal+'px;margin-bottom:'+datas.content.margin_bottom+'px;margin-left:'+datas.content.margin_horizontal+'px;background-color'+datas.content.background_color">
			<view class="card-title">
				<view class="title-bar"></view>
				<text>我的资产</text>
			</view>

			<template v-if="datas.content.style_type == 1">
				<!-- 三行 每行两列布局 -->
				<view class="asset-row asset-row--2" v-for="(row, rowIndex) in 3" :key="rowIndex"
					v-if="datas.type=='zjxysl_task_30195_1'">
					<view class="asset-cell" v-for="(col, colIndex) in 2" :key="colIndex"
						@click="go_urls(datas.content.dataset[rowIndex*2 + colIndex].link)">
						<text class="asset-label">{{datas.content.dataset[rowIndex*2 + colIndex].name}}</text>
						<text class="asset-value">{{datas.content.dataset[rowIndex*2 + colIndex].sum}}</text>
					</view>
				</view>
				
				
				
				<template v-if="datas.type=='zjxy_shop_30199_1'">
					<!-- 待释放单独一行 -->
					<view class="asset-main"
					      v-if="datas.type=='zjxy_shop_30199_1' && datas.content.dataset[0]"
					      @click="go_urls(datas.content.dataset[0].link)">
					    <text class="asset-label">{{datas.content.dataset[0].name}}</text>
					    <text class="asset-value asset-value--lg">{{datas.content.dataset[0].sum}}</text>
					</view>
					
					<!-- 两行组 -->
					<view class="asset-row asset-row--2">
						<view class="asset-cell" @click="go_urls(datas.content.dataset[1].link)">
							<text class="asset-label">{{datas.content.dataset[1].name}}</text>
							<text class="asset-value">{{datas.content.dataset[1].sum}}</text>
						</view>
						<view class="asset-cell" @click="go_urls(datas.content.dataset[2].link)">
							<text class="asset-label">{{datas.content.dataset[2].name}}</text>
							<text class="asset-value">{{datas.content.dataset[2].sum}}</text>
						</view>
					</view>
					
					<!-- 两行组 -->
					<view class="asset-row asset-row--2">
						<view class="asset-cell" @click="go_urls(datas.content.dataset[3].link)">
							<text class="asset-label">{{datas.content.dataset[3].name}}</text>
							<text class="asset-value">{{datas.content.dataset[3].sum}}</text>
						</view>
						<view class="asset-cell" @click="go_urls(datas.content.dataset[4].link)">
							<text class="asset-label">{{datas.content.dataset[4].name}}</text>
							<text class="asset-value">{{datas.content.dataset[4].sum}}</text>
						</view>
					</view>
				</template>
			</template>
			<template v-else>
				<!-- 待释放单独一行 -->
				<view class="asset-main" @click="go_urls(datas.content.dataset[0].link)">
					<text class="asset-label">{{datas.content.dataset[0].name}}</text>
					<text class="asset-value asset-value--lg">{{datas.content.dataset[0].sum}}</text>
				</view>

				<!-- 两行组 -->
				<view class="asset-row asset-row--2">
					<view class="asset-cell" @click="go_urls(datas.content.dataset[1].link)">
						<text class="asset-label">{{datas.content.dataset[1].name}}</text>
						<text class="asset-value">{{datas.content.dataset[1].sum}}</text>
					</view>
					<view class="asset-cell" @click="go_urls(datas.content.dataset[2].link)">
						<text class="asset-label">{{datas.content.dataset[2].name}}</text>
						<text class="asset-value">{{datas.content.dataset[2].sum}}</text>
					</view>
				</view>

				<!-- 三行组 -->
				<view class="asset-row asset-row--3">
					<view class="asset-cell" @click="go_urls(datas.content.dataset[3].link)">
						<text class="asset-label">{{datas.content.dataset[3].name}}</text>
						<text class="asset-value asset-value--sm">{{datas.content.dataset[3].sum}}</text>
					</view>
					<view class="asset-cell" @click="go_urls(datas.content.dataset[4].link)">
						<text class="asset-label">{{datas.content.dataset[4].name}}</text>
						<text class="asset-value asset-value--sm">{{datas.content.dataset[4].sum}}</text>
					</view>
					<view class="asset-cell" @click="go_urls(datas.content.dataset[5].link)">
						<text class="asset-label">{{datas.content.dataset[5].name}}</text>
						<text class="asset-value asset-value--sm">{{datas.content.dataset[5].sum}}</text>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		name: "zjxyslTaskUserAsset",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {

			}
		},
		created() {
			this.get_data();
		},
		computed: {
		    rowList() {
		      const list = this.datas.content.dataset || []
		      // 减去顶部占用的第0项，剩余数据行数向上取整
		      const remain = list.length - 1
		      return remain > 0 ? Array.from({length: Math.ceil(remain / 2)}, (_,i)=>i) : []
		    }
		},
		methods: {
			get_data() {
				var that = this;
				var url = '';
				if (this.datas.type == 'zjxysl_task_30195_1') {
					url = '/zjxysl_task/web/index.php?m=user_asset&a=profile'
				} else {
					url = '/zjxy_shop/web/index.php?m=shop&a=user_asset'
				}

				that.$common.requestData({
					url: url,
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						// that.datas.content.dataset[0].name = res.data.points_labels['pending_release'];
						// that.datas.content.dataset[0].sum = res.data.points_info['pending_release'];
						// that.datas.content.dataset[0].link = res.data.points_link['pending_release'];

						// that.datas.content.dataset[1].name = res.data.points_labels['transferable'];
						// that.datas.content.dataset[1].sum = res.data.points_info['transferable'];
						// that.datas.content.dataset[1].link = res.data.points_link['transferable'];

						// that.datas.content.dataset[2].name = res.data.points_labels['income'];
						// that.datas.content.dataset[2].sum = res.data.points_info['income'];
						// that.datas.content.dataset[2].link = res.data.points_link['income'];

						// that.datas.content.dataset[3].name = res.data.points_labels['consume'];
						// that.datas.content.dataset[3].sum = res.data.points_info['consume'];
						// that.datas.content.dataset[3].link = res.data.points_link['consume'];

						// that.datas.content.dataset[4].name = res.data.points_labels['exchange'];
						// that.datas.content.dataset[4].sum = res.data.points_info['exchange'];
						// that.datas.content.dataset[4].link = res.data.points_link['exchange'];

						// that.datas.content.dataset[5].name = res.data.points_labels['deduct'];
						// that.datas.content.dataset[5].sum = res.data.points_info['deduct'];
						// that.datas.content.dataset[5].link = res.data.points_link['deduct'];

						// 定义顺序key列表，和dataset下标一一对应
						var keys = []
						if (that.datas.type == 'zjxysl_task_30195_1') {
							keys = ['pending_release', 'transferable', 'income', 'consume', 'exchange',
								'deduct'
							];
						} else {
							keys = ['money','transferable', 'income', 'consume', 'deduct'];
						}

						keys.forEach((key, index) => {
							const item = that.datas.content.dataset[index];
							item.name = res.data.points_labels[key];
							item.sum = res.data.points_info[key];
							item.link = res.data.points_link[key];
						});
					}
				})
			},
			go_urls: function(url) {
				var that = this;
				console.log('go_urls', url);
				if (url == "") {
					return;
				}
				that.$common.diyLinkJump(url, "h5", true);
			},
		}
	}
</script>

<style lang="less" scoped>
	@brand-red: #e93323;
	@brand-red-dark: #c41e12;
	@bg-page: #f5f5f5;
	@bg-card: #ffffff;
	@text-primary: #1a1a1a;
	@text-secondary: #666666;
	@text-tertiary: #999999;
	@asset-bg: #fff5f5;
	@shadow-card: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);

	.assets-card {
		background: @bg-card;
		border-radius: 24rpx;
		padding: 28rpx;
		box-shadow: @shadow-card;

		.card-title {
			display: flex;
			align-items: center;
			margin-bottom: 24rpx;

			.title-bar {
				width: 6rpx;
				height: 28rpx;
				background: @brand-red;
				border-radius: 3rpx;
				margin-right: 12rpx;
			}

			text {
				font-size: 30rpx;
				font-weight: 700;
				color: @text-primary;
			}
		}

		.asset-main {
			background: @asset-bg;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 16rpx;
		}

		.asset-row {
			display: flex;
			gap: 16rpx;

			&--2 .asset-cell {
				flex: 1;
			}

			&--3 .asset-cell {
				flex: 1;
			}
		}

		.asset-cell {
			background: @asset-bg;
			border-radius: 16rpx;
			padding: 20rpx 16rpx;
			margin-bottom: 16rpx;
		}

		.asset-label {
			display: block;
			font-size: 22rpx;
			color: @text-secondary;
		}

		.asset-value {
			display: block;
			margin-top: 10rpx;
			font-size: 30rpx;
			font-weight: 700;
			color: @brand-red;
			font-variant-numeric: tabular-nums;

			&--lg {
				font-size: 44rpx;
			}

			&--sm {
				font-size: 26rpx;
			}
		}
	}
</style>