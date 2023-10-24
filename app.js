import { WEATHER_API_KEY } from './config/api-key.js';

document.addEventListener('DOMContentLoaded', () => {
  const currentYear = new Date().getFullYear();
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const currentData = document.querySelector('.current-data');
  const todayForecastContainer = document.querySelector('.today-data'); // Container for today's forecast

  // Access the API key
  const apiKey = WEATHER_API_KEY;

  // API endpoint for current weather data
  const currentApiEndpoint = "https://api.weatherapi.com/v1/current.json";

  // API endpoint for daily forecast data
  const todayApiEndpoint = "https://api.weatherapi.com/v1/forecast.json";

  // For keeping the year updated in the footer
  document.getElementById("currentYear").innerHTML = currentYear;

  // Function to fetch current weather data and update HTML for current.html
  const getCurrentWeather = () => {
    const search = searchInput.value.trim();

    if (search) {
      const apiUrl = `${currentApiEndpoint}?key=${apiKey}&q=${search}&aqi=yes&alert=yes`;

      fetch(apiUrl)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok'); // Handle HTTP error status
          }
          return res.json();
        })
        .then(data => {
          // Handle current weather data for current.html
          const location = data.location.name;
          const weather = data.current.condition.text;
          const weatherIcon = data.current.condition.icon;
          const temperatureC = data.current.temp_c;
          const temperatureF = data.current.temp_f;
          const time = data.location.localtime.slice(-4);
          const date = data.location.localtime.slice(0, 10);
          const humidity = data.current.humidity;

          const weatherHtml = `
            <div class='weather-card'>
              <div class='row-1'>
                <p class="location">${location}</p>
                <div class="date-time">
                  <p class="time">${time}</p>
                  <p class="date">${date}</p>
                </div>
              </div>

              <div class='row-2'>
                <p class="temp">${temperatureC} °C | ${temperatureF} °F</p>
                <img src="${weatherIcon}" alt="current weather symbol" class="weather-icon">
              </div>
              
              <div class='row-3'>
                <p class "weather">${weather} with ${humidity}% humidity</p>
              </div>
            </div>
          `;

          currentData.innerHTML = weatherHtml;
        })
        .catch(error => {
          // Handle errors for current.html
          if (error.message === 'Network response was not ok') {
            currentData.innerHTML = '<p class="error-msg">⚠️ Location not found. Please try again!</p>';
          } else if (error.message.includes('Weather API error')) {
            currentData.innerHTML = `<p class="error-msg">⚠️ ${error.message}</p>`;
          } else {
            currentData.innerHTML = '<p class="error-msg">⚠️ An unknown error occurred. Please try again!</p>';
          }
        });
    }
  };

  // Function to fetch daily forecast data and update HTML for today.html
  const getDailyForecast = () => {
    const search = searchInput.value.trim();

    if (search) {
      const apiUrl = `${todayApiEndpoint}?key=${apiKey}&q=${search}&days=1&aqi=yes&alerts=yes`;

      fetch(apiUrl)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok'); // Handle HTTP error status
          }
          return res.json();
        })
        .then(data => {
          // Handle daily forecast data for today.html
          const todayData = data.forecast.forecastday[0].hour; // Assuming you want the hourly data for the first day
          todayData.forEach(hour => {
            const time = hour.time.slice(-5);
            const temperatureC = hour.temp_c;
            const temperatureF = hour.temp_f;
            const condition = hour.condition.text;
            const weatherIcon = hour.condition.icon;

            // Create an HTML element for each hour's data and append it to the container
            const todayHtml = `
              <div class="hourly-card">
                <p class="hour">${time}</p>
                <p class="temp">${temperatureC} °C | ${temperatureF} °F</p>
                <p class="weather">${condition}</p>
                <img src="${weatherIcon}" alt="hourly weather symbol" class="hourly-icon">
              </div>
            `;

            todayForecastContainer.insertAdjacentHTML('beforeend', todayHtml);
          });
        })
        .catch(error => {
          // Handle errors for today.html
          // ...
        });
    }
  };

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      getCurrentWeather(); // For current.html
      getDailyForecast(); // For today.html
    }
  });

  searchBtn.addEventListener('click', () => {
    getCurrentWeather(); // For current.html
    getDailyForecast(); // For today.html
  });
});
