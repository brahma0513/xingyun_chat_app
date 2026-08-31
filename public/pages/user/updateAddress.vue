<template>
	<view>
		<!-- 地址选择器 -->
		<!-- haveStree是否需要街道,isDiy是否需要自定义字段 haveStree默认true,isDiy默认false-->
		<address-Selector ref="addressSelector" :haveStree="true" :isDiy="true" :abbreviation="abbreviation"  v-if="showPicker" :special="special_address" v-on:myevent="toggleToast"></address-Selector>
		
		<u-modal :show="modal_show" :title="modal_title" :content="modal_content" @confirm="modal_confirm" :showCancelButton="true" @cancel="modal_show=false"></u-modal>
		
		<view class='container'>
		  <view class="form-box">
		    <view class="row" v-if="special_address != 'jd'">
		      <view class="label">国家地区</view>
		      <view class="input-box">
		        <picker bindchange="bind_sec_data_change" :range="countryList">
		            <view class="weui-select pickerBox"><text class='selectCountry'>{{country}}</text></view>
		        </picker>
		      </view>
		    </view>
		    <view class="row">
		      <view class="label">收件人</view>
		      <view class="input-box">
		        <input type='text' placeholder="收件人" placeholder-class='color-ccc' bindinput='watchRecipients' v-model="Recipients" />
		      </view>
		    </view>
		    <view class="row">
		      <view class="label">手机号</view>
		      <view class="label_tel">
		        <picker @change="bindCountryCodeChange" v-model="countryCodeIndex" :range="countryCodes" class='picker_tel'>
		          <view class="phone-picker">{{countryCodes[countryCodeIndex]}}<image lazy-load="true"  class='jt-down' mode='widthFix' :src="vuex_apiUrl+'/HTML/images/shop/images/shop_btn_arrow.png'"></image></view>
		        </picker>
		      </view>
		      <view class="input-box">
		        <input type='number' pattern="[0-9]*" placeholder-class='color-ccc' placeholder="请输入手机号" bindinput='watchPhone' v-model="Phone" />
		      </view>
		    </view>
		    <view class="row">
				<view class="label">所在地区</view>
				<view class="input-box" @tap="cascadePopup()">
				  <input type='text' placeholder-class='color-ccc' placeholder="省、市、区、街道" disabled='true' :value='areaSelectedStr' />
				</view>
				<view @tap="cascadePopup()">
		        <image class='area_right' :src="vuex_apiUrl+'/HTML/images/shop/images/right_jian.png'"></image>
		      </view>
		    </view>
		    <view class="row">
		      <view class="label">详细地址</view>
		      <view class="input-box">
		        <input type='text' placeholder="详细地址" placeholder-class='color-ccc' bindinput='watchDetailAddress' v-model="DetailAddress" />
		      </view>
		    </view>
		    <view class="row">
		      <view class="label">邮编地址</view>
		      <view class="input-box">
		        <input type='text' placeholder="选填" placeholder-class='color-ccc' bindinput='watchZipcode' v-model="zipcode" />
		      </view>
		    </view>
		  </view>
		  <view class='footer'>
		    <view class='footer-left'>设为默认地址</view>
		    <view class='footer-right'>
		      <switch :color="theme_color" @change="checked_change" :checked="is_default==1" :value="is_default" />
		    </view>
		  </view>
		  <view class='btn'>
		    <view :disabled="!noword" @click='verify()' :class="['btn-button', 'skin-bg-'+theme]">保存</view>
		  </view>
		</view>
	</view>
</template>

<script>
	import addressSelector from '@/components/pagecom/components/addressSelector/addressSelector.vue'
	export default {
		components: {
			'address-Selector':addressSelector
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				theme_color: this.$common.get_color(getApp().globalData.style_color),
				http_host: this.vuex_apiUrl,
				
				special_address:'',//8/7
				noword: false,
				country:'中国',
				countryList:[],
				abbreviation:'',
				Recipients: "",
				Phone: "",
				DetailAddress: "",
				countryCodes: ['+86', '+886', '+852', '+853', '+60', '+63', '+65', '+66', '+81', '+82', '+91', '+7', '+30', '+31', '+34', '+41', '+45', '+46', '+47', '+351', '+61', '+64', '+1', '+44', '+49', '+33', '+39', '+52'],
				countryCodeIndex: 0,
				current: 0,
				province: [],
				city: [],
				region: [],
				town: [],
				areaSelectedStr: "",
				zipcode: "",
				cityarr: [],
				maskVisual: 'hidden',
				provinceName: '请选择省份',
				is_default: false,
				showPicker: false,
				province_code: '',
				city_code: '',
				area_code: '',
				street_code: '',
				diy_code: '',
				modal_show: false,
				modal_title: "提示",
				modal_content: "",
				model_type: "",
			}
		},
		onLoad(e) {
			var that = this;
			let { username = '', phone = '', address = '', zipcode = '', id = '', status = 0 } = e
			that.Recipients = username;
			that.Phone = phone;
			that.DetailAddress = address;
			that.zipcode = zipcode;
			that.id = id;
			if (e) {
				that.detail = e.detail;
				that.type = e.type;
				that.cardID = e.cardID;
				that.createtime = e.createtime
			}
			// 8/7
			if(e.special_address){
				that.special_address = e.special_address
			}
			// 8/7end
			if (status == 1){
				uni.setNavigationBarTitle({
					title:'新建地址'
				})
			}else{
				uni.setNavigationBarTitle({
					title:'编辑地址'
				})
			}
			
			if (id > 0) {
				that.get_address(id)
			}
			that.get_country();
		},
		methods: {
			cascadePopup: function () {
				this.showPicker = true
				// 调用子组件中methods的cascadePopup方法
				this.$nextTick(()=>{
					this.$refs.addressSelector.cascadePopup()
				})
				//this.selectComponent('#address-Selector').cascadePopup()
			},
			toggleToast: function (e) {
				var that = this;
				if (e != undefined) {
					that.areaSelectedStr = e.areaSelectedStr;
					that.nation = e.nation;
					that.nation_code = e.nation_code;
					that.province_code = e.province_code; //省
					that.city_code = e.city_code; //市
					that.area_code = e.area_code; //镇区
					that.street_code = e.street_code?e.street_code :''; //街道
					that.diy_code = e.diy_code?e.diy_code:'' //自定义
					if(e.diy_code==undefined){
						that.diy_code = e.street_code?e.street_code:''
					}
				}
			},
			bindCountryCodeChange: function (e) {
				this.countryCodeIndex = e.detail.value
			},
			//默认地址
			checked_change: function () {
				var _this = this;
				_this.is_default = !_this.is_default
			},
			/*修改用户地址 */
			verify: function () {
				var _this = this
				var id = parseInt(_this.id);
				var username = _this.Recipients;
				var phone = _this.Phone;
				var location_p = _this.provinceName;
				var location_c = _this.cityName;
				var location_a = _this.regionName;
				var is_default = _this.is_default;
				var countryCodeIndex = _this.countryCodeIndex;
				var areaSelectedStr = _this.areaSelectedStr;
				var province = _this.province_code;
				var city = _this.city_code;
				var dis =_this.area_code;
				var street = _this.street_code;
				var custom = _this.diy_code;
				var zipcode = _this.zipcode;
				var nation = _this.country;
				var nation_code = _this.abbreviation;
			  
				if (is_default == true) {
					is_default = 1;
				} else {
					is_default = 0;
				}
				/*判断名字是否为空 */
				if (username == "" || username == null) {
					uni.showToast({
						title: '收件人不能为空',
						icon: "none"
					});
					return false;
				}
				/*判断联系电话是否为空 */
				if (phone == "" || phone == null) {
					uni.showToast({
						title: '联系电话不能为空',
						icon: "none"
					});
					return false;
				}
				/*判断手机号码是否正确 */
				if (!_this.$common.checkPhone(phone) && _this.countryCodes[countryCodeIndex] == '+86') {
					uni.showToast({
						title: '联系电话格式不正确',
						icon: 'none'
					});
					return false;
				}
				/*判断是否选取收货地址 */
				if (province == "" || city == "" || dis == "") {
					uni.showToast({
						title: '收货地址不能为空',
						icon: 'none'
					});
					return false;
				}
				/*判断详细地址是否为空 */
				if (_this.DetailAddress == "" || _this.DetailAddress == null) {
					uni.showToast({
						title: '详细地址不能为空',
						icon: 'none'
					});
					return false;
				}
				/* 判断是添加还是修改*/
				var op = "";
				if (id > 0) {
					op = "edit";
				} else {
					op = "add";
					id = 0;
				}
				if (is_default == 1) {
					is_default = true
				} else {
					is_default = false
				}
				var a_type = uni.getStorageSync('a_type');
				if (a_type == 1) { // 1：确认订单跳转过来
					_this.verify_address(op, username, phone, province, city, dis, street, custom, nation, nation_code)
				}else{
					_this.model_type = 'updateAddress'
					_this.modal_show = true;
					_this.modal_title = "提示";
					_this.modal_content = "是否保存收货地址?";
				}
			},
			modal_confirm(){
				var _this = this;
				_this.modal_show = false;
				
				var _this = this
				var id = parseInt(_this.id);
				var username = _this.Recipients;
				var phone = _this.Phone;
				var location_p = _this.provinceName;
				var location_c = _this.cityName;
				var location_a = _this.regionName;
				var is_default = _this.is_default;
				var countryCodeIndex = _this.countryCodeIndex;
				var areaSelectedStr = _this.areaSelectedStr;
				var province = _this.province_code;
				var city = _this.city_code;
				var dis =_this.area_code;
				var street = _this.street_code;
				var custom = _this.diy_code;
				var zipcode = _this.zipcode;
				var nation = _this.country;
				var nation_code = _this.abbreviation;
				var op = "";
				if (id > 0) {
					op = "edit";
				} else {
					op = "add";
					id = 0;
				}
				_this.verify_address(op, username, phone, province, city, dis, street, custom,nation, nation_code)
			},
			/*保存地址*/
			verify_address(op, username, phone, province, city, dis, street, custom, nation, nation_code) {
				var _this = this
				var is_default = _this.is_default;
				var countryCodeIndex = _this.countryCodeIndex;
				var areaSelectedStr = _this.areaSelectedStr;
				var id = parseInt(_this.id);
				
				var request_data = {
					op: op,
					id: id,//收货人名字
					username: username,//收货人名字
					phone: phone,//联系电话
					province: province, //省
					city: city, //市
					area: dis, //镇区
					street: street, //街道
					zipcode: _this.zipcode,//邮编
					is_default: is_default,
					country_code: _this.countryCodes[countryCodeIndex],
					address: _this.DetailAddress, //详细地址
					custom: custom,
					nation:nation,
					nation_code:nation_code,
					special_address:_this.special_address,
				}							
							
				_this.$api.wsyuserUserAddressEdit(request_data).then(res=>{
					/*修改成功 */
					if (res.errcode == 0) {
						var aid = res.id;
						var a_type = uni.getStorageSync('a_type');
						uni.setStorageSync('aid', aid);
						if (a_type == 1) { // 1：确认订单跳转过来，直接跳回订单页面
							uni.navigateBack({
								delta: 2
							})
						} else if (_this.detail){
							console.log(_this.id)
							uni.navigateTo({
								url: '../../../../giftcard/pages/mine/giftCardDetail?type=' + _this.type + '&id=' + _this.cardID + '&createtime=' + _this.createtime + '&addressID=' + res.id,
							})
						}else {
							uni.navigateBack({
								delta: 2
							})
						}
							
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
			/*获取用户的地址*/
			get_address: function (address_id) {
				var _this = this;
				var request_data =  {
					user_id: this.vuex_user.user_id,
					id: address_id,
					special_address:_this.special_address//8/7
				}
				
				_this.$api.wsyuserUserAddress(request_data).then(res=>{
					if (res.data[0]) {
						var countryCodes = _this.countryCodes;
						var countryCodeIndex = 0;
						for (let i = 0; i < countryCodes.length; i++) {
							if (countryCodes[i] == res.data[0].country_code) {
								countryCodeIndex = i
							}
						}
						
						_this.provinceName = res.data[0].province;
						_this.user_id = res.data[0].user_id;
						_this.Recipients = res.data[0].username;
						_this.Phone = res.data[0].phone;
						_this.cityName = res.data[0].city;
						_this.regionName = res.data[0].area;
						_this.is_default = res.data[0].is_default;
						_this.DetailAddress = res.data[0].address;
						_this.countryCodeIndex = countryCodeIndex;
						_this.zipcode = res.data[0].zipcode;
						_this.province_code = res.data[0].province_code;
						_this.city_code = res.data[0].city_code;
						_this.area_code = res.data[0].area_code;
						_this.street_code = res.data[0].street_code;
						
						if (res.data[0].diy_area_code!=undefined){
							_this.diy_code = res.data[0].diy_area_code
							_this.areaSelectedStr = res.data[0].province + res.data[0].city + res.data[0].area + res.data[0].street + res.data[0].diy_area
						}else{
							_this.areaSelectedStr = res.data[0].province + res.data[0].city + res.data[0].area + res.data[0].street
						}
					}
				})
				
			},
			/*获取用户的地址*/
			get_town: function (area_code) {
				var _this = this;
				var request_data = {}
				var url = '/wsy_rebate/api/index.php?m=position&a=get_child_area';
				if(_this.special_address != ''){
					url = '/wsy_pub/api/index.php?m=position&a=get_child_area';
				}
				request_data = {
					area_code: area_code
				}
				_this.$common.requestData({
					url: url, 
					data: request_data, 
					method: "POST", 
					needToken: true
				}).then(res => {
					_this.townName = '请选择镇区',
					_this.town = res.data,
					_this.townInfoCallback(res.data)
				})
			},
			/*获取国家列表*/
			get_country: function () {
				var _this = this;
				_this.$api.wsypubGetNationList({}).then(res=>{
				   if(res.errcode==0){
						var countryList = [];
						var abbreviationList = [];
						res.data.forEach(function(item){
							countryList.push(item.nation);
							abbreviationList.push(item.abbreviation);
						})
						_this.countryList = countryList;
						_this.abbreviationList = abbreviationList;
				   }
				})
			},
			bind_sec_data_change: function (e) {
				var that = this;
				var index = e.detail.value;
				that.country = that.countryList[index];
				that.abbreviation = that.abbreviationList[index];
				that.areaSelectedStr = '';
				that.special = that.special_address//8/7
			},
				
			
		},
		
		
	}
</script>

<style lang="scss">
	page{background-color: #f5f5f5}
	.phone-picker image{margin-left: 42px}
	.color-ccc{color: #ccc}
	.weui-select{border-right: none;padding-left: 0;padding-top: 2rpx}
	.pickerBox{position: relative}
	.selectCountry{position: absolute;right: 70rpx;}
	.picker_tel{position: relative}
	.jt-down{width: 30rpx;height:30rpx;position: absolute;top: 16rpx;}
	.container{
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  flex-direction: column;
	}
	.form-box {
	  margin-top: 20rpx;
	  padding: 0 30rpx;
	  background-color: #fff
	}
	.form-box .row:last-child{
	  border: none
	}
	.form-box .row {
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  padding: 20rpx 0;
	  border-bottom: solid 2rpx #e5e5e5;
	  font-size: 32rpx;
	  align-items: center;
	}
	
	.form-box .label {
	  min-width: 160rpx;
	  -webkit-box-flex: none;
	  -webkit-flex: none;
	  flex: none;
	  line-height: 60rpx;
	  margin-right: 10rpx;
	  color: #333;
	}
	.form-box .label_tel{
	  min-width: 140rpx;
	  -webkit-box-flex: none;
	  -webkit-flex: none;
	  flex: none;
	  line-height: 60rpx;
	  margin-right: 10rpx;
	  color: #333;
	  border-right: 2rpx solid #f0f0f0
	}
	.area_right{
	  width: 30rpx;height: 30rpx
	}
	.weui-select {
	  position: relative;
	  height: 60rpx;
	  min-height: 60rpx;
	  line-height: 60rpx;
	  padding-left:0;
	  padding-right:0;
	  border-right:none;
	}
	/* 下箭头 */
	.weui-select:before{content:" ";display:inline-block;height:6px;width:6px;border-width:0 4rpx 4rpx 0;border-color:#c8c8cd;border-style:solid;-webkit-transform:matrix(0.71, 0.71, -0.71, 0.71, 0, 0);transform:matrix(0.71, 0.71, -0.71, 0.71, 0, 0);top:-2px;position:absolute;top:50%;right:15px;margin-top:-4px}
	
	.form-box .input-box {
	  width: 50%;
	  -webkit-box-flex: auto;
	  -webkit-flex: auto;
	  flex: auto;
	}
	
	.form-box .input-box input {
	  display: block;
	  width: 100%;
	  height: 60rpx;
	  outline: none;
	  font-size: 32rpx;
	  color: #5d5d5d;
	}
	
	.footer{
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  font-size: 32rpx;
	  color: #333;
	  align-items: center; 
	  background-color: #fff;
	  margin-top: 20rpx;
	  height: 94rpx;
	  padding: 0 30rpx;
	}
	.footer-left{
	  width: 50%;
	  -webkit-box-flex: 1;
	  -webkit-flex: 1;
	  flex: 1;
	}
	.btn{
	  padding: 60rpx 30rpx;
	  width: 100%;
	  text-align: center;
	  height: 37px;
	  line-height: 37px;
	  font-size: 18px
	}
	.btn-button{
	  color: #fff;
	  background-color: #8993f0;
	  border-radius: 50rpx
	}
	.btn-button-opacity{
		opacity: 0.5;
	}
	/*swtich样式-start*/
	/*swtich整体大小*/
	.wx-switch-input{width:88rpx !important;height:49rpx !important;}
	/*白色样式（false的样式）*/
	.wx-switch-input::before{width:86rpx !important;height: 46rpx !important;}
	/*绿色样式（true的样式）*/
	.wx-switch-input::after{width: 43rpx !important;height: 43rpx !important;}
	/*swtich样式end*/
	
	
	
	/*弹窗主体*/
	.modal-content {
		position: fixed;
		bottom: -606rpx;
		left: 0;
		width: 100%;
		height: 606rpx;
		margin-top: 5px;
		background: #fff;
		z-index: 999;
	}
	
	/*遮罩层*/
	.modal-mask {
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background: rgba(0,0,0,0.6);
	    z-index: 99;
	}
	
	/*弹窗头部*/
	.modal-header {
		padding: 4px 10px;
		font-size: 16px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		line-height: 30px;
	}
	.modal-header-cancle{color: #AEAEAE}
	.modal-header-sure{color: #8993f0}
	
	.modal-body {
		font-size: 14px;
	}
	
	/*每级地区标题*/
	.viewpager-title {
		padding: 13px 10px;
		line-height: 90rpx;
	  position: relative;
	  font-size: 28rpx;
	  color: #333333
	}
	
	/*分隔线*/
	.viewpager-divider {
		width: 100%;
		height: 1px;
		background: #ccc;
	}
	
	/*左右滑动控件*/
	.swiper-area {
		height:220px;
	}
	
	/*地址列表ListView容器*/
	.viewpager-listview {
		height: 100%;
	}
	
	/*每行地址item项*/
	.viewpager-content{
	  font-size: 32rpx;
	  color: #333333;
	  border-bottom: 1px solid #e5e5e5;
	  padding: 20rpx 30rpx;
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  align-items: center
	}
	.viewpager-content-left{
	  width: 50%;
	  -webkit-box-flex: 1;
	  -webkit-flex: 1;
	  flex: 1;
	}
	/*高亮当前所选地区*/
	.area-selected {
		color: #8993f0;
	}
	.area-selectedLine{
	  color: #8993f0;
	}
	.area-selectedLine:after{
	  content: '';
	  width: 30rpx;
	  height: 4rpx;
	  border-radius: 10rpx;
	  position: absolute;
	  background-color: #8993f0;
	  bottom: 0;
	  left: 50%;
	  margin-left: -15rpx
	}
	
	/*初始隐藏*/
	.hidden {
		display: none;
	}
	
	/*运行时显示*/
	.show {
		display: block;
	}
	
	/*请选择区域*/
	.region {
		width: 90%;
	}
	::-webkit-scrollbar{
	width: 0;
	height: 0;
	color: transparent;
	}

</style>
