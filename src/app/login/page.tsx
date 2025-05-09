'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
import { Country } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const { signIn } = useAuth();
  const { t, dir } = useLanguage();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('emailInvalid');
    }
    
    if (!password) {
      newErrors.password = t('passwordRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('signInError'));
    }
  };

  const signInWithApple = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('signInError'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error, data } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('loginSuccess'));
        
        // Check if user has a country_id to redirect to country-specific page
        if (data.user?.user_metadata?.country_id) {
          // Fetch the country code
          const { data: countryData } = await supabase
            .from('countries')
            .select('code')
            .eq('id', data.user.user_metadata.country_id)
            .single() as { data: Country | null };
          
          if (countryData) {
            router.push(`/${countryData.code.toLowerCase()}`);
          } else {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      toast.error(t('loginError'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white dark:bg-slate-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white dark:bg-slate-800 rounded-lg p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white mb-8">
          {t('welcomeBack')}
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
          {t('noAccount')}{' '}
          <Link href="/signup" className="text-[#00FFAA] hover:text-[#00e699] transition-colors font-medium">
            {t('signUp')}
          </Link>
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
              {t('email')}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
              className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
              {t('password')}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="********"
                className="bg-gray-50 border-gray-300 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors`}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded bg-gray-50 border-gray-300 dark:bg-slate-700 dark:border-slate-600 text-primary focus:ring-primary dark:focus:ring-offset-slate-800"
              />
              <label htmlFor="remember-me" className={`${dir === 'rtl' ? 'mr-2' : 'ml-2'} block text-sm text-gray-600 dark:text-slate-400`}>
                {t('rememberMe')}
              </label>
            </div>

            <Link href="/forgot-password" className="text-sm text-[#00FFAA] hover:text-[#00e699] transition-colors font-medium">
              {t('forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#00FFAA] hover:bg-[#00e699] text-slate-900 font-medium" isLoading={isLoading}>
            {t('signIn')}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-slate-800 px-2 text-gray-600 dark:text-slate-400">{t('orContinueWith')}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-100 dark:bg-slate-700 px-3 py-2.5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              onClick={() => signInWithGoogle()}
            >
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-semibold">{t('continueWithGoogle')}</span>
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-100 dark:bg-slate-700 px-3 py-2.5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              onClick={() => signInWithApple()}
            >
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.07 2.7.61 3.44 1.57-3.12 1.79-2.25 5.74.4 6.98-.95 2.37-2.23 4.7-4.43 4.48M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.27 2.03-1.83 4.11-3.74 4.25" />
              </svg>
              <span className="text-sm font-semibold">{t('continueWithApple')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
