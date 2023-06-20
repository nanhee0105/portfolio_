$(function(){
    $('.talkBtn').on('click',function(){
        resetChar();
        $(this).css('margin-top','-10px');
        $(this).siblings('.balloon').addClass('dobira');
    });


    audio.addEventListener('ended', function () {
        resetChar()
      });

    audio.addEventListener('playing', function () {
        $('.videoBtn').one(clickEvent, function(){
            resetChar();
        })
      });

    function resetChar(){
        $('.talkBtn').css('margin-top','0');
        $('.balloon').removeClass('dobira');
    }
});