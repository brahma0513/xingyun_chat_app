import url from '../utils/request.js'

const shop_api = {}

/*商城接口*/

//获取一级分组
shop_api.osGetType = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_type&xdebug=xdebug', params, 'POST', false, false, false)

//获取经纬度	
shop_api.osGetLocation = params => url.request('/offline_shopping/web/index.php?m=common&a=get_location', params, 'POST', false, false, false)

//获取储蓄列表
shop_api.osGetStoreList = params => url.request('/offline_shopping/web/index.php?m=store&a=get_store_list', params, 'POST', false, false, false)

//获取行业类型
shop_api.osGetIndustryType = params => url.request('/offline_shopping/web/index.php?m=api&a=supply_type', params, 'POST', false, false, false)

//获取商品列表
shop_api.osGetGoodsList = params => url.request('/offline_shopping/web/index.php?m=product&a=get_product_list', params, 'POST', false, false, false)

export default shop_api