
(function($,undefined){
	$.fn.zyButton = function(options,param){
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options == 'string') {
			var fn = this[0][options];
			if($.isFunction(fn)){
				return fn.apply(this, otherArgs);
			}else{
				throw ("zyButton - No such method: " + options);
			}
		}

		return this.each(function(){
			var para = {};    // 保留参数
			var self = this;  // 保存组件对象
			var submitField = [];
			var submitUse = "";
			
			var defaults = {
					param   : {},
					clickCB : function(submitField, submitUse){}
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
				submitField = para.param.data.submitField;
				submitUse = para.param.data.submitUse;
				
				$(self).css({
					"width" : para.param["position"]["width"]+"px",
					"height" : para.param["position"]["height"]+"px",
					"top" : para.param["position"]["top"]+"px",
					"left" : para.param["position"]["left"]+"px",
					"background-color" : para.param["style"]["background-color"],
					"border-color" : para.param["style"]["border-color"],
					"border-style" : para.param["style"]["border-style"],
					"border-width" : para.param["style"]["border-width"],
					"color" : para.param["style"]["color"],
					"font-family" : para.param["style"]["font-family"],
					"font-size" : para.param["style"]["font-size"],
					"letter-spacing" : para.param["style"]["letter-spacing"],
					"line-height" : para.param["style"]["line-height"],
					"margin" : para.param["style"]["margin"],
					"padding" : para.param["style"]["padding"],
					"text-align" : para.param["style"]["text-align"]
				});
			};
			
			
			/**
			 * 功能: 添加事件
			 * 参数: 无
			 * 返回: 无
			 */
			this.addEvent = function(){
				// 绑定hover事件
				$(self).hover(function(){ 
					$(self).css("border-color", para.param["style"]["border-color:hover"]);
					$(self).css("background-color", para.param["style"]["background-color:hover"]);
				},function(){ 
					$(self).css("border-color", para.param["style"]["border-color"]);
					$(self).css("background-color", para.param["style"]["background-color"]);
				});
				
				// 绑定active事件
				$(self).bind({ mousedown: function(e) {
					// 样式改变为点击时的样式
					$(self).css("background-color", para.param["style"]["background-color:active"]);
		        }, mouseup: function(e) {
		        	var val = para.param["style"]["background-color:hover"];
		        	// 样式改变为悬浮时的样式
		        	if(val != undefined){
						$(self).css("background-color", para.param["style"]["background-color:hover"]);
		        	}
		        }});
				
				$(self).bind("click", function(e){
					para.clickCB(submitField, submitUse);
				});
			};
			
			
			
			// 初始化按钮组件
			this.init(self);
		});
	};
})(jQuery);

