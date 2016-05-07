/*
 * alignLine.js 拖拽元素的对齐线功能js
 * by zhangyan 2015-01-26
 */

var AlignLine = function(){
	
	// 初始化
	this.init = function(){  
		var self = this;
		
		self.bindEvent();
	};
	
	// 绑定事件
	this.bindEvent = function(){
		
	};
	
	// 显示4条线
	this.showLine = function(x, y, w, h){
		// 根据元素的x、y、width、height来计算4条线出现的位置
		moveLinePosition(x, y, w, h);
		setShowLine();
	};
	
	// 移动4条线
	this.moveLine = function(x, y, w, h){
		// 根据元素的x、y、width、height来计算4条线出现的位置
		moveLinePosition(x, y, w, h);
	};
	
	// 隐藏4条线
	this.hideLine = function(){
		$("#alTop, #alBottom, #alLeft, #alRight").hide();
	};
	
	// 根据元素的x、y、width、height来计算4条线出现的位置
	var moveLinePosition = function(x, y, w, h){
		$("#alTop").css("top", (x+40)+"px");  
		$("#alBottom").css("top", (x+40-1+h)+"px");  // 40是因为文章标题有40PX  1是因为使用的border上边框
		$("#alLeft").css("left", y+"px");  
		$("#alRight").css("left", (y+w-1)+"px");  // 1是因为使用的border左边框
	};
	
	// 设置显示
	var setShowLine = function(){
		$("#alTop, #alBottom, #alLeft, #alRight").show();
	};
		
		
};











