const search = document.getElementById('search')

const API_WEATHER = '418b95f1f028afc1a3c10087c1d8db0d'
const API_CURRENCY = '89abaa6266aaec8a5fee6ea5'
const PEXELS_API = 'vNAXdG3jksl9MDt7vGQTNYw4PYQdeDaIx9QXAni2bV1WD6U4qncJvkpA';

search.addEventListener('click', () => {
    const url = generateURL()
    fetchCountryData(url)
})

function generateURL() {
    const countryName = document.querySelector('input').value.trim()
    return `https://restcountries.com/v3.1/name/${countryName}`
}

async function fetchCountryData(url) {
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
        fetchCountryPhoto(countryName)
        console.log(data);
        
        
    } catch (error) {
        console.error(error);
    }
}

async function fetchWeatherData(capital) {
const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&lang=ua&appid=${API_WEATHER}`

    try {
        const response = await fetch(weatherURL)
        const weather = await response.json()
        console.log(weather);
        
    } catch (error) {
        console.error(error);
    }
}

async function fetchCurrencyData(currencyCode) {
    const currencyURL = `https://v6.exchangerate-api.com/v6/${API_CURRENCY}/latest/USD`
    
        try {
            const response = await fetch(currencyURL)
            const currency = await response.json()
            console.log(currency);
            
        } catch (error) {
            console.error(error);
        }
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
