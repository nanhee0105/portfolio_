(() => {
  /* scale */
  const initScale = (element) => {
    function getContainerSize() {
      return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      };
    }

    function getZoomRate({containerSize, target}) {
      const containerWidth = containerSize.width;
      const containerHeight = containerSize.height;
      const horizontalValue = containerWidth / target.width;
      const verticalValue = containerHeight / target.height;

      return target.width * verticalValue > containerWidth ? horizontalValue : verticalValue;
    }

    function getLeftValue({containerSize, target, zoomRate}) {
      return (containerSize.width - (target.width * zoomRate)) / 2;
    }

    function setTransform({zoomRate, leftValue, element}) {
      const style = element.style;

      style.transform = `scale(${zoomRate})`;
      style.MsTransform = `scale(${zoomRate})`;
      style.MozTransform = `scale(${zoomRate})`;
      style.WebkitTransform = `scale(${zoomRate})`;
      
      style.transformOrigin = '0% 0%';
      style.MsTransformOrigin = '0% 0%';
      style.MozTransformOrigin = '0% 0%';
      style.WebkitTransformOrigin = '0% 0%';

      style.left = `${leftValue}px`;
    }

    const target = {
      width: element.clientWidth,
      height: element.clientHeight
    }
    
    const setScale = () => {
      const containerSize = getContainerSize();
      const zoomRate = getZoomRate({containerSize, target});
      const leftValue = getLeftValue({containerSize, target, zoomRate});

      setTransform({zoomRate, leftValue, element});
    }

    setScale();
    window.addEventListener('resize', setScale);
  }
  /* END scale */

  /* utils */
  function inViewer() { return parent.parent.GO_PAGE_LOAD || parent.GO_PAGE_LOAD; }
  function stopPropagation(event) {
    event.stopPropagation();
  };

  const isMobile = () => {
    return navigator.userAgent.match(/iPad|iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
  }

  const getEl = (target, convert = true, parentNode = document) => {
    const array = [];
    const nodeList = parentNode.querySelectorAll(target);

    for (let i = 0; i < nodeList.length; i++) array.push(nodeList[i]);
    
    const convertArray = array.map((node) => node ? new ConvertObject(node) : null);
    const resultArray = convert ? convertArray : array;

    return resultArray.length > 1 ? resultArray : resultArray[0];
  }

  const getZoomRate = (DOM) => {
    const zoomRate = DOM.getBoundingClientRect().width / DOM.offsetWidth;
    return inViewer() ? parent.ZOOMVALUE : zoomRate;
  }

  const getEventPosition = (event) => {
    const eventTarget = event.type.indexOf('touch') > -1 
      ? (event.changedTouches[0] || event.touches[0]) 
      : event;

    return {
      x: eventTarget.clientX, 
      y: eventTarget.clientY
    }
  }

  const getElementFromPoint = (event) => {
    return document.elementFromPoint(getEventPosition(event).x, getEventPosition(event).y);
  }

  const getBoundingData = (DOM) => {
    return {
      x: DOM.getBoundingClientRect().left,
      y: DOM.getBoundingClientRect().top,
      width: DOM.getBoundingClientRect().width,
      height: DOM.getBoundingClientRect().height,
    }
  }

  const addHoverEvent = (DOM = null, className = 'hover') => {
    const replaceClassName = (event) => {
      event.stopPropagation();
      event.preventDefault();

      let type;
      switch(event.type) {
        case 'mouseenter':
        case 'mouseover':
          type = 'add';
          break;
        case 'mouseleave':
        case 'mouseout':
          type = 'remove';
          break;
      }
      DOM.classList[type](className);
    }

    const addEvent = (eType) => {
      const eventTypeArray = eType.split(' ');
      eventTypeArray.forEach((type) => {
        DOM.addEventListener(type, replaceClassName);
      });
    }

    // over
    addEvent('mouseenter mouseover');

    // out
    addEvent('mouseleave mouseout');
  }

  const appendOnOffFunction = (target, className = 'on') => {
    target.on = () => {
      if (target.addClass) target.addClass(className);
      else target.classList.add(className);
    }
    target.off = () => {
      if (target.removeClass) target.removeClass(className);
      else target.classList.remove(className);
    }
  }

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
    }
    sound.play = () => {
      audio.play();
    }
    return sound;
  }

  function getTabButton(__container) {
    function get(__target) { return __target.parentNode; }

    let parent = __container.parentNode;
    while (!parent.classList.contains(CLASS_POPUPWRAP)) {
      console.log('finding popupWrap!');
      parent = get(parent);
    }

    return getEl(`.tabTitle > li`, true, parent);
  }

  class ConvertObject {
    constructor(dom) {
      this.DOM = dom;
    }

    get top() { return this.DOM.offsetTop; }
    get left() { return this.DOM.offsetLeft; }
    get width() { return this.DOM.offsetWidth; }
    get height() { return this.DOM.offsetHeight; }

    get children() {
      const children = Array.prototype.map.call(this.DOM.children, (child) => child);
      return children.map((el) => new ConvertObject(el));
    }
    get parent() {
      return new ConvertObject(this.DOM.parentNode);
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

  function clearInput(__input) {
    __input.value = '';
    __input.checked = false;
    __input.removeAttribute('checked');
    // delete user input data
    if (parent.API_ANNOTATION_INPUT_DELETE) parent.API_ANNOTATION_INPUT_DELETE(__input.id);
  }

  let logIndex = 0;
  function log(text) {
    const el = document.createElement('div');
    document.body.appendChild(el);

    el.style.position = 'absolute';
    el.style.top = `${logIndex * 30}px`;
    el.style.left = '0px';
    el.style.fontSize = '20px';
    el.style.color = 'tomato';

    el.innerHTML = text;
    logIndex++;
  }
  /* END utils */

  /* quiz utils */
  function initDrag({dragObj, container = document, callback}) {
    function event(target, eType, callback, listenertype = 'add') {
      const eventTypeArray = eType.split(' ');
      eventTypeArray.forEach((type) => {
        if (listenertype === 'add') target.addEventListener(type, callback);
        else target.removeEventListener(type, callback);
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
  
      DRAG.startPointer = { x: startX, y: startY }
      
      addEventContainer();
      
      if (callback_start) callback_start(DRAG, event);
    }
  
    const moveDrag = (event) => {
      moveX = getEventPosition(event).x;
      moveY = getEventPosition(event).y;
  
      DRAG.moveX = (moveX - startX) / zoomRate;
      DRAG.moveY = (moveY - startY) / zoomRate;
      
      if (callback_move) callback_move(DRAG, event);
      if (!getElementFromPoint(event)) endDrag(event);
    }
  
    const endDrag = (event) => {
      event.stopPropagation();
      removeEventContainer();
      if (callback_end) callback_end(DRAG, event);
    }
  
    const addEventContainer = () => {
      event(container, 'mousemove touchmove', moveDrag);
      event(container, 'mouseup touchend', endDrag);
      document.addEventListener('touchmove', stopPropagation, {passive: false});
      onOffUserSelector('none');
    }
  
    const removeEventContainer = () => {
      event(container, 'mousemove touchmove', moveDrag, 'remove');
      event(container, 'mouseup touchend', endDrag, 'remove');
      document.removeEventListener('touchmove', stopPropagation, {passive: false});
      onOffUserSelector('');
    }
  
    event(dragObj, 'mousedown touchstart', startDrag);
    
    container.addEventListener('touchmove', (event) => {
      event.stopPropagation();
    });
  }

  const onOffUserSelector = (value) => {
    document.body.style.userSelect = value;
    document.body.style.msUserSelect = value;
    document.body.style.mozUserSelect = value;
    document.body.style.webkitUserSelect = value;
  }

  const sendToDTCaliperSensor = (__quiz) => {
    const {
      result, 
      container, 
      convertedAnswer, 
      convertedUserValue, 
      description, 
      pageNumber } = __quiz;

    // ------------------------------------------------------------------ //
      console.log('correct: ', result);
      console.log('itemObject: ', container.DOM);
      console.log('value: ', convertedAnswer);
      console.log('userValue: ', convertedUserValue);
      console.log('description: ', description);
      console.log('pageNumber: ', pageNumber);
    // ------------------------------------------------------------------ //
    
    DTCaliperSensor.fire({
      correct: result,             // 정답 여부(boolean)
      itemObject: container.DOM,      // 해당 문항 객체
      value: convertedAnswer,         // 실제 정답 데이터 === <correctResponse>
      userValue: convertedUserValue,  // 유저가 실제로 입력한 값
      description: description,       // 문항에 대한 설명
      pageNumber: pageNumber          // 교과서 페이지(number)
    });
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
  }

  function next() {
    const tabContent = this.container.DOM.parentNode.parentNode;
    const menuTabs = tabContent.parentNode;
    const tabButtons = getEl('.tabTitle > li', true, menuTabs);
    const tabPages = getEl('.tabContent > div', true, menuTabs);
    let currentIndex;

    tabButtons.forEach((button, index) => {
      if (button.DOM.classList.contains(TEXT_SELECTED)) currentIndex = button.attr('data-tab') - 0;

      /* button.removeClass(TEXT_SELECTED);
      tabPages[index].removeClass(TEXT_SELECTED);
      tabPages[index].style({display: 'none'}); */
    });
    
    tabButtons[currentIndex-1].removeClass(TEXT_SELECTED);
    tabPages[currentIndex-1].removeClass(TEXT_SELECTED);
    tabPages[currentIndex-1].style({display: 'none'});

    tabButtons[currentIndex].addClass(TEXT_SELECTED);
    tabPages[currentIndex].addClass(TEXT_SELECTED);
    tabPages[currentIndex].style({display: 'block'});

    window.assessmentItem.forEach((quiz) => {
      if (quiz.type === 'drawLine') quiz.drawAnsweredLine();
    })
  }

  const setCallback = (__callback) => {
    const callback = {};
    Object.getOwnPropertyNames(__callback).forEach((property) => {
      callback[property] = __callback[property];
    });
    return callback;
  }
  /* END quiz utils */

  class QUIZ {
    constructor(__quiz) {
      this.quizBinding();

      const {
        answerButton, retryButton, nextButton, hintBox, answerBox, sound, tabButton,
        feedback_first, feedback_second, feedback_incorrect, feedback_correct,
      } = __quiz;

      retryButton && retryButton.event('click touchstart', this.retry);
      // 다음퀴즈 이동 버튼은 퀴즈와 동작이 연관이 없어서 별도의 함수 사용
      nextButton && nextButton.event('click touchstart', next.bind(this));

      this.container = __quiz;

      this.sound = sound;

      this.qid = __quiz.qid;
      this.type = __quiz.type;
      this.pageNumber = __quiz.pageNumber;
      this.description = __quiz.description;
      this.answerArray = __quiz.answerArray;
      
      this.answerButton = answerButton;
      this.retryButton = retryButton;
      this.nextButton = nextButton;
      this.hintBox = hintBox;
      this.answerBox = answerBox;
      this.tabButton = tabButton;
      // console.log(tabButton)

      this.feedback = {
        first: feedback_first,
        second: feedback_second,
        incorrect: feedback_incorrect,
        correct: feedback_correct
      }

      const getObject = this.container.getEl(`[${ATTR_QUIZ_OBJ}]`);
      this.objectArray = getObject.length ? getObject : [getObject];

      this.callback = {};
      this.userValue = [];
      this.tryCount = 0;
      this.isIncorrect = false;
    }

    get convertedUserValue() {
      const newValue = this.userValue.filter((value) => value !== '');
      return newValue.length > 1 
      ? newValue.join(', ') 
      : newValue.join('');
    }

    get convertedAnswer() {
      return this.answerArray.length > 1 
      ? this.answerArray.join(', ') 
      : this.answerArray.join('');
    }

    quizBinding() {
      this.retry = this.retry.bind(this);
    }

    setStateAnswerButton(__isSolved) {
      // 다시하기 버튼을 누르기 전에는 정답 버튼 안보이도록 수정
      if (this.isIncorrect) return;

      if (__isSolved) this.answerButton.on();
      else this.answerButton.off();
    }

    setStateTabButton(__result = '') {
      this.tabButton.attr('data-result', __result);
    }

    correct(callback) {
      this.soundPlay('correct');
      
      // 상단 탭 버튼에 ox icon 추가
      this.setStateTabButton('correct');

      this.feedback.correct.on();
      sendToDTCaliperSensor(this);
      this.onOffContainer(true);
      this.finish();

      callback();

      setTimeout(() => {
        this.feedback.correct.off();
      }, 2000);
    }

    incorrect(callback) {
      this.tryCount++;
      this.isIncorrect = true;

      let feedbackIncorrect;
      
      switch (this.tryCount) {
        case 1:
          feedbackIncorrect = this.feedback.first; 
          break;
        case 2:
          feedbackIncorrect = this.feedback.second; 
          this.hintBox.on();
          break;
        case 3:
          feedbackIncorrect = this.feedback.incorrect;

          // 상단 탭 버튼에 ox icon 추가
          this.setStateTabButton('incorrect');
          this.finish();
          break;
      }
      
      this.soundPlay('wrong');
      feedbackIncorrect.on();
      this.onOffContainer(true);
      this.answerButton.off();
      this.retryButton.on();
      callback();

      sendToDTCaliperSensor(this);
      
      setTimeout(() => {
        feedbackIncorrect.off();
      }, 2000);
    }

    checkAnswer(__result, correctCalllback, incorrectCallback) {
      this.result = __result;

      if (__result) this.correct(correctCalllback);
      else this.incorrect(incorrectCallback);
    }

    onOffContainer(value) {
      if (value) this.container.addClass(TEXT_LOCK);
      else this.container.removeClass(TEXT_LOCK);
    }

    finish() {
      this.tryCount = 0;
      this.onOffContainer(true);
      this.answerButton.off();
      this.retryButton.on();
      this.hintBox.off();
      this.answerBox.on();
      this.nextButton && this.nextButton.on();

      this.callback.finish && this.callback.finish(this);
    }

    resetTryNumber() {
      this.tryCount = 0;
      this.setStateTabButton('');
    }

    retry() {
      if (this.tryCount === 0) this.setStateTabButton('');
      this.isIncorrect = false;
      this.onOffContainer(false);
      this.userValue = [];
      this.answerButton.off();
      this.retryButton.off();
      this.hintBox.off();
      this.answerBox.off();
      this.nextButton && this.nextButton.off();

      this.setStateAnswerButton(false);

      this.callback.retry && this.callback.retry(this);
    }

    soundStop() {
      Object.getOwnPropertyNames(this.sound).forEach((property) => {
        this.sound[property].stop();
      });
    }

    soundPlay(name) {
      this.soundStop();
      this.sound[name].play();
    }
  }

  class SINGLECHOICE extends QUIZ {
    constructor(__quiz) {
      super(__quiz);
      this.binding();
      this.init();
    }

    binding() {
      this.reset = this.reset.bind(this);
      this.setAnswer = this.setAnswer.bind(this);
      this.correctCallback = this.correctCallback.bind(this);
      this.incorrectCallback = this.incorrectCallback.bind(this);
    }

    get isSolved() {
      return this.objectArray.filter((obj) => obj.solved).length > 0;
    }

    get isCorrect() {
      return this.objectArray.filter((obj) => {
        if (obj.solved) {
          this.userValue[0] = obj.value;
          if (obj.value === this.answerArray[0]) return obj;
        }
      }).length === this.answerArray.length;
    }

    selectObject(__obj) {
      this.reset();

      __obj.solved = true;
      __obj.userValue.checked = true;

      this.setStateAnswerButton(this.isSolved);
      this.callback.object && this.callback.object(this, __obj);
    }

    reset() {
      this.userValue = [];
      this.objectArray.forEach((obj) => {
        obj.solved = false;
        obj.userValue.checked = false;
        clearInput(obj.userValue);
      });
    }

    correctCallback() {
      this.callback.correct && this.callback.correct(this);
    }

    incorrectCallback() {
      this.callback.incorrect && this.callback.incorrect(this);
    }

    setAnswer() {
      this.checkAnswer(this.isCorrect, this.correctCallback, this.incorrectCallback);
    }

    init() {
      this.objectArray.forEach((obj, index) => {
        obj.value = obj.attr(ATTR_VALUE);
        obj.userValue = this.container.DOM.querySelector(`#${obj.attr('for')}`);
        // obj.event('click touchstart', this.selectObject.bind(this, obj));
        $(obj.DOM).on(clickEvent, this.selectObject.bind(this, obj));
      });

      this.answerButton.event('click touchstart', this.setAnswer);
      this.retryButton.event('click touchstart', this.reset);

      if (window.arrangeQuestionCallback.singleChoice) {
        this.callback = setCallback(window.arrangeQuestionCallback.singleChoice);
      }

      watchProperty(() => {
        const checkedValue = this.objectArray.filter((obj) => obj.userValue.checked);
        return checkedValue && checkedValue.length > 0;
      }, () => {
        this.objectArray.forEach((obj) => {
          if (obj.userValue.checked) this.selectObject(obj);
        });
      });
    }
  }

  class MULTICHOICE extends QUIZ {
    constructor(__quiz) {
      super(__quiz);
      this.binding();
      this.init();
    }

    binding() {
      this.reset = this.reset.bind(this);
      this.setAnswer = this.setAnswer.bind(this);
      this.correctCallback = this.correctCallback.bind(this);
      this.incorrectCallback = this.incorrectCallback.bind(this);
    }

    get isSolved() {
      return this.objectArray.filter((obj) => obj.solved).length > 0;
    }

    get isCorrect() {
      this.objectArray.filter((obj) => {
        if (obj.solved) this.userValue.push(obj.value);
      });
      return isSameArray(this.userValue, this.answerArray)
    }

    selectObject(__obj) {
      // this.reset();
      if (__obj.solved) {
        __obj.solved = false;
        __obj.userValue.checked = false;
      } else {
        __obj.solved = true;
        __obj.userValue.checked = true;
      }

      this.setStateAnswerButton(this.isSolved);
      this.callback.object && this.callback.object(this, __obj);
    }

    reset() {
      this.userValue = [];
      this.objectArray.forEach((obj) => {
        obj.solved = false;
        obj.userValue.checked = false;
        clearInput(obj.userValue);
      });
    }

    correctCallback() {
      this.callback.correct && this.callback.correct(this);
    }

    incorrectCallback() {
      this.callback.incorrect && this.callback.incorrect(this);
    }

    setAnswer() {
      this.checkAnswer(this.isCorrect, this.correctCallback, this.incorrectCallback);
    }

    init() {
      this.objectArray.forEach((obj, index) => {
        obj.value = obj.attr(ATTR_VALUE);
        obj.userValue = this.container.DOM.querySelector(`#${obj.attr('for')}`);
        obj.parent.event('click touchstart', this.selectObject.bind(this, obj));
      });

      this.answerButton.event('click touchstart', this.setAnswer);
      this.retryButton.event('click touchstart', this.reset);

      if (window.arrangeQuestionCallback.multiChoice) {
        this.callback = setCallback(window.arrangeQuestionCallback.multiChoice);
      }

      watchProperty(() => {
        const checkedValue = this.objectArray.filter((obj) => obj.userValue.checked);
        return checkedValue && checkedValue.length > 0;
      }, () => {
        this.objectArray.forEach((obj) => {
          if (obj.userValue.checked) this.selectObject(obj);
        });
      });
    }
  }

  class TRUEFALSE extends QUIZ {
    constructor(__quiz) {
      super(__quiz);
      this.binding();
      
      this.groupArray = [];

      this.init();
    }

    binding() {
      this.reset = this.reset.bind(this);
      this.setAnswer = this.setAnswer.bind(this);
      this.correctCallback = this.correctCallback.bind(this);
      this.incorrectCallback = this.incorrectCallback.bind(this);
    }

    set currentGroup(index) { this._currentGroup = this.groupArray[index]; }
    get currentGroup() { return this._currentGroup; }

    get isSolved() {
      return this.objectArray.filter((obj) => obj.solved).length > 0;
    }

    get isCorrect() {
      return this.objectArray.filter((obj) => {
        if (obj.solved) {
          this.userValue[obj.index] = obj.value;
          if (obj.value === this.answerArray[obj.index]) return obj;
        }
      }).length === this.answerArray.length;
    }

    groupReset() {
      this.currentGroup.forEach((obj) => {
        obj.off();
        obj.solved = false;
        obj.userValue.checked = false;
        obj.removeClass(TEXT_SELECTED);
        clearInput(obj.userValue);
      });
    }

    selectObject(__obj) {
      this.currentGroup = __obj.index;
      this.groupReset();

      __obj.on();
      __obj.solved = true;
      __obj.userValue.checked = true;

      this.setStateAnswerButton(this.isSolved);
      this.callback.object && this.callback.object(this, __obj);
    }

    reset() {
      this.groupArray.forEach((group, index) => {
        this.currentGroup = index;
        this.groupReset();
      });
    }

    correctCallback() {
      this.callback.correct && this.callback.correct(this);
    }

    incorrectCallback() {
      this.callback.incorrect && this.callback.incorrect(this);
    }

    setAnswer() {
      this.checkAnswer(this.isCorrect, this.correctCallback, this.incorrectCallback);
    }

    init() {
      this.objectArray.forEach((obj, index) => {
        obj.index = obj.attr(ATTR_QUIZ_OBJ) - 1;
        obj.value = obj.attr(ATTR_VALUE);
        obj.userValue = obj.DOM.querySelector(CLASS_USER_VALUE);

        appendOnOffFunction(obj, TEXT_SELECTED);
        // obj.event('click touchstart', this.selectObject.bind(this, obj));
        $(obj.DOM).on(clickEvent, this.selectObject.bind(this, obj));

        if (this.groupArray[obj.index] === undefined) {
          this.groupArray[obj.index] = [];
        }
        this.groupArray[obj.index].push(obj);
      });

      this.answerButton.event('click touchstart', this.setAnswer);
      this.retryButton.event('click touchstart', this.reset);

      if (window.arrangeQuestionCallback.trueFalse) {
        this.callback = setCallback(window.arrangeQuestionCallback.trueFalse);
      }

      watchProperty(() => {
        return this.objectArray.filter((obj) => obj.userValue.checked).length > 0;
      }, () => {
        this.objectArray.forEach((obj) => {
          if (obj.userValue.checked) this.selectObject(obj);
        });
      });
    }
  }

  class INPUT extends QUIZ {
    constructor(__quiz) {
      super(__quiz);
      this.binding();
      this.init();
    }

    get isSolved() {
      return this.objectArray.filter((obj) => obj.solved).length === this.objectArray.length;
    }

    get isCorrect() {
      const getResult = () => {
        return this.objectArray.filter((obj, index) => {console.log(obj.answer)
          const answerValue = typeof obj.answer === 'string' 
            ? [obj.answer.replace(/ |\.|\,/g, '')]
            : obj.answer.map((answer) => answer.replace(/ |\.|\,/g, ''));

          const userAnswerValue = obj.DOM.value.replace(/ |\.|\,/g, '');
          if (answerValue.includes(userAnswerValue)) {
            obj.checked = true;
            return obj;
          }
        }).length === this.objectArray.length;
      }
      let resultCorrect;

      this.objectArray.filter((obj, index) => {
        this.userValue[index] = obj.DOM.value;
      });

      if (this.callback.isCorrect) {
        const callbackResult = this.callback.isCorrect(this);
        if (this.qid === callbackResult.qid) resultCorrect = callbackResult.result; 
        else resultCorrect = getResult();
      }
      else resultCorrect = getResult();

      return resultCorrect;
    }

    binding() {
      this.reset = this.reset.bind(this);
      this.setAnswer = this.setAnswer.bind(this);
      this.correctCallback = this.correctCallback.bind(this);
      this.incorrectCallback = this.incorrectCallback.bind(this);
    }

    insertInputValue(__obj) {
      if (__obj.DOM.value !== '') __obj.solved = true;
      else __obj.solved = false;

      this.setStateAnswerButton(this.isSolved);
      this.callback.object && this.callback.object(this, __obj);
    }

    correctCallback() {
      this.callback.correct && this.callback.correct(this);
    }

    incorrectCallback() {
      this.callback.incorrect && this.callback.incorrect(this);
    }

    setAnswer() {
      this.checkAnswer(this.isCorrect, this.correctCallback, this.incorrectCallback);
    }

    reset() {
      this.objectArray.forEach((obj) => { obj.clear(); });
    }

    init() {
      this.objectArray.forEach((obj, index) => {
        const answer = obj.attr('data-answer') 
          ? obj.attr('data-answer').replace(/ /g, '').split('|')
          : this.answerArray[index];

        obj.answer = answer;
        obj.attr('autocomplete', `off`);
        obj.clear = () => { clearInput(obj.DOM) };
        obj.insertAnswer = () => { obj.DOM.value = answer; };
        // obj.event('keypress', this.insertInputValue.bind(this, obj));
        obj.DOM.addEventListener('input', this.insertInputValue.bind(this, obj));
      });

      this.answerButton.event('click touchstart', this.setAnswer);
      this.retryButton.event('click touchstart', this.reset);

      if (window.arrangeQuestionCallback.input) {
        this.callback = setCallback(window.arrangeQuestionCallback.input);
      }

      watchProperty(() => {}, () => {});
    }
  }

  function setStateBlockEvents(container, isDragging = true) {
    const selectType = isDragging ? 'none' : 'auto';
    const eventType = isDragging ? 'add' : 'remove';

    // container.event('touchmove mousemove', stopPropagation, eventType);
    // container.DOM[`${eventType}EventListener`]('touchmove', stopPropagation, {passive: false});
    // container.DOM[`${eventType}EventListener`]('mousemove', stopPropagation, {passive: false});
    container.style({
      'userSelect': selectType,
      'msUserSelect': selectType,
      'mozUserSelect': selectType,
      'webkitUserSelect': selectType,
    });
  }

  function createPath(isAnswer, {svgContainer, stroke, answerStroke, strokeWidth}) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    svgContainer.DOM.appendChild(line);
    return line;
  }

  function getIsAnswered(answeredArray, currentArray) {
    return answeredArray.filter((array) => {
      if (isSameArray(array, currentArray)) return array;
    }).length > 0;
  }

  function isSameArray(array1, array2) {
    return array1.length === array2.length 
      && array1.filter(value1 => {
        return array2.filter(value2 => value1 === value2).length > 0
      }).length === array1.length;
  }

  function getAnswerGroup(array1, array2) {
    const resultArray = [];
    array1.forEach((value1) => {
      array2.forEach((value2) => {
        if (value1 === value2) {
          resultArray.push(value1);
          resultArray.push(value2);
        }
      });
    });
    return resultArray;
  } 

  function drawLine(__line, __start, __end) {
    __line.setAttribute('x1', __start.x);
    __line.setAttribute('y1', __start.y);
    __line.setAttribute('x2', __end.x);
    __line.setAttribute('y2', __end.y);
  }

  class DRAWLINE extends QUIZ {
    constructor(__quiz) {
      super(__quiz);
      this.binding();
      
      this.svgContainer = getEl('svg', this.container.DOM);
      this.userValueInput = this.container.DOM.querySelector('.dragSavePoint');

      this.multi = __quiz.multi;
      this.singleLine = __quiz.singleLine;
      
      this.droppedObj = null;
      this.answeredGroup = [];
      this.newLine = {};

      this.init();
    }

    binding() {
      this.setAnswer = this.setAnswer.bind(this);
      this.correctCallback = this.correctCallback.bind(this);
      this.incorrectCallback = this.incorrectCallback.bind(this);
      this.removeDrawedLine = this.removeDrawedLine.bind(this);
      this.drawAnsweredLine = this.drawAnsweredLine.bind(this);
      this.drawAnswer = this.drawAnswer.bind(this);
      this.reset = this.reset.bind(this);
    }

    get dragedLineLength() { return this.svgContainer.children.length; }

    get isCorrect() {
      const userValue = this.drops.map((drop) => !drop.DOM.hasAttribute('data-no-answer') && drop.droppedObj.map((obj) => obj.index+1)).filter((value) => value);
      userValue.forEach((value) => value.sort());
      this.answerArray.forEach((value) => value.sort());
      /* return this.answerArray.filter((answer, index) => {
        return this.userValue[index] && isSameArray(answer, this.userValue[index]);
      }).length === this.answerArray.length; */
      return userValue.join(', ') === this.answerArray.join(', ');
    }

    set droppedObj(__obj) {
      this._droppedObj = this.objectArray.filter((el) => el.DOM === __obj)[0];
    }
    get droppedObj() { return this._droppedObj; }

    get drags() { return this.objectArray.filter((obj) => obj.type === 'drag')}
    get drops() { return this.objectArray.filter((obj) => obj.type === 'drop')}

    startDrag(__obj, DRAG) {
      //  기존에 그어진 선이 있으면 삭제 후 동작
      // if (!this.multi && __obj.drawedLine) this.removeDrawedLine(__obj);

      if (__obj.drawedLine) {
        if (!this.multi || (this.multi && this.singleLine)) this.removeDrawedLine(__obj);
      }

      this.newLine.DOM = createPath(false, this);
      this.newLine.start = {
        x: __obj.left + (__obj.width / 2),
        y: __obj.top + (__obj.height / 2)
      };

      drawLine(this.newLine.DOM, this.newLine.start, this.newLine.start);
      setStateBlockEvents(this.container, true);
    }

    moveDrag(__obj, DRAG) {
      const movePosition = {
        x: DRAG.moveX + this.newLine.start.x,
        y: DRAG.moveY + this.newLine.start.y
      }
      
      this.newLine.DOM.setAttribute('x2', movePosition.x);
      this.newLine.DOM.setAttribute('y2', movePosition.y);
    }

    endDrag(__obj, DRAG, event) {
      setStateBlockEvents(this.container, false);

      // get dropped object in this.dragObjs
      this.droppedObj = getElementFromPoint(event);

      // get array [drag, drop]
      const answerGroup = this.droppedObj && getAnswerGroup(__obj.value, this.droppedObj.value);
      /* 21.09.30 spvog 복수 정답 비교 추가 */
      const getAnsweredGroup = this.answeredGroup.filter((group) => {
          return group[0] === __obj && group[1] === this.droppedObj;
        });
      
      // 정오답 비교 없이 진행
      const isCorrect = this.droppedObj // drop 존재 유무
        &&  __obj.type !== this.droppedObj.type; // drag & drop 타입 비교
        // && answerGroup.length > 0; // drag & drop 정답 비교
        
      /* 21.09.30 spvog 복수 정답 비교 추가 */
      if (isCorrect && getAnsweredGroup.length === 0) this.correctLine(__obj, this.droppedObj);
      else this.incorrectLine(__obj);

      this.callback.object && this.callback.object(this, isCorrect, [__obj, this.droppedObj]);
    }

    removeDrawedLine(__obj) {
      let removeIndex;

      this.answeredGroup.forEach((group, index) => {
        if (group.filter((obj) => obj === __obj).length > 0) {
          removeIndex = index;
          /* 21.10.07 spvog 다시 그리기 할 때 사용자 답 지우기 */
          if (!this.multi) this.userValue[group[1].index] = '';
          else if (this.multi && this.singleLine) {
            this.userValue[group[1].index] = this.userValue[group[1].index].filter((value) => value);
          }

          group[1].droppedObj = group[1].droppedObj.filter((droppedObj) => droppedObj.index !== group[0].index);
        }
      });
      
      this.answeredGroup.splice(removeIndex, 1);
      this.svgContainer.DOM.removeChild(__obj.drawedLine.DOM);
      __obj.drawedLine = null;
    }

    removeNewLine() {
      this.svgContainer.DOM.removeChild(this.newLine.DOM);
      this.newLine = {};
    }

    insertUserValue(__drag, __drop) {
      const answerValue = __drag.value.filter((value) => __drop.value.includes(value))[0];
      /* 21.09.30 spvog 복수 정답 비교 추가 */
      if (this.multi) {
        this.userValue[__drop.index] = this.userValue[__drop.index] || [];
        if (!this.userValue[__drop.index].includes(answerValue)) this.userValue[__drop.index].push(answerValue);
      }
      else this.userValue[__drop.index] = [answerValue];
      
      this.userValueInput.value = this.answeredGroup.map((group) => `${group[0].index}|${group[1].index}`).join(',');
    }

    drawAnsweredLine() {
      this.svgContainer.DOM.innerHTML = '';

      this.answeredGroup.forEach(([dragObj, dropObj]) => {
        const newLine = {};
        newLine.DOM = createPath(true, this);

        drawLine(newLine.DOM, {
          x: dragObj.left + (dragObj.width / 2),
          y: dragObj.top + (dragObj.height / 2)
        }, {
          x: dropObj.left + (dropObj.width / 2),
          y: dropObj.top + (dropObj.height / 2)
        });

        dragObj.drawedLine = newLine;
        if (!dropObj.droppedObj.includes(dragObj)) dropObj.droppedObj.push(dragObj);
        
        this.insertUserValue(dragObj, dropObj);
      });
    }

    drawAnswer() {
      this.drags.forEach((dragObj) => {
        this.drops.forEach((dropObj) => {
          if (getAnswerGroup(dragObj.value, dropObj.value).length > 0) {
            drawLine(createPath(true, this), {
              x: dragObj.left + (dragObj.width / 2),
              y: dragObj.top + (dragObj.height / 2)
            }, {
              x: dropObj.left + (dropObj.width / 2),
              y: dropObj.top + (dropObj.height / 2)
            });
          }
        });
      });
    }

    get isAllDraged() { 
      return this.drags.filter((drag) => drag.drawedLine).length === this.drags.length;
    }

    correctLine(__drag, __drop) {
      const dragObj = __drag.type === 'drag' ? __drag : __drop;
      const dropObj = __drag.type === 'drag' ? __drop : __drag;

      this.answeredGroup.push([dragObj, dropObj]);
      this.insertUserValue(dragObj, dropObj);
      dragObj.drawedLine = this.newLine;
      dropObj.droppedObj.push(dragObj);

      this.newLine.DOM.setAttribute('x2', dropObj.left + (dropObj.width / 2));
      this.newLine.DOM.setAttribute('y2', dropObj.top + (dropObj.height / 2));
      
      this.newLine = {};

      // 21.08.11 선잇기 선이 전체가 그어져야 확인하기 버튼 보이도록 수정
      if (this.isAllDraged) this.setStateAnswerButton(true);
    }

    incorrectLine() {
      this.removeNewLine();
    }

    correctCallback() {
      this.callback.correct && this.callback.correct(this);
    }

    incorrectCallback() {
      this.callback.incorrect && this.callback.incorrect(this);
    }

    setAnswer() {
      // this.userValueInput.value = this.userValue.join(',');
      this.checkAnswer(this.isCorrect, this.correctCallback, this.incorrectCallback);
    }

    reset() {
      this.droppedObj = null;
      this.answeredGroup = [];
      this.newLine = {};
      this.userValueInput.value = '';
      clearInput(this.userValueInput);
      this.svgContainer.DOM.innerHTML = '';
      this.objectArray.forEach((obj) => {
        if (obj.drawedLine) obj.drawedLine = null;
        if (obj.droppedObj) obj.droppedObj = [];
      });
    }

    init() {
      let dropIndex = 0, dragIndex = 0;
      this.objectArray.forEach((obj) => {
        obj.type = obj.attr(ATTR_DRAG_TYPE);
        obj.index = obj.type === 'drop' ? dropIndex : dragIndex;
        obj.value = obj.attr(ATTR_QUIZ_OBJ).replace(/ /g, '').split(',');
        
        if (obj.type === 'drop') {
          dropIndex++;
          obj.droppedObj = [];
        }
        else dragIndex++;

        let isNotDragType = 'drop';
        // if (draggableDropElement) isNotDragType = '';

        if (obj.type !== isNotDragType) initDrag({
          dragObj: obj.DOM,
          container: this.container.DOM,
          callback: {
            start: this.startDrag.bind(this, obj),
            move: this.moveDrag.bind(this, obj),
            end: this.endDrag.bind(this, obj),
          }
        });
      });

      /* 21.10.07 spvog 정답 없는 요소 추가 */
      this.answerArray = this.objectArray
        .filter((obj) => obj.attr(ATTR_DRAG_TYPE) === 'drop' && !obj.DOM.hasAttribute('data-no-answer'))
        .map((obj) => obj.value);
        
      this.answerButton.event('click touchstart', this.setAnswer);
      this.retryButton.event('click touchstart', this.reset);

      if (window.arrangeQuestionCallback.drawLine) {
        this.callback = setCallback(window.arrangeQuestionCallback.drawLine);
      }

      watchProperty(() => {
        // this.userValueInput.value = `0|2,1|1,2|0`;
        return this.userValueInput.value !== '';
      }, () => {
        const getObj = (value, array) => {
          return array.filter((obj) => obj.index === (value-0))[0];
        }
        const setGroup = this.userValueInput.value.split(',')
          .filter((value) => value !== '')
          .map((value) => {
          const newValue = value.split('|');
          return [getObj(newValue[0], this.drags), getObj(newValue[1], this.drops)]
        });
        
        this.answeredGroup = setGroup;
        this.drawAnsweredLine();
        this.setStateAnswerButton(true);
      });
    }
  }

  const getDropTargetInDrops = (__array, __element) => {
    return __array.filter((drop) => {
      if (drop.DOM === __element || drop.DOM.contains(__element)) return drop;
    });
  } 

  const isBlockedObj = (__array, __type = 'add') => {
    __array.forEach((obj) => obj[`${__type}Class`]('off'));
  }

  function setDropObj(__obj) {
    __obj.value = __obj.attr(ATTR_QUIZ_OBJ).replace(/ /g, '').split(',');
    __obj.userValue = __obj.DOM.querySelector(CLASS_USER_VALUE);
    __obj.answered = [];
    __obj.className = __obj.DOM.className;

    __obj.isCorrect = () => { return __obj.answered.length === __obj.value.length; }
    __obj.reset = () => {
      __obj.answered = [];
      __obj.userValue.value = '';
      clearInput(__obj.userValue);

      __obj.DOM.removeAttribute('data-dragObj-length');
      __obj.DOM.className = __obj.className;
    }
    __obj.isFull = () => {
      return __obj.value.length === __obj.answered.length;
    }
    __obj.setLength = () => {
      __obj.attr('data-dragObj-length', __obj.answered.length);
      __obj.DOM.className = __obj.className;
      __obj.addClass(`dragLength_${__obj.answered.length}`);
    }
  }
  function setDragObj(__obj) {
    __obj.value = __obj.attr(ATTR_QUIZ_OBJ);
    __obj.isDragged = false;

    __obj.resetPosition = () => {
      __obj.style({top: '', left: ''});
    }
    __obj.reset = () => {
      __obj.isDragged = false;
      __obj.removeClass('complete');
      __obj.removeClass('hide');
      __obj.resetPosition();
    }

    __obj.answered = (__drop) => {
      if (!this.freeDrag) __obj.resetPosition();
      if (!this.copy) __obj.addClass('hide');
      // __obj.isDragged = true;
      __obj.addClass('complete');
      this.insertClone(__obj, __drop.DOM);
      __drop.answered.push(__obj);
      __drop.setLength();
    }
  }

  class DRAGDROP extends QUIZ {
    constructor(__quiz) {
      super(__quiz);
      this.binding();

      this.freeDrag = __quiz.freeDrag;
      this.copy = __quiz.copy;
      this.multi = __quiz.multi;

      this.init();
    }

    binding() {
      this.reset = this.reset.bind(this);
      this.setAnswer = this.setAnswer.bind(this);
      this.correctCallback = this.correctCallback.bind(this);
      this.incorrectCallback = this.incorrectCallback.bind(this);
    }

    get drops() { return this.objectArray.filter((obj) => obj.type === 'drop'); }
    get drags() { return this.objectArray.filter((obj) => obj.type === 'drag'); }

    get isAnswered() {
      return this.drops.filter((obj) => obj.answered.length > 0).length > 0;
    }
    get isCorrect() {
      if (this.callback.isCorrect) {
        return this.callback.isCorrect(this);
      }
      else {
        return this.drops.filter((drop) => {
          if (isSameArray(drop.value, drop.answered.map((obj) => obj.value))) return drop;
        }).length === this.drops.length;
      }
    }

    correctCallback() {
      this.callback.correct && this.callback.correct(this);
    }

    incorrectCallback() {
      this.callback.incorrect && this.callback.incorrect(this);
    }

    setAnswer() {
      this.checkAnswer(this.isCorrect, this.correctCallback, this.incorrectCallback);
    }

    insertClone(__drag, __drop) {
      const parentNode = this.freeDrag ? __drag.DOM.parentNode : __drop;
      const cloneObj = new ConvertObject(__drag.DOM.cloneNode(true));
      cloneObj.type = 'drag';
      cloneObj.isClone = true;
      cloneObj.original = __drag;
      cloneObj.removeClass('hide');
      if (!this.freeDrag) cloneObj.style({top: '', left: ''});
      if (this.freeDrag && this.copy) __drag.resetPosition();
      initDrag({
        dragObj: cloneObj.DOM,
        container: this.container.DOM,
        callback: {
          start: this.startDrag.bind(this, cloneObj),
          move: this.moveDrag.bind(this, cloneObj),
          end: this.endDrag.bind(this, cloneObj),
        }
      });
      parentNode.appendChild(cloneObj.DOM);
      this.objectArray.push(cloneObj);
    }

    insertUserValue(__drop) {
      const answeredValue =__drop.answered.map((obj) => obj.index).join(',');
      __drop.userValue.value = answeredValue;
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
          this.setStateAnswerButton(this.isAnswered);
          drop.setLength();
        });
      }
    }

    moveDrag(__obj, DRAG, event) {
      __obj.style({
        top: `${__obj.startY + DRAG.moveY}px`,
        left: `${__obj.startX + DRAG.moveX}px`
      });
    }

    endDrag(__obj, DRAG, event) {
      setStateBlockEvents(this.container, false);
      __obj.removeClass('isDragging');
      isBlockedObj(this.drags);
            
      const dropElement = getElementFromPoint(event);
      const dropTarget = getDropTargetInDrops(this.drops, dropElement)[0];
      
      isBlockedObj(this.drags, 'remove');

      if (!dropTarget || (!this.multi && dropTarget.isFull())) {
        if (__obj.isClone) {
          __obj.DOM.parentNode.removeChild(__obj.DOM);
          if (!this.copy) {
            __obj.original.removeClass('hide');
            __obj.original.removeClass('complete');
          }
        }
        else __obj.reset();
      }
      else {
        if (__obj.isClone) {
          if (!this.freeDrag) {
            __obj.style({top: '', left: ''});
            dropTarget.DOM.appendChild(__obj.DOM);
          }
          dropTarget.answered.push(__obj.original);
          dropTarget.setLength();
        } else {
          __obj.answered(dropTarget);
        }

        this.insertUserValue(dropTarget);
        this.setStateAnswerButton(true);
      }
    }

    reset() {
      this.objectArray = this.objectArray.filter((obj) => {
        if (!obj.isClone) return obj;
        else if (obj.DOM.parentNode && obj.DOM.parentNode.contains(obj.DOM)) {
          obj.DOM.parentNode.removeChild(obj.DOM);
        }
      });
      this.objectArray.forEach((obj) => { obj.reset(); });
      this.userValue = [];
    }

    init() {
      let dropIndex = 0, dragIndex = 0;
      this.objectArray.forEach((obj, index) => {
        obj.type = obj.attr(ATTR_DRAG_TYPE);
        if (obj.type === 'drop') {
          setDropObj.bind(this)(obj);
          obj.index = dropIndex;
          dropIndex++;

          // obj.userValue.value = [[1,3], 2, 4][index];
        }
        else {
          setDragObj.bind(this)(obj);
          obj.isClone = false;
          obj.index = dragIndex;
          dragIndex++;

          initDrag({
            dragObj: obj.DOM,
            container: this.container.DOM,
            callback: {
              start: this.startDrag.bind(this, obj),
              move: this.moveDrag.bind(this, obj),
              end: this.endDrag.bind(this, obj),
            }
          });
        }
      });
      
      this.dragAnswerArray = this.objectArray
        .filter((obj) => obj.attr(ATTR_DRAG_TYPE) === 'drop')
        .map((obj) => obj.value);
      
      this.answerButton.event('click touchstart', this.setAnswer);
      this.retryButton.event('click touchstart', this.reset);

      if (window.arrangeQuestionCallback.dragdrop) {
        this.callback = setCallback(window.arrangeQuestionCallback.dragdrop);
      }

      watchProperty(() => {
        // this.drops.forEach((drop) => drop.userValue.value = '0,1');
        return this.drops.filter((drop) => {
          return drop.userValue.value && drop.userValue.value !== '';
        }).length > 0
      }, () => {
        this.drops.forEach((drop) => {
          const dragIndexArray = drop.userValue.value.split(',');
          dragIndexArray.forEach((index) => {
            this.drags.forEach((drag) => {
              if (index !== '' && drag.index === index - 0) {
                drag.answered(drop);
              }
            });
          });
        });
        this.setStateAnswerButton(this.isAnswered);
      });
    }
  }

  class ESSAY extends QUIZ {
    constructor(__quiz) {
      super(__quiz);
      this.binding();
      this.init();
    }

    binding() {
      this.reset = this.reset.bind(this);
      this.setAnswer = this.setAnswer.bind(this);
      this.correctCallback = this.correctCallback.bind(this);
      this.incorrectCallback = this.incorrectCallback.bind(this);
    }

    get isSolved() {
      return this.objectArray.filter((obj) => obj.solved).length > 0;
    }

    get isCorrect() {
      return true;
    }

    insertInputValue(__obj) {
      if (__obj.DOM.value.length > 0) __obj.solved = true;
      else __obj.solved = false;

      this.setStateAnswerButton(this.isSolved);
      this.callback.object && this.callback.object(this, __obj);
    }

    correct() {
      sendToDTCaliperSensor(this);
      this.onOffContainer(true);
      this.finish();
    }

    correctCallback() {
      this.callback.correct && this.callback.correct(this);
    }

    incorrectCallback() {
      this.callback.incorrect && this.callback.incorrect(this);
    }

    setAnswer() {
      this.checkAnswer(this.isCorrect, this.correctCallback, this.incorrectCallback);
    }

    reset() {
      this.objectArray.forEach((obj) => { obj.clear(); });
    }

    init() {
      this.objectArray.forEach((obj, index) => {
        const answer = this.answerArray[index];
        
        obj.answer = answer;
        obj.attr('autocomplete', `off`);
        obj.clear = () => { clearInput(obj.DOM) };
        obj.insertAnswer = () => { obj.DOM.value = answer; };
        // obj.event('input', this.insertInputValue.bind(this, obj));
        obj.DOM.addEventListener('input', this.insertInputValue.bind(this, obj));
      });

      this.answerButton.event('click touchstart', this.setAnswer);
      this.retryButton.event('click touchstart', this.reset);

      if (window.arrangeQuestionCallback.essay) {
        this.callback = setCallback(window.arrangeQuestionCallback.essay);
      }

      watchProperty(() => {}, () => {});
    }
  }

  class SELECT extends QUIZ {
    constructor(__quiz) {
      super(__quiz);
      this.binding();
      this.init();
    }

    binding() {
      this.reset = this.reset.bind(this);
      this.setAnswer = this.setAnswer.bind(this);
      this.correctCallback = this.correctCallback.bind(this);
      this.incorrectCallback = this.incorrectCallback.bind(this);
    }

    get isSolved() {
      return this.objectArray.filter((obj) => obj.solved).length > 0;
    }

    get isCorrect() {
      return this.objectArray.filter((obj) => obj.isAnswered).length === this.objectArray.length;
    }

    correctCallback() {
      this.callback.correct && this.callback.correct(this);
    }

    incorrectCallback() {
      this.callback.incorrect && this.callback.incorrect(this);
    }

    setAnswer() {
      this.checkAnswer(this.isCorrect, this.correctCallback, this.incorrectCallback);
    }

    reset() {
      this.objectArray.forEach((obj) => { obj.clear(); });
    }

    setUserValue(__obj, __index) {
      __obj.solved = true;
      __obj.value = __index;
      if (__obj.answer.includes(__obj.value)) __obj.isAnswered = true;
      else __obj.isAnswered = false;

      this.userValue[__obj.index] = __obj.select.DOM.value;
      this.setStateAnswerButton(this.isSolved);
    }

    clearObject(__obj) {
      __obj.value = null;
      __obj.solved = false;
      __obj.isAnswered = false;
      __obj.userValue.value = '';
      __obj.select.DOM.selectedIndex = 0;
      clearInput(__obj.userValue);
    }

    init() {
      this.objectArray.forEach((obj, index) => {
        obj.index = index;
        obj.answer = obj.attr(ATTR_QUIZ_OBJ).replace(/ /g, '').split(',').map((value) => value - 0);
        obj.select = obj.getEl('select');
        obj.userValue = obj.getEl('.userValue');
        obj.clear = this.clearObject.bind(this, obj);
        
        obj.getEl('select').DOM.addEventListener('change', () => {
          const selectedIndex = obj.select.DOM.selectedIndex;
          obj.userValue.value = selectedIndex;
          this.setUserValue(obj, selectedIndex);
        });
      });

      this.answerButton.event('click touchstart', this.setAnswer);
      this.retryButton.event('click touchstart', this.reset);

      if (window.arrangeQuestionCallback.select) {
        this.callback = setCallback(window.arrangeQuestionCallback.select);
      }

      watchProperty(() => {
        // this.objectArray.forEach((obj) => obj.userValue.value = 4);
        return this.objectArray.filter((obj) => obj.userValue.value !== '').length > 0
      }, () => {
        this.objectArray.forEach((obj) => {
          if (obj.userValue.value && obj.userValue.value !== '') {
            obj.select.DOM.selectedIndex = obj.userValue.value;
            this.setUserValue(obj, obj.userValue.value);
          }
        });
      });
    }
  }
  /* configs */
  const ATTR_QID = 'data-qid';
  const ATTR_INDEX = 'data-index';
  const ATTR_RESPONSE_TYPE = 'data-response-type';
  const ATTR_DESCRIPTION = 'data-description';
  const ATTR_QUIZ_OBJ = 'data-quiz-obj';
  const ATTR_VALUE = 'data-value';
  const ATTR_DRAG_TYPE = 'data-drag-type';
  const ATTR_RETRY = 'data-arrangeQuestion-retry';

  const CLASS_PAGE = '.page';
  const CLASS_BUTTON_ANSWER = '.confirmBtn';
  const CLASS_BUTTON_RETRY = '.retryBtn';
  const CLASS_BUTTON_NEXT = '.nextBtn';
  const CLASS_FEEDBACK_CORRECT = '.rightCheck';
  const CLASS_FEEDBACK_FIRST = '.firstChallCheck';
  const CLASS_FEEDBACK_SECOND = '.secondChallCheck';
  const CLASS_FEEDBACK_INCORRECT = '.wrongCheck';
  const CLASS_USER_VALUE = '.userValue';
  const CLASS_ANSWERBOX = '.answerBox';
  const CLASS_POPUPWRAP = 'popupWrap';

  const TAG_ASSESSMENTITEM = 'assessmentItem';
  const TAG_CORRECTRESPONSE = 'correctResponse';
  const TAG_MODALFEEDBACK = 'modalFeedback';

  const TEXT_SHOW = 'show';
  const TEXT_SELECTED = 'selected';
  const TEXT_LOCK = 'isLock';
  /* END configs */

  // 각 페이지에서 설정 가능한 callback 객체 등록
  window.arrangeQuestionCallback = window.arrangeQuestionCallback || {};
  /* window.arrangeQuestionCallback.input = {
    object: (QUIZ, __obj) => {},
    correct: (QUIZ) => {},
    incorrect: (QUIZ) => {},
    finish: (QUIZ) => {},
    retry: (QUIZ) => {},
  } */

  function arrangeQuestionReset() {
    window.assessmentItem.forEach((quiz) => {
      quiz.reset();
      quiz.retry();
      quiz.resetTryNumber();
    });
  }

  window.addEventListener('load', () => {
    // test
    // initScale(document.body);
    const pageNumber = getEl(CLASS_PAGE).DOM.innerHTML - 0;
    const assessmentItem = getEl(TAG_ASSESSMENTITEM);
    const retryButton = getEl(`[${ATTR_RETRY}]`);
    retryButton && retryButton.event('touchstart click', arrangeQuestionReset);

    const sound = {};
    sound.click = createAudio('click');
    sound.correct = createAudio('correct');
    sound.wrong = createAudio('wrong');

    window.assessmentItem = assessmentItem.map((container, index) => {
      const answerSpan = container.getEl(TAG_CORRECTRESPONSE).getEl('span');
      const getAnswer = answerSpan.length ? answerSpan : [answerSpan];

      // uid 부여
      container.qid = container.attr('data-qid');
      
      container.type = container.attr(ATTR_RESPONSE_TYPE);
      container.description = container.attr(ATTR_DESCRIPTION);
      container.answerArray = getAnswer.map((answer) => answer.DOM.innerHTML);
      container.answerButton = container.getEl(CLASS_BUTTON_ANSWER);
      container.retryButton = container.getEl(CLASS_BUTTON_RETRY);
      container.nextButton = container.getEl(CLASS_BUTTON_NEXT);
      container.feedback_first = container.getEl(CLASS_FEEDBACK_FIRST);
      container.feedback_second = container.getEl(CLASS_FEEDBACK_SECOND);
      container.feedback_incorrect = container.getEl(CLASS_FEEDBACK_INCORRECT);
      container.feedback_correct = container.getEl(CLASS_FEEDBACK_CORRECT);
      container.hintBox = container.getEl(TAG_MODALFEEDBACK);
      container.answerBox = container.getEl(CLASS_ANSWERBOX);
      container.pageNumber = pageNumber;

      /* correct/incorrect result */
      container.tabButton = getTabButton(container.DOM)[index];

      /* buttons & feedback event, functions */
      container.feedback_first && appendOnOffFunction(container.feedback_first, TEXT_SHOW);
      container.feedback_second && appendOnOffFunction(container.feedback_second, TEXT_SHOW);
      container.feedback_incorrect && appendOnOffFunction(container.feedback_incorrect, TEXT_SHOW);
      container.feedback_correct && appendOnOffFunction(container.feedback_correct, TEXT_SHOW);
      container.hintBox && appendOnOffFunction(container.hintBox, TEXT_SHOW);
      container.answerBox && appendOnOffFunction(container.answerBox, TEXT_SHOW);
      
      container.answerButton && addHoverEvent(container.answerButton.DOM);
      container.answerButton && appendOnOffFunction(container.answerButton, TEXT_SHOW);
      container.retryButton && addHoverEvent(container.retryButton.DOM);
      container.retryButton && appendOnOffFunction(container.retryButton, TEXT_SHOW);
      container.nextButton && addHoverEvent(container.nextButton.DOM);
      container.nextButton && appendOnOffFunction(container.nextButton, TEXT_SHOW);
      /* END buttons & feedback event, functions */

      container.sound = sound;

      if (container.DOM.hasAttribute('data-option')) {
        const options = container.attr('data-option').replace(/ /g, '').split(',');
        options.forEach((option) => {
          container[option] = true;
        });
      }

      let quiz;
      
      (() => {
        switch (container.type) {
          case 'singleChoice': quiz = new SINGLECHOICE(container); break;
          case 'multipleChoice': quiz = new MULTICHOICE(container); break;
          case 'trueFalse': quiz = new TRUEFALSE(container); break;
          case 'fillInTheBlank': quiz = new INPUT(container); break;
          case 'drawLine': quiz = new DRAWLINE(container); break;
          case 'etc': quiz = new DRAGDROP(container); break;
          case 'essay': quiz = new ESSAY(container); break;
          case 'select': quiz = new SELECT(container); break;
        }
      })();

      return quiz;
    });
  });
})();