import React, { useState, useEffect } from 'react';
import { FileText, Link as LinkIcon, ExternalLink, Search, CheckCircle, XCircle, Book, Gamepad2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sanitizeUrl } from '../lib/sanitize';
import { CustomTest, TestQuestion } from '../types';

interface GameItem {
  id: string;
  title: string;
  description: string;
  link: string;
}

const TestsQuizzes: React.FC = () => {
  const [tests, setTests] = useState<CustomTest[]>([]);
  const [games, setGames] = useState<GameItem[]>([]);
  const [activeTab, setActiveTab] = useState<'lecture' | 'labwork' | 'games'>('lecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<CustomTest | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (activeTab === 'games') {
      fetchGames();
    } else {
      fetchTests();
    }
  }, [activeTab]);

  const fetchTests = async () => {
    const { data, error } = await supabase
      .from('custom_tests')
      .select('*')
      .eq('test_type', activeTab)
      .order('order_index', { ascending: true });

    if (error) {
      setTests([]);
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

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      setGames([]);
    } else if (data) {
      setGames(data);
    }
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTestIcon = (type: string) => {
    return type === 'handwritten' ? FileText : LinkIcon;
  };

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setUserAnswers({ ...userAnswers, [questionId]: optionIndex });
  };

  const handleSubmitTest = () => {
    setShowResults(true);
  };

  const handleResetTest = () => {
    setUserAnswers({});
    setShowResults(false);
    setSelectedTest(null);
  };

  const calculateScore = () => {
    if (!selectedTest || !selectedTest.questions) return 0;
    let correct = 0;
    selectedTest.questions.forEach((q: TestQuestion) => {
      if (userAnswers[q.id] === q.correct_option) {
        correct++;
      }
    });
    return correct;
  };

  if (selectedTest && selectedTest.questions && selectedTest.questions.length > 0) {
    const score = calculateScore();
    const total = selectedTest.questions.length;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <button
            onClick={handleResetTest}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Артқа
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTest.title}</h2>
          <p className="text-gray-600 mb-4">{selectedTest.description}</p>
          {showResults && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-lg font-semibold text-gray-900">
                Нәтиже: {score} / {total} дұрыс ({Math.round((score / total) * 100)}%)
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {selectedTest.questions.map((question: TestQuestion, qIndex: number) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = userAnswer === question.correct_option;

            return (
              <div key={question.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start space-x-3 mb-4">
                  <span className="bg-blue-100 text-blue-700 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {qIndex + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>

                    <div className="space-y-2">
                      {question.options.map((option: string, oIndex: number) => {
                        const isSelected = userAnswer === oIndex;
                        const isCorrectOption = oIndex === question.correct_option;

                        let bgClass = 'bg-gray-50 hover:bg-gray-100';
                        let borderClass = 'border-gray-200';
                        let iconElement = null;

                        if (showResults) {
                          if (isCorrectOption) {
                            bgClass = 'bg-green-50';
                            borderClass = 'border-green-500';
                            iconElement = <CheckCircle className="w-5 h-5 text-green-600" />;
                          } else if (isSelected && !isCorrect) {
                            bgClass = 'bg-red-50';
                            borderClass = 'border-red-500';
                            iconElement = <XCircle className="w-5 h-5 text-red-600" />;
                          }
                        } else if (isSelected) {
                          bgClass = 'bg-blue-50';
                          borderClass = 'border-blue-500';
                        }

                        return (
                          <button
                            key={oIndex}
                            onClick={() => !showResults && handleSelectAnswer(question.id, oIndex)}
                            disabled={showResults}
                            className={`w-full text-left p-4 rounded-lg border-2 ${bgClass} ${borderClass} transition-all duration-200 flex items-center space-x-3`}
                          >
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => {}}
                              disabled={showResults}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="flex-1 text-gray-900">{option}</span>
                            {iconElement}
                          </button>
                        );
                      })}
                    </div>

                    {sanitizeUrl(question.additional_materials_link) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <a
                          href={sanitizeUrl(question.additional_materials_link)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Book className="w-4 h-4" />
                          <span>Қосымша материалдар</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!showResults ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <button
              onClick={handleSubmitTest}
              disabled={Object.keys(userAnswers).length !== selectedTest.questions.length}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Тестті аяқтау
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">
              Жауап берілді: {Object.keys(userAnswers).length} / {selectedTest.questions.length}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <button
              onClick={handleResetTest}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium shadow-md"
            >
              Басқа тестті таңдау
            </button>
          </div>
        )}
      </div>
    );
  }

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

      <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200 max-w-2xl mx-auto">
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
          Зертханалық жұмыс тесттері
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'games'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Ойындар
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
        {activeTab === 'games' ? (
          games.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              Ойындар жоқ
            </div>
          ) : (
            games.map((game) => (
              <div
                key={game.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Gamepad2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{game.title}</h3>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>

                {sanitizeUrl(game.link) && (
                  <a
                    href={sanitizeUrl(game.link)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Ойнау</span>
                  </a>
                )}
              </div>
            ))
          )
        ) : filteredTests.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchQuery ? 'Тест табылмады' : 'Тесттер жоқ'}
          </div>
        ) : (
          filteredTests.map((test) => {
            const Icon = getTestIcon(test.type);
            const hasLink = !!sanitizeUrl(test.url);
            const hasQuestions = test.questions && test.questions.length > 0;

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
                    {hasQuestions && (
                      <p className="text-sm text-blue-600 font-medium">{test.questions.length} сұрақ</p>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>

                {test.type === 'handwritten' && test.content && !hasQuestions && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{test.content}</p>
                  </div>
                )}

                {hasQuestions ? (
                  <button
                    onClick={() => setSelectedTest(test)}
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Тестті бастау</span>
                  </button>
                ) : hasLink ? (
                  <a
                    href={sanitizeUrl(test.url)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{test.type === 'link' ? 'Тестті ашу' : 'Файлды көру'}</span>
                  </a>
                ) : (
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
