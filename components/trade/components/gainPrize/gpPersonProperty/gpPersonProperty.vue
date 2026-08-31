<template>
	<view :style="'margin:'+content.padding+'px 0;'">
		<view style="width:95%;margin:0 auto;border-radius:10px;background:#fff;">
			<view class="list" style="width: 100%;border-radius: 7px;display:flex;flex-direction:row;align-items: center;margin:0 auto;background:white;justify-content: space-between;box-sizing: border-box;flex-wrap:wrap;">
				<view v-for="i in content.dataset" style="width:49%;">
					<view  @click="$common.diyLinkJump(i.num)">
						<view :style="'background-image: url(\''+http_host+'/gain_prize/web/static/images/center_banner.png\');background-size: 100% 100%;background-repeat: repeat;width:100%;padding:16px 11px;box-sizing:border-box'">
							<view style="font-size:18px;color:#53525D">{{i.icon}}</view>
							<view style="display:flex;align-items:center;margin-top:6px">
								<span style="color:#999;font-size:12px">{{i.name}}</span>
								<view style="margin-left:10px;"><img :src="http_host+'/gain_prize/web/static/images/right_icon.png'" style="width:12px;height:12px" alt="" /></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "gpPersonProperty",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				content: {},
				http_host: ''
			};
		},
		created() {	
			var that = this
			this.content=that.datas.content;	
			this.http_host = this.vuex_apiUrl;
			this.getAssets();
		},
		methods: {	
			/**
			 * 资产信息
			 */
			getAssets: function() {
				const _this = this;
				var params = {};
				_this.$common.requestData({
					url: '/gain_prize/web/index.php?m=user&a=get_user',
					data: params,
					method: "POST",
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
	                    _this.content.dataset.forEach(i => {
	                        if (i.pic == _this.http_host+'/resources/1') {
	                            i.icon = res.data.integral_num
	                            i.name = res.data.pub_set.diy_integral_name
	                            i.num = i.num + `?name=${res.data.pub_set.diy_integral_name}&num=${res.data.integral_num}`
	                        }
	                        if (i.pic ==  _this.http_host+'/resources/2') {
	                            i.icon = res.data.contribution_num
	                            i.name = res.data.pub_set.diy_contribution_name
	                            i.num = i.num + `?name=${res.data.pub_set.diy_contribution_name}&num=${res.data.contribution_num}`
	                        }
	                    })
	                }
				})
			},
		}
	}
	
</script>

<style>
	.card{
	    width: 686rpx;
	    padding: 16rpx 20rpx;
	    box-sizing: border-box;
	    margin: 0 auto;
	    border-radius: 20rpx;
	    background-color: #fff;
	}
	.title{
	    font-size: 28rpx;
	    font-family: PingFangSC-Medium, "PingFang SC";
	    font-weight: 500;
	    color: rgb(82, 82, 82);
	    margin-bottom: 42rpx;
	}
	.content{
	    display: flex;
	    flex-direction: row;
	    justify-content: space-around;
	    align-items: center;
	}
	.box{
	    text-align: center;
	}
	.icon{
	    width: 50rpx;
	    height: 50rpx;
	    display: block;
	    margin: 0 auto;
	}
	.name{
	    font-size: 28rpx;
	    font-family: PingFangSC-Medium, "PingFang SC";
	    font-weight: 500;
	    color: rgb(82, 82, 82);
	}
</style>