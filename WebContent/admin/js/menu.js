/*
 * menu.js 后台管理平台的功能菜单展示功能
 * by zhangyan 2015-09-08
 */

/**
 * 这个menu.js采用了私有函数的公有化模式来实现
 * 这种模式有利于把私有函数和外部接口分离，并且可以提供外部重写内部的函数
 * 只需要在页面加载完成后在控制台运行以下代码就可以看到init方法被重写了，不再请求后台组织menu数据了
 * 只是单纯的打印了"外部init"
 * var menu = new Menu();
 * menu.init = function(){ console.info("外部init"); }
 * menu.init();
 */

var Menu = function(){
	
	// 根据id获取菜单配置
	var _getMenuForId = function(){
		// 从后台取出菜单的内容
		var obj = {
				"fields" : "FUNCTION_ID,FUNCTION_NAME,FUNCTION_SORT,PARENT_ID,PROJECT_ID,OBJECT_ID,OBJECT_NAME",
				"filter" : { "PROJECT_ID" : "52" } 
		};
		$.ajax({
			type : "post",
			url : "../DataAction",
			data : {
				"object" : "function_info",
				"method" : "queryObj",
				"parameter" : $.toJSON(obj)
			},
			dataType : "json",
			asyn : false,
			success : function(data) {
				// 创建菜单
				_createMenu(data.rows);
			}
		});
	};
	
	// 创建菜单
	var _createMenu = function(data){
		var parentMenu = [];
		var subMenu    = [];
		
		// 1.把父级菜单和子级菜单分离出来
		$.each(data, function(k, v){
			if(v.PARENT_ID == 0 || v.PARENT_ID == ""){
				parentMenu.push(v);
			}else{
				subMenu.push(v);
			}
		});
		
		// 2.创建父级菜单html
		$.each(parentMenu, function(k, v){
			var pLiHtml = "";
			pLiHtml += '<li id="pLi'+v.FUNCTION_ID+'" class="parent-li">';
			pLiHtml += '	<a href="javascript:;">';
			pLiHtml += '		<i class="icon-file-text"></i> ';
			pLiHtml += '		<span class="title">'+v.FUNCTION_NAME+'</span>';
			pLiHtml += '		<span class="arrow"></span>';
			pLiHtml += '	</a>';
			pLiHtml += '	<ul class="sub-menu">';
			
			pLiHtml += '	</ul>';
			pLiHtml += '</li>';
			$(".page-sidebar-menu").append(pLiHtml);
		});
		
		// 3.创建子级菜单html
		$.each(subMenu, function(k, v){
			var atv = "";
			if(v.FUNCTION_ID == functionId){ 
				atv = "active";
				
				// 设置父菜单选中样式
				$(".page-sidebar-menu #pLi"+v.PARENT_ID).addClass("active open");
				$(".page-sidebar-menu #pLi"+v.PARENT_ID+" .arrow").addClass("open");
				
				// 根据当前菜单初始化页面信息
				$(".page-title").html("当前对 "+v.FUNCTION_NAME+" 菜单进行操作");
				$("#menuTip").attr("href", "/cloud/admin/index.html?functionId="+v.FUNCTION_ID+"&objectName="+v.OBJECT_NAME+"").html(v.FUNCTION_NAME);
			}
			
			var sLiHtml = "";
			sLiHtml += '<li class="'+atv+'">';
			sLiHtml += '	<a href="/cloud/admin/index.html?functionId='+v.FUNCTION_ID+'&objectName='+v.OBJECT_NAME+'">'+v.FUNCTION_NAME+'</a>';
			sLiHtml += '</li>';
			$(".page-sidebar-menu #pLi"+v.PARENT_ID+" ul").append(sLiHtml);
		});
		
		// 4.绑定事件
		_bindEvent();
	};
	
	
	// 绑定事件
	var _bindEvent = function(){
		
	};
	
	// 返回外部可以调用的接口
	return {
		init : function(){
			console.info("内部init");
			_getMenuForId();
		},
		initMenuForId : function(){
			console.info("内部initMenuForId");
		}
	};
};











