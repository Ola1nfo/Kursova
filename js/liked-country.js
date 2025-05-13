document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('likedCountriesList');
    const likedCountries = JSON.parse(localStorage.getItem('likedCountries')) || [];
    
    likedCountries.forEach((country, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${country.name}</h3>
            <p>${country.capital}</p>
            <p>${country.region}</p>
            <p>${country.languages}</p>
            <p>${country.population}</p>
            <img src="${country.flag}" width="100">
            <p>${country.weather}</p>
            <img src="${country.weathericon.iconSrc}" alt="Погода" class="iconWeather">
            <p>${country.currency}</p>
            <p>${country.map}</p>
            `;
            if (country.photos && country.photos.length > 0) {
                const photosWrapper = document.createElement('div');
                country.photos.forEach(photoUrl => {
                    const img = document.createElement('img');
                    img.src = photoUrl;
                    img.width = 200;
                    img.style.margin = '5px';
                    photosWrapper.appendChild(img);
                });
                li.appendChild(photosWrapper);
            }
            li.innerHTML += `<hr>`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Видалити';
            deleteButton.onclick = () => {
                likedCountries.splice(index, 1);
                localStorage.setItem('likedCountries', JSON.stringify(likedCountries));
                li.remove(); 
            };

        li.appendChild(deleteButton);
            list.appendChild(li);
        });
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('likedCountries'); 
            list.innerHTML = ''; 
        });
    });