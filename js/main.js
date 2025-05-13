function showCountryContainer() {
    const banner = document.getElementById('infoBanner');
    banner.style.display = 'none';

    const countryContainer = document.getElementById('container');
    countryContainer.style.display = 'block';
}

const search = document.getElementById('search')

const API_WEATHER = '418b95f1f028afc1a3c10087c1d8db0d'
const API_CURRENCY = '89abaa6266aaec8a5fee6ea5'
const PEXELS_API = 'vNAXdG3jksl9MDt7vGQTNYw4PYQdeDaIx9QXAni2bV1WD6U4qncJvkpA';

search.addEventListener('click', () => {
    document.getElementById('photos').innerHTML = '';
    const input = document.querySelector('input').value.trim();
    if (!input) {
        const messageContainer = document.getElementById('countryList');
        messageContainer.innerHTML = `<p class='countryNone' style='display:block'>!!!Будь ласка, введіть назву країни!!!</p>`;
        const likeButton = document.getElementById('likeButton');        likeButton.style.display = 'none';
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
    document.getElementById('countryList').innerHTML = '<li>Завантаження даних...</li>';

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
        if (data.status === 404 || data.length === 0) {
            countryList.innerHTML = `<p class='countryNone'>❌ Країну не знайдено. Спробуйте ще раз.</p>`;
            return;
        }

        showInfoCountry(data)
        fetchCountryPhoto(countryName)
        showLikeButton()
        console.log(data);
        
        
    } catch (error) {
        console.error(error);
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
    <li id="name">Назва країни: ${common}</li>
    <li id="capital">Столиця: ${capital}</li>
    <li id="region">Регіон: ${region}</li>
    <li id="languages">Мова: ${langList}</li>
    <li id="population">Населення: ${formatPopulation(population)}</li>
    <li id="flag">Прапор:<br><img class="flag" src='${png}'></li>
    <li id="map">Геолокація: <a href="${googleMaps}">Відкрити на мапі</a></li>
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
        console.log(weather);
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
    <li id="weather">Погода: ${temp}°C, ${description}, <img class="iconWeather" src='${img}' alt="Погода"></li>
    `
    countryList.innerHTML += weatherElement 
}

async function fetchCurrencyData(currencyCode) {
    const currencyURL = `https://v6.exchangerate-api.com/v6/${API_CURRENCY}/latest/USD`
    
    try {
        const response = await fetch(currencyURL)
        const currency = await response.json()
        console.log(currency);
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
        <li id="currency">
            Валюта: ${currencyCode}<br>
            1 USD = ${rateToLocal.toFixed(2)} ${currencyCode}<br>
            1 ${currencyCode} = ${rateToUSD.toFixed(2)} USD
        </li>
    `;

    countryList.innerHTML += currencyElement;
}

async function fetchCountryPhoto(countryName) {
    const url = `https://api.pexels.com/v1/search?query=${countryName}&per_page=3`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: PEXELS_API
            }
        });
        const data = await response.json();
        const photosDiv = document.getElementById('photos');
        photosDiv.innerHTML = ''
        
        data.photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.src.landscape;
            photosDiv.appendChild(img);
        });
    } catch (error) {
        console.error(error);
    }
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
            currency: document.getElementById('currency')?.innerHTML || '',
            map: document.getElementById('map')?.innerHTML || ''
        };

        let likedCountries = JSON.parse(localStorage.getItem('likedCountries')) || [];

        if (!likedCountries.some(c => c.name === countryData.name)) {
            likedCountries.push(countryData);
            localStorage.setItem('likedCountries', JSON.stringify(likedCountries));
        } else {
            alert(`${countryData.name} вже є у списку улюблених.`);
        }
    };
}
