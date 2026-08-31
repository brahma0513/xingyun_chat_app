<template>
	<view class="happy-chat-article">
	<view class="share flex column ">
		<view class="share_title">
			最新分享
		</view>
		<view class="share_list flex column">
			<view class="share_list_item flex align-items-center" v-for="(item,index) in article_list" @click="goDetail(item.id)">
				<view class="share_list_item_img">
					<image :src="item.headimgurl" mode=""></image>
				</view>
				<view class="share_list_item_span">
					<view>
						{{item.course_term}}
					</view>	
					{{item.content}}
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		name:"happyChatArticle",
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
				article_list:[],
			};
		},
		created(){
			this.getNewArticle()
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			getNewArticle() {
				var self = this;
				self.$common.requestData({
					url: '/happy_chat/web/index.php?m=article&a=get_latest_article&xdebug=xdebug',
					data: {
						'num':this.datas.content.happy_article_num
					}, 
					method: "POST", 
					needToken: false,
				}).then(res => {
					if (res.errcode == 0) {
						console.log(res)
						var list = res.data
						for (let i = 0; i < list.length; i++) {
							self.article_list.push(list[i]);
						}
						
						self.page = self.page+1
					}
				})
				},
				goDetail(id){
					console.log(id)
					uni.navigateTo({
					    url: '/happy_chat/pages/students_share/students_share?article_id=' + id
					});
				}
		}
	}
</script>

<style>
	.happy-chat-article{
		width: 100%;
		height: 100%;
		padding: 0 30rpx;
		background-color:#f6f6f6 ;
	}
</style>
<style lang="scss" scoped>
.share{
	width: 100%;
	&_title{
		padding: 20rpx 0;
		font-size: 30rpx;
		font-weight: 600;
	}
	&_list{
		border-radius: 10rpx;
		background-color: #fff;
		&_item{
			padding: 30rpx 20rpx;
			padding-bottom: 40rpx;
			&_img{
				width: 150rpx;
				height: 150rpx;
				& image{
					border-radius: 10rpx;
					width: 150rpx;
					height: 150rpx;
				}
			}
			&_span{
				padding-left: 20rpx;
			}
		}
	}
}
</style>