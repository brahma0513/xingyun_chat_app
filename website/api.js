import url from '../utils/request.js'

const website_api = {}

// website_index  获取视频数据
website_api.getWebsIndexData = params => url.request('/website/web/index.php?m=website_index&a=get_index_data&xdebug=xdebug', params, 'POST')


//website_detail 获取视频详情
website_api.getWebsVideoMes = params => url.request('/website/web/index.php?m=website_detail&a=get_video_mes&xdebug=xdebug', params, 'POST',true)
//获取文章详情
website_api.getWebsArtMes = params => url.request('/website/web/index.php?m=website_detail&a=get_art_mes&xdebug=xdebug', params, 'POST',true)
//获取评论列表
website_api.getWebsComment = params => url.request('/website/web/index.php?m=website_detail&a=get_comment&xdebug=xdebug', params, 'POST',true)
//获取剩余回复的评论数据
website_api.getWebsCommentReply = params => url.request('/website/web/index.php?m=website_detail&a=get_comment_reply&xdebug=xdebug', params, 'POST')
//评论点赞
website_api.getWebsCommentLike = params => url.request('/website/web/index.php?m=website_detail&a=comment_like&xdebug=xdebug', params, 'POST',true)
 //发表评论
website_api.getWebsSaveArtComment = params => url.request('/website/web/index.php?m=website_detail&a=save_art_comment&xdebug=xdebug', params, 'POST',true)
 //发表回复
website_api.getWebsSaveCommentReply = params => url.request('/website/web/index.php?m=website_detail&a=save_comment_reply&xdebug=xdebug', params, 'POST',true)
//获取同类型七天内最高点击量的文章
website_api.getWebsMostReadArt = params => url.request('/website/web/index.php?m=website_detail&a=get_most_reading_article&xdebug=xdebug', params, 'POST',true)


//website_common 视频点赞
website_api.getWebsLike = params => url.request('/website/web/index.php?m=website_common&a=like&xdebug=xdebug', params, 'POST',true)
//增加阅读量
website_api.getWebsRead = params => url.request('/website/web/index.php?m=website_common&a=read&xdebug=xdebug', params, 'POST')
//获取分类数据
website_api.getWebsAllCategory = params => url.request('/website/web/index.php?m=website_common&a=get_all_category&xdebug=xdebug', params, 'POST')
//获取title
website_api.getWebsBaseInfoSet = params => url.request('/website/web/index.php?m=website_common&a=get_base_info_setting&xdebug=xdebug', params, 'POST')
// 获取轮播数据
website_api.getWebsAdSettion = params => url.request('/website/web/index.php?m=website_common&a=get_advertisement_setting&xdebug=xdebug', params, 'POST')


//website_more 获取资讯视频数据
website_api.getWebsVideoPage = params => url.request('/website/web/index.php?m=website_more&a=get_video_page&xdebug=xdebug', params, 'POST',true)
//获取资讯文章数据
website_api.getWebsArtPage = params => url.request('/website/web/index.php?m=website_more&a=get_art_page&xdebug=xdebug', params, 'POST',true)



export default website_api