// Action Types
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

// Action Creators
export const registerRequest = () => ({ type: REGISTER_REQUEST });
export const registerSuccess = (username) => ({ type: REGISTER_SUCCESS, payload: username });
export const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });
