// UI VARS
const searchInput = document.querySelector(".nav-search__txt");
const searchBtn = document.querySelector(".nav-search__btn");
const daysDOM = document.querySelector(".days-container");
const daysTitle = document.querySelector(".result-title");

// Data storage
let weatherData = [];
// Fetch Weather Data
class Weather {
  static async getWeather(_city) {
    let cityID;
    let cityURL = `https://www.metaweather.com/api/location/search/?query=${_city}`;
    let queryURL = "https://cors-anywhere.herokuapp.com/";
    try {
      await fetch(queryURL + cityURL)
        // await fetch("city.json")
        .then(res => res.json())
        .then(data => (cityID = data[0].woeid));
      await fetch(
        `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${cityID}/`
      )
        // await fetch("forecast.json")
        .then(res => res.json())
        .then(data => {
          let {
            title: city,
            parent: { title: country },
            consolidated_weather: [...days]
          } = data;
          return (weatherData = [{ days, city, country }]);
        });
    } catch (error) {
      return false;
    }
  }
}
// UI
class UI {
  setApp() {
    searchInput.focus();
    searchBtn.addEventListener("click", () => {
      if (!searchInput.value) {
        this.displayInfo("Please fill the search input");
      } else {
        let city = searchInput.value.toLowerCase();
        if (weatherData.length === 0) {
          this.displayInfo("Searching..");
        }
        this.displayWeather(city);
      }
      searchInput.value = "";
    });
  }

  async displayWeather(_city) {
    try {
      await Weather.getWeather(_city);

      const { city, country, days } = weatherData[0];
      daysTitle.innerHTML = `${city}. ${country}`;
      let str = "";
      days.forEach(day => {
        str += `
      <div class="day-item">
            <h2 class="applicable-date">${day.applicable_date}</h2>
            <p class="weather-state">
              <img src="https://www.metaweather.com/static/img/weather/${
                day.weather_state_abbr
              }.svg" alt="">
              <span>${day.weather_state_name}</span>
            </p >
        <p>Max:<span class="max-temp">${day.max_temp.toFixed(1)}</span></p>
        <p>Min:<span class="min-temp">${day.min_temp.toFixed(1)}</p>
          <p>Wind speed:<span class="wind-speed">${day.wind_speed.toFixed(
            2
          )}</p>
            <p>Humidity:<span class="humidity">${day.humidity}</span></p>
      </div>
    `;
      });
      daysDOM.innerHTML = str;
    } catch (error) {
      this.displayInfo("City not matched");
    }
  }
  displayInfo(message) {
    searchBtn.disabled = true;
    searchInput.disabled = true;
    daysTitle.innerHTML = message;
    daysDOM.innerHTML = "";
    setTimeout(() => {
      searchInput.disabled = false;
      searchBtn.disabled = false;
      daysTitle.innerHTML = "";
      daysDOM.style.display = "grid";
    }, 1200);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  ui.setApp();
});
