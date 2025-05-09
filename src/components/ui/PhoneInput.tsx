'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Country } from '@/types';
import { forwardRef, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  selectedCountry?: Country;
  onCountryChange?: (country: Country) => void;
  countries: Country[];
}

const countryPhoneCodes: { [key: string]: { code: string; digits: number; format: string; placeholder: string } } = {
  // Gulf Countries
  'QA': { code: '+974', digits: 8, format: 'XXXX XXXX', placeholder: '12345678' }, // Qatar
  'KW': { code: '+965', digits: 8, format: 'XXXX XXXX', placeholder: '12345678' }, // Kuwait
  'BH': { code: '+973', digits: 8, format: 'XXXX XXXX', placeholder: '12345678' }, // Bahrain
  'SA': { code: '+966', digits: 9, format: 'XX XXX XXXX', placeholder: '123456789' }, // Saudi Arabia
  'AE': { code: '+971', digits: 9, format: 'XX XXX XXXX', placeholder: '123456789' }, // UAE
  'OM': { code: '+968', digits: 8, format: 'XXXX XXXX', placeholder: '12345678' }, // Oman
  
  // Levant Countries
  'JO': { code: '+962', digits: 9, format: 'X XXXX XXXX', placeholder: '123456789' }, // Jordan
  'LB': { code: '+961', digits: 8, format: 'XX XXX XXX', placeholder: '12345678' }, // Lebanon
  'PS': { code: '+970', digits: 9, format: 'XX XXX XXXX', placeholder: '123456789' }, // Palestine
  'SY': { code: '+963', digits: 9, format: 'XXX XXX XXX', placeholder: '123456789' }, // Syria
  'IQ': { code: '+964', digits: 10, format: 'XXX XXX XXXX', placeholder: '1234567890' }, // Iraq
  
  // North Africa
  'EG': { code: '+20', digits: 10, format: 'XXX XXX XXXX', placeholder: '1234567890' }, // Egypt
  'MA': { code: '+212', digits: 9, format: 'XX XXX XXXX', placeholder: '123456789' }, // Morocco
  'TN': { code: '+216', digits: 8, format: 'XX XXX XXX', placeholder: '12345678' }, // Tunisia
  'DZ': { code: '+213', digits: 9, format: 'XX XXX XXXX', placeholder: '123456789' }, // Algeria
  'LY': { code: '+218', digits: 9, format: 'XX XXX XXXX', placeholder: '123456789' }, // Libya
  
  // Other Arab Countries
  'YE': { code: '+967', digits: 9, format: 'XXX XXX XXX', placeholder: '123456789' }, // Yemen
  'SD': { code: '+249', digits: 9, format: 'XX XXX XXXX', placeholder: '123456789' }, // Sudan
  'SO': { code: '+252', digits: 8, format: 'XX XXX XXX', placeholder: '12345678' }, // Somalia
  'MR': { code: '+222', digits: 8, format: 'XXXX XXXX', placeholder: '12345678' }, // Mauritania
  'DJ': { code: '+253', digits: 8, format: 'XX XX XX XX', placeholder: '12345678' }, // Djibouti
  'KM': { code: '+269', digits: 8, format: 'XXXX XXXX', placeholder: '12345678' }, // Comoros
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, className, value, onChange, selectedCountry, onCountryChange, countries, ...props }, ref) => {
    const { language, t } = useLanguage();
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/[^0-9]/g, '');
      const countryInfo = selectedCountry ? countryPhoneCodes[selectedCountry.code] : undefined;
      
      if (countryInfo) {
        if (newValue.length <= countryInfo.digits) {
          setLocalValue(newValue);
          onChange(newValue);
        }
      } else {
        setLocalValue(newValue);
        onChange(newValue);
      }
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const country = countries.find(c => c.id.toString() === e.target.value);
      if (country && onCountryChange) {
        onCountryChange(country);
        // Clear phone number when country changes
        setLocalValue('');
        onChange('');
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium input-label mb-1">
            {label}
          </label>
        )}
        <div className={twMerge(
          'flex rounded-md shadow-sm transition-colors duration-200',
          'border border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-700/90',
          error && 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500',
          'focus-within:outline-none focus-within:ring-blue-500 focus-within:border-blue-500',
          'flex-row'
        )}>
          <select
            value={selectedCountry?.id || ''}
            onChange={handleCountryChange}
            className={twMerge(
              'text-sm py-1.5 px-2 border-0 bg-transparent focus:ring-0 focus:outline-none cursor-pointer w-[90px]',
              'text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500',
              'rounded-l-md'
            )}
          >
            <option value="" className="bg-white dark:bg-slate-800">+xxx</option>
            {countries.map((country) => (
              <option 
                key={country.id} 
                value={country.id}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {countryPhoneCodes[country.code]?.code}
              </option>
            ))}
          </select>
          <div className="w-px h-full bg-slate-300 dark:bg-slate-600" />
          <input
            ref={ref}
            type="tel"
            value={localValue}
            onChange={handlePhoneChange}
            className={twMerge(
              'block flex-1 border-0 bg-transparent py-1.5 px-3 text-sm focus:ring-0 focus:outline-none',
              'text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500',
              'rounded-r-md',
              language === 'ar' ? 'text-right' : 'text-left',
              className
            )}
            placeholder={selectedCountry ? countryPhoneCodes[selectedCountry.code]?.placeholder : t('phoneNumberPlaceholder')}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
