$(function () {
    $(window).on('load', function(){
        // for( var i = 0; i < $('.tab_tab_content').eq(0).find(".tab_tab_con_02").eq(0).find('video').length; i++){
        //     $('.tab_tab_content').eq(0).find(".tab_tab_con_02").eq(0).find('video').eq(i).get(0).play();
        // };
    });

    $(".tabintab .tabTitle li").on(clickEvent, function () {
        allVideoStop();
        var idx = $(this).index();
        $(".tabintab .tabTitle li").removeClass("selected");
        $(".tabintab .tabTitle li").eq(idx).addClass("selected");
        $(".tabintab .tabContent > div").hide();
        $(".tabintab .tabContent > div").eq(idx).show();

        if(idx == 0 ){
            $(".secTabtitle li").removeClass("selected");
            $(".secTabtitle li").eq(0).addClass("selected");
            $(".secTabContent > div").hide();
            $(".secTabContent > div").eq(0).show();
        }else{
            $(".trdTabtitle li").removeClass("selected");
            $(".trdTabtitle li").eq(0).addClass("selected");
            $(".trdTabContent > div").hide();
            $(".trdTabContent > div").eq(0).show();
        }
        
        //$(".tabintab .tabContent > div").eq(idx).find('video').get(0).play();

        //   for( var i = 0; i < $(".tabintab .tabContent > div").eq(idx).find('video').length; i++){
        //       $(".tabintab .tabContent > div").eq(idx).find('video').eq(i).get(0).play();
        //   };

     
    });

    $(".clickBtn").on(clickEvent, function () {
        var idx = $(this).data("id");
        $(this).parent().parent().parent().find('video').eq(idx-1).get(0).play();
      
    });

    // 탭
    $(".secTabtitle li").on(clickEvent, function () {
        //allVideoStop();
        var idx = $(this).index();
        $(".secTabtitle li").removeClass("selected");
        $(".secTabtitle li").eq(idx).addClass("selected");
        $(".secTabContent > div").hide();
        $(".secTabContent > div").eq(idx).show();
       
        //$(".secTabContent > div").eq(idx).find('video').get(0).play();

        // for( var i = 0; i < $(".secTabContent > div").eq(idx).find('video').length; i++){
        //     $(".secTabContent > div").eq(idx).find('video').eq(i).get(0).play();
        // };
    });
    // 탭

    $(".trdTabtitle li").on(clickEvent, function () {
       // allVideoStop();
        var idx = $(this).index();
        $(".trdTabtitle li").removeClass("selected");
        $(".trdTabtitle li").eq(idx).addClass("selected");
        $(".trdTabContent > div").hide();
        $(".trdTabContent > div").eq(idx).show();

        // $(".trdTabContent > div").eq(idx).find('video').get(0).play();

        // for( var i = 0; i < $(".trdTabContent > div").eq(idx).find('video').length; i++){
        //     $(".trdTabContent > div").eq(idx).find('video').eq(i).get(0).play();
        // };
    });

    $('.autoPlay').on(clickEvent, function(){
        $('.tab_tab_con_04 p video').get(0).play()
    });
    // 탭

    function allVideoStop(){
        for( var i = 0; i < $('video').length; i++){
            $('video').eq(i).get(0).pause();
            $('video').eq(i).get(0).currentTime = 0;
        };
    };
    
}); //end
