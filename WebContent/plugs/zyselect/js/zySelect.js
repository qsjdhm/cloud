
(function($,undefined){
	$.fn.zySelect = function(options,param){
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options == 'string') {
			var fn = this[0][options];
			if($.isFunction(fn)){
				return fn.apply(this, otherArgs);
			}else{
				throw ("zySelect - No such method: " + options);
			}
		}

		return this.each(function(){
			var para = {};    // 保留参数
			var self = this;  // 保存组件对象
			
			var defaults = {
					width  : "100px",
					height : "60px",
					selected : "",
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
				var key = "";
				var name = "";
				if(para.data.length>0){
					key = para.data[0].id;
					name = para.data[0].name;
				}
				$.each(para.data, function(k,v){
					if(v.id == para.selected){
						key = v.id;
						name = v.name;
					}
				});
				
				var html = '';
				html += '<div class="select-picker">';
				if(para.data.length>0){
					html += '	<p class="select-data" key="'+key+'">'+name+'</p>';
				}else{
					html += '	<p class="select-data" key="empty">请选择字段</p>';
				}
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
					if(v.id == para.selected){  // 选中用户设置的那个
						html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li selected">';
						html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
						html += '</li>';
					}else{
						 if(para.selected==""){
							if(k==0){
								html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li selected">';
								html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
								html += '</li>';
							}else{
								html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li">';
								html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
								html += '</li>';
							}
						}else{
							html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li">';
							html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
							html += '</li>';
						}
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
				
				$(self).find(".option-li").live("click", function(e){
					// 移除之前的选中option
					$(self).find(".selected").removeClass("selected");
					$(this).addClass("selected");
					
					$(self).find(".select-data").attr("key",$(this).attr("key"));
					$(self).find(".select-data").html($(this).attr("text"));
					
					$(self).find(".option-ul").hide();
					
					// 触发数据变化事件
					$(self).trigger("dataChange");
				});
				
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
			 * 示例: $(".zy-select").zySelect("callbackData");
			 */
			this.callbackData = function(){
				var selectData = [];
				if($(self).find(".select-data").attr("key") != "empty"){
					selectData = [{"id":$(self).find(".select-data").attr("key"), "name":$(self).find(".select-data").html()}];
				}
				return selectData;
			};
			
			/**
			 * 功能: 清空数据
			 * 参数: 无
			 * 返回: 选中的数据
			 * 示例: $(".zy-select").zySelect("emptyData");
			 */
			this.emptyData = function(){
				$(self).find(".option-ul").empty();
			};
			
			/**
			 * 功能: 重置数据
			 * 参数: data 重新设置的数据  isCheck  是否全部选中
			 * 返回: 无
			 * 示例: $(".zy-select").zySelect("resetData", data);
			 */
			this.resetData = function(data, selected){
				$(self).find(".option-ul").hide();
				$(self).find(".option-ul").empty();
				
				// 设置select-data
				if(data.length>0){
					if(selected != null){
						$(self).find(".select-data").attr("key", selected.id);
						$(self).find(".select-data").html(selected.name);
					}else{
						$(self).find(".select-data").attr("key", data[0].id);
						$(self).find(".select-data").html(data[0].name);
					}
				}else{
					$(self).find(".select-data").attr("key", "empty");
					$(self).find(".select-data").html("请选择字段");
				}
				
				var html = '';
				$.each(data, function(k,v){
					if(v.id == selected){  // 选中用户设置的那个
						html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li selected">';
						html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
						html += '</li>';
					}else{
						 if(selected==""){
							if(k==0){
								html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li selected">';
								html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
								html += '</li>';
							}else{
								html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li">';
								html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
								html += '</li>';
							}
						}else{
							html += '<li key="'+v.id+'" text="'+v.name+'" class="option-li">';
							html += '	<p style="margin:0px!important;font-size: 16px;" class="option-p">'+v.name+'</p>';
							html += '</li>';
						}
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

