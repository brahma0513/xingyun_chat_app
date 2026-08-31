<template>
	<view>
		
<!-- 		<ad-rewarded-video adpid="1507000689" :loadnext="true" v-slot:default="{loading, error}">
		  <button :disabled="loading" :loading="loading">显示广告</button>
		  <view v-if="error">{{error}}</view>
		</ad-rewarded-video> -->
			
		<view class="advertise">
		  <!-- 滚动公告 -->
		  <!--横向滚动-->
		  <view class="announcement-scroll" v-if="is_show===1">
		    <image class="announcement-laba" :src="http_host+'/xyun_ads/web/static/images/icon_ldan.png'" mode='widthFix'></image>
		    <view class="swiper_container flex-def">
		      <view class="flex-def flex-cCenter" :animation="animationData" :style="'height: 16px;width:'+length+'px;transform: translateX(0%);'">     
		        <block v-for="(item,index) in announcementScroll">
		            <view :class="(index < announcementScroll.length-1 ?'pr-nav':'')+' swiper_item'" :id="'scroll'+index"  @click="go_announcement_detail(item)">
		                <text style="white-space: pre;">{{item.title}}</text>
		            </view>
		        </block>
		      </view>
		    </view>
		    <image class="announcement-laba-list" :src="http_host+'/xyun_ads/web/static/images/icon_ldan_list.png'" mode='widthFix' @click="go_announcement_lists"/>
		  </view>
		  
		  <view v-if="mode_type=='task_reward'" :class="'top skin-bg-'+theme" :style="'height: '+(css_type==1?184:176)+'px;'">
		    <view :class="'task-reward flex-def '+(css_type==2?'task-reward2 flex-zCenter padding-top-33':'flex-zBetween')" :style="'background:url('+(css_type==2?http_host+'/xyun_ads/web/static/images/csstype2_bg@3x.png':'')+');background-size:100% 100%;'">
		      <view :class="'left '+(css_type==2?'left2':'')">
		        <image class="img" :src="http_host+'/xyun_ads/web/static/images/icon_meirirenwu.png'"></image>
		        <view :class="'text '+(css_type==2?'text2':'')">完成任务领取奖励</view>
		      </view>
		      <image v-if="css_type==1" class="right" :src="http_host+'/xyun_ads/web/static/images/icon_liw.png'"></image>
		    </view>
		    <view :class="'skin-bg-'+theme" :style="'height: 20px;background-color:' + (css_type==2?'rgb(252 31 75)!important':'')"></view>
		  </view>
		  <view v-else class="top" :style="'height: '+(css_type==1?(mode_type=='integral_add'||mode_type=='integral_decrement'?'138':'235'):176)+'px;'">
		    <view class="jfmx" v-if="is_integral_detail" @click="go_integral_list">
		      <image :src="http_host+'/xyun_ads/web/static/images/icon_jf_bg.png'"></image>积分明细
		    </view>
		    <image class="bg-img" v-if="css_type==1" :src="http_host+'/xyun_ads/web/static/images/icon_top_bg.png'"></image>
		    <view :class="'style-one skin-bg-'+theme+( css_type==2?' style-one2':' flex-def flex-cCenter flex-zCenter')" :style="'background:url('+(css_type==2?http_host+'/xyun_ads/web/static/images/csstype2_bg@3x.png':'')+');background-size:100% 100%;'">
		      <view :class="'flex-def flex-cCenter flex-zCenter '+(css_type==2?(mode_type=='integral_add'&&css_type==2||mode_type=='integral_decrement'&&css_type==2?'height-176':'padding-top-33'):'')">
		        <view>
		          <view v-if="mode_type=='integral_add'||mode_type=='integral_decrement'" :class="'text '+(css_type==2?'text2':'')">当前{{integral}}</view>
		          <view v-else :class="'text '+(css_type==2?(mode_type=='integral_add'||mode_type=='integral_decrement'?'':'text3'):'')">累计新增{{integral}}</view>
		          <view :class="'num '+(mode_type=='integral_add'&&css_type==2||mode_type=='integral_decrement'&&css_type==2?'num2':mode_type=='integral_threshold'&&css_type==2||mode_type=='declining_stock'&&css_type==2||mode_type=='fixed_ratio'&&css_type==2?'num3':'')">{{current_points}}</view>
		        </view>
		      </view>
		      <!--样式二新增-->
		      <!--积分门槛-->
		      <view v-if="mode_type=='integral_threshold'&&css_type==2" :class="'sill-list '+(css_type==2?'sill-list2':'')">
		        <view class="sill-bd">
		          <view class="sill-bg" :style="'width: '+sill_rate+'%;'"></view>
		          <view class="sill-for">
		            <view class="sill-li" style="left: -10px;">
		              <view class="li-num flex-def flex-cCenter flex-zCenter">
		                <view v-if="current_points>0" class="li-dot"></view>
		              </view>
		            </view>
		            <block v-for="(item,index) in sill_list" >
		              <view class="sill-li" :style="'left: calc('+item.rate+'% - 5px);'">
		                <view class="li-num flex-def flex-cCenter flex-zCenter">
		                  <view class="li-text">{{item.threshold}}</view>
		                  <view v-if="sill_rate>=item.rate" class="li-dot"></view>
		                  <view class="li-img" v-if="is_rewrad_show">
		                    <image :src="http_host+'/xyun_ads/web/static/images/icon_daosanjiao.png'"></image>
		                    <view class="li-scale">{{item.ratio}}%</view>
		                  </view>
		                </view>
		              </view>
		            </block>
		          </view>
		        </view>
		      </view>
		      <!--存量递减/固定比例-->
		      <view v-if="mode_type=='declining_stock'&&css_type==2||mode_type=='fixed_ratio'&&css_type==2" class="strip-list ">
		        <view class="strip-bd">
		          <view class="strip-scale" v-if="is_rewrad_show">
		            <block v-if="is_promoter||(sill_list[0].identity&&sill_list[0].identity=='not')">{{sill_list[0].identity&&sill_list[0].identity=='not'?sill_list[0].ratio:sill_list[level-1].ratio}}</block>
		            <block v-else>0</block>%<image :src="http_host+'/xyun_ads/web/static/images/icon_dom_jiantou.png'"></image>
		          </view>
		          <view class="strip-bg" v-if="is_promoter||(sill_list[0].identity&&sill_list[0].identity=='not')" :style="'width: '+(current_points<=0&&sill_list[level-1].threshold<=0?'0':(current_points / sill_list[level-1].threshold * 100) > 100 ? '100':(current_points / sill_list[level-1].threshold * 100))+'%;'">
		            <image mode="heightFix" :src="http_host+'/xyun_ads/web/static/images/icon_progress_bar.png'"></image>
		          </view>
		        </view>
		        <view class="strip-text flex-def flex-cCenter flex-zBetween">
		          <view class="strip-text-left flex-def">
		            <block v-if="is_promoter||(sill_list[0].identity&&sill_list[0].identity=='not')">
		              <block v-if="level != sill_list.length&&(sill_list[0].identity&&sill_list[0].identity!='not')">
		                当前推荐：{{child_num}}/{{sill_list[level].child_num}}<block v-if="sill_list[level].child_num > child_num">（<view class="flex-one">再邀请{{sill_list[level].child_num - child_num}}位{{promotion_name}}即可提升额度</view>）</block>
		              </block>
		              <!-- 无限制显示  -->
		              <block v-if="sill_list[0].identity&&sill_list[0].identity=='not'">
		                当前推荐：{{child_num}}/{{level == sill_list.length?sill_list[level-1].child_num:sill_list[level].child_num}}<block>（<view class="flex-one">再邀请{{level == sill_list.length?sill_list[level-1].child_num:sill_list[level].child_num - child_num}}位{{promotion_name}}即可提升额度</view>）</block>
		              </block>
		            </block>
		            <block v-else>成为{{promotion_name}}后即可获得{{integral}}容量</block>
		          </view>
		          <view class="strip-text-right">
		            <block v-if="is_promoter||(sill_list[0].identity&&sill_list[0].identity=='not')">{{current_points}}/{{sill_list[0].identity&&sill_list[0].identity=='not'?sill_list[0].threshold:sill_list[level-1].threshold}}</block>
		            <block v-else>0/0</block>
		          </view>
		        </view>
		      </view>
		      <!--区间递减-->
		      <view v-if="mode_type=='section_decrease'&&css_type==2" class="sill-list">
		        <view class="sill-bd">
		          <view class="sill-bg" :style="'width: '+sill_rate+'%;'"></view>
		          <view class="sill-for">
		            <view class="sill-li" style="left: -10px;">
		              <view class="li-num flex-def flex-cCenter flex-zCenter">
		                <view v-if="current_points>0" class="li-dot"></view>
		              </view>
		            </view>
		            <block v-for="(item,index) in sill_list">
		              <view class="sill-li" :style="'left: calc('+item.rate+'% - 5px);'">
		                <view class="li-num flex-def flex-cCenter flex-zCenter">
		                  <view class="li-text">{{item.start}}</view>
		                  <view v-if="sill_rate>=item.rate" class="li-dot"></view>
		                  <view class="li-img" v-if="is_rewrad_show">
		                    <image :src="http_host+'/xyun_ads/web/static/images/icon_daosanjiao.png'"></image>
		                    <view class="li-scale">+{{item.moneyA}}{{item.moneyB}}</view>
		                  </view>
		                </view>
		              </view>
		            </block>
		          </view>
		        </view>
		      </view>
		      <!--样式二新增end-->
		    </view>
		    <view v-if="mode_type=='integral_threshold'&&css_type==1" :class="'sill-list skin-bg-'+theme">
		      <view class="sill-bd">
		        <view class="sill-bg" :style="'width: '+sill_rate+'%;'"></view>
		        <view class="sill-for">
		          <view class="sill-li" style="left: -10px;">
		            <view class="li-num flex-def flex-cCenter flex-zCenter">
		              <view v-if="current_points>0" class="li-dot"></view>
		            </view>
		          </view>
		          <block v-for="(item,index) in sill_list" >
		            <view class="sill-li" :style="'left: calc('+item.rate+'% - 5px);'">
		              <view class="li-num flex-def flex-cCenter flex-zCenter">
		                <view class="li-text">{{item.threshold}}</view>
		                <view v-if="sill_rate>=item.rate" class="li-dot"></view>
		                <view class="li-img" v-if="is_rewrad_show">
		                  <image :src="http_host+'/xyun_ads/web/static/images/icon_daosanjiao.png'"></image>
		                  <view class="li-scale">{{item.ratio}}%</view>
		                </view>
		              </view>
		            </view>
		          </block>
		        </view>
		      </view>
		    </view>
		    <view v-if="mode_type=='section_decrease'&&css_type==1" :class="'sill-list skin-bg-'+theme">
		      <view class="sill-bd">
		        <view class="sill-bg" :style="'width: '+sill_rate+'%;'"></view>
		        <view class="sill-for">
		          <view class="sill-li" style="left: -10px;">
		            <view class="li-num flex-def flex-cCenter flex-zCenter">
		              <view v-if="current_points>0" class="li-dot"></view>
		            </view>
		          </view>
		          <block v-for="(item,index) in sill_list">
		            <view class="sill-li" :style="'left: calc('+item.rate+'% - 5px);'">
		              <view class="li-num flex-def flex-cCenter flex-zCenter">
		                <view class="li-text">{{item.start}}</view>
		                <view v-if="sill_rate>=item.rate" class="li-dot"></view>
		                <view class="li-img" v-if="is_rewrad_show">
		                  <image :src="http_host+'/xyun_ads/web/static/images/icon_daosanjiao.png'"></image>
		                  <view class="li-scale">+{{item.moneyA}}{{item.moneyB}}</view>
		                </view>
		              </view>
		            </view>
		          </block>
		        </view>
		      </view>
		    </view>
		    <view v-if="mode_type=='declining_stock'&&css_type==1||mode_type=='fixed_ratio'&&css_type==1" :class="'strip-list skin-bg-'+theme">
		      <view class="strip-bd">
		        <view class="strip-scale" v-if="is_rewrad_show">
		          <block v-if="is_promoter||(sill_list[0].identity&&sill_list[0].identity=='not')">{{sill_list[0].identity&&sill_list[0].identity=='not'?sill_list[0].ratio:sill_list[level-1].ratio}}</block>
		          <block v-else>0</block>%<image :src="http_host+'/xyun_ads/web/static/images/icon_dom_jiantou.png'"></image>
		        </view>
		        <view class="strip-bg" v-if="is_promoter||(sill_list[0].identity&&sill_list[0].identity=='not')" :style="'width: '+(current_points<=0&&sill_list[level-1].threshold<=0?'0':(current_points / sill_list[level-1].threshold * 100) > 100 ? '100':(current_points / sill_list[level-1].threshold * 100))+'%;'">
		          <image mode="heightFix" :src="http_host+'/xyun_ads/web/static/images/icon_progress_bar.png'"></image>
		        </view>
		      </view>
		      <view class="strip-text flex-def flex-cCenter flex-zBetween">
		        <view class="strip-text-left flex-def">
		          <block v-if="is_promoter||(sill_list[0].identity&&sill_list[0].identity=='not')">
		            <block v-if="level != sill_list.length&&(sill_list[0].identity&&sill_list[0].identity!='not')">
		              当前推荐：{{child_num}}/{{sill_list[level].child_num}}<block v-if="sill_list[level].child_num > child_num">（<view class="flex-one">再邀请{{sill_list[level].child_num - child_num}}位{{promotion_name}}即可提升额度</view>）</block>
		            </block>
		            <!-- 无限制显示 -->
		            <block v-if="sill_list[0].identity&&sill_list[0].identity=='not'">
		              当前推荐：{{child_num}}/{{level == sill_list.length?sill_list[level-1].child_num:sill_list[level].child_num}}<block>（<view class="flex-one">再邀请{{level == sill_list.length?sill_list[level-1].child_num:sill_list[level].child_num - child_num}}位{{promotion_name}}即可提升额度</view>）</block>
		            </block>
		          </block>
		          <block v-else>成为{{promotion_name}}后即可获得{{integral}}容量</block>
		        </view>
		        <view class="strip-text-right">
		          <block v-if="is_promoter||(sill_list[0].identity&&sill_list[0].identity=='not')">{{current_points}}/{{sill_list[0].identity&&sill_list[0].identity=='not'?sill_list[0].threshold:sill_list[level-1].threshold}}</block>
		          <block v-else>0/0</block>
		        </view>
		      </view>
		    </view>
		    <view :class="'skin-bg-'+theme" :style="'height: 20px;background-color:' + (css_type==2?'rgb(252 31 75)!important':'')"></view>
		  </view>
		  <view class="title flex-def flex-cCenter flex-zBetween" v-if="css_type==1">
		    <view >
		      <block v-if="advertiseList.length>0">每日任务</block>
		    </view>
		    <!-- <view v-if="content" class="title-right" @click="go_common_problem">常见问题</view> -->
		  </view>
		  <view :class="'list '+(css_type==2?'list2':'')" :style="'background:url('+(css_type==2?http_host+'/xyun_ads/web/static/images/csstype2_ditu@3x.png':'')+';background-size:100% 100%;'">
		    <!-- <view v-if="content&&css_type==2" class="title-right2" @click="go_common_problem">常见问题</view> -->
		    <block v-for="(item,index) in advertiseList" >
		      <view class="li bgWhite flex-def flex-cCenter flex-zBetween">
		        <view class="left flex-one flex-def flex-cCenter">
		          <view :class="'img flex-def flex-cCenter flex-zCenter '+(css_type==2?'img2':'')">
		            <image v-if="css_type==1" :src="http_host+'/xyun_ads/web/static/images/icon_sp_logo.png'"></image>
		            <image v-if="css_type==2" :src="http_host+'/xyun_ads/web/static/images/csstype2_guanying@3x.png'"></image>
		          </view>
		          <view class="text">{{item.name}}</view>
		        </view>
		        <view class="right">
		          <block v-if="item.is_finfish">
		            <view class="btn def flex-def flex-cCenter flex-zCenter">已完成</view>
		          </block>
		          <block v-else>
		              <view :class="'btn flex-def flex-cCenter flex-zCenter skin-bg-'+theme+' skin-bd-'+theme+ (countdown_bool?' opacity-5':'')+ (css_type==2?' btn2':'')" @click="to_finish(item)">去完成</view>
		              <view class="time" v-if="countdown_bool && countdown_ind == index"><text>{{timelist[0]}}</text>分<text>{{timelist[1]}}</text>秒</view>
		          </block>
		        </view>
		      </view>
		    </block>
		    <view v-if="advertiseList.length==0" class="no-list">
		      <image :src="http_host+'/xyun_ads/web/static/images/icon_no_list.png'"></image>
		      <view class="text">更多任务即将开启，敬请期待~</view>
		    </view>
		
		    <view :class="'bottom '+(css_type==2?'bottom2':'')">
		      <view :class="css_type==2?'flex-def flex-cCenter flex-zCenter':''">
		        <block v-if="advertiseList.length!=0">
		          <view v-if="is_get_reward" :class="'btn skin-bg-'+theme+' flex-def flex-cCenter flex-zCenter opacity-5 '+(css_type==2?'btn2':'')">已领取奖励</view>
		          <view v-else :class="'btn skin-bg-'+theme+' flex-def flex-cCenter flex-zCenter '+(allow_get_reward?'':'opacity-5')+' '+(css_type==2?'btn2':'')" @click="draw_award">领取奖励</view>
		        </block>
		      </view>
		      <view :class="'award flex-def flex-zCenter '+(css_type==2?'award2':'')" @click="go_reward_record">奖励记录</view>
		    </view>
		    <view class="bottom_bg_img" v-if="css_type==2">
		        <image :src="http_host+'/xyun_ads/web/static/images/csstype2_hongbao@3x.png'" mode="widthFix"></image>
		    </view>
		  </view>
		  
		</view>
		<!-- 领取奖励弹窗static -->
		<block v-if="reward_popup_bool">
		  <view class="mask"></view>
		  <view class="reward-popup">
		    <view class="reward-title">领取成功</view>
		    <view class="reward-content">已成功领取<block v-if="reward_money&&reward_money>0"><span style="color: #EC5D29;">{{reward_money}}</span>{{reward_name}}</block><span v-if="reward_money_currency&&reward_money_currency>0"><block v-if="reward_money&&reward_money>0">和</block><span style="color: #EC5D29;">{{reward_money_currency}}</span>{{reward_name_currency}}</span>，到账可能存在延迟，请稍后查看实际到账情况</view>
		    <view :class="'reward-btn skin-color-'+theme" @click="reward_sure">确定</view>
		  </view>
		</block>
		<!-- 领取奖励弹窗end -->
		<!--协议弹窗-->
		<view class="xieyi_bool" v-if="xieyi_tips">
			<view class="xieyi_conent">
				<view class="xieyi_title">
					{{xieyiInfo.title}}
				</view>
				<view class="xieyi_div">
				  <view class="xieyi_text">
					  <rich-text :nodes="xieyiInfo.content"></rich-text>
				</view>
				<view class="xieyi_button flex-def flex-cCenter">
					<view @click="xieyiClear">
						取消
					</view>
					<view @click="xieyiSuccess">
						同意
					</view>
				</view>
				</view>
					 
			</view>
		</view>
		<!--协议弹窗end-->
		
		<!-- 广告加载失败时的视频弹窗start -->
		<block v-if="video_pop_bool">
		  <!-- <view class="mask"></view> -->
		  <view class="video-pop">
			<view class="video-nav flex-def flex-cCenter flex-zBetween">
			  <view class="btn left flex-def flex-cCenter flex-zCenter">
				<view>广告</view>
				<view class="line">
				  <block v-if="video_countdown_num > 0">{{video_countdown_num}}秒后可获得奖励</block>
				  <block v-else>已获得奖励</block>
				</view>
			  </view>
			  <view class="btn right flex-def flex-cCenter flex-zCenter">
				<image v-if="video_muted" class="img" @click="video_sound" :src="http_host+'/xyun_ads/web/static/images/icon_ldans_no.png'" mode=""/>
				<image v-else class="img" @click="video_sound" :src="http_host+'/xyun_ads/web/static/images/icon_ldans.png'" mode=""/>
				<view class="line" @click="video_close">关闭</view>
			  </view>
			</view>
			<!-- 视频链接 http://1300614005.vod2.myqcloud.com/91b1cc96vodcq1300614005/e9e955715285890814017568258/f0.mp4 -->
			<video class="video-view" id="myVideo" :src="local_video_info.list[video_index].url" :controls="false" :autoplay="true" :loop="true" :enable-progress-gesture="false" :muted="video_muted"></video>
		  </view>
		</block>
		<!-- 广告加载失败时的视频弹窗end -->
		<!--是否关闭视频弹窗start-->
		<view class="video_bool" v-if="video_tips">
			<view class="video_conent">
				<view class="video_title">暂未获得奖励<text decode="true">\n</text>是否继续观看视频</view>
				<view class="video_button flex-def flex-cCenter">
					<view class="flex-one" @click="videoClear">放弃</view>
					<view :class="'flex-one skin-color-'+theme" @click="videoSuccess">继续</view>
				</view>
			</view>
		</view>
		<!--是否关闭视频弹窗end-->
	</view>
</template>

<script>
	var rewardedVideoAd;	//计划创建的激励视频
	export default {
		data(){
			return {
				theme: getApp().globalData.style_color,
				price_color: getApp().globalData.price_color,
				monetary_unit: getApp().globalData.monetary_unit,
				http_host: "",
				mode_type: "", // 模式 积分integral_add 门槛integral_threshold
				current_points: "", // 当前积分
				allow_get_reward: false, // 是否可以领取奖励
				sill_bool: true, // 门槛模式是否符合门槛
				time_bool: true, // 是否是可领取时间
				rewarded_video_ad_id: "", // 广告位ID
				sill_list: [], // 门槛列表
				sill_list_num: "", // 最大积分
				sill_rate: "", // 进度
				advertiseList: [], // 任务列表数据
				task_id: "", // 任务id
				start_time: "", // 可领取任务时间开始
				end_time: "", // 可领取任务时间结束
				integral: "", // 自定义积分字段
				promotion_name: "", // 自定义销售员字段
				is_promoter: false, // 是否推广员
				level: 0, // 当前用户等级
				child_num: 0, // 已推荐人数
				ads_play_bool: true, // 广告是否播放成功
				ads_play_refresh: false, // 是否已刷新过页面
				user_id: 0, // 用户信息
				is_get_reward: false, // 是否已领取奖励
				content: "", // 常见问题内容
				reward_popup_bool: false, // 领取奖励弹窗是覅显示
				reward_money: "", // 奖励金额
				timer_bool: null, // 定时器
				timelist: [], //时间数组
				countdown: "", // 倒计时毫秒
				countdown_minute: "", // 倒计时分
				countdown_bool: false, // 是否显示倒计时
				is_rewrad_show: true, // 是否显示奖励比例
				countdown_ind: -1, // 显示倒计时的索引
				xyapp_banner_ad_id: '',//小程序广告位ID
				is_ad: true,//广告是否加载成功
				is_xyapp_ad: 0,
				is_xyapp_banner_ad: 0,
				reward_name: '',//奖励类型
				is_not_standard_reward: false,//是否开启未达标奖励
				is_integral_detail: false, // 是否显示积分明细跳转
				animationData:{},
				announcementScroll: [],//公告内容
				is_show: 0,//公告显示
				length:0,
				marqueePace: 1,//
				orientation:'left',
				marqueeDistance: 0,//初始滚动距离
				interval: 10, // 时间间隔 滚动速度,
				windowWidth: 0,
				setInterval:null,//计时器
				xieyiInfo: '',//协议数据
				xieyi_tips: false,//是否显示协议弹窗
				reward_money_currency:0,//购物券数量
				reward_name_currency:'',//自定义购物券名称
				local_video_info: {list:[]}, // 广告视频配置
				video_index: 0, // 广告视频索引
				video_pop_bool: false, // 视频弹窗是否显示
				video_muted: false, // 视频是否静音播放
				video_countdown_num: 30, // 广告倒计时
				video_countdown_tim: null, // 广告计时器
				video_tips: false, // 是否关闭视频弹窗
				css_type:1,
				isLoadingAd: false,	//激励视频广告是否正在加载中
				isLoadingAdSuccess:false,//是否加载成功广告
			}
		},
		onLoad(e){
			const that = this;
			that.user_id = that.vuex_user_id;
			that.http_host = that.vuex_apiUrl;
			that.get_announcement_lists();
			that.get_reward_list();
			that.get_problem();
			that.get_xieyiInfo();
			that.get_config();
		},
		methods:{
			// 继续观看视频
			videoSuccess() {
				const that = this;
				console.log('点击了同意')
				that.video_tips = false
				that.videoPlay();
				that.video_countdown();
			},
			// 放弃观看视频
			videoClear: function () {
				const that = this;
				that.video_tips = false,
				that.video_countdown_num = 30,
				that.video_pop(false);
			},
			// 关闭视频
			video_close(){
				const that = this;
				if(Number(that.video_countdown_num) > 0){
					that.videoPause();
					clearInterval(that.video_countdown_tim);
					that.video_tips = true
				}else{
					clearInterval(that.video_countdown_tim);
					that.video_pop(false);
					that.video_tips = false;
					that.video_countdown_num = 30;
				}
			},
			// 视频全屏
			startAction(){
				const that = this;
				let videoContext = uni.createVideoContext('myVideo', this);//   创建 video 上下文 VideoContext 对象。
				videoContext.requestFullScreen({   // 设置全屏时视频的方向，不指定则根据宽高比自动判断。
					direction: 0                   // 屏幕逆时针90度
				});
			},
			// 视频播放
			videoPlay(){
				const that = this;
				let videoplay = uni.createVideoContext('myVideo', this);//   创建 video 上下文 VideoContext 对象。
				videoplay.play();
			},
			// 视频暂停
			videoPause(){
				const that = this;
				let videoplay = uni.createVideoContext('myVideo', this);//   创建 video 上下文 VideoContext 对象。
				videoplay.pause();
			},
			// 视频弹窗是否显示
			video_pop(bool){
				const that = this;
				that.video_pop_bool = bool
				if(bool){
				  that.video_countdown();
				}else{
				  if(that.video_index < that.local_video_info.list.length - 1){
					that.video_index ++;
					that.video_index = that.video_index
				  }else{
					that.video_index = 0
				  }
				}
			},
			// 视频是否静音播放
			video_sound(){
				const that = this;
				that.video_muted = !that.video_muted
			},
			// 广告倒计时
			video_countdown(){
				const that = this;
				that.video_countdown_tim = setInterval(() => {
				  if(that.video_countdown_num == 0){
					clearInterval(that.video_countdown_tim);
					that.complete_task();
					return false;
				  }
				  that.video_countdown_num = Number(that.video_countdown_num) - 1
				}, 1000);
			},
			//获取协议信息
			get_xieyiInfo() {
				const that = this;
				that.$common.requestData({
					url: '/xyun_ads/web/index.php?m=protocol&a=get_protocol',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						if (res.data.content && res.data.content != '') {
							res.data.content = res.data.content.replace(/\<img/g, '<img class="detail_img"')
							res.data.content = res.data.content.replace(/\<p><img/g, '<p class="detail_p"><img')
							res.data.content = res.data.content.replace(/\<table/g, '<table class="detail_table"')
						}
						that.xieyiInfo  = res.data
						that.xieyi_tips = true
					}
				})
			},
			// 同意协议
			xieyiSuccess() {
				const that = this;
				console.log('点击了同意')
				that.$common.requestData({
					url: '/xyun_ads/web/index.php?m=protocol&a=agree',
					data: {'protocol_id': that.xieyiInfo.id},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						that.xieyi_tips = false
						console.log('同意了')
					} else {
						console.log('出错了')
						uni.showToast({
							title: res.errmsg,
							icon: 'none'
						})
						setTimeout(function () {
							uni.reLaunch({
								url: '/pages/index/index',
							})
						}, 2000)
					}
				})
			},
			// 取消协议
			xieyiClear: function () {
				var that = this
				that.xieyi_tips = false
				uni.reLaunch({
					url: '/pages/index/index',
				})
			},
			get_length(){
				var that=this;
				var length = 0;//文字长度
				var content = that.announcementScroll
				var windowWidth = uni.getSystemInfoSync().windowWidth - 50;// 屏幕宽度
				var finSpeed =0
			
				// 新滚动end
				for (var idx in content) {
				  // 新滚动start
				  length += content[idx].title.length * 13
				  if(content[idx].title.length>23){
					finSpeed += content[idx].title.length * 100
				  }else{
					finSpeed += 2300
				  }
				  // 新滚动end
				  if (idx < content.length - 1) {
					length += 300
				  }
				}
				if(length<windowWidth){
				  length=windowWidth
				}
			
				that.length = length;	
				that.windowWidth = windowWidth;	
				that.interval = finSpeed;
				that.bindAnimation()//新水平滚动
			},

			// 新滚动start 用动画滚动代替一直修改setdata
			bindAnimation(){
				var that = this;
				var animation = uni.createAnimation({
					duration: that.interval,
					timingFunction: 'linear',
					transformOrigin:"100% 0 0"
				})
				  //设置循环动画
				that.animation = animation;
				setTimeout(function(){
					animation.translateX('-100%').step();
					that.animationData = animation.export()
				}.bind(that),2000);
				setInterval(function(){
				    //第二个动画 文字位置初始化
					that.Animation2();
				    //延迟播放滚动动画（效果会更好点）
					setTimeout(function(){
					  animation.translateX('-100%').step();
					  that.animationData = animation.export()
					}.bind(that),2000);
				}.bind(that),that.interval+2000);
			},
			 
			/**
			 * 第二个动画 文字位置初始化
			*/
			Animation2(){
				var that = this;
				var animation2 = uni.createAnimation({
					duration: 0,
					timingFunction: 'linear',
					transformOrigin:"100% 0 0"
				})
				animation2.translateX('0%').step();
				that.animationData = animation2.export()
			},
			// 新滚动end
			
			//获取公告内容
			get_announcement_lists () {
				const that = this;
				that.$common.requestData({
					url: '/xyun_ads/web/index.php?m=announcement&a=get_user_announcement_list',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						that.announcementScroll = res.data
						that.is_show = res.is_show
						that.get_length()
					} else {
						uni.showToast({
							title: res.errmsg,
							icon: 'none',
						})
					}
				})
			},
			//跳转公告列表页
			go_announcement_lists () {
				// uni.navigateTo({
				//   url: "/xyun_ads/pages/announcementsLists/announcementsLists",
				// })
				this.$common.diyLinkJump('/xyun_ads/web/index.php?m=announcement&a=user_announcement_list','h5',true)
			},
			//跳转公告详情页
			go_announcement_detail (e) {
				let id = e.id;
				// uni.navigateTo({
				//   url: "/xyun_ads/pages/announcementsDetail/announcementsDetail?id=" + id,
				// })
				this.$common.diyLinkJump('/xyun_ads/web/index.php?m=announcement&a=user_announcement_detail&id='+id,'h5',true)
			},
			// 跳转积分明细页
			go_integral_list () {
				const that = this;
				// uni.navigateTo({
				//   url: "/xyun_ads/pages/integralList/integralList",
				// })
				this.$common.diyLinkJump('/xyun_ads/web/index.php?m=details&a=integral_list','h5',true)
			},
			
			// 去完成任务保存当前时间
			save_time () {
				const that = this;
				uni.setStorageSync('ads_current_time', new Date());
				that.setTime();
				that.countdown_bool = true
			},
			
			// 看广告后的间隔倒计时
			interval_countdown () {
				const that = this;
				var current_time = uni.getStorageSync('ads_current_time');
				if (current_time) {
				  var data = current_time.setMinutes(current_time.getMinutes() + Number(that.countdown_minute));
				  current_time = new Date(data);
				  if (new Date() > current_time) {
					that.countdown_bool = false
					uni.removeStorageSync('ads_current_time');
				  } else {
					var time = current_time - new Date();
					that.countdown_bool = true
					that.countdown = time
					that.setTime();
				  }
				} else {
				  that.countdown_bool = false
				}
			},
			
			// 倒计时方法
			updateEndTime: function() {
				const that = this;
				that.countdown = Number(that.countdown) - 1000
				if (that.countdown > 0) {
					var hour = Math.floor(that.countdown / (60 * 1000)); //计算分钟数
					var day = Math.floor((that.countdown - hour * 60 * 1000) / 1000); //计算秒
					// 计算是否补0
					day = day < 10 ? "0" + day : day
				} else {
					that.countdown_bool = false
					that.countdown = that.countdown_minute * 60000
					that.timelist = []
					uni.removeStorageSync('ads_current_time');
					clearInterval(that.timer_bool);
				}
				// console.log('倒计时',minite, hour, day,this.end_tiem,this.str_tiem,end_,start_);
				return [hour, day]
			},
			
			// 开启倒计时
			setTime: function() {
				const that = this
				that.timer_bool = setInterval(() => {
				  that.timelist = that.updateEndTime()
				}, 1000);
				that.timer_bool = that.timer_bool
			},
			
			// 获取常见问题内容
			get_problem: function() {
				const that = this;
				that.$common.requestData({
					url: '/xyun_ads/web/index.php?m=task&a=get_agreement',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						that.content = res.data
					} else {
						uni.showToast({
							title: res.errmsg,
							icon: 'none',
						})
					}
				})
			},
			// 跳转常见问题页
			go_common_problem () {
				const that = this;
				uni.navigateTo({
				  url: '/xyun_ads/pages/commonProblem/commonProblem'
				})
			},
			adLoad () {
				var that = this
				that.is_ad = true
			},
			adError (err) {
				var that = this
				that.is_ad = false
			},
			adClose () {
				console.log('Banner 广告关闭')
			},
			// 获取广告任务
			get_reward_list: function() {
				const that = this;
				that.$common.requestData({
					url: '/xyun_ads/web/index.php?m=task&a=task_list_api',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
					  var sill_list = res.data.rule_set.reward_ratio;
					  if (res.data.rule_set.type == 'section_decrease') {
						var sill_top_num = sill_list[0].start;
					  } else {
						var sill_top_num = sill_list[0].threshold;
					  }
					  var sill_list_num = sill_list[sill_list.length - 1].threshold;
					  var user_integral = res.data.user_integral;
					  var sill_rate_num = parseInt(100 / sill_list.length);
					  var num = -1;
					  var sill_rate = 0;
					  if (Number(user_integral) >= Number(sill_top_num)) {
						var sill_bool = true;
					  } else {
						var sill_bool = false;
					  }
					  if (res.data.rule_set.type == 'section_decrease') {
						sill_list.forEach((item, index) => {
						  item.rate = parseInt((100 / sill_list.length) * (index + 1));
						  item.moneyA = util.toPrice(item.money, true)
						  item.moneyB = util.toPrice(item.money, false)
						  if (Number(user_integral) >= item.start) {
							num = index + 1;
						  }
						  item.child_num = Number(item.child_num);
						})
						if (num == -1) {
						  var differ_rate = (user_integral / sill_list[0].start).toFixed(2);
						  sill_rate = parseInt(sill_rate_num * differ_rate);
						} else if (num < sill_list.length && num != -1) {
						  var differ = Number(sill_list[num].start) - Number(sill_list[num - 1].start);
						  var differs = Number(user_integral) - Number(sill_list[num - 1].start);
						  var differ_rate = (differs / differ).toFixed(2);
						  sill_rate = sill_rate_num * num + parseInt(sill_rate_num * differ_rate);
						} else {
						  sill_rate = 100;
						}
					  } else {
						sill_list.forEach((item, index) => {
						  item.rate = parseInt((100 / sill_list.length) * (index + 1));
						  if (Number(user_integral) >= item.threshold) {
							num = index + 1;
						  }
						  item.child_num = Number(item.child_num);
						})
						if (num == -1) {
						  var differ_rate = (user_integral / sill_list[0].threshold).toFixed(2);
						  sill_rate = parseInt(sill_rate_num * differ_rate);
						} else if (num < sill_list.length && num != -1) {
						  var differ = Number(sill_list[num].threshold) - Number(sill_list[num - 1].threshold);
						  var differs = Number(user_integral) - Number(sill_list[num - 1].threshold);
						  var differ_rate = (differs / differ).toFixed(2);
						  sill_rate = sill_rate_num * num + parseInt(sill_rate_num * differ_rate);
						} else {
						  sill_rate = 100;
						}
					  }

						that.time_judge(res.data.rule_set.start_time, res.data.rule_set.end_time);
						for (var i = 0; i < res.data.task_list.length; i++) {
							if (res.data.task_list[i].is_finfish == 0) {
								that.countdown_ind = i
								break;
							} else {
								that.countdown_ind = -1
							}
						}
						that.mode_type = res.data.rule_set.type
						that.current_points = user_integral
						that.allow_get_reward = res.data.allow_get_reward == 0 ? false : true
						that.sill_list = sill_list
						that.advertiseList = res.data.task_list
						that.sill_rate = sill_rate > 100 ? 100 : sill_rate
						that.sill_bool = sill_bool
						that.rewarded_video_ad_id = res.data.rule_set.xyapp_video_ad_id
						that.start_time = res.data.rule_set.start_time
						that.end_time = res.data.rule_set.end_time
						that.integral = res.data.integral_name
						that.promotion_name = res.data.promotion_name
						that.is_promoter = res.data.is_promoter == 0 ? false : true
						that.level = !res.data.level ? 1 : Number(res.data.level)
						that.child_num = res.data.child_num ? Number(res.data.child_num) : 0
						that.is_get_reward = res.data.is_get_reward == 0 ? false : true
						that.countdown_minute = res.data.rule_set.interval_time // 间隔时间 分
						that.countdown = res.data.rule_set.interval_time * 60000 // 间隔时间 毫秒
						that.is_rewrad_show = res.data.rule_set.is_rewrad_show == 0 ? false : true // 是否显示奖励比例
						that.xyapp_banner_ad_id = res.data.rule_set.xyapp_banner_ad_id//小程序广告ID
						that.is_xyapp_ad = res.data.rule_set.is_xyapp_ad
						that.is_xyapp_banner_ad = res.data.rule_set.is_xyapp_banner_ad
						that.is_not_standard_reward = res.data.rule_set.is_not_standard_reward == 1 ? true : false//3/9是否开启未达标奖励
						that.is_integral_detail = res.data.is_integral_detail == 1 ? true : false
						that.local_video_info = res.data.local_video_info
						that.reward_ratio = res.data.rule_set.reward_ratio
						if (res.data.rule_set.interval_time != 0) {
							that.interval_countdown();
						}
						// if (!rewardedVideoAd && !that.allow_get_reward) {
							that.loadRewardedVideoAd();
						// }
					}
				})
			},
			
			// 进度计算
			progress_calculation(){
				const that = this;
				var sill_list = that.reward_ratio;
				if (that.mode_type == 'section_decrease') {
				  var sill_top_num = sill_list[0].start;
				} else {
				  var sill_top_num = sill_list[0].threshold;
				}
				var sill_list_num = sill_list[sill_list.length - 1].threshold;
				var user_integral = that.current_points;
				var sill_rate_num = parseInt(100 / sill_list.length);
				var num = -1;
				var sill_rate = 0;
				if (Number(user_integral) >= Number(sill_top_num)) {
				  var sill_bool = true;
				} else {
				  var sill_bool = false;
				}
				if (that.mode_type == 'section_decrease') {
				  sill_list.forEach((item, index) => {
					item.rate = parseInt((100 / sill_list.length) * (index + 1));
					item.moneyA = util.toPrice(item.money, true)
					item.moneyB = util.toPrice(item.money, false)
					if (Number(user_integral) >= item.start) {
					  num = index + 1;
					}
					item.child_num = Number(item.child_num);
				  })
				  if (num == -1) {
					var differ_rate = (user_integral / sill_list[0].start).toFixed(2);
					sill_rate = parseInt(sill_rate_num * differ_rate);
				  } else if (num < sill_list.length && num != -1) {
					var differ = Number(sill_list[num].start) - Number(sill_list[num - 1].start);
					var differs = Number(user_integral) - Number(sill_list[num - 1].start);
					var differ_rate = (differs / differ).toFixed(2);
					sill_rate = sill_rate_num * num + parseInt(sill_rate_num * differ_rate);
				  } else {
					sill_rate = 100;
				  }
				} else {
				  sill_list.forEach((item, index) => {
					item.rate = parseInt((100 / sill_list.length) * (index + 1));
					if (Number(user_integral) >= item.threshold) {
					  num = index + 1;
					}
					item.child_num = Number(item.child_num);
				  })
				  if (num == -1) {
					var differ_rate = (user_integral / sill_list[0].threshold).toFixed(2);
					sill_rate = parseInt(sill_rate_num * differ_rate);
				  } else if (num < sill_list.length && num != -1) {
					var differ = Number(sill_list[num].threshold) - Number(sill_list[num - 1].threshold);
					var differs = Number(user_integral) - Number(sill_list[num - 1].threshold);
					var differ_rate = (differs / differ).toFixed(2);
					sill_rate = sill_rate_num * num + parseInt(sill_rate_num * differ_rate);
				  } else {
					sill_rate = 100;
				  }
				}
			
				that.time_judge(that.start_time, that.end_time);
				for (var i = 0; i < that.advertiseList.length; i++) {
				  if (that.advertiseList[i].is_finfish == 0) {
					that.countdown_ind = i
					break;
				  } else {
					that.countdown_ind = -1
				  }
				}			
				that.sill_rate = sill_rate > 100 ? 100 : sill_rate
				that.sill_bool = sill_bool
			},
			
			// 可领取任务时间判断
			time_judge: function(start_time, end_time) {
				const that = this;
				var date = new Date();
				var Y = date.getFullYear();
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
				var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				var ymd = Y + "/" + M + "/" + D + " ";
				var start = ymd + start_time;
				var end = ymd + end_time;
				if (new Date(start) > new Date(end)) {
				  if (new Date() > new Date(end) && new Date() < new Date(start)) {
					that.time_bool = false
				  } else {
					that.time_bool = true
				  }
				} else {
				  if (new Date() > new Date(start) && new Date() < new Date(end)) {
					that.time_bool = true
				  } else {
					that.time_bool = false
				  }
				}
				console.log("当前时间：" + Y + "/" + M + "/" + D);
				console.log(that.time_bool);
			},
			
			//载入app广告
			loadRewardedVideoAd(){
				let that = this;
				that.isLoadingAd = true;
				rewardedVideoAd = uni.createRewardedVideoAd({
					adpid: that.rewarded_video_ad_id,
					urlCallback: { // 服务器回调透传参数
					  userId: '',
					  extra: ''
					}
				})
				console.log('api广告ID',  that.rewarded_video_ad_id)
				rewardedVideoAd.onLoad(() => {
					console.log('api广告 onLoad event')
					that.isLoadingAd = false;
					that.isLoadingAdSuccess = true
					// 当激励视频被关闭时，默认预载下一条数据，加载完成时仍然触发 `onLoad` 事件
				})
				rewardedVideoAd.onError((err) => {
					this.isLoadingAd = false;
					console.log('api广告 onError event', err)
				})
				rewardedVideoAd.onClose((res) => {
					console.log('api广告 onClose event', res)
					// 用户点击了【关闭广告】按钮
					that.ads_play_bool = true
					if (res && res.isEnded) {
					// 正常播放结束
						console.log("onClose " + res.isEnded);
						that.complete_task();
					} else {
					// 播放中途退出
						console.log("onClose " + res.isEnded);
					}
				})
			},
			
			// 初始化广告
			evoke_advertisement: function() {
				const that = this;
				if (uni.createRewardedVideoAd) {
				  that.rewardedVideoAd = uni.createRewardedVideoAd({ adUnitId: that.rewarded_video_ad_id })
				  that.rewardedVideoAd.onLoad(() => {
					console.log('广告位加载成功')
					that.isLoadingAdSuccess = true
				  })
				  that.rewardedVideoAd.onError((err) => {
					console.log('广告位加载失败', err)
					that.isLoadingAdSuccess = false
					uni.showToast({
					  title: '广告获取失败',
					  icon: 'none',
					})
				  })
				  that.rewardedVideoAd.onClose((res) => {
					console.log('用户点击了关闭按钮', res)
					that.ads_play_bool = true
					// 用户点击了【关闭广告】按钮
					if (res && res.isEnded) {
					  // 正常播放结束，可以下发游戏奖励
					  console.log("已看完视频！！！")
					  that.complete_task();
					} else {
					  // 播放中途退出，不下发游戏奖励
					  console.log("中途退出")
					}
				  })
				}
			},
			
			// 唤起广告
			to_finish: function(e) {
				const that = this;
				console.log(e)
				if (that.isLoadingAd) {
					uni.showToast({
						title: "广告加载中，请稍后重试",
						icon: 'none',
					})
					return false;
				}
				if (!that.isLoadingAdSuccess) {
					uni.showToast({
						title: "广告加载失败，请重启APP重试",
						icon: 'none',
					})
					return false;
				}

				var num = e.id;
				var adId=e.xyapp_ads_id;
				that.task_id = num
				if(that.local_video_info.is_open == 1 && that.local_video_info.play_type == 1){
				  that.video_pop(true);
				  return false;
				}
				if (that.countdown_bool) {
				  return false;
				}
				if (that.time_bool) {
				  if (that.ads_play_bool) {
					if (that.countdown_minute != 0) {
					  that.save_time();
					}
					that.ads_play_bool = false
					if(adId&&adId!=''){
					  that.rewarded_video_ad_id = adId
					}
					rewardedVideoAd.show();
				  } else {
					if (that.ads_play_refresh) {
					  if(that.local_video_info.is_open == 0||that.local_video_info.is_open == 1 && that.local_video_info.play_type == 2){
						that.video_pop(true);
						return false;
					  }
					  uni.showModal({
						title: '广告加载失败',
						content: '请尝试重新进入或关闭APP重新进入',
						showCancel: false,
						success (res) {
						  if (res.confirm) {
							console.log('用户点击确定')
						  }
						}
					  })
					} else {
					  uni.navigateTo({
						url: '/xyun_ads/pages/advertiseList?refresh=true'
					  })
					}
				  }
				} else {
				  uni.showModal({
					title: '领取失败',
					content: '每日' + that.start_time + '至' + that.end_time + '可领取任务',
					showCancel: false,
					success (res) {
					  if (res.confirm) {
						console.log('用户点击确定')
					  }
					}
				  })
				}
			},
			// 完成任务
			complete_task: function() {
				const that = this;
				if(!that.isLoadingAdSuccess){
				  if(that.local_video_info.is_open == 0||that.local_video_info.is_open == 1 && that.local_video_info.play_type == 2||that.local_video_info.is_open == 1 && that.local_video_info.play_type == 1){			
				  }else{
					return false;
				  }
				}
				let local_video_id=''
				if(that.local_video_info.list.length>0){
				  local_video_id=that.local_video_info.list[that.video_index].id
				}

				that.$common.requestData({
					url: '/xyun_ads/web/index.php?m=task&a=complate_task_api',
					data: {
						task_id: that.task_id,
						local_video_id: local_video_id,
					},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						var length_num = 0;
						that.advertiseList.forEach((item,index)=>{
							if(item.id == that.task_id){
							  item.is_finfish = 1;
							}
							if(item.is_finfish == 0){
							  length_num ++;
							}
						})
						if(length_num == 0){
							that.allow_get_reward = true;
						}
						that.task_id = "",
						that.advertiseList = that.advertiseList,
						that.allow_get_reward = that.allow_get_reward
						that.progress_calculation();
					} else {
						uni.showToast({
							title: res.errmsg,
							icon: 'none',
						})
					}
				})
			},
			
			// 领取奖励
			draw_award () {
				const that = this;
				if (that.allow_get_reward) {
					if (!that.is_not_standard_reward) {
						//开启了未达标奖励则不判断
						if (that.mode_type == 'integral_threshold' && !that.sill_bool) {
						  uni.showToast({
							title: "暂未达到积分门槛，无法领取奖励",
							icon: 'none',
						  })
						  return false;
						}
					}
				  
					that.$common.requestData({
						url: '/xyun_ads/web/index.php?m=task&a=get_task_reward',
						data: {},
						method: 'POST',
						needToken: true
					}).then(res => {
						if (res.errcode == 0) {
							that.reward_money = res.reward_money
							that.reward_name = res.reward_name
							that.reward_popup_bool = true
							that.reward_money_currency = res.reward_money_currency
							that.reward_name_currency = res.reward_name_currency
						} else {
							uni.showToast({
							  title: res.errmsg,
							  icon: 'none',
							})
						}
					})
				}
			},
			// 领取奖励确定
			reward_sure () {
				const that = this;
				that.reward_popup_bool = false;
				that.allow_get_reward = false;
				that.get_reward_list();
			},
			// 跳转奖励记录
			go_reward_record: function() {
				const that = this;
				// uni.navigateTo({
				//   url: '../rewardRecord/rewardRecord'
				// })
				
				this.$common.diyLinkJump('/xyun_ads/web/index.php?m=task&a=reward_record','h5',true)
			},
			//获取样式
			get_config () {
				const that = this;
				that.$common.requestData({
					url: '/xyun_ads/web/index.php?m=function_setting&a=get_config',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
					  that.css_type = res.data.task_list_style
					} else {
						uni.showToast({
							title: res.errmsg,
							icon: 'none',
						})
					}
				})
			},
		}
	}
</script>

<style scoped>
	page{
	  background-color: #f5f5f5;
	}
	.bgWhite{
	  background-color: #fff;
	}
	.opacity-5{
	  opacity: 0.5;
	}
	.position-fixed-top{
	  position: fixed;
	  width: 100%;
	  top: 0;
	  left: 0;
	}
	.position-fixed-bottom{
	  position: fixed;
	  width: 100%;
	  bottom: 0;
	  left: 0;
	}
	.advertise .top{
	  position: relative;
	}
	.advertise .top .jfmx{
	  width: 82px;
	  height: 29px;
	  line-height: 29px;
	  position: absolute;
	  top: 15px;
	  right: 0;
	  z-index: 1;
	  text-align: right;
	  padding-right: 5px;
	  box-sizing: border-box;
	  font-size: 12px;
	  color: #fff;
	}
	.advertise .top .jfmx image{
	  width: 100%;
	  height: 100%;
	  position: absolute;
	  left: 0;
	  top: 0;
	  z-index: 1;
	}
	.advertise .top .bg-img{
	  width: 178.5px;
	  height: 240px;
	  position: absolute;
	  top: 0;
	  right: 0;
	}
	.advertise .top .style-one{
	  height: 138px;
	  color: #fff;
	  text-align: center;
	}
	.advertise .top .style-one .text{
	  font-size: 15px;
	  line-height: 1;
	  margin-bottom: 8px;
	}
	.advertise .top .style-one .num{
	  font-size: 32px;
	  line-height: 1;
	}
	.advertise .sill-list{
	  padding: 20px 40px 75px 35px;
	  box-sizing: border-box;
	}
	.advertise .sill-list .sill-bd{
	  width: 100%;
	  height: 2px;
	  position: relative;
	  background-color: rgba(250, 250, 250, .8);
	  border-radius: 1px;
	}
	.advertise .sill-list .sill-bd .sill-bg{
	  position: absolute;
	  height: 4px;
	  top: -1px;
	  left: 0;
	  z-index: 11;
	  background-color: #FBE94D;
	  border-radius: 2px;
	  box-shadow: 0 1.5px 5px rgba(0, 0, 0, .16);
	}
	.advertise .sill-list .sill-bd .sill-for{
	  position: absolute;
	  height: 2px;
	  width: 100%;
	  left: 0;
	  top: 0;
	}
	.advertise .sill-list .sill-bd .sill-for .sill-li{
	  position: absolute;
	  top: -5.5px;
	  z-index: 15;
	}
	.advertise .sill-list .sill-bd .sill-for .sill-li .li-num{
	  width: 11px;
	  height: 11px;
	  border: 0.75px solid #FBE94D;
	  border-radius: 50%;
	  box-sizing: border-box;
	  background-color: #fff;
	  box-shadow: 0 0 3px rgba(0, 0, 0, .16);
	  font-size: 12px;
	  color: #fff;
	  position: relative;
	}
	.advertise .sill-list .sill-bd .sill-for .sill-li .li-num .li-dot{
	  width: 7px;
	  height: 7px;
	  background-color: #FBE94D;
	}
	.advertise .sill-list .sill-bd .sill-for .sill-li .li-num .li-text{
	  position: absolute;
	  left: 50%;
	  top: -20px;
	  transform: translateX(-50%);
	}
	.advertise .sill-list .sill-bd .sill-for .sill-li .li-num .li-img{
	  width: 50.5px;
	  height: 22.5px;
	  position: absolute;
	  left: 50%;
	  top: 20px;
	  margin-left: -25px;
	}
	.advertise .sill-list .sill-bd .sill-for .sill-li .li-num .li-img image{
	  position: absolute;
	  left: 50%;
	  top: 0;
	  transform: translateX(-50%);
	  width: 4.5px;
	  height: 2.5px;
	  z-index: 21;
	  /* border-bottom: 1px solid #fff; */
	}
	.advertise .sill-list .sill-bd .sill-for .sill-li .li-num .li-img .li-scale{
	  position: absolute;
	  height: 20px;
	  min-width: 50px;
	  left: 50%;
	  bottom: 0;
	  transform: translateX(-50%);
	  z-index: 20;
	  line-height: 20px;
	  padding: 0 5px;
	  background-color: #fff;
	  border-radius: 10px;
	  text-align: center;
	  font-size: 12px;
	  color: #EC5D29;
	  border: 1px solid #DFDFDF;
	  box-sizing: border-box;
	}
	.advertise .title{
	  height: 50px;
	  padding-left: 20px;
	  padding-right: 15px;
	  border-top-left-radius: 20px;
	  border-top-right-radius: 20px;
	  font-size: 18px;
	  color: #5d5d5d;
	  background-color: #f5f5f5;
	  position: relative;
	  z-index: 10;
	}
	.advertise .title .title-right{
	  font-size: 13px;
	  color: #6A7FA6;
	}
	.advertise .list{
	  padding: 0 9px;
	  box-sizing: border-box;
	  position: relative;
	  z-index: 50;
	}
	.advertise .list .li{
	  height: 60px;
	  padding: 0 15px;
	  border-radius: 8px;
	  margin-bottom: 9px;
	}
	.advertise .list .li:nth-last-child(1){
	  margin-bottom: 0;
	}
	.advertise .list .li .left .img{
	  width: 44px;
	  height: 44px;
	  border-radius: 50%;
	  background-color: #FDF0D8;
	  margin-right: 12px;
	}
	.advertise .list .li .left .img image{
	  width: 28px;
	  height: 28px;
	}
	.advertise .list .li .left .text{
	  font-size: 16px;
	  color: #333;
	  font-weight: 600;
	}
	.advertise .list .li .right .btn{
	  width: 70px;
	  height: 30px;
	  border-radius: 15px;
	  font-size: 14px;
	  color: #fff;
	}
	.advertise .list .li .right .btn.def{
	  border: 0.5px solid #ccc;
	  color: #999;
	  box-sizing: border-box;
	}
	.advertise .list .li .right .time{
	  font-size: 12px;
	  text-align: center;
	  line-height: 1;
	  margin-top: 3px;
	}
	.advertise .list .li .right .time text{
	  color: #D9001B;
	}
	.advertise .no-list{
	  text-align: center;
	  padding-top: 32px;
	}
	.advertise .no-list image{
	  width: 222px;
	  height: 132px;
	  margin-bottom: 32.5px;
	}
	.advertise .no-list .text{
	  font-size: 13px;
	  color: #ccc;
	  line-height: 1;
	}
	
	.advertise .bottom{
	  padding: 48px 24px 0;
	  background-color: #f5f5f5;
	}
	.advertise .bottom .btn{
	  height: 40px;
	  border-radius: 20px;
	  font-size: 16px;
	  color: #fff;
	}
	.advertise .bottom .award{
	  padding: 16px 0 24px;
	  line-height: 1;
	  font-size: 14px;
	  color: #6A7FA6;
	}
	
	
	.advertise .strip-list{
	  padding: 20px 23px 41px 23px;
	  box-sizing: border-box;
	}
	.advertise .strip-list .strip-bd{
	  width: 100%;
	  height: 16px;
	  position: relative;
	  background-color: rgba(250, 250, 250, .9);
	  border-radius: 8px;
	  border: 2px solid rgba(250, 250, 250, .9);
	  box-sizing: border-box;
	}
	.advertise .strip-list .strip-bd .strip-scale{
	  height: 18px;
	  color: #EC5D29;
	  font-size: 12px;
	  border-radius: 9px;
	  padding: 0 9px;
	  box-sizing: border-box;
	  text-align: center;
	  line-height: 18px;
	  min-width: 40px;
	  background-color: #fff;
	  position: absolute;
	  top: -33px;
	  right: -8px;
	}
	.advertise .strip-list .strip-bd .strip-scale image{
	  width: 9px;
	  height: 6px;
	  position: absolute;
	  right: 8.5px;
	  bottom: -5px;
	  z-index: 10;
	}
	.advertise .strip-list .strip-bd .strip-bg{
	  position: absolute;
	  height: 100%;
	  top: 0;
	  left: 0;
	  z-index: 11;
	  border-radius: 8px;
	  overflow: hidden;
	}
	.advertise .strip-list .strip-bd .strip-bg image{
	  height: 100%;
	  display: block;
	}
	.advertise .strip-list .strip-text{
	  margin-top: 8px;
	  font-size: 12px;
	  color: #fff;
	  line-height: 1;
	}
	.advertise .strip-list .strip-text .strip-text-left view{
	  white-space:nowrap;
	  overflow:hidden;
	  text-overflow:ellipsis;
	}
	
	/* 遮罩 */
	.mask{
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  top: 0;
	  left: 0;
	  background: rgba(0, 0, 0, .5);
	  overflow: hidden;
	  z-index: 9000;
	}
	.reward-popup{
	  width: 80%;
	  overflow: hidden;
	  position: fixed;
	  top: 50%;
	  left: 10%;
	  z-index: 9999;
	  background: #f9f9f9;
	  transform: translateY(-50%);
	  border-radius: 36rpx;
	  text-align: center;
	}
	.reward-popup .reward-title{
	  padding-top: 50rpx;
	  font-size: 36rpx;
	  color: #030303;
	  font-weight: bold;
	}
	.reward-popup .reward-content{
	  padding: 40rpx 60rpx 50rpx;
	  font-size: 34rpx;
	  color: #999;
	}
	.reward-popup .reward-btn{
	  height: 100rpx;
	  border-top: 1rpx solid #dedede;
	  font-size: 34rpx;
	  line-height: 100rpx;
	  font-weight: bold;
	}
	.adContainer {
	  width: 100%;
	}
	
	.ad_view_2 {
	  width: 100%;
	  display: flex;
	  align-items: center;
	  position: relative;
	  overflow: hidden;
	}
	
	/* 公告滚动start */
	.announcement-scroll{
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fffbe8;
	}
	.swiper_container {
	  height: 35px;
	  line-height: 35px;
	  width: calc(100% - 50px);
	  display: inline-block;
	  position: relative;
	  overflow: hidden
	}
	.swiper_text_wrap{
	  position: absolute;
	  top: 0;
	  display: flex;
	}
	
	.swiper_item {
	  font-size: 13px;
	  height: 13px;
	  color: #ED6A0C;
	}
	.announcement-laba{
	  width: 20px;
	  height: 20px;
	  margin: 1px 5px 0 11px;
	}
	.announcement-laba-list{
	  width: 20px;
	  height: 20px;
	  padding: 8.5px 7.5px 6.5px;
	  background-color: #fff1d4;
	}
	.swiper_container {
	  height: 35px;
	  line-height: 35px;
	  width: 100%;
	  display: inline-block;
	  position: relative;
	}
	.swiper_container .scrolltext>text{
	  font-size: 13px;
	  height: 13px;
	  color: #ED6A0C;
	}
	/* 公告滚动end */
	.xieyi_bool{
	  background: rgba(0,0,0,0.6);
	  position: fixed;
	  z-index: 98;
	  top: 0;
	  left: 0;
	  bottom: 0;
	  right: 0;
	  padding: 178rpx 60rpx 60rpx 60rpx;
	}
	.xieyi_bool .xieyi_conent{
	  background: #fff;
	  font-size: 28rpx;
	  color: #999;
	  /*padding: 0 25px;*/
	  border-radius: 16rpx;
	  z-index: 99;
	}
	.xieyi_bool .xieyi_text{
	  padding: 0 50rpx;
	  padding-bottom: 40rpx;
	  max-height: 700rpx;
	height: 700rpx;
	overflow: scroll;
	}
	.xieyi_text image{
	  width: 100%;
	  height: 100%;
	}
	/* 滚动条透明 */
	.xieyi_text::-webkit-scrollbar {
	  width: 0px;
	  height: 0px;
	  display: none;
	}
	
	.xieyi_text::-webkit-scrollbar-thumb {
	  width: 0px;
	  height: 0px;
	  background-color: transparent;
	  border-radius: 0px;
	  display: none;
	}
	
	.xieyi_text::-webkit-scrollbar-track {
	  border-radius: 0px;
	  background-color: transparent;
	  display: none;
	}
	.xieyi_bool .xieyi_title{
	  color: #333;
	  font-size: 38rpx;
	  line-height: 130rpx;
	  height: 130rpx;
	  text-align: center;
	}
	.xieyi_bool .xieyi_button{
	  border-top: 1px solid #f1f1f1;
	  padding: 12rpx 0;
	}
	.xieyi_button>view{
	width: 49.5%;
	line-height: 68rpx;
	height: 70rpx;
	font-size: 32rpx;
	color: #377EF6;
	
	text-align: center;
	}
	.xieyi_button>view:nth-child(1){
	color: #999;
	border-right: 1px solid #f1f1f1;
	}
	.xieyi_div{
	  height: 700rpx;
	  overflow: scroll;
	}
	.xieyi_div::-webkit-scrollbar {
	  width: 0px;
	  height: 0px;
	  display: none;
	}
	
	.xieyi_div::-webkit-scrollbar-thumb {
	  width: 0px;
	  height: 0px;
	  background-color: transparent;
	  border-radius: 0px;
	  display: none;
	}
	
	.xieyi_div::-webkit-scrollbar-track {
	  border-radius: 0px;
	  background-color: transparent;
	  display: none;
	}
	.detail_img {
		max-width: 100%;
		display: block;
		height: auto;
	}
	
	.detail_p {
		font-size: 0;
	}
	
	.detail_table {
		width: 100% !important;
	}
	
	/* 广告加载失败时的视频弹窗start */
	.video-pop{
	  position: fixed;
	  top: 0;
	  left: 0;
	  z-index: 100;
	  width: 100%;
	  height: 100vh;
	}
	.video-pop .video-nav{
	  padding: 6px 6px 6px 10px;
	  box-sizing: border-box;
	  background-color: #000;
	}
	.video-pop .video-nav .btn{
	  border: 0.5px solid rgba(255, 255, 255, 0.2);
	  border-radius: 15.5px;
	  padding: 8px 12px;
	  box-sizing: border-box;
	  font-size: 14px;
	  color: #fff;
	}
	.video-pop .video-nav .btn .img{
	  width: 16.5px;
	  height: 16.5px;
	}
	.video-pop .video-nav .btn .line{
	  margin-left: 10px;
	  padding-left: 8px;
	  box-sizing: border-box;
	  border-left: 0.5px solid rgba(255, 255, 255, 0.2);
	}
	.video-pop .video-view{
	  width: 100%;
	  height: calc(100% - 52px);
	}
	/* 广告加载失败时的视频弹窗end */
	/* 是否关闭视频弹窗start */
	.video_bool{
	  background: rgba(0,0,0,0.6);
	  position: fixed;
	  z-index: 101;
	  top: 0;
	  left: 0;
	  bottom: 0;
	  right: 0;
	  padding: 0 60rpx;
	}
	.video_bool .video_conent{
	  background: #fff;
	  font-size: 28rpx;
	  color: #999;
	  border-radius: 16rpx;
	  z-index: 102;
	  position: relative;
	  top: 50%;
	  transform: translateY(-50%);
	}
	.video_bool .video_title{
	  color: #333;
	  font-size: 17px;
	  font-weight: 600;
	  line-height: 50rpx;
	  text-align: center;
	  padding: 34px 0;
	  box-sizing: border-box;
	}
	.video_bool .video_button{
	  border-top: 0.5px solid #f0f0f0;
	  padding: 22rpx 0;
	}
	.video_button>view{
	  line-height: 50rpx;
	  height: 50rpx;
	  font-size: 32rpx;
	  font-weight: 600;
	  color: #3476FE;
	  text-align: center;
	}
	.video_button>view:nth-child(1){
	  color: #5D5D5D;
	  border-right: 0.5px solid #F0F0F0;
	}
	/* 是否关闭视频弹窗end */
	
	/* 1.8.0版本start */
	.task-reward{
	  height: 100%;
	}
	.task-reward .left{
	  padding: 53.5px 0 0 28.5px;
	  box-sizing: border-box;
	}
	.task-reward .left .img{
	  width: 93px;
	  height: 29px;
	}
	.task-reward .left .text{
	  margin-top: 10px;
	  font-size: 15px;
	  color: #fff;
	  line-height: 1;
	}
	.task-reward .right{
	  width: 184px;
	  height: 184px;
	}
	/* 1.8.0版本end */
	/*1.9.4样式二修改*/
	.advertise .list2 {
	  border-radius: 15px 15px 0 0;
	  padding: 20px 17px 0;
	  height: calc(100% - 150px);
	  min-height: calc(100vh - 150px);
	  margin-top: -26px;
	  position: relative;
	}
	.advertise .top .style-one2,.task-reward2{
	  height: 176px;
	  box-sizing: border-box;
	}
	.advertise .top .style-one2 .text2 {
	  font-size: 17px;
	  line-height: 1;
	  margin-bottom: 10px;
	}
	.advertise .top .style-one2 .text3 {
	  font-size: 15px;
	  line-height: 1;
	  margin-bottom: 10px;
	}
	
	.advertise .top .style-one2 .num2 {
	  font-size: 35px;
	  line-height: 1;
	}
	.advertise .top .style-one2 .num3 {
	  font-size: 23px;
	  line-height: 1;
	}
	.advertise .list .li {
	  position: relative;
	  z-index: 2;
	}
	.advertise .list .li .right .btn2 {
	  font-size: 14px;
	  color: #F054A3!important;
	  background: linear-gradient(0deg, #FDEFD5, #FFC760)!important;
	}
	.advertise .list .li .left .img2,.advertise .bottom2 {
	  background-color: transparent;
	}
	.advertise .list .li .left .img2 image {
	  width: 37px;
	  height: 37px;
	}
	.advertise .bottom2 {
	  position: relative;
	  z-index: 2;
	}
	.advertise .bottom2 .btn2 {
	  height: 32px;
	  width: 109px;
	  border-radius: 16px;
	  font-size: 16px;
	  color: #F054A3!important;
	  background: linear-gradient(0deg, #FDEFD5, #FFC760)!important;
	}
	.advertise .bottom2 .award2 {
	  font-size: 16px;
	  padding: 9.5px 0 24px;
	  line-height: 1;
	  color: #ffffff;
	}
	.bottom_bg_img{
	  position: absolute;
	  bottom: 0px;
	  left: 0;
	  width: 100%;
	  z-index: 1;
	}
	.bottom_bg_img image{
	  width: 100%;
	  height: 100%;
	  object-fit: cover;
	}
	.height-176{
	  height: 176px;
	}
	.padding-top-33{
	  padding-top: 33px;
	}
	.advertise .sill-list2 {
	  padding: 27px 40px 45px 35px;
	  box-sizing: border-box;
	  position: relative;
	}
	.task-reward .left2 {
	  padding: 0px; 
	  text-align: center;
	  box-sizing: border-box;
	}
	.task-reward .left .text2{
	  margin-top: 0;
	  font-size: 11px;
	}
	.title-right2{
	  font-size: 13px;
	  text-align: right;
	  color: #ffffff;
	  padding-bottom: 8px;
	}
	/*1.9.4样式二修改*/
	.pr-nav {
	  padding-right: 300px;
	}
</style>
