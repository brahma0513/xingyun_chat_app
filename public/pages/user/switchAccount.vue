<template>
	<view class="main">
		<u-modal :show="modal_show" :title="modal_title" :content="modal_content" @confirm="modal_confirm" :showCancelButton="true" @cancel="modal_show=false"></u-modal>
		
		<!-- 这里是状态栏 -->
		<!-- <view class="status_bar"></view> -->
		<view class="top-btn">
			<text class="font-16 gray-66" @click="isManage=!isManage">{{isManage==true?'取消':'管理'}}</text>
		</view>
		<view class="flex justify-content-center">
			<image :src="vuex_user.headimgurl" mode="widthFix" class="custom-logo"></image>
		</view>
		<view class="tips-cell" v-if="isManage==true">
			<text class="btn-title">清除登录痕迹</text>
			<text class="btn-remark mar-t-5">仅清除本地登录记录，不会清除购买记录。</text>
		</view>
		<view class="flex justify-content-center tips-cell" v-if="isManage==false">
			<text class="btn-title">轻触头像以切换账号</text>
		</view>
		<view class="user-list">
			<view class="list"  v-for="(item,index) in userList">
				<view :class="'user-cont'" :style="(operate_user_id==item.user_id&&login_loading==true)?'background-color: #cdcdcd;':''" @click="changeLogin(item.user_id,item.user_id_en,item.phone)">
					<image :src="item.headimgurl" mode="aspectFill" class="login-headimg"></image>
					<view class="flex justify-content-space-between flex1">
						<view class="user-msg">
							<text class="font-14 gray-33 flex1">{{item.weixin_name||item.name}}</text>
							<text class="font-12 gray-99 flex1">{{item.phone}}</text>
						</view>
						<view class="login-status" v-if="item.is_login">
							<view class="green-icon" v-if="login_loading==false"></view>
							<u-loading-icon size="18" v-if="login_loading==true"></u-loading-icon>
							<text class="font-13 gray-66 mar-l-10">{{login_loading==true?'正在退出...':'当前登录'}}</text>
						</view>
						<view class="login-status" v-if="item.is_login==false && isManage==false && operate_user_id==item.user_id">
							<u-loading-icon size="18" v-if="login_loading==true"></u-loading-icon>
							<text class="font-13 gray-66 mar-l-10">{{login_loading==true?'正在登录...':''}}</text>
						</view>
						<view class="delete-user" @click="delLogin(item.user_id,item.phone)" v-if="item.is_login==false && isManage==true">
							<text>清除</text>
						</view>
					</view>
				</view>
			</view>
			<view class="list">
				<view  v-if="isManage==false">
					<view class="user-cont" @click="jumpLogin" v-if="bind_account_num<multi_account_num">
						<image src="/static/images/ts_btn_uploadpic.png" mode="widthFix" class="add-icon"></image>
						<view class="flex justify-content-space-between flex1">
							<view class="flex align-items-center">
								<text class="font-14 gray-66">添加账号</text>
							</view>
						</view>
					</view>
					<view class="user-cont-limit" v-else>
						<text>~绑定的账号已达上限~</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				http_host:"",
				logo:getApp().globalData.logo,
				
				isManage: false, //是否点击了管理账号 true  
				userInfo: {},
				systemInfo: {},	//设备信息
				userList: {},
				
				modal_show:false,
				modal_title:"提示",
				modal_content:"",
				
				
				phone_mark_ypt: '', //自编唯一字符串
				
				login_loading: false,	//登陆加载 true登陆加载中 false登陆完毕
				operate_user_id: 0,
				
				bind_account_num: 1,	//已经绑定了账号数量
				multi_account_num: 10,	//限制绑定账号数量
			}
		},
		onLoad(){
			var that = this
			that.userInfo = this.vuex_user;
			that.systemInfo = uni.getSystemInfoSync();
			// 因为有一个版本有重大用户误读的bug，所以暂时不用缓存了
			// if (that.$cache.get('multiUserAccountList')) {
			// 	that.userList = that.$cache.get('multiUserAccountList')
			// }else{
			// 	that.get_multi_user_list();
			// }
			that.get_multi_user_list();
		},
		methods:{
			get_multi_user_list(){
				var that = this
				this.$api.getMultiUserList({phone_mark:that.systemInfo.deviceId}).then(res => {
					if(res.errcode == 0){
						that.userList = res.data
						that.$cache.set('multiUserAccountList', that.userList)
						if(res.phone_mark_ypt){
							that.phone_mark_ypt    = res.phone_mark_ypt
							that.multi_account_num = res.multi_account_num
							that.bind_account_num  = res.bind_account_num
							that.$cache.set('phone_mark_ypt', that.phone_mark_ypt)
						}else{
							uni.showToast({
								title: '用户标识获取失败',
								icon: 'none',
								duration: 3000,
							})
						}
					}else{
						
					}
				})
			},
			//跳转登陆
			jumpLogin(){
				uni.navigateTo({
					url: "/public/pages/user/login?from=multi_account"
				})
			},
			//切换登陆账号
			changeLogin(user_id,user_id_en,phone){
				var that = this
				if(that.login_loading == true){
					return false;
				}
				if(that.isManage == true){
					return false;
				}
				if(that.vuex_user.user_id == user_id){
					//已经登录的是当前账号就不能切换
					return false;
				}
				that.operate_user_id = user_id;
				that.login_loading = true;
				var api_param = {
					phone_mark: that.systemInfo.deviceId,
					phone_mark_ypt: that.phone_mark_ypt,
					login_user_id: user_id_en,
					login_client: that.vuex_client,
					app_version_code: that.$config.appVersion,
				};
				this.$api.uniChangeUserLogin(api_param).then(res => {
					that.$cache.delete('multiUserAccountList');
					if (res.errcode==0 && res.data) {
						//注销登陆
						that.$common.exitLogin()
						setTimeout(function(){							
							that.login_loading = false;
							//存储登陆
							that.saveLogin(res.data.userinfo);
						},1000)
					}else if (res.errcode==457001){
						//重新登陆
						that.login_loading = false;
						uni.showToast({
							title: res.errmsg,
							icon: 'none',
							duration: 2000,
						})
						setTimeout(function () {
							uni.navigateTo({
								url: "/public/pages/user/login?from=multi_account&account="+phone
							})
						}, 2000);
						
					}else{
						that.login_loading = false;
						uni.showToast({
							title: res.errmsg,
							icon: 'none'
						})
					}
				})
			},
			
			saveLogin(userinfo) {
				var that = this;
				var login_token = userinfo.login_token;
				var params = {
					login_user_id: userinfo.user_id_en,
					app_version_code: that.$config.appVersion,
					login_client: that.vuex_client,
					phone_mark: that.systemInfo.deviceId,
				};
				that.$u.vuex('vuex_user', userinfo);
				that.$api.pongUserToken(params).then(res2 => {
					if (res2.data) {
						var vuex_user = res2.data.userinfo;
						vuex_user.login_token = login_token;
						that.$u.vuex('vuex_user', vuex_user);
					}else{
						// that.$u.vuex('vuex_user', that.$config.userDefault);
						// uni.showToast({
						// 	title: '登录失败，请关闭app重试',
						// 	icon: 'none'
						// })
					}
					
					uni.reLaunch({
						url: '/pages/personal_center/personal_center'
					})
				})
				return;
			},
			
			//删除登陆痕迹
			delLogin(user_id,phone){
				var that = this;				
				that.modal_content = '删除'+phone+'的登录记录？';
				that.modal_show    = true;
				that.operate_user_id = user_id;
			},
			
			modal_confirm(){
				var that = this;
				if(that.operate_user_id <= 0){
					uni.showToast({
						title: '要删除的用户id错误',
						icon: 'none'
					})
					return false;
				}
				that.modal_show    = false;
				this.$api.uniDelMultiUser({phone_mark:that.systemInfo.deviceId,phone_mark_ypt:that.phone_mark_ypt,del_user_id:that.operate_user_id}).then(res => {
					if (res.errcode==0) {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						that.$cache.delete('multiUserAccountList');
						that.get_multi_user_list();
					}else{
						uni.showToast({
							title: res.errmsg,
							icon: 'none'
						})
						return false;
					}
				})
			},
		}
	}
</script>

<style>
page{
	background-color:#eeeeee;
}
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
.custom-logo{
	width:100rpx;
	height:100rpx;
	border-radius: 15rpx;
}
.tips-cell{
	height: 120rpx;
	text-align: center;
	margin: 40rpx 0 40rpx 0;
}
.top-btn{
	padding:10rpx 30rpx 20rpx 30rpx; 
	display: flex;
	justify-content: flex-end;
}
.btn-title{
	display: flex;
	font-size:44rpx;
	color:#333;
	letter-spacing:2rpx;
	flex-direction: column;
}
.btn-remark{
	display: flex;
	font-size:28rpx;
	color:#6b6b6b;
	letter-spacing:2rpx;
	flex-direction: column;
}
.login-headimg{
	width:88rpx;
	height: 88rpx;
	border-radius:10rpx;
}
.user-cont{
	margin:16rpx auto;
	width:90vw;
	padding:26rpx;
	background-color:#fff;
	border-radius: 10rpx;
	display: flex;
	box-shadow: 0 0 2rpx #f6f6f6;
}
.user-cont .acitve{
	background-color: #d6d6d6;
}
.user-cont-limit{
	margin:16rpx auto;
	width:90vw;
	padding:26rpx;
	background-color:#fff;
	border-radius: 10rpx;
	display: block;
	box-shadow: 0 0 2rpx #f6f6f6;
	text-align: center;
	color: #909090;
	border: 1px #909090 dashed;
	font-size: 28rpx;
}
.user-msg{
	margin-left:20rpx;
	display: flex;
	flex-direction:column;
}
.user-list{
	margin-top:30rpx;
	max-height: calc(100vh - 210px);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    scrollbar-width: none; /* firefox */
  	-ms-overflow-style: none; /* IE 10+ */
}

.login-status{
	display: flex;
	align-items: center;
}
.green-icon{
	width:10rpx;
	height:10rpx;
	background-color:#44b549;
	border-radius:4rpx;
}
.add-icon{
	width:88rpx;
	height:88rpx;
	margin-right:20rpx;
}
.delete-user{
	width:120rpx;
	height:60rpx;
	line-height:60rpx;
	background-color:#f24d4d;
	text-align: center;
	border-radius: 10rpx;
	color:#ffffff;
	margin-top:16rpx;
	font-size:28rpx;
}
</style>