const API_KEY ='1289f3b71732cf788b8ea917a6299964';
const city = 'Moscow';

export async function getWeatherByLocationName () {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?&q=${city}&appid=${API_KEY}&lang=ru&units=metric`);
    const data = await response.json();
    return data;
}