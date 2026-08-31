<template>
	<view v-if="datas && datas.content" :style="'padding: '+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;'"
		class="custom-nav">
		<view class="custom-hot"
			:style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';border-radius: '+(datas.content.radius_method==2?datas.content.radius_diy:0)+'px;'">
			<view class="custom-hot-title flex-def flex-cCenter flex-zBetween">
				<view class="custom-hot-title-left" :style="'color:'+datas.content.font_color+';'">
					{{datas.content.title}}
				</view>
				<view class="custom-hot-title-right" @click="handleHeaderLink">
					<view class="flex-def flex-cCenter">
						<text :style="'color: '+datas.content.subtitle_font_color+';'">{{datas.content.subtitle_title}}</text>
						<view class="custom-hot-title-icon"
							:style="'border-color: '+datas.content.subtitle_font_color+';'"></view>
					</view>
				</view>
			</view>
			<scroll-view class="custom-hot-list" scroll-x="true" enable-flex="true">
				<view v-for="(it,it_index) in datas.content.dataset" :key="it_index" class="custom-hot-list-li">
					<view class="img-box" hover-class="no-hover" @click="handleLink(it)">
						<image class="img" :src="it.pic" mode="aspectFill"></image>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "newHot",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		methods: {
			handleHeaderLink() {
				const c = this.datas.content;
				if (c.sel_link_type == 2) {
					// #ifdef MP-WEIXIN
					uni.navigateToMiniProgram({
						appId: c.diy_openid,
						path: ''
					});
					// #endif
				} else if (c.sel_link_type == 0) {
					this.$common.diyLinkJump(c.diy_link);
				} else {
					this.$common.diyLinkJump(c.link);
				}
			},
			handleLink(it) {
				if (it.sel_link_type == 2) {
					// #ifdef MP-WEIXIN
					uni.navigateToMiniProgram({
						appId: it.diy_openid,
						path: ''
					});
					// #endif
				} else if (it.sel_link_type == 0) {
					this.$common.diyLinkJump(it.diy_link);
				} else {
					this.$common.diyLinkJump(it.link);
				}
			}
		}
	}
</script>

<style>
	.custom-nav {
		overflow: hidden;
	}

	.custom-hot {
		background-repeat: round;
		position: relative;
		padding: 15px 0 15px 12px;
		box-sizing: border-box;
	}

	.custom-hot .custom-hot-title {
		line-height: 1;
		margin-bottom: 16px;
		padding-right: 12px;
	}

	.custom-hot .custom-hot-title-left {
		font-size: 18px;
		font-weight: 600;
	}

	.custom-hot .custom-hot-title-right {
		font-size: 13px;
		padding-right: 10px;
		box-sizing: border-box;
		position: relative;
	}

	.custom-hot .custom-hot-title-icon {
		margin-left: 5px;
		width: 8px;
		height: 8px;
		border-top: 2px solid #b2b2b2;
		border-right: 2px solid #b2b2b2;
		transform: rotate(45deg);
	}

	.custom-hot .custom-hot-list {
		width: 100%;
		white-space: nowrap;
		height: 96px;
	}

	.custom-hot .custom-hot-list .custom-hot-list-li {
		width: 74px;
		height: 96px;
		margin-right: 8px;
		display: inline-block;
		flex-shrink: 0;
		position: relative;
		vertical-align: top;
	}

	.custom-hot .custom-hot-list .custom-hot-list-li .img-box {
		display: block;
		width: 100%;
		height: 100%;
		font-size: 0;
	}

	.custom-hot .custom-hot-list .custom-hot-list-li .img-box .img {
		width: 100%;
		height: 100%;
		display: block;
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
</style>
