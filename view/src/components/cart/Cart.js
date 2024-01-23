// Cart.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems, removeAllFromCart, updateCartItemQuantity } from '../../store/actions/cartActions';
import CartQuantityButton from './CartQuantityButton';
import { useNavigate } from 'react-router-dom';
import AuthCheck from '../auth/AuthCheck';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { cartItems, loading, error } = useSelector(state => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [isAuthenticated, dispatch]);

  const handleRemoveAll = productId => {
    const isConfirmed = window.confirm("Are you sure you want to remove all of these items?");
    if (isConfirmed) {
      dispatch(removeAllFromCart(productId));
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateCartItemQuantity(productId, newQuantity));
  };

  const renderCartItems = () => cartItems.map(item => (
    <li key={item.productid} className="cart-item-card">
      <img src={item.image_url} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <span className="cart-item-name">{item.name}</span>
        <span className="cart-item-price"> - £{item.price} </span>
        <button className="remove-all-button" onClick={() => handleRemoveAll(item.productid)}>Remove All</button>
        <CartQuantityButton
          productid={item.productid}
          initialQuantity={item.quantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
    </li>
  ));

  if (!isAuthenticated) {
    return <div><AuthCheck /><p>Please log in to view your cart.</p></div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-header">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul className="cart-item-list">{renderCartItems()}</ul>
      )}
      <button onClick={() => navigate('/checkout')} className="remove-all-button">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
