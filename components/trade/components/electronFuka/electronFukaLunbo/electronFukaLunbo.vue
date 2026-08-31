<template>
	<view class="electron_fuka_lubo_box">
		<view class="electron_fuka_lubo_carousel-container">
			<view class="electron_fuka_lubo_carousel-wrapper" :style="translateStyle">
				<view v-for="(item,index) in allData" :key="index" class="electron_fuka_lubo_carousel-item">
					<span class="electron_fuka_lubo_phone-number">{{item.user_id}}</span>
					<span class="electron_fuka_lubo_amount">
						<span class="electron_fuka_lubo_amount-text">{{item.reward_type}}</span>
						{{item.reward_money}}元
					</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "electronFukaLunbo",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				allData: [],
				currentIndex: 0,
				timer: null,
				translateYValue: 0,
				carouselStyle: '', // 动态计算的样式字符串
			}
		},
		created() {
			this.get_carousel_list_content();
		},
		computed: {
			translateStyle() {
				return {
					transform: `translateY(-${this.translateYValue}px)`,
				};
			},
		},
		methods: {
			get_carousel_list_content() {
				var that = this;
				this.$common.requestData({
					url: "/electron_fuka/web/index.php?m=reward&a=user_reward_log",
					data: {},
					method: "POST",
				}).then(res => {
					that.allData = res.data.list;
					that.startCarousel();
					console.log(this.data.tips, 'tips');
				});
			},
			maskPhoneNumber(phone) {
				return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			},
			startCarousel() {
				var that = this;
				this.timer = setInterval(() => {
					const nextIndex = (that.currentIndex + 1) % that.allData.length;
					that.currentIndex = nextIndex;
					that.translateYValue = nextIndex * 25;
					// console.log(that.translateYValue, 'translateYValue');
				}, 5000);
			},
			stopCarousel() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			updateTranslateYValue() {
				this.currentIndex = this.currentIndex;
				this.translateYValue = -this.currentIndex * 25 + 'px';
			},
		},
	}
</script>

<style>
	.electron_fuka_lubo_box {
		display: flex;
		justify-content: center;
	}

	.electron_fuka_lubo_carousel-container {
		width: 90%;
		height: 50px;
		background: linear-gradient(to right, #6366f1, #8b5cf6);
		border-radius: 10px;
		overflow: hidden;
		position: relative;
	}

	.electron_fuka_lubo_carousel-wrapper {
		position: relative;
		height: 80px;
		/* 两倍高度 */
		transition: transform 0.5s ease;
	}

	.electron_fuka_lubo_carousel-item {
		height: 25px;
		font-size: 14px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0px 20px 0px;
		color: #fff;
		font-size: 14px;
		box-sizing: border-box;
	}

	.electron_fuka_lubo_amount {
		margin-left: 10px;
		font-weight: bold;
	}

	.electron_fuka_lubo_phone-number {
		color: rgba(255, 255, 255, 0.9);
	}

	.electron_fuka_lubo_amount-text {
		color: rgba(255, 255, 255, 0.9);
		margin-right: 4px;
	}
</style>