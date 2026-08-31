export default {
	data() {
		return {
			money: "10.00",
			Type: "佣金金额",
			moneyA:'',
			moneyB:'',
			style:'',
			batchcode:'',
			create_time:'',
			own_user_name:'',
			remark:'',
			status:'',
			detailList: [{
			  title: "类型",
			  result: "商城消费"
			}, {
			  title: "状态",
			  result: "已结算"
			}, {
			  title: "时间",
			  result: "2018-04-04 10:10:00"
			}, {
			  title: "交易单号",
			  result: "1214535132134354313213"
			}, {
			  title: "买家",
			  result: "小邓"
			}]
		  }
	},
	/**
	   * 生命周期函数--监听页面加载
	   */
	onLoad: function (options) {
		var that = this;
		console.log(options);
		that.get_detail(options.id);
	},
	methods: {
		get_detail: function (detail_id) {
			const that = this;
			var _data = {};
			
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=my_profit',
				data: {
				  action: "detail",
				  detail_id: detail_id
				},
				method: 'POST',
			}).then(res => {
				console.log(res);
				var moneyA = that.$common.toPrice(res.detail.reward, true);
				var moneyB =that.$common.toPrice(res.detail.reward, false);
				var style;
				// 12/11
				var type='佣金金额';
				switch (res.detail.type){
				  case 'promotion':
					style = '销售员';
					break;
				  case 'senior_promotion':
					style = '高级销售员';
					break;
				  case 'store':
					style = '店长';
					break;
				  case 'consumer':
					style = '消费提成';
					break;
				  case 'regional':
					style = '区域代理';
					break;
				  case 'performance':
					style = '储备金';
					break;
					// 12/11
					case 'currency_reward':
					style = '消费赠送';
					type='赠送购物币';
					break;
				  return
				}
				if (res.errcode == 0) {
					
					that.moneyA=moneyA;
					that.moneyB=moneyB;
					that.Typ=type;//12/11
					that.style=style;
					that.batchcode=res.detail.batchcode;
					that.create_time=res.detail.create_time;
					that.own_user_name=res.detail.own_user_name;
					that.remark=res.detail.remark;
					that.status=res.detail.status;
				  
				}
			})
			
		  },
	}
}