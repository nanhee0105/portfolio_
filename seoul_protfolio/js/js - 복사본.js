$(function () {
    // 퀵메뉴
    $('.quickMenu .menuBg').on('click', function(){
        $(this).hide();
        $('.quickMenu .menu').fadeIn(100);
    });

    $('.quickMenu .closeQuick').on('click', function(){
        $('.quickMenu .menu').fadeOut(100);
        $('.quickMenu .menuBg').show();
    });


    $('.quickMenu .searchBtn').on('click', function(){
        $('.quickMenu .search').toggleClass('aniIn');

        if( $(".quickMenu .search").hasClass("aniIn")) {
            $(".quickMenu .search").animate({right: '80px'});
            $(".quickMenu .search").removeClass("left");
        } else  {
            $(".quickMenu .search").animate({right: '-120px'});
            $(".quickMenu .search").addClass("aniIn");
        }
    });

  

    

    // 메뉴
    $('ul.nav').mouseover(function () {
        $('ul.nav ul.depth').stop().fadeIn(300);
        $('.depthBg').stop().fadeIn(300);
        $('.depthBg').css('pointer-events', 'auto');
    });
    $('ul.nav').mouseleave(function () {
        $('ul.nav ul.depth').stop().fadeOut(300);
        $('.depthBg').stop().fadeOut(300);
        $('.depthBg').css('pointer-events', 'none');
    });

     //모바일 메뉴
     $('.lnbM > ul > li').on('click', function () {
        $('.depth').hide();
        $(this).find('.depth').show();
    });
    $('.tabMenuP button').on('click', function () {
        $(this).toggleClass('open');
        $('.lnb').toggleClass('fadeIn');
    });

    $('.tabMenuM button').on('click', function () {
        $('.lnbM').toggleClass('fadeIn');
        $('.lnbM').removeClass('fadeOut');
    });

    $('.lnbM  .close').on('click', function () {
        $('.lnbM').removeClass('fadeIn');
        $('.lnbM').toggleClass('fadeOut');
        $('.depth').hide();
        $('.lnbM > ul > li:nth-of-type(1) .depth').show();
    });

    


    // 메인이미지 도트 클릭시
    $('.dot span').on('click', function () {
        $(this).addClass('on');
        $(this).siblings().removeClass('on')
    });

    let $item = $('.dot span').on('click', function () {
        let idx = $item.index(this);
        $('.visual > div').removeClass('imgShow');
        $('.visual > div:eq(' + idx + ')').addClass('imgShow');
    });


    // 메인 이미지 자동 슬라이드
    var countV = 0; // 현재 보여지는 이미지
    var visualLen = $('.visual div').length;//이미지 갯수
    var button = $('.dot span');
    var setTime; // 시간 기억

    timer(); // 시간제어 함수
    function timer(){
        setTime = setInterval(function(){
            if(countV == (visualLen - 1)){
                countV = 0;
            } else {
                countV++;
            }
            
            button.eq(countV).trigger('click');
        }, 3500);
    }

   

    $('.tabBtn button').click(function(){
        var $this = $(this);
        var index = $this.index();
        
        $this.addClass('active');
        $this.siblings('button.active').removeClass('active');
        
        // var $outer = $this.closest('.outer');
        var $current = $('.tabs > .tab.active');
        var $post = $('.tabs > .tab').eq(index);
        
        $current.removeClass('active');
        $post.addClass('active');
        // 위의 코드는 탭메뉴 코드입니다.
        
        $('.tabBoxWrap').slick('setPosition');
        // 탭 페이지 안에서 slick 사용시 – slick이 첫페이지에 있지 않으면 slick의 첫번째 이미지가 보이지 않고 2번째 부터 도는것을 확인 할 수 있다. 해당 문제는 탭이 active가 된 후 그 페이지에 slick이 있다면 = slick의 위치를 수동으로 새로 고쳐줘야 한다.
    });

       //핫클릭 문화행사
       $('.tabBoxWrap').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 2000,
        responsive: [
            {
              breakpoint: 1500, 
            settings: {
                 slidesToShow: 3,
                 arrows: false,
              }
            },
            {
                breakpoint: 700, 
              settings: {
                   slidesToShow: 1,
                   arrows: false,
                }
              }
          ]
      });
  

   
      
      
    $('.eventCont').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        autoplay : true, 
        autoplaySpeed : 2000,
        arrows : true, 
    });

    $('.event .play').click(function(){
         $('.eventCont').slick('slickPlay');
    });
    
    $('.event .stop').click(function(){
        $('.eventCont').slick('slickPause');
    });
        
    $('.newsCont').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        autoplay : true, 
        autoplaySpeed : 2000,
        arrows : true, 
    });

    $('.news .play').click(function(){
        console.log("뉴스 플레이");
        $('.newsCont').slick('slickPlay');
    });
    
    $('.news .stop').click(function(){
        console.log("뉴스 스탑");
        $('.newsCont').slick('slickPause');
    });



  

   


    //   let $hotitem = $(".tabBtn li").on("click", function () {
    //     console.log(111)
    //     $(this).siblings().removeClass('on');
    //     $(this).addClass('on');
    //     let idx = $hotitem.index(this);
    //     $('.tabBoxWrap').removeClass('on');
    //     $('.slideWrap .tabBoxWrap:eq(' + idx + ')').addClass('on');
    //     console.log(   idx   )

    //     // $('.tabBox').animate({left: 0});
    //     // $('.tabBoxWrap .tabBox').css("left", "0");
    //     count = 0;
    // });

    //슬라이드


    // let width = $('.hotClickWrap .textAdd').outerWidth(true);
    // let prev = $('.hotClickWrap .prev');
    // let next = $('.hotClickWrap .next');
    // let count = 0;
    // let widthC = -width;
   
    
    // function move(num, maxCount){
    //     $(prev).removeClass('none');
    //     $(next).removeClass('none');
    //     $('.tabBoxWrap .tabBox').stop().animate({left: num});

    //     if ( count == (maxCount - 6) ) $(next).addClass('none');
    //     if ( count == 0 ) $(prev).addClass('none');
    // }
  
    // $(next).on('click', function(){
    //     let length = $('.tabBoxWrap .tabBox.on .textAdd').length;
    //     if ( count < (length - 6)  ) { //true일 때 실행
    //        count++;
    //         move((widthC * count), length);
    //      }
    // });

    // $(prev).on('click', function(){
    //     console.log(count)
    //   if ( count  > 0 ) { //true일 때 실행
    //          count--;
    //         move(widthC * count);
    //      }
    // });

   

    // //터치 슬라이드
    // $('.tabBox').swipe({
    //     swipe:function(event, direction, distance, duration, fingerCount, tingerData){
    //         if(direction == 'right'){
    //            $('.slideWrap .prev').trigger('click');
    //         }else if(direction == 'left'){
    //            $('.slideWrap .next').trigger('click');
    //         }
    //     },
    //      threshold:0,
    //      fingers:'all',
         
    //      excludedElements:'.prev, .next'
    //  });
     

     
    //  슬릭, 이달의 문화 영상
    $('.slider-single').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        infinite: true,
        centerMode: true,
        asNavFor: '.slider-nav',
        adaptiveHeight: true,
    });
    $('.slider-nav').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        asNavFor: '.slider-single',
        dots: false,
        focusOnSelect: true,
        infinite: true,
        focusOnSelect: false,
        responsive: [
            {
              breakpoint: 1500, // 화면의 넓이가 600px 이상일 때
            settings: {
                 slidesToShow: 4,
              }
            },
            {
                breakpoint: 700, 
                settings: {
                    slidesToShow: 2,
                 }
              }
          ]
    });
    
    $('.slider-single').on('afterChange', function(event, slick, currentSlide) {
        $('.slider-nav').slick('slickGoTo', currentSlide);
        var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
    });
   
    $('.slider-nav').on('click', '.slick-slide', function(event) {
        event.preventDefault();
        var goToSingleSlide = $(this).data('slick-index');
   
        $('.slider-single').slick('slickGoTo', goToSingleSlide);
    });


    $('.slider-single > div img').on('click', function(){
        $(this).hide();
        $(this).siblings('iframe').show();
        $(this).siblings('iframe')[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}','*');	
    });

    $('slider-nav > div').on('click', function(){
        $('iframe')[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}','*');	
    }); //수정해야함.



    $('.slideEvent').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 2000,
        draggable : false,
        responsive: [
            {
              breakpoint: 1500, // 화면의 넓이가 600px 이상일 때
            settings: {
                 slidesToShow: 5,
                 draggable : true,
              }
            },
            {
                breakpoint: 700, // 화면의 넓이가 600px 이상일 때
              settings: {
                   slidesToShow: 3,
                   draggable : true,
                }
              }
          ]
      });


      //관련 사이트
      $('.siteSlide').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 2000,
        responsive: [
            {
              breakpoint: 1500, // 화면의 넓이가 600px 이상일 때
            settings: {
                 slidesToShow: 4,
                 arrows: false,
              }
            },
            {
                breakpoint: 700, // 화면의 넓이가 600px 이상일 때
              settings: {
                   slidesToShow: 3,
                   arrows: false,
                }
              },
              {
                breakpoint: 500, // 화면의 넓이가 600px 이상일 때
              settings: {
                   slidesToShow: 2,
                   arrows: false,
                }
              }
          ]
        
      });

    
    

       //슬릭 문화소식
       
       $('.slideCont').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 2000,
        responsive: [
          {
            breakpoint: 1500, // 화면의 넓이가 600px 이상일 때
          settings: {
               slidesToShow: 3,
               arrows: false,
            }
          },
          {
            breakpoint: 700, // 화면의 넓이가 600px 이상일 때
          settings: {
               slidesToShow: 1,
               arrows: false,
            }
          }
        ]
      });

   
});



// prevArrow : "<button type='button' class='slick-prev'>Previous</button>",		
// 이전 화살표 모양 설정
// nextArrow : "<button type='button' class='slick-next'>Next</button>",	
// 다음 화살표 모양 설정