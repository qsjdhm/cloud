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
	
	// 设置预览按钮
	this.setPreviewBtn = function(isNew){
		if(isNew == "false"){
			$("#pagePreview").show();
		}
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
			var saveWay = "add";      // 保存方式， add-新增  save-更新
			var saveFunctionId = "";  // 保存的functionID
			if(isNew == "false"){ saveWay = "save"; }
			if(functionId != -1){ saveFunctionId = functionId+""; }
			
			// 保存每个字段的类型信息
			saveDomType(saveWay);
			// 保存每个字段的配置信息
			saveDomParam(saveWay, saveFunctionId);
			// 如果字段中有tree类型，并且是关联字段，就要单独的调用保存字段+默认数据的方法
			saveTreeDefaultData();
			$("#pagePreview").show();
		});
		
		// 绑定应用按钮
		$("#pagePreview").bind("click", function(){
			// 进入后台管理页面
			window.open("/cloud/admin/index.html?functionId="+functionId+"&objectName="+objectName);
		});
	};
	
	// 获取页面的信息
	var getPageParam = function(){
		return {"id":pageParam.pageId || "" +"", "name":$("#page>#pageTitle>span").html()};
	};
	
	// 保存配置的源字段的类型，发送给后台
	var saveDomType = function(saveWay){
		var fieldList = [];
		$.each(aDomParamArray, function(key, val){
			// 因为这个功能是给table的编辑功能使用的，所以要排除table类型
			if(val.type != "table" && val.type != "label" && val.type != "button"){
				fieldList.push({
					"OBJECT_NAME":val.objectName,
					"OBJECT_FIELD":val.data.sourceField, 
					"FIELD_TYPE":val.type
				});
			}
		});
		
		// 创建发送请求数据的对象
		var requestData = new Object();
		// 声明数组
		requestData.rows = fieldList;
		//创建过滤条件对象
		var filter = new Object();
		
		requestData.filter = {"OBJECT_NAME":objectName};
		if(fieldList.length != 0){
			$.ajax({
				type : "post",
				url : "../DataAction",
				data : {
			    	"object" : "field_type",
			    	"method" : "delAndInsrt",
			    	"parameter" :$.toJSON(requestData)
			    },
			    dataType :"json",
			    success : function(data) {
			    	console.info("保存后的提示信息:");
			    	console.info(data);
			    	if(data.code=="1"){
			    		param.popupTip("保存字段类型成功！", "info");
			    	}else{
			    		param.popupTip("保存字段类型失败！", "error");
			    	}
			    }
			});
		}
	};
	
	
	// 保存每个字段的配置信息
	var saveDomParam = function(saveWay, saveFunctionId){
		var pageParam = {};
		// 1.获取页面的信息
		pageParam["id"] = getPageParam().id;
		pageParam["name"] = getPageParam().name;
		// 2.获取各个元素的信息
		pageParam["elemsParam"] = aDomParamArray;
		// 3.保存到后台
		console.info(pageParam);
		 
		// 保存页面信息--保存方法
		var rowItem = {
	        	"PAGE_PATH" : "",
	        	"PAGE_ATTRIBUTE" : $.toJSON(pageParam["elemsParam"]),
	        	"PAGE_NAME" : pageParam["name"],
	        	"FUNCTION_ID" : saveFunctionId, 
	        	"OBJECT_NAME" : objectName 
	    };
		
		if(saveWay != "add"){
			rowItem["PAGE_ID"] = pageParam["id"];
		}
		
		var obj = {
				"rows" : [rowItem],
				"filter" : { "FUNCTION_ID":saveFunctionId }
		};
		$.ajax({
			type : "post",
			url : "../DataAction",
			data : {
		    	"object" : "page_config",
		    	"method" : saveWay,
		    	"parameter" :$.toJSON(obj)
		    },
		    dataType :"json",
		    success : function(data) {
		    	console.info("保存后的提示信息:");
		    	console.info(data);
		    	if(data.code=="1"){
		    		param.popupTip("保存页面配置成功！", "info");
		    	}else{
		    		param.popupTip("保存页面配置失败！", "error");
		    	}
		    }
		});
	};
	
	
	// 如果字段中有tree类型，并且是关联字段，就要单独的调用保存字段+默认数据的方法
	var saveTreeDefaultData = function(){
		var treeList = [];
		// 找出来tree的配置中的默认数据
		$.each(aDomParamArray, function(ak, av){
			if(av.type == "tree"){
				$.each(av.data.defaultData, function(k, v){
					var item = new Object();
					item[av.data.sourceField] = v.name;
					treeList.push(item);
				});
			}
		});

		
		// 创建发送请求数据的对象
		var requestData = new Object();
		// 声明数组
		requestData.rows = treeList;
		//创建过滤条件对象
		var filter = new Object();
		requestData.filter = filter;
		
		if(treeList.length !== 0){
			$.ajax({
				type : "post",
				url : "../DataAction",
				data : {
			    	"object" : objectName,
			    	"method" : "delAndInsrt",
			    	"parameter" :$.toJSON(requestData)
			    },
			    dataType :"json",
			    success : function(data) {
			    	console.info(data);
			    	if(data.code=="1"){
			    		param.popupTip("新增数据成功！", "info");
			    	}else{
			    		param.popupTip("新增数据失败！", "error");
			    	}
			    }
			});
		}
		
	};
		
};











