const API_KEY = "a40db52985be6fcd12f142c9eb96e026";

function onGeoOk(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    fetch(url).then(response => response.json()).then(data => {
        console.log(data)
       const city = document.querySelector('.weather span:nth-of-type(1)')
       const city_weather = document.querySelector('.weather span:nth-of-type(2)')
       const city_temp = document.querySelector('.weather span:nth-of-type(3)')

        const name = data.name;
        const weather = data.weather[0].main
        const temp = data.main.temp
        city.innerHTML = name
        city_weather.innerHTML = weather
        city_temp.innerHTML = temp + "°"
    })
}
function onGeoError(){
    alert("위치 찾기 실패")
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError)