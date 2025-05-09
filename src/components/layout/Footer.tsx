'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-gray-700 border-t bg-gray-800 dark:bg-gray-900 text-white md:block hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('appName')}</h3>
            <p className="text-gray-300 text-sm">
              {t('footerDescription')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="text-gray-300 hover:text-white text-sm">
                  {t('facilities')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white text-sm">
                  {t('contactUs')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('sportTypes')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/facilities?type=football" className="text-gray-300 hover:text-white text-sm">
                  {t('football')}
                </Link>
              </li>
              <li>
                <Link href="/facilities?type=basketball" className="text-gray-300 hover:text-white text-sm">
                  {t('basketball')}
                </Link>
              </li>
              <li>
                <Link href="/facilities?type=volleyball" className="text-gray-300 hover:text-white text-sm">
                  {t('volleyball')}
                </Link>
              </li>
              <li>
                <Link href="/facilities?type=tennis" className="text-gray-300 hover:text-white text-sm">
                  {t('tennis')}
                </Link>
              </li>
              <li>
                <Link href="/facilities?type=padel" className="text-gray-300 hover:text-white text-sm">
                  {t('padel')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white text-sm">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white text-sm">
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6">
          <p className="text-gray-300 text-sm text-center">
            &copy; {currentYear} {t('appName')}. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
