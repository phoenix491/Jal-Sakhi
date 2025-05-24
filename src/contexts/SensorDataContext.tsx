import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useFarmer } from './FarmerContext';
import { fetchSensorData, fetchAlerts } from '../services/sensorApi';

export interface WellSensorData {
  [x: string]: number;
  wellId: string;
  level: number;
  levelStatus: 'Safe' | 'Moderate' | 'Risky';
  tds: number;
  ph: number;
  temperature: number;
  lastSync: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface UsageData {
  [x: string]: number;
  todayUsage: number;
  todayLimit: number;
  savedWater: number;
  savedMoney: number;
}

export interface Alert {
  read: any;
  id: string;
  wellId: string;
  type: 'High TDS' | 'Low Level' | 'High Usage';
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface SensorDataContextType {
  sensorData: WellSensorData;
  usageData: UsageData;
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  resolveAlert: (alertId: string) => void;
}

const SensorDataContext = createContext<SensorDataContextType | undefined>(undefined);

interface SensorDataProviderProps {
  children: ReactNode;
}

export const SensorDataProvider: React.FC<SensorDataProviderProps> = ({ children }) => {
  const { farmer } = useFarmer();
  const [sensorData, setSensorData] = useState<WellSensorData>({
    wellId: 'WB124',
    level: 75,
    levelStatus: 'Safe',
    tds: 280,
    ph: 7.1,
    temperature: 25,
    lastSync: '2025-05-18T14:30:00',
    location: {
      lat: 23.5,
      lng: 87.0
    }
  });
  
  const [usageData, setUsageData] = useState<UsageData>({
    todayUsage: 950,
    todayLimit: 1000,
    savedWater: 5000,
    savedMoney: 50
  });
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'A1',
      wellId: 'WB124',
      type: 'High TDS',
      message: 'High TDS detected in well WB124',
      timestamp: '2025-05-18T10:30:00',
      resolved: false
    },
    {
      id: 'A2',
      wellId: 'WB125',
      type: 'Low Level',
      message: 'Low water level in well WB125',
      timestamp: '2025-05-18T09:15:00',
      resolved: false
    }
  ]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, [farmer.wellId]);

  const refreshData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, these would be actual API calls
      const newSensorData = await fetchSensorData(farmer.wellId);
      const newAlerts = await fetchAlerts(farmer.wellId);
      
      setSensorData(newSensorData);
      setAlerts(newAlerts);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch sensor data');
      setLoading(false);
    }
  };

  const resolveAlert = (alertId: string): void => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  return (
    <SensorDataContext.Provider 
      value={{ 
        sensorData, 
        usageData, 
        alerts, 
        loading, 
        error, 
        refreshData, 
        resolveAlert 
      }}
    >
      {children}
    </SensorDataContext.Provider>
  );
};

export const useSensorData = (): SensorDataContextType => {
  const context = useContext(SensorDataContext);
  if (context === undefined) {
    throw new Error('useSensorData must be used within a SensorDataProvider');
  }
  return context;
};