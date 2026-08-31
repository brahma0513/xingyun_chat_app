<template>
	<view class="custom-icon"
		:style="'background-size:100% 100%;background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: ' + ( datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none' ) + ';padding:'+datas.content.padding_top+'px '+(datas.content.select_style==2?datas.content.padding_horizontal:'0')+'px '+datas.content.padding_bottom+'px;'">
		<view
			:style="'background-size:100% 100%;background-color: '+(datas.content.card_select_bg_model==1&&datas.content.select_style==2?datas.content.card_bg_color:'transparent')+';background-image: '+ ( datas.content.card_select_bg_model==2&&datas.content.select_style==2?'linear-gradient('+datas.content.card_gradient_angle+','+datas.content.card_gradient_color1+','+datas.content.card_gradient_color2+')':'none' ) + ';border-radius:' + +(datas.content.select_style==2?datas.content.radius_diy:0)+'px;overflow: hidden;'">
			<!--平铺显示-->
			<block v-if="datas.content.css_type == 1">
				<view class="subscribe-list-box">
					<block v-for="(item_list,index_list) in datas.content.dataset">
						<view :style="'width:'+(1/datas.content.show_num*100)+'%;min-width:'+(1/datas.content.show_num*100)+'%;'"
							:class="'navigator '+(datas.content.dataset.length <= 5 ?'list-flex':'')"
							@click="$common.diyLinkJump(item_list.link)">
							<view class="subscribe-list-sbox">
								<image class="subscribe-list-img" :src="item_list.pic" :lazy-load="true"></image>
								<text class='subscribe-list-text'
									:style="'color:'+item_list.color">{{item_list.title}}</text>
							</view>
						</view>
					</block>
				</view>
			</block>
			<!--滑动显示-->
			<block v-else-if="datas.content.css_type == 2">
				<block v-if="!allShow">
					<view style="position: relative;" v-if="datas.content.max_show_num">
						<swiper class="swiper" :style="'height:'+swiperheight+'px;'" :current="currentSwiper"
							@change="swiperChange">
							<block v-for="(item_lists,index_lists) in dataset_groups">
								<swiper-item class='subscribe-list-box2 subscribe-list-box3'
									style="white-space: normal;">
									<block v-for="(item_list,index_list) in item_lists">
										<!-- 客服按钮start -->
										<block v-if="item_list.open_type == 'contact'&&item_list.sel_link_type!=2">
											<button v-if="item_list.link=='qy_weixin'" hover-class="no-hover"
												:style="'width:'+(1/datas.content.show_num*100)+'%; font-size:0'">
												<view class="subscribe-list-sbox">
													<image class="subscribe-list-img" :src="item_list.pic" lazy-load>
													</image>
													<text class='subscribe-list-text'
														:style="'color:'+item_list.color">{{item_list.title}}</text>
												</view>
											</button>
											<button v-else hover-class="no-hover" :open-type="item_list.open_type"
												:style="'width:'+(1/datas.content.show_num*100)+'%; font-size:0'">
												<view class="subscribe-list-sbox">
													<image class="subscribe-list-img" :src="item_list.pic" lazy-load>
													</image>
													<text class='subscribe-list-text'
														:style="'color:'+item_list.color">{{item_list.title}}</text>
												</view>
											</button>
										</block>
										<!-- 客服按钮end -->
										<block v-else>
											<navigator hover-class="no-hover"
												:url="item_list.sel_link_type==2||item_list.sel_link_type==3?'':item_list.link"
												:open-type="item_list.sel_link_type==2||item_list.sel_link_type==3?'':item_list.open_type"
												@click="$common.diyLinkJump(item_list.link)"
												:data-appid="item_list.diy_openid" :data-video_id="item_list.video_id"
												:data-video_feed_id="item_list.video_feed_id"
												:style="'width:'+(1/datas.content.show_num*100)+'%; font-size:0'">
												<view class="subscribe-list-sbox">
													<image class="subscribe-list-img" :src="item_list.pic" lazy-load>
													</image>
													<text class='subscribe-list-text'
														:style="'color:'+item_list.color">{{item_list.title}}</text>
												</view>
											</navigator>
										</block>
									</block>
								</swiper-item>
							</block>
						</swiper>
						<!--指示点-->
						<view class="dots" v-if="dataset_groups.length>1">
							<block v-for="(item_list,index_list) in dataset_groups">
								<view :style="'background:'+datas.content.max_show_page_color+';'"
									:class="'dot'+(index_list == currentSwiper ? ' active' : '')"></view>
							</block>
						</view>
						<!--指示点end-->
					</view>

				<scroll-view scroll-x="true" class='subscribe-list-box2' v-else>
					<block v-for="(item_list,index_list) in datas.content.dataset">
						<view :style="'width:'+(1/datas.content.show_num*100)+'%;'" class="navigator"
							@click="$common.diyLinkJump(item_list.link)">
							<view class="subscribe-list-sbox">
								<image class="subscribe-list-img" :src="item_list.pic" :lazy-load="true"></image>
								<text class='subscribe-list-text'
									:style="'color:'+item_list.color">{{item_list.title}}</text>
							</view>
						</view>
					</block>
				</scroll-view>
				</block>
				
				<view class="subscribe-list-box" v-if="allShow">
					<block v-for="(item_list,index_list) in datas.content.dataset">
						<view :style="'width:'+(1/datas.content.show_num*100)+'%;'"
							:class="'navigator '+(datas.content.dataset.length <= 5 ?'list-flex':'')"
							@click="$common.diyLinkJump(item_list.link)">
							<view class="subscribe-list-sbox">
								<image class="subscribe-list-img" :src="item_list.pic" :lazy-load="true"></image>
								<text class='subscribe-list-text'
									:style="'color:'+item_list.color">{{item_list.title}}</text>
							</view>
						</view>
					</block>
				</view>
				<view class="switch-box-new" @click='showIcon'
					:style="'padding: '+(datas.content.nav_slide?15:10)+'px 0 '+(datas.content.nav_slide?10:15)+'px;'"
					v-if="datas.content.select_style==1&&datas.content.all_switch">
					<view :class="'arrow-bottom '+(allShow?'active':'')"
						:style="'border-color: '+datas.content.arrow_color+';'"></view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name: "newIcons",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				allShow: false,
				swiperheight: 80, // 轮播的高度
				currentSwiper: 0, // 轮播指示点索引
			};
		},
		created() {
			const that = this;
			var dataset = that.datas.content.dataset;
			let show_num = that.datas.content.show_num;
			let max_show_num = that.datas.content.max_show_num;
			if (that.datas.content.css_type == 2 && max_show_num) {
				let size = show_num * max_show_num;
				let dataset_groups = that.chunkArray(dataset, size);
				let notitle_status = true;
				console.log('dataset_groups', dataset_groups)
				that.dataset_groups = dataset_groups
				dataset_groups.forEach((item,index) => {
					item.forEach((itm,index2)=>{
						if(itm.title != ''){
							notitle_status = false;
							return;
						}
					})
				});
				let height = 0;
				if(notitle_status == true){ 
					 height = (80 * max_show_num) - 28; //计算swiper高度
				}else{
					 // height = (80 * max_show_num) -8; //计算swiper高度
					 height = (80 * max_show_num); //计算swiper高度
				}
				that.swiperheight = height
			}
		},
		methods: {
			showIcon() {
				this.allShow = !this.allShow
			},
			swiperChange: function(e) {
				// console.log(e);
				this.currentSwiper = e.detail.current
			},
			// 修改数据摆列方法   将dataset数组改成多组的格式显示 ，如： dataset:[ [{图标1},{图标2},...,{图标5}] , [{图标6}] ]
			chunkArray(array, chunkSize) { // array 数组 chunkSize 每个小数组的数量
				let result = [];
				for (let i = 0; i < array.length; i += chunkSize) {
					result.push(array.slice(i, i + chunkSize));
				}
				return result;
			}
		}
	}
</script>

<style>
	.no-hover {
		background-color: transparent
	}

	.custom-icon button {
		background: transparent;
		padding-left: 0;
		padding-right: 0;
		margin-left: 0;
		margin-right: 0;
		box-sizing: content-box;
		line-height: 1.7
	}

	.custom-icon button::after,
	.custom-suspend button::before {
		display: none
	}

	.custom-icon .switch-box {
		width: 100%;
		padding: 10px 0;
	}

	.custom-icon .all-switch.img {
		width: 15px;
		display: block;
		margin: 0 auto;
	}

	.custom-icon .icon90 {
		transform: rotate(180deg)
	}

	.subscribe-list-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;

	}

	.subscribe-list-box .navigator,
	.subscribe-list-box button {
		text-align: center;
		min-width: 20%;
		height: 156rpx;
		vertical-align: middle;
		padding: 1px 0;
	}

	.list-flex {
		flex: 1;
	}

	.subscribe-list-box .subscribe-list-sbox .subscribe-list-text,
	.subscribe-list-box2 .subscribe-list-sbox .subscribe-list-text {
		font-size: 28rpx;
		color: #5d5d5d;
		width: 100%;
		word-wrap: break-word;
		white-space: normal;
		overflow: hidden;
		line-height: 1.5
	}

	.subscribe-list-box .subscribe-list-sbox .subscribe-list-img,
	.subscribe-list-box2 .subscribe-list-sbox .subscribe-list-img {
		width: 88rpx;
		height: 88rpx;
		/* border-radius:50%; */
		overflow: hidden;
		display: block;
		margin: 5px auto;

	}

	.subscribe-list-box2 {
		white-space: nowrap;
		display: flex;
	}

	.subscribe-list-box2 .navigator,
	.subscribe-list-box2 button {
		width: 150rpx;
		/* height: 156rpx; */
		/* vertical-align: middle; */
		vertical-align: top;
		display: inline-block;
		text-align: center;
		padding: 1px 0;

	}

	.switch-box-new {
		text-align: center;
		font-size: 0;
	}

	.switch-box-new .arrow-bottom {
		display: inline-block;
		width: 8px;
		height: 8px;
		border: 1px solid #B9B9B9;
		border-left: transparent;
		border-top: transparent;
		transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		/* IE 9 */
		-moz-transform: rotate(45deg);
		/* Firefox */
		-webkit-transform: rotate(45deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(45deg);
		/* Opera */
	}

	.switch-box-new .arrow-bottom.active {
		transform: rotate(225deg);
		-ms-transform: rotate(225deg);
		/* IE 9 */
		-moz-transform: rotate(225deg);
		/* Firefox */
		-webkit-transform: rotate(225deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(225deg);
		/* Opera */
	}

	/*隐藏滚动条*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.no-hover {
		background-color: transparent
	}

	.custom-icon button {
		background: transparent;
		padding-left: 0;
		padding-right: 0;
		margin-left: 0;
		margin-right: 0;
		box-sizing: content-box;
		line-height: 1.7
	}

	.custom-icon button::after,
	.custom-suspend button::before {
		display: none
	}

	.custom-icon .switch-box {
		width: 100%;
		padding: 10px 0;
	}

	.custom-icon .all-switch.img {
		width: 15px;
		display: block;
		margin: 0 auto;
	}

	.custom-icon .icon90 {
		transform: rotate(180deg)
	}

	.subscribe-list-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;

	}

	.subscribe-list-box navigator,
	.subscribe-list-box button {
		text-align: center;
		min-width: 20%;
		height: 156rpx;
		vertical-align: middle;
		padding: 1px 0;
	}

	.list-flex {
		flex: 1;
	}

	.subscribe-list-box .subscribe-list-sbox .subscribe-list-text,
	.subscribe-list-box2 .subscribe-list-sbox .subscribe-list-text {
		/* font-size: 28rpx; */
		font-size: 26rpx;
		color: #5d5d5d;
		display: inline-block;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		line-height: 1.5;
		text-overflow: ellipsis;
		text-align: center;
		margin: 0;
	}

	.subscribe-list-box .subscribe-list-sbox .subscribe-list-img,
	.subscribe-list-box2 .subscribe-list-sbox .subscribe-list-img {
		width: 88rpx;
		height: 88rpx;
		/* border-radius:50%; */
		overflow: hidden;
		display: block;
		margin: 5px auto;

	}

	.subscribe-list-box2 {
		white-space: nowrap;
		display: flex;
	}

	.subscribe-list-box2.subscribe-list-box3 {
		white-space: normal;
		display: flex;
		flex-wrap: wrap;
	}

	.subscribe-list-box2 navigator,
	.subscribe-list-box2 button {
		width: 150rpx;
		/* height: 156rpx; */
		/* vertical-align: middle; */
		vertical-align: top;
		display: inline-block;
		text-align: center;
		padding: 1px 0;

	}

	.switch-box-new {
		text-align: center;
		font-size: 0;
	}

	.switch-box-new .arrow-bottom {
		display: inline-block;
		width: 8px;
		height: 8px;
		border: 1px solid #B9B9B9;
		border-left: transparent;
		border-top: transparent;
		transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		/* IE 9 */
		-moz-transform: rotate(45deg);
		/* Firefox */
		-webkit-transform: rotate(45deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(45deg);
		/* Opera */
	}

	.switch-box-new .arrow-bottom.active {
		transform: rotate(225deg);
		-ms-transform: rotate(225deg);
		/* IE 9 */
		-moz-transform: rotate(225deg);
		/* Firefox */
		-webkit-transform: rotate(225deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(225deg);
		/* Opera */
	}

	/*隐藏滚动条*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.dots {
		padding: 5px 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dots .dot {
		width: 8rpx;
		height: 8rpx;
		border-radius: 8rpx;
		margin: 0 8rpx;
		background-color: #F2F2F2;
		opacity: 0.2;
	}

	.dots .active {
		width: 24rpx;
		height: 8rpx;
		border-radius: 4rpx;
		background-color: #fc4308;
		opacity: 1;
	}
</style>