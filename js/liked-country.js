document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('likedCountriesList');
    const likedCountries = JSON.parse(localStorage.getItem('likedCountries')) || [];

    let currentIndex = 0;

    const renderCountry = (index) => {
        list.innerHTML = '';
        const country = likedCountries[index];

        const li = document.createElement('li');
        li.innerHTML = `
            <h3 class="header">${country.name}</h3><hr>
            <p class="title">${country.capital}</p>
            <img class="title flag" src="${country.flag}" width="100">
            <p class="text">${country.region}</p>
            <p class="text">${country.languages}</p>
            <p class="text">${country.population}</p>
            <p class="title weather">${country.weather}
            <img class="title iconWeather" src="${country.weathericon.iconSrc}" alt="Погода"></p>
            <p class="textCurrency">${country.currency}</p>
            <p class="btnMap">${country.map}</p>
        `;

        if (country.photos && country.photos.length > 0) {
            const photosWrapper = document.createElement('div');
            photosWrapper.classList.add('carousel', 'slide');
            photosWrapper.setAttribute('id', 'carouselExampleIndicators');
            photosWrapper.setAttribute('data-bs-ride', 'carousel');

            const indicators = document.createElement('div');
            indicators.classList.add('carousel-indicators');
            country.photos.forEach((photoUrl, index) => {
                const indicator = document.createElement('button');
                indicator.setAttribute('type', 'button');
                indicator.setAttribute('data-bs-target', '#carouselExampleIndicators');
                indicator.setAttribute('data-bs-slide-to', index.toString());
                if (index === 0) indicator.classList.add('active');
                indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                indicators.appendChild(indicator);
            });

            photosWrapper.appendChild(indicators);

            const carouselInner = document.createElement('div');
            carouselInner.classList.add('carousel-inner');

            country.photos.forEach((photoUrl, index) => {
                const item = document.createElement('div');
                item.classList.add('carousel-item');
                if (index === 0) item.classList.add('active');

                const img = document.createElement('img');
                img.src = photoUrl;
                img.classList.add('d-block', 'w-100');
                img.style.height = '500px';
                img.style.objectFit = 'cover';

                item.appendChild(img);
                carouselInner.appendChild(item);
            });
            photosWrapper.appendChild(carouselInner);
            li.appendChild(photosWrapper);
        }
        li.innerHTML += `<hr>`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => {
            likedCountries.splice(index, 1);
            localStorage.setItem('likedCountries', JSON.stringify(likedCountries));
            if (likedCountries.length === 0) {
                list.innerHTML = '<p>Немає збережених країн</p>';
            } else {
                currentIndex = currentIndex % likedCountries.length;
                renderCountry(currentIndex);
            }
        });

        li.appendChild(deleteButton);
        list.appendChild(li);
    };

    const controls = document.createElement('div');
    controls.style.margin = '20px';
    controls.style.display = 'flex';
    controls.style.justifyContent = 'center';
    controls.style.gap = '10px';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + likedCountries.length) % likedCountries.length;
        renderCountry(currentIndex);
    });

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % likedCountries.length;
        renderCountry(currentIndex);
    });

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    list.parentElement.insertBefore(controls, list); 

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem('likedCountries');
            list.innerHTML = '<p>Список очищено</p>';
        });
    }

    if (likedCountries.length > 0) {
        renderCountry(currentIndex);
    } else {
        list.innerHTML = '<p>Немає збережених країн</p>';
    }
});
