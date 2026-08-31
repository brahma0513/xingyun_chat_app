<template>
	<view
		:style="'background-repeat: round;box-sizing: border-box;background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding:'+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;'">
		<view class="custom-hotspot-img-box" :style="'border-radius: '+datas.content.radius_diy+'px;'">
			<image :src="datas.content.hotspot_img || '../../HTML/admui/public/custom/images/advert1.png'" mode="widthFix" class="custom-hotspot-image"></image>
			<view v-for="(item,index) in datas.content.dataset" :key="index" class="custom-hotspot-item"
				:style="'left: '+(item.x/(750/phonewidth))+'px;top: '+(item.y/(750/phonewidth))+'px;width: '+(item.width/(750/phonewidth))+'px;height: '+(item.height/(750/phonewidth))+'px;z-index: '+(index+1)+';'">
				<button v-if="item.open_type=='contact'&&item.sel_link_type!=2&&item.link=='qy_weixin'"
					class="img-box" @click="go_service" hover-class="no-hover"></button>
				<button v-else-if="item.open_type=='contact'&&item.sel_link_type!=2" hover-class="no-hover"
					class="img-box" open-type="contact"></button>
				<view v-else class="img-box" hover-class="no-hover" @click="handleLink(item)"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "hotspot",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				phonewidth: 375,
				service_url: "",
				service_id: ""
			};
		},
		created() {
			const sysInfo = uni.getSystemInfoSync();
			this.phonewidth = sysInfo.screenWidth || 375;
			const dataset = this.datas.content.dataset || [];
			dataset.forEach((item) => {
				if (item.open_type == "contact" && item.link == "qy_weixin") {
					this.get_link();
				}
			});
		},
		methods: {
			handleLink(item) {
				if (item.sel_link_type == 2) {
					this.open_mr(item.diy_openid);
				} else if (item.sel_link_type == 3) {
					this.linkTo(item.video_id, item.video_feed_id);
				} else {
					this.$common.diyLinkJump(item.link);
				}
			},
			open_mr(appid) {
				// #ifdef MP-WEIXIN
				uni.navigateToMiniProgram({
					appId: appid,
					path: ''
				});
				// #endif
			},
			linkTo(video_id, video_feed_id) {
				// #ifdef MP-WEIXIN
				wx.openChannelsActivity({
					finderUserName: video_id,
					feedId: video_feed_id
				});
				// #endif
			},
			get_link() {
				const that = this;
				that.$common.requestData({
					isShowLoading: false,
					url: '/wsy_pub/web/index.php?m=mini_program&a=get_service_page',
					data: {
						type: "qy_weixin"
					},
					method: 'POST',
					success(res) {
						if (res.errcode == 0) {
							that.service_url = decodeURIComponent(res.url);
							that.service_id = res.corpid;
						}
					}
				});
			},
			go_service() {
				// #ifdef MP-WEIXIN
				wx.openCustomerServiceChat({
					extInfo: {
						url: this.service_url
					},
					corpId: this.service_id
				});
				// #endif
			}
		}
	}
</script>

<style>
	.custom-hotspot-img-box {
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.custom-hotspot-img-box .custom-hotspot-image {
		display: block;
		width: 100%;
	}

	.custom-hotspot-img-box .custom-hotspot-item {
		position: absolute;
	}

	.custom-hotspot-img-box .custom-hotspot-item .img-box {
		display: block;
		width: 100%;
		height: 100%;
		font-size: 0;
	}

	.no-hover {
		background-color: transparent;
	}

	.custom-hotspot-img-box .custom-hotspot-item button {
		background: transparent;
		padding-left: 0;
		padding-right: 0;
		margin-left: 0;
		margin-right: 0;
		box-sizing: content-box;
		width: 100%;
		height: 100%;
	}

	.custom-hotspot-img-box .custom-hotspot-item button::after,
	.custom-hotspot-img-box .custom-hotspot-item button::before {
		display: none;
	}
</style>
