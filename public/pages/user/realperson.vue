<template>
	<view class="edit">
		
		<u-notify ref="uNotify" message=""></u-notify>
		<view class="edit-main">
			<view class="namedata">
				<view class="row-input">
					<text>真实姓名：</text>
					<u-input
					    placeholder="请输入姓名"
						maxlength="16"
						fontSize="14"
						inputAlign="right"
						clearable
					    border="bottom"
					    v-model="userRealForm.cert_name"
						:disabled="userRealForm.is_real_name"
					  ></u-input>
				</view>
				<view class="row-input">
					<text>身份证号：</text>
					<u-input
					    placeholder="请输入身份证号"
						maxlength="20"
						fontSize="14"
						inputAlign="right"
						clearable
					    border="bottom"
					    v-model="userRealForm.cert_no"
						:disabled="userRealForm.is_real_name"
					  ></u-input>
				</view>
			</view>
		</view>
		<view class="save-bottom">
			<view v-if='userRealForm.is_real_name==true' :class="'save-btn skin-bg-'+theme+''" style="opacity: 0.5;" >已实名</view>
			<view v-else :class="'save-btn skin-bg-'+theme+''" @click="saveData()">提交</view>
		</view>
	</view>
</template>

<script>
	const aliyunVerify = uni.requireNativePlugin('AP-FaceDetectModule');
	
	import permision from "../../../js_sdk/wa-permission/permission.js"
	import notify from "../../../uni_modules/uview-ui/components/u-notify/u-notify"
	export default {
		data() {
			return {
				http_host: '',
				theme: getApp().globalData.style_color,

				metaInfo: "",
				userRealForm: {
					is_real_name: false,
					cert_name: "",  //真实姓名
					cert_no: "",	//身份证号码
				}
			}
		},
		onLoad(){
			this.http_host = this.vuex_apiUrl;
			let that = this;
			that.getMetaInfo();
		},
		onShow(){
			let that = this;
			this.$common.showLoading();
			setTimeout(function(){
				that.get_user_real_info();
			},1500)
		},
		methods: {
			getMetaInfo:function() {
				var t = aliyunVerify.getMetaInfo();
				
				let p = uni.getSystemInfoSync().platform;
				if (p === "ios") {
					t = JSON.stringify(t);
				}
				this.metaInfo = t;
			},
			saveData(){
				var that = this;
				var userRealForm = this.userRealForm;
				userRealForm.metaInfo = that.metaInfo;
				this.$common.showLoading();
				this.$api.publicVerifyData(userRealForm).then(res => {
					if (res.errcode == 0) {
						that.verify(res.data.certifyId)
					}else{
						if(res.errmsg){
							uni.showToast({
								title: res.errmsg,
								icon: 'none'
							})
						}
					}
				});
			},
			verify:function(certifyId){
				aliyunVerify.verify({"certifyId": certifyId},function(t){
				});
			},
			get_user_real_info(){
				let that = this;
				this.$api.publicUserRealInfo({}).then(res => {
					if (res.errcode == 0) {
						that.userRealForm = res.data
						that.userRealForm.is_real_name = res.data.is_real_name==1?true:false
					}else{
						if(res.errmsg){
							that.$refs.uNotify.show({
								top: 0,
								type: 'error',
								message: res.errmsg,
								duration: 3000,
								fontSize: 18,
								safeAreaInsetTop: false
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#f6f6f6;
	}
	.edit{
		&-main{
			background-color:#ffffff;
			border-radius: 20rpx;
			width:680rpx;
			height:400rpx;
			margin:60rpx auto;
			display:flex;
			align-items: center;
			justify-content:center;
			flex-direction:column;
			.head{
				display:flex;
				flex-direction:column;
				align-items: center;
				image{
					width: 100px;
					height: 100px;
					margin-bottom:20rpx;
				}
				text{
					font-size:24rpx;
					color:#999;
				}
			}
			.namedata{
				display:flex;
				flex-direction:column;
				width:580rpx;
				margin:30rpx auto;
				.row-input{
					margin-top:30rpx;
					display:flex;
					justify-content: space-between;
					align-items:center;
					.company-value{
						display: flex;
						align-items: center;
						padding:20rpx 10rpx;
					}
					.right-icon{
						width:26rpx;
						height:30rpx;
					}
					text{
						font-size:26rpx;
						color:#666;
					}
				}
			}
		}
		.save-bottom{
			width:100%;
			position: absolute;	
			text-align: center;
			.save-btn{
				width:400rpx;
				height:80rpx;
				color:#ffffff;
				font-size:28rpx;
				line-height:80rpx;
				text-align: center;
				margin:auto;
				border-radius:80rpx;
			}
		}
	}
	
	
	.container-form {
		&-item {
			margin: 14rpx 0;
			background-color: #fff;
			
			&-upload {
				&-default {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 210rpx;
					height: 210rpx;
					border-radius: 50%;
					font-size: 30rpx;
					color: #999;
					background-color: #f5f5f5;
				}
	
				&>view:nth-child(3n) {
					margin-right: 0;
				}
	
				&-preview {
					position: relative;
					top: 0;
					left: 0;
					width: 210rpx;
					height: 210rpx;
					border-radius: 50%;
	
					&-dels {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
						position: absolute;
						z-index: 10;
						background: rgba(0, 0, 0, 0.6);
	
						image {
							width: 120rpx;
							height: 120rpx;
							position: absolute;
							top: 25%;
							left: 25%;
							z-index: 10;
						}
					}
					&-del {
						position: absolute;
						top: -12rpx;
						right: -12rpx;
						z-index: 10;
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}
	}
</style>
