// This file serves as a bridge between client and server Supabase usage
// It provides mock data for development to avoid Supabase connection issues

// Define mock data types to match our database schema
export type Facility = {
  id: string;
  name_en: string;
  name_ar: string;
  owner_id: string;
  description_en: string;
  description_ar: string;
  images: string[];
  facility_type: string;
  address_en: string;
  address_ar: string;
  country_id: number;
  city_id: number;
  location: { latitude: number; longitude: number };
  opening_hours: { weekdays: string; weekends: string };
  rating: number;
  review_count: number;
  amenities_en: string[];
  amenities_ar: string[];
  verification_status: 'pending' | 'verified' | 'rejected';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  price_per_hour: number;
  currency: string;
  capacity: number;
  is_featured: boolean;
  featured_until: string | null;
  featured_priority: number | null;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

// Mock data for development
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
  {
    id: '3',
    name_en: 'Padel In',
    name_ar: 'بادل إن',
    owner_id: 'owner3',
    description_en: 'Premium padel courts with professional glass walls.',
    description_ar: 'ملاعب بادل متميزة مع جدران زجاجية احترافية.',
    images: ['/facilities/facility3.jpg'],
    facility_type: 'padel',
    address_en: 'Lusail, Doha',
    address_ar: 'لوسيل، الدوحة',
    country_id: 1,
    city_id: 2,
    location: { latitude: 25.4107, longitude: 51.4783 },
    opening_hours: { weekdays: '10:00-23:00', weekends: '10:00-24:00' },
    rating: 4.9,
    review_count: 76,
    amenities_en: ['Parking', 'Changing Rooms', 'Equipment Rental'],
    amenities_ar: ['مواقف سيارات', 'غرف تغيير ملابس', 'تأجير معدات'],
    verification_status: 'verified',
    is_active: true,
    created_at: '2023-03-01',
    updated_at: '2023-03-01',
    price_per_hour: 150,
    currency: 'QAR',
    capacity: 4,
    is_featured: true,
    featured_until: '2025-12-31',
    featured_priority: 3,
  },
];

// Mock Supabase client that returns mock data
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => {
          if (table === 'facilities') {
            return Promise.resolve({
              data: mockFacilities.find(facility => facility.id === value) || null,
              error: null
            });
          }
          return Promise.resolve({ data: null, error: null });
        },
        // For non-single queries
        then: (callback: Function) => {
          if (table === 'facilities') {
            const filteredFacilities = column ? 
              mockFacilities.filter(facility => (facility as any)[column] === value) : 
              mockFacilities;
            callback({ data: filteredFacilities, error: null });
          } else {
            callback({ data: [], error: null });
          }
        }
      }),
      // For queries without eq
      then: (callback: Function) => {
        if (table === 'facilities') {
          callback({ data: mockFacilities, error: null });
        } else {
          callback({ data: [], error: null });
        }
      }
    })
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signIn: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: Function) => {
      // No-op for mock
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

// Export mock data for direct use
export { mockFacilities };
