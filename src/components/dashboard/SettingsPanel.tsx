import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Phone, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFarmer } from '../../contexts/FarmerContext';
import { useTranslation } from '../../hooks/useTranslation';

const SettingsPanel: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { farmer, setFarmer } = useFarmer();
  const { t } = useTranslation();
  const [tempLanguage, setTempLanguage] = useState(language);
  const [tempUnits, setTempUnits] = useState(farmer.units);

  const handleSave = () => {
    setLanguage(tempLanguage);
    setFarmer({ ...farmer, language: tempLanguage, units: tempUnits });
    alert(t('settings.saved'));
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-[#0079C2]" />
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('settings.title')}</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">{t('settings.language')}</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tempLanguage === 'en'}
              onChange={() => setTempLanguage(tempLanguage === 'en' ? 'hi' : 'en')}
              className="sr-only"
              id="language-toggle"
            />
            <label
              htmlFor="language-toggle"
              className={`relative inline-flex items-center h-5 w-10 rounded-full cursor-pointer transition-colors duration-200 ${
                tempLanguage === 'en' ? 'bg-[#0079C2]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full transition-transform duration-200 ${
                  tempLanguage === 'en' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </label>
            <span className="text-sm text-gray-600">{tempLanguage === 'en' ? 'English' : 'हिंदी'}</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">{t('settings.units')}</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tempUnits === 'meters'}
              onChange={() => setTempUnits(tempUnits === 'meters' ? 'feet' : 'meters')}
              className="sr-only"
              id="units-toggle"
            />
            <label
              htmlFor="units-toggle"
              className={`relative inline-flex items-center h-5 w-10 rounded-full cursor-pointer transition-colors duration-200 ${
                tempUnits === 'meters' ? 'bg-[#0079C2]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full transition-transform duration-200 ${
                  tempUnits === 'meters' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </label>
            <span className="text-sm text-gray-600">{tempUnits === 'meters' ? 'Meters' : 'Feet'}</span>
          </div>
        </div>
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-[#0079C2] hover:bg-[#005a8e] text-white rounded-lg flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#0079C2]"
        >
          <Save className="h-5 w-5" />
          {t('settings.save')}
        </motion.button>
        <div className="pt-3">
          <motion.a
            href="/helpline"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-[#0079C2] hover:text-[#005a8e]"
          >
            <Phone className="h-4 w-4" />
            <span>{t('settings.contact')}</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPanel;