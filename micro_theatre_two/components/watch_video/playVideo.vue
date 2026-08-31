<template>
	<view class="new-video">
		<view class="video-stage">
			<view
				class="video-track"
				:class="{'is-animating': isAnimating}"
				:style="trackStyle"
				@transitionend="handleTransitionEnd"
			>
				<view
					v-for="slot in slots"
					:key="slot.videoId"
					class="video-slot"
					:style="getSlotStyle(slot.position)"
				>
					<video
						v-show="slot.src"
						:id="slot.videoId"
						:src="slot.src || ''"
						class="video-player"
						:class="{'is-ready': slot.isReady}"
						:controls="false"
						:autoplay="slot.position === CURRENT_SLOT"
						:loop="false"
						:muted="shouldMuteSlot(slot)"
						preload="auto"
						:show-center-play-btn="false"
						:enable-progress-gesture="false"
						:show-progress="false"
						:page-gesture="true"
						:enable-play-gesture="false"
						object-fit="contain"
						playsinline
						webkit-playsinline
						x5-playsinline
						x5-video-player-type="h5-page"
						@play="handleVideoPlay(slot.videoId)"
						@pause="handleVideoPause(slot.videoId)"
						@ended="handleVideoEnded(slot.videoId)"
						@timeupdate="handleTimeUpdate(slot.videoId, $event)"
						@loadedmetadata="handleSlotReady(slot.videoId, slot.realIndex)"
						@loadeddata="handleSlotFrameReady(slot.videoId, slot.realIndex)"
						@canplay="handleSlotReady(slot.videoId, slot.realIndex)"
						@error="handleSlotError(slot.videoId, slot.realIndex)"
					></video>
					<view
						v-show="!slot.src"
						class="video-placeholder"
					></view>
				</view>
			</view>
			<view
				v-if="showLoadingOverlay"
				class="loading-overlay"
			></view>
			<view
				class="gesture-layer"
				@touchstart="handleTouchStart"
				@touchmove.stop.prevent="handleTouchMove"
				@touchend="handleTouchEnd"
				@touchcancel="handleTouchEnd"
			></view>
				<view
					v-if="showPlayOverlay"
					class="play-overlay"
					@click.stop="resumeCurrentSlot"
			>
				<image
					:src="http_host + '/micro_theatre_two/web/static/images/p-play.png'"
					class="play-overlay-icon"
					mode="widthFix"
				></image>
			</view>
			<view
				v-if="showProgressBar"
				class="progress-bar-wrap"
				:style="progressBarStyle"
				@touchstart.stop
				@touchmove.stop.prevent
				@touchend.stop
				@click.stop
			>
				<view class="progress-time-row">
					<text class="progress-time">{{ formattedCurrentTime }}</text>
					<text class="progress-time">{{ formattedDuration }}</text>
				</view>
				<u-slider
					v-model="progressValue"
					step="0.1"
					min="0"
					max="100"
					block-width="6"
					blockSize="10"
					block-color="#FFFFFF"
					activeColor="#FFFFFF"
					inactiveColor="rgba(255, 255, 255, 0.28)"
					height="2"
					@changing="handleSliderChanging"
					@change="handleSliderChange"
				></u-slider>
			</view>
		</view>
	</view>
</template>

<script>
	// 三槽位循环复用：上一条、当前条、下一条始终共用 3 个 video 节点。
	const SLOT_COUNT = 3;
	const PREV_SLOT = 0;
	const CURRENT_SLOT = 1;
	const NEXT_SLOT = 2;
	const INVALID_INDEX = -1;
	// 点击和上下滑共用一层手势逻辑，阈值过小容易误触暂停。
	const TAP_THRESHOLD = 8;
	const SWIPE_THRESHOLD = 80;
	const EDGE_RESISTANCE = 0.35;
	// 统一的切换动画时长，切换完成后再刷新 videoContext 并继续播放。
	const TRANSITION_DURATION = 260;

	export default {
		props: {
			// 完整视频源列表，槽位轮转时只从这里按索引取值。
			videoList: {
				type: Array,
				default() {
					return [];
				},
			},
			// 外部页可以指定初始播放集数，默认从第 1 条开始。
			initialIndex: {
				type: Number,
				default: 0,
			},
			// 播放结束后是否自动切到下一条，play_video 页用它接“自动切集”开关。
			autoAdvance: {
				type: Boolean,
				default: true,
			},
			// 允许外部页调节内部进度条位置，避免和页面业务层遮挡。
			controlsBottom: {
				type: [String, Number],
				default: "34rpx",
			},
		},
		data() {
			const systemInfo = uni.getSystemInfoSync ? uni.getSystemInfoSync() : {};
			const viewportHeight = systemInfo.windowHeight || 667;

			return {
				CURRENT_SLOT,
				http_host: (this.globalData && this.globalData.http_host) || "",
				// 当前播放索引和三槽位数据源映射。
				currentIndex: 0,
				slots: [],
				videoContexts: [],
				viewportHeight,
				// 拖拽和过渡状态。
				translateY: 0,
				isDragging: false,
				isAnimating: false,
				// 播放和进度状态。
				isPaused: false,
				isSeeking: false,
				pendingDirection: 0,
				touchStartY: 0,
				touchDeltaY: 0,
				currentTime: 0,
				progressValue: 0,
				videoDuration: 0,
				hasMounted: false,
				// H5 手机端自动播放兜底状态，避免黑屏后完全失去可恢复路径。
				isMobileH5: false,
				shouldForceMutedAutoplay: false,
				playProbeTimer: null,
				hasAudioActivated: false,
			};
		},
		computed: {
			// 所有播放、暂停、进度计算都以当前槽位为准。
			currentSlot() {
				return this.getSlotByPosition(CURRENT_SLOT);
			},
			// 当前视频被暂停且没有处在切换动画中时，才显示中心播放按钮。
			showPlayOverlay() {
				return this.isPaused && !this.isAnimating && this.currentIndex !== INVALID_INDEX;
			},
			// 当前槽位还没 ready 且也没有被用户主动暂停时，显示加载遮罩。
			showLoadingOverlay() {
				return !!(this.currentSlot && this.currentSlot.src && !this.currentSlot.isReady && !this.isPaused);
			},
			showProgressBar() {
				return !!(this.currentSlot && this.currentSlot.src);
			},
			formattedCurrentTime() {
				return this.formatTime(this.currentTime);
			},
			formattedDuration() {
				return this.formatTime(this.videoDuration);
			},
			trackStyle() {
				return {
					transform: "translate3d(0, " + this.translateY + "px, 0)",
					transitionDuration: this.isAnimating ? TRANSITION_DURATION + "ms" : "0ms",
				};
			},
			progressBarStyle() {
				return {
					bottom: typeof this.controlsBottom === "number" ? this.controlsBottom + "px" : this.controlsBottom,
				};
			},
		},
		watch: {
			videoList() {
				this.initializeFeed();
			},
			initialIndex() {
				this.initializeFeed();
			},
		},
			created() {
			this.slots = this.createInitialSlots();
		},
		mounted() {
			// 仅在 H5 手机端才走自动播放兜底，桌面端保持简单路径。
			this.isMobileH5 = this.detectMobileH5();
			this.hasMounted = true;
			this.initializeFeed();
		},
		beforeDestroy() {
			this.clearPlayProbeTimer();
		},
		methods: {
			// 初始化 3 个固定槽位，后续只替换其绑定的视频索引和 src。
			createInitialSlots() {
				return Array.from({length: SLOT_COUNT}, (item, slotIndex) => ({
					videoId: "new-watch-video-slot-" + slotIndex,
					position: slotIndex,
					realIndex: INVALID_INDEX,
					src: "",
					isReady: false,
					hasStartedPlayback: false,
				}));
			},
			// 区分 H5 手机端和其他端，只有手机浏览器需要额外处理自动播放权限。
			detectMobileH5() {
				let isH5 = false;
				// #ifdef H5
				isH5 = true;
				// #endif
				if (!isH5 || typeof navigator === "undefined") {
					return false;
				}

				return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || "");
			},
			isValidIndex(index) {
				return index >= 0 && index < this.videoList.length;
			},
			// 对外部传入的初始索引做夹紧，避免越界把整个槽位状态机带坏。
			getClampedInitialIndex() {
				if (!this.videoList.length) {
					return INVALID_INDEX;
				}

				const parsedIndex = Number(this.initialIndex);
				if (!Number.isFinite(parsedIndex) || parsedIndex <= 0) {
					return 0;
				}

				if (parsedIndex >= this.videoList.length) {
					return this.videoList.length - 1;
				}

				return Math.floor(parsedIndex);
			},
			// 切换完成后把当前索引同步给外层页面，用于更新“第 N 集”和选集中高亮。
			emitCurrentIndexChange() {
				if (this.currentIndex === INVALID_INDEX) {
					return;
				}

				this.$emit("change", this.currentIndex);
			},
			getSlotValue(index) {
				if (!this.isValidIndex(index)) {
					return {
						realIndex: INVALID_INDEX,
						src: "",
					};
				}

				return {
					realIndex: index,
					src: this.videoList[index],
				};
			},
			getSlotByPosition(position) {
				return this.slots.find((slot) => slot.position === position) || null;
			},
			getSlotIndexByPosition(position) {
				return this.slots.findIndex((slot) => slot.position === position);
			},
			getSlotById(videoId) {
				return this.slots.find((slot) => slot.videoId === videoId) || null;
			},
			// 只重置槽位绑定的数据，不销毁节点，避免 H5 把后续视频当成新的受限媒体元素。
			updateSlot(slot, realIndex) {
				if (!slot) {
					return;
				}

				const nextValue = this.getSlotValue(realIndex);
				slot.realIndex = nextValue.realIndex;
				slot.src = nextValue.src;
				slot.isReady = false;
				slot.hasStartedPlayback = false;
			},
			assignSlot(position, realIndex) {
				this.updateSlot(this.getSlotByPosition(position), realIndex);
			},
			// 统一重建当前三槽位状态，供首屏进入和外部索引变化复用。
			initializeFeed() {
				if (!this.hasMounted) {
					return;
				}

				this.currentIndex = this.getClampedInitialIndex();
				this.pendingDirection = 0;
				this.translateY = 0;
				this.touchDeltaY = 0;
				this.isDragging = false;
				this.isAnimating = false;
				this.isPaused = false;
				this.isSeeking = false;
				this.currentTime = 0;
				this.progressValue = 0;
				this.videoDuration = 0;
				this.shouldForceMutedAutoplay = false;
				this.hasAudioActivated = false;
				this.clearPlayProbeTimer();

				this.assignSlot(PREV_SLOT, this.currentIndex - 1);
				this.assignSlot(CURRENT_SLOT, this.currentIndex);
				this.assignSlot(NEXT_SLOT, this.currentIndex + 1);

				this.$nextTick(() => {
					this.initVideoContexts();
					this.emitCurrentIndexChange();
					this.playCurrentSlot();
				});
			},
			// 每次槽位轮转后都重新创建 videoContext，避免节点更新后引用失效。
			initVideoContexts() {
				this.videoContexts = this.slots.map((slot) => uni.createVideoContext(slot.videoId, this));
			},
			getVideoContextByPosition(position) {
				const slotIndex = this.getSlotIndexByPosition(position);
				if (slotIndex === INVALID_INDEX) {
					return null;
				}

				return this.videoContexts[slotIndex] || null;
			},
			shouldMuteSlot(slot) {
				return !!(
					this.isMobileH5 &&
					this.shouldForceMutedAutoplay &&
					!this.hasAudioActivated &&
					slot &&
					slot.position === CURRENT_SLOT &&
					slot.realIndex !== INVALID_INDEX
				);
			},
			// 移动端自动播放如果被静默拦截，延迟探测后切到静音重试或进入暂停态。
			clearPlayProbeTimer() {
				if (!this.playProbeTimer) {
					return;
				}

				clearTimeout(this.playProbeTimer);
				this.playProbeTimer = null;
			},
			schedulePlayProbe() {
				this.clearPlayProbeTimer();
				if (!this.isMobileH5 || this.currentIndex === INVALID_INDEX || this.isPaused) {
					return;
				}

				const currentSlot = this.currentSlot;
				if (!currentSlot || !currentSlot.src) {
					return;
				}

				this.playProbeTimer = setTimeout(() => {
					this.playProbeTimer = null;

					const activeSlot = this.currentSlot;
					if (!activeSlot || activeSlot.realIndex !== this.currentIndex || activeSlot.hasStartedPlayback || this.isPaused) {
						return;
					}

					if (!this.shouldForceMutedAutoplay && !this.hasAudioActivated) {
						this.shouldForceMutedAutoplay = true;
						this.$nextTick(() => {
							this.tryPlayCurrentSlot();
						});
						return;
					}

					this.isPaused = true;
				}, 700);
			},
			playSlot(position) {
				const slot = this.getSlotByPosition(position);
				const context = this.getVideoContextByPosition(position);

				if (!slot || slot.realIndex === INVALID_INDEX || !context) {
					return;
				}

				try {
					context.play();
				} catch (error) {}
			},
			pauseSlot(position) {
				const context = this.getVideoContextByPosition(position);
				if (!context) {
					return;
				}

				try {
					context.pause();
				} catch (error) {}
			},
			pauseInactiveSlots() {
				[PREV_SLOT, NEXT_SLOT].forEach((position) => {
					this.pauseSlot(position);
				});
			},
			// 只在当前槽位 ready 后真正触发播放，避免频繁切换时误播到未就绪节点。
			tryPlayCurrentSlot() {
				const currentSlot = this.currentSlot;
				if (!currentSlot || !currentSlot.isReady || this.isPaused) {
					return;
				}

				this.pauseInactiveSlots();
				this.$nextTick(() => {
					this.playSlot(CURRENT_SLOT);
					this.schedulePlayProbe();
				});
			},
			// 对外暴露的播放入口统一收口到当前槽位。
			playCurrentSlot() {
				if (this.currentIndex === INVALID_INDEX) {
					return;
				}

				this.isPaused = false;
				this.tryPlayCurrentSlot();
			},
			pauseCurrentSlot() {
				if (this.currentIndex === INVALID_INDEX) {
					return;
				}

				this.clearPlayProbeTimer();
				this.pauseSlot(CURRENT_SLOT);
				this.isPaused = true;
			},
			// 用户点击中心播放按钮后，视为已获得一次有效手势，可直接恢复当前视频。
			resumeCurrentSlot() {
				if (this.isAnimating || this.currentIndex === INVALID_INDEX) {
					return;
				}

				this.hasAudioActivated = true;
				this.isPaused = false;
				this.tryPlayCurrentSlot();
			},
			// 只接收仍然匹配当前槽位 realIndex 的 ready 事件，避免旧事件污染新槽位。
			handleSlotReady(videoId, realIndex) {
				const slot = this.getSlotById(videoId);
				if (!slot || slot.realIndex !== realIndex || !slot.src) {
					return;
				}

				slot.isReady = true;
				if (slot.position === CURRENT_SLOT) {
					this.tryPlayCurrentSlot();
				}
			},
			handleSlotFrameReady(videoId, realIndex) {
				this.handleSlotReady(videoId, realIndex);
			},
			// 当前槽位报错时直接退到暂停态，给用户保留手动恢复或继续切换的机会。
			handleSlotError(videoId, realIndex) {
				const slot = this.getSlotById(videoId);
				if (!slot || slot.realIndex !== realIndex) {
					return;
				}

				if (slot.position === CURRENT_SLOT) {
					this.clearPlayProbeTimer();
					this.isPaused = true;
				}
			},
			// 当前视频进度只由当前槽位上报，拖动进度条时暂停时间同步，避免状态抖动。
			handleTimeUpdate(videoId, event) {
				const slot = this.getSlotById(videoId);
				if (!slot || slot.position !== CURRENT_SLOT || this.isSeeking) {
					return;
				}

				const duration = Number(event.detail.duration) || 0;
				const currentTime = Number(event.detail.currentTime) || 0;
				if (currentTime > 0) {
					slot.hasStartedPlayback = true;
					this.clearPlayProbeTimer();
				}

				this.videoDuration = duration;
				this.currentTime = currentTime;
				if (!duration) {
					this.progressValue = 0;
					return;
				}

				this.progressValue = Math.min(100, (currentTime / duration) * 100);
			},
			// 进度条拖动时只更新展示，不立即 seek。
			handleSliderChanging(value) {
				this.isSeeking = true;
				const nextValue = typeof value === "number" ? value : Number(value) || 0;
				this.progressValue = nextValue;
				if (this.videoDuration) {
					this.currentTime = (nextValue / 100) * this.videoDuration;
				}
			},
			// 拖动结束后再 seek 当前槽位，避免频繁触发底层播放器跳播。
			handleSliderChange(value) {
				const nextValue = typeof value === "number" ? value : Number(value) || 0;
				this.progressValue = nextValue;
				if (this.videoDuration) {
					this.currentTime = (nextValue / 100) * this.videoDuration;
				}

				if (!this.videoDuration) {
					this.isSeeking = false;
					return;
				}

				const context = this.getVideoContextByPosition(CURRENT_SLOT);
				if (!context) {
					this.isSeeking = false;
					return;
				}

				try {
					context.seek((nextValue / 100) * this.videoDuration);
				} catch (error) {}

				this.$nextTick(() => {
					this.isSeeking = false;
				});
			},
			formatTime(seconds) {
				const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
				const hours = Math.floor(totalSeconds / 3600);
				const minutes = Math.floor((totalSeconds % 3600) / 60);
				const secs = totalSeconds % 60;
				const paddedMinutes = String(minutes).padStart(hours ? 2 : 1, "0");
				const paddedSeconds = String(secs).padStart(2, "0");

				if (hours) {
					return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + paddedSeconds;
				}

				return paddedMinutes + ":" + paddedSeconds;
			},
			getSlotStyle(position) {
				return {
					transform: "translate3d(0, " + ((position - CURRENT_SLOT) * 100) + "%, 0)",
				};
			},
			// 上下滑统一依赖透明手势层，避免和 video 原生手势互相抢事件。
			handleTouchStart(event) {
				if (this.isAnimating || !this.videoList.length) {
					return;
				}

				const touch = (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]);
				if (!touch) {
					return;
				}

				this.isDragging = true;
				this.touchStartY = touch.clientY;
				this.touchDeltaY = 0;
			},
			// 边界视频加入阻尼，减少已经到头时的突兀感。
			handleTouchMove(event) {
				if (!this.isDragging || this.isAnimating) {
					return;
				}

				const touch = (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]);
				if (!touch) {
					return;
				}

				let deltaY = touch.clientY - this.touchStartY;

				if (deltaY < 0 && !this.canMoveNext()) {
					deltaY = deltaY * EDGE_RESISTANCE;
				}

				if (deltaY > 0 && !this.canMovePrev()) {
					deltaY = deltaY * EDGE_RESISTANCE;
				}

				this.touchDeltaY = deltaY;
				this.translateY = deltaY;
			},
			// 点击、回弹、切到上一条/下一条都在这里统一分流。
			handleTouchEnd() {
				if (!this.isDragging || this.isAnimating) {
					return;
				}

				this.isDragging = false;
				if (Math.abs(this.touchDeltaY) < TAP_THRESHOLD) {
					this.translateY = 0;
					this.touchDeltaY = 0;
					if (this.shouldForceMutedAutoplay && !this.hasAudioActivated && !this.isPaused) {
						this.hasAudioActivated = true;
						this.playCurrentSlot();
						return;
					}
					if (!this.isPaused) {
						this.pauseCurrentSlot();
					}
					return;
				}

				if (Math.abs(this.touchDeltaY) < SWIPE_THRESHOLD) {
					this.animateTo(0, 0);
					return;
				}

				if (this.touchDeltaY < 0 && this.canMoveNext()) {
					this.animateTo(-this.viewportHeight, 1);
					return;
				}

				if (this.touchDeltaY > 0 && this.canMovePrev()) {
					this.animateTo(this.viewportHeight, -1);
					return;
				}

				this.animateTo(0, 0);
			},
			// 向后切换时重排槽位位置，并为新的 NEXT 槽位预装下一条视频。
			shiftToNext() {
				const previousSlot = this.getSlotByPosition(PREV_SLOT);
				const currentSlot = this.getSlotByPosition(CURRENT_SLOT);
				const nextSlot = this.getSlotByPosition(NEXT_SLOT);

				if (!previousSlot || !currentSlot || !nextSlot) {
					return;
				}

				currentSlot.position = PREV_SLOT;
				nextSlot.position = CURRENT_SLOT;
				previousSlot.position = NEXT_SLOT;
				this.updateSlot(previousSlot, this.currentIndex + 1);
			},
			// 向前切换时重排槽位位置，并为新的 PREV 槽位预装上一条视频。
			shiftToPrev() {
				const previousSlot = this.getSlotByPosition(PREV_SLOT);
				const currentSlot = this.getSlotByPosition(CURRENT_SLOT);
				const nextSlot = this.getSlotByPosition(NEXT_SLOT);

				if (!previousSlot || !currentSlot || !nextSlot) {
					return;
				}

				previousSlot.position = CURRENT_SLOT;
				currentSlot.position = NEXT_SLOT;
				nextSlot.position = PREV_SLOT;
				this.updateSlot(nextSlot, this.currentIndex - 1);
			},
			canMoveNext() {
				return this.isValidIndex(this.currentIndex + 1);
			},
			canMovePrev() {
				return this.isValidIndex(this.currentIndex - 1);
			},
			animateTo(targetTranslateY, direction) {
				this.pendingDirection = direction;
				this.isAnimating = true;
				this.translateY = targetTranslateY;
			},
			handleVideoPlay(videoId) {
				const slot = this.getSlotById(videoId);
				if (slot && slot.position === CURRENT_SLOT) {
					slot.hasStartedPlayback = true;
					this.clearPlayProbeTimer();
					this.isPaused = false;
				}
			},
			handleVideoPause(videoId) {
				const slot = this.getSlotById(videoId);
				if (slot && slot.position === CURRENT_SLOT && !this.isAnimating) {
					this.clearPlayProbeTimer();
					this.isPaused = true;
				}
			},
			// 播放结束后是否自动切下一条由 autoAdvance 决定，供 play_video 页接“自动切集”开关。
			handleVideoEnded(videoId) {
				const slot = this.getSlotById(videoId);
				if (!slot || slot.position !== CURRENT_SLOT || this.isAnimating) {
					return;
				}

				this.clearPlayProbeTimer();
				this.currentTime = 0;
				this.progressValue = 0;

				if (this.autoAdvance && this.canMoveNext()) {
					this.isPaused = false;
					this.animateTo(-this.viewportHeight, 1);
					return;
				}

				if (!this.autoAdvance) {
					slot.hasStartedPlayback = false;
					this.isPaused = false;
					this.$nextTick(() => {
						this.playCurrentSlot();
					});
					return;
				}

				slot.hasStartedPlayback = false;
				this.isPaused = true;
			},
			// 所有切换收口点：更新索引、重建上下文、通知外层并决定是否继续播放。
			handleTransitionEnd() {
				if (!this.isAnimating) {
					return;
				}

				const direction = this.pendingDirection;
				if (direction !== 0) {
					this.pauseSlot(CURRENT_SLOT);
				}

				if (direction === 1) {
					this.currentIndex += 1;
					this.shiftToNext();
				} else if (direction === -1) {
					this.currentIndex -= 1;
					this.shiftToPrev();
				}

				this.isAnimating = false;
				this.pendingDirection = 0;
				this.translateY = 0;
				this.touchDeltaY = 0;
				this.isSeeking = false;
				this.currentTime = 0;
				this.progressValue = 0;
				this.videoDuration = 0;
				this.clearPlayProbeTimer();

				this.$nextTick(() => {
					this.initVideoContexts();
					if (direction !== 0) {
						this.emitCurrentIndexChange();
					}

					if (direction === 0 && this.isPaused) {
						return;
					}

					this.playCurrentSlot();
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.new-video {
		height: 100vh;
		background: #000000;
		overflow: hidden;
	}

	.video-stage {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.video-track {
		position: relative;
		width: 100%;
		height: 100%;
		will-change: transform;
	}

	.video-track.is-animating {
		transition-property: transform;
		transition-timing-function: ease-out;
	}

	.video-slot {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000000;
	}

	.video-placeholder,
	.gesture-layer {
		width: 100%;
		height: 100%;
	}

	.video-player {
		display: block;
		width: 100%;
		height: 100%;
		background: #000000;
		opacity: 0;
		transition: opacity 120ms linear;
	}

	.video-player.is-ready {
		opacity: 1;
	}

	.video-placeholder {
		background: #000000;
	}

	.loading-overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: rgba(0, 0, 0, 0.2);
		pointer-events: none;
	}

	.gesture-layer {
		position: absolute;
		inset: 0;
		z-index: 2;
		background: transparent;
	}

	.play-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 3;
		transform: translate(-50%, -50%);
		width: 144rpx;
		height: 144rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.play-overlay-icon {
		width: 144rpx;
		display: block;
	}

	.progress-bar-wrap {
		position: absolute;
		left: 24rpx;
		right: 24rpx;
		bottom: 34rpx;
		z-index: 4;
		padding: 8rpx 0;
	}

	.progress-time-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8rpx;
	}

	.progress-time {
		font-size: 20rpx;
		line-height: 1;
		color: rgba(255, 255, 255, 0.92);
	}

	.progress-bar-wrap ::v-deep .u-slider {
		margin: 0;
	}
</style>
