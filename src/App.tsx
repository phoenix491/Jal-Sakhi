import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CropIcon as WaterDropIcon } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TrendsAndAdvisory from './pages/TrendsAndAdvisory';
import Alerts from './pages/Alerts';
import Jalmitra from './pages/Jalmitra';
import Rewards from './pages/Rewards';
import Community from './pages/Community';
import WellMap from './pages/WellMap';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Settings from './pages/Settings';
import { LanguageProvider } from './contexts/LanguageContext';
import { FarmerProvider } from './contexts/FarmerContext';
import { SensorDataProvider } from './contexts/SensorDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  console.log('PrivateRoute: isAuthenticated=', isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <FarmerProvider>
            <SensorDataProvider>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route element={<PrivateRoute />}>
                  <Route
                    element={
                      <Layout>
                        <Outlet />
                      </Layout>
                    }
                  >
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/trendsandadvisory" element={<TrendsAndAdvisory />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/jalmitra" element={<Jalmitra />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/wellmap" element={<WellMap />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/help" element={<div>Help Page</div>} />
                    <Route path="/menu" element={<div>Menu Page</div>} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/signin" replace />} />
              </Routes>
            </SensorDataProvider>
          </FarmerProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;