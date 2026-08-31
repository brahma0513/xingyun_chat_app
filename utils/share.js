// #ifdef APP-PLUS
import appShareFun, {
	closeShare
} from '@/plugins/share';
import {
    apiUrl,
} from './config.js'
const share = {
	title: '富民预测',
	// #ifdef H5 || APP-PLUS
	//公众号||APP分享
	desc: "大师在线为您解答难题，随时onCall !!\n祈福明灯许愿，助您心想事成。", // 分享描述
	link: apiUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	imgUrl: apiUrl+'/fortune_telling/web/static/images/logo.png', // 分享图标-1
	// #endif
}
 
// APP分享
export const appShare = function(data, callbcak) {
	return appShareFun({
		shareTitle: data.shareTitle || share.title,
		shareUrl: data.shareUrl || share.link,
		shareContent: data.shareContent || share.desc,
		shareImg: data.shareImg || share.imgUrl,
	}, callbcak);
};
export const closeAppShare = closeShare;
// #endif

// #ifdef MP-WEIXIN
// 微信小程序分享
export const wxShare = function(title, path) {
	let shareInfo = {
		title: title || '富民预测',
	};
	if (path && typeof(path) == "string") {
		shareInfo.path = path;
	} else if (path === undefined) {
		shareInfo.path = share.path;
	}
	return shareInfo;
}
// #endif
