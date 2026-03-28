import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, GripVertical, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sanitizeUrl } from '../../lib/sanitize';
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

interface GameItem {
  id: string;
  title: string;
  description: string;
  link: string;
}

interface SortableItemProps {
  game: GameItem;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ game, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: game.id });

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
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{game.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{game.description}</p>
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

const AdminGames: React.FC = () => {
  const [games, setGames] = useState<GameItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data) {
      setGames(data);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = games.findIndex((g) => g.id === active.id);
      const newIndex = games.findIndex((g) => g.id === over.id);

      const newOrder = arrayMove(games, oldIndex, newIndex);
      setGames(newOrder);

      for (let i = 0; i < newOrder.length; i++) {
        await supabase
          .from('games')
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
          .from('games')
          .update({
            title: formData.title,
            description: formData.description,
            link: formData.link
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('games')
          .insert([{
            title: formData.title,
            description: formData.description,
            link: formData.link,
            order_index: games.length
          }]);

        if (error) throw error;
      }

      await fetchGames();
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving game:', error);
      setErrorMsg('Ойынды сақтау кезінде қате орын алды.');
    }
  };

  const handleEdit = (game: GameItem) => {
    setFormData({
      title: game.title,
      description: game.description,
      link: game.link
    });
    setEditingId(game.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Бұл ойынды жоюға сенімдісіз бе?')) return;

    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchGames();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link: ''
    });
    setEditingId(null);
    setErrorMsg('');
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ойындарды басқару</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Ойын қосу</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'Ойынды өңдеу' : 'Жаңа ойын қосу'}
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сипаттама</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сілтеме</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="https://..."
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
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Ойындар ({games.length})</h3>
        {games.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Ойындар табылмады.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={games.map((g) => g.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {games.map((game) => (
                  <SortableItem
                    key={game.id}
                    game={game}
                    onEdit={() => handleEdit(game)}
                    onDelete={() => handleDelete(game.id)}
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

export default AdminGames;
