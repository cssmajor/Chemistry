import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, Eye, TrendingUp, BarChart3, MousePointer } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SectionStats {
  section: string;
  count: number;
}

interface ItemStats {
  item_type: string;
  item_title: string;
  count: number;
}

interface DayStats {
  date: string;
  count: number;
}

interface TypeStats {
  item_type: string;
  count: number;
}

const AdminStats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [uniqueSessions, setUniqueSessions] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [topSections, setTopSections] = useState<SectionStats[]>([]);
  const [topItems, setTopItems] = useState<ItemStats[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DayStats[]>([]);
  const [clicksByType, setClicksByType] = useState<TypeStats[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    const { data: sessionData } = await supabase
      .from('page_views')
      .select('session_id');

    if (sessionData) {
      const uniqueSessionIds = new Set(sessionData.map(pv => pv.session_id));
      setUniqueSessions(uniqueSessionIds.size);
    }

    const { count: pageViewCount } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });

    setTotalPageViews(pageViewCount || 0);

    const { count: clickCount } = await supabase
      .from('item_clicks')
      .select('*', { count: 'exact', head: true });

    setTotalClicks(clickCount || 0);

    const { data: sectionData } = await supabase.rpc('get_section_stats');
    if (sectionData) {
      setTopSections(sectionData);
    } else {
      const { data: fallbackData } = await supabase
        .from('page_views')
        .select('section');

      if (fallbackData) {
        const sectionCounts: Record<string, number> = {};
        fallbackData.forEach(pv => {
          sectionCounts[pv.section] = (sectionCounts[pv.section] || 0) + 1;
        });
        const sections = Object.entries(sectionCounts)
          .map(([section, count]) => ({ section, count }))
          .sort((a, b) => b.count - a.count);
        setTopSections(sections);
      }
    }

    const { data: itemData } = await supabase.rpc('get_item_stats');
    if (itemData) {
      setTopItems(itemData.slice(0, 10));
    } else {
      const { data: fallbackItemData } = await supabase
        .from('item_clicks')
        .select('item_type, item_title');

      if (fallbackItemData) {
        const itemCounts: Record<string, { item_type: string; count: number }> = {};
        fallbackItemData.forEach(ic => {
          const key = `${ic.item_type}:${ic.item_title}`;
          if (!itemCounts[key]) {
            itemCounts[key] = { item_type: ic.item_type, count: 0 };
          }
          itemCounts[key].count += 1;
        });
        const items = Object.entries(itemCounts)
          .map(([title, data]) => ({
            item_type: data.item_type,
            item_title: title.split(':')[1],
            count: data.count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        setTopItems(items);
      }
    }

    const { data: dailyData } = await supabase
      .from('page_views')
      .select('visited_at');

    if (dailyData) {
      const dayCounts: Record<string, number> = {};
      dailyData.forEach(pv => {
        const date = new Date(pv.visited_at).toISOString().split('T')[0];
        dayCounts[date] = (dayCounts[date] || 0) + 1;
      });

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const dailyStats = last7Days.map(date => ({
        date,
        count: dayCounts[date] || 0
      }));
      setDailyActivity(dailyStats);
    }

    const { data: typeData } = await supabase
      .from('item_clicks')
      .select('item_type');

    if (typeData) {
      const typeCounts: Record<string, number> = {};
      typeData.forEach(ic => {
        typeCounts[ic.item_type] = (typeCounts[ic.item_type] || 0) + 1;
      });
      const types = Object.entries(typeCounts)
        .map(([item_type, count]) => ({ item_type, count }))
        .sort((a, b) => b.count - a.count);
      setClicksByType(types);
    }

    setLoading(false);
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      video: 'Видео',
      material: 'Материал',
      case: 'Жоба',
      test: 'Тест',
      game: 'Ойын'
    };
    return labels[type] || type;
  };

  const getSectionLabel = (section: string): string => {
    const labels: Record<string, string> = {
      home: 'Басты бет',
      materials: 'Материалдар',
      videos: 'Видеолар',
      cases: 'Жобалар',
      tests: 'Тесттер',
      contact: 'Байланыс'
    };
    return labels[section] || section;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Бүгін';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Кеше';
    }
    return date.toLocaleDateString('kk-KZ', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const maxDailyCount = Math.max(...dailyActivity.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Статистика</h2>
        <button
          onClick={fetchStats}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Жаңарту</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Бірегей пайдаланушылар</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{uniqueSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Жалпы көрінімдер</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPageViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <MousePointer className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Жалпы басулар</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalClicks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ең көп кіретін бөлімдер</h3>
          </div>
          {topSections.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Деректер жоқ</p>
          ) : (
            <div className="space-y-3">
              {topSections.map((section, index) => (
                <div key={section.section} className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{getSectionLabel(section.section)}</p>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">{section.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <MousePointer className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Басулар түрі бойынша</h3>
          </div>
          {clicksByType.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Деректер жоқ</p>
          ) : (
            <div className="space-y-3">
              {clicksByType.map((type) => (
                <div key={type.item_type} className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{getTypeLabel(type.item_type)}</span>
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">{type.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Соңғы 7 күндегі белсенділік</h3>
        </div>
        <div className="space-y-3">
          {dailyActivity.map((day) => (
            <div key={day.date} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300 font-medium">{formatDate(day.date)}</span>
                <span className="text-gray-900 dark:text-white font-semibold">{day.count}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(day.count / maxDailyCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ең көп ашылған материалдар (Топ 10)</h3>
        </div>
        {topItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">Деректер жоқ</p>
        ) : (
          <div className="space-y-3">
            {topItems.map((item, index) => (
              <div key={`${item.item_type}-${item.item_title}`} className="flex items-center space-x-3">
                <span className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-700 rounded-full font-bold text-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.item_title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{getTypeLabel(item.item_type)}</p>
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStats;
