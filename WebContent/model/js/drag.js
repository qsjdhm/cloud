/*""
 * Drag.js 建模平台的元素拖动创建功能
 * by zhangyan 2014-09-25
*/
var domIndex = 0;  // 所有元素的下标索引
var Drag = function(ele){
	var self = this;  // 保存本身
	var element = ele.getElement();  // 得到元素DOM
	var eType = element.attr("eType");  // 得到元素
	
	this.onUp = function(){};
	
	this.init = function(){
		// 给元素绑定鼠标按下事件
		element.bind("mousedown", mouseDown);
	};
	
	// 鼠标按下功能方法
	var mouseDown = function(e){
		// div鼠标样式更改
		element.css("cursor", "move");
		// 建模区域增加样式，以提示用户将元素拖动到这里
		//$("#page").css("border", "1px solid #6B6B6B");
		// 绑定鼠标的移动的松开事件
		$(document).bind("mousemove", mouseMove);
        $(document).bind("mouseup", mouseUp);
        // 得到鼠标的坐标位置
        // 根据不同类型生成元素的缩略图
        var thumImg = '';
        switch(eType){
			case "label":  // label
				thumImg += '<div id="thumImg" class="thum-img" style="top:'+(e.pageY - 35)+'px;left:'+(e.pageX - 80)+'px;">'; 
				thumImg += '	<span class="thum-title">文本标签</span>'; 
				thumImg += '	<span class="thum-widget">'; 
				thumImg += '		<i class="fa fa-paragraph fa-lg"></i>'; 
				thumImg += '	</span>';
				thumImg += '</div>';
				break;
			case "input":  // input
				thumImg += '<div id="thumImg" class="thum-img" style="top:'+(e.pageY - 35)+'px;left:'+(e.pageX - 80)+'px;">'; 
				thumImg += '	<span class="thum-title">文本输入框</span>'; 
				thumImg += '	<span class="thum-widget">'; 
				thumImg += '		<i class="fa fa-text-width fa-lg"></i>'; 
				thumImg += '	</span>';
				thumImg += '</div>';
				break;
			case "button":  // button
				thumImg += '<div id="thumImg" class="thum-img" style="top:'+(e.pageY - 35)+'px;left:'+(e.pageX - 80)+'px;">'; 
				thumImg += '	<span class="thum-title">按钮</span>'; 
				thumImg += '	<span class="thum-widget">'; 
				thumImg += '		<i class="fa fa-hand-o-up fa-lg"></i>'; 
				thumImg += '	</span>';
				thumImg += '</div>';
				break;
			case "select":  // select
				thumImg += '<div id="thumImg" class="thum-img" style="top:'+(e.pageY - 35)+'px;left:'+(e.pageX - 80)+'px;">'; 
				thumImg += '	<span class="thum-title">下拉菜单</span>'; 
				thumImg += '	<span class="thum-widget">'; 
				thumImg += '		<i class="fa fa-caret-down fa-lg"></i>'; 
				thumImg += '	</span>';
				thumImg += '</div>';
				break;
			case "tree":  // tree
				thumImg += '<div id="thumImg" class="thum-img" style="top:'+(e.pageY - 35)+'px;left:'+(e.pageX - 80)+'px;">'; 
				thumImg += '	<span class="thum-title">多级树</span>'; 
				thumImg += '	<span class="thum-widget">'; 
				thumImg += '		<i class="fa fa-share-alt fa-lg"></i>'; 
				thumImg += '	</span>';
				thumImg += '</div>';
				break;
			case "table":  // table
				thumImg += '<div id="thumImg" class="thum-img" style="top:'+(e.pageY - 35)+'px;left:'+(e.pageX - 80)+'px;">'; 
				thumImg += '	<span class="thum-title">表格</span>'; 
				thumImg += '	<span class="thum-widget">'; 
				thumImg += '		<i class="fa fa-list-alt fa-lg"></i>'; 
				thumImg += '	</span>';
				thumImg += '</div>';
				break;
			case "tags":  // tags
				thumImg += '<div id="thumImg" class="thum-img" style="top:'+(e.pageY - 35)+'px;left:'+(e.pageX - 80)+'px;">'; 
				thumImg += '	<span class="thum-title">标签输入框</span>'; 
				thumImg += '	<span class="thum-widget">'; 
				thumImg += '		<i class="fa fa-tag fa-lg"></i>'; 
				thumImg += '	</span>';
				thumImg += '</div>';
				break;
			case "rich":  // rich
				thumImg += '<div id="thumImg" class="thum-img" style="top:'+(e.pageY - 35)+'px;left:'+(e.pageX - 80)+'px;">'; 
				thumImg += '	<span class="thum-title">富文本编辑器</span>'; 
				thumImg += '	<span class="thum-widget">'; 
				thumImg += '		<i class="fa fa-newspaper-o fa-lg"></i>'; 
				thumImg += '	</span>';
				thumImg += '</div>';
				break;
			default:
				console.info("未知类型元素创建");
        }
        
        $("body").append(thumImg);
		e.stopPropagation();
		e.preventDefault();
	};
	
	var mouseMove = function(e){
		$("#thumImg").css({
			"top" : e.pageY-35+"px",
        	"left" : e.pageX-80+"px"
		});
		e.stopPropagation();
		e.preventDefault();
	};
	
	var mouseUp = function(e){
		// 移除提示用户将元素拖动到这里的样式
		//$("#page").css("border", "0px solid #6B6B6B");
		
		// 1.判断当前区域是否可以创建元素
		if(judgeEleCreateArea(e.clientY, e.clientX)){
			// 2.在当前位置生成元素
			createDOM(e);
			// 鼠标松开代表又增加了一个元素 ， 索引要加1
			domIndex = domIndex + 1;
		}else{
			alert("请在合适的区域内创建元素！");
		}
		// 3.删除缩略图
		$("#thumImg").remove();
	    
	    // 4.接触绑定
	    $(document).unbind("mousemove", mouseMove);
		$(document).unbind("mouseup", mouseUp);
		e.stopPropagation();
		e.preventDefault();
        if(typeof(self.onUp) == "function"){
        	// 会触发这个方法
        	self.onUp(self);
        } 
	};
	
	// 判断拖拽的ele是不是在建模区域内
	var judgeEleCreateArea = function(top, left){
		var isCreate = true;
		if(top < ($(".header").height()+15+40) || left < ($(".ele-lead").width()+15)){  // 如果小于就说明不能创建
			isCreate = false;
		}else if(top > ($(".header").height()+15+$("#page").height()) || left > ($(".ele-lead").width()+15+$("#page").width())){
			isCreate = false;
		}
		return isCreate;
	};
	
	// 创建元素对象 并且在当前位置生成元素
	var createDOM = function(e){
		// 要得到同类型最大值  ，并且标志位在原来基础上加1
		var typeIndex = 0;
		if($(".d-dom[pType='"+eType+"']:last").length!==0){
			typeIndex = parseInt($(".d-dom[pType='"+eType+"']:last").attr("typeIndex"))+1;
		}
		switch(eType){
			case "label":  // label
				// 生成最基本的元素对象
				var dom = '<span class="ele-label">标签</span>';
		        // 调用方法在对象的外层包装一层可以拖动的div
				packDragDOM("label", typeIndex, dom, e);
				break;
			case "input":  // input
				// 生成最基本的元素对象
				var dom = '<input type="text" placeholder="文本框" class="ele-input"></input>';
		        // 调用方法在对象的外层包装一层可以拖动的div
				packDragDOM("input", typeIndex, dom, e);
				break;
			case "button":  // button
				// 生成最基本的元素对象
				var dom = '<button class="ele-button btn btn-3 btn-3e">保存</button>';
		        // 调用方法在对象的外层包装一层可以拖动的div
				packDragDOM("button", typeIndex, dom, e);
				break;
			case "select":  // select
				// 生成最基本的元素对象
				var dom = '';
				dom +=    '<select class="cd-select ele-select">';
				dom +=    '    <option value="-1" selected>全部</option>';
//				dom +=    '    <optgroup label="排序">';
				dom +=    '        <option value="1" class="">示例数据一</option>';
				dom +=    '        <option value="2" class="">示例数据二</option>';
//				dom +=    '    </optgroup>';
				dom +=    '    <option value="3" class="">示例数据三</option>';
				dom +=    '</select>';
		        // 调用方法在对象的外层包装一层可以拖动的div
				packDragDOM("select", typeIndex, dom, e);
				break;
			case "tree":  // tree
				// 生成最基本的元素对象
				var dom = '<ul class="ztree ele-tree"></ul>';
		        // 调用方法在对象的外层包装一层可以拖动的div
				packDragDOM("tree", typeIndex, dom, e);
				break;
			case "table":  // table
				// 生成最基本的元素对象
				var dom = '<div class="table"></div>';
				// 调用方法在对象的外层包装一层可以拖动的div
				packDragDOM("table", typeIndex, dom, e);
				break;
			case "tags":  // tags
				// 生成最基本的元素对象
				var dom = '<input type="hidden" class="select2 ele-tags" value=""></input>';
		        // 调用方法在对象的外层包装一层可以拖动的div
				packDragDOM("tags", typeIndex, dom, e);
				break;
			case "rich":  // rich
				var dom = '<script id="rich'+domIndex+'" name="content" type="text/plain"></script>';
				// 调用方法在对象的外层包装一层可以拖动的div
				packDragDOM("rich", typeIndex, dom, e);
				break;
			default:
				console.info("未知类型元素创建");
		}
	};
	
	// 给基本元素的外层包装一层可以拖动的div
	// type       元素类型
	// typeIndex  同类元素的最大索引
	// dom        元素本身
	// e          事件本身
	var packDragDOM = function(type, typeIndex, dom, e){
		
		var areaStr = "";
		if(e.width != null){  // 如果宽度不等于null就说明是再次编辑配置页面
			// 组织宽度、高度字符串
			areaStr = "width:"+e.width+"px;height:"+e.height+"px;";
		}
		//var areaStr = e.width != null ? "width:"+e.width+"px;height:"+e.height+"px;" : "";
		var bdr = type==="label" ? "bdr1" : "";
		// pType      代表此元素是哪一种类型    
		// typeIndex  代表此元素是这一个类型中的索引位置
		// domIndex   代表此元素是总体元素的索引位置, 向后台提交页面元素的时候需要根据它来保存
		var html = '<div class="d-dom d-'+type+'" pType="'+type+'" typeIndex="'+typeIndex+'" domIndex="'+domIndex+'" style="top:'+(e.pageY-155)+'px;left:'+(e.pageX-300)+'px;'+areaStr+'">';
		html +=    '	<div style="width:100%; height:100%; overflow:hidden;">';
		html +=    '		<div class="d-title">';
		html +=    '			<div class="d-cfg d-hide"><i class="fa fa-cog fa-lg"></i>配置</div>';
		html +=    '			<div class="d-drag d-hide"><i class="fa fa-paw fa-lg"></i>拖动</div>';
		html +=    '			<div class="d-del d-hide"><i class="fa fa-close fa-lg"></i>删除</div>';
		html +=    '		</div>';
		html +=    '		<div class="d-content '+bdr+'">';
		html +=    				dom;
		html +=    '		</div>';
		html +=    '		<div class="d-right"></div>';
		html +=    '		<div class="d-rb"><i class="fa fa-unsorted fa-lg"></i></div>';
		html +=    '		<div class="d-bottom"></div>';
		html +=    '	</div>';
		html +=    '</div>';
        $("#mainPage").append(html);
        
        var elem = $(".d-dom[pType='"+type+"'][typeIndex='"+typeIndex+"']");
        
        // 1.初始化元素插件
        initElemPlugs(elem, type, e);
        
        // 2.初始化不同DOM的配置信息
        initDomParam(elem, type, typeIndex, e);
		
		// 3.绑定DOM参数配置事件
		bindDOMParamConfigEvent(elem, type, typeIndex);
		
        // 4.给DOM添加拖动等事件
        bindPackDOMEvent(type, typeIndex);
	};
	
	
	// 1.初始化元素插件
	// from 是从已经配置过的页面打开是新打开的页面
	// 已经配置过的页面需要从配置参数中获取默认数据，来初始化元素
    var initElemPlugs = function(elem, type, from){
		switch(type){
			case "select":   // select
				elem.find(".cd-select").dropdown({
					gutter : 5,
					stack : false,
					slidingIn : 100
				});
				break;
			case "tree":    // tree
				var setting = {	};
				var zNodes = [{ 
							name:"父节点", 
							open:true,
							children: [
								{ name:"示例数据一"},
								{ name:"示例数据二"},
								{ name:"示例数据三"}
							]}
				];
				
				$.fn.zTree.init(elem.find(".ztree"), setting, zNodes);
				break;
			case "table":   // table
				// 由于组件特殊性，需要根据已经配置的属性初始化table
				console.info(elem);
				var tableFunParam = {};  // 保存table元素从后台获取的配置信息
				var index = elem.attr("domindex");
				var fieldList = [{"id":"ID", "name":"实例字段一", "width":80},{"id":"NAME", "name":"实例字段二", "width":130},{"id":"AGE", "name":"实例字段三", "width":80}];
				$.each(aDomParamArray, function(k, v){
					if(v.id == "domindex"+index){
						tableFunParam = v["function"];
						fieldList = [];
						$.each(v.data.sourceField, function(key, val){
							fieldList.push({
								"id" : val.id,
								"name" : val.name,
								"width" : parseInt(v.data.fieldWidth[key].name)
							});
						});
					}
				});
				
				elem.find(".table").table({
					"width"      : 400,
					"height"     : 300,
					"field"      : fieldList,
					"adaptive"   : false, // 数据源字段自适应宽度方式
					"popup"      : false,  // 是否显示弹出框
					"pattern"    : true, // 模式   true:字段方式获取数据   false:普通添加方式获取数据
					"example"    : true,  // 实例   当前创建的是否是model中的实例
					"check"      : tableFunParam.check,  // 全选
					"number"     : tableFunParam.number,  // 序号
					"edit"       : tableFunParam.edit,  // 编辑
					"del"        : tableFunParam.del,  // 删除
					"allDel"     : tableFunParam.allDel,  // 全部删除
					"filter"     : tableFunParam.filter,  // 过滤
					"paging"     : tableFunParam.paging,  // 分页条
					"zebra"      : true,  // 斑马线
					"dataTotal"  : 0,     // 数据总个数
					"rowsPerPage": 5
				});
				break;
			case "tags":    // tags
				elem.find(".select2").select2({
					tags: ["示例数据一", "示例数据二"]
				});
				// 绑定一下change事件 处理选择完成后设置行高等问题
				elem.find(".select2").change(function(e){
					// 如果这次改变是新增数据
					if(e.added != undefined && e.added != null && e.added != ""){
						// 如果已经有存在的li
						if(elem.find(".select2-search-choice").length>1){
							var pChoLineHeight = parseFloat(elem.find(".select2-search-choice:first").css("line-height").replace(/px/, ""));
							var pCloTop = parseFloat(elem.find(".select2-search-choice-close:first").css("top").replace(/px/, ""));
							
							elem.find(".select2-search-choice:last").css("line-height", pChoLineHeight+"px");
							elem.find(".select2-search-choice-close:last").css("top", pCloTop+"px");
						}else{
							var pDomHeight = elem.height();	
							var pChoLineHeight = parseFloat(elem.find(".select2-search-choice").css("line-height").replace(/px/, ""));
							var pCloTop = parseFloat(elem.find(".select2-search-choice-close").css("top").replace(/px/, ""));
							
							elem.find(".select2-search-choice").css("line-height",  (pDomHeight-25) / 2.1875+"px");
							elem.find(".select2-search-choice-close").css("top", (pDomHeight-25) / 7+"px");
						}
					}
				});
				break;
			case "rich":    // rich
				var height = 322-79;  // 79是初始工具栏高度
				if(from.height != null){
					height = from.height - 25 - 3 - from.titleHeight;
				}
				var richId = elem.find(".d-content>script").attr("id");
				var ue = UE.getEditor(richId, {
					// 初始化参数
					initialFrameHeight: height,   // 高度默认值
					zIndex: 0,
					autoHeightEnabled: false,  // 不自动增高
					initialStyle: 'p{line-height:1em}',
					enableAutoSave: false,     // 不自动保存
					autoFloatEnabled: false,    // 工具栏不悬浮
					toolbars: [[
					             // 'fullscreen', 'source', '|',
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
				break;
			default:
				console.info(type+"类型元素暂时不需要初始化");
		}
    };
    
    // 2.初始化不同DOM的配置参数
    var initDomParam = function(elem, type, typeIndex, from){
		// 调用param对象的初始化dom的配置方法，达到一个方法调用，param内部自己创建配置信息
		param.initDomParam(elem, type, typeIndex, from);
    };
    
	// 3.绑定DOM参数配置事件
	var bindDOMParamConfigEvent = function(elem, type, typeIndex){
		// 监听当前元素的配置事件
		elem.find(".d-cfg").bind("click", function(e){
			var index = $(this).parents(".d-dom").attr("domindex");
			// 显示当前点击的元素的配置项
			param.showParamItem("domindex"+index);
		});
	};
	
	// 4.给DOM添加拖动等事件
	// type       元素类型
	// typeIndex  同类元素的最大索引
	var bindPackDOMEvent = function(type, typeIndex){
		// 根据最大索引找到最新创建的元素  
		var dom = $(".d-dom[pType='"+type+"'][typeIndex='"+typeIndex+"']");
		var drag = dom.find(".d-drag");  // 获取到整体拖动div
		var right = dom.find(".d-right");  // 获取到右拖动线
		var bottom = dom.find(".d-bottom");  // 获取到下拖动线
		var rb = dom.find(".d-rb");  // 获取到右下拖动线
		
		var mouseStart = {};
        var divStart = {};
        var rightStart = {};
        var bottomStart = {};
        
        // 右方的拖拽线的鼠标按下、移动、放开事件功能方法
        var rightDown = function(ev){
        	var oEvent = ev||event;
        	mouseStart.x = oEvent.clientX;
        	mouseStart.y = oEvent.clientY;
        	rightStart.x = right[0].offsetLeft;
        	
        	// 如果鼠标按下时在页面区域外
        	if(right[0].setCapture){
            	right[0].onmousemove = rightMove;
            	right[0].onmouseup = rightStop;
            	// 添加鼠标超出页面区域的绑定
            	right[0].setCapture();
        	}else{
        		// 这里要给document绑定事件，否则Chrome下拖动快了会出现失去焦点的现象
        		document.addEventListener("mousemove",rightMove,true);
        		document.addEventListener("mouseup",rightStop,true);
        	}
        	
        	// 显示元素的对齐线
        	var position = param.getDomParamArray(dom.attr("domindex")).position;
            alignLine.showLine(position.top, position.left, position.width, position.height); 
        };
        
        var rightMove = function(ev){
        	var oEvent = ev||event;
        	var l = oEvent.clientX - mouseStart.x + rightStart.x;
        	var w = l+rb.width();
        	
        	if(w < rb.width()){  // 如果当前div的宽度小于右下div的宽度
            	w = rb.width();
        	}else if(w > $("#mainPage")[0].clientWidth - dom[0].offsetLeft){
        		// 如果拖动的范围超出了父div   拖动就到此为止
            	w = $("#mainPage")[0].clientWidth - dom[0].offsetLeft - 2;
        	}
        	dom.css("width", w-9 + "px");
        	
        	// 元素宽度改变时给元素的param设置最新的宽度
        	setDomNewWidth(dom, w-9);
        	
        	// 处理特殊元素的向右拖动效果
            if(dom.attr("ptype") === "select"){
            	dom.find("li").width(w-9);
            }else if(dom.attr("ptype") === "rich"){
            	var domHeight = dom.height()-25;
            	var titleHeight = dom.find(".edui-editor-toolbarbox").height();
            	var contentHeight = domHeight-titleHeight-2;
            	dom.find(".edui-editor-iframeholder").height(contentHeight);
            	
            	// 特指-rich的标题高度改变时给元素的param设置最新的值
            	setRichDomNewTitleHeight(dom, titleHeight);
            }
            
            // 移动元素的对齐线
            var position = param.getDomParamArray(dom.attr("domindex")).position;
            alignLine.moveLine(position.top, position.left, position.width, position.height); 
            
        	// 拖动的时候设置div中的文字不可被选中
            setSelected(right[0], false);
        };
        
        var rightStop = function(ev){
        	// 如果鼠标事件超出页面范围
        	if(right[0].releaseCapture){	
        		right[0].onmousemove = null;
            	right[0].onmouseup = null;
                // 释放鼠标监控
            	right[0].releaseCapture();
            }else{
            	document.removeEventListener("mousemove",rightMove,true);
            	document.removeEventListener("mouseup",rightStop,true);
            }
        	
        	// 隐藏元素的对齐线
            alignLine.hideLine();
        	
        	// 拖动的时候设置div中的文字可以被选中
        	setSelected(right[0], true);
        };
        
        // 下方的拖拽线的鼠标按下、移动、放开事件功能方法
        var bottomDown = function(ev){
        	var oEvent=ev||event;
            mouseStart.x = oEvent.clientX;
            mouseStart.y = oEvent.clientY;
            bottomStart.y= bottom[0].offsetTop;
        	
        	// 如果鼠标按下时在页面区域外
        	if(bottom[0].setCapture){
        		bottom[0].onmousemove = bottomMove;
        		bottom[0].onmouseup = bottomStop;
            	// 添加鼠标超出页面区域的绑定
        		bottom[0].setCapture();
        	}else{
        		document.addEventListener("mousemove", bottomMove, true);
        		document.addEventListener("mouseup", bottomStop, true);
        	}
        	
        	// 显示元素的对齐线
        	var position = param.getDomParamArray(dom.attr("domindex")).position;
            alignLine.showLine(position.top, position.left, position.width, position.height); 
        };
        
        var bottomMove = function(ev){
        	var pDomHeight = parseFloat(dom.height());
        	
        	var oEvent = ev||event;
            var t = oEvent.clientY - mouseStart.y + bottomStart.y;
            var h = t + rb.height();
           
            if(h < rb.height()){
            	h = rb.height();
            }
            
            // 此段代码是限制是否在超出的div中显示
//          else if(h > $("#mainPage")[0].clientHeight - dom[0].offsetTop){
//          	h = $("#mainPage")[0].clientHeight - dom[0].offsetTop-2;
//          }
            dom.css("height", h-9 + "px");
            
            // 元素高度改变时给元素的param设置最新的高度
        	setDomNewHeight(dom, h-9-25);
            
            // 处理特殊元素的向下拖动效果
            if(dom.attr("ptype") === "label"){
            	dom.find(".ele-label").css("line-height", h-9-25+"px");
            }else if(dom.attr("ptype") === "select"){
            	dom.find(".cd-dropdown > span").css({
            		"height":h-9-25+"px",  // dom的高度在减去title的高度
            		"line-height":h-9-25+"px"
            	});
            	dom.find(".cd-dropdown ul li span").css("line-height",h-9-25+"px");
            	// 设置li的top值
            	$.each(dom.find("li"), function(lik,liv){
            		// 由于每个li的top都是上一个的二倍，所以都乘以当前位数
            		$(liv).css("top",(h-9-25+5)*(lik+1)+"px");
            	});
            	if(dom.find("li").length>0){
            		dom.find("ul").height((dom.find("li").length+1) * dom.find("li:first").height());
            	}
            }else if(dom.attr("ptype") === "tags"){
            	// 1.先设置select2-container的行高
            	var pConLineHeight = parseFloat(dom.find(".select2-container").css("line-height").replace(/px/, ""));
            	dom.find(".select2-container").css("line-height", pConLineHeight + (h-9-pDomHeight) * 0.975+"px");
            	// 2.判读当前是不是有li，如果有设置height等样式
            	if(dom.find(".select2-search-choice").length>0){
            		var pChoLineHeight = parseFloat(dom.find(".select2-search-choice").css("line-height").replace(/px/, ""));
            		var pCloTop = parseFloat(dom.find(".select2-search-choice-close").css("top").replace(/px/, ""));
            		
            		dom.find(".select2-search-choice").css("line-height", pChoLineHeight + (h-9-pDomHeight) * 0.975+"px");
            		dom.find(".select2-search-choice-close").css("top", pCloTop + (h-9-pDomHeight) * 0.525+"px");
            	}
            }else if(dom.attr("ptype") === "rich"){
            	var domHeight = h-9;
            	var titleHeight = dom.find(".edui-editor-toolbarbox").height();
            	var contentHeight = domHeight-titleHeight-25-2;
            	dom.find(".edui-editor-iframeholder").height(contentHeight);
            	
            	// 特指-rich的标题高度改变时给元素的param设置最新的值
            	setRichDomNewTitleHeight(dom, titleHeight);
            }
            
            // 移动元素的对齐线
            var position = param.getDomParamArray(dom.attr("domindex")).position;
            alignLine.moveLine(position.top, position.left, position.width, position.height); 
            
            // 拖动的时候设置div中的文字不可被选中
            setSelected(bottom[0], false);
        };
        
        var bottomStop = function(ev){
        	// 如果鼠标事件超出页面范围
        	if(bottom[0].releaseCapture){	
        		bottom[0].onmousemove = null;
        		bottom[0].onmouseup = null;
                // 释放鼠标监控
        		bottom[0].releaseCapture();
            }else{
            	document.removeEventListener("mousemove", bottomMove, true);
            	document.removeEventListener("mouseup", bottomStop, true);
            }
        	var userSelect = getStyleName("user-select");
        	
        	// 隐藏元素的对齐线
            alignLine.hideLine(); 
        	
        	// 拖动的时候设置div中的文字可以被选中
        	setSelected(bottom[0], true);
        };
        
        // 右下方的拖拽线的鼠标按下、移动、放开事件功能方法
        var rbDown = function(ev){
        	 var oEvent = ev||event;
             mouseStart.x = oEvent.clientX;
             mouseStart.y = oEvent.clientY;
             divStart.x = rb[0].offsetLeft;
             divStart.y = rb[0].offsetTop;
             
             if(rb[0].setCapture){
            	 rb[0].onmousemove = rbMove;
            	 rb[0].onmouseup = rbStop;
            	 rb[0].setCapture();
             }else{
            	 document.addEventListener("mousemove", rbMove, true);
            	 document.addEventListener("mouseup", rbStop, true);
             }
             
             // 显示元素的对齐线
             var position = param.getDomParamArray(dom.attr("domindex")).position;
             alignLine.showLine(position.top, position.left, position.width, position.height); 
        };
        
        var rbMove = function(ev){
        	var pDomHeight = parseFloat(dom.height());
        	
        	var oEvent = ev||event;
            var l = oEvent.clientX - mouseStart.x + divStart.x;
            var t = oEvent.clientY - mouseStart.y + divStart.y;
            var w = l+rb.width();
            var h = t+rb.height();
           
            if(w < rb.width()){
            	w = rb.width();
            }else if(w > $("#mainPage")[0].clientWidth - dom[0].offsetLeft){
            	// 此段代码是限制是否在超出的div中显示
            	w = $("#mainPage")[0].clientWidth - dom[0].offsetLeft - 2;
            }
            
            if(h < rb.height()){
            	h = rb.height();
            }
            // 此段代码是限制是否在超出的div中显示
//          else if(h > $("#mainPage")[0].clientHeight - dom[0].offsetTop){
//            	h = $("#mainPage")[0].clientHeight - dom[0].offsetTop - 2;
//          }
            
            dom.css({
            	"width" : w-2 + "px",
            	"height": h-2 + "px"
            });
            
            // 元素宽度高度改变时给元素的param设置最新的宽度高度
        	setDomNewWidthHeight(dom, w-2, h-2-25);
            // 处理特殊元素的向右下拖动效果
            if(dom.attr("ptype") === "label"){
            	dom.find(".ele-label").css("line-height", h-2-25+"px");
            }else  if(dom.attr("ptype") === "select"){
            	dom.find("li").width(w-2);
            	
            	dom.find(".cd-dropdown > span").css({
            		"height":h-2-25+"px",  // dom的高度在减去title的高度
            		"line-height":h-2-25+"px"
            	});
            	dom.find(".cd-dropdown ul li span").css("line-height",h-2-25+"px");
            	// 设置li的top值
            	$.each(dom.find("li"), function(lik,liv){
            		// 由于每个li的top都是上一个的二倍，所以都乘以当前位数
            		$(liv).css("top",(h-2-25+5)*(lik+1)+"px");
            	});
            	if(dom.find("li").length>0){
            		dom.find("ul").height((dom.find("li").length+1) * dom.find("li:first").height());
            	}
            }else if(dom.attr("ptype") === "tags"){
            	// 1.先设置select2-container的行高
            	var pConLineHeight = parseFloat(dom.find(".select2-container").css("line-height").replace(/px/, ""));
            	dom.find(".select2-container").css("line-height", pConLineHeight + (h-2-pDomHeight) * 0.975+"px");
            	// 2.判读当前是不是有li，如果有设置height等样式
            	if(dom.find(".select2-search-choice").length>0){
            		var pChoLineHeight = parseFloat(dom.find(".select2-search-choice").css("line-height").replace(/px/, ""));
            		var pCloTop = parseFloat(dom.find(".select2-search-choice-close").css("top").replace(/px/, ""));
            		
            		dom.find(".select2-search-choice").css("line-height", pChoLineHeight + (h-2-pDomHeight) * 0.975+"px");
            		dom.find(".select2-search-choice-close").css("top", pCloTop + (h-2-pDomHeight) * 0.525+"px");
            	}
            }else if(dom.attr("ptype") === "rich"){
            	var domHeight = dom.height()-25;
            	var titleHeight = dom.find(".edui-editor-toolbarbox").height();
            	var contentHeight = domHeight-titleHeight-2;
            	dom.find(".edui-editor-iframeholder").height(contentHeight);
            	
            	// 特指-rich的标题高度改变时给元素的param设置最新的值
            	setRichDomNewTitleHeight(dom, titleHeight);
            }
            
            // 移动元素的对齐线
            var position = param.getDomParamArray(dom.attr("domindex")).position;
            alignLine.moveLine(position.top, position.left, position.width, position.height); 
            
            // 拖动的时候设置div中的文字不可被选中
            setSelected(rb[0], false);
        };
        
        var rbStop = function(ev){
        	if(rb[0].releaseCapture){
        		rb[0].onmousemove = null;
        		rb[0].onmouseup = null;
        		rb[0].releaseCapture();
            }else{
            	document.removeEventListener("mousemove", rbMove, true);
            	document.removeEventListener("mouseup", rbStop, true);
            }
        	
        	// 拖动的时候设置div中的文字可以被选中
        	setSelected(rb[0], true);
        	
        	// 隐藏元素的对齐线
            alignLine.hideLine(); 
        };
        
        // 整体的拖拽线的鼠标按下、移动、放开事件功能方法
        var dragDown = function(ev){
        	var oEvent = ev||event;
            mouseStart.x = oEvent.clientX;
            mouseStart.y = oEvent.clientY;
            divStart.x = dom[0].offsetLeft;
            divStart.y = dom[0].offsetTop;
           
            if(drag[0].setCapture){
            	drag[0].onmousemove = dragMove;
            	drag[0].onmouseup = dragStop;
            	drag[0].setCapture();
            }else{
            	document.addEventListener("mousemove", dragMove, true);
            	document.addEventListener("mouseup", dragStop, true);
            }
            
            // 显示元素的对齐线
            var position = param.getDomParamArray(dom.attr("domindex")).position;
            alignLine.showLine(position.top, position.left, position.width, position.height); 
        };
        
        var dragMove = function(ev){
        	var oEvent = ev||event;
            var l = oEvent.clientX - mouseStart.x + divStart.x;
            var t = oEvent.clientY - mouseStart.y + divStart.y;
            
            if(l < 0){
            	l = 0;
            }else if(l > $("#mainPage")[0].clientWidth - dom[0].offsetWidth){
            	// 如果拖动的范围超出了父div   拖动就到此为止
            	l = $("#mainPage")[0].clientWidth - dom[0].offsetWidth;
            }
            
            if(t < 0){
            	t = 0;
            }
            // 此段代码是限制是否在超出的div中显示
//          else if(t > $("#mainPage")[0].clientHeight - dom[0].offsetHeight){
//            	t = $("#mainPage")[0].clientHeight - dom[0].offsetHeight;
//          }
            
            dom.css({
            	"left" : l+"px",
            	"top": t+"px"
            });
            
            // 元素TOP、LEFT改变时给元素的param设置最新的TOP、LEFT
        	setDomNewLeftTop(dom, l, t+25);
        	
        	// 移动元素的对齐线
        	var position = param.getDomParamArray(dom.attr("domindex")).position;
            alignLine.moveLine(position.top, position.left, position.width, position.height); 
            
            // 拖动的时候设置div中的文字不可被选中
            setSelected(dom[0], false);
        };
        
        var dragStop = function(ev){
        	if(drag[0].releaseCapture){
        		drag[0].onmousemove = null;
        		drag[0].onmouseup = null;
        		drag[0].releaseCapture();
            }else{
            	document.removeEventListener("mousemove", dragMove, true);
            	document.removeEventListener("mouseup", dragStop, true);
            }
        	
        	// 隐藏元素的对齐线
            alignLine.hideLine(); 
        	
        	// 拖动的时候设置div中的文字可以被选中
        	setSelected(dom[0], true);
        };
        
        //判定对样式的支持
        var getStyleName= (function(){
        	var prefixes = ['', '-ms-','-moz-', '-webkit-', '-khtml-', '-o-'];
        	var reg_cap = /-([a-z])/g;
        	function getStyleName(css, el) {
        		el = el || document.documentElement;
        		var style = el.style,test;
        		for (var i=0, l=prefixes.length; i < l; i++) {
        			test = (prefixes[i] + css).replace(reg_cap,function($0,$1){
        				return $1.toUpperCase();
        			});
        			if(test in style){
        				return test;
        			}
        		}
        		return null;
        	}
        	return getStyleName;
        })();
        
        // 拖动的时候设置div中的文字不可被选中
        var setSelected = function(target, boo){
        	var explorer = window.navigator.userAgent;
        	// 暂时先默认为firefox模式
        	var objEle = target;
        	var obj = target;
        	if(explorer.indexOf("Chrome") >= 0){
        		objEle = document.documentElement;
        		obj = document;
        	}
        	
        	// 根据移动或升起状态设置是否可以选中
        	if(boo){  // 停止
    			if(typeof userSelect === "string"){  
        			return objEle.style[userSelect] = "text";
        		}
    			obj.unselectable  = "off";
    			obj.onselectstart = null;
        	}else{  // 移动
    			var userSelect = getStyleName("user-select");
                if(typeof userSelect === "string"){
                	return objEle.style[userSelect] = "none"; 
                } 
                obj.unselectable  = "on"; 
                obj.onselectstart = function(){ return false; }
        	}
        }  
        
        // 绑定它的拖动事件
        right.bind("mousedown", rightDown);    // 右方拖动的鼠标按下事件
        bottom.bind("mousedown", bottomDown);  // 下方拖动的鼠标按下事件
    	rb.bind("mousedown", rbDown);  		   // 右下拖动的鼠标按下事件
        drag.bind("mousedown", dragDown);      // 整体拖动的鼠标按下事件
        
        // 绑定dom的鼠标悬浮显示操作
        dom.bind({ mouseenter: function(e) {
        	// 移除隐藏效果
        	dom.find(".d-cfg,.d-drag,.d-del").removeClass("d-hide");
			// 设置z-index
			$(".d-z-index").removeClass("d-z-index");
			$(this).addClass("d-z-index");
        }, mouseleave: function(e) {
        	// 移除显示效果
        	dom.find(".d-cfg,.d-drag,.d-del").addClass("d-hide");
        } });
		
		// 绑定删除功能方法
        dom.find(".d-del").bind("click", function(e){
        	// 1.删除与它所对应的form
        	$("#eleParam form[deptdomindex='"+dom.attr("domindex")+"']").remove();
        	// 2.如果当前元素是最后一个要显示提示信息
        	if($("#eleParam form").length == 0){ 
        		$("#alertDanger").show(); 
        	}else{  // 否则显示存在的第一个元素的配置项
        		$("#eleParam form:first").show();
        	}
        	// 3.删除元素
        	dom.remove();
        	// 4.删除此元素在全局变量中所对应的数据
        	param.delDomParamArray(dom.attr("domindex"));
		});
        
        // 元素宽度改变时给元素的param设置最新的宽度
        var setDomNewWidth = function(dom, width){
        	// 给位置参数设置宽度
        	param.editDomParamArray(dom.attr("domindex"), "position", "width", width);
        };
        
        // 元素高度改变时给元素的param设置最新的高度
    	var setDomNewHeight = function(dom, height){
    		// 给位置参数设置宽度
        	param.editDomParamArray(dom.attr("domindex"), "position", "height", height);
    	};
    	
    	// 元素宽度高度改变时给元素的param设置最新的宽度高度
    	var setDomNewWidthHeight = function(dom, width, height){
    		// 给位置参数设置宽度
        	param.editDomParamArray(dom.attr("domindex"), "position", "width", width);
        	param.editDomParamArray(dom.attr("domindex"), "position", "height", height);
    	};

    	// 元素TOP\LEFT改变时给元素的param设置最新的TOP\LEFT
    	var setDomNewLeftTop = function(dom, left, top){
    		// 给位置参数设置宽度
        	param.editDomParamArray(dom.attr("domindex"), "position", "left", left);
        	param.editDomParamArray(dom.attr("domindex"), "position", "top", top);
    	};
    	
    	// 特指-rich的标题高度改变时给元素的param设置最新的值
    	var setRichDomNewTitleHeight = function(dom, titleHeight){
    		// 给位置参数设置宽度
        	param.editDomParamArray(dom.attr("domindex"), "position", "titleHeight", titleHeight);
    	};
	};
	
	/* 用户打开配置后的页面元素所调用的方法--开始  */
	
	// 初始化默认配置
	this.initDefaultConfig = function(data){
		
		// 1.设置当前元素的domIndex，防止如果页面中间的元素有删除的，domIndex定位会导致不正确的情况
		domIndex = parseInt(data.id.replace(/[^0-9]/ig,""));
		
		// 2.初始化元素位置
		createDOM({
			from: "edit",  // edit是代表来自于已经配置的页面，没有这个key代表这是一个全新的页面
			pageY: data.position.top+130, 
			pageX: data.position.left+300,
			width: data.position.width,
			height: data.position.height+25,
			titleHeight: data.position.titleHeight ? data.position.titleHeight : 0
		});
		// 3.元素的索引要增加1
		domIndex = domIndex + 1;
		// 4.处理元素的样式（行高、字体颜色等）
		self.setDefaultStyle(data);
		// 5.处理元素的content
		self.setDefaultContent(data);
		// 6.处理元素的function
		self.setDefaultFunction(data);
		// 7.处理元素的配置form的参数
		self.setDefaultParam(data);
	};  
	
	// 设置初始化元素的样式（行高、字体颜色等）
	this.setDefaultStyle = function(data){
		// 设置各种元素的行高
		self.setDefaultLineHeight(data);
		// 设置各种元素的样式
		self.setDefaultColor(data);
	};
	
	
	// 设置各种元素的行高
	this.setDefaultLineHeight = function(data){
		// 获取设置行高等样式
		var dom = $(".d-dom[domindex='"+(domIndex-1)+"']");
		var w = data.position.width+2;
		var h = data.position.height+27;
		var pDomHeight = h;
		
		// 1.设置各种元素的行高
        if(dom.attr("ptype") === "label"){
        	dom.find(".ele-label").css("line-height", h-2-25+"px");
        }else if(dom.attr("ptype") === "select"){
        	setTimeout(function(){
        		dom.find("li").width(w);
            	
            	dom.find(".cd-dropdown > span").css({
            		"height":h-2-25+"px",  // dom的高度在减去title的高度
            		"line-height":h-2-25+"px"
            	});
            	dom.find(".cd-dropdown ul li span").css("line-height",h-2-25+"px");
            	// 设置li的top值
            	$.each(dom.find("li"), function(lik,liv){
            		// 由于每个li的top都是上一个的二倍，所以都乘以当前位数
            		$(liv).css("top",(h-2-25+5)*(lik+1)+"px");
            	});
            	if(dom.find("li").length>0){
            		dom.find("ul").height((dom.find("li").length+1) * dom.find("li:first").height());
            	}
        	},2000);
        }else if(dom.attr("ptype") === "tags"){
        	// 1.先设置select2-container的行高
        	var pConLineHeight = parseFloat(dom.find(".select2-container").css("line-height").replace(/px/, ""));
        	dom.find(".select2-container").css("line-height", pConLineHeight + (h-2-pDomHeight) * 0.975+"px");
        	// 2.判读当前是不是有li，如果有设置height等样式
        	if(dom.find(".select2-search-choice").length>0){
        		var pChoLineHeight = parseFloat(dom.find(".select2-search-choice").css("line-height").replace(/px/, ""));
        		var pCloTop = parseFloat(dom.find(".select2-search-choice-close").css("top").replace(/px/, ""));
        		
        		dom.find(".select2-search-choice").css("line-height", pChoLineHeight + (h-2-pDomHeight) * 0.975+"px");
        		dom.find(".select2-search-choice-close").css("top", pCloTop + (h-2-pDomHeight) * 0.525+"px");
        	}
        }else if(dom.attr("ptype") === "rich"){
        	data.position.titleHeight = 79;
        	console.info(data);
        	var contentHeight = data.position.height - data.position.titleHeight - 2;
    		//dom.find(".edui-editor-iframeholder").height(contentHeight);
        }
	};
	
	// 设置各种元素的样式
	this.setDefaultColor = function(data){
		var dom = $(".d-dom[domindex='"+(domIndex-1)+"']");
		if(data.style != null){
			$.each(data.style, function(k, v){
				// 调用param对象中的设置元素的方法设置每个key的样式
				param.setDomStyleParam(dom, k, v);
			});
		}
	};
	
	
	// 处理元素的content
	this.setDefaultContent = function(data){
		var dom = $(".d-dom[domindex='"+(domIndex-1)+"']");
		$.each(data.data, function(k, v){
			// 调用param对象中的设置元素的方法设置每个key的内容
			param.setDomAttrParam(dom, k, v);
		});
	};
	
	// 处理元素的function
	this.setDefaultFunction = function(data){
//		var dom = $(".d-dom[domindex='"+(domIndex-1)+"']");
//		$.each(data.data, function(k, v){
//			// 调用param对象中的设置元素的方法设置每个key的内容
//			param.setDomAttrParam(dom, k, v);
//		});
	};
	
	// 处理元素的配置form的参数
	this.setDefaultParam = function(data){
		
	};
	
	/* 用户打开配置后的页面元素所调用的方法--结束  */
	
}












