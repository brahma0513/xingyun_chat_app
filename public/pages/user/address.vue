<template>
	<view>
		<u-modal :show="modal_show" :title="modal_title" :content="modal_content" @confirm="modal_confirm" :showCancelButton="true" @cancel="modal_show=false"></u-modal>

		<view :class="['container', haveAddress?'havaAddress':'']">
			<!-- 没有地址start -->
			<view v-if="!haveAddress" :class="haveAddress?'havaAddress':''" :style="'height:'+_height+'px'">
				<view class='bigPic'>
					<image class='img' :src="vuex_apiUrl+'/HTML/images/shop/images/shou_address.png'"></image>
					<view class='noAddress_text'>还没有收货地址</view>
				</view>
				<view :class="['noAddres_btn', 'noAddres_newAddress', 'skin-bg-'+theme]" @click='goto_udpateAddress()'>新建地址</view>
			</view>
			<!-- 没有地址end -->
			<!-- 有地址start -->
			<view v-else :class="!haveAddress?'havaAddress':''" :style="'height:'+_height+'px'">
				<block v-for="(item,index) in addressList">
					<view class="addresslist">
						<!-- 地址start -->
						<view class="person-infor">
							<view class='person-infor-left' @click="selsect_address()" :data-address-id="item.id">
								<view class='person-infor-left-text'>{{item.username}}  {{item.phone}}</view>
								<view class="person-infor-left-text address">{{ item.province }}{{ item.city }}{{ item.area }}{{ item.street }}{{item.diy_area}}{{ item.address }}</view>
							</view>
						</view>
						<!-- 地址end -->
						<view class="addressSetting">
							<view class="check-box" @click="change_default_address($event)" :data-index='index'>
								<view :class="['check_icon', item.is_default == 1?'active skin-bg-'+theme:'']" @click='check_active($event)' :data-index='index' :data-id='item.id' >
									<image v-if="item.is_default == 1" class='dagou' :src="vuex_apiUrl+'/HTML/images/shop/images/icon_gou.png'"></image>
								</view>
								设为默认地址
							</view>
							<view class='addressSetting_right'  @click="exit($event)" :data-index='index' :data-id='item.id' :data-item="item">
								<text class="ensp" space="ensp">编辑  </text>     
							</view>             
							<view class='addressSetting_right' @click='del($event)' :data-index='index' :data-id='item.id'>
								删除
							</view>
						</view>
					</view>
				</block>
				<view style='height:120rpx'></view>
				<view class='footer'>
					<view :class="['footer_right', 'Addres_newAddress', 'skin-bg-'+theme]" @click='goto_udpateAddress()'>新建地址</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: getApp().globalData.style_color,
				theme_color: this.$common.get_color(getApp().globalData.style_color),
				http_host: this.vuex_apiUrl,
				special_address: '',//8/7判断是否为京东地址
				haveAddress: false,
				_height: 0,
				addressList: [],
				//从哪个页面跳转过来1:下单页面2：个人中心
				a_type: 2,
				
				key_addr_id: 0,
				key_addr_index: 0,
				modal_show: false,
				modal_title: "提示",
				modal_content: "",
				model_type: '',
			}
		},
		onLoad(e) {
			var that = this;
			if(that.vuex_user.user_id<=0){
				var back_route = '/public/pages/user/address';
				uni.redirectTo({
					url: '/public/pages/user/login?back_route='+back_route
				})
				return false;
			}
			var a_type = uni.getStorageSync('a_type')
			// 8/7
			var special_address = uni.getStorageSync('special_address')//8/7
			if (special_address) {
				this.special_address = special_address
			}
			// 8/7end
			
			if(a_type){
				this.a_type = a_type
			}else{
				uni.setStorageSync('a_type', this.a_type);
			}
			
			that.detail = e.detail
			that.type = e.type
			that.cardID = e.cardID
			that.createtime = e.createtime
			
			this._height = uni.getSystemInfoSync().windowHeight
		},
		onShow: function() {
			const _this = this;
			_this.get_address();
		},
		methods: {			
			change_default_address: function(e) {
				var that = this;
				var index = e.currentTarget.dataset.index;
				console.log(index)
				//把列表所有的_default都设置成false
				for (var i in that.addressList) {
					var _default = 'addressList.[' + i + ']._default'
					// 8/7
					if (that.addressList[i].special_address == that.special_address) {
						that.addressList[i]._default = false
					}
					// 8/7end
				}
				var this_default = 'addressList.[' + index + ']._default'
				that.addressList[index]._default = true
			},
			exit: function(e) {
				var that = this;
				var id = e.currentTarget.dataset.id;
				// 8/7
				var item=e.currentTarget.dataset.item;
				
				var a_type = this.a_type;
				if (a_type == 1) { // 1：确认订单跳转过来，直接跳回订单页面
					uni.navigateTo({
						url: '/public/pages/user/updateAddress?id=' + id+'&special_address='+item.special_address,
					})
				} else if (that.detail) {
					uni.navigateTo({
						url: '/public/pages/user/updateAddress?id=' + id + '&detail=true&type=' + that.type + '&cardID=' + that.cardID + '&createtime=' + that.createtime+'&special_address='+item.special_address,
					})
				}else {
					uni.navigateTo({
						url: '/public/pages/user/updateAddress?id=' + id+'&special_address='+item.special_address,
					})
				}
			},
			selsect_address: function(res) {
				var that = this;
				var address_id = parseInt(res.currentTarget.dataset.addressId);
				if (address_id > 0) {
					uni.setStorageSync('aid', address_id);
					if (that.a_type == 1) { // 1：确认订单跳转过来，直接跳回订单页面
						uni.navigateBack({
							delta: 1
						})
					} else if (that.detail) {
						uni.navigateTo({
							url: '../../giftcard/pages/mine/giftCardDetail?type=' + that.type + '&id=' + that.cardID + '&createtime=' + that.createtime + '&addressID=' + address_id+'&special_address='+that.special_address,
						})
					}else{
						uni.navigateBack({
							delta: 1
						})
					}
				} 
			},
			goto_udpateAddress:function(){
			  var that = this;
			  if (that.detail) { //判断是否从礼品卡详情进来的
				  uni.navigateTo({
					  url: '/public/pages/user/updateAddress?detail=true&type=' + that.type + '&cardID=' + that.cardID + '&createtime=' + that.createtime +'&status=1&special_address='+that.special_address,
				  })
			  }else{
				  uni.navigateTo({
					  url: '/public/pages/user/updateAddress?status=1&special_address='+that.special_address,
				  })
			  }
			},
			  
			//获取地址列表
			get_address: function () {
				var _this = this;
				var url = ''
				var _data = {};
				var request_data = {};
				if (_this.a_type == 2) {
					request_data = {
						is_manage: 1
					}
					url = '/wsy_user/web/index.php?m=set&a=ajax_address_get'
				} else {
					request_data = {
						user_id: _this.vuex_user.user_id,
						special_address: _this.special_address//8/7添加
					}
					url = '/wsy_user/api/index.php?m=user&a=user_address'
				}
			  
			  
				_this.$common.requestData({
					url: url, 
					data: request_data, 
					method: "POST", 
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						if (_this.a_type == 2) {
						  var data = res.data.list;
						} else {
						  var data = res.data;
						}

						if (data.length == 1 && data[0].is_default == 0) {
							data[0].is_default = true;
							if (_this.a_type == 2) {
							  var address_id = parseInt(res.data.list[0].id);
							} else {
							  var address_id = parseInt(res.data[0].id);
							}
					
							var request_data = {};
							request_data = {
								id: address_id,
								op: 'default'
							}
							
							_this.$common.requestData({
								url: '/wsy_user/web/index.php?m=set&a=address_state', 
								data: request_data, 
								method: "POST", 
								needToken: true
							}).then(res2 => {})
						}
						if (data.length > 0) {
							if (_this.a_type == 2) {
								_this.addressList = res.data.list
								_this.haveAddress = true
							}
						} else {
							_this.addressList = res.data
							_this.haveAddress = true
						}
					}
				});
			},
			
			del: function(e) {
				var _this = this;
				var id = e.currentTarget.dataset.id;
				var index = e.currentTarget.dataset.index;
				var addressList = _this.addressList;
				var _data = {};
				var request_data = {};

				_this.key_addr_id    = e.currentTarget.dataset.id;
				_this.key_addr_index = e.currentTarget.dataset.index;
				_this.model_type = 'delAddress'
				_this.modal_show = true;
				_this.modal_title = "删除收货地址";
				_this.modal_content = "确定删除收货地址吗？";
				return;
			},
			modal_confirm(){
				var _this = this;
				_this.modal_show = false;
				var addressList = _this.addressList;
				var request_data = {
					id: _this.key_addr_id,
					op: 'delete'
				}
				_this.$api.wsyuserAddressState(request_data).then(res=>{
					if (res.errcode == 0) {
						//删除地址
						addressList.splice(_this.key_addr_index, 1);
						if (addressList.length < 1) {
							_this.haveAddress = false
						}
						_this.addressList = addressList
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
			//单选切换
			check_active: function (e) {
				var _this = this;
				var id = e.currentTarget.dataset.id;
				var index = e.currentTarget.dataset.index;
				var addressList = _this.addressList;
				var _data = {};
				var request_data = {};
				request_data = {
				  id: id,
				  op: 'default'
				}

				_this.$api.wsyuserAddressState(request_data).then(res=>{
					if (res.errcode == 0) {
						for (var i in _this.addressList) {
							var addressList = 'addressList[' + i + '].is_default'
							if (_this.addressList[i].id == id ){
								_this.addressList[i].is_default = 1
							}else{ 
								_this.addressList[i].is_default = 0
							}
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
			//单击跳转页面
			check_index: function (id) {
				var _this = this;
				var id = id;
				var _data = {};
				var request_data = {};
				request_data = {
				  id: id,
				  op: 'default'
				}

				_this.$api.wsyuserAddressState(request_data).then(res=>{
					wx.navigateBack({
											  delta: 1
					})
				})
			},
		},
		
		
	}
</script>

<style lang="scss">
	.container{
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  flex-direction: column;
	}
	.havaAddress{background-color: #f5f5f5;width: 100%}
	/* 没有地址start */
	.bigPic{margin: 330rpx auto 330rpx auto}
	.bigPic .img{display: block;margin: 0 auto;width: 112rpx;height:149rpx }
	.noAddress_text{padding-top: 60rpx;font-size: 26rpx;color: #cccccc;text-align: center}
	.noAddres_btn{line-height: 37px;height: 37px;width: 92%;text-align: center;margin: 0 auto;border-radius: 50rpx;font-size: 18px;}
	.noAddres_newAddress{background: #7f8aef;color: #fff;margin-bottom: 30rpx}
	.noAddres_wechatAddress{background: #fff;color: #5d5d5d;border: 2rpx solid #d8d8d8}
	/* 没有地址end */
	
	/* 有地址start */
	.addresslist{margin-top: 20rpx}
	.person-infor{
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
		background-color: #FFF;
		padding: 30rpx 30rpx 20rpx 30rpx;
		font-size: 32rpx;
	  align-items: center;
	  border-bottom: 2rpx solid #e5e5e5
	}
	.person-infor-left{
	  -webkit-box-flex: 1;
	  -webkit-flex: 1;
	  flex: 1;
	  width: 50%;
	}
	.person-infor .person-infor-left-text{
	  font-size:32rpx;
	  color:#333333;
	}
	.person-infor .address{
	  font-size:28rpx;
	  color: #5d5d5d;
	  display: -webkit-box; 
		-webkit-line-clamp: 2; 
		-webkit-box-orient: vertical; 
		overflow: hidden;
	}
	.person-infor-right{
	  width: 28rpx;
	  height: 28rpx;
	}
	.addressSetting{
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
		background-color: #FFF;
	  padding: 15rpx 30rpx;
	  align-items: center;
	}
	.addressSetting .check-box{
		-webkit-box-flex: 1;
	  -webkit-flex: 1;
	  flex: 1;
	  width: 50%;
		font-size: 28rpx;
	  color: #333333
	}
	.addressSetting .check-box .check_icon{
		display: inline-block;
		vertical-align: middle;
		width: 50rpx;
		height: 50rpx;
		border: solid 2rpx #c9c9c9;
		border-radius: 50%;
		margin-right: 20rpx;
		background-color: #FFF;
		box-sizing: border-box;
	  position: relative;
	  margin-bottom:6rpx;
	}
	.addressSetting .check-box .check_icon.active{
		background-color: #7f8aef;
		border: none;
	}
	.addressSetting .check-box .check_icon .dagou{
	  position:absolute;
	  width:35rpx;
	  height:25rpx;
	  left:9rpx;
	  top:15rpx;
	}
	.addressSetting_right{
	  font-size: 28rpx;
	  color: #333333
	}
	.ensp{
	    padding-right: 28px;
	    display: inline-block
	}
	.footer{
	  width: 100%;
		background-color: #FFF;
	  padding: 20rpx 15rpx;
	  text-align: center;
	  position: fixed;
	  bottom: 0;
	}
	.footer_left,.footer_right{
	  display: inline-block;
	  width: 45%;
	  font-size: 32rpx;
	  height: 80rpx;
	  line-height: 80rpx;
	  border-radius: 50rpx;
	  margin: 0 15rpx
	} 
	.Addres_newAddress{background: #7f8aef;color: #fff;}
	.Addres_wechatAddress{background: #fff;color: #5d5d5d;border: 2rpx solid #d8d8d8}
	.margin-bottom-100{margin-bottom: 200rpx}
</style>
