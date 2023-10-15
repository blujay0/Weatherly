document.addEventListener('DOMContentLoaded', () => {

  // import the dotenv library
  require('dotenv').config();

  const currentYear = new Date().getFullYear();
  const cityInput = document.getElementById('city-input');
  const locationEl = document.getElementsByClassName('location');
  const temperatureEl = document.getElementsByClassName('temperature');
  const weatherEl = document.getElementsByClassName('weather');

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
          // construct the API url with the user input
          const apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}`;
        }
      }
    })
  }

});