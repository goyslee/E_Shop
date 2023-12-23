import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import LogoutPage from './components/auth/LogoutPage';
import RegisterPage from './components/auth/RegisterPage';
import ProductsList from './components/products/ProductsList';
import ProductDetails from './components/products/ProductDetails';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import OrderHistory from './components/orders/OrderHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logoutPage" element={<LogoutPage />} />
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
