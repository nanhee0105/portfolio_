$( document ).ready(function( e ) {
	$("#optionDrawing_1").DRAWING_STOP();
	
	$(".btn_draw_1").on(clickEvent,function(){
		$(this).hide();
		$("#optionContener_1").show();
		$("#optionDrawing_1").DRAWING();
	});
});

function startPenDraw_1() {
	//영역 펜 쓰기 재시작
	$("#optionDrawing_1").DRAWING();
	buttonOn();
}
function stopPenDraw_1(text) {
	//영역 펜 쓰기 정지
	$("#optionDrawing_1").DRAWING_STOP();
	buttonOn();
	$("#optionContener_1").hide();
	$(".btn_draw_1").show();
	$("#optionContener_1").find("button").removeClass("on");	
	$(".drawbtn_pen_1,.drawbtn_size1_1").addClass("on");
	$(".drawbtn_size1_1").trigger("click");
}
function deletePenDraw_1() {
	//영역 펜 쓰기 영역 삭제
	$("#optionDrawing_1").DRAWING_DELETE();
}
function eraserPenDraw_1() {
	//영역 펜 쓰기 부분 삭제
	$("#optionDrawing_1").DRAWING_ERASER();
	buttonOn();
}
function changeLineWidthPenDraw_1(text) {
	// var text = index
	if(!isNaN(text)) {
		//영역 펜 쓰기 굵기 변경
		$("#optionDrawing_1").DRAWING_LINEWIDTH(parseInt(text));
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
	var info = $("#optionDrawing_1").DRAWING_INFO();
	$("#spectrumInsert_1").spectrum({
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

function btn_draw_click() {
	//영역 펜 쓰기 재시작
	$("#optionDrawing").DRAWING();
	buttonOn();
}