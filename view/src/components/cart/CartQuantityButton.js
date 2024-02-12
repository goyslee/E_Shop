//view\src\components\cart\CartQuantityButton.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './CartQuantityButton.css';

const CartQuantityButton = ({ productid }) => {
  const { userid, isAuthenticated } = useSelector(state => {
    console.log('Redux State in Cart:', state); // Add this line
    return state.auth;
  });
  const [quantity, setQuantity] = useState(0);
  const numericUserId = Number(userid)
    
  console.log('UserID in CartQuantityButton:', numericUserId);


  useEffect(() => {
    const fetchCartQuantity = async () => {
      try {
        const response = await axios.get(`${process.env.BACKEND_URL}/cart/quantity/${productid}`, {
          withCredentials: true
        });
        setQuantity(response.data.quantity);
      } catch (error) {
        console.error('Error fetching cart quantity:', error);
      }
       // Check if userid is a number
    if (isNaN(userid)) {
      console.error('UserID is not a valid number:', userid);
      // Handle the case where userid is not valid
      // This might include returning null, showing an error, or using a default value
      return null;
    }
    };

    fetchCartQuantity();
  }, [productid, userid, isAuthenticated]);

  const updateCart = async (newQuantity) => {
    console.log(`Updating cart for product ID: ${productid} with quantity: ${newQuantity}`);
    if (!productid) {
      console.error("Product ID is undefined");
      return;
    }
    
    try {
      await axios.put(`${process.env.BACKEND_URL}/cart/${productid}`, {
        userid,
        productid,
        quantity: newQuantity
      }, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const addToCart = async (newQuantity) => {
    try {
      await axios.post(`${process.env.BACKEND_URL}/cart/add`, {
        userid,
        productid,
        quantity: newQuantity
      }, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const deleteFromCart = async () => {
    try {
      await axios.delete(`${process.env.BACKEND_URL}/cart/${productid}`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting from cart:', error);
    }
  };

  const increment = () => {
    if (isAuthenticated) { // Authentication Check
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      if (quantity === 0) {
        addToCart(newQuantity);
      } else {
        updateCart(newQuantity);
      }
    } else {
      alert("You must log in to place items in the cart!");
    }
  };

  const decrement = () => {
    if (isAuthenticated) {  // Authentication Check
      if (quantity > 1) {
        const newQuantity = quantity - 1;
        setQuantity(newQuantity);
        updateCart(newQuantity);
      } else if (quantity === 1) {
        deleteFromCart();
        setQuantity(0);
      }
    } else {
      alert("You must log in to remove items from the cart!");
    }
  };

  return (
    <div className="cart-quantity-button">
      <button onClick={decrement} >-</button>
      <span>{quantity}</span>
      <button onClick={increment} >+</button>
    </div>
  );
};

CartQuantityButton.propTypes = {
  userid: PropTypes.number, // If userid can be null/undefined, don't use isRequired
  productid: PropTypes.number.isRequired,
};


export default CartQuantityButton;
