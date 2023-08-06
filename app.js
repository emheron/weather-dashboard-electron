document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    const state = document.getElementById('state-input').value;
    const country = 'US';
    const apiKey = document.getElementById('weather-api-key').value;  // fetch apiKey here

    getWeatherData(city, apiKey);
    getForecastData(city, state, country);
});

function getWeatherData(city, apiKey) {
    const url = `http://localhost:3000/weather?city=${city}&appid=${apiKey}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(wdata => {
        if (wdata.cod !== 200) {
            console.log('Incomplete weather data', wdata); 
            return;  // return here to prevent further processing of incomplete data
        }
        displayWeatherData(wdata);
    })
    .catch(error => console.log('An error occurred: ' + error));
}

function displayWeatherData(wdata) {
    if (!wdata || !wdata.name || !wdata.sys || !wdata.main || !wdata.wind || !wdata.weather) {
        console.log('Incomplete weather data', wdata);
        return;
    }
    const weatherDiv = document.getElementById('weather-data');

    weatherDiv.innerHTML = '';

    const cityHeader = document.createElement('h2');
    cityHeader.innerText = `${wdata.name}, ${wdata.sys.country}`;
    weatherDiv.appendChild(cityHeader);

    const tempPara = document.createElement('p');
    tempPara.innerText = `Temperature: ${wdata.main.temp} °F`;
    weatherDiv.appendChild(tempPara);

    const humidityPara = document.createElement('p');
    humidityPara.innerText = `Humidity: ${wdata.main.humidity} %`;
    weatherDiv.appendChild(humidityPara);

    const windSpeedPara = document.createElement('p');
    windSpeedPara.innerText = `Wind speed: ${wdata.wind.speed} m/s`;
    weatherDiv.appendChild(windSpeedPara);

    const weatherDescPara = document.createElement('p');
    weatherDescPara.innerText = `Conditions: ${wdata.weather[0].description}`;
    weatherDiv.appendChild(weatherDescPara);
}

function getForecastData(city, state, country) {
    const apiKey = document.getElementById('weather-api-key').value;
    const url = `http://localhost:3000/forecast?city=${city}&state=${state}&country=${country}&appid=${apiKey}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(fdata => {
        if (fdata.cod !== "200") {  
            console.log('Incomplete forecast data', fdata); 
            return; 
        }
        displayForecastData(fdata);
    })
    .catch(error => console.log('An error occurred: ' + error));
}


function displayForecastData(fdata) {
    const forecastDiv = document.getElementById('forecast-data');
    const dailyData = groupByDay(fdata.list);
    
    forecastDiv.innerHTML = '';

    for (let date in dailyData) {
        const dailyForecastDiv = document.createElement('div');
        dailyForecastDiv.className = 'daily-forecast';

        for (let forecast of dailyData[date]) {
            const periodDiv = document.createElement('div');
            periodDiv.className = 'forecast-box';

            const time = new Date(forecast.dt * 1000);
            const hour = time.getHours();

            const dateHeader = document.createElement('h2');
            dateHeader.innerText = time.toDateString();
            periodDiv.appendChild(dateHeader);

            const timePara = document.createElement('h3');
            timePara.innerText = `Time: ${hour}:00`;
            periodDiv.appendChild(timePara);

            const tempPara = document.createElement('p');
            tempPara.innerText = `Temperature: ${forecast.main.temp} °F, Low: ${forecast.main.temp_min} °F, High: ${forecast.main.temp_max} °F`;
            periodDiv.appendChild(tempPara);

            const weatherDescPara = document.createElement('p');
            weatherDescPara.innerText = `Conditions: ${forecast.weather[0].description}`;
            periodDiv.appendChild(weatherDescPara);

            dailyForecastDiv.appendChild(periodDiv);
        }

        forecastDiv.appendChild(dailyForecastDiv);
    }
}

function groupByDay(forecastList) {
    const grouped = {};
    
    for (let forecast of forecastList) {
        const date = new Date(forecast.dt * 1000).toDateString(); // Convert to readable date string
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(forecast);
    }

    return grouped;
}

function getAPOD() {
    const apiKey = document.getElementById('apod-api-key').value;
    const url = `http://localhost:3000/apod?apodApiKey=${apiKey}`;

    fetch(url)
    .then(response => response.json())
    .then(adata => {
        displayAPOD(adata);
    });
}


function displayAPOD(adata) {
    const apodDiv = document.getElementById('apod');

    while (apodDiv.firstChild) {
        apodDiv.firstChild.remove();
    }

    const img = document.createElement('img');
    img.src = adata.url;
    img.alt = adata.title;
    
    apodDiv.appendChild(img);

    const title = document.createElement('h2');
    title.textContent = adata.title;
    apodDiv.appendChild(title);

    const explanation = document.createElement('p');
    explanation.textContent = adata.explanation;
    apodDiv.appendChild(explanation);
}


getAPOD();




