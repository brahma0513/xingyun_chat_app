export default {
	data() {
		return {
		theme: getApp().globalData.style_color,
		theme_color: this.$common.get_color(getApp().globalData.style_color),
		http_host: '',
		user_id: '',
		filtershow: false,
		inputVal:"",
		pagenum:1,
		total_num:"", // 团队总人数
		total_pay:0, // 总消费金额
		loading:true,
		tips_show:false,
		teamDetailList: [],
		bg_bool: true, // 是否全部
		year: "", // 年
		month: "",  // 月
		classlist:[
			{
				text: "全部",
				char: "all",
				ischeck: true
			},
			{
				text: "直推",
				char: "direct",
				ischeck: false
			},
			{
				text: "间推",
				char: "indirect",
				ischeck: false
			},
		],
		identity:[
		  {
			text:"全部",
			char:"all",
			ischeck:true,
			show: true,
		  },
		  {
			text:"销售员",
			char:"promotion",
			ischeck: false,
			show:true,
		  },
		  {
			text: "店长",
			char: "store",
			ischeck: false,
			show: true,
		  },
		  {
			text: "区域代理",
			char: "regional",
			ischeck: false,
			show: true,
		  }
		],
		trade:[
		  {
			text: "全部",
			char: "all",
			ischeck: true
		  }
		],
		depth:[
		  {
			text: "全部",
			char: "",
			ischeck: true
		  }
		],
		regional_list:[],
		store_list:[],
		promotion_list:[],
		amount_type: 0, // 实付显示实付
		inputShowed:false,
		total_payA:'',
		total_payB:'',

		}
	},
	
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		var that=this;
		that.http_host=this.vuex_apiUrl;
		that.user_id=that.vuex_user.user_id;
		var date = new Date();
		var year = date.getFullYear();
		var month = that.twoDate(date.getMonth() + 1);
		var day = that.get_lastday(year, month);

		var start = year + '-' + month + '-' + '01 00:00:00';
		var end = year + '-' + month + '-' + day + ' 00:00:00';

			// that.year;
			// that.month;
			that.start_time= start;
			that.end_time= end;
			that.end_times=end; // 最晚选择的年月


		// app.get_visitor();
		that.get_identity_info();
	},
	methods: {
		// 选择全部
			get_all: function () {
				var that = this;
					that.bg_bool= true;
					that.teamDetailList= [];
				that.get_data();
			},
		  // 选择日期
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
					that.teamDetailList=[];
				that.get_data();
			},
			twoDate: function (num) {
				if (num < 10) {
					num = '0' + num;
				}
				return num;
			},
			//获取月份最后一天
			get_lastday(year, month) {
				var dt = new Date(year, month, 1);
				var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
				return cdt.getDate();
			},
		  showInput: function () {
			 this.inputShowed= true;
		  },
		  hideInput: function () {
			  this.inputVal="";
			  this.inputShowed=false;
		  },
		  clearInput: function () {
			  this.inputVal="";
		  },
		  inputTyping: function (e) {
			  // this.inputVal=e.detail.value;
		  },
		  modalshow: function () {
			var that = this;
			  that.filtershow= true;
		  },
		  hideFilter: function () {
			var that = this;
			that.filtershow=false;
		  },
		  choose: function (arr,idx,type) {
			var that =this;
			console.log('choose',arr);
			console.log('type',type);
			// var idx = e.currentTarget.dataset.idx;
			// var arr = arr;
			for (var i in arr){
			  var itemSon = arr+'[' + i + '].ischeck';
				arr[i].ischeck=false;
			}
			var itemsSon = arr+'[' + idx + '].ischeck';
			  arr[idx].ischeck=true; 
			  if(type=="classlist"){
				that.classlist=arr;
			  }
			  if(type=="identity"){
				that.identity=arr;
			  }
			  if(type=="trade"){
				that.trade=arr;
			  }
			if (type =="identity"){
			  var ad_arr = [{
				text: "全部",
				char: "all",
				ischeck: true
			  },];
			  switch(idx){
				case 0:
				break;
				case 1:
				  ad_arr=ad_arr.concat(that.promotion_list);
				break;
				case 2:
				  ad_arr=ad_arr.concat(that.store_list);
				break;
				case 3:
				  ad_arr=ad_arr.concat(that.regional_list);
				break;
				default:
				break;
			  }
				that.trade=ad_arr;
			}
		
		  },
		  Reset: function () {
			var that = this;
			for (var i in that.identity) {
			  var item1 = 'identity[' + i + '].ischeck';
			  if(i==0){
				  that.identity[i].ischeck= true;
			  }else{
				   that.identity[i].ischeck=false;
			  }
			}
			var trade_arr = [{
				text: "全部",
				char: "all",
				ischeck: true
			}]
			that.trade=trade_arr;
			for (var i in that.depth) {
			  var item1 = 'depth[' + i + '].ischeck';
			  if (i == 0) {
				  that.depth[i].ischeck=true;
			  } else {
				  that.depth[i].ischeck=false;
			  }
			}
		   
		  },
		  sure: function () {
			var that = this;
			  that.filtershow= false;
			  that.pagenum=1;
			  that.teamDetailList=[];
			that.get_data();
		  },
		  search:function(){
			var that = this;
			  that.pagenum=1;
			  that.teamDetailList=[];
			  console.log(that.inputVal);
			that.get_data();
		  },
		  get_data:function(){
			var that=this;
			var type="";
			var identity="";
			var depth="";
			var classlist="";
			var search_key = that.inputVal;
			var pagenum = that.pagenum;
			for (var i in that.classlist) {
				if (that.classlist[i].ischeck) {
					classlist = that.classlist[i].char;
				}
			}
			for (var i in that.identity){
			  if (that.identity[i].ischeck){
				type = that.identity[i].char;
			  }
			}
			for (var i in that.trade) {
			  if (that.trade[i].ischeck) {
				identity = that.trade[i].char;
			  }
			}
			for (var i in that.depth) {
			  if (that.depth[i].ischeck) {
				depth = that.depth[i].char;
			  }
			}
			// unishowLoading({
			//   title: '玩命加载中',
			//   icon: "none"
			// })
			console.log(type, identity, depth, search_key, pagenum);
			
			that.$common.requestData({
				url: '/wsy_user/api/index.php?m=user&a=my_group',
				data: {
				  class: classlist, 
				  user_id: that.user_id,
				  type: type,
				  identity: identity,
				  depth: -1,
				  search_key: search_key,
				  pagenum: pagenum,
				  is_ajax:true,
				  is_all:that.bg_bool?1:0,
				  month:that.month,
				  year:that.year
				},
				method: 'POST',
				needToken: true
			}).then(res => {
				var data = res.data;
				console.log(data);
				var arr = that.teamDetailList;
				for (var i in data.list){
				  data.list[i].pro_name = data.list[i].pro_name.split(",");
				}
				arr = arr.concat(data.list);
				  that.teamDetailList=arr;
				  that.total_num=data.count;
				  that.total_pay= data.total_pay;
				  that.amount_type= data.amount_type;
				  that.total_payA=data.total_pay.slice(0,data.total_pay.length-3);
				  that.total_payB=data.total_pay.slice(data.total_pay.length-2);
				  that.total_payB="."+that.total_payB;
				if (data.is_empty){
					that.loading=false;
					that.tips_show=true;
				}else{
					that.loading=true;
				}
				uni.hideLoading();
			})
			
		  },
		  get_shai:function(){
			var that=this;
			
		that.$common.requestData({
			url: '/wsy_user/api/index.php?m=user&a=my_group_screen',
			data: {},
			method: 'POST',
			needToken: true
		}).then(data => {
			console.log(data);
			var regional_list = [];
			var store_list = [];
			var promotion_list = [];
			var depth = that.depth;
			for (var i in data.regional) {
			  var obj = new Object();
			  obj.text = data.regional[i];
			  obj.char = i;
			  obj.ischeck = false;
			  regional_list.push(obj);
			}
			
			for (var i in data.senior_promotion) {
			  var obj = new Object();
			  obj.text = data.senior_promotion[i];
			  obj.char = i;
			  obj.ischeck = false;
			  promotion_list.push(obj);
			}
			for (var i in data.store) {
			  var obj = new Object();
			  obj.text = data.store[i];
			  obj.char = i;
			  obj.ischeck = false;
			  store_list.push(obj);
			}
			for (var i = 0; i < data.max_depth; i++) {
						
			  var obj = new Object();
			  obj.text = "深度" + (i + 1);
			  obj.char = i + 1;
			  obj.ischeck = false;
			  depth.push(obj);
			}
			var identity = that.identity;
			if (regional_list.length == 0){
			  identity[3].show = false;
			}
			if (store_list.length == 0){
			  identity[2].show = false;
			}
			if (promotion_list.length == 0){
			  identity[1].show = false;
			}
			  that.regional_list=regional_list;
			  that.store_list=store_list;
			  that.promotion_list=promotion_list;
			  that.depth=depth;
			  that.identity=identity;
		})
		  },
		  get_zdyzd:function(){
			var that=this;
			that.$common.requestData({
				url: '/wsy_user/web/index.php?m=user&a=my_profit_type',
				data: {},
				method: 'POST',
				needToken: true
			}).then(data => {
				console.log(data);
				var promotion = 'identity['+1+'].text';
				var store = 'identity['+2+'].text';
				var regional = 'identity['+3+'].text';
				  that.identity[1].text=data.reward_name.promotion;
				  that.identity[2].text=data.reward_name.store;
				  that.identity[3].text=data.reward_name.regional;
				console.log(that.identity);
			})
			
		  },
		  jump:function(idx){
			var that=this;
			var id = that.teamDetailList[idx].id;
			uni.navigateTo({
			  url: '../teamDetail/teamDetail?id=' + id,
			})
		  },
	   // 获取身份信息
		get_identity_info(){
		  const that = this;
		  that.$common.requestData({
			url: '/wsy_user/api/index.php?m=user&a=user_identity',
			data: {
			  user_id: that.user_id,
			},
			method: 'POST', 
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
				uniredirectTo({
				  url: '/public/pages/award/earningsFigures/earningsFigures',
				})
			  }else{
				that.get_data();
				that.get_shai();
				that.get_zdyzd();
			  }
			}
		  })
		},
		// 金额摘取
		twoNum: function (list) {
			var that = this;
			// list.forEach(function (item) {
			//     that.setData({
			//         [item + 'A']: util.toPrice(that.data[item], true),
			//         [item + 'B']: util.toPrice(that.data[item], false)
			//     })
			// })
		},
		/**
		* 页面上拉触底事件的处理函数
		*/
		onReachBottom: function () {
			var that = this;
			if(that.loading){
			var pagenum=that.pagenum;
			pagenum++;
				that.pagenum=pagenum;
			console.log(pagenum);
			that.get_data();
  
		}

		},
	}
}