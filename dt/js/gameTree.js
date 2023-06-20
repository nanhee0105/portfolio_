$(function () {
	
	//배경 나무 비디오
	var video1=$("video").get(0);
		video1.load();
	//배경 오디오
	var audio1=new Audio;
	audio1.src='media/game/bgm010.mp3'
    audio1.load();
    audio1.volume = 0.5;
	audio1.loop = true;
	//정답 오디오
	var audio2=new Audio;
	audio2.src='media/game/snd_ok.mp3'
    audio2.load();
    
	//오답 오디오
	var audio3=new Audio;
	audio3.src='media/game/snd_no.mp3'
    audio3.load();

	//클리어 오디오
	var audio4=new Audio;
	audio4.src='media/game/ok_feed.mp3'
    audio4.load();

	//실패 오디오
	var audio5=new Audio;
	audio5.src='media/game/no_feed.mp3'
    audio5.load();
	// $(".ox_o").hide();
	// $(".ox_x").hide();


	var total_q_text_length = 10;//$(".main_q_text li").length; //총 문제 갯수
	var view_q_text_length = 5; //$(".btn_q_next li").length; //화면에 나올 문제 갯수
	var q_time = 0; //현재 순서
	var q_level  = 1;
	var lotto = new Array(view_q_text_length); //화면에 나올 문제갯수 배열에저장
	var a_random = new Array(1); //답 나올 번호 배열에 저장 view_data

	//level01;==========================
	  //정답
    var view_data = [
		//level01
		[],
		//level02
		[
			[ "금속","고무","종이"],
			[ "트라이앵글","쌓기 나무","야구 장갑"],
			[ "고무","금속","나무"],
			[ "고무","금속","나무"],
			[ "상판","몸체","받침"],

			[ "금속", "고무","나무"],
			[ "금속 그릇", "유리그릇", "플라스틱 그릇"],
			[ "알긴산 나트륨", "젖산 칼슘", "설탕"],
			[ "미끈미끈합니다", "까끌까끌합니다", "단단합니다"],
			[ "기능", "가격", "무게"]
	
		],
        //level03
		[
			[ "금속", "고무", "나무", "플라스틱", "종이"],
			[ "금속", "나무", "플라스틱", "고무", "책상"],
			[ "금속", "고무", "나무", "플라스틱", "종이"],
			[ "금속", "고무", "나무", "플라스틱", "유리"],
			[ "금속", "고무", "나무", "유리", "플라스틱"],

			[ "금속", "나무", "유리", "종이", "고무"],
			[ "금속 컵", "종이컵", "유리컵", "나무 컵", "플라스틱 컵"],
			[ "종이로 만든 모자", "나무로 만든 모자", "섬유로 만든 모자", "고무로 만든 모자", "플라스틱으로 만든 안전모"],
			[ "붉은색이 된다.", "파란색이 된다.", "노랗게 된다.", "끈적끈적해진다.", "검게 변한다."],
			[ "금속", "고무", "나무", "플라스틱", "종이"]
	
		]
	  ]
	var result = [
		//level01
		[
		  [ "o"],
		  [ "o"],
		  [ "x"],
		  [ "x"],
		  [ "x"],
		  [ "x"],
		  [ "x"],
		  [ "o"],
		  [ "o"],
		  [ "x"]
	    ],
        //level02
		[
			[ "금속"],
			[ "쌓기 나무"],
			[ "고무"],
			[ "나무"],
			[ "몸체"],

			[ "고무"],
			[ "플라스틱 그릇"],
			[ "알긴산 나트륨"],
			[ "미끈미끈합니다"],
			[ "기능"]
	    ],
        //level03
		[
		  [ "고무"],
		  [ "책상"],
		  [ "금속"],
		  [ "나무"],
		  [ "플라스틱"],

		  [ "금속"],
		  [ "유리컵"],
		  [ "종이로 만든 모자"],
		  [ "끈적끈적해진다."],
		  [ "고무"]
		]
	   ]
	
	//시간제한
	var time_out;
	//추가;
	var tGauge = 0;				//타이머 게이지
	var gameTime = 300;          ////300 제한 시간
	var playTime;   	

	//10개의 문제 램덤하게
	function Lotto() {
		var count = 0; //추출한 로또번호의 갯수
		var overl = true; // 번호중복 여부 변수

		while (count < 5) { // 5번개 뽑기
			var number = 0; //랜덤번호 가져오는 변수
			number = parseInt(Math.random() * total_q_text_length); //총문제 중 나올 랜덤번호 추출 0~9까지

			for (var i = 0; i < count; i++) { // 1부터 i까지 반복하여 중복확인
				if (lotto[i] == number) { // 중복된 번호가 아니면 넘어가기.
					overl = false;
				}
			}

			if (overl) { //중복 없을 시 count 1 증가
				lotto[count] = number; //추출된 번호를 배열에 넣기
				count++;
			}

			overl = true; //원래 true으로 돌아가기
		}

        //첫번째 문제 출제
		$(".que0" + q_level+" .main_q_text li").eq(lotto[q_time]).addClass("on");
		$(".que0" + q_level+" .btn_q_next li").eq(q_time).addClass("on");
        console.log("ans_1==="+ result[q_level -1][lotto[q_time]]);
		
		//예제 보여주기
		if(q_level != 1){
			A_Random();
			for(i=0; i< view_data[q_level-1][lotto[q_time]].length; i++ ){
			  
			  $(".que0" + q_level+" .main_a div").eq(i).text(view_data[q_level-1][lotto[q_time]][a_random[i]])
			}
		}
		playTime = gameTime;
        $('.timer p img').css('clip', 'rect(0px, 735px, 35px, 0px' );
        time_out = setInterval(inGameUpdate, 1000);
	}
   


	function inGameUpdate()
	{
		//플레이타임을 줄여준다
		if(playTime > 0)
		{
			playTime--;
		}
		//제한시간이 다 되었을 경우 gameOver 처리
		else if(playTime <= 0)
		{
			audio1.pause();
			$("#glayLayer").show();
			$(".gameover_0" + q_level).fadeIn();
			clearInterval(time_out);
			time_out = null;
			$("#glayLayer").show();
			$(this).attr("readonly", "readonly");
           

		}

		//타이머 게이지의 길이를 구함
		tGauge = parseInt((735/gameTime) * playTime);
        //타이머 게이지 실시간 업데이트
		$('.timer p img').css('clip', 'rect(0px, ' + tGauge  + 'px, 35px, 0px' );
	};

     //답랜덤

	 function A_Random() {

        var count = 0;

        var overl = true;


        while (count < view_data[q_level-1][lotto[q_time]].length) {

            var number = 0;

            number = parseInt(Math.random() * view_data[q_level-1][lotto[q_time]].length);


            for (var i = 0; i < count; i++) { // 1부터 i까지 반복하여 중복확인

                if (a_random[i] == number) { // 중복된 번호가 아니면 넘어가기.

                    overl = false;

                }

            }


            if (overl) { //중복 없을 시 count 1 증가

                a_random[count] = number; //추출된 번호를 배열에 넣기

                count++;

            }


            overl = true; //원래 true으로 돌아가기

        }

      

    }
/*
	//첫번째 문제 ox 호버
	$(".main_a div").mouseover(function(){
		$(this).css("border","10px solid rgb(139, 183, 233)")
	});
	$(".main_a div").mouseleave(function(){
		$(this).css("border","10px solid rgb(248, 219, 89)")
	});

*/	
	//정답입력
	$(".main_a>div").on("click", function (e) {
	
			if (q_time <= 5) {
				if (result[q_level -1][lotto[q_time]] == $(this).text()) {
					$(".ox_o").addClass("on");
					console.log( q_time, "ap");

					setTimeout(function() {
						console.log( q_time, "disap");
						$(".ox_o").removeClass("on");
					

						if (q_time != 5) {
							//다음 문제 내용
							$(".que0" + q_level+" .main_q_text li").eq(lotto[q_time - 1]).removeClass("on");
							$(".que0" + q_level+" .main_q_text li").eq(lotto[q_time]).addClass("on");
							//예제 보여주기
							if(q_level != 1){
								A_Random()
								for(i=0; i< view_data[q_level-1][lotto[q_time]].length; i++ ){
								
								$(".que0" + q_level+" .main_a div").eq(i).text(view_data[q_level-1][lotto[q_time]][a_random[i]])
								}
							}
							console.log("ans_1==="+ result[q_level -1][lotto[q_time]]);
							
							//다음 문제 번호
							$(".que0" + q_level+" .btn_q_next li").eq(q_time - 1).removeClass("on");
							$(".que0" + q_level+" .btn_q_next li").eq(q_time).addClass("on");
							
						}

						//정답 5번 했을때
						if (q_time == 5) {
							audio1.currentTime=0;
							audio1.pause();
							audio4.play();
							clearInterval(time_out);
							$(".ox_o").removeClass("on");
							$(".ox_x").removeClass("on");
							time_out = null;
							//$(".timer p img.loading").css("animation-play-state", "paused");
							$(this).attr("readonly", "readonly");
						}
				    }, 1100);

				audio2.play();
				q_time++;
				video1.play();

				} else {

					$(".ox_x").addClass("on");
				
					setTimeout(function() {
						$(".ox_x").removeClass("on");
					    ///
						$(".life img.on").eq($(".life img.on").length - 1).hide();
						$(".life img.on").eq($(".life img.on").length - 1).removeClass("on");


						$(this).val("");
						//목숨3개 다할때
						if ($(".life img.on").length - 1 == -1) {
							audio1.currentTime=0;
							audio1.pause();
							audio5.play();
							clearInterval(time_out);
							$(".ox_o").removeClass("on");
							$(".ox_x").removeClass("on");
							time_out = null;
							//$(".timer p img.loading").css("animation-play-state", "paused");
							$("#glayLayer").show();
							$(".gameover_0" + q_level).fadeIn();						
							$(this).attr("readonly", "readonly");
						}
				   }, 1100);
				   audio3.play();
				}

				//-------------------------------------------------------------
			}

	});

	//시작
	$(".btn_play").on("click", function () {
		$(".bgintro").hide();
		$(".bgContainer").show();
	//	$(".timer p img").addClass("loading");
		audio1.play();
		// 숫자 뒤에 단계 추가 
		$('.level p').each(function(){
			var html = $(this).html();
			if( $(this).hasClass('on') ) { 
				$(this).html(html + '단계'); 
			} else { 
				if($(this).html().indexOf('단계') != -1) $(this).html(html.substring(0,html.length-2)); 
			};
		});
		Lotto();
	});
	//처음으로
	$(".gameclear_start").on("click", function () {
		location.href = "gameTree.xhtml";
	});
    // 다음 단계;
	$(".gameclear_go").on("click", function () {
		$(".level p").eq(q_level -1).removeClass("on");
		$(".que0"+ q_level).hide();
		q_level++;
		$(".level p").eq(q_level -1).addClass("on");
		$(".que0"+ q_level).show();

		// 숫자 뒤에 단계 추가 
		$('.level p').each(function(){
			var html = $(this).html();
			if( $(this).hasClass('on') ) { 
				$(this).html(html + '단계'); 
			} else { 
				if($(this).html().indexOf('단계') != -1) $(this).html(html.substring(0,html.length-2)); 
			};
		});
        replaySetting();
		Lotto();
	});
	//다시하기
	$(".gameover_replay").on("click", function () {
		
        replaySetting();
		Lotto();

	});
    
	function replaySetting(){
		audio1.play();
		q_time=0;
		video1.load();
        //단계별 필요;
		$(".btn_q_next li, .main_q_text li, .life img").removeClass("on");

		$(".btn_q_next li").eq(0).addClass("on")
		$(".life img").addClass("on");

		$(".gameover_01, .gameover_02, .gameover_03, #glayLayer").hide();
		$(".gameclear_01, .gameclear_02, .gameclear_03").hide();

		$(".life img.on").show();

		//$(".main_a_text").removeAttr("readonly");
	
		
	}
	
	//게임방법 팝업

	$(".btn_help_pop").on("click" , function(){
		$(".help_pop_gray").show();
	})

	$(".help_pop_close").on("click",function(){
		$(".help_pop_gray").hide();
	})

	var startTime=0;

	video1.addEventListener( "timeupdate", function(){
        
        var sTime = ( video1.currentTime - startTime );

        var playSec = Math.round(sTime% 60);

		// console.log(playSec);
		// console.log(q_time);
		if(q_time!=5){	
			if(playSec==q_time+1){
				video1.pause();
			}
		}
		if(video1.ended==true) {
			setTimeout
			(function(){
				$("#glayLayer").show();
				$(".gameclear_0"+q_level).fadeIn();
			},1000)
		}
	});
	
});
