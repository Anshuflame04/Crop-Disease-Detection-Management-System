import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig'; // Firebase authentication and Firestore
import './Home.css'; // Import styles
import NewImage from '../../assets/HomePlant.jpg'; // Image for the home screen
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import CombinedWeatherSoilData from './weatherNsoil/CombinedWeatherSoilData'; // Weather and soil data component

const Home = () => {
  const [userName, setUserName] = useState(''); // User's name
  const [loading, setLoading] = useState(true); // Loading state for weather & soil data
  const [reloadCount, setReloadCount] = useState(0); // Track reload attempts

  // Function to simulate a reload effect
  const reloadData = () => {
    setLoading(true); // Show loading effect
    setTimeout(() => {
      setLoading(false); // Hide loading effect after 1 second
    }, 1000);
  };

  // Fetch the user's details from Firebase Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser; // Get current authenticated user

      if (user) {
        const userDocRef = doc(db, 'users', user.uid); // Reference to the Firestore document
        const userSnapshot = await getDoc(userDocRef); // Fetch user details

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserName(userData.name); // Set the user's name
        }
      }
    };

    fetchUserName();
  }, []);

  // **Handle Reload Logic for Weather & Soil Data**
  useEffect(() => {
    reloadData(); // Trigger the first reload

    // If data is still unavailable, reload again (max 3 attempts to avoid infinite loop)
    if (!loading && reloadCount < 3) {
      setTimeout(() => {
        setReloadCount((prevCount) => prevCount + 1);
        reloadData();
      }, 2000);
    }
  }, [reloadCount]);

  return (
    <div className="home-container">
      {/* <h3>by @AnshuFlame</h3> */}
      <div className="image-container">
        <img src={NewImage} alt="Plant Disease Detection" className="centered-image" /> {/* Use new image */}
      </div>
      <p className="welcome-text">Welcome, {userName.split(' ')[0]}✨</p> {/* Display first name */}

      {/* Show Loading Text or Weather & Soil Data */}
      {loading ? (
        <p className="loading-text">🔄 Loading weather & soil data...</p> // Loading effect
      ) : (
        <CombinedWeatherSoilData /> // Render the component once data is loaded
      )}
    </div>
  );
};

export default Home;
