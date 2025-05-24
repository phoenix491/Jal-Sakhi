import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, SendIcon, Mic } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const JalMitraAI: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setRecentQueries(prev => [query, ...prev.slice(0, 4)]);
      alert(`JalMitra responds: Try Bajra for low water conditions.`);
      setQuery('');
    }
  };

  const startListening = () => {
    setIsListening(true);
    setTimeout(() => {
      const newQuery = 'What crop requires less water?';
      setQuery(newQuery);
      setRecentQueries(prev => [newQuery, ...prev.slice(0, 4)]);
      setIsListening(false);
    }, 2000);
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-[#0079C2]" />
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('jalmitra.title')}</h2>
      </div>
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <select
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-[#0079C2] rounded-lg text-sm focus:ring-2 focus:ring-[#0079C2]"
          aria-label="Recent queries"
        >
          <option value="">{t('jalmitra.recentQueries')}</option>
          {recentQueries.map((q, index) => (
            <option key={index} value={q}>{q}</option>
          ))}
        </select>
      </motion.div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('jalmitra.placeholder')}
            className="w-full p-3 pr-12 border border-[#0079C2] rounded-full focus:ring-2 focus:ring-[#0079C2]"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#0079C2] hover:text-[#005a8e]"
            aria-label="Send message"
          >
            <SendIcon className="h-5 w-5" />
          </motion.button>
        </div>
        <motion.button
          type="button"
          onClick={startListening}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-full ${isListening ? 'bg-[#EF4444] text-white animate-pulse' : 'bg-[#F6FAF9] text-[#0079C2] hover:bg-gray-100'} focus:ring-2 focus:ring-[#0079C2]`}
          aria-label={isListening ? 'Listening...' : 'Start voice input'}
        >
          <Mic className="h-5 w-5" />
        </motion.button>
      </form>
      <div className="mt-3 text-sm text-gray-600">
        {isListening ? t('jalmitra.listening') : t('jalmitra.hint')}
      </div>
    </motion.div>
  );
};

export default JalMitraAI;