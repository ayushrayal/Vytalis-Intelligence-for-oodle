import { createContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, logout as logoutApi, getCurrentUser } from '../services/auth.service.js';
import { getToken, saveToken, removeToken } from '../utils/authTokens.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vytalis_user_override');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const existingToken = getToken();
    if (!existingToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      if (response && response.success && response.data?.user) {
        const savedUserStr = localStorage.getItem('vytalis_user_override');
        let mergedUser = response.data.user;
        if (savedUserStr) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            mergedUser = { ...response.data.user, ...savedUser };
          } catch (e) {
            // Ignore parse error
          }
        }
        setUser(mergedUser);
        setToken(existingToken);
      } else {
        removeToken();
        localStorage.removeItem('vytalis_user_override');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      removeToken();
      localStorage.removeItem('vytalis_user_override');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await loginApi(credentials);
      if (response && response.success && response.data) {
        const { user: userData, token: tokenData } = response.data;
        const savedUserStr = localStorage.getItem('vytalis_user_override');
        let mergedUser = userData;
        if (savedUserStr) {
          try {
            mergedUser = { ...userData, ...JSON.parse(savedUserStr) };
          } catch (e) {}
        }
        saveToken(tokenData);
        setToken(tokenData);
        setUser(mergedUser);
        return { success: true, user: mergedUser };
      } else {
        throw new Error(response?.message || 'Login failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      // Ignore network errors during logout
    } finally {
      removeToken();
      localStorage.removeItem('vytalis_user_override');
      setUser(null);
      setToken(null);
    }
  };

  const updateUser = useCallback((updatedFields) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedFields };
      localStorage.setItem('vytalis_user_override', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    updateUser,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
