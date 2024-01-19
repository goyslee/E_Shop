// Cart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CartQuantityButton from './CartQuantityButton';
import AuthCheck from '../auth/AuthCheck';
import './Cart.css';

const Cart = () => {
  const { userid, isAuthenticated } = useSelector(state => {
    console.log('Redux State in Cart:', state); // Add this line
    return state.auth;
  });
  
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cart', { withCredentials: true });
        setCartItems(response.data.cartItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated, userid]);

  const handleRemoveAll = async (productId) => {
    const isConfirmed = window.confirm("Are you sure you want to remove all of these items?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/cart/removeAll/${productId}`, { withCredentials: true });
        setCartItems(prevCartItems => prevCartItems.filter(item => item.productid !== productId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setCartItems(prevCartItems => prevCartItems.map(item => item.productid === productId ? { ...item, quantity: newQuantity } : item));
  };

  const renderCartItems = () => cartItems.map(item => (
    <li key={item.productid} className="cart-item-card">
      <img src={item.image_url} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <span className="cart-item-name">{item.name}</span>
        <span className="cart-item-price"> - £{item.price} </span>
        <button className="remove-all-button" onClick={() => handleRemoveAll(item.productid)}>Remove All</button>
        <CartQuantityButton
          userid={userid}
          productid={item.productid}
          initialQuantity={item.quantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
    </li>
  ));

  if (!isAuthenticated) {
    return (
      <div>
        <AuthCheck />
        <p>Please log in to view your cart.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-header">Your Cart</h2>
      {cartItems.length === 0 ? <p>Your cart is empty</p> : <ul className="cart-item-list">{renderCartItems()}</ul>}
    </div>
  );
};

export default Cart;
