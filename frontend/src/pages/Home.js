import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BlogPostForm from '../components/BlogPostForm';
import PostList from '../components/PostList';

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const { api, isAuthenticated } = useAuth();

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await api.get('/blogs');
      setPosts(response.data);
    } catch (err) {
      setError("Failed to fetch posts.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [api]);

  // Add the new post to the top of the list
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Remove the deleted post from the list
  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter(post => post.id !== deletedPostId));
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {isAuthenticated && (
        <BlogPostForm onPostCreated={handlePostCreated} />
      )}

      <PostList posts={posts} onPostDeleted={handlePostDeleted} />
    </div>
  );
}

export default Home;
