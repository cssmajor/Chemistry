import React from 'react';
import { Award, BookOpen, Users, TrendingUp, Beaker, Atom } from 'lucide-react';

interface HomeProps {
  onSectionChange: (section: 'home' | 'materials' | 'videos' | 'tests' | 'contact') => void;
}

const Home: React.FC<HomeProps> = ({ onSectionChange }) => {
  const stats = [
    { icon: Users, label: 'Оқытылған студенттер', value: '200+' },
    { icon: BookOpen, label: 'Жасалған сабақтар', value: '50+' },
    { icon: Award, label: 'Жылдық тәжірибе', value: '5' },
  ];

  const features = [
    {
      title: 'Интерактивті оқыту',
      description: 'Практикалық жұмыстар, симуляциялар және нақты өмірдегі қолданулар арқылы химиямен танысыңыз.',
      icon: Beaker,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Толық материалдар',
      description: 'Химияның әрбір тақырыбы бойынша ұйымдастырылған оқу материалдары, жазбалар және ресурстарға қол жеткізіңіз.',
      icon: BookOpen,
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Жаттығу тесттері',
      description: 'Сауалнамалар мен жаттығу емтихандары арқылы білімдеріңізді тексеріп, лезде кері байланыс алыңыз.',
      icon: Award,
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="relative">
          {/* Teacher Photo Placeholder */}
          <div className="mx-auto w-48 h-48 bg-gradient-to-br from-purple-400 via-blue-500 to-green-400 rounded-full flex items-center justify-center mb-6 shadow-xl relative overflow-hidden">
            <div className="text-6xl font-bold text-white z-10">Н</div>
            {/* Atomic orbital animations */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/30 rounded-full animate-spin" style={{ transform: 'translate(-50%, -50%)', animationDuration: '8s' }}></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/40 rounded-full animate-spin" style={{ transform: 'translate(-50%, -50%) rotate(60deg)', animationDuration: '6s', animationDirection: 'reverse' }}></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white/50 rounded-full animate-spin" style={{ transform: 'translate(-50%, -50%) rotate(120deg)', animationDuration: '4s' }}></div>
            </div>
          </div>
          
          {/* Floating Electrons */}
          <div className="absolute top-0 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute top-8 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300 shadow-lg"></div>
          <div className="absolute bottom-8 left-1/3 w-5 h-5 bg-green-400 rounded-full animate-pulse delay-500 shadow-lg"></div>
          <div className="absolute top-16 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-700 shadow-lg"></div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">Қош келдіңіздер!</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Интербелсенді оқыту платформасына
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Бұл сайт химия пәнінен білім алуға арналған. Есімім Төребек Нұрзипа Бақытбекқызы. 
            Химия пәні мұғалімімін және әрбір студент үшін химияны қолжетімді және қызықты ету менің құштарлығым.
          </p>
        </div>

        {/* Teacher Bio */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <div className="space-y-4 text-left">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Химия мұғалімі туралы</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700 leading-relaxed">
              <div>
                <p className="mb-4">
                  Мен өз мансабымды студенттерге химияның таңғажайып әлемін ашуға көмектесуге арнадым. Менің тәсілім дәстүрлі оқыту әдістерін заманауи, интерактивті техникалармен біріктіріп, күрделі ұғымдарды түсінуге оңай етеді.
                </p>
                <p>
                  Мен әрбір студент дұрыс құралдар, қолдау және жігерлендіру берілгенде химияда жетістікке жете алады деп сенемін. Бұл веб-сайт химияның барлық мәселелері бойынша сіздің бір терезелі ресурсыңыз болуға арналған.
                </p>
              </div>
              <div>
                <p className="mb-4">
                  Менде химия білімі бойынша магистр дәрежесі бар және жетілдірілген оқыту әдістері бойынша тәжірибем бар. Уақыттарымды ғылыми тәжірибелер жүргізуге, соңғы жаңалықтар туралы оқуға және оқытуды қызықты ету жолдарына қолдануды ұнатамын.
                </p>
                <p>
                  Менің мақсатым - келесі ұрпақ ғалымдарын шабыттандыру және барлық студенттерге химия бойынша академиялық мақсаттарына жетуге көмектесу.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform hover:scale-105">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Мұнда не табасыз?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Химияда табысқа жету үшін қажет барлық нәрсе: толық оқу материалдарынан және түрлі пайдалы бейнематериалдар мен жаттығу тесттеріне дейін.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform hover:scale-105">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Платформаның негізгі мүмкіндіктері</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Химияны үйренуді жеңілдететін және тиімді ететін заманауи құралдар мен ресурстар.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Толық материалдар</h3>
            <p className="text-gray-600 text-sm">PDF, Word, PowerPoint және басқа форматтағы оқу материалдары</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Интерактивті тесттер</h3>
            <p className="text-gray-600 text-sm">Білімді тексеру үшін сауалнамалар мен жаттығу тесттері</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin" style={{ animationDuration: '3s' }}>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Прогресс қадағалау</h3>
            <p className="text-gray-600 text-sm">Оқу прогрессіңізді бақылау және жетістіктерді көру</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <Beaker className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Бейне сабақтар</h3>
            <p className="text-gray-600 text-sm">Көрнекі түсіндірмелер мен зертханалық жұмыстар</p>
          </div>
        </div>
      </section>

      {/* Animated orbital rings for the selected element */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/30 rounded-full animate-spin" style={{ transform: 'translate(-50%, -50%)', animationDuration: '8s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/40 rounded-full animate-spin" style={{ transform: 'translate(-50%, -50%) rotate(60deg)', animationDuration: '6s', animationDirection: 'reverse' }}></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white/50 rounded-full animate-spin" style={{ transform: 'translate(-50%, -50%) rotate(120deg)', animationDuration: '4s' }}></div>
      </div>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Оқуды бастауға дайынсыз ба?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Біздің химия пәні бойынша ресурстарымызды зерттеп, осы қызықты пәнді меңгеру жолыңызды бастаңыз.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onSectionChange('materials')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Материалдарды шолу
          </button>
          <button 
            onClick={() => onSectionChange('tests')}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Жаттығу тестін тапсыру
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;