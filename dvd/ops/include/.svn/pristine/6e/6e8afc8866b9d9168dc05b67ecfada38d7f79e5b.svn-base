(()=>{
  var settime_i=[];
  var obj;
  
    function loadStart(){
      var mshow = obj;
      var idx = 0;
    
      for( var i = 0; i < mshow.length; i++)
      {
        settime_i[i] = setTimeout(function(){
          obj.eq(idx).addClass('zoomIn');
          idx++;
        }, (800*i) )
    
      }  
  
  
     }
  
    function reset(){
      var mshow = obj;
      for( var i = 0; i < mshow.length; i++)
      {
      clearTimeout( settime_i[i] );
      }
  
      $('.loadMotion .mShow').removeClass('zoomIn');
    }
  
    //클릭
    $('.js-slideTab, .js-popupButton').on('click',function(){
      reset();
      loadStart();
    })
  
    // $('.js-slideTab').eq(1).on('click',function(){
    //   reset();
     
    //   obj = $('.sliceInner');
    //   loadStart();
    // })
  
    obj = $('.loadMotion .mShow');
    loadStart();
    
  })()