import React from 'react';
import { Home, Bell, MessageCircle, Award } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSensorData } from '../contexts/SensorDataContext';
import { motion } from 'framer-motion';

const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();
  const { alerts } = useSensorData();
  const unreadAlerts = alerts.filter(alert => !alert.resolved).length;

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/alerts', icon: Bell, label: t('nav.alerts'), badge: unreadAlerts },
    { path: '/jalmitra', icon: MessageCircle, label: t('nav.jalmitra') },
    { path: '/rewards', icon: Award, label: t('nav.rewards') }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary-dark/90 backdrop-blur-md text-white h-16 flex justify-around items-center z-50">
      {navItems.map(({ path, icon: Icon, label, badge }) => (
        <a
          key={path}
          href={path}
          className="flex flex-col items-center justify-center space-y-1 w-1/4 relative"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Icon className="h-7 w-7" />
          </motion.div>
          <motion.span
            whileHover={{ scale: 1.05, color: 'var(--primary-light)' }}
            className="text-xs"
          >
            {label}
          </motion.span>
          {badge && badge > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-1/3 bg-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {badge}
            </motion.span>
          )}
        </a>
      ))}
    </div>
  );
};

export default BottomNavigation;