import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    name: '',
    age: '',
    occupation: '',
    city: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await signup(formData);
      setSuccess(data.message + " Please sign in.");
      setFormData({
        user_id: '', password: '', name: '', age: '', occupation: '', city: ''
      });
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      setError(err.message || "Failed to sign up.");
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="user_id" className="form-label">Username (user_id)</label>
          <input type="text" className="form-control" id="user_id" value={formData.user_id} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} required />
        </div>
        {/* Bonus fields */}
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age (Optional)</label>
          <input type="number" className="form-control" id="age" value={formData.age} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="occupation" className="form-label">Occupation (Optional)</label>
          <input type="text" className="form-control" id="occupation" value={formData.occupation} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">Current City (Optional)</label>
          <input type="text" className="form-control" id="city" value={formData.city} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
        <p className="mt-3">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
