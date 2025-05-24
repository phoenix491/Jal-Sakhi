import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { useSensorData } from '../../contexts/SensorDataContext';
import { useTranslation } from '../../hooks/useTranslation';

const WellMapView: React.FC = () => {
  const { sensorData } = useSensorData();
  const { t } = useTranslation();
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const navigateToWell = () => {
    const { lat, lng } = sensorData.location;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 15));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 8));

  const getStatusColor = () => {
    if (sensorData.levelStatus === 'Safe') return '#10B981';
    if (sensorData.levelStatus === 'Moderate') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#0079C2]" />
          <h2 className="text-2xl font-semibold text-[#0079C2]">{t('wellMap.title')}</h2>
        </div>
        <motion.button
          onClick={navigateToWell}
          whileHover={{ scale: 1.05 }}
          className="text-[#0079C2] hover:text-[#005a8e] text-sm flex items-center focus:ring-2 focus:ring-[#0079C2]"
        >
          <Navigation className="h-4 w-4 mr-1" />
          {t('wellMap.navigate')}
        </motion.button>
      </div>
      {isMapLoaded ? (
        <div className="bg-[#F6FAF9] rounded-lg overflow-hidden h-56 md:h-72 relative group" role="img" aria-describedby="map-tooltip">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${sensorData.location.lng},${sensorData.location.lat},${zoom},0/600x300?access_token=placeholder')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <motion.button
              onClick={handleZoomIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-[#0079C2] text-white rounded-full focus:ring-2 focus:ring-[#0079C2]"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={handleZoomOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-[#0079C2] text-white rounded-full focus:ring-2 focus:ring-[#0079C2]"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </motion.button>
          </div>
          <motion.div
            className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-xs font-medium" style={{ color: getStatusColor() }}>
              {t(`waterStatus.${sensorData.levelStatus.toLowerCase()}`)}
            </span>
          </motion.div>
          <div
            className="absolute top-50% left-50% transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => window.location.href = '/wells'}
          >
            <div className="bg-white p-2 rounded-lg shadow-md border border-[#0079C2] text-center">
              <div className="text-sm font-semibold text-slate-800">{sensorData.wellId}</div>
              <div className="text-xs text-gray-600">{sensorData.level}%</div>
            </div>
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white mx-auto -mt-1" />
          </div>
          <div
            id="map-tooltip"
            className="absolute top-0 right-0 bg-white border border-gray-100 p-2 rounded-lg shadow-md text-xs text-gray-600 hidden group-hover:block z-10"
          >
            {t('wellMap.tooltip', { status: t(`waterStatus.${sensorData.levelStatus.toLowerCase()}`) })}
          </div>
        </div>
      ) : (
        <div className="bg-[#F6FAF9] rounded-lg h-56 md:h-72 flex items-center justify-center text-gray-600">
          {t('wellMap.failed')}
        </div>
      )}
    </motion.div>
  );
};

export default WellMapView;