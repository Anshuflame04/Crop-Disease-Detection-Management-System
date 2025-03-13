import React, { useEffect } from 'react';

// Utility function to display browser notifications
const sendNotification = (title, message) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  } else {
    console.warn("Notification permission not granted.");
  }
};

const NotificationComponent = () => {
  console.log("NotificationComponent rendered"); // Confirm rendering

  // Hardcoded notifications for testing
  const notifications = [
    { title: "Test Notification 1", message: "This is a test message." },
    { title: "Test Notification 2", message: "This is another test message." },
  ];

  useEffect(() => {
    // Request permission for notifications on initial load
    Notification.requestPermission().then(permission => {
      console.log("Notification permission status:", permission); // Log permission status
      if (permission === "granted") {
        notifications.forEach((notification, index) => {
          setTimeout(() => {
            console.log(`Sending notification: ${notification.title}`); // Log before sending
            sendNotification(notification.title, notification.message);
          }, index * 1000000); // 10 seconds delay
        });
      } else {
        console.warn("Notification permission not granted by the user.");
      }
    });
  }, []);

  return <div>Notification Test</div>;
};

export default NotificationComponent;
