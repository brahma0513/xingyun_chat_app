<template>
    <view v-if="localData.type === 'tradeshuyun80011'"
        :style="'padding:' + localData.content.padding_top + 'px 10px' + localData.content.padding_bottom +'px;'">
        <view class="index_serve">
            <view class="serve_lis" v-for="(dataItem, index) in localData.content.dataset" :key="index"
                @click="modeSelect(index)">
                <view class="lis_box">
                    <img class="serve_img" :src="dataItem.pic" alt="服务图片">
                    <view class="serve_name">{{ dataItem.title }}</view>
                </view>
                </a>
            </view>
        </view>
    </view>

</template>

<script>
    export default {
        name: "serviceMode",
        data() {
            return {
                localData: {},
                shared_store_list_querys: {
                    page: 1,
                    page_size: 20,
                    name: '',
                    type_id: "",
                    distance: 1,
                    latitude: "",
                    longitude: ""
                },
            }
        },

        created() {
            const that = this
            that.localData = that.$attrs.data
            http_host: this.vuex_apiUrl
        },

        methods: {
            modeSelect(index) {
                if (index == 0) {
                    this.$common.diyLinkJump('/shared_store/web/index.php?m=view&a=storeList' );
                } else if (index == 1) {
                    this.$common.diyLinkJump('/shared_store/web/index.php?m=view&a=makeStore');
                }
            }
        }
        //@click="$common.diyLinkJump(dataItem.url,h5,true)
        //页面跳转

    }
</script>

<style>
    .index_serve {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .index_serve .serve_lis {
        height: 52px;
        padding-right: 35px;
        background-color: #fff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        width: 49%;
    }

    .index_serve .serve_lis .lis_box {
        width: 142px;
        height: 52px;
        background: linear-gradient(270deg, rgba(247, 249, 255, 0) 0%, #DFE9FF 100%);
        border-radius: 10px 10px 10px 10px;
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    .index_serve .serve_lis .lis_box .serve_img {
        width: 52px;
        height: 52px;
        margin-right: 15px;
    }

    .index_serve .serve_lis .lis_box .serve_name {
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #274683;
        line-height: 21px;
    }
</style>