<template>
	<view class="">
		<scroll-view class="purchase-top" scroll-x="true">
		    <block v-for="(item,index) in tab_all_list">
		        <view class="purchase-top-list" @click="change_type1(index)">
		            <view class="flex-def flex-zCenter flex-cCenter">
		                <view>
		                    <image class="purchase-top-img" :src="item.imgurl"></image>
		                    <view :class="'purchase-top-text '+(index==tab_list_index?'active skin-color-'+theme:'')">{{item.name}}</view>
		                </view>
		            </view>
		        </view>
		    </block>
		</scroll-view>
		<view class="purchase-content flex-def">
			<scroll-view class="purchase-left" scroll-y="true" v-if="tab_all_list[0]">
				<block v-for="(item,index) in tab_all_list[tab_list_index].son">
					<view :class="'purchase-left-list flex-def flex-cCenter flex-zCenter '+(index==two_list_index?'active skin-color-'+theme:'')" @click='change_type2(index)'>
						<view class="purchase-left-text">
							{{item.name}}
						</view>
					</view>
				</block>
			</scroll-view>
			
			<view class="purchase-content-right flex-one">
				<view class="purchase-content-top">
					<view class="top" v-if="tab_all_list[0]">
						<scroll-view :class="'purchase-top-top '+(four_list.length>3?'padding-right':'')" scroll-x="true" :scroll-into-view="tabidx" v-if="tab_all_list[0].son[0]">
							<block v-for="(item,index) in tab_all_list[tab_list_index].son[two_list_index].son">
								<view :id="'tab'+index" :class="'purchase-left-list '+(index==four_list_index?'active skin-color-'+theme:'')" @click="changeListNow(index)">
									<view class="purchase-left-text">{{item.name}}</view>
								</view>
							</block>
						</scroll-view>
						<view class="popup-down flex-def flex-zCenter flex-cCenter" v-if="tab_all_list[tab_list_index].son[two_list_index].son.length>3" @click="popup_mask"><image :class="popup_show?'rotate':''" :src="http_host+'/shop/mshop/web/static/images/purchase_down.png'"></image></view>
					</view>
					<view class="purchase-switch flex-def flex-zEnd flex-zCenter">
						<view :class="'left '+(sort.type=='sell'?'active skin-color-'+theme:'')" @click='sort_sell'>销量</view>
						<view :class="'right flex-def flex-cCenter '+(sort.type=='price'?'active skin-color-'+theme:'')" @click='sort_price'><view>价格</view>
							<view :class="'img '+((sort.desc=='price_desc'||sort.desc=='price_asc')?'skin-bg-'+theme:'')">
								<image v-if="sort.desc=='price_desc'" :src="http_host+'/shop/mshop/web/static/images/desc_price.png'"></image>
								<image v-else-if="sort.desc=='price_asc'" :src="http_host+'/shop/mshop/web/static/images/asc_price.png'"></image>
								<image v-else :src="http_host+'/shop/mshop/web/static/images/purchase_increase.png'"></image>
							</view>
						</view>
					</view>
				</view>
				<view v-if="popup_show" class="popup-tab">
					<block v-for="(item,index) in tab_all_list[tab_list_index].son[two_list_index].son">
						<view class="purchase-left-list" @click='changeListNow(index)'>
							<view :class="'purchase-left-text '+(index==four_list_index?'active skin-color-'+theme:'')">{{item.name}}</view>
						</view>
					</block>
				</view>
				<scroll-view class="purchase-right" :scroll-into-view="toIndex" scroll-y="true" @scroll="scroll" @scrolltolower="purchase_scroll_down" @scrolltoupper="purchase_scroll_up">
					<block v-for="(itm,ind) in three_list" >
						<view :id="'pro_type'+ind" v-if="itm">
							<view class="class_tag">{{itm.class}}</view>
							<block v-for="(item,index) in itm.list">
								<view class="purchase-right-list flex-def" :id="'pro_id'+item.id" @click="goToDetail(item.id)">
									<view class="left">
										<image class="purchase-right-img" :src="item.url"></image>
									</view>
									<view class="right flex-one flex-def flex-zTopBottom flex-zBetween">
										<view class="title">{{item.name}}</view>
										<view class="flex-def flex-cCenter flex-zBetween">
											<view class="price">
												<text>{{monetary_unit}}</text>{{item.now_priceA}}<text>{{item.now_priceB}}</text>
											</view>
											<view v-if="item.is_property==0" class="num flex-def flex-cCenter">
												<view v-if="item.car_num > 0" :class="'img skin-bg-'+theme">
													<image :data-action="reduce" :src="http_host+'/shop/mshop/web/static/images/purchase_sub.png'"></image>
												</view>
												<text v-if="item.car_num > 0">{{item.car_num}}</text>
												<view :class="'img skin-bg-'+theme">
													<image @click="addCar(ind,index)" :src="http_host+'/shop/mshop/web/static/images/purchase_add.png'"></image>
												</view>
											</view>
											<view @click="spec_alert_show_fun(ind,index)" v-else :class="'speci skin-bg-'+theme" >选规格</view>
										</view>
									</view>
								</view>
							</block>
							<view class="list-length flex-def flex-zCenter flex-zCenter" v-if="itm.list.length == 0">
								<view>
									<image :src="http_host+'/shop/mshop/web/static/images/purchase_null.png'"></image>
									<view class="text">暂无商品哦~</view>
								</view>
							</view>
						</view>
					</block>
				</scroll-view>
				<view v-if="popup_show" @click="popup_mask_hide" class="popup-mask"></view>
				<view class="popup-cart" @click='gotocar'>
					<image class="img" :src="http_host+'/shop/mshop/web/static/images/purchase_gwc.png'"></image>
					<view class="num">{{cart_num}}</view>
				</view>
			</view>
		</view>
		<!--选择属性弹窗start-->
		<view class="alert-bg" v-if="spec_alert_show" @click="spec_alert_hide"></view>
		<view class="spec-alert" v-if="spec_alert_show">
			<view class="alert-close" @click="spec_alert_hide"></view>
			<view class="goods-infor" style='padding-top: 20px;'>
				<view class="image" @click='pop_big_img' :data-imgurl="spec_infor.pic">
					<image :src="spec_infor.pic"></image>
				</view>
				<view class="infor">
		            <view class="name">{{spec_infor.name}}</view>
					<view :class="'price p-tap price-'+price_color">{{monetary_unit}}
						<text class="big">{{spec_infor.priceA}}</text>{{spec_infor.priceB}}
					</view>
					<view class="num p-tap">总库存{{spec_infor.stock}}件</view>
					<view class="spec p-tap" v-if="goods_spec.length > 0">
						<block v-if="ch_spec.text==''">请选择属性</block>
						<block v-else>已选：
							<text v-for="(item,index) in ch_spec.text">"{{item}}"</text>
						</block>
					</view>
				</view>
			</view>
			<view class="spec-box-scroll">
				<view class="spec-box" v-for="(item,index) in goods_spec">
					<view class="spec-title">{{item.name}}</view>
					<view class="spec-list">
						<li v-for="(items,ind) in item.spec_list" :class="(items.ischeck?'active skin-color-'+theme+' skin-bd-'+theme:'')+' '+(!items.can_chose || items.storenum == 0? 'disable':'')" @click="chose_spec(index,ind)">
							<image :src="items.pic" alt="" v-if="items.pic != ''"> </image>{{items.text}}
						</li>
					</view>
				</view>
			</view>
			<view class="chose-num">
				<text>数量</text>
				<text style="color:red;padding-left:10px" v-if="rest_num>=0">最多可购{{rest_num}}件</text>
				<view class="num-box">
					<button @click="count('jian')" :class="spec_infor.num == spec_infor.sale_num? 'cannot-click':''">
		                <image class="img" :src="http_host+'/shop/mshop/web/static/images/av_stock_jian.png'"></image>
		            </button>
					<!-- <input type='number' :value="spec_infor.num" v-model="spec_infor.num" @blur="numInfo" /> -->
					<button @click="count('add')"  :class="spec_infor.num == spec_infor.stock? 'cannot-click':''">
		                <image class="img" :src="http_host+'/shop/mshop/web/static/images/av_stock_add.png'"></image>
		            </button>
				</view>
			</view>
		    <view :class="'sure-btn skin-bg-'+theme"  @click='addCar(spec_infor.type_index,spec_infor.pro_index)'>加入购物车</view>
		    
		</view>
		<!--选择属性弹窗end-->
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	export default {
		data(){
			return {
				theme: getApp().globalData.style_color, // 主题色
				price_color: getApp().globalData.price_color, // 主题价格色
				monetary_unit: getApp().globalData.monetary_unit, // 货币符号
				tab_all_list: [], // 所有的分组
				tab_list: [], // 一级tab数据
				two_list: [], // 二级tab数据
				three_list: [], // 三级tab数据
				tab_list_index: 0, // 一级tab索引
				two_list_index: 0, // 左侧tab索引
				three_list_index: 0, // 右侧tab索引
				four_list:[],
				four_list_index:0,//三级分组索引
				toIndex: "", // 右侧商品滚动到位置
				opscroll: true, // 防止多次切换
				popup_show: false, // 三级分组tab弹窗是否显示
				cart_num: 0, // 购物车数量
				is_load_page:false,//是否下载下一页
				is_loading:false,//是否加载中
				sort:{
					type:'',//sell-销量，price-价格
					desc:'',//是否降序
				},
				spec_alert_show:false,//购物车弹窗
				spec_infor:{//属性弹窗数据
					pic:'',
					priceA:0,
					priceB:0,
					stock:0,
					num:1,
				},
				goods_spec:[],//属性数组
				prop_price:[],//属性组合价格数组
				ch_spec: {//已选中的属性,
					text: [],
					ids: []
				}, 
				tabidx: "tab0",
				rest_num:0
			}
		},
		onShow(){
			this.get_cart_num();
		},
		onLoad(){
			this.http_host = this.vuex_apiUrl
			this.gain_all_classify();
		},
		watch:{
			toIndex(val,oldval){
				var _this = this;
				//console.log('val='+val+'，oldval='+oldval);
				//console.log('three_list',this.three_list)
			},
			four_list_index(val,oldval){
				//console.log('four_list_index val='+val+'，four_list_index oldval='+oldval);
				//console.log('four_list_index',this.three_list)
			}
		},
		methods:{
			// 三级分组tab弹窗是否显示
			popup_mask() {
				var that = this;
				if (that.popup_show) {
					that.popup_show=false
				} else {
					that.popup_show=true
				}
			},
			popup_mask_hide() {
				var that = this;
				that.popup_show=false
			},
			// 商品滚动监听
			scroll(e) {
				var that = this;
				var scrollTop = e.detail.scrollTop;
				//console.log('scrollTop',scrollTop)
		
				//监听商品列表三级分组位置，用于顶部显示目前三级分组
				uni.createSelectorQuery().selectAll('.class_tag').boundingClientRect(function(rect){
					var four_list_index = 0;
					//循环每一个分组判断顶部距离，取符合条件的最后一个分组
					for(var i in rect){
						//console.log('rect.top ='+rect[i].top +'  - i='+i)
						if(rect[i].top<=400){
							four_list_index = i
						}
					}
					//console.log('four_list_index',four_list_index)
					if(that.four_list_index!=four_list_index){
						//TODO 设置横向滚动
						that.four_list_index=four_list_index
						if(four_list_index>2){
							that.tabidx="tab"+(four_list_index - 2)
						}else{
							that.tabidx="tab0"
						}
					}
				}).exec();
			},
			// 顶部三级分组点击tab商品切换
			changeListNow: function (index) {
				
				var that = this
				if(index>2){
					that.tabidx="tab"+(index - 2)
				}else{
					that.tabidx="tab0"
				}
				that.four_list_index=index
				//判断分组是否存在 
				if(that.three_list[index] == undefined){
					//console.log('changeListNow',index)
					//清空所有商品
					that.three_list=[]
					//加载当前分组，如果最后一页加载下一个分组
					that.create_class_pro(index)
					
					that.classify_goods(index,1,true)
				}
				//存在直接跳转
				else{
					//console.log('changeListNow',index)
					// 滚动跳转位置
					that.toIndex='pro_type' + index
				}
				//console.log('283',this.three_list)
			},
			//点击二级分组
			change_type2(index){
				var that = this
				that.two_list_index = index;
				that.is_load_page = false;
				that.three_list = [];//清空商品数组
				that.sort.type = '';
				that.sort.desc = '';
				that.gain_all_classify();
			},
			gain_all_classify(){
				var that = this;
				util.requestData({
					url:"/uniapp_template/web/index.php?m=shop&a=get_type_son",
					data:{type_id:-1},
					success:function(res){
						if (res.errcode == 0) {
							that.tab_all_list = res.data
							//创建分组商品基础数据
							that.create_class_pro(0);
							//获取分组商品，默认第一个分组的第一页
							that.classify_goods(0,1,true);
						} else {
							uni.showToast({
								title: res.errmsg,
								icon: 'none',
								duration: 2000
							})
						}
					}
				})
			},
			/**
			 * 创建一个分组商品基础数据
			 * @param {要创建的分组索引} index 
			 */
			create_class_pro(index){
				var tab_index = this.tab_list_index;
				var two_index = this.two_list_index;
				var three_type = this.tab_all_list[tab_index].son[two_index].son;
		
				if(index==NaN){
					return
				}
		
				var three_list = this.three_list;
		
				three_list[index] = {
					class: three_type[index].name,
					id: three_type[index].id,
					list: [],
					now_page: 0,
					total_page: 0,
				}
				this.three_list = three_list
				//console.log(this.three_list);
			},
			/**
			 * 获取子分类下的商品
			 * @param {三级分组索引} index 
			 * @param {页数} page 
			 * @param {是否加载下一个分组} next 
			 * @param {向上还是向下加载} is_up 
			 */
			classify_goods(index,page,next,is_up,callback) {
				var that = this;
				var three_index = that.three_list_index;
		
				//获取分组id
				var three_list = that.three_list[index]
				//console.log('three_list',three_list)
				var type_id    = three_list.id
				var sort 	   = that.sort.desc
				util.requestData({
					//不显示lodaing图标
					isShowLoading:false,
					url: '/uniapp_template/web/index.php?m=shop&a=get_product_list_one',
					method: 'POST',
					data: {
						sort: sort,
						page_num: page,
						type: [type_id],
						version: "1.0",
						//返回页码数据
						need_page: 1,
						//返回属性数据
						need_property:1,
					},
					success: function (res) {
						if (res.errcode == 0) {
							
							//处理价格小数
							res.data.pro.forEach(function (item) {
								item.now_priceA = util.toPrice(item.now_price, true);
								item.now_priceB = util.toPrice(item.now_price, false);
							})
							
							//连接数据
							if(is_up){
								var goodList = that.three_list[index].list
		
								for(var i in res.data.pro){
									goodList.unshift(res.data.pro[i])
								}
		
							}else{
								var goodList = that.three_list[index].list.concat(res.data.pro)
							}
							that.three_list[index].list = goodList
							//总页数
							that.three_list[index].total_page = res.data.page
							//当前页数
							that.three_list[index].now_page = page
							//定位到当前产品
							//console.log(that.three_list[index].list)
							that.$forceUpdate()
							//that.four_list_index = index 
							//已经是这个分组的最后一页
							if(page>=res.data.page && next){
								
								var three_type_length = that.tab_all_list[that.tab_list_index].son[that.two_list_index].son.length
								//console.log('three_type_length',three_type_length)
								if(three_type_length<=index+1){
									//console.log('three_type_length',three_type_length)
									//console.log('index',index)
									//console.log('list',that.three_list[index].list)
									return
								}
		
								//创建下一个分组
								that.create_class_pro(index+1)
								that.classify_goods(index+1,1,false)
							}
							//console.log('index',index)
							//console.log('three_list',that.three_list[index].list)
							callback && callback()
		
						} else {
							// wx.showToast({
							//     title: res.errmsg,
							//     icon: 'none',
							//     duration: 2000
							// })
						}
						//console.log('classify_goods pro',that.three_list)
					},
					
				});
			},
			// 商品底部加载数据-向下滑
			purchase_scroll_down(e) {
				//判断是下一页还是下个分组
				var index = this.three_list.length-1;
				var three = this.three_list[index]
		
				//获取分组下一页
				if(three.now_page<three.total_page){
					this.classify_goods(index,three.now_page+1,false)
				}else{
					//获取有几个分组
					var three_type_length = this.tab_all_list[this.tab_list_index].son[this.two_list_index].son.length
		
					//所有分组已加载完
					if(three_type_length<=index+1){
						return
					}
					//创建下一个分组
					this.create_class_pro(index+1)
					this.classify_goods(index+1,1,false)
				}
			},
			// 商品底部加载数据-向上滑
			purchase_scroll_up(e) {
				var that = this
		
				if(that.is_loading){
					return
				}
		
				//禁止重复加载
				that.is_loading = true
		
				for(let i in this.three_list){
					var index = i;
				    break;
				}  
				//当前的分组
				var three = that.three_list[index]
				//是否加载下一页
				var is_load_page = that.is_load_page
		
				if(is_load_page){
					//获取当前pro_id,用于加载后滚动条跳回来
					var pro_id = that.three_list[index].list[0].id
					
					that.classify_goods(index,three.now_page+1,false,true,()=>{
						
						if(three.now_page+1>=that.three_list[index].total_page){
							that.is_load_page = false
							// 滚动跳转位置
							that.toIndex='pro_id' + pro_id
						}
						//加载完成
						that.is_loading = false
					})
					return;
				}else {
					if(index-1<0){
						return
					}
					//创建上一个分组
					that.create_class_pro(index-1)
					
					that.classify_goods(index-1,1,false,true,()=>{
						three = that.three_list[index-1]
		
						if(three.now_page<three.total_page){
							that.is_load_page = true
						}
						// 滚动跳转位置
						that.toIndex='pro_type' + index
						that.is_loading = false
					})
				}
			},
			//点击一级分组
			change_type1(index){
				var that = this
				that.tab_list_index = index
				that.two_list_index = 0
				that.is_load_page = index
				that.three_list = []
				that.sort.type = ''
				that.sort.desc = ''
				that.gain_all_classify();
			},
			//点击二级分组
			change_type2(index){
				var that = this
				that.two_list_index = index
				that.is_load_page = false
				that.three_list = [];
				that.sort.type = ''
				that.sort.desc = ''
				that.gain_all_classify();
			},
			//点击销量
			sort_sell(){
				var that = this
				var type = 'sell'
				var desc = 'sell_desc'
		
				if(that.sort.type == 'sell'){
					type = ''
					desc = ''
				}
				that.three_list = [];
				that.sort.type = type
				that.sort.desc = desc
		
				that.changeListNow(that.four_list_index)
			},
			//点击价格
			sort_price(){
				
				if(this.sort.type == 'price'){
					var desc = 'price_asc'
					if(this.sort.desc=='price_asc'){
						desc = 'price_desc'
					}
					this.sort.desc = desc
					this.three_list = [];
				}else{
					this.sort.type = 'price'
					this.sort.desc = 'price_asc'
					this.three_list = [];
				}    
		
				this.changeListNow(this.four_list_index)  
			},
			//获取购物车数量
			get_cart_num:function(){
				var _this = this
				var request_data = {}
				util.requestData({
					//不显示lodaing图标
					isShowLoading:false,
					url: '/uniapp_template/web/index.php?m=shop&a=get_cart_num',
					data: request_data,
					method: 'POST',
					success: function (res) {
						var data = res.data
						if (res.errcode == 0) {
							_this.cart_num = data || 0 //购物车商品数量
						}
					}
				})
			},
			goToDetail: function (id) { //跳转到详情页
				/*url = '../goodsDetail/goodsDetail?id=' + id
				uni.navigateTo({
					url: url
				})*/
			},
			//跳转购物车
			gotocar: function() {
				uni.navigateTo({
					url: '../shopCar/shopCar',
				})
			},
			/**
			 * 多属性选择弹窗显示
			 */
			spec_alert_show_fun: function(type_index,pro_index) {
				var that = this
				var pro = that.three_list[type_index].list[pro_index] || ''
		
				if(!pro){
					return
				}
		
				var goods_spec = pro.property || []
				var prop_price = pro.product_prop || []
		
				var spec_infor = {
					pic:pro.url,
					price:pro.now_price,
					priceA:pro.now_priceA,
					priceB:pro.now_priceB,
					stock:pro.storenum,
					type_index:type_index,
					pro_index:pro_index,
					num:1,
					sale_num:pro.sale_num||1,//起售数
					name: pro.name,
				}
				that.goods_spec = goods_spec
				that.spec_infor = spec_infor
				that.prop_price = prop_price
				that.spec_alert_show = true
				that.ch_spec = {text: [],ids: []}
			},
			/**
			 * 多属性选择弹窗隐藏
			 */
			spec_alert_hide() {
				var that = this
				that.spec_alert_show = false
			},
			//选择商品属性方法
			chose_spec: function(index,ind) {
				var that = this;
		
				if (that.goods_spec[index].spec_list[ind].storenum == 0) {
					return false
				}
		
				//取消已选中的
				for (var gidx in that.goods_spec[index].spec_list) {
					that.goods_spec[index].spec_list[gidx].ischeck = false
				}
				that.goods_spec[index].spec_list[ind].ischeck = true
		
				//判断属性禁用start
				//属性数
				var spec_num = that.goods_spec.length
				//选中的属性数
				var check_id = []
				for (var a in that.goods_spec) {
					for (var b in that.goods_spec[a].spec_list) {
						that.goods_spec[a].spec_list[b].can_chose = true
						if (that.goods_spec[a].spec_list[b].ischeck) {
							check_id.push(that.goods_spec[a].spec_list[b].id)
						}
					}
				}
		
				//属性全选的时候
				if (check_id.length == spec_num){
					var tmp = check_id.toString()
					for (var prop of that.prop_price){
						//判断是否被禁用
						if ((prop.status == 2 || prop.storenum == 0)  && prop.proids == tmp){
							that.goods_spec[index].spec_list[ind].can_chose = false 
							that.goods_spec[index].spec_list[ind].ischeck = false
							uni.showModal({
								title: '提示',
								content: "该规格暂时无法选择",
							})
							
							return false
						}
					}
				}
				//属性禁用end
				that.goods_spec = that.goods_spec
				that.spec_infor = that.spec_infor
				that.ch_spec_fun()
			},
			//筛选出已选尺寸的方法
			ch_spec_fun: function() {
				var that = this;
				
				var pro = that.three_list[that.spec_infor.type_index].list[that.spec_infor.pro_index]
		
				var arr = [];
				var ids = [];
				var pop_img = pro.url
				for (var ind in that.goods_spec) {
					for (var listInd in that.goods_spec[ind].spec_list) {
						var items = that.goods_spec[ind].spec_list[listInd]
		
						if (items.ischeck === true) {
							if (items.pic != '') {
								pop_img = items.pic
							}
							arr.push(items.text)
							ids.push(items.id)
						}
					}
				}
				// var str_text = 'ch_spec.text'
				// var str_id = 'ch_spec.ids'
				// var spec_infor_img = 'spec_infor.pic'
				// that.setData({
				// 	[str_text]: arr,
				// 	[str_id]: ids,
				// 	[spec_infor_img]: pop_img
				// })
				that.ch_spec.text = arr;
				that.ch_spec.ids = ids;
				that.spec_infor.pic = pop_img;
				var stock = 'spec_infor.stock'
				var price = 'spec_infor.price';
				var pro_prop = 'spec_infor.pro_prop'
				
				var total_price = 0
		   
				// 循环是否有价格区分
				for (var idx in that.prop_price) {
					if (that.prop_price[idx].proids == ids) {
						// total_price = parseFloat(that.data.prop_price[idx].now_price) * 100 * that.data.spec_infor.num / 100 + ""
						total_price = parseFloat(that.prop_price[idx].now_price) * 100 / 100 + ""
						
						if (that.privilege_switch == 1) {
							privilege_price = that.privilege_dis * parseFloat(that.prop_price[idx].now_price) * 0.01;
							//舍去小数点后两位
							privilege_price = Math.floor(privilege_price * 100) / 100;
						}
						
						// that.setData({
						// 	[stock]: that.prop_price[idx].storenum,
						// 	[price]: total_price,
						// 	single_price: that.prop_price[idx].now_price,
						// 	[pro_prop]: that.prop_price[idx].proids,
						// })
						
						that.spec_infor.stock = that.prop_price[idx].storenum;
						that.spec_infor.price = total_price;
						that.single_price = that.prop_price[idx].now_price;
						that.spec_infor.pro_prop = that.prop_price[idx].proids;
						
						that.twoNum()
						//return
					}
				}
				if (that.ch_spec.text.length == that.goods_spec.length) {
					// total_price = parseFloat(that.data.single_price) * 100 * that.data.spec_infor.num / 100 + ""
					total_price = parseFloat(that.single_price) * 100 / 100 + ""
					that.spec_infor.price = total_price
					// that.setData({
					// 	[price]: total_price,
					// })
					that.twoNum()
				}
		
			},
			// 价钱拆分整数和小数
			twoNum: function() {
				var that = this
				that.spec_infor.priceA = util.toPrice(that.spec_infor.price, true)
				that.spec_infor.priceB = util.toPrice(that.spec_infor.price, true)
			},
			//添加至购物车POST方法
			addCar: function(type_index,pro_index,action='') { 
				var that = this
				//var action = e.currentTarget.dataset.action || ''
				//获取属性数据
				//var type_index = e.currentTarget.dataset.type_index
				//var pro_index = e.currentTarget.dataset.pro_index
				var pro = that.three_list[type_index].list[pro_index] || ''
				if (pro.is_property==1 && that.ch_spec.text.length < that.goods_spec.length) { 
					// 未选择商品属性
					uni.showToast({
						title: '请选择商品属性',
						icon: 'none',
						duration: 2000
					});
					return
				} 
		
				var pro_prop = that.ch_spec.ids.length > 0 ? that.ch_spec.ids : -1;
				
				//店铺类型  1:商城自营;2:全球仓;4:海淘;5:供应商商家;7:供应链商家;
				var store_model = 1
				if(pro.supply_id>0){
					store_model = 5
				}else if(pro.type==4){
					store_model = 4
				}else if(pro.type==7){
					store_model = 7
				}
				
				//商品已经加入的数量
				var pro_car_num = 'three_list['+type_index+'].list['+pro_index+'].car_num'
				var new_num = Number(pro.car_num || 0)+Number(that.spec_infor.num)
		
				util.requestData({
					url: '/uniapp_template/web/index.php?m=shop&a=add_cart',
					needToken:true,
					data: {
						action:action,
						pro_id: pro.id,
						supply_id: pro.supply_id,
						pro_num: that.spec_infor.num,
						pro_prop: pro_prop,
						distrbutor_id:pro.distrbutor_id || -1,
						store_model:store_model,
					},
					method: 'POST',
					success: function(res) {
						if (res.errcode == 0) {
							uni.showToast({
								title: '加入购物车成功',
								icon: 'none',
								duration: 2000
							})
							that.cart_num = res.data.cart_num
							that.spec_alert_show = false
							that.three_list[type_index].list[pro_index].car_num = res.data.cart_num
						}else{
							uni.showToast({
								title: res.errmsg,
								icon: 'none',
								duration: 2000
							})
						}
					}
				});
			},
			/**
			 * 多属性数量加减
			 */
			count: function(cou) { //商品数量加减
				//var cou = e.currentTarget.dataset.cou
				var self = this;
				var str_num = 'spec_infor.num'
				var price = 'spec_infor.price'
				var num = self.spec_infor.num
				switch (cou) {
					case "add":
						if (parseInt(self.spec_infor.num) < parseInt(self.spec_infor.stock)) {
							num++
							if (self.ch_spec.text.length == self.goods_spec.length) { // 确定属性都已经被选中
								// var total_price = parseFloat(self.data.single_price) * 100 * num / 100 + ""
								var total_price = parseFloat(self.single_price) * 100 / 100 + ""
								self.spec_infor.num = num
								self.spec_infor.price = total_price
								// self.setData({
								// 	[str_num]: num,
								// 	[price]: total_price
								// })
								self.twoNum()
							} else {
								self.spec_infor.num = num
								// self.setData({
								// 	[str_num]: num,
								// })
							}
		
						} else {
							return false
						}
						break;
					case "jian":
						if (parseInt(self.spec_infor.num) > parseInt(self.spec_infor.sale_num)) {
							num--
							if (self.ch_spec.text.length == self.goods_spec.length) {
								// var total_price = parseFloat(self.data.single_price) * 100 * num / 100 + ""
								var total_price = parseFloat(self.single_price) * 100 / 100 + ""
								self.spec_infor.num = num
								self.spec_infor.price = total_price
								// self.setData({
								// 	[str_num]: num,
								// 	[price]: total_price
								// })
								self.twoNum()
							} else {
								self.spec_infor.num = num
								// self.setData({
								// 	[str_num]: num,
								// })
							}
		
						} else {
							return false
						}
						break;
					default:
						break;
				}
			},
		}
	}
</script>

<style scoped src="./purchase_page.css"></style>
