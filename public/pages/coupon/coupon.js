export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			http_host: '',
			nav_index: 0, // tab索引
			status:1, // 优惠券状态
			navList:[{name:"未使用"}, {name:"已使用"}, {name:"已过期"}],
			page: 1, // 页数
			list:[], // 优惠券数据
		}
	},
	 onLoad: function (options) {
			const that = this;
			that.http_host=this.vuex_apiUrl;
			that.get_list();
			console.log(that.navList);
		},
	methods: {
		 nav_click: function (item) { 
				var that = this;
				var index=item.index;
					that.nav_index= index;
					that.status= index + 1;
					that.list=[];
				//点击别的栏目清空部分数据
				that.get_list();
			},
			// 去使用
			go_index: function () {
				uni.navigateTo({
					url: '/pages/index/index',
				});
			},
			// 显示隐藏说明
			toggle: function (index) {
				var that = this;
				that.list[index].description_bool=!that.list[index].description_bool;
				// that.list.forEach((item) => {
				//     if(item.id == num){
				//         item.description_bool = !item.description_bool
				//     }
				// })
				
		  //       that.setData({
		  //           list : that.list
		  //       })
			},
		// 获取列表数据
			get_list: function () {
				const that = this;
				var post_data={
						status: that.status,
						pagenum: that.page
					};
				this.$api.getUserCouponList(post_data).then(res=>{
						for (var item in res.data) {
							res.data[item].time = that.splices(res.data[item].start_time) + "_" + that.splices(res.data[item].end_time);
							if(res.data[item].rule == ''){
								res.data[item].description_bool = false;
								res.data[item].bool = false;
							}else{
								res.data[item].description_bool = true;
								res.data[item].bool = true;
							}
							}
						that.list= that.list.concat(res.data);
						that.pageCount= res.pageCoun;
						console.log(that.list);
							});
			},
			/**
			 * 页面相关事件处理函数--监听用户下拉动作
			 */
			onPullDownRefresh: function () {
				var that = this;
				var num = that.page;
				num ++
				if (num <= that.pageCount){
					that.setData({
						page: num
					})
					that.get_list()
				}else{
					console.log("已经是所有的数据！")
				}
			},
			splices: function(data){
				var arr = data.split(" ");
				return arr[0];
			},
	}
}