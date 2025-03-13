// src/Soil.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Soil = ({ setSoilData, setError }) => {
  const [loading, setLoading] = useState(true);

  const fetchSoilData = async () => {
    const soilApiKey = '901af0eb1909defa8e195a7230501728'; // Your Agromonitoring API key
    const polygonId = '6728da00287b0e61b4fd1a44'; // Your polygon ID
    try {
      const response = await axios.get(
        `https://api.agromonitoring.com/agro/1.0/soil?polyid=${polygonId}&appid=${soilApiKey}`
      );

      // Check if the response data exists
      if (response.data) {
        setSoilData(response.data);
        setError(''); // Clear any previous errors
      } else {
        throw new Error('No data found.');
      }
    } catch (err) {
      console.error('Error fetching soil data:', err.message);
      setError('Could not fetch soil data. Please try again later.');
      setSoilData(null);
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
    }
  };

  useEffect(() => {
    fetchSoilData(); // Fetch soil data on component mount
  }, []);

  if (loading) {
    return <p>Loading soil data...</p>; // Loading message
  }

  return null; // No UI needed for this component, data is passed up
};

export default Soil;
