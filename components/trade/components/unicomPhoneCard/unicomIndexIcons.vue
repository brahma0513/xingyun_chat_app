<template>
	<view class="custom-icon">
		<block v-if="datas.content.css_type == 1">
			<view class="subscribe-list-box">
				<block v-for="(item,index) in datas.content.dataset">
					<view class="navigator" :style="'min-width:'+(1/datas.content.show_num*100)+'%'">
						<view class="subscribe-list-sbox"  @click="jump(item.link)">
							<image :src="item.pic" mode="" class="subscribe-list-img"></image>
							<text class="subscribe-list-text" :style="'color:'+item.color">{{item.title}}</text>
						</view>
					</view>
				</block>
			</view>
		</block>
		<block v-if="datas.content.css_type == 2">
			<scroll-view :scroll-x="true" class="subscribe-list-box2" v-if="!allShow">
				<block v-for="(item,index) in datas.content.dataset">
					<view class="navigator" :style="'min-width:'+(1/datas.content.show_num*100)+'%'">
						<view class="subscribe-list-sbox"  @click="jump(item.link)">
							<image :src="item.pic" mode="" class="subscribe-list-img"></image>
							<text class="subscribe-list-text" :style="'color:'+item.color">{{item.title}}</text>
						</view>
					</view>
				</block>
			</scroll-view>
			<view class="subscribe-list-box" v-else>
				<block v-for="(item,index) in datas.content.dataset">
					<view class="navigator" :style="'min-width:'+(1/datas.content.show_num*100)+'%'">
						<view class="subscribe-list-sbox"  @click="jump(item.link)">
							<image :src="item.pic" mode="" class="subscribe-list-img"></image>
							<text class="subscribe-list-text" :style="'color:'+item.color">{{item.title}}</text>
						</view>
					</view>
				</block>
			</view>
			<view v-if="datas.content.all_switch==1" :class="allShow?'switch-box icon90':'switch-box'" @click="showIcon">
				<image :src="vuex_apiUrl+'/HTML/admui/public/custom/images/icon_jian_bottom.png'" mode="widthFix" class="all-switch img"></image>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		name:"unicomIndexIcons",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				allShow:false
			};
		},
		onLoad(){},
		methods:{
			showIcon(){
				this.allShow = !this.allShow
			},
			jump:function(link){
				var user_id = this.vuex_user.user_id;
				var phone = this.vuex_user.phone;
				var full_link = link+'&wsy_user_id='+user_id+'&wsy_phone='+phone
				this.$common.diyLinkJump(full_link);
			}
		}
	}
</script>

<style>
	.subscribe-list-box{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		background: #fff;
		
	  }
	.subscribe-list-box .subscribe-list-sbox .subscribe-list-text,.subscribe-list-box2 .subscribe-list-sbox .subscribe-list-text {
		font-size:28rpx;
		color:#5d5d5d;
		width:100%;
		white-space:nowrap;
		overflow:hidden;
		line-height: 1.5
	}
	.subscribe-list-box .subscribe-list-sbox .subscribe-list-img,.subscribe-list-box2 .subscribe-list-sbox .subscribe-list-img {
		width:88rpx;
		height:88rpx;
		/* border-radius:50%; */
		overflow:hidden;
		display:block;
		margin:5px auto;
	}
	.navigator{
		text-align: center;
		min-width: 20%;
		height: 78px;
		vertical-align: middle;
		padding: 1px 0;
		font-size:0;
		display: inline-block;
	}
	.subscribe-list-box2{
		white-space: nowrap; 
		display: flex;
		background: #fff;
	}
	.custom-icon .switch-box {
	    width: 100%;
	    background: #fff;
	    padding: 10px 0;
	}
	.custom-icon .all-switch.img {
	    width: 15px;
	    display: block;
	    margin: 0 auto;
	}
	.custom-icon .icon90{
	  transform: rotate(180deg)
	}
</style>