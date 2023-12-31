import { WEATHER_API_KEY } from './config/api-key.js';

document.addEventListener('DOMContentLoaded', () => {
  const currentYear = new Date().getFullYear();
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const currentWeatherContainer = document.querySelector('.current-data');
  const todayForecastContainer = document.querySelector('.today-data'); // Container for today's forecast
  const todayLocation = document.querySelector('.today-h2');
  const weekLocation = document.querySelector('.week-h2');
  const weekForecastContainer = document.querySelector('.week-data');

  // Access the API key
  const apiKey = WEATHER_API_KEY;

  // API endpoint for current weather data
  const currentApiEndpoint = "https://api.weatherapi.com/v1/current.json";

  // API endpoint for daily forecast data
  const todayApiEndpoint = "https://api.weatherapi.com/v1/forecast.json";

  // API endpoint for week forecast data
  const weekApiEndpoint = "https://api.weatherapi.com/v1/forecast.json";


  // For keeping the year updated in the footer
  document.getElementById("currentYear").innerHTML = currentYear;

  // fetch current weather data and update HTML for current.html
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

                <div id="current-location">
                  <img src="css/media/location-marker-white-cropped.svg">
                  <p class="location">${location}</p>
                </div>

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

          currentWeatherContainer.innerHTML = weatherHtml;
        })
        .catch(error => {
          // Handle errors for current.html
          if (error.message === 'Network response was not ok') {
            currentWeatherContainer.innerHTML = '<p class="error-msg">⚠️ Location not found. Please try again!</p>';
          } else if (error.message.includes('Weather API error')) {
            currentWeatherContainer.innerHTML = `<p class="error-msg">⚠️ ${error.message}</p>`;
          } else {
            currentWeatherContainer.innerHTML = '<p class="error-msg">⚠️ An unknown error occurred. Please try again!</p>';
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
          const todayData = data.forecast.forecastday[0].hour; // access the hourly data for the day
          const location = data.location.name;
          todayLocation.innerHTML = '';

          todayLocation.innerHTML = `
            <div id="today-location">
              <img src="css/media/location-marker-white-cropped.svg">
              <p>${location}</p>
            </div>
          `; // Updates the location in the <h2> element

          // clear previous data before appending new data
          todayForecastContainer.innerHTML= '';

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
                <img src="${weatherIcon}" alt="hourly weather symbol" class="hourly-icon">
                <p class="temp">${temperatureC} °C | ${temperatureF} °F </p>
                <p class="weather">${condition}</p>
              </div>
            `;

            todayForecastContainer.insertAdjacentHTML('beforeend', todayHtml);
          });
        })
        .catch(error => {
          // Handle errors for today.html
          console.error('Error fetching daily weather data:', error);
          const todayData = document.querySelector('.today-data');

          // clear location element
          todayLocation.innerHTML = '';
          
          if (error.message === 'Network response was not ok') {
            todayData.innerHTML = '<p class="error-msg">⚠️ Location not found. Please try again!</p>';
          } else if (error.message.includes('Weather API error')) {
            todayData.innerHTML = `<p class="error-msg">⚠️ ${error.message}</p>`;
          } else {
            todayData.innerHTML = '<p class="error-msg">⚠️ An unknown error occurred. Please try again!</p>';
          }
        });
    }
  };

  // Function to fetch week forecast data and update HTML for week.html
  const getWeekForecast = () => {
    const search = searchInput.value.trim();
  
    if (search) {
      const apiUrl = `${weekApiEndpoint}?key=${apiKey}&q=${search}&days=7&aqi=yes&alert=yes`;
  
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          const forecastDays = data.forecast.forecastday;
          weekForecastContainer.innerHTML = ''; // clear previous data
  
          const location = data.location.name;
  
          // Create an image element for the location marker
          const locationMarker = document.createElement('img');
          locationMarker.src = 'css/media/location-marker-white-cropped.svg'; // set the source path
          locationMarker.alt = 'location marker';
  
          // Update the location in the <h2> element and add the image
          weekLocation.textContent = location;
          weekLocation.prepend(locationMarker);
  
          forecastDays.forEach((dayData) => {
            const date = dayData.date;
            const maxTempC = dayData.day.maxtemp_c;
            const maxTempF = dayData.day.maxtemp_f;
            const minTempC = dayData.day.mintemp_c;
            const minTempF = dayData.day.mintemp_f;
            const condition = dayData.day.condition.text;
            const weatherIcon = dayData.day.condition.icon;
          
            // Create a card for each day
            const card = document.createElement('div');
            card.classList.add('weekly-card');
          
            const weekHtml = `
              <div class="week-forecast">
                <img src="${weatherIcon}" alt="weather symbol" class="weather-icon">
                <p class="date">${date}</p>
                <p class="max-temp">Highs ${maxTempC}°C | ${maxTempF}°F</p>
                <p class="min-temp">Lows ${minTempC}°C | ${minTempF}°F</p>
                <p class="condition">${condition}</p>
              </div>
            `;
          
            card.innerHTML = weekHtml;
          
            weekForecastContainer.appendChild(card);
          });
        })
        .catch((error) => {
          // Handle errors
          if (error.message === 'Network response was not ok') {
            weekForecastContainer.innerHTML = '<p class="error-msg">Location not found. Please try again!</p>';
          } else {
            weekForecastContainer.innerHTML = '<p class="error-msg">An unknown error occurred. Please try again!</p>';
          }
  
          // Clear the location and image if there's an error
          weekLocation.textContent = '';
        });
    } else {
      // Clear the location and image if the input is empty
      weekLocation.textContent = '';
      weekForecastContainer.innerHTML = '';
    }
  };

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      getCurrentWeather(); // for current.html
      getDailyForecast(); // for today.html
      getWeekForecast(); // for week.html
    }
  });

  searchBtn.addEventListener('click', () => {
    getCurrentWeather(); // for current.html
    getDailyForecast(); // for today.html
    getWeekForecast(); // for week.html
  });
});