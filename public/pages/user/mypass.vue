<template>
	<view class="set">
		<template>
			<u-cell-group>
				<u-cell icon="phone" disabled rightIcon="" :title="$t('public.phone-label')" :value="vuex_user.country_code+' '+vuex_user.phone" isLink url="" :border="false" :customStyle="cellStyle" v-if="vuex_user.user_id"></u-cell>
				<u-cell icon="lock" clickable :title="$t('as.update-pwd')" isLink url="/public/pages/user/editLoginpass" :border="false" :customStyle="cellStyle" v-if="vuex_user.user_id"></u-cell>
				<u-cell icon="lock" clickable :title="$t('as.update-pay-pwd')" isLink url="/public/pages/user/editPaypass" :border="false" :customStyle="cellStyle" v-if="vuex_user.user_id"></u-cell>
			</u-cell-group>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cellStyle:'border-bottom: 1px solid #eeeeee;padding: 5rpx 0rpx;',
			}
		},
		onShow() {
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#ffffff;
	}
</style>
