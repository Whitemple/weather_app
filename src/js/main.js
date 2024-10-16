import conditions from './conditions.js';

// const APP = document.querySelector('#app');
const API_KEY = '2fc62802a1b94cbba25141214240910';
const input = document.querySelector('.main__input');
const button = document.querySelector('.btn');
const currentLocation = document.querySelector('.header__currentLocation');
currentLocation.innerHTML = '';
const main__recentlyFoundCities = document.querySelector('.main__recentlyFoundCities');
const main = document.querySelector('.main');

// Получение текущей геопозиции пользователя
navigator.geolocation.getCurrentPosition( async position => {
    const { latitude, longitude } = position.coords;
    try {
        const geolocation = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`;
        const response = await fetch(geolocation);
        const data = await response.json();
        currentLocation.innerText = (data.error) ? `${data.error.code}: ${data.error.message}` : data.location.name;
        if(data.error){
            currentLocation.innerText = `${data.error.code}: ${data.error.message}`;
        } else{
            currentLocation.innerText = data.location.name;
            main.append(createCurrentWeatherCard(data));
        }
    } catch (error) {
        currentLocation.innerText = error.message;
    }
});

// функция записи истории в LocalStorage 
// V1.0

function saveHistoryToLocalStorage(city){
    if(localStorage.getItem('history') === null){
        const history = [];
        history.push(city)
        localStorage.setItem('history', JSON.stringify(history));
    }
    let history = JSON.parse(localStorage.getItem('history'));
    console.log(history);
    if(history.length < 3){
        !history.includes(city) && history.unshift(city);

    } else {
        !history.includes(city) && history.shift() && history.push(city);
    }
    localStorage.setItem('history', JSON.stringify(history));
};

/********** Код по выводу статичных данные с уменьешением запроса к серверу
// V 2.0
// Отличие от V1.0 в том, что тут данные записываюстя в объект и вытягиваюстя из локального хранилища без запроса к серверу по каждому городу.
// Плюс в том, что меньше запросов
// Минус. что данные статичные и при длительном перерыве они не обновятся и не покажут пользователю текущую температуру.

function saveHistoryToLocalStorage(data){
    const info = {
        name: data.location.name,
        country: data.location.country,
        temp_c: data.current.temp_c,
        feelslike_c: data.current.feelslike_c
    }
    if(localStorage.getItem('history') === null){
        const history = [];
        history.push(info)
        localStorage.setItem('history', JSON.stringify(history));
    }
    let history = JSON.parse(localStorage.getItem('history'));
    console.log(history);
    if(history.length < 3){
        !history.some(object => object.name === data.location.name) && history.unshift(info)

    } else {
        !history.some(object => object.name === data.location.name) && history.shift() && history.push(info);
    }
    localStorage.setItem('history', JSON.stringify(history));

};
************** */


// Функция построения карточки недавно найденных городов
// V1.0 при построении карточки идет запрос по каждмоу городу на сервер для обновления и запроса текущей актуальной температуры

function createRecentrlySearchedCities(data){
    const recentlyFoundCities = document.createElement('div');
    recentlyFoundCities.classList.add('recentlyFoundCities');
    recentlyFoundCities.setAttribute('cityName', `${data.location.name}`);
    recentlyFoundCities.innerHTML = `
        <div class="recentlyFoundCities__header">
            <h2 class="recentlyFoundCities__city">${data.location.name}</h2>
            <div class="recentlyFoundCities__country ">${data.location.country}</div>
        </div>
        <div class="recentlyFoundCities__weather weatherBlock">
            <div class="weatherBlock__icon"></div>
            <div class="weatherBlock__temp">
                <span aria-label="градусы Цельсия"><nobr>${Math.round(data.current.temp_c)} <span class="weatherBlock__fontCelsium">&deg;C</span></nobr></span>
            </div>
        </div>
        <div class="recentlyFoundCities__feelsLike">Ощущается как <span class="recentlyFoundCities__feelsLikeTemp"><nobr>${data.current.feelslike_c} &deg;C</nobr></span></div>
    `;
    return recentlyFoundCities;
};

// V 2.0
// Отличие от V1.0 в том, что тут данные записываюстя в объект и вытягиваюстя из локального хранилища без запроса к серверу по каждому городу.
// Плюс в том, что меньше запросов
// Минус. что данные статичные и при длительном перерыве они не обновятся и не покажут пользователю текущую температуру.

// function createRecentrlySearchedCities(data){
//     const recentlyFoundCities = document.createElement('div');
//     recentlyFoundCities.classList.add('recentlyFoundCities');
//     recentlyFoundCities.innerHTML = `
//         <div class="recentlyFoundCities__header">
//             <h2 class="recentlyFoundCities__city">${data.name}</h2>
//             <div class="recentlyFoundCities__country">${data.country}</div>
//         </div>
//         <div class="recentlyFoundCities__weather weatherBlock">
//             <div class="weatherBlock__icon"></div>
//             <div class="weatherBlock__temp">
//                 <span aria-label="градусы Цельсия"><nobr>${Math.round(data.temp_c)} <span class="weatherBlock__fontCelsium">&deg;C</span></nobr></span>
//             </div>
//         </div>
//         <div class="recentlyFoundCities__feelsLike">Ощущается как <span class="recentlyFoundCities__feelsLikeTemp"><nobr>${data.feelslike_c} &deg;C</nobr></span></div>
//     `;
//     return recentlyFoundCities;
// };

function showRecentleSearchedCitites() {
    const connectToHistory = localStorage.getItem('history');
    if(connectToHistory){
        const history = JSON.parse(localStorage.getItem('history'));
        // V1.0 при построении карточки идет запрос по каждмоу городу на сервер для обновления и запроса текущей актуальной температуры
        history.forEach(async city => {
            try {
                const data = await getWeather(API_KEY, city);
                const response = await data;
                const recentlyFoundCities = document.createElement('div');
                recentlyFoundCities.classList.add('recentlyFoundCities');
                if(response.ok === false){
                    recentlyFoundCities.innerText = `${response.status}: ${response.statusText}`;
                } else{
                    const element = createRecentrlySearchedCities(data);
                    main__recentlyFoundCities.append(element);
                    element.addEventListener('click', () => {
                        showWeatherCard(city);
                    })
                }
            } catch (error) {
                const recentlyFoundCities = document.createElement('div');
                recentlyFoundCities.classList.add('recentlyFoundCities');
                recentlyFoundCities.innerText = error.message;
            }
            
        });
        
             
        
       

        /* Код по выводу статичных данные с уменьешением запроса к серверу
        // V 2.0
        // Отличие от V1.0 в том, что тут данные записываюстя в объект и вытягиваюстя из локального хранилища без запроса к серверу по каждому городу.
        // Плюс в том, что меньше запросов
        // Минус. что данные статичные и при длительном перерыве они не обновятся и не покажут пользователю текущую температуру.
        
        // history.forEach(object => {
        //    main__recentlyFoundCities.append(createRecentrlySearchedCities(object));
        // });
        */
    }
};
showRecentleSearchedCitites();



// Ассинхронная функция подключения к серверу погоды
async function getWeather (API_KEY, city){
    try {
        let url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
        const response = await fetch(url);
        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            return response;
        }
    } catch (error) {
        return error;
        
    }
};

// функция валидации города
function validateInputCity(str){
    const city = str.trim();
    return city.length > 2 ? city : currentLocation.textContent;
}

// Клик по кнопке поиска города и вывода карточки
button.addEventListener('click', async (e) => {
    e.preventDefault();
    const city = validateInputCity(input.value);
    // try {
        
    //     const data = await getWeather(API_KEY, city);
    //     const response = await data;
    //     const currentWeatherCard = document.createElement('div');
    //     currentWeatherCard.classList.add('main__currentWeatherCard', 'currentWeatherCard');
    //     if(response.ok === false){
    //         currentWeatherCard.innerText = `${response.status}: ${response.statusText}`;
    //         main.removeChild(document.querySelector('.currentWeatherCard'));
    //         main.append(currentWeatherCard);
    //     } else{
    //         main.removeChild(document.querySelector('.currentWeatherCard'));
    //         main.append(createCurrentWeatherCard(data));
    //         // V1.0 для ассинхронного запроа по каждому городу из истории актуальной погоды
    //         saveHistoryToLocalStorage(data.location.name);
    //         // Ниже функция для v2.0 
    //         // saveHistoryToLocalStorage(data);
    //     }
    // } catch (error) {
    //     const currentWeatherCard = document.createElement('div');
    //     currentWeatherCard.classList.add('main__currentWeatherCard', 'currentWeatherCard');
    //     main.removeChild(document.querySelector('.currentWeatherCard'));
    //     currentWeatherCard.innerText = error.message;
    // }
    showWeatherCard(city).then(() =>{
        input.value = '';
        main__recentlyFoundCities.innerHTML = '';
        showRecentleSearchedCitites();
    });
    // input.value = '';
    // main__recentlyFoundCities.innerHTML = '';
    // showRecentleSearchedCitites();
});

async function showWeatherCard(city) {
    try {
        const data = await getWeather(API_KEY, city);
        const response = await data;
        const currentWeatherCard = document.createElement('div');
        currentWeatherCard.classList.add('main__currentWeatherCard', 'currentWeatherCard');
        if(response.ok === false){
            currentWeatherCard.innerText = `${response.status}: ${response.statusText}`;
            main.removeChild(document.querySelector('.currentWeatherCard'));
            main.append(currentWeatherCard);
        } else{
            main.removeChild(document.querySelector('.currentWeatherCard'));
            main.append(createCurrentWeatherCard(data));
            // V1.0 для ассинхронного запроа по каждому городу из истории актуальной погоды
            saveHistoryToLocalStorage(data.location.name);
            // Ниже функция для v2.0 
            // saveHistoryToLocalStorage(data);
        }
    } catch (error) {
        const currentWeatherCard = document.createElement('div');
        currentWeatherCard.classList.add('main__currentWeatherCard', 'currentWeatherCard');
        main.removeChild(document.querySelector('.currentWeatherCard'));
        currentWeatherCard.innerText = error.message;
    }
}


// Создаем карточку города с выводм всей информации
function createCurrentWeatherCard(data){
    const currentWeatherCard = document.createElement('div');
    currentWeatherCard.classList.add('main__currentWeatherCard', 'currentWeatherCard');
    currentWeatherCard.innerHTML = `
        <div class="currentWeatherCard__header">
            <h2 class="currentWeatherCard__city">${data.location.name}</h2>
            <div class="currentWeatherCard__country">${data.location.country}</div>
        </div>
        <div class="currentWeatherCard__info">
            <div class="currentWeatherCard__data">
                <div class="recentlyFoundCities__weather weatherBlock">
                    <div class="weatherBlock__icon"></div>
                    <div class="weatherBlock__temp">
                        <span aria-label="градусы Цельсия"><nobr>${Math.round(data.current.temp_c)} <span class="weatherBlock__fontCelsium">&deg;C</span></nobr></span>
                    </div>
                </div>
                <div class="weather__feelsLike">Ощущается как <span class="weatehr__feelsLikeTemp"><nobr>${data.current.feelslike_c} &deg;C</nobr></span></div>
                <div class="currentWeatherCard__humidity">Влажность: ${data.current.humidity}%</div>
                <div class="currentWeatherCard__windDirection">Направление ветра: ЮЗ</div>
                <div class="currentWeatherCard__windSpeed">Скорость ветра: ${data.current.wind_mph} м/с</div>
                 <div class="currentWeatherCard__windGust">Порыв ветра: ${data.current.gust_kph} м/с</div>
            </div>
            <div class="currentWeatherCard__map">Map</div>
        </div>
    `;
    return currentWeatherCard;
};