<template>
    <view>
		<view>
			<web-view ref="webview" :src="weburl" @message="handlePostMessage"></web-view>
		</view>
		
    </view>
</template>

<script>
	var wv;//计划创建的webview
	var rewardedVideoAd;	//计划创建的激励视频
	var shares=null;
    export default {
        data() {
            return {
				template_data: { has_bottom: true },//底部导航数据
				wv: null,
                weburl: '',
				canBack: false,	//h5是否可以返回上一页
				carShareUrl: [],
				canShare:false,	//当前页面能否分享
				shareParam: {
					url: '',
					title: '',
					descripe: '',
					image: '',
					ypt_notice: false,	//是否云平台回调的内容
				},	//当前页面分享信息
				
				currentPageUrl: ''	,//当前访问链接
				currentPageTitle: '',
				
				show_back_button: false,	//是否显示返回菜单
				
				sharePageSet: {
					is_open_share : false,
					share_title: '',
					share_descripe: '',
					share_image: '',
				},	//后台公共分享页面设置
				
				//特殊处理参数标识   giftbag_product_list礼包产品链接 giftbag_product_detail 礼包产品详情 giftbag_product_order 礼包产品订单
				extra_do_key:'',
				is_bottom: 0,	//是否来自底部菜单的链接跳转 1：是 0否
				style_color_hex: getApp().globalData.style_color_hex,
				barBackgroundColor: getApp().globalData.bar_background_color_hex,
				barFrontColor: getApp().globalData.bar_front_color_hex,
				bar_color_set: getApp().globalData.bar_color_set,
				
				adpid: '',	//激励视频广告id
				isLoadingAd: false,	//激励视频广告是否正在加载中
				loadAdShow: false,	//是否载入完广告就马上播放
				adLoadCallback: '',	//广告载入回调方法
				adShowCallback: '',	//广告观看回调方法
            }
        },
		onReady(){
			
		},
		onShow() {
			
		},
		onLoad(e) {
			var that = this;
			
			that.setBarStyle();
				
			if(e.is_bottom){
				this.is_bottom = e.is_bottom
			}
			// this.weburl = 'https://www.yimenapp.com/doc/demo_tz.cshtml';
			//先获取链接参数 否则获取缓存
			if(e.weburl){
				this.weburl = e.weburl
			}else{
				// 获取链接
				try {
					const weburl = uni.getStorageSync('weburl');
					if (weburl) {
						this.weburl = weburl;
					}
				} catch (e) {
					// error
				}
			}
	
			//后台分享页面设置
			that.sharePageSet = that.vuex_appServerSet.SharePage_set;

			console.log("当前访问的H5链接",this.weburl)
			
			//判断是否云平台的域名
			var is_ypt_url = true;
			var check_ypt_url = that.weburl.indexOf(that.vuex_apiUrl);
			if(check_ypt_url>=0){
				is_ypt_url = true;
			}else{
				is_ypt_url = false;
			}
			//不是云平台的域名，不做过多的要求
			if(is_ypt_url == false){
				//处理外部链接
				// that.do_extra_url();
				return;
			}
			
			that.show_back_button = that.check_is_show_back_button();
			
			// #ifdef APP-PLUS
			var useragent = plus.navigator.getUserAgent();
			
			if(useragent.indexOf('isapp_xingdian_app')<0){
				useragent = useragent +"third_program_h5 {huiju_mini_pay:[app:xingdian_app]} h5_login not_navigation isapp_xingdian_app app_share_select app-framework-model-2";
			}
			//useragent = useragent.replace("Html5Plus/1.0","");
			if(that.vuex_apiUrl != 'https://yun.new.xingdian666.com'){
				plus.navigator.setUserAgent(useragent);
			}
				
			var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效

			setTimeout(function() {
				wv = currentWebview.children()[0];
				
				var currentUrl = wv.getURL();
				that.currentPageUrl = currentUrl;
				//监听页面是否可以返回上一页
				wv.addEventListener('progressChanged',function(e) {
					currentUrl = wv.getURL();
					that.currentPageUrl = currentUrl;
					console.log('back===',that.show_back_button);
					wv.canBack(e => {
						that.canBack = e.canBack
						if(that.is_bottom==1){
							if(that.canBack==false){
								that.show_back_button = false
							}else{
								that.show_back_button = true
							}
						}
						currentWebview.setStyle({
							titleNView:{
								autoBackButton:that.show_back_button
							 }
						})
					}) 
				},false);
				
				currentWebview.setStyle({
					titleNView:{
						autoBackButton:that.show_back_button
					 }
				})
				
				//有时导航条颜色设置失败
				that.setBarStyle();				
				that.wv = wv;
			}, 1000); //如果是页面初始化调用时，需要延时一下
			
			// #endif
			
		},
		onBackPress(e) {
			//console.log("canBack",this.canBack)
			if (this.canBack) {
				this.$scope
				  .$getAppWebview()
				  .children()[0]
				  .back();
				return true;
			}
			
		},
		
		onNavigationBarButtonTap(e) {  
			//console.log("导航按钮类型",e)
		    if(e.type == 'home'){
				uni.reLaunch({
					url: '/pages/index/index',
				});
				//uni.navigateBack()
			}else if(e.type == 'menu'){
				if(this.canShare == false){
					return ;
				}
				this.uniShare();
			}
		} ,
		
		methods:{
			//设置导航条颜色
			setBarStyle(){
				let that = this;
				if(that.barBackgroundColor!= 'default'&&that.bar_color_set.indexOf('/pages/webview/webview')>=0){
					uni.setNavigationBarColor({
						frontColor: that.barFrontColor,
						backgroundColor: that.barBackgroundColor
					})
				}		
			},

			// webview向外部发送消息
			handlePostMessage: function(data) {
				console.log("接收到消息：" + JSON.stringify(data.detail));
				let that = this;
				var return_data1 = JSON.stringify(data.detail);
				var return_data2 = JSON.parse(return_data1); 
				var return_data  = return_data2.data;
				var event = return_data[0]['event']?return_data[0]['event']:''; //交互事件

				if(event=='openMiniProgram'){
					//打开小程序 汇聚支付
					var return_value  = return_data[0]['value'];
					var orginid = return_value.orginid;
					var path = return_value.path;

					if(path != undefined && path!=""){						
						shares?shares.launchMiniProgram({
								id:orginid,
								path: path,
								type: 0 //0-正式版；1-测试版；2-体验版；默认值为0；
							}):plus.nativeUI.alert('当前环境不支持微信操作!');
						return;
					}
				}else if(event=='setShare'){
					if(that.sharePageSet.is_open_share==0){
						//关闭了分享
						return;
					}
					//设置分享
					var return_value = return_data[0]['value'];
					if(return_value.show_btns.length>0 && return_value.show_btns[0]=='sendFriend' && return_value.url!=''){
						this.canShare=true;
						this.shareParam = {
							url: return_value.url,
							title: return_value.title,
							descripe: return_value.description,
							image: return_value.album,
							ypt_notice: true,
						};
					}else{
						this.canShare=false;
						this.shareParam = {
							url: '',
							title: '',
							descripe: '',
							image: '',
						};
					}
					this.setShareBtn();
				}else if(event=='loadJuheAd'){
					//调用聚合广告
					console.log("app载入聚合广告")
					var return_value  = return_data[0]['value'];
					if(return_value.adpid!=''){
						this.adpid = return_value.adpid;
						this.adLoadCallback = return_value.callback_name
						this.isLoadingAd = true;
						
						this.loadRewardedVideoAd(this.adpid);
						
						// this.$refs.adRewardedVideo.load();
						// setTimeout(function(){							
						// 	if (that.isLoadingAd) {
						// 		//有一定概率没有载入成功
						// 	  that.$refs.adRewardedVideo.load();
						// 	}
						// },1500)
					}else{
						uni.showToast({
							title: "缺失广告位id"
						})
					}
					
				}else if(event=='openJuheAd'){
					//调用聚合广告
					console.log("app调起聚合广告")
					var return_value  = return_data[0]['value'];
					this.adShowCallback = return_value.callback_name
					if(return_value.adpid!=''){
						console.log("app重新加载广告")
						this.adpid = return_value.adpid;
						this.isLoadingAd = true;
						this.loadAdShow = true;
						if(this.isLoadingAd){
							uni.showLoading();
						}						
						this.loadRewardedVideoAd(this.adpid);
						//this.$refs.adRewardedVideo.load();
					}else{
						//打开广告
						that.showAd();
					}
				}else if(event=='openMap'){
					//打开APP地图
					console.log("打开APP地图")
					var return_value  = return_data[0]['value'];
					var map_name = return_value.name;
					var latitude = return_value.latitude;
					var longitude = return_value.longitude;
					var scale = return_value.scale;
					var address = return_value.address;
					uni.openLocation({
						latitude: Number(latitude),
						longitude: Number(longitude),
						scale: scale,
						name: map_name,
						address: address
					})
				}else if(event=='openJuheBannerAd'){
					
				}else if(event=='saveImage'){
					//保存图片
					var return_value  = return_data[0]['value'];
					var img_url = return_value.img_url;
					uni.saveImageToPhotosAlbum({
						filePath: img_url,
						success: function () {
							uni.showToast({
								title: '保存成功'
							});
						},
						fail: function(err){
							uni.showToast({
								title: '保存失败：'+err.errMsg,
								icon: 'none'
							});
						}
					});
				}else{
					//默认兼容以前旧版本的汇聚支付
					var return_data  = return_data2.data;
					
					var orginid = return_data[0]['orginid'];
					var path = return_data[0]['path'];
					if(path != undefined && path!=""){
						shares?shares.launchMiniProgram({
								id:orginid,
								path: path,
								type: 0 //0-正式版；1-测试版；2-体验版；默认值为0；
							}):plus.nativeUI.alert('当前环境不支持微信操作!');
						return;
					}

				}
				
				
			},
			// 判断是否是 Base64 图片
			isBase64(imageSrc) {
			  return imageSrc.startsWith('data:');
			},
		
			// 判断是否是 URL 图片
			isUrl(imageSrc) {
			  return imageSrc.startsWith('http://') || imageSrc.startsWith('https://');
			},
			
			base64ToTempFilePath(base64Str) {
			    return new Promise((resolve, reject) => {
					const [, format, data] = base64Str.match(/^data:image\/(\w+);base64,(.*)$/);
					const filePath = `_doc/base64ToTemp.${format}`;
					
					// 写入文件到本地
					plus.io.saveBase64Data(data, filePath, (result) => {
						if (result) {
							resolve(filePath);
						} else {
							reject('写入文件失败');
						}
					});
				});
			},
			
			async saveBase64ImageToAlbum(base64Str) {
			    try {
			        // 首先将base64转换为文件路径
			        const filePath = await this.base64ToTempFilePath(base64Str);
			
			        // 然后尝试保存图片到相册
			        await uni.saveImageToPhotosAlbum({
			            filePath: filePath,
			            success: () => {
			                console.log('图片已保存');
			                uni.showToast({
			                    title: '图片已保存',
			                    icon: 'success'
			                });
			            },
			            fail: (err) => {
			                console.error('保存失败', err);
			                uni.showToast({
			                    title: '保存失败',
			                    icon: 'none'
			                });
			            }
			        });
			    } catch (error) {
			        console.error('处理过程中出错:', error);
			    }
			},
			
			//是否显示返回按钮方法
			check_is_show_back_button(){
				var show_back_button = true;	//是否显示返回按钮
				if(this.weburl.indexOf('/hy_blind_box/web/index.php')>=0&&(this.weburl.indexOf('/pages/goods/index')>=0||this.weburl.indexOf('/pages/order/box')>=0||this.weburl.indexOf('page_uri=%2Fpages%2Fgoods%2Findex')>=0||this.weburl.indexOf('page_uri=%2Fpages%2Forder%2Fbox')>=0)||this.weburl.indexOf('/llm_chat/web/index.php?m=chat&a=index')>=0){
					show_back_button = false;
				}
				return show_back_button;
			},
			
			//修改webview高度
			change_wv_height(){
				var returnHeight = 0;
				const rate = uni.getSystemInfoSync().windowHeight/uni.getSystemInfoSync().windowWidth;
				let limit = uni.getSystemInfoSync().windowHeight == uni.getSystemInfoSync().screenHeight ? 1.8 :1.65;	//临街判断值
				if(rate>limit){
					//长屏手机
					returnHeight = 23;
					if (this.vuex_client == 'app_ios') {
						returnHeight = 38;
					}
				}else{
					//短屏手机
					returnHeight = 38;
				}
				const wvHeight = uni.getSystemInfoSync().windowHeight-uni.getSystemInfoSync().statusBarHeight-returnHeight;
				return wvHeight;
			},
			loadRewardedVideoAd(adpid){
				let that = this;
				that.isLoadingAd = true;
				rewardedVideoAd = uni.createRewardedVideoAd({
					adpid: adpid,
					urlCallback: { // 服务器回调透传参数
					  userId: '',
					  extra: ''
					}
				})
				rewardedVideoAd.onLoad(() => {
					that.isLoadingAd = false;
					console.log('api广告 onLoad event')
					
					if(that.loadAdShow==true){
						that.loadAdShow = false;
						uni.hideLoading();
						that.showAd();
					}else{
						if(that.adLoadCallback!=''){
							var result = "{code:0,errMsg:'success'}";
							that.wv.evalJS(`${that.adLoadCallback}(${result})`);
							that.adLoadCallback = '';
						}
					}
					
					// 当激励视频被关闭时，默认预载下一条数据，加载完成时仍然触发 `onLoad` 事件
				})
				rewardedVideoAd.onError((err) => {
					this.isLoadingAd = false;
					if(that.adLoadCallback!=''){
						var errs = JSON.stringify(err)
						that.wv.evalJS(`${that.adLoadCallback}(${errs})`);
						that.adLoadCallback = '';
					}
					console.log('api广告 onError event', err)
				})
				rewardedVideoAd.onClose((res) => {
					console.log('api广告 onClose event', res)
					// 用户点击了【关闭广告】按钮
					if (res && res.isEnded) {
					// 正常播放结束
						console.log("onClose " + res.isEnded);
						if(this.adShowCallback!=''){
							this.wv.evalJS(`${this.adShowCallback}( {isComplete:1} )`);
							this.adShowCallback = '';
						}
					} else {
					// 播放中途退出
						console.log("onClose " + res.isEnded);
						if(this.adShowCallback!=''){
							this.wv.evalJS(`${this.adShowCallback}( {isComplete:2} )`);
							this.adShowCallback = '';
						}
					}
				})
			},
			//激励视频广告方法
			showAd() {
				if (this.isLoadingAd) {
				  return false;
				}
				rewardedVideoAd.show();
				//this.$refs.adRewardedVideo.show();
				return true;
			},
			onadload(e) {
				this.isLoadingAd = false;
				console.log('广告数据加载成功',this.adLoadCallback);
				if(this.loadAdShow==true){
					this.loadAdShow = false;
					uni.hideLoading();
					this.showAd();
				}else{
					if(this.adLoadCallback!=''){
						this.wv.evalJS(`${this.adLoadCallback}(true)`);
						this.adLoadCallback = '';
					}

				}
			},
			onadclose(e) {
				const detail = e.detail
				// 用户点击了【关闭广告】按钮
				if (detail && detail.isEnded) {
				// 正常播放结束
					console.log("onClose " + detail.isEnded);
					if(this.adShowCallback!=''){
						this.wv.evalJS(`${this.adShowCallback}( {isComplete:1} )`);
						this.adShowCallback = '';
					}
				} else {
				// 播放中途退出
					console.log("onClose " + detail.isEnded);
					if(this.adShowCallback!=''){
						this.wv.evalJS(`${this.adShowCallback}( {isComplete:2} )`);
						this.adShowCallback = '';
					}
				}
				//this.isLoading = true;
				//this.$refs.adRewardedVideo.load();
			},
			onaderror(e) {
				// 广告加载失败
				console.log(e.detail);
				this.isLoadingAd = false;
				uni.showToast({
					title: "广告加载失败"
				})
			},
			dingzhi(url){
				
			}
			
		}
    }
</script>