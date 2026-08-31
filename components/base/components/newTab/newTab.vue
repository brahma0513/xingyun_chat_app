<template>
	<view>
		<view :class="fixed==true?'immersion-fixed':'immersion-relative'" :style="'background-color: '+(datas.content.select_bg_model==1?datas.content.bg_color:'transparent')+';background-image: '+(datas.content.select_bg_model==2?'linear-gradient('+datas.content.gradient_angle+','+datas.content.gradient_color1+','+datas.content.gradient_color2+')':datas.content.select_bg_model==3?'url('+datas.content.bg_img+')':'none')+';border-radius:'+(datas.content.radius_diy+'px '+datas.content.radius_diy)+'px 0px 0px;padding: '+(datas.content.padding_top+'px '+datas.content.padding_horizontal+'px '+datas.content.padding_bottom)+'px;overflow:hidden;background-size:cover;'">
					<view style="position:relative;">
						<scroll-view id="scrollView" scroll-x="true" scroll-with-animation :scroll-left="slider.scrollLeft">
							<view style="overflow-x:auto;" :class="((datas.content.select_style==1&&datas.content.display_method==2)||(datas.content.select_style==2&&datas.content.tab_show==4)?'flex-def flex-zBetween':'text-nowrap')+' flex-cEnd flex-nowrap'" :style="datas.content.select_style==1&&datas.content.display_method==1?`width:${slider.width*tabListSlider.length-10}px`:''">
								<block v-for="(it,it_index) in datas.content.dataset">
									<view v-if="datas.content.select_style==1" class="inline-block padding-10 text-nowrap" :style="(datas.content.select_style==1&&datas.content.display_method==1)?'max-width:':'min-width:'+(datas.content.display_method==2?'25%':datas.content.dataset.length>=4?'20%':'auto')+';box-sizing: border-box;'" @click="selectIndex" :data-index="it_index" :data-tablink="it.tab_link" :id="`tab_${it_index}`" >
											<view :style="'font-size:'+(it_index==select_index?datas.content.select_font_size:datas.content.unselect_font_size)+'px;color:'+(it_index==select_index?datas.content.select_font_color:datas.content.unselect_font_color)+';position:relative;'" :class="'text-center '+((datas.content.select_font_style == 2&&it_index==select_index)||(datas.content.unselect_font_style == 2&&it_index!=select_index)?'font-weight-800':'')">
												{{it.title}}
												<view v-if="it_index==select_index" class="underline flex-def flex-zCenter flex-cCenter">
												  <view class="underline-div" :style="'background-color:'+(datas.content.underline_select_bg_model==1?datas.content.underline_color:'transparent')+';background-image: '+(datas.content.underline_select_bg_model==2?'linear-gradient('+datas.content.underline_gradient_angle+','+datas.content.underline_gradient_color1+','+datas.content.underline_gradient_color2+')':'none')+';border-radius:'+(datas.content.underline_style==1?'3px':'initial')+';'"></view>
												</view>
											</view>
									</view>
									
									<view v-if="datas.content.select_style==2&&(datas.content.tab_show==2?it_index<2:it_index<4)" class="inline-block padding-vertical-5 padding-horizontal-10" :style="'background-color: '+(it_index==select_index&&datas.content.underline_select_bg_model==1?datas.content.underline_color:'transparent')+';background-image: '+(it_index==select_index&&datas.content.underline_select_bg_model==2?'linear-gradient('+datas.content.underline_gradient_angle+','+datas.content.underline_gradient_color1+','+datas.content.underline_gradient_color2+')':'none')+';border-radius:'+(it_index==select_index?'30px':'initial')+';position:relative;width:25%;border-radius:14px;box-sizing: border-box;'" @click="selectIndex" :data-index="it_index" :data-tablink="it.tab_link" :id="`tab_${it_index}`">
											<view class="text-center" :style="'font-size:'+(it_index==select_index&&datas.content.select_font_style2==2?'16px':'14px')+';color:'+((it_index==select_index?datas.content.select_font_color:datas.content.unselect_font_color))">{{it.title}}</view>
									</view>
								</block>
							</view>
						</scroll-view>
						<view v-if="datas.content.select_style==1&&datas.content.select_bg_model==1&&datas.content.style_select1==2" :style="'background-image:linear-gradient(to right,transparent,'+datas.content.bg_color+');'" class="gradient"></view>
					</view>
			
		</view>	
		<!-- 沉浸占位 -->
		<view v-if="fixed==true" :style="'height:' + currenctHeight + 'px;'"  ></view>
	</view>
</template>

<script>
	export default {
		name:"newTab",
		props:{
			//键名
			indexs: {
				type: Number,
				default: -1
			},
			datas:{
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				tabId:'',
				select_index:0,
				sec_module_content: {},
				
				tabListSlider: [],
				slider: {
					left: 0,
					width: 0,
					scrollLeft: 0
				},
				currenctHeight: 40,	//当前组件高度
				fixed:false,
			};
		},
		watch: {
			slider: {
				handler() {

				},
				deep: true
			}
		},
		created(){
			//如果放在头部第1和2的位置就固定在头部
			var module_index_list =  this.$cache.get('currenct_module_list');
			if(this.indexs==0){
				this.fixed=true;
			}else{
				if(module_index_list[0]['type']=='trade_index_bar'&&this.indexs==1){
					this.fixed=true;
				}
			}
			if(this.datas.content.fixed==2){
				//后台设置了不悬浮
				this.fixed=false;
			}
			
		},	
		mounted() {
			const that=this
			that.tabId = that.datas.diy_tem_contid;
			
			setTimeout(function(){
				that.$nextTick(() => {
					that.calcScrollPosition();
				})
			},600)
		},
		methods:{
			calcScrollPosition() {
				const query = uni.createSelectorQuery().in(this);
			
				query.select('#scrollView').boundingClientRect((res) => {
					this.scorll = res;
					this.updateTabWidth();
				}).exec();
			},
			updateTabWidth(index = 0) {
				let that = this;
				var data = [...this.datas.content.dataset];
				
				if(that.datas.content.select_style==2){
					data = this.datas.content.dataset.slice(0,that.datas.content.tab_show);
				}
			
				if (data.length == 0) return false;
			
				const query = uni.createSelectorQuery().in(this);
				query.select('#tab_' + index).boundingClientRect((res) => {
					that.currenctHeight = res.height;
					data[index]._slider = {
						width: res.width,
						left: res.left,
						scrollLeft: res.left - (data[index - 1] ? data[index - 1]._slider.width : 0),
					};
					that.tabListSlider = data
					if (that.select_index == index) {
						that.tabToIndex(that.select_index);
					}
			
					index++;
					if (data.length > index) {
						that.updateTabWidth(index);
					}
				}).exec();
			},
			tabToIndex(index) {
				let _slider = this.tabListSlider[index]._slider;
				let width = _slider.width;
				let scorll_left = this.scorll.left || 0;
			
				this.slider = {
					left: _slider.left - scorll_left + (_slider.width - width) / 2,
					width: width,
					scrollLeft: _slider.scrollLeft - scorll_left,
				}
			},
			
			//标签页组件选择
			selectIndex(e){
				const self=this;
				let index=e.currentTarget.dataset.index
				let tablink=e.currentTarget.dataset.tablink
				self.tabToIndex(index);
				self.select_index = index;
				if(self.datas.content.tab_link_type==1){
					//显示二级页面内容
					self.templateCombinationSelect(tablink);
				}else{
					//本页组件
					let tabId=this.datas.diy_tem_contid
					if(tablink){
						// 子组件传值，父组件监听跳转
						var parentValue = {
							"op": 'tabSel',
							"tablink": tablink
						};
						self.$emit('handelParent',parentValue)
					}
				}
				
			},
			//获取二级页面内容
			templateCombinationSelect(template_id){
				var self = this;
				var params = {
					template_id:template_id
				};
				var module_index_list =  self.$cache.get('currenct_module_list');
				var new_module_list = [];
				var old_module_list = [];
				self.$api.getTemplateSon(params).then(res=>{
					if (res.errcode == 0){
						var lists = res.data.lists
						self.sec_module_content = lists
						module_index_list.forEach(function(item,idx) {
							if(idx<=self.indexs){
								new_module_list.push(item)
							}
						})
						lists.forEach(function(item,idx) {
							new_module_list.push(item)
						})
						var parentValue = {
							"op": 'refresh',
							"lists": new_module_list,
							"template_id": template_id,
							'old_lists':old_module_list,
						};
						self.$emit('handelParent',parentValue)
					}else{
					}
				})
			}
		},
		computed:{
			//获取系统状态栏高度
			statusBarHeight(){
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight
			}
		}
	}
</script>

<style>
	.padding-0 {
	  padding: 0px;
	}
	
	.padding-10 {
	  padding: 10px;
	}
	
	.padding-vertical-5 {
	  padding-top: 5px;
	  padding-bottom: 5px;
	}
	
	.padding-horizontal-10 {
	  padding-left: 10px;
	  padding-right: 10px;
	}
	
	.margin-0 {
	  margin: 0px;
	}
	
	.margin-right-5 {
	  margin-right: 5px;
	}
	
	.inline-block {
	  display: inline-block !important;
	}
	
	.text-center {
	  text-align: center;
	}
	
	.text-nowrap {
	  white-space: nowrap;
	}
	
	.font-weight-800 {
	  font-weight: 800;
	}
	
	.gradient{
	  position: absolute;
	  top: 0;
	  right: 0;
	  width: 10%;
	  height: 100%;
	}
	.underline{
	  position:absolute;
	  bottom:-4px;
	  left:0;
	  width:100%;
	  margin-left: 0px;
	}
	.underline-div{
	  height: 3px;
	  width: 50%;
	}
	/*flex兼容写法start*/
	
	/* 定义 */
	.flex-def {display: -webkit-flex; display: flex; }
	/* 主轴居中 */
	.flex-zCenter {-webkit-justify-content: center;justify-content: center;}
	/* 主轴居中 */
	.flex-zAround {-webkit-justify-content: space-around;justify-content: space-around;}
	/* 主轴两端对齐 */
	.flex-zBetween {-webkit-justify-content: space-between;justify-content: space-between;}
	/* 主轴end对齐 */
	.flex-zEnd {-webkit-justify-content: flex-end;justify-content: flex-end;}
	/* 主轴start对齐 */
	.flex-zStart {-webkit-justify-content: start;justify-content: start;}
	/* 侧轴居中 */
	.flex-cCenter {-webkit-align-items: center;align-items: center;}
	/* 侧轴start对齐 */
	.flex-cStart {-webkit-align-items: start;align-items: start;}
	/* 侧轴底部对齐 */
	.flex-cEnd {-webkit-align-items: flex-end;align-items: flex-end;}
	/* 侧轴头部对齐 */
	.flex-ctopEnd {-webkit-align-items: end;align-items: end;}
	/* 侧轴文本基线对齐 */
	.flex-cBaseline {-webkit-align-items: baseline;align-items: baseline;}
	/* 侧轴上下对齐并铺满 */
	.flex-cStretch {-webkit-align-items: stretch;align-items: stretch;}
	/* 主轴从上到下 */
	.flex-zTopBottom {-webkit-flex-direction: column;flex-direction: column;}
	/* 主轴从下到上 */
	.flex-zBottomTop {-webkit-flex-direction: column-reverse;flex-direction: column-reverse;}
	/* 主轴从左到右 */
	.flex-zLeftRight {-webkit-flex-direction: row;flex-direction: row;}
	/* 主轴从右到左 */
	.flex-zRightLeft {-webkit-flex-direction: row-reverse;flex-direction: row-reverse;}
	/* 是否允许子元素伸缩 */
	.flex-item {-webkit-flex-grow: 1;flex-grow: 1;}
	/*子元素换行*/
	.flex-wrap {-moz-flex-wrap:wrap;flex-wrap:wrap;}
	/* 子元素的显示次序 */
	.flex-order{-webkit-order: 1;order: 1;}
	/*元素比例*/
	.flex-one{-webkit-flex: 1; flex: 1;}
	
	/*flex兼容写法end*/
	
	
	.svod-container {
	    position: relative;
	    background-color: #fff;
	}
	.immersion-fixed{
		position: fixed;
		width: 100%;
		z-index: 101;
	}
	.immersion-relative{
		position: relative;
	}
</style>