<template>
	<view class="feed">
		<view class="row-input">
			<text>{{$t('feedback.contacts')}}：</text>
			<u-input
			    :placeholder="$t('public.input-place-text')+$t('contact-us.contacts')"
			    border="surround"
				maxlength="12"
				clearable
			    v-model="realname"
			    @change="change"
			  ></u-input>
		</view>
		<view class="row-input">
			<text>{{$t('feedback.phone')}}：</text>
			<u-input
			    :placeholder="$t('public.input-place-text')+$t('contact-us.phone')"
				type="number"
				maxlength="11"
				clearable
			    border="surround"
			    v-model="mobile"
			    @change="change"
			  ></u-input>
		</view>
		<view class="row-input">
			<text>{{$t('feedback.mailbox')}}：</text>
			<u-input
			    :placeholder="$t('public.input-place-text')+$t('contact-us.mailbox')"
				type="email"
				clearable
			    border="surround"
			    v-model="email"
			    @change="change"
			  ></u-input>
		</view>
		<view class="row-input">
			<text>{{$t('feedback.content')}}：</text>
			<u-textarea v-model="content" height="140" :placeholder="$t('public.input-place-text')+$t('feedback.content')" count maxlength="150"></u-textarea>
		</view>
		<view class="save-bottom">
			<view :class="'save-btn skin-bg-'+theme+''" @click="saveFankui">{{$t('feedback.sub-content')}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: getApp().globalData.style_color,
				showLoad: false,
				realname: '',	//用户姓名
				mobile:'',	//用户手机
				email: '', //邮箱
				content:'',		//意见内容
				
			}
		},
		methods: {
			//提交反馈
			saveFankui(){
				var that = this;
				const params = {
					realname:  this.realname,
					mobile: this.mobile,
					email: this.email,
					content: this.content,
				};
				
				if(!params.realname||!params.content||!params.mobile){
					uni.showToast({
						icon: 'error',
						title: $t('feedback.ple-complete')
					})
					return false;
				}
				this.showLoad = true;
				this.$api.saveFankui(params).then(res => {
					this.showLoad = false;
					if(res.errcode == 0){
						uni.showToast({
							icon: 'none',
							title: res.errmsg
						})
						setTimeout(() => {
							uni.navigateTo({
							    url: 'person',
							});
						}, 1000);
					}
				});
			},
			change(){
				
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#fff;
	}
	.feed{
		width:680rpx;
		height:calc(100vh - 200rpx);
		position: relative;
		margin:auto;
		padding:40rpx 0;
		.row-input{
			line-height:80rpx;
			font-size:30rpx;
		}
		.save-bottom{
			width:100%;
			position: absolute;
			bottom:80rpx;
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
</style>
