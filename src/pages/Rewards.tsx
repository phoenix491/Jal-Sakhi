import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFarmer } from '../contexts/FarmerContext';
import { useSensorData } from '../contexts/SensorDataContext';
import { Award, Star, Droplet, MessageCircle, Ticket, ThumbsUp, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Coupon {
  id: string;
  title: string;
  description: string;
  points: number;
  expires: string;
  status: 'active' | 'used' | 'expired';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  total: number;
  completed: boolean;
  rewardType: 'points' | 'badge' | 'monetary';
  rewardValue: number | string;
}

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  image?: string;
  region: string;
  likes: number;
  timestamp: string;
}

const Rewards: React.FC = () => {
  const { farmer } = useFarmer();
  const { usageData } = useSensorData();
  const [couponTab, setCouponTab] = useState<'active' | 'used' | 'expired'>('active');
  const [regionFilter, setRegionFilter] = useState('All');
  const [newPost, setNewPost] = useState('');

  // Mock data
  const totalPoints = 750;
  const streakDays = 5;
  const level = totalPoints <= 500 ? 'Beginner' : totalPoints <= 1000 ? 'Expert' : 'Master';
  const nextLevelPoints = level === 'Beginner' ? 501 : level === 'Expert' ? 1001 : 2000;
  const progress = Math.min((totalPoints / nextLevelPoints) * 100, 100);
  const leaderboardRank = 3;

  const coupons: Coupon[] = [
    {
      id: 'C1',
      title: 'Food Discount',
      description: '20% off on grocery purchases',
      points: 200,
      expires: '2025-06-30',
      status: 'active'
    },
    {
      id: 'C2',
      title: 'Medicine Discount',
      description: '15% off on health supplies',
      points: 300,
      expires: '2025-05-20',
      status: 'expired'
    },
    {
      id: 'C3',
      title: 'Agricultural Supplies',
      description: '10% off on seeds and fertilizers',
      points: 250,
      expires: '2025-08-01',
      status: 'used'
    }
  ];

  const challenges: Challenge[] = [
    {
      id: 'CH1',
      title: '1000L Saver',
      description: 'Save 1000L of water this week',
      points: 10,
      progress: usageData.savedWater,
      total: 1000,
      completed: usageData.savedWater >= 1000,
      rewardType: 'points',
      rewardValue: 10
    },
    {
      id: 'CH2',
      title: 'Share Your Setup',
      description: 'Upload a photo of your drip or pipe setup',
      points: 5,
      progress: 0,
      total: 1,
      completed: false,
      rewardType: 'monetary',
      rewardValue: '₹5'
    },
    {
      id: 'CH3',
      title: 'Crop Smart Quiz',
      description: 'Answer 5 questions on crop selection',
      points: 5,
      progress: 3,
      total: 5,
      completed: false,
      rewardType: 'badge',
      rewardValue: 'Crop Smart'
    },
    {
      id: 'CH4',
      title: 'Spread the Word',
      description: 'Refer a farmer to join Jal Sakhi',
      points: 10,
      progress: 0,
      total: 1,
      completed: false,
      rewardType: 'monetary',
      rewardValue: '₹10'
    },
    {
      id: 'CH5',
      title: 'Recharge Action Log',
      description: 'Log a manual recharge with photo',
      points: 15,
      progress: 0,
      total: 1,
      completed: false,
      rewardType: 'points',
      rewardValue: 15
    }
  ];

  const communityPosts: CommunityPost[] = [
    {
      id: 'P1',
      author: 'Ramesh, Birbhum',
      content: 'Saved 5,000L by switching to Bajra this season!',
      image: 'https://example.com/well-before-after.jpg',
      region: 'Birbhum',
      likes: 15,
      timestamp: '2025-05-23T10:00:00'
    },
    {
      id: 'P2',
      author: 'Priya, Kurukshetra',
      content: 'Installed drip irrigation and saw great results!',
      region: 'Kurukshetra',
      likes: 8,
      timestamp: '2025-05-22T14:30:00'
    }
  ];

  const regions = ['All', 'Birbhum', 'Kurukshetra'];

  useEffect(() => {
    const checkExpirations = () => {
      const now = new Date();
      coupons.forEach(coupon => {
        if (coupon.status === 'active' && new Date(coupon.expires) < now) {
          coupon.status = 'expired';
        }
      });
    };
    checkExpirations();
    const interval = setInterval(checkExpirations, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimCoupon = (couponId: string) => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    coupons.find(c => c.id === couponId)!.status = 'used';
  };

  const handleCompleteChallenge = (challengeId: string) => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    communityPosts.push({
      id: `P${communityPosts.length + 1}`,
      author: `${farmer.name}, ${farmer.village}`,
      content: newPost,
      region: farmer.village,
      likes: 0,
      timestamp: new Date().toISOString()
    });
    setNewPost('');
  };

  const filteredPosts = regionFilter === 'All' ? communityPosts : communityPosts.filter(post => post.region === regionFilter);
  const filteredCoupons = coupons.filter(coupon => coupon.status === couponTab);

  return (
    <div className="min-h-screen bg-[#F6FAF9] text-slate-800 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-semibold text-[#0079C2]">My Jal Points</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white p-6 rounded-xl shadow flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            role="region"
            aria-labelledby="total-points"
          >
            <Award className="h-8 w-8 text-[#0079C2]" />
            <div>
              <p id="total-points" className="text-lg font-medium">Total Points</p>
              <p className="text-2xl font-bold text-[#0079C2]">{totalPoints}</p>
              <p className="text-sm text-gray-600">Farmer: {farmer.name}</p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            role="region"
            aria-labelledby="water-saved"
          >
            <Droplet className="h-8 w-8 text-[#0079C2]" />
            <div>
              <p id="water-saved" className="text-lang font-medium">Water Saved</p>
              <p className="text-2xl font-bold text-[#0079C2]">{usageData.savedWater} L</p>
              <p className="text-sm text-gray-600">Total water conserved this season</p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            role="region"
            aria-labelledby="level"
          >
            <Star className="h-8 w-8 text-[#0079C2]" />
            <div>
              <p id="level" className="text-lg font-medium">Your Level</p>
              <p className="text-2xl font-bold text-[#0079C2]">{level}</p>
              <div className="w-32 bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-[#0079C2] h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{nextLevelPoints - totalPoints} points to next level</p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow flex items-center space-x-4 md:col-span-3"
            whileHover={{ scale: 1.02 }}
            role="region"
            aria-labelledby="leaderboard-rank"
          >
            <Award className="h-8 w-8 text-[#0079C2]" />
            <div>
              <p id="leaderboard-rank" className="text-lg font-medium">Leaderboard Rank</p>
              <p className="text-2xl font-bold text-[#0079C2]">Rank #{leaderboardRank}</p>
              <p className="text-sm text-gray-600">Your position among farmers in your district</p>
            </div>
          </motion.div>
        </div>

        {/* Coupons Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-medium text-[#0079C2]">Available Coupons</h2>
          <div className="flex space-x-4 mb-6">
            {['active', 'used', 'expired'].map(tab => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCouponTab(tab as typeof couponTab)}
                className={`px-4 py-2 rounded-full text-sm ${
                  couponTab === tab ? 'bg-[#0079C2] text-white' : 'bg-white text-[#0079C2] border border-[#0079C2]'
                }`}
                aria-label={`Show ${tab} coupons`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCoupons.length === 0 ? (
              <p className="text-gray-600">No coupons available in this category</p>
            ) : (
              filteredCoupons.map(coupon => (
                <motion.div
                  key={coupon.id}
                  className="bg-white p-6 rounded-xl shadow flex items-center justify-between"
                  whileHover={{ scale: 1.02 }}
                  role="region"
                  aria-labelledby={`coupon-${coupon.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <Ticket className="h-6 w-6 text-[#0079C2]" />
                    <div>
                      <p id={`coupon-${coupon.id}`} className="font-medium text-[#0079C2]">{coupon.title}</p>
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                      <p className="text-sm text-gray-600">{coupon.points} Points</p>
                      <p className="text-xs text-gray-600">Expires: {coupon.expires}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={coupon.status !== 'active' || totalPoints < coupon.points}
                    onClick={() => handleClaimCoupon(coupon.id)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      coupon.status === 'active' && totalPoints >= coupon.points
                        ? 'bg-[#0079C2] text-white hover:bg-[#005a8e]'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                    aria-label={`Claim ${coupon.title} coupon`}
                  >
                    {coupon.status === 'used' ? 'Claimed' : coupon.status === 'expired' ? 'Expired' : 'Claim Coupon'}
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Challenges Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-medium text-[#0079C2]">Water Warrior Weekly</h2>
          <div className="space-y-6">
            {challenges.map(challenge => (
              <motion.div
                key={challenge.id}
                className="bg-white p-6 rounded-xl shadow flex items-center justify-between"
                whileHover={{ scale: 1.02 }}
                role="region"
                aria-labelledby={`challenge-${challenge.id}`}
              >
                <div className="flex items-center space-x-4">
                  <Star className={`h-6 w-6 ${challenge.completed ? 'text-[#0079C2]' : 'text-gray-400'}`} />
                  <div>
                    <p id={`challenge-${challenge.id}`} className="font-medium text-[#0079C2]">{challenge.title}</p>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                    <p className="text-sm text-gray-600">{challenge.progress}/{challenge.total}</p>
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-[#0079C2] h-2.5 rounded-full"
                        style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                {challenge.completed ? (
                  <span className="text-[#0079C2] text-sm">Completed</span>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCompleteChallenge(challenge.id)}
                    className="px-4 py-2 bg-[#0079C2] text-white rounded-full text-sm"
                    aria-label={`Complete ${challenge.title} challenge`}
                  >
                    Complete Challenge
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-medium text-[#0079C2]">Our Water Stories</h2>
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="appearance-none bg-white pl-10 pr-4 py-2 rounded-full border border-[#0079C2] focus:ring-2 focus:ring-[#0079C2] text-sm"
                aria-label="Filter community posts by region"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0079C2]" />
            </div>
          </div>
          <form onSubmit={handlePostSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your water-saving story or use voice input..."
              className="flex-1 p-3 rounded-full border border-[#0079C2] focus:ring-2 focus:ring-[#0079C2] text-sm"
              aria-label="Share a community post"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="p-3 bg-[#0079C2] text-white rounded-full"
              aria-label="Submit community post"
            >
              <MessageCircle className="h-5 w-5" />
            </motion.button>
          </form>
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <p className="text-gray-600">No posts available for this region</p>
            ) : (
              filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  className="bg-white p-6 rounded-xl shadow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  role="region"
                  aria-labelledby={`post-${post.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <MessageCircle className="h-6 w-6 text-[#0079C2]" />
                    <div>
                      <p id={`post-${post.id}`} className="font-medium text-[#0079C2]">{post.author}</p>
                      <p className="text-sm text-gray-600">{post.region}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mt-3">{post.content}</p>
                  {post.image && (
                    <img src={post.image} alt="Community post" className="mt-4 rounded-lg max-w-full h-32 object-cover" />
                  )}
                  <div className="flex items-center space-x-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 text-sm text-[#0079C2]"
                      aria-label={`Like post by ${post.author}`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </motion.button>
                    <p className="text-xs text-gray-600">{new Date(post.timestamp).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <Link to="/jalmitra">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full p-3 bg-[#0079C2] text-white rounded-full text-sm flex items-center justify-center space-x-2"
              aria-label="Join Jalmitra Community"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Join Jalmitra Community</span>
            </motion.button>
          </Link>
        </div>

        {/* Streak Section */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
          role="region"
          aria-labelledby="streak"
        >
          <Star className="h-8 w-8 text-[#0079C2]" />
          <div>
            <p id="streak" className="text-lg font-medium">Current Streak</p>
            <p className="text-2xl font-bold text-[#0079C2]">{streakDays} Days</p>
            <p className="text-sm text-gray-600">Keep logging in daily to maintain your streak!</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;