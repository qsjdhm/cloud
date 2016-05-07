/*
 * index.js 后台管理平台的主要功能
 * by zhangyan 2015-07-01
*/

var objectId   = getQueryString("objectId")   || -1;      // 表对象id
var objectName = getQueryString("objectName") || -1;      // 表对象name
var functionId = getQueryString("functionId") || -1;  // 功能id

// 弹出框所需要到的变量
var toastCount = 0;
var $toastlast;

$(function(){
	// 1. 初始化菜单
	initMenu();
	// 2. 初始化具体页面
	initPage();
});

// 初始化菜单
function initMenu(){
	var menu = new Menu();
	menu.init();
}

// 初始化页面
function initPage(){
	var page = new Page();
	page.init();
}



//获取地址栏参数
function getQueryString(name){ 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = location.search.substr(1).match(reg); 
	if (r != null) return unescape(decodeURI(r[2])); return null; 
} 







