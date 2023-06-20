$(document).ready(function () {
  /* 슬라이드 */
  var aniTime = 300;
  var currentIndex = 0;
  var $newIndex = 0;

  var $bannerSlide = $('.slider_in');
  var SliderWidth = '605';
  // var bannerLength = $bannerSlide.children('div').length;
  let bannerLength;
  let pageNumber;

  // $bannerSlide.css('width', SliderWidth * bannerLength + 'px');
  // $bannerSlide.children('div').css('width', SliderWidth + 'px');

  if (bannerLength == '1') {
    $('.page_wrap > span').addClass('out');
  }

  $('.next').on('click', function () {
    nextBanner();
  });

  $('.prev').on('click', function () {
    prevBanner();
  });

  function nextBanner() {
    $newIndex = currentIndex + 1;
    if ($newIndex >= bannerLength) {
      $newIndex = 0;
    }
    showSlide($newIndex, pageNumber);
  }

  function prevBanner() {
    $newIndex = currentIndex - 1;
    if ($newIndex < 0) {
      $newIndex = bannerLength - 1;
    }
    showSlide($newIndex, pageNumber);
  }

  function showSlide($newIndex, index) {
    if ($newIndex != currentIndex) {
      var newPosition = -SliderWidth * $newIndex;
      $('.title span').hide();
      $bannerSlide.stop();
      $bannerSlide.animate({ left: newPosition }, aniTime, function () {
        $('.title span').show();
        var txt = $bannerSlide
          .eq(index)
          .find('div img')
          .eq($newIndex)
          .attr('data-title');
        $('.title').find('span').text(txt);
      });
      showDot($newIndex);
      currentIndex = $newIndex;
    }
  }

  function goSlide($newIndex, index) {
    var newPosition = -SliderWidth * $newIndex;
    $bannerSlide.stop();
    $bannerSlide.css({ left: newPosition });
    var txt = $bannerSlide.eq(index).find('div img').eq(0).attr('data-title');
    $('.title').find('span').text(txt);
    showDot($newIndex);
    currentIndex = $newIndex;
  }

  function showDot($newIndex) {
    if ($newIndex == '0') {
      $('.prev').addClass('out');
      $('.next').removeClass('out');
    } else if ($newIndex == bannerLength - 1) {
      $('.next').addClass('out');
      $('.prev').removeClass('out');
    } else {
      $('.prev,.next').removeClass('out');
    }
  }
  /* 슬라이드 끝 */

  /* 하단 텝 끝 */
  var popupNm = $('.simg_btn').on(clickEvent, function () {
    var popupIndex = popupNm.index(this);
    $("[id^='checke_']").removeClass('cur');
    $('.popupOrder').eq(popupIndex).addClass('dim').show();
    $('.slider').eq(popupIndex).addClass('on');
    bannerLength = $bannerSlide.eq(popupIndex).children('div').length;
    goSlide(0, popupIndex);
   
    $bannerSlide.eq(popupIndex).css('width', SliderWidth * bannerLength + 'px');
    $bannerSlide
      .eq(popupIndex)
      .children('div')
      .css('width', SliderWidth + 'px');

    showSlide($newIndex, popupIndex);
    pageNumber = popupIndex;
  });

  $('.popupc_btn').on(clickEvent, function () {
    $newIndex = 0;
    showSlide($newIndex, 0); //슬라이드 초기화.
    $('.popupOrder').hide();
  });
});
