<template>
  <view class="store-cp-container">
    <!-- 商品列表组件 -->
    <view 
      class="product-list-container" 
      :style="{
        paddingTop: paddingTop + 'rpx',
        paddingBottom: paddingBottom + 'rpx',
        paddingLeft: '0rpx',
        paddingRight: '0rpx'
      }"
    >
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-wrapper">
        <text class="loading-text">加载中...</text>
      </view>
      
      <!-- 商品网格 -->
      <view 
        v-else
        class="custom-goods" 
        :class="layoutClass"
      >
        <view 
          class="product-item" 
          :class="`type${layoutType}`"
          v-for="(product, productIndex) in products" 
          :key="product.id || productIndex"
          @tap="handleProductSelect(product)"
        >
          <!-- 商品图片 -->
          <view class="img">
            <image 
              :src="getImageUrl(product.is_first_img || product.image)" 
              :style="imageStyle"
              mode="aspectFill"
              @error="handleImageError"
              class="product-image"
            />
          </view>
          
          <!-- Type 2: 现代化卡片布局 -->
          <template v-if="layoutType == 2">
            <text 
              v-if="config.pro_title_show == 1" 
              class="goods-title" 
              :class="`line-${config.pro_title_line || 2}`"
            >
              {{ product.name }}
            </text>

            <!-- 销量和积分信息 -->
            <view 
              v-if="config.show_sale == 1 || product.integral_quantity" 
              class="product-sales"
            >
              <text 
                v-if="config.show_sale == 1 && product.sell_count > 0" 
                class="product-sales-text"
              >
                已售：{{ product.sell_count }}
              </text>
              <text 
                v-if="product.integral_quantity > 0" 
                class="product-sales-text"
              >
                送积分：{{ product.integral_quantity }}
              </text>
            </view>

            <!-- 价格信息 -->
            <view class="current-price price-skin-color">
              <view class="price-left">
                <text class="big">{{ product.now_price }}</text>
                <text class="unit">元</text>
                <text 
                  v-if="product.orgin_price && product.orgin_price != product.now_price" 
                  class="original-price"
                >
                  ¥{{ product.orgin_price }}
                </text>
              </view>
              <view 
                class="add-cart-btn" 
                @tap.stop="addToCart(product)"
              >
                <text class="add-icon">+</text>
              </view>
            </view>
          </template>
          
          <!-- Type 1: 横向布局 -->
          <template v-else-if="layoutType == 1">
            <view class="product-info">
              <text 
                v-if="config.pro_title_show == 1" 
                class="goods-title" 
                :class="`line-${config.pro_title_line || 2}`"
              >
                {{ product.name }}
              </text>

              <view class="product-bottom">
                <view class="price-info">
                  <view class="current-price price-skin-color">
                    <text class="big">{{ product.now_price }}</text>
                    <text class="unit">元</text>
                  </view>
                  <view 
                    v-if="product.orgin_price && product.orgin_price != product.now_price" 
                    class="current-price price-skin-color"
                  >
                    <text class="original-label">原价：</text>
                    <text class="original-price">{{ product.orgin_price }}</text>
                    <text class="unit">元</text>
                  </view>
                  <view 
                    v-if="config.show_sale == 1" 
                    class="current-price price-skin-color"
                  >
                    <text class="small">销量：{{ product.sell_count }}</text>
                  </view>
                </view>
                <view 
                  class="add-cart-btn" 
                  @tap.stop="addToCart(product)"
                >
                  <text class="add-icon">+</text>
                </view>
              </view>
            </view>
          </template>
          
          <!-- Type 3: 三列布局 -->
          <template v-else-if="layoutType == 3">
            <text 
              v-if="config.pro_title_show == 1" 
              class="goods-title" 
              :class="`line-${config.pro_title_line || 2}`"
            >
              {{ product.name }}
            </text>

            <view class="product-bottom-compact">
              <view class="price-info-compact">
                <view class="current-price price-skin-color">
                  <text class="big">{{ product.now_price }}</text>
                  <text class="unit">元</text>
                </view>
                <view 
                  v-if="product.orgin_price && product.orgin_price != product.now_price" 
                  class="current-price price-skin-color"
                >
                  <text class="original-label">原价：</text>
                  <text class="original-price">{{ product.orgin_price }}</text>
                  <text class="unit">元</text>
                </view>
                <view 
                  v-if="config.show_sale == 1" 
                  class="current-price price-skin-color"
                >
                  <text class="small">销量：{{ product.sell_count }}</text>
                </view>
              </view>
              <view 
                class="add-cart-btn compact" 
                @tap.stop="addToCart(product)"
              >
                <text class="add-icon">+</text>
              </view>
            </view>
          </template>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="!loading && products.length === 0" class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无商品数据</text>
      </view>
    </view>
    
    <!-- 开发调试面板 -->
    <view v-if="debugMode" class="debug-panel">
      <view class="debug-header" @tap="toggleDebugPanel">
        <text class="debug-title">🔧 商品组件调试面板</text>
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
            <text class="debug-label">商品数量:</text>
            <text class="debug-value">{{ products.length }} 个</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">布局类型:</text>
            <text class="debug-value">Type {{ layoutType }}</text>
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
            <text class="debug-value">{{ datas.content.pro_show_num || 10 }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">分类ID:</text>
            <text class="debug-value">{{ datas.content.selector_id || '全部' }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">标题显示:</text>
            <text class="debug-value">{{ config.pro_title_show ? '是' : '否' }}</text>
          </view>
          <view class="debug-item">
            <text class="debug-label">销量显示:</text>
            <text class="debug-value">{{ config.show_sale ? '是' : '否' }}</text>
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
            <button class="debug-btn" @tap="debugTestAddToCart">测试加入购物车</button>
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
  name: 'StoreCp',
  props: {
    datas: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      products: [],
      loading: false,
      latitude: null,
      longitude: null,
      currentCity: null,
      mapKey: null,
      nearestShop: null,
      phonewidth: 750, // 默认设计稿宽度
      http_host: '', // 当前域名，用于图片路径加速
      // 调试面板相关
      debugMode: false, // 开发时设为true，上线时设为false
      debugPanelVisible: false,
      debugLogs: []
    }
  },
  computed: {
          // 配置信息
    config() {
        // 安全获取配置，提供默认值
        return this.datas && this.datas.content ? {
          pro_title_show: this.datas.content.pro_title_show || 1,
          pro_title_line: this.datas.content.pro_title_line || 2,
          show_sale: this.datas.content.show_sale || 1
        } : {
          pro_title_show: 1,
          pro_title_line: 2,
          show_sale: 1
        }
      },
    // 上边距
    paddingTop() {
      return this.datas.content.padding_top !== undefined 
        ? this.datas.content.padding_top 
        : 0
    },
    // 下边距
    paddingBottom() {
      return this.datas.content.padding_bottom !== undefined 
        ? this.datas.content.padding_bottom 
        : 0
    },
    // 布局类型
    layoutType() {
      return this.datas.content.css_type || 2
    },
    // 布局类名
    layoutClass() {
      if (this.layoutType == 1) return 'type1-layout'
      if (this.layoutType == 3) return 'type3-layout'
      return ''
    },
    // 图片样式
    imageStyle() {
      let height = '320rpx'
      if (this.layoutType == 2) {
        height = '320rpx'
      } else if (this.layoutType == 3) {
        height = '240rpx'
      } else if (this.layoutType == 1) {
        // 横向布局计算高度
        const itemWidth = (this.phonewidth - 30) / this.layoutType - 30
        height = itemWidth + 'rpx'
      }
      
      return {
        height: height
      }
    },
    // 店铺ID
    shopId() {
      return this.nearestShop.id || 0
    }
  },
  created() {
    var that = this;
    that.http_host = that.vuex_apiUrl;
    that.getSystemInfo();
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
      console.log("StoreCp组件初始化，配置:", that.datas.content)
      
      // 如果配置中已有数据，直接使用
      // if (that.datas.content.dataset && that.datas.content.dataset.length > 0) {
      //   that.products = that.datas.content.dataset
      //   return
      // }
      
      // 自动加载数据
      that.loadProductData()
    },
    
    // 获取系统信息
    getSystemInfo() {
      uni.getSystemInfo({
        success: (res) => {
          this.phonewidth = res.windowWidth
        }
      })
    },
    
    // 加载商品数据
    loadProductData() {
      var that = this;
      that.loading = true;
      console.log("开始加载商品列表数据");
      
      // 获取地图key
      that.getMapKey().then(function(mapKey) {
        console.log("地图key准备就绪，开始获取位置数据");
        that.getLocationData().then(function() {
          that.debugMode && that.addDebugLog('info', '商品组件：位置数据获取成功');
          // 获取最近的店铺
          that.getNearestShop().then(function(shopData) {
            that.debugMode && that.addDebugLog('info', '商品组件：获取最近的店铺成功');
            // 加载商品数据
            that.fetchProducts().then(function() {
              that.loading = false;
              that.debugMode && that.addDebugLog('success', '商品组件：商品数据获取成功');
            }).catch(function(error) {
              console.error("获取商品数据失败:", error);
              that.products = [];
              that.loading = false;
              that.debugMode && that.addDebugLog('error', '商品组件：获取商品数据失败:' + error);
            });
          }).catch(function(error) {
            console.error("获取店铺失败:", error);
            that.products = [];
            that.loading = false;
            that.debugMode && that.addDebugLog('error', '商品组件：获取店铺失败:' + error);
          });
        }).catch(function(error) {
          console.error("获取位置失败:", error);
          that.products = [];
          that.loading = false;
          that.debugMode && that.addDebugLog('error', '商品组件：获取位置失败:' + error);
        });
      }).catch(function(error) {
        console.error("获取地图key失败:", error);
        that.products = [];
        that.loading = false;
        that.debugMode && that.addDebugLog('error', '商品组件：获取地图key失败:' + error);
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
            console.log("获取地图key成功:", that.mapKey);
            that.debugMode && that.addDebugLog('success', '地图key请求成功: ' + that.mapKey);
            resolve(that.mapKey);
          } else {
            console.log("获取地图key失败:", res);
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
          console.log("获取地图key请求失败:", error);
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
          that.debugMode && that.addDebugLog('info', '商品组件：位置数据:' + that.latitude + ',' + that.longitude + ',' + that.currentCity);
          
          if (that.latitude && that.longitude) {
            that.debugMode && that.addDebugLog('success', '商品组件：位置数据获取成功');
            resolve();
          } else {
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
        console.log('商品组件：开始获取位置信息...');
        that.debugMode && that.addDebugLog('info', '开始获取当前位置');
        
        // #ifdef H5
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
              that.latitude = position.coords.latitude;
              that.longitude = position.coords.longitude;
              console.log('商品组件：H5位置获取成功:', { lat: that.latitude, lng: that.longitude });
              that.debugMode && that.addDebugLog('success', 'H5定位成功: ' + that.latitude + ', ' + that.longitude);
              
              // 保存到本地存储
              uni.setStorageSync("latitude", that.latitude);
              uni.setStorageSync("longitude", that.longitude);
              
              resolve();
            },
            function(error) {
              console.log('商品组件：H5定位失败:', error);
              that.debugMode && that.addDebugLog('warning', 'H5定位失败，继续后续流程');
              // 失败时不阻塞，直接进入后续流程
              resolve();
            }
          );
        } else {
          console.log('商品组件：浏览器不支持定位');
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
            console.log('商品组件：uni-app位置获取成功:', { lat: that.latitude, lng: that.longitude });
            that.debugMode && that.addDebugLog('success', 'uni-app定位成功: ' + that.latitude + ', ' + that.longitude);
            
            // 保存到本地存储
            uni.setStorageSync("latitude", that.latitude);
            uni.setStorageSync("longitude", that.longitude);
            
            resolve();
          }, 
          fail: function (err) {
            console.log('商品组件：uni-app定位失败:', err);
            that.debugMode && that.addDebugLog('warning', 'uni-app定位失败，继续后续流程:' + err);
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
        console.log("商品组件：开始获取官方店铺");
        console.log("商品组件：发送给后端的城市信息:", that.currentCity);
        that.debugMode && that.addDebugLog('info', '商品组件：发送给后端的城市信息:' + that.currentCity);
        
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
          console.log("商品组件：后端返回结果:", res);
          if (res.errcode == 0) {
            console.log("商品组件：获取到最近店铺:", res.data);
            that.debugMode && that.addDebugLog('success', '商品组件：获取到最近店铺:' + res.data);
            
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
              console.log("更新本地城市信息:", cityInfo);
              that.debugMode && that.addDebugLog('success', '商品组件：更新本地城市信息:' + cityInfo);
            }
            
            resolve(res.data);
          } else {
            console.log("商品组件：获取店铺失败:", res.errmsg);
            that.debugMode && that.addDebugLog('error', '商品组件：获取店铺失败:' + res.errmsg);
            reject(new Error("获取店铺失败"));
          }
        }).catch(function(error) {
          console.log("商品组件：请求失败", error);
          that.debugMode && that.addDebugLog('error', '商品组件：请求失败:' + error);
          reject(error);
        });
      })
    },
    
    // 获取商品数据
    fetchProducts() {
      var that = this;
      return new Promise(function(resolve, reject) {
        console.log("商品组件：获取店铺商品列表, shop_id:", that.nearestShop.id);
        that.debugMode && that.addDebugLog('info', '商品组件：获取店铺商品列表, shop_id:' + that.nearestShop.id);
        
        // 如果没有店铺ID，使用默认数据
        if (!that.nearestShop.id) {
          console.log("商品组件：没有店铺ID，使用默认数据");
          that.debugMode && that.addDebugLog('warning', '商品组件：没有店铺ID，使用默认数据');
          that.products = that.getDefaultProducts();
          resolve();
          return;
        }
        
        var shopId = that.nearestShop.id;
        
        that.$common.requestData({
          url: "/alliance_store/web/index.php?m=alliance_module&a=get_official_shop_product&debug=debug",
          data: {
            "shop_id": shopId,
            "user_idx": that.getUserId(),
            "category_id": that.datas.content.selector_id || 0,
            "limit": that.datas.content.pro_show_num || 10
          },
          method: 'POST',
          needToken: false
        }).then(function(res) {
          if (res.errcode == 0) {
            console.log("商品组件：获取商品列表成功:", res.data);
            that.debugMode && that.addDebugLog('success', '商品组件：获取商品列表成功:' + res.data);
            
            // 处理商品数据，适配组件显示格式
            var products = res.data || [];
            var dataset = [];
            
            // 确保不重复显示商品
            var maxShowNum = parseInt(that.datas.content.pro_show_num) || 10;
            var actualShowNum = Math.min(products.length, maxShowNum);
            
            products.forEach(function(product, index) {
              // 只显示指定数量的商品，且不超过实际商品数量
              if (index < actualShowNum) {
                dataset.push({
                  id: product.id,
                  name: product.product_name || product.p_name,
                  product_name: product.product_name,
                  is_first_img: product.cover_image || product.url,
                  image: product.cover_image || product.url,
                  cover_image: product.cover_image,
                  url: product.cover_image || product.url,
                  now_price: product.now_price,
                  price: product.price,
                  orgin_price: product.orgin_price,
                  original_price: product.original_price,
                  sell_count: product.sell_count || product.sales_count || 0,
                  sales_count: product.sales_count,
                  classify_id: product.classify_id || product.category_id || product.type_id || 0,
                  type_id: product.type_id || product.category_id,
                  category_id: product.category_id,
                  shop_id: product.shop_id || shopId,
                  stock: product.stock,
                  has_sku: product.has_sku || 0,
                  specs: product.specs || [],
                  goods_property: product.goods_property || [],
                  goods_property_list: product.goods_property_list || [],
                  status: product.status,
                  audit_status: product.audit_status,
                  sort: product.sort,
                  integral_quantity: product.integral_quantity || 0,
                  limit_quantity: product.limit_quantity || 0
                });
              }
            });
            
            that.products = dataset;
            console.log("商品组件：处理后的商品数据:", that.products);
            that.debugMode && that.addDebugLog('success', '商品组件：处理后的商品数据:' + that.products);
            resolve();
          } else {
            console.log("商品组件：获取商品失败:", res.errmsg);
            that.debugMode && that.addDebugLog('error', '商品组件：获取商品失败:' + res.errmsg);
            // 使用默认数据作为备用
            that.products = that.getDefaultProducts();
            resolve();
          }
        }).catch(function(error) {
          console.log("商品组件：获取商品请求失败:", error);
          that.debugMode && that.addDebugLog('error', '商品组件：获取商品请求失败:' + error);
          // 使用默认数据作为备用
          that.products = that.getDefaultProducts();
          resolve();
        });
      })
    },
    
    // 处理商品选择
    handleProductSelect(product) {
      var that = this;
      console.log("选择商品:", product);
      
      // 触发自定义事件
      that.$emit('product-select', product);
      
      // 页面跳转逻辑
      that.navigateToProduct(product);
    },
    
    // 导航到商品详情页面
    navigateToProduct(product) {
      var that = this;
      var url = "/alliance_store/web/index.php?m=index&a=index#/pages/index/info?product_id=" + product.id + "&shop_id=" + (product.shop_id || that.shopId);
      that.jump(url);
    },
    
    // 页面跳转
    jump(url) {
      var that = this;
      that.$common.diyLinkJump(url, "h5", true);
    },
    
    // 添加到购物车
    addToCart(product) {
      var that = this;
      console.log("商品组件：点击加入购物车，商品信息：", product);
      console.log("商品组件：商品是否有规格：", product.has_sku);
      that.debugMode && that.addDebugLog('info', '商品组件：点击加入购物车，商品ID:' + product.id);
      
      // 触发自定义事件
      that.$emit('add-to-cart', product);
      
      // 检查商品是否有规格
      if (product.has_sku && product.has_sku == 1) {
        // 有规格商品，提示用户到详情页选择规格
        that.debugMode && that.addDebugLog('warning', '商品组件：规格商品需要到详情页选择规格');
        uni.showModal({
          title: '提示',
          content: '规格商品请选择规格添加',
          showCancel: false,
          success: function() {
            // 跳转到商品详情页
            that.navigateToProduct(product);
          }
        });
        return;
      }
      
      // 无规格商品，直接加入购物车
      var shopId = product.shop_id || that.shopId || (that.nearestShop && that.nearestShop.id) || 0;
      that.debugMode && that.addDebugLog('info', '商品组件：无规格商品直接加入购物车，shop_id:' + shopId);
      
      that.$common.requestData({
        url: '/alliance_store/web/index.php?m=alliance_shop&a=add_to_cart&xdebug=xdebug',
        data: {
          product_id: product.id,
          now_price: product.now_price,
          shop_id: shopId,
          num: 1, // 默认数量为1
          type: 1, // 无规格商品类型
        },
        method: 'POST',
        needToken: false
      }).then(function(res) {
        if (res.errcode == 0) {
          that.debugMode && that.addDebugLog('success', '商品组件：加入购物车成功');
          console.log("商品组件：加入购物车成功");
          uni.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 1500
          });
          
          // 触发成功事件，可用于更新购物车数量等
          that.$emit('cart-add-success', {
            product: product,
            shopId: shopId
          });
        } else {
          var errorMsg = res.errmsg || '加入购物车失败';
          that.debugMode && that.addDebugLog('error', '商品组件：加入购物车失败:' + errorMsg);
          console.log("商品组件：加入购物车失败:", errorMsg);
          uni.showModal({
            title: '提示',
            content: errorMsg,
            showCancel: false
          });
        }
      }).catch(function(error) {
        console.error('商品组件：加入购物车失败:', error);
        that.debugMode && that.addDebugLog('error', '商品组件：加入购物车请求异常:' + error);
        uni.showModal({
          title: '提示',
          content: '加入购物车失败，请重试',
          showCancel: false
        });
      });
    },
    
    // 图片加载错误处理
    handleImageError(e) {
      console.log("图片加载失败:", e);
    },
    
    // 刷新数据
    refresh() {
      var that = this;
      that.products = [];
      that.loadProductData();
    },
    
    // 设置商品数据
    setProducts(products) {
      var that = this;
      that.products = products;
    },
    
    // 获取默认商品数据
    getDefaultProducts() {
      var that = this;
      return [
        {
          id: 1,
          name: "新鲜苹果 精选红富士",
          is_first_img: "",
          image: "",
          now_price: "12.80",
          orgin_price: "15.80",
          sell_count: 128,
          integral_quantity: 10,
          shop_id: that.shopId
        },
        {
          id: 2,
          name: "有机香蕉 进口优质",
          is_first_img: "",
          image: "",
          now_price: "8.90",
          orgin_price: "10.90",
          sell_count: 89,
          integral_quantity: 5,
          shop_id: that.shopId
        },
        {
          id: 3,
          name: "鲜嫩白菜 绿色无公害",
          is_first_img: "",
          image: "",
          now_price: "3.50",
          orgin_price: "4.50",
          sell_count: 256,
          integral_quantity: 2,
          shop_id: that.shopId
        },
        {
          id: 4,
          name: "优质大米 东北五常",
          is_first_img: "",
          image: "",
          now_price: "58.00",
          orgin_price: "68.00",
          sell_count: 45,
          integral_quantity: 50,
          shop_id: that.shopId
        }
      ]
    },
    
    // 获取用户ID（这里需要根据实际情况获取）
    getUserId() {
      var that = this;
      // 从全局变量、存储或其他地方获取用户ID
      // 这里模拟获取，实际项目中需要替换为真实的获取方式
      try {
        return uni.getStorageSync('user_id') || that.datas.content.user_id || 0;
      } catch (e) {
        console.log("获取用户ID失败:", e);
        return 0;
      }
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
      that.addDebugLog('info', '手动刷新数据');
      that.refresh();
    },
    
    // 清空数据
    debugClearData() {
      var that = this;
      that.products = [];
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
        products: that.products,
        config: that.datas.content,
        nearestShop: that.nearestShop,
        location: {
          latitude: that.latitude,
          longitude: that.longitude,
          currentCity: that.currentCity
        }
      };
      console.log('StoreCp组件原始数据:', data);
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
            
            uni.showToast({
              title: '测试完成',
              icon: 'success'
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
    },
    
    // 测试加入购物车
    debugTestAddToCart() {
      var that = this;
      that.addDebugLog('info', '开始测试加入购物车功能');
      
      if (that.products.length === 0) {
        that.addDebugLog('warning', '没有商品数据，无法测试购物车');
        uni.showModal({
          title: '提示',
          content: '没有商品数据，请先加载商品',
          showCancel: false
        });
        return;
      }
      
      // 使用第一个商品进行测试
      var testProduct = that.products[0];
      that.addDebugLog('info', '使用测试商品: ' + testProduct.name + ' (ID:' + testProduct.id + ')');
      
      // 调用加入购物车方法
      that.addToCart(testProduct);
    }
  }
}
</script>

<style lang="scss" scoped>
/* 商品列表组件样式 */
.store-cp-container {
  width: 100%;
}

.product-list-container {
  background-color: transparent;
}

.custom-goods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
  padding: 24rpx;
  margin: 0;
}

/* 不同布局类型 */
.custom-goods.type1-layout {
  grid-template-columns: 1fr;
  gap: 16rpx;
}

.custom-goods.type3-layout {
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16rpx;
}

/* 商品项基础样式 */
.product-item {
  background-color: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.product-item.type2 {
  /* 卡片布局（默认）- 继承基础样式 */
  flex-direction: column;
}

.product-item.type1 {
  display: flex;
  align-items: stretch;
  border-radius: 16rpx;
}

.product-item.type3 {
  border-radius: 16rpx;
}

/* 图片容器 */
.img {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.product-item.type1 .img {
  width: 240rpx;
  height: 240rpx;
  flex-shrink: 0;
}

.product-item.type3 .img {
  height: 240rpx;
}

.product-image {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

/* 商品标题 */
.goods-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 24rpx 24rpx 16rpx 24rpx;
}

.goods-title.line-1 {
  -webkit-line-clamp: 1;
  line-clamp: 1;
  min-height: 40rpx;
}

/* Type 1 布局的商品信息 */
.product-info {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-item.type1 .goods-title {
  margin: 0 0 16rpx 0;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.price-info {
  flex: 1;
}

/* 销量和积分信息 */
.product-sales {
  margin: 0 24rpx 16rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.product-sales-text {
  font-size: 22rpx;
  color: #999;
}

/* 价格信息 */
.current-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 24rpx 24rpx 24rpx;
}

.product-item.type1 .current-price {
  margin: 0 0 8rpx 0;
  justify-content: flex-start;
}

.price-left {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.big {
  font-size: 32rpx;
  color: #ff6b35;
  font-weight: 600;
}

.unit {
  font-size: 28rpx;
  color: #ff6b35;
}

.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 8rpx;
}

.original-label {
  font-size: 24rpx;
  color: #999;
}

.small {
  font-size: 24rpx;
  color: #999;
}

/* 添加购物车按钮 */
.add-cart-btn {
  width: 56rpx;
  height: 56rpx;
  background-color: #ff6b35;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-cart-btn.compact {
  width: 48rpx;
  height: 48rpx;
}

.add-icon {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
  line-height: 1;
}

.add-cart-btn.compact .add-icon {
  font-size: 32rpx;
}

/* Type 3 布局的紧凑样式 */
.product-item.type3 .goods-title {
  font-size: 24rpx;
  margin: 16rpx 16rpx 8rpx 16rpx;
  min-height: 64rpx;
}

.product-bottom-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 16rpx 16rpx 16rpx;
}

.price-info-compact .current-price {
  margin: 0 0 4rpx 0;
  justify-content: flex-start;
}

.product-item.type3 .big {
  font-size: 28rpx;
}

.product-item.type3 .unit {
  font-size: 24rpx;
}

/* 加载状态 */
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80rpx 0;
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
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

/* 调试面板样式 */
.debug-panel {
  position: fixed;
  bottom: 20rpx;
  right: 20rpx;
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
  color: #4CAF50;
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

.debug-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12rpx;
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

/* 响应式设计 */
@media (max-width: 375px) {
  .custom-goods {
    gap: 16rpx;
    padding: 16rpx;
  }
  
  .product-item.type2 .img {
    height: 280rpx;
  }
  
  .product-item.type1 .img {
    width: 200rpx;
    height: 200rpx;
  }
  
  .product-item.type1 .product-info {
    padding: 16rpx;
  }
  
  .debug-panel {
    max-width: 500rpx;
    right: 10rpx;
    bottom: 10rpx;
  }
  
  .debug-actions {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
