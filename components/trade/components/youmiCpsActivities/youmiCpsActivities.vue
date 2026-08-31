<template>
	<view :style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 0'+ (datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px'">
		<view class="shop_group_container shop_group">
			<u-sticky :offsetTop="titleHeight" :customNavHeight="titleHeight">
				<!--样式一-->
				<view class="shop_group_title" v-if="datas.content.css_type==1||datas.content.css_type==0">
					<view class="shop_group_box display-flex">
						<view class="shop_group_list flex-1">
							<view class="li" style="width:auto;" v-for="(itm,index) in  datas.content.dataset"
								:class="datas.content.nav_index===index?'active skin-color-'+theme:''" @click="tab_nav(itm,index)">
								<span class="" style="max-width:100px;white-space:nowrap;overflow:hidden;">{{itm.select_value}}</span>
								<view :class="'line pp skin-bg-'+theme"></view>
							</view>
						</view>
						<view class="shop_group_sort" @click="tab_type()" :class="{'rotate':!datas.content.type}">
							<image :src="http_host+'/HTML/admui/public/custom/images/icon_jian_bottom.png'"></image>
						</view>
					</view>
					<view v-if="!datas.content.type" class="shop_group_box shop_group_box_btn">
						<view class="ul shop_group_data">
							<view class="li" v-for="(itm,index) in  datas.content.dataset"
								:class="datas.content.nav_index === index?'active skin-bg-'+theme:''" @click="tab_nav(itm,index)">
								{{itm.select_value}}</view>
						</view>
					</view>
				</view>
				<!--样式二-->
				<view class="shop_group_title" v-if="datas.content.css_type==2" style="height:63px;">
					<view class="shop_group_box">
						<view class="shop_group_list" style="height:63px;">
							<view class="li" style="width:auto;" v-for="(itm,index) in  datas.content.dataset"
								:class="datas.content.nav_index===index?'active skin-color-'+theme:''" @click="tab_nav(itm,index)">
								<span class="">{{itm.title}}</span>
								<view class="vice_title">
									<span :class="datas.content.nav_index === index?'active skin-bg-'+theme:''">{{itm.vice_title}}</span>
								</view>
							</view>
						</view>
					</view>
				</view>			
			</u-sticky>
	
			<view v-if="!datas.content.type" @click="tab_type()" class="svod-mask"></view>
			
			<view class="goods_super trade70007">
				<view class="shop_group_content display-flex"
					:style="datas.content.slideEffect" >
					<view class="shop_group_list_content" :style="'width:'+((phonewidth-15)-7)+'px;padding-top:10px;'">
						
						<view class="shop_group_ul_left" :style="'width:'+((phonewidth-15)/2-7)+'px;float: left;'" >
							<view class="li" @click="shopGoDetail(itm)" v-for="(itm,index) in datas.content.pros"
								v-if="(index + 1) % 2 != 0">
								<view class="shop_group_content_bg"
									:style="'height:'+((phonewidth-15)/2-15)+'px;width:100%'">
									<view class="shop_group_img display-flex" :style="'width:100%'">
										<image :style="'height:'+((phonewidth-15)/2-15)+'px'" :src="itm.pro_img" alt=""></image>
										<view class="sold_out_img" :style="'height:'+((phonewidth-15)/2-15)+'px'"
											v-if="itm.storenum<=0">
											<image :src="itm.stock_out_img?itm.stock_out_img:http_host+'/shop/mshop/web/static/images/sold_out01.png'"
												style="width:90px;height:90px;"></image>
										</view>
									</view>
								</view>
								<view class="goods_name">
									<image style="max-width:8%;float:left;margin: 3px 2px 0 0;" :src="itm.platform_icon" mode="widthFix" alt=""></image>
									{{itm.pro_name}}
								</view>
								<!-- 店铺信息 -->
								<view class="goods_name" style="margin-top: 3px;max-height: 20px;">
									<image style="max-width:7%;float:left;margin: 3px 2px 0 0;" :src="http_host+'/youmi_cps/web/static/images/store_logo.png'" mode="widthFix" alt=""></image>
									<span class="" style="font-size: 12px;">{{itm.shop_name}}</span>	
								</view>
								<view class="goods_name"
									style="position: relative; margin-top: 7px;display: inline-block;width: auto;" v-if="itm.coupon_money>0">
									<image style="width:70px;height: 23px;" :src="http_host+'/youmi_cps/web/static/images/juan_logo.png'"
										alt=""></image>
									<view
										style="position: absolute;z-index: 3;left: 16px;top: 1.8px; width: auto;height: 100%;color:white;font-size: 12px;">
										券{{show_monetary_unit}}{{itm.coupon_money}}
									</view>
								</view>
	
								<!--价格-->
								<view class="goods_price display-flex"
									style="margin-top: 3px;align-items: center;justify-content: space-between;">
									<view class="display-flex" style="align-items: center;">
										<view class="span big">{{show_monetary_unit}}</view>
										<view class="span big_s">{{itm.orgin_price}}</view>
										<view class="span big_m">{{show_monetary_unit}}{{itm.price}}</view>
									</view>
								</view>
								<view class="pro_count" v-if="datas.content.show_sale==1">
									已售{{itm.pro_count}}
								</view>
								<!--价格end-->
								<!--销量-->
							</view>
						</view>
						<view class="shop_group_ul_right" :style="'width:'+((phonewidth-15)/2-7)+'px;float: right;'">
							<view class="li" @click="shopGoDetail(itm)" v-for="(itm,index) in datas.content.pros"
								v-if="(index + 1) % 2 == 0">
								<view class="shop_group_content_bg"
									:style="'height:'+((phonewidth-15)/2-15)+'px;width:100%'">
									<view class="shop_group_img display-flex" :style="'width:100%'">									
										<image :style="'height:'+((phonewidth-15)/2-15)+'px'" :src="itm.pro_img" alt=""></image>
										<view class="sold_out_img" :style="'height:'+((phonewidth-15)/2-15)+'px'"
											v-if="itm.storenum<=0">
											<image :src="itm.stock_out_img?itm.stock_out_img:http_host+'/shop/mshop/web/static/images/sold_out01.png'"
												style="width:90px;height:90px;"></image>
										</view>
									</view>
								</view>
								<view class="goods_name">
									<image style="max-width:8%;float:left;margin: 3px 2px 0 0;" :src="itm.platform_icon" mode="widthFix" alt=""></image>
									{{itm.pro_name}}
								</view>
								<!-- 店铺信息 -->
								<view class="goods_name" style="margin-top: 3px;max-height: 20px;">
									<image style="max-width:7%;float:left;margin: 3px 2px 0 0;" :src="http_host+'/youmi_cps/web/static/images/store_logo.png'" mode="widthFix" alt=""></image>
									<span class="" style="font-size: 12px;">{{itm.shop_name}}</span>
	
								</view>
								<view class="goods_name"
									style="position: relative; margin-top: 7px;display: inline-block;width: auto;" v-if="itm.coupon_money>0">
									<image style="width:70px;height: 23px;" :src="http_host+'/youmi_cps/web/static/images/juan_logo.png'"
										alt=""></image>
									<view
										style="position: absolute;z-index: 3;left: 16px;top: 1.8px; width: auto;height: 100%;color:white;font-size: 12px;">
										券{{show_monetary_unit}}{{itm.coupon_money}}
									</view>
								</view>
	
								<!--价格-->
								<view class="goods_price display-flex"
									style="margin-top: 3px;align-items: center;justify-content: space-between;">
									<view class="display-flex" style="align-items: center;">
										<view class="span big">{{show_monetary_unit}}</view>
										<view class="span big_s">{{itm.orgin_price}}</view>
										<view class="span big_m">{{show_monetary_unit}}{{itm.price}}</view>
									</view>
								</view>
								<view class="pro_count" v-if="datas.content.show_sale==1">
									已售{{itm.pro_count}}
								</view>
	
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	    
	</view>
</template>

<script>
	export default {
		name: "youmiCpsActivities",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				show_monetary_unit: getApp().globalData.monetary_unit,
				trade70007Page: 1,
				trade70007Load: false,
				is_init_pro: false,	//是否需要初始化数据
				//吸顶高度，由于首页采用了自定义标题栏
				titleHeight:0,
				datass:0
				
			};
		},
		watch: {
			slider: {
				handler() {

				},
				deep: true
			}
		},
		created() {
			const that = this;
			this.http_host = this.vuex_apiUrl
			var indexHeadHeight = uni.getStorageSync('indexHeadHeight') || this.statusBarHeight+44;			
			//标题栏高度 再一点点高度4
			this.titleHeight = (indexHeadHeight-4) / 2;
			console.log("titleHeight",this.titleHeight)
			this.youmi_cps_getdata();
			
		},
		mounted() {
			let that = this;
			uni.$on('scrollLowerComp',()=>{
				console.log('首页组件触底传送')
				if(!that.trade70007Load){
					that.trade70007Load = true
					that.trade70007Page++
					that.shop_type_get_list_70007(that.datas.content.dataset[that.datas.content.nav_index])
				}
			})
			uni.$on('onReachBottom', () => {
				console.log('触底')
				// if(!that.trade70007Load){
				// 	that.trade70007Load = true
				// 	that.trade70007Page++
				// 	that.shop_type_get_list_70007(that.datas.content.dataset[that.datas.content.nav_index])
				// }
				
			})
		},

		/**
		 * 组件的方法列表
		 */
		methods: {
			
			handletrade70007Scroll(ev){
				// console.log(ev)
				if($(ev.target)[0]['scrollTop'] + $(ev.target)[0]['clientHeight'] + 50 >= $(ev.target)[0]['scrollHeight'] && !this.trade70007Load){
					this.trade70007Load = true
					this.trade70007Page++
					this.shop_type_get_list_70007(this.datas.content.dataset[this.datas.content.nav_index])
				}
			},
			scrollLower(ev){
				if(!this.trade70007Load){
					this.trade70007Load = true
					this.trade70007Page++
					this.shop_type_get_list_70007(this.datas.content.dataset[this.datas.content.nav_index])
				}
			},
			
			shopGroupTouchStart: function (ev) {
				ev = ev || event;
				// event.preventDefault();
				if (ev.touches.length == 1) { //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
					this.datas.content.startX = ev.touches[0].clientX; // 记录开始位置
					this.datas.content.startY = ev.touches[0].clientY; // 记录开始的Y位置
				}
			},
	
			shopGroupTouchMove: function (ev) {
				ev = ev || event;
				if (ev.touches.length == 1) {
					//滑动时距离浏览器左侧的距离
	
					this.datas.content.moveX = ev.touches[0].clientX;
					this.datas.content.moveY = ev.touches[0].clientY;
					//实时的滑动的距离-起始位置=实时移动的位置
					this.datas.content.lengthX = this.datas.content.moveX - this.datas.content.startX
					this.datas.content.lengthY = this.datas.content.moveY - this.datas.content.startY
					this.datas.content.disX = this.datas.content.moveX - this.datas.content.startX;
					// 左右滑动
					if (Math.abs(this.datas.content.lengthX) > Math.abs(this.datas.content.lengthY)) {
						ev.preventDefault();
						if (this.datas.content.disX > 0 && this.datas.content.nav_index == 0 || this.datas.content.disX < 0 && this.datas.content.nav_index == this.datas.content.time_list.length - 1) {
							this.datas.content.slideEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
							this.datas.content.viceEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
							this.datas.content.is_color = ""
							return
						}
						this.datas.content.slideEffect = "transition-duration: 0ms;transform: translate3d(" + this.datas.content.disX + "px, 0px, 0px);"
						this.datas.content.viceEffect = "transition-duration: 0ms;transform: translate3d(" + (-this.datas.content.disX) + "px, 0px, 0px);"
						this.datas.content.is_color = "color:#999;"
					} else {
						// 上下滑动
						this.datas.content.slideEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
						this.datas.content.viceEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
						this.datas.content.is_color = ""
					}
	
				}
			},
			shopGroupTouchEnd: function (ev) {
				ev = ev || event;
				if (ev.changedTouches.length == 1) {
					this.datas.content.endX = ev.changedTouches[0].clientX; //X结束距离
					this.datas.content.endY = ev.changedTouches[0].clientY; //y轴结束距离
					this.datas.content.lengthX = this.datas.content.endX - this.datas.content.startX
					this.datas.content.lengthY = this.datas.content.endY - this.datas.content.startY
	
	
					this.datas.content.disX = this.datas.content.endX - this.datas.content.startX;
					// 获取tab元素宽
					var index = 0
					if (this.datas.content.nav_index > 0) {
						index = this.datas.content.nav_index - 1
					}
					var left = $('.shop_group_list li:eq(' + index + ')')[0].offsetWidth
					// 获取ul的滚动条位置
					var left_s = $('.shop_group_list').scrollLeft()
					// 是左右滑动
					if (Math.abs(this.datas.content.lengthX) > Math.abs(this.datas.content.lengthY)) {
						ev.preventDefault();
						if (this.datas.content.disX < -0) {
							if (this.datas.content.nav_index == this.datas.content.time_list.length - 1) {
								this.datas.content.nav_index = this.datas.content.time_list.length - 1
							} else {
								this.datas.content.nav_index++
	
								if (this.datas.content.nav_index >= 3) {
									$('.shop_group_list').scrollLeft(left + left_s)
								} else if (this.datas.content.nav_index < 3) {
									$('.shop_group_list').scrollLeft(0)
								}
							}
							this.datas.content.slideEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
							this.datas.content.viceEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
							this.datas.content.is_color = ""
	
	
						} else if (this.datas.content.disX > 0) {
							if (this.datas.content.nav_index <= 0) {
								this.datas.content.nav_index = 0
							} else {
								this.datas.content.nav_index--
								if (this.datas.content.nav_index >= 3) {
									$('.shop_group_list').scrollLeft(left_s - left)
								} else if (this.datas.content.nav_index < 3) {
									$('.shop_group_list').scrollLeft(0)
								}
							}
							this.datas.content.slideEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
							this.datas.content.viceEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
							this.datas.content.is_color = ""
						}
						var itm = this.datas.content.time_list[this.datas.content.nav_index]
						this.datas.content.pros = [];
						this.datas.content.group_id = itm.id;
						this.datas.content.page = 1;
						this.shop_type_get_list_70007(itm);
	
					} else {
						this.datas.content.slideEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
						this.datas.content.viceEffect = "transition-duration: 0ms;transform: translate3d(0px, 0px, 0px);"
						this.datas.content.is_color = ""
					}
				}
			},
			// 切换tab样式
			tab_type: function () {
				this.datas.content.type = !this.datas.content.type;
			},
			// tab切换
			tab_nav: function (itm, ind) {
				this.datas.content.nav_index = ind;
				this.datas.content.group_id = itm.id;
				this.datas.content.page = 1;
				this.trade70007Page = 1;
				this.datas.content.pros = [];
				this.is_init_pro = true;
				// // 存储到本地
				uni.setStorageSync('index11', ind);										
				var index = ind - 1
				var left = 0
				// 防止模式一点击错位
				this.datas.content.time_list.forEach((el, index) => {
					if ((index < this.datas.content.nav_index) && this.datas.content.nav_index > 0) {
						//left = left + $('.shop_group_list li:eq(' + index + ')')[0].offsetWidth
					}
	
				})
				if (this.datas.content.nav_index >= 3) {
					// $('.shop_group_list').scrollLeft(left - $('.shop_group_list li:eq(' + index + ')')[0].offsetWidth)
				} else if (this.datas.content.nav_index < 3) {
					//$('.shop_group_list').scrollLeft(0)
				}
				// 获取数据列表
				this.datas.content.page = 1;
				this.trade70007Page = 1;
				this.shop_type_get_list_70007(itm);
			
			},
			//初始化数据
			init_pro_data(){
				this.datas.content.pros = [];
				this.datas.content.page = 1;
				this.trade70007Page = 1;
				
			},
			// 跳转到商品详情页
			shopGoDetail: function (itm) {
				var id = itm.pro_id
				var platform_id = itm.platform_id
				var url = "/youmi_cps/web/index.php?m=product&a=pro_detail&id=" + id + '&platform_id=' + platform_id + '&customer_id=' + this.vuex_customer_id
				this.$common.diyLinkJump(url, "h5", true);
			},
			
			//获取数据
			youmi_cps_getdata() {
				let that = this;
				if(uni.getStorageSync('index11')>0){
					this.datass = uni.getStorageSync('index11')
				}else{
					this.datass=0
				}		
				that.$common.requestData({
					url: "/youmi_cps/web/index.php?m=product&a=get_pro_list&customer_id=" + that.vuex_customer_id,
					data: {
						'page[page]': that.trade70007Page,
						'page[page_size]': 20,
						'search[act_id]': that.datas.content.dataset[that.datass].selector_id,
					}, 
					method: "POST", 
					needToken: true,
				}).then(res => {
					if (res.errcode == 0) {
						var pros = [];
						if (res.data.length > 0) {
							for (var i in res.data) {
								var data = res.data[i]
								pros.push({
									"pro_id": data.id,
									"pro_img": data.url,
									"pro_count": data.queue_sum,
									"pro_name": data.pro_name,
									"price": data.price,
									"orgin_price": data.orgin_price,
									"platform_icon": data.platform_icon,
									"coupon_money": data.coupon_money,
									"shop_name": data.shop_name,
									"platform_id": data.platform_id,
									"stock_out_img": '',//售罄图标
									"storenum": data.stock,
								})
							}
						}
						that.datas.content.pros = pros;
					}
				})
			},
			
			shop_type_get_list_70007(itm) {
				let that = this;
			    var api_url = "/youmi_cps/web/index.php?m=product&a=get_pro_list&customer_id=" + that.vuex_customer_id;
			    var web_url = "/youmi_cps/web/index.php?m=product&a=get_pro_list&customer_id=" + that.vuex_customer_id;
			
			    //平台有传user_id
			    if (this.vuex_user.user_id>0) {
			        this.shop_type_get_list_70007_request(itm, api_url)
			    }
			    //没有传user_id
			    else {
			        // 调用web接口判断是否登录
					that.$common.requestData({
						url: '/youmi_cps/web/index.php?m=product&a=get_login_fun',
						data: {}, 
						method: "POST", 
						needToken: true,
					}).then(res => {
						//已经登录
						if (res.errcode == 0) {
						    that.shop_type_get_list_70007_request(itm, web_url)
						}
						//没有登录
						else {
						    that.shop_type_get_list_70007_request(itm, api_url)
						}
					})
			    }
			},
			shop_type_get_list_70007_request(itm, url) {
				let that = this;
				that.$common.showLoading('数据加载中')
				that.$common.requestData({
					url: url,
					data: {
						'page[page]': that.trade70007Page,
						'page[page_size]': 20,
						'search[act_id]': itm.selector_id,
					}, 
					method: "POST", 
					needToken: true,
				}).then(res => {
					uni.hideLoading();					
					if (res.errcode == 0) {
					    var pros = [];
					    if (res.data.length > 0) {
					        for (var i in res.data) {
					            var data = res.data[i]
					            pros.push({
					                "pro_id": data.id,
					                "pro_img": data.url,
					                "pro_count": data.queue_sum,
					                "pro_name": data.pro_name,
					                "price": data.price,
					                "orgin_price": data.orgin_price,
					                "platform_icon": data.platform_icon,
					                "coupon_money": data.coupon_money,
					                "shop_name": data.shop_name,
					                "platform_id": data.platform_id,
					                "origin_pro_data": JSON.stringify(data),//接口返回的原始数据，用于缓存
					                "stock_out_img": '',//售罄图标
					                "storenum": data.stock,
					            })
					        }
					    }
					    that.datas.content.pros = [...that.datas.content.pros, ...pros];
					    that.trade70007Load = false
						that.$nextTick(()=>{
				        document.getElementsByClassName('uni-scroll-view')[1].scrollTop = document.getElementsByClassName('shop_group_container ')[0].offsetTop - 30})
	
				// var parentValue = {
				// 	"op": 'tabSel',
				// 	"tablink": that.datas.diy_tem_contid
				// };
				// console.log(parentValue)
				// that.$emit('handelParent',parentValue)
					}
				})
			}
			
		},
		computed:{
			//获取系统状态栏高度
			statusBarHeight(){
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight
			},
			//获取窗口宽度
			phonewidth(){
				var that = this;
				//screenWidth
				return uni.getSystemInfoSync().windowWidth
			}
		},
		
	}
	
</script>

<style>
	.custom-integral-shop {
	    width: 100%;
	    background: #fff;
	    box-sizing: border-box;
	    padding: 0 15px;
	}
	.custom-integral-shop .type1 .integral-shop-img-wrap {
	    width: 100%;
	    height: 175px;
	    position: relative;
		border-radius:4px;
		overflow:hidden;
	}
	.custom-integral-shop .integral-shop-img-wrap {
	    width: 100%;
	    position: relative;
		border-radius:4px;
		overflow:hidden;
	}
	.custom-integral-shop .custom-integral-shop-item image {
	    width: 100%;
	    height: 100%;
	    position: absolute;
	    top: 0;
	    object-fit: cover;
	}
	.custom-integral-shop .integral-shop-img-wrap:after {
	    position: relative;
	    content: '';
	    display: block;
	    padding-bottom: 75%;
	}
	.custom-integral-shop .type2 .integral-shop-img-wrap:after{
		padding-bottom:100%;
	}
	.custom-integral-shop .custom-integral-shop-item.type2 {
	    width: calc(50% - 7.5px);
	    display: inline-block;
		padding:15px 0;
	}
	
	.custom-integral-shop .custom-integral-shop-item.type2:nth-child(2n) {
	    margin-left: 15px;
	}
	
	.custom-integral-shop .custom-integral-shop-item.type2 .p .integral-shop-name {
	    margin-bottom: 3px;
	}
	.custom-integral-shop .custom-integral-shop-item.type1{
		padding:15px 0;
		display:block
	}
	.custom-integral-shop .p .integral-shop-name1  {
	    font-size: 14px;
	    color: #333;
	    height: 36px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    word-wrap:break-word;
	    word-break: break-word;
	    padding: 0;
	    margin: 5px 0;
	    line-height: 1.3;
	    letter-spacing: 1px; 
	}
	.custom-integral-shop .p .integral-shop-name1.title1 {
	    height: 38px
	}
	
	.custom-integral-shop .price1 {
	    color: #333333;
	    font-size: 12px;
		display:inline-block;
		line-height: 24px;
	}
	.custom-integral-shop .price1.t2 {
	    color: #333333;
	    font-size: 12px;
		line-height:1;
		display:inline-block;
		float: left;
	}
	.custom-integral-shop .price1 big {
	    font-size: 15px;
	    color: #f24f4c;
	    font-weight: 600
	}
	.custom-integral-shop .span .sell-count1 {
	    float: left;
	    font-size: 12px;
	    color: #999;
		text-decoration:line-through
	}
	.custom-integral-shop .span .sell-count1.t2 {
	    float: left;
	    font-size: 12px;
	    color: #999;
		line-height:1;
		text-decoration:line-through
	}
	.custom-integral-shop .span .sell-count2 {
	    float: right;
	    font-size: 12px;
	    color: #999;
	}
	.custom-integral-shop .integral-price .jifen {
	    font-size: 12px;
	}
	.custom-integral-shop .span .btn {
	    width: 80px;
	    line-height: 27px;
	    background-color: #7F8AEF;
	    color: #ffffff;
	    text-align: center;
	    font-size: 13px;
	    border-radius: 4px;
	}
	.flex1 {
	    display:flex;
	    align-items: center;
	    justify-content:space-between
	}
	.flex2 {
	    display:flex;
	    align-items: center;
	    justify-content: center
	}
	/*积分商城组件End*/
	
	
	
	.member-price-size{
	    font-size: 14px;
	}
	.member-price-box{
	    vertical-align:middle;
	}
	.member-price-bg{
	    font-size: 9px;
	    display: inline-block;
	    background: #000;
	    padding: 0 3px;
	    position: relative;
	    margin-left: 5px;
	}
	.member-price-bg::before{
	    content: '';
	    display: block;
	    position: absolute;
	    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAKUlEQVQYV2PUVpdv/s/IlM/IwMD7//+/ViDNwKCmJiXCwsha9p+B4SYAmSIIyWAL9SAAAAAASUVORK5CYII=) no-repeat;
	    top: 0;
	    left: -3px;
	    width: 4px;
	    height: 2px;
	}
	.member-price{
	    font-size: 9px;
	    display: inline-block;
	    color: #FFFFFF;
	    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#FFC694), to(#FFE2C2));
	    -webkit-background-clip: text;
	    -webkit-text-fill-color: transparent;
	}
	
	/*特权省*/
	.member-dis {
	    font-size: 10px;
	    height: 16px;
	    line-height: 17px;
	    border-radius:8px;
	    overflow: hidden;
	    display: inline-block;
	    margin-bottom: 7px;
	    white-space: nowrap;
	}
	
	.member-dis-bg {
	    display: inline-block;
	    background: #000;
	    padding: 0 3px 0 8px;
	    position: relative;
	    height: 20px;
	}
	
	.member-dis-price {
	    font-size: 9px;
	    display: inline-block;
	    color: #FFFFFF;
	    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#FFC694), to(#FFE2C2));
	    -webkit-background-clip: text;
	    -webkit-text-fill-color: transparent;
	    position: relative;
	    top: -0.5px;
	}
	.member-dis-fg{
	    position: relative;
	}
	.member-dis-fg>.span{
	    display: block;
	    height: 24px;
	    width: 8px;
	    background-color: #000;
	    position: absolute;
	    top: -4px;
	    left: -5px;
	    transform: rotate(10deg);
	}
	.member-dis-right{
	    color: #FFFFFF;
	    display: inline-block;
	    height: 16px;
	    padding: 0 10px 0 10px;
	    background: -webkit-linear-gradient(left, #FFC1A2 , #FF6D25); /* Safari 5.1 - 6.0 */
	    background: -o-linear-gradient(right, #FFC1A2, #FF6D25); /* Opera 11.1 - 12.0 */
	    background: -moz-linear-gradient(right, #FFC1A2, #FF6D25); /* Firefox 3.6 - 15 */
	    background: linear-gradient(to right, #FFC1A2 , #FF6D25); /* 标准的语法（必须放在最后）*/
	}
	
	/*商品分组商城版本1.6.0*/
	.display-flex{
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: flex;
	}
	.flex-1{
	    -webkit-box-flex: 1;
	    -ms-flex: 1;
	    -webkit-flex: 1;
	    flex: 1;
	    width: 50%;
	}
	
	.shop_group_container{
	    position: relative;
	}
	.shop_group .shop_group_title{
	    width: 100%;
	    position: relative;
	    left: 0;
	    top: 0;
	    height: 45px;
	    /* 1/29 */
	    z-index: 10;
	    background: #fff;
	}
	.shop_group .shop_group_box{
	    font-size: 0;
	    width: 100%;
	    background-color: #fff;
	    padding: 0 10px;
	    box-sizing: border-box;
	}
	.shop_group .shop_group_box.shop_group_box_btn{
	    position: absolute;
	    left: 0;
	    top: 40px;
	    padding: 0;
	}
	.shop_group .shop_group_list{
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: flex;
	    white-space: nowrap;
	    overflow-x: scroll;
	    justify-content: space-around;
	}
	.shop_group .shop_group_select{
	    height: 40px;
	    line-height: 40px;
	    font-size: 14px;
	    color: #333;
	    padding-left: 5px;
	}
	.shop_group .shop_group_sort{
	    width: 40px;
	}
	.shop_group .shop_group_sort>image{
	    width: 14px;
	    height: 14px;
	    margin: 13px;
	}
	.shop_group .shop_group_sort.rotate>image{
	    transform:rotate(180deg);
	    -ms-transform:rotate(180deg); /* IE 9 */
	    -webkit-transform:rotate(180deg); /* Safari and Chrome */
	}
	.shop_group .shop_group_list::-webkit-scrollbar {
	    display: none;
	}
	.shop_group .shop_group_list .li{
	    padding: 0 5px;
	    box-sizing: border-box;
	    text-align: center;
	    font-size: 0;
	    color: #333;
	    /*1/28*/
	    /* margin-right: 10px; */
	}
	.shop_group .shop_group_list .li>span{
	    display: inline-block;
	    position: relative;
	    font-size: 15px;
	    line-height: 1;
	    /*12/15*/
	    padding: 14px 5px 5px;
	    /*1/28*/
	    font-weight:600;
	}
	/*1/21*/
	.shop_group .shop_group_list .li .vice_title{
	    display: -webkit-box;
	    display: -moz-box;
	    display: -ms-flexbox;
	    display: -webkit-flex;
	    display: flex;
	    -webkit-box-pack: center;
	    -moz-justify-content: center;
	    -webkit-justify-content: center;
	    justify-content: center;
	    -webkit-box-align: center;
	    -moz-align-items: center;
	    -webkit-align-items: center;
	    align-items: center;
	    position: relative;
	}
	.shop_group .vice_back{
	    position: absolute;
	    background: #FF0036;
	}
	.shop_group .goods_super{
	    display:flex;
	    overflow: hidden;
	}
	/*1/21end*/
	.shop_group .shop_group_list .li .vice_title span{
	    color: #999;
	    font-size: 11.5px;
	    display: -webkit-box;
	    display: -moz-box;
	    display: -ms-flexbox;
	    display: -webkit-flex;
	    display: flex;
	    -webkit-box-pack: center;
	    -moz-justify-content: center;
	    -webkit-justify-content: center;
	    justify-content: center;
	    -webkit-box-align: center;
	    -moz-align-items: center;
	    -webkit-align-items: center;
	    align-items: center;
	    width: 59px;
	    height: 18px;
	    border-radius: 10px;
	    padding: 0 3px;
	}
	.shop_group .shop_group_list .li .vice_title span.active{
	    font-size: 12px;
	    color: #fff;
	    /*background: #FF0036;*/
	
	}
	.shop_group .shop_group_list .li .line{
	    display: none;
	    width: 15px;
	    height: 3px;
	    border-radius: 1.5px;
	    background-color:#FF0036;
	    margin: 0 auto;
	}
	.shop_group .shop_group_list .li.active{
	    color: #FF0036;
	}
	.shop_group .shop_group_list .li.active .line{
	    display: block;
	}
	.shop_group .shop_group_data{
	    padding: 15px 15px 0;
	}
	.shop_group .shop_group_data>.li{
	    display: inline-block;
	    height: 25px;
	    margin-bottom: 15px;
	    margin-right: 10px;
	    font-size: 14px;
	    color: #5d5d5d;
	    border-radius: 4px;
	    background-color: #F5F5F5;
	    /*12/15*/
	    line-height: 27px;
	    text-align: center;
	    padding: 0 15px;
	}
	.shop_group .shop_group_data .li.active{
	    background-color: #FF0036;
	    color: #fff;
	}
	
	.shop_group .svod-mask{
	    width: 100%;
	    height: 100%;
	    background-color: #000;
	    opacity: .6;
	    position: absolute;
	    top: 0;
	    left: 0;
	    /* 1/29 */
	    z-index: 9;
	}
	
	/* 商品列表start */
	.shop_group .shop_group_content{
	    /*1/28*/
	    padding: 15px;
	    background-color: #f0f0f0;
	    box-sizing: border-box;
	    /*1/28*/
	    /*3/5*/
	    padding-top: 0px;
	    min-height: 80vh;
	}
	.shop_group .shop_group_content::-webkit-scrollbar {
	    display: none;
	}
	.shop_group .shop_group_content .ul{
	    font-size: 0;
	    width: calc(50% - 5px);
	}
	.shop_group .shop_group_content .shop_group_ul_left{
	    margin-right: 7px;
	}
	.shop_group .shop_group_content .li{
	    margin-bottom: 18.5px;
	    background: #fff;
	    border-radius: 5px;
	}
	.shop_group .shop_group_content_bg{
	    /*12/15*/
	    height: 192px;
	    position: relative;
	    /*1/28*/
	    margin-bottom: 7px;
	    overflow: hidden;
	    /*1/28*/
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
	.shop_group .shop_group_content_bg .shop_group_img{
	    height: 100%;
	    /**1/28/
	    /*background-color: #F5F5F5;*/
	    align-items: center;
	    justify-content: center;
	    /*1/28*/
	}
	.shop_group .shop_group_content_bg .shop_group_img>image{
	    max-width: 100%;
	    /*1/28*/
	    width: 100%;
	    /* max-height: 100%; */
	    /* border-radius: 4px; */
	    border-top-left-radius: 5px;
	    border-top-right-radius: 5px;
	}
	/*8/31*/
	.shop_group .shop_group_content_bg .shop_group_img .sold_out_img{
	    width: 100%;position: absolute;left: 0;top: 50%;z-index: 3;transform: translateY(-50%);background: rgba(0,0,0,0.4);height: 100%;display: flex;
	    align-items: center;
	    justify-content: center;
	}
	/*8/31end*/
	.shop_group .goods_name{
	    font-size: 14px;
	    color: #5d5d5d;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp: 2;
	    word-break: break-all;
	    font-weight: 500;
		width: 94%;
		padding-left: 5px;
		line-height: 20px;
		max-height: 40px;
	    padding-left: 5px;
	}
	.shop_group .goods_price{
	    color: #333;
	    padding: 0 5px;
	}
	.shop_group .goods_price .big{
	    /*1/28*/
	    font-size: 13px;
	    color: red;
	}
	.shop_group .goods_price .big_m{
	    /*1/28*/
	    font-size: 13px;
	    text-decoration: line-through;
	    margin-left: 10px;
	    color: #7f7f7f;
	}
	.shop_group .goods_price .big_s{
	    /*1/28*/
	    font-size: 16px;
	    color: red;
	}
	.shop_group .pro_count{
	    color: #999;
	    font-size: 11px;
		padding: 5px;
	}
	/* 商品列表end */
	/*商品分组end*/
	/* 控制层的样式11/26 */
	.position-r{position:relative}
	.trade70007 .list-img{
	    position: absolute;
	    display: none;
	    width: 200px;
	    top: -100px;
	    left: 200px;
	    border: 1px solid #e5e5e5;
	    height: 300px;
	    overflow: hidden;
	}
	.trade70007 .control-list{overflow:visible}
	.trade70007 .position-r a:hover + .list-img{display:block}
	
	.trade70007 .dataset-add{ min-width: 40px;
	    width: 40px;
	    height: 40px;
	    display: block;
	    padding: 0;
	    margin: 0 auto;
	    line-height: 40px;
	    border-radius: 50%;
	    margin-bottom: 10px;
	}
	.trade70007 .control_list1{
	    position: relative;
	    border-radius: 5px;
	    border: 1px solid #e5e5e5;
	    padding: 45px 0;
	    margin-bottom: 15px;
	}
	.trade70007 .huodong_1{
	    position: absolute;
	    top: 10px;
	    left: 10px;
	    font-size: 14px;
	    color: #999;
	}
	.trade70007 .edit-menu{
	    position: absolute;
	    top: 8px;
	    right: 10px;
	}
	.trade70007 .edit-menu i{
	    color: #e4eaec;
	    font-size: 16px;
	}
	/*3/5*/
	.shop_group_list_content::-webkit-scrollbar{
	    display: none;
	}
	
	/*商品组件static*/
	.border-dashed-hui{
	    border: dashed 1px #f1f4f5;
	}
	.line-height-100{
	    line-height: 100px;
	}
	.border-radius-5{
	    border-radius: 5px;
	}
	.shop-remove{
	    position: absolute !important;
	    top: 5px;
	    right: 5px;
	    z-index: 10;
	    font-size: 14px;
	    cursor: pointer;
	}
	.shop-modul-ul{
	    padding: 0 15px;
	}
	.shop-modul-ul.none-style{
	    padding: 0;
	}
	.shop-modul-ul .shop-modul-li{
	    background-color: #fff;
	}
	.shop-modul-ul.one-list .shop-modul-li{
	    width: 100%;
	    margin-bottom: 10px;
	}
	.shop-modul-ul.two-list .shop-modul-li{
	    width: calc(50% - 6px);
	    margin-right: 12px;
	    margin-bottom: 8px;
	}
	.shop-modul-ul.two-list .shop-modul-li:nth-child(2n){
	    margin-right: 0;
	}
	.shop-modul-ul.three-list .shop-modul-li{
	    width: calc(33.33% - 6px);
	    margin-right: 9px;
	    margin-bottom: 10px;
	}
	.shop-modul-ul.three-list .shop-modul-li:nth-child(3n){
	    margin-right: 0;
	}
	.shop-modul-ul.four-list .shop-modul-li{
	    width: 100%;
	    padding: 10px 0;
	}
	.shop-modul-ul .modul-img{
	    width: 100%;
	    position:relative;
	    overflow: hidden;
	    border-radius: 8px;
	}
	/*8/31*/
	.shop-modul-ul .modul-img .sold_out_img{
	    width: 100%;position: absolute;left: 0;top: 50%;z-index: 3;transform: translateY(-50%);background: rgba(0,0,0,0.4);height: 100%;
	}
	.custom-goods .li .img .sold_out_img{
	    position: absolute;
	    top: 0;
	    left: 0;
	    background: rgba(0,0,0,0.45);
	    width: 100%;
	    height: 100%;
	}
	/*8/31end*/
	.shop-modul-ul.four-list .modul-img{
	    width: 120px;
	    margin-right: 8px;
	}
	.shop-modul-ul.none-style .modul-img{
	    border-radius: 0;
	}
	.shop-modul-ul .modul-img:after{
	    position:relative;
	    content:'';
	    display:block;
	    padding-bottom:100%;
	}
	.shop-modul-ul.one-list .modul-img.bg-height:after{
	    padding-bottom:66.66%;
	}
	.shop-modul-ul .modul-img image{
	    width: 100%;
	    height: auto;
	    position:absolute;
	    left: 50%;
	    top: 50%;
	    transform: translate(-50%, -50%);
	}
	.shop-modul-ul.one-list .modul-title{
	    font-size: 17px;
	    color: #333;
	    margin-top: 5px;
	    line-height: 1.3;
	    display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	    overflow: hidden;
	    word-break: break-all;
	}
	.shop-modul-ul.two-list .modul-title{
	    font-size: 15px;
	    color: #333;
	    margin-top: 5px;
	    line-height: 1.3;
	    min-height: 36px;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    overflow: hidden;
	    word-break: break-all;
	}
	.shop-modul-ul.three-list .modul-title{
	    font-size: 14px;
	    color: #333;
	    margin-top: 5px;
	    line-height: 1.3;
	    min-height: 36px;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    overflow: hidden;
	    word-break: break-all;
	}
	.shop-modul-ul.four-list .modul-title{
	    font-size: 15px;
	    color: #333;
	    line-height: 1.3;
	    min-height: 36px;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    overflow: hidden;
	    word-break: break-all;
	}
	.shop-modul-ul.one-list .modul-describe{
	    font-size: 13px;
	    color: #F1B465;
	    margin-top: 5px;
	    line-height: 1.3;
	    display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	    overflow: hidden;
	    word-break: break-all;
	}
	.shop-modul-ul.two-list .modul-describe{
	    font-size: 13px;
	    color: #F1B465;
	    margin-top: 5px;
	    line-height: 1.3;
	    display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	    overflow: hidden;
	    word-break: break-all;
	}
	.shop-modul-ul.three-list .modul-describe{
	    font-size: 12px;
	    color: #F1B465;
	    margin-top: 5px;
	    line-height: 1.3;
	    min-height: 32px;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    overflow: hidden;
	    word-break: break-all;
	}
	.shop-modul-ul.four-list .modul-describe{
	    font-size: 13px;
	    color: #F1B465;
	    line-height: 1.3;
	    margin-top: 4px;
	    display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	    overflow: hidden;
	    word-break: break-all;
	}
	.shop-modul-ul .modul-label{
	    margin-top: 8px;
	}
	.shop-modul-ul .modul-label .li{
	    font-size: 12px;
	    padding: 2px 4px;
	    border: solid 1px #FAE2E4;
	    background-color: #FFEEF3;
	    margin-right: 4px;
	    color: #FF3445;
	    line-height: 1;
	    border-radius: 2px;
	}
	.shop-modul-ul.one-list .modul-price{
	    margin-top: 12px;
	    line-height: 1;
	}
	.shop-modul-ul.one-list .modul-price .modul-price-left .min-price{
	    font-size: 17px;
	    color: #F24F4C;
	}
	.shop-modul-ul.one-list .modul-price .modul-price-left .min-price .span{
	    font-size: 25px;
	}
	.shop-modul-ul.one-list .modul-price .modul-price-left .max-price{
	    font-size: 14px;
	    color: #999999;
	    text-decoration: line-through;
	    margin-left: 8px;
	}
	.shop-modul-ul.one-list .modul-price .modul-price-right{
	    font-size: 13px;
	    color: #999;
	}
	.shop-modul-ul.two-list .modul-price-left{
	    margin-top: 8px;
	    line-height: 1;
	}
	.shop-modul-ul.two-list .modul-price-left .min-price{
	    font-size: 14px;
	    color: #F24F4C;
	}
	.shop-modul-ul.two-list .modul-price-left .min-price .span{
	    font-size: 20px;
	}
	.shop-modul-ul.two-list .modul-price-left .max-price{
	    font-size: 12px;
	    color: #999;
	    text-decoration: line-through;
	    margin-left: 8px;
	}
	.shop-modul-ul.two-list .modul-price-right{
	    font-size: 12px;
	    color: #999;
	    margin-top: 6px;
	    line-height: 1;
	}
	.shop-modul-ul.three-list .modul-price-left{
	    margin-top: 6px;
	    line-height: 1;
	}
	.shop-modul-ul.three-list .modul-price-left .min-price{
	    font-size: 13px;
	    color: #F24F4C;
	}
	.shop-modul-ul.three-list .modul-price-left .min-price .span{
	    font-size: 15px;
	}
	.shop-modul-ul.three-list .modul-price-left .max-price{
	    font-size: 10px;
	    color: #999;
	    text-decoration: line-through;
	    margin-top: 2px;
	}
	.shop-modul-ul.four-list .modul-price{
	    line-height: 1;
	}
	.shop-modul-ul.four-list .modul-price .modul-price-left .min-price{
	    font-size: 14px;
	    color: #F24F4C;
	}
	.shop-modul-ul.four-list .modul-price .modul-price-left .min-price .span{
	    font-size: 20px;
	}
	.shop-modul-ul.four-list .modul-price .modul-price-left .max-price{
	    font-size: 12px;
	    color: #999;
	    text-decoration: line-through;
	    margin-left: 8px;
	}
	.shop-modul-ul.four-list .modul-price .modul-price-right{
	    font-size: 12px;
	    color: #999;
	}
	/*商品组件end*/
</style>