import { useEffect, useState } from 'react';
import axios from 'axios';
import Soil from './Soil';
import Analysis from './Analysis';
import './CombinedWeatherSoilData.css';
import { FaTemperatureHigh, FaSpinner } from 'react-icons/fa'; // Import spinner

const CombinedWeatherSoilData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [error, setError] = useState('Please turn on location to access weather.'); // Initial message for location access
  const [loading, setLoading] = useState(true);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  // Function to fetch weather data based on geolocation
  const fetchWeatherByGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      () => {
        setError('Please turn on location to access weather.');
        setLoading(false);
      }
    );
  };

  // Fetch weather data
  const fetchWeather = async (latitude, longitude) => {
    const apiKey = 'c1c0379a11d187bf67add9116579a5b2';
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      setError(''); // Clear error message once data is fetched successfully
    } catch (err) {
      setError('Could not fetch weather data. Please try again later.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherByGeolocation();
  }, [weatherData]); // Re-attempt fetching data if weatherData is null (when location permission is enabled)

  const toggleAnalysis = () => {
    setIsAnalysisOpen(!isAnalysisOpen);
  };

  return (
    <div className="container">
      {loading && <FaSpinner className="loading-spinner" />} {/* Show spinner while loading */}
      {error && !loading && <p style={{ color: 'red' }}>{error}</p>}

      <Soil setSoilData={setSoilData} setError={setError} />

      {weatherData && weatherData.main && (
        <div className="card">
          <h2>Weather Information</h2>
          <p>
            Temperature: {weatherData.main.temp.toFixed(2)}°C 
            <FaTemperatureHigh className="temperature-icon" />
          </p>
          <p>Feels Like: {weatherData.main.feels_like.toFixed(2)}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <p>Pressure: {weatherData.main.pressure} hPa</p>
          <p>Cloudiness: {weatherData.clouds.all}%</p>
          <p>Location: {weatherData.name}, {weatherData.sys.country}</p>
        </div>
      )}

      {soilData && (
        <div className="card">
          <h2>Soil Information of Field</h2>
          <p>Soil Moisture: {(soilData.moisture * 100).toFixed(2)}%</p>
          <p>Surface Temperature: {(soilData.t0 - 273.15).toFixed(2)}°C</p>
          <p>Temperature at 10cm depth: {(soilData.t10 - 273.15).toFixed(2)}°C</p>
          <p>Latest By: {new Date(soilData.dt * 1000).toUTCString()}</p>
        </div>
      )}

      <button onClick={toggleAnalysis}>
        {isAnalysisOpen ? 'Hide Analysis' : 'Show AI Analysis'}
      </button>

      <Analysis 
        weatherData={weatherData} 
        soilData={soilData} 
        isOpen={isAnalysisOpen} 
        onClose={toggleAnalysis} 
      />
    </div>
  );
};

export default CombinedWeatherSoilData;
