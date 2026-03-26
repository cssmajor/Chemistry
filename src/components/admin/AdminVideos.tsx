import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, GripVertical, Save, X, ArrowRightLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sanitizeUrl } from '../../lib/sanitize';
import { VideoItem } from '../../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  video: VideoItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleType: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ video, onEdit, onDelete, onToggleType }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-xl p-4 flex items-center space-x-4 hover:shadow-md transition-all"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{video.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-1">{video.description}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onToggleType}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
          title="Видео түрін өзгерту"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const AdminVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'lecture' | 'labwork'>('lecture');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    video_type: 'lecture' as 'lecture' | 'labwork'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      setErrorMsg('Видеоларды жүктеу кезінде қате орын алды.');
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
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex((v) => v.id === active.id);
      const newIndex = videos.findIndex((v) => v.id === over.id);

      const newVideos = arrayMove(videos, oldIndex, newIndex);
      setVideos(newVideos);

      for (let i = 0; i < newVideos.length; i++) {
        await supabase
          .from('videos')
          .update({ order_index: i })
          .eq('id', newVideos[i].id);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.url && !sanitizeUrl(formData.url)) {
      setErrorMsg('Жарамсыз видео URL мекенжайы. Тек http:// немесе https:// сілтемелерін қолданыңыз.');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('videos')
        .update({
          title: formData.title,
          description: formData.description,
          url: formData.url,
          video_type: formData.video_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) {
        setErrorMsg('Видеоны жаңарту кезінде қате орын алды.');
      } else {
        fetchVideos();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('videos')
        .insert([{
          title: formData.title,
          description: formData.description,
          url: formData.url,
          video_type: formData.video_type,
          order_index: videos.length
        }]);

      if (error) {
        setErrorMsg('Видеоны қосу кезінде қате орын алды.');
      } else {
        fetchVideos();
        resetForm();
      }
    }
  };

  const handleEdit = (video: VideoItem) => {
    setFormData({
      title: video.title,
      description: video.description,
      url: video.url,
      video_type: activeTab
    });
    setEditingId(video.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Бұл видеоны жойғыңыз келетініне сенімдісіз бе?')) {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) {
        setErrorMsg('Видеоны жою кезінде қате орын алды.');
      } else {
        fetchVideos();
      }
    }
  };

  const handleToggleVideoType = async (video: VideoItem) => {
    const newType = activeTab === 'lecture' ? 'labwork' : 'lecture';
    const { error } = await supabase
      .from('videos')
      .update({ video_type: newType })
      .eq('id', video.id);

    if (error) {
      setErrorMsg('Видео түрін ауыстыру кезінде қате орын алды.');
    } else {
      fetchVideos();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      video_type: activeTab
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
          <p className="text-red-700 text-sm">{errorMsg}</p>
          <button onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Видеоларды басқару</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium shadow-md"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{showAddForm ? 'Жабу' : 'Қосу'}</span>
        </button>
      </div>

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
          Зертханалық жұмыс
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Атауы</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Сипаттама</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube видео URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=... немесе https://youtu.be/..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">Видео алдын ала көрсету автоматты түрде YouTube-тен жүктеледі</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Бас тарту
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Жаңарту' : 'Сақтау'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Барлық видеолар ({videos.length})
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Видеоларды қайта реттеу үшін оларды сүйреңіз
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={videos.map(v => v.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {videos.map((video) => (
                <SortableItem
                  key={video.id}
                  video={video}
                  onEdit={() => handleEdit(video)}
                  onDelete={() => handleDelete(video.id)}
                  onToggleType={() => handleToggleVideoType(video)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default AdminVideos;
