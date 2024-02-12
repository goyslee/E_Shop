//view\src\store\actions\cartActions.js
import axios from 'axios';

export const FETCH_CART_BEGIN = 'FETCH_CART_BEGIN';
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
export const FETCH_CART_FAILURE = 'FETCH_CART_FAILURE';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const DELETE_CART_ITEM = 'DELETE_CART_ITEM';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

export const fetchCartBegin = () => ({
  type: FETCH_CART_BEGIN
});

export const fetchCartSuccess = cartItems => ({
  type: FETCH_CART_SUCCESS,
  payload: { cartItems }
});

export const fetchCartFailure = error => ({
  type: FETCH_CART_FAILURE,
  payload: { error }
});

export const updateCartItem = (productId, newQuantity) => ({
  type: UPDATE_CART_ITEM,
  payload: { productId, newQuantity }
});

export const deleteCartItem = productId => ({
  type: DELETE_CART_ITEM,
  payload: { productId }
});

export const fetchCartItems = () => {
  return dispatch => {
    dispatch(fetchCartBegin());
    return axios.get(`${process.env.BACKEND_URL}/cart`, { withCredentials: true })
      .then(response => dispatch(fetchCartSuccess(response.data.cartItems)))
      .catch(error => dispatch(fetchCartFailure(error)));
  };
};

export const removeAllFromCart = productId => {
  return async dispatch => {
    try {
      await axios.delete(`${process.env.BACKEND_URL}/cart/removeAll/${productId}`, { withCredentials: true });
      dispatch(deleteCartItem(productId));
    } catch (error) {
      console.error('Error removing items:', error);
    }
  };
};

export const updateCartItemQuantity = (productId, newQuantity) => {
  return async dispatch => {
    try {
      await axios.put(`${process.env.BACKEND_URL}/cart/${productId}`, { quantity: newQuantity }, { withCredentials: true });
      dispatch(updateCartItem(productId, newQuantity));
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };
};


export const addToCart = (productId, quantity) => {
  return async dispatch => {
    try {
      await axios.post(`${process.env.BACKEND_URL}/cart/add`, { productid: productId, quantity }, { withCredentials: true });
      dispatch({
        type: ADD_TO_CART,
        payload: { productId, quantity }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
};

export const removeFromCart = productId => {
  return async dispatch => {
    try {
      await axios.delete(`${process.env.BACKEND_URL}/cart/${productId}`, { withCredentials: true });
      dispatch({
        type: REMOVE_FROM_CART,
        payload: { productId }
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
};