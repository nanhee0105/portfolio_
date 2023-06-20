window.addEventListener('load', () => {
  const effOk = new Audio('./media/drag/eff_ok.mp3');
  const effFail = new Audio('./media/drag/eff_fail.mp3');

  effOk.preload = 'metadata';
  effFail.preload = 'metadata';
  effOk.load();
  effFail.load();
  effOk.muted = true;
  effFail.muted = true;

  setTimeout(() => {
    effOk.play();
    effFail.play();

    // pc에서 드래그 end 시점에 사운드가 겹치는 현상이 있음
    setTimeout(() => {
      effOk.pause();
      effFail.pause();
    }, 200);

  }, 500);

  const icon = document.querySelector('.resetBtn');
  const wrap = document.querySelector('.wrap');
  const answerPopUp = document.querySelector('.pupUpBtn');

  const drItems = Array.prototype.map.call(
    document.querySelectorAll('.dr_item'),
    (el) => el
  );

  const items = drItems.map((item) => {
    return {item, state: false};
  });

  let targetItem = {
    dom: '',
    ItemX: '',
    ItemY: '',
    itemPoint: '',
  };

  let itemState = {
    startX: '',
    startY: '',
    LeftPx: 0,
    TopPx: 0,
    zoom: null,
  };

  function blockedViewerSlide(e) {
    e.stopPropagation();
  }

  // 웹뷰 드래그 취소
  function dragMoveStop() {
    wrap.addEventListener('mousemove', blockedViewerSlide);
    wrap.addEventListener('touchmove', blockedViewerSlide);
  }

  // 웹뷰 드래그 가능
  function dragMoveResume() {
    wrap.removeEventListener('mousemove', blockedViewerSlide);
    wrap.removeEventListener('touchmove', blockedViewerSlide);
  }

  const offPointerElements = [];

  //타겟 중복 금지
  function getItemPoint(event) {
    let roleValue;
    let index = 0;
    const element = document.elementFromPoint(
      getEventPosition(event).x,
      getEventPosition(event).y
    );

    function get(__element) {
      const value = __element.getAttribute('data-role-val');
      index++;

      if (index > 10) {
        // 드래그 영역 이외에서 무한 루프 취소
        offPointerElements.forEach((el) => (el.style.pointerEvents = 'auto'));
        return;
      }

      if (!value) {
        __element.style.pointerEvents = 'none';
        offPointerElements.push(__element);
        get(
          document.elementFromPoint(
            getEventPosition(event).x,
            getEventPosition(event).y
          )
        );
      } else {
        roleValue = value;
        offPointerElements.forEach((el) => (el.style.pointerEvents = 'auto'));
      }
    }

    get(element);

    return roleValue;
  }

  function getZoomRate(target) {
    return parent.GO_PAGE_LOAD
      ? parent.ZOOMVALUE
      : target.getBoundingClientRect().width / target.offsetWidth;
  }

  function dragReset() {
    drItems.forEach((item) => {
      icon.style.display = 'none';
      item.style.top = '';
      item.style.left = '';
      for (item of answerPopUp.children) {
        item.style.display = 'none';
      }
    });
  }

  const getEventPosition = (event) => {
    const eventTarget = isTouchEvent(event)
      ? event.changedTouches[0] || event.touches[0]
      : event;

    return {
      x: eventTarget.clientX,
      y: eventTarget.clientY,
    };
  };

  const isTouchEvent = (event) => {
    return event.type.indexOf('touch') > -1;
  };

  //마우스 다운
  const dragStart = function (event) {
    getEventPosition(event);
    targetItem.dom = this;
    targetItem.ItemX = this.offsetLeft;
    targetItem.ItemY = this.offsetTop;

    itemState.startX = getEventPosition(event).x;
    itemState.startY = getEventPosition(event).y;

    itemState.zoom = getZoomRate(this);

    wrap.addEventListener('mousemove', dragMove);
    wrap.addEventListener('touchmove', dragMove);
    wrap.addEventListener('mouseup', dragEnd);
    wrap.addEventListener('touchend', dragEnd);

    effOk.muted = false;
    effFail.muted = false;

    dragMoveStop();
  };

  //마우스 무브
  const dragMove = function (event) {
    const eventX = getEventPosition(event).x;
    const eventY = getEventPosition(event).y;

    const moveX = (eventX - itemState.startX) / itemState.zoom;
    const moveY = (eventY - itemState.startY) / itemState.zoom;

    targetItem.dom.style.left = `${targetItem.ItemX + moveX}px`;
    targetItem.dom.style.top = `${targetItem.ItemY + moveY}px`;
  };

  //마우스 업
  const dragEnd = function (event) {
    const value = getItemPoint(event);
    const itemList = items.filter((item) => {
      return item.item.getAttribute('data-mark') == value;
    });

    if (value == targetItem.dom.getAttribute('data-mark')) {
      effOk.pause();
      effOk.currentTime = 0;
      effOk.play();

      items.forEach((target) => {
        if (targetItem.dom == target.item) {
          target.state = true;
        }
      });

      const listCount = itemList.filter((item) => {
        return item.state;
      }).length;

      if (listCount == itemList.length) {
        answerPopUp.children[value].style.display = 'block';
      }

      icon.style.display = 'block';
    } else {
      effFail.pause();
      effFail.currentTime = 0;
      effFail.play();
      targetItem.dom.style.left = ``;
      targetItem.dom.style.top = ``;
    }

    wrap.removeEventListener('mousemove', dragMove);
    wrap.removeEventListener('touchmove', dragMove);
    wrap.removeEventListener('mouseup', dragEnd);
    wrap.removeEventListener('touchend', dragEnd);

    dragMoveResume();
  };

  //사파리 드래그 멈춤
  document.addEventListener(
    'touchmove',
    (event) => {
      event.preventDefault();
    },
    { passive: false }
  );

  //타겟
  drItems.forEach(function (drItem) {
    drItem.addEventListener('mousedown', dragStart);
    drItem.addEventListener('touchstart', dragStart);
  });

  //초기화
  icon.addEventListener('click', dragReset);
});
