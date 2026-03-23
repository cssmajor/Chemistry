import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ExternalLink, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Электрондық пошта',
      value: 'nurzipa.torebek@mail.ru',
      link: 'nurzipa.torebek@mail.ru'
    },
    {
      icon: Phone,
      label: 'Телефон',
      value: '+7 777 494 8702',
      link: 'tel:+77774948702'
    },
    {
      icon: Clock,
      label: 'Байланыста',
      value: 'Дүй-Жұм: 10:00-18:00',
      link: null
    }
  ];

  const socialLinks = [
    {
      name: 'WhatsApp',
      url: 'https://wa.me/77774948702',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 rounded-2xl p-12 text-center">
          <div className="bg-green-600 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-4">Хабарлама сәтті жіберілді!</h1>
          <p className="text-lg text-green-700 mb-6">
            Хабарласқаныңыз үшін рахмет. Мен сізге мүмкіндігінше тезірек, әдетте 24 сағат ішінде жауап беремін.
          </p>
          <p className="text-green-600">
            Сізді байланыс формасына қайта бағыттап жатырмыз...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Байланыс
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Химия ұғымдары туралы сұрақтарыңыз бар ма, үй тапсырмасына көмек керек пе, немесе прогрессіңізді талқылағыңыз келе ме? Мен көмектесуге дайынмын!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Байланыс ақпараты</h2>
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const content = (
                  <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{info.label}</div>
                      <div className="text-gray-600 text-sm">{info.value}</div>
                    </div>
                  </div>
                );

                return info.link ? (
                  <a key={index} href={info.link} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={index}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Office Hours */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Көмекке дайын</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Дүйсенбі - Жұма</span>
                <span>10:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Келісім бойынша</span>
                <span>Икемді</span>
              </div>
              <div className="border-t border-white/20 pt-3 mt-4">
                <p className="text-blue-100">
                  Қосымша көмек керек болса немесе химия тақырыптарын талқылағыңыз келсе, хабарласуға тартынбаңыз!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Жылдам сілтемелер</h3>
            <div className="space-y-3">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white transition-all duration-300 transform hover:scale-105 ${link.color}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Хабарлама жіберу</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Толық аты-жөні
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Сіздің толық атыңыз"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Электрондық пошта мекен-жайы
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="sizdin.email@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Тақырып
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Тақырыпты таңдаңыз...</option>
                  <option value="homework-help">Үй тапсырмасына көмек</option>
                  <option value="concept-clarification">Ұғымды түсіндіру</option>
                  <option value="extra-credit">Қосымша балл мүмкіндіктері</option>
                  <option value="lab-questions">Зертхана сұрақтары</option>
                  <option value="exam-preparation">Емтиханға дайындық</option>
                  <option value="general-inquiry">Жалпы сұрақ</option>
                  <option value="other">Басқа</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Хабарлама
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Сұрағыңызды немесе мәселеңізді толық сипаттаңыз..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
                <span>Хабарлама жіберу</span>
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Жауап беру уақыты:</strong> Мен әдетте мектеп күндерінде 24 сағат ішінде хабарламаларға жауап беремін. 
                Шұғыл сұрақтар үшін кеңсе сағаттарында немесе сабақ алдында/кейін маған келіңіз.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Жиі қойылатын сұрақтар</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Қосымша көмекті қалай ала аламын?</h3>
              <p className="text-gray-600 text-sm">
                Желіде болғанда (Дүй-Жұм 10:00-18:00) хабарласыңыз, кездесу тағайындаңыз немесе біздің оқу тобы сессияларына қосылыңыз.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Үй тапсырмасы сұрақтарын электрондық поштамен жібере аламын ба?</h3>
              <p className="text-gray-600 text-sm">
                Иә! Мен студенттерді қиналған кезде хабарласуға шақырамын. Қазіргі жұмысыңызды және нақты сұрақтарды қосыңыз.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Емтихан қайталау сессияларын ұсынасыз ба?</h3>
              <p className="text-gray-600 text-sm">
                Әрине! Мен негізгі емтихандар алдында қайталау сессияларын өткіземін. Күндер мен уақыттар үшін хабарландыруларды тексеріңіз.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Қосымша ресурстарға қалай қол жеткізуге болады?</h3>
              <p className="text-gray-600 text-sm">
                Барлық материалдар Материалдар бөлімінде қолжетімді. Мен сондай-ақ пайдалы онлайн ресурстарға сілтемелер беремін.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ата-аналар сізбен байланыса ала ма?</h3>
              <p className="text-gray-600 text-sm">
                Иә, мен ата-аналардың балаларының прогрессі және кез келген алаңдаушылықтары туралы хабарласуын қарсы аламын.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Сабаққа дайындалудың ең жақсы жолы қандай?</h3>
              <p className="text-gray-600 text-sm">
                Алдыңғы күннің жазбаларын қарап шығыңыз, тапсырылған оқуларды аяқтаңыз және қиын ұғымдар туралы сұрақтармен келіңіз.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;