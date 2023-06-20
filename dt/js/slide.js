var count = [];
var slidePos = [];

$(function(){
  
  $('.sliderWrap').each(function(index){
    count[index] = 0;
    //slidePos[index] = $(this).find('.slideView').width();
    console.log(slidePos[index]);
    var _this = $(this);
    $(this).find('.itemList').each(function(idx){
      var div;
      if( idx == 0 ){
        div = '<div class="slideDot active"></div>';
      } else {
        div = '<div class="slideDot"></div>';
      };
      $(_this).find('.slideDotWrap').append(div);
    }); // 도트 자동 생성
    
    $(this).children('p').on('click', function(){
      if( $(this).hasClass('arrowLeft') ){
        slide('left', _this, index);
      } else {
        slide('right', _this, index);
      };
    }); // 좌우 버튼 클릭
    
    $(this).find('.slideDot').on('click', function(){
      count[index] = $(this).index();
      slide('', _this, index);
    }); // 슬라이드 도트 클릭
  }); // 슬라이드 갯수
  
  /* window.addEventListener('resize', () => {
    $('.sliderWrap').css({'overflow': 'visible'});
    setTimeout(() => {
      $('.sliderWrap').css({'overflow': 'hidden'});
    }, 100);
  }); */
}); // end

function slide(pos, parents, index){
  
  slidePos[index] = $('.sliderWrap').eq(index).find('.slideView').width();  //위치 변경 (로딩!~~~)
  
  $(parents).find('.arrowLeft').removeClass('off');
  $(parents).find('.arrowRight').removeClass('off');
  
  if( pos == 'left' ){
    if( count[index] > 0 ){
      count[index]--;
    }; 
  } else if( pos == 'right' ) {
    if( count[index] < $(parents).find('.sliceInner').children().length - 1 ){
      count[index]++;
    }; 
  };
  
  if( count[index] == 0 ) $(parents).find('.arrowLeft').addClass('off');
  if( count[index] == $(parents).find('.sliceInner').children().length - 1 ) $(parents).find('.arrowRight').addClass('off');
  
  $(parents).find('.sliceInner').stop().animate({'left': -slidePos[index] * count[index]}, 500);
  $(parents).find('.slideDot').removeClass('active');
  $(parents).find('.slideDot').eq(count[index]).addClass('active');
}; // 슬라이드
