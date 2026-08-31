<template>
	<view
		:style="'padding:'+datas.content.padding_top?datas.content.padding_top:content.padding+'px '+datas.content.style==1?0:10+'px '+datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding+'px;'">
		<view class="card">
			<view class="title">
				{{datas.content.li_title}}
			</view>
			<view class="content">
				<view class="box" v-for="item in list">
					<view @click="$common.diyLinkJump(item.link)">
						<view class="num">
							{{item.num}}
						</view>
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
		name: "hapinlineAssets",
		props: {
			datas: {
				type: Object,
				default: {},
				content:{},
			},
		},
		data() {
			return {
				list: [],
				http_host: ''
			};
		},
		created() {
			var that = this
			this.http_host = this.vuex_apiUrl;
			that.getAssets();
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
							// url: 'https://develop.dongguanhongyun.com/hapinline/web/index.php?m=user&a=get_member&customer_id=1755',
							data: params,
							method: "POST",
							needToken: true
						}).then(res => { 
								for (let i = 0; i <= _this.datas.content.dataset.length - 1; i++) {
									if (_this.datas.content.dataset[i].pic ==  _this.http_host+'/resources/1') {
										_this.datas.content.dataset[i].link=_this.datas.content.dataset[i].num+"&customer_id="+_this.vuex_customer_id_en
										_this.datas.content.dataset[i].num = res.data.user_currency;
									}
									if (_this.datas.content.dataset[i].pic == _this.http_host+'/resources/2') {
										_this.datas.content.dataset[i].link=_this.datas.content.dataset[i].num+"&customer_id="+_this.vuex_customer_id_en
										_this.datas.content.dataset[i].num = res.data.user_money;
									}
									if (_this.datas.content.dataset[i].pic == _this.http_host+'/resources/3') {
										_this.datas.content.dataset[i].link=_this.datas.content.dataset[i].num+"&customer_id="+_this.vuex_customer_id_en
										_this.datas.content.dataset[i].num = res.data.integral;
									}
									if (_this.datas.content.dataset[i].pic == _this.http_host+'/resources/4') {
										_this.datas.content.dataset[i].link=_this.datas.content.dataset[i].num
										_this.datas.content.dataset[i].num = res.data.yuebao_num;
									}
								}
								_this.list= _this.datas.content.dataset;
						})
			},
		}
	}
</script>

<style>
	.card {
		width: 686rpx;
		padding: 16rpx 20rpx;
		box-sizing: border-box;
		margin: 0 auto;
		border-radius: 20rpx;
		background-color: #fff;
	}

	.title {
		font-size: 28rpx;
		font-family: PingFangSC-Medium, "PingFang SC";
		font-weight: 500;
		color: rgb(82, 82, 82);
		margin-bottom: 30rpx;
	}

	.content {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	.box {
		width: 25%;
		text-align: center;
	}

	.num {
		font-size: 32rpx;
		font-family: PingFangSC-Medium, "PingFang SC";
		font-weight: 500;
		color: rgb(127, 138, 239);
		text-align: center;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.name {
		font-size: 28rpx;
		font-family: PingFangSC-Medium, "PingFang SC";
		font-weight: 500;
		color: rgb(82, 82, 82);
	}
</style>
