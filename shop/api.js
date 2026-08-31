import url from '../utils/request.js'

const shop_api = {}

/*商城接口*/

//获取一级分组
shop_api.getType = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_type&xdebug=xdebug', params, 'POST')
//获取二分组
shop_api.getTypeSon = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_type_son&xdebug=xdebug', params, 'POST')
//获取商品基础设置数据
shop_api.getListBase = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_list_base&xdebug=xdebug', params, 'POST')
//获取广告
shop_api.getTypeAlbum = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_type_album&xdebug=xdebug', params, 'POST')
//获取分类
shop_api.getTypeTwo = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_type_two&xdebug=xdebug', params, 'POST')
//获取商品列表
shop_api.getProductListOne = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_product_list_one&xdebug=xdebug', params, 'POST')
//获取分类产品内容
shop_api.getProductList = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_product_list', params, 'POST', true)

export default shop_api