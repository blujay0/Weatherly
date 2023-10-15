document.addEventListener('DOMContentLoaded', () => {

  // import the dotenv library
  require('dotenv').config();

  const currentYear = new Date().getFullYear();
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const weatherData = document.querySelector('weather-data');
  // const locationEl = document.querySelector('location');
  // const temperatureEl = document.querySelector('temperature');
  // const weatherEl = document.querySelector('weather');

  // access the API key from the environment variable
  const apiKey = process.env.WEATHER_API_KEY;
  const apiEndpoint = 
  "http://api.weatherapi.com/v1/current.json";

  // for keeping year updated in footer
  document.getElementById("currentYear").innerHTML = currentYear;

  // fetch weather data and update HTML
  const getWeather = () => {
    cityInput.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        const city = cityInput.value.trim(); // Get the city input by the user and remove white space from the ends of the string

        // check if the user input is not empty
        if (city) {
          // construct the API url with the user's input
          const apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}`;

          fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
              const location = data.location.name;
              const weather = data.current.condition.text;
              const temperature = data.current.temp_c;

              const weatherHtml = `
                <p>Location: ${location}</p>
                <p>Weather: ${weather}</p>
                <p>Temperature: ${temperature}°C</p>
              `;

              weatherData.innerHTML = weatherHtml;
          })
          .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherData.innerHTML = '<p>City not found. Please try again.</p>';
          });
        } else {
          alert('Please enter a city name.');
        }
      }

      cityInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
          getWeather();
        }
      });

      searchBtn.addEventListener('click', getWeather);
    })
  }

});