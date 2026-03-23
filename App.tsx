import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Materials from './components/Materials';
import TestsQuizzes from './components/TestsQuizzes';
import Videos from './components/Videos';
import Contact from './components/Contact';

type Section = 'home' | 'materials' | 'videos' | 'tests' | 'contact';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [materials, setMaterials] = useState<any[]>([]); // ✅ works fine
  const [videos, setVideos] = useState<any[]>([]);
  const [testHistory, setTestHistory] = useState<any[]>([]);

  const addTestResult = (result: any) => {
    setTestHistory(prev => [result, ...prev.slice(0, 9)]);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <Home onSectionChange={setCurrentSection} />;
      case 'materials':
        return <Materials materials={materials} setMaterials={setMaterials} />;
      case 'videos':
        return <Videos videos={videos} setVideos={setVideos} />;
      case 'tests':
        return <TestsQuizzes testHistory={testHistory} onTestComplete={addTestResult} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout currentSection={currentSection} onSectionChange={setCurrentSection}>
      {renderSection()}
    </Layout>
  );
}

export default App;
