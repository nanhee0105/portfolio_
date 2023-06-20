window.THINKPOP = window.THINKPOP || {};

window.addEventListener('load', function() {
  const ATTR_RETRY_BTN = 'data-retry-btn';
  const ATTR_RETRY_CONTENT = 'data-retry-content';
  const ATTR_RETRY_INDEX = 'data-retry-index';
  const ATTR_NO_TRY = 'data-no-retry';
  const CLASS_POPUPWRAP = 'popupWrap';
  const CLASS_TRYAGAIN_BTN = 'tryagainBtn';
  const CLASS_POPUP_LIST = 'popupList';

  function getEl(target, parent = document) {
    return Array.prototype.map.call(parent.querySelectorAll(target), (dom) => dom);
  }
  function getContainer(__button) {
    function get(__target) { return __target.parentNode; }

    let parent = __button.parentNode;
    const index = __button.dataset.retryIndex;
    while (!parent.classList.contains(CLASS_POPUPWRAP)) {
      console.log('finding popupWrap!');
      parent = get(parent);
    }

    // popupList에 [data-retry-content] 가 없는 경우 index 자동 삽입
    const popupList = getEl(`.${CLASS_POPUP_LIST}`, parent);
    popupList.forEach((popup, index) => {
      if (!popup.hasAttribute(ATTR_RETRY_CONTENT)) popup.setAttribute(ATTR_RETRY_CONTENT, index+1);
    });

    return parent.querySelector(`[${ATTR_RETRY_CONTENT}="${index}"]`);
  }

  function retryInput(__container) {
    const elements = getEl('textarea', __container).concat(getEl('input', __container));
    elements.forEach((__el) => {
      if (__el.hasAttribute(ATTR_NO_TRY)) return;
      else {
        __el.value = '';
        // reset check & radio
        if (__el.checked) __el.checked = false;
        // delete user input data
        if (parent.API_ANNOTATION_INPUT_DELETE) parent.API_ANNOTATION_INPUT_DELETE(__el.id);
      }
    });
  }

  function retryCheckText(__container) {
    const elements = getEl(`.checkText`, __container).concat(getEl(`.checkText2`, __container));
    elements.forEach((__el) => {
      __el.classList.remove('borderD');
      __el.classList.remove('borderD2');
    });
  }

  function retryDraw(__container) {
    const elements = getEl('canvas', __container);
    elements.forEach((canvas) => {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.parentElement.classList.remove('hideText');
    });
  }
  
  function retryElements(__button) {
    // 퀴즈 타입 여러개 제어 할 수 있도록 수정 
    const typeArray = __button.dataset.retryBtn 
      ? __button.dataset.retryBtn.replace(/ /g, '').split(',') 
      : ['input'];
    const contentContainer = getContainer(__button);

    typeArray.forEach((type) => {
      switch(type) {
        case 'input':
          retryInput(contentContainer);
          break;
        case 'checkText':
          retryCheckText(contentContainer);
          break;
        case 'draw':
          retryDraw(contentContainer);
          break;
      }

      window.THINKPOP[type] && window.THINKPOP[type]();
    });

  }

  const retryButtons = getEl(`.${CLASS_TRYAGAIN_BTN}`);
  retryButtons.forEach((button, index) => {
    // retryButton에 [data-retry-index]가 없는 경우 index 자동 삽입
    if (!button.hasAttribute(ATTR_RETRY_INDEX)) button.setAttribute(ATTR_RETRY_INDEX, index+1);

    button.addEventListener('click', retryElements.bind(null, button));
    button.addEventListener('touchstart', retryElements.bind(null, button));
  });
});