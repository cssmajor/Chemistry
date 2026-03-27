import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, GripVertical, Save, X, FileText, Link as LinkIcon, PlusCircle, MinusCircle, ArrowRightLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sanitizeUrl } from '../../lib/sanitize';
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
  onToggleType: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ test, onEdit, onDelete, onToggleType }) => {
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
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center space-x-4 hover:shadow-md transition-all"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          {test.type === 'handwritten' ? (
            <FileText className="w-4 h-4 text-blue-600" />
          ) : (
            <LinkIcon className="w-4 h-4 text-green-600" />
          )}
          <h3 className="font-semibold text-gray-900 dark:text-white">{test.title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{test.description}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onToggleType}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
          title="Тест түрін өзгерту"
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

const AdminTests: React.FC = () => {
  const [tests, setTests] = useState<CustomTest[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'labwork' | 'lecture'>('lecture');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'handwritten' as 'handwritten' | 'link',
    content: '',
    file_link: '',
    test_type: 'lecture' as 'labwork' | 'lecture',
    questions: [] as TestQuestion[]
  });

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
      setErrorMsg('Тесттерді жүктеу кезінде қате орын алды.');
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
    setErrorMsg('');

    if (formData.file_link && !sanitizeUrl(formData.file_link)) {
      setErrorMsg('Жарамсыз тест сілтемесі. Тек http:// немесе https:// сілтемелерін қолданыңыз.');
      return;
    }

    for (const q of formData.questions) {
      if (q.additional_materials_link && !sanitizeUrl(q.additional_materials_link)) {
        setErrorMsg('Жарамсыз қосымша материал сілтемесі. Тек http:// немесе https:// сілтемелерін қолданыңыз.');
        return;
      }
    }

    if (editingId) {
      const { error } = await supabase
        .from('custom_tests')
        .update({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          content: formData.type === 'handwritten' ? formData.content : null,
          file_link: formData.file_link || null,
          test_type: formData.test_type,
          questions: formData.questions,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) {
        setErrorMsg('Тестті жаңарту кезінде қате орын алды.');
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
          test_type: formData.test_type,
          questions: formData.questions,
          order_index: tests.length
        }]);

      if (error) {
        setErrorMsg('Тестті қосу кезінде қате орын алды.');
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
        setErrorMsg('Тестті жою кезінде қате орын алды.');
      } else {
        fetchTests();
      }
    }
  };

  const handleToggleTestType = async (test: CustomTest) => {
    const newType = activeTab === 'lecture' ? 'labwork' : 'lecture';
    const { error } = await supabase
      .from('custom_tests')
      .update({ test_type: newType })
      .eq('id', test.id);

    if (error) {
      setErrorMsg('Тест түрін ауыстыру кезінде қате орын алды.');
    } else {
      fetchTests();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'handwritten',
      content: '',
      file_link: '',
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
      options: ['', '', '', ''],
      correct_option: 0,
      additional_materials_link: ''
    };
    setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index: number, field: keyof TestQuestion, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push('');
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...formData.questions];
    if (newQuestions[questionIndex].options.length > 2) {
      newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
      if (newQuestions[questionIndex].correct_option >= newQuestions[questionIndex].options.length) {
        newQuestions[questionIndex].correct_option = 0;
      }
      setFormData({ ...formData, questions: newQuestions });
    }
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Тесттерді басқару</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium shadow-md"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{showAddForm ? 'Жабу' : 'Қосу'}</span>
        </button>
      </div>

      <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('lecture')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'lecture'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          Дәріс тесттері
        </button>
        <button
          onClick={() => setActiveTab('labwork')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'labwork'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          Зертханалық жұмыс тесттері
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Тест түрі</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Тест атауы</label>
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
              rows={2}
              required
            />
          </div>

          {formData.type === 'handwritten' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Тест мәтіні</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                placeholder="Тест сұрақтарын жазыңыз..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Тест сілтемесі</label>
              <input
                type="url"
                value={formData.file_link}
                onChange={(e) => setFormData({ ...formData, file_link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://forms.google.com/..."
              />
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Сұрақтар мен жауап нұсқалары
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
              <div className="space-y-4">
                {formData.questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Сұрақ {qIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Сұрақ мәтіні</label>
                      <input
                        type="text"
                        placeholder="Сұрақты жазыңыз..."
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Жауап нұсқалары</label>
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Нұсқа қосу</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {q.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correct_option === oIndex}
                              onChange={() => updateQuestion(qIndex, 'correct_option', oIndex)}
                              className="w-4 h-4 text-green-600"
                              title="Дұрыс жауап"
                            />
                            <input
                              type="text"
                              placeholder={`Нұсқа ${oIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Дұрыс жауапты белгілеу үшін радио батырманы басыңыз</p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        <LinkIcon className="w-3 h-3 inline mr-1" />
                        Қосымша материалдар сілтемесі (міндетті емес)
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={q.additional_materials_link || ''}
                        onChange={(e) => updateQuestion(qIndex, 'additional_materials_link', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
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

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Барлық тесттер ({tests.length})
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
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
                  onToggleType={() => handleToggleTestType(test)}
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
