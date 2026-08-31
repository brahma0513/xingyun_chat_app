<template>
	<view :style="'padding:'+datas.content.padding+'px 0;'">
		<view class="custom-order">
			<view class="type2" v-if="datas.content.css_type==2">
				<view hover-class="no-hover" url='/css_integral_shop/pages/order/orderList/orderList'
					open-type='navigate'>
					<view class="order-title">
						<view class="image">
							<image :src="datas.content.dataset[0].pic"></image>
						</view>
						<view class="infor">
							{{datas.content.li_title}}
						</view>
					</view>
				</view>
			</view>
			<view class="type1" v-if="datas.content.css_type==1">
				<view class="title">
					<p class="name">{{datas.content.li_title}}</p>
					<view hover-class="no-hover"
						@click="$common.diyLinkJump('/css_integral_shop/web/index.php?m=order&a=order_list')">
						<p class="more">全部订单</p>
					</view>
				</view>
				<view class="order-list" v-if="datas.content.css_type==1">
					<li v-for="(icon,icon_index) in list[0].icon_list" style="list-style: none;">
						<view class="nav-num" hover-class="no-hover"
							@click="$common.diyLinkJump('/css_integral_shop/web/index.php?m=order&a=order_list&status='+icon_index)">
							<view class="image">
								<image :src="icon.icon" alt=""> </image>
							</view>
							<p>{{icon.name}}</p>
							<block v-if='icon.num>0'>
								<view class='reddot'>{{icon.num}}</view>
							</block>
						</view>
					</li>
				</view>
				<view class="order-list" v-if="datas.content.css_type==2">
					<li v-for="(icon,icon_index) in list[0].icon_list_two" style="list-style: none;">
						<view class="nav-num" hover-class="no-hover"
							@click="$common.diyLinkJump('/css_integral_shop/web/index.php?m=order&a=order_list&status='+icon_index)">
							<view class="image">
								<image :src="icon.icon" alt=""> </image>
							</view>
							<p>{{icon.name}}</p>
							<block v-if='icon.num>0'>
								<view class='reddot'>{{icon.num}}</view>
							</block>
						</view>
					</li>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "cssOrderIntShop",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				list: []
			};
		},
		created() {
			const that = this
			that.get_list_num();
			var list = that.datas.content.dataset
			that.list = list
			
		},
		methods: {
			//获取数字
			get_list_num: function() {
				const that = this;
				that.$common.requestData({
					url: '/css_integral_shop/web/index.php?m=order&a=get_order_num',
					data: {},
					method: 'POST',
					needToken: true
				}).then(res => {
					if (res.errcode == 0) {
						that.datas.content.dataset[0].icon_list[1].num = res.data.pend_pay ? res.data
							.pend_pay : 0; //待付款
						that.datas.content.dataset[0].icon_list[2].num = res.data.pend_send ? res.data
							.pend_send : 0; //代发货
						that.datas.content.dataset[0].icon_list[3].num = res.data.pend_receive ? res.data
							.pend_receive : 0; //待收货
						if (that.datas.content.order_style == 2) {
							that.datas.content.dataset[0].icon_list_two[1].num = res.data.pend_pay ? res
								.data.pend_pay : 0; //待付款
							that.datas.content.dataset[0].icon_list_two[2].num = res.data.pend_send ? res
								.data.pend_send : 0; //代发货
							that.datas.content.dataset[0].icon_list_two[3].num = res.data.pend_receive ?
								res.data.pend_receive : 0; //待收货
						}
						that.$emit('update:data', that.datas.data);
					}
				})
			}
		}
	}
</script>

<style>
	.no-hover{
	    background-color: transparent
	  }
	  .custom-order{
	      padding: 0 10px;
	      
	  }
	  .custom-order .order-title{
	      display: block;
	      text-align: center
	  }
	  .custom-order .type2{
	      padding: 0px 10px;
	      border-radius: 8px;
	      background-color: #FFF;
	  }
	  
	  .reddot {
	      width: 30rpx;
	      height: 30rpx;
	      border-radius: 50rpx;
	      background: red;
	      float: right;
	      margin-right: 10px;
	      color: white;
	      position: absolute;
	      left:96rpx;
	      top:-4rpx;
	      font-size: 18rpx
	  }
	  
	  .custom-order .order-title {
	      padding: 13.5px 15px 13.5px 0;
	      overflow: hidden;
	      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
	      background-size: auto 14px;
	      background-repeat: no-repeat;
	      background-position: right center;
	  }
	  .custom-order .order-title .image{
	      width: 28px;
	      height: 28px;
	      float: left;
	      margin-right: 10px;
	  }
	  .custom-order .order-title .image image{
	      display: block;
	      width: 100%;
	      height: 100%;
	  }
	  .custom-order .order-title .infor{
	      width: calc(100% - 38px);
	      float: left;
	      line-height: 28px;
	      color: #333;
	      white-space: nowrap;
	      overflow: hidden;
	      text-overflow: ellipsis;
	      text-align: left;
	  }
	  .custom-order .type1{
	      background-color: #FFF;
	      border-radius: 8px;
	      padding: 0 15px;
	  }
	  .custom-order .type1 navigator{
	      text-align: center;
	      position: relative
	  }
	  .custom-order .type1 .title{
	      display: -webkit-box;
	      display: -webkit-flex;
	      display: flex;
	      padding: 10px 0;
	      font-size: 15px;
	      color: #333;
	      line-height: 25px;
	  }
	  .custom-order .type1 .title p{
	      white-space: nowrap;
	      overflow: hidden;
	      text-overflow: ellipsis;
	      margin: 0;
	  }
	  .custom-order .type1 .title .name{
	      -webkit-box-flex: auto;
	      -webkit-flex: auto;
	      flex: auto;
	      width: 50%;
	  }
	  .custom-order .type1 .title .more{
	      -webkit-box-flex: none;
	      -webkit-flex: none;
	      flex: none;
	      margin-left:10px ;
	      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
	      background-size: auto 14px;
	      background-repeat: no-repeat;
	      background-position: right center;
	      padding-right: 15px;
	      font-size: 13px;
	      color: #999;
	  }
	  .custom-order .type1 .order-list{
	      display: -webkit-box;
	      display: -webkit-flex;
	      display: flex;
	      text-align: center;
	      padding: 10px 0 15px;
	  }
	  .custom-order .type1 .order-list li{
	      -webkit-box-flex: auto;
	      -webkit-flex: auto;
	      flex: auto;
	      width: 20%;
	  }
	  .custom-order .type1 .order-list .image{
	      width: 30px;
	      height: 30px;
	      margin: 0 auto 5px;
	  }
	  .custom-order .type1 .order-list .image image{
	      display: block;
	      width: 100%;
	      height: 100%;
	  }
	  .custom-order .type1 .order-list p{
	      font-size: 13px;
	      color: #333333;
	      line-height: 24px;
	      white-space: nowrap;
	      overflow: hidden;
	      text-overflow: ellipsis;
	      display: block
	  
	  }
</style>