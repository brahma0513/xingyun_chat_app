<template>
	<view :style="'padding:'+content.padding_top?content.padding_top:content.padding+'px '+content.style==1?0:10+'px '+content.padding_bottom?content.padding_bottom:content.padding+'px;'">
    <view class="card">
	        <view class="title">
	            {{content.li_title}}
	        </view>
	        <view class="content">
	            <view class="box" v-for="item in content.dataset">
	                <view @click="$common.diyLinkJump(item.icon)">
	                    <image :src="http_host+item.img" class="icon"/>
	                    <view class="name">
	                        {{item.name}}
	                    </view>
	                </view>
	            </view>
	        </view>
	    </view>
	</view>
</template>

<script>
	export default {
		name: "hapinlineOrderlist",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				content: {},
				list: [],
				http_host: ''
			};
		},
		created() {
	
			var that = this
			// that.getAssets();
			this.content=that.datas.content;
			var list = that.datas.content.dataset
			this.http_host = this.vuex_apiUrl;
			var reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/);
		},
		methods: {	
					/**
					 * 资产信息
					 */
					getAssets: function() {
						const _this = this;
						var params = {};
						_this.$common.requestData({
							url: '/hapinline/web/index.php?m=user&a=get_member',
							data: params,
							method: "POST",
							needToken: true
						}).then(res => {
			
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