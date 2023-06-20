(() => {

  const DOWN_EVENT = 'click touchstart';

  const TEXT_HIDE = 'hide';
  const TEXT_ACTIVE = 'active';
  const TEXT_SHOW = 'show';

  function setContext(__context, __color, __size) {
    __context.lineCap = 'round';
    __context.lineJoin = 'round';
    __context.strokeStyle = __color;
    __context.lineWidth = __size;
    __context.save();

    return __context;
  }
  function setTextOnCanvas(__context) {
    __context.font = `20px NotoSansKR-Medium`;
    __context.textBaseline = 'top';
    __context.fillStyle = '#CCC';
    __context.fillText('[그림]', 15, 10);
    __context.save();

    return __context;
  }
  
  const getDrawingStartPointer = (canvasPosition, zoomRate, __pointer) => {
    return {
      x: (__pointer.x - canvasPosition.left) / zoomRate,
      y: (__pointer.y - canvasPosition.top) / zoomRate,
    }
  }
  const getMovedPointer = (startPointer, DRAG) => {
    return {
      x: startPointer.x + DRAG.moveX,
      y: startPointer.y + DRAG.moveY,
    }
  }

  const setCanvas = (__canvas, __this) => {
    const {container} = __this;
    __canvas.drawedLines = [];
    __canvas.index = __canvas.data('index')-0;
    __canvas.context = __canvas.DOM.getContext('2d');
    
    // 사용자가 그린 드로잉을 저장할 canvas
    const saveCanvas = document.createElement('canvas');
    const saveContext = saveCanvas.getContext('2d');
    __canvas.saveCanvas = saveCanvas;
    saveCanvas.classList.add('saveCanvas');

    // 실제로 사용자가 드로잉 할 canvas
    const drawCanvas = document.createElement('canvas');
    const drawContext = drawCanvas.getContext('2d');
    __canvas.drawCanvas = drawCanvas;
    drawCanvas.classList.add('drawCanvas');

    __canvas.init = () => {
      saveCanvas.width = __canvas.width;
      saveCanvas.height = __canvas.height;
      drawCanvas.width = __canvas.width;
      drawCanvas.height = __canvas.height;

      setContext(__canvas.context, __this.color, __this.size);
      setContext(saveContext, __this.color, __this.size);
      setContext(drawContext, __this.color, __this.size);
      // setTextOnCanvas(__canvas.context);
    }
    __canvas.position = () => {
      return __canvas.DOM.getBoundingClientRect();
    };
    __canvas.clearByName = (canvas) => {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, __canvas.width, __canvas.height);
    }
    __canvas.clear = () => {
      __canvas.drawedLines = [];
      clearDrawcanvas();
      clearSavecanvas();
      clearShowcanvas();
    }
    __canvas.reset = () => {
      __canvas.off(TEXT_ACTIVE);
      __canvas.clear();
      __canvas.init();
    }

    function clearDrawcanvas() {
      __canvas.clearByName(drawCanvas);
    }
    function clearSavecanvas() {
      __canvas.clearByName(saveCanvas);
    }
    function clearShowcanvas() {
      __canvas.clearByName(__canvas.DOM);
      // setTextOnCanvas(__canvas.context);
    }

    function drawPath({x, y}, __alpha) {
      // 실제 드로잉은 offcanvas에서 함
      drawContext.lineTo(x, y);
      drawContext.stroke();
      clearShowcanvas();

      // saveCanvas에 저장된 드로잉 들고오기
      __canvas.context.globalAlpha = 1;
      __canvas.context.drawImage(saveCanvas, 0, 0);
 
      // offcanvas에서 그린 드로잉 들고오기
      __canvas.context.globalAlpha = __alpha;
      __canvas.context.drawImage(drawCanvas, 0, 0);
    }

    function startDrawing() {
      savePointer.color = __this.color;
      savePointer.size = __this.size;
      savePointer.alpha = __this.alpha;
      savePointer.pos.push(startPointer);
      
      clearDrawcanvas();
      setContext(drawContext, __this.color, __this.size);
      drawContext.beginPath();
      drawContext.moveTo(startPointer.x, startPointer.y);
    }

    function drawing(__movedPointer) {
      savePointer.pos.push(__movedPointer);
      drawPath(__movedPointer, __this.alpha);
    }

    function endDrawing() {
      __canvas.drawedLines.push(savePointer);
      savePointer = { pos: [] };
      clearSavecanvas();
      saveContext.drawImage(__canvas.DOM, 0, 0);
    }
    
    let startPointer;
    let savePointer = { pos: [] };

    $ic.initDrag({
      dragObj: __canvas,
      container: container,
      callback: {
        start: (DRAG) => {
          startPointer = getDrawingStartPointer(__canvas.position(), __this.zoomRate, DRAG.startPointer);
          startDrawing();
        },
        move: (DRAG) => {
          const movedPointer = getMovedPointer(startPointer, DRAG);
          if (__this.drawingMode) drawing(movedPointer);
        },
        end: (DRAG) => {
          if (__this.drawingMode) endDrawing();
        },
      }
    });
    
    __canvas.init();
  }

  const setStatePalette = (__palette, {container, setStateColor, setStateSize, setStatePen, canvasAllClear}) => {
    const {colors, sizes, pens, erasers, move} = __palette;
    const colorReset = () => {
      colors.forEach((color) => color.off());
      setStateColor(colors[0].value);
    }
    colors.forEach((color) => {
      color.value = color.data('color');
      color.event(DOWN_EVENT, (event) => {
        colorReset();
        color.on();
        setStateColor(color.value);
      });
    });
    
    const sizeReset = () => {
      sizes.forEach((size) => size.off());
      setStateSize(sizes[0].value);
    }
    sizes.forEach((size) => {
      size.value = size.data('size')-0;
      size.event(DOWN_EVENT, (event) => {
        sizeReset();
        size.on();
        setStateSize(size.value);
      });
    });
    
    const penReset = () => {
      pens.forEach((pen) => pen.off());
      setStatePen(pens[0].type);
    }
    pens.forEach((pen) => {
      pen.type = pen.data('type');
      pen.event(DOWN_EVENT, (event) => {
        penReset();
        pen.on();
        setStatePen(pen.type);
      });
    });
    
    erasers.forEach((eraser) => {
      eraser.type = eraser.data('type');
      eraser.event(DOWN_EVENT, (event) => {
        if (eraser.type === 'all') canvasAllClear();
      });
    });

    $ic.initDrag({
      dragObj: move,
      container: container,
      callback: {
        start: (DRAG, event) => {
          __palette.startY = __palette.top;
          __palette.startX = __palette.left;
        },
        move: (DRAG, event) => {
          __palette.style({
            'top': `${__palette.startY + DRAG.moveY}px`,
            'left': `${__palette.startX + DRAG.moveX}px`
          });
        },
        end: (DRAG, event) => {},
      }
    });

    __palette.reset = () => {
      colorReset();
      sizeReset();
      colors[0].on();
      sizes[0].on();
      __palette.style({'top': ``, 'left': ``});
    }

    return __palette;
  }

  class Draw {
    constructor(opts) {
      this.binding();

      this.drawingMode = true;

      this.init(opts);
    }

    binding() {
      this.setStateColor = this.setStateColor.bind(this);
      this.setStateSize = this.setStateSize.bind(this);
      this.setStatePen = this.setStatePen.bind(this);
      this.canvasAllClear = this.canvasAllClear.bind(this);
    }

    get currentCanvases() { return this.canvases.filter((canvas) => canvas.index === this.index); }
    get zoomRate() { return $ic.getZoomRate(this.container.DOM); }

    set color(__code) { this.__color = __code; }
    get color() { return this.__color; }
    set size(__value) { this.__size = __value; }
    get size() { return this.__size; }
    set alpha(__value) { this.__alpha = __value; }
    get alpha() { return this.__alpha; }

    reset() {
      this.index = this.buttons[0].index;
      this.alpha = 1;
      this.buttons.forEach((button) => button.reset());
      this.palette.reset();
      this.palette.off(TEXT_SHOW);
      this.currentCanvases.forEach((canvas) => canvas.reset());
    }

    retry() {
      this.index = 1;
      this.alpha = 1;
      this.palette.reset();
      this.currentCanvases.forEach((canvas) => canvas.reset());
      if (this.isStartedDrawing) this.currentCanvases.forEach((canvas) => canvas.on(TEXT_ACTIVE));
    }

    setStateColor(__code) { this.color = __code; }
    setStateSize(__size) { this.size = __size; }
    setStatePen(__type) { 
      this.drawType = __type;
      if (__type === 'pen') this.alpha = 1;
      else this.alpha = 0.3;
    }

    canvasAllClear() {
      this.canvases.forEach((canvas) => canvas.clear());
    }

    init({container, name, canvases, buttons, palette}) {
      this.index = 1;
      this.alpha = 1;
      this.name = name;
      this.container = container;
      
      this.buttons = buttons.map((button) => {
        button.index = button.data('index')-0;
        button.hover();
        button.event(DOWN_EVENT, () => {
          this.isStartedDrawing = true;
          this.index = button.index;
          this.currentCanvases.forEach((canvas) => {
            canvas.reset();
            canvas.on(TEXT_ACTIVE);
          });
          palette.on(TEXT_SHOW);
          button.on(TEXT_HIDE);
        });
        button.reset = () => {
          if (this.isStartedDrawing) this.isStartedDrawing = false;
          button.off(TEXT_HIDE);
          this.currentCanvases.forEach((canvas) => canvas.off(TEXT_ACTIVE));
          this.currentCanvases.forEach((canvas) => canvas.reset());
        }
        return button;
      });

      // 버튼 index가 1이 아닌 경우가 있어서 추가함
      this.index = this.buttons[0].index;
      
      // this.setPalette(palette);
      this.palette = setStatePalette(palette, this);
      this.palette.reset();
      
      this.canvases = canvases.map((canvas) => {
        setCanvas(canvas, this);
        return canvas;
      });
    }
  }

  window.Draw = Draw;

})();