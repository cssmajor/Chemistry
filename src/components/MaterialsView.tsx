import React, { useState, useEffect } from 'react';
import { FileText, Image, Video, Search, Eye, File as FileIcon } from 'lucide-react';
import { Material } from '../types';
import { supabase } from '../lib/supabase';
import { sanitizeUrl } from '../lib/sanitize';
import { trackClick } from '../lib/analytics';

const MaterialsView: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'lecture' | 'labwork'>('lecture');
  const [loading, setLoading] = useState(true);

  const chapters = [
    '1-тарау: Негізгі ұғымдар',
    '2-тарау: Атом құрылысы',
    '3-тарау: Химиялық байланыс',
    '4-тарау: Химиялық реакциялар',
    '5-тарау: Қышқылдар мен негіздер',
    '6-тарау: Органикалық химия'
  ];

  useEffect(() => {
    fetchMaterials();
  }, [activeTab]);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('material_type', activeTab)
      .order('order_index', { ascending: true });

    if (error) {
      setMaterials([]);
    } else if (data) {
      setMaterials(data.map((m: any) => ({
        id: m.id,
        title: m.title,
        type: m.type as 'pdf' | 'doc' | 'ppt' | 'image' | 'video',
        chapter: m.chapter,
        description: m.description,
        uploadDate: m.upload_date,
        link: m.link
      })));
    }
    setLoading(false);
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
        return 'bg-cyan-100 text-cyan-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Материалдар
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Тараулар мен тақырыптар бойынша ұйымдастырылған барлық химия оқу материалдарыңызға қол жеткізіңіз.
        </p>
      </div>

      <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('lecture')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'lecture'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Дәріс материалдары
        </button>
        <button
          onClick={() => setActiveTab('labwork')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'labwork'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Зертханалық жұмыс материалдары
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Материалдарды іздеу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {filteredMaterials.length} материал табылды
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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

      <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredMaterials.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700 col-span-full">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Сіздің критерийлеріңізге сәйкес материалдар табылмады.</p>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <div key={material.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300">
              {viewMode === 'grid' ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${getTypeColor(material.type)} flex items-center justify-center`}>
                    {getTypeIcon(material.type)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {material.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{material.description}</p>
                    <div className="space-y-2">
                      <div className="bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg text-center font-medium text-xs text-gray-700 dark:text-gray-300">{material.chapter}</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {sanitizeUrl(material.link) && (
                      <a
                        href={sanitizeUrl(material.link)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick('material', material.id, material.title, 'open')}
                        className="flex items-center justify-center space-x-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Көру</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-xl ${getTypeColor(material.type)}`}>
                      {getTypeIcon(material.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {material.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">{material.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg font-medium">{material.chapter}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {sanitizeUrl(material.link) && (
                      <a
                        href={sanitizeUrl(material.link)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick('material', material.id, material.title, 'open')}
                        className="flex items-center space-x-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Көру</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MaterialsView;
