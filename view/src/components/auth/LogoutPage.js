// LogoutPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LogoutPage.css';

const LogoutPage = ({ onLogout }) => {
  const navigate = useNavigate();

 const handleLogout = async () => {
    try {
        const response = await axios.post(`http://localhost:${process.env.REACT_APP_LOCAL_PORT}/logout`, {}, { withCredentials: true });
        if (response.status === 200) {
            onLogout();
          navigate('/login');
          console.log('Successfully logged out!')
        } else {
            console.error('Logout failed:', response.data.message);
        }
    } catch (error) {
        console.error('Logout error:', error.response.data.message);
    }
};


  return (
  <div className="logout-container">
    <h2>Are you sure you want to logout?</h2>
    <button onClick={handleLogout} className="logout-button">Logout</button>
  </div>
);
};

export default LogoutPage;
