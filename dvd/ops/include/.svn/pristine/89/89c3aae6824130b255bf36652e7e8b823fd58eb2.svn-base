(() => {
  const settime_i = [];
  const tabBox = document.querySelectorAll('.js-slideTab');
  const obj = document.querySelectorAll('.list');
  let idx = 0;

  function loadStart(motionNumber) {
    idx = 0;
    let mshow = obj[motionNumber].querySelectorAll('.mShow');
    for (var i = 0; i < mshow.length; i++) {
      settime_i[i] = setTimeout(function () {
        mshow[idx].classList.add('zoomIn');
        idx++;
      }, 800 * i);
    }
  }

  function reset() {
    let mshow = $('.mShow');
    for (var i = 0; i < mshow.length; i++) {
      clearTimeout(settime_i[i]);
    }

    $('.mShow').removeClass('zoomIn');
  }

  tabBox.forEach((item, index) => {
    tabBox[index].addEventListener('click', function () {
      reset(index);
      loadStart(index);
    });
  });

  loadStart(0);
})();
