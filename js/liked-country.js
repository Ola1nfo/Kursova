document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('likedCountriesList');
    const likedCountries = JSON.parse(localStorage.getItem('likedCountries')) || [];
    
    likedCountries.forEach(country => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${country.name}</h3>
            <p>${country.capital}</p>
            <p>${country.region}</p>
            <p>${country.languages}</p>
            <p>${country.population}</p>
            <img src="${country.flag}" width="100">
            <p>${country.weather}</p>
            <p>${country.currency}</p>
            <p>${country.map}</p>
            <hr>
            `;
            list.appendChild(li);
        });
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('likedCountries'); 
            list.innerHTML = ''; 
        });
    });