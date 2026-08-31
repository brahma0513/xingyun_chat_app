<template>
	<!-- 订单显示start -->
	<view :style="'padding:'+datas.content.padding+'px 0;'">
		<view v-if="datas.content.version == 130"><!--130版本的组件-->
			<view class="custom-order">
				<view class="type2" v-if="datas.content.css_type==2" style="border-bottom:1px solid #f0f0f0">
					<view class="order-title" v-for="(it,it_indexs) in datas.content.dataset">
						<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=preferential_order&a=preferential_order_list'" :data-url="'/shop_league/pages/preferential_order/preferential_order_list/preferential_order_list'">
							<view class="img">
								<image :src="it.pic"/>
							</view>
							<view class="infor">
								{{it.name}}
							</view>
						</view>
					</view>
				</view>
				<view class="type1" v-if="datas.content.css_type==1" style="border-bottom:1px solid #f0f0f0">
					<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=preferential_order&a=preferential_order_list'" :data-url="'/shop_league/pages/preferential_order/preferential_order_list/preferential_order_list'">
						<view class="title">
							<p class="name">{{datas.content.li_title}}</p>
							<p class="more" :style="'background-image:url('+http_host+'/shop_league/web/static/images/icon_right.png)'">全部订单</p>
						</view>
					</view>
					<view class="order-list">
						<view class="li">
							<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=preferential_order&a=preferential_order_list&type=wait_pay'" :data-url="'/shop_league/pages/preferential_order/preferential_order_list/preferential_order_list?type=1'" data-numtype="0" :data-num="datas.content.dataset[0].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset[0].num>0">{{datas.content.dataset[0].num}}</view>
									<image :src="datas.content.dataset[0].icon" alt="" />
								</view>
								<p>{{datas.content.dataset[0].name}}</p>
							</view>
						</view>
						<view class="li">
							<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=preferential_order&a=preferential_order_list&type=wait_use'" :data-url="'/shop_league/pages/preferential_order/preferential_order_list/preferential_order_list?type=2'" data-numtype="1" :data-num="datas.content.dataset[1].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset[1].num>0">{{datas.content.dataset[1].num}}</view>
									<image :src="datas.content.dataset[1].icon" alt="" />
								</view>
								<p>{{datas.content.dataset[1].name}}</p>
							</view>
						</view>
						<view class="li">
							<view @click="goUrl"  :data-hurl="'/shop_league/web/index.php?m=preferential_order&a=preferential_order_list&type=wait_finish'" data-url="/shop_league/pages/preferential_order/preferential_order_list/preferential_order_list?type=4" data-numtype="2" :data-num="datas.content.dataset[2].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset[2].num>0">{{datas.content.dataset[2].num}}</view>
									<image :src="datas.content.dataset[2].icon" alt="" />
								</view>
								<p>{{datas.content.dataset[2].name}}</p>
							</view>
						</view>
						<view class="li">
							<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=preferential_order&a=preferential_order_list&type=finished'" :data-url="'/shop_league/pages/preferential_order/preferential_order_list/preferential_order_list?type=3'" data-numtype="3" :data-num="datas.content.dataset[3].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset[3].num>0">{{datas.content.dataset[3].num}}</view>
									<image :src="datas.content.dataset[3].icon" alt="" />
								</view>
								<p>{{datas.content.dataset[3].name}}</p>
							</view>
						</view>
						<view class="li">
							<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=preferential_order&a=preferential_order_list&type=refund'" :data-url="'/shop_league/pages/preferential_order/preferential_order_list/preferential_order_list?type=5'" data-numtype="4" :data-num="datas.content.dataset[4].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset[4].num>0">{{datas.content.dataset[4].num}}</view>
									<image :src="datas.content.dataset[4].icon" alt="" />
								</view>
								<p>{{datas.content.dataset[4].name}}</p>
							</view>
						</view>
					</view>
	
				</view>
			</view>
			<view class="custom-order">
				<view class="type2" v-if="datas.content.css_type==2">
					<view class="order-title" v-for="(it,it_indexs1) in datas.content.dataset2">
						<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list'" :data-url="'/shop_league/pages/preferential_order/preferential_order_list/preferential_order_list'">
							<view class="img">
								<image :src="it.pic"/>
							</view>
							<view class="infor">
								{{it.name}}
							</view>
						</view>
					</view>
				</view>
				<view class="type1" v-if="datas.content.css_type==1">
					<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list'">
						<view class="title">
							<p class="name">{{datas.content.li_title2}}</p>
							<p class="more" :style="'background-image:url('+http_host+'/shop_league/web/static/images/icon_right.png)'">全部订单</p>
						</view>
					</view>
					<view class="order-list">
						<view class="li">
							<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=1'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=1'" data-numtype="5" :data-num="datas.content.dataset2[0].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset2[0].num>0">{{datas.content.dataset2[0].num}}</view>
									<image :src="datas.content.dataset2[0].icon" alt="" />
								</view>
								<p>{{datas.content.dataset2[0].name}}</p>
							</view>
						</view>
						<view class="li">
							<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=2'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=2'" data-numtype="6" :data-num="datas.content.dataset2[1].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset2[1].num>0">{{datas.content.dataset2[1].num}}</view>
									<image :src="datas.content.dataset2[1].icon" alt="" />
								</view>
								<p>{{datas.content.dataset2[1].name}}</p>
							</view>
						</view>
						<view class="li">
							<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=3'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=3'" data-numtype="7" :data-num="datas.content.dataset2[2].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset2[2].num>0">{{datas.content.dataset2[2].num}}</view>
									<image :src="datas.content.dataset2[2].icon" alt="" />
								</view>
								<p>{{datas.content.dataset2[2].name}}</p>
							</view>
						</view>
						<view class="li">
							<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=4'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=4'" data-numtype="8" :data-num="datas.content.dataset2[3].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset2[3].num>0">{{datas.content.dataset2[3].num}}</view>
									<image :src="datas.content.dataset2[3].icon" alt="" />
								</view>
								<p>{{datas.content.dataset2[3].name}}</p>
							</view>
						</view>
						<view class="li">
							<view @click="goUrl" :data-hurl="'/shop_league/web/index.php?m=collage_order&a=collage_order_list&type=5'" :data-url="'/shop_league/pages/collage_order/collage_order_list/collage_order_list?type=5'" data-numtype="9" :data-num="datas.content.dataset2[4].num" :data-id="datas.id">
								<view class="img">
									<view class="round" v-if="datas.content.dataset2[4].num>0">{{datas.content.dataset2[4].num}}</view>
									<image :src="datas.content.dataset2[4].icon" alt="" />
								</view>
								<p>{{datas.content.dataset2[4].name}}</p>
							</view>
						</view>
					</view>
	
				</view>
			</view>
		</view>
	</view>
	<!-- 订单显示end -->
</template>

<script>
	export default {
		name: "shopLeagueOrder",
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
			for(var i=0; i<this.datas.content.dataset.length; i++){
				if(this.datas.content.dataset[i].icon.indexOf("/HTML/")==0){
					this.datas.content.dataset[i].icon = _this.http_host+this.datas.content.dataset[i].icon;
				}else if(this.datas.content.dataset[i].icon.indexOf("http")!=0){
					this.datas.content.dataset[i].icon = _this.http_host+'/resources/'+this.datas.content.dataset[i].icon;
				}
			}
			for(var i=0; i<this.datas.content.dataset2.length; i++){
				if(this.datas.content.dataset2[i].icon.indexOf("/HTML/")==0){
					this.datas.content.dataset2[i].icon = _this.http_host+this.datas.content.dataset2[i].icon;
				}else if(this.datas.content.dataset2[i].icon.indexOf("http")!=0){
					this.datas.content.dataset2[i].icon = _this.http_host+'/resources/'+this.datas.content.dataset2[i].icon;
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
					let delnum0=uni.getStorageSync("trade100362_delnum0_"+_this.datas.id)||0
					let delnum1=uni.getStorageSync("trade100362_delnum1_"+_this.datas.id)||0
					let delnum2=uni.getStorageSync("trade100362_delnum2_"+_this.datas.id)||0
					let delnum3=uni.getStorageSync("trade100362_delnum3_"+_this.datas.id)||0
					let delnum4=uni.getStorageSync("trade100362_delnum4_"+_this.datas.id)||0
					let delnum5=uni.getStorageSync("trade100362_delnum5_"+_this.datas.id)||0
					let delnum6=uni.getStorageSync("trade100362_delnum6_"+_this.datas.id)||0
					let delnum7=uni.getStorageSync("trade100362_delnum7_"+_this.datas.id)||0
					let delnum8=uni.getStorageSync("trade100362_delnum8_"+_this.datas.id)||0
					let delnum9=uni.getStorageSync("trade100362_delnum9_"+_this.datas.id)||0
					
					var items = JSON.parse(JSON.stringify(_this.datas.content.dataset));
					items[0].num = ((delnum0<res.data.preferential_order.to_pay)?(res.data.preferential_order.to_pay - delnum0):'0');
					items[1].num = ((delnum1<res.data.preferential_order.to_use)?(res.data.preferential_order.to_use - delnum1):'0');
					items[2].num = ((delnum2<res.data.preferential_order.to_finish)?(res.data.preferential_order.to_finish - delnum2):'0');
					items[3].num = ((delnum3<res.data.preferential_order.complete)?(res.data.preferential_order.complete - delnum3):'0');
					items[4].num = ((delnum4<res.data.preferential_order.refund)?(res.data.preferential_order.refund - delnum4):'0');
					_this.datas.content.dataset = items
					
					var items = JSON.parse(JSON.stringify(_this.datas.content.dataset2));
					items[0].num = ((delnum5<res.data.collage_order.to_pay)?(res.data.collage_order.to_pay - delnum5):'0');
					items[1].num = ((delnum6<res.data.collage_order.to_collage)?(res.data.collage_order.to_collage - delnum6):'0');
					items[2].num = ((delnum7<res.data.collage_order.success)?(res.data.collage_order.success - delnum7):'0');
					items[3].num = ((delnum8<res.data.collage_order.fail)?(res.data.collage_order.fail - delnum8):'0');
					items[4].num = ((delnum9<res.data.collage_order.close)?(res.data.collage_order.close - delnum9):'0');
					_this.datas.content.dataset2 = items
				})
			},
			goUrl: function (e) {
				let numtype=e.currentTarget.dataset.numtype
				let id=e.currentTarget.dataset.id
				let num=e.currentTarget.dataset.num
				let delnum=uni.getStorageSync('trade100362_delnum'+numtype+'_'+id)||0
				let numall=num+Number(delnum)
				uni.setStorageSync('trade100362_delnum'+numtype+'_'+id, numall)
					  
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