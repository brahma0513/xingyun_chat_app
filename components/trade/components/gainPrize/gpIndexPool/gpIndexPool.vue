<template>
	<view :style="'margin:'+content.padding+'px 0;'">
		<view style="border-radius:10px;background:#fff;">
			<view class="list" :style="'width: 100%;border-radius: 7px;display:flex;flex-direction:row;align-items: center;margin:0 auto;background:white;justify-content: space-between;box-sizing: border-box;flex-wrap:wrap;height:85px;background-image: url(\''+http_host+'/gain_prize/web/static/images/index_banner.png\');background-size: 100% 100%;background-repeat: repeat;width:100%;padding:16px 11px;'">
				<view v-for="(i,idx) in content.dataset" style="width:49%;text-align:center;position: relative;" v-if="i.isTrue" :style="{width:content.selectAll?'49%':'100%'}">
					<view v-if="idx == 1 && content.selectAll" style="position: absolute;top:50%;left:-3px;transform: translateY(-50%);width:2px;height:51px;background-color: #6645E7;">
					</view>
					<view>
						<view style="font-size:18px;color:#fff">{{i.icon}}</view>
						<view style="color:#fff;font-size:12px">{{i.name}}</view>
					</view>
					<!-- </a> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "gpIndexPool",
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
	                        if(i.pic == _this.http_host+'/resources/1') {
	                        	i.icon = res.data.integral_data.pool_num
	                        	i.name = res.data.pub_set.diy_pool_name
	                        }
	                        if(i.pic == _this.http_host+'/resources/2') {
	                        	i.icon = res.data.integral_data.integral_price
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