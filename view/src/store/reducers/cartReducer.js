//view\src\store\reducers\cartReducer.js
import { UPDATE_CART_QUANTITY } from '../actions/cartActions';

const initialState = {
    cartItems: [],
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.productid === action.payload.productId
                        ? { ...item, quantity: action.payload.newQuantity }
                        : item
                )
            };
        default:
            return state;
    }
};

export default cartReducer;
