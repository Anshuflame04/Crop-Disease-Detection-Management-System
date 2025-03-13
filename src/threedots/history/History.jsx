import React, { useEffect, useState } from 'react';
import { db, storage, auth } from '../../firebaseConfig'; // Import Firebase config and auth
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress'; // Loading indicator from Material UI
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser; // Get the current logged-in user

      if (!user) {
        console.log("No user is logged in");
        setLoading(false);
        return;
      }

      const userId = user.uid; // Get the user's ID

      // Query to get predictions made by the current user
      const predictionsCollection = collection(db, 'predictions');
      const userPredictionsQuery = query(predictionsCollection, where('userId', '==', userId));
      const predictionsSnapshot = await getDocs(userPredictionsQuery);

      // Query to get feedback for this user's predictions
      const feedbackCollection = collection(db, 'feedbacks');
      const feedbackSnapshot = await getDocs(feedbackCollection);

      const predictionsData = predictionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const feedbackData = feedbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort predictions by date descending (latest first)
      const sortedPredictions = predictionsData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Limit to only the latest 5 predictions
      const latestPredictions = sortedPredictions.slice(0, 5);

      // Combine predictions and feedback
      const combinedHistory = latestPredictions.map(prediction => ({
        ...prediction,
        feedback: feedbackData.filter(fb => fb.predictionId === prediction.id),
      }));

      // Fetch download URLs for images using the stored storage paths
      const historyWithImages = await Promise.all(
        combinedHistory.map(async (item) => {
          try {
            const imageRef = ref(storage, item.imageUrl); // item.imageUrl should be the storage path
            const downloadUrl = await getDownloadURL(imageRef); // Get the download URL from Firebase Storage
            return {
              ...item,
              imageUrl: downloadUrl,
            };
          } catch (error) {
            console.error("Error fetching download URL for item:", item.id, error);
            // Optionally return the item without updating the imageUrl or a fallback image URL
            return item;
          }
        })
      );

      setHistory(historyWithImages);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <div className="history-container">
      <h1>Prediction History</h1>
      <div className="history-cards">
        {history.map((item) => (
          <div className="history-card" key={item.id}>
            <img src={item.imageUrl} alt={`${item.crop} disease`} className="history-image" />
            <div className="history-details">
              <h4>{item.crop.charAt(0).toUpperCase() + item.crop.slice(1)} Crop</h4>
              <p style={{ margin: '0' }}>
                <strong>Disease Detected:</strong> {item.diseaseDetected}
              </p>
              <p style={{ margin: '0' }}>
                <strong>Confidence:</strong> {parseFloat(item.confidence).toFixed(2)}%
              </p>
              <p style={{ margin: '0', fontSize: 'smaller' }}>
                <strong>Date:</strong> {new Date(item.date).toLocaleString()}
              </p>
              <p style={{ margin: '0' }}>
                <strong>Feedback:</strong>{' '}
                {item.feedback.length > 0 ? (
                  <span>
                    {item.feedback.map((fb) => (
                      <span key={fb.id} style={{ marginRight: '5px' }}>
                        {fb.useful ? '👍 Useful' : '👎 Not Useful'}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span> Not given</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
