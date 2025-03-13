import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig'; // Import Firebase auth and Firestore
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore'; // For Firestore
import './Login.css'; // Import the CSS file

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    gender: 'Male',
    age: '',
    username: '', // This should be the email for Firebase auth
    password: '',
    confirmPassword: '', // New field for confirming password
  });
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error messages

    // If it's a signup, check if passwords match
    if (isSignup && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      if (isSignup) {
        // Handle Signup
        const userCredential = await createUserWithEmailAndPassword(auth, formData.username, formData.password);
        const user = userCredential.user; // This is the newly created user

        // Save additional user details in Firestore
        const userDocRef = doc(db, 'users', user.uid); // Create a reference to a new document in the 'users' collection
        const userDetails = {
          name: formData.name,
          number: formData.number,
          gender: formData.gender,
          age: formData.age,
          email: formData.username,
          pwd: formData.password, // Store password as 'pwd' in the Firestore database (not recommended for production)
        };
        await setDoc(userDocRef, userDetails);

        // Save user details in localStorage
        localStorage.setItem('userDetails', JSON.stringify(userDetails));

        setSuccessMessage('Signup successful! Welcome!');
        navigate('/home'); // Navigate to the home page after successful signup
      } else {
        // Handle Login
        const userCredential = await signInWithEmailAndPassword(auth, formData.username, formData.password);
        const user = userCredential.user;

        // Fetch user details from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userDetails = userSnapshot.data();

          // Save user details in localStorage
          localStorage.setItem('userDetails', JSON.stringify(userDetails));

          navigate('/home'); // Navigate to home after successful login
        } else {
          setErrorMessage('No user details found.');
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage('Error: ' + error.message); // Display the error message
    }
  };

  const handleSkip = () => {
    navigate('/home'); // Skip button navigates directly to the home page
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Flaming Ice</h1>
      <h2 className="login-subtitle">{isSignup ? 'Sign Up' : 'Login to your Account'}</h2>

      <form onSubmit={handleSubmit} className="login-form">
        {isSignup && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="tel"
              name="number"
              placeholder="Phone Number"
              value={formData.number}
              onChange={handleChange}
              required
              className="input-field"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              className="input-field"
            />
          </>
        )}
        <input
          type="email"
          name="username"
          placeholder={isSignup ? 'Email' : 'Email or Phone'}
          value={formData.username}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input-field"
        />
        {isSignup && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Enter Password again"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="input-field"
          />
        )}
        <button type="submit" className="submit-button">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
        <button type="button" onClick={handleSkip} className="skip-button">
          Skip
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <button onClick={() => setIsSignup(!isSignup)} className="toggle-button">
        {isSignup ? 'Already have an account? Login' : 'Don’t have an account? Sign Up'}
      </button>
    </div>
  );
};

export default Login;
