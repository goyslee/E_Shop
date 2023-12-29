const initialState = { isAuthenticated: false, username: '' };

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { ...state, isAuthenticated: true, username: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, username: '' };
    default:
      return state;
  }
}
