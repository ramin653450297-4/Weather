const cityInput = document.querySelector('#cityinput');
const searchBtn = document.querySelector('#searchbtn');
const locationElement = document.querySelector('.location');
const temperatureElement = document.querySelector('.temperature');
const iconElement = document.querySelector('.icon');
const descriptionElement = document.querySelector('.description');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind');
const uvElement = document.querySelector('.uv');
const apiKey = '4633f19d0632bb6605b17de09fbb312b';

searchBtn.addEventListener('click', () => {
    if (cityInput.value === '') {
        window.alert('Please enter a city name');
        clearWeatherData();
        return;
    }
    getWeather();
});

cityInput.addEventListener('keyup', (e) => {
    if (cityInput.value === '') {
        window.alert('Please enter a city name');
        clearWeatherData();
        return;
    }
    if (e.key === 'Enter') {
        getWeather();
        cityInput.value = '';
    }
});

function clearWeatherData() {
    locationElement.textContent = '';
    temperatureElement.textContent = '';
    iconElement.innerHTML = '';
    descriptionElement.textContent = '';
    humidityElement.textContent = '';
    windElement.textContent = '';
    uvElement.textContent = '';
    uvElement.className = 'uv'; // Reset UV element class
}

function getWeather() {
    const city = cityInput.value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    console.log(apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const cityName = data.name;
            const iconCode = data.weather[0].icon;
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            locationElement.innerHTML = `<i class="fa-solid fa-location-dot"></i>${cityName}`;
            temperatureElement.textContent = `${temperature}°C`;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            iconElement.innerHTML = `<img src='${iconUrl}' alt='Weather icon'>`;
            descriptionElement.textContent = description;
            humidityElement.textContent = `Humidity: ${humidity}%`;
            windElement.textContent = `Wind Speed: ${windSpeed} Km/hr`;

            getUVIndex(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            locationElement.textContent = 'City not found';
            clearWeatherData();
        });
    cityInput.value = '';
}

function getUVIndex(lat, lon) {
    const uvApiUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    console.log(uvApiUrl);

    fetch(uvApiUrl)
        .then(response => response.json())
        .then(data => {
            const uvIndex = data.value;
            uvElement.textContent = `UV Index: ${uvIndex}`;
            setUVIndexClass(uvIndex);
        })
        .catch(error => {
            console.error('Error fetching UV index data:', error);
            uvElement.textContent = 'UV Index: N/A';
        });
}

function setUVIndexClass(uvIndex) {
    uvElement.className = 'uv'; // Reset class
    if (uvIndex < 3) {
        uvElement.classList.add('uv-low');
    } else if (uvIndex >= 3 && uvIndex <= 5) {
        uvElement.classList.add('uv-moderate');
    } else if (uvIndex >= 6 && uvIndex <= 7) {
        uvElement.classList.add('uv-high');
    } else if (uvIndex >= 8 && uvIndex <= 10) {
        uvElement.classList.add('uv-very-high');
    } else {
        uvElement.classList.add('uv-extreme');
    }
}
