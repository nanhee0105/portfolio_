$(function () {
  $('.clickBtn.serial').on('click', function () {
    $(this).hide();
    $(".imgSerial .imgWrap").each(function (i) {
      if (!$(".imgSerial .imgWrap").eq(i).hasClass("original")) {
        var row = $(this);
        setTimeout(function () {
          row.addClass("original");
        }, 1000 * i);
      }
    });
  }); //clickBtn click
}); //end