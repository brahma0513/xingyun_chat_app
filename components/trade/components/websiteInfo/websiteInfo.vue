<template>
	<view>
		<view class='block'></view>
		<view class='address_arrt_list'>
			<view class='address_arrt' v-for="(item,index) in company_data" :key="index">
				<view class='address_left'>{{item.key}}：</view>
				<view class='address_right'>{{item.value}}</view>
			</view>
			<view class='map_box'>
				<view id="amap" :markers="markers" class="my-map" 
				:change:markers="amap.updateMarker"></view>
				<!-- <map id="myMap" :class="'myMap ' + (status==0?'':'display_none')" 
			:longitude="markers[0].longitude" :latitude="markers[0].latitude" scale="12" 
			:markers="markers" @click='toMap' style="height: 300rpx;"></map> -->
			</view>
			<view :class="'map_beijing_box ' +(status==0?'display_none':'')">
				<view class='map_beijing'></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "websiteInfo",
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
				status: 0,
				// markers: [{
				// 	iconPath: '/website/web/static/images/map_icon.png',
				// 	id: 0,
				// 	latitude: 0,
				// 	longitude: 0,
				// 	width: 50,
				// 	height: 50,
				// 	company_name: "",
				// 	company_address: ""
				// }],
				company_data: [],
				markers: [],
				mapDefaultOptions: {
					center: [108.939621, 34.343147],
					zoom: 10,
					resizeEnable: true, //窗口大小调整
				}
			};
		},
		created() {
			var that=this;
			this.http_host = this.vuex_apiUrl;
			that.get_list();
			that.company_data = that.datas.content.dataset;
		},
		methods: {
			get_list() {
				const that = this
				that.$common.requestData({
					url: '/website/web/index.php?m=website_index&a=get_index_data',
					data: {
						type: 'company'
					},
					method: "POST",
					needToken: false,
				}).then(res => {
					if (res.errcode == 0) {
						//获取经纬度
						var jwd = res.data.long_lat.split(",");
						that.company_address = res.data.address_info;
						that.company_name = res.data.name;
						that.company_data = res.data.mess;
						that.longitude = jwd[0];
						that.latitude = jwd[1];
						that.markers = [{
							weight: 8,
							lnglat: jwd
						}]
						
						var show_data = [];
						for(var i=0;i<that.company_data.length;i++){
							for(var j=0;j<res.data.mess.length;j++){
								if(that.company_data[i]['key']==res.data.mess[j]['key']){
									that.company_data[i]['value'] = res.data.mess[j]['value']
								}
							}
						}
						that.init_title();
						
						// var gg_mark = that.markers;
						// gg_mark[0].longitude = jwd[0];
						// gg_mark[0].latitude = jwd[1];
						// gg_mark[0].iconPath = that.http_host + "/website/web/static/images/map_icon.png";

						// that.markers = gg_mark
						// that.company_address = res.data.address_info
						// that.company_name = res.data.name
						// console.log("获取经纬度==", that.markers[0].longitude)
						// that.company_data = res.data.mess
					}
				})
			},
			toMap() {
				var that = this;
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
			//字体间距调整
			init_title() {
				var that = this;
				var data = that.datas.content.dataset;
				for (var i = 0; i < data.length; i++) {
					var title = data[i].key;
					if (title.length == 2) {
						data[i].key = title[0] + "       " + title[1]
					} else if (title.length == 3) {
						data[i].key = title[0] + "  " + title[1] + "  " + title[2]
					} else {
						data[i].key = title;
					}
				}
				that.company_data = data
			}
		}
	}
</script>
<script module="amap" lang="renderjs">
	let map = undefined,
		cluster = undefined;
	export default {
		data() {
			return {
				isMapLoadSuccess: false,
				http_host: this.vuex_apiUrl,
			}
		},
		mounted() {
			// 清除地图数据
			this.reset();
			// 注意：异步回调函数的声明应该在 JSAPI 引入之前，函数名与callback=onLoad中对应
			if (!window.isOnRady) {
				window.isOnRady = () => {
					this.init();
				};
			} else {
				this.init();
			}
			// 异步加载高德地图 JSAPI 
			if (!window.AMap) {
				this.loadAMap();
			}
		},
		methods: {
			// 异步加载高德地图 JSAPI 
			loadAMap() {
				// 动态异步引入较大类库避免影响页面展示
				const myKey = '9a83bb5b65aa19d198dcc90054eb1e0d';
				const myCode = "017d3cad28534bdd902b5138b099d3c3";
				const url = `https://webapi.amap.com/maps?v=2.0&key=${myKey}&callback=isOnRady`;
				const jsapi = document.createElement('script');
				jsapi.charset = 'utf-8';
				jsapi.src = url;
				document.head.appendChild(jsapi);
				// 安全密钥
				window._AMapSecurityConfig = {
					securityJsCode: myCode,
				};
			},
			// 初始化
			init() {
				map = new AMap.Map('amap', this.mapDefaultOptions);
				map.on('complete', () => {
					// console.log('地图加载完成');
					this.isMapLoadSuccess = true;
					this.initMarkers();
				})
			},
			// 地图相关数据初始化
			reset() {
				map && (map = undefined);
				// 如果有之前的数据,先清除
				if (cluster) {
					// console.log('清除点聚合');
					cluster.setMap(null);
					cluster = undefined;
				}
			},
			// 生成点聚合点位
			initMarkers() {
				// 添加判断，防止地图没有加载完成就渲染
				if (!(this.isMapLoadSuccess && this.markers.length)) {
					return
				}
				// 根据官方示例数据形式
				const point = this.markers;
				// 先调整地图中心点
				const center = point[0].lnglat || this.mapDefaultOptions.center;
				map.setCenter(center);
				// 加载点聚合插件
				map.plugin(["AMap.MarkerCluster"], () => {
					cluster = new AMap.MarkerCluster(map, point, {
						gridSize: 80, // 聚合网格像素大小
						renderClusterMarker: (context) => { // 对聚合点位的渲染
							// 设置聚合点位点击事件
							const marker = context.marker;
							marker.on('click', (e) => {
								let mapZoom = map.getZoom();
								if (mapZoom < 20) {
									mapZoom += 2;
								}
								map.setZoomAndCenter(mapZoom, e.lnglat);
							})
						},
						renderMarker: ({
							data,
							marker
						}) => { // 对非聚合点位的渲染
							// console.log(context);  // 入参中有四个数据 count data indexs marker
							// 获取自己设置的name
							if (data[0].extData) {
								console.log(data[0].extData.name);
							}
							marker.setIcon(this.creatAMapIcon());
							marker.setAnchor('bottom-center');
							// 设置非聚合点位点击事件
							marker.on('click', (e) => {
								map.setCenter(e.lnglat);
								this.tapMarker(e);
							})
						}
					});
				});
			},
			// 更新数据
			updateMarker(newVal) {
				console.log('renderjs 更新:', newVal.length);
				this.initMarkers();
			},
			// 生成高德地图Icon
			creatAMapIcon() {
				let that = this;
				const iconOptions = {
					image: that.http_host + "/website/web/static/images/map_icon.png",
					imageSize: new AMap.Size(35, 35)
				}
				return new AMap.Icon(iconOptions);
			},
			
			// 非聚合marker点击事件
			tapMarker(marker) {
				this.$ownerInstance.callMethod('toMap',{})
			}
		},
	}
</script>
<style>
	.block {
		height: 20rpx;
	}

	.my-map {
		width: 100%;
		margin: auto;
		height: 460rpx;
	}

	.address_arrt_list {
		background: #fff;
	}

	.address_arrt {
		width: 100%;
		min-height: 96rpx;
		font-size: 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #e6e6e6;
	}

	.address_left {
		margin-left: 30rpx;
		white-space: pre;
	}

	.address_right {
		width: 500rpx;
		color: #5f5f5f;
		/* 2/3 */
		/* text-align: right; */
		margin-right: 30rpx;
		padding: 10px 0;
	}

	.map_box {
		padding: 30rpx;
	}

	.map_beijing_box {
		padding: 30rpx;
		width: 690rpx;
		margin: 0 auto;
		height: 460rpx;

	}

	.map_beijing {
		background: #EEE;
		width: 100%;
		height: 100%;
	}

	.display_none {
		display: none;
	}
</style>