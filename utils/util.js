import {
    apiUrl,
	customer_id,
	api_key,
	app_id,
} from './config.js'

import {
    exitLogin
} from './common.js'

import Store from 'store'

const headers = {}
const util = {}
const domain = apiUrl
const vm = this

util.toPrice = function(num, bool){
	num = num.toString()
	if (num.indexOf('.') < 0) {
	    var priceA = num
	    var priceB = '00'
	} else {
	    var priceA = num.split(".")[0]
	    if (num.split(".")[1].length == 0) {
	        priceB = num.split(".")[1] + "0"
	    } else if (num.split(".")[1].length > 2) {
	        priceB = num.split(".")[1].substring(0, 2)
	    } else {
	        priceB = num.split(".")[1]
	    }
	}
	if (bool) {
	    return priceA
	} else {
	    return '.' + priceB
	}
}

util.requestData = async (n) => {
	uni.showLoading({
		title: '加载中',
	})
	switch (n.method) {
		case "GET":
			headers['Content-Type'] = 'application/json'
			break;
		case "POST":
			headers['Content-Type'] = 'application/x-www-form-urlencoded'
			break;
		default:headers['Content-Type'] = 'application/x-www-form-urlencoded'
			break;
	}
	headers['X-Requested-With'] = 'XMLHttpRequest'
	//if (needToken == true) params['mini_user_token'] = uni.getStorageSync('token')
	//if (needToken == true) params['mini_user_token'] = Store.state.vuex_user.token
	var params;
	n.data.customer_id = customer_id;
	n.data.client = Store.state.vuex_client;
	n.data.api_key = api_key;
	n.data.app_id = app_id;
	n.data.user_id = Store.state.vuex_user.user_id;
	//params['user_agent']   = 'third_program_h5';
	//params['request_mode'] = 'fortune_app';
	var full_url = domain + n.url + '&user_agent=third_program_h5&request_mode=fortune_app';
	if (n.needToken == true) full_url = full_url + '&third_token='+Store.state.vuex_user.token;
	return await uni.request({
		url: full_url,
		header: headers,
		data: n.data, 
		method: n.method||'POST',
	}).then(res => {
		uni.hideLoading()
		var result = res[1];
		if (result.statusCode) {
			switch (result.statusCode) {
				case 200:
					if (result.data) {
						switch (result.data.errcode) {
							case 0:
								if (typeof n.success == "function") {
									n.success(result.data, result.statusCode, result.header);
								}
								break;
							case 985001:
							console.log(499999)
								exitLogin();
								uni.hideLoading();
								var pages = getCurrentPages();
								let currentPage = pages[pages.length-1]['$page']['fullPath'] //当前页面路径(带参数)
								var paramstr   = "";
								var back_route = "";
								if(currentPage == ""){
									currentPage = "/pages/personal_center/personal_center"
								}
								if(currentPage.charAt(0) != "/"){
									currentPage = "/" + currentPage;
								}
								uni.redirectTo({
									url: '/public/pages/user/login?back_route='+currentPage
								})
								return;
								uni.showModal({
									title: '提示',
									content: result.data.errmsg,
									confirmText: '登录',
									success: function(res) {
										if (res.confirm) {
											uni.redirectTo({
												url: '/public/pages/user/login?back_route='+currentPage
											})
										} else if (res.cancel) {}
									}
								});
								break;
							default:
								if (typeof n.success == "function") {
									n.success(result.data, result.statusCode, result.header);
								}
								break;
						}
					}
					break;
				case 404:
					uni.showToast({
						title: '请求接口不存在',
						icon: 'none'
					})
					break;
				default:
					uni.showToast({
						title: '...((/- -)/！服务器扔一个错误',
						icon: 'none'
					})
					console.log('...((/- -)/',result);
					break;
			}
			return 0;
		} else {
			switch (result.errMsg) {
				default:
					uni.showToast({
						title: '┌(。Д。)┐！网络错误',
						icon: 'none'
					})
					break;
			}
			return 0;
		}
		return 0;
	}).catch(parmas => {
		uni.hideLoading()
		switch (parmas.code) {
			case 401:
				uni.clearStorageSync()
				break
			default:
				uni.showToast({
					title: parmas.message,
					icon: 'none'
				})
				return Promise.reject()
				break
		}
	})
}

export default util
