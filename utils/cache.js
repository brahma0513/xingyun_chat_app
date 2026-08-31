let cacheMap =  new Map()  
let timeoutDefault = 43200 // 设置默认超时时间，单位秒 3600*12 

function isTimeout (name) {  
  const data = cacheMap.get(name)  
  if (!data) return true  
  if (data.timeout === 0) return false   
  const currentTime = Date.now()  
  const overTime = (currentTime - data.createTime) / 1000  
  if (overTime > data.timeout) {  
    cacheMap.delete(name)  
    if (name.startsWith('_')) {  
      try {  
        uni.removeStorageSync(name)  
      } catch (e) {  
        console.log(e)  
      }  
    }  
    return true  
  }  
  return false  
}  

class CacheCell {  
  constructor (data, timeout) {  
    this.data = data  
    this.timeout = timeout // 设置超时时间，单位秒  
    this.createTime = Date.now() // 对象创建时候的时间  
  }  
}  

class MinCache {  
  constructor (timeout) {  
    try {  
      const res = uni.getStorageInfoSync()  
      res.keys.forEach(name => {  
        try {  
          const value = uni.getStorageSync(name)  
          cacheMap.set(name, value)  
        } catch (e) {  
          console.log(e)  
        }  
      })  
    } catch (e) {  
      console.log(e)  
    }  
    timeoutDefault = timeout  
  }  

  /**  
   * 设置缓存数据  
   * @param {Any} name 缓存的key, 以下划线命名表示永久缓存到Storage  
   * @param {Any} data 缓存的数据  
   * @param {Number} timeout 缓存时间（秒），默认86400秒即一天，0表示永久缓存  
   */  
  set (name, data, timeout = timeoutDefault) {  
    const cachecell = new CacheCell(data, timeout)  
    let cache = null  
    if (name.startsWith('_')) {  
      try {  
        uni.setStorageSync(name, cachecell)  
        cache = cacheMap.set(name, cachecell)  
      } catch (e) {  
        console.log(e)  
      }  
    } else {  
      cache = cacheMap.set(name, cachecell)  
    }  
    return cache  
  }  
  get (name) {  
    return isTimeout(name) ? '' : cacheMap.get(name).data  
  }  
  delete (name) {  
    let value = false  
    if (name.startsWith('_')) {  
      try {  
        uni.removeStorageSync(name)  
        value = cacheMap.delete(name)  
      } catch (e) {  
        console.log(e)
      }  
    } else {  
      value = cacheMap.delete(name)  
    }  
    return value  
  }  
  has (name) {  
    return !isTimeout(name)  
  }  
  clear () {  
    let value = false  
    try {  
      uni.clearStorageSync()  
      cacheMap.clear()  
      value = true  
    } catch (e) {  
      console.log(e)  
    }  
    return value  
  }  
}  

let appCacheInstance = null

MinCache.install = function (Vue, {timeout = 43200} = {}) {
  appCacheInstance = new MinCache(timeout)
  Vue.prototype.$cache = appCacheInstance
}

/** nvue 等未挂载 $cache 的页面，与 Vue 页共用同一实例 */
export function getAppCache() {
  if (!appCacheInstance) {
    appCacheInstance = new MinCache()
  }
  return appCacheInstance
}

export default MinCache