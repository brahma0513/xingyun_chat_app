import pagecom from '@/components/pagecom/pagecom.vue'	
export default {
	components: {
		pagecom
	},
	data() {
		return {
			active: 0,//小图片是否有蓝色边框
			type: 0,
			small_list: [this.vuex_apiUrl + '/HTML/images/shop/images/small1.png', this.vuex_apiUrl + '/HTML/images/shop/images/small2.png', this.vuex_apiUrl + '/HTML/images/shop/images/small3.png', this.vuex_apiUrl +'/HTML/images/shop/images/small4.png'],
			active_img: '',
			showPage: false,
			is_show_all_qr: '', // 是否开启所有海报
			show_style: '', // 展示海报的索引
			tips_show: false,
			tips: '',
			template_data: { has_bottom: true },//底部导航数据,
			
			modal_show: false,
			modal_title: "提示",
			modal_content: "",
		}
	},
	onLoad() {
		var that = this
		if(that.vuex_user.user_id<=0){
			var back_route = '/public/pages/award/scope';
			uni.redirectTo({
				url: '/public/pages/user/login?back_route='+back_route
			})
			return false;
		}
		that.condition_apply_promoter()
	},
	methods: {
		toggle: function (index) {
			var that = this;
			that.active = index;
			that.type = index+1;
			that.get_list(index+1,1)
		},
		modal_confirm: function(){
			
		},
		condition_apply_promoter: function () {
			var _this = this;
			this.$common.showLoading();
			this.$api.conditionApplyPromoter({user_id:_this.vuex_user.user_id}).then(data => {
				console.log('申请销售员结果：',data);
				uni.hideLoading()
				var res = data.data;
				switch (data.errcode) {
					case 0: //可申请状态
						uni.redirectTo({
							url: '/public/pages/award/promoter',
						})
						//_this.$common.diyLinkJump('/wsy_user/web/index.php?m=user&a=promoter_poster','h5',true,2)
						break;
					case 401: //用户已经是推广员
						if (data.status) {
							uni.hideLoading();
							_this.showPage = true;
							_this.get_type()
						} else {
							uni.showToast({
								title: data.errmsg,
								icon: 'none'
							})
						}							
						break;
					case 402: //审核中
						uni.redirectTo({
							url: '/public/pages/award/promoter',
						})
						//_this.$common.diyLinkJump('/wsy_user/web/index.php?m=user&a=promoter_poster','h5',true,2)
						break;
					case 403: //尚未开放申请
						_this.tips_show = true;
						_this.tips = '抱歉，尚未开放申请';
						break;
					case 404: //尚未开满足申请条件
						_this.tips_show = true;
						_this.tips = '抱歉，您尚未满足申请条件';
						break;
					default:
						uni.showToast({
							title: data.errmsg,
							icon: 'none'
						})
						break;
				}
			});

		},
		//获取海报列表
		get_type: function () {
			var that = this
			this.$api.getPosterType({qrcode_type:1,user_id:that.vuex_user.user_id}).then(res => {
				console.log("海报分类列表",res)
				that.active = res.data.poster_type-1;
				that.is_show_all_qr = res.data.is_show_all_qr;
				that.show_style = res.data.show_style;
				if (res.data.is_show_all_qr == 1){
				  that.type = res.data.poster_type;
				  that.get_list(res.data.poster_type,1)
				}else{
				  that.type = res.data.show_style;
				  that.get_list(res.data.show_style,1)
				}
			})
		},
		
		//点击长按保存到相册
		saveShareImg: function () {
			var that = this;
			this.$common.showLoading('正在保存');
			uni.downloadFile({
				url: that.active_img,
				success: (res) =>{
					if (res.statusCode && res.statusCode === 200){
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function() {
								uni.hideLoading()
								that.$common.showToast('保存成功');
							},
							fail(e) {
								uni.hideLoading()
								that.$common.showToast("保存相册失败，请检查手机权限。");
							}
						});
					}
				},
			})
		},
		
		
		get_list: function (img_type,cache) {
			var that = this
			var _data = {};
			that.img_type = img_type
			this.$api.promoterQrcode({img_type:img_type,is_cache:cache}).then(res => {
				console.log("当前类型",img_type)
				console.log("海报列表",res)
				that.small_list = res.bg_img;
				that.active_img = res.promoter_poster_url;
			})
		},
		
		reloadImg: function(){
			this.get_list(this.type,0);
		}
	}
}