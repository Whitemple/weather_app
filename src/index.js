import "./index.scss";

const API_KEY = '2fc62802a1b94cbba25141214240910';
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const header = document.querySelector('.header');



form.onsubmit = function(e){
    e.preventDefault();
    let city = input.value.trim();
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
    fetch(url)
    .then(response => response.json())
    .then(data=> {
        let weatherCard=null;
        if(data.error){
            const prevCard = document.querySelector('.card');
            if(prevCard) prevCard.remove();
            weatherCard = `<div class='card'>${data.error.message}<div/>`
        }
        else{
            const prevCard = document.querySelector('.card');
            if(prevCard) prevCard.remove();
            weatherCard = `
            <div class="card">
                <h2 class="card-city">${data.location.name}<span>${data.location.country}</span></h2>
                <div class="card-weather">
                    <div class="card-value">${data.current.temp_c}°c</div>
                    <img class= "card-img" src="./img/flashAndRain.png" alt="Weather">
                </div>
                <div class="card-description">${data.current.condition.text}</div>
            </div>
            `;
        }
        header.insertAdjacentHTML('afterend', weatherCard);
    });
}