document.addEventListener('DOMContentLoaded', () => {

  // import the dotenv library
  require('dotenv').config();

  // access the API key from the environment variable
  const apiKey = process.env.WEATHER_API_KEY;

  const currentYear = new Date().getFullYear();

  document.getElementById("currentYear").innerHTML = currentYear;

});