'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { Booking, Facility } from '@/types';
import Button from '@/components/ui/Button';
import { FiCalendar, FiClock, FiUsers, FiMapPin, FiDollarSign, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const [booking, setBooking] = useState<(Booking & { facility: Facility }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    fetchBooking();
  }, [user, params.id]);

  const fetchBooking = async () => {
    try {
      // In a real app, fetch from Supabase
      // For now, using mock data
      const mockFacility: Facility = {
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
      };

      const mockBooking: Booking & { facility: Facility } = {
        id: params.id as string,
        user_id: user?.id || '',
        facility_id: '1',
        facility: mockFacility,
        booking_date: new Date().toISOString().split('T')[0],
        time_slot: '18:00',
        duration_minutes: 60,
        number_of_players: 10,
        total_price: 250,
        status: 'confirmed',
        payment_status: 'completed',
        payment_method: 'credit_card',
        payment_id: 'pay_123456',
        booking_details: {
          special_requests: 'Need extra balls',
          player_names: ['John', 'Mike', 'Sarah'],
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setBooking(mockBooking);
      setError(null);
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      // In a real app, update in Supabase
      setBooking(prev => prev ? { ...prev, status: 'cancelled_by_user' } : null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">{error || 'Booking not found'}</h2>
          <div className="mt-6">
            <Link href="/bookings">
              <Button>Back to Bookings</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg dark:bg-gray-800 border dark:border-gray-700 ${
        booking.status === 'confirmed' 
          ? 'bg-green-50 border border-green-200' 
          : booking.status === 'pending'
          ? 'bg-yellow-50 border border-yellow-200'
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center">
          {booking.status === 'confirmed' ? (
            <FiCheckCircle className="h-6 w-6 text-green-500 mr-3" />
          ) : (
            <FiAlertCircle className="h-6 w-6 text-yellow-500 mr-3" />
          )}
          <div>
            <h2 className="text-lg font-semibold">
              {booking.status === 'confirmed' && 'Booking Confirmed'}
              {booking.status === 'pending' && 'Booking Pending'}
              {booking.status === 'cancelled_by_user' && 'Booking Cancelled'}
            </h2>
            <p className="text-sm">
              {booking.status === 'confirmed' && 'Your booking has been confirmed. You\'re all set!'}
              {booking.status === 'pending' && 'Your booking is being processed.'}
              {booking.status === 'cancelled_by_user' && 'This booking has been cancelled.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden dark:border-gray-700 dark:border">
        {/* Facility Image */}
        <div className="relative h-64">
          <Image 
            src={booking.facility.images[0]} 
            alt={booking.facility.name_en}
            fill
            className="object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">{booking.facility.name_en}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-center">
                <FiCalendar className="mr-3 text-blue-500 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">{t('date')}</p>
                  <p className="font-medium">{booking.booking_date}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiClock className="mr-3 text-green-500 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">{t('time')}</p>
                  <p className="font-medium">{booking.time_slot} ({booking.duration_minutes} mins)</p>
                </div>
              </div>

              <div className="flex items-center">
                <FiUsers className="mr-3 text-purple-500 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">{t('players')}</p>
                  <p className="font-medium">{booking.number_of_players} players</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMapPin className="mr-3 text-red-500 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">{t('location')}</p>
                  <p className="font-medium">{language === 'en' ? booking.facility.address_en : booking.facility.address_ar}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FiDollarSign className="mr-3 text-yellow-500 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">{t('price')}</p>
                  <p className="font-medium">{booking.total_price} QAR</p>
                </div>
              </div>

              {booking.booking_details?.special_requests && (
                <div>
                  <p className="text-sm text-gray-500">{t('specialRequests')}</p>
                  <p className="font-medium">{booking.booking_details.special_requests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            {booking.status === 'confirmed' && (
              <Button 
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={handleCancelBooking}
              >
                {t('cancelBooking')}
              </Button>
            )}
            <Link href={`/facilities/${booking.facility_id}`} className="flex-1">
              <Button 
                variant="outline"
                size="sm"
                className="w-full"
              >
                {t('viewFacility')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
