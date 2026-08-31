export default {
	data() {
		return {
			priceA: "", 
			priceB: "",
			list: "",
			infor:{type:0}
		}
	},
	
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			var that = this;
			// 获取协议内容
			that.$common.requestData({
				url: '/wsy_pay/web/index.php?m=order&a=user_pay_detail',
				data: {
					is_ajax:1,
					app_id: options.app_id,
					batchcode: options.batchcode
				},
				method: 'GET',
				needToken: true
			}).then(res => {
				var ItemPrice = Number(res.acc_amount).toFixed(2)
				if (Number(ItemPrice) >= 1) {
					var priceA = that.$common.toPrice (ItemPrice, 1);
					var priceB = that.$common.toPrice (ItemPrice, 0);
				} else {
					var priceA = 0 + '' +  that.$common.toPrice (ItemPrice, 0);
				}
					that.priceA=priceA;
					that.priceB=priceB;
					that.list=res;
			})
		},
	methods: {
		
	}
}