/**
 * 支付完成回 play_video_simple 时，部分端会把 callback_path 内的 &num= 截断，
 * 仅剩下 ?id=。在发起支付前写入集号，回播放页 onLoad 无 num 时再读出并清除。
 */
const STORAGE_KEY = "micro_theatre_two_pvs_pay_resume_v1";
const MAX_AGE_MS = 30 * 60 * 1000;

/**
 * @param {string} callbackPath buildAppPayCallbackPath 返回值
 */
export function savePlayVideoSimplePayResume(callbackPath) {
  const path = String(callbackPath || "").trim();
  if (!path.includes("play_video_simple")) return;
  const idMatch = path.match(/(?:[?&])id=([^&]+)/);
  if (!idMatch) return;
  let dramaId = idMatch[1];
  try {
    dramaId = decodeURIComponent(dramaId);
  } catch (e) {}
  dramaId = String(dramaId || "").trim();
  const numMatch = path.match(/(?:[?&])num=(\d+)/);
  const num = numMatch ? Math.floor(Number(numMatch[1])) : 0;
  if (!dramaId || !num) return;
  try {
    uni.setStorageSync(STORAGE_KEY, {
      dramaId,
      num,
      at: Date.now(),
    });
  } catch (e) {}
}

/**
 * @param {string} dramaId 当前页 query 中的剧 id
 * @returns {number|null} 集序（1 起），无有效快照时 null
 */
export function consumePlayVideoSimplePayResume(dramaId) {
  const id = String(dramaId || "").trim();
  if (!id) return null;
  try {
    const snap = uni.getStorageSync(STORAGE_KEY);
    if (!snap || String(snap.dramaId) !== id) return null;
    const at = Number(snap.at) || 0;
    if (Date.now() - at > MAX_AGE_MS) {
      uni.removeStorageSync(STORAGE_KEY);
      return null;
    }
    const num = Math.floor(Number(snap.num));
    uni.removeStorageSync(STORAGE_KEY);
    return num > 0 ? num : null;
  } catch (e) {
    return null;
  }
}
