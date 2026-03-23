import React from 'react';
import { Lightbulb, BookOpen, Target, Clock, Brain, Star } from 'lucide-react';

interface Tip {
  id: number;
  title: string;
  description: string;
  category: 'Study Tips' | 'Memory Tricks' | 'Exam Strategy' | 'Lab Safety' | 'Problem Solving';
  icon: React.ComponentType<{ className?: string }>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
}

const TipsTricks: React.FC = () => {
  const tips: Tip[] = [
    {
      id: 1,
      title: 'Мнемоникалық әдіс',
      description: 'Периодтық кесте топтарын есте сақтайтын фразалармен есте сақтаңыз. Мысалы, алғашқы 10 элемент үшін "Сұлу Сара Сүйкімді Бала Болып, Көміртек Көшесінде, Азот Оттегі Фтор Неонмен" сияқты.',
      category: 'Есте сақтау тәсілдері',
      icon: Brain,
      difficulty: 'Бастапқы',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      title: 'Теңдеулерді қадам-қадаммен теңестіру',
      description: 'Әрқашан ең күрделі молекуладан бастап, ең қарапайымға дейін жұмыс жасаңыз. Екі жақтағы атомдарды жүйелі түрде санаңыз.',
      category: 'Есеп шығару',
      icon: Target,
      difficulty: 'Орташа',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Химия үшін белсенді оқу',
      description: 'Тек оқып қана қоймай - құрылымдарды сызыңыз, реакцияларды жазыңыз және ұғымдарды дауыстап түсіндіріңіз. Бұл бірнеше оқу жолдарын қосады.',
      category: 'Оқу кеңестері',
      icon: BookOpen,
      difficulty: 'Бастапқы',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: 'Емтихандарға уақытты басқару',
      description: 'Әрбір көп таңдаулы сұраққа 2 минуттан артық уақыт жұмсамаңыз. Қиын есептерді өткізіп, кейін жаңа көзқараспен оларға оралыңыз.',
      category: 'Емтихан стратегиясы',
      icon: Clock,
      difficulty: 'Орташа',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      title: 'Зертхана қауіпсіздігі бірінші',
      description: 'Әрқашан қауіпсіздік көзілдірігін киіңіз және қауіпсіздік жабдықтарының орналасқан жерін біліңіз. Кез келген тәжірибе бастамас бұрын процедураларды екі рет оқыңыз.',
      category: 'Зертхана қауіпсіздігі',
      icon: Star,
      difficulty: 'Бастапқы',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 6,
      title: 'Электрон конфигурациясын түсіну',
      description: 'Периодтық кестені нұсқаулық ретінде пайдаланыңыз. Период сізге ең жоғары энергия деңгейін айтады, ал топ көбінесе валенттік электрондарды айтады.',
      category: 'Оқу кеңестері',
      icon: Lightbulb,
      difficulty: 'Жетілдірілген',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 7,
      title: 'RICE кесте әдісі',
      description: 'Тепе-теңдік есептері үшін жұмысыңызды жүйелі түрде ұйымдастыру үшін Реакция, Бастапқы, Өзгеріс және Тепе-теңдік кестелерін пайдаланыңыз.',
      category: 'Есеп шығару',
      icon: Target,
      difficulty: 'Жетілдірілген',
      color: 'from-teal-500 to-blue-500'
    },
    {
      id: 8,
      title: 'Флэш-карталардың тиімділігі',
      description: 'Бір жағында формулалар, екінші жағында олардың атаулары/қолданылуы бар флэш-карталар жасаңыз. Оларды жинақтаудың орнына күн сайын 10 минут қарап шығыңыз.',
      category: 'Есте сақтау тәсілдері',
      icon: Brain,
      difficulty: 'Бастапқы',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 9,
      title: 'Льюис құрылымы стратегиясы',
      description: 'Жалпы валенттік электрондарды санаңыз, орталық атомды анықтаңыз (әдетте ең аз электртерістік), және октет ережесін қанағаттандыру үшін электрондарды бөліңіз.',
      category: 'Есеп шығару',
      icon: Target,
      difficulty: 'Орташа',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 10,
      title: 'Ұғымдық картографиялау',
      description: 'Байланысты химия ұғымдарын байланыстыратын көрнекі карталар жасаңыз. Бұл сізге үлкен суретті және тақырыптар арасындағы қатынастарды көруге көмектеседі.',
      category: 'Оқу кеңестері',
      icon: BookOpen,
      difficulty: 'Орташа',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 11,
      title: 'Жаттығу есептерінің стратегиялары',
      description: 'Есептеулерді бастамас бұрын әрқашан не білетініңізді, не табу керектігіңізді және тиісті теңдеулерді жазып алыңыз.',
      category: 'Есеп шығару',
      icon: Target,
      difficulty: 'Бастапқы',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 12,
      title: 'Топтық оқудың пайдасы',
      description: 'Сыныптастарыңызға ұғымдарды түсіндіріңіз - басқаларды оқыту өз түсінігіңізді нығайтудың ең жақсы жолдарының бірі.',
      category: 'Оқу кеңестері',
      icon: BookOpen,
      difficulty: 'Бастапқы',
      color: 'from-green-500 to-lime-500'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Бастапқы':
        return 'bg-green-100 text-green-700';
      case 'Орташа':
        return 'bg-yellow-100 text-yellow-700';
      case 'Жетілдірілген':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Оқу кеңестері':
        return 'bg-blue-100 text-blue-700';
      case 'Есте сақтау тәсілдері':
        return 'bg-purple-100 text-purple-700';
      case 'Емтихан стратегиясы':
        return 'bg-orange-100 text-orange-700';
      case 'Зертхана қауіпсіздігі':
        return 'bg-red-100 text-red-700';
      case 'Есеп шығару':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const categories = Array.from(new Set(tips.map(tip => tip.category)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Кеңестер мен тәсілдер
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Тәжірибелі мұғалімнің дәлелденген оқу стратегиялары, есте сақтау техникалары және есеп шығару тәсілдерімен химияны меңгеріңіз.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${getCategoryColor(category)} hover:opacity-80`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div key={tip.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Card Header with Gradient */}
              <div className={`bg-gradient-to-r ${tip.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-8 h-8" />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20`}>
                    {tip.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-tight">{tip.title}</h3>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(tip.category)}`}>
                    {tip.category}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {tip.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Featured Success Strategies */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Менің топ 5 табыс стратегиям</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Бұл менің 8 жылдық оқыту тәжірибемде студенттерге химияда жетістікке жетуге көмектескен ең тиімді стратегиялар.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              number: '01',
              title: 'Күнделікті жаттығу',
              description: 'Тіпті күнделікті 15 минуттық жаттығу емтихан алдында сағаттап жинақтаудан жақсы.'
            },
            {
              number: '02',
              title: 'Ұғымдарды байланыстыру',
              description: 'Жаңа тақырыптарды білетініңізбен байланыстырыңыз. Химия өзін-өзі дамытады.'
            },
            {
              number: '03',
              title: 'Сұрақ қою',
              description: 'Көмек сұрауға ешқашан тартынбаңыз. Әрбір сұрақ терең түсінуге әкеледі.'
            },
            {
              number: '04',
              title: 'Бірнеше ресурс пайдалану',
              description: 'Толық оқу үшін оқулықтарды, видеоларды және практикалық жаттығуларды біріктіріңіз.'
            },
            {
              number: '05',
              title: 'Ұйымдастырылған болу',
              description: 'Жазбаларды, формулаларды және жаттығу есептерін оңай қарау үшін жақсы ұйымдастырып сақтаңыз.'
            }
          ].map((strategy, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">{strategy.number}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{strategy.title}</h3>
              <p className="text-sm text-blue-100 leading-relaxed">{strategy.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Қосымша оқу ресурстары</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Химия формулалар парағы',
              description: 'Маңызды формулалар мен тұрақтылар бар жүктеп алынатын анықтамалық.',
              icon: BookOpen,
              color: 'bg-blue-100 text-blue-700'
            },
            {
              title: 'Жиі кездесетін қателер нұсқаулығы',
              description: 'Студенттердің жиі жасайтын қателерінен үйреніп, оларды қалай болдырмау керектігін біліңіз.',
              icon: Lightbulb,
              color: 'bg-yellow-100 text-yellow-700'
            },
            {
              title: 'Оқу кестесі үлгісі',
              description: 'Семестр бойы ұйымдастырылған болуға көмектесетін теңшелетін оқу жоспары.',
              icon: Clock,
              color: 'bg-green-100 text-green-700'
            }
          ].map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-lg ${resource.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Ресурсты жүктеп алу →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TipsTricks;