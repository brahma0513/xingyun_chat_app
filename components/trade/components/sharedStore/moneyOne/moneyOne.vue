<template>
	<view v-if="localData.type=='tradeshuyun99'"
		:style="'padding: '+(localData.content.padding_top==undefined?localData.content.padding:localData.content.padding_top)+'px '+'10px '+(localData.content.padding_bottom==undefined?localData.content.padding:localData.content.padding_bottom)+'px'">
		<view class="money_view">
			<view class="money_left">
				<view @click="$common.diyLinkJump('/wsy_user/web/index.php?m=pocket_money&a=my_pocket_money')">
						<view>{{localData.content.dataset[0].title}}</view>
						<view class="price">{{localData.content.dataset[0].price||'0.00'}}</view>
				</view>
				<view @click="$common.diyLinkJump('/wsy_user/web/index.php?m=integral&a=my_integral')">
						<view>{{localData.content.dataset[1].title}}</view>
						<view class="price">{{localData.content.dataset[1].price||'0'}}</view>
				</view>
			</view>

			<view class="money_right" style="justify-content: center">
				<view @click="$common.diyLinkJump('/shared_store/web/index.php?m=view&a=couponList')">
						<img :src="localData.content.dataset[2].icon"></img>
						<view>{{localData.content.dataset[2].title}}</view>
				</view>
				<!--            <view>-->
				<!--                <a  href="">-->
				<!--                    <img :src="item.content.dataset[3].icon"></img>-->
				<!--                    <view>{{item.content.dataset[3].title}}</view>-->
				<!--                </a>-->
				<!--            </view>-->

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "moneyOne",
		data() {
			return {
				localData: {},
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				monetary_unit: getApp().globalData.monetary_unit,
			};
		},
		created() {
			this.localData = this.$attrs.datas;
			this.get_my_user();
		},
		methods: {
			//获取用户信息
			get_my_user() {
				const that = this;
				that.$common.requestData({
					url: '/shared_store/web/index.php?m=user&a=my',
					data: {
						type: 0,
					},
					method: 'POST',
					needToken: true,
				}).then(res => {
					if (res.errcode === 0) {
						that.localData.content.dataset[0].price = res.data.money;
						that.localData.content.dataset[1].price = res.data.score;
					}
				})
			},
		}
	};
</script>

<style>
	.money_view {
		border-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		background: linear-gradient(180deg, #F3F3F3 0%, #FDFDFD 100%);
		margin: 20rpx 0;
	}

	.money_view .money_left {
		width: 60%;
		flex: 1;
		font-size: 26rpx;
		color: #333;
		display: flex;
		align-items: center;
		border-right: 1rpx dashed #ddd;
	}

	.money_view .money_left>view {
		width: 50%;
	}

	.money_view .money_left>view .price {
		font-weight: 600;
		font-size: 30rpx;
	}

	.money_view .money_right {
		display: flex;
		width: 40%;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		color: #333;
	}

	.money_view .money_right>view {
		text-align: center;
		width: 50%;
	}

	.money_view .money_right image {
		width: 52rpx;
		height: 52rpx;
	}
</style>