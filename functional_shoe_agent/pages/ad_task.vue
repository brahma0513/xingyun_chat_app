<template>
	<view class="page">
		<!-- <view class="hero">
		  <text class="hero-title">看广告得活力值</text>
		  <image
			class="hero-img"
			:src="http_host+'/functional_shoe_agent/web/static/images/ad-task-benefit-illustration.png'"
			mode="widthFix"
		  />
		</view> -->

		<view class="promo">
		  <image
			class="promo-bg"
			:src="http_host+'/functional_shoe_agent/web/static/images/ad-task-drama-banner.png'"
			mode="aspectFill"
		  />
		  <text class="promo-text">看广告得活力值</text>
		</view>

		<view class="panel">
		  <view class="panel-title">日常福利</view>

		  <view v-for="task in tasks" :key="task.id" class="task">
			<view class="task-body">
			  <text class="task-title">
				{{ task.title }}
				<text class="coin">◉ {{ task.reward_energy }}活力值</text>
			  </text>
			  <view class="progress-row">
				<text class="progress-label">已完成</text>
				<view class="bar">
				  <view
					class="bar-fill"
					:style="{ width: progressOf(task) }"
				  />
				</view>
				<text class="progress-num">{{ countOf(task) }}</text>
			  </view>
			  <text class="task-desc">观看广告获得活力值</text>
			</view>
			<button
			  class="watch-btn"
			  :disabled="isIpDailyLimit || !isTaskUnlocked(task) || task.is_finished == 1 || adStatus != 'ready' || adShowing || adCountdownSeconds > 0"
			  @click="watchAd"
			>
			  {{ watchButtonText(task) }}
			</button>
		  </view>
		  <view v-if="!tasks.length && !loading" class="empty">暂无广告任务</view>

		  <view class="notice">
			<image class="notice-icon" :src="http_host+'/functional_shoe_agent/web/static/images/warn.png'"	mode="widthFix"></image>
			<text class="notice-text">
			  {{ rulesText }}
			</text>
		  </view>
		</view>

		<view v-if="toastVisible" class="toast">{{ toastText }}</view>
	</view>
</template>

<script>
	import pagecom from '@/components/pagecom/pagecom.vue'
	export default {
		components: {
			pagecom
		},
		// 初始化广告任务页面状态
		data() {
			return {
				http_host: '',
				loading: false,
				setting: {},
				pageTitle: "广告任务",
				template_data: {
					has_bottom: true
				},
				toastText: "",
				toastVisible: false,
				toastTimer: null,
				adStatus: "preparing",
				adShowing: false,
				rewardedVideoAd: null,
				adCountdownSeconds: 0,
				adCountdownTimer: null,
				isIpDailyLimit: false,
				tasks: [],
				rulesText: "",
			}
		},
		filters: {
			
		},
		// 页面加载时读取广告配置并初始化广告实例
		onLoad() {
			this.http_host = this.vuex_apiUrl;
			this.getAdTaskSetting();
		},
		// 页面展示时刷新任务进度和 IP 上限状态
		onShow() {
			this.getAdTaskList();
		},
		// 下拉刷新任务列表
		onPullDownRefresh() {
			this.getAdTaskList().finally(function () {
				uni.stopPullDownRefresh();
			});
		},
		// 页面触底时不加载额外内容
		onReachBottom() {
			
		},
		// 页面卸载时清理定时器
		onUnload() {
			this.clearAdCountdown();
			if (this.toastTimer) clearTimeout(this.toastTimer);
		},
		methods: {
			// 获取广告配置并创建激励视频广告实例
			getAdTaskSetting: function () {
			  var self = this;
			  return this.$common.requestData({
				url: '/functional_shoe_agent/web/index.php?m=redpack&a=get_ad_task_setting',
				data: {},
				method: 'POST',
				needToken: true,
				needLoading: false
			  }).then(function (res) {
				if (res.errcode == 0 && res.data) {
				  self.setting = res.data;
				  self.pageTitle = res.data.page_title || "广告任务";
				  uni.setNavigationBarTitle({
					title: self.pageTitle
				  });
				  self.rulesText = res.data.rules;
				  self.initRewardedVideoAd();
				} else {
				  self.adStatus = "none";
				  self.showToast(res.errmsg || "广告设置加载失败");
				}
			  }).catch(function () {
				self.adStatus = "none";
				self.showToast("广告设置加载失败");
			  });
			},
			// 获取任务列表、用户进度和当前 IP 上限状态
			getAdTaskList: function () {
			  var self = this;
			  this.loading = true;
			  return this.$common.requestData({
				url: '/functional_shoe_agent/web/index.php?m=redpack&a=get_ad_task_list',
				data: {},
				method: 'POST',
				needToken: true,
				needLoading: false
			  }).then(function (res) {
				if (res.errcode == 0 && res.data) {
				  self.tasks = Array.isArray(res.data.list) ? res.data.list : [];
				  self.isIpDailyLimit = res.data.is_ip_daily_limit == 1;
				} else {
				  self.showToast(res.errmsg || "任务加载失败");
				}
			  }).catch(function () {
				self.showToast("任务加载失败");
			  }).finally(function () {
				self.loading = false;
			  });
			},
			// 初始化激励视频广告并监听加载、错误和关闭事件
			initRewardedVideoAd: function () {
			  var self = this;
			  if (!this.setting.ad_app_id) {
				this.adStatus = "none";
				return;
			  }
			  if (!uni.createRewardedVideoAd) {
				this.adStatus = "none";
				return;
			  }
			  this.adStatus = "preparing";
			  this.rewardedVideoAd = uni.createRewardedVideoAd({
				adpid: this.setting.ad_app_id,
				urlCallback: {
				  userId: this.vuex_user.user_id || ''
				}
			  });
			  this.rewardedVideoAd.onLoad(function () {
				self.adStatus = "ready";
			  });
			  this.rewardedVideoAd.onError(function (err) {
				self.adShowing = false;
				self.adStatus = "none";
				self.showToast(err && err.errMsg ? err.errMsg : "广告加载失败");
			  });
			  this.rewardedVideoAd.onClose(function (res) {
				self.adShowing = false;
				if (res && res.isEnded) {
				  self.showToast("观看完成，奖励发放中");
				  self.startAdCountdown();
				  setTimeout(function () {
					self.getAdTaskList();
				  }, 1200);
				} else {
				  self.showToast("广告未完整观看");
				}
			  });
			},
			// 返回任务完成次数文本
			countOf: function (task) {
			  var target = task.ad_count || 0;
			  var done = task.done_count || 0;
			  return Math.min(done, target) + "/" + target;
			},
			// 返回任务进度条百分比
			progressOf: function (task) {
			  var target = task.ad_count || 0;
			  var done = task.done_count || 0;
			  if (target <= 0) return "0%";
			  return (Math.min(done, target) / target) * 100 + "%";
			},
			// 显示短暂的页面提示
			showToast: function (text) {
			  var self = this;
			  this.toastText = text;
			  this.toastVisible = true;
			  if (this.toastTimer) clearTimeout(this.toastTimer);
			  this.toastTimer = setTimeout(function () {
				self.toastVisible = false;
			  }, 1400);
			},
			// 根据任务、广告和 IP 状态返回按钮文案
			watchButtonText: function (task) {
				if (task.is_finished == 1) {
				  return "已完成";
				}
				if (this.isIpDailyLimit) {
				  return "今日已达上限";
				}
			  if (this.adCountdownSeconds > 0) {
				return this.adCountdownSeconds + "秒后可看";
			  }
			  if (this.adStatus == "preparing") {
				return "广告准备中";
			  }
			  if (this.adStatus == "none") {
				return "暂无广告";
			  }
			  return "观看广告";
			},
			// 仅允许第一个未完成任务观看广告
			isTaskUnlocked: function (task) {
			  for (var index = 0; index < this.tasks.length; index++) {
				if (this.tasks[index].is_finished != 1) {
				  return this.tasks[index].id == task.id;
				}
			  }
			  return false;
			},
			// 校验当前状态后展示激励视频广告
			watchAd: function () {
				if (this.isIpDailyLimit || this.adStatus != "ready" || this.adShowing || this.adCountdownSeconds > 0) {
				return;
			  }
			  this.adShowing = true;
			  this.adStatus = "preparing";
			  this.rewardedVideoAd.show();
			},
			// 按后台配置启动下一条广告观看倒计时
			startAdCountdown: function () {
			  var seconds = this.setting.ad_interval_seconds || 0;
			  if (seconds <= 0) {
				return;
			  }
			  var self = this;
			  this.clearAdCountdown();
			  this.adCountdownSeconds = seconds;
			  this.adCountdownTimer = setInterval(function () {
				self.adCountdownSeconds = self.adCountdownSeconds - 1;
				if (self.adCountdownSeconds <= 0) {
				  self.clearAdCountdown();
				}
			  }, 1000);
			},
			// 清除广告观看倒计时
			clearAdCountdown: function () {
			  if (this.adCountdownTimer) {
				clearInterval(this.adCountdownTimer);
				this.adCountdownTimer = null;
			  }
			  this.adCountdownSeconds = 0;
			},
		}
	}
</script>

<style lang="less" scoped>
	.page {
	  min-height: 100vh;
	  padding: 18px 12px 24px;
	  box-sizing: border-box;
	  background: linear-gradient(
	    145deg,
	    #fc39a3 0%,
	    #f48abf 31%,
	    #c9bcff 62%,
	    #eff0f8 83%
	  );
	  color: #171717;
	  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
	    "Microsoft YaHei", sans-serif;
	}
	
	.hero {
	  position: relative;
	  min-height: 102px;
	  padding: 20px 16px;
	  overflow: hidden;
	  border-radius: 18px;
	  background: #fff;
	  box-shadow: 0 10px 20px rgba(154, 40, 114, 0.16);
	}
	
	.hero-title {
	  position: relative;
	  z-index: 1;
	  font-size: 24px;
	  font-weight: 700;
	}
	
	.hero-img {
	  position: absolute;
	  top: -24px;
	  right: -36px;
	  width: 200px;
	  z-index: 0;
	}
	
	.promo {
	  position: relative;
	  height: 48px;
	  margin: 8px 0 12px 0;
	  overflow: hidden;
	  border-radius: 6px;
	  background: #ff5424;
	  box-shadow: 0 6px 12px rgba(237, 60, 67, 0.25);
	}
	
	.promo-bg {
	  position: absolute;
	  left: 0;
	  top: 0;
	  width: 100%;
	  height: 100%;
	}
	
	.promo-text {
	  position: relative;
	  z-index: 1;
	  display: block;
	  padding: 10px 18px;
	  color: #fff8d3;
	  font-size: 18px;
	  font-style: italic;
	  font-weight: 700;
	  line-height: 28px;
	  text-shadow: 0 2px 1px #cc3214;
	}
	
	.panel {
	  overflow: hidden;
	  border-radius: 16px;
	  background: #fff;
	  box-shadow: 0 10px 22px rgba(107, 85, 149, 0.1);
	}
	
	.panel-title {
	  padding: 16px 14px 14px;
	  background: linear-gradient(105deg, #fff2fa, #eff4ff 62%, #fff);
	  font-size: 20px;
	  font-weight: 700;
	}
	
	.task {
	  display: flex;
	  align-items: center;
	  gap: 10px;
	  padding: 14px 12px;
	  border-top: 1px solid #f3f3f5;
	}
	
	.task-body {
	  flex: 1;
	  min-width: 0;
	}
	
	.task-title {
	  display: block;
	  font-size: 15px;
	  font-weight: 700;
	}
	
	.coin {
	  color: #ffad00;
	}
	
	.progress-row {
	  display: flex;
	  align-items: center;
	  gap: 8px;
	  margin-top: 8px;
	}
	
	.progress-label,
	.progress-num {
	  color: #c9c9d0;
	  font-size: 12px;
	  flex-shrink: 0;
	}
	
	.bar {
	  flex: 1;
	  height: 8px;
	  overflow: hidden;
	  border-radius: 8px;
	  background: #ebebee;
	}
	
	.bar-fill {
	  height: 100%;
	  border-radius: inherit;
	  background: linear-gradient(90deg, #ff75ac, #ff3667);
	}
	
	.task-desc {
	  display: block;
	  margin-top: 6px;
	  color: #8d8d96;
	  font-size: 12px;
	}
	
	.watch-btn {
	  flex-shrink: 0;
	  min-width: 86px;
	  height: 34px;
	  padding: 0 10px;
	  border: 0;
	  border-radius: 17px;
	  color: #fff;
	  background: linear-gradient(145deg, #ff6070, #f8082e);
	  font-size: 13px;
	  font-weight: 700;
	  line-height: 34px;
	}
	
	.watch-btn::before {
	  content: "";
	  display: inline-block;
	  width: 0;
	  height: 0;
	  margin-right: 4px;
	  border-top: 6px solid transparent;
	  border-bottom: 6px solid transparent;
	  border-left: 9px solid #fff;
	  vertical-align: middle;
	}
	
	.watch-btn[disabled] {
	  background: #b9c1c4;
	}
	
	.notice {
	  display: flex;
	  gap: 6px;
	  padding: 12px 14px 16px;
	  border-top: 1px solid #f3f3f5;
	}

	.empty {
	  padding: 28px 12px;
	  border-top: 1px solid #f3f3f5;
	  color: #9a9aa3;
	  font-size: 13px;
	  text-align: center;
	}
	
	.notice-icon {
	  flex-shrink: 0;
	  color: #e4a100;
	  font-size: 12px;
	  line-height: 1.4;
	}
	
	.notice-text {
	  color: #8c8c94;
	  font-size: 11px;
	  line-height: 1.4;
	}
	
	.toast {
	  position: fixed;
	  left: 50%;
	  bottom: 40px;
	  z-index: 10;
	  padding: 10px 16px;
	  transform: translateX(-50%);
	  border-radius: 22px;
	  color: #fff;
	  background: rgba(34, 34, 34, 0.8);
	  font-size: 13px;
	  white-space: nowrap;
	}
</style>
