// src/reducers/userReducer.js
const initialState = {
  isLoggedIn: false,
  userId: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userId
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        userId: null
      };
    default:
      return state;
  }
};

export default userReducer;
