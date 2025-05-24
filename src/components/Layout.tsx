import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Bell,
  MessageCircle,
  Gift,
  Users,
  Map,
  BarChart,
  Menu,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Droplet
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { path: '/dashboard', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { path: '/alerts', label: 'Alerts', icon: <Bell className="h-5 w-5" /> },
  { path: '/jalmitra', label: 'JalMitra AI', icon: <MessageCircle className="h-5 w-5" /> },
  { path: '/rewards', label: 'Rewards', icon: <Gift className="h-5 w-5" /> },
  { path: '/community', label: 'Community', icon: <Users className="h-5 w-5" /> },
  { path: '/wellmap', label: 'WellMap', icon: <Map className="h-5 w-5" /> },
  { path: '/trendsandadvisory', label: 'Trends & Advisory', icon: <BarChart className="h-5 w-5" /> }
];

const sidebarLinks = [
  ...navLinks,
  { path: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  { path: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  { path: '/help', label: 'Help', icon: <HelpCircle className="h-5 w-5" /> }
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const unreadAlerts = 2; // Hardcoded

  const handleProfileAction = (action: string) => {
    setIsProfileOpen(false);
    if (action === 'View Profile' || action === 'Edit Info') {
      console.log('Navigating to /profile for', action);
      navigate('/profile');
    } else if (action === 'Logout') {
      console.log('Logging out');
      logout();
      alert('Logged out');
      navigate('/signin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-agri-background text-slate-800 font-sans">
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-between items-center px-6 h-16 bg-blue-900/95 text-white shadow sticky top-0 z-50">
        <NavLink to="/dashboard" className="flex items-center space-x-2">
          <Droplet className="h-6 w-6" />
          <span className="text-xl font-semibold">Jal Sakhi</span>
        </NavLink>
        <div className="flex space-x-6">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-1 hover:text-primary-light transition-colors ${
                  isActive ? 'text-primary-light' : ''
                }`
              }
              onClick={() => console.log(`Navigating to ${link.path}`)}
            >
              {link.icon}
              <span>{link.label}</span>
              {link.label === 'Alerts' && unreadAlerts > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadAlerts}
                </span>
              )}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2"
            >
              <User className="h-6 w-6" />
            </motion.button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-lg shadow-lg py-2"
                >
                  <button
                    onClick={() => handleProfileAction('View Profile')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleProfileAction('Edit Info')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit Info
                  </button>
                  <button
                    onClick={() => handleProfileAction('Logout')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white shadow border-t flex justify-around items-center h-14 z-50">
        {[
          { path: '/dashboard', label: 'Home', icon: <Home className="h-6 w-6" /> },
          { path: '/alerts', label: 'Alerts', icon: <Bell className="h-6 w-6" /> },
          { path: '/jalmitra', label: 'JalMitra', icon: <MessageCircle className="h-6 w-6" /> },
          { path: '/rewards', label: 'Rewards', icon: <Gift className="h-6 w-6" /> },
          { path: '/menu', label: 'Menu', icon: <Menu className="h-6 w-6" /> }
        ].map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center text-sm ${
                isActive ? 'text-primary' : 'text-gray-600'
              }`
            }
            onClick={() => {
              console.log(`Mobile nav: Navigating to ${link.path}`);
              if (link.path === '/menu') {
                setIsSidebarOpen(true);
              }
            }}
          >
            {link.icon}
            <span>{link.label}</span>
            {link.label === 'Alerts' && unreadAlerts > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadAlerts}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              className="w-3/4 bg-white h-full p-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-2"
                >
                  <User className="h-6 w-6" />
                </motion.button>
              </div>
              <div className="space-y-4">
                {sidebarLinks.map(link => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 rounded-lg ${
                        isActive ? 'bg-primary text-white' : 'text-gray-600'
                      }`
                    }
                    onClick={() => {
                      console.log(`Sidebar: Navigating to ${link.path}`);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Profile Drawer */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsProfileOpen(false)}
          >
            <motion.div
              className="w-3/4 ml-auto bg-white h-full p-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-4">
                <button
                  onClick={() => handleProfileAction('View Profile')}
                  className="block w-full text-left p-2 hover:bg-gray-100"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleProfileAction('Edit Info')}
                  className="block w-full text-left p-2 hover:bg-gray-100"
                >
                  Edit Info
                </button>
                <button
                  onClick={() => handleProfileAction('Logout')}
                  className="block w-full text-left p-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pb-16 md:pb-0">{children}</main>
    </div>
  );
};

export default Layout;