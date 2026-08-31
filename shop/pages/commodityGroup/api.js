import url from '@/utils/request.js'
import {apiUrl,customer_id} from '@/utils/config.js'
const util = {}
//获取分类
util.getTypeTwo = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_type_two&xdebug=xdebug', params, 'POST')
//获取商品列表
util.getProductListOne = params => url.request('/uniapp_template/web/index.php?m=shop&a=get_product_list_one&xdebug=xdebug', params, 'POST')

export default util