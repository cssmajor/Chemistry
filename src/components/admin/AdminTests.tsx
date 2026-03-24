import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, GripVertical, Save, X, FileText, Link as LinkIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CustomTest, TestQuestion } from '../../types';
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
  test: CustomTest;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ test, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: test.id });

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
        <div className="flex items-center space-x-2 mb-1">
          {test.type === 'handwritten' ? (
            <FileText className="w-4 h-4 text-blue-600" />
          ) : (
            <LinkIcon className="w-4 h-4 text-green-600" />
          )}
          <h3 className="font-semibold text-gray-900">{test.title}</h3>
        </div>
        <p className="text-sm text-gray-600">{test.chapter}</p>
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

const AdminTests: React.FC = () => {
  const [tests, setTests] = useState<CustomTest[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'labwork' | 'lecture'>('lecture');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'handwritten' as 'handwritten' | 'link',
    content: '',
    file_link: '',
    chapter: '1-тарау: Негізгі ұғымдар',
    test_type: 'lecture' as 'labwork' | 'lecture',
    questions: [] as TestQuestion[]
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
    fetchTests();
  }, [activeTab]);

  const fetchTests = async () => {
    const { data, error } = await supabase
      .from('custom_tests')
      .select('*')
      .eq('test_type', activeTab)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching tests:', error);
    } else if (data) {
      setTests(data.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        type: t.type,
        content: t.content,
        url: t.file_link,
        chapter: t.chapter,
        uploadDate: t.upload_date,
        questions: t.questions || []
      })));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tests.findIndex((t) => t.id === active.id);
      const newIndex = tests.findIndex((t) => t.id === over.id);

      const newTests = arrayMove(tests, oldIndex, newIndex);
      setTests(newTests);

      for (let i = 0; i < newTests.length; i++) {
        await supabase
          .from('custom_tests')
          .update({ order_index: i })
          .eq('id', newTests[i].id);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('custom_tests')
        .update({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          content: formData.type === 'handwritten' ? formData.content : null,
          file_link: formData.file_link || null,
          chapter: formData.chapter,
          test_type: formData.test_type,
          questions: formData.questions,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating test:', error);
      } else {
        fetchTests();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('custom_tests')
        .insert([{
          title: formData.title,
          description: formData.description,
          type: formData.type,
          content: formData.type === 'handwritten' ? formData.content : null,
          file_link: formData.file_link || null,
          chapter: formData.chapter,
          test_type: formData.test_type,
          questions: formData.questions,
          order_index: tests.length
        }]);

      if (error) {
        console.error('Error adding test:', error);
      } else {
        fetchTests();
        resetForm();
      }
    }
  };

  const handleEdit = (test: CustomTest) => {
    setFormData({
      title: test.title,
      description: test.description,
      type: test.type,
      content: test.content || '',
      file_link: test.url || '',
      chapter: test.chapter,
      test_type: activeTab,
      questions: test.questions || []
    });
    setEditingId(test.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Бұл тестті жойғыңыз келетініне сенімдісіз бе?')) {
      const { error } = await supabase
        .from('custom_tests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting test:', error);
      } else {
        fetchTests();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'handwritten',
      content: '',
      file_link: '',
      chapter: '1-тарау: Негізгі ұғымдар',
      test_type: activeTab,
      questions: []
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const addQuestion = () => {
    const newQuestion: TestQuestion = {
      id: formData.questions.length + 1,
      question: '',
      answer: ''
    };
    setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Тесттерді басқару</h2>
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
          Дәріс тесттері
        </button>
        <button
          onClick={() => setActiveTab('labwork')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'labwork'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Зертханалық тесттері
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Тест түрі</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="handwritten"
                  checked={formData.type === 'handwritten'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'handwritten' | 'link' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Қолжазба</span>
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="link"
                  checked={formData.type === 'link'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'handwritten' | 'link' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="flex items-center space-x-1">
                  <LinkIcon className="w-4 h-4" />
                  <span>Сілтеме</span>
                </span>
              </label>
            </div>
          </div>

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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Сипаттама</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          {formData.type === 'handwritten' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тест мәтіні</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                placeholder="Тест сұрақтарын жазыңыз..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тест сілтемесі</label>
              <input
                type="url"
                value={formData.file_link}
                onChange={(e) => setFormData({ ...formData, file_link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://forms.google.com/..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-1" />
              Қосымша файлдар сілтемесі (міндетті емес)
            </label>
            <input
              type="url"
              value={formData.file_link}
              onChange={(e) => setFormData({ ...formData, file_link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://drive.google.com/..."
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Сұрақтар мен жауаптар (міндетті емес)
              </label>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Сұрақ қосу</span>
              </button>
            </div>

            {formData.questions.length > 0 && (
              <div className="space-y-3">
                {formData.questions.map((q, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Сұрақ {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Сұрақ"
                      value={q.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Дұрыс жауап"
                      value={q.answer}
                      onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                ))}
              </div>
            )}
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
          Барлық тесттер ({tests.length})
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Тесттерді қайта реттеу үшін оларды сүйреңіз
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tests.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {tests.map((test) => (
                <SortableItem
                  key={test.id}
                  test={test}
                  onEdit={() => handleEdit(test)}
                  onDelete={() => handleDelete(test.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default AdminTests;
