// src/reducers/authReducer.js
const initialState = {
  isAuthenticated: false,
  userId: null,
  username: '',
  userNeedsProfileCompletion: false
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        userId: action.payload.userId,
        username: action.payload.username,
        userNeedsProfileCompletion: action.payload.userNeedsProfileCompletion
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}
