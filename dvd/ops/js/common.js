var isIPad = navigator.userAgent.match(/iPad/i) != null;

var isMobile;
var isAndroid;
var downEvent, moveEvent, upEvent, clickEvent, overEvent, outEvent;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ) {
    isMobile = true;
    downEvent = "touchstart";
    moveEvent = "touchmove";
    overEvent = "touchstart";
    outEvent = "touchend";
    upEvent = "touchend";
    clickEvent = "click";
}else {
    isMobile = false;
    downEvent = "mousedown";
    moveEvent = "mousemove";
    overEvent = "mouseover";
    outEvent = "mouseout";
    upEvent = "mouseup";
    clickEvent = "click";
};

if(/Android/i.test(navigator.userAgent)){
    isAndroid = true;
};
var ZOOMVALUE = 1;
try {
    ZOOMVALUE = (parent.ZOOMVALUE == undefined) ? 1 : parent.ZOOMVALUE;
} catch (error) {
    console.log( "parent error" );
};
var factor = 1;
function get_scale() {   
    try {
        if( parent.ZOOMVALUE ) {
            factor = parent.ZOOMVALUE;
        }
    } catch (error) {
        console.log( "parent error" );
    }
};

function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};


$(function () {
	$('.hoverBtn').on(overEvent, function(){
		$(this).addClass("ON");
    }).on(outEvent, function(){
		$(this).removeClass("ON");
    }); // 버튼 오버 이벤트

	$('.listBox .checkBox').on(clickEvent, function(){
		$(this).toggleClass("click");
    })

	$('.typeE .nextPlayBtn').on(clickEvent, function(){
		$('.videoPopup').fadeIn();
	}); $('.typeE .videocloseBtn').on(clickEvent, function(){
		$('.videoPopup').fadeOut();
	});

	$('.menuTabs .tabNum li').on(clickEvent, function () {
		var idx = $(this).index();
		$('.menuTabs .tabNum li').removeClass('selected');
		$('.menuTabs .tabNum li').eq(idx).addClass('selected');
		$('.menuTabs .tabContent > div').hide();
		$('.menuTabs .tabContent > div').eq(idx).show();
	  }); // 탭 기능

	//   nh 추가


	var check2 = [];

	$(".hiddenWrap").on("click", function () {
		$(this).addClass("hiddenon");

		var last_num = $(this)
			.parents(".contentBox")
			.find(".hiddenWrap")
			.length;
		//alert(last_num);

		for (var i = 0; i < last_num; i++) {
			check2[i] = $(".clickWrap")
				.eq(i)
				.hasClass("hiddenon");
		};
		//모든 원소가 조건을 만족하면 true, 하나라도 만족하지 않으면 false를 반환
		var boolCheck = check2.every(val => val === true);
		//트루면 타는거잖아
		if (boolCheck) {
			$(".btnAllType1").hide(); //전체보기

			$(".btnCheck").hide(); //정답
			$(".btnSolvedType1").show(); //다시하기
		} else {
			$(".btnAllType1").show();
			$(".btnCheck").show();
			$(".btnSolvedType1").hide();
		};

	});

	var check = [];
	$(".clickPage .toggleBtn>li").on("click", function () {
		$(this).toggle();
		$(this)
			.siblings()
			.toggle();
	});

	/******체크박스*********/

	$(".checkBox").on("click", function () {

		var b = $(this)
			.find("p")
			.attr("class");
		//alert(b);
		if (b === "redCheck") {
			$(this)
				.find("p")
				.remove();
			$(this)
				.closest(".listBox")
				.find("img")
				.addClass("off")
				.removeClass("on");

		} else {
			$(this).append("<p class='redCheck'></p>");
			$(this)
				.closest(".listBox")
				.find("img")
				.addClass("on")
				.removeClass("off");
		};

	});

	/******경고창 팝업********/
	// $(".warning").on("click", function () {
	// 	$(".popupWrap").fadeIn(function () {
	// 		$(".popup").animate({
	// 			opacity: "1"
	// 		});
	// 	});

	// });

	// $(".popCloseBtn").on("click", function () {
	// 	$(".popup").animate({
	// 		opacity: "0"
	// 	});
	// 	$(".popupWrap").hide();
	// });

	/***********탭*************** */

	$(".tab_box .tab").click(function () {
		var i = $(this).index();
		$(this)
			.siblings()
			.removeClass("on");
		$(this).addClass("on");

		$(".tabList>.list")
			.eq(i)
			.siblings()
			.removeClass("fadeInRightShort");
		$(".tabList>.list")
			.eq(i)
			.addClass("fadeInRightShort");
		$(".tabList>.list")
			.eq(i)
			.siblings()
			.removeClass("on");
		$(".tabList>.list")
			.eq(i)
			.addClass("on");
	})

	/*전체보기 */

	$(".btnAllType1").on("click", function () {
		$(".hiddenWrap").addClass("hiddenon");
		$(".hiddenWrap.clickAnswer").show();

	});

	//전체보기 수정
	$(".btnCheck").on("click", function () {

		$(".hiddenWrap").addClass("hiddenon");
		$(".hiddenWrap.clickAnswer").show();

	});

	$(".btnSolvedType1").on("click", function () {
		$(".hiddenWrap").removeClass("hiddenon");
		//$(".hiddenWrap.clickAnswer").show();
	});


	$(".btnSpeak").on("click", function () {
		$(this).fadeOut(function () {
			$(this).siblings(".bal").fadeIn(300);
		});
	});
	$(".balWrap .btnSpeak").on("click", function () {
		$(this).fadeOut(function () {
			$(this).siblings(".bal").fadeIn(300);
		});
	});
	/* /201022 */
	$(".btnSpeakClose").on("click", function () {
		$(this).closest(".bal").fadeOut(300, function () {
			$(this).closest(".bal").siblings(".btnSpeak").fadeIn();
		});
	});
	/* //201019 end */
});
	

