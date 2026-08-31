<template>
	<view v-if="product_list.length >0" :style="'padding: '+datas.content.padding+'px 0;'" v-cloak>
		<view class="custom-longe-integral-shop">
	        <block v-for="(it, idx) in product_list" :key="idx" v-if="idx <= datas.content.show_num && datas.content.css_type === 2">
				<view hover-class="no-hover" :class="'custom-longe-integral-shop-item type'+ datas.content.css_type">
					<view class="longe-integral-shop-img-wrap" 
						@click="$common.diyLinkJump('/longe_integral_shop/pages/product/proDetail/proDetail&id='+ it.id)">
						<image :src="it.url"></image>
					</view>
					<view>
						<p :class="'longe-integral-shop-name1' + datas.content.title_line" v-if="datas.content.show_name">
							{{it.pro_name}}
						</p>
						<view>
							<span class="price1"
								v-if="it.act_price>0"><big>{{it.integral}}</big>{{integralName}}+<big>{{it.act_price}}</big>元</span>
							<span class="price1" v-else><big>{{it.integral}}</big>{{integralName}}</span>
							<view>
								<span class="sell-count1">{{monetary_unit}}{{it.orgin_price}}</span>
								<span class="sell-count2" v-if="datas.content.show_count">已售{{it.sale}}</span>
							</view>
						</view>
					</view>
				</view>
	        </block>
			
			<view hover-class="no-hover" :class="'custom-longe-integral-shop-item type'+datas.content.css_type" 
			v-if="datas.content.css_type == 1">
				<view class="longe-integral-shop-img-wrap" 
				@click="$common.diyLinkJump('/longe_integral_shop/pages/product/proDetail/proDetail&id=' + product_list[0].id)">
					<image :src="product_list[0].url"></image>
				</view>
				
				<view>
					<p :class="'longe-integral-shop-name1 title1 line'+ datas.content.title_line" 
					v-if="datas.content.show_name">{{product_list[0].pro_name}}</p>
					<view class="flex1">
					    <view class="flex2">				    
					        <span class="price1" v-if="product_list[0].act_price>0"><big>{{product_list[0].integral}}</big>{{integralName}}+<big>{{product_list[0].act_price}}</big>元</span>
					        <span class="price1" v-else><big>{{product_list[0].integral}}</big>{{integralName}}</span>
					        <span class="sell-count1" 
								style="margin-top:0;margin-left:10px">{{monetary_unit}}{{product_list[0].orgin_price}}</span>
					    </view>
					    <span :class="'btn skin-bg'+theme" @click="integral_shop_buy(product_list[0].id,product_list[0].cheap_proids)">立即购买</span>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name :"longeIntShop",
		props: {
		  datas: {
		    type: Object,
		    default: () => ({})
		  }
		},
	  data() {
	    return {
	      theme: getApp().globalData.style_color,
		  http_host: this.vuex_apiUrl,
	      product_list: [],
	      integralName: '',
		  price_color: getApp().globalData.price_color,
		  monetary_unit: getApp().globalData.monetary_unit,
	    };
	  },
	  created() {
	  	var _this = this;
		http_host: _this.vuex_apiUrl,
		_this.productSelect();
	  },
	  
	  methods: {
	    processproduct_list(product_list) {
	      const reg = /^(https?:\/\/[^\s]+)/i; // 简化 URL 正则
	      product_list.forEach(item => {
	        if (!reg.test(item.img)) {
	          if (item.img.includes('..')) {
	            item.img = this.$store.state.http_host + item.img.replace(/../, "");
	          } else {
	            item.img = this.$store.state.http_host + '/resources/' + item.img;
	          }
	        }
	      });
	      this.product_list = product_list;
	    },
	    productSelect:function() {
			const _this = this;
			var page = {
				page:1,
				page_size:_this.datas.content.show_num
			};
			if(_this.datas.content.css_type== 2 && _this.datas.content.shop_type == 1){
				var search = {
					act_id : _this.datas.content.activity_id
				}
			}else{
				var search = {
					id: _this.datas.content.selector_id.split(',')
				}
			}
			var params = {
				'page': JSON.stringify(page),
				'search': JSON.stringify(search),
				'order': JSON.stringify({
					sort: 'desc'
				}),
			};

			this.$common.requestData({
				url: '/longe_integral_shop/web/index.php?m=product&a=get_pro_list',
				data:params,
				method:"POST",
				needToken: true,
			}).then(res => {
				console.log("请求执行");
				this.loading = false
				if(res.errcode === 0) {
					_this.product_list = res.data.pro;
					_this.integralName = res.data.config.diy_integralName;
				}
			});
	    },
	    integral_shop_buy(pid, cheap_proids) {
			const _this = this;
			var params = {
				pro: JSON.stringify([{
					id: pid,
					proids: cheap_proids,
					pro_num: 1,
					}])
				}
			_this.$common.requestData({
				url:'/longe_integral_shop/web/index.php?m=order_create&a=submit_order',
				data:params,
				method:"POST",
				needToken: true,
			}).then(res => {
				if (res.errcode == 0) {
					console.log("请求成功！进行跳转");
					_this.$common.diyLinkJump('/longe_integral_shop/web/index.php?m=order_create&a=order_confirm&order_id' + res.order_id,"h5",true)
				} else if (res.errcode === 499) {
					window.location.href = res.data;
				} else if (res.errcode === 43000) {
					window.location.href = res.must_jump_url;
	          } else {
					this.$toast({ title: res.errmsg, icon: 'none' }); // 使用适合的 Toast 方法
	          }
			});
		
	    }
	  }
	};
</script>

<style>
	.custom-longe-integral-shop {
	    width: 100%;
	    background: #fff;
	    box-sizing: border-box;
	    padding: 0 15px;
	}
	.custom-longe-integral-shop .type1 .longe-integral-shop-img-wrap {
	    width: 100%;
	    height: 175px;
	    position: relative;
		border-radius:4px;
		overflow:hidden;
	}
	.custom-longe-integral-shop .longe-integral-shop-img-wrap {
	    width: 100%;
	    position: relative;
		border-radius:4px;
		overflow:hidden;
	}
	.custom-longe-integral-shop .custom-longe-integral-shop-item image {
	    width: 100%;
	    height: 100%;
	    position: absolute;
	    top: 0;
	    object-fit: cover;
	}
	.custom-longe-integral-shop .longe-integral-shop-img-wrap:after {
	    position: relative;
	    content: '';
	    display: block;
	    padding-bottom: 75%;
	}
	.custom-longe-integral-shop .type2 .longe-integral-shop-img-wrap:after{
		padding-bottom:100%;
	}
	.custom-longe-integral-shop .custom-longe-integral-shop-item.type2 {
	    width: calc(50% - 7.5px);
	    display: inline-block;
		padding:15px 0;
	}
	
	.custom-longe-integral-shop .custom-longe-integral-shop-item.type2:nth-child(2n) {
	    margin-left: 15px;
	}
	
	.custom-longe-integral-shop .custom-longe-integral-shop-item.type2 p.longe-integral-shop-name {
	    margin-bottom: 3px;
	}
	.custom-longe-integral-shop .custom-longe-integral-shop-item.type1{
		padding:15px 0;
		display:block
	}
	.custom-longe-integral-shop p.longe-integral-shop-name1  {
	    font-size: 14px;
	    color: #333;
	    height: 36px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    word-wrap:break-word;
	    word-break: break-word;
	    padding: 0;
	    margin: 5px 0;
	    line-height: 1.3;
	    letter-spacing: 1px; 
	}
	.custom-longe-integral-shop p.longe-integral-shop-name1.title1 {
	    height: 38px
	}
	
	.custom-longe-integral-shop .price1 {
	    color: #333333;
	    font-size: 12px;
		display:inline-block;
		line-height: 24px;
	}
	.custom-longe-integral-shop .price1.t2 {
	    color: #333333;
	    font-size: 12px;
		line-height:1;
		display:inline-block;
		float: left;
	}
	.custom-longe-integral-shop .price1 big {
	    font-size: 15px;
	    color: #f24f4c;
	    font-weight: 600
	}
	.custom-longe-integral-shop span.sell-count1 {
	    float: left;
	    font-size: 12px;
	    color: #999;
		text-decoration:line-through
	}
	.custom-longe-integral-shop span.sell-count1.t2 {
	    float: left;
	    font-size: 12px;
	    color: #999;
		line-height:1;
		text-decoration:line-through
	}
	.custom-longe-integral-shop span.sell-count2 {
	    float: right;
	    font-size: 12px;
	    color: #999;
	}
	.custom-longe-integral-shop .integral-price .jifen {
	    font-size: 12px;
	}
	.custom-longe-integral-shop span.btn {
	    width: 80px;
	    line-height: 27px;
	    background-color: #7F8AEF;
	    color: #ffffff;
	    text-align: center;
	    font-size: 13px;
	    border-radius: 4px;
	}
	.flex1 {
	    display:flex;
	    align-items: center;
	    justify-content:space-between
	}
	.flex2 {
	    display:flex;
	    align-items: center;
	    justify-content: center
	}
</style>