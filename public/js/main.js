const searchbox = document.querySelector('.search-box');
let iconElement = document.querySelector('.current .iconId');
let notificationElement = document.querySelector('.notification');
let city = document.querySelector('.location .city');
let date = document.querySelector('.location .date');
let temp = document.querySelector('.current .temp');
let weather_el = document.querySelector('.current .weather');
let hilow = document.querySelector('.hi-low');
let now = new Date();

searchbox.addEventListener('keypress', setQuery);

const api = {
    key: '8213c3432967a6f95cbb9c097e393f39',
    baseurl: 'https://api.openweathermap.org/data/2.5/',
}

function setQuery(event) {
    if (event.keyCode === 13) {
        getResults(searchbox.value);
    };
}

function getResults(query) {
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(weather => {
           return weather.json()
        }).then(displayResults);
}

function displayResults(weather) {
    console.log(weather.cod);
    if (weather.cod === '404') {
        notificationElement.style.display = 'block';
        notificationElement.innerHTML = `<p>${searchbox.value} not found, please check the spelling or the location name</p>`;
        // return notifi
    } else {
        notificationElement.style.display = 'none';
        city.innerText = `${weather.name}, ${weather.sys.country}`;
        date.innerText = dateBuilder(now);
        temp.innerHTML = `${Math.round(weather.main.temp)}<span>&#xba;C</span>`;
        weather_el.innerText = weather.weather[0].description;
        iconElement.innerHTML = `<img src="icons/${weather.weather[0].icon}.png" alt="" />`;
        hilow.innerHTML = `${weather.main.temp_min}<span>&#xba;c<span> / ${weather.main.temp_max}<span>&#xba;c</span>`;
    
        let localArray = [city.innerText, date.innerText, temp.innerHTML, weather_el.innerText, hilow.innerHTML, iconElement.innerHTML];
        localStorage.setItem(searchbox.value, localArray);

        // lastkey = key;
        localStorage.setItem('lastkey', searchbox.value);
    }
}

onload = () => {
    notificationElement.style.display = 'none';
    let key = localStorage.getItem('lastkey');
    if (key) {
        let getLocalKey = localStorage.getItem(key).split(',');
               
        city.innerText = getLocalKey[0] + ',' + getLocalKey[1];
    
        date.innerText = getLocalKey[2];

        temp.innerHTML = getLocalKey[3];

        iconElement.innerHTML = getLocalKey[6]

        weather_el.innerText = getLocalKey[4];

        hilow.innerHTML = getLocalKey[5];
    }
}

  
function dateBuilder(d) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
}