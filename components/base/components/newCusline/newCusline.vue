<template>
<view class='line_wrap' :style="'padding:'+ datas.content.padding_top+'px 0px '+datas.content.padding_bottom+'px'">
 <view @click="$common.diyLinkJump(datas.content.dataset[0].link)" >
    <view class="custom-cut" :style="'background-color:'+ (datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';border-radius:'+(datas.content.radius_diy)+'px;overflow:hidden;'">
      <image v-if="(datas.content.select_bg_model == 2 && datas.content.bg_img)" :src="datas.content.bg_img" :lazy-load="true" mode="widthFix"></image>
    </view>
  </view>

</view>
</template>

<script>
	export default {
		name:"newCusline",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {
				height: 0,
			}
		},
		methods: {
			setContainerHeight: function(e){
			},
		}
	}
</script>

<style>
	.line_wrap view {
	  display: block;
	  width: 100%;
	  height: 100%;
	  font-size: 0
	}
	
	.line_wrap view image {
	  width: 100%
	}
	
	.no-hover {
	  background-color: transparent
	}
	
	.custom-cut { 
	  min-height: 10px;
	  font-size: 0;
	}
		
</style>
