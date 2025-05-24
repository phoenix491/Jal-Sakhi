import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DropletIcon, CircleDollarSign, Sprout, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSensorData } from '../../contexts/SensorDataContext';
import { useTranslation } from '../../hooks/useTranslation';

const SmartUsageCards: React.FC = () => {
  const { usageData } = useSensorData();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setActiveCard(prev => Math.max(prev - 1, 0));
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setActiveCard(prev => Math.min(prev + 1, 2));
    }
  };

  const usagePercentage = (usageData.todayUsage / usageData.todayLimit) * 100;

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('smartUsage.todayUsage')}</h2>
        <div className="md:hidden flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="p-2 bg-[#F6FAF9] rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-[#0079C2]"
          >
            <ChevronLeft className="h-5 w-5 text-[#0079C2]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollRight}
            aria-label="Scroll right"
            className="p-2 bg-[#F6FAF9] rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-[#0079C2]"
          >
            <ChevronRight className="h-5 w-5 text-[#0079C2]" />
          </motion.button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 md:gap-4 pb-2 scrollbar-hide snap-x"
      >
        <motion.div
          className="bg-white/50 p-6 rounded-lg shadow-sm border border-gray-100 flex-shrink-0 w-64 md:w-auto snap-start cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/usage'}
        >
          <div className="flex items-start justify-between">
            <div className="bg-[#BFDBFE] p-2 rounded-full">
              <DropletIcon className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
          <div className="mt-4 mb-2">
            <div className="text-sm text-gray-600 mb-1">
              {usageData.todayUsage}L / {usageData.todayLimit}L
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0079C2] to-[#005a8e]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          className="bg-white/50 p-6 rounded-lg shadow-sm border border-gray-100 flex-shrink-0 w-64 md:w-auto snap-start cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/savings'}
        >
          <div className="flex items-start justify-between">
            <div className="bg-[#D1FAE5] p-2 rounded-full">
              <CircleDollarSign className="h-5 w-5 text-[#10B981]" />
            </div>
            <span className="text-sm text-gray-600">{t('smartUsage.savings')}</span>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-slate-800">₹{usageData.savedMoney}</div>
            <div className="text-sm text-gray-600">{usageData.savedWater}L saved</div>
          </div>
        </motion.div>
        <motion.div
          className="bg-white/50 p-6 rounded-lg shadow-sm border border-gray-100 flex-shrink-0 w-64 md:w-auto snap-start cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/crops/bajra'}
        >
          <div className="flex items-start justify-between">
            <div className="bg-[#FEF3C7] p-2 rounded-full">
              <Sprout className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <span className="text-sm text-gray-600">{t('smartUsage.cropTip')}</span>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-slate-800">Bajra</div>
            <a href="/crops/bajra" className="text-sm text-[#0079C2] flex items-center mt-1 hover:text-[#005a8e]">
              {t('smartUsage.learnMore')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </motion.div>
      </div>
      <div className="md:hidden flex justify-center gap-2 mt-4">
        {[0, 1, 2].map(index => (
          <motion.div
            key={index}
            className={`h-2 w-2 rounded-full ${index === activeCard ? 'bg-[#0079C2]' : 'bg-gray-300'}`}
            animate={{ scale: index === activeCard ? 1.2 : 1 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SmartUsageCards;