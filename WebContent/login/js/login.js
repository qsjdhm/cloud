
// 先在全局声明出来，这样外部就可以调用menu的方法
var login = new Object();

$(function(){
	login = new Login();
	login.init();
});

function checkUser(){
	var userName = $("#userName").val();
	var password = $("#password").val();

	if(userName == ""){
		login.popupTip("用户名不能为空 !", "error");
		$("#userName").focus();
		return false;
	}else if(password == ""){
		login.popupTip("密码不能为空 !", "error");
		$("#password").focus();
		return false;
	}else{
		return true;
	}
	return false;
}


/**
 * 这个采用了私有函数的公有化模式来实现
 * 这种模式有利于把私有函数和外部接口分离，并且可以提供外部重写内部的函数
 * 只需要在页面加载完成后在控制台运行以下代码就可以看到init方法被重写了，不再请求后台组织数据了
 * 只是单纯的打印了"外部init"
 * login = new Login();
 * login = function(){ console.info("外部init"); }
 * login();
 */
var Login = function(){
	// 弹出框所需要到的变量
	var toastCount = 0;
	var $toastlast;
	
	
	// 绑定事件
	var _bindEvent = function(){
		// 绑定自动登录按钮
		$("#autoLogin").bind("click", function(){
			
		});
		
		// 绑定注册按钮
		$("#register").bind("click", function(){
			_register();
		});
		
		// 绑定忘记密码按钮
		$("#find").bind("click", function(){
			_find();
		});
		
		// 绑定登录按钮
		$("#login").bind("click", function(){
			_login();
		});
	};
	
	// 注册
	var _register = function(){
		console.info(1);
	};
	
	// 找回密码
	var _find = function(){
		console.info(1);
	};
	
	// 登录
	var _login = function(){
		var userName = $("#userName").val();
		var password = $("#password").val();
		
		if(userName == ""){
			_popupTip("用户名不能为空 !", "error");
			$("#userName").focus();
			return false;
		}else if(password == ""){
			_popupTip("密码不能为空 !", "error");
			$("#password").focus();
			return false;
		}else{
			return true;
		}
		return false;
	};
	
	// 弹出提示框
	// msg 提示的信息
	// shortCutFunction 状态  info、error
	var _popupTip = function(msg, shortCutFunction){
		var title = "";
		var toastIndex = toastCount++;
		toastr.options = {
				  "closeButton": true,
				  "debug": false,
				  "positionClass": "toast-top-right",
				  "onclick": null,
				  "showDuration": "300",
				  "hideDuration": "1000",
				  "timeOut": "3000",
				  "extendedTimeOut": "1000",
				  "showEasing": "swing",
				  "hideEasing": "linear",
				  "showMethod": "fadeIn",
				  "hideMethod": "fadeOut"
				}
		
		$("#toastrOptions").text("Command: toastr["
		            + shortCutFunction
		            + "](\""
		            + msg
		            + (title ? "\", \"" + title : '')
		            + "\")\n\ntoastr.options = "
		            + JSON.stringify(toastr.options, null, 2)
		);
		
		var $toast = toastr[shortCutFunction](msg, title);
		$toastlast = $toast;
		if ($toast.find('#okBtn').length) {
			$toast.delegate('#okBtn', 'click', function () {
			    $toast.remove();
			});
		}
	};
	
	return {
		init: function(){
			// 绑定事件
			_bindEvent();
		},
		// 暴露给外部的接口
		popupTip: function(msg, shortCutFunction){
			_popupTip(msg, shortCutFunction);
		},
	};
};



















