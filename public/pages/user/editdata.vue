<template>
	<view class="edit">
		
		<u-notify ref="uNotify" message=""></u-notify>
		<view class="edit-main">
			<view class="head">
				<u-upload
					:fileList="fileList"
					@afterRead="afterRead"
					@delete="deletePic"
					name="6"
					:capture="['album']"
					:maxCount="1"
					:disabled="true"
					width="100"
					height="100"
					border="50"
				>
					<image :src="headimgurl_view" 
					mode="aspectFill" style="width: 200rpx;height: 200rpx;" class="" @tap.stop="selectAvatar"></image>
				</u-upload>
				<text>{{$t('as-set.click-change-head')}}</text>				
			</view>
			<view class="namedata">
				<view class="row-input">
					<text>{{$t('public.name')}}：</text>
					<u-input
					    :placeholder="$t('public.input-place-text')+' '+$t('public.name')"
						maxlength="16"
						fontSize="14"
						inputAlign="right"
						clearable
					    border="bottom"
					    v-model="name"
					    @change="change"
					  ></u-input>
				</view>
				<view class="row-input">
					<text>{{$t('public.sex')}}：</text>
					<view class="">
						<u-radio-group
						    placement="row"
							v-model="sex"
						>
							<u-radio activeColor="red"
								:customStyle="{marginRight: '8px'}"
								v-for="(item, index) in sexValue":key="index"
								:label="item.name"
								:name="item.value"
								@change="confSex"
							>{{$t('public.sex')}}：</u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
		</view>
		<view class="save-bottom">
			<view :class="'save-btn skin-bg-'+theme+''" @click="editProfile()">{{$t('public.confirm-update')}}</view>
		</view>
		<view>
			<u-modal :show="modalShow" showCancelButton :title="$t('public.modal-title')" :content="$t('as-set.album-permissions-open')" @confirm="confPer()" @cancel="canPer()"></u-modal>
		</view>
	</view>
</template>

<script>
	import permision from "../../../js_sdk/wa-permission/permission.js"
	import notify from "../../../uni_modules/uview-ui/components/u-notify/u-notify"
	export default {
		data() {
			return {
				http_host: '',
				theme: getApp().globalData.style_color,
				sexValue:[
					{
						value: 1,
						name: '男'
					},
					{
						value: 2,
						name: '女'
					}
				],
				headimgurl_view:"/static/images/default-head.png",
				headimgurl:"/static/images/default-head.png",
				name:"",//姓名
				sex:'1',	//性别
				fileList: [],//头像
				modalShow:false,
				isChoosingAvatar: false,
			}
		},
		onReady() {
			this.sexValue[0].name = this.$t('public.man');
			this.sexValue[1].name = this.$t('public.woman');
		},
		onLoad(){
			this.http_host = this.vuex_apiUrl;
			//permision.gotoAppPermissionSetting()
			let that = this;
		},
		onShow(){
			//console.log('vuex_user',this.vuex_user)
			this.name = this.vuex_user.weixin_name || this.vuex_user.name;
			this.sex = this.vuex_user.sex;
			if(this.vuex_user.headimgurl != ''){
				this.headimgurl = this.vuex_user.headimgurl
				this.headimgurl_view = this.vuex_user.headimgurl
			}
		},
		methods: {
			confPer(){
				this.modalShow = false
				uni.setStorageSync('avatar_album_permission_notice', true)
				this.requestPermission()
			},
			canPer(){
				//console.log('canPer')
				this.modalShow = false
			},
			selectAvatar() {
				if (this.isChoosingAvatar) {
					return;
				}
				this.requestPermission();
			},
			async checkPerssion(){
				var result = await permision.requestAndroidPermission("READ_EXTERNAL_STORAGE")
				var strStatus
				if (result == 1) {
					//strStatus = "已获得授权"
				} else if (result == 0) {
					//strStatus = "未获得授权"
				} else {
					//strStatus = "被永久拒绝权限"
					//this.modalShow = true
				}
			},
			requestPermission() {
				var notice = uni.getStorageSync('avatar_album_permission_notice') || false;
				if (notice == false) {
					this.modalShow = true;
					return;
				}

				// #ifdef APP-PLUS
				if (plus.os.name == 'Android') {
					this.requestAndroidAlbumPermission();
					return;
				}
				if (plus.os.name == 'iOS') {
					this.chooseAvatarImage();
					return;
				}
				// #endif

				this.chooseAvatarImage();
			},
			async requestAndroidAlbumPermission() {
				var permissionID = this.getAndroidAlbumPermission();
				var result = await permision.requestAndroidPermission(permissionID);
				if (result == 1) {
					uni.setStorageSync('read_external_storage', true);
					this.chooseAvatarImage();
				} else if (result == -1) {
					uni.setStorageSync('read_external_storage', false);
					uni.showToast({
						title: '相册权限已被拒绝，请在系统设置中开启',
						icon: 'none'
					});
					permision.gotoAppPermissionSetting();
				} else {
					uni.setStorageSync('read_external_storage', false);
				}
			},
			getAndroidAlbumPermission() {
				try {
					var Build = plus.android.importClass('android.os.Build');
					if (Build.VERSION.SDK_INT >= 33) {
						return 'android.permission.READ_MEDIA_IMAGES';
					}
				} catch (error) {}
				return 'android.permission.READ_EXTERNAL_STORAGE';
			},
			chooseAvatarImage() {
				var that = this;
				that.isChoosingAvatar = true;
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					success(res) {
						var tempFilePath = res.tempFilePaths[0];
						var tempFile = res.tempFiles && res.tempFiles[0] ? res.tempFiles[0] : {};
						that.afterRead({
							file: {
								url: tempFilePath,
								size: tempFile.size || 0,
								type: 'image'
							}
						});
					},
					fail(error) {
						console.log('选择头像失败：', error);
					},
					complete() {
						that.isChoosingAvatar = false;
					}
				});
			},
			// 删除图片
			deletePic(event) {
				this[`fileList`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList`].length
				lists.map((item) => {
					this[`fileList`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList`][fileListLen]
					this[`fileList`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				let that = this;
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.vuex_apiUrl+'/uniapp_template/web/index.php?m=app_user&a=img_save&xdebug=xdebug&customer_id='+that.vuex_customer_id, 
						filePath: url,
						name: 'file',
						header:{
							'X-Requested-With':'XMLHttpRequest'
						},
						success: (res) => {
							setTimeout(() => {
								var code = JSON.parse(res.data)
								that.headimgurl_view = code.fullimgurl;
								that.headimgurl = code.imgurl;
								resolve(code.fullimgurl)
							}, 1000)
						}
					});
				})
			},
			change(){
				
			},
			//性别选中
			confSex(e){
			},
			editProfile(){
				var that = this;
				var headimgurl = this.headimgurl;
				// if (this.$u.test.url(headimgurl)) {
				// 	headimgurl = ''
				// }
				const params = {
					name:  this.name,
					sex:   this.sex,
					headimgurl: headimgurl,
				};
				this.$common.showLoading();
				var vuex_user = that.vuex_user;
				this.$api.editProfile(params).then(res => {
					if (res.errcode == 0) {
						vuex_user.weixin_name = params.name;
						vuex_user.sex = res.data.userinfo.sex;
						vuex_user.headimgurl = res.data.userinfo.headimgurl;
						this.$u.vuex('vuex_user', vuex_user);
						this.$common.showToast('保存成功');
						setTimeout(function() {
							uni.navigateBack({})
						}, 1000);
					}else{
						if(res.errmsg){
							uni.showToast({
								title: res.errmsg,
								icon: 'none'
							})
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color:#f6f6f6;
	}
	.edit{
		&-main{
			background-color:#ffffff;
			border-radius: 20rpx;
			width:680rpx;
			height:700rpx;
			margin:60rpx auto;
			display:flex;
			align-items: center;
			justify-content:center;
			flex-direction:column;
			.head{
				display:flex;
				flex-direction:column;
				align-items: center;
				image{
					width: 100px;
					height: 100px;
					margin-bottom:20rpx;
				}
				text{
					font-size:24rpx;
					color:#999;
				}
			}
			.namedata{
				display:flex;
				flex-direction:column;
				width:580rpx;
				margin:30rpx auto;
				.row-input{
					margin-top:30rpx;
					display:flex;
					justify-content: space-between;
					align-items:center;
					.company-value{
						display: flex;
						align-items: center;
						padding:20rpx 10rpx;
					}
					.right-icon{
						width:26rpx;
						height:30rpx;
					}
					text{
						font-size:26rpx;
						color:#666;
					}
				}
			}
		}
		.save-bottom{
			width:100%;
			position: absolute;	
			text-align: center;
			.save-btn{
				width:400rpx;
				height:80rpx;
				color:#ffffff;
				font-size:28rpx;
				line-height:80rpx;
				text-align: center;
				margin:auto;
				border-radius:80rpx;
			}
		}
	}
	
	
	.container-form {
		&-item {
			margin: 14rpx 0;
			background-color: #fff;
			
			&-upload {
				&-default {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 210rpx;
					height: 210rpx;
					border-radius: 50%;
					font-size: 30rpx;
					color: #999;
					background-color: #f5f5f5;
				}
	
				&>view:nth-child(3n) {
					margin-right: 0;
				}
	
				&-preview {
					position: relative;
					top: 0;
					left: 0;
					width: 210rpx;
					height: 210rpx;
					border-radius: 50%;
	
					&-dels {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
						position: absolute;
						z-index: 10;
						background: rgba(0, 0, 0, 0.6);
	
						image {
							width: 120rpx;
							height: 120rpx;
							position: absolute;
							top: 25%;
							left: 25%;
							z-index: 10;
						}
					}
					&-del {
						position: absolute;
						top: -12rpx;
						right: -12rpx;
						z-index: 10;
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}
	}
</style>
