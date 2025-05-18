function showCountryContainer() {
    const banner = document.getElementById('infoBanner');
    banner.style.display = 'none';

    const countryContainer = document.getElementById('container');
    countryContainer.style.display = 'block';

    sessionStorage.setItem('bannerShown', 'true');
}

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('infoBanner');
    const countryContainer = document.getElementById('container');
    
    const bannerAlreadyShown = sessionStorage.getItem('bannerShown');

    if (bannerAlreadyShown) {
        banner.style.display = 'none';
        countryContainer.style.display = 'block';
    } else {
        banner.style.display = 'block';
        countryContainer.style.display = 'none';
    }

    const badge = document.getElementById('likedCountBadge');
    const likedCountries = JSON.parse(localStorage.getItem('likedCountries')) || [];
    const count = likedCountries.length;

    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
});

const search = document.getElementById('search')

const API_WEATHER = '418b95f1f028afc1a3c10087c1d8db0d'
const API_CURRENCY = '89abaa6266aaec8a5fee6ea5'
const PEXELS_API = 'vNAXdG3jksl9MDt7vGQTNYw4PYQdeDaIx9QXAni2bV1WD6U4qncJvkpA';

search.addEventListener('click', () => {
    document.getElementById('photos').innerHTML = '';
    const input = document.querySelector('input').value.trim();
    if (!input) {
        const messageContainer = document.getElementById('countryList');
        messageContainer.innerHTML = `
            <p class="countryNone col-12">
                <span class="alert-icon">⚠️</span>
                <strong>Будь ласка, введіть назву країни!</strong>
            </p>
            `;
            setTimeout(() => {
                const message = document.querySelector('.countryNone');
                if (message) {
                    message.style.display = 'none';
                }
                }, 3000);
        const likeButton = document.getElementById('likeButton');        
        likeButton.style.display = 'none';
        return;
    }

    const url = generateURL(input);
    fetchCountryData(url);
});

function generateURL() {
    const countryName = document.querySelector('input').value.trim()
    return `https://restcountries.com/v3.1/name/${countryName}`
}

let countryNames = [];

async function loadCountryNames() {
    try {
        const res = await fetch('https://restcountries.com/v3.1/all');
        const data = await res.json();
        countryNames = data.map(country => country.name.common).sort();
    } catch (error) {
        console.error('Помилка при завантаженні країн:', error);
    }
}
loadCountryNames();

const input = document.getElementById('countryInput');
const suggestions = document.getElementById('suggestions');

input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    suggestions.innerHTML = '';

    if (query.length === 0) return;

    const matched = countryNames.filter(name => name.toLowerCase().startsWith(query)).slice(0, 5);
    
    matched.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.addEventListener('click', () => {
            input.value = name;
            suggestions.innerHTML = '';
            document.getElementById('photos').innerHTML = '';
            const url = generateURL(name);
            fetchCountryData(url);
        });
        suggestions.appendChild(li);
    });
});

async function fetchCountryData(url) {
    document.getElementById('countryList').innerHTML = '<li class="col-12">Завантаження даних...</li>';

    try {
        const response = await fetch(url)
        const data = await response.json()

        const capital = data[0].capital ? data[0].capital[0] : null
        const currencyCode = Object.keys(data[0].currencies)[0];
        const countryName = data[0].name.common;
        
        if(capital){
            fetchWeatherData(capital)
        }
        if (currencyCode) {
            fetchCurrencyData(currencyCode);
        }
        showInfoCountry(data)
        fetchCountryPhoto(countryName)
        showLikeButton()        
        
    } catch (error) {
        countryList.innerHTML = `
            <p class='countryNone col-12'>
                <span class="alert-icon">⚠️</span>
                <strong>Країну не знайдено. Перевір правильність написання назви</strong>
            </p>`;
            setTimeout(() => {
                const message = document.querySelector('.countryNone');
                if (message) {
                    message.style.display = 'none';
                }
            }, 3000);
            input.value = '';
    }
}

function showInfoCountry(data){
    const{name, capital, region, languages, population, flags, maps} = data[0]
    const{common} = name
    const langList = Object.values(languages).join(', ')
    const{png} = flags
    const{googleMaps} = maps
    
    const countryList = document.getElementById('countryList')
    countryList.innerHTML = ''


    const elements = `
    <li id="name" class="col-12 header">${common}</li>
    <li id="capital" class="col-12 title">Столиця: ${capital}</li>
    <li id="region" class="col-12 text">Регіон: ${region}</li>
    <li id="languages" class="col-12 text">Мова: ${langList}</li>
    <li id="population" class="col-12 text">Населення: ${formatPopulation(population)}</li>
    <li id="flag" class="col-12 title"><img class="flag" src='${png}'></li>
    <li id="map" class="col-12 btnMap"><a href="${googleMaps}">Map</a></li>
    `
    countryList.innerHTML = elements
}

function formatPopulation(population) {
    if (population >= 1_000_000) {
        return (population / 1_000_000).toFixed(1) + ' млн осіб';
    } else if (population >= 1_000) {
        return (population / 1_000).toFixed(1) + ' тис. осіб';
    } else {
        return population + ' осіб';
    }
}

async function fetchWeatherData(capital) {
const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&lang=ua&appid=${API_WEATHER}`

    try {
        const response = await fetch(weatherURL)
        const weather = await response.json()
        showInfoWeather(weather)
        
    } catch (error) {
        console.error(error);
    }
}

function getMyIcon(icon) {
    const icons = {
        '01d': 'sun.gif',
        '02d': 'cloud.gif',
        '03d': 'cloudy.gif',
        '04d': 'clouds.gif',
        '10d': 'rain.gif',
        '09d': 'showerRain.gif',
        '11d': 'thunderstorm.gif',
        '13d': 'snow.gif',
        '50d': 'mist.gif',
        '01n': 'moon.gif',
        '02n': 'cloudN.gif',
        '03n': 'cloudy.gif',
        '04n': 'clouds.gif',
        '10n': 'rain.gif',
        '09n': 'showerRain.gif',
        '11n': 'thunderstorm.gif',
        '13n': 'snow.gif',
        '50n': 'mist.gif',
    }
    const chooseIcon = icon.toLowerCase()
    for(let key in icons){
        if (chooseIcon.includes(key)){
            return `./img/${icons[key]}`
        }
    }
}

function showInfoWeather(data){
    const{main, weather} = data
    const{temp} = main
    const{description, icon} = weather[0]
    const img = getMyIcon(icon)  
    
    const countryList = document.getElementById('countryList')

    const weatherElement  = `
    <li id="weather" class="col-12 title weather">${temp}°C ${description} <img class="col-12 iconWeather" src='${img}' alt="Погода"></li>
    `
    countryList.innerHTML += weatherElement 
}

async function fetchCurrencyData(currencyCode) {
    const currencyURL = `https://v6.exchangerate-api.com/v6/${API_CURRENCY}/latest/USD`
    
    try {
        const response = await fetch(currencyURL)
        const currency = await response.json()
        showInfoCurrency(currency,currencyCode)
    } catch (error) {
        console.error(error);
    }
}

function showInfoCurrency(data, currencyCode) {
    const countryList = document.getElementById('countryList');
    const rates = data.conversion_rates;

    const rateToLocal = rates[currencyCode];
    const rateToUSD = 1 / rateToLocal;

    const currencyElement = `
        <li id="currency" class="col-12 textCurrency">
            Валюта: ${currencyCode}<br>
            1 USD = ${rateToLocal.toFixed(2)} ${currencyCode}<br>
            1 ${currencyCode} = ${rateToUSD.toFixed(2)} USD
        </li>
    `;

    countryList.innerHTML += currencyElement;
}

let lastCountryPhotos = []

async function fetchCountryPhoto(countryName) {
    const url = `https://api.pexels.com/v1/search?query=${countryName}&per_page=3`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: PEXELS_API
            }
        });
        const data = await response.json();
        lastCountryPhotos = data.photos.map(photo => photo.src.landscape);
        const photosDiv = document.getElementById('photos');
        photosDiv.innerHTML = ''
        
        lastCountryPhotos.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            photosDiv.appendChild(img);
        });
    } catch (error) {
        console.error(error);
    }
}

function clearCountryInfo() {
    const fieldsToClear = ['name', 'capital', 'region', 'languages', 'population', 'weather', 'currency'];
    fieldsToClear.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });

    const flagImg = document.querySelector('#flag img');
    if (flagImg) flagImg.src = '';

    const weatherIcon = document.querySelector('.iconWeather');
    if (weatherIcon) weatherIcon.src = '';

    const map = document.getElementById('map');
    if (map) map.innerHTML = '';

    const photos = document.getElementById('photos');
    if (photos) photos.style.display = 'none';

    const countryList = document.getElementById('countryList');
    if (countryList) countryList.innerHTML = '';

    const likeButton = document.getElementById('likeButton');
    if (likeButton) likeButton.style.display = 'none';

    const input = document.getElementById('countryInput');
    if (input) input.value = '';

}

function showLikeButton() {
    const likeButton = document.getElementById('likeButton');
    likeButton.style.display = 'block';

    likeButton.onclick = () => {
        const countryData = {
            name: document.getElementById('name')?.textContent || '',
            capital: document.getElementById('capital')?.textContent || '',
            region: document.getElementById('region')?.textContent || '',
            languages: document.getElementById('languages')?.textContent || '',
            population: document.getElementById('population')?.textContent || '',
            flag: document.querySelector('#flag img')?.src || '',
            weather: document.getElementById('weather')?.textContent || '',
            weathericon: {
                iconSrc: document.querySelector('.iconWeather')?.src || ''
            },
            currency: document.getElementById('currency')?.innerHTML || '',
            map: document.getElementById('map')?.innerHTML || '',
            photos: lastCountryPhotos || []
        };

        let likedCountries = JSON.parse(localStorage.getItem('likedCountries')) || [];

        if (!likedCountries.some(c => c.name === countryData.name)) {
            likedCountries.push(countryData);
            localStorage.setItem('likedCountries', JSON.stringify(likedCountries));

            const badge = document.getElementById('likedCountBadge');
            if (badge) {
                badge.textContent = likedCountries.length;
                badge.style.display = 'inline-block';
            }
            clearCountryInfo()

        } else {
            showCustomAlert(`${countryData.name} вже є у списку улюблених.`);
        }
    };
}

function showCustomAlert(message, duration = 3000) {
    const alertBox = document.getElementById('customAlert');
    const alertText = document.getElementById('customAlertText');

    alertText.textContent = message;
    alertBox.classList.remove('hidden');
    alertBox.classList.add('show');

    setTimeout(() => {
        alertBox.classList.remove('show');
        alertBox.classList.add('hidden');
        clearCountryInfo()
    }, duration);
}

