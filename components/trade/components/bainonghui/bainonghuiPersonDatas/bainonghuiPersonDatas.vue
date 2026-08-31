<template>
	<view class="showdata-box" :style="'padding: '+(datas.content.padding_top==undefined?datas.content.padding:datas.content.padding_top)+'px '+(datas.content.style==1?0:10)+'px '+(datas.content.padding_bottom==undefined?datas.content.padding:datas.content.padding_bottom)+'px;'">
		<view class= "showdata-wrap" :style="'background-color:'+(datas.content.bg_color)+';'+'border-radius:' + (datas.content.style==1?0:10)+'px;'">
		  <block v-for="(item,index) in datas.content.dataset" >
			<!--每行显示3个或4个-->
			<view class='showdata-item' v-if="index < list.length" :style="'width:calc(1/'+list.length+'*100%)'">
				<view  @click="goDetail(item.page_url_h5)" >
				  <text :style="'color:'+item.color1" class='data-num'>{{item.value}}</text>
				  <text :style="'color:'+item.color">{{item.name}}</text>
				</view>
			</view>
		  </block>
		</view>
	</view>
</template>

<script>
	export default {
		name: "bainonghuiPersonIdentity",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				list: [],
			};
		},
		created() {
			const that = this;
			this.http_host = this.vuex_apiUrl
			this.bainonghui_getdata();
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			//获取数据
			bainonghui_getdata() {
				let that = this;
				for (const key in that.datas.content.dataset) {
				  var list=[];
				  for(var key2 in that.datas.content.dataset ){
					if(that.datas.content.dataset[key2].is_show=='1') {
					  list.push(key2);
					}
				  }
				}
				that.list = list;
				that.$common.requestData({
					url: "/bainonghui/web/index.php?m=details&a=get_user_diy_assets&customer_id=" + that.vuex_customer_id,
					data: {sel_list:list}, 
					method: "POST", 
					needToken: true,
				}).then(result => {
					if(result.errcode==0 && result.data.length>0){
					  that.datas.content.dataset = result.data
					}
				})
			},
			//h5跳转
			goDetail: function (page_url) {
				this.$common.diyLinkJump(page_url,"h5",true);
			}
		},
		
	}
	
</script>

<style>
	.showdata-box{
		width: 100%;
		padding-left: 10px;
		padding-right: 10px;
		box-sizing: border-box;
		overflow-x: hidden;
	}
	.showdata-box navigator{display: block;width: 100%;height: auto;text-align: center}
	.showdata-wrap{
	  width: 100%;
	  display: flex;
	  background: #fff;
	  /* border-radius: 16px; */
	  padding: 15px 0;
	}
	.showdata-wrap .showdata-item {margin: 20rpx 0;flex: 1;position: relative}
	.showdata-wrap image{width: 100rpx;height:100rpx}
	.showdata-wrap text{
	  line-height: 24px;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: block;text-align: center;font-size: 13px;color: #5d5d5d;max-width: 97%}
	.showdata-wrap text.data-num{
	    font-size: 16px;
	    line-height: 54rpx;
	    height: 54rpx;
	    width: 100%;
	}
	.title {
	    width: calc(100% - 38px);
	    float: left;
	    line-height: 28px;
	    color: #333;
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
		margin-left:20rpx;
		font-size:28rpx;
	}
	.data-num {
	    padding-right: 15px;
	    line-height: 28px;
	    font-size: 15px;
	}
</style>