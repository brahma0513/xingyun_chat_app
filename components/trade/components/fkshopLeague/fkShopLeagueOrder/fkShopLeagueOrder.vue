<template>
	<!-- 订单显示start -->
	<view
		:style="'padding: '+datas.content.padding_top+'px '+(datas.content.display_method==2?datas.content.padding_horizontal:0)+'px '+datas.content.padding_bottom+'px;'">
		<view class="custom-order" style="padding: 0;">
			<view class="type2" v-if="datas.content.select_style==2"
				:style="'margin:0px;border-radius: '+(datas.content.display_method==1?0:datas.content.radius_diy)+'px;'">
				<view class="order-title" :style="'background-image:url('+http_host+'/fkshop_league/web/static/images/icon_right.png)'">
					<view @click="goUrl" :data-hurl="'/fkshop_league/web/index.php?m=store&a=order_center'" data-url="/fkshop_league/pages/store/order_center/order_center">
						<view class="img">
							<image :src="datas.content.icon_pic" mode="widthFix" />
						</view>
						<view class="infor">
							{{datas.content.li_title}}
						</view>
					</view>
				</view>
			</view>
			<view class="type1" v-if="datas.content.select_style==1"
				:style="'border-radius: '+(datas.content.display_method==1?0:datas.content.radius_diy)+'px;'">
				<view @click="goUrl" :data-hurl="'/fkshop_league/web/index.php?m=store&a=order_center'" data-url="/fkshop_league/pages/store/order_center/order_center">
					<view class="title">
						<p class="name">{{datas.content.li_title}}</p>
						<p class="more"
							:style="'background-image:url('+http_host+'/fkshop_league/web/static/images/icon_right.png)'">
							全部订单</p>
					</view>
				</view>
				<ul class="order-list">
					<li>
						<view @click="goUrl" :data-hurl="'/fkshop_league/web/index.php?m=store&a=order_center&type=wait_pay'" data-url="/fkshop_league/pages/store/order_center/order_center"
							:data-type="datas.content.dataset[0].key">
							<view class="img">
								<view class="round" v-if="datas.content.dataset[0].num>0">{{datas.content.dataset[0].num}}</view>
								<image v-if="datas.content.icon_display_method==1" :src="datas.content.dataset[0].icon"
									mode="widthFix" />
								<image v-if="datas.content.icon_display_method==2" :src="datas.content.dataset[0].pic"
									mode="widthFix" />
							</view>
							<p>{{datas.content.dataset[0].name}}</p>
						</view>
					</li>
					<li>
						<view @click="goUrl" :data-hurl="'/fkshop_league/web/index.php?m=store&a=order_center&type=wait_receive'" data-url="/fkshop_league/pages/store/order_center/order_center"
							:data-type="datas.content.dataset[1].key">
							<view class="img">
								<view class="round" v-if="datas.content.dataset[1].num>0">{{datas.content.dataset[1].num}}</view>
								<image v-if="datas.content.icon_display_method==1" :src="datas.content.dataset[1].icon"
									mode="widthFix" />
								<image v-if="datas.content.icon_display_method==2" :src="datas.content.dataset[1].pic"
									mode="widthFix" />
							</view>
							<p>{{datas.content.dataset[1].name}}</p>
						</view>
					</li>
					<li>
						<view @click="goUrl" :data-hurl="'/fkshop_league/web/index.php?m=store&a=order_center&type=wait_use&personal_center_tab_topIndex=2'" data-url="/fkshop_league/pages/store/order_center/order_center"
							:data-type="datas.content.dataset[2].key" data-topindex="2">
							<view class="img">
								<view class="round" v-if="datas.content.dataset[2].num>0">{{datas.content.dataset[2].num}}</view>
								<image v-if="datas.content.icon_display_method==1" :src="datas.content.dataset[2].icon"
									mode="widthFix" />
								<image v-if="datas.content.icon_display_method==2" :src="datas.content.dataset[2].pic"
									mode="widthFix" />
							</view>
							<p>{{datas.content.dataset[2].name}}</p>
						</view>
					</li>
					<li>
						<view @click="goUrl" :data-hurl="'/fkshop_league/web/index.php?m=store&a=order_center&type=wait_finish'" data-url="/fkshop_league/pages/store/order_center/order_center"
							:data-type="datas.content.dataset[3].key">
							<view class="img">
								<view class="round" v-if="datas.content.dataset[3].num>0">{{datas.content.dataset[3].num}}</view>
								<image v-if="datas.content.icon_display_method==1" :src="datas.content.dataset[3].icon"
									mode="widthFix" />
								<image v-if="datas.content.icon_display_method==2" :src="datas.content.dataset[3].pic"
									mode="widthFix" />
							</view>
							<p>{{datas.content.dataset[3].name}}</p>
						</view>
					</li>
					<li>
						<view @click="goUrl" :data-hurl="'/fkshop_league/web/index.php?m=store&a=order_center&type=finished'" data-url="/fkshop_league/pages/store/order_center/order_center"
							:data-type="datas.content.dataset[4].key">
							<view class="img">
								<view class="round" v-if="datas.content.dataset[4].num>0">{{datas.content.dataset[4].num}}</view>
								<image v-if="datas.content.icon_display_method==1" :src="datas.content.dataset[4].icon"
									mode="widthFix" />
								<image v-if="datas.content.icon_display_method==2" :src="datas.content.dataset[4].pic"
									mode="widthFix" />
							</view>
							<p>{{datas.content.dataset[4].name}}</p>
						</view>
					</li>
				</ul>
			</view>
		</view>
	</view>
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
				list_num: []
			};
		},
		created() {
			var _this = this;
			_this.http_host = this.vuex_apiUrl
			for (var i = 0; i < this.datas.content.dataset.length; i++) {
				if (this.datas.content.dataset[i].icon.indexOf("/HTML/") == 0) {
					this.datas.content.dataset[i].icon = _this.http_host + this.datas.content.dataset[i].icon;
				} else if (this.datas.content.dataset[i].icon.indexOf("http") != 0) {
					this.datas.content.dataset[i].icon = _this.http_host + '/resources/' + this.datas.content.dataset[i]
						.icon;
				}
			}
			_this.shop_league_getdata()
		},
		methods: {
			shop_league_getdata: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id
				};

				_this.$common.requestData({
					url: '/fkshop_league/web/index.php?m=component&a=get_order_num',
					data: params,
					method: 'POST',
					needToken: true
				}).then(res => {
					var items = JSON.parse(JSON.stringify(_this.datas.content.dataset));
					items[0].num = res.data.preferential_order.to_pay + res.data.collage_order.to_pay;
					items[1].num = res.data.preferential_order.to_receive;
					items[2].num = res.data.preferential_order.to_use;
					items[3].num = res.data.preferential_order.to_finish;
					items[4].num = res.data.preferential_order.complete;
					_this.datas.content.dataset = items
					console.log(_this.datas.content.dataset)
				})
			},
			goUrl: function(e) {
				var hurl = e.currentTarget.dataset.hurl
				this.$common.diyLinkJump(hurl);
			},
			jump(m, a, type = 0) {
				let src = "/fkshop_league/web/index.php?";
				src += "m=" + m;
				src += "&a=" + a;
				if (type > 0) {
					src += "&type=" + type;
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
		line-height: 50rpx;
	}

	.custom-order .type1 .title p {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}

	.custom-order .type1 .title .name {
		-webkit-box-flex: auto;
		-webkit-flex: auto;
		flex: auto;
		width: 50%;
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
		list-style: none;
	}

	.custom-order .type1 .order-list li {
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
		width: 32rpx;
		height: 32rpx;
		border-radius: 16rpx;
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