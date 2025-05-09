'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const adminLinks = [
  { href: '/admin', label: { en: 'Dashboard', ar: 'لوحة التحكم' } },
  { href: '/admin/analytics', label: { en: 'Analytics', ar: 'التحليلات' } },
  { href: '/admin/users', label: { en: 'Users', ar: 'المستخدمين' } },
  { href: '/admin/facilities', label: { en: 'Facilities', ar: 'المواقع' } },
  { href: '/admin/bookings', label: { en: 'Bookings', ar: 'الحجوزات' } },
  { href: '/admin/contact-messages', label: { en: 'Messages', ar: 'الرسائل' } },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { language } = useLanguage();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 shadow-lg">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
          </h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {adminLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  {link.label[language]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
