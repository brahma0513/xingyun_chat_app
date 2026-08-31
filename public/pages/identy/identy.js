export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			theme_color: this.$common.get_color(getApp().globalData.style_color),
			http_host: '',
			form_type: '',
			pop_state: false, //是否显示弹窗
			status: false, //是否最高等级
			toux: '', //头像
			rules: '', //升级说明弹窗内容
			applaybtn: '', //身份申请开关
			status_list: [],
			level:'',
			
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		// app.get_visitor();
		var that = this;
		that.http_host=this.vuex_apiUrl;
		that.userInfo = that.vuex_user;
	},
	
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		var that = this;
		if(that.userInfo){
			this.condition_apply_promoter();
		}
	},
	methods: {
			//获取用户个人信息
			getMyForm: function () {
			  const that = this;
			  var avatarUrl = 'userInfo.avatarUrl';
				var userInfo = that.vuex_user;
					// console.log(userInfo); 
					that.userInfo=userInfo;
					that.userInfo.avatarUrl=userInfo? userInfo.headimgurl : 'null';
			},
			open_pop: function() {
				var that = this;
					that.pop_state=true;
			},
			//关闭弹窗
			close_pop: function() {
				var that = this;
					 that.pop_state=false;
			},
			//升级
			applyHeight: function(index,apply) {
				const that = this;
				if (apply) {
					uni.showModal({
						title: '提示',
						content: '需要填写申请资料，前往填写申请资料？',
						confirmText: "确定",
						cancelText: "取消",
						confirmColor: that.theme_color,
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: 'promotForm?level=' + index,
								})
							} else {}
						}
					});
				}
			},
			//获取等级信息
			get_area: function() {
				var that = this;
				
				that.$common.requestData({
					url: '/wsy_user/api/index.php?m=user&a=regional_privilege_data_select',
					data: {
						type: 1
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					var is_auditing = false;
					// 各项任务进度
					res.data.regional_setting.upgrade_arr.forEach(function(item,index) {
						//是否开启条件
						var tmp_open = [item.promote_open,item.allpromote_open,item.allorder_open,item.allsale_open,item.consume_open,item.prosale_open];
						//升级条件
						var tmp_requ = [item.promote,item.allpromote,item.allorder,item.allsale,item.consume,item.prosale];
						//进度条
						var progress = [];
						//是否可以申请
						item.apply = true;
						if(item.set_open && item.set_open != 0){
							tmp_open.forEach(function(open, idx) {
								
								progress[idx] = 100;
								
								if (open == 0) return;
								
								if (tmp_requ[idx] == 0) {
									progress[idx] = 100;
								} else {
									progress[idx] = item.amount[idx] / parseInt(tmp_requ[idx]) * 100;
								}
								
								if (item.apply && progress[idx] != 100 && progress[idx] < 100) {
									item.apply = false;
								}
								
							})
						}
								
						//消费和销售额保留2位数
						if (item.amount) {
							item.amount[5] = parseFloat(item.amount[5]).toFixed(2);
							item.amount[4] = parseFloat(item.amount[4]).toFixed(2);
						}
								
						item.promote_p    = progress[0];
						item.allpromote_p = progress[1];
						item.allorder_p   = progress[2];
						item.allsale_p    = progress[3];
						item.consume_p    = progress[4];
						item.prosale_p    = progress[5];
						if (item.allsale){
							item.allsale = parseFloat(item.allsale).toFixed(2);
						}
						if (item.consume){
							item.consume = parseFloat(item.consume).toFixed(2);
						}
						if (item.prosale){
							item.prosale = parseFloat(item.prosale).toFixed(2);
						}
						
						
						if (item.op == '待审核') {
							item.apply  = false;
							is_auditing = index;
						}
					})
					//不能申请等级低于目前等级
					if (is_auditing) {
						for (let index in res.data.regional_setting.upgrade_arr){
							res.data.regional_setting.upgrade_arr[index].apply = false;
							if (index >= is_auditing) break;
						}
					}
								
					var rules = res.data.regional_setting.rule.replace('style="', 'style="max-width:100%;');
					
						that.rules=rules;
						that.applaybtn=res.data.regional_setting.is_showuplevel;
						that.status_list=res.data.regional_setting.upgrade_arr;
						console.log(that.status_list);
						that.level=res.data.level;
					if (res.data.level == res.data.regional_setting.upgrade_arr.length) {
							that.status=true;
					}
				})
				
			},
			// 判断是否推广员
			condition_apply_promoter: function () {
				var that = this;
				
				that.$common.requestData({
					url: '/wsy_user/api/index.php?m=user&a=condition_apply_promoter',
					data: {},
					method: 'POST',
					needToken: true
				}).then(data => {
					console.log(data);
					var res = data.data;
					switch (data.errcode) {
						case 0: //可申请状态
							uni.redirectTo({
								url: '/pages/award/promoter/promoter',
							})
							break;
						case 401: //用户已经是推广员
							if (data.status) {
								that.get_area();
								that.getMyForm();
							} else {
								uni.showToast({
									title: data.errmsg,
									icon: 'none',
									duration: 2000
								})
							}
								
							break;
						case 402: //审核中
							uni.redirectTo({
								url: '/pages/award/promoter/promoter',
							})
							break;
						case 403: //尚未开放申请
							uni.redirectTo({
								url: '/public/pages/error/error?errmsg=抱歉，尚未开放申请&notime=' + true,
							})
							break;
						case 404: //尚未开满足申请条件
							uni.redirectTo({
								url: '/public/pages/error/error?errmsg=抱歉，您尚未满足申请条件&notime=' + true,
							})
							break;
						default:
							uni.showToast({
								title: data.errmsg,
								icon: 'none',
								duration: 2000
							})
							break;
					}
								
				})
				
			},
	}
}