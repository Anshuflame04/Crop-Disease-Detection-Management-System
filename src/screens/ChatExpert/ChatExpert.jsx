// ChatExpert.jsx
import React, { useState } from 'react';
import './ChatExpert.css'; // Import the CSS file for styles

const ChatExpert = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      // Add User's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, sender: 'You' },
      ]);
      setInputValue('');

      // Simulate a reply from Expert
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Reply from Expert: ${inputValue}`, sender: 'Expert' },
        ]);
      }, 1000); // Simulate a delay for the reply
    }
  };

  const handlePredefinedMessage = (text) => {
    setInputValue(text);
    handleSend();
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        <h1 style={styles.header}>Chat with Experts</h1>
        <div style={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.sender === 'You' ? styles.user1 : styles.user2),
              }}
            >
              <p style={styles.messageText}>
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            </div>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.sendButton}>Send</button>
        </div>
        <div style={styles.predefinedContainer}>
          <p style={styles.predefinedHeader}>Predefined Messages:</p>
          <div style={styles.predefinedMessages}>
            {["What are the best crops for this season?", "How to improve soil health?", "What fertilizers do you recommend?"].map((text, index) => (
              <button key={index} onClick={() => handlePredefinedMessage(text)} style={styles.predefinedButton}>
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute', // Use absolute positioning
    top: '70px', // Start below the top bar (adjust according to your top bar height)
    bottom: '50px', // Leave space for bottom buttons (adjust as needed)
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
  },
  chatWindow: {
    width: '90%', // Use most of the available width
    maxWidth: '600px', // Limit maximum width for larger screens
    height: '100%', // Make the chat window fill the container height
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    margin: '10px 0',
    fontSize: '1.5rem',
    color: '#333',
  },
  messages: {
    padding: '15px',
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    margin: '10px 0',
    padding: '10px',
    borderRadius: '20px',
    maxWidth: '70%',
    wordWrap: 'break-word', // Break long words
  },
  user1: {
    backgroundColor: '#d1e8ff', // Light blue for User (You)
    alignSelf: 'flex-end', // Align to right
  },
  user2: {
    backgroundColor: '#f1f1f1', // Light gray for Expert
    alignSelf: 'flex-start', // Align to left
  },
  messageText: {
    margin: 0,
    fontSize: '1rem',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #e0e0e0',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #e0e0e0',
    marginRight: '10px',
  },
  sendButton: {
    backgroundColor: '#4CAF50', // Green background
    color: 'white', // White text
    padding: '10px 15px', // Button padding
    borderRadius: '20px', // Rounded corners
    cursor: 'pointer', // Pointer cursor on hover
  },
  predefinedContainer: {
    padding: '10px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  predefinedHeader: {
    margin: '0 0 10px 0',
    fontSize: '1rem',
    color: '#555',
  },
  predefinedMessages: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  predefinedButton: {
    backgroundColor: '#e1f5fe', // Light blue for predefined buttons
    border: 'none',
    borderRadius: '20px',
    padding: '5px 10px',
    margin: '5px',
    cursor: 'pointer',
  },
};

// Exporting the ChatExpert component
export default ChatExpert;
