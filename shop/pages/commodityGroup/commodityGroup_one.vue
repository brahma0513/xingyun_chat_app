<template>
	<view class="container">
		<!--搜索-->
		<view class='top-serach'>
			<view class='serach-wrap' v-show="inputShowed">
				<icon class="serach-icon" type="search" size="14" :color="searchColor"></icon>
				<input type="text" class="serach-input" placeholder="搜索" v-model="inputVal" :focus="inputShowed" @confirm="search"/>
				<view class="search-clear" v-if="inputVal.length > 0" @click="clearInput">
					<icon type="clear" size="14" :color="searchColor"></icon>
				</view>
				<view :class="'serach-cancel skin-color-'+theme" v-show="inputShowed" @click="hideInput">取消</view>
			</view>
			<label class="search-label" :style="'display:'+(inputShowed?'none':'')"  @click="showInput">
				<view>
					<icon class="search-label-icon" type="search" size="14" :color='searchColor'></icon>
					<view class="search-label-text ">搜索</view>
				</view>
			</label>
		</view>
		<!--头部导航-->
		<view class="allSort">
			<view class="sortMenu clearfix">
				<view class="sortMenu-ul">
					<block v-for="(itm,idx) in type">
						<view class="cell" @click="toggle(idx)">
							<view url="" :class="'item '+(idx==active?'active skin-color-'+theme:'')">{{itm.name}}</view>
							<view :class="'tab-line skin-bg-'+theme" v-if="idx==active"></view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view class="content">
			<!--左边导航-->
			<scroll-view v-if="type.length>0 && type[active].son.length > 0" scroll-y="true" class="content-left">
				<block v-for="(item,index) in type[active].son">
					<view :class="'category '+(index==secondactive? 'active skin-color-'+theme : '')" @click="seconddaohang(item.id,index)">
						<text>{{item.name}}</text>
					</view>
				</block>
			</scroll-view>
			<!--左边导航结束-->
			<!--右边内容-->
			<scroll-view scroll-y="true" style="width: 75%;" class="content-right" :bindscrolltolower='lower' :scroll-top="scrollTop">
				<view class="nowork" v-if="type.length>0 && type[active].son[secondactive].pro_list.length>0">
					<block v-for="(item,index) in type[active].son[secondactive].pro_list">
						<view class="detail detail-bottom">
							<view class="detail-left">
								<view class='img'>
									<image :src="item.url" />
								</view>
							</view>
							<view class="detail-right">
								<view class="detail-content-text detail-content">{{item.name}}</view>
								<view class="detail-footer">
									
									<view :class="'detail-price price-'+price_color">{{monetary_unit}}{{item.priceA}}<text style='font-size:24rpx'>{{item.priceB}}</text></view>
								</view>
							</view>
							<view class="clearfix"></view>
						</view>
					</block>
				</view>
				<!-- <view class="nowork" v-if="type.length>0 && type[active].son[secondactive].pro_list.length>0">
					<block v-for="(item,index) in type[active].son[secondactive].pro_list">
					  <view class="">
						<view class="detail detail-bottom">
							<view class="detail-left">
								<view class='img'>
									<image :src="item.url" />
								</view>
							</view>
							<view class="detail-right">
								<view class="detail-content-text detail-content">{{item.name}}</view>
								<view class="detail-footer">
									<view v-if="item.choosetext.length>0&&item.jiajian==0" class="choose-text">
										<text>已选:{{item.choosetext}}</text>
									</view>
									<view :class="'detail-price price-'+price_color">{{monetary_unit}}{{item.priceA}}<text style='font-size:24rpx'>{{item.priceB}}</text></view>
								</view>
							</view>
							<view class="clearfix"></view>
						</view>
					  </view>
					</block>
				</view> -->
				
				<view class="no_list flex column align-items-center" v-if="type.length>0 && type[active].son[secondactive].pro_list.length == 0">
					<image class="img" :src="vuex_apiUrl+'/shop/mshop/web/static/images/collect_content_empty_commodity.png'"></image>
					<view class='text'>暂无商品哦~</view>
				</view>
				<view v-if="type.length>0 && type[active].son[secondactive].page >= type[active].son[secondactive].total_page" class='null-tip'>再拉也没有啦~</view>
			</scroll-view>
			<!--右边内容结束-->
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	export default {
		data(){
			return {
				theme: getApp().globalData.style_color,
				price_color: getApp().globalData.price_color,
				monetary_unit: getApp().globalData.monetary_unit,
				inputShowed: false,
				inputVal: "",
				scroll_height: 0,
				active: 0,
				secondactive: 0,
				can_load:true,//判断能不能滚动加载
				type:'',
				scrollTop:0,
			}
		},
		onLoad(){
			var searchColor = this.$common.get_color(this.theme);
			this.searchColor = searchColor;
			this.get_type()
		},
		onReady(){
			var that = this;
			uni.getSystemInfo({
				success(res) {
					//设置列表的高度，使其滚动
					that.scroll_height = res.windowHeight - 127;
				}
			});
		},
		methods:{
			showInput() {
				this.inputShowed = true
			},
			hideInput() {
				this.inputVal = ""
				this.inputShowed = false
			},
			clearInput() {
				this.inputVal = ""
			},
			search: function() {
				var _this = this;
				if(_this.inputVal == ''){
					uni.showToast({
						title: '请输入搜索内容',
						icon:'none',
					})
					return
				}
				uni.navigateTo({
					url: '/shop/pages/goodsList/goodsList?keyWord=' + _this.inputVal,
				});
			},
			toggle: function(index) {
				//console.log('toggle',index)
				var that = this
				that.active = index;
				//console.log('toggle active',that.active)
				that.secondactive = 0;
				that.scrollTop = 0;
				that.get_product_list()
			},
			//上拉加载数据
			lower: function() {
				var self = this;
				if(!self.can_load){
					return
				}
				self.get_product_list()
			},
			get_type(){
				var _this = this;
				
				util.requestData({
					url:"/uniapp_template/web/index.php?m=shop&a=get_type_two&xdebug=xdebug",
					data:{},
					success:function(res){
						if(res.errcode == 0){
							var data = res.data
							if(data.length==0){
								return
							}
							var all = []
							
							for (let i in data) {
								all.push({
									id:data[i].id,
									name:data[i].name,
									pro_list:[],
								})
								for (let j in data[i].son) {
									data[i].son[j].pro_list = []
								}
							}
							data.unshift({
								id:-1,
								name:'全部',
								son:all,
							})
							_this.type = data
							_this.get_product_list();
						}
					}
				})
			},
			//获取商品列表
			get_product_list(){
				var self = this
				var active = self.active
				var secondactive = self.secondactive
				var type_id = self.type[active].son[secondactive].id
				var page = 1;
				if (self.type[active].son[secondactive].page) {
					page = self.type[active].son[secondactive].page+1;
					if(self.type[active].son[secondactive].total_page<page){
						return
					}
				}
				self.can_load = false
				var params = {
					type: type_id,
					page_num: page,
					only:false,
					version: '1.0',
					need_page:1
				}
				util.requestData({
					url:'/uniapp_template/web/index.php?m=shop&a=get_product_list_one&xdebug=xdebug',
					data:params,
					success:function(res){
						if(res.errcode == 0){
							if (res.data.pro.length > 0) {
								var pro = res.data.pro
								for (var i in pro) {
									var now_price_show = Number(pro[i].now_price_show).toFixed(2)
									pro[i].priceA = self.$common.toPrice(String(now_price_show), true)
									pro[i].priceB = self.$common.toPrice(String(now_price_show), false)
								}
								self.type[active].son[secondactive].pro_list.push(...pro)
								self.type[active].son[secondactive].pro_list = self.type[active].son[secondactive].pro_list
								self.type[active].son[secondactive].total_page = res.data.page
								self.type[active].son[secondactive].page = page
								self.isNoData = false
							}else{
								self.type[active].son[secondactive].total_page = 0
							}
						}
						self.can_load = true
					}
				})
			},
			seconddaohang: function(id,index) {
				var that = this;
				that.secondactive = index;
				that.scrollTop = 0;
				if(that.type[that.active].son[that.secondactive].pro_list.length<=0){
					//获取商品列表
					that.get_product_list()
				}
			},
		},
		watch:{
			active(n,o){
				//console.log('o - n',o+' - '+n)
			}
		}
	}
</script>

<style scoped>
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
	.search-clear{position: absolute;right:50px;margin-top:-20rpx;z-index: 5;}
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
	/*导航栏*/
	.sortMenu{width: 100%;background-color:#fff;overflow-x: scroll;-webkit-overflow-x: scroll;-webkit-overflow-scrolling:touch;}
	.sortMenu::-webkit-scrollbar{width: 0;height: 0;background-color: #fff;  }
	.sortMenu-ul {display: flex;}
	
	.sortMenu-ul .cell{font-size: 28rpx;margin:0 30rpx;height: 100rpx;line-height: 100rpx;text-align: center;position: relative;text-overflow: ellipsis;word-break: keep-all;color: #5d5d5d;}
	.sortMenu-ul .cell:nth-child(1){margin:0 30rpx 0 15rpx;}
	.sortMenu-ul .cell:last-child{margin:0 0 0 30rpx;padding-right:15rpx;}
	.sortMenu .cell .active{color: #7f8aef;}
	.tab-line{content: '';height: 6rpx;width: 40rpx;background: #7f8aef;position: absolute;bottom: 0px;left: 50%;border-radius: 20%;transform: translate(-50%)}
	
	/*底部footer*/
	.footer{width: 100%;background-color: #fff;position:fixed;bottom: 0px;border-top: 1px solid #e5e5e5;display: flex;text-align: center;align-items: center;}
	.footer_item{flex: 1;padding-top: 3px;position: relative;}
	.footer_item img{width: 25px;height: 25px;}
	.footer_item .footer-text{color: #b2b2b2;font-size: 10px;margin-top: -5px;}
	.footer_item .active{color: #9397f6;}
	.footer .badge{width: 18px;height: 18px;position: absolute;background: red;top: 5px;right: 15px;border-radius: 50%;font-size: 10px;color: #fff;}
	
	/*导航下的内容*/
	/*商品分组1-1*/
	.content{width: 100%;float: left;border-top: 2rpx solid #f0f0f0;}
	.content .content-left{width: 21%;float: left;text-align: center;font-size: 28rpx;color: #333333;margin-right: 20rpx;background-color: #f5f5f5;-webkit-overflow-scrolling:touch;height: calc(100vh - 280rpx);overflow: hidden;overflow-y: scroll;}
	.content .content-left .active{color:#7f8aef;background-color: #fff;}
	.content .content-left .category{height: 88rpx;line-height: 88rpx;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
	
	
	.content .content-right{width: 75%;float: right;height: calc(100vh - 320rpx);overflow: hidden;}
	/* .content .content-right{width: 75%;float: right;-webkit-overflow-scrolling:touch;height: calc(100vh - 280rpx);overflow: hidden;overflow-y: scroll;} */
	.content .content-right .detail{width: 100%;padding: 30rpx 24rpx 30rpx 0;float: left;position: relative;}
	.content .content-right .detail-bottom{border-bottom: 2rpx solid #f0f0f0;}
	.content .content-right .detail .detail-left{width: 85px;height: 85px;float: left;border-radius: 8rpx;overflow: hidden;}
	.content .content-right .detail .detail-left .img{width: 100%;height: 100%;box-sizing: border-box;display: flex;align-items: center;justify-content: center;overflow: hidden;}
	/* .content .content-right .detail .detail-left .img{width: 100%;height: 204rpx;line-height: 204rpx;} */
	.content .content-right .detail .detail-left image{width: 100%;height: 100%;}
	.content .content-right .detail .detail-right{width: 65%;float: left;padding-left: 10rpx;}
	.content .content-right .detail .detail-right .detail-content-text{font-size: 28rpx;color: #333333;}
	.content .content-right .detail .detail-right .detail-content{display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;}
	.detail-footer{position: absolute;bottom: 30rpx;display: inline-block;}
	.detail-footer .detail-price{font-size: 32rpx;font-weight: bold;display: inline-block;}
	.detail-footer .choose-text{font-size: 14px;color: #333333;}
	.choose{display: inline-block;position: absolute;right: 20rpx;bottom: 30rpx;}
	.choose .choose-box{padding: 0px 20rpx;border: 2rpx solid #e5e5e5;display: inline-block;border-radius: 10rpx;}
	.choose .minus{width: 20rpx;height: 4rpx;vertical-align: 10rpx;}
	.choose .add{width: 20rpx;height: 20rpx;vertical-align: 2rpx;}
	.choose .choose-number{padding: 0 20rpx;}
	/* .choose .specifications{border: 2rpx solid #e5e5e5;border-radius: 40rpx;} */
	.choose .specifications-text{font-size: 24rpx;color: #333333;padding: 5rpx 10rpx;border: 2rpx solid #f0f0f0;border-radius: 40rpx;}
	.nowork navigator:last-child .detail-bottom{border-bottom: none}
	.content .content-right .no_list{margin: 20% auto 0;text-align: center;font-size: 0;}
	.content .content-right .no_list .img{width: 168.5px;height: 101px;}
	.content .content-right .no_list .text{font-size: 12px;color: #ccc;margin-top: 10px;line-height: 1;}
	
	/*导航下的内容*/
	/*商品分组1-2*/
	.content-border-top{border-top: 1px solid #e5e5e5;margin-top: 5px;}
	.content .content-left-two{width: 21%;float: left;text-align: center;font-size: 14px;color: #333333;margin-right: 15px;overflow-x: hidden;overflow-y: auto;padding-bottom: 50px;-webkit-overflow-scrolling:touch;}
	.content .content-left-two .category-two{padding: 15px 0;position: relative;}
	.content .content-left-two .active{color:#7f8aef;}
	.left-line{content: '';height: 15px;width: 3px;background: #7f8aef;position: absolute;left: 0;top: 36%;border-radius: 30%;}
	.content-left-border-right{border-right: 1px solid #e5e5e5;}
	.content .content-right-two{width: 74%;float: right;padding-right: 15px;overflow-x: hidden;overflow-y: auto;padding-bottom: 50px;-webkit-overflow-scrolling:touch;}
	.content-right-two .content-right-img{width: 100%;padding: 10px 0px;}
	.content-right-two .content-right-img img{width: 100%;}
	.content-right-two .content-title{text-align: center;color: #333333;font-size: 13px;padding: 15px 0px 0px 0px;}
	.content-right-two .content-title-text{margin: 0px 10px;font-weight: bold;}
	/*去除框架的边框*/
	.weui-grids:after{border: none;}
	.weui-grid:after{border: none;}
	.weui-grid:before{border: none;}
	.weui-grids:before{border: none;}
	/*修改框架的样式*/
	.weui-grid{padding: 30px 15px 0px 15px;}
	.weui-grid__icon{height: 49px;width: 50px;position: relative;}
	.weui-grid__icon img{width: 80%;position: absolute;bottom: 0;left: 5px;height: auto;}
	.weui-grid__label{width: 50px;margin: 0 auto;font-size: 12px;color: #707070;}
	.weui-grid__icon + .weui-grid__label{margin-top: 10px;}
	
	
	/*商品分组1-3*/
	.content_nowork{overflow-x: hidden;overflow-y: auto;padding-bottom: 50px;-webkit-overflow-scrolling:touch;}
	.content-top{width: 100%;padding: 15px;}
	.content-top img{width: 100%;height: 122px;border-radius: 8px;}
	.content-type{width: 100%;padding: 26px 0px 15px 15px;}
	.content-detail{padding-bottom: 20px;padding-right: 15px;}
	.content-type .tilte{font-size: 18px;color: #333333;font-weight: bold;}
	.content-type .tilte-right{float: right;}
	.content-type .tilte-right .tilte-right-text{font-size: 14px;color: #999999;}
	.content-type .tilte-right .title-right-img{width: 10px;height: 15px;vertical-align: -2px;}
	.content-item{background-color: #F5F5F5;margin-top: 10px;width: 45%;border-radius: 8px;float: left;margin-right: 15px;position: relative;}
	.content-item-detail{padding: 0px 9px;width: 100%;}
	.content-item-detail-left{width: 56%;float: left;padding-top: 30px;padding-bottom: 25px;}
	.content-item-detail-left-top{font-size: 12px;color: #333333;}
	.content-item-detail-left-bottom{font-size: 10px;color: #bababa;}
	.content-item-detail-img{width: 44%;height: 54px;float: left;}
	.content-item-detail-img img{max-width: 100%;max-height: 54px;position: absolute;bottom: 20px;}
	/*修改weui的样式*/
	.weui-loadmore{margin: 0 auto;}
	
	.addBox{display: inline-block}
	.add{font-size:32rpx;color:#333333;padding:0rpx 16rpx;border:2rpx solid #e5e5e5;border-radius:10rpx;}
	
	/*商品规格start*/
	.alert-bg{
	    position: fixed;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0,0,0,0.6);
	    left: 0;
	    top: 0;
	    z-index: 999;
	}
	.alert-close{
	    position: relative;
	}
	.alert-close .img{
	    position: absolute;
	    right: 0;
	}
	.alert-close image{
	  width: 44rpx;
	  height: 44rpx;
	}
	
	.spec-alert{
	    position: fixed;
	    width: 100%;
	    background: #fff;
	    bottom: 0;
	    left: 0;
	    box-sizing: border-box;
	    padding: 30rpx;
	    border-radius: 20rpx 20rpx 0 0;
	    z-index: 1000;
	}
	.spec-alert .goods-infor{
	    overflow: hidden;
	    margin-bottom: 20rpx;
	}
	.spec-alert .goods-infor .img{
	    width: 216rpx;
	    height: 216rpx;
	    float: left;
	    margin-right: 20rpx;
	}
	.spec-alert .goods-infor .img image{
	    display: block;
	    width: 100%;
	    height: 100%;
	}
	.spec-alert .goods-infor .infor{
	    width: calc(100% - 236rpx);
	    float: left;
	    padding-top: 70rpx;
	    color: #333;
	}
	.spec-alert .goods-infor .infor p{
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	}
	.spec-alert .goods-infor .infor .price{
	    font-size: 32rpx;
	    line-height: 60rpx;
	    color: #f24f4c;
	}
	.spec-alert .goods-infor .infor .price .big{
	    font-size: 40rpx;
	}
	.spec-alert .goods-infor .infor .num{
	    color: #999;
	    font-size: 24rpx;
	    line-height: 36rpx;
	}
	.spec-alert .goods-infor .infor .spec{
	    font-size: 24rpx;
	}
	.spec-alert .spec-box-scroll{
	    max-height: 560rpx;
	    overflow-y: scroll;
	}
	.spec-alert .spec-box{
	    padding: 10rpx 0;
	    color: #333;
	    border-bottom: solid 2rpx #e5e5e5;
	}
	.spec-alert .spec-box .spec-title{
	    font-size: 28rpx;
	    line-height: 56rpx;
	}
	.spec-alert .spec-box .spec-list{
	    overflow: hidden;
	}
	.spec-alert .spec-box .spec-list .item{
	    margin: 10rpx 20rpx 10rpx 0;
	    padding: 0 20rpx;
	    line-height: 60rpx;
	    font-size: 24rpx;
	    border-radius: 6rpx;
	    background-color: #f5f5f5;
	    float: left;
	    border: solid 2rpx #f5f5f5;
	}
	.spec-alert .spec-box .spec-list .disable{
	    color: #ccc;
	}
	.spec-alert .spec-box .spec-list .item image{
	    width: 50rpx;
	    height: 50rpx;
	    vertical-align: middle;
	    margin: -6rpx 10rpx 0 0;
	}
	.spec-alert .spec-box .spec-list .active{
	    color: #7f8aef;
	    border: solid 2rpx #7f8aef;
	}
	.spec-alert .chose-num{
	    padding: 20rpx 0;
	    font-size: 28rpx;
	    line-height: 56rpx;
	    color: #333;
	    overflow: hidden;
	}
	.spec-alert .chose-num .num-box{
	    float: right;
	}
	.spec-alert .chose-num .num-box button{
	    display: inline-block;
	    background: transparent;
	    border-radius: 8rpx;
	    font-size: 44rpx;
	    line-height: 45rpx;
	    font-weight: normal;
	    color: #5d5d5d;
	    vertical-align: top;
	    outline: none;
	}
	.spec-alert .chose-num .num-box text{
	    display: inline-block;
	    vertical-align: top;
	    height: 45rpx;
	    width: 50rpx;
	    padding: 0 10rpx;
	    text-align: center;
	    font-size: 28rpx;
	    color: #333;
	    line-height: 45rpx;
	}
	.spec-alert .sure-btn{
	    background-color: #7f8aef;
	    font-size: 32rpx;
	    text-align: center;
	    line-height: 80rpx;
	    color: #FFF;
	    border-radius: 40rpx;
	    margin-top: 50rpx;
	}
	/*商品规格end*/
</style>
