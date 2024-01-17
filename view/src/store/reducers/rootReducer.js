import { combineReducers } from 'redux';
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import userReducer from './userReducer';

export default combineReducers({
  auth: authReducer,
  cart: cartReducer,
  user: userReducer
});

