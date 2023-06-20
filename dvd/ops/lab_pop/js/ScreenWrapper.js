var scaleV;

$(function(){

var popup_size = {w:"1280", h:"720"};

$("html").css("width","0");
$("html").css("height","0");
$("html").css("transform","scale(1)");
$('html').css("overflow","hidden");
$(".labCloseBtn").hide();


if( typeof popupWrapper === "undefined" || !popupWrapper) {
    var popupWrapper = {};
    popupWrapper.scale = 0;
    popupWrapper.old_w = 0;
    popupWrapper.old_h = 0;

    popupWrapper.resize = function() {
        var win_width = $( window ).width();
        var win_height = $( window ).height();

        var scale = 1;
        if(  win_width > win_height ) {
            if( (win_height / win_width) > ( popup_size.h / popup_size.w)  )
                scale =  win_width / popup_size.w;
            else scale = win_height / popup_size.h;
        }else {
            if( (win_height / win_width) > ( popup_size.h / popup_size.w)  )
                scale =  win_width / popup_size.w;
            else scale = win_height / popup_size.h;
        }   
  
        if(popupWrapper.old_w !== win_width||popupWrapper.old_h !==  win_height ) {
            var scale_top = ((  win_height -  popup_size.h*scale ) / 2)+1;
            var scale_left = ((  win_width -  popup_size.w*scale ) / 2)+1;
            popupWrapper.scale = scale;
            $( "#wrap" ).css( {
                "position": "fixed",
                "top": scale_top,
                "left": scale_left,
                "transform-origin": "0% 0%",
                "transform" : "scale(" + scale + ")",
                "overflow":"hidden"
            });
            popupWrapper.old_w = win_width;
            popupWrapper.old_h = win_height;
        }
        scaleV=scale;
    }
}

popupWrapper.init = function() {
    popupWrapper.resize();
    $( "#wrap" ).attr( "scroll", "no" );
    $( "#wrap" ).css({
        "overflow" : "hidden",
        "visibility" : "visible"
    });
    // setInterval(popupWrapper.resize , 500 );
}

popupWrapper.getScale = function() {
    return popupWrapper.scale;
}

$(document).ready(function(){
        popupWrapper.resize();

        $( window ).resize( function() {
            popupWrapper.resize();
        });

})
});