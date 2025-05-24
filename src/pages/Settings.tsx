import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useFarmer, FarmerData } from '../contexts/FarmerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { farmer, setFarmer } = useFarmer();
  const { setLanguage } = useLanguage();
  const [formData, setFormData] = useState<Pick<FarmerData, 'language' | 'units'>>({
    language: farmer.language,
    units: farmer.units
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFarmer({ ...farmer, ...formData });
    setLanguage(formData.language);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-semibold text-text-primary">{t('settings.title')}</h1>
      <form onSubmit={handleSubmit} className="glassmorphic p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary">{t('settings.language')}</label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value as 'en' | 'hi' | 'bn' })}
            className="mt-1 w-full p-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-light"
          >
            <option value="en">{t('settings.languages.en')}</option>
            <option value="hi">{t('settings.languages.hi')}</option>
            <option value="bn">{t('settings.languages.bn')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary">{t('settings.units')}</label>
          <select
            value={formData.units}
            onChange={(e) => setFormData({ ...formData, units: e.target.value as 'feet' | 'meters' })}
            className="mt-1 w-full p-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-light"
          >
            <option value="feet">{t('settings.units.feet')}</option>
            <option value="meters">{t('settings.units.meters')}</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-primary text-white rounded-lg hover-scale flex items-center justify-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>{t('settings.save')}</span>
        </button>
      </form>
    </motion.div>
  );
};

export default Settings;