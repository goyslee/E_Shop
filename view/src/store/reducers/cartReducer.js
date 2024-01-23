//view\src\store\reducers\cartReducer.js
import {
  FETCH_CART_BEGIN,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  UPDATE_CART_ITEM,
    DELETE_CART_ITEM,
    ADD_TO_CART,
    REMOVE_FROM_CART
} from '../actions/cartActions';

const initialCartState  = {
  cartItems: [],
  loading: false,
  error: null
};

export const cartReducer = (state = initialCartState , action) => {
  switch (action.type) {
    case FETCH_CART_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: action.payload.cartItems
      };
    case FETCH_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        cartItems: []
      };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.productid === action.payload.productId
            ? { ...item, quantity: action.payload.newQuantity }
            : item
        )
      };
    case DELETE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.productid !== action.payload.productId)
          };
        case ADD_TO_CART:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.productid === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.productid !== action.payload.productId)
      };
    case 'LOGOUT':
      return initialCartState;
    default:
      return state;
  }
};

export default cartReducer;
