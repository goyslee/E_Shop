// Cart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartQuantityButton from './CartQuantityButton';
import AuthCheck from '../auth/AuthCheck';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cart', { withCredentials: true });
        setCartItems(response.data.cartItems);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  const handleQuantityChange = (productId, newQuantity) => {
    // Update the quantity of the item in the cartItems state
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.productid === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleSubmitOrder = () => {
  console.log('Order submitted');
};

  const handleRemoveAll = async (productId) => {
    // Confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to remove all of these items?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/cart/removeAll/${productId}`, { withCredentials: true });
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.productid !== productId)
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <AuthCheck setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
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
      <AuthCheck setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
      {isAuthenticated ? (
        <>
          <h2 className="cart-header">Your Cart</h2>
          <h3 className="cart-header">Welcome, {username}</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="cart-item-list">
              {cartItems.map((item) => (
                <li key={item.productid} className="cart-item">
                  <img src={item.image_url} alt={item.name} className="cart-item-image" />
                   
                  <div className="cart-item-details">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">${item.price}</span>
                    <CartQuantityButton
                      userid={username}
                      productid={item.productid}
                      initialQuantity={item.quantity}
                      onQuantityChange={handleQuantityChange} // Pass the handler
                    />
                    <button className="remove-all-button" onClick={() => handleRemoveAll(item.productid)}>
                      Remove All
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button className="submit-button" onClick={handleSubmitOrder}>
            Checkout
          </button>
        </>
      ) : (
        <p>Please log in to view your cart.</p>
      )}
    </div>
  );
};

export default Cart;