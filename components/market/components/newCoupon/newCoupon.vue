<template>
	<!--新优惠券-->
	<view :style="'background-color:'+ (datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image:'+ ((datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none'))+';padding:'+ (datas.content.padding_top+'px '+(datas.content.select_style==1?datas.content.padding_horizontal:0)+'px '+datas.content.padding_bottom)+'px;background-size:cover;'">
		<view class="coupon coupon-new">
		    <view v-if="datas.content.style_type == 1&&datas.content.select_style == 1" class="coupon-list">
	            <block v-for="(items, index) in list">
	                <view class='coupon-list-div' :style="'color: '+(datas.content.voucher_style==1?datas.content.font_color:items.font_color)+';background-color:'+ (datas.content.voucher_style==1?(datas.content.voucher_bg_model==1?datas.content.voucher_bg_color:'transparent'):(items.voucher_bg_model==1?items.voucher_bg_color:'transparent'))+';background-image:'+ (datas.content.voucher_style==1?(datas.content.voucher_bg_model==2?'linear-gradient('+datas.content.voucher_angle+','+datas.content.voucher_color1+','+datas.content.voucher_color2+')':'none'):(items.voucher_bg_model==2?'linear-gradient('+items.voucher_angle+','+items.voucher_color1+','+items.voucher_color2+')':'none'))+';border-radius: '+(datas.content.radius_diy)+'px;position:relative;overflow:hidden;'">
	                    <div class="coupon-mask" :style="'background-color: '+(datas.content.voucher_style==1?(datas.content.voucher_bg_model==1?datas.content.voucher_bg_color:'transparent'):(items.voucher_bg_model==1?items.voucher_bg_color:'transparent'))+';background-image:'+ (datas.content.voucher_style==1?(datas.content.voucher_bg_model==2?'linear-gradient('+datas.content.voucher_angle+','+datas.content.voucher_color1+','+datas.content.voucher_color2+')':'none'):(items.voucher_bg_model==2?'linear-gradient('+items.voucher_angle+','+items.voucher_color1+','+items.voucher_color2+')':'none'))+';'" v-if="(items.receive_type == 1)"></div>
	                    <view class="coupon-left">
	                        <view>
	                            <view class="coupon-left-top (items.receive_type == 1?'coupon-span':'')">
	                                <block v-if="items.type == 1">
	                                    {{items.foldA}}<span v-if="items.foldB&&items.foldB!=0">{{items.foldB}}</span>
	                                </block>
	                                <block v-else>
	                                    {{items.foldA}}<span v-if="items.foldB&&items.foldB!=0">{{items.foldB}}</span><span>折</span>
	                                </block>
	                            </view>
	                            <view class="coupon-left-btn">
	                                {{items.condition}}
	                            </view>
	                        </view>
	                    </view>
	                    <view class="coupon-right">
	                        <view class="coupon-left-bottom flex-def flex-cCenter">
	                            <view>
	                              <view class="top">
	                                <view class="coupon-left-condndition">
	                                    {{items.name}}
	                                </view>
	                                <view class="coupon-left-time">
	                                    {{items.time}}
	                                </view>
	                              </view>
	                              <view class="bottom">
	                                <block v-if="!items.suit_type || items.suit_type == 1">适用全部商品</block>
	                                <block v-if="items.suit_type == 2">部分商品可用</block>
	                                <block v-if="items.suit_type == 3">部分商品不可用</block>
	                              </view>
	                            </view>
	                        </view>
	                        <view class="coupon-btn coupon-btn-new" :style="'border-left: 1px dashed '+(datas.content.voucher_style==1?datas.content.line_color:items.line_color)+';'">
	                            <block v-if="items.receive_type != 1">
	                                <block>
	                                    <button :data-coupon="items.id" :data-index="index" @click="get_coupon" :style="'color: '+(datas.content.voucher_style==1?datas.content.font_color:items.font_color)+';'">立即领取</button>
	                                </block>
	                            </block>
	                            <block v-else>
	                                <!-- <span class="items.receive_type == 1?'coupon-span':''">已领取</span> -->
		                                <span class="coupon-span">已领取</span>
	                            </block>
	                        </view>
	                    </view>
	                </view>
	            </block>
		    </view>
	      <scroll-view :scroll-x="datas.content.select_style == 2?true:false">
	        <view v-if="datas.content.style_type == 2 ||datas.content.select_style == 2" class="coupon-list-two coupon-list-two-new (datas.content.choose_coupon.length % 2 == 0?'two':'') (datas.content.select_style == 2?'coupon-list-two-style2':'')" :style="'padding-left:'+(datas.content.select_style==2?datas.content.padding_left:0)+'px;'">
	            <block v-for="(items,index) in list">
	                <view class="view" :style="'color: '+(datas.content.voucher_style==1?datas.content.font_color:items.font_color)+';background-color: '+(datas.content.voucher_style==1?(datas.content.voucher_bg_model==1?datas.content.voucher_bg_color:'transparent'):(items.voucher_bg_model==1?items.voucher_bg_color:'transparent'))+';background-image: '+(datas.content.voucher_style==1?(datas.content.voucher_bg_model==2?'linear-gradient('+datas.content.voucher_angle+','+datas.content.voucher_color1+','+datas.content.voucher_color2+')':'none'):(items.voucher_bg_model==2?'linear-gradient('+items.voucher_angle+','+items.voucher_color1+','+items.voucher_color2+')':'none'))+';border-radius: '+(datas.content.radius_diy)+'px;position:relative;overflow:hidden;'">
	                    <view class="coupon-mask" :style="'background-color: '+(datas.content.voucher_style==1?(datas.content.voucher_bg_model==1?datas.content.voucher_bg_color:'transparent'):(items.voucher_bg_model==1?items.voucher_bg_color:'transparent'))+';background-image: '+(datas.content.voucher_style==1?(datas.content.voucher_bg_model==2?'linear-gradient('+datas.content.voucher_angle+','+datas.content.voucher_color1+','+datas.content.voucher_color2+')':'none'):(items.voucher_bg_model==2?'linear-gradient('+items.voucher_angle+','+items.voucher_color1+','+items.voucher_color2+')':'none'))+';'" v-if="items.receive_type == 1"></view>
	                    <view class="coupon-two-left" :style="'border-right: 1px dashed '+(datas.content.voucher_style==1?datas.content.line_color:items.line_color)+';'">
	                        <view>
	                            <view class="coupon-top">
	                                <block v-if="items.type == 1">
	                                    {{items.foldA}}<span v-if="items.foldB&&items.foldB!=0">{{items.foldB}}</span>
	                                </block>
	                                <block v-else>
	                                    {{items.foldA}}<span v-if="items.foldB&&items.foldB!=0">{{items.foldB}}</span><span>折</span>
	                                </block>
	                            </view>
	                            <view class="coupon-bottom">
	                                {{items.condition}}
	                            </view>
	                        </view>
	                    </view>
	                    <view class="coupon-font-vertical">
	                      <block v-if="items.receive_type == 1">
	                        <view>已领取</view>
	                      </block>  
	                  <!--    <block v-else>
	                        <block v-if="(userInfo)">
	                            <button data-coupon="(items.id)" data-index="(index)" bindtap="get_coupon" style="color: (datas.content.voucher_style==1?datas.content.font_color:items.font_color);">领取</button>
	                        </block> -->
						<block v-else>
	                          <block>
	                              <!-- <button class="coupon-font-vertical" :data-coupon="items.id" :data-index="index" @click="get_coupon($event)" :style="'color: '+(datas.content.font_color==undefined?'#EA3323':datas.content.font_color)+';background-color: '+(datas.content.bg_color==undefined?'#fff':datas.content.bg_color)+';'"> -->
								  <button class="coupon-font-vertical" :data-coupon="items.id" :data-index="index" @click="get_coupon($event)" :style="'color: '+(datas.content.font_color==undefined?'#EA3323':datas.content.font_color)+';'">
	                                  <view>领取</view>
	                              </button>
	                          </block>
	                      </block>
	                  </view>
	                </view>
	            </block>
		      </view>
	      </scroll-view>
		</view>
	</view>
	

</template>

<script>
	export default {
		name:"newCoupon",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				http_host: this.vuex_apiUrl,
				list: [],
			}
		},
		created(){
			var that = this;
			that.get_data();
		},
		methods: {
			// 领取优惠券
			get_coupon:function(e){
			    let that = this;
				
				if(that.vuex_user.user_id <= 0){
					uni.showModal({
						title: '提示',
						content: "请先登陆",
						confirmText: '登录',
						success: function(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: '/public/pages/user/login?back_route='+"/pages/index/index"
								})
							} else if (res.cancel) {}
						}
					});
					return;
				}
				
			    let coupon_id = e.currentTarget.dataset.coupon;
			    let index = e.currentTarget.dataset.index;
				var params = {
					coupon_id: coupon_id,
				};
				this.$api.wsypayReceiveCoupon(params).then(res=>{
					if (res.errcode == 0) {
					    if(res.no_other == 1){
					        let receive_type = `list[${index}].receive_type`;
					        that.list[index].receive_type = res.no_other
					    }
						uni.showToast({
							title: res.errmsg,
							icon: 'success',
					        duration: 2000
						})
					} else {
					    uni.showToast({
					        title: res.errmsg,
					        icon: 'none',
					        duration: 2000
					    })
					}
				})
			},
			// 初始化优惠券数据
			get_data:function(){
				let that = this;
				let id_str = "";
				let id_arr = [];
				for (var i in that.datas.content.choose_coupon){
						id_arr.push(that.datas.content.choose_coupon[i].id);
					}
				id_str = id_arr.join(',');
				console.log(id_str)
				var params = {
						coupon_id: id_str,
					};
					this.$api.wsypayComponentCouponData(params).then(res=>{
						console.log(res)
						if (res.errcode == 0) {
							var content_arr = new Array();
							if (res.data.length > 0) {
								for (var i in res.data) {
									let choose_param = {};
									choose_param = that.datas.content.choose_coupon[i];
									choose_param['id'] = res.data[i].id;
									choose_param['condition'] = res.data[i].condition;
									choose_param['type'] = res.data[i].coupon_type;
									choose_param['time'] = res.data[i].valid_time;
									choose_param['fold'] = res.data[i].discount; 
									choose_param['foldA'] = that.$common.toPrice(res.data[i].discount,true); 
									choose_param['foldB'] = that.$common.toPrice(res.data[i].discount,false); 
									choose_param['receive_type'] = res.data[i].receive_type;
									choose_param['suit_type'] = res.data[i].suit_type ? res.data[i].suit_type : '';
									choose_param['name'] = res.data[i].name;
									content_arr.push(choose_param);
								}
							}
							console.log(content_arr);
							that.list = content_arr
						} else {
						uni.showToast({
								title: res.errmsg,
								icon: 'none',
								duration: 2000
							})
						}
				})
			},
		}
	}
</script>

<style>
/*优惠券start*/
/*第一种*/
button::after{
  border: none;
}
.coupon-list .coupon-list-div{
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: stretch;
  text-align: center;
  height: 100px;
  /* box-shadow: 0px 0px 4px rgba(49, 49, 49, 0.1); */
  border-radius: 5px;
  padding: 10px 0;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.coupon-list .coupon-list-div:nth-last-child(1){
  margin-bottom: 0;
}
.coupon-left{
  width: 30%;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5px 0 15px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.coupon-left-top{
  font-size: 27px;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-weight: 600;
}
.coupon-left-btn{
  font-size: 11px;
  line-height: 1;
}
.coupon-left-top>span{
  font-size: 18px;
}
.coupon-left-bottom{
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  text-align: left;
  font-size: 13px;
}
/* .coupon-left-bottom .top{
  border-bottom: 0.5px dashed rgba(153,153,153,.2);
  padding-bottom: 8px;
} */
.coupon-left-bottom .bottom{
  font-size: 11px;
  /* color: #999; */
  line-height: 1;
  margin-top: 6px;
}
.coupon-left-bottom .coupon-left-condndition{
  font-size: 15px;
  line-height: 1.2;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
}
.coupon-left-bottom .coupon-left-time{
  font-size: 12px;
  line-height: 1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}
.coupon-right{
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  /* background-color: #fff; */
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.coupon-right .coupon-btn{
  width: 84px;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
}
.coupon-right .coupon-btn>button,.coupon-right .coupon-btn>span{
  font-size: 15px;
  display: inline-block;
  font-weight: 600;
  padding: 0;
}
.coupon-right .coupon-btn>span.coupon-span{
  /* background: none;
  color: #FFA443;
  border: 1px solid #FFA443; */
  box-sizing: border-box;
  font-weight: 600;
}

/*第二种样式*/
.coupon-list-two{
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  align-items: stretch;
}
.coupon-list-two .view{
  width: calc(50% - 5px);
  height: 100px;
  padding: 10px 0;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  /* box-shadow: 0px 0px 4px rgba(49, 49, 49, 0.1); */
}
.coupon-list-two .coupon-two-left{
  flex: 1;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
}
/* .coupon-list-two .coupon-two-left::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  top: -5px;
  right: -5px;
  background: #ffffff;
}

.coupon-list-two .coupon-two-left::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  bottom: -5px;
  right: -5px;
  background: #ffffff;
} */
.coupon-list-two .coupon-font-vertical{
  width: 52.5px;
  font-size: 14px;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 0;
}
.coupon-list-two .coupon-font-vertical::after{
  border: none;
}
.coupon-list-two .coupon-font-vertical>view{
  display: inline-block;
  width: 14px;
  line-height: 1.2;
}
.coupon-list-two>view:nth-child(2n){
  margin-left: 10px;
}
.coupon-list-two>view:nth-last-child(2) {
  margin-bottom: 0;
}
.coupon-list-two>view:nth-last-child(1) {
  margin-bottom: 0;
}
.coupon-list-two .coupon-top{
  font-size: 27px;
  z-index: 5;
  font-weight: 600;
}
.coupon-list-two .coupon-top>span{
  font-size: 18px;
}
.coupon-list-two .coupon-bottom{
  font-size: 11px;
  line-height: 1;
}
.coupon-image{
  width: 46px;
  height: 51px;
  position: absolute;
  right: 0;
}
/*优惠券end*/
/*新优惠券start*/
.coupon-right .coupon-btn-new{
  width: 53px;
}
.coupon-right .coupon-btn-new>span,.coupon-right .coupon-btn-new>button,.coupon-list-two-new .coupon-font-vertical>view,.coupon-list-two-new .coupon-font-vertical button {
  width: 15px;
  line-height: 1.2;
  font-size: 15px;
  background: transparent;
  font-weight: initial;

}
.coupon-new .coupon-left-top>span {
  font-size: 15px;
}
.coupon-new .coupon-list-two .coupon-top,.coupon-new .coupon-left-top {
    font-size: 21px;
}
.coupon-new .coupon-list-two .coupon-top>span {
    font-size: 15px;
}
.coupon-new .coupon-list-two .coupon-bottom,.coupon-new .coupon-left-btn {
    font-size: 13px;
}
.coupon-new .coupon-list-two .coupon-font-vertical>span,.coupon-new .coupon-right .coupon-btn>span,.coupon-right .coupon-btn-new>button {
    font-weight: initial;
}
.coupon-list-two-new>view {
  height: 77px!important;
}
.coupon-list-two-style2{
  flex-wrap: nowrap;
}
.coupon-list-two-style2 .view {
  height: 72px;
  margin-bottom: 0px!important;
  margin-left:0px!important;
  margin-right: 10px;
  flex: 0 0 122.5px;
}

.coupon-list-two-style2 .coupon-font-vertical {
    width: 31px;
}
.coupon-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: black;
}
/*新优惠券end*/
</style>
