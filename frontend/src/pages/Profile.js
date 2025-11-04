import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const { api, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfileData(response.data);
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error(err);
      }
    };

    fetchProfile();
  }, [api, isAuthenticated, navigate]);

  const handlePostDeleted = (deletedPostId) => {
    setProfileData(prevData => ({
      ...prevData,
      userPosts: prevData.userPosts.filter(post => post.id !== deletedPostId)
    }));
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!profileData) {
    return <p>Loading profile...</p>;
  }

  const { user, userPosts } = profileData;

  return (
    <div>
      <div className="profile-info mb-4">
        <h2>{user.name}'s Profile</h2>
        <p><strong>Username:</strong> {user.user_id}</p>
        <p><strong>Age:</strong> {user.age || 'N/A'}</p>
        <p><strong>Occupation:</strong> {user.occupation || 'N/A'}</p>
        <p><strong>City:</strong> {user.city || 'N/A'}</p>
        <p><strong>Total Posts:</strong> {userPosts.length}</p>
      </div>
      
      <h3>My Posts</h3>
      <PostList posts={userPosts} onPostDeleted={handlePostDeleted} />
    </div>
  );
}

export default Profile;
