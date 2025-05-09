-- Drop existing objects if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create or replace the function with improved error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  country_id_val INTEGER;
  first_name_val TEXT;
  last_name_val TEXT;
  role_val public.user_role;
  language_val TEXT;
  is_active_val BOOLEAN;
  email_verified_val BOOLEAN;
  phone_verified_val BOOLEAN;
BEGIN
  -- Log the incoming data for debugging
  RAISE LOG 'New user data: id=%, email=%, metadata=%', new.id, new.email, new.raw_user_meta_data;
  
  -- Extract and validate first_name
  first_name_val := COALESCE(new.raw_user_meta_data->>'first_name', '');
  IF first_name_val = '' THEN
    RAISE LOG 'First name is empty, using default';
    first_name_val := 'User';
  END IF;

  -- Extract and validate last_name
  last_name_val := COALESCE(new.raw_user_meta_data->>'last_name', '');
  IF last_name_val = '' THEN
    RAISE LOG 'Last name is empty, using default';
    last_name_val := new.id::text;
  END IF;

  -- Extract and validate other fields
  role_val := COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role);
  language_val := COALESCE(new.raw_user_meta_data->>'language', 'en');
  is_active_val := COALESCE((new.raw_user_meta_data->>'is_active')::boolean, true);
  email_verified_val := COALESCE((new.raw_user_meta_data->>'email_verified')::boolean, false);
  phone_verified_val := COALESCE((new.raw_user_meta_data->>'phone_verified')::boolean, false);

  -- Extract and validate country_id
  BEGIN
    country_id_val := COALESCE((new.raw_user_meta_data->>'country_id')::integer, 1);
    -- Verify country exists
    IF NOT EXISTS (SELECT 1 FROM countries WHERE id = country_id_val) THEN
      RAISE LOG 'Invalid country_id: %. Using default.', country_id_val;
      country_id_val := 1;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error parsing country_id: %. Using default.', SQLERRM;
    country_id_val := 1;
  END;

  -- Insert profile with validated data
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    country_id,
    language,
    is_active,
    email_verified,
    phone_verified,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    new.email,
    first_name_val,
    last_name_val,
    role_val,
    country_id_val,
    language_val,
    is_active_val,
    email_verified_val,
    phone_verified_val,
    now(),
    now()
  );

  -- Log successful profile creation
  RAISE LOG 'Profile created successfully for user %', new.id;
  
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log any errors that occur
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create the trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
