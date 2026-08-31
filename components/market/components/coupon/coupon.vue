<template>
	<view>
		<view :style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 0 '+(datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px;'">
			<view class="coupon">
			    <view v-if="datas.content.style_type == 1 || datas.content.style_type == undefined" class="coupon-list">
		            <block v-for="(item,index) in list" >
		                <view class='coupon-list-div' :style="'color: '+(datas.content.font_color==undefined?'#EA3323':datas.content.font_color)+';background-color: '+(datas.content.bg_color==undefined?'#fff':datas.content.bg_color)+';opacity: '+(item.receive_type == 1?'0.4':'1')+';'">
		                    <view class="coupon-left">
		                        <view>
		                            <view class="coupon-left-top">
		                                <block v-if="item.type == 1">
		                                    {{item.foldA}}<span v-if="item.foldB&&item.foldB!=0">{{item.foldB}}</span>
		                                </block>
		                                <block v-else>
		                                    {{item.foldA}}<span v-if="item.foldB&&item.foldB!=0">{{item.foldB}}</span><span>折</span>
		                                </block>
		                            </view>
		                            <view class="coupon-left-btn">
		                                {{item.condition}}
		                            </view>
		                        </view>
		                    </view>
		                    <view class="coupon-right">
		                        <view class="coupon-left-bottom">
		                            <view class="top">
		                                <view class="coupon-left-condndition">
		                                    {{item.name}}
		                                </view>
		                                <view class="coupon-left-time">
		                                    {{item.time}}
		                                </view>
		                            </view>
		                            <view class="bottom">
		                                <block v-if="!item.suit_type || item.suit_type == 1">适用全部商品</block>
		                                <block v-if="item.suit_type == 2">部分商品可用</block>
		                                <block v-if="item.suit_type == 3">部分商品不可用</block>
		                            </view>
		                        </view>
		                        <view class="coupon-btn" :style="'border-left: 1px dashed '+(datas.content.font_color==undefined?'#EA3323':datas.content.font_color)+';'">
		                            <block v-if="item.receive_type != 1">
		                                <block>
		                                    <button :data-coupon="item.id" :data-index="index" @click="get_coupon($event)" :style="'color: '+(datas.content.font_color==undefined?'#EA3323':datas.content.font_color)+';background-color: '+(datas.content.bg_color==undefined?'#fff':datas.content.bg_color)+';'">立即领取</button>
		                                </block>
		                            </block>
		                            <block v-else>
		                                <span class="coupon-span">已领取</span>
		                            </block>
		                        </view>
		                    </view>
		                </view>
		            </block>
			    </view>
			    <view v-if="datas.content.style_type == 2" class="coupon-list-two">
		            <block v-for="(item,index) in list">
		                <view class='coupon-list-two' :style="'color: '+(datas.content.font_color==undefined?'#EA3323':datas.content.font_color)+';background-color: '+(datas.content.bg_color==undefined?'#fff':datas.content.bg_color)+';opacity: '+(item.receive_type == 1?'0.4':'1')+';'">
		                    <view class="coupon-two-left" :style="'border-right: 1px dashed '+(datas.content.font_color==undefined?'#EA3323':datas.content.font_color)+';'">
		                        <view>
		                            <view class="coupon-top">
		                                <block v-if="item.type == 1">
		                                    {{item.foldA}}<span v-if="item.foldB&&item.foldB!=0">{{item.foldB}}</span>
		                                </block>
		                                <block v-else>
		                                    {{item.foldA}}<span v-if="item.foldB&&item.foldB!=0">{{item.foldB}}</span><span>折</span>
		                                </block>
		                            </view>
		                            <view class="coupon-bottom">
		                                {{item.condition}}
		                            </view>
		                        </view>
		                    </view>
		                    <block v-if="item.receive_type == 1">
		                        <view class="coupon-font-vertical">
		                                <view>已领取</view>
		                                <!-- <image class='coupon-image' style="top: 0;" src='{{http_host}}/HTML/admui/public/custom/images/coupon_icon_received.png'></image> -->
		                        </view>
		                    </block>
		                    <block v-else>
		                        <block>
		                            <button class="coupon-font-vertical" :data-coupon="item.id" :data-index="index" @click="get_coupon($event)" :style="'color: '+(datas.content.font_color==undefined?'#EA3323':datas.content.font_color)+';background-color: '+(datas.content.bg_color==undefined?'#fff':datas.content.bg_color)+';'">
		                                <view>立即领取</view>
		                            </button>
		                        </block>
		                    </block>
		                </view>
		            </block>
			    </view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"coupon",
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
			};
		},
		created(){
			var that = this;
			that.get_data();
		},
		methods:{
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
				var params = {
					coupon_id: id_str,
				};
				this.$api.wsypayComponentCouponData(params).then(res=>{
					if (res.errcode == 0) {
					    var content_arr = new Array();
					    if (res.data.length > 0) {
					        for (var i in res.data) {
					            let choose_param = {};
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
					    that.list = content_arr
					} else {
					    uni.showToast({
					        title: res.errmsg,
					        icon: 'none',
					        duration: 2000
					    })
					}
				})
				
			}
		}
	}
</script>

<style>
	/*第一种*/
	button::after{
	    border: none;
	}
	.coupon{
	    padding: 10px;
	}
	.coupon-list .coupon-list-div{
	    display: flex;
	    display: -webkit-box;
	    display: -webkit-flex;
	    align-items: stretch;
	    text-align: center;
	    height: 100px;
	    box-shadow: 0px 0px 4px rgba(49, 49, 49, 0.1);
	    border-radius: 5px;
	    padding: 10px 0;
	    margin-bottom: 10px;
	    box-sizing: border-box;
	}
	.coupon-list .coupon-list-div:nth-last-child(1){
	    margin-bottom: 0;
	}
	.coupon-left{
	    width: 115px;
	    display: flex;
	    display: -webkit-box;
	    display: -webkit-flex;
	    align-items: center;
	    justify-content: center;
	    text-align: center;
	    padding: 5px 0 15px;
	    position: relative;
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
	    padding: 8px 0 0 7px;
	}
	/* .coupon-left-bottom .top{
	    border-bottom: 0.5px dashed rgba(153,153,153,.2);
	    padding-bottom: 8px;
	} */
	.coupon-left-bottom .bottom{
	    font-size: 11px;
	    /* color: #999; */
	    line-height: 1;
	    margin-top: 9px;
	}
	.coupon-left-bottom .coupon-left-condndition{
	    font-size: 15px;
	    line-height: 1.2;
	    margin-bottom: 12px;
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
	    position: relative;
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
	.coupon-list-two .coupon-list-two{
	    width: calc(50% - 5px);
	    height: 100px;
	    padding: 10px 0;
	    box-sizing: border-box;
	    border-radius: 5px;
	    margin-bottom: 10px;
	    display: flex;
	    position: relative;
	    box-shadow: 0px 0px 4px rgba(49, 49, 49, 0.1);
	}
	.coupon-list-two .coupon-two-left{
	    flex: 1;
	    position: relative;
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
	    position: relative;
	    z-index: 5;
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
	.coupon-list-two .coupon-list-two:nth-child(2n){
	    margin-left: 10px;
	}
	.coupon-list-two>view.coupon-list-two:nth-last-child(2) {
	    margin-bottom: 0;
	}
	.coupon-list-two>view.coupon-list-two:nth-last-child(1) {
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
</style>
