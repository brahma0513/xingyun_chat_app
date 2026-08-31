<template>
	<view class="line_wrap" 
	:style="'padding:'+(datas.content.padding_top>0?datas.content.padding_top:datas.content.padding)+'px '+
			(datas.content.style==1?0:10)+'px '+
			(datas.content.padding_bottom>0?datas.content.padding_bottom:datas.content.padding)+'px'"
	>
		<view class="navigator" v-if="datas.content.dataset[0].sel_link_type==1"  @click="diyLinkJump(datas.content.dataset[0].link,datas.content.dataset[0].diy_link)">
			<view class="custom-cut" 
				v-if="datas.content.bg_type == 1"
				:style="'background:'+datas.content.bg_color+';border-radius:'+(datas.content.style==1?0:10)+'px'" ></view>
			<image 
				v-if="(datas.content.bg_type ? datas.content.bg_type == 2 : true) && datas.content.dataset[0].pic" 
				:src="datas.content.dataset[0].pic" 
				mode="widthFix"
				:style="'border-radius:'+(datas.content.style==1?0:10)+'px'"
				></image>
		</view>
		<view class="navigator" v-if="datas.content.dataset[0].sel_link_type==0" @click="open_mr(datas.content.dataset[0].diy_openid)">
			<view class="custom-cut" 
				v-if="datas.content.bg_type == 1" 
				:style="'background:'+datas.content.bg_color+';border-radius:'+(datas.content.style==1?0:10+'px')" ></view>
			<image
				v-if="(datas.content.bg_type ? datas.content.bg_type == 2 : true) && datas.content.dataset[0].pic"
				:src="datas.content.dataset[0].pic" 
				mode="widthFix"
				:style="'border-radius:'+(datas.content.style==1?0:10)+'px'"
				></image>
		</view>
	</view>
</template>

<script>
	export default {
		name:"cusline",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			diyLinkJump: function(link,diy_link){
				if(diy_link!=""){
					this.$common.diyLinkJump(diy_link)
				}else if(link != ""){
					this.$common.diyLinkJump(link)
				}
			},
			//跳转小程序
			open_mr: function(diy_openid){
				
			}
		}
	}
</script>

<style>
.line_wrap .navigator {
  display: block;
  width: 100%;
  height: 100%;
  font-size: 0
}

.line_wrap .navigator image {
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
