import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Send, AlertCircle, Sun, CloudRain, Droplet } from 'lucide-react';
import { saveAs } from 'file-saver';

// Register Chart.js components
ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// Mock contexts
interface Farmer {
  village: string;
  language: string;
}
const FarmerContext = React.createContext<{ farmer: Farmer }>({ farmer: { village: 'Rarh Bankura', language: 'en' } });
const useFarmer = () => React.useContext(FarmerContext);

interface Well {
  id: string;
  name: string;
  level: number[];
  usage: number[];
  recharge: number[];
}
interface Crop {
  id: string;
  name: string;
  season: string;
  waterRequirement: number;
  yield: number;
  image: string;
  guideUrl: string;
}
interface Weather {
  date: string;
  precipitation: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
}
const SensorDataContext = React.createContext<{ wells: Well[]; crops: Crop[]; weather: Weather[] }>({ wells: [], crops: [], weather: [] });
const useSensorData = () => React.useContext(SensorDataContext);

// Localization
const translations = {
  en: {
    title: 'Farmer Dashboard',
    selectWell: 'Select Well',
    compare: 'Compare Wells',
    waterLevel: 'Water Level (%)',
    usageVsRecharge: 'Usage vs Recharge (L)',
    weatherForecast: 'Weather Forecast',
    precipitation: 'Precipitation (mm)',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    waterStress: 'Water Stress Alerts',
    downloadReport: 'Download Report',
    cropRecommendations: 'Crop Recommendations',
    season: 'Season',
    cropType: 'Crop Type',
    sendSMS: 'Send SMS to Worker',
    noAlerts: 'No water stress alerts',
    source: 'Source: Mock Weather API',
  },
  hi: {
    title: 'किसान डैशबोर्ड',
    selectWell: 'कुआँ चुनें',
    compare: 'कुओं की तुलना करें',
    waterLevel: 'जल स्तर (%)',
    usageVsRecharge: 'उपयोग बनाम रीचार्ज (लीटर)',
    weatherForecast: 'मौसम पूर्वानुमान',
    precipitation: 'वर्षा (मिमी)',
    temperature: 'तापमान (°C)',
    humidity: 'नमी (%)',
    waterStress: 'जल तनाव चेतावनियाँ',
    downloadReport: 'रिपोर्ट डाउनलोड करें',
    cropRecommendations: 'फसल अनुशंसाएँ',
    season: 'मौसम',
    cropType: 'फसल प्रकार',
    sendSMS: 'कर्मचारी को SMS भेजें',
    noAlerts: 'कोई जल तनाव चेतावनी नहीं',
    source: 'स्रोत: मॉक मौसम API',
  },
};

const TrendsAndAdvisory: React.FC = () => {
  const { farmer } = useFarmer();
  const { wells, crops, weather } = useSensorData();
  const t = translations[farmer.language as 'en' | 'hi'];
  const [selectedWells, setSelectedWells] = useState<string[]>([]);
  const [compare, setCompare] = useState(false);
  const [cropFilters, setCropFilters] = useState({ season: 'all' as 'all' | 'Kharif' | 'Rabi', cropType: '' });
  const [language, setLanguage] = useState(farmer.language);

  // Mock data
  const mockWells: Well[] = [
    {
      id: 'WB124',
      name: 'Main Borewell',
      level: [50, 48, 45, 43, 40, 38, 35],
      usage: [1000, 1200, 1100, 1300, 1000, 900, 1100],
      recharge: [800, 850, 900, 750, 800, 700, 600],
    },
    {
      id: 'WB125',
      name: 'Open Well',
      level: [70, 68, 65, 64, 62, 60, 58],
      usage: [800, 900, 850, 870, 820, 800, 780],
      recharge: [1000, 950, 900, 920, 880, 850, 900],
    },
  ];

  const mockCrops: Crop[] = [
    {
      id: 'C1',
      name: 'Rice',
      season: 'Kharif',
      waterRequirement: 1200,
      yield: 2000,
      image: 'https://via.placeholder.com/100?text=Rice',
      guideUrl: 'https://example.com/rice-guide.pdf',
    },
    {
      id: 'C2',
      name: 'Wheat',
      season: 'Rabi',
      waterRequirement: 500,
      yield: 1500,
      image: 'https://via.placeholder.com/100?text=Wheat',
      guideUrl: 'https://example.com/wheat-guide.pdf',
    },
    {
      id: 'C3',
      name: 'Millet',
      season: 'Kharif',
      waterRequirement: 300,
      yield: 1000,
      image: 'https://via.placeholder.com/100?text=Millet',
      guideUrl: 'https://example.com/millet-guide.pdf',
    },
  ];

  const mockWeather: Weather[] = [
    { date: '2025-05-24', precipitation: 5, tempMax: 32, tempMin: 25, humidity: 70, condition: 'rainy' },
    { date: '2025-05-25', precipitation: 0, tempMax: 34, tempMin: 26, humidity: 65, condition: 'sunny' },
    { date: '2025-05-26', precipitation: 2, tempMax: 33, tempMin: 24, humidity: 68, condition: 'cloudy' },
    { date: '2025-05-27', precipitation: 10, tempMax: 31, tempMin: 23, humidity: 75, condition: 'rainy' },
    { date: '2025-05-28', precipitation: 0, tempMax: 35, tempMin: 27, humidity: 60, condition: 'sunny' },
    { date: '2025-05-29', precipitation: 3, tempMax: 32, tempMin: 24, humidity: 70, condition: 'cloudy' },
    { date: '2025-05-30', precipitation: 8, tempMax: 30, tempMin: 22, humidity: 80, condition: 'rainy' },
  ];

  const wellsList = wells.length > 0 ? wells : mockWells;
  const cropsList = crops.length > 0 ? crops : mockCrops;
  const weatherList = weather.length > 0 ? weather : mockWeather;

  // Calculate water stress alerts
  const getWaterStressAlerts = () => {
    const alerts: string[] = [];
    const selected = wellsList.filter((w) => selectedWells.includes(w.id));
    selected.forEach((well) => {
      const latestLevel = well.level[well.level.length - 1];
      if (latestLevel < 40) alerts.push(`Low water level in ${well.name} (${latestLevel}%)`);
    });
    weatherList.forEach((w, idx) => {
      if (w.precipitation === 0 && w.tempMax > 33) {
        alerts.push(`High evapotranspiration on ${w.date}`);
      }
      if (w.humidity > 75 && idx < 3) {
        alerts.push(`High humidity on ${w.date} - watch for fungal risk`);
      }
    });
    return alerts;
  };

  // Chart data
  const lineChartData = (well: Well) => ({
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: t.waterLevel,
        data: well.level,
        borderColor: '#3b82f6',
        fill: false,
      },
      {
        label: t.precipitation,
        data: weatherList.map((w) => w.precipitation * 10), // Scaled for visibility
        borderColor: '#22c55e',
        fill: false,
      },
    ],
  });

  const barChartData = (well: Well) => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Usage (L)',
        data: well.usage.slice(0, 6),
        backgroundColor: '#ef4444',
      },
      {
        label: 'Recharge (L)',
        data: well.recharge.slice(0, 6),
        backgroundColor: '#22c55e',
      },
    ],
  });

  const weatherChartData = {
    labels: weatherList.map((w) => w.date),
    datasets: [
      {
        label: t.precipitation,
        data: weatherList.map((w) => w.precipitation),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const tempChartData = {
    labels: weatherList.map((w) => w.date),
    datasets: [
      {
        label: 'Max Temp (°C)',
        data: weatherList.map((w) => w.tempMax),
        backgroundColor: '#ef4444',
      },
      {
        label: 'Min Temp (°C)',
        data: weatherList.map((w) => w.tempMin),
        backgroundColor: '#22c55e',
      },
    ],
  };

  // Filter crops based on water and weather
  const filteredCrops = cropsList.filter((crop) => {
    const matchesSeason = cropFilters.season === 'all' || crop.season === cropFilters.season;
    const matchesType = cropFilters.cropType === '' || crop.name.toLowerCase().includes(cropFilters.cropType.toLowerCase());
    const waterAvailable = selectedWells.length > 0 ? wellsList.find((w) => w.id === selectedWells[0])?.level.slice(-1)[0] || 0 : 50;
    const totalPrecipitation = weatherList.reduce((sum, w) => sum + w.precipitation, 0);
    const isWaterStressed = waterAvailable < 40 || totalPrecipitation < 10;
    const matchesWater = isWaterStressed ? crop.waterRequirement < 500 : crop.waterRequirement <= waterAvailable * 10;
    const matchesHumidity = weatherList.some((w) => w.humidity > 75) ? crop.name !== 'Rice' : true; // Avoid fungal-prone crops
    return matchesSeason && matchesType && matchesWater && matchesHumidity;
  });

  // Download report
  const downloadReport = () => {
    const selected = wellsList.filter((w) => selectedWells.includes(w.id));
    const csv = [
      'Well ID,Name,Water Level (%),Usage (L),Recharge (L)',
      ...selected.map((w) => `${w.id},${w.name},${w.level.slice(-1)[0]},${w.usage.slice(-1)[0]},${w.recharge.slice(-1)[0]}`),
      '\nWeather Forecast',
      'Date,Precipitation (mm),Max Temp (°C),Min Temp (°C),Humidity (%)',
      ...weatherList.map((w) => `${w.date},${w.precipitation},${w.tempMax},${w.tempMin},${w.humidity}`),
      '\nCrop Recommendations',
      'Crop,Season,Water Requirement (L/acre),Yield (kg/acre)',
      ...filteredCrops.map((c) => `${c.name},${c.season},${c.waterRequirement},${c.yield}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `Farmer_Dashboard_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Send SMS
  const sendSMS = (crop: Crop) => {
    const precipitation = weatherList.reduce((sum, w) => sum + w.precipitation, 0);
    console.log(`SMS: Plant ${crop.name} in ${crop.season}. Expected rainfall: ${precipitation}mm. Guide: ${crop.guideUrl}`);
    // Implement SMS API in production
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-4 flex flex-col gap-4"
    >
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          multiple={compare}
          value={selectedWells}
          onChange={(e) => setSelectedWells(Array.from(e.target.selectedOptions, (option) => option.value).slice(0, 2))}
          className="p-2 rounded-lg border border-gray-300"
        >
          {wellsList.map((well) => (
            <option key={well.id} value={well.id}>
              {well.name}
            </option>
          ))}
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCompare(!compare)}
          className="p-2 bg-blue-600 text-white rounded-lg"
        >
          {t.compare}
        </motion.button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 rounded-lg border border-gray-300"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      {/* Water Trends Panel */}
      <div className="space-y-4 glassmorphic p-4 rounded-lg">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        {selectedWells.map((wellId) => {
          const well = wellsList.find((w) => w.id === wellId);
          if (!well) return null;
          return (
            <div key={wellId} className="space-y-4">
              <h3 className="text-lg font-semibold">{well.name}</h3>
              <div>
                <h4>{t.waterLevel}</h4>
                <Line data={lineChartData(well)} options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
              <div>
                <h4>{t.usageVsRecharge}</h4>
                <Bar data={barChartData(well)} options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
          );
        })}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadReport}
          className="w-full p-2 bg-blue-600 text-white rounded-lg"
        >
          <Download className="inline h-4 w-4 mr-1" /> {t.downloadReport}
        </motion.button>
      </div>

      {/* Weather Forecast Panel */}
      <div className="glassmorphic p-4 rounded-lg space-y-4">
        <h2 className="text-2xl font-semibold">{t.weatherForecast}</h2>
        <p className="text-sm text-gray-600">{t.source}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4>{t.precipitation}</h4>
            <Bar data={weatherChartData} options={{ plugins: { legend: { display: false } } }} />
          </div>
          <div>
            <h4>{t.temperature}</h4>
            <Line data={tempChartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
        <div>
          <h4>{t.waterStress}</h4>
          {getWaterStressAlerts().length === 0 ? (
            <p>{t.noAlerts}</p>
          ) : (
            getWaterStressAlerts().map((alert, idx) => (
              <p key={idx} className="text-red-500">
                <AlertCircle className="inline h-4 w-4 mr-1" /> {alert}
              </p>
            ))
          )}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {weatherList.map((w) => (
            <div key={w.date} className="text-sm">
              <p>{w.date.slice(5)}</p>
              {w.condition === 'sunny' ? (
                <Sun className="mx-auto h-6 w-6 text-yellow-500" />
              ) : w.condition === 'rainy' ? (
                <CloudRain className="mx-auto h-6 w-6 text-blue-500" />
              ) : (
                <CloudRain className="mx-auto h-6 w-6 text-gray-500" />
              )}
              <p>{w.precipitation} mm</p>
              <p>{w.tempMax}/{w.tempMin} °C</p>
              <p>{w.humidity}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Crop Advisory Panel */}
      <div className="glassmorphic p-4 rounded-lg space-y-4">
        <h2 className="text-2xl font-semibold">{t.cropRecommendations}</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={cropFilters.season}
            onChange={(e) => setCropFilters({ ...cropFilters, season: e.target.value as 'all' | 'Kharif' | 'Rabi' })}
            className="p-2 rounded-lg border border-gray-300"
          >
            <option value="all">{t.season}: All</option>
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
          </select>
          <input
            type="text"
            value={cropFilters.cropType}
            onChange={(e) => setCropFilters({ ...cropFilters, cropType: e.target.value })}
            placeholder={t.cropType}
            className="p-2 rounded-lg border border-gray-300"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCrops.map((crop) => (
            <motion.div
              key={crop.id}
              className="glassmorphic p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <img src={crop.image} alt={crop.name} className="w-full h-24 object-cover rounded-lg mb-2" />
              <h3 className="text-lg font-medium">{crop.name}</h3>
              <p>{t.season}: {crop.season}</p>
              <p>Water: {crop.waterRequirement} L/acre</p>
              <p>Yield: {crop.yield} kg/acre</p>
              <div className="flex gap-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(crop.guideUrl, '_blank')}
                  className="p-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                  Sowing Guide
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendSMS(crop)}
                  className="p-2 bg-green-600 text-white rounded-lg text-sm"
                >
                  <Send className="inline h-4 w-4 mr-1" /> {t.sendSMS}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Wrap with contexts for demo
const App: React.FC = () => (
  <FarmerContext.Provider value={{ farmer: { village: 'Rarh Bankura', language: 'en' } }}>
    <SensorDataContext.Provider value={{ wells: [], crops: [], weather: [] }}>
      <TrendsAndAdvisory />
    </SensorDataContext.Provider>
  </FarmerContext.Provider>
);

export default TrendsAndAdvisory;