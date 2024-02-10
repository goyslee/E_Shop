// LoginPage.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authServices';
import { loginSuccess } from '../../store/actions/authActions';
import axios from 'axios';
import './LoginPage.css'

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const getGoogleLoginToken = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('token');
    };

  const handleGoogleLogin = async () => {
  const googleLoginToken = getGoogleLoginToken();
  if (googleLoginToken) {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/google/callback?token=${googleLoginToken}`);
      const { name, userid, email } = response.data.user;
      dispatch(loginSuccess(name, userid, email));
      navigate('/products');
    } catch (error) {
      console.error('Error handling Google login:', error);
    }
  }
};

    if (isAuthenticated) {
      navigate('/products');
    } else {
      handleGoogleLogin();
    }
  }, [isAuthenticated, navigate, dispatch]);


  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(credentials); // Using the authService's login function
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="google-login-button">
        <a href={`${process.env.REACT_APP_FRONTEND_URL}/auth/google`}>
          <span>Login with Google</span>
        </a>
      </div>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default LoginPage;
