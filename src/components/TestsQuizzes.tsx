import React, { useState, useEffect } from 'react';
import { FileText, Link as LinkIcon, ExternalLink, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CustomTest } from '../types';

const TestsQuizzes: React.FC = () => {
  const [tests, setTests] = useState<CustomTest[]>([]);
  const [activeTab, setActiveTab] = useState<'lecture' | 'labwork'>('lecture');
  const [searchQuery, setSearchQuery] = useState('');

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
        uploadDate: t.upload_date
      })));
    }
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTestIcon = (type: string) => {
    return type === 'handwritten' ? FileText : LinkIcon;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Тесттер мен Викториналар
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Дәріс және зертханалық жұмыстар бойынша тесттер
        </p>
      </div>

      <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200 max-w-md mx-auto">
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

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Тесттерді іздеу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchQuery ? 'Тест табылмады' : 'Тесттер жоқ'}
          </div>
        ) : (
          filteredTests.map((test) => {
            const Icon = getTestIcon(test.type);
            const hasLink = test.type === 'link' ? test.url : test.url;

            return (
              <div
                key={test.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${test.type === 'handwritten' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    <Icon className={`w-5 h-5 ${test.type === 'handwritten' ? 'text-blue-600' : 'text-green-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{test.title}</h3>
                    <p className="text-sm text-gray-500">{test.chapter}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>

                {test.type === 'handwritten' && test.content && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{test.content}</p>
                  </div>
                )}

                {hasLink && (
                  <a
                    href={test.type === 'link' ? test.url : test.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{test.type === 'link' ? 'Тестті ашу' : 'Файлды көру'}</span>
                  </a>
                )}

                {test.type === 'handwritten' && !hasLink && (
                  <div className="text-center py-3 text-sm text-gray-500">
                    Жоғарыдағы мәтінді оқыңыз
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TestsQuizzes;
