<template>
	<view>
		<!--public/pages/award/identy/identyStore.wxml-->
		<!-- 当前等级 start -->
		<view class='sf-privilege'>
		      <view :class="'dj-infor  overf skin-bg-'+theme">
		        <view class="cur-dj fl">
		          <p v-if="level==0">无</p>
		          <p v-if="level>0">{{status_list[level-1].pre_name}}</p>
		          <p>当前等级</p>
		        </view>
		        <image :src="userInfo.avatarUrl" alt="" class="fr user-tx" mode='widthFix'></image>
		      </view>
		      <!-- 当前等级 end -->
		      <view class="dj-con" v-if="!status">
		        <view class="term">
		          <span class="color3" @click="open_pop">身份说明</span>
		        </view>
		        <view class="dj-item"  v-for="(item,index) in status_list" :key="index" v-if="item.is_open == 1 && (level == 0 || index > level-1)">
		          <span class="circle"></span>
		          <h4>{{item.pre_name}}</h4>
		          <view class="txt overf" v-if="item.upgrade_condition[0].is_open == 1">
		            <span class="fl">{{item.upgrade_condition[0].diy_name==''?'邀请客户':item.upgrade_condition[0].diy_name}}</span>
		            <span class="fr">{{item.upgrade_condition[0].amount}}/{{ item.upgrade_condition[0].num}} 人</span>
		          </view>
		          <progress v-if="item.upgrade_condition[0].is_open == 1" :percent="item.upgrade_condition[0].percent" :active-color="theme_color" stroke-width="5"/>
		          
		           <view class="txt overf" v-if="item.upgrade_condition[8].is_open == 1">
		            <span class="fl">{{item.upgrade_condition[8].diy_name==''?identity_name[item.upgrade_condition[8].identity]:item.upgrade_condition[8].diy_name}}</span>
		            <span class="fr">{{item.upgrade_condition[8].amount}}/{{ item.upgrade_condition[8].num}} 人</span>
		          </view>
		          <progress v-if="item.upgrade_condition[8].is_open == 1" :percent="item.upgrade_condition[8].percent" :active-color="theme_color" stroke-width="5"/>
		<!-- 7/7 -->
<!-- 		<view class="txt overf" v-if="item.upgrade_condition[9].is_open == 1">
		            <span class="fl">{{item.upgrade_condition[9].diy_name==''?identity_name[item.upgrade_condition[9].identity]:item.upgrade_condition[9].diy_name}}</span>
		            <span class="fr">{{item.upgrade_condition[9].amount}}/{{ item.upgrade_condition[9].num}} 人</span>
		          </view>
		          <progress v-if="item.upgrade_condition[9].is_open == 1" :percent="item.upgrade_condition[9].percent" :active-color="theme_color" stroke-width="5"/>
 -->		         
		         
		          <!-- 7/7end -->
		          <view class="txt overf" v-if="item.upgrade_condition[1].is_open == 1">
		            <span class="fl">{{item.upgrade_condition[1].diy_name==''?'销售客户':item.upgrade_condition[1].diy_name}}</span>
		            <span class="fr">{{item.upgrade_condition[1].amount}}/{{ item.upgrade_condition[1].num}} 人</span>
		          </view>
		          <progress v-if="item.upgrade_condition[1].is_open == 1" :percent="item.upgrade_condition[1].percent" :active-color="theme_color" stroke-width="5"/>
		<!-- 7/8 -->
<!-- 		<view class="txt overf" v-if="item.upgrade_condition[10].is_open == 1">
		            <span class="fl">
		              <block v-if="item.upgrade_condition[10].diy_name != ''">{{item.upgrade_condition[10].diy_name}}</block>
		              <block v-else>销售客户总销售额</block> 
		            </span>
		            <span class="fr">{{item.upgrade_condition[10].amount}}/{{ item.upgrade_condition[10].child_num}}</span>
		          </view>
		          <progress v-if="item.upgrade_condition[10].is_open == 1" :percent="item.upgrade_condition[10].percent" :active-color="theme_color" stroke-width="5"/>
 -->		<!-- 7/8end -->
		          <view class="txt overf" v-if="item.upgrade_condition[2].is_open == 1">
		            <span class="fl">{{item.upgrade_condition[2].diy_name==''?'成交订单数':item.upgrade_condition[2].diy_name}}</span>
		            <span class="fr">{{item.upgrade_condition[2].amount}}/{{ item.upgrade_condition[2].num}} 单</span>
		          </view>
		          <progress v-if="item.upgrade_condition[2].is_open == 1" :percent="item.upgrade_condition[2].percent" :active-color="theme_color" stroke-width="5"/>
		
		          <view class="txt overf" v-if="item.upgrade_condition[3].is_open == 1">
		            <span class="fl">{{item.upgrade_condition[3].diy_name==''?'总销售额':item.upgrade_condition[3].diy_name}}</span>
		            <span class="fr">{{item.upgrade_condition[3].amount}}/{{ item.upgrade_condition[3].num}} 元</span>
		          </view>
		          <progress v-if="item.upgrade_condition[3].is_open == 1" :percent="item.upgrade_condition[3].percent" :active-color="theme_color" stroke-width="5"/>
		
		          <view class="txt overf" v-if="item.upgrade_condition[4].is_open == 1">
		      <span class="fl">{{item.upgrade_condition[4].diy_name==''?'客户销售占比（除前':item.upgrade_condition[4].diy_name}}{{ item.upgrade_condition[4].exclude_sales}}位）</span>
		            <span class="fr">{{item.upgrade_condition[4].amount}}/ {{item.upgrade_condition[4].volume_percent}}%</span>
		          </view>
		          <progress v-if="item.upgrade_condition[4].is_open == 1" :percent="item.upgrade_condition[4].percent" :active-color="theme_color" stroke-width="5"/>
		
		          <view class="txt overf" v-if="item.upgrade_condition[5].is_open == 1">
		            <span class="fl">{{item.upgrade_condition[5].diy_name==''?'消费金额':item.upgrade_condition[5].money_type==1?item.upgrade_condition[5].diy_name+'(实付)':item.upgrade_condition[5].diy_name}}</span>
		            <span class="fr">{{item.upgrade_condition[5].amount}}/{{ item.upgrade_condition[5].num}} 元</span>
		          </view>
		          <progress v-if="item.upgrade_condition[5].is_open == 1" :percent="item.upgrade_condition[5].percent" :active-color="theme_color" stroke-width="5"/>
		
		          <view class="txt overf" v-if="item.upgrade_condition[6].is_open == 1">
		            <span class="fl">{{item.upgrade_condition[6].diy_name==''?'销售金额':item.upgrade_condition[6].money_type==1?item.upgrade_condition[6].diy_name+'(实付)':item.upgrade_condition[6].diy_name}}</span>
		            <span class="fr">{{item.upgrade_condition[6].amount}}/{{ item.upgrade_condition[6].num}} 元</span>
		          </view>
		          <progress v-if="item.upgrade_condition[6].is_open == 1" :percent="item.upgrade_condition[6].percent" :active-color="theme_color" stroke-width="5"/>
		         
		        
		          <view class="oprate overf">
		            <block v-if="!item.is_check">
		                <block v-if="item.apply && applaybtn == 1">
		                    <a :class="'skin-bg-'+theme" @click="toHeighter(index)">升级</a>
		                </block>
		                <block v-else>
		                    <a :class="'opacity5 skin-bg-'+theme">升级</a>
		                </block>
		            </block>
		            <block v-else>
		                <a :class="'skin-bg-'+theme">待审核</a>
		            </block>
		            <!--a href="#" v-if="">礼包升级</a-->
		          </view>
		        </view>
		        
		        
		      </view>
		      <!-- 当前已为最高级 start -->
		   		<view class="heigest-dj" v-if="status">
		   			<view class="bg"></view>
		   			<p>当前已为最高级</p>
		   		</view>
		   		<!-- 当前已为最高级 end -->
				<!-- 升级说明弹窗 start -->
				<view class="pop-mask" v-if="pop_state"></view>
				<view class="upgrade-sm-pop com-pop-con" v-if="pop_state">
					<h4 class="color2">升级说明</h4>
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
	import identyStore from './identyStore.js'
	export default {
	  ...identyStore,
	}
</script>

<style>
@import 'identy.css' 
</style>
