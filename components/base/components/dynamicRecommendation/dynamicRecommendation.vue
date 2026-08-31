<template>
	<view
		:style="'background-repeat: round;padding:'+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';'"
		class="custom-nav">
		<view class="custom-dynamic flex-def flex-stretch">
			<view class="custom-dynamic-box" :class="datas.content.select_style==1 ? 'flex-two':'flex-one'"
				:style="boxStyleOne">
				<view class="custom-dynamic-title flex-def flex-cCenter">
					<view class="custom-dynamic-title-left" :style="'color:'+datas.content.font_color_one+';'">
						{{datas.content.title_one}}
					</view>
					<view class="custom-dynamic-title-right"
						:style="'color:'+datas.content.label_font_color_one+';background-color:'+datas.content.label_bg_one+';'">
						{{datas.content.label_one}}
					</view>
				</view>
				<view class="custom-dynamic-subtitle-title"
					:style="'color:'+datas.content.subtitle_font_color_one+';'">{{datas.content.subtitle_title_one}}
				</view>
				<view class="custom-dynamic-swiper">
					<swiper v-if="dataset_img1.length" :indicator-dots="false" :autoplay="true" :interval="3000"
						:duration="1000" style="height: 96px;">
						<swiper-item v-for="(ban,ban_index) in dataset_img1" :key="'d1-'+ban_index"
							class="custom-dynamic-swiper-wrapper">
							<view>
								<view class="custom-dynamic-swiper-slide flex-def flex-cCenter">
									<view v-if="ban[0] && ban[0].pic" :class="ban.length > 1?'flex-one':'img-50'"
										hover-class="no-hover" @click="handleLink(ban[0])">
										<image class="img" :src="ban[0].pic" mode="aspectFill"></image>
									</view>
									<view v-if="ban.length > 1 && ban[1] && ban[1].pic" class="flex-one"
										hover-class="no-hover" @click="handleLink(ban[1])">
										<image class="img" :src="ban[1].pic" mode="aspectFill"></image>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="custom-dynamic-box flex-one margin-left-10" :style="boxStyleTwo">
				<view class="custom-dynamic-title flex-def flex-cCenter"
					:class="{'flex-zCenter':datas.content.select_style == 1}">
					<view class="custom-dynamic-title-left" :style="'color:'+datas.content.font_color_two+';'">
						{{datas.content.title_two}}
					</view>
					<view v-if="datas.content.select_style==2" class="custom-dynamic-title-right"
						:style="'color:'+datas.content.label_font_color_two+';background-color: '+datas.content.label_bg_two+';'">
						{{datas.content.label_two}}
					</view>
				</view>
				<view class="custom-dynamic-subtitle-title"
					:class="{'text-center':datas.content.select_style == 1}"
					:style="'color:'+datas.content.subtitle_font_color_two+';'">{{datas.content.subtitle_title_two}}
				</view>
				<view class="custom-dynamic-swiper">
					<swiper v-if="datas.content.select_style==1 && datasetTwoList.length" :indicator-dots="false"
						:autoplay="true" :interval="3000" :duration="1000"
						style="height: 96px;margin:0 1.75px;">
						<swiper-item v-for="(ban,ban_index) in datasetTwoList" :key="'d2-'+ban_index"
							class="custom-dynamic-swiper-wrapper">
							<view>
								<view class="custom-dynamic-swiper-slide" hover-class="no-hover" @click="handleLink(ban)">
									<image v-if="ban.pic" class="img" :src="ban.pic" mode="aspectFill"></image>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<swiper v-else-if="dataset_img2.length" :indicator-dots="false" :autoplay="true" :interval="3000"
						:duration="1000" style="height: 96px;">
						<swiper-item v-for="(ban,ban_index) in dataset_img2" :key="'d2g-'+ban_index"
							class="custom-dynamic-swiper-wrapper">
							<view>
								<view class="custom-dynamic-swiper-slide flex-def flex-cCenter">
									<view v-if="ban[0] && ban[0].pic" :class="ban.length > 1?'flex-one':'img-50'"
										hover-class="no-hover" @click="handleLink(ban[0])">
										<image class="img" :src="ban[0].pic" mode="aspectFill"></image>
									</view>
									<view v-if="ban.length > 1 && ban[1] && ban[1].pic" class="flex-one"
										hover-class="no-hover" @click="handleLink(ban[1])">
										<image class="img" :src="ban[1].pic" mode="aspectFill"></image>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view v-if="datas.content.select_style==1" class="custom-dynamic-box flex-one margin-left-10"
				:style="boxStyleThree">
				<view class="custom-dynamic-title flex-def flex-cCenter flex-zCenter">
					<view class="custom-dynamic-title-left" :style="'color:'+datas.content.font_color_three+';'">
						{{datas.content.title_three}}
					</view>
				</view>
				<view class="custom-dynamic-subtitle-title text-center"
					:style="'color:'+datas.content.subtitle_font_color_three+';'">{{datas.content.subtitle_title_three}}
				</view>
				<swiper v-if="datasetThreeList.length" :indicator-dots="false" :autoplay="true" :interval="3000"
					:duration="1000" style="height: 96px;margin:0 1.75px;">
					<swiper-item v-for="(ban,ban_index) in datasetThreeList" :key="'d3-'+ban_index"
						class="custom-dynamic-swiper-wrapper">
						<view>
							<view class="custom-dynamic-swiper-slide" hover-class="no-hover" @click="handleLink(ban)">
								<image v-if="ban.pic" class="img" :src="ban.pic" mode="aspectFill"></image>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "dynamicRecommendation",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				dataset_img1: [],
				dataset_img2: []
			};
		},
		computed: {
			datasetTwoList() {
				return (this.datas.content && this.datas.content.dataset_two) ? this.datas.content.dataset_two : [];
			},
			datasetThreeList() {
				return (this.datas.content && this.datas.content.dataset_three) ? this.datas.content.dataset_three : [];
			},
			boxStyleOne() {
				const c = this.datas.content;
				return 'background-repeat: round;background-color: ' + (c.select_bg_model_one == 1 ? c.bg_color_one :
					'transparent') + ';background-image: ' + (c.select_bg_model_one == 2 ? 'linear-gradient(' + c
					.gradient_angle_one + ',' + c.gradient_color1_one + ',' + c.gradient_color2_one + ')' : c
					.select_bg_model_one == 3 ? 'url(' + c.bg_img_one + ')' : 'none') + ';border-radius: ' + (c
					.radius_method == 2 ? c.radius_diy : 0) + 'px;';
			},
			boxStyleTwo() {
				const c = this.datas.content;
				return 'background-repeat: round;background-color: ' + (c.select_bg_model_two == 1 ? c.bg_color_two :
					'transparent') + ';background-image: ' + (c.select_bg_model_two == 2 ? 'linear-gradient(' + c
					.gradient_angle_two + ',' + c.gradient_color1_two + ',' + c.gradient_color2_two + ')' : c
					.select_bg_model_two == 3 ? 'url(' + c.bg_img_two + ')' : 'none') + ';border-radius: ' + (c
					.radius_method == 2 ? c.radius_diy : 0) + 'px;';
			},
			boxStyleThree() {
				const c = this.datas.content;
				return 'background-repeat: round;background-color: ' + (c.select_bg_model_three == 1 ? c.bg_color_three :
					'transparent') + ';background-image: ' + (c.select_bg_model_three == 2 ? 'linear-gradient(' + c
					.gradient_angle_three + ',' + c.gradient_color1_three + ',' + c.gradient_color2_three + ')' : c
					.select_bg_model_three == 3 ? 'url(' + c.bg_img_three + ')' : 'none') + ';border-radius: ' + (c
					.radius_method == 2 ? c.radius_diy : 0) + 'px;';
			}
		},
		watch: {
			datas: {
				handler() {
					this.refreshImageGroups();
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			refreshImageGroups() {
				this.groupImages1();
				if (this.datas.content && this.datas.content.select_style == 2) {
					this.groupImages2();
				} else {
					this.dataset_img2 = [];
				}
			},
			groupImages1() {
				const images = (this.datas.content && this.datas.content.dataset) ? this.datas.content.dataset : [];
				const grouped = [];
				for (let i = 0; i < images.length; i += 2) {
					grouped.push(images.slice(i, i + 2));
				}
				this.dataset_img1 = grouped;
			},
			groupImages2() {
				const images = (this.datas.content && this.datas.content.dataset_two) ? this.datas.content.dataset_two : [];
				const grouped = [];
				for (let i = 0; i < images.length; i += 2) {
					grouped.push(images.slice(i, i + 2));
				}
				this.dataset_img2 = grouped;
			},
			handleLink(item) {
				if (!item) return;
				if (item.sel_link_type == 2) {
					// #ifdef MP-WEIXIN
					uni.navigateToMiniProgram({
						appId: item.diy_openid,
						path: ''
					});
					// #endif
				} else if (item.sel_link_type == 0) {
					this.$common.diyLinkJump(item.diy_link);
				} else if (item.sel_link_type == 3) {
					// #ifdef MP-WEIXIN
					wx.openChannelsActivity({
						finderUserName: item.video_id,
						feedId: item.video_feed_id
					});
					// #endif
				} else {
					this.$common.diyLinkJump(item.link);
				}
			}
		}
	}
</script>

<style>
	.flex-two {
		flex: 2;
	}

	.margin-left-10 {
		margin-left: 10px !important;
	}

	.custom-dynamic .custom-dynamic-box {
		padding: 14px 10px 12px;
		box-sizing: border-box;
	}

	.custom-dynamic .custom-dynamic-title {
		margin-bottom: 8px;
	}

	.custom-dynamic .custom-dynamic-title-left {
		font-size: 16px;
		line-height: 1;
	}

	.custom-dynamic .custom-dynamic-title-right {
		margin-left: 8px;
		font-size: 11px;
		padding: 2.5px 6px;
		line-height: 1;
		border-radius: 10.5px;
		box-sizing: border-box;
	}

	.custom-dynamic .custom-dynamic-subtitle-title {
		font-size: 12px;
		line-height: 1;
		margin-bottom: 12px;
	}

	.custom-dynamic-swiper-wrapper .custom-dynamic-swiper-slide {
		height: 96px;
	}

	.custom-dynamic-swiper-wrapper .custom-dynamic-swiper-slide .img-box,
	.custom-dynamic-swiper-wrapper .custom-dynamic-swiper-slide view {
		width: 100%;
		height: 100%;
	}

	.custom-dynamic-swiper-wrapper .custom-dynamic-swiper-slide .img-50 {
		width: calc(50% - 3.5px);
		height: 100%;
	}

	.custom-dynamic-swiper-wrapper .custom-dynamic-swiper-slide .flex-one {
		height: 100%;
	}

	.custom-dynamic-swiper-wrapper .custom-dynamic-swiper-slide .img {
		width: 100%;
		height: 100%;
		display: block;
	}

	.custom-dynamic-swiper-wrapper .custom-dynamic-swiper-slide view:nth-child(2) {
		margin-left: 7px;
	}

	.text-center {
		text-align: center;
	}

	.flex-def {
		display: flex;
	}

	.flex-one {
		flex: 1;
	}

	.flex-cCenter {
		align-items: center;
	}

	.flex-zCenter {
		justify-content: center;
	}

	.flex-stretch {
		align-items: stretch;
	}
</style>
