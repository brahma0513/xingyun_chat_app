<template>
	<view :style="'padding:' +datas.content.padding_top+'px '+(datas.content.style==1?0:10)+'px '+datas.content.padding_bottom+'px;'">
		<view :style="'background-color: '+datas.content.bg_color+';font-size: '+(datas.content.font_size==1?'14':datas.content.font_size==2?'16':'18')+'px;text-align: '+(datas.content.text_align==1?'left':datas.content.text_align==2?'center':'right')+';color: '+datas.content.font_color+';border-radius: '+(datas.content.css_type==1?0:8)+'px;padding: 12px;word-break: break-all;'">
		{{datas.content.textarea}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"texts",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
