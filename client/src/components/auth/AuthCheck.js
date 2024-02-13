// AuthCheck.js
import { useEffect } from 'react';
import { checkAuth } from '../../services/authServices';

const AuthCheck = () => {
  useEffect(() => {
    checkAuth();
  }, []);

  return null; // This component doesn't render anything
};

export default AuthCheck;