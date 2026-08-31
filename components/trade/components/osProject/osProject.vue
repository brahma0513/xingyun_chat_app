<template>
	<view class="offline_service_merchant"
		:style="'padding:'+datas.content.padding+'px 0px '+datas.content.padding+'px 0px;'">
		
		<!--分类start-->
		<view class="sort-box">
			<view class="sort-tab-box">
				<view class="sort-tab">
					<view class="sort-title" :class="{'sort-active': datas.content.sort_type == 'default'}" 
					@click="handleSortType('default')">{{$t('offline_service_project.textContent_5')}}</view>
				</view>
				<view class="sort-tab">
					<view class="sort-title" :class="{'sort-active': datas.content.sort_type == 'sales'}" 
					@click="handleSortType('sales')">{{$t('offline_service_project.textContent_6')}}</view>
				</view>
				<view class="sort-tab">
					<view class="sort-title" @click="sortToggle">{{datas.content.classify_name || $t('offline_service_project.textContent_7')}}</view>
					<u-icon name="arrow-down" color="#999999" size="14"></u-icon>
				</view>
			</view>
			<view class="sort-pop" :class="{'sort-pop-height': datas.content.showSort}">				
				<view class="sort-new-box">
					<!--遮罩层start-->
					<view class="sort-new-mask" @click="closeSort"></view>
					<!--遮罩层end-->
					<view class="sort-new-content">
						<view class="sort-content">
							<view class="first-sort">
								<view class="type-item" v-for="(item,index) in datas.content.classify_list" :key="index"
								:class="{'type-active': datas.content.current_classify.parentIndex == index}"
								@click="handleParentClassify(index,item.id,item.name)">{{item.name}}</view>
							</view>
							<view class="type-tag-box">
								<view class="tag-item" v-for="(item,index) in datas.content.child_classify" :key="index"
								:class="{'tag-active': datas.content.current_classify.childIndex == index}"
								@click="handleChildClassify(index,item.id,item.name)">{{item.name}}</view>
							</view>
						</view>
						<view class="sort-bnt-box">
							<view class="sort-bnt" @click="handleSortConfirm">{{$t('public.confirm')}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--分类end-->
		
		<view class="list-box">
			<view class="list-item" v-for="(item,index) in listData" @click="jump('/offline_service/web/index.php?m=index&a=index#/pages/goods_details/goods_details?id='+item.id)" >
				<view class="pic-box">
					<image :src="item.resources_http[0]" class="poster"></image>
				</view>
				<view class="info-box">
					<view class="title">{{item.name}}</view>
					<view class="desc">
						<text class="person">{{item.summary}}</text>
					</view>
					<view class="bottom">
						<view class="left-box">
							<view class="price">{{item.price}}<text>元/次</text></view>
							<view class="time">
								<image :src="http_host+'/offline_service/web/static/images/time-icon.png'" class="time-icon"></image>
								{{item.time}}{{item.time_unit_text}}
							</view>
						</view>
						<view class="choose-bnt">{{item.book_bottom_name}}</view>
					</view>
				</view>
			</view>
			<view class="empty" v-if="listData.length<=0"><image class="empty-image" :src="http_host+'/offline_service/web/static/images/no-data.png'"></image>暂无数据</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "osProject",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				listData: [],
				pageCurrent: 1,
				page_size: 20,
				http_host: '',
				current_city: '',
				showSort: false, // 是否显示分类弹窗
				sort_type: 'default', // sales=按销量排序｜default=综合排序
				classify_list: [] ,// 分类数据
				child_classify: [], // 子分类数据
				// 当前选择的分类
				current_classify:{
					parentIndex: 0,
					childIndex: 0,
					id: -1,
					name: '' // 【用于选择】
				},
				oldParentIndex: 0, // 用于保存旧选项
				oldChildIndex: 0, // 用于保存旧选项
				// 当前选择的分类名称【用于显示】
				classify_name: "",
			};
		},
		created() {
			var that = this;
			that.http_host = that.vuex_apiUrl
			that.getLocationUni();
			that.getClassifyList();
			that.getProjectList()
		},
		methods: {
			// 选择一级分类
			handleParentClassify(index,id,name) {
				if(this.datas.content.current_classify.parentIndex == index) return;
				this.datas.content.current_classify.parentIndex = index;
				this.datas.content.current_classify.childIndex = 0;
				this.datas.content.current_classify.id = id;
				this.datas.content.current_classify.name = name;
				let dataList = JSON.parse(JSON.stringify(this.datas.content.classify_list))
				this.datas.content.child_classify = dataList[index].children;
				this.datas.content.child_classify.unshift({
					id,
					name: this.$t('offline_service_project.textContent_8')
				})
			},
			// 选择二级分类
			handleChildClassify(index,id,name){
				if(this.datas.content.current_classify.childIndex == index) return;
				this.datas.content.current_classify.childIndex = index;
				this.datas.content.current_classify.id = id;
				this.datas.content.current_classify.name = name;
			},
			// 确认选择分类
			handleSortConfirm(){
				this.datas.content.classify_id = this.datas.content.current_classify.id;
				this.datas.content.classify_name = this.datas.content.classify_id == -1 ? this.$t('offline_service_project.textContent_7') : this.datas.content.current_classify.name;
				this.resetGetList();
				this.closeSort();
			},
			// 选择排序类型
			handleSortType(type){
				this.datas.content.sort_type = type;
				this.datas.content.showSort = false;
				this.closeSort();
				this.resetGetList();
			},
			// 显示/隐藏弹窗
			sortToggle(isOnlyShow = false){
				if(isOnlyShow){
					this.datas.content.showSort = true;
					this.oldParentIndex = this.current_classify.parentIndex;
					this.oldChildIndex = this.current_classify.childIndex;
					return
				}
				this.datas.content.showSort = !this.datas.content.showSort;
				if(!this.datas.content.showSort && this.oldChildIndex >= 0){
					setTimeout(()=>{
						this.current_classify.childIndex = this.oldChildIndex;
						this.current_classify.parentIndex = this.oldParentIndex;
					},1000)
				}
			},
			// 隐藏弹窗
			closeSort(){
				this.datas.content.showSort = false;
				if(this.oldChildIndex >= 0){
					setTimeout(()=>{
						this.current_classify.childIndex = this.oldChildIndex;
						this.current_classify.parentIndex = this.oldParentIndex;
					},1000)
				}
			},
			// 获取分类
			getClassifyList() {
				var that = this;
				that.$common.requestData({
					url: '/offline_service/web/index.php?m=project&a=get_project_classify_list',
					data: {},
					method: 'POST',
					needToken: false
				}).then(res => {
					if (res.errcode == 0) {
						that.datas.content.classify_list = res.data;
						that.datas.content.child_classify = [{
							id: -1,
							name: that.$t('offline_service_project.textContent_8')
						}]
					}
				})
			},
			// 重新请求数据
			resetGetList(){
				this.page = 1;
				this.listData = [];
				this.getProjectList();
			},
			//获取项目
			getProjectList: function() {
				var that = this;
				that.$common.requestData({
					url: '/offline_service/web/index.php?m=project&a=get_list',
					data: {
						page: that.datas.content.pageCurrent,
						pagesize: that.datas.content.show_num,
						classify_id: that.datas.content.classify_id,
						industry_id: that.datas.content.industry_id,
						sort_type: that.datas.content.sort_type
					},
					method: 'POST',
					needToken: false
				}).then(res => {
					if (res.errcode == 0) {
						that.listData = res.data.list
					}
				})
			},
			getLocationUni(){
				let that = this;
				uni.getLocation({
					type: 'wgs84',
					success: function (res) {
						var latitude = res.latitude
						var longitude = res.longitude
						var request_data = {
							type: 'mini_program',
							latitude: latitude,
							longitude: longitude
						}
						that.latitude = latitude;
						that.longitude = longitude;
						
						that.$common.requestData({
							url: '/offline_service/web/index.php?m=common&a=get_location',
							data: request_data,
							method: 'POST',
							needToken: false
						}).then(res => {
							if (res.errcode == 0) {
								uni.setStorageSync('os_city_name',res.result.city);
								uni.setStorageSync('os_city_code',res.result.area_code);
								uni.setStorageSync('os_latitude',latitude);
								uni.setStorageSync('os_longitude',longitude);
							}
						})
					}
				})
			},
			
			jump(url){
				this.$common.diyLinkJump(url,"h5",true);
			}
		},
	}
</script>

<style>
	/*分类start*/
	.sort-box .sort-active{
		color: #07C160!important;
	}
	.sort-box .sort-bnt-box{
		display: flex;
		justify-content: center;
		background-color: white;
		padding: 30rpx 0;
	}
	.sort-pop-height{
		height: 100vh!important;
	}
	.sort-pop{
		position: absolute;
		width: 100%;
		z-index: 1;
		top: 98rpx;
		left: 0;
		height: 0;
		overflow: hidden;
		transition: all .3s ease-in-out;
	}
	.sort-new-box{
		position: relative;
		height: 100%;
	}
	.sort-new-mask{
		position: absolute;
		background-color: rgba(0, 0, 0, .5);
		z-index: 1;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
	.sort-new-content{
		position: relative;
		z-index: 5;
	}
	.sort-bnt-box .sort-bnt{
		width: 280rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #07C160;
		border-radius: 50rpx;
		color: white;
	}
	.sort-bnt-box .cancel{
		background-color: #999999!important;
		margin-right: 40rpx;
	}
	.sort-box .first-sort .type-item{
		padding: 25rpx 15rpx;
	}
	.sort-box .first-sort .type-active{
		background-color: white!important;
		color: #07C160!important;
		font-weight: bold;
	}
	.sort-box .type-tag-box .tag-active{
		background-color: #07C160!important;
		color: white!important;
		border-color: #07C160!important;
	}
	.sort-box .type-tag-box .tag-item{
		padding: 12rpx;
		font-size: 26rpx;
		border: 1rpx solid #999999;
		color: #666666;
		margin-bottom: 20rpx;
		margin-right: 20rpx;
		min-width: 80rpx;
		border-radius: 10rpx;
		height: 59rpx;
		text-align: center;
		display: inline-block;
	}
	.sort-box .first-sort{
		width: 100px;
		background-color: #f7f7f7;
		overflow: auto;
		height: 100%;
		border-right: 1rpx solid #e5e5e5;
	}
	.sort-box .type-tag-box{
		padding: 30rpx 0 30rpx 30rpx;
		overflow: auto;
		height: 76%;
		flex: 6;
		flex-direction: column;
	}
	.sort-box .sort-content{
		display: flex;
		height: 480rpx;
		background-color: white;
	}
	.sort-box .sort-tab-box{
		padding: 0 12rpx;
		background-color: white;
		display: flex;
		justify-content: space-between;
		border-bottom: 1rpx solid #e5e5e5;
	}
	.sort-box .sort-title{
		margin-right: 10rpx;
	}
	.sort-box .sort-tab{
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 25rpx;
	}
	.sort-box{
		position: relative;
		padding: 0;
	}
	/*分类end*/
	.offline_service_merchant {
	  font-size: 28rpx;
	  background-color: #f3f3f3;
	}
	.offline_service_merchant .search-box {
	  background-color: white;
	  padding: 30rpx;
	}
	.offline_service_merchant .list-box {
	  padding: 20rpx 30rpx 30rpx;
	}
	.offline_service_merchant .list-box .list-item {
	  display: flex;
	  background-color: white;
	  margin-bottom: 15rpx;
	  border-radius: 20rpx;
	  padding: 25rpx;
	}
	.offline_service_merchant .list-box .list-item .pic-box {
	  margin-right: 20rpx;
	}
	.offline_service_merchant .list-box .list-item .pic-box .poster {
	  width: 165rpx;
	  height: 165rpx;
	  border-radius: 15rpx;
	}
	.offline_service_merchant .list-box .list-item .info-box {
	  height: 150rpx;
	  position: relative;
	  width: 72%;
	}
	.offline_service_merchant .list-box .list-item .info-box .desc,
	.offline_service_merchant .list-box .list-item .info-box .bottom {
	  display: flex;
	  color: #666666;
	  font-size: 26rpx;
	}
	.offline_service_merchant .list-box .list-item .info-box .title {
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  margin-bottom: 5rpx;
	  font-size: 30rpx;
	}
	.offline_service_merchant .list-box .list-item .info-box .person {
	  display: -webkit-box;
	  -webkit-box-orient: vertical;
	  -webkit-line-clamp: 2;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
	.offline_service_merchant .list-box .list-item .info-box .bottom {
	  justify-content: space-between;
	  align-items: center;
	  position: absolute;
	  bottom: -25rpx;
	  left: 0;
	  width: 100%;
	  line-height: 25rpx;
	}
	.offline_service_merchant .list-box .list-item .info-box .bottom .left-box {
	  display: flex;
	}
	.offline_service_merchant .list-box .list-item .info-box .bottom .price {
	  font-size: 30rpx;
	  color: #07C160;
	}
	.offline_service_merchant .list-box .list-item .info-box .bottom .price text {
	  font-size: 24rpx;
	}
	.offline_service_merchant .list-box .list-item .info-box .bottom .time {
	  font-size: 24rpx;
	  display: flex;
	  align-items: center;
	  margin-left: 20rpx;
	}
	.offline_service_merchant .list-box .list-item .info-box .bottom .time .time-icon {
	  width: 24rpx;
	  height: 24rpx;
	  margin-right: 7rpx;
	}
	.offline_service_merchant .list-box .list-item .info-box .bottom .choose-bnt {
	  background: linear-gradient(180deg, #07C160 0%, #07C160 100%);
	  color: white;
	  padding: 14rpx 20rpx;
	  border-radius: 10rpx;
	  text-align: center;
	  font-size: 24rpx;
	  line-height: 24rpx;
	}
	.offline_service_merchant .empty {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  flex-direction: column;
	  color: rgb(119, 119, 119);
	}
	.offline_service_merchant .empty .empty-image {
	  width: 260rpx;
	  height: 200rpx;
	}

</style>
