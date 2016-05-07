

$(function(){
	var project = new Project();
	project.init();
});




/**
 * 这个采用了私有函数的公有化模式来实现
 * 这种模式有利于把私有函数和外部接口分离，并且可以提供外部重写内部的函数
 * 只需要在页面加载完成后在控制台运行以下代码就可以看到init方法被重写了，不再请求后台组织数据了
 * 只是单纯的打印了"外部init"
 * var project = new Project();
 * project.init = function(){ console.info("外部init"); }
 * project.init();
 */
var Project = function(){};
Project.prototype = function(){
	
	// 初始化导航
	var _initNav = function(){
		
		$(".user-header").addClass("user-header-show");
		$(".user-caption").addClass("opacity-show");
		
		setTimeout(function(){
			$(".m-project").addClass("m-slide-top-in");
		},150);
		
		setTimeout(function(){
			$(".m-function").addClass("m-slide-top-in");
		},300);
		
		setTimeout(function(){
			$(".m-model").addClass("m-slide-top-in");
		},450);
		
		setTimeout(function(){
			$(".m-image").addClass("m-slide-top-in");
		},600);
		
		setTimeout(function(){
			$(".m-nav-item-active").addClass("opacity-show"); 
		},750);
	};
	
	// 初始化工具条
	var _initBar = function(){
		$(".m-logo, .m-config").addClass("opacity-show");
	};
	
	// 初始化项目
	var _initProject = function(){
		$(".m-page-title").addClass("opacity-show");
	};
	
	// 初始化弹出框的input
	var _initModelInput = function(){
		if (!String.prototype.trim) {
			(function() {
				// Make sure we trim BOM and NBSP
				var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
				String.prototype.trim = function() {
					return this.replace(rtrim, '');
				};
			})();
		}

		[].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
			// in case the input is already filled..
			if( inputEl.value.trim() !== '' ) {
				classie.add( inputEl.parentNode, 'input--filled' );
			}

			// events:
			inputEl.addEventListener( 'focus', onInputFocus );
			inputEl.addEventListener( 'blur', onInputBlur );
		} );

		function onInputFocus( ev ) {
			classie.add( ev.target.parentNode, 'input--filled' );
		}

		function onInputBlur( ev ) {
			if( ev.target.value.trim() === '' ) {
				classie.remove( ev.target.parentNode, 'input--filled' );
			}
		}
	};
	
	// 初始化菜单列表
	var _initMenuList = function(){
		var filter = new Object();
		// 过滤条件
		filter.PROJECT_ID = "52";
		var requestData = new Object();
		requestData.filter = filter;
		// 要查询的字段
		requestData.fields = "FUNCTION_ID,FUNCTION_NAME,FUNCTION_RECORD,FUNCTION_SORT,PARENT_ID,REMARK,PROJECT_ID,OBJECT_ID,OBJECT_NAME";
		
		$.ajax({
			type : "post",
		    url: "../DataAction",
		    data: {
		    	"object": "function_info",
		    	"method" : "queryObj",
				"parameter" : $.toJSON(requestData)
		    },
		    dataType:"json",
		    success: function(data) {
		    	var menuArray = [];
		    	if(data.rows.length>0){
		    		// 先把每个菜单的父级找出来
		    		$.each(data.rows, function(k, v){
		    			if(v.PARENT_ID == 0){
		    				var parentObj = new Object();
		    				parentObj["parent"] = v;
		    				parentObj["sub"] = [];
		    				menuArray.push(parentObj);
		    			}
		    		});
		    		
		    		// 再把每个子菜单放到父级菜单下面
		    		$.each(data.rows, function(k, v){
		    			if(v.PARENT_ID != 0){
		    				$.each(menuArray, function(key, val){
		    					if(val.parent.FUNCTION_ID == v.PARENT_ID){
		    						val.sub.push(v);
		    						return false;
		    					}
		    				});
		    			}
		    		});
				}
		    	
		    	var html = '<select data-am-selected>';
		    	$.each(menuArray, function(k, v){
					html += '	<optgroup label="'+v.parent.FUNCTION_NAME+'">';
					$.each(v.sub, function(key, val){
						html += '	<option value="'+val.FUNCTION_ID+'" functionId="'+val.FUNCTION_ID+'" functionName="'+val.FUNCTION_NAME+'" objectId="'+val.OBJECT_ID+'" objectName="'+val.OBJECT_NAME+'" >'+val.FUNCTION_NAME+'</option>';
					});
					html += '	</optgroup>';
				});
		    	html += '</select>';
		    	
		    	$("#pageModelPop #menuTable").append(html);
				// 初始化amazeui下拉框
				$("#pageModelPop #menuTable select").selected();
		    }
		});
	};
	
	// 打开菜单弹出框
	var _openMenuListModel = function(){
		var $popModal = $("#pageModelPop");
		$popModal.modal({
			relatedTarget: this,
		    onConfirm: function(e) {
		    	// 跳转页面
		    	var $menuSelect = $("#pageModelPop #menuTable option:selected");
		    	var functionId = $menuSelect.attr("functionId");
		    	var functionName = $menuSelect.attr("functionName");
		    	var objectId   = $menuSelect.attr("objectId");
		    	var objectName = $menuSelect.attr("objectName");
		    	window.open("/cloud/model/index.html?isNew=false&functionId="+functionId+"&functionName="+functionName+"&objectId="+objectId+"&objectName="+objectName);
		    },
		    onCancel: function(e) { 
		    	var $menuSelect = $("#pageModelPop #menuTable option:selected");
		    	var functionId = $menuSelect.attr("functionId");
		    	var functionName = $menuSelect.attr("functionName");
		    	var objectId   = $menuSelect.attr("objectId");
		    	var objectName = $menuSelect.attr("objectName");
		    	window.open("/cloud/model/index.html?isNew=true&functionId="+functionId+"&functionName="+functionName+"&objectId="+objectId+"&objectName="+objectName);
		    }
		});
	};
	
	var _bindEvent = function(){
		/******************菜单事件*******************/
		// 菜单移动效果
		$(".m-nav-item").hover(function(){
			var id = $(this).attr("id");
			if(id == "mProject"){
				$(".m-nav-item-active").css("top", "0px");
			}else if(id == "mFunction"){
				$(".m-nav-item-active").css("top", "105px");
			}else if(id == "mModel"){
				$(".m-nav-item-active").css("top", "210px");
			}else if(id == "mImage"){
				$(".m-nav-item-active").css("top", "315px");
			}
		},function(){
			$(".m-nav-item-active").css("top", "0px");
		});
		
		// 菜单点击事件
		$(".m-nav-item").bind("click", function(){
			var id = $(this).attr("id");
			
			if(id == "mProject"){
				location.href = "/cloud/menu/project.html";
			}else if(id == "mFunction"){
				location.href = "/cloud/menu/menu.html";
			}else if(id == "mModel"){
				// 打开菜单弹出框
				_openMenuListModel();
			}else if(id == "mImage"){
				location.href = "/cloud/menu/warehouse.html";
			}

	});
		
		/******************项目事件*******************/
		// 创建新项目的事件
		$("#newProject").bind("click", function(){
			// 弹出弹出框，输入完成内容后在projectList后添加新的项目模块
			var $popModal = $("#newProjectPop");
			$popModal.modal({
				relatedTarget: this,
			    onConfirm: function(e) {
			    	// 模拟从后台取出数据添加到页面的过程	
					var html = '';
					html += '<div data-am-scrollspy="{animation: \'slide-bottom\', delay: 100, repeat: false}" class="m-project-item am-scrollspy-init am-scrollspy-inview am-animation-slide-bottom">';
					html += '	<div class="m-project-item-img">';
					html += '		<img class="am-thumbnail" alt="项目" src="images/scenery-6.png">';
					html += '		<span class="m-project-tip">打开此项目</span>';
					html += '	</div>';
					html += '	<div class="m-project-item-desc">';
					html += '		<span class="am-icon-lock"></span>';
					html += '		'+$("#projectName").val()+'/sd';
					html += '	</div>';
					html += '</div>';
					$("#projectList").append(html);
			    },
			    onCancel: function(e) {
			        console.info("取消创建新项目");
			    }
			});
		});
		
		// 打开项目点击事件
		$("body").on("click", ".m-project-item", function(){
			if($(this).attr("id") != "newProject"){
				location.href = "/cloud/menu/menu.html";
			}
		});
	};
	
	return {
		init: function(){
			// 初始化导航
			_initNav();
			// 初始化工具条
			_initBar();
			// 初始化项目
			_initProject();
			// 初始化弹出框菜单列表
			_initMenuList();
			// 初始化弹出框的input
			_initModelInput();
			// 绑定事件
			_bindEvent();
		},
		// 暴露给外部的接口
		initNav: function(){
			//_initNav();
		}
	};
}();



















