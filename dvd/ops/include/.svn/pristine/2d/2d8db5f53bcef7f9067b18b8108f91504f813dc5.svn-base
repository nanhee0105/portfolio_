(() => {
  function openLink(__src = null) {
    if (!__src) { console.log('링크 경로가 없습니다!'); return; }

    if (window.jj && jj.link.html) window.jj.link.html(__src, '_blank', {"maximize": true});
    else window.open(__src, '_blank');
  }
  
  const clickEvent = 'click touchstart';

  function setStateActiveHelper(__app, {openCallback, closeCallback}) {
    const {button, container, activeButtons, stamp, reference} = __app;
    function autoClose(event) {
      const clickedElement = $ic.getElementFromPoint(event);
      const isClickedOtherPlace = !button.DOM.contains(clickedElement) && !container.DOM.contains(clickedElement);
      if (isClickedOtherPlace) hideAppContainer();
    }
    function removeEventAutoClose() {
      document.removeEventListener('click', autoClose);
      document.removeEventListener('touchstart', autoClose);
    }
    function showAppContainer() {
      __app.isShow = true;
      container.on();
      button.on();
      openCallback();
      document.addEventListener('click', autoClose);
      document.addEventListener('touchstart', autoClose);
    }
    function hideAppContainer() {
      __app.close();
      closeCallback();
    }
    function toggleAppContainer() {
      if (__app.isShow) hideAppContainer();
      else showAppContainer();
    }

    __app.close = () => {
      __app.isShow = false;
      container.off();
      button.off();
      removeEventAutoClose();
    };
    
    button.hover();
    button.event(clickEvent, toggleAppContainer.bind(null, container));

    activeButtons.forEach((button) => {
      const type = button.data('active');
      button.hover();
      button.event(clickEvent, () => {
        hideAppContainer();
        openLink(`../../../../../include/activeHelper/${type}.html`);
      });
    });
    
    if (stamp) {
      stamp.hover();
      stamp.event(clickEvent, () => {
        __app.close();
      });
    }
    
    if (reference) {
      reference.hover();
      reference.event(clickEvent, () => {
        hideAppContainer();
        openLink(`../../../../../science_lab/popup.html`);
      });
    }
  }
  
  window.$activeHelper = setStateActiveHelper;
})();