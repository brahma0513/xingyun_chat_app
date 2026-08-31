<template>
		<view >
			
	
	<view class='block'></view>
	
	<view class='address_arrt_list'>
	  <block v-for="(item,idx) in conpany" >
	    <view class='address_arrt'>
	      <view class='address_left'>{{item.key}}：</view>
	      <view class='address_right'>{{item.value}}</view>
	    </view>
	  </block>
	  <view class='map_box'>
	    <map id="myMap" :class="'myMap '+(status==0?'':' display_none')" :longitude="longitude" 
		:latitude="latitude" :markers="markers" scale="12"  @click='toMap'></map>
	  </view>
	  <view :class="'map_beijing_box '+status==0?' display_none':''">
	    <view class='map_beijing'></view>
	  </view>
	
	</view>
<!--	//底部和悬浮导航公共组件 -->
<pagecom :datas="template_data"></pagecom>
	</view>
</template>

<script>
	import pagecom from '@/components/pagecom/pagecom.vue';
		export default {
			components: {
				pagecom
			},
	data() { 
			return {
		status: 0, //0显示地图，1显示空白
    longitude: "113.324520",
    latitude: "23.099994",
    conpany: {},
	http_host:"",
    markers: [{
      iconPath: "",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50,
      company_name:"",
      company_address:""
    }],
    template_data: { has_bottom: true },
	}
	},
	onLoad(e){
    var that = this;
	that.http_host = this.vuex_apiUrl;
	that.markers[0].iconPath=that.http_host +"/website/web/static/images/map_icon.png";
    that.get_data();
	},
	methods:{
		 //获取数据
		  get_data: function() {
		    var that = this;
		    var data = {};
			data.type='company';
			this.$api.getWebsIndexData(data).then(res=>{
					var jwd = res.data.long_lat.split(",");
					var mark=that.markers;
					mark[0].latitude = jwd[1];
					mark[0].longitude = jwd[0];
					  that.conpany= res.data.mess;
					  that.longitude= jwd[0];
					  that.latitude= jwd[1];
					  that.markers= mark;
					  that.company_address=res.data.address_info;
					  that.company_name=res.data.name;
					console.log("哈哈哈哈==",that.longitude);
						});
		  },
		  toMap:function(){
		    var that=this;
		    var lat = parseFloat(that.latitude);
		    var lng = parseFloat(that.longitude);
		    uni.openLocation({
		      latitude: lat,
		      longitude: lng,
		      scale: 18,
		      name: that.company_name,
		      address: that.company_address
		    })
		  },
	}
	}
</script>

<style>
	
	.block {
	  height: 20rpx;
	}
	
	.address_arrt_list {
	  background: #fff;
	}
	
	.address_arrt {
	  width: 100%;
	  font-size: 32rpx;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  border-bottom: 1rpx solid #e6e6e6;
	  padding: 20rpx 0;
	}
	
	.address_left {
	  margin-left: 30rpx;
	}
	
	.address_right {
	  width: 60%;
	  color: #5f5f5f;
	  text-align: right;
	  margin-right: 30rpx;
	  word-break: break-all;
	}
	
	.map_box {
	  padding: 25rpx;
	}
	
	.myMap {
	  width: 100%;
	  height: 460rpx;
	}
	
	.map_beijing_box {
	  padding: 30rpx;
	  width: 690rpx;
	  margin: 0 auto;
	  height: 460rpx;
	}
	
	.map_beijing {
	  background: #eee;
	  width: 100%;
	  height: 100%;
	}
	
	.display_none {
	  display: none;
	}

</style>