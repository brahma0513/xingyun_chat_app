<template>
    <!-- 服务商品 -->
    <view v-if="localData.type=='productlistNew80011'" :style="{
		paddingTop:localData.content.padding_top+'px',
		paddingBottom:localData.content.padding_bottom+'px',
		backgroundColor:localData.content.backgroundColor,
		backgroundImage:'url('+localData.content.backgroundImage+')'
	}">
        <view class="tabs_box">
            <view class="tags_li" v-for="(it,index) in localData.content.dataset" :key="index"
                @click="go_tab(it,index)">
                <view class="tab_tit" :class="tabIndex==index?'aitived':''">{{it.name}}</view>
                <view class="lined" v-if="tabIndex==index"><img class="line_img"
                        src="/shared_store/web/static/images/line_bot.png" /></view>
            </view>
        </view>
        <view class="boxss">
            <view class="men_li">精选</view>
            <view class="men_li" @click="go_men">价格排序<img class="bot_img" :class="is_check?'aitivedss':''"
                    src="/shared_store/web/static/images/bots.png" />
            </view>
        </view>
        <view class="product-content">
            <view class="procut-list">
                <view class="shop_lis" v-for="(item,index) in shared_store_goods_lists" :key="index"
                    @click="shared_store_href('/shared_store/web/index.php?m=view&a=goodsDetailsNew&id='+item.product_id)">
                    <img class="lis_img" :src="item.product_img" alt="">
                    <view class="ggs">
                        <view class="lis_title"><span class="tgs">团购</span>{{item.product_name}}
                        </view>
                    </view>
                    <view class="lis_pri">￥{{item.now_price}}<span class="or_pri">￥{{item.orgin_price}}</span>
                    </view>
                    <view class="lis_dd" v-if="item.verify_store_count>1">多店可用</view>
                </view>
            </view>
            <!-- 加载状态 -->
            <div v-if="shared_store_loadings" class="loading">加载中...</div>
            <!-- 完成状态 -->
            <div v-if="shared_store_finisheds" class="finished-text">没有更多了</div>
        </view>


    </view>
</template>

<script>
    export default {

        data() {
            return {
                localData: {},
                is_check: false,
                shared_store_goods_lists: [],
                shared_store_loadings: false,
                shared_store_finisheds: false,

                shared_store_goods_querys: {
                    page: 1,
                    page_size: 20,
                    name: '',
                    type_id: -1,
                    order: "",
                },
            };
        },
        created() {
            const that = this
            that.localData = that.$attrs.data
            that.shared_store_get_product_lists()
        },
        methods: {
            go_tab(item, index) {
                console.log('33333333333333333333');

                this.tabIndex = index;
                this.shared_store_goods_querys.page = 1;
                this.shared_store_goods_querys.type_id = item.id;
                this.shared_store_finisheds = false;
                this.shared_store_loadings = false;
                this.shared_store_goods_lists = [];

            },
            go_men() {
                this.is_check = !this.is_check;
                if (this.is_check) {
                    this.shared_store_goods_querys.order = "price_asc"
                } else {
                    this.shared_store_goods_querys.order = "price_desc "
                }
                this.shared_store_goods_querys.page = 1;
                // this.shared_store_goods_querys.type_id = item.id;
                this.shared_store_goods_lists = [];
                this.shared_store_finisheds = false;
                this.shared_store_loadings = false;


            },
            shared_store_get_product_lists: function() {
                this.shared_store_loadings = true;
                this.$common.requestData({
                    method: "POST",
                    url: '/shared_store/web/index.php?m=product&a=get_service_product_list',
                    data: this.shared_store_goods_querys,
                    needToken: true,
                }).then(res => {

                    if (res.data.errcode === 0) {
                        const www = [{
                            "name": "精选",
                            "id": -1
                        }];
                        const sss = [...www, ...res.data.data]; // res.data.data 应为返回的商品分类数组
                        this.localData.content.dataset = sss;
                        this.localData.content.datatype = sss.map(it => {
                            return {
                                text: it.name,
                                value: String(it.id),
                            };
                        })
                    }
                })
            },
        }
    };
</script>

<style>
    .shop_lis {
        width: 48%;
        background: #FFFFFF;
        border-radius: 5px;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .shop_lis:nth-child(2n) {
        margin-right: 0;
    }

    .lis_img {
        width: 100%;
        height: 168px;
        border-radius: 5px 5px 0px 0px;
        margin-bottom: 6px;
    }

    .ggs {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tgs {
        width: 24px;
        height: 16px;
        background: #F9512B;
        border-radius: 2px;
        text-align: center;
        line-height: 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 10px;
        color: #FFFFFF;
        margin-right: 10px;
        display: inline-block;
    }

    .lis_title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 13px;
        color: #333333;
        line-height: 18px;
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        padding: 0px 10px;
        margin-bottom: 4px;
    }

    .pm_span {
        padding: 0 5px;
        border-radius: 10px;
        background: linear-gradient(45deg, #f7ca9f 0%, #ffb875 100%);
        border-radius: 3px;
        height: 16px;
        font-weight: 400;
        font-size: 11px;
        color: #884b10;
        line-height: 16px;
        font-family: PingFangSC, PingFang SC;
        margin-right: 8px;
    }

    .lis_pri {
        width: 100%;
        padding: 0 10px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 16px;
        color: #F20000;
        line-height: 16px;
    }

    .yuan {
        font-size: 16px;
    }

    .or_pri {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 11px;
        color: #CCCCCC;
        line-height: 16px;
        text-decoration: line-through;
        margin-left: 6px;
    }

    .lis_num {
        font-weight: 400;
        font-size: 12px;
        color: #C0C4CC;
        line-height: 17px;
        font-family: PingFangSC, PingFang SC;
        padding: 2px 10px 10px;
    }

    .lis_dd {
        padding: 1px 4px;
        background-color: #eee;
        border-radius: 4px;
        font-size: 10px;
        color: #3030308c;
        display: inline-block;
        margin: 0 10px;

    }

    /* 新 */
    .tabs_box {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        padding: 15px 15px 4px;
        overflow-x: scroll;
        white-space: nowrap;
        background-color: #fff;
    }

    .tags_li {
        padding: 0 13px;
        text-align: center;
        display: inline-block;
        position: relative;
    }

    .aitived {
        font-weight: 600;
        font-size: 16px;
        color: #333333;
        line-height: 22px;
    }

    .line_img {
        width: 20px;
        height: 8px;
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
    }

    .boxss {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        padding: 15px 11px;
        display: flex;
        align-items: center;
    }

    .box_menu {
        width: 30%;
        height: 28px;
        display: inline-block;
    }

    .tabss {
        width: 100%;
        height: 28px;
        background: #FFFFFF;
        border-radius: 5px;
        font-size: 10px;
        display: inline-block;
    }

    .van-dropdown-menu__bar {
        height: 28px;
        font-size: 12px;
    }

    .men_li {
        width: 89px;
        height: 28px;
        background: #FFFFFF;
        border-radius: 5px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #333333;
        line-height: 18px;
        margin-left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        display: inline-block;
        text-align: center;
        line-height: 28px;
        box-shadow: 0 2px 12px rgba(100, 101, 102, .12);
    }

    .bot_img {
        width: 12px;
        height: 12px;
        margin-left: 5px;
    }

    .aitivedss {
        transform: rotate(180deg);
    }

    .loading,
    .finished-text {
        text-align: center;
        margin: 10px 0;
    }
</style>