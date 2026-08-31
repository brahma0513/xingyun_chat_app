<template>
	<view
		:style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding: '+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;'"
		style="background-size: cover;background-position: center center;overflow: hidden;">
		<view class="shop-brand-promotion" :style="'border-radius:'+datas.content.radius_diy+'px;'">
			<view v-if="datas.content.head_show" class="brand-promotion-head flex-def flex-cCenter flex-zBetween">
				<view class="head-left">{{datas.content.head_title}}</view>
				<view v-if="datas.content.view_more_show" class="head-right flex-def flex-cCenter" @click="shop_go_brand_list">
					<text class="text" :style="'color: '+datas.content.view_more_color+';'">查看更多</text>
					<view class="fa-angle-down" :style="'border-color: '+datas.content.view_more_arrow_color+';'"></view>
				</view>
			</view>
			<view class="brand-promotion-ul flex-def flex-cStart flex-wrap">
				<view
					v-for="(item, index) in datas.content.dataset"
					:key="index"
					class="brand-promotion-li flex-def flex-zTopBottom flex-cCenter"
					@click="shop_go_brand_pro(item.selector_id)">
					<view class="img-box">
						<image :src="item.pic" class="img" mode="aspectFill"></image>
					</view>
					<view class="title">{{item.select_value}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'shopBrandPromotion',
		props: {
			datas: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			shop_go_brand_list() {
				const url = '/shop/mshop/web/index.php?m=product_brand&a=brand_list&customer_id=' + this.vuex_customer_id;
				this.$common.diyLinkJump(url, 'h5', true);
			},
			shop_go_brand_pro(brand_id) {
				if (!brand_id) {
					return;
				}
				const url = '/shop/mshop/web/index.php?m=product&a=product_list&brand_id=' + brand_id + '&customer_id=' + this.vuex_customer_id;
				this.$common.diyLinkJump(url, 'h5', true);
			}
		}
	}
</script>

<style scoped>
	.shop-brand-promotion {
		padding: 15px 15px 4px;
		box-sizing: border-box;
		background-color: #fff;
		background-image: linear-gradient(to bottom, rgba(0, 123, 255, .08), rgba(255, 255, 255, 0.08), #fff);
	}
	.shop-brand-promotion .brand-promotion-head {
		line-height: 1;
		margin-bottom: 20px;
	}
	.shop-brand-promotion .brand-promotion-head .head-left {
		font-size: 15px;
		color: #333;
	}
	.shop-brand-promotion .brand-promotion-head .head-right {
		font-size: 12px;
	}
	.shop-brand-promotion .brand-promotion-head .head-right .fa-angle-down {
		width: 8px;
		height: 8px;
		margin-left: 3px;
		border-top: 2px solid #b2b2b2;
		border-right: 2px solid #b2b2b2;
		transform: rotate(45deg);
	}
	.shop-brand-promotion .brand-promotion-ul .brand-promotion-li {
		width: calc(20% - 13px);
		margin-right: 16px;
		margin-bottom: 15px;
	}
	.shop-brand-promotion .brand-promotion-ul .brand-promotion-li:nth-child(5n) {
		margin-right: 0;
	}
	.shop-brand-promotion .brand-promotion-ul .brand-promotion-li .img-box {
		width: 100%;
		padding-top: 100%;
		position: relative;
		border-radius: 5px;
		font-size: 0;
		overflow: hidden;
		margin-bottom: 12px;
	}
	.shop-brand-promotion .brand-promotion-ul .brand-promotion-li .img-box .img {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
	.shop-brand-promotion .brand-promotion-ul .brand-promotion-li .title {
		width: 100%;
		text-align: center;
		padding: 0 5px;
		box-sizing: border-box;
		font-size: 13px;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.flex-def {
		display: flex;
	}
	.flex-cCenter {
		align-items: center;
	}
	.flex-zBetween {
		justify-content: space-between;
	}
	.flex-cStart {
		align-items: flex-start;
	}
	.flex-wrap {
		flex-wrap: wrap;
	}
	.flex-zTopBottom {
		flex-direction: column;
	}
</style>
