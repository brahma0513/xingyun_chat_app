<template>
	<view class="set">
		<!--二次提醒窗start-->
		<u-modal :show="modal_show" :title="$t('public.modal-title')" 
		:confirmText="$t('public.confirm')" :cancelText="$t('public.cancel')"
		@confirm="modal_confirm" :showCancelButton="true" 
		@cancel="modal_show=false">
			<view class="slot-content">
				{{modal_content}}
			</view>
		</u-modal>
		<!--二次提醒窗end-->

		<template>
			<u-cell-group :customStyle="groupStyle" :border="false">
				<u-cell  clickable :title="$t('set.account-set')" isLink url="/public/pages/user/editdata" v-if="vuex_user.user_id"  :border="false" :customStyle="cellStyle"></u-cell>
				<u-cell  clickable :title="$t('set.account-security')" isLink url="/public/pages/user/mypass" v-if="vuex_user.user_id"  :border="false" :customStyle="cellStyle"></u-cell>
				<u-cell  clickable :title="$t('set.language-set')" :value="langList[0][languageIdx].title" isLink  
				:border="false" :customStyle="cellStyle" @click="toogleLangPop"></u-cell>
				<u-cell  clickable :title="$t('set.about-us')" isLink url="/public/pages/user/aboutus"  :border="false" :customStyle="cellStyle" ></u-cell>
				<u-cell  clickable :title="$t('set.contact-us')" isLink url="/public/pages/user/contact_us" :border="false" :customStyle="cellStyle"></u-cell>
				<u-cell  clickable :title="$t('set.clear-cache')" isLink :value="fileSizeString"  :border="false" :customStyle="cellStyle" @click="clearCache()"></u-cell>
			</u-cell-group>
			
			<view class="grey mar-b-20 mar-t-20" ></view>
			
			<u-cell-group :customStyle="groupStyle" :border="false">
				<u-cell  clickable :title="$t('set.destory-account')" isLink 
				:value="$t('set.destory-tips')"  v-if="vuex_user.user_id && vuex_base.customer_share_info.is_open_logout_user==1" @click="cancel_user" :border="false" :customStyle="cellStyle2"></u-cell>
			</u-cell-group>
			
			<view class="grey mar-b-20 mar-t-20" v-if=" vuex_uniappSet.is_open_multi_account==1 && vuex_user.user_id " ></view>
			
			<u-cell-group :customStyle="groupStyle" :border="false">
				<u-cell v-if=" vuex_uniappSet.is_open_multi_account==1 && vuex_user.user_id " 
				:titleStyle="titleStyle" clickable :title="$t('set.switch-account')" url="/public/pages/user/switchAccount" 
				:border="false" :customStyle="cellStyle2"></u-cell>
			</u-cell-group>
			
			<view class="grey mar-b-20 mar-t-20" ></view>
			
			<u-cell-group :customStyle="groupStyle" :border="false">
				<u-cell  @click="exitUser()" clickable :title="$t('set.log-out')" v-if="vuex_user.user_id" :border="false" :titleStyle="titleStyle"></u-cell>
			</u-cell-group>
		</template>	
		<!--选择语言start-->
		<u-picker :show="showLangPop" :columns="langList" keyName="title" 
		:confirmText="$t('public.save')" :cancelText="$t('public.cancel')"
		@cancel="toogleLangPop" @confirm="confirmLang" :defaultIndex="[languageIdx]"></u-picker>
		<!--选择语言end-->
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				baseInfo:{},
				phone:'',
				isPhone:false,
				modal_show: false,
				modal_content: "",
				model_type: 'exitLogin',
				fileSizeString: "",
				groupStyle: 'background-color:#ffffff;'	,
				titleStyle:'text-align:center;',
				cellStyle:'border-bottom: 1px solid #eeeeee;padding: 5rpx 0rpx;',
				cellStyle2:'padding: 5rpx 0px;',
				// 设置语言
				showLangPop: false,
				langList: [
					[{
					  title: "简体中文",
					  name: "zh-Hans",
					  val: "zh_cn",
					}, {
					  title: "繁體中文",
					  name: "zh-Hant",
					  val: "zh_tw",
					}, {
					  title: "English",
					  name: "en",
					  val: "en_us"
					}]
				],
				languageIdx: 0,
			}
		},
		onLoad() {
			this.baseInfo = this.vuex_base;
			// 回显默认语言
			this.languageIdx = this.langList[0].findIndex(item => item.name === uni.getLocale())
			this.getPhone();
			// #ifdef APP-PLUS
			//检测缓存
			this.getStorageSize();
			// #endif
			console.log("$t('set.clear-cache')==",this.$t('set.clear-cache'))
		},
		methods: {
			// 切换系统语言
			confirmLang(e){
				var that = this;
				this.languageIdx = e.indexs[0];
				let langCode = e.value[0].name;
				this.$api.publicChangeLang({lang:e.value[0].val}).then(res=>{
					uni.setLocale(langCode);
					this.$i18n.locale = langCode;
					this.toogleLangPop();
				})
			},
			toogleLangPop(){
				this.showLangPop = !this.showLangPop;
			},
			getPhone(){
				var that = this;
				this.$api.getPhoneCall({}).then(res=>{
					if(res.errcode == 0){
						if(res.data.tel!=''){
							that.isPhone = true
							that.phone = res.data.tel
						}
						
					}
				})
			},
			phoneCall(){
				var _this = this
				uni.makePhoneCall({
				    phoneNumber: _this.phone
				});
			},
			exitUser() {
				let that = this;
				that.model_type = 'exitLogin'
				that.modal_show = true;
				that.modal_content = this.$t("set.log-out-content");
				return;
			},
			//注销账户
			cancel_user() {
				uni.navigateTo({
					url:'/public/pages/user/cancelUser',
				})
			
			},
			
			modal_confirm(){
				var that = this;
				that.modal_show = false;
				//退出登录操作
				if(this.model_type == 'exitLogin'){
					that.$common.exitLogin()
					uni.reLaunch({
						url: '/pages/personal_center/personal_center'
					});
				}else if(this.model_type == 'clearCache'){
					var that = this;
					that.modal_show = false;
					that.clearStorage();
				}
			},
			
			//清理缓存
			clearCache(){
				var that = this;
				that.model_type = 'clearCache'
				that.modal_content = this.$t("set.clear-cache-content");
				that.modal_show = true;
				return;
			},
			
			// 计算缓存
			getStorageSize() {
			  let that = this;
			  plus.cache.calculate(function(size) {
				let sizeCache = parseInt(size);
				if (sizeCache == 0) {
				  that.fileSizeString = "0B";
				} else if (sizeCache < 1024) {
				  that.fileSizeString = sizeCache + "B";
				} else if (sizeCache < 1048576) {
				  that.fileSizeString = (sizeCache / 1024).toFixed(2) + "K";
				} else if (sizeCache < 1073741824) {
				  that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "M";
				} else {
				  that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "G";
				}
			  });
			},
			
			// 清理缓存
			clearStorage() {
			  let that = this;
			  let os = plus.os.name;
			  uni.showLoading({
			  	title: "清理中.."
			  })
			  //删除自定义模板
			  that.$cache.delete('module_index')
			  that.$cache.delete('module_personal_center')
			  that.$cache.delete('bottom_list')
			  that.$cache.delete('multiUserAccountList')
			  //清除搜索框定位组件缓存
			  uni.removeStorageSync('current_city');
			  uni.removeStorageSync('isLocateAuth');
			  if (os == 'Android') {
				let main = plus.android.runtimeMainActivity();
				let sdRoot = main.getCacheDir();
				let files = plus.android.invoke(sdRoot, "listFiles");
				let len = files.length;
				for (let i = 0; i < len; i++) {
				  let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径
				  plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
					if (entry.isDirectory) {
					  entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录
						uni.showToast({
						  title: '缓存清理完成',
						  duration: 2000
						});
						that.getStorageSize(); // 重新计算缓存
					  }, function(e) {
						console.log(e.message)
					  });
					} else {
						entry.remove();
					}
				  }, function(e) {
					console.log('文件路径读取失败')
				  });
				}
			  } else { // ios
				plus.cache.clear(function() {
				  uni.showToast({
					title: '缓存清理完成',
					duration: 2000
				  });
				  that.getStorageSize();
				});
			  }
				uni.hideLoading();
			},
			
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#eeeeee;
		
		//background-color:#000000;
	}
	.slot-content{
		text-align: center;
	}
	.line{
		padding: 8rpx;
		background-color: #eaebec;
	}
	.grey{
		background-color:#eeeeee;
	}
</style>
