<template>
	<view class="countdown"
		:style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px 0 '+(datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px'">
		<view class="custom-countdown" :style="'background:'+(datas.content.bg_type != 1?'url('+bg_image+')':none)+';background-color:'+(datas.content.bg_type == 1?datas.content.bg_color:'')+';'">
			<view class="countdown-box" :class="(datas.content.css_type == 1 ?'countdown-style-1':'countdown-style-2')"
				:style="'color:'+datas.content.font_color+';'">
				<text  class="text" v-if="isEnd">已结束</text >
				<view v-if="!isEnd">
					<text  class="text">{{text}}</text >
					<text  class="num" v-if="datas.content.data_count">{{timelist[0]}}</text >
					<text  class="text" v-if="datas.content.data_count">天</text >
					<text  class="num">{{timelist[1]}}</text >
					<text  class="text">时</text >
					<text  class="num">{{timelist[2]}}</text >
					<text  class="text">分</text >
					<text  class="num">{{timelist[3]}}</text >
					<text  class="text">秒</text >
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "countdown",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				start: '', // 开始时间
				end: '', // 结束时间
				timelist: [], // 存储时间的数组
				time: '', // 存储时间的数组
				isEnd: false, // 是否结束
				text: '', // 距开始，距结束
				data_count: true, // 是否按天计算,
				http_host: getApp().globalData.http_host,
				bg_image: ''
			};
		},
		created() {
			// 因为解析不到域名，进行图片处理
			var img_url = this.vuex_apiUrl + '/resources/' + this.datas.content.bg_image
			this.start = this.datas.content.start_time.replace(/-/g, "/"), //获取倒计时开始时间
				this.end = this.datas.content.end_time.replace(/-/g, "/"), //获取倒计时结束时间
				this.data_count = this.datas.content.data_count, //是否按天算
				this.bg_image = img_url // 因为解析不到域名，进行图片处理

			this.setTime()

		},
		methods: {
			updateEndTime: function() {
				// 开始时间
				var start_ = new Date(this.start).getTime()
				// 结束时间
				var end_ = new Date(this.end).getTime()
				// 当前时间
				var date = new Date().getTime()
				var lag = ''
				var html = '距结束'

				if (start_ > date) {
					end_ = start_ // 如果开始时间大于当前时间，结束时间等于当前时间
					html = '距开始'
				}
				lag = end_ - date //计算时间差
				if (lag > 0) {
					// this.data.data_count为true按天倒计时，否则按小时计算
					var second = Math.floor(lag / (1000 * 60 * 60 * 24)); //计算天数
					var minite = this.data_count ? Math.floor(lag / (1000 * 60 * 60) % 24) : Math.floor(lag / (
						60 * 60 * 1000)); //计算小时数
					var hour = this.data_count ? Math.floor(lag / (1000 * 60) % 60) : Math.floor((lag - minite *
						60 * 60 * 1000) / (60 * 1000)); //计算分钟数
					var day = this.data_count ? Math.floor(lag / 1000 % 60) : Math.floor((lag - minite * 60 * 60 *
						1000 - hour * 60 * 1000) / 1000); //计算秒
					// 计算是否补0
					second = second < 10 ? "0" + second : second
					minite = minite < 10 ? "0" + minite : minite
					hour = hour < 10 ? "0" + hour : hour
					day = day < 10 ? "0" + day : day
					this.text = html
					
				} else {
					this.isEnd = true
					
				}
				return [second, minite, hour, day]
			},
			// 开启倒计时
			setTime: function() {
				var _this = this
				console.log(_this.datas)
				_this.time = setInterval(() => {
					_this.timelist = _this.updateEndTime()
					// 清空计时器
					if (_this.timelist[0] == "00" && _this.timelist[1] == "00" && _this.timelist[2] == "00" && _this.timelist[3] == "00" && _this.isEnd) {
						clearInterval(_this.time)
					}
				}, 1000);
			}
		}
	}
</script>

<style>
	.custom-countdown {
		padding: 0 15px;
		background-position: center center;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.custom-countdown .countdown-box,
	.countdown-style-1,
	.countdown-style-2 {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 46.5px;
	}

	.custom-countdown .countdown-box .text {
		font-size: 12px;
		line-height: 50px;
	}

	.custom-countdown .countdown-box span {
		display: inline-block;
		vertical-align: middle;
	}

	.countdown-style-1 .num {
		background: red;
		color: #fff;
		padding: 4px 5px;
		border-radius: 5px;
		margin: 3px;

	}

	.countdown-style-2 .num {
		color: red;
		margin: 3px;
	}
</style>
