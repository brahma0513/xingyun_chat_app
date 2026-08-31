<!-- 个人中心公共组件模板 -->
<template>
	<view>
		<!-- 个人中心组件 -->
		<userinfo :datas="datas" :indexs="indexs" v-if="datas.type == 'base20'" ref="userInfo"></userinfo>
		<!-- 分割线组件 -->
		<cusline :datas="datas" v-if="datas.type=='base7' && userInfo.user_id>0"></cusline>
		<!-- 公告滚动组件 -->
		<newsScroll :datas="datas" v-if="datas.type == 'base13' && userInfo.user_id>0"></newsScroll>
		<!-- 个人中心组件 -->
		<appfuncion :datas="datas" v-if="datas.type == 'base21' && userInfo.user_id>0"></appfuncion>
		<!-- 个人中心组件 -->
		<showData :datas="datas" v-if="datas.type == 'base24' && userInfo.user_id>0"></showData>
		<!-- 优惠券组件 -->
		<coupon :datas="datas" v-if="datas.type == 'market10000' && userInfo.user_id>0"></coupon>
		<!-- 文本组件 -->
		<texts :datas="datas" v-if="datas.type == 'base17' && userInfo.user_id>0"></texts>
		<!-- 沉浸式个人中心组件 -->
		<immersionUserinfo :datas="datas" :indexs="indexs" v-if="datas.type == 'trade_person_1'" ref="immersionUserinfo"></immersionUserinfo>
		<!-- 鸿云个人中心 -->
	    <hyUserInfo :datas="datas" :indexs="indexs" v-if="datas.type == 'trade10220_2'" ></hyUserInfo>
	</view>
</template>
<script>
	
	import cusline from '@/components/base/components/cusline/cusline.vue'
	import newsScroll from '@/components/base/components/newsScroll/newsScroll.vue'
	import userinfo from '@/components/base/components/userinfo/userinfo.vue'
	import appfuncion from '@/components/base/components/function/function.vue'
	import showData from '@/components/base/components/showData/showData.vue'
	import coupon from '@/components/market/components/coupon/coupon.vue'
	import texts from '@/components/base/components/texts/texts.vue'
	import immersionUserinfo from '@/components/base/components/immersionUserinfo/immersionUserinfo.vue'
	import hyUserInfo from '@/components/trade/components/hyUserInfo/hyUserInfo.vue' 
	
	export default {
		components: {
			cusline,
			newsScroll,
			userinfo,
			appfuncion,
			showData,
			coupon,
			texts,
			hyUserInfo,
			immersionUserinfo
		},
		name:"basePersonal",
		props:{
			datas:{
				type: Object,
				default: {}
			},
			//键名
			indexs: {
				type: Number,
				default: -1
			},
		},
		data() {
			return {
				userInfo:{},
			};
		},
		created(){
			this.userInfo = this.vuex_user
		},
		methods:{
			
		}
	}
</script>