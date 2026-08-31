<template>
	<view :style="'padding: ' + localData.content.padding_top + 'px 0 ' + localData.content.padding_bottom + 'px;'">

		<view class="index_swiper">

			<swiper :autoplay="true" :circular="true" :indicator-dots="false" class="swiper_div">
				<swiper-item v-for="(slide, index) in localData.content.dataset" :key="index">
					<image :src="slide.pic" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="index_pos">
			<view class="pos_top">
				<view class="pos_top_lf">
					<view class="pos_name">{{ localData.content.userInfo.user_name || '用户名称' }}</view>
					<view class="pos_id">{{ localData.content.userInfo.phone || '用户手机号' }}</view>
				</view>
				<view class="pos_top_ri" v-if="localData.content.userInfo.level.thumb">
					<img class="pos_member" :src="localData.content.userInfo.level.thumb" alt="会员图标" />
				</view>
			</view>

			<view class="pos_bot">
				<view class="pos_bot_lf">
					<img class="notice_img" src="/shared_store/web/static/images/xxgg_icon.png" alt="通知图标" />
					<view class="swiper">
						<view style="width: 100%; line-height: 22px; height: 22px;">
							<view class="pos_notice" style="height: 22px !important;">
								<view v-for="(notice, index) in localData.content.noticeList" :key="index"
									@click="go_urls(notice.id)">
									{{ notice.title }}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="pos_bot_ri" @click="go_url">
					<i class="icon fa-angle-right" style="rgb(153,153,153)"></i>
				</view>
			</view>
		</view>

	</view>

</template>
<script>
	export default {
		name: "sharedStoreIndexServe",

		data() {
			return {
				localData: {},
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				monetary_unit: getApp().globalData.monetary_unit,
			};
		},

		created() {
			this.localData = this.$attrs.data
			this.get_notice()
			this.get_my_user()

		},

		methods: {
			//获取信息列表
			get_notice() {
				const that = this;
				that.$common.requestData({
					url: '/shared_store/web/index.php?m=notice&a=notice_list',
					data: {
						type: 0,
					},
					method: 'POST',
					needToken: true,
				}).then(res => {
					if (res.errcode === 0) {

						that.localData.content.noticeList = res.data.list;
					}
				})
			},

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

						that.localData.content.userInfo = res.data;
					}
				})
			},

			//跳转
			go_urls(id) {
				var that = this;
				that.$common.diyLinkJump('/shared_store/web/index.php?m=view&a=noticeDetail&id=' + id, "h5", true)
			}
		},
	}
</script>

<style>
	.ind_box {
		position: relative;
		margin-bottom: 80px;
		background: #f8f8f8;
	}

	.index_swiper {}

	.index_swiper .swiper_div {
		width: 100%;
		height: 350px;
	}

	.index_swiper .swiper_div img {
		width: 100%;
		height: 100%;
	}


	.swiper-slide {
		-webkit-flex-shrink: 0;
		-ms-flex: 0 0 auto;
		-ms-flex-negative: 0;
		flex-shrink: 0;
		width: 100%;
		height: 100%;
		position: relative;
	}

	/* 导航点 */
	.dots {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 74px;
		display: flex;
		justify-content: center;
		height: 10px;
	}

	.dots .dot {
		margin: 0 3px;
		width: 4.5px;
		height: 4.5px;
		background: #E2E1DD;
		border-radius: 50%;
	}

	.dots .dot.active {
		width: 12px;
		height: 4.5px;
		background: #2880FE;
		border-radius: 7.5px;
	}


	.index_pos {
		width: 95%;
		height: 128px;
		border-radius: 8px;
		background-color: #fff;
		box-sizing: border-box;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 50rpx;
		display: flex;
		flex-direction: column;
		z-index: 99;
	}

	.index_pos .pos_top {
		width: 100%;
		height: 88px;
		display: flex;
		justify-content: space-between;
		padding: 14px 18px;
		box-sizing: border-box;
	}

	.index_pos .pos_top .pos_top_lf {
		display: flex;
		flex-direction: column;
	}

	.index_pos .pos_top .pos_top_lf .pos_name {
		font-size: 18px;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #333333;
		line-height: 25px;
		margin-bottom: 5px;
	}

	.index_pos .pos_top .pos_top_lf .pos_id {
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 17px
	}

	.index_pos .pos_top .pos_top_ri {
		margin-top: 14rpx;
	}

	.index_pos .pos_top .pos_top_ri .pos_menber {
		width: 62px;
		height: 23px;
		font-size: 14px;
		font-family: AlimamaShuHeiTi-Bold, AlimamaShuHeiTi;
		font-weight: bold;
		color: #FFFFFF;
		line-height: 14px;
	}

	.index_pos .pos_bot {
		width: 325px;
		flex: 1;
		margin: 0 auto;
		border-top: 0.5px solid #eee;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.index_pos .pos_bot .pos_bot_lf {
		width: 92%;
		display: flex;
		align-items: center;
	}

	.index_pos .pos_bot .pos_bot_lf .notice_img {
		width: 52px;
		height: 20px;
		margin-right: 10px;
	}

	.index_pos .pos_bot .pos_bot_lf .pos_notice {
		flex: 1;
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 22px;
	}

	.pos_bot_lf .swiper {
		height: 22px;
		width: 80%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 22px;
	}

	.index_pos .pos_bot .pos_bot_ri {}

	.index_pos .pos_bot .pos_bot_ri .ri_arrow {
		width: 13px;
		height: 13px;
	}

	.ind_main {
		width: 375px;
		padding: 0 10px 10px;
		box-sizing: border-box;
	}
</style>