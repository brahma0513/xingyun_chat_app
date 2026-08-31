<template>
	<view class=''
		:style="'padding:'+(datas.content.padding_top?datas.content.padding_top:datas.content.padding)+'px '+(datas.content.style==1?0:10)+'px '+(datas.content.padding_bottom?datas.content.padding_bottom:datas.content.padding)+'px;'"
		v-if="show">
		<view class="custom-fun">
			<block v-if="datas.content.css_type==1">
				<view class="type1" :style="'border-radius: '+(datas.content.style==1?0:10)+'px;'">

			 		<li v-for="(items,index) in datas.content.dataset" v-if="items.conference_hide !=1"  @click="jump(items.diy_link)">
						<button hover-class="no-hover" v-if="items.diy_link == 'contact'" open-type="contact">
							<view class="image">
								<image :src="items.pic"></image>
							</view>
							<view class="infor" :style="'color: '+items.color">
								{{items.title}}
							</view>
						</button>
					
							<view class="image">
								<image :src="items.pic"></image>
							</view>
							<view class="infor" :style="'color: '+items.color">
								{{items.title}}
							</view>
	
					</li>
				</view>
			</block>
			<block v-if="datas.content.css_type==2">
				<view class="type2" :style="'border-radius: '+(datas.content.style==1?0:10)+'px;'">
					<li v-for="(items,index) in datas.content.dataset" v-if="items.conference_hide !=1"
						:class="'line-'+datas.content.data_num" @click="jump(items.diy_link)">
						<button hover-class="no-hover" v-if="items.diy_link == 'contact'" open-type="contact">
							<view class="image">
								<image mode="widthFix" :src="items.pic"></image>
							</view>
							<view class="infor" :style="'color:'+items.color">
								{{items.title}}
							</view>
						</button>
						
							<view class="image" >
								<image mode="widthFix" :src="items.pic"></image>
							</view>
							<view class="infor" :style="'color:'+items.color">
								{{items.title}}
							</view>
						
					</li>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import common from '@/utils/common.js'
	export default {
		name: "unicomPersonIcons",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				list: [],
				show: true
			};
		},
		created() {
			console.log('个人中心')
			console.log(this.datas.content.dataset)
		},
		methods: {
			jump:function(link){
				var user_id = this.vuex_user.user_id;
				var phone = this.vuex_user.phone;
				var full_link = link+'&wsy_user_id='+user_id+'&wsy_phone='+phone
				this.$common.diyLinkJump(full_link);
			}
		},
		attached: function() {
			// const that = this
			// that.setData({
			// 	show: true,
			// 	list: that.datas.content.dataset
			// })
		},
	}
</script>

<style>
	.no-hover {
		background-color: transparent
	}

	.custom-fun {
		/* padding:0 10px; */
	}

	.custom-fun button {
		background: transparent;
		padding: 0;
	}

	.custom-fun button::after,
	.custom-fun button::before {
		display: none
	}

	.custom-fun .type1 {
		background-color: #FFF;
		/* border-radius: 8px; */
	}

	.custom-fun .type1 li {
		display: block;
		padding: 13.5px 30px 13.5px 15px;
		overflow: hidden;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
		background-size: auto 14px;
		background-repeat: no-repeat;
		background-position: right 15px center;
	}

	.custom-fun .type1 li .image {
		width: 28px;
		height: 28px;
		float: left;
		margin-right: 10px;
	}

	.custom-fun .type1 li .image image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.custom-fun .type1 li .infor {
		width: calc(100% - 38px);
		float: left;
		line-height: 28px;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
		font-size: 13px
	}

	.custom-fun .type2 {
		overflow: hidden;
		background-color: #FFF;
		/* border-radius: 8px; */
		padding: 10px 0;
		justify-content: space-around;
	}

	.custom-fun .type2 li {
		padding: 10px 5px;
		box-sizing: border-box;
		display: block;
	}

	.custom-fun .type2 .image {
		width: 35px;
		height: 35px;
		margin: 5px auto;
	}

	.custom-fun .type2 .image image {
		width: 100%;
		height: 100%;
	}

	.custom-fun .type2 button {
		line-height: 24px;
	}

	.custom-fun .type2 .infor {
		font-size: 13px;
		color: #333;
		line-height: 24px;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.custom-fun .type2 .line-3 {
		width: 33.3333%;
		float: left;
	}

	.custom-fun .type2 .line-4 {
		width: 25%;
		float: left;
	}

	/*功能板块end*/
	/*订单显示start*/
	.custom-order {
		padding: 0 15px;
		background-color: #f5f5f5;
	}

	.custom-order .type2 {
		padding: 0px 15px;
		border-radius: 8px;
		background-color: #FFF;
		margin: 5px 0;
	}

	.custom-order .order-title {
		padding: 13.5px 15px 13.5px 0;
		overflow: hidden;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
		background-size: auto 14px;
		background-repeat: no-repeat;
		background-position: right center;
	}

	.custom-order .order-title .image {
		width: 28px;
		height: 28px;
		float: left;
		margin-right: 10px;
	}

	.custom-order .order-title .image image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.custom-order .order-title .infor {
		width: calc(100% - 38px);
		float: left;
		line-height: 28px;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.custom-order .type1 {
		background-color: #FFF;
		border-radius: 8px;
		padding: 0 15px;
		margin: 10px 0;
	}

	.custom-order .type1 .title {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		padding: 10px 0;
		font-size: 13px;
		color: #333;
		line-height: 25px;
	}

	.custom-order .type1 .title p {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}

	.custom-order .type1 .title .name {
		-webkit-box-flex: auto;
		-webkit-flex: auto;
		flex: auto;
		width: 50%;
	}

	.custom-order .type1 .title .more {
		-webkit-box-flex: none;
		-webkit-flex: none;
		flex: none;
		margin-left: 10px;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAaCAYAAABozQZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRDNThCMjVBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRDNThCMjRBNDdCMTFFOEIzRTlDMTY5OTgwN0Y1MTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhZmVkN2E5LTZlYzMtMTE0MC05MWJhLTU4YTY3NDRlODU4ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MjVkNWQxMi02NDMzLWE2NDgtOWZlMi1jYzNjNTVlNTBhMGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7XKp81AAABmElEQVR42pSUTShEURTH3zx3o2wUychGslBKsbGxoVEWRkphIVGzUbMQNQvFRrKahY96UxQ7NppJYaEsLUZiZSUbH2Vnacrzu1x1er335s6pf2fmf+/v3I933kt4njfvOM6+8xeLmUxmz7EMF82J/7uFQmGtFjiLvoS3ToEdGzjh+77D5G5+X6NmMXbMEaaqwjoo0GoKdInxK5SiyHfUtn+DCW+kXnQjxofQLYUbY1eWweQiaUxYL2iQBZ5CV5bBpDTpQFht6J6ifVVhU2CBtCWsBlSmQKoqbArkSMsB+5IC45FnDrmDWdJhwO5wbZqBHRyRRlFF2DnXthUpcE6aFlaPNWxCNlBF2VKce1NvVVhFZQmekCaF9YjysbcN1ETSZ+0Xdlm3LXfwqWJA3ecXqEXYp0ATsU1imuAuAOYlGAoDrugVAnYWcCk4VwVATz9SYen3OA14FrZDZaB6UgkNi7F3NAL4EHUvdclkst18AOSN6vMOAD7HPUJlHkWn8Ermfbb6en6I/9u24P/KM2gVvQJu1NLoPwIMAMlCgqHMeFQ6AAAAAElFTkSuQmCC);
		background-size: auto 14px;
		background-repeat: no-repeat;
		background-position: right center;
		padding-right: 15px;
		font-size: 13px;
		color: #999;
	}

	.custom-order .type1 .order-list {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		text-align: center;
		padding: 10px 0 15px;
	}

	.custom-order .type1 .order-list li {
		-webkit-box-flex: auto;
		-webkit-flex: auto;
		flex: auto;
		width: 20%;
	}

	.custom-order .type1 .order-list .image {
		width: 35px;
		height: 35px;
		margin: 0 auto 5px;
	}

	.custom-order .type1 .order-list .image image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.custom-order .type1 .order-list p {
		font-size: 13px;
		color: #333333;
		line-height: 24px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
