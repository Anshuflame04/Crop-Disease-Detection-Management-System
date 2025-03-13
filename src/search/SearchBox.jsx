// SearchBox.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchBox.css';

const SearchBox = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);

  // Toggle search box visibility
  const handleSearchToggle = () => setShowSearch((prev) => !prev);

  // Close search box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchBoxRef]);

  // Handle search input change
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchMap = {
      'home': '/home',
      'upload': '/upload',
      'community': '/community',
      'chatexpert': '/chatexpert',
      'settings': '/settings',
      'profile': '/profile',
      'history': '/history',
      'about': '/about'
    };

    const lowerCaseTerm = searchTerm.toLowerCase();
    if (searchMap[lowerCaseTerm]) {
      navigate(searchMap[lowerCaseTerm]);
      setShowSearch(false);
      setSearchTerm("");
    } else {
      alert("Page not found");
    }
  };

  return (
    <div className="search-box" ref={searchBoxRef}>
      <FaSearch className="search-icon" onClick={handleSearchToggle} />
      {showSearch && (
        <div className="search-popup">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Type 'upload', 'community'..."
              className="search-input"
              autoFocus
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
