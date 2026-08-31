<template>
	<!--商品分组start-->
	<view id="main-id"
		:style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+');background-repeat: round;':'none')+';padding: '+datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom+'px;'">
		<view class="shop_group_container new_shop_group" v-if="datas.content.dataset.length > 0">
			<view class="shop_group_title" v-if="datas.content.select_style==1" :style="'width: calc(100% + '+(!datas.content.type?datas.content.padding_horizontal*2:0)+'px);left:-'
				+(!datas.content.type?datas.content.padding_horizontal:0)+'px;'">

				<view class="shop_group_box display-flex"
					:style="'background-color: '+(!datas.content.type?'#fff':'')+';'">

					<view class="shop_group_list flex-1">
						<li style="width:auto;" v-for="(itm, index) in datas.content.dataset" :key="index"
							:style="getItemStyle(index)" @click="tab_nav(itm,index)" :ref="'tabItem' + index">
							<span :style="getSpanStyle(index)">
								{{ itm.shop_source === 2 ? (itm.group_name || itm.option_title) : (itm.option_title || itm.group_name) }}
							</span>
							<p class="line" :style="getLineStyle(index)"></p>
						</li>
					</view>
					<view class="shop_group_sort" @click="tab_type()" :class="{'rotate':!datas.content.type}">
						<img :src="http_host+'/HTML/admui/public/custom/images/icon_jian_bottom.png'" alt="">
					</view>
				</view>
				<view v-if="!datas.content.type" class="shop_group_box shop_group_box_btn">
					<view class="shop_group_data">
						<li v-for="(itm,index) in  datas.content.dataset"
							:class="{'active haf-skin-bg skin-color':datas.content.nav_index === index}"
							@click="tab_nav(itm,index)" :ref="'tabItem' + index">
							{{itm.shop_source==2?(itm.group_name?itm.group_name:itm.option_title):(itm.option_title?itm.option_title:itm.group_name)}}
						</li>
					</view>
				</view>

			</view>

			<view class="shop_group_title shop_group_title-type2" v-if="datas.content.select_style==2">
				<view class="shop_group_box" id="tab-list">
					<view class="shop_group_list">
						<li style="width:auto;" v-for="(itm,index) in  datas.content.time_list"
							@click="tab_nav(itm,index)" :ref="'tabItem' + index">

							<span
								:style="'color: '+(datas.content.nav_index===index?datas.content.prm_font_color:datas.content.unprm_font_color)+';'">
								{{!itm.title?itm.group_name:itm.title}}
							</span>
							<view class="vice_title flex-def flex-cCenter flex-zCenter">
								<span :style="{
								    color: datas.content.nav_index === index ? datas.content.sub_font_color : datas.content.unsub_font_color,
								    backgroundColor: datas.content.sub_select_bg_type == 1 && datas.content.nav_index === index 
								      ? datas.content.sub_select_bg_color 
								      : 'transparent',
								    backgroundImage: datas.content.sub_select_bg_type == 2 && datas.content.nav_index === index 
								      ? `linear-gradient(${datas.content.sub_select_bg_angle}, ${datas.content.sub_select_bg_color1}, ${datas.content.sub_select_bg_color2})` 
								      : 'none'
								  }" :class="{'active': datas.content.nav_index === index}">
									{{itm.vice_title}}
								</span>
							</view>

						</li>
					</view>
				</view>
			</view>

			<view v-if="!datas.content.type" @click="tab_type()" class="svod-mask"
				:style="'width: calc(100% + '+(!datas.content.type?datas.content.padding_horizontal*2:0)+'px);left: -'+(!datas.content.type?datas.content.padding_horizontal:0)+'px;'">
			</view>
			<view class="svod-body">
				<view v-if="loading" class="svod-loading">
					<u-loading-icon text="加载中" textSize="18"></u-loading-icon>
				</view>
				<view class="svod-content" v-if="goods_list.length > 0" id="goods-list">
				<scroll-view :style="{ height: base_height+'vh' }" scroll-y="true"
					:scroll-top="scrollTop" @scrolltolower="onScrolltolower" lower-threshold="50" @scroll="onScroll">
					<view class="display-flex">
						<view class="svod-ul-left svod-ul">
							<view :style="'border-radius:'+(!datas.content.radius_diy? 0:datas.content.radius_diy)+'px'" @click="goDetail(itm)" v-for="(itm,index) in goods_list" :data-index="index"
								v-if="(index + 1) % 2 != 0">
								<view class="svod-content-bg" :style="'border-radius:'+(!datas.content.radius_diy? 0:datas.content.radius_diy)+'px'">
									<view class="svod-img display-flex">
										<image style="height:334rpx;" :src="itm.pro_img"></image>
									</view>
								</view>
								<view class="goods_content">
									<view class="goods_name">{{itm.pro_name}}</view>
									
									<!-- 标签 -->
									<view class="goods_tag"
										v-if="itm.tagList&&itm.tagList.length>0&&datas.content.goods_tag==1">
										<view v-for="(item,idx) in itm.tagList"> <!--12/15-->
											<p>{{item}}</p>
										</view>
									</view>
									<view class="flex-def flex-cCenter flex-zBetween margin-top-5">
										<!--价格-->
										<view class="goods_price display-flex">
											<view>
												<span class="big">{{datas.content.show_monetary_unit}}</span>
												<span class="big_s">{{itm.price.split('.')[0]}}</span>
												<span class="big">.{{itm.price.split('.')[1]}}</span>
											</view>
										</view>
										<!--价格end-->
										<!--销量-->
										<view class="pro_count" v-if="datas.content.show_sale==1">{{itm.pro_count}}人付款
										</view>
										<!--销量end-->
									</view>
								</view>

							</view>
						</view>
						<view class="svod-ul-right svod-ul">
							<view :style="'border-radius:'+(!datas.content.radius_diy? 0:datas.content.radius_diy)+'px'" @click="goDetail(itm)" v-for="(itm,index) in goods_list" :data-index="index"
								v-if="(index + 1) % 2 == 0">
								<view class="svod-content-bg" :style="'border-radius:'+(!datas.content.radius_diy? 0:datas.content.radius_diy)+'px'">
									<view class="svod-img display-flex">
										<image style="height:334rpx;" :src="itm.pro_img"></image>
									</view>
								</view>
								<view class="goods_content">
									<view class="goods_name">{{itm.pro_name}}</view>
									
									<!-- 标签 -->
									<view class="goods_tag"
										v-if="itm.tagList&&itm.tagList.length>0&&datas.content.goods_tag==1">
										<view v-for="(item,idx) in itm.tagList"> <!--12/15-->
											<p>{{item}}</p>
										</view>
									</view>
									<view class="flex-def flex-cCenter flex-zBetween margin-top-5">
										<!--价格-->
									
										<view class="goods_price display-flex">
											<view>
												<span class="big">{{datas.content.show_monetary_unit}}</span>
												<span class="big_s">{{itm.price.split('.')[0]}}</span>
												<span class="big">.{{itm.price.split('.')[1]}}</span>
											</view>
										</view>
										<!--价格end-->
										<!--销量-->
										<view class="pro_count" v-if="datas.content.show_sale==1">{{itm.pro_count}}人付款
										</view>
										<!--销量end-->
									</view>
								</view>
							
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			</view>
		</view>
	</view>


</template>

<script>
	import empty from '../../../../uni_modules/uview-ui/libs/config/props/empty';

	export default {
		name: "newShopGroup",
		inject: {
			ScrollTop: {
				default: () => () => {} // 默认值为一个空函数
			}
		},
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				loading: false,
				scrollTop: 0,
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				monetary_unit: getApp().globalData.monetary_unit,
				goods_list: [], //商品数组
				scrollIntoViewId: '',
				now_group_id: 0, //分类id
				now_group_count: 10, //显示商品数量
				all_list: [], //总数组
				last_key: 0, //上次加载位置
				page: 1,
				page_size: 20, //每页多少数据
				total_count: 0, //总数据
				can_load: false, //是否可以加载 防止并发
				req_data: {},
				shop_source: 0,
				goods_count: 0,
				cycle_num: 20,
				all_num: 0,
				base_height: 30
			};
		},


		watch: {
			slider: {
				handler() {

				},
				deep: true
			}
		},
		created() {
			// console.log(this)
			this.http_host = this.vuex_apiUrl
			const _this = this;
			_this.now_group_id = _this.datas.content.dataset[0].selector_id.split('-')[0]
			_this.now_group_count = parseInt(_this.datas.content.dataset[0].goods_count)
			_this.get_goods(this.datas.content.dataset[0])
			_this.getHeight(_this.now_group_count)

		},
		mounted() {
			this.ScrollTop(this.toScrollTop);
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			toScrollTop() {
				this.scrollTop = this.oldscrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			},
			onScroll(e) {
				this.oldscrollTop = e.detail.scrollTop
			},
			scrollToLower() {
				console.log("组件内分页")
			},
			getHeight(num){
				if(num>0 && num<=2){
					this.base_height = 30
				} else if(num>2 && num<=4){
					this.base_height = 50
				} else{
					this.base_height = 70
				}
			},
			async tab_nav(itm, ind) {
				const that = this
				that.datas.content.pros = []
				that.datas.content.nav_index = ind
				that.datas.content.shop_page_size = 1
				that.datas.content.page = 1
				that.now_group_count = itm.goods_count
				that.getHeight(that.now_group_count)
				let index = ind - 1
				let left = 0
				const query = uni.createSelectorQuery();
				query.selectAll('.shop_group_list li').boundingClientRect(rects => {
					rects.forEach((rect, i) => {
						if (i < that.datas.content.nav_index && that.datas.content.nav_index > 0) {
							left += rect.width;
						}
					});
				}).exec();
				await that.get_goods(that.datas.content.dataset[ind]);
			},
			tab_type() {

				this.datas.content.type = !this.datas.content.type;

			},

			get_goods(item_data) {
				const that = this
				for (let i = 0; i < that.datas.content.dataset.length; i++) {
					if (that.datas.content.dataset[i].shop_source == 1) {
						if (that.datas.content.dataset[i].dataset.length == 0) {
							that.datas.content.dataset.splice(i, 1);
							i--;
						}

					} else if (that.datas.content.dataset[i].shop_source == 2) {
						if (that.datas.content.dataset[i].selector_id.split('-')[0] == "") {
							that.datas.content.dataset.splice(i, 1);
							i--;
						}
					}
				}


				var time_list = [];
				for (var i in that.datas.content.dataset) {

					if (that.datas.content.dataset[i].shop_source == 1) {
						var pro_id = [];
						if (that.datas.content.dataset[i].dataset && that.datas.content.dataset[i].dataset.length <= 0) {
							//   return;
							pro_id = []
							that.datas.content.pros = [];
						} else {
							that.datas.content.dataset[i].dataset.forEach((item, index) => {
								pro_id.push(item.pro_id)
							})
						}

						time_list.push({
							"pro_id": pro_id.length > 0 ? pro_id.join(",") : '-1',
							"group_name": that.datas.content.dataset[i].group_name || that.datas.content.dataset[i]
								.select_value,
							"goods_count": that.datas.content.dataset[i].goods_count,
							"option_title": that.datas.content.dataset[i].option_title,
							"vice_title": that.datas.content.dataset[i].vice_title,
							"title": that.datas.content.dataset[i].title,
							"shop_source": that.datas.content.dataset[i].shop_source
						})
					} else if (that.datas.content.dataset[i].shop_source == 2) {
						var selector_id = that.datas.content.dataset[i].selector_id.split('-')[0];

						if (selector_id > 0) {
							time_list.push({
								"id": selector_id,
								"group_name": that.datas.content.dataset[i].group_name || that.datas.content
									.dataset[i]
									.select_value,
								"goods_count": that.datas.content.dataset[i].goods_count,
								"option_title": that.datas.content.dataset[i].option_title,
								"vice_title": that.datas.content.dataset[i].vice_title,
								"title": that.datas.content.dataset[i].title,
								"shop_source": that.datas.content.dataset[i].shop_source
							})
						}
					}

				}
				if (time_list.length > 0) {
					that.get_list(time_list[that.datas.content.nav_index])
				}
				that.datas.content.time_list = time_list;
			},

			async get_list(itm_data) {
			    // 初始化分页参数
			    this.page = 1;
			    this.all_num = 0;
			    this.cycle_num = 20;
			    this.all_list = [];
			    this.req_data = {};
			    this.shop_source = parseInt(itm_data.goods_count);
			    this.goods_count = itm_data.goods_count;
				
			    // 获取请求数据的公共部分
			    const baseData = {
			        'customer_id_en': this.vuex_customer_id_en,
			        'version': '1.0',
			        'only': 1, // 不获取推荐商品
			        'page_num': 1,
			    };
				
				if(itm_data.shop_source==2){
					baseData['type'] = itm_data.id
				}
			
			    // 根据 shop_source 选择合适的请求参数
			    let _data;
			    if (itm_data.shop_source == 1) {
			        _data = { ...baseData, 'page_size': 30, 'pro_id': itm_data.pro_id };
			    } else if (itm_data.shop_source == 2) {
			        this.page_size = itm_data.goods_count > 20 ? this.page_size : parseInt(itm_data.goods_count);
			        _data = { ...baseData, 'page_size': this.page_size };
			    }
			
			    this.loading = true;
			    this.can_load = false;
			    this.last_key = 0;
			    this.total_count = this.page * this.page_size;
			    this.req_data = _data;
			
			    // 发送请求
				this.$api.getProductList(_data).then(res=>{
					this.loading = false;
					if (res.data && res.data.pro && res.data.pro.length > 0) {
					    // 更新商品数量
					    this.all_num += res.data.pro.length;
					    
					    // 处理返回的商品数据
					    const pros = res.data.pro.map(pro => {
					        const tagList = [];
					        if (pro.freight_name) tagList.push(pro.freight_name);
					        if (pro.currency_name) tagList.push(pro.currency_name);
					        if (pro.integral_name) tagList.push(pro.integral_name);
					        if (pro.privilege_switch == 1 && pro.privilege_dis > 0 && pro.privilege_dis < 100) {
					            tagList.push(`${pro.privilege_name}价 ${Math.floor((pro.privilege_dis / 10) * 100) / 100}折`);
					        }
							if(pro.product_label.length>0){
								pro.product_label.forEach((item)=>{
							        tagList.push(item.name)
							    })
							}
								
					        return {
					            "pro_id": pro.id,
					            "pro_img": pro.url,
					            "pro_count": pro.sell_count,
					            "pro_name": pro.name,
					            "type": 0,
					            "tagList": tagList,
					            "price": pro.first_price,
					            "origin_pro_data": JSON.stringify(pro),
					            "stock_out_img": res.data.set.stock_out_img,
					            "storenum": pro.storenum,
					            "goods_count": itm_data.shop_source == 2 ? itm_data.goods_count : 30
					        };
					    });
								
					    // 合并已有数据并去重
					    if (this.datas.content.pros.length > 0 && this.datas.content.pros[0].pro_id == 0) {
					        this.datas.content.pros = [];
					    }
								
					    let arrObj = [...this.datas.content.pros, ...pros];
					    this.all_list = [...new Map(arrObj.map(item => [item.pro_id, item])).values()];
								
					    // 更新加载状态
					    this.can_load = false;
								
					    // 处理商品列表
					    const goods_count = res.data.pro.length < 20 ? res.data.pro.length : parseInt(itm_data.goods_count);
					    const goods_list = [];
					    for (let i = 0; i < goods_count; i++) {
					        if (i < goods_count && this.last_key < this.total_count) {
					            goods_list.push(this.all_list[this.last_key]);
					            this.last_key += 1;
					        }
					        if (i + 1 === goods_count) {
					            this.goods_list = goods_list;
					            this.can_load = true;
					        }
					    }
					} else {
						this.goods_list = [];
					}
				}).catch(() => {
					this.loading = false;
				})
			 
			},

			//跳转至商品详情页
			goDetail: function(itm) {
				var pro_id = itm.pro_id
				var origin_pro_data = itm.origin_pro_data;

				if (!pro_id || pro_id <= 0) {
					return
				}
				this.$cache.set('shop_pro_detail_' + this.vuex_customer_id + '_' + pro_id, origin_pro_data);

				var url = "/shop/mshop/web/index.php?m=product&a=product_detail&pro_id=" + pro_id +
					'&customer_id=' + this.vuex_customer_id_en

				this.$common.diyLinkJump(url, "h5", true);
			},
			getItemStyle(index) {
				const isSelected = this.datas.content.nav_index === index;
				const fontWeight = isSelected ? (this.datas.content.select_text_style === 1 ? 'normal' : 'bold') : (this
					.datas.content.unselected_text_style === 1 ? 'normal' : 'bold');
				const color = isSelected ? this.datas.content.select_font_color : this.datas.content.unselected_font_color;

				return {
					'font-weight': fontWeight,
					'color': color
				};
			},

			getSpanStyle(index) {
				const fontSize = this.datas.content.nav_index === index ? this.datas.content.select_font_size : this.datas
					.content.unselected_font_size;

				return {
					'max-width': '100px',
					'white-space': 'nowrap',
					'overflow': 'hidden',
					'font-size': `${fontSize}px`
				};
			},

			getLineStyle(index) {
				const isSelected = this.datas.content.nav_index === index;
				return {
					'border-radius': this.datas.content.select_line_style === 1 ? '1.5px' : '0px',
					'background-color': isSelected && this.datas.content.select_line_color_type === 1 ? this.datas.content
						.select_line_color : 'transparent',
					'background-image': isSelected && this.datas.content.select_line_color_type === 2 ?
						`linear-gradient(${this.datas.content.select_line_angle}, ${this.datas.content.select_line_color1}, ${this.datas.content.select_line_color2})` :
						'none'
				};
			},
			
			onScrolltolower() {
				if (this.total_count > this.all_num) {
					uni.showToast({
						title: "已经到底了~",
						duration: 1000,
						icon: "none"
					})
					return
				}

				this.page++
				this.req_data.page_num = this.page
				console.log('触底')
				uni.showLoading({
					title: '加载中'
				});
				this.total_count = this.page * this.page_size
				this.$common.requestData({
					url: '/shop/mshop/api/index.php?m=product&a=get_product_list',
					data: this.req_data,
					method: 'POST',
					needToken: true
				}).then(res => {
					uni.hideLoading();

					if (res.data.pro.length > 0) {
						// this.total_count = res.data.pro.length;	
						var pros = [];
						for (var i in res.data.pro) {
							var pro = res.data.pro[i]
							var tagList = []; //["包邮", "赠送购物券", "赠送积分", "SVIP 8.8折"]
							if (pro.freight_name) {
								tagList.push(pro.freight_name)
							}
							if (pro.currency_name) {
								tagList.push(pro.currency_name)
							}
							if (pro.integral_name) {
								tagList.push(pro.integral_name)
							}
							if (pro.privilege_switch == 1 && pro.privilege_dis > 0 && pro.privilege_dis < 100) {
								tagList.push(pro.privilege_name + '价' + ' ' + (Math.floor((pro.privilege_dis /
									10) * 100) / 100) + '折')
							}
							pros.push({
								"pro_id": pro.id,
								"pro_img": pro.url,
								"pro_count": pro.sell_count,
								"pro_name": pro.name,
								"type": 0,
								"tagList": tagList,
								"price": pro.first_price,
								"origin_pro_data": JSON.stringify(pro), //接口返回的原始数据，用于缓存
								"stock_out_img": res.data.set.stock_out_img, //售罄图标
								"storenum": pro.storenum,
								"goods_count": this.shop_source == 2 ? this.goods_count : 30,
							})
						}
					} else {
						uni.showToast({
							title: "已经到底了~",
							duration: 1000,
							icon: "none"
						})
						// this.
						return
					}
					if (this.datas.content.pros.length > 0) {
						if (this.datas.content.pros[0].pro_id == 0) {
							this.datas.content.pros = [];
						}
					}
					if (pros) {
						let arrObj = [...this.datas.content.pros, ...pros]
						let deduplicationArr = [...new Map(arrObj.map(items => [items.pro_id, items]))
							.values()
						] //数组对象去重
						deduplicationArr.forEach(item => {
							this.all_list.push(item);

							// this.goods_list.push(item);
						});

					}
					this.can_load = false;
					var goods_list = this.goods_list
					if (this.all_list.length % 20 != 0) {
						this.cycle_num = this.all_list.length % 20
					}
					this.all_num = this.all_list.length
					for (var i = 0; i < this.cycle_num; i++) {
						if (i < this.cycle_num && this.last_key < this.all_list.length) {
							goods_list.push(this.all_list[this.last_key])
							this.last_key = parseInt(this.last_key) + 1;
						}

						if (i + 1 == this.cycle_num) {
							this.goods_list = goods_list
							this.can_load = true
						}

					}
					if(this.base_height<90) {
						this.base_height = this.base_height+20
					}

				})
			}

		},
		computed: {
			//获取系统状态栏高度
			statusBarHeight() {
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight
			},


		},

	}
</script>
<style>
	.display-flex {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;

	}


	.flex-1 {
		-webkit-box-flex: 1;
		-ms-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		width: 50%;
	}

	.shop_group_container {
		position: relative;
	}

	.new_shop_group .shop_group_title {
		width: 100%;
		position: relative;
		left: 0;
		top: 0;
		height: 45px;
		min-height: 45px;
		max-height: 45px;
		overflow: hidden;
		flex-shrink: 0;
		z-index: 10;
	}

	.new_shop_group .shop_group_box {
		font-size: 0;
		width: 100%;
		height: 45px;
		min-height: 45px;
		max-height: 45px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		overflow: hidden;
		flex-shrink: 0;
	}

	.new_shop_group .shop_group_box.shop_group_box_btn {
		position: absolute;
		left: 0;
		top: 45px;
		height: auto;
		padding: 0;
		background-color: #fff;
	}

	.new_shop_group .shop_group_list {
		display: block;
		height: 45px;
		min-height: 45px;
		max-height: 45px;
		white-space: nowrap;
		font-size: 0;
		line-height: 0;
		overflow-x: scroll;
		flex: 1;
		width: 0;
	}

	.new_shop_group .shop_group_list li {
		padding: 0 5px;
		box-sizing: border-box;
		text-align: center;
		color: #333;
		height: 45px;
		min-height: 45px;
		max-height: 45px;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		vertical-align: top;
		position: relative;
		flex-shrink: 0;
	}

	.new_shop_group .shop_group_list li .line {
		width: 15px;
		height: 3px;
		position: absolute;
		left: 50%;
		bottom: 6px;
		transform: translateX(-50%);
		margin: 0;
		flex-shrink: 0;
	}

	.new_shop_group .shop_group_sort {
		width: 40px;
		height: 45px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.new_shop_group .shop_group_sort>img {
		width: 14px;
		height: 14px;
		margin: 0;
	}

	.new_shop_group .shop_group_sort.rotate>img {
		transform: rotate(180deg);
	}

	.new_shop_group .shop_group_list li>span {
		display: block;
		position: relative;
		font-size: 15px;
		line-height: 15px;
		height: 15px;
		padding: 0 5px;
		font-weight: 600;
		flex-shrink: 0;
		box-sizing: content-box;
	}

	.new_shop_group .shop_group_title-type2,
	.new_shop_group .shop_group_title-type2 .shop_group_box,
	.new_shop_group .shop_group_title-type2 .shop_group_list,
	.new_shop_group .shop_group_title-type2 .shop_group_list li {
		height: 63px;
		min-height: 63px;
		max-height: 63px;
	}

	.new_shop_group .shop_group_list li view span {
		color: #999;
		font-size: 11.5px;
		width: 59px;
		height: 18px;
		line-height: 18px;
		border-radius: 10px;
		padding: 0 3px;
		flex-shrink: 0;
	}

	.new_shop_group .shop_group_list li>view>span.active {
		font-size: 11.5px;
	}

	.new_shop_group .shop_group_data {
		padding: 15px 15px 0;
	}

	.new_shop_group .shop_group_data>li {
		display: inline-block;
		height: 28px;
		margin-bottom: 15px;
		margin-right: 10px;
		font-size: 12px;
		color: #323233;
		border-radius: 14px;
		background-color: #F7F8FA;
		line-height: 28px;
		text-align: center;
		padding: 0 15px;
	}

	.new_shop_group .shop_group_data li.active {
		background-color: #FF0036;
		color: #fff;
	}

	.new_shop_group .svod-mask {
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: .6;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 9;
	}

	.svod-body {
		position: relative;
		min-height: 200px;
	}

	.svod-loading {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 80px;
		background-color: rgba(255, 255, 255, 0.72);
		box-sizing: border-box;
	}

	.new_shop_group .goods_content {
		padding: 0 10px 10px;
	}

	.new_shop_group .goods_name {
		font-size: 15px;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		word-break: break-all;
		line-height: 1.3;
	}

	.new_shop_group .goods_tag {
		margin-bottom: 10px;
	}

	.new_shop_group .goods_tag view {
		display: inline-block;
		border: 1px solid #FAE2E4;
		color: #FF3445;
		font-size: 12px;
		background: #FFEEF3;
		border-radius: 2px;
		padding: 0 2px;
		margin: 4px 4px 0px 0;
	}

	.new_shop_group .goods_price {
		color: #F24F4C;
		line-height: 1;
	}

	.new_shop_group .goods_price .big {
		font-size: 12px;
		margin-right: 2px;
	}

	.new_shop_group .goods_price .big_s {
		font-size: 18px;
	}

	.new_shop_group .pro_count {
		color: #999;
		font-size: 12px;
		line-height: 1;
	}

	.svod-content {
		/* 1/28 */
		padding: 10rpx;

		box-sizing: border-box;
		padding-top: 0;
	}

	.svod-content::-webkit-scrollbar {
		display: none;
	}

	.svod-content .svod-ul {
		font-size: 0;
		width: calc(50% - 10rpx);
	}

	/* 1/28 */
	.svod-content .svod-ul-left {
		margin-right: 24rpx;
	}

	.svod-content .svod-ul>view {
		/* margin-bottom: 18.5px; */
		margin-bottom: 14rpx;
		background-color: #fff;
	}

	.svod-content-bg {
		height: 380rpx;
		position: relative;
		border-radius: 8rpx;
		/* margin-bottom: 14rpx; */
		overflow: hidden;
		/* background: #FBFBFB; */
	}


	.svod-content-bg .svod-img {
		height: 100%;
		align-items: center;
		justify-content: center;
		border-radius: 8rpx;
	}

	.svod-content-bg .svod-img>image {
		max-width: 100%;
		max-height: 100%;
		width: 100%;
		border-radius: 8rpx;
	}


	.svod-center {
		font-size: 26rpx;
		color: #5d5d5d;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		/* 1/28 */
		word-break: break-all;
		font-weight: 500;
	}

	/* 标签 */
	.tag {
		margin-bottom: 10rpx;
	}

	.tag view {
		display: inline-block;
		color: #F36889;
		font-size: 20rpx;
		background: #FDE1E7;
		border-radius: 30rpx;
		padding: 0 5px;
		margin: 5px 5px 0px 0;
	}

	/* 标签end */
	/* 销量 */
	.xiaoliang {
		font-size: 22rpx;
		color: #999999;
	}

	/* 销量end */
	/* 价格 */
	.svod-user {
		color: #333;
		align-items: center;
	}

	.svod-user .big {
		font-size: 24rpx;
	}

	.svod-user .big_s {
		font-size: 30rpx;
	}

	/* 价格end */
	/* 商品列表end */
	/* 商品列表组件end */

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	::-webkit-scrollbar {
		display: none;
	}
	
	.margin-top-5{
		margin-top: 5px;
	}
</style>