import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', region: '' });
  const [errors, setErrors] = useState({ name: '', phone: '', password: '', region: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = { name: '', phone: '', password: '', region: '' };
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.match(/^\+91 \d{10}$/)) newErrors.phone = 'Phone must be +91 followed by 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      login('F123'); // Mock farmerId
      alert(`Signed up: ${formData.name}, ${formData.phone}, ${formData.region}`);
      navigate('/profile', { replace: true });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center p-4 bg-agri-background"
    >
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-semibold text-text-primary text-center">Sign Up</h1>
        <div className="glassmorphic p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary">Name</label>
              <div className="flex items-center space-x-2 p-2 rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary-light">
                <User className="h-5 w-5 text-gray-600" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full outline-none bg-transparent"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary">Phone</label>
              <div className="flex items-center space-x-2 p-2 rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary-light">
                <Phone className="h-5 w-5 text-gray-600" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full outline-none bg-transparent"
                  placeholder="+91 9876543210"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary">Password</label>
              <div className="flex items-center space-x-2 p-2 rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary-light">
                <Lock className="h-5 w-5 text-gray-600" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full outline-none bg-transparent"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary">Region</label>
              <div className="flex items-center space-x-2 p-2 rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary-light">
                <input
                  type="text"
                  value={formData.region}
                  onChange={e => setFormData({ ...formData, region: e.target.value })}
                  className="w-full outline-none bg-transparent"
                />
              </div>
              {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full p-2 bg-primary text-white rounded-lg"
            >
              Sign Up
            </motion.button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account? <Link to="/signin" className="text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SignUp;