export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			theme_color: this.$common.get_color(getApp().globalData.style_color),
			http_host: '',
			form_type: '',
			pop_state: false, //是否显示弹窗
			status: false, //当前等级
			rules: '', //升级说明弹窗内容
			applaybtn: '', //身份申请开关
			status_list: [],
			identity_name: [], // 身份等级名称
			level:'',
		}
	},
	 /**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		   const that = this;
		// app.get_visitor()
			that.http_host=this.vuex_apiUrl;
		this.getMyForm();
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		var that = this;
		that.get_area();
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
		// 升级
		toHeighter: function(index) {
			var that = this;
			var lv;
			if( that.level < 5){
				var lv = index+1;
			}else{
				var lv =  that.level;

			}
			console.log(index);
			console.log(lv);
			if (that.is_apply_materials == 1 && that.upgrade_level.indexOf(lv) > -1) {
				uni.showModal({
					title: '提示',
					content: '需要填写申请资料，前往填写申请资料？',
					confirmText: "确定",
					cancelText: "取消",
					confirmColor: that.theme_color,
					success: function(res) {
						console.log(res);
						if (res.confirm) {
							// wx.navigateTo({
							//     url: '/public/pages/award/identy/storeForm?info=' + that.materials_info + "&tip=" + that.guide_language + "&level=" + lv,
							// })
						}
					}
				});
	
			} else {
				uni.showModal({
					title: '提示',
					content: '确定要升级吗?',
					confirmText: "确定",
					cancelText: "取消",
					confirmColor: that.theme_color,
					success: function(res) {
						if (res.confirm) {
							that.applyHeighter(lv);
						}
					}
				});
	
			}
		},
		applyHeighter: function(level) {
			var that = this;
			that.$common.requestData({
				url: '/wsy_user/web/index.php?m=privilege&a=store_privilege',
				data: {
					op: "upgrade",
					level: level
				},
				method: 'POST',
				needToken: true
			}).then(res => {
				console.log(res);
				if (res.errcode === 0) {
					uni.showToast({
						title: res.errmsg,
						icon: 'none',
						duration: 2000
					})
					// setTimeout(function() {
					//     that.get_area();
					// }, 2000);
				} else {
					uni.showToast({
						title: res.errmsg,
						icon: 'none',
						duration: 2000
					})
				}
			})
		},
		get_area: function() {
			var that = this;
			
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=store_privilege_data_select',
				data: {
					type: 1
				},
				method: 'POST',
				needToken: true
			}).then(res => {
				if (res.errcode === 0) {
					var store_setting = res.data.store_setting;
					var applying = -1;
							
					if (store_setting.is_check.length > 0) {
						//审核中等级
						applying = store_setting.upgrade_arr.length - store_setting.is_check[0];
					}
					// 各项任务进度
					store_setting.upgrade_arr.forEach(function(item, index) {
							
						//是否可以申请
						item.apply = true;
						//晋升等级没有开启
						if (item.is_open == 0) return;
						if (item.upgrade_condition) {;
							item.upgrade_condition.forEach(function(items, idx) {
								
								//晋升条件没有开启
								if (items.is_open == 0) return;
							// console.log('upgrade_condition',idx,items.is_open==0);
								if (items.num == 0) {
									items.percent = 100;
								} else {
									items.percent = (parseFloat(items.amount) * 100) / (parseFloat(items.num) * 100) * 100;
								}
								if (idx == 4) {
									if (items.volume_percent == 0) {
										items.percent = 100;
									} else {
										items.percent = (parseFloat(items.amount) * 100) / (parseFloat(items.volume_percent) * 100) * 100;
									}
								}
							
								if (item.apply && items.percent != 100 && items.percent < 100) {
									item.apply = false;
								}
							}) 
							
							if (index < applying) {
								item.apply = false;
							} else if (index == applying) {
								item.is_check = true;
							}
							
							item.upgrade_condition[2].amount = parseFloat(item.upgrade_condition[2].amount).toFixed(0);
							item.upgrade_condition[2].num = parseFloat(item.upgrade_condition[2].num).toFixed(0);
							item.upgrade_condition[3].amount = parseFloat(item.upgrade_condition[3].amount).toFixed(2);
							item.upgrade_condition[3].num = parseFloat(item.upgrade_condition[3].num).toFixed(2);
							item.upgrade_condition[5].amount = parseFloat(item.upgrade_condition[5].amount).toFixed(2);
							item.upgrade_condition[5].num = parseFloat(item.upgrade_condition[5].num).toFixed(2);
							item.upgrade_condition[6].amount = parseFloat(item.upgrade_condition[6].amount).toFixed(2);
							item.upgrade_condition[6].num = parseFloat(item.upgrade_condition[6].num).toFixed(2);
							// 7/8
							// if(item.upgrade_condition[10].num==0){
							//     item.upgrade_condition[10].percent=100;
							// }else{
							//     item.upgrade_condition[10].percent=(parseFloat(item.upgrade_condition[10].amount) * 100) / (parseFloat(item.upgrade_condition[10].child_num) * 100) * 100;
							// }
						   
							// 7/8end
						}
					})
							
					//最高级
					if (res.data.level == res.data.store_setting.upgrade_arr.length) {
							that.status= true;
				
					}
						that.rules=res.data.store_setting.rule;
						//是否开放用户申请
						that.applaybtn=res.data.store_setting.is_showuplevel;
						that.status_list=res.data.store_setting.upgrade_arr;
						console.log('that.status_list',that.status_list);
						that.level=res.data.level;
						that.materials_info=res.data.store_setting.materials_info;
						//是否开启填写店铺奖励申请资料
						that.is_apply_materials=res.data.store_setting.is_apply_materials;
						//申请模式 1.按等级设置申请资料 2.先资料审核后申请等级
						that.apply_type=res.data.store_setting.apply_type;
						that.guide_language=res.data.store_setting.guide_language;
						that.is_check= res.data.store_setting.is_check;
						that.upgrade_level=res.data.store_setting.upgrade_level; //升级需要填写资料的等级
						that.identity_name=res.data.identity_name; // 身份等级名称
				}
				//跳转申请推广员
				else if (res.errcode == 4010) {
					uni.redirectTo({
						url: '/public/pages/spread/applySpread',
					})
				} else {
					uni.showModal({
						title: '提示',
						content: res.errmsg,
						showCancel: false,
						confirmColor: that.theme_color,
						success: function(res) {
							uni.navigateBack({
								delta: 1
							})
						},
					})
				}
			})
			
		
		},
	}
}