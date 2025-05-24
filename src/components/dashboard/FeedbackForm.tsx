import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Send } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const FeedbackForm: React.FC = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const maxChars = 200;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert(t('feedback.ratingRequired'));
      return;
    }
    alert(t('feedback.submitted'));
    setRating(0);
    setFeedback('');
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-[#0079C2]" />
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('feedback.title')}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-2">{t('feedback.rating')}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="focus:outline-none"
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`h-6 w-6 ${star <= rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-gray-300'}`}
                />
              </motion.button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-2">{t('feedback.comments')}</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value.slice(0, maxChars))}
            placeholder={t('feedback.placeholder')}
            className="w-full p-3 border border-[#0079C2] rounded-lg resize-none focus:ring-2 focus:ring-[#0079C2]"
            rows={4}
          />
          <div className="text-xs text-gray-600 mt-1 text-right">
            {feedback.length}/{maxChars}
          </div>
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-[#0079C2] hover:bg-[#005a8e] text-white rounded-lg flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#0079C2]"
        >
          <Send className="h-5 w-5" />
          {t('feedback.submit')}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;