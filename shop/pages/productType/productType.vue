<template>
	<view class="container">
		<!--搜索-->
		<view class="top-serach">
			<view class='serach-wrap' v-show="inputShowed">
				<icon class="serach-icon" type="search" size="14" :color='searchColor'></icon>
				<input type="text" class="serach-input" placeholder="搜索" :value="inputVal" :focus="inputShowed"  @click="inputTyping" confirm-type='search' @confirm='search' />
				<view class="search-clear" v-if="inputVal.length > 0" @click="clearInput">
					<icon type="clear" size="14" :color='searchColor'></icon>
				</view>
				<view :class="'serach-cancel skin-color-'+theme" v-show="inputShowed" @click="hideInput">取消</view>
			</view>
			<label class="search-label"  v-if="!inputShowed" @click="showInput">
				<view>
					<icon class="search-label-icon" type="search" size="14" :color="searchColor"></icon>
					<view class="search-label-text ">搜索</view>
				</view>
			</label>
		</view>
		<!--内容-->
		<view class="content content-border-top" v-if="type_page_style == 1">
			<scroll-view scroll-y="true" :class="'content-left-two '+(show_bottom ? 'bottom-true' : '')">
				<block v-for="(item,index) in top_type">
					<view :class="'category-two '+(index==active ? 'active skin-color-'+theme:'')" @click="seconddaohang(item.id,index)">
						<text>{{item.name}}</text>
						<view :class="'left-line skin-bg-'+theme" v-if="index==active"></view>
					</view>
				</block>
			</scroll-view>
			<!--右边内容-->
			<scroll-view scroll-y="true" :class="'content-right-two '+(show_bottom?'bottom-true':'')" @scrolltolower='lower' >
				<!-- {{top_type[active]}} -->
				<view v-if="top_type[active]">
					<view class="content-right-img" v-if="top_type[active].banner.length>0">
						<swiper class="swiper_tow" :vertical="false" :autoplay="true" interval="3000" >
							<block v-for="(item,index) in top_type[active].banner">
								<view>
									<swiper-item>
										<image v-if="item.type_adimg" :src="item.type_adimg"></image>
									</swiper-item>
								</view>
							</block>
						</swiper>
					</view>
				</view>
				<view v-if="top_type[active]">
					<view class="content-title" v-if="top_type[active].secondcontent.length>0">
						<text class="content-title-text">{{top_type[active].name}}</text>
					</view>
				</view>
				<view v-if="top_type[active]">
					<view class="nowork" v-if="top_type[active].secondcontent">
						<view class="weui-grids">
							<block v-for="(item,index) in top_type[active].secondcontent">
								<navigator class="weui-grid js_grid">
									<view class="weui-grid__icon">
										<image mode="widthFix" :src="item.imgurl" />
									</view>
									<view class="weui-grid__label">
										{{item.name}}
									</view>
								</navigator>
							</block>
							<view class="clearfix"></view>
						</view>
					</view>
				</view>
				
			</scroll-view>
		</view>
		<block v-if="type_page_style == 2">
			<!--头部导航-->
			<view class="allSort">
				<view class="sortMenu clearfix">
					<view class="sortMenu-ul">
						<block v-for="(item,index) in top_type">
							<view class="cell" @click="seconddaohang(item.id,index)">
								<view url="" :class="'item '+ (index==active ? 'active skin-color-'+theme:'')">{{item.name}}</view>
								<view :class="'tab-line skin-bg-'+theme" v-if="index==active"></view>
							</view>
						</block>
					</view>
				</view>
			</view>
			<!--内容-->
			<scroll-view scroll-y="true" :class="'content_nowork '+(show_bottom?'bottom-true':'')" bindscrolltolower='lower'>
				<view v-if="top_type[active]">
					<view class="content-top" v-if="top_type[active].banner.length>0">
						<swiper class="swiper_three" vertical="false" autoplay="true" interval="3000">
							<block v-for="(item,index) in top_type[active].banner">
								<navigator :url='item.page_url'>
									<swiper-item>
										<image v-if="item.type_adimg" :src="item.type_adimg"></image>
									</swiper-item>
								</navigator>
							</block>
						</swiper>
					</view>
					<view class="nowork2">
					<block v-for="(item,index) in top_type[active].secondcontent">
						<!-- {{top_type[active].secondcontent}} -->
						<view class="content-type">
							<view class="content-detail">
								<text class="tilte">{{item.name}}</text>
								<view class="tilte-right" catchtap="onMoreTap">
									<!-- <navigator :url="'/shop/pages/goodsList/goodsList?type='+item.id">
										<text class="tilte-right-text">查看更多</text>
										<image class="title-right-img" :src="vuex_apiUrl+'/HTML/images/shop/images/common_icon_arrow@2x.png'" />
									</navigator> -->
									<view class="flex align-items-center">
										<text class="tilte-right-text">查看更多</text>
										<image class="title-right-img" :src="vuex_apiUrl+'/HTML/images/shop/images/common_icon_arrow@2x.png'" />
									</view>
								</view>
							</view>
							<block v-for="(itm,ind) in item.son">
								
								<navigator :url="'/shop/pages/goodsList/goodsList?type='+itm.id">
									<view class="content-item">
										<view class="content-item-detail">
											<view class="content-item-detail-img">
												
												<image :src="itm.imgurl" />
											</view>
										</view>
									</view>
								</navigator>
							</block>
							<view class="clearfix"></view>
						</view>
					</block>
				</view>
				</view>
			</scroll-view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme:getApp().globalData.style_color,
				show_bottom: false, // 底部是否显示
				inputShowed: false,
				inputVal: "",
				scroll_height: 0,
				active: 0,
				top_type: [], //一级分组
				shareLogo: '',
				type_page_style:0,//页面样式
			}
		},
		onLoad(){
			var that = this;
			that.searchColor = this.$common.get_color(that.theme)
			
			uni.getSystemInfo({
				success(res) {
					//设置列表的高度，使其滚动
					that.scroll_height = res.windowHeight - 82
				}
			});
			//获取商品基础设置
			that.get_list_base();
			//获取所有一级分组
			that.get_type(-1,res=>{
				
				that.top_type = res
				//获取广告
				that.get_album(res[0].id)
				//获取子级分组
				that.get_type(res[0].id)
			})
		},
		methods:{
			//公共底部回调函数
			showBottom: function (res) {
				var that = this;
				that.show_bottom = res.detail
			},
			showInput: function () {
				this.inputShowed = true
			},
			hideInput: function () {
				this.inputShowed = false
			},
			clearInput: function () {
				this.inputVal = ""
			},
			inputTyping(){
				
			},
			search(e){
				if (e.detail.value == '') {
					uni.showToast({
						title: '请输入搜索内容',
						icon: 'none',
					})
					return
				}
				uni.navigateTo({
					url: '/shop/pages/goodsList/goodsList?keyWord=' + e.detail.value,
				});
			},
			seconddaohang(id,index){
				if(index == this.active){
					return
				}
				this.active = index
				//获取广告
				this.get_album(id);
				//获取子级分组
				this.get_type(id)
				
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
			},
			//获取广告
			get_album(type_id){
				var _this = this;
				var index = _this.active;
				if(_this.top_type[index].banner.length>0){
					return
				}
				_this.$api.getTypeAlbum({type_id:type_id}).then(res=>{
					//判断有没有数据
					if(res.errcode == 0){
						_this.top_type[index].banner = res.data
					}
				})
			},
			get_list_base(){
				var _this = this;
				var parmas = {}
				_this.$api.getListBase(parmas).then(res=>{
					if(res.errcode != 0){
						return 
					}
					var pro_config = res.data.pro_config
					if(pro_config.type_page_style==3){
						uni.redirectTo({
							url: '/shop/pages/commodityGroup/commodityGroup_one',
							success:function(res){
								console.log(res)
							},
							fail:function(e){
								console.log(e)
							}
						})
					}
					if(pro_config.type_page_style==4){
						uni.redirectTo({
						  url: '/shop/pages/purchase_page/purchase_page',
						})
					}
					_this.type_page_style = pro_config.type_page_style
				})
			},
			get_type(parent_id,callback){
				var _this = this
				var index = _this.active
				if(parent_id>0 && _this.top_type[index].secondcontent.length>0){
					return
				}
				var parmas = {
					parent_id:parent_id,
					type_id:parent_id,
				}
				
				if(parent_id>0){
					this.$api.getTypeSon(parmas).then(res=>{
						if(res.errcode == 0){
							if(callback){
								callback(res.data)
							}else{
								_this.top_type[index].secondcontent = res.data
							}
						}
					})
				}else{
					this.$api.getType(parmas).then(res=>{
						if(res.errcode == 0){
							if(callback){
								console.log('callback')
								callback(res.data)
							}else{
								console.log('no - callback')
								_this.top_type[index].secondcontent = res.data
							}
						}
					})
				}
				
				
				
			}
		}
	}
</script>

<style>
	.container {
	  display: flex;
	  flex-direction: column;
	}
	::-webkit-scrollbar{
		width: 0;
		height: 0;
		color: transparent;
	}
	/*搜索框样式*/
	.top-serach{
	    width: 100%;
	    background: #fff;
	    padding: 5px 15px;
	    box-sizing: border-box;
	}
	.search-label{
	    width: 100%;
	    height: 35px;
	    line-height: 35px;
	    display: flex;
	    align-items: center;
	    background: #f5f5f5;
	    border-radius: 8rpx;
	    justify-content: center;
	}
	.search-label-icon{
	    display: inline-block;
	    vertical-align: middle;
	}
	.search-label-text{
	    display: inline-block;
	    vertical-align: middle;
	    margin-left: 10px;
	    font-size: 15px;
	    color: #999
	}
	.serach-wrap{width: 100%;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    position: relative;
	}
	.serach-wrap input{
	    flex: 1;
	    height: 35px;
	    border-radius: 8rpx;
	    background: #f5f5f5;
	    padding-left: 25px;
	    font-size: 15px;
	}
	.serach-icon{position: absolute;left: 6px;}
	.serach-cancel{font-size: 15px;padding-left: 10px;}
	.search-clear{position: absolute;right:50px;margin-top:-2px;z-index: 5 }
	/*搜索框样式end*/
	.null-tip {
	    width: 100%;
	    height: 70px;
	    line-height: 70px;
	    text-align: center;
	    font-size: 28rpx;
	    color: #ccc;
	    display: block
	}
	/*导航下的内容*/
	/*商品分组1-2*/
	.content-border-top{border-top: 1px solid #f0f0f0;margin-top: 10rpx;}
	.content .content-left-two{width: 21%;float: left;text-align: center;font-size: 28rpx;color: #333333;margin-right: 30rpx;height: calc(100vh - 102rpx);background-color: #f5f5f5;}
	.content .content-left-two.bottom-true{height: calc(100vh - 190rpx);}
	.content .content-left-two .category-two{padding: 22rpx 0;position: relative;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-size: 26rpx;}
	.content .content-left-two .active{color:#7f8aef;background-color: #ffffff;}
	.left-line{content: '';height: 30rpx;width: 6rpx;background: #7f8aef;position: absolute;left: 0;top: 36%;border-radius: 30%;}
	.content-left-border-right{border-right: 2rpx solid #e5e5e5;}
	
	.content .content-right-two{width: 70%;float: right;padding-right: 30rpx;height: calc(100vh - 122rpx);padding-top:20rpx }
	.content .content-right-two.bottom-true{height: calc(100vh - 210rpx);}
	.content-right-two .content-right-img{width: 100%;height: 176rpx;}
	.content-right-two .content-right-img image{width: 100%;height: 176rpx;border-radius: 4rpx;}
	.content-right-two .content-title{color: #333333;font-size: 26rpx;padding: 48rpx 0rpx}
	.content-right-two .content-title-text{margin: 0px 20rpx;padding-left: 10rpx;}
	/*去除框架的边框*/
	.weui-grids{border: none}
	.weui-grid{
		border: none;
		position: relative;
		padding: 0rpx 30rpx 0px 30rpx;
		float: left;
		width: 33.33333333%;
		box-sizing: border-box;
		margin-bottom: 31rpx;
	}
	/*修改框架的样式*/
	.weui-grid__icon{height: 120rpx;width: 120rpx;position: relative;display: flex;justify-content: center;align-items: center;overflow: hidden;}
	.weui-grid__icon image{width: 100%;position: absolute}
	.weui-grid__label{width: 100rpx;margin: 0 auto;font-size: 24rpx;color: #5d5d5d;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;text-align: center;}
	.weui-grid__icon + .weui-grid__label{margin-top: 16rpx;line-height: 1;}
	
	.swiper_tow{height: 176rpx}
	
	
	/*商品分组1-3*/
	/*导航栏*/
	.sortMenu{width: 100%;background-color:#fff;overflow-x: scroll;-webkit-overflow-x: scroll;-webkit-overflow-scrolling:touch;}
	.sortMenu::-webkit-scrollbar{width: 0;height: 0;background-color: #fff;  }
	.sortMenu-ul {display: flex;}
	
	.sortMenu-ul .cell{font-size: 28rpx;margin:0 30rpx;height: 90rpx;line-height: 90rpx;text-align: center;position: relative;text-overflow: ellipsis;word-break: keep-all;color: #5d5d5d;}
	.sortMenu-ul .cell .item{white-space:nowrap;}
	.sortMenu-ul .cell:nth-child(1){margin:0 30rpx 0 15rpx;}
	.sortMenu-ul .cell:last-child{margin:0 0 0 30rpx;padding-right: 15rpx;}
	.sortMenu .cell .active{color: #7f8aef;}
	.tab-line{content: '';height: 6rpx;width: 40rpx;background: #7f8aef;position: absolute;bottom: 0px;left: 50%;border-radius: 20%;transform: translate(-50%)}
	
	.content_nowork{height: calc(100vh - 180rpx);}
	.content_nowork.bottom-true{height: calc(100vh - 276rpx);}
	.content-top{width: 100%;height: 242rpx;padding: 30rpx;margin-bottom:52rpx;border-radius: 16rpx;}
	.content-top image{width: 100%;height: 242rpx;border-radius: 8rpx;}
	.content-type{width: 100%;padding: 52rpx 0px 30rpx 30rpx;}
	.content-detail{padding-bottom: 40rpx;padding-right: 30rpx;}
	.content-type .tilte{font-size: 30rpx;color: #333333;font-weight: 600;}
	.content-type .tilte-right{float: right;}
	.content-type .tilte-right .tilte-right-text{font-size: 28rpx;color: #999999;}
	.content-type .tilte-right .title-right-img{width: 20rpx;height: 30rpx;vertical-align: -4rpx;}
	.content-item{background-color: #F5F5F5;margin-top: 20rpx;width: 45%;border-radius: 8rpx;float: left;margin-right: 30rpx;position: relative;}
	.content-item-detail{width: 100%;}
	.content-item-detail-left{width: 56%;float: left;padding-top: 60rpx;padding-bottom: 50rpx;}
	.content-item-detail-left-top{font-size: 24rpx;color: #333333;}
	.content-item-detail-left-bottom{font-size: 20rpx;color: #bababa;}
	.content-item-detail-img{width: 100%;height: 100%;display: flex}
	.content-item-detail-img image{width: 100%;height: 156rpx;border-radius:8rpx;}
	
	.swiper_three{height: 242rpx}
</style>
