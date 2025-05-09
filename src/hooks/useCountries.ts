import { useCallback } from 'react';

interface Country {
  id: string;
  name_en: string;
  name_ar: string;
  code: string;
  cities: string[];
}

export function useCountries() {
  // TODO: Implement actual country data fetching with SWR or React Query
  const countries: Country[] = [
    {
      id: '1',
      name_en: 'Qatar',
      name_ar: 'قطر',
      code: 'QA',
      cities: ['Doha', 'Al Wakrah', 'Al Khor']
    },
    {
      id: '2',
      name_en: 'Kuwait',
      name_ar: 'الكويت',
      code: 'KW',
      cities: ['Kuwait City', 'Al Ahmadi', 'Hawalli']
    }
  ];

  return { countries };
}
