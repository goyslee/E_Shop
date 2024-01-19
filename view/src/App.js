// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import axios from 'axios';

import LoginPage from './components/auth/LoginPage';
import LogoutPage from './components/auth/LogoutPage';
import RegisterPage from './components/auth/RegisterPage';
import ProfileCompletion from './components/users/ProfileCompletion';
import UserProfile from './components/users/UserProfile';
import ProductsList from './components/products/ProductsList';
import ProductDetailsPage from './components/products/ProductDetailsPage';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import OrderHistory from './components/orders/OrderHistory';
import Header from './components/layout/Header';


import { loginSuccess, logout } from './store/actions/authActions';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector(state => state.auth);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:3000/check-auth', { withCredentials: true });
        if(response.data.isAuthenticated) {
          dispatch(loginSuccess(response.data.user.name, response.data.user.userid));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkUserAuthentication();
  }, [dispatch]);

 

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log(axios.defaults.headers.common['Authorization'])
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const handleLogin = (user) => {
    setAuthToken(user.token);
    dispatch(loginSuccess(user.name, user.userid, user.email));
  };

  const handleLogout = () => {
    setAuthToken(null);
    dispatch(logout());
  };

  return (
    <Provider store={store}>
      <Router>
        <Header isAuthenticated={isAuthenticated} username={username} />
        <Routes>
          <Route path="/" element={<ProductsList />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/logout" element={<LogoutPage onLogout={handleLogout} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/product/:productid" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/user-profile/:userid" element={<UserProfile />} />
          <Route path="/profilecompletion/:userid" element={<ProfileCompletion />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
