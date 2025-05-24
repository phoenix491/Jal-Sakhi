import React from 'react';
import { Bell, CheckCircle, ChevronRight } from 'lucide-react';
import { useSensorData } from '../../contexts/SensorDataContext';
import { useTranslation } from '../../hooks/useTranslation';

const AlertsHub: React.FC = () => {
  const { alerts, resolveAlert } = useSensorData();
  const { t } = useTranslation();
  
  const handleResolve = (alertId: string) => {
    resolveAlert(alertId);
  };
  
  return (
    <div className="glassmorphic p-4 fade-in h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-danger" />
          <h2 className="text-lg font-semibold">{t('alerts.title')}</h2>
        </div>
        
        <a href="/alerts" className="text-primary hover:text-primary-dark text-sm flex items-center">
          {t('alerts.viewAll')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-white border border-slate-100 rounded-lg p-3 fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{alert.type}</div>
                  <div className="text-sm text-slate-600">{alert.message}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="px-3 py-1 bg-primary-light hover:bg-primary text-white text-sm rounded hover-scale flex items-center"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {t('alerts.resolve')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-6 text-slate-500">
            No new alerts. All systems are running smoothly.
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsHub;