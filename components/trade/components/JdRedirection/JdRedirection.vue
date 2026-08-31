<template>
	<view>

	</view>
</template>

<script>
	export default {
		name: "JdRedirection",
		props: {
			datas: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
			};
		},
		created() {
			this.redirect();
		},
		methods: {
			//重定向
			redirect() {
				console.log("进来重定向+url:" + this.datas.content.url);
				uni.setStorageSync("weburl", this.datas.content.url)
				var full_link = "/pages/webview_custom/webview_custom";
				uni.redirectTo({
					url: full_link
				});
			}
		}
	}
</script>

<style>

</style>