<template>
	<view v-if="localData.type=='productlist80011'" :style="{
		paddingTop:localData.content.padding_top+'px',
		paddingBottom:localData.content.padding_bottom+'px',
		backgroundColor:localData.content.backgroundColor,
		backgroundImage:'url('+localData.content.backgroundImage+')'
	}">
		<view class="product-content">
			<view class="procut-list">
				<view class="product-item" v-for="(item,index) in shared_store_goods_list" :key="index"
					@click="$common.diyLinkJump('/shared_store/web/index.php?m=view&a=goodsDetails&id='+item.product_id)">
					<view class="image">
						<img :src="item.product_img" alt="	">
					</view>
					<view class="product-info">
						<view class="title">{{item.product_name}}</view>
						<view class="desc">{{item.intro}}</view>
						<view class="store_spec">
							<view class="price">
								<view class="left">{{item.now_price}}</view>
								<view class="right">{{item.orgin_price}}</view>
							</view>
							<view class="desc">库存:{{item.storenum}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 加载状态 -->
			<div v-if="shared_store_loading" class="loading">加载中...</div>
			<!-- 完成状态 -->
			<div v-if="shared_store_finished" class="finished-text">没有更多了</div>
		</view>
	</view>
</template>

<script>
	export default {
		name: "serviceProduct",

		data() {
			return {
				localData: {},
				shared_store_goods_list: [],
				shared_store_goods_query: {
					page: 1,
					page_size: 20,
					name: '',
					type_id: -1,
				},
				shared_store_loading: false,
				shared_store_finished: false,
				service_product_type: [],
				tabIndex: 0,
				shared_store_goods_lists: [],
				shared_store_goods_querys: {
					page: 1,
					page_size: 20,
					name: '',
					type_id: -1,
					order: "",
				},
				is_check: false,
				shared_store_loadings: false,
				shared_store_finisheds: false,
				tabIndex2: 0,
				shared_store_lists: [],
				shared_store_list_querys: {
					page: 1,
					page_size: 20,
					name: '',
					type_id: "",
					distance: 1,
					latitude: "",
					longitude: ""
				},
				shared_store_loadinges: false,
				shared_store_finishedes: false,
			}
		},

		created() {
			this.localData = this.$attrs.data
			this.shared_store_get_product_list()
		},


		methods: {
			// 获取平台产品列表
			shared_store_get_product_list: function() {
				this.shared_store_loading = true;
				this.$common.requestData({
					method: "POST",
					url: '/shared_store/web/index.php?m=product&a=get_service_product_list',
					data: this.shared_store_goods_query,
					needToken: true,
				}).then(res => {
					if (res.errcode === 0) {
						res.data.list.forEach(item => {
							this.shared_store_goods_list.push(item)
						})
						if (res.data.list.length === 0) {
							this.shared_store_finished = true;
						}
						this.shared_store_loading = false;
						this.shared_store_goods_query.page++
					}
				})
			},
			// 获取服务商品列表
			shared_store_get_product_lists: function() {
				this.shared_store_loadings = true;
				this.$common.requestData({
					method: "POST",
					url: '/shared_store/web/index.php?m=product&a=get_service_product_list',
					data: this.shared_store_goods_querys,
					needToken: true,
				}).then(res => {
					if (res.errcode === 0) {
						res.data.list.forEach(item => {
							this.shared_store_goods_lists.push(item)
						})
						if (res.data.list.length === 0) {
							this.shared_store_finisheds = true;
						}
						this.shared_store_loadings = false;
						this.shared_store_goods_querys.page++
					}
				})
			},

		},

	}
</script>

<style>
	.product-content {
		background-color: #f7f7f7;
		width: 100%;
	}

	.procut-list {
		/* background-color: transparent; */
		background-color: #fff;
		padding: 10px 15px;
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		box-sizing: border-box;

	}

	.product-item {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 10px;
		border-radius: 10px;
		margin-bottom: 10px;
	}

	.image {
		margin-right: 10px;
	}

	.image img {
		width: 120px;
		border-radius: 10px;
	}

	.product-info {
		width: 100%;
	}

	.product-info .title {
		width: 100%;
		font-weight: 600;
		font-size: 15px;
		color: #333;
		/* line-height: 1.3;
	    min-height: 36px; */
		display: flex;
		align-items: center;
		overflow: hidden;
		word-break: break-all;
	}

	.product-info .desc {
		padding-top: 5px;
		font-size: 13px;
		color: #999;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.store_spec {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.product-info .price {
		display: flex;
		align-items: baseline;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.product-info .price .left {
		font-weight: 600;
		font-size: 19px;
		color: #333;
	}

	.product-info .price .right {
		font-family: PingFangSC, PingFang SC;
		font-weight: 500;
		font-size: 13px;
		color: #4d4d4d;
		line-height: 16px;
		text-decoration: line-through;
	}
	
	.loading, .finished-text {
	  text-align: center;
	  margin: 10px 0;
	}
</style>