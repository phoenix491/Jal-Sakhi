import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Video, RefreshCw } from 'lucide-react';

interface FormData {
  level: string;
  tds: string;
  temperature: string;
  pH: string;
  date: string;
}

const animationStates = [
  { text: 'Connecting', color: 'text-gray-500' },
  { text: 'Connected', color: 'text-blue-500' },
  { text: 'Adding', color: 'text-yellow-500' },
  { text: 'Added', color: 'text-green-500' },
  { text: 'Updated', color: 'text-green-700' }
];

const ManualDataEntry: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    level: '',
    tds: '',
    temperature: '',
    pH: '',
    date: new Date().toISOString().split('T')[0] // Default to today
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isFetching, setIsFetching] = useState(false);
  const [animationStep, setAnimationStep] = useState(-1);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const level = parseFloat(formData.level);
    const tds = parseInt(formData.tds);
    const temperature = parseFloat(formData.temperature);
    const pH = parseFloat(formData.pH);

    if (!formData.level || isNaN(level) || level < 0 || level > 100) {
      newErrors.level = 'Level must be a number between 0 and 100 meters';
    }
    if (!formData.tds || isNaN(tds) || tds < 0 || tds > 5000) {
      newErrors.tds = 'TDS must be a number between 0 and 5000 ppm';
    }
    if (!formData.temperature || isNaN(temperature) || temperature < 0 || temperature > 50) {
      newErrors.temperature = 'Temperature must be a number between 0 and 50°C';
    }
    if (!formData.pH || isNaN(pH) || pH < 0 || pH > 14) {
      newErrors.pH = 'pH must be a number between 0 and 14';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      farmerId: 'F123', // Hardcoded
      wellId: 'WB124', // Hardcoded
      level: parseFloat(formData.level),
      tds: parseInt(formData.tds),
      temperature: parseFloat(formData.temperature),
      pH: parseFloat(formData.pH),
      date: formData.date,
      timestamp: new Date().toISOString()
    };

    try {
      // Mock POST request
      console.log('POST /api/manual-entry', payload);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({
        level: '',
        tds: '',
        temperature: '',
        pH: '',
        date: new Date().toISOString().split('T')[0]
      });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleAutoFetch = async () => {
    setIsFetching(true);
    setAnimationStep(0);

    // Simulate sensor data fetch with animation
    for (let i = 0; i < animationStates.length; i++) {
      setAnimationStep(i);
      await new Promise(resolve => setTimeout(resolve, 600)); // 600ms per step
    }

    // Generate random realistic values
    const newData: FormData = {
      level: (Math.random() * 100).toFixed(1), // 0–100 meters
      tds: Math.floor(Math.random() * 5000).toString(), // 0–5000 ppm
      temperature: (Math.random() * 50).toFixed(1), // 0–50°C
      pH: (Math.random() * 14).toFixed(1), // 0–14
      date: new Date().toISOString().split('T')[0] // Today
    };

    setFormData(newData);
    setErrors({});
    setIsFetching(false);
    setAnimationStep(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto p-4 space-y-6 relative"
    >
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Manual Data Entry</h1>
        <p className="text-sm text-gray-600">Enter your well’s sensor data or fetch automatically.</p>
      </div>

      {/* Animation Overlay */}
      <AnimatePresence>
        {isFetching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              className="glassmorphic p-6 rounded-lg flex items-center space-x-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <p className={`text-lg font-medium ${animationStates[animationStep].color}`}>
                {animationStates[animationStep].text}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="glassmorphic p-6 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary">Level (meters)</label>
          <input
            type="number"
            name="level"
            value={formData.level}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-light"
            placeholder="e.g., 5.2"
          />
          {errors.level && <p className="text-xs text-red-500 mt-1">{errors.level}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary">TDS (ppm)</label>
          <input
            type="number"
            name="tds"
            value={formData.tds}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-light"
            placeholder="e.g., 800"
          />
          {errors.tds && <p className="text-xs text-red-500 mt-1">{errors.tds}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary">Temperature (°C)</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-light"
            placeholder="e.g., 26.5"
          />
          {errors.temperature && <p className="text-xs text-red-500 mt-1">{errors.temperature}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary">pH</label>
          <input
            type="number"
            name="pH"
            value={formData.pH}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-light"
            placeholder="e.g., 7.2"
          />
          {errors.pH && <p className="text-xs text-red-500 mt-1">{errors.pH}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-border focus:ring-2 focus:ring-primary-light"
          />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
        </div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex-1 p-2 bg-primary text-white rounded-lg flex items-center justify-center space-x-2"
          >
            <Send className="h-5 w-5" />
            <span>Submit Data</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleAutoFetch}
            disabled={isFetching}
            className="flex-1 p-2 bg-green-500 text-white rounded-lg flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Auto-Fetch</span>
          </motion.button>
        </div>

        {submitStatus === 'success' && (
          <p className="text-sm text-green-500 text-center">Data submitted successfully!</p>
        )}
        {submitStatus === 'error' && (
          <p className="text-sm text-red-500 text-center">Error submitting data. Please try again.</p>
        )}
      </form>

      <div className="text-center">
        <a
          href="https://example.com/manual-entry-video"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center justify-center space-x-1"
        >
          <Video className="h-4 w-4" />
          <span>Don’t know how? Watch this video.</span>
        </a>
      </div>
    </motion.div>
  );
};

export default ManualDataEntry;