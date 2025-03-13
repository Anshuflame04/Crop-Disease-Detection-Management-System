// src/firebaseConfig.js

import { initializeApp } from "firebase/app"; // Firebase app initialization
import { getAuth } from "firebase/auth"; // Firebase authentication
import { getFirestore } from "firebase/firestore"; // Firestore database
import { getStorage } from "firebase/storage"; // Firebase storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARIjQ4Ex4l7juv8hQLQV9xf71BB3djlV0",
  authDomain: "plant-app1.firebaseapp.com",
  projectId: "plant-app1",
  storageBucket: "plant-app1.appspot.com",
  messagingSenderId: "1035431173693",
  appId: "1:1035431173693:web:7d5b0f0d48b60c47c4bc30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
const auth = getAuth(app); // Firebase authentication instance
const db = getFirestore(app); // Firestore database instance
const storage = getStorage(app); // Firebase storage instance

export { auth, db, storage }; // Export instances for use in other components
