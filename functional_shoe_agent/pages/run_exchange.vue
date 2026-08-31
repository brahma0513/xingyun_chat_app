<template>
  <view class="page">
    <view class="hero">
      <view class="sync">
        <view class="dot" />
        <text>今日同步时间：{{ syncTime || '--' }}</text>
      </view>
      <text class="step-label">今日已走</text>
      <view class="steps">
        <text class="steps-num">{{ steps }}</text>
        <text class="steps-unit">步</text>
      </view>
      <view
        class="sync-button"
        :class="{ disabled: !isEnabled }"
        @tap="openWxStepMiniProgram"
      >
        同步微信步数
      </view>
    </view>

    <view class="stats">
      <view v-for="(stat, index) in stats" :key="index" class="stat">
        <text class="stat-label">{{ stat.label }}</text>
        <view class="stat-value">
          <text class="stat-num">{{ stat.value }}</text>
          <text class="stat-unit">{{ stat.unit }}</text>
        </view>
      </view>
    </view>

    <view class="rules">
      <text class="rules-title">规则说明</text>
      <view v-for="(rule, index) in rules" :key="index" class="rule-item">
        {{ index + 1 }}. {{ rule }}
      </view>
      <view v-if="!rules.length" class="rule-item">暂未配置步数奖励规则</view>
    </view>
  </view>
</template>

<script>
let weixinShareService = null

	export default {
		data() {
			return {
				syncTime: '',
				steps: 0,
				isEnabled: false,
				stats: [
					{ label: '今日获得活力值', value: 0, unit: '活力值' },
					{ label: '今日获得红包次数', value: 0, unit: '次' },
				],
				rules: [],
			}
		},
		onLoad() {
			// 初始化页面数据。
		},
		onShow() {
			// 从微信小程序返回 APP 后刷新当天步数和奖励。
			this.getWxStepData()
		},
		onPullDownRefresh() {
			// 下拉刷新当天步数和奖励统计。
			this.getWxStepData(true)
		},
		methods: {
			// 查询当前用户当天同步的步数和奖励汇总。
			getWxStepData(isRefresh = false) {
				this.$common.requestData({
					url: '/functional_shoe_agent/web/index.php?m=redpack&a=get_wx_step_data',
					method: 'POST',
					needToken: true,
				}).then(res => {
					if (res.errcode == 0) {
						const data = res.data
						this.steps = data.step
						this.syncTime = data.sync_time
						this.isEnabled = data.status == 1
						this.stats = [
							{ label: '今日获得活力值', value: data.energy_amount, unit: '活力值' },
							{ label: '今日获得红包次数', value: data.red_envelope_count, unit: '次' },
						]
						this.rules = data.rules
					}
				}).catch(error => {
					console.error('获取微信步数数据失败', error)
				}).finally(() => {
					if (isRefresh) {
						uni.stopPullDownRefresh()
					}
				})
			},

			// 读取当前应用配置的微信小程序原始 ID。
			getWeixinMiniOriginId() {
				const baseInfo = this.vuex_base && this.vuex_base.weixin_mini_info
				if (baseInfo && baseInfo.orginid) {
					return baseInfo.orginid
				}
				const configInfo = this.$config && this.$config.base && this.$config.base.weixin_mini_info
				if (configInfo && configInfo.orginid) {
					return configInfo.orginid
				}
				return ''
			},

			// 从 APP 唤起微信小程序的微信步数同步页面。
			openWxStepMiniProgram() {
				if (!this.isEnabled) {
					uni.showToast({ title: '微信步数奖励未开启', icon: 'none' })
					return
				}

				const originId = this.getWeixinMiniOriginId()
				if (!originId) {
					uni.showToast({ title: '微信小程序未配置', icon: 'none' })
					return
				}
				const userId = this.vuex_user && this.vuex_user.user_id ? this.vuex_user.user_id : ''
				const path = '/functional_shoe_agent/pages/run_exchange?from_client=xingyun_app&task_user_id='
					+ encodeURIComponent(userId)

				// #ifdef APP-PLUS
				const launchMiniProgram = () => {
					weixinShareService.launchMiniProgram({
						id: originId,
						path: path,
						type: 0,
						fail(error) {
							console.error('唤起微信步数小程序失败', error)
							uni.showToast({ title: '唤起微信失败', icon: 'none' })
						},
					})
				}
				if (weixinShareService) {
					launchMiniProgram()
					return
				}
				plus.share.getServices((services) => {
					for (let index = 0; index < services.length; index++) {
						if (services[index].id == 'weixin') {
							weixinShareService = services[index]
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

				uni.showToast({ title: '请在 APP 中打开小程序', icon: 'none' })
			},
		}
	}
</script>

<style lang="less" scoped>
	.page {
	  min-height: 100vh;
	  background: #f7f4f2;
	  color: #2c2929;
	  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
	    "Microsoft YaHei", sans-serif;
	}
	
	.hero {
	  min-height: 214px;
	  padding: 25px 20px 18px;
	  color: #fff;
	  background: #1e9b68;
	  box-sizing: border-box;
	}
	
	.sync {
	  display: flex;
	  align-items: center;
	  gap: 6px;
	  color: rgba(255, 255, 255, 0.75);
	  font-size: 11px;
	}
	
	.dot {
	  width: 6px;
	  height: 6px;
	  border-radius: 50%;
	  background: #ffd17e;
	}
	
	.step-label {
	  display: block;
	  margin-top: 23px;
	  color: rgba(255, 255, 255, 0.76);
	  font-size: 12px;
	}
	
	.steps {
	  display: flex;
	  align-items: baseline;
	  margin-top: 5px;
	}
	
	.steps-num {
	  font-family: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
	  font-size: 50px;
	  font-weight: 900;
	  line-height: 1;
	}
	
	.steps-unit {
	  margin-left: 5px;
	  font-size: 14px;
	}

	.sync-button {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  width: 150px;
	  height: 38px;
	  margin-top: 18px;
	  border-radius: 6px;
	  background: #ffffff;
	  color: #16784f;
	  font-size: 14px;
	  font-weight: 700;
	}

	.sync-button.disabled {
	  background: rgba(255, 255, 255, 0.4);
	  color: rgba(255, 255, 255, 0.8);
	}
	
	.stats {
	  display: flex;
	  margin: 14px 16px 0;
	  overflow: hidden;
	  border: 1px solid #ede5e1;
	  border-radius: 8px;
	  background: #fff;
	}
	
	.stat {
	  flex: 1;
	  padding: 15px 14px;
	}
	
	.stat + .stat {
	  border-left: 1px solid #ede5e1;
	}
	
	.stat-label {
	  display: block;
	  color: #847c79;
	  font-size: 11px;
	}
	
	.stat-value {
	  display: flex;
	  align-items: baseline;
	  gap: 4px;
	  margin-top: 6px;
	}
	
	.stat-num {
	  color: #b83a3c;
	  font-family: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
	  font-size: 23px;
	  font-weight: 700;
	}
	
	.stat-unit {
	  color: #c88a2d;
	  font-size: 10px;
	}
	
	.rules {
	  margin-top: 18px;
	  padding: 18px;
	  border-top: 1px solid #ede5e1;
	  background: #fff;
	}
	
	.rules-title {
	  display: block;
	  margin-bottom: 11px;
	  font-size: 15px;
	  font-weight: 700;
	}
	
	.rule-item {
	  color: #847c79;
	  font-size: 11px;
	  line-height: 1.9;
	}
	
	.rule-item + .rule-item {
	  margin-top: 3px;
	}
</style>
