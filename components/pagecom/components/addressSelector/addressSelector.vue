<template>
	<!-- 地址选择器 -->
	<view class="modal">
		<view :class="['modal-mask', maskVisual]" @click="cascadeDismiss()"></view>
		<view :animation="animationData" class="modal-content">
		  <view class="modal-header">
			<view class='modal-header-cancle' @click="cascadeDismiss()">取消</view>
			<block v-if="hasNation">
			  <view class="input-box">
				<picker bindchange="bind_sec_data_change" :range="countryList" :value="nation_ind">
					<view class="weui-select pickerBox"><text class='selectCountry'>{{country}}</text></view>
				</picker>
			  </view>
			</block>
			<view :class="['modal-header-sure', 'skin-color-'+theme]" @click='areaSure()'>确定</view>
		  </view>
		  <view class="modal-body">
			<text :class="['viewpager-title', current == 0 ? 'area-selectedLine skin-color-'+theme+' skin-bg-after-'+theme : '']" @click="changeCurrent($event)" :data-current="0">{{provinceName}}</text>
			<text :class="['viewpager-title', current == 1 ? 'area-selectedLine skin-color-'+theme+' skin-bg-after-'+theme : '']" @click="changeCurrent($event)" :data-current="1">{{cityName}}</text>
			<text :class="['viewpager-title', current == 2 ? 'area-selectedLine skin-color-'+theme+' skin-bg-after-'+theme : '']" @click="changeCurrent($event)" :data-current="2">{{regionName}}</text>
			<text v-if="haveStree" :class="['viewpager-title', current == 3 ? 'area-selectedLine skin-color-'+theme+' skin-bg-after-'+theme : '']" @click="changeCurrent($event)" :data-current="3">{{townName}}</text>
			<text v-if="!haveStree&&diy" :class="['viewpager-title', current == 3 ? 'area-selectedLine skin-color-'+theme+' skin-bg-after-'+theme : '']" @click="changeCurrent($event)" :data-current="3">{{diyName}}</text>
			<text v-else :class="['viewpager-title', current == 4 ? 'area-selectedLine skin-color-'+theme+' skin-bg-after-'+theme : '']" @click="changeCurrent($event)" :data-current="4">{{diyName}}</text>
			<view class="viewpager-divider"></view>
			<swiper class="swiper-area" :current="current" bindchange="currentChanged">
			  <block v-if="province.length > 0">
				<swiper-item>
				  <scroll-view scroll-y="true" class="viewpager-listview">
					<view class='viewpager-content' v-for="(item,index) in province" :data-index="index" @click="provinceTapped($event)">
					  <view class='viewpager-content-left'>
						<text v-if="index == provinceIndex" :class="['area-selected', 'skin-color-'+theme]">{{item.area_name}}</text>
						<text v-else>{{item.area_name}}</text>
					  </view>
					  <icon v-if="index == provinceIndex" class='check skin-color' type="success_no_circle" :color='theme_color' size="16"></icon>
					</view>
				  </scroll-view>
				</swiper-item>
			  </block>
			  <block v-if="city.length > 0">
				<swiper-item>
				  <scroll-view scroll-y="true" class="viewpager-listview">
					<view class='viewpager-content' v-for="(item,index) in city" :data-index="index" @click="cityTapped($event)">
					  <view class='viewpager-content-left'>
						<text v-if="index == cityIndex" :class="['area-selected', 'skin-color-'+theme]">{{item.area_name}}</text>
						<text v-else>{{item.area_name}}</text>
					  </view>
					  <icon v-if="index == cityIndex" class='check skin-color' type="success_no_circle" :color='theme_color' size="16"></icon>
					</view>
				  </scroll-view>
				</swiper-item>
			  </block>
			  <block v-if="region.length > 0">
				<swiper-item>
				  <scroll-view scroll-y="true" class="viewpager-listview">
					<view class='viewpager-content' v-for="(item,index) in region" :data-index="index" @click="regionTapped($event)">
					  <view class='viewpager-content-left'>
						<text v-if="index == regionIndex" :class="['area-selected', 'skin-color-'+theme]">{{item.area_name}}</text>
						<text v-else>{{item.area_name}}</text>
					  </view>
					  <icon v-if="index == regionIndex" class='check skin-color' type="success_no_circle" :color='theme_color' size="16"></icon>
					</view>
				  </scroll-view>
				</swiper-item>
			  </block>
			  <block v-if="town.length > 0">
				<swiper-item>
				  <scroll-view scroll-y="true" class="viewpager-listview">
					<view class='viewpager-content' v-for="(item,index) in town" :data-index="index" @click="townTapped($event)">
					  <view class='viewpager-content-left'>
						<text v-if="index == townIndex" :class="['area-selected', 'skin-color-'+theme]">{{item.area_name}}</text>
						<text v-else>{{item.area_name}}</text>
					  </view>
					  <icon v-if="index == townIndex" class='check skin-color' type="success_no_circle" :color='theme_color' size="16"></icon>
					</view>
				  </scroll-view>
				</swiper-item>
			  </block>
			  <block v-if="diy.length > 0">
				<swiper-item>
				  <scroll-view scroll-y="true" class="viewpager-listview">
					<view class='viewpager-content' v-for="(item,index) in diy" :data-index="index" @click="diyTapped($event)">
					  <view class='viewpager-content-left'>
						<text v-if="index == diyIndex" :class="['area-selected', 'skin-color-'+theme]">{{item.area_name}}</text>
						<text v-else>{{item.area_name}}</text>
					  </view>
					  <icon v-if="index == diyIndex" class='check skin-color' type="success_no_circle" :color='theme_color' size="16"></icon>
					</view>
				  </scroll-view>
				</swiper-item>
			  </block>
			</swiper>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"addressSelector",
		props:{
			// 父组件传值
			haveCity: {//haveCity是否需要市区，默认true
				type: Boolean,
				default: true,
			},
			haveStree: {//haveStree是否需要街道,默认true
			  type: Boolean,
			  default: true,
			},
			isDiy: {//isDiy是否需要自定义字段,默认false
			  type: Boolean,
			  default: false,
			},
			abbreviation: {//abbreviation国家地区的缩写,默认为空，空则代表中国
			  type:String,
			  default:'zh_cn'
			},
			special: {//判断是否为京东商品8/7
			  type: String, 
			  default: ''
			},
			hasNation: {//hasNation是否需要国家，默认false
				type: Boolean,
				default: false
			},
			country: {//country所选国家名,默认为中国
				type:String,
				default:'中国'
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				theme_color: this.$common.get_color(getApp().globalData.style_color),
				http_host: this.vuex_apiUrl,
				
				current: 0,
				province: [],
				city: [],
				region: [],
				town: [],
				diy:[],
				province_code:'',
				city_code:'',
				area_code:'',
				street_code: '',
				diy_code:'',
				areaSelectedStr: "",
				maskVisual: 'hidden',
				provinceName: '请选择省份',
				countryList: [], // 国家名字列表
				abbreviationList: [], // 国家编号列表
				animationData: '',
				
				cityName: '',
				regionName: '',
				townName: '',
				diyName: '',
			};
		},
		created(){
			
		},
		methods:{
			/*获取国家列表*/
			get_country: function () {
				var _that = this;
				
				_that.$api.wsypubGetNationList({}).then(res=>{
				   if(res.errcode==0){
						var countryList = [];
						var abbreviationList = [];
						res.data.forEach(function(item,index){
						   if(item.abbreviation == _that.abbreviation){
								_that.nation_ind = index
						   }
						   countryList.push(item.nation);
						   abbreviationList.push(item.abbreviation);
						})
						_that.countryList = countryList
						_that.abbreviationList = abbreviationList
				   }
				})
			},
			// 选择国家弹窗回调
			bind_sec_data_change: function (e) {
				var that = this;
				var index = e.detail.value;
				that.country = that.countryList[index],
				that.abbreviation = that.abbreviationList[index],
				that.get_area_info();
				that.provinceName = '请选择省份'
				that.province_code = ''
				that.cityName = ''
				that.regionName = ''
				that.townName = ''
				that.diyName = ''
				that.provinceIndex = -1
				that.cityIndex = -1
				that.regionIndex = -1
				that.townIndex = -1
				that.diyIndex = -1
				that.city =[]
				that.region = []
				that.town = []
				that.diy = []
				that.current = 0
			},
			// 初始化数据
			cascadePopup: function () {
				var _that = this;
				var animation = uni.createAnimation({
					duration: 500,
					timingFunction: 'ease-in-out',
				});
				_that.animation = animation;
				animation.translateY(-303).step();
				_that.animationData = _that.animation.export(),
				_that.maskVisual = 'show'
				if(_that.hasNation){
					_that.get_country();
				}
				_that.get_area_info();
				_that.provinceName = '请选择省份'
				_that.province_code = ''
				_that.cityName = ''
				_that.regionName = ''
				_that.townName = ''
				_that.diyName = ''
				_that.provinceIndex = -1
				_that.cityIndex = -1
				_that.regionIndex = -1
				_that.townIndex = -1
				_that.diyIndex = -1
				_that.city = []
				_that.region = []
				_that.town = []
				_that.diy = []
				_that.current = 0
			},
			cascadeDismiss: function () {
				var _that = this;
				_that.animation.translateY(303).step();
				_that.animationData = _that.animation.export(),
				_that.maskVisual = 'hidden'
			    this.$emit("myevent", _that.address)
				//_that.triggerEvent('myevent', _that.address) //myevent自定义名称事件，父组件中使用
			},
			provinceTapped: function (e) {
				var _that = this;
				var index = e.currentTarget.dataset.index;
			  // current为1，使得页面向左滑动一页至市级列表
			  // provinceIndex是市区数据的标识
				_that.provinceName = _that.province[index].area_name
				_that.province_code = _that.province[index].area_code
				_that.regionName = ''
				_that.townName = ''
				_that.diyName =''
				_that.provinceIndex = index
				_that.cityIndex = -1
				_that.regionIndex = -1
				_that.townIndex = -1
				_that.diyIndex = -1
				_that.region = []
				_that.town = []
				_that.diy = []
				_that.cityName = '请选择城市',
				_that.city = _that.province[index].child
				// 确保生成了数组数据再移动swiper
				_that.current = 1
			},
			cityTapped: function (e) {
				var _that = this;
				var index = e.currentTarget.dataset.index;
			  // current为1，使得页面向左滑动一页至市级列表
			  // cityIndex是市区数据的标识
			    _that.cityIndex = index
				_that.regionIndex = -1
				_that.townIndex = -1
				_that.diyIndex = -1
				_that.cityName = _that.city[index].area_name
				_that.city_code = _that.city[index].area_code
				_that.regionName = ''
				_that.townName = ''
				_that.diyName = ''
				_that.town = []
				_that.diy = []
			  if(!_that.haveCity){
				var areaSelectedStr = _that.provinceName + ' ' + _that.cityName;
				var address = {
					areaSelectedStr: areaSelectedStr,
					provinceName: _that.provinceName,
					cityName: _that.cityName,
					province_code: _that.province_code,
					city_code: _that.city_code,
				}
				_that.address = address
				_that.cascadeDismiss();
			  }else{
				if (_that.city[index].child.length>0){
					_that.regionName = '请选择地区',
					_that.region = _that.city[index].child
				}else{
				  var areaSelectedStr = _that.provinceName + _that.cityName;
				  _that.areaSelectedStr = areaSelectedStr
				  _that.cascadeDismiss();
				  return false
				}
				
				// 确保生成了数组数据再移动swiper
				_that.current = 2
			  }
			},
			regionTapped: function (e) {
				var _that = this
				var index = e.currentTarget.dataset.index;
				var url = '/wsy_rebate/api/index.php?m=regional&a=get_child_area';
				if(_that.special != ''){
					url = '/wsy_pub/api/index.php?m=regional&a=get_child_area';
				}
			  // current为1，使得页面向左滑动一页至市级列表
			  // regionIndex是县级数据的标识
				_that.regionIndex = index
				_that.townIndex = -1
				_that.diyIndex = -1
				_that.regionName = _that.region[index].area_name
				_that.area_code = _that.region[index].area_code
				_that.townName = ''
				_that.diyName = ''
				_that.diy = []
				if (!_that.haveStree && !_that.isDiy) {//设置了没有街道的时候并且没有自定义字段
					var areaSelectedStr = _that.provinceName + ' ' + _that.cityName + ' ' + _that.regionName;
					var address = {
						areaSelectedStr: areaSelectedStr,
						provinceName: _that.provinceName,
						cityName: _that.cityName,
						regionName: _that.regionName,
						province_code: _that.province_code,
						city_code: _that.city_code,
						area_code: _that.area_code
					}
					_that.address = address
					_that.cascadeDismiss();
				} else if (!_that.haveStree && _that.isDiy) {//设置了没有街道的时候并且有自定义字段
					var area_code = _that.region[index].area_code
					
					_that.$common.requestData({
						url: url, 
						data: { 
								area_code: area_code, 
								hide_street: 1, 
								hide_diy: 0,
								country: _that.abbreviation
							}, 
						method: "POST", 
						needToken: true
					}).then(res => {
						if (res.data.length > 0) {
							_that.diyName = '请选择自定义'
							_that.diy = res.data
							// 确保生成了数组数据再移动swiper
							_that.current = 3
						}else{
							var areaSelectedStr = _that.provinceName + ' ' + _that.cityName + ' ' + _that.regionName;
							var address = {
								areaSelectedStr: areaSelectedStr,
								provinceName: _that.provinceName,
								cityName: _that.cityName,
								regionName: _that.regionName,
								province_code: _that.province_code,
								city_code: _that.city_code,
								area_code: _that.area_code
							}
							_that.address = address
							_that.cascadeDismiss();
						}
					});
				} else {//设置有街道
					var area_code = _that.region[index].area_code
					
					_that.$common.requestData({
						url: url, 
						data: {
								area_code: area_code, 
								hide_street: 0,
								hide_diy: 0,
								country: _that.abbreviation
							}, 
						method: "POST", 
						needToken: true
					}).then(res => {
						if (res.data.length > 0) {
							_that.townName = '请选择街道',
							_that.town = res.data
							// 确保生成了数组数据再移动swiper
							_that.current = 3
						} else {
							if (!_that.isDiy){//有街道但是街道没数据,并且自定义设置为false
								var areaSelectedStr = _that.provinceName + ' ' + _that.cityName + ' ' + _that.regionName;
								var address = {
									areaSelectedStr: areaSelectedStr,
									provinceName: _that.provinceName,
									cityName: _that.cityName,
									regionName: _that.regionName,
									province_code: _that.province_code,
									city_code: _that.city_code,
									area_code: _that.area_code
								}
								_that.address = address
								_that.cascadeDismiss();
							} else {//有街道但是街道没数据,并且自定义设置为true
								var area_code = _that.region[_that.regionIndex].area_code
								
								_that.$common.requestData({
									url: url, 
									data: {
											area_code: area_code,
											hide_street: 0,
											hide_diy: 0,
											country: _that.abbreviation
										}, 
									method: "POST", 
									needToken: true
								}).then(res => {
									if (res.data.length > 0) {
										_that.setData({
											diyName: '请选择自定义',
											diy: res.data
										})
										// 确保生成了数组数据再移动swiper
										_that.setData({
											current: 4
										});
									}else{
										var areaSelectedStr = _that.provinceName + ' ' + _that.cityName + ' ' + _that.regionName;
										var address = {
											areaSelectedStr: areaSelectedStr,
											provinceName: _that.provinceName,
											cityName: _that.cityName,
											regionName: _that.regionName,
											province_code: _that.province_code,
											city_code: _that.city_code,
											area_code: _that.area_code
										}
										_that.setData({
											address: address
										});
										_that.cascadeDismiss();
									}
								})
							}
						}
					})
				}
			},
			townTapped: function (e) {
				var _that = this;
				var index = e.currentTarget.dataset.index;
				var url = '/wsy_rebate/api/index.php?m=regional&a=get_child_area';
				if(_that.special != ''){
					url = '/wsy_pub/api/index.php?m=regional&a=get_child_area';
				}
				// townIndex是镇级数据的标识
				_that.townIndex = index
				_that.diyIndex = -1
				_that.townName = _that.town[index].area_name
				_that.street_code = _that.town[index].area_code
				_that.diyName = ''
				_that.diy = []
				if (!_that.isDiy){
					var areaSelectedStr = _that.provinceName + ' ' + _that.cityName + ' ' + _that.regionName + ' ' + _that.townName;
					var address = {
						areaSelectedStr: areaSelectedStr,
						provinceName: _that.provinceName,
						cityName: _that.cityName,
						regionName: _that.regionName,
						townName: _that.townName,
						province_code: _that.province_code,
						city_code: _that.city_code,
						area_code: _that.area_code,
						street_code: _that.street_code
					}
					_that.address = address
					_that.cascadeDismiss();
				}else{
					if (_that.town[index].is_diy==1){
						var areaSelectedStr = _that.provinceName + ' ' + _that.cityName + ' ' + _that.regionName + ' ' + _that.townName;
						var address = {
							areaSelectedStr: areaSelectedStr,
							provinceName: _that.provinceName,
							cityName: _that.cityName,
							regionName: _that.regionName,
							townName: _that.townName,
							province_code: _that.province_code,
							city_code: _that.city_code,
							area_code: _that.area_code,
							street_code: _that.street_code
						}
						_that.address = address
						_that.cascadeDismiss();
					}else{
						var area_code = _that.town[_that.townIndex].area_code
						
						_that.$common.requestData({
							url: url, 
							data: {
									area_code: area_code,
									hide_street: 0,
									hide_diy: 0,
									country: _that.abbreviation
								}, 
							method: "POST", 
							needToken: true
						}).then(res => {
							if (res.data.length > 0) {
								_that.diyName = '请选择自定义'
								_that.diy = res.data
								// 确保生成了数组数据再移动swiper
								_that.current = 4
							} else {
								var areaSelectedStr = _that.provinceName + ' ' + _that.cityName + ' ' + _that.regionName + ' ' + _that.townName;
								var address = {
									areaSelectedStr: areaSelectedStr,
									provinceName: _that.provinceName,
									cityName: _that.cityName,
									regionName: _that.regionName,
									townName: _that.townName,
									province_code: _that.province_code,
									city_code: _that.city_code,
									area_code: _that.area_code,
									street_code: _that.street_code
								}
								_that.address = address
								_that.cascadeDismiss();
							}
						})
					}
				}
			  
			},
			diyTapped:function(e){
				var _that = this;
				var index = e.currentTarget.dataset.index;
				// diyIndex是镇级数据的标识
				_that.setData({
					diyIndex: index,
					diyName: _that.diy[index].area_name,
					diy_code: _that.diy[index].area_code,
				});
				var areaSelectedStr = _that.provinceName + ' ' + _that.cityName + ' ' + _that.regionName + ' ' + _that.townName + ' '+_that.diyName;
				var address = {
					areaSelectedStr: areaSelectedStr,
					provinceName: _that.provinceName,
					cityName: _that.cityName,
					regionName: _that.regionName,
					townName: _that.townName,
					diyName: _that.diyName,
					province_code: _that.province_code,
					city_code: _that.city_code,
					area_code: _that.area_code,
					street_code: _that.street_code,
					diy_code: _that.diy_code
				}
				_that.address = address
				_that.cascadeDismiss();
			},
			currentChanged: function (e) {
				var _that = this;
			  // swiper滚动使得current值被动变化，用于高亮标记
			  var current = e.detail.current;
			  _that.current = current
			},
			changeCurrent: function (e) {
				var _that = this;
			  // 记录点击的标题所在的区级级别
			  var current = e.currentTarget.dataset.current;
			  _that.current = current
			},
			areaSure: function () {
				var _that = this;
				var areaSelectedStr = _that.provinceName +' '+ _that.cityName +' '+ _that.regionName +' '+ _that.townName;
			    _that.areaSelectedStr = areaSelectedStr;
				_that.provinceName = _that.provinceName;
				_that.cityName = _that.cityName;
				_that.regionName = _that.regionName;
				_that.townName = _that.townName;
				_that.province_code = _that.province_code;
				_that.city_code = _that.city_code;
				_that.area_code = _that.area_code;
				_that.street_code = _that.street_code;
				_that.cascadeDismiss();
			},
			//获取地区信息
			get_area_info: function () {
				var _that = this
				_that.$api.wsypubGetAreaInfo({ country: _that.abbreviation,special: _that.special }).then(res=>{
					if(res.errcode==0){
						_that.province = res.area_info
					}else{
						uni.showToast({
						  title: res.errmsg,
						  icon:'none',
						  duration:2000
						})
						_that.province = []
					}
				})
			  
			},
		},
			
	}
</script>

<style>
	@import '../../../componentSkin.css';
	/*弹窗主体*/
	.modal-content {
		position: fixed;
		bottom: -303px;
		left: 0;
		width: 100%;
		height: 303px;
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
	/* ::-webkit-scrollbar{
	width: 0;
	height: 0;
	color: transparent;
	} */
	/* 增加选择国家start */
	.input-box{
	  margin-left: 10px;
	  position: relative;
	  padding-right: 25px;
	  height: 28px;
	  border-radius: 14px;
	  line-height: 28px;
	  padding-left: 12px;
	  background-color: #F7F7F8;
	  font-size: 14px;
	  color: #343434;
	}
	.input-box::before {
	  content: " ";
	  display: inline-block;
	  height: 7px;
	  width: 7px;
	  border: 1px solid #999;
	  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	  position: absolute;
	  top: 50%;
	  right: 10px;
	  margin-top: -6px;
	  border-top: transparent;
	  border-left: transparent;
	}
	/* 增加选择国家end */
</style>
