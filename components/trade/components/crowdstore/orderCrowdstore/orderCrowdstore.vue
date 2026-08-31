<template>
	<view :style="'padding:'+datas.content.padding+'px 0;'">
		<view class="custom-order">
			<view class="type1" v-if="datas.content.css_type==1">
				<view>我的订单</view>
				<view :border="false" class="my_asset">
					<a class="my_assets_content" v-for="(it,index) in datas.content.dataset[0].icon_list"
						href="javascript:void(0)" @click="jump(it.link)">
						<view class="my_asset_count">
							<img :src="it.icon" alt="" style="width: 100%;height: 100%;" />
						</view>
						<view class="my_asset_text">
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
		name: "orderCrowdstore",
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
		},
		methods: {
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
		border-radius: 15px;
		display: flex;
		justify-content: space-around;
		padding: 10px 0;

	}

	.my_asset_count {
		width: 23px;
		height: 23px;
		margin-left: 24px;
		line-height: 40px;
	}

	.my_assets_content {
		text-align: center;
		width: 25%;
		text-decoration: none;
		color: #000;
	}

	.my_asset_text {
		line-height: 30px;
		text-align: center;
	}
</style>
