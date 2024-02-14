//view\src\store\actions\authActions.js
export const loginSuccess = (username, userid, email) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: { username, userid, email }
  };
};

export const setAuth = (isAuthenticated, username, userid, email, userNeedsProfileCompletion) => {
  return {
    type: 'SET_AUTH',
    payload: { isAuthenticated, username, userid, email, userNeedsProfileCompletion }
  };
};


export const logout = () => ({ type: 'LOGOUT' });
export const registerSuccess = (username) => ({ type: 'REGISTER_SUCCESS', payload: username });
