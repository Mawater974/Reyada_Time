-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS facility_reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create facilities table
CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  country_id INTEGER REFERENCES countries(id) ON DELETE RESTRICT,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT,
  postal_code TEXT,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  social_media JSONB DEFAULT '{"facebook": null, "instagram": null, "twitter": null}'::jsonb,
  price_per_hour DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  capacity INTEGER,
  sport_type TEXT NOT NULL,
  sport_types TEXT[] DEFAULT '{}',  -- Additional sports supported
  facilities JSONB DEFAULT '[]',     -- e.g., parking, cafe, etc.
  amenities JSONB DEFAULT '[]',      -- e.g., lockers, showers, etc.
  equipment JSONB DEFAULT '[]',      -- e.g., balls, rackets, etc.
  rules JSONB DEFAULT '[]',
  cancellation_policy TEXT,
  booking_notice INTEGER DEFAULT 0,   -- Hours notice required for booking
  min_booking_duration INTEGER DEFAULT 1,  -- Minimum hours per booking
  max_booking_duration INTEGER DEFAULT 24, -- Maximum hours per booking
  images TEXT[] DEFAULT '{}',
  main_image TEXT NOT NULL,
  opening_hours JSONB NOT NULL,
  special_hours JSONB DEFAULT '[]',   -- For holidays, Ramadan, etc.
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_facilities_country_id ON facilities(country_id);
CREATE INDEX idx_facilities_sport_type ON facilities(sport_type);
CREATE INDEX idx_facilities_status ON facilities(status);
CREATE INDEX idx_facilities_location ON facilities(latitude, longitude);

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON facilities
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable RLS
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active facilities"
  ON facilities FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can do everything"
  ON facilities
  USING (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE auth.jwt() ->> 'role' IN ('admin', 'super_admin')
  ));

-- Create types for TypeScript
COMMENT ON TABLE facilities IS E'@typegen
type Facility = {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  country_id: number;
  city: string;
  address: string;
  district: string | null;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  social_media: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
  };
  price_per_hour: number;
  currency: string;
  capacity: number | null;
  sport_type: string;
  sport_types: string[];
  facilities: string[];
  amenities: string[];
  equipment: string[];
  rules: string[];
  cancellation_policy: string | null;
  booking_notice: number;
  min_booking_duration: number;
  max_booking_duration: number;
  images: string[];
  main_image: string;
  opening_hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  special_hours: {
    date: string;
    open: string;
    close: string;
  }[];
  status: "active" | "maintenance" | "inactive";
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}';
