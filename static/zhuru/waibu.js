(function() {
		const newDiv = document.createElement('div');
		newDiv.id = 'newDiv';
		newDiv.innerHTML = '<div id="uni-sheetAction" style="display:none;position: fixed;width: 100%;left: 0;bottom: 0;z-index: 100;background-color: #F2F2F2;font-size: 0;z-index: 99999;"><div class="uni-sheet-saveimg" data-img="" style="background-color: #fff;font-size: 15px;color: #333;text-align: center;border-bottom: solid 1px #F2F2F2;line-height: 1;padding: 16px 0;">保存图片</div> <div class="uni-sheet-cancel" style="background-color: #fff;font-size: 15px;color: #333;text-align: center;border-bottom: solid 1px #F2F2F2;line-height: 1;padding: 16px 0;border-bottom: 0;margin-top: 6px;">取消</div></div><div class="uni-sheet-cancel" id="uni-sheetAction-back" style="display:none;position: fixed;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.6);top: 0;left: 0;z-index: 99;"></div>';
	
	   // 将新元素添加到 body 中
		document.body.appendChild(newDiv);
	
		var uniTimer = setInterval(() => {
			// console.log("定时绑定图片")
		    // 获取图片元素
		    // var img = document.querySelector('img');
			var images = document.querySelectorAll('img');
			// 遍历所有图片
			images.forEach(image => {
				let longPressTimer;
				// 绑定触摸开始事件
				image.addEventListener('touchstart', function (e) {
					// 设置长按计时器
					console.log('长按开始')
					longPressTimer = setTimeout(() => {
						console.log('触发下载')
						downloadImage(image.src); // 触发下载
					}, 2000); // 1秒长按触发
				});
		
				// 绑定触摸结束事件
				image.addEventListener('touchend', function () {
					// 清除长按计时器
					clearTimeout(longPressTimer);
				});
		
				// 绑定触摸移动事件
				image.addEventListener('touchmove', function () {
					// 如果用户移动手指，取消长按
					clearTimeout(longPressTimer);
				});
			})
		    
		}, 1000); // 定时绑定图片
	
		
        // 下载图片
        function downloadImage(url) {
			// console.log("下载了个图片"+url)
			$("#uni-sheetAction").show();
			$("#uni-sheetAction-back").show();
			$("#uni-sheetAction").find(".uni-sheet-saveimg").data("img",url)
        }
		$(".uni-sheet-cancel").click(function(){
			$("#uni-sheetAction").hide();
			$("#uni-sheetAction-back").hide();
			$("#uni-sheetAction").find(".uni-sheet-saveimg").data("img","")
		})
		$(".uni-sheet-saveimg").click(function(e){
			var img_url = $(this).data("img");
			var uniData = {
		        data: {
		            event: 'saveImage',
					callback: '',
					value: {
						img_url: img_url,
					}
		        }
		    };
			if(img_url.startsWith('data:')){
				//base64图片
				$.ajax({
					url      : "/uniapp_template/web/index.php?m=app_login&a=save_image",
					data     : {image:img_url},
					type     : 'post',
					async    : true,
					dataType : 'json',
					success  :   function(res){
						if(res.errcode==0&&res.data.full_url){
							uniData = {
							    data: {
							        event: 'saveImage',
									callback: '',
									value: {
										img_url: res.data.full_url,
									}
							    }
							};
							uni.postMessage(uniData);
						}
					},
					error : function(ret){
						
					},
				})
			}else{
				//URL的图片
				uni.postMessage(uniData);
			}
			
			$("#uni-sheetAction").hide();
			$("#uni-sheetAction-back").hide();
			$("#uni-sheetAction").find(".uni-sheet-saveimg").data("img","")
		})
})();