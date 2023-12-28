// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import LogoutPage from './components/auth/LogoutPage';
import RegisterPage from './components/auth/RegisterPage';

// User Components
import ProfileCompletion from './components/users/ProfileCompletion';
import UserProfile from './components/users/UserProfile'; 

// Product Components
import ProductsList from './components/products/ProductsList';
import ProductDetailsPage from './components/products/ProductDetailsPage';

// Other Components
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import OrderHistory from './components/orders/OrderHistory';
import Header from './components/layout/Header';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userNeedsProfileCompletion, setUserNeedsProfileCompletion] = useState(false);
  const [userId, setUserId] = useState(null);  // State for user ID

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const response = await axios.get('http://localhost:3000/check-auth', { withCredentials: true });
      setIsAuthenticated(response.data.isAuthenticated);
      setUsername(response.data.isAuthenticated ? response.data.user.name : '');
      setUserNeedsProfileCompletion(response.data.needsProfileCompletion);
      if (response.data.isAuthenticated) {
        setUserId(response.data.user.id);  // Assuming 'id' is the field name in the user object
      } else {
        setUserId(null);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const handleLogin = user => {
    setIsAuthenticated(true);
    setUsername(user.name);
    setUserId(user.userid); // Assuming 'id' is the field name in the user object
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setUserId(null);
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} username={username} />
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/logout" element={<LogoutPage onLogout={handleLogout} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/product/:productid" element={<ProductDetailsPage userid={userId} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/profilecompletion/:userid" element={<ProfileCompletion />} />
      </Routes>
    </Router>
  );
}

export default App;
