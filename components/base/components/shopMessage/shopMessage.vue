<template>
	<view class="shopMessage"
		:style="'padding:'+paddingTop+'px 0 '+paddingBottom+'px'">
		<!-- 样式一 -->
		<view v-if="datas.content.style_type == 1" class="shop_type1"
			:style="'padding:0 '+datas.content.padding_horizontal+'px;'">
			<view class="flex-def flex-cCenter" :style="boxBgStyle">
				<image :src="avatarUrl" class="toux_img" mode="aspectFill" />
				<view class="right_view flex-one">
					<view class="user_name flex-def" style="align-items: flex-start;">
						<view class="flex-one" style="width: 80%;">
							<view class="user_name_text" style="font-size: 15px;width: 100%;">
								{{datas.content.title}}{{userInfo.name}}{{datas.content.title_fu}}
							</view>
							<view v-if="datas.content.shop_detail" class="shop_detail" style="font-size: 12px;width: 100%;">
								{{datas.content.shop_detail}}
							</view>
						</view>
						<view v-if="datas.content.phone_show==1 && userInfo.phone"
							style="line-height: 10px;text-align: center;" @click="callPhone">
							<image :src="phoneIconUrl" class="icon_phone_message"
								style="width:35px;height:35px;margin-top:-10px;margin-left:0;" />
							<view style="font-size: 11px;color: #333;">联系店主</view>
						</view>
					</view>
					<view class="evaluate_view flex-def flex-cCenter" style="font-size: 11px;">
						<view v-if="datas.content.evaluate_show==1" class="evaluate flex-cCenter flex-def flex-one"
							style="margin-right: 10px;">
							<image :src="evaluateIconUrl" class="evaluate_img" />
							<view>老店</view>
						</view>
						<view v-else class="evaluate flex-cCenter flex-def flex-one" style="margin-right: 10px;"></view>
						<view v-if="datas.content.sales_show==1" class="sales_view">月销500+</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 样式二 -->
		<view v-if="datas.content.style_type == 2" class="shop_type2" :style="outerBgStyle">
			<view class="flex-def flex-cCenter">
				<image :src="avatarUrl" class="toux_img" mode="aspectFill" />
				<view class="right_view flex-one">
					<view class="user_name flex-def flex-cCenter">
						<view class="flex-one" style="width: 80%;">
							<view class="user_name_text flex-one" style="font-size: 15px;width: 100%;">
								{{datas.content.title}}{{userInfo.name}}{{datas.content.title_fu}}
							</view>
							<view v-if="datas.content.shop_detail" class="shop_detail" style="font-size: 12px;width: 100%;">
								{{datas.content.shop_detail}}
							</view>
						</view>
						<view v-if="datas.content.phone_show==1 && userInfo.phone"
							style="line-height: 10px;text-align: center;" @click="callPhone">
							<image :src="phoneIconUrl" class="icon_phone_message"
								style="width:35px;height:35px;margin-top:-10px;margin-left:0;" />
							<view style="font-size: 11px;color: #333;">联系店主</view>
						</view>
					</view>
					<view class="evaluate_view flex-def flex-cCenter" style="font-size: 11px;">
						<view v-if="datas.content.evaluate_show==1" class="evaluate flex-cCenter flex-def flex-one"
							style="margin-right: 10px;">
							<image :src="evaluateIconUrl" class="evaluate_img" />
							<view>老店</view>
						</view>
						<view v-else class="evaluate flex-cCenter flex-def flex-one" style="margin-right: 10px;"></view>
						<view v-if="datas.content.sales_show==1" class="sales_view" style="font-size: 11px;">月销500+</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 样式三 -->
		<view v-if="datas.content.style_type == 3" class="shop_type3">
			<view class="shop_bg" :style="outerBgStyle"></view>
			<view class="shop_view">
				<image :src="avatarUrl" class="toux_img" mode="aspectFill" />
				<view class="user_name_text flex-one">
					{{datas.content.title}}{{userInfo.name}}{{datas.content.title_fu}}
				</view>
				<image v-if="datas.content.phone_show==1 && userInfo.phone" :src="phoneIconUrl"
					class="icon_phone_message" @click="callPhone" />
				<view v-if="datas.content.shop_detail" class="shop_detail">{{datas.content.shop_detail}}</view>
				<view v-if="datas.content.evaluate_show==1" class="evaluate_view flex-cCenter flex-def flex-zCenter">
					<image :src="evaluateIconUrl" class="evaluate_img" />
					<view>老店</view>
				</view>
				<view v-if="datas.content.sales_show==1" class="shop_detail">月销500+</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "shopMessage",
		props: {
			datas: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				userInfo: {
					name: '',
					phone: '',
					image: ''
				}
			};
		},
		computed: {
			paddingTop() {
				const c = this.datas.content || {};
				return c.padding_top !== undefined ? c.padding_top : (c.padding || 0);
			},
			paddingBottom() {
				const c = this.datas.content || {};
				return c.padding_bottom !== undefined ? c.padding_bottom : (c.padding || 0);
			},
			phoneIconUrl() {
				return this.vuex_apiUrl + '/wsy_pub/web/static/images/icon_phone_shopMessage.png';
			},
			evaluateIconUrl() {
				return this.vuex_apiUrl + '/wsy_pub/web/static/images/icon_pingjia.png';
			},
			avatarUrl() {
				const img = this.userInfo.image || (this.datas.content.userInfo && this.datas.content.userInfo.image);
				return this.fixImgUrl(img) || (this.vuex_apiUrl +
					'/HTML/admui/public/custom/images/person_head.png');
			},
			boxBgStyle() {
				const c = this.datas.content || {};
				const radius = c.radius_style == 2 ? c.radius_diy : 0;
				return this.buildBgStyle(c) + ';border-radius:' + radius + 'px;';
			},
			outerBgStyle() {
				return this.buildBgStyle(this.datas.content || {});
			}
		},
		watch: {
			'vuex_user.user_id': {
				handler(val) {
					if (val) {
						this.getInfo();
					}
				},
				immediate: true
			},
			'datas.content.userInfo': {
				handler(val) {
					if (val && val.name) {
						this.userInfo = Object.assign({}, val);
					}
				},
				deep: true,
				immediate: true
			}
		},
		mounted() {
			this.initUserInfo();
			uni.$on('onShow', this.getInfo);
		},
		beforeDestroy() {
			uni.$off('onShow', this.getInfo);
		},
		methods: {
			initUserInfo() {
				const defaultInfo = (this.datas.content && this.datas.content.userInfo) ? this.datas.content
					.userInfo : {};
				this.userInfo = Object.assign({
					name: 'XXX',
					phone: '',
					image: ''
				}, defaultInfo);
			},
			buildBgStyle(c) {
				if (!c) return 'background-color:transparent;background-image:none';
				if (c.select_bg_model == 1) {
					return 'background-color:' + c.bg_color + ';background-image:none';
				}
				if (c.select_bg_model == 2) {
					return 'background-color:transparent;background-image:linear-gradient(' + c.gradient_angle +
						',' + c.gradient_color1 + ',' + c.gradient_color2 + ')';
				}
				if (c.select_bg_model == 3) {
					return 'background-color:transparent;background-image:url(' + this.fixImgUrl(c.bg_img) + ')';
				}
				return 'background-color:transparent;background-image:none';
			},
			fixImgUrl(url) {
				if (!url) return '';
				if (/^(https?:)?\/\//.test(url)) return url;
				if (url.indexOf('/') === 0) return this.vuex_apiUrl + url;
				return this.vuex_apiUrl + '/' + url.replace(/^\.\.\//, '').replace(/^\.\//, '');
			},
			getInfo() {
				if (!this.vuex_user || !this.vuex_user.user_id) return;
				const that = this;
				const isManager = that.datas.content && that.datas.content.is_manager;
				that.$common.requestData({
					isShowLoading: false,
					url: '/wsy_user/web/index.php?m=user&a=get_component_store_info',
					data: {
						info_type: isManager == 2 ? 'store' : 'promoter'
					},
					method: 'POST',
					success(res) {
						if (res.errcode == 0 && res.data) {
							const data = Object.assign({}, res.data);
							if (data.image) {
								data.image = that.fixImgUrl(data.image);
							}
							that.userInfo = data;
						}
					}
				});
			},
			callPhone() {
				const phone = this.userInfo.phone;
				if (!phone) return;
				uni.makePhoneCall({
					phoneNumber: phone
				});
			}
		}
	}
</script>

<style>
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

	.shopMessage .shop_type1 {
		padding: 15px 0;
	}

	.shopMessage .shop_type1>view {
		padding: 20px 15px;
		background: #fff;
	}

	.shopMessage .user_name_text {
		font-size: 16px;
		color: #333;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.shopMessage .icon_phone_message {
		width: 25px;
		height: 25px;
		margin-left: 10px;
	}

	.shopMessage .toux_img {
		border: 1px solid #fff;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		margin-right: 10px;
		flex-shrink: 0;
	}

	.shopMessage .shop_detail {
		color: #999999;
		font-size: 13px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		width: 80%;
	}

	.shopMessage .evaluate_img {
		width: 74px;
		height: 14px;
		margin-right: 4px;
	}

	.shopMessage .evaluate_view {
		font-size: 13px;
		color: #666666;
		margin-top: 6px;
	}

	.shopMessage .shop_type2 {
		height: 112px;
		padding: 0 15px;
		padding-top: 35px;
		margin-bottom: 26px;
	}

	.shopMessage .shop_type2>view {
		background: #fff;
		border-radius: 16px;
		padding: 22px 15px;
	}

	.shopMessage .shop_type3 .shop_view {
		position: relative;
		text-align: center;
		padding: 35px 35px 20px 35px;
		background: #fff;
	}

	.shopMessage .shop_type3 .icon_phone_message {
		position: absolute;
		top: 15px;
		right: 15px;
		width: 25px;
		height: 25px;
		margin-left: 0;
	}

	.shopMessage .shop_type3 .shop_bg {
		height: 112px;
	}

	.shopMessage .shop_type3 .toux_img {
		position: absolute;
		top: -28px;
		left: 42%;
		z-index: 99;
		margin: 0;
	}

	.shopMessage .shop_type3 .shop_detail {
		width: 100%;
	}

	.shopMessage .right_view {
		width: 78%;
	}
</style>
