import React, { useState, useEffect } from 'react';
import { Play, Search, FileText, Image, Presentation } from 'lucide-react';
import { CaseItem } from '../types';
import { supabase } from '../lib/supabase';
import { sanitizeUrl } from '../lib/sanitize';
import { trackClick } from '../lib/analytics';

const CasesView: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'videos' | 'presentations' | 'pdfs' | 'images'>('videos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, [activeTab]);

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('case_type', activeTab)
      .order('order_index', { ascending: true });

    if (error) {
      setCases([]);
    } else if (data) {
      setCases(data.map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        link: c.link,
        thumbnail: c.thumbnail,
        uploadDate: c.upload_date,
        case_type: c.case_type
      })));
    }
    setLoading(false);
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return null;
  };

  const filteredCases = cases.filter(caseItem =>
    caseItem.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Жобалар</h1>
        <p className="text-lg text-blue-50">Студенттердің жобалық жұмыстары мен материалдары</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          Жоба видеолары
        </button>
        <button
          onClick={() => setActiveTab('presentations')}
          className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeTab === 'presentations'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          Презентациялар
        </button>
        <button
          onClick={() => setActiveTab('pdfs')}
          className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeTab === 'pdfs'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          PDF файлдар
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeTab === 'images'
              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100'
          }`}
        >
          Суреттер
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Жобаларды іздеу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
            {filteredCases.length} жоба
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700 col-span-full">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Жобалар табылмады.</p>
          </div>
        ) : (
          filteredCases.map((caseItem) => {
            if (activeTab === 'videos') {
              const thumbnail = getYouTubeThumbnail(caseItem.link);
              return (
                <div key={caseItem.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                  <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-blue-100 to-green-100">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={caseItem.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-16 h-16 text-blue-600 opacity-50" />
                      </div>
                    )}
                    {sanitizeUrl(caseItem.link) && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <a
                          href={sanitizeUrl(caseItem.link)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackClick('case', caseItem.id, caseItem.title, 'open')}
                          className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"
                        >
                          <div className="bg-white rounded-full p-4 shadow-lg">
                            <Play className="w-8 h-8 text-blue-600" fill="currentColor" />
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {caseItem.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{caseItem.description}</p>
                  </div>
                </div>
              );
            }

            if (activeTab === 'presentations' || activeTab === 'pdfs') {
              return (
                <div key={caseItem.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                  <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    {activeTab === 'presentations' ? (
                      <Presentation className="w-20 h-20 text-blue-600 opacity-50" />
                    ) : (
                      <FileText className="w-20 h-20 text-blue-600 opacity-50" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {caseItem.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{caseItem.description}</p>
                    {sanitizeUrl(caseItem.link) && (
                      <a
                        href={sanitizeUrl(caseItem.link)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick('case', caseItem.id, caseItem.title, 'open')}
                        className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        Ашу
                      </a>
                    )}
                  </div>
                </div>
              );
            }

            if (activeTab === 'images') {
              return (
                <div key={caseItem.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                  <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-blue-100 to-green-100">
                    {sanitizeUrl(caseItem.link) ? (
                      <img
                        src={sanitizeUrl(caseItem.link)!}
                        alt={caseItem.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-16 h-16 text-blue-600 opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {caseItem.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{caseItem.description}</p>
                  </div>
                </div>
              );
            }

            return null;
          })
        )}
      </div>
    </div>
  );
};

export default CasesView;
