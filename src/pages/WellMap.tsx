import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { AlertCircle, MapPin, Navigation, Flag, MessageSquare, Plus, Search, Layers, Locate } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mock contexts for demo
interface Farmer {
  village: string;
}
const FarmerContext = React.createContext<{ farmer: Farmer }>({ farmer: { village: 'Rarh Bankura' } });
const useFarmer = () => React.useContext(FarmerContext);

interface Well {
  id: string;
  coords: LatLngTuple;
  village: string;
  owner: string;
  depth: number;
  level: number;
  tds: number;
  type: 'borewell' | 'open';
  hasSensor: boolean;
  status: 'safe' | 'moderate' | 'critical';
  lastSynced: string;
}

interface SensorData {
  wells: Well[];
}
const SensorDataContext = React.createContext<SensorData>({ wells: [] });
const useSensorData = () => React.useContext(SensorDataContext);

// Custom marker icons
const createIcon = (type: string, status: string, hasSensor: boolean) => {
  const color = status === 'safe' ? '#22c55e' : status === 'moderate' ? '#f59e0b' : '#ef4444';
  const icon = hasSensor ? '📶' : type === 'borewell' ? '🧊' : '💧';
  return L.divIcon({
    html: `<div style="background-color: ${color}; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: 2px solid white;"><span style="font-size: 16px;">${icon}</span></div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Component to update map center
const MapCenter: React.FC<{ center: LatLngTuple }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

const WellMap: React.FC = () => {
  const { farmer } = useFarmer();
  const { wells } = useSensorData();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    tds: 'all' as 'all' | 'low' | 'high',
    depth: 'all' as 'all' | 'low' | 'high',
    status: 'all' as 'all' | 'safe' | 'moderate' | 'critical',
    owner: '',
    lastSynced: 'all' as 'all' | 'recent' | 'old',
  });
  const [layer, setLayer] = useState<'groundwater' | 'recharge' | 'boundaries'>('groundwater');
  const [center, setCenter] = useState<LatLngTuple>([23.5, 87.0]); // Default: Bankura
  const [showAddWell, setShowAddWell] = useState(false);
  const [newWell, setNewWell] = useState({ id: '', owner: '', village: farmer.village, coords: center });
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  // Mock wells data
  const mockWells: Well[] = [
    {
      id: 'WB124',
      coords: [23.5, 87.0],
      village: 'Rarh Bankura',
      owner: 'Ramesh Patel',
      depth: 38,
      level: 21,
      tds: 1240,
      type: 'borewell',
      hasSensor: true,
      status: 'critical',
      lastSynced: '2025-05-25T08:45:00Z',
    },
    {
      id: 'WB125',
      coords: [23.51, 87.01],
      village: 'Rarh Bankura',
      owner: 'Sita Devi',
      depth: 45,
      level: 60,
      tds: 400,
      type: 'open',
      hasSensor: false,
      status: 'safe',
      lastSynced: '2025-05-24T10:30:00Z',
    },
    {
      id: 'WB126',
      coords: [23.49, 86.99],
      village: 'Rarh Bankura',
      owner: 'Amit Sharma',
      depth: 40,
      level: 45,
      tds: 600,
      type: 'borewell',
      hasSensor: true,
      status: 'moderate',
      lastSynced: '2025-05-25T07:15:00Z',
    },
  ];

  const [wellsList, setWellsList] = useState<Well[]>(mockWells);

  // Simulate geolocation
  const handleLocate = () => {
    setCenter([23.5, 87.0]); // Mock user location
  };

  // Filter wells
  const filteredWells = wellsList.filter((well) => {
    const matchesSearch =
      well.id.toLowerCase().includes(search.toLowerCase()) ||
      well.village.toLowerCase().includes(search.toLowerCase()) ||
      well.owner.toLowerCase().includes(search.toLowerCase());
    const matchesTds =
      filters.tds === 'all' ||
      (filters.tds === 'low' && well.tds < 500) ||
      (filters.tds === 'high' && well.tds > 1000);
    const matchesDepth =
      filters.depth === 'all' ||
      (filters.depth === 'low' && well.level < 25) ||
      (filters.depth === 'high' && well.level > 50);
    const matchesStatus = filters.status === 'all' || well.status === filters.status;
    const matchesOwner = filters.owner === '' || well.owner.toLowerCase().includes(filters.owner.toLowerCase());
    const matchesSync =
      filters.lastSynced === 'all' ||
      (filters.lastSynced === 'recent' &&
        new Date(well.lastSynced) > new Date(Date.now() - 24 * 60 * 60 * 1000)) ||
      (filters.lastSynced === 'old' && new Date(well.lastSynced) <= new Date(Date.now() - 24 * 60 * 60 * 1000));
    return matchesSearch && matchesTds && matchesDepth && matchesStatus && matchesOwner && matchesSync;
  });

  // Handle add well
  const handleAddWell = () => {
    if (newWell.id && newWell.owner) {
      setWellsList((prev) => [
        ...prev,
        {
          id: newWell.id,
          coords: newWell.coords,
          village: newWell.village,
          owner: newWell.owner,
          depth: 0,
          level: 0,
          tds: 0,
          type: 'borewell',
          hasSensor: false,
          status: 'moderate',
          lastSynced: new Date().toISOString(),
        },
      ]);
      setShowAddWell(false);
      setNewWell({ id: '', owner: '', village: farmer.village, coords: center });
      // POST /api/wells in production
    }
  };

  // Handle report well
  const handleReportWell = (wellId: string, reason: string) => {
    console.log(`Reported well ${wellId}: ${reason}`);
    // POST /api/wells/report in production
  };

  // Simulate live sync
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleString());
    }, 120000); // Update every 2 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-4 h-screen flex flex-col md:flex-row"
    >
      {/* Sidebar for Desktop, Collapsible for Mobile */}
      <div className="md:w-1/4 space-y-4 md:pr-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Well Map</h1>
          <p className="text-sm text-gray-500">Updated: {lastUpdated}</p>
        </div>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Well ID, Village, or Owner..."
            className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <div className="space-y-2">
          <select
            value={filters.tds}
            onChange={(e) => setFilters({ ...filters, tds: e.target.value as 'all' | 'low' | 'high' })}
            className="w-full p-2 rounded-lg border border-gray-300"
          >
            <option value="all">TDS: All</option>
            <option value="low">TDS: Low (&lt;500)</option>
            <option value="high">TDS: High (&gt;1000)</option>
          </select>
          <select
            value={filters.depth}
            onChange={(e) => setFilters({ ...filters, depth: e.target.value as 'all' | 'low' | 'high' })}
            className="w-full p-2 rounded-lg border border-gray-300"
          >
            <option value="all">Depth: All</option>
            <option value="low">Depth: Low (&lt;25%)</option>
            <option value="high">Depth: High (&gt;50%)</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as 'all' | 'safe' | 'moderate' | 'critical' })}
            className="w-full p-2 rounded-lg border border-gray-300"
          >
            <option value="all">Status: All</option>
            <option value="safe">Status: Safe</option>
            <option value="moderate">Status: Moderate</option>
            <option value="critical">Status: Critical</option>
          </select>
          <input
            type="text"
            value={filters.owner}
            onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
            placeholder="Filter by Owner"
            className="w-full p-2 rounded-lg border border-gray-300"
          />
          <select
            value={filters.lastSynced}
            onChange={(e) => setFilters({ ...filters, lastSynced: e.target.value as 'all' | 'recent' | 'old' })}
            className="w-full p-2 rounded-lg border border-gray-300"
          >
            <option value="all">Last Synced: All</option>
            <option value="recent">Last Synced: Recent (&lt;24h)</option>
            <option value="old">Last Synced: Older (&gt;24h)</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayer('groundwater')}
            className={`p-2 rounded-lg ${layer === 'groundwater' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Layers className="h-5 w-5" /> Groundwater
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayer('recharge')}
            className={`p-2 rounded-lg ${layer === 'recharge' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Layers className="h-5 w-5" /> Recharge Zones
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddWell(true)}
          className="w-full p-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus className="inline h-5 w-5 mr-1" /> Add Well
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLocate}
          className="w-full p-2 bg-blue-600 text-white rounded-lg"
        >
          <Locate className="inline h-5 w-5 mr-1" /> My Location
        </motion.button>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 h-full">
        <MapContainer center={center} zoom={12} style={{ height: '100%', minHeight: '400px' }} className="rounded-lg">
          <MapCenter center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredWells.map((well) => (
            <Marker
              key={well.id}
              position={well.coords}
              icon={createIcon(well.type, well.status, well.hasSensor)}
            >
              <Popup>
                <div className="space-y-2 text-sm">
                  <h3 className="text-lg font-semibold">{well.id}</h3>
                  <p><strong>Village:</strong> {well.village}</p>
                  <p><strong>Owner:</strong> {well.owner}</p>
                  <p><strong>Depth:</strong> {well.depth} meters</p>
                  <p><strong>Current Water Level:</strong> {well.level}%</p>
                  <p><strong>TDS Level:</strong> {well.tds} ppm</p>
                  <p><strong>Last Synced:</strong> {new Date(well.lastSynced).toLocaleString()}</p>
                  <p><strong>Status:</strong> {well.status.charAt(0).toUpperCase() + well.status.slice(1)}</p>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(`https://maps.google.com/?q=${well.coords[0]},${well.coords[1]}`, '_blank')}
                      className="p-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      <Navigation className="inline h-4 w-4 mr-1" /> Navigate
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReportWell(well.id, 'Dry well')}
                      className="p-2 bg-red-500 text-white rounded-lg text-sm"
                    >
                      <Flag className="inline h-4 w-4 mr-1" /> Report Dry
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-gray-200 rounded-lg text-sm"
                    >
                      <MessageSquare className="inline h-4 w-4 mr-1" /> Community
                    </motion.button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Add Well Modal */}
      <AnimatePresence>
        {showAddWell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg max-w-lg w-full space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800">Add New Well</h2>
              <input
                type="text"
                value={newWell.id}
                onChange={(e) => setNewWell({ ...newWell, id: e.target.value })}
                placeholder="Well ID (e.g., WB999)"
                className="w-full p-2 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                value={newWell.owner}
                onChange={(e) => setNewWell({ ...newWell, owner: e.target.value })}
                placeholder="Owner Name"
                className="w-full p-2 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                value={newWell.village}
                onChange={(e) => setNewWell({ ...newWell, village: e.target.value })}
                placeholder="Village"
                className="w-full p-2 rounded-lg border border-gray-300"
              />
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddWell}
                  className="p-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                  Submit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddWell(false)}
                  className="p-2 bg-red-500 text-white rounded-lg text-sm"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Wrap with contexts for demo
const App: React.FC = () => (
  <FarmerContext.Provider value={{ farmer: { village: 'Rarh Bankura' } }}>
    <SensorDataContext.Provider value={{ wells: [] }}>
      <WellMap />
    </SensorDataContext.Provider>
  </FarmerContext.Provider>
);

export default WellMap;