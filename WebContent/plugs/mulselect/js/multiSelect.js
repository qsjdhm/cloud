
(function($,undefined){
	$.fn.multiSelect = function(options,param){
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options == 'string') {
			var fn = this[0][options];
			if($.isFunction(fn)){
				return fn.apply(this, otherArgs);
			}else{
				throw ("multiSelect - No such method: " + options);
			}
		}

		return this.each(function(){
			var para = {};    // 保留参数
			var self = this;  // 保存组件对象
			
			var defaults = {
					width  : "100px",
					height : "60px",
					selected : [],
					edit   : "true",
					check  : "false",
					data   : []  
			};
			
			para = $.extend(defaults,options);
			
			this.init = function(){
				this.createHtml();  // 创建组件html
				this.addEvent();  // 添加事件
			};
			
			/**
			 * 功能: 创建html
			 * 参数: 无
			 * 返回: 无
			 */
			this.createHtml = function(){
				var html = '';
				html += '<div class="select-picker">';
				html += '	<p class="select-data">请选择字段</p>';
				html += '	<p class="down-img"></p>';
				html += '</div>';
				html += '<ul class="option-ul">';
				html += '</ul>';
				
				$(self).empty().append(html);
				
				self.organOption();
			};
			
			/**
			 * 功能: 组织所选项
			 * 参数: 无
			 * 返回: 无
			 */
			this.organOption = function(){
				
				var html = '';
				$.each(para.data, function(k,v){
					var flag = 0;
					if(para.selected!=null){
						if(para.selected.length>0){
							if($.inArray(v.id, para.selected)>-1){  // 存在，要选中
								flag = 1;
							}
						}
					}
					if(para.check == "true" || flag==1){
						html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li" select="true">';
						html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
						html += '	<i class="fa fa-check" style="display: inline;"></i>';
						html += '</li>';
						
						if($(self).find(".select-data").html() == "请选择字段"){
							$(self).find(".select-data").html(v.name);
						}else{
							$(self).find(".select-data").html($(self).find(".select-data").html()+",&nbsp;"+v.name);
						}
					}else{
						html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li">';
						html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
						html += '	<i class="fa fa-check"></i>';
						html += '</li>';
					}
				});
				
				$(self).find("ul").append(html);
			};
			
			/**
			 * 功能: 添加事件
			 * 参数: 无
			 * 返回: 无
			 */
			this.addEvent = function(){
				// 给picker添加事件
				$(self).find(".select-picker").bind({ mouseenter: function(e) {
					$(self).find(".down-img").addClass("down-hover");
		        }, mouseleave: function(e) {
		        	$(self).find(".down-img").removeClass("down-hover");
		        } });
				
				$(self).find(".select-picker").bind("click", function(e){
					if($(self).find(".option-ul").is(":hidden")){
						$(self).find(".option-ul").show();
					}else{
						$(self).find(".option-ul").hide();
					}
				});
				
				// 给option添加事件
				
				$(self).find(".option-p").bind({ mouseenter: function(e) {
					$(this).css("color","#fff");
		        }, mouseleave: function(e) {
		        	$(this).css("color","#666");
		        } });
				
				// 可以选中或不选中
				if(para.edit == "true"){
					$(self).find(".option-li").live("click", function(e){
						if($(this).attr("select") == "true"){  // 当前是选中状态
							$(this).attr("select", "false");
							$(this).find("i").hide();
						}else{
							$(this).attr("select", "true");
							$(this).find("i").show();
						}
						
						if($(this).attr("select") == "true"){  // 当前是选中状态
							// 设置选中的数据
							var text = $(this).attr("text");
							if($(self).find(".select-data").html() == "请选择字段"){
								$(self).find(".select-data").html(text);
							}else{
								$(self).find(".select-data").html($(self).find(".select-data").html()+",&nbsp;"+text);
							}
						}else{
							// 移除之前选择的数据
							var text = $(this).attr("text");
							var selectArr = $(self).find(".select-data").html().split(",");
							if(jQuery.inArray(text, selectArr)==0){  // 如果取消的是text中的第一个
								if(selectArr.length == 1){
									$(self).find(".select-data").html("请选择字段");
								}else{
									// 替换第一个字符串
									var str = $(self).find(".select-data").html().replace(text+",&nbsp;", "");
									$(self).find(".select-data").html(str);
								}
							}else{
								if(selectArr.length == 1){
									$(self).find(".select-data").html("请选择字段");
								}else{
									// 替换字符串
									var str = $(self).find(".select-data").html().replace(",&nbsp;"+text, "");
									$(self).find(".select-data").html(str);
								}
							}
						}
						
						// 触发数据变化事件
						$(self).trigger("dataChange");
					});
				}
				
				// 点击其他地方隐藏select
				$(document).bind("click",function(e){ 
					var target = $(e.target); 
					if(
							target.closest(".select-picker").length == 0 &&
							target.closest(".select-data").length == 0 &&
							target.closest(".down-img").length == 0 &&
							target.closest(".option-ul").length == 0 &&
							target.closest(".option-li").length == 0 &&
							target.closest(".option-p").length == 0 &&
							target.closest(".fa").length == 0
					){ 
						$(self).find(".option-ul").hide();
					} 
				}); 
			};
			
			/**
			 * 功能: 返回选中的数据
			 * 参数: 无
			 * 返回: 选中的数据
			 * 示例: $(".multi-select").multiSelect("callbackData");
			 */
			this.callbackData = function(){
				var selectData = [];
				var lis = $(self).find(".option-li[select='true']");
				$.each(lis, function(k,v){
					selectData.push({"id":$(v).attr("key"), "name":$(v).attr("text")});
				});
				return selectData;
			};
			
			/**
			 * 功能: 清空数据
			 * 参数: 无
			 * 返回: 选中的数据
			 * 示例: $(".multi-select").multiSelect("emptyData");
			 */
			this.emptyData = function(){
				$(self).find(".option-ul").empty();
			};
			
			/**
			 * 功能: 重置数据
			 * 参数: data 重新设置的数据  isCheck  是否全部选中
			 * 返回: 无
			 * 示例: $(".multi-select").multiSelect("resetData", data);
			 */
			this.resetData = function(data, isCheck, selected){
				$(self).find(".option-ul").hide();
				$(self).find(".option-ul").empty();
				if(isCheck == "true"){
					$(self).find(".select-data").html("");
				}
				
				var html = '';
				$.each(data, function(k,v){
					var flag = 0;
					if(selected!=null){
						if(selected.length>0){
							if($.inArray(v.id, selected)>-1){  // 存在，要选中
								flag = 1;
							}
						}
					}
					if(isCheck == "true" || flag == 1){
						html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li" select="true">';
						html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
						html += '	<i class="fa fa-check" style="display: inline;"></i>';
						html += '</li>';
						
						if($(self).find(".select-data").html() == "请选择字段"){
							$(self).find(".select-data").html(v.name);
						}else{
							if($(self).find(".select-data").html() == ""){
								$(self).find(".select-data").html(v.name);
							}else{
								$(self).find(".select-data").html($(self).find(".select-data").html()+",&nbsp;"+v.name);
							}
						}
					}else{
						html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li">';
						html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
						html += '	<i class="fa fa-check"></i>';
						html += '</li>';
					}
				});
				
				$(self).find("ul").append(html);
				
				// 触发数据变化事件
				$(self).trigger("dataChange");
			};
			
			// 初始化上传控制层插件
			this.init(self);
		});
	};
})(jQuery);

