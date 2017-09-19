var shutterSwitch = function(){
	//变量的定义
	var _self = this;

	var totalNum = 0;								//移动元素的总数
	var nowIndex = 0;								//当前元素的下标
	var moveFlag = true;							//是否可以移动
	var nowImg = "";								//当前需要切换的图片
	var shutterBox,shutterImgsBox,shutterEffectBox;	//父级元素,图片的父级元素,效果父级元素
	var shutterImgsBoxH,shutterImgsBoxW;			//父级元素宽高
	var shutterIndexEle,paginationEle;				//切换的元素,导航的元素
	var wordInfoBox;								//文字信息元素
	var paginationBox;								//导航父级元素
	var prevBtn,nextBtn;							//向前,向后btn
	var onStart,onComplete;							//切换开始前的回调，切换结束后的回调
	var delayTime = 5000;							//切换的延时时间
	var autoPlay = true,autoTime;					//自动播放
	var animeTypes = ["fade","row-bar-move","row-bar-cross","col-bar-move","col-bar-cross","square-disappear","square-random","square-shrink"];

	//初始化
	_self.init = function(ele,options){
		var defaultOpt = {
			auto:true,
			delay:5000,
			pagination:true,
			paginationEvent:false,
			onStart:function(id){},
			onComplete:function(id){}
		};

		_self.Opts = $.extend(defaultOpt,options);

		shutterBox = ele;
		shutterImgsBox = ele.find('.shutter-imgs-box');
		shutterEffectBox = ele.find('.shutter-effect-box');
		wordInfoBox = ele.find('.info-word');
		prevBtn = ele.find('.shutter-prev');
		nextBtn = ele.find('.shutter-next');
		shutterIndexEle = shutterImgsBox.children('li');

		onStart = _self.Opts.onStart;
		onComplete = _self.Opts.onComplete;
		delayTime = _self.Opts.delay;
		autoPlay = _self.Opts.auto;
		totalNum = shutterIndexEle.length;
		shutterImgsBoxH = shutterImgsBox.height();
		shutterImgsBoxW = shutterImgsBox.width();

		if(_self.Opts.pagination){
			if(shutterBox.find('.pagination').length > 0) paginationBox = shutterBox.find('.pagination');
			else{
				shutterBox.append('<div class="pagination"></div>');
				paginationBox = shutterBox.find('.pagination');
			}
			renderPagination();
		}
		
		shutterIndexEle.hide();
		shutterIndexEle.eq(0).show();
		eventBind();
		autoPlaySwitch();
	}//end func

	//事件绑定
	function eventBind(){
		prevBtn.on("click",_self.PrevItem);
		nextBtn.on("click",_self.NextItem);
	}//end func

	//下一个
	_self.NextItem = function(){
		var id = nowIndex + 1;
		id = id >= totalNum ? 0 : id;
		switchAppointIndex(id);
	}//end func

	//上一个
	_self.PrevItem = function(){
		var id = nowIndex - 1;
		id = id < 0 ? totalNum - 1 : id;
		switchAppointIndex(id);
	}//end func

	//渲染导航
	function renderPagination(){
		var cont = "";
		for (var i = 0; i < totalNum; i++) {
			var act = i == 0 ? "active" : "";
			cont += '<span data-val="'+i+'" class="'+act+'"></span>';
		};
		paginationBox.append(cont);
		paginationEle = paginationBox.find('span');
		if(_self.Opts.paginationEvent){
			paginationEle.on("click",function(){
				if(!$(this).hasClass('active')){
					var id = parseInt($(this).attr('data-val'));
					switchAppointIndex(id);
				}
			});
		}
	}//end func

	//自动切换
	function autoPlaySwitch(){
		if(autoPlay){
			clearTimeout(autoTime);
			autoTime = setTimeout(function(){
				_self.NextItem();
			},delayTime);
		}
	}//end func

	//跳转到指定页
	function switchAppointIndex(id){
		if(moveFlag){
			moveFlag = false;
			nowImg = shutterIndexEle.eq(nowIndex).attr('data-img');
			var switchAnime = shutterIndexEle.eq(nowIndex).attr('data-type') || "random";
			wordInfoBox.fadeOut(300,function(){
				switchAnimeType(switchAnime,id,function(){
					nowIndex = id;
					moveFlag = true;
					onComplete(nowIndex);
					paginationEle.removeClass('active');
					paginationEle.eq(nowIndex).addClass('active');
					autoPlaySwitch();
					wordInfoBox.fadeIn(300);
				});
			});
		}
	}//end func

	//选择切换动画
	function switchAnimeType(type,next,callback){
		if(type == "random") type = animeTypes[Math.ceil(Math.random()*(animeTypes.length - 1))];
		onStart(nowIndex);
		switch(type){
			case "fade":
				fadeAnime(next,callback);
				break;
			case "row-bar-move":
				creatRowBar();
				RowBarMoveAnime(next,callback);
				break;
			case "row-bar-cross":
				creatRowBar();
				RowBarCrossAnime(next,callback);
				break;
			case "col-bar-move":
				creatColBar();
				ColBarMoveAnime(next,callback);
				break;
			case "col-bar-cross":
				creatColBar();
				ColBarCrossAnime(next,callback);
				break;
			case "square-disappear":
				creatSquare();
				squareDisappearAnime(next,callback);
				break;
			case "square-random":
				creatSquare();
				squareRandomAnime(next,callback);
				break;
			case "square-shrink":
				creatSquare();
				squareShrinkAnime(next,callback);
		}
	}//end func

	/************************切块形状**********************/
	//生成横版的bar
	function creatRowBar(){
		var cont = "";
		var width = shutterImgsBoxW;
		var height =  shutterImgsBoxH / 10;
		for (var i = 0; i < 10; i++) {
			cont += '<div style="position: absolute; top: '+height*i+'px; left: 0; width: '+width+'px; height: '+height+'px; overflow: hidden; "> <img src="'+nowImg+'" style="position: absolute; top: -'+height*i+'px; left: 0; width: '+shutterImgsBoxW+'px; height: '+shutterImgsBoxH+'px; "> </div>';
		};
		shutterEffectBox.empty().append(cont).show();
	}//end func

	//生成竖版的bar
	function creatColBar(){
		var cont = "";
		var width = shutterImgsBoxW / 20;
		var height =  shutterImgsBoxH;
		for (var i = 0; i < 20; i++) {
			cont += '<div style="position: absolute; top: 0px; left: '+width*i+'px; width: '+width+'px; height: '+height+'px; overflow: hidden; "> <img src="'+nowImg+'" style="position: absolute; top: 0px; left: '+width*-i+'px; width: '+shutterImgsBoxW+'px; height: '+shutterImgsBoxH+'px; "> </div>';
		};
		shutterEffectBox.empty().append(cont).show();
	}//end func

	//生成正方形
	function creatSquare(){
		var cont = "";
		var width = shutterImgsBoxW / 20;
		var height =  shutterImgsBoxH / 10;
		for (var i = 0; i < 20; i++) {
			for (var j = 0; j < 10; j++) {
				cont += '<div style="position: absolute; top: '+height*j+'px; left: '+width*i+'px; width: '+width+'px; height: '+height+'px; overflow: hidden; "> <img src="'+nowImg+'" style="position: absolute; top: '+height*-j+'px; left: '+width*-i+'px; width: '+shutterImgsBoxW+'px; height: '+shutterImgsBoxH+'px; "> </div>';
			};
		};
		shutterEffectBox.empty().append(cont).show();
	}//end func
	/************************切块形状**********************/

	/************************各种动画**********************/
	//淡入淡出动画
	function fadeAnime(next,callback){
		shutterIndexEle.eq(next).css('z-index', '1').show();
		shutterIndexEle.eq(nowIndex).css('z-index', '6').fadeOut(500,function(){
			if(callback) callback();
		});
	}//end func

	//横版的bar移动的动画
	function RowBarMoveAnime(next,callback){
		shutterIndexEle.eq(next).show();
		shutterIndexEle.eq(nowIndex).hide();
		shutterEffectBox.children().each(function(index, el) {
			var that = $(this);
			setTimeout(function(){
				that.animate({left:shutterImgsBoxW}, 500,function(){
					if(index == 9) {
						if(callback) callback();
						shutterEffectBox.empty().hide();
					}
				});
			},50 * index);	
		});
	}//end func

	//横版的bar交错的动画
	function RowBarCrossAnime(next,callback){
		shutterIndexEle.eq(next).show();
		shutterIndexEle.eq(nowIndex).hide();
		shutterEffectBox.children().each(function(index, el) {
			var that = $(this);
			var movedis = index % 2 == 0 ? shutterImgsBoxW : -shutterImgsBoxW;
			that.animate({left:movedis},800,"linear",function(){
				if(index == 9) {
					if(callback) callback();
					shutterEffectBox.empty().hide();
				}
			});
		});
	}//end func

	//竖版的bar移动的动画
	function ColBarMoveAnime(next,callback){
		shutterIndexEle.eq(next).show();
		shutterIndexEle.eq(nowIndex).hide();
		shutterEffectBox.children().each(function(index, el) {
			var that = $(this);
			setTimeout(function(){
				that.animate({top:shutterImgsBoxH}, 400,function(){
					if(index == 19) {
						if(callback) callback();
						shutterEffectBox.empty().hide();
					}
				});
			},30 * index);	
		});
	}//end func

	//竖版的bar交错的动画
	function ColBarCrossAnime(next,callback){
		shutterIndexEle.eq(next).show();
		shutterIndexEle.eq(nowIndex).hide();
		shutterEffectBox.children().each(function(index, el) {
			var that = $(this);
			var movedis = index % 2 == 0 ? shutterImgsBoxW : -shutterImgsBoxW;
			that.animate({top:movedis},800,function(){
				if(index == 19) {
					if(callback) callback();
					shutterEffectBox.empty().hide();
				}
			});
		});
	}//end func

	//方块消失的动画
	function squareDisappearAnime(next,callback){
		shutterIndexEle.eq(next).show();
		shutterIndexEle.eq(nowIndex).hide();
		var eles = [];
		var count = 0;
		var countTotal = 0;

		for (var i = 0; i < 20; i++) {
			var item = [];
			for (var j = 0; j < 10; j++) {
				item.push(shutterEffectBox.children().eq(i*10+j));
			};
			eles.push(item);
		};

		eleDip();

		//元素消失
		function eleDip(){	
			for ( i = 0; i < 20; i++) {
				for (var j = 0; j < 10; j++) {
					if(i+j<=count && i<20 && j<10 && !eles[i][j].hasClass('act')){
						eles[i][j].addClass('act').fadeOut(200,function(){
							countTotal++;
							if(countTotal >= 200){
								if(callback) callback();
								shutterEffectBox.empty().hide();
							}
						});
					}
				};					
			};				
			if(count<28){t=setTimeout(eleDip,20)}
			count++;
		}//end func
	}//end func

	//方块随机消失的动画
	function squareRandomAnime(next,callback){
		shutterIndexEle.eq(next).show();
		shutterIndexEle.eq(nowIndex).hide();
		var eles = [];
		var count =0;

		shutterEffectBox.children().each(function(index, el) {
			eles.push(index);
		});

		for (var i = 0; i < 20; i++) {
			setTimeout(function(){
				for (var j = 0; j < 10; j++) {
					randomDip();
				};
			},50*i);
		};
		//随机消失
		function randomDip(){
			var index = parseInt(Math.random()*(eles.length-1));
			var nowEle = shutterEffectBox.children().eq(eles[index]);
			nowEle.fadeOut(200,function(){
				count++;
				if(count >= 200){
					if(callback) callback();
					shutterEffectBox.empty().hide();
				}
			});
			eles.splice(index, 1);
		}//end func
	}//end func

	//方形收缩的动画
	function squareShrinkAnime(next,callback){
		shutterIndexEle.eq(next).show();
		shutterIndexEle.eq(nowIndex).hide();
		var eles = [];
		var count = 0;
		var countTotal = 0;

		for (var i = 0; i < 20; i++) {
			var item = [];
			for (var j = 0; j < 10; j++) {
				item.push(shutterEffectBox.children().eq(i*10+j));
			};
			eles.push(item);
		};

		eleDip();

		//元素消失
		function eleDip(){	
			for (var i = 0; i < 4; i++) {
				var n = i % 2 == 0 ? 20 : 10;
				for (var j = 0; j < n; j++) {
					var item = eles[0][0];
					switch(i){
						case 0:
							item = eles[j][count];
							break;
						case 1:
							item = eles[count][j];
							break;
						case 2:
							item = eles[j][9-count];
							break;
						case 3:
							item = eles[19-count][j];
							break;
					}
					if(!item.hasClass('act')){
						item.addClass('act').fadeOut(300,function(){
							countTotal++;
							if(countTotal >= 200){
								if(callback) callback();
								shutterEffectBox.empty().hide();
							}
						});
					}
				};
			};
			count++;
			if(count < 5) setTimeout(function(){eleDip()},70);
		}//end func
	}//end func
	/************************各种动画**********************/
}