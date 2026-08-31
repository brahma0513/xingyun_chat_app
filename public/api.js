import url from '../utils/request.js'

const public_api = {}

/**  公共接口 **/

//获取用户token
public_api.getUserToken = params => url.request('/uniapp_template/web/index.php?m=app_login&a=get_user_token&xdebug=xdebug', params, 'POST')
//获取商户的基本设置
public_api.getCustomerBaseSet = params => url.request('/uniapp_template/web/index.php?m=app_login&a=get_customer_base_set', params, 'POST')
//更新app
public_api.updateApp = params => url.request('/uniapp_template/web/index.php?m=uniapp_index&a=update_app', params, 'POST')
//用户主动检测更新app
public_api.userUpdateApp = params => url.request('/uniapp_template/web/index.php?m=uniapp_index&a=user_update_app', params, 'POST')
//修改用户信息
public_api.editProfile = params => url.request('/uniapp_template/web/index.php?m=app_user&a=editProfile', params, 'POST',true,true)
//获取客服联系电话
public_api.getPhoneCall = params => url.request('/uniapp_template/web/index.php?m=uni_index&a=get_uniapp_contact&xdebug=xdebug', params, 'POST')
//保存投诉信息
public_api.saveFankui = params => url.request('/uniapp_template/web/index.php?m=app_user&a=save_fankui', params, 'POST',true)
//获取用户零钱,积分，购物币接口
public_api.getUserProperty = params => url.request('/uniapp_template/web/index.php?m=app_user&a=getUserProperty', params, 'POST',true)
//生成销售员二维码海报
public_api.promoterQrcode = params => url.request('/uniapp_template/web/index.php?m=app_user&a=promoterQrcode', params, 'POST',true,true)
//获取首页应用设置
public_api.getUniappSetting = params => url.request('/uniapp_template/web/index.php?m=uni_index&a=get_uniapp_setting', params, 'POST')

//获取主题设置
public_api.getCustomInfo = params => url.request('/uniapp_template/web/index.php?m=xd_uni_app&a=get_customer_info', params, 'POST')
//获取自定义模板
public_api.getIndexDiyTemplate = params => url.request('/uniapp_template/web/index.php?m=xd_uni_app&a=get_index_diy_template', params, 'POST')
//获取底部菜单链接
public_api.getBottomDiyTemplate = params => url.request('/uniapp_template/web/index.php?m=xd_uni_app&a=get_bottom_diy_template', params, 'POST')
//获取二级页面自定义模板
public_api.getTemplateSon = params => url.request('/uniapp_template/web/index.php?m=xd_uni_app&a=get_template_son', params, 'POST')
//获取二级页面底部菜单链接
public_api.getBottomSon = params => url.request('/uniapp_template/web/index.php?m=xd_uni_app&a=get_bottom_son', params, 'POST')
//获取个人中心
public_api.getPersonalCenterDiyTemplate = params => url.request('/uniapp_template/web/index.php?m=xd_uni_app&a=get_personal_center_diy_template', params, 'POST')
//获取悬浮导航
public_api.getNavigationDiyTemplate = params => url.request('/uniapp_template/web/index.php?m=xd_uni_app&a=get_navigation_diy_template', params, 'POST')
//获取二级页面悬浮导航
public_api.getNavigationSon = params => url.request('/uniapp_template/web/index.php?m=xd_uni_app&a=get_navigation_son', params, 'POST')
//获取用户信息
public_api.getUserInfo = params => url.request('/uniapp_template/web/index.php?m=app_user&a=get_user_info', params, 'POST')
//新用户注册
public_api.userRegist = params => url.request('/uniapp_template/web/index.php?m=app_login&a=user_regist', params, 'POST')
//获取应用服务设置
public_api.getAppServerSetting = params => url.request('/uniapp_template/web/index.php?m=uni_index&a=server_setting', params, 'POST')
//用户登录
public_api.uniLogin = params => url.request('/uniapp_template/web/index.php?m=app_login&a=do_login', params, 'POST')
//登陆获取手机验证码
public_api.uniLoginGetPhoneCode = params => url.request('/uniapp_template/web/index.php?m=app_login&a=get_phone_code', params, 'POST')
//忘记密码重置密码
public_api.uniSaveLoginPassword = params => url.request('/uniapp_template/web/index.php?m=app_login&a=forget_save_password', params, 'POST')
//新用户国际账号注册
public_api.userRegistInternational = params => url.request('/uniapp_template/web/index.php?m=app_login&a=user_regist_international', params, 'POST')

//用户登陆（不要用）
public_api.login = params => url.request('/wsy_user/web/index.php?m=login&a=login_check', params, 'POST')
//登陆获取手机验证码
public_api.loginGetPhoneCode = params => url.request('/wsy_user/web/index.php?m=login&a=get_phone_code', params, 'POST')
//注册获取手机验证码
// public_api.registGetPhoneCode = params => url.request('/wsy_user/web/index.php?m=login&a=register_get_phone_code', params, 'POST')
public_api.registGetPhoneCode = params => url.request('/uniapp_template/web/index.php?m=app_login&a=register_get_phone_code', params, 'POST')
//原始用户注册
public_api.register = params => url.request('/wsy_user/web/index.php?m=login&a=h5_register', params, 'POST')
//修改用户登陆密码
public_api.editLoginpass = params => url.request('/wsy_user/web/index.php?m=set&a=user_login_password_save', params, 'POST',true)
//获取手机验证码（已登录改密/改支付密码等同域发码）
public_api.getPhoneCode = params => url.request('/wsy_user/web/index.php?m=set&a=send_code', params, 'POST',true)
//修改用户支付密码
public_api.editPaypass = params => url.request('/wsy_user/web/index.php?m=set&a=save_paypassword', params, 'POST',true)
//设置用户支付密码
public_api.setPayPassword = params => url.request('/wsy_user/api/index.php?m=set&a=save_paypassword', params, 'POST',true)
//用户注销
public_api.cancleUser = params => url.request('/wsy_user/web/index.php?m=user&a=logout_user', params, 'POST',true)
//用户是否有登陆密码
public_api.userHasPossward = params => url.request('/uniapp_template/web/index.php?m=app_user&a=user_has_possward', params, 'POST',true)
//检测邀请码是否有效
public_api.checkInviteCode = params => url.request('/wsy_user/web/index.php?m=set&a=check_invite_code', params, 'POST',true)
//忘记密码重置密码
public_api.saveLoginPassword = params => url.request('/wsy_user/web/index.php?m=login&a=save_password', params, 'POST')
//微信公众号登陆
public_api.pubWechatLogin = params => url.request('/uniapp_template/web/index.php?m=app_user&a=wechat_user', params, 'POST')
//获取注销验证码
public_api.userSendLogoutCode = params => url.request('/wsy_user/web/index.php?m=user&a=send_logout_code', params, 'POST',true)

//保持用户token在线（废弃）
public_api.keepUserToken = params => url.request('/uniapp_template/web/index.php?m=app_user&a=keep_user_token', params, 'POST',true)
//保持用户token在线
public_api.pongUserToken = params => url.request('/uniapp_template/web/index.php?m=app_user&a=ppong', params, 'POST',true)

/* 平台链接 */

//获取身份
public_api.promoterAllIdentity = params => url.request('/wsy_user/api/index.php?m=user&a=promoter_all_identity', params, 'POST')
//获取推荐人信息
public_api.personalCenterInfo = params => url.request('/wsy_user/api/index.php?m=user&a=personal_center_info&user', params, 'POST',true)
//获取资产信息
public_api.getUserProperty2 = params => url.request('/wsy_user/api/index.php?m=user&a=get_user_property', params, 'POST',true)
//获取积分信息
public_api.integralDetail = params => url.request('/wsy_pay/api/index.php?m=integral&a=integral_detail', params, 'POST',true)
//获取我的收藏
public_api.countCollection = params => url.request('/wsy_pub/api/index.php?m=mini_program_api&a=count_collection', params, 'POST',true)
//获取足迹
public_api.getFootprintCounts = params => url.request('/wsy_pub/web/index.php?m=app_index&a=get_footprint_counts', params, 'POST',true)
//获取贡献分
public_api.getScorePeopleCount = params => url.request('/wsy_rebate/web/index.php?m=performance&a=get_score_people_count', params, 'POST',true,false)
//获取优惠券数量
public_api.getCouponCounts = params => url.request('/wsy_pay/web/index.php?m=coupon&a=get_coupon_counts', params, 'POST',true)
//获取商城订单数量
public_api.getOrderNum = params => url.request('/shop/mshop/api/index.php?m=order&a=get_order_num', params, 'POST',true)
//获取商城大礼包订单数量
public_api.getGiftbagOrderNum = params => url.request('/uniapp_template/web/index.php?m=giftbag&a=get_order_num', params, 'POST',true)
//获取商城大礼包产品列表
public_api.getGiftbagProList = params => url.request('/uniapp_template/web/index.php?m=giftbag&a=getProList', params, 'POST',true)
//获取积分组件列表
public_api.intGetProList = params => url.request('/uniapp_template/web/index.php?m=integral_shop&a=get_pro_list', params, 'POST',true)
//获取积分订单
public_api.integralShopBuy = params => url.request('/uniapp_template/web/index.php?m=integral_shop&a=submit_order', params, 'POST',true)
//获取申请推广员图片
public_api.conditionApplyPromoter = params => url.request('/wsy_user/api/index.php?m=user&a=condition_apply_promoter', params, 'POST',true,true)
//获取海报列表
public_api.getPosterType = params => url.request('/wsy_user/api/index.php?m=user&a=get_poster_type', params, 'POST',true,true)
//获取推广员申请状态
public_api.applyPromoterGet = params => url.request('/wsy_rebate/api/index.php?m=promotion&a=apply_promoter_get', params, 'POST',true)
//获取平台销售员设置
public_api.platPromotion = params => url.request('/wsy_rebate/api/index.php?m=promotion&a=plat_promotion', params, 'POST',true)
//获取平台高级销售员设置
public_api.platSeniorPromotion = params => url.request('/wsy_rebate/api/index.php?m=senior_promotion&a=plat_senior_promotion', params, 'POST',true)
//获取平台奖励设置
public_api.publicSettingGet = params => url.request('/wsy_rebate/api/index.php?m=common&a=public_setting_get', params, 'POST',true)
//领取优惠券
public_api.wsypayReceiveCoupon = params => url.request('/wsy_pay/web/index.php?m=coupon&a=receive_coupon', params, 'POST',true)
//获取优惠券
public_api.wsypayComponentCouponData = params => url.request('/wsy_pay/web/index.php?m=coupon&a=component_coupon_data', params, 'POST',true)
//获取零钱设置
public_api.getPocketMoneySetting = params => url.request('/wsy_pay/api/index.php?m=pocket_money&a=pocket_money_setting', params, 'POST',true)
//获取个人特权信息
public_api.getPersonalCenterInfo = params => url.request('/wsy_user/api/index.php?m=user&a=personal_center_info', params, 'POST',true)
//特权身份
public_api.getConditionApplyPromoter = params => url.request('/wsy_user/api/index.php?m=user&a=condition_apply_promoter', params, 'POST',true)
//特权身份获取过期时间
public_api.getPromoterExpireTime = params => url.request('/wsy_user/api/index.php?m=user&a=promoter_expire_time', params, 'POST',true)
//获取累计收益
public_api.getUserPrivilegeProfit = params => url.request('/wsy_user/api/index.php?m=user&a=user_privilege_profit', params, 'POST',true)
//获取限时优惠券
public_api.wsypayReceiveCouponLimit = params => url.request('/wsy_pay/web/index.php?m=coupon&a=receive_coupon_limit', params, 'POST',true)

//特权身份获取过期时间
public_api.getMyPrivilege = params => url.request('/wsy_user/web/index.php?m=privilege&a=my_privilege', params, 'POST',true)

//获取零钱日志
public_api.getPocketMoneyDetailList = params => url.request('/wsy_pay/api/index.php?m=pocket_money&a=pocket_money_detail_list', params, 'POST',true)
//获取优惠券列表
public_api.getUserCouponList = params => url.request('/wsy_pay/api/index.php?m=coupon&a=get_user_coupon_list', params, 'POST',true)
//获取零钱余额
public_api.getUserPocketMoney = params => url.request('/wsy_user/api/index.php?m=pocket_money&a=user_pocket_money', params, 'POST',true)
// 判断是否设置支付密码
public_api.getIsPaypassword = params => url.request('/wsy_user/web/index.php?m=set&a=get_is_paypassword', params, 'POST',true)
// 获取提现方式
public_api.getUserWithdrawAccounts = params => url.request('/wsy_user/api/index.php?m=pocket_money&a=user_withdraw_accounts', params, 'POST',true)
//销售员申请自定义表单
public_api.wsyrebateCustomApplicationGet = params => url.request('/wsy_rebate/api/index.php?m=common&a=custom_application_get', params, 'POST',true)
//申请成为推广员
public_api.wsyuserApplyPrivilegeSet = params => url.request('/wsy_user/web/index.php?m=privilege&a=apply_privilege_set', params, 'POST',true)
//获取实名认证配置信息
public_api.wsyuserRealNameCertification = params => url.request('/wsy_user/api/index.php?m=real_name_certification&a=is_open', params, 'POST',true)
//获取用户身份 
public_api.getUserIdentity = params => url.request('/wsy_user/api/index.php?m=user&a=user_identity', params, 'POST',true)
//获取授权书
public_api.getAuthCertificateImg = params => url.request('/wsy_user/api/index.php?m=user&a=get_auth_certificate_img', params, 'POST',true)
//获取my收藏
public_api.ajaxMyCollection = params => url.request('/wsy_pub/api/index.php?m=mini_program_api&a=ajax_my_collection', params, 'POST',true)
//获取导航列表
public_api.appIndexCheckType = params => url.request('/wsy_pub/web/index.php?m=app_index&a=check_type', params, 'POST',true)
//获取删除我的收藏
public_api.delCollection = params => url.request('/wsy_pub/api/index.php?m=mini_program_api&a=del_collection', params, 'POST',true)
//获取足迹
public_api.getFootprint = params => url.request('/wsy_pub/web/index.php?m=app_index&a=get_footprint', params, 'POST',true)
//删除足迹
public_api.delFoot = params => url.request('/wsy_pub/web/index.php?m=app_index&a=del_foot', params, 'POST',true)
//收货地址切换状态
public_api.wsyuserAddressState = params => url.request('/wsy_user/web/index.php?m=set&a=address_state', params, 'POST',true)
//保存收货地址 
public_api.wsyuserUserAddressEdit = params => url.request('/wsy_user/web/index.php?m=set&a=user_address_edit', params, 'POST',true)
//获取用户收货地址
public_api.wsyuserUserAddress = params => url.request('/wsy_user/api/index.php?m=user&a=user_address', params, 'POST',true)
//获取地址库
public_api.wsyrebateGetChildArea = params => url.request('/wsy_rebate/api/index.php?m=position&a=get_child_area', params, 'POST',true)
//获取国家列表
public_api.wsypubGetNationList = params => url.request('/wsy_pub/api/index.php?m=address&a=get_nation_list', params, 'POST',true)
//获取地区信息 
public_api.wsypubGetAreaInfo = params => url.request('/wsy_pub/api/index.php?m=address&a=get_area_info', params, 'POST',true)
//根据经纬度获取定位信息
public_api.publicGetLocation = params => url.request('/wsy_pub/web/index.php?m=lbs&a=get_location',params,'POST',false,true,true)
//搜索定位
public_api.publicSearchLocation = params => url.request('/wsy_pub/web/index.php?m=lbs&a=search_location',params,'POST',true)
//lbs城市列表
public_api.publicLbsCityList = params => url.request('/wsy_pub/web/index.php?m=lbs&a=ajax_city_list',params,'POST',true)
//获取开屏广告
public_api.promoteImageConfig = params => url.request('/uniapp_template/web/index.php?m=view_config&a=get_promote_image_config',params,'POST')
//关闭开屏广告
public_api.updateOpenPopularize = params => url.request('/uniapp_template/web/index.php?m=view_config&a=update_open_popularize',params,'POST')
//获取首页轮播下单信息
public_api.wsyuserGetCarouselData = params => url.request('/wsy_user/web/index.php?m=index&a=get_carousel_data',params,'POST')
//获取当前手机绑定的多用账号
public_api.getMultiUserList = params => url.request('/uniapp_template/web/index.php?m=app_user&a=get_multi_user_list',params,'POST',true,true)
//绑定多账户登录
public_api.addMultiUser = params => url.request('/uniapp_template/web/index.php?m=app_user&a=add_multi_user',params,'POST',true)
//切换用户登录
public_api.uniChangeUserLogin = params => url.request('/uniapp_template/web/index.php?m=app_user&a=change_user_login',params,'POST',true)
//删除绑定的多账号登录
public_api.uniDelMultiUser = params => url.request('/uniapp_template/web/index.php?m=app_user&a=del_multi_user',params,'POST',true,true)
//获取开屏广告
public_api.openAdvertisingSetting = params => url.request('/uniapp_template/web/index.php?m=view_config&a=get_open_advertising_setting',params,'POST')
//搜索页面
public_api.pubSearchData = params => url.request('/wsy_pub/web/index.php?m=app_index&a=search_data',params,'POST')
//提交实人认证信息
public_api.publicVerifyData = params => url.request('/uniapp_template/web/index.php?m=real_person&a=get_verify_data&xdebug=xdebug',params,'POST',true)
//获取实名信息
public_api.publicUserRealInfo = params => url.request('/uniapp_template/web/index.php?m=real_person&a=get_user_real_info',params,'POST',true)
//修改语言包
public_api.publicChangeLang = params => url.request('/uniapp_template/web/index.php?m=app_login&a=change_lang',params,'POST',true)
//判断用户是否实名
public_api.getUserAuthentication = params => url.request('/uniapp_template/web/index.php?m=real_person&a=get_user_authentication',params,'POST',true)
//保存用户的设备推送标识
public_api.saveUserPushClientid = params => url.request('/uniapp_template/web/index.php?m=app_user&a=save_user_push_clientid',params,'POST',true)
//微信登录
public_api.wechatLogin = params => url.request('/uniapp_template/web/index.php?m=app_login&a=wechat_login',params,'POST',true)
//微信登录-微信注册
public_api.wechatRegister = params => url.request('/uniapp_template/web/index.php?m=app_login&a=wechat_register',params,'POST',true)
//获取邮箱验证码（绑定邮箱 type=verify；改密 type=password）
public_api.uniLoginGetEmailCode = params => url.request('/wsy_user/web/index.php?m=user_second&a=send_email_code', params, 'POST')
//绑定/修改安全邮箱
public_api.bindEmail = params => url.request('/wsy_user/web/index.php?m=user_second&a=save_bind_email', params, 'POST', true)
//获取当前用户安全邮箱（user_second 无独立读接口，走用户信息）
public_api.get_user_email = params => url.request('/wsy_user/web/index.php?m=set&a=user_info_get', params || {}, 'POST', true)

export default public_api