export const addToCart = (item) => ({ type: 'ADD_TO_CART', payload: item });
export const removeFromCart = (productId) => ({ type: 'REMOVE_FROM_CART', payload: productId });
export const updateCartQuantity = (productId, quantity) => ({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
