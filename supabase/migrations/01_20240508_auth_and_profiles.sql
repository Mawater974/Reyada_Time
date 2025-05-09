-- Create enum for user roles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'facility_owner', 'admin', 'super_admin');
    END IF;
END $$;

-- Create countries table if it doesn't exist
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  code VARCHAR(2) NOT NULL UNIQUE,
  phone_code VARCHAR(5) NOT NULL,
  flag_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  country_id INTEGER REFERENCES countries(id),
  language VARCHAR(2) DEFAULT 'en',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  password VARCHAR(255)
);

-- Create a trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON profiles
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_countries_updated_at') THEN
        CREATE TRIGGER update_countries_updated_at
        BEFORE UPDATE ON countries
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Profiles are viewable by users who created them') THEN
        CREATE POLICY "Profiles are viewable by users who created them" ON profiles
        FOR SELECT USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profiles') THEN
        CREATE POLICY "Users can update their own profiles" ON profiles
        FOR UPDATE USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profiles') THEN
        CREATE POLICY "Users can insert their own profiles" ON profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  country_id_val INTEGER;
BEGIN
  -- Extract and validate country_id
  country_id_val := (new.raw_user_meta_data->>'country_id')::integer;
  
  -- Verify country exists
  IF NOT EXISTS (SELECT 1 FROM countries WHERE id = country_id_val) THEN
    RAISE EXCEPTION 'Invalid country_id: %', country_id_val;
  END IF;

  -- Insert into profiles with validated data
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    country_id,
    language,
    is_active,
    email_verified,
    phone_verified
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    'user'::user_role,
    country_id_val,
    COALESCE(new.raw_user_meta_data->>'language', 'en'),
    true,
    false,
    false
  );

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$ language 'plpgsql';

-- Create trigger for new user signup if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE PROCEDURE handle_new_user();
    END IF;
END $$;

-- Insert initial countries if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM countries LIMIT 1) THEN
        INSERT INTO countries (name_en, name_ar, code, phone_code, is_active) VALUES
('Qatar', 'قطر', 'QA', '+974', true),
('United Arab Emirates', 'الإمارات العربية المتحدة', 'AE', '+971', true),
('Saudi Arabia', 'المملكة العربية السعودية', 'SA', '+966', true),
('Kuwait', 'الكويت', 'KW', '+965', true),
('Bahrain', 'البحرين', 'BH', '+973', true),
('Oman', 'عمان', 'OM', '+963', true),
('Syria', 'سوريا', 'SY', '+963', true),
('Lebanon', 'لبنان', 'LB', '+961', true),
('Jordan', 'الأردن', 'JO', '+962', true),
('Iraq', 'العراق', 'IQ', '+964', true),
('Palestine', 'فلسطين', 'PS', '+970', true),
('Yemen', 'اليمن', 'YE', '+967', true),
('Tunisia', 'تونس', 'TN', '+216', true),
('Algeria', 'الجزائر', 'DZ', '+213', true),
('Libya', 'ليبيا', 'LY', '+218', true),
('Morocco', 'المغرب', 'MA', '+212', true),
('Mauritania', 'موريتانيا', 'MR', '+222', true),
('Sudan', 'السودان', 'SD', '+249', true),
('Somalia', 'الصومال', 'SO', '+252', true),
('Djibouti', 'جيبوتي', 'DJ', '+253', true),
('Comoros', 'جزر القمر', 'KM', '+269', true),
('Egypt', 'مصر', 'EG', '+20', true);
    END IF;
END $$;

-- Grant permissions if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE grantee = 'authenticated' AND table_name = 'countries') THEN
        GRANT ALL ON countries TO authenticated;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE grantee = 'authenticated' AND table_name = 'profiles') THEN
        GRANT ALL ON profiles TO authenticated;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.role_usage_grants WHERE grantee = 'authenticated' AND object_name = 'countries_id_seq') THEN
        GRANT USAGE ON SEQUENCE countries_id_seq TO authenticated;
    END IF;
END $$;
