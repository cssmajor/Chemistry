import React, { useState, useEffect } from 'react';
import { Atom, BookOpen, FileText, Mail, Menu, X, Video, Shield, Briefcase, Moon, Sun } from 'lucide-react';
import { Section } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  onAdminClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentSection, onSectionChange, onAdminClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navItems = [
    { key: 'home' as Section, label: 'Басты бет', icon: Atom },
    { key: 'materials' as Section, label: 'Материалдар', icon: BookOpen },
    { key: 'videos' as Section, label: 'Видеолар', icon: Video },
    { key: 'cases' as Section, label: 'Жобалар', icon: Briefcase },
    { key: 'tests' as Section, label: 'Тесттер мен Викториналар', icon: FileText },
    { key: 'contact' as Section, label: 'Байланыс', icon: Mail },
  ];

  const handleNavClick = (section: Section) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Atomic Ecosystem Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900"></div>
        
        {/* Floating Atoms with Electron Flows */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <div className="relative">
              {/* Nucleus */}
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse"></div>
              {/* Electron Orbits */}
              <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-blue-400/40 rounded-full animate-electronOrbit" style={{ transform: 'translate(-50%, -50%)', animationDuration: '4s' }}>
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 shadow-lg"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 w-12 h-12 border border-green-400/40 rounded-full animate-electronOrbit" style={{ transform: 'translate(-50%, -50%) rotate(60deg)', animationDuration: '3s', animationDirection: 'reverse' }}>
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-green-400 rounded-full transform -translate-x-1/2 shadow-lg"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 w-8 h-8 border border-teal-400/40 rounded-full animate-electronOrbit" style={{ transform: 'translate(-50%, -50%) rotate(120deg)', animationDuration: '2s' }}>
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-teal-400 rounded-full transform -translate-x-1/2 shadow-lg"></div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Electron Flow Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <linearGradient id="electronFlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="electronFlow2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d={`M${Math.random() * 100},${Math.random() * 100} Q${Math.random() * 100},${Math.random() * 100} ${Math.random() * 100},${Math.random() * 100}`}
              stroke={i % 2 === 0 ? "url(#electronFlow1)" : "url(#electronFlow2)"}
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.5}s`, animationDuration: '3s' }}
            />
          ))}
        </svg>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-white/95 via-blue-50/90 to-green-50/95 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 backdrop-blur-sm">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg z-50 border-b border-white/20 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 p-2 rounded-full shadow-lg">
                  <Atom className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-heading)' }}>Нұрзипа Химия</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Интерактивті оқыту платформасы</p>
                </div>
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNavClick(item.key)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 font-medium text-sm ${
                        currentSection === item.key
                          ? 'bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 hover:scale-105 transition-all duration-300"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                {onAdminClick && (
                  <button
                    onClick={onAdminClick}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105 font-medium shadow-lg border border-gray-600 text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Әкімші</span>
                  </button>
                )}
              </nav>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 hover:scale-105"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className={`xl:hidden transition-all duration-300 overflow-hidden ${
              isMobileMenuOpen ? 'max-h-[28rem] pb-4' : 'max-h-0'
            }`}>
              <nav className="grid grid-cols-1 gap-2 dark:bg-gray-900">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNavClick(item.key)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium ${
                        currentSection === item.key
                          ? 'bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                {onAdminClick && (
                  <button
                    onClick={() => {
                      onAdminClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black transition-all duration-300 hover:scale-105 font-medium shadow-md border border-gray-600"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Әкімші панелі</span>
                  </button>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:bg-gray-950 text-white py-8 mt-16 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 p-2 rounded-full shadow-lg">
                  <Atom className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Нұрзипа Химия Платформасы</h3>
              </div>
              <p className="text-sm text-gray-400">© 2025 Химия орталығы. Барлық құқықтар қорғалған.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;