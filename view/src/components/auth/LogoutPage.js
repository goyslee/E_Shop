//view\src\components\auth\LogoutPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
      .then(response => {
        console.log('Logout successful:', response.data);
        // Redirect to login page or handle UI update
        navigate('/login');
      })
      .catch(error => {
        console.error('Logout error:', error);
        // Set an error message to display to the user
        if (error.response) {
          // If the server responded with a status other than 2xx
          setErrorMessage(`Error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
          // If the request was made but no response was received
          setErrorMessage('No response from server');
        } else {
          // Something else happened in setting up the request
          setErrorMessage('Error in sending request');
        }
      });
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default LogoutButton;
