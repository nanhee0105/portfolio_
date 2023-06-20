// 포스트잇
$(function(){
  $(".subcont li").each(function(i){
    if (!$(".subcont li").eq(i).hasClass("postit")){
      var row = $(this);
      row.css({"opacity":"0"});
      setTimeout(function () {
          row.addClass("postit");
      }, 800*i);
    }  
  });
});



