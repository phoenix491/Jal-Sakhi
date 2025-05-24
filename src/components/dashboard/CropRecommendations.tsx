import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const CropRecommendations: React.FC = () => {
  const { t } = useTranslation();

  const recommendations = [
    {
      name: 'Bajra',
      yield: 2,
      waterUsage: 'Low Water',
      imageUrl: 'https://images.pexels.com/photos/533982/pexels-photo-533982.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Jowar',
      yield: 1.8,
      waterUsage: 'Low Water',
      imageUrl: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sprout className="h-5 w-5 text-[#10B981]" />
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('crops.title')}</h2>
      </div>
      <div className="space-y-3">
        {recommendations.map((crop, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = `/crops/${crop.name.toLowerCase()}/guide`}
          >
            <motion.div
              className="h-16 w-16 rounded-lg bg-cover bg-center border border-gray-100"
              style={{ backgroundImage: `url(${crop.imageUrl})` }}
              whileHover={{ scale: 1.05 }}
            />
            <div className="flex-1">
              <div className="text-lg font-semibold text-slate-800">{crop.name}</div>
              <div className="text-sm text-gray-600 flex items-center justify-between">
                <span>{t('crops.yield', { amount: crop.yield })}</span>
                <span className="text-xs bg-[#D1FAE5] text-[#10B981] px-2 py-1 rounded-full">{crop.waterUsage}</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-[#0079C2]" />
          </motion.div>
        ))}
        <motion.a
          href="/crops"
          whileHover={{ scale: 1.05 }}
          className="block mt-4 text-sm text-center text-[#0079C2] hover:text-[#005a8e]"
        >
          {t('crops.sowing')}
        </motion.a>
      </div>
    </motion.div>
  );
};

export default CropRecommendations;