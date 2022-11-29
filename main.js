const form = document.querySelector('form');
const main = document.querySelector('main');
const input = document.querySelector('input');
const city = document.querySelector('.city');
const country = document.querySelector('.country');
const time = document.querySelector('.time');
const icon = document.querySelector('#icon');
const temp = document.querySelector('.temp');
const description = document.querySelector('.description');
const feels = document.querySelector('#feels-like');
const weatherContainer = document.querySelector('.weather-container');
const errorDiv = document.querySelector('.error');

// Get location from LS as previous location or Default Location is Islamabad
let searchCity =
  localStorage.getItem('city') == null
    ? 'Islamabad'
    : localStorage.getItem('city');

// API
const apiKey = 'f61f119ab17fd239b25d494626c2b863';

// Show default city on initial load
getWeather(searchCity);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  searchCity =
    input.value !== '' && isNaN(input.value) ? input.value.trim() : searchCity;

  localStorage.setItem('city', searchCity);

  getWeather(searchCity);
});

function handleError(code, msg) {
  errorDiv.innerHTML = `Error: ${code}, ${msg}`;
  errorDiv.style.display = 'block';
  weatherContainer.style.display = 'none';
  console.log(`Error: ${code}, ${msg}`);
}

// Fetch weather info and timezone
async function getWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  ).catch(handleError);

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(responseJson.cod, responseJson.message);
    return;
  }

  // Get Time of the searched location
  getTime(responseJson);

  async function getTime(data) {
    try {
      const response = await fetch(
        `http://secure.geonames.org/timezoneJSON?lat=${data.coord.lat}&lng=${data.coord.lon}&username=ilyas.459`
      );
      const responseJson = await response.json();

      showWeather(data, responseJson);
    } catch (error) {
      console.log(error);
    }
  }
}

function showWeather(data, timeZone) {
  weatherContainer.style.display = 'grid';
  errorDiv.style.display = 'none';
  city.textContent = data.name;
  country.textContent = data.sys.country;

  const currTime = new Date().toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timeZone.timezoneId,
    timeZoneName: 'short',
  });
  time.textContent = currTime;

  icon.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );

  temp.textContent = Math.round(data.main.temp);
  description.textContent = data.weather[0].description;
  feels.textContent = Math.round(data.main.feels_like);

  changeBg(data.weather[0].icon);
}

function changeBg(id) {
  if (id === '01d') {
    main.className = 'day-clear';
  }
  if (id[2] === 'd' && id !== '01d') {
    main.className = 'day-cloudy';
  }
  if (id === '01n') {
    main.className = 'night-clear';
  }
  if (id[2] === 'n' && id !== '01n') {
    main.className = 'night-cloudy';
  }
}
