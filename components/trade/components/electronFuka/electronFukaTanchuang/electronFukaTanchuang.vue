<template>
	<view class="electron_fuka_content_box" v-if="isShow == true">
		<view class="electron_fuka_content_main" :style="styleBg">
			<view class="electron_fuka_quxiao" @click="closeQuxiao">
				<image class="electron_fuka_quxiao_img" :src="this.vuex_apiUrl+'/electron_fuka/admin/static/images/quxiao.png'"
					alt="" />
			</view>
			<view class="electron_fuka_content_main_box">
				<view class="electron_fuka_content_main_title_one">输入邀请ID</view>
				<view class="electron_fuka_content_main_title_two">免费领<text
						class="electron_fuka_content_main_title_two_title">{{redNum}}</text>福袋</view>
			</view>
			<view class="electron_fuka_content_main_box_bottom_top">
				<view class="electron_fuka_content_main_box_bottom">
					<input placeholder-class="placeholderClass" v-model="redValue" type="text"
						class="electron_fuka_content_main_input_in" placeholder="请输入邀请ID" />
					<view class="electron_fuka_content_main_btn" @click="lijilingqu">
						立即领取
					</view>
				</view>
				<view class="electron_fuka_content_main_box_bottom_box"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "electronFukaTanchuang",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				http_host: this.vuex_apiUrl, //域名
				styleBg: `background-image: url('${this.vuex_apiUrl}/electron_fuka/admin/static/images/backg.jpg');background-position: center center;background-repeat: no-repeat;background-size: 100% 100%;`,
				currentIndex: 0,
				timer: null,
				translateYValue: 0,
				carouselStyle: '', // 动态计算的样式字符串 
				isShow: true,
				redValue: undefined,
				redNum: 50,
			}
		},
		created() {
			this.get_popup();
			this.http_host = this.vuex_apiUrl;
			this.styleBg = `background-image: url('${this.http_host}/electron_fuka/admin/static/images/backg.jpg');background-position: center center;background-repeat: no-repeat;background-size: 100% 100%;`;
			console.log(this.http_host)
		},
		methods: {
			get_popup() {
				var that = this;
				this.$common.requestData({
					url: "/electron_fuka/web/index.php?m=user_info&a=is_newbie",
					data: {},
					method: "POST",
					needToken: true
				}).then(res => {
					console.log(res);
					if (res.data.status == 1) {
						that.isShow = true;
						that.redNum = res.data.packet_num
					}
					console.log(this.tips,'tips')
				});
			},
			closeQuxiao() {
				console.log('打印', this.isShow);
				this.isShow = false;
			},
			lijilingqu(e) {
				var that = this;
				console.log("立即领取", this.redValue);
				if (this.redValue) {
					this.$common.requestData({
						url: "/electron_fuka/web/index.php?m=user_info&a=receive_inviter",
						data: {
							parent_code: that.redValue,
						},
						method: "POST",
					}).then(res => {
						console.log(res, '这是啥');
						uni.showToast({
							title: res.errmsg,
							icon: 'none'
						})
						that.isShow = false
					});

				} else {
					uni.showToast({
						title: '请输入邀请工号',
						icon: 'none'
					})
				}
			},
		}
	}
</script>

<style>
	.electron_fuka_content_box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding: 53px;
		z-index: 99999;
	}

	.electron_fuka_content_main {
		position: relative;
		width: 270px;
		height: 265px;
		border-radius: 0 80px 0 0;
		/* background-image: url("/electron_fuka/admin/static/images/backg.jpg"); */
		background-size: cover;
		background-position: center center;
	}

	.electron_fuka_content_main_box {
		padding: 20px 0 5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.electron_fuka_content_main_title_one {
		color: #fff;
		font-size: 18px;
	}

	.electron_fuka_content_main_title_two {
		font-size: 32px;
		color: #fff;
	}

	.electron_fuka_quxiao {
		position: absolute;
		top: -25px;
		right: -10px;
		width: 34px;
		height: 34px;
	}

	.electron_fuka_quxiao_img {
		width: 100%;
		height: 100%;
	}

	.electron_fuka_content_main_title_two_title {
		color: #fee08d;
		font-weight: bold;
		font-size: 36px;
	}

	.electron_fuka_content_main_input {
		width: 80%;
	}

	.electron_fuka_content_main_input_in {
		padding: 0 !important;
		text-align: center;
		height: 40px;
		width: 80%;
		border-radius: 10px !important;
		border: 1px solid red !important;
		background-color: transparent !important;
		color: red !important;
		font-size: 18px !important;
	}

	.electron_fuka_content_main_input_in::placeholder {
		color: red;
		font-size: 14px;
	}

	.placeholderClass {
		color: red;
		font-size: 14px;
	}

	input {
		outline: none;
	}

	.electron_fuka_content_main_btn {
		width: 80%;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(93deg, #f04c0d 25%, #f25d19 52%, #fb7329 100%);
		border-radius: 10px;
		color: #fff;
		margin-top: 15px;
	}

	.electron_fuka_content_main_box_bottom {
		padding: 10px 0 15px;
		background-color: #fdf0e5;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 10px 10px 0 0;
	}

	.electron_fuka_content_main_box_bottom_box {
		background: linear-gradient(93deg, #ad080f 25%, #cf1721 52%, #b80812 100%);
		padding: 16px;
		border-radius: 0 0 10px 10px;
	}

	.electron_fuka_content_main_box_bottom_top {
		padding: 0 20px;
	}
</style>