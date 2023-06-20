$(function(){
	$(".help").show();
	
	var timeId = setTimeout(function(){
		$(".help").hide();
		$(".help_start").show();
		$(".help_box, .help_start_text, .help_box2, .help_box3, .help_box4, .help_start_text2, .start").hide();
		$(".help_box, .help_box2, .help_box3, .help_start_text").fadeIn(1000,"",
				function(){
						if($(".help_box2").length==0){
							$(".start").fadeIn(1000);
						}else{
							$(".help_box4, .help_start_text2").fadeIn(1000,"",
								function(){
									$(".start").fadeIn(1000)
								}
							)
						}
				}     
			);
    },4500);
	
	//설명 닫기
	$(".start").on("click",function(){
		$(this).hide();
		if(timeId){
			clearTimeout(timeId);
			$(".help").fadeOut();

		}
		$(".help_start").fadeOut();
	});
	
	$(".mainBtns p").on('click',function(){
		$(".resultTxt").removeClass("on");
		$(".basicImg").show();
		$(".resultImg").hide();
		$(".labItem img").show();
		$(".labItem p").show();
		$(".labItem").css("left","auto");
		$(".labItem").css("top","auto");
	});
	
	//다시하기 버튼
	//labReplayBtn
	
	$(".labReplayBtn").on('click',function(){
		$(".resultTxt").removeClass("on");
		$(".basicImg").show();
		$(".resultImg").hide();
		$(".labItem img").show();
		$(".labItem p").show();
		$(".labItem").css("left","auto");
		$(".labItem").css("top","auto");
		
	});
	
	
	$(".mainBtns .al1").on('click',function(){
		console.log("알긴산 나트륨 + 물")
		$(".labItem").show();
		$(".resultTxt").removeClass("on");
		$(".mainBtns p").removeClass("on");
		$(this).addClass("on");
		var num=$(this).index();
		console.log(num)
		$(".labIR>div").hide();
		$(".labIR>div").eq(num).fadeIn();
	});
	
	
	$(".mainBtns .al2").on('click',function(){
		console.log("젖산칼슘 + 물")
		$(".labItem").show();
		$(".resultTxt").removeClass("on");
		$(".mainBtns p").removeClass("on");
		$(this).addClass("on");
		var num=$(this).index();
		console.log(num)
		$(".labIR>div").hide();
		$(".labIR>div").eq(num).fadeIn();
	});
	
	
	$(".mainBtns .al3").on('click',function(){
		console.log("알긴산 나트륨 + 물 , 젖산칼슘 + 물")
		$(".labItem").show();
		$(".resultTxt").removeClass("on");
		$(".mainBtns p").removeClass("on");
		$(this).addClass("on");
		var num=$(this).index();
		console.log(num)
		$(".labIR>div").hide();
		$(".labIR>div").eq(num).fadeIn();
	});
	
	var click = {
		x: 0,
		y: 0
	};
	
	
	//이미지 드래그
	$('.labItem').draggable({
		start: function (event){
			click.x = event.clientX;
			click.y = event.clientY;
		},
		drag: function(event, ui){
			const contentsDOM = document.querySelector('#contents');
			const zoomRate = contentsDOM.getBoundingClientRect().width / contentsDOM.offsetWidth;
			const viewer = parent.parent.GO_PAGE_LOAD || parent.GO_PAGE_LOAD;
			let scaleV = viewer ? parent.parent.ZOOMVALUE || parent.ZOOMVALUE : zoomRate;

			// if(scaleV==undefined)scaleV=1;
			
			var zoom = scaleV;
			var original = ui.originalPosition;
			
			ui.position = {
				left: (event.clientX - click.x + original.left) / zoom,
				top:  (event.clientY - click.y + original.top) / zoom
			};
			
		},
		stop: function (e) {
			
		}
	});
	
	
	
	$(".basicImg").droppable({ 
		accept: "img,div",
		
		drop: function(event,ui){
			$(".resultImg").fadeIn();
			$(".labItem .dragImg").removeAttr("style");
			$(".labItem img").hide();
			$(".resultTxt").addClass("on");
			$(".labItem p").hide();
		}
	});
	
});







