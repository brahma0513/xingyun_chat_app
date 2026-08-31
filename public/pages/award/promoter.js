export default {
	data() {
		return {
			theme: getApp().globalData.style_color,
			theme_color: this.$common.get_color(getApp().globalData.style_color),
			apply: false,
			apply_content: '',
			rules: '',
		}
	},
	onLoad() {
		this.get_info()
		this.get_rule()
		
	},
	methods: {
		applyFun: function() {
			var that = this;
			if (!that.apply) {
				that.$common.diyLinkJump('/wsy_user/web/index.php?m=privilege&a=apply_privilege_set','h5',true,2)
				return;
				//原生页面没做完
				uni.navigateTo({
					url: "privilegeApply"
				})
			}		
		},
		//获取申请状态
		get_apply: function() {
			var _this = this;
			_this.$api.applyPromoterGet().then(data => {
				if (data.errcode === 0) {
					_this.apply_state = data.data

					if (data.data == 0) {
						_this.apply_content = '申请成为' + _this.but_name
					} else {
						_this.apply = true
						_this.apply_content = '申请审核中'
					}
				}
			})
		},
		get_info: function() {
			var _this = this;
			_this.$api.platPromotion().then(data => {
				if (data.errcode === 0) {
					_this.but_name = data.data.diy_name;
					_this.is_open = data.data.is_open;
					_this.get_apply()
				}else{
					_this.$api.platSeniorPromotion().then(data => {
						if (data.errcode === 0) {
							_this.but_name = data.data.diy_name;
							_this.is_open = data.data.is_open;
							_this.get_apply()
						}else{
							_this.but_name =  "销售员";
							_this.get_apply()
						}
					})
				}
			})
		
		},
		get_rule: function() {
			var _this = this;
			_this.$api.publicSettingGet().then(data => {
				if (data.errcode === 0) {
					_this.rules = data.data.identity_agreement;
					_this.is_open = data.data.is_open;
				}
			})
		},
			
	
	//结束
	}
}