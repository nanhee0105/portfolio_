(() => {
  function getAlert(__alerts, __type) {
    const result = __alerts.filter((alert) => alert.data('alert') === __type);
    return result;
  }

  function getDroppedObj(__objs, __drop) {
    return __objs.filter((obj) => obj.DOM === __drop)[0];
  }
  
  class QUIZ {
    constructor(opts) {
      this.binding();
      this.quizInit(opts);
    }
    
    binding() {
      this.reset = this.reset.bind(this);
    }
    
    get isCurrentSolved() {
      const objs = this.currentCheckButton.objs;
      return objs.filter((obj) => obj.solved).length > 0;
    }
    
    get isCurrentCorrect() { return this.currentCheckButton.checkCorrect(); }
    get correctedLength() { return this.checkButtons.filter((button) => button.solved).length; }
    get isCorrect() { return this.checkButtons.length === this.correctedLength; }
    
    get clickSound() { return $CM && $CM.efSound && $CM.efSound.click; }
    get correctSound() { return $CM && $CM.efSound && $CM.efSound.correct; }
    get incorrectSound() { return $CM && $CM.efSound && $CM.efSound.wrong; }
    
    openAlert(__alert, __autoClose = false) {
      __alert.on('show');

      if (__autoClose) {
        setTimeout(() => { this.closeAlert(__alert.type) }, 3000);
      }
    }
    
    closeAlert(__type, __callback = null) {
      if (__type === 'right') this.alerts[__type].forEach((alert) => alert.off('show'));
      else this.alerts[__type].off('show');

      if (__type === 'wrong') this.currentCheckButton.reset();
      
      if (__callback) __callback();
    }
    
    correct(__index) {
      if (!this.noCheckAnswer) {
        this.correctSound();
        
        const correctAlert = this.alerts.right.filter((alert) => alert.index === __index)[0];
        this.openAlert(correctAlert);
      }
      
      // 개별 정답 버튼으로 전체 정답을 맞춘 경우 하단 정답 버튼 다시하기 버튼으로 토글
      if (this.isCorrect) this.setStateButtons(true);
      
      if (this.quizCorrect) this.quizCorrect();
      if (this.callback.correct) this.callback.correct(this);
      if (this.callback.chainCorrect) this.callback.chainCorrect(this);
    }
    
    incorrect() {
      this.incorrectSound();
      this.openAlert(this.alerts.wrong);
      
      if (this.quizIncorrect) this.quizIncorrect();
      if (this.callback.incorrect) this.callback.incorrect(this);
      if (this.callback.chainIncorrect) this.callback.chainIncorrect(this);
    }
    
    showAnswer() {
      this.container.on('isShowAnswer');
      this.setStateButtons(true);
      this.checkButtons.forEach((button) => {
        button.solved = true;
        button.hide();
        button.showAnswer();
      });
      // 개별 정답 버튼이 없는 경우 실행
      if (this.checkButtons.length === 0) {
        this.quizObjs.forEach((obj) => {
          obj.reset();
          obj.showAnswer();
        });
      }
      
      if (this.quizShowAnswer) this.quizShowAnswer();
      if (this.callback.showAnswer) this.callback.showAnswer(this);
    }
    
    reset() {
      this.container.off('isShowAnswer');
      this.setStateButtons(false);
      this.toggleCheckButtons('off');
      this.checkButtons.forEach((button) => { button.reset(); });
      // 개별 정답 버튼이 없는 경우 실행
      if (this.checkButtons.length === 0) this.quizObjs.forEach((obj) => obj.reset());
      
      if (this.quizReset) this.quizReset();
      if (this.callback.reset) this.callback.reset(this);
    }
    
    toggleCheckButtons(__type) {
      if (this.checkButtons) this.checkButtons.forEach((button) => { button[__type]('hide'); });
    }
    
    setStateButtons(isAllAnswered = true) {
      if (isAllAnswered) {
        this.explainButton && this.explainButton.on('show');
        this.retryButton && this.retryButton.on('show');
        this.answerButton && this.answerButton.off('show');
      }
      else {
        this.explainButton && this.explainButton.off('show');
        this.retryButton && this.retryButton.off('show');
        this.answerButton && this.answerButton.on('show');
      }
    }
    
    quizInit({container, name, type, options, alerts, callback,
      quizObjs, afterAnswerObjs, checkButtons, closeButtons, 
      explainButton, answerButton, retryButton}) {
      this.container = container;
      this.name = name;
      this.callback = callback;
      
      if (options) {
        const quizOptions = options.replace(/ /g, '').split(',');
        quizOptions.forEach((option) => { this[option] = true; });
      }
      
      if (alerts) {
        alerts.forEach((alert) => alert.type = alert.data('alert'));
        this.alerts = {
          explain: getAlert(alerts, 'explain')[0],
          notEnter: getAlert(alerts, 'notEnter')[0],
          wrong: getAlert(alerts, 'wrong')[0],
          right: getAlert(alerts, 'right').map((al, index) => { 
            al.index = al.data('index') - 0 || index + 1; 
            return al; 
          }),
        }
      }
      
      if (closeButtons) {
        closeButtons.forEach((button) => {
          const type = button.data('close');
          button.hover();
          button.event('click touchstart', () => {
            this.clickSound();
            this.closeAlert(type);
          });
        });
      }
      
      if (explainButton) {
        explainButton.hover();
        explainButton.event('click touchstart', () => {
          this.openAlert(this.alerts.explain);
        });
        explainButton.event('click touchstart', this.clickSound);
        this.explainButton = explainButton;
      }
      
      if (answerButton) {
        answerButton.on('show');
        answerButton.hover();
        answerButton.event('click touchstart', this.showAnswer.bind(this));
        answerButton.event('click touchstart', this.clickSound);
        this.answerButton = answerButton;
      }
      
      if (retryButton) {
        retryButton.hover();
        retryButton.event('click touchstart', this.reset.bind(this));
        retryButton.event('click touchstart', this.clickSound);
        this.retryButton = retryButton;
      }
      
      if (afterAnswerObjs) {
        this.afterAnswerObjs = afterAnswerObjs.map((obj) => {
          obj.index = obj.data('index') - 0;
          obj.showAnswer = () => { obj.on('show'); }
          obj.reset = () => { obj.off('show'); }
          return obj;
        });
      }
      
      this.quizObjs = quizObjs.map((obj) => {
        obj.index = obj.data('index') - 0;
        obj.solved = false;
        return obj;
      });
      
      this.checkButtons = checkButtons.map((button) => {
        button.index = button.data('index') - 0;
        button.objs = this.quizObjs.filter((obj) => button.index === obj.index);
        button.maxLength = button.objs.length;
        
        if (this.afterAnswerObjs) button.afterObjs = this.afterAnswerObjs.filter((obj) => button.index === obj.index);
        
        button.hide = () => { button.on('hide'); }
        button.show = () => { button.off('hide'); }
        button.solvedObjs = () => { button.objs.forEach((obj) => { obj.solved = true; }); }
        button.showAnswer = () => {
          button.on('reset');
          button.objs.forEach((obj) => { obj.showAnswer(); });
          button.afterObjs && button.afterObjs.forEach((obj) => { obj.showAnswer(); });

          /* 21.11.09 spvog 개별 정답 버튼에 callback 추가 */
          if (this.callback.currentShowAnswer) this.callback.currentShowAnswer(button.index, this);
        }
        button.checkCorrect = () => {
          return button.objs.filter((obj) => obj.isCorrect()).length === button.maxLength;
        }
        button.reset = () => {
          button.solved = false;
          button.off('reset');
          button.off('hide');
          button.objs.forEach((obj) => { obj.reset(); });
          button.afterObjs && button.afterObjs.forEach((obj) => { obj.reset(); });
          this.currentCheckButton = null;

          /* 21.11.09 spvog 개별 정답 버튼에 callback 추가 */
          if (this.callback.currentReset) this.callback.currentReset(button.index, this);
        }
        
        button.hover();
        button.event('click touchstart', () => {
          this.currentCheckButton = button;
          
          if (button.solved) {
            button.reset();
            button.solved = false;
            this.setStateButtons(false);
          }
          else {
            // 빈 칸이 있는 경우 입력 경고창 실행
            if (!this.noCheckAnswer && !this.isCurrentSolved) this.openAlert(this.alerts.notEnter);
            // 정답
            else if (this.noCheckAnswer || this.isCurrentCorrect) {
              button.showAnswer();
              button.solved = true;
              button.on('reset');
              // 정답 설명이 각각 경고창으로 들어가므로 index값을 전달
              this.correct(button.index);
            }
            // 오답
            else {
              this.incorrect();
            }
          }

          if (this.callback.chain) this.callback.chain(this);
        });

        if (this.noCheckAnswer) button.event('click touchstart', () => { this.clickSound(); });
        
        return button;
      });
      
      $CM.inPage[(name || 'quiz')] = {
        _this: this,
        showAnswer: this.showAnswer,
        reset: this.reset,
      }
    }
  }
  
  class INPUT extends QUIZ {
    constructor(opts) {
      super(opts);
      this.init(opts);
    }
    
    init() {
      const isIncludes = (__array, __target) => {
        return __array.includes(__target);
      }
      // set button
      this.checkButtons.forEach((button) => {});
      // set objs
      this.quizObjs.forEach((obj) => {
        obj.answer = obj.data('answer') ? obj.data('answer').split('|') : [''];
        
        obj.isCorrect = () => { return this.noCheckAnswer ? true : isIncludes(obj.answer.map(text => text.replace(/ /g, '')), obj.DOM.value.replace(/ /g, '')); }
        obj.showAnswer = () => {
          if (this.noCheckAnswer || !obj.isCorrect()) obj.DOM.value = obj.answer[0];
          obj.on('pointerOff');
        }
        obj.reset = () => {
          obj.DOM.value = '';
          obj.solved = false;
          obj.off('pointerOff');
        }
        obj.event('input', () => {
          if (obj.DOM.value !== '') obj.solved = true;
          else obj.solved = false;

          if (this.callback.click) this.callback.click(this, obj);
        });
      });
    }
  }
  
  class TRUEFALSE extends QUIZ {
    constructor(opts) {
      super(opts);
      this.init(opts);
    }
    
    init() {
      this.quizObjs.forEach((obj) => {
        obj.hover();
        obj.showAnswer = () => {
          if (obj.DOM.hasAttribute('data-answer')) obj.on();
          else obj.off();
          obj.on('pointerOff');
        }
        obj.reset = () => {
          obj.off();
          obj.solved = false;
          obj.off('pointerOff');
        }
      });
      
      this.checkButtons.forEach((button) => {
        button.objs.forEach((obj) => {
          obj.event('click touchstart', () => {
            this.clickSound();
            
            button.resetObjs();
            button.solvedObjs();
            obj.on();
            
            if (obj.DOM.hasAttribute('data-answer')) button.isCorrect = true;
            else button.isCorrect = false;

            if (this.callback.click) this.callback.click(this, obj);
          });
        });
        
        button.resetObjs = () => {
          button.objs.forEach((obj) => { obj.reset(); });
        }
        button.checkCorrect = () => { return button.isCorrect; }
      });
    }
  }
  
  class CHECK extends QUIZ {
    constructor(opts) {
      super(opts);
      this.init(opts);
    }
    
    init() {
      this.quizObjs.forEach((obj) => {
        obj.hover();
        obj.showAnswer = () => {
          if (obj.DOM.hasAttribute('data-answer')) {
            obj.parent.on();
            obj.DOM.checked = true;
          }
          else {
            obj.parent.off();
            obj.DOM.checked = false;
          }
          obj.parent.on('pointerOff');
        }
        obj.reset = () => {
          obj.parent.off();
          obj.solved = false;
          obj.DOM.checked = false;
          obj.parent.off('pointerOff');
        }
      });
      
      this.checkButtons.forEach((button) => {
        button.objs.forEach((obj) => {
          obj.event('click touchstart', () => {
            button.resetObjs();
            button.answeredObjs();
            obj.parent.on();
            obj.DOM.checked = true;
            
            if (obj.DOM.hasAttribute('data-answer')) button.isCorrect = true;
            else button.isCorrect = false;

          if (this.callback.click) this.callback.click(this, obj);
          });
        });
        
        button.resetObjs = () => {
          button.objs.forEach((obj) => { obj.reset(); });
        }
        button.answeredObjs = () => {
          button.objs.forEach((obj) => { obj.solved = true; });
        }
        button.checkCorrect = () => {
          return button.isCorrect;
        }
      });
    }
  }
  
  class MULTICHECK extends QUIZ {
    constructor(opts) {
      super(opts);
      this.init(opts);
    }
    
    init() {
      this.quizObjs.forEach((obj) => {
        obj.hover();
        obj.isAnswer = obj.DOM.hasAttribute('data-answer');
        if (this.groupReset) obj.groupIndex = obj.data('group')-0;

        obj.showAnswer = () => {
          if (obj.isAnswer) {
            obj.parent.on();
            obj.DOM.checked = true;
          }
          else {
            obj.parent.off();
            obj.DOM.checked = false;
          }
          obj.parent.on('pointerOff');
        }
        obj.reset = () => {
          obj.parent.off();
          obj.solved = false;
          obj.DOM.checked = false;
          obj.parent.off('pointerOff');
        }
      });
      
      this.checkButtons.forEach((button) => {
        button.objs.forEach((obj) => {
          obj.event('click touchstart', () => {
            if (this.groupReset) {
              button.objs.filter((__obj) => __obj.groupIndex === obj.groupIndex).forEach((obj) => obj.reset());
            }
            
            if (obj.solved) {
              obj.parent.off();
              obj.solved = false;
              obj.DOM.checked = false;
            }
            else {
              obj.parent.on();
              obj.solved = true;
              obj.DOM.checked = true;
            }

            if (this.callback.click) this.callback.click(this, obj);
          });
        });
        
        button.resetObjs = () => {
          button.objs.forEach((obj) => { obj.reset(); });
        }
        button.answeredObjs = () => {
          button.objs.forEach((obj) => { obj.solved = true; });
        }
        button.checkCorrect = () => {
          const answerLength = button.objs.filter((obj) => obj.isAnswer).length;
          const wrongLength = button.objs.filter((obj) => obj.solved && !obj.isAnswer).length;
          const currentLength = button.objs.filter((obj) => obj.solved && obj.isAnswer).length;
          return answerLength === currentLength && wrongLength === 0;
        }
      });
    }
  }
  
  class DRAWLINE extends QUIZ {
    constructor(opts) {
      super(opts);
      this.init(opts);
    }

    get drags() { return this.quizObjs.filter((obj) => obj.type === 'drag'); }
    get drops() { return this.quizObjs.filter((obj) => obj.type === 'drop'); }

    createPath() {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      this.svgContainer.append(line);
      return line;
    }

    drawLine(__line, __start, __end) {
      __line.setAttribute('x1', __start.x);
      __line.setAttribute('y1', __start.y);
      __line.setAttribute('x2', __end.x);
      __line.setAttribute('y2', __end.y);
    }

    removeDrawedLine(__obj) {
      const newGroup = this.answeredGroup.map((group, index) => {
        if (group.filter((obj) => obj === __obj).length > 0) {
          this.svgContainer.DOM.removeChild(group[2].DOM);
          return null
        } else return group;
      });
      
      this.answeredGroup = newGroup.filter((group) => group);
    }

    removeNewLine() {
      this.svgContainer.remove(this.newLine.DOM);
      this.newLine = {};
    }

    correctLine(__drag, __drop) {
      const dragObj = __drag.type === 'drag' ? __drag : __drop;
      const dropObj = __drag.type === 'drag' ? __drop : __drag;
      
      dragObj.solved = true;
      this.answeredGroup.push([dragObj, dropObj, this.newLine]);

      this.newLine.DOM.setAttribute('x2', dropObj.left + (dropObj.width / 2));
      this.newLine.DOM.setAttribute('y2', dropObj.top + (dropObj.height / 2));
      
      this.newLine = {};
    }

    incorrectLine() {
      this.removeNewLine();
    }

    startDrag(__obj, DRAG) {
      //  기존에 그어진 선이 있으면 삭제 후 동작
      if (!this.multi && __obj.solved) this.removeDrawedLine(__obj);

      this.newLine.DOM = this.createPath(this.svgContainer);
      this.newLine.start = {
        x: __obj.left + (__obj.width / 2),
        y: __obj.top + (__obj.height / 2)
      };
      
      this.drawLine(this.newLine.DOM, this.newLine.start, this.newLine.start);
      $ic.setStateBlockEvents(this.container, true);

      if (this.callback.startDrag) this.callback.startDrag(this);
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
      $ic.setStateBlockEvents(this.container, false);

      // get dropped object in this.dragObjs
      const dropElement = $ic.getElementFromPoint(event);
      this.droppedObj = dropElement && getDroppedObj(this.quizObjs, dropElement);

      // get array [drag, drop]
      const getAnsweredGroup = this.answeredGroup.filter((group) => {
          return group[0] === __obj && group[1] === this.droppedObj;
        });
        
      // 정오답 비교 없이 진행
      const isCorrect = this.droppedObj // drop 존재 유무
        &&  __obj.type !== this.droppedObj.type; // drag & drop 타입 비교
        
      const result = isCorrect && getAnsweredGroup.length === 0;
      if (result) this.correctLine(__obj, this.droppedObj);
      else this.incorrectLine(__obj);
      
      if (this.callback.endDrag) this.callback.endDrag(this, result);
    }
    
    init() {
      this.droppedObj = null;
      this.answeredGroup = [];
      this.newLine = {};

      this.svgContainer = this.container.getEl('.js-svgContainer')[0];
      
      let dropIndex = 1, dragIndex = 1;
      this.quizObjs.forEach((obj) => {
        obj.type = obj.data('type');
        obj.index = obj.type === 'drop' ? dropIndex : dragIndex;
        obj.value = obj.data('index').replace(/ /g, '').split(',');
        
        if (obj.type === 'drop') dropIndex++;
        else dragIndex++;

        $ic.initDrag({
          dragObj: obj,
          container: this.container,
          callback: {
            start: this.startDrag.bind(this, obj),
            move: this.moveDrag.bind(this, obj),
            end: this.endDrag.bind(this, obj)
          }
        });

        obj.showAnswer = () => {
          obj.reset();

          obj.solved = true;
          obj.value.forEach((value) => {
            const dropObjs = this.drops.filter((drop) => drop.value.includes(value));

            dropObjs.forEach((drop) => {
              const line = this.createPath(this.svgContainer);
              const start = {x: obj.left + (obj.width / 2), y: obj.top + (obj.height / 2)};
              const end = {x: drop.left + (drop.width / 2),y: drop.top + (drop.height / 2)};
              this.drawLine(line, start, end);

              this.answeredGroup.push([obj, drop, {DOM: line}]);
            });
          });
        }
        obj.reset = () => {
          obj.solved = false;
          this.removeDrawedLine(obj);
        }
        obj.isCorrect = () => {
          const isIncludes = (__array1, __array2) => {
            return __array1.filter((value) => __array2.includes(value)).length > 0;
          }
          const currentGroup = this.answeredGroup.filter((group) => group.includes(obj));
          
          return currentGroup.filter((group) => {
            return isIncludes(group[0].value, group[1].value);
          }).length === currentGroup.length;
        }
      });
      
      this.checkButtons.forEach((button) => {
        button.objs = this.quizObjs.filter((obj) => obj.type === 'drag' && button.index === obj.index);
        button.maxLength = button.objs.length;
      });
    }
  }
  
  class DRAGDROP extends QUIZ {
    constructor(opts) {
      super(opts);
      this.init(opts);
    }

    get drags() { return this.quizObjs.filter((obj) => obj.type === 'drag'); }
    get drops() { return this.quizObjs.filter((obj) => obj.type === 'drop'); }

    correctDrag(__drag, __drop) {
      const dragObj = __drag.type === 'drag' ? __drag : __drop;
      const dropObj = __drag.type === 'drag' ? __drop : __drag;
      
      dragObj.solved = true;

      if (dragObj.isClone) {
        if (!this.freeDrag) {
          dragObj.style({top: '', left: ''});
          dropObj.append(dragObj.DOM);
        }
        dropObj.answered.push(dragObj.original);
        dropObj.setLength();
      }
      else {
        if (!this.freeDrag) dragObj.setPosition();
        if (!this.copy) dragObj.on('hide');
        dragObj.on('complete');
        this.insertClone(dragObj, dropObj.DOM);
        dropObj.answered.push(dragObj);
        dropObj.setLength();
      }
    }

    incorrectDrag(__drag) {
      __drag.setPosition();

      if (__drag.isClone) {
        __drag.parent.remove(__drag.DOM);
        if (!this.copy) {
          __drag.original.off('hide');
          __drag.original.off('complete');
        }
      }
    }

    insertClone(__drag, __drop) {
      const parentNode = this.freeDrag ? __drag.parent : __drop;
      const cloneObj = new $ic.Convert(__drag.DOM.cloneNode(true));
      cloneObj.type = __drag.type;
      cloneObj.index = __drag.index;
      cloneObj.value = __drag.value;
      cloneObj.group = __drag.group;
      cloneObj.isClone = true;
      cloneObj.original = __drag;
      this.setDragObj(cloneObj);
      parentNode.append(cloneObj.DOM);
      // this.quizObjs.push(cloneObj);

      cloneObj.off('hide');
      cloneObj.off('off');
      if (!this.freeDrag) cloneObj.setPosition();
      if (this.freeDrag && this.copy) __drag.setPosition();
    }

    startDrag(__obj, DRAG) {
      $ic.setStateBlockEvents(this.container, true);

      __obj.on('isDragging');
      __obj.start = {x: __obj.left, y: __obj.top};

      if (__obj.isClone) {
        const drop = this.drops.filter((drop) => drop.DOM === __obj.parent.DOM)[0];
        drop.answered = drop.answered.filter((obj) => obj !== __obj.original);
        drop.setLength();
      }

      if (this.callback.startDrag) this.callback.startDrag(this, __obj);
    }

    moveDrag(__obj, DRAG) {
      const movePosition = {
        x: DRAG.moveX + __obj.start.x,
        y: DRAG.moveY + __obj.start.y
      }

      __obj.setPosition(movePosition.y, movePosition.x);
    }

    endDrag(__obj, DRAG, event) {
      $ic.setStateBlockEvents(this.container, false);
      __obj.off('isDragging');
      
      // get dropped object in this.dragObjs
      const dropElement = $ic.getElementFromPoint(event);
      this.droppedObj = dropElement && getDroppedObj(this.quizObjs, dropElement);
      
      // 정오답 비교 없이 진행
      const isCorrect = this.droppedObj // drop 존재 유무
        &&  __obj.type !== this.droppedObj.type
        && __obj.group === this.droppedObj.group; // drag & drop 타입 비교

      const result = isCorrect && (this.multi || this.droppedObj.children.length === 0);
      if (result) this.correctDrag(__obj, this.droppedObj);
      else this.incorrectDrag(__obj);
      
      if (this.callback.endDrag) this.callback.endDrag(this, result);
    }

    setDragObj(drag) {
      drag.setPosition = (top = null, left = null) => {
        drag.style({
          top: (top ? `${top}px` : ''), 
          left: (left ? `${left}px` : '')
        });
      }

      drag.showAnswer = () => {
        drag.reset();

        if (!this.freeDrag) drag.setPosition();
        if (!this.copy) drag.on('hide');
        drag.on('complete');
        drag.solved = true;
        drag.value.forEach((value) => {
          const dropdrags = this.drops.filter((drop) => drop.value.includes(value));
          dropdrags.forEach((drop) => {
            this.insertClone(drag, drop.DOM);
            drop.answered.push(drag);
            drop.setLength();
          });
        });
      }

      drag.reset = () => {
        drag.solved = false;
        drag.off('complete');
        drag.off('hide');
        drag.setPosition();
      }

      $ic.initDrag({
        dragObj: drag,
        container: this.container,
        callback: {
          start: this.startDrag.bind(this, drag),
          move: this.moveDrag.bind(this, drag),
          end: this.endDrag.bind(this, drag)
        }
      });
    }

    setDropObj(drop) {
      drop.answered = [];
      drop.className = drop.DOM.className;

      drop.showAnswer = () => {}
      drop.setLength = () => {
        drop.attr('data-drag-length', drop.answered.length);
        
        drop.DOM.className = drop.className;
        drop.on(`dragLength_${drop.answered.length}`);
      }
      drop.reset = () => {
        drop.clear();
        drop.answered = [];
        drop.DOM.className = drop.className;
      }
    }
    
    init() {
      let dropIndex = 1, dragIndex = 1;
      this.quizObjs.forEach((obj) => {
        obj.type = obj.data('type');
        obj.index = obj.type === 'drop' ? dropIndex : dragIndex;
        obj.group = obj.data('group')-0 || 1;
        obj.value = obj.data('index').replace(/ /g, '').split(',');
        
        if (obj.type === 'drop') {
          dropIndex++;
          this.setDropObj(obj);
        }
        else {
          dragIndex++;
          this.setDragObj(obj);
        }
      });
      
      this.checkButtons.forEach((button) => {
        button.resetObjs = () => {
          this.quizObjs = this.quizObjs.filter((obj) => !obj.isClone);
          button.objs.forEach((obj) => { obj.reset(); });
        }
        button.checkCorrect = () => {}
      });
    }
  }
  
  class SELECT extends QUIZ {
    constructor(opts) {
      super(opts);
      this.init(opts);
    }
    
    init() {
      this.quizObjs.forEach((obj) => {
        obj.value = obj.data('answer')-0;
        obj.showAnswer = () => {
          obj.solved = true;
          obj.isCorrect = true;
          obj.DOM.selectedIndex = obj.value;
        }
        obj.reset = () => {
          obj.solved = false;
          obj.isCorrect = false;
          obj.DOM.selectedIndex = 0;
        }
      });
      
      this.checkButtons.forEach((button) => {
        button.objs.forEach((obj) => {
          obj.event('change', () => {
            obj.solved = true;

            if (obj.value === obj.DOM.selectedIndex) obj.isCorrect = true;
            else obj.isCorrect = false;

            if (this.callback.click) this.callback.click(this, obj);
          });
        });
        
        button.resetObjs = () => {
          button.objs.forEach((obj) => { obj.reset(); });
        }
        button.checkCorrect = () => {
          return button.objs.filter((obj) => obj.isCorrect).length === button.objs.length;
        }
      });
    }
  }
  
  window.$ic.INPUT = INPUT;
  window.$ic.TRUEFALSE = TRUEFALSE;
  window.$ic.CHECK = CHECK;
  window.$ic.MULTICHECK = MULTICHECK;
  window.$ic.DRAWLINE = DRAWLINE;
  window.$ic.DRAGDROP = DRAGDROP;
  window.$ic.SELECT = SELECT;
})();