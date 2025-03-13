import React, { useState, useEffect, useMemo } from 'react';
import { auth, db, storage } from '../../firebaseConfig';
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, getDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './Community.css';
import { Circles } from 'react-loader-spinner'; // Import the loader


const Community = () => {
  const [posts, setPosts] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // For swipe down to refresh
  const [error, setError] = useState(null); // Error handling


  const user = auth.currentUser;

  // Fetch posts with a limit and order by timestamp for latest posts
  const fetchPostsAndUserInfo = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('User is not authenticated.');
      }
      
      // Fetch user info
      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setUsername(userData.name);
      } else {
        console.warn('User document does not exist.');
      }

      // Fetch latest posts, order by timestamp, limit to 10
      const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(10));
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setError(null); // Clear previous errors
    } catch (err) {
      console.error('Error fetching posts or user info:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsAndUserInfo();
  }, [user, refresh]);

  const handleLike = async (id) => {
    if (!user) {
      alert('Please log in to like posts.');
      return;
    }

    try {
      const postRef = doc(db, 'posts', id);
      const post = posts.find(post => post.id === id);
      const newLikes = post.likes && post.likes.includes(user.uid)
        ? post.likes.filter(userId => userId !== user.uid) // Unlike if already liked
        : [...(post.likes || []), user.uid]; // Like if not liked

      await updateDoc(postRef, { likes: newLikes });
      setPosts(posts.map(post => (post.id === id ? { ...post, likes: newLikes } : post)));
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleComment = async (id, comment) => {
    if (!user) {
      alert('Please log in to comment on posts.');
      return;
    }

    try {
      const postRef = doc(db, 'posts', id);
      const post = posts.find(post => post.id === id);
      const commentData = {
        user: username,
        text: comment,
        timestamp: new Date() // Use the current date for comment timestamp
      };
      const updatedComments = [...(post.comments || []), commentData];

      await updateDoc(postRef, { comments: updatedComments });
      setPosts(posts.map(post => (post.id === id ? { ...post, comments: updatedComments } : post)));
    } catch (error) {
      console.error('Error updating comments:', error);
    }
  };

  const handlePostSubmit = async (imageFile, description, setProgress) => {
    if (!user) {
      alert('Please log in to upload posts.');
      return;
    }

    try {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress.toFixed(0));
        },
        (error) => {
          console.error('Upload failed:', error);
          setUploadStatus('Upload failed. Please try again.');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'posts'), {
            imageUrl: downloadURL,
            description,
            username,
            likes: [],
            comments: [],
            timestamp: serverTimestamp(),
          });
          setShowUploadModal(false);
          setUploadStatus('Image uploaded successfully!');
          setRefresh(!refresh); // Refresh posts after upload
        }
      );
    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        setRefresh(!refresh); // Refresh posts after delete
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Invalid Date'; // Handle invalid date case
  
    // Convert Firebase Timestamp or string/number to Date object
    const date = (typeof timestamp.toDate === 'function') ? timestamp.toDate() : new Date(timestamp);
  
    // Format date and time
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleString(undefined, options); // e.g., "Jan 18, 03:45 PM"
  };
  

  // Memoize posts to avoid unnecessary re-renders
  const memoizedPosts = useMemo(() => posts, [posts]);

  if (loading) {
    // Centered loading spinner
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Circles
          height="80"
          width="80"
          color="#32cd32"
          ariaLabel="loading"
        />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="community-container">
      {memoizedPosts.map(post => (
        <div key={post.id} className="post">
          <div className="post-header">
            <span className="username">{post.username || "Unknown User"}</span>
            <span className="timestamp">{post.timestamp && formatDate(post.timestamp)}</span>
          </div>
          <img src={post.imageUrl} alt="post" className="post-image" loading="lazy" />
          <div className="description-container">
            <p className="description-label">Description:</p>
            <p className="description">{post.description}</p>
            <div className="like-container">
              <button onClick={() => handleLike(post.id)} className="like-button">
                <span role="img" aria-label="like">❤️</span> {post.likes ? post.likes.length : 0}
              </button>
              {post.username === username && (
                <button onClick={() => handleDeletePost(post.id)} className="delete-button">
                  Delete
                </button>
              )}
            </div>
          </div>
          <div className="comments-box">
            {post.comments && post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <span className="comment-username">{comment.user || "Anonymous"}:</span> 
                <span className="comment-text">{comment.text}</span>
                <span className="comment-date">{formatDate(comment.timestamp)}</span>
              </div>
            ))}
            <CommentInput onSubmit={(comment) => handleComment(post.id, comment)} />
          </div>
        </div>
      ))}

      <button className="upload-button2" onClick={() => setShowUploadModal(true)}>
        <span role="img" aria-label="plus">➕</span>
      </button>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSubmit={handlePostSubmit}
        />
      )}

      {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
    </div>
  );
};

const CommentInput = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && comment.trim()) {
      onSubmit(comment.trim());
      setComment('');
    }
  };

  return (
    <div className="comment-input-container">
      <input
        type="text"
        className="comment-input"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="submit-button" onClick={() => {
        if (comment.trim()) {
          onSubmit(comment.trim());
          setComment('');
        }
      }}>
        Submit
      </button>
    </div>
  );
};

const UploadModal = ({ onClose, onSubmit }) => {
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (imageFile && description) {
      onSubmit(imageFile, description, setProgress);
    }
  };

  return (
    <div className="upload-modal">
      <h2>Upload Post</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write a description..."
      />
      <button onClick={handleSubmit}>Upload</button>
      <button onClick={onClose}>Cancel</button>
      {progress > 0 && <div>Upload Progress: {progress}%</div>}
    </div>
  );
};

export default Community;
