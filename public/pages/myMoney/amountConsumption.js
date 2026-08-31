export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			http_host: '',
			year: "", // 年
			month: "", // 月
			pagenum:1, // 当前页数
			pagecount:"", // 总页数
			bg_bool: true, // 是否全部或选择日期
			detailList: [], // 列表数据
			end_times:'',
			settled_rewardA:'',
			settled_rewardB:'',
			batchcode_count:''
					
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that=this;
		that.http_host=this.vuex_apiUrl;
		var date = new Date();
		var year = date.getFullYear();
		var month = that.twoDate(date.getMonth() + 1);
		var day = that.get_lastday(year, month);

		var start = year + '-' + month + '-' + '01 00:00:00';
		var end = year + '-' + month + '-' + day + ' 00:00:00';


			// that.year,
			// that.month,
			that.start_time= start;
			that.end_time= end;
			that.end_times= end;// 最晚选择的年月
			this.get_list();
	},
	methods: {
	
		listenerPickerSelected: function (e) {
			var that = this;
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
				that.detailList= [];
				that.get_list();
		},
		twoDate: function (num) {
			if (num < 10) {
				num = '0' + num;
			}
			return num;
		},
		get_all: function () {
			var that = this;
				that.bg_bool=true;
				that.detailList=[];
			that.get_list();
		},
		get_list: function () {
			const that = this;
			var _data = {};
			
			that.$common.requestData({
				url: '/wsy_pay/web/index.php?m=order&a=user_pay_list',
				data: {
					is_ajax:1,
					year:that.year,
					month: that.month,
					pagenum: that.pagenum,
					is_all: that.bg_bool ? 1 : 0
				},
				method: 'GET',
				needToken: true
			}).then(res => {
			var arr = that.detailList;
			res.data.forEach(function (item) {
				// item.acc_amountA = util.toPrice(item.acc_amount, true)
				// item.acc_amountB = util.toPrice(item.acc_amount, false)
				item.acc_amountA =that.$common.toPrice (item.acc_amount, 1);
				item.acc_amountB =that.$common.toPrice (item.acc_amount, 0);
			})
				arr = arr.concat(res.data);
				that.detailList=arr;
				that.batchcode_count=res.count;
				that.settled_reward=res.all_sales_num;
				that.pagecount=res.pagecount;
				
				that.settled_rewardA=that.$common.toPrice (that.settled_reward, 1);
				that.settled_rewardB=that.$common.toPrice (that.settled_reward, 0);
			// that.twoNum(['settled_reward']);
			})
			
		},
		twoNum: function (list) {
			var that = this;
			// list.forEach(function (item) {
			//     that.setData({
			//         [item + 'A']: util.toPrice(that.[item], true),
			//         [item + 'B']: util.toPrice(that.[item], false)
			//     })
			// })
		},
		//获取月份最后一天
		get_lastday(year, month) {
			var dt = new Date(year, month, 1);
			var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
			return cdt.getDate()
		},
	}
}