import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

function EditPost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { api } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setTitle(response.data.title);
        setBody(response.data.body);
      } catch (err) {
        setError("Failed to load post.");
        console.error(err);
      }
      setLoading(false);
    };

    fetchPost();
  }, [api, id]);

  // Handle the form submission to update the post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/blogs/${id}`, { title, body });
      navigate('/');
    } catch (err) {
      setError(err.response.data.message || "Failed to update post.");
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  return (
    <div className="form-container">
      <h2>Edit Post</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title} // Pre-filled value
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="body" className="form-label">Body</label>
          <textarea
            className="form-control"
            id="body"
            rows="10"
            value={body} // Pre-filled value
            onChange={(e) => setBody(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default EditPost;
