<template>
<view>
  <view class="electron_fuka_erweima_box" :style="styleBg">
    <view class="electron_fuka_erweima_box_main">
      <view class="electron_fuka_erweima_box_main_erweima">
        <image class="electron_fuka_erweima_img" :src="img_url" mode=""/>
      </view>
      <view class="electron_fuka_erweima_box_main_right">
        <view class="electron_fuka_erweima_box_main_right_title">出示数据码</view>
        <view class="electron_fuka_erweima_box_main_right_text">领取红包和贡献值</view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
	export default {
		name: "electronFukaErweima",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				http_host: this.vuex_apiUrl,
				stock_out_img: '',
				supply_id: 0,
				styleBg:'',
				img_url :undefined
			}
		},
		created() {
			this.get_carousel_list_content();
			this.styleBg = 'background-image: url(' + this.vuex_apiUrl + '/electron_fuka/admin/static/images/erwimabg.jpg);' +
					'background-position: center center;' +
					'background-repeat: no-repeat;' +
					'background-size: 100% 100%;'
		},
		methods: {
		 get_carousel_list_content() {
			 var that = this;
			 this.$common.requestData({
			 	url: "/electron_fuka/web/index.php?m=store_reward&a=qr_code",
			 	data: {},
			 	method: "POST",
			 	needToken: true
			 }).then(res => {
				 if(res.errcode == 0){
					that.img_url = res.code_url;
				 }
			 });
		    },
		}
	}
</script>

<style>
.electron_fuka_erweima_box {
  height: 170px;
  align-items: center;
  /* background-image: url("/electron_fuka/admin/static/images/erwimabg.jpg"); */
  display: flex;
  background-color: aquamarine;
  justify-content: center;
}

.electron_fuka_erweima_box_main {
  padding: 0 30px;
  width: 90%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.electron_fuka_erweima_box_main_erweima {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  background-color: #fff;
  border-radius: 10px;
}

.electron_fuka_erweima_box_main_right {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.electron_fuka_erweima_box_main_right_title {
  font-weight: 600;
  font-size: 22px;
  color: #fff;
}

.electron_fuka_erweima_box_main_right_text {
  color: #fff;
  margin-top: 5px;
  font-size: 14px;
  font-weight: 550;
}
.electron_fuka_erweima_img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
</style>