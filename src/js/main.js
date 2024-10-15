import conditions from './conditions.js';

// const APP = document.querySelector('#app');
const API_KEY = '2fc62802a1b94cbba25141214240910';
const input = document.querySelector('.main__input');
const button = document.querySelector('.btn');
const currentLocation = document.querySelector('.header__currentLocation');
currentLocation.innerHTML = '';
const main = document.querySelector('.main');

// Получение текущей геопозиции пользователя
navigator.geolocation.getCurrentPosition( async position => {
    const { latitude, longitude } = position.coords;
    // console.log(latitude, longitude)
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
function saveHistoryToLocalStorage(city){

    if(localStorage.getItem('history') !== null){
        const history = JSON.parse(localStorage.getItem('history'));
        history.push(city)
        localStorage.setItem('history', JSON.stringify(history));

    } else {
        const history = [];
        history.push(city)
        localStorage.setItem('history', JSON.stringify(history));

    }

}


// Ассинхронная функция подключения к серверу погоды
async function getWeather (API_KEY, city){
    try {
        let url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&days=5`;
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
    
    try {
        const city = validateInputCity(input.value);
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
            saveHistoryToLocalStorage(data.location.name);
            // localStorage.setItem ('data', data.location.name);
        }
    } catch (error) {
        const currentWeatherCard = document.createElement('div');
        currentWeatherCard.classList.add('main__currentWeatherCard', 'currentWeatherCard');
        main.removeChild(document.querySelector('.currentWeatherCard'));
        currentWeatherCard.innerText = error.message;
    }
});


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
}