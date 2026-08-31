<template>
  <view class="store-fl-container">
    <!-- 商品分类组件 -->
    <view 
      class="product-category-container" 
      :style="{
        paddingTop: paddingTop + 'rpx',
        paddingBottom: paddingBottom + 'rpx',
        paddingLeft: '20rpx',
        paddingRight: '20rpx',
        backgroundColor: bgColor
      }"
    >
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-wrapper">
        <text class="loading-text">加载中...</text>
      </view>
      
      <!-- 分类网格 -->
      <view 
        v-else
        class="category-grid" 
        :class="gridClass"
      >
        <view 
          class="category-item" 
          v-for="(category, categoryIndex) in categories" 
          :key="category.id || categoryIndex"
          @tap="handleCategorySelect(category)"
        >
          <view class="category-icon" :style="iconStyle">
            <image 
              v-if="category.image || category.category_image"
              :src="getImageUrl(category.image || category.category_image)" 
              :alt="category.name || category.category_name"
              mode="aspectFill"
              @error="handleImageError"
              class="category-image"
            />
            <text v-else class="default-icon">🏷️</text>
          </view>
          <text class="category-name">
            {{ category.name || category.category_name }}
          </text>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="!loading && categories.length === 0" class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无分类数据</text>
      </view>
    </view>
    
    <!-- 开发调试面板 -->
    <view v-if="debugMode" class="debug-panel">
      <view class="debug-header" @tap="toggleDebugPanel">
        <text class="debug-title">🏷️ 分类组件调试面板</text>
        <text class="debug-toggle">{{ debugPanelVisible ? '收起' : '展开' }}</text>
      </view>
      
      <view v-if="debugPanelVisible" class="debug-content">
        <!-- 组件状态 -->
        <view class="debug-section">
          <text class="debug-section-title">📊 组件状态</text>
          <view class="debug-item">
            <text class="debug-label">加载状态:</text>
            <text class="debug-value" :class="{ 'loading': loading }">{{ loading ? '加载中...' : '已完成' }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">分类数量:</text>
            <text class="debug-value">{{ categories.length }} 个</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">列数设置:</text>
            <text class="debug-value">{{ columns }} 列</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">背景颜色:</text>
            <text class="debug-value">{{ bgColor }}</text>
          </view>
        </view>
        
        <!-- 位置信息 -->
        <view class="debug-section">
          <text class="debug-section-title">📍 位置信息</text>
          <view class="debug-item">
            <text class="debug-label">纬度:</text>
            <text class="debug-value">{{ latitude || '未获取' }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">经度:</text>
            <text class="debug-value">{{ longitude || '未获取' }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">当前城市:</text>
            <text class="debug-value">{{ currentCity ? (currentCity.area_name || currentCity) : '未获取' }}</text>
          </view>
        </view>
        
        <!-- 店铺信息 -->
        <view class="debug-section">
          <text class="debug-section-title">🏪 店铺信息</text>
          <view class="debug-item">
            <text class="debug-label">配置店铺ID:</text>
            <text class="debug-value">{{ shopId || '无' }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">最近店铺ID:</text>
            <text class="debug-value">{{ nearestShop ? nearestShop.id : '未获取' }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">最近店铺名:</text>
            <text class="debug-value">{{ nearestShop ? nearestShop.shop_name : '未获取' }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">地图Key:</text>
            <text class="debug-value">{{ mapKey ? '已获取' : '未获取' }}</text>
          </view>
        </view>
        
        <!-- 配置信息 -->
        <view class="debug-section">
          <text class="debug-section-title">⚙️ 配置信息</text>
          <view class="debug-item">
            <text class="debug-label">显示数量:</text>
            <text class="debug-value">{{ showNum }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">上边距:</text>
            <text class="debug-value">{{ paddingTop }}rpx</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">下边距:</text>
            <text class="debug-value">{{ paddingBottom }}rpx</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">图标大小:</text>
            <text class="debug-value">{{ iconStyle.width }}</text>
          </view>
        </view>
        
        <!-- 分类数据预览 -->
        <view v-if="categories.length > 0" class="debug-section">
          <text class="debug-section-title">🗂️ 分类数据 (前3个)</text>
          <view v-for="(category, index) in categories.slice(0, 3)" :key="index" class="debug-category">
            <view class="debug-item">
              <text class="debug-label">{{ index + 1 }}. {{ category.name }}:</text>
              <text class="debug-value">ID: {{ category.id }}</text>
            </view>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="debug-section">
          <text class="debug-section-title">🔧 调试操作</text>
          <view class="debug-actions">
            <button class="debug-btn" @tap="debugRefreshData">刷新数据</button>
            <button class="debug-btn" @tap="debugClearData">清空数据</button>
            <button class="debug-btn" @tap="debugShowData">查看原始数据</button>
            <button class="debug-btn" @tap="debugTestRequest">测试请求</button>
          </view>
        </view>
        
        <!-- 最近的API日志 -->
        <view v-if="debugLogs.length > 0" class="debug-section">
          <text class="debug-section-title">📝 API日志 (最近10条)</text>
          <view v-for="(log, index) in debugLogs.slice(-10)" :key="index" class="debug-log">
            <text class="debug-log-time">{{ log.time }}</text>
            <text class="debug-log-type" :class="log.type">{{ log.type }}</text>
            <text class="debug-log-msg">{{ log.message }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'StoreFl',
  props: {
    datas: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      categories: [],
      loading: false,
      latitude: null,
      longitude: null,
      currentCity: null,
      mapKey: null,
      nearestShop: null,
      http_host: '', // 当前域名，用于图片路径加速
      // 调试面板相关
      debugMode: false, // 开发时设为true，上线时设为false
      debugPanelVisible: false,
      debugLogs: []
    }
  },
  computed: {
    // 上边距
    paddingTop() {
      return this.datas.content.category_padding_top !== undefined 
        ? this.datas.content.category_padding_top 
        : (this.datas.content.category_padding || 30)
    },
    // 下边距
    paddingBottom() {
      return this.datas.content.category_padding_bottom !== undefined 
        ? this.datas.content.category_padding_bottom 
        : (this.datas.content.category_padding || 30)
    },
    // 背景颜色
    bgColor() {
      return this.datas.content.category_bg_color || '#ffffff'
    },
    // 列数
    columns() {
      return Math.max(3, Math.min(6, this.datas.content.category_columns || 5))
    },
    // 网格类名
    gridClass() {
      return `category-columns-${this.columns}`
    },
    // 图标样式
    iconStyle() {
      let size = 100
      if (this.columns >= 6) size = 80
      else if (this.columns === 5) size = 90
      
      return {
        width: size + 'rpx',
        height: size + 'rpx'
      }
    },
    // 显示数量
    showNum() {
      return Math.max(1, this.datas.content.category_show_num || 10)
    },
    // 店铺ID
    shopId() {
      return this.nearestShop.id || 0
    }
  },
  created() {
    var that = this;
    that.http_host = that.vuex_apiUrl;
    that.initComponent();
  },
  methods: {
    // 获取完整的图片URL
    getImageUrl(imageUrl) {
      var that = this;
      if (!imageUrl) return '';
      
      // 如果已经是完整URL，直接返回
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      
      // 添加域名前缀
      return that.http_host + imageUrl;
    },
    
    // 初始化组件
    initComponent() {
      var that = this;
      console.log("StoreFl组件初始化，配置:", that.datas.content);
      
      
      // // 如果配置中已有数据，直接使用
      // if (that.datas.content.dataset && that.datas.content.dataset.length > 0) {
      //   that.categories = that.datas.content.dataset.slice(0, that.showNum);
      //   return;
      // }
      
      // 自动加载数据
      that.loadCategoryData();
    },
    
    // 加载分类数据
    loadCategoryData() {
      var that = this;
      that.loading = true;
      console.log("开始加载商品分类数据");
      
      // 获取地图key
      that.getMapKey().then(function(mapKey) {
        console.log("商品分类组件：地图key准备就绪，开始获取位置数据");
        that.getLocationData().then(function() {
          // 获取最近的店铺
          that.getNearestShop().then(function(shopData) {
            // 加载分类数据
            that.fetchCategories().then(function() {
              that.loading = false;
            }).catch(function(error) {
              console.error("获取分类数据失败:", error);
              that.categories = [];
              that.loading = false;
            });
          }).catch(function(error) {
            console.error("获取店铺失败:", error);
            that.categories = [];
            that.loading = false;
          });
        }).catch(function(error) {
          console.error("获取位置失败:", error);
          that.categories = [];
          that.loading = false;
        });
      }).catch(function(error) {
        console.error("获取地图key失败:", error);
        that.categories = [];
        that.loading = false;
      });
    },
    
    // 获取地图key
    getMapKey() {
      var that = this;
      return new Promise(function(resolve, reject) {
        // 如果已经有key了，直接返回
        if (that.mapKey) {
          that.debugMode && that.addDebugLog('info', '使用缓存的地图key');
          resolve(that.mapKey);
          return;
        }
        
        that.debugMode && that.addDebugLog('info', '开始请求地图key');
        
        // 发起请求获取地图key
        that.$common.requestData({
          url: "/alliance_store/web/index.php?m=alliance_module&a=get_map_key",
          data: {},
          method: 'POST',
          needToken: false
        }).then(function(res) {
          if (res.errcode == 0) {
            that.mapKey = res.data;
            console.log("商品分类组件：获取地图key成功:", that.mapKey);
            that.debugMode && that.addDebugLog('success', '地图key请求成功: ' + that.mapKey);
            resolve(that.mapKey);
          } else {
            console.log("商品分类组件：获取地图key失败:", res);
            that.debugMode && that.addDebugLog('warning', '地图key请求失败，尝试使用备用key');
            // 尝试使用配置中的备用key
            that.mapKey = that.datas.content.map_key || null;
            if (that.mapKey) {
              resolve(that.mapKey);
            } else {
              that.debugMode && that.addDebugLog('error', '没有可用的地图key');
              reject(new Error("获取地图key失败"));
            }
          }
        }).catch(function(error) {
          console.log("商品分类组件：获取地图key请求失败:", error);
          that.debugMode && that.addDebugLog('error', '地图key请求异常: ' + error.message);
          // 尝试使用配置中的备用key
          that.mapKey = that.datas.content.map_key || null;
          if (that.mapKey) {
            resolve(that.mapKey);
          } else {
            reject(error);
          }
        });
      })
    },
    
    // 获取位置数据
    getLocationData() {
      var that = this;
      return new Promise(function(resolve, reject) {
        try {
          // 尝试从本地存储获取位置信息
          var latitude = uni.getStorageSync("latitude");
          var longitude = uni.getStorageSync("longitude");
          var currentCity = uni.getStorageSync('current_city');
          
          that.latitude = latitude || null;
          that.longitude = longitude || null;
          that.currentCity = currentCity || null;
          
          console.log("位置数据:", {
            latitude: that.latitude,
            longitude: that.longitude,
            currentCity: that.currentCity
          });

          that.debugMode && that.addDebugLog('info', '位置数据:', {
            latitude: that.latitude,
            longitude: that.longitude,
            currentCity: that.currentCity
          });
          
          if (that.latitude && that.longitude) {
            that.debugMode && that.addDebugLog('success', '位置数据获取成功');
            resolve();
          } else {
            // 如果没有位置信息，可以触发定位
            that.getCurrentLocation().then(function() {
              resolve();
            }).catch(function(error) {
              reject(error);
            });
          }
        } catch (error) {
          console.error("获取位置数据失败:", error);
          reject(error);
        }
      })
    },
    
    // 获取当前位置（与 cp_list 定位方式保持一致）
    getCurrentLocation() {
      var that = this;
      return new Promise(function(resolve, reject) {
        console.log('分类组件：开始获取位置信息...');
        that.debugMode && that.addDebugLog('info', '开始获取当前位置');
        
        // #ifdef H5
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              that.latitude = position.coords.latitude;
              that.longitude = position.coords.longitude;
              console.log('分类组件：H5位置获取成功:', { lat: that.latitude, lng: that.longitude });
              that.debugMode && that.addDebugLog('success', 'H5定位成功: ' + that.latitude + ', ' + that.longitude);
              
              // 保存到本地存储
              uni.setStorageSync("latitude", that.latitude);
              uni.setStorageSync("longitude", that.longitude);
              
              resolve();
            },
            function(error) {
              console.log('分类组件：H5定位失败:', error);
              that.debugMode && that.addDebugLog('warning', 'H5定位失败，继续后续流程');
              // 失败时不阻塞，直接进入后续流程
              resolve();
            }
          );
        } else {
          console.log('分类组件：浏览器不支持定位');
          that.debugMode && that.addDebugLog('warning', '浏览器不支持定位');
          resolve();
        }
        // #endif
        
        // #ifndef H5
        uni.getLocation({
          type: 'wgs84',
          success: function (res) {
            that.latitude = res.latitude;
            that.longitude = res.longitude;
            console.log('分类组件：uni-app位置获取成功:', { lat: that.latitude, lng: that.longitude });
            that.debugMode && that.addDebugLog('success', 'uni-app定位成功: ' + that.latitude + ', ' + that.longitude);
            
            // 保存到本地存储
            uni.setStorageSync("latitude", that.latitude);
            uni.setStorageSync("longitude", that.longitude);
            
            resolve();
          }, 
          fail: function (err) {
            console.log('分类组件：uni-app定位失败:', err);
            that.debugMode && that.addDebugLog('warning', 'uni-app定位失败，继续后续流程');
            // 失败时不弹窗阻塞，直接进入后续流程
            resolve();
          }
        });
        // #endif
      })
    },
    
    // 获取最近的店铺
    getNearestShop() {
      var that = this;
      return new Promise(function(resolve, reject) {
        console.log("商品分类组件：开始获取官方店铺");
        console.log("商品分类组件：发送给后端的城市信息:", that.currentCity);
        that.debugMode && that.addDebugLog('info', '开始获取最近店铺');
        
        that.$common.requestData({
          url: "/alliance_store/web/index.php?m=alliance_module&a=get_location",
          data: {
            "location": {
              "type": "wechat",
              "current_city": that.currentCity,
              "lat": that.latitude,
              "lng": that.longitude
            }
          },
          method: 'POST',
          needToken: false
        }).then(function(res) {
          console.log("商品分类组件：后端返回结果:", res);
          if (res.errcode == 0) {
            console.log("商品分类组件：获取到最近店铺:", res.data);
            that.debugMode && that.addDebugLog('success', '获取最近店铺成功: ' + (res.data.shop_name || res.data.id));
            
            // 保存店铺信息
            that.nearestShop = res.data;
            
            // 如果后端返回了完整的城市信息，更新本地存储
            if (res.data.city_info && res.data.city_info.area_code) {
              var cityInfo = {
                area_code: res.data.city_info.area_code,
                area_name: res.data.city_info.area_name || res.data.city_info.city_name || that.currentCity
              };
              that.currentCity = cityInfo;
              uni.setStorageSync("current_city", cityInfo);
              console.log("商品分类组件：更新本地城市信息:", cityInfo);
            }
            
            resolve(res.data);
          } else {
            console.log("商品分类组件：获取店铺失败:", res.errmsg);
            that.debugMode && that.addDebugLog('error', '获取店铺失败: ' + res.errmsg);
            reject(new Error("获取店铺失败"));
          }
        }).catch(function(error) {
          console.log("商品分类组件：请求失败", error);
          that.debugMode && that.addDebugLog('error', '店铺请求异常: ' + error);
          reject(error);
        });
      })
    },
    
    // 获取分类数据
    fetchCategories() {
      var that = this;
      return new Promise(function(resolve, reject) {
        console.log("商品分类组件：获取商品分类, shop_id:", that.nearestShop.id);
        that.debugMode && that.addDebugLog('info', '商品分类组件：获取商品分类, shop_id:' + that.nearestShop.id);
        
        // 如果没有店铺ID，使用默认数据
        if (!that.nearestShop.id) {
          console.log("商品分类组件：没有店铺ID，使用默认数据");
          that.debugMode && that.addDebugLog('warning', '没有店铺ID，使用默认分类数据');
          that.categories = that.getDefaultCategories();
          resolve();
          return;
        }
        
        var shopId = that.nearestShop.id;
        
        that.$common.requestData({
          url: "/alliance_store/web/index.php?m=alliance_module&a=get_product_category",
          data: {
            "shop_id": shopId,
            "limit": that.showNum
          },
          method: 'POST',
          needToken: false
        }).then(function(res) {
          console.log("商品分类组件：获取商品分类成功:", res);
          if (res.errcode == 0) {
            console.log("商品分类组件：获取商品分类数据:", res.data);
            that.debugMode && that.addDebugLog('success', '商品分类组件：分类数据获取成功，共 ' + (res.data ? res.data.length : 0) + ' 个分类');
            
            // 处理分类数据，适配组件显示格式
            var categories = res.data || [];
            var dataset = [];
            
            // 确保不超过显示数量限制
            var maxShowNum = parseInt(that.showNum) || 10;
            var actualShowNum = Math.min(categories.length, maxShowNum);
            
            for (var i = 0; i < actualShowNum; i++) {
              var category = categories[i];
              dataset.push({
                id: category.id,
                name: category.category_name || category.name,
                category_name: category.category_name,
                image: category.category_image || category.image,
                category_image: category.category_image,
                url: category.category_image || category.image,
                shop_id: category.shop_id || shopId,
                sort: category.sort,
                status: category.status
              });
            }
            that.debugMode && that.addDebugLog('success', '商品分类组件：处理后的分类数据:' + dataset);
            that.categories = dataset;
            console.log("商品分类组件：处理后的分类数据:", that.categories);

            resolve();
          } else {
            console.log("商品分类组件：获取商品分类失败:", res.errmsg);
            that.debugMode && that.addDebugLog('error', '分类数据获取失败: ' + res.errmsg);
            // 使用默认数据作为备用
            that.categories = that.getDefaultCategories();
            resolve();
          }
        }).catch(function(error) {
          console.log("商品分类组件：获取商品分类请求失败:", error);
          that.debugMode && that.addDebugLog('error', '分类请求异常: ' + error.message);
          // 使用默认数据作为备用
          that.categories = that.getDefaultCategories();
          resolve();
        });
      })
    },
    
    // 处理分类选择
    handleCategorySelect(category) {
      var that = this;
      console.log("选择分类:", category);
      
      // 触发自定义事件
      that.$emit('category-select', category);
      
      // 页面跳转逻辑
      that.navigateToCategory(category);
    },
    
    // 导航到分类页面
    navigateToCategory(category) {
      var that = this;
      var url = "/alliance_store/web/index.php?m=index&a=index#/pages/index/cp_list?category_id=" + category.id + "&shop_id=" + (category.shop_id || that.shopId);
      that.jump(url);
    },
    
    // 页面跳转
    jump(url) {
      var that = this;
      that.$common.diyLinkJump(url, "h5", true);
    },
    
    // 图片加载错误处理
    handleImageError(e) {
      console.log("图片加载失败:", e)
      // uni-app中图片错误处理
    },
    
    // 刷新数据
    refresh() {
      this.categories = []
      this.loadCategoryData()
    },
    
    // 设置分类数据
    setCategories(categories) {
      this.categories = categories.slice(0, this.showNum)
    },
    
    // 获取默认分类数据
    getDefaultCategories() {
      var that = this;
      var defaultCategories = [
        {
          id: 1,
          name: "水果蔬菜",
          category_name: "水果蔬菜",
          image: "",
          category_image: "",
          shop_id: that.shopId
        },
        {
          id: 2,
          name: "肉禽蛋类",
          category_name: "肉禽蛋类", 
          image: "",
          category_image: "",
          shop_id: that.shopId
        },
        {
          id: 3,
          name: "海鲜水产",
          category_name: "海鲜水产",
          image: "",
          category_image: "",
          shop_id: that.shopId
        },
        {
          id: 4,
          name: "粮油面点",
          category_name: "粮油面点",
          image: "",
          category_image: "",
          shop_id: that.shopId
        },
        {
          id: 5,
          name: "家电百货",
          category_name: "家电百货",
          image: "",
          category_image: "",
          shop_id: that.shopId
        }
      ];
      
      return defaultCategories.slice(0, that.showNum);
    },
    
    // ===== 调试面板相关方法 =====
    
    // 切换调试面板显示状态
    toggleDebugPanel() {
      var that = this;
      that.debugPanelVisible = !that.debugPanelVisible;
      that.addDebugLog('info', '调试面板' + (that.debugPanelVisible ? '展开' : '收起'));
    },
    
    // 添加调试日志
    addDebugLog(type, message) {
      var that = this;
      var time = new Date().toLocaleTimeString();
      that.debugLogs.push({
        time: time,
        type: type,
        message: message
      });
      // 保持最多20条日志
      if (that.debugLogs.length > 20) {
        that.debugLogs.shift();
      }
    },
    
    // 刷新数据
    debugRefreshData() {
      var that = this;
      that.addDebugLog('info', '手动刷新分类数据');
      that.refresh();
    },
    
    // 清空数据
    debugClearData() {
      var that = this;
      that.categories = [];
      that.nearestShop = null;
      that.mapKey = null;
      that.addDebugLog('warning', '清空组件数据');
      uni.showToast({
        title: '数据已清空',
        icon: 'success'
      });
    },
    
    // 查看原始数据
    debugShowData() {
      var that = this;
      var data = {
        categories: that.categories,
        config: that.datas.content,
        nearestShop: that.nearestShop,
        location: {
          latitude: that.latitude,
          longitude: that.longitude,
          currentCity: that.currentCity
        },
        computed: {
          columns: that.columns,
          showNum: that.showNum,
          shopId: that.shopId,
          iconStyle: that.iconStyle
        }
      };
      console.log('StoreFl组件原始数据:', data);
      that.addDebugLog('info', '原始数据已输出到控制台');
      uni.showModal({
        title: '原始数据',
        content: '数据已输出到控制台，请按F12查看',
        showCancel: false
      });
    },
    
    // 测试请求
    debugTestRequest() {
      var that = this;
      that.addDebugLog('info', '开始测试API请求');
      
      // 测试地图key请求
      that.getMapKey().then(function(mapKey) {
        that.addDebugLog('success', '地图key请求成功: ' + mapKey);
        
        // 测试位置信息
        that.getLocationData().then(function() {
          that.addDebugLog('success', '位置信息获取成功');
          
          // 测试店铺请求
          that.getNearestShop().then(function(shopData) {
            that.addDebugLog('success', '店铺请求成功: ' + (shopData.shop_name || shopData.id));
            
            // 测试分类请求
            that.fetchCategories().then(function() {
              that.addDebugLog('success', '分类数据请求成功');
              uni.showToast({
                title: '测试完成',
                icon: 'success'
              });
            }).catch(function(error) {
              that.addDebugLog('error', '分类数据请求失败: ' + error.message);
            });
          }).catch(function(error) {
            that.addDebugLog('error', '店铺请求失败: ' + error.message);
          });
        }).catch(function(error) {
          that.addDebugLog('error', '位置信息获取失败: ' + error.message);
        });
      }).catch(function(error) {
        that.addDebugLog('error', '地图key请求失败: ' + error.message);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
/* 商品分类组件样式 */
.store-fl-container {
  width: 100%;
}

.product-category-container {
  background-color: #ffffff;
  margin-bottom: 20rpx;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
}

/* 不同列数的布局 */
.category-columns-3 .category-item {
  width: 30%;
  margin-bottom: 40rpx;
}

.category-columns-4 .category-item {
  width: 22%;
  margin-bottom: 40rpx;
}

.category-columns-5 .category-item {
  width: 18%;
  margin-bottom: 40rpx;
}

.category-columns-6 .category-item {
  width: 15%;
  margin-bottom: 30rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.category-icon {
  border-radius: 16rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 2rpx solid #e9ecef;
  position: relative;
  margin-bottom: 16rpx;
}

.category-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.default-icon {
  font-size: 48rpx;
  user-select: none;
}

.category-name {
  font-size: 24rpx;
  color: #333333;
  line-height: 1.2;
  text-align: center;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* 加载状态 */
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999999;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
}

.empty-icon {
  font-size: 60rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

/* 调试面板样式 */
.debug-panel {
  position: fixed;
  bottom: 20rpx;
  left: 20rpx;
  max-width: 600rpx;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 16rpx;
  z-index: 9999;
  font-size: 24rpx;
  color: #fff;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.debug-title {
  font-weight: bold;
  color: #FF9800;
}

.debug-toggle {
  color: #2196F3;
  font-size: 22rpx;
}

.debug-content {
  max-height: 800rpx;
  overflow-y: scroll;
  padding: 20rpx;
}

.debug-section {
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.debug-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.debug-section-title {
  display: block;
  font-weight: bold;
  color: #FFC107;
  margin-bottom: 16rpx;
  font-size: 26rpx;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.debug-label {
  color: #B3B3B3;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.debug-value {
  color: #fff;
  text-align: right;
  word-break: break-all;
  flex: 1;
}

.debug-value.loading {
  color: #FF9800;
}

.debug-category {
  margin-bottom: 8rpx;
}

.debug-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.debug-btn {
  background: #2196F3;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  font-size: 22rpx;
  line-height: 1;
}

.debug-btn:hover {
  background: #1976D2;
}

.debug-log {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12rpx;
  font-size: 20rpx;
  line-height: 1.3;
}

.debug-log-time {
  color: #B3B3B3;
  margin-right: 12rpx;
  flex-shrink: 0;
  min-width: 120rpx;
}

.debug-log-type {
  margin-right: 12rpx;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  font-size: 18rpx;
  flex-shrink: 0;
}

.debug-log-type.info {
  background: #2196F3;
  color: #fff;
}

.debug-log-type.success {
  background: #4CAF50;
  color: #fff;
}

.debug-log-type.warning {
  background: #FF9800;
  color: #fff;
}

.debug-log-type.error {
  background: #F44336;
  color: #fff;
}

.debug-log-msg {
  color: #fff;
  flex: 1;
  word-break: break-all;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .category-columns-5 .category-item {
    width: 19%;
  }
  
  .category-columns-6 .category-item {
    width: 16%;
  }
  
  .debug-panel {
    max-width: 500rpx;
    left: 10rpx;
    bottom: 10rpx;
  }
  
  .debug-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 320px) {
  .category-columns-5 .category-item {
    width: 19.5%;
  }
  
  .category-columns-6 .category-item {
    width: 16.2%;
  }
}
</style>