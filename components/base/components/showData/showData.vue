<template>
	<!--展示数据-->
	<view class='showdata-box'
		:style="'padding: '+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px '+(datas.content.style==1?0:10)+'px '+(datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px;'">
		<!--样式一-->
		<block v-if="datas.content.css_type == 1">
			<view class="showdata-wrap"
				:style="'background-color:'+(datas.content.bg_color)+';'+'border-radius: '+(datas.content.style==1?0:10)+'px;'">
				<block v-for="(item,index) in datas.content.dataset">
					<!--每行显示3个或4个-->
					<view class='showdata-item ' v-if="index < datas.content.data_num"
						:style="'width:calc(1/'+datas.content.dataset.length+'*100%)'">

						<text :style="'color:'+item.color1" class='data-num'
							@click="$common.diyLinkJump(item.link)">{{number[index]}}</text>
						<text :style="'color:'+item.color">{{item.title}}</text>
						</navigator>
					</view>
				</block>
			</view>
		</block>
		<!--样式二-->
		<block v-else>
			<view class="showdata-wrap2"
				:style="'background-color:'+(datas.content.bg_color)+';'+'border-radius: '+(datas.content.style==1?0:10)+'px;'">
				<block v-for="(item,index) in datas.content.dataset">
					<!--每行显示3个或4个-->
					<view v-if="index < datas.content.data_num" class='showdata-item'>
						<image class='item-image' :src='item.pic' @click="$common.diyLinkJump(item.link)"></image>
						<text :style="'color:'+item.color">{{item.title}}</text>
						<text :style="'color:'+item.color1" class='data-num'>{{number[index]}}</text>

					</view>
				</block>
			</view>

		</block>
	</view>
</template>

<script>
	import common from '@/utils/common.js'
	export default {
		name: "showData",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				number: [],
				property: [],
				sign_num: "",
				foot_num: "",
				collect_num: "",
				zeng_num: "",
				score_people: "",
				money_mode_key: "",
				coupon_num: "", // 优惠券数量
				consume_allowance_jf: "" //全民补贴应用-用户积分
			};
		},
		created: function() {
			var _this = this;
			_this.get_user_property()
			_this.sign_fun();
			_this.count_collection();
			_this.foot_fun();
			_this.user_collection();
			_this.get_score_people_count();
			_this.coupon_fun();
			_this.get_data_show_url();

			uni.$on('onShow', () => {
				console.log("组件的onshow")
				_this.get_user_property()
				_this.sign_fun();
				_this.count_collection();
				_this.foot_fun();
				_this.user_collection();
				_this.get_score_people_count();
				_this.coupon_fun();
				_this.get_data_show_url();
			})
			
		},
		methods: {
			//获取零钱 购物币 积分
			list_foreach: function(i='',num='') {
				var _this = this;
				if(i === '' || i === undefined || i === null){
					for (var i = 0; i < _this.datas.content.dataset.length; i++) {
						if (_this.datas.content.dataset[i].select_value == '零钱') {
							//获取零钱
							_this.number[i] = _this.property.pocket_money
						} else if (_this.datas.content.dataset[i].select_value == '积分') {
							//获取会员积分
							_this.number[i] = _this.property.integral
					
						} else if (_this.datas.content.dataset[i].select_value == '购物币' || _this.datas.content.dataset[i]
							.select_value == '购物券') {
							//获取购物币
							_this.number[i] = _this.property.currency
					
						} else if (_this.datas.content.dataset[i].select_value == '我的赠送') {
							//获取我的赠送
							_this.number[i] = _this.zeng_num
					
						} else if (_this.datas.content.dataset[i].select_value == '收藏') {
							//获取我的收藏
							_this.number[i] = _this.collect_num
					
						} else if (_this.datas.content.dataset[i].select_value == '签到') {
							//获取我的签到
							_this.number[i] = _this.sign_num
					
						} else if (_this.datas.content.dataset[i].select_value == '足迹') {
							//获取我的足迹
							_this.number[i] = _this.foot_num
					
						} else if (_this.datas.content.dataset[i].select_value == '贡献分') {
							//获取贡献分
							_this.number[i] = _this.score_people
					
						} else if (_this.datas.content.dataset[i].select_value == '优惠券') {
							//获取优惠券数量
							_this.number[i] = _this.coupon_num
					
						}
					}
				}else{
					_this.number[i] = num;
				}
			
				_this.$forceUpdate()
			},
			get_user_property: function(i) {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id
				};
				this.$api.getUserProperty2(params).then(res => {
					if (res.errcode == 0) {
						_this.property = res.data
						_this.list_foreach();
					} else {
						console.log('获取资产信息')
					}
				})
			},

			//获取我的赠送
			user_collection: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id,
					type: 1,
					is_count: 1,
					change_type: 'daily_bonus'
				};
				this.$api.integralDetail(params).then(res => {
					if (res.errcode == 0) {
						_this.zeng_num = res.data
						_this.list_foreach();
					} else {
						console.log('获取资产信息')
					}
				})
			},
			//获取我的收藏
			count_collection: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id,
					c_type: 'goods'
				};
				this.$api.countCollection(params).then(res => {
					if (res.errcode == 0) {
						_this.collect_num = res.count
						_this.list_foreach();
					} else {
						console.log('获取资产信息')
					}
				})
			},
			//获取签到
			sign_fun: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id,
					type: 1,
					is_count: 1,
					change_type: 'daily_bonus',
				};
				this.$api.integralDetail(params).then(res => {
					if (res.errcode == 0) {
						_this.sign_num = res.data
						_this.list_foreach();
					} else {
						console.log('获取签到')
					}
				})
			},
			//获取足迹
			foot_fun: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id
				};
				this.$api.getFootprintCounts(params).then(res => {
					if (res.errcode == 0) {
						_this.foot_num = res.data.total
						_this.list_foreach();
					} else {
						console.log('获取足迹')
					}
				})
			},
			//获取贡献分
			get_score_people_count: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id,
					money_mode_key: _this.money_mode_key
				};
				this.$api.getScorePeopleCount(params).then(res => {
					if (res.errcode == 0) {
						_this.score_people = res.data.total_score
						_this.list_foreach();
					} else if (res.errcode == 100) {
						_this.money_mode_key = res.money_mode_key
						setTimeout(function() {
							_this.get_score_people_count()
						}, 2000)
					} else {
						_this.score_people = 0
					}
				})
			},
			//获取优惠券数量
			coupon_fun: function() {
				var _this = this;
				var params = {
					'user_id': this.vuex_user.user_id,
				};
				this.$api.getCouponCounts(params).then(res => {
					if (res.errcode == 0) {
						if (res.data) {
							_this.coupon_num = res.data.no_use_num,
								_this.list_foreach();
						}

					} else {
						console.log('获取签到')
					}
				})
			},
			get_data_show_url() {
				const _this = this;
				for (var i = 0; i < _this.datas.content.dataset.length; i++) {
					if (_this.datas.content.dataset[i].data_show_url != undefined && _this.datas.content.dataset[i]
						.data_show_url) {
							let index = i;;
						_this.$common.requestData({
							url: _this.datas.content.dataset[i].data_show_url,
							data: {},
							method: 'POST',
							needToken: true
						}).then(res => {
							console.log(res.data)
							if (res.errcode == 0) {
								// _this.number[i] = res.data.num
								_this.list_foreach(index,res.data.num);
							}else{
								// _this.number[i] = 0.00
								_this.list_foreach(index,'0.00');
							}
						})
					}
				}
			}
		}
	}
</script>

<style>
	.no-hover {
		background-color: transparent
	}

	.showdata-box {
		width: 100%;
		padding-left: 10px;
		padding-right: 10px;
		box-sizing: border-box
	}

	.showdata-box navigator {
		display: block;
		width: 100%;
		height: auto;
		text-align: center
	}

	.showdata-wrap {
		width: 100%;
		display: flex;
		background: #fff;
		/* border-radius: 16px; */
		padding: 15px 0;
	}

	.showdata-wrap .showdata-item {
		margin: 20rpx 0;
		flex: 1;
		position: relative
	}

	.showdata-wrap image {
		width: 100rpx;
		height: 100rpx
	}

	.showdata-wrap text {
		line-height: 24px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
		text-align: center;
		font-size: 13px;
		color: #5d5d5d;
		max-width: 97%
	}

	.showdata-wrap text.data-num {
		font-size: 16px;
		line-height: 54rpx;
		height: 54rpx;
		width: 100%;
	}

	.showdata-wrap2 {
		background-color: #FFF;
		border-radius: 8px;
	}

	.showdata-wrap2 .showdata-item {
		display: block;
		padding: 13.5px 30px 13.5px 15px;
		overflow: hidden;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
		background-size: auto 14px;
		background-repeat: no-repeat;
		background-position: right 15px center;
	}

	.showdata-wrap2 .showdata-item navigator {
		width: 100%;
		height: 100%;
		text-align: left;
		position: relative;
	}

	.showdata-wrap2 .showdata-item navigator image {
		width: 28px;
		height: 28px;

		margin-right: 10px;
		display: inline-block;
		vertical-align: middle;

	}

	.showdata-wrap2 .showdata-item navigator text {
		display: inline-block;
		width: calc(100% - 90rpx);
		vertical-align: middle
	}

	.showdata-wrap2 .funtion-jt {
		width: 18rpx;
		height: 18rpx;
		border-top: 1px solid #ccc;
		border-right: 1px solid #ccc;
		transform: rotate(45deg);
		position: absolute;
		right: 27rpx;
		top: 16rpx
	}

	.showdata-wrap2 .showdata-item navigator .data-num {
		position: absolute;
		right: 45rpx;
		font-size: 15px;
		display: inline-block;
		width: 200rpx;
		border: 0;
		text-align: right;

	}
</style>