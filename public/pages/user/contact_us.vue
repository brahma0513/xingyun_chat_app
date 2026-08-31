<template>
	<view class="callus">
		<u-notify ref="uNotify" message=""></u-notify>
		
		<view :class="'callus-head skin-bg-'+theme+''">
			<view class="flex justify-content-start align-items-center" style="margin-top: -30px;">
				<image :src="apiUrl+'/uniapp_template/web/static/images/call-icon.png'" mode="widthFix" class="head-icon"></image>
				<text class="margin-left20">{{$t('contact-us.page-title')}}</text>
			</view>
			
		</view>

		<view class="callus-main">
			<view class="call">
				<view class="left">
					<text v-if="name">{{$t('contact-us.contacts')}}：</text>
					<text v-if="tel">{{$t('contact-us.phone')}}：</text>
					<text v-if="email">{{$t('contact-us.mailbox')}}：</text>
					<text v-if="time">{{$t('contact-us.work-hours')}}：</text>
					<text v-if="address">{{$t('contact-us.address')}}：</text>
				</view>
				<view class="right">
					<text v-if="name">{{name}}</text>
					<text v-if="tel" @tap="call()">{{tel}}</text>
					<text v-if="email" >{{email}}</text>
					<text v-if="time" >{{time}}</text>
					<text v-if="address" >{{address}}</text>
				</view>
			</view>
			<!-- <view class="map">
				<view class="map-page">
					<map style="width: 100%; height: 150px;" :latitude="latitude" :longitude="longitude" :markers="covers">
					</map>
				</view>
			</view> -->
		</view>
		<view class="feedback">
			<text class="title1">{{$t('contact-us.welcome')}}</text>
			<text class="title2" @click="feedback">{{$t('contact-us.feedback')}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: 39.909,
				longitude: 116.39742,
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../../static/location.png'
				}, {
					latitude: 39.90,
					longitude: 116.39,
					iconPath: '../../../static/location.png'
				}],
				name:  '',
				tel :  '',
				email: '',
				time:  '',
				address: '',
				apiUrl: '',
				theme: getApp().globalData.style_color,
			}
		},
		onLoad(){
			this.apiUrl = this.vuex_apiUrl
			this.getKefu();
		},
		methods: {
			//查询信息
			getKefu(){
				var that = this;
				this.$api.getPhoneCall({}).then(res=>{
					if(res.errcode == 0){
						that.tel = res.data.tel
						that.name = res.data.name
						that.email = res.data.email
						that.time = res.data.time
						that.address = res.data.address
					}
				})
			},
			call() {
				
				var _this = this;
				
				//是否已经获取权限
				var class_phone_permission = uni.getStorageSync('class_phone_permission') || false;
				
				if(class_phone_permission==false){
					_this.$refs.uNotify.show({
						top: 0,
						type: 'warning',
						message: $t('contact-us.phone-auth'),
						duration: 3000,
						fontSize: 18,
						safeAreaInsetTop: false
					})
				}
				
				plus.android.requestPermissions(  
				["android.permission.CALL_PHONE"],  
				function(resultObj){
				    for (var i = 0; i < resultObj.granted.length; i++) {  
				        var grantedPermission = resultObj.granted[i];  
						uni.setStorageSync('class_phone_permission', true)
				        console.log('已获取的权限：'+ grantedPermission);  
				    }  
				    for (var i = 0; i < resultObj.deniedPresent.length; i++) {  
				        var deniedPresentPermission = resultObj.deniedPresent[i];  
				        console.log('拒绝本次申请的权限：'+ deniedPresentPermission );
						_this.modalShow = true
						uni.setStorageSync('class_phone_permission', false)
				    }  
				    for (var i = 0; i < resultObj.deniedAlways.length; i++) {  
				        var deniedAlwaysPermission = resultObj.deniedAlways[i];  
						_this.modalShow = true
						uni.setStorageSync('class_phone_permission', false)
				        console.log('永久拒绝申请的权限：'+ deniedAlwaysPermission);  
				    }  
				},  
				function(error){  
					uni.setStorageSync('class_phone_permission', false)
				    console.log('申请权限错误：'+ error.code+ " = "+ error.message);  
				}); 
				
				
				uni.makePhoneCall({
					phoneNumber: this.tel
				});
			},
			feedback(){
				uni.navigateTo({
					url: '/public/pages/user/feedback'
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#f5f5f5;
	}
	.callus{
		&-head{
			width:750rpx;
			height:160rpx;
			background-color:#fe3636;
			padding:100rpx 60rpx;
			text{
				font-size:40rpx;
				color:#ffffff;
			}
			.head-icon{
				width:80rpx;
				height:80rpx;
				margin-left:20rpx;
			}
		}
		&-main{
			width:700rpx;
			_height:520rpx;
			background-color:#ffffff;
			border-radius:20rpx;
			box-shadow: 2rpx 2rpx 20rpx #ccc;
			margin:-20rpx auto;
			padding:60rpx 40rpx;
			.call{
				display:flex;
				.left{
					flex:1;
					display:flex;
					flex-direction: column;
					align-items:flex-start;
					text{
						line-height:80rpx;
					}
				}
				.right{
					flex:2;
					display:flex;
					flex-direction: column;
					align-items:flex-start;
					text{
						line-height:80rpx;
					}
				}
			}
			.map{
				margin-top:40rpx;
			}
		}
		.feedback{
			margin-top:120rpx;
			text-align: center;
			font-size:24rpx;
			color:#666;
			.title2{
				color:#3ba9ff;
			}
		}
	}
</style>
