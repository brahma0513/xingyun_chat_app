<!-- 公共组件模板 -->
<template>
	<view>
		<!--搜索组件-->
		<search :datas="datas" :indexs="indexs" :page_title="page_title" v-if="datas.type=='base1'" ref="search"></search>
		<!--轮播图组件-->
		<myswiper :datas="datas" :indexs="indexs" :page_title="page_title" v-if="datas.type=='base2'" ref="myswiper"></myswiper>
		<!--分类图标组件-->
		<icons :datas="datas" v-if="datas.type=='base3'"></icons>
		<!--橱窗组件-->
		<pictow :datas="datas" v-if="datas.type=='base4'"></pictow>
		<!-- 分割线组件 -->
		<cusline :datas="datas" v-if="datas.type=='base7'"></cusline>
		<!-- 公告滚动组件 -->
		<newsScroll :datas="datas" v-if="datas.type == 'base13'"></newsScroll>
		<!-- 倒计时组件 -->
		<countdown :datas="datas" v-if="datas.type == 'base16'"></countdown>
		<!-- 标题栏组件 -->
		<titles :datas="datas" v-if="datas.type == 'base15'"></titles>
		<!-- 活动商品组件 -->
		<eventGoods :datas="datas" v-if="datas.type == 'market10010' "></eventGoods>
		<!-- 优惠券组件 -->
		<coupon :datas="datas" v-if="datas.type == 'market10000'"></coupon>
		<!-- lbs组件 -->
		<lbs :datas="datas" :indexs="indexs" :page_title="page_title" v-if="datas.type == 'base14'" ref="lbs"></lbs>
		<!-- 文本组件 -->
		<texts :datas="datas" v-if="datas.type == 'base17'"></texts>
		
		<!-- 新搜索框组件 -->
		<newSearch :datas="datas" :indexs="indexs" :page_title="page_title" v-if="datas.type=='new_base1'" ref="newSearch"></newSearch>
		<!--新轮播图组件-->
		<myNewSwiper :datas="datas" :indexs="indexs" :page_title="page_title" v-if="datas.type=='new_base2'" ref="myNewSwiper"></myNewSwiper>
		<!--新分类图标组件-->
		<newIcons :datas="datas" v-if="datas.type=='new_base3'"></newIcons>
		<!--新橱窗组件-->
		<newPictow :datas="datas" v-if="datas.type=='new_base4'"></newPictow>
		<!--新公告滚动组件-->
		<newScroll :datas="datas" v-if="datas.type=='new_base13'"></newScroll>
		<!--新标题栏组件-->
		<newTitles :datas="datas" v-if="datas.type=='new_base15'"></newTitles>
		<!--新倒计时组件-->
		<newCountdown :datas="datas" v-if="datas.type=='new_base16'"></newCountdown>
		<!--新标签页组件-->
		<newTab :datas="datas" :indexs="indexs" v-if="datas.type=='new_base18'" @handelParent="handelParent"></newTab>
		<!--新文本组件-->
		<newTexts :datas="datas" v-if="datas.type=='new_base17'"></newTexts>
		<!-- 新分割线组件 -->
		<newCusline :datas="datas" v-if="datas.type=='new_base7'"></newCusline>
		<!-- 新视频组件 -->
		<newVideos :datas="datas" v-if="datas.type=='new_base10'"></newVideos>
		<!-- 新优惠券组件 -->
		<newCoupon :datas="datas" v-if="datas.type=='new_market10000'"></newCoupon>
		<!-- 新活动商品组件 -->
		<newEventGoods :datas="datas" v-if="datas.type=='new_market10010'"></newEventGoods>
		<!-- 新限时抢券组件 -->
		<newGrabCoupon :datas="datas" v-if="datas.type=='new_market10020'"></newGrabCoupon>
		<!-- 店铺信息组件 -->
		<shopMessage :datas="datas" v-if="datas.type=='new_base_shop'"></shopMessage>
		<!-- 返回上一页组件 -->
		<previousPage :datas="datas" v-if="datas.type=='new_base19'"></previousPage>
		<!-- 热区组件 -->
		<hotspot :datas="datas" v-if="datas.type=='new_base25'"></hotspot>
		<!-- 跑马灯组件 -->
		<newHorse :datas="datas" v-if="datas.type=='new_market10030'"></newHorse>
		<!-- 爆款推荐组件 -->
		<newHot :datas="datas" v-if="datas.type=='new_market10040'"></newHot>
		<!-- 动态推荐组件 -->
		<dynamicRecommendation :datas="datas" v-if="datas.type=='new_market10050'"></dynamicRecommendation>
		<!-- 沉浸式标题栏 组件 -->
		<immersionIndex :datas="datas" :indexs="indexs" :page_title="page_title" v-if="datas.type=='trade_index_bar'" ref="immersionIndex" @handleCancel="handelParent" ></immersionIndex>
	</view>
</template>
<script>
	import cusline from '@/components/base/components/cusline/cusline.vue'
	import icons from '@/components/base/components/icons/icons.vue'
	import myswiper from '@/components/base/components/myswiper/myswiper.vue'
	import newsScroll from '@/components/base/components/newsScroll/newsScroll.vue'
	import pictow from '@/components/base/components/pictow/pictow.vue'
	import search from '@/components/base/components/search/search.vue'
	import titles from '@/components/base/components/titles/titles.vue'
	import countdown from '@/components/base/components/countdown/countdown.vue'
	import eventGoods from '@/components/market/components/eventGoods/eventGoods.vue'
	import coupon from '@/components/market/components/coupon/coupon.vue'
	import lbs from '@/components/base/components/lbs/lbs.vue'
	import texts from '@/components/base/components/texts/texts.vue'
	import newSearch from '@/components/base/components/newSearch/newSearch.vue'
	import myNewSwiper from '@/components/base/components/myNewSwiper/myNewSwiper.vue'
	import newIcons from '@/components/base/components/newIcons/newIcons.vue'
	import newPictow from '@/components/base/components/newPictow/newPictow.vue'
	import newScroll from '@/components/base/components/newScroll/newScroll.vue'
	import newTitles from '@/components/base/components/newTitles/newTitles.vue'
	import newCountdown from '@/components/base/components/newCountdown/newCountdown.vue'
	import newTab from '@/components/base/components/newTab/newTab.vue'
	import newTexts from '@/components/base/components/newTexts/newTexts.vue'
	import newCusline from '@/components/base/components/newCusline/newCusline.vue'
	import newVideos from '@/components/base/components/newVideos/newVideos.vue'
	import newCoupon from '@/components/market/components/newCoupon/newCoupon.vue'
	import newEventGoods from '@/components/market/components/newEventGoods/newEventGoods.vue'
	import newGrabCoupon from '@/components/market/components/newGrabCoupon/newGrabCoupon.vue'
	import shopMessage from '@/components/base/components/shopMessage/shopMessage.vue'
	import previousPage from '@/components/base/components/previousPage/previousPage.vue'
	import hotspot from '@/components/base/components/hotspot/hotspot.vue'
	import newHorse from '@/components/market/components/newHorse/newHorse.vue'
	import newHot from '@/components/market/components/newHot/newHot.vue'
	import dynamicRecommendation from '@/components/base/components/dynamicRecommendation/dynamicRecommendation.vue'
	import immersionIndex from '@/components/base/components/immersionIndex/immersionIndex.vue'

	export default {
		components: {
			cusline,
			icons,
			myswiper,
			newsScroll,
			pictow,
			search,
			titles,
			eventGoods,
			coupon,
			countdown,
			lbs,
			texts,
			newSearch,
			myNewSwiper,
			newIcons,
			newPictow,
			newScroll,
			newTitles,
			newCountdown,
			newTab,
			newTexts,
			newCusline,
			newCoupon,
			newEventGoods,
			newGrabCoupon,
			newVideos,
			shopMessage,
			previousPage,
			hotspot,
			newHorse,
			newHot,
			dynamicRecommendation,
			immersionIndex
		},
		name: "baseIndex",
		props: {
			//数据
			datas: {
				type: Object,
				default: {}
			},
			//键名
			indexs: {
				type: Number,
				default: -1
			},
			//页面标题
			page_title: {
				type: String,
				default: '',
			}
		},
		data() {
			return {

			};
		},
		created() {
			
		},
		methods: {
			handelParent(e){
				this.$emit("parent_method",e)
			}
		}
	}
</script>
