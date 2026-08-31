<template>
	<view v-if="datas && datas.content"
		:style="'padding: '+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';border-radius: '+(datas.content.radius_method==2?datas.content.radius_diy:0)+'px;'">
		<view class="custom-horse">
			<view class="custom-horse-title" :style="'color:'+datas.content.font_color+';'">
				{{datas.content.title}}
			</view>
			<swiper v-if="horseList.length" class="custom-horse-ul" :display-multiple-items="horseDisplayCount"
				:circular="horseCircular" :autoplay="horseAutoplay" :interval="3000" :duration="500"
				@change="onChange">
				<swiper-item v-for="(it,it_index) in horseList" :key="'horse-'+it_index">
					<view class="custom-horse-li" :class="{'active':current==it_index}">
						<view class="img-box" hover-class="no-hover" @click="handleLink(it)">
							<image class="img" :src="it.pic" mode="aspectFill"></image>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<swiper v-if="datas.content.select_style==2 && horseList2.length" class="custom-horse-ul margin-top-15"
				:display-multiple-items="horseDisplayCount2" :circular="horseCircular2" :autoplay="horseAutoplay"
				:interval="3000" :duration="500" @change="onChanges">
				<swiper-item v-for="(it,it_index) in horseList2" :key="'horse2-'+it_index">
					<view class="custom-horse-li" :class="{'active':currents==it_index}">
						<view class="img-box" hover-class="no-hover" @click="handleLink(it)">
							<image class="img" :src="it.pic" mode="aspectFill"></image>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		name: "newHorse",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				current: 2,
				currents: 2
			};
		},
		computed: {
			horseList() {
				return (this.datas.content && this.datas.content.dataset) ? this.datas.content.dataset : [];
			},
			horseList2() {
				return (this.datas.content && this.datas.content.datasets) ? this.datas.content.datasets : [];
			},
			horseAutoplay() {
				const mode = this.datas.content && this.datas.content.roll_mode;
				return mode == 1 || mode === '1';
			},
			horseDisplayCount() {
				return this.getDisplayCount(this.horseList.length);
			},
			horseDisplayCount2() {
				return this.getDisplayCount(this.horseList2.length);
			},
			horseCircular() {
				return this.horseList.length > 1;
			},
			horseCircular2() {
				return this.horseList2.length > 1;
			}
		},
		watch: {
			horseList: {
				handler(list) {
					this.current = this.getInitialActiveIndex(list.length, this.horseDisplayCount);
				},
				immediate: true
			},
			horseList2: {
				handler(list) {
					this.currents = this.getInitialActiveIndex(list.length, this.horseDisplayCount2);
				},
				immediate: true
			}
		},
		methods: {
			getDisplayCount(len) {
				if (len <= 1) return 1;
				if (len <= 5) return Math.min(3, len);
				return 5;
			},
			getInitialActiveIndex(len, displayCount) {
				if (!len) return 0;
				return Math.min(Math.floor(displayCount / 2), len - 1);
			},
			syncActiveIndex(detailCurrent, len, displayCount) {
				if (!len) return 0;
				if (displayCount >= 5 && len >= 5) {
					if (detailCurrent === len - 2) return 0;
					if (detailCurrent === len - 1) return 1;
					return detailCurrent + 2;
				}
				const offset = Math.floor(displayCount / 2);
				return (detailCurrent + offset) % len;
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
			},
			onChange(e) {
				this.current = this.syncActiveIndex(
					e.detail.current,
					this.horseList.length,
					this.horseDisplayCount
				);
			},
			onChanges(e) {
				this.currents = this.syncActiveIndex(
					e.detail.current,
					this.horseList2.length,
					this.horseDisplayCount2
				);
			}
		}
	}
</script>

<style>
	.custom-horse {
		padding: 15px 0;
	}

	.custom-horse .custom-horse-title {
		text-align: center;
		line-height: 1;
		font-size: 20px;
		font-weight: 600;
		box-sizing: border-box;
		margin-bottom: 24px;
	}

	.custom-horse .custom-horse-ul {
		height: 104px;
	}

	.custom-horse .custom-horse-li {
		padding: 10px 3px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 100%;
	}

	.custom-horse .custom-horse-li.active {
		padding: 0 3px;
	}

	.custom-horse .custom-horse-li .img-box {
		width: 100%;
		height: 83px;
	}

	.custom-horse .custom-horse-li.active .img-box {
		height: 100%;
		transition: height 0.3s;
	}

	.custom-horse .custom-horse-li .img {
		width: 100%;
		height: 100%;
		display: block;
	}

	.margin-top-15 {
		margin-top: 15px;
	}
</style>
