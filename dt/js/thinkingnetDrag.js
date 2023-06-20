window.addEventListener('load', function () {
  const contents = document.querySelector('#contents');

  const targetImgs = document.querySelectorAll('.imgItem');
  const targetTexts = document.querySelectorAll('.txtItem');

  const resetBtn = document.querySelector('.thinkresetBtn');
  const answerBtn = document.querySelector('.thinkanswerBtn');

  let itemCheckArray = [];

  const audio = new Audio();

  const effOkSound = new Audio('./media/drag/eff_ok.mp3');
  const effFailSound = new Audio('./media/drag/eff_fail.mp3');

  let index = 0;

  let itemImg = {
    dom: '',
    itemX: '',
    itemY: '',
  };

  let itemTxt = {
    dom: '',
    itemX: '',
    itemY: '',
  };

  let itemState = {
    startX: '',
    startY: '',
  };
  const getEventPosition = (event) => {
    const eventTarget = isTouchEvent(event)
      ? event.changedTouches[0] || event.touches[0]
      : event;

    return {
      x: eventTarget.clientX,
      y: eventTarget.clientY,
    };
  };

  function blockedViewerSlide(e) {
    e.stopPropagation();
  }

  // 웹뷰 드래그 취소
  function dragMoveStop() {
    contents.addEventListener('mousemove', blockedViewerSlide);
    contents.addEventListener('touchmove', blockedViewerSlide);
  }

  // 웹뷰 드래그 가능
  function dragMoveResume() {
    contents.removeEventListener('mousemove', blockedViewerSlide);
    contents.removeEventListener('touchmove', blockedViewerSlide);
  }

  const isTouchEvent = (event) => {
    return event.type.indexOf('touch') > -1;
  };
  //드래그 시작
  const dragStart = function (event) {
    getEventPosition(event);

    effFailSound.load();
    effOkSound.load();
    //이미지
    itemImg.dom = this;
    itemImg.itemX = this.offsetLeft;
    itemImg.itemY = this.offsetTop;

    itemState.startX = getEventPosition(event).x;
    itemState.startY = getEventPosition(event).y;

    contents.addEventListener('mousemove', dragMove);
    contents.addEventListener('touchmove', dragMove);
    contents.addEventListener('mouseup', dragEnd);
    contents.addEventListener('touchend', dragEnd);
    // effOk.muted = false;
    // effFail.muted = false;
    dragMoveStop();
  };

  const dragStartText = function (event) {
    getEventPosition(event);

    effFailSound.load();
    effOkSound.load();

    //텍스트
    itemTxt.dom = this;
    itemTxt.itemX = this.offsetLeft;
    itemTxt.itemY = this.offsetTop;

    itemState.startX = getEventPosition(event).x;
    itemState.startY = getEventPosition(event).y;

    contents.addEventListener('mousemove', dragMoveText);
    contents.addEventListener('touchmove', dragMoveText);
    contents.addEventListener('mouseup', dragEndText);
    contents.addEventListener('touchend', dragEndText);
    // effOk.muted = false;
    // effFail.muted = false;
    dragMoveStop();
  };

  //드래그 중
  const dragMove = function (event) {
    const eventX = getEventPosition(event).x;
    const eventY = getEventPosition(event).y;

    const moveX = (eventX - itemState.startX) / scale;
    const moveY = (eventY - itemState.startY) / scale;

    itemImg.dom.style.left = `${itemImg.itemX + moveX}px`;
    itemImg.dom.style.top = `${itemImg.itemY + moveY}px`;
  };

  const dragMoveText = function (event) {
    const eventX = getEventPosition(event).x;
    const eventY = getEventPosition(event).y;

    const moveX = (eventX - itemState.startX) / scale;
    const moveY = (eventY - itemState.startY) / scale;

    itemTxt.dom.style.left = `${itemTxt.itemX + moveX}px`;
    itemTxt.dom.style.top = `${itemTxt.itemY + moveY}px`;
  };

  //드래그 끝
  const dragEnd = (event) => {
    var currentImage = event.target;
    itemImg.dom.style.pointerEvents = 'none';
    const element = document.elementFromPoint(
      getEventPosition(event).x,
      getEventPosition(event).y
    );
    if (
      // itemImg.dom.getAttribute('data-item') ===
      // element.getAttribute('data-img-item-point')
      element.hasAttribute('data-img-item-point') && !element.classList.contains('isDropped')
    ) {
      itemImg.dom.style.display = 'none';
      itemCheckArray.push(itemImg.dom);
      
      element.classList.add('isDropped');
      element.querySelector('img').src = itemImg.dom.querySelector('img').src;
      element.querySelector('img').style.display = 'block';
      // resetBtn.style.display = 'block';
      // answerBtn.style.display = 'none';
      
      if (element.hasAttribute('data-img-item-point') && itemImg.dom.getAttribute('data-item') !== element.getAttribute('data-img-item-point')) {
        element.querySelector('.thinkagain').classList.add('show');
        itemCheckArray.splice(itemCheckArray.length-1, 1);
        var thinkagainImage = setTimeout(() => {
          var el = element;
          el.querySelector('.thinkagain').classList.remove('show');
          el.querySelector('img').style.display = 'none';
          el.classList.remove('isDropped');
          currentImage.style.display = 'block';
          currentImage.style.left = '';
          currentImage.style.top = '';
          currentImage.style.pointerEvents = 'auto';
        }, 2500);
        
        thinkagainSetTime.push(thinkagainImage);
      }
      else {
        effOkSound.play();
        isUserDragged = true;
      }
    } else {
      effFailSound.play();
      itemImg.dom.style.left = '';
      itemImg.dom.style.top = '';
      itemImg.dom.style.pointerEvents = 'auto';
    }
    contents.removeEventListener('mousemove', dragMove);
    contents.removeEventListener('touchmove', dragMove);
    contents.removeEventListener('mouseup', dragEnd);
    contents.removeEventListener('touchend', dragEnd);

    dragMoveResume();
    valueCheck();
  };

  const dragEndText = (event) => {
    var currentText = event.target;
    itemTxt.dom.style.pointerEvents = 'none';
    const element = document.elementFromPoint(
      getEventPosition(event).x,
      getEventPosition(event).y
    );

    if (
      // itemTxt.dom.getAttribute('data-item-txt') ==
      // element.getAttribute('data-text')
      element.hasAttribute('data-text') && element.value === ''
    ) {
      itemTxt.dom.style.display = 'none';
      itemCheckArray.push(itemTxt.dom);
      
      element.value = itemTxt.dom.querySelector('span').innerText;
      // resetBtn.style.display = 'block';
      // answerBtn.style.display = 'none';

      if (element.hasAttribute('data-text') && itemTxt.dom.getAttribute('data-item-txt') !== element.getAttribute('data-text')) {
        element.parentElement.querySelector('.thinkagain').classList.add('show');
        itemCheckArray.splice(itemCheckArray.length-1, 1);
        var thinkagainText = setTimeout(() => {
          var el = element;
          el.parentElement.querySelector('.thinkagain').classList.remove('show');
          el.value = '';
          currentText.style.display = 'block';
          currentText.style.left = '';
          currentText.style.top = '';
          currentText.style.pointerEvents = 'auto';
        }, 2500);
        
        thinkagainSetTime.push(thinkagainText);
      }
      else {
        effOkSound.play();
        isUserDragged = true;
      }
    } else {
      effFailSound.play();

      itemTxt.dom.style.left = '';
      itemTxt.dom.style.top = '';
      itemTxt.dom.style.pointerEvents = 'auto';
    }

    contents.removeEventListener('mousemove', dragMoveText);
    contents.removeEventListener('touchmove', dragMoveText);
    contents.removeEventListener('mouseup', dragEndText);
    contents.removeEventListener('touchend', dragEndText);

    dragMoveResume();
    valueCheck();
  };

  const valueCheck = () => {
    const dragItems = document.querySelectorAll('.dragItem');
    
    Array.from(dragItems).forEach((item, index, array) => {
      if (array.length == itemCheckArray.length) {
        answerBtn.style.display = 'none';
        resetBtn.style.display = 'block';
      }
    });
  };

  //리셋
  function dragReset() {
    const answerImg = document.querySelectorAll('.answer > img');
    const answerTxt = document.querySelectorAll('.answer > input, .answer > textarea');

    answerImg.forEach((item) => {
      item.style.display = 'none';
      item.parentElement.classList.remove('isDropped');
    });
    targetImgs.forEach((item) => {
      item.style.display = 'block';
      item.style.left = '';
      item.style.top = '';
      item.style.pointerEvents = 'auto';
    });

    answerTxt.forEach((item) => {
      item.value = '';
      item.parentElement.classList.remove('isDropped');
    });
    targetTexts.forEach((item) => {
      item.style.display = 'block';
      item.style.left = '';
      item.style.top = '';
      item.style.pointerEvents = 'auto';
    });

    resetBtn.style.display = 'none';
    itemCheckArray = [];
    isUserDragged = false;
  }

  //타겟 시작
  targetImgs.forEach((itemImg) => {
    itemImg.addEventListener('mousedown', dragStart);
    itemImg.addEventListener('touchstart', dragStart);
  });
  targetTexts.forEach((itemTxt) => {
    itemTxt.addEventListener('mousedown', dragStartText);
    itemTxt.addEventListener('touchstart', dragStartText);
  });

  resetBtn.addEventListener('click', dragReset);
});

var isUserDragged = false;
var thinkagainSetTime = [];

$(function () {
  $('.thinkanswerBtn').on('click', function () {
    if (!isUserDragged) {
      $('.doitsolve').addClass('show');
      setTimeout(function() {
        $('.doitsolve').removeClass('show');
      }, 1000);
      return;
    } 

    thinkagainSetTime.forEach(function(value) {
      clearTimeout(value);
    });

    $('.thinkagain').each(function (index, item) {
      item.classList.remove('show');
    });

    $(this).hide();
    $('.thinkresetBtn').show();
    $('.answer img').show();
    $('.answer img').each(function () {
      this.src = this.getAttribute('data-src');
      this.parentElement.classList.remove('isDropped');
    });
    $('.answer input, .answer textarea').each(function () {
      $(this).val($(this).attr('data-answer'));
    });

    var items = $('.dragItem').get();
    for (var i = 0; i < items.length; i++) {
      items[i].style.display = 'none';
    }
  });
  $('.thinkresetBtn').on('click', function () {
    $('.thinkanswerBtn').show();
  });

  $('.answer').each(function(index, item) {
    var thinkagain = document.createElement('div');
    thinkagain.classList.add('thinkagain');
    thinkagain.innerHTML = '<span>다시 생각해 보세요.</span>';
    item.appendChild(thinkagain);
  });
});
