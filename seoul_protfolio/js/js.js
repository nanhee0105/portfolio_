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
        } else  {
            $(".quickMenu .search").animate({right: '-120px'});
            $(".quickMenu .search").removeClass("aniIn");
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
              breakpoint: 1500, 
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
    });



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
              breakpoint: 1500, 
            settings: {
                 slidesToShow: 5,
                 draggable : true,
              }
            },
            {
                breakpoint: 700, 
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
              breakpoint: 1500, 
            settings: {
                 slidesToShow: 4,
                 arrows: false,
              }
            },
            {
                breakpoint: 700, 
              settings: {
                   slidesToShow: 3,
                   arrows: false,
                }
              },
              {
                breakpoint: 500, 
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

   
});



// prevArrow : "<button type='button' class='slick-prev'>Previous</button>",		
// 이전 화살표 모양 설정
// nextArrow : "<button type='button' class='slick-next'>Next</button>",	
// 다음 화살표 모양 설정