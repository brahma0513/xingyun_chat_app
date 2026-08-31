import { apiUrl, customer_id, api_key, app_id, appExamine } from "./config.js";

import { exitLogin } from "./common.js";

import Store from "@/store";

const headers = {};
const url = {};
const domain = apiUrl;
const vm = this;

url.request = async (
  url,
  params = {},
  method,
  needToken = false,
  needLoading = false,
) => {
  const vuex_client = Store.state.vuex_client;
  if (needLoading == true) {
    uni.showLoading({
      title: "加载中",
    });
  }
  switch (method) {
    case "GET":
      headers["Content-Type"] = "application/json";
      break;
    case "POST":
      headers["Content-Type"] = "application/x-www-form-urlencoded";
  }
  headers["X-Requested-With"] = "XMLHttpRequest";

  var full_url =
    domain + url + "&user_agent=third_program_h5&request_mode=fortune_app";
  if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
    //自定义的接口
    full_url = url;
  } else {
    params["customer_id"] = customer_id;
    params["api_key"] = api_key;

    params["xd_client"] = vuex_client;
    if (!params.hasOwnProperty("client")) {
      params["client"] = vuex_client;
    }
    if (!params.hasOwnProperty("app_id")) {
      params["app_id"] = app_id;
    }
    if (!params.hasOwnProperty("user_id")) {
      params["user_id"] = Store.state.vuex_user.user_id;
    }
    if (!params.hasOwnProperty("app_examine")) {
      //是否审核包
      params["app_examine"] = appExamine;
    }

    if (needToken == true) {
      full_url = full_url + "&third_token=" + Store.state.vuex_user.token;
      params["login_token"] = Store.state.vuex_user.login_token;
    }
  }

  return await uni
    .request({
      url: full_url,
      header: headers,
      data: params,
      method: method,
      sslVerify: true,
    })
    .then((res) => {
      uni.hideLoading();
      if (!res) {
        return 0;
      }
      var result = res[1];
      if (result.statusCode) {
        switch (result.statusCode) {
          case 200:
            if (result.data) {
              switch (result.data.errcode) {
                case 0:
                  return result.data;
                case 985001:
                  exitLogin();
                  uni.hideLoading();
                  var pages = getCurrentPages();
                  let currentPage =
                    pages[pages.length - 1]["$page"]["fullPath"]; //当前页面路径(带参数)
                  var paramstr = "";
                  var back_route = "";
                  if (currentPage == "") {
                    currentPage = "/pages/personal_center/personal_center";
                  }
                  if (currentPage.charAt(0) != "/") {
                    currentPage = "/" + currentPage;
                  }
                  if (result.data.errshow == 1) {
                    uni.showModal({
                      title: "提示",
                      content: result.data.errmsg,
                      confirmText: "登录",
                      success: function (res) {
                        if (res.confirm) {
                          uni.redirectTo({
                            url:
                              "/public/pages/user/login?back_route=" +
                              currentPage,
                          });
                        } else if (res.cancel) {
                        }
                      },
                    });
                  } else {
                    uni.redirectTo({
                      url: "/public/pages/user/login?back_route=" + currentPage,
                    });
                  }
                  return result.data;

                default:
                  return result.data;
              }
            }
            break;
          case 404:
            uni.showToast({
              title: "请求接口不存在",
              icon: "none",
            });
            break;
          default:
            // uni.showToast({
            // 	title: '...((/- -)/！服务器扔一个错误',
            // 	icon: 'none'
            // })
            console.log("...((/- -)/！服务器扔一个错误", result);
            break;
        }
        return 0;
      } else {
        switch (result.errMsg) {
          default:
            uni.showToast({
              title: "┌(。Д。)┐！网络错误",
              icon: "none",
            });
            console.log("...((/- -)/！网络错误", result);
            break;
        }
        return 0;
      }
    })
    .catch((parmas) => {
      uni.hideLoading();
      switch (parmas.code) {
        case 401:
          uni.clearStorageSync();
          break;
        default:
          uni.showToast({
            title: "网络信号不佳~",
            icon: "none",
          });
          return Promise.reject();
      }
    });
};
export default url;
