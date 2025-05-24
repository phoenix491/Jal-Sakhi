import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Heart } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const CommunityWall: React.FC = () => {
  const { t } = useTranslation();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      author: 'Anil',
      message: 'Saved 20% water with Bajra!',
      timestamp: '2 hours ago',
      likes: 5,
      liked: false,
    },
    {
      id: 'p2',
      author: 'Suresh',
      message: 'My well reached 80% after following recharge guide',
      timestamp: '1 day ago',
      likes: 8,
      liked: false,
    },
  ]);

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
          : post,
      ),
    );
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      setPosts(prev => [
        {
          id: `p${prev.length + 1}`,
          author: 'You',
          message: newPost,
          timestamp: 'Just now',
          likes: 0,
          liked: false,
        },
        ...prev,
      ]);
      setNewPost('');
    }
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 h-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-[#0079C2]" />
        <h2 className="text-2xl font-semibold text-[#0079C2]">{t('community.title')}</h2>
      </div>
      <form onSubmit={handlePostSubmit} className="mb-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={t('community.postPlaceholder')}
          className="w-full p-3 border border-[#0079C2] rounded-lg resize-none focus:ring-2 focus:ring-[#0079C2]"
          rows={2}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-2 px-4 py-2 bg-[#0079C2] hover:bg-[#005a8e] text-white rounded-lg flex items-center gap-2 focus:ring-2 focus:ring-[#0079C2]"
          disabled={!newPost.trim()}
        >
          <MessageSquare className="h-4 w-4" />
          {t('community.post')}
        </motion.button>
      </form>
      <div className="space-y-3">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {index === 0 && (
              <span className="absolute top-2 right-2 bg-[#EF4444] text-white text-xs px-2 py-1 rounded-full">
                {t('community.new')}
              </span>
            )}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-medium text-slate-800">{post.author}</div>
                <div className="text-sm text-gray-600">{post.message}</div>
                <div className="text-xs text-gray-600 mt-1">{post.timestamp}</div>
              </div>
              <motion.button
                onClick={() => handleLike(post.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 bg-[#BFDBFE] text-[#0079C2] px-2 py-1 rounded-full text-xs focus:ring-2 focus:ring-[#0079C2]"
              >
                <Heart className={`h-4 w-4 ${post.liked ? 'text-[#EF4444] fill-[#EF4444]' : ''}`} />
                <motion.span animate={{ scale: post.liked ? 1.2 : 1 }}>{post.likes}</motion.span>
              </motion.button>
            </div>
          </motion.div>
        ))}
        <motion.a
          href="/community"
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center gap-2 mt-4 text-[#0079C2] hover:text-[#005a8e]"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{t('community.join')}</span>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default CommunityWall;