// //引入配置
import { apiUrl, base, customer_id, appVersion, userDefault } from "./config.js";

// //引入数据库操作
import { get } from "./db.js";
import Vue from "vue";
import Store from "@/store";

// 引入url请求
import urlRequest from "./request.js";

//引入分享插件
import UniShare from "@/uni_modules/uni-share/js_sdk/uni-share.js";
const uniShare = new UniShare();
let h5TokenRefreshPromise = null;

// 刷新当前页面
function refresh() {
  let url = "/" + getCurrentPages()[getCurrentPages().length - 1].route;
  uni.redirectTo({
    url: url,
  });
}

// 显示提示
function showToast(title) {
  uni.showToast({
    icon: "none",
    title: title,
  });
}

// 显示等待
function showLoading(title = "请稍后") {
  uni.showLoading({
    title: title,
    mask: true,
  });
}

// 退出登陆
function exitLogin() {
  //H5注销登录
  requestData({
    url: "/wsy_user/web/index.php?m=login&a=login_out",
    data: { user_id: Store.state.vuex_user.user_id },
    method: "POST",
    needToken: true,
  }).then((res) => {});

  Store.state.vuex_user = userDefault;
  uni.removeStorageSync("lifeData");
  uni.clearStorageSync();
  Vue.prototype.$cache.clear();
  uni.$emit("exitLogin");
}

function getUserInfo() {
  let userinfo = uni.getStorageInfoSync("userinfo") || userDefault;
  return userinfo;
}

function isH5Link(link, type = "") {
  if (type == "h5") {
    return true;
  }
  if (type == "uniapp") {
    return false;
  }
  return (
    (link.indexOf("m=") != -1 && link.indexOf("a=") != -1) ||
    link.indexOf("http") == 0 ||
    link.indexOf(".html") != -1 ||
    link.indexOf(".php") != -1
  );
}

function syncVuexUserFromStorage() {
  let lifeData = uni.getStorageSync("lifeData") || {};
  if (lifeData.vuex_user && lifeData.vuex_user.user_id > 0) {
    Store.state.vuex_user = Object.assign(
      {},
      Store.state.vuex_user,
      lifeData.vuex_user,
    );
  }
  return Store.state.vuex_user || userDefault;
}

function saveLatestVuexUser(userinfo) {
  if (!userinfo || userinfo.user_id <= 0) {
    return;
  }
  let oldUser = syncVuexUserFromStorage();
  if (!userinfo.login_token && oldUser.login_token) {
    userinfo.login_token = oldUser.login_token;
  }
  Store.commit("$uStore", {
    name: "vuex_user",
    value: userinfo,
  });
}

function getLatestThirdToken() {
  let userinfo = syncVuexUserFromStorage();
  return userinfo && userinfo.token ? userinfo.token : "";
}

function appendOrReplaceUrlParam(link, key, value) {
  let hash = "";
  let hashIndex = link.indexOf("#");
  if (hashIndex >= 0) {
    hash = link.slice(hashIndex);
    link = link.slice(0, hashIndex);
  }
  let reg = new RegExp("([?&])" + key + "=[^&#]*");
  if (reg.test(link)) {
    return link.replace(reg, "$1" + key + "=" + encodeURIComponent(value)) + hash;
  }
  let join = link.indexOf("?") >= 0 ? "&" : "?";
  return link + join + key + "=" + encodeURIComponent(value) + hash;
}

function refreshH5TokenBeforeJump() {
  let userinfo = syncVuexUserFromStorage();
  if (!userinfo || userinfo.user_id <= 0 || !userinfo.token || !userinfo.user_id_en) {
    return Promise.resolve();
  }
  if (h5TokenRefreshPromise) {
    return h5TokenRefreshPromise;
  }

  let systemInfo = {};
  try {
    systemInfo = uni.getSystemInfoSync() || {};
  } catch (error) {}

  h5TokenRefreshPromise = requestData({
    url: "/uniapp_template/web/index.php?m=app_user&a=ppong",
    data: {
      login_user_id: userinfo.user_id_en,
      app_version_code: appVersion,
      login_client: Store.state.vuex_client,
      phone_mark: systemInfo.deviceId,
    },
    method: "POST",
    needToken: true,
    needLoading: false,
    showError: false,
  })
    .then((res) => {
      if (res && res.errcode == 0 && res.data && res.data.userinfo) {
        saveLatestVuexUser(res.data.userinfo);
      } else {
        syncVuexUserFromStorage();
      }
      h5TokenRefreshPromise = null;
    })
    .catch(() => {
      syncVuexUserFromStorage();
      h5TokenRefreshPromise = null;
    });

  return h5TokenRefreshPromise;
}
/**
 * 价钱拆分成整数和小数
 */
function toPrice(num, bool) {
  num = num.toString();
  if (num.indexOf(".") < 0) {
    var priceA = num;
    var priceB = "00";
  } else {
    var priceA = num.split(".")[0];
    if (num.split(".")[1].length == 0) {
      priceB = num.split(".")[1] + "0";
    } else if (num.split(".")[1].length > 2) {
      priceB = num.split(".")[1].substring(0, 2);
    } else {
      priceB = num.split(".")[1];
    }
  }
  if (bool) {
    return priceA;
  } else {
    return "." + priceB;
  }
}

// 获取色值
function get_color(color) {
  var color_num;
  switch (color) {
    case "blue":
      color_num = "#377EF6";
      break;
    case "green":
      color_num = "#5AC587";
      break;
    case "orange":
      color_num = "#ff5600";
      break;
    case "purple":
      color_num = "#7f8aef";
      break;
    case "red":
      color_num = "#F85B57";
      break;
    case "yellow":
      color_num = "#FAD447";
      break;
    case "black":
      color_num = "#000000";
      break;
  }
  return color_num;
}

/**
 * 自定义装修模板链接跳转
 * link 链接
 * type 链接类型  空 未指定 uniapp 原生链接  h5 即h5链接
 * needToken 是否需要登陆token  true要  false不要
 * routeType 路由类型 1：默认navigateTo 2：redirectTo
 * is_bottom 是否底部菜单跳转 1是 0否
 */
function diyLinkJump(
  link,
  type = "",
  needToken = true,
  routeType = 1,
  is_bottom = 0,
) {
  if (
    link != "" &&
    link != "javascript:void(0)" &&
    needToken == true &&
    isH5Link(link, type)
  ) {
    refreshH5TokenBeforeJump().then(() => {
      doDiyLinkJump(link, type, needToken, routeType, is_bottom);
    });
    return;
  }
  doDiyLinkJump(link, type, needToken, routeType, is_bottom);
}

function doDiyLinkJump(
  link,
  type = "",
  needToken = true,
  routeType = 1,
  is_bottom = 0,
) {
  syncVuexUserFromStorage();
  var has_xd = -1;
  var full_link = "";
  if (link == "" || link == "javascript:void(0)") {
    return false;
  }

  var pages = getCurrentPages();
  let currentPage = pages[pages.length - 1]["$page"]["fullPath"]; //当前页面路径(带参数)
  if (currentPage.charAt(0) != "/") {
    currentPage = "/" + currentPage;
  }

  if (type == "") {
    if (
      (link.indexOf("m=") != -1 && link.indexOf("a=") != -1) ||
      link.indexOf("http") == 0 ||
      link.indexOf(".html") != -1 ||
      link.indexOf(".php") != -1
    ) {
      type = "h5";
    } else {
      type = "uniapp";
    }
  }

  if (type == "uniapp") {
    if (routeType == 2) {
      uni.redirectTo({
        url: link,
      });
    } else {
      uni.navigateTo({
        url: link,
      });
    }
  } else if (type == "h5") {
    if (link.indexOf("http") == 0) {
      //判断是否云平台的域名
      var is_ypt_url = true;
      var check_ypt_url = link.indexOf(Store.state.vuex_apiUrl);
      if (check_ypt_url >= 0) {
        if (link.indexOf("resources") >= 0) {
          is_ypt_url = false;
        } else {
          is_ypt_url = true;
        }
      } else {
        is_ypt_url = false;
      }
      if (is_ypt_url == true) {
        if (needToken == true) {
          //link = link + '&user_agent=third_program_h5&third_token='+Store.state.vuex_user.token;
          if (Store.state.vuex_uniappSet.is_webview_login == 0) {
            link = appendOrReplaceUrlParam(link, "user_agent", "third_program_h5");
            link = appendOrReplaceUrlParam(
              link,
              "third_token",
              getLatestThirdToken(),
            );
          } else {
            //后台设置必须要先登录
            if (getLatestThirdToken() == "") {
              uni.showModal({
                title: "提示",
                content: "请先登录",
                confirmText: "登录",
                success: function (res) {
                  if (res.confirm) {
                    uni.redirectTo({
                      url: "/public/pages/user/login?back_route=" + currentPage,
                    });
                  } else if (res.cancel) {
                  }
                },
              });
              return false;
            } else {
              link = appendOrReplaceUrlParam(
                link,
                "user_agent",
                "third_program_h5",
              );
              link = appendOrReplaceUrlParam(
                link,
                "third_token",
                getLatestThirdToken(),
              );
            }
            //是否已经实名
            if (
              Store.state.vuex_appServerSet.RealPerson_set.is_open == true &&
              Store.state.vuex_appServerSet.RealPerson_set.is_force == true &&
              Store.state.vuex_user.is_real_name == 0
            ) {
              uni.showModal({
                title: "提示",
                content: "请先进行实名",
                confirmText: "实名",
                success: function (res) {
                  if (res.confirm) {
                    uni.navigateTo({
                      url:
                        "/public/pages/user/realperson?back_route=" +
                        currentPage,
                    });
                  } else if (res.cancel) {
                  }
                },
              });
              return false;
            }
          }
        }
      }
      //设置webview的链接
      uni.setStorageSync("weburl", link);
      full_link = "/pages/webview/webview";
      if (is_bottom == 1 && is_ypt_url == true) {
        full_link += "?is_bottom=1";
      }
    } else {
      console.log("无http");
      var jing_url = "";
      var jing = link.indexOf("#");
      if (jing >= 0) {
        //带#的链接
        jing_url = link.slice(jing);
        link = link.slice(0, jing);
      }

      full_link = appendOrReplaceUrlParam(link, "user_agent", "third_program_h5");
      full_link = appendOrReplaceUrlParam(full_link, "request_mode", "fortune_app");
      full_link = appendOrReplaceUrlParam(
        full_link,
        "customer_id",
        Store.state.vuex_customer_id,
      );
      if (needToken == true) {
        //full_link = full_link + '&third_token='+Store.state.vuex_user.token;
        if (Store.state.vuex_uniappSet.is_webview_login == 0) {
          full_link = appendOrReplaceUrlParam(
            full_link,
            "third_token",
            getLatestThirdToken(),
          );
        } else {
          if (getLatestThirdToken() == "") {
            uni.showModal({
              title: "提示",
              content: "请先登录",
              confirmText: "登录",
              success: function (res) {
                if (res.confirm) {
                  uni.redirectTo({
                    url: "/public/pages/user/login?back_route=" + currentPage,
                  });
                } else if (res.cancel) {
                }
              },
            });
            return false;
          } else {
            full_link = appendOrReplaceUrlParam(
              full_link,
              "third_token",
              getLatestThirdToken(),
            );
          }
          console.log(Store.state.vuex_appServerSet);
          //是否已经实名
          if (
            Store.state.vuex_appServerSet.RealPerson_set.is_open == true &&
            Store.state.vuex_appServerSet.RealPerson_set.is_force == true &&
            Store.state.vuex_user.is_real_name == 0
          ) {
            uni.showModal({
              title: "提示",
              content: "请先进行实名",
              confirmText: "实名",
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url:
                      "/public/pages/user/realperson?back_route=" + currentPage,
                  });
                } else if (res.cancel) {
                }
              },
            });
            return false;
          }
        }
      }
      if (jing >= 0) {
        full_link = full_link + jing_url; //带#的链接
      }
      //设置进入webview以前的链接
      uni.setStorageSync("weburl_back", currentPage);
      //设置webview的链接
      uni.setStorageSync("weburl", Store.state.vuex_apiUrl + full_link);
      full_link = "/pages/webview/webview";
      if (is_bottom == 1) {
        full_link += "?is_bottom=1";
      }
    }

    if (routeType == 2) {
      uni.redirectTo({
        url: full_link,
      });
    } else {
      uni.navigateTo({
        url: full_link,
      });
    }
  }
}

function requestData(n) {
  var needLoading = false;
  var showError = true;
  if (n.needLoading != undefined) {
    needLoading = n.needLoading;
  }
  if (n.showError != undefined) {
    showError = n.showError;
  }
  return urlRequest.request(
    n.url,
    n.data,
    n.method,
    n.needToken,
    needLoading,
    showError,
  );
}

/**
 * 手机格式验证
 */
function checkPhone(phone) {
  //公共手机号合法判断
  var phoneReg = /^((\+?86)|(\(\+86\)))?\d{11}$|^(09)\d{8}$/;
  var telReg = /^0\d{2,3}-?\d{7,8}$/;
  if (
    !(phoneReg.test(phone) || telReg.test(phone)) ||
    phone == "" ||
    typeof phone == "undefined"
  ) {
    return false;
  }
  return true;
}

// JS对象深度合并
function deepMerge(target = {}, source = {}) {
  target = deepClone(target);
  if (typeof target !== "object" || typeof source !== "object") return false;
  for (var prop in source) {
    if (!source.hasOwnProperty(prop)) continue;
    if (prop in target) {
      if (typeof target[prop] !== "object") {
        target[prop] = source[prop];
      } else {
        if (typeof source[prop] !== "object") {
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

/**
 * 分享方法
 * @param {Object} href 分享链接
 * @param {Object} title 分享标题
 * @param {Object} summary 分享描述
 * @param {Object} imageUrl 分享图片
 * @param {Object} showPoster 是否显示推广海报
 */
function doShare(href, title, summary, imageUrl, showPoster = false) {
  var menus = [
    {
      img: "/static/images/share/shareweixin.png",
      text: "微信好友",
      share: {
        //当前项的分享参数配置。可覆盖公共的配置如下：分享到微信小程序，配置了type=5
        provider: "weixin",
        scene: "WXSceneSession",
      },
    },
    {
      img: "/static/images/share/sharefriend.png",
      text: "微信朋友圈",
      share: {
        provider: "weixin",
        scene: "WXSceneTimeline",
      },
    },
    {
      img: "/static/images/share/shareqq.png",
      text: "QQ",
      share: {
        provider: "qq",
      },
    },
    // {
    // 	"img": "/static/images/share/sharecopy.png",
    // 	"text": "复制链接",
    // 	"share": "copyurl"
    // }
  ];
  if (showPoster == true) {
    menus.push({
      img: "/static/images/share/shareposter.png",
      text: "推广海报",
      share: "shareposter",
    });
  }
  uniShare.show(
    {
      content: {
        //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
        type: 0,
        href: href,
        title: title,
        summary: summary,
        imageUrl: imageUrl,
      },
      menus: menus,
      cancelText: "取消分享",
    },
    (e) => {
      //callback
      console.log(uniShare.isShow);
      console.log(e);
    },
  );
}

//隐藏分享弹窗
function hideShare() {
  uniShare.hide();
}

// #ifdef H5
/**
 * @Author: zhangxiaobin
 * @description: 判断浏览器类型
 * @return {Object}
 */
export const browser = {
  versions: (function () {
    var u = navigator.userAgent;
    return {
      trident: u.indexOf("Trident") > -1, // IE内核
      presto: u.indexOf("Presto") > -1, // opera内核
      webKit: u.indexOf("AppleWebKit") > -1, // 苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, // android终端
      iPhone: u.indexOf("iPhone") > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1 || u.indexOf("Macintosh") > -1, // 是否iPad
      webApp: u.indexOf("Safari") === -1, // 是否web应该程序，没有头部与底部
      weixin: u.indexOf("MicroMessenger") > -1, // 是否微信 （2015-01-22新增）
      qq: u.indexOf(" QQ") > -1, // 是否QQ
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
};
// #endif

export const appUpdateConfig = {
  // 发起ajax请求获取服务端版本号
  getServerNo: (version, isPrompt = false, callback) => {
    let platform = uni.getSystemInfoSync().platform;
    let httpData = {
      now_app_version_code: version.versionCode,
      // 版本名称
      now_app_version_name: version.versionName,
      // setupPage参数说明（判断用户是不是从设置页面点击的更新，如果是设置页面点击的更新，有不要用静默更新了，不然用户点击没反应很奇怪的）
      setupPage: isPrompt,
      platform: platform,
    };
    //api.updateApp(httpData).then(res => {
    requestData({
      url: "/uniapp_template/web/index.php?m=uniapp_index&a=update_app",
      data: httpData,
      method: "POST",
      needToken: false,
    }).then((res) => {
      /* callbackParam的数据说明
       * | 参数名称	     | 一定返回 	| 类型	    | 描述
       * | -------------|--------- | --------- | ------------- |
       * | versionCode	 | y	    | int	    | 版本号        |
       * | versionName	 | y	    | String	| 版本名称      |
       * | versionInfo	 | y	    | String	| 版本信息      |
       * | updateType	     | y	    | String	| forcibly = 强制更新, solicit = 弹窗确认更新, silent = 静默更新 |
       * | downloadUrl	 | y	    | String	| 版本下载链接（IOS安装包更新请放跳转store应用商店链接,安卓apk和wgt文件放文件下载链接）  |
       */
      if (res.errcode == 0) {
        if (res.data.type == 0) {
          return true;
        }
        var callbackParam = {};
        callbackParam.downloadUrl = res.data.update_url; //下载链接
        callbackParam.versionName = res.data.online_app_version;
        callbackParam.versionCode = res.data.online_app_version_code;
        callbackParam.versionInfo = res.data.version_info;
        if (res.data.type == 1) {
          //整包更新
          callbackParam.updateType = "solicit";
        } else if (res.data.type == 2) {
          //热更新
          callbackParam.updateType = "silent";
        }
        callback && callback(callbackParam);
      } else if (isPrompt) {
        uni.showToast({
          title: "暂无新版本",
          icon: "none",
        });
      }
    });
  },
  // 弹窗主颜色（不填默认粉色）
  appUpdateColor: "f00",
  // 弹窗图标（不填显示默认图标，链接配置示例如： '/static/demo/ic_attention.png'）
  appUpdateIcon: "",
};

export {
  refresh,
  showToast,
  showLoading,
  exitLogin,
  diyLinkJump,
  toPrice,
  get_color,
  requestData,
  checkPhone,
  deepMerge,
  doShare,
  hideShare,
};
