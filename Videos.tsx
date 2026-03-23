import React, { useState } from 'react';
import { Video, Plus, CreditCard as Edit, Save, Trash2, ExternalLink, Youtube, Play } from 'lucide-react';

interface VideoItem {
  id: number;
  title: string;
  url: string;
  description: string;
  chapter: string;
  uploadDate: string;
  isEditing?: boolean;
}

interface VideosProps {
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
}

const Videos: React.FC<VideosProps> = ({ videos, setVideos }) => {
  // Initialize with sample videos if empty
  React.useEffect(() => {
    if (videos.length === 0) {
      const sampleVideos: VideoItem[] = [
        {
          id: 1,
          title: 'Бейорганика',
          url: 'https://www.youtube.com/live/lhcIp6Gi-eU?si=F8woVznOTDF_blKe',
          description: 'ҰБТ Химия',
          chapter: '1-тарау: Негізгі ұғымдар',
          uploadDate: '2025-09-14'
        },
        {
          id: 2,
          title: 'Сутек жайлы 20 минутта',
          url: 'https://youtu.be/XMmZ3cjFyYk?si=TNuUa-yGE53NSK46',
          description: 'ҰБТ Химия',
          chapter: '2-тарау: Атом құрылысы',
          uploadDate: '2025-09-14'
        },
        {
          id: 3,
          title: 'Химиялық байланыс түрлері',
          url: 'https://youtu.be/R0mvk69Cceo?si=S-sjmhDGXR_uYAcv',
          description: 'Есептер.',
          chapter: '3-тарау: Химиялық байланыс',
          uploadDate: '2025-09-14'
        },
        {
          id: 4,
          title: 'Менделеев кестесін үйреніп ал!',
          url: 'https://youtu.be/gqkt7-Bm0hc?si=h_1w1cmvgUCAivzw',
          description: 'ҰБТ Химия',
          chapter: '1-тарау: Негізгі ұғымдар',
          uploadDate: '2025-09-14'
        },
        {
          id: 5,
          title: 'Формула құрастыру',
          url: 'https://youtu.be/YoxEU_Yk1TU?si=3bu5P5-Ou--1b-1c',
          description: 'ҰБТ Химия',
          chapter: '3-тарау: Химиялық байланыс',
          uploadDate: '2025-09-14'
        },
        {
          id: 6,
          title: 'Органикалық химия эфирі',
          url: 'https://www.youtube.com/live/cfkIic4WGko?si=Po7FKV07TqWn8N_u',
          description: 'ҰБТ Химия',
          chapter: '6-тарау: Органикалық химия',
          uploadDate: '2025-09-14'
        },
        {
          id: 7,
          title: 'Болат пен Шойын',
          url: 'https://www.youtube.com/live/nPjv8hlbPcM?si=VXjhWRF4Rmy3Ewex',
          description: 'ҰБТ Химия',
          chapter: '3-тарау: Химиялық байланыс',
          uploadDate: '2025-09-14'
        },
        {
          id: 8,
          title: 'Тұздан қалайы алу',
          url: 'https://youtu.be/aiIWkYG0ChU?si=ua_azFYCYsc7LM15',
          description: 'ҰБТ Химия',
          chapter: '4-тарау: Химиялық реакциялар',
          uploadDate: '2025-09-14'
        }
      ];
      setVideos(sampleVideos);
    }
  }, [videos.length, setVideos]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    description: '',
    chapter: '1-тарау: Негізгі ұғымдар'
  });

  const chapters = [
    '1-тарау: Негізгі ұғымдар',
    '2-тарау: Атом құрылысы',
    '3-тарау: Химиялық байланыс',
    '4-тарау: Химиялық реакциялар',
    '5-тарау: Қышқылдар мен негіздер',
    '6-тарау: Органикалық химия'
  ];

  const addVideo = () => {
    if (newVideo.title && newVideo.url) {
      const video: VideoItem = {
        id: Date.now(),
        title: newVideo.title,
        url: newVideo.url,
        description: newVideo.description,
        chapter: newVideo.chapter,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setVideos(prev => [video, ...prev]);
      setNewVideo({ title: '', url: '', description: '', chapter: '1-тарау: Негізгі ұғымдар' });
      setShowAddForm(false);
    }
  };

  const editVideo = (id: number) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, isEditing: true } : video
    ));
  };

  const saveVideo = (id: number, updatedVideo: Partial<VideoItem>) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updatedVideo, isEditing: false } : video
    ));
  };

  const deleteVideo = (id: number) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  const getVideoThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    }
    return null;
  };

  const getVideoType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    return 'Видео';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Видео дәрістер
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Химия тақырыптары бойынша видео материалдарды қосыңыз және басқарыңыз. YouTube, Vimeo және басқа платформалардан сілтемелер қолдау көрсетіледі.
        </p>
      </div>

      {/* Add Video Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Видео қосу</span>
        </button>
      </div>

      {/* Add Video Form */}
      {showAddForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Жаңа видео қосу</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Видео атауы</label>
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Видео атауын енгізіңіз"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Видео сілтемесі</label>
              <input
                type="url"
                value={newVideo.url}
                onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тарау</label>
              <select
                value={newVideo.chapter}
                onChange={(e) => setNewVideo(prev => ({ ...prev, chapter: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {chapters.map(chapter => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Сипаттама</label>
              <textarea
                value={newVideo.description}
                onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Видео туралы қысқаша сипаттама"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Бас тарту
            </button>
            <button
              onClick={addVideo}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сақтау
            </button>
          </div>
        </div>
      )}

      {/* Videos List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-full bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Әлі ешқандай видео қосылмаған.</p>
            <p className="text-gray-400 text-sm mt-2">Жоғарыдағы "Видео қосу" түймесін басып, алғашқы видеоңызды қосыңыз.</p>
          </div>
        ) : (
          videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onEdit={() => editVideo(video.id)}
              onSave={(updatedVideo) => saveVideo(video.id, updatedVideo)}
              onDelete={() => deleteVideo(video.id)}
              chapters={chapters}
              getVideoThumbnail={getVideoThumbnail}
              getVideoType={getVideoType}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface VideoCardProps {
  video: VideoItem;
  onEdit: () => void;
  onSave: (updatedVideo: Partial<VideoItem>) => void;
  onDelete: () => void;
  chapters: string[];
  getVideoThumbnail: (url: string) => string | null;
  getVideoType: (url: string) => string;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onEdit, 
  onSave, 
  onDelete, 
  chapters, 
  getVideoThumbnail, 
  getVideoType 
}) => {
  const [editData, setEditData] = useState({
    title: video.title,
    url: video.url,
    description: video.description,
    chapter: video.chapter
  });

  const handleSave = () => {
    onSave(editData);
  };

  const thumbnail = getVideoThumbnail(video.url);
  const videoType = getVideoType(video.url);

  if (video.isEditing) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Видео атауы"
          />
          <input
            type="url"
            value={editData.url}
            onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Видео сілтемесі"
          />
          <select
            value={editData.chapter}
            onChange={(e) => setEditData(prev => ({ ...prev, chapter: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {chapters.map(chapter => (
              <option key={chapter} value={chapter}>{chapter}</option>
            ))}
          </select>
          <textarea
            value={editData.description}
            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={2}
            placeholder="Сипаттама"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
            >
              <Save className="w-3 h-3" />
              <span>Сақтау</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Video Thumbnail */}
      <div className="relative">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={video.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center">
            <Video className="w-16 h-16 text-white" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {videoType}
        </div>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Play className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
        <div className="text-xs text-gray-500 mb-3">
          <div className="bg-gray-100 px-2 py-1 rounded inline-block mb-1">{video.chapter}</div>
          <div>Қосылған: {video.uploadDate}</div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Көру</span>
          </a>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;