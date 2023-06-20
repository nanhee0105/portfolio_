//iframe에 함수 호출부분
window.addEventListener( 'message', function(e){
    //    console.log( "moviePlayer", e.data );
        if( e.data.msg == "onPlay" ) {
            onPlay();
        }
        if( e.data.msg == "onPause" ) {
            onPause();
        }
        if( e.data.msg == "onStop" ) {
            onStop();
        }
        if( e.data.msg == "movieMove" ) {
            movieMove( e.data.per );
        }
        if( e.data.msg == "setVol" ) {
            setVol( e.data.per );
        }
    });
    
    
    function onPlay() {
         $(".pp").removeClass("play");
         $(".pp").addClass("pause");
        video1.play();
    }
    function onPause() {
        $(".pp").removeClass("pause");
        $(".pp").addClass("play");
                
        video1.pause();
    }
    function onStop() {
        endTimeMode = true;
        setTimeout( function(){endTimeMode=false}, 200 );
        video1.pause();
        video1.currentTime=startTime;
        
        $(".play_time input[name=curTime]").val("00:00");
        $(".progressvol_bar").css('width',0);
        $(".playdot").stop();
        $(".playdot").css('left',95);
        $(".vplay").fadeIn("fast");
        $(".sp").removeAttr("style");
        $(".pp").removeClass("pause");
        $(".pp").addClass("play");
        
        video1.load();    
    }
    function movieMove( per ) {
        var moveTime = startTime + ( ( endTime - startTime ) * per );
        video1.currentTime = moveTime;
        repeatMode = false;
    }

    var startTime = 0;
    var endTime = 0;
    var saveAllWidth = 0;
    var video1;
    var endTimeMode = false;
    $(function(){
        // var h_width=Number($("html").css("width").substr(0,4));
        // var b_width=Number($("body").css("width").substr(0,4));
    
        // if(isNaN(h_width)){h_width=Number($("html").css("width").substr(0,3))};
        // var scaleV=h_width/b_width;
        video1 = $( "#video1" ).get( 0 );
        video1.load(); 
        var scaleV=1;
        var full_btn_num=0;

        $(".vpopBtn").on(clickEvent, function(){
            $.ajax({
                url: "g4_02_p114_01.html",
                dataType: 'html',
                success: function (data) {
                    var refind=$(data).find(".vpop");
                    $("#container").html(refind);
                    $(".vpop").css("display"," block").css("top","52px");
                    $.getScript('js/moviePlayer.js');
                },
                    error: function (xhr) {
                        alert("실패");
                }
            });
		});
        
        $(".reBtn").on(clickEvent, function(){
            $.ajax({
                url: "g4_02_p114_01.html",
                dataType: 'html',
                success: function (data) {
                    var refind=$(data).find("#container");
                    $("#container").html(refind);
                    $.getScript( 'js/moviePlayer.js' );
                },
                    error: function (xhr) {
                        alert("실패");
                }
            });
        });
        

        // $( window ).resize( function() {
        //     if(($(window).height()<=347) ){
        //         $(".video_ctr").css("bottom",+52)
        //         };
        //   });
        
        $( "#progress_bg" ).on( clickEvent, function(e,isMobile){
            factor = scaleV;   
            var self = this;
            mx = isMobile ? e.touches[0].pageX : e.pageX;
            self.mouseX = mx / factor;
            self.parentOffset = $(this).offset();
            self.parentOffset.left = self.parentOffset.left / factor;
            var tx = self.mouseX - self.parentOffset.left;

            if( tx < 10 ) tx = 10;
            if( tx > 353 ) tx = 353;
            var per = ( tx ) / 353;
            
            window.postMessage({
                "msg": "movieMove",
                "per": per
            }, "*");
            window.postMessage({
                "msg": "onPlay"
            }, "*");
            
        });
            //가운데 또는 재생버튼 눌럿을때 시작
                
        var play_btn_num=0;
        
        var ctr_hide=$('.video_player').hover(function() {

            timer = setTimeout(function() {
                $(".video_ctr").fadeOut("slow");
            }, 3000);
        }, function() {
            clearTimeout(timer);
        });
    
      
    
        $(".vplay, .pp, #video1").on(clickEvent, function() {
            $(".video_player").on("mouseover", function(){
                $(".video_ctr").fadeIn("fast");
                setTimeout(ctr_hide,3000);
            });
            
            
              //마우스 오버될시 video_ctr 없어지기
            $("#container").mouseleave(function(){
                $(".video_ctr").fadeOut("slow");
            });
            play_btn_num++;
            $(".pp").removeAttr("style");
            $("#video1").show();
            $(".video_ctr").fadeIn("fast");
            if(play_btn_num==1){
                
               // $(".pp").addClass("playOver");
             
              
            }else{
                 
                // $(".pp").addClass("play");
               //  $(".pp").removeClass("playOver");
               //  $(".pp").css("background","url(images/common/mediaImg/vPlayer_btn_pause.png) no-repeat");
               //  $(".pp").css("background-size","100%");
                play_btn_num=0;
            }

                setTimeout(ctr_hide,3000);

            if ($(".pp").hasClass("play")) {
               
                window.postMessage({
                    "msg": "onPlay"
                }, "*");
            } else{
                
                window.postMessage({
                    "msg": "onPause"
                }, "*");
            }

            // if ($(".pp").hasClass("playOver")) {
            //     window.postMessage({
            //         "msg": "onPlay"
            //     }, "*");
            // } else {
            //     window.postMessage({
            //         "msg": "onPause"
            //     }, "*");
            // }
            
    
                });
                
        //풀스크린 설정 또는 해제
        $(".size_icon").on(clickEvent, function() {

    //  var elem= document.documentElement;
    var elem= document.getElementById("video1");
 
                    if(isMobile==true){

                        var doc = window.document;
                        var docEl = doc.documentElement;
                    
                        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
                        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
                    
                        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                            requestFullScreen.call(docEl);
                        }
                        else {
                            cancelFullScreen.call(doc);
                        }
                    }else{
                            
                        if (elem.requestFullscreen) {
                            elem.requestFullscreen();
                        } else if (elem.mozRequestFullScreen) { /* Firefox */
                            elem.mozRequestFullScreen();
                        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                            elem.webkitRequestFullscreen();
                        } else if (elem.msRequestFullscreen) { /* IE/Edge */
                            elem.msRequestFullscreen();
                        }
                    }
                //}
                // else{
                    
                //     if(isMobile==true){
                //         cancelFullScreen.call(doc);
                //     }else{
                //         if (document.exitFullscreen) {
                //             document.exitFullscreen();
                //         } else if (document.mozCancelFullScreen) { /* Firefox */
                //             document.mozCancelFullScreen();
                //         } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                //             document.webkitExitFullscreen();
                //         } else if (document.msExitFullscreen) { /* IE/Edge */
                //             document.msExitFullscreen();
                //         }
                //     }
                //             full_btn_num=0;
                // }
        })
        // $("#video1").on('fullscreenchange', function(){
        //     if( $("#video1").fullscreen ) {
        //         $("body, #wrap, #container, .video_player").css("width","100%");
        //         $("body, #wrap, #container, .video_player").css("height","100%");
        //         $("body").css("position","absolute");
        //         $(".video_ctr").css("left","20%");
        //        // $(".video_ctr").css("bottom","7%");
        //     } else {
        //         $("body, #wrap, #container, .video_player, .video_ctr").removeAttr("style");
        //     };
        // }); // 풀스크린 됐다 안됐다 분기

        $(".stop").on(clickEvent, function() {
           // $(".playdot").stop();
            play_btn_num=0;
            window.postMessage({
                "msg": "onStop"
            }, "*");
        });

        $(".playdot").on(downEvent, function(e) {
            video1.pause(); 
            factor = scaleV;
            var self = this;
            mx = isMobile ? e.touches[0].pageX : e.pageX;
            self.mouseX = mx / factor;
            self.parentOffset = $(".playdot").offset();
            self.parentOffset.left = self.parentOffset.left / factor;
            var tx = self.mouseX - self.parentOffset.left;
            var dGap = parseInt($(".playdot").css("left"));
            tx += 95;
            var maxX = 353+95;
            if (tx < 95) tx = 95;
            else if (tx > maxX) tx = maxX;
            var gap = tx - dGap;
            $(document).on(moveEvent, function(e) {
                mx = isMobile ? e.touches[0].pageX : e.pageX;
                self.mouseX = mx / factor;
                var tx = self.mouseX - self.parentOffset.left;
                tx += 95;
                var maxX = 353+95;
                tx -= gap;
               
                if (tx < 95) tx = 95;
                else if (tx > maxX) tx = maxX;
                $(".playdot").css("left", tx);
                $(".progressvol_bar").css("background-size", 95+tx-95+"px 10px");
                var per = (tx - 95) / (maxX - 95)
     
                window.postMessage({
                    "msg": "movieMove",
                    "per": per
                }, "*");
            });
            $(document).on(upEvent, function(e) {
                console.log("event off");
                $(document).off(moveEvent);
                $(document).off(upEvent);
                window.postMessage({
                    "msg": "onPlay"
                }, "*");
            });
            $(document).on("dragstart", function() {
                return false;
            });
        })
        startTime = 0;
        endTime = 0;
        
  
        video1.addEventListener( "canplaythrough", function(){
    
            console.log( "재생준비됨.!!" );
            
            endTime = this.duration;
            
            var totalTime = Math.round(this.duration);
            var totalMin = Math.floor(totalTime / 60);
            var totalSec = Math.round(totalTime % 60);
            
            if(totalSec < 10){
                totalSec = "0"+totalSec;
            };
            if(totalMin < 10){
                totalMin = "0"+totalMin;
            };

          
            $(".play_time input[name=totTime]").val(totalMin+":"+totalSec);
    
        });
    
        video1.addEventListener( "playing", function(){
            //이미지 히든
            //가운데 큰버튼 히든
            $(".vplay").fadeOut('fast');
            console.log( "재생됨." );
            
            window.postMessage( { "msg":"onPauseMode" }, "*" );
            // parent.onPauseMode();
            
            var eTime = endTime - startTime;
            var sTime = ( video1.currentTime - startTime );
            window.postMessage( { "msg":"onPlaying", "sTime": sTime, "eTime":eTime, "pTime":0 }, "*" );
            // parent.onPlaying( sTime, eTime, 0 );
        });
        video1.addEventListener( "pause", function(){
            console.log( "일시정지." );
            window.postMessage( { "msg":"onPlayMode" }, "*" );        
            
            var eTime = endTime - startTime;
            var sTime = ( video1.currentTime - startTime );
    
            window.postMessage( { "msg":"onPlaying", "sTime": sTime, "eTime":eTime, "pTime":0 }, "*" );
            // parent.onPlaying( sTime, eTime, 0 );
        });
        
        video1.addEventListener( "timeupdate", function(){
            if( endTimeMode ) return;
            //console.log( video1.currentTime );
            
            var eTime = endTime - startTime;
            var sTime = ( video1.currentTime - startTime );
            var pTime =  eTime - sTime;
            //노란버튼 이동
             $(".playdot").css('left',95+(353/endTime*sTime)+'px');
            //노란바 이동


            $(".progressvol_bar").css('width',(353/endTime*sTime));
            $(".progressvol_bar").css('background-size','844px 60px');
            var playMin = Math.floor(sTime/ 60);
            var playSec = Math.round(sTime% 60);

            if(playSec < 10){
                playSec = "0"+playSec;
            }else if(playSec==60){
                playSec = "00";
                playMin++;
            };
            if(playMin < 10){
                playMin = "0"+playMin;
            };
            
             $(".play_time input[name=curTime]").val(playMin+":"+playSec);
            
            window.postMessage( { "msg":"onPlaying", "sTime": sTime, "eTime":eTime, "pTime":pTime }, "*" );
            // parent.onPlaying( sTime, eTime, pTime );
            
            if( endTime <= video1.currentTime ){
                endTimeMode = true;
                setTimeout( function(){endTimeMode=false}, 200 );
                console.log( "endTime" );
                video1.pause();
                video1.currentTime = startTime;
                
            }
        });
        
        video1.addEventListener( "ended", function() {
            endTimeMode = true;
            setTimeout( function(){endTimeMode=false}, 200 );
            console.log( "endTime" );
            video1.pause();
            video1.currentTime = startTime;
            $(".play_time input[name=curTime]").val("00:00");
            $(".progressvol_bar").css('width',0);
            $(".playdot").stop();
            $(".playdot").css('left',95);
            play_btn_num=0;
            $(".vplay").fadeIn("fast");
            $(".pp").removeClass("pause");
            $(".pp").addClass("play");
            video1.load();  
            
            
        }); 

        var volnum=0;
        
        $(".sp").on(clickEvent, function() {
            var gap = 960;
            var tx; 
            volnum++;
            
        	$(".progressvol_bar2").fadeIn("slow");
            $("#progress_bg2").fadeIn("slow");
			if(volnum!=1){
		            if ($(this).hasClass("sound") && volnum%2==0) {
                        console.log(111);
		    //			$(this).addClass("soundx");
		    //			$(this).removeClass("sound");
		                saveVol = nowVol;
		                nowVol = 0;
		                setVol( nowVol );
		                tx = nowVol * 60;

		                $(".progressvol_bar2").css("height","0px");
		 
		                return;
		            }
		            if ($(this).hasClass("soundx") || volnum%2==1) {
                        console.log(222);
		    //			$(this).addClass("sound");
		    //			$(this).removeClass("soundx");
		
		                nowVol = saveVol;
		                setVol( nowVol );
		                tx = nowVol * 60;
		                if(nowVol==1){tx=0;};
		                $(".progressvol_bar2").css("height",(60-tx)+"px");
		                video1.volume=((60-tx)/60);		              

		                return;
		            }
			}
			
        });
        
        $("#progress_bg2").on(clickEvent, function(e){
            factor = scaleV;
            var self = this;
            my = isMobile ? e.touches[0].pageY : e.pageY;
            self.mouseY = my / factor;
            self.parentOffset = $(this).offset();
            self.parentOffset.top = self.parentOffset.top / factor;
            var ty = self.mouseY - self.parentOffset.top;
            var gap = 960;
            if( ty < 5) ty =0;
            if( ty > 55) ty = 60;
            var per = ty/60;  
            nowVol = per;
            saveVol = nowVol;
            console.log(ty);
            $(".progressvol_bar2").css("height",(60 -ty)+"px");
            video1.volume=((60-ty)/60);
            
        });
    
        $("#progress_bg2").on(downEvent, function(e) {
                //console.log("event off");
                $(document).off(moveEvent);
                $(document).off(upEvent);
            });
    
        $("#progress_bg2").on("mouseout", function(){
                	volnum=0;
                    $(".progressvol_bar2").fadeOut("slow");
                    $("#progress_bg2").fadeOut("slow");
				
                });
        $(".size_icon ,.play_time").on("mouseover", function(){
                            
                    $(".progressvol_bar2").fadeOut("fast");
                    $("#progress_bg2").fadeOut("fast");
					volnum=0;
                    
                });		
        
        
               
});
    
    var nowVol = 1;
    var saveVol = 1;	
        
    function setVol( step ) {
                video1.volume = step;
                
                
                if( step < 0.1 ) {
                    $(".sp").css("background","url(images/mediaImg/vPlayer_vol_mute.png) no-repeat");
                    $(".sp").css("background-size","100%");
                }else {
                    $(".sp").removeAttr("style");
                }
            
        }
    
    