<template>
<view :style="'background-color:'+ (datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image:'+ (datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';padding:'+(datas.content.padding_top+'px '+(datas.content.display_method==2?datas.content.padding_horizontal:0)+'px '+datas.content.padding_bottom+'px ')+';border-radius:'+(datas.content.display_method==1?datas.content.radius_diy:0)+'px;background-size:cover;'">
    <view :style="'background-color:'+ (datas.content.display_method==2&&datas.content.card_select_bg_model==1?datas.content.card_bg_color:'transparent')+';background-image: '+(datas.content.display_method==2&&datas.content.card_select_bg_model==2?'linear-gradient('+datas.content.card_gradient_angle+','+datas.content.card_gradient_color1+','+datas.content.card_gradient_color2+')':datas.content.display_method==2&&datas.content.card_select_bg_model==3?'url('+datas.content.card_bg_img+')':'none')+';font-size:'+ (datas.content.font_size)+'px;text-align:'+(datas.content.text_align==1?'left':datas.content.text_align==2?'center':'right')+';color:'+ (datas.content.font_color)+';border-radius: '+(datas.content.display_method==2?datas.content.radius_diy2:0)+'px;padding: 12px;word-break: break-all;background-size:cover;'">{{datas.content.textarea}}</view>
</view>
	
</template>

<script>
	export default {
		name:"newTexts",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	
</style>