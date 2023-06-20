(() => {
  function inViewer() {
    return parent.parent.GO_PAGE_LOAD || parent.GO_PAGE_LOAD;
  }
  function stopPropagation(event) {
    event.stopPropagation();
  }

  const isMobile = () => {
    return (
      navigator.userAgent.match(
        /iPad|iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i
      ) != null
    );
  };

  const getEl = (target, convert = true, parentNode = document) => {
    const array = [];
    const nodeList = parentNode.querySelectorAll(target);

    for (let i = 0; i < nodeList.length; i++) array.push(nodeList[i]);

    const convertArray = array.map((node) =>
      node ? new ConvertObject(node) : null
    );
    const resultArray = convert ? convertArray : array;

    return resultArray.length > 1 ? resultArray : resultArray[0];
  };

  const getZoomRate = (DOM) => {
    const zoomRate = DOM.getBoundingClientRect().width / DOM.offsetWidth;
    return inViewer() ? parent.ZOOMVALUE : zoomRate;
  };

  const getEventPosition = (event) => {
    const eventTarget =
      event.type.indexOf('touch') > -1
        ? event.changedTouches[0] || event.touches[0]
        : event;

    return {
      x: eventTarget.clientX,
      y: eventTarget.clientY,
    };
  };

  const getElementFromPoint = (event) => {
    return document.elementFromPoint(
      getEventPosition(event).x,
      getEventPosition(event).y
    );
  };

  const getBoundingData = (DOM) => {
    return {
      x: DOM.getBoundingClientRect().left,
      y: DOM.getBoundingClientRect().top,
      width: DOM.getBoundingClientRect().width,
      height: DOM.getBoundingClientRect().height,
    };
  };

  const createAudio = (name) => {
    const audio = new Audio();
    const sound = {};

    sound.DOM = audio;
    sound.src = `./media/effcet/${name}.mp3`;

    audio.src = sound.src;
    audio.preload = 'metadata';
    audio.load();

    sound.stop = () => {
      audio.pause();
      audio.currentTime = 0;
    };
    sound.play = () => {
      audio.play();
    };
    return sound;
  };

  class ConvertObject {
    constructor(dom) {
      this.DOM = dom;
    }

    get top() {
      return this.DOM.offsetTop;
    }
    get left() {
      return this.DOM.offsetLeft;
    }
    get width() {
      return this.DOM.offsetWidth;
    }
    get height() {
      return this.DOM.offsetHeight;
    }

    get children() {
      const children = Array.prototype.map.call(
        this.DOM.children,
        (child) => child
      );
      return children.map((el) => new ConvertObject(el));
    }

    addClass(className) {
      this.DOM.classList.add(className);
    }

    removeClass(className) {
      this.DOM.classList.remove(className);
    }

    event(eType, callback, listenertype = 'add') {
      const eventTypeArray = eType.split(' ');
      eventTypeArray.forEach((type) => {
        this.DOM[`${listenertype}EventListener`](type, (event) => {
          // 모바일 환경에서 마우스 이벤트가 실행되는 경우 return
          if (isMobile() && event.type.indexOf('touch') < 0) return;
          callback(event);
        });
      });
    }

    style(styles) {
      Object.getOwnPropertyNames(styles).forEach((property) => {
        this.DOM.style[property] = styles[property];
      });
    }

    attr() {
      switch (arguments.length) {
        case 1:
          return this.DOM.getAttribute(arguments[0]);
        case 2:
          this.DOM.setAttribute(arguments[0], arguments[1]);
          break;
      }
    }

    getEl(target) {
      return getEl(target, true, this.DOM);
    }
  }

  function initDrag({ dragObj, container = document, callback }) {
    function event(target, eType, callback, listenertype = 'add') {
      const eventTypeArray = eType.split(' ');
      eventTypeArray.forEach((type) => {
        target[`${listenertype}EventListener`](type, callback);
      });
    }

    const callback_start = callback.start;
    const callback_move = callback.move;
    const callback_end = callback.end;

    let zoomRate, startX, startY, moveX, moveY;

    const DRAG = {};

    const startDrag = (event) => {
      event.stopPropagation();
      zoomRate = getZoomRate(dragObj);
      DRAG.zoomRate = zoomRate;

      startX = getEventPosition(event).x;
      startY = getEventPosition(event).y;

      DRAG.startPointer = { x: startX, y: startY };

      addEventContainer();

      if (callback_start) callback_start(DRAG);
    };

    const moveDrag = (event) => {
      moveX = getEventPosition(event).x;
      moveY = getEventPosition(event).y;

      DRAG.moveX = (moveX - startX) / zoomRate;
      DRAG.moveY = (moveY - startY) / zoomRate;

      if (callback_move) callback_move(DRAG);
      if (!getElementFromPoint(event)) endDrag(event);
    };

    const endDrag = (event) => {
      event.stopPropagation();
      removeEventContainer();
      if (callback_end) callback_end(DRAG, event);
    };

    const addEventContainer = () => {
      event(container, 'mousemove touchmove', moveDrag);
      event(container, 'mouseup touchend', endDrag);
    };

    const removeEventContainer = () => {
      event(container, 'mousemove touchmove', moveDrag, 'remove');
      event(container, 'mouseup touchend', endDrag, 'remove');
    };

    event(dragObj, 'mousedown touchstart', startDrag);
  }

  const watchProperty = (watching, callback) => {
    let index = 0;
    const interval = setInterval(function () {
      index++;
      const end = watching();

      // 실행 후 1초 뒤 interval 종료
      if (index > 10) {
        console.log('end watchProperty!');
        clearInterval(interval);
        end && callback();
      }
    }, 100);
  };

  function setStateBlockEvents(container, isDragging = true) {
    const selectType = isDragging ? 'none' : 'auto';
    const eventType = isDragging ? 'add' : 'remove';

    container.event('touchmove mousemove', stopPropagation, eventType);
    container.style({
      userSelect: selectType,
      msUserSelect: selectType,
      mozUserSelect: selectType,
      webkitUserSelect: selectType,
    });
  }

  const setCallback = (__callback) => {
    const callback = {};
    Object.getOwnPropertyNames(__callback).forEach((property) => {
      callback[property] = __callback[property];
    });
    return callback;
  };

  const getDropTargetInDrops = (__array, __element) => {
    return __array.filter((drop) => {
      if (drop.DOM === __element) return drop;
    });
  };

  const isBlockedObj = (__array, __type = 'add') => {
    __array.forEach((obj) => obj[`${__type}Class`]('off'));
  };

  function setDropObj(__obj) {
    __obj.value = __obj.attr(ATTR_DRAG_OBJ) - 0;
    // __obj.userValue = __obj.DOM.querySelector(CLASS_USER_VALUE);
    __obj.answered = [];

    __obj.isCorrect = () => {
      return __obj.answered.length === __obj.value.length;
    };
    __obj.reset = () => {
      __obj.answered = [];
    };
    __obj.isFull = () => {
      return __obj.value.length === __obj.answered.length;
    };
    __obj.setLength = () => {
      __obj.attr('data-dragObj-length', __obj.answered.length);
    };
  }
  function setDragObj(__obj) {
    __obj.value = __obj.attr(ATTR_DRAG_OBJ) - 0;
    __obj.isDragged = false;

    __obj.resetPosition = () => {
      __obj.style({ top: '', left: '' });
    };
    __obj.reset = () => {
      __obj.isDragged = false;
      __obj.removeClass('complete');
      __obj.removeClass('hide');
      __obj.resetPosition();
    };

    __obj.answered = (__drop) => {
      if (!this.freeDrag) __obj.resetPosition();
      if (!this.copy) __obj.addClass('hide');
      // __obj.isDragged = true;
      __obj.addClass('complete');
      this.insertClone(__obj, __drop.DOM);
      __drop.answered.push(__obj);
      __drop.setLength();
    };

    const thinkAgainElement = document.createElement('div');
    thinkAgainElement.classList.add('thinkagain');
    thinkAgainElement.innerHTML = '<span>다시 생각해 보세요.</span>';
    __obj.DOM.appendChild(thinkAgainElement);

    __obj.showThinkAgain = () => {
      thinkAgainElement.classList.add('show');
      setTimeout(() => {
        thinkAgainElement.classList.remove('show');
      }, 2000);
    }
  }

  class DRAGDROP {
    constructor(__DATA) {
      this.binding();

      this.freeDrag = __DATA.freeDrag;
      this.copy = __DATA.copy;
      this.multi = __DATA.multi;

      this.init(__DATA);
    }

    binding() {
      this.reset = this.reset.bind(this);
      this.setAnswer = this.setAnswer.bind(this);
      this.correctCallback = this.correctCallback.bind(this);
      this.incorrectCallback = this.incorrectCallback.bind(this);
    }

    correctCallback() {
      this.callback.correct && this.callback.correct(this);
    }

    incorrectCallback() {
      this.callback.incorrect && this.callback.incorrect(this);
    }

    setAnswer() {
      // this.checkAnswer(this.isCorrect, this.correctCallback, this.incorrectCallback);
    }

    insertClone(__drag, __drop) {
      const parentNode = this.freeDrag ? __drag.DOM.parentNode : __drop;
      const cloneObj = new ConvertObject(__drag.DOM.cloneNode(true));
      cloneObj.type = 'drag';
      cloneObj.isClone = true;
      cloneObj.original = __drag;
      cloneObj.removeClass('hide');
      if (!this.freeDrag) cloneObj.style({ top: '', left: '' });
      if (this.freeDrag && this.copy) __drag.resetPosition();
      initDrag({
        dragObj: cloneObj.DOM,
        container: this.container.DOM,
        callback: {
          start: this.startDrag.bind(this, cloneObj),
          move: this.moveDrag.bind(this, cloneObj),
          end: this.endDrag.bind(this, cloneObj),
        },
      });
      parentNode.appendChild(cloneObj.DOM);
      this.drags.push(cloneObj);
    }

    insertUserValue(__drop) {
      const answeredValue = __drop.answered.map((obj) => obj.index).join(',');
      // __drop.userValue = answeredValue;
    }

    startDrag(__obj, DRAG, event) {
      setStateBlockEvents(this.container, true);

      __obj.addClass('isDragging');

      __obj.startY = __obj.top;
      __obj.startX = __obj.left;

      if (__obj.isClone) {
        this.drops.forEach((drop) => {
          drop.answered = drop.answered.filter((obj) => obj !== __obj.original);
          this.insertUserValue(drop);
          // this.setStateAnswerButton(this.isAnswered);
          drop.setLength();
        });
      }
    }

    moveDrag(__obj, DRAG, event) {
      __obj.style({
        top: `${__obj.startY + DRAG.moveY}px`,
        left: `${__obj.startX + DRAG.moveX}px`,
      });
    }

    endDrag(__obj, DRAG, event) {
      setStateBlockEvents(this.container, false);
      __obj.removeClass('isDragging');
      isBlockedObj(this.drags);

      const dropElement = getElementFromPoint(event);
      const dropTarget = getDropTargetInDrops(this.drops, dropElement)[0];

      isBlockedObj(this.drags, 'remove');

      // if (dropTarget && __obj.value === dropTarget.value) {
      if (dropTarget && dropTarget.children.length === 1) {
        if (__obj.isClone) {
          if (!this.freeDrag) {
            __obj.style({ top: '', left: '' });
            dropTarget.DOM.appendChild(__obj.DOM);
          }
          dropTarget.answered.push(__obj.original);
          dropTarget.setLength();
        } else {
          __obj.answered(dropTarget);
          // $('.retryagainBtn').css('display', 'block');
          // dropTarget.DOM.firstChild.style.pointerEvents = 'none';
          dropTarget.children.forEach((child) => {
            child.style.pointerEvents = 'none';
          });
          // console.dir(dropTarget.DOM);
        }

        if (__obj.value !== dropTarget.value) {
          dropTarget.DOM.children[1].querySelector('.thinkagain').classList.add('show');
          setTimeout(() => {
            dropTarget.DOM.innerHTML = '<p class="guideT">막대를<br/>놓아<br/>보아요.</p>';
            dropTarget.reset();
            dropTarget.setLength();
            __obj.reset();
          }, 2500);
          return;
        }

        this.insertUserValue(dropTarget);
        isUserDragged = true;
        // this.setStateAnswerButton(true);
      } else {
        if (__obj.isClone) {
          __obj.DOM.parentNode.removeChild(__obj.DOM);
          if (!this.copy) {
            __obj.original.removeClass('hide');
            __obj.original.removeClass('complete');
          }
        } else __obj.reset();
      }
    }

    reset() {
      this.drags = this.drags.filter((obj) => {
        if (!obj.isClone) return obj;
        else if (obj.DOM.parentNode && obj.DOM.parentNode.contains(obj.DOM)) {
          obj.DOM.parentNode.removeChild(obj.DOM);
        }
      });
      this.objectArray.forEach((obj) => {
        obj.reset();
      });
      this.userValue = [];
      isUserDragged = false;
    }

    showAnswer() {
      this.drops.forEach((drop) => {
        drop.DOM.innerHTML = '<p class="guideT">막대를<br/>놓아<br/>보아요.</p>';
      });
      this.drags.forEach((drag) => {
        const currentDrop = this.drops.filter((drop) => drop.value === drag.value)[0];
        if (!drag.isClone && currentDrop) drag.answered(currentDrop);
      });
    }

    init({ container, drags, drops }) {
      let dropIndex = 0,
        dragIndex = 0;
      this.drags = drags.map((obj) => {
        setDragObj.bind(this)(obj);
        obj.isClone = false;
        obj.index = dragIndex;
        dragIndex++;

        initDrag({
          dragObj: obj.DOM,
          container: container.DOM,
          callback: {
            start: this.startDrag.bind(this, obj),
            move: this.moveDrag.bind(this, obj),
            end: this.endDrag.bind(this, obj),
          },
        });

        return obj;
      });

      this.drops = drops.map((obj) => {
        setDropObj.bind(this)(obj);
        obj.index = dropIndex;
        dropIndex++;

        if (obj.value.length > 1) {
          // obj.multiDrag = true;
          obj.userValue = [];
        }

        return obj;
      });

      this.container = container;
      this.objectArray = this.drags.concat(this.drops);

      if (window.thinkPopCallback.dragdrop) {
        this.callback = setCallback(window.thinkPopCallback.dragdrop);
      }

      /*  watchProperty(() => {
        // this.drops.forEach((drop) => drop.userValue.value = '1');
        return this.drops.filter((drop) => drop.userValue.value && drop.userValue.value !== '').length > 0;
      }, () => {
        this.drops.forEach((drop) => {
          const dragIndexArray = drop.userValue.value.split(',');
          dragIndexArray.forEach((index) => {
            this.drags.forEach((drag) => {
              if (drag.index === index - 0) {
                drag.answered(drop);
              }
            });
          });
        });
        // this.setStateAnswerButton(this.isAnswered);
      }); */
    }
  }

  function showDoit() {
    const doitsolve = getEl('.doitsolve');
    doitsolve.addClass('show');
    setTimeout(() => {
      doitsolve.removeClass('show');
    }, 1000);
  }

  window.thinkPopCallback = window.thinkPopCallback || {};

  const ATTR_DRAG_OBJ = 'data-drag-obj';
  const ATTR_OPTION = 'data-option';

  const CLASS_USER_VALUE = '.userValue';

  let isUserDragged = false;

  window.addEventListener('load', () => {
    const DATA = {};
    const container = getEl('[data-dragdrop-container]');
    // const resetButton = getEl('[data-dragdrop-reset]');
    const checkButton = getEl('[data-dragdrop-check]');

    if (container.attr(ATTR_OPTION)) {
      container
        .attr(ATTR_OPTION)
        .replace(/ /g, '')
        .split(',')
        .forEach((option) => {
          DATA[option] = true;
        });
    }

    DATA.container = container;
    DATA.drags = container.getEl('[data-drag-obj][data-drag-type="drag"]');
    DATA.drops = container.getEl('[data-drag-obj][data-drag-type="drop"]');

    const dragdrop = new DRAGDROP(DATA);
    // window.dragdropReset = dragdrop.reset;
    /* $('.retryagainBtn').on('click', function () {
      $('.retryagainBtn').hide();
    }); */

    /* resetButton.event('click touchstart', () => {
      dragdrop.reset();
    }); */
    checkButton.event('click touchstart', () => {
      if (!isUserDragged) {
        showDoit();
        return;
      }

      if (checkButton.isAnswered) {
        dragdrop.reset();
        checkButton.isAnswered = false;
        checkButton.removeClass('retry');
      }
      else {
        dragdrop.showAnswer();
        checkButton.isAnswered = true;
        checkButton.addClass('retry');
      }
    });
  });
})();
