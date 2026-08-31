 //表示结果为0-20间的随机数
export default {
	data() {
		return  {
			theme: getApp().globalData.style_color,
			http_host: '',
			monetary_unit: getApp().globalData.monetary_unit,
			price_color:getApp().globalData.price_color,
			test: { a: 123 },
			test1: 'test1',
			loading: false,
			collect_num:0,
			load_type: 3,
			nav_index: 0,
			loading:true,
			nav_list: [
				{
					name:"商品",
					char:"goods"
				},
				{
					name: "店铺",
					char: "shop"
				},
				{
					name: "大礼包",
					char: "giftbag"
				},
				{
					name: "帖子",
					char: "post"
				}
			],
			is_edit: false,   //编辑状态
			collect_type: "goods",  //收藏类型  1 商品  2店铺
			page:1,
			//all_check: false,     // 是否全选
			collect_list: [    //列表
			],
			bottom_open: false,
			template_data: { has_bottom: true }//底部导航数据
		}
	},
	onLoad: function (options) {
		// app.get_visitor()
		var that = this
		that.http_host=this.vuex_apiUrl;
		// if(app.globalData.userInfo){
		//     that.get_nav_List();
		//     // that.get_data()
		// }
		that.get_nav_List();
	},
	methods: {
		 SetUserInfoHandler: function (res) {
			var _this = this;
			if (res.detail.detail.errMsg == 'getUserInfo:ok') {
				that.get_nav_List();
				// _this.get_data()
			}
		},
			// 判断是否有底部导航
		showBottom: function (e) {
			this.bottom_open=e.detail;
			},
			jump_link:function(url){
				console.log("jump!!!!");
				console.log(url);
				this.$common.diyLinkJump(url,'h5',true,1);
			},
		  //获取商品列表
		  get_data:function(){
			var that=this;
			var c_type = that.collect_type;
			var page = that.page;
			console.log(c_type,page);
			uni.showLoading({
			  title: '玩命加载中',
			  icon: "none"
			})
			var data={
			  c_type:c_type,
			  page:page,
			  // app_id: c_type=='giftbag'?'10006':'10003'
			  app_id: "-1",
			};
			 //获取我的收藏
			this.$api.ajaxMyCollection(data).then(res=>{
				{
				  if(res.errcode==0){
					console.log(res);
					var arr = that.collect_list;
					for(var index in res.list){
						if (typeof (res.list[index].label)=="string"){
						  res.list[index].label = JSON.parse(res.list[index].label,true);
							// console.log(res.list[index].label.length);
						}
						res.list[index].priceA=that.$common.toPrice (res.list[index].price, 1);
						res.list[index].priceB=that.$common.toPrice (res.list[index].price, 0);
					}
					arr = arr.concat(res.list);
					that.collect_list=arr;
					// that.twoNum();
					that.allCheck();
					if (that.page >= res.total_page){
						 that.loading= false;
					}
					
				  }
				  uni.hideLoading();
				}
			});
			//  util.requestData({   //加载收藏列表
			//       url: '/wsy_pub/api/index.php?m=mini_program_api&a=ajax_my_collection',
			//       data: {
			//         c_type:c_type,
			//         page:page,
			//         // app_id: c_type=='giftbag'?'10006':'10003'
			//         app_id: "-1"
			//       },
			//       method: 'POST',
			//       success: function (res) {
			// if(res.errcode==0){
			//   console.log(res);
			//   var arr = that.collect_list;
			// 		for(var index in res.list){
			// 			if (typeof (res.list[index].label)=="string"){
			// 			res.list[index].label = JSON.parse(res.list[index].label);
			// 			res.list[index].priceA=that.$common.toPrice (res.list[index].price, 1);
			// 			res.list[index].priceB=that.$common.toPrice (res.list[index].price, 0);
			// 			}
			// 		}
			// 		arr = arr.concat(res.list);
			// 		that.collect_list=arr;
			// 		// that.twoNum();
										
			// 		that.allCheck();
			// 		if (that.page >= res.total_page){
			// 		that.loading= false;
			// 		}
			  
			// 	}
			//  uni.hideLoading();
			//    }
			//     })
			
			 //加载收藏数量
				this.$api.countCollection({c_type:c_type}).then(res=>{	
					if (res.errcode == 0) {
					  console.log(res);
						that.collect_num= res.count;
					}
				});
		  },
		  twoNum: function () {
			var that = this;
			for (var index in that.collect_list) {
				var price = that.collect_list[index].price;
				var strPriceA = 'collect_list[' + index + '].priceA';
				var strPriceB = 'collect_list[' + index + '].priceB';
				// that.setData({
				//   [strPriceA]: util.toPrice(price, true),
				//   [strPriceB]: util.toPrice(price, false)
				// })
			}
		  },
		
		  /**
		   * 计算全选的方法
		   */
		  allCheck: function () {
			var choseL = 0;
			var liseL = this.collect_list.length;
			for (var idx in this.collect_list) {
			  var items = this.collect_list[idx];
				if (items.ischeck) {
				  choseL++;
				}
			}
			if (choseL == liseL) {
				 this.all_check= true;
			} else {
				 this.all_check= false;
			}
		  },
		  /**
		   * 编辑按钮
		   */
		  edit: function (bool) {
			var state;
			console.log(bool);
			if (bool == 1) {
			  state = false;
			} else {
			  state = true;
			}
			   this.is_edit= state;
		  },
		  /**
		  * 全择按钮
		  */
		  check_all: function () {
			var that = this;
			var check = !that.all_check;
			var list = that.collect_list;
			for (var idx in list) {
			  var items = list[idx];
				items.ischeck = check;
			}
			  that.all_check=check;
			  that.collect_list=list;
		  },
		  /**
		  * 选择按钮
		  */
		  check_fun: function (item,index) {
			  var that=this;
			item.ischeck = !item.ischeck;
			that.collect_list[index].ischeck=item.ischeck;
			this.allCheck()
		  },
		  /**
		  * 导航按钮
		  */
		  nav_fun: function (item) {
			var that = this;
			var index=item.index;
			var nav_index = item.index;
			var char = that.nav_list[index].c_type;
			  that.nav_index= nav_index;
			  that.is_edit= false;
			  that.all_check= false;
			  that.collect_type=char;
			  that.collect_list=[];
			  that.page=1;
			  that.loading=true;
			  that.get_data();
		  },
		  
			get_nav_List: function () {
				var that = this;
				this.$api.appIndexCheckType({}).then(res=>{
					if (res.errcode == 0) {
							that.nav_list= res.type_info;
							for(var i in that.nav_list){
								that.nav_list[i].name=that.nav_list[i].types_name;
							}
						if (res.type_info.length>0){
							that.collect_type= res.type_info[0].c_type;
							that.get_data();
						}
					}
				});
			},
		  /**
		   * 删除按钮
		   */
		  delete_check: function () {
			var that = this;
			var collect_list = that.collect_list;
			var arr=[];
			for (var index in collect_list) {
			if(collect_list[index].ischeck){
			  arr.push(collect_list[index].id);
			}
			}
			console.log(arr.join(","));
			arr=arr.join(",");
			this.$api.delCollection({del_ids: arr}).then(res=>{
				console.log(res);
				if(res.errcode==0){
					that.page=1;
					that.collect_list=[];
					that.loading=true;
				  that.get_data();
				}
			});
		  },
	}
}