import axios from 'axios';

// Set the default base URL for your API
axios.defaults.baseURL = `${process.env.REACT_APP_BACKEND_URL}`;

// Function to set the authentication token in the Axios header
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;
