<template>
	<view v-if="datas.type=='digital_asset_trade'&&!datas.content.hidden_status" class="digital_asset_trade" :style="{
	      paddingTop: (datas.content.padding_top || 0) + 'px',
	      paddingRight: datas.content.padding_right + 'px',
	      paddingBottom: datas.content.padding_bottom + 'px',
	      paddingLeft: datas.content.padding_left + 'px'
	    }">

		<!-- 2. 移除 wx:if 改用 v-if，style 绑定改为 uni-app 推荐的对象形式 -->
		<view v-if="!datas.content.hidden_status" class="digital_subsidy_content"
			:style="{backgroundImage: 'url(' + http_host +'/resources/' +datas.content.pic + ')'}">

			<!-- 全部累计收益 -->
			<div class="total_reward" v-if="datas.content.income_show">
				<image :src="http_host + '/uniapp_template/web/static/images/douzi_icon.png'" alt=""></image>
				<div>{{datas.content.currency_name}}: {{assets.total_currency ||0}}</div>
			</div>

			<!-- 累计零钱 -->
			<div class="total_reward" v-if="datas.content.money_show">
				<image :src="http_host + '/uniapp_template/web/static/images/douzi_icon.png'" alt=""></image>
				<div>{{datas.content.money_name}}: {{assets.total_money ||0}}</div>
			</div>

			<!-- 资产数据 -->
			<view class="digital_subsidy_box" :data-json="json">
				<!-- 消费卷 -->
				<view class="digital_subsidy_box_item" @tap="go_urls('/digital_subsidy/web/index.php?m=view&a=currency_list&name='
            +datas.content.currencyname)" v-if="datas.content.currency_show">
					<view class="digital_subsidy_value">{{assets.currency||'0'}}</view>
					<view class="digital_subsidy_label">{{datas.content.currencyname}}</view>
				</view>
				<!-- 贡献值 -->
				<view class="digital_subsidy_box_item" @tap="go_urls('/digital_subsidy/web/index.php?m=view&a=contribution_list&name='
            +datas.content.contribution_name)" v-if="datas.content.contribution_show">
					<view class="digital_subsidy_value">{{assets.contribution||'0'}}</view>
					<view class="digital_subsidy_label">{{datas.content.contribution_name}}</view>
				</view>

				<!-- 数智积分（用户） -->
				<view class="digital_subsidy_box_item" @tap="go_urls('/digital_subsidy/web/index.php?m=view&a=integral_list&user_type=user&name='
            +datas.content.integral_user)" v-if="datas.content.integral_user_show">
					<view class="digital_subsidy_value">{{assets.user_digital_integral||'0'}}</view>
					<view class="digital_subsidy_label">{{assets.integral_user +'(用户)'}}</view>
				</view>

				<!-- 数智积分（商家） -->
				<view class="digital_subsidy_box_item" @tap="go_urls('/digital_subsidy/web/index.php?m=view&a=integral_list&user_type=merchant&name='
            +datas.content.integral_merchant)" v-if="datas.content.integral_merchant_show">
					<view class="digital_subsidy_value">{{assets.merchant_digital_integral||'0'}}</view>
					<view class="digital_subsidy_label">{{assets.integral_merchant +'(商家)'}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			datas: {
				type: Object,
				default: () => ({}),
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				monetary_unit: getApp().globalData.monetary_unit,
				http_host: this.vuex_apiUrl,
				total_currency: '',
				assets: {},
				json: {}
			}
		},
		methods: {
			get_user_assets() {
				const that = this;
				that.$common.requestData({
					url: '/digital_subsidy/web/index.php?m=user&a=get_user_assets&hidden=' + that.datas.content
						.hidden ?? '' + '&date=' + that.datas.content.hidden_date ?? '',
					data: {},
					needToken: true,
					method: 'POST',
				}).then(res => {
					if (res.errcode === 0) {
						console.log(" that.datas.content.dataset", that.datas.content);
						that.datas.content.hidden_status = res.data.hidden_status;
						that.assets = res.data;
						that.assets.integral_user = res.data.integral_name || "";
						that.assets.integral_merchant = res.data.integral_name || "";
						that.json = JSON.stringify(res.data);
					}
				})
			},
			go_urls(url) {
				var that = this;
				console.log('go_urls', url);
				if (url == "") {
					return;
				}
				that.$common.diyLinkJump(url, 'h5', true, '', '');
			}
		},
		created() {
			this.http_host = this.vuex_apiUrl
			this.get_user_assets();
		}
	}
</script>

<style scoped>
	.digital_subsidy_content {
		background-size: 100% 100%;
		background-color: transparent;
		background-repeat: no-repeat;
		height: 100%;
		width: 100%;
		border-radius: 0px;
		padding-top: 5px;
	}

	/* 全部累计收益 */
	.total_reward {
		background-color: transparent;
		padding: 5px 10px;
		color: #fff;
		font-weight: 600;
		display: flex;
		align-items: center;
	}

	.total_reward image {
		width: 16px;
		height: 16px;
		margin: 0 8px;
	}

	/* 资产数据 */
	.digital_subsidy_box {
		background-color: transparent;
		display: flex;
		align-items: center;
		padding: 10px 10px 15px;
		border-radius: 15px;
		text-align: center;
	}

	.digital_subsidy_box_item {
		border: none;
		flex: 1;
		text-align: center;
	}

	.digital_subsidy_value {
		color: #fff;
		font-weight: 600;
		font-size: 18px;
	}

	.digital_subsidy_label {
		font-weight: 400;
		font-size: 14px;
		color: #999999;
		line-height: 20px;
	}
</style>