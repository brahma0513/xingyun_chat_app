import Store from "@/store";

/** 是否已登录（需有效 user_id 与 token） */
export function isMtLoggedIn(vm) {
  const u = (vm && vm.vuex_user) || Store.state.vuex_user || {};
  const uid = Number(u.user_id) || 0;
  const token = String(u.token || u.login_token || "").trim();
  return uid > 0 && !!token;
}

function getMtLoginBackRoute() {
  try {
    const pages = getCurrentPages();
    const cur = pages[pages.length - 1];
    let route = (cur && cur.$page && cur.$page.fullPath) || "";
    if (!route && cur && cur.route) {
      route = "/" + String(cur.route).replace(/^\//, "");
    }
    if (route && route.charAt(0) !== "/") {
      route = "/" + route;
    }
    return route || "";
  } catch (e) {
    return "";
  }
}

export function goMtLogin() {
  const back = getMtLoginBackRoute();
  const q = back ? "?back_route=" + encodeURIComponent(back) : "";
  uni.navigateTo({
    url: "/public/pages/user/login" + q,
  });
}

/**
 * 未登录时提示并可选跳转登录页
 * @param {object} vm 页面实例（取 vuex_user）
 * @param {string} actionLabel 如「点赞」「收藏」
 * @returns {boolean} 已登录 true；未登录 false
 */
export function ensureMtLogin(vm, actionLabel) {
  if (isMtLoggedIn(vm)) {
    return true;
  }
  const label = String(actionLabel || "操作").trim() || "操作";
  uni.showToast({
    title: "请先登录后再" + label,
    icon: "none",
    duration: 2500,
  });
  setTimeout(() => {
    uni.showModal({
      title: "提示",
      content: "登录后即可" + label,
      confirmText: "去登录",
      cancelText: "取消",
      success(res) {
        if (res.confirm) {
          goMtLogin();
        }
      },
    });
  }, 400);
  return false;
}

/** 接口 errmsg 转用户可读提示 */
export function formatMtNeedLoginMsg(errmsg, actionLabel) {
  const raw = String(errmsg || "").trim();
  const label = String(actionLabel || "操作").trim() || "操作";
  if (!raw) {
    return "请先登录后再" + label;
  }
  if (
    raw.indexOf("参数不完整") >= 0 ||
    raw.indexOf("请先登录") >= 0 ||
    raw.indexOf("未登录") >= 0 ||
    raw.indexOf("登录") >= 0
  ) {
    return "请先登录后再" + label;
  }
  return raw.length > 24 ? raw.slice(0, 24) + "…" : raw;
}
