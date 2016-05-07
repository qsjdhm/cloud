/*
 * page.js 建模平台的页面配置功能
 * by zhangyan 2015-01-20
 */

var Page = function(){
	
	// 初始化
	this.init = function(){  
		var self = this;
		
		self.bindEvent();
	};
	
	// 初始化默认配置
	this.initDefaultConfig = function(){
		$("#pageTitle span").html(pageParam.pageName);
		$("#pageParam #pageTitle").val(pageParam.pageName);
	};  
	
	// 绑定事件
	this.bindEvent = function(){
		// 绑定页面配置的标题的事件
		$("#pageParam #pageTitle").bind("input propertychange", function(){
			// 设置标题的content
			$("#page>#pageTitle>span").html($(this).val());
	    });
		
		// 绑定保存按钮
		$("#pageSave").bind("click", function(){
			var pageParam = {};
			// 1.获取页面的信息
			pageParam["id"] = getPageParam().id;
			pageParam["name"] = getPageParam().name;
			// 2.获取各个元素的信息
			pageParam["elemsParam"] = aDomParamArray;
			// 3.保存到后台
			console.info(pageParam);
			 
			// 保存页面信息--保存方法
			var obj = {
					"rows" : [{
					        	"PAGE_PATH" : "",
					        	"PAGE_ATTRIBUTE" : $.toJSON(pageParam["elemsParam"]),
					        	"PAGE_NAME" : pageParam["name"],
					        	"FUNCTION_ID" : "124",
					        	"PAGE_ID" : ""
					        }],
					"filter" : { "PAGE_ID":"" }
			};
			$.ajax({
				type : "post",
				url : "../DataAction",
				data : {
			    	"object" : "page_config",
			    	"method" : "save",
			    	"parameter" :$.toJSON(obj)
			    },
			    dataType :"json",
			    success : function(data) {
			    	console.info("保存后的提示信息:");
			    	console.info(data);
			    }
			});
		});
		
		// 绑定应用按钮
		$("#pagePreview").bind("click", function(){
			var pageParam = {};
			// 1.获取页面的信息
			pageParam["id"] = getPageParam().id;
			pageParam["name"] = getPageParam().name;
			// 2.获取各个元素的信息
			pageParam["elemsParam"] = aDomParamArray;
			// 3.保存到后台
			console.info(pageParam);
			// 4.根据页面的key进行页面预览
			
		});
	};
	
	// 获取页面的信息
	var getPageParam = function(){
		return {"id":"page1", "name":$("#page>#pageTitle>span").html()};
	};
	
		
};











