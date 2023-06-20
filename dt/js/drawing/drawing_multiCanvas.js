$(function () {
    var canvasList = $("canvas").filter("[data-role='drawing']");

    $(canvasList).each(function (index, canvas) {
        canvas.isDisable = true;
    });
    
    if(typeof parent.DETECTMOBILEBROWSER == "undefined") {
        detect();
    }
    parent.DETECT_IS_RT = parent.DETECT_IS_RT ? parent.DETECT_IS_RT : false; 
    
    $.fn.extend({
        DRAWING_INIT: function() {
            var canvas = this;
            var elm = canvas.get(0);
            var ctx = elm.getContext("2d");
            var id = canvas.attr("id");
            
            elm.isDisable = false;

            $(canvasList).each(function(index, canvas) {
                canvas.isDisable = false;
            });

            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.lineWidth = canvas.attr("data-lineWidth");
            ctx.strokeStyle = canvas.attr("data-strokeStyle");

            bindEvent.call(canvas);

        },
        DRAWING: function() {
            startDraw.call(this);
        },
        DRAWING_ERASER: function() {
            eraserDraw.call(this);
        },
        DRAWING_DELETE: function() {
            deleteDraw.call(this);
        },
        DRAWING_STOP: function() {
            stopDraw.call(this);
        },
        DRAWING_HIDE: function() {
            hideDraw.call(this);
        },
        DRAWING_LINEWIDTH: function(lineWidth) {
            var canvas = this;
            var elm = canvas.get(0);
            var ctx = elm.getContext("2d");          
            ctx.lineWidth = lineWidth; 

            $(canvasList).each(function(index, canvas) {
                var context = canvas.getContext("2d");        
                context.lineWidth = lineWidth;
            });
        },
        DRAWING_LINECOLOR: function(color) {
            var canvas = this;
            var elm = canvas.get(0);
            var ctx = elm.getContext("2d");        
            ctx.strokeStyle = color;

            $(canvasList).each(function(index, canvas) {
                var context = canvas.getContext("2d");        
                context.strokeStyle = color;
            });
        },
        DRAWING_INFO: function() {
            var canvas = this;
            var elm = canvas.get(0);
            var ctx = elm.getContext("2d");   
            return {
               strokeStyle : ctx.strokeStyle,
               lineWidth : ctx.lineWidth,
               isDisable : elm.isDisable
            }   
        }
    });
    var bindEvent = function() {
        var canvas = this;
        if (parent.DETECTMOBILEBROWSER === "pc") {
            if (parent.DETECT_IS_RT) {
                canvas.css({
                    "touch-action": "none"
                });
                eventListener_drawing_RT.call(canvas);
            } else {
                eventListener.call(canvas);
            }
        } else {
            eventListener_drawing_mobile.call(canvas);
        }
    }
    var eventListener = function() {
        var canvas = this;
        canvas.on("mousedown mouseover mouseout mousemove", setupDrawPc);
    };
    var eventListener_drawing_mobile = function() {
        var canvas = this;
        canvas.on("touchstart", drawing_touchstart);
        canvas.on("touchmove", drawing_touchmove);
        canvas.on("touchend", drawing_touchend);
        canvas.on("touchcancel", drawing_touchcancel);
    };
    var eventListener_drawing_RT = function() {
        var canvas = this;
        canvas.get(0).addEventListener("pointerdown", setupDrawRT);
        canvas.get(0).addEventListener("pointermove", setupDrawRT);
        //canvas.get(0).addEventListener("pointerup", setupDrawRT);
        canvas.get(0).addEventListener("pointerover", setupDrawRT);
        canvas.get(0).addEventListener("pointerout", setupDrawRT);
    };
    var setupDrawRT = function(e) {
        var elm = this;
        if(elm.isDisable) return;
        
        var rect = elm.getBoundingClientRect();
        var zoom = getZoomRate(elm);

        var coordinates = {
            x: Math.round((e.clientX - rect.left)/zoom),
            y: Math.round((e.clientY- rect.top)/zoom)
        };
        if(e.pointerType == 'mouse') {
            if(e.buttons != 1) {
                drawRT.isDrawing = false;
            }
        }
        if(drawRT[e.type]) {
            drawRT[e.type](elm, coordinates);
        }
    };
    var drawRT = {
        pointerdown: function(elm, coordinates) {
            elm.isDrawing = true;
            elm.isOut = false;
            var ctx = elm.getContext("2d");
            ctx.beginPath();

            ctx.moveTo(
                Math.round(coordinates.x), 
                Math.round(coordinates.y)
            );

            var pointerup = function() {
                $("body").css({
                    "-webkit-user-select": "auto",
                    "-moz-user-select": "auto",
                    "-ms-user-select": "auto",
                    "user-select": "auto"
                });
                drawRT["pointerup"](elm);
            }
            $("body").css({
                "-webkit-user-select": "none",
                "-moz-user-select": "none",
                "-ms-user-select": "none",
                "user-select": "none"
            });
            $("body").get(0).addEventListener("pointerup", pointerup);

            elm.parentElement.classList.add('hideText');
        },
        pointermove: function(elm, coordinates) {
            if (elm.isDrawing && !elm.isOut) {
                var ctx = elm.getContext("2d");

                ctx.lineTo(
                    Math.round(coordinates.x), 
                    Math.round(coordinates.y)
                );

                ctx.stroke();
            }
        },
        pointerup: function(elm, coordinates) {
            elm.isDrawing = false;
            var canvas = $(elm);
            var ctx = elm.getContext("2d");
            ctx.closePath();
            ctx.save();
        },
        pointerout: function(elm, coordinates) {
            if (elm.isDrawing) {
                drawRT["pointermove"](elm, coordinates);
                elm.isOut = true;
            }
            var canvas = $(elm);
            var ctx = elm.getContext("2d");
            ctx.closePath();
            ctx.save();
        },
        pointerover: function(elm, coordinates) {
            if (elm.isDrawing) {
                drawRT["pointerdown"](elm, coordinates);
            }
        },
    };
    var setupDrawPc = function(e) {
        var elm = this;
        if(elm.isDisable) return;
        
        var coordinates = {
            x: Math.round(e.offsetX),
            y: Math.round(e.offsetY)
        };
        
        var type = e.type;
        
        if(e.buttons != 1) {
            draw.isDrawing = false;
        }
        if(draw[e.type]) {
            draw[e.type](elm, coordinates);
        }
    };
    var draw = {
        mousedown: function(elm, coordinates) {
            elm.isDrawing = true;
            elm.isOut = false;
            var ctx = elm.getContext("2d");
            ctx.beginPath();
            
            ctx.moveTo(
                Math.round(coordinates.x), 
                Math.round(coordinates.y)
            );
            var mouseup = function() {
                $("body").css({
                    "-webkit-user-select": "auto",
                    "-moz-user-select": "auto",
                    "-ms-user-select": "auto",
                    "user-select": "auto"
                });
                draw["mouseup"](elm);
            }
            $("body").css({
                "-webkit-user-select": "none",
                "-moz-user-select": "none",
                "-ms-user-select": "none",
                "user-select": "none"
            });
            $("body").on("mouseup", mouseup);

            elm.parentElement.classList.add('hideText');
        },
        mousemove: function(elm, coordinates) {
            if (elm.isDrawing && !elm.isOut) {
                var ctx = elm.getContext("2d");

                ctx.lineTo(
                    Math.round(coordinates.x), 
                    Math.round(coordinates.y)
                );

                ctx.stroke();
            }
        },
        mouseup: function(elm, coordinates) {
            elm.isDrawing = false;
            var canvas = $(elm);
            var ctx = elm.getContext("2d");
            ctx.closePath();
            ctx.save();
        },
        mouseout: function(elm, coordinates) {
            console.log("mouseout");
            if (elm.isDrawing) {
                draw["mousemove"](elm, coordinates);
                elm.isOut = true;
            }
            var canvas = $(elm);
            var ctx = elm.getContext("2d");
            ctx.closePath();
            ctx.save();
        },
        mouseover: function(elm, coordinates) {
            console.log("mouseover");
            if (elm.isDrawing) {
                draw["mousedown"](elm, coordinates);
            }
        },
    };
    
    function drawing_touchstart(event) {
        var elm = this;
        if(elm.isDisable) return;
        var ctx = elm.getContext("2d");
        var touch = event.touches[0];
        var rect = elm.getBoundingClientRect();

        ctx.imageSmoothingEnabled = false;
        
        ctx.beginPath();

        var zoom = parent.ZOOMVALUE ? parent.ZOOMVALUE : 1;

        ctx.moveTo(
            Math.round((touch.clientX - rect.left)/zoom), 
            Math.round((touch.clientY - rect.top)/zoom)
        );
        event.preventDefault();
        return false;
    }
    function drawing_touchmove(event) {
        var elm = this;
        if(elm.isDisable) return;
        var ctx = elm.getContext("2d");
        var touch = event.touches[0];

        var rect = elm.getBoundingClientRect();
        var zoom = parent.ZOOMVALUE ? parent.ZOOMVALUE : 1;

        ctx.lineTo(
            Math.round((touch.clientX - rect.left)/zoom), 
            Math.round((touch.clientY - rect.top)/zoom)
        );

        ctx.stroke();
        event.preventDefault();
        return false;
    }
    function drawing_touchend(event) {
        var elm = this;
        if(elm.isDisable) return;
        var ctx = elm.getContext("2d");
        ctx.closePath();
        ctx.save();
    }
    function drawing_touchcancel(event) {
        var elm = this;
        if(elm.isDisable) return;
        var ctx = elm.getContext("2d");
        ctx.closePath();
        ctx.save();
    }
    var startDraw = function() {
        $(canvasList).each(function(index, canvas) {
            var ctx = $(canvas).get(0).getContext("2d");  
        
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.globalCompositeOperation = "source-over";
            ctx.save();
            ctx.restore();
            
            canvas.isDisable = false;
            $(canvas).css('visibility', 'visible');
        });

    };
    function eraserDraw(data) {
        $(canvasList).each(function(index, canvas) {
            var ctx = $(canvas).get(0).getContext("2d"); 
            ctx.globalCompositeOperation  = "destination-out";
        });
    }
    function deleteDraw() {
        $(canvasList).each(function(index, canvas) {
            var ctx = $(canvas).get(0).getContext("2d"); 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();

            canvas.parentElement.classList.remove('hideText');
        });
        
    }
    function stopDraw() {
        $(canvasList).each(function(index, canvas) {
            canvas.isDisable = true;
        });
    }
    function hideDraw() {
        canvas.css('visibility', 'hidden');
        $(canvasList).each(function(index, canvas) {
            $(canvas).css('visibility', 'hidden');
        });
    }

    for(var i=0; i < canvasList.length; i++) {
        canvasList.eq(i).DRAWING_INIT();    
    }

    $('.drawbtn_pencolor').on(clickEvent,function(){console.log('?')
        $('.colorTool').toggle();
        $('.strokeSize').hide();
    });	
    $('.drawbtn_stop').on(clickEvent,function(){
        $('.colorTool').hide();
        $('.strokeSize').hide();
    });	
    $('.drawBtn_size').on(clickEvent,function(){
        $('.strokeSize').toggle();
        $('.colorTool').hide();
    });	

    $('#optionContener .colorTool > .color > li').each(function(a, b) {
        $(b).on(clickEvent, function() {
            var code = this.getAttribute('data-code');
            $('.drawbtn_pencolor').css({background: code});

            for(var i=0; i < canvasList.length; i++) {
                var ctx = canvasList.eq(i).get(0).getContext("2d");
                ctx.strokeStyle = code;  
            }
        });
    });
});
function detect() {
    var ua = navigator.userAgent;

    if (/lgtelecom/i.test(ua) || /Android/i.test(ua) || /blackberry/i.test(ua) || /iPhone/i.test(ua) || /iPad/i.test(ua) || /samsung/i.test(ua) || /symbian/i.test(ua) || /sony/i.test(ua) || /SCH-/i.test(ua) || /SPH-/i.test(ua) || /nokia/i.test(ua) || /bada/i.test(ua) || /semc/i.test(ua) || /IEMobile/i.test(ua) || /Mobile/i.test(ua) || /PPC/i.test(ua) || /Windows CE/i.test(ua) || /Windows Phone/i.test(ua) || /webOS/i.test(ua) || /Opera Mini/i.test(ua) || /Opera Mobi/i.test(ua) || /POLARIS/i.test(ua) || /SonyEricsson/i.test(ua) || /symbos/i.test(ua)) {
        parent.DETECTMOBILEBROWSER = "mobile";
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
            }
        };
        if (isMobile.iOS()) {
            parent.DETECTMOBILEBROWSER = "iOS";
        } else if (isMobile.Android()) {
            parent.DETECTMOBILEBROWSER = "Android";
        }
    } else {
        parent.DETECTMOBILEBROWSER = "pc";
    }
}

function inViewer() {
    return parent.parent.GO_PAGE_LOAD || parent.GO_PAGE_LOAD;
}

function getZoomRate(DOM) {
    return inViewer() ? parent.ZOOMVALUE : DOM.getBoundingClientRect().width / DOM.offsetWidth;
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
  const getElementFromPoint = (event) => {
    return document.elementFromPoint(getEventPosition(event).x, getEventPosition(event).y);
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
  function setEvent(target, eType, callback, listenertype = 'add') {
    const eventTypeArray = eType.split(' ');
    eventTypeArray.forEach((type) => {
      if (listenertype === 'add') target.addEventListener(type, callback);
      else target.removeEventListener(type, callback);
    });
  }

  const callback_start = callback.start;
  const callback_move = callback.move;
  const callback_end = callback.end;
  
  let zoomRate = getZoomRate(dragObj);
  window.addEventListener('resize', () => {
    zoomRate = getZoomRate(dragObj);
  });
  
  let targetLeft, targetTop, startX, startY, moveX, moveY;

  const DRAG = {
    zoomRate: zoomRate,
    endX: 0,
    endY: 0
  };
  
  const startDrag = (event) => {
    event.stopPropagation();

    setOffsetData(dragObj);
    zoomRate = getZoomRate(dragObj);
    DRAG.zoomRate = zoomRate;

    targetLeft = dragObj.left;
    targetTop = dragObj.top;
    startX = getEventPosition(event).x;
    startY = getEventPosition(event).y;

    DRAG.startPointer = {
      x: startX,
      y: startY
    }
    
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

    DRAG.endX = DRAG.moveX;
    DRAG.endY = DRAG.moveY;

    removeEventContainer();

    if (callback_end) callback_end(DRAG);
  }

  const addEventContainer = () => {
    setEvent(container, 'mousemove touchmove', moveDrag);
    setEvent(container, 'mouseup touchend', endDrag);
  }

  const removeEventContainer = () => {
    setEvent(container, 'mousemove touchmove', moveDrag, false);
    setEvent(container, 'mouseup touchend', endDrag, false);
  }

  setEvent(dragObj, 'mousedown touchstart', startDrag);
}

window.addEventListener('load', () => {
	function getContainerSize(__container) {
		return  {
			width: __container.offsetWidth,
			height: __container.offsetHeight,
		}
	}
	// test
	// initScale(document.body);


	const container = document.querySelector('#contents') || document.querySelector('#container');
	const canvasContainer = document.querySelector('.canvasContainer');
	// const colorTool = canvasContainer.querySelector('.colorTool');
	// const strokeSize = canvasContainer.querySelector('.strokeSize');
	const optionContainer = document.querySelector('#optionContener');
	const dragButton = optionContainer.querySelector('.drawbtn_move');
	let documentSize = getContainerSize(container);

	const position = {x: 0, y: 0};
	const maxValue = {};

	let canvasWidth;
	let canvasHeight;
	let zoomRate;

	canvasContainer.style.zIndex = 10;

	initDrag({
		dragObj: dragButton,
		callback: {
			start: (DRAG) => {
				zoomRate = getZoomRate(optionContainer);

				canvasWidth = optionContainer.offsetWidth;
				canvasHeight = optionContainer.offsetHeight;
				
				position.x = optionContainer.offsetLeft;
				position.y = optionContainer.offsetTop;

				const containerY = container.offsetTop / zoomRate;
				const containerX = container.offsetLeft / zoomRate;
				
				maxValue.top = -optionContainer.getBoundingClientRect().top / zoomRate + containerY;
				maxValue.left = -optionContainer.getBoundingClientRect().left / zoomRate + containerX;
				maxValue.right = (documentSize.width + maxValue.left) - canvasWidth;
				maxValue.bottom = (documentSize.height + maxValue.top) - canvasHeight;
				// console.log(documentSize)
			},
			move: (DRAG) => {
				if (DRAG.moveX < maxValue.left) DRAG.moveX = maxValue.left;
				if (DRAG.moveX > maxValue.right) DRAG.moveX = maxValue.right;
				if (DRAG.moveY < maxValue.top) DRAG.moveY = maxValue.top;
				if (DRAG.moveY > maxValue.bottom) DRAG.moveY = maxValue.bottom;
				
				const movePosition = {
					x: DRAG.moveX + position.x,
					y: DRAG.moveY + position.y
				}
				
				optionContainer.style.top = `${movePosition.y}px`;
				optionContainer.style.left = `${movePosition.x}px`;
				/* colorTool.style.top = `${movePosition.y + 137}px`;
				colorTool.style.left = `${movePosition.x + 43}px`;
				strokeSize.style.top = `${movePosition.y + 168}px`;
				strokeSize.style.left = `${movePosition.x + 43}px`; */
			},
			end: (DRAG) => {},
		}
	});

	document.addEventListener('mousemove', (e) => { e.stopPropagation(); });
	document.addEventListener('touchmove', (e) => { e.stopPropagation(); });

	window.addEventListener('resize', () => { documentSize = getContainerSize(container); });
});