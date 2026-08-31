<template>
	<view>
		<!--public/pages/award/identy/identyPromot.wxml-->
		<!-- 当前等级 start -->
		<view class='sf-privilege'>
		      <view :class="'dj-infor overf skin-bg-'+theme">
		        <view class="cur-dj fl">
		          <p >{{identity_name}}</p>
		          <p>当前等级</p>
		        </view>
		        <image :src="userInfo.avatarUrl" alt="" class="fr" style='width:50px;border-radius:50%' mode='widthFix'></image>
		      </view>
		      <!-- 当前等级 end -->
		      <view class="dj-con" v-if="!status">
		        <view class="term">
		          <span class="color3" @click="open_pop">身份说明</span>
		        </view>
		        <view class="dj-item"  v-for="(item,index) in list" :key="index" >
		          <span class="circle"></span>
		          <h4>{{item.name}}</h4>
		          <view class="txt overf" v-if="item.promote_open == 1" >
		            <span class="fl">推广量</span>
		            <span class="fr">{{item.promote_num}}/{{ item.promote_need}} 人</span>
		          </view>
		           <progress v-if="item.promote_open == 1" :percent="item.promot_percent" :active-color="theme_color" stroke-width="5"/>
		          <view class="txt overf"  v-if="item.consume_open == 1">
		            <span class="fl">个人累计消费<block v-if="item.money_type == 1">(实付)</block></span>
		            <span class="fr">{{item.consume_num}}/{{ item.consume_need}} 元</span>
		          </view>
		          <progress v-if="item.consume_open == 1" :percent="item.percent" :active-color="theme_color" stroke-width="5"/>
		          <view class="txt overf"  v-if="item.team_sales_open == 1">
		            <span class="fl">团队销售额<block v-if="item.ts_money_type == 1">(实付)</block></span>
		            <span class="fr">{{item.team_sales_num}}/{{ item.team_sales_need}} 元</span>
		          </view>
		          <progress v-if="item.team_sales_open == 1" :percent="item.sales_percent" :active-color="theme_color" stroke-width="5"/>
		 
		          <view class="oprate overf">
		            <a href="#" :class="( item.is_upgrade == 1)?'' :'opacity5 skin-bg-'+theme" @click="toHeighter(index,item.is_upgrade)">
		            升级
		              <!-- <block v-if="{{item.is_upgrade !=2}}" >升级</block>
		              <block v-if="{{item.is_upgrade ==2 }}">待审核</block> -->
		            </a>
		            <!--a href="#" v-if="">礼包升级</a-->
		          </view>
		        </view>
		        
		        
		      </view>
		      <!-- 当前已为最高级 start -->
		   		<view class="heigest-dj" v-if="status">
		   			<view class="bg"><image :src="http_host+'/HTML/images/public/no_data_s.png'"></image></view>
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
		      	<rich-text :nodes="rule"></rich-text> 
		      </view>
				
				</view>
		</view>
		    <!-- 升级说明弹窗 end -->
		<!-- <authorize bind:setuser="SetUserInfoHandler"></authorize> -->

	</view>
</template>

<script>
	import identyPromot from './identyPromot.js'
	export default {
	  ...identyPromot,
	}
</script>

<style>
@import 'identy.css' ;
.sf-privilege .oprate > a {
	width: 100%;

}
</style>
