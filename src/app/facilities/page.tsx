'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiFilter, FiSearch, FiStar, FiMapPin, FiClock } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { supabase, Facility, mockFacilities } from '@/lib/supabase';
import Button from '@/components/ui/Button';

export default function FacilitiesPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // Sport types for filtering
  const sportTypes = [
    { id: '', name: t('allSports') },
    { id: 'football', name: t('football') },
    { id: 'basketball', name: t('basketball') },
    { id: 'volleyball', name: t('volleyball') },
    { id: 'tennis', name: t('tennis') },
    { id: 'padel', name: t('padel') },
    { id: 'swimming', name: t('swimming') },
    { id: 'gym', name: t('gym') },
  ];

  // Locations for filtering (would come from database in a real app)
  const locations = [
    { id: '', name: t('allLocations') },
    { id: 'doha', name: 'Doha' },
    { id: 'lusail', name: 'Lusail' },
    { id: 'al-wakrah', name: 'Al Wakrah' },
  ];

  useEffect(() => {
    fetchFacilities();
  }, [selectedType]);

  const fetchFacilities = async () => {
    setLoading(true);
    
    try {
      // Simulate a delay to mimic a real API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for development
      let filteredFacilities = mockFacilities;
      
      // Apply filters
      if (selectedType) {
        filteredFacilities = filteredFacilities.filter((facility: Facility) => facility.facility_type === selectedType);
      }
      
      // Apply location filter if selected
      if (selectedLocation) {
        filteredFacilities = filteredFacilities.filter((facility: Facility) => {
          const addressLower = facility.address_en.toLowerCase();
          return addressLower.includes(selectedLocation.toLowerCase());
        });
      }
      
      // Apply search term filter if any
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredFacilities = filteredFacilities.filter((facility: Facility) => {
          return (
            facility.name_en.toLowerCase().includes(searchLower) ||
            facility.description_en.toLowerCase().includes(searchLower) ||
            facility.address_en.toLowerCase().includes(searchLower)
          );
        });
      }
      
      // Filter by price range
      filteredFacilities = filteredFacilities.filter((facility: Facility) => {
        return facility.price_per_hour >= priceRange[0] && facility.price_per_hour <= priceRange[1];
      });
      
      setFacilities(filteredFacilities);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Instead of filtering here, we'll trigger the fetchFacilities function
    // which already has the logic to filter by searchTerm
    fetchFacilities();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">{t('facilitiesTitle')}</h1>
        <button
          onClick={toggleFilters}
          className="flex items-center gap-2 md:hidden bg-gray-100 dark:bg-gray-800 p-2 rounded-md dark:text-gray-200"
        >
          <FiFilter />
          {t('filters')}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="w-full md:w-64 hidden md:block">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">{t('filterBy')}</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('sportType')}</h3>
              <div className="space-y-2">
                {sportTypes.map(type => (
                  <div key={type.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`type-${type.id}`}
                      name="sportType"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`type-${type.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('location')}</h3>
              <div className="space-y-2">
                {locations.map(location => (
                  <div key={location.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`location-${location.id}`}
                      name="location"
                      value={location.id}
                      checked={selectedLocation === location.id}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`location-${location.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {location.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('price')}</h3>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0 QAR</span>
                  <span>{priceRange[1]} QAR</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => {
                setSelectedType('');
                setSelectedLocation('');
                setPriceRange([0, 1000]);
                fetchFacilities();
              }}
            >
              {t('resetFilters')}
            </Button>
          </div>
        </div>

        {/* Filters - Mobile */}
        {showFilters && (
          <div className="md:hidden bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
            <h2 className="font-semibold text-lg mb-4">{t('filterBy')}</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('sportType')}</h3>
              <div className="space-y-2">
                {sportTypes.map(type => (
                  <div key={type.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`mobile-type-${type.id}`}
                      name="mobileSportType"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`mobile-type-${type.id}`} className="ml-2 text-sm text-gray-700">
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('location')}</h3>
              <div className="space-y-2">
                {locations.map(location => (
                  <div key={location.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`mobile-location-${location.id}`}
                      name="mobileLocation"
                      value={location.id}
                      checked={selectedLocation === location.id}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`mobile-location-${location.id}`} className="ml-2 text-sm text-gray-700">
                      {location.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('price')}</h3>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0 QAR</span>
                  <span>{priceRange[1]} QAR</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => {
                  setSelectedType('');
                  setSelectedLocation('');
                  setPriceRange([0, 1000]);
                  fetchFacilities();
                  setShowFilters(false);
                }}
              >
                {t('resetFilters')}
              </Button>
              <Button
                size="sm"
                fullWidth
                onClick={() => setShowFilters(false)}
              >
                {t('applyFilters')}
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchFacilities')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <Button type="submit" className="ml-3">
                {t('search')}
              </Button>
            </form>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500 dark:text-gray-400">{t('loading')}</p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500 dark:text-gray-400">{t('noFacilitiesFound')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <div key={facility.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                  <Link href={`/facilities/${facility.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={facility.images[0] || '/placeholder-facility.jpg'}
                        alt={facility.name_en}
                        className="w-full h-full object-cover"
                      />
                      {facility.is_featured && (
                        <div className="absolute top-2 right-2 bg-yellow-400 dark:bg-yellow-500 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                          <FiStar className="mr-1" />
                          {t('featured')}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold dark:text-white">{language === 'en' ? facility.name_en : facility.name_ar}</h3>
                        <div className="flex items-center text-yellow-500">
                          <FiStar className="fill-current" />
                          <span className="ml-1 text-gray-700 dark:text-gray-300">{facility.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center">
                        <FiMapPin className="mr-1" />
                        {language === 'en' ? facility.address_en : facility.address_ar}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center">
                        <FiClock className="mr-1" />
                        {t('openingHours')}: {facility.opening_hours.weekdays}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {facility.price_per_hour} {facility.currency}/{t('hour')}
                        </span>
                        <Button size="sm">{t('book')}</Button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
