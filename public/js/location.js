const iconElement = document.querySelector('.iconId');
const notificationElement = document.querySelector('.notification');

const api = {
    key: '8213c3432967a6f95cbb9c097e393f39',
    baseurl: 'https://api.openweathermap.org/data/2.5/',
};

// Check if Browser Supports Geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, error);
} else {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = "<p>Browser Doesn't Support Geolocation</p>";
}

// Get User Position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}
console.log(setPosition());
// Set error if any with geolocation
function error(err) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${err.message}</p>`;
}