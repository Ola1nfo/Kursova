const search = document.getElementById('search')

const API_WEATHER = '418b95f1f028afc1a3c10087c1d8db0d'

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
        
        if(capital){
            fetchWeatherData(capital)
        }
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


