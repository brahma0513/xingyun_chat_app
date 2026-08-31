<template>
	
	<view class="hx-navbar" :style="{width:screenWidth + 'px',position: conf.fixed?'fixed':'relative'}">
		<view class="hx-navbar__content"
		:class="{'hx-navbar__fixed': conf.fixed,'hx-navbar__shadow':conf.shadow,'hx-navbar__border':conf.border}"
		:style="{width:screenWidth + 'px','background-color': !bgIsLine ? backgroundColorRgba : '','background-image':bgIsLine ? backgroundColorRgba : '',height: navbarHeight, color: txtColor}">
			<!-- <block v-if="backgroundImage">
				<view class="hx-navbar__img" :style="{'background-image': backgroundImageEnd,'opacity': bgImgTransparent[1]}"></view>
				<view class="hx-navbar__img" :style="{'background-image': backgroundImage,'opacity': bgImgTransparent[0]}"></view>
			</block> -->
			<view class="hx-navbar__content__imgctn" :style="{'opacity': bgImgTransparent[1]}" v-if="backgroundImage">
				<image class="hx-navbar__imgctn__img" :style="{'height': conf.height + statusBarHeight + 'px',width:screenWidth + 'px'}" :src="backgroundImageEnd" mode="scaleToFill"></image>
			</view>
			<view class="hx-navbar__content__imgctn" :style="{'opacity': bgImgTransparent[0]}" v-if="backgroundImage">
				<image class="hx-navbar__imgctn__img" :style="{'height': conf.height + statusBarHeight + 'px',width:screenWidth + 'px'}" :src="backgroundImage" mode="scaleToFill"></image>
			</view>
			<!-- #ifndef H5 -->
			<!-- 状态栏 -->
			<view :style="'height:' + statusBarHeight + 'px;' + (statusBarBackground ? 'background-color:'+ statusBarBackground : '')"  class="hx-navbar__status" v-if="conf.statusBar" ></view>
			<!-- #endif -->
			<!-- 小程序分开编译 -->
			<!-- #ifdef MP -->
			<view class="hx-navbar__content__main" :style="{ height: conf.height + 'px', fontSize: conf.fontSize,maxWidth: `calc(100vw - ${jnWidth}px - 13px)`}">
			<!-- #endif -->
				
			<!-- #ifndef MP -->
			<view class="hx-navbar__content__main" :style="{ height: conf.height + 'px', fontSize: conf.fontSize}">
			<!-- #endif -->
				<!-- 不是app的时候中返回和left在前面 -->
				<!-- #ifndef APP-PLUS-NVUE -->
				<view class="hx-navbar__content__main_back"  @tap="onBack" v-if="conf.back">
					<text class="hxicon hx-navbar__icon" :class="{'hx-navbar__icontran':bgTransparent == 0}" :style="{color: txtColor}">&#xf0343;</text>
					<text class="hx_font_size" :style="{color: txtColor}" v-if="conf.backTxt">{{conf.backTxt}}</text>
				</view>
				<view class="hx-navbar__content__main_left" style="padding: 0;margin:0 13px 0 0;" v-if="conf.leftSlot">
					<slot name="leftSwitch" v-if="conf.leftSlotSwitch && slotSwitchOpacity == 0" />
					<slot name="left" v-else></slot>
				</view>
				<view class="hx-navbar__content__main_left" :style="{'padding': conf.back ||conf.leftSlot ? '0' : '0 9px 0 13px;' }"  v-if="conf.leftButton">
					<block v-for="(btn,index) in conf.leftButton" :key="index">
						<view class="hx-navbar__content__main_left_btn" @tap="onClickBtn(btn)" :class="{'hx-navbar__btntran':bgTransparent == 0}">
							<text v-if="btn.position && btn.position == 'left'" class="hx-navbar__icon" :class="conf.font" :style="{color:btn.color ? btn.color : txtColor,marginRight:btn.txt ? '2px': '0'}">{{iconHandle(btn.icon)}}</text>
							<text class="hx-navbar__content__main_lefticon_txt hx_font_size" :style="{color:btn.color ? btn.color : txtColor}"  v-if="btn.txt">{{btn.txt}}</text>
							<text v-if="!btn.position || btn.position != 'left'" class="hx-navbar__icon" :class="conf.font" :style="{color:btn.color ? btn.color : txtColor,marginLeft:btn.txt ? '2px': '0'}">{{iconHandle(btn.icon)}}</text>
						</view>
					</block>
				</view>
				<!-- #endif -->
				
				<view class="hx-navbar__content__main_center" v-if="!conf.search && !conf.maxSlot">
					<view class="hx-navbar__content__main_center_flex"></view>
					<view class="hx-navbar__content__main_center_txt" >
						<text class="hx_font_size hx_text_overflow" :style="{color: txtColor}" v-if="!conf.centerSlot && title">{{title}}</text>
						
						<slot name="centerSwitch" v-if="conf.centerSlotSwitch && slotSwitchOpacity == 0"/>
						<slot name="center" v-else/>
					</view>
					<view class="hx-navbar__content__main_center_flex"></view>
				</view>
				
				<view class="hx-navbar__content__main_center" style="overflow: hidden" v-if="!conf.search && conf.maxSlot">
					<slot name="maxSwitch" v-if="conf.maxSlotSwitch && slotSwitchOpacity == 0" />
					<slot name="max"  v-else />
				</view>
				
				<!-- #ifdef APP-PLUS-NVUE -->
				<view class="hx-navbar__content__main_back"  @tap="onBack" v-if="conf.back">
					<text class="hxicon hx-navbar__icon" :class="{'hx-navbar__icontran':bgTransparent == 0}" :style="{color: txtColor}">&#xf0343;</text>
					<text class="hx_font_size" :style="{color: txtColor}" v-if="conf.backTxt">{{conf.backTxt}}</text>
				</view>
				<view class="hx-navbar__content__main_left" style="padding: 0;margin:0 13px 0 0;"  v-if="conf.leftSlot">
				
					<slot name="leftSwitch" v-if="conf.leftSlotSwitch && slotSwitchOpacity == 0" />
					<slot name="left" v-else></slot>
				</view>
				<view class="hx-navbar__content__main_left" :style="{'padding': conf.back ||conf.leftSlot ? '0' : '0 9px 0 13px;' }"  v-if="conf.leftButton">
					<block v-for="(btn,index) in conf.leftButton" :key="index">
						<view class="hx-navbar__content__main_left_btn" @tap="onClickBtn(btn)" :class="{'hx-navbar__btntran':bgTransparent == 0}">
							<text v-if="btn.position && btn.position == 'left'" class="hx-navbar__icon" :class="conf.font" :style="{color:btn.color ? btn.color : '',marginRight:btn.txt ? '2px': '0'}">{{iconHandle(btn.icon)}}</text>
							<text class="hx-navbar__content__main_lefticon_txt hx_font_size" :style="{color:btn.color ? btn.color : txtColor}"  v-if="btn.txt">{{btn.txt}}</text>
							<text v-if="!btn.position || btn.position != 'left'" class="hx-navbar__icon" :class="conf.font" :style="{color:btn.color ? btn.color : '',marginLeft:btn.txt ? '2px': '0'}">{{iconHandle(btn.icon)}}</text>
						</view>
					</block>
				</view>
				<!-- #endif -->
				
				<view class="hx-navbar__content__main_search" :style="{'padding-left': conf.leftButton ? '9px' : '13px','padding-right': conf.rightButton ? '9px' : '13px'}" v-if="conf.search&&conf.search.show==true" @click="searchClick">
					<text class="hxicon hx-navbar__content__main_search_hxicon" style="color:#dbdbdb;">&#xe63b;</text>
					<input type="text"
					class="hx-navbar__content__main_search_input hx_font_size"
					placeholder-style="color:#dbdbdb;"
					confirm-type="search"
					:value="conf.search.value" 
					:placeholder="conf.search.placeholder ? conf.search.placeholder : '请输入搜索内容'" 
					:disabled="conf.search.disabled"
					@confirm="searchConfirm"/>
				</view>
				
				<!-- #ifndef MP -->
				<view class="" style="flex: 1;" v-if="!conf.search"></view>
				<!-- #endif -->
				
				
				<view class="hx-navbar__content__main_right" :style="{padding: conf.rightSlot ? '0' : '0 13px 0 9px;'}" v-if="conf.rightButton">
					<block v-for="(btn,index) in conf.rightButton" :key="index">
					<view class="hx-navbar__content__main_right_btn" @tap="onClickBtn(btn)" :class="{'hx-navbar__btntran':bgTransparent == 0}">
						<text v-if="btn.position && btn.position == 'left'" class="hxicon hx-navbar__content__main_right_icon hx-navbar__icon" :class="conf.font" :style="{color:btn.color ? btn.color : '',marginRight:btn.txt ? '2px': '0'}">{{iconHandle(btn.icon)}}</text>
						<text class="hx-navbar__content__main_right_txt hx_font_size" :style="{color:btn.color ? btn.color : txtColor}" v-if="btn.txt">{{btn.txt}}</text>
						<text v-if="!btn.position || btn.position != 'left'" class="hxicon hx-navbar__content__main_right_icon hx-navbar__icon" :class="conf.font" :style="{color:btn.color ? btn.color : '',marginLeft:btn.txt ? '2px': '0'}">{{iconHandle(btn.icon)}}</text>
					</view>
					</block>
				</view>
				<view class="hx-navbar__content__main_right" style="padding: 0;margin: 0;" v-if="conf.rightSlot">
					<slot name="rightSwitch" v-if="conf.rightSlotSwitch && slotSwitchOpacity == 0"/>
					<slot name="right" v-else />
					<!-- 滑动过度 和 突变两种模式，因不实用在此先注释 -->
					<!-- <view v-if="conf.rightSlotSwitch && (conf.slotSwitch == 1 || conf.slotSwitch == 2 && slotSwitchOpacity == 0) " :style="{'opacity': 1 - slotSwitchOpacity,top:statusBarHeight+ 1 + 'px'}">
						<slot name="rightSwitch" />
					</view>
					<view v-if="conf.slotSwitch == 1 || (conf.slotSwitch == 2 && slotSwitchOpacity != 0)"   :style="{'opacity': conf.slotSwitch == 1 ? slotSwitchOpacity : 1,top:statusBarHeight + 1 + 'px'}">
						<slot name="right" />
					</view> -->
				</view>
			</view>
			
		</view>
		<!-- 占位符，一般都需要 -->
		<view v-if="conf.barPlaceholder && conf.fixed">
		  <view :style="{ height: statusBarHeight  + 'px'}" v-if="conf.statusBar" />
		  <view :style="{ height: conf.height + 'px'}" />
		</view>
	</view>
	
</template>

<script>
	// #ifdef APP-PLUS-NVUE
	var domModule = weex.requireModule('dom');
	var b64 = 'AAEAAAALAIAAAwAwR1NVQiCLJXoAAAE4AAAAVE9TLzI8J2LPAAABjAAAAGBjbWFwLOPU/gAAArQAAAQWZ2x5ZqhODB0AAAc0AAAtEGhlYWQkob0XAAAA4AAAADZoaGVhB94DswAAALwAAAAkaG10eMgAAAAAAAHsAAAAyGxvY2EguxVEAAAGzAAAAGZtYXhwAUYA1wAAARgAAAAgbmFtZRCjPLAAADREAAACZ3Bvc3RD6q83AAA2rAAAAhEAAQAAA4D/gABcBAAAAAAABAAAAQAAAAAAAAAAAAAAAAAAADIAAQAAAAEAACRdRHdfDzz1AAsEAAAAAADgwTyQAAAAAODBPJAAAP+1BAADRQAAAAgAAgAAAAAAAAABAAAAMgDLAAoAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKADAAPgACREZMVAAObGF0bgAaAAQAAAAAAAAAAQAAAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAQEAAGQAAUAAAKJAswAAACPAokCzAAAAesAMgEIAAACAAUDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFBmRWQAwOYS//8DgP+AAAAD3ACAAAAAAQAAAAAAAAAAAAAAAAACBAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAAAAAFAAAAAwAAACwAAAAEAAABugABAAAAAAC0AAMAAQAAACwAAwAKAAABugAEAIgAAAAGAAQAAQAC5iLmQ///AADmEuYl//8AAAAAAAEABgAmAAAAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAAAEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAlwAAAAAAAAAMQAA5hIAAOYSAAAAAgAA5hMAAOYTAAAAAwAA5hQAAOYUAAAABAAA5hUAAOYVAAAABQAA5hYAAOYWAAAABgAA5hcAAOYXAAAABwAA5hgAAOYYAAAACAAA5hkAAOYZAAAACQAA5hoAAOYaAAAACgAA5hsAAOYbAAAACwAA5hwAAOYcAAAADAAA5h0AAOYdAAAADQAA5h4AAOYeAAAADgAA5h8AAOYfAAAADwAA5iAAAOYgAAAAEAAA5iEAAOYhAAAAEQAA5iIAAOYiAAAAEgAA5iUAAOYlAAAAEwAA5iYAAOYmAAAAFAAA5icAAOYnAAAAFQAA5igAAOYoAAAAFgAA5ikAAOYpAAAAFwAA5ioAAOYqAAAAGAAA5isAAOYrAAAAGQAA5iwAAOYsAAAAGgAA5i0AAOYtAAAAGwAA5i4AAOYuAAAAHAAA5i8AAOYvAAAAHQAA5jAAAOYwAAAAHgAA5jEAAOYxAAAAHwAA5jIAAOYyAAAAIAAA5jMAAOYzAAAAIQAA5jQAAOY0AAAAIgAA5jUAAOY1AAAAIwAA5jYAAOY2AAAAJAAA5jcAAOY3AAAAJQAA5jgAAOY4AAAAJgAA5jkAAOY5AAAAJwAA5joAAOY6AAAAKAAA5jsAAOY7AAAAKQAA5jwAAOY8AAAAKgAA5j0AAOY9AAAAKwAA5j4AAOY+AAAALAAA5j8AAOY/AAAALQAA5kAAAOZAAAAALgAA5kEAAOZBAAAALwAA5kIAAOZCAAAAMAAA5kMAAOZDAAAAMQAPA0MADwNDAAAAAQAAAAAAAAAmAHwA+AFoAe4CSAKqAwoDfAPsBI4E/gWyBlYGvAcwB+AIOAioCRAJjAoICnQKvAsWC7gMTgzoDWAOhA7kD1wP8hBaEPwRRhGaEf4SaBMEE2QT9hRMFNoVWhWMFdoWFBaIAAAAAQAA/8ACHgNBABEAAAUJATY0JiIHAQYXBhcBFjI2NAIV/ncBiQkTGwn+ZAsCAgsBnAkbEwkBiQGJCRsTCf5kCw8QDP5kCRMbAAAAAAUAAP/iA6ADHwAPABMAHwArADcAAAUhIiY1ETQ2MyEyFhURFAYlIREhBSMiJjQ2OwEyFhQGByEiJjQ2MyEyFhQGByEiJjQ2MyEyFhQGA2v9KxUfHxUC1RYeHv0dAsX9OwItxAwSEgzEDRERDf52DRERDQGKDRERDf6CDBISDAF+DRERHh8VAtQWHh4W/SwVHzwCxKsRGRISGRG+EhgSEhgSvBIYEhIYEgAAAAAFAAD/4QOfAx8AJgAyAD8ASwBYAAAFISIuATURNDYyFhURFBYzITI2NRE0JiMhIiY0NjMhMh4BFREUDgEDIyImNDY7ATIWFAYHIiY9ATQ2MhYdARQGASMiJjQ2OwEyFhQGJyImPQE0NjIWHQEUBgMP/eMnQicSGRExIwIdIzExI/5PDBISDAGxJ0InJ0JBxQwSEgzFDBISBQ0RERkSEv7RxAwSEgzEDRER2A0RERkSEh4lQCYCJgwSEgz92iEuLiECJiEuEhgSJUAm/domQCUCfREZEhIZEcARDbwMEhIMvA0R/sYRGRISGREEEQ28DRERDbwNEQAAAAQAAP/hA58DHwAmAD8AQABJAAAFISIuATURNDYyFhURFBYzITI2NRE0JiMhIiY0NjMhMh4BFREUDgElIi4BNwE2MzEyHwElNh4BBgcFBiYvAQMGASMUFjI2NCYiBgMP/eMnQicSGRExIwIdIzExI/5PDBISDAGxJ0InJ0L9VQwRAggBDAkODQmtAQYMFggMC/7nCBIGpPUJAiNGKTopKTopHiVAJgImDBISDP3aIS4uIQImIS4SGBIlQCb92iZAJaQPGQoBLgoLylcEDBcWBF4DBQfA/uwKAZkdKSk6KSkAAwAA/+EDnwMfACYAMwBcAAAFISIuATURNDYyFhURFBYzITI2NRE0JiMhIiY0NjMhMh4BFREUDgEBIiY9ATQ2MhYdARQGAyIuAjQ2NzYyFhQHDgEUHgIyNjc+AScuAScmNDYyFx4BFxYGBw4BAw/94ydCJxIZETEjAh0jMTEj/k8MEhIMAbEnQicnQv7JDRERGRISDDBXQyQkIggZEgkZGxsyQUdBGRwbBAMaFgkSGQkdIwQFJCUiVx4lQCYCJgwSEgz92iEuLiECJiEuEhgSJUAm/domQCUBshIMnQwSEgydDBL+/iRDV19WIgkSGAkZQUdBMxoaGhxKKB84FgkYEgkdSyk1ZCYhJAAAAAIAAP/hA58DHwAmADoAAAUhIi4BNRE0NjIWFREUFjMhMjY1ETQmIyEiJjQ2MyEyHgEVERQOASUjIi8BJj4BFh8BEz4BHgEHAwYjAw/94ydCJxIZETEjAh0jMTEj/k8MEhIMAbEnQicnQv6kAQ0JsAgCExkImeYIGRICCP0JDh4lQCYCJgwSEgz92iEuLiECJiEuEhgSJUAm/domQCXbC80KGBECCrMBAwkCERgK/uMKAAAAAAMAAP/hA58DHwAmADQAQgAABSEiLgE1ETQ2MhYVERQWMyEyNjURNCYjISImNDYzITIeARURFA4BJTEiJjUTNDYyFhUDFAY3MRQGIyUiJj4BMwUyFgMP/eMnQicSGRExIwIdIzExI/5PDBISDAGxJ0InJ0L+yg0RAhIZEQIS7hUP/lUOFQEUDwGrDhUeJUAmAiYMEhIM/dohLi4hAiYhLhIYEiVAJv3aJkAlpBUOAasPFBUO/lUPFPcMEgMRGRIDEQAAAAAEAAD/4QOfAx8AJgA0ADUAQQAABSEiLgE1ETQ2MhYVERQWMyEyNjURNCYjISImNDYzITIeARURFA4BJTEiJjUTNDYyFhUDFAYDIxQeATI+ATU0JiIGAw/94ydCJxIZETEjAh0jMTEj/k8MEhIMAbEnQicnQv7KDRECEhkRAhILMA0WGhYNHCgcHiVAJgImDBISDP3aIS4uIQImIS4SGBIlQCb92iZAJXoSDAFuDBISDf6TDRECBQ0XDQ0XDRQcHAAFAAD/vwO/Az8AEAARAB4AMwBIAAAlIi8BMSYnJj4BHwEeAQcOAScHIiY9ATQ2MhYdARQGEyInJicmNDc2NzYyFxYXFhQHBgcGAyIHBgcGFBcWFxYyNzY3NjQnJicmApcGBsgPBQQJGQ3JDAwFBBHSBw4TExwTEyl5aWU7PT07ZWnyaWU7PT07ZWl5Z1lXMjQ0MldZzllWMzQ0M1ZZxgNLBg4LGAsESwUZDQoMbR8TDvYOExMO9g4T/qw9O2Zo82hlOz4+O2Vo82hmOz0DPDQyV1jPWVYzNDQzVlnPWFcyNAAAAAAEAAD/4QOgAx4ALQA6AEoATgAABSEiLgE1ETQ+ATMhMh4BFREUBiImNRE0JiMhIgYVERQWMyEyNjU0NjIWFRQOAQMiJj0BNDYyFh0BFAYXISImNRE0NjMhMhYVERQGJSERIQMQ/eInQicnQicCHidCJxIZETEj/eIjMTEjAh4jMREZEidC2QwSEhgSEmn+XBEZEw0BuA0TGf5dAYD+gB8mPyYCJiZAJSVAJv7DDBISDAE9IS4uIf3aIS4uIQ0REQ0mPyYCAxIMmA0REQ2YDBJsGRIBWA0TEg7+qBIZPAErAAcAAP/oA54DHQALAC0ASwBYAGUAZgBvAAAlISImNDYzITIWFAYXISIuAjURND4COwE3PgEzITIWHwEzMh4CFREUDgIBIgYVERQWMyEyNjURNCYrASImLwEmIyEiDwEOASMTIi4BND4BMh4BFA4BAyIOARQeATI+ATQuARMjFBY+ATQmIgYCR/63DRERDQFJDBISvP3jHTUoFRUoNR0vDgQnGgEtGicFDhodNSgVFSg1/cYiMTEiAh0iMTEiMwsQAhIFB/7TBgUSAxALxzRYNDRYaFkzM1k0JDwkJDxIPSMjPbUsGiQaGiQaWBIZEREZEnAZLDkeAYcfOC0YRxQaGhRHGC04H/55HjksGQKDOCj+eSc5OScBhyg4DgpbAgJbCg7+bTRYaFg0NFhoWDQBRCM9SD0jIz1IPSP+WhIaARkkGhoAAAQAAP/iA6EDHgADACEAPABJAAAlIRUhBSEiLgE1EScmNjc+ATMhMhceAR8BMzIeARURFA4BASIGBwYfAREUFjMhMjY1ETQmKwEiJi8BLgEjExQeATI+ATQuASIOAQEAAX7+ggIR/eInQicCARISFDgfARc5MxkkCQFYJ0InJ0L9uBQiCxMBAjEjAh4jMTEjbQoQAwgLRyi/DBQXFQwMFRcUDOU8xyhEKAGciRgtEhUWIhAtGQQoQyj+aChEKAL/DQwTGYz+ZiUzMyUBmCQzCwkYIS/95gwUDAwUGBUMDBUACQAA/98DoQMhAA8AJwA4AEgATABcAGAAcAB0AAABBwYiLwEmND8BNjIfARYUByImLwEuATQ2PwE+ARYfAR4BFAYPAQ4BAyIPAQYUHwEWMj8BNjQvASYBISImNRE0NjMhMhYVERQGJSERIQMhIiY1ETQ2MyEyFhURFAYlIREhASEiJjURNDYzITIWFREUBiUhESEBxlYaSxpWGhpWGksaVhqvGCwSVRESEhFVGD4+F1UREhIRVRIsFxoRVRISVREzEVUSElURAir+2xIaGhIBJRIaGv7ZAQX++5z+2xIaGhIBJRIaGv7ZAQX++wLG/tsSGhoSASUSGhr+2QEF/vsCEFUaGlUbShtVGhpVG0qoEhFVESwwLBFVFxAQF1URLDAsEVUREgFeElURMhJUEhJUEjIRVRL+tRoSASUSGhoT/twSGjwBBf0JGhIBLhIaGhL+0hIaPAEO/roaEgEvEhoaEv7REho8AQ8ACgAA/9wDnQMeAA8AEwAjACcANwA7AEgAVQBiAG8AAAUhIiY1ETQ2MyEyFhURFAYlIREhASEiJjURNDYzITIWFREUBiUhESEnISImNRE0NjMhMhYVERQGJSERIQEiJjURNDYyFhURFAYXBiY9ATQ2MhYdARQGJyImPQE0NjIWHQEUBhciJjURNDYyFhURFAYBtf7TEhoaEgEtExkZ/tABDf7zAtn+0xMZGRMBLRIaGv7RAQ3+85n+0xIaGhIBLRMZGf7QAQ3+8wG7DBISGRERfgwSEhgSEgwMEhIYEhJvDBISGRERIxoSATUSGhoS/ssSGjwBFf6zGhIBNRIaGhL+yxIaPAEVaRoSASoTGRkT/tYSGjwBCv7BEQ0BMgwSEgz+zg0RCAESDGYMEhIMZQ0R3BENXgwSEgxeDRHUEQ0BMgwSEgz+zg0RAAYAAP/gA5gDHAAMABAAHQApADYAQgAABSEiJjURNDYzIREUBiUhESETIiY1ETQ2MhYVERQGASEiJjQ2MyEyFhQGASImNRE0NjIWFREUBhMjIiY0NjsBMhYUBgMC/fsWHhINAk4e/e0B9f4Lmg0RERkSEgHO/Q0MEhIMAvMMEhL+0w0RERkSEgbVDRERDdUNEREfHhYCeA0R/WoWHjwCUv4fEgwBIQ0REQ3+3wwSAeQRGRISGRH+GhIMASIMEhIM/t4MEgJUERkSEhkRAAMAAP/hA58DHgATADoAUAAAJTEiLwEmPgEWHwE3PgEeAQ8BBiMXISIuATURNDYyFhURFBYzITI2NRE0JiMhIiY0NjMhMh4BFREUDgE3IiY1ETQmIyEiJjQ2MyEyHgEVERQGAaUOCXoIAhMZCGSZCBkSAgiwCQ71/kQiOCERGRIlGgG8GiUlGv6dDRERDQFjITkhITnFDBIkGv6hDBISDAFfITkgEcIKkAoZEAIKdq8JARAZCcgL4CE4IQHRDBISDP4vGSUlGQHRGiQSGBIhOCH+LyE4IfARDQG1GiQSGBIhOCH+Sw0RAAADAAD/7wOkAw4ANQBoAHQAAAUiLwEmIg8BBiMiJy4BPwE2Ji8BLgE+AT8BPgE/AT4BMhYfAR4BHwEeAgYPAQ4BHwEWBgcGJzIfARY+Ai8BJjY/AT4BLgEvAS4BLwEuASIGDwEOAQ8BDgIWHwEeAQ8BBh4CPwE2NyMiJjQ2OwEyFhQGAsEaF3oJFgp6FxohHBgXBhcCBwhjFQ4SLh2JChIFPQ0zPDINPQUSC4geLRMOFmIIBwIXBRYZG+EaFnoMGRUJAhcFEBNiCgYIFAyJGSoLPQYVGhUGPQwpGogNEwgGCWMSEAQXAwoVGQt6F2OHDBISDIcNEREQDEAFBUAMFBI3HYgLFQdhFTk5JgUUAQ0KexsgIBt7Cg0BFAUmOTkVYQcVC4gdNxIUjQxABgIPFw2IGTESYAoYGBEBFAQeF3wMDQ0MfBceBBQBERgYCWESMRmIDRcPAgZADLwSGRERGRIAAwAA/+EDnQMcACMALwA8AAAFISImNRE0NjMhMhYUBiMhIgYVERQWMyEyNjURNDYyFhURFAYTISImNDYzITIWFAYHIiY1ETQ2MhYVERQGA0v9aCEwMCEBTQwSEgz+swgNDQgCmAkMEhkRLw7+xw0REQ0BOQwSEqkMEhIZEREfMCECmCIvERkSDAn9aAgNDQgBYA0REQ3+oCEwAmARGRISGRGdEgwBOgwSEgz+xgwSAAAEAAD/4AOiAyAAIwAoADsARwAABSEiJjURNDYzITIWFAYjISIGFREUFjMhMjY1ETQ2MhYVERQGAxcDBycTIgcBBh8BHgEzNzY3ATYmLwEmAyEiJjQ2MyEyFhQGA0/9ZSIwMCIBTg0REQ3+sgkNDQkCmwkNERkSMHxg7lIO5AoF/vAFAhUCFA1/CAQBEAYIC4sNWP7FDRERDQE7DBISIDAiApwiMBIZEQ0J/WQJDQ0JAWINEREN/p4iMALySP7CClIBhwb+lAUIewwRDgEGAWsIFghoCf1qERkSEhkRAAAAAAYAAP/hA6IDHQAPABMAIAAsADgARQAABSEiJjURNDYzITIWFREUBiUhESEXIiY9ATQ2MhYdARQGBSEiJjQ2MyEyFhQGByEiJjQ2MyEyFhQGAyImPQE0NjIWHQEUBgNu/SsWHh4WAtUVHx/9HgLF/TueDBISGRERAX3+dQ0REQ0BiwwSEhP+ggwSEgwBfg0REQUMEhIYEhIfHxUCfxUfHxX9gRUfPAJvZBIMuQwSEgy5DBK7ERkSEhkRvBEZEhIZEQF3Egy5DBISDLkMEgAAAAAFAAD/4wOgAx4AIwAvADwASQBVAAAFISImNRE0NjMhMhYUBiMhIgYVERQWMyEyNjURNDYyFhURFAYBMzIWFAYrASImNDY3MhYdARQGIiY9ATQ2JTIWFAcBBiImNDcBNgMhIiY0NjMhMhYUBgNO/WghMDAhAU0MEhIM/rMIDQ0IApgJDBIZES/+hcUMEhIMxQwSEgkMEhIYEhIBewwSCf7ACRkSCQFBCXX+gQ0REQ0BfwwSEhwvIgKYITASGREMCf1oCQwMCQFgDBISDP6gIi8BuhEZEhIZEckRDcQNERENxA0RqBEZCf7ACRIYCQFBCP1nEhkRERkSAAUAAP/jA6ADHgAjAC8APABJAFUAAAUhIiY1ETQ2MyEyFhQGIyEiBhURFBYzITI2NRE0NjIWFREUBgMjIiY0NjsBMhYUBgciJj0BNDYyFh0BFAYFIiY0NwE2MhYUBwEGFyEiJjQ2MyEyFhQGA079aCEwMCEBTQwSEgz+swgNDQgCmAkMEhkRLxLFDBISDMUMEhIJDBISGBIS/oUNEQkBQAkZEQj+vwni/oENERENAX8MEhIcLyICmCEwEhkRDAn9aAkMDAkBYAwSEgz+oCIvAvASGRERGRLJEgzFDBISDMUMEqgSGAkBQQkSGQn+wAntEhkRERkSAAAAAwAA/+EDnwMdAAsAKwBMAAABISImNDYzITIWFAYDISInLgE9ATQ2MhYdARQWMyEyNj0BNDYyFh0BFAYHBhMiJj0BNCYjISIGHQEUBiImPQE0Njc2MyEyFx4BHQEUBgOB/P8MEhIMAwEMEhKj/i0vIxEUEhkRIxgB0xgjEhgSExIiKQwSIxj+LRgjERkSFBEjLwHTMCISExIBaxEZEhIZEf53HA8nFYMNERENgxIZGRKDDRERDYMVJw8cAjISDIMSGhoSgwwSEgyDFSgOHR0OKBWDDBIAAAAAAgAA/+EDngMeABMAKwAABSEiJjURNDYyFhURFBYzITIWFAYnIi8BBwYmJwMmPgEWHwE3NhYXExYGBwYDgP03IzISGBIPCgLJDBISQRAJn8UJHQnNBwMUGQe2xgkfCLYHBQoIHjEkAsgNEREN/TgLDhIZEfQN8fMMAQwBEwoYDwQK8/QMAQ3+7QoYBwUAAAAABAAA/+EDngMeABMAIAAtAD0AAAUhIiY1ETQ2MhYVERQWMyEyFhQGJSImNRE0NjIWFREUBjciJjURNDYyFhURFAY3IiY1AzQ2MzEyFhUTFAYjA4D9NyMyEhgSDwoCyQwSEv3KDRERGRISzwwSEhgSEtEMEgMSDAwSAxIMHjEkAsgNEREN/TgLDhIZEZMSDAHoDBISDP4YDBI9EgwBag0REQ3+lgwSNRANAQEMEhAO/wANEQAABgAA//YDnQMJAAsAGwAnADcAVgB1AAABISI9ATQzITIdARQHISImPQE0NjMhMhYdARQGByEiPQE0MyEyHQEUByEiJj0BNDYzITIWHQEUBgMiJi8BIyIuATURND4BMyEyHgEVERQOASsBBg8BDgEBIgYVERQWOwEyFxYfARYyPwE2Nz4BOwEyNjURNCYjAsz+aQUFAZcEBP5pDhUVDgGXDhQUDv5pBQUBlwQE/mkOFRUOAZcOFBTUHDQVSmQnQiYmQicCGydBJydBJ1oHBzsUNf7RIzAwI3IPCQQERxhFGDsHBgQOCGsiMTEiAgEEJQUFJQQFDwscCw8PCxwLD68FGgQEGgUWDwscCw8PCxwLD/6/FhRLJkInAYAnQScnQSf+gCdCJgkHOxQWAtcxIv6AIzAMBgRGGRk6CAoICDAjAYAiMQAACAAA/+ADmwMdAAwAGQAlADEAPgBLAFgAZQAAASImPQE0NjIWHQEUBgMiJj0BNDYyFh0BFAYBIyImNDY7ATIWFAYhIyImNDY7ATIWFAYBIiY0PwE2MhYUDwEGASImND8BNjIWFA8BBhMiLwEmNDYyHwEWFAYBIi8BJjQ2Mh8BFhQGAf8MEhIZEREODBISGRER/v+IDBISDIgMEhICZ4gMEhIMiAwSEv1+DBIJYAkYEglgCAGvDREIYAkZEQhgCT4MCWAJEhkJXwkR/jgNCV8JERkJYAkSAlkSDIgMEhIMiAwS/YgRDYcNERENhw0RAYMRGRISGRERGRISGRH+8hIZCGAJEhkIYAkBvBEZCWAIERkJYAj+RAlgCBkSCWAIGRIBvAhgCRkRCGAJGREABAAA/7UDlgNFACMAMABUAGEAACUiJy4CJyY3Njc+ATc2Fx4BDgEnJgcGBwYHBh4BFx4BBw4BEyIvASY0NhYfARYUBgMiJy4BPgEXFjMyNz4BNzYuAScuAT4BFx4CFxYHBgcOAQcGByIvASY0NjIfARYOAQFfBwY6WzsKCg0OKyp8SUtNDA4FFAxWU1A3OhAOJVxCDAgFBA/VDQhJCBIZCUgIEjgkJAwOBRQNHh9iUzZGDA0kXEMLCQsXCzpcOgoKDA8rKXxJKCoMCUgJEhkJSAkBEh0DG1hwP0FBTEE+VBAQDgMUGQ4DEB0dQEJWSIxvHwUXCwkJAqAJTAkZEQEJSwkZEf1CBwIUGQ4CBjgka0BIjG8fBRcXCQYbV3E+QUFNQD5VEAhJCUsJGREJTAkYEQAAAAAGAAAAAAOmAxEAFwAmAC8AOABBAEoAACUhIicmJwMnJj4BFh8BITIWFxYHAwYHBgEXEx4BMyEyNjcTNicmIwEiJjQ2MhYUBiciBhQWMjY0JgUiJjQ2MhYUBiciBhQWMjY0JgL+/isiHCAGOSgDDhkUAhMCjRcpDRoHPAYfHP2cCjoBGA8B1Q8YAjwDCQoV/j0nODhONzcnDxQUHRQUASknODhONzcnDhUVHBQUhRIVIAFM0wwVBA4MYhIQHyj+oSAVEgHTNv60Bw4OBwFfDQoM/a43Tjg4TjeBFRwUFBwVgTdOODhON4EVHBQUHBUAAAAEAAD/3gOeAz4ARQCwAL0AygAABSMiJj0BJicHBiYvASY2PwEmNTQ3Jy4BPwE+AR8BNjc1NDY7ATIWHQEWFzc2Fh8BFgYPARYVFAcXHgEPAQ4BLwEGBxUUBiUyFxYXHgEdARQWOwEyNj0BNDY3Njc+AR8BFjY/ATYmLwEuATc2NTQnJjY/AT4BLwEuAQ8BBiYnJicuAT0BNCYrASIGHQEUBgcGBw4BLwEmBg8BBhYfAR4BBwYVFBcWBg8BDgEfAR4BPwE2NyIuATQ+ATIeARQOAQMiDgEUHgEyPgE0LgECL10gLTEqGhw9EC8QERseAwUkHBAQLhA9HC0kKS0gXSAtLykjGz0QLxARGyMDBxkbERAvED0cJiElLf7fDAgvOwoLCgddBwoLCjAoBxMINwYOAy8DAwYtCQgDCwYCCAg2BgMDLwMNBjYIFActOgoLCgddBwoLCjQrBxMIPgYNBC8DBAY3CQgCCQUCCAgwBgMDLwMOBi0H2yxLLCxLWEssLEssHC8cHC84LxwcLyEtHyQTIg8QEBxQHD0QERcXIB8VED0cURsQDxobECwgLS0gLBMgFBAQHFEbPRAVGRkkIw8PPhtRGxEQFhcOJB8t6AgsEwMPCjkGCgoGOQoPAxAgBQIFIAQEBlEGDQQZBhMKJiceHQoSBR8DDQZRBgQEHwQCBioSAxAKQQcKCgdBChADESMGAgUkAwQFUQYOAyAFEwoiJBwbChIEHAMOBlAGBAQaBCQsS1hLLCxLWEssAQocLzgvHBwvOC8cAAQAAP/bA3EDIAAMABkAMgA4AAAlIi4BND4BMh4BFA4BAyIOARQeATI+ATQuAQMiJyUuATURNDY3JTYyFwUeARURFAYHBQYlBSURJQUCAC1LLS1LWkwsLEwtHDAdHTA5MBwcMB0MC/6+CwwMCwFCCxkKAUILDAwL/r4L/sABNAE0/sz+zNgtTFlMLCxMWUwtAQ4cMDkwHR0wOTAc/fUGugYWDAF0DBYGugYGugYWDP6MDBYGugbwsrIBZLKyAAAAAAMAAAAAA6MCzAAcADkAUgAAJSEiLgI1NDY3NTQ+AjIWFxYXMzIeAhQOAgEiDgEVFB8BBw4BFRQeATMhMj4BNC4BKwE1LgIXIiY1JicmJyYjIiY0NhYXFhcWFxYXFAYjAq7+pzBZRSUwKyVGWGBYIjsNDDFYRiUlRlj+0jJVMQIDESUqMVUxAVkyVDIyVDJFAjJTQQwSAjMRFQwFDBESFw8dGSQWGwIRDEoiP1MuM10gDi1TPyIgHzRLIUBTW1M/IgJFLUwsDAwUChdJKC1MLS1MWkwsHS1JK9URDDkYCAQDEhkRAQMFDBEdJDMMEwAAAAQAAAAAA50CtQAMABkAJgBoAAAlIiY1ETQ2MhYVERQGByIvASY0NjIfARYUBiciJjQ/ATYyFhQPAQY3IiY0NjMyPgE0LgErASImJy4BIgYHDgErASIOARQeATMyFhQGIyIuAjQ2Nz4BNzY3PgEyFhcWFx4BFx4BFA4CAgQMEhIZERERDAlmCREZCWYJEgwNEQhnCBkSCWYJsgwSEgwsSywsSywNChADDFNqUw0CEAsNLEosLEosDRERDSxRPyIiHx5MKhQvHEVIRBwvFSpMHh8iIj9RbhIMAS0MEhIM/tMMEgcJZgkZEQlmCRgSARIZCGcIERkJZgkEERkSK0tYSywMCzNCQjMLDCxLWEsrEhkRIT9SWVEfHiIBOSUXGBgXJTkBIh4fUVlSPyEAAAMAAP/gA4oDHQAVACcAPgAABSEiJicuATcTPgEzITIWFxMWBgcOAQEiBgcDBh4BMyEyPgEnAy4BIwciJyYnLgI+ARcWFxYXFjc2HgEGBwYDD/3lFyoQGBIIWgdEKgFjKkQHWggSGBAq/ioUIgRaBQseFAIbFB4LBVoEIhStGxwfHhAUBwwXCwgNGRlONwsYDgUKNyAUExxTLgIRKz09K/3vLlMcExQDASAX/fAgOyMjOyACEBcguwYGDAYLGBYHBgQFCgUOJQcFFRgHJQAAAAAGAAD/3wOVAx4AIQBDAE8AWwBzAHUAACUhIi4BPQE0PgE7ATU0PgI7ATIeAh0BMzIeAR0BFA4BJSIGHQEUFjMhMjY9ATQmKwEiJjURNC4BKwEiDgEVERQGIwUjIiY0NjsBMhYUBgMjIiY0NjsBMhYUBhciJicmJyYnIiY0NjMyFxYXFhcWFxYGBycxAx79xCA2ICA2IAwoS140FTReSygRIDcgIDf9pBgiIhgCPBgjIxgvDBI2XTYVNl02EQ0BQ50OExMOnQ0UFE8ZDxYWDxkPFRVnDBEBBTMaGwwREQ0JDx4ZIhYcBQEQDI07HTIeBh4yHe0wVkIjI0JWMO0dMh4GHjIdpB0UBhUcHBUGFB0RDQELMFAvL1Aw/vUNEf8TGxMTGxMC9RYeFRUeFusPDC8UCwERGRIDBAsPGCAsDRMBagAAAAAFAAD/4gMgAx4ADwATAB8AIAAtAAAFISImNRE0NjMhMhYVERQGJSERIQUhIiY0NjMhMhYUBgMjFB4BMj4BNC4BIg4BAuz+KhYeHhYB1hUfH/4dAcb+OgFj/wAMEhIMAQAMEhKMNA4YHBcODhccGA4eHxUC1BUfHxX9LBUfPALEjxIYEhIYEv4YDhgNDRgcGA4OGAAABAAAAAADnALTAA8AEwAiADEAACUhIiY1ETQ2MyEyFhURFAYlIREhASIvAS4BPgEfAR4BBw4BByImJyY2PwE2HgEGDwEGA2j9MhYeHhYCzhUfH/0lAr79QgFjBAW6DQoGFgy7CwwDAxAICRADBAwMugwWBwsNugQ3HhYCMxYeHhb9zRYePAIj/p8BOAQWFwwDOAQWDAkMBAsKDBYDOAQMFxYEOAEAAAAACAAAAAADnQLTAA8AEwAUACEAIgAvADAAPQAAJSEiJjURNDYzITIWFREUBiUhESETIxQeATI+ATQuASIOAQUjFB4BMj4BNC4BIg4BBSMUHgEyPgE0LgEiDgEDaP0yFh4eFgLOFh4e/SQCvv1CmT8RHSIdEREdIh0RAQQ/ER0iHRERHSIdEQEEPhAeIR0RER0hHhA3HhYCNBUfHxX9zBYePAIk/ukQHhAQHiEdEREdERAeEBAeIR0RER0REB4QEB4hHRERHQAAAAAGAAAAAAOgAtYACwAXACMALwA7AEcAAAEhIiY0NjMhMhYUBgMhIiY0NjMhMhYUBhMhIiY0NjMhMhYUBgUjIiY0NjsBMhYUBgMjIiY0NjsBMhYUBgMjIiY0NjsBMhYUBgOB/dIMEhIMAi4NEREh/eUNERENAhsNEREE/dINERENAi4MEhL9V18MEhIMXw0REQ1fDBISDF8NERENXwwSEgxfDRERAWISGRERGRL+yBIZEREZEgJwERkSEhkRAxEZEhIZEf7KERkSEhkR/soSGBISGBIAAAcAAAAAA6QC7QAWACwALQAvADAARwBjAAAlIiclJicmPQE0NzY3JTYeAhURFA4BJxYyNzY1ETQnJiIHBQYHBh0BFBcWFzERMDEBIi4BNzYnJicuAT4BFhcWFxYXFgYHBhciJjQ3NicmJyYnJicuAT4BFhcWFxYXFhcWBwYB5Bka/uUZDg0NDhkBGxw3LRkZLzgNGgkUFAkaDf7kBAUHBwUEAfELEgIIPBgIEAkMBhUYBwgJEwkPGCcJTQ0RCYIDAiAWJBMNCQIQGRMNGhYfEhcCA5QJFAt9CyAdIPcgHSALfQwCHjMg/g0gMx9CBgYOIgHzIw0GBn0DDA8T9xIQDAMBWf6TDxkJSXIkJRUUGA0GCw0WKitGei8LehIZCX6IQkIvKxYMCBkSAhEOHCEtMD09o5AJAAAAAAMAAP/hA24DHAAYAC0AOgAAJSInLgEnJjQ3PgE3NjIXHgEXFhQHDgEHBgMiBwYHBhQXFhcWMjc2NzY0JyYnJgEiLwEmPgEWHwEWDgEB+EhCP2MaHBwaYz9CkEJAYhscHBtiQEJIUERDJygoJ0NEoEVCKCgoKEJFAQYOCY4IBBIYCY4IBBFWHBtiQEKQQj9jGxsbG2JAQpBCQGIbHAKJKCdDRKBFQigoKChCRaBEQyco/QMLrwoYDwELrgsYDgAAAAgAAP/fA58DHgAQAB0AKgAzAD8ASwBYAGUAACUiLgI0PgIyHgIUDgIDIg4BFB4BMj4BNC4BAyIuATQ+ATIeARQOASciBhQWMjY0JgUjIiY0NjsBMhYUBiEjIiY0NjsBMhYUBgEiJj0BNDYyFh0BFAYDIiY9ATQ2MhYdARQGAgA0YEooKEpgaGBKKChKYDQ1WjU1WmpaNTVaNSQ9JCQ9SD0kJD0kHCcnOCcn/v2YDRQUDZgOFBQCVpgNFBQNmA4TE/51DhMTHBMTDg4TExwTE3coSmBpX0ooKEpfaWBKKAHKNVpqWjQ0WmpaNf63JD1IPSQkPUg9JMgnOCcnOCdkExwTExwTExwTExwT/oQTDpgOExMOmA4TAmQTDpgNFBQNmA4TAAADAAAAAAOfAuUADAAZADcAABMiLwEuAT4BHwEeAQYnIiY0PwE2MhYUDwEGASEiJjQ2MyEyPgE0LgEjISImNDYzITIeAhQOAu0KCG0JAw8ZCW0KAhB6DBIIXwkZEglfCAHU/mENERENAZ9FdUVFdUX+YQ0REQ0Bnz9zWTAwWXMB7AZVCBkTAwdWBxkVWxEZCWEJERkJYQn92xEZEkNzh3NDEhgSL1dyfHFYLgAABgAA/+EDJgMdABMAJwBCAE4AWgBmAAAlIyIuATURND4BOwEyHgEVERQOAQMiDgEVERQeATsBMj4BNRE0LgEjAyIuAjU0NjIWFRQeATI+ATU0NjIWFRQOAgMjIiY0NjsBMhYUBgcjIiY0NjsBMhYUBgcjIiY0NjsBMhYUBgH5GDdeODheNxg3Xjc3Xk8nQycnQycYJ0InJ0InDD9yWDASGRFEdIl0RBIZES9Yc29/DBISDH8MEhIFfwwSEgx/DBISAn4NERENfg0REWs3XjcBGTheNzdeOP7nN143AnYnQyf+5ydCJydCJwEZJ0Mn/QEvWXI+DRERDUR0RER0RA0REQ0+clkvAlIRGRISGRGXERkSEhkRlxEZEhIZEQAKAAD/+ANyAtoADwATABQAIQAiAC8APwBDAEQAUQAAASEiJj0BNDYzITIWHQEUBiUhNSEFIxQeATI+ATQuASIOAQcjFB4BMj4BNC4BIg4BASEiJjURNDYzITIWFREUBiUhNSEFIxQeATI+ATQuASIOAQNA/X8UHR0UAoEUHBz9dgJr/ZUCBi0MFRgUDAwUGBUMUiwLFRgVDAwVGBULARn9hhYeHhYCehUfH/15Amr9lgIFLQwVGBUMDBUYFQwBgB0U+BQcHBT4FB084XAMFQwMFRgUDAwUDAwVDAwVGBQMDBT9vx8WAQwWHx8W/vQWHzz+fwwVDAwVGBUMDBUAAAAAAgAA/+EDmgMYAAwAGgAABSInASY+AhcBFhQGISIuATcBMTYeARQHAQYDewwJ/QcKAhAZCQL5CRH8+gwRAQkC+QoYEQn9BwkeCAL5ChkQAQn9BwkZEREYCgL5CQERGQn9BwgAAAQAAAAAA58CuAALABgAJAAxAAABISImNDYzITIWFAYnIi8BJjQ2Mh8BFhQGByEiJjQ2MyEyFhQGBSIvASY0PgEfARYUBgNz/Q4NERENAvINEREEDQiiCREZCaIJEgf9DQwSEgwC8wwSEv2bDAmiCREYCqIJEgHYEhkRERkSAQmiCRkRCKMIGRLYERkSEhkRowijCBkRAQmiCRkRAAMAAAAAA34CsAALABQAIQAAASEiJjQ2MyEyFhQGJyMnJjQ+AR8BASImND8BNjIWFA8BBgNS/UgNERENArgMEhIRAewJEhgK7P78DREJ7AkZEQnsCQF9EhgSEhgSE+wJGBECCuz+4RIZCO0IERkJ7AkAAAAAAgAAAAADngLgACsAVwAAJSEiLgE9ATQ+ATMyFhQGIyIGHQEUFjMhMjY9ATQmIyImNDYzMh4BHQEUDgETIiY0NjMyNj0BNCYjISIGHQEUFjMyFhQGIyIuAT0BND4BMyEyHgEdARQOAQIw/qogNyAgNyANERENGCMjGAFWGSMjGQwSEgwhNyAgN9UMEhIMGSMjGf6qGSMjGQ0REQ0gNyEhNyABViE3ICA3ICE3IMwgNyESGREjGcwZIyMZzBkjERkSITcgzCA3IQEEERkSIxnMGCMjGMwZIxIZESA3IcwgNyAgNyDMITcgAAAAEgDeAAEAAAAAAAAAEwAAAAEAAAAAAAEACAATAAEAAAAAAAIABwAbAAEAAAAAAAMACAAiAAEAAAAAAAQACAAqAAEAAAAAAAUACwAyAAEAAAAAAAYACAA9AAEAAAAAAAoAKwBFAAEAAAAAAAsAEwBwAAMAAQQJAAAAJgCDAAMAAQQJAAEAEACpAAMAAQQJAAIADgC5AAMAAQQJAAMAEADHAAMAAQQJAAQAEADXAAMAAQQJAAUAFgDnAAMAAQQJAAYAEAD9AAMAAQQJAAoAVgENAAMAAQQJAAsAJgFjQ3JlYXRlZCBieSBpY29uZm9udGljb25mb250UmVndWxhcmljb25mb250aWNvbmZvbnRWZXJzaW9uIDEuMGljb25mb250R2VuZXJhdGVkIGJ5IHN2ZzJ0dGYgZnJvbSBGb250ZWxsbyBwcm9qZWN0Lmh0dHA6Ly9mb250ZWxsby5jb20AQwByAGUAYQB0AGUAZAAgAGIAeQAgAGkAYwBvAG4AZgBvAG4AdABpAGMAbwBuAGYAbwBuAHQAUgBlAGcAdQBsAGEAcgBpAGMAbwBuAGYAbwBuAHQAaQBjAG8AbgBmAG8AbgB0AFYAZQByAHMAaQBvAG4AIAAxAC4AMABpAGMAbwBuAGYAbwBuAHQARwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABzAHYAZwAyAHQAdABmACAAZgByAG8AbQAgAEYAbwBuAHQAZQBsAGwAbwAgAHAAcgBvAGoAZQBjAHQALgBoAHQAdABwADoALwAvAGYAbwBuAHQAZQBsAGwAbwAuAGMAbwBtAAACAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIBAgEDAQQBBQEGAQcBCAEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8BIAEhASIBIwEkASUBJgEnASgBKQEqASsBLAEtAS4BLwEwATEBMgEzAAZmYW5odWkHd2VuamlhbgZmYW5nZGEGdHVwaWFuBWthaWppCXh1YW56aG9uZwd4aW56ZW5nBnRpeGluZwdzaGlqaWFuBmJhb2N1bgt6aGFveGlhbmdqaQp3ZW5qaWFuamlhB2NoZW5neHUHZXJ3ZWltYQdzaGFuY2h1BWZ1emhpCHNob3VjYW5nB3RpYW5qaWEGYmlhbmppBHJpbGkFZGFvcnUGZGFvY2h1CHNhb3lpc2FvCXpoZXhpYW50dQt6aHV6aHVhbmd0dQtkdWlodWFrdWFuZwdkZW5nZGFpCHNodWF4aW4xCGdvdXd1Y2hlBnNoZXpoaQdzaGV6aGkxA3l1bgZ4aWF6YWkIZ291d3VkYWkHeGlhb3hpMQZzaG91amkHeGluZmVuZwhnZW5nZHVvMQdsaWViaWFvCHNoZW5neWluB2ppYW5zdW8HZGluZ3dlaQdmYW5odWkxCW1haWtlZmVuZwRqaXFpBmd1YW5iaQZ0aWh1YW4HamlhbnRvdQdsaWFuamllAAAAAAA='
	domModule.addRule('fontFace', {
		'fontFamily': "hxcion",
		 'src': "url('data:font/truetype;charset=utf-8;base64,"+b64+"')"
		// 'src': "url('../../components/hx-navbar/txt.ttf')"
	});
	var he = require('he');
	// #endif
	export default {
		name: "Navbar",
		components: {
		 
		},
		data() {
			return {
				title: '',
				backgroundColorRgba: '',
				backgroundColorRgb: 'rgb(222,222,222)',
				backgroundImage: null,
				backgroundImageEnd: null,
				//当前使用文字颜色
				txtColor:'#333333',
				// 背景颜色过度数组
				bgArr: [],
				// 文字颜色过度数组
				colorArr: [],
				// 状态栏颜色
				statusBarBackground: '',
				// 背景透明
				bgTransparent: 1,
				// 背景图片透明
				bgImgTransparent: [1,1],
				// 小程序 胶囊宽度
				jnWidth: 0,
				// 背景颜色是否为线性渐变
				bgIsLine: false,
				// 插槽过度透明度
				slotSwitchOpacity: 1,
				
				// 默认设置
				conf: {
					// 标题
					title: '',
					// nav 高度
					height: 44,
					
					// 是否固定头部
					fixed: true,
					// 是否包含状态栏
					statusBar: true,
					// 状态栏字体颜色，只支持黑（#000000）和白（#FFFFFF）两种颜色。为数组则是滑动变色
					statusBarFontColor:"#000000",
					//状态栏背景颜色
					statusBarBackground: null,
					
					// 字体
					font: 'hxicon',
					// 字体大小
					fontSize: '18px',
					// 文字颜色，可以数组和string，为数组则是滑动变色 ["#000000","#ff9900"]
					color: "#333333",
					//背景颜色;参数一：透明度;参数二：背景颜色（array则为线性渐变，string为单色背景）、
					// [1,['#24bdab','#80c54c']]
					backgroundColor: [1,'#ffffff'],
					// 背景图片（array则为滑动切换背景图，string为单一背景图）
					// 普通背景
					// ['/static/xj.jpg']
					// 切换功能参数说明：第一张图片，第二张图，第一张图透明度，第二张图透明度
					// ['/static/xj.jpg','/static/xk.jpg',1,1]
					backgroundImg: null,
					
					// 线性渐变角度
					backgroundColorLinearDeg: 'to right',
					// 滑动距离
					slideHeight: 100,
					// 滑动后背景颜色;参数一：透明度;参数二：背景颜色（array则为线性渐变，string为单色背景）
					slideBackgroundColor: null,
					
					// 是否需要返回按钮
					back: true,
					// 返回文本 '返回',小程序无效
					backTxt: null,
					// 返回tab页面
					backTabPage: null,
					// 返回普通页面
					backPage: null,
					
					// 左侧按钮组，icon参数为必填
					leftButton:null,
					// 右侧按钮组，icon参数为必填
					rightButton:null,
					// rightButton:[{
					//	key: 'address',		// 标识，方便事件识别是哪一个按钮触发
					// 	icon: '&#xe64b;',	// 图标代码
					//	txt: '文本',			// 文本，常用于城市选择
					// 	color: '#ff9900',	// 图标颜色
					//  position: 'left', // 图标居于文字left 或 right
					// },{
					//	key: 'address',		// 标识，方便事件识别是哪一个按钮触发
					// 	icon: '&#xe650;', 
					// 	txt: '文本',
					// 	color: '#894574',
					// },]
					// 搜索框
					search: null,
					// search: {
					// 	value:'',
					// 	placeholder: '',
					// 	disabled: false
					// }
					// 阴影
					shadow: false,
					// 底边框
					border: false,
					// 导航栏占位符
					barPlaceholder: true,
					
					// 插槽滑动切换
					slotSwitch: 0,
					// 右插槽
					rightSlot: false,
					// 右插槽切换
					rightSlotSwitch: false,
					
				}
			};
		},
		props:{
			config:{
				type: Object,
				default: ()=>({
					
				})
			}
		},
		computed:{
			//获取系统状态栏高度
			statusBarHeight(){
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight
			},
			navbarHeight(){
				var that = this;
				return uni.getSystemInfoSync().statusBarHeight + that.conf.height + 'px'
			},
			screenWidth(){
				return uni.getSystemInfoSync().screenWidth;
			}
		},
		
		created(){
			var that = this;
			// 小程序胶囊按钮长度
			// #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			that.jnWidth = menuButtonInfo.width;
			// #endif
			// #ifdef MP-ALIPAY
			that.jnWidth = 87;
			// #endif
			
			that.init();
			
		},
		mounted() {
			
			
		},
		watch: {
			// 'conf.leftButton': {
			// 	handler(newVal, oldVal) {
			// 		console.log("出发了")
			// 		//this.init()
			// 		this.conf.leftButton = newVal
			// 	},
			// 	// 启用深度监听
			// 	deep: true
			// }
		},
		methods: {
			iconHandle(icon){
				// #ifndef APP-PLUS-NVUE
				icon= icon.replace(/(&#x|;)/g, "")
				return unescape("%u"+icon)
				// #endif
				// #ifdef APP-PLUS-NVUE
				return he.decode(icon)
				// #endif
			},
			init(){
				var that = this;
				// 参数合并
				that.conf = Object.assign(that.conf, that.config)
				
				if(that.conf.title != ''){
					uni.setNavigationBarTitle({
					    title: that.conf.title
					});
				}
				// 标题
				if(that.conf.title){
					if(typeof that.conf.title == 'object' && that.conf.title.length == 2){
						that.title = that.conf.title[0];
					}else{
						that.title = that.conf.title;
					}
				}
				
				// 状态栏背景颜色
				if(that.conf.statusBarBackground){
					if(typeof that.conf.statusBarBackground == 'object' && that.conf.statusBarBackground.length == 2){
						that.statusBarBackground = that.conf.statusBarBackground[0];
					}else{
						that.statusBarBackground = that.conf.statusBarBackground;
					}
				}
				// 状态栏文字颜色
				
				if(that.conf.statusBarFontColor){
					uni.setNavigationBarColor({
						frontColor: (typeof that.conf.statusBarFontColor == 'object') ? that.conf.statusBarFontColor[0] : that.conf.statusBarFontColor,
						backgroundColor: '#000000'
					});
				}
				
				//文字颜色
				if(that.conf.color != ''){
					if(typeof that.conf.color == 'object' && that.conf.color.length == 2){
						that.txtColor =that.conf.color[0];
						that.colorArr = that.gradientColor(that.conf.color[0], that.conf.color[1], that.conf.slideHeight);
					}else{
						that.txtColor = that.conf.color;
					}
				}
				
				//背景图片存在时，背景色不生效
				if(that.conf.backgroundImg){
					let img = '';
					if(typeof that.conf.backgroundImg == 'object') {
						img = that.conf.backgroundImg[0];
						if(that.conf.backgroundImg.length>2){
							that.bgTransparent = that.conf.backgroundImg[2];
						}
					}else{
						img = that.conf.backgroundImg;
						that.bgTransparent = 1;
					}
					that.backgroundImage = that.bgImgStringHandle(img);
					
				}
				
				// 背景颜色设置
				if(that.conf.backgroundColor){
					let transparent = that.conf.backgroundColor[0];
					let background = that.conf.backgroundColor[1];
					if(typeof background == 'object' && background.length > 1){
						// 为线性背景
						that.bgIsLine = true;
					}
					if(that.conf.slideBackgroundColor){
						let backgroundEnd = that.conf.slideBackgroundColor[1];
						that.bgArr = [];
						if(background && typeof background == 'object' && background.length > 0){
							for(var i in background){
								that.bgArr.push(that.gradientColor(background[i], backgroundEnd[i], that.conf.slideHeight));
							}
							
						}else{
							that.bgArr.push(that.gradientColor(background, backgroundEnd, that.conf.slideHeight));
						}
					}
					that.bgTransparent = transparent;
					that.setBgColor(background,transparent);
				}
				
				if(that.conf.rightButton && that.conf.rightButton.length>0){
					
				}
			},
			
			// 返回
			onBack() {
				var that = this;
				// tabbar 页面
				if(that.conf.backTabPage){
					uni.switchTab({
					    url: that.conf.backTabPage
					});
				
				}else if(that.conf.backPage){
					// 普通页面
					uni.redirectTo({
					    url: that.conf.backPage
					});
				}else if(getCurrentPages().length>1){
					uni.navigateBack();
				}else{
					// #ifdef H5
					history.back();
					// #endif
				}
			},
			onClickBtn(e){
				this.$emit('clickBtn',e)
			},
			pageScroll(e){
				// console.log(e)
				var that = this;
				const st = parseFloat(e.scrollTop.toFixed(2));
				// 滑动距离
				let slideHeight = that.conf.slideHeight;
				// 过度颜色数组用到的整数滑动距离
				let a = Math.round(st);
				if(a > 0){a -= 1}else{a=0}
				
				// 标题
				if(that.conf.title && typeof that.conf.title == 'object' && that.conf.title.length == 2){
					if (st <= slideHeight) {
						that.title = that.conf.title[0];
					}else{
						that.title = that.conf.title[1];
					}
					
				}
				
				
				// 文字颜色滑动变色
				if(that.conf.color && typeof that.conf.color == 'object' && that.conf.color.length == 2){
					let colorArr = that.colorArr;
					let colorData = [];
					let rgb = (a <= colorArr.length-1) ? colorArr[a] : colorArr[colorArr.length-1];
					
					that.txtColor = rgb;
					// if (st <= slideHeight) {
					// 	that.txtColor = that.conf.color[0];
					// } else {
					// 	that.txtColor = that.conf.color[1];
					// }
				}
				
				that.slotSwitchOpacity = that.transHandle(st, slideHeight, 1,0)
				
				// ---------------------  状态栏文字滑动变色  ----------------------------
				
				//  参数为数组的时候生效
				if(that.conf.statusBarFontColor && typeof that.conf.statusBarFontColor == 'object' &&  that.conf.statusBarFontColor.length == 2){
					// 滑动前 状态栏文字颜色
					if (st <= slideHeight) {
						uni.setNavigationBarColor({
							frontColor:  that.conf.statusBarFontColor[0],
							backgroundColor: '#ffffff'
						});
					} else {
						uni.setNavigationBarColor({
							frontColor:  that.conf.statusBarFontColor[1],
							backgroundColor: '#ffffff'
						});
					}
				}
				
				// 状态栏背景颜色
				if(that.conf.statusBarBackground && typeof that.conf.statusBarBackground == 'object' && that.conf.statusBarBackground.length == 2){
					if (st <= slideHeight) {
						that.statusBarBackground = that.conf.statusBarBackground[0];
					}else{
						that.statusBarBackground = that.conf.statusBarBackground[1];
					}
					
				}
				
				
				// ---------------------  状态栏滑动变色 END --------------------------
				
				
				//--------------------- 背景图片  ---------------------------
				let BI = that.conf.backgroundImg;
				if(that.conf.backgroundImg && typeof that.conf.backgroundImg == 'object' && BI.length >1){
					let BIL = BI.length
					that.bgTransparent = BIL <= 3 ? 1 : that.transHandle(st,slideHeight,BI[2],BI[3]);
					that.bgImgTransparent[0] = BIL <= 3 ? 1 : that.transHandle(st,slideHeight,BI[2],0);
					that.bgImgTransparent[1] = BI[3];
					let img = '';
					if (st <= slideHeight) {
						img = BI[0];
					} else {
						img = BI[1];
					}
					that.backgroundImage = that.bgImgStringHandle(BI[0]);
					that.backgroundImageEnd = that.bgImgStringHandle(BI[1])
				}
				
				
				//--------------------- 背景颜色  ---------------------------
			
				if(that.conf.slideBackgroundColor){
					let bgArr = that.bgArr;
					var bgData = [];
					for(var i in that.bgArr){
						let rgb = (a <= bgArr[i].length-1) ? bgArr[i][a] : bgArr[i][bgArr[i].length-1];
						bgData.push(rgb.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(","));
					}
					// 透明度
					let transparentStart = that.conf.backgroundColor[0];
					let transparentEnd = that.conf.slideBackgroundColor[0];
					let transparent = transparentEnd;
					if(st<=slideHeight){
						// 透明度差值
						let cVal = Math.abs(transparentEnd - transparentStart);
						// 每1像素的透明度
						let tVal = parseFloat(cVal / slideHeight).toFixed(4);
						// 滑动后透明度的插值
						let curVal = parseFloat(tVal * st).toFixed(2);
						transparent = transparentStart > transparentEnd ? (transparentStart-curVal) : transparentStart+curVal;
						transparent = parseFloat(transparent).toFixed(2);
						//if(transparent>0 && transparent<1){transparent = transparent.toFixed(2)}
					}
					let backgroundEnd = that.conf.slideBackgroundColor[1];
					let rgbStr = '';
					if(typeof backgroundEnd == 'object' && backgroundEnd.length > 1){
						rgbStr = "linear-gradient("+ that.conf.backgroundColorLinearDeg +",";
						let l = bgData.length;
						for(var i in bgData){
							let c = bgData[i];
							rgbStr += "rgba("+ c[0] + "," +c[1] +"," + c[2] +"," + transparent+")";
							if(l != (i*1)+1){
								rgbStr += ",";
							}
						}
						rgbStr += ")"; 
					}else{
						rgbStr = "rgba("+ bgData[0][0] + "," +bgData[0][1] +"," + bgData[0][2] +"," + transparent+")";
					}
					that.bgTransparent = transparent;
					that.backgroundColorRgba = rgbStr;
				}
				//---------------------- 背景颜色 EDN -------------------------
				
				
				// 搜索框 滑动的时候才显示搜索框
				if(that.conf.search && typeof that.conf.search == 'object'){
					if (st <= slideHeight) {
						that.conf.search.show = false;
					}else{
						that.conf.search.show = true;
					}
				}
				
			},
			// 透明度计算，
			// 起始位置，结束位置，起始透明度，目标透明度
			transHandle(hStart,hEnd,tStart,tEnd){
				let transparent = tEnd;
				if(hStart<=hEnd){
					// 透明度差值
					let cVal = Math.abs(tEnd - tStart);
					// 每1像素的透明度
					let tVal = parseFloat(cVal / hEnd).toFixed(4);
					// 滑动后透明度的插值
					let curVal = parseFloat(tVal * hStart).toFixed(2);
					transparent = tStart > tEnd ? (tStart - curVal) : tStart+curVal;
					transparent = parseFloat(transparent).toFixed(2)
					//if(transparent>0 && transparent<1){transparent = transparent.toFixed(2)}
				}
				return transparent;
			},
			// 起始颜色，结束颜色，过渡数量
			gradientColor(startColor, endColor, step) {
				var that = this;
				let startRGB = that.colorRgb(startColor);//转换为rgb数组模式
				let startR = startRGB[0];
				let startG = startRGB[1];
				let startB = startRGB[2];
				let endRGB = that.colorRgb(endColor);
				let endR = endRGB[0];
				let endG = endRGB[1];
				let endB = endRGB[2];
				let sR = (endR - startR) / step;//总差值
				let sG = (endG - startG) / step;
				let sB = (endB - startB) / step;
				let colorArr = [];
				for (let i = 0; i < step; i++) {
					//计算每一步的hex值
					var str = 'rgb('+ parseInt((sR * i + startR))+ ',' + parseInt((sG * i + startG))+ ',' + parseInt((sB * i + startB)) + ')';
					let hex = that.colorHex(str);
					colorArr.push(hex);
				}
				return colorArr;
			},
			// 转换函数
			colorRgb(sColor){
				var that = this;
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				var sColor = sColor.toLowerCase();
				if(sColor && reg.test(sColor)){
					if(sColor.length === 4){
						var sColorNew = "#";
						for(var i=1; i<4; i+=1){
							sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
						}
						sColor = sColorNew;
					}
					//处理六位的颜色值
					var sColorChange = [];
					for(var i=1; i<7; i+=2){
						sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
					}
					return sColorChange;
				}else{
					return sColor;
				}
			},
			
			colorHex(rgb){
				var that = this;
				var _this = rgb;
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				if(/^(rgb|RGB)/.test(_this)){
				   var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g,"").split(",");
				   var strHex = "#";
				   for(var i=0; i<aColor.length; i++){
					   var hex = Number(aColor[i]).toString(16);
					   hex = hex<10 ? 0+''+hex :hex;// 保证每个rgb的值为2位
					   if(hex === "0"){
						   hex += hex;
					   }
					   strHex += hex;
				   }
				   if(strHex.length !== 7){
					   strHex = _this;
				   }
				   return strHex;
				}else if(reg.test(_this)){
				   var aNum = _this.replace(/#/,"").split("");
				   if(aNum.length === 6){
					   return _this;
				   }else if(aNum.length === 3){
					   var numHex = "#";
					   for(var i=0; i<aNum.length; i+=1){
						   numHex += (aNum[i]+aNum[i]);
					   }
					   return numHex;
				   }
				}else{
				   return _this;
				}
			},
			//背景颜色初始化
			// 透明度，背景颜色string ，array
			setBgColor(background,transparent){
				var that = this;
				//如果存在背景图片则背景颜色失效
				// if(that.backgroundImg){
				// 	that.backgroundColorRgba = "url(" + that.backgroundImg + ") ";
				// 	return;
				// }
				//背景颜色
				if(typeof background == 'object' && background.length > 0){
					let rgbStr = "linear-gradient("+ that.conf.backgroundColorLinearDeg +",";
					let c = null;
					for(var i in background){
						c = background[i];
						let o = that.colorRgb(c);
						rgbStr += `rgba(${o[0]}, ${o[1]}, ${o[2]}, ${transparent})`;
						if(background.length != (i*1)+1){
							rgbStr += ",";
						}
					}
					rgbStr += ")"; 
					that.backgroundColorRgba = rgbStr;
				}else{
					let c = background;
					let o = that.colorRgb(c);
					that.backgroundColorRgba = `rgba(${o[0]}, ${o[1]}, ${o[2]}, ${transparent})`;
				}
			},
			bgImgStringHandle(img){
				return img;
				// return `url(${img}) bottom / 100% no-repeat`;
			},
			// 搜索框，点击完成时触发
			searchConfirm(event){
				this.$emit('searchConfirm',event.detail);
			},
			// 搜索框点击事件
			searchClick(event){
				this.$emit('searchClick', true);
			}
		}
		
	}
</script>

<style lang="scss">
	
	@font-face {
	  font-family: 'hxicon';  /* project id 2009392 */
	  src: url(data:font/truetype;charset=utf-8;base64,AAEAAAALAIAAAwAwR1NVQiCLJXoAAAE4AAAAVE9TLzI8J2LPAAABjAAAAGBjbWFwLOPU/gAAArQAAAQWZ2x5ZqhODB0AAAc0AAAtEGhlYWQkob0XAAAA4AAAADZoaGVhB94DswAAALwAAAAkaG10eMgAAAAAAAHsAAAAyGxvY2EguxVEAAAGzAAAAGZtYXhwAUYA1wAAARgAAAAgbmFtZRCjPLAAADREAAACZ3Bvc3RD6q83AAA2rAAAAhEAAQAAA4D/gABcBAAAAAAABAAAAQAAAAAAAAAAAAAAAAAAADIAAQAAAAEAACRdRHdfDzz1AAsEAAAAAADgwTyQAAAAAODBPJAAAP+1BAADRQAAAAgAAgAAAAAAAAABAAAAMgDLAAoAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKADAAPgACREZMVAAObGF0bgAaAAQAAAAAAAAAAQAAAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAQEAAGQAAUAAAKJAswAAACPAokCzAAAAesAMgEIAAACAAUDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFBmRWQAwOYS//8DgP+AAAAD3ACAAAAAAQAAAAAAAAAAAAAAAAACBAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAAAAAFAAAAAwAAACwAAAAEAAABugABAAAAAAC0AAMAAQAAACwAAwAKAAABugAEAIgAAAAGAAQAAQAC5iLmQ///AADmEuYl//8AAAAAAAEABgAmAAAAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAAAEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAlwAAAAAAAAAMQAA5hIAAOYSAAAAAgAA5hMAAOYTAAAAAwAA5hQAAOYUAAAABAAA5hUAAOYVAAAABQAA5hYAAOYWAAAABgAA5hcAAOYXAAAABwAA5hgAAOYYAAAACAAA5hkAAOYZAAAACQAA5hoAAOYaAAAACgAA5hsAAOYbAAAACwAA5hwAAOYcAAAADAAA5h0AAOYdAAAADQAA5h4AAOYeAAAADgAA5h8AAOYfAAAADwAA5iAAAOYgAAAAEAAA5iEAAOYhAAAAEQAA5iIAAOYiAAAAEgAA5iUAAOYlAAAAEwAA5iYAAOYmAAAAFAAA5icAAOYnAAAAFQAA5igAAOYoAAAAFgAA5ikAAOYpAAAAFwAA5ioAAOYqAAAAGAAA5isAAOYrAAAAGQAA5iwAAOYsAAAAGgAA5i0AAOYtAAAAGwAA5i4AAOYuAAAAHAAA5i8AAOYvAAAAHQAA5jAAAOYwAAAAHgAA5jEAAOYxAAAAHwAA5jIAAOYyAAAAIAAA5jMAAOYzAAAAIQAA5jQAAOY0AAAAIgAA5jUAAOY1AAAAIwAA5jYAAOY2AAAAJAAA5jcAAOY3AAAAJQAA5jgAAOY4AAAAJgAA5jkAAOY5AAAAJwAA5joAAOY6AAAAKAAA5jsAAOY7AAAAKQAA5jwAAOY8AAAAKgAA5j0AAOY9AAAAKwAA5j4AAOY+AAAALAAA5j8AAOY/AAAALQAA5kAAAOZAAAAALgAA5kEAAOZBAAAALwAA5kIAAOZCAAAAMAAA5kMAAOZDAAAAMQAPA0MADwNDAAAAAQAAAAAAAAAmAHwA+AFoAe4CSAKqAwoDfAPsBI4E/gWyBlYGvAcwB+AIOAioCRAJjAoICnQKvAsWC7gMTgzoDWAOhA7kD1wP8hBaEPwRRhGaEf4SaBMEE2QT9hRMFNoVWhWMFdoWFBaIAAAAAQAA/8ACHgNBABEAAAUJATY0JiIHAQYXBhcBFjI2NAIV/ncBiQkTGwn+ZAsCAgsBnAkbEwkBiQGJCRsTCf5kCw8QDP5kCRMbAAAAAAUAAP/iA6ADHwAPABMAHwArADcAAAUhIiY1ETQ2MyEyFhURFAYlIREhBSMiJjQ2OwEyFhQGByEiJjQ2MyEyFhQGByEiJjQ2MyEyFhQGA2v9KxUfHxUC1RYeHv0dAsX9OwItxAwSEgzEDRERDf52DRERDQGKDRERDf6CDBISDAF+DRERHh8VAtQWHh4W/SwVHzwCxKsRGRISGRG+EhgSEhgSvBIYEhIYEgAAAAAFAAD/4QOfAx8AJgAyAD8ASwBYAAAFISIuATURNDYyFhURFBYzITI2NRE0JiMhIiY0NjMhMh4BFREUDgEDIyImNDY7ATIWFAYHIiY9ATQ2MhYdARQGASMiJjQ2OwEyFhQGJyImPQE0NjIWHQEUBgMP/eMnQicSGRExIwIdIzExI/5PDBISDAGxJ0InJ0JBxQwSEgzFDBISBQ0RERkSEv7RxAwSEgzEDRER2A0RERkSEh4lQCYCJgwSEgz92iEuLiECJiEuEhgSJUAm/domQCUCfREZEhIZEcARDbwMEhIMvA0R/sYRGRISGREEEQ28DRERDbwNEQAAAAQAAP/hA58DHwAmAD8AQABJAAAFISIuATURNDYyFhURFBYzITI2NRE0JiMhIiY0NjMhMh4BFREUDgElIi4BNwE2MzEyHwElNh4BBgcFBiYvAQMGASMUFjI2NCYiBgMP/eMnQicSGRExIwIdIzExI/5PDBISDAGxJ0InJ0L9VQwRAggBDAkODQmtAQYMFggMC/7nCBIGpPUJAiNGKTopKTopHiVAJgImDBISDP3aIS4uIQImIS4SGBIlQCb92iZAJaQPGQoBLgoLylcEDBcWBF4DBQfA/uwKAZkdKSk6KSkAAwAA/+EDnwMfACYAMwBcAAAFISIuATURNDYyFhURFBYzITI2NRE0JiMhIiY0NjMhMh4BFREUDgEBIiY9ATQ2MhYdARQGAyIuAjQ2NzYyFhQHDgEUHgIyNjc+AScuAScmNDYyFx4BFxYGBw4BAw/94ydCJxIZETEjAh0jMTEj/k8MEhIMAbEnQicnQv7JDRERGRISDDBXQyQkIggZEgkZGxsyQUdBGRwbBAMaFgkSGQkdIwQFJCUiVx4lQCYCJgwSEgz92iEuLiECJiEuEhgSJUAm/domQCUBshIMnQwSEgydDBL+/iRDV19WIgkSGAkZQUdBMxoaGhxKKB84FgkYEgkdSyk1ZCYhJAAAAAIAAP/hA58DHwAmADoAAAUhIi4BNRE0NjIWFREUFjMhMjY1ETQmIyEiJjQ2MyEyHgEVERQOASUjIi8BJj4BFh8BEz4BHgEHAwYjAw/94ydCJxIZETEjAh0jMTEj/k8MEhIMAbEnQicnQv6kAQ0JsAgCExkImeYIGRICCP0JDh4lQCYCJgwSEgz92iEuLiECJiEuEhgSJUAm/domQCXbC80KGBECCrMBAwkCERgK/uMKAAAAAAMAAP/hA58DHwAmADQAQgAABSEiLgE1ETQ2MhYVERQWMyEyNjURNCYjISImNDYzITIeARURFA4BJTEiJjUTNDYyFhUDFAY3MRQGIyUiJj4BMwUyFgMP/eMnQicSGRExIwIdIzExI/5PDBISDAGxJ0InJ0L+yg0RAhIZEQIS7hUP/lUOFQEUDwGrDhUeJUAmAiYMEhIM/dohLi4hAiYhLhIYEiVAJv3aJkAlpBUOAasPFBUO/lUPFPcMEgMRGRIDEQAAAAAEAAD/4QOfAx8AJgA0ADUAQQAABSEiLgE1ETQ2MhYVERQWMyEyNjURNCYjISImNDYzITIeARURFA4BJTEiJjUTNDYyFhUDFAYDIxQeATI+ATU0JiIGAw/94ydCJxIZETEjAh0jMTEj/k8MEhIMAbEnQicnQv7KDRECEhkRAhILMA0WGhYNHCgcHiVAJgImDBISDP3aIS4uIQImIS4SGBIlQCb92iZAJXoSDAFuDBISDf6TDRECBQ0XDQ0XDRQcHAAFAAD/vwO/Az8AEAARAB4AMwBIAAAlIi8BMSYnJj4BHwEeAQcOAScHIiY9ATQ2MhYdARQGEyInJicmNDc2NzYyFxYXFhQHBgcGAyIHBgcGFBcWFxYyNzY3NjQnJicmApcGBsgPBQQJGQ3JDAwFBBHSBw4TExwTEyl5aWU7PT07ZWnyaWU7PT07ZWl5Z1lXMjQ0MldZzllWMzQ0M1ZZxgNLBg4LGAsESwUZDQoMbR8TDvYOExMO9g4T/qw9O2Zo82hlOz4+O2Vo82hmOz0DPDQyV1jPWVYzNDQzVlnPWFcyNAAAAAAEAAD/4QOgAx4ALQA6AEoATgAABSEiLgE1ETQ+ATMhMh4BFREUBiImNRE0JiMhIgYVERQWMyEyNjU0NjIWFRQOAQMiJj0BNDYyFh0BFAYXISImNRE0NjMhMhYVERQGJSERIQMQ/eInQicnQicCHidCJxIZETEj/eIjMTEjAh4jMREZEidC2QwSEhgSEmn+XBEZEw0BuA0TGf5dAYD+gB8mPyYCJiZAJSVAJv7DDBISDAE9IS4uIf3aIS4uIQ0REQ0mPyYCAxIMmA0REQ2YDBJsGRIBWA0TEg7+qBIZPAErAAcAAP/oA54DHQALAC0ASwBYAGUAZgBvAAAlISImNDYzITIWFAYXISIuAjURND4COwE3PgEzITIWHwEzMh4CFREUDgIBIgYVERQWMyEyNjURNCYrASImLwEmIyEiDwEOASMTIi4BND4BMh4BFA4BAyIOARQeATI+ATQuARMjFBY+ATQmIgYCR/63DRERDQFJDBISvP3jHTUoFRUoNR0vDgQnGgEtGicFDhodNSgVFSg1/cYiMTEiAh0iMTEiMwsQAhIFB/7TBgUSAxALxzRYNDRYaFkzM1k0JDwkJDxIPSMjPbUsGiQaGiQaWBIZEREZEnAZLDkeAYcfOC0YRxQaGhRHGC04H/55HjksGQKDOCj+eSc5OScBhyg4DgpbAgJbCg7+bTRYaFg0NFhoWDQBRCM9SD0jIz1IPSP+WhIaARkkGhoAAAQAAP/iA6EDHgADACEAPABJAAAlIRUhBSEiLgE1EScmNjc+ATMhMhceAR8BMzIeARURFA4BASIGBwYfAREUFjMhMjY1ETQmKwEiJi8BLgEjExQeATI+ATQuASIOAQEAAX7+ggIR/eInQicCARISFDgfARc5MxkkCQFYJ0InJ0L9uBQiCxMBAjEjAh4jMTEjbQoQAwgLRyi/DBQXFQwMFRcUDOU8xyhEKAGciRgtEhUWIhAtGQQoQyj+aChEKAL/DQwTGYz+ZiUzMyUBmCQzCwkYIS/95gwUDAwUGBUMDBUACQAA/98DoQMhAA8AJwA4AEgATABcAGAAcAB0AAABBwYiLwEmND8BNjIfARYUByImLwEuATQ2PwE+ARYfAR4BFAYPAQ4BAyIPAQYUHwEWMj8BNjQvASYBISImNRE0NjMhMhYVERQGJSERIQMhIiY1ETQ2MyEyFhURFAYlIREhASEiJjURNDYzITIWFREUBiUhESEBxlYaSxpWGhpWGksaVhqvGCwSVRESEhFVGD4+F1UREhIRVRIsFxoRVRISVREzEVUSElURAir+2xIaGhIBJRIaGv7ZAQX++5z+2xIaGhIBJRIaGv7ZAQX++wLG/tsSGhoSASUSGhr+2QEF/vsCEFUaGlUbShtVGhpVG0qoEhFVESwwLBFVFxAQF1URLDAsEVUREgFeElURMhJUEhJUEjIRVRL+tRoSASUSGhoT/twSGjwBBf0JGhIBLhIaGhL+0hIaPAEO/roaEgEvEhoaEv7REho8AQ8ACgAA/9wDnQMeAA8AEwAjACcANwA7AEgAVQBiAG8AAAUhIiY1ETQ2MyEyFhURFAYlIREhASEiJjURNDYzITIWFREUBiUhESEnISImNRE0NjMhMhYVERQGJSERIQEiJjURNDYyFhURFAYXBiY9ATQ2MhYdARQGJyImPQE0NjIWHQEUBhciJjURNDYyFhURFAYBtf7TEhoaEgEtExkZ/tABDf7zAtn+0xMZGRMBLRIaGv7RAQ3+85n+0xIaGhIBLRMZGf7QAQ3+8wG7DBISGRERfgwSEhgSEgwMEhIYEhJvDBISGRERIxoSATUSGhoS/ssSGjwBFf6zGhIBNRIaGhL+yxIaPAEVaRoSASoTGRkT/tYSGjwBCv7BEQ0BMgwSEgz+zg0RCAESDGYMEhIMZQ0R3BENXgwSEgxeDRHUEQ0BMgwSEgz+zg0RAAYAAP/gA5gDHAAMABAAHQApADYAQgAABSEiJjURNDYzIREUBiUhESETIiY1ETQ2MhYVERQGASEiJjQ2MyEyFhQGASImNRE0NjIWFREUBhMjIiY0NjsBMhYUBgMC/fsWHhINAk4e/e0B9f4Lmg0RERkSEgHO/Q0MEhIMAvMMEhL+0w0RERkSEgbVDRERDdUNEREfHhYCeA0R/WoWHjwCUv4fEgwBIQ0REQ3+3wwSAeQRGRISGRH+GhIMASIMEhIM/t4MEgJUERkSEhkRAAMAAP/hA58DHgATADoAUAAAJTEiLwEmPgEWHwE3PgEeAQ8BBiMXISIuATURNDYyFhURFBYzITI2NRE0JiMhIiY0NjMhMh4BFREUDgE3IiY1ETQmIyEiJjQ2MyEyHgEVERQGAaUOCXoIAhMZCGSZCBkSAgiwCQ71/kQiOCERGRIlGgG8GiUlGv6dDRERDQFjITkhITnFDBIkGv6hDBISDAFfITkgEcIKkAoZEAIKdq8JARAZCcgL4CE4IQHRDBISDP4vGSUlGQHRGiQSGBIhOCH+LyE4IfARDQG1GiQSGBIhOCH+Sw0RAAADAAD/7wOkAw4ANQBoAHQAAAUiLwEmIg8BBiMiJy4BPwE2Ji8BLgE+AT8BPgE/AT4BMhYfAR4BHwEeAgYPAQ4BHwEWBgcGJzIfARY+Ai8BJjY/AT4BLgEvAS4BLwEuASIGDwEOAQ8BDgIWHwEeAQ8BBh4CPwE2NyMiJjQ2OwEyFhQGAsEaF3oJFgp6FxohHBgXBhcCBwhjFQ4SLh2JChIFPQ0zPDINPQUSC4geLRMOFmIIBwIXBRYZG+EaFnoMGRUJAhcFEBNiCgYIFAyJGSoLPQYVGhUGPQwpGogNEwgGCWMSEAQXAwoVGQt6F2OHDBISDIcNEREQDEAFBUAMFBI3HYgLFQdhFTk5JgUUAQ0KexsgIBt7Cg0BFAUmOTkVYQcVC4gdNxIUjQxABgIPFw2IGTESYAoYGBEBFAQeF3wMDQ0MfBceBBQBERgYCWESMRmIDRcPAgZADLwSGRERGRIAAwAA/+EDnQMcACMALwA8AAAFISImNRE0NjMhMhYUBiMhIgYVERQWMyEyNjURNDYyFhURFAYTISImNDYzITIWFAYHIiY1ETQ2MhYVERQGA0v9aCEwMCEBTQwSEgz+swgNDQgCmAkMEhkRLw7+xw0REQ0BOQwSEqkMEhIZEREfMCECmCIvERkSDAn9aAgNDQgBYA0REQ3+oCEwAmARGRISGRGdEgwBOgwSEgz+xgwSAAAEAAD/4AOiAyAAIwAoADsARwAABSEiJjURNDYzITIWFAYjISIGFREUFjMhMjY1ETQ2MhYVERQGAxcDBycTIgcBBh8BHgEzNzY3ATYmLwEmAyEiJjQ2MyEyFhQGA0/9ZSIwMCIBTg0REQ3+sgkNDQkCmwkNERkSMHxg7lIO5AoF/vAFAhUCFA1/CAQBEAYIC4sNWP7FDRERDQE7DBISIDAiApwiMBIZEQ0J/WQJDQ0JAWINEREN/p4iMALySP7CClIBhwb+lAUIewwRDgEGAWsIFghoCf1qERkSEhkRAAAAAAYAAP/hA6IDHQAPABMAIAAsADgARQAABSEiJjURNDYzITIWFREUBiUhESEXIiY9ATQ2MhYdARQGBSEiJjQ2MyEyFhQGByEiJjQ2MyEyFhQGAyImPQE0NjIWHQEUBgNu/SsWHh4WAtUVHx/9HgLF/TueDBISGRERAX3+dQ0REQ0BiwwSEhP+ggwSEgwBfg0REQUMEhIYEhIfHxUCfxUfHxX9gRUfPAJvZBIMuQwSEgy5DBK7ERkSEhkRvBEZEhIZEQF3Egy5DBISDLkMEgAAAAAFAAD/4wOgAx4AIwAvADwASQBVAAAFISImNRE0NjMhMhYUBiMhIgYVERQWMyEyNjURNDYyFhURFAYBMzIWFAYrASImNDY3MhYdARQGIiY9ATQ2JTIWFAcBBiImNDcBNgMhIiY0NjMhMhYUBgNO/WghMDAhAU0MEhIM/rMIDQ0IApgJDBIZES/+hcUMEhIMxQwSEgkMEhIYEhIBewwSCf7ACRkSCQFBCXX+gQ0REQ0BfwwSEhwvIgKYITASGREMCf1oCQwMCQFgDBISDP6gIi8BuhEZEhIZEckRDcQNERENxA0RqBEZCf7ACRIYCQFBCP1nEhkRERkSAAUAAP/jA6ADHgAjAC8APABJAFUAAAUhIiY1ETQ2MyEyFhQGIyEiBhURFBYzITI2NRE0NjIWFREUBgMjIiY0NjsBMhYUBgciJj0BNDYyFh0BFAYFIiY0NwE2MhYUBwEGFyEiJjQ2MyEyFhQGA079aCEwMCEBTQwSEgz+swgNDQgCmAkMEhkRLxLFDBISDMUMEhIJDBISGBIS/oUNEQkBQAkZEQj+vwni/oENERENAX8MEhIcLyICmCEwEhkRDAn9aAkMDAkBYAwSEgz+oCIvAvASGRERGRLJEgzFDBISDMUMEqgSGAkBQQkSGQn+wAntEhkRERkSAAAAAwAA/+EDnwMdAAsAKwBMAAABISImNDYzITIWFAYDISInLgE9ATQ2MhYdARQWMyEyNj0BNDYyFh0BFAYHBhMiJj0BNCYjISIGHQEUBiImPQE0Njc2MyEyFx4BHQEUBgOB/P8MEhIMAwEMEhKj/i0vIxEUEhkRIxgB0xgjEhgSExIiKQwSIxj+LRgjERkSFBEjLwHTMCISExIBaxEZEhIZEf53HA8nFYMNERENgxIZGRKDDRERDYMVJw8cAjISDIMSGhoSgwwSEgyDFSgOHR0OKBWDDBIAAAAAAgAA/+EDngMeABMAKwAABSEiJjURNDYyFhURFBYzITIWFAYnIi8BBwYmJwMmPgEWHwE3NhYXExYGBwYDgP03IzISGBIPCgLJDBISQRAJn8UJHQnNBwMUGQe2xgkfCLYHBQoIHjEkAsgNEREN/TgLDhIZEfQN8fMMAQwBEwoYDwQK8/QMAQ3+7QoYBwUAAAAABAAA/+EDngMeABMAIAAtAD0AAAUhIiY1ETQ2MhYVERQWMyEyFhQGJSImNRE0NjIWFREUBjciJjURNDYyFhURFAY3IiY1AzQ2MzEyFhUTFAYjA4D9NyMyEhgSDwoCyQwSEv3KDRERGRISzwwSEhgSEtEMEgMSDAwSAxIMHjEkAsgNEREN/TgLDhIZEZMSDAHoDBISDP4YDBI9EgwBag0REQ3+lgwSNRANAQEMEhAO/wANEQAABgAA//YDnQMJAAsAGwAnADcAVgB1AAABISI9ATQzITIdARQHISImPQE0NjMhMhYdARQGByEiPQE0MyEyHQEUByEiJj0BNDYzITIWHQEUBgMiJi8BIyIuATURND4BMyEyHgEVERQOASsBBg8BDgEBIgYVERQWOwEyFxYfARYyPwE2Nz4BOwEyNjURNCYjAsz+aQUFAZcEBP5pDhUVDgGXDhQUDv5pBQUBlwQE/mkOFRUOAZcOFBTUHDQVSmQnQiYmQicCGydBJydBJ1oHBzsUNf7RIzAwI3IPCQQERxhFGDsHBgQOCGsiMTEiAgEEJQUFJQQFDwscCw8PCxwLD68FGgQEGgUWDwscCw8PCxwLD/6/FhRLJkInAYAnQScnQSf+gCdCJgkHOxQWAtcxIv6AIzAMBgRGGRk6CAoICDAjAYAiMQAACAAA/+ADmwMdAAwAGQAlADEAPgBLAFgAZQAAASImPQE0NjIWHQEUBgMiJj0BNDYyFh0BFAYBIyImNDY7ATIWFAYhIyImNDY7ATIWFAYBIiY0PwE2MhYUDwEGASImND8BNjIWFA8BBhMiLwEmNDYyHwEWFAYBIi8BJjQ2Mh8BFhQGAf8MEhIZEREODBISGRER/v+IDBISDIgMEhICZ4gMEhIMiAwSEv1+DBIJYAkYEglgCAGvDREIYAkZEQhgCT4MCWAJEhkJXwkR/jgNCV8JERkJYAkSAlkSDIgMEhIMiAwS/YgRDYcNERENhw0RAYMRGRISGRERGRISGRH+8hIZCGAJEhkIYAkBvBEZCWAIERkJYAj+RAlgCBkSCWAIGRIBvAhgCRkRCGAJGREABAAA/7UDlgNFACMAMABUAGEAACUiJy4CJyY3Njc+ATc2Fx4BDgEnJgcGBwYHBh4BFx4BBw4BEyIvASY0NhYfARYUBgMiJy4BPgEXFjMyNz4BNzYuAScuAT4BFx4CFxYHBgcOAQcGByIvASY0NjIfARYOAQFfBwY6WzsKCg0OKyp8SUtNDA4FFAxWU1A3OhAOJVxCDAgFBA/VDQhJCBIZCUgIEjgkJAwOBRQNHh9iUzZGDA0kXEMLCQsXCzpcOgoKDA8rKXxJKCoMCUgJEhkJSAkBEh0DG1hwP0FBTEE+VBAQDgMUGQ4DEB0dQEJWSIxvHwUXCwkJAqAJTAkZEQEJSwkZEf1CBwIUGQ4CBjgka0BIjG8fBRcXCQYbV3E+QUFNQD5VEAhJCUsJGREJTAkYEQAAAAAGAAAAAAOmAxEAFwAmAC8AOABBAEoAACUhIicmJwMnJj4BFh8BITIWFxYHAwYHBgEXEx4BMyEyNjcTNicmIwEiJjQ2MhYUBiciBhQWMjY0JgUiJjQ2MhYUBiciBhQWMjY0JgL+/isiHCAGOSgDDhkUAhMCjRcpDRoHPAYfHP2cCjoBGA8B1Q8YAjwDCQoV/j0nODhONzcnDxQUHRQUASknODhONzcnDhUVHBQUhRIVIAFM0wwVBA4MYhIQHyj+oSAVEgHTNv60Bw4OBwFfDQoM/a43Tjg4TjeBFRwUFBwVgTdOODhON4EVHBQUHBUAAAAEAAD/3gOeAz4ARQCwAL0AygAABSMiJj0BJicHBiYvASY2PwEmNTQ3Jy4BPwE+AR8BNjc1NDY7ATIWHQEWFzc2Fh8BFgYPARYVFAcXHgEPAQ4BLwEGBxUUBiUyFxYXHgEdARQWOwEyNj0BNDY3Njc+AR8BFjY/ATYmLwEuATc2NTQnJjY/AT4BLwEuAQ8BBiYnJicuAT0BNCYrASIGHQEUBgcGBw4BLwEmBg8BBhYfAR4BBwYVFBcWBg8BDgEfAR4BPwE2NyIuATQ+ATIeARQOAQMiDgEUHgEyPgE0LgECL10gLTEqGhw9EC8QERseAwUkHBAQLhA9HC0kKS0gXSAtLykjGz0QLxARGyMDBxkbERAvED0cJiElLf7fDAgvOwoLCgddBwoLCjAoBxMINwYOAy8DAwYtCQgDCwYCCAg2BgMDLwMNBjYIFActOgoLCgddBwoLCjQrBxMIPgYNBC8DBAY3CQgCCQUCCAgwBgMDLwMOBi0H2yxLLCxLWEssLEssHC8cHC84LxwcLyEtHyQTIg8QEBxQHD0QERcXIB8VED0cURsQDxobECwgLS0gLBMgFBAQHFEbPRAVGRkkIw8PPhtRGxEQFhcOJB8t6AgsEwMPCjkGCgoGOQoPAxAgBQIFIAQEBlEGDQQZBhMKJiceHQoSBR8DDQZRBgQEHwQCBioSAxAKQQcKCgdBChADESMGAgUkAwQFUQYOAyAFEwoiJBwbChIEHAMOBlAGBAQaBCQsS1hLLCxLWEssAQocLzgvHBwvOC8cAAQAAP/bA3EDIAAMABkAMgA4AAAlIi4BND4BMh4BFA4BAyIOARQeATI+ATQuAQMiJyUuATURNDY3JTYyFwUeARURFAYHBQYlBSURJQUCAC1LLS1LWkwsLEwtHDAdHTA5MBwcMB0MC/6+CwwMCwFCCxkKAUILDAwL/r4L/sABNAE0/sz+zNgtTFlMLCxMWUwtAQ4cMDkwHR0wOTAc/fUGugYWDAF0DBYGugYGugYWDP6MDBYGugbwsrIBZLKyAAAAAAMAAAAAA6MCzAAcADkAUgAAJSEiLgI1NDY3NTQ+AjIWFxYXMzIeAhQOAgEiDgEVFB8BBw4BFRQeATMhMj4BNC4BKwE1LgIXIiY1JicmJyYjIiY0NhYXFhcWFxYXFAYjAq7+pzBZRSUwKyVGWGBYIjsNDDFYRiUlRlj+0jJVMQIDESUqMVUxAVkyVDIyVDJFAjJTQQwSAjMRFQwFDBESFw8dGSQWGwIRDEoiP1MuM10gDi1TPyIgHzRLIUBTW1M/IgJFLUwsDAwUChdJKC1MLS1MWkwsHS1JK9URDDkYCAQDEhkRAQMFDBEdJDMMEwAAAAQAAAAAA50CtQAMABkAJgBoAAAlIiY1ETQ2MhYVERQGByIvASY0NjIfARYUBiciJjQ/ATYyFhQPAQY3IiY0NjMyPgE0LgErASImJy4BIgYHDgErASIOARQeATMyFhQGIyIuAjQ2Nz4BNzY3PgEyFhcWFx4BFx4BFA4CAgQMEhIZERERDAlmCREZCWYJEgwNEQhnCBkSCWYJsgwSEgwsSywsSywNChADDFNqUw0CEAsNLEosLEosDRERDSxRPyIiHx5MKhQvHEVIRBwvFSpMHh8iIj9RbhIMAS0MEhIM/tMMEgcJZgkZEQlmCRgSARIZCGcIERkJZgkEERkSK0tYSywMCzNCQjMLDCxLWEsrEhkRIT9SWVEfHiIBOSUXGBgXJTkBIh4fUVlSPyEAAAMAAP/gA4oDHQAVACcAPgAABSEiJicuATcTPgEzITIWFxMWBgcOAQEiBgcDBh4BMyEyPgEnAy4BIwciJyYnLgI+ARcWFxYXFjc2HgEGBwYDD/3lFyoQGBIIWgdEKgFjKkQHWggSGBAq/ioUIgRaBQseFAIbFB4LBVoEIhStGxwfHhAUBwwXCwgNGRlONwsYDgUKNyAUExxTLgIRKz09K/3vLlMcExQDASAX/fAgOyMjOyACEBcguwYGDAYLGBYHBgQFCgUOJQcFFRgHJQAAAAAGAAD/3wOVAx4AIQBDAE8AWwBzAHUAACUhIi4BPQE0PgE7ATU0PgI7ATIeAh0BMzIeAR0BFA4BJSIGHQEUFjMhMjY9ATQmKwEiJjURNC4BKwEiDgEVERQGIwUjIiY0NjsBMhYUBgMjIiY0NjsBMhYUBhciJicmJyYnIiY0NjMyFxYXFhcWFxYGBycxAx79xCA2ICA2IAwoS140FTReSygRIDcgIDf9pBgiIhgCPBgjIxgvDBI2XTYVNl02EQ0BQ50OExMOnQ0UFE8ZDxYWDxkPFRVnDBEBBTMaGwwREQ0JDx4ZIhYcBQEQDI07HTIeBh4yHe0wVkIjI0JWMO0dMh4GHjIdpB0UBhUcHBUGFB0RDQELMFAvL1Aw/vUNEf8TGxMTGxMC9RYeFRUeFusPDC8UCwERGRIDBAsPGCAsDRMBagAAAAAFAAD/4gMgAx4ADwATAB8AIAAtAAAFISImNRE0NjMhMhYVERQGJSERIQUhIiY0NjMhMhYUBgMjFB4BMj4BNC4BIg4BAuz+KhYeHhYB1hUfH/4dAcb+OgFj/wAMEhIMAQAMEhKMNA4YHBcODhccGA4eHxUC1BUfHxX9LBUfPALEjxIYEhIYEv4YDhgNDRgcGA4OGAAABAAAAAADnALTAA8AEwAiADEAACUhIiY1ETQ2MyEyFhURFAYlIREhASIvAS4BPgEfAR4BBw4BByImJyY2PwE2HgEGDwEGA2j9MhYeHhYCzhUfH/0lAr79QgFjBAW6DQoGFgy7CwwDAxAICRADBAwMugwWBwsNugQ3HhYCMxYeHhb9zRYePAIj/p8BOAQWFwwDOAQWDAkMBAsKDBYDOAQMFxYEOAEAAAAACAAAAAADnQLTAA8AEwAUACEAIgAvADAAPQAAJSEiJjURNDYzITIWFREUBiUhESETIxQeATI+ATQuASIOAQUjFB4BMj4BNC4BIg4BBSMUHgEyPgE0LgEiDgEDaP0yFh4eFgLOFh4e/SQCvv1CmT8RHSIdEREdIh0RAQQ/ER0iHRERHSIdEQEEPhAeIR0RER0hHhA3HhYCNBUfHxX9zBYePAIk/ukQHhAQHiEdEREdERAeEBAeIR0RER0REB4QEB4hHRERHQAAAAAGAAAAAAOgAtYACwAXACMALwA7AEcAAAEhIiY0NjMhMhYUBgMhIiY0NjMhMhYUBhMhIiY0NjMhMhYUBgUjIiY0NjsBMhYUBgMjIiY0NjsBMhYUBgMjIiY0NjsBMhYUBgOB/dIMEhIMAi4NEREh/eUNERENAhsNEREE/dINERENAi4MEhL9V18MEhIMXw0REQ1fDBISDF8NERENXwwSEgxfDRERAWISGRERGRL+yBIZEREZEgJwERkSEhkRAxEZEhIZEf7KERkSEhkR/soSGBISGBIAAAcAAAAAA6QC7QAWACwALQAvADAARwBjAAAlIiclJicmPQE0NzY3JTYeAhURFA4BJxYyNzY1ETQnJiIHBQYHBh0BFBcWFzERMDEBIi4BNzYnJicuAT4BFhcWFxYXFgYHBhciJjQ3NicmJyYnJicuAT4BFhcWFxYXFhcWBwYB5Bka/uUZDg0NDhkBGxw3LRkZLzgNGgkUFAkaDf7kBAUHBwUEAfELEgIIPBgIEAkMBhUYBwgJEwkPGCcJTQ0RCYIDAiAWJBMNCQIQGRMNGhYfEhcCA5QJFAt9CyAdIPcgHSALfQwCHjMg/g0gMx9CBgYOIgHzIw0GBn0DDA8T9xIQDAMBWf6TDxkJSXIkJRUUGA0GCw0WKitGei8LehIZCX6IQkIvKxYMCBkSAhEOHCEtMD09o5AJAAAAAAMAAP/hA24DHAAYAC0AOgAAJSInLgEnJjQ3PgE3NjIXHgEXFhQHDgEHBgMiBwYHBhQXFhcWMjc2NzY0JyYnJgEiLwEmPgEWHwEWDgEB+EhCP2MaHBwaYz9CkEJAYhscHBtiQEJIUERDJygoJ0NEoEVCKCgoKEJFAQYOCY4IBBIYCY4IBBFWHBtiQEKQQj9jGxsbG2JAQpBCQGIbHAKJKCdDRKBFQigoKChCRaBEQyco/QMLrwoYDwELrgsYDgAAAAgAAP/fA58DHgAQAB0AKgAzAD8ASwBYAGUAACUiLgI0PgIyHgIUDgIDIg4BFB4BMj4BNC4BAyIuATQ+ATIeARQOASciBhQWMjY0JgUjIiY0NjsBMhYUBiEjIiY0NjsBMhYUBgEiJj0BNDYyFh0BFAYDIiY9ATQ2MhYdARQGAgA0YEooKEpgaGBKKChKYDQ1WjU1WmpaNTVaNSQ9JCQ9SD0kJD0kHCcnOCcn/v2YDRQUDZgOFBQCVpgNFBQNmA4TE/51DhMTHBMTDg4TExwTE3coSmBpX0ooKEpfaWBKKAHKNVpqWjQ0WmpaNf63JD1IPSQkPUg9JMgnOCcnOCdkExwTExwTExwTExwT/oQTDpgOExMOmA4TAmQTDpgNFBQNmA4TAAADAAAAAAOfAuUADAAZADcAABMiLwEuAT4BHwEeAQYnIiY0PwE2MhYUDwEGASEiJjQ2MyEyPgE0LgEjISImNDYzITIeAhQOAu0KCG0JAw8ZCW0KAhB6DBIIXwkZEglfCAHU/mENERENAZ9FdUVFdUX+YQ0REQ0Bnz9zWTAwWXMB7AZVCBkTAwdWBxkVWxEZCWEJERkJYQn92xEZEkNzh3NDEhgSL1dyfHFYLgAABgAA/+EDJgMdABMAJwBCAE4AWgBmAAAlIyIuATURND4BOwEyHgEVERQOAQMiDgEVERQeATsBMj4BNRE0LgEjAyIuAjU0NjIWFRQeATI+ATU0NjIWFRQOAgMjIiY0NjsBMhYUBgcjIiY0NjsBMhYUBgcjIiY0NjsBMhYUBgH5GDdeODheNxg3Xjc3Xk8nQycnQycYJ0InJ0InDD9yWDASGRFEdIl0RBIZES9Yc29/DBISDH8MEhIFfwwSEgx/DBISAn4NERENfg0REWs3XjcBGTheNzdeOP7nN143AnYnQyf+5ydCJydCJwEZJ0Mn/QEvWXI+DRERDUR0RER0RA0REQ0+clkvAlIRGRISGRGXERkSEhkRlxEZEhIZEQAKAAD/+ANyAtoADwATABQAIQAiAC8APwBDAEQAUQAAASEiJj0BNDYzITIWHQEUBiUhNSEFIxQeATI+ATQuASIOAQcjFB4BMj4BNC4BIg4BASEiJjURNDYzITIWFREUBiUhNSEFIxQeATI+ATQuASIOAQNA/X8UHR0UAoEUHBz9dgJr/ZUCBi0MFRgUDAwUGBUMUiwLFRgVDAwVGBULARn9hhYeHhYCehUfH/15Amr9lgIFLQwVGBUMDBUYFQwBgB0U+BQcHBT4FB084XAMFQwMFRgUDAwUDAwVDAwVGBQMDBT9vx8WAQwWHx8W/vQWHzz+fwwVDAwVGBUMDBUAAAAAAgAA/+EDmgMYAAwAGgAABSInASY+AhcBFhQGISIuATcBMTYeARQHAQYDewwJ/QcKAhAZCQL5CRH8+gwRAQkC+QoYEQn9BwkeCAL5ChkQAQn9BwkZEREYCgL5CQERGQn9BwgAAAQAAAAAA58CuAALABgAJAAxAAABISImNDYzITIWFAYnIi8BJjQ2Mh8BFhQGByEiJjQ2MyEyFhQGBSIvASY0PgEfARYUBgNz/Q4NERENAvINEREEDQiiCREZCaIJEgf9DQwSEgwC8wwSEv2bDAmiCREYCqIJEgHYEhkRERkSAQmiCRkRCKMIGRLYERkSEhkRowijCBkRAQmiCRkRAAMAAAAAA34CsAALABQAIQAAASEiJjQ2MyEyFhQGJyMnJjQ+AR8BASImND8BNjIWFA8BBgNS/UgNERENArgMEhIRAewJEhgK7P78DREJ7AkZEQnsCQF9EhgSEhgSE+wJGBECCuz+4RIZCO0IERkJ7AkAAAAAAgAAAAADngLgACsAVwAAJSEiLgE9ATQ+ATMyFhQGIyIGHQEUFjMhMjY9ATQmIyImNDYzMh4BHQEUDgETIiY0NjMyNj0BNCYjISIGHQEUFjMyFhQGIyIuAT0BND4BMyEyHgEdARQOAQIw/qogNyAgNyANERENGCMjGAFWGSMjGQwSEgwhNyAgN9UMEhIMGSMjGf6qGSMjGQ0REQ0gNyEhNyABViE3ICA3ICE3IMwgNyESGREjGcwZIyMZzBkjERkSITcgzCA3IQEEERkSIxnMGCMjGMwZIxIZESA3IcwgNyAgNyDMITcgAAAAEgDeAAEAAAAAAAAAEwAAAAEAAAAAAAEACAATAAEAAAAAAAIABwAbAAEAAAAAAAMACAAiAAEAAAAAAAQACAAqAAEAAAAAAAUACwAyAAEAAAAAAAYACAA9AAEAAAAAAAoAKwBFAAEAAAAAAAsAEwBwAAMAAQQJAAAAJgCDAAMAAQQJAAEAEACpAAMAAQQJAAIADgC5AAMAAQQJAAMAEADHAAMAAQQJAAQAEADXAAMAAQQJAAUAFgDnAAMAAQQJAAYAEAD9AAMAAQQJAAoAVgENAAMAAQQJAAsAJgFjQ3JlYXRlZCBieSBpY29uZm9udGljb25mb250UmVndWxhcmljb25mb250aWNvbmZvbnRWZXJzaW9uIDEuMGljb25mb250R2VuZXJhdGVkIGJ5IHN2ZzJ0dGYgZnJvbSBGb250ZWxsbyBwcm9qZWN0Lmh0dHA6Ly9mb250ZWxsby5jb20AQwByAGUAYQB0AGUAZAAgAGIAeQAgAGkAYwBvAG4AZgBvAG4AdABpAGMAbwBuAGYAbwBuAHQAUgBlAGcAdQBsAGEAcgBpAGMAbwBuAGYAbwBuAHQAaQBjAG8AbgBmAG8AbgB0AFYAZQByAHMAaQBvAG4AIAAxAC4AMABpAGMAbwBuAGYAbwBuAHQARwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABzAHYAZwAyAHQAdABmACAAZgByAG8AbQAgAEYAbwBuAHQAZQBsAGwAbwAgAHAAcgBvAGoAZQBjAHQALgBoAHQAdABwADoALwAvAGYAbwBuAHQAZQBsAGwAbwAuAGMAbwBtAAACAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIBAgEDAQQBBQEGAQcBCAEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8BIAEhASIBIwEkASUBJgEnASgBKQEqASsBLAEtAS4BLwEwATEBMgEzAAZmYW5odWkHd2VuamlhbgZmYW5nZGEGdHVwaWFuBWthaWppCXh1YW56aG9uZwd4aW56ZW5nBnRpeGluZwdzaGlqaWFuBmJhb2N1bgt6aGFveGlhbmdqaQp3ZW5qaWFuamlhB2NoZW5neHUHZXJ3ZWltYQdzaGFuY2h1BWZ1emhpCHNob3VjYW5nB3RpYW5qaWEGYmlhbmppBHJpbGkFZGFvcnUGZGFvY2h1CHNhb3lpc2FvCXpoZXhpYW50dQt6aHV6aHVhbmd0dQtkdWlodWFrdWFuZwdkZW5nZGFpCHNodWF4aW4xCGdvdXd1Y2hlBnNoZXpoaQdzaGV6aGkxA3l1bgZ4aWF6YWkIZ291d3VkYWkHeGlhb3hpMQZzaG91amkHeGluZmVuZwhnZW5nZHVvMQdsaWViaWFvCHNoZW5neWluB2ppYW5zdW8HZGluZ3dlaQdmYW5odWkxCW1haWtlZmVuZwRqaXFpBmd1YW5iaQZ0aWh1YW4HamlhbnRvdQdsaWFuamllAAAAAAA=) format('truetype');
	}
	
	.hxicon{
		font-family:"hxicon" !important;
		font-size:20px;font-style:normal;
		/* #ifndef APP-NVUE */
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
		/* #endif */
	}
	/* #ifndef APP-PLUS-NVUE */
	@font-face {
	  font-family: 'hxicon';  /* project id 2009392 */
	  src: url(data:font/truetype;charset=utf-8;base64,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) format('truetype');
	}
	/* #endif */
	$nav-height: 44px;
	.hxicon {
		font-family: hxicon;
		text-decoration: none;
	}
	// .hxicon{
	// 	font-family: hxicon;
	// 	font-size:20px;
	// 	font-style:normal;
	// 	/* #ifndef APP-PLUS-NVUE */
	// 	-webkit-font-smoothing: antialiased;
	// 	-webkit-text-stroke-width: 0.2px;
	// 	-moz-osx-font-smoothing: grayscale;
	// 	/* #endif */
		
	// }
	
	.hd{
		overflow: hidden;
	}
	//防止其他ui影响
	// .hx-navbar uni-view,
	// .hx-navbar uni-scroll-view,
	// .hx-navbar uni-swiper,
	// .hx-navbar uni-button,
	// .hx-navbar uni-input,
	// .hx-navbar uni-textarea,
	// .hx-navbar uni-label,
	// .hx-navbar uni-navigator,
	// .hx-navbar uni-image {
	// 	box-sizing: unset;
	// }
	
	// image{will-change: transform}
	
	/* #ifndef APP-NVUE */
	[class*="hx-navbar__"]{
		display: flex;
	}
	
	/* #endif */
	.hx-navbar {
		position: relative;
		padding-top: 0;
		overflow: hidden;
		flex: 1;
		z-index: 101;
		&__stretch{
			align-items: stretch;
		}
		
		&__status{
			position: relative;
			z-index:3;
		}
		&__icon{
			position: relative;
			top: 1px;
			//transition: all 0.2s;
		}
		&__icontran{
			
			border-radius: 100% !important;
			background-color: rgba(0,0,0,.5) !important;
			width: 30px !important;
			height: 30px !important;
			line-height: 30px !important;
			text-align: center !important;
			color: #ffffff !important;
			transition: color,background 0.2s !important;
		}
		&__btntran{
			padding: 0 !important;
			margin-left: 6px !important;
		
			border-radius: 100% !important;
			// background-color: rgba(0,0,0,.5) !important;
			width: 30px !important;
			height: 30px !important;
			line-height: 30px !important;
			text-align: center !important;
			color: #ffffff !important;
			transition: color,background 0.2s !important;
			
		}
		
		&__content{
			position: relative;
			flex: 1;
			z-index:1;
			width: 100%;
			flex-direction: column;
			&__imgctn{
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				z-index: 2;
				//transition: all 0.2s;
				&__img{
					
				}
			}
			&__main{
				position: relative;
				z-index:3;
				flex: 1;
				flex-direction: row;
				align-items: center;
				padding: 0;
				&_back{
					flex-direction: row;
					align-items: center;
					height: 100%;
					padding: 0 13px;
					margin: 0;
					position: relative;
					z-index:2;
					line-height: $nav-height;
				}
				
				&_search{
					position: relative;
					flex-direction: row;
					align-items: center;
					flex: 1;
					height: 100%;
					&_hxicon{
						position: absolute;
						left: 24px;
						font-size: 18px;
						color: #dbdbdb;
					}
					&_input{
						height: 30px;
						flex: 1;
						border-radius: 40px;
						background-color: rgba(32,32,32, .35);
						padding: 0 16px 0 36px;
					}
				}
				&_right{
					position: relative;
					z-index:2;
					flex-direction: row;
					align-items: center;
					height: 100%;
					padding: 0 13px 0 9px;
					margin: 0;
					&_txt{
						max-width: 60px;
						lines: 1;
						text-overflow:ellipsis;
					}
					&_btn{
						justify-content: center;
						align-items: center;
						flex-direction: row;
						align-items: center;
						height: 100%;
						padding: 0 5px;
					}
					
					&_icon{
						justify-content: center;
						align-items: center;
						text-align: center;
					}
				}
				
				&_center{
					flex-direction: row;
					flex: 1;
					//height: 100%;
					align-items: stretch;
					/* #ifdef MP */
					width: 0;
					justify-content: left;
					/* #endif */
					
					/* #ifndef MP */
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 0;
					justify-content: center;
					/* #endif */
					
					&_txt{
						flex-direction: row;
						/* #ifndef MP */
						flex: 46;
						/* #endif */
						/* #ifdef APP-NVUE */
						lines: 1;
						/* #endif */
						/* #ifndef APP-NVUE */
						display: block;
						white-space: nowrap;
						overflow: hidden;
						/* #endif */
						height: $nav-height;
						justify-content: center;
						align-items: center;
						text-align: center;
						text-overflow:ellipsis;
						line-height: $nav-height;
						// overflow: hidden;
					}
					&_flex{
						/* #ifndef MP */
						flex: 32;
						/* #endif */
						/* #ifdef MP */
						width: 0;
						/* #endif */
						
					}
					
				}
				&_left{
					position: relative;
					z-index:1;
					flex-direction: row;
					align-items: center;
					height: 100%;
					padding: 0 9px 0 13px;
					margin: 0;
					&_txt{
						width: 60px;
						lines: 1;
						text-overflow:ellipsis;
					}
					&_btn{
						flex-direction: row;
						align-items: center;
						height: 100%;
						padding: 0 5px;
					}
					// &_btn:first-child{
					// 	margin-left:-4px !important;
					// }
				}
			}
		}
		&__fixed{
			position: fixed;
			top:0;
			z-index: 99;
		}
		&__shadow {
			box-shadow: 0 2upx 12upx #ccc;
		}
			
		&__border:after {
			position: absolute;
			z-index: 3;
			bottom: 0;
			left: 0;
			right: 0;
			height: 1px;
			transform: scaleY(.5);
			background-color: #efefef;
		}
		&__icon{
			top: 0 !important;
			font-size: 20px;
		}
	}
	.hx_font_size{
		font-size: 18px;
	}
	.hx_text_overflow{
		
		/* #ifdef APP-NVUE */
		flex: 1;
		lines: 1;
		justify-content: center;
		align-items: center;
		/* #endif */
		/* #ifndef APP-NVUE */
		display: block;
		white-space: nowrap;
		overflow: hidden;
		/* #endif */
		text-overflow:ellipsis;
		
		text-align: center;
	}
</style>
