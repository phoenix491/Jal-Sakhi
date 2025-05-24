import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplet, CheckCircle, X } from 'lucide-react';
import { useSensorData } from '../../contexts/SensorDataContext';
import { useTranslation } from '../../hooks/useTranslation';

interface IrrigationSchedule {
  id: string;
  crop: string;
  field: string;
  time: string;
  auto: boolean;
}

interface IrrigationSchedulerProps {
  onScheduleConfirm: () => void;
}

const IrrigationScheduler: React.FC<IrrigationSchedulerProps> = ({ onScheduleConfirm }) => {
  const { sensorData } = useSensorData();
  const { t } = useTranslation();
  const [crop, setCrop] = useState<string>('Bajra');
  const [field, setField] = useState<string>('F1');
  const [time, setTime] = useState<string>('');
  const [autoSchedule, setAutoSchedule] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>([]);
  const crops = ['Bajra', 'Jowar'];
  const fields = ['F1', 'F2'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !field || (!autoSchedule && !time)) {
      alert(t('irrigation.incomplete'));
      return;
    }
    const newSchedule: IrrigationSchedule = {
      id: `s${schedules.length + 1}`,
      crop,
      field,
      time: autoSchedule ? 'Auto (Based on Moisture)' : time,
      auto: autoSchedule,
    };
    setSchedules(prev => [newSchedule, ...prev]);
    onScheduleConfirm();
    setCrop('Bajra');
    setField('F1');
    setTime('');
    setAutoSchedule(false);
  };

  const handleRemove = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const getMoistureTooltip = () => {
    const level = sensorData.soilMoisture || 50;
    return level > 60 ? t('irrigation.moistureHigh') : level < 40 ? t('irrigation.moistureLow') : t('irrigation.moistureOptimal');
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-[#0079C2]" />
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('irrigation.title')}</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">{t('irrigation.crop')}</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full p-3 border border-[#0079C2] rounded-lg text-sm focus:ring-2 focus:ring-[#0079C2]"
            aria-label="Select crop"
          >
            {crops.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">{t('irrigation.field')}</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="w-full p-3 border border-[#0079C2] rounded-lg text-sm focus:ring-2 focus:ring-[#0079C2]"
            aria-label="Select field"
          >
            {fields.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="group relative">
          <label className="text-sm text-gray-600 block mb-1">{t('irrigation.moisture')}</label>
          <div className="text-sm text-slate-800 flex items-center gap-1">
            <Droplet className="h-4 w-4 text-[#0079C2]" />
            {sensorData.soilMoisture || 50}%
          </div>
          <div
            id="moisture-tooltip"
            className="absolute top-0 right-0 bg-white border border-gray-100 p-2 rounded-lg shadow-md text-xs text-gray-600 hidden group-hover:block z-10"
          >
            {getMoistureTooltip()}
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">{t('irrigation.time')}</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={autoSchedule}
            className="w-full p-3 border border-[#0079C2] rounded-lg text-sm focus:ring-2 focus:ring-[#0079C2] disabled:bg-gray-100"
            aria-label="Irrigation time"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoSchedule}
            onChange={() => setAutoSchedule(!autoSchedule)}
            className="sr-only"
            id="auto-schedule"
          />
          <label
            htmlFor="auto-schedule"
            className={`relative inline-flex items-center h-5 w-10 rounded-full cursor-pointer transition-colors duration-200 ${
              autoSchedule ? 'bg-[#0079C2]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full transition-transform duration-200 ${
                autoSchedule ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </label>
          <span className="text-sm text-gray-600">{t('irrigation.auto')}</span>
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-[#0079C2] hover:bg-[#005a8e] text-white rounded-lg flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#0079C2]"
        >
          <CheckCircle className="h-5 w-5" />
          {t('irrigation.schedule')}
        </motion.button>
      </form>
      <div className="mt-4 space-y-3">
        {schedules.map((schedule) => (
          <motion.div
            key={schedule.id}
            className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div>
              <div className="text-sm font-medium text-slate-800">
                {schedule.crop} - {schedule.field}
              </div>
              <div className="text-xs text-gray-600">{schedule.time}</div>
              {schedule.auto && (
                <span className="inline-block mt-1 bg-[#D1FAE5] text-[#10B981] text-xs px-2 py-1 rounded-full">
                  {t('irrigation.auto')}
                </span>
              )}
            </div>
            <motion.button
              onClick={() => handleRemove(schedule.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-[#EF4444] text-white rounded-full focus:ring-2 focus:ring-[#EF4444]"
              aria-label="Remove schedule"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default IrrigationScheduler;