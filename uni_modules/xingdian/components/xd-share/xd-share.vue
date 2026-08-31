<template>
	<view v-if="show" >
		<view class="share-tips" @click="close()">
			<image class="img" :src="vuex_apiUrl + '/uniapp_template/web/static/images/uniapp_download/icon_share_tips.png'" mode="widthFix"></image>
			<view class="tips">点击右上角的“...”去分享给好友</view>
		</view>
	</view>
</template>

<script>
/**
 * xdShare 微信分享
 * @description 微信分享提示
 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
 * @property {String} bgImg 背景图
 * @property {Object} shareInfo 分享对象 
 *      shareInfo: {
            title: "", //分享标题
            app_name: "", //跳转应用名称
            path: "", //页面 path ，必须是以 / 开头的完整路径。例：/pages/index/index
            query: {}, //自定义参数
            imageUrl: "", //分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4
            content: "", //百度小程序表现为：分享内容；支付宝小程序表现为：吱口令文案
            desc: "", //自定义分享描述
        }
 */
import { shareMixins} from '@/mixins/share'
import qs from "qs"
export default {
	name: 'xdShare',
	props: {
		shareInfo: {
			type: Object,
			default: () => {}
		},
	},
	mixins: [shareMixins],
	data() {
		return {
			show: false,
			shareData: "",
			share_logo: "",
		}
	},
	watch: {
		shareInfo: {
			//深度监听，可监听到对象、数组的变化
			handler(val, oldVal) {
				this.initShare();
			},
		},
	},
	created() {
		this.initShare();
	},
	methods: {
		
		initShare(){
			var _this = this;
			var uniappSet = this.vuex_uniappSet;
			var share_logo = _this.shareInfo.imageUrl || uniappSet.app_logo_url
			_this.shareInfo.imageUrl = share_logo;
			_this.share_logo = share_logo;
			_this.shareData = _this.shareInfo;		
				console.log("shareInfo",_this.shareInfo)
				console.log("shareData",_this.shareData)
		},
		
		close(type) {			
			this.show = false
		},
		
		//分享
		onShare() {
			var _this = this;
			
			// #ifdef APP-PLUS
			
			plus.share.getServices(function(res){
				console.log("获取分享： ",res);
				for(var i=0;i<res.length;i++){
					var t = res[i];
					if(t.id == 'weixin'){
						shares = t;
					}
				}
			}, function(e){
			 	console.log("获取分享服务列表失败： ",JSON.stringify(e));
			});
			
			
			var paths = "";

			//query有参数 进入
			if (_this.shareData.query!== undefined && _this.shareData.query!== null) {
				paths = `${_this.shareData.path}?${qs.stringify(_this.shareData.query)}`
			}
			//query有参数 进入
			let link = _this.vuex_apiUrl + '/'+_this.shareData.app_name+'/web/index.php?m=index&a=index&customer_id='+_this.vuex_customer_id+'#';

			link += paths;
			this.$common.doShare(link,
			_this.shareData.title,
			_this.shareData.desc,
			_this.share_logo)
			
			// #endif
			// #ifndef APP-PLUS
			this.show = true;
			// #endif
			
		},
		
	}
}
</script>
<style lang="scss" >
	.share-tips{
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.6);
		left: 0;
		top: 0;
		z-index: 1000;
	}
	.share-tips .img {
	    display: block;
	    float: right;
	    width: 120rpx;
	    margin-right: 120rpx;
	}
	.share-tips .tips{
		color: #FFF;
		font-size: 32rpx;
		text-align: center;
		margin-top: 130rpx;
	}
</style>
