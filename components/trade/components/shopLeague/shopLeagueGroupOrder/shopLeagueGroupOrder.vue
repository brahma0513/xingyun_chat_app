<template>
	<!-- 订单显示start -->
	<view :style="'padding:'+datas.content.padding+'px '+(datas.content.style==1?0:10)+'px ;'">
		<view>
			<view class="custom-order">
				<view class="type2" v-if="datas.content.css_type==2" style="border-bottom:1px solid #f0f0f0">
					<view class="order-title" :style="'background-image:url('+http_host+'/shop_league/web/static/images/icon_right.png)'">
						<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list'">
							<view class="img">
								<image :src="datas.content.icon_pic"/>
							</view>
							<view class="infor">
								{{datas.content.li_title}}
							</view>
						</view>
					</view>
				</view>
				<view class="type1" v-if="datas.content.css_type==1" style="border-bottom:1px solid #f0f0f0">
					<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list'">
						<view class="title">
							<p class="name">{{datas.content.li_title}}</p>
							<p class="more" :style="'background-image:url('+http_host+'/shop_league/web/static/images/icon_right.png)'">全部订单</p>
						</view>
					</view>
					<view class="order-list">
						<template v-if="datas.content.order_style == 1">
							<view class="li">
								<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=1'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=1'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list[0].num > 0">{{datas.content.dataset[0].icon_list[0].num}}</view>
										<image :src="datas.content.dataset[0].icon_list[0].icon" alt="" />
									</view>
									<p>{{datas.content.dataset[0].icon_list[0].name}}</p>
								</view>
							</view>
							<view class="li">
								<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=2'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=2'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list[1].num>0">{{datas.content.dataset[0].icon_list[1].num}}</view>
										<image :src="datas.content.dataset[0].icon_list[1].icon" alt="" />
									</view>
									<p>{{datas.content.dataset[0].icon_list[1].name}}</p>
								</view>
							</view>
							<view class="li">
								<view @click="goUrl"  :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=3'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=3'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list[2].num>0">{{datas.content.dataset[0].icon_list[2].num}}</view>
										<image :src="datas.content.dataset[0].icon_list[2].icon" alt="" />
									</view>
									<p>{{datas.content.dataset[0].icon_list[2].name}}</p>
								</view>
							</view>
							<view class="li">
								<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=4'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=4'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list[3].num>0">{{datas.content.dataset[0].icon_list[3].num}}</view>
										<image :src="datas.content.dataset[0].icon_list[3].icon" alt="" />
									</view>
									<p >{{datas.content.dataset[0].icon_list[3].name}}</p>
								</view>
							</view>
							<view class="li">
								<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=5'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=5'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list[4].num>0">{{datas.content.dataset[0].icon_list[4].num}}</view>
										<image :src="datas.content.dataset[0].icon_list[4].icon" alt="" />
									</view>
									<p>{{datas.content.dataset[0].icon_list[4].name}}</p>
								</view>
							</view>
						</template>
						<template v-else>
							<view class="li">
								<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=1'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=1'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list_two[0].num > 0">{{datas.content.dataset[0].icon_list_two[0].num}}</view>
										<image :src="datas.content.dataset[0].icon_list_two[0].icon" alt="" />
									</view>
									<p>{{datas.content.dataset[0].icon_list_two[0].name}}</p>
								</view>
							</view>
							<view class="li">
								<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=2'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=2'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list_two[1].num>0">{{datas.content.dataset[0].icon_list_two[1].num}}</view>
										<image :src="datas.content.dataset[0].icon_list_two[1].icon" alt="" />
									</view>
									<p>{{datas.content.dataset[0].icon_list_two[1].name}}</p>
								</view>
							</view>
							<view class="li">
								<view @click="goUrl"  :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=3'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=3'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list_two[2].num>0">{{datas.content.dataset[0].icon_list_two[2].num}}</view>
										<image :src="datas.content.dataset[0].icon_list_two[2].icon" alt="" />
									</view>
									<p>{{datas.content.dataset[0].icon_list_two[2].name}}</p>
								</view>
							</view>
							<view class="li">
								<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=4'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=4'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list_two[3].num>0">{{datas.content.dataset[0].icon_list_two[3].num}}</view>
										<image :src="datas.content.dataset[0].icon_list_two[3].icon" alt="" />
									</view>
									<p >{{datas.content.dataset[0].icon_list_two[3].name}}</p>
								</view>
							</view>
							<view class="li">
								<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=5'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=5'">
									<view class="img">
										<view class="round" v-if="datas.content.dataset[0].icon_list_two[4].num>0">{{datas.content.dataset[0].icon_list_two[4].num}}</view>
										<image :src="datas.content.dataset[0].icon_list_two[4].icon" alt="" />
									</view>
									<p>{{datas.content.dataset[0].icon_list_two[4].name}}</p>
								</view>
							</view>
						</template>
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- 订单显示end -->
</template>

<script>
	export default {
		name: "shopLeagueCollagelOrder",
		props: {
			datas: {
				type: Object,
				defaviewt: {}
			},
		},
		data() {
			return {
				http_host: this.vuex_apiUrl,
				list: [],
			};
		},
		created() {
			var _this = this;
			_this.http_host = this.vuex_apiUrl
			for(var i=0; i<this.datas.content.dataset[0].icon_list.length; i++){
				if(this.datas.content.order_style == '1'){
					if(this.datas.content.dataset[0].icon_list[i].icon.indexOf("/HTML/")==0){
						this.datas.content.dataset[0].icon_list[i].icon = _this.http_host+this.datas.content.dataset[i].icon;
					}else if(this.datas.content.dataset[0].icon_list[i].icon.indexOf("http")!=0){
						this.datas.content.dataset[0].icon_list[i].icon = _this.http_host+'/resources/'+this.datas.content.dataset[i].icon;
					}
				}else{
					if(this.datas.content.dataset[0].icon_list_two[i].icon.indexOf("/HTML/")==0){
						this.datas.content.dataset[0].icon_list_two[i].icon = _this.http_host+this.datas.content.dataset[i].icon;
					}else if(this.datas.content.dataset[0].icon_list_two[i].icon.indexOf("http")!=0){
						this.datas.content.dataset[0].icon_list_two[i].icon = _this.http_host+'/resources/'+this.datas.content.dataset[i].icon;
					}
				}
				
			}
			
			_this.shop_league_getdata()
			uni.$on('onShow', () => {
				_this.shop_league_getdata()
			})
		},
		methods: {
			shop_league_getdata: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id
				};
				
				_this.$common.requestData({
					url: '/shop_league/web/index.php?m=component&a=get_order_num',
					data: params,
					method: 'POST',
					needToken: true
				}).then(res => {
					if(_this.datas.content.order_style == 1){
						var items = JSON.parse(JSON.stringify(_this.datas.content.dataset[0].icon_list));
					}else{
						var items = JSON.parse(JSON.stringify(_this.datas.content.dataset[0].icon_list_two));
					}
					// items[0].num = res.data.preferential_order.to_pay;
					// items[1].num = res.data.preferential_order.to_use;
					// items[2].num = res.data.preferential_order.to_finish;
					// items[3].num = res.data.preferential_order.complete;
					// items[4].num = res.data.preferential_order.refund;
					// _this.datas.content.dataset = items
					
					// var items = JSON.parse(JSON.stringify(_this.datas.content.dataset2));
					items[0].num = res.data.collage_order.to_pay;
					items[1].num = res.data.collage_order.to_collage;
					items[2].num = res.data.collage_order.success;
					items[3].num = res.data.collage_order.fail;
					items[4].num = res.data.collage_order.close;
					
					if(_this.datas.content.order_style == 1){
						_this.datas.content.dataset[0].icon_list = items
					}else{
						_this.datas.content.dataset[0].icon_list_two = items
					}
					// _this.datas.content.dataset = items
				})
			},
			goUrl: function (e) {
				var hurl = e.currentTarget.dataset.hurl
				this.$common.diyLinkJump(hurl);
			},
			jump(m,a,type=0) {
				let src="/shop_league/web/index.php?";
				src+="m="+m;
				src+="&a="+a;
				if(type>0){
					src+="&type="+type;
				}
				this.$common.diyLinkJump(src);
			},
		}
	}
</script>

<style>
	.custom-order {
	  padding: 0 20rpx;
	}
	
	.custom-order .type2 {
	  padding: 0px 30rpx;
	  border-radius: 16rpx;
	  background-color: #FFF;
	  margin: 10rpx 0;
	}
	
	.custom-order .order-title {
	  padding: 27rpx 30rpx 27rpx 0;
	  overflow: hidden;
	  /* background-image: url(../images/custon_right.png); */
	  background-size: auto 28rpx;
	  background-repeat: no-repeat;
	  background-position: right center;
	}
	
	.custom-order .order-title .img {
	  width: 56rpx;
	  height: 56rpx;
	  float: left;
	  margin-right: 20rpx;
	}
	
	.custom-order .order-title .img image {
	  display: block;
	  width: 100%;
	  height: 100%;
	}
	
	.custom-order a{
		text-align: center;
		width: 25%;
		text-decoration: none;
		color: #000;
	}
	
	.custom-order .order-title .infor {
	  width: calc(100% - 76rpx);
	  float: left;
	  line-height: 56rpx;
	  color: #333;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
	
	.custom-order .type1 {
	  background-color: #FFF;
	  border-radius: 16rpx;
	  padding: 0 30rpx;
	}
	.custom-order .type1 .title {
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  padding: 20rpx 0;
	  font-size: 30rpx;
	  color: #333;
	  line-height:50rpx;
	  justify-content:space-between;
	}
	
	.custom-order .type1 .title p {
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  margin: 0;
	}
	
	.custom-order .type1 .title .name {
	  /* -webkit-box-flex: auto; */
	  /* -webkit-flex: auto; */
	  /* flex: auto; */
	  /* width: 30%; */
	}
	
	.custom-order .type1 .title .more {
	  -webkit-box-flex: none;
	  -webkit-flex: none;
	  flex: none;
	  margin-left: 20rpx;
	  /* background-image: url(../images/custon_right.png); */
	  background-size: auto 28rpx;
	  background-repeat: no-repeat;
	  background-position: right center;
	  padding-right: 30rpx;
	  font-size: 26rpx;
	  color: #999;
	}
	
	.custom-order .type1 .order-list {
	  display: -webkit-box;
	  display: -webkit-flex;
	  display: flex;
	  text-align: center;
	  padding: 20rpx 0 30rpx;
	}
	
	.custom-order .type1 .order-list .li {
	  -webkit-box-flex: auto;
	  -webkit-flex: auto;
	  flex: auto;
	  width: 20%;
	}
	
	.custom-order .type1 .order-list .img {
	  width: 60rpx;
	  height: 60rpx;
	  margin: 0 auto 5px;
	  position: relative;
	}
	
	.custom-order .type1 .order-list .img .round {
	  position: absolute;
	  background-color: #f24f4c;
	  font-size: 10px;
	  color: #FFF;
	  line-height: 32rpx;
	  width:32rpx;
	  height: 32rpx;
	  border-radius:16rpx;
	  right: -16rpx;
	  top: -12rpx;
	}
	
	.custom-order .type1 .order-list .img image {
	  display: block;
	  width: 100%;
	  height: 100%;
	}
	
	.custom-order .type1 .order-list p {
	  font-size: 26rpx;
	  color: #333333;
	  line-height: 48rpx;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
	
</style>