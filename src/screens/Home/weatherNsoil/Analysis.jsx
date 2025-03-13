import React from 'react';
import './Analysis.css'; // Ensure you create this CSS file for styles

const analyzeData = (weatherData, soilData) => {
  let insights = [];
  let recommendations = [];

  // Weather Data Insights
  if (weatherData) {
    const temperature = weatherData.main?.temp;
    const feelsLike = weatherData.main?.feels_like;
    const humidity = weatherData.main?.humidity;
    const windSpeed = weatherData.wind?.speed;
    const clouds = weatherData.clouds?.all;
    const rain = weatherData.rain ? weatherData.rain['1h'] : null;

    // Temperature Insights
    if (temperature !== undefined) {
      if (temperature >= 20 && temperature <= 30) {
        insights.push(`Temperature: ${temperature.toFixed(2)} °C is favorable for warm-season crops.`);
      } else {
        insights.push(`Temperature: ${temperature.toFixed(2)} °C may require monitoring for heat stress or cold impact.`);
      }
    } else {
      insights.push("Temperature data is not available.");
    }

    // Feels Like Insight
    if (feelsLike !== undefined) {
      insights.push(`Feels Like: ${feelsLike.toFixed(2)} °C indicates how the temperature feels to the body.`);
    }

    // Humidity Insights
    if (humidity !== undefined) {
      if (humidity > 90) {
        insights.push(`Humidity: ${humidity}% is high, increasing the risk of fungal diseases.`);
        recommendations.push("Implement preventive fungicides and ensure good air circulation.");
      } else if (humidity < 30) {
        insights.push(`Humidity: ${humidity}% is low, which could lead to plant dehydration.`);
        recommendations.push("Consider increasing humidity around the crops if possible.");
      }
    }

    // Wind Speed Insight
    if (windSpeed !== undefined) {
      if (windSpeed === 0) {
        insights.push("Wind Speed: Calm conditions can lead to stagnant air; ensure proper ventilation.");
      } else {
        insights.push(`Wind Speed: ${windSpeed.toFixed(2)} m/s is observed.`);
        if (windSpeed > 10) {
          recommendations.push("Take measures to protect plants from strong winds.");
        }
      }
    }

    // Cloud Cover Insight
    if (clouds !== undefined) {
      insights.push(`Cloud Cover: ${clouds}% of the sky is covered by clouds.`);
    }

    // Rain Insight
    if (rain !== null) {
      insights.push(`Rain: ${rain.toFixed(2)} mm of rain recorded in the last hour.`);
    } else {
      insights.push("Rain data is not available.");
    }
  } else {
    insights.push("No weather data available.");
  }

  // Soil Data Insights
  if (soilData) {
    const soilMoisture = soilData.moisture * 100; // Convert to percentage
    if (soilMoisture < 10) {
      insights.push(`Soil Moisture: ${soilMoisture.toFixed(2)}% is low, consider irrigation.`);
      recommendations.push("Schedule irrigation to maintain adequate soil moisture.");
    } else if (soilMoisture > 50) {
      insights.push(`Soil Moisture: ${soilMoisture.toFixed(2)}% is high, watch for potential waterlogging.`);
      recommendations.push("Ensure proper drainage to prevent waterlogging.");
    } else {
      insights.push(`Soil Moisture: ${soilMoisture.toFixed(2)}% is within a healthy range.`);
    }

    const surfaceTemp = soilData.t0 ? soilData.t0 - 273.15 : null; // Convert from Kelvin to Celsius
    if (surfaceTemp !== null) {
      insights.push(`Surface Temperature: ${surfaceTemp.toFixed(2)} °C is within the ideal range for growth.`);
    }

    const tempAt10cm = soilData.t1 ? soilData.t1 - 273.15 : null; // Assuming t1 represents temperature at 10cm
    if (tempAt10cm !== null) {
      insights.push(`Temperature at 10 cm Depth: ${tempAt10cm.toFixed(2)} °C promotes root development.`);
    }
  } else {
    insights.push("No soil data available.");
  }

  // Final Output
  return {
    insights,
    recommendations,
  };
};

const Analysis = ({ weatherData, soilData, isOpen, onClose }) => {
  if (!isOpen) return null; // Render nothing if not open

  const { insights, recommendations } = analyzeData(weatherData, soilData);

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Analysis and Recommendations</h2>
        <h3>Insights</h3>
        <ul>
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
        <h3>Recommendations</h3>
        <ul>
          {recommendations.length > 0 ? (
            recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))
          ) : (
            <li>No specific recommendations at this time.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Analysis;
