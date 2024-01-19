// services/authServices.js
import axios from 'axios';
import { store } from '../store/store';
import { loginSuccess, logout } from '../store/actions/authActions';

const login = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:3000/login', credentials, { withCredentials: true });
    const { name, userid, email } = response.data.user;
    if (name && userid !== undefined) {
      console.log(store.dispatch(loginSuccess(name, userid, email)))
      store.dispatch(loginSuccess(name, userid, email));
    } else {
      console.error('Login failed: User ID is missing in the response');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};


const checkAuth = async () => {
  try {
    const response = await axios.get('http://localhost:3000/check-auth', { withCredentials: true });
    const userData = response.data.user;
    if (response.data.isAuthenticated && userData && userData.email !== undefined) {
      store.dispatch(loginSuccess(userData.name, userData.userid, userData.email));
    } else {
      store.dispatch(logout());
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
  }
};

export { login, checkAuth };
