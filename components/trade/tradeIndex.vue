<template>
	<view>
		<!-- 分类商品组件 -->
		<product :datas="datas" v-if="datas.type == 'trade5'"></product>
		<!-- 分组商品组件 -->
		<shopGroup :datas="datas" v-if="datas.type == 'trade6'"></shopGroup>
		<giftbag :datas="datas" v-if="datas.type == 'trade60'"></giftbag>
		<intShop :datas="datas" v-if="datas.type == 'trade100401'"></intShop>
		<offlineShoppingGoodList :datas="datas" v-if="datas.type == 'offline_shopping_61'"></offlineShoppingGoodList>
		<offlineShoppingStoreList :datas="datas" v-if="datas.type == 'offline_shopping_60'"></offlineShoppingStoreList>
		<hyBlindBoxRe :datas="datas" v-if="datas.type == 'trade_10367_1'"></hyBlindBoxRe>
		<!-- 商城 商品组件 -->
		<shopModule :datas="datas" v-if="datas.type == 'trade7'"></shopModule>
		<!-- 短视频电商组件 -->
		<svodLive :datas="datas" v-if="datas.type == 'trade10030'"></svodLive>
		<!-- 微官网组件 -->
		<websiteMes :datas="datas" v-if="datas.type == 'trade_website_60'"></websiteMes>
		<websiteInfo :datas="datas" v-if="datas.type == 'trade_website_61'"></websiteInfo>
		<websiteInformation :datas="datas" v-if="datas.type == 'trade_website_62'"></websiteInformation>
		<!-- 幸福心聊 最新分享文章 -->
		<happyChatArticle :datas="datas" v-if="datas.type == 'trade_10391_1'"></happyChatArticle>
		<!-- 幸福心聊 每周推荐 -->
		<happyWeekHot :datas="datas" v-if="datas.type == 'trade_10391_2'"></happyWeekHot>
		<!-- 异业联盟 门店列表 -->
		<shopLeagueStore :datas="datas" v-if="datas.type == 'trade100361'"></shopLeagueStore>
		<!-- 异业联盟 新门店列表 -->
		<newShopLeagueStore :datas="datas" v-if="datas.type == 'new_trade100361'" ref="newShopLeagueStore">
		</newShopLeagueStore>
		<!-- 异业联盟 商品列表 -->
		<shopLeagueProduct :datas="datas" v-if="datas.type == 'new_trade100362'"></shopLeagueProduct>
		<!-- 异业联盟 分类列表 -->
		<shopLeagueGroup :datas="datas" v-if="datas.type == 'new_trade100363'"></shopLeagueGroup>
		<!-- 异业联盟 广告图 -->
		<shopLeagueSwiper :datas="datas" v-if="datas.type == 'new_trade100364'"></shopLeagueSwiper>
		<!-- 异业联盟 定位搜索 -->
		<shopLeagueLbsSearch :datas="datas" v-if="datas.type == 'new_trade100365'"></shopLeagueLbsSearch>
		<!-- 异业联盟 门店组件 -->
		<shopLeagueStoreComponent :datas="datas" v-if="datas.type == 'new_trade100366'"></shopLeagueStoreComponent>
		<!-- 拼团应用 拼团商品-->
		<fighttogethergoods :datas="datas" v-if="datas.type== 'trade100022'"></fighttogethergoods>
		<!-- 拼团应用 拼团活-->
		<groupactivity :datas="datas" v-if="datas.type== 'trade100021'"></groupactivity>
		<!-- 定制客户 红绿积分应用 -->
		<redGreenIntegralShop :datas="datas" v-if="datas.type== 'trade104221'"></redGreenIntegralShop>
		<redGreenIntegralActivities :datas="datas" v-if="datas.type== 'trade104222'"></redGreenIntegralActivities>
		<!-- 砍价 产品列表 -->
		<bargain :datas="datas" v-if="datas.type == 'trade61'"></bargain>
		<!-- 秒杀组件 -->

		<spike :datas="datas" v-if="datas.type == 'trade67'"></spike>
		<!-- 定制客户 优米cps应用活动 -->
		<youmiCpsActivities :datas="datas" v-if="datas.type == 'trade70007'" @handelParent="handelParent">
		</youmiCpsActivities>
		<!-- 定制客户 云前 增值奖励 -->
		<gpIndexPool :datas="datas" v-if="datas.type == 'trade40012_1'"></gpIndexPool>
		<!-- 定制客户 联通卡 -->
		<unicomIndexIcons :datas="datas" v-if="datas.type == 'trade_30005_11'"></unicomIndexIcons>
		<!-- 佰农荟定制 商城分组产品 -->
		<bainonghuiShopGroup :datas="datas" v-if="datas.type == 'trade_i_30035_1'"></bainonghuiShopGroup>
		<!-- 月之尚定制 龙美会积分商城活动 -->
		<longeIntShop :datas="datas" v-if="datas.type == 'trade105461'"></longeIntShop>
		<!-- 长岁树定制 长岁树积分商城活动 -->
		<cssIntegralShop :datas="datas" v-if="datas.type == 'trade300611'"></cssIntegralShop>
		<!-- 共享门店--首页展示 -->
		<indexServe :datas="datas" v-if="datas.type == 'trade80011'"></indexServe>
		<serviceProduct :datas="datas" v-if="datas.type == 'productlist80011'"></serviceProduct>
		<serviceMode :datas="datas" v-if="datas.type == 'tradeshuyun80011'"></serviceMode>
		<groupBuy :datas="datas" v-if="datas.type == 'productlistNew80011'"></groupBuy>
		<!-- 星云同城服务 -->
		<osProject :datas="datas" v-if="datas.type == 'os_project_30057'"></osProject>
		<!-- 异业联盟新商品组件 -->
		<newShopModule :datas="datas" v-if="datas.type == 'new_trade7'"></newShopModule>
		<!-- 异业联盟新分类商品组件 -->
		<newShopGroup :datas="datas" v-if="datas.type == 'new_trade6'"></newShopGroup>
		<!-- 微商城 品牌推广 -->
		<shopBrandPromotion :datas="datas" v-if="datas.type == 'trade1000309'"></shopBrandPromotion>
		<!-- 微商城 店铺组件 -->
		<shopComponent :datas="datas" v-if="datas.type == 'trade1000310'"></shopComponent>
		<!-- 电子福卡 -->
		<electronFukaLunbo :datas="datas" v-if="datas.type == 'trade700491'"></electronFukaLunbo>
		<electronFukaTanchuang :datas="datas" v-if="datas.type == 'trade700492'"></electronFukaTanchuang>
		<electronFukaErweima :datas="datas" v-if="datas.type == 'trade700499'"></electronFukaErweima>
		<!-- 电子福卡门店 -->
		<fkshopLeagueStore :datas="datas" v-if="datas.type == 'new_trade700561'"></fkshopLeagueStore>
		<fkshopLeagueProduct :datas="datas" v-if="datas.type == 'new_trade700562'"></fkshopLeagueProduct>
		<fkshopLeagueGroup :datas="datas" v-if="datas.type == 'new_trade700563'"></fkshopLeagueGroup>
		<fkshopLeagueSwiper :datas="datas" v-if="datas.type == 'new_trade700564'"></fkshopLeagueSwiper>
		<!-- 解独020重定向 -->
		<JdRedirection :datas="datas" v-if="datas.type == 'trade50206_1'"></JdRedirection>
		<!--联盟店铺商品列表-->
		<storeCp :datas="datas" v-if="datas.type == 'os_project_30106'"></storeCp>

		<!--联盟店铺分类-->
		<storeFl :datas="datas" v-if="datas.type == '30106_2'"></storeFl>
		
		<!-- 八爪鱼释放积分商品列表 -->
		<BzyinShop :datas="datas" v-if="datas.type == 'bzy_release_2007401'"></BzyinShop>
		<!-- 中聚祥云算力列表 -->
		<zjxyslTaskList :datas="datas" v-if="datas.type == 'zjxysl_task_30195_2'"></zjxyslTaskList>

		<!-- 微信小店商品 -->
		<shopLinkProduct :datas="datas" v-if="datas.type == 'sl_80143_product'"></shopLinkProduct>

	</view>
</template>
<script>
	import product from '@/components/trade/components/product/product.vue'
	import shopGroup from '@/components/trade/components/shopGroup/shopGroup.vue'
	import giftbag from '@/components/trade/components/giftbag/giftbag.vue'
	import offlineShoppingGoodList from '@/components/trade/components/offlineShoppingGoodList/offlineShoppingGoodList.vue'
	import offlineShoppingStoreList from '@/components/trade/components/offlineShoppingStoreList/offlineShoppingStoreList.vue'
	import hyBlindBoxRe from '@/components/trade/components/hyBlindBoxRe/hyBlindBoxRe.vue'
	import shopModule from '@/components/trade/components/shopModule/shopModule.vue'
	import svodLive from '@/components/trade/components/svodLive/svodLive.vue'
	import websiteMes from '@/components/trade/components/websiteMes/websiteMes.vue'
	import websiteInfo from '@/components/trade/components/websiteInfo/websiteInfo.vue'
	import websiteInformation from '@/components/trade/components/websiteInformation/websiteInformation.vue'
	import happyChatArticle from '@/components/trade/components/happyChatArticle/happyChatArticle.vue'
	import happyWeekHot from '@/components/trade/components/happyWeekHot/happyWeekHot.vue'
	import shopLeagueStore from '@/components/trade/components/shopLeague/shopLeagueStore/shopLeagueStore.vue'
	import newShopLeagueStore from '@/components/trade/components/shopLeague/newShopLeagueStore/newShopLeagueStore.vue'
	import groupactivity from '@/components/trade/components/groupactivity/groupactivity.vue'
	import fighttogethergoods from '@/components/trade/components/fighttogethergoods/fighttogethergoods.vue'
	import redGreenIntegralShop from '@/components/trade/components/redGreenIntegral/redGreenIntegralShop/redGreenIntegralShop.vue'
	import bargain from '@/components/trade/components/bargain/bargain.vue';
	import spike from '@/components/trade/components/spike/spike.vue';
	import redGreenIntegralActivities from '@/components/trade/components/redGreenIntegral/redGreenIntegralActivities/redGreenIntegralActivities.vue';
	import youmiCpsActivities from '@/components/trade/components/youmiCpsActivities/youmiCpsActivities.vue';
	import gpIndexPool from '@/components/trade/components/gainPrize/gpIndexPool/gpIndexPool.vue'
	import unicomIndexIcons from '@/components/trade/components/unicomPhoneCard/unicomIndexIcons.vue'
	import bainonghuiShopGroup from '@/components/trade/components/bainonghui/bainonghuiShopGroup/bainonghuiShopGroup.vue'
	import longeIntShop from '@/components/trade/components/longeIntShop/longeIntShop.vue'
	import intShop from '@/components/trade/components/intShop/intShop.vue'
	import cssIntegralShop from '@/components/trade/components/changsuishu/cssIntegralShop.vue'
	import indexServe from '@/components/trade/components/sharedStore/indexServe/indexServe.vue'
	import serviceProduct from '@/components/trade/components/sharedStore/serviceProduct/serviceProduct.vue'
	import serviceMode from '@/components/trade/components/sharedStore/serviceMode/serviceMode.vue'
	import groupBuy from '@/components/trade/components/sharedStore/groupBuy/groupBuy.vue'
	import osProject from '@/components/trade/components/osProject/osProject.vue'
	import newShopModule from '@/components/trade/components/newShopModule/newShopModule.vue'
	import newShopGroup from '@/components/trade/components/newShopGroup/newShopGroup.vue'
	import shopBrandPromotion from '@/components/trade/components/shopBrandPromotion/shopBrandPromotion.vue'
	import shopComponent from '@/components/trade/components/shopComponent/shopComponent.vue'
	import shopLeagueProduct from '@/components/trade/components/shopLeague/shopLeagueProduct/shopLeagueProduct.vue'
	import shopLeagueGroup from '@/components/trade/components/shopLeague/shopLeagueGroup/shopLeagueGroup.vue'
	import shopLeagueSwiper from '@/components/trade/components/shopLeague/shopLeagueSwiper/shopLeagueSwiper.vue'
	import shopLeagueLbsSearch from '@/components/trade/components/shopLeague/shopLeagueLbsSearch/shopLeagueLbsSearch.vue'
	import shopLeagueStoreComponent from '@/components/trade/components/shopLeague/shopLeagueStoreComponent/shopLeagueStoreComponent.vue'
	import electronFukaTanchuang from '@/components/trade/components/electronFuka/electronFukaTanchuang/electronFukaTanchuang.vue'
	import electronFukaLunbo from '@/components/trade/components/electronFuka/electronFukaLunbo/electronFukaLunbo.vue'
	import electronFukaErweima from '@/components/trade/components/electronFuka/electronFukaErweima/electronFukaErweima.vue'
	import fkshopLeagueStore from '@/components/trade/components/fkshopLeague/fkshopLeagueStore/fkshopLeagueStore.vue'
	import fkshopLeagueProduct from '@/components/trade/components/fkshopLeague/fkshopLeagueProduct/fkshopLeagueProduct.vue'
	import fkshopLeagueGroup from '@/components/trade/components/fkshopLeague/fkshopLeagueGroup/fkshopLeagueGroup.vue'
	import fkshopLeagueSwiper from '@/components/trade/components/fkshopLeague/fkshopLeagueSwiper/fkshopLeagueSwiper.vue'
	import JdRedirection from '@/components/trade/components/JdRedirection/JdRedirection.vue'
	import storeCp from '@/components/trade/components/AllianceStore/storeCp/storeCp.vue'
	import storeFl from '@/components/trade/components/AllianceStore/storeFl/storeFl.vue'
	import BzyinShop from '@/components/trade/components/bzyReleasePoints/inShop.vue'
	import zjxyslTaskList from '@/components/trade/components/zjxyslTask/zjxyslTaskList.vue'
	import shopLinkProduct from '@/components/trade/components/shop_link_product/shop_link_product.vue'
	
	export default {
		components: {
			product,
			shopGroup,
			giftbag,
			offlineShoppingGoodList,
			offlineShoppingStoreList,
			hyBlindBoxRe,
			shopModule,
			svodLive,
			websiteMes,
			websiteInfo,
			websiteInformation,
			happyChatArticle,
			happyWeekHot,
			shopLeagueStore,
			newShopLeagueStore,
			groupactivity,
			fighttogethergoods,
			redGreenIntegralShop,
			bargain,
			spike,
			redGreenIntegralActivities,
			youmiCpsActivities,
			gpIndexPool,
			unicomIndexIcons,
			bainonghuiShopGroup,
			longeIntShop,
			intShop,
			cssIntegralShop,
			indexServe,
			serviceProduct,
			serviceMode,
			groupBuy,
			osProject,
			newShopModule,
			newShopGroup,
			shopBrandPromotion,
			shopComponent,
			shopLeagueProduct,
			shopLeagueGroup,
			shopLeagueSwiper,
			shopLeagueLbsSearch,
			shopLeagueStoreComponent,
			electronFukaLunbo,
			electronFukaTanchuang,
			electronFukaErweima,
			fkshopLeagueStore,
			fkshopLeagueProduct,
			fkshopLeagueGroup,
			fkshopLeagueSwiper,
			JdRedirection,
			storeCp,
			storeFl,
			BzyinShop,
			zjxyslTaskList,
			shopLinkProduct
		},
		name: "tradeIndex",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {

			};
		},
		onLoad() {},
		methods: {
			handelParent(e) {
				this.$emit("parent_method", e)
			}
		}
	}
</script>