/*
 * param.js 建模平台的元素配置功能
 * by zhangyan 2015-01-03
 */

var Param = function(){
	var form = "";
	var self = this;
	
	// 初始化
	this.init = function(){  
		// 绑定事件
		self.bindEvent();
	};
	
	// 绑定事件
	this.bindEvent = function(){  
		// tab页的点击绑定
		$(".param-tip").bind("click", function(){
			// tab的点击事件
			$(".param-active").removeClass("param-active");
			$(this).addClass("param-active");
			
			// content切换
			$(".content-active").removeClass("content-active");
			$("."+$(this).attr("mc")).addClass("content-active");
		});
	};
	
	
	// 显示当前元素的配置项
	// deptDom 为这个form所属于哪个元素
	this.showParamItem = function(deptDom){
		$("#eleParam form").hide();
		// 添加刚拖过来的元素的配置参数
		$("#eleParam [deptdom='"+deptDom+"']").show();
	};
	
	
	/**
	 * 供外部调用 - 当页面新增一个元素时，会调用此方法
	 * 根据新增元素等信息初始化此元素的配置信息
	 * elem 新增元素
	 * type 元素类型
	 * typeIndex 此类型范围索引
	 * from 来自于已经配置的页面还是全新的页面
	 */
	this.initDomParam = function(elem, type, typeIndex, from){
		// 1.初始化默认数据，并且把新元素的配置参数存放到aDomParamArray中
		self.initDefaultParam(elem, type, from);
		// 2.根据类型初始化配置信息的Html代码
		self.initParamHtml(elem, type, typeIndex);
		// 3.给form中的每个配置项绑定事件
		self.bindParamItemEvent(elem);
	};
	
	// 1.初始化默认数据，并且把新元素的配置参数存放到aDomParamArray中
	this.initDefaultParam = function(elem, type, from){
		if(from.from==null){
    		// edit是代表来自于已经配置的页面；没有这个key代表这是一个全新的页面，可以赋默认值
			// 初始化元素默认值
			switch(type){
				case "label":  // label
					var param = {
						"objectName" : objectName,
						"id" : "domindex"+elem.attr("domindex"),
						"type" : type,
						"data" : {
							"content" : "标签"
						},
						"position" : {
							"top" : elem.position().top+25,
							"left" : elem.position().left,
							"width" : elem.width(),
							"height" : elem.height()-25
						},
						"style" : {
							"font-size" : "16PX",
							"color" : "#333333",
							"letter-spacing" : "1px",
							"font-family" : "微软雅黑",
							"text-align" : "left",
							"line-height" : "35px",
							"padding" : "0px 5px 0px 5px",
							"margin" : "0px 0px 0px 0px"
						}
					};
					console.info(param);
					self.addDomParamArray(param);  // 设置dom的缺省参数
					break;
				case "input":  // input
					var param = {
						"objectName" : objectName,
						"id" : "domindex"+elem.attr("domindex"),
						"type" : type,
						"data" : {
							"content" : "文本框",
							"sourceField" : "",
						},
						"position" : {
							"top" : elem.position().top+25,
							"left" : elem.position().left,
							"width" : elem.width(),
							"height" : elem.height()-25
						},
						"style" : {
							"font-size" : "16PX",
							"color" : "#333333",
							"letter-spacing" : "1px",
							"font-family" : "微软雅黑",
							"text-align" : "left",
							"line-height" : "35px",
							"padding" : "5px 10px 5px 10px",
							"margin" : "0px 0px 0px 0px",
							"border-width" : "1px",
							"border-style" : "solid",
							"border-color" : "#C3C3C3",
							"border-color:hover" : "#666",
							"border-color:focus" : "#000"
						}
					};
					console.info(param);
					self.addDomParamArray(param);  // 设置dom的缺省参数
					break;
				case "button":  // button
					// 获取提交的数据源字段
					var submitField = dealtButtonSubmitFieldData();
					
					var param = {
						"objectName" : objectName,
						"id" : "domindex"+elem.attr("domindex"),
						"type" : type,
						"data" : {
							"content" : "保存",
							"submitField" : submitField,
							"submitUse" : "add"
						},
						"position" : {
							"top" : elem.position().top+25,
							"left" : elem.position().left,
							"width" : elem.width(),
							"height" : elem.height()-25
						},
						"style" : {
							"font-size" : "17PX",
							"color" : "#fff",
							"letter-spacing" : "1px",
							"font-family" : "微软雅黑",
							"text-align" : "center",
							"line-height" : "45px",
							"padding" : "0px 0px 0px 0px",
							"margin" : "0px 0px 0px 0px",
							"border-width" : "0px",
							"border-style" : "solid",
							"border-color" : "#fff",
							"border-color:hover" : "#fff",
							"background-color" : "#92CAF9",
							"background-color:hover" : "#83BBEA",
							"background-color:active" : "#629AC9"
						}
					};
					console.info(param);
					self.addDomParamArray(param);  // 设置dom的缺省参数
					break;
				case "select":  // select
//					// 获取关联元素
//					var relevanceDom = dealtRelevanceDomData();
//					// 联动元素的字段列表
//					var relevanceField = [];
//					if(relevanceDom.length > 0){
//						relevanceDom = relevanceDom[0].id;
//						var fieldData = dealtRelevanceFieldData(relevanceDom);
//						if(fieldData.length!=0){
//							relevanceField = fieldData[0];
//						}
//					}
					var param = {
						"objectName" : objectName,
						"id" : "domindex"+elem.attr("domindex"),
						"type" : type,
						"data" : {
//							"relevanceDom" : relevanceDom,     // 示例："domindex0"
//							"relevanceField" : relevanceField, // 示例：{id="用户字段A", name="用户字段A"}
//							"relevanceDom" : "domindex1",     // 示例："domindex0"
//							"relevanceField" : {id:"D", name:"D"}, // 示例：{id:"用户字段A", name:"用户字段A"}
//							"sourceField" : "tree2",
//							"defaultData" : [
//							                    {"id":"a","name":"tree2默认数据A"},
//							                    {"id":"b","name":"tree2默认数据B"},
//							                    {"id":"c","name":"tree2默认数据C"}
//							                    
//							                ]
							"relevanceTree": "-10",  // 关联树字段  -10代表是不采用关联树
							"sourceField" : "",
							"defaultData" : [{"id":"a","name":"tree2默认数据A"},
							                 {"id":"b","name":"tree2默认数据B"}]
						},
						"position" : {
							"top" : elem.position().top+25,
							"left" : elem.position().left,
							"width" : elem.width(),
							"height" : elem.height()-25
						},
						"style" : {
							"font-size" : "16PX",
							"color" : "#8B8B8B",
							"letter-spacing" : "1px",
							"font-family" : "微软雅黑",
							"text-align" : "left",
							"padding" : "0 50px 0 30px",
							"border-width" : "1px",
							"border-style" : "solid",
							"border-color" : "#C3C3C3",
							"border-color:hover" : "#8B8B8B"
						}
					};
					console.info(param);
					self.addDomParamArray(param);  // 设置dom的缺省参数
					break;
				case "tree":    // tree
//					// 获取关联元素
//					var relevanceDom = dealtRelevanceDomData();
//					// 联动元素的字段列表
//					var relevanceField = [];
//					if(relevanceDom.length > 0){
//						relevanceDom = relevanceDom[0].id;
//						var fieldData = dealtRelevanceFieldData(relevanceDom);
//						if(fieldData.length!=0){
//							relevanceField = fieldData[0];
//						}
//					}
					
					var param = {
						"objectName" : objectName,
						"id" : "domindex"+elem.attr("domindex"),
						"type" : type,
						"data" : {
//							"relevanceDom" : relevanceDom,     // 示例："domindex0"
//							"relevanceField" : relevanceField, // 示例：{id="用户字段A", name="用户字段A"}
//							"relevanceDom" : "domindex1",     // 示例："domindex0"
//							"relevanceField" : {id:"D", name:"D"}, // 示例：{id:"用户字段A", name:"用户字段A"}
//							"sourceField" : "AA",
//							"defaultData" : [
//							                	{"id":"A","name":"AA默认数据A"},
//							                    {"id":"C","name":"CC默认数据C"}
//							                ]
							"sourceField" : "",
							"defaultData" : []
						},
						"function" : {
							"add" : false,
							"del" : false,
							"edit" : false
						},
						"position" : {
							"top" : elem.position().top+25,
							"left" : elem.position().left,
							"width" : elem.width(),
							"height" : elem.height()-25
						},
						"style" : {
							"font-size" : "15PX",
							"color" : "#333333",
							"letter-spacing" : "1px",
							"font-family" : "微软雅黑"
						}
					};
					console.info(param);
					self.addDomParamArray(param);  // 设置dom的缺省参数
					break;
				case "table":   // table
					var param = {
						"objectName" : objectName,
						"id" : "domindex"+elem.attr("domindex"),
						"type" : type,
						"data" : {
//							"sourceField" : [
//							                 {"id":"ID", "name":"实例字段一"},
//							                 {"id":"NAME", "name":"实例字段二"},
//							                 {"id":"AGE", "name":"实例字段三"}
//							                 ],
//							"fieldWidth" : ["80", "130", "80"]
							"keyField" : "SLZD",
							"sourceField" : [{"id":"SLZD", "name":"实例字段"}],
							"fieldWidth" : [{"id":"A","name":150}]
						},
						"function" : {
							"check" : true,
							"number" : true,
							"edit" : true,
							"del" : true,
							"allDel" : true,
							"filter" : true,
							"paging" : true
						},
						"position" : {
							"top" : elem.position().top+25,
							"left" : elem.position().left,
							"width" : elem.width(),
							"height" : elem.height()-25
						}
					};
					console.info(param);
					self.addDomParamArray(param);  // 设置dom的缺省参数
					break;
				case "tags":    // tags
					var param = {
						"objectName" : objectName,
						"id" : "domindex"+elem.attr("domindex"),
						"type" : type,
						"data" : {
//							"sourceField" : "AA",
//							"defaultData" : [
//							                	{"id":"A","name":"AA默认数据A"},
//							                    {"id":"C","name":"CC默认数据C"}
//							                ]
							"relevanceTree": "-10",  // 关联树字段  -10代表是不采用关联树
							"sourceField" : "",
							"defaultData" : [{"id":"a","name":"tree2默认数据A"},
							                 {"id":"b","name":"tree2默认数据B"}]
						},
						"position" : {
							"top" : elem.position().top+25,
							"left" : elem.position().left,
							"width" : elem.width(),
							"height" : elem.height()-25
						},
						"style" : {
							"font-size" : "15PX",
							"color" : "#333333",
							"letter-spacing" : "1px",
							"font-family" : "微软雅黑",
							"border-width" : "1px",
							"border-style" : "solid",
							"border-color" : "#C3C3C3",
							"border-color:hover" : "#B7B7B7"
						}
					};
					console.info(param);
					self.addDomParamArray(param);  // 设置dom的缺省参数
					break;
				case "rich":    // rich
					console.info(elem.height());
					var param = {
						"objectName" : objectName,
						"id" : "domindex"+elem.attr("domindex"),
						"type" : type,
						"data" : {
							"sourceField" : ""
						},
						"position" : {
							"top" : elem.position().top+25,
							"left" : elem.position().left,
							"width" : elem.width(),
							"height" : elem.height()-25,
							"titleHeight" : 79
						}
					};
					console.info(param);
					self.addDomParamArray(param);  // 设置dom的缺省参数
					break;
				default:
					//console.info("未知类型元素设置默认参数");
			}
		}
	};
	
	// 2.根据类型初始化配置信息的Html代码
	this.initParamHtml = function(elem, type, typeIndex){
		// 根据元素的类型组织param的html代码
		var html = self.dealtParamHtml(
							elem.attr("domindex"),  // 索引id
							elem,                   // 元素
							type,                   // 元素类型
							typeIndex               // 元素类型下的最大索引
					);
		// 如果第一次初始化
		if($("#eleParam form").length == 0){ $("#alertDanger").hide(); }
		// 隐藏其他元素的配置参数
		$("#eleParam form").hide();
		// 添加刚拖过来的元素的配置参数
		$("#eleParam").append(html);
	};
	
	// 3.给form中的每个配置项绑定事件
	this.bindParamItemEvent = function(elem){
		self.initParamItem("domindex"+elem.attr("domindex"));
	};
	
	
	// 根据元素的类型组织param的html代码
	this.dealtParamHtml = function(domIndex, elem, type, typeIndex){
		
		// 保存当前元素的默认数据
		var paramData = new Object();  
		// 从aDomParamArray中找当前元素的配置参数
		$.each(aDomParamArray, function(k, v){
			if(v.id == "domindex"+domIndex){
				paramData = v;
			}
		});
		
		var html = '';
		switch(type){
			case "label":  // label
				html = dealtLabelFormHtml(domIndex, elem, type, typeIndex, paramData);
				break;
			case "input":  // input
				html = dealtInputFormHtml(domIndex, elem, type, typeIndex, paramData);
				break;
			case "button":  // button
				html = dealtButtonFormHtml(domIndex, elem, type, typeIndex, paramData);
				break;
			case "select":  // select
				html = dealtSelectFormHtml(domIndex, elem, type, typeIndex, paramData);
				break;
			case "tree":    // tree
				html = dealtTreeFormHtml(domIndex, elem, type, typeIndex, paramData);
				break;
			case "table":   // table
				html = dealtTableFormHtml(domIndex, elem, type, typeIndex, paramData);
				break;
			case "tags":    // tags
				html = dealtTagsFormHtml(domIndex, elem, type, typeIndex, paramData);
				break;
			case "rich":    // rich
				html = dealtRichFormHtml(domIndex, elem, type, typeIndex, paramData);
				break;
			default:
				console.info("未知类型元素创建");
		}
		
		return html;
	};
	
	// 组织label类型配置属性html
	// typeIndex  同类元素的最大索引
	// paramData  当前元素的默认配置参数
	var dealtLabelFormHtml = function(domIndex, elem, type, typeIndex, paramData){
		// deptDom 为这个form所属于哪个元素
		var html = '';
		html +=    '<form id="labelForm'+typeIndex+'" domType="'+type+'" deptDomIndex="'+domIndex+'" deptDom="domindex'+domIndex+'" class="f-h" >';
		html +=    '	<div class="elem-param">';
		html +=    '		<p class="param-class">数据属性</p>';
		html +=    			dealtContentHtml("文字内容", true, paramData["data"]["content"]);
		html +=    '		<p class="param-class">样式属性</p>';
		html +=    			dealtFontSizeHtml(domIndex, paramData["style"]["font-size"]);
		html +=    			dealtFontColorHtml(domIndex, paramData["style"]["color"]);
		html +=    			dealtFontLetterSpacingHtml(domIndex, paramData["style"]["letter-spacing"]);
		html +=    			dealtFontFamilyHtml(domIndex, paramData["style"]["font-family"]);
		html +=    			dealtTextAlignHtml(domIndex, paramData["style"]["text-align"]);
		html +=    			dealtLineHeightHtml(domIndex, paramData["style"]["line-height"]);
		html +=    			dealtPaddingHtml(domIndex, paramData["style"]["padding"]);
		html +=    			dealtMarginHtml(domIndex, paramData["style"]["margin"]);
		html +=    '	</div>';
		html +=    '</form>';
		
		return html;
	};
	
	// 组织input类型配置属性html
	// typeIndex  同类元素的最大索引
	// paramData  当前元素的默认配置参数
	var dealtInputFormHtml = function(domIndex, elem, type, typeIndex, paramData){
		// deptDom 为这个form所属于哪个元素
		var html = '';
		html +=    '<form id="inputForm'+typeIndex+'" domType="'+type+'" deptDomIndex="'+domIndex+'" deptDom="domindex'+domIndex+'" class="f-h">';
		html +=    '	<div class="elem-param">';
		html +=    '		<p class="param-class">数据属性</p>';
		html +=    			dealtContentHtml("提示信息", false, paramData["data"]["content"]);
		html +=    			dealtSourceFieldHtml(paramData["data"]["sourceField"]);
		html +=    '		<p style="padding-left: 100px;height: 20px;margin-bottom: 0 !important;">';
		html +=    '			<a class="verify-source-field" href="#">验证字段</a>';
		html +=    '		</p>';
		html +=    '		<p class="param-class">样式属性</p>';
		html +=    			dealtFontSizeHtml(domIndex, paramData["style"]["font-size"]);
		html +=    			dealtFontColorHtml(domIndex, paramData["style"]["color"]);
		html +=    			dealtFontLetterSpacingHtml(domIndex, paramData["style"]["letter-spacing"]);
		html +=    			dealtFontFamilyHtml(domIndex, paramData["style"]["font-family"]);
		html +=    			dealtTextAlignHtml(domIndex, paramData["style"]["text-align"]);
		html +=    			dealtLineHeightHtml(domIndex, paramData["style"]["line-height"]);
		html +=    			dealtPaddingHtml(domIndex, paramData["style"]["padding"]);
		html +=    			dealtMarginHtml(domIndex, paramData["style"]["margin"]);
		html +=    			dealtBorderWidthHtml(domIndex, paramData["style"]["border-width"]);
		html +=    			dealtBorderStyleHtml(domIndex, paramData["style"]["border-style"]);
		html +=    			dealtBorderColorHtml(domIndex, paramData["style"]["border-color"]);
		html +=    			dealtBorderColorHoverHtml(domIndex, paramData["style"]["border-color:hover"]);
		html +=    			dealtBorderColorFocusHtml(domIndex, paramData["style"]["border-color:active"]);
		html +=    '	</div>';
		html +=    '</form>';
		
		return html;
	};
	
	// 组织button类型配置属性html
	// typeIndex  同类元素的最大索引
	// paramData  当前元素的默认配置参数
	var dealtButtonFormHtml = function(domIndex, elem, type, typeIndex, paramData){
		var html = '';
		html +=    '<form id="buttonForm'+typeIndex+'" domType="'+type+'" deptDomIndex="'+domIndex+'" deptDom="domindex'+domIndex+'" class="f-h">';
		html +=    '	<div class="elem-param">';
		html +=    '		<p class="param-class">数据属性</p>';
		html +=    			dealtContentHtml("文字内容", true, paramData["data"]["content"]);
		html +=    			dealtSubmitFieldHtml(paramData["data"]["submitField"]);
		html +=    			dealtSubmitUseHtml(domIndex, paramData["data"]["submitUse"]);
		html +=    '		<p class="param-class">样式属性</p>';
		html +=    			dealtFontSizeHtml(domIndex, paramData["style"]["font-size"]);
		html +=    			dealtFontColorHtml(domIndex, paramData["style"]["color"]);
		html +=    			dealtFontLetterSpacingHtml(domIndex, paramData["style"]["letter-spacing"]);
		html +=    			dealtFontFamilyHtml(domIndex, paramData["style"]["font-family"]);
		html +=    			dealtTextAlignHtml(domIndex, paramData["style"]["text-align"]);
		html +=    			dealtLineHeightHtml(domIndex, paramData["style"]["line-height"]);
		html +=    			dealtPaddingHtml(domIndex, paramData["style"]["padding"]);
		html +=    			dealtMarginHtml(domIndex, paramData["style"]["margin"]);
		html +=    			dealtBorderWidthHtml(domIndex, paramData["style"]["border-width"]);
		html +=    			dealtBorderStyleHtml(domIndex, paramData["style"]["border-style"]);
		html +=    			dealtBorderColorHtml(domIndex, paramData["style"]["border-color"]);
		html +=    			dealtBorderColorHoverHtml(domIndex, paramData["style"]["border-color:hover"]);
		html +=    			dealtBGColorHtml(domIndex, paramData["style"]["background-color"]);
		html +=    			dealtBGColorHoverHtml(domIndex, paramData["style"]["background-color:hover"]);
		html +=    			dealtBGColorActiveHtml(domIndex, paramData["style"]["background-color:active"]);
		html +=    '	</div>';
		html +=    '</form>';
		
		return html;
	};
	
	// 组织select类型配置属性html
	// typeIndex  同类元素的最大索引
	// paramData  当前元素的默认配置参数
	var dealtSelectFormHtml = function(domIndex, elem, type, typeIndex, paramData){
		var html = '';
		html +=    '<form id="selectForm'+typeIndex+'" domType="'+type+'" deptDomIndex="'+domIndex+'" deptDom="domindex'+domIndex+'" class="f-h">';
		html +=    '	<div class="elem-param">';
		html +=    '		<p class="param-class">数据属性</p>';
		html +=    			dealtSourceFieldHtml(paramData["data"]["sourceField"]);
		html +=    '		<p style="padding-left: 100px;height: 20px;margin-bottom: 0 !important;">';
		html +=    '			<a class="verify-source-field" href="#">验证字段</a>';
		html +=    '		</p>';
		html +=    			dealtRelevanceTreeFieldHtml(domIndex, paramData["data"]["relevanceTree"]);
		html +=    			dealtSelectMSDefaultDataHtml(paramData["data"]["relevanceTree"]);
		html +=    			dealtSelectCIDefaultDataHtml(paramData["data"]["defaultData"], paramData["data"]["relevanceTree"]);
		html +=    '		<p class="param-class">样式属性</p>';
		html +=    			dealtFontSizeHtml(domIndex, paramData["style"]["font-size"]);
		html +=    			dealtFontColorHtml(domIndex, paramData["style"]["color"]);
		html +=    			dealtFontLetterSpacingHtml(domIndex, paramData["style"]["letter-spacing"]);
		html +=    			dealtFontFamilyHtml(domIndex, paramData["style"]["font-family"]);
		html +=    			dealtTextAlignHtml(domIndex, paramData["style"]["text-align"]);
		html +=    			dealtPaddingHtml(domIndex, paramData["style"]["padding"]);
		html +=    			dealtBorderWidthHtml(domIndex, paramData["style"]["border-width"]);
		html +=    			dealtBorderStyleHtml(domIndex, paramData["style"]["border-style"]);
		html +=    			dealtBorderColorHtml(domIndex, paramData["style"]["border-color"]);
		html +=    			dealtBorderColorHoverHtml(domIndex, paramData["style"]["border-color:hover"]);
		html +=    '	</div>';
		html +=    '</form>';
		
		return html;
	};
	
	
	// 组织tree类型配置属性html
	// typeIndex  同类元素的最大索引
	// paramData  当前元素的默认配置参数
	var dealtTreeFormHtml = function(domIndex, elem, type, typeIndex, paramData){
		var html = '';
		html +=    '<form id="treeForm'+typeIndex+'" domType="'+type+'" deptDomIndex="'+domIndex+'" deptDom="domindex'+domIndex+'" class="f-h">';
		html +=    '	<div class="elem-param">';
		html +=    '		<p class="param-class">数据属性</p>';
		html +=    			dealtSourceFieldHtml(paramData["data"]["sourceField"]);
		html +=    '		<p style="padding-left: 100px;height: 20px;margin-bottom: 0 !important;">';
		html +=    '			<a class="verify-source-field" href="#">验证字段</a>';
		html +=    '		</p>';
		html +=    			dealtCIDefaultDataHtml(paramData["data"]["defaultData"]);
		html +=    '		<p class="param-class">功能属性</p>';
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["add"], "新增功能", "add", "treeAdd");
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["del"], "删除功能", "del", "treeDel");
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["edit"], "编辑功能", "edit", "treeEdit");
		html +=    '		<p class="param-class">样式属性</p>';
		html +=    			dealtFontSizeHtml(domIndex, paramData["style"]["font-size"]);
		html +=    			dealtFontColorHtml(domIndex, paramData["style"]["color"]);
		html +=    			dealtFontLetterSpacingHtml(domIndex, paramData["style"]["letter-spacing"]);
		html +=    			dealtFontFamilyHtml(domIndex, paramData["style"]["font-family"]);
		html +=    '	</div>';
		html +=    '</form>';
		
		return html;
	};
	
	// 组织table类型配置属性html
	// typeIndex  同类元素的最大索引
	// paramData  当前元素的默认配置参数
	var dealtTableFormHtml = function(domIndex, elem, type, typeIndex, paramData){
		var html = '';
		html +=    '<form id="tableForm'+typeIndex+'" domType="'+type+'" deptDomIndex="'+domIndex+'" deptDom="domindex'+domIndex+'" class="f-h">';
		html +=    '	<div class="elem-param">';
		html +=    '		<p class="param-class">数据属性</p>';
		html +=    			dealtTableKeyFieldHtml(paramData["data"]["keyField"]);
		html +=    			dealtTableCISourceFieldHtml(paramData["data"]["sourceField"]);
		html +=    			dealtTableMIWidthHtml(paramData["data"]["fieldWidth"]);
		html +=    '		<p class="table-verify-source-field">';
		html +=    '			<a class="verify-source-field" href="#">验证字段</a>';
		html +=    '		</p>';
		html +=    '		<p class="param-class">功能属性</p>';
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["check"],  "全选功能", "check",  "tableCheck") ;
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["number"], "序号功能", "number", "tableNumber");
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["edit"],   "编辑功能", "edit",   "tableEdit")  ; 
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["del"],    "删除功能", "del",    "tableDel")   ;
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["allDel"], "全部删除", "allDel", "tableAllDel");
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["filter"], "过滤功能", "filter", "tableFilter");
		html +=    			dealtTreeTableCheckboxHtml(domIndex, paramData["function"]["paging"], "分页功能", "paging", "tablePaging");
		html +=    '	</div>';
		html +=    '</form>';
		
		return html;
	};

	// 组织tags类型配置属性html
	// typeIndex  同类元素的最大索引
	// paramData  当前元素的默认配置参数
	var dealtTagsFormHtml = function(domIndex, elem, type, typeIndex, paramData){
		var html = '';
		html +=    '<form id="tagsForm'+typeIndex+'" domType="'+type+'" deptDomIndex="'+domIndex+'" deptDom="domindex'+domIndex+'" class="f-h">';
		html +=    '	<div class="elem-param">';
		html +=    '		<p class="param-class">数据属性</p>';
		html +=    			dealtSourceFieldHtml(paramData["data"]["sourceField"]);
		html +=    '		<p style="padding-left: 100px;height: 20px;margin-bottom: 0 !important;">';
		html +=    '			<a class="verify-source-field" href="#">验证字段</a>';
		html +=    '			<a class="change-choose" fun="changeFieldChoose" href="#">新增新的默认值</a>';
		html +=    '		</p>';
		html +=    			dealtTagsRelevanceTreeFieldHtml(domIndex, paramData["data"]["relevanceTree"]);
		html +=    			dealtTagsMSDefaultDataHtml(paramData["data"]["relevanceTree"]);
		html +=    			dealtTagsCIDefaultDataHtml(paramData["data"]["defaultData"], paramData["data"]["relevanceTree"]);
		html +=    '		<p class="param-class">样式属性</p>';
		html +=    			dealtFontSizeHtml(domIndex, paramData["style"]["font-size"]);
		html +=    			dealtFontColorHtml(domIndex, paramData["style"]["color"]);
		html +=    			dealtFontLetterSpacingHtml(domIndex, paramData["style"]["letter-spacing"]);
		html +=    			dealtFontFamilyHtml(domIndex, paramData["style"]["font-family"]);
		html +=    			dealtBorderWidthHtml(domIndex, paramData["style"]["border-width"]);
		html +=    			dealtBorderStyleHtml(domIndex, paramData["style"]["border-style"]);
		html +=    			dealtBorderColorHtml(domIndex, paramData["style"]["border-color"]);
		html +=    			dealtBorderColorHoverHtml(domIndex, paramData["style"]["border-color:hover"]);
		html +=    '	</div>';
		html +=    '</form>';
		
		return html;
	};
	
	// 组织rich类型配置属性html
	// typeIndex  同类元素的最大索引
	// paramData  当前元素的默认配置参数
	var dealtRichFormHtml = function(domIndex, elem, type, typeIndex, paramData){
		var html = '';
		html +=    '<form id="richForm'+typeIndex+'" domType="'+type+'" deptDomIndex="'+domIndex+'" deptDom="domindex'+domIndex+'" class="f-h">';
		html +=    '	<div class="elem-param">';
		html +=    '		<p class="param-class">数据属性</p>';
		html +=    			dealtSourceFieldHtml(paramData["data"]["sourceField"]);
		html +=    '		<p style="padding-left: 100px;height: 20px;margin-bottom: 0 !important;">';
		html +=    '			<a class="verify-source-field" href="#">验证字段</a>';
		html +=    '		</p>';
		html +=    '</form>';
		
		return html;
	};
	
	
	/****** 由于form中会用到各种配置项的html代码，在此根据默认数据进行组织 ******/
	/* 开始 */
	
	/*--- 组织data类型form所需要的html代码 -- 开始 -*/
	
	// 组织内容
	// label  label的提示信息
	// requir 当前选项是不是必填
	// value  当前选项的默认值
	var dealtContentHtml = function(label, requir, value){
		var html = '';
		html += '<p>';
		html += '	<label>'+label+' : </label>';
		html += '	<input id="content" type="text" classify="data" requir="'+requir+'" eType="input" value="'+value+'"/>';
		html += '</p>';
		
		return html;
	};
	
	// 组织数据源字段
	// value 当前配置项的默认值
	var dealtSourceFieldHtml = function(value){
		var html = '';
		html += '<p style="margin-bottom: 3px !important;">';
		html += '	<label>数据源字段 : </label>';
		html += '	<input id="sourceField" type="text" classify="data" requir="true" eType="input" value="'+value+'"/>';
		html += '</p>';
		
		return html;
	};
	
	
	// 组织复杂输入框默认数据
	// keyList 当前配置项的默认值
	var dealtCIDefaultDataHtml = function(keyList){
		var dataList = [];
		$.each(keyList, function(k, v){
			dataList.push(v.name);
		});
		
		var html = '';
		html += '<div hType="p">'; 
		html += '	<label>默认数据 : </label>';
		html += '	<div id="defaultData" class="multi-input" classify="data" requir="true" eType="minput" value='+$.toJSON(dataList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	// 组织SELECT多选下拉框默认数据
	// relevanceTree  关联树元素
	var dealtSelectMSDefaultDataHtml = function(relevanceTree){
		var keyList = [];
		var defaultList = [];
		var display = "";
		console.info(relevanceTree);
		if(relevanceTree == "-10"){
			display = " style='display:none;'";
		}else{
			var objectName = relevanceTree.split("--")[0];
			relevanceTree = relevanceTree.split("--")[1];
			// 根据   树关联字段   获取此字段下面的所有数据，组成默认数据列表供用户选择
			dealtDefaultDataByTreeField(objectName, relevanceTree, {callback:function(cbdata){
				console.info(cbdata);
				defaultList = cbdata;
				setTimeout(function(){
					if($("form[domtype='select'][deptdomindex='"+(domIndex-1)+"'] #defaultData .select-picker").length>0){  // 存在，修改值
						$("form[domtype='select'][deptdomindex='"+(domIndex-1)+"'] #defaultData").multiSelect("resetData", defaultList, "true", keyList);
					}
				},0);
			}});
		}
		
		var html = '';
		html += '<div hType="div" '+display+'>'; 
		html += '	<label>关联树的数据 : </label>';
		html += '	<div id="defaultData" class="multi-select" classify="data" requir="true" eType="mselect" isEdit="false" isCheck="true" key='+$.toJSON(keyList)+' value='+$.toJSON(defaultList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	// 组织SELECT复杂输入框默认数据
	// keyList 当前配置项的默认值
	// relevanceTree  关联树元素
	var dealtSelectCIDefaultDataHtml = function(keyList, relevanceTree){
		var display = "";
		if(relevanceTree != "-10"){
			display = " style='display:none;'";
		}
		
		if(relevanceTree != "-10"){ keyList = []; }
		var dataList = [];
		$.each(keyList, function(k, v){
			dataList.push(v.name);
		});
		
		var html = '';
		html += '<div hType="p"'+display+'>'; 
		html += '	<label>默认数据 : </label>';
		html += '	<div id="defaultData" class="multi-input" classify="data" requir="true" eType="minput" value='+$.toJSON(dataList)+'></div>';
		html += '</div>';
		
		return html;
	};
	

	// 组织TAGS多选下拉框默认数据
	// relevanceTree  关联树元素
	var dealtTagsMSDefaultDataHtml = function(relevanceTree){
		var keyList = [];
		var defaultList = [];
		var display = "";
		if(relevanceTree == "-10"){
			display = " style='display:none;'";
		}else{
			// 根据   树关联字段   获取此字段下面的所有数据，组成默认数据列表供用户选择
			var objectName = relevanceTree.split("--")[0];
			relevanceTree = relevanceTree.split("--")[1];
			// 根据   树关联字段   获取此字段下面的所有数据，组成默认数据列表供用户选择
			dealtDefaultDataByTreeField(objectName, relevanceTree, {callback:function(cbdata){
				defaultList = cbdata;
				setTimeout(function(){
					if($("form[domtype='tags'][deptdomindex='"+(domIndex-1)+"'] #defaultData .select-picker").length>0){  // 存在，修改值
						$("form[domtype='tags'][deptdomindex='"+(domIndex-1)+"'] #defaultData").multiSelect("resetData", defaultList, "true", keyList);
					}
				},0);
			}});
		}
		
		var html = '';
		html += '<div hType="div" '+display+'>'; 
		html += '	<label>关联树的数据 : </label>';
		html += '	<div id="defaultData" class="multi-select" classify="data" requir="true" eType="mselect" isEdit="false" isCheck="true" key='+$.toJSON(keyList)+' value='+$.toJSON(defaultList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	// 组织TAGS复杂输入框默认数据
	// keyList 当前配置项的默认值
	// relevanceTree  关联树元素
	var dealtTagsCIDefaultDataHtml = function(keyList, relevanceTree){
		var display = "";
		if(relevanceTree != "-10"){
			display = " style='display:none;'";
		}
		
		if(relevanceTree != "-10"){ keyList = []; }
		var dataList = [];
		$.each(keyList, function(k, v){
			dataList.push(v.name);
		});
		
		var html = '';
		html += '<div hType="p"'+display+'>'; 
		html += '	<label>默认数据 : </label>';
		html += '	<div id="defaultData" class="multi-input" classify="data" requir="true" eType="minput" value='+$.toJSON(dataList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	// 组织Table主键源字段
	// keyField 当前配置项的默认值
	var dealtTableKeyFieldHtml = function(keyField){
		var html = '';
		html += '<div>'; 
		html += '	<label>主键列字段 : </label>';
		html += '	<input id="keyField" type="text" classify="data" requir="true" eType="input" value="'+keyField+'"/>';
		html += '</div>';
		
		return html;
	};
	
	// 组织Table复杂输入框源字段
	// keyList 当前配置项的默认值
	var dealtTableCISourceFieldHtml = function(keyList){
		var html = '';
		html += '<div>'; 
		html += '	<label>数据源字段 : </label>';
		html += '	<div id="sourceField" class="complex-input" classify="data" requir="true" eType="cinput" value='+$.toJSON(keyList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	// 组织简单输入框字段宽度
	// keyList 当前配置项的默认值
	var dealtTableMIWidthHtml = function(keyList){
		var widthList = [];
		$.each(keyList, function(k, v){
			widthList.push(parseInt(v.name));
		});
		var html = '';
		html += '<div style="margin-bottom: 3px!important;">'; 
		html += '	<label>源字段宽度 : </label>';
		html += '	<div id="fieldWidth" class="multi-input" classify="data" requir="true" eType="minput" value='+$.toJSON(widthList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	// 组织提交数据源字段
	// fieldValue 当前配置项的默认值
	var dealtSubmitFieldHtml = function(fieldValue){
		// 需要获取页面中的元素列表
		var fieldList = dealtButtonSubmitFieldData();
		
		// 在设置选中button默认选中的那些数据
		var keyList = [];
		$.each(fieldValue, function(k, v){
			keyList.push(v.id);
		});
		
		var html = '';
		html += '<div>';
		html += '	<label>提交数据字段 : </label>';
		html += '	<div id="submitField" class="multi-select" classify="data" requir="true" eType="mselect" key='+$.toJSON(keyList)+' value='+$.toJSON(fieldList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	// 组织提交用途
	// domIndex 当前元素索引
	// selectedValue 当前选项的默认值
	var dealtSubmitUseHtml = function(domIndex, selectedValue){
		var optionHtmls = '';
		if(selectedValue=="add"){
			optionHtmls  = '<option value="add" selected>保存数据</option>';
//			optionHtmls += '<option value="update">更新数据</option>';
		}else if(selectedValue=="update"){
//			optionHtmls  = '<option value="add">新增数据</option>';
//			optionHtmls += '<option value="update" selected>更新数据</option>';
		}
		
		var html = '';
		html += '<div>';
		html += '	<label>提交用途 : </label>';
		html += '	<select id="submitUse_'+domIndex+'" class="beautify_input" classify="data" requir="false" eType="select">';
		html += 		optionHtmls;
		html += '	</select>';
		html += '</div>';
		
		return html;
	};
	
	// 废弃 -- 组织关联元素
	// domIndex   当前元素索引
	// typeIndex  当前元素同类的索引
	// domList    页面table元素列表
	// defaultDom 当前元素默认值
	var dealtRelevanceDomHtml = function(domIndex, domList, defaultDom){
		var optionHtmls = '';
		for(var i=0, len=domList.length; i<len; i++){
			var typeIndex = $(".d-dom[domindex='"+domList[i].id.replace(/[^0-9]/ig,"")+"']").attr("typeindex");
			if(defaultDom == domList[i].id){  // 默认选中
				optionHtmls += '<option value="'+domList[i].id+'" selected>关联元素'+typeIndex+'</option>';
			}else{
				optionHtmls += '<option value="'+domList[i].id+'">关联元素'+typeIndex+'</option>';
			}
		}
		
		var html = '';
		html += '<div>';
		html += '	<label>联动元素 : </label>';
		html += '	<select mapField="true" mapRelevanceId="relevanceField" id="relevanceDom_'+domIndex+'" class="beautify_input" classify="data" requir="true" eType="select">';
		html += 		optionHtmls;
		html += '	</select>';
		html += '</div>';
		
		return html;
	};
	
	// 废弃 -- 组织关联字段
	// domIndex     当前元素索引
	// fieldList    页面table元素的字段列表
	// defaultField 当前元素默认值
	var dealtRelevanceFieldHtml = function(domIndex, fieldList, defaultField){
		var key = "";
		if(defaultField.id != null){
			key = defaultField.id;
		}
		
		var html = '';
		html += '<div>';
		html += '	<label>联动元素字段 : </label>';
		html += '	<div id="relevanceField" class="zy-select" classify="data" requir="true" eType="zyselect" isCheck="true" key="'+key+'" value='+$.toJSON(fieldList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	
	// 组织关联树字段，获取用户下所有的tree，供用户创建select时选用是关联已存在的tree还是单独的select
	// 通常这种业务是存在栏目管理+新增页面的组合功能
	// domIndex   当前元素索引
	// relevanceTree 关联tree的key
	var dealtRelevanceTreeFieldHtml = function(domIndex, relevanceTree){
		console.info(relevanceTree);
		var selected = [];
		if(relevanceTree == "-10"){
			selected = {"id":"-10","name":"暂无关联树字段"};
		}else{
			var objectName = relevanceTree.split("--")[0];
			var colName = relevanceTree.split("--")[1];
			selected = {"id":relevanceTree,"name":objectName+"--"+colName};
		}
		// 获取用户下的tree字段列表，然后再通过修改select值实现数据更新
		dealtTreeFieldByUser(domIndex, relevanceTree, {callback:function(cbdata){
			if($("form[domtype='select'][deptdomindex='"+domIndex+"'] #relevanceTree .select-picker").length>0){  // 存在，修改值
				$("form[domtype='select'][deptdomindex='"+domIndex+"'] #relevanceTree").zySelect("resetData", cbdata, relevanceTree);
			}
		}});
		var key = relevanceTree;
		var fieldList = [];
		if(relevanceTree == -10){
			fieldList = [{"id":"-10","name":"暂无关联树字段"}];
		}else{
			var objectName = relevanceTree.split("--")[0];
			var colName = relevanceTree.split("--")[1];
			fieldList = [{"id":relevanceTree,"name":objectName+"--"+colName}];
		}
		var html = '';
		html += '<div>';
		html += '	<label>联动树字段 : </label>';
		html += '	<div id="relevanceTree" class="zy-select" classify="data" mapField="true" mapRelevanceId="defaultData" requir="true" eType="zyselect" isCheck="true" key="'+key+'" value='+$.toJSON(fieldList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	
	// 组织关联树字段，获取用户下所有的tree，供用户创建tags时选用是关联已存在的tree还是单独的tags
	// 通常这种业务是存在栏目管理+新增页面的组合功能
	// domIndex   当前元素索引
	// relevanceTree 关联tree的key
	var dealtTagsRelevanceTreeFieldHtml = function(domIndex, relevanceTree){
		console.info(relevanceTree);
		var selected = [];
		if(relevanceTree == "-10"){
			selected = {"id":"-10","name":"暂无关联树字段"};
		}else{
			var objectName = relevanceTree.split("--")[0];
			var colName = relevanceTree.split("--")[1];
			selected = {"id":relevanceTree,"name":objectName+"--"+colName};
		}
		// 获取用户下的tree字段列表，然后再通过修改select值实现数据更新
		dealtTreeFieldByUser(domIndex, relevanceTree, {callback:function(cbdata){
			if($("form[domtype='tags'][deptdomindex='"+domIndex+"'] #relevanceTree .select-picker").length>0){  // 存在，修改值
				$("form[domtype='tags'][deptdomindex='"+domIndex+"'] #relevanceTree").zySelect("resetData", cbdata, relevanceTree);
			}
		}});
		var key = relevanceTree;
		var fieldList = [];
		if(relevanceTree == -10){
			fieldList = [{"id":"-10","name":"暂无关联树字段"}];
		}else{
			var objectName = relevanceTree.split("--")[0];
			var colName = relevanceTree.split("--")[1];
			fieldList = [{"id":relevanceTree,"name":objectName+"--"+colName}];
		}
		var html = '';
		html += '<div>';
		html += '	<label>联动树字段 : </label>';
		html += '	<div id="relevanceTree" class="zy-select" classify="data" mapField="true" mapRelevanceId="defaultData" requir="true" eType="zyselect" isCheck="true" key="'+key+'" value='+$.toJSON(fieldList)+'></div>';
		html += '</div>';
		
		return html;
	};
	
	
	/*--- 组织data类型form所需要的html代码 -- 结束 -*/
	
	
	/*--- 组织style类型form所需要的html代码 -- 开始 -*/
	
	// 组织字体大小
	// domIndex 当前元素索引
	// selectedValue 当前选项的默认值
	var dealtFontSizeHtml = function(domIndex, selectedValue){
		var optionHtmls = '';
		var key = parseInt(selectedValue.replace(/[^0-9]/ig,""));
		for(var i=13; i<=26; i++){
			if(i==key){  // 选中
				optionHtmls += '<option value='+i+'PX cSize='+i+'PX selected>'+i+'PX</option>';
			}else{  // 不选中
				optionHtmls += '<option value='+i+'PX cSize='+i+'PX>'+i+'PX</option>';
			}
		}
		
		var html = '';
		html += '<div>';
		html += '	<label mapCss="font-size">字体大小 : </label>';
		html += '	<select id="font-size_'+domIndex+'" class="beautify_input" classify="style" requir="true" eType="select">';
		html += 		optionHtmls;
		html += '	</select>';
		html += '</div>';
		
		return html;
	};
	
	// 组织字体颜色
	// domIndex 当前元素索引
	// colorValue 当前选项的默认值
	var dealtFontColorHtml = function(domIndex, colorValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="color">字体颜色 : </label>';
		html += '	<input id="color" type="text" classify="style" requir="true" eType="color" color="'+colorValue+'" />';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	// 组织字体间距
	// domIndex 当前元素索引
	// spacingValue 当前选项的默认值
	var dealtFontLetterSpacingHtml = function(domIndex, spacingValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="letter-spacing">字体间距 : </label>';
		html += '	<input id="letter-spacing" type="text" classify="style" requir="true" eType="input" value="'+spacingValue+'"/>';
		html += '</p>';
	
		return html;
	};
	
	// 组织字体家庭
	// domIndex 当前元素索引
	// selectedValue 当前选项的默认值
	var dealtFontFamilyHtml = function(domIndex, selectedValue){
		var optionHtmls = '';
		if(selectedValue=="sans-serif"){
			optionHtmls  = '<option value="sans-serif" cFamily="sans-serif" selected>sans-serif</option>';
			optionHtmls += '<option value="宋体" cFamily="宋体">宋体</option>';
			optionHtmls += '<option value="微软雅黑" cFamily="微软雅黑">微软雅黑</option>';
		}else if(selectedValue=="宋体"){
			optionHtmls  = '<option value="sans-serif" cFamily="sans-serif">sans-serif</option>';
			optionHtmls += '<option value="宋体" cFamily="宋体" selected>宋体</option>';
			optionHtmls += '<option value="微软雅黑" cFamily="微软雅黑">微软雅黑</option>';
		}else if(selectedValue=="微软雅黑"){
			optionHtmls  = '<option value="sans-serif" cFamily="sans-serif">sans-serif</option>';
			optionHtmls += '<option value="宋体" cFamily="宋体" selected>宋体</option>';
			optionHtmls += '<option value="微软雅黑" cFamily="微软雅黑" selected>微软雅黑</option>';
		}
		
		var html = '';
		html += '<div>';
		html += '	<label mapCss="font-family">字体样式 : </label>';
		html += '	<select id="font-family_'+domIndex+'" class="beautify_input" classify="style" requir="false" eType="select">';
		html += 		optionHtmls;
		html += '	</select>';
		html += '</div>';
		
		return html;
	};
	
	// 组织水平居中
	// domIndex 当前元素索引
	// selectedValue 当前选项的默认值
	var dealtTextAlignHtml = function(domIndex, selectedValue){
		var optionHtmls = '';
		if(selectedValue=="left"){
			optionHtmls  = '<option value="left" selected>左对齐</option>';
			optionHtmls += '<option value="center">水平居中</option>';
			optionHtmls += '<option value="right">右对齐</option>';
		}else if(selectedValue=="center"){
			optionHtmls  = '<option value="left">左对齐</option>';
			optionHtmls += '<option value="center" selected>水平居中</option>';
			optionHtmls += '<option value="right">右对齐</option>';
		}else if(selectedValue=="right"){
			optionHtmls  = '<option value="left">左对齐</option>';
			optionHtmls += '<option value="center">水平居中</option>';
			optionHtmls += '<option value="right" selected>右对齐</option>';
		}
		
		var html = '';
		html += '<div>';
		html += '	<label mapCss="text-align">字体居中 : </label>';
		html += '	<select id="text-align_'+domIndex+'" class="beautify_input" classify="style" requir="false" eType="select">';
		html += 		optionHtmls;
		html += '	</select>';
		html += '</div>';
		
		return html;
	};
	
	// 组织行高
	// domIndex 当前元素索引
	// heightValue 当前选项的默认值
	var dealtLineHeightHtml = function(domIndex, heightValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="line-height">字体行高 : </label>';
		html += '	<input id="line-height" type="text" classify="style" requir="false" eType="input" value="'+heightValue+'"/>';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	// 组织Padding
	// domIndex 当前元素索引
	// paddingValue 当前选项的默认值
	var dealtPaddingHtml = function(domIndex, paddingValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="padding">Padding : </label>';
		html += '	<input id="padding" type="text" classify="style" requir="false" eType="input" value="'+paddingValue+'"/>';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	// 组织Margin
	// domIndex 当前元素索引
	// marginValue 当前选项的默认值
	var dealtMarginHtml = function(domIndex, marginValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="margin">Margin : </label>';
		html += '	<input id="margin" type="text" classify="style" requir="false" eType="input" value="'+marginValue+'"/>';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	// 组织边框宽度
	// domIndex 当前元素索引
	// selectedValue 当前选项的默认值
	var dealtBorderWidthHtml = function(domIndex, selectedValue){
		var optionHtmls = '';
		var key = parseInt(selectedValue.replace(/[^0-9]/ig,""));
		for(var i=0; i<4; i++){
			if(i==key){  // 选中
				optionHtmls += '<option value='+i+'PX selected>'+i+'PX</option>';
			}else{  // 不选中
				optionHtmls += '<option value='+i+'PX>'+i+'PX</option>';
			}
		}
		
		var html = '';
		html += '<div>';
		html += '	<label mapCss="border-width">边框宽度 : </label>';
		html += '	<select id="border-width_'+domIndex+'" class="beautify_input" classify="style" requir="false" eType="select">';
		html += 		optionHtmls;
		html += '	</select>';
		html += '</div>';
		
		return html;
	};
	
	// 组织边框颜色
	// domIndex 当前元素索引
	// colorValue 当前选项的默认值
	var dealtBorderColorHtml = function(domIndex, colorValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="border-color">边框颜色 : </label>';
		html += '	<input id="border-color" type="text" classify="style" requir="true" eType="color" color="'+colorValue+'" />';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	// 组织边框样式
	// domIndex 当前元素索引
	// selectedValue 当前选项的默认值
	var dealtBorderStyleHtml = function(domIndex, selectedValue){
		var optionHtmls = '';
		if(selectedValue=="solid"){
			optionHtmls  = '<option value="solid" selected>实线</option>';
			optionHtmls += '<option value="dashed">虚线</option>';
		}else if(selectedValue=="dashed"){
			optionHtmls  = '<option value="solid">实线</option>';
			optionHtmls += '<option value="dashed" sselected>虚线</option>';
		}
		
		var html = '';
		html += '<div>';
		html += '	<label mapCss="border-style">边框样式 : </label>';
		html += '	<select id="border-style_'+domIndex+'" class="beautify_input" classify="style" requir="false" eType="select">';
		html += 		optionHtmls;
		html += '	</select>';
		html += '</div>';
		
		return html;
	};
	
	// 组织Hover边框颜色
	// domIndex 当前元素索引
	// colorValue 当前选项的默认值
	var dealtBorderColorHoverHtml = function(domIndex, colorValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="border-color:hover">边框悬浮颜色 : </label>';
		html += '	<input id="border-color:hover" type="text" classify="style" requir="false" eType="color" color="'+colorValue+'" />';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	// 组织Focus边框颜色
	// domIndex 当前元素索引
	// colorValue 当前选项的默认值
	var dealtBorderColorFocusHtml = function(domIndex, colorValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="border-color:focus">边框触发颜色 : </label>';
		html += '	<input id="border-color:focus" type="text" classify="style" requir="false" eType="color" color="'+colorValue+'" />';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	// 组织背景颜色
	// domIndex 当前元素索引
	// colorValue 当前选项的默认值
	var dealtBGColorHtml = function(domIndex, colorValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="background-color">背景颜色 : </label>';
		html += '	<input id="background-color" type="text" classify="style" requir="true" eType="color" color="'+colorValue+'" />';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	// 组织Hover背景颜色
	// domIndex 当前元素索引
	// colorValue 当前选项的默认值
	var dealtBGColorHoverHtml = function(domIndex, colorValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="background-color:hover">背景悬浮颜色 : </label>';
		html += '	<input id="background-color:hover" type="text" classify="style" requir="false" eType="color" color="'+colorValue+'" />';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	// 组织Active背景颜色
	// domIndex 当前元素索引
	// colorValue 当前选项的默认值
	var dealtBGColorActiveHtml = function(domIndex, colorValue){
		var html = '';
		html += '<p>';
		html += '	<label mapCss="background-color:active">背景触发颜色 : </label>';
		html += '	<input id="background-color:active" type="text" classify="style" requir="false" eType="color" color="'+colorValue+'" />';  // eType代表是哪种类型  sType代表是哪种具体的类型
		html += '</p>';
	
		return html;
	};
	
	/*--- 组织style类型form所需要的html代码 -- 结束 -*/
	
	
	/*--- 组织function类型form所需要的html代码 -- 开始 -*/
	
	// 组织Tree和Table的checkbox类型的html
	// domIndex 当前元素索引
	// checkedValue 当前选项的默认值
	var dealtTreeTableCheckboxHtml = function(domIndex, checkedValue, desc, divId, InputId){
		var checkedStr = checkedValue? 'selected="true"' : '';
		var html = '';
		html += '<div>';
		html += '	<label>'+desc+' : </label>';
		html += '	<div id="'+divId+'" classify="function" requir="true" eType="checkbox" '+checkedStr+'>';
		html += '		<input id="'+InputId+'_'+domIndex+'" type="checkbox">';
		html += '		<label class="check-box" for="'+InputId+'_'+domIndex+'"></label>';
		html += '		<span class="check-box-tip">勾选为启用</span>';
		html += '	</div>';
		html += '</div>';
	
		return html;
	};
	
	
	/*--- 组织function类型form所需要的html代码 -- 结束 -*/
	
	
	/* 结束 */
	/****** 由于form中会用到各种配置项的html代码，在此根据默认数据进行组织 ******/
	
	
	
	
	
	
	
	
	/****** 由于form中会用到已存在的数据源字段、联动元素等，所以下面的方法是单独获取的数据源字段等数据 ******/
	/* 开始 */
	
	// 组织button提交数据字段的数据
	// 在这里会根据页面上每个d-dom元素的配置项的字段名，组织成数组，供button元素form配置中使用
	var dealtButtonSubmitFieldData = function(){
		// 要找到页面上的每个元素
		var aFieldList = [];
		for(var i=0,length=aDomParamArray.length; i<length; i++){
			var domType = aDomParamArray[i].type;
			if(domType != "label" && domType != "table" && domType != "button"){
				var name = "";
				if(domType === "input"){
					name = "文本框-"+aDomParamArray[i].data.sourceField;
				}else if(domType === "select"){
					name = "下拉框-"+aDomParamArray[i].data.sourceField;
				}else if(domType === "tree"){
					name = "树-"+aDomParamArray[i].data.sourceField;
				}else if(domType === "tags"){
					name = "标签输入框-"+aDomParamArray[i].data.sourceField;
				}else if(domType === "rich"){
					name = "富文本-"+aDomParamArray[i].data.sourceField;
				}
				aFieldList.push({"id":aDomParamArray[i].data.sourceField,"name":name});
			}
		}
		return aFieldList;
	};
	
	// 组织某一个字段下的默认数据
	// 在这里会根据用户下所有字段名，组织成数组
	var dealtDefaultDataByField = function(field, fun){
		//创建过滤条件对象
		var filter = new Object();
		//article对象的id属性值
		
		//创建发送请求数据的对象
		var requestData = new Object();
		requestData.filter = filter;
		//要查询的字段
		requestData.fields = field;
		$.ajax({
			type : "post",
			url : "../DataAction",
			data : {
				"object" : objectName,
				"method" : "queryObj",
				"parameter" : $.toJSON(requestData)
			},
			dataType : "json",
			asyn : true,
			success : function(data) {
				var defaultData = [];
				if(data.rows.length>0){
					$.each(data.rows, function(k, v){
						defaultData.push({"id":v[field],"name":v[field]});
					});
				}
				var callback = fun?fun.callback:null;  // 获取参数对象中的回调方法
			    if($.isFunction(fun.callback)){  // 如果有回调方法
			        callback(defaultData);  // 返回一个计算后的数据，方便回调方法使用它
			    }
			}
		});
		
	};
	
	// 根据树关联字段获取此字段下面的所有数据，组成默认数据列表供用户选择
	var dealtDefaultDataByTreeField = function(objectName, relevanceTree, fun){
		//创建过滤条件对象
		var filter = new Object();
		//article对象的id属性值
		
		//创建发送请求数据的对象
		var requestData = new Object();
		requestData.filter = filter;
		//要查询的字段
		requestData.fields = relevanceTree;
		$.ajax({
			type : "post",
			url : "../DataAction",
			data : {
				"object" : objectName,
				"method" : "queryObj",
				"parameter" : $.toJSON(requestData)
			},
			dataType : "json",
			asyn : true,
			success : function(data) {
				var defaultData = [];
				if(data.rows.length>0){
					$.each(data.rows, function(k, v){
						defaultData.push({"id":v[relevanceTree],"name":v[relevanceTree]});
					});
				}
				var callback = fun?fun.callback:null;  // 获取参数对象中的回调方法
			    if($.isFunction(fun.callback)){  // 如果有回调方法
			        callback(defaultData);  // 返回一个计算后的数据，方便回调方法使用它
			    }
			}
		});
	};
	
	// 组织用户下面的可以关联的tree
	// domIndex   当前元素索引
	// relevanceTree 关联tree的key
	var dealtTreeFieldByUser = function(domIndex, relevanceTree, fun){
//		// 根据传递的字段参数请求它数据-ajax
//		var fieldData = [];
//		
//		//创建发送请求数据的对象
//		var requestData = new Object();
//		//创建过滤条件对象
//		var filter = new Object();
//		//article对象的id属性值
//		filter.role = "user";
//		filter.custom = "tree";
//		requestData.filter = filter;
//		//要查询的字段
//		requestData.fields = "name";
//		$.ajax({
//			type : "post",
//			url : "../DataAction",
//			data : {
//				"object" : "meta",
//				"method" : "queryObj",
//				"parameter" : $.toJSON(requestData)
//			},
//			dataType : "json",
//			asyn : false,
//			success : function(data) {
//				if(data.rows.length>0){
//					fieldData.push({"id":"-10","name":"不于树元素关联"});
//					$.each(data.rows, function(k, v){
//						fieldData.push({"id":v.name,"name":v.name});
//					});
//				}
//				
//				var callback = fun?fun.callback:null;  // 获取参数对象中的回调方法
//			    if($.isFunction(fun.callback)){  // 如果有回调方法
//			        callback(fieldData);  // 返回一个计算后的数据，方便回调方法使用它
//			    }
//			}
//		});
		
		var fieldData = [];
		$.ajax({
			type : "post",
		    url: "../DataAction",
		    data: {
		    	"object": "define",
		    	"method": "queryObjTree",
		    	"parameter":""
		    },
		    dataType:"json",
		    success: function(data) {
		    	if(data.rows.length>0){
					fieldData.push({"id":"-10","name":"不于树元素关联"});
					$.each(data.rows, function(k, v){
						fieldData.push({"id":v.obj_name+"--"+v.clo_name,"name":v.obj_name+"--"+v.clo_name});
					});
				}
					
				var callback = fun?fun.callback:null;  // 获取参数对象中的回调方法
			    if($.isFunction(fun.callback)){  // 如果有回调方法
			        callback(fieldData);  // 返回一个计算后的数据，方便回调方法使用它
			    }
		    }
		});
	};
	
	// 废弃 -- 组织联动元素的id数组
	// 在这里会向获取当前页面的tableId，并且生成select代码，返回生成select代码，供select和tree元素form配置中使用
	var dealtRelevanceDomData = function(){
		// 生成select代码
		var data = [];
		$.each($("#mainPage .d-table"), function(k, v){
			data.push({"id":"domindex"+$(v).attr("domindex"), "name":"关联元素"+$(v).attr("typeindex")});
		});
		
		return data;
	}; 
	
	// 废弃 -- 获取某一个联动元素的所有字段
	var dealtRelevanceFieldData = function(tableId){
		// 根据tableId去找到联动元素，并取到他的param信息
		var index = tableId.replace(/[^0-9]/ig,"");
		return self.getDomParamArray(index).data.sourceField;
	}; 
	
	/* 结束 */
	/****** 由于form中会用到已存在的数据源字段、联动元素等，所以上面的方法是单独获取的数据源字段等数据 ******/
	
	// 要变更按钮的“提交数据字段”参数
	// 不需要传参，是因为全局变量aDomParamArray中已经存在了修改后的所需要的参数了
	this.resetButtonSubmitField = function(){
		// 要找到页面上的每个元素
		var aFieldList = [];
		for(var i=0,length=aDomParamArray.length; i<length; i++){
			var domType = aDomParamArray[i].type;
			if(domType != "label" && domType != "table" && domType != "button"){
				var name = "";
				if(domType === "input"){
					name = "文本框-"+aDomParamArray[i].data.sourceField;
				}else if(domType === "select"){
					name = "下拉框-"+aDomParamArray[i].data.sourceField;
				}else if(domType === "tree"){
					name = "树-"+aDomParamArray[i].data.sourceField;
				}else if(domType === "tags"){
					name = "标签输入框-"+aDomParamArray[i].data.sourceField;
				}else if(domType === "rich"){
					name = "富文本-"+aDomParamArray[i].data.sourceField;
				}
				aFieldList.push({"id":aDomParamArray[i].data.sourceField,"name":name});
			}
		}
		
		// 找到当前所有的button，并且重新设置它的提交字段数据列表
		var forms = $("form.f-h[domtype='button']");
		$.each(forms, function(k, v){
			$(v).find("#submitField").multiSelect("resetData", aFieldList, "true");
		});
	};
	
	// 初始化元素的配置项
	// deptDom 为这个form所属于哪个元素
	this.initParamItem = function(deptDom){
		// 得到当前元素的配置参数
		form = $("#eleParam [deptdom='"+deptDom+"']");
		
		// 1.初始化参数form
		initParamForm();
		// 2.绑定数据源切换的按钮事件
		bindSourceChange(form);
		// 3.监听各个配置项的事件，如果内容发生改变，要去修改dom的样式和属性
	};
	
	// 初始化参数form
	var initParamForm = function(){
		$.each(form.find(".elem-param label[class!='check-box']").next(), function(k, v){
			// 初始化具体的参数配置项，并且紧接着绑定各自的切换事件
			initParamElem($(v));
		});
	};
	
	// 初始化参数配置的每一类型的元素，并且紧接着绑定各自的切换事件
	// paramItem 具体的参数配置
	var initParamElem = function(paramItem){
		switch(paramItem.attr("eType")){
			case "input":  // input
				// 先判断是不是可以提交的数据元素类型
				var formType = paramItem.parents("form").attr("domtype");
				if(formType != "label" && formType != "button" && formType != "table"){
					if(paramItem.attr("id") == "sourceField"){
						// 如果当前input是数据源字段的话，要变更按钮的“提交数据字段”参数
						// 不需要传值，是因为全局变量aDomParamArray中保存了
						self.resetButtonSubmitField();
					}
				}
				
				// 绑定配置项的事件
				bindParamElemEvent(paramItem, paramItem.attr("eType"));
				break;
			case "select":  // select
				paramItem.cssSelect();
				// 绑定配置项的事件
				bindParamElemEvent(paramItem, paramItem.attr("eType"));
				break;
			case "checkbox":  // checkbox
				// 绑定配置项的事件
				// 根据参数设定是否是选中状态
				if(paramItem.attr("selected")){ paramItem.find("input").click(); }
				bindParamElemEvent(paramItem, paramItem.attr("eType"));
				break;
			case "color":  // color
				paramItem.spectrum({
					color: paramItem.attr("color"),
			        allowEmpty: true,
			        clickoutFiresChange: true,
			        showInitial: true,
			        togglePaletteOnly: true,
			        showSelectionPalette: true,
			        cancelText: "取消",
			        chooseText: "确定",
			        clearText: "清除当前颜色",
			        noColorSelectedText: "没有选择的颜色",
			        showAlpha: true,
			        change: function(color) {
			        	// 设置元素HTML上的配置参数
						setDomHtmlParam(paramItem, paramItem.attr("eType"), color.toHexString());
			        }
				});
				break;
			case "mselect":  // 多选下拉列表
				var selected = jQuery.parseJSON(paramItem.attr("key"));
				var val = jQuery.parseJSON(paramItem.attr("value"));
				var check = paramItem.attr("isCheck");
				var edit = paramItem.attr("isEdit");
				if(val == null){ val = ""; }
				if(check == null){ check = "false"; }
				if(edit == null){ edit = "true"; }
				
				// 获取value的数据作为可选的字段列表
				paramItem.multiSelect({
					"width" : "100px",
					"height" : "60px",
					"selected" : selected,
					"edit" : edit,
					"check" : check,
					"data" : val
				});
				
				// 绑定配置项的事件
				bindParamElemEvent(paramItem, paramItem.attr("eType"));
				break;
			case "minput":  // 多选文本框列表
				var domType = paramItem.parents("form").attr("domtype");  // 获取dom元素的类型
				var val = jQuery.parseJSON(paramItem.attr("value"));
				paramItem.multiInput({
					"width" : "100px",
					"height" : "60px",
					"data" : val,
					"addData" : val[0],
					"addCB" : function(index){
						// 先判断dom是不是table
						if(domType == "table"){
							// 找到字段宽度的div, 并且调用其添加方法
							var sourceField = paramItem.parent("div").prev("div").find(".complex-input");
							sourceField.complexInput("addOption", null, null, {"id":"SLZD","name":"实例字段"}, false);
						}
					},
					"delCB" : function(index){
						if(domType == "table"){
							// 找到字段宽度的div, 并且调用其添加方法
							var sourceField = paramItem.parent("div").prev("div").find(".complex-input");
							$.each(sourceField.find(".input-option"), function(k, v){
								if($(v).find("input").attr("key") == "cInput"+index){
									var delHtml = $(v).find(".fa-remove")[0];
									sourceField.complexInput("delOption", null, delHtml, false);
								}
							});
						}
					}
				});
				
				// 绑定配置项的事件
				bindParamElemEvent(paramItem, paramItem.attr("eType"));
				break;
			case "cinput":  // 复杂的多选文本框列表
				var domType = paramItem.parents("form").attr("domtype");  // 获取dom元素的类型
				var val = jQuery.parseJSON(paramItem.attr("value"));
				paramItem.complexInput({
					"width" : "100px",
					"height" : "60px",
					"data" : val,
					"addData" : val[0],
					"addCB" : function(index){
						// 先判断dom是不是table
						if(domType == "table"){
							// 找到字段宽度的div, 并且调用其添加方法
							var fieldWidth = paramItem.parent("div").next("div").find(".multi-input");
							fieldWidth.multiInput("addOption", null, null, 150, false);
						}
					},
					"delCB" : function(index){
						if(domType == "table"){
							// 找到字段宽度的div, 并且调用其添加方法
							var fieldWidth = paramItem.parent("div").next("div").find(".multi-input");
							$.each(fieldWidth.find(".input-option"), function(k, v){
								if($(v).find("input").attr("key") == "mInput"+index){
									var delHtml = $(v).find(".fa-remove")[0];
									fieldWidth.multiInput("delOption", null, delHtml, false);
								}
							});
						}
					}
				});
				
				// 绑定配置项的事件
				bindParamElemEvent(paramItem, paramItem.attr("eType"));
				break;
			case "zyselect":  // 自定义的select
				var key = paramItem.attr("key");
				var val = jQuery.parseJSON(paramItem.attr("value"));
				if(val == null){ val = ""; }
				
				// 获取value的数据作为可选的字段列表
				paramItem.zySelect({
					"width" : "100px",
					"height" : "60px",
					"selected" : key,
					"data" : val
				});
				
				// 绑定配置项的事件
				bindParamElemEvent(paramItem, paramItem.attr("eType"));
				break;
			default:
				console.info("未知类型元素创建");
		}
	};
	
	// 绑定配置项的事件
	var bindParamElemEvent = function(paramItem, type){
		switch(type){
			case "input":  // input
				// 绑定数据更改事件
				paramItem.bind("input propertychange", function(){
					// 设置元素HTML上的配置参数
					setDomHtmlParam(paramItem, type, paramItem.val());
			    });
				break;
			case "select":  // select
				// 监听选项的点击事件
				paramItem.prev("div[etype='select']").find(".optionBox").bind("click", function(){
//					// 如果这个select切换时要和其他元素关联   隐藏显示，在此判断并操作
//					if(paramItem.prev("div[etype='select'][mapmulti='true']").length>0){
//						console.info("1111");
//						// 获得到当前字段，向后台请求这个字段下面的所有数据，并且添加到多选框中
//						var selectField = $(this).attr("value");
//						
//						// 请求过程***********************
//						var fieldData = [
//						                 {"id":"id1","name":"编号1"},
//						                 {"id":"name1","name":"名称1"},
//						                 {"id":"age1","name":"年龄1"}
//						                 ];
//						// 清空多选框的数据，并且添加新的数据，并且让数据处于选中状态
//						var multiSelectId = paramItem.attr("mapmultiId");
//						form.find("#"+multiSelectId+"[etype='mselect']").multiSelect("resetData", fieldData, "true");
//					}
//					
//					// 如果这个select是切换关联元素时候需要获取这个关联元素的所有字段
//					if(paramItem.prev("div[etype='select'][mapField='true']").length>0){
//						var defaultList = [];
//						var form = paramItem.parents("form");
//						
//						// 获得到当前字段，向后台请求这个字段下面的所有数据，并且添加到多选框中
//						var relevanceTree = $(this).attr("value");
//						if(relevanceTree == "-10"){  // 不关联tree
//							// 隐藏mselect，显示cinput
//							form.find("div[htype='div']").hide();
//							form.find("div[htype='p']").show();
//							// 设置元素HTML上的配置参数
//							defaultList = form.find("div[htype='p'] #"+paramItem.attr("maprelevanceid")+"").complexInput("callbackData");
//							setDomHtmlParam(
//									form.find("div[htype='p'] #"+paramItem.attr("maprelevanceid")+""), 
//									form.find("div[htype='p'] #"+paramItem.attr("maprelevanceid")+"").attr("etype"), 
//									defaultList
//							);
//						}else{  // 关联tree
//							// 根据tree字段获取数据
//							defaultList = dealtDefaultDataByTreeField(relevanceTree);
//							// 重新设置默认值
//							form.find("div[htype='div'] #"+paramItem.attr("maprelevanceid")+"").multiSelect("resetData", defaultList, "true");
//							// 隐藏cinput，显示mselect
//							form.find("div[htype='p']").hide();
//							form.find("div[htype='div']").show();
//							
//							// 设置元素HTML上的配置参数
//							setDomHtmlParam(
//									form.find("div[htype='div'] #"+paramItem.attr("maprelevanceid")+""), 
//									form.find("div[htype='div'] #"+paramItem.attr("maprelevanceid")+"").attr("etype"), 
//									defaultList
//							);
//						}
//					}
					
					// 设置元素HTML上的配置参数
					setDomHtmlParam(paramItem, type, $(this).attr("value"));
				});
				break;
			case "checkbox":  // checkbox
				// 绑定点击事件
				$(paramItem).find("input").click(function(){ 
			        setDomHtmlParam(paramItem, type, $(this).is(":checked"));
			    });   
				break;
			case "color":  // color
				break;
			case "mselect":  // 多选下拉列表
				// 触发数据变化事件
				paramItem.bind("dataChange", function(){
					// 设置元素HTML上的配置参数
					setDomHtmlParam(paramItem, type, paramItem.multiSelect("callbackData"));
				});
				break;
			case "minput":  // 多选文本框列表
				// 触发数据变化事件
				paramItem.bind("dataChange", function(){
					// 设置元素HTML上的配置参数
					setDomHtmlParam(paramItem, type, paramItem.multiInput("callbackData"));
				});
				break;
			case "cinput":  // 复杂的多选文本框列表
				// 触发数据变化事件
				paramItem.bind("dataChange", function(){
					// 设置元素HTML上的配置参数
					setDomHtmlParam(paramItem, type, paramItem.complexInput("callbackData"));
				});
				break;
			case "zyselect":  // 自定义的select
				// 触发数据变化事件
				paramItem.bind("dataChange", function(){
					
					// 如果是关联字段那个属性，就要从数组中获取选中的那个key
					if(paramItem.attr("id") == "relevanceTree"){
						setDomHtmlParam(paramItem, type, paramItem.zySelect("callbackData")[0].id);
					}else{
						// 设置元素HTML上的配置参数
						setDomHtmlParam(paramItem, type, paramItem.zySelect("callbackData"));
					}
					
					
					// 如果这个select是切换关联元素时候需要获取这个关联元素的所有字段
					if(paramItem.attr("id") == "relevanceTree"){
						var defaultList = [];
						var form = paramItem.parents("form");
						
						// 获得到当前字段，向后台请求这个字段下面的所有数据，并且添加到多选框中
						var relevanceTree = paramItem.zySelect("callbackData")[0].id;
						if(relevanceTree == "-10"){  // 不关联tree
							// 隐藏mselect，显示cinput
							form.find("div[htype='div']").hide();
							form.find("div[htype='p']").show();
							// 设置元素HTML上的配置参数
							defaultList = form.find("div[htype='p'] #"+paramItem.attr("maprelevanceid")+"").complexInput("callbackData");
							setDomHtmlParam(
									form.find("div[htype='p'] #"+paramItem.attr("maprelevanceid")+""), 
									form.find("div[htype='p'] #"+paramItem.attr("maprelevanceid")+"").attr("etype"), 
									defaultList
							);
						}else{  // 关联tree
							var objectName = paramItem.zySelect("callbackData")[0].id.split("--")[0];
							relevanceTree = paramItem.zySelect("callbackData")[0].id.split("--")[1];
							// 根据   树关联字段   获取此字段下面的所有数据，组成默认数据列表供用户选择
							dealtDefaultDataByTreeField(objectName, relevanceTree, {callback:function(cbdata){
								setTimeout(function(){
									defaultList = cbdata;
									// 重新设置默认值
									form.find("div[htype='div'] #"+paramItem.attr("maprelevanceid")+"").multiSelect("resetData", defaultList, "true");
									// 隐藏cinput，显示mselect
									form.find("div[htype='p']").hide();
									form.find("div[htype='div']").show();
									
									// 设置元素HTML上的配置参数
									setDomHtmlParam(
											form.find("div[htype='div'] #"+paramItem.attr("maprelevanceid")+""), 
											form.find("div[htype='div'] #"+paramItem.attr("maprelevanceid")+"").attr("etype"), 
											defaultList
									);
								},0);
							}});
						}
					}
				});
				break;
			default:
				console.info("未知类型元素创建");
		}
	};
	
	// 设置元素HTML上的配置参数
	// paramItem 当前配置项  type 当前配置项的类型  value 当前配置项的值
	var setDomHtmlParam = function(paramItem, type, value){
		var domIndex = paramItem.parents("form").attr("deptDomIndex");
		var dom = $(".d-dom[domIndex='"+domIndex+"']");
		var classify = paramItem.attr("classify");
		// 设置dom的元素属性
    	switch(type){
			case "input":  // input
				// 设置全局变量中当前修改的值
				self.editDomParamArray(domIndex, classify, paramItem.attr("id"), value);
				
				// 设置完全局变量的值之后，去修改button的提交数据字段的内容
				// 先判断是不是可以提交的数据元素类型
				var formType = paramItem.parents("form").attr("domtype");
				if(formType != "label" && formType != "button" && formType != "table"){
					if(paramItem.attr("id") == "sourceField"){
						// 如果当前input是数据源字段的话，要变更按钮的“提交数据字段”参数
						// 不需要传值，是因为全局变量aDomParamArray中保存了
						self.resetButtonSubmitField();
					}
				}
				break;
			case "select":  // select
				var fieldId = paramItem.attr("id").split("_")[0];
				self.editDomParamArray(domIndex, classify, fieldId, value);
				break;
			case "checkbox":  // checkbox
				self.editDomParamArray(domIndex, classify, paramItem.attr("id"), value);
				break;
			case "color":  // color
				self.editDomParamArray(domIndex, classify, paramItem.attr("id"), value);
				break;
			case "mselect":  // 多选下拉列表
				self.editDomParamArray(domIndex, classify, paramItem.attr("id"), value);
				break;
			case "minput":  // 多选文本框列表
				self.editDomParamArray(domIndex, classify, paramItem.attr("id"), value);
				break;
			case "cinput":  // 复杂的多选文本框列表
				self.editDomParamArray(domIndex, classify, paramItem.attr("id"), value);
				break;
			case "zyselect":  // 自定义的select
				self.editDomParamArray(domIndex, classify, paramItem.attr("id"), value);
				break;
			default:
				console.info("未知类型元素创建");
		}
    	
    	// 根据配置项类型来设置attr和style和function
    	if(classify == "data"){
    		// 设置元素的内容
    		self.setDomAttrParam(dom, paramItem.attr("id").split("_")[0], value);
    	}else if(classify == "style"){
    		// 设置元素的样式
    		self.setDomStyleParam(dom, paramItem.attr("id").split("_")[0], value);
    	}else if(classify == "function"){
    		// 设置元素的功能
    		self.setDomFunctionParam(dom, paramItem.attr("id").split("_")[0], value);
    	}
	};
	
	// 设置元素的内容
	// dom 拖拽的元素  fieldId 拖拽元素的字段id  value 配置项的值
	this.setDomAttrParam = function(dom, fieldId, value){
		var type = dom.attr("ptype");
		// 根据类型，分别进行不同属性的设置
		switch(type){
			case "label":  // label
				if(fieldId == "content"){
					// 取数据配置中的contet参数的值设置label的text
					dom.find("[class^='ele-']").html(value);
				}
				break;
			case "input":  // input
				if(fieldId == "content"){
					// 取数据配置中的contet参数的值设置input的提示信息
					dom.find("[class^='ele-']").attr("placeholder", value);
				}
				break;
			case "button":  // button
				if(fieldId == "content"){
					// 取数据配置中的contet参数的值设置input的提示信息
					dom.find("[class^='ele-']").html(value);
				}
				break;
			case "select":  // select
				if(fieldId == "defaultData"){
					// 1.生成最基本的元素对象
					var domHtml = '';
					domHtml +=    '<select class="cd-select ele-select">';
					domHtml +=    '    <option value="-1" selected>全部</option>';
					// 获取配置中的option默认值
					$.each(value, function(k, v){
						domHtml +=    '<option value="'+k+1+'" class="">'+v.name+'</option>';
					});
					domHtml +=    '</select>';
					
					// 2.删除原来的select组件
					dom.find(".d-content").empty().append(domHtml);
					
					// 3.重新创建
					dom.find(".cd-select").dropdown({
						gutter : 5,
						stack : false,
						slidingIn : 100
					});
				}
				break;
			case "tree":    // tree
				if(fieldId == "defaultData"){
					var form = $("form[deptdomindex='"+dom.attr("domindex")+"']");
					var log, className = "dark";
					function showRemoveBtn(treeId, treeNode) {
						// 应该获取checkbox是否选中
						var editValue = form.find("#del>input").is(":checked");
						if(editValue){
							if((treeNode.tId+"").split("_")[1]=="1"){  // 根节点不可以删除
								return false;
							}else{
								return true;
							}
						}
					}
					function showRenameBtn(treeId, treeNode) {
						// 应该获取checkbox是否选中
						var delValue = form.find("#edit>input").is(":checked");
						if(delValue){
							if((treeNode.tId+"").split("_")[1]=="1"){  // 根节点不可以编辑
								return false;
							}else{
								return true;
							}
						}
					}

					var newCount = 1;
					function addHoverDom(treeId, treeNode) {
						// 应该获取checkbox是否选中
						var delValue = form.find("#add>input").is(":checked");
						if(delValue){
							var sObj = $("#" + treeNode.tId + "_span");
							if((treeNode.tId+"").split("_")[1]=="1"){  // 根节点可以新增
								if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
								var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
									+ "' title='add node' onfocus='this.blur();'></span>";
								sObj.after(addStr);
							}else{  // 叶子节点不可以新增
								
							}
						}
					};
					function removeHoverDom(treeId, treeNode) {
						$("#addBtn_"+treeNode.tId).unbind().remove();
					};
					
					var setting = {
						view: {
							addHoverDom: addHoverDom,
							removeHoverDom: removeHoverDom,
							selectedMulti: false
						},
						edit: {
							enable: true,
							editNameSelectAll: true,
							showRemoveBtn: showRemoveBtn,
							showRenameBtn: showRenameBtn
						},
						data: {
							simpleData: {
								enable: true
							}
						}
					};
					
					var treeData = [{ id:1, pId:0, name:"根节点", open:true}];
					
					$.each(value, function(k, v){
						treeData.push({id:parseInt("1"+(k+1)), pId:1, name:v.name});
					});
					$.fn.zTree.init(dom.find(".ztree"), setting, treeData);
				}
				break;
			case "table":   // table
				// 找到此元素相对应的form，再找到它的数据源字段和数据源宽度字段
				var tableForm = $("form[deptdom='domindex"+dom.attr("domindex")+"']");
				// 要组织出table的源字段和宽度的数据
				var fieldData = tableForm.find("#sourceField").complexInput("callbackData");
				var widthData = tableForm.find("#fieldWidth").multiInput("callbackData");
				var tableFieldData = [];
				if(fieldData.length == widthData.length){
					$.each(fieldData, function(k, v){
						tableFieldData.push({
							"id" : v.id, "name" : v.name, "width" : parseInt(widthData[k].name)
						});
					});
					// 重新设置table元素的字段
					dom.find(".table").table("resetSourceField", tableFieldData);
				}
				break;
			case "tags":    // tags
				if(fieldId == "defaultData"){
					// 1.生成最基本的元素对象
					var domHtml = '<input type="hidden" class="select2 ele-tags" value=""></input>';
					
					// 2.删除原来的select组件
					dom.find(".d-content").empty().append(domHtml);
					
					// 3.处理默认数据
					var tagsDefaultField = [];
					$.each(value, function(k, v){
						tagsDefaultField.push(v.name);
					});
					
					// 4.重新创建
					dom.find(".select2").select2({
						tags: tagsDefaultField
					});
				}
				break;
			case "rich":    // rich
				//console.info(dom);
				break;
			default:
				//console.info("未知类型元素设置默认参数");
		}
		
	};
	
	// 设置元素的功能
	// dom 拖拽的元素  fieldId 拖拽元素的字段id  value 配置项的值
	this.setDomFunctionParam = function(dom, fieldId, value){
		var type = dom.attr("ptype");
		// 根据类型，分别进行不同属性的设置
		switch(type){
			case "tree":    // tree
				var log, className = "dark";
				function showRemoveBtn(treeId, treeNode) {
					// 应该获取checkbox是否选中
					var delValue = form.find("#del>input").is(":checked");
					if(delValue){
						if((treeNode.tId+"").split("_")[1]=="1"){  // 根节点不可以删除
							return false;
						}else{
							return true;
						}
					}
				}
				function showRenameBtn(treeId, treeNode) {
					// 应该获取checkbox是否选中
					var editValue = form.find("#edit>input").is(":checked");
					console.info(editValue);
					if(editValue){
						if((treeNode.tId+"").split("_")[1]=="1"){  // 根节点不可以编辑
							return false;
						}else{
							return true;
						}
					}
				}

				var newCount = 1;
				function addHoverDom(treeId, treeNode) {
					// 应该获取checkbox是否选中
					var delValue = form.find("#add>input").is(":checked");
					if(delValue){
						var sObj = $("#" + treeNode.tId + "_span");
						if((treeNode.tId+"").split("_")[1]=="1"){  // 根节点可以新增
							if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
							var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
								+ "' title='add node' onfocus='this.blur();'></span>";
							sObj.after(addStr);
						}else{  // 叶子节点不可以新增
							
						}
					}
				};
				function removeHoverDom(treeId, treeNode) {
					$("#addBtn_"+treeNode.tId).unbind().remove();
				};
				
				var setting = {
					view: {
						addHoverDom: addHoverDom,
						removeHoverDom: removeHoverDom,
						selectedMulti: false
					},
					edit: {
						enable: true,
						editNameSelectAll: true,
						showRemoveBtn: showRemoveBtn,
						showRenameBtn: showRenameBtn
					},
					data: {
						simpleData: {
							enable: true
						}
					}
				};
				
				var treeData = [{ id:1, pId:0, name:"父节点", open:true}];
				var defData = [];
				var form = $("form[deptdomindex='"+dom.attr("domindex")+"']");
				//if(form.find("#defaultData[etype='mselect']").is(":hidden")){  // 如果mselect类型默认数据隐藏，去获取minput的数据
					defData = form.find("#defaultData[etype='minput']").multiInput("callbackData");
				//}else{  // 获取mselect的默认数据
				//	defData = form.find("#defaultData[etype='mselect']").multiSelect("callbackData");
				//}
				
				$.each(defData, function(k, v){
					treeData.push({id:parseInt("1"+(k+1)), pId:1, name:v.name});
				});
				$.fn.zTree.init(dom.find(".ztree"), setting, treeData);
				break;
			case "table":    // table
				var tableDom = dom.find(".table");
				if(fieldId == "check" ) { tableDom.table("resetAllField",value); }
				if(fieldId == "number") { tableDom.table("resetNumberField",value); }
				if(fieldId == "edit"  ) { tableDom.table("resetEditField",value); }
				if(fieldId == "del"   ) { tableDom.table("resetDelField",value); }
				if(fieldId == "allDel") { tableDom.table("resetAllDel",value); }
				if(fieldId == "filter") { tableDom.table("resetFilter",value); }
				if(fieldId == "paging") { tableDom.table("resetPaging",value); }
				break;
			default:
				//console.info("未知类型元素设置默认参数");
		}
	};
	
	// 设置元素的样式
	// dom 拖拽的元素  fieldId 拖拽元素的字段id  value 配置项的值
	this.setDomStyleParam = function(dom, fieldId, value){
		var type = dom.attr("ptype");
		// 处理悬浮等类型样式
		if(fieldId.indexOf(":") > -1){
			// 绑定hover等类型样式
			// 取冒号后面的伪类  分别绑定事件
			if(fieldId.split(":")[1] == "hover"){
				if(type=="select"){
					dom.find(".cd-dropdown>span").hover(function(){ 
						dom.find(".cd-dropdown>span").css(fieldId.split(":")[0], value);
					},function(){ 
						var param = self.getDomParamArray(dom.attr("domindex"));
						var val = param["style"][fieldId.split(":")[0]];
						dom.find(".cd-dropdown>span").css(fieldId.split(":")[0], val);
					});
				}else{
					dom.find("[class^='ele-']").hover(function(){ 
						dom.find("[class^='ele-']").css(fieldId.split(":")[0], value);
					},function(){ 
						var param = self.getDomParamArray(dom.attr("domindex"));
						var val = param["style"][fieldId.split(":")[0]];
						dom.find("[class^='ele-']").css(fieldId.split(":")[0], val);
					});
				}
			}else if(fieldId.split(":")[1] == "focus"){
				dom.find("[class^='ele-']").bind({ mousedown: function(e) {
					// 样式改变为点击时的样式
					dom.find("[class^='ele-']").css(fieldId.split(":")[0], value);
		        }, mouseup: function(e) {
	        		var param = self.getDomParamArray(dom.attr("domindex"));
	        		var val = param["style"][fieldId.split(":")[0]+":hover"];
	        		// 样式改变为悬浮时的样式
	        		if(val != undefined){
	        			dom.find("[class^='ele-']").css(fieldId.split(":")[0], val);
	        		}
		        } });
			}else if(fieldId.split(":")[1] == "active"){
				dom.find("[class^='ele-']").bind({ mousedown: function(e) {
					// 样式改变为点击时的样式
					dom.find("[class^='ele-']").css(fieldId.split(":")[0], value);
		        }, mouseup: function(e) {
		        	var param = self.getDomParamArray(dom.attr("domindex"));
		        	var val = param["style"][fieldId.split(":")[0]+":hover"];
		        	// 样式改变为悬浮时的样式
		        	if(val != undefined){
		        		dom.find("[class^='ele-']").css(fieldId.split(":")[0], val);
		        	}
		        } });
			}
		}else{
			// 由于有的组件设置样式存在差异性，在此做一下特殊处理
			switch(type){
				case "label":  // label
					dom.find("[class^='ele-']").css(fieldId, value);
					break;
				case "input":  // input
					dom.find("[class^='ele-']").css(fieldId, value);
					break;
				case "button":  // button
					dom.find("[class^='ele-']").css(fieldId, value);
					break;
				case "select":  // select
					dom.find(".cd-dropdown>span").css(fieldId, value);
					if(fieldId != "border-style" && fieldId != "border-width"){
						dom.find(".cd-dropdown li").css(fieldId, value);
					}
					break;
				case "tree":    // tree
					dom.find(".d-content span").css(fieldId, value);
					break;
				case "table":   // table
					
					break; 
				case "tags":    // tags
					if(fieldId == "font-size" || fieldId == "color" || fieldId == "letter-spacing" || fieldId == "font-family"){
						dom.find(".select2-search-choice div").css(fieldId, value);
					}else{
						dom.find(".select2-choices").css(fieldId, value);
						dom.find(".select2-search-choice").css(fieldId, value);
					}
					break;
				case "rich":    // rich
					
					break;
				default:
					//console.info("未知类型元素设置默认参数");
			}
		}
	};
	
	
	// 绑定数据源切换的按钮事件
	// form 当前元素的配置参数选项
	var bindSourceChange = function(form){
		var cflag = 0;
		// 给切换数据源选择方式的超链接绑定点击事件
		form.find(".elem-param p>a[fun='changeFieldChoose']").bind("click", function(e){
			if(cflag == 0){
				// 把p显示 ，div隐藏
				form.find(".elem-param [hType='p']").show();
				form.find(".elem-param [hType='div']").hide();
				cflag = 1;
				$(this).html("选择已有默认值");
				// input设置焦点
				form.find(".elem-param [hType='p'] input").focus();
				
				// 并且把保存按钮显示出来
//				form.find(".elem-param .verify-source-field").show();
			}else{
				// 把div显示 ，p隐藏
				form.find(".elem-param [hType='p']").hide();
				form.find(".elem-param [hType='div']").show();
				cflag = 0;
				$(this).html("新增新的默认值");
				
				// 并且把保存按钮隐藏
//				form.find(".elem-param .verify-source-field").hide();
			}
		});
		
		// 给保存新字段功能增加点击事件
		form.find(".elem-param p .verify-source-field").bind("click", function(e){
			var nowVerifyButton = this;  // 保存当前验证按钮，方便接下来寻找它的父form
			// 获取数据源字段
			var value = "";
			var formType = form.attr("domtype");
			if(formType != "table"){
				value = form.find("input#sourceField").val();
			}else if(formType == "table"){
				var tableValue = form.find("div#sourceField").complexInput("callbackData");
				$.each(tableValue, function(k, v){
					if(k==0){
						value = v.id;
					}else{
						value += ","+v.id;
					}
				});
			}
			
			
			// 验证字段-----------------------------
			// 创建过滤条件对象
			var requestData = new Object();
			//创建过滤条件对象
			var filter = new Object();
			filter.object = objectId;
			filter.name = value;
			requestData.filter = filter;
			// 要查询的字段
			requestData.fields = "name";
			$.ajax({
				type : "post",
				url : "../DataAction",
				data : {
					"object" : "meta",
					"method" : "queryObj",
					"parameter" : $.toJSON(requestData)
				},
				dataType : "json",
				asyn : false,
				success : function(data) {
					if(data.rows.length == 0){
						// 代表此字段可以不使用
						self.popupTip("源字段"+value+"不存在于"+objectName+"表中，请在表管理平台先进行配置！", "error");
					}else{
						if(formType == "table"){
							var tableList = [];
							var dataList  = [];
							// table需要验证哪个字段不存在于表中
							var tableValue = form.find("div#sourceField").complexInput("callbackData");
							$.each(tableValue, function(tk, tv){
								tableList.push(tv.id);
							});
							$.each(data.rows, function(dk, dv){
								dataList.push(dv.name);
							});
							
							var tableFlag = 0;
							for(var i=0; i<tableList.length; i++){
							    if(jQuery.inArray(tableList[i], dataList) == -1){
							    	tableFlag = 1;
							        self.popupTip("源字段"+tableList[i]+"不存在于"+objectName+"表中，请在表管理平台先进行配置！", "error");
							    }
							}
							if(tableFlag==0){
								// 字段都可以使用
								var fields = "";
								for(var i=0, length=data.rows.length; i<length; i++){
									if(i==0){
										fields = data.rows[i].name;
									}else{
										fields += ", "+data.rows[i].name;
									}
								}
								self.popupTip("源字段"+fields+"存在于"+objectName+"表中，可以使用！", "info");
							}
						}else if(formType == "tree"){
							self.popupTip("源字段"+value+"存在于"+objectName+"表中，可以使用！", "info");
							// tree需要验证成功后，如果这个字段之前有数据，就展示出来
							dealtDefaultDataByField(value,{callback:function(callbackData){  // 参数为一个object对象，其中key为callback的val是一个function方法，并且需要a1方法计算得到的值
							    // 获取得到的默认数据后，添加到minput中
							    $(nowVerifyButton).parents("form").find("#defaultData").multiInput("resetData", callbackData);
							}});
						}else{
							// 成功的提示
							self.popupTip("源字段"+value+"存在于"+objectName+"表中，可以使用！", "info");
						}
					}
				}
			});
		});
	}; 
	
	
	/****** 对页面上的元素集合全局变量操作的方法 ******/
	/* 开始 */
	
	// 向aDomParamArray变量添加一个元素的配置信息
	this.addDomParamArray = function(param){
		aDomParamArray.push(param);
	};
	
	// 修改aDomParamArray变量的元素的配置信息
	// domIndex 元素索引
	// classify 数据分类  例如：data、style
	// key      分类下数据的key  例如：content、sourceField、color
	// value    需要修改的值
	this.editDomParamArray = function(domIndex, classify, key, value){
		for(var i=0,length=aDomParamArray.length; i<length; i++){
			if(aDomParamArray[i].id === "domindex"+domIndex){
				// 设置新的数据
				aDomParamArray[i][classify][key] = value;
				break;
			}
		}
	};
	
	// 删除aDomParamArray变量的元素的配置信息
	this.delDomParamArray = function(domIndex){
		for(var i=0,length=aDomParamArray.length; i<length; i++){
			if(aDomParamArray[i].id === "domindex"+domIndex){
				aDomParamArray.splice(i,1);
				console.info("删除："+i);
				break;
			}
		}
	};
	
	// 得到aDomParamArray变量的元素的配置信息
	this.getDomParamArray = function(domIndex){
		var data = new Object();
		for(var i=0,length=aDomParamArray.length; i<length; i++){
			if(aDomParamArray[i].id === "domindex"+domIndex){
				data = aDomParamArray[i];
				break;
			}
		}
		return data;
	};
	
	/* 结束 */
	/****** 对页面上的元素集合全局变量操作的方法 ******/
	
	
	// 弹出提示框
	// msg 提示的信息
	// shortCutFunction 状态  info、error
	this.popupTip = function(msg, shortCutFunction){
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
	}
	
};











