<template>
	<!--身份入口-->
	<view  class="tradeshuyun991-box" v-if="!datas.content.hidden">
		<view class="tradeshuyun991" >
			<view class="content-shuyun">
				<view class="swiper-container tradeshuyun991-swiper" autoplay="true" indicator-dots="true" circular="true" :duration="300"
					id="tradeshuyun991">
					<swiper class="banner_swiper" :style="control_style">
						<swiper-item class="swiper-slide" v-for="picData in datas.content.dataset"
							:key="picData.url">
							<view :data-pic="picData.pic" :data-value="picData.value" @click="go_url(picData.url)"
								:data-type="picData.sy_type">
								<img :src="picData['pic']" style="width: 100%" />
							</view>
						</swiper-item>
						<swiper-pagination></swiper-pagination>
					</swiper>

				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "identityCard",
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				monetary_unit: getApp().globalData.monetary_unit,
				picData: [],
				control_style:{
					height:'72px',
					marginTop:'10px'
				},
				
			};
		},
		
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		
		created() {
			this.check_pic();
			this.get_user_info();
			
		},
		mounted() {
			console.log('身份信息组件 mounted');
		},
		methods: {

			check_pic(){
				if (this.datas.content.dataset.length == 3) {
					this.datas.content.dataset[0].pic = 'https://ypt.zgqcwg.com/shared_store/web/static/images/b1.png'
					this.datas.content.dataset[1].pic = 'https://ypt.zgqcwg.com/shared_store/web/static/images/b2.png'
					this.datas.content.dataset[2].pic = 'https://ypt.zgqcwg.com/shared_store/web/static/images/b3.png'
				}
				else if (0 < this.datas.content.dataset.length && this.datas.content.dataset.length < 3) {
				  // 遍历数组
				  this.datas.content.dataset.forEach(item => {
				
				    if (item.is_owner && item.is_owner === 1) {
				      item.pic = 'https://ypt.zgqcwg.com/shared_store/web/static/images/b1.png';
				    }
				   
				    else if (item.stockholder && item.stockholder === 1) {
				      item.pic = 'https://ypt.zgqcwg.com/shared_store/web/static/images/b2.png';
				    }
				    // 判断是否存在 is_employee 且值为 1
				    else if (item.is_employee && item.is_employee === 1) {
				      item.pic = 'https://ypt.zgqcwg.com/shared_store/web/static/images/b3.png';
				    }
				  });
				}
				
				else {
					this.datas.content.dataset.hidden = true;
				}
			},
			
			//获取用户详细信息
			get_user_info() {
				const that = this;
				that.picData = []
				that.$common.requestData({
						url: '/shared_store/web/index.php?m=user&a=my',
						method: 'POST',
						needToken: true,
					})
					.then(res => {
						
						if (res.errcode === 0) {
							
							that.datas.content.dataset = that.datas.content.dataset.filter(e => {
								return e.is_owner == res.data.is_owner ||
									e.stockholder == res.data.stockholder ||
									e.is_employee == res.data.is_employee;
							});
							for(var i=0; i<that.datas.content.dataset.length;i++){
								that.picData.push(that.datas.content.dataset[i])
						
							}
							
						}
					
						if (that.datas.content.dataset.length === 0) {
							that.datas.content.dataset.hidden = true;
						}
						if (that.datas.content.dataset.hidden) {
							Object.assign(that.control_style, { height: '0px', marginTop: '0px' });
						} 
					})
					.catch(error => {
						console.error('获取用户信息失败:', error);
					});
			},

			go_url(url) {
				this.$common.diyLinkJump(url);
			},

		}

	}
</script>

<style>
	.tradeshuyun991-box {
	    height: auto; /* 确保高度自适应 */
	    min-height: 0; /* 避免最小高度占用空间 */
	}
	.shop_view_box {
		width: 100%;
		height: 144rpx;
	}

	.banner_img {
		width: 100%;
		height: 144rpx;
		position: relative;
	}


	/* 店主之家/股东之家轮播 */
	.banner_swiper {
		width: 100%;
		border-radius: 20rpx;
		overflow: hidden;
		margin-top: 20rpx;
	}
</style>