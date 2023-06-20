$(function(){
    $(".help").show();
    
    var timeId = setTimeout(function(){
    $(".help").fadeOut();
    $(".help_start").fadeIn();
    $(".help_box1").fadeIn();
    $(".help_box2").delay(6000).fadeIn();
    $('.help_start_text, .hands').delay(1000).fadeIn()
    },4500);

    setTimeout(function(){
      $(".help_start, .start").hide();
    },17000)
    
    //설명 닫기
    $(".start").on("click",function(){
      $(this).hide();
      if (timeId) {
        clearTimeout(timeId);
        $('.help').fadeOut();
      }
      $('.help_start').fadeOut();
      $('.start').hide();
    });

    const itemTarget = document.querySelectorAll('[data-drag]'); // 아이템 선택
    const contents = document.querySelector('#wrap'); // 드래그 범위
  
  
    const item = {
      DOM: '',
      itemX: '',
      itemY: '',
    };
  
    const startValue = {
      startX: '',
      startY: '',
      zoom: '',
    };
    const getEventPosition = (event) => {
      const eventTarget = isTouchEvent(event)
        ? event.changedTouches[0] || event.touches[0]
        : event;
  
      return {
        x: eventTarget.clientX,
        y: eventTarget.clientY,
      };
    };
  
    const isTouchEvent = (event) => {
      return event.type.indexOf('touch') > -1;
    };
  
    function getZoomRate(target) {
      return parent.GO_PAGE_LOAD
        ? parent.ZOOMVALUE
        : target.getBoundingClientRect().width / target.offsetWidth;
    }
  
    function blockedViewerSlide(e) {
      e.stopPropagation();
    }
  
    // 웹뷰 드래그 취소
    function dragMoveStop() {
      contents.addEventListener('mousemove', blockedViewerSlide);
      contents.addEventListener('touchmove', blockedViewerSlide);
    }
  
    // 웹뷰 드래그 가능
    function dragMoveResume() {
      contents.removeEventListener('mousemove', blockedViewerSlide);
      contents.removeEventListener('touchmove', blockedViewerSlide);
    }
  
    function startDrag(event) {
      getEventPosition(event);
  
      item.DOM = this;
      item.itemX = this.offsetLeft;
      item.itemY = this.offsetTop;
  
      startValue.startX = getEventPosition(event).x;
      startValue.startY = getEventPosition(event).y;
      startValue.zoom = getZoomRate(this);
  
      contents.addEventListener('mousemove', moveDrag);
      contents.addEventListener('touchmove', moveDrag);
      contents.addEventListener('mouseup', endDrag);
      contents.addEventListener('touchend', endDrag);
  
      dragMoveStop();
    }
  
    function moveDrag(event) {
      const eventX = getEventPosition(event).x;
      const eventY = getEventPosition(event).y;
  
      const moveX = (eventX - startValue.startX) / startValue.zoom;
      const moveY = (eventY - startValue.startY) / startValue.zoom;
  
      item.DOM.style.left = `${item.itemX + moveX}px`;
      item.DOM.style.top = `${item.itemY + moveY}px`;
    }
  
    let zoon1 = 0;
    let zoon2 = 0;

    function endDrag(event) {
      item.DOM.style.pointerEvents = 'none';
      const element = document.elementFromPoint(
        getEventPosition(event).x,
        getEventPosition(event).y
      );

      if (item.DOM.classList.value === element.classList.value && element.parentElement.classList.value == 'left') {
        item.DOM.style.display = 'none';
      


        if(item.DOM.classList.value == 'dropZoon1') {
          element.children[zoon1].firstElementChild.src = item.DOM.firstElementChild.src;
          element.children[zoon1].style.display = 'block'
          ++zoon1;

        }
        if(item.DOM.classList.value == 'dropZoon2') {
          element.children[zoon2].firstElementChild.src = item.DOM.firstElementChild.src;
          element.children[zoon2].style.display = 'block'
          ++zoon2;
        }

      } else {
        item.DOM.style.left = '';
        item.DOM.style.top = '';
        item.DOM.style.pointerEvents = 'auto';
      }

      if((zoon1 + zoon2) == 16){
        $('.labAnswer').hide();
      $('.labReplayBtn').show();

      }
  
      contents.removeEventListener('mousemove', moveDrag);
      contents.removeEventListener('touchmove', moveDrag);
      contents.removeEventListener('mouseup', endDrag);
      contents.removeEventListener('touchend', endDrag);
      dragMoveResume();
    }
  
    function reset() {
      $('.left .dropZoon1 div, .left .dropZoon2 div').css('display','');

      $('.right .dropZoon1, .right .dropZoon2').css('left','');
      $('.right .dropZoon1, .right .dropZoon2').css('top','');
      $('.right .dropZoon1, .right .dropZoon2').css('display','block')
      $('.right .dropZoon1, .right .dropZoon2').css('pointerEvents','auto')

     

      
      zoon1 = 0;
      zoon2 = 0;

      $('.labReplayBtn').hide();
      $('.labAnswer').show();
    }
  
    //드래그 시작
    itemTarget.forEach(item=>{
        item.addEventListener('mousedown', startDrag);
        item.addEventListener('touchstart ', startDrag);
    })
  
  
    //리셋
    $('.labReplayBtn').on('click', function () {
      reset();
      $('.lab_content .right div').css('opacity', 1);
      $('.lab_content .right div').css('pointerEvents','auto');
    });
    
    //정답보기
    $('.labAnswer').on('click',function(){

      $('.labAnswer').hide();
      $('.labReplayBtn').show();

      $('.left .dropZoon1 div img').eq(0).attr('src','images/30p_01.png')
      $('.left .dropZoon1 div img').eq(1).attr('src','images/30p_02.png')
      $('.left .dropZoon1 div img').eq(2).attr('src','images/30p_03.png')
      $('.left .dropZoon1 div img').eq(3).attr('src','images/30p_04.png')
      $('.left .dropZoon1 div img').eq(4).attr('src','images/30p_05.png')
      $('.left .dropZoon1 div img').eq(5).attr('src','images/30p_06.png')
      $('.left .dropZoon1 div img').eq(6).attr('src','images/30p_07.png')
      $('.left .dropZoon1 div img').eq(7).attr('src','images/30p_17.png')
      $('.left .dropZoon1 div img').eq(8).attr('src','images/30p_09.png')
      $('.left .dropZoon1 div img').eq(9).attr('src','images/30p_10.png')
      $('.left .dropZoon1 div img').eq(10).attr('src','images/30p_11.png')  
      $('.left .dropZoon1 div img').eq(11).attr('src','images/30p_18.png')
      
      
      $('.left .dropZoon2 div img').eq(0).attr('src','images/30p_12.png')
      $('.left .dropZoon2 div img').eq(1).attr('src','images/30p_13.png')
      $('.left .dropZoon2 div img').eq(2).attr('src','images/30p_14.png')
      $('.left .dropZoon2 div img').eq(3).attr('src','images/30p_15.png')

      $('.left .dropZoon1 div, .left .dropZoon2 div').css('display','block');
      $('.lab_content .right div').css('opacity', 0);
      $('.lab_content .right div').css('pointerEvents','none');

      
    })
   
});