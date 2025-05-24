import React from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, Download } from 'lucide-react';
import { useSensorData } from '../../contexts/SensorDataContext';
import { useTranslation } from '../../hooks/useTranslation';

const SavingsStatus: React.FC = () => {
  const { usageData } = useSensorData();
  const { t } = useTranslation();
  const savingsGoal = 500; // Mock goal in ₹
  const goalProgress = (usageData.savedMoney / savingsGoal) * 100;

  const handleDownloadReport = () => {
    alert(t('savings.downloadStarted'));
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <CircleDollarSign className="h-5 w-5 text-[#10B981]" />
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('savings.title')}</h2>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#D1FAE5] rounded-lg p-4">
            <div className="text-sm text-gray-600">{t('savings.earned', { amount: usageData.savedMoney })}</div>
            <div className="text-lg font-semibold text-[#10B981]">₹{usageData.savedMoney}</div>
          </div>
          <div className="bg-[#BFDBFE] rounded-lg p-4">
            <div className="text-sm text-gray-600">{t('savings.saved', { amount: usageData.savedWater })}</div>
            <div className="text-lg font-semibold text-[#3B82F6]">{usageData.savedWater}L</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">{t('savings.goal', { amount: savingsGoal })}</div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0079C2] to-[#005a8e]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(goalProgress, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <motion.button
          onClick={handleDownloadReport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-[#0079C2] hover:bg-[#005a8e] text-white rounded-lg flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#0079C2]"
        >
          <Download className="h-5 w-5" />
          <span>{t('savings.download')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SavingsStatus;