export default {
	data() {
		return {
	http_host: '',
	theme: getApp().globalData.style_color,
	bgStyle: '',
	auth_book: '', //授权书
	state: false,
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
			// app.get_visitor()
			var that = this;
			that.http_host=this.vuex_apiUrl;
			//获取用户身份
			that.get_user_ideneity();
		},
	methods: {
		 //返回上一页
			get_user_ideneity(){
				 var that = this;
				this.$api.getUserIdentity({}).then(res=>{
						//获取失败
						if(res.errcode !== 0){
							uni.showModal({
								title: '提示',
								content: res.errmsg,
								showCancel: false,
								confirmColor: '#7c88eb',
								success: function (res) {
									uni.navigateBack({
										delta: 1
									})
								},
							})
						}
						//粉丝
						if (res.data.includes(1)) {
							//显示申请
							uni.redirectTo({
								url: '/public/pages/spread/applySpread',
							});
						} 
						//推广员
						else {
							//获取授权书
							that.get_img();
						}
							});
			},
			back_view: function () {
				uni.navigateBack({
					delta: 1
				})
			},
			get_img:function(){
				var that = this;
				this.$api.getAuthCertificateImg({}).then(res=>{
					console.log(res);
				   if (res.errcode == 0) {
						   that.state=false;
						   that.auth_book= that.http_host + (res.data.url).substring(2, res.data.url.length);
				   }else{
					//wx.redirectTo({
					  //     url: '/public/pages/error/error?errmsg=' + res.errmsg,
					   //})
					  that.auth_book=that.http_host+"/wsy_user/web/static/images/sqs.png";		   			
				   }
				   })		
				console.log(that.auth_book);
			},
		 apply: function() {
				var that = this
				uni.navigateTo({
					url: '../award/promoter/promoter',
				})
			},
			baocun: function() {
				var that=this;
				uni.getImageInfo({
					src: that.auth_book,
					success: function(res) {
						console.log(res);
						var path = res.path;
						uni.saveImageToPhotosAlbum({
							filePath: path,
							success: function(res) {
								console.log('图片已保存');
							},
							fail: function(res) {
								console.log('保存失败');
							}
						})
					}
				});
			},
	}
}