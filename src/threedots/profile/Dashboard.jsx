// src/Dashboard.jsx
import React from 'react';
import { auth } from '../../firebaseConfig'; // Import Firebase auth
import Profile from './Profile'; // Import Profile component

const Dashboard = () => {
  const user = auth.currentUser; // Get the current user

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <Profile user={user} /> // Pass user object to Profile
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default Dashboard;