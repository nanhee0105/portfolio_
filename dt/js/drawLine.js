
(() => {
  
  function inViewer() { return parent.parent.GO_PAGE_LOAD || parent.GO_PAGE_LOAD; }
  function stopPropagation(event) { event.stopPropagation(); };

  const isMobile = () => {
    return navigator.userAgent.match(/iPad|iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null;
  }

  function getZoomRate(DOM) {
    const zoomRate = DOM.getBoundingClientRect().width / DOM.offsetWidth;
      return inViewer() ? parent.ZOOMVALUE : zoomRate;
  }

  function getEl(target, parent = document) {
    const elements = parent.querySelectorAll(target);
    const array = Array.prototype.map.call(elements, (el) => {
      return new ConvertObject(el);
    });
    return array.length > 1 ? array : array[0];
  }

  function getElementFromPoint(event) {
    return document.elementFromPoint(getEventPosition(event).x, getEventPosition(event).y);
  }
  function getEventPosition(event) {
    const eventTarget = event.type.indexOf('touch') > -1
      ? (event.changedTouches[0] || event.touches[0]) 
      : event;
  
    return {
      x: eventTarget.clientX, 
      y: eventTarget.clientY
    }
  }
  
  function initScale(element) {
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
  
  function initDrag({dragObj, container = document, callback}) {
    const setOffsetData = (target) => {
      target.width = target.offsetWidth;
      target.height = target.offsetHeight;
      target.top = target.offsetTop;
      target.left = target.offsetLeft;
    }
    
    function setEvent(target, eType, callback, listenertype = 'add') {
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
  
      setOffsetData(dragObj);
      zoomRate = getZoomRate(dragObj);
      DRAG.zoomRate = zoomRate;
      
      startX = getEventPosition(event).x;
      startY = getEventPosition(event).y;
  
      DRAG.startPointer = { x: startX, y: startY }
      
      addEventContainer();
      
      if (callback_start) callback_start(DRAG);
    }
  
    const moveDrag = (event) => {
      moveX = getEventPosition(event).x;
      moveY = getEventPosition(event).y;
  
      DRAG.moveX = (moveX - startX) / zoomRate;
      DRAG.moveY = (moveY - startY) / zoomRate;
      
      if (callback_move) callback_move(DRAG);
      if (!getElementFromPoint(event)) endDrag(event);
    }
  
    const endDrag = (event) => {
      event.stopPropagation();
      removeEventContainer();
      if (callback_end) callback_end(DRAG, event);
    }
  
    const addEventContainer = () => {
      setEvent(container, 'mousemove touchmove', moveDrag);
      setEvent(container, 'mouseup touchend', endDrag);
    }
  
    const removeEventContainer = () => {
      setEvent(container, 'mousemove touchmove', moveDrag, 'remove');
      setEvent(container, 'mouseup touchend', endDrag, 'remove');
    }
  
    setEvent(dragObj, 'mousedown touchstart', startDrag);
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
      return convert(children);
    }
  
    addClass(className) {
      this.DOM.classList.add(className);
    }
  
    removeClass(className) {
      this.DOM.classList.remove(className);
    }
  
    setEvent(eType, listenertype = 'add', callback) {
      const eventTypeArray = eType.split(' ');
      eventTypeArray.forEach((type) => {
        this.DOM[`${listenertype}EventListener`](type, (event) => {
          // 모바일 환경에서 마우스 이벤트가 실행되는 경우 return 
          if (isMobile() && event.type.indexOf('touch') < 0) return;
          callback(event);
        });
      });
    }
  
    setStyle(styles) {
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
  }

  function setStateBlockEvents(container, isDragging = true) {
    const selectType = isDragging ? 'none' : 'auto';
    const eventType = isDragging ? 'add' : 'remove';

    container.setEvent('touchmove mousemove', eventType, stopPropagation);
    container.setStyle({
      'userSelect': selectType,
      'msUserSelect': selectType,
      'mozUserSelect': selectType,
      'webkitUserSelect': selectType,
    });
  }

  function createPath(isAnswer, {svgContainer, stroke, answerStroke, strokeWidth}) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    /* line.setAttribute('stroke', isAnswer ? answerStroke : stroke);
    line.setAttribute('stroke-width', `${strokeWidth}px`); */
    svgContainer.DOM.appendChild(line);
    return line;
  }

  function getIsAnswered(answeredArray, currentArray) {
    return answeredArray.filter((array) => {
      if (isSameArray(array, currentArray)) return array;
    }).length > 0;
  }

  function isSameArray(array1, array2) {
    return array1.filter(value1 => {
      return array2.filter(value2 => value1 === value2).length > 0
    }).length === array1.length
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
  
  const watchProperty = (watching, callback) => {
    let index = 0;
    const interval = setInterval(function () {
      index++;
      const end = watching();

      // 실행 후 1초 뒤 interval 종료
      if (end || index > 10) {
        console.log('end watchProperty!');
        clearInterval(interval);
        end && callback();
      }
    }, 100);
  }

  function drawLine(__line, __start, __end) {
    __line.setAttribute('x1', __start.x);
    __line.setAttribute('y1', __start.y);
    __line.setAttribute('x2', __end.x);
    __line.setAttribute('y2', __end.y);
  }
  
  class DrawLine {
    constructor({container, draggableDropElement = true, path = {}}) {
      this.binding();

      this.container = container;
      this.svgContainer = getEl('svg', container.DOM);
      this.dragObjs = getEl(`[${ATTR_DATA_DRAG_OBJ}]`, container.DOM);
      this.userValue = container.DOM.querySelector(CLASS_SAVE_POINT);
      this.strokeWidth = path.width || 10;
      this.stroke = path.stroke || 'blue';
      this.answerStroke = path.answerStroke || 'tomato';

      this.droppedObj = null;
      this.answeredGroup = [];
      this.newLine = {};

      this.dragObjs.forEach((obj, index) => {
        obj.type = obj.attr(ATTR_DATA_TYPE);
        obj.index = index;
        obj.value = obj.attr(ATTR_DATA_DRAG_OBJ).replace(/ /g, '').split(',');

        let isNotDragType = 'drop';
        if (draggableDropElement) isNotDragType = '';

        if (obj.type !== isNotDragType) {
          initDrag({
            dragObj: obj.DOM,
            container: this.container.DOM,
            callback: {
              start: this.startDrag.bind(this, obj),
              move: this.moveDrag.bind(this, obj),
              end: this.endDrag.bind(this, obj),
            }
          });
          if (obj.value.length > 1) this.multiLine = true;
        }
      });

      watchProperty(() => {
        // this.userValue.value = `0,2 0,3 1,4 1,5`;
        return this.userValue.value !== '';
      }, () => {
        const userValue = this.userValue.value.split(' ').map((value) => {
          return value.split(',').map((index) => this.dragObjs[index]);
        });
        
        this.answeredGroup = userValue;
        this.drawAnsweredLine();
      });
    }

    binding() {
      this.drawAnsweredLine = this.drawAnsweredLine.bind(this);
      this.drawAnswer = this.drawAnswer.bind(this);
      this.reset = this.reset.bind(this);
    }

    set droppedObj(__obj) {
      this._droppedObj = this.dragObjs.filter((el) => el.DOM === __obj)[0];
    }
    get droppedObj() { return this._droppedObj; }

    get isAnswered() {
      return this.dragObjs;
    }

    get isCorrect() {
      return this.dragObjs;
    }

    startDrag(__obj, DRAG) {
      //  기존에 그어진 선이 있으면 삭제 후 동작
      if (__obj.drawedLine && !this.multiLine) this.removeDrawedLine(__obj);

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
      
      // 정오답 비교 없이 진행
      const isCorrect = this.droppedObj // drop 존재 유무
        &&  __obj.type !== this.droppedObj.type; // drag & drop 타입 비교
        // && answerGroup.length > 0; // drag & drop 정답 비교

      /* // 기존 정답이 있으면 정답 패스 및 선 삭제
      if (getIsAnswered(this.answeredGroup, [__obj, this.droppedObj])) {
        this.removeNewLine();
        return;
      } */

      if (isCorrect) this.correct(__obj, this.droppedObj);
      else this.incorrect(__obj);
    }

    removeDrawedLine(__obj) {
      let removeIndex;

      this.answeredGroup.forEach((group, index) => {
        if (group.filter((obj) => obj === __obj).length > 0) removeIndex = index;
      });
      
      this.answeredGroup.splice(removeIndex, 1);
      this.svgContainer.DOM.removeChild(__obj.drawedLine.DOM);
      __obj.drawedLine = null;
    }

    removeNewLine() {
      this.svgContainer.DOM.removeChild(this.newLine.DOM);
      this.newLine = {};
    }

    insertUserValue() {
      this.userValue.value = this.answeredGroup.map((answer) => `${answer[0].index},${answer[1].index}`).join(' ');
    }

    drawAnsweredLine() {
      this.svgContainer.DOM.innerHTML = '';

      this.answeredGroup.forEach((group) => {
        const dragObj = group[0];
        const dropObj = group[1];
        drawLine(createPath(true, this), {
          x: dragObj.left + (dragObj.width / 2),
          y: dragObj.top + (dragObj.height / 2)
        }, {
          x: dropObj.left + (dropObj.width / 2),
          y: dropObj.top + (dropObj.height / 2)
        });
      });
    }

    drawAnswer() {
      const drags = this.dragObjs.filter((obj) => obj.type === 'drag');
      const drops = this.dragObjs.filter((obj) => obj.type === 'drop');

      drags.forEach((dragObj) => {
        drops.forEach((dropObj) => {
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
    
    correct(__drag, __drop) {
      this.answeredGroup.push([__drag, __drop]);
      this.insertUserValue();

      __drag.drawedLine = this.newLine;
      this.newLine.DOM.setAttribute('x2', __drop.left + (__drop.width / 2));
      this.newLine.DOM.setAttribute('y2', __drop.top + (__drop.height / 2));
      
      this.newLine = {};
    }

    incorrect(__obj) {
      this.removeNewLine();
    }

    reset() {
      this.droppedObj = null;
      this.answeredGroup = [];
      this.newLine = {};
      this.svgContainer.DOM.innerHTML = '';
      this.userValue.value = '';
      this.dragObjs.forEach((obj) => {
        obj.drawedLine = null;
      });
    }
  }

  const ATTR_DATA_DRAG_CONTAINER = 'data-drag-container';
  const ATTR_DATA_DRAG_OBJ = 'data-drag-obj';
  const ATTR_DATA_TYPE = 'data-drag-type';
  const CLASS_SAVE_POINT = '.dragSavePoint';

  function runDrawLine() {
    const drawLine = new DrawLine({
      container: getEl(`[${ATTR_DATA_DRAG_CONTAINER}]`),
      draggableDropElement: false,
      /* path: {
        stroke: 'red',
        width: 10
      } */
    });

    return {
      origin: drawLine,
      reset: drawLine.reset,
      drawUserValue: drawLine.drawAnsweredLine,
      drawAnswer: drawLine.drawAnswer,
      isAnswered: drawLine.isAnswered,
      isCorrect: drawLine.isCorrect,
    }
  }

  window.drawLineQuiz = runDrawLine;
  
  window.addEventListener('load', () => {
    // test
    // initScale(document.body);
  });
})();