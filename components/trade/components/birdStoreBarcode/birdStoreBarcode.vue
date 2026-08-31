<template>
	<view class="bird_store_barcode"
	 :style="'padding: '+(datas.content.padding_top)+'px '+(datas.content.padding_right)+'px '+(datas.content.padding_bottom)+'px '+datas.content.padding_left+'px;'">
	    <view style="background: #fff;border-radius: 15px;text-align: center;padding: 10px;font-size: 14px;color: #333;">
			<view style="font-weight: 600;color: rgb(79, 196, 70);padding-bottom: 5px;">会员码付款
				<view style="position: absolute;right: 25px;font-weight: 400;color: #333;" @click="get_barcode()"
					v-if="datas.content.is_show">刷新</view>
			</view>
			<view class="barcode-box" :class="'barcode-show:'+datas.content.is_show" v-if="datas.content.is_show">
				<!-- <image id="bird_store_barcode" style="width: 100%;height: 80px;"> -->
				<tki-barcode
					style="display: flex;justify-content: center;align-items: center;"
				    ref="barcode"
				    :val="datas.content.barcode"
				    :onval="true"
					:opations="batOpations"
				    @result="barresult" />
				<view class="code">有效时间{{datas.content.expire_at}}</view>
			</view>
			<view v-if="!datas.content.is_show" class="">
				<view @click="jump('/wsy_user/web/index.php?m=set&a=user_account_safety')">
					<view style="color: #333;font-weight: 600;display: flex;justify-content: center;align-items: center;">
						<view>请前往绑定用户手机号</view>
						<image style="margin-left: 10px;width: 7px;height: 9px;"
							:src="http_host+'/bird_store/web/static/images/jiantou.png'">
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"
	export default {
		name: "birdStoreBarcode",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				http_host: '',
				batOpations:{
				}
			};
		},
		created() {
			var that = this;
			that.http_host = that.vuex_apiUrl
			that.getData();
		},
		methods: {
			//获取数据
			getData: function() {
				var that = this;
				that.$common.requestData({
					url: '/bird_store/web/index.php?m=index&a=user_barcode',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode === 0) {
						that.datas.content.barcode = res.data.barcode
						that.datas.content.expire_at = res.data.expire_at
						that.datas.content.is_show = res.data.is_show
					}
				})
			},
			get_barcode() {
				var that = this;
				that.$common.requestData({
					url: '/bird_store/web/index.php?m=index&a=user_barcode',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode === 0) {
						that.datas.content.barcode = res.data.barcode
						that.datas.content.expire_at = res.data.expire_at
						that.datas.content.is_show = res.data.is_show
					}
				})
			},
			barresult(){
				
			},
			jump(url){
				this.$common.diyLinkJump(url,"h5",true);
			}
		},
	}
</script>

<style>
	.bird_store_trade61 {
	    padding: 15px;
	}
	
	.bird_store_trade61 .bird_store_content {
	    /* background: #246FFF; */
	    border-radius: 15px;
	    padding: 10px;
	    position: relative;
	    /* background-image: url('/bird_store/web/static/images/qd_bgc.png'); */
	    background-repeat: no-repeat;
	    background-size: 100% 100%;
	}
	
	.bird_store_trade61 .bird_store_content .title {
	    font-weight: 400;
	    font-size: 15px;
	    color: #FFFFFF;
	    line-height: 21px;
	    margin-bottom: 10px;
	}
	
	.bird_store_trade61 .bird_store_content .title span {
	    font-weight: 600;
	    font-size: 18px;
	    color: #FFD690;
	    line-height: 25px;
	}
	
	.bird_store_trade61 .bird_store_content .bird_store_box {
	    display: flex;
	    align-items: center;
	    /* background-color: white; */
	    padding: 15px 10px;
	    border-radius: 15px;
	    text-align: center;
	}
	
	.bird_store_trade61 .bird_store_content .bird_store_box .bird_store_box_item {
	    flex: 1;
	    border-right: 1px solid #cccccc88;
	}
	
	.bird_store_trade61 .bird_store_content .bird_store_box .bird_store_box_item:last-child {
	    border-right: none;
	}
	
	.bird_store_trade61 .right-icon {
	    position: absolute;
	    top: -35px;
	    right: -4px;
	    width: 100px;
	    height: 100px;
	}
	
	.bird_store_trade61 .bird_store_value {
	    font-weight: 600;
	    font-size: 18px;
	    color: #333333;
	}
	
	.bird_store_trade61 .bird_store_label {
	    font-weight: 400;
	    font-size: 14px;
	    color: #999999;
	    line-height: 20px;
	}
</style>
