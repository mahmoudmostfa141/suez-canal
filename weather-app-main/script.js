// Select all forecast-day elements
const days = document.querySelectorAll('.forecast-day');

// Add click event listener to each day
days.forEach((day) => {
    day.addEventListener('click', () => {
        days.forEach((d) => d.classList.remove('active'));
        day.classList.add('active');
        const selectedDay = day.getAttribute('data-day');
        fetchWeatherData(selectedDay); 
    });
});


// Fetch and display weather data
async function fetchWeather() {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=30.5852&longitude=32.2739&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=auto`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Extract current weather data
        const currentWeather = data.current_weather;
        const dailyData = data.daily;

        // Update the sidebar with current weather
        document.getElementById("current-temp").textContent = `${Math.round(currentWeather.temperature)}°C`;
        document.querySelector(".current-day").textContent = formatDate(new Date());
        document.querySelector(".weather-desc").textContent = getWeatherDescription(currentWeather.weathercode);
        document.querySelector(".rain-chance").textContent = `Rain - ${currentWeather.precipitation_probability || 0}%`;

        // Update the weekly forecast
        const forecastContainer = document.getElementById("forecast-container");
        forecastContainer.innerHTML = ""; // Clear previous data

        dailyData.time.forEach((dateString, index) => {
            const date = new Date(dateString);
            const day = getWeekday(date);
            const maxTemp = Math.round(dailyData.temperature_2m_max[index]);
            const minTemp = Math.round(dailyData.temperature_2m_min[index]);
            const weatherCode = dailyData.weathercode[index];
            const icon = getWeatherIcon(weatherCode);

            // Create and add a forecast card
            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <p class="day">${day}</p>
                    <img src="img/${icon}" alt="Weather Icon">
                    <p class="temp">${maxTemp}° - ${minTemp}°</p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("current-temp").textContent = "20°C";
    }
}

// Helper function to format the date
function formatDate(date) {
    const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleString("en-US", options);
}

// Helper function to get weekday name
function getWeekday(date) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[date.getDay()];
}

// Helper function to map weather codes to descriptions
function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear Sky",
        1: "Partly Cloudy",
        2: "Cloudy",
        3: "Rain",
        45: "Foggy",
        48: "Freezing Fog",
        51: "Light Rain Showers",
        61: "Heavy Rain",
    };
    return descriptions[code] || "Unknown Weather";
}

// Helper function to map weather codes to icons
function getWeatherIcon(code) {
    const icons = {
        0: "sunny-icon.svg",
        1: "cloudy-icon.svg",
        2: "cloudy-icon.svg",
        3: "rainy-icon.svg",
        45: "foggy-icon.svg",
        48: "foggy-icon.svg",
        51: "rainy-icon.svg",
        61: "rainy-icon.svg",
    };
    return icons[code] || "unknown-icon.svg";
}

// Initialize the weather dashboard
fetchWeather();
