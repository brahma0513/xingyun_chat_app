'use strict';
const uniPush = uniCloud.getPushManager({
	appId: "__UNI__3096EBD"
}) //注意这里需要传入你的应用appId  
exports.main = async (event, context) => {
	console.log('event', event);
	console.log('content', context);
	const data = JSON.parse(event.body)
	return await uniPush.sendMessage({
		"push_clientid": data.push_clientid, //填写上一步在uni-app客户端获取到的客户端推送标识push_clientid  
		"force_notification": true, //填写true，客户端就会对在线消息自动创建“通知栏消息”。  
		"title": data.title,
		"content": data.content,
		"payload": data.payload,
		"options": {
			"android": {
				"XM": {
					"/extra.channel_id": 147840
				},
				"HW": {
					"/message/android/category": "WORK",
					"/message/android/notification/default_sound": false,
					"/message/android/notification/channel_id": "RingRing4",
					"/message/android/notification/sound": "/raw/ring001",
					"/message/android/notification/badge/add_num": 1
				},
				"OP": {
					"/category": "TODO",
					"/notify_level": 16
				},
				"VV": {
					"/category": "ORDER",
					"/notifyType": 2
				},
			},
			"ios": {
				"apsProduction": true, // 生产环境必须为true
				"aps": {
					"alert": {
						"title": data.title, // 主标题
						"subtitle": "", // 副标题（建议留空或传不同值，避免重复）
						"body": data.content // 正文
					},
					"badge": 1,
					"sound": "default",
					"category": "CUSTOM_CATEGORY"
				},
				"expiration": 86400,
				"priority": 10
			},

		}
	})
};