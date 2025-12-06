// script.js

// This function is called when you click the "Search" button
async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  
  // 🚨 Put your actual OpenWeather API key here:
  const apiKey = "fb48f08808fff16a4b9063570f8d109a";

  // If the input is empty, show a message and stop
  if (searchInput == "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  // ---------- Inner function 1: Get longitude and latitude ----------
  async function getLonAndLat() {
    const countryCode = "IN"; // As used in the tutorial
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();

    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return;
    } else {
      return data[0]; // First result (object with lon, lat, name, etc.)
    }
  }

  // ---------- Inner function 2: Get weather data using lon & lat ----------
  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();

    // Show icon + text side by side
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" 
           alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
  }

  // Clear the input box
  document.getElementById("search").value = "";

  // Get geo data then get weather
  const geocodeData = await getLonAndLat();
  if (!geocodeData) return; // If something went wrong, stop

  getWeatherData(geocodeData.lon, geocodeData.lat);
}
