import {drawWeatherApp} from './drawWeatherApp.js';
import { currentLocationName } from './currentLocationName.js';
import {getWeatherByLocationName} from './getWeatherByLocationName.js';
import {drawWeatherInfo} from './drawWeatherInfo.js';

export async function runWeatherApp (element) {
    drawWeatherApp(element);

    const input = document.querySelector('input');
    const form = document.querySelector('form');
    const info = document.querySelector('.info');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(input.value);
    })

    const currentLocatioCityName = await currentLocationName();
    const weatherApi = await getWeatherByLocationName();
    drawWeatherInfo(info, weatherApi);
    console.log({currentLocatioCityName, weatherApi});
}