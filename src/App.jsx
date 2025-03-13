import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './screens/login/Login'; // Ensure this path is correct
import MainContent from './MainContent/MainContent'; // Ensure this path is correct
import { ThemeContext } from './threedots/settings/ThemeContext'; // Ensure this path is correct
import { auth } from './firebaseConfig'; // Import Firebase auth configuration
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth listener
import NotificationComponent from './notification/NotificationComponent'; // Adjust the path as necessary
import plantGif from './assets/plantgif3.gif'; // Import the GIF

function App() {
  const { toggleTheme, isDarkMode } = useContext(ThemeContext); // Access theme context
  const [user, setUser] = useState(null); // State to store current user
  const [loading, setLoading] = useState(true); // Loading state during auth check

  // Check for authenticated user on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update the user state
      setLoading(false); // End loading when auth check completes
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    // Centered loading GIF
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img src={plantGif} alt="Loading" style={{ width: '200px', height: '200px' }} />
      </div>
    );
  }

  return (
    <Router>
      <div className={isDarkMode ? 'dark-theme' : 'light-theme'}>
        {/* <NotificationComponent /> Add the notification component here */}
        <Routes>
          {/* Redirect to MainContent if authenticated, otherwise show Login */}
          <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
          <Route path="/*" element={user ? <MainContent /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
