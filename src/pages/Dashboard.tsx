import React from 'react';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import WaterStatusDial from '../components/dashboard/WaterStatusDial';
import SmartUsageCards from '../components/dashboard/SmartUsageCards';
import JalMitraAI from '../components/dashboard/JalMitraAI';
import AlertsHub from '../components/dashboard/AlertsHub';
import GamificationPanel from '../components/dashboard/GamificationPanel';
import WellMapView from '../components/dashboard/WellMapView';
import SensorDataPanel from '../components/dashboard/SensorDataPanel';
import CropRecommendations from '../components/dashboard/CropRecommendations';
import SavingsStatus from '../components/dashboard/SavingsStatus';
import SettingsPanel from '../components/dashboard/SettingsPanel';
import CommunityWall from '../components/dashboard/CommunityWall';
import VideoTutorials from '../components/dashboard/VideoTutorials';
import FeedbackForm from '../components/dashboard/FeedbackForm';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Full width sections */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <WelcomeBanner />
      </div>
      
      {/* Two-column sections */}
      <div className="col-span-1 md:col-span-1 lg:col-span-1">
        <WaterStatusDial />
      </div>
      <div className="col-span-1 md:col-span-1 lg:col-span-2">
        <SmartUsageCards />
      </div>
      
      <div className="col-span-1 md:col-span-1 lg:col-span-1">
        <GamificationPanel />
      </div>
      <div className="col-span-1 md:col-span-1 lg:col-span-1">
        <SensorDataPanel />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <JalMitraAI />
      </div>
      
      {/* Large sections */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <AlertsHub />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <CropRecommendations />
      </div>
      
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <WellMapView />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <SavingsStatus />
      </div>
      
      <div className="col-span-1 md:col-span-1 lg:col-span-1">
        <SettingsPanel />
      </div>
      <div className="col-span-1 md:col-span-1 lg:col-span-1">
        <VideoTutorials />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <CommunityWall />
      </div>
      
      {/* Full width sections */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <FeedbackForm />
      </div>
    </div>
  );
};

export default Dashboard;