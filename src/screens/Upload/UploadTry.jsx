import React, { useState } from 'react';
import axios from 'axios';
import { auth, db, storage } from '../../firebaseConfig'; // Import Firebase config including auth
import { ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress'; // Loading indicator
import Result from './Result'; // Import the Result component
import './Upload8.css'; // Import the CSS styles
import { Link } from 'react-router-dom'; // For navigation

// Import crop icons from assets
import tomatoIcon from '../../assets/tomato.png';
import potatoIcon from '../../assets/potato.png';
import riceIcon from '../../assets/rice.png';
import appleIcon from '../../assets/apple.png';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('tomato'); // Default crop selection
  const [loading, setLoading] = useState(false); // State to track loading status

  // Get the current authenticated user
  const user = auth.currentUser;

  // Mapping crop names to icon images
  const cropIcons = {
    tomato: tomatoIcon,
    potato: potatoIcon,
    rice: riceIcon,
    apple: appleIcon,
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(imageUrl);
      setFileName(file.name);
    }
  };

  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
  };

  const handleUpload = async () => {
    if (!fileName) {
      alert('Please select a file first!');
      return;
    }

    setLoading(true); // Set loading to true when upload starts

    const formData = new FormData();
    const file = document.getElementById('file-input').files[0];
    formData.append('file', file);

    try {
      // Prediction API call
      const response = await axios.post(
        // `https://backend-6jmq.onrender.com/predict/${selectedCrop}`,
        `http://127.0.0.1:8000/predict/${selectedCrop}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Optional: Change the storage path to include the user's id if available
      const storagePath = user ? `images/${user.uid}/${fileName}` : `images/${fileName}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);

      // Save prediction details in Firestore, including the user's id
      const predictionDoc = await addDoc(collection(db, 'predictions'), {
        userId: user ? user.uid : null,
        crop: selectedCrop,
        diseaseDetected: response.data.predicted_disease,
        confidence: response.data.confidence_score,
        imageUrl: storagePath,
        date: new Date().toISOString(),
      });

      setPrediction({ ...response.data, id: predictionDoc.id });
    } catch (error) {
      console.error('Error uploading the file:', error);
      alert('Failed to upload the file. Please try again.');
    } finally {
      setLoading(false); // Set loading to false once operation is complete
    }
  };

  // If prediction exists, show the Result component instead of the Upload component
  if (prediction) {
    return (
      <Result
        selectedCrop={selectedCrop}
        uploadedImage={selectedFile}
        prediction={prediction}
      />
    );
  }

  // Render the Upload component
  return (
    <div className="upload-container">
      <div className="top-nav">
        {/* ChatExpert button linking to ChatExpert.jsx */}
        <Link to="/chatexpert" className="nav-link">
          Chat with Expert
        </Link>
      </div>

      <div className="upload-card">
        <h1 className="upload-title">Upload Image for Disease Prediction</h1>

        {/* Crop Selection */}
        <div className="crop-select-container">
          {['tomato', 'potato', 'rice', 'apple'].map((crop) => (
            <div
              key={crop}
              className={`crop-circle ${selectedCrop === crop ? 'selected' : ''}`}
              onClick={() => handleCropChange(crop)}
            >
              <img src={cropIcons[crop]} alt={crop} className="crop-icon" />
              <span className="crop-label">
                {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Image Upload Box */}
        <div
          className="upload-box"
          onClick={() => document.getElementById('file-input').click()}
        >
          {selectedFile ? (
            <img src={selectedFile} alt="Uploaded" className="image-preview" />
          ) : (
            <p className="upload-text">Click or Drop an Image Here</p>
          )}
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            className="hidden-file-input"
          />
        </div>

        {/* Loading indicator during upload/prediction */}
        {loading ? (
          <div className="loading-indicator">
            <CircularProgress />
            <p>Uploading and Predicting...</p>
          </div>
        ) : (
          <button onClick={handleUpload} className="upload-button">
            Upload and Predict
          </button>
        )}
      </div>
    </div>
  );
};

export default Upload;
