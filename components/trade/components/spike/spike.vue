<template>
	<!--components/trade/components/spike/spike.wxml-->
	<view style="background:#F7F7F7;">

		<view class="top_tab" v-if="tabList.length>1">
			<view class="img_">
				<image class="logo" :src="self_img"></image>
			</view>
			<scroll-view scroll-x="true" class="tab-h" :scroll-left="scrollLeft">
				<view v-for="(items,indexs) in tabList" class="tab-item" :data-current="indexs" @click="swichNav">
					<view :class="'zhu_title '+(currentTab==indexs?'active':'')">
						{{items.name}}
					</view>
					<view :class="'fu_title '+(currentTab==indexs?'active':'')">
						<view>
							{{items.title}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view v-if="isEnd&&tabList.length>1" class="spike_status">活动已结束</view>
		<view v-if="!isEnd&&tabList.length>0" class="spike_status">{{text}}<text class="tiem">{{timelist[0]}}</text>时<text class="tiem">{{timelist[1]}}</text>分<text class="tiem">{{timelist[2]}}</text>秒</view>
		<swiper class="tab-content" :current="currentTab" duration="300" @change="switchTab"
			:style="'height:'+winHeight+'rpx;'">
			<swiper-item v-for="(items,indexs1) in tabList">
				<scroll-view scroll-y="true" class="scoll-h">
					<block v-for="(item,indexs) in goodsList">
						<view class="item-ans" :data-pro_id="item.id"
							:data-shop_pro_id="item.shop_product_id" :data-is_sale_out="item.is_sale_out">
							<view class="avatar"  @click="detailsClick(item.id,item.shop_product_id,item.is_sale_out)">
								<view class="end_status" v-if="activity_status == 3">已结束</view>
								<view class="end_status" v-if="item.is_sale_out && activity_status == 2">已抢完</view>
								<image class="img" :src="item.img_url"></image>
							</view>
							<view class="expertInfo">
								<view class="name"  @click="detailsClick(item.id,item.shop_product_id,item.is_sale_out)">{{item.product_name}}</view>
								<!-- 新进度条 -->
								<view class="jindu_"  @click="detailsClick(item.id,item.shop_product_id,item.is_sale_out)" v-if="activity_status==2">
									<view class="jindu_content">
										<view class="ren_count" v-if="!item.is_sale_out">{{item.sales_show}}人</view>
										<view class="all_null" v-if="item.is_sale_out">已抢完</view>
										<view class="jindu_s" v-if="!item.is_sale_out"
											:style="'width:'+item.progress1+';'"></view>
									</view>
									<view style="color:#F93D3B;font-size:18rpx;">{{item.progress}}</view>
								</view>
								<view class="answerHistory"  >
									<view class="price_" @click="detailsClick(item.id,item.shop_product_id,item.is_sale_out)">
										<view class="price"><text class="price_b">{{monetary_unit}}</text><text
												class="price_a">{{item.show_price_int}}</text><text
												class="price_b">{{item.show_price_decimal}}</text></view>
										<view class="f_price">{{monetary_unit}}{{item.orgin_price}}</view>
									</view>
									<view class="button_">
										<view class="btn_button button_s"  @click="detailsClick(item.id,item.shop_product_id,item.is_sale_out)"
											v-if="activity_status == 2 && !item.is_sale_out">立即抢</view>
										<view class="btn_button1 button_s"  @click="detailsClick(item.id,item.shop_product_id,item.is_sale_out)"
											v-if="(activity_status == 2 && item.is_sale_out) || activity_status == 3">
											去看看</view>
										<view class="btn_button2" @click="isTiButton(indexs)"
											style="background: linear-gradient(to right, #05DF67, #01CB7B);"
											v-if="activity_status == 1 && !item.is_set_remind">
											<view class="button2_title" style="font-size:26rpx;">提醒我</view>
											<view class="button2_title" style="font-size:20rpx;">{{item.remind_num}}人已设置
											</view>
										</view>
										<view class="btn_button2" style="border:2rpx solid #01CB7B;color:#01CB7B;"
											v-if="activity_status == 1 && item.is_set_remind" @click="cancelReminder(item.id,indexs)">
											<view class="button2_title" style="font-size:26rpx;">已设置</view>
											<view class="button2_title" style="font-size:20rpx;">{{item.remind_num}}人已设置
											</view>
										</view>
									</view>
								</view>
							</view>
							<view  style="clear: both;"></view>
						</view>
					</block>
				</scroll-view>
			</swiper-item>

		</swiper>
		<!-- 9/21 -->
		<view class="bottom_tag" @click="allClick" :style="goodsList.length>=5?'border-top:none;':'border-top: 2rpx solid #f5f5f5;'">查看全部</view>

	</view>
</template>

<script>
	export default {
		name: "spike",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				monetary_unit: getApp().globalData.monetary_unit, // 货币符号
				http_host: getApp().globalData.http_host,
				tabList: [],
				winHeight: "", //窗口高度
				currentTab: 0, //预设当前项的值
				scrollLeft: 0, //tab标题的滚动条位置
				goodsList: [], //测试数据
				page_num: 1, //当前页数
				sort: '',
				min_price: 0,
				max_price: 0,
				name: '',
				type: '',
				preferential: [],
				str_tiem: '', //活动开始时间
				end_tiem: '', //活动结束时间
				activity_status: '', //判断显示按钮
				text: '', //显示距开始，距结束
				isEnd: false, //是否显示已结束
				count_down: '', //计时器
				timelist: [], //倒计时数组
				show_num: '', //显示商品的数量
				activity_id: '', //单个活动id
				self_img: '', //活动图片
			};
		},
		created() {
			var that = this;
			that.getTabList()
			console.log(that.datas)
			// 9/29
			if (that.datas.content.self_img.indexOf("resources//") != -1) {
				that.datas.content.self_img = that.datas.content.self_img.replace('resources//', '')
			}
			that.self_img = that.datas.content.self_img
			// 9/29end
		},
		methods: {
			// 滚动切换标签样式
			switchTab: function(e) {
				// console.log('滑动了', e.detail.current, e);
				var currentTab = e.detail.current
				this.currentTab = currentTab
				this.checkCor();
				this.getTabList()
			},
			// 点击标题切换当前页时改变样式
			swichNav: function(e) {
				console.log('拿到的数据', e);
				var cur = e.currentTarget.dataset.current
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur
					this.getTabList()
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				if (this.currentTab >= 3) {
					this.scrollLeft = 300
				} else if (this.currentTab >= 7) {
					this.scrollLeft = 600
				} else {
					this.scrollLeft = 0
				}
			},
			pageloadPost: function(activity_id, show_num) {
				var that = this;
				console.log('颜色', that.activeColor);
				var data = []
				var _data = {};
				var request_data = {};
				request_data = {
					activity_id: activity_id,
					show_num: show_num ? show_num : 0
				}

				that.$common.requestData({
					url: '/seckill/web/index.php?m=activity&a=get_template_activity_detail',
					data: request_data,
					method: 'POST',
					needToken: true
				}).then(res => {
					console.log('获取活动详情',res)
					if (res.errcode == 0) {
						// console.log('格式化', parseInt(res.data[0].progress))
						if (res.data) {
							res.data.forEach(el => {
								// el.progress1 = parseInt(el.progress)
								if (el.remind_num >= 10000) {
									el.remind_num = Math.round((el.remind_num / 10000) * 100) / 10 +
										'w';
								}
								// 9/24
								if (Number(el.progress.replace("%", "")) < 9.99 && Number(el.progress
										.replace("%", "")) > 0) {
									el.progress1 = '10%'
								} else {
									el.progress1 = el.progress
								}
								// 9/24end
								data.push(el)
							})
						}
						//  高度自适应
						var calc = 239.5 * res.data.length
						that.goodsList = data,
							that.winHeight = calc
					}
				})
			},
			// 获取头部列表数据
			getTabList() {
				// 获取头部活动列表
				var that = this
				var ids = ""
				var activity_id = ""
				var show_num = ""
				that.datas.content.add_data.forEach(function(item1, index) {
					ids += item1.selector_id + ","
				})
				console.log(ids)
				// 去掉最后一个逗号
				if (ids.length > 0) {
					ids = ids.substr(0, ids.length - 1);
				}
				var _data = {};
				var request_data = {};
				request_data = {
					activity_ids: ids
				}

				that.$common.requestData({
					url: '/seckill/web/index.php?m=activity&a=get_template_activity_list',
					data: request_data,
					method: 'POST',
					needToken: true
				}).then(res => {
					console.log(res)
					if (res.errcode == 0) {
						console.log('头部数据', res.data)
						that.str_tiem = res.data[that.currentTab].activity_begin_time //开始时间
						that.end_tiem = res.data[that.currentTab].activity_end_time //结束时间
						activity_id = res.data[that.currentTab].id; //单个活动id
						console.log('活动组', that.datas.content.add_data);
						// 9/26
						that.datas.content.add_data.forEach(el => {
							if (el.selector_id == activity_id) {
								show_num = el.goods_count
								return
							}
						})
						// 9/26end
						// show_num = that.data.data.content.add_data[that.data.currentTab].goods_count//显示的商品数量

						that.tabList = res.data,
						that.str_tiem = that.str_tiem, //活动开始时间
						that.end_tiem = that.end_tiem, //活动开始时间
						that.show_num = show_num, //显示的数量
						that.activity_id = activity_id
						that.setTime()
						that.pageloadPost(activity_id, show_num)
					}
				})

			},
			// 倒计时方法
			updateEndTime() {
				var that = this
				// 开始时间
				var start_ = new Date(Date.parse(that.str_tiem.replace(/-/g, "/"))).getTime()
				// 结束时间
				var end_ = new Date(Date.parse(that.end_tiem.replace(/-/g, "/"))).getTime()
				// console.log('开始时间',start_)
				// console.log('结束时间',end_)
				// 当前时间
				var date = new Date().getTime()
				// console.log('当前时间',date)
				var lag = ''
				var html = '距结束'
				that.activity_status = 2
				if (start_ > date) {
					end_ = start_ // 如果开始时间大于当前时间，结束时间等于当前时间
					html = '距开始'
					that.activity_status = 1
				}
				lag = end_ - date //计算时间差
				// console.log('lag',lag)
				if (lag > 0) {
					var second = Math.floor(lag / (1000 * 60 * 60 * 24)); //计算天数
					var minite = Math.floor(lag / (60 * 60 * 1000)); //计算小时数
					var hour = Math.floor((lag - minite * 60 * 60 * 1000) / (60 * 1000)); //计算分钟数
					var day = Math.floor((lag - minite * 60 * 60 * 1000 - hour * 60 * 1000) / 1000); //计算秒
					// 计算是否补0
					second = second < 10 ? "0" + second : second
					minite = minite < 10 ? "0" + minite : minite
					hour = hour < 10 ? "0" + hour : hour
					day = day < 10 ? "0" + day : day

					that.text = html
					// console.log('text',that.text)
					that.isEnd = false


				} else {

					that.activity_status = 3
					that.isEnd = true
					clearInterval(that.count_down); //清除倒计时

				}
				// that.isEnd = that.isEnd,
				// 	that.text = that.text,
				// 	that.activity_status = that.activity_status
				// console.log('倒计时',minite, hour, day,start_,end_);
				// console.log('minite',minite,hour,day)
				return [minite, hour, day]
			},
			// 开启倒计时8/29
			setTime() {
				var _this = this
				_this.count_down = setInterval(() => {
					_this.timelist = _this.updateEndTime()
					// console.log('时间数组',_this.timelist);
				}, 1000);
			},
			// 点击提醒
			isTiButton(index) {
				var that = this
				var _data = {},
					request_data = {
						activity_id: that.activity_id,
						activity_product_id: that.goodsList[index].id

					}

				that.$common.requestData({
					url: '/seckill/web/index.php?m=activity&a=set_reminder',
					data: request_data,
					method: 'POST',
					needToken: true
				}).then(res => {
					console.log(res)
					if (res.errcode == 0) {
						uni.showToast({
							title: '提前3分钟提醒',
							icon: 'none',
							duration: 2000
						})
						that.goodsList[index].remind_num = res.data.now_remind_num
						that.goodsList[index].is_set_remind = true
						that.goodsList = that.goodsList
					} else {
						uni.showToast({
							title: 系统繁忙,
							icon: 'none',
							duration: 2000
						})
					}
				})

			},
			//取消提醒
			cancelReminder: function(activity_product_id,index) {
				var that = this
				var activity_id = that.activity_id;
				var _data = {};

				that.$common.requestData({
					url: '/seckill/web/index.php?m=activity&a=cancel_reminder',
					data: {
						'activity_id': activity_id,
						'activity_product_id': activity_product_id
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					uni.showToast({
						title: res.errmsg,
						icon: 'none',
						duration: 2000,
					})
					if (res.errcode != 0) {
						return false;
					}

					var new_data = that.goodsList;
					new_data[index].is_set_remind = false;
					new_data[index].remind_num = res.data.now_remind_num;

					that.goodsList = new_data
				})

			},
			// 跳转到商品详情页
			detailsClick(pro_id,shop_product_id,is_sale_out) {
				var self = this;
				// var pro_id = e.currentTarget.dataset.pro_id
				// var shop_product_id = e.currentTarget.dataset.shop_pro_id
				// 9/23
				// var is_sale_out = e.currentTarget.dataset.is_sale_out
				if (self.activity_status == 3 || is_sale_out == 1) {
					// wx.navigateTo({
					// 	url: '/shop/pages/goodsDetail/goodsDetail?id=' + shop_product_id,
					// })
					console.log('跳转至商品详情页面')
					var url = "/seckill/web/index.php?m=activity&a=activity_product_detail&id="+pro_id+'&customer_id='+this.vuex_customer_id+'&xdebug=xdebug'
					this.$common.diyLinkJump(url,"h5",true);
				} else {
					var url = "/seckill/web/index.php?m=activity&a=activity_product_detail&id="+pro_id+'&customer_id='+this.vuex_customer_id+'&xdebug=xdebug'
					
					this.$common.diyLinkJump(url,"h5",true);
			  // wx.navigateTo({
					// 	url: '/seckill/pages/product/productDetails?id=' + pro_id,
					// })
				}
			},
			// 9/21点击查看全部
			allClick: function() {
				// wx.navigateTo({
				// 	url: '/seckill/pages/spikelist/spikelist',
				// })
				var url = "/seckill/web/index.php?m=activity&a=activity_list"+'&customer_id='+this.vuex_customer_id+'&xdebug=xdebug'
				this.$common.diyLinkJump(url,"h5",true);
			}
		}
	}
</script>

<style>
	/* components/trade/components/spike/spike.wxss */

	.logo {
		max-width: 68rpx;
		max-height: 68rpx;
	}

	.img_ {
		display: flex;
		align-items: center;
		position: absolute;
		left: 18rpx;
		/* 10/12 */
		z-index: 99;
		width: 95rpx;
		background: #fff;
		height: 84rpx;
		justify-content: center;
	}

	.top_tab {
		display: flex;
		padding: 10rpx 0;
		background: #fff;
		position: relative;
	}

	/* 9/29 */
	.top_tab .zhu_title {
		color: #333333;
		font-size: 26rpx;
		/* width: 116rpx;
    overflow: hidden;
    white-space: nowrap; */
		/* font-weight: 600; */
		/* text-align: center; */
	}

	.top_tab .fu_title {
		color: #999999;
		font-size: 22rpx;
		/* width: 116rpx;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    display: flex;
    justify-content: center; */
	}

	/* .top_tab .fu_title view {
    width: 110rpx;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
} */

	.top_tab view {
		text-align: center;
		padding: 0 8rpx;
	}

	.spike_status {
		padding: 20rpx 0;
		text-align: center;
		color: #333333;
		font-size: 24rpx;
		background: #F7F7F7;
		letter-spacing: 4rpx;

	}

	.tiem {
		color: #F93D3B;
		font-size: 28rpx;
	}

	.tab-h {

		width: 100%;
		box-sizing: border-box;
		overflow: hidden;

		font-size: 16px;
		white-space: nowrap;

		z-index: 99;
		margin-left: 120rpx;
	}

	/* 10/7 */
	::-webkit-scrollbar {
		width: 0px;
		height: 0px;
		/*10/7*/
		background-color: transparent;
		display: none;
		color: transparent;
	}

	/* 10/7end */
	.tab-item {
		/* margin: 0 20rpx; */
		display: inline-block;
	}

	.tab-item .active {
		color: #F93E3B;
		position: relative;
	}

	/* 商品列表 */
	.item-ans {
		width: 100%;
		padding: 30rpx 18rpx;
		box-sizing: border-box;
		background: #fff;
		/* 10/12 */
		/* border-radius: 20rpx; */
		position: relative;
		/* 10/7 */
		display: flex;
		align-items: center;


	}

	.avatar {
		/* 10/7 */
		width: 182rpx;
		height: 182rpx;
		margin-right: 26rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.end_status {
		position: absolute;
		z-index: 99;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		font-weight: 600;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: #333333;
		opacity: 0.65;
	}

	.avatar .img {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}

	.expertInfo {
		font-size: 12px;
		flex-grow: 2;
		color: #B0B0B0;
		line-height: 1.5em;
		/* width: 72%; */
		/* 10/7 */
		flex: 1;

	}

	.expertInfo .name {
		font-size: 26rpx;
		color: #333333;
		margin-bottom: 6px;
		width: 100%;
		overflow: hidden;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;

	}

	.scoll-h {
		height: 100%;
	}

	.price .price_b {
		font-size: 24rpx;
	}

	.price {
		color: #F24F4C;
		font-size: 28rpx;
	}

	.f_price {
		font-size: 22rpx;
		color: #999999;
		text-decoration: line-through;
		margin-left: 10rpx;
	}

	.answerHistory {
		display: flex;
		align-items: flex-end;
		width: 100%;
	}

	.price_ {
		display: flex;
		align-items: flex-end;
		width: 73%;
	}

	.btn_button {
		background: linear-gradient(to right, #FF154D, #FF4300);
		color: #fff;
	}

	.btn_button1 {
		border: 2rpx solid #F93D3B;
		color: #FF2E23;
	}

	.button_s {
		width: 128rpx;
		/* 9/14 */
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
		letter-spacing: 4rpx;
		font-size: 26rpx;
	}

	.btn_button2 {
		color: #fff;
		text-align: center;
		border-radius: 10rpx;
		width: 158rpx;
		padding: 10rpx 0;
	}

	.progress-box {
		margin: 20rpx 0;
		width: 50%;
		color: #F93D3B;
		position: relative;

	}

	.progress-box .tag {
		color: #fff;
		font-size: 20rpx;
		position: absolute;
		top: 0;
		left: 10rpx;
	}

	.bottom_tag {
		color: #333333;
		font-size: 24rpx;
		text-align: center;
		background: #fff;
		margin-bottom: 20rpx;
		padding: 20rpx 0;
	}

	.bg_img {
		height: 30rpx;
		width: 200rpx;
		position: absolute;
		top: 0;
		left: 0;
	}

	/* 商品列表end */
	.left {
		float: left;
	}

	.right {
		float: right;
	}

	/* 新进度条 */
	.jindu_ {
		position: relative;
		display: flex;
		align-items: center;
	}

	.jindu_ .jindu_content {
		position: relative;
		background: #FFCDC7;
		border-radius: 40rpx;
		margin-right: 6rpx;
		width: 230rpx;
		height: 28rpx;
		color: #fff;
		font-size: 18rpx;

	}

	.jindu_ .jindu_s {
		border-radius: 40rpx;
		background: #FE264D;
		background-image: linear-gradient(133deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
		-webkit-background-size: 22rpx 20rpx;
		background-size: 22rpx 20rpx;
		height: 100%;
	}

	.jindu_ .ren_count {
		position: absolute;
		/* top: 0; */
		left: 10rpx;
		/* 9/24 */
		height: 28rpx;
		display: flex;
		align-items: center;
	}

	.jindu_ .all_null {
		position: absolute;
		/* top: -3rpx; */
		left: 90rpx;
		font-size: 20rpx;
		/* 9/24 */
		height: 28rpx;
		display: flex;
		align-items: center;
	}
</style>
