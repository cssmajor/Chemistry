import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, GripVertical, Save, X, Link as LinkIcon, ArrowRightLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sanitizeUrl } from '../../lib/sanitize';
import { Material } from '../../types';
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
  material: Material;
  onEdit: () => void;
  onDelete: () => void;
  onToggleType: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ material, onEdit, onDelete, onToggleType }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: material.id });

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
        <h3 className="font-semibold text-gray-900">{material.title}</h3>
        <p className="text-sm text-gray-600">{material.chapter}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onToggleType}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
          title="Материал түрін өзгерту"
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

const AdminMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'lecture' | 'labwork'>('lecture');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    type: 'pdf' as 'pdf' | 'doc' | 'ppt' | 'image' | 'video',
    chapter: '1-тарау: Негізгі ұғымдар',
    description: '',
    link: '',
    material_type: 'lecture' as 'lecture' | 'labwork'
  });

  const chapters = [
    '1-тарау: Негізгі ұғымдар',
    '2-тарау: Атом құрылысы',
    '3-тарау: Химиялық байланыс',
    '4-тарау: Химиялық реакциялар',
    '5-тарау: Қышқылдар мен негіздер',
    '6-тарау: Органикалық химия'
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchMaterials();
  }, [activeTab]);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('material_type', activeTab)
      .order('order_index', { ascending: true });

    if (error) {
      setErrorMsg('Материалдарды жүктеу кезінде қате орын алды.');
    } else if (data) {
      setMaterials(data.map((m: any) => ({
        id: m.id,
        title: m.title,
        type: m.type,
        chapter: m.chapter,
        description: m.description,
        uploadDate: m.upload_date,
        link: m.link
      })));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = materials.findIndex((m) => m.id === active.id);
      const newIndex = materials.findIndex((m) => m.id === over.id);

      const newMaterials = arrayMove(materials, oldIndex, newIndex);
      setMaterials(newMaterials);

      for (let i = 0; i < newMaterials.length; i++) {
        await supabase
          .from('materials')
          .update({ order_index: i })
          .eq('id', newMaterials[i].id);
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

    if (editingId) {
      const { error } = await supabase
        .from('materials')
        .update({
          title: formData.title,
          type: formData.type,
          chapter: formData.chapter,
          description: formData.description,
          link: formData.link,
          material_type: formData.material_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) {
        setErrorMsg('Материалды жаңарту кезінде қате орын алды.');
      } else {
        fetchMaterials();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('materials')
        .insert([{
          title: formData.title,
          type: formData.type,
          chapter: formData.chapter,
          description: formData.description,
          link: formData.link,
          material_type: formData.material_type,
          order_index: materials.length
        }]);

      if (error) {
        setErrorMsg('Материалды қосу кезінде қате орын алды.');
      } else {
        fetchMaterials();
        resetForm();
      }
    }
  };

  const handleEdit = (material: Material) => {
    setFormData({
      title: material.title,
      type: material.type,
      chapter: material.chapter,
      description: material.description,
      link: material.link || '',
      material_type: activeTab
    });
    setEditingId(material.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Бұл материалды жойғыңыз келетініне сенімдісіз бе?')) {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) {
        setErrorMsg('Материалды жою кезінде қате орын алды.');
      } else {
        fetchMaterials();
      }
    }
  };

  const handleToggleMaterialType = async (material: Material) => {
    const newType = activeTab === 'lecture' ? 'labwork' : 'lecture';
    const { error } = await supabase
      .from('materials')
      .update({ material_type: newType })
      .eq('id', material.id);

    if (error) {
      setErrorMsg('Материал түрін ауыстыру кезінде қате орын алды.');
    } else {
      fetchMaterials();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'pdf',
      chapter: '1-тарау: Негізгі ұғымдар',
      description: '',
      link: '',
      material_type: activeTab
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
        <h2 className="text-2xl font-bold text-gray-900">Материалдарды басқару</h2>
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
          Дәріс материалдары
        </button>
        <button
          onClick={() => setActiveTab('labwork')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'labwork'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Зертханалық жұмыс материалдары
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Түрі</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pdf">PDF</option>
                <option value="doc">Word</option>
                <option value="ppt">PowerPoint</option>
                <option value="image">Сурет</option>
                <option value="video">Видео</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тарау</label>
            <select
              value={formData.chapter}
              onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {chapters.map(chapter => (
                <option key={chapter} value={chapter}>{chapter}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Сипаттама</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-1" />
              Сілтеме (Google Drive т.б.)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://drive.google.com/..."
            />
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
          Барлық материалдар ({materials.length})
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Материалдарды қайта реттеу үшін оларды сүйреңіз
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={materials.map(m => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {materials.map((material) => (
                <SortableItem
                  key={material.id}
                  material={material}
                  onEdit={() => handleEdit(material)}
                  onDelete={() => handleDelete(material.id)}
                  onToggleType={() => handleToggleMaterialType(material)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default AdminMaterials;
