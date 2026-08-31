<template>
	<view>
		<!-- 底部tab公共组件 -->
		<bottom v-if="datas.has_bottom" ></bottom>
		<bottom v-else :has_template_id="datas.has_template_id" :tem_id="datas.template_id"></bottom>
		
		<suspend :has_template_id="datas.has_template_id?datas.has_template_id:false" :tem_id="datas.template_id" :callback="suspend_callback" @topEvent="topEvent" ></suspend>
	</view>
        
</template>
<script>
	import bottom from '@/components/pagecom/components/bottom/bottom.vue'
	import suspend from '@/components/pagecom/components/suspend/suspend.vue'
	export default {
		components: {
			bottom,
			suspend
		},
		name: "pagecom",
		props:{
			datas:{
				type: Object,
				default: {}
			}
		},
		created(){
			
		},
		methods:{
			topEvent:function(){
				this.$emit("toScrollTop")
			},
			suspend_callback:function(){
				
			}
		}
	}
</script>