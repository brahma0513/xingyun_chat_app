import addressSelector from '@/components/pagecom/components/addressSelector/addressSelector.vue'
export default {
	components: {
		'address-Selector':addressSelector
	},
	data() {
		return {
			// customer_id: app.globalData.customer_id,
			// api_key: app.globalData.api_key,
			// app_id: app.globalData.app_id,
			theme: getApp().globalData.style_color,
			theme_color: this.$common.get_color(getApp().globalData.style_color),
			http_host: '',
			address:'',
			showPicker:false,
			check:false,
			noward:true,
			name: '',	
			tel: '',
			mark:'',
			addressList:{},
			page_hidden: true,
			array: [{'nation':'中国'}], // 国家
			index: 0, // 国家索引
			countryCodes: ['+86', '+886', '+852', '+853', '+60', '+63', '+65', '+66', '+81', '+82', '+91', '+7', '+30', '+31', '+34', '+41', '+45', '+46', '+47', '+351', '+61', '+64', '+1', '+44', '+49', '+33', '+39', '+52'], // 手机区号
			countryCodeIndex: 0, // 区号索引
			pop_state:'',
			rules:'',		
			special_address:'',
			abbreviation:'',
			//地址
			// areaSelectedStr:'',
			// area_code: "",
			// cityName: "",
			// city_code: "",
			// provinceName: "",
			// province_code: "",
			// regionName: "",
			// street_code: "",
			// townName:'',
				}
	},
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		// app.get_visitor()
		var that= this;
		that.http_host=this.vuex_apiUrl;
		that.level=options.level;
		that.get_form();
		that.get_address();
	},
	methods: {
		bindPickerChange: function (e) {
				this.index= e.detail.value;
		},
		bindCountryCodeChange: function (e) {
				this.countryCodeIndex=e.detail.value;
		},
		get_address: function () {
			var that = this;
			
			that.$common.requestData({
				url: '/wsy_pub/api/index.php?m=address&a=get_nation_list',
				data: {  },
				method: 'POST',
			}).then(res => {
				console.log('get_nation_list',res);
					that.array=res.data;
			})
		},
	
	// ------------
		get_form:function(){
		  var that = this;
		  
		  that.$common.requestData({
			url: '/wsy_user/web/index.php?m=privilege&a=apply_regional',
			data: {op: 'get'},
			method: 'POST',
		  }).then(res => {
			//未开启区域奖励
			if (res.errcode == 90000) {
				uni.showToast({
					title: res.errmsg,
					icon: 'none'
				});
				// setTimeout(function () {
				//     uni.navigateBack({})
				// }, 2000);
				return
			} else {
				that.page_hidden=false;
			}
			if (res.application_data.errcode == 0){
				var data = res.application_data.data;
				var addressList = {};
				console.log('application_data',res.application_data);
				if (data && data.length != 0){
					addressList.provinceName = data.location_p;
					addressList.cityName = data.location_c;
					addressList.regionName = data.location_a;
					// console.log(that.array);
					that.array.forEach(function(item,ind){

						if(item.nation == data.abbreviation){
								that.index=ind;
						}
					})
					that.countryCodes.forEach(function (item, ind) {
						if (item == '+' + data.country_code) {
								that.countryCodeIndex=ind;
						}
					})
						 that.name=data.apply_name;
						 that.tel=data.apply_phone;
						 that.mark=data.remark;
						 that.address=data.location_p +' ' + data.location_c + ' ' + data.location_a;
						 that.addressList=addressList;
				}
				
			}
			
		  })
		  
		},
		formSubmit: function (e) {
			// app.saveFormId(e.detail.formId);
			var that = this;
			if (!/^(1)[0-9]{10}$/.test(that.tel)) {
			  uni.showToast({
				title: '请输入正确的手机号',
				icon: 'none'
			  })
			  return false;
			}
			if (!that.noward){
			  that.postFun();
			}
		},
	  
		postFun: function () {
			var that = this;
			var apply_grade = ['diy', 'street', 'area', 'city', 'province','region'];
			var level = that.level;
			var _data = {};

			that.$common.requestData({
				url: '/wsy_rebate/api/index.php?m=regional&a=app_apply_regional&data[user_id]=' + that.vuex_user.user_id + '&data[apply_name]=' + that.name + '&data[apply_phone]=' + that.tel + '&data[location_p]=' + that.addressList.provinceName + '&data[location_c]=' + that.addressList.cityName + '&data[location_a]=' + that.addressList.regionName + '&data[apply_grade]=' + apply_grade[level] + '&data[level]=' + level + '&data[remark]=' + that.mark + '&data[country_code]=' + that.countryCodes[that.countryCodeIndex] + '&data[abbreviation]=' + that.array[that.index].abbreviation,
				data: { },
				method: 'POST',
			}).then(res => {
				console.log(res);
				if (res.errcode == 0) {
				  uni.showToast({
					title: '申请成功',
					duration: 2000
				  });
				  setTimeout(function(){
					uni.navigateBack({
					  delta: 1
					})
				  },2000)
				}else{
				  uni.showToast({
					title: res.errmsg,
					duration: 2000,
					icon:'none'
				  });
				}
			})

		},
		xieyi: function () {
			this.pop_state=true;
		},
		close_pop: function () {
			this.pop_state=false;
		},
		changeVal: function (e) {
			var that = this;
		// var input = e.currentTarget.dataset.input;
		// console.log(input);
		// that.setData({
		//   [input]: e.detail.value,
		// })
			that.is_noword();
		},
		is_noword:function(){
			const that = this
		 
			if (that.name == '' || that.tel == '' || that.address == '' || that.mark == '' || !that.check){
				that.noward=true;
			}else{
				that.noward= false;
			}
		},
		cascadePopup: function () {
			this.showPicker= true;
			// 调用子组件中methods的cascadePopup方法
			this.$nextTick(()=>{
				this.$refs.addressSelector.cascadePopup()
			})
			// this.selectComponent('#address-Selector').cascadePopup();
		},
		checkFun: function () {
			var that = this;
			that.check= !that.check;
			this.is_noword();
		},
  
		toggleToast: function (e) {
			var that = this;
			if (e != undefined) {
				// that.areaSelectedStr = e.areaSelectedStr;
				that.address = e.areaSelectedStr;
				// that.cityName= e.cityName; //市名称
				// that.provinceName= e.provinceName; //省名称
				// that.regionName= e.regionName; //区名
				// that.townName= e.townName; //街道名
		  // 		that.province_code = e.province_code; //省
		  // 		that.city_code = e.city_code; //市
		  // 		that.area_code = e.area_code; //镇区
		  // 		that.street_code = e.street_code?e.street_code :''; //街道
				// that.diy_code = e.diy_code?e.diy_code:'' //自定义
				// if(e.diy_code==undefined){
				// 	that.diy_code = e.street_code?e.street_code:''
				// }
				that.addressList=e;
				that.is_noword();
			}
		},
	},
	
}