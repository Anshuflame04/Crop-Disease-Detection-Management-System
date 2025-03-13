import { useState } from 'react';
import axios from 'axios';

function Weather({ setWeatherData, setError }) {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState(null);

  const fetchWeather = async (cityName) => {
    setLoading(true); // Start loading
    try {
      const apiKey = 'c1c0379a11d187bf67add9116579a5b2';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );

      // Store the weather data in state
      setWeatherData(response.data);
      setWeatherInfo({
        temperature: response.data.main.temp,
        weather: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        pressure: response.data.main.pressure,
        location: response.data.name,
      });

      // Log the weather information to the console
      console.log("Weather Information:", {
        Temperature: `${response.data.main.temp} °C`,
        Weather: response.data.weather[0].description,
        Humidity: `${response.data.main.humidity} %`,
        WindSpeed: `${response.data.wind.speed} m/s`,
        Pressure: `${response.data.main.pressure} hPa`,
        Location: `${response.data.name}, IN`,
      });

      setError(''); // Reset any previous errors
    } catch (err) {
      setError('Could not fetch weather data. Please check the city name.');
      setWeatherData(null);
      setWeatherInfo(null);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeather(city);
      setCity(''); // Clear input after submission
    }
  };

  return (
    <div>
      <h2>Weather Information</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>
      {loading && <p>Loading...</p>} {/* Loading message */}

      {/* Display weather information if available */}
      {weatherInfo && (
        <div>
          <p>Temperature: {weatherInfo.temperature.toFixed(2)} °C</p>
          <p>Weather: {weatherInfo.weather}</p>
          <p>Humidity: {weatherInfo.humidity} %</p>
          <p>Wind Speed: {weatherInfo.windSpeed} m/s</p>
          <p>Pressure: {weatherInfo.pressure} hPa</p>
          <p>Location: {weatherInfo.location}, IN</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
