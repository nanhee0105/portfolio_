var isMobile;
var isAndroid;
var downEvent, moveEvent, upEvent, overEvent, outEvent;

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
) {
  isMobile = true;
  downEvent = 'touchstart';
  moveEvent = 'touchmove';
  upEvent = 'touchend';
} else {
  isMobile = false;
  downEvent = 'mousedown';
  moveEvent = 'mousemove';
  upEvent = 'mouseup';
  overEvent = 'mouseover';
  outEvent = 'mouseout';
}

$(function () {
  var target = $('.zoombg1');
  var zoom = 1;
  var zoomIdx = 0;
  var TargetWidth = parseInt(target.css('width'));
  var TargetHeight = parseInt(target.css('height'));

  $('.overBox1').css(
    'background-size',
    parseInt(target.css('width')) * zoom +
      'px ' +
      parseInt(target.css('height')) * zoom +
      'px'
  );
  $('.overBox1').css('background-position', '0px 0px');
  $('.overBox1 > img').css('pointer-events', 'none');

  var parentWidth = parseInt($('.bar').css('width'));
  $('.dot1').on(downEvent, function (e) {
    var mx = isMobile ? e.touches[0].pageX : e.pageX;
    var parentLeft = $('.bar').offset().left;
    var parentWidthPer = parentWidth / 100;
    var thisPos = mx - parentLeft;
    $('body').css({
      'user-select': 'none',
      '-ms-user-select': 'none',
      '-moz-user-select': 'none',
      '-webkit-user-select': 'none',
    });
    $('#container').on(moveEvent, function (e) {
      e.stopPropagation();
      $('body').css({
        'user-select': 'none',
        '-ms-user-select': 'none',
        '-moz-user-select': 'none',
        '-webkit-user-select': 'none',
      });
      var mx = isMobile ? e.touches[0].pageX : e.pageX;
      thisPos = mx - parentLeft;

      if (thisPos > parentWidth - 12 * parentWidthPer) {
        thisPos = parentWidth - 12 * parentWidthPer;
      }
      if (thisPos < 0) {
        thisPos = 0;
      }
      var allWidth = (thisPos / parentWidth) * 100;

      $('.dot1').css('left', allWidth + '%');
      zoomIdx = allWidth * parentWidthPer;
      magnifys();
    });
    $('#container').on(upEvent, function () {
      $('#container').off(moveEvent);
      $('#container').off(upEvent);
      $('body').css({
        'user-select': 'auto',
        '-ms-user-select': 'auto',
        '-moz-user-select': 'auto',
        '-webkit-user-select': 'auto',
      });
    });
  }); // range 바

  $('.rangeBtn1').each(function () {
    $(this).on('click', function () {
      if ($(this).hasClass('plus')) {
        if (zoomIdx < 90) zoomIdx += 11.4;
      }
      if ($(this).hasClass('minus')) {
        if (zoomIdx > 0) zoomIdx -= 11.4;
      }

      if (zoomIdx > 90) zoomIdx = 90;
      if (zoomIdx < 0) zoomIdx = 0;

      var allWidth = (zoomIdx / parentWidth) * 100;

      $('.dot1').css('left', allWidth + '%');
      magnifys();
    });

    $(this)
      .on(overEvent, function () {
        $(this).addClass('on');
      })
      .on(outEvent, function () {
        $(this).removeClass('on');
      });
  }); // +, - 버튼

  var zoomNum = 3; // 배율
  var per = (90 / 100) * (100 / (zoomNum - 1));
  function magnifys(x, y) {
    var Item = $('.overBox1').css('background-size').split(' ');
    ItemX = Number(Item[0].replace('px', ''));
    ItemY = Number(Item[1].replace('px', ''));
    var pos = $('.overBox1').css('background-position').split(' ');
    posX = Number(pos[0].replace('px', ''));
    posY = Number(pos[1].replace('px', ''));
    var saveZoom = zoom;

    zoom = (zoomIdx + per) / per;
    zoom = Number(zoom.toFixed(2));

    if (saveZoom != zoom) {
      $('.overBox1').css('transform', 'scale(' + zoom + ')');
      $('.overBox1').css(
        'background-size',
        TargetWidth * zoom + 'px ' + TargetHeight * zoom + 'px'
      );

      if (ItemX == TargetWidth && ItemY == TargetHeight) {
        var bgPosX = (-TargetWidth / 2) * (zoom - 1);
        var bgPosY = (-TargetHeight / 2) * (zoom - 1);
        $('.overBox1').css(
          'background-position',
          bgPosX + 'px ' + bgPosY + 'px'
        );

        var Xper = (-bgPosX / (TargetWidth * (zoom - 1))) * 100;
        var Yper = (-bgPosY / (TargetHeight * (zoom - 1))) * 100;
        $('.overBox1').css('transform-origin', Xper + '% ' + Yper + '%');
      } else {
        var bgPosX =
          (-TargetWidth / (-(ItemX - TargetWidth) / posX)) * (zoom - 1);
        var bgPosY =
          (-TargetHeight / (-(ItemY - TargetHeight) / posY)) * (zoom - 1);
        $('.overBox1').css(
          'background-position',
          bgPosX + 'px ' + bgPosY + 'px'
        );

        var Xper = (-bgPosX / (TargetWidth * (zoom - 1))) * 100;
        var Yper = (-bgPosY / (TargetHeight * (zoom - 1))) * 100;
        $('.overBox1').css('transform-origin', Xper + '% ' + Yper + '%');
      }
    }
  } // 돋보기 기능

  $('.overBox1').on(downEvent, function (e) {
    var Item = $('.overBox1').css('background-size').split(' ');
    ItemX = Number(Item[0].replace('px', ''));
    ItemY = Number(Item[1].replace('px', ''));
    var pos = $('.overBox1').css('background-position').split(' ');
    posX = Number(pos[0].replace('px', ''));
    posY = Number(pos[1].replace('px', ''));

    var mx = isMobile ? e.touches[0].pageX : e.pageX;
    var my = isMobile ? e.touches[0].pageY : e.pageY;

    var parentLeft = $('.overBox1').offset().left;
    var parentTop = $('.overBox1').offset().top;

    var thisPosX = mx - parentLeft;
    var thisPosY = my - parentTop;

    var ori = $('.overBox1').css('transform-origin').split(' ');
    oriX =
      (($('.overBox1').width() - $('.overBox1').width() / zoom) / 100) *
      ((Number(ori[0].replace('px', '')) / $('.overBox1').width()) * 100);
    oriY =
      (($('.overBox1').height() - $('.overBox1').height() / zoom) / 100) *
      ((Number(ori[1].replace('px', '')) / $('.overBox1').height()) * 100);

    $(document).on(moveEvent, function (e) {
      var dragx = isMobile ? e.touches[0].pageX : e.pageX;
      var dragy = isMobile ? e.touches[0].pageY : e.pageY;

      var thisPosdragX = dragx - parentLeft;
      var thisPosdragY = dragy - parentTop;

      var posMove = $('.overBox1').css('background-position').split(' ');
      var posMoveX = Math.abs(Number(posMove[0].replace('px', '')));
      var posMoveY = Math.abs(Number(posMove[1].replace('px', '')));

      var targetX = ItemX - TargetWidth;
      var targetY = ItemY - TargetHeight;

      var thisPosItemX = (thisPosdragX - thisPosX) * zoom + posX;
      var thisPosItemY = (thisPosdragY - thisPosY) * zoom + posY;

      if (thisPosItemX > 0) thisPosItemX = 0;
      if (thisPosItemY > 0) thisPosItemY = 0;
      if (thisPosItemX < -targetX) thisPosItemX = -targetX;
      if (thisPosItemY < -targetY) thisPosItemY = -targetY;

      var Xper = (posMoveX / (TargetWidth * (zoom - 1))) * 100;
      var Yper = (posMoveY / (TargetHeight * (zoom - 1))) * 100;

      $('.overBox1').css('transform-origin', Xper + '% ' + Yper + '%');
      $('.overBox1').css(
        'background-position',
        thisPosItemX + 'px ' + thisPosItemY + 'px'
      );
    });
    $(document).on(upEvent, function () {
      $(document).off(moveEvent);
      $(document).off(upEvent);
    });
  }); // 화면 드래그
  /* 돋보기 */
}); // end
