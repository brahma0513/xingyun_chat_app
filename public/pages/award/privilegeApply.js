export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			theme_color: this.$common.get_color(getApp().globalData.style_color),
			http_host: this.vuex_apiUrl,
			pop_state: false,
			has_code: false,
			code_time: 60,
			name: '',
			tel: '',
			code: '',
			tips: '',
			noword: true,
			check: false,
			form_show: false, //是否显示申请表单
			auto_review: 0, //申请后是否需要审核
			title_img: this.vuex_apiUrl + "/wsy_user/web/static/images/pro_head_img.png", // 顶部图片
			card: '', // 身份证号
			sfzz_img: '', // 身份证正面不带域名链接
			sfzf_img: '', // 身份证反面不带域名链接
			is_name_certificate: false, //是否需要实名认证
			sfzz_img_url: '', // 身份证正面
			sfzf_img_url: '', // 身份证反面
			countryCodes: [['+86', '+886', '+852', '+853', '+60', '+63', '+65', '+66', '+81', '+82', '+91', '+7', '+30', '+31', '+34', '+41', '+45', '+46', '+47', '+351', '+61', '+64', '+1', '+44', '+49', '+33', '+39', '+52']],
			countryCodeIndex: 0,
			country_code: "+86", // 手机区号
			real_name : '', // 真实姓名
			is_card_pic : false, // 是否显示上传身份证图片
			is_card_need : false, // 上传身份证照片是否必填
			is_title_img : false, // 是否显示顶部图片
			
			formList:[],
			
			countryPickerShow: false,
		}
	},
	onLoad() {
		var that = this
		that.condition_apply_promoter()
	},
	methods: {
		codeChange(text) {
			this.tips = text;
		},
		// 选择手机区号
		bindCountryCodeChange: function (e) {
			var that = this;
			that.countryCodeIndex = e.index;
			that.country_code = that.countryCodes[0][e.index];
			that.countryPickerShow = false
		},
		changeVal: function(e,index) {
			var that = this
			var inputstr = 'formList[' + index + '].value'
			that.formList[index].value = e
			that.is_noword()
		},
		choseOption: function(e) {
			var that = this
			var index = e.currentTarget.dataset.index
			var optionstr = 'formList[' + index + '].select_tap'
			console.log('index',index)
			that.formList[index].select_tap = true
			console.log('formList',that.formList[index])
			console.log('formList',that.formList[index].select_tap)
		},
		hideAllSelect: function() {
			var that = this
			var list = that.formList
			list.forEach(function(item) {
				if (item.field_type == 2) {
					item.select_tap = false
				}
			})
			that.formList = list
		},
		hideSelect: function(e) {
			var that = this
			var index = e.currentTarget.dataset.index
			var text = e.currentTarget.dataset.text
			var str = "oplabel." + index
			var liststr = 'formList[' + index + '].select_tap'
			var inputstr = 'formList[' + index + '].value'
			that.$str = text
			that.$inputstr = text
			that.$liststr = false
			that.is_noword()
		},
		get_code: function() {
			var self = this;
			if (self.tel === '') {
				uni.showToast({
					title: '请输入手机号码',
					icon: 'none'
				})
				return false;
			}
			if(self.country_code == '+86'){
				if (!self.checkPhone(self.tel)) {
					return false;
				}
			}
			var that = this
			var params = {
					bind_phone: that.tel,
					country_code: that.country_code,
				};
			this.$api.getPhoneCode(params).then(res => {
				if(res.errcode == 0){
					// 这里此提示会被this.start()方法中的提示覆盖
					uni.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}else{
					if(res.errmsg){
						uni.showToast({
							title: res.errmsg,
							icon: 'none'
						})
					}
				}
			})
	
		},
	
		save_msg: function(e) {
			app.saveFormId(e.detail.formId)
			var self = this;
			if (!self.noword) {
				if (!that.checkPhone(self.tel)) {
					return false;
				}
				self.app_apply_promoter()
			}
		},
		get_custom: function() {
			var that = this
			that.$api.wsyrebateCustomApplicationGet({is_default: 0}).then(res => {
				if (res.errcode == 0) {
					var list = [];
					res.data.forEach(function(item) {
						if (item.field_type == 2) {
							item.option = item.initial_content.split("|")
							item.select_tap = false
						}
						if (item.field_type == 3) {
							that.is_name_certificate = true
						}
						if(item.field_type == 4 && item.initial_content){ // 顶图
							that.is_title_img = true
							that.title_img = item.initial_content
						}
						if(item.field_type != 3 && item.field_type != 4){
							list.push(item)
						}
					})
					that.formList = list
						
				}
			})
		},
		//申请成为推广员的请求
		app_apply_promoter: function() {
			var that = this
			var _data = {};
	
			var custom = {}
			that.formList.forEach(function(item, index) {
				custom[index] = {
					title: item.title,
					value: item.value
				}
			})				
			
			that.$api.wsyuserApplyPrivilegeSet({
				op: 'apply',
				apply_name: that.name,
				apply_phone: that.tel,
				code: that.code,
				custom_content: JSON.stringify(custom),
				auto_review: that.auto_review,
				is_name_certificate: that.is_name_certificate,
				real_name: that.real_name,
				card: that.card,
				sfzz_img_url: that.sfzz_img,
				sfzf_img_url: that.sfzf_img
			},).then(res => {
				if (res.errcode != 0) {
					uni.showToast({
						title: res.errmsg,
						icon: 'none'
					})
					return
				}
						
				uni.showToast({
					title: '申请成功',
					icon: 'success',
					duration: 2000
				})
				setTimeout(function() {
					if (that.auto_review == 1) {
						uni.redirectTo({
							url: '/public/pages/award/earningsFigures/earningsFigures',
						})
					} else {
						that.condition_apply_promoter();
					}
				}, 2000)
			})

	
		},
		checkFun: function() {
			var self = this;
			self.check = !self.data.check
			self.is_noword()
		},
		xieyi: function() {
			this.pop_state = true
		},
		close_pop: function() {
			this.pop_state = false				
		},
		// 判断表单是否填满了
		is_noword: function() {
			var that = this
			var len = that.formList.length
			var fullLen = 0
			var listopen = false
			//判断自定义表单是否添满
			if (len == 0) {
				listopen = true
			} else {
				that.formList.forEach(function(item) {
					if (item.value != "") {
						fullLen++
					}
					if (fullLen == len) {
						listopen = true
					} else {
						listopen = false
					}
				})
			}
			if (this.name.length > 0 && this.tel.length > 0 && this.code.length > 0 && this.check && listopen&&((this.card.length>0&&this.real_name.length>0&&((this.sfzz_img.length>0&&this.sfzf_img.length>0) || this.is_card_pic==false || this.is_card_need==false )) || this.is_name_certificate == false)) {
				this.noword = false
			} else {
				this.noword = true
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			const that = this
			that.get_custom();
			that.get_rule();
			that.get_deploy(); // 获取实名认证配置信息
			that.condition_apply_promoter();
		},
		// 获取实名认证配置信息
		get_deploy: function() {
			var _this = this;
			_this.$api.wsyuserRealNameCertification({}).then(res => {
				if (res.errcode === 0) {
					_this.is_card_pic = res.id_verify_open == "1" ? true : false
					_this.is_card_need = res.id_verify_model == "1" ? true : false
				}
			})
		},
		// 上传图片
		chooseImage: function(e) {
			var bool = e.currentTarget.dataset.bool;
			var that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					that.upLoadImg(res.tempFilePaths[0], bool)
				}
			})
		},
		// 上传图片
		upLoadImg: function (imgurl, bool) {
			var that = this;
			util.upLoadImg({
				url: '/wsy_user/web/index.php?m=privilege&a=img_save',
				imgurl: imgurl,
				success: function(res) {
					console.log(res)
					res = JSON.parse(res);
					if (res.errcode == 0 && res.data != false) {
						console.log(res)
						if(bool == "left"){
							that.setData({
								sfzz_img_url: res.ATTACH_URL +res.data,
								sfzz_img: res.data,
							});
						}else{
							that.setData({
								sfzf_img_url: res.ATTACH_URL +res.data,
								sfzf_img: res.data,
							});
						}
						that.is_noword()
					}
				}
			});
		},
		// 删除图片
		del_img: function(e){
			var bool = e.currentTarget.dataset.bool;
			var that = this;
			if(bool == "left"){
				that.setData({
					sfzz_img_url: '',
					sfzz_img: '',
				});
			}else{
				that.setData({
					sfzf_img_url: '',
					sfzf_img: '',
				});
			}
			that.is_noword()
		},
		// 获取协议
		get_rule: function() {
			var _this = this;
			_this.$api.publicSettingGet({}).then(res => {
				if (res.errcode === 0) {
					_this.rules = res.data.promoter_agreement
				}
			})
		},
		condition_apply_promoter: function() {
			var _this = this;
			this.$api.conditionApplyPromoter({user_id:_this.vuex_user.user_id}).then(data => {
				var res = data.data;
				switch (data.errcode) {
					case 0: //可申请状态
						_this.form_show = true,
						_this.auto_review = res.auto_review
						break;
					case 401:case 411: //用户已经是推广员411是身份过期
						if (data.status) {
							uni.showToast({
								title: data.errmsg,
								icon: 'none',
								duration: 2000
							})
							setTimeout(function(){
								uni.redirectTo({
									url: '/public/pages/award/earningsFigures/earningsFigures',
								})
							},2000)
						
						} else {
							uni.showToast({
								title: data.errmsg,
								icon: 'none',
								duration: 2000
							})
						}
						
						break;
					case 402: //审核中
						uni.redirectTo({
							url: '/public/pages/award/promoter/promoter',
						})
						break;
					case 403: //尚未开放申请
						uni.redirectTo({
							url: '/public/pages/error/error?errmsg=抱歉，尚未开放申请&notime='+true,
						})
						break;
					case 404: //尚未开满足申请条件
						uni.redirectTo({
							url: '/public/pages/error/error?errmsg=抱歉，您尚未满足申请条件&notime='+true,
						})
						break;
					default:
						uni.showToast({
							title: data.errmsg,
							icon: 'none',
							duration: 2000
						})
						break;
				}
			});
		},
		/**
		 * 手机格式验证
		 */
		checkPhone : function(phone) { //公共手机号合法判断
			var phoneReg = /^((\+?86)|(\(\+86\)))?\d{11}$|^(09)\d{8}$/;
			var telReg = /^0\d{2,3}-?\d{7,8}$/;
			if (!(phoneReg.test(phone) || telReg.test(phone)) || phone == '' || (typeof phone == "undefined")) {
				uni.showToast({
					title: '手机号格式不正确或为空',
					icon: 'none', // 提示图标
					duration: 1500
				});
				return false;
			}
			return true;
		}
		
		
	}
}