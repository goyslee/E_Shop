// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import LogoutPage from './components/auth/LogoutPage';
import RegisterPage from './components/auth/RegisterPage';
import ProductsList from './components/products/ProductsList';
import ProductDetails from './components/products/ProductDetails';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import OrderHistory from './components/orders/OrderHistory';
import Header from './components/layout/Header';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');


  useEffect(() => {
    // Replace with your actual check for user authentication
    const checkUserAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:3000/check-auth', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
        setUsername(response.data.isAuthenticated ? response.data.user.name : username);
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkUserAuthentication();
  }, [username]);

  const AuthCheck = () => {
  const location = useLocation();
  const [username, setUsername] = useState('');

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
  }, [username, location]);

  // Render nothing, or a loader, or whatever is appropriate during the auth check
  return null;
};


  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user.name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} username={username} />
      <AuthCheck setIsAuthenticated={setIsAuthenticated} username={username}/>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/logout" element={<LogoutPage onLogout={handleLogout} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-history" element={<OrderHistory />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
