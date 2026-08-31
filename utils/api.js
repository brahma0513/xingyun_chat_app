import {
    apiUrl,
	customer_id,
} from './config.js'

var api = {}

//公共接口
import public_api from '../public/api.js'
api = deepMerge(api,public_api)



//商城接口
import shop_api from '../shop/api.js'
api = deepMerge(api,shop_api)

//O2O接口
import offline_shopping_api from '../offline_shopping/api.js'
api = deepMerge(api,offline_shopping_api)


//微官网接口
import website_api from '../website/api.js'
api = deepMerge(api,website_api)

//星云短剧接口
import micro_theatre_two_api from '../micro_theatre_two/api.js'
api = deepMerge(api,micro_theatre_two_api)




































// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

// 深度克隆
function deepClone(obj) {
    // 对常见的“非”值，直接返回原来值
    if ([null, undefined, NaN, false].includes(obj)) return obj;
    if (typeof obj !== "object" && typeof obj !== 'function') {
        //原始类型直接返回
        return obj;
    }
    var o = isArray(obj) ? [] : {};
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
        }
    }
    return o;
}

// JS对象深度合并
function deepMerge(target = {}, source = {}) {
    target = deepClone(target);
    if (typeof target !== 'object' || typeof source !== 'object') return false;
    for (var prop in source) {
        if (!source.hasOwnProperty(prop)) continue;
        if (prop in target) {
            if (typeof target[prop] !== 'object') {
                target[prop] = source[prop];
            } else {
                if (typeof source[prop] !== 'object') {
                    target[prop] = source[prop];
                } else {
                    if (target[prop].concat && source[prop].concat) {
                        target[prop] = target[prop].concat(source[prop]);
                    } else {
                        target[prop] = deepMerge(target[prop], source[prop]);
                    }
                }
            }
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
}

export default api