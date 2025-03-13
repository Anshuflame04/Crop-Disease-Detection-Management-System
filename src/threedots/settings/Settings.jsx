// src/Settings.jsx
import React, { useContext, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { FaSun, FaMoon, FaLanguage, FaBell } from 'react-icons/fa'; // Import icons
import './Settings.css';

const Settings = () => {
  // Get the current theme and toggle function from ThemeContext
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  // State to manage the selected language and notifications
  const [language, setLanguage] = useState('English'); // Default language set to English
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Notifications are enabled by default

  // Handle language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value); // Update the language state when a new language is selected
  };

  // Handle notification toggle
  const handleNotificationToggle = () => {
    setNotificationsEnabled((prev) => !prev); // Toggle notifications on or off
  };

  // Handle save changes action
  const handleSaveChanges = () => {
    alert('Settings saved!'); // Alert user that settings are saved; replace with actual save logic later
  };

  return (
    <div className={`settings-page ${isDarkMode ? 'dark' : 'light'}`}> {/* Apply dark or light class based on theme */}
      <h1 className="settings-title">Settings</h1>
      
      <div className="theme-toggle">
        <h2 className="toggle-title">
          <FaMoon className="icon" /> Theme
        </h2>
        <label className="notification-toggle">
          <span className={`switch ${isDarkMode ? 'on' : 'off'}`}> {/* Change switch style based on theme state */}
            <input 
              type="checkbox" 
              checked={isDarkMode} 
              onChange={toggleTheme} 
              className="switch-input"
            />
            <span className="slider"></span>
          </span>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'} {/* Show current theme status */}
        </label>
      </div>
      
      <div className="language-selection">
        <h2 className="toggle-title">
          <FaLanguage className="icon" /> Language
        </h2>
        <select value={language} onChange={handleLanguageChange} className="language-select">
          <option value="English">English</option>
          <option value="Spanish">Hindi</option>
          <option value="French">Odia</option>
          <option value="German">Bengali</option>
          <option value="Chinese">Gujrati</option>
          <option value="Chinese">Asami</option>
        </select>
      </div>

      <div className="notification-settings">
        <h2 className="toggle-title">
          <FaBell className="icon" /> Notifications
        </h2>
        <label className="notification-toggle">
          <span className={`switch ${notificationsEnabled ? 'on' : 'off'}`}> {/* Change switch style based on notifications state */}
            <input 
              type="checkbox" 
              checked={notificationsEnabled} 
              onChange={handleNotificationToggle} 
              className="switch-input"
            />
            <span className="slider"></span>
          </span>
          {notificationsEnabled ? 'Enabled' : 'Disabled'} {/* Show current notification status */}
        </label>
      </div>

      <button className="save-button" onClick={handleSaveChanges}>
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
