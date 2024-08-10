const getWeatherButton = document.getElementById("getWeather");
const loading = document.getElementById('loading');
const locationSearch = document.getElementById("location-search");
const forcastDataElement = document.getElementById('forcast-data')
const currentLocationBtn = document.getElementById('currentLocation')


// current location fetch and get the data

currentLocationBtn.addEventListener('click', (event) => {
    navigator.geolocation.getCurrentPosition((coords) => {
        callWeatherApi(`${coords.coords.latitude},${coords.coords.longitude}`)
        locationSearch.value = "current"
    })
})



// call the weather api 

const callWeatherApi = async (location) => {
    setLoading(true);
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=5`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '86157e08f9mshc8084cb455af6b5p126445jsnbd0248f248df',
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        setLoading(false);
        updateWeather(result);
    } catch (error) {
        setLoading(false);
        console.error('Error fetching weather data:', error);
    }
}


// set on window load it will call the current location api

window.onload = () => {
    navigator.geolocation.getCurrentPosition((coords) => {
        callWeatherApi(`${coords.coords.latitude},${coords.coords.longitude}`)
        locationSearch.value = "current"
    })
}


// get weather as per the search location
getWeatherButton.addEventListener('click', () => {
    const location = locationSearch.value;
    if (location) {
        callWeatherApi(location);
    }
});


// loading manage function
function setLoading(state) {
    loading.style.display = state ? 'flex' : 'none';
}


// update the weather data as per data
function updateWeather(data) {
    if (!data || !data.current || !data.forecast || !data.forecast.forecastday) {
        console.error("Invalid weather data:", data);
        return;
    }

    const current = data.current;
    const forecastDays = data.forecast.forecastday;
    const location = data.location;

    // Update current weather elements (similar to your existing code)
    document.getElementById('location').innerText = location.name;
    document.getElementById('region').innerText = location.region;
    document.getElementById('currentTemp').innerText = `${current.temp_c}°C`;
    document.getElementById('currentCondition').innerText = current.condition.text;
    document.getElementById('weatherIcon').src = current.condition.icon;
    document.getElementById('wind').innerText = `${current.wind_mph} mph`;
    document.getElementById('humidity').innerText = `${current.humidity}%`;
    document.getElementById('pressure').innerText = `${current.pressure_mb} mb`;
    document.getElementById('visibility').innerText = `${current.vis_km} km`;
    document.getElementById("forecastIcon").src = current.condition.icon

    forcastDataElement.innerHTML = '';

    forecastDays.forEach(day => {
        const html = `
         <div class="shadow-xl rounded-lg bg-white overflow-hidden">
    <h1 class="p-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center text-lg font-bold">
        ${day.date}
    </h1>
    <div class="p-6 grid grid-cols-2 gap-4">
        <img src="${day.day.condition.icon}" alt="weather_image" class="rounded-lg border border-gray-200 shadow-sm" />
        <div class="grid grid-cols-2 gap-4 text-gray-700">
            <div class="flex flex-col items-start">
                <span class="text-sm">Max Temp</span>
                <h3 class="text-xl font-semibold">${day.day.maxtemp_c}<sup>o</sup>C</h3>
            </div>
            <div class="flex flex-col items-start">
                <span class="text-sm">Min Temp</span>
                <h3 class="text-xl font-semibold">${day.day.mintemp_c}<sup>o</sup>C</h3>
            </div>
            <div class="flex flex-col items-start">
                <span class="text-sm">Avg Temp</span>
                <h3 class="text-xl font-semibold">${day.day.avgtemp_c}<sup>o</sup>C</h3>
            </div>
            <div class="flex flex-col items-start">
                <span class="text-sm">Max Wind</span>
                <h3 class="text-xl font-semibold">${day.day.maxwind_kph} Km/h</h3>
            </div>
            <div class="flex flex-col items-start">
                <span class="text-sm">Avg Humidity</span>
                <h3 class="text-xl font-semibold">${day.day.avghumidity}%</h3>
            </div>
            <div class="flex flex-col items-start">
                <span class="text-sm">Chance of Rain</span>
                <h3 class="text-xl font-semibold">${day.day.daily_chance_of_rain}%</h3>
            </div>
        </div>
    </div>
</div>

        `;
        forcastDataElement.innerHTML += html;
    });
}
