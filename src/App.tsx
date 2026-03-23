import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './components/Home';
import MaterialsView from './components/MaterialsView';
import VideosView from './components/VideosView';
import TestsQuizzes from './components/TestsQuizzes';
import Contact from './components/Contact';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Section, TestHistory } from './types';

const AppContent: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleTestComplete = (result: TestHistory) => {
    setTestHistory(prev => [result, ...prev]);
  };

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Жүктелуде...</p>
        </div>
      </div>
    );
  }

  if (user && isAdmin) {
    return <AdminDashboard />;
  }

  if (showAdminLogin || (user && !isAdmin)) {
    return <AdminLogin />;
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <Home onSectionChange={setCurrentSection} />;
      case 'materials':
        return <MaterialsView />;
      case 'videos':
        return <VideosView />;
      case 'tests':
        return <TestsQuizzes testHistory={testHistory} onTestComplete={handleTestComplete} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <Layout
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      onAdminClick={handleAdminClick}
    >
      {renderSection()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
