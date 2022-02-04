const api = {
    key: "7a5ec8533bc254c7626297182de75977",
    base: "https://api.openweathermap.org/data/2.5/"
}

function getLocation(lat, lon) {
    fetch(`${api.base}weather?lat=${lat}&lon=${lon}&appid=${api.key}`)
        .then(weather => {
            return weather.json();
        }).then(displayResults)
        .catch( error => toastAlert('error', 'Wrong city'));
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

const infoAction = document.querySelector('#info');
infoAction.addEventListener('click', () => {
    Swal.fire({
    title: '',
    html:
        `<br>Enter the name of the city in the text box and press enter to search <br>
        <br> You can enter the name of the city and state
        <br><br><b> Example</b>
        <br> <i> New York, New York</i><br><br>`
    })
});

function setQuery(evt) {
    if (evt.keyCode == 13) {
      getResults(searchbox.value);
    }
}

function getResults (query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        }).then(displayResults)
        .catch( error => toastAlert('error', 'Wrong city'));
}

function displayResults (weather) {

    periodoTiempo(weather.weather[0].icon);

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let city = document.querySelector('.location .city');
    city.innerHTML = `${weather.name}, ${weather.sys.country}`;
    

    let icon = document.querySelector('.current .icon');
    icon.setAttribute('src', `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather.weather[0].icon}.svg`);
    
    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)} °c`;
    
    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;
    
    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`;
}


function toastAlert (icon, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
      
    Toast.fire({
        icon: icon,
        title: title
    })
}

function periodoTiempo (tiempo) {
    const card = document.querySelector('.card');
    if (tiempo.includes('n')) {
        card.classList.remove('day');
        card.classList.add('night');
    } else if (tiempo.includes('d')) {
        card.classList.remove('night');
        card.classList.add('day');
    }
}

if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    toastAlert('error', 'Geolocation is not supported by this browser');
}
  
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getLocation(latitude, longitude);
}
  
function showError(error) {
    console.log('error');
}