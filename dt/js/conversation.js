$(function () {
  const talkBtn = document.querySelector('.anitalkBtn');
  const targetAudio = Array.from(document.querySelectorAll('audio'));

  //오디오 상태
  let stopAudio = false;

  //캔버스
  const canvas = Array.from(document.querySelectorAll('.imgCanvas')).map(
    (el) => el
  );

  //캔버스 화면 변환 이미지
  const spreadImg = new Image();
  spreadImg.src = './images/page028/clear.png';
  // 변환 위치, 속도, 상태
  let width = 0;
  let speed = 10;
  let flag = false;

  //캔버스 기본 이미지
  const backgroundImg = new Image();

  backgroundImg.src = './images/page028/28_pic01_g.png';

  const context = Array.from(canvas).map((item) => {
    item.style.backgroundSize = '100% 100%';
    return item.getContext('2d');
  });

  $(window).on('load', function () {
    resetCanvas();
  });

  function resetCanvas() {
    width = 0;
    // speed = 25;
    context[0].clearRect(0, 0, 677, 573.5);
    context[0].globalCompositeOperation = 'source-over';
    context[0].drawImage(backgroundImg, 0, 0, 677, 573.5);
  }
  let playCount = 0; // 영상 갯수
  function init() {
    if ($('.aniStopBtn').css('display', 'none')) {
      $('.aniStopBtn').show();
      $('.anitalkBtn').hide();
    }

    playCount = 0;
    targetAudio.forEach((item) => {
      item.pause();
      item.currentTime = 0;
    });

    flag = true;
    stopAudio = true;
    cancelAnimationFrame(testAnimation);
    resetCanvas();
    diffusion(canvas[playCount], playCount);
    animationStart(playCount);
  }

  const animationStart = (playCount) => {
    if (!targetAudio[playCount]) {
      talkBtn.classList.remove('sMotion');
      return;
    }

    targetAudio[playCount].play();
  };

  for (var i = 0; i < targetAudio.length; i++) {
    targetAudio[i].addEventListener('ended', () => {
      ++playCount;
      if (targetAudio.length >= playCount) {
        flag = true;
        cancelAnimationFrame(testAnimation);
        width = 0;
        diffusion(canvas[playCount], playCount);
        animationStart(playCount);
      }
      stopAudio = false;
    });
    targetAudio[i].addEventListener('playing', (e) => {
      $(
        '.aniStopBtn, .videoBtn, .exviewBtn, .cleanupBtn, .learningBtn, .utilizeBtn, .gotosubBtn, .gotothinkBtn, .popupOpen1, .popupOpen2, .studyBtn, .addBtn, .clickBtn, .supreiBtn, .goTolabBtn,.drawBtn, .arrowLeft, .arrowRight'
      ).on('click', animationStop);
      // wrap.addEventListener('click', animationStop);
    });
  }

  const animationStop = (e) => {

    if ($('.anitalkBtn').css('display', 'none')) {
      $('.anitalkBtn').show();
      $('.aniStopBtn').hide();
    }

    if (!e.target.classList.contains('anitalkBtn')) {
      targetAudio.forEach((item) => {
        item.pause();
        item.currentTime = 0;
        cancelAnimationFrame(testAnimation);
        width = 0;
        stopAudio = false;
        resetCanvas();
        talkBtn.classList.remove('sMotion');
      });
    }
  };
  let testAnimation;

  function diffusion(canvas, playCount) {
    if (flag) {
      if (canvas == undefined) return;
      flag = false;

      context[playCount].globalCompositeOperation = 'destination-out';
      window.requestAnimationFrame(draw);

      function draw() {
        //오디오 끝났을때
        // if (!stopAudio) {
        //   // diffusion(canvas, playCount);
        //   // resetCanvas();
        //   return;
        // }
        width += speed;
        let x = canvas.offsetWidth / 2;
        let y = canvas.offsetHeight / 2;
        context[playCount].drawImage(
          spreadImg,
          x - width / 2,
          y - width / 2,
          width,
          width
        );

        testAnimation = window.requestAnimationFrame(draw);
      }
    }
  }

  talkBtn.addEventListener('click', init);
});