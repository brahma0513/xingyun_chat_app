<template>
	<view class="set">
		<!-- 下载全量包提醒 -->
		<u-modal :show="modal_show" :title="modal_title" :content="modal_content" @confirm="modal_confirm" :showCancelButton="true" @cancel="modal_show=false"></u-modal>
		
		<view class="set-header">
			<view class="logo">
				<image :src="uniappSet.app_logo_url"></image>
			</view>
			<view class="title">
				{{uniappSet.app_title}}
			</view>
			<view class="version">
				{{$t('about-app.version')}}（Ver:{{appVersion}}）
			</view>
		</view>
		
		<view class="set-cell margin-top-20">
			<u-cell-group>
				<u-cell icon="tags" clickable :title="$t('about-app.func-intro')" isLink url="/public/pages/user/app_introduce"  v-if="uniappSet.is_open_app_introduce==1" :border="false" :customStyle="cellStyle"></u-cell>
				<u-cell icon="file-text" clickable :title="$t('about-app.user-agree')" isLink :url="'/pages/webview/webview?weburl='+vuex_apiUrl+'%2Fwsy_pub%2Fweb%2Findex.php%3Fm%3Duser%26a%3Duser_agreement%26customer_id%3D'+vuex_customer_id"  v-if="baseInfo.customer_share_info.is_open_agreement==1" :border="false" :customStyle="cellStyle"></u-cell>
				<u-cell icon="integral" clickable :title="$t('about-app.privacy-agree')" isLink :url="'/pages/webview/webview?weburl='+vuex_apiUrl+'%2Fwsy_pub%2Fweb%2Findex.php%3Fm%3Duser%26a%3Dprivacy_policy%26customer_id%3D'+vuex_customer_id"  v-if="baseInfo.customer_share_info.is_open_agreement==1" :border="false" :customStyle="cellStyle"></u-cell>
				<u-cell icon="chat" clickable :title="$t('about-app.feedback')" isLink url="/public/pages/user/feedback" :border="false" :customStyle="cellStyle"></u-cell>
				<!-- #ifdef APP-PLUS -->
				<u-cell icon="level" clickable :title="$t('about-app.check-version')" isLink @click="updateApp(true)" :border="false" :customStyle="cellStyle" ><text
					slot="value"
					class="u-slot-value"
					v-if="has_new_version==true"						
				>{{$t('about-app.new-version')}}</text>
				<text
					slot="value"
					class="u-slot-new-value"
					v-if="has_new_version==false"
				>{{$t('about-app.now-new-version')}}</text>
				</u-cell>
				<!-- #endif -->
			</u-cell-group>
		</view>
		
		<view class="set-foot">
			<view class="copyright" v-if="uniappSet.copyright != ''">
				Copyright©2021-{{year}} {{uniappSet.copyright}}. All Rights Reserved
			</view>
			<view class="copyright" v-if="uniappSet.beian != ''">
				{{uniappSet.beian}}
			</view>
		</view>
			
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cellStyle:'border-bottom: 1px solid #eeeeee;padding: 5rpx 0rpx;',
				baseInfo: {},
				uniappSet: {},
				appVersion: '1.0.0',
				year: 2022,
				
				has_new_version: false,	//是否有新版本 true有  false无
				is_click_check: false,	//是否点击了检测更新
				
				modal_show:false,
				modal_title:"提示",
				modal_content:"",
				
				user_client: '',	//用户所在客户端
				type: 0,	//1：整包更新 2：热更新
				update_url:"",		//更新链接
			}
		},
		onReady() {
			this.modal_title = this.$t('public.modal-title');
		},
		onLoad() {
			this.baseInfo = this.vuex_base;
			this.appVersion = this.$config.appVersion;

			//检查号
			// #ifdef APP-PLUS
			this.checkVersion();
			this.updateApp(false);
			// #endif
			var dd = new Date();
			this.year = dd.getFullYear();
			this.getUniappSetting();
			
		},
		methods: {
			//获取应用设置
			getUniappSetting() {
				let that = this;
				that.uniappSet = that.vuex_uniappSet;
			},
			//检测版本号
			checkVersion(){
				let self=this;
				plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo){
					self.appVersion = wgtinfo.version;
				});
			},
			//检查更新
			updateApp(is_click_check) {
				let version = "";
				let that = this;
				let platform = uni.getSystemInfoSync().platform;
				plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
					let versionCode = wgtinfo.versionCode;
					that.$api.updateApp({
						now_app_version_code: versionCode,
						setupPage:true,
						platform:platform,
					}).then(res => {
						console.log("检测更新",res)
						if (res.errcode == 0) {
							//如果线上版本大于本地版本 ，提示升级
							if(res.data.online_app_version_code > versionCode){
								that.has_new_version = true
							}
							
							if(is_click_check == true && that.has_new_version){
								// true 没有新版本的时候有提示，默认：false
								//APPUpdate(true);
								
								that.type = res.data.type;
								that.user_client = res.data.user_client;
								that.update_url = res.data.update_url;
								if(that.user_client == 'ios'){
									if(that.type==1){
										//苹果端 整包更新
										that.$common.showToast(that.$t('about-app.down-form-appstore'));
									}else{
										that.modal_show    = true;
										that.modal_title   = that.$t('about-app.system-upgrade');
										that.modal_content = that.$t('about-app.new-version-num')+res.data.online_app_version+'，'+that.$t('about-app.sure-upgrade');
									}
								}else if(that.user_client == 'android'){
									that.modal_show    = true;
									that.modal_title   = that.$t('about-app.system-upgrade');
									that.modal_content = that.$t('about-app.new-version-num')+res.data.online_app_version+'，'+that.$t('about-app.sure-upgrade');
								}
							}else if(is_click_check == true){
								that.$common.showToast(that.$t('about-app.already-new-version'));
							}
						}
					});
				});
			
			},
			modal_confirm(){
				if(this.type == 1){
					this.UpdateOfAll(this.update_url);
				}else if(this.type == 2){
					this.UpdateOfWgt(this.update_url);
				}
			},
			//热更新
			UpdateOfWgt(apk_url) {
				var that = this;
				console.log('热更新下载链接',apk_url)
				this.modal_show = false;
				this.$common.showLoading(that.$t('about-app.updating'));
				uni.downloadFile({
					url: apk_url,
					success: (downloadResult) => {
						if (downloadResult.statusCode === 200) {
							console.log('增量包下载成功');
							plus.runtime.install(downloadResult.tempFilePath, {
								force: false
							}, function() {
								uni.hideLoading();
								plus.runtime.restart();
							}, function(e) {
								uni.hideLoading();
								that.$common.showToast(that.$t('about-app.update-error'));
								console.error('增量更新安装失败：' + JSON.stringify(e));
							});
						}
					},
					fail:()=>console.log('增量包下载失败')
				});
			},
			//整包更新
			UpdateOfAll(apk_url) {
				this.modal_show = false;
				console.log('整包下载链接：' + apk_url);
				const downloadTask = uni.downloadFile({
					url: apk_url,
					success: (downloadResult) => {
						if (downloadResult.statusCode === 200) {
							console.log('安装包下载成功，即将安装：' + JSON.stringify(downloadResult, null, 4));
							plus.runtime.openFile(downloadResult.tempFilePath);
						}else{
							console.log('安装包下载失败');
						}
					},
					fail:()=>console.log('下载失败')
				});
				downloadTask.onProgressUpdate((res) => {
					uni.$emit("progress", res)
				});
				uni.$on("cancelUpdate", () => {
					console.log("用户点击了取消下载");
					downloadTask.abort();
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#FFFFFF;
	}
	.line{
		padding: 8rpx;
		background-color: #eaebec;
	}
	.set-cell{
		background-color: #FFFFFF;
	}
	.margin-top-20{
		margin-top: 20rpx;
	}
	.set-header{
		text-align: center;
		padding: 40rpx 40rpx 40rpx 40rpx;
	}
	.set-header .logo{
		position: relative;
		width: 100%;
		height: 200rpx;
	}
	.set-header .logo image{
		width: 160rpx;
		height: 160rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -80rpx; /* 高度的一半 */
		margin-left: -80rpx; /* 宽度的一半 */
	}
	.title{
		margin-top: 10rpx;
		font-size: 32rpx;
		font-weight:bold;
	}
	.version{
		margin-top: 18rpx;
		font-size: 20rpx;
	}
	.set-foot{
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		text-align: center;
		padding-bottom: 50rpx;
		color: #767676;
	}
	.copyright{
		text-align: center;
		margin-top: 10rpx;
		font-size: 20rpx;
	}
	.u-slot-value {
		background-color: #ff1800;
		color: #ffffff;
		border-radius: 20rpx;
		width: 100rpx;
		text-align: center;
		font-size: 24rpx;
	}
	.u-slot-new-value {
		color: #606266;
		border-radius: 20rpx;
		width: 200rpx;
		text-align: center;
		font-size: 24rpx;
	}
</style>
