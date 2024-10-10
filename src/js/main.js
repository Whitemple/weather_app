// const APP = document.querySelector('#app');
const API_KEY = '2fc62802a1b94cbba25141214240910';
let city = null;
let url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;

console.log('http://api.weatherapi.com/v1/current.json?key=2fc62802a1b94cbba25141214240910&q=${city}')