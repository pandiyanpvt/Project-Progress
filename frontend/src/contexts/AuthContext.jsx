import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, onAuthChange } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email,
          username: user.displayName || user.email.split('@')[0]
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);
    return result;
  };

  const register = async (username, email, password) => {
    setLoading(true);
    const result = await registerUser(email, password);
    if (result.success) {
      // Update the user with username
      result.user.username = username;
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await logoutUser();
    setLoading(false);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

