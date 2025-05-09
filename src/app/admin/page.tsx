'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalFacilities: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalFacilities: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total bookings
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get total facilities
      const { count: facilitiesCount } = await supabase
        .from('facilities')
        .select('*', { count: 'exact', head: true });

      // Get unread messages
      const { count: messagesCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      setStats({
        totalUsers: usersCount || 0,
        totalBookings: bookingsCount || 0,
        totalFacilities: facilitiesCount || 0,
        unreadMessages: messagesCount || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: { en: 'View Analytics', ar: 'عرض التحليلات' },
      description: { 
        en: 'Check detailed analytics and user engagement',
        ar: 'تحقق من التحليلات التفصيلية ومشاركة المستخدمين'
      },
      href: '/admin/analytics',
      color: 'blue'
    },
    {
      title: { en: 'Manage Users', ar: 'إدارة المستخدمين' },
      description: { 
        en: 'View and manage user accounts',
        ar: 'عرض وإدارة حسابات المستخدمين'
      },
      href: '/admin/users',
      color: 'green'
    },
    {
      title: { en: 'Manage Facilities', ar: 'إدارة المواقع' },
      description: { 
        en: 'Add or edit facility information',
        ar: 'إضافة أو تعديل معلومات المواقع'
      },
      href: '/admin/facilities',
      color: 'purple'
    },
    {
      title: { en: 'View Messages', ar: 'عرض الرسائل' },
      description: { 
        en: 'Check contact form submissions',
        ar: 'التحقق من رسائل نموذج الاتصال'
      },
      href: '/admin/contact-messages',
      color: 'yellow'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {language === 'en' ? 'Admin Dashboard' : 'لوحة التحكم'}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Total Users' : 'إجمالي المستخدمين'}
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Total Bookings' : 'إجمالي الحجوزات'}
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.totalBookings}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Total Facilities' : 'إجمالي المواقع'}
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalFacilities}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'Unread Messages' : 'الرسائل غير المقروءة'}
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.unreadMessages}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`block p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
          >
            <h3 className={`text-lg font-semibold text-${action.color}-600 dark:text-${action.color}-400 mb-2`}>
              {action.title[language]}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {action.description[language]}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
