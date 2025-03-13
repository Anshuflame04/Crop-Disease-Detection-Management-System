import { useState } from "react";
import { db } from "../../firebaseConfig"; // Ensure you have Firebase config imported
import { collection, addDoc } from "firebase/firestore";

const Result = ({ selectedCrop, uploadedImage, prediction }) => {
  const [feedback, setFeedback] = useState(null); // State to track user feedback
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false); // Track if feedback has been submitted

  const handleFeedback = async (isUseful) => {
    setFeedback(isUseful ? "useful" : "not useful");
    setFeedbackSubmitted(true); // Mark feedback as submitted

    try {
      await addDoc(collection(db, "feedbacks"), {
        predictionId: prediction.id, // Reference to the prediction document
        useful: isUseful,
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f8ff",
    },
    resultCard: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      padding: "20px",
      width: "350px",
      textAlign: "left",
      marginTop: "20px",
    },
    resultTitle: {
      margin: "0 0 10px",
      color: "#333",
    },
    resultImage: {
      width: "70%",
      height: "auto",
      
      display: "block",
      margin: "0 auto",
      borderRadius: "8px",
      marginBottom: "10px",
    },
    detailsBox: {
      backgroundColor: "#f9f9f9",
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "10px",
    },
    goldenBox: {
      backgroundColor: "gold",
      padding: "8px",
      borderRadius: "5px",
      margin: "5px 0",
      fontWeight: "bold",
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 15px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      width: "100%",
      marginTop: "10px",
    },
    feedbackButton: {
      margin: "5px",
      padding: "10px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.resultCard}>
        <h1 style={styles.resultTitle}>Prediction Result</h1>
        <img src={uploadedImage} alt="Uploaded" style={styles.resultImage} />
        <h2 style={{ color: "#4CAF50" }}>
          {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Crop
        </h2>
        <div style={styles.detailsBox}>
          <h3 style={{ margin: "0" }}>Prediction: {prediction.predicted_disease}</h3>
          <p>
            <strong>Confidence:</strong> {prediction.confidence_score.toFixed(2)}%
          </p>
          <p>
            <strong>Cause:</strong> {prediction.cause}
          </p>
          <p>
            <strong>Prevention:</strong> {prediction.prevention}
          </p>
          <p>
            <strong>Medicines:</strong> {prediction.medicines}
          </p>
          {/* Highlighted Fields with Golden Background */}
          <p style={styles.goldenBox}>
            <strong>Organic Pesticides:</strong> {prediction.organic_pesticides}
          </p>
          <p style={styles.goldenBox}>
            <strong>Natural Fertilizers:</strong> {prediction.natural_fertilizers}
          </p>
        </div>

        {/* Feedback Buttons */}
        <div>
          <button
            style={{
              ...styles.feedbackButton,
              backgroundColor: "#4CAF50",
              color: "white",
            }}
            onClick={() => handleFeedback(true)}
            disabled={feedbackSubmitted} // Disable button if feedback is already given
          >
            👍 Useful
          </button>
          <button
            style={{
              ...styles.feedbackButton,
              backgroundColor: "#f44336",
              color: "white",
            }}
            onClick={() => handleFeedback(false)}
            disabled={feedbackSubmitted} // Disable button if feedback is already given
          >
            👎 Not Useful
          </button>
        </div>
        {feedback && <p>{`You found this prediction ${feedback}.`}</p>}

        <button style={styles.button} onClick={() => window.location.reload()}>
          Upload Another Image
        </button>
      </div>
    </div>
  );
};

export default Result;
