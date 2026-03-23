import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Materials from './components/Materials';
import TestsQuizzes from './components/TestsQuizzes';
import Videos from './components/Videos';
import Contact from './components/Contact';
import { Section, Material, VideoItem, TestHistory } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);

  const addTestResult = (result: TestHistory) => {
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
        return <Home onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <Layout currentSection={currentSection} onSectionChange={setCurrentSection}>
      {renderSection()}
    </Layout>
  );
}

export default App;
