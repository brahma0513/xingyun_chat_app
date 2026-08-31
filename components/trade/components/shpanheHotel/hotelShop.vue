<template>
	<view :style="'padding:'+(datas.content.padding_top==undefined?datas.content.padding:datas.content.padding_top)+'px '
			+(datas.content.style==1?0:10)+'px '+(datas.content.padding_bottom==undefined?datas.content.padding:datas.content.padding_bottom)+'px;'">
		<view class="custom-order" style="padding: :0;">
			<view v-if="datas.content.css_type == 2" class="type2">
				<view hover-class="no-hover" class="order-title"
					@click="$common.diyLinkJump(datas.content.web_url+'/shpanhe_hotel/web/index.php?m=order&a=order_list&num=0')">
					<view class="img">
						<image :src="datas.content.dataset[0].pic"></image>
					</view>
					<view class="infor">
						{{datas.content.li_title}}
					</view>
				</view>
			</view>

			<view v-if="datas.content.css_type == 1" class="type1"
				@click="$common.diyLinkJump(datas.content.web_url+'/shpanhe_hotel/web/index.php?m=order&a=order_list&num=0')">
				<view class="title">
					<p class="name">{{datas.content.li_title}}</p>
					<p class="more">全部订单<!--全部订单--></p>
				</view>
				<view class="order-list">
					<li v-if="datas.content.order_style==undefined||datas.content.order_style==1"
						v-for="(itm,itm_index) in datas.content.dataset[0].icon_list">
						<view class="img"
							@click="$common.diyLinkJump(datas.content.web_url+'/shpanhe_hotel/web/index.php?m=order&a=order_list&num='+(itm_index+1))">
							<view v-if="itm.num>0">
								<view class="round" style="width: 24px;" v-if="itm.num>99">99+</view>
								<view class="round" v-else>{{itm.num}}</view>
							</view>
							<img :src="itm.icon" alt="" />
						</view>
						<p>{{itm.name}}</p>
					</li>
					<li v-if="datas.content.order_style==2"
						v-for="(itm,itm_index) in datas.content.dataset[0].icon_list_two">
						<view class="img"
							@click="$common.diyLinkJump(datas.content.web_url+'/shpanhe_hotel/web/index.php?m=order&a=order_list&num='+(itm_index+1))">
							<view v-if="itm.num>0">
								<view class="round" style="width: 24px;" v-if="itm.num>99">99+</view>
								<view class="round" v-else>{{itm.num}}</view>
							</view>
							<img :src="itm.icon" alt="" />
						</view>
						<p>{{itm.name}}</p>
					</li>
				</view>

			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "hotelShop",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				price_color: getApp().globalData.price_color,
				monetary_unit: getApp().globalData.monetary_unit,
			};
		},
		created() {
			var _this = this;
			_this.getHoteldata()
		},
		methods: {
			getHoteldata: function() {
				const _this = this;
				_this.$common.requestData({
					url: '/shpanhe_hotel/web/index.php?m=order&a=get_order_num',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					var items = _this.datas.content.dataset[0].icon_list;
					items[0].num = res.data.for_payment;
					items[1].num = res.data.wait_confirm;
					items[2].num = res.data.is_confirm;
					items[3].num = res.data.is_cancel;
					_this.datas.content.dataset[0].icon_list = items;
					if (_this.datas.content.order_style == 2) {
						var items = _this.datas.content.dataset[0].icon_list_two;
						items[0].num = res.data.for_payment;
						items[1].num = res.data.wait_confirm;
						items[2].num = res.data.is_confirm;
						items[3].num = res.data.is_cancel;
						_this.datas.content.dataset[0].icon_list_two = items;
					}
				})
			}

		}
	}
</script>

<style>
	.custom-order {
		padding: 0 10px;
	
	}
	
	.custom-order .order-title {
		display: block;
		text-align: center
	}
	
	.custom-order .type2 {
		padding: 0px 10px;
		border-radius: 8px;
		background-color: #FFF;
	}

	.custom-order .order-title .img {
		width: 28px;
		height: 28px;
		float: left;
		margin-right: 10px;
	}

	.custom-order .order-title .img img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.custom-order .order-title .infor {
		width: calc(100% - 38px);
		float: left;
		line-height: 28px;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.custom-order .type1 {
		background-color: #FFF;
		border-radius: 8px;
		padding: 5px 15px;
	}

	/*.custom-order .type1:last-child{
		margin-bottom: 0;
	}*/
	.custom-order .type1 .title {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		padding: 10px 0;
		font-size: 15px;
		color: #333;
		line-height: 25px;
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
		margin-left: 10px;
		background-size: auto 14px;
		background-repeat: no-repeat;
		background-position: right center;
		padding-right: 15px;
		font-size: 13px;
		color: #999;
	}

	.custom-order .type1 .order-list {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		text-align: center;
		padding: 5px 5px 0 5px;
	}

	.custom-order .type1 .order-list li {
		-webkit-box-flex: auto;
		-webkit-flex: auto;
		flex: auto;
		width: 30%;
		list-style-type: none;
	}

	.custom-order .type1 .order-list .img {
		width: 50%;
		height: 35px;
		margin: 5px auto;
		position: relative;
	}

	.custom-order .type1 .order-list .img .round {
		position: absolute;
		background-color: #f24f4c;
		font-size: 10px;
		color: #FFF;
		line-height: 14px;
		width: 16px;
		height: 16px;
		border-radius: 8px;
		right: -8px;
		top: -6px;
	}

	.custom-order .type1 .order-list .img img {
		width: 35px;
		height: 35px;
		
	}

	.custom-order .type1 .order-list p {
	
		font-size: 13px;
		color: #333333;
		line-height: 24px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		display: block
	}
</style>