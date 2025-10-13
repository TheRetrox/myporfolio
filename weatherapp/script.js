      // Date display
let Pdate = document.querySelector('#p-date');
const today = new Date();
const month = today.getMonth();
const day = today.getDay();
const date = today.getDate();

const months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

Pdate.innerText = `${dayNames[day]}, ${date} ${months[month + 1]}`;

// API fetch 
let myInput = document.querySelector(".con-1-search");
let a = "Ny";

document.addEventListener('keydown', event => {
    if (event.key == "Enter") {
        getVal();
    }
});

let mainDih = document.querySelector(".con-2");
let sDih = document.querySelector(".con-img");
let load = document.querySelector(".loading-c");
let errShow = document.querySelector(".err");

function getVal() {
    a = myInput.value.trim();
    if (a) {
        console.log(a);
        getWvalue();
        loadIng();
    }
}

function displayTrue() {
    mainDih.style.display = "grid";
    sDih.style.display = "none";
    load.style.display = "none";
    errShow.style.display = "none";

    // Add background change based on weather condition
    updateBackground();
}

function loadIng() {
    sDih.style.display = "none";
    mainDih.style.display = "none";
    load.style.display = "block";
    errShow.style.display = "none";
}

function err() {
    errShow.style.display = "block";
    mainDih.style.display = "none";
    sDih.style.display = "none";
    load.style.display = "none";
}

// UI show
let temperature = document.querySelector("#t-id");
let windSpeed = document.querySelector("#w-id");
let loca = document.querySelector("#l-id");
let wImg = document.querySelector("#w-img");

function getWvalue() {
    let api = fetch("https://goweather.herokuapp.com/weather/" + a);

    api.then((value1) => {
        let apiStatus = value1.ok;
        console.log(apiStatus);

        if (apiStatus == true) {
            displayTrue();
        }
        if (apiStatus == false) {
            err();
        }
        return value1.json();
    }).then((value2) => {
        let wind = value2.wind;
        let temp = value2.temperature;
        let descri = value2.description;
        console.log(wind);
        console.log(temp);
        console.log(descri);

        temperature.innerText = temp;
        windSpeed.innerText = wind;
        loca.innerText = a;

        // Weather image change conditions 
        if (descri === "Clear") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/6974/6974833.png')";
        }
        if (descri === "Sunny") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/6974/6974833.png')";
        }
        if (descri === "Partly cloudy") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/414/414927.png')";
        }
        if (descri === "Moderate or heavy rain shower") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/3351/3351979.png')";
        }
        if (descri === "Patchy rain nearby") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/3076/3076129.png')";
        }
        if (descri === "Light rain with thunderstorm") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/1146/1146860.png')";
        }
        if (descri === "Thunderstorm, rain") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/1146/1146860.png')";
        }
        if (descri === "Light rain shower") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/3076/3076129.png')";
        }
        if (descri === "Light drizzle") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/3076/3076129.png')";
        }
        if (descri === "Light rain, mist") {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/3076/3076129.png')";
        } else {
            wImg.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/414/414927.png')";
        }

        return console.log(value2);
    });
}

// Function to update background based on weather condition
function updateBackground() {
    const body = document.querySelector('body');
    const weatherText = document.querySelector('#t-id').innerText.toLowerCase();
    const descri = document.querySelector('#w-img').style.backgroundImage;

    // Remove existing weather classes
    body.classList.remove('weather-clear', 'weather-cloudy', 'weather-rainy', 'weather-stormy');

    // Add appropriate class based on weather description
    if (descri.includes('clear') || descri.includes('sunny')) {
        body.classList.add('weather-clear');
    } else if (descri.includes('rain') || descri.includes('drizzle')) {
        body.classList.add('weather-rainy');
    } else if (descri.includes('storm') || descri.includes('thunder')) {
        body.classList.add('weather-stormy');
    } else {
        body.classList.add('weather-cloudy');
    }
}