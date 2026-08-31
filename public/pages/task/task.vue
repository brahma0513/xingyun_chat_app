<template>
	<view class="task-container">
		<!-- 状态栏占位（绑定动态背景色） -->
		<view class="status-bar" :style="{ 
		          height: statusBarHeight + 'px',
		          backgroundColor: statusBarBgColor 
		        }">
		</view>

		<scroll-view class="content-scroll" scroll-y>
			<view>
				<view class="top-box">
					<image :src="http_host+'/uniapp_template/web/static/images/task/bg2.png'" class="top-t-bg"
						mode="widthFix">
					</image>
					<view class="top-text-box">
						<view class="top-t">完成任务</view>
						<view class="top-t">领丰厚奖品</view>
					</view>
				</view>
				<view class="task-main">
					<view class="task-content">
						<view class="task-title-group">
							<view class="task-l-tit">任务列表</view>
							<view class="task-l-tips">每项当天仅可获得1次奖励，每日24点任务重置</view>
							<image :src="http_host+'/uniapp_template/web/static/images/task/gift-icon.png'"
								class="task-gift-icon" mode="widthFix"></image>
						</view>
						<view class="task-list-group" v-if="task_setting">
							<view class="task-l-item-box" v-for="(item,index) in Number(task_setting['task_num'])"
								:key="index">
								<view class="task-item-left">
									<view class="task-icon">
										<image :src="http_host+'/uniapp_template/web/static/images/task/video-icon.png'"
											class="task-v-icon" mode="widthFix"></image>
									</view>
									<view class="task-l-name">观看第{{index+1}}个广告</view>
								</view>
								<view class="bnt-box">
									<view class="task-l-bnt" v-if="task_setting.task_status[index] == false"
										:disabled="isLoading" :loading="isLoading" @click="show(index)"
										:class="{'disabel-bnt': showTime == true}">去完成</view>
									<view class="task-l-bnt task-l-gray" v-else>已完成</view>
									<view class="time-row" v-if="index == daojishi_index &&showTime">
										<text class="red">{{minutes}}</text>
										<text>分</text>
										<text class="red">{{seconds}}</text>
										<text>秒</text>
									</view>
								</view>
							</view>
						</view>
						<view class="claim-bnt" :class="{'disabel-bnt': task_setting['linqu_status'] == false}"
							@click="linqu">
							领取奖励</view>
					</view>
				</view>
				<!--商品列表start-->
				<view class="goods-content" v-if="pro_list.length>0">
					<view class="g-title">产品列表</view>
					<view class="goods-list-box">
						<view class="goods-item" v-for="(item,index) in pro_list" :key="index"
							@click="pro_details(item.id)">
							<view class="goods-pic-box">
								<image v-if="!item.url"
									:src="http_host+'/uniapp_template/web/static/images/task/bqb1.jpg'"
									class="goods-pic" mode="aspectFit"></image>
								<image v-else :src="item.url" class="goods-pic" mode="aspectFit"></image>
							</view>
							<view class="goods-info">
								<view class="goods-name">{{item.pro_name}}</view>
								<view class="goods-price">¥{{item.now_price}}</view>
							</view>
						</view>
					</view>
				</view>
				<!--商品列表end-->
			</view>
		</scroll-view>

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
				theme: getApp().globalData.style_color,
				http_host: '',
				nav_index: 0, // tab索引
				status: 1, // 优惠券状态 
				navList: [{
					name: "未使用"
				}, {
					name: "已使用"
				}, {
					name: "已过期"
				}],
				page: 1, // 页数
				list: [], // 优惠券数据
				isLoading: false,
				task_setting: {
					task_id: '',
					task_num: 0,
					task_interval_time: 30,
					task_status: [],
					linqu_status: false
				},
				title: 'createRewardedVideoAd',
				_rewardedVideoAd: {},
				_isLoaded: false,
				minutes: 0,
				seconds: 30,
				timer: null,
				showTime: false,
				task_index: '',
				daojishi_index: -1,
				countdownStorageKey: 'task_countdown',
				pro_list: [],
				page: 1,
				page_size: 20,
				total_page: 1,
				oldscrollTop: 0,
				setMethod: null, //设置获取孙子组件的方法
				hasTaskSettingLoaded: false,
				statusBarHeight: 0,
				// statusBarBgColor: '#0041F0', // 初始背景色
				statusBarBgColor: 'rgba(255,255,255,0)', // 初始：全透明白色
				scrollTop: 0 // 滚动距离
			}
		},
		onLoad: function(options) {
			const that = this;
			uni.getSystemInfo({
				success: (res) => {
					this.statusBarHeight = res.statusBarHeight;
				}
			});
			that.http_host = this.vuex_apiUrl;
			that.get_task_setting();
			that.get_pro_list()
			// console.log("that.http_host==", that.http_host)
			// console.log('user_id', this.vuex_user.user_id)
			// this.startCountdown(30);
		},
		onReady(index) {
			// 组件准备就绪后，等待任务设置加载完成再初始化广告
		},
		onShow() {
			// 页面重新展示时尝试从本地缓存恢复倒计时，避免被跳过
			this.restoreCountdown();
			if (this.hasTaskSettingLoaded) {
				this.get_task_setting(true); // 仅刷新任务状态
			}
		},
		onReachBottom() {
			if (this.page > this.total_page) {
				return;
			}
			this.page += 1;
			this.get_pro_list();
		},
		onPullDownRefresh() {
			uni.startPullDownRefresh();
			this.get_pro_list();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 500)
		},
		onUnload() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		onPageScroll(e) {
			// console.log(e);
			// this.scrollTop = e.scrollTop;
			// // 根据滚动距离计算渐变：滚动0-100px时，从#0041F0渐变到白色
			// const scrollRatio = Math.min(this.scrollTop / 100, 1); // 限制最大值为1

			// // 方案1：通过rgba透明度渐变（推荐，简单）
			// // 蓝色的rgba值：rgba(0, 65, 240, 1 - scrollRatio)
			// this.statusBarBgColor = `rgba(0, 65, 240, ${1 - scrollRatio})`;

			// 方案2：纯色渐变（从#0041F0到#FFFFFF）
			this.scrollTop = e.scrollTop; // 注意：是e.detail.scrollTop，不是e.scrollTop
			// 滚动0-100px时，从#0041F0渐变到#FFFFFF
			// const scrollRatio = Math.min(this.scrollTop / 100, 1); // 限制最大值为1

			const opacity = Math.min(this.scrollTop / 100, 1);

			// 核心：白色（rgb(255,255,255)）+ 动态不透明度
			this.statusBarBgColor = `rgba(255,255,255,${opacity})`;
			return;

			// 核心：计算RGB值从蓝色(0,65,240)过渡到白色(255,255,255)
			const startR = 0,
				startG = 65,
				startB = 240; // 初始蓝色
			const endR = 255,
				endG = 255,
				endB = 255; // 目标白色

			// 计算渐变后的RGB值
			const r = Math.round(startR + (endR - startR) * scrollRatio);
			const g = Math.round(startG + (endG - startG) * scrollRatio);
			const b = Math.round(startB + (endB - startB) * scrollRatio);

			// 设置最终背景色
			this.statusBarBgColor = `rgb(${r}, ${g}, ${b})`;
		},
		methods: {
			//获取广告任务设置
			get_task_setting(skipRestore = false) {
				var that = this;
				that.$common.requestData({
					url: '/uniapp_template/web/index.php?m=advertising_task&a=get_advertsing_task_setting',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode === 0) {
						console.log('st', res)
						that.task_setting = res.data;
						var firstFalseIndex = that.task_setting.task_status.findIndex(item => item === false);
						console.log('firstFalseIndex', firstFalseIndex);
						that.daojishi_index = firstFalseIndex;
						that.$forceUpdate()
						// 初始化广告实例（只在第一次获取任务设置时初始化）
						if (!that._rewardedVideoAd || !that._rewardedVideoAd._initialized) {
							that.initRewardedVideoAd();
						}
						// 只有在不是跳过恢复的情况下才恢复倒计时（用于页面加载时）
						if (!skipRestore) {
							that.restoreCountdown();
						}
						that.hasTaskSettingLoaded = true;
					} else {
						uni.showToast({
							icon: 'none',
							title: res.errmsg
						});
					}
				})
			},
			//获取关联礼包列表
			get_pro_list() {
				var that = this;
				that.$common.requestData({
					url: '/uniapp_template/web/index.php?m=advertising_task&a=get_pro_list',
					data: {
						page: that.page,
						page_size: that.page_size
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					// console.log('产品列表',res);
					if (res.errcode === 0) {
						// console.log('12312321312',res)
						that.pro_list = [...that.pro_list, ...res.data];
						that.total_page = res.totalpage;
					} else {
						uni.showToast({
							icon: 'none',
							title: res.errmsg
						});
					}
				})
			},
			//跳转礼包详情
			pro_details(id) {
				this.$common.diyLinkJump('/giftbag/web/index.php?m=giftbag&a=index#/productDetail?id=' + id)
			},
			showTask(index) {
				var that = this;
				this._isLoaded = false;
				console.log('index', index);
				const rewardedVideoAd = this._rewardedVideoAd = uni.createRewardedVideoAd({
					adpid: this.task_setting.task_id,
					urlCallback: { // 服务器回调透传参数
						userId: this.vuex_user.user_id,
						extra: {
							// http_host: 'https://yun.new.xingdian666.com/',
							// customer_id: '2842',
							http_host: that.http_host,
							customer_id: that.vuex_customer_id,
							task_index: index
						}
					}
				}) // 仅用于HBuilder基座调试 adpid: '1507000689'
				rewardedVideoAd.onLoad(() => {
					this._isLoaded = true;
					console.log('onLoad event');
					// load 完成时才可以调用 show，避免被忽略
				});
				rewardedVideoAd.onError((err) => {
					console.log('onError event', err);
					this._isLoaded = false;
					uni.showToast({
						icon: 'none',
						title: err.errMsg + ',请重新加载此页面'
					});
				});
				rewardedVideoAd.onClose(async (res) => {
					console.log('onClose event', res)
					if (res.isEnded) {
						console.log("正常播放结束 " + res.isEnded);
						// 清除旧的倒计时缓存，因为要开始新的倒计时
						uni.removeStorageSync(this.countdownStorageKey);
						if (this.timer) {
							clearInterval(this.timer);
							this.timer = null;
						}
						this.showTime = false;
					} else {
						console.log("播放中途退出 " + res.isEnded);
					}
					// 跳过恢复倒计时，因为我们要启动新的倒计时
					await this.get_task_setting(true);

					if (this.daojishi_index != -1) {
						this.startCountdown(this.task_setting.task_interval_time, this.daojishi_index);
					}
				});

				// 根据官方建议，等待 load promise 结束再 show
				rewardedVideoAd.load()
					.then(() => rewardedVideoAd.show())
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: '广告视频加载失败，请稍后再试！'
						});
						console.log('load/show rejected', err);
					});
			},
			show(index) {
				var that = this;
				this._isLoaded = true;
				console.log('show', index)
				// if (this._isLoaded && !this.showTime) {
				// 	this.task_setting.task_status[index] = true;
				// 	var firstFalseIndex = this.task_setting.task_status.findIndex(item => item === false);
				// 	this.daojishi_index = firstFalseIndex;
				// 	if(this.daojishi_index != -1){
				// 		// this.showTime = true;
				// 		this.startCountdown(this.task_setting.task_interval_time, this.daojishi_index);
				// 		return;
				// 	}
				// 	this.task_setting.linqu_status = true;
				// 	return;
				// }
				// return;

				if (!this.showTime) {
					// this.task_index = index + 1;
					this.task_index = Number(index) + 1;
					this.showTask(this.task_index);
				}
			},
			// 倒计时任务
			// 直接在methods中使用
			startCountdown(seconds, index) {
				const endTime = Date.now() + (seconds * 1000);
				this.persistCountdown(endTime, index);
				this.initCountdown(endTime, index);
			},
			initCountdown(endTime, index) {
				if (this.timer) {
					clearInterval(this.timer);
				}
				this.daojishi_index = index;
				this.showTime = true;

				const updateClock = () => {
					const diff = Math.floor((endTime - Date.now()) / 1000);
					if (diff <= 0) {
						this.showTime = false;
						this.minutes = 0;
						this.seconds = 0;
						clearInterval(this.timer);
						this.timer = null;
						uni.removeStorageSync(this.countdownStorageKey);
						return;
					}
					this.minutes = Math.floor(diff / 60);
					this.seconds = diff % 60;
				};

				updateClock();
				this.timer = setInterval(updateClock, 1000);
			},
			persistCountdown(endTime, index) {
				uni.setStorageSync(this.countdownStorageKey, {
					endTime,
					daoJiShiIndex: index
				});
			},
			restoreCountdown() {
				const cache = uni.getStorageSync(this.countdownStorageKey);
				if (!cache || !cache.endTime) {
					return;
				}
				const remainingMs = cache.endTime - Date.now();
				if (remainingMs <= 0) {
					uni.removeStorageSync(this.countdownStorageKey);
					return;
				}
				const remainingSeconds = Math.ceil(remainingMs / 1000);
				this.minutes = Math.floor(remainingSeconds / 60);
				this.seconds = remainingSeconds % 60;
				this.initCountdown(cache.endTime, cache.daoJiShiIndex ?? cache.daojishi_index ?? -1);
			},
			linqu() {
				var that = this;
				if (this.task_setting['linqu_status']) {
					that.$common.requestData({
						url: '/uniapp_template/web/index.php?m=advertising_task&a=linqu_award',
						data: {},
						method: 'POST',
						needToken: true
					}).then(res => {
						uni.showToast({
							icon: 'none',
							title: res.errmsg
						});
						this.get_task_setting();
					})
				} else {
					// uni.showToast({
					// 	icon:'none',
					// 	title:'您还未完成全部任务，无法领取奖励'
					// });
					return;
				}
			},
		}
	}
</script>

<style scoped>
	page {
		background-color: #F5F6F9;
	}

	/*商品列表start*/
	.goods-content {
		background-color: white;
		border-radius: 48rpx;
		padding: 30rpx 30rpx 50rpx;
		margin: 24rpx 32rpx;
	}

	.g-title {
		margin-bottom: 24rpx;
	}

	.goods-list-box .goods-item {
		width: 304rpx;
		border-radius: 16rpx;
		border: 1rpx solid #f7f7f7;
		overflow: hidden;
	}

	.goods-info {
		padding: 16rpx;
	}

	.goods-name {
		font-size: 26rpx;
		line-height: 1.4;
		/* 保证行高与字体大小成比例，2 行刚好 */
		height: calc(26rpx * 1.4 * 2);
		/* 固定高度：字体大小 × 行高倍数 × 行数 */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-bottom: 6rpx;
	}

	.goods-price {
		color: #f22121;
		font-size: 28rpx;
	}

	.goods-item .goods-pic {
		width: 304rpx;
		height: 304rpx;
	}

	.goods-list-box {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx 20rpx;
	}

	.task-content {
		position: relative;
		z-index: 20;
		margin: -100rpx 32rpx 10rpx;
		background-color: white;
		border-radius: 48rpx;
		overflow: hidden;
		padding-top: 5rpx;
		padding-bottom: 40rpx;
		/* min-height: 60vh; */
	}

	/*商品列表end*/

	.time-row {
		text-align: center;
		font-size: 22rpx;
		color: #666666;
		margin-top: 4rpx;

		.red {
			color: #ea2222;
			font-size: 24rpx;
		}
	}

	.claim-bnt {
		border: 1px solid #2f74ea;
		box-sizing: border-box;
		background: linear-gradient(180deg, #3584dc 0%, #025bbd 100%);
		color: white;
		width: 90%;
		height: 82rpx;
		line-height: 82rpx;
		font-size: 26rpx;
		border-radius: 50rpx;
		margin: auto;
		text-align: center;
	}

	.disabel-bnt {
		opacity: .6;
	}

	.task-list-group {
		margin-bottom: 70rpx;
	}

	.task-container {
		width: 100%;
		background-color: #F5F6F9;
	}

	.task-main {
		/* 安全距离处理 */
		padding-bottom: 50rpx;
		padding-bottom: calc(50rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(50rpx + env(safe-area-inset-bottom));
	}

	.task-l-gray {
		border-color: #B9B9B9 !important;
		background: linear-gradient(180deg, #e9e9e9 0%, #929292 100%) !important;
	}

	.task-l-bnt {
		padding: 10rpx 30rpx;
		border-radius: 32rpx;
		border: 2rpx solid #2f74ea;
		box-sizing: border-box;
		background: linear-gradient(180deg, #3584dc 0%, #025bbd 100%);
		color: white;
		font-size: 24rpx;
	}

	.task-l-name {
		color: #025BBD;
		font-size: 24rpx;
	}

	.task-v-icon {
		width: 76rpx;
		height: 76rpx;
		margin-right: 12rpx;
	}

	.task-item-left {
		display: flex;
		align-items: center;
		width: 75%;
	}

	.task-l-item-box {
		padding: 20rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.task-l-tit {
		color: #000000;
		font-size: 32rpx;
		margin-bottom: 8rpx;
	}

	.task-l-tips {
		font-size: 22rpx;
		color: #B1B1B1;
	}

	.task-gift-icon {
		position: absolute;
		right: 32rpx;
		top: 10rpx;
		width: 110rpx;
		height: 110rpx;
		z-index: 2;
	}

	.task-title-group {
		position: relative;
		border-radius: 48rpx 48rpx 0rpx 0rpx;
		background: linear-gradient(180deg, #d1e9fa 0%, #ffffff 100%);
		padding: 32rpx 32rpx 16rpx;
	}

	/* 	.task-content {
		position: relative;
		z-index: 20;
		margin: -100rpx 32rpx 10rpx;
		background-color: white;
		border-radius: 48rpx;
		overflow: hidden;
		padding-top: 5rpx;
		min-height: 60vh;
	} */

	.top-box {
		position: relative;
	}

	.top-text-box {
		position: absolute;
		bottom: 138rpx;
		left: 48rpx;
		z-index: 2;
		color: white;
		font-size: 52rpx;
	}

	.top-t-bg {
		width: 100%;
	}

	.status-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
		/* 添加过渡动画，让渐变更丝滑 */
		transition: background-color 0.2s ease;
	}
</style>