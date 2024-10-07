export function drawWeatherApp (element) {
    element.innerHTML = `
        <h1>Weather Forecast</h1>
        <form class="searchingPanel">
            <input name="cityname" required autofocus />
            <button>Show weather</button>
        </form>
        <div class="info"></div>
    `;
}