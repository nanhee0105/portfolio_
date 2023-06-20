var isIPad = navigator.userAgent.match(/iPad/i) != null;

var isMobile;
var isAndroid;
var downEvent, moveEvent, upEvent, clickEvent;


if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	isMobile = true;
	downEvent = "touchstart";
	moveEvent = "touchmove";
	upEvent = "touchend";
	clickEvent = "click";
}else { 
	isMobile = false;
	downEvent = "mousedown";
	moveEvent = "mousemove";
	upEvent = "mouseup";
	clickEvent = "click";
}
if(/Android/i.test(navigator.userAgent)){
	isAndroid = true;
}

/*contentWrapper.init();*/

//css animation;
$.fn.extend({
    animateCss: function (animationName, end_func) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    var _cb = end_func;
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if( _cb ){
                _cb();
                _cb = null;
            }
        });
        return this;
    }
});

//audio;
var mun_audio = {
        //vid.playbackRate
        audio: new Audio(),
        begin: undefined,
        end: undefined,
        cur_obj: undefined,
        playbackRate: 1,
        dur: 0,
        midx: 0,
        cnt: 0,
        set_rate: function(playbackRate) {
            this.playbackRate = playbackRate;
            this.audio.playbackRate = playbackRate;
        },
        isPlaying: function() {
            return this.audio &&
                this.audio.currentTime > 0 &&
                !this.audio.paused &&
                !this.audio.ended &&
                this.audio.readyState > 2;
        },
        play: function(id, begin, end) {
            //--------------------
            
            var self = this;
            if (self.isPlaying()) self.audio.pause();
    
            self.begin = begin;
            self.end = end;
 
            self.audio.src = id;
 
            self.cur_obj = id;

     
            self.audio.oncanplaythrough = function() {
                self.audio.play();
                self.dur = self.audio.duration;
    
                if (self.begin) {
                    self.begin( self.dur );
                }
            }
            this.audio.onended = function() {
    
                if (self.end) {
                    self.end();
                }
    
            }
            self.audio.load();
        },
        stop : function() {
        
            this.audio.pause();

            if(this.audio.onended) {
                this.audio.onended = null;
            }
        },
        resume : function() {
            this.audio.paused && this.audio.play();
            this.paused = false;
        },
        pause : function() {
            this.audio.pause();
        }
   
    }



        //드래그를 위한 js
       /* $.getScript( 'js/jquery-ui.min.js' );*/
        //jj바인더
        $.getScript( 'js/binder_web.min.js' );

        //ani 비디오 시작 or 정지
        function aniplaybtn(){

                    $(".aniplaybtn").on("click",function(){

                        if($(".bubble").hasClass("bubble")==true){
                            
                            $(".bubble").fadeOut("slow");

                                    if (!video1.paused) {
                                        video1.pause();
                                        $(this).removeClass("anipausebtn");
                                        
                                    } else{
                                        video1.play();
                                        $(this).addClass("anipausebtn");
                                    }
                        }else{

                            if (!video1.paused) {
                                video1.pause();
                                $(this).removeClass("anipausebtn");
                                
                            } else{
                                video1.play();
                                $(this).addClass("anipausebtn");
                            }
                        }
                     });
        }
        //ani 비디오 stop
        function anireplaybtn(){
                    $(".anireplaybtn").on("click",function(){
                        if($("body").find("main_text")==false){
                            video1.currentTime = 0;
                            video1.pause();
                            video1.load();
                            $(".aniplaybtn").removeClass("anipausebtn");
                        }else{
                            video1.currentTime = 0;
                            video1.pause();
                            video1.load();
                            $(".aniplaybtn").removeClass("anipausebtn");
                            $("#container .main_text li").removeClass("on");
                        }
                    });
        }


//drag용
var scaleV;
//nav 용
var infonum; 
var small_view_dan;
var small_Dan;
var lesson_info;
var page_number;
//lab audio용
var lab_audio_check=false;
var audio = new Audio();

$(function(){



    /********효과사운드********/

 

    $(document).on("click",".Button,.checkBox,.btnAnswer,.btnSolved,.closebtn,.closebtn2,.mpop,.tab,.clickWrap,.text_o,.text_x,.btnCheck, .mouseBtn, .downArea", function(e){
        if($(this).data("audio")==undefined && $(this).data("lab_audio")==undefined){
            audio.src='media/effect/click_ac0.mp3';
            audio.load();
            audio.play();      
        }else{
            if($(this).data("lab_audio")==undefined){
                audio.src='media/mp3/'+$(this).data("audio");
                audio.load();
                audio.play();
            }else{
                if(lab_audio_check==true){
                    audio.src='media/mp3/'+$(this).data("lab_audio");
                    audio.load();
                    audio.play();
                }else{
                    audio.src='../media/mp3/'+$(this).data("lab_audio");
                    audio.load();
                    audio.play();
                }
            }
             
        }
     });

     audio.addEventListener( "error", function(event){
        console.log(event);
        if($(this).data("audio")==undefined && $(this).data("lab_audio")==undefined){
            audio.src='../media/effect/click_ac0.mp3';
            audio.load();
            audio.play();      
        }else{
            if($(this).data("lab_audio")==undefined){
                audio.src='../media/mp3/'+$(this).data("audio");
                audio.load();
                audio.play();
            }else{
                audio.src='../media/mp3/'+$(this).data("lab_audio");
                audio.load();
                audio.play();
            }
             
        }

     });
       /*
    $(".checkBtn,.checkClick").on("click", function(e){
		audio.src='media/effect/click_ac1.mp3';
				audio.load();
 				audio.play();      
      });



	  $(".btnAnswer").on("click", function(e){
        audio.src='media/effect/correct_ac1.mp3';
				audio.load();
 				audio.play();      
	});
	$(".btnSolved").on("click", function(e){
        audio.src='media/effect/correct_ac4.mp3';
				audio.load();
 				audio.play();      
    })


*/



// 	// 익스플로러 체크

// var agent = navigator.userAgent.toLowerCase();

// if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {

//   alert("인터넷 익스플로러 브라우저 입니다.");

// }

// else {

//   alert("인터넷 익스플로러 브라우저가 아닙니다.");

// }



// // 크롬 체크

// var agent = navigator.userAgent.toLowerCase();

// if (agent.indexOf("chrome") != -1) {

//   alert("크롬 브라우저입니다.");

// }



// // 사파리나 체크

// var agent = navigator.userAgent.toLowerCase();

// if (agent.indexOf("safari") != -1) {

//   alert("사파리 브라우저입니다.");

// }



// // 파이어폭스 체크

// var agent = navigator.userAgent.toLowerCase();

// if (agent.indexOf("firefox") != -1) {

//   alert("파이어폭스 브라우저입니다.");

// }


 //페이지 이동간 audio
// window.onload = function (){
//  var audio = new Audio();

// 				audio.src='media/effect/change_book.mp3';
				
// 				audio.load();
				
//  				audio.play();
				
// }
/*    $(".imgArea li:first").show();

    var lastNum=$(".itemList li:last()").index();
  
    var innerPositoin=1;

    $(".arrowRight").on("click",function(){
        if(innerPositoin!==lastNum){
           innerPositoin +=1;
           $(".sliceInner>li").offset({left:-510});
        }
    });

    $(".arrowLeft").on("click",function(){
   if(innerPositoin===lastNum){
        innerPositoin -=1;
        $(".sliceInner>li").offset({left:160});
    }
    });*/

/*	$(".checkBox").on("click",function(){

        $(".imgArea li").hide();

        var b=$(this).find("p").attr("class");

        if(b==="redCheck"){
            $(this).find("p").remove();   
            $(".imgArea li:eq("+$(this).parent().index() +")").hide();         
        }else{
            $(this).append("<p class='redCheck'></p>");
            $(".imgArea li:eq("+$(this).parent().index() +")").show();
        };          
        
      });*/
      

            //페이징처리
			var thisfilefullname =decodeURI(document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.length));
            var jj_num=0;
  
        //상단 바 설정
        $("head").append($("<link>",{
            rel: "stylesheet",
            type: "text/css",
            href: "css/g4_nav.css"
        }));
        $("head").append($("<link>",{
            rel: "stylesheet",
            type: "text/css",
            href: "css/index.css"
        }));



                        setTimeout(function(){
                            
                            var nav_num=0;
                        
                            $.ajax({
                
                            url : "g4_nav.html",
                            datatype:"html",
                            success : function(data) {
                                    // var refind=$(data).filter("#nav_container");
                                    // $("#mainFrame").prepend(refind);
                                    // console.log(refind);
                                    var refind=$(data).find(".topMenu");
                                    $("#wrap").append(refind);
                                    var refind2=$(data).find(".navWrap");
                                    $(".topMenu").after(refind2);
                                    
                                    $.ajax({
                                        url: "test.xml",
                                        dataType: 'xml',
                                        type: 'get',
                                        success: function (data) {
                                            $(data).find("pageInfo").each((function(){
                                                if($(this).attr("page_name")==thisfilefullname){
                                                    $(".pagenum input[type=text]").eq(0).val($(this).attr("nav_top_pagenum"));
                                                    $(".pagenum input[type=text]").eq(1).val($(this).attr("nav_total_pagenum"));
                                                    $(".menutext").find(".titleColor").eq(0).text($(this).attr("page_title1"));
                                                    $(".menutext").find(".titleColor").eq(0).after($(this).attr("page_title2"));
                                                    $(".menutext span").eq(2).text($(this).attr("page_title3"));
                                                    // 바 없애기
                                                    if( $(this).attr("page_title3")== ""){
                                                        $(".menutext span").eq(1).text("")
                                                    }else{
                                                       $(".menutext span").eq(1).text("|")
                                                    }
                                                    $(".pagetext p").append($(this).attr("page_text"));
                                                        jj_num=$(this).attr("page_num");
                                                        nav_num=$(this).attr("nav_top_pagenum");
                                                        infonum=$(this).attr("nav_infonum");
                                                        small_Dan=$(this).attr("small_Dan");
                                                        lesson_info=$(this).attr("lesson_info");
                                                        small_view_dan=$(this).attr("small_view_dan");
                                                        page_number=$(this).attr("page");
                                                        $(".pagetext, .mainCloseBtn").attr("data-submap",$(this).attr("page_move_num"));
                                                    };						
                                                }));
            
                                            if($(".pagenum input[type=text]").eq(1).val()==nav_num  && nav_num!=1){
                                                $(".pageBtnright").addClass("pageBtnright_off");
                                                $(".pageBtnleft").addClass("pageBtnleft_on");
                                                $(".pageBtnleft").on(clickEvent, function(){
                                                    parent.GO_PAGE_PREVIOUS();
                                                });
                                            }else if(nav_num==1 && nav_num!=$(".pagenum input[type=text]").eq(1).val()){
                                                $(".pageBtnleft").addClass("pageBtnleft_off");
                                                $(".pageBtnright").addClass("pageBtnright_on");
                                                $(".pageBtnright").on( clickEvent, function( ){            
                                                    parent.GO_PAGE_NEXT();
                                                });
                                            }else if(nav_num==1 && $(".pagenum input[type=text]").eq(1).val()==1){
                                                $(".pageBtnleft").addClass("pageBtnleft_off");
                                                $(".pageBtnright").addClass("pageBtnright_off");
                                            }else{
                                                $(".pageBtnright").addClass("pageBtnright_on");
                                                $(".pageBtnleft").addClass("pageBtnleft_on");

                                                    $(".pageBtnleft").on(clickEvent, function(){
                                                        parent.GO_PAGE_PREVIOUS();
                                                    });
                                                    $(".pageBtnright").on( clickEvent, function( ){            
                                                        parent.GO_PAGE_NEXT();
                                                    });
                                            }
                                        },
                                            error: function (xhr) {
                                        },
                                            complete:function (){
                                            $.getScript( 'js/g4_nav.js' );
                                            
                                        }
                                    });
                                }
                            });
                        },100);
						
        //해보아요준비해요 이동
        $(".main .listBtn li, .main .listBtn div").on("click",function(e){
            
            var click_num=$(this).index()+1;
            var has_on_num=$(this).parent().find(".on").index()+1;
            
                var ha_ju_move_num=click_num-has_on_num;

            if(!$(this).hasClass("on")){
               parent.GO_PAGE_LOAD(Number(parent.GET_CURRENT_PAGE_NUMBER())+Number(ha_ju_move_num));
            
            } 
        });        
        //tab이동
        $(".main .tab_box .tab").on('click',function () {
            var i = $(this).index();
            $(this).siblings().removeClass("on");
            $(this).addClass("on");
            $(".main_text>ul>li").eq(i).siblings().removeClass("on");
            $(".main_text>ul>li").eq(i).addClass("on");
        })

        var pop_data;
        //팝업이동
       $(".mpop, .btnZoom, .mousepopBtn, .Button").on("click",function(){

            if($(this).hasClass(".btnZoom")==true){
                popnum = $(this).attr("class").substr(15, 1);
            }
            pop_data=$(this).data("target");

            $("head").append($("<link>",{
                rel: "stylesheet",
                type: "text/css",
                href: "./popup/css/"+pop_data+".css",
                class: pop_data
            }));
            
            $.ajax({
                url: "popup/"+pop_data+".html",
                dataType: 'html',
                type: 'get',
                success: function (data) {
                    var refind = $(data).find('#pop_container');
                    $("#wrap").append(refind);

                    video_img_error();

                     $.getScript("./popup/js/"+pop_data+".js");
                     
                     $(".closebtn").on("click",function(){
                        if($(this).parent().hasClass('popInner')) return false;
                        $('#pop_container').remove();
                        if(pop_data!=undefined){$("link."+pop_data).remove()};
                            // 팝업 닫는 함수에 추가
                            window.parent.showViewer && window.parent.showViewer();
                            lab_audio_check=false;
                    });
                    
                },complete: function(){
                        // 팝업 여는 함수에 추가
                        window.parent.hideViewer && window.parent.hideViewer();
                        lab_audio_check=true;
                    }
            });
        });

        var lab_pop_data;
        //생생 과학실 팝업 이동
        $(".goToLab").on("click",function(){
                lab_pop_data=$(this).data("target");

                $("head").append($("<link>",{
                    rel: "stylesheet",
                    type: "text/css",
                    href: "./lab_pop/css/"+lab_pop_data+".css",
                    class: lab_pop_data
                }));
                $("head").append($("<script>",{
                    src: "js/jquery.ui.touch-punch.min.js",
                    class: lab_pop_data + 'touch'
                }));
                
                    $.ajax({
                        url: "lab_pop/"+lab_pop_data+".html",
                        dataType: 'html',
                        type: 'get',
                        success: function (data) {

                            var refind = $(data).find('#pop_container');

                            $("#wrap").append(refind);

                            video_img_error();

                            $.getScript("./lab_pop/js/"+lab_pop_data+".js");

                            $(".labCloseBtn").on("click",function(){
                                $('#pop_container').remove();
                                if(lab_pop_data!=undefined){$("link."+lab_pop_data).remove(); $("script."+lab_pop_data + 'touch').remove()};
                                // 팝업 닫는 함수에 추가
                                window.parent.showViewer && window.parent.showViewer();
                                lab_audio_check=false;
                            });
                            
                        },complete: function(){
                                // 팝업 여는 함수에 추가
                                window.parent.hideViewer && window.parent.hideViewer();
                                lab_audio_check=true;
                        }
                        
                    });
         });


    //팝업 이미지 비디오 경로 찾기
        function video_img_error(){
            if($("#pop_container video").length!=0){
                for(var i=0;i<=$("#pop_container video").length;i++){
                    if($("#pop_container video").eq(i).attr("poster")!=undefined){
                        $("#pop_container video").eq(i).attr("poster",$("#pop_container video").eq(i).attr("poster").substring(1,$("#pop_container video").eq(i).attr("poster").length));
                    }
                    if($("#pop_container source").eq(i).attr("src")!=undefined){
                        $("#pop_container source").eq(i).attr("src",$("#pop_container source").eq(i).attr("src").substring(1,$("#pop_container source").eq(i).attr("src").length));
                    }
                    if($("#pop_container video").eq(i).attr("src")!=undefined){
                        $("#pop_container video").eq(i).attr("src",$("#pop_container video").eq(i).attr("src").substring(1,$("#pop_container video").eq(i).attr("src").length));
                    }
                }
            }
            if($("#pop_container img").length !=0){ 
                for(var i=0;i<=$("#pop_container img").length-1;i++){
                    // console.log(i);
                    // console.log($("#pop_container img").eq(i).attr("src").substring(1,$("#pop_container img").eq(i).attr("src").length));
                    if($("#pop_container img").eq(i).attr("src").substring(1,$("#pop_container img").eq(i).attr("src").length)!=""){
                        $("#pop_container img").eq(i).attr("src",$("#pop_container img").eq(i).attr("src").substring(1,$("#pop_container img").eq(i).attr("src").length));
                    }
                }
            };
        };

    //e-book 드래그 페이지넘김 방지
    $("body").one("drag",".ui-draggable, .ui-draggable-handle",function(){
        (document).addEventListener('pointerup', function(e){ 
            e.stopPropagation(); 
        });
    });

    $("body").on("drop",".ui-draggable, .ui-draggable-handle",function(){
        video_img_error();
    });
    //과학,실험관찰 이동
    $(".goTomain").on("click",function(){
        if($(this).data("go_contents_sub")!=undefined){
            jj.link.html('/viewer/contents/index.html?contentInformationURL=../../resource/contents_sub/lesson0'+lesson_info+'/&page='+Number($(this).data("go_contents_sub")), '_top');
        }else if($(this).data("go_contents")!=undefined){
            jj.link.html('/viewer/contents/index.html?contentInformationURL=../../resource/contents/lesson0'+lesson_info+'/&page='+Number($(this).data("go_contents")), '_top');
        }
    });


    //과학 tab 이동;
    $(".goTomain_tab").on("click",function(){
        const tabNum = Number($(this).data("tab_idx"));
        const param = {parameter: tabNum};
        jj.link.html('/viewer/contents/index.html?contentInformationURL=../../resource/contents_sub/lesson0'+lesson_info+'/&page='+Number($(this).data("go_contents_sub")), '_top', param);
    });
});




