$( document ).ready(function( e ) {
	$("#optionDrawing").DRAWING_STOP();
	
	$(".drawBtn").on(clickEvent,function(){
		// $(this).hide();
		$("#optionContener").show();
		$("#optionDrawing").DRAWING();
	});
	
	/* $('.drawbtn_pencolor').on(clickEvent,function(){
		$('.colorTool').toggle();
		$('.strokeSize').hide();
	});	
	$('.drawbtn_stop').on(clickEvent,function(){
		$('.colorTool').hide();
		$('.strokeSize').hide();
	});	
	$('.drawBtn_size').on(clickEvent,function(){
		$('.strokeSize').toggle();
		$('.colorTool').hide();
	});	

	var canvasList = $("canvas").filter("[data-role='drawing']");
	
	$('#optionContener .colorTool > .color > li').each(function(a, b) {
		$(b).on(clickEvent, function() {
			var code = this.getAttribute('data-code');

			canvasList.each((index, canvas) => {
				var ctx = canvas.getContext("2d");
				ctx.strokeStyle = code;
			});
			var pencolor = $('.drawbtn_pencolor');
			pencolor.css({background: code});
		});
	}); */
});

function startPenDraw() {
	//영역 펜 쓰기 재시작
	$("#optionDrawing").DRAWING();
	buttonOn();
}
function stopPenDraw(text) {
	//영역 펜 쓰기 정지
	$("#optionDrawing").DRAWING_STOP();
	buttonOn();
	$("#optionContener").hide();
	$(".drawBtn").show();
	$("#optionContener").find("button").removeClass("on");	
	$(".drawbtn_pen,.drawbtn_size1").addClass("on");
	$(".drawbtn_size1").trigger("click");
}
function deletePenDraw() {
	//영역 펜 쓰기 영역 삭제
	$("#optionDrawing").DRAWING_DELETE();
}
function eraserPenDraw() {
	//영역 펜 쓰기 부분 삭제
	$("#optionDrawing").DRAWING_ERASER();
	buttonOn();
}
function changeLineWidthPenDraw(text) {
	// var text = index
	if(!isNaN(text)) {
		//영역 펜 쓰기 굵기 변경
		$("#optionDrawing").DRAWING_LINEWIDTH(parseInt(text));
	}
	buttonOn();
}

// function changeLineWidthPenDraw2() {
// 	$("#optionDrawing").DRAWING_LINEWIDTH(2);
// 	buttonOn();
// 	// $("#optionDrawing").buttonOn();
// }

// function changeLineWidthPenDraw7() {
// 	$("#optionDrawing").DRAWING_LINEWIDTH(7);
// 	buttonOn();
// }

// function changeLineWidthPenDraw11() {
// 	$("#optionDrawing").DRAWING_LINEWIDTH(11);
// 	buttonOn();
// }

function buttonOn() {
	var $selector = $(event.currentTarget);
	$selector.parent().children('.on').removeClass('on');
	$selector.addClass('on');
}

//영역 펜쓰기 색상 변경 - 스펙트럼 UI 적용
$(function () {
	var info = $("#optionDrawing").DRAWING_INFO();
	$("#spectrumInsert").spectrum({
		color: info.strokeStyle,
		preferredFormat: "rgb",
		showInitial: true,
		showAlpha: true,
		showPalette: true,
		clickoutFiresChange: false,
		palette: [ 
			[ "#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff" ], 
			[ "#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f" ], 
			[ "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc" ], 
			[ "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd" ], 
			[ "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0" ], 
			[ "#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79" ], 
			[ "#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47" ], 
			[ "#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130" ], 
			[ "rgba(0, 0, 0, 0.3)", "rgba(255,255,255,0.3)", "rgba(255,0,0,0.3)", "rgba(255,255,0,0.3)", "rgba(0,255,0,0.3)", "rgba(0,0,255,0.3)" ] 
		],
		cancelText: "",
		chooseText: "선택",
		hide: function(tinycolor) {
			var resultColor = tinycolor.toRgbString();
			//영역 펜 쓰기 색상 변경
			$("#optionDrawing").DRAWING_LINECOLOR(resultColor);
		}
	});
});

function drawBtn_click() {
	//영역 펜 쓰기 재시작
	$("#optionDrawing").DRAWING();
	buttonOn();
}