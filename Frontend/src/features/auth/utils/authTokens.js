const TOKEN_KEY = 'oodle_auth_token';

export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Aliases for compatibility
export const setStoredToken = saveToken;
export const getStoredToken = getToken;
export const removeStoredToken = removeToken;
