import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit, X, Star, Bell, Globe, Ruler, Mic, Trash, Phone, FileText, MessageSquare, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface ProfileData {
  avatar: string | null;
  name: string;
  phone: string;
  language: string;
  village: string;
  wellId: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
  completion: number;
  waterSaved: number;
  coins: number;
}

interface SettingsData {
  units: { length: 'Meters' | 'Feet'; volume: 'Litres' | 'Kilolitres' };
  alerts: { sms: boolean; push: boolean; voice: boolean; time: string };
  language: string;
  voiceMode: boolean;
  fontSize: 'Small' | 'Medium' | 'Large';
  jalMitra: {
    voiceInput: boolean;
    audioReadout: boolean;
    localHints: string;
    friendliness: number;
    saveHistory: boolean;
    cropPlanPro: boolean;
  };
  rewards: {
    litresSaved: number;
    coins: number;
    rewardsClaimed: string[];
    goalProgress: number;
  };
}

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: null,
    name: 'Ranindram Patel',
    phone: '+91 4444444444',
    language: 'Hindi',
    village: 'Sitamarhi',
    wellId: 'WB124',
    tier: 'Silver',
    completion: 75,
    waterSaved: 8000,
    coins: 150
  });
  const [settings, setSettings] = useState<SettingsData>({
    units: { length: 'Meters', volume: 'Litres' },
    alerts: { sms: true, push: true, voice: false, time: '6AM–9AM' },
    language: 'Hindi',
    voiceMode: true,
    fontSize: 'Medium',
    jalMitra: {
      voiceInput: true,
      audioReadout: false,
      localHints: 'Hindi',
      friendliness: 70,
      saveHistory: true,
      cropPlanPro: false
    },
    rewards: {
      litresSaved: 8000,
      coins: 150,
      rewardsClaimed: ['₹30 Recharge', 'Fertilizer Coupon'],
      goalProgress: 60
    }
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProfileData>>(profileData);
  const [imageError, setImageError] = useState('');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...profileData, ...editForm });
    setSettings({ ...settings, language: editForm.language || settings.language });
    setIsEditModalOpen(false);
    alert('Profile updated successfully!');
  };

  const handleToggle = (section: keyof SettingsData, key: string, value: boolean | string | number) => {
    if (section === 'alerts' && key === 'time') {
      setSettings({ ...settings, alerts: { ...settings.alerts, time: value as string } });
    } else if (section === 'units') {
      setSettings({ ...settings, units: { ...settings.units, [key]: value as 'Meters' | 'Feet' | 'Litres' | 'Kilolitres' } });
    } else if (section === 'jalMitra') {
      setSettings({ ...settings, jalMitra: { ...settings.jalMitra, [key]: value as boolean | string | number } });
    } else {
      setSettings({ ...settings, [section]: value });
      if (section === 'language') {
        setProfileData({ ...profileData, language: value as string });
      }
    }
    alert('Settings updated!');
  };

  const handleClaimReward = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setSettings({
      ...settings,
      rewards: { ...settings.rewards, rewardsClaimed: [...settings.rewards.rewardsClaimed, '₹50 Voucher'] }
    });
    alert('Reward claimed!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      logout();
      alert('Account deleted successfully.');
      navigate('/signin', { replace: true });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isModal: boolean) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isModal) {
          setEditForm({ ...editForm, avatar: reader.result as string });
        } else {
          setProfileData({ ...profileData, avatar: reader.result as string });
        }
        setImageError('');
      };
      reader.readAsDataURL(file);
    } else {
      setImageError('Please upload a valid image file');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#F6FAF9] text-slate-800 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-semibold text-[#0079C2]">Profile & Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Tile */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow flex flex-col items-center"
            role="region"
            aria-labelledby="profile-heading"
          >
            <h2 id="profile-heading" className="text-2xl font-medium text-[#0079C2] mb-6 flex items-center">
              <User className="h-6 w-6 mr-2" />
              Profile
            </h2>
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Profile picture"
                    className="h-24 w-24 rounded-full mx-auto object-cover border-2 border-[#0079C2]"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full mx-auto bg-[#0079C2] flex items-center justify-center text-white text-2xl font-medium">
                    {getInitials(profileData.name)}
                  </div>
                )}
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 bg-[#0079C2] text-white p-2 rounded-full cursor-pointer hover:bg-[#005a8e]"
                  aria-label="Edit profile picture"
                >
                  <Upload className="h-4 w-4" />
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, false)}
                  />
                </label>
              </div>
              {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
              <div className="relative w-24 h-24 mx-auto">
                <svg className="absolute inset-0" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0079C2"
                    strokeWidth="3"
                    strokeDasharray={`${profileData.completion}, 100`}
                  />
                </svg>
                <div className="flex items-center justify-center h-full text-sm text-[#0079C2]">
                  {profileData.completion}% Complete
                </div>
              </div>
              <p className="text-lg font-semibold text-slate-800">{profileData.name}</p>
              <p className="text-sm text-gray-600">{profileData.village}</p>
              <p className="text-sm">
                <span className="font-medium">Water Saved:</span> {profileData.waterSaved}L |{' '}
                <span className="font-medium">Coins:</span> {profileData.coins}
              </p>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-600">Phone:</span> {profileData.phone}</p>
                <p><span className="font-medium text-gray-600">Language:</span> {profileData.language}</p>
                <p><span className="font-medium text-gray-600">Well ID:</span> {profileData.wellId}</p>
                <p>
                  <span className="font-medium text-gray-600">Tier:</span>{' '}
                  <span className="bg-[#0079C2] text-white text-xs px-2 py-1 rounded">{profileData.tier}</span>
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditModalOpen(true)}
                className="w-full max-w-xs px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm hover:bg-[#005a8e]"
                aria-label="Edit profile"
              >
                Edit Profile
              </motion.button>
            </div>
          </motion.section>

          {/* Settings Tile */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow"
            role="region"
            aria-labelledby="settings-heading"
          >
            <h2 id="settings-heading" className="text-2xl font-medium text-[#0079C2] mb-6 flex items-center">
              <Globe className="h-6 w-6 mr-2" />
              Settings
            </h2>
            <div className="space-y-6">
              {/* Preferences */}
              <div>
                <h3 className="text-lg font-medium text-[#0079C2] flex items-center">
                  <Ruler className="h-5 w-5 mr-2" />
                  Preferences
                </h3>
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Units</h4>
                    <div className="flex justify-between mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="length"
                          checked={settings.units.length === 'Meters'}
                          onChange={() => handleToggle('units', 'length', 'Meters')}
                          className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                          aria-label="Use meters"
                        />
                        Meters
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="length"
                          checked={settings.units.length === 'Feet'}
                          onChange={() => handleToggle('units', 'length', 'Feet')}
                          className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                          aria-label="Use feet"
                        />
                        Feet
                      </label>
                    </div>
                    <div className="flex justify-between mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="volume"
                          checked={settings.units.volume === 'Litres'}
                          onChange={() => handleToggle('units', 'volume', 'Litres')}
                          className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                          aria-label="Use litres"
                        />
                        Litres
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="volume"
                          checked={settings.units.volume === 'Kilolitres'}
                          onChange={() => handleToggle('units', 'volume', 'Kilolitres')}
                          className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                          aria-label="Use kilolitres"
                        />
                        Kilolitres
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Alerts</h4>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.alerts.sms}
                          onChange={(e) => handleToggle('alerts', 'sms', e.target.checked)}
                          className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                          aria-label="Enable SMS alerts"
                        />
                        SMS
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.alerts.push}
                          onChange={(e) => handleToggle('alerts', 'push', e.target.checked)}
                          className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                          aria-label="Enable push alerts"
                        />
                        Push
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.alerts.voice}
                          onChange={(e) => handleToggle('alerts', 'voice', e.target.checked)}
                          className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                          aria-label="Enable voice alerts"
                        />
                        Voice
                      </label>
                      <select
                        value={settings.alerts.time}
                        onChange={(e) => handleToggle('alerts', 'time', e.target.value)}
                        className="w-full p-3 rounded-full border border-[#0079C2] focus:ring-2 focus:ring-[#0079C2] text-sm"
                        aria-label="Select alert time"
                      >
                        <option value="6AM–9AM">6AM–9AM</option>
                        <option value="6PM–9PM">6PM–9PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">App Language</h4>
                    <select
                      value={settings.language}
                      onChange={(e) => handleToggle('language', 'language', e.target.value)}
                      className="w-full p-3 rounded-full border border-[#0079C2] focus:ring-2 focus:ring-[#0079C2] text-sm mt-2"
                      aria-label="Select app language"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">हिंदी</option>
                      <option value="Bengali">বাংলা</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Voice UI Mode</h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.voiceMode}
                        onChange={(e) => handleToggle('voiceMode', 'voiceMode', e.target.checked)}
                        className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                        aria-label="Enable voice UI mode"
                      />
                      Voice Enabled
                    </label>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Font Size</h4>
                    <div className="flex gap-2 mt-2">
                      {['Small', 'Medium', 'Large'].map((size) => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggle('fontSize', 'fontSize', size)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            settings.fontSize === size
                              ? 'bg-[#0079C2] text-white'
                              : 'bg-gray-200 text-slate-800'
                          }`}
                          aria-label={`Set font size to ${size}`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* JalMitra AI */}
              <div>
                <h3 className="text-lg font-medium text-[#0079C2] flex items-center">
                  <Mic className="h-5 w-5 mr-2" />
                  JalMitra AI
                </h3>
                <div className="space-y-4 mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.jalMitra.voiceInput}
                      onChange={(e) => handleToggle('jalMitra', 'voiceInput', e.target.checked)}
                      className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                      aria-label="Enable voice input for JalMitra AI"
                    />
                    Voice Input
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.jalMitra.audioReadout}
                      onChange={(e) => handleToggle('jalMitra', 'audioReadout', e.target.checked)}
                      className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                      aria-label="Enable audio readout for JalMitra AI"
                    />
                    Audio Readout
                  </label>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Local Language Hints</h4>
                    <select
                      value={settings.jalMitra.localHints}
                      onChange={(e) => handleToggle('jalMitra', 'localHints', e.target.value)}
                      className="w-full p-3 rounded-full border border-[#0079C2] focus:ring-2 focus:ring-[#0079C2] text-sm mt-2"
                      aria-label="Select local language hints"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Bengali">Bengali</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">AI Friendliness</h4>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.jalMitra.friendliness}
                      onChange={(e) => handleToggle('jalMitra', 'friendliness', Number(e.target.value))}
                      className="w-full accent-[#0079C2]"
                      aria-label="Adjust AI friendliness"
                    />
                    <p className="text-sm text-gray-600">
                      {settings.jalMitra.friendliness < 33 ? 'Formal' : settings.jalMitra.friendliness < 66 ? 'Neutral' : 'Casual'}
                    </p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.jalMitra.saveHistory}
                      onChange={(e) => handleToggle('jalMitra', 'saveHistory', e.target.checked)}
                      className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                      aria-label="Save JalMitra AI chat history"
                    />
                    Save Chat History
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.jalMitra.cropPlanPro}
                      onChange={(e) => handleToggle('jalMitra', 'cropPlanPro', e.target.checked)}
                      className="h-5 w-5 text-[#0079C2] border-[#0079C2] focus:ring-[#0079C2] mr-2"
                      aria-label="Enable Crop Plan Pro mode"
                    />
                    Crop Plan Pro Mode
                  </label>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => alert('AI memory reset!')}
                      className="px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm hover:bg-[#005a8e]"
                      aria-label="Reset AI memory"
                    >
                      Reset AI Memory
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => alert('Upload soil report')}
                      className="px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm hover:bg-[#005a8e]"
                      aria-label="Upload soil report"
                    >
                      Upload Soil Report
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div>
                <h3 className="text-lg font-medium text-[#0079C2] flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Rewards
                </h3>
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Litres Saved</h4>
                    <p className="text-2xl font-semibold text-[#0079C2]">{settings.rewards.litresSaved}L</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Coins Earned</h4>
                    <p className="text-lg flex items-center">
                      <Star className="h-5 w-5 text-[#0079C2] mr-2" />
                      {settings.rewards.coins}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Rewards Claimed</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {settings.rewards.rewardsClaimed.map((reward, idx) => (
                        <li key={idx}>{reward}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Reward Goal</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-[#0079C2] h-2.5 rounded-full"
                        style={{ width: `${settings.rewards.goalProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Save 2000L to earn ₹30 this month</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClaimReward}
                      className="px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm hover:bg-[#005a8e]"
                      aria-label="Claim reward"
                    >
                      Claim Reward
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => alert('Gift reward to another farmer')}
                      className="px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm hover:bg-[#005a8e]"
                      aria-label="Gift reward"
                    >
                      Gift Reward
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => alert('Show QR code for offline redemption')}
                      className="px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm hover:bg-[#005a8e]"
                      aria-label="Redeem offline"
                    >
                      Redeem Offline
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Account & Support */}
              <div>
                <h3 className="text-lg font-medium text-[#0079C2] flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Account & Support
                </h3>
                <div className="space-y-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert('OTP verification required for phone change.')}
                    className="w-full text-left p-3 text-[#0079C2] hover:bg-gray-100 rounded-full text-sm"
                    aria-label="Change phone number"
                  >
                    <Phone className="h-5 w-5 inline mr-2" />
                    Change Phone Number
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert('Change password modal')}
                    className="w-full text-left p-3 text-[#0079C2] hover:bg-gray-100 rounded-full text-sm"
                    aria-label="Change password"
                  >
                    <FileText className="h-5 w-5 inline mr-2" />
                    Change Password
                  </motion.button>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Contact Helpline</h4>
                    <div className="flex flex-col gap-2 mt-2">
                      <a
                        href="tel:+919876543210"
                        className="p-3 text-[#0079C2] hover:bg-gray-100 rounded-full text-sm"
                        aria-label="Call support"
                      >
                        <Phone className="h-5 w-5 inline mr-2" />
                        Call Support
                      </a>
                      <a
                        href="https://wa.me/+919876543210"
                        className="p-3 text-[#0079C2] hover:bg-gray-100 rounded-full text-sm"
                        aria-label="WhatsApp support"
                      >
                        <Phone className="h-5 w-5 inline mr-2" />
                        WhatsApp
                      </a>
                      <a
                        href="sms:+919876543210"
                        className="p-3 text-[#0079C2] hover:bg-gray-100 rounded-full text-sm"
                        aria-label="SMS support"
                      >
                        <MessageSquare className="h-5 w-5 inline mr-2" />
                        SMS
                      </a>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Feedback</h4>
                    <textarea
                      placeholder="Share your feedback or feature requests"
                      className="w-full p-3 border border-[#0079C2] rounded-lg mt-2 text-sm focus:ring-2 focus:ring-[#0079C2]"
                      rows={4}
                      aria-label="Feedback input"
                    />
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-[#0079C2] fill-current" aria-label="Rating star" />
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => alert('Feedback submitted!')}
                      className="mt-2 px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm hover:bg-[#005a8e]"
                      aria-label="Submit feedback"
                    >
                      Submit Feedback
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteAccount}
                    className="w-full text-left p-3 text-red-600 hover:bg-gray-100 rounded-full text-sm"
                    aria-label="Delete account"
                  >
                    <Trash className="h-5 w-5 inline mr-2" />
                    Delete Account
                  </motion.button>
                  <a
                    href="/privacy-policy"
                    className="block p-3 text-[#0079C2] hover:bg-gray-100 rounded-full text-sm"
                    aria-label="View privacy policy"
                  >
                    <FileText className="h-5 w-5 inline mr-2" />
                    Privacy Policy / Terms
                  </a>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Sticky Save Button (Mobile) */}
        <motion.div
          className="md:hidden fixed bottom-4 left-0 right-0 px-4"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setProfileData({ ...profileData, ...editForm });
              alert('Changes saved successfully!');
            }}
            className="w-full p-3 bg-[#0079C2] text-white rounded-full shadow-lg text-sm hover:bg-[#005a8e]"
            aria-label="Save changes"
          >
            Save Changes
          </motion.button>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white p-6 rounded-xl max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 id="edit-modal-title" className="text-2xl font-medium text-[#0079C2]">Edit Profile</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 text-[#0079C2] hover:text-[#005a8e]"
                  aria-label="Close edit modal"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Avatar</label>
                  <div className="flex items-center space-x-4 mt-2">
                    {editForm.avatar ? (
                      <img
                        src={editForm.avatar}
                        alt="Profile preview"
                        className="h-16 w-16 rounded-full object-cover border-2 border-[#0079C2]"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-[#0079C2] flex items-center justify-center text-white text-xl font-medium">
                        {getInitials(editForm.name || profileData.name)}
                      </div>
                    )}
                    <label
                      htmlFor="modal-image-upload"
                      className="px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm cursor-pointer hover:bg-[#005a8e]"
                      aria-label="Upload new avatar"
                    >
                      Upload
                      <input
                        id="modal-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, true)}
                      />
                    </label>
                  </div>
                  {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border border-[#0079C2] rounded-full text-sm focus:ring-2 focus:ring-[#0079C2]"
                    required
                    aria-label="Edit name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-3 border border-[#0079C2] rounded-full text-sm focus:ring-2 focus:ring-[#0079C2]"
                    required
                    aria-label="Edit phone"
                  />
                </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-600">
                    Language
                  </label>
                  <select
                    id="language"
                    value={editForm.language || ''}
                    onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                    className="w-full p-3 border border-[#0079C2] rounded-full text-sm focus:ring-2 focus:ring-[#0079C2]"
                    aria-label="Select language"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी</option>
                    <option value="Bengali">বাংলা</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="village" className="block text-sm font-medium text-gray-600">
                    Village
                  </label>
                  <input
                    id="village"
                    type="text"
                    value={editForm.village || ''}
                    onChange={(e) => setEditForm({ ...editForm, village: e.target.value })}
                    className="w-full p-3 border border-[#0079C2] rounded-full text-sm focus:ring-2 focus:ring-[#0079C2]"
                    list="villages"
                    required
                    aria-label="Edit village"
                  />
                  <datalist id="villages">
                    <option value="Sitamarhi" />
                    <option value="Hooghly" />
                    <option value="Bankura" />
                  </datalist>
                </div>
                <div>
                  <label htmlFor="wellId" className="block text-sm font-medium text-gray-600">
                    Well ID
                  </label>
                  <input
                    id="wellId"
                    type="text"
                    value={editForm.wellId || ''}
                    onChange={(e) => setEditForm({ ...editForm, wellId: e.target.value })}
                    className="w-full p-3 border border-[#0079C2] rounded-full text-sm focus:ring-2 focus:ring-[#0079C2]"
                    required
                    aria-label="Edit well ID"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full p-3 bg-[#0079C2] text-white rounded-full text-sm hover:bg-[#005a8e]"
                  aria-label="Save profile changes"
                >
                  Save Changes
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;