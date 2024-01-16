export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';

export const updateCartQuantity = (productId, newQuantity) => {
    return {
        type: UPDATE_CART_QUANTITY,
        payload: { productId, newQuantity }
    };
};
