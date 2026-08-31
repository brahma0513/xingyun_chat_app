export default {
	data() {
		return {
		theme: getApp().globalData.style_color,
		http_host: '',
		monetary_unit: getApp().globalData.monetary_unit,
		price_color:getApp().globalData.price_color,
		canload: true,
		load_type: 3,
		nav_index: 0,
		page_num:1,
		nav_list: [{name:"商品"}],
		is_edit: false,   //编辑状态
		collect_type: 1,  //收藏类型  1 商品  2店铺
		length:0,
		all_check:false,
		collect_list:[],//列表
		template_data: { has_bottom: true }//底部导航数据
		}
	},
	  /**
	   * 生命周期函数--监听页面加载
	   */
	  onLoad: function (options) {
		  // app.get_visitor()
		  var that = this;
		  that.http_host=this.vuex_apiUrl;
		  that.getList(2);
	  },
	methods: {
		// 判断是否有底部导航
		showBottom: function (e) {
			this.bottom_open=e.detail;
			},
		gotoDeatil:function(url){
				this.$common.diyLinkJump(url,'h5',true,1)
			},
		getList: function (foot_type) {
				var that = this;
				var _data = {};
				var request_data = {};
				request_data = {
					foot_type: foot_type,
					page_num: that.page_num,
					client_port:2
				}
				
				this.$api.getFootprint(request_data).then(res=>{// url: '/wsy_pub/web/index.php?m=app_index&a=get_footprint',
					   console.log(res.data);
					   var length=0;
					   if(res.errcode==0){
						   
						   var dataList=res.data;
						   
						   // var dataList=that.collect_list;
						   
						   dataList.forEach((items,index)=>{
							   items.day_list.forEach((item,ind)=>{
								   length++;
								   item.priceA = that.$common.toPrice (item.price, 1);
								   item.priceB = that.$common.toPrice (item.price, 0);
							   })
						   })
							   that.length=length;
							   
							   that.collect_list=dataList;
						   
						   if (res.data.length>=20){
								   that.load_type=1;
								   that.canload=true;
						   }else{
								that.load_type=1;
								that.canload=false;
						   }
					   }else{
							   that.collect_list= [];
					   }
				})
		
			},
		
			del:function(){
				var that = this;
				var foot_type;
				var del_str = '';
				var del_infor = {};
				if (that.collect_type == 1) {
					foot_type = 2;
				} else if (that.collect_type == 2) {
					foot_type = 7;
				} else if (that.collect_type == 3) {
					foot_type = 8;
				} else if (that.collect_type == 4) {
					foot_type = 9;
				}
				var dataList=that.collect_list;
				
				dataList.forEach((items,index)=>{
					items.day_list.forEach((item,ind)=>{
						if (item.ischeck==true){
							del_str += item.time + '_' +item.pid + '_'+item.app_id+',';
						}
					})
					del_str = del_str.substring(0, del_str.length - 1);
					// if (pid_app_id != '') {
					//     var time = items.time.split('-')[0] + items.time.split('-')[1] + items.time.split('-')[2]
					//     del_infor[time] = pid_app_id.substring(0, pid_app_id.length - 1)
					// }
				})
				var _data = {};
				var request_data = {};
				request_data = {
					foot_type: foot_type,
					del_str: del_str
				};
				this.$api.delFoot(request_data).then(res=>{// url: '/wsy_pub/web/index.php?m=app_index&a=del_foot',
				console.log(res.data);
				if(res.errcode==0){
					uni.showToast({
						title: '删除成功',
						icon:'none',
						duration:2000,
						success:function(){
							setTimeout(function(){
								that.getList(foot_type)
							},2000)
						}
					})
				}
					});
			},
		  /**
		   * 计算全选的方法
		   */
		 allCheck: function () {
			 var that=this;
			 var choseL = 0
			 var liseL = 0
			 for (var idx in this.collect_list) {
			   var items = this.collect_list[idx]
			   liseL += items.day_list.length;
			   for (var cdx in items.day_list) {
				 if (items.day_list[cdx].ischeck) {
				   choseL++;
				 }
			   }
			 }
			 if (choseL == liseL) {
				 this.all_check=true;
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
			if(bool == 1){
			  state = false;
			}else{
			  state = true;
			}
			  this.is_edit= state;
		  },
		   /**
		   * 全择按钮
		   */
		  check_all:function(){
			var that = this;
			var check = !that.all_check;
			var list = this.collect_list;
			for (var idx in list) {
			  var items = list[idx];
			  for (var cdx in items.day_list) {
				items.day_list[cdx].ischeck = check;
			  }
			}
			that.all_check=check;
			that.collect_list=list;
		  },
		   /**
		   * 选择按钮
		   */
		  check_fun:function(item,index,timeindex){
		   var that=this;
		   item.ischeck = !item.ischeck;
		   that.collect_list[timeindex].ischeck=item.ischeck;
		   this.allCheck();
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
			  that.getList();
		  },
		  /**
		   * 删除按钮
		   */
		  delete_check: function () {
			var that = this;
			that.del();
		  },
		  /**
		   * 页面上拉触底事件的处理函数
		   */
		  onReachBottom: function () {
			  var that = this;
			  var page_num = that.page_num;
			  page_num++;
			  if (!that.canload){
				  return false;
			  }
				 that.page_num= page_num;
			  if (that.collect_type == 1) {
				  that.getList(2);
			  } else if (that.collect_type == 2) {
				  that.getList(7);
			  } else if (that.collect_type == 3) {
				  that.getList(8);
			  } else if (that.collect_type == 4) {
				  that.getList(9);
			  }
		  },
	}
}