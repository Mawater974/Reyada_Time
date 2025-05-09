'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { FiUser, FiSettings, FiBell, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

export default function ProfileMenu() {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('Profile Menu - Current user:', user);
    console.log('Profile Menu - Current profile:', profile);
    console.log('Profile Menu - User role:', profile?.role);
  }, [user, profile]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label={user ? 'Open profile menu' : 'Open auth menu'}
      >
        {user && user.profile_image_url ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={user.profile_image_url}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <FiUser className="w-4 h-4 mr-2" />
                {t('profile')}
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <FiSettings className="w-4 h-4 mr-2" />
                {t('settings')}
              </Link>
              <Link
                href="/notifications"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <FiBell className="w-4 h-4 mr-2" />
                {t('notifications')}
              </Link>
              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                <Link
                  href="/admin"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="w-4 h-4 mr-2" />
                  {t('admin')}
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <FiLogIn className="w-4 h-4 mr-2" />
                {t('login')}
              </Link>
              <Link
                href="/signup"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <FiUserPlus className="w-4 h-4 mr-2" />
                {t('signup')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
