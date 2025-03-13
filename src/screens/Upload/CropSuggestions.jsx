import React, { useEffect, useState } from 'react';
import Weather from '../Home/weatherNsoil/Weather6'; // Correct import path
import Soil from '../Home/weatherNsoil/Soil'; // Correct import path
import './CropSuggestions.css'; // Ensure this CSS file exists for styling

// Function to generate crop-specific suggestions based on weather and soil data
const getCropSpecificSuggestions = (crop, weatherData, soilData) => {
  if (!crop || !weatherData || !soilData) {
    return ["Insufficient data available to provide suggestions."];
  }

  let cropSuggestions = [];

  // Suggestions based on the crop type
  switch (crop.toLowerCase()) {
    case 'rice':
      if (weatherData.main?.temp > 30) {
        cropSuggestions.push("Rice crops may experience heat stress; ensure proper water management to cool the plants.");
      }
      if (weatherData.main?.temp < 20) {
        cropSuggestions.push("Lower temperatures may slow rice growth. Monitor closely for delayed maturation.");
      }
      if (soilData.moisture < 40) {
        cropSuggestions.push("Maintain higher soil moisture levels for optimal rice growth.");
      }
      if (weatherData.main?.humidity < 60) {
        cropSuggestions.push("Low humidity may affect transpiration in rice. Consider supplemental irrigation.");
      }
      break;

    case 'tomato':
      if (weatherData.main?.humidity > 85) {
        cropSuggestions.push("High humidity can increase the risk of fungal diseases for tomatoes. Consider fungicide application.");
      }
      if (soilData.moisture > 60) {
        cropSuggestions.push("Excess moisture can lead to root rot in tomato plants. Ensure proper drainage.");
      }
      if (weatherData.main?.temp > 35) {
        cropSuggestions.push("High temperatures can cause flower drop in tomatoes. Provide shade if possible.");
      }
      if (weatherData.main?.temp < 15) {
        cropSuggestions.push("Cool temperatures can slow down tomato growth and fruit setting. Use row covers to retain warmth.");
      }
      break;

    case 'potato':
      if (soilData.t1 && soilData.t1 - 273.15 < 10) { // Assuming soilData.t1 is in Kelvin
        cropSuggestions.push("Low soil temperatures can slow potato growth. Consider mulching to retain soil warmth.");
      }
      if (soilData.moisture < 20) {
        cropSuggestions.push("Ensure soil moisture levels are adequate to avoid stunted growth in potatoes.");
      }
      if (weatherData.wind?.speed > 5) {
        cropSuggestions.push("Strong winds can damage potato plants. Use windbreaks if necessary.");
      }
      if (weatherData.main?.humidity > 80) {
        cropSuggestions.push("High humidity can lead to late blight in potatoes. Monitor for disease signs and apply fungicide if needed.");
      }
      break;

    case 'apple':
      if (weatherData.main?.temp < 15) {
        cropSuggestions.push("Cool temperatures are good for apple growth, but frost can be damaging. Take frost protection measures.");
      }
      if (weatherData.main?.temp > 30) {
        cropSuggestions.push("High temperatures can lead to sunscald on apple fruits. Use protective netting to provide shade.");
      }
      if (weatherData.main?.humidity < 50) {
        cropSuggestions.push("Low humidity can affect apple quality. Consider misting or irrigation to increase humidity.");
      }
      if (soilData.moisture < 30) {
        cropSuggestions.push("Ensure sufficient soil moisture to prevent stress on apple trees, especially during fruit development.");
      }
      break;

    default:
      cropSuggestions.push("No specific suggestions available for the selected crop.");
      break;
  }

  return cropSuggestions;
};

const CropSuggestions = ({ crop, cityName }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Callback to set weather data when fetched
  const handleWeatherDataFetched = (data) => {
    setWeatherData(data);
  };

  // Callback to set soil data when fetched
  const handleSoilDataFetched = (data) => {
    setSoilData(data);
  };

  // Effect to update suggestions when crop, weather, or soil data changes
  useEffect(() => {
    if (weatherData && soilData && crop) {
      const cropSuggestions = getCropSpecificSuggestions(crop, weatherData, soilData);
      setSuggestions(cropSuggestions);
    }
  }, [crop, weatherData, soilData]);

  return (
    <div className="crop-suggestions">
      <h2>Crop-Specific Suggestions for {crop.charAt(0).toUpperCase() + crop.slice(1)}</h2>
      <Weather cityName={cityName} onWeatherDataFetched={handleWeatherDataFetched} />
      <Soil onSoilDataFetched={handleSoilDataFetched} />
      <ul>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)
        ) : (
          <li>No specific recommendations at this time.</li>
        )}
      </ul>
    </div>
  );
};

export default CropSuggestions;
