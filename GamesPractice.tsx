import React, { useState } from 'react';
import { Gamepad2, Target, Zap, Trophy, Play, RotateCcw } from 'lucide-react';

interface Element {
  symbol: string;
  name: string;
  number: number;
  category: string;
}

interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const GamesPractice: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<any>({});

  const elements: Element[] = [
    { symbol: 'H', name: 'Hydrogen', number: 1, category: 'nonmetal' },
    { symbol: 'He', name: 'Helium', number: 2, category: 'noble-gas' },
    { symbol: 'Li', name: 'Lithium', number: 3, category: 'alkali-metal' },
    { symbol: 'C', name: 'Carbon', number: 6, category: 'nonmetal' },
    { symbol: 'N', name: 'Nitrogen', number: 7, category: 'nonmetal' },
    { symbol: 'O', name: 'Oxygen', number: 8, category: 'nonmetal' },
    { symbol: 'Na', name: 'Sodium', number: 11, category: 'alkali-metal' },
    { symbol: 'Mg', name: 'Magnesium', number: 12, category: 'alkaline-earth' },
    { symbol: 'Al', name: 'Aluminum', number: 13, category: 'post-transition' },
    { symbol: 'Si', name: 'Silicon', number: 14, category: 'metalloid' },
    { symbol: 'P', name: 'Phosphorus', number: 15, category: 'nonmetal' },
    { symbol: 'S', name: 'Sulfur', number: 16, category: 'nonmetal' },
    { symbol: 'Cl', name: 'Chlorine', number: 17, category: 'halogen' },
    { symbol: 'Ar', name: 'Argon', number: 18, category: 'noble-gas' },
    { symbol: 'Ca', name: 'Calcium', number: 20, category: 'alkaline-earth' },
    { symbol: 'Fe', name: 'Iron', number: 26, category: 'transition-metal' },
    { symbol: 'Cu', name: 'Copper', number: 29, category: 'transition-metal' },
    { symbol: 'Zn', name: 'Zinc', number: 30, category: 'transition-metal' },
    { symbol: 'Br', name: 'Bromine', number: 35, category: 'halogen' },
    { symbol: 'Ag', name: 'Silver', number: 47, category: 'transition-metal' },
    { symbol: 'I', name: 'Iodine', number: 53, category: 'halogen' },
    { symbol: 'Au', name: 'Gold', number: 79, category: 'transition-metal' }
  ];

  const games: Game[] = [
    {
      id: 'periodic-table',
      title: 'Периодтық кесте сауалнамасы',
      description: 'Элементтер, белгілер және атомдық нөмірлер туралы білімдеріңізді тексеріңіз.',
      difficulty: 'Орташа',
      category: 'Элементтер',
      icon: Target
    },
    {
      id: 'equation-balancing',
      title: 'Теңдеулерді теңестіру',
      description: 'Коэффициенттерді реттеу арқылы химиялық теңдеулерді теңестіріңіз.',
      difficulty: 'Қиын',
      category: 'Реакциялар',
      icon: Zap
    },
    {
      id: 'formula-builder',
      title: 'Формула құрастырушы',
      description: 'Элементтердің комбинациясынан химиялық формулаларды құрастырыңыз.',
      difficulty: 'Оңай',
      category: 'Қосылыстар',
      icon: Gamepad2
    }
  ];

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

  const startGame = (gameId: string) => {
    setActiveGame(gameId);
    setScore(0);
    
    if (gameId === 'periodic-table') {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      setGameState({
        currentElement: randomElement,
        questionType: Math.random() < 0.5 ? 'symbol-to-name' : 'name-to-symbol',
        options: generateOptions(randomElement),
        streak: 0
      });
    } else if (gameId === 'equation-balancing') {
      setGameState({
        equation: 'H₂ + O₂ → H₂O',
        coefficients: [1, 1, 1],
        isBalanced: false
      });
    }
  };

  const generateOptions = (correctElement: Element) => {
    const options = [correctElement];
    while (options.length < 4) {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      if (!options.find(opt => opt.symbol === randomElement.symbol)) {
        options.push(randomElement);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selectedOption: Element, isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 10);
      setGameState({
        ...gameState,
        streak: gameState.streak + 1
      });
    } else {
      setGameState({
        ...gameState,
        streak: 0
      });
    }

    // Generate next question
    setTimeout(() => {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      setGameState({
        currentElement: randomElement,
        questionType: Math.random() < 0.5 ? 'symbol-to-name' : 'name-to-symbol',
        options: generateOptions(randomElement),
        streak: gameState.streak
      });
    }, 1500);
  };

  const resetGame = () => {
    setActiveGame(null);
    setScore(0);
    setGameState({});
  };

  if (activeGame === 'periodic-table' && gameState.currentElement) {
    const isSymbolToName = gameState.questionType === 'symbol-to-name';
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Периодтық кесте сауалнамасы</h1>
              <p className="text-gray-600">Ұпай: {score} | Қатар: {gameState.streak}</p>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Артқа</span>
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg text-center">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isSymbolToName 
                ? `"${gameState.currentElement.symbol}" белгісі қай элементке тиесілі?`
                : `${gameState.currentElement.name} элементінің белгісі қандай?`
              }
            </h2>
            
            {!isSymbolToName && (
              <div className="bg-blue-100 text-blue-800 text-4xl font-bold w-24 h-24 rounded-lg mx-auto flex items-center justify-center mb-6">
                {gameState.currentElement.symbol}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {gameState.options.map((option: Element, index: number) => {
              const isCorrect = option.symbol === gameState.currentElement.symbol;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option, isCorrect)}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center"
                >
                  <div className="text-lg font-semibold text-gray-900">
                    {isSymbolToName ? option.name : option.symbol}
                  </div>
                  {isSymbolToName && (
                    <div className="text-sm text-gray-600 mt-1">
                      Атомдық №: {option.number}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (activeGame === 'equation-balancing') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Теңдеулерді теңестіру</h1>
              <p className="text-gray-600">Химиялық теңдеуді теңестіріңіз</p>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Артқа</span>
            </button>
          </div>
        </div>

        {/* Equation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Бұл теңдеуді теңестіріңіз:</h2>
            
            <div className="flex items-center justify-center space-x-4 text-2xl mb-8">
              <input 
                type="number" 
                min="1" 
                max="10" 
                defaultValue="1"
                className="w-12 h-12 border border-gray-300 rounded text-center font-bold"
              />
              <span>H₂ +</span>
              <input 
                type="number" 
                min="1" 
                max="10" 
                defaultValue="1"
                className="w-12 h-12 border border-gray-300 rounded text-center font-bold"
              />
              <span>O₂ →</span>
              <input 
                type="number" 
                min="1" 
                max="10" 
                defaultValue="1"
                className="w-12 h-12 border border-gray-300 rounded text-center font-bold"
              />
              <span>H₂O</span>
            </div>

            <div className="space-y-4">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Теңестіруді тексеру
              </button>
              <div className="text-sm text-gray-600">
                Кеңес: Дұрыс жауап 2H₂ + O₂ → 2H₂O
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Ойындар мен жаттығулар
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Интерактивті ойындар мен сын-тегеуріндер арқылы химияны үйреніңіз. Білім мен дағдыларыңызды дамыта отырып, оқуды қызықты етіңіз.
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div key={game.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{game.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{game.category}</span>
                    <button
                      onClick={() => startGame(game.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Ойнау</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Periodic Table Preview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Интерактивті периодтық кесте</h2>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 mb-6">Элементтер туралы көбірек білу үшін оларды басыңыз. Бұл шағын нұсқа кейбір жалпы элементтерді көрсетеді:</p>
          
          <div className="grid grid-cols-6 md:grid-cols-11 gap-2 max-w-4xl">
            {elements.slice(0, 22).map((element) => {
              const getCategoryColor = (category: string) => {
                switch (category) {
                  case 'nonmetal':
                    return 'bg-green-100 hover:bg-green-200 text-green-800';
                  case 'alkali-metal':
                    return 'bg-red-100 hover:bg-red-200 text-red-800';
                  case 'alkaline-earth':
                    return 'bg-orange-100 hover:bg-orange-200 text-orange-800';
                  case 'transition-metal':
                    return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
                  case 'noble-gas':
                    return 'bg-purple-100 hover:bg-purple-200 text-purple-800';
                  case 'halogen':
                    return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
                  case 'metalloid':
                    return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
                  default:
                    return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
                }
              };

              return (
                <button
                  key={element.symbol}
                  className={`p-2 rounded-lg border border-gray-300 transition-colors text-center ${getCategoryColor(element.category)}`}
                  title={`${element.name} (${element.number})`}
                >
                  <div className="font-bold text-sm">{element.symbol}</div>
                  <div className="text-xs">{element.number}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Түс дәстүрі:</strong></p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 rounded border"></div>
                <span>Металл емес</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 rounded border"></div>
                <span>Сілтілік металдар</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 rounded border"></div>
                <span>Ауысу металдары</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-100 rounded border"></div>
                <span>Асыл газдар</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <Trophy className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Жетістіктер</h2>
        </div>
        <p className="text-yellow-100 mb-4">Прогрессіңізді қадағалаңыз және химия ұғымдарын меңгере отырып жетістіктерді ашыңыз!</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="font-semibold mb-1">Элемент зерттеушісі</h3>
            <p className="text-sm text-yellow-100">25 элементті үйреніңіз</p>
            <div className="mt-2 bg-white/30 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="font-semibold mb-1">Теңдеу шебері</h3>
            <p className="text-sm text-yellow-100">10 теңдеуді теңестіріңіз</p>
            <div className="mt-2 bg-white/30 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: '30%' }}></div>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="font-semibold mb-1">Жылдамдық шайтаны</h3>
            <p className="text-sm text-yellow-100">Сауалнаманы 5 минуттан аз уақытта аяқтаңыз</p>
            <div className="mt-2 bg-white/30 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPractice;