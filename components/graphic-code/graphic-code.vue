<template><view>
	<view v-if="datas.tuxingyan_show" class="yzm_body" @mousemove="touchmove" @mouseup="touchend">
		<view class="zhuti">
			<view :class="['msg', msgText==='验证成功' ? 'green' : (['安全验证', '验证中...'].indexOf(msgText)>-1 ? '' : 'red')]">{{msgText}}</view>
			<view class="title">拖动下方滑块完成拼图</view>
			<view class="movable-area">
				<view id="msg" v-if="zhutuPic === ''">{{msgLoadMsg}}</view>
				<view id="pic" v-else :style="{background: 'url(' + zhutuPic + ') no-repeat 100%/100%'}"></view>
				<view id="line"></view>
				<view :class="['movable-view', {doudong: futu_doudongClass}]" :style="{background: 'url(' + futuPic + ') no-repeat top left/100% 338rpx', left: futu_x+'px', transitionDuration: futu_x===10 ? '300ms' : '0ms'}" 
				@touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @mousedown="touchstart"></view>
			</view>
			<view class="close iconfont iconguanbi" @click="datas.show = false"></view>
		</view>
	</view>
</view></template>
<script>
import config from '../../uni_modules/uview-ui/libs/config/config';

export default{
	emits: ['success'],
	props:{
		datas:	{type: Object, default:{}}
	},
	data(){return{
		zhutuPic: '',//主图
		//缺口图
			futuPic:				'',
			futu_x:					10,			//默认的位置
			futu_anxiaX:			undefined,	//按下时，手指的位置
			futu_doudongClass:		false,
		//提示信息
			msgText: '安全验证',
			msgLoadMsg: '加载中',
			http_host:''
	}},
	onLoad() {
		this.http_host = this.vuex_apiUrl;
	},
	mounted(){},//该组件被挂载到实例上去之后调用
	methods: {
		shuaxin(){
			var that = this;
			this.$common.requestData({
				url: '/uniapp_template/web/index.php?m=app_login&a=create_graphic_pic',
				data: {
					type:		'shengcheng',
					class:		that.datas.tuxingyan_class,
					phone: that.datas.phone
				},
				method: 'POST',
			}).then(res => {
				if (res.errcode === 0) {
					var url = 	that.vuex_apiUrl + '/uniapp_template/web/index.php?m=app_login&a=create_graphic_pic&class='+that.datas.tuxingyan_class+'&key='+res.data+'&time='+(new Date()*1);//time参数作用是 避免触发缓存
					that.futuPic	= url+'&type=futu'
					that.zhutuPic	= url+'&type=zhutu'
					that.datas.key = res.data;
				}
			}).catch(ret => {
				//错误处理
					uni.showToast({
						title:ret
					},500)
			})
		},
		upx2px(num, htmlWidth=getApp().$htmlWidth){//弃用uni.upx2px，该方法在页面宽度发生变化时，并不会更正
			return Math.round((htmlWidth > 750 ? 750 : htmlWidth) / (750 / num))//rpx对应的px = 当前页面的宽度 / 比例（什么比例我描述不出来）
		},
		touchstart(event){//手指按下
			if(this.futu_anxiaX === undefined && this.futu_x === this.$options.data().futu_x){
				this.futu_anxiaX = this.$isPc ? event.clientX : event.touches[0].clientX;
			}
		},
		touchmove(event){//手指移动
			if(this.futu_anxiaX !== undefined){
				var x = this.$options.data().futu_x + ((this.$isPc ? event.clientX : event.touches[0].clientX) - this.futu_anxiaX),
					[min, max] = [0, this.upx2px(600 - 79)]//确保不会超出边界【600是父元素的宽度、79是自身元素的宽度】
				this.futu_x = x < min ? min : (x > max ? max : x)
			}
		},
		touchend(event){//手指离开
		var that = this;
			if(this.futu_anxiaX !== undefined){
				this.futu_anxiaX = undefined
				if(this.zhutuPic === ''){
					this.futu_x = this.$options.data().futu_x
				}else{
					this.msgText = '验证中...'
					var url = '';
					if(this.datas.tuxingyan_class == 'login' || this.datas.tuxingyan_class == 'forget_password'){
						url = 'uniapp_template/web/index.php?m=app_login&a=get_phone_code';
					}else if(this.datas.tuxingyan_class == 'regist' ){
						url = 'uniapp_template/web/index.php?m=app_login&a=register_get_phone_code';
					}else if(this.datas.tuxingyan_class == 'forget_pay'){
						url = '/wsy_user/web/index.php?m=set&a=send_code';
					}else{
						url = ''; 
					}
					
					if(url != ''){
						var ajax_datas = this.datas;
						ajax_datas['x'] = parseInt(that.futu_x * (679 / that.upx2px(600)));
						this.$common.requestData({
							url: url,
							data: ajax_datas,
							method: 'POST',
							needToken: this.datas.tuxingyan_class == 'forget_pay',
						}).then(res => {
							if(res.errcode === 0){
								that.$emit('txyzSuccess')
								that.msgText = '验证成功'
								uni.showToast({
									icon:'none',
									title:res.errmsg
								},2000)
								
								setTimeout(function () {
									that.datas.tuxingyan_show = false
								}, 2000);
							
							}else{
								that.futu_doudongClass = true//执行抖动的css动画
								that.msgText = res.errmsg
								
								setTimeout(function () {
									that.futu_doudongClass = false
									//回到默认的位置
									that.futu_x = that.$options.data().futu_x
									that.msgText = '安全验证'
									//重载
									if(res.errcode === 40002){
										that.shuaxin()
									}
									
									if(res.errcode === 407){
										that.datas.tuxingyan_show = false;
									}
								}, 2000);
								
							}
						}).catch(ret => {
							//错误处理
								var errMsg = that.requestError(ret);
								if(typeof(errMsg.msg) === 'string'){
									that.msgText = errMsg.msg
									//启动抖动动画
										that.futu_doudongClass = true//执行抖动的css动画
									//等待抖动结束
										setTimeout(() => {
											//停止抖动
												that.futu_doudongClass = false
											//回到默认的位置
												that.futu_x = that.$options.data().futu_x
											//重载
												if(errMsg.code === 2){
													if(typeof(ret.data.error_cishu) === 'undefined' || ret.data.error_cishu === 0){//等于空意味着滑块验证码不存在，也是需要刷新的
														that.shuaxin()
													}
												}
										}, 700);
									//恢复原状
										setTimeout(() => {
											that.msgText = '安全验证'
										}, 3500);
								}
						})
					}
				}
			}
		},
		requestError(res, isShowNoNetTip=false){//链接外部请求时，处理加载失败【只根据app端做处理，H5端返回信息不详细】【3种错误类型】
							if(res.errMsg === 'request:ok'){//加载成功了
								//从返回内容去判断【res.data】
									if(typeof(res.data) === 'object'){
										if(res.data.code === 2){//【逻辑问题(无登录等)】
											return {code: 2,msg: res.data.msg}
										}
									}else{//返回内容是json格式的，所以data肯定是对象类型。不是的话，只能说明服务器出错了
										return {code: 1,msg: '服务器出错'}
									}
								//从加载状态判断
									if(res.statusCode !== 200){//【服务器出错】
										return {code: 1,msg: '服务器出错'}
									}
							}else{//加载不成功【客户端加载出错】【statusCode在这里为undefined】
								//#ifdef APP-PLUS
									if(this.$store.state.internetIsLink === false){
										if(isShowNoNetTip === false){
											return {code: 0, msg: '当前设备断网了，请检查网络后重试'}
										}
									}else{
										return {code: 0, msg: res.errMsg==='request:fail abort statusCode:-1 timeout' ? '连接服务器超时' : '连接服务器失败'}
									}
								//#endif
								//#ifdef H5
									return {code: 0,msg: '连接服务器失败'}
								//#endif
							}return {}
						},
	},
	watch: {
		'datas.tuxingyan_show'(newValue){
			if(newValue === true){
				//设置为初始值
					Object.assign(this, this.$options.data());
				this.shuaxin()
			}
		}
	}
}
</script>
<style lang="scss">
.yzm_body * { box-sizing: content-box; }
.yzm_body{
	display: flex;
	background: rgba(0,0,0,0.3);
	position: fixed;
	top: 0;
	z-index: 1001;
	width: 750rpx;
	height: 100vh;
	justify-content: center;
	align-items: center;
	.zhuti{
		position: relative;
		flex-direction: column;
		background: #FFF;
		width: 600rpx;
		padding: 20rpx 25rpx 30rpx 25rpx;
		border-radius: 15rpx;
		.msg{
			color: #999;
			font-size: 24rpx;
			&.red{color: red;}
			&.green{color: green;}
		}
		.close{
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			color: #A6A6A6;
			font-size: 36rpx;
			padding: 10rpx;
		}
		.title{
			font-size: 28rpx;
			line-height: 38rpx;
			color: #333;
			margin: 0 0 7rpx 0;
		}
		.movable-area{
			position: relative;
			width: 100%;
			height: 415rpx;
			flex-direction: column;
			#msg{
				width: 100%;
				line-height: 338rpx;
				justify-content: center;
				font-size: 30rpx;
				color: #999;
				background: #F8F8F8;
			}
			#pic{
				width: 600rpx;
				height: 338rpx;
			}
			#line{
				background: #e4e4e4;
				height: 20rpx;
				margin: 42rpx 0 15rpx 0;
				border-radius: 50rpx;
			}
			.movable-view{
				position: absolute;
				top: 0;left: 0;
				width: 79.63rpx;
				height: 100%;
				&:after{
					position: absolute;
					bottom: 0;left: 0;
					content: '';
					box-shadow: rgba(26, 101, 255, 0.52) 0 0 10rpx 1rpx;
					width: 100rpx;
					height: 50rpx;
					border-radius: 50rpx;
					background: rgb(26, 101, 255) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAcAgMAAABuexVFAAAACVBMVEUAAADCwsL9/f1P0DqbAAAAAXRSTlMAQObYZgAAAB1JREFUGNNjCGVgYGANABKhyMwoEHMBkIgaZWIwAdyJJQnaJRg5AAAAAElFTkSuQmCC) no-repeat 50% 50%/auto 20rpx;
					margin-left: -10rpx;
				}
				@keyframes doudong{
					20%{transform: translateX(-15px);}
					40%{transform: translateX(15px);}
					60%{transform: translateX(-15px);}
					80%{transform: translateX(15px);}
					100%{transform:translateX(0);}
				}
				&.doudong{
					animation: doudong 500ms linear 1;
				}
			}
		}
	}
}
</style>