export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      facilities: {
        Row: {
          id: string
          name_en: string
          name_ar: string
          owner_id: string
          description_en: string
          description_ar: string
          images: string[]
          facility_type: string
          address_en: string
          address_ar: string
          country_id: number
          city_id: number
          location: { latitude: number; longitude: number }
          opening_hours: { weekdays: string; weekends: string }
          rating: number
          review_count: number
          amenities_en: string[]
          amenities_ar: string[]
          verification_status: 'pending' | 'verified' | 'rejected'
          is_active: boolean
          created_at: string
          updated_at: string
          price_per_hour: number
          currency: string
          capacity: number
          is_featured: boolean
          featured_until: string | null
          featured_priority: number | null
        }
        Insert: {
          id?: string
          name_en: string
          name_ar: string
          owner_id: string
          description_en: string
          description_ar: string
          images: string[]
          facility_type: string
          address_en: string
          address_ar: string
          country_id: number
          city_id: number
          location: { latitude: number; longitude: number }
          opening_hours: { weekdays: string; weekends: string }
          rating?: number
          review_count?: number
          amenities_en: string[]
          amenities_ar: string[]
          verification_status?: 'pending' | 'verified' | 'rejected'
          is_active?: boolean
          created_at?: string
          updated_at?: string
          price_per_hour: number
          currency: string
          capacity: number
          is_featured?: boolean
          featured_until?: string | null
          featured_priority?: number | null
        }
        Update: {
          id?: string
          name_en?: string
          name_ar?: string
          owner_id?: string
          description_en?: string
          description_ar?: string
          images?: string[]
          facility_type?: string
          address_en?: string
          address_ar?: string
          country_id?: number
          city_id?: number
          location?: { latitude: number; longitude: number }
          opening_hours?: { weekdays: string; weekends: string }
          rating?: number
          review_count?: number
          amenities_en?: string[]
          amenities_ar?: string[]
          verification_status?: 'pending' | 'verified' | 'rejected'
          is_active?: boolean
          created_at?: string
          updated_at?: string
          price_per_hour?: number
          currency?: string
          capacity?: number
          is_featured?: boolean
          featured_until?: string | null
          featured_priority?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "facilities_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          phone_number?: string
          profile_image_url?: string
          country_id?: number
          city_id?: number
          role: 'user' | 'facility_owner' | 'admin' | 'super_admin'
          created_at: string
          last_login_at?: string
          is_active: boolean
          preferences?: Json
        }
        Insert: {
          id: string
          email: string
          name: string
          phone_number?: string
          profile_image_url?: string
          country_id?: number
          city_id?: number
          role?: 'user' | 'facility_owner' | 'admin' | 'super_admin'
          created_at?: string
          last_login_at?: string
          is_active?: boolean
          preferences?: Json
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone_number?: string
          profile_image_url?: string
          country_id?: number
          city_id?: number
          role?: 'user' | 'facility_owner' | 'admin' | 'super_admin'
          created_at?: string
          last_login_at?: string
          is_active?: boolean
          preferences?: Json
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          facility_id: string
          booking_date: string
          time_slot: string
          duration_minutes: number
          number_of_players: number
          total_price: number
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_user' | 'cancelled_by_facility'
          payment_status: 'pending' | 'completed' | 'refunded'
          payment_method?: string
          payment_id?: string
          promo_code?: string
          discount_amount?: number
          booking_details?: Json
          created_at: string
          updated_at: string
          cancelled_at?: string
          cancellation_reason?: string
        }
        Insert: {
          id?: string
          user_id: string
          facility_id: string
          booking_date: string
          time_slot: string
          duration_minutes: number
          number_of_players: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_user' | 'cancelled_by_facility'
          payment_status?: 'pending' | 'completed' | 'refunded'
          payment_method?: string
          payment_id?: string
          promo_code?: string
          discount_amount?: number
          booking_details?: Json
          created_at?: string
          updated_at?: string
          cancelled_at?: string
          cancellation_reason?: string
        }
        Update: {
          id?: string
          user_id?: string
          facility_id?: string
          booking_date?: string
          time_slot?: string
          duration_minutes?: number
          number_of_players?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled_by_user' | 'cancelled_by_facility'
          payment_status?: 'pending' | 'completed' | 'refunded'
          payment_method?: string
          payment_id?: string
          promo_code?: string
          discount_amount?: number
          booking_details?: Json
          created_at?: string
          updated_at?: string
          cancelled_at?: string
          cancellation_reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_facility_id_fkey"
            columns: ["facility_id"]
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
