<template>
	<!--展示数据-->
	<view class='showdata-box' :style="'padding: '+(datas.content.padding_top==undefined?datas.content.padding:datas.content.padding_top)+'px '+(datas.content.style==1?0:10)+'px '+(datas.content.padding_bottom==undefined?datas.content.padding:datas.content.padding_bottom)+'px;'">
		<!--样式一-->
		<block v-if="datas.content.css_type == 1">
		  <view class= "showdata-wrap" :style="'background-color:'+(datas.content.bg_color)+';'+'border-radius:' + (datas.content.style==1?0:10)+'px;'">
			<block v-for="(item,index) in datas.content.dataset" >
				 <!--每行显示3个或4个-->
			  <view class='showdata-item 'v-if="index < datas.content.data_num" :style="'width:calc(1/'+datas.content.dataset.length+'*100%)'">
				<view  @click="goDetail(item.page_url)" >
				  <text :style="'color:'+item.color1" class='data-num'>{{item.money}}</text>
				  <text :style="'color:'+item.color">{{item.title}}</text>
				</view>
			  </view>
			</block>
		  </view>
		</block>
		<!--样式二-->
		<block v-else>
		  <view class= "showdata-wrap2" :style="'background-color:'+(datas.content.bg_color)+';'+'border-radius:'+(datas.content.style==1?0:10)+'px;'">
			<block v-for="(item,index) in datas.content.dataset" >
				<!--每行显示3个或4个-->
			  <view class='showdata-item' :style="datas.content.line_style==1&&indexs!=datas.content.dataset.length-1?'border-bottom:1rpx solid #f0f0f0;':'border-bottom:none;'">
				<view class="flex justify-content-space-between" @click="goDetail(item.page_url)" >
					<view class="flex">
						<image  class='item-image' :src='item.pic'></image>
						<text class="title" :style="'color:'+item.color">{{item.title}}</text>
					</view>
				  <text :style="'color:'+item.color1" class='data-num'>{{item.money}}</text>	
				</view>
			  </view>
			</block>
		  </view>
		</block>
	</view>
</template>

<script>
	export default {
		name: "hyShowData",
		props:{
			datas:{
				type:Object,
				default: {}
			},
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				number: [],
				property: [],
				sign_num:"",
				foot_num:"",
				collect_num:"",
				zeng_num:"",
				score_people:"",
				money_mode_key:"",
				coupon_num:"", // 优惠券数量
			};
		},
		created() {
			var _this = this;
			_this.get_page_url()
		},
		methods: {			
			get_page_url(){
				var _this = this;
				for (const key in _this.datas.content.dataset) {
					if(_this.datas.content.dataset[key].link){
						_this.$common.requestData({
							url: _this.datas.content.dataset[key].link,
							data: {
							}, 
							method: "POST", 
							needToken: true
							}).then(res => {
							if (res.errcode == 0) {
								let data = _this.datas
								//跳转链接
								if (!res.data.page_url) {
									res.data.page_url = "javascript:void(0)"
								}
								data.content.dataset[key].money = res.data.money
								data.content.dataset[key].page_url = res.data.page_url
								_this.datas = data
							}
						});
				  }
				}
			},
			
			//h5跳转
			goDetail: function (page_url) {
				this.$common.diyLinkJump(page_url,"h5",true);
			}
			
		}
	}
	
</script>

<style>
	/* components/mini_shop/components/hy_showData/hy_showData.wxss */
	.no-hover{
	  background-color: transparent
	}
	/* 11/1 */
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
	.showdata-wrap2{
	    background-color: #FFF;
	    /* border-radius: 8px; */
	    padding-left: 13.5px;
	  }
	.showdata-wrap2 .showdata-item{
	    display: block;
		padding: 13.5px 30px 13.5px 15px;
		overflow: hidden;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
		background-size: auto 14px;
		background-repeat: no-repeat;
		background-position: right 15px center;
	  padding-left: 0;
	  }
	.showdata-wrap2 .showdata-item navigator{width: 100%;height: 100%;text-align: left;position: relative;}
	.showdata-wrap2 .showdata-item navigator image{
	    width: 28px;
	    height: 28px;
	    
	    margin-right: 10px;
	    display:inline-block;
	    vertical-align: middle;
	
	  }
	.showdata-wrap2 .showdata-item navigator text{display: inline-block;width: calc(100% - 90rpx);vertical-align: middle}
	.showdata-wrap2 .funtion-jt{width: 18rpx;height: 18rpx;border-top: 1px solid #ccc;border-right: 1px solid #ccc;transform: rotate(45deg);position: absolute;right: 27rpx;top: 16rpx}
	.showdata-wrap2 .showdata-item navigator .data-num{position: absolute;right: 45rpx;font-size: 15px;display: inline-block;width: 200rpx;border: 0;text-align: right;
	
	}
	/*11/1*/
	/*数据显示*/
	.base24_bg {
	  height: 64rpx;
	  /* position: absolute; */
	  /* top: 0px; */
	  width: 100%;
	  z-index: -1;
	  overflow: hidden;
	  background-repeat: no-repeat;
	  background-size: 100%;
	}
	
	.base24_bg image {
	  width: 100%;
	  /*height: 100%;*/
	}
	
	.item-image{
		width: 28px;
		height: 28px;
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
	/*11/1end*/
</style>
