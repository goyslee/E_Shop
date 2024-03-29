//view\src\components\auth\RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css'; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phonenumber: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/register`;
      const response = await axios.post(url, formData, { withCredentials: true });
      console.log(response.data);
      navigate('/products');
    } catch (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error data:', error.response.data);
    console.error('Error status:', error.response.status);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', error.message);
  }


    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <input
          type="text"
          name="phonenumber"
          value={formData.phonenumber.toString()}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <button type="submit">Register</button>
         <a href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`} className="google-auth-button">
          Register with Google
        </a>
         <h3>
            Already have an account? 
          </h3>
          <p>
           <a href="/login" className="login-link-button">Login</a>
          </p>
        
      </form>
         
    </div>
  );
};

export default RegisterPage;
