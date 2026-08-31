<template>
	<view>
		<!--样式一-->
		<block v-if="navigation_list.style==1">
		    <view :class="['suspand-wrap1', navigation_list.list.length>5 && navigation_list.list.length <= 10 && show_suspend ? 'line-tow' : '', navigation_list.list.length > 10 && show_suspend? 'line-three':'', navigation_list.position == 2 ? 'suspand-flex-l':'suspand-flex-r']">
		        <view :class="['suspand-btn', show_suspend ? '':'suspand-btn-down']" @click="changeShow()">
		            <image mode="widthFix" :src="vuex_apiUrl + '/wsy_pub/admin/static/images/icon-arroww.png'"></image>
		        </view>
		
		        <block v-for="(item,index) in navigation_list.list">
		            <button hover-class="no-hover" v-if="item.url == 'contact'" :class="['suspand-item', show_suspend == false && index >= 1 ? 'suspand-hide':'']" open-type='contact'>
		                <image :src="item.icon_url"></image>
		            </button>
		            <view v-else :class="['suspand-item', show_suspend == false && index >= 1 ? 'suspand-hide':'']" @click="jump(item.url)" >
		                <image :src="item.icon_url"></image>
		            </view>
		        </block>
		        <view class='suspand-btn top-btn' @click='goTop()'>
		            <image mode="widthFix" :src="vuex_apiUrl + '/wsy_pub/admin/static/images/suspend_totop.png'"></image>
		        </view>
		    </view>
		</block>
		<!--样式二-->
		<block v-if="navigation_list.style==2">
		    <view :class="[show_suspend ? 'suspand-bg':'']">
		        <view :class="['suspand-wrap2' ,navigation_list.list.length>5 && navigation_list.list.length <= 10 && show_suspend ? 'line-tow' : '',navigation_list.list.length > 10 && show_suspend? 'line-three':'', navigation_list.position == 2 ? 'suspand-flex-l':'suspand-flex-r']">
		            <view class='suspand-box'>
		                <view :class="['suspand-btn',show_suspend ? 'suspand-btn-down':'']" @click="changeShow()" >
		                    <image mode="widthFix" :src="vuex_apiUrl + '/wsy_pub/admin/static/images/icon-rightw.png'"></image>
		                    <text v-if="show_suspend">收起</text>
		                    <text v-else>展开</text>
		
		                </view>
		                <view class='suspand-list'>
		                    <block v-if="show_suspend">
		                        <block v-for="(item,index) in navigation_list.list">
		                            <button hover-class="no-hover" v-if="item.url == 'contact'" class="suspand-item" open-type='contact'>
		                                <image :src="item.icon_url"></image>
		                            </button>
		                            <view v-else class="suspand-item" @click="jump(item.url)">
		                                <image :src="item.icon_url"></image>
		                            </view>
		                        </block>
		                    </block>
		                </view>
		            </view>
		        </view>
		    </view>
		</block>
		<!--样式三-->
		<block v-if="navigation_list.style==3">
		    <view class='suspand-wrap3 '>
		        <view class='suspand-btn' @click='changeShow()'>
		            <image mode="widthFix" :src="vuex_apiUrl+'/wsy_pub/admin/static/images/icon-addw.png'"></image>
		        </view>
		        <view class='suspand-box' v-if="show_suspend">
		            <block v-for="(item,index) in navigation_list.list">
		                <button hover-class="no-hover" v-if="item.url == 'contact'" class="suspand-item" open-type='contact'>
		                    <image :src="item.icon_url"></image>
		                </button>
		                <view v-else class="suspand-item" @click="jump(item.url)">
		                    <image :src="item.icon_url"></image>
		                </view>
		            </block>
		            <view class='suspand-box-close' @click='changeShow()'>
		                <image mode="widthFix" :src="vuex_apiUrl+'/wsy_pub/admin/static/images/icon-closeg.png'"></image>
		            </view>
		        </view>
		    </view>
		</block>
		
		<!--样式四-->
		<block v-if="navigation_list.style==4">
		    <view :class="[navigation_list.position == 2 ? 'suspand-flex-l' : 'suspand-flex-r', 'suspand-wrap4']" >
		        <view class='suspand-btn' @click="changeShow()">
		            <image mode="widthFix" :src="vuex_apiUrl+'/wsy_pub/admin/static/images/icon-addw.png'"></image>
		        </view>
		        <view class='suspand-box' v-if="show_suspend">
		            <scroll-view scroll-y>
		                <block v-for="(item,index) in navigation_list.list">
		                    <button hover-class="no-hover" v-if="item.url == 'contact'" class="suspand-item" open-type='contact'>
		                        <image :src="item.icon_url"></image>
		                    </button>
		                    <view v-else class="suspand-item" @click="jump(item.url)">
		                        <image :src="item.icon_url"></image>
		                    </view>
		                </block>
		            </scroll-view>
		
		            <view class='suspand-box-close' @click='changeShow()'>
		                <image mode="widthFix" :src="vuex_apiUrl+'/wsy_pub/admin/static/images/icon-closeg.png'"></image>
		            </view>
		
		        </view>
		    </view>
		</block>
		
		<!--样式五-->
		<block v-if="navigation_list.style==5">
		    <view class='suspand-wrap5 '>
		        <view class='suspand-btn' @click='changeShow()'>
		            <image mode="widthFix" :src="vuex_apiUrl+'/wsy_pub/admin/static/images/icon-addw.png'"></image>
		        </view>
		        <view class='suspand-box' v-if="show_suspend">
		            <block v-for="(item,index) in navigation_list.list">
		                <button hover-class="no-hover" class="suspand-item" v-if="item.url == 'contact'"  open-type='contact'>
		                    <image :src="item.icon_url"></image>
		                </button>
		                <view v-else class="suspand-item" @click="jump(item.url)">
		                    <image :src="item.icon_url"></image>
		                </view>
		                
		            </block>
		            <view class='suspand-box-close' @click='changeShow()'>
		                <image mode="widthFix" :src="vuex_apiUrl+'/wsy_pub/admin/static/images/icon-closeg.png'"></image>
		            </view>
		        </view>
		    </view>
		</block>
		
		<!--样式六-->
		<block v-if="navigation_list.style==6">
		    <view :class="['suspand-wrap6', navigation_list.position == 2 ? 'suspand-flex-l':'suspand-flex-r']">
		        <view class='suspand-btn' @click='changeShow()'>
		            <image mode="widthFix" :src="vuex_apiUrl+'/wsy_pub/admin/static/images/icon-addw.png'"></image>
		            <view class='jian' v-if="show_suspend"></view>
		        </view>
		        <view class='suspand-top '  @click="goTop()">
		            <image mode="widthFix" :src="vuex_apiUrl+'/wsy_pub/admin/static/images/suspend_totop.png'"></image>
		        </view>
		        <view :class="['suspand-box', navigation_list.list.length > 5 && navigation_list.list.length < 11 ? 'line-tow':'', navigation_list.list.length > 10 ? 'line-three':'']" v-if="show_suspend">
		            <block v-for="(item,index) in navigation_list.list">
		                <button hover-class="no-hover" v-if="item.url == 'contact'" class="suspand-item" open-type='contact'>
		                    <image :src="item.icon_url"></image>
		                </button>
		                <view v-else class="suspand-item" @click="jump(item.url)">
		                    <image :src="item.icon_url"></image>
		                </view>
		            </block>
		        </view>
		        
		        
		    </view>
		</block>
		
	</view>
</template>

<script>
	import publish from '@/components/pagecom/components/suspend/publish.js'
	const Publish = publish.publishList;
	export default {
		name:"suspend",
		props:{
			//是否有模板ID
			has_template_id:{
				type: Boolean,
				default: false
			},
			
			tem_id:{
				type: String,
				default: '0'
			}
		},
		data() {
			return {
				show_suspend: false,
				navigation_list: [],
				
				//用户所在环境 在uniapp里还是打包成h5
				user_client: 'uniapp',
			};
		},
		created(){
			var _this = this;
			
			_this.checkUserClient();
			
			if (this.has_template_id) {
				this.getNavigationById(_this.tem_id);
			    return;
			}
			if(this.user_client == "uniapp"){
				//APP菜单
				_this.templateNavigationSelect();
			}else{
				//H5菜单
				_this.templateNavigationSelectH5();
			}
		},
		methods:{
			checkUserClient(){
				var user_client = 'uniapp';
				//在APP环境
				if(this.vuex_client == 'app_android' || this.vuex_client == 'app_ios'){
					//APP 
					user_client = "uniapp";
				}else{
					//H5
					if(this.vuex_is_dev == true){
						user_client = "h5";
					}else{
						user_client = "uniapp";
					}
				}
				this.user_client = user_client;
			},
			changeShow: function() {
				this.show_suspend=!this.show_suspend
			},
			//悬浮回到顶部按钮
			goTop: function() {
				console.log('222')
			    uni.pageScrollTo({
			        scrollTop: 0,
			        duration: 0
			    })
			    this.$emit("topEvent")
			},
			/**
			 * 获取悬浮导航内容
			 */
			templateNavigationSelect: function() {
			    const _this = this;
			    var column = Publish[this.getPages()];
				if(!column){
					let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
					column = routes[routes.length - 1].route // 获取当前页面路由，
				}
				
			    if (column) {
					if(this.$cache.get('navigation_column_' + column)){
						var data = this.$cache.get('navigation_column_' + column)
						_this.callback(data);
						if (data.name) {
						    _this.navigation_list= data
						}
					}else{
						this.$api.getNavigationDiyTemplate({column: column}).then(data=>{
	
							_this.$cache.set('navigation_column_' + column, data)
							_this.callback(data);
							if (data.name) {
								_this.navigation_list= data
							}
						})
					}
			    }
			},
			
			/**
			 * 获取H5悬浮导航内容
			 */
			templateNavigationSelectH5: function() {
			    const _this = this;
			    var column = Publish[this.getPages()];
				if(!column){
					let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
					column = routes[routes.length - 1].route // 获取当前页面路由，
				}
			    if (column) {
					if(this.$cache.get('navigation_column_' + column)){
						var data = this.$cache.get('navigation_column_' + column)
						_this.callback(data);
						if (data.template) { 
						    _this.navigation_list= data
						}
					}else{ 
						var client = 'web_app_h5';
						if (this.vuex_client == 'wechat') {
							client = 'wechat';
						}
						_this.$common.requestData({
						  	url: '/wsy_pub/web/index.php?m=system&a=get_navigation_info',
						  	data: {
						  		client: client
						  	},
						  	method: "POST", 
						  	needToken: false,
						}).then(res => {
						  	if (res.data.template) { 
								//为了兼容uniapp接口的数据格式
								var list = JSON.parse(res.data.navigate_str);
								for (var i = 0; i < list.length; i++) {
									list[i]['icon_url'] = _this.vuex_apiUrl+'/resources/'+list[i]['imgUrl']
								}
								res.data.style = res.data.template
								res.data.list = list
								
								var show = _this.navigatorShowH5(res.data.funs,column);
								if(show == true){
									_this.navigation_list= res.data
									_this.$cache.set('navigation_column_' + column, _this.navigation_list)
									_this.callback(res.data);
								}
						  	}
						})
					}
			    }
			},
			
			navigatorShowH5: function(funs,column) {
				var status = false;
				if (funs) {
					for (var i = 0; i < funs.length; i++) {
						if(funs[i].indexOf(column)>=0){
							status = true;
							break;
						}
					}
				}
				return status;
			},
			
			//获取悬浮导航-byID
			getNavigationById: function(template_id) {
			    const _this = this;
			
				if(this.$cache.get('navigation_list_' + template_id)){
					var navigation_list = this.$cache.get('navigation_list_' + template_id)
					_this.navigation_list= navigation_list
					return
				}
			
				this.$api.getNavigationSon({template_id: template_id}).then(data=>{
					if (data.errcode == 0) {
					    var lists3 = data.data
					    if (lists3.name) {
					        this.$cache.set('navigation_list_' + template_id, lists3)
								
					        _this.navigation_list= lists3
					    }
					}
				})
			},
			//悬浮导航回调函数
			callback: function (res) {
			    const _this = this;
			    // 这一行就是调用页面本身的函数，把数据传过去
				this.$emit('callback',res)
			},
			getPages(){
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].route // 获取当前页面路由，也就是最后一个打开的页面路由
				if(curRoute.indexOf('pages') == 0){
					curRoute = "/"+curRoute;
				}
				return curRoute;
			},
			
			jump: function(link){
				this.$common.diyLinkJump(link)
			}
		}
	}
</script>

<style>
	.custom-suspend button{background: transparent;padding: 0}
	.custom-suspend button::after,.custom-suspend button::before{display: none}
	.suspend-scroll{height: 100%;}
	.suspand-hide{display: none !important}
	.suspand-flex-l{position: fixed;left: 10rpx;bottom: 154px;z-index: 999}
	.suspand-flex-r{position: fixed;right: 10rpx;bottom: 154px;z-index: 999}
	/*样式一*/
	.suspand-wrap1{background: rgba(0, 0, 0, 0.76);display: inline-block;text-align: center;border-radius: 4px}
	.suspand-wrap1 .suspand-item{width: 44px;height: 44px;}
	.suspand-wrap1 .suspand-item image{
	    width: 36px;
	    height: 36px;
	    margin: 4px;}
	.suspand-wrap1 .suspand-btn{
	    width: 100%;
	    height: 44px;
	    box-sizing: border-box;
	    text-align: center;
	    padding: 13.5px 0;
	}
	
	.suspand-wrap1 .suspand-btn image{
	    display: block;
	    width: 17px;
	    height: 17px;
	    margin: 0 auto;
	    transition: all 0.3s;
	}
	.suspand-wrap1 .top-btn image{
	    width: 25px
	}
	.suspand-wrap1 .suspand-btn-down{transform: rotate(180deg)}
	.suspand-wrap1.line-tow{width: 88px;display:flex;flex-wrap:wrap;}
	.suspand-wrap1.line-three{width: 132px;display:flex;flex-wrap:wrap;}
	/*样式二*/
	.suspand-wrap2.suspand-flex-l{left: 0}
	.suspand-wrap2.suspand-flex-r{right: 0}
	.suspand-bg{width: 100%;height: 100%;background: rgba(0,0,0,0.2)}
	.suspand-wrap2{text-align: left;display: inline-block}
	.suspand-wrap2 .suspand-list{box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.5);background: #fff;display: inline-block;max-width: 400rpx}
	.suspand-wrap2 .suspand-item{width: 80rpx;height: 80rpx;padding:  10rpx;display: inline-block}
	.suspand-wrap2 .suspand-item image{width: 50rpx;height: 50rpx;margin-top: 15rpx}
	.suspand-box{position: relative}
	
	.suspand-wrap2 .suspand-btn{position: absolute;left: 100%;width:120rpx;height: 100rpx;text-align: center;background: rgba(0, 0, 0, 0.6);border-radius: 0 10rpx 10rpx 0;top: 50%;margin-top: -50rpx;font-size:28rpx;line-height: 100rpx;color: #fff
	}
	.suspand-wrap2.suspand-flex-r .suspand-btn{left: -120rpx;border-radius: 10rpx 0 0 10rpx;}
	.suspand-wrap2.suspand-flex-r .suspand-list{border-radius: 10rpx 0 0 10rpx; }
	.suspand-wrap2.suspand-flex-l .suspand-list{border-radius: 0rpx 10rpx 10rpx 0rpx; }
	.suspand-wrap2.suspand-flex-r .suspand-btn image{width: 30rpx;padding-right: 10rpx;vertical-align: middle;transform: scale(-1)}
	.suspand-wrap2.suspand-flex-r .suspand-btn-down image {transform: scale(1);padding-left: 10rpx}
	
	.suspand-wrap2.suspand-flex-l .suspand-list{border-radius: 0rpx 10rpx 10rpx 0rpx; }
	.suspand-wrap2.suspand-flex-l .suspand-btn image{width: 30rpx;padding-right: 10rpx;vertical-align: middle;transform: scale(1)}
	.suspand-wrap2.suspand-flex-l .suspand-btn-down image {transform: scale(-1);}
	
	/*样式三*/
	.suspand-wrap3{background: rgba(0, 0, 0, 0.5);display: inline-block;text-align: center}
	.suspand-wrap3 .suspand-btn{
	  width:90rpx;
	  height:90rpx;
	  text-align:center;
	  margin:0 auto;
	  position:fixed;
	  bottom:200rpx;
	  right:10rpx;
	  background:rgba(0,0,0,0.6);
	  border-radius:50%;
	  line-height: 90rpx;
	  font-size: 0;
	  z-index: 10
	}
	.suspand-wrap3 .suspand-btn image{width: 40rpx;vertical-align: middle}
	.suspand-wrap3 .suspand-box{position: fixed;bottom: 0;width: 100%;display: flex;justify-content: flex-start;flex-wrap: wrap;background: #fff;padding-top:20px;z-index: 1001 }
	.suspand-wrap3 .suspand-box .suspand-item{width: 150rpx;height: 150rpx}
	.suspand-wrap3 .suspand-item image{width: 90rpx;height: 90rpx;margin-bottom: 15rpx}
	.suspand-wrap3 .suspand-box-close{width: 100%;height: 80rpx;line-height: 80rpx;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;}
	.suspand-wrap3 .suspand-box-close image{width: 45rpx;margin-top: 20rpx}
	
	/*样式四*/
	.suspand-wrap4{display: inline-block;text-align: center;height: 100%}
	.suspand-wrap4.suspand-flex-l .suspand-box{left: 0 !important;}
	.suspand-wrap4.suspand-flex-r .suspand-box{right: 0 !important;}
	.suspand-wrap4.suspand-flex-l .suspand-btn{left: 10rpx } 
	.suspand-wrap4.suspand-flex-r .suspand-btn{right: 10rpx } 
	.suspand-wrap4 .suspand-btn{
	  width:90rpx;
	  height:90rpx;
	  text-align:center;
	  margin:0 auto;
	  position:fixed;
	  bottom:200rpx;
	  background:rgba(0,0,0,0.6);
	  border-radius:50%;
	  line-height: 90rpx;
	  font-size: 0;
	  z-index: 10
	}
	.suspand-wrap4 .suspand-btn image{width: 40rpx;vertical-align: middle}
	.suspand-wrap4 .suspand-box{position: fixed;bottom: 0;width: 100px;height: 100%;display: flex;right:0;justify-content: flex-start;flex-wrap: wrap;background: #fff;padding-top:20px;z-index: 1001 ;}
	.suspand-wrap4 .suspand-box scroll-view{height: calc(100% - 40px)}
	.suspand-wrap4 .suspand-box .suspand-item{width: 150rpx;height: 150rpx;margin:10px auto;
	}
	.suspand-wrap4 .suspand-item image{width: 100rpx;height: 100rpx;margin-top: 25rpx}
	.suspand-wrap4 .suspand-box-close{width: 100%;height: 80rpx;line-height: 40px;background: #fff}
	.suspand-wrap4 .suspand-box-close image{width: 45rpx;margin-top: 20rpx}
	
	/*样式五*/
	.suspand-wrap5{background: rgba(0, 0, 0, 0.5);display: inline-block;text-align: center}
	.suspand-wrap5 .suspand-btn{
	  width:90rpx;
	  height:90rpx;
	  text-align:center;
	  margin:0 auto;
	  position:fixed;
	  bottom:200rpx;
	  right:10rpx;
	  background:rgba(0,0,0,0.6);
	  border-radius:50%;
	  line-height: 90rpx;
	  font-size: 0;
	  z-index: 10
	}
	.suspand-wrap5 .suspand-btn image{width: 40rpx;vertical-align: middle}
	.suspand-wrap5 .suspand-box{position: fixed;bottom: 0;width: 100%;display: flex;justify-content: flex-start;flex-wrap: wrap;background: rgba(0, 0, 0, 0.5);padding-top:20px;z-index: 1001 ;background: #fff}
	.suspand-wrap5 .suspand-box .suspand-item{width: 187.5rpx;height: 150rpx}
	.suspand-wrap5 .suspand-item image{width: 80rpx;height: 80rpx;margin-top: 30rpx;}
	.suspand-wrap5 .suspand-box-close{width: 100%;height: 50px;line-height: 50px;border-top: 1px solid #ccc}
	.suspand-wrap5 .suspand-box-close image{width: 45rpx;margin-top: 15px}
	
	/*样式六*/
	.suspand-wrap6{position: fixed;display: inline-block;text-align: center;bottom: 150px; }
	.suspand-wrap6.suspand-flex-l{left: 10rpx}
	.suspand-wrap6.suspand-flex-r{right: 10rpx}
	.suspand-wrap6.suspand-flex-l .suspand-box{left: 0}
	.suspand-wrap6.suspand-flex-r .suspand-box{right: 0}
	.suspand-wrap6.suspand-flex-l .suspand-box .fc-jt{left: 31rpx}
	.suspand-wrap6.suspand-flex-r .suspand-box .fc-jt{right: 31rpx}
	.suspand-wrap6 .suspand-btn{
	    width: 35px;
	    height: 35px;
	    background-color: rgba(0,0,0,0.7);
	    border-radius: 17.5px;
	    box-sizing: border-box;
	    margin-top: 10px;
	    position:relative;
	    z-index: 10;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	  
	}
	.suspand-wrap6 .suspand-top{
	    position:relative;
	    width: 35px;
	    height: 35px;
	    background-color: rgba(0,0,0,0.7);
	    border-radius: 17.5px;
	    box-sizing: border-box;
	    z-index: 10;
	    margin-top: 10px;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	  }
	.suspand-wrap6 .suspand-top image{width: 20px;}
	.suspand-wrap6 .suspand-btn image{width: 20px;}
	.suspand-wrap6 .suspand-box{
	    background-color: rgba(0,0,0,0.7);
	    border-radius: 5px;
	    padding: 5px;
	    overflow: hidden;
	    box-sizing: border-box;
	    position: absolute;bottom: 100px;display: flex;
	    flex-wrap: wrap;
	    max-height: 230px;
	    width: 54px}
	.suspand-wrap6 .suspand-box.line-tow{width: 98px}
	.suspand-wrap6 .suspand-box.line-three{width: 142px}
	.suspand-wrap6 .suspand-box .suspand-item{width: 44px;height: 44px;}
	.suspand-wrap6 .suspand-item image{
	    width: 34px;
	    height: 34px;
	    margin: 5px;}
	.suspand-wrap6 .jian{
	    position: absolute;
	    height: 5px;
	    top:-20px;
	    right: 0
	}
	.suspand-wrap6 .jian:after {
	    content: "";
	    display: block;
	    position: absolute;
	    width: 0;
	    height: 0;
	    border-left: dashed 5px transparent;
	    border-right: dashed 5px transparent;
	    border-bottom: dashed 5px transparent;
	    border-top: solid 5px rgba(0,0,0,0.7);
	    top: 0;
	    right: 13px;
	}
	
</style>
