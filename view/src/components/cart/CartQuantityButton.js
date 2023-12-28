import React, { useState } from 'react';
import axios from 'axios';
import './CartQuantityButton.css'; // Ensure you have corresponding CSS

const CartQuantityButton = ({ userid, productid }) => {
  const [quantity, setQuantity] = useState(0);

  const updateCart = async (newQuantity) => {
  console.log(`Updating cart for product ID: ${productid} with quantity: ${newQuantity}`);  // Add this line for debugging  
  if (!productid) {
    console.error("Product ID is undefined");
    return;
  }
    
    try {
      await axios.put(`http://localhost:3000/cart/${productid}`, {
        userid,
        productid: productid,
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
      await axios.post('http://localhost:3000/cart/add', {
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
      await axios.delete(`http://localhost:3000/cart/${productid}`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting from cart:', error);
    }
  };

  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (quantity === 0) {
      addToCart(newQuantity);
    } else {
      updateCart(newQuantity);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCart(newQuantity);
    } else if (quantity === 1) {
      deleteFromCart();
      setQuantity(0);
    }
  };

  return (
    <div className="cart-quantity-button">
      <button onClick={decrement}>-</button>
      <span>{quantity}</span>
      <button onClick={increment}>+</button>
    </div>
  );
};

export default CartQuantityButton;
