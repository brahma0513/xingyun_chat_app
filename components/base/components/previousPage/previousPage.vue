<template>
	<view class="line_wrap" :style="'padding: '+datas.content.padding_top+'px 0px '+datas.content.padding_bottom+'px'">
		<view @click="previousPageFun" class="custom-cut"
			:style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';border-radius:'+datas.content.radius_diy+'px;overflow:hidden;'">
			<image v-if="datas.content.select_bg_model == 2 && datas.content.bg_img" :src="datas.content.bg_img"
				mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "previousPage",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		methods: {
			previousPageFun() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.line_wrap .custom-cut {
		display: block;
		width: 100%;
		height: 100%;
		font-size: 0;
		min-height: 10px;
	}

	.line_wrap .custom-cut image {
		width: 100%;
	}
</style>
