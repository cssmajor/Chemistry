import React, { useState } from 'react';
import { Clock, Award, CheckCircle, XCircle, RotateCcw, History, TrendingUp, Target, Play, Plus, CreditCard as Edit, Save, Trash2, FileText, Link, Upload } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  chapter: string;
  duration: number;
  questions: Question[];
  difficulty: 'Оңай' | 'Орташа' | 'Қиын';
}

interface TestHistory {
  id: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
  answers: (string | number)[];
  questions: Question[];
}

interface CustomTest {
  id: number;
  title: string;
  description: string;
  type: 'handwritten' | 'link';
  content?: string;
  url?: string;
  chapter: string;
  uploadDate: string;
  isEditing?: boolean;
}

interface TestsQuizzesProps {
  testHistory: TestHistory[];
  onTestComplete: (result: TestHistory) => void;
}

const TestsQuizzes: React.FC<TestsQuizzesProps> = ({ testHistory, onTestComplete }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | number)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showHistory, setShowHistory] = useState(false);
  const [customTests, setCustomTests] = useState<CustomTest[]>([]);
  const [showAddTest, setShowAddTest] = useState(false);
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    type: 'handwritten' as 'handwritten' | 'link',
    content: '',
    url: '',
    chapter: '1-тарау: Негізгі ұғымдар'
  });

  // Initialize with sample custom tests if empty
  React.useEffect(() => {
    if (customTests.length === 0) {
      const sampleTests: CustomTest[] = [
        {
          id: 1,
          title: 'Химияның негізгі ұғымдары бойынша тест',
          description: 'Атомдар, молекулалар, химиялық элементтер туралы негізгі сұрақтар',
          type: 'handwritten',
          content: '1. Алтынның химиялық белгісі қандай?\n2. Көміртек атомында неше протон бар?\n3. Заттың үш негізгі күйін атаңыз.',
          chapter: '1-тарау: Негізгі ұғымдар',
          uploadDate: '2024-01-15'
        },
        {
          id: 2,
          title: 'Атом құрылысы - Google Forms тесті',
          description: 'Электрон конфигурациясы мен атом құрылысы бойынша интерактивті тест',
          type: 'link',
          url: 'https://forms.google.com/atomic-structure-test',
          chapter: '2-тарау: Атом құрылысы',
          uploadDate: '2024-01-20'
        },
        {
          id: 3,
          title: 'Химиялық байланыс түрлері',
          description: 'Ионды, коваленттік және металдық байланыстар туралы тест',
          type: 'handwritten',
          content: '1. Ионды байланыс қалай түзіледі?\n2. Коваленттік байланыстың ерекшеліктері\n3. Металдық байланыстың қасиеттері',
          chapter: '3-тарау: Химиялық байланыс',
          uploadDate: '2024-01-25'
        },
        {
          id: 4,
          title: 'Химиялық реакциялар - Онлайн викторина',
          description: 'Реакция түрлері мен теңдеулерді теңестіру бойынша тест',
          type: 'link',
          url: 'https://kahoot.it/chemical-reactions-quiz',
          chapter: '4-тарау: Химиялық реакциялар',
          uploadDate: '2024-02-01'
        },
        {
          id: 5,
          title: 'Қышқылдар мен негіздер тесті',
          description: 'pH, қышқылдық-негіздік қасиеттер туралы жазбаша тест',
          type: 'handwritten',
          content: '1. pH шкаласы қандай мәндерді қамтиды?\n2. Күшті қышқылдарға мысал келтіріңіз\n3. Нейтралдау реакциясының теңдеуін жазыңыз',
          chapter: '5-тарау: Қышқылдар мен негіздер',
          uploadDate: '2024-02-05'
        },
        {
          id: 6,
          title: 'Органикалық химия - Quizizz тесті',
          description: 'Органикалық қосылыстардың класстары мен қасиеттері',
          type: 'link',
          url: 'https://quizizz.com/organic-chemistry-basics',
          chapter: '6-тарау: Органикалық химия',
          uploadDate: '2024-02-10'
        },
        {
          id: 7,
          title: 'Периодтық кесте бойынша тест',
          description: 'Элементтердің орналасуы мен қасиеттері туралы сұрақтар',
          type: 'handwritten',
          content: '1. Периодтық кестедегі топтар мен периодтар дегеніміз не?\n2. Металдар мен металл емес заттардың орналасуы\n3. Асыл газдардың ерекшеліктері',
          chapter: '1-тарау: Негізгі ұғымдар',
          uploadDate: '2024-02-15'
        },
        {
          id: 8,
          title: 'Зертханалық қауіпсіздік - Google Forms',
          description: 'Зертханада жұмыс істеу ережелері мен қауіпсіздік шаралары',
          type: 'link',
          url: 'https://forms.google.com/lab-safety-test',
          chapter: '1-тарау: Негізгі ұғымдар',
          uploadDate: '2024-02-20'
        },
        {
          id: 9,
          title: 'Химиялық есептеулер тесті',
          description: 'Молярлық масса, концентрация және стехиометрия есептеулері',
          type: 'handwritten',
          content: '1. 2 моль NaCl-дің массасын есептеңіз\n2. 0.5 М ерітіндінің концентрациясын табыңыз\n3. CaCO3 → CaO + CO2 реакциясын теңестіріңіз',
          chapter: '4-тарау: Химиялық реакциялар',
          uploadDate: '2024-02-25'
        },
        {
          id: 10,
          title: 'Жалпы химия - Аралас емтихан',
          description: 'Барлық тақырыптар бойынша кешенді тест (Mentimeter)',
          type: 'link',
          url: 'https://mentimeter.com/general-chemistry-exam',
          chapter: '1-тарау: Негізгі ұғымдар',
          uploadDate: '2024-03-01'
        }
      ];
      setCustomTests(sampleTests);
    }
  }, [customTests.length]);

  const quizzes: Quiz[] = [
    {
      id: 1,
      title: 'Негізгі химия ұғымдары',
      description: 'Химияның іргелі принциптерін түсінуіңізді тексеріңіз.',
      chapter: '1-тарау',
      duration: 15,
      difficulty: 'Оңай',
      questions: [
        {
          id: 1,
          question: 'Алтынның химиялық белгісі қандай?',
          type: 'multiple-choice',
          options: ['Go', 'Au', 'Ag', 'Gd'],
          correctAnswer: 1,
          explanation: 'Au латын тілінен "aurum" сөзінен шыққан, яғни алтын дегенді білдіреді.'
        },
        {
          id: 2,
          question: 'Көміртек атомында неше протон бар?',
          type: 'short-answer',
          correctAnswer: '6',
          explanation: 'Көміртектің атомдық нөмірі 6, яғни онда 6 протон бар.'
        },
        {
          id: 3,
          question: 'Төмендегілердің қайсысы заттың күйі ЕМЕС?',
          type: 'multiple-choice',
          options: ['Қатты', 'Сұйық', 'Газ', 'Энергия'],
          correctAnswer: 3,
          explanation: 'Энергия заттың күйі емес. Негізгі күйлер: қатты, сұйық, газ және плазма.'
        }
      ]
    },
    {
      id: 2,
      title: 'Атом құрылысы сауалнамасы',
      description: 'Атом құрылысы мен электрон конфигурациясы сұрақтарымен өзіңізді сынаңыз.',
      chapter: '2-тарау',
      duration: 20,
      difficulty: 'Орташа',
      questions: [
        {
          id: 1,
          question: 'Екінші энергия деңгейіндегі электрондардың максималды саны қанша?',
          type: 'multiple-choice',
          options: ['2', '8', '18', '32'],
          correctAnswer: 1,
          explanation: 'Екінші энергия деңгейі (n=2) максимум 8 электронды сақтай алады.'
        },
        {
          id: 2,
          question: 'Оттегінің (атомдық нөмірі 8) электрон конфигурациясын жазыңыз.',
          type: 'short-answer',
          correctAnswer: '1s2 2s2 2p4',
          explanation: 'Оттегінде 8 электрон бар: 1s-те 2, 2s-те 2, және 2p орбитальдарында 4.'
        }
      ]
    },
    {
      id: 3,
      title: 'Химиялық байланыс жетілдірілген',
      description: 'Химиялық байланыс пен молекулалық геометриядағы жетілдірілген ұғымдар.',
      chapter: '3-тарау',
      duration: 25,
      difficulty: 'Қиын',
      questions: [
        {
          id: 1,
          question: 'Метанның (CH₄) молекулалық геометриясы қандай?',
          type: 'multiple-choice',
          options: ['Сызықтық', 'Үшбұрышты жазық', 'Тетраэдрлік', 'Сегізбетті'],
          correctAnswer: 2,
          explanation: 'Метан төрт байланыстырушы жұп және жалғыз жұптардың болмауына байланысты тетраэдрлік геометрияға ие.'
        }
      ]
    }
  ];

  const chapters = [
    '1-тарау: Негізгі ұғымдар',
    '2-тарау: Атом құрылысы',
    '3-тарау: Химиялық байланыс',
    '4-тарау: Химиялық реакциялар',
    '5-тарау: Қышқылдар мен негіздер',
    '6-тарау: Органикалық химия'
  ];

  const addCustomTest = () => {
    if (newTest.title && (newTest.content || newTest.url)) {
      const test: CustomTest = {
        id: Date.now(),
        title: newTest.title,
        description: newTest.description,
        type: newTest.type,
        content: newTest.type === 'handwritten' ? newTest.content : undefined,
        url: newTest.type === 'link' ? newTest.url : undefined,
        chapter: newTest.chapter,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setCustomTests(prev => [test, ...prev]);
      setNewTest({
        title: '',
        description: '',
        type: 'handwritten',
        content: '',
        url: '',
        chapter: '1-тарау: Негізгі ұғымдар'
      });
      setShowAddTest(false);
    }
  };

  const editCustomTest = (id: number) => {
    setCustomTests(prev => prev.map(test => 
      test.id === id ? { ...test, isEditing: true } : test
    ));
  };

  const saveCustomTest = (id: number, updatedTest: Partial<CustomTest>) => {
    setCustomTests(prev => prev.map(test => 
      test.id === id ? { ...test, ...updatedTest, isEditing: false } : test
    ));
  };

  const deleteCustomTest = (id: number) => {
    setCustomTests(prev => prev.filter(test => test.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setNewTest(prev => ({ 
          ...prev, 
          content,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "")
        }));
      };
      reader.readAsText(file);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(quiz.questions.length).fill(''));
    setShowResults(false);
    setTimeRemaining(quiz.duration * 60);
    
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = () => {
    if (!selectedQuiz) return;
    
    const score = calculateScore();
    const testResult: TestHistory = {
      id: Date.now().toString(),
      quizTitle: selectedQuiz.title,
      score,
      totalQuestions: selectedQuiz.questions.length,
      date: new Date().toISOString().split('T')[0],
      answers: userAnswers,
      questions: selectedQuiz.questions
    };
    
    onTestComplete(testResult);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setTimeRemaining(0);
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    let correct = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer || 
          userAnswers[index]?.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase()) {
        correct++;
      }
    });
    return Math.round((correct / selectedQuiz.questions.length) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Оңай':
        return 'bg-green-100 text-green-700';
      case 'Орташа':
        return 'bg-yellow-100 text-yellow-700';
      case 'Қиын':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAverageScore = () => {
    if (testHistory.length === 0) return 0;
    return Math.round(testHistory.reduce((sum, test) => sum + test.score, 0) / testHistory.length);
  };

  if (showHistory) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Тест тарихы</h1>
            <p className="text-lg text-gray-600">Сіздің алдыңғы тест нәтижелеріңіз</p>
          </div>
          <button
            onClick={() => setShowHistory(false)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Тесттерге оралу
          </button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{testHistory.length}</div>
                <div className="text-sm text-gray-600">Жалпы тесттер</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{getAverageScore()}%</div>
                <div className="text-sm text-gray-600">Орташа ұпай</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {testHistory.length > 0 ? Math.max(...testHistory.map(t => t.score)) : 0}%
                </div>
                <div className="text-sm text-gray-600">Ең жақсы ұпай</div>
              </div>
            </div>
          </div>
        </div>

        {/* Test History List */}
        <div className="space-y-4">
          {testHistory.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg">
              <p className="text-gray-500 text-lg">Әлі ешқандай тест тапсырмағансыз.</p>
            </div>
          ) : (
            testHistory.map((test) => (
              <div key={test.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.quizTitle}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Күні: {test.date}</span>
                      <span>Сұрақтар: {test.totalQuestions}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      test.score >= 80 ? 'text-green-600' : 
                      test.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {test.score}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {test.score >= 70 ? 'Өтті' : 'Өте алмады'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (selectedQuiz && !showResults) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{selectedQuiz.title}</h1>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeRemaining > 300 ? 'bg-green-100 text-green-700' :
                timeRemaining > 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                <Clock className="w-4 h-4 inline mr-1" />
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={resetQuiz}
                className="text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Сұрақ {currentQuestionIndex + 1} / {selectedQuiz.questions.length}</span>
              <span>{Math.round(progress)}% аяқталды</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          {currentQuestion.type === 'multiple-choice' ? (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200 transform hover:scale-105">
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={userAnswers[currentQuestionIndex] === index}
                    onChange={() => handleAnswer(index)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={userAnswers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Жауабыңызды мұнда енгізіңіз..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            Алдыңғы
          </button>
          
          {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
            >
              Сауалнаманы тапсыру
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Келесі
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showResults && selectedQuiz) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <div className={`rounded-xl p-8 shadow-lg text-center transition-all duration-300 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-green-600' : 'bg-red-600'}`}>
            {passed ? <CheckCircle className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Сауалнама аяқталды!</h1>
          <p className={`text-lg ${passed ? 'text-green-700' : 'text-red-700'}`}>
            Сіз {score}% ұпай жинадыңыз ({passed ? 'Өттіңіз' : 'Өте алмадыңыз'})
          </p>
        </div>

        {/* Detailed Results */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Жауаптарды қарау</h2>
          <div className="space-y-6">
            {selectedQuiz.questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer || 
                               userAnswer?.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase();
              
              return (
                <div key={index} className={`p-4 rounded-lg border transition-all duration-200 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start space-x-3 mb-3">
                    {isCorrect ? 
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" /> : 
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    }
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                      <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        Сіздің жауабыңыз: {question.type === 'multiple-choice' && typeof userAnswer === 'number' ? 
                          question.options?.[userAnswer] : userAnswer || 'Жауап жоқ'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-600 mt-1">
                          Дұрыс жауап: {question.type === 'multiple-choice' && typeof question.correctAnswer === 'number' ? 
                            question.options?.[question.correctAnswer] : question.correctAnswer}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-2 italic">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => startQuiz(selectedQuiz)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Сауалнаманы қайталау</span>
          </button>
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            Сауалнамаларға оралу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Тесттер мен Викториналар
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Интерактивті сауалнамалар мен жаттығу емтихандары арқылы білімдеріңізді тексеріңіз. Лезде кері байланыс алыңыз және прогрессіңізді қадағалаңыз.
        </p>
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center space-x-2 mx-auto bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          <History className="w-5 h-5" />
          <span>Тест тарихын көру</span>
        </button>
      </div>

      {/* Quiz Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{quiz.duration} минут</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>{quiz.questions.length} сұрақ</span>
              </div>
              <div className="text-sm text-gray-600">
                Тарау: {quiz.chapter}
              </div>
            </div>
            
            <button
              onClick={() => startQuiz(quiz)}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-medium"
            >
              <Play className="w-5 h-5" />
              <span>Сауалнаманы бастау</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add Custom Test Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Жеке тесттер</h2>
          <button
            onClick={() => setShowAddTest(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Тест қосу</span>
          </button>
        </div>

        {/* Add Test Form */}
        {showAddTest && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Жаңа тест қосу</h3>
            
            {/* Test Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Тест түрі</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="handwritten"
                    checked={newTest.type === 'handwritten'}
                    onChange={(e) => setNewTest(prev => ({ ...prev, type: e.target.value as 'handwritten' | 'link' }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>Қолжазба/Файл</span>
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="link"
                    checked={newTest.type === 'link'}
                    onChange={(e) => setNewTest(prev => ({ ...prev, type: e.target.value as 'handwritten' | 'link' }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="flex items-center space-x-1">
                    <Link className="w-4 h-4" />
                    <span>Сілтеме</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тест атауы</label>
                <input
                  type="text"
                  value={newTest.title}
                  onChange={(e) => setNewTest(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Тест атауын енгізіңіз"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тарау</label>
                <select
                  value={newTest.chapter}
                  onChange={(e) => setNewTest(prev => ({ ...prev, chapter: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {chapters.map(chapter => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сипаттама</label>
              <textarea
                value={newTest.description}
                onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Тест туралы қысқаша сипаттама"
              />
            </div>

            {newTest.type === 'handwritten' ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тест мәтіні</label>
                  <textarea
                    value={newTest.content}
                    onChange={(e) => setNewTest(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    placeholder="Тест сұрақтарын мұнда жазыңыз немесе файл жүктеңіз"
                  />
                </div>
                <div>
                  <label className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Файл жүктеу</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".txt,.doc,.docx,.pdf"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Тест сілтемесі</label>
                <input
                  type="url"
                  value={newTest.url}
                  onChange={(e) => setNewTest(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://forms.google.com/..."
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTest(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Бас тарту
              </button>
              <button
                onClick={addCustomTest}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Сақтау
              </button>
            </div>
          </div>
        )}

        {/* Custom Tests List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customTests.map((test) => (
            <CustomTestCard
              key={test.id}
              test={test}
              chapters={chapters}
              onEdit={() => editCustomTest(test.id)}
              onSave={(updatedTest) => saveCustomTest(test.id, updatedTest)}
              onDelete={() => deleteCustomTest(test.id)}
            />
          ))}
        </div>
      </div>

      {/* Past Tests Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Өткен тест парақтары</h2>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <p className="text-gray-600 mb-4">Дайындалуға көмектесу үшін алдыңғы тест парақтары мен шешімдерге қол жеткізіңіз.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Аралық емтихан 2024', 'Қорытынды емтихан 2024', 'Кенеттен сауалнама жинағы'].map((test, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 transform hover:scale-105">
                <h4 className="font-medium text-gray-900 mb-2">{test}</h4>
                <p className="text-sm text-gray-600 mb-3">Сұрақтар мен шешімдерді қамтиды</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  PDF жүктеп алу
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CustomTestCardProps {
  test: CustomTest;
  chapters: string[];
  onEdit: () => void;
  onSave: (updatedTest: Partial<CustomTest>) => void;
  onDelete: () => void;
}

const CustomTestCard: React.FC<CustomTestCardProps> = ({ test, chapters, onEdit, onSave, onDelete }) => {
  const [editData, setEditData] = useState({
    title: test.title,
    description: test.description,
    content: test.content || '',
    url: test.url || '',
    chapter: test.chapter
  });

  const handleSave = () => {
    onSave({
      title: editData.title,
      description: editData.description,
      content: test.type === 'handwritten' ? editData.content : undefined,
      url: test.type === 'link' ? editData.url : undefined,
      chapter: editData.chapter
    });
  };

  if (test.isEditing) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Тест атауы"
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
          {test.type === 'handwritten' ? (
            <textarea
              value={editData.content}
              onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={4}
              placeholder="Тест мәтіні"
            />
          ) : (
            <input
              type="url"
              value={editData.url}
              onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Тест сілтемесі"
            />
          )}
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
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
        <div className="flex items-center space-x-1">
          {test.type === 'handwritten' ? (
            <FileText className="w-4 h-4 text-blue-600" />
          ) : (
            <Link className="w-4 h-4 text-green-600" />
          )}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{test.description}</p>
      
      <div className="text-xs text-gray-500 mb-4">
        <div className="bg-gray-100 px-2 py-1 rounded inline-block mb-1">{test.chapter}</div>
        <div>Қосылған: {test.uploadDate}</div>
      </div>

      <div className="flex justify-between items-center">
        {test.type === 'link' && test.url ? (
          <a
            href={test.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Link className="w-4 h-4" />
            <span>Тестті ашу</span>
          </a>
        ) : (
          <span className="text-sm text-gray-500">Қолжазба тест</span>
        )}
        
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
  );
};

export default TestsQuizzes;