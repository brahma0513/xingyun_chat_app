'use strict';
exports.main = async (event,context) => {
	console.log('激励广告回调数据：', event);
	
	try {
		var extraStr = JSON.parse(event.extra)
		var url = extraStr.http_host + '/ad_task/web/index.php?m=ad_task&a=ads_video_complete';
		const ret_data = await unicloud.httpclient.request(url, {
			method:'PoST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'X-Requested-With': 'XMLHttpRequest',
			},
			data: { task_list_id: event.extra.task_list_id, from_client: event.extra.from_client },
			dataType: 'json'
		});
		return ret_data;
	} catch (error) {
		// 错误处理(打印错误日志，方便排查)
		console.error('广告回调处理失败:'，error);
		return {
			code: -2,
			msg: "回调处理异常',
			data: error.message
		}
	}
	
}