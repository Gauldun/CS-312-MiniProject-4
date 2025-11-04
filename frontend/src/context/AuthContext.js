import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Create an axios instance that sends cookies with every request
  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
  });

  // Check if user is already logged in 
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await api.get('/check-auth');
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  // Sign Up function
  const signup = async (userData) => {
    try {
      const response = await api.post('/signup', userData);
      return response.data;
    } catch (error) {
      console.error("Signup error:", error.response.data);
      throw error.response.data;
    }
  };

  // Sign In function
  const signin = async (user_id, password) => {
    try {
      const response = await api.post('/signin', { user_id, password });
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error("Signin error:", error.response.data);
      throw error.response.data;
    }
  };

  // Sign Out function
  const signout = async () => {
    try {
      await api.get('/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Signout error:", error.response.data);
      throw error.response.data;
    }
  };

  // The value that will be provided to all children components
  const value = {
    user,
    isAuthenticated,
    loading,
    api,
    signup,
    signin,
    signout,
  };

  // Don't render children until we've checked for auth
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
