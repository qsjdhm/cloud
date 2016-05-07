
// 先在全局声明出来，这样外部就可以调用menu的方法
var menu = new Object();

$(function(){
	menu = new Menu();
	menu.init();
});




/**
 * 这个采用了私有函数的公有化模式来实现
 * 这种模式有利于把私有函数和外部接口分离，并且可以提供外部重写内部的函数
 * 只需要在页面加载完成后在控制台运行以下代码就可以看到init方法被重写了，不再请求后台组织数据了
 * 只是单纯的打印了"外部init"
 * var menu = new Menu();
 * menu = function(){ console.info("外部init"); }
 * menu();
 */
var Menu = function(){
	// 弹出框所需要到的变量
	var toastCount = 0;
	var $toastlast;
	
	var assoDataArray = [];  // 关联的元数据表
	var menuArray = [];  // 保存所有的菜单
	var delFunctionArray = [];  // 用于删除功能时先组织将要删除的功能和子菜单的key
	var delMenuKey = "";  // 用于删除菜单时获取的当前删除的菜单的key
	var $editFunctionSpan = "";  // 用于重命名功能名称时使用的当前span
	var $editMenuSpan = "";  // 用于编辑菜单时使用的当前span
	var $delFunctionLi = "";  // 用于功能删除的时候保存当前删除的li
	var $delMenuLi = "";  // 用于菜单删除的时候保存当前删除的li
	var subMenuLen = 0;  // 保存所有菜单的个数，新增和删除都要做修改
	
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
		$(".m-page-title").addClass("opacity-show");
	};
	
	// 初始化数据
	var _initData = function(){
		// 请求关联元数据表
		_queryAssoData();
		// 请求菜单数据
		_queryData({callback:function(data){
			// 1.组织数据
			_dealData(data);
			// 2.初始化功能
			_initFunction(); 
			// 3.初始化菜单
			_initMenu();
			// 4.初始化弹出框的input
			_initModelInput();
			// 5.初始化页面建模弹出框
			_initModelPageConfig(data);
		}});
	};
	
	// 请求关联元数据表
	var _queryAssoData = function(){
		var filter = new Object();
		filter.source = "0";
		var requestData = new Object();
		requestData.filter = filter;
		requestData.fields = "o_id,name,description";
				
		$.ajax({
			type : "post",//post的方式提交请求
			url: "../DataAction",//本应用请求的url
			data: {
				"object": "object",//对象的名称（在对象管理中已维护）
				"method": "queryObj",//调用article对象的save方法
				"parameter":$.toJSON(requestData)//请求的参数JOSN格式
			},
			dataType:"json",
			success: function(data) {
				// 保存下来，供新增菜单时使用
				assoDataArray = data.rows;
		    }
		});
	};
	
	// 请求功能的数据
	var _queryData = function(fun){
		
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
		    	if(data.rows.length>0){
		    		var callback = fun?fun.callback:null;  // 获取参数对象中的回调方法
		    		if($.isFunction(fun.callback)){  // 如果有回调方法
		    			callback(data.rows);  // 返回数据，方便回调方法使用它
		    		}
				}
		    }
		});
	};
	
	// 组织请求的功能数据
	var _dealData = function(data){
		subMenuLen = 0;
		
		// 先把每个菜单的父级找出来
		$.each(data, function(k, v){
			if(v.PARENT_ID == 0){
				var parentObj = new Object();
				parentObj["parent"] = v;
				parentObj["sub"] = [];
				menuArray.push(parentObj);
			}
		});
		
		// 再把每个子菜单放到父级菜单下面
		$.each(data, function(k, v){
			if(v.PARENT_ID != 0){
				$.each(menuArray, function(key, val){
					if(val.parent.FUNCTION_ID == v.PARENT_ID){
						val.sub.push(v);
						subMenuLen++;
						return false;
					}
				});
			}
		});
		
		// 设置下菜单的个数
		$("#functionNum").html(subMenuLen);
		
		// 组织html所需要的代码
		var html = '';
		$.each(menuArray, function(k, v){
			var timeIndex = (k+1)*100;
			
			html += '<li mIndex="'+(k+1)+'" functionId="'+v.parent.FUNCTION_ID+'" functionSort="'+v.parent.FUNCTION_SORT+'" class="m-function-item">';
			html += '	<div data-am-scrollspy="{animation: \'slide-left\', delay: '+timeIndex+', repeat: false}" >';
			html += '		<div class="m-f-menu-header">';
			html += '			<span class="m-f-menu-tip" title="'+v.parent.FUNCTION_NAME+'">'+v.parent.FUNCTION_NAME+'</span>';
			html += '			<button type="button" class="am-close" title="删除">&times;</button>';
			html += '			<i class="am-icon-terminal" title="重命名"></i>';
			html += '			</div>';
			html += '		<div class="m-f-menu-list">';
			html += '			<ul id="menu'+k+1+'" class="block__list block__list_words">';
			
			// 组织子菜单
			$.each(v.sub, function(key, val){
				html += '			<li>';
				html += '				<span functionId="'+val.FUNCTION_ID+'" parentId="'+val.PARENT_ID+'" objectId="'+val.OBJECT_ID+'" objectName="'+val.OBJECT_NAME+'" functionSort="'+val.FUNCTION_SORT+'" title="点击对菜单建模">'+val.FUNCTION_NAME+'</span>';
				html += '				<button type="button" class="m-li-close am-close" title="删除">&times;</button>';
				html += '				<i class="m-li-edit am-icon-edit" title="配置"></i>';
				html += '			</li>';
			});
			
			html += '			</ul>';
			html += '		</div>';
			html += '	</div>';
			html += '</li>';
		});

		$("#functionList>ul").append(html);
		
		// 绑定事件
		_bindEvent();
		
		// 把要展示的html组织好后，再加载amazeui
		require(["../common/ui/amaze-ui/assets/js/amazeui.min.js"], function(){});
	};
	
	// 初始化功能
	var _initFunction = function(){
		// 初始化功能card拖动
		_initFunctionDrag();
	};
	
	// 初始化菜单
	var _initMenu = function(){
		// 初始化菜单item拖动
		_initMenuDrag();
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
	
	// 初始化页面建模弹出框
	var _initModelPageConfig = function(data){
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
		//$("#pageModelPop #menuTable select").selected();
	};
	
	// 绑定事件
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
			$(".m-nav-item-active").css("top", "105px");
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
		
		
		
		/******************菜单事件*******************/
		// 创建新功能的事件
		$("#newFunction").bind("click", function(){
			// 弹出弹出框，输入完成内容后在functionList后添加新的项目模块
			var $popModal = $("#newFunctionPop");
			$popModal.modal({
				relatedTarget: this,
			    onConfirm: function(e) {
			    	// 添加功能
			    	_addFunction();
			    },
			    onCancel: function(e) {
			        console.info("取消创建新功能");
			    }
			});
		});
		
		// 功能重命名事件
		$("body").on("click", ".m-f-menu-header .am-icon-terminal", function(){
			$editFunctionSpan = $(this).prevAll(".m-f-menu-tip");
			$("#editFunctionPop #functionName").val($editFunctionSpan.html());
			
			var $popModal = $("#editFunctionPop");
			$popModal.modal({
				relatedTarget: this,
			    onConfirm: function(e) {
			    	// 修改功能
			    	_editFunction();
			    },
			    onCancel: function(e) {
			        console.info("取消编辑功能");
			    }
			});
		});
		
		// 功能删除事件
		$("body").on("click", ".m-f-menu-header .am-close", function(){
			$delFunctionLi = $(this).parents("li.m-function-item");
			var functionName = $(this).prevAll(".m-f-menu-tip").html();
			// 修改弹出框的提示内容
			$("#delFunctionPop .input")
				.css("margin-bottom", "50px")
				.html("删除功能会把所属菜单和每个菜单的页面配置一起删除！<br/>您确定要删除 <span style='font-weight: bold;float:none;margin-right:0px;'>"+functionName+"</span> 功能吗？");
			
			/* 可能由于amazeui的弹出框的问题，先计算出要删除的key，并且要使用全局变量 */
			// 获取此功能和子菜单的主键
			delFunctionArray = [];
			var menuList = $(this).parents("li").find(".m-f-menu-list li");
			// 获取功能主键
			delFunctionArray.push($(this).parents("li").attr("functionId"));
			$.each(menuList, function(k, v){
				// 获取每个菜单主键
				delFunctionArray.push($(v).find("span").attr("functionId"));
			});
			
			var $popModal = $("#delFunctionPop");
			$popModal.modal({
				relatedTarget: this,
			    onConfirm: function(e) {
			    	// 删除功能
			    	_delFunction();
			    },
			    onCancel: function(e) {
			        console.info("取消删除功能");
			    }
			});
		});
		
		// 创建新菜单的事件
		$("#newMenu").bind("click", function(){
			// 把上次的下拉框移除掉，避免重复出现
			$("#newMenuPop #attrTable select, #newMenuPop #attrTable select").remove();
			$("#newMenuPop .am-selected").remove();
			
			// 首先要获取功能列表并且把功能列表写入到select中
			var functionLi = $(".m-function-item");
			var attrSelectHtml = '<select data-am-selected>';
			$.each(functionLi, function(k, v){
				var id = $(v).attr("functionId");
				var name = $(v).find(".m-f-menu-tip").html();
				if(k == 0){
					attrSelectHtml += '<option value="'+id+'" selected>'+name+'</option>';
				}else{
					attrSelectHtml += '<option value="'+id+'">'+name+'</option>';
				}
			});
			attrSelectHtml += '</select>';
			$("#newMenuPop #attrTable").append(attrSelectHtml);
			// 初始化amazeui下拉框
			$("#newMenuPop #attrTable select").selected();
			
			// 把表关联列表也写入到select中
			var assoSelectHtml = '<select data-am-selected>';
			$.each(assoDataArray, function(k, v){
				if(k == 0){
					assoSelectHtml += '<option key="'+v.o_id+'" value="'+v.name+'" selected>'+v.description+'</option>';
				}else{
					assoSelectHtml += '<option key="'+v.o_id+'" value="'+v.name+'">'+v.description+'</option>';
				}
			});
			assoSelectHtml += '</select>';
			$("#newMenuPop #assoTable").append(assoSelectHtml);
			// 初始化amazeui下拉框
			$("#newMenuPop #assoTable select").selected();
			
			// 弹出弹出框，输入完成内容后在functionList后添加新的项目模块
			var $popModal = $("#newMenuPop");
			$popModal.modal({
				relatedTarget: this,
			    onConfirm: function(e) {
			    	// 新增菜单
			    	_addMenu();
			    },
			    onCancel: function(e) {
			        console.info("取消创建新菜单");
			    }
			});
		});
		
		// 保存菜单顺序的事件
		$("#saveOrder").bind("click", function(){
			// 菜单排序
			_menuSort();
		});
		
		// 菜单打开的事件
		$("body").on("click", ".m-f-menu-list li>span", function(){
			var functionId   = $(this).attr("functionId");
			var functionName = $(this).html();
			var objectId     = $(this).attr("objectId");
			var objectName   = $(this).attr("objectName");
			
			// 修改弹出框的提示内容
			$("#openMenuPop .input").html("您要对 <span style='font-weight: bold;float:none;margin-right:0px;'>"+functionName+"</span> 菜单进行哪项建模操作？");
			
			var $popModal = $("#openMenuPop");
			$popModal.modal({
				relatedTarget: this,
			    onConfirm: function(e) {
			    	window.open("/cloud/model/index.html?isNew=false&functionId="+functionId+"&functionName="+functionName+"&objectId="+objectId+"&objectName="+objectName);
			    },
			    onCancel: function(e) {
			    	window.open("/cloud/model/index.html?isNew=true&functionId="+functionId+"&functionName="+functionName+"&objectId="+objectId+"&objectName="+objectName);
			    }
			});
		});
		
		// 菜单编辑事件
		$("body").on("click", ".m-f-menu-list .m-li-edit", function(){
			// 把上次的下拉框移除掉，避免重复出现
			$("#editMenuPop #attrTable select, #editMenuPop #attrTable select").remove();
			$("#editMenuPop .am-selected").remove();
			// 1.菜单名
			$editMenuSpan = $(this).prevAll("span");
			var functionName = $editMenuSpan.html();
			$("#editMenuPop #menuName").val(functionName);
			// 2.首先要获取功能列表并且把功能列表写入到select中
			var functionLi = $(".m-function-item");
			var attrSelectHtml = '<select data-am-selected>';
			$.each(functionLi, function(k, v){
				var id = $(v).attr("functionId");
				var name = $(v).find(".m-f-menu-tip").html();
				if(id == $editMenuSpan.attr("parentId")){
					attrSelectHtml += '<option value="'+id+'" selected>'+name+'</option>';
				}else{
					attrSelectHtml += '<option value="'+id+'">'+name+'</option>';
				}
			});
			attrSelectHtml += '</select>';
			$("#editMenuPop #attrTable").append(attrSelectHtml);
			// 初始化amazeui下拉框
			$("#editMenuPop #attrTable select").selected();
			
			// 3.把表关联列表也写入到select中
			var assoSelectHtml = '<select data-am-selected>';
			$.each(assoDataArray, function(k, v){
				if(v.o_id == $editMenuSpan.attr("objectId")){
					assoSelectHtml += '<option key="'+v.o_id+'" value="'+v.name+'" selected>'+v.description+'</option>';
				}else{
					assoSelectHtml += '<option key="'+v.o_id+'" value="'+v.name+'">'+v.description+'</option>';
				}
			});
			assoSelectHtml += '</select>';
			$("#editMenuPop #assoTable").append(assoSelectHtml);
			// 初始化amazeui下拉框
			$("#editMenuPop #assoTable select").selected();
			
			var $popModal = $("#editMenuPop");
			$popModal.modal({
				relatedTarget: this,
			    onConfirm: function(e) {
			    	// 修改菜单
			    	_editMenu();
			    },
			    onCancel: function(e) {
			    	console.info("取消修改菜单");
			    }
			});
		});
		
		// 删除菜单事件
		$("body").on("click", ".m-f-menu-list .m-li-close", function(){
			$delMenuLi = $(this).parent("li");
			var menuName = $(this).prevAll("span").html();
			// 修改弹出框的提示内容
			$("#delMenuPop .input")
				.css("margin-bottom", "50px")
				.html("删除菜单会把绑定到菜单的页面配置一起删除！<br/>您确定要删除 <span style='font-weight: bold;float:none;margin-right:0px;'>"+menuName+"</span> 菜单吗？");
			
			/* 可能由于amazeui的弹出框的问题，先计算出要删除的key，并且要使用全局变量 */
			// 获取菜单的主键
			delMenuKey = $(this).prevAll("span").attr("functionId");
			
			var $popModal = $("#delMenuPop");
			$popModal.modal({
				relatedTarget: this,
			    onConfirm: function(e) {
			    	// 删除菜单
			    	_delMenu();
			    },
			    onCancel: function(e) {
			        console.info("取消删除菜单");
			    }
			});
		});
	};
	
	
	// 初始化功能card的拖拽模块
	var _initFunctionDrag = function(){
		// 供拖拽所使用的全局变量
		var oUl       = $("#functionList>ul");
		var aDiv      = oUl.find(".m-f-menu-header");
		var aLi       = oUl.find(">li");
		//var aLi       = oUl.getElementsByTagName("li");
		var disX      = 0;
		var disY      = 0;
		var minZindex = 1;
		var aPos      = [];
		for(var i=0;i<aDiv.length;i++){
			var zli = $(aDiv[i]).parents(".m-function-item")[0];
			var t = zli.offsetTop+2; 
			var l = zli.offsetLeft;
			zli.style.top = t+"px";
			zli.style.left = l+"px";
			aPos[i] = {left:l,top:t};
			zli.index = i;
		}
		for(var i=0;i<aDiv.length;i++){
			var zli = $(aDiv[i]).parents(".m-function-item")[0];
			zli.style.position = "absolute";
			zli.style.margin = 0;
			setDrag(aDiv[i]);
		}
		
		// 拖拽
		function setDrag(obj){
			// 保存li
			var $zli = $(obj).parents(".m-function-item");
			
			obj.onmouseover = function(){
				obj.style.cursor = "move";
			}
			obj.onmousedown = function(event){
				var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
				var scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
				$zli[0].style.zIndex = minZindex++;
				// 当鼠标按下时计算鼠标与拖拽对象的距离
				disX = event.clientX +scrollLeft-$zli[0].offsetLeft;
				disY = event.clientY +scrollTop -$zli[0].offsetTop;
				document.onmousemove=function(event){
					// 当鼠标拖动时计算div的位置
					var l = event.clientX -disX + scrollLeft;
					var t = event.clientY -disY + scrollTop;
					$zli[0].style.left = l + "px";
					$zli[0].style.top = t + "px";
					for(var i=0;i<aDiv.length;i++){
						$(".active").removeClass("active");
						//$(aDiv[i]).removeClass("active");
					}
					var oNear = findMin($zli[0]);
					if(oNear){
						$(oNear).addClass("active");
					}
				}
				document.onmouseup = function(){
					document.onmousemove = null;  // 当鼠标弹起时移出移动事件
					document.onmouseup = null;  // 移出up事件，清空内存
					// 检测是否普碰上，在交换位置
					var oNear = findMin($zli[0]);
					if(oNear){
						var indexTemp = "";
						indexTemp = $zli.attr("mIndex");
						$zli.attr("mIndex", $(oNear).attr("mIndex"));
						$(oNear).attr("mIndex", indexTemp);
						$(".active").removeClass("active");
						oNear.style.zIndex = minZindex++;
						$zli[0].style.zIndex = minZindex++;
						startMove(oNear,aPos[$zli[0].index]);
						startMove($zli[0],aPos[oNear.index]);
						// 交换index
						oNear.index += $zli[0].index;
						$zli[0].index = oNear.index - $zli[0].index;
						oNear.index = oNear.index - $zli[0].index;
					}else{
						startMove($zli[0],aPos[$zli[0].index]);
					}
				}
				clearInterval($zli[0].timer);
				return false;  // 低版本出现禁止符号
			}
		};
		
		// 碰撞检测
		function colTest(obj1,obj2){
			var t1 = obj1.offsetTop;
			var r1 = obj1.offsetWidth+obj1.offsetLeft;
			var b1 = obj1.offsetHeight+obj1.offsetTop;
			var l1 = obj1.offsetLeft;

			var t2 = obj2.offsetTop;
			var r2 = obj2.offsetWidth+obj2.offsetLeft;
			var b2 = obj2.offsetHeight+obj2.offsetTop;
			var l2 = obj2.offsetLeft;

			if(t1>b2||r1<l2||b1<t2||l1>r2){
				return false;
			}else{
				return true;
			}
		};
		
		// 勾股定理求距离
		function getDis(obj1,obj2){
			var a = obj1.offsetLeft-obj2.offsetLeft;
			var b = obj1.offsetTop-obj2.offsetTop;
			return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
		};
		
		// 找到距离最近的
		// obj是当前li
		// aLi是所有的li
		function findMin(obj){
			var minDis = 999999999;
			var minIndex = -1;
			for(var i=0;i<aDiv.length;i++){
				var $li = $(aDiv[i]).parents(".m-function-item")[0];
				
				if(obj==$li)continue;
				if(colTest(obj,$li)){
					var dis = getDis(obj,$li);
					if(dis<minDis){
						minDis = dis;
						minIndex = i;
					}
				}
			}
			if(minIndex==-1){
				return null;
			}else{
				return $(aDiv[minIndex]).parents(".m-function-item")[0];
			}
		};
		
		function getClass(cls){
		    var ret = [];
		    var els = document.getElementsByTagName("*");
		    for (var i = 0; i < els.length; i++){
		        // 判断els[i]中是否存在cls这个className;.indexOf("cls")判断cls存在的下标，如果下标>=0则存在;
		        if(els[i].className === cls || els[i].className.indexOf("cls")>=0 || els[i].className.indexOf(" cls")>=0 || els[i].className.indexOf(" cls ")>0){
		            ret.push(els[i]);
		        }
		    }
		    return ret;
		};
		
		// 解决JS兼容问题获取正确的属性值
		function getStyle(obj,attr){
			return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
		};
		
		function startMove(obj,json,fun){
			clearInterval(obj.timer);
			obj.timer = setInterval(function(){
				var isStop = true;
				for(var attr in json){
					var iCur = 0;
					// 判断运动的是不是透明度值
					if(attr=="opacity"){
						iCur = parseInt(parseFloat(getStyle(obj,attr))*100);
					}else{
						iCur = parseInt(getStyle(obj,attr));
					}
					var ispeed = (json[attr]-iCur)/8;
					// 运动速度如果大于0则向下取整，如果小于0想上取整；
					ispeed = ispeed>0?Math.ceil(ispeed):Math.floor(ispeed);
					// 判断所有运动是否全部完成
					if(iCur!=json[attr]){
						isStop = false;
					}
					// 运动开始
					if(attr=="opacity"){
						obj.style.filter = "alpha:(opacity:"+(json[attr]+ispeed)+")";
						obj.style.opacity = (json[attr]+ispeed)/100;
					}else{
						obj.style[attr] = iCur+ispeed+"px";
					}
				}
				// 判断是否全部完成
				if(isStop){
					clearInterval(obj.timer);
					if(fun){
						fun();
					}
				}
			},30);
		};
	};
	
	
	// 初始化菜单item的拖拽模块
	var _initMenuDrag = function(){
		var itemArray = $(".block__list");
		
		// 循环每个菜单ui，初始化每个ui可拖拽插件
		for(var i=0, len = itemArray.length; i<len; i++){
			Sortable.create(itemArray[i], {
				group: "words",
				animation: 250,
				store: {
					get: function (sortable) {
						var order = localStorage.getItem(sortable.options.group);
						return order ? order.split('|') : [];
					},
					set: function (sortable) {
						var order = sortable.toArray();
						localStorage.setItem(sortable.options.group, order.join('|'));
					}
				},
				onAdd: function (evt){ console.log('onAdd.foo:', [evt.item, evt.from]); },
				onUpdate: function (evt){ console.log('onUpdate.foo:', [evt.item, evt.from]); },
				onRemove: function (evt){ console.log('onRemove.foo:', [evt.item, evt.from]); },
				onStart:function(evt){ console.log('onStart.foo:', [evt.item, evt.from]);},
				onSort:function(evt){ console.log('onStart.foo:', [evt.item, evt.from]);},
				onEnd: function(evt){ console.log('onEnd.foo:', [evt, evt.item, evt.from]);}
			});
		}
	};
	
	
	// 添加功能
	var _addFunction = function(){
    	// 1.获取当前页面中功能最大的序号
    	var functionList = $(".m-function-item");
    	var sortArray = [];
    	if(functionList.length == 0){ sortArray.push(0); }
    	$.each(functionList, function(k, v){
    		sortArray.push(parseInt($(v).attr("functionSort")));
    	});
    	
    	// 2.获取新增数据的默认值
    	var FUNCTION_NAME = $("#newFunctionPop #functionName").val();
    	var FUNCTION_SORT = ""+(Math.max.apply(null, sortArray)+1);
    	var PARENT_ID = "0";
    	var PROJECT_ID = $("#newFunctionPop #projectName").val();
    	
    	
    	// 4.组织新增的功能html添加到页面
    	// 计算下位置
    	var $parentDiv = $("#functionList");
    	var $prevLi = $($(".m-function-item").eq($(".m-function-item").length-1)[0]);
    	var prevTop = parseInt($prevLi.css("top").replace(/[^0-9]/ig,""));
    	var prevLeft = parseInt($prevLi.css("left").replace(/[^0-9]/ig,""));
    	var top = 0;
    	var left = 0;
    	if($parentDiv.width() > prevLeft+230){
    		// 可以接着插入一个li
    		top = prevTop;
    		left = prevLeft+230;
    	}else{
    		// 需要从下一行插入li
    		top = prevTop+245;
    		left = 0;
    	}
    	
    	// 3.提交数据
    	var requestData = new Object();
    	requestData.rows = [];
    	var filter = new Object();
    	filter.key= "FUNCTION_ID";
    	requestData.filter = filter;
    	var fun = new Object();
    	fun.FUNCTION_NAME = FUNCTION_NAME;
    	fun.FUNCTION_SORT = FUNCTION_SORT;
    	fun.PARENT_ID = PARENT_ID;
    	fun.PROJECT_ID = PROJECT_ID;
    	requestData.rows[0] = fun;
    	$.ajax({
    	    type : "post",
    	    url: "../DataAction",
    	    data: {
    	    	"object": "function_info",
    	        "method": "add1",
    	        "parameter":$.toJSON(requestData)
    	    },
    	    dataType:"json",
    	    success: function(data) {
    	    	if(data.key != ""){
    	    		// 4.组织新增的功能html添加到页面
    	        	// 计算下位置
    	        	var $parentDiv = $("#functionList");
    	        	var $prevLi = $($(".m-function-item").eq($(".m-function-item").length-1)[0]);
    	        	var prevTop = parseInt($prevLi.css("top").replace(/[^0-9]/ig,""));
    	        	var prevLeft = parseInt($prevLi.css("left").replace(/[^0-9]/ig,""));
    	        	var top = 0;
    	        	var left = 0;
    	        	if($parentDiv.width() > prevLeft+230){
    	        		// 可以接着插入一个li
    	        		top = prevTop;
    	        		left = prevLeft+230;
    	        	}else{
    	        		// 需要从下一行插入li
    	        		top = prevTop+245;
    	        		left = 0;
    	        	}
    	        	
    	        	var html = '';
    	        	html += '<li mIndex="'+FUNCTION_SORT+'" functionId="'+data.key+'" functionSort="'+FUNCTION_SORT+'" class="m-function-item" style="top: '+top+'px; left: '+left+'px; position: absolute; margin: 0px;">';
    	    		html += '	<div data-am-scrollspy="{animation: \'slide-bottom\', delay: 100, repeat: false}" class="am-scrollspy-init am-scrollspy-inview am-animation-slide-bottom">';
    	    		html += '		<div class="m-f-menu-header">';
    	    		html += '			<span class="m-f-menu-tip" title="'+FUNCTION_NAME+'">'+FUNCTION_NAME+'</span>';
    	    		html += '			<button type="button" class="am-close" title="删除">&times;</button>';
    	    		html += '			<i class="am-icon-terminal" title="重命名"></i>';
    	    		html += '			</div>';
    	    		html += '		<div class="m-f-menu-list">';
    	    		html += '			<ul id="menu'+FUNCTION_SORT+'" class="block__list block__list_words">';
    	    		html += '			</ul>';
    	    		html += '		</div>';
    	    		html += '	</div>';
    	    		html += '</li>';
    	    		
    	        	$("#functionList>ul").append(html);
    	        	// 重新绑定一下功能li的拖拽事件
    	        	_initFunctionDrag();
    	        	_popupTip("新增功能成功！", "info");
    	    	}else{
    	    		_popupTip("新增功能失败！", "error");
    	    	}
    	    }
    	});
	};
	
	// 修改功能
	var _editFunction = function(){
		var functionId = $editFunctionSpan.parents(".m-function-item").attr("functionId");
		var functionName = $("#editFunctionPop #functionName").val();
		
		var requestData = new Object();
		requestData.rows = [];
		var filter = new Object();
		filter.FUNCTION_ID= functionId;
		requestData.filter = filter;
		var fun = new Object();
		fun.FUNCTION_NAME = functionName;
		requestData.rows[0] = fun;
		
		$.ajax({
    	    type : "post",
    	    url: "../DataAction",
    	    data: {
    	    	"object": "function_info",
    	        "method": "save",
    	        "parameter":$.toJSON(requestData)
    	    },
    	    dataType:"json",
    	    success: function(data) {
    	    	if(data.code == "1"){
    	    		_popupTip("修改功能成功！", "info");
    	    		$editFunctionSpan.html(functionName);
    	    	}else{
    	    		_popupTip("修改功能失败！", "error");
    	    	}
	        }
	    });
	};
	
	// 删除功能
	var _delFunction = function(){
		var delStr = delFunctionArray.join(",")+"";
		
		var requestData = new Object();
		var filter = new Object();
		filter.FUNCTION_ID = delStr;
		requestData.filter = filter;
		
		$.ajax({
    	    type : "post",
    	    url: "../DataAction",
    	    data: {
    	    	"object": "function_info",
    	        "method": "delete",
    	        "parameter":$.toJSON(requestData)
    	    },
    	    dataType:"json",
    	    success: function(data) {
    	    	if(data.code == "1"){
    	    		_popupTip("删除功能及菜单成功！", "info");
    	        	subMenuLen = subMenuLen - (delFunctionArray.length - 1);
    	        	// 设置下菜单的个数
    	    		$("#functionNum").html(subMenuLen);
    	    		
    	    		// 删除效果
    	        	$delFunctionLi.addClass("opacity-hide");
    	        	setTimeout(function(){
    	        		$delFunctionLi.remove();
    	        	},400);
    	        	
    	    		// 接着删除每个菜单关联的配置
    	    		_delPageConfig(delStr);
    	    	}else{
    	    		_popupTip("删除功能及菜单失败！", "error");
    	    	}
	        }
	    });
	};
	
	// 新增菜单
	var _addMenu = function(){
		// 要先获取到输入的数据，然后根据所属去获取所属下面的最大排序
		var FUNCTION_NAME = $("#newMenuPop #menuName").val();
		var FUNCTION_SORT = "";
		var PARENT_ID = $("#newMenuPop #attrTable option:selected").attr("value");
		var PROJECT_ID = "52";
		var OBJECT_ID = $("#newMenuPop #assoTable option:selected").attr("key");
		var OBJECT_NAME = $("#newMenuPop #assoTable option:selected").attr("value");
		
		var sortArray = [];
		var menuLi = $(".m-function-item[functionId='"+PARENT_ID+"'] .block__list li");
		if(menuLi.length == 0){ sortArray.push(0); }
		$.each(menuLi, function(k, v){
			sortArray.push(parseInt($(v).find("span").attr("functionSort")));
		});
		FUNCTION_SORT = ""+(Math.max.apply(null, sortArray)+1);
		
		var requestData = new Object();
    	requestData.rows = [];
    	var filter = new Object();
    	filter.key= "FUNCTION_ID";
    	requestData.filter = filter;
    	var fun = new Object();
    	fun.FUNCTION_NAME = FUNCTION_NAME;
    	fun.FUNCTION_SORT = FUNCTION_SORT;
    	fun.PARENT_ID = PARENT_ID;
    	fun.PROJECT_ID = PROJECT_ID;
    	fun.OBJECT_ID = OBJECT_ID;
    	fun.OBJECT_NAME = OBJECT_NAME;
    	requestData.rows[0] = fun;
    	
    	$.ajax({
    	    type : "post",
    	    url: "../DataAction",
    	    data: {
    	    	"object": "function_info",
    	        "method": "add1",
    	        "parameter":$.toJSON(requestData)
    	    },
    	    dataType:"json",
    	    success: function(data) {
    	    	if(data.key != ""){
    	    		var html = '';
        	    	html += '<li>';
        			html += '	<span functionId="'+data.key+'" parentId="'+PARENT_ID+'" objectId="'+OBJECT_ID+'" objectName="'+OBJECT_NAME+'" functionSort="'+FUNCTION_SORT+'" title="点击对菜单建模">'+FUNCTION_NAME+'</span>';
        			html += '	<button type="button" class="m-li-close am-close" title="删除">&times;</button>';
        			html += '	<i class="m-li-edit am-icon-edit" title="配置"></i>';
        			html += '</li>';
        			$(".m-function-item[functionId='"+PARENT_ID+"'] ul").append(html);
					subMenuLen ++;
					// 设置下菜单的个数
					$("#functionNum").html(subMenuLen);
    	        	_popupTip("新增菜单成功！", "info");
    	    	}else{
    	    		_popupTip("新增菜单失败！", "error");
    	    	}
    	    }
    	});
	};
	
	// 菜单排序
	var _menuSort = function(){
		var menuList = [];
		
		var pLi = $(".m-function-item");
		var pLiList = [];  // 用来存放排序后的父LI
		
		var pSortArray = [];
		$.each(pLi, function(k, v){
			pSortArray.push(parseInt($(v).attr("mIndex")));
		});
		pSortArray = pSortArray.sort();
		
		$.each(pSortArray, function(k, v){
			pLiList.push($(".m-function-item[mIndex='"+v+"']"));
		});
		
		$.each(pLiList, function(k, v){
			var pSortObj = new Object();
			pSortObj["FUNCTION_ID"] = $(v).attr("functionId");
			pSortObj["FUNCTION_SORT"] = ""+(k+1);
			pSortObj["PARENT_ID"] = "0";
			menuList.push(pSortObj);
			
			// 处理子菜单
			var sLi = $(v).find(".block__list li");
			$.each(sLi, function(key, val){
				var sSortObj = new Object();
				sSortObj["FUNCTION_ID"] = $(val).find("span").attr("functionId");
				sSortObj["FUNCTION_SORT"] = ""+(key+1);
				sSortObj["PARENT_ID"] = $(v).attr("functionId");
				menuList.push(sSortObj);
			});
		});
		
		var requestData = new Object();
    	requestData.rows = [];
    	var filter = new Object();
    	filter.FUNCTION_ID = "";
    	requestData.filter = filter;
    	requestData.rows = menuList;
		
    	$.ajax({
    	    type : "post",
    	    url: "../DataAction",
    	    data: {
    	    	"object": "function_info",
    	        "method": "save",
    	        "parameter":$.toJSON(requestData)
    	    },
    	    dataType:"json",
    	    success: function(data) {
    	    	console.info(data);
    	    	if(data.code == "1"){
    	    		_popupTip("修改功能和菜单顺序成功！", "info");
    	    	}else{
    	    		_popupTip("修改功能和菜单顺序失败！", "error");
    	    	}
    	    }
    	});
	};
	
	// 修改菜单
	var _editMenu = function(){
		// 要先获取到输入的数据，然后根据所属去获取所属下面的最大排序
		var FUNCTION_ID = $editMenuSpan.attr("functionId");
		var FUNCTION_NAME = $("#editMenuPop #menuName").val();
		var PARENT_ID = $("#editMenuPop #attrTable option:selected").attr("value");
		var OBJECT_ID = $("#editMenuPop #assoTable option:selected").attr("key");
		var OBJECT_NAME = $("#editMenuPop #assoTable option:selected").attr("value");
		
		var requestData = new Object();
    	requestData.rows = [];
    	var filter = new Object();
    	filter.FUNCTION_ID = FUNCTION_ID;
    	requestData.filter = filter;
    	
    	var fun = new Object();
    	fun.FUNCTION_NAME = FUNCTION_NAME;
    	fun.PARENT_ID = PARENT_ID;
    	fun.OBJECT_ID = OBJECT_ID;
    	fun.OBJECT_NAME = OBJECT_NAME;
    	requestData.rows[0] = fun;
    	
    	$.ajax({
    	    type : "post",
    	    url: "../DataAction",
    	    data: {
    	    	"object": "function_info",
    	        "method": "save",
    	        "parameter":$.toJSON(requestData)
    	    },
    	    dataType:"json",
    	    success: function(data) {
    	    	if(data.code == "1"){
    	    		_popupTip("修改菜单成功！", "info");
    	    		var beforeParentId = $editMenuSpan.attr("parentId");  // 获取没改之前的所属
    	        	var afterParentId  = PARENT_ID;  // 获取当前选择的所属
    	        	
    	        	if(beforeParentId != afterParentId){
    	        		// 不一样说明修改了所属，li要删除然后在新的所属下面加上
    	        		$editMenuSpan.parent("li").remove();
    	        		var FUNCTION_SORT = "";
    	        		var sortArray = [];
    	        		var menuLi = $(".m-function-item[functionId='"+PARENT_ID+"'] .block__list li");
    	        		if(menuLi.length == 0){ sortArray.push(0); }
    	        		$.each(menuLi, function(k, v){
    	        			sortArray.push(parseInt($(v).find("span").attr("functionSort")));
    	        		});
    	        		FUNCTION_SORT = ""+(Math.max.apply(null, sortArray)+1);
    	        		var html = '';
    	    	    	html += '<li>';
    	    			html += '	<span functionId="'+FUNCTION_ID+'" parentId="'+PARENT_ID+'" objectId="'+OBJECT_ID+'" objectName="'+OBJECT_NAME+'" functionSort="'+FUNCTION_SORT+'" title="点击对菜单建模">'+FUNCTION_NAME+'</span>';
    	    			html += '	<button type="button" class="m-li-close am-close" title="删除">&times;</button>';
    	    			html += '	<i class="m-li-edit am-icon-edit" title="配置"></i>';
    	    			html += '</li>';
    	    			$(".m-function-item[functionId='"+PARENT_ID+"'] ul").append(html);
    	        	}else{
    	        		$editMenuSpan.attr({
    	        			"parentId" : PARENT_ID,
    	        			"objectId" : OBJECT_ID,
    	        			"objectName" : OBJECT_NAME,
    	        			"functionSort" : FUNCTION_SORT
    	        		}).html(FUNCTION_NAME);
    	        	}
    	    	}else{
    	    		_popupTip("修改菜单失败！", "error");
    	    	}
	        }
	    });
	};
	
	// 删除菜单
	var _delMenu = function(){
		var requestData = new Object();
		var filter = new Object();
		filter.FUNCTION_ID = delMenuKey;
		requestData.filter = filter;
		
		$.ajax({
    	    type : "post",
    	    url: "../DataAction",
    	    data: {
    	    	"object": "function_info",
    	        "method": "delete",
    	        "parameter":$.toJSON(requestData)
    	    },
    	    dataType:"json",
    	    success: function(data) {
    	    	if(data.code == "1"){
    	    		_popupTip("删除菜单成功！", "info");
			    	subMenuLen --;
			    	// 设置下菜单的个数
					$("#functionNum").html(subMenuLen);
					
					// 删除效果
			    	$delMenuLi.addClass("opacity-hide");
			    	setTimeout(function(){
			    		$delMenuLi.remove();
			    	},400);
    	        	
    	    		// 接着删除菜单关联的配置
    	    		_delPageConfig(delMenuKey);
    	    	}else{
    	    		_popupTip("删除菜单失败！", "error");
    	    	}
	        }
	    });
	};
	
	// 删除每个菜单关联的配置
	var _delPageConfig = function(keys){
		var requestData = new Object();
		var filter = new Object();
		filter.FUNCTION_ID = keys;
		requestData.filter = filter;
		
		$.ajax({
    	    type : "post",
    	    url: "../DataAction",
    	    data: {
    	    	"object": "page_config",
    	        "method": "delete",
    	        "parameter":$.toJSON(requestData)
    	    },
    	    dataType:"json",
    	    success: function(data) {
    	    	if(data.code == "1"){
    	    		_popupTip("删除关联的页面配置成功！", "info");
    	    	}else{
    	    		_popupTip("删除关联的页面配置失败！", "error");
    	    	}
	        }
	    });
	};
	
	// 打开菜单弹出框
	var _openMenuListModel = function(){
		var $popModal = $("#pageModelPop");
		$popModal.modal({
			relatedTarget: this,
		    onConfirm: function(e) {
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
			// 初始化导航
			_initNav();
			// 初始化工具条
			_initBar();
			// 初始化数据
			_initData();
		},
		// 暴露给外部的接口
		popupTip: function(msg, shortCutFunction){
			_popupTip(msg, shortCutFunction);
		},
	};
};



















