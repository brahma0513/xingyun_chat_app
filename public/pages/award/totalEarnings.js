export default {
	data() {
		return {
				theme: getApp().globalData.style_color,
				http_host: '',
					active: 0,
					max: 100,    // y轴最大值
					year: "",
					month: "",
					Type: "全部",
					isShow: true,
					showModel: false,
					close_Picker: false,
					filtershow: false,
					xdata: [],
					ydata: [],
					navList: [{
							name: "明细"
						},
						{
							name: "报表"
						}
					],
					filterList: [{
						name: "全部",
						isCheck: true,
						type:'all',
					}],
					status:'', // 区分结算或待结算
					bg_bool: true, // 
					batchcode_count: '',
					can_load:true, // 防止重复调取接口
					pagenum: 1, // 页数
					load_type:1, // 加载状态
					list_type: 'all', // 筛选
					// 12/10类型筛选
					filterListA: [
						{
							name: '全部',
							isCheck: true,
							type: 'all'
						},
						{
							name: '佣金',
							isCheck: false,
							type: 'pocket_money'
						},
						{
							name: '购物币',
							isCheck: false,
							type: 'currency'
						}
					],
					class_type: 'all',
					detailList:[],
					settled_rewardA:'',
					settled_rewardB:'',
					unsettled_rewardA:'',
					unsettled_rewardB:''
		}
	},
	 /**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			var that = this;
			that.http_host=this.vuex_apiUrl;
			var date = new Date();
			var year = date.getFullYear();
			var month = that.twoDate(date.getMonth() + 1);
			var day = that.get_lastday(year, month);

			var start = year + '-' + month + '-' + '01 00:00:00';
			var end   = year + '-' + month + '-' + day + ' 00:00:00';

			var xdata = [];
			var ydata = [];
			for (var i = month; i > month - 6; i--) {
				if (i > 0) {
					var item = i + '月';
					xdata.push(item);

				} else {
					var item = i + 12 + '月';
					xdata.push(item);
				}
				ydata.push(0);
			}

				// that.year;
				// that.month;
				that.start_time= start;
				that.end_time= end;
				that.xdatanull= xdata;
				that.ydatanull= ydata;
				that.status= options.status?options.status:'';

			// app.get_visitor()
			that.get_identity_info();
			
		},
	methods: {
		   get_type:function(){
				const that = this;
				var _data = {};
				
				that.$common.requestData({
				url: '/wsy_user/web/index.php?m=user&a=my_profit_type',
				data: {
				},
				method: 'POST',
					needToken: true
				}).then(res => {
					if(res.errcode == 0){
						var list = that.filterList;
						res.type.forEach((item, index)=>{
							var obj = {
								name: '',
								type:item,
								isCheck: false
							};
							switch (item) {
								case 'store':
									obj.name = "店长";
									break;
								case 'promotion':
									obj.name = "销售员";
									break;
								case 'senior_promotion':
									obj.name = "高级销售员";
									break;
								case 'regional':
									obj.name = "区域代理";
									break;
								case 'performance':
									obj.name = "储备金";
									break;
								case 'consumer':
									obj.name = "消费提成";
									break;
							}
							list.push(obj);
						})
							that.filterList=list;
					}
				})
			},
			toggle: function(index) {
				var that = this;
				that.active= index;
				console.log(index);
				if (index == 1) {
					that.isShow= true;
					that.chars();
				} else {
					that.isShow= false;
				}
		
			},
			closeModel: function() {
				var that = this;
					that.showModel= false;
			},
			showFilter: function() {
				var that = this;
					that.filtershow= true;
			},
			hideFilter: function() {
				var that = this;
					that.filtershow= false;
			},
			choseLi: function(index) {
				var that = this;
				for (var i in that.filterList) {
					that.filterList[i].isCheck=false;
				}
					that.filterList[index].isCheck= true;
			},
		   // 12/10选择类型
		   choseFilter: function (index) {
			var that = this;
			that.filterListA.forEach((item) => {
				item.isCheck = false;
					 that.filterListA=that.filterListA;
			})
			that.filterListA[index].isCheck = true;
			that.filterListA= that.filterListA;
		},
		// 重置按钮，将俩个按钮都改成全部
		cancelFilter: function () {
			var that = this;
			// 类型
			that.filterListA.forEach((item) => {
				item.isCheck = false;
			 that.filterListA=that.filterListA;
			})
			that.filterListA[0].isCheck = true;
			 that.filterListA=that.filterListA;
			// 身份
			that.filterList.forEach((item) => {
				item.isCheck = false;
				that.filterList=that.filterList;
			})
			that.filterList[0].isCheck = true;
			that.filterList=that.filterList;
		},
		
		sureFilter: function () {
			var that = this;
			for (var i in that.filterList) {
				if (that.filterList[i].isCheck) {
						that.pagenum=1;
						that.can_load=true;
						that.Type=that.filterList[i].name;
						that.list_type=that.filterList[i].type;
		
				}
			}
			that.filterListA.forEach((item) => {
				if (item.isCheck) {
						that.pagenum=1;
						that.can_load=true;
						that.class_type=item.type;
				}
			})
			that.hideFilter();
			that.load();
		},
		// 12/10end
		listenerPickerSelected: function(e) {
			 var that = this;
			// console.log(e.detail.value);
			var date = e.detail.value.split('-');
			var year = date[0];
			var month = date[1];
			var day = that.get_lastday(year, month);

			var start = date + '-' + '01 00:00:00';
			var end = date + '-' + day + ' 00:00:00';

				that.year=year;
				that.month=month;
				that.start_time=start;
				that.end_time=end;
				that.bg_bool=false;
				that.pagenum=1;
				that.can_load=true;
			that.load();
		},
		twoDate: function(num) {
			if (num < 10) {
				num = '0' + num;
			}
			return num;
		},
		chars: function() {
			var that = this;
			var windowWidth;
			wx.getSystemInfo({
				success(res) {
					windowWidth = res.windowWidth;
				}
			});
			console.log(that.xdata);

		// if (that.xdata.length > 0) {
			//     new wxCharts({
			//         canvasId: 'lineCanvas',
			//         type: 'column',
			//         animation: true,
			//         categories: that.xdata.reverse(), //X轴数据
			//         series: [{
			//             data: that.ydata, //y轴数据
			//             color:util.get_color(that.theme),
			//             format: function(val) {
			//                 return val;
			//             }
			//         }],
			//         yAxis: {
			//             format: function(val) {
			//                 return val;
			//             },
			//             min: 0,
			//             max: that.max
			//         },
			//         xAxis: {
			//             disableGrid: false,
			//             type: 'calibration',
			//         },
			//         extra: {
			//             column: {
			//                 width: 30
			//             }
			//         },
			//         width: windowWidth,
			//         height: 290,
			//         legend: false,
			//     });
			// }
		},
		get_all: function () {
			var that = this;
				that.bg_bool=true;
				that.pagenum=1;
				that.list_type='all';
				that.can_load=true;
			that.load();
		},
		// 获取身份信息
		get_identity_info(){
			const that = this;

			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=user_identity',
				data: {
				  user_id: that.vuex_user.user_id,
				},
				method: "POST", 
				needToken: true
			}).then(res => {
				console.log(res);
				if(res.errcode == 0){
				  var num = 0;
				  res.data.forEach((item)=>{
					if(item == 1){
					  num ++;
					}
				  })
				  if(num>0){
					wx.redirectTo({
					  url: '/public/pages/award/earningsFigures/earningsFigures',
					})
				  }else{
					  that.load();
					  that.get_type();
					   // 12/14
					   that.get_set_currency();
				  }
				}
			})

		},
	
		scroll_page(){
			var that = this;
			that.get_list();
			console.log("已到底部！！！");
		},
	
		// 累计收益数据
		load: function() {
			const that = this;
			if(that.can_load){
					that.can_load=false;
					that.load_type= 2;
					
					that.$common.requestData({
						url: '/wsy_user/web/index.php?m=user&a=ajax_my_profit_list',
						data: {
							is_ajax: true,
							pagenum: 1,
							// 12/10
							type: that.list_type ? that.list_type : '',
							reward_type:  that.class_type ?  that.class_type : '',
							// 12/10end
							year: that.year,
							month: that.month,
							only_list: 0,
							status: that.status ? that.status : '',
							is_all: that.bg_bool ? 1 : 0
						},
						method: 'GET',
						needToken: true
					}).then(res => {
						console.log(res);
						var ydata = [];
						var xdata = [];
						for (var i = that.month; i > that.month - 6; i--) {
							if (i > 0) {
								var item = i + '月';
								xdata.push(item);
													
							} else {
								var item = i + 12 + '月';
								xdata.push(item);
							}
							// ydata.push(0)
						}
						ydata = res.ydata;
						res.list.forEach(function(item) {
							item.rewardA =  that.$common.toPrice(item.reward, true);
							item.rewardB =  that.$common.toPrice(item.reward, false);
						})
						if (xdata.length == 0) {
							xdata = that.xdatanull;
							ydata = that.ydatanull;
						}
						if(res.is_empty){
							that.load_type= 3;
						}else{
						
							that.load_type=1;
						}
						// 12/11
						if (res.list) {
							res.list.forEach((item) => {
								if (item.id.indexOf('currency') != -1) {
									item['is_currency'] = true;
								}
							})
						}
							that.detailList=res.list;
							that.batchcode_count=res.num.batchcode_count;
							that.settled_reward=res.num.settled_reward;
							that.settled_rewardA= that.$common.toPrice(res.num.settled_reward, true);
							that.settled_rewardB= that.$common.toPrice(res.num.settled_reward, false);
							that.unsettled_reward=res.num.unsettled_reward;
							that.unsettled_rewardA= that.$common.toPrice(res.num.unsettled_reward, true);
							that.unsettled_rewardB= that.$common.toPrice(res.num.unsettled_reward, false);
							that.ydata=ydata;
							that.xdata=xdata;
							that.max=100;    // 当列表数据都为0时，给max设置100，让列表的起始值为0
							that.can_load=true;
					})
					
			}
		},
	
		get_list: function() {
			const that = this;
			if(that.can_load){
				var pagenum = that.pagenum;
				pagenum ++;
					that.can_load=false;
					that.load_type=2;
					that.pagenum=pagenum;
					
					that.$common.requestData({
						url: '/wsy_user/web/index.php?m=user&a=ajax_my_profit_list',
						data: {
							is_ajax: true,
							pagenum: that.pagenum,
						   // 12/10
						   type: that.list_type ? that.list_type : '',
						   reward_type:  that.class_type ?  that.class_type : '',
						   // 12/10end
							year: that.year,
							month: that.month,
							only_list: 1,
							status: that.status ? that.status : '',
							is_all: that.bg_bool ? 1 : 0
						},
						method: 'GET',
						needToken: true
					}).then(res => {
						console.log(res);
						if(res.list.length==0){
								that.load_type=3;
							return
						}else{
								that.load_type=1;
						}
						res.list.forEach(function(item) {
							item.rewardA =  that.$common.toPrice(item.reward, true);
							item.rewardB = that.$common.toPrice(item.reward, false);
							// 12/11
							if (item.id.indexOf('currency') != -1) {
								item['is_currency'] = true;
							}
						})
							that.detailList= that.detailList.concat(res.list);
							that.can_load=true;
					})
					
			}
		},
		twoNum: function(list) {
			var that = this;
			// list.forEach(function(item) {//------------------------------------------
			//     that.setData({
			//         [item + 'A']: util.toPrice(that.data[item], true),
			//         [item + 'B']: util.toPrice(that.data[item], false)
			//     })
			// })
		},
		//获取月份最后一天
		get_lastday(year, month) {
			var dt = new Date(year, month, 1);
			var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
			return cdt.getDate();
		},
		 // 获取购物币自定义名称12/14
		 get_set_currency() {
			var that = this;
			var data_ = {};
			
			
			that.$common.requestData({
				url: '/wsy_pay/api/index.php?m=currency&a=select_currency_set',
				data: {},
				method: 'POST', 
				needToken: true
			}).then(res => {
				console.log(res);
				if (res.errcode == 0) {
					that.filterListA[2].name = res.result.diy_name;
						that.filterListA= that.filterListA;
				}
			})
		},
	}
}