// src/Profile.jsx
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebaseConfig'; // Import Firebase auth, Firestore, and Storage
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage functions
import './Profile.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    number: '',
    email: '',
    age: '',
    gender: '',
    location: '',
    profilePic: '', // Store profile picture URL
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // Toggle edit mode
  const [selectedImage, setSelectedImage] = useState(null); // Store selected file

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          setUserDetails(userSnapshot.data());
        }
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]); // Store selected image
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const imageRef = ref(storage, `profilePictures/${user.uid}`); // Storage reference

      try {
        await uploadBytes(imageRef, selectedImage); // Upload image
        const imageUrl = await getDownloadURL(imageRef); // Get image URL

        await updateDoc(doc(db, 'users', user.uid), { profilePic: imageUrl }); // Update Firestore

        setUserDetails((prev) => ({ ...prev, profilePic: imageUrl })); // Update state
        alert('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture.');
      }
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);

      try {
        await updateDoc(userDocRef, {
          name: userDetails.name,
          number: userDetails.number,
          age: userDetails.age,
          gender: userDetails.gender,
          location: userDetails.location,
        });
        setEditing(false);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      }
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="user-profile">
      <h2>Profile</h2>
      
      {/* Profile Picture Section */}
      <div className="profile-image-container">
        {userDetails.profilePic ? (
          <img src={userDetails.profilePic} alt="Profile" className="profile-image" />
        ) : (
          <div className="placeholder-image">Profile Picture</div>
        )}
        {editing && (
          <div className="image-upload">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleImageUpload} className="upload-button">Upload</button>
          </div>
        )}
      </div>

      {/* Form fields for the user's details */}
      <div className="profile-details">
        {[
          { label: 'Name', name: 'name' },
          { label: 'Phone Number', name: 'number' },
          { label: 'Email', name: 'email', disabled: true },
          { label: 'Age', name: 'age' },
          { label: 'Gender', name: 'gender' },
          { label: 'Location', name: 'location' },
        ].map((detail) => (
          <div className="profile-detail" key={detail.name}>
            <label>{detail.label}:</label>
            <input
              type="text"
              name={detail.name}
              value={userDetails[detail.name]}
              onChange={handleChange}
              disabled={detail.disabled || !editing}
            />
          </div>
        ))}
      </div>

      {/* Buttons to toggle edit mode and save changes */}
      {!editing ? (
        <button onClick={() => setEditing(true)} className="edit-button">Edit</button>
      ) : (
        <button onClick={handleSave} className="save-button">Save</button>
      )}
    </div>
  );
};

export default Profile;
