const NEW_DATE = new Date();
const year = NEW_DATE.getFullYear();
const month = NEW_DATE.getMonth() + 1
const date = NEW_DATE.getDate()
const day = NEW_DATE.getDay()
const hours = NEW_DATE.getHours()
const minutes = NEW_DATE.getMinutes()

const dayArr = ['일', '월', '화', '수', '목', '금', '토']
const clock = document.querySelector('.header .clock')
clock.innerHTML = `${month}월 ${date}일 ${dayArr[day]}요일 ${hours}시 ${minutes}분`