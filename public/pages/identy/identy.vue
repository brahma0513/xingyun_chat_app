<template>
	<view>
		<!--public/pages/award/identy/identy.wxml-->
		<!-- 当前等级 start -->
		<view class='sf-privilege'>
		      <view :class="'dj-infor overf skin-bg-'+theme">
		        <view class="cur-dj fl">
		          <p v-if="level==0">无</p>
		          <p v-if="level>0">{{status_list[level-1].name}}</p>
		          <p>当前等级</p>
		        </view>
		        <image :src="userInfo.avatarUrl" alt="" class="fr user-tx" mode='widthFix'></image>
		      </view>
		      <!-- 当前等级 end -->
		      <view class="dj-con" v-if="!status">
		        <view class="term">
		          <span class="color3" @click="open_pop">身份说明</span>
		        </view>
		        <view class="dj-item"  v-for="(item,index) in status_list" v-if="item.set_open == 1 && (level == 0 || index >= level)">
		          <span class="circle"></span>
		          <h4>{{item.name}}</h4>
		          <view class="txt overf" v-if="item.consume_open == 1">
		            <span class="fl">个人累计消费</span>
		            <span class="fr">{{item.amount[4]}}/{{ item.consume}} 元</span>
		          </view>
		          <progress v-if="item.consume_open == 1" :percent="item.consume_p" :active-color="theme_color" stroke-width="5"/>
		         
		          <view class="txt overf" v-if="item.prosale_open == 1">
		            <span class="fl">推广销售额</span>
		            <span class="fr">{{ item.amount[5] }}/{{ item.prosale }} 元</span>
		          </view>
		          <progress v-if="item.prosale_open == 1" :percent="item.prosale_p" :active-color="theme_color"  stroke-width="5"/>
		
		          <view class="txt overf" v-if="item.promote_open == 1">
		            <span class="fl">推广成交量</span>
		            <span class="fr">{{ item.amount[0] }}/{{ item.promote }} 人</span>
		          </view>
		          <progress v-if="item.promote_open == 1" :percent="item.promote_p" :active-color="theme_color"  stroke-width="5"/>
		
		          <view class="txt overf" v-if="item.allpromote_open == 1">
		            <span class="fl">总成交量</span>
		            <span class="fr">{{ item.amount[1] }}/{{ item.allpromote }} 人</span>
		          </view>
		          <progress v-if="item.allpromote_open == 1" :percent="item.allpromote_p" :active-color="theme_color"   stroke-width="5"/>
		
		          <view class="txt overf" v-if="item.allorder_open == 1">
		            <span class="fl">总订单量</span>
		            <span class="fr">{{ item.amount[2] }}/{{ item.allorder }} 单</span>
		          </view>
		          <progress v-if="item.allorder_open == 1" :percent="item.allorder_p" :active-color="theme_color" stroke-width="5"/>
		
		          <view class="txt overf" v-if="item.allsale_open == 1">
		            <span class="fl">总销售额</span>
		            <span class="fr">{{ item.amount[3] }}/{{ item.allsale }} 元</span>
		          </view>
		          <progress v-if="item.allsale_open == 1" :percent="item.allsale_p" :active-color="theme_color"   stroke-width="5"/>
		          <view class="oprate overf">
		            <block v-if="item.op == '申请'">
		                <a  :class="(item.apply)?'skin-bg-'+theme :'opacity5 skin-bg-'+theme" @click="applyHeight(index,item.apply)">{{item.op}}</a>
		            </block>
		            <!-- 待审核 -->
		            <block v-else>
		                <a :class="'skin-bg-'+theme">{{item.op}}</a>
		            </block>
		            <!--a href="#" v-if="level > 0}}">礼包升级</a-->
		          </view>
		        </view>
		        
		        
		      </view>
		      <!-- 当前已为最高级 start -->
		   		<view class="heigest-dj" v-if="status">
		   			<view class="bg">
		          <image :src="http_host+'/HTML/images/public/no_data_s.png'"></image>
		         </view>
		   			<p>当前已为最高级</p>
		   		</view>
		   		<!-- 当前已为最高级 end -->
				<!-- 升级说明弹窗 start -->
				<view class="pop-mask" v-if="pop_state"></view>
				<view class="upgrade-sm-pop com-pop-con" v-if="pop_state">
					<h4 class="color2">身份说明</h4>
					<span class="close" @click="close_pop">
		        <image :src="http_host+'/HTML/images/public/close.png'" mode='widthFix'> </image>
		      </span>
		      <view  class="sj-sm" >
		      	<rich-text :nodes="rules"></rich-text> 
		      </view>
				
				</view>
		</view>
		    <!-- 升级说明弹窗 end -->
		<!-- <authorize bind:setuser="SetUserInfoHandler"></authorize> -->

	</view>
</template>

<script>
	import identy from './identy.js'
	export default {
	  ...identy,
	}
</script>

<style>
@import 'identy.css' ;
</style>
