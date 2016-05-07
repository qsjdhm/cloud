/*
 * page.js 后台管理平台的具体页面展示功能
 * by zhangyan 2015-07-01
 */

var Page = function(){
	
	var self = this;
	var ueList = [];  // 保存富文本的对象
	var pageAttribute = [];  // 保存页面的配置项
	
	// 这些标志着何其类型相关的js文件是否加载过了，如果家再过就设为tree，并且不需要重复加载
	var labelFlag = false;
	var inputFlag = false;
	var buttonFlag = false;
	var selectFlag = false;
	var treeFlag = false;
	var tagsFlag = false;
	var tableFlag = false;
	var richFlag = false;
	
	// 初始化
	this.init = function(){  
		// 根据id初始化页面配置
		self.initPageForId();
		self.bindEvent();
	};
	
	// 根据id初始化页面配置
	this.initPageForId = function(){
		// 从后台取出页面的配置
		var obj = {
				"fields" : "PAGE_ID,OBJECT_NAME,PAGE_NAME,PAGE_ATTRIBUTE,PAGE_PATH,FUNCTION_ID",
				//"filter" : { "FUNCTION_ID" : ""+functionId }
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
				// 把整个页面的配置保存到缓存中
				pageAttribute = data.rows[0].PAGE_ATTRIBUTE;
				$.each(pageAttribute, function(k, v){
					// 根据元素类型引入所需要的js文件
					self.importFileForType(v);
				});
			}
		});
	};
	
	// 根据元素类型引入所需要的js文件
	this.importFileForType = function(plug){
		switch(plug.type){
			case "label":  // label
				// 初始化label组件
				self.initLabelPlug(plug);
				break;
			case "input":  // input
				// 初始化input组件
				self.initInputPlug(plug);
				break;
			case "button":  // button
				// 加载创建button组件所需要的js文件
				require(['../plugs/zybutton/js/zyButton', 
				         'css!../plugs/zybutton/css/zyButton.css'], function(){
					// 初始化button组件
					self.initButtonPlug(plug);
        		});
				break;
			case "select":  // select
				// 加载创建select组件所需要的js文件
				require(['../plugs/select/js/modernizr.custom.63321', 
				         '../plugs/select/js/jquery.dropdown', 
				         'css!../plugs/select/css/style5.css'], function(){
					// 初始化select组件
					self.initSelectPlug(plug);
        		});
				break;
			case "tree":    // tree
				// 加载创建tree组件所需要的js文件
				require(['../plugs/zTree/js/jquery.ztree.core-3.5', 
				         '../plugs/zTree/js/jquery.ztree.exedit-3.5', 
				         'css!../plugs/zTree/css/zTreeStyle/zTreeStyle.css'], function(){
					// 初始化tree组件
					self.initTreePlug(plug);
        		});
				break;
			case "table":   // table
				// 加载创建table组件所需要的js文件
				require([
				         '../plugs/table/js/table', 
				         '../plugs/paging/js/jquery.pagination', 
				         //'css!../common/ui/bootstrap-ui/css/bootstrap.css',
				         'css!../plugs/checkbox/style.css',
				         //'css!css/zytable.css',
				         'css!../plugs/table/css/table.css',
//				         'css!../plugs/zyPopup/plug/DialogEffects/css/normalize.css',
//				         'css!../plugs/zyPopup/plug/DialogEffects/css/demo.css',
//				         'css!../plugs/zyPopup/plug/DialogEffects/css/dialog.css',
//				         'css!../plugs/zyPopup/plug/DialogEffects/css/dialog-sandra.css',
//				         'css!../plugs/zyPopup/css/zyPopup.css',
				         'css!../plugs/button/css/component.css',
				         'css!../plugs/color/spectrum.css'], function(){
					// 初始化table组件
					self.initTablePlug(plug);
        		});
				break;
			case "tags":    // tags
				// 加载创建tags组件所需要的js文件
				require(['../plugs/tagsInput/js/select2.min', 
				         'css!../plugs/tagsInput/css/select2_metro.css'], function(){
					// 初始化tags组件
					self.initTagsPlug(plug);
        		});
				break;
			case "rich":    // rich
				// 加载创建rich组件所需要的js文件
				require([
				         "plugs/ueditor1.6.1/ueditor.config", 
				         "plugs/ueditor1.6.1/ueditor.all"], function(){
					// 初始化rich组件
					self.initRichPlug(plug);
        		});
				break;
			default:
				console.info("未知类型元素");
		}
	};
	
	
	/************************ 根据页面配置初始化每个元素的组件 ************************/
	/* 开始 */
	
	// 初始化label组件
	this.initLabelPlug = function(plug){
		var label = $("<span class='ele-label'>"+plug.data.content+"</span>");
		label.css({
			"position" : "absolute",
			"top" : plug.position.top,
			"left" : plug.position.left,
			"width" : plug.position.width,
			"height" : plug.position.height,
			
			"color" : plug["style"]["color"],
			"font-family" : plug["style"]["font-family"],
			"font-size" : plug["style"]["font-size"],
			"letter-spacing" : plug["style"]["letter-spacing"],
			"line-height" : plug["style"]["line-height"],
			"margin" : plug["style"]["margin"],
			"padding" : plug["style"]["padding"],
			"text-align" : plug["style"]["text-align"]
		});
		$("#plugArea").append(label);
	};
	
	// 初始化input组件
	this.initInputPlug = function(plug){
		var input = $("<input id='"+plug.data.sourceField+"' class='ele-input' type='text' placeholder='"+plug.data.content+"' value=''></input>");
		input.css({
			"position" : "absolute",
			"top" : plug.position.top,
			"left" : plug.position.left,
			"width" : plug.position.width,
			"height" : plug.position.height,
			
			"border-color" : plug["style"]["border-color"],
			"border-color:hover" : "red!important",
			"border-style" : plug["style"]["border-style"],
			"border-width" : plug["style"]["border-width"],
			"color" : plug["style"]["color"],
			"font-family" : plug["style"]["font-family"],
			"font-size" : plug["style"]["font-size"],
			"letter-spacing" : plug["style"]["letter-spacing"],
			"line-height" : plug["style"]["line-height"],
			"margin" : plug["style"]["margin"],
			"padding" : plug["style"]["padding"],
			"text-align" : plug["style"]["text-align"]
		});
		
		// 绑定hover
		input.hover(function(){ 
			input.css("border-color", plug["style"]["border-color:hover"]);
		},function(){ 
			// 判断当前是不是focus状态
			if(input.attr("isFocus") != "1"){
				input.css("border-color", plug["style"]["border-color"]);
			}
		});
		
		// 绑定点击事件
		input.focus(function(){
			input.attr("isFocus","1");
			input.css("border-color", plug["style"]["border-color:focus"]);
		});
		input.blur(function(){
			input.attr("isFocus","0");
			input.css("border-color", plug["style"]["border-color"]);
		});
		
		$("#plugArea").append(input); 
	};
	
	// 初始化button组件
	this.initButtonPlug = function(plug){
		var button = $("<button class='ele-button btn btn-3 btn-3e'>"+plug.data.content+"</button>");
		
		var param = new Object();
		param["data"] = plug.data;
		param["position"] = plug.position;
		param["style"] = plug.style;
		button.zyButton({
			"param" : plug,
			"clickCB" : function(submitField, submitUse){
				var domList = [];
				// 组织出有类型的元素列表
				$.each(pageAttribute, function(pk, pv){
					if(     pv.type == "input"  || 
							pv.type == "select" || 
							pv.type == "tree"   || 
							pv.type == "tags"   || 
							pv.type == "rich"      ){
						
						$.each(submitField, function(sk, sv){
							if(pv.data.sourceField == sv.id){
								// 组织带有类型的元素列表
								domList.push({"id":sv.id, "type":pv.type, "name":sv.name});
								return false;
							}
						});
					}
				});
				
				// 根据元素类型获取不同元素的当前选中的值
				var data = self.getValueForType(domList);
				// button组件的保存功能方法
				self.savePageData(submitUse, data);
			}
		});
		
		$("#plugArea").append(button);
	};
	
	// 初始化select组件
	this.initSelectPlug = function(plug){
		var sourceField = plug.data.sourceField;
		var relevanceField = plug.data.relevanceTree;
		var defaultData = plug.data.defaultData;
		var width = plug.position.width;
		var height = plug.position.height;
		var top = plug.position.top;
		var left = plug.position.left;
		
		var selectHtml = '';
		selectHtml +=    '<div id="'+sourceField+'" style="position: absolute;top: '+top+'px;left: '+left+'px;width: '+width+'px;height: '+height+'px;">';
		selectHtml +=    '    <select id="'+sourceField+'" class="cd-select ele-select">';
		selectHtml +=    '        <option value="-1" selected>全部</option>';
		
		// 关联源字段
		if(relevanceField == "-10"){
			// 获取默认数据直接组织option
			$.each(defaultData, function(k, v){
				selectHtml += '    <option value="'+v.id+'" class="">'+v.name+'</option>';
			});
			selectHtml += '    </select>';
			selectHtml += '</div>';
			$("#plugArea").append(selectHtml);
			
			$("#"+sourceField+" select").dropdown({
				gutter : 5,
				stack : false,
				slidingIn : 100
			});
			// 设置select的宽高等样式
			self.setSelectStyle(plug);
		}else{
			var objectName = relevanceField.split("--")[0];
			var colName = relevanceField.split("--")[1];
			
			// 需要根据字段id向后台请求字段下的数据，再组织option
			//创建过滤条件对象
			var filter = new Object();
			//article对象的id属性值
			
			//创建发送请求数据的对象
			var requestData = new Object();
			requestData.filter = filter;
			//要查询的字段
			requestData.fields = colName;
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
							console.info(v);
							selectHtml += '<option value="'+v[colName]+'" class="">'+v[colName]+'</option>';
						});
					}
					selectHtml += '    </select>';
					selectHtml += '</div>';
					$("#plugArea").append(selectHtml);
					
					$("#"+sourceField+" select").dropdown({
						gutter : 5,
						stack : false,
						slidingIn : 100
					});
					
					// 设置select的宽高等样式
					self.setSelectStyle(plug);
				}
			});
		}
		
		
	};
	
	// 初始化tree组件
	this.initTreePlug = function(plug){
		var sourceField = plug.data.sourceField;
		var defaultData = [];
		var width = plug.position.width;
		var height = plug.position.height;
		var top = plug.position.top;
		var left = plug.position.left;
		
		// 1.先把容器添加到页面
		var treeHtml = '';
		treeHtml += '<div id="'+sourceField+'" style="position: absolute;top: '+top+'px;left: '+left+'px;width: '+width+'px;height: '+height+'px;">';
		treeHtml += '    <ul id="'+plug.id+'" class="ztree ele-tree"></ul>';
		treeHtml += '</div>';
		$("#plugArea").append(treeHtml); 
		
		// 从后台取出字段的类型信息
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
				var treeData = [{ id:1, pId:0, name:"父节点", open:true}];
				
				$.each(defaultData, function(k, v){
					treeData.push({id:parseInt("1"+(k+1)), pId:1, name:v.name});
				});
				$.fn.zTree.init($("#"+sourceField+" .ztree"), setting, treeData);

				
				// 3.设置tree的宽高等样式
				self.setTreeStyle(plug); 
			}
		});
		
		var log, className = "dark";
		function showRemoveBtn(treeId, treeNode) {
			var delValue = plug["function"]["del"];
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
			var delValue = plug["function"]["edit"];
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
			var delValue = plug["function"]["add"];
			if(delValue){
				var sObj = $("#" + treeNode.tId + "_span");
				if((treeNode.tId+"").split("_")[1]=="1"){  // 根节点可以新增
					var sObj = $("#" + treeNode.tId + "_span");
					if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
					var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
						+ "' title='新增节点' onfocus='this.blur();'></span>";
					sObj.after(addStr);
					var btn = $("#addBtn_"+treeNode.tId);
					if (btn) btn.bind("click", function(){
						var zTree = $.fn.zTree.getZTreeObj(plug.id);
						console.info(newCount);
						zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
						return false;
					});
					
				}else{  // 叶子节点不可以新增
					
				}
			}
		};
		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};
		
		function onRename(event, treeId, treeNode, isCancel) {
			console.info(treeNode);
			console.info(isCancel);
			console.info(treeNode.tId + ", " + treeNode.name);
		}
		function onRemove(event, treeId, treeNode) {
			console.info(treeNode.tId + ", " + treeNode.name);
		}
		
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
			,
			callback: {
				onRename: onRename,
				onRemove: onRemove
			}
		};
		
		
		
	};
	
	// 初始化table组件
	this.initTablePlug = function(plug){
		console.info(plug);
		var nowPageId = 1;
		var keyField = plug.data.keyField;
		var sourceField = plug.data.sourceField;
		var fieldStr = "";
		var fieldWidth = plug.data.fieldWidth;
		var width = plug.position.width;
		var height = plug.position.height;
		var top = plug.position.top;
		var left = plug.position.left;
		
		var tagsHtml = '<div id="'+plug.id+'" class="table" style="position: absolute;top: '+top+'px;left: '+left+'px;width: '+width+'px;height: '+height+'px;"></div>';
		$("#plugArea").append(tagsHtml); 
		
		// 根据字段获取数据，并且获取
		$.each(sourceField, function(k, v){
			if(k==0){
				fieldStr += v.id;
			}else{
				fieldStr += ","+v.id;
			}
		});
		
		
		var filter = new Object();
		var requestData = new Object();
		requestData.filter = filter;
		//要查询的字段
		requestData.fields = fieldStr;
		//要查询页数
		requestData.curentPage = 1;
		//要查询的每页的行数
		requestData.pageRow = 5;
		$.ajax({
			type : "post",
			url : "../DataAction",
			data : {
				"object" : objectName,
				"method" : "queryObjPage",
				"parameter" : $.toJSON(requestData)
			},
			dataType : "json",
			asyn : true,
			success : function(data) {
				var tableData = [];
				var count = data.rows.length*data.totalPage;
				if(data.rows.length>0){
					$.each(data.rows, function(k, v){
						// 组织table的字段中的数据
						tableData.push(v);
					});
				}
				// 组织字段配置信息
				var tableField = [];
				$.each(sourceField, function(k, v){
					tableField.push({"id":v.id, "name":v.name, "width":fieldWidth[k].name});
				});
				
				// 初始化table组件
				$("#"+plug.id).table({
					"width"      : width,
					"height"     : height,
					"field"      : tableField,
					"adaptive"   : false, // 数据源字段自适应宽度方式
					"popup"      : true,  // 是否显示弹出框
					"pattern"    : false, // 模式   true:字段方式获取数据   false:普通添加方式获取数据
					"example"    : false,  // 实例   当前创建的是否是model中的实例
					"objectName" : plug.objectName,    // 关联数据对象name
					"key"        : keyField,  // 主键列
					"url"        : "plugs",  // 富文本的url路径
					"check"      : plug["function"]["check"],  // 全选
					"number"     : plug["function"]["number"],  // 序号
					"edit"       : plug["function"]["edit"],  // 编辑
					"del"        : plug["function"]["del"],  // 删除
					"allDel"     : plug["function"]["allDel"],  // 全部删除
					"filter"     : plug["function"]["filter"],  // 过滤
					"paging"     : plug["function"]["paging"],  // 分页条
					"zebra"      : true,  // 斑马线
					"dataTotal"  : count, // 数据总个数
					"rowsPerPage": 5,     // 一页多少行数据
					"pagingComplete": function(nNowPage){  // 翻页的回调方法
						nowPageId = nNowPage+1;
						// 根据页数请求数据
						self.addTableDataByPage(plug, nNowPage+1, 5);
					},
					"delComplete": function(delData){  // 删除数据的回调方法
						// table组件的删除方法
						self.deleteTableData(delData, plug, nowPageId, 5);
					},
					"editComplete": function(editData){  // 编辑数据的回调方法
						// table组件的编辑保存方法
						self.saveTableEditData(editData, plug, nowPageId, 5);
					},
					"filterComplete": function(filterData){  // 过滤条件的回调方法
						// table组件的过滤方法
						self.filterTableData(filterData, plug, nowPageId, 5);
					}
				});
				
				// 将第一页的数据添加到table中
				//$("#"+plug.id).table("addData", tableData);
			}
		});
	};
	
	
	
	// 初始化tags组件
	this.initTagsPlug = function(plug){
		var sourceField = plug.data.sourceField;
		var relevanceField = plug.data.relevanceTree;
		var defaultData = [];
		var width = plug.position.width;
		var height = plug.position.height;
		var top = plug.position.top;
		var left = plug.position.left;
		
		// 关联源字段
		if(relevanceField == "-10"){
			$.each(plug.data.defaultData, function(k, v){
				defaultData.push(v.name);
			});
			
			var tagsHtml = '';
			tagsHtml += '<div id="'+sourceField+'" style="position: absolute;top: '+top+'px;left: '+left+'px;width: '+width+'px;height: '+height+'px;">';
			tagsHtml += '    <input type="hidden" class="select2 ele-tags" value=""></input>';
			tagsHtml += '</div>';
			$("#plugArea").append(tagsHtml); 
			
			$("#"+sourceField+" .select2").select2({
				tags: defaultData
			});
			
			// 设置tags的宽高等样式
			self.setTagsStyle(plug);
		}else{
			var objectName = relevanceField.split("--")[0];
			var colName = relevanceField.split("--")[1];
			
			// 需要根据字段id向后台请求字段下的数据，再组织option
			//创建过滤条件对象
			var filter = new Object();
			//article对象的id属性值
			
			//创建发送请求数据的对象
			var requestData = new Object();
			requestData.filter = filter;
			//要查询的字段
			requestData.fields = colName;
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
					if(data.rows.length>0){
						$.each(data.rows, function(k, v){
							defaultData.push(v[colName]);
						});
					}
					var tagsHtml = '';
					tagsHtml += '<div id="'+sourceField+'" style="position: absolute;top: '+top+'px;left: '+left+'px;width: '+width+'px;height: '+height+'px;">';
					tagsHtml += '    <input type="hidden" class="select2 ele-tags" value=""></input>';
					tagsHtml += '</div>';
					$("#plugArea").append(tagsHtml); 
					
					$("#"+sourceField+" .select2").select2({
						tags: defaultData
					});
					
					// 设置tags的宽高等样式
					self.setTagsStyle(plug);
				}
			});
		}
	};
	
	// 初始化rich组件
	this.initRichPlug = function(plug){
		var richId = plug.data.sourceField;
		var width = plug.position.width;
		var height = plug.position.height - plug.position.titleHeight;
		var top = plug.position.top;
		var left = plug.position.left;
		
		var rich = '';
		rich += '<div style="position: absolute;top: '+top+'px;left: '+left+'px;width: '+width+'px;">';
		rich += '    <script id="'+richId+'" name="content" type="text/plain"></script>';
		rich += '</div>';
		$("#plugArea").append(rich); 
		
		var ue = UE.getEditor(richId, {
			// 初始化参数
			initialFrameHeight: height,   // 高度默认值
			zIndex: 0,
			autoHeightEnabled: false,  // 不自动增高
			initialStyle: 'p{line-height:1em}',
			enableAutoSave: false,     // 不自动保存
			autoFloatEnabled: false,    // 工具栏不悬浮
			toolbars: [[
			              'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'blockquote', 'pasteplain', '|', 
			              'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'cleardoc', '|',
			              'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
			              'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|', 'indent', '|',
			              'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
			              'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
			              'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'attachment', 'map', 'insertframe', 'insertcode', 'pagebreak', 'background', '|',
			              'horizontal', 'date', 'time', 'spechars', '|',
			              'inserttable', 'deletetable'
			          ]]
		});
		
		// 把当前富文本的对象保存到集合中
		ueList.push({"id":richId, "ue":ue});
	};
	
	// 设置select的宽高等样式
	this.setSelectStyle = function(plug){
		var sourceField = plug.data.sourceField;
		var $span = $("#"+sourceField).find(".cd-dropdown > span");
		var $li = $("#"+sourceField).find("li");
		var $fli = $("#"+sourceField).find("li:first");
		var width = plug.position.width;
		var height = plug.position.height;
		var style = plug.style;
		
		// 设置宽高
		$li.width(width);
    	
		$span.css({
    		"height":height+"px",  // dom的高度在减去title的高度
    		"line-height":height+"px"
    	});
		$("#"+sourceField).find(".cd-dropdown ul li span").css("line-height",height+"px");
    	// 设置li的top值
    	$.each($li, function(lik,liv){
    		// 由于每个li的top都是上一个的二倍，所以都乘以当前位数
    		$(liv).css("top",(height+5)*(lik+1)+"px");
    	});
    	if($li.length>0){
    		$("#"+sourceField).find("ul").height(($li.length+1) * $fli.height());
    	}
    	
    	// 设置样式
    	$span.css({
    		"font-size" : style["font-size"],
    		"color" : style["color"],
    		"letter-spacing" : style["letter-spacing"],
    		"font-family" : style["font-family"],
    		"text-align" : style["text-align"],
    		"padding" : style["padding"],
    		"border-width" : style["border-width"],
    		"border-style" : style["border-style"],
    		"border-color" : style["border-color"]
    	});
    	
    	$li.find("span").css({
    		"font-size" : style["font-size"],
    		"color" : style["color"],
    		"letter-spacing" : style["letter-spacing"],
    		"font-family" : style["font-family"],
    		"text-align" : style["text-align"]
    	});
    	
    	// 绑定hover
    	$span.hover(function(){ 
    		$span.css("border-color", plug["style"]["border-color:hover"]);
		},function(){ 
			$span.css("border-color", plug["style"]["border-color"]);
		});
    	
	};
	
	// 设置tags的宽高等样式
	this.setTagsStyle = function(plug){
		console.info(plug);
		var sourceField = plug.data.sourceField;
		var width = plug.position.width;
		var height = plug.position.height;
		var style = plug.style;
		var $tags = $("#"+sourceField+" .select2-container");
		var $ul = $("#"+sourceField+" .select2-choices");
		var $li =  $("#"+sourceField+" .select2-search-choice");
		var $fieldli = $("#"+sourceField+" .select2-search-field");
		
		// 1.先设置select2-container的行高
    	$tags.css({
    		"line-height" : height+"px",
    		"min-height" : height+"px"
    	});
    	$ul.css({
    		"line-height" : height+"px",
    		"min-height" : height+"px",
    		"border-color" : style["border-color"]
    	});
    	$li.css({
    		"line-height" : height+"px",
    		"height" : height+"px"
    	});
    	$fieldli.css({
    		"line-height" : height+"px",
    		"height" : height+"px"
    	});
	};
	
	// 设置tree的宽高等样式
	this.setTreeStyle = function(plug){
		var sourceField = plug.data.sourceField;
		var style = plug.style;
		
		$("#"+sourceField+" a.level0 span").css({
    		"color" : style["color"],
    		"font-family" : style["font-family"],
    		"font-size" : style["font-size"]+"px",
    		"letter-spacing" : style["letter-spacing"]+"px"
    	});
		
		$("#"+sourceField+" a.level1 span").css({
    		"color" : style["color"],
    		"font-family" : style["font-family"],
    		"font-size" : style["font-size"]+"px",
    		"letter-spacing" : style["letter-spacing"]+"px"
    	});
	};
	
	
	/* 结束 */
	/************************ 根据页面配置初始化每个元素的组件 ************************/
	
	
	
	/********************** 组件的响应事件, 主要是button、table *********************/
	/* 开始 */
	
	// 根据元素类型获取不同元素的当前选中的值
	this.getValueForType = function(domList, submitUse){
		var fieldDataList = [];  // 页面的字段数据
		$.each(domList, function(k, v){
			switch(v.type){
				case "input":  // input
					// 获取input类型元素的数据
					var data = $("#"+v.id).val();
					//fieldData[v.id] = data;
					fieldDataList.push({"field":v.id, "value":data, "type":"input"});
					break;
				case "select":  // select
					// 获取select类型元素的数据
					var data = "";
					if($("#"+v.id+" .cd-dropdown>span>span").length == 0){
						data = $("#"+v.id+" .cd-dropdown>span").html();
					}else{
						data = $("#"+v.id+" .cd-dropdown>span>span").html();
					}
					//fieldData[v.id] = data;
					fieldDataList.push({"field":v.id, "value":data, "type":"select"});
					break;
				case "tree":    // tree
					// 获取tree类型元素的数据
					var data = "";
					var treeId = $("#"+v.id+" ul").attr("id");
					var treeObj = $.fn.zTree.getZTreeObj(treeId);
					var nodes = treeObj.getNodes();
					var treeList = [];
					$.each(nodes[0].children, function(nk, nv){
						fieldDataList.push({"field":v.id, "value":nv.name, "type":"tree"});
					});
					break;
				case "tags":    // tags
					// 获取tags类型元素的数据
					var data = "";
					$.each($("#"+v.id+" .select2-search-choice"), function(tk, tv){
						if(tk==0){
							data += $(tv).find("div").html();
						}else{
							data += ","+$(tv).find("div").html();
						}
					});
					
					//fieldData[v.id] = data;
					fieldDataList.push({"field":v.id, "value":data, "type":"tags"});
					break;
				case "rich":    // rich
					// 获取rich类型元素的数据
					var data = "";
					$.each(ueList, function(uk, uv){
						if(uv.id == v.id){
							data = uv.ue.getContent();
						}
					});
					//fieldData[v.id] = data;
					fieldDataList.push({"field":v.id, "value":data, "type":"rich"});
					break;
				default:
					//console.info("未知类型元素设置默认参数");
			}
		});
		
		return fieldDataList;
	};
	
	
	// button组件的保存功能方法
	this.savePageData = function(submitUse, data){
		var treeData = [];  // 用来保存tree的数据，因为需要单独保存
		var otherData = []; // 用来保存除了tree之外类型的数据
		
		var otherItem = new Object();
		var treeFlag = 0;
		var otherFlag = 0;
		// 1.将tree类型和其他类型数据分开
		$.each(data, function(key, val){
			if(val.type == "tree"){
				var treeItem = new Object();
				treeItem[val.field] = val.value;
				treeData.push(treeItem);
				treeFlag = 1;
			}else{
				otherItem[val.field] = val.value;
				otherFlag = 1;
			}
		});
		
		otherData.push(otherItem);
		
		// 2.保存tree类型数据  tree类型的数据不管用途全部删除后新增
		if(treeFlag==1){
			self.addTreeData(treeData);
		}
		
		// 3.根据用途处理其他类型的数据  add or edit
		if(otherFlag==1){
			if(submitUse == "add"){
				self.addOtherData(otherData);
			}else{
				self.updateOtherData(otherData);
			}
		}
	};
	
	// 新增tree的数据
	this.addTreeData = function(data){
		console.info(data);
		// 创建发送请求数据的对象
		var requestData = new Object();
		// 声明数组
		requestData.rows = data;
		//创建过滤条件对象
		var filter = new Object();
		requestData.filter = filter;

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
		    		self.popupTip("保存数据成功！", "info");
		    	}else{
		    		self.popupTip("保存数据失败！", "error");
		    	}
		    }
		});
	};
	
	// 新增其他类型数据
	this.addOtherData = function(data){
		// 创建发送请求数据的对象
		var requestData = new Object();
		// 声明数组
		requestData.rows = data;

		$.ajax({
			type : "post",
			url : "../DataAction",
			data : {
		    	"object" : objectName,
		    	"method" : "add",
		    	"parameter" :$.toJSON(requestData)
		    },
		    dataType :"json",
		    success : function(data) {
		    	console.info(data);
		    	if(data.code=="1"){
		    		self.popupTip("新增数据成功！", "info");
		    	}else{
		    		self.popupTip("新增数据失败！", "error");
		    	}
		    }
		});
	};
	
	// 更新其他类型数据
	this.updateOtherData = function(){
		
	};
	
	
	// table组件的分页添加数据方法
	this.addTableDataByPage = function(plug, nowPageId, pageRow){
		var keyField = plug.data.keyField;
		var sourceField = plug.data.sourceField;
		var fieldStr = "";
		
		// 根据字段获取数据，并且获取
		$.each(sourceField, function(k, v){
			if(k==0){
				fieldStr += v.id;
			}else{
				fieldStr += ","+v.id;
			}
		});
		
		var filter = new Object();
		var requestData = new Object();
		requestData.filter = filter;
		//要查询的字段
		requestData.fields = fieldStr;
		//要查询页数
		requestData.curentPage = nowPageId;
		//要查询的每页的行数
		requestData.pageRow = pageRow;
		$.ajax({
			type : "post",
			url : "../DataAction",
			data : {
				"object" : objectName,
				"method" : "queryObjPage",
				"parameter" : $.toJSON(requestData)
			},
			dataType : "json",
			asyn : true,
			success : function(data) {
				var tableData = [];
				var count = data.rows.length;
				if(data.rows.length>0){
					$.each(data.rows, function(k, v){
						// 组织table的字段中的数据
						tableData.push(v);
					});
					$("#"+plug.id).table("addData", tableData);
				}
			}
		});
	};
	
	// table组件的编辑保存方法
	this.saveTableEditData = function(editData, plug, nowPageId, pageRow){
		// 创建发送请求数据的对象
		var requestData = new Object();
		// 声明数组
		requestData.rows = [];
		// 创建过滤条件对象
		var filter = new Object();
		// 主键
		// 遍历数据，取出当前行修改之前的主键下的字段
		var keyData = "";
		$.each(editData.beforeData, function(key, val){
			if(val.field == editData.key){
				keyData = val.value;
			}
		});
		filter[editData.key] = keyData;
		requestData.filter = filter;

		// 更新的数据
		var updataData = new Object(); 
		$.each(editData.editData, function(key, val){
			updataData[val.field] = val.value;
			requestData.rows.push(updataData);
		});
		
		$.ajax({
			type : "post",
			url : "../DataAction",
		    data: {
		          "object": objectName,
		          "method": "save",
		          "parameter":$.toJSON(requestData)
		    },
		    dataType:"json",
		    success: function(data) {
		    	console.info(data);
		    	if(data.code=="1"){
		    		self.popupTip("编辑成功！", "info");
		    	}else{
		    		self.popupTip("编辑失败！", "error");
		    	}
		    	
		    	// 根据页数请求数据
				self.addTableDataByPage(plug, nowPageId, pageRow);
		    }
		});
	};
	
	// table组件的删除方法
	this.deleteTableData = function(keyList, plug, nowPageId, pageRow){
		
		//创建发送请求数据的对象
		var requestData = new Object();
		//创建过滤条件对象
		var filter = new Object();
		//article对象的id属性值
		filter[keyList.key] = keyList.delList;

		requestData.filter = filter;
		
		$.ajax({
			type : "post",
			url : "../DataAction",
		    data: {
		          "object": objectName,
		          "method": "delete",
		          "parameter":$.toJSON(requestData)
		    },
		    dataType:"json",
		    success: function(data) {
		    	console.info(data);
		    	if(data.code=="1"){
		    		self.popupTip("删除成功！", "info");
		    	}else{
		    		self.popupTip("删除失败！", "error");
		    	}
		    	// 根据页数请求数据
				self.addTableDataByPage(plug, nowPageId, pageRow);
		    }
		});
	};
	
	// table组件的过滤方法
	this.filterTableData = function(filterData, plug, nowPageId, pageRow){
		var keyField = plug.data.keyField;
		var sourceField = plug.data.sourceField;
		var fieldStr = "";
		
		// 根据字段获取数据，并且获取
		$.each(sourceField, function(k, v){
			if(k==0){
				fieldStr += v.id;
			}else{
				fieldStr += ","+v.id;
			}
		});
		
		//创建发送请求数据的对象
		var requestData = new Object();
		//创建过滤条件对象
		var filter = new Object();
		
		// 组织出查询条件
		$.each(filterData, function(k, v){
			filter[v.field] = v.value;
		});
		
		requestData.filter = filter;
		//要查询的字段
		requestData.fields = fieldStr;
		//要查询页数
		requestData.curentPage = nowPageId;
		//要查询的每页的行数
		requestData.pageRow = pageRow;

		$.ajax({
				type : "post",//post的方式提交请求
		        url: "../DataAction",//本应用请求的url
		        data: {
		        	"object": objectName,//对象的名称（在对象管理中已维护）
		        	"method": "queryObjPageLike",//调用article对象的queryObjPage方法
		        	"parameter":$.toJSON(requestData)//请求的参数JOSN格式
		        },
		        dataType:"json",
		        success: function(data) {
		        	console.info(data);
		        	$("#"+plug.id).table("addData", data.rows);
		        }
		});
	};
	
	/* 结束 */
	/********************** 组件的响应事件, 主要是button、table *********************/
	
	
	// 绑定事件
	this.bindEvent = function(){
		
	};
	
	
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











