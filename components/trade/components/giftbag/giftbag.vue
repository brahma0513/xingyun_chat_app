 <template>
	
	<view
		:style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 0'+(datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px;'">
		<view class="custom-giftbag">
			<navigator :class="'custom-giftbag-item '+(datas.content.css_type==1? 'two-line':'one-line')+(datas.content.scale!=undefined?(datas.content.scale==1?' one-height':datas.content.scale==2?' two-height':' three-height'):'three-height')" 
			hover-class='no-hover' :url="'/giftbag/pages/productDetail/productDetail?id='+it.id"  
				v-for="(it,idx) in list" v-if="idx < datas.content.show_num">
				<view class="giftbag-img" @click="$common.diyLinkJump('/giftbag/web/index.php?m=giftbag&a=index#/productDetail?id='+it.id)">
					<image :src="it.url"></image>
				</view>
				<p class="giftbag-title">{{it.pro_name}}</p>
				<view class="giftbag-privilege" v-if="it.privilege_price&&it.privilege_price!=undefined">
					<view class="left">{{privilege_name}}</view>
					<view class="right">
						{{it.show_monetary_unit}}<big>{{it.privilege_priceA}}</big>{{it.privilege_priceB}}
					</view>
				</view>
				<span
					:class="'price price-'+price_color">{{monetary_unit}}<big>{{it.now_priceA}}</big>{{it.now_priceB}}</span>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		name: "giftbag",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				list: [],
				privilege_name: "特权价",
				price_color: '',
				monetary_unit: ''
			};
		},
		created() {
			var _this = this;
			_this.get_list()
		},
		methods: {
			get_list() {
				const that = this

				var params = {
					'user_id': this.vuex_user.user_id,
					'type_id': that.datas.content.selector_id,
					'page_size': that.datas.content.show_num
				};
				this.$api.getGiftbagProList(params).then(res => {
					if (res.errcode == 0) {
						res.data.forEach(function(item, index) {
							item.now_price = parseFloat(item.now_price).toFixed(2);
							item.now_priceA = that.$common.toPrice(item.now_price, true);
							item.now_priceB = that.$common.toPrice(item.now_price, false);
							if (item.privilege_price) {
								item.privilege_priceA = that.$common.toPrice(item.privilege_price, true);
								item.privilege_priceB = that.$common.toPrice(item.privilege_price, false);
							}
						})
						that.list = res.data,
						that.privilege_name = res.privilege_name
					} else {
						console.log('订单数量')
					}
				})
			}
	}
	}
</script>

<style>/*大礼包组件start*/
.custom-giftbag {
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 0 15px;
    box-sizing: border-box;
}
.custom-giftbag-item{
    padding: 15px 0 10px 0;
	width:100%;
    display:block;
    box-sizing: border-box;
}
.custom-giftbag-item .giftbag-img {
    width: 100%;
    position:relative;
    overflow: hidden;
    border-radius: 4px;
}
.custom-giftbag-item .giftbag-img:after{
    position:relative;
	content:'';
	display:block;
	padding-bottom:100%;
}
.custom-giftbag-item .giftbag-img image {
    width: 100%;
	height: 100%;
	position:absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.custom-giftbag-item.two-line {
    width: calc(50% - 7.5px);
    display: inline-block;
    vertical-align: top;
}
.custom-giftbag-item.two-line:nth-child(2n){
	margin-left:15px;
}
.custom-giftbag-item.one-line.one-height .giftbag-img:after{
	position:relative;
	content:'';
	display:block;
	padding-bottom:100%;
}
.custom-giftbag-item.one-line.two-height .giftbag-img:after{
	position:relative;
	content:'';
	display:block;
	padding-bottom:66.66%;
}
.custom-giftbag-item.one-line.three-height .giftbag-img:after{
	position:relative;
	content:'';
	display:block;
	padding-bottom:51%;
}
.custom-giftbag .giftbag-title{
	font-size: 13px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
    line-height: 1.5;
    margin: 8px 0;
	height:36px;
}
.custom-giftbag .price{
	margin-top:2px;
	font-size:12px;
    color:#f24f4c;
    line-height: 1;
}
.custom-giftbag .price big{
	font-size:15px;
}
.custom-giftbag .giftbag-privilege{
    display: -webkit-box; 
    display: -moz-box; 
    display: -ms-flexbox;
    display: -webkit-flex; 
    display: flex;
    -webkit-box-align: stretch;
    -moz-align-items: stretch;
    -webkit-align-items: stretch;
    align-items: stretch;
    height: 16px;
    margin-bottom: 8px;
    line-height: 16px;
}
.custom-giftbag .giftbag-privilege>view{
    line-height: 16px;
}
.custom-giftbag .giftbag-privilege .left{
    background-color: #2B2821;
    padding: 0 4px;
    font-size: 11px;
    color: #F1DFC9;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}
.custom-giftbag .giftbag-privilege .right{
    padding: 0 4px;
    background-color: #F3D0B4; /* 不支持线性的时候显示 */
    background-image: linear-gradient(to right, #FCDCC1 , #F3D0B4);
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    color: #160F06;
    font-size: 10px;
}
.custom-giftbag .giftbag-privilege .right big{
    font-size: 13px;
}

</style>
