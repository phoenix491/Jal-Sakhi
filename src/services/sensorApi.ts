import { WellSensorData, Alert, UsageData } from '../contexts/SensorDataContext';

// This is a mock API service to simulate hardware sensor data
// In a real application, this would be replaced with actual API calls

// Mock sensor data for different wells
const mockSensorData: Record<string, WellSensorData> = {
  'WB124': {
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
  },
  'WB125': {
    wellId: 'WB125',
    level: 40,
    levelStatus: 'Moderate',
    tds: 450,
    ph: 6.8,
    temperature: 27,
    lastSync: '2025-05-18T13:45:00',
    location: {
      lat: 23.52,
      lng: 87.05
    }
  },
  'WB126': {
    wellId: 'WB126',
    level: 15,
    levelStatus: 'Risky',
    tds: 820,
    ph: 6.5,
    temperature: 28,
    lastSync: '2025-05-18T12:15:00',
    location: {
      lat: 23.48,
      lng: 87.08
    }
  }
};

// Mock alerts data
const mockAlerts: Record<string, Alert[]> = {
  'WB124': [
    {
      id: 'A1',
      wellId: 'WB124',
      type: 'High TDS',
      message: 'High TDS detected in well WB124',
      timestamp: '2025-05-18T10:30:00',
      resolved: false
    }
  ],
  'WB125': [
    {
      id: 'A2',
      wellId: 'WB125',
      type: 'Low Level',
      message: 'Low water level in well WB125',
      timestamp: '2025-05-18T09:15:00',
      resolved: false
    }
  ],
  'WB126': [
    {
      id: 'A3',
      wellId: 'WB126',
      type: 'High Usage',
      message: 'Unusually high water usage from well WB126',
      timestamp: '2025-05-18T11:45:00',
      resolved: false
    },
    {
      id: 'A4',
      wellId: 'WB126',
      type: 'Low Level',
      message: 'Critical water level in well WB126',
      timestamp: '2025-05-18T08:30:00',
      resolved: false
    }
  ]
};

// Mock usage data
const mockUsageData: UsageData = {
  todayUsage: 950,
  todayLimit: 1000,
  savedWater: 5000,
  savedMoney: 50
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch sensor data for a specific well
export const fetchSensorData = async (wellId: string): Promise<WellSensorData> => {
  await delay(300); // Simulate network delay
  const data = mockSensorData[wellId];
  
  if (!data) {
    throw new Error(`No sensor data found for well ${wellId}`);
  }
  
  return {
    ...data,
    lastSync: new Date().toISOString() // Update the last sync time
  };
};

// Fetch alerts for a specific well
export const fetchAlerts = async (wellId: string): Promise<Alert[]> => {
  await delay(200); // Simulate network delay
  const data = mockAlerts[wellId] || [];
  
  // Include alerts for all wells that the farmer might be responsible for
  const allWellIds = Object.keys(mockAlerts);
  let allAlerts: Alert[] = [];
  
  allWellIds.forEach(id => {
    allAlerts = [...allAlerts, ...mockAlerts[id]];
  });
  
  return allAlerts.filter(alert => !alert.resolved);
};

// Fetch usage data
export const fetchUsageData = async (): Promise<UsageData> => {
  await delay(250); // Simulate network delay
  return mockUsageData;
};

// Submit manual sensor data (for farmers in areas with poor connectivity)
export const submitManualData = async (
  wellId: string, 
  data: { level?: number; tds?: number; temperature?: number }
): Promise<boolean> => {
  await delay(400); // Simulate network delay
  
  // Update mock data
  if (mockSensorData[wellId]) {
    mockSensorData[wellId] = {
      ...mockSensorData[wellId],
      ...data,
      lastSync: new Date().toISOString()
    };
    return true;
  }
  
  return false;
};

// Resolve an alert
export const resolveAlert = async (alertId: string): Promise<boolean> => {
  await delay(300); // Simulate network delay
  
  // Find and update the alert
  for (const wellId in mockAlerts) {
    const alertIndex = mockAlerts[wellId].findIndex(alert => alert.id === alertId);
    if (alertIndex !== -1) {
      mockAlerts[wellId][alertIndex].resolved = true;
      return true;
    }
  }
  
  return false;
};