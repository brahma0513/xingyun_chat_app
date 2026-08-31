<template>
	<view class="edit">
		<view class="edit-main">
			<view class="namedata">
				<text class="phone-tips">请填写6位数的支付密码</text>
				<view class="row-input">
					<text>新密码：</text>
					<u-input
					    placeholder="请输入支付密码"
						maxlength="6"
						fontSize="14"
						inputAlign="right"
						clearable
					    border="bottom"
						type="password"
					    v-model="Password"
					    @change="change"
					  ></u-input>
				</view>
				<view class="row-input">
					<text>重复支付密码：</text>
					<u-input
					    placeholder="请重复支付密码"
						maxlength="6"
						fontSize="14"
						inputAlign="right"
						clearable
					    border="bottom"
						type="password"
					    v-model="Password2"
					    @change="change"
					  ></u-input>
				</view>
			</view>
		</view>
		<view class="save-bottom">
			<view :class="'save-btn skin-bg-'+theme+''" @click="changePassword()">确认</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: getApp().globalData.style_color,
				Password:"",//密码
				Password2:"",//重复密码
				tips: '',
			}
		},
		methods: {			
			change(){
				
			},
			changePassword(){
				var that = this;
				if(!this.$u.test.rangeLength(this.Password, [6,6])){
					this.$common.showToast('密码长度必须为6位');
					return;
				}
				if(this.Password != this.Password2){
					this.$common.showToast('密码两次输入不一致');
					return;
				}
				const params = {
					op: 'set_pwd',
					phone: that.vuex_user.phone,
					user_id: that.vuex_user.user_id,
					password: that.Password,
					repassword: that.Password2,
				};
				this.$common.showLoading();
				this.$api.setPayPassword(params).then(res => {
					uni.hideLoading();
					if (res.errcode == 0) {
						this.$common.showToast('保存成功');
						setTimeout(function() {
							uni.navigateBack({})
						}, 1000);
					}else{
						if(res.errmsg){
							uni.showToast({
								title: res.errmsg,
								icon: 'none'
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
		background-color:#f5f5f5;
	}
	.edit{
		&-head{
			padding: 20px 0px 0px 20px;
			font-size: 15px;
		}
		&-main{
			background-color:#ffffff;
			border-radius: 20rpx;
			width:700rpx;
			height:460rpx;
			margin:60rpx auto;
			display:flex;
			align-items: center;
			justify-content:center;
			flex-direction:column;
			.namedata{
				display:flex;
				flex-direction:column;
				width:660rpx;
				margin:30rpx auto;
				.row-input{
					margin-top:30rpx;
					display:flex;
					align-items:center;
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
				background-color:#db3f3f;
				color:#ffffff;
				font-size:28rpx;
				line-height:80rpx;
				text-align: center;
				margin:auto;
				border-radius:80rpx;
			}
		}
	}
	.phone-tips{
		font-size: 14px;
		color: #666;
	}
	.custom-style {
		height: 60rpx;
		background-color: #FAFAFA;
		color: #666666;
		line-height: 60rpx;
	}
</style>