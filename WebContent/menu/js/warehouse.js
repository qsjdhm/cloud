

$(function(){
	var house = new House();
	house.init();
});




/**
 * 这个采用了私有函数的公有化模式来实现
 * 这种模式有利于把私有函数和外部接口分离，并且可以提供外部重写内部的函数
 * 只需要在页面加载完成后在控制台运行以下代码就可以看到init方法被重写了，不再请求后台组织数据了
 * 只是单纯的打印了"外部init"
 * var house = new House();
 * house.init = function(){ console.info("外部init"); }
 * house.init();
 */
var House = function(){
	
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
			$(".m-nav-item-active").css("top", "315px");
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
			// 绑定事件
			_bindEvent();
		},
		// 暴露给外部的接口
		initNav: function(){
			//_initNav();
		}
	};
};



















