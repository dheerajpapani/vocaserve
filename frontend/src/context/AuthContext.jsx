import { createContext, useContext, useEffect, useState } from 'react';
import { loginLogic, logoutLogic, isLoggedIn } from './authUtils'; // ✅ Only import logic

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isLoggedIn());
  }, []);

  const login = () => {
    loginLogic();
    setIsAdmin(true);
  };

  const logout = () => {
    logoutLogic();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ No helper exports here
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
