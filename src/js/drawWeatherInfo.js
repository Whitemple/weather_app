const YANDEX_API = 'fdea7c49-7871-40ad-990d-1b2a3f15755d';


export function drawWeatherInfo (el, data) {
    const urlMap = `https://static-maps.yandex.ru/v1?lang=ru_RUapikey=${YANDEX_API}&ll=32.810152,39.889847&l=map`;


    el.innerHTML = `
        <div>Погода: ${data.weather[0].main}</div>
        <div>Температура: ${data.main.temp}</div>
       <img src='${urlMap}' />
    `;
}