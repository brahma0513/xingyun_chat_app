<template>
	<view class="bird_store_trade61" :style="'padding-top:'+(datas.content.padding_top||0)+'px; '+'padding-right:'+datas.content.padding_right+'px;padding-bottom:'+(datas.content.padding_bottom)+'px;  padding-left:'+datas.content.padding_left+'px;'">
	  <view class="bird_store_content" :style="'background-image: url('+datas.content.pic+');'">
	    <!-- {{data.content.pic}} -->
	    <!-- <view class="title">
	            {{item?.content?.title}}
	            <span class="amount" style="padding-left: 5px;">{{item?.content?.dataset?.total_num||0}}</span>
	        </view> -->
	    <!-- 全部累计收益 -->
	    <div class="total_reward" v-if="datas.content.income_show">
	      <image :src="http_host +'/bird_store/web/static/images/douzi_icon.png'" alt=""></image>
	      <div>{{datas.content.currency_income}}: {{assets.total_reward ||0}}</div>
	    </div>
	    <!-- 资产数据 -->
	    <view class="bird_store_box " data-json="json">
	      <view class="bird_store_box_item" @click="go_urls" data-index="0" v-if="datas.content.currency_show">
	        <view class="bird_store_value">{{assets.currency_num||'0'}}</view>
	        <view class="bird_store_label">{{datas.content.currency_name}}</view>
	      </view>
	      <view class="bird_store_box_item" @click="go_urls" data-index="1" v-if="datas.content.integral_show">
	        <view class="bird_store_value">{{assets.free_total||'0'}}</view>
	        <view class="bird_store_label">{{datas.content.integral_name}}</view>
	      </view>
	      <view class="bird_store_box_item" @click="go_urls" data-index="2" v-if="datas.content.app_integral_show">
	        <view class="bird_store_value">{{assets.app_integral||'0'}}</view>
	        <view class="bird_store_label">{{datas.content.app_integral_name}}</view>
	      </view>
	      <view class="bird_store_box_item" @click="go_urls" data-index="3" v-if="datas.content.plat_integral_show">
	        <view class="bird_store_value">{{assets.plat_integral||'0'}}</view>
	        <view class="bird_store_label">{{datas.content.plat_integral_name}}</view>
	      </view>
	      <!-- 红积分 -->
	      <view class="bird_store_box_item" @click="go_urls" data-index="4" :data-name="datas.content.red_integral_name" v-if="datas.content.red_integral_show">
	        <view class="bird_store_value">{{assets.jf_speed_current_money||'0'}}</view>
	        <view class="bird_store_label">{{datas.content.red_integral_name}}</view>
	      </view>
	      <!-- 零钱 -->
	      <view class="bird_store_box_item" @click="go_urls" data-index="5" :data-name="datas.content.broken_money_name" v-if="datas.content.broken_money_show">
	        <view class="bird_store_value">{{assets.pocket_money||'0'}}</view>
	        <view class="bird_store_label">{{datas.content.broken_money_name}}</view>
	      </view>
	    </view>
	  </view>
	</view>
</template>

<script>
	export default {
		name: "birdStore",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				http_host: '',
				assets:''
			};
		},
		created() {
			var that = this;
			that.http_host = that.vuex_apiUrl
			if(that.datas.content.pic.indexOf('http')==-1){
				if(that.datas.content.pic.indexOf('/bird_store')>=0){
					that.datas.content.pic = that.vuex_apiUrl+that.datas.content.pic
				}else{
					that.datas.content.pic = that.vuex_apiUrl+'/resources/'+that.datas.content.pic
				}
			}
			that.getData();
			uni.$on('onShow', () => {
				that.getData();
			})
		},
		methods: {
			//获取数据
			getData: function() {
				var that = this;
				that.$common.requestData({
					url: '/bird_store/web/index.php?m=index&a=balance',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode === 0) {
						that.datas.content.dataset[0] = res.data
						that.assets = res.data;
						that.json = JSON.stringify(res.data);
					}
				})
			},
			jump(url){
				this.$common.diyLinkJump(url,"h5",true);
			},
			 go_urls: function (e) {
			      var that = this;
			      console.log('go_urls', e, e.currentTarget.dataset);
			      var index = Number(e.currentTarget.dataset.index);
			      var name = e.currentTarget.dataset.name;
			      var url = "";
			      switch (index) {
			        case 0:
			          console.log("消费券余额");
			          url = "/bird_store/index.php?path=view/web";
			          break;
			        case 1:
			          console.log("我的积分");
			          url = "/bird_store/index.php?path=view/web/integral";
			          break;
			        case 2:
			          console.log("应用币");
			          url = "/bird_store/index.php?path=view/web/credit_integral";
			          break;
			        case 3:
			          console.log("平台积分");
			          url = "/wsy_user/web/index.php?m=integral&a=my_integral";
			          break;
			        case 4:
			          console.log("应用积分");
			          url = `/bird_store/index.php?path=view/web/red_integral&name=${name}`;
			          break;
			        case 5:
			          console.log("零钱");
			          url = `/bird_store/index.php?path=view/web/broken_money&name=${name}`;
			          break;
			      }
			      if (url == "") {
			        return;
			      }
			     that.$common.diyLinkJump(url,"h5",true);
			    },
		},
	}
</script>

<style>
.bird_store_content {
  background-size: 100% 100%;
  background-color: transparent;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  border-radius: 0px;
  padding-top: 5px;
}

/* 全部累计收益 */
.total_reward {
  background-color: transparent;
  padding: 5px 10px;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.total_reward image {
  width: 16px;
  height: 16px;
  margin: 0 8px;
}

/* 资产数据 */
.bird_store_box {
  background-color: transparent;
  display: flex;
  align-items: center;
  padding: 10px 10px 15px;
  border-radius: 15px;
  text-align: center;
}

.bird_store_box_item {
  border: none;
  flex: 1;
  text-align: center;
}

.bird_store_value {
  color: #fff;
  font-weight: 600;
  font-size: 18px;
}

.bird_store_label {
  font-weight: 400;
  font-size: 14px;
  color: #999999;
  line-height: 20px;
}
</style>
