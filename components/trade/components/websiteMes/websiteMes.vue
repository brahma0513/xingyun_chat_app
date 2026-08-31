<template>
	<view class='container' :style="'padding:'+datas.content.padding+'px 0'">
	  <!--风格一start-->
	  <view class='message_style_one' v-if="datas.content.css_type==1">
	    <view class="style_one_box">
	      <block v-for="(item,index) in dataset">
	        <view class="row">
	          <view class="left title">{{item.message_title}}：</view>
	          <view class="left input_box">
	            <input type="text" class="nickname" :placeholder="'请输入'+item.message_title_place" :data-index="index" :value='item.value' @input="listen_input" placeholder-class='place_color' />
	          </view>
	          <view class="clear"></view>
	        </view>
	      </block>
	    </view>
	    <view class="save_bnt disabel_bnt" v-if="flag">提交</view>
	    <view class="save_bnt" @click='save' v-else>提交</view>
	  </view>
	  <!--风格一end-->
	
	  <!--风格二start-->
	  <view class="message_style_two" v-if="datas.content.css_type==2">
	    <view class="style_two_box">
	      <block v-for="(item,index) in dataset">
	        <view>
	          <view class="row_two title_two gray_back_two">{{item.message_title}}</view>
	          <view class="row_two input_box_two white_back">
	            <input type="text" :data-index="index" class="nickname" :placeholder="'请输入'+item.message_title_place" @input="listen_input" placeholder-class='place_color'/>
	          </view>
	        </view>
	      </block>
	    </view>
	    <view class="save_bnt disabel_bnt" v-if="flag">提交</view>
	    <view class="save_bnt" bindtap='save' v-else>提交</view>
	  </view>
	  <!--风格二end-->
	
	</view>
</template>

<script>
	export default {
		name:"websiteMes",
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
				list: [],
				dataset: [],
				flag:true,
				status: false, //是否可点击。（发送按钮不能重复点）
			};
		},
		created() {
			this.http_host = this.vuex_apiUrl;
			this.dataset = this.datas.content.dataset
			this.init_title();
		},
		methods: {
			save() {  
				const that = this;
				if (that.status) {
					return;
				}
				that.status = true;
			  
				var data_con = that.datas.content.dataset;
				var content = '';
				var submit = true;
				var emoji_bool = false;
				for (var i in data_con) {
					var _arr = data_con[i];
					if (_arr['value'] == "") {
						submit = false; //不能提交
					}else{
						emoji_bool = this.isEmojiCharacter(_arr['value']); //包含表情字符不可提交
						if(emoji_bool){
							break;
						}
					}
					content += _arr['message_title'] + ':' + _arr['value'] + ';';
				}
				content.substr(0, content.length - 1);
				if (!submit) {
					uni.showToast({
					  title: '请输入留言信息',
					  icon: 'none',
					  duration: 1000,
					});
					that.status = false;
					return false;
				}else if(emoji_bool){
					uni.showModal({
					  title: "提示",
					  content: '留言信息不能包含表情字符',
					  showCancel: false,
					  success: function (res) {}
					})
					that.status = false;
					return false;
				}
				
				that.$common.requestData({
				  	url: '/website/web/index.php?m=website_index&a=save_mess',
				  	data: {
						mess: content
					}, 
				  	method: "POST", 
				  	needToken: false,
				}).then(res => {
				  	if (res.errcode == 0) {
				  		uni.showToast({
				  		  title: '留言成功',
				  		  icon: 'success',
				  		  duration: 1000,
				  		});
				  		//清空留言信息
				  		var input_val = that.dataset;
				  		for (var i = 0; i < input_val.length;i++){
				  		  input_val[i].value="";
				  		}
				  		that.dataset = input_val,
				  		that.flag = true
				  	}else{
				  		uni.showToast({
				  		  title: res.errmsg,
				  		  icon: 'none',
				  		  duration: 1000,
				  		});
				  		that.status = false;
				  	}
				})
			},
			isEmojiCharacter(substring) {  
				for ( var i = 0; i < substring.length; i++) {  
					var hs = substring.charCodeAt(i);  
					if (0xd800 <= hs && hs <= 0xdbff) {  
						if (substring.length > 1) {  
							var ls = substring.charCodeAt(i + 1);  
							var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
							if (0x1d000 <= uc && uc <= 0x1f77f) {  
								return true;  
							}  
						}  
					} else if (substring.length > 1) {  
						var ls = substring.charCodeAt(i + 1);  
						if (ls == 0x20e3) {  
							return true;  
						}  
					} else {  
						if (0x2100 <= hs && hs <= 0x27ff) { 
							return true;  
						} else if (0x2B05 <= hs && hs <= 0x2b07) { 
							return true;  
						} else if (0x2934 <= hs && hs <= 0x2935) { 
							return true;  
						} else if (0x3297 <= hs && hs <= 0x3299) { 
							return true;  
						} else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
								|| hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
								|| hs == 0x2b50) {  
							return true;  
						}  
					}  
				}
				return false;
			},
			//监听输入是否完成
			listen_input(e) {
				var that = this;
				var val = e.detail.value;
				var index = e.currentTarget.dataset.index;
				that.dataset[index].value = val;
				that.dataset = that.dataset;
				//判断是否有空的值
				var input_arr = that.dataset;
				var num=0;
				for (var i = 0; i < input_arr.length; i++) {
					if (input_arr[i].value==""){
					  num++;
					}
				}
				if(num>0){
					that.flag = true
				}else{
					that.flag = false
				}
		
			},
			//字体间距调整
			init_title(){
				var that = this;
				var data = that.datas.content.dataset;
				for (var i = 0; i < data.length;i++){
					var title=data[i].message_title;
					data[i].message_title_place = title;
					if(title.length==2){
						data[i].message_title = title[0] + "       " + title[1]
					} else if (title.length == 3){
						data[i].message_title = title[0] + "  " + title[1] + "  " + title[2]
					}else{
						data[i].message_title = title;
					}
				}
				that.dataset = data;
			}
		}
	}
</script>

<style>
page, .container {
  background-color: #f5f5f5;
  font-size: 30rpx;
  color: #323232;
}
.title{
  white-space: pre;
}
.left{
  float: left;
}
.clear{
  clear: both;
}
.title {
  width: 25%;
}

.input_box {
  width: 75%;
}

.row {
  border-bottom: 1rpx solid #e4e4e4;
  padding: 28rpx 0;
}

.row:last-child{
  border: none !important;
}

.cloud_message_box input {
  width: 90%;
  border: none;
  color: #5d5d5d;
}

.cloud_message_box input:focus {
  outline: none;
}
.message_style_one{
  position: relative;
}
.message_style_two , .message_style_one{
  padding-bottom: 45rpx;
}
.style_one_box {
  padding: 0 30rpx;
  background-color: white;
  margin-top: 20rpx;
}
.place_color{
  color: #cccccc;
}
.save_bnt {
  text-align: center;
  color: white;
  background-color: #7e8aef;
  width: 90%;
  margin: 8% auto auto;
  border-radius: 50rpx;
  font-size: 34rpx;
  border: none;
  padding: 20rpx 0;
}

/*第二部分start*/

.row_two {
  padding: 28rpx;
}

.gray_back_two {
  background-color: #f5f5f5;
}

.white_back {
  background-color: white;
}

.disabel_bnt {
  background-color: #bac0f2 !important;
  color: #fcfff2 !important;
}

</style>
