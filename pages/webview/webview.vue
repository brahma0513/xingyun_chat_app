<template>
    <view>
		<view>
			<web-view ref="webview" :src="weburl" @message="handlePostMessage"></web-view>
		</view>
		<view  v-if="show_pagecom">
			<pagecom :datas="template_data"></pagecom>
		</view>
		
		<view>
			<!-- 激励视频 1507000689 -->
		    <!-- <ad-rewarded-video ref="adRewardedVideo" :adpid="adpid" :preload="false" :loadnext="false" :disabled="true"
		        v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror">
				<view class="ad-error" v-if="error">{{error}}</view>
			</ad-rewarded-video> -->
		</view>
    </view>
</template>

<script>
	var wv;//计划创建的webview
	var rewardedVideoAd;	//计划创建的激励视频
	var shares=null;
	import pagecom from '@/components/pagecom/pagecom.vue'	
    export default {
		components: {
			pagecom
		},
        data() {
            return {
				show_pagecom: true,	//是否显示底部菜单和悬浮
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
				
				show_back_button: true,	//是否显示返回菜单
				
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
				
				weixin_mini_info: {
					appid: '',
					orginid: '',
				},	//商户小程序配置
            }
        },
		onReady(){
			
		},
		onShow() {
			this.check_is_pay_type()
		},
		onLoad(e) {
			var that = this;
			
			that.setBarStyle();
				
			if(e.is_bottom){
				this.is_bottom = e.is_bottom
			}
			// this.weburl = 'https://www.yimenapp.com/doc/demo_tz.cshtml';
			//先获取链接参数 否则获取缓存
			// 路由参数：login/协议等用 weburl；buyMovie、score、open_vip 等历史写法用 url，需同时支持，否则 e.weburl 为空会误用本地缓存的上一次 H5 地址
			var incomingWeb = e.weburl || e.url;
			if(incomingWeb){
				this.weburl = incomingWeb
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
			that.dingzhi(this.weburl);
			//后台分享页面设置
			that.sharePageSet = that.vuex_appServerSet.SharePage_set;
			that.weixin_mini_info = that.vuex_base.weixin_mini_info;

			//this.weburl = 'https://oemkangshifu.st.wsy010.cn/team_reward/web/index.php?m=team_interface&a=index&customer_id=czo0OiI1MzI3Ijs&user_agent=third_program_h5&request_mode=fortune_app&customer_id=5327&third_token='+this.vuex_user.token;
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
				that.do_extra_url();
				return;
			}
			
			 
			that.show_back_button = that.check_is_show_back_button();
			
			that.getShareUrl();
			
			
			// #ifdef APP-PLUS
			var useragent = plus.navigator.getUserAgent();
			
			if(useragent.indexOf('isapp_xingdian_app')<0){
				//useragent = useragent.replace("uni-app","uni-app third_program_h5 {huiju_mini_pay:[app:xingdian_app]} h5_login not_navigation app_share_select app-framework-model-2 isapp_xingdian_app");
				useragent = useragent +"third_program_h5 {huiju_mini_pay:[app:xingdian_app]} h5_login not_navigation isapp_xingdian_app app_share_select app-framework-model-2";
			}
			//useragent = useragent.replace("Html5Plus/1.0","");
			if(that.vuex_apiUrl != 'https://yun.new.xingdian666.com'){
				plus.navigator.setUserAgent(useragent);
			}
			
			// 如果后台开启了分享获取分享服务
			if(that.sharePageSet.is_open_share==1){
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
			}
				
				
			var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效

			setTimeout(function() {
				wv = currentWebview.children()[0];
				if(that.vuex_webview_bottom==true){
					// wv.setStyle({
					// 	height:uni.getSystemInfoSync().windowHeight-38-uni.getSystemInfoSync().statusBarHeight,
					// })
				}
				
				var currentUrl = wv.getURL();
				that.currentPageUrl = currentUrl;
				
				//监听页面是否可以返回上一页
				wv.addEventListener('progressChanged',function(e) {
					// console.log("页面progressChanged")
					currentUrl = wv.getURL();
					that.currentPageUrl = currentUrl;
					wv.canBack(e => {
						//console.log("e.canBack==",e.canBack)
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
					
					//是否显示底部菜单和悬浮导航
					that.check_is_show_pagecom()
					if(that.show_pagecom==false){
						wv.setStyle({
							height:uni.getSystemInfoSync().windowHeight,
						})
					}else{
						if(that.vuex_webview_bottom==true){
							wv.setStyle({
								height:that.change_wv_height(),
							})
						}
					}
					
				},false);
				
				
				that.checkIsCanShare(currentUrl);
				
				//监听页面标题
				wv.addEventListener('titleUpdate', function(e){
					// console.log("titleUpdate")
					currentUrl = wv.getURL();
					that.currentPageTitle = e.title;
					if(that.shareParam.title==''){
						that.shareParam.title = that.currentPageTitle;
					}
					that.checkIsCanShare(currentUrl);
					
					//云平台登陆链接
					var is_login_page = false;	//是否登录页面
					var ypt_login_url = '/wsy_user/web/index.php?m=login&a=login';
					var index = currentUrl.indexOf(ypt_login_url);
					if(index>=0){
						is_login_page = true;
					}
					var index2 = currentUrl.indexOf('wsy_user');
					var index3 = currentUrl.indexOf('m=login&a=login');
					if(index2 >= 0 && index3 >= 0){
						is_login_page = true;
					}
					if(e.title == "密码登录" || e.title == "用户登录"){
						is_login_page = true;
					}
					if(is_login_page==true){
						that.$common.exitLogin()
						//跳转APP登陆
						uni.setStorageSync("weburl", that.weburl)
						var back_route = '/pages/webview/webview'; 
						uni.reLaunch({
							url: '/public/pages/user/login'
						});
					}
					
					
					//云平台个人中心链接					
					var is_person_page = false;	//是否个人中心页面
					var ypt_person_url = '/wsy_pub/web/index.php?m=app_index&a=personal_center';
					var person = currentUrl.indexOf(ypt_person_url);
					if(person>=0 && e.title == "个人中心"){
						is_person_page = true;
					}
					var person2 = currentUrl.indexOf('wsy_pub');
					var person3 = currentUrl.indexOf('m=app_index&a=personal_center');
					if(person2 >= 0 && person3 >= 0 && e.title == "个人中心"){
						is_person_page = true;
					}
					if(e.title == "个人中心"){
						//is_person_page = true;
					}
					if(e.title == "APP个人中心"){
						is_person_page = true;
					}
					if(is_person_page==true){
						//跳转APP个人中心
						uni.reLaunch({
							url: '/pages/personal_center/personal_center'
						});
					}
					
					//云平台首页		
					var is_index_page = false;	//是否云平台首页
					var ypt_index_url = '/wsy_pub/web/index.php?m=app_index&a=index';
					var yptindex = currentUrl.indexOf(ypt_index_url);
					if(yptindex>=0){
						is_index_page = true;
					}
					var yptindex2 = currentUrl.indexOf('template_id');
					if(yptindex2 >= 0){
						is_index_page = false;
					}
					
					if(e.title == "APP首页"){
						is_index_page = true;
					}
					if(is_index_page==true){
						//跳转APP首页
						uni.reLaunch({
							url: '/pages/index/index'
						});
					}
					
					if(e.title == "购物车" || currentUrl.indexOf('m=shop&a=shop_cart')){
						if(that.vuex_user.user_id <=0 ){
							uni.showModal({
							  title: "提示",
							  content: "请先登录",
							  confirmText: "登录",
							  success: function (res) {
							    if (res.confirm) {
							      uni.redirectTo({
							        url: "/public/pages/user/login" ,
							      });
							    } else if (res.cancel) {
							    }
							  },
							});
						}
						return true;
					}
					
					//是否显示底部菜单和悬浮导航
					that.check_is_show_pagecom()
					if(that.show_pagecom==false){
						wv.setStyle({
							height:uni.getSystemInfoSync().windowHeight,
						})
					}else{
						if(that.vuex_webview_bottom==true){
							wv.setStyle({
								height:that.change_wv_height(),
							})
						}
					}
				}, false); 
				
				//监听页面加载完成
				wv.addEventListener('loaded', function(e){
					// console.log("loaded")
					currentUrl = wv.getURL();
					that.currentPageUrl = currentUrl;
					that.checkIsCanShare(currentUrl);
					
					
					//是否显示底部菜单和悬浮导航
					that.check_is_show_pagecom()
					if(that.show_pagecom==false){
						wv.setStyle({
							height:uni.getSystemInfoSync().windowHeight,
						})
					}else{
						if(that.vuex_webview_bottom==true){
							wv.setStyle({
								height:that.change_wv_height(),
							})
						}
					}
					
				})
				
				//是否显示底部菜单和悬浮导航
				that.check_is_show_pagecom()
				if(that.show_pagecom==false){
					// wv.setStyle({
					// 	height:uni.getSystemInfoSync().windowHeight,
					// })
				}else{
					if(that.vuex_webview_bottom==true){
						wv.setStyle({
							height:that.change_wv_height(),
						})
					}
				}
				
				
				// wv.appendJsFile('_www/static/mui.min.js') 
				setTimeout(function(){  
					wv.appendJsFile('_www/static/zhuru/uni.webview.1.5.2.js')  
					wv.appendJsFile('_www/static/zhuru/waibu.js')  
				},1000)  
				// wv.appendJsFile('_www/static/js/mui.min.js')
				// wv.appendJsFile('_www/static/js/script.js')
				
				
				//拦截器，此处修改拦截规则  
				// wv.overrideUrlLoading({ mode:'reject',match:".*m=app_index&a=index.*"}, function(e) {
				// 	console.log("进来拦截器1")
				//     console.log(e.url)
					
				// 	var yptindex2 = e.url.indexOf('template_id');
				// 	if(yptindex2 >= 0){
				// 		//二级页面
				// 		return true;
				// 	}else{
				// 		//跳转APP首页
				// 		uni.reLaunch({
				// 			url: '/pages/index/index'
				// 		});
				// 	}
				// }); 
				// wv.overrideUrlLoading({mode:"reject"}, (e) => {
				// 	console.log("进来拦截器2")
				// 			console.log(e.url)
				// })
				
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
		// onBackPress(e) {
		// 	if (this.wv && this.canBack) {  
		// 	   this.wv.back()  
		// 	   //返回上一层 
		// 	   return true  
		// 	} 
		// 	//关闭页面
		//     let pages = getCurrentPages()  
		// 	let page = pages[pages.length - 1];  
		// 	let currentPages = page.$getAppWebview()  
		// 	currentPages.close()
		// 	return false
		// },
		
		
		// onBackPress(e) {  
		//   if (e.from === 'navigateBack') {  			
		// 	let pages = getCurrentPages()
		// 	let page = pages[pages.length - 1];
		// 	let currentPages = page.$getAppWebview()
		// 	let children = currentPages.children()
		// 	children[0].close()
		// 	return false;
		//   }  
		//   // #ifdef APP-PLUS  
		//   if (this.wv && this.canBack) {  
		// 		console.log("后退")
		// 	this.wv.back()  
		// 	return true  
		//   }  
		//   // #endif  
		// },  
		
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
			//可以分享的链接
			getShareUrl(){
				var arr = new Array();
				//首页
				arr.push({
					type: 'index',
					url: '/wsy_pub/web/index.php?m=app_index&a=index'
				});
				//商城产品详情页
				arr.push({
					type: 'shop_product_detail',
					url: '/shop/mshop/web/index.php?m=product&a=product_detail'
				});
				//商城产品列表
				arr.push({
					type: 'shop_product_list',
					url: '/shop/mshop/web/index.php?m=product&a=product_list'
				});
				//大礼包产品列表
				arr.push({
					type: 'giftbag_product_list',
					url: '/giftbag/web/index.php?m=giftbag&a=index'
				})
				//大礼包产品详情
				arr.push({
					type: 'giftbag_product_detail',
					url: '/giftbag/web/index.php?m=giftbag&a=index#/productDetail'
				})
				//拼购活动
				arr.push({
					type: 'pingou_activity_detail',
					url: '/pingou/web/index.php?m=activity&a=activity_detail'
				})
				//元森定制的页面
				arr.push({
					type: 'zisenaoyuan_activity_detail',
					url: '/zisenaoyuan/web/index.php?m=activity&a=activity_detail'
				})
				//红绿积分定制的页面
				arr.push({
					type: 'red_green_product_detail',
					url: '/red_green_integral/web/index.php?m=product&a=pro_detail'
				})
				//砍价产品详情
				arr.push({
					type: 'bargain_product_detail',
					url: '/bargain/web/index.php?m=product&a=pro_detail'
				})
				//砍价邀请砍一刀
				arr.push({
					type: 'bargain_bargain_detail',
					url: '/bargain/web/index.php?m=bargain&a=bargain_detail'
				})
				//秒杀产品详情
				arr.push({
					type: 'seckill_product_detail',
					url: '/seckill/web/index.php?m=activity&a=activity_product_detail'
				})
				//积分商城的页面
				arr.push({
					type: 'integral_product_detail',
					url: '/integral_shop/web/index.php?m=product&a=pro_detail'
				})
				//短视频电商的页面
				arr.push({
					type: 'svod_user_vide',
					url: '/svod/web/index.php?m=video&a=user_vide'
				})
				//短视频电商的页面
				arr.push({
					type: 'svod_video_page_list',
					url: '/svod/web/index.php?m=video&a=video_page_list'
				})
				//优米cps产品详情
				arr.push({
					type: 'youmi_cps_pro_detail',
					url: '/youmi_cps/web/index.php?m=product&a=pro_detail'
				})
				//联通卡产品详情
				arr.push({
					type: 'unicom_phone_card_pro_detail',
					url: '/unicom_phone_card/web/index.php?m=product&a=product_detail'
				})
				//联通卡产品列表
				arr.push({
					type: 'unicom_phone_card_pro_list',
					url: '/unicom_phone_card/web/index.php?m=product&a=product_list'
				})
				//佰农荟短视频电商的页面
				arr.push({
					type: 'bnh_svideo_user_vide',
					url: '/bnh_svideo/web/index.php?m=video&a=user_vide'
				})
				//佰农荟短视频电商的页面
				arr.push({
					type: 'bnh_svideo_video_page_list',
					url: '/bnh_svideo/web/index.php?m=video&a=video_page_list'
				})
				//O2o店铺
				arr.push({
					type: 'offline_shopping_shop_list',
					url: '/offline_shopping/web/index.php?m=allPage&a=shop'
				})
				arr.push({
					type: 'o2o_wein_shop_list',
					url: '/o2o_wein/web/index.php?m=allPage&a=shop'
				})
				arr.push({
					type: 'book_classes_course_detail',
					url: '/book_classes/web/index.php?m=course&a=online_course_detail'
				})
				//大转盘
				arr.push({
					type: 'guaguaka_dazp',
					url: '/guaguaka/dazp/web/h5/index.html'
				})
				//砸金蛋
				arr.push({
					type: 'guaguaka_zajindan',
					url: '/guaguaka/zajindan/web/h5/index.html'
				})
				//砸金蛋
				arr.push({
					type: 'guaguaka_nnd',
					url: '/guaguaka/nnd/web/h5/index.html'
				})
				//异业联盟
				arr.push({
					type: 'shop_league_store_detail',
					url: '/shop_league/web/index.php?m=store&a=store_detail'
				})
				arr.push({
					type: 'shop_league_store_list',
					url: '/shop_league/web/index.php?m=store&a=store_list'
				})
				arr.push({
					type: 'shop_league_product_detail',
					url: '/shop_league/web/index.php?m=product&a=product_detail'
				})
				
				this.canShareUrl = arr;
			},
			//判断当前链接是否可以分享
			checkIsCanShare(page_url){
				var canShareUrl = this.canShareUrl;
				var canShare = false;
				let that = this;
				if(that.sharePageSet.is_open_share==0){
					//关闭了分享
					return;
				}
				console.log("校验是否可以分享",page_url)
				for (var i = 0; i < canShareUrl.length; i++) {
					//console.log("循环判断分享链接",canShareUrl[i])
					var index = page_url.indexOf(canShareUrl[i].url);
					//console.log("循环判断分享链接结果",index)
					this.extra_do_key = '';
					if(index >= 0){
						//满足礼包链接，礼包链接比较特殊 需要单独处理
						if(canShareUrl[i].type=='giftbag_product_list'){
							this.shareParam.title = this.currentPageTitle;
							this.extra_do_key = 'giftbag_product_list';
							if(this.currentPageTitle=='礼包详情'||this.currentPageTitle.length>4||page_url.indexOf('#/productDetail')){
								//礼包详情
								canShare = true;
								break;
							}else{
								var is_not_share = this.not_share_url('giftbag',page_url)
								if(is_not_share==false){
									canShare = true;
									break;
								}
							}
						}else if(canShareUrl[i].type=='offline_shopping_shop_list'){
							this.shareParam.title = this.currentPageTitle;
							canShare = true;
							break;
						}else if(canShareUrl[i].type=='o2o_wein_shop_list'){
							this.shareParam.title = this.currentPageTitle;
							canShare = true;
							break;
						}else{
							canShare = true;
							break;
						}
						
					}
				}
				//暂时全部隐藏分享
				//canShare = false;
				// console.log("设置分享标题",that.currentPageTitle)
				that.canShare = canShare;
				that.shareParam.url = page_url;
				that.setShareBtn();
			},
			//设置分享按钮
			setShareBtn(){
				//获取当前page信息
				var pages = getCurrentPages();
				var page = pages[pages.length - 1];
				var currentWeb = page.$getAppWebview();
				var tn = currentWeb.getStyle().titleNView;
				var canShare = this.canShare
				var hasIndex = false;	//底部菜单的H5页面是否保留首页按钮
				let that = this;
				if(canShare == true){
					tn.buttons[0].type = 'menu';
					tn.buttons[0].color = that.barFrontColor;
				}else{
					tn.buttons[0].type = 'none';
					tn.buttons[0].color = '#FFFFFF';
					this.hideShare();
				}
				if(that.is_bottom==1){
					if(that.currentPageUrl.indexOf('https://46mkls.sda4.top')>=0||that.currentPageUrl.indexOf('/llm_chat/web/index.php?m=chat&a=index')>=0){
					 	hasIndex = true;
					}
					
					if(hasIndex==true){
					 	tn.buttons[1].type = 'home';
					 	tn.buttons[1].color = that.barFrontColor;
					}else{
						if(that.canBack==false){
							tn.buttons[1].type = 'none';
							tn.buttons[1].color = '#FFFFFF';
						}else{
							tn.buttons[1].type = 'home';
							tn.buttons[1].color = that.barFrontColor;
						}
					}
				}else{
					tn.buttons[1].type = 'home';
					tn.buttons[1].color = that.barFrontColor;
				}
				currentWeb.setStyle({
					titleNView: tn
				});
			},
			uniShare() { 
				var uniappSet = this.vuex_uniappSet;
				var url = this.shareParam.url;
				if(url==''){
					return;
				}
				var share_url = url.split("?")[0];
				var share_arr = this.queryURLparams(url);
				var share_url_jing = '';
				if(this.extra_do_key == 'giftbag_product_list'){
					var jing_res = this.do_jing_url(url);
					share_url_jing = jing_res.jing_url;
					share_url = share_url.split("?")[0];
					share_arr = this.queryURLparams(jing_res.url);
				}

				var share_tile = this.shareParam.title || this.sharePageSet.share_title;
				var share_descripe = this.shareParam.descripe || this.sharePageSet.share_descripe;
				var share_image = this.shareParam.image || this.sharePageSet.share_image;

				var j = 0;
				var has_customer_id = false;	//是否有customer_id
				for (let i in share_arr) {
					if(i == 'user_agent'||i == 'request_mode'||i == 'third_token'){
						continue;
					}
					if(j==0){
						share_url += '?'+i+'='+share_arr[i]
					}else{
						share_url += '&'+i+'='+share_arr[i]
					}
					if(i=='customer_id'){
						has_customer_id = true;
					}
					j++;
				}
				if(this.vuex_user.user_id > 0){
					share_url += '&share_user_id='+this.vuex_user.user_id+'&is_share=1';
				}
				if(has_customer_id==false){
					share_url += '&customer_id='+this.vuex_customer_id;
				}
				
				if(this.extra_do_key == 'giftbag_product_list'){
					share_url += share_url_jing;
				}
				console.log('share_url',share_url)
				console.log('share_tile',share_tile)
				this.$common.doShare(share_url,
				share_tile,
				share_descripe,
				share_image)
			},
			
			hideShare(){
				this.$common.hideShare();
			},
			
			//解析url
			queryURLparams: function (url) {
			    let obj = {}
			    if (url.indexOf('?') < 0) return obj
			    let arr = url.split('?')
			    url = arr[1]
			    let array = url.split('&')
			    for (let i = 0; i < array.length; i++) {
			        let arr2 = array[i]
			        let arr3 = arr2.split('=')
			        obj[arr3[0]] = arr3[1]
			    }
			    return obj
			
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
					var app_appid = return_value.app_appid;
					var path = return_value.path;
					var openParam = {};
					if(orginid!=""&&path != undefined && path!=""){
						shares?shares.launchMiniProgram({
								id:orginid,
								path: path,
								type: 0 //0-正式版；1-测试版；2-体验版；默认值为0；
							}):plus.nativeUI.alert('当前环境不支持微信操作!');
						return;
					}else if(app_appid!=""&&path != undefined && path!=""){
						shares?shares.launchMiniProgram({
								appId:app_appid,
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
					if(return_value.type == 2){
						//uni-ad广告
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
					}else if(return_value.type == 'zjsdk_2'){
						if(that.weixin_mini_info.orginid==''){
							uni.showToast({
								title: "微信小程序未配置"
							})
							return;
						}
						//众简广告激励视频
						shares?shares.launchMiniProgram({
								id: that.weixin_mini_info.orginid,
								path: '/ad_task/pages/open/partner_ads_reward?order_id='+order_id,
								type: 0 //0-正式版；1-测试版；2-体验版；默认值为0；
							}):plus.nativeUI.alert('暂未配置微信参数!');
						return;
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
					
				}else if(event=='hideAppBottom'){
					//隐藏底部菜单
					console.log("隐藏底部菜单")
					this.show_pagecom = false;
					if(this.show_pagecom==false){
						wv.setStyle({
							height:uni.getSystemInfoSync().windowHeight,
						})
					}else{
						if(this.vuex_webview_bottom==true){
							wv.setStyle({
								height:that.change_wv_height(),
							})
						}
					}
				}else if(event=='showAppBottom'){
					//显示底部菜单
					console.log("显示底部菜单")
					this.show_pagecom = true;
					if(this.show_pagecom==false){
						wv.setStyle({
							height:uni.getSystemInfoSync().windowHeight,
						})
					}else{
						if(this.vuex_webview_bottom==true){
							wv.setStyle({
								height:that.change_wv_height(),
							})
						}
					}
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
				}else if(event=='openQrCode'){
					//打开扫一扫
					var return_value  = return_data[0]['value'];
					that.adLoadCallback = return_value.callback_name || '';
					uni.scanCode({
						success: function (res) {
							console.log('条码类型：' + res.scanType);
							console.log('条码内容：' + res.result);
							if(that.adLoadCallback!=''){
								var result = "{from_app:'xingdian_app',scanType:'"+res.scanType+"',result:'"+res.result+"'}";
								that.wv.evalJS(`${that.adLoadCallback}(${result})`);
								that.adLoadCallback = '';
							}else{
								if(res.scanType=='QR_CODE'){
									var result = res.result;
									var check_ypt_url = result.indexOf(that.vuex_apiUrl);
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
			
			//特殊链接不能分享
			not_share_url(type,page_url){
				var not_share = [];
				var is_not_share = false;	//true 当前链接不能分享
				not_share.push({					
					//链接类型
					type : 'giftbag',
					//链接标识
					key  : '/order/',
				})
				for (var i = 0; i < not_share.length; i++) {
					var index = -1;
					if(not_share[i].type == type){
						index = page_url.indexOf(not_share[i].key)
						if(index >= 0){
							is_not_share = true;
							break;
						}
					}					
				}
				return is_not_share;
			},
			
			do_jing_url: function(link){
				var result   = {
					jing_url : '',
					url : link,
				};
				var jing_url = "";
				var jing = link.indexOf('#');
				if(jing >=0 ){
					//带#的链接
					result.jing_url = link.slice(jing)
					result.url = link.slice(0,jing)
				}
				return result;
			},
			
			//检查当前是否支付选择页面，是的话就刷新当前页面
			check_is_pay_type(){
				var is_pay_page = false;	//是否支付页面
				var currentPageUrl = this.currentPageUrl || '';
				// 尚未从子 WebView 取到 URL 时不处理，避免误刷
				if(!currentPageUrl){
					return;
				}
				var ypt_pay_url = '/wsy_pay/web/index.php?m=pay&a=pay_type';
				var pay = currentPageUrl.indexOf(ypt_pay_url);
				if(pay>=0){
					is_pay_page = true;
				}else{
					ypt_pay_url = '/wsy_pay/web/index.php?m=pay&a=history_back';
				    pay = currentPageUrl.indexOf(ypt_pay_url);
					if(pay>=0){
						is_pay_page = true;
					}
				}
				if(is_pay_page==true){
					// 已带 xdflag 则不再改 :src，避免 onShow 反复触发导致整页重复加载（部分机型上 wsy_pay 页脚本异常）
					if(currentPageUrl.indexOf('xdflag=') >= 0){
						return;
					}
					let timestamp = new Date().getTime();
					var joiner = (currentPageUrl.indexOf('?') >= 0) ? '&' : '?';
					this.weburl = currentPageUrl + joiner + 'xdflag=' + timestamp;
				}
			},
			
			//是否显示返回按钮方法
			check_is_show_back_button(){
				var show_back_button = true;	//是否显示返回按钮
				if(this.weburl.indexOf('/hy_blind_box/web/index.php')>=0&&(this.weburl.indexOf('/pages/goods/index')>=0||this.weburl.indexOf('/pages/order/box')>=0||this.weburl.indexOf('page_uri=%2Fpages%2Fgoods%2Findex')>=0||this.weburl.indexOf('page_uri=%2Fpages%2Forder%2Fbox')>=0)){
					show_back_button = false;
				}
				return show_back_button;
			},
			
			//是否显示底部菜单方法
			check_is_show_pagecom(){
				//当前访问链接
				var currentPageUrl = this.currentPageUrl;
				//由于每个链接的规则不一样只能自己判断
				var show_pagecom = true;	//显示底部菜单和悬浮导航 https://ypt.yueyihe.com.cn/hy_blind_box/web/index.php?m=index&a=im
				if(currentPageUrl.indexOf('/hy_blind_box/web/index.php?m=index&a=im')>=0){
					show_pagecom = false;
				}
				//红绿积分产品详情
				if(currentPageUrl.indexOf('/red_green_integral/web/index.php?m=product&a=pro_detail')>=0){
					show_pagecom = false;
				}
				//红绿积分订单确认
				if(currentPageUrl.indexOf('/red_green_integral/web/index.php?m=order_create&a=order_confirm')>=0){
					show_pagecom = false;
				}				
				//红绿积分产品列表
				if(currentPageUrl.indexOf('/red_green_integral/web/index.php?m=product&a=pro_list')>=0){
					show_pagecom = false;
				}
				//商城产品详情 https://cloud.yibailingshou.com/shop/mshop/web/index.php?m=product&a=product_detail
				if(currentPageUrl.indexOf('/shop/mshop/web/index.php?m=product&a=product_detail')>=0){
				 	show_pagecom = false;
				}
				//商城订单确认
				if(currentPageUrl.indexOf('/shop/mshop/web/index.php?m=shop&a=confirm_info')>=0){
				 	show_pagecom = false;
				}
				//选择支付方式
				if(currentPageUrl.indexOf('/wsy_pay/web/index.php?m=pay&a=pay_type')>=0){
				 	show_pagecom = false;
				}
				//选择支付方式
				if(currentPageUrl.indexOf('/wsy_pay/web/index.php?m=pay&a=history_back')>=0){
				 	show_pagecom = false;
				}
				//选择支付方式
				if(currentPageUrl.indexOf('/wsy_pub/web/index.php?m=app_index&a=personal_center')>=0){
				 	show_pagecom = false;
				}
				//优米cps产品详情
				if(currentPageUrl.indexOf('/youmi_cps/web/index.php?m=product&a=pro_detail')>=0){
				 	show_pagecom = false;
				}
				//联通卡产品详情
				if(currentPageUrl.indexOf('/unicom_phone_card/web/index.php?m=product&a=product_detail')>=0){
				 	show_pagecom = false;
				}
				//供应商管理
				if(currentPageUrl.indexOf('/shop/supply/web/index.php?m=business&a=store_management')>=0){
				 	show_pagecom = false;
				}
				if(currentPageUrl.indexOf('/chat/web/index.php')>=0&&currentPageUrl.indexOf('/pages/home/chat')>=0){
					show_pagecom = false;
				}
				//供应商商品列表
				if(currentPageUrl.indexOf('/shop/supply/web/index.php?m=business_product&a=pro_list')>=0){
				 	show_pagecom = false;
				}
				//供应商上传商品
				if(currentPageUrl.indexOf('/shop/supply/web/index.php?m=business_product&a=pro_detail')>=0){
				 	show_pagecom = false;
				}
				//CPS不要菜单
				if(currentPageUrl.indexOf('/cps/web/index.php?m=resource&a=resource_jump')>=0){
				 	show_pagecom = false;
				}
				//必应鸟页面
				if(currentPageUrl.indexOf('https://46mkls.sda4.top')>=0){
				 	show_pagecom = false;
				}
				//星云同城服务
				if(currentPageUrl.indexOf('/offline_service/web/index.php')>=0){
					if(currentPageUrl.indexOf('/pages/goods_details/goods_details')>=0){
						show_pagecom = false;
					}
					if(currentPageUrl.indexOf('/pages/employee/details')>=0){
						show_pagecom = false;
					}
					if(currentPageUrl.indexOf('/pages/order/order_pay')>=0){
						show_pagecom = false;
					}
				}
				//青鸟项目
				if(currentPageUrl.indexOf('/bird_business/')>=0){
					show_pagecom = false;
				}
				if(currentPageUrl.indexOf('/bird_regional/')>=0){
					show_pagecom = false;
				}
				if(currentPageUrl.indexOf('/bird_store/')>=0){
					show_pagecom = false;
				}
				if(currentPageUrl.indexOf('/llm_chat/web/index.php?m=chat&a=index')>=0){
					show_pagecom = false;
				}
				
				//特殊客户特殊处理
				if(this.vuex_apiUrl == 'https://cloud.yibailingshou.com'){
					show_pagecom = false;
					if(currentPageUrl.indexOf('/red_green_integral/web/index.php?m=index&a=otayonii_market')>=0){
						show_pagecom = true;
					}
					if(currentPageUrl.indexOf('/red_green_integral/web/index.php?m=cart&a=pro_cart')>=0){
						show_pagecom = true;
					}
					if(currentPageUrl.indexOf('/pages/hall/hall')>=0){
						show_pagecom = true;
					}
				}
				this.show_pagecom = show_pagecom;
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
			
			do_extra_url(){
				let that = this;
				console.log("进入外部链接")
				// #ifdef APP-PLUS
				var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效

				var pages = getCurrentPages();
				var page = pages[pages.length - 1];
				var currentWeb = page.$getAppWebview();
				var tn = currentWeb.getStyle().titleNView;
				tn.buttons[1].type = 'home';
				tn.buttons[1].color = that.barFrontColor;
				currentWeb.setStyle({
					titleNView: tn
				});
				
				setTimeout(function() {
					wv = currentWebview.children()[0];
					
					//监听页面是否可以返回上一页
					wv.addEventListener('progressChanged',function(e) {
						var currentUrl = wv.getURL();
						that.currentPageUrl = currentUrl;

						console.log('监听页面是否可以返回上一页')
						wv.canBack(e => {
							that.canBack = e.canBack
							if(that.is_bottom==1){
								if(e.canBack==false){
									that.show_back_button = false
								}else{
									that.show_back_button = true
								}
							}
							var tn = currentWebview.getStyle().titleNView;
							tn.buttons[1].type = 'home';
							tn.buttons[1].color = that.barFrontColor;
							tn.autoBackButton = that.show_back_button
							currentWebview.setStyle({
								titleNView:tn
							})
						}) 
					},false);
					that.show_pagecom=false
					//是否显示底部菜单和悬浮导航
					that.check_is_show_pagecom()
					if(that.show_pagecom==false){
						
					}else{
						if(that.vuex_webview_bottom==true){
							wv.setStyle({
								height:that.change_wv_height(),
							})
						}
					}
					
					that.wv = wv;
				}, 1000); //如果是页面初始化调用时，需要延时一下
				// #endif
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
				if(url.indexOf('/chat/web/index.php?m=index&a=user_list')>=0){
					uni.redirectTo({
						url: '/pages/webview_custom/webview_custom'
					})
					return;
					uni.setNavigationBarStyle({
					  style: 'custom', // 可选值为: 'default', 'custom'
					  success: function () {
						console.log('Navigation bar style set to default');
					  },
					  fail: function (err) {
						console.error('Failed to set navigation bar style:', err);
					  }
					});
				}
				if(url.indexOf('/llm_chat/web/index.php?m=chat&a=index')>=0){
					uni.redirectTo({
						url: '/pages/webview_diy/webview_diy'
					})
					return;
				}
			}
			
		}
    }
</script>