import React, { useState } from 'react';
import { Upload, FileText, Image, Video, Download, Search, Filter, Eye, Trash2, Calendar, File as FileIcon, Plus, Link, CreditCard as Edit, Save } from 'lucide-react';

interface Material {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'image' | 'video';
  chapter: string;
  description: string;
  uploadDate: string;
  size?: string;
  url?: string;
  link?: string;
  isEditing?: boolean;
}

interface MaterialsProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

const Materials: React.FC<MaterialsProps> = ({ materials, setMaterials }) => {
  // Initialize with sample materials if empty
  React.useEffect(() => {
    if (materials.length === 0) {
      const sampleMaterials: Material[] = [
        {
          id: 1,
          title: '№1-лекция. Химиялық технология',
          type: 'pdf',
          chapter: '1-тарау: Негізгі ұғымдар',
          description: 'Химияның іргелі принциптері мен негізгі ұғымдары туралы толық нұсқаулық',
          uploadDate: '2025-09-14',
          size: '4.6 MB',
          url: '#',
          link: 'https://drive.google.com/file/d/1l_vsSiCxXk2jPBEfJlD5A8_jVHK3A9f1/view?usp=sharing'
        },
        {
          id: 2,
          title: '№2-лекция. Шикізат, энергия, су',
          type: 'pdf',
          chapter: '1-тарау: Негізгі ұғымдар',
          description: 'Химияның іргелі принциптері мен негізгі ұғымдары туралы толық нұсқаулық',
          uploadDate: '2025-09-14',
          size: '3.3 MB',
          url: '#',
          link: 'https://drive.google.com/file/d/1P5OXgARGpdmF2yXnPb6N31jhWREfvAx5/view?usp=drive_link'
        },
        {
          id: 3,
          title: '№3-лекция. Су және оның химиялық өнеркәсіпте қолданылуы',
          type: 'pdf',
          chapter: '1-тарау: Негізгі ұғымдар',
          description: 'Химияның іргелі принциптері мен негізгі ұғымдары туралы толық нұсқаулық',
          uploadDate: '2025-09-14',
          size: '1.5 MB',
          url: '#',
          link: 'https://drive.google.com/file/d/1qcvMqOp37eo8LcP69b2zKeJ2_IR4T-dx/view?usp=drive_link'
        },
        {
          id: 4,
          title: '№4-лекция. Күкірт қышқылын өндіру',
          type: 'pdf',
          chapter: '3-тарау: Химиялық байланыс',
          description: 'Реакция түрлері мен олардың сипаттамалары',
          uploadDate: '2025-09-14',
          size: '5.6 MB',
          url: '#',
          link: 'https://drive.google.com/file/d/1jCcxmQK9Ej4HZVuKR54KNW4jcMLoiK8y/view?usp=drive_link'
        },
        {
          id: 5,
          title: '№5-лекция. Аммиак синтезі',
          type: 'pdf',
          chapter: '4-тарау: Химиялық реакциялар',
          description: 'Реакция түрлері мен олардың сипаттамалары',
          uploadDate: '2025-09-14',
          size: '9.9 MB',
          url: '#',
          link: 'https://drive.google.com/file/d/19lJ4HOmsSjnfe8ItYRvlaGnJh_wYQxvr/view?usp=sharing'
        },
        {
          id: 6,
          title: '№6-лекция. Азот қышқылы өндірісі',
          type: 'pdf',
          chapter: '3-тарау: Химиялық байланыс',
          description: 'Реакция түрлері мен олардың сипаттамалары',
          uploadDate: '2025-09-14',
          size: '3.5 MB',
          url: '#',
          link: 'https://drive.google.com/file/d/1aNpkUCiA38zO9cCQ4e6pzHv9S3HosmTQ/view?usp=sharing'
        },
        {
          id: 7,
          title: '№7-лекция. Фосфор өндірісі',
          type: 'pdf',
          chapter: '3-тарау: Химиялық байланыc',
          description: 'Реакция түрлері мен олардың сипаттамалары',
          uploadDate: '2025-09-14',
          size: '1.1 MB',
          url: '#',
          link: 'https://drive.google.com/file/d/1T1BJVIoQTEgzmhXQHCLSJqo7hwzXI7_w/view?usp=drive_link'
        },
        {
          id: 8,
          title: '№8-лекция. Металлургия Шойын және Болат',
          type: 'pdf',
          chapter: '1-тарау: Негізгі ұғымдар',
          description: 'Химияның іргелі принциптері мен негізгі ұғымдары туралы толық нұсқаулық',
          uploadDate: '2025-09-14',
          size: '1.4 MB',
          url: '#',
          link: 'https://drive.google.com/file/d/1n-seV6phCrVnC0-vy5xJvf5rNvkyE5jv/view?usp=sharing'
        },
      ];
      setMaterials(sampleMaterials);
    }
  }, [materials.length, setMaterials]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({
    title: '',
    description: '',
    url: '',
    chapter: '1-тарау: Негізгі ұғымдар'
  });

  const chapters = [
    '1-тарау: Негізгі ұғымдар',
    '2-тарау: Атом құрылысы',
    '3-тарау: Химиялық байланыс',
    '4-тарау: Химиялық реакциялар',
    '5-тарау: Қышқылдар мен негіздер',
    '6-тарау: Органикалық химия'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newMaterial: Material = {
          id: Date.now() + Math.random(),
          title: file.name,
          type: getFileType(file.name),
          chapter: '1-тарау: Негізгі ұғымдар',
          description: `Жүктелген файл: ${file.name}`,
          uploadDate: new Date().toISOString().split('T')[0],
          size: formatFileSize(file.size),
          url: URL.createObjectURL(file)
        };
        setMaterials(prev => [newMaterial, ...prev]);
      });
    }
  };

  const addLink = () => {
    if (newLink.title && newLink.url) {
      const linkMaterial: Material = {
        id: Date.now(),
        title: newLink.title,
        type: 'doc',
        chapter: newLink.chapter,
        description: newLink.description,
        uploadDate: new Date().toISOString().split('T')[0],
        url: newLink.url,
        link: newLink.url
      };
      setMaterials(prev => [linkMaterial, ...prev]);
      setNewLink({ title: '', description: '', url: '', chapter: '1-тарау: Негізгі ұғымдар' });
      setShowAddLink(false);
    }
  };

  const editMaterial = (id: number) => {
    setMaterials(prev => prev.map(material => 
      material.id === id ? { ...material, isEditing: true } : material
    ));
  };

  const saveMaterial = (id: number, updatedMaterial: Partial<Material>) => {
    setMaterials(prev => prev.map(material => 
      material.id === id ? { ...material, ...updatedMaterial, isEditing: false } : material
    ));
  };

  const getFileType = (filename: string): 'pdf' | 'doc' | 'ppt' | 'image' | 'video' => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    if (['ppt', 'pptx'].includes(ext || '')) return 'ppt';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image';
    if (['mp4', 'avi', 'mov'].includes(ext || '')) return 'video';
    return 'doc';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteMaterial = (id: number) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return <FileText className="w-5 h-5" />;
      case 'ppt':
        return <FileIcon className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-700';
      case 'doc':
        return 'bg-blue-100 text-blue-700';
      case 'ppt':
        return 'bg-orange-100 text-orange-700';
      case 'image':
        return 'bg-green-100 text-green-700';
      case 'video':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChapter = selectedChapter === 'all' || material.chapter === selectedChapter;
    const matchesType = selectedType === 'all' || material.type === selectedType;
    
    return matchesSearch && matchesChapter && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Материалдар
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Тараулар мен тақырыптар бойынша ұйымдастырылған барлық химия оқу материалдарыңызға қол жеткізіңіз. Оқу тәжірибеңізді жақсарту үшін ресурстарды жүктеп алыңыз және жүктеңіз.
        </p>
      </div>

      {/* Compact Upload Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <label className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg">
              <Upload className="w-5 h-5" />
              <span>Файл жүктеу</span>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.txt,.xlsx,.xls"
              />
            </label>
            <button
              onClick={() => setShowAddLink(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Link className="w-5 h-5" />
              <span>Сілтеме қосу</span>
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-3">PDF, Word, PowerPoint, суреттер және сілтемелерді қолдау көрсетіледі</p>
        </div>
      </div>

      {/* Add Link Form */}
      {showAddLink && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Жаңа сілтеме қосу</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Атауы</label>
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Сілтеме атауын енгізіңіз"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тарау</label>
              <select
                value={newLink.chapter}
                onChange={(e) => setNewLink(prev => ({ ...prev, chapter: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {chapters.map(chapter => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сілтеме URL</label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сипаттама</label>
              <textarea
                value={newLink.description}
                onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Сілтеме туралы қысқаша сипаттама"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddLink(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Бас тарту
            </button>
            <button
              onClick={addLink}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сақтау
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Материалдарды іздеу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>

          {/* Chapter Filter */}
          <div className="lg:w-48">
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">Барлық тараулар</option>
              {chapters.map((chapter) => (
                <option key={chapter} value={chapter}>{chapter}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="lg:w-40">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">Барлық түрлер</option>
              <option value="pdf">PDF</option>
              <option value="doc">Word</option>
              <option value="ppt">PowerPoint</option>
              <option value="image">Суреттер</option>
              <option value="video">Видеолар</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredMaterials.length} материал табылды
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 text-sm ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 text-sm ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <div className="w-4 h-4 flex flex-col space-y-1">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredMaterials.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg col-span-full">
            <p className="text-gray-500 text-lg">Сіздің критерийлеріңізге сәйкес материалдар табылмады.</p>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <div key={material.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {viewMode === 'grid' ? (
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${getTypeColor(material.type)} flex items-center justify-center`}>
                    {getTypeIcon(material.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                      {material.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{material.description}</p>
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="bg-gray-100 px-2 py-1 rounded text-center text-xs">{material.chapter}</div>
                      {material.link && (
                        <div className="text-blue-600 text-xs">
                          <Link className="w-3 h-3 inline mr-1" />
                          <a href={material.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Сілтеме
                          </a>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span><Calendar className="w-3 h-3 inline mr-1" />{material.uploadDate}</span>
                        {material.size && <span>{material.size}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {(material.link || (material.url && material.url !== '#')) ? (
                      <a
                        href={material.link || material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Көру</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center space-x-1 bg-gray-400 text-white px-2 py-2 rounded-lg transition-all duration-200 text-xs opacity-50 cursor-not-allowed"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Көру</span>
                      </button>
                    )}
                    {(material.link || (material.url && material.url !== '#')) ? (
                      <a
                        href={material.link || material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Жүктеу</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center space-x-1 bg-gray-400 text-white px-2 py-2 rounded-lg transition-all duration-200 text-xs opacity-50 cursor-not-allowed"
                      >
                        <Download className="w-3 h-3" />
                        <span>Жүктеу</span>
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMaterial(material.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => editMaterial(material.id)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                      {getTypeIcon(material.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {material.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-xs">{material.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{material.chapter}</span>
                        {material.link && (
                          <a href={material.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center">
                            <Link className="w-3 h-3 mr-1" />
                            Сілтеме
                          </a>
                        )}
                        <span><Calendar className="w-3 h-3 inline mr-1" />Жүктелген: {material.uploadDate}</span>
                        {material.size && <span>Өлшемі: {material.size}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {(material.link || (material.url && material.url !== '#')) ? (
                      <a
                        href={material.link || material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Көру</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex items-center space-x-1 bg-gray-400 text-white px-3 py-2 rounded-lg transition-all duration-200 transform text-xs opacity-50 cursor-not-allowed"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Көру</span>
                      </button>
                    )}
                    {(material.link || (material.url && material.url !== '#')) ? (
                      <a
                        href={material.link || material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 text-xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>Жүктеп алу</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex items-center space-x-1 bg-gray-400 text-white px-3 py-2 rounded-lg transition-all duration-200 transform text-xs opacity-50 cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        <span>Жүктеп алу</span>
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMaterial(material.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => editMaterial(material.id)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Edit Form */}
              {material.isEditing && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <MaterialEditForm 
                    material={material}
                    chapters={chapters}
                    onSave={(updatedMaterial) => saveMaterial(material.id, updatedMaterial)}
                    onCancel={() => setMaterials(prev => prev.map(m => m.id === material.id ? { ...m, isEditing: false } : m))}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chapter Organization */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Тараулар бойынша материалдар</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => {
            const chapterMaterials = materials.filter(m => m.chapter === chapter);
            return (
              <div key={chapter} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900">{chapter}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{chapterMaterials.length} материал қолжетімді</p>
                <button 
                  onClick={() => setSelectedChapter(chapter)}
                  className="w-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 py-2 px-4 rounded-lg hover:from-purple-200 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  Материалдарды көру
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface MaterialEditFormProps {
  material: Material;
  chapters: string[];
  onSave: (updatedMaterial: Partial<Material>) => void;
  onCancel: () => void;
}

const MaterialEditForm: React.FC<MaterialEditFormProps> = ({ material, chapters, onSave, onCancel }) => {
  const [editData, setEditData] = useState({
    title: material.title,
    description: material.description,
    chapter: material.chapter,
    link: material.link || ''
  });

  const handleSave = () => {
    onSave(editData);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Атауы</label>
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Сипаттама</label>
        <textarea
          value={editData.description}
          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Сілтеме (міндетті емес)</label>
        <input
          type="url"
          value={editData.link}
          onChange={(e) => setEditData(prev => ({ ...prev, link: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="https://example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Тарау</label>
        <select
          value={editData.chapter}
          onChange={(e) => setEditData(prev => ({ ...prev, chapter: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {chapters.map(chapter => (
            <option key={chapter} value={chapter}>{chapter}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
        >
          Бас тарту
        </button>
        <button
          onClick={handleSave}
          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
        >
          <Save className="w-3 h-3" />
          <span>Сақтау</span>
        </button>
      </div>
    </div>
  );
};

export default Materials;