import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from '../screens/Home/Home';
import Upload from '../screens/Upload/UploadTry';
import Community from '../screens/Community/Community';
import ChatExpert from '../screens/ChatExpert/ChatExpert';
import SearchBox from '../search/SearchBox';
import { FaSearch, FaEllipsisV, FaHome, FaUpload, FaUsers, FaComments, FaTimes, FaStoreAlt } from 'react-icons/fa';
import OptionsMenu from '../threedots/optionMenu/OptionsMenu';
import Login from '../screens/login/Login';
import Settings from '../threedots/settings/Settings';
import Profile from '../threedots/profile/Profile';
import History from '../threedots/history/History';
import About from '../threedots/about/About';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import './MainContent.css';

import roboGif from '../assets/robo.gif'; // Import robo.gif for the chatbot icon
import ChatBot from '../chatbot/ChatBot'; // Import the ChatBot component
import MarketPlace from '../MarketPlace/MarketPlace'; // Import the MarketPlace component

const MainContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false); // State to control chatbot visibility
  const [userDetails, setUserDetails] = useState(null);

  // Toggle the options menu when the three dots are clicked
  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  // Toggle the chatbot visibility when the icon is clicked
  const toggleChatBot = () => {
    setShowChatBot((prev) => !prev);
  };

  // Fetch user details from Firebase when user is authenticated
  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setUserDetails(snapshot.val());
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } else {
        setUserDetails(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1 className="app-name">FarmSync.AI</h1>
        <div className="header-icons">
          {/* Chatbot icon toggled with a cross icon */}
          <button className="chatbot-icon-button" onClick={toggleChatBot}>
            {showChatBot ? (
              <FaTimes
                className="chatbot-cross-icon"
                style={{
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  margin: '5px'
                }}
              />
            ) : (
              <img
                src={roboGif}
                alt="ChatBot"
                className="chatbot-icon"
                style={{
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  margin: '5px'
                }}
              />
            )}
          </button>

          <SearchBox />
          <FaEllipsisV
            className="icon menu-icon"
            onClick={toggleOptions}
            style={{ marginRight: '8px', color: 'white' }}
          />
        </div>
      </div>

      {showOptions && <OptionsMenu toggleOptions={toggleOptions} />}
      
      {showChatBot && (
        <div className="chatbot-screen">
          <ChatBot />
        </div>
      )}

      <div className="content">
        {userDetails && (
          <div className="user-details">
            <img src={userDetails.photo} alt="User" className="user-photo" />
            <p>Name: {userDetails.name}</p>
            <p>Phone: {userDetails.phone}</p>
            <p>Email: {userDetails.email}</p>
            <p>Age: {userDetails.age}</p>
            <p>Gender: {userDetails.gender}</p>
          </div>
        )}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/community" element={<Community />} />
          <Route path="/chatexpert" element={<ChatExpert />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/market" element={<MarketPlace />} /> {/* Add the route for the MarketPlace */}
        </Routes>
      </div>

      <footer className="footer">
        <Link to="/home" className={`footerButton ${location.pathname === '/home' ? 'active' : ''}`}>
          <FaHome className="footer-icon" />
          Home
        </Link>
        <Link to="/upload" className={`footerButton ${location.pathname === '/upload' ? 'active' : ''}`}>
          <FaUpload className="footer-icon" />
          Upload
        </Link>
        <Link to="/community" className={`footerButton ${location.pathname === '/community' ? 'active' : ''}`}>
          <FaUsers className="footer-icon" />
          Community
        </Link>
        <Link to="/market" className={`footerButton ${location.pathname === '/market' ? 'active' : ''}`}>
          <FaStoreAlt className="footer-icon" />
          Market {/* New Market button */}
        </Link>
      </footer>
    </div>
  );
};

export default MainContent;
