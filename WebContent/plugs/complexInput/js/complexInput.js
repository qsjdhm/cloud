
(function($,undefined){
	$.fn.complexInput = function(options,param){
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options == 'string') {
			var fn = this[0][options];
			if($.isFunction(fn)){
				return fn.apply(this, otherArgs);
			}else{
				throw ("complexInput - No such method: " + options);
			}
		}

		return this.each(function(){
			var para = {};    // 保留参数
			var self = this;  // 保存组件对象
			var pIndex = 0;   // 保留input的最大索引
			
			var defaults = {
					width  : "100px",
					height : "60px",
					data   : [],
					addData: {"id":"", "name":""},
					addCB  : function(){
						
					},
					delCB  : function(){
						
					}
			};
			
			para = $.extend(defaults,options);
			
			this.init = function(){
				this.createHtml();  // 创建组件html
				this.addEvent();  // 添加事件
				this.addDefaultData();  // 添加默认数据
			};
			
			/**
			 * 功能: 创建html
			 * 参数: 无
			 * 返回: 无
			 */
			this.createHtml = function(){
				var html = '';
				html += '<div class="input-option">';
				html += '	<input type="text" key="cInput0" value="" />';
				html += '	<span>描述 : </span>'; 
				html += '	<input type="text" desc="cInput0" value="" />';
				html += '	<i class="add fa fa-plus fa-lg"></i>';
				html += '	<i class="del fa fa-remove fa-lg"></i>';
				html += '</div>';
				pIndex = 1;
				
				$(self).empty().append(html);
			};
			
			
			/**
			 * 功能: 添加事件
			 * 参数: 无
			 * 返回: 无
			 */
			this.addEvent = function(){
				$(self).find(".add").die("click").live("click", function(e){
					
					self.addOption(e, this, para.addData, true);
				});
				
				$(self).find(".del").die("click").live("click", function(e){
					self.delOption(e, this, true);
				});
				
				// 绑定数据更改事件
				$(self).find(".input-option input").live("input propertychange", function(){
			    	// 触发数据变化事件
					$(self).trigger("dataChange");
			    });
				
				// 触发数据变化事件
				//$(self).trigger("dataChange");
			};
			
			/**
			 * 功能: 添加默认数据
			 * 参数: 无
			 * 返回: 无
			 */
			this.addDefaultData = function(){
				var firstInput = "";
				if(para.data.length > 0){
					firstInput = $(self).find(".input-option").eq(0).find("input");
				}
				$.each(para.data, function(k, v){
					if(k==0){
						firstInput.eq(0).val(v.id);
						firstInput.eq(1).val(v.name);
					}else{
						self.addOption(null, null, v, false);
					}
				});
			};
			
			/**
			 * 功能: 添加一条
			 * 参数: e 点击的事件源
			 * 返回: 无
			 */
			this.addOption = function(e, eThis, defaultData, isCb){
				var html = '';
				html += '<div class="input-option">';
				html += '	<input type="text" key="cInput'+pIndex+'" value="'+defaultData.id+'" />';
				html += '	<span>描述 : </span>'; 
				html += '	<input type="text" desc="cInput'+pIndex+'" value="'+defaultData.name+'" />';
				html += '	<i class="add fa fa-plus fa-lg"></i>'; 
				html += '	<i class="del fa fa-remove fa-lg"></i>'; 
				html += '</div>';
				pIndex ++;
				
				$(self).append(html); 
				
				// 触发数据变化事件
				$(self).trigger("dataChange");
				
				if(isCb){
					para.addCB(pIndex-1);
				}
			};
			
			/**
			 * 功能: 删除一条
			 * 参数: e 点击的事件源
			 * 返回: 无
			 */
			this.delOption = function(e, eThis, isCb){
				var delIndex = $(eThis).parent().find("input").eq(0).attr("key").replace(/[^0-9]/ig,"");
				// 判断是不是只剩下最后一条   
				if($(self).find(".input-option").length == 1){
					$(eThis).prevAll("input").val("");
					$(eThis).prevAll("input").focus();
				}else{
					$(eThis).parent(".input-option").remove();
				}
				
				// 触发数据变化事件
				$(self).trigger("dataChange");
				
				if(isCb){
					para.delCB(delIndex);
				}
			};
			
			/**
			 * 功能: 返回选中的数据
			 * 参数: 无
			 * 返回: 选中的数据
			 * 示例: $(".multi-input").complexInput("callbackData");
			 */
			this.callbackData = function(){
				var selectData = [];
				var options = $(self).find(".input-option");
				
				$.each(options, function(k,v){
					var id = $(v).find("input").eq(0).val();
					var name = $(v).find("input").eq(1).val();
					selectData.push({"id":id, "name":name});
				});
				return selectData;
			};
			
			
			// 初始化上传控制层插件
			this.init(self);
		});
	};
})(jQuery);

