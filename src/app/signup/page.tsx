'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { Country } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PhoneInput from '@/components/ui/PhoneInput';

export default function SignupPage() {
  const { signUp } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryId, setCountryId] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    countryId?: string;
    phoneNumber?: string;
  }>({});

  useEffect(() => {
    // Fetch countries from Supabase
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('id, name_en, name_ar, code, is_active')
        .eq('is_active', true)
        .order(language === 'ar' ? 'name_ar' : 'name_en', { ascending: true });
      
      if (data && !error) {
        setCountries(data);
      } else if (error) {
        console.error('Error fetching countries:', error);
        toast.error(t('errorFetchingCountries'));
      }
    };
    
    fetchCountries();
  }, [language, t]);

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      countryId?: string;
      phoneNumber?: string;
    } = {};
    
    if (!firstName) {
      newErrors.firstName = t('firstNameRequired');
    }

    if (!lastName) {
      newErrors.lastName = t('lastNameRequired');
    }
    
    if (!email) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('emailInvalid');
    }
    
    if (!password) {
      newErrors.password = t('passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('passwordTooShort');
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('passwordsDoNotMatch');
    }
    
    if (!countryId) {
      newErrors.countryId = t('countryRequired');
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = t('phoneNumberRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (countryId && countries.length > 0) {
      const country = countries.find(c => c.id === countryId);
      setSelectedCountry(country);
    }
  }, [countryId, countries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Basic phone number validation
    if (!/^\d{4}\s?\d{4}$/.test(phoneNumber)) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Invalid phone number format' }));
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const { error, data } = await signUp(email, password, firstName, lastName, countryId!, phoneNumber);
      
      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('already registered') || error.code === 'user_already_exists') {
          toast.error(t('emailAlreadyExists'));
        } else if (error.message.includes('unique constraint')) {
          toast.error(t('emailAlreadyExists'));
        } else {
          toast.error(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (!data?.user) {
        toast.error(t('signupError'));
        setIsLoading(false);
        return;
      }

      toast.success(t('signupSuccess'));
      
      // Use the countryCode from the response if available
      const countryCode = data.countryCode || (
        await supabase
          .from('countries')
          .select('code')
          .eq('id', countryId)
          .single()
      ).data?.code?.toLowerCase();

      setIsLoading(false);
      
      // Navigate after setting loading to false
      if (countryCode) {
        router.push(`/`);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(t('signupError'));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('signupTitle')}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {t('signupSubtitle')}
        </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label={t('firstName')}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={errors.firstName}
                  placeholder={t('firstNamePlaceholder')}
                />
              </div>
              <div>
                <Input
                  label={t('lastName')}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={errors.lastName}
                  placeholder={t('lastNamePlaceholder')}
                />
              </div>
            </div>

            <div>
              <Input
                label={t('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Input
                label={t('password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="********"
              />
            </div>

            <div>
              <Input
                label={t('confirmPassword')}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                placeholder="********"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">
                {t('selectCountry')}
              </label>
              <select
                id="country"
                value={countryId || ''}
                onChange={(e) => setCountryId(e.target.value ? parseInt(e.target.value) : null)}
                className={`w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm ${language === 'ar' ? 'text-right' : 'text-left'} ${
                  errors.countryId ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                }`}
              >
                <option value="">{t('selectCountry')}</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {language === 'ar' ? country.name_ar : country.name_en}
                  </option>
                ))}
              </select>
              {errors.countryId && <p className="mt-1 text-sm text-red-600">{errors.countryId}</p>}
            </div>

            <div>
              <PhoneInput
                label={t('phoneNumber')}
                value={phoneNumber}
                onChange={setPhoneNumber}
                error={errors.phoneNumber}
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
                countries={countries}
                placeholder={t('phoneNumberPlaceholder')}
              />
            </div>

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                {t('signUp')}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-slate-800 px-2 text-gray-500">{t('haveAccount')}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/login">
                <Button variant="outline" fullWidth>
                  {t('login')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
