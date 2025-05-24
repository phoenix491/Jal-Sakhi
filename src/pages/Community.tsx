import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Image, Tag, ThumbsUp, MessageCircle, Share2, X, Star, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import confetti from 'canvas-confetti';

interface Post {
  id: string;
  author: { name: string; avatar: string; village: string };
  title: string;
  description: string;
  image?: string;
  tags: string[];
  likes: number;
  comments: { id: string; author: string; text: string; timestamp: string }[];
  timestamp: string;
  language: 'en' | 'hi' | 'bn';
  isPinned?: boolean;
  isFeatured?: boolean;
  badges?: string[];
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: { name: 'Ramesh Kumar', avatar: '/avatar1.png', village: 'Hooghly, WB' },
    title: 'Saved 20% Water with Bajra 🌾',
    description: 'Switched to Bajra and used drip irrigation. Saved 6000L this season! Try it in dry areas.',
    image: 'https://images.unsplash.com/photo-1500595046743-ddf4d3d753fd',
    tags: ['Bajra', 'WaterSaved', 'WestBengal'],
    likes: 12,
    comments: [
      { id: 'c1', author: 'Sita', text: 'Great tip! Trying this in Bankura.', timestamp: 'Just now' },
      { id: 'c2', author: 'Arjun', text: 'How much did drip cost?', timestamp: '1 hr ago' }
    ],
    timestamp: '2 days ago',
    language: 'en',
    badges: ['Water Champion'],
    isFeatured: true
  },
  {
    id: '2',
    author: { name: 'Anjali Das', avatar: '/avatar2.png', village: 'Bankura, WB' },
    title: 'Recharge Pit Saved Our Borewell 💧',
    description: 'Built a recharge pit for ₹1500. Well didn’t dry this summer. Follow Jal Sakhi’s guide!',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
    tags: ['Recharge', 'Pit', 'WestBengal'],
    likes: 8,
    comments: [
      { id: 'c3', author: 'Mohan', text: 'Where to get materials?', timestamp: '3 hrs ago' }
    ],
    timestamp: '1 day ago',
    language: 'bn',
    badges: ['Verified']
  },
  {
    id: '3',
    author: { name: 'Sunita Yadav', avatar: '/avatar3.png', village: 'Meerut, UP' },
    title: 'Mulching Boosted My Wheat Yield 🌾',
    description: 'Used straw mulching for wheat. Less water, better soil. Saved 4000L!',
    tags: ['Mulching', 'Wheat', 'UttarPradesh'],
    likes: 15,
    comments: [],
    timestamp: '3 days ago',
    language: 'hi',
    badges: ['First Time Poster']
  },
  {
    id: '4',
    author: { name: 'Kamal Singh', avatar: '/avatar4.png', village: 'Purulia, WB' },
    title: 'Jal Sakhi AI Helped My Paddy Crop 📈',
    description: 'Used JalMitra AI for paddy irrigation schedule. Saved water and got 10% more yield.',
    image: 'https://images.unsplash.com/photo-1580206898140-5c3e4180ae94',
    tags: ['Paddy', 'JalMitra', 'WestBengal'],
    likes: 20,
    comments: [
      { id: 'c4', author: 'Rita', text: 'How to use JalMitra?', timestamp: '2 hrs ago' }
    ],
    timestamp: 'Today at 9:45 AM',
    language: 'en',
    isPinned: true,
    badges: ['Post of the Month']
  }
];

const Community: React.FC = () => {
  const { farmerId } = useAuth();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tags: [] as string[],
    language: 'en' as 'en' | 'hi' | 'bn'
  });
  const [filters, setFilters] = useState({ region: '', crop: '', practice: '', time: '' });
  const [sortBy, setSortBy] = useState('recent');
  const [voiceInput, setVoiceInput] = useState('');

  useEffect(() => {
    posts.forEach(post => {
      if (post.likes >= 10 && !post.badges?.includes('Popular')) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setPosts(prev =>
          prev.map(p =>
            p.id === post.id ? { ...p, badges: [...(p.badges || []), 'Popular'] } : p
          )
        );
      }
    });
  }, [posts]);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      id: `${Date.now()}`,
      author: { name: 'Farmer A', avatar: '/avatar.png', village: 'Nadia, WB' },
      title: formData.title,
      description: voiceInput || formData.description,
      image: formData.image,
      tags: formData.tags,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      language: formData.language,
      badges: ['First Time Poster']
    };
    setPosts([newPost, ...posts]);
    setFormData({ title: '', description: '', image: '', tags: [], language: 'en' });
    setVoiceInput('');
    setIsModalOpen(false);
    alert('Your story is now live!');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleComment = (postId: string, text: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              { id: `${Date.now()}`, author: 'Farmer A', text, timestamp: 'Just now' }
            ]
          }
        : post
    ));
  };

  const toggleLanguage = (postId: string, newLang: 'en' | 'hi' | 'bn') => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, language: newLang } : post
    ));
  };

  const filteredPosts = posts
    .filter(post =>
      (!filters.region || post.author.village.includes(filters.region)) &&
      (!filters.crop || post.tags.includes(filters.crop)) &&
      (!filters.practice || post.tags.includes(filters.practice)) &&
      (!filters.time || (filters.time === 'Today' && post.timestamp.includes('Today')))
    )
    .sort((a, b) => sortBy === 'likes' ? b.likes - a.likes : Date.parse(b.timestamp) - Date.parse(a.timestamp));

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans p-4">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow p-4 mb-4 z-10" role="banner">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-green-600" />
              🌱 Jal Sakhi Community
            </h1>
            <p className="text-sm text-gray-600">Share your farming success and learn from others</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg md:ml-auto"
            aria-label="Share a new story"
          >
            + Share My Story
          </motion.button>
        </div>
      </header>

      {/* Filters & Sort */}
      <div className="flex flex-wrap gap-4 mb-4" role="region" aria-label="Filters">
        <select
          className="p-2 border rounded-lg"
          onChange={e => setFilters({ ...filters, region: e.target.value })}
          aria-label="Filter by region"
        >
          <option value="">All Regions</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Purulia">Purulia</option>
        </select>
        <select
          className="p-2 border rounded-lg"
          onChange={e => setFilters({ ...filters, crop: e.target.value })}
          aria-label="Filter by crop"
        >
          <option value="">All Crops</option>
          <option value="Bajra">Bajra</option>
          <option value="Wheat">Wheat</option>
          <option value="Paddy">Paddy</option>
        </select>
        <select
          className="p-2 border rounded-lg"
          onChange={e => setFilters({ ...filters, practice: e.target.value })}
          aria-label="Filter by practice"
        >
          <option value="">All Practices</option>
          <option value="Recharge">Recharge</option>
          <option value="Mulching">Mulching</option>
          <option value="Drip">Drip</option>
        </select>
        <select
          className="p-2 border rounded-lg"
          onChange={e => setFilters({ ...filters, time: e.target.value })}
          aria-label="Filter by time"
        >
          <option value="">All Time</option>
          <option value="Today">Today</option>
          <option value="Last 7 Days">Last 7 Days</option>
        </select>
        <select
          className="p-2 border rounded-lg"
          onChange={e => setSortBy(e.target.value)}
          aria-label="Sort posts"
        >
          <option value="recent">Most Recent</option>
          <option value="likes">Most Liked</option>
          <option value="verified">Verified Stories</option>
        </select>
      </div>

      {/* Post Feed */}
      <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0" role="feed">
        {filteredPosts.map(post => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-4 rounded-lg shadow relative"
            aria-labelledby={`post-${post.id}`}
          >
            {post.isPinned && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                Pinned
              </span>
            )}
            {post.isFeatured && (
              <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                Featured
              </span>
            )}
            <div className="flex items-center mb-2">
              <img src={post.author.avatar} alt={`${post.author.name}'s avatar`} className="h-8 w-8 rounded-full mr-2" />
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-gray-600">{post.author.village}</p>
              </div>
            </div>
            {post.image && (
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-2" />
            )}
            <h3 id={`post-${post.id}`} className="text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-600 line-clamp-3">{post.description}</p>
            <div className="flex flex-wrap gap-2 my-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
              {post.badges?.map(badge => (
                <span key={badge} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex space-x-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1 text-gray-600"
                  aria-label={`Like post by ${post.author.name}`}
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span>{post.likes}</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center space-x-1 text-gray-600"
                  aria-label={`Comment on post by ${post.author.name}`}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments.length}</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center space-x-1 text-gray-600"
                  aria-label={`Share post by ${post.author.name}`}
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => toggleLanguage(post.id, 'en')}
                className={`text-sm ${post.language === 'en' ? 'text-green-600' : 'text-gray-600'}`}
              >
                EN
              </button>
              <button
                onClick={() => toggleLanguage(post.id, 'hi')}
                className={`text-sm ${post.language === 'hi' ? 'text-green-600' : 'text-gray-600'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => toggleLanguage(post.id, 'bn')}
                className={`text-sm ${post.language === 'bn' ? 'text-green-600' : 'text-gray-600'}`}
              >
                বাংলা
              </button>
            </div>
            {/* Comments */}
            <div className="mt-2">
              {post.comments.slice(0, 3).map(comment => (
                <div key={comment.id} className="flex items-start space-x-2 mt-2">
                  <p className="text-sm font-semibold">{comment.author}:</p>
                  <p className="text-sm text-gray-600">{comment.text}</p>
                </div>
              ))}
              {post.comments.length > 3 && (
                <button className="text-sm text-primary mt-2">Load more comments</button>
              )}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const text = (e.target as any).comment.value;
                  if (text) {
                    handleComment(post.id, text);
                    (e.target as any).comment.value = '';
                  }
                }}
                className="mt-2 flex items-center"
              >
                <input
                  name="comment"
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border rounded-lg"
                  aria-label="Comment input"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="ml-2 bg-green-600 text-white px-2 py-1 rounded"
                  aria-label="Submit comment"
                >
                  Post
                </motion.button>
              </form>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Post Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white p-6 rounded-lg max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 id="modal-title" className="text-xl font-semibold">Share Your Story</h2>
                <button onClick={() => setIsModalOpen(false)} aria-label="Close modal">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value="Farmer A"
                    disabled
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    maxLength={500}
                    rows={4}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Voice Input (Mock)</label>
                  <input
                    type="text"
                    value={voiceInput}
                    onChange={e => setVoiceInput(e.target.value)}
                    placeholder="Type to simulate voice input..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags.join(',')}
                    onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Language</label>
                  <select
                    value={formData.language}
                    onChange={e => setFormData({ ...formData, language: e.target.value as 'en' | 'hi' | 'bn' })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="bn">বাংলা</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-green-600 text-white p-2 rounded-lg"
                  aria-label="Submit story"
                >
                  Share Now
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard */}
      <div className="hidden md:block mt-8" role="region" aria-label="Leaderboard">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
          Top Farmers This Month
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Ramesh Kumar', badge: 'Water Champion 🌿', stat: 'Saved 8000L', reward: '₹30 Recharge' },
            { name: 'Anjali Das', badge: 'Community Star ⭐', stat: '45 likes', reward: '₹20 Voucher' },
            { name: 'Sunita Yadav', badge: 'Monthly Hero 🏆', stat: '20 comments', reward: '₹50 Cash' }
          ].map(farmer => (
            <div key={farmer.name} className="bg-white p-4 rounded-lg shadow">
              <p className="font-semibold">{farmer.name}</p>
              <p className="text-sm text-green-700">{farmer.badge}</p>
              <p className="text-sm text-gray-600">{farmer.stat}</p>
              <p className="text-sm text-blue-600">{farmer.reward}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;