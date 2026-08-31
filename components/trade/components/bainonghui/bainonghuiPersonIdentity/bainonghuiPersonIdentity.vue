<template>
	<view class="bainonghui-personal" :style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 10px '+ (datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px'">
		<view class="vip-comp vip-box">
		    <view class="vip-bg" :style="'background: url('+http_host+'/bainonghui/web/static/images/vip-bg.png) no-repeat;background-size: cover;border-radius: 10px;'">
		      <view class="tips">当前身份</view>
		      <view class="identity">{{datas.content.identity_name}}</view>
		      <image class="current-level" :src="http_host+'/bainonghui/web/static/images/vip-icon.png'" />
		    </view>
		  </view>
	</view>
</template>

<script>
	export default {
		name: "bainonghuiPersonIdentity",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,				
			};
		},
		created() {
			const that = this;
			this.http_host = this.vuex_apiUrl
			this.bainonghui_getdata();
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			//获取数据
			bainonghui_getdata() {
				let that = this;
				that.$common.requestData({
					url: "/bainonghui/web/index.php?m=details&a=get_user_identity&customer_id=" + that.vuex_customer_id,
					data: { }, 
					method: "POST", 
					needToken: true,
				}).then(res => {
					if (res.errcode == 0) {						
						that.datas.content.identity_level = res.data.identity_level;
						that.datas.content.identity_name = res.data.identity_name;
					}
				})
			},
		},
		
	}
	
</script>

<style>
	.bainonghui-personal .vip-comp image{
	    display: block;
	}
	.bainonghui-personal .vip-comp #open{
	    display: none;
	}
	.bainonghui-personal .vip-comp{
	    padding: 20px 10px 10px 10px;
	}
	.bainonghui-personal .vip-comp .vip-bg{
	    position: relative;
	    background-size:cover;
	    height: 80px;
	    width: 100%;
	}
	.bainonghui-personal .vip-comp .current-level{
	    position: absolute;
	    top: -25px;
	    right: 40px;
	    width: 85px;
	    height: 85px;
	    z-index: 3;
	}
	.bainonghui-personal .vip-comp .vip-icon-item{
	    flex: 2;
	}
	.bainonghui-personal .vip-comp .vip-icon-item .vip-name{
	    color: white;
	    font-size: 11px;
	    text-align: center;
	    margin-top: 5px;
	}
	.bainonghui-personal .vip-comp .vip-icon-item image{
	    width: 34px;
	    height: 34px;
	    margin: auto;
	}
	.bainonghui-personal .vip-comp .default{
	    height: 0;
	    overflow: hidden;
	}
	.bainonghui-personal .vip-comp .open{
	    height: 68px;
	    overflow: hidden;
	}
	.bainonghui-personal .vip-comp .vip-icon-box{
	    display: flex;
	    padding: 0 8px;
	    transition: all ease-in-out 0.5s;
	}
	.bainonghui-personal .vip-comp .more-tit{
	    color: #6E4000;
	    font-size: 13px;
	}
	.bainonghui-personal .vip-comp .more-row{
	    height: 30px;
	    line-height: 30px;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    padding: 0 15px;
	}
	.bainonghui-personal .vip-comp .more-row .jt image{
	    width: 12px;
	    height: 12px;
	}
	.bainonghui-personal .vip-comp .more{
	    /* position: absolute; */
	    width: 100%;
	    bottom: 0;
	    left: 0;
	    z-index: 2;
	    margin-top: 12px;
	    background: linear-gradient(-90deg, #E3BD64, #DB982F);
	    border-radius: 0px 0px 10px 10px;
	}
	.bainonghui-personal .vip-comp .tips{
	    color: #BE8639;
	    font-size: 12px;
	    padding-top: 10px;
	    margin-left: 15px;
	}
	.bainonghui-personal .vip-comp .identity{
	    color: #6E4000;
	    font-size: 17px;
	    margin: 5px 0 7px 15px;
	}
	.bainonghui-personal .vip-comp .upgrade{
	    width: 75px;
	    height: 25px;
	    background: linear-gradient(-90deg, #EBC773, #E3A84D);
	    border-radius: 12px;
	    color: white;
	    font-size: 13px;
	    text-align: center;
	    line-height: 25px;
	    margin-left: 15px;
	}
</style>