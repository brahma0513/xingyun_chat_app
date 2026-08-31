<template>
	<!--短视频 数据显示start-->
	<view :style="'padding: '+(datas.content.padding_top==undefined?datas.content.padding:datas.content.padding_top)+'px '+(datas.content.style==1?0:10)+'px '+(datas.content.padding_bottom==undefined?datas.content.padding:datas.content.padding_bottom)+'px;'">
	    <view class="custom-order" style="padding: unset;">
	        <view class="type1" :style="'border-radius: '+(datas.content.style==1?0:10)+'px;'">
	            <view class="title">
	                <view class="name">{{datas.content.li_title}}</view>
	            </view>
	        
	            <view class="custom-data">
	                <view class="data-list" style="padding-top:5px;">
	                    <view class="li" v-for="(items,indexs) in datas.content.dataset" v-if="items.isCheck">
	                        <view @click="$common.diyLinkJump(items.link)">
								<view class="num" :style="'color:'+items.color1">{{items.num}}</view>
								<view class="name" :style="'color:'+items.color">{{items.title}}</view>
	                        </view>
	                    </view>
	                </view>
	            </view>
	        </view>
	    </view>    
	</view>
	<!--短视频 数据显示end-->
</template>

<script>
	export default {
		name:"svodStatic",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				user_info: {},
			};
		},
		created() {
			this.http_host = this.vuex_apiUrl;
			this.user_info = this.vuex_user;
			this.svod_getdata();
		},
		methods: {
			svod_getdata() {
			    let _this = this;
				_this.$common.requestData({
					url: '/svod/api/index.php?m=video&a=video_user', 
					data: {
						video_user: _this.user_info.user_id,
					}, 
					method: "POST", 
					needToken: true,
					needLoading: false,
					showError: false,
				}).then(res => {
					if(res.errcode==0){
					    _this.datas.content.dataset.forEach(function(itm){
							if(itm.selector_id == 0){
								itm.num = res.data.svodDetail.video_count;
								itm.link = "/svod/web/index.php?m=video&a=my_creation&customer_id=" + _this.vuex_customer_id + "&video_user=" + _this.user_info.user_id;
							}else if(itm.selector_id == 1){
								itm.num = res.data.svodDetail.like_count;
								itm.link = "/svod/web/index.php?m=video&a=my_favorite&customer_id=" + _this.vuex_customer_id + "&video_user=" + _this.user_info.user_id;
							}else if(itm.selector_id == 2){
								itm.num = res.data.svodDetail.follow_count;
								itm.link = "/svod/web/index.php?m=video&a=my_focus&customer_id=" + _this.vuex_customer_id + "&video_user=" + _this.user_info.user_id + "&type=0";
							}else{
								itm.num = res.data.svodDetail.fans_count;
								itm.link = "/svod/web/index.php?m=video&a=my_focus&customer_id=" + _this.vuex_customer_id + "&video_user=" + _this.user_info.user_id + "&type=1";
							}
						})
					}
				})
				
			    
			}		
					
			
		}
	}
</script>

<style>
.custom-order .type1 {
    background-color: #FFF;
    border-radius: 8px;
    padding: 0 15px;
}
.custom-order .type1 .title {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 10px 0;
    font-size: 15px;
    color: #333;
    line-height: 25px;
}
.custom-order .type1 .title .name {
    -webkit-box-flex: auto;
    -webkit-flex: auto;
    flex: auto;
    width: 50%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;
}
.custom-data {
    /* padding: 0 10px; */
}
.custom-data .data-list {
    background-color: #FFF;
    /* border-radius: 8px; */
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 15px 0;
}
.custom-data .data-list .li {
    -webkit-box-flex: auto;
    -webkit-flex: auto;
    flex: auto;
    width: 20%;
    text-align: center;
    padding: 0 5px;
}
.custom-data .data-list .num {
    font-size: 16px;
    line-height: 26px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.custom-data .data-list .name {
    font-size: 13px;
    line-height: 24px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
