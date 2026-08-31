'use strict';
exports.main = async (event, context) => {
	
	 const res = await uniCloud.getPhoneNumber({
	  	appid: '__UNI__9CF8C00', //填写你自己的appid
	  	provider: 'univerify',
	  	access_token: event.access_token,
	  	openid: event.openid
	  })
	  
	try {
	  var url = event.baseUrl+'/uniapp_template/web/index.php?m=app_login&a=phone_auto_login'
	  const ret_data = await uniCloud.httpclient.request(url, {
		method: 'POST',
	    headers: {
	      'Content-Type': 'application/x-www-form-urlencoded',
	      'X-Requested-With': 'XMLHttpRequest'
	    }, 
	    data: {
	      phone:res.phoneNumber,
		  country_code:event.country_code,
		  customer_id:event.customer_id,
		  client:event.vuex_client,
		  xd_client:event.vuex_client,
		  app_key:event.app_key,
		  app_id:event.app_id,
		  app_examine:event.appExamine,
	    },
	    dataType: 'json'
	  });
	  // console.log('登录成功',ret_data);
	  return ret_data;
	} catch (error) {
	  // console.error('调用登录接口出错:', error);
	  return {
	    errcode: 500,
	    errmsg: '调用登录接口出错'
	  };
	}
};