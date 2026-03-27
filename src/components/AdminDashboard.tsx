import React, { useState } from 'react';
import { LogOut, BookOpen, Video, FileText, BarChart, Briefcase, Gamepad2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminMaterials from './admin/AdminMaterials';
import AdminVideos from './admin/AdminVideos';
import AdminTests from './admin/AdminTests';
import AdminCases from './admin/AdminCases';
import AdminGames from './admin/AdminGames';
import AdminStats from './admin/AdminStats';

type AdminSection = 'materials' | 'videos' | 'tests' | 'cases' | 'games' | 'stats';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('materials');
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      alert('Шығу кезінде қате орын алды.');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'materials':
        return <AdminMaterials />;
      case 'videos':
        return <AdminVideos />;
      case 'tests':
        return <AdminTests />;
      case 'cases':
        return <AdminCases />;
      case 'games':
        return <AdminGames />;
      case 'stats':
        return <AdminStats />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Әкімші панелі</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Шығу</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <nav className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-2">
              <button
                onClick={() => setActiveSection('materials')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeSection === 'materials'
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Материалдар</span>
              </button>
              <button
                onClick={() => setActiveSection('videos')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeSection === 'videos'
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Video className="w-5 h-5" />
                <span>Видеолар</span>
              </button>
              <button
                onClick={() => setActiveSection('tests')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeSection === 'tests'
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Тесттер</span>
              </button>
              <button
                onClick={() => setActiveSection('cases')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeSection === 'cases'
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span>Жобалар</span>
              </button>
              <button
                onClick={() => setActiveSection('games')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeSection === 'games'
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Ойындар</span>
              </button>
              <button
                onClick={() => setActiveSection('stats')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeSection === 'stats'
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart className="w-5 h-5" />
                <span>Статистика</span>
              </button>
            </nav>
          </aside>

          <main className="lg:col-span-3">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
