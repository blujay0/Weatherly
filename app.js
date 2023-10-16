import { WEATHER_API_KEY } from './config/api-key.js';

document.addEventListener('DOMContentLoaded', () => {
  const currentYear = new Date().getFullYear();
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const weatherData = document.querySelector('.weather-data');
  // const locationEl = document.querySelector('location');
  // const temperatureEl = document.querySelector('temperature');
  // const weatherEl = document.querySelector('weather');

  // import .env library (for use with a server)
  // require('dotenv').config()

  // access the API key from the environment variable (for use with a server)
  // const apiKey = process.env.WEATHER_API_KEY;

  // access the API key
  const apiKey = WEATHER_API_KEY;

  // set the api endpoint to a var for simplicity
  const apiEndpoint = "http://api.weatherapi.com/v1/current.json";

  // for keeping the year updated in the footer
  document.getElementById("currentYear").innerHTML = currentYear;

  // function to fetch weather data and update HTML
  const getWeather = () => {
    const city = cityInput.value.trim(); // Get the city input by the user and remove white space from the ends of the string

    // check if the user input is not empty
    if (city) {
      // construct the API URL with the user's input
      const apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}`;
      console.log("API URL:", apiUrl); // log API URL

      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          console.log("Weather Data:", data); // log the fetched weather data

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
  };

  cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  });

  searchBtn.addEventListener('click', getWeather);
});
