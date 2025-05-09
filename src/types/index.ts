export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone_number?: string;
  profile_image_url?: string;
  country_id?: number;
  city_id?: number;
  role: 'user' | 'facility_owner' | 'admin' | 'super_admin';
  created_at: string;
  last_login_at?: string;
  is_active: boolean;
  preferences?: any;
}

export interface Facility {
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
  location: {
    latitude: number;
    longitude: number;
  };
  opening_hours: any;
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
}

export interface Booking {
  id: string;
  user_id: string;
  facility_id: string;
  booking_date: string;
  time_slot: string;
  duration_minutes: number;
  number_of_players: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_user' | 'cancelled_by_facility';
  payment_status: 'pending' | 'completed' | 'refunded';
  payment_method?: string;
  payment_id?: string;
  promo_code?: string;
  discount_amount?: number;
  booking_details?: any;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  facility_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: number;
  name_en: string;
  name_ar: string;
  code: string;
  flag_url?: string;
  is_active: boolean;
}

export interface City {
  id: number;
  country_id: number;
  name_en: string;
  name_ar: string;
  is_active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  user_id?: string;
  country_id?: number;
  status: 'read' | 'unread';
  created_at: string;
  updated_at: string;
}
