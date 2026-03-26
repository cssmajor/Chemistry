import React, { useState, useEffect } from 'react';
import { Play, Search } from 'lucide-react';
import { VideoItem } from '../types';
import { supabase } from '../lib/supabase';

const VideosView: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'lecture' | 'labwork'>('lecture');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [activeTab]);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('video_type', activeTab)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
    } else if (data) {
      setVideos(data.map((v: any) => ({
        id: v.id,
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnail,
        duration: v.duration,
        chapter: v.chapter,
        uploadDate: v.upload_date,
        views: v.views,
        url: v.url
      })));
    }
    setLoading(false);
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        <button
          onClick={() => setActiveTab('lecture')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'lecture'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Дәріс видеолары
        </button>
        <button
          onClick={() => setActiveTab('labwork')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'labwork'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Зертханалық жұмыстар
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Видеоларды іздеу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
            {filteredVideos.length} видео
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200 col-span-full">
            <p className="text-gray-500 text-lg">Видеолар табылмады.</p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
              <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-blue-100 to-green-100">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-16 h-16 text-blue-600 opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"
                  >
                    <div className="bg-white rounded-full p-4 shadow-lg">
                      <Play className="w-8 h-8 text-blue-600" fill="currentColor" />
                    </div>
                  </a>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">{video.description}</p>

                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2.5 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 font-medium shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  <span>Көру</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideosView;
