import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './ChatBot.css'; // Import the CSS file for styling
import { FaPaperPlane } from 'react-icons/fa'; // Importing an icon for the send button

const ChatBot = () => {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (prompt.trim() === '') return;

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'user', message: prompt },
    ]);

    try {
      // const res = await axios.post('http://localhost:8000/chat', { prompt });
      const res = await axios.post('https://plant-disease-detection-pxkz.onrender.com/chat', { prompt });
      const botResponse = res.data.response;

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'bot', message: botResponse },
      ]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'bot', message: 'Error: Unable to get response from server' },
      ]);
    }

    setPrompt('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h4>Plant App Chatbot</h4>
      </div>
      <div className="chatbot-messages">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-message ${
              chat.sender === 'user' ? 'user-message' : 'bot-message'
            }`}
          >
            <ReactMarkdown>{chat.message}</ReactMarkdown>
          </div>
        ))}
      </div>
      <form className="chatbot-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your message..."
          className="chatbot-input"
        />
        <button type="submit" className="chatbot-send-button">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
