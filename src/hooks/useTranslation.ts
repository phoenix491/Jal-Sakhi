import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (!value || !value[k]) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      value = value[k];
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }
    
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      }, value);
    }
    
    return value;
  };
  
  return { t };
};