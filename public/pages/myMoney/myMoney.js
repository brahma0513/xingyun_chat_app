export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			http_host: '',
			monetary_unit: getApp().globalData.monetary_unit,
			money: '', //零钱余额
			nav_list: [{name:"全部"}, {name:"收入明细"}, {name:"支出明细"}],
			nav_index: 0,
			load_type: '',
			can_load: true,
			list: [],
			page: 1,
			scroll_top: 0,
			total_page: '',
			is_paypassword: false, //用户是否设置密码
			is_allow_withdrawal:0,
			pocket_money_name:'零钱',
			is_given:0,
			// 11/16
			is_recharge: 0,//零钱充值开关
			recharge_type: [], //零钱充值方式
			 // 2/24
			 tiemList: [
				 {
					name: '近三个月',
					type: 'three'
				},
				{
					 name: '近半年',
					 type: 'half_a_year'
				 },
				 {
					 name: '近一年',
					 type: 'year'
				 }
			],
			tiemType: 'three',//筛选值
			filtershow: false,//是否显示筛选框
			tiemText: '近三个月',//无数据时显示的内容
			 // 选择类型
			typeList: [
				{
					name: '全部',
					 type: 'all'
				 },
				 {
					 name: '零钱充值',
					 type: 'recharge'
				 },
				 {
					 name: '消费支付',
					 type: 'consumption'
				 },
				  {	
					 name: '消费退款',
					 type: 'refund'
				 },
				 {
					 name: '用户提现',
					 type: 'withdrawal'
				 }
			],
			 type: 'all',//筛选值
				
		}
	},
	 // 2/24end
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function() {
		// app.get_visitor()
		var that = this;
		that.http_host=this.vuex_apiUrl;
		that.get_points();
		that.get_list();
		that.get_is_paypassword();
		that.pocket_money_setting();
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var that = this;
		//判断是否设置支付密码
		that.get_is_paypassword();
	},
	methods: {
		//获取零钱设置
		pocket_money_setting(){
			var that = this;
			this.$api.getPocketMoneySetting({}).then(res=>{
					that.pocket_money_name = res.data.pocket_money_name;
					that.is_allow_withdrawal=res.data.is_allow_withdrawal;
					that.is_given= res.data.is_given;
					// 11/16
					that.is_recharge=res.data.is_recharge;
					 that.recharge_type=res.data.recharge_type;
					uni.setNavigationBarTitle({
					title:res.data.diy_name
					})	
			})
		},
	  // 重置按钮
		cancelFilter: function () {
			var that = this;
				that.tiemType= 'three';
				that.tiemText='近三个月';
				that.type='all';
		},
		// 显示筛选框
		showFilter: function () {
			var that = this;
			that.filtershow=true;
		},
		// 隐藏筛选框
		hideFilter: function () {
			 var that = this;
			that.filtershow=false;
		},
		// 选择筛选框
		choseFilter: function (index) {
			var that = this;
			var val=that.tiemList;
			that.tiemType=val[index].type;
			that.tiemText=val[index].name;
		},
		typeFilter: function (index) {
			var that = this;
			var val=that.typeList;
			that.type=val[index].type;
		},
		// 确定按钮
		sureFilter: function () {
			var that = this;
			that.hideFilter();
			that.scroll_top= 0;
			that.list=[];
			that.get_list(that.nav_index);
			
		},
		  SetUserInfoHandler: function(res) {
				var that = this;
				if (res.detail.detail.errMsg == 'getUserInfo:ok') {
					that.onLoad()
				}
			},
			/**
			 * 下拉加载更多
			 */
			load_more: function() {
				var that = this;
				if (!that.can_load) {
					return false;
				}
				var listtype = that.nav_index;
				var page = that.page;
				page++;
				that.page= page;
				var post_data = {
					ajax_get: 1,
					page: page,
					page_size: 20,
					// 2/24
					time_stage: that.tiemType,//时间段筛选
					change_type:that.type //筛选类型
				};
				if (listtype != 0) {
					post_data = {
						ajax_get: 1,
						page: page,
						page_size: 10,
						type: listtype,
						// 2/24
						time_stage: that.tiemType,//时间段筛选
						change_type:that.type//筛选类型
					};
				}
				this.$api.getPocketMoneyDetailList(post_data).then(res=>{
					 if (page < that.total_page) {
								 that.can_load= true;
								 that.load_type= 1;
						 } else {
								 that.can_load= false;
								  that.load_type= 3;
						 }
						 for (var item in res.list) {
						   var ItemPrice = Number(res.list[item].money).toFixed(2);
						   // var money=ItemPrice.toString();
							res.list[item].priceA = that.$common.toPrice (ItemPrice, 1);
							res.list[item].priceB = that.$common.toPrice (ItemPrice, 0);
							 if (res.list[item].change_type == 'change_recharge') {
								 res.list[item].change_type_name = '零钱充值';
							 }
							 // 11/17end
							 if (res.list[item].change_type == 'recharge') {
								 res.list[item].change_type_name = '后台充值';
							 }
							 if (res.list[item].change_type == 'consumption') {
								 res.list[item].change_type_name = '消费支付';
							 }
							 if (res.list[item].change_type == 'withdrawal') {
								 res.list[item].change_type_name = '用户提现 ';
							 }
							 if (res.list[item].change_type == 'change') {
								 res.list[item].change_type_name = '转换';
							 }
							 if (res.list[item].change_type == 'refund') {
								 res.list[item].change_type_name = '消费退款';
							 }
							 if (res.list[item].change_type == 'promotion_reward') {
								 res.list[item].change_type_name = '推广收益';
							 }
							 if (res.list[item].change_type == 'performance_reward') {
								 res.list[item].change_type_name = '绩效收益';
							 }
							 if (res.list[item].change_type == 'consumer_reward') {
								 res.list[item].change_type_name = '消费提成';
							 }
							 if (res.list[item].change_type == 'senior_promotion_reward') {
								 res.list[item].change_type_name = '高级销售员';
							 }
							 if (res.list[item].change_type == 'regional_reward') {
								 res.list[item].change_type_name = '区域代理';
							 }
							 if (res.list[item].change_type == 'store_reward') {
								 res.list[item].change_type_name = '店长';
							 }
							 if (res.list[item].change_type == 'money_reward') {
								 res.list[item].change_type_name = '零钱提成';
							 }
							 if (res.list[item].change_type == 'present') {
								 res.list[item].change_type_name = '赠送好友';
							 }
							 if (res.list[item].change_type == 'friend_give') {
								 res.list[item].change_type_name = '好友转赠';
							 }
						 }
						that.list= that.list.concat(res.list);
						 console.log('that.list',that.list);
				})
			},
			tixian: function() {
				var that = this;
				//用户未设置支付密码
				if (that.is_paypassword == false){
					uni.showModal({
						title: '设置支付密码',
						content: '您还没有设置支付密码，请先去设置！',
						showCancel: true,
						cancelText: '取消',
						cancelColor: '#999999',
						confirmText: '确定',
						confirmColor: that.theme_color,
						success: function(res) {
							if (res.cancel) {
							} else {//设置支付密码
								// that.$common.diyLinkJump('/wsy_user/web/index.php?m=set&a=set_paypassword&user_id=' +that.vuex_user.user_id,'h5',true,1)
								uni.navigateTo({
									url: '/public/pages/user/setPaypass',
								});
							}
						},
					})
					return false;
				}
			  var promise= new Promise((resolve, reject) => {
					var _sdata = {}
					this.$api.getUserWithdrawAccounts(_sdata).then(res=>{
								if (res.errcode == 404) {
									uni.showModal({
									title: '添加提现方式',
									content: '您还没有添加任何提现方式，请先去添加！',
									showCancel: true,
									cancelText: '取消',
									cancelColor: '#999999',
									confirmText: '确定',
									confirmColor: that.theme_color,
									success: function(res) {
										if (res.cancel) {
										} else {//提现方式
										that.$common.diyLinkJump('/wsy_user/web/index.php?m=pocket_money&a=withdraw_management','h5',true,1)
										}
									},
								})
								reject()
							} else(
								resolve()
							)
					})
				}).then(function() {
					return new Promise((resolve, reject) => {
						var data = {}
						
						this.$api.getPocketMoneySetting(data).then(res=>{//-----------------url: '/wsy_pay/api/index.php?m=pocket_money&a=pocket_money_setting',
							console.log('getPocketMoneySetting',res)
							if (res.is_allow_withdrawal == 0) {
								uni.showToast({
									title: '对不起,暂不允许提现',
									icon: 'none',
									duration: 3000
								})
								return false
								// } else if (res.data.is_open_withdrawal_condition == 0){
								//   uni.showToast({
								//     title: '未开通零钱提现',
								//     icon: 'none',
								//     duration: 3000
								//   })
								//   return false
							} else {
								resolve()
							}
						})
					}).catch(function(e){
						console.log(e);
					});
				}).then(function() {//提现页面
					 that.$common.diyLinkJump('/wsy_user/web/index.php?m=pocket_money&a=withdraw_apply','h5',true,1)
				}).catch((e)=>{});
			},
			// 获取零钱列表
			get_list: function(listtype) {
				var that = this;
					that.page= 1;
				var post_data = {
					ajax_get: 1,
					page: 1,
					page_size: 20,
					type: listtype || 0,
					time_stage: that.tiemType,//时间段筛选2/24
					change_type:that.type,//筛选类型
				}
				// console.log(post_data);
				this.$api.getPocketMoneyDetailList(post_data).then(res=>{
					console.log('getPocketMoneyDetailList',res);
					if (res.total_page > 1) {
							that.can_load= true;
							that.load_type= 1;
					} else {
							that.can_load= false;
							that.load_type= 3;
					}
					for (var item in res.list) {
						 var ItemPrice = Number(res.list[item].money).toFixed(2);
						// var money=ItemPrice.toString();
						
						
						 res.list[item].priceA =that.$common.toPrice (ItemPrice, 1);
						 res.list[item].priceB =that.$common.toPrice (ItemPrice, 2);
						 if (res.list[item].change_type == 'change_recharge') {
							 res.list[item].change_type_name = '零钱充值';
						 }
						 // 11/17end
						 if (res.list[item].change_type == 'recharge') {
							 res.list[item].change_type_name = '后台充值';
						 }
						 if (res.list[item].change_type == 'consumption') {
							 res.list[item].change_type_name = '消费支付';
						 }
						 if (res.list[item].change_type == 'withdrawal') {
							 res.list[item].change_type_name = '用户提现 ';
						 }
						 if (res.list[item].change_type == 'change') {
							 res.list[item].change_type_name = '转换';
						 }
						 if (res.list[item].change_type == 'refund') {
							 res.list[item].change_type_name = '消费退款';
						 }
						 if (res.list[item].change_type == 'promotion_reward') {
							 res.list[item].change_type_name = '推广收益';
						 }
						 if (res.list[item].change_type == 'performance_reward') {
							 res.list[item].change_type_name = '绩效收益';
						 }
						 if (res.list[item].change_type == 'consumer_reward') {
							 res.list[item].change_type_name = '消费提成';
						 }
						 if (res.list[item].change_type == 'senior_promotion_reward') {
							 res.list[item].change_type_name = '高级销售员';
						 }
						 if (res.list[item].change_type == 'regional_reward') {
							 res.list[item].change_type_name = '区域代理';
						 }
						 if (res.list[item].change_type == 'store_reward') {
							 res.list[item].change_type_name = '店长';
						 }
						 if (res.list[item].change_type == 'money_reward') {
							 res.list[item].change_type_name = '零钱提成';
						 }
						 if (res.list[item].change_type == 'present') {
							 res.list[item].change_type_name = '赠送好友';
						 }
						 if (res.list[item].change_type == 'friend_give') {
							 res.list[item].change_type_name = '好友转赠';
						 }
					 }
						 that.list=res.list;
						 that.total_page= res.total_page;
				})
			},
			// 获取零钱余额
			get_points: function() {
				var that = this;
				var data = {password: 1};
				this.$api.getUserPocketMoney(data).then(res=>{
						console.log('getUserPocketMoney',res);
						that.money= res.data.pocket_money;
				})
			},
			/**
			 * tab点击
			 */
			nav_click: function(item) {
				var self = this;
				var index=item.index;
					self.nav_index= index;
					self.scroll_top= 0;
				if (index == 0) {
					self.get_list();
				} else {
					self.get_list(index);
				}
			},
			/**
			 * 判断是否设置支付密码
			 */
			get_is_paypassword: function() {
				var self = this;
				this.$api.getIsPaypassword({}).then(res=>{
					
					if (res.errcode == 0) {
							self.is_paypassword= res.data;
					}
				})
			},
			given:function(){
							var that = this;
				// uni.navigateTo({
				//     url: '/public/pages/myMoney/myMoneyShares/myMoneyShares',
				// })
				   that.$common.diyLinkJump('/wsy_user/web/index.php?m=pocket_money&a=pocket_money_transfer','h5',true,1)
			},
			  // 11/12
			// 跳转到常见问题
			problemClick: function () {
							var that = this;
				// uni.navigateTo({
				//     url: '/public/pages/commonProblem/commonProblem',
				// })
				   that.$common.diyLinkJump('/wsy_user/web/index.php?m=pocket_money&a=common_question','h5',true,1)
			},
			// 跳转到充值页面
			rechargeClick: function () {
							var that = this;
				// uni.navigateTo({
				//     url: '/public/pages/recharge/recharge',
				// })
				   that.$common.diyLinkJump('/wsy_pay/web/index.php?m=moneybag&a=moneybag_recharge','h5',true,1)
			}
	}
}