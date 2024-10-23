import conditions from './conditions.js';


// const APP = document.querySelector('#app');
const API_KEY = '2fc62802a1b94cbba25141214240910';
const input = document.querySelector('.main__input');
const button = document.querySelector('.btn');
const currentLocation = document.querySelector('.header__currentLocation');
currentLocation.innerHTML = '';
const main__recentlyFoundCities = document.querySelector('.main__recentlyFoundCities');
const main = document.querySelector('.main');
const foundedCityContainer = document.querySelector('.main__foundedCityContainer');


// Получение текущей геопозиции пользователя
navigator.geolocation.getCurrentPosition( async position => {
    const { latitude, longitude } = position.coords;
    try {
        const geolocation = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`;
        const response = await fetch(geolocation);
        const data = await response.json();
        currentLocation.innerText = (data.error) ? `${data.error.code}: ${data.error.message}` : data.location.name;
        if(data.error){
            currentLocation.innerText = `${data.error.code}: ${data.error.message}`;
        } else{
            // currentLocation.innerText = data.location.name;
            // main.append(createCurrentWeatherCard(data));
            foundedCityContainer.innerHTML = '';
            foundedCityContainer.append(createCurrentWeatherCard(data));
        }
    } catch (error) {
        currentLocation.innerText = error.message;
    }
});


// Функция отображения иконок и название погоды
function showWeatherInfoRus(conditions, code, isDay){
    let notFinded = true;
    let index = 0;
    const add = {}
    while(notFinded){
        if(conditions[index].code === code){
            add.weatherDescription = isDay ? conditions[index].languages[23].day_text : conditions[index].languages[23].night_text;
            add.icon = isDay ? conditions[index].icon_day : conditions[index].icon_night;
            notFinded = false;
        }
        else{
            index++;
        }
    }
    return add;
};


// функция записи истории в LocalStorage 
function saveHistoryToLocalStorage(city){
    if(localStorage.getItem('history') === null){
        const history = [];
        history.push(city)
        localStorage.setItem('history', JSON.stringify(history));
    }
    let history = JSON.parse(localStorage.getItem('history'));
    if(history.length < 3){
        !history.includes(city) && history.unshift(city);

    } else {
        !history.includes(city) && history.shift() && history.push(city);
    }
    localStorage.setItem('history', JSON.stringify(history));
};


// Функция построения карточки недавно найденных городов
// При построении карточки идет запрос по каждмоу городу на сервер для обновления и запроса текущей актуальной температуры
function createRecentrlySearchedCities(data){
    const weatherInfo = showWeatherInfoRus(conditions, data.current.condition.code, data.current.is_day)
    const recentlyFoundCities = document.createElement('div');
    recentlyFoundCities.classList.add('recentlyFoundCities');
    recentlyFoundCities.setAttribute('cityName', `${data.location.name}`);
    recentlyFoundCities.innerHTML = `
        <div class="recentlyFoundCities__header">
            <h2 class="recentlyFoundCities__city">${data.location.name}</h2>
            <div class="recentlyFoundCities__country ">${data.location.country}</div>
        </div>
        <div class="recentlyFoundCities__weather weatherBlock">
            <div class="weatherBlock__icon" style="background-image: url('./img/${weatherInfo.icon}.svg');"></div>
            <div class="weatherBlock__temp">
                <span aria-label="градусы Цельсия"><nobr>${Math.round(data.current.temp_c)} <span class="weatherBlock__fontCelsium">&deg;C</span></nobr></span>
            </div>
        </div>
        <div class="recentlyFoundCities__littleDescription">${weatherInfo.weatherDescription}</div>
        <div class="recentlyFoundCities__littleDescription">Ощущается как <span class="recentlyFoundCities__feelsLikeTemp"><nobr>${data.current.feelslike_c} &deg;C</nobr></span></div>
    `;
    return recentlyFoundCities;
};


function showRecentleSearchedCitites() {
    const connectToHistory = localStorage.getItem('history');
    if(connectToHistory){
        const history = JSON.parse(localStorage.getItem('history'));
        // При построении карточки идет запрос по каждмоу городу на сервер для обновления и запроса текущей актуальной температуры
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
    showWeatherCard(city).then(() =>{
        input.value = '';
        main__recentlyFoundCities.innerHTML = '';
        showRecentleSearchedCitites();
    });
});


async function showWeatherCard(city) {
    try {
        const data = await getWeather(API_KEY, city);
        const response = await data;
        const currentWeatherCard = document.createElement('div');
        currentWeatherCard.classList.add('main__currentWeatherCard', 'currentWeatherCard');
        if(response.ok === false){
            currentWeatherCard.innerText = `${response.status}: ${response.statusText}`;
            // main.removeChild(document.querySelector('.currentWeatherCard'));
            // main.append(currentWeatherCard);
            foundedCityContainer.innerHTML = '';
            foundedCityContainer.append(currentWeatherCard);
        } else{
            // main.contains(document.querySelector('.currentWeatherCard')) ? main.removeChild(document.querySelector('.currentWeatherCard')) && main.append(createCurrentWeatherCard(data)) : main.append(createCurrentWeatherCard(data));
            foundedCityContainer.innerHTML = '';
            foundedCityContainer.append(createCurrentWeatherCard(data));
            saveHistoryToLocalStorage(data.location.name);
        }
    } catch (error) {
        const currentWeatherCard = document.createElement('div');
        currentWeatherCard.classList.add('main__currentWeatherCard', 'currentWeatherCard');
        currentWeatherCard.innerText = error.message;
        // main.contains(document.querySelector('.currentWeatherCard')) ? main.removeChild(document.querySelector('.currentWeatherCard')) && main.append(currentWeatherCard) : main.append(currentWeatherCard);
        foundedCityContainer.innerHTML = '';
        foundedCityContainer.append(currentWeatherCard);
        // main.removeChild(document.querySelector('.currentWeatherCard'));
        
    }
};


function showLocalTime(string){
    return string.split(' ');
}


// Создаем карточку города с выводм всей информации
function createCurrentWeatherCard(data){
    const weatherInfo = showWeatherInfoRus(conditions, data.current.condition.code, data.current.is_day);
    const currentWeatherCard = document.createElement('div');
    currentWeatherCard.classList.add('main__currentWeatherCard', 'currentWeatherCard');
    currentWeatherCard.innerHTML = `
        <div>
            <div class="currentWeatherCard__header">
                <h2 class="currentWeatherCard__city">${data.location.name}</h2>
                <div class="currentWeatherCard__country">${data.location.country}</div>
            </div>
            <div class="currentWeatherCard__info">
                <div class="currentWeatherCard__data">
                    <div class="recentlyFoundCities__weather weatherBlock">
                        <div class="weatherBlock__icon" style="background-image: url('./img/${weatherInfo.icon}.svg');"></div>
                        <div class="weatherBlock__temp">
                            <span aria-label="градусы Цельсия"><nobr>${Math.round(data.current.temp_c)} <span class="weatherBlock__fontCelsium">&deg;C</span></nobr></span>
                        </div>
                    </div>
                    <div class="currentWeatherCard__weatherDescription">${weatherInfo.weatherDescription}</div>
                    <div class="weather__feelsLike">Ощущается как <span class="weatehr__feelsLikeTemp"><nobr>${data.current.feelslike_c} &deg;C</nobr></span></div>
                    <div class="currentWeatherCard__humidity">Влажность: ${data.current.humidity}%</div>
                    <div class="currentWeatherCard__windSpeed">Скорость ветра: ${data.current.wind_mph} м/с</div>
                    <div class="currentWeatherCard__windGust">Порыв ветра: ${data.current.gust_kph} м/с</div>
                </div>
            </div>
        </div>
        <div class="currentWeatherCard__map">
            <time class="currentWeatherCard__localDate">Текущая дата: ${showLocalTime(data.location.localtime)[0]}</time>
            <time class="currentWeatherCard__time">Местное время: ${showLocalTime(data.location.localtime)[1]}</time>
            
            
        </div>
    `;
    return currentWeatherCard;
};