import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Search, Volume2, Upload, Share2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Mock contexts for demo purposes
interface Farmer {
  village: string;
}
const FarmerContext = React.createContext<{ farmer: Farmer }>({ farmer: { village: 'Sample Village' } });
const useFarmer = () => React.useContext(FarmerContext);

const SensorDataContext = React.createContext<{ alerts: Alert[] }>({ alerts: [] });
const useSensorData = () => React.useContext(SensorDataContext);

interface Alert {
  id: string;
  type: string;
  wellId: string;
  severity: 'critical' | 'moderate' | 'advisory';
  data: { tds?: number; level?: number; usage?: number; ph?: number };
  status: 'unresolved' | 'resolved';
  suggestion: string;
  timestamp: string;
}

const Alerts: React.FC = () => {
  const { farmer } = useFarmer();
  const { alerts } = useSensorData();
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Advisory' | 'Resolved'>('All');
  const [search, setSearch] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  // Expanded mock alerts with mixed statuses
  const mockAlerts: Alert[] = [
    {
      id: 'AL-245WB124',
      type: 'High TDS',
      wellId: 'WB124',
      severity: 'critical',
      data: { tds: 1240 },
      status: 'unresolved',
      suggestion: 'Avoid drinking directly. Consider boiling or rainwater collection.',
      timestamp: '2025-05-25T09:45:00Z',
    },
    {
      id: 'AL-246WB124',
      type: 'Low: Low Groundwater',
      wellId: 'WB124',
      severity: 'moderate',
      data: { level: 21 },
      status: 'unresolved',
      suggestion: 'Reduce irrigation frequency. Use drip systems.',
      timestamp: '2025-05-24T14:20:00Z',
    },
    {
      id: 'AL-247WB125',
      type: 'Recharge Suggested',
      wellId: 'WB125',
      severity: 'advisory',
      data: {},
      status: 'resolved',
      suggestion: 'Clean borewell and prepare for recharge this week.',
      timestamp: '2025-05-23T08:00:00Z',
    },
    {
      id: 'AL-248WB126',
      type: 'High Water Usage',
      wellId: 'WB126',
      severity: 'moderate',
      data: { usage: 1500 },
      status: 'unresolved',
      suggestion: 'Check for leaks or overuse in irrigation systems.',
      timestamp: '2025-05-22T10:30:00Z',
    },
    {
      id: 'AL-249WB127',
      type: 'Low pH Detected',
      wellId: 'WB127',
      severity: 'critical',
      data: { ph: 5.2 },
      status: 'resolved',
      suggestion: 'Test water quality and consider neutralization treatment.',
      timestamp: '2025-05-21T12:15:00Z',
    },
    {
      id: 'AL-250WB128',
      type: 'Pump Maintenance',
      wellId: 'WB128',
      severity: 'advisory',
      data: {},
      status: 'unresolved',
      suggestion: 'Schedule routine pump maintenance to prevent failures.',
      timestamp: '2025-05-20T09:00:00Z',
    },
    {
      id: 'AL-251WB124',
      type: 'High TDS',
      wellId: 'WB124',
      severity: 'critical',
      data: { tds: 1300 },
      status: 'resolved',
      suggestion: 'Install reverse osmosis system for drinking water.',
      timestamp: '2025-05-19T16:45:00Z',
    },
  ];

  const [alertsList, setAlertsList] = useState<Alert[]>(mockAlerts);

  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleString());
    // Fetch new alerts via API in production
  };

  const handleResolve = (id: string) => {
    setAlertsList((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status: 'resolved' } : alert))
    );
    // PATCH /api/alerts/:id in production
  };

  const handleSnooze = (id: string) => {
    setAlertsList((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status: 'resolved' } : alert))
    );
  };

  const filteredAlerts = alertsList.filter((alert) => {
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Critical' && alert.severity === 'critical') ||
      (filter === 'Advisory' && alert.severity === 'advisory') ||
      (filter === 'Resolved' && alert.status === 'resolved');
    const matchesSearch =
      alert.type.toLowerCase().includes(search.toLowerCase()) ||
      alert.wellId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const chartData = {
    labels: [
      'High TDS',
      'Low Groundwater',
      'Recharge Suggested',
      'High Water Usage',
      'Low pH Detected',
      'Pump Maintenance',
    ],
    datasets: [
      {
        data: [
          alertsList.filter((a) => a.type === 'High TDS').length,
          alertsList.filter((a) => a.type === 'Low Groundwater').length,
          alertsList.filter((a) => a.type === 'Recharge Suggested').length,
          alertsList.filter((a) => a.type === 'High Water Usage').length,
          alertsList.filter((a) => a.type === 'Low pH Detected').length,
          alertsList.filter((a) => a.type === 'Pump Maintenance').length,
        ],
        backgroundColor: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#d946ef', '#6b7280'],
        borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
        borderWidth: 1,
      },
    ],
  };

  const downloadCsv = () => {
    const csv = [
      'ID,Type,Well ID,Severity,Status,Timestamp,Suggestion',
      ...alertsList.map(
        (a) => `${a.id},${a.type},${a.wellId},${a.severity},${a.status},${a.timestamp},${a.suggestion}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `Alerts_Report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-4"
    >
      {/* Alerts Hub */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">My Water Alerts</h1>
            <p className="text-sm text-gray-600">Stay informed, stay safe – check your well’s latest status.</p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500">Last Updated: {lastUpdated}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-blue-600 text-white rounded-lg"
            >
              <RefreshCw className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
          >
            {['All', 'Critical', 'Advisory', 'Resolved'].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by well ID or alert type..."
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Visual Summary Board */}
      <div className="glassmorphic p-4 rounded-lg">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Alert Summary</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3">
            <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">Alerts by Type</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {chartData.labels.map((label, index) => (
                <li key={label}>
                  <span
                    className="inline-block w-3 h-3 mr-2"
                    style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                  ></span>
                  {label}: {chartData.datasets[0].data[index]}
                </li>
              ))}
              <li className="mt-2 font-medium">Total Alerts: {alertsList.length}</li>
              <li>Unresolved: {alertsList.filter((a) => a.status === 'unresolved').length}</li>
              <li>Resolved: {alertsList.filter((a) => a.status === 'resolved').length}</li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadCsv}
              className="mt-4 p-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Download CSV
            </motion.button>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredAlerts.length === 0 ? (
          <p className="text-gray-600 col-span-3">No alerts found.</p>
        ) : (
          filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              className="glassmorphic p-4 rounded-lg relative"
              whileHover={{ scale: 1.02 }}
            >
              <div
                className={`absolute top-0 left-0 h-1 w-full rounded-t-lg ${
                  alert.severity === 'critical'
                    ? 'bg-red-500'
                    : alert.severity === 'moderate'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle
                  className={`h-5 w-5 ${
                    alert.severity === 'critical'
                      ? 'text-red-500'
                      : alert.severity === 'moderate'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}
                />
                <p className="text-lg font-medium text-gray-800">{alert.type}</p>
              </div>
              <p className="text-sm text-gray-600">{new Date(alert.timestamp).toLocaleString()}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{alert.suggestion}</p>
              <div className="flex space-x-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleResolve(alert.id)}
                  className={`p-2 rounded-lg text-sm ${
                    alert.status === 'resolved'
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {alert.status === 'resolved' ? 'Resolved' : 'Resolve'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAlert(alert)}
                  className="p-2 bg-gray-200 text-gray-800 rounded-lg text-sm"
                >
                  Details
                </motion.button>
                {alert.severity !== 'critical' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSnooze(alert.id)}
                    className="p-2 bg-yellow-500 text-white rounded-lg text-sm"
                  >
                    Snooze
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-200 rounded-lg"
                  title="Voice Alert (coming soon)"
                >
                  <Volume2 className="h-5 w-5 text-gray-800" />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Alert Modal */}
      <AnimatePresence>
        {selectedAlert && (
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
              className="bg-white p-6 rounded-lg max-w-lg w-full"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{selectedAlert.type}</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Alert ID:</strong> {selectedAlert.id}
                </p>
                <p>
                  <strong>Type:</strong> {selectedAlert.type}
                </p>
                <p>
                  <strong>Triggered On:</strong> {new Date(selectedAlert.timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>Sensor Source:</strong> {selectedAlert.wellId} (Block A, {farmer.village})
                </p>
                <p>
                  <strong>Data Snapshot:</strong>{' '}
                  {Object.entries(selectedAlert.data)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')}
                </p>
                <p>
                  <strong>AI Suggestion:</strong> {selectedAlert.suggestion}
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleResolve(selectedAlert.id)}
                  className={`p-2 rounded-lg text-sm ${
                    selectedAlert.status === 'resolved'
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  Resolved
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-200 rounded-lg"
                >
                  <Share2 className="h-5 w-5 text-gray-800" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-200 rounded-lg"
                >
                  <Upload className="h-5 w-5 text-gray-800" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-200 rounded-lg"
                >
                  <Phone className="h-5 w-5 text-gray-800" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 bg-red-500 text-white rounded-lg text-sm"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Wrap component with contexts for standalone demo
const App: React.FC = () => (
  <FarmerContext.Provider value={{ farmer: { village: 'Sample Village' } }}>
    <SensorDataContext.Provider value={{ alerts: [] }}>
      <Alerts />
    </SensorDataContext.Provider>
  </FarmerContext.Provider>
);

export default Alerts;