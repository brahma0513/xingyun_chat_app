//import request from "@/request"
//import globalData from "@/utils/config"
import qs from "qs"
import {
	browser
} from "@/utils/common.js"

export const shareMixins = {
	data() {
		return {
			shareData: {
				title: "", //分享标题
				app_name: "", //跳转应用名称
				path: "", //页面 path ，必须是以 / 开头的完整路径。例：/pages/index/index
				query: {}, //自定义参数
				imageUrl: "", //分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4
				content: "", //百度小程序表现为：分享内容；支付宝小程序表现为：吱口令文案
				desc: "", //自定义分享描述
			},
		}
	},
	watch: {
		shareData: {
			//深度监听，可监听到对象、数组的变化
			handler(val, oldVal) {
				//动态改变分享内容
				// #ifdef H5
				const _this = this
				_this.get_jssdk()
				// #endif
			},
			deep: true, //true 深度监听
		},
	},
	//#ifdef MP-WEIXIN
	onShareAppMessage() {
		let {
			title,
			path,
			app_name,
			imageUrl,
			content,
			desc,
			query
		} = this.shareData
		console.info("微信分享信息", this.shareData)
		//query有参数 进入
		if (Object.keys(query).length > 0) {
			path = `${path}?${qs.stringify(this.shareData.query)}`
		}

		return {
			title, //分享标题
			path, //页面 path ，必须是以 / 开头的完整路径。
			imageUrl, //分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4
			content, //百度小程序表现为：分享内容；支付宝小程序表现为：吱口令文案
			desc, //自定义分享描述
			success: (res) => {
				console.info("小程序分享", res)
			},
		}
	},
	//#endif
	created() {
		
	},
	methods: {
		// #ifdef H5
		// 微信分享
		get_jssdk() {
			const _this = this

			if (!browser.versions.weixin) {
				console.warn("仅支持微信客户端!")
				return
			}
			_this.$wx.getJsConfig().then(() => {
				let link =
					`${window.location.origin}/${_this.shareData.app_name}/web${window.location.href.split("web")[1].split("#")[0]}`;
				//query有参数 进入
				if (Object.keys(_this.shareData.query).length > 0) {
					//#前面插入参数
					link += `&${qs.stringify(_this.shareData.query)}`;
					link += `#${_this.shareData.path}`;
					//#后面插入参数
					link += `?${qs.stringify(_this.shareData.query)}`;
				} else {
					link += `#${_this.shareData.path}`;
				}
				//分享给朋友
				_this.shareData.title = _this.shareData.title ? _this.shareData.title : '默认标题',
				_this.$wx.updateAppMessageShareData({
					title: _this.shareData.title, // 分享标题
					desc: _this.shareData.desc, // 分享描述
					link: link, // 当前页面链接
					imgUrl: _this.shareData.imageUrl || "default.png", // 分享图标
					success: function() {
						//分享成功回调
						console.log("进入分享给朋友")
					},
					cancel: function() {
						//取消分享回调
						console.log("取消分享给朋友")
					},
				})
				//分享到朋友圈
				_this.$wx.updateTimelineShareData({
					title: _this.shareData.title, // 分享标题
					link: link, // 分享链接
					desc: _this.shareData.desc, // 分享描述
					imgUrl: _this.shareData.imageUrl || "default.png", // 分享图标
					success: function() {
						// 用户确认分享后执行的回调函数
						console.log("进入分享到朋友圈")
					},
					cancel: function() {
						// 用户取消分享后执行的回调函数
						console.log("取消分享到朋友圈")
					},
				})
			});
		},
		// #endif
	},
}
