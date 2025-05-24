import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  farmerId: string | null;
  login: (farmerId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [farmerId, setFarmerId] = useState<string | null>(null);

  useEffect(() => {
    const storedFarmerId = localStorage.getItem('farmerId');
    if (storedFarmerId) {
      setIsAuthenticated(true);
      setFarmerId(storedFarmerId);
      console.log('AuthProvider: Restored auth state, farmerId=', storedFarmerId, 'isAuthenticated=', true);
    } else {
      console.log('AuthProvider: No auth state found, isAuthenticated=', false);
    }
  }, []);

  const login = (farmerId: string) => {
    setIsAuthenticated(true);
    setFarmerId(farmerId);
    localStorage.setItem('farmerId', farmerId);
    console.log('AuthProvider: Logged in, farmerId=', farmerId, 'isAuthenticated=', true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setFarmerId(null);
    localStorage.removeItem('farmerId');
    console.log('AuthProvider: Logged out, isAuthenticated=', false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, farmerId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};