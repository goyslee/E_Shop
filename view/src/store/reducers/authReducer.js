// src/reducers/authReducer.js
const initialState = {
  isAuthenticated: false,
  userid: null,
  username: '',
  email: '',
  userNeedsProfileCompletion: false
};

export default function authReducer(state = initialState, action) {
  console.log('Dispatched Action:', action);

  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log('LOGIN_SUCCESS payload:', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        userid: action.payload.userid,
        username: action.payload.username,
        email: action.payload.email
      };
    case 'SET_AUTH':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        userid: action.payload.userid,
        username: action.payload.username,
        email: action.payload.email,
        userNeedsProfileCompletion: action.payload.userNeedsProfileCompletion
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}
