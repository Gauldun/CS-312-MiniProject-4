import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Post({ post, onPostDeleted }) {
  const { user, api } = useAuth();
  const navigate = useNavigate();

  const isOwner = user && user.user_id === post.author_id;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/blogs/${post.id}`);
        onPostDeleted(post.id); // Notify parent (Home.js)
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Error: " + error.response.data.message);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${post.id}`);
  };

  return (
    <article className="post">
      <h2>{post.title}</h2>
      <div className="post-meta">
        By: {post.author_id} | On: {new Date(post.timestamp).toLocaleString()}
      </div>
      <p className="post-body">{post.body}</p>
      
      {/* Show buttons only if user is the owner */}
      {isOwner && (
        <div className="post-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

export default Post;
