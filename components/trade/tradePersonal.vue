<!-- 个人中心行业组件模板 -->
<template>
	<view>
		<orderOne :datas="datas" v-if="datas.type == 'trade22' && userInfo.user_id>0"></orderOne>
		<orderGiftbag :datas="datas" v-if="datas.type == 'trade61' && userInfo.user_id>0"></orderGiftbag>
		<orderIntegral :datas="datas" v-if="datas.type == 'trade100402' && userInfo.user_id>0"></orderIntegral>
	    <hyShowData :datas="datas" v-if="datas.type == 'trade10220_3' && userInfo.user_id>0"></hyShowData>
	    <svodStatic :datas="datas" v-if="datas.type == 'trade10031' && userInfo.user_id>0"></svodStatic>
		<moneyCrowdstore :datas="datas" v-if="datas.type == 'trade10372_2' && userInfo.user_id>0"></moneyCrowdstore>
		<orderCrowdstore :datas="datas" v-if="datas.type == 'trade10372_1' && userInfo.user_id>0"></orderCrowdstore>
		<shopLeagueOrder :datas="datas" v-if="datas.type == 'trade100362' && userInfo.user_id>0"></shopLeagueOrder>
		<shopLeagueGroupOrder :datas="datas" v-if="datas.type == 'trade100363' && userInfo.user_id>0"></shopLeagueGroupOrder>
		<shopLeagueGeneralOrder :datas="datas" v-if="datas.type == 'trade100364' && userInfo.user_id>0"></shopLeagueGeneralOrder>
		<orderGroup :datas="datas" v-if="datas.type == 'trade100023' && userInfo.user_id>0"></orderGroup>
		<orderRedGreenIntegral :datas="datas" v-if="datas.type == 'trade104222' && userInfo.user_id>0"></orderRedGreenIntegral>
		<orderSeckill :datas="datas" v-if="datas.type == 'trade10067' && userInfo.user_id>0"></orderSeckill>
		<bargainOrder :datas="datas" v-if="datas.type == 'trade10096' && userInfo.user_id>0"></bargainOrder>
		<mallOrder :datas="datas" v-if="datas.type == 'trade104221' && userInfo.user_id>0"></mallOrder>
		
		<!-- 云前 哈品排队 -->
		<hapinlineAssets :datas="datas" v-if="datas.type == 'trade40009_2' && userInfo.user_id>0"></hapinlineAssets>
		<hapinlineOrderlist :datas="datas" v-if="datas.type == 'trade40009_1' && userInfo.user_id>0"></hapinlineOrderlist>
		<hapinlineRecord :datas="datas" v-if="datas.type == 'trade40009_3' && userInfo.user_id>0"></hapinlineRecord>
		<!-- 云前 增值奖励 -->
		<gpPersonProperty :datas="datas" v-if="datas.type == 'trade40012_1' && userInfo.user_id>0"></gpPersonProperty>
		<!-- 定制客户 联通卡 -->
		<unicomPersonIcons :datas="datas" v-if="datas.type == 'trade_30005_21'&& userInfo.user_id>0"></unicomPersonIcons>
		<!-- 定制客户 佰农荟 -->
		<bainonghuiPersonIdentity :datas="datas" v-if="datas.type == 'trade_p_30035_1'&& userInfo.user_id>0"></bainonghuiPersonIdentity>
		<bainonghuiPersonDatas :datas="datas" v-if="datas.type == 'trade_p_30035_2'&& userInfo.user_id>0"></bainonghuiPersonDatas>
		<!-- 定制客户 月之尚龙美会 -->
		<longeOrderIntShop :datas="datas" v-if="datas.type == 'trade105462'&& userInfo.user_id>0"></longeOrderIntShop>
		<!-- 定制客户 长岁树积分商城 -->
		<cssOrderIntShop :datas="datas" v-if="datas.type == 'trade300612'&& userInfo.user_id>0"></cssOrderIntShop>
		<!-- 定制客户 东芳吉豆 -->
		<dongfangjidou :datas="datas" v-if="datas.type == 'trade301452'&& userInfo.user_id>0"></dongfangjidou>
		<!-- 定制客户 共享门店 -->
		<identityCard :datas="datas" v-if="datas.type == 'tradeshuyun991'&& userInfo.user_id>0"></identityCard>
		<money-one :datas="datas" v-if="datas.type == 'tradeshuyun99'&& userInfo.user_id>0"></money-one>
		<hotelShop :datas="datas" v-if="datas.type == 'trade10585'&& userInfo.user_id>0"></hotelShop>
		<!-- 定制客户 青鸟 -->
		<birdStore :datas="datas" v-if="datas.type == 'bird_store_trade61'&& userInfo.user_id>0"></birdStore>
		<birdStoreBarcode :datas="datas" v-if="datas.type == 'bird_store_barcode'"></birdStoreBarcode>
		<newShopLeagueOrder :datas="datas" v-if="datas.type == 'new_trade100362' && userInfo.user_id>0"></newShopLeagueOrder>
		<!-- 定制客户 电子福卡 -->
		<fkShopLeagueOrder :datas="datas" v-if="datas.type == 'new_trade700562' && userInfo.user_id>0"></fkShopLeagueOrder>
		<!-- 定制客户 积分升级奖励 -->
		<pointsUpgradeLevel :datas="datas" v-if="datas.type == 'points_upgrade_70' && userInfo.user_id>0"></pointsUpgradeLevel>
		<pointsUpgradeFrozen :datas="datas" v-if="datas.type == 'points_upgrade_71' && userInfo.user_id>0"></pointsUpgradeFrozen>
		<pointsUpgradeSign :datas="datas" v-if="datas.type == 'points_upgrade_72' && userInfo.user_id>0"></pointsUpgradeSign>
		<!-- 定制客户 数云 数字补贴 -->
		<pictowes :datas="datas" v-if="datas.type == 'tradeshuyunszbt1' && userInfo.user_id>0"></pictowes>
		<digitalSubsidy :datas="datas" v-if="datas.type == 'digital_asset_trade' && userInfo.user_id>0"></digitalSubsidy>
		<birdMtorder :datas="datas" v-if="datas.type == 'tradebirdmeituan001' && userInfo.user_id>0"></birdMtorder>
		<!-- 礼包份额分红 交易所快捷兑换 -->
		<giftShareDividend :datas="datas" v-if="(datas.type == 'trade301781' || datas.type == '30178_1') && userInfo.user_id>0"></giftShareDividend>
		<!-- 中聚祥云算力广告个人资产 -->
		<zjxyslTaskUserAsset :datas="datas" v-if="(datas.type == 'zjxysl_task_30195_1' || datas.type == 'zjxy_shop_30199_1') && userInfo.user_id>0"></zjxyslTaskUserAsset>
	</view>
</template>
<script>
	import orderOne from '@/components/trade/components/orderOne/orderOne.vue'
	import orderGiftbag from '@/components/trade/components/orderGiftbag/orderGiftbag.vue'
	import orderIntegral from '@/components/trade/components/orderIntegral/orderIntegral.vue'
	import hyShowData from '@/components/trade/components/hyShowData/hyShowData.vue' 
	import svodStatic from '@/components/trade/components/svodStatic/svodStatic.vue' 
	import moneyCrowdstore from '@/components/trade/components/crowdstore/moneyCrowdstore/moneyCrowdstore.vue'
	import orderCrowdstore from '@/components/trade/components/crowdstore/orderCrowdstore/orderCrowdstore.vue' 
	import shopLeagueOrder from '@/components/trade/components/shopLeague/shopLeagueOrder/shopLeagueOrder.vue' 
	import orderGroup from '@/components/trade/components/orderGroup/orderGroup.vue' 
	import orderRedGreenIntegral from '@/components/trade/components/redGreenIntegral/orderRedGreenIntegral/orderRedGreenIntegral.vue'
	import orderSeckill from '@/components/trade/components/orderSeckill/orderSeckill.vue'
	import bargainOrder from '@/components/trade/components/bargainOrder/bargainOrder.vue'
	import mallOrder from '@/components/trade/components/redGreenIntegral/mallOrder/mallOrder.vue'
	import hapinlineAssets from '@/components/trade/components/hapinline/hapinlineAssets/hapinlineAssets.vue'
	import hapinlineOrderlist from '@/components/trade/components/hapinline/hapinlineOrderlist/hapinlineOrderlist.vue'
	import hapinlineRecord from '@/components/trade/components/hapinline/hapinlineRecord/hapinlineRecord.vue'
	import gpPersonProperty from '@/components/trade/components/gainPrize/gpPersonProperty/gpPersonProperty.vue'
	import unicomPersonIcons from '@/components/trade/components/unicomPhoneCard/unicomPersonIcons.vue'
	import bainonghuiPersonIdentity from '@/components/trade/components/bainonghui/bainonghuiPersonIdentity/bainonghuiPersonIdentity.vue'
	import bainonghuiPersonDatas from '@/components/trade/components/bainonghui/bainonghuiPersonDatas/bainonghuiPersonDatas.vue'
	import longeOrderIntShop from '@/components/trade/components/longeOrderIntShop/longeOrderIntShop.vue'
	import cssOrderIntShop from '@/components/trade/components/changsuishu/cssOrderIntShop.vue'
	import identityCard from '@/components/trade/components/sharedStore/identityCard/identityCard.vue'
	import moneyOne from '@/components/trade/components/sharedStore/moneyOne/moneyOne.vue'
	import hotelShop from '@/components/trade/components/shpanheHotel/hotelShop.vue'
	import birdStore from '@/components/trade/components/birdStore/birdStore.vue'
	import birdStoreBarcode from '@/components/trade/components/birdStoreBarcode/birdStoreBarcode.vue'
	import shopLeagueGeneralOrder from '@/components/trade/components/shopLeague/shopLeagueGeneralOrder/shopLeagueGeneralOrder.vue'
	import shopLeagueGroupOrder from '@/components/trade/components/shopLeague/shopLeagueGroupOrder/shopLeagueGroupOrder.vue'
	import newShopLeagueOrder from '@/components/trade/components/shopLeague/newShopLeagueOrder/newShopLeagueOrder.vue'
	import fkShopLeagueOrder from '@/components/trade/components/fkshopLeague/fkShopLeagueOrder/fkShopLeagueOrder.vue'
	import pointsUpgradeLevel from '@/components/trade/components/pointsUpgrade/pointsUpgradeLevel/pointsUpgradeLevel.vue'
	import pointsUpgradeFrozen from '@/components/trade/components/pointsUpgrade/pointsUpgradeFrozen/pointsUpgradeFrozen.vue'
	import pointsUpgradeSign from '@/components/trade/components/pointsUpgrade/pointsUpgradeSign/pointsUpgradeSign.vue'
	import dongfangjidou from '@/components/trade/components/jidou/dongfangjidou.vue'
	import pictowes from '@/components/trade/components/digitalSubsidy/pictowes.vue'
	import digitalSubsidy from '@/components/trade/components/digitalSubsidy/digitalSubsidy.vue'
	import birdMtorder from '@/components/trade/components/birdMtorder/birdMtorder.vue'
	import giftShareDividend from '@/components/trade/components/giftShareDividend/giftShareDividend.vue'
	import zjxyslTaskUserAsset from '@/components/trade/components/zjxyslTask/zjxyslTaskUserAsset.vue'
	export default {
		components: {
			orderOne,
			orderGiftbag,
			orderIntegral,
			hyShowData,
			svodStatic,
			moneyCrowdstore,
			orderCrowdstore,
			shopLeagueOrder,
			orderGroup,
			orderRedGreenIntegral,
			orderSeckill,
			bargainOrder,
			mallOrder,
			hapinlineAssets,
			hapinlineOrderlist,
			hapinlineRecord,
			gpPersonProperty,
			unicomPersonIcons,
			bainonghuiPersonIdentity,
			bainonghuiPersonDatas,
			longeOrderIntShop,
			cssOrderIntShop,
			identityCard,
			moneyOne,
			hotelShop,
			birdStore,
			birdStoreBarcode,
			shopLeagueGeneralOrder,
			shopLeagueGroupOrder,
			newShopLeagueOrder,
			fkShopLeagueOrder,
			pointsUpgradeLevel,
			pointsUpgradeFrozen,
			pointsUpgradeSign,
			dongfangjidou,
			pictowes,
			digitalSubsidy,
			birdMtorder,
			giftShareDividend,
			zjxyslTaskUserAsset
		},
		name: "tradePersonal",
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
				
			};
		},
		created(){
			this.userInfo = this.vuex_user
		},
		onLoad(){},
		methods:{
			
		}
	}
</script>