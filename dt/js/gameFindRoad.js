(() => {
  function getEl(type, parent = document) {
    const reusltArray = Array.prototype.map.call(parent.querySelectorAll(type), (el) => new Convert(el));
    return reusltArray.length === 1 ? reusltArray[0] : reusltArray;
  }

  function hover(target) {
    target.event('mouseover', () => {
      target.class('add', 'hover');
    });
    target.event('mouseout', () => {
      target.class('remove', 'hover');
    });
  }

  class Convert {
    constructor(el) {
      this.DOM = el;
    }
    get children() {
      return Array.prototype.map.call(this.DOM.children, (child) => new Convert(child));
    }
    get top() { return this.DOM.offsetTop; }
    get left() { return this.DOM.offsetLeft; }
    get width() { return this.DOM.offsetWidth; }
    get height() { return this.DOM.offsetHeight; }
    class(__type, __names) {
      __names.split(' ').forEach((name) => {
        this.DOM.classList[__type](name);
      });
    }
    style(__styles) {
      Object.getOwnPropertyNames(__styles).forEach((property) => {
        this.DOM.style[property] = __styles[property];
      });
    }
    attr() {
      if (arguments.length === 1) return this.DOM.getAttribute(arguments[0]);
      else this.DOM.setAttribute(arguments[0], arguments[1]);
    }
    event(__event, __callback, type = 'add') {
      __event.split(' ').forEach((eventType) => {
        this.DOM[`${type}EventListener`](eventType, (event) => {
          if (!isMouseEventInMobile(event)) __callback(event);
        });
      });
    }
    getEl(__type) {
      return getEl(__type, this.DOM);
    }
    on(name = 'on') { this.class('add', name); }
    off(name = 'on') { this.class('remove', name); }
  }

  function isMouseEventInMobile(event) {
    const isMobile = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
    return isMobile && event.type.indexOf('touch') < 0;
  }

  function initResultIcon(__result) {
    const result = {};
    __result.forEach((icon) => {
      icon.show = () => {
        icon.on();
        setTimeout(() => { icon.off(); }, 1500);
      }
      result[icon.attr(ATTR_TYPE)] = icon;
    });
    return result;
  }

  function getScoreDom({score, user}) {
    return score.filter((input) => {
      if (input.attr(ATTR_USER) === user.attr(ATTR_USER)) {
        input.value = 0;
        return input;
      }
    })[0];
  }

  function setUserScore(__value) {
    this.score.value = __value;
    this.score.DOM.value = __value < 10 ? `0${__value}` : __value;
  }

  function setPosition() {
    this.class('add', 'moving');
    this.attr(ATTR_STEP, this.step);
    setTimeout(() => {
      this.class('remove', 'moving');
    }, 800);
  }

  function setUser(__user) {
    __user.step = 0;
    __user.type = __user.attr(ATTR_USER);
    // __user.score = getScoreDom({score: __score, user: __user});
    __user.setPosition = setPosition;
    // __user.setScore = setUserScore;

    switch(__user.type) {
      case '1':
        __user.sound = {
          start: createAudio('girl_start', './media/mp3/page030'),
          finish: createAudio('girl_finish', './media/mp3/page030')
        }
        break;
      case '2':
        __user.sound = {
          start: createAudio('boy_start', './media/mp3/page030'),
          finish: createAudio('boy_finish', './media/mp3/page030')
        }
        break;
      case '3':
        __user.sound = {
          start: createAudio('robot_start', './media/mp3/page030'),
          finish: createAudio('robot_finish', './media/mp3/page030')
        }
        break;
    }
    __user.reset = () => {
      __user.step = 0;
      __user.playType = null;
      // __user.setScore(0);
      __user.setPosition();
    };
  }

  const createAudio = (name, src = './media/effcet') => {
    // const audio = new Audio();
    const sound = {};

    sound.DOM = audio;
    sound.src = `${src}/${name}.mp3`;
    
    sound.stop = () => {
      audio.pause();
      audio.currentTime = 0;
    }
    sound.play = () => {
      audio.src = sound.src;
      audio.preload = 'metadata';
      audio.load();
      audio.play();
    }
    return sound;
  }

  const initPopup = (__popup, callback) => {
    __popup.reset = () => {
      __popup.getEl('input').forEach((input) => input.DOM.checked = false);
    }
    __popup.getEl(CLASS_CHECK).forEach((check) => {
      /* check.event(EVENT_DOWN, (event) => {
        callback(check);
      }); */
      $(check.DOM).on(clickEvent, () => { callback(check); });
    });
    return __popup;
  }

  class FindRoad {
    constructor(opts) {
      this.binding();

      this.index = 1;

      this.init(opts);
      this.setSound();

      console.log('FindRoad:', this);
    }

    binding() {
      this.reset = this.reset.bind(this);
      this.showChoice = this.showChoice.bind(this);
      this.startGame = this.startGame.bind(this);
      this.userChange = this.userChange.bind(this);
    }

    get currentUser() {
      return this.user.filter((user) => user.attr(ATTR_USER)-0 === this.index)[0];
    }
    // get currentScore() { return this.currentUser.score.DOM.value; }
    get step() { return this.currentUser.step; }

    setStateUser(__type) {
      this.user.forEach((user) => {
        user.off(TEXT_SHOW);
      });

      if (__type === 'single') {
        this.choiceButton.on('off');
        this.user[2].on(TEXT_SHOW);
        this.user[2].playType = 'robot';
        setTimeout(() => {
          this.startGame();
        }, 1500);
      }
      else {
        this.choiceButton.off('off');
        this.user[0].on(TEXT_SHOW);
        this.user[1].on(TEXT_SHOW);
      }
    }

    showChoice() {
      this.choiceButton.on('off');

      const setRandomIndex = (child, charIndex) => {
        randomIndex_2 = Math.floor(Math.random() * 3 + 1);
        
        while (randomIndex_1 === randomIndex_2) {
          randomIndex_2 = Math.floor(Math.random() * 3 + 1);
        }
        
        randomIndex_1 = randomIndex_2;
        child.attr(ATTR_INDEX, randomIndex_2);
        this.user[charIndex].choiceIndex = randomIndex_2;
      }

      const run = (timestamp) => {
        if (!start) start = timestamp;
        count++;
        
        const progress = (timestamp - start) / TIME_CHOICE;
        const isShow = count % 3 === 0;

        if (isShow) {
          if (index < 3) index++;
          else index = 1;
          this.choice.children.forEach((child) => child.attr(ATTR_INDEX, index));
        }
      
        if (progress < 1) {
          window.requestAnimationFrame(run);
        } else {
          start = null;
          this.choice.children.forEach(setRandomIndex);
          this.resultChoice();
        }
      }
      
      let start;
      let index = 1;
      let randomIndex_1;
      let randomIndex_2;
      let count = 0;

      clearInterval(this.hideChoice);
      this.hideChoice = setTimeout(() => {
        this.choice.off();
      }, 1500);

      this.choice.on();
      window.requestAnimationFrame(run);
    }

    resultChoice() {
      const index_1 = this.user.filter((user) => user.attr(ATTR_USER)-0 === 1)[0].choiceIndex;
      const index_2 = this.user.filter((user) => user.attr(ATTR_USER)-0 === 2)[0].choiceIndex;

      if (index_2 - index_1 === 1 || index_2 - index_1 === -2) this.index = 2;
      else this.index = 1;
      
      console.log(`starter: ${this.index === 1 ? 'girl' : 'boy'}`);

      if (!this.currentUser.playType) this.currentUser.playType = this.index === 1 ? 'girl' : 'boy';

      setTimeout(this.startGame, 1500);
    }

    startGame() {
      this.currentUser.step = '0-1';
      
      // this.currentUser.setScore(parseInt(this.currentScore) + 1);
      this.currentUser.sound.start.play();
      this.currentUser.setPosition();

      setTimeout(() => {
        this.showPopup('select');
      }, TIME_CLOSE_POPUP);
    }

    userChange() {
      // add single type
      if (this.type === 'single') this.index = 3;
      else {
        this.index = this.index === 1 ? 2 : 1;
      }

      this.startGame();
    }

    returnChar() {
      this.currentUser.step = 0;
      this.currentUser.setPosition(); 
    }

    showGameHow() {
      this.gameHow.class('add', 'show');
    }

    showPopup(type) {
      this[`${type}Popup`].on();
      this[`${type}Popup`].attr(ATTR_STEP, this.currentUser.step);
    }

    closePopup() {
      this.selectPopup.off();
      this.selectPopup.reset();
      this.questionPopup.off();
      this.questionPopup.reset();
    }

    selectRoad(__step) {
      this.closePopup();
      this.currentUser.step = __step;
      this.currentUser.setPosition();

      setTimeout(() => {
        this.showPopup('question');
      }, TIME_SHOW_POPUP);
    }

    correct(__step) {
      this.soundPlay('correct');
      this.resultIcon.correct.show();
      this.currentUser.step = __step || parseInt(this.currentUser.step) + 1;
      if (this.step === 2) this.currentUser.step = '1-2';

      setTimeout(() => {
        // close question popup
        this.closePopup();
        this.currentUser.setPosition();
      }, TIME_CLOSE_POPUP);
      
      setTimeout(() => {
        if (this.step === '1-2') this.showPopup('select');
        else if (this.step === 13) this.clearGame();
        else this.showPopup('question');
      }, TIME_CLOSE_POPUP + TIME_SHOW_POPUP);
    }

    incorrect() {
      this.soundPlay('wrong');
      this.resultIcon.incorrect.show();

      const timing_failMotion = TIME_CLOSE_POPUP + TIME_FAIL_MOTION;
      const timing_userChange = timing_failMotion + TIME_SHOW_POPUP;

      setTimeout(() => {
        // close question popup
        this.closePopup();
        // run fail motion
        this.currentUser.class('add', TEXT_FAIL);
      }, TIME_CLOSE_POPUP);

      setTimeout(() => {
        // character return start
        this.returnChar();
        this.currentUser.class('remove', TEXT_FAIL);
      }, timing_failMotion);

      setTimeout(this.userChange, timing_userChange + 500);
    }

    clearGame() {
      // this.loading.on();
      this.currentUser.sound.finish.play();
      this.winner[this.index - 1].on();
      this.selectedWay.filter((way) => (way.attr(ATTR_TYPE) - 0) === this.selectedWayIndex)[0].on();
    }

    reset() {
      this.showGameHow();

      clearInterval(this.hideChoice);
      this.choice.off();
      this.choiceButton.off('off');
      this.closePopup();
      this.user.forEach((user) => {
        user.off(TEXT_SHOW);
        setTimeout(() => {
          user.reset();
        }, 100);
      });
      // this.loading.off();
      this.winner.forEach((winner) => { winner.off(); });
      this.selectedWay.forEach((way) => { way.off(); });
    }

    setSound() {
      this.sound = {};
      this.sound.click = createAudio('click');
      this.sound.correct = createAudio('correct');
      this.sound.wrong = createAudio('wrong');
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

    init({choiceContainer, selectedWay, popup, users, result, gameHow, buttons, winner}) {
      this.replayButton = buttons.filter((btn) => btn.attr(ATTR_TYPE) === 'replay')[0];
      this.choiceButton = buttons.filter((btn) => btn.attr(ATTR_TYPE) === 'choice')[0];

      this.replayButton.event(EVENT_DOWN, this.reset);
      this.choiceButton.event(EVENT_DOWN, this.showChoice);
      
      this.user = users.map((user) => {
        setUser(user);
        user.reset();
        return user;
      });
      
      this.selectPopup = initPopup(popup.select, (check) => {
        const selectedStep = check.attr(ATTR_STEP) - 0;
        this.selectRoad(selectedStep);
        switch(selectedStep) {
          case 2:
            this.selectedWayIndex = 3;
            break;
          case 4:
            this.selectedWayIndex = 2;
            break;
          case 5:
            this.selectedWayIndex = 1;
            break;
        }
      });

      this.questionPopup = initPopup(popup.question, (check) => {
        const isAnswer = check.DOM.hasAttribute(ATTR_ANSWER);
        const hasStepIndex = check.attr(ATTR_STEP);

        if (isAnswer) this.correct(hasStepIndex);
        else this.incorrect();
      });

      this.choice = choiceContainer;
      this.resultIcon = initResultIcon(result);
      this.winner = winner;
      this.gameHow = gameHow;
      this.selectedWay = selectedWay;
      // this.loading = loading;

      this.showGameHow();
    }
  }


  /* configs */
  const CLASS_USER = '.js-user';
  const CLASS_CHOICE = '.js-choice';
  // const CLASS_SCORE = '.js-score';
  const CLASS_BUTTON = '.js-button';
  const CLASS_POP_SELECT = '.js-selectPop';
  const CLASS_POP_QUESTION = '.js-questionPop';
  const CLASS_RESULT_ICON = '.js-resultIcon';
  const CLASS_CHECK = '.js-check';
  // const CLASS_LOADING = '.js-loading';
  const CLASS_WINNER = '.js-winner';
  const CLASS_GAMEHOW = '.js-gameHow';
  const CLASS_PLAYBUTTON = '.js-choicePlayButton';
  const CLASS_SELECTEDWARY = '.js-selectedWay';

  const ATTR_TYPE = 'data-type';
  const ATTR_USER = 'data-user';
  const ATTR_STEP = 'data-step';
  const ATTR_INDEX = 'data-index';
  const ATTR_ANSWER = 'data-answer';

  const TEXT_FAIL = 'isFailed';
  const TEXT_SHOW = 'show';

  const TIME_CLOSE_POPUP = 1000;
  const TIME_FAIL_MOTION = 2000;
  const TIME_SHOW_POPUP = 1500;
  const TIME_CHOICE = 500;

  const EVENT_DOWN = 'click touchstart';
  /* END configs */
  
  window.addEventListener('load', () => {
    const container = getEl('.js-findRoadGame');
    const gameHow = getEl(CLASS_GAMEHOW);
    const playButtons = getEl(CLASS_PLAYBUTTON);
    // const scoreContainer = container.getEl(CLASS_SCORE);
    
    const findRoad = new FindRoad({
      container,
      gameHow,
      users: container.getEl(CLASS_USER),
      result: container.getEl(CLASS_RESULT_ICON),
      selectedWay: container.getEl(CLASS_SELECTEDWARY),
      // score: scoreContainer.getEl(`[${ATTR_USER}]`),
      choiceContainer: container.getEl(CLASS_CHOICE),
      buttons: container.getEl(CLASS_BUTTON),
      // loading: container.getEl(CLASS_LOADING),
      winner: container.getEl(CLASS_WINNER),
      popup: {
        select: container.getEl(CLASS_POP_SELECT),
        question: container.getEl(CLASS_POP_QUESTION)
      }
    });
    // const userArray = getEl('.js-user');
    
    playButtons.forEach((button) => {
      $(button.DOM).on(clickEvent, () => {
        const type = button.attr(ATTR_TYPE);
        gameHow.class('remove', 'show');
        findRoad.type = type;
        findRoad.index = type === 'single' ? 3 : 1;
        findRoad.setStateUser(type);

        audio.src = './media/effcet/click.mp3';
        audio.load();
        audio.play();

        container.attr('data-play-type', type);
      });
    });
  });
})();