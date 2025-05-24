import React from 'react';
import { motion } from 'framer-motion';
import { DropletIcon, ChevronRight } from 'lucide-react';
import { useFarmer } from '../../contexts/FarmerContext';
import { useSensorData } from '../../contexts/SensorDataContext';
import { useTranslation } from '../../hooks/useTranslation';

const WelcomeBanner: React.FC = () => {
  const { farmer } = useFarmer();
  const { sensorData } = useSensorData();
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('welcome.morning');
    if (hour < 17) return t('welcome.afternoon');
    return t('welcome.evening');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-12 w-12 rounded-full bg-[#0079C2] text-white flex items-center justify-center text-lg font-semibold cursor-pointer border-2 border-[#005a8e]"
            onClick={() => window.location.href = '/profile'}
            aria-label="Farmer profile"
          >
            {getInitials(farmer.name)}
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold text-[#0079C2]">
              {getGreeting()}, {farmer.name}!
            </h1>
            <p className="text-sm text-gray-600">
              {t('welcome.wellStatus', { status: t(`waterStatus.${sensorData.levelStatus.toLowerCase()}`) })}
            </p>
          </div>
        </div>
        <motion.a
          href="/wells"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-[#0079C2] text-white rounded-lg flex items-center gap-2 hover:bg-[#005a8e] focus:ring-2 focus:ring-[#0079C2]"
        >
          <span>{t('welcome.checkWells')}</span>
          <ChevronRight className="h-5 w-5" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;