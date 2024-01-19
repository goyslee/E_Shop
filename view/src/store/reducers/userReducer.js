// src/reducers/userReducer.js
const initialState = {
  isLoggedIn: false,
  userid: null,
  email: ''
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        userid: action.payload.userid,
        email: action.payload.email
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        userid: null
      };
    default:
      return state;
  }
};

export default userReducer;
