<template>
	<view class="happy-week-hot">
		<view class="week-recommended flex column">
			<view class="week-recommended_title">
				本周热推
			</view>
			<view class="week-recommended">
				<view class="week-recommended_img" @click="goDetail()">
					<image :src="seed_story_detail.image_url" mode=""></image>
					<view class="week-recommended_img_content">
						<span>{{seed_story_detail.name}}</span>
						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"happyWeekHot",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				seed_story_detail:{}
			};
		},
		created(){
			// 
			this.geSeedStory()
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			geSeedStory() {
				console.log(this.datas)
				var self = this;
				self.$common.requestData({
					url: '/happy_chat/web/index.php?m=seed_story&a=get_seed_story_detail&xdebug=xdebug',
					data: {
						'seed_story_id':this.datas.content.selector_id
					}, 
					method: "POST", 
					needToken: true,
				}).then(res => {
					if (res.errcode == 0) {
						console.log(res)
						self.seed_story_detail = res.data
						if(res.data.image_url==''){
							self.seed_story_detail.image_url=self.http_host+'/happy_chat/web/static/images/love.png'
						}
					}
				})
				},
				goDetail(){
					uni.navigateTo({
					    url: '/happy_chat/pages/seeds_columns/seeds_columns?seed_story_id=' + this.datas.content.selector_id
					});
				}
		}
	}
</script>

<style>
	.happy-week-hot{
		width: 100%;
		height: 100%;
		padding: 0 30rpx;
		background-color:#f6f6f6 ;
	}
</style>
<style lang="scss" scoped>
.week-recommended{
	margin-bottom: 30rpx;
	&_title{
		padding: 20rpx 0;
		font-size: 32rpx;
		font-weight: bold;
		// background-color: aqua;
	}
	& image{
		border-radius: 10rpx;
		height: 280rpx;
	}
	&_img{
		background-color: #fff;
		& span{
			display: block;
			padding: 20rpx;
		}
		&_content{
			padding: 15rpx 20rpx;
			&_line{
				width: 100%;
				height: 3rpx;
				background-color: #ECECEC
			}
		}
	}
	&_btn{
		background-color: #fff;
		padding: 15rpx;
		font-size: 20rpx;
		color: #666666;
		& image{
			width: 40rpx;
			height: 40rpx;
		}
	}
}
</style>