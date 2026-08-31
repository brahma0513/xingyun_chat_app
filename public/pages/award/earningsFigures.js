export default {
	data() {
	return {
	theme:getApp().globalData.style_color,
	http_host: '',
	active: 0,
	Type: 0,
	user_id:"",
	total_money: "", 
	navList: [{
			name: "收益数据"
		},
		{
			name: "身份特权"
		}
	],
	power: [{
		Type: '推广身份'
	}, {
		Type: '区域代理'
	}, {
		Type: '推广员'
	}],
	showPage:false,
	end_time:'',
	
	team_count:'' ,// 客户总人数
	userInfo:{},
	identity:[],
	all_profit:'',
	day_profit:'',
	week_profit:'',
	month_profit:'',
	wait_balance_profit:'',
	has_balance_profit:'',
	team_profit:'',
	today_team_profit:'',
	today_team_count:'',
	is_senior_promotion_open:'',
	is_store_open:'',
	is_regional_open:'',
	is_regional_upgrade:'',
	is_store_upgrade:'',
	open_data:'',
	}
	},
	  /**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			// app.get_visitor()
			let that = this;
			that.http_host=this.vuex_apiUrl;
			that.condition_apply_promoter();
		},
	methods: {
		// 授权后获取用户信息
			// SetUserInfoHandler: function(res) {
			//     var _this = this;
			//     if (res.detail.detail.errMsg == 'getUserInfo:ok') {
			//         _this.setData({
			//             userInfo: res.detail.detail.userInfo
			//         })
			//         _this.onLoad()
			//     }
			// },
			toggle: function(index) {
				var that = this;
					that.active= index;
					that.Type= index;
				if (index == 1) {
					if (that.identity.length == 0) {
						uni.navigateTo({
							url: '../promoter/promoter',
						})
					}
				}
			},
			 //跳转结算页
			 go_jiesuan:function(ind){
				 // that.$common.diyLinkJump('/wsy_user/web/index.php?m=pocket_money&a=withdraw_apply','h5',true,1)
				uni.navigateTo({
					url: 'totalEarnings?status=' + ind,
				})
			},
		get_msg:function(){
				const that = this;
						this.$api.getPersonalCenterInfo({}).then(res=>{//  url: '/wsy_user/api/index.php?m=user&a=personal_center_info',
								console.log(res)
								// 全局用户信息  this.vuex_user.user_id;
								that.user_id= res.data.uid;
								that.userInfo.avatarUrl= res.data.headimgurl;
								that.userInfo.nickName= res.data.weixin_name;
								// if (res.identity.length == 0) {//接口并没有这个返回,如果需要请重新修改
								//     wx.redirectTo({
								//         url: '../promoter/promoter',
								//     })
								// } else {
								that.user_identity();
								that.getMyForm();
								that.get_money();
								that.get_tg();
								that.get_height();
								// 获取奖励模式
								that.get_identy();
								// 获取过期时间
								that.get_time();
								// }
						})
						
				// util.requestData({
				//     isShowLoading: false,
				//     url: '/wsy_user/api/index.php?m=user&a=personal_center_info',
				//     data: {},
				//     method: 'POST',
				//     success: function (res) {
				//         console.log(res)
				//         // if (res.identity.length == 0) {//接口并没有这个返回,如果需要请重新修改
				//         //     wx.redirectTo({
				//         //         url: '../promoter/promoter',
				//         //     })
				//         // } else {
				//         that.user_identity()
				//         that.getMyForm()
				//         that.get_money()
				//         that.get_tg()
				//         that.get_height()
				//         // 获取奖励模式
				//         that.get_identy()
				//         // 获取过期时间
				//         that.get_time()
				//         // }
				//     }
				// })
			},
			condition_apply_promoter: function () {
				var _this = this;
				
				this.$api.getConditionApplyPromoter({}).then(data=>{//   url: '/wsy_user/api/index.php?m=user&a=condition_apply_promoter',
				console.log(data);
				var res = data.data;
				switch (data.errcode) {
					case 0: //可申请状态
						uni.redirectTo({
							url: '/public/pages/award/promoter/promoter',
						})
						break;
					case 401:case 411: //用户已经是推广员411是身份过期
						if (data.status) {
							// 测试说不要明显的跳转
							uni.hideLoading()
							_this.showPage=true;
							_this.get_msg();
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
							url: '/public/pages/award/promoter/promoter',
						})
						break;
					case 403: //尚未开放申请
						uni.redirectTo({
							url: '/public/pages/error/error?errmsg=抱歉，尚未开放申请&title=身份特权&notime=' + true,
						})
						break;
					case 404: //尚未开满足申请条件
						uni.redirectTo({
							url: '/public/pages/error/error?errmsg=抱歉，您尚未满足申请条件&title=身份特权&notime=' + true,
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
			//获取用户个人信息
			getMyForm: function() {
				const that = this;
				// var avatarUrl = 'userInfo.avatarUrl';
				// var nickName = 'userInfo.nickName';
				// that.setData({
				//     [avatarUrl]: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : "null",
				//     [nickName]: app.globalData.userInfo ? app.globalData.userInfo.nickName : "null",
				// })
				// that.userInfo.avatarUrl=getApp().globalData.userInfo ? getApp().globalData.userInfo.avatarUrl : "null";
				// that.userInfo.nickName=getApp().globalData.userInfo ? getApp().globalData.userInfo.nickName : "null";
			},
			// 获取过期时间
			get_time:function(){
				var _this = this;
				this.$api.getPromoterExpireTime({}).then(data=>{//   url: '/wsy_user/api/index.php?m=user&a=promoter_expire_time',
				console.log(data)
				if (data.errcode === 0) {
					var end_time = data.data.period_of_validity
					if (data.data.period_of_validity == '3000-01-01 00:00:00'){
						end_time='长期有效'
					}
					   _this.end_time= end_time;
				}
				})
			},
			toScope: function() {
				if (this.identity.length > 0) {
					uni.navigateTo({
						url: '../../scope/scope',
					})
				} else {
					uni.navigateTo({
						url: '../../authorization/authorization',
					})
				}
		
			},
			get_tg: function() {
				var _this = this;
				this.$api.platPromotion({}).then(data=>{//   url: '/wsy_rebate/api/index.php?m=promotion&a=plat_promotion',
				console.log(data)
				if (data.errcode === 0) {
						_this.tg_isopen= data.data.is_open;
						_this.tg_name= data.data.diy_name;
				}
				})
			},
			showtip:function(){
				var that = this;
				uni.showModal({
					title: '客户累计收益',
					content: '客户成员总累计收益,数据更新于前一天',
					showCancel:false,
					confirmColor:that.theme
				})
			},
			get_height: function() {
				var _this = this;
				this.$api.platSeniorPromotion({}).then(data=>{//   url: '/wsy_rebate/api/index.php?m=senior_promotion&a=plat_senior_promotion',
				console.log(data);
				if (data.errcode === 0) {
					_this.height_isopne= data.data.is_open;
					}
					})
			},
			//获取用户身份
			user_identity: function() {
				var _this = this;
				this.$api.promoterAllIdentity({}).then(data=>{//   url: '/wsy_user/api/index.php?m=user&a=promoter_all_identity',
				console.log('promoterAllIdentity',data);
				var identity = [];
				for (var key in data.data) {
					console.log(key); //键名
					console.log(data.data[key]); //键值
					identity.push(data.data[key]);
				}
				if (data.errcode === 0) {
						_this.identity= identity;
						_this.senior_promotion= identity[0];
				}
				})
			},
			//获取累计收益
			get_money: function() {
				var that = this;
				var today = new Date();
				var month = today.getMonth() + 1;
				this.$api.getUserPrivilegeProfit({}).then(res=>{//    url: '/wsy_user/api/index.php?m=user&a=user_privilege_profit',
				console.log(res)
				if (res.errcode === 0) {
						that.all_profit= res.data.all_profit;
						that.day_profit= res.data.day_profit;
						that.week_profit= res.data.week_profit;
						that.month_profit= res.data.month_profit;
						that.wait_balance_profit= res.data.wait_balance_profit;
						that.has_balance_profit= res.data.has_balance_profit;
						that.team_profit= res.data.team_profit;
						that.today_team_profit= res.data.today_team_profit;
						that.team_count= res.data.team_count;
						that.today_team_count= res.data.today_team_count;
					}
				})
			},
			get_identy: function() {
				var that = this;
		this.$api.getMyPrivilege({op: 'get'}).then(res=>{//    url: '/wsy_user/web/index.php?m=privilege&a=my_privilege',
		console.log('getMyPrivilege',res);
		if (res.errcode === 0) {
			// that.setData({
				that.is_senior_promotion_open= res.data.is_senior_promotion_open;
				that.is_regional_open= res.data.is_regional_open;
				that.is_store_open= res.data.is_store_open;
				that.is_regional_upgrade= res.data.is_regional_upgrade;
				that.is_store_upgrade= res.data.is_store_upgrade;
				that.open_data= res.data;
			// })
					
		}
		})
			},

	}
}