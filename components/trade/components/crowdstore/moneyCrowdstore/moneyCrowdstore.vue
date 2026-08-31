<template>
	<view :style="'padding:'+datas.content.padding+'px 0;'">
		<view class="custom-order">
			<!--<p>{{item}}</p>-->
			<view class="type1" v-if="datas.content.css_type==1">
				<view>我的资产</view>
				<view :border="false" class="my_asset">
					<a class="my_assets_content" v-for="(it,index) in icon_list"
						href="javascript:void(0)" @click="jump(it.link)">
						<view class="my_asset_count">{{it.sum}}</view>
						<view class="my_asset_text" style='font-weight: 500;'>
							{{it.name}}
						</view>
					</a>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "moneyCrowdstore",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				icon_list: []
			};
		},
		created() {
			var _this = this;
			_this.icon_list = _this.datas.content.dataset[0].icon_list
			_this.crowdstore_getdata()
		},
		methods: {
			crowdstore_getdata: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id
				};
				_this.$common.requestData({
					url: '/crowdstore/web/index.php?m=user&a=get_user_money',
					data: params,
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						if (res.errcode == 0) {
							console.log('众筹',_this.icon_list)
							_this.icon_list[0].sum = Math.round(res.data.currency);
							_this.icon_list[1].sum = Math.round(res.data.pocket_money);
							_this.icon_list[2].sum = Math.round(res.data.user_medal);
							_this.icon_list[3].sum = Math.round(res.data.integral);
							console.log('list',_this.icon_list)
						}
					}
				})
			},
			jump(src) {
				this.$common.diyLinkJump(src);
			},
		}
	}
</script>

<style>
	.custom-order .type1 {
	    background-color: #FFF;
	    border-radius: 8px;
	    padding: 0 15px;
	}
	.my_asset {
		background-color: #fff;
		border-radius: 30px;
		width: 100%;
		display: flex;
		justify-content: space-around;
		padding: 10px 0;
	}

	.my_assets_content {
		text-align: center;
		width: 25%;
		text-decoration: none;
		color: #000;
	}

	.my_asset_count {
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #D70000;
	}

	</style
</style>
