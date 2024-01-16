import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE } from '../actions/userActions';

const initialState = {
  isRegistering: false,
  username: '',
  registrationError: ''
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      return { ...state, isRegistering: true, registrationError: '' };
    case REGISTER_SUCCESS:
      return { ...state, isRegistering: false, username: action.payload };
    case REGISTER_FAILURE:
      return { ...state, isRegistering: false, registrationError: action.payload };
    default:
      return state;
  }
};

export default userReducer;
