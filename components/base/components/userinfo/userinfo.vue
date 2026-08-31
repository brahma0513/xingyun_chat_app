<template>
	<view>
		<!-- 导航栏 -->
		<navbar ref="navbar" :config="config" v-if="indexs==0" />
		<!-- 状态栏和标题，必须是页面的第一个组件才启用 -->
		<view  v-if="indexs==0">
			<!-- 占位 -->
			<view :style="'height:'+titleHeight+'px'" ></view>
		</view>
		
		<view :style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px '+ (datas.content.style==1?0:10)+'px '+(datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px '">
			<!--显示方式一-->
			<block v-if="datas.content.css_type == 1">
				<!--view class='user-box user-box1' style='background-image:url("{{http_host+"/"+data.content.bg_pic}}")'-->
				<view :class="'user-box user-box1 skin-bg-'+theme+''"
					:style="'background-image:url('+datas.content.bg_pic+');border-radius: '+(datas.content.style==1?0:10)+'px;background-color: #5AC587'">
					<!--已登录-->
		
					<block v-if="vuex_user.user_id>0">					
						<view v-if="datas.content.scan_show == 1" class='scan-qr' @click="scanQr">
							<image :src="vuex_apiUrl+'/uniapp_template/web/static/images/scan_qr.png'" mode='widthFix'>
							</image>
						</view> 
						
						<view v-if="datas.content.qrCode_show == 1" class='qr-code' @click="doShare">
							<image :src="vuex_apiUrl+'/uniapp_template/web/static/images/qr_code.png'" mode='widthFix'>
							</image>
						</view> 
		
						<navigator hover-class="no-hover" class='person-set'
							url="/public/pages/user/setting" open-type='navigate'>
							<image :src="vuex_apiUrl+'/HTML/admui/public/custom/images/persen_set.png'" mode='widthFix'>
							</image>
						</navigator>
		
						<view v-if="datas.content.sign_show == 1" hover-class="no-hover" class="person-sign"
							 open-type='navigate' @click="$common.diyLinkJump('/wsy_user/web/index.php?m=user&a=sign_in')">
							<view class="icon" >
								<image mode='widthFix'
									:src="vuex_apiUrl+'/HTML/admui/public/custom/images/person_sign.png'">
								</image>
							</view>{{$t('immersionUserinfo.sign-in')}}
						</view>
						<image class='user-tx' :src='vuex_user.headimgurl' mode='aspectFill'></image>
						<text class='user-name'>{{vuex_user.weixin_name||vuex_user.name}}</text>
						<view class="user-nowrap">
							<text class='user-id' v-if="datas.content.id_show == 1">ID:{{vuex_user.user_id}}</text>
							<text class='tj-name' v-if="datas.content.recom == 1">{{datas.content.per_editname? datas.content.per_editname:$t('public.referrer')}}:{{parent_name}}</text>
						</view>
						<view class='sf-dp' v-if="datas.content.ident == 1">
							<!-- 推广员 -->
							<text v-if="identity.promotion">{{identity.promotion}}</text>
							<!-- 高级奖励 -->
							<text v-if="identity.senior_promotion">{{identity.senior_promotion}}</text>
							<!-- 店铺奖励 -->
							<text v-if="identity.store">{{identity.store}}</text>
							<!-- 区域奖励 -->
							<text v-if="identity.regional">{{identity.regional}}</text>
						</view>
					</block>
					<!--未登录-->
					<block v-else>
						<navigator hover-class="no-hover" class='person-set'
							url="/public/pages/user/setting" open-type='navigate'>
							<image :src="vuex_apiUrl+'/HTML/admui/public/custom/images/persen_set.png'" mode='widthFix'>
							</image>
						</navigator>
						<navigator hover-class="no-hover" url="/public/pages/user/login">
							<image class='user-tx' :src='vuex_user.headimgurl' mode='aspectFill'></image>
							<text class='user-name gray-ff'>{{$t('public.login')}}/{{$t('public.register')}}</text>
						</navigator>
					</block>
				</view>
			</block>
			<!--显示方式二-->
			<block v-if="datas.content.css_type == 2">
				<view :class="'user-box user-box2 skin-bg-'+theme"
					:style="'background-image:url('+datas.content.bg_pic+');border-radius: '+(datas.content.style==1?0:10)+'px;background-color: #5AC587'">
					<!--已登录-->
					<block v-if="vuex_user.user_id>0">						
						<view v-if="datas.content.scan_show == 1" class='scan-qr' @click="scanQr">
							<image :src="vuex_apiUrl+'/uniapp_template/web/static/images/scan_qr.png'" mode='widthFix'>
							</image>
						</view> 
						
						<view v-if="datas.content.qrCode_show == 1" class='qr-code' @click="doShare" >
							<image :src="vuex_apiUrl+'/uniapp_template/web/static/images/qr_code.png'" mode='widthFix'>
							</image>
						</view> 
		
						<navigator hover-class="no-hover" class='person-set'
							url="/public/pages/user/setting" open-type='navigate'>
							<image :src="vuex_apiUrl+'/HTML/admui/public/custom/images/persen_set.png'" mode='widthFix'>
							</image>
						</navigator>
						<view v-if="datas.content.sign_show == 1" hover-class="no-hover" class="person-sign"  open-type='navigate'
						 @click="$common.diyLinkJump('/wsy_user/web/index.php?m=user&a=sign_in')">
							<view class="icon">
								<image mode='widthFix'
									:src="vuex_apiUrl+'/HTML/admui/public/custom/images/person_sign.png'">
								</image>
							</view>{{$t('immersionUserinfo.sign-in')}}
						</view>
		
						<image class='user-tx' :src='vuex_user.headimgurl' mode='aspectFill'></image>
						<view class='user-info-box'>
							<text class='user-name'>{{vuex_user.weixin_name||vuex_user.name}}</text>
							<text class='user-id' v-if="datas.content.id_show == 1">ID:{{vuex_user.user_id}}</text>
							<text class='tj-name' v-if="datas.content.recom == 1">{{datas.content.per_editname? datas.content.per_editname:$t('public.referrer')}}:{{parent_name}}</text>
							<view class='sf-dp' v-if="datas.content.ident == 1">
								<!-- 推广员 -->
								<text v-if="identity.promotion">{{identity.promotion}}</text>
								<!-- 高级奖励 -->
								<text v-if="identity.senior_promotion">{{identity.senior_promotion}}</text>
								<!-- 店铺奖励 -->
								<text v-if="identity.store">{{identity.store}}</text>
								<!-- 区域奖励 -->
								<text v-if="identity.regional">{{identity.regional}}</text>
							</view>
						</view>
					</block>
					<!--未登录-->
					<block v-else>
						<navigator hover-class="no-hover" class='person-set'
							url="/public/pages/user/setting" open-type='navigate'>
							<image :src="vuex_apiUrl+'/HTML/admui/public/custom/images/persen_set.png'" mode='widthFix'>
							</image>
						</navigator>
						<navigator hover-class="no-hover" url="/public/pages/user/login">
							<image class='user-tx' :src='vuex_user.headimgurl' mode='aspectFill'></image>
							<view class='user-info-box'>
								<text class='user-name gray-ff'>{{$t('public.login')}}/{{$t('public.register')}}</text>
							</view>
						</navigator>
					</block>
				</view>
			</block>
		</view>
	</view>	
</template>

<script>
	import common from '@/utils/common.js'
	import navbar from '@/components/base/components/navbar/navbar.vue'
	var shares=null;
	export default {
		name: "userinfo",
		props: {
			datas: {
				type: Object,
				default: {}
			},
			//键名
			indexs: {
				type: Number,
				default: -1
			}
		},		
		components:{navbar},
		data() {
			return {
				parent_name: '无',
				canIUseGetUserProfile: false,
				theme: getApp().globalData.style_color,
				identity: {},
				sharePageSet: {},
				
				config:{
					// 可不固定
					fixed: true,
					back: false,
					title: ['个人中心','个人中心'],
					color: ['#000', '#000'],
					//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
					// backgroundColor: [1,['#a9a1ff','#6970ff','#ff55ff','#ff9999']],
					backgroundColor: [1,['#f8f8f8','#f8f8f8']],
					// 滑动屏幕后切换颜色，注意颜色为数组时长度必须一样，还有使用滑动切换必须监听 onPageScroll 事件
					slideBackgroundColor: [1,['#f8f8f8','#f8f8f8']],
					// 状态栏 ，数组则为滑动变色
					statusBarBackground:['','#f8f8f8'],
					//状态栏字体颜色，只支持#000000 和#FFFFFF（如果需要屏幕滑动变色，参数则为数组，例子：['#000000','#ffffff']）
					rightButton:[],
				},
				
				titleHeight: 0,
			};
		},
		onPageScroll(e) {
			// 重点，用到滑动切换必须加上
			this.$refs.navbar.pageScroll(e);
		},
		created() {

			this.height = this.datas.content.size == 1 ? '187.5' : this.datas.content.size == 2 ? '130.2' : 0;
			this.get_identity();
			this.get_info();
			//后台分享页面设置
			this.sharePageSet = this.vuex_appServerSet.SharePage_set;
			
			this.titleHeight = this.statusBarHeight+44;
		},
		methods: {
			//获取推荐人信息
			get_info: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id,
				};
				this.$api.personalCenterInfo(params).then(res => {
					//console.log(res)
					if (res.errcode == 0) {
						if(res.user_exist){
							_this.parent_name = res.data.parent_name
						}
						
					} else {
						//console.log('获取推荐人信息')
					}
				})
			},
			get_identity: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id
				};
				this.$api.promoterAllIdentity(params).then(res => {
					//console.log(res)
					if (res.errcode == 0) {
						_this.identity = res.data
					} else {
						//console.log('获取身份')
					}
				})
			},
			doShare: function(){
				let that = this;
				// #ifdef APP-PLUS
				// 如果后台开启了分享获取分享服务
				if(that.sharePageSet.is_open_share!=1){
					uni.showToast({
					  title: that.$t('immersionUserinfo.share-error'),
					  icon: "none",
					})
					return;
				}
				
				plus.share.getServices(function(res){
					for(var i=0;i<res.length;i++){
						var t = res[i];
						if(t.id == 'weixin'){
							shares = t;
						}
					}
				}, function(e){
				 	console.log("获取分享服务列表失败： ",JSON.stringify(e));
				});
				
				var share_tile = this.sharePageSet.share_title;
				var share_descripe = this.sharePageSet.share_descripe;
				var share_image = this.sharePageSet.share_image
				
				//分享首页
				var share_url = this.vuex_apiUrl +'/wsy_pub/web/index.php?m=app_index&a=index&customer_id='+this.vuex_customer_id_en+'&share_user_id='+this.vuex_user.user_id+'&is_share=1';
				if(this.sharePageSet.person_share_mode==2){
					share_url = this.vuex_apiUrl +'/uniapp_template/web/index.php?m=uniapp_index&a=download&customer_id='+this.vuex_customer_id+'&parent_id='+this.vuex_user.user_id+'&way=1';
				}
				this.$common.doShare(share_url,
				share_tile,
				share_descripe,
				share_image,
				true)
				// #endif
			},
			scanQr(){
				let that = this;
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						var result = res.result;
						if(res.scanType=='QR_CODE'){
							// that.check_is_realname(res);
							// return;
							var check_ypt_url = result.indexOf(this.vuex_apiUrl);
							console.log('是否云平台链接：' + check_ypt_url);
							if(check_ypt_url>=0){
								//云平台链接
								var link = result + '&user_agent=third_program_h5&third_token='+that.vuex_user.token;
								uni.setStorageSync("weburl", link)
								uni.navigateTo({
									url: "/pages/webview/webview"
								});
							}else{
								//普通链接
								if(result.indexOf("http://")===0||result.indexOf("https://")===0){
									uni.setStorageSync("weburl", result)
									uni.navigateTo({
										url: "/pages/webview/webview"
									});
								}
							}

						}else{
							uni.showToast({
							  title: that.$t('immersionUserinfo.nonsupport-error'),
							  icon: "none",
							})
						}
					}
				});
			},
			//校验是否实名 佰农荟专用
			check_is_realname(scanData) {
				let that = this;				
				that.$common.requestData({
					url: "/bainonghui/web/index.php?m=details&a=check_realname&xdebug=xdebug",
					data: {}, 
					method: "POST", 
					needToken: true,
				}).then(result => {
					if(result.errcode==0){
						//条码类型
						var scanType = scanData.scanType;
						//条码内容
						var scanResult = scanData.result;

					  if(scanType=='QR_CODE'){
						var check_ypt_url = scanResult.indexOf(this.vuex_apiUrl);
						console.log('是否云平台链接：' + check_ypt_url);
						if(check_ypt_url>=0){
						console.log('是云平台的链接');
							//云平台链接
							var link = scanResult + '&user_agent=third_program_h5&third_token='+that.vuex_user.token;
							uni.setStorageSync("weburl", link)
						console.log('跳转链接：' + link);
							uni.navigateTo({
								url: "/pages/webview/webview"
							});
						}else{
						console.log('是普通链接');
							//普通链接
							if(scanResult.indexOf("http://")===0||scanResult.indexOf("https://")===0){
								uni.setStorageSync("weburl", scanResult)
								uni.navigateTo({
									url: "/pages/webview/webview"
								});
							}
						}
					  
					  }else{
						uni.showToast({
						  title: that.$t('immersionUserinfo.nonsupport-error'),
						  icon: "none",
						})
					  }
					}else{
						uni.showModal({
							title: that.$t('public.modal-title'),
							content: result.errmsg,
							success: function (res) {
								if (res.confirm) {
									var link = that.vuex_apiUrl + '/wsy_user/web/index.php?m=set&a=real_name_authentication&customer_id='+that.vuex_customer_id_en;
									uni.setStorageSync("weburl", link)
									uni.navigateTo({
										url: "/pages/webview/webview"
									});
								} else if (res.cancel) {
									
								}
							}
						});
						
					}
				})
			},
		},
		computed:{
			//获取系统状态栏高度
			statusBarHeight(){
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight
			},
			navbarHeight(){
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight + that.conf.height + 'px'
			},
			screenWidth(){
				return uni.getSystemInfoSync().screenWidth;
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.no-hover {
		background-color: transparent
	}

	.user-box {
		padding-top: 1rpx;
		width: 100%;
		color: #fff;
		padding-bottom: 30rpx;
		position: relative
	}

	.user-box::before {
		content: '';
		display: block;
		position: absolute;
		z-index: -1;
		width: 100%;
		height: 100%;
		background-size: 100% 100%;
		top: 0;
		left: 0
	}

	.sf-dp image {
		width: 30rpx;
		padding: 0 15rpx 0 30rpx;
		vertical-align: middle;
	}

	.sf-dp image:first-child {
		padding-left: 0;
	}

	.sf-dp {
		padding: 9px 0;
	}

	.sf-dp text {
		display: inline-block;
		vertical-align: top;
		padding: 0 8px;
		line-height: 18px;
		font-size: 22rpx;
		margin: 0 5px;
		border-radius: 9px;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.user-box .person-sign {
		// width: 65px;
		padding: 0 13rpx;
		height: 28px;
		background-color: rgba(0, 0, 0, 0.5);
		position: absolute;
		right: 0;
		top: 52px;
		border-radius: 14px 0 0 14px;
		text-align: center;
		font-size: 13px;
		color: #FFF;
		line-height: 28px;
	}

	.user-box .person-sign .icon {
		margin: -2px 6px 0 0;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		display: inline-block;
		vertical-align: middle;
		background: -webkit-linear-gradient(180deg, #ffdb45, #feb250);
		/* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(180deg, #ffdb45, #feb250);
		/* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(180deg, #ffdb45, #feb250);
		/* Firefox 3.6 - 15 */
		background: linear-gradient(180deg, #ffdb45, #feb250);
		/* 标准的语法 */
	}

	.user-box .person-sign .icon image {
		display: block;
		width: 11px;
		height: 8px;
		margin: 4.5px auto;
	}

	.user-box button {
		background: transparent;
		color: #fff;
	}

	.user-box button::after {
		border: 0;
	}

	.user-box1 {}

	.user-box1 .user-tx {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		display: block;
		background-size: 100% 100%;
	}


	.user-box .person-set {
		position: absolute;
		width: 32rpx;
		height: 32rpx;
		background-size: 100% 100%;
		top: 15px;
		right: 15px;
	}

	.user-box .person-set image {
		width: 34rpx;
		height: 34rpx;
	}
	.user-box .scan-qr{
		position: absolute;
		width: 32rpx;
		height: 32rpx;
		background-size: 100% 100%;
		top: 15px;
		right: 85px;
	}

	.user-box .scan-qr image {
		width: 34rpx;
		height: 34rpx;
	}
	
	.user-box .qr-code {
		position: absolute;
		width: 32rpx;
		height: 32rpx;
		background-size: 100% 100%;
		top: 15px;
		right: 50px;
	}

	.user-box .qr-code image {
		width: 34rpx;
		height: 34rpx;
	}
	
	.user-box1 .user-name {
		font-size: 34rpx;
		line-height: 1;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 16px;
		margin-top: 10px;
		color: #ffffff;
	}

	.user-nowrap {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		line-height: 1;
	}

	.user-box1 .user-id,
	.user-box1 .tj-name {
		font-size: 26rpx;
		display: inline-block;
		line-height: 60rpx;
		line-height: 1;
	}

	.user-box1 .tj-name {
		margin-left: 20rpx
	}

	.user-box1 {
		text-align: center;
		height: 364rpx;
		padding: 23px 15px 0;
		box-sizing: border-box;
		background-size: 100% 100%;
		position: relative;
	}

	.user-box1 .user-set {
		font-size: 28rpx;
		text-align: right;
		margin: 20rpx;
	}

	.user-box1 .user-tx {
		margin: 10rpx auto;
	}

	/*样式二*/
	.user-box2 {
		padding: 35px 15px 0;
		box-sizing: border-box;
		background-size: 100% 100%;
		position: relative;
		overflow: hidden;
		height: 280rpx;
	}

	.user-box2 .user-set {
		font-size: 28rpx;
		text-align: right;
		margin: 20rpx;
	}

	.user-box2 .user-tx {
		width: 112rpx;
		height: 112rpx;
		border-radius: 50%;
		display: inline-block;
		margin: 0px 13px 0 0;
		vertical-align: middle;
	}

	.user-box2 .user-info-box {
		display: inline-block;
		margin-top: 10rpx;
		vertical-align: middle;

	}

	.user-box2 .user-info-box.no-login {
		margin-top: 15px
	}

	.user-box2 text.user-name {
		font-size: 32rpx;
		line-height: 1;
		display: block;
		margin-bottom: 10px;
		color: #ffffff;
	}

	.user-box2 .user-id,
	.user-box2 .tj-name {
		font-size: 26rpx;
		line-height: 50rpx;
		display: inline-block;
		vertical-align: middle;
		line-height: 1;
	}

	.user-box2 .tj-name {
		display: inline-block;
		max-width: 150px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
	}

	.user-box2 .user-id {
		padding-right: 10rpx;
	}

	.user-box2 button {
		padding: 0;
		line-height: 1.3;
		text-align: left;
	}

	.user-box2 button text {
		font-size: 28rpx;
	}
</style>
