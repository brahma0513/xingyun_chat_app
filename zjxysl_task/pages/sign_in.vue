<template>
	<view class="sign-in-page">
		<!-- 插屏广告：后台开关 + 独立 adpid；加载成功后自动 show -->
		<ad-interstitial
			v-if="interstitialAdEnable && interstitialAdId"
			ref="adInterstitial"
			:adpid="interstitialAdId"
			:loadnext="true"
			@load="onadload"
			@close="onadclose"
			@error="onaderror"
		/>

		<!-- 临时公告：服务器迁移结束后删除本块及 maintenanceTip -->
		<view class="maintenance-notice" v-if="maintenanceTip">
			<u-notice-bar :text="maintenanceTip" direction="row" icon="volume" :speed="70" color="#b45309"
				bgColor="#fff7ed" fontSize="14"></u-notice-bar>
		</view>
		<view class="closed-tip" v-if="taskDayTip">
			<text>{{ taskDayTip }}</text>
		</view>
		<view class="closed-tip closed-tip--time" v-if="signClaimTimeTip">
			<text>{{ signClaimTimeTip }}</text>
		</view>
		<view class="closed-tip closed-tip--pack" v-if="packRequiredTip">
			<text>{{ packRequiredTip }}</text>
		</view>

		<!-- 顶部奖励横幅 -->
		<view class="reward-banner">
			<view class="banner-content">
				<text class="banner-label">今日预计获得</text>
				<view class="banner-points">
					<text class="points-num">{{ signInfo.expectedReward || '0.0000' }}</text>
					<text class="points-unit">积分</text>
				</view>
			</view>
		</view>
		
		<!-- 信息流广告：后台开关 + 独立 adpid（整页只挂一份） -->
		<view class="ad-view" v-if="feedAdEnable && feedAdId">
			<ad :adpid="feedAdId" @load="onload2" @close="onclose2" @error="onerror2"></ad>
		</view>

		<!-- 看视频任务 -->
		<view class="task-block">
			<view class="block-header">
				<text class="block-title">看视频任务</text>
				<view class="block-reset">
					<u-icon name="reload" size="14" color="#999"></u-icon>
					<text>每天0点重置任务</text>
				</view>
			</view>

			<view class="task-card" v-for="(item, index) in taskDetails" :key="item.id">
				<view class="card-left">
					<view class="play-icon">
						<u-icon name="play-right-fill" size="22" color="#E93323"></u-icon>
					</view>
				</view>
				<view class="card-main">
					<text class="card-title">{{ item.name }}</text>
					<text class="card-desc">{{ Number(item.task_type) === 2 ? '观看激励视频' : '观看完整视频' }}</text>
				</view>
				<view class="card-action">
					<view class="watch-btn" :class="{
							'watch-btn--done': item.is_done,
							'watch-btn--disabled': !canWatchDetail(item) || cooldownRemaining > 0
						}" @click="goWatch(item)">
						<text v-if="item.is_done">已完成</text>
						<text v-else-if="cooldownRemaining > 0">{{ cooldownRemaining }}s</text>
						<text v-else>去观看</text>
					</view>
					<text
						class="card-progress">{{ item.watched_count || 0 }}/{{ item.total_quantity || item.task_quantity || 1 }}</text>
				</view>
			</view>

			<view class="empty-state" v-if="!loading && taskDetails.length === 0">
				<u-empty mode="data" text="暂无签到任务，请联系管理员配置"></u-empty>
			</view>
			
			
		</view>

		<!-- 底部领取 -->
		<view class="bottom-bar">
			<view class="claim-btn"
				:class="{ 'claim-btn--disabled': !canDoTask || !canSign || signInfo.hasSigned || !canClaimNow }"
				@click="doSign">
				<text v-if="signing">领取中...</text>
				<text v-else-if="signInfo.hasSigned">今日奖励已领取</text>
				<text v-else-if="!canDoTask">暂无释放中的算力包</text>
				<text v-else-if="!canClaimNow">不在领取时间段内</text>
				<text v-else-if="!canSign">请先完成全部任务</text>
				<text v-else>领取奖励</text>
			</view>
		</view>

		<!-- 成功弹窗 -->
		<u-popup :show="showSuccessPopup" mode="center" :round="24" @close="showSuccessPopup = false">
			<view class="success-modal">
				<text class="success-title">签到成功</text>
				<text class="success-desc">今日奖励已发放至账户</text>
				<text class="success-reward">+{{ claimedReward || signInfo.expectedReward }} 积分</text>
				<view class="success-btn" @click="showSuccessPopup = false">
					<text>确认</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const WATCH_STORAGE_KEY = 'sign_watch_payload'
	const COOLDOWN_STORAGE_KEY = 'sign_task_watch_cooldown'
	const DEFAULT_COOLDOWN_SECONDS = 5
	const DEFAULT_WATCH_SECONDS = 10

	export default {
		data() {
			return {
				loading: true,
				// 临时公告文案，迁移结束后改为 '' 即可隐藏
				maintenanceTip: '',
				taskDayTip: '',
				signClaimTimeTip: '',
				canClaimNow: true,
				packRequiredTip: '',
				canDoTask: true,
				taskDetails: [],
				videoList: [],
				signInfo: {
					hasSigned: false,
					staticReward: '0.0000',
					dynamicReward: '0.0000',
					expectedReward: '0.0000'
				},
				claimedReward: '',
				signing: false,
				showSuccessPopup: false,
				cooldownRemaining: 0,
				cooldownTimer: null,
				videoWaitSeconds: DEFAULT_COOLDOWN_SECONDS,
				http_host: '',
				rewardAdId: '',
				feedAdId: '',
				feedAdEnable: false,
				interstitialAdId: '',
				interstitialAdEnable: false,
				_interstitialAutoShown: false,
				rewardFallbackVideo: null,
				rewardAdShowing: false,
				_rewardedVideoAd: null,
				_rewardAdInited: false,
				_rewardAdLoaded: false,
				_rewardAdBoundPid: '',
				_preloadingRewardAd: false,
				_pendingRewardVideo: null,
				_rewardFallbackOpening: false,
				_rewardAdLockTimer: null,
				_rewardAdDiagAt: 0,
				_rewardAdConfigLoaded: false,
				// 正式环境用 0（走 status 正式任务包）；线下调试可改成指定 pack_id 并改用 status_test
				testPackId: 0
			}
		},
		computed: {
			watchedCount() {
				return this.videoList.filter(v => v.watched).length
			},
			canSign() {
				if (!this.taskDetails.length) return false
				return this.taskDetails.every(item => Number(item.is_done) === 1)
			}
		},
		onLoad() {
			this.http_host = this.vuex_apiUrl || ''
			this.syncCooldown()
			// 广告位配置只拉一次；任务进度走 status
			this.loadRewardAdConfig()
			this.loadPageData(true)
		},
		onShow() {
			// 从激励广告返回时 SDK 偶发不触发 onClose，解锁避免「去观看」全卡死
			this.resetRewardAdLock()
			this.syncCooldown()
			this.startCooldownTimer()
			if (!this.loading) {
				this.loadPageData(false)
			}
		},
		onHide() {
			this.stopCooldownTimer()
		},
		onUnload() {
			this.stopCooldownTimer()
			this.clearRewardAdLockTimer()
			this._rewardAdInited = false
			this._rewardedVideoAd = null
			this._rewardAdLoaded = false
			this._rewardAdBoundPid = ''
			this._preloadingRewardAd = false
			this._pendingRewardVideo = null
			this.rewardAdShowing = false
			this._rewardFallbackOpening = false
			this._rewardAdConfigLoaded = false
			this._interstitialAutoShown = false
		},
		methods: {
			todayKey() {
				const d = new Date()
				const m = String(d.getMonth() + 1).padStart(2, '0')
				const day = String(d.getDate()).padStart(2, '0')
				return `${d.getFullYear()}-${m}-${day}`
			},
			clearRewardAdLockTimer() {
				if (this._rewardAdLockTimer) {
					clearTimeout(this._rewardAdLockTimer)
					this._rewardAdLockTimer = null
				}
			},
			resetRewardAdLock() {
				this.clearRewardAdLockTimer()
				this.rewardAdShowing = false
				this._pendingRewardVideo = null
				this._rewardFallbackOpening = false
			},
			armRewardAdLockTimeout() {
				this.clearRewardAdLockTimer()
				this._rewardAdLockTimer = setTimeout(() => {
					if (!this.rewardAdShowing) return
					const cost = this._rewardAdDiagAt ? (Date.now() - this._rewardAdDiagAt) : 12000
					console.warn('[激励] 锁超时', {
						cost,
						pending: this._pendingRewardVideo && this._pendingRewardVideo.key,
						hint: '12s内无 onClose/onError/load失败；看上面最后停在 3-load / 4-load成功 / 5-show / 6-show'
					})
					this.resetRewardAdLock()
					uni.showToast({
						icon: 'none',
						title: '广告响应超时，请重试'
					})
				}, 12000)
			},
			rewardAdDiagCost() {
				return this._rewardAdDiagAt ? (Date.now() - this._rewardAdDiagAt) : -1
			},
			getWatchCooldownRemaining() {
				const raw = uni.getStorageSync(COOLDOWN_STORAGE_KEY)
				if (!raw || raw.date !== this.todayKey() || !raw.endTime) {
					return 0
				}
				const remain = Math.ceil((raw.endTime - Date.now()) / 1000)
				if (remain <= 0) {
					uni.removeStorageSync(COOLDOWN_STORAGE_KEY)
					return 0
				}
				return remain
			},
			resolveWatchSeconds(video = {}) {
				if (Number(video.task_type) === 2) {
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
			syncCooldown() {
				this.cooldownRemaining = this.getWatchCooldownRemaining()
			},
			startCooldownTimer() {
				this.stopCooldownTimer()
				if (this.cooldownRemaining <= 0) return
				this.cooldownTimer = setInterval(() => {
					this.syncCooldown()
					if (this.cooldownRemaining <= 0) {
						this.stopCooldownTimer()
					}
				}, 1000)
			},
			stopCooldownTimer() {
				if (this.cooldownTimer) {
					clearInterval(this.cooldownTimer)
					this.cooldownTimer = null
				}
			},
			normalizeVideoItem(item) {
				const duration = this.resolveWatchSeconds(item)
				return {
					...item,
					watched: !!item.watched,
					duration: Number(item.task_type) === 2 ? 0 : duration,
					need_seconds: Number(item.task_type) === 2 ? 0 : duration,
					url: item.url ? this.prefixDomainPath(item.url) : ''
				}
			},
			applyPageData(data) {
				this.taskDayTip = data.task_day_tip || ''
				this.signClaimTimeTip = data.sign_claim_time_tip || ''
				this.canClaimNow = data.can_claim_now !== 0 && data.can_claim_now !== false
				this.canDoTask = data.can_do_task !== 0 && data.can_do_task !== false
				this.packRequiredTip = this.canDoTask ? '' : (data.pack_required_tip || '暂无释放中的算力包，请先购买后再做任务')
				// 广告位改由 reward_ad_config 单独拉取；status 若仍带字段仅作兜底
				if (!this._rewardAdConfigLoaded) {
					if (data.reward_ad_id) {
						this.rewardAdId = data.reward_ad_id || ''
					}
					if (data.reward_fallback_video) {
						this.rewardFallbackVideo = data.reward_fallback_video || null
					}
				}
				const waitSec = parseInt(data.video_wait_seconds, 10)
				this.videoWaitSeconds = Number.isFinite(waitSec) && waitSec >= 0 ? waitSec : DEFAULT_COOLDOWN_SECONDS
				this.taskDetails = (data.task_details || []).map(item => ({
					...item,
					watched_count: item.watched_count || 0,
					total_quantity: item.total_quantity || item.task_quantity || 1,
					is_done: Number(item.is_done) === 1
				}))
				const wasSigned = this.signInfo.hasSigned
				const newHasSigned = !!data.today_signed
				const nextSignInfo = {
					hasSigned: newHasSigned,
					staticReward: data.static_reward || '0.0000',
					dynamicReward: data.dynamic_reward || '0.0000',
					expectedReward: this.signInfo.expectedReward || '0.0000'
				}
				if (!newHasSigned) {
					nextSignInfo.expectedReward = data.total_reward || '0.0000'
				} else if (!wasSigned && nextSignInfo.expectedReward === '0.0000') {
					nextSignInfo.expectedReward = data.total_reward || '0.0000'
				}
				this.signInfo = nextSignInfo
				this.videoList = (data.video_list || []).map(item => this.normalizeVideoItem(item))
				// 已有广告实例则只尝试预加载；未初始化且已有 adpid 则初始化一次
				this.$nextTick(() => {
					if (this._rewardAdInited) {
						this.preloadRewardAd()
					} else if (this.rewardAdId) {
						this.initRewardedVideoAd()
					}
				})
			},
			/** 进页拉取一次广告位配置（不随 status 反复请求） */
			loadRewardAdConfig() {
				const that = this
				if (that._rewardAdConfigLoaded && that.rewardAdId) {
					return Promise.resolve()
				}
				return that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=sign&a=reward_ad_config',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res && res.errcode == 0) {
						const data = res.data || {}
						that.rewardAdId = data.reward_ad_id || ''
						that.feedAdId = data.feed_ad_id || ''
						that.feedAdEnable = Number(data.feed_ad_enable) === 1
						that.interstitialAdId = data.interstitial_ad_id || ''
						that.interstitialAdEnable = Number(data.interstitial_ad_enable) === 1
						that.rewardFallbackVideo = data.reward_fallback_video || null
						that._rewardAdConfigLoaded = true
						that.$nextTick(() => {
							that.initRewardedVideoAd()
						})
					}
				}).catch(e => {
					console.error('加载激励广告配置失败', e)
				})
			},
			getFirstUnfinishedRewardVideo() {
				return this.videoList.find(v => Number(v.task_type) === 2 && !v.watched) || null
			},
			/** 稳定透传字段；任务由后端按激励顺序完成，不传 task_key */
			buildRewardAdExtra() {
				const extra = {
					biz: 'zjxysl_sign',
					http_host: this.http_host || this.vuex_apiUrl || '',
					customer_id: this.vuex_customer_id,
					customer_id_en: this.vuex_customer_id_en,
					from_client: this.vuex_client || '',
					task_type: 2
				}
				if (this.testPackId > 0) {
					extra.pack_id = this.testPackId
				}
				return extra
			},
			getRewardAdErrorCode(err) {
				if (!err) return ''
				if (err.code != null && err.code !== '') return err.code
				if (err.errCode != null && err.errCode !== '') return err.errCode
				if (err.detail && err.detail.errCode != null && err.detail.errCode !== '') {
					return err.detail.errCode
				}
				if (err.detail && err.detail.code != null && err.detail.code !== '') {
					return err.detail.code
				}
				return ''
			},
			formatRewardAdErrorTip(err, fallback = '广告加载失败，请稍后再试') {
				const code = this.getRewardAdErrorCode(err)
				let base = (err && err.errMsg) ? String(err.errMsg) : fallback
				if (base.length > 22) {
					base = fallback
				}
				return code !== '' ? `${base}(${code})` : base
			},
			isRewardAdFallbackCode(err) {
				return Number(this.getRewardAdErrorCode(err)) === -5005
			},
			openRewardFallbackWatch(taskVideo) {
				if (this._rewardFallbackOpening) return
				const fallback = this.rewardFallbackVideo
				if (!taskVideo || !fallback || !fallback.url) {
					uni.showToast({
						icon: 'none',
						title: '暂无本地视频可绕过，请稍后再试'
					})
					return
				}
				this._rewardFallbackOpening = true
				const needSeconds = Math.max(
					1,
					parseInt(fallback.need_seconds != null ? fallback.need_seconds : fallback.duration, 10) ||
					DEFAULT_WATCH_SECONDS
				)
				uni.setStorageSync(WATCH_STORAGE_KEY, {
					video: {
						...taskVideo,
						// 完成仍按激励任务记账；仅播放用本地片
						task_type: 2,
						video_id: 0,
						name: fallback.name || taskVideo.name || '本地视频',
						url: this.prefixDomainPath(fallback.url),
						duration: needSeconds,
						need_seconds: needSeconds
					},
					needSeconds: needSeconds,
					videoWaitSeconds: this.videoWaitSeconds,
					progressCurrent: this.watchedCount + 1,
					progressTotal: this.videoList.length,
					pack_id: this.testPackId || 0,
					rewardFallback: true
				})
				setTimeout(() => {
					this._rewardFallbackOpening = false
					this.$common.diyLinkJump('/zjxysl_task/pages/sign_watch', '', true, 2)
				}, 50)
			},
			handleRewardAdFail(err) {
				if (!this.rewardAdShowing && !this._pendingRewardVideo) {
					return
				}
				const pending = this._pendingRewardVideo || this.getFirstUnfinishedRewardVideo()
				this._rewardAdLoaded = false
				this.resetRewardAdLock()
				// -5005：静默切本地视频，不提示图一/图二
				if (this.isRewardAdFallbackCode(err) && pending) {
					this.openRewardFallbackWatch(pending)
					return
				}
				// 其它错误：仅提示图二样式（文案+错误码）
				uni.showToast({
					icon: 'none',
					title: this.formatRewardAdErrorTip(err)
				})
				setTimeout(() => {
					this.preloadRewardAd()
				}, 500)
			},
			/**
			 * 激励广告：整页只 create 一次 + 预加载；点击尽量直接 show
			 * 任务完成由后端按激励顺序入账，urlCallback 不传 task_key
			 */
			initRewardedVideoAd() {
				if (this.signInfo.hasSigned || !this.canDoTask) return null
				const adpid = String(this.rewardAdId || '').trim()
				if (!adpid || typeof uni.createRewardedVideoAd !== 'function') return null
				if (!this.getFirstUnfinishedRewardVideo()) return null

				const that = this
				if (that._rewardAdBoundPid && that._rewardAdBoundPid !== adpid) {
					that._rewardAdInited = false
					that._rewardedVideoAd = null
					that._rewardAdLoaded = false
					that._preloadingRewardAd = false
				}
				if (that._rewardAdInited && that._rewardedVideoAd && that._rewardAdBoundPid === adpid) {
					that.preloadRewardAd()
					return that._rewardedVideoAd
				}

				const userId = (that.vuex_user && that.vuex_user.user_id) ? that.vuex_user.user_id : ''
				const ad = uni.createRewardedVideoAd({
					adpid: adpid,
					urlCallback: {
						userId: userId,
						extra: that.buildRewardAdExtra()
					}
				})
				
				// uni.showLoading({
				// 	title: '广告载入中'
				// });

				ad.onLoad(() => {
					// uni.hideLoading()
					that._rewardAdLoaded = true
					that._preloadingRewardAd = false
					console.log('[激励] onLoad', {
						cost: that.rewardAdDiagCost(),
						showing: that.rewardAdShowing
					})
				})
				ad.onError((err) => {
					// uni.hideLoading()
					that._rewardAdLoaded = false
					that._preloadingRewardAd = false
					console.error('[激励] onError', {
						cost: that.rewardAdDiagCost(),
						code: err && err.code,
						errMsg: err && err.errMsg,
						detail: err && err.detail,
						adpid: that.rewardAdId,
						showing: that.rewardAdShowing
					})
					if (that.rewardAdShowing) {
						that.handleRewardAdFail(err)
					}
				})
				ad.onClose((res) => {
					// uni.hideLoading()
					console.log('[激励] onClose', {
						cost: that.rewardAdDiagCost(),
						isEnded: !!(res && res.isEnded),
						res
					})
					that._rewardAdLoaded = false
					that._preloadingRewardAd = false
					that.resetRewardAdLock()
					if (res && res.isEnded) {
						that.setWatchCooldown()
						uni.showToast({
							title: '观看完成',
							icon: 'success'
						})
						setTimeout(() => {
							that.loadPageData(false)
						}, 1200)
						setTimeout(() => {
							that.loadPageData(false)
						}, 3000)
					} else {
						uni.showToast({
							title: '需观看完整视频才能完成任务',
							icon: 'none'
						})
						setTimeout(() => {
							that.preloadRewardAd()
						}, 300)
					}
				})

				that._rewardedVideoAd = ad
				that._rewardAdInited = true
				that._rewardAdBoundPid = adpid
				that._rewardAdLoaded = false
				console.log('[激励] create一次完成', {
					adpid
				})
				that.preloadRewardAd()
				return ad
			},
			preloadRewardAd() {
				if (this.rewardAdShowing) return
				if (this.signInfo.hasSigned || !this.canDoTask) return
				if (!this.getFirstUnfinishedRewardVideo()) return
				const ad = this._rewardedVideoAd || this.initRewardedVideoAd()
				if (!ad) return
				if (this._rewardAdLoaded || this._preloadingRewardAd) return

				this._preloadingRewardAd = true
				console.log('[激励] 预加载 load 开始')
				ad.load()
					.then(() => {
						this._rewardAdLoaded = true
						this._preloadingRewardAd = false
						console.log('[激励] 预加载 load 成功')
					})
					.catch((err) => {
						this._rewardAdLoaded = false
						this._preloadingRewardAd = false
						console.error('[激励] 预加载 load 失败', {
							code: err && err.code,
							errMsg: err && err.errMsg
						})
					})
			},
			setWatchCooldown() {
				const seconds = Math.max(0, parseInt(this.videoWaitSeconds, 10) || 0)
				uni.setStorageSync(COOLDOWN_STORAGE_KEY, {
					date: this.todayKey(),
					endTime: Date.now() + seconds * 1000
				})
				this.syncCooldown()
				this.startCooldownTimer()
			},
			loadPageData(showLoading = true) {
				const that = this
				that.loading = showLoading
				// 正式：status；线下调试可改 status_test 并传 pack_id: that.testPackId
				that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=sign&a=status',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						that.applyPageData(res.data || {})
					}
				}).catch(e => {
					console.error('加载签到页失败', e)
					uni.showToast({
						title: (e && e.errmsg) || '加载失败',
						icon: 'none'
					})
				}).finally(() => {
					that.loading = false
				})
			},
			canWatchDetail(item) {
				if (!this.canDoTask) return false
				if (item.is_done) return false
				if (this.signInfo.hasSigned) return false
				if (this.cooldownRemaining > 0) return false
				return true
			},
			getNextVideoForDetail(detailId) {
				return this.videoList.find(
					v => Number(v.task_detail_id) === Number(detailId) && !v.watched
				)
			},
			goWatch(item) {
				if (!this.canDoTask) {
					uni.showToast({
						title: this.packRequiredTip || '暂无释放中的算力包',
						icon: 'none'
					})
					return
				}
				if (this.signInfo.hasSigned) {
					uni.showToast({
						title: '今日已签到',
						icon: 'none'
					})
					return
				}
				if (item.is_done) {
					uni.showToast({
						title: '该任务已完成',
						icon: 'none'
					})
					return
				}
				if (this.cooldownRemaining > 0) {
					uni.showToast({
						title: `${this.cooldownRemaining}秒后可继续观看`,
						icon: 'none'
					})
					return
				}

				const video = this.getNextVideoForDetail(item.id)
				if (!video) {
					uni.showToast({
						title: '暂无可观看视频',
						icon: 'none'
					})
					return
				}

				// 激励视频：本页拉起广告；完成由云函数按激励顺序入账
				if (Number(video.task_type) === 2 || Number(item.task_type) === 2) {
					if (this.rewardAdShowing) {
						uni.showToast({
							icon: 'none',
							title: '广告加载中，请稍候'
						})
						return
					}
					this.showRewardAd()
					return
				}

				const needSeconds = this.resolveWatchSeconds(video)
				uni.setStorageSync(WATCH_STORAGE_KEY, {
					video: {
						...video,
						duration: needSeconds,
						need_seconds: needSeconds
					},
					needSeconds: needSeconds,
					videoWaitSeconds: this.videoWaitSeconds,
					progressCurrent: this.watchedCount + 1,
					progressTotal: this.videoList.length,
					pack_id: this.testPackId || 0
				})

				this.$common.diyLinkJump('/zjxysl_task/pages/sign_watch', '', true, 2)
			},
			showRewardAd() {
				const that = this
				const adpid = String(that.rewardAdId || '').trim()
				if (!adpid) {
					uni.showToast({
						title: '激励视频广告位未配置',
						icon: 'none'
					})
					return
				}
				if (typeof uni.createRewardedVideoAd !== 'function') {
					uni.showToast({
						title: '当前环境不支持激励视频',
						icon: 'none'
					})
					return
				}
				if (that.rewardAdShowing) {
					uni.showToast({
						icon: 'none',
						title: '广告加载中，请稍候'
					})
					return
				}

				// 兜底本地片也按「下一条未完成激励」记账，与后端顺序一致
				const nextReward = that.getFirstUnfinishedRewardVideo()
				if (!nextReward) {
					uni.showToast({
						icon: 'none',
						title: '暂无待完成的激励任务'
					})
					return
				}

				that._pendingRewardVideo = nextReward
				that.rewardAdShowing = true
				that._rewardAdDiagAt = Date.now()
				that.armRewardAdLockTimeout()

				const ad = that._rewardedVideoAd || that.initRewardedVideoAd()
				console.log('[激励] 1-准备播放', {
					t: that._rewardAdDiagAt,
					adpid: adpid,
					loaded: that._rewardAdLoaded,
					next_key: nextReward.key
				})
				if (!ad) {
					that.resetRewardAdLock()
					uni.showToast({
						title: '激励视频初始化失败',
						icon: 'none'
					})
					return
				}

				const doShow = () => {
					console.log('[激励] 5-show开始', {
						cost: that.rewardAdDiagCost()
					})
					return ad.show().then(() => {
						console.log('[激励] 6-show promise完成', {
							cost: that.rewardAdDiagCost()
						})
						// 已弹出则不再用 12s 锁误伤观看中
						that.clearRewardAdLockTimer()
					})
				}

				if (that._rewardAdLoaded) {
					console.log('[激励] 直接 show（已预加载）')
					doShow().catch((err) => {
						console.warn('[激励] 直接 show 失败，回退 load', err)
						that._rewardAdLoaded = false
						console.log('[激励] 3-load开始', {
							cost: that.rewardAdDiagCost()
						})
						return ad.load()
							.then(() => {
								console.log('[激励] 4-load成功', {
									cost: that.rewardAdDiagCost()
								})
								that._rewardAdLoaded = true
								return doShow()
							})
							.catch((e2) => {
								console.error('[激励] load/show失败', {
									cost: that.rewardAdDiagCost(),
									code: e2 && e2.code,
									errMsg: e2 && e2.errMsg,
									adpid: adpid
								})
								that.handleRewardAdFail(e2)
							})
					})
					return
				}

				console.log('[激励] 3-load开始', {
					cost: that.rewardAdDiagCost()
				})
				that._preloadingRewardAd = true
				ad.load()
					.then(() => {
						console.log('[激励] 4-load成功', {
							cost: that.rewardAdDiagCost()
						})
						that._rewardAdLoaded = true
						that._preloadingRewardAd = false
						return doShow()
					})
					.catch((err) => {
						that._preloadingRewardAd = false
						console.error('[激励] load/show失败', {
							cost: that.rewardAdDiagCost(),
							code: err && err.code,
							errMsg: err && err.errMsg,
							detail: err && err.detail,
							adpid: adpid
						})
						that.handleRewardAdFail(err)
					})
			},
			doSign() {
				const that = this
				if (!that.canDoTask) {
					uni.showToast({
						title: that.packRequiredTip || '暂无释放中的算力包',
						icon: 'none'
					})
					return
				}
				if (!that.canClaimNow) {
					uni.showToast({
						title: that.signClaimTimeTip || '当前不在签到领取时间段内',
						icon: 'none'
					})
					return
				}
				if (!that.canSign || that.signInfo.hasSigned || that.signing) return
				that.signing = true
				const reqData = {}
				if (that.testPackId > 0) {
					reqData.pack_id = that.testPackId
				}
				that.$common.requestData({
					url: '/zjxysl_task/web/index.php?m=sign&a=claim',
					data: reqData,
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res && res.errcode == 0) {
						const data = res.data || {}
						that.claimedReward = data.total_reward || that.signInfo.expectedReward
						that.signInfo.hasSigned = true
						that.showSuccessPopup = true
						return
					}
					uni.showToast({
						title: (res && res.errmsg) || '签到失败',
						icon: 'none'
					})
				}).catch(e => {
					console.error('签到失败', e)
					uni.showToast({
						title: (e && e.errmsg) || '签到失败',
						icon: 'none'
					})
				}).finally(() => {
					that.signing = false
				})
			},
			onadload(e) {
				console.log('插屏广告数据加载成功', e)
				// 插屏默认隐藏，需主动 show；本页进页后自动弹出一次
				if (this._interstitialAutoShown) return
				this._interstitialAutoShown = true
				this.$nextTick(() => {
					setTimeout(() => {
						const ad = this.$refs.adInterstitial
						if (!ad || typeof ad.show !== 'function') {
							this._interstitialAutoShown = false
							return
						}
						try {
							// App 端组件 show() 可能不返回 Promise，不能直接 .catch
							const ret = ad.show()
							if (ret && typeof ret.then === 'function') {
								ret.then(() => {}).catch(err => {
									console.error('插屏广告自动 show 失败', err)
									this._interstitialAutoShown = false
								})
							}
						} catch (err) {
							console.error('插屏广告自动 show 异常', err)
							this._interstitialAutoShown = false
						}
					})
				})
			},
			onadclose(e) {
				console.log('插屏广告 onadclose', e)
			},
			onaderror(e) {
				console.log('插屏广告 onaderror: ', e && e.detail)
				this._interstitialAutoShown = false
			},
			onload2(e) {
				console.log("信息流广告onload",e);
			},
			onclose2(e) {
				console.log("信息流广告onclose: " + e.detail);
			},
			onerror2(e) {
				console.log("信息流广告onerror: " + e.detail.errCode + " message:: " + e.detail.errMsg);
			}
		}
	}
</script>

<style lang="less" scoped>
	@red-primary: #E93323;
	@red-light: #FFF0EE;
	@bg-page: #F5F5F5;
	@text-primary: #1a1a1a;
	@text-secondary: #666;
	@text-tertiary: #999;

	.sign-in-page {
		min-height: 100vh;
		background: @bg-page;
		padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
	}

	.maintenance-notice {
		margin: 24rpx 24rpx 0;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.closed-tip {
		margin: 24rpx 24rpx 0;
		padding: 24rpx;
		background: #fff7ed;
		border-radius: 16rpx;
		text-align: center;

		text {
			font-size: 26rpx;
			color: #d97706;
		}

		&--pack {
			background: #fef2f2;

			text {
				color: #dc2626;
			}
		}

		&--time {
			background: #eff6ff;

			text {
				color: #2563eb;
			}
		}
	}

	.reward-banner {
		margin: 24rpx;
		padding: 36rpx 32rpx;
		border-radius: 24rpx;
		background: linear-gradient(135deg, #FF6B4A 0%, @red-primary 55%, #D91E12 100%);
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		position: relative;
		box-shadow: 0 12rpx 32rpx rgba(233, 51, 35, 0.28);

		.banner-content {
			flex: 1;
			z-index: 1;
		}

		.banner-label {
			font-size: 28rpx;
			color: rgba(255, 255, 255, 0.92);
			display: block;
		}

		.banner-points {
			margin-top: 12rpx;
			display: flex;
			align-items: baseline;

			.points-num {
				font-size: 72rpx;
				font-weight: 700;
				color: #fff;
				line-height: 1;
			}

			.points-unit {
				font-size: 28rpx;
				color: rgba(255, 255, 255, 0.9);
				margin-left: 8rpx;
			}
		}
	}

	.task-block {
		padding: 0 24rpx;

		.ad-view {
			margin-bottom: 20rpx;
			min-height: 80rpx;
			overflow: hidden;
			border-radius: 16rpx;
		}

		.block-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;

			.block-title {
				font-size: 34rpx;
				font-weight: 700;
				color: @text-primary;
			}

			.block-reset {
				display: flex;
				align-items: center;

				text {
					font-size: 22rpx;
					color: @text-tertiary;
					margin-left: 6rpx;
				}
			}
		}
	}

	.task-card {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 20rpx;
		padding: 28rpx 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

		.card-left {
			margin-right: 20rpx;
			flex-shrink: 0;

			.play-icon {
				width: 72rpx;
				height: 72rpx;
				border-radius: 16rpx;
				background: @red-light;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.card-main {
			flex: 1;
			min-width: 0;

			.card-title {
				font-size: 30rpx;
				font-weight: 600;
				color: @text-primary;
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.card-desc {
				font-size: 24rpx;
				color: @text-tertiary;
				margin-top: 8rpx;
				display: block;
			}
		}

		.card-action {
			flex-shrink: 0;
			margin-left: 16rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.watch-btn {
				min-width: 128rpx;
				padding: 14rpx 24rpx;
				border-radius: 40rpx;
				background: @red-primary;
				text-align: center;

				text {
					font-size: 24rpx;
					color: #fff;
					font-weight: 500;
				}

				&--done {
					background: #e5e7eb;

					text {
						color: @text-tertiary;
					}
				}

				&--disabled {
					opacity: 0.55;
				}
			}

			.card-progress {
				font-size: 22rpx;
				color: @text-tertiary;
				margin-top: 10rpx;
			}
		}
	}

	.empty-state {
		padding: 60rpx 0;
	}

	.bottom-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 20rpx 32rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		background: rgba(245, 245, 245, 0.96);

		.claim-btn {
			background: @red-primary;
			border-radius: 48rpx;
			padding: 28rpx;
			text-align: center;
			box-shadow: 0 8rpx 24rpx rgba(233, 51, 35, 0.35);

			text {
				font-size: 32rpx;
				font-weight: 600;
				color: #fff;
			}

			&--disabled {
				background: #d1d5db;
				box-shadow: none;

				text {
					color: #9ca3af;
				}
			}
		}
	}

	.success-modal {
		width: 540rpx;
		padding: 56rpx 40rpx 40rpx;
		text-align: center;
		background: #fff;
		border-radius: 24rpx;

		.success-title {
			font-size: 36rpx;
			font-weight: 700;
			color: @text-primary;
			display: block;
		}

		.success-desc {
			font-size: 26rpx;
			color: @text-tertiary;
			margin-top: 12rpx;
			display: block;
		}

		.success-reward {
			font-size: 52rpx;
			font-weight: 700;
			color: @red-primary;
			margin: 28rpx 0 40rpx;
			display: block;
		}

		.success-btn {
			background: @red-primary;
			border-radius: 16rpx;
			padding: 28rpx;

			text {
				font-size: 28rpx;
				font-weight: 600;
				color: #fff;
			}
		}
	}
</style>