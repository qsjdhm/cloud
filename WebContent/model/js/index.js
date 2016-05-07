/*
 * index.js 建模平台的主要功能
 * by zhangyan 2014-09-22
*/

// 从父页面打开传递证明是编辑页面还是新增页面  
var isNew        = getQueryString("isNew") || "true"   ;  // 传递false代表编辑页面，传递true代表新增页面
var objectId     = getQueryString("objectId") || -1    ;  // 表对象id
var objectName   = getQueryString("objectName") || -1  ;  // 表对象name
var functionId   = getQueryString("functionId") || -1  ;  // 功能id
var functionName = getQueryString("functionName") || "";  // 功能名称

// 弹出框所需要到的变量
var toastCount = 0;
var $toastlast;

// 因为其他地方(drag.js)要用到，所以要设为全局的变量
var param = "";  
// 因为其他地方(drag.js)要用到，所以要设为全局的变量
var alignLine = "";  
// 因为其他地方(param.js)要用到，所以要设为全局的变量
var aDomParamArray = [];  // 存放每个元素的配置信息，当元素配置修改的时候会直接修改数组中的值
// 因为其他地方(page.js)要用到，所以要设为全局的变量
var pageParam = new Object();  // 存放页面的配置信息，用于在编辑的时候给页面赋默认值


// 供drag中每一类元素使用
var labelDrag = "";
var inputDrag = "";
var buttonDrag = "";
var selectDrag = "";
var treeDrag = "";
var tableDrag = "";
var tagsDrag = "";
var richDrag = "";



$(function(){
	initScrollbar();  // 初始化滚动条
	initPage();  // 初始化页面配置功能
	initParam();  // 初始化配置功能
	initAlignLine();  // 初始化元素的对齐线功能
	initDragElem();  // 初始化每个可拖动元素
	
	initPageDefaultData();  // 初始化元素缺省数据
});


// 初始化滚动条
function initScrollbar(){
	// 初始化滚动条
//	$.mCustomScrollbar.defaults.scrollButtons.enable=true;
//	$.mCustomScrollbar.defaults.axis="yx";
	$("#eleList").mCustomScrollbar({
		theme:"dark",
		scrollInertia:200,  // 滚动的惯性值
		scrollButtons:{
			scrollSpeed:25,  // 滚动滚动按钮时候的滚动速度
			scrollAmount:50  // 点击滚动按钮时候的滚动速度
		}
	});
	$(".param-content").mCustomScrollbar({
		theme:"dark",
		scrollInertia:200,
		scrollButtons:{
			scrollSpeed:25,
			scrollAmount:50
		}
	});
	$("#pageParam").mCustomScrollbar({
		theme:"dark",
		scrollInertia:200,
		scrollButtons:{
			scrollSpeed:25,
			scrollAmount:50
		}
	});
}

// 初始化页面配置功能
function initPage(){
	page = new Page();
	page.init();
	page.setPreviewBtn(isNew);  // 设置预览按钮是否显示
}

// 初始化配置功能
function initParam(){
	param = new Param();
	param.init();
}

// 初始化元素的对齐线功能
function initAlignLine(){
	alignLine = new AlignLine();
	alignLine.init();
}

// 初始化每个可拖拽元素
function initDragElem(){
	$(".ele").each(function(k, v){
		var div = $(this);
		var ele = new Object;
		ele.getElement = function(){ return div; };
		// 循环初始化Drag对象并且分别调用初始化方法
//		var drag = new Drag(ele);
//		drag.init();
		
		var eType = $(v).attr("etype");
		switch(eType){
			case "label":  // label
				labelDrag = new Drag(ele);
				labelDrag.init();
				break;
			case "input":  // input
				inputDrag = new Drag(ele);
				inputDrag.init();
				break;
			case "button":  // button
				buttonDrag = new Drag(ele);
				buttonDrag.init();
				break;
			case "select":  // select
				selectDrag = new Drag(ele);
				selectDrag.init();
				break;
			case "tree":  // tree
				treeDrag = new Drag(ele);
				treeDrag.init();
				break;
			case "table":  // table
				tableDrag = new Drag(ele);
				tableDrag.init();
				break;
			case "tags":  // tags
				tagsDrag = new Drag(ele);
				tagsDrag.init();
				break;
			case "rich":  // rich
				richDrag = new Drag(ele);
				richDrag.init();
				break;
			default:
				console.info("未知类型元素创建");
		}
	});
}

// 初始化页面缺省数据
function initPageDefaultData(){
	console.info(functionId);
	if(isNew != "true"){  // 证明是打开的已经配置好的页面
		// 查询页面的初始配置信息
		console.info("编辑页面");
		queryPageDefaultData();
	}else{
		console.info("新增页面");
	}
	
	// 设置标题
	document.title = "Cloud Model - " + functionName; 
	$("#page #pageTitle span").html(functionName);
	$("#pageParam #pageTitle").val(functionName);
}

// 查询页面的初始配置信息
function queryPageDefaultData(){
	var obj = {
			"fields" : "PAGE_ID,PAGE_NAME,PAGE_ATTRIBUTE,PAGE_PATH,FUNCTION_ID",
			"filter" : { "FUNCTION_ID" : ""+functionId }
	};
	$.ajax({
		type : "post",
		url : "../DataAction",
		data : {
			"object" : "page_config",
			"method" : "queryObj",
			"parameter" : $.toJSON(obj)
		},
		dataType : "json",
		asyn : false,
		success : function(data) {
			aDomParamArray = data.rows[0].PAGE_ATTRIBUTE;
			// 给页面赋默认值
			pageParam = {
				"pageId" : data.rows[0].PAGE_ID,
				"pageName" : data.rows[0].PAGE_NAME,
				"pagePath" : data.rows[0].PAGE_PATH,
				"pageFunction" : data.rows[0].FUNCTION_ID
			};
			// 初始化默认配置
			page.initDefaultConfig();  
			// 初始化元素配置
			initDomDefaultConfig(data.rows[0].PAGE_ATTRIBUTE); 
		}
	});
}

// 初始化元素配置
function initDomDefaultConfig(domParam){
	$.each(domParam, function(k, v){
		switch(v.type){
			case "label":  // label
				labelDrag.initDefaultConfig(v);
				break;
			case "input":  // input
				inputDrag.initDefaultConfig(v);
				break;
			case "button":  // button
				buttonDrag.initDefaultConfig(v);
				break;
			case "select":  // select
				selectDrag.initDefaultConfig(v);
				break;
			case "tree":  // tree
				// tree配置中的默认数据因为要从页面id和字段列表中获取实时的默认值
				// 所以这里需要修改v.data.defaultData的值
				setSpecialDefaultData(v,{callback:function(cbdata){
					treeDrag.initDefaultConfig(cbdata);
				}});
				break;
			case "table":  // table
				tableDrag.initDefaultConfig(v);
				break;
			case "tags":  // tags
				tagsDrag.initDefaultConfig(v);
				break;
			case "rich":  // rich
				richDrag.initDefaultConfig(v);
				break;
			default:
				console.info("未知类型元素创建");
		}
	});
}


// 修改特殊的默认值
function setSpecialDefaultData(plug, fun){
	if(plug.type == "tree"){
		var obj = {
				"fields" : plug.data.sourceField,
				"filter" : {}
		};
		$.ajax({
			type : "post",
			url : "../DataAction",
			data : {
				"object" : plug.objectName,
				"method" : "queryObj",
				"parameter" : $.toJSON(obj)
			},
			dataType : "json",
			asyn : false,
			success : function(data) {
				defaultData = data.rows;
				$.each(defaultData, function(k, v){
					v["id"] = v.name;
				});
				plug.data.defaultData = defaultData;
				
				var callback = fun?fun.callback:null;  // 获取参数对象中的回调方法
			    if($.isFunction(fun.callback)){  // 如果有回调方法
			        callback(plug);  // 返回一个计算后的数据，方便回调方法使用它
			    }
			}
		});
	}
}




// 获取地址栏参数
function getQueryString(name){ 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = location.search.substr(1).match(reg); 
	if (r != null) return unescape(decodeURI(r[2])); return null; 
} 








