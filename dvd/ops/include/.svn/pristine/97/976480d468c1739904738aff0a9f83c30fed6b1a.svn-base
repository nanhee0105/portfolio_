(()=>{


  start =  document.querySelector('.start')  //시작하기
  labReplayBtn = document.querySelector('.labReplayBtn') //다시하기
  labAnswer  = document.querySelector('.labAnswer') //정답보기
  resultBtn = document.querySelector('.resultBtn') //결과보기
  clickBtns  = document.querySelectorAll('.clickBtn') //클릭버튼


  function onEvent(event){
    event.target.classList.add('ON')
  }

  function offEvent(event){
    event.target.classList.remove('ON')
  }



  //시작하기
  // if(start != null){
  // start.addEventListener('mouseover',onEvent)
  // start.addEventListener('mouseout',onEvent)
  // }
  //다시하기
  if(labReplayBtn != null){
  labReplayBtn.addEventListener('mouseover',onEvent)
  labReplayBtn.addEventListener('mouseout',offEvent)
  }
  //정답보기
  if(labAnswer != null){
  labAnswer.addEventListener('mouseover',onEvent)
  labAnswer.addEventListener('mouseout',offEvent)
  }
  //결과보기
  if(resultBtn != null){
    resultBtn.addEventListener('mouseover',onEvent)
    resultBtn.addEventListener('mouseout',offEvent)
  }
  
  //클릭버튼 
  if(clickBtns != null)
  clickBtns.forEach(clickBtn=>{
    clickBtn.addEventListener('mouseover',onEvent)
    clickBtn.addEventListener('mouseout',offEvent)
  })
})()