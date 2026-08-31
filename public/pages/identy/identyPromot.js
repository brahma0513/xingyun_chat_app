export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			theme_color: this.$common.get_color(getApp().globalData.style_color),
			http_host: '',
			form_type: '',
			pop_state: false,//是否显示弹窗
			status: false,//当前等级
			toux: './images/icon_tx_manger1.png',//头像
			rules: '',//升级说明弹窗内容
			is_upgrade: '', //身份申请开关
			status_list: [],
			identity_name:'',
			userInfo:{},
			list:[],
			level:0,
		}
	},
	 /**
	   * 生命周期函数--监听页面加载
	   */
	onLoad: function (options) {
		// app.get_visitor();
		var that = this;
		that.http_host=this.vuex_apiUrl;
		that.get_data();
		that.getMyForm();
	},
	methods: {
		// 授权后获取用户信息
		SetUserInfoHandler: function (res) {
			var that = this;
			if (res.detail.detail.errMsg == 'getUserInfo:ok') {
					that.userInfo=res.detail.detail.userInfo;
				that.get_area();
			}
		},
		//获取用户个人信息
		getMyForm: function () {
			const that = this;
			var avatarUrl = 'userInfo.avatarUrl';
			  var userInfo = that.vuex_user;
			  // console.log(userInfo); 
			  that.userInfo=userInfo;
			that.userInfo.avatarUrl=userInfo? userInfo.headimgurl : 'null';
	
		},
		open_pop: function () {
			var that = this;
			that.pop_state=true;
		},
		//关闭弹窗
		close_pop: function () {
			var that = this;
			that.pop_state=false;
		},

		// 升级
		toHeighter: function (index,is_upgrade) {
			var that = this;
			var level = parseInt(index)  + 1 + parseInt(that.level);
			// console.log(index);
			if (that.is_upgrade == 1&&is_upgrade==1){
				that.applyHeighter(level);
			}else{
				return false;
			}
		},
	  
		applyHeighter: function (level) {

			var that = this;
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=promotion_upgrade',
				data: {
				  level: level
				},
				method: 'POST', 
				needToken: true
			}).then(res => {
				if(res.errcode == 0){
					uni.showToast({
					  title: '升级成功',
					})
				  }
				  console.log(res);
			
			})
		
		},
	  
		get_data: function () {
			var that = this;
			
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=promotion_privilege_data_select',
				data: {
				  type:'1'
				},
				method: 'POST',
				needToken: true
			}).then(res => {
				console.log(res);
				  if (res.errcode === 0) {
					res.data.level_data.forEach(function (item) {
						  // 个人消费比例计算
						  if (item.consume_open == 1){
							  if (item.consume_need == 0){
								  item.percent = 100;
							  }else{
								  item.consume_need = parseFloat(item.consume_need).toFixed(2);
								  item.percent = item.consume_num * 100 / parseFloat(item.consume_need) * 100 / 100    ;
							  }
						  }
						  // 团队销售额比例计算
						  if (item.team_sales_open == 1){
							if (item.team_sales_need == 0){
								item.sales_percent = 100;
							}else{
								item.team_sales_need = parseFloat(item.team_sales_need).toFixed(2);
								item.sales_percent = item.team_sales_num * 100 / parseFloat(item.team_sales_need) * 100 / 100;
							}
						}
						  // 推广量计算
						  if (item.promote_open == 1){
							  if (item.promote_need == 0){
								  item.promot_percent = 100;
							  }else{
								  item.promote_need = parseInt(item.promote_need);
								  item.promot_percent = item.promote_num * 100 / parseFloat(item.promote_need) * 100 / 100;
							  }
							
						  }
					  if (item.percent >= 100 && item.promot_percent >= 100 && item.sales_percent >= 100) {
						item.apply = true;
					  } else {
						item.apply = false;
					  }
					})
					  that.identity_name=res.data.identity_name;
					  that.is_promotion_open=res.data.is_promotion_open;
					  that.is_senior_promotion_open=res.data.is_senior_promotion_open;
					  that.is_upgrade=res.data.is_open;
					  that.level=res.data.level;
					  that.list=res.data.level_data;
					  that.rule=res.data.rule;
					if (res.data.level+1 == res.data.level_data.length || res.data.is_senior_promotion_open == 0){
						that.status=true;
					}
					console.log(res.data.level_data);
				  }
			})
		
		},
	
		get_list: function (count) {
			var that = this;

			that.$common.requestData({
				url: '/wsy_rebate/api/index.php?m=senior_promotion&a=plat_senior_promotion',
				data: {
				},
				method: 'POST',
				needToken: true
			}).then(res => {
				console.log(res);
				if (res.errcode === 0) {
				  var list = JSON.parse(res.data.identity);
					  that.is_open=res.data.is_open;
					  that.identity=list;
					  that.auto_upgrade=res.data.auto_upgrade;
					  that.is_promotion_open=res.data.is_promotion_open;
					  that.rule=res.data.rule;
					  that.level=res.data.level;
				  console.log(that.data.identity);

				}
			})
		},
	}
}