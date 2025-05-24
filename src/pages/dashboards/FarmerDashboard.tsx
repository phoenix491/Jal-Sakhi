import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import WaterStatusDial from '../../components/dashboard/WaterStatusDial';
import SmartUsageCards from '../../components/dashboard/SmartUsageCards';
import JalMitraAI from '../../components/dashboard/JalMitraAI';
import AlertsHub from '../../components/dashboard/AlertsHub';
import GamificationPanel from '../../components/dashboard/GamificationPanel';
import WellMapView from '../../components/dashboard/WellMapView';
import SensorDataPanel from '../../components/dashboard/SensorDataPanel';
import CropRecommendations from '../../components/dashboard/CropRecommendations';
import SavingsStatus from '../../components/dashboard/SavingsStatus';
import SettingsPanel from '../../components/dashboard/SettingsPanel';
import CommunityWall from '../../components/dashboard/CommunityWall';
import VideoTutorials from '../../components/dashboard/VideoTutorials';
import FeedbackForm from '../../components/dashboard/FeedbackForm';
import IrrigationScheduler from '../../components/dashboard/IrrigationScheduler';

const FarmerDashboard: React.FC = () => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-[#F6FAF9] p-6">
      <div className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm p-6 shadow-sm border-b border-gray-100">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#0079C2]">Quick Actions</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="p-3 bg-[#0079C2] text-white rounded-full focus:ring-2 focus:ring-[#0079C2]"
            aria-label={showQuickActions ? 'Hide quick actions' : 'Show quick actions'}
          >
            <Bell className="h-5 w-5" />
          </motion.button>
        </div>
        {showQuickActions && (
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2 max-w-7xl mx-auto scrollbar-hide">
            {[
              { label: 'Check Wells', href: '/wells' },
              { label: 'Ask JalMitra', action: () => alert('Starting JalMitra AI...') },
              { label: 'View Alerts', href: '/alerts' },
              { label: 'Schedule Irrigation', href: '/irrigation' },
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm whitespace-nowrap hover:bg-[#005a8e] focus:ring-2 focus:ring-[#0079C2]"
                onClick={action.href ? () => window.location.href = action.href : action.action}
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        )}
      </div>
      <div className="pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <WelcomeBanner />
        </div>
        <div className="col-span-1">
          <WaterStatusDial />
        </div>
        <div className="col-span-1 md:col-span-2">
          <SmartUsageCards />
        </div>
        <div className="col-span-1">
          <GamificationPanel onRewardClaim={triggerConfetti} />
        </div>
        <div className="col-span-1">
          <SensorDataPanel />
        </div>
        <div className="col-span-1">
          <JalMitraAI />
        </div>
        <div className="col-span-1 md:col-span-2">
          <AlertsHub />
        </div>
        <div className="col-span-1">
          <CropRecommendations />
        </div>
        <div className="col-span-1 md:col-span-2">
          <WellMapView />
        </div>
        <div className="col-span-1">
          <SavingsStatus />
        </div>
        <div className="col-span-1">
          <IrrigationScheduler onScheduleConfirm={triggerConfetti} />
        </div>
        <div className="col-span-1">
          <SettingsPanel />
        </div>
        <div className="col-span-1">
          <VideoTutorials />
        </div>
        <div className="col-span-1">
          <CommunityWall />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;