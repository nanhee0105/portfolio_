
$(document).ready(function() {
    $(".nav>li>ul").css({"position":"relative","z-index":"10"});
    $(".nav li").hover(function() {
        $(this).find("ul").stop().slideDown();
    }, function() {
        $(this).find("ul").stop().slideUp();
    });
});