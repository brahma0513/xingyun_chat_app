export default {
	data() {
		return {
			theme:getApp().globalData.style_color,
			theme_color: this.$common.get_color(getApp().globalData.style_color),
			http_host: '',
			user_id: "",
			active: 0,
			isShow: true,
			name: "",
			headimgurl:"",
			per_infor:{
			  name:"",
			  sex:"",
			  weixin_num:"",
			  qq_num:"",
			  birth:"",
			  job:""
			},
			power: [],
			referee_name:"",
			end_time:"",
			join_time:"",
			phone_number:"",
			consumeMonkey: '',
			team_count: "50",
			orderNumber: "",
			totalCommission: "666666666",
			mon_price:"",
			mon_order:"",
			mon_num:"",
			mon_price_yes:"",
			mon_price_no:"",
			navList: [{
			  name: "数据报表"
			},
			{
			  name: "用户信息"
			}
			],
		}
	},
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		var that=this;
		that.http_host=this.vuex_apiUrl;
		that.user_id= options.id;
		that.get_infor();
		that.get_teamnum();
		that.get_commission();
		that.get_order();
		that.get_identity();
	},
	methods: {
		toggle: function (index) {
			var that = this;
			  that.active=index;
			  that.isShow=!that.isShow;
		  },
		  call:function(){
			var that=this;
			wx.makePhoneCall({
			  phoneNumber: that.phone_number,
			  success: function () {
				console.log("拨打电话成功！")
			  },
			  fail: function () {
				console.log("拨打电话失败！")
			  }
			})
		  },
		  get_infor:function(){   //获取用户信息
			var that=this;
			console.log(that.user_id)
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=info',
				data: {
				  uid:that.user_id
				},
				method: 'POST',
			}).then(data => {
				console.log(data)
				var per_infor={
				  name: data.data.name,
				  sex:data.data.sex,
				  qq_num:data.data.qq,
				  birth: data.data.birthday,
				  job: data.data.occupation,
				  weixin_num:data.data.wechat_id,
				};
				  that.name=data.data.weixin_name;
				  that.headimgurl=data.data.headimgurl;
				  that.consumeMonkey=parseFloat(data.data.finish_order_money).toFixed(2);
				  that.orderNumber=data.data.finish_order_num;
				  that.phone_number=data.data.country_code+data.data.phone;
				  that.per_infor=per_infor; 
				that.get_referee(data.data.parent_id);
			})
			
		  },
		  get_referee:function(id){  //获取特权信息
			var that=this;
			 //获取推荐人昵称
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=get_name_headimg',
				data: {
				  user_id:id,
				  get_headimg:0,
				},
				method: 'POST', 
			}).then(data => {
				console.log(data)
				  that.referee_name=data.data[0].weixin_name;
			})
			   //获取到期时间
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=promoter_expire_time',
				data: {
				  user_id: that.user_id,
				},
				method: 'POST', 
			}).then(data => {
				console.log(data)
					that.end_time=data.data.period_of_validity == '3000-01-01 00:00:00' ? '长期有效' : data.data.period_of_validity;
			})
			  //获取加入时间
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=join_team_time',
				data: {
				  user_id: that.user_id,
				  parent_id: that.vuex_user.user_id,
				},
				method: 'POST', 
			}).then(data => {
				 that.join_time=data.data;
			})
			
		  },
		  get_teamnum:function(){  //获取团队人数
			var that=this;
			
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=ajax_user_depth_num',
				data: {
				  user_id: that.user_id,
				},
				method: 'POST', 
			}).then(data => {
				 console.log(data);
				   that.team_count=data.data.team_count;
			})
			
		  },
		  get_commission:function(){   //获取佣金
			var that=this;
			 //获取佣金
			that.$common.requestData({
				url: '/wsy_rebate/api/index.php?m=reward&a=sum_user_reward',
				data: {
				  user_id: that.user_id,
				  pay_type:'0,1,3,6',
				},
				method: 'POST',
			}).then(data => {
				   that.totalCommission=parseFloat(data.data).toFixed(2);
			})
			
		  },
		  get_order:function(){    //获取当月数据
			var that=this;
			   //消费金额、订单数量
			that.$common.requestData({
				url: '/wsy_pay/api/index.php?m=system_order&a=user_order_money_number',
				data: {
				  user_id: that.user_id,
				},
				method: 'POST',
			}).then(data => {
				   console.log(data)
					that.mon_price=parseFloat(data.data.total_pay).toFixed(2);
					 that.mon_order=data.data.order_num;
			})
			  //团队新增人数
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=new_team_people',
				data: {
				  user_id: that.user_id,
				},
				method: 'POST',
			}).then(data => {
				   console.log(data)
					that.mon_num=data.data;
			})
			   //已结算未结算佣金
			that.$common.requestData({
				url: '/wsy_rebate/api/index.php?m=reward&a=user_settled_unsettled_reward',
				data: {
				  user_id: that.user_id,
				},
				method: 'POST',
			}).then(data => {
				 if (data.errcode==0){
					 that.mon_price_yes=parseFloat(data.data.settled_reward).toFixed(2);
					 that.mon_price_no=parseFloat(data.data.unsettled_reward).toFixed(2);
				 }
			})
			
			
		  },
		  
		get_identity:function(){  //请求用户身份
			var that=this;

			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=promoter_all_identity',
				data: {
				  user_id: that.user_id,
				},
				method: 'POST',
			}).then(data => {
				 console.log(data)
				 var power=[];
				 for(var i in data.data){
				   power.push(data.data[i])
				 }
				   that.power=power;
			})
		},
	}
}