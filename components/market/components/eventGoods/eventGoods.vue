<template>
	<view
		:style="'padding: '+datas.content.padding_top+'px '+(datas.content.style==1?0:10)+'px '+datas.content.padding_bottom+'px;'">
		<view class="activity"
			:style="'background-color: '+datas.content.bg_color+';border-radius: '+(datas.content.style==1?0:4)+'px;'">
			
				<view class="activity-title" >
					<p class="name">{{datas.content.li_title}}</p>
					<p class="mores" @click="$common.diyLinkJump(datas.content.link)">查看更多</p>
					<!--查看更多-->
				</view>
			
			<scroll-view scroll-x="true" class="activity-list">
				<block v-for="(it,it_index) in datas.content.dataset">
					<view class="list">
						<view @click="$common.diyLinkJump(it.link)" >
							<view class="img">
								<image :src="it.pic" alt=""></image>
							</view>
							<view class="activity-price" :style="'color: '+datas.content.font_color+';'">
								{{monetary_unit}}<span class="activity-left">{{it.priceA}}</span><span
									class="activity-right">{{it.priceB}}</span>
							</view>
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "eventGoods",
		props: {
			datas: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				theme: getApp().globalData.style_color,
				http_host: this.vuex_apiUrl,
				monetary_unit: getApp().globalData.monetary_unit,
			};
		},
		created() {
			var that = this;
			that.datas.content.dataset.forEach(function(item) {
				item.priceA = that.$common.toPrice(item.price, true) 
				item.priceB = that.$common.toPrice(item.price, false) 
			})
			that.datas = that.datas
		},
	}
</script>

<style>
	.activity {
		padding: 0 11px;
	}

	.activity p {
		margin: 0;
		line-height: 1;
	}

	.activity a {
		display: block;
		min-height: 10px;
	}

	.activity .activity-title {
		display: flex;
		display: -webkit-box;
		display: -webkit-flex;
		align-items: center;
		padding: 15px 4px;
		font-size: 15px;
		line-height: 25px;
		overflow: hidden;
		box-sizing: border-box;
	}

	.activity .activity-title p {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}

	.activity .activity-title .name {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		font-size: 16px;
		line-height: 1;
		font-size: #333;
	}

	.activity .activity-title .mores {
		margin-left: 10px;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
		background-size: auto 12px;
		background-repeat: no-repeat;
		background-position: right center;
		padding-right: 15px;
		font-size: 13px;
		color: #999;
		line-height: 1;
	}

	.activity .activity-list {
		padding-bottom: 15px;
		width: 100%;
		white-space: nowrap;
		text-align: left;
	}

	.activity .activity-list::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.activity .activity-list .list {
		width: 25%;
		display: inline-block;
		text-align: center;
		padding: 0 4px;
		box-sizing: border-box;
	}

	.activity .activity-list .img {
		position: relative;
		width: 100%;
		font-size: 0;
		margin-bottom: 10px;
	}

	.activity .activity-list .img:before {
		content: "";
		display: block;
		padding-top: 100%;
	}

	.activity .activity-list .img image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.activity .activity-list .activity-price {
		font-size: 13px;
		line-height: 1;
	}

	.activity .activity-list .activity-price .activity-left {
		font-size: 16px;
	}

	.activity .activity-list .activity-price .activity-right {
		font-size: 13px;
	}
</style>
