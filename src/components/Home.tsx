import React from 'react';
import { Award, BookOpen, Users, TrendingUp, Beaker } from 'lucide-react';
import { Section } from '../types';

interface HomeProps {
  onSectionChange: (section: Section) => void;
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
      color: 'bg-teal-100 text-teal-700'
    }
  ];

  return (
    <div className="space-y-10">
      <section className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="mx-auto w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-blue-400 via-teal-500 to-green-400 rounded-full flex items-center justify-center shadow-xl relative overflow-hidden">
            <div className="text-5xl font-bold text-white z-10">Н</div>
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 w-28 h-28 border-2 border-white/30 rounded-full animate-spin" style={{ transform: 'translate(-50%, -50%)', animationDuration: '8s' }}></div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white/40 rounded-full animate-spin" style={{ transform: 'translate(-50%, -50%) rotate(60deg)', animationDuration: '6s', animationDirection: 'reverse' }}></div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">Қош келдіңіздер!</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Интербелсенді оқыту платформасына
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Бұл сайт химия пәнінен білім алуға арналған. Есімім Төребек Нұрзипа Бақытбекқызы.
            Химия пәні мұғалімімін және әрбір студент үшін химияны қолжетімді және қызықты ету менің құштарлығым.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">Химия мұғалімі туралы</h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
            <div>
              <p className="mb-3">
                Мен өз мансабымды студенттерге химияның таңғажайып әлемін ашуға көмектесуге арнадым. Менің тәсілім дәстүрлі оқыту әдістерін заманауи, интерактивті техникалармен біріктіріп, күрделі ұғымдарды түсінуге оңай етеді.
              </p>
              <p>
                Мен әрбір студент дұрыс құралдар, қолдау және жігерлендіру берілгенде химияда жетістікке жете алады деп сенемін.
              </p>
            </div>
            <div>
              <p className="mb-3">
                Менде химия білімі бойынша магистр дәрежесі бар және жетілдірілген оқыту әдістері бойынша тәжірибем бар.
              </p>
              <p>
                Менің мақсатым - келесі ұрпақ ғалымдарын шабыттандыру және барлық студенттерге химия бойынша академиялық мақсаттарына жетуге көмектесу.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="flex justify-center">
        <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl w-full">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">Мұнда не табасыз?</h2>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Химияда табысқа жету үшін қажет барлық нәрсе: толық оқу материалдарынан және түрлі пайдалы бейнематериалдар мен жаттығу тесттеріне дейін.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">Платформаның негізгі мүмкіндіктері</h2>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Химияны үйренуді жеңілдететін және тиімді ететін заманауи құралдар мен ресурстар.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Толық материалдар</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">PDF, Word, PowerPoint және басқа форматтағы оқу материалдары</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Интерактивті тесттер</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">Білімді тексеру үшін сауалнамалар мен жаттығу тесттері</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="bg-teal-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Прогресс қадағалау</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">Оқу прогрессіңізді бақылау және жетістіктерді көру</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Beaker className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Бейне сабақтар</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">Көрнекі түсіндірмелер мен зертханалық жұмыстар</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;