//view\src\components\auth\AuthCheck.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthCheck = ({ setIsAuthenticated, setUsername }) => {
  const location = useLocation();

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:3000/check-auth', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
        setUsername(response.data.isAuthenticated ? response.data.user.name : '');
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkUserAuthentication();
  }, [location, setIsAuthenticated, setUsername]);

  return null; // Render nothing or a loader as needed
};

export default AuthCheck;
