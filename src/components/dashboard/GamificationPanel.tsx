import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Gift } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface GamificationPanelProps {
  onRewardClaim: () => void;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ onRewardClaim }) => {
  const { t } = useTranslation();
  const [coins, setCoins] = useState<number>(120);
  const [progress, setProgress] = useState<number>(0);
  const [streak, setStreak] = useState<number>(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(80);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClaimReward = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setCoins(prev => prev + 20);
    setStreak(prev => prev + 1);
    onRewardClaim();
    alert('You have claimed a reward: 20% discount on seeds!');
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-[#F59E0B]" />
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('rewards.title')}</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#FEF3C7] p-2 rounded-full">
            <Award className="h-5 w-5 text-[#F59E0B]" />
          </div>
          <span className="text-lg font-semibold text-slate-800">{t('rewards.coins', { amount: coins })}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#FEF3C7] px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-[#F59E0B]">{t('rewards.streak', { days: streak })}</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">{t('rewards.progress')}</div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <motion.button
        onClick={handleClaimReward}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#F59E0B]"
      >
        <Gift className="h-5 w-5" />
        <span>{t('rewards.claimReward')}</span>
      </motion.button>
    </motion.div>
  );
};

export default GamificationPanel;