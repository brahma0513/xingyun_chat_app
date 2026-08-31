<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		name:"testCom",
		props:{
			data:{
				type:Object,
				default: {}
			}
		},
		data() {
			return {
				testA:''
			};
		},
		created(){
			//console.log(this.data)
		}
	}
</script>

<style>

</style>
