(() => {
  /* configs */
  const clickEvent = 'click touchstart';

  function setStateStamp({container, closeButton, dragButton, dragBox, dropArea, selectButtons, erasers}, {endCallback}) {
    function movingCursor(event) {
      cursorMovingIndex++;
      if (cursorMovingIndex % 5 !== 0) return;
      cursor.setPosition($ic.getEventPosition(event));
    }

    function setCursor(__type) {
      if (!cursor) cursor = $ic.createEl({className: 'cursorImg', parent: dropArea.DOM});

      if (__type === 'eraser') cursor.on('eraser');
      else cursor.off('eraser');

      cursor.setPosition = ({y = null, x = null}) => {
        cursor.style({
          top: (y ? `${y}px` : ''), 
          left: (x ? `${x}px` : '')
        });
      }
      dropArea.DOM.addEventListener('mousemove', movingCursor);
    }

    function setDrag() {
      dragBox.setPosition = (top = null, left = null) => {
        dragBox.style({
          top: (top ? `${top}px` : ''), 
          left: (left ? `${left}px` : '')
        });
      }
      $ic.initDrag({
        dragObj: dragButton,
        container: container,
        callback: {
          start: (DRAG, event) => {
            dragBox.start = { x: dragBox.left, y: dragBox.top };
            cursor.on('hide');
          },
          move: (DRAG, event) => {
            const movePosition = {
              x: DRAG.moveX + dragBox.start.x,
              y: DRAG.moveY + dragBox.start.y
            }
            dragBox.setPosition(movePosition.y, movePosition.x);
          },
          end: (DRAG, event) => {
            cursor.off('hide');
          },
        }
      });
    }

    function onClickedDropArea(event) {
      const eventPosition = $ic.getEventPosition(event);
      if (stampRemoveMode) {
        const clickedStamp = $ic.getElementFromPoint(event);
        if (dropArea.contains(clickedStamp) && clickedStamp !== dropArea.DOM) dropArea.remove(clickedStamp);
      }
      else {
        const stampImage = $ic.createEl({className: 'stampImage', parent: dropArea.DOM});
        stampImage.attr('data-type', stampType);
        stampImage.style({
          top: `${eventPosition.y - 110}px`, 
          left: `${eventPosition.x - 120}px`
        });
      }
    }

    function resetSelect() {
      selectButtons.forEach((button) => { button.off(); });
    }

    function changeStampType(button) {
      const type = button.data('type');
      stampRemoveMode = false;
      stampType = type;
      resetSelect();
      button.on();
      setCursor();
    }

    function onEraserMode(eraser) {
      if (eraser.data('type') === 'all') {
        dropArea.clear();
        setCursor();
      }
      else {
        stampRemoveMode = true;
        setCursor('eraser');
      }
    }

    function stopStamp() {
      dropArea.clear();
      container.off();
      dragBox.setPosition();
      stampRemoveMode = false;
      endCallback();
    }

    function startStamp() {
      selectButtons[0].on();
      stampType = 1;
      container.on();
      setCursor();
    }
    
    /* close */
    closeButton.event(clickEvent, stopStamp);
    
    /* dropArea */
    let cursor = null;
    let cursorMovingIndex = 0;
    dropArea.clear = () => { 
      cursor = null;
      dropArea.DOM.innerHTML = ''; 
      dropArea.DOM.removeEventListener('mousemove', movingCursor);
    }
    dropArea.event(clickEvent, onClickedDropArea);

    /* drag */
    setDrag();

    /* select */
    let stampType = 1;
    selectButtons.forEach((button) => {
      button.event(clickEvent, changeStampType.bind(null, button));
    });

    /* eraser */
    let stampRemoveMode = false;
    erasers.forEach((eraser) => {
      eraser.event(clickEvent, onEraserMode.bind(null, eraser));
    });
    
    return {
      startStamp,
      stopStamp
    }
  }
  
  window.$stamp = setStateStamp;
})();