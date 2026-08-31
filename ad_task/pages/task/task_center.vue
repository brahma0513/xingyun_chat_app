<template>
  <view class="page">
    <view class="header-wrap">
      <view class="banner-ad-wrap" v-if="showBannerTop && bannerAdpid">
        <ad
          :adpid="bannerAdpid"
          @load="onAdLoad"
          @error="onAdError"
          @close="onAdClose"
        />
      </view>
      <view class="banner-box">
        <image class="banner-img" :src="bannerImageSrc" mode="aspectFill"></image>
      </view>

      <view class="income-card" v-if="showIncomeCard">
        <view class="main-income" v-if="showMainIncome" @click="mainIncomeUrl(preferencesIncomeCard.data_type)">
          <view class="label">{{ mainIncomeTitle }}</view>
          <view class="money">{{ mainIncomeValue }}</view>
        </view>

        <view class="income-grid" v-if="visibleIncomeItems.length > 0">
          <view
            class="income-item"
            v-for="item in visibleIncomeItems"
            :key="item.id || item.sort || item.data_type"
			@click="mainIncomeUrl(item.data_type)"
          >
            <view class="item-value">{{ item.value }}</view>
            <view class="item-label">{{ item.show_title }}</view>
          </view>
        </view>
      </view>

      <view class="red-packet-card" v-if="userInfo.waitReceiveAmount > 0">
        <view class="packet-left">
          <view class="packet-icon"><image class="icon-img" :src="http_host+'/ad_task/web/static/images/red_icon.png'" mode="aspectFill"></image></view>
          <view>
            <view class="packet-title">你有待领取红包</view>
            <view class="packet-desc">广告奖励已到账，快来领取</view>
          </view>
        </view>
        <view class="packet-right">
          <view class="packet-money">{{ displayUserInfo.waitReceiveAmount }}</view>
          <view class="packet-btn" @click="openRedPacket">立即领取</view>
        </view>
      </view>
    </view>

    <view class="record-entry-row">
      <view class="mini-divider"></view>
      <view class="record-mini-item" @click="goRule">
        <view class="mini-icon finish"><image class="icon-img-mini" :src="http_host+'/ad_task/web/static/images/guize_icon.png'" mode="aspectFill"></image></view>
        <text>规则说明</text>
      </view>
      <view class="record-mini-item" @click="goRewardRecord">
        <view class="mini-icon reward"><image class="icon-img-mini" :src="http_host+'/ad_task/web/static/images/reward_icon.png'" mode="aspectFill"></image></view>
        <text>奖励记录</text>
      </view>
    </view>
	
	<view class="banner-ad-wrap" v-if="showBannerMiddle && bannerAdpid">
	  <ad
	    :adpid="bannerAdpid"
	    @load="onAdLoad"
	    @error="onAdError"
	    @close="onAdClose"
	  />
	</view>

    <view class="section-head">
      <view class="section-left">
        <view class="title-line"></view>
        <view>
          <view class="section-title">今日任务</view>
          <view class="section-desc">完成任务可获得广告奖励</view>
        </view>
      </view>

    </view>

    <view class="task-list">
      <view
        class="task-card"
        v-for="(item, index) in taskList"
        :key="item.id"
      >
        <view class="check-circle" :class="{ done: isTaskDone(item) }">
          {{ isTaskDone(item) ? '✓' : index + 1 }}
        </view>

        <view class="task-content">
          <view class="task-title-row">
            <view class="task-title">{{ item.title }}</view>
            <view class="reward-inline">
              <image class="reward-coin" :src="http_host+'/ad_task/web/static/images/bi.png'" mode="aspectFill"></image>
              <text>+{{ item.reward }}</text>
            </view>
          </view>

          <view class="task-desc">{{ item.desc }}</view>
          <view class="task-count">
            已完成 {{ item.finishTimes }} 次 / 需完成 {{ item.totalTimes }} 次
          </view>
        </view>

        <view class="task-action">
          <view
            class="task-btn"
            :class="{
              disabled: isTaskDone(item),
              cooling: !isTaskDone(item) && taskCooldown > 0
            }"
            @click="handleTask(item)"
          >
            {{ isTaskDone(item) ? '已完成' : '去完成' }}
          </view>
          <view v-if="!isTaskDone(item) && taskCooldown > 0" class="task-countdown">
            {{ taskCooldown }}秒
          </view>
        </view>
      </view>
    </view>
	
	<view class="banner-ad-wrap" v-if="showBannerBottom && bannerAdpid">
	  <ad
	    :adpid="bannerAdpid"
	    @load="onAdLoad"
	    @error="onAdError"
	    @close="onAdClose"
	  />
	</view>

    <view class="mask" v-if="autoRewardVisible" @click="closeAutoReward">
      <view class="auto-modal" @click.stop>
        <view class="shine"></view>
        <view class="auto-icon"><image class="auto-icon-img" :src="http_host+'/ad_task/web/static/images/suprise_icon.png'" mode="aspectFit"></image></view>
        <view class="auto-title">恭喜您获得</view>
        <view class="auto-money">{{ autoRewardAmount }}</view>
        <view class="auto-desc">广告奖励已自动进入钱包</view>
        <view class="auto-btn" @click="closeAutoReward">开心收下</view>
      </view>
    </view>

    <view class="mask" v-if="packetVisible" @click="closePacket">
      <view class="packet-modal" @click.stop>
        <view class="packet-modal-top">
          <view class="packet-modal-title">恭喜发财</view>
          <view class="packet-modal-desc">广告奖励红包</view>
        </view>

        <view class="open-circle" @click="receivePacket" v-if="!packetOpened">开</view>

        <view class="packet-result" v-if="packetOpened">
          <view class="auto-icon"><image class="auto-icon-img" :src="http_host+'/ad_task/web/static/images/suprise_icon.png'" mode="aspectFit"></image></view>
          <view class="result-label">恭喜拆得</view>
          <view class="result-money">{{ receivedAmount }}</view>
          <view class="result-desc">{{ packetResultDesc }}</view>
        </view>

        <view class="packet-close" @click="closePacket">关闭</view>
      </view>
    </view>
  </view>
</template>

<script>
const TASK_COOLDOWN_STORAGE_KEY = 'ad_task_task_cooldown_end'
let weixinShareService = null

export default {
  data() {
    const app = getApp()
    return {
      http_host: '',
      scoreUnit: '贡献值',
      userInfo: {
        totalIncome: '0',
        waitReceiveAmount: '0.00',
        todayAdPoint: '0',
        walletBalance: '0.00',
        adScore: '0'
      },
      displayUserInfo: {
        totalIncome: '0',
        waitReceiveAmount: '0.00',
        todayAdPoint: '0',
        walletBalance: '0.00',
        adScore: '0'
      },
      numberTimers: {},
      hasLoadedHome: false,
      waitReceiveRaw: 0,
      autoRewardVisible: false,
      autoRewardAmount: '0.00',
      packetVisible: false,
      packetOpened: false,
      receivedAmount: '0.00',
      packetResultDesc: '已发放至账户',
      claimLoading: false,
      listLoading: false,
      taskList: [],
      taskTopBg: '',
      canDoTask: true,
      taskBlockMsg: '',
      rewardVideoSettings: null,
      rewardVideoSettingsLoading: false,
      preferencesIncomeCard: {
        title: '',
        data_type: 0,
        is_show: 1,
        value_text: ''
      },
      preferencesIncomeItems: [
        { id: 1, sort: 1, show_title: '今日积分', data_type: 2, is_show: 1, value_text: '' },
        { id: 2, sort: 2, show_title: '购物券余额', data_type: 3, is_show: 1, value_text: '' },
        { id: 3, sort: 3, show_title: '今日进度', data_type: 7, is_show: 1, value_text: '' }
      ],
      memberTaskPermission: true,
      memberTaskPermissionMsg: '暂无权限',
      taskCooldown: 0,
      task_cooldown_seconds: 30,
	  taskCenterBannerSettings: null,
	  taskCenterBannerSettingsLoading: false,
	  taskCenterBannerPositions: '',
	  showBannerTop: false,
	  showBannerMiddle: false,
	  showBannerBottom: false,
    }
  },

  computed: {
    bannerImageSrc() {
      const u = (this.taskTopBg || '').trim()
      if (!u) {
        return this.http_host + '/ad_task/web/static/images/ad_banner2.png'
      }
      if (/^https?:\/\//i.test(u)) {
        return u
      }
      if (u.charAt(0) === '/') {
        return this.http_host + u
      }
      return this.http_host + '/' + u.replace(/^\//, '')
    },
    bannerAdpid() {
      const settings = this.taskCenterBannerSettings || {}
      return settings.star_app_banner_id != null && String(settings.star_app_banner_id).trim() !== ''
        ? String(settings.star_app_banner_id)
        : ''
    },
    showMainIncome() {
      return this.preferencesIncomeCard && parseInt(this.preferencesIncomeCard.is_show, 10) === 1
    },
    mainIncomeTitle() {
      return this.preferencesIncomeCard && this.preferencesIncomeCard.title
        ? String(this.preferencesIncomeCard.title)
        : '累计获得' + this.scoreUnit
    },
    mainIncomeValue() {
      const dataType = this.preferencesIncomeCard ? this.preferencesIncomeCard.data_type : 0
      const valueText = this.preferencesIncomeCard ? this.preferencesIncomeCard.value_text : ''
      return this.getPreferenceMetricValue(dataType, valueText)
    },
    visibleIncomeItems() {
      return (this.preferencesIncomeItems || [])
        .filter(item => parseInt(item.is_show, 10) === 1)
        .sort((a, b) => (parseInt(a.sort, 10) || 0) - (parseInt(b.sort, 10) || 0))
        .map(item => ({
          ...item,
          value: this.getPreferenceMetricValue(item.data_type, item.value_text)
        }))
    },
    showIncomeCard() {
      return this.showMainIncome || this.visibleIncomeItems.length > 0
    },
    finishedTaskCount() {
      return this.taskList.filter(item => this.isTaskDone(item)).length
    }
  },

  onLoad() {
    this.http_host = this.vuex_apiUrl;
    this.restoreTaskCooldown()
  },

  onShow() {
    this.restoreTaskCooldown()
    this.fetchHome({ autoOpenPacket: true })
    this.fetchPreferencesSettings()
    this.fetchMemberTaskPermission()
    this.fetchTaskCenterBannerSettings()
    this.fetchRewardVideoSettings()
  },

  onHide() {
    this.clearTaskCooldownTimer()
  },

  onUnload() {
    this.clearTaskCooldownTimer()
    this.clearAllNumberTimers()
  },

  methods: {
    fetchHome(opts = {}) {
      this.listLoading = true
      this.$common.requestData({
        url: '/ad_task/web/index.php?m=score_dividend&a=task_center_home',
        data: {},
        method: 'POST',
        needToken: true,
        needLoading: false
      })
        .then((res) => {
          const d = res.data || res || {}
          if (d.score_unit) {
            this.scoreUnit = d.score_unit
          }
          this.applyUserInfo({
            totalIncome: d.total_income != null ? String(d.total_income) : '0',
            todayAdPoint: d.today_ad_point != null ? String(d.today_ad_point) : '0',
            walletBalance: d.wallet_balance != null ? String(d.wallet_balance) : '0.00',
            waitReceiveAmount: d.wait_receive_amount != null ? String(d.wait_receive_amount) : '0.00',
            adScore: d.ad_score != null ? String(d.ad_score) : '0'
          }, this.hasLoadedHome)
          this.waitReceiveRaw = parseFloat(d.wait_receive_raw) || 0
          this.taskList = Array.isArray(d.tasks) ? d.tasks : []
          // this.taskTopBg = d.task_top_bg_img != null ? String(d.task_top_bg_img) : ''
          this.canDoTask = parseInt(d.can_do_task, 10) !== 0
          this.taskBlockMsg = d.task_block_msg != null ? String(d.task_block_msg) : ''
          if (d.task_cooldown_seconds != null) {
            this.task_cooldown_seconds = parseInt(d.task_cooldown_seconds, 10) || 0
          }
          this.hasLoadedHome = true
          if (opts.autoOpenPacket && this.waitReceiveRaw > 0) {
            this.openPacketModal()
          }
        })
        .catch((err) => {
          uni.showToast({ title: (err && err.errmsg) || '加载失败', icon: 'none' })
        })
        .then(() => {
          this.listLoading = false
        })
    },

    fetchMemberTaskPermission() {
      this.$common.requestData({
        url: '/ad_task/web/index.php?m=score_dividend&a=member_task_permission',
        data: {},
        method: 'POST',
        needToken: true,
        needLoading: false
      })
        .then((res) => {
          const d = res.data || res || {}
          this.memberTaskPermission = parseInt(d.task_permission, 10) !== 0
          this.memberTaskPermissionMsg = d.task_block_msg != null && String(d.task_block_msg) !== ''
            ? String(d.task_block_msg)
            : '暂无权限'
        })
        .catch((err) => {
          this.memberTaskPermission = true
          this.memberTaskPermissionMsg = '暂无权限'
          console.error('member_task_permission', err)
        })
    },

    fetchPreferencesSettings() {
      return this.$common.requestData({
        url: '/ad_task/web/index.php?m=score_dividend&a=task_center_preferences_settings',
        data: {},
        method: 'POST',
        needToken: true,
        needLoading: false
      })
        .then((res) => {
          const d = res.data || res || {}
          if (d.income_card && typeof d.income_card === 'object') {
            this.preferencesIncomeCard = {
              title: d.income_card.title != null ? String(d.income_card.title) : '',
              data_type: d.income_card.data_type != null ? parseInt(d.income_card.data_type, 10) || 0 : 0,
              is_show: d.income_card.is_show ? 1 : 0,
              value_text: d.income_card.value_text != null ? String(d.income_card.value_text) : ''
            }
          }
          if (Array.isArray(d.item)) {
            this.preferencesIncomeItems = d.item.map((item, index) => ({
              id: item.id != null ? item.id : index + 1,
              sort: item.sort != null ? parseInt(item.sort, 10) || 0 : index + 1,
              show_title: item.show_title != null ? String(item.show_title) : '',
              data_type: item.data_type != null ? parseInt(item.data_type, 10) || 0 : 0,
              is_show: item.is_show ? 1 : 0,
              value_text: item.value_text != null ? String(item.value_text) : ''
            }))
          }
          this.taskTopBg = d.banner_img != null ? String(d.banner_img) : ''
          return d
        })
        .catch((err) => {
          console.error('task_center_preferences_settings', err)
          return null
        })
    },
	
	mainIncomeUrl(dataType) {
		// dataType = dataType != null ? dataType : (this.preferencesIncomeCard ? this.preferencesIncomeCard.data_type : 0)
		switch (parseInt(dataType, 10)) {
		  case 3:
			return this.$common.diyLinkJump(
			  this.http_host + '/wsy_user/web/index.php?m=pocket_money&a=my_pocket_money&customer_id=' + this.vuex_customer_id,
			  'h5',
			  true
			)
		  case 4:
		    return this.$common.diyLinkJump(
		      this.http_host + '/wsy_user/web/index.php?m=integral&a=my_integral&customer_id=' + this.vuex_customer_id,
		      'h5',
		      true
		    )
		  case 5:
		    return this.$common.diyLinkJump(
		      this.http_host + '/wsy_user/web/index.php?m=currency&a=currency_list&customer_id=' + this.vuex_customer_id,
		      'h5',
		      true
		    )
		  case 6:
		    return this.$common.diyLinkJump( 
			  '/ad_task/web/index.php?m=index&a=index#/pages/task/ad_point_detail', 
			  'h5', 
			  true
			)
		  default:
		    return ''
		}
	},
	

    getPreferenceMetricValue(dataType, valueText = '') {
      switch (parseInt(dataType, 10)) {
        case 1:
          return this.displayUserInfo.totalIncome
        case 2:
          return this.displayUserInfo.todayAdPoint
        case 3:
          return this.displayUserInfo.walletBalance
        case 6:
          return this.displayUserInfo.adScore
        case 7:
          return this.finishedTaskCount + '/' + this.taskList.length
        default:
          return valueText != null ? String(valueText) : ''
      }
    },

    fetchTaskCenterBannerSettings(forceRefresh = false) {
      if (!forceRefresh && this.taskCenterBannerSettings) {
        return Promise.resolve(this.taskCenterBannerSettings)
      }
      if (this.taskCenterBannerSettingsLoading) {
        return Promise.resolve(this.taskCenterBannerSettings)
      }

      this.taskCenterBannerSettingsLoading = true
      return this.$common.requestData({
        url: '/ad_task/web/index.php?m=score_dividend&a=ger_settings_banner',
        data: {},
        method: 'POST',
        needToken: true,
        needLoading: false
      })
        .then((res) => {
          const d = res.data || res || {}
          this.taskCenterBannerSettings = d
          this.taskCenterBannerPositions = d.task_center_banner_positions != null
            ? String(d.task_center_banner_positions)
            : ''
          this.showBannerTop = d.flags.top
		  this.showBannerMiddle = d.flags.middle
		  this.showBannerBottom = d.flags.bottom
          return d
        })
        .catch((err) => {
          this.taskCenterBannerSettings = null
          this.taskCenterBannerPositions = ''
          this.showBannerTop = false
		  this.showBannerMiddle = false
		  this.showBannerBottom = false
          console.error('ger_settings_banner', err)
          return null
        })
        .then((result) => {
          this.taskCenterBannerSettingsLoading = false
          return result
        })
    },

    fetchRewardVideoSettings(forceRefresh = false) {
      if (!forceRefresh && this.rewardVideoSettings) {
        return Promise.resolve(this.rewardVideoSettings)
      }
      if (this.rewardVideoSettingsLoading) {
        return Promise.resolve(this.rewardVideoSettings)
      }

      this.rewardVideoSettingsLoading = true
      return this.$common.requestData({
        url: '/ad_task/web/index.php?m=score_dividend&a=get_settings_reward_video',
        data: {},
        method: 'POST',
        needToken: true,
        needLoading: false
      })
        .then((res) => {
          const d = res.data || res || {}
          this.rewardVideoSettings = d
          return d
        })
        .catch((err) => {
          this.rewardVideoSettings = null
          console.error('get_settings_reward_video', err)
          return null
        })
        .then((result) => {
          this.rewardVideoSettingsLoading = false
          return result
        })
    },

    isTaskDone(item) {
      return item.finishTimes >= item.totalTimes
    },

    applyUserInfo(nextUserInfo, animate) {
      Object.keys(nextUserInfo).forEach((key) => {
        this.setNumberValue(key, nextUserInfo[key], animate)
      })
    },

    setNumberValue(key, nextValue, animate = true) {
      const oldValue = this.userInfo[key]
      const nextText = String(nextValue)

      this.$set(this.userInfo, key, nextText)

      if (!animate || oldValue === nextText) {
        this.clearNumberTimer(key)
        this.$set(this.displayUserInfo, key, nextText)
        return
      }

      const from = this.getNumericValue(oldValue)
      const to = this.getNumericValue(nextText)
      if (from === null || to === null) {
        this.$set(this.displayUserInfo, key, nextText)
        return
      }

      this.animateNumber(key, from, to, nextText)
    },

    getNumericValue(value) {
      const match = String(value).replace(/,/g, '').match(/-?\d+(\.\d+)?/)
      return match ? parseFloat(match[0]) : null
    },

    animateNumber(key, from, to, finalText) {
      const duration = 800
      const startTime = Date.now()
      const decimals = this.getDecimalLength(finalText)

      this.clearNumberTimer(key)

      const tick = () => {
        const progress = Math.min((Date.now() - startTime) / duration, 1)

        if (progress >= 1) {
          this.$set(this.displayUserInfo, key, finalText)
          this.clearNumberTimer(key)
          return
        }

        const current = this.getSlotNumber(from, to, progress)
        this.$set(this.displayUserInfo, key, this.formatTweenNumber(current, decimals, finalText))
        this.numberTimers[key] = setTimeout(tick, 45)
      }

      tick()
    },

    getSlotNumber(from, to, progress) {
      const min = Math.min(from, to)
      const max = Math.max(from, to)
      const distance = Math.max(max - min, Math.abs(to) * 0.08, 1)

      if (progress < 0.7) {
        return min + Math.random() * Math.max(max - min, distance)
      }

      const settleProgress = (progress - 0.7) / 0.3
      const base = from + (to - from) * settleProgress
      const jitter = distance * (1 - settleProgress) * (Math.random() - 0.5)
      return base + jitter
    },

    getDecimalLength(value) {
      const match = String(value).match(/\.(\d+)/)
      return match ? match[1].length : 0
    },

    formatTweenNumber(value, decimals, finalText) {
      const negative = value < 0
      const fixed = Math.abs(value).toFixed(decimals)
      const parts = fixed.split('.')
      if (String(finalText).indexOf(',') !== -1) {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      return (negative ? '-' : '') + parts.join('.')
    },

    clearNumberTimer(key) {
      clearTimeout(this.numberTimers[key])
      this.numberTimers[key] = null
    },

    clearAllNumberTimers() {
      Object.keys(this.numberTimers).forEach((key) => {
        clearTimeout(this.numberTimers[key])
      })
    },

    clearTaskCooldownTimer() {
      if (this._taskCooldownTimer) {
        clearInterval(this._taskCooldownTimer)
        this._taskCooldownTimer = null
      }
    },

    saveTaskCooldownEnd(endTime) {
      try {
        uni.setStorageSync(TASK_COOLDOWN_STORAGE_KEY, endTime)
      } catch (e) {}
    },

    clearTaskCooldownCache() {
      this._taskCooldownEnd = 0
      try {
        uni.removeStorageSync(TASK_COOLDOWN_STORAGE_KEY)
      } catch (e) {}
    },

    loadTaskCooldownEnd() {
      if (this._taskCooldownEnd) {
        return this._taskCooldownEnd
      }
      try {
        const val = uni.getStorageSync(TASK_COOLDOWN_STORAGE_KEY)
        const end = parseInt(val, 10) || 0
        if (end > 0) {
          this._taskCooldownEnd = end
        }
      } catch (e) {}
      return this._taskCooldownEnd || 0
    },

    restoreTaskCooldown() {
      const end = this.loadTaskCooldownEnd()
      if (!end) return
      const left = Math.ceil((end - Date.now()) / 1000)
      if (left <= 0) {
        this.clearTaskCooldownCache()
        this.taskCooldown = 0
        return
      }
      this._taskCooldownEnd = end
      this.runTaskCooldownTimer()
    },

    startTaskCooldown() {
      const seconds = parseInt(this.task_cooldown_seconds, 10) || 0
      if (seconds <= 0) return
      this._taskCooldownEnd = Date.now() + seconds * 1000
      this.saveTaskCooldownEnd(this._taskCooldownEnd)
      this.runTaskCooldownTimer()
    },

    runTaskCooldownTimer() {
      this.clearTaskCooldownTimer()
      const tick = () => {
        const left = Math.ceil((this._taskCooldownEnd - Date.now()) / 1000)
        if (left <= 0) {
          this.clearTaskCooldownCache()
          this.taskCooldown = 0
          this.clearTaskCooldownTimer()
          return
        }
        this.taskCooldown = left
      }
      tick()
      this._taskCooldownTimer = setInterval(tick, 1000)
    },

    async handleTask(item) {
      if (!item || this.isTaskDone(item)) {
        return
      }
      if (!this.memberTaskPermission) {
		uni.showToast({ title: this.memberTaskPermissionMsg || '暂无权限', icon: 'none' })
        return
      }
      if (this.taskCooldown > 0) {
        return
      }
      if (!this.canDoTask || item.task_blocked) {
        uni.showToast({
          title: this.taskBlockMsg || '暂时无法做任务',
          icon: 'none'
        })
        return
      }
      if (this.task_cooldown_seconds > 0) {
        this.startTaskCooldown()
      }
      const raw = item.raw_type || item.type
      if (raw === 'shop_pro') {
        this.doShopProJump(item)
        return
      }
      if (raw === 'local_video') {
        this.$common.diyLinkJump(
          '/ad_task/web/index.php?m=index&a=index#/pages/index/video_watch?task_list_id=' + encodeURIComponent(String(item.id)),
          'h5',
          true
        )
        return
      }
      if (raw === 'ads_video') {
        const settings = await this.fetchRewardVideoSettings()
        const allianceType = settings && settings.ad_alliance_type != null
          ? String(settings.ad_alliance_type).toUpperCase()
          : ''
        if (allianceType == 'SSP') {
          this.openAdsVideoMiniProgram(item)
          uni.showToast({ title: '正在跳转', icon: 'none' })
          return
        }
        if (allianceType == 'UNI-AD') {
          this.openUniAdRewardedVideo(item, settings)
          return
        }
        uni.showToast({ title: '激励视频配置异常', icon: 'none' })
        return
      }
      uni.showToast({ title: '该任务类型敬请期待', icon: 'none' })
    },

    doShopProJump(item) {
      this.$common.requestData({
        url: '/ad_task/web/index.php?m=ad_task&a=shop_pro_jump',
        data: { task_list_id: item.id },
        method: 'POST',
        needToken: true,
        needLoading: true
      })
        .then((res) => {
          const d = res.data || res || {}
          if (d.rewarded) {
            uni.showToast({
              title: '已获得 ' + (d.reward_amount || '') + ' ' + this.scoreUnit,
              icon: 'none'
            })
          }
          const url = d.jump_url
          if (!url) {
            this.fetchHome()
            return
          }
          this.fetchHome()
          this.$common.diyLinkJump(String(url), 'h5', true)
        })
        .catch((err) => {
          uni.showToast({ title: (err && err.errmsg) || '请求失败', icon: 'none' })
        })
    },

    getWeixinMiniOriginId() {
      const baseInfo = this.vuex_base && this.vuex_base.weixin_mini_info
      if (baseInfo && baseInfo.orginid) {
        return String(baseInfo.orginid)
      }
      const configInfo = this.$config && this.$config.base && this.$config.base.weixin_mini_info
      if (configInfo && configInfo.orginid) {
        return String(configInfo.orginid)
      }
      return ''
    },

    openAdsVideoMiniProgram(item) {
      const originId = this.getWeixinMiniOriginId()
      if (!originId) {
        uni.showToast({ title: '微信小程序未配置', icon: 'none' })
        return
      }

      const taskId = item && item.id != null ? String(item.id) : ''
	  const userId = this.vuex_user.user_id || ''; 
      const path = '/ad_task/pages/index/ads_reward?task_list_id=' + encodeURIComponent(taskId) + '&from_client=xingyun_app&task_user_id=' + encodeURIComponent(userId)

      // #ifdef APP-PLUS
      const launchMiniProgram = () => {
        weixinShareService.launchMiniProgram({
          id: originId,
          path: path,
          type: 0,
		  success() {
		  	console.log('调起小程序成功')
		  },
		  fail(err) {
		  	console.error('调起失败', err)
		  }
        })
      }
      if (weixinShareService) {
        launchMiniProgram()
        return
      }

      plus.share.getServices((services) => {
        for (let i = 0; i < services.length; i++) {
          if (services[i].id === 'weixin') {
            weixinShareService = services[i]
            break
          }
        }
        if (!weixinShareService) {
          uni.showToast({ title: '暂无微信服务', icon: 'none' })
          return
        }
        launchMiniProgram()
      }, () => {
        uni.showToast({ title: '唤起微信失败', icon: 'none' })
      })
      return
      // #endif

      uni.showToast({ title: '请在APP中打开小程序', icon: 'none' })
    },

    openUniAdRewardedVideo(item, settings) {
      const adpid = settings && settings.uni_ad_reward_video_id != null
        ? String(settings.uni_ad_reward_video_id)
        : ''
      if (!adpid) {
        uni.showToast({ title: '激励视频广告位未配置', icon: 'none' })
        return
      }
      if (typeof uni.createRewardedVideoAd !== 'function') {
        uni.showToast({ title: '当前环境不支持激励视频', icon: 'none' })
        return
      }

      const taskId = item && item.id != null ? String(item.id) : ''
      const rewardedVideoAd = uni.createRewardedVideoAd({
        adpid: adpid,
        urlCallback: {
          userId: this.vuex_user.user_id || '',
          extra: {
            http_host: this.http_host,
            customer_id: this.vuex_customer_id,
            task_list_id: taskId,
			from_client: this.vuex_client
          }
        }
      })

      rewardedVideoAd.onLoad(() => {})
      rewardedVideoAd.onError((err) => {
        console.error('task_center rewarded onError', err)
        uni.showToast({
          icon: 'none',
          title: err && err.errMsg ? String(err.errMsg) : '广告视频加载失败，请稍后重试'
        })
      })
      rewardedVideoAd.onClose((res) => {
        if (res && res.isEnded) {
          this.fetchHome()
        }
      })

      rewardedVideoAd.load()
        .then(() => rewardedVideoAd.show())
        .catch((err) => {
          console.error('task_center rewarded load/show rejected', err)
          uni.showToast({
            icon: 'none',
            title: '广告视频加载失败，请稍后重试'
          })
        })
    },

    onAdLoad(e) {
      console.log('banner广告加载', e)
    },

    onAdError(err) {
      console.error('banner广告加载失败', err)
    },

    onAdClose(e) {
      console.log('banner广告关闭', e)
    },

    openPacketModal() {
      if (this.waitReceiveRaw <= 0) {
        return
      }
      this.packetVisible = true
      this.packetOpened = false
      this.receivedAmount = '0.00'
      this.packetResultDesc = '已发放至账户'
    },

    openRedPacket() {
      if (this.waitReceiveRaw <= 0) {
        uni.showToast({ title: '暂无可领取红包', icon: 'none' })
        return
      }
      this.openPacketModal()
    },

    receivePacket() {
      if (this.claimLoading || this.packetOpened) {
        return
      }
      this.claimLoading = true
      this.$common.requestData({
        url: '/ad_task/web/index.php?m=score_dividend&a=claim_pending',
        data: {},
        method: 'POST',
        needToken: true,
        needLoading: true
      })
        .then((res) => {
          const d = res.data || res || {}
          this.packetOpened = true
          this.receivedAmount = d.received_amount != null ? String(d.received_amount) : '0.00'
          this.packetResultDesc = '已发放至购物券/零钱账户'
          this.setNumberValue('waitReceiveAmount', '0.00')
          this.waitReceiveRaw = 0
          if (d.wallet_balance != null) {
            this.setNumberValue('walletBalance', String(d.wallet_balance))
          }
          this.fetchHome()
        })
        .catch((err) => {
          uni.showToast({ title: (err && err.errmsg) || '领取失败', icon: 'none' })
        })
        .then(() => {
          this.claimLoading = false
        })
    },

    closePacket() {
      this.packetVisible = false
      if (this.packetOpened) {
        this.fetchHome()
      }
    },

    closeAutoReward() {
      this.autoRewardVisible = false
    },

    goRewardRecord() {
      this.$common.diyLinkJump('/ad_task/web/index.php?m=index&a=index#/pages/task/reward_record', 'h5', true)
    },

    goRedRecord() {
      this.$common.diyLinkJump('/ad_task/web/index.php?m=index&a=index#/pages/task/red_record', 'h5', true)
    },

    goAdPointDetail() {
      this.$common.diyLinkJump('/ad_task/web/index.php?m=index&a=index#/pages/task/ad_point_detail', 'h5', true)
    },

    goRule() {
      this.$common.diyLinkJump('/ad_task/web/index.php?m=index&a=index#/pages/index/rule_desc', 'h5', true)
    },
	
	goMyScore() {
		this.$common.diyLinkJump('/ad_task/web/index.php?m=index&a=index#/pages/task/ad_point_detail', 'h5', true)
	}
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #fff4ec;
  padding-bottom: 40rpx;
}

.header-wrap {
  background: linear-gradient(180deg, #e92323 0%, #ff5a38 58%, #fff4ec 100%);
  padding: 32rpx 24rpx 24rpx;
}

.banner-ad-wrap {
  margin-bottom: 20rpx;
  overflow: hidden;
  border-radius: 24rpx;
}

.banner-box {
  height: 230rpx;
  border-radius: 28rpx;
  overflow: hidden;
  box-shadow: 0 16rpx 36rpx rgba(165, 24, 24, 0.24);
}

.banner-img,
.banner-placeholder {
  width: 100%;
  height: 100%;
}

.banner-placeholder {
  background:
    radial-gradient(circle at 80% 25%, rgba(255, 230, 147, 0.9), transparent 22%),
    linear-gradient(135deg, #d71920 0%, #ff4537 45%, #ffbb54 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 34rpx;
  box-sizing: border-box;
}

.banner-placeholder::before {
  content: "";
  position: absolute;
  left: -40rpx;
  bottom: -70rpx;
  width: 220rpx;
  height: 220rpx;
  border-radius: 50%;
  background: rgba(255, 231, 162, 0.18);
}

.banner-title {
  color: #fff7d8;
  font-size: 44rpx;
  font-weight: 900;
  letter-spacing: 2rpx;
  text-shadow: 0 4rpx 10rpx rgba(124, 15, 15, 0.28);
}

.banner-subtitle {
  margin-top: 16rpx;
  color: #fff;
  font-size: 26rpx;
}

.banner-coin {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff6b8, #ffc135);
  color: #d22516;
  font-size: 72rpx;
  font-weight: 900;
  text-align: center;
  line-height: 128rpx;
  box-shadow: inset 0 -8rpx 0 rgba(255, 151, 25, 0.35), 0 12rpx 24rpx rgba(120, 30, 0, 0.25);
}

.income-card {
  margin-top: 24rpx;
  background: linear-gradient(180deg, #fff8e6 0%, #ffffff 100%);
  border-radius: 28rpx;
  padding: 30rpx 26rpx;
  box-shadow: 0 14rpx 36rpx rgba(160, 42, 20, 0.16);
}

.main-income {
  text-align: center;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid rgba(220, 70, 36, 0.12);
}

.label {
  color: #a75524;
  font-size: 26rpx;
}

.money {
  margin-top: 10rpx;
  color: #df1f1f;
  font-size: 62rpx;
  font-weight: 900;
}

.income-grid {
  display: flex;
  margin-top: 26rpx;
}

.income-item {
  flex: 1;
  text-align: center;
  position: relative;
}

.income-item:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 12rpx;
  width: 1rpx;
  height: 54rpx;
  background: rgba(224, 65, 36, 0.15);
}

.item-value {
  color: #2c1a13;
  font-size: 32rpx;
  font-weight: 800;
}

.item-label {
  margin-top: 8rpx;
  color: #9d725f;
  font-size: 24rpx;
}

.red-packet-card {
  margin-top: 22rpx;
  background: linear-gradient(90deg, #fff1bd 0%, #ffe39a 100%);
  border-radius: 24rpx;
  padding: 22rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 12rpx 26rpx rgba(171, 74, 8, 0.16);
}

.packet-left {
  display: flex;
  align-items: center;
}

.packet-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 20rpx;
  color: #fff;
  font-size: 40rpx;
  text-align: center;
  line-height: 70rpx;
  margin-right: 18rpx;
}

.icon-img {
	width: 74rpx;
	height: 74rpx;
}

.icon-img-mini {
	width: 40rpx;
	height: 40rpx;
}

.packet-title {
  color: #68270f;
  font-size: 28rpx;
  font-weight: 800;
}

.packet-desc {
  margin-top: 6rpx;
  color: #a2622f;
  font-size: 22rpx;
}

.packet-right {
  text-align: right;
}

.packet-money {
  color: #df1f1f;
  font-size: 32rpx;
  font-weight: 900;
}

.packet-btn {
  margin-top: 8rpx;
  padding: 8rpx 22rpx;
  background: linear-gradient(90deg, #e92323, #ff623d);
  color: #fff;
  font-size: 24rpx;
  border-radius: 999rpx;
}

.record-entry-row {
  margin: 0 24rpx 26rpx;
  height: 92rpx;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16rpx);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 8rpx 22rpx rgba(155, 78, 28, 0.06);
}

.record-mini-item {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-icon {
  width: 42rpx;
  height: 42rpx;
  border-radius: 14rpx;
  text-align: center;
  line-height: 42rpx;
  font-size: 24rpx;
  margin-right: 12rpx;
}

.record-mini-item text {
  color: #553222;
  font-size: 28rpx;
  font-weight: 700;
}

.mini-divider {
  width: 1rpx;
  height: 34rpx;
  background: rgba(185, 122, 78, 0.16);
}

.section-head {
  margin: 34rpx 24rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-left {
  display: flex;
  align-items: center;
}

.title-line {
  width: 8rpx;
  height: 42rpx;
  border-radius: 999rpx;
  background: linear-gradient(180deg, #e92323, #ffb13d);
  margin-right: 16rpx;
}

.section-title {
  color: #2b1710;
  font-size: 36rpx;
  font-weight: 900;
  line-height: 42rpx;
}

.section-desc {
  margin-top: 6rpx;
  color: #a06f55;
  font-size: 23rpx;
}

.rule-btn {
  height: 62rpx;
  padding: 0 12rpx 0 10rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12rpx);
  display: flex;
  align-items: center;
  box-shadow: 0 6rpx 18rpx rgba(186, 72, 24, 0.08);
}

.rule-icon {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  background: linear-gradient(180deg, #ff6b4a, #e92323);
  color: #fff;
  font-size: 24rpx;
  font-weight: 800;
  text-align: center;
  line-height: 38rpx;
}

.rule-text {
  margin-left: 12rpx;
  color: #6b3416;
  font-size: 24rpx;
  font-weight: 700;
}

.rule-arrow {
  margin-left: 8rpx;
  color: #b86b3c;
  font-size: 30rpx;
}

.task-list {
  padding: 0 24rpx;
}

.task-card {
  margin-bottom: 18rpx;
  padding: 22rpx;
  border-radius: 24rpx;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 8rpx 22rpx rgba(147, 64, 26, 0.06);
}

.check-circle {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff2cb, #ffd879);
  color: #b45a00;
  line-height: 50rpx;
  text-align: center;
  font-size: 24rpx;
  font-weight: 900;
  margin-right: 18rpx;
  flex-shrink: 0;
}

.check-circle.done {
  background: #eeeeee;
  color: #999;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title-row {
  display: flex;
  align-items: center;
}

.task-title {
  color: #24140f;
  font-size: 30rpx;
  font-weight: 800;
  line-height: 38rpx;
  max-width: 260rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reward-inline {
  margin-left: 12rpx;
  height: 40rpx;
  padding: 0 14rpx 0 8rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  background: rgba(255, 241, 204, 0.65);
}

.reward-coin {
  width: 30rpx;
  height: 30rpx;
}

.reward-inline text {
  color: #b77943;
  font-size: 26rpx;
  font-weight: 700;
}

.task-desc {
  margin-top: 6rpx;
  color: #9c7564;
  font-size: 23rpx;
  line-height: 32rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-count {
  margin-top: 8rpx;
  color: #d93a26;
  font-size: 23rpx;
  font-weight: 700;
}

.task-action {
  margin-left: 16rpx;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.task-btn {
  width: 96rpx;
  height: 52rpx;
  line-height: 52rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #e92323, #ff673f);
  color: #fff;
  text-align: center;
  font-size: 23rpx;
  font-weight: 700;
  box-shadow: 0 6rpx 14rpx rgba(232, 35, 35, 0.16);
  box-sizing: border-box;
}

.task-btn.disabled {
  background: #ddd;
  color: #999;
  box-shadow: none;
}

.task-btn.cooling {
  background: #fff;
  border: 2rpx solid #e92323;
  color: #e92323;
  line-height: 48rpx;
  box-shadow: none;
}

.task-countdown {
  margin-top: 6rpx;
  color: #2c1a13;
  font-size: 22rpx;
  font-weight: 700;
  text-align: center;
  min-width: 96rpx;
}

.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(32, 10, 5, 0.68);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auto-modal {
  width: 560rpx;
  background: linear-gradient(180deg, #fff5cf 0%, #ffffff 100%);
  border-radius: 36rpx;
  padding: 52rpx 36rpx 40rpx;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: popIn 0.35s ease;
}

.shine {
  position: absolute;
  left: 50%;
  top: -180rpx;
  width: 420rpx;
  height: 420rpx;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 205, 54, 0.42), rgba(255, 255, 255, 0));
}

.auto-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
}

.auto-icon-img {
  width: 140rpx;
  height: 140rpx;
  display: block;
}

.auto-title,
.auto-desc,
.auto-money,
.auto-btn {
  position: relative;
  z-index: 2;
}

.auto-title {
  margin-top: 10rpx;
  color: #6d2b12;
  font-size: 30rpx;
  font-weight: 800;
}

.auto-money {
  margin-top: 12rpx;
  color: #e92323;
  font-size: 72rpx;
  font-weight: 900;
}

.auto-desc {
  margin-top: 12rpx;
  color: #9c7564;
  font-size: 24rpx;
}

.auto-btn {
  margin: 34rpx auto 0;
  width: 300rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #e92323, #ff673f);
  color: #fff;
  font-size: 28rpx;
  font-weight: 800;
}

.packet-modal {
  width: 540rpx;
  min-height: 680rpx;
  border-radius: 36rpx;
  overflow: hidden;
  background: linear-gradient(180deg, #de1f1f 0%, #b81313 100%);
  text-align: center;
  position: relative;
  animation: popIn 0.35s ease;
}

.packet-modal-top {
  padding-top: 70rpx;
  color: #ffefbd;
}

.packet-modal-title {
  font-size: 42rpx;
  font-weight: 900;
}

.packet-modal-desc {
  margin-top: 14rpx;
  font-size: 26rpx;
}

.open-circle {
  margin: 90rpx auto 0;
  width: 170rpx;
  height: 170rpx;
  line-height: 170rpx;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff4bb, #f7b733);
  color: #a72011;
  font-size: 66rpx;
  font-weight: 900;
  box-shadow: 0 14rpx 30rpx rgba(86, 12, 8, 0.35);
}

.packet-result {
  /* margin-top: 80rpx; */
  color: #fff1bd;
}

.result-label {
  font-size: 28rpx;
}

.result-money {
  margin-top: 16rpx;
  font-size: 72rpx;
  font-weight: 900;
}

.result-desc {
  margin-top: 10rpx;
  font-size: 24rpx;
}

.packet-close {
  position: absolute;
  left: 50%;
  bottom: 46rpx;
  transform: translateX(-50%);
  width: 240rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 999rpx;
  background: rgba(255, 240, 190, 0.2);
  color: #ffefbd;
  font-size: 26rpx;
}

@keyframes popIn {
  0% { transform: scale(0.75); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
