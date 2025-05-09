'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const { language } = useLanguage();
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [countryStats, setCountryStats] = useState<any[]>([]);
  const [userEngagement, setUserEngagement] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch daily page views
      const { data: viewsData } = await supabase
        .from('analytics_daily_page_views')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);

      // Fetch country stats
      const { data: countryData } = await supabase
        .rpc('get_country_views', {
          target_date: new Date().toISOString().split('T')[0]
        });

      // Fetch user engagement
      const { data: engagementData } = await supabase
        .from('analytics_user_engagement')
        .select('*')
        .single();

      setPageViews(viewsData || []);
      setCountryStats(countryData || []);
      setUserEngagement(engagementData || {});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {language === 'en' ? 'Analytics Dashboard' : 'لوحة التحليلات'}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Total Views Today' : 'إجمالي المشاهدات اليوم'}
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {pageViews[0]?.view_count || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Active Users' : 'المستخدمين النشطين'}
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {userEngagement?.total_sessions || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Avg. Session Duration' : 'متوسط مدة الجلسة'}
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(userEngagement?.avg_session_duration || 0)}s
          </p>
        </div>
      </div>

      {/* Page Views Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          {language === 'en' ? 'Daily Page Views' : 'المشاهدات اليومية'}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pageViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()} 
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="view_count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country Distribution */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          {language === 'en' ? 'Views by Country' : 'المشاهدات حسب الدولة'}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={countryStats}
                dataKey="count"
                nameKey="country_code"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {countryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
