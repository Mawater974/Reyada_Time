'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiX, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Booking, Facility } from '@/types';
import Button from '@/components/ui/Button';

export default function BookingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [bookings, setBookings] = useState<(Booking & { facility: Facility })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }
    
    fetchBookings();
  }, [user, activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    
    try {
      // In a real app, we would fetch bookings from Supabase
      // For now, let's create some mock bookings
      const mockFacilities: Facility[] = [
        {
          id: '1',
          name_en: 'Al Sadd Sports Club',
          name_ar: 'نادي السد الرياضي',
          owner_id: 'owner1',
          description_en: 'Professional football stadium with high-quality grass pitch.',
          description_ar: 'ملعب كرة قدم احترافي مع أرضية عشبية عالية الجودة.',
          images: ['/facilities/facility1.jpg'],
          facility_type: 'football',
          address_en: 'Al Sadd, Doha',
          address_ar: 'السد، الدوحة',
          country_id: 1,
          city_id: 1,
          location: { latitude: 25.2632, longitude: 51.4419 },
          opening_hours: { weekdays: '8:00-22:00', weekends: '8:00-23:00' },
          rating: 4.8,
          review_count: 124,
          amenities_en: ['Parking', 'Changing Rooms', 'Showers'],
          amenities_ar: ['مواقف سيارات', 'غرف تغيير ملابس', 'حمامات'],
          verification_status: 'verified',
          is_active: true,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          price_per_hour: 250,
          currency: 'QAR',
          capacity: 22,
          is_featured: true,
          featured_until: '2025-12-31',
          featured_priority: 1,
        },
        {
          id: '2',
          name_en: 'Aspire Zone',
          name_ar: 'اسباير زون',
          owner_id: 'owner2',
          description_en: 'World-class basketball courts with professional equipment.',
          description_ar: 'ملاعب كرة سلة عالمية المستوى مع معدات احترافية.',
          images: ['/facilities/facility2.jpg'],
          facility_type: 'basketball',
          address_en: 'Aspire Zone, Doha',
          address_ar: 'اسباير زون، الدوحة',
          country_id: 1,
          city_id: 1,
          location: { latitude: 25.2747, longitude: 51.4416 },
          opening_hours: { weekdays: '9:00-21:00', weekends: '9:00-22:00' },
          rating: 4.7,
          review_count: 98,
          amenities_en: ['Parking', 'Changing Rooms', 'Cafeteria'],
          amenities_ar: ['مواقف سيارات', 'غرف تغيير ملابس', 'كافتيريا'],
          verification_status: 'verified',
          is_active: true,
          created_at: '2023-02-01',
          updated_at: '2023-02-01',
          price_per_hour: 180,
          currency: 'QAR',
          capacity: 10,
          is_featured: true,
          featured_until: '2025-12-31',
          featured_priority: 2,
        },
      ];
      
      const today = new Date();
      
      // Create mock bookings
      const mockBookings: (Booking & { facility: Facility })[] = [
        {
          id: '1',
          user_id: user?.id || '',
          facility_id: '1',
          facility: mockFacilities[0],
          booking_date: new Date(today.getTime() + 86400000).toISOString().split('T')[0], // Tomorrow
          time_slot: '18:00',
          duration_minutes: 60,
          number_of_players: 10,
          total_price: 250,
          status: 'confirmed',
          payment_status: 'completed',
          payment_method: 'credit_card',
          payment_id: 'pay_123456',
          booking_details: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: user?.id || '',
          facility_id: '2',
          facility: mockFacilities[1],
          booking_date: new Date(today.getTime() + 172800000).toISOString().split('T')[0], // Day after tomorrow
          time_slot: '19:00',
          duration_minutes: 120,
          number_of_players: 6,
          total_price: 360,
          status: 'pending',
          payment_status: 'pending',
          booking_details: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          user_id: user?.id || '',
          facility_id: '1',
          facility: mockFacilities[0],
          booking_date: new Date(today.getTime() - 86400000).toISOString().split('T')[0], // Yesterday
          time_slot: '17:00',
          duration_minutes: 90,
          number_of_players: 12,
          total_price: 375,
          status: 'completed',
          payment_status: 'completed',
          payment_method: 'credit_card',
          payment_id: 'pay_123457',
          booking_details: {},
          created_at: new Date(today.getTime() - 604800000).toISOString(), // 7 days ago
          updated_at: new Date(today.getTime() - 604800000).toISOString(),
        },
      ];
      
      // Filter bookings based on active tab
      const filteredBookings = mockBookings.filter(booking => {
        const bookingDate = new Date(booking.booking_date);
        const isUpcoming = bookingDate >= today;
        return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
      });
      
      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    // In a real app, we would update the booking status in Supabase
    // For now, let's just update the local state
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled_by_user' } 
          : booking
      )
    );
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('myBookings')}</h1>
        <div className="flex space-x-2">
          <button
            className={`py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'upcoming'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            {t('upcomingBookings')}
          </button>
          <button
            className={`py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'past'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('past')}
          >
            {t('pastBookings')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <img 
            src="/illustrations/no-bookings.svg" 
            alt="No Bookings" 
            className="mx-auto mb-6 w-64 h-64"
          />
          <p className="text-xl text-gray-600 dark:text-gray-400">{t('noBookingsFound')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((currentBooking) => (
            <div 
              key={currentBooking.id} 
              className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl group"
            >
              <div className="relative">
                <img 
                  src={currentBooking.facility.images[0]} 
                  alt={currentBooking.facility.name_en} 
                  className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute top-4 right-4">
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${currentBooking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : currentBooking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {currentBooking.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentBooking.facility.name_en}
                  </h2>
                </div>
                <div className="space-y-3 text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center">
                    <FiCalendar className="mr-3 text-blue-500 text-lg" />
                    <span className="font-medium">{currentBooking.booking_date}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-3 text-green-500 text-lg" />
                    <span className="font-medium">{currentBooking.time_slot} ({currentBooking.duration_minutes} mins)</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-3 text-purple-500 text-lg" />
                    <span className="font-medium">{currentBooking.number_of_players} players</span>
                  </div>
                  <div className="flex items-center font-bold text-gray-800 dark:text-white text-lg">
                    <span>{currentBooking.total_price} QAR</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {currentBooking.status === 'confirmed' && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCancelBooking(currentBooking.id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
