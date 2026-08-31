<template>
	<view>
		<u-modal :show="modal_show" :title="modal_title" :content="modal_content" @confirm="modal_confirm" :showCancelButton="true" @cancel="modal_show=false"></u-modal>
		
		<view v-if="showPage" :class="is_show_all_qr == 0 ? 'spread-keep' : ''">
			<view class="reload-box" >
				<u-icon @click="reloadImg()" :color="is_show_all_qr == 0 ? '#ffffff' : ''" name="reload" size="22"></u-icon>
				<text  @click="reloadImg()" class="reload-box-text" :style="is_show_all_qr == 0 ? 'color:#ffffff' : ''">刷新</text>
			</view>
			<view class="big-image">
				<image @longpress="saveShareImg()" mode='widthFix' :src="active_img" alt="" ></image>
		
			</view>
			<p class="tip">长按保存图片</p>
			<view class="small-image" v-if="is_show_all_qr == 1">
				<image :src="item" alt="" v-for="(item,index) in small_list" :class="active==index?'act skin-border':''"  @click="toggle(index)" ></image>
			</view>
		</view>
		<view v-if="tips_show" >
			<u-empty :text="tips" mode="permission"></u-empty>
		</view>
		<pagecom :datas="template_data"></pagecom>
	</view>
	
</template>

<script>
	import scope from './scope.js'
	export default {
	  ...scope,
	}
</script>

<style lang="scss">
	.spread-keep{
		height: 100vh;
		padding-top: 37px;
		background-color: #000;
	    box-sizing: border-box;
	}
	.spread-keep .big-image{
		margin-top:0;
	}
	.spread-keep .big-image>image{
		width:70%;
		box-shadow: none;
	}
	.spread-keep .tip{
		color:#fff;
	}
	 
	.big-image {
		margin-top: 37px;
		display: flex;
		justify-content: center;
	}
	 .big-image >image {
		width: 66.67%;
		box-shadow: 0 0 4px 2px rgba(216, 212, 212, 0.85);
	}
	 .tip {
	   display: block;
	   font-size: 24rpx;
		color: #8e8e8e;
		text-align: center;
		margin: 12px 0 22.5px;
	}
	 .small-image {
		width: 270px;
	    -webkit-display: flex;
	    display: flex;
	    margin: 0 auto 10px;
	    justify-content: space-between;
	}
	 .small-image > image {
		width: 60px;
		height: 60px;
		opacity: 0.5;
	}
	 .small-image .act {
		opacity: 1;
		-webkit-border-radius: 4px;
		border-radius: 4px;
		border: solid 2px #7f8aef;
	}
	.reload-box{
		display: flex;
		justify-content:flex-end;
		padding:18rpx 30rpx 30rpx 30rpx;
	}
	.reload-box-text{
		color: #000000;
		line-height: 50rpx;
		margin-left:10rpx;
		font-size: 24rpx;
	}
</style>
