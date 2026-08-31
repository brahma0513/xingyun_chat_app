<template>
	<view class="titles" :style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 0 '+ (datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px'">
		<view :class="'custom-title title-style-'+(datas.content.title_style)" :style="'background:'+datas.content.bg_color">
			<view class="title-main" :style="'text-align:'+(datas.content.title_style ==1?'center':'')+';font-size:'+(datas.content.font_size)+';color:'+(datas.content.font_color)+';font-weight:'+(datas.content.font_weight)+';'">{{datas.content.title}}</view>
			<view class="title-small" v-if="datas.content.title_style > 1" @click="sesClick(datas.content.dataset[0].link,datas.content.dataset[0].diy_link)">
				<view class="text" :style="'color:'+datas.content.link_color+';'" v-if="datas.content.title_style ==2">查看更多</view>
				<u-icon v-if="datas.content.title_style==3" class="icon" name="arrow-right" :color="datas.content.icon_color" size="16"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"titles",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				sesClick: function(link,diy_link){
					if(diy_link!=""){
						this.$common.diyLinkJump(diy_link)
					}else if(link != ""){
						this.$common.diyLinkJump(link)
					}
				},
			};
		}
	}
</script>

<style>
.titles .custom-title {
  padding: 0 15px;
  overflow: hidden;
  font-size: 15px;
}

.titles custom-title.title-style-1 .title-main {
  text-align: center;
}

.titles .custom-title .title-main {
  line-height: 50px;
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.titles .custom-title.title-style-2 .title-main {
  width: 70%;
  display: inline-block;
  vertical-align: middle;
}

.titles .custom-title .title-small {
  font-size: 0;
  width: 30%;
  display: inline-block;
  vertical-align: middle;
  text-align: right;
}

.titles .text {
  color: #926dde;
  font-size: 12px;
}

.titles .custom-title.title-style-3 .title-main {
  width: 70%;
  display: inline-block;
  vertical-align: middle;
}

.titles .icon {
  display: inline-block;
  vertical-align: middle;
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
  font-style: normal;
  position: relative;
}

.titles .custom-title .title-small .title-icon {
  font-size: 20px;
  font-weight: 600;
}
</style>
