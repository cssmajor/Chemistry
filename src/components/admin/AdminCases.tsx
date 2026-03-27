import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, GripVertical, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sanitizeUrl } from '../../lib/sanitize';
import { CaseItem } from '../../types';
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
  caseItem: CaseItem;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ caseItem, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: caseItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center space-x-4 hover:shadow-md transition-all"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{caseItem.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{caseItem.description}</p>
      </div>
      <div className="flex space-x-2">
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

const AdminCases: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'presentations' | 'pdfs' | 'images'>('videos');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    case_type: 'videos' as 'videos' | 'presentations' | 'pdfs' | 'images'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchCases();
  }, [activeTab]);

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('case_type', activeTab)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setCases(data.map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        link: c.link,
        thumbnail: c.thumbnail,
        uploadDate: c.upload_date,
        case_type: c.case_type
      })));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cases.findIndex((c) => c.id === active.id);
      const newIndex = cases.findIndex((c) => c.id === over.id);

      const newOrder = arrayMove(cases, oldIndex, newIndex);
      setCases(newOrder);

      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('cases')
          .update({ order_index: i })
          .eq('id', newOrder[i].id);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.link && !sanitizeUrl(formData.link)) {
      setErrorMsg('Жарамсыз URL мекенжайы. Тек http:// немесе https:// сілтемелерін қолданыңыз.');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('cases')
          .update({
            title: formData.title,
            description: formData.description,
            link: formData.link,
            case_type: formData.case_type,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cases')
          .insert([{
            title: formData.title,
            description: formData.description,
            link: formData.link,
            case_type: formData.case_type,
            order_index: cases.length
          }]);

        if (error) throw error;
      }

      await fetchCases();
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving case:', error);
      setErrorMsg('Жобаны сақтау кезінде қате орын алды.');
    }
  };

  const handleEdit = (caseItem: CaseItem) => {
    setFormData({
      title: caseItem.title,
      description: caseItem.description,
      link: caseItem.link,
      case_type: activeTab
    });
    setEditingId(caseItem.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Бұл жобаны жоюға сенімдісіз бе?')) return;

    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchCases();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
      case_type: activeTab
    });
    setEditingId(null);
    setErrorMsg('');
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'videos':
        return 'https://youtube.com/watch?v=... немесе https://youtu.be/...';
      case 'presentations':
      case 'pdfs':
        return 'https://drive.google.com/file/d/...';
      case 'images':
        return 'https://example.com/image.jpg';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Жобаларды басқару</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Жоба қосу</span>
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          Жоба видеолары
        </button>
        <button
          onClick={() => setActiveTab('presentations')}
          className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeTab === 'presentations'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          Презентациялар
        </button>
        <button
          onClick={() => setActiveTab('pdfs')}
          className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeTab === 'pdfs'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          PDF файлдар
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeTab === 'images'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          Суреттер
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'Жобаны өңдеу' : 'Жаңа жоба қосу'}
          </h3>
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Атауы</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сипаттама</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сілтеме</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={getPlaceholder()}
                required
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Сақтау</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <X className="w-4 h-4" />
                <span>Болдырмау</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {activeTab === 'videos' && 'Жоба видеолары'}
          {activeTab === 'presentations' && 'Презентациялар'}
          {activeTab === 'pdfs' && 'PDF файлдар'}
          {activeTab === 'images' && 'Суреттер'}
          {' '}({cases.length})
        </h3>
        {cases.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Жобалар табылмады.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={cases.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {cases.map((caseItem) => (
                  <SortableItem
                    key={caseItem.id}
                    caseItem={caseItem}
                    onEdit={() => handleEdit(caseItem)}
                    onDelete={() => handleDelete(caseItem.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default AdminCases;
