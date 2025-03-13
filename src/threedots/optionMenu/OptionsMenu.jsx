import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig'; // Firebase auth import
import './OptionsMenu.css'; // Add CSS styles for your options menu

const OptionsMenu = ({ toggleOptions }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();
  const menuRef = useRef(null); // Ref for the options menu

  // Check if the user is logged in using Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); // Update login status
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  // Hide menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleOptions(); // Hide the menu
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleOptions]);

  const handleLogoutClick = async (e) => {
    e.preventDefault(); // Prevent default navigation

    const confirmLogout = window.confirm('Do you really want to log out?'); // Ask for confirmation

    if (confirmLogout) {
      try {
        await auth.signOut(); // Sign out the user
        alert('You have successfully logged out.');
        toggleOptions(); // Close options menu
        navigate('/login'); // Navigate back to login after logout
      } catch (error) {
        console.error('Logout error:', error.message);
        alert('Error logging out.'); // User-friendly error message
      }
    } else {
      alert('Logout cancelled.'); // Inform user logout was cancelled
    }
  };

  return (
    <div className="options-menu" ref={menuRef}>
      <ul>
        <li>
          <Link to="/settings" onClick={toggleOptions}>Settings</Link>
        </li>
        <li>
          <Link to="/profile" onClick={toggleOptions}>Profile</Link>
        </li>
        <li>
          <Link to="/history" onClick={toggleOptions}>History</Link>
        </li>
        <li>
          <Link to="/about" onClick={toggleOptions}>About Us</Link>
        </li>
        {isLoggedIn && (
          <li>
            <Link to="/logout" onClick={handleLogoutClick}>Logout</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default OptionsMenu;
