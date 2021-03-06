
(function($,undefined){
	$.fn.table = function(options,param){
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options == 'string') {
			var fn = this[0][options];
			if($.isFunction(fn)){
				return fn.apply(this, otherArgs);
			}else{
				throw ("table - No such method: " + options);
			}
		}

		return this.each(function(){
			var para = {};    // 保留参数
			var self = this;  // 保存组件对象
			var oriData = {};    // 保存从后台请求的原始的数据
			var nowPage = 0;     // 保存当前页数
			var dataCount = 0;   // 保存数据的总个数
			var tableWidth = 0;  // table的总宽度
			var fieldList = [];  // 保存数据源字段列表
			var isAdap = false;  // 数据源字段是否自适应宽度
			var ue = "";
			
			
			var defaults = {
					"width"      : "500",
					"height"     : "250",
					"key"        : "",    // 主键列
					"field"      : [],
					"objectName" : "",   // 关联数据对象name
					"url"        : "..",  // 富文本的url
					"adaptive"   : false, // 数据源字段自适应宽度方式
					"popup"      : true,  // 是否显示弹出框
					"pattern"    : false, // 模式   true:字段方式获取数据   false:普通添加方式获取数据
					"example"    : false, // 实例   当前创建的是否是model中的实例
					"check"      : true,  // 全选
					"number"     : true,  // 序号
					"edit"       : true,  // 编辑
					"del"        : true,  // 删除
					"allDel"     : true,  // 全部删除
					"filter"     : true,  // 过滤
					"paging"     : true,  // 分页条
					"zebra"      : true,  // 斑马线
					"dataTotal"  : 0,     // 数据总个数  在普通数据添加方式中首先要给分页传递这个参数
					"rowsPerPage": 5,     // 一页多少行数据
					"pagingComplete": function(nNowPage){  // 翻页的回调方法
						console.info(nNowPage);
					},
					"delComplete": function(aRowId){  // 删除数据的回调方法
						console.info(aRowId);
					},
					"editComplete": function(editData){  // 编辑数据的回调方法
						console.info(editData);
					},
					"filterComplete": function(filterData){  // 过滤条件的回调方法
						console.info(filterData);
					}
			};
			
			para = $.extend(defaults,options);
			
			this.init = function(){
				this.initParam();   // 初始化一下创建时候的参数
				this.initShellHtml();
				this.initPlugs();
			};
			
			// 初始化一下创建组件所需要的数据
			this.initParam = function(){
				var fieldWidth = 0;
					fieldList = [];
				$.each(para.field, function(k, v){
					if(v.width!=null){
						if(para.adaptive){  // 采用自适应模式
							fieldList.push({"id":v.id, "name":v.name});
							isAdap = true;
						}else{
							fieldWidth = fieldWidth+parseInt(v.width);
							fieldList.push({"id":v.id, "name":v.name, "width":v.width});
						}
					}else{
						if(para.adaptive){  // 采用自适应模式
							fieldList.push({"id":v.id, "name":v.name});
							isAdap = true;
						}else{  // 设置默认宽度
							fieldWidth = fieldWidth+parseInt(v.width);
							fieldList.push({"id":v.id, "name":v.name, "width":150});
						}
					}
				});
				
				if(!isAdap){
					// 计算表格总宽度
					self.calcTableWidth(fieldWidth);
				}
			};
			
			// 计算表格总宽度
			this.calcTableWidth = function(fieldWidth){
				tableWidth = 0;
				// 判断全选、序号、编辑、删除功能是否选择
				para.check ? tableWidth+=35 : tableWidth;
				para.number ? tableWidth+=50 : tableWidth;
				para.edit ? tableWidth+=60 : tableWidth;
				para.del ? tableWidth+=60 : tableWidth;
				tableWidth = tableWidth+fieldWidth+2;
			};
			
			// 创建表格的外壳--包括th和cons和分页条等所需要的html外壳代码
			this.initShellHtml = function(){
				// 创建表头html
				self.createThsHtml();
				// 创建内容html
				self.createContentHtml();
				// 创建工具栏html
				self.createToolbarHtml();
				// 创建弹出框html
				self.createPopHtml();
				
				// 设置th和cons的宽度
				if(!isAdap){
					$(self).find(".ths-table").css("width", tableWidth+"px");
					$(self).find(".cons-table").css("width", tableWidth+"px");
				}
			};
			
			// 初始化插件
			this.initPlugs = function(){
				if(para.pattern){  // 从字段获取数据
					// 根据源字段列表获取元字段数据
					var fieldData = new Object();
					if(para.example){  // 如果当前是model中创建的实例
						fieldData = self.getDataByExample(0);
					}else{
						fieldData = self.getDataByField(0);
					}
					dataCount = fieldData.count;
				}else{  // 外部自己添加数据
					dataCount = para.dataTotal;
				}
				// 初始化分页插件
				self.initPaging();
				
				// 绑定过滤按钮事件
				self.bindFilterEvent();
			};
			
			
			/**
			 * 功能: 创建表头html
			 * 参数: 无
			 * 返回: 无
			 */
			this.createThsHtml = function(){
				var html = '';
				html += '<div class="ths">';
				html += '	<table class="ths-table">';
				html += '		<tr>';
				html += 			organAllThHtml();
				html += 			organNumberThHtml();
				html += 			organFieldThHtml();
				html += 			organEditThHtml();
				html += 			organDelThHtml();
				html += '		</tr>';
				html += '	</table>';
				html += '</div>	';
				$(self).empty().append(html);
			};
			
			/**
			 * 功能: 创建内容html
			 * 参数: 无
			 * 返回: 无
			 */
			this.createContentHtml = function(){
				var html = '';
				html += '<div class="cons">';
				html += '	<table class="cons-table"></table>';
				html += '</div>	';
				$(self).append(html);
			};
			
			/**
			 * 功能: 创建工具栏html
			 * 参数: 无
			 * 返回: 无
			 */
			this.createToolbarHtml = function(){
				var html = '';
				html += '<div class="toolbar">';
				html += '	<div class="tool-fun">';
				html += 		organToolFunHtml();
				html += '	</div>';
				html += '	<div class="tool-paging">';
				html += 		organPagingHtml();
				html += '	</div>';
				html += '</div>	';
				$(self).append(html);
			};
			
			/**
			 * 功能: 根据参数，组织出全选th代码
			 * 参数: 无
			 * 返回: html 组织后的全选的html代码
			 */
			var organAllThHtml = function(){
				var html = '';
				if(para.check){
					html += '<th class="th th-all">';
					html += '	<div>';
					html += '		<input type="checkbox" id="th-all" />';
					html += '		<label for="th-all" class="check-box"></label> ';
					html += '	</div>';
					html += '</th>';
				}
				
				return html;
			};
			
			/**
			 * 功能: 根据参数，组织出序号th代码
			 * 参数: 无
			 * 返回: html 组织后的序号的html代码
			 */
			var organNumberThHtml = function(){
				var html = '';
				if(para.number){
					html += '<th class="th th-num">';
					html += '	<div>序号</div>'; 
					html += '</th>'; 
				}
				
				return html;
			};
			
			/**
			 * 功能: 根据字段参数，组织出字段在table中的html代码
			 * 参数: 无
			 * 返回: html 组织后的字段的html代码
			 */
			var organFieldThHtml = function(){
				var html = '';
				if(!isAdap){  // 根据用户设置的列宽
					$.each(fieldList, function(k, v){
						html += '<th fieldId="'+v.id+'" class="th th-field" style="width:'+v.width+'px;">';
						html += '	<div>'+v.name+'</div>';
						html += '</th>';
					});
				}else{
					// 计算元数据字段列的每列宽度
					var proportion = self.calcSourceFieldWidth();
					$.each(fieldList, function(k, v){
						html += '<th fieldId="'+v.id+'" class="th th-field" style="width:'+proportion+'px;">';
						html += '	<div>'+v.name+'</div>';
						html += '</th>';
					});
				}
				
				return html;
			};
			
			/**
			 * 功能: 根据参数，组织出编辑th代码
			 * 参数: 无
			 * 返回: html 组织后的编辑的html代码
			 */
			var organEditThHtml = function(){
				var html = '';
				if(para.edit){
					html += '<th class="th th-edit">';
					html += '	<div>编辑</div>';
					html += '</th>';
				}
				
				return html;
			};
			
			/**
			 * 功能: 根据参数，组织出删除th代码
			 * 参数: 无
			 * 返回: html 组织后的删除的html代码
			 */
			var organDelThHtml = function(){
				var html = '';
				if(para.del){
					html += '<th class="th th-del">';
					html += '	<div>删除</div>';
					html += '</th>';
				}
				
				return html;
			};
			
			/**
			 * 功能: 根据数据，组织每页显示的数据
			 * 参数: data 这一页显示的数据  plen 一页显示多少个  nowPage 当前页数
			 * 返回: html 组织后的删除的html代码
			 */
			var organContentData = function(data, plen, nowPage){
				// 计算元数据字段列的每列宽度
				var proportion = self.calcSourceFieldWidth();
				var html = '';
				for(var i=0, length=data.length; i<length; i++){
					var zebra = "";
					if(para.zebra){
						if(i%2==0){  // 偶数
							zebra = "zebra";
						}
					}
					var item =  '<tr rowId='+(i+1)+' class="tr '+zebra+'">';
					if(para.check){
						item += '<td class="td td-all">';
						item += '	<div>';
						item += '		<input type="checkbox" id="tr-all-'+(nowPage*plen+i+1)+'" />';
						item += '		<label for="tr-all-'+(nowPage*plen+i+1)+'" class="check-box"></label>';
						item += '	</div>';
						item += '</td>';
					}
					if(para.number){
						item += '<td class="td td-num">';
						item += '	<div>'+(nowPage*plen+i+1)+'</div>';
						item += '</td>';
					}
					
					for(var j=0, len=para.field.length; j<len; j++){
						var width = proportion;
						if(fieldList[j].width!=null){
							if(!para.adaptive){  // 不采用自适应模式
								width = fieldList[j].width;
							}
						}else{
							if(!para.adaptive){  // 不采用自适应模式
								width = 150;
							}
						}
						item += '<td field="'+fieldList[j].id+'" key="'+fieldList[j].id+(nowPage*plen+i+1)+'" class="td" style="width:'+width+'px;">';
						item += '	<div>'+data[i][fieldList[j].id]+'</div>';
						item += '</td>';
					}
					
					if(para.edit){
						item += '<td class="td td-edit">';
						item += '	<div>';
						item += '		<a id="'+(i+1)+'editData" class="trigger" data-dialog="'+(i+1)+'editPopup" href="javascript:void(0)" rowId="'+(i+1)+'">编辑</a>';
						item += '	</div>';
						item += '</td>';
					}
					if(para.del){
						item += '<td class="td td-del">';
						item += '	<div>';
						item += '		<a href="javascript:void(0)" rowId="'+(i+1)+'">删除</a>';
						item += '	</div>';
						item += '</td>';
					}
					item += '</tr>';
					html += item;
				}
				
				return html;
			};
			
			/**
			 * 功能: 根据参数，组织出过滤、全部删除代码
			 * 参数: 无
			 * 返回: html 组织后的过滤、全部删除的html代码
			 */
			var organToolFunHtml = function(){
				var html = '';
				if(para.allDel){
					html += '<div class="all-del">';
					html += '	<button id="allDel" class="btn btn-3 btn-3e">全部删除</button>';
					html += '</div>';	
				}
				if(para.filter){
					html += '<div class="filter">';
					html += '	<button id="filterData" data-dialog="filterPopup" class="trigger btn btn-3 btn-3e">数据过滤</button>';
					html += '</div>';
				}
				
				return html;
			};
			
			/**
			 * 功能: 根据参数，组织出分页条代码
			 * 参数: 无
			 * 返回: html 组织后的分页条的html代码
			 */
			var organPagingHtml = function(){
				var html = '';
				if(para.paging){
					html += '<div id="pagination" class="paging"></div>';
				}
				
				return html;
			};
			
			/**
			 * 功能: 创建弹出框html
			 * 参数: 无
			 * 返回: 无
			 */
			this.createPopHtml = function(){
				// 循环创建两个弹出框，第一个是过滤，第二个是编辑
				for(var i=0; i<2; i++){
					var popId = "";
					var buttonId = "";
					var tip = "";
					if(i==0){
						popId = "filterModel";
						buttonId = "filterButton";
						tip = "过滤条件";
					}else{
						popId = "editModel";
						buttonId = "editButton";
						tip = "修改内容";
					}
					
					// 创建空白html
					var popHtml = '';
					popHtml += '<div class="modal fade" id="'+popId+'" tabindex="-1" role="dialog" aria-labelledby="'+popId+'Label" aria-hidden="true">';
					popHtml += '	<div class="modal-dialog">';
					popHtml += '		<div class="modal-content">';
					popHtml += '			<div class="modal-header">';
					popHtml += '		        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>';
					popHtml += '		        <h4 class="modal-title" id="myModalLabel">'+tip+'</h4>';
					popHtml += '		    </div>';
					popHtml += '		    <div class="modal-body">';
					popHtml += '				<div class="row-fluid">';
					popHtml += '				</div>';
					popHtml += '		   	</div>';
					popHtml += '		    <div class="modal-footer">';
					popHtml += '		    	<button id="'+buttonId+'" type="button" data-dismiss="modal" class="btn blue">提交更改</button>';
					popHtml += '		    	<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>';
					popHtml += '			</div>';
					popHtml += '		</div>';
					popHtml += '	</div>';
					popHtml += '</div>';
					$("body").append(popHtml);
				}
				
				// 绑定提交事件
				$("button#filterButton").bind("click", function(){
					console.info("过滤");
					var filterData = [];
					var domList = $("#filterModel .row-fluid div[domType]");
					$.each(domList, function(k, v){
						filterData.push({"field":$(v).attr("field"), "value":$(v).find("input").val()});
					});
					// 需要调用filterComplete回调方法，把设置的 条件返回到初始化插件的方法
					para.filterComplete(filterData);
				});
				$("button#editButton").bind("click", function(){
					console.info("编辑");
					var data = [];
					var beforeData = [];
					var domList = $("#editModel .row-fluid div[domType]");
					$.each(domList, function(k, v){
						if($(v).attr("domType")=="input"){
							data.push({"field":$(v).attr("field"), "value":$(v).find("input[type='text']").val()});
							beforeData.push({"field":$(v).attr("field"), "value":$(v).find("input[type='hidden']").val()});
						}else if($(v).attr("domType")=="rich"){
							data.push({"field":$(v).attr("field"), "value":ue.getContent()});
							beforeData.push({"field":$(v).attr("field"), "value":$(v).find("input[type='hidden']").val()});
						}else if($(v).attr("domType")=="other"){
							data.push({"field":$(v).attr("field"), "value":$(v).find("span").attr("value")});
						}
					});
					
					var editData = new Object();
					editData["key"] = para.key;
					editData["editData"] = data;
					editData["beforeData"] = beforeData;
					
					// 需要调用editComplete回调方法，把修改后的数据返回到初始化插件的方法
					para.editComplete(editData);
				});
			};
			
			/**
			 * 功能: 添加事件
			 * 参数: 无
			 * 返回: 无
			 */
			this.addEvent = function(){
				var thAll = $(self).find(".th-all input");
				var tdAll = $(self).find(".td-all input");
				var consDiv = $(self).find(".cons");
				var thsTable = $(self).find(".ths-table");
				
				// 添加全选的点击事件
				thAll.unbind("click").bind("click", function(){ 
					if(thAll.is(":checked")){
						tdAll.attr("checked",'checked');
					}else{
						tdAll.removeAttr("checked");
					}
			    }); 
				
				// 添加单独数据的checkbox点击事件
				tdAll.unbind("click").bind("click", function(){ 
					var checkLen = 0;
					
					$.each(tdAll, function(k, v){
						if($(v).is(":checked")){ checkLen++; }
					});
					
					if(checkLen == tdAll.length){
						if(!thAll.is(":checked")){
							thAll.attr("checked",'checked');
						}
					}else{
						if(thAll.is(":checked")){
							thAll.removeAttr("checked");
						}
					}
			    });
				
				// 添加内容div的滚动条事件
				consDiv.scroll(function(e){
					thsTable.css("left", -consDiv.scrollLeft()+"px");
				});
				
				// 添加删除按钮事件
				if(para.del){
					$(self).find(".td-del a").bind("click", function(){
						var rowId = parseInt($(this).parents("tr").attr("rowId"));
						self.delData([rowId]);
					});
				}
				
				// 添加全部删除按钮事件
				if(para.allDel){
					$(self).find("#allDel").bind("click", function(){
						var selectArray = $(".table").table("getSelection");
						self.delData(selectArray);
					});
				}
				
				// 添加编辑按钮事件
				if(para.edit){
					if(!para.example){
						require([
						         para.url+"/ueditor1.6.1/ueditor.config", 
						         para.url+"/ueditor1.6.1/ueditor.all"], function(){
							$(self).find(".td-edit a").unbind("click").bind("click", function(e){
								var $tds = $(this).parents("tr").find("td[field]");
								// 组织编辑页面需要的数据源字段信息，并且初始化弹出框插件
								self.dealtModelByFieldInfo($tds);
							});
						});
					}
				}
			};
			
			/**
			 * 功能: 组织编辑页面需要的数据源字段信息，并且初始化弹出框插件
			 * 参数: $tds 源字段td
			 * 返回: 无
			 */
			this.dealtModelByFieldInfo = function($tds){
				// 得到列描述
				var descArray = [];
				$.each($(self).find(".th-field"), function(k, v){
					descArray.push($(v).find("div").html());
				});
				var fieldData = [];
				// 首先组织出字段id、字段描述、字段的值，稍后会向这个数据中添加字段类型
				$.each($tds, function(k, v){
					fieldData.push({
						"field":$(v).attr("field"), 
						"key":$(v).attr("key"),
						"name":descArray[k], 
						"value":$(v).find("div").html(),
						"type":"label"
					});
				});
				console.info(fieldData);
				// ajax--要根据字段获取字段的类型
				
				// 组织一下过滤条件
				var str = "";
				$.each(fieldData, function(k, v){
					if(k==0){
						str = v.field;
					}else{
						str += ","+v.field;
					}
				});
				
				// 从后台取出字段的类型信息
				var obj = {
						"fields" : "OBJECT_FIELD,FIELD_TYPE",
						"filter" : {"OBJECT_NAME":para.objectName, "OBJECT_FIELD" : str}
				};
				$.ajax({
					type : "post",
					url : "../DataAction",
					data : {
						"object" : "field_type",
						"method" : "queryObj",
						"parameter" : $.toJSON(obj)
					},
					dataType : "json",
					asyn : false,
					success : function(data) {
						// 把整个页面的配置保存到缓存中
						if(data.rows.length>0){
							var typeArray = [];
							$.each(data.rows, function(k, v){
								typeArray.push({"id":v.OBJECT_FIELD, "type":v.FIELD_TYPE});
							});
							
							// 如果这个字段不存在typeArray中，是要补充进去
							$.each(fieldData, function(fk, fv){
								$.each(typeArray, function(tk, tv){
							    	if(fv.field==tv.id){
							    		fv["type"] = tv["type"];
							    	}	
								});
							});
							
							// 根据源字段信息初始化弹出框插件
							self.initModelByFieldInfo(fieldData);
						}
					}
				});
				
				
			};
			
			/**
			 * 功能: 根据源字段信息初始化弹出框插件
			 * 参数: fieldData 源字段信息
			 * 返回: 无
			 */
			this.initModelByFieldInfo = function(fieldData){
				// 先清空原来的内容
				$("#editModel .row-fluid").empty();
				// 根据类型创建容器
				$.each(fieldData, function(k, v){
					console.info(v);
					if(v.type != "input" && v.type != "rich"){
						// 组织出普通的span容器
						var span = '';
						span += '<div class="item" domType="other" field="'+v.field+'">';
						span += '	<span class="item-span" id="'+v.key+'" value="'+v.value+'">'+v.name+' : </span>';
						span += '	<span>'+v.value+'</span>';
						span += '</div>'; 
						$("#editModel .row-fluid").append(span);
						$("#editModel").modal();
					}else if(v.type == "input"){
						// 组织出input的容器，并且设置数据
						var input = '';
						input += '<div class="item" domType="input" field="'+v.field+'">';
						input += '    <span class="item-span">'+v.name+' : </span>';
						input += '    <input type="text" id="'+v.key+'" value="'+v.value+'"></input>';
						input += '    <input type="hidden" id="'+v.key+'_hidden" value="'+v.value+'"></input>';
						input += '</div>'; 
						$("#editModel .row-fluid").append(input);
						$("#editModel").modal();
					}else if(v.type == "rich"){
						// 组织出rich的容器，并且加载js文件然后创建
						var rich = '';
						rich += '<div domType="rich" field="'+v.field+'">';
						rich += '    <script id="'+v.key+'" name="content" type="text/plain"></script>';
						rich += '    <input type="hidden" id="'+v.key+'_hidden" value="'+v.value+'"></input>';
						rich += '</div>'; 
						$("#editModel .row-fluid").append(rich);
						ue = UE.getEditor(v.key, {
							// 初始化参数
							initialFrameHeight: 200,   // 高度默认值
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
						
						// 因为第一次创建富文本，需要创建过程，所以先暂时设置延迟 再添加数据
						// 查询数据  设置内容
						setTimeout(function(){
							ue.setContent(v.value);  // 想富文本添加从数据库中查询出来的值
						},500);
							
						$("#editModel").modal();
					}
				});
			};
			
			/**
			 * 功能: 根据源字段列表获取元字段数据
			 * 参数: pageId 当前请求页数
			 * 返回: 源字段数据
			 */
			this.getDataByField = function(pageId){
				// 组织请求的列的列表
				var aFieldList = [];
				for(var i=0, length=para.field; i<length; i++){
					aFieldList.push(para.field[i].id);
				}
				// 根据列请求数据--ajax
				var oFieldData = new Object();
				oFieldData["count"] = 20;
				oFieldData["nowPage"] = pageId;
				oFieldData["data"] = [
				                      {"ID":"01","NAME":"张一","AGE":20},
				                      {"ID":"02","NAME":"张二","AGE":21},
				                      {"ID":"03","NAME":"张三","AGE":22},
				                      {"ID":"04","NAME":"张四","AGE":22},
				                      {"ID":"05","NAME":"张五","AGE":22} 
				                      ];
				
				return oFieldData;
			};
			
			/**
			 * 功能: 根据源字段列表获取元字段数据--供model中创建例子使用
			 * 参数: pageId 当前请求页数
			 * 返回: 源字段的例子数据
			 */
			this.getDataByExample = function(pageId){
				var oFieldData = new Object();
				oFieldData["count"] = 1;
				oFieldData["nowPage"] = 0;
				oFieldData["data"] = [{"ID":"01","NAME":"张三","AGE":20}];
				return oFieldData;
			};
			
			/**
			 * 功能: 初始化分页条插件
			 * 参数: 无
			 * 返回: 无
			 */
			this.initPaging = function(){
				$(self).find("#pagination").pagination(dataCount, {
					current_page : nowPage,
					items_per_page : para.rowsPerPage,
					num_display_entries : 3,
					callback : function(page_id){
						if(para.pattern){  // 从字段获取数据
							// 模拟ajax去后端读取页数，获取数据并渲染列表的过程
							$(self).find(".cons-table").empty();
							var aData = new Object();
							if(para.example){  // 如果当前是model中创建的实例
								aData = self.getDataByExample(page_id);
							}else{
								aData = self.getDataByField(page_id);
							}
							oriData = aData;  // 保存到全局变量
							nowPage = page_id;  // 保存当前页数
							dataCount = aData.count;
							var html = organContentData(aData.data, para.rowsPerPage, aData.nowPage);
							$(self).find(".cons-table").append(html);
						}else{
							nowPage = page_id;  // 保存当前页数
						}
						
						// 回调用户定义的翻页方法
						para.pagingComplete(nowPage);
						// 绑定td选中事件
						self.addEvent();
					},
					load_first_page : true,
					prev_text : '上一页',
					next_text : '下一页'
				});
			};
			
			/**
			 * 功能: 绑定过滤按钮事件
			 * 参数: 无
			 * 返回: 无
			 */
			this.bindFilterEvent = function(){
				// 在建模模式下点击不出现效果
				//if(para.pattern){
				if(para.popup){
					if(para.filter){
						$(self).find("#filterData").bind("click", function(){
							$("#filterModel .row-fluid").empty();
							// 组织过滤字段的条件
							var data = [];
							$.each($(self).find(".th-field"), function(k, v){
								data.push({"id":$(v).attr("fieldId"),"desc":$(v).find("div").html(),"value":""});
								
								var field = $(v).attr("fieldId");
								var desc = $(v).find("div").html();
								var filterItem = '';
								filterItem += '<div class="item" domType="filter" field="'+field+'" desc="'+desc+'" >';
								filterItem += '    <span class="item-span" >'+desc+' : </span>';
								filterItem += '    <input type="text" id="'+field+'" value=""></input>';
								filterItem += '</div>'; 
								$("#filterModel .row-fluid").append(filterItem);
							});
							$("#filterModel").modal();
							console.info(data);
						});
						
					}
				}
					
				//}
				
			};
			
			/**
			 * 功能: 重新设置全选字段
			 * 参数: isShow  是否显示
			 * 返回: 无
			 * 示例: $(".table").table("resetAllField",true);
			 */
			this.resetAllField = function(bIsShow){
				para.check = bIsShow;
				
				if(bIsShow){
					// 显示
					var sCheckHtml = organAllThHtml();
					$(self).find(".ths tr").prepend(sCheckHtml);
					
					for(var i=0, length=oriData.data.length; i<length; i++){
						var item = '';
						item += '<td class="td td-all">';
						item += '	<div>';
						item += '		<input type="checkbox" id="tr-all-'+(nowPage*para.rowsPerPage+i+1)+'" />';
						item += '		<label for="tr-all-'+(nowPage*para.rowsPerPage+i+1)+'" class="check-box"></label>';
						item += '	</div>';
						item += '</td>';
						$(self).find(".cons-table tr").eq(i).prepend(item);
					}
					// 绑定td选中事件
					self.addEvent();
				}else{
					// 不显示
					$(self).find(".th-all").remove();
					$(self).find(".td-all").remove();
				}
				// 重新设置数据列的布局
				self.resetSourceFieldWidth();
			};
			
			/**
			 * 功能: 重新设置序号字段
			 * 参数: isShow  是否显示
			 * 返回: 无
			 * 示例: $(".table").table("resetNumberField",true);
			 */
			this.resetNumberField = function(bIsShow){
				para.number = bIsShow;
				
				if(bIsShow){
					// 显示
					var sNumberHtml = organNumberThHtml();
					
					if(para.check){  // 加在全选框后面 
						$(self).find(".th-all").after(sNumberHtml);
					}else{
						$(self).find(".ths tr").prepend(sNumberHtml);
					}
					
					for(var i=0, length=oriData.data.length; i<length; i++){
						var item = '';
						item += '<td class="td td-num">';
						item += '	<div>'+(nowPage*para.rowsPerPage+i+1)+'</div>';
						item += '</td>';
						if(para.check){  // 加在全选框后面 
							$(self).find(".cons-table tr").eq(i).find(".td-all").after(item);
						}else{
							$(self).find(".cons-table tr").eq(i).prepend(item);
						}
					}
				}else{
					// 不显示
					$(self).find(".th-num").remove();
					$(self).find(".td-num").remove();
				}
				// 重新设置数据列的布局
				self.resetSourceFieldWidth();
			};
			
			
			/**
			 * 功能: 重新设置数据源字段
			 * 参数: 字段配置数组  比如：[{"id":"ID12", "name":"ID1"},{"id":"NAME1", "name":"名字1"}]
			 * 返回: 无
			 * 示例: $(".table").table("resetSourceField", a);
			 */
			this.resetSourceField = function(aFieldList){
				/* 1.初始化环境 */
				// 删除原来的字段
				$(self).find(".th-field").remove();
				// 重新添加组织后的字段
				para.field = aFieldList;
				self.initParam();
				// 设置th和cons的宽度
				if(!isAdap){
					$(self).find(".ths-table").css("width", tableWidth+"px");
					$(self).find(".cons-table").css("width", tableWidth+"px");
				}
				
				/* 2.重新组织ths的html */
				var sFieldHtml = organFieldThHtml();
				// 判断html代码添加位置
				if(para.number){
					$(self).find(".th-num").after(sFieldHtml);
				}else if(para.check){
					$(self).find(".th-all").after(sFieldHtml);
				}else{
					$(self).find(".ths tr").prepend(sFieldHtml);
				}
				
				/* 3.重新组织cons的html */
				$(self).find(".paging").empty();
				if(para.pattern){
					var fieldData = new Object();
					if(para.example){  // 如果当前是model中创建的实例
						fieldData = self.getDataByExample(0);
					}else{
						fieldData = self.getDataByField(0);
					}
					dataCount = fieldData.count;
				}else{
					dataCount = para.dataTotal;
				}
				
				// 初始化分页插件
				self.initPaging();
			};
			
			/**
			 * 功能: 重新设置编辑字段
			 * 参数: isShow  是否显示
			 * 返回: 无
			 * 示例: $(".table").table("resetEditField",true);
			 */
			this.resetEditField = function(bIsShow){
				para.edit = bIsShow;
				
				if(bIsShow){
					// 显示
					var sEditHtml = organEditThHtml();
					if(para.del){  // 加在删除字段前面
						$(self).find(".th-del").before(sEditHtml);
					}else{  // 加在tr最后面
						$(self).find(".ths tr").append(sEditHtml);
					}
					
					for(var i=0, length=oriData.data.length; i<length; i++){
						var item = '';
						item += '<td class="td td-edit">';
						item += '	<div>';
						item += '		<a id="'+(i+1)+'editData" class="trigger" data-dialog="'+(i+1)+'editPopup" href="javascript:void(0)" rowId="'+(i+1)+'">编辑</a>';
						item += '	</div>';
						item += '</td>';
						if(para.del){  // 加在删除字段前面
							$(self).find(".cons-table tr").eq(i).find(".td-del").before(item);
						}else{
							$(self).find(".cons-table tr").eq(i).append(item);
						}
					}
					
//					// 得到列描述
//                    var descArray = [];
//                    $.each($(self).find(".th-field"), function(k, v){
//                        descArray.push($(v).find("div").html());
//                    });
//                    
//                    $.each($(self).find(".td-edit a"), function(k, v){
//                        var rowId = parseInt($(v).parents("tr").attr("rowId"));
//                        var trData = self.getData([rowId])[0];
//                        var data = [];
//                        var i=0;
//                        $.each(trData, function(key, val){
//                            data.push({"id":key,"desc":descArray[i],"value":val});
//                            i++;
//                        });
//                        
//                        $(v).zyPopup({
//                            "width" : 400,
//                            "height" : 300,
//                            "id" : $(v).attr("data-dialog"),
//                            "trigger" : $(v)[0],
//                            "title" : "编辑",
//                            "data" : data,
//                            "onConfirm" : function(){
//                                var data = $(v).zyPopup("getData");
//                                console.info(data);
//                            }
//                        });
//                    });
				}else{
					// 不显示
					$(self).find(".th-edit").remove();
					$(self).find(".td-edit").remove();
					
//					var editPopups = $(".zy-popup");
//                    // 删除之前创建的弹出框
//                    $.each(editPopups, function(k, v){
//                        if($(v).attr("id").indexOf("editPopup")>=0){
//                            $(v).remove();
//                        }
//                    });
				}
				// 重新设置数据列的布局
				self.resetSourceFieldWidth();
			};
			
			/**
			 * 功能: 重新设置删除字段
			 * 参数: isShow  是否显示
			 * 返回: 无
			 * 示例: $(".table").table("resetDelField",true);
			 */
			this.resetDelField = function(bIsShow){
				para.del = bIsShow;
				
				if(bIsShow){
					// 显示
					var sDelHtml = organDelThHtml();
					$(self).find(".ths tr").append(sDelHtml);
					
					for(var i=0, length=oriData.data.length; i<length; i++){
						var item = '';
						item += '<td class="td td-del">';
						item += '	<div>';
						item += '		<a href="javascript:void(0)" rowId="'+(i+1)+'">删除</a>';
						item += '	</div>';
						item += '</td>';
						$(self).find(".cons-table tr").eq(i).append(item);
					}
					
					// 添加删除按钮事件
					if(para.del){
						$(self).find(".td-del a").bind("click", function(){
							var rowId = parseInt($(this).parents("tr").attr("rowId"));
							self.delData([rowId]);
						});
					}
				}else{
					// 不显示
					$(self).find(".th-del").remove();
					$(self).find(".td-del").remove();
				}
				// 重新设置数据列的布局
				self.resetSourceFieldWidth();
			};
			
			/**
			 * 功能: 重新设置全部删除按钮
			 * 参数: isShow  是否显示
			 * 返回: 无
			 * 示例: $(".table").table("resetAllDel",true);
			 */
			this.resetAllDel = function(bIsShow){
				para.allDel = bIsShow;
				
				if(bIsShow){
					var sAllDelHtml = '';
					sAllDelHtml += '<div class="all-del">';
					sAllDelHtml += '	<button id="allDel" class="btn btn-3 btn-3e">全部删除</button>';
					sAllDelHtml += '</div>';	
					// 显示
					if(para.filter){
						$(self).find(".tool-fun .filter").before(sAllDelHtml);
					}else{
						$(self).find(".tool-fun").append(sAllDelHtml);
					}
					
					// 添加全部删除按钮事件
					if(para.allDel){
						$(self).find("#allDel").bind("click", function(){
							var selectArray = $(".table").table("getSelection");
							self.delData(selectArray);
						});
					}
				}else{
					// 不显示
					$(self).find(".tool-fun .all-del").remove();
				}
				// 重新设置内容的高度
				self.resetContentHeight();
			};
			
			/**
			 * 功能: 重新设置过滤数据
			 * 参数: isShow  是否显示
			 * 返回: 无
			 * 示例: $(".table").table("resetFilter",true);
			 */
			this.resetFilter = function(bIsShow){
				para.filter = bIsShow;
				
				if(bIsShow){
					var sFilterHtml = '';
					sFilterHtml += '<div class="filter">';
					sFilterHtml += '	<button id="filterData" data-dialog="filterPopup" class="trigger btn btn-3 btn-3e">数据过滤</button>';
					sFilterHtml += '</div>';	
					// 显示
					$(self).find(".tool-fun").append(sFilterHtml);
					
					// 绑定过滤按钮事件
					self.bindFilterEvent();
				}else{
					// 不显示
					$(self).find(".tool-fun .filter").remove();
				}
				// 重新设置内容的高度
				self.resetContentHeight();
			};
			
			/**
			 * 功能: 重新设置分页条
			 * 参数: isShow  是否显示
			 * 返回: 无
			 * 示例: $(".table").table("resetPaging",true);
			 */
			this.resetPaging = function(bIsShow){
				para.paging = bIsShow;
				
				if(bIsShow){
					// 显示
					var sPagingHtml = organPagingHtml();
					$(self).find(".tool-paging").append(sPagingHtml);
					self.initPaging();
				}else{
					// 不显示
					$(self).find(".tool-paging").empty();
				}
				// 重新设置内容高度
				self.resetContentHeight();
			};
			
			// 重新设置布局
			this.resetSourceFieldWidth = function(){
				// 初始化一下表格的整体宽度
				self.initParam();
				if(!isAdap){
					// 设置th和cons的宽度
					$(self).find(".ths-table").css("width", tableWidth+"px");
					$(self).find(".cons-table").css("width", tableWidth+"px");
				}else{
					var proportion = self.calcSourceFieldWidth();
					$.each($(".th-field"), function(key, val){
						$(val).width(proportion);
					});
					for(var i=0, length=oriData.data.length; i<length; i++){
						for(var j=0, len=para.field.length; j<len; j++){
							$(self).find(".cons-table td[field='"+fieldList[j].id+(i+1)+"']").width(proportion);
						}
					}
				}
			};
			
			// 计算元数据字段列的每列宽度
			this.calcSourceFieldWidth = function(){
				// 计算出数据列的列宽
				var possWidth = 0;  // 已经占有的宽度
				var remaWidth = 0;  // 剩余的宽度
				// 判断全选、序号、编辑、删除功能是否选择
				para.check ? possWidth+=35 : possWidth;
				para.number ? possWidth+=50 : possWidth;
				para.edit ? possWidth+=60 : possWidth;
				para.del ? possWidth+=60 : possWidth;

				// 根据还剩余的宽度计算每一个数据列的宽度
				remaWidth = $(self).width()-20 - possWidth;
				
				return (remaWidth/para.field.length);
			};
			
			// 重新设置内容高度
			this.resetContentHeight = function(){
				var nBottom = 0,
				    nHeight = 0;
				if(para.allDel || para.filter || para.paging){
					nBottom = 45;
					nHeight = 35;
				}
				
				$(self).find(".cons").css("bottom", nBottom+"px");
				$(self).find(".toolbar").css("height", nHeight+"px");
			};
			
			
			/**
			 * 功能: 添加数据
			 * 参数: aNewData  新增的数据数组
			 * 返回: 是否添加成功
			 * 示例: $(".table").table("addData", [{"ID":"01","NAME":"张一1","AGE":20}]);
			 */
			this.addData = function(aNewData){
				// 1.组织一下此次添加的数据
				if(aNewData.length > para.rowsPerPage){
					// 截取一页显示的数量
					aNewData.splice(para.rowsPerPage, aNewData.length-para.rowsPerPage);
				}
				
				// 2.组织数据，添加到table
				var html = organContentData(aNewData, para.rowsPerPage, nowPage);
				$(self).find(".cons-table").empty().append(html);
				
				// 3.重新绑定删除、编辑和全部删除事件

				// 添加全选事件
				if(para.check){
					var thAll = $(self).find(".th-all input");
					var tdAll = $(self).find(".td-all input");
					
					// 添加全选的点击事件
					thAll.unbind("click").bind("click", function(){ 
						if(thAll.is(":checked")){
							tdAll.attr("checked",'checked');
						}else{
							tdAll.removeAttr("checked");
						}
				    }); 
					
					// 添加单独数据的checkbox点击事件
					tdAll.unbind("click").bind("click", function(){ 
						var checkLen = 0;
						
						$.each(tdAll, function(k, v){
							if($(v).is(":checked")){ checkLen++; }
						});
						
						if(checkLen == tdAll.length){
							if(!thAll.is(":checked")){
								thAll.attr("checked",'checked');
							}
						}else{
							if(thAll.is(":checked")){
								thAll.removeAttr("checked");
							}
						}
				    });
				}
				
				// 添加删除按钮事件
				if(para.del){
					$(self).find(".td-del a").unbind("click").bind("click", function(){
						var rowId = parseInt($(this).parents("tr").attr("rowId"));
						self.delData([rowId]);
					});
				}
				
				// 添加全部删除按钮事件
				if(para.allDel){
					$(self).find("#allDel").unbind("click").bind("click", function(){
						var selectArray = $(".table").table("getSelection");
						self.delData(selectArray);
					});
				}
				
				// 添加编辑按钮事件
				if(para.edit){
					if(!para.example){
						require([
								para.url+"/ueditor1.6.1/ueditor.config", 
								para.url+"/ueditor1.6.1/ueditor.all"], function(){
							$(self).find(".td-edit a").unbind("click").bind("click", function(e){
								var $tds = $(this).parents("tr").find("td[field]");
								// 组织编辑页面需要的数据源字段信息，并且初始化弹出框插件
								self.dealtModelByFieldInfo($tds);
							});
						});
					}
				}
				
				// 4.返回添加结果
				return true;
			};
			
			/**
			 * 功能: 删除数据
			 * 参数: aRowId  删除的行号
			 * 返回: 回调用户设置的delComplete方法，并把删除的数据返回
			 * 示例: $(".table").table("delData", [2,4]);
			 */
			this.delData = function(aRowId){
				// 1.先获取删除的数据
				var aDelData = self.getData(aRowId);
				
				// 2.遍历所有的数据，根据tr的rowId删除数据
				var trs = $(self).find(".cons-table tr");
				for(var i=0, length=aRowId.length; i<length; i++){
					$.each(trs, function(k, v){
						if($(v).attr("rowId") == aRowId[i]){
							$(v).remove();
						}
					});
				}
				
				trs = $(self).find(".cons-table tr");
				// 重新设置trs的rowId
				$.each(trs, function(k, v){
					$(v).attr("rowId", k+1);
				});
				
				// 处理下返回给调用层主键下的字段的值
				var cbData = {"key":para.key, "delList":""};
				$.each(aDelData, function(key, val){
					if(key==0){
						cbData.delList = val[para.key];
					}else{
						cbData.delList += ","+val[para.key];
					}
				});
				// 3.返回删除结果
				para.delComplete(cbData);
			};
			
			/**
			 * 功能: 编辑数据
			 * 参数: nRowId  编辑的行号
			 * 返回: 回调用户设置的editComplete方法，并把编辑后的数据返回
			 * 示例: $(".table").table("editData", 2);
			 */
			this.editData = function(nRowId){
				// 1.弹框输入新的数据
				
				// 2.把新的数据覆盖原来的数据
				
				// 3.返回修改前和修改后的数据
				
				para.editComplete("之前的数据", "之后的数据");
			};
			
			/**
			 * 功能: 获取选中数据的行号
			 * 参数: 无
			 * 返回: selectArray 选中的行号数组
			 * 示例: $(".table").table("getSelection");
			 */
			this.getSelection = function(){
				var selectArray = [];
				var trs = $(self).find(".cons-table tr");
				$.each(trs, function(k, v){
					if($(v).find("input").is(":checked")){
						selectArray.push(parseInt($(v).attr("rowId")));
					}
				});
				
				return selectArray;
			};
			
			/**
			 * 功能: 根据行号获取数据
			 * 参数: aRowId  行号
			 * 返回: 数据
			 * 示例: $(".table").table("getData", [2,4]);
			 */
			this.getData = function(aRowId){
				var data = [];
				for(var i=0, length=aRowId.length; i<length; i++){
					var rowData = $(self).find(".cons-table tr").eq(aRowId[i]-1);
					var tds = rowData.find("td[field]");
					if(tds.length>0){
						var d = new Object();
						$.each(tds, function(k,v){
							//d[$(v).attr("field").replace(/[^a-z]/ig,"")] = $(v).find("div").html();
							d[$(v).attr("field")] = $(v).find("div").html();
						});
						data.push(d);
					}
				}
				
				return data;
			};
			
			
			// 初始化上传控制层插件
			this.init(self);
		});
	};
})(jQuery);

