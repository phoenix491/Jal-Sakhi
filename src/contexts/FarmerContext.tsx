import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface FarmerData {
  id: string;
  name: string;
  phone: string;
  language: 'en' | 'hi' | 'bn';
  village: string;
  wellId: string;
  units: 'feet' | 'meters';
}

interface FarmerContextType {
  farmer: FarmerData;
  isAuthenticated: boolean;
  setFarmer: (farmer: FarmerData) => void;
  logout: () => void;
}

const defaultFarmer: FarmerData = {
  id: "F1001",
  name: "Ranindram Patel",
  phone: "9876543210",
  language: "en",
  village: "Kurukshetra",
  wellId: "WB124",
  units: "feet"
};

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

interface FarmerProviderProps {
  children: ReactNode;
}

export const FarmerProvider: React.FC<FarmerProviderProps> = ({ children }) => {
  const [farmer, setFarmer] = useState<FarmerData>(defaultFarmer);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching farmer data from localStorage or API
    const storedFarmer = localStorage.getItem('farmer');
    if (storedFarmer) {
      setFarmer(JSON.parse(storedFarmer));
      setIsAuthenticated(true);
    }
  }, []);

  const updateFarmer = (newFarmerData: FarmerData) => {
    setFarmer(newFarmerData);
    localStorage.setItem('farmer', JSON.stringify(newFarmerData));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('farmer');
    setIsAuthenticated(false);
  };

  return (
    <FarmerContext.Provider value={{ farmer, isAuthenticated, setFarmer: updateFarmer, logout }}>
      {children}
    </FarmerContext.Provider>
  );
};

export const useFarmer = (): FarmerContextType => {
  const context = useContext(FarmerContext);
  if (context === undefined) {
    throw new Error('useFarmer must be used within a FarmerProvider');
  }
  return context;
};