<template>
	<view :style="'background-color: '+(item.content.select_bg_model==1?item.content.bg_color:'transparent')+';background-image: '+(item.content.select_bg_model==2?'linear-gradient('+item.content.gradient_angle+','+item.content.gradient_color1+','+item.content.gradient_color2+')':item.content.select_bg_model==3?'url('+item.content.bg_img+')':'none')+';padding: '+(item.content.padding_top+'px '+(item.content.display_method==2?item.content.padding_horizontal:0)+'px '+item.content.padding_bottom)+'px;background-size:cover;'">
	  <!--样式一-->
	  <view class="grab-coupon grab-coupon-new" :style="'padding: 12px '+(item.content.display_method==1?item.content.padding_horizontal:item.content.padding_horizontal2)+'px;border-radius: '+(item.content.display_method==2&&item.content.select_style==1?item.content.radius_diy:0)+'px;background-color: '+(item.content.display_method==1?'white':item.content.display_method==2&&item.content.card_select_bg_model==1?item.content.card_bg_color:'transparent')+';background-image: '+(item.content.display_method==2&&item.content.card_select_bg_model==2&&item.content.select_style==1?'linear-gradient('+item.content.card_gradient_angle+','+item.content.card_gradient_color1+','+item.content.card_gradient_color2+')':'none')+';background-size:cover;'" v-if="item.content.select_style==1">
	      <view class="grab-coupon-top flex-def">
	          <view class="grab-coupon-top-left margin-right-10 flex-def">
	              <image class="grab-title-img" :src="item.content.title_img" alt=""></image>
	              <image class="grab-jiantou-img" :src="http_host+'/HTML/admui/public/custom/images/grab_coupon_jiantou.png'" alt=""></image>
	          </view>
	          <view class="grab-coupon-top-right flex-one flex-def flex-cCenter">
	              <block v-for="(itm,index) in item.content.dataset">
	                  <view class="grab-li" v-if="itm.start_time&&itm.end_time" @click="grab_coupon_tab" :data-num="index">
	                      <view class="grab-li-time" :style="'color: '+((item.content.tab_index==index?item.content.theme_bg_color:'#333'))+';'">{{itm.start_time}}</view>
	                      <view class="grab-li-text" :style="'color: '+((item.content.tab_index==index?'#fff':'#666'))+';background-color: '+((item.content.tab_index==index?item.content.theme_bg_color:'transparent'))+';'">
	                          <block v-if="itm.type==1">即将开始</block>
	                          <block v-if="itm.type==2">热抢中</block>
	                          <block v-if="itm.type==3">已结束</block>
	                      </view>
	                  </view>
	              </block>
	          </view>
	      </view>
	      <view class="grab-coupon-bottom">
	          <view class="grab-coupon-zero flex-def flex-cCenter flex-zCenter" v-if="item.content.dataset[item.content.tab_index].choose_coupon.length==0">
	              <image :src="http_host+'/HTML/admui/public/custom/images/grab_coupon_no.png'" alt=""></image><view>暂无优惠券</view>
	          </view>
	          <view class="grab-coupon-one" v-if="item.content.dataset[item.content.tab_index].choose_coupon.length==1">
	              <view class="flex-def flex-cStretch">
	                  <view class="grab-coupon-one-left flex-one flex-def" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1||item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100)?'#F5F5F7':item.content.grab_coupon_bg_color))+';'">
	                      <view class="grab-price flex-def flex-cCenter" :style="'color: '+(((item.content.dataset[item.content.tab_index].type==3||item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1||item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100)?'#CACACE':item.content.theme_bg_color))+';'">
	                        <block v-if="item.content.dataset[item.content.tab_index].choose_coupon[0].type==1">
	                            {{item.content.dataset[item.content.tab_index].choose_coupon[0].fold}}
	                        </block>
	                        <block v-else>
	                            {{item.content.dataset[item.content.tab_index].choose_coupon[0].fold}}<span style="font-size:15px">折</span>
	                        </block>
	                      </view>
	                      <view class="grab-text flex-def flex-cCenter">
	                          <view>
	                              <view class="grab-name" :style="'color: '+(((item.content.dataset[item.content.tab_index].type==3||item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1||item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100)?'#CACACE':item.content.theme_bg_color))+';'">{{item.content.dataset[item.content.tab_index].choose_coupon[0].name}}</view>
	                              <view class="grab-progress">
	                                  <view class="grab-line" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1||item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100)?'#CACACE':item.content.theme_bg_color))+';width: '+((item.content.dataset[item.content.tab_index].type==2?item.content.dataset[item.content.tab_index].choose_coupon[0].percentage:'100'))+'%;'"></view>
	                                  <view class="grab-line-bg" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1||item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100)?'#CACACE':item.content.theme_bg_color))+';'"></view>
	                                  <view class="grab-line-text">
	                                      <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                                      <block v-if="item.content.dataset[item.content.tab_index].type==2"><block v-if="item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100">已抢完</block><block v-else>已抢{{item.content.dataset[item.content.tab_index].choose_coupon[0].percentage}}%</block></block>
	                                      <block v-if="item.content.dataset[item.content.tab_index].type==3">已结束</block>
	                                  </view>
	                              </view>
	                          </view>
	                      </view>
	                  </view>
	                  <block v-if="userInfo">
	                    <view class="grab-coupon-one-btn flex-def flex-cCenter flex-zCenter" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1||item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100)?'#F5F5F7':item.content.grab_coupon_bg_color))+';color: '+(((item.content.dataset[item.content.tab_index].type==3||item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1||item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100)?'#CACACE':item.content.theme_bg_color))+';'" @click="grab_coupon" :data-type="item.content.dataset[item.content.tab_index].type" :data-receive_type="item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type" :data-percentage="item.content.dataset[item.content.tab_index].choose_coupon[0].percentage" :data-num="0">
	                      <view class="grab-coupon-one-border" :style="'border-color: '+(((item.content.dataset[item.content.tab_index].type==3||item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1||item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100)?'#DDDEE2':item.content.theme_bg_color))+';'"></view>
	                      <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                      <block v-else><block v-if="item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1">已领取</block><block v-else>领取</block></block>
	                    </view>
	                  </block>
	              </view>
	          </view>
	          <view class="grab-coupon-two padding-right-0" v-if="item.content.dataset[item.content.tab_index].choose_coupon.length==2">
	              <view class="flex-def flex-cStretch">
	                  <view class="flex-one flex-def flex-cStretch" v-for="(itm,index) in item.content.dataset[item.content.tab_index].choose_coupon">
	                      <view class="grab-coupon-two-left flex-one flex-def flex-cCenter flex-zCenter text-center" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#F5F5F7':item.content.grab_coupon_bg_color))+';'">
	                          <view class="flex-def flex-cCenter flex-zTopBottom" style="width:100%">
	                              <view class="grab-price" :style="'color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';'">
	                                <block v-if="itm.type==1">
	                                  {{itm.fold}}
	                                </block>
	                                <block v-else>
	                                  {{itm.fold}}<span style="font-size:30rpx">折</span>
	                                </block> 
	                              </view>
	                              <view class="grab-name" :style="'color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';'">{{itm.name}}</view>
	                              <view class="grab-progress">
	                                  <view class="grab-line" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';width: '+((item.content.dataset[item.content.tab_index].type==2?itm.percentage:'100'))+'%;'"></view>
	                                  <view class="grab-line-bg" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';'"></view>
	                                  <view class="grab-line-text">
	                                      <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                                      <block v-if="item.content.dataset[item.content.tab_index].type==2"><block v-if="itm.percentage==100">已抢完</block><block v-else>已抢{{itm.percentage}}%</block></block>
	                                      <block v-if="item.content.dataset[item.content.tab_index].type==3">已结束</block>
	                                  </view>
	                              </view>
	                          </view>
	                      </view>
	                      <block v-if="userInfo">
	                        <view class="grab-coupon-two-btn flex-def flex-cCenter flex-zCenter" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#F5F5F7':item.content.grab_coupon_bg_color))+';color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';'" @click="grab_coupon" :data-type="item.content.dataset[item.content.tab_index].type" :data-receive_type="itm.receive_type" :data-percentage="itm.percentage" :data-num="index">
	                          <view class="grab-coupon-two-border" :style="'border-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#DDDEE2':item.content.theme_bg_color))+';'"></view>
	                          <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                          <block v-else><block v-if="itm.receive_type==1">已领取</block><block v-else>领取</block></block>
	                        </view>
	                      </block>
	                  </view>
	              </view>
	          </view>
	          <view class="grab-coupon-three" v-if="item.content.dataset[item.content.tab_index].choose_coupon.length>2">
	              <scroll-view scroll-x="true" class="grab-coupon-three-scroll">
	                <!-- <view class="grab-coupon-three-content flex-def flex-cStretch"> -->
	                  <view class="grab-coupon-three-content" v-for="(itm,index) in item.content.dataset[item.content.tab_index].choose_coupon">
	                      <view class="grab-coupon-three-left flex-def flex-cCenter flex-zCenter" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#F5F5F7':item.content.grab_coupon_bg_color))+';'">
	                          <view class="flex-def flex-cCenter flex-zTopBottom">
	                              <view class="grab-price" :style="'color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';'">
									  <block v-if="itm.type==1">
									    {{itm.fold}}
									  </block>
									  <block v-else>
									    {{itm.fold}}<span style="font-size:30rpx">折</span>
									  </block> 
								  </view>
	                              <view class="grab-name" :style="'color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';'">{{itm.name}}</view>
	                              <view class="grab-progress">
	                                  <view class="grab-line" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';width: '+((item.content.dataset[item.content.tab_index].type==2?itm.percentage:'100'))+'%;'"></view>
	                                  <view class="grab-line-bg" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';'"></view>
	                                  <view class="grab-line-text">
	                                      <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                                      <block v-if="item.content.dataset[item.content.tab_index].type==2"><block v-if="itm.percentage==100">已抢完</block><block v-else>已抢{{itm.percentage}}%</block></block>
	                                      <block v-if="item.content.dataset[item.content.tab_index].type==3">已结束</block>
	                                  </view>
	                              </view>
	                          </view>
	                      </view>
	                      <block v-if="userInfo">
	                        <view class="grab-coupon-three-btn flex-def flex-cCenter flex-zCenter" :style="'background-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#F5F5F7':item.content.grab_coupon_bg_color))+';color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#CACACE':item.content.theme_bg_color))+';'" @click="grab_coupon" :data-type="item.content.dataset[item.content.tab_index].type" :data-receive_type="itm.receive_type" :data-percentage="itm.percentage" :data-num="index">
	                            <view class="grab-coupon-three-border" :style="'border-color: '+(((item.content.dataset[item.content.tab_index].type==3||itm.receive_type==1||itm.percentage==100)?'#DDDEE2':item.content.theme_bg_color))+';'"></view>
	                            <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                            <block v-else><block v-if="itm.receive_type==1">已领取</block><block v-else>领取</block></block>
	                        </view>
	                      </block>
	                  </view>
	                <!-- </view> -->
	              </scroll-view>
	          </view>
	      </view>
	  </view>
	  <!-- 样式二 -->
	  <view class="grab-coupon-style2" v-if="item.content.select_style==2">
	    <view class="grab-coupon-top grab-coupon-top-new flex-def">
	        <view class="grab-coupon-top-title" :style="'background-color: '+(item.content.theme_select_bg_model==1?item.content.theme_bg_color:'transparent')+';background-image: '+(item.content.theme_select_bg_model==2?'linear-gradient('+item.content.theme_gradient_angle+','+item.content.theme_gradient_color1+','+item.content.theme_gradient_color2+')':'none')+';color: '+(item.content.coupon_title_color)">
	            <view style="width:2.5em;font-weight:800;">
	              {{item.content.coupon_title}}
	            </view>
	        </view>
	        <view class="grab-coupon-top-title-ul flex-def flex-cCenter flex-zEnd">
	          <view class="grab-coupon-top-right flex-def flex-cCenter">
	            <block v-for="(itm,index) in item.content.dataset">
	                <view class="grab-li" v-if="itm.start_time&&itm.end_time" @click="grab_coupon_tab" :data-num="index">
	                    <view class="grab-li-time" :style="'color: '+(item.content.tab_index==index&&item.content.theme_select_bg_model==1?item.content.theme_bg_color:item.content.tab_index==index&&item.content.theme_select_bg_model==2?item.content.theme_gradient_color1:'#333')+';'">{{itm.start_time}}</view>
	                    <view class="grab-li-text" :style="'color: '+(item.content.tab_index==index?'#fff':'#666')+';background-color: '+(item.content.tab_index==index&&item.content.theme_select_bg_model==1?item.content.theme_bg_color:'transparent')+';background-image: '+(item.content.tab_index==index&&item.content.theme_select_bg_model==2?'linear-gradient('+item.content.theme_gradient_angle+','+item.content.theme_gradient_color1+','+item.content.theme_gradient_color2+')':'none')">
	                        <block v-if="itm.type==1">即将开始</block>
	                        <block v-if="itm.type==2">热抢中</block>
	                        <block v-if="itm.type==3">已结束</block>
	                    </view>
	                </view>
	            </block>
	          </view>
	        </view>
	    </view>
	    <view class="grab-coupon-bottom" :style="'padding: 0px '+(item.content.display_method==1?item.content.padding_horizontal:item.content.padding_horizontal2)+'px 12px'">
	      <view class="grab-coupon-zero flex-def flex-cCenter flex-zCenter" v-if="item.content.dataset[item.content.tab_index].choose_coupon.length==0">
	          <image :src="http_host+'/HTML/admui/public/custom/images/grab_coupon_no.png'" alt=""></image><view>暂无优惠券</view>
	      </view>
	      <!--一张券-->
	      <view :class="'grab-coupon-one flex-def flex-cCenter flex-zCenter '+((item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1&&item.content.dataset[item.content.tab_index].type==2)||(item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100&&item.content.dataset[item.content.tab_index].type==2)||item.content.dataset[item.content.tab_index].type==3 ? 'used-one-bg':item.content.dataset[item.content.tab_index].choose_coupon[0].type==2?'discount-one-bg':'coupon-one-bg')" v-if="item.content.dataset[item.content.tab_index].choose_coupon.length==1">
	        <view class="grab-coupon-one-choose-coupon-type">
	            <block v-if="item.content.dataset[item.content.tab_index].choose_coupon[0].type==1">代金券</block><block v-else>折扣券</block>
	        </view>
	        <view class="flex-def flex-cEnd flex-zBetween" style="width:100%">
	              <view class="grab-coupon-one-left flex-one flex-def flex-cEnd">
	                  <view class="grab-price flex-def flex-cBaseline">
	                    <block v-if="item.content.dataset[item.content.tab_index].choose_coupon[0].type==1">
	                        <span style="font-size:30rpx">￥</span>{{item.content.dataset[item.content.tab_index].choose_coupon[0].fold}}
	                    </block>
	                    <block v-else>
	                        {{item.content.dataset[item.content.tab_index].choose_coupon[0].fold}}<span style="font-size:30rpx">折</span>
	                    </block>
	                  </view>
	                  <view class="grab-text flex-def flex-cCenter">
	                      <view :class="((item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1&&item.content.dataset[item.content.tab_index].type==2)||(item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100&&item.content.dataset[item.content.tab_index].type==2)||item.content.dataset[item.content.tab_index].type==3 ? 'used-one-text':item.content.dataset[item.content.tab_index].choose_coupon[0].type==2&&item.content.dataset[item.content.tab_index].type==1?'discount-start-one-text':item.content.dataset[item.content.tab_index].choose_coupon[0].type==2&&item.content.dataset[item.content.tab_index].type==2?'discount-one-text':item.content.dataset[item.content.tab_index].choose_coupon[0].type==1&&item.content.dataset[item.content.tab_index].type==1?'coupon-start-one-text':'coupon-one-text')">
	                          <view class="grab-name">{{item.content.dataset[item.content.tab_index].choose_coupon[0].name}}</view>
	                          <view class="flex-def flex-cCenter">
	                            <view class="grab-progress">
	                                <view class="grab-line" :style="'width: '+((item.content.dataset[item.content.tab_index].type==2?item.content.dataset[item.content.tab_index].choose_coupon[0].percentage:'0'))+'%;'"></view>
	                                <view class="grab-line-bg"></view>
	                            </view>
	                            <view class="grab-line-text">
	                                <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                                <block v-if="item.content.dataset[item.content.tab_index].type==2"><block v-if="item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100">已抢完</block><block v-else>已抢{{item.content.dataset[item.content.tab_index].choose_coupon[0].percentage}}%</block></block>
	                                <block v-if="item.content.dataset[item.content.tab_index].type==3">已结束</block>
	                            </view>
	                          </view>
	                      </view>
	                  </view>
	              </view>
	              <block v-if="userInfo">
	                <view :class="'grab-coupon-one-type '+ ((item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1&&item.content.dataset[item.content.tab_index].type==2)||(item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100&&item.content.dataset[item.content.tab_index].type==2)||item.content.dataset[item.content.tab_index].type==3 ? 'used-one-type':item.content.dataset[item.content.tab_index].choose_coupon[0].type==2&&item.content.dataset[item.content.tab_index].type==1?'discount-start-one-type':item.content.dataset[item.content.tab_index].choose_coupon[0].type==2&&item.content.dataset[item.content.tab_index].type==2?'discount-one-type':item.content.dataset[item.content.tab_index].choose_coupon[0].type==1&&item.content.dataset[item.content.tab_index].type==1?'coupon-start-one-type':'coupon-one-type')" @click="grab_coupon" :data-type="item.content.dataset[item.content.tab_index].type" :data-receive_type="item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type" :data-percentage="item.content.dataset[item.content.tab_index].choose_coupon[0].percentage" data-num="0">
	                  <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                  <block v-if="item.content.dataset[item.content.tab_index].type==3">已结束</block>
	                  <block v-if="item.content.dataset[item.content.tab_index].type==2">
	                    <block v-if="item.content.dataset[item.content.tab_index].choose_coupon[0].percentage==100">已抢完</block>
	                    <block v-else-if="item.content.dataset[item.content.tab_index].choose_coupon[0].receive_type==1">已领取</block>
	                    <block v-else>领取</block>
	                  </block>
	                </view>
	              </block>	              
	          </view>
	      </view>
	      <!--一张券end-->
	      <!--多张券-->
	      <scroll-view scroll-y="true" class="grab-coupon-more padding-right-0" v-if="item.content.dataset[item.content.tab_index].choose_coupon.length>=2">
	          <view :class="'flex-def flex-wrap flex-zBetween '+((item.content.dataset[item.content.tab_index].choose_coupon.length % 2 == 0?'two':'one'))">
	            <view :class="((itm.receive_type==1&&item.content.dataset[item.content.tab_index].type==2)||(itm.percentage==100&&item.content.dataset[item.content.tab_index].type==2)||item.content.dataset[item.content.tab_index].type==3 ? 'used-more-bg':itm.type==2?'discount-more-bg':'coupon-more-bg')+' '+(item.content.dataset[item.content.tab_index].choose_coupon.length<=2?'margin-0':'')" v-for="(itm,index) in item.content.dataset[item.content.tab_index].choose_coupon">
	              <view class="grab-coupon-one-choose-coupon-type">
	                  <block v-if="itm.type==1">代金券</block><block v-else>折扣券</block>
	              </view>
	              <view class="grab-coupon-more-left flex-one flex-def flex-cCenter flex-zCenter">
	                <view style="width:100%">
	                  <view class="grab-price flex-def flex-cBaseline">
	                    <block v-if="itm.type==1">
	                        <span style="font-size:30rpx">￥</span>{{itm.fold}}
	                    </block>
	                    <block v-else>
	                        {{itm.fold}}<span style="font-size:30rpx">折</span>
	                    </block>
	                  </view>
	                  <view class="flex-def flex-cCenter flex-zBetween">  
	                    <view class="flex-one">
	                      <view class="grab-name">{{itm.name}}</view>
	                      <view class="grab-progress" style="margin-top:1.5em">
	                        <view class="grab-line" :style="'width: '+((item.content.dataset[item.content.tab_index].type==2?itm.percentage:'0'))+'%;'"></view>
	                        <view class="grab-line-bg"></view>
	                      </view>
	                    </view>  
	                    <view style="text-align:center">
	                      <block v-if="userInfo">
	                        <view style="margin: 0 auto;" :class="'grab-coupon-one-type '+((itm.receive_type==1&&item.content.dataset[item.content.tab_index].type==2)||(itm.percentage==100&&item.content.dataset[item.content.tab_index].type==2)||item.content.dataset[item.content.tab_index].type==3 ? 'used-one-type':itm.type==2&&item.content.dataset[item.content.tab_index].type==1?'discount-start-one-type':itm.type==2&&item.content.dataset[item.content.tab_index].type==2?'discount-one-type':itm.type==1&&item.content.dataset[item.content.tab_index].type==1?'coupon-start-one-type':'coupon-one-type')" @click="grab_coupon" :data-type="item.content.dataset[item.content.tab_index].type" :data-receive_type="itm.receive_type" :data-percentage="itm.percentage" :data-num="index">
	                          <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                          <block v-if="item.content.dataset[item.content.tab_index].type==3">已结束</block>
	                          <block v-if="item.content.dataset[item.content.tab_index].type==2">
	                            <block v-if="itm.percentage==100">已抢完</block>
	                            <block v-else-if="itm.receive_type==1">已领取</block>
	                            <block v-else>领取</block>
	                          </block>
	                        </view>
	                      </block>
	                      <view class="grab-line-text" style="margin-top:12rpx">
	                          <block v-if="item.content.dataset[item.content.tab_index].type==1">即将开始</block>
	                          <block v-if="item.content.dataset[item.content.tab_index].type==2"><block v-if="itm.percentage==100">已抢完</block><block v-else>已抢{{itm.percentage}}%</block></block>
	                          <block v-if="item.content.dataset[item.content.tab_index].type==3">已结束</block>
	                      </view>
	                    </view>
	                  </view>
	                </view>
	              </view>
	            </view>
	          </view>
	      </scroll-view>
	      <!--多张券end-->
	    </view>
	    <!--样式二end-->
	  </view>
	</view>
</template>

<script>
	export default {
		name: "newGrabCoupon",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: '',
				user_id: 0,
				userInfo: {},
				item: [],
				canIUseGetUserProfile: false,
			};
		},
		created() {
			var that = this;
			that.http_host = this.vuex_apiUrl;
			that.user_id = this.vuex_user.user_id;
			that.userInfo = this.vuex_user;
			
			var that = this;
			var grab_arr = [];
			if (that.datas.content.title_img.indexOf("../..") != -1) {
				that.datas.content.title_img = that.datas.content.title_img.replace('../..', that.http_host);
			}
			that.datas.content.dataset.forEach((it,ind)=>{
				if(that.grab_period_judge(it)==2){
					grab_arr.push(ind);
				}
				it.type = that.grab_period_judge(it);
			})
			if(grab_arr.length>0){
				that.datas.content.tab_index = grab_arr[0];
			}
			that.item = that.datas
			setInterval(()=>{
				that.item.content.dataset.forEach((it,ind)=>{
					it.type = that.grab_period_judge(it);
				})
				// that.item = that.data.item
			},60000)
			that.get_data();
			
		},
		methods:{
			// tab切换
			grab_coupon_tab(e){
				const that = this;
				var num = e.currentTarget.dataset.num;
				that.item.content.tab_index = num;
			},
			// 时间段判断
			grab_period_judge(item){
				var myDate = new Date();
				var hour = myDate.getHours(); //获取当前小时数(0-23)
				var minute = myDate.getMinutes(); //获取当前分钟数(0-59)
				var start_time_list = item.start_time.split(":");
				var end_time_list = item.end_time.split(":");
				if(hour < Number(start_time_list[0]) || (hour == Number(start_time_list[0]) && minute < Number(start_time_list[1]))){
					return 1;
				}else{
					if(hour > Number(end_time_list[0]) || (hour == Number(end_time_list[0]) && minute > Number(end_time_list[1]))){
						return 3;
					}else{
						return 2;
					}
				}
			},
			// 领取优惠券
			grab_coupon:function(e){
				const that = this;
				let num = e.currentTarget.dataset.num;
				let type = e.currentTarget.dataset.type;
				let percentage = e.currentTarget.dataset.percentage;
				let receive_type = e.currentTarget.dataset.receive_type;
				let id = that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].id;
				let start_time = that.item.content.dataset[that.item.content.tab_index].start_time;
				let end_time = that.item.content.dataset[that.item.content.tab_index].end_time;
				
				if(that.vuex_user.user_id <= 0){
					uni.showModal({
						title: '提示',
						content: "请先登录",
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
				
				if(!(type==2&&receive_type!=1&&percentage!=100)){
					return;
				}
				
				var params = {
						coupon_id: id,
						user_id: that.user_id,
						diy_tem_contid: that.item.diy_tem_contid,
						start_time: start_time,
						end_time: end_time
					};
				
				this.$api.wsypayReceiveCouponLimit(params).then(res=>{
					if (res.errcode == 0) {
						if(res.no_other == 1){
							that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].receive_type = 1;
						}
						that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].grant_num = ++that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].grant_num;
						that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].store = --that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].store,
						that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].percentage = parseInt((Number(that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].grant_num)/(Number(that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].store)+Number(that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].grant_num)))*100)						
						uni.showToast({
							title: res.errmsg,
							icon: 'success',
							duration: 2000
						})
					} else if (res.errcode == 3006){
						uni.showToast({
							title: res.errmsg,
							icon: 'none',
							duration: 2000
						})
						that.item.content.dataset[that.item.content.tab_index].choose_coupon[num].receive_type = 1
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
				if(that.item.content.dataset.length > 0){
					that.item.content.dataset.forEach((itm,ind)=>{
						var id_str = "";
						var id_arr = new Array();
						if(itm.choose_coupon.length > 0){
							for(var i in itm.choose_coupon){
								id_arr.push(itm.choose_coupon[i].id);
							}
							id_str = id_arr.join(',');
							var params = {
								coupon_id: id_str,
							};
							that.$api.wsypayComponentCouponData(params).then(res=>{
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
											choose_param['store'] = res.data[i].store;
											choose_param['grant_num'] = res.data[i].grant_num;
											choose_param['receive_type'] = res.data[i].receive_type;
											choose_param['percentage'] = parseInt((Number(res.data[i].grant_num)/(Number(res.data[i].store)+Number(res.data[i].grant_num)))*100);
											content_arr.push(choose_param);
											
										}
									}
									that.item.content.dataset[ind].choose_coupon = content_arr;
									console.log(that.item.content.dataset[ind].choose_coupon)
								} else {
									uni.showToast({
										title: res.errmsg,
										icon: 'none',
										duration: 2000
									})
								}
							});
							
						}
					})
				}
			}
		}
	}
</script>

<style>
	.grab-coupon{
	  padding: 12px 0 12px 12px;
	  background-color: #fff;
	  box-sizing: border-box;
	}
	.grab-coupon .grab-coupon-top{
	  margin-bottom: 12px;
	}
	.grab-coupon .grab-coupon-top .grab-coupon-top-left{
	  font-size: 0;
	}
	.grab-coupon .grab-coupon-top .grab-coupon-top-left .grab-title-img{
	  width: 38px;
	  height: 38px;
	  margin-right: 7.5px;
	}
	.grab-coupon .grab-coupon-top .grab-coupon-top-left .grab-jiantou-img{
	  width: 4.6px;
	  height: 40px;
	}
	.grab-coupon .grab-coupon-top .grab-coupon-top-right{
	  padding: 0 6px;
	  box-sizing: border-box;
	}
	.grab-coupon .grab-coupon-top .grab-coupon-top-right .grab-li{
	  width: 20%;
	  text-align: center;
	}
	.grab-coupon .grab-coupon-top .grab-coupon-top-right .grab-li-time,.grab-coupon-top-new .grab-coupon-top-right .grab-li-time{
	  font-size: 30rpx;
	  color: #333;
	  line-height: 1;
	  margin-bottom: 3px;
	  font-weight: bold;
	}
	.grab-coupon .grab-coupon-top .grab-coupon-top-right .grab-li-text{
	  font-size: 22rpx;
	  color: #666;
	  display: inline-block;
	  height: 14px;
	  line-height: 14px;
	  padding: 0 3px;
	  border-radius: 7px;
	  box-sizing: border-box;
	}
	
	.grab-coupon .grab-coupon-bottom{
	  height: 74px;
	}
	/*没有优惠券static*/
	.grab-coupon .grab-coupon-bottom .grab-coupon-zero, .grab-coupon-style2 .grab-coupon-bottom .grab-coupon-zero{
	  padding-right: 12px;
	  height: 100%;
	  font-size: 0;
	  box-sizing: border-box;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-zero>image, .grab-coupon-style2 .grab-coupon-bottom .grab-coupon-zero>image{
	  width: 18px;
	  height: 18px;
	  margin-right: 2px;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-zero>view, .grab-coupon-style2 .grab-coupon-bottom .grab-coupon-zero>view{
	  font-size: 26rpx;
	  color: #CACACE;
	  line-height: 1;
	}
	/*没有优惠券end*/
	/*只有一张优惠券static*/
	.grab-coupon .grab-coupon-bottom .grab-coupon-one{
	  padding-right: 12px;
	  height: 100%;
	  box-sizing: border-box;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one>view{
	  height: 100%;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left,.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left{
	  border-radius: 6px;
	  padding-left: 18px;
	  box-sizing: border-box;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-price,.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-price {
	  min-width: 28px;
	  font-size: 50rpx;
	  margin-right: 16px;
	  font-weight: bold;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-name,.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-name{
	  font-size: 30rpx;
	  max-width: 150px;
	  white-space:nowrap;
	  overflow:hidden;
	  text-overflow:ellipsis;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-progress,.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-progress, .grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .grab-coupon-more-left .grab-progress{
	  width: 125px;
	  height: 12px;
	  border-radius: 6px;
	  overflow: hidden;
	  position: relative;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-progress .grab-line,.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-progress .grab-line, .grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .grab-coupon-more-left .grab-progress .grab-line{
	  height: 100%;
	  border-radius: 6px;
	  position: absolute;
	  top: 0;
	  left: 0;
	  z-index: 5;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-progress .grab-line-bg,.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-progress .grab-line-bg, .grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .grab-coupon-more-left .grab-progress .grab-line-bg{
	  width: 100%;
	  height: 100%;
	  border-radius: 6px;
	  opacity: 0.5;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-progress .grab-line-text,.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-progress .grab-line-text{
	  width: 100%;
	  height: 100%;
	  position: absolute;
	  top: 0;
	  left: 0;
	  text-align: center;
	  color: #fff;
	  font-size: 22rpx;
	  line-height: 24rpx;
	  z-index: 10;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-btn{
	  border-radius: 6px;
	  width: 76px;
	  font-size: 30rpx;
	  position: relative;
	  text-align: center;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-btn .grab-coupon-one-border{
	  height: 64px;
	  position: absolute;
	  top: 5.5px;
	  left: 0;
	  border-left: 1px dashed #DDDEE2;
	  opacity: .5;
	  z-index: 15;
	}
	/*只有一张优惠券end*/
	/*只有二张优惠券static*/
	.grab-coupon .grab-coupon-bottom .grab-coupon-two{
	  padding-right: 12px;
	  height: 100%;
	  box-sizing: border-box;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two>view{
	  height: 100%;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two>view>view{
	  height: 100%;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two>view>view:nth-child(1){
	  margin-right: 8.5px;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-left{
	  border-radius: 6px;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-left .grab-price{
	  font-size: 34rpx;
	  font-weight: bold;
	  line-height: 1;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-left .grab-name{
	  font-size: 22rpx;
	  max-width: 120px;
	  white-space:nowrap;
	  overflow:hidden;
	  text-overflow:ellipsis;
	  margin: 3px 0;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-left .grab-progress{
	  width: 98px;
	  height: 12px;
	  border-radius: 6px;
	  overflow: hidden;
	  position: relative;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-left .grab-progress .grab-line{
	  height: 100%;
	  border-radius: 6px;
	  position: absolute;
	  top: 0;
	  left: 0;
	  z-index: 5;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-left .grab-progress .grab-line-bg{
	  width: 100%;
	  height: 100%;
	  border-radius: 6px;
	  opacity: 0.5;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-left .grab-progress .grab-line-text{
	  width: 100%;
	  height: 100%;
	  position: absolute;
	  top: 0;
	  left: 0;
	  text-align: center;
	  color: #fff;
	  font-size: 22rpx;
	  line-height: 24rpx;
	  z-index: 10;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-btn{
	  border-radius: 6px;
	  width: 42px;
	  font-size: 26rpx;
	  position: relative;
	  word-wrap: break-word;
	  padding: 0 14px;
	  line-height: 1.2;
	  text-align: center;
	  box-sizing: border-box;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-btn .grab-coupon-two-border{
	  height: 64px;
	  position: absolute;
	  top: 5.5px;
	  left: 0;
	  border-left: 1px dashed #DDDEE2;
	  opacity: .5;
	  z-index: 15;
	}
	/*只有二张优惠券end*/
	/*有多张优惠券static*/
	.grab-coupon .grab-coupon-bottom .grab-coupon-three{
	  height: 100%;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-scroll{
	  height: 100%;
	  width: 100%;
	  white-space:nowrap;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-content{
	  height: 100%;
	  display: inline-block;
	  margin-right: 8px;
	  overflow: auto;
	  _height: 1%;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-left{
	  border-radius: 6px;
	  width: 115px;
	  float: left;
	  height: 100%;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-left .grab-price{
	  font-size: 34rpx;
	  font-weight: bold;
	  line-height: 1;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-left .grab-name{
	  font-size: 24rpx;
	  max-width: 80px;
	  white-space:nowrap;
	  overflow:hidden;
	  text-overflow:ellipsis;
	  margin: 3px 0;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-left .grab-progress{
	  width: 80px;
	  height: 12px;
	  border-radius: 6px;
	  overflow: hidden;
	  position: relative;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-left .grab-progress .grab-line{
	  height: 100%;
	  border-radius: 6px;
	  position: absolute;
	  top: 0;
	  left: 0;
	  z-index: 5;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-left .grab-progress .grab-line-bg{
	  width: 100%;
	  height: 100%;
	  border-radius: 6px;
	  opacity: 0.5;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-left .grab-progress .grab-line-text{
	  width: 100%;
	  height: 100%;
	  position: absolute;
	  top: 0;
	  left: 0;
	  text-align: center;
	  color: #fff;
	  font-size: 22rpx;
	  line-height: 24rpx;
	  z-index: 10;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-btn{
	  border-radius: 6px;
	  width: 25px;
	  height: 100%;
	  font-size: 26rpx;
	  position: relative;
	  padding: 0 6px;
	  line-height: 1.2;
	  text-align: center;
	  box-sizing: border-box;
	  float: left;
	  white-space: normal;
	}
	.grab-coupon .grab-coupon-bottom .grab-coupon-three .grab-coupon-three-btn .grab-coupon-three-border{
	  height: 64px;
	  position: absolute;
	  top: 5.5px;
	  left: 0;
	  border-left: 1px dashed #DDDEE2;
	  opacity: .5;
	  z-index: 15;
	}
	/*有多张优惠券end*/
	
	/*限时抢券 end*/
	/*新限时抢券 static*/
	.grab-coupon-new{
	  overflow: hidden;
	}
	.grab-coupon-new .grab-coupon-bottom .grab-coupon-two .grab-coupon-two-left .grab-progress{
	width: 90%;
	margin: 0 auto;
	}
	.grab-coupon-new .grab-coupon-top .grab-coupon-top-right,.grab-coupon-style2 .grab-coupon-top-new .grab-coupon-top-right{
	padding:0px!important;
	}
	.grab-coupon-new .grab-coupon-top .grab-coupon-top-right .grab-li,.grab-coupon-style2 .grab-coupon-top-new .grab-coupon-top-right .grab-li{
	width: 20%;
	text-align: center;
	padding: 0 3px;
	}
	.grab-coupon-new .grab-coupon-top .grab-coupon-top-right .grab-li-text,.grab-coupon-style2 .grab-coupon-top-new .grab-coupon-top-right .grab-li-text{
	color: #666;
	display: inline-block;
	padding: 0 3px;
	border-radius: 7px;
	font-size: 24rpx;
	height: 28rpx;
	line-height: 28rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	}
	.grab-coupon-new .grab-coupon-bottom .grab-coupon-one{
	padding-right: 0px!important;
	}
	.grab-coupon-new .grab-coupon-bottom .grab-coupon-two{
	padding-right: 0px!important;
	}
	/*限时抢券样式二*/
	.grab-coupon-style2 .grab-coupon-top-new{
	width: 100%;
	height: 65px;
	position: relative;
	}
	.grab-coupon-style2 .grab-coupon-top-new .grab-coupon-top-title{
	position: absolute;
	top: 0;
	left: 12px;
	z-index: 1;
	padding: 10px;
	box-sizing: border-box;
	font-size: 28rpx;
	line-height: 34rpx;
	width: 20%;
	height: 100%;
	border-radius: 12px 0 0 0;
	}
	.grab-coupon-style2 .grab-coupon-top-new .grab-coupon-top-title-ul{
	background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArIAAACCCAYAAAC6nCsEAAAAAXNSR0IArs4c6QAADhVJREFUeF7t3W3InmUZB/A9861VNl0jmC1BKMP6IGYuXyr6UEkfJNIWRUWYsSDGqIjKtcqylTXT5nqxfGnlUoqsNLCCgiTKFCqJ0H3oxQj7JgxK6oO6/td45tqzPbvf7+u6zvM3OHE+z31f13H8jgv57/Tecy6s8IvAhAL79+8/KZd4ftbqrJOzjlvmkgtD3GrQa2b9/abEWd9j0PXVcOhBGWQ16fdZz876WLOZdG6D3m+us5vr0v+Mm0V3rFemlGZ17de/UlCz/pG1d2Fh4ZFpFjjMAzjN+7lWAQIJri9LGxdnvSrr3KznFdCWFggQIECAAIHZC+zLLX6R9bOsHyTYPjbJLQXZSfQqem/C69q0+76sK7JOr6h1rRIgQIAAAQKzEXhiMdTekEB7zzi3EGTHUavoPQmwp6bdK7M2Z62qqHWtEiBAgAABAvMT+ENu9YEE2ntHuaUgO4pWZa9NiH13Wt6Rtaay1rVLgAABAgQItCNwc277wQTa5nO1A38JsgOJ6ntBAuxz0/VtWW+or3sdEyBAgAABAi0L/Dn335gw++CgOgTZQUKVfT8h9py0fHfW+spa1y4BAgQIECDQHYH/pJS3J8z+8FglCbLdGVjrlSTENj+B4OdZp7RejAIIECBAgACB2gWeCsCmhNlbloMQZGt/RBb7T4g9O7/9pRDrgSBAgAABAgQ6JPBkarksYfauo9UkyHZoUm2VkhDb/Dit32ata6sG9yVAgAABAgQILCPQfMzg/ITZPy79viBb+TOTEHtiCH6VtaFyCu0TIECAAAEC3RV4OKWdlzD7+P+XKMh2d2BzqSxB9prc6CNzuZmbECBAgAABAgTGF9iVILtFkB0fsKh3JsSemYb+lHVCUY1phgABAgQIEChRoPnLXxclzDYfhzzwy45siWMesqcE2Tvz0kuHfLmXESBAgAABAgTaFrgvQfZCQbbtMbR8/8WfF/s7f5hpeRBuT4AAAQIECIwq8JqDR9nakR2VrpDXJ8g2J3e9o5B2tEGAAAECBAjUI3Bnguybm3YF2XqG/nSnCbGn5l/+mfWMCtvXMgECBAgQINBvgf+m/HUJs/sE2X4PcqzqE2QvzxtvHevN3kSAAAECBAgQaF/g8gTZ3YJs+4OYewUJsj/KTd849xu7IQECBAgQIEBgOgJ7EmTfKchOB7NXV0mQfSwFr+lV0YolQIAAAQIECBwSeDRBdr0gW9kjsXgc7d8ra1u7BAgQIECAQHkCawTZ8oZ6zI4SZC/JC+6urG3tEiBAgAABAuUJnC/IljfUQUF2a16wvbK2tUuAAAECBAiUJ7BRkC1vqIOC7HfzgrdU1rZ2CRAgQIAAgfIENgmy5Q11UJDdmxe8uLK2tUuAAAECBAiUJ/BhQba8oS7bUT4fuyrf/HfWyora1ioBAgQIECBQpsBHBdkyB3vUrhJkz8s3HqioZa0SIECAAAEC5QpcKciWO9wjOkuQfU++eFNFLWuVAAECBAgQKFdAkC13tkd2liC7M1/dUlPPeiVAgAABAgSKFdhqR7bY2R41yN6br766opa1SoAAAQIECJQrIMiWO9ujBtl9+erqmnrWKwECBAgQIFCswMfsyBY728MbczRtJYPWJgECBAgQqEdAkK1l1o6mrWXS+iRAgAABAtUIbLMjW8msE2QdTVvJrLVJgAABAgQqERBkKxn0igRZR9PWMmx9EiBAgACBOgQE2TrmvKIJso6mrWXY+iRAgAABAnUIfNxHCyoYtKNpKxiyFgkQIECAQH0CgmwNM3c0bQ1T1iMBAgQIEKhO4BN2ZCuYuaNpKxiyFgkQIECAQH0CgmwNM3c0bQ1T1iMBAgQIEKhO4JN2ZCuYeYKso2krmLMWCRAgQIBAZQKCbA0DT5B1NG0Ng9YjAQIECBCoS+AqO7KFD9zRtIUPWHsECBAgQKBeAUG29Nk7mrb0CeuPAAECBAhUKyDIlj56R9OWPmH9ESBAgACBagUE2dJH72ja0iesPwIECBAgUK3Ap3xGtvDZO5q28AFrjwABAgQI1CsgyJY8e0fTljxdvREgQIAAgeoFPm1HtuBnIEF2Q9q7v+AWtUaAAAECBAjUKyDIljx7R9OWPF29ESBAgACB6gWutiNb8DPgaNqCh6s1AgQIECBAQJAt+RlwNG3J09UbAQIECBCoXuAzdmQLfgYcTVvwcLVGgAABAgQICLKlPgOOpi11svoiQIAAAQIEFgW225Et9FlwNG2hg9UWAQIECBAgcFBAkC31WXA0bamT1RcBAgQIECBgR7bwZ8DRtIUPWHsECBAgQIDAZ320oNCHwNG0hQ5WWwQIECBAgMBBAUG2xGfB0bQlTlVPBAgQIECAwBKBz9mRLfCZcDRtgUPVEgECBAgQILBUQJAt8ZlwNG2JU9UTAQIECBAgsETgGjuyBT4TjqYtcKhaIkCAAAECBJYKCLIlPhOOpi1xqnoiQIAAAQIElgh83o5sgc+Eo2kLHKqWCBAgQIAAgaUCgmxpz4SjaUubqH4IECBAgACBZQS+YEe2sGfD0bSFDVQ7BAgQIECAwHICgmxpz4ajaUubqH4IECBAgAABO7KVPAOOpq1k0NokQIAAAQIEdvhoQWEPgaNpCxuodggQIECAAIHlBATZkp4NR9OWNE29ECBAgAABAgMErrUjW9Az4mjagoapFQIECBAgQGCQgCA7SKhP33c0bZ+mpVYCBAgQIEBgQoEv2pGdULBLb3c0bZemoRYCBAgQIEBgxgKC7IyB53p5R9POldvNCBAgQIAAgXYFrrMj2+4Apnp3R9NOldPFCBAgQIAAgW4LCLLdns/w1TmadngrryRAgAABAgSKEBBkixhjmnA0bSmT1AcBAgQIECAwpMD1PlowpFTXX+Zo2q5PSH0ECBAgQIDAlAUE2SmDtna5BNnv5eYbWyvAjQkQIECAAAEC8xX4kh3Z+YLP7G6Opp0ZrQsTIECAAAEC3RQQZLs5l9GqcjTtaF5eTYAAAQIECBQhsNOObAFzdDRtAUPUAgECBAgQIDCqgCA7qlgXX+9o2i5ORU0ECBAgQIDAjAVusCM7Y+F5XD5Bdlfus3ke93IPAgQIECBAgEBHBATZjgxiojISZH+dC1w40UW8mQABAgQIECDQL4FddmT7NbAjqk2IPT5f3Jf1rJ63onwCBAgQIECAwCgCguwoWl18bYLsBanrN12sTU0ECBAgQIAAgRkKCLIzxJ3LpZ3oNRdmNyFAgAABAgS6J/BlHy3o3lBGqihB9v68YcNIb/JiAgQIECBAgED/BQTZPs8wIfaM1P+XLH8g6fMg1U6AAAECBAiMI/AVAWgcto68J0F2W0q5uiPlKIMAAQIECBAgME8BQXae2tO8V0LsylzvkawXTPO6rkWAAAECBAgQ6InAV+3I9mRSS8tMkL0sX/t+T8tXNgECBAgQIEBgUgFBdlLBtt6fIPtg7n12W/d3XwIECBAgQIBAywJfsyPb8gTGub3d2HHUvIcAAQIECBAoTECQ7dtAE2JPTs0PZa3vW+3qJUCAAAECBAhMUeBGO7JT1JzHpRJkb8x93juPe7kHAQIECBAgQKDDAoJsh4dzRGkJsZfki3dl+QNInwanVgIECBAgQGAWAoLsLFRncc3Fww8eyLXXzuL6rkmAAAECBAgQ6JnA1+3s9WBii5+LvS+lvrQH5SqRAAECBAgQIDAPAUF2HsqT3CMh9pS8/56sCya5jvcSIECAAAECBAoT+IYd2Q5PNCF2Xcr7SZafF9vhOSmNAAECBAgQaEVAkG2FfYibJsQ24fXHWY6gHcLLSwgQIECAAIHqBG6yI9uxmSfAnpiSPpS1LWtVx8pTDgECBAgQIECgKwKCbFcm0dSx+OO1rstvX9ilutRCgAABAgQIEOiggCDb9lASXlenhkuzrsi6qO163J8AAQIECBAg0BOBm2f20YIEtGcHoTlOtflf5fuHWAc2JaexFhYWnujqABb/AtdLUt+5WRdnvXLRqKslq4sAAQIECBAg0EWByYNsgtkJ6ewVWc2Ph3p51llZZ2ad1MWOF2t6Kv98chqhechrNH9gaIL9c7KO77CL0ggQIECAAAECfREYP8gmwG5Il5uy3pS1pi8dq5MAAQIECBAgQKAIgVtG/mhBAmyz83pV1uuLINAEAQIECBAgQIBAHwVuHTrIJsCelg6vzXpr1tDv66OKmgkQIECAAAECBDovMFyQTYh9XVq5PWtt51tSIAECBAgQIECAQA0C3xy4s5oQ2/xw/h01aOiRAAECBAgQIECgNwLHDrIJsdenlff3ph2FEiBAgAABAgQI1CKwfJAVYmt5BvRJgAABAgQIEOilwO6jfrTAxwl6OUxFEyBAgAABAgRqEjgyyCbEvjYCP806riYJvRIgQIAAAQIECPRK4FuH7cgmxDYnT+3NWterNhRLgAABAgQIECBQm8C3lwbZXRHYXJuCfgkQIECAAAECBHoncCjIZjf2RSn/4SwfKejdHBVMgAABAgQIEKhO4LAg2xx48LbqCDRMgAABAgQIECDQR4HbDny0ILuxp+cff8ta2ccu1EyAAAECBAgQIFCdwNNBdnta31pd+xomQIAAAQIECBDoq8Cegzuyf00HZ/S1C3UTIECAAAECBAhUJ7BnIR8rOCttP1Rd6xomQIAAAQIECBDos8B3miC7JR3s7HMXaidAgAABAgQIEKhO4ECQ3Z2231Vd6xomQIAAAQIECBDos8DtTZD9fTo4p89dqJ0AAQIECBAgQKA6gQNB9tG0fVp1rWuYAAECBAgQIECgzwJ3NEH28XTwzD53oXYCBAgQIECAAIHqBO74H7N6pDqQiu6HAAAAAElFTkSuQmCC
	);
	background-size: 100% 100%;
	z-index: 2;
	width: 100%;
	height: 65px;
	padding-right: 12px;
	}
	.grab-coupon-style2 .grab-coupon-top-new .grab-coupon-top-right{
	width: 80%;
	}
	.grab-coupon-style2 .grab-coupon-bottom{
	  background: white;
	  border-radius: 0 0 12px 12px;
	  min-height: 74px;
	}
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-zero{
	  height: 74px!important;
	}
	/* 只有一张优惠券背景start */
	.grab-coupon-style2 .grab-coupon-one{
	  height: 90px;
	  background-size: 100% 100%;
	  width: 100%;
	  padding:0 12px;
	  box-sizing: border-box;
	}
	/*优惠券不同状态的领取按钮 包含单张和多张优惠券*/
	.grab-coupon-style2 .grab-coupon-one .grab-coupon-one-type,.grab-coupon-style2 .grab-coupon-more .grab-coupon-one-type{
	  border-radius: 30px;
	  font-size: 26rpx;
	  height: 48rpx;
	  line-height: 48rpx;
	  color: white;
	  width: 64px;
	  text-align: center;
	}
	.grab-coupon-style2 .grab-coupon-one .coupon-one-type,.grab-coupon-style2 .grab-coupon-more .coupon-one-type{
	  background-image: linear-gradient(to Right,#FD7129,#FE4639);
	}
	.grab-coupon-style2 .grab-coupon-one .coupon-start-one-type,.grab-coupon-style2 .grab-coupon-more .coupon-start-one-type{
	  background-image: linear-gradient(to Right,rgba(253, 113, 41,0.5), rgba(254, 70, 57,0.5));
	}
	.grab-coupon-style2 .grab-coupon-one .discount-one-type,.grab-coupon-style2 .grab-coupon-more .discount-one-type{
	  background-image: linear-gradient(to Right,#3F88FF,#1261FF);
	}
	.grab-coupon-style2 .grab-coupon-one .discount-start-one-type,.grab-coupon-style2 .grab-coupon-more .discount-start-one-type{
	  background-image: linear-gradient(to Right,rgba(63, 136, 255,0.5), rgba(17, 96, 254,0.5));
	}
	.grab-coupon-style2 .grab-coupon-one .used-one-type,.grab-coupon-style2 .grab-coupon-more .used-one-type{
	  background-image: linear-gradient(to Right,#AAABAC,#737376);
	}
	/*代金券/折扣券/已结束 单个优惠券面背景*/
	.grab-coupon-style2 .coupon-one-bg{
	  position: relative;
	  background-image:url(data:image/png;base64,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CBAgQIAAgboRsfTWiIHdByyUYV8LAgQIECBAgAABAgQIEGh/gd7lERseVobbf9ISEiBAgAABAgQIECBAgMABgcZgOTt8y4FHLTkz7LtBgAABAgQIECBAgAABAjkE1pczw1vKGeKyKcM5Ri4lAQIECBAgQIAAAQIECOzeErHyDmXYN4EAAQIECBAgQIAAAQIEkgk0b6TVv9OZ4WRjF5cAAQIECBAgQIAAAQK5BTY8GtG7VBnO/S2QngABAgQIECBAgAABAskEdmyIWH2PMpxs7OISIECAAAECBAgQIEAgt0BjIOKn31aGc38LpCdAgAABAgQIECBAgEBCgXITLXeTTjh3kQkQIECAAAECBAgQIJBaYN0DynDqL4DwBAgQIECAAAECBAgQyCiw6afKcMa5y0yAAAECBAgQIECAAIHUAtvXKcOpvwDCEyBAgAABAgQIECBAIKPA7l5lOOPcZSZAgAABAgQIECBAgEBqgb07lOHUXwDhCRAgQIAAAQIECBAgkFFgoE8Zzjh3mQkQIECAAAECBAgQIJBaoG4ow6m/AMITIECAAAECBAgQIEAgqYDnDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILKAMZ56+7AQIECBAgAABAgQIEEgqoAwnHbzYBAgQIECAAAECBAgQyCygDGeevuwECBAgQIAAAQIECBBIKqAMJx282AQIECBAgAABAgQIEMgsoAxnnr7sBAgQIECAAAECBAgQSCqgDCcdvNgECBAgQIAAAQIECBDILFDVa++to+rIbCA7AQIECBAgQIAAAQIECGQSqBtR1at/0IjOnipTblkJECBAgAABAgQIECBAILHA4N66qlfd2R9dk7sSM4hOgAABAgQIECBAgAABApkE+vf0V/XKhTui5+STM+WWlQABAgQIECBAgAABAgQSC/Tv3FHVy25ZFZNPPSsxg+gECBAgQIAAAQIECBAgkElg95ZVVb10wXdjyozfzZRbVgIECBAgQIAAAQIECBBILLB7y7fLmeEFV8fkGR9JzCA6AQIECBAgQIAAAQIECGQS2L3pqqp+6GuXxBkvuTZTblkJECBAgAABAgQIECBAILHAxsWXVPXCf/7NeNGcu6PDDaUTfxVEJ0CAAAECBAgQIECAQA6BwYGIFTdfUNW3z+uKsy7YFlNOn5IjuZQECBAgQIAAAQIECBAgkFZg58Zn4kVve1bVBKif+MY345Tn/0FaDMEJECBAgAABAgQIECBAIIfA1ie/Wb3s7X+4vwz/8HOXxlmvvyaqff9qI0CAAAEC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);
	}
	.grab-coupon-style2 .discount-one-bg{
	  position: relative;
	  background-image:url(data:image/png;base64,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);
	}
	.grab-coupon-style2 .used-one-bg{
	  position: relative;
	  background-image:url(data:image/png;base64,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QIAAAQIRBfJLpSenp7PZudmIVZXaSgLC8FaatrUSIECAAAECBAgQ6DKBWrhsujo1aZe4y+baieUIw51Qdg4CBAgQIECAAAECBDZMIN8lzu82PTM7mzWajQ07j8LdJSAMd9c8rYYAAQIECBAgQIDAlhXIQ/F8uOP07Nxctlxf3rIOFr46AWF4dU5eRYAAAQIECBAgQIBAQgK12nI2tzCXLSwuuvN0QnPrZKvCcCe1nYsAAQIECBAgQIAAgY4K5LvFS7Wl8FPL8u8XLy/Xs3b4z0FAGPYZIECAAAECBAgQIEBgywjk4Th/JFO9EX7qjfC7kTWbzS2z/su90HbWysIIsnarfdm/3y0MX+5Pg/MTIECAAAECBAgQIEBgCwq0zv7DRPjHifw73vnufSefHS0Mb8EPnSUTIECAAAECBAgQIEBgMwrku/RLy7VsIdwILf++90YewvBG6qpNgAABAgQIECBAgAABApckkAfj+cXv3x28ES5nj30Iw7FF1SNAgAABAgQIECBAgACBaAL597zzXeLp2Zmol1ELw9FGpBABAgQIECBAgAABAgQIbKRA/hzpyempKDc9E4Y3clJqEyBAgAABAgQIECBAgEBUgVartbJLPDM7F+pe+mOyhOGoY1GMAAECBAgQIECAAAECBDohkD83ujxRveRdYmG4E1NyDgIECBAgQIAAAQIECBCILtAMu8SVamXlsUxrPYThtYp5PQECBAgQIECAAAECBAhsGoH8Blv594jzu06v5RCG16LltQQIECBAgAABAgQIECCwKQVmZmdXQvFqD2F4tVJeR4AAAQIECBAgQIAAAQKbWmBuYT6rTkysqkdheFVMXkSAAAECBAgQIECAAAECKQjMzs1mE1MX3yEWhlOYph4JECBAgAABAgQIECBAYNUCUzPT2fTMzCu+XhheNacXEiBAgAABAgQIECBAgEAKAvlNtcYr+V2mly7YrjCcwiT1SIAAAQIECBAgQIAAAQJrEmg2m9nw2GjWCo9fOt8hDK+J04sJECBAgAABAgQIECBAIBWBhcXFrByeQywMpzIxfRIgQIAAAQIECBAgQIBAFIFytZotLC68rJad4Si8ihAgQIAAAQIECBAgQIDAZhTIL5c+MzqS5d8jPvcQhjfjtPREgAABAgQIECBAgAABAtEEZufmwuOWJoXhaKIKESBAgAABAgQIECBAgMCmF8h3hfPd4XyX+OxhZ3jTj02DBAgQIECAAAECBAgQILBegZm52WxyakoYXi+k9xMgQIAAAQIECBAgQIBAOgL57vALI8MvPmrJznA6s9MpAQIECBAgQIAAAQIECKxDYGJyMpudn1upIAyvA9JbCRAgQIAAAQIECBAgQCAdgdrycjY6PiYMpzMynRIgQIAAAQIECBAgQIBADIH8RlqNRsPOcAxMNQgQIECAAAECBAgQIEAgDYH8Jlr5zbRcJp3GvHRJgAABAgQIECBAgAABAhEEFpeWsvFKWRiOYKkEAQIECBAgQIAAAQIECCQi0Gq1su8NnxGGE5mXNgkQIECAAAECBAgQIEAgksBIuImWy6QjYSpDgAABAgQIECBAgAABAmkIVCYmhOE0RqVLAgQIECBAgAABAgQIEIglMD0zIwzHwlSHAAECBAgQIECAAAECBNIQmF9cEIbTGJUuCRAgQIAAAQIECBAgQCCWQG25JgzHwlSHAAECBAgQIECAAAECBNIQqNfrwnAao9IlAQIECBAgQIAAAQIECMQSaLaawnAsTHUIECBAgAABAgQIECBAIA2BdrstDKcxKl0SIECAAAECBAgQIECAQEwBzxmOqakWAQIECBAgQIAAAQIECCQhIAwnMSZNEiBAgAABAgQIECBAgEBMAWE4pqZaBAgQIECAAAECBAgQIJCEgDCcxJg0SYAAAQIECBAgQIAAAQIxBYThmJpqESBAgAABAgQIECBAgEASAsJwEmPSJAECBAgQIECAAAECBAjEFBCGY2qqRYAAAQIECBAgQIAAAQJJCAjDSYxJkwQIECBAgAABAgQIECAQU0AYjqmpFgECBAgQIECAAAECBAgkISAMJzEmTRIgQIAAAQIECBAgQIBATAFhOKamWgQIECBAgAABAgQIECCQhIAwnMSYNEmAAAECBAgQIECAAAECMQWE4ZiaahEgQIAAAQIECBAgQIBAEgLCcBJj0iQBAgQIECBAgAABAgQIxBQQhmNqqkWAAAECBAgQIECAAAECSQgIw0mMSZMECBAgQIAAAQIECBAgEFNAGI6pqRYBAgQIECBAgAABAgQIJCEgDCcxJk0SIECAAAECBAgQIECAQEwBYTimploECBAgQIAAAQIECBAgkISAMJzEmDRJgAABAgQIECBAgAABAjEFhOGYmmoRIECAAAECBAgQIECAQBICwnASY9IkAQIECBAgQIAAAQIECMQUEIZjaqpFgAABAgQIECBAgAABAkkICMNJjEmTBAgQIECAAAECBAgQIBBTQBiOqakWAQIECBAgQIAAAQIECCQhIAwnMSZNEiBAgAABAgQIECBAgEBMAWE4pqZaBAgQIECAAAECBAgQIJCEgDCcxJg0SYAAAQIECBAgQIAAAQIxBYThmJpqESBAgAABAgQIECBAgEASAsJwEmPSJAECBAgQIECAAAECBAjEFBCGY2qqRYAAAQIECBAgQIAAAQJJCAjDSYxJkwQIECBAgAABAgQIECAQU0AYjqmpFgECBAgQIECAAAECBAgkISAMJzEmTRIgQIAAAQIECBAgQIBATAFhOKamWgQIECBAgAABAgQIECCQhIAwnMSYNEmAAAECBAgQIECAAAECMQWE4ZiaahEgQIAAAQIECBAgQIBAEgLCcBJj0iQBAgQIECBAgAABAgQIxBQQhmNqqkWAAAECBAgQIECAAAECSQgIw0mMSZMECBAgQIAAAQIECBAgEFNAGI6pqRYBAgQIECBAgAABAgQIJCEgDCcxJk0SIECAAAECBAgQIECAQEwBYTimploECBAgQIAAAQIECBAgkISAMJzEmDRJgAABAgQIECBAgAABAjEFhOGYmmoRIECAAAECBAgQIECAQBICwnASY9IkAQIECBAgQIAAAQIECMQUEIZjaqpFgAABAgQIECBAgAABAkkICMNJjEmTBAgQIECAAAECBAgQIBBTQBiOqakWAQIECBAgQIAAAQIECCQhIAwnMSZNEiBAgAABAgQIECBAgEBMAWE4pqZaBAgQIECAAAECBAgQIJCEgDCcxJg0SYAAAQIECBAgQIAAAQIxBYThmJpqESBAgAABAgQIECBAgEASAsJwEmPSJAECBAgQIECAAAECBAjEFBCGY2qqRYAAAQIECBAgQIAAAQJJCAjDSYxJkwQIECBAgAABAgQIECAQU0AYjqmpFgECBAgQIECAAAECBAgkISAMJzEmTRIgQIAAAQIECBAgQIBATAFhOKamWgQIECBAgAABAgQIECCQhIAwnMSYNEmAAAECBAgQIECAAAECMQWE4ZiaahEgQIAAAQIECBAgQIBAEgLCcBJj0iQBAgQIECBAgAABAgQIxBQQhmNqqkWAAAECBAgQIECAAAECSQgIw0mMSZMECBAgQIAAAQIECBAgEFNAGI6pqRYBAgQIECBAgAABAgQIJCEgDCcxJk0SIECAAAECBAgQIECAQEwBYTimploECBAgQIAAAQIECBAgkISAMJzEmDRJgAABAgQIECBAgAABAjEFhOGYmmoRIECAAAECBAgQIECAQBICwnASY9IkAQIECBAgQIAAAQIECMQUEIZjaqpFgAABAgQIECBAgAABAkkICMNJjEmTBAgQIECAAAECBAgQIBBTQBiOqakWAQIECBAgQIAAAQIECCQhIAwnMSZNEiBAgAABAgQIECBAgEBMAWE4pqZaBAgQIECAAAECBAgQIJCEgDCcxJg0SYAAAQIECBAgQIAAAQIxBYThmJpqESBAgAABAgQIECBAgEASAsJwEmPSJAECBAgQIECAAAECBAjEFBCGY2qqRYAAAQIECBAgQIAAAQJJCAjDSYxJkwQIECBAgAABAgQIECAQU0AYjqmpFgECBAgQIECAAAECBAgkISAMJzEmTRIgQIAAAQIECBAgQIBATAFhOKamWgQIECBAgAABAgQIECCQhIAwnMSYNEmAAAECBAgQIECAAAECMQWE4ZiaahEgQIAAAQIECBAgQIBAEgLCcBJj0iQBAgQIECBAgAABAgQIxBQQhmNqqkWAAAECBAgQIECAAAECSQgIw0mMSZMECBAgQIAAAQIECBAgEFNAGI6pqRYBAgQIECBAgAABAgQIJCEgDCcxJk0SIECAAAECBAgQIECAQEwBYTimploECBAgQIAAAQIECBAgkISAMJzEmDRJgAABAgQIECBAgAABAjEFhOGYmmoRIECAAAECBAgQIECAQBICwnASY9IkAQIECBAgQIAAAQIECMQUEIZjaqpFgAABAgQIECBAgAABAkkICMNJjEmTBAgQIECAAAECBAgQIBBTQBiOqakWAQIECBAgQIAAAQIECCQhIAwnMSZNEiBAgAABAgQIECBAgEBMAWE4pqZaBAgQIECAAAECBAgQIJCEgDCcxJg0SYAAAQIECBAgQIAAAQIxBYThmJpqESBAgAABAgQIECBAgEASAsJwEmPSJAECBAgQIECAAAECBAjEFBCGY2qqRYAAAQIECBAgQIAAAQJJCAjDSYxJkwQIECBAgAABAgQIECAQU0AYjqmpFgECBAgQIECAAAECBAgkISAMJzEmTRIgQIAAAQIECBAgQIBATAFhOKamWgQIECBAgAABAgQIECCQhIAwnMSYNEmAAAECBAgQIECAAAECMQWE4ZiaahEgQIAAAQIECBAgQIBAEgLCcBJj0iQBAgQIECBAgAABAgQIxBQQhmNqqkWAAAECBAgQIECAAAECSQgIw0mMSZMECBAgQIAAAQIECBAgEFNAGI6pqRYBAgQIECBAgAABAgQIJCEgDCcxJk0SIECAAAECBAgQIECAQEwBYTimploECBAgQIAAAQIECBAgkISAMJzEmDRJgAABAgQIECBAgAABAjEFhOGYmmoRIECAAAECBAgQIECAQBICwnASY9IkAQIECBAgQIAAAQIECMQUEIZjaqpFgAABAgQIECBAgAABAkkICMNJjEmTBAgQIECAAAECBAgQIBBTQBiOqakWAQIECBAgQIAAAQIECCQhIAwnMSZNEiBAgAABAgQIECBAgEBMAWE4pqZaBAgQIECAAAECBAgQIJCEgDCcxJg0SYAAAQIECBAgQIAAAQIxBYThmJpqESBAgAABAgQIECBAgEASAsJwEmPSJAECBAgQIECAAAECBAjEFBCGY2qqRYAAAQIECBAgQIAAAQJJCAjDSYxJkwQIECBAgAABAgQIECAQU0AYjqmpFgECBAgQIECAAAECBAgkISAMJzEmTRIgQIAAAQIECBAgQIBATAFhOKamWgQIECBAgAABAgQIECCQhIAwnMSYNEmAAAECBAgQIECAAAECMQWE4ZiaahEgQIAAAQIECBAgQIBAEgLCcBJj0iQBAgQIECBAgAABAgQIxBQQhmNqqkWAAAECBAgQIECAAAECSQgIw0mMSZMECBAgQIAAAQIECBAgEFNAGI6pqRYBAgQIECBAgAABAgQIJCEgDCcxJk0SIECAAAECBAgQIECAQEwBYTimploECBAgQIAAAQIECBAgkIRAYapaaRcKhSSa1SQBAgQIECBAgAABAgQIEFivQLvdzgqTlXKrWCxKw+vV9H4CBAgQIECAAAECBAgQSEKg2Wq1C9XyeL2nVOpJomNNEiBAgAABAgQIECBAgACBdQo0m616oTI+Ntfb07N9nbW8nQABAgQIECBAgAABAgQIJCFQbzTmCuMjI8/39/ftS6JjTRIgQIAAAQIECBAgQIAAgXUKLC/Xng9hePiL/f39v7DOWt5OgAABAgQIECBAgAABAgSSEKgtL/97oTw28rG+3r4/TaJjTRIgQIAAAQIECBAgQIAAgXUK1JZrHy0899wzd+zasfOeddbydgIECBAgQIAAAQIECBAgkITA1PTMHYUnnjj9E9ddff0D4fFKSTStSQIECBAgQIAAAQIECBAgcKkCrVYrGx4bf1Ph/vvv77ll/83T2/q3DVxqMe8jQIAAAQIECBAgQIAAAQIpCCzVarPXXHf9lYW82ZEXXvj8wMAVt6fQuB4JECBAgAABAgQIECBAgMClCszNz33+R/a95ldWwvB3n37yzj27995dKKz80UGAAAECBAgQIECAAAECBLpOoN1uZ6Pl8bv277/lnpX0++STD71q967rvtff1++Lw103bgsiQIAAAQIECBAgQIAAgVwgXCLdmpwe3bd//9HhF7eCX3j+uS/vGBx8CyICBAgQIECAAAECBAgQINCNAjNzs1/a9+ob3pav7cUw/MQTT7z7uqv3ftJdpbtx5NZEgAABAgQIECBAgACBrS2Q30X6zOjYb956663//JIw/Pjjj/dduWPw2bA7fP3WJrJ6AgQIECBAgAABAgQIEOg2genZmZHZuYUbDhw4sPySMJz/4clvP3bntddce7fd4W4bu/UQIECAAAECBAgQIEBg6wrku8Jj4+U7999yy71nFV5y++gHHnjgin0/+qrndw7u2Lt1maycAAECBAgQIECAAAECBLpJIOwKjzVb2Q033njj0nnDcP5/Pvroo39y/bXX3Nvb09NNa7cWAgQIECBAgAABAgQIENiCAvV6PRsZH7vj4MFDf3Xu8l/2YOGTJ0+Wjh4ZevjqPVcf3IJOlkyAAAECBAgQIECAAAECXSKQP1d4vFp++JFHHn3DiRMnmq8YhvO/PHXq1I/v3b3rgcHtgy8Ly11iYhkECBAgQIAAAQIECBAg0OUC4VFK7XJl4iePHj363z+81AuG3cceO333dVdfc2dvb2+X81geAQIECBAgQIAAAQIECHSbQG15ORuvlO+59dahu863tguG4QcffLB3x46B/7p27zVvLBRsEHfbB8N6CBAgQIAAAQIECBAg0K0C+d2jx8vlb87OL7z52LFj9TWF4fzFDz/88A07dww+tOeqq64SiLv1Y2JdBAgQIECAAAECBAgQ6B6B/HvClYnK5Ozc4tEjR448e6GVXXTL9/Tph356cPvOL4dA3N89PFZCgAABAgQIECBAgAABAt0mkAfh6uREbX5h7q1DQ0e//krru2gYzt986tRD77xy55X/uGvnlUU7xN32cbEeAgQIECBAgAABAgQIpC+QB+GJqcn2/ML8bxw8ePi+i61oVWH4+4H41B2D26/4+J6rdgvEF1P19wQIECBAgAABAgQIECDQMYHvXxpdbYUgfNehQ0df8jzhCzWx6jCcF3jkkUdODFxXFZEtAAAC/UlEQVSx7dNX79nTXywWO7YwJyJAgAABAgQIECBAgAABAucTaDabWblarS0u1d51+PDhk6tVWlMYzouePn36Z3p7Sp/bu3v37r6+vtWex+sIECBAgAABAgQIECBAgEBUgaVaLatOTEw0mq1fGxoa+tpaiq85DOfFwyXTN4aN4c/s3nXV6we3b1/L+byWAAECBAgQIECAAAECBAisW2Bmdjabmpn6VrHY+44DBw48v9aClxSG85M8/fTT/QsLcx+/Ytu2PwyhOOvt7V3rub2eAAECBAgQIECAAAECBAisSaC2vJzfKCur1Wp/OzAw+P6bbrqptqYCP3jxJYfhsycLu8RvLhSyv9k5ODi0c8eOrFQqXUof3kOAAAECBAgQIECAAAECBC4o0AjfDZ6emc7m5hdOh/tlve/QoUPfWA/XusNwfvKTJ0+Wbr755j8olQp/Hi6bvjYPxT2lnvX05b0ECBAgQIAAAQIECBAgQCCrNxrZzMxMNr+4MBbuGv3hJ5986hMnTpxorpcmShg+28T999+/bc+eq96bZYUPDAxcccPgwPZsW39/5tnE6x2T9xMgQIAAAQIECBAgQGDrCOSPSlpcWsx3gbOFxcXnwj2rPlqpTH7q+PHjS7EUoobhs009+OCDvT09Pb9ULLZ/J+wQ/+LAFQO9/SEU58HYI5lijU4dAgQIECBAgAABAgQIdI9A/oikpeVatrS0lAfgevjzF9vtwqcmJye/EEJwI/ZKNyQMn9tk+E7xNYVC+0T4XvHxsGMcHsvUu6e3tycLYTkL/3vlO8Z5QC6Fn/y3XeTYI1aPAAECBAgQIECAAAECl1+g3W5lzVY7a7Wa4aedNZuNrF4PP436yqXQ9Xp9InQZHo/U/kp//8B9r3vd6yob2fWGh+Fzm//Qhz5UvP322w+G0Hs0hOMD4WcobH/fFALwQHjdFT/48WXjjZy42gQIECBAgAABAgQIELg8Avnu7mL+E3LgQsiD/xt2fk+F348Xi62HPvvZf3s0ZMZWp1r7f3DzAOPz/bodAAAAAElFTkSuQmCC);
	}
	/*更多优惠券背景start*/
	.grab-coupon-style2 .coupon-more-bg{
	  position: relative;
	  width: calc(50% - 7px);
	  background-size: 100% 100%;
	  padding:12px;
	  box-sizing: border-box;
	  margin-bottom: 14px;
	  background-image:url(data:image/png;base64,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);
	}
	.grab-coupon-style2 .discount-more-bg{
	  position: relative;
	  width: calc(50% - 7px);
	  background-size: 100% 100%;
	  padding:12px;
	  box-sizing: border-box;
	  margin-bottom: 14px;
	  background-image:url(data:image/png;base64,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);
	}
	.grab-coupon-style2 .used-more-bg{
	  position: relative;
	  width: calc(50% - 7px);
	  background-size: 100% 100%;
	  padding:12px;
	  box-sizing: border-box;
	  margin-bottom: 14px;
	  background-image:url(data:image/png;base64,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);
	}
	/*更多优惠券背景end*/
	/*代金券/折扣券位置*/
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one-choose-coupon-type{
	  position: absolute;
	  right: 3.5%;
	  top: 3px;
	  font-size: 24rpx;
	  height: 24rpx;
	  line-height: 24rpx;
	}
	/*代金券/折扣券/即将开始/已结束 券面样式*/
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-name{
	font-size: 24rpx!important;
	}
	.grab-coupon-style2 .coupon-one-bg .grab-price,.grab-coupon-style2 .coupon-more-bg .grab-price,.grab-coupon-style2 .coupon-one-bg .grab-coupon-one-choose-coupon-type,.grab-coupon-style2 .coupon-more-bg .grab-coupon-one-choose-coupon-type{
	  color: #FF3B2F;
	}
	.grab-coupon-style2 .coupon-one-bg .grab-line,.grab-coupon-style2 .coupon-more-bg .grab-line{
	  background-color: #FF3B2F;
	}
	.grab-coupon-style2 .coupon-one-bg .grab-line-bg,.grab-coupon-style2 .coupon-more-bg .grab-line-bg{
	background-image: linear-gradient(to Right,#FFDFCF,#FFC3AA);
	}
	.grab-coupon-style2 .coupon-one-bg .grab-name,.grab-coupon-style2 .coupon-more-bg .grab-name,.grab-coupon-style2 .coupon-one-bg .grab-line-text,.grab-coupon-style2 .coupon-more-bg .grab-line-text{
	color: #FFA263!important;
	}
	.grab-coupon-style2 .discount-one-bg .grab-price,.grab-coupon-style2 .discount-more-bg .grab-price,.grab-coupon-style2 .discount-one-bg .grab-coupon-one-choose-coupon-type,.grab-coupon-style2 .discount-more-bg .grab-coupon-one-choose-coupon-type{
	  color: #1563FF;
	}
	.grab-coupon-style2 .discount-one-bg .grab-line,.grab-coupon-style2 .discount-more-bg .grab-line{
	  background-color: #1563FF;
	}
	.grab-coupon-style2 .discount-one-bg .grab-line-bg,.grab-coupon-style2 .discount-more-bg .grab-line-bg{
	  background-image: linear-gradient(to Right,#C1DBFF,#B2CFFC);
	}
	.grab-coupon-style2 .discount-one-bg .grab-name,.grab-coupon-style2 .discount-more-bg .grab-name,.grab-coupon-style2 .discount-one-bg .grab-line-text,.grab-coupon-style2 .discount-more-bg .grab-line-text{
	color: #5898FE!important;
	}
	.grab-coupon-style2 .used-one-bg .grab-price,.grab-coupon-style2 .used-more-bg .grab-price,.grab-coupon-style2 .used-one-bg .grab-coupon-one-choose-coupon-type,.grab-coupon-style2 .used-more-bg .grab-coupon-one-choose-coupon-type{
	color: #767679;
	}
	.grab-coupon-style2 .used-one-bg .grab-line,.grab-coupon-style2 .used-more-bg .grab-line{
	background-color: #767679;
	}
	.grab-coupon-style2 .used-one-bg .grab-line-bg,.grab-coupon-style2 .used-more-bg .grab-line-bg{
	background-image: linear-gradient(to Right,#AAABAC,#737376);
	}
	.grab-coupon-style2 .used-one-bg .grab-name,.grab-coupon-style2 .used-more-bg .grab-name,.grab-coupon-style2 .used-one-bg .grab-line-text,.grab-coupon-style2 .used-more-bg .grab-line-text{
	color: #B5B4B3!important;
	}
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left {
	  padding-left: 0px!important;
	}
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-progress,.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .grab-coupon-more-left .grab-progress{
	  width: 100%!important;
	  height: 12rpx!important;
	}
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-one .grab-coupon-one-left .grab-line-text,.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .grab-coupon-more-left .grab-line-text{
	  font-size: 24rpx;
	  color: #FFA263;
	}
	/* 只有一张优惠券end */
	/*多张优惠券start*/
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .grab-coupon-more-left .grab-price{
	  min-width: 28px;
	  font-size: 50rpx;
	  height: 56rpx;
	  line-height: 58rpx;
	  margin-right: 16px;
	  font-weight: bold;
	}
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .grab-coupon-more-left .grab-name{
	  font-size: 24rpx;
	  height: 24rpx;
	  line-height: 24rpx;
	  display: -webkit-box;
	  -webkit-line-clamp: 1;
	  -webkit-box-orient: vertical;
	  overflow: hidden;
	  word-break: break-all;
	}
	.grab-line-text{
	  height: 24rpx;
	  line-height: 24rpx;
	  white-space: nowrap;
	}
	/*多张优惠券滚动*/
	.grab-coupon-more{
	  max-height: 200px;
	}
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .two>view:nth-last-child(2){
	  margin-bottom: 0px;
	}
	.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .one>view:nth-last-child(1),.grab-coupon-style2 .grab-coupon-bottom .grab-coupon-more .two>view:nth-last-child(1){
	  margin-bottom: 0px;
	}
	/*多张优惠券end*/
	/*新限时抢券 end*/
	/*flex兼容写法 static*/
	.flex-def {
	  display: -webkit-box; 
	  display: -moz-box; 
	  display: -ms-flexbox;
	  display: -webkit-flex; 
	  display: flex; 
	}
	
	/* 主轴居中 */
	.flex-zCenter {
	  -webkit-box-pack: center;
	  -moz-justify-content: center;
	  -webkit-justify-content: center;
	  justify-content: center;
	}
	/* 主轴居中 */
	.flex-zAround {
	  -moz-justify-content: space-around;
	  -webkit-justify-content: space-around;
	  justify-content: space-around;
	}
	/* 主轴两端对齐 */
	.flex-zBetween {
	  -webkit-box-pack: justify;
	  -moz-justify-content: space-between;
	  -webkit-justify-content: space-between;
	  justify-content: space-between;
	}
	
	/* 主轴end对齐 */
	.flex-zEnd {
	  -webkit-box-pack: end;
	  -moz-justify-content: flex-end;
	  -webkit-justify-content: flex-end;
	  justify-content: flex-end;
	}
	
	/* 主轴start对齐 */
	.flex-zStart {
	  -webkit-box-pack: start;
	  -moz-justify-content: start;
	  -webkit-justify-content: start;
	  justify-content: start;
	}
	
	/* 侧轴居中 */
	.flex-cCenter {
	  -webkit-box-align: center;
	  -moz-align-items: center;
	  -webkit-align-items: center;
	  align-items: center;
	}
	
	/* 侧轴start对齐 */
	.flex-cStart {
	  -webkit-box-align: start;
	  -moz-align-items: start;
	  -webkit-align-items: start;
	  align-items: start;
	}
	
	/* 侧轴底部对齐 */
	.flex-cEnd {
	  -webkit-box-align: end;
	  -moz-align-items: flex-end;
	  -webkit-align-items: flex-end;
	  align-items: flex-end;
	}
	
	/* 侧轴文本基线对齐 */
	.flex-cBaseline {
	  -webkit-box-align: baseline;
	  -moz-align-items: baseline;
	  -webkit-align-items: baseline;
	  align-items: baseline;
	}
	
	/* 侧轴上下对齐并铺满 */
	.flex-cStretch {
	  -webkit-box-align: stretch;
	  -moz-align-items: stretch;
	  -webkit-align-items: stretch;
	  align-items: stretch;
	}
	
	/* 主轴从上到下 */
	.flex-zTopBottom {
	  -webkit-box-direction: normal;
	  -webkit-box-orient: vertical;
	  -moz-flex-direction: column;
	  -webkit-flex-direction: column;
	  flex-direction: column;
	}
	
	/* 主轴从下到上 */
	.flex-zBottomTop {
	  -webkit-box-pack: end;
	  -webkit-box-direction: reverse;
	  -webkit-box-orient: vertical;
	  -moz-flex-direction: column-reverse;
	  -webkit-flex-direction: column-reverse;
	  flex-direction: column-reverse;
	}
	
	/* 主轴从左到右 */
	.flex-zLeftRight {
	  -webkit-box-direction: normal;
	  -webkit-box-orient: horizontal;
	  -moz-flex-direction: row;
	  -webkit-flex-direction: row;
	  flex-direction: row;
	}
	
	/* 主轴从右到左 */
	.flex-zRightLeft {
	  -webkit-box-pack: end;
	  -webkit-box-direction: reverse;
	  -webkit-box-orient: horizontal;
	  -moz-flex-direction: row-reverse;
	  -webkit-flex-direction: row-reverse;
	  flex-direction: row-reverse;
	}
	
	/* 是否允许子元素伸缩 */
	.flex-item {
	  -webkit-box-flex: 1.0;
	  -moz-flex-grow: 1;
	  -webkit-flex-grow: 1;
	  flex-grow: 1;
	}
	/*子元素换行*/
	.flex-wrap {
	  -webkit-flex-wrap:wrap;
	  -webkit-box-lines:multiple;
	  -moz-flex-wrap:wrap;
	  flex-wrap:wrap;
	}
	/* 子元素的显示次序 */
	.flex-order{
	  -webkit-box-ordinal-group: 1;
	  -moz-order: 1;
	  -webkit-order: 1;
	  order: 1;
	}
	
	/*元素比例*/
	.flex-one{
	  -prefix-box-flex: 1; 
	  -webkit-box-flex: 1; 
	  -webkit-flex: 1; 
	  -moz-box-flex: 1; 
	  -ms-flex: 1; 
	  flex: 1; 
	}
	
	/*flex兼容写法 end*/
	 /*组件通用*/
	 .fa-angle-down {
	  margin-left: 5px;
	  width: 15rpx;
	  height: 15rpx;
	  border-top: 2rpx solid #b2b2b2;
	  border-right: 2rpx solid #b2b2b2;
	  transform: rotate(45deg);
	}
	 .padding-0{
	  padding:0px!important;
	}
	.padding-top-0{
	  padding-top: 0px!important;
	}
	.padding-left-10{
	  padding-left: 10px!important;
	}
	.padding-left-15{
	  padding-left: 15px!important;
	}
	.padding-10{
	  padding:10px!important;
	}
	.padding-vertical-5{
	  padding-top: 5px!important;
	  padding-bottom: 5px!important;
	}
	.padding-horizontal-10{
	  padding-left: 10px!important;
	  padding-right: 10px!important;
	}
	.margin-0{
	  margin:0px !important;
	}
	.margin-right-5{
	  margin-right: 5px!important;
	}
	.margin-right-10{
	  margin-right: 5px!important;
	}
	.inline-block {
	  display: inline-block !important;
	}
	.text-center{
	  text-align: center!important;
	}
	.text-nowrap{
	  white-space: nowrap;
	}
	.font-weight-800{
	  font-weight: 800;
	}
	.underline{
	  position:absolute;bottom:-4px;left:0;width:100%;margin-left: 0px;
	}
	.underline-div{
	  height: 3px;
	  width: 50%;
	}
</style>
