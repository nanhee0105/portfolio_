(() => {
  window.LESSON_ARRANGE = window.LESSON_ARRANGE || {};

  function getEl(target, parent = document) {
    return Array.prototype.map.call(parent.querySelectorAll(target), (dom) => dom);
  }

  const isMobile = () => {
    return navigator.userAgent.match(/iPad|iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null;
  }

  function next(__container) {
    const tabButtons = getEl('.tabTitle > li', __container);
    const tabPages = getEl('.tabContent > div', __container);
    let currentIndex;

    tabButtons.forEach((button, index) => {
      if (button.classList.contains(TEXT_SELECTED)) currentIndex = button.getAttribute('data-tab') - 0;
    });
    
    tabButtons[currentIndex-1].classList.remove(TEXT_SELECTED);
    tabPages[currentIndex-1].classList.remove(TEXT_SELECTED);
    tabPages[currentIndex-1].style.display = 'none';

    tabButtons[currentIndex].classList.add(TEXT_SELECTED);
    tabPages[currentIndex].classList.add(TEXT_SELECTED);
    tabPages[currentIndex].style.display = 'block';

    /* window.assessmentItem.forEach((quiz) => {
      if (quiz.type === 'drawLine') quiz.drawAnsweredLine();
    }) */
  }

  function retryInput(__container) {
    const elements = getEl('textarea', __container).concat(getEl('input', __container));
    elements.forEach((__el) => {
      if (__el.hasAttribute(ATTR_NO_TRY)) return;
      else {
        __el.value = '';
        __el.checked = false;
        // delete user input data
        if (parent.API_ANNOTATION_INPUT_DELETE) parent.API_ANNOTATION_INPUT_DELETE(__el.id);
      }
    });
  }

  function retrySelect(__container) {
    const elements = getEl('select', __container);
    elements.forEach((__el) => {
      __el.value = '';
      __el.checked = false;
      // delete user input data
      if (parent.API_ANNOTATION_INPUT_DELETE) parent.API_ANNOTATION_INPUT_DELETE(__el.id);
    });
  }

  function retryCheckText(__container) {
    const elements = getEl('.checkText', __container);
    elements.forEach((__el) => {
      __el.classList.remove('borderD');
    });
  }

  function retryElements({button, page}) {
    // 퀴즈 타입 여러개 제어 할 수 있도록 수정 
    const typeArray = button.dataset.retryBtn 
      ? button.dataset.retryBtn.replace(/ /g, '').split(',') 
      : ['input'];
      
    typeArray.forEach((type) => {
      switch(type) {
        case 'input':
          retryInput(page);
          break;
        case 'select':
          retrySelect(page);
          break;
        case 'checkText':
          retryCheckText(page);
          break;
      }

      window.LESSON_ARRANGE[type] && window.LESSON_ARRANGE[type]();
    });
  }

  const detectMobile = (event, callback) => {
    // 모바일 환경에서 마우스 이벤트가 실행되는 경우 return 
    if (isMobile() && event.type.indexOf('touch') < 0) return;
    callback(event);
  }

  class LessonArrange {
    constructor({container, page}) {
      this.binding();

      this.container = container;
      this.page = page;
      this.exampleBox = page.querySelector(`.${CLASS_ANSWERBOX}`);
      this.examButton = page.querySelector(`.${CLASS_EXANSWER_BUTTON}`);
      this.retryButton = page.querySelector(`.${CLASS_EXANSWER_BUTTON}.retry`);
      this.nextButton = page.querySelector(`.${CLASS_NEXT_BUTTON}`);

      this.items = Array.prototype.map.call(page.querySelectorAll('input, textarea, .checkText, select'), item => item);
      this.tryCount = 0;

      this.init();
    }

    get selectedItems() {
      return this.items.filter(item => {
        if ((item.tagName === 'input' && item.type === 'text') || item.tagName === 'textarea' || item.tagName === 'select') {
          return item.value !== '';
        }
        else if (item.tagName === 'input' && (item.type === 'checkbox' || item.type === 'radio')) return item.checked;
        else return item.classList.contains('borderD');
      });
    }

    get isAnswered() {
      var answered = false;
      var textInputs = this.items.filter(item => (item.tagName === 'input' && item.type === 'text' && item.hasAttribute('data-answer')) || item.tagName === 'textarea' || item.tagName === 'select');
      var radioInputs = this.items.filter(item => item.tagName === 'input' && (item.type === 'radio' || item.type === 'checkbox'));
      var checkTexts = this.items.filter(item => item.classList.contains('checkText'));

      if (textInputs.length) {
        if (textInputs.filter(item => {
          return item.value !== '' && item.value.replace(/ /g, '') == item.dataset['answer'].replace(/ /g, '');
        }).length === textInputs.length) answered = true;
        else answered = false;
      }

      if (radioInputs.length) {
        if (radioInputs.filter(item => item.hasAttribute('data-answered')).length === radioInputs.filter(item => item.hasAttribute('data-answered') && item.checked).length) {
          answered = true;
        }
        else answered = false;
      }

      if (checkTexts.length) {
        if (checkTexts.filter(item => item.hasAttribute('data-answered')).length === checkTexts.filter(item => item.hasAttribute('data-answered') && item.classList.contains('borderD')).length) answered = true;
        else answered = false;
      }

      
      if (window.DRAWLINE && this.page.contains(DRAWLINE.origin.container.DOM)) {
        if (DRAWLINE.origin.answeredGroup.filter(group => group[0].value[0] === group[1].value[0]).length === (DRAWLINE.origin.dragObjs.length / 2)) answered = true;
        else answered = false;
      }
      
      return answered;
    }

    binding() {
      this.showExample = this.showExample.bind(this);
      this.retry = this.retry.bind(this);
    }

    showExample() {
      this.page.classList.add(TEXT_BLOCKED);
      this.examButton.classList.add(TEXT_HIDE);
      this.retryButton.classList.add(TEXT_SHOW);
      this.exampleBox.classList.add(TEXT_SHOW);
      this.nextButton && this.nextButton.classList.add(TEXT_SHOW);
    }

    retry() {
      this.page.classList.remove(TEXT_BLOCKED);
      this.examButton.classList.remove(TEXT_HIDE);
      this.retryButton.classList.remove(TEXT_SHOW);
      this.exampleBox.classList.remove(TEXT_SHOW);
      this.nextButton && this.nextButton.classList.remove(TEXT_SHOW);
      this.tryCount = 0;

      retryElements({
        button: this.retryButton,
        page: this.page
      });
    }

    init() {
      const clickedExamButton = (event) => {
        if (this.selectedItems.length === 0) {
          ALERT_TRY_SOLVE.style.display = 'block';
          setTimeout(() => {
            ALERT_TRY_SOLVE.style.display = 'none';
          }, 1000);
        }
        else {
          this.tryCount++;

          if (this.isAnswered) {
            playCorrectSound();
            this.showExample();
          }
          else if (this.tryCount === 2) {
            ALERT_CHECK_ANSWER.style.display = 'block';
            setTimeout(() => {
              ALERT_CHECK_ANSWER.style.display = 'none';
              this.showExample();
            }, 1000);
          }
          else {
            ALERT_WRONG_ANSWER.style.display = 'block';
            setTimeout(() => {
              ALERT_WRONG_ANSWER.style.display = 'none';
            }, 1000);
          }
        }
      }
      this.examButton.addEventListener('click', (event) => {
        detectMobile(event, clickedExamButton);
      });
      this.examButton.addEventListener('touchstart', (event) => {
        detectMobile(event, clickedExamButton);
      });
      this.retryButton.addEventListener('click', (event) => {
        detectMobile(event, this.retry);
      });
      this.retryButton.addEventListener('touchstart', (event) => {
        detectMobile(event, this.retry);
      });
    }
  }

  function playWrongSound() {
    audio.src = './media/effcet/wrong.mp3';
    audio.load();
    audio.play();
  }

  function playCorrectSound() {
    audio.src = './media/effcet/correct.mp3';
    audio.load();
    audio.play();
  }

  const ATTR_LESSON_ARRANGE = 'data-lesson-arrange';
  const ATTR_NO_TRY = 'data-no-retry';

  const CLASS_POPUP_LIST = 'popupList';
  const CLASS_ANSWERBOX = 'answerBox';
  const CLASS_EXANSWER_BUTTON = 'exanswerBtn';
  const CLASS_NEXT_BUTTON = 'nextBtn';

  const TEXT_HIDE = 'hide';
  const TEXT_SHOW = 'show';
  const TEXT_SELECTED = 'selected';
  const TEXT_BLOCKED = 'blocked';

  let ALERT_TRY_SOLVE;
  let ALERT_WRONG_ANSWER;
  let ALERT_CHECK_ANSWER;
  
  window.addEventListener('load', () => {
    const container = getEl(`[${ATTR_LESSON_ARRANGE}]`)[0];
    const popupListArray = getEl(`.${CLASS_POPUP_LIST}`, container);
    const nextBtns = getEl(`.${CLASS_NEXT_BUTTON}`, container);

    ALERT_TRY_SOLVE = document.querySelector('.trySolve');
    ALERT_WRONG_ANSWER = document.querySelector('.noAnswer2');
    ALERT_CHECK_ANSWER = document.querySelector('.noAnswer');

    popupListArray.forEach((page) => {
      new LessonArrange({container, page});
    });

    nextBtns.forEach((button) => {
      button.addEventListener('click', (event) => {
        detectMobile(event, next.bind(null, container));
      });
      button.addEventListener('touchstart', (event) => {
        detectMobile(event, next.bind(null, container));
      });
    });
  });
})();