/**
 * 支付链路路径调试：控制台日志前缀为 find_path_{APPID}，
 * APPID 优先取 App 包名 / 小程序 appId，否则用 vuex_customer_id（customer_商户ID），最后为 unknown。
 */
import store from "@/store";

function resolveRuntimeAppId() {
  try {
    if (typeof plus !== "undefined" && plus.runtime && plus.runtime.appid) {
      return String(plus.runtime.appid);
    }
  } catch (e) {}
  try {
    if (typeof uni !== "undefined" && typeof uni.getAccountInfoSync === "function") {
      const acc = uni.getAccountInfoSync();
      if (acc && acc.miniProgram && acc.miniProgram.appId) {
        return String(acc.miniProgram.appId);
      }
    }
  } catch (e) {}
  return "";
}

/** 与控制台筛选一致：例如 find_path__UNI_xx、find_path_customer_2842 */
export function getPayPathLogName(vm) {
  const rid = resolveRuntimeAppId();
  let cid = "";
  try {
    if (vm && vm.vuex_customer_id != null && String(vm.vuex_customer_id) !== "") {
      cid = String(vm.vuex_customer_id);
    } else if (store && store.state && store.state.vuex_customer_id != null) {
      cid = String(store.state.vuex_customer_id);
    }
  } catch (e) {}
  const suffix = rid || (cid ? `customer_${cid}` : "unknown");
  return `find_path_${suffix}`;
}

/**
 * @param {Vue|object|null} vm 任意带 vuex_customer_id 的组件实例；可传 null 则从 store 取商户号
 * @param {string} chineseMessage 中文说明
 * @param {object} [details] 路径或键值，建议传解码后的可读字符串
 */
export function payPathLog(vm, chineseMessage, details) {
  const tag = getPayPathLogName(vm);
  const extra =
    details !== undefined &&
    details !== null &&
    typeof details === "object" &&
    !Array.isArray(details)
      ? details
      : details !== undefined
        ? { 附加数据: details }
        : {};
  console.log(`[${tag}]`, chineseMessage, extra);
}
