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
  const city = cityInput.value.trim();

  if (city) {
    const apiUrl = `${apiEndpoint}?key=${apiKey}&q=${city}&days=1&aqi=yes&alert=yes`;
    console.log("API URL:", apiUrl);

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok'); // Handle HTTP error status
        }
        return res.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(`Weather API error: ${data.error.message}`); // Handle API-specific error
        }

        const location = data.location.name;
        const weather = data.current.condition.text;
        const weatherIcon = data.current.condition.icon;
        const temperature = data.current.temp_c;
        const time = data.location.localtime.slice(-4);
        const date = data.location.localtime.slice(0, 9);

        const weatherHtml = `
          <p>Location: ${location}</p>
          <p>Local Time: ${time}</p>
          <p>Date: ${date}</p>
          <img src="${weatherIcon}" alt="current weather symbol">
          <p>Weather: ${weather}</p>
          <p>Temperature: ${temperature} °C</p>
        `;

        weatherData.innerHTML = weatherHtml;
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        if (error.message === 'Network response was not ok') {
          weatherData.innerHTML = '<p>City not found. Please try again.</p>';
        } else if (error.message.includes('Weather API error')) {
          weatherData.innerHTML = `<p>${error.message}</p>`;
        } else {
          weatherData.innerHTML = '<p>An unknown error occurred. Please try again.</p>';
        }
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
