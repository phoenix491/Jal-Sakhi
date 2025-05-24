import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DropletIcon, TrendingUp } from 'lucide-react';
import { useSensorData } from '../../contexts/SensorDataContext';
import { useTranslation } from '../../hooks/useTranslation';

const WaterStatusDial: React.FC = () => {
  const { sensorData } = useSensorData();
  const { t } = useTranslation();
  const [wells] = useState<string[]>(['WB124', 'WB125', 'WB126']);
  const [selectedWell, setSelectedWell] = useState<string>(sensorData.wellId);
  const [animatedLevel, setAnimatedLevel] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(sensorData.level);
    }, 300);
    return () => clearTimeout(timer);
  }, [sensorData.level]);

  const getStatusColor = () => {
    if (sensorData.levelStatus === 'Safe') return '#10B981';
    if (sensorData.levelStatus === 'Moderate') return '#F59E0B';
    return '#EF4444';
  };

  const calculateDialPath = () => {
    const percentage = animatedLevel / 100;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * percentage);
    const radius = 70;
    const cx = 80;
    const cy = 80;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#0079C2] flex items-center">
          <DropletIcon className="h-5 w-5 mr-2" />
          {t('waterStatus.title')}
        </h2>
        <select
          value={selectedWell}
          onChange={(e) => setSelectedWell(e.target.value)}
          className="p-2 bg-white border border-[#0079C2] rounded-md text-sm focus:ring-2 focus:ring-[#0079C2]"
          aria-label="Select well"
        >
          {wells.map(well => (
            <option key={well} value={well}>{well}</option>
          ))}
        </select>
      </div>
      <motion.div
        className="flex flex-col items-center justify-center flex-grow cursor-pointer group relative"
        onClick={() => window.location.href = '/trends'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative w-40 h-40 md:w-48 md:h-48" role="img" aria-describedby="status-tooltip">
          <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
            <circle cx="80" cy="80" r="70" fill="none" stroke="#E2E8F0" strokeWidth="8" />
          </svg>
          <motion.svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            className="absolute inset-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <motion.path
              d={calculateDialPath()}
              fill={getStatusColor()}
              opacity="0.8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animatedLevel / 100 }}
              transition={{ duration: 0.5 }}
            />
          </motion.svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-800">{animatedLevel}%</span>
            <span className="text-base font-medium text-gray-600">
              {t(`waterStatus.${sensorData.levelStatus.toLowerCase()}`)}
            </span>
          </div>
        </div>
        <div
          id="status-tooltip"
          className="absolute top-0 right-0 bg-white border border-gray-100 p-2 rounded-lg shadow-md text-xs text-gray-600 hidden group-hover:block z-10"
        >
          {t(`waterStatus.${sensorData.levelStatus.toLowerCase()}Desc`)}
        </div>
        <motion.a
          href="/trends"
          className="mt-4 text-[#0079C2] hover:text-[#005a8e] text-sm flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingUp className="h-5 w-5" />
          {t('waterStatus.viewTrends')}
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default WaterStatusDial;