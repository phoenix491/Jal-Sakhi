import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Thermometer, Droplet, Activity, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { useSensorData } from '../../contexts/SensorDataContext';
import { useTranslation } from '../../hooks/useTranslation';

const SensorDataPanel: React.FC = () => {
  const { sensorData } = useSensorData();
  const { t } = useTranslation();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  // Mock trend data (in real app, compare with historical data)
  const trends = {
    level: sensorData.level > 50 ? 'up' : 'down',
    tds: sensorData.tds > 500 ? 'up' : 'down',
    ph: sensorData.ph > 7 ? 'up' : 'down',
    temperature: sensorData.temperature > 25 ? 'up' : 'down',
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-5 w-5 text-[#0079C2]" />
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('sensorData.title')}</h2>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm text-gray-600">{t('sensorData.wellId')}:</div>
          <div className="text-sm font-medium text-slate-800">{sensorData.wellId}</div>
          <div className="text-sm text-gray-600 flex items-center gap-1 group relative">
            <Droplet className="h-4 w-4 text-[#0079C2]" />
            {t('sensorData.level')}:
            <div
              id="level-tooltip"
              className="absolute top-0 left-0 bg-white border border-gray-100 p-2 rounded-lg shadow-md text-xs text-gray-600 hidden group-hover:block z-10"
            >
              {t('sensorData.levelTooltip')}
            </div>
          </div>
          <div className="text-sm font-medium text-slate-800 flex items-center gap-1 cursor-pointer" onClick={() => window.location.href = '/trends'}>
            {sensorData.level}% {trends.level === 'up' ? <TrendingUp className="h-4 w-4 text-[#10B981]" /> : <TrendingDown className="h-4 w-4 text-[#EF4444]" />}
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-1 group relative">
            <Activity className="h-4 w-4 text-[#0079C2]" />
            {t('sensorData.tds')}:
            <div
              id="tds-tooltip"
              className="absolute top-0 left-0 bg-white border border-gray-100 p-2 rounded-lg shadow-md text-xs text-gray-600 hidden group-hover:block z-10"
            >
              {t('sensorData.tdsTooltip')}
            </div>
          </div>
          <div className="text-sm font-medium text-slate-800 flex items-center gap-1 cursor-pointer" onClick={() => window.location.href = '/trends'}>
            {sensorData.tds} ppm {trends.tds === 'up' ? <TrendingUp className="h-4 w-4 text-[#10B981]" /> : <TrendingDown className="h-4 w-4 text-[#EF4444]" />}
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-1 group relative">
            pH:
            <div
              id="ph-tooltip"
              className="absolute top-0 left-0 bg-white border border-gray-100 p-2 rounded-lg shadow-md text-xs text-gray-600 hidden group-hover:block z-10"
            >
              {t('sensorData.phTooltip')}
            </div>
          </div>
          <div className="text-sm font-medium text-slate-800 flex items-center gap-1 cursor-pointer" onClick={() => window.location.href = '/trends'}>
            {sensorData.ph} {trends.ph === 'up' ? <TrendingUp className="h-4 w-4 text-[#10B981]" /> : <TrendingDown className="h-4 w-4 text-[#EF4444]" />}
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-1 group relative">
            <Thermometer className="h-4 w-4 text-[#0079C2]" />
            {t('sensorData.temp')}:
            <div
              id="temp-tooltip"
              className="absolute top-0 left-0 bg-white border border-gray-100 p-2 rounded-lg shadow-md text-xs text-gray-600 hidden group-hover:block z-10"
            >
              {t('sensorData.tempTooltip')}
            </div>
          </div>
          <div className="text-sm font-medium text-slate-800 flex items-center gap-1 cursor-pointer" onClick={() => window.location.href = '/trends'}>
            {sensorData.temperature}°C {trends.temperature === 'up' ? <TrendingUp className="h-4 w-4 text-[#10B981]" /> : <TrendingDown className="h-4 w-4 text-[#EF4444]" />}
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-2">
          {t('sensorData.lastSync', { date: formatDate(sensorData.lastSync) })}
        </div>
        <motion.a
          href="/manual-data"
          whileHover={{ scale: 1.05 }}
          className="mt-3 text-sm text-[#0079C2] hover:text-[#005a8e] flex items-center"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          {t('sensorData.manualData')}
        </motion.a>
      </div>
    </motion.div>
  );
};

export default SensorDataPanel;