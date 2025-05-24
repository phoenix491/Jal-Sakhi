import React from 'react';
import { Video, Play } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const VideoTutorials: React.FC = () => {
  const { t } = useTranslation();
  
  const tutorials = [
    {
      id: 'v1',
      title: 'How to Recharge a Well',
      duration: '4:30',
      thumbnail: 'https://images.pexels.com/photos/3230010/pexels-photo-3230010.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 'v2',
      title: 'Understanding TDS Levels',
      duration: '3:15',
      thumbnail: 'https://images.pexels.com/photos/2480807/pexels-photo-2480807.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];
  
  return (
    <div className="glassmorphic p-4 fade-in h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Video className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t('learn.title')}</h2>
      </div>
      
      <div className="space-y-3">
        {tutorials.map((video) => (
          <div key={video.id} className="relative">
            <div 
              className="relative h-24 rounded-lg bg-cover bg-center overflow-hidden" 
              style={{ backgroundImage: `url(${video.thumbnail})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <button className="bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 hover-scale">
                  <Play className="h-5 w-5 text-primary" fill="currentColor" />
                </button>
              </div>
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                {video.duration}
              </div>
            </div>
            <div className="mt-2 text-sm font-medium">{video.title}</div>
          </div>
        ))}
        
        <a 
          href="/videos" 
          className="block mt-3 text-sm text-center text-primary hover:text-primary-dark hover:underline"
        >
          {t('learn.watch')}
        </a>
      </div>
    </div>
  );
};

export default VideoTutorials;