<!-- 首页 -->
<template>
	<view :style="'background-color:'+bgcolor">
		<!-- 然后循环获取当前组件应该去哪个应用里面找 -->
		<block v-for="(item,index) in module_list">
		    <basePersonal :datas="item" :indexs="index" ref="basePersonal" ></basePersonal>
			<tradePersonal :datas="item" :indexs="index" v-if="userInfo.user_id>0" ></tradePersonal>
		</block>
		<pagecom :datas="template_data"></pagecom>
		<!-- #ifdef APP-PLUS -->
		<view @tap="$gor('/pages/im/conversations')" style="position:fixed;right:30rpx;bottom:160rpx;z-index:90;background:#2878ff;color:#fff;padding:22rpx 32rpx;border-radius:48rpx;">消息
			<text v-if="vuex_imUnread > 0" style="position:absolute;right:-8rpx;top:-12rpx;background:#f04452;color:#fff;border-radius:24rpx;min-width:36rpx;padding:4rpx 8rpx;font-size:22rpx;text-align:center;">{{vuex_imUnread > 99 ? '99+' : vuex_imUnread}}</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import basePersonal from '@/components/base/basePersonal.vue'
	import tradePersonal from '@/components/trade/tradePersonal.vue'	
	import pagecom from '@/components/pagecom/pagecom.vue'	

	export default {
		components: {
			basePersonal,
			tradePersonal,
			pagecom
		},
		data() {
			return {
				module_list:'',
				bgcolor:'#FFF',
				template_data: { has_bottom: true },//底部导航数据,
				userInfo:{},
				is_safe_email: 0,
			}
		},
		onLoad(){
			this.userInfo = this.vuex_user;
			this.templateCombinationSelect();
		},
		onShow(){
			//监听页面，传输事件给子组件
			uni.$emit('onShow');
			this.getSafeEmailStatus();
		},
		onPageScroll(e) {
			// 重点，用到滑动切换必须加上
			// console.log(this.$refs.basePersonal) 
			if(this.module_list[0].type=='base20'){
				this.$refs.basePersonal[0].$refs.userInfo.$refs.navbar.pageScroll(e);
			}else if(this.module_list[0].type=='trade_person_1'){
				this.$refs.basePersonal[0].$refs.immersionUserinfo.$refs.navbar.pageScroll(e);
			}
		},
		methods: {
			templateCombinationSelect(){
				var _this = this;
				var module_personal_center = "";
				if (_this.$cache.get('module_personal_center')) {
					console.log('个人中心自定义模板读取缓存')
					module_personal_center = _this.$cache.get('module_personal_center')
					var lists = module_personal_center.lists
					uni.setNavigationBarTitle({
						title: '个人中心'
					})
					_this.module_list = lists
					_this.bgcolor = module_personal_center.bgcolor
					
				}else{
					this.$api.getPersonalCenterDiyTemplate({app_examine:_this.$config.appExamine}).then(res=>{
						//console.log(res)
						if (res.errcode == 0){
							var lists = res.data.lists
							//console.log(lists)
							_this.$cache.set('module_personal_center', res.data)
							uni.setNavigationBarTitle({
								title: '个人中心'
							})
							_this.module_list = lists
							_this.bgcolor = res.data.bgcolor
						}else{
							console.log('个人中心自定义模板报错：', data.errmsg)
						}
					})
				}
			},
			async getSafeEmailStatus() {
			    try {
			        if (this.userInfo.user_id == 0) {
			            this.setEmailStatus('0', null);
			            return;
			        }
			
			        // 并行获取两个API数据
			        const [baseSetRes, emailRes] = await Promise.all([
			            this.$api.getCustomerBaseSet({}),
			            // this.$api.get_user_email({})
			        ]);
			
			        this.is_safe_email = baseSetRes.data.customer_share_info.is_safe_email;
			        this.email = emailRes;
			
			        console.log('获取到的数据:', {
			            is_safe_email: this.is_safe_email,
			            email: this.email,
			            userInfo: this.userInfo
			        });
			
			        this.setEmailStatus(this.is_safe_email, this.email);
			    } catch (error) {
			        console.error('获取安全邮箱状态失败:', error);
			        this.setEmailStatus('0', null);
			    }
			},
						
			      setEmailStatus(safeStatus, email) {
						if (this.userInfo.user_id ==0) {
							console.log('邮箱状态检查:', {
							    is_safe_email: safeStatus,
							    user_email: this.email
							});
							return;
							}
			          console.log('邮箱状态检查:', {
			              is_safe_email: safeStatus,
			              user_email: this.email
			          });
			          this.checkAndRedirect();
			      },
						
			      checkAndRedirect() {
			          const shouldRedirect = this.is_safe_email == '1' && 
			              (this.email == null || 
			               this.email == '' || 
			               this.email == 'null' ||
			               this.email == undefined);
			          
			          if (shouldRedirect) {
			              setTimeout(() => {
			                  uni.navigateTo({
			                      url: '/public/pages/user/bind_email',
			                      success: () => {
			                          console.log('成功跳转到绑定邮箱页面');
			                      },
			                      fail: (err) => {
			                          console.error('跳转失败:', err);
			                      }
			                  });
			              }, 500);
			          }else{
						  console.log('条件不满足，不跳转');
					  }
			      }
			  }
		}
</script>

<style>

</style>
