<template>
	<view style="padding: 50px 0px;">
		<view style="font-size: 20px; font-weight: 600; text-align: center;">阿拉伯数字显示农历年月日</view>
		<view class="btn" @click="showDateDialog(1, 'number')">显示日历(年月日  阳历/农历)</view>
		<view class="btn" @click="showDateDialog(2, 'number')">显示日历(年月日时辰  阳历/农历)</view>
		<view class="btn" @click="showDateDialog(3, 'number')">显示日历(年月日时辰分钟  阳历/农历)</view>
		<view style="font-size: 20px; font-weight: 600; text-align: center;">汉字显示农历年月日</view>
		<view class="btn" @click="showDateDialog(1, 'words')">显示日历(年月日  阳历/农历)</view>
		<view class="btn" @click="showDateDialog(2, 'words')">显示日历(年月日时辰  阳历/农历)</view>
		<view class="btn" @click="showDateDialog(3, 'words')">显示日历(年月日时辰分钟  阳历/农历)</view>
		
		<zan-calendar 
			:date="date" 
			:time="time" 
			:isHourShow="isHourShow" 
			:isMinShow="isMinShow" 
			:show="dateDialog" 
			:lunarType = "lunarType"
			@closeDialog="closeDialog" 
			@confirmDialog="confirmDialog"
		>
		</zan-calendar>
	</view>
</template>

<script>
	import zanCalendar from '@/components/quick-calendar/calendar';
	export default {
		data() {
			return {
				date: '2019-01-22',//日期
				time: '13-26',//时间
				isHourShow: false,//是否显示时辰（小时）
				isMinShow: false,//是否显示分钟
				
				lunarType: 'number', //年月日显示方式
				
				dateDialog: false //是否弹出日历组件
			}
		},
		//注册主键（参考vue文档）
		components:{
			zanCalendar
		},
		//操作方法（参考vue文档）
		methods: {
			//示例，展示三种不同的选择调度
			showDateDialog: function(type, lunarType) {
				switch(type){
					case 1:
						this.isHourShow = false;
						this.isMinShow = false;
					break;
					case 2:
						this.isHourShow = true;
						this.isMinShow = false;
					break;
					case 3:
						this.isHourShow = true;
						this.isMinShow = true;
					break;
				}

				this.dateDialog = true;
				this.lunarType = lunarType;
			},
			//示例，在为确认是就点击了取消，直接关闭弹窗
			closeDialog: function() {
				this.dateDialog = false;
			},
			//示例，点击了确认后的相关操作，并再次点击确认时间后的返回，这里可以写自己的操作了
			confirmDialog: function(e) {
				console.log(e);
				alert("选择的日期是：" + e.date);
				alert("选择的时间是：" + e.time);
			}
		}
	}
</script>

<style>
.btn{font-size: 14px; text-align: center; line-height: 40px;}
</style>
