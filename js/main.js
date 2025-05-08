const search = document.getElementById('search')

search.addEventListener('click', () => {
    const url = generateURL()
    fetchData(url)
})

function generateURL() {
    const countryName = document.querySelector('input').value.trim()
    const mainURL = `https://restcountries.com/v3.1/name/${countryName}`
    return mainURL
}

async function fetchData(url) {
    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log(data);
        
    } catch (error) {
        console.error(error);
    }
}