<template>
	<view class="watch-page">
		<view class="watch-top" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="top-left">
				<view class="top-badge">免</view>
				<text class="top-tip" v-if="isPureRewardAd">观看激励视频，完成任务</text>
				<text class="top-tip" v-else>观看{{ needSeconds }}秒，完成任务</text>
			</view>
			<view class="top-right">
				<text class="top-countdown" v-if="playAsLocalVideo">{{ countdown }}s</text>
				<view class="top-close" @tap.stop="handleClose">
					<text class="top-close-icon">×</text>
				</view>
			</view>
		</view>

		<view class="watch-body">
			<video
				v-if="videoInfo.url && playAsLocalVideo"
				id="signWatchPlayer"
				:key="videoInfo.key || videoInfo.url"
				:src="videoInfo.url"
				:autoplay="true"
				:muted="false"
				:playsinline="true"
				:show-fullscreen-btn="false"
				:show-center-play-btn="true"
				:show-play-btn="false"
				:enable-progress-gesture="false"
				:controls="false"
				object-fit="contain"
				class="watch-video"
				@play="onVideoPlay"
				@ended="onVideoEnded"
				@error="onVideoError"
			></video>

			<view
				class="watch-play-mask"
				v-if="videoInfo.url && playAsLocalVideo && !videoPlaying"
				@tap="startVideoPlay"
			>
				<u-icon name="play-circle-fill" size="100" color="#ffffff"></u-icon>
				<text>点击播放视频</text>
			</view>

			<view class="watch-reward-placeholder" v-if="isPureRewardAd">
				<view class="reward-icon-wrap">
					<u-icon name="play-circle-fill" size="100" color="#ffffff"></u-icon>
				</view>
				<text class="reward-tip">激励视频任务</text>
				<text class="reward-sub">观看完成后将自动标记任务完成</text>
				<view class="reward-finish-btn" @tap="submitAndBack">
					<text>完成观看</text>
				</view>
			</view>
		</view>

		<view class="watch-bottom">
			<text class="video-title">{{ videoInfo.name || '观看任务' }}</text>
			<text class="video-progress">今日进度 {{ progressCurrent }}/{{ progressTotal }}</text>
		</view>
	</view>
</template>

<script>
	const STORAGE_KEY = 'sign_watch_payload'
	const COOLDOWN_STORAGE_KEY = 'sign_task_watch_cooldown'
	const DEFAULT_COOLDOWN_SECONDS = 5
	const DEFAULT_WATCH_SECONDS = 10

	export default {
		data() {
			return {
				statusBarHeight: 20,
				http_host: '',
				videoInfo: {},
				needSeconds: DEFAULT_WATCH_SECONDS,
				countdown: DEFAULT_WATCH_SECONDS,
				elapsedSeconds: 0,
				canFinish: false,
				videoPlaying: false,
				submitting: false,
				countdownTimer: null,
				progressCurrent: 1,
				progressTotal: 1,
				playStarted: false,
				exitingConfirm: false,
				isLeaving: false,
				packId: 0,
				videoWaitSeconds: DEFAULT_COOLDOWN_SECONDS,
				rewardFallback: false
			}
		},
		computed: {
			// 激励失败绕过：前端播本地，完成仍记 type=2
			playAsLocalVideo() {
				return this.rewardFallback || Number(this.videoInfo.task_type) !== 2
			},
			isPureRewardAd() {
				return Number(this.videoInfo.task_type) === 2 && !this.rewardFallback
			}
		},
		onLoad() {
			this.http_host = this.vuex_apiUrl || ''
			const sys = uni.getSystemInfoSync()
			this.statusBarHeight = sys.statusBarHeight || 20
			if (this.initPayload()) {
				this.syncDurationFromApi()
			}
		},
		onUnload() {
			this.clearCountdown()
			uni.removeStorageSync(STORAGE_KEY)
		},
		onBackPress() {
			// navigateBack 会再次触发 onBackPress，离开中直接拦截，避免弹窗死循环
			if (this.isLeaving || this.exitingConfirm || this.submitting) return true
			if (this.canFinish && this.elapsedSeconds >= this.needSeconds && this.playAsLocalVideo) {
				this.submitAndBack()
				return true
			}
			this.confirmExit()
			return true
		},
		methods: {
			todayKey() {
				const d = new Date()
				const m = String(d.getMonth() + 1).padStart(2, '0')
				const day = String(d.getDate()).padStart(2, '0')
				return `${d.getFullYear()}-${m}-${day}`
			},
			setWatchCooldown() {
				const seconds = Math.max(0, parseInt(this.videoWaitSeconds, 10) || 0)
				uni.setStorageSync(COOLDOWN_STORAGE_KEY, {
					date: this.todayKey(),
					endTime: Date.now() + seconds * 1000
				})
			},
			resolveWatchSeconds(video = {}) {
				if (Number(video.task_type) === 2 && !this.rewardFallback) {
					return 0
				}
				const raw = video.need_seconds != null ? video.need_seconds : video.duration
				const seconds = parseInt(raw, 10)
				return Math.max(1, seconds > 0 ? seconds : DEFAULT_WATCH_SECONDS)
			},
			prefixDomainPath(path) {
				if (!path) return ''
				const httpRep = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/
				if (!httpRep.test(path)) {
					if (path.indexOf('/resources/') === -1) {
						path = `/resources/${path}`
					}
					path = `${this.http_host || this.vuex_apiUrl || ''}${path}`
				}
				return path
			},
			initPayload() {
				const payload = uni.getStorageSync(STORAGE_KEY)
				if (!payload || !payload.video) {
					uni.showToast({
						title: '任务数据丢失',
						icon: 'none'
					})
					setTimeout(() => this.goBackSignIn(), 800)
					return false
				}
				const video = payload.video
				this.packId = parseInt(payload.pack_id, 10) || 0
				this.rewardFallback = !!payload.rewardFallback
				this.videoInfo = {
					...video,
					url: video.url ? this.prefixDomainPath(video.url) : ''
				}
				this.applyNeedSeconds(payload.needSeconds, video)
				const waitSec = parseInt(payload.videoWaitSeconds, 10)
				this.videoWaitSeconds = Number.isFinite(waitSec) && waitSec >= 0 ? waitSec : DEFAULT_COOLDOWN_SECONDS
				this.progressCurrent = payload.progressCurrent || 1
				this.progressTotal = payload.progressTotal || 1
				return true
			},
			applyNeedSeconds(needSeconds, video = {}) {
				if (Number(video.task_type) === 2 && !this.rewardFallback) {
					this.needSeconds = 0
					this.countdown = 0
					this.elapsedSeconds = 0
					this.canFinish = true
					return
				}
				const seconds = Math.max(
					1,
					parseInt(needSeconds != null ? needSeconds : this.resolveWatchSeconds(video), 10) || DEFAULT_WATCH_SECONDS
				)
				this.needSeconds = seconds
				this.countdown = seconds
				this.elapsedSeconds = 0
				this.canFinish = false
			},
			syncDurationFromApi() {
				const that = this
				// 激励失败本地绕过：时长与片源已由 payload 定好，勿被 today 任务覆盖成空 url
				if (that.rewardFallback) {
					that.startPlayAfterReady()
					return
				}
				const reqData = {}
				if (that.packId > 0) {
					reqData.pack_id = that.packId
				}
				that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=task&a=today',
					data: reqData,
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						const data = res.data || {}
						const list = data.video_list || []
						const found = list.find(item => item.key === that.videoInfo.key)
						if (found) {
							const seconds = that.resolveWatchSeconds(found)
							that.applyNeedSeconds(seconds, found)
							that.videoInfo = {
								...that.videoInfo,
								...found,
								url: found.url ? that.prefixDomainPath(found.url) : that.videoInfo.url
							}
						}
					}
				}).catch(e => {
					console.error('同步观看时长失败，沿用本地缓存', e)
				}).finally(() => {
					that.startPlayAfterReady()
				})
			},
			startPlayAfterReady() {
				if (this.playStarted) return
				this.playStarted = true
				if (!this.playAsLocalVideo) {
					return
				}
				setTimeout(() => {
					this.startVideoPlay()
				}, 300)
			},
			getVideoContext() {
				return uni.createVideoContext('signWatchPlayer', this)
			},
			startVideoPlay() {
				if (!this.playAsLocalVideo) {
					return
				}
				const ctx = this.getVideoContext()
				if (ctx && ctx.play) {
					ctx.play()
				}
				if (!this.countdownTimer) {
					this.startCountdown()
				}
			},
			onVideoPlay() {
				this.videoPlaying = true
				if (!this.countdownTimer) {
					this.startCountdown()
				}
			},
			onVideoEnded() {
				this.elapsedSeconds = Math.max(this.elapsedSeconds, this.needSeconds)
				this.countdown = 0
				this.canFinish = true
				this.clearCountdown()
			},
			onVideoError() {
				uni.showToast({
					title: '视频加载失败',
					icon: 'none'
				})
			},
			startCountdown() {
				this.clearCountdown()
				this.countdownTimer = setInterval(() => {
					this.elapsedSeconds++
					if (this.countdown > 0) {
						this.countdown--
					}
					if (this.countdown <= 0) {
						this.canFinish = true
						this.clearCountdown()
					}
				}, 1000)
			},
			clearCountdown() {
				if (this.countdownTimer) {
					clearInterval(this.countdownTimer)
					this.countdownTimer = null
				}
			},
			confirmExit() {
				if (this.isLeaving || this.exitingConfirm || this.submitting) return
				this.exitingConfirm = true
				try {
					const ctx = this.getVideoContext()
					if (ctx && ctx.pause) ctx.pause()
				} catch (e) {}
				this.clearCountdown()
				const that = this
				// App 原生 video 会挡住自定义弹层点击，改用系统弹窗
				uni.showModal({
					title: '提示',
					content: '现在离开就没法解锁哦',
					confirmText: '继续浏览',
					cancelText: '放弃观看',
					success(res) {
						if (that.isLeaving) return
						if (res.confirm) {
							that.exitingConfirm = false
							that.continueWatch()
							return
						}
						// 放弃观看：保持 exitingConfirm，避免回退过程再次弹窗
						that.giveUpWatch()
					},
					fail() {
						if (that.isLeaving) return
						that.giveUpWatch()
					}
				})
			},
			handleClose() {
				if (this.isLeaving || this.submitting || this.exitingConfirm) return
				if (this.isPureRewardAd) {
					this.confirmExit()
					return
				}
				if (this.canFinish && this.elapsedSeconds >= this.needSeconds) {
					this.submitAndBack()
					return
				}
				this.confirmExit()
			},
			continueWatch() {
				this.startVideoPlay()
				if (!this.canFinish && !this.countdownTimer) {
					this.startCountdown()
				}
			},
			giveUpWatch() {
				this.goBackSignIn()
			},
			goBackSignIn() {
				if (this.isLeaving) return
				this.isLeaving = true
				this.exitingConfirm = true
				this.clearCountdown()
				try {
					const ctx = this.getVideoContext()
					if (ctx && ctx.stop) ctx.stop()
				} catch (e) {}
				try {
					uni.removeStorageSync(STORAGE_KEY)
				} catch (e) {}

				// 不要用 navigateBack：在 App 上会再次触发 onBackPress，导致弹窗死循环
				// routeType=2 → redirectTo，替换当前观看页
				this.$common.diyLinkJump('/zjxysl_task/pages/sign_in', '', true, 2)
			},
			exitWatch(navigate = true) {
				if (navigate) {
					this.goBackSignIn()
					return
				}
				this.clearCountdown()
				try {
					const ctx = this.getVideoContext()
					if (ctx && ctx.stop) ctx.stop()
				} catch (e) {}
			},
			submitAndBack() {
				const that = this
				if (that.isLeaving) return
				if (that.submitting) return
				if (that.playAsLocalVideo) {
					if (!that.canFinish || that.elapsedSeconds < that.needSeconds) {
						uni.showToast({
							title: '请继续观看',
							icon: 'none'
						})
						return
					}
				}
				that.submitting = true
				uni.showLoading({
					title: '提交中',
					mask: true
				})
				const reqData = {
					task_key: that.videoInfo.key,
					task_detail_id: that.videoInfo.task_detail_id,
					task_type: that.videoInfo.task_type,
					video_id: that.rewardFallback ? 0 : (that.videoInfo.video_id || 0),
					watch_seconds: that.elapsedSeconds
				}
				if (that.packId > 0) {
					reqData.pack_id = that.packId
				}
				that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=task&a=watch_complete',
					data: reqData,
					method: 'POST',
					needToken: true
				}).then(res => {
					uni.hideLoading()
					if (res && res.errcode == 0) {
						that.setWatchCooldown()
						uni.showToast({
							title: '任务完成',
							icon: 'success'
						})
					} else {
						uni.showToast({
							title: (res && res.errmsg) || '提交失败',
							icon: 'none'
						})
					}
					// 已看满仍返回，避免卡在观看页
					setTimeout(() => {
						that.goBackSignIn()
					}, 500)
				}).catch(e => {
					uni.hideLoading()
					console.error('提交观看失败', e)
					uni.showToast({
						title: (e && e.errmsg) || '提交失败',
						icon: 'none'
					})
					setTimeout(() => {
						that.goBackSignIn()
					}, 500)
				}).finally(() => {
					that.submitting = false
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.watch-page {
		min-height: 100vh;
		background: #000;
		display: flex;
		flex-direction: column;
	}

	.watch-top {
		position: relative;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16rpx 24rpx 20rpx;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0));

		.top-left {
			display: flex;
			align-items: center;
			flex: 1;
			min-width: 0;
		}

		.top-badge {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			background: #22c55e;
			color: #fff;
			font-size: 22rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 12rpx;
			flex-shrink: 0;
		}

		.top-tip {
			font-size: 28rpx;
			color: #fff;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.top-right {
			display: flex;
			align-items: center;
			margin-left: 16rpx;
			flex-shrink: 0;
		}

		.top-countdown {
			font-size: 28rpx;
			color: #fff;
			margin-right: 16rpx;
		}

		.top-close {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.28);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.top-close-icon {
			font-size: 44rpx;
			line-height: 1;
			color: #fff;
			font-weight: 300;
		}
	}

	.watch-body {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;

		.watch-video {
			width: 100%;
			height: 100%;
			min-height: 60vh;
		}

		.watch-play-mask,
		.watch-reward-placeholder {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background: rgba(0, 0, 0, 0.35);

			text {
				font-size: 28rpx;
				color: #fff;
				margin-top: 20rpx;
			}
		}

		.reward-sub {
			font-size: 24rpx !important;
			opacity: 0.75;
		}

		.reward-finish-btn {
			margin-top: 40rpx;
			padding: 20rpx 48rpx;
			border-radius: 40rpx;
			background: #E93323;

			text {
				margin-top: 0;
				font-size: 28rpx;
				color: #fff;
				font-weight: 600;
			}
		}
	}

	.watch-bottom {
		padding: 28rpx 32rpx calc(28rpx + env(safe-area-inset-bottom));
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0));

		.video-title {
			display: block;
			font-size: 34rpx;
			color: #fff;
			font-weight: 600;
			margin-bottom: 12rpx;
		}

		.video-progress {
			display: block;
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.72);
		}
	}
</style>
