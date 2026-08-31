import {
    apiUrl as apiUrl2,
	customer_id as customer_id2,
	customer_id_en as customer_id_en2,
	api_key as api_key2,
	appVersion as appVersion2,
	appExamine as appExamine2,
	is_h5_package as is_h5_package2
} from './config_deploy.js'

export const apiUrl  = apiUrl2
export const customer_id  = customer_id2
export const customer_id_en  = customer_id_en2
export const api_key  = api_key2
export const appVersion  = appVersion2

export const appExamine  = appExamine2
export const is_h5_package  = is_h5_package

export const app_id  = 10000




//平台基本设置
export const base = {
	customer_share_info: {
		//是否开启用户协议与隐私设置
		is_open_agreement: 0,
		//是否开启注销用户
		is_open_logout_user: 0,
		//是否开启实名注册
		is_real_name: 0,
	},
	customer_info:{
		name:"商户",
		logo:"",
		//过期时间 2023-12-31
		expire_date:"",
		//是否过期 1过期 0否
		is_expire:"0",
		//是否冻结 1冻结 0否
		is_freeze:"0",
	},
	certification_set:{
		id_verify_open: 0,
		id_verify_model: 0,
	},
	weixin_mini_info:{
		appid: '',
		orginid: '',
	}
}

//UNIAPP的设置
export const uniappSet = {
	app_title: 'APP',
	index_template_id:0, 
	person_template_id:0, 
	bottom_template_id:0, 
	navigation_template_id:0, 
	android_status:1, 
	ios_status:1,
	is_webview_login:1,
	is_regist_parent:1,
	is_country_login:0,
}

//UNIAPP的应用服务设置
export const appServerSet = {
	TUICalling_set: {},
	SharePage_set: {
		is_open_share: false,
		share_title: '',
		share_descripe: '',
		share_image: '',
	},
	RealPerson_set:{
		is_force: false,
		is_open: true
	}
}

// 用户默认
export const userDefault = {
	user_id: 0,
	user_id_en: '',
	headimgurl: "/static/images/default-head.png",
	name: "游客",
	weixin_name: "游客",
	weixin_name_text: "游客",
	sex: 1,
	sex_text: '男',
	country_code: "+86",
	phone: "",
	parent_id: -1,
	parent_name: "",
	token: "",
	tencent_user_sign: "",
	login_token: "",
	is_real_name: false,
}

//系统信息
export const systemInfo = {
	
}