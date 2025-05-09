'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiStar, FiMapPin, FiClock, FiUsers, FiCalendar, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase, Facility, mockFacilities } from '@/lib/supabase';
import Button from '@/components/ui/Button';

export default function FacilityDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedSportType, setSelectedSportType] = useState<string>('');
  const sportTypes = ['Football', 'Basketball', 'Padel', 'Tennis', 'Volleyball', 'Gym', 'Swimming'];

  useEffect(() => {
    fetchFacility();
    
    // Set default selected date to today
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, [id]);

  useEffect(() => {
    if (facility) {
      // Generate available time slots based on opening hours
      // In a real app, this would check against existing bookings
      generateTimeSlots();
      
      // Calculate total price
      calculateTotalPrice();
    }
  }, [facility, selectedDate, selectedTimeSlot, duration, playerCount]);

  const fetchFacility = async () => {
    setLoading(true);
    
    try {
      // Simulate a delay to mimic a real API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the facility in our mock data
      const facilityId = id as string;
      const foundFacility = mockFacilities.find(f => f.id === facilityId);
      
      // If we don't find the exact facility by ID, just use the first one from our mock data
      // In a real app, we would handle this differently (e.g., show a 404 page)
      const mockFacility = foundFacility || mockFacilities[0];
      
      // Add some extra images for the detail view
      const facilityWithExtraImages = {
        ...mockFacility,
        images: [
          ...mockFacility.images,
          '/facilities/facility1-2.jpg', 
          '/facilities/facility1-3.jpg'
        ],
        // Add more detailed amenities for the detail view
        amenities_en: [
          ...mockFacility.amenities_en,
          'Equipment Rental',
          'Cafeteria', 
          'WiFi'
        ],
        amenities_ar: [
          ...mockFacility.amenities_ar,
          'تأجير معدات',
          'كافتيريا', 
          'واي فاي'
        ],
        // Add a more detailed description
        description_en: mockFacility.description_en + ' Our facility offers a full-size field with professional lighting for night games. Changing rooms with showers and lockers are available for all players. The facility is perfect for friendly matches, team training, or tournaments.',
        description_ar: mockFacility.description_ar + ' توفر منشأتنا ملعب كامل الحجم مع إضاءة احترافية للمباريات الليلية. غرف تغيير ملابس مع دشات وخزائن متاحة لجميع اللاعبين. المنشأة مثالية للمباريات الودية أو تدريب الفريق أو البطولات.'
      };
      
      setFacility(facilityWithExtraImages);
    } catch (error) {
      console.error('Error fetching facility:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    // In a real app, this would check against existing bookings
    // For now, let's generate time slots from 8 AM to 10 PM
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push(`${hour}:00`);
    }
    setAvailableTimeSlots(slots);
    
    // Set default time slot if none selected
    if (!selectedTimeSlot && slots.length > 0) {
      setSelectedTimeSlot(slots[0]);
    }
  };

  const calculateTotalPrice = () => {
    if (facility) {
      setTotalPrice(facility.price_per_hour * duration);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      // Redirect to login page if user is not logged in
      router.push('/login');
      return;
    }
    
    if (!facility || !selectedDate || !selectedTimeSlot) {
      return;
    }
    
    try {
      // In a real app, we would create a booking in Supabase
      // For now, let's just log the booking details
      console.log('Booking details:', {
        facility_id: facility.id,
        user_id: user.id,
        date: selectedDate,
        time_slot: selectedTimeSlot,
        duration,
        player_count: playerCount,
        sport_type: selectedSportType,
        total_price: totalPrice,
      });
      
      // Redirect to a booking confirmation page
      router.push(`/bookings/confirmation?facility=${facility.id}&date=${selectedDate}&time=${selectedTimeSlot}&duration=${duration}&players=${playerCount}&sport=${selectedSportType}`);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 dark:bg-gray-900 dark:text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('facilityNotFound')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t('facilityNotFoundDesc')}</p>
          <Link href="/facilities">
            <Button>{t('backToFacilities')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 dark:text-white">
      {/* Back Button */}
      <Link href="/facilities" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6">
        <FiArrowLeft className="mr-2" /> {t('backToFacilities')}
      </Link>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Facility Details */}
        <div className="lg:w-2/3">
          {/* Facility Images */}
          <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg mb-6 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-300 text-lg">Image Placeholder</span>
          </div>
          
          {/* Facility Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{facility.name_en}</h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center mr-4">
                <FiStar className="text-yellow-400 mr-1" />
                <span>{facility.rating} ({facility.review_count} {t('reviews')})</span>
              </div>
              <div className="flex items-center mr-4">
                <FiMapPin className="mr-1" />
                <span>{facility.address_en}</span>
              </div>
              <div className="flex items-center">
                <FiUsers className="mr-1" />
                <span>{t('capacity')}: {facility.capacity}</span>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{facility.description_en}</p>
            
            {/* Amenities */}
            <h2 className="text-xl font-semibold mb-3">{t('amenities')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              {facility.amenities_en.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <FiCheck className="text-green-500 mr-2" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
            
            {/* Opening Hours */}
            <h2 className="text-xl font-semibold mb-3">{t('openingHours')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              <div className="flex items-center">
                <FiClock className="text-gray-500 mr-2" />
                <span>{t('weekdays')}: {typeof facility.opening_hours === 'object' ? facility.opening_hours.weekdays : ''}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="text-gray-500 mr-2" />
                <span>{t('weekends')}: {typeof facility.opening_hours === 'object' ? facility.opening_hours.weekends : ''}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('bookThisFacility')}</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('sportType')}</label>
                  <select 
                    value={selectedSportType} 
                    onChange={(e) => setSelectedSportType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">{t('selectSportType')}</option>
                    {sportTypes.map((sport) => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>
              </div>
            
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('selectDate')}
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('selectTime')}
              </label>
              <select
                id="time"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('duration')} ({t('hours')})
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {[1, 2, 3, 4].map((hours) => (
                  <option key={hours} value={hours}>
                    {hours} {hours === 1 ? t('hour') : t('hours')}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="players" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('numberOfPlayers')}
              </label>
              <select
                id="players"
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Array.from({ length: facility.capacity }, (_, i) => i + 1).map((count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? t('player') : t('players')}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <span className="font-medium">{t('totalPrice')}</span>
              <span className="text-xl font-bold">{totalPrice} {facility.currency}</span>
            </div>
            
            <Button
              fullWidth
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTimeSlot}
            >
              {t('bookNow')}
            </Button>
            
            {!user && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {t('loginToBook')} <Link href="/login" className="text-blue-600 hover:underline">{t('login')}</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
