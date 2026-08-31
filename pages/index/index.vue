<!-- 首页 -->
<template>
	<view :style="'background-color:'+bgcolor">
		<scroll-view scroll-y="true" :scroll-into-view="tab_link" style="height:calc(100vh - 50px);" @scrolltolower="scrollLower">
			<!-- <block v-if="customer_info.is_freeze==0&&customer_info.is_expire==0"> -->
				<!-- 然后循环获取当前组件应该去哪个应用里面找  -->
				<block v-for="(item,index) in module_list">
					<view :id="'tab-'+item.diy_tem_contid">
						<baseIndex :datas="item" :indexs="index" :page_title="page_title" ref="baseIndex" @parent_method="handelParent" ></baseIndex>
					</view>
					<tradeIndex :datas="item" :indexs="index" @parent_method="handelParent"  ></tradeIndex>
				</block>
				<!--开屏小弹窗推广弹窗start-->
				<u-popup :show="promote_bool" bgColor="transparent" mode="center" round="8" >
					<view class="promote-mask" @click="go_promote">
						<image class="promote-img" mode="widthFix" :src="promote_img"></image>
						<view class="promote-close-pic" @click.stop="promote_close_bool(false)">
							<u-icon name="close-circle" color="#ffffff" size="26"></u-icon>
						</view>
					</view>
				</u-popup>
				<!--开屏小弹窗推广弹窗end-->
				
				<!-- 新人红包侧边栏start-->
				<view :class="'red-envelope '+(red_envelopes_config.red_envelopes_show == 'left'?'left':'') + (red_envelopes_config.red_envelopes_hide?' opacity ':'')" v-if="red_envelopes_config.red_envelopes_is_show==1">
					<view  @click="go_red_envelopes">
						<image :src="red_envelopes_config.red_envelopes_img"></image>
					</view>
				</view>
				<!--新人红包侧边栏end-->
				
				<!-- （暂时不想放出来）下单提示轮播 start -->
				<!-- <block v-for="(item,index) in invite_list" >
					<view class="friend-tip" v-if="invite_show&&invite_index==index">
						<view class="link" >
							<image :src="item.headimgurl" v-if="item.headimgurl"></image>
							<span>{{item.text}}</span>
						</view>
					</view>
				</block> -->
				<!-- 下单提示轮播 end -->
			<!-- </block> -->
			<!-- <block v-else> -->
				<!--云商户过期start-->
				<!-- <image class="bg-set" :src="http_host+'/uniapp_template/web/static/images/expire_bg.jpg'" mode=""></image> -->
				<!--云商户过期end-->	
			<!-- </block> -->
		</scroll-view>
			
		<pagecom :datas="template_data"></pagecom>
	</view>
</template>

<script>
	import baseIndex from '@/components/base/baseIndex.vue'
	import tradeIndex from '@/components/trade/tradeIndex.vue'	
	import pagecom from '@/components/pagecom/pagecom.vue'	
	export default {
		components: {
			baseIndex,
			tradeIndex,
			pagecom
		},
		//分享返回
		onBackPress({from}) {
			if(from=='backbutton'){
				this.$nextTick(function(){
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		onReachBottom() {
			//监听页面滚动到底部，传输事件给子组件
			uni.$emit('onReachBottom');
		},
		data() {
			return {
				module_list:[],
				bgcolor:'#FFF',
				template_data: { has_bottom: true },//底部导航数据
				http_host: '',
				customer_info: {
					//过期时间 2023-12-31
					expire_date:"",
					//是否过期 1过期 0否
					is_expire:0,
					//是否冻结 1冻结 0否
					is_freeze:0,
				},
				page_title: '',	//页面标题
				
				//是否显示推广图
				promote_bool: false,
				//推广图跳转链接
				promote_url: '',
				//推广图图片
				promote_img: '',
				
				scrollTop: '',	//监听滚动
				//红包推广图配置
				red_envelopes_config:{
					red_envelopes_hide: false, // 是否半隐藏新人红包
					red_envelopes_is_show: false,
					red_envelopes_img: '',
					red_envelopes_url: '',
					red_envelopes_show: '',		//left 显示左边 right 显示右边
					red_envelopes_type: 'all',
					red_envelopes_day: 0,
				},
								
				uniappSet : {
				},
				
				invite_show:false,    //悬浮窗是否显示  1 显示  0 不显示
				invite_list:[],    //悬浮窗列表
				invite_page:1,     //悬浮列表页数
				invite_total_page:"",  //悬浮总页数
				invite_index:0,    //悬浮index
				invite_interval:'',//悬浮邀请定时器
				
				tab_link:'',//获取标签页跳转组件id
			}
		},
		onLoad(){
			this.uniappSet = this.vuex_uniappSet;
			this.http_host = this.vuex_apiUrl;
			if(this.vuex_base.customer_info){
				this.customer_info = this.vuex_base.customer_info;
			}
			if((this.vuex_client=='wechat'||this.vuex_client=='h5')&&this.$config.is_h5_package==true){
				
			}else{
				//APP
				this.templateCombinationSelect()
			}
			
			//开屏广告
			this.get_promote_show();
			
			//下单轮播
			//this.get_invitation();
			
		},
		onShow(){
			if((this.vuex_client=='wechat'||this.vuex_client=='h5')&&this.$config.is_h5_package==true){
				//由于打包成h5后，页面的返回按钮会回到app首页，所以加了这个页面返回
				window.history.go(-1);
			}
			//监听页面，传输事件给子组件
			uni.$emit('onShow');
		},
		methods: {
			scrollLower(ev){
				uni.$emit('scrollLowerComp');
			},
			templateCombinationSelect(){
				var _this = this;

				var module_index = "";
				if (_this.$cache.get('module_index')) {
					console.log('首页自定义模板读取缓存 ')
					module_index = _this.$cache.get('module_index')
					var lists = module_index.lists
					setTimeout(function(){
						uni.setNavigationBarTitle({
							title: module_index.title
						})
					},100)
					_this.page_title  = module_index.title
					_this.module_list = lists
					_this.bgcolor = module_index.bgcolor	
					_this.$cache.set('currenct_module_list', lists)
				}else{
					this.$api.getIndexDiyTemplate({app_examine:_this.$config.appExamine}).then(res=>{
						if (res.errcode == 0){
							var lists = res.data.lists
							// console.log(lists)
							_this.$cache.set('module_index', res.data)
							_this.$cache.set('currenct_module_list', lists)
							uni.setNavigationBarTitle({
								title: res.data.title
							})
							_this.page_title  = res.data.title
							_this.module_list = lists
							_this.bgcolor = res.data.bgcolor
						}else{
							console.log('首页自定义模板报错：', data.errmsg)
						}
					})
				}
			},
			uniShare() {
				var uniappSet = this.uniappSet;
				var share_url = this.vuex_apiUrl+'/wsy_pub/web/index.php?m=app_index&a=index&customer_id='+this.vuex_customer_id_en;
				if(this.vuex_user.user_id > 0){
					share_url += '&share_user_id='+this.vuex_user.user_id+'&is_share=1';
				}
				this.$common.doShare(share_url,
				uniappSet.app_title,
				uniappSet.app_content,
				uniappSet.app_logo_url)
			},
			// 开屏推广图片关闭
			promote_close_bool(){
				var that = this;
				that.promote_bool = false
				if(this.vuex_user.user_id){
					this.$api.updateOpenPopularize({view_user_id:this.vuex_user.user_id}).then(res=>{
						
					})
				}
				uni.setStorageSync('open_popularize_is_show', 1)
			},
			go_promote(){
				this.promote_bool = false
				this.$common.diyLinkJump(this.promote_url);
			},
			go_red_envelopes(){
				if(this.red_envelopes_config.red_envelopes_url!=''){
					this.$common.diyLinkJump(this.red_envelopes_config.red_envelopes_url);
				}
			},
			// 获取开屏推广图片配置信息
			get_promote_show(){
				let that = this;
				this.$api.promoteImageConfig({view_user_id:this.vuex_user.user_id}).then(res=>{
					if (res.errcode == 0){
						//推广海报图
						that.promote_img = res.data.image_url_popularize_http
						if(res.data.selectcon_id_popularize){
							var selectcon_id_popularize = JSON.parse(res.data.selectcon_id_popularize)
							if(res.data.link_type == 1){
								// that.promote_url = selectcon_id_popularize[2];
								if(selectcon_id_popularize[4]){
									if(selectcon_id_popularize[4].indexOf('/index.php?') == -1){
										that.promote_url = selectcon_id_popularize[2]
									}else{
										that.promote_url = selectcon_id_popularize[4]
									}
								}else{
									that.promote_url = selectcon_id_popularize[2]
								}
							}else{
								that.promote_url = res.data.diy_link;
							}
						}
						if(res.data.open_popularize_is_show == 1){
							// var open_popularize_sessionStorage = uni.getStorageSync("open_popularize_is_show");
							var open_popularize_sessionStorage = 0;
							if(open_popularize_sessionStorage){
								if(res.data.popularize_type=='one_times'){
									that.promote_bool = false
								}else{
									that.promote_bool = true
								}
							}else{
								that.promote_bool = true
							}
						}else{
							that.promote_bool = false
						}
						
						//红包图
						that.red_envelopes_config.red_envelopes_is_show = res.data.red_envelopes_is_show;
						that.red_envelopes_config.red_envelopes_show = res.data.red_envelopes_show;
						that.red_envelopes_config.red_envelopes_img = res.data.image_url_red_envelopes_http;
						that.red_envelopes_config.red_envelopes_type = res.data.red_envelopes_type;
						that.red_envelopes_config.red_envelopes_day = res.data.red_envelopes_day;
						if(res.data.selectcon_id_red_envelopes){
							var selectcon_id_red_envelopes = JSON.parse(res.data.selectcon_id_red_envelopes)
							that.red_envelopes_config.red_envelopes_url = selectcon_id_red_envelopes[2]
						}
					}
				})
			},
			
			//下单提示悬浮条方法
			invite_list_fun:function(){    
				var that = this;
				if(that.invite_index<that.invite_list.length){
					
					setTimeout(function(){
						that.invite_show = true
					},1500)
					
					that.invite_interval = setTimeout(()=>{
						that.invite_index = that.invite_index +1
						that.invite_show = false
						that.invite_list_fun()
					  },5000)
				}else{
					that.invite_page = that.invite_page +1
					that.invite_index = 0
					that.invite_show = false
					setTimeout(function(){
						that.get_invitation();
					},1000)
				}
			},
			//获取悬浮条数据
			get_invitation:function(callback){
				var that = this;
				if(that.invite_page>that.invite_total_page){
					that.invite_page = 1
				}
				that.$api.wsyuserGetCarouselData({page:that.invite_page}).then(res=>{
					if(res.errcode==0){
						if(that.invite_page==1){
							if(res.data.list.length>0){
								that.invite_show = true
							}else{
								that.invite_show = false
								return false;
							}
						}
						that.invite_list = res.data.list
						that.invite_total_page = res.data.page_total
						if(that.invite_show == true && that.invite_list && that.invite_list.length>0){
							that.invite_list_fun();
						}
					}
				})
			},
			handelParent(e){
				if(e.op=='refresh'){
					var lists = e.lists;
					if(e.template_id>0){
						if(e.old_lists){
							//暂时解决了标签栏切换分类二级页面在父页面，商品组件不请求数据的问题
							this.module_list = e.old_lists;
							setTimeout(()=>{
								this.module_list = e.lists;
							},100)
						}else{
							this.module_list = e.lists;
						}
					}else{
						this.templateCombinationSelect()
					}
				}else if(e.op=='tabSel'){
					let tablink="tab-"+e.tablink
					this.tab_link = tablink 
				}
			}
		},
		onNavigationBarButtonTap(e) {
		    if(e.type == 'menu'){
				this.uniShare();
			}
		},
		// 监听页面滚动 
		onPageScroll: function(e){
			var that = this;
			// 重点，用到滑动切换必须加上
			if(this.module_list[0].type=='new_base2'){
				this.$refs.baseIndex[0].$refs.myNewSwiper.$refs.navbar.pageScroll(e);
			}else if(this.module_list[0].type=='base2'){
				this.$refs.baseIndex[0].$refs.myswiper.$refs.navbar.pageScroll(e);
			}else if(this.module_list[0].type=='base14'){
				this.$refs.baseIndex[0].$refs.lbs.$refs.navbar.pageScroll(e);
			}else if(this.module_list[0].type=='base1'){
				this.$refs.baseIndex[0].$refs.search.$refs.navbar.pageScroll(e);
			}
			
			if(!that.red_envelopes_config.red_envelopes_is_show){
				return false;
			}
			that.scrollTop = e.scrollTop;
			that.red_envelopes_config.red_envelopes_hide = true;
			let timer= setTimeout(()=>{
				if(that.scrollTop === e.scrollTop){
					that.scrollTop  = e.scrollTop,
					that.red_envelopes_config.red_envelopes_hide = false;
					clearTimeout(timer)
				}
			},300)
		},
	}
</script>

<style>
.bg-set{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

/*开屏推广弹窗start*/
.promote-mask {
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	background-color: transparent;
	position: relative;
}
.promote-mask .promote-img{
	width: 550rpx;
	/* height: 400px; */
	/* background-color: #fff; */
	border-radius: 8px;
	margin: 0 auto;
	font-size: 0;
}
.promote-close-pic{
	  position: absolute;
	  top: -85rpx;
	  right: 0;
	  z-index: 10;
}
.promote-mask .promote-close {
	padding-right: 30rpx;
	text-align: right;
	margin: 100rpx 0 50rpx;
	font-size: 0;
}

.promote-mask .promote-close>image {
	width: 44rpx;
	height: 44rpx;
}

.promote-mask .promote-img {
	width: 600rpx;
	height: 800rpx;
	/* background-color: #fff; */
	border-radius: 16rpx;
	margin: 0 auto;
	font-size: 0;
}

.promote-mask .promote-img image {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 16rpx;
}
/*开屏推广弹窗end*/


/* 下单轮播start */
.friend-tip {
	position: fixed;
	z-index: 10;
	background: rgba(0, 0, 0, 0.6);
	font-size: 22rpx;
	color: #fff;
	top: 100rpx;
	left: 30rpx;
	border-radius: 25rpx;
	height: 50rpx;
	animation:mymove 0.5s infinite;
	-webkit-animation:mymove 0.5s; 
	display: -webkit-box; 
	display: -moz-box; 
	display: -ms-flexbox;
	display: -webkit-flex; 
	display: flex;
	-webkit-box-align: center;
	-moz-align-items: center;
	-webkit-align-items: center;
	align-items: center;
}

.friend-tip .link{
  display: -webkit-box; 
  display: -moz-box; 
  display: -ms-flexbox;
  display: -webkit-flex; 
  display: flex;
  -webkit-box-align: center;
  -moz-align-items: center;
  -webkit-align-items: center;
  align-items: center;
}

.friend-tip image {
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  display: block;
  margin-left: 6rpx;
}

.friend-tip span {
  padding: 0 20rpx 0 8rpx;
  vertical-align: middle;
  color: #fff;
}
/* 下单轮播 end */

/*新人红包start*/
.red-envelope{
    width: 120rpx;
    height: 120rpx;
    font-size: 0;
    position: fixed;
    bottom: 162rpx;
    left: calc(100% - 130rpx);
    z-index: 50;
    transition: 0.5s left;
}
.red-envelope.opacity{
  opacity: .5;
  left: calc(100% - 40rpx);
}
.red-envelope view,.red-envelope image{
    display: block;
    width: 100%;
    height: 100%;
}
.red-envelope.left{
    left: 10rpx;
}
.red-envelope.left.opacity{
  opacity: .5;
  left: -80rpx;
}
/*新人红包end*/
</style>
